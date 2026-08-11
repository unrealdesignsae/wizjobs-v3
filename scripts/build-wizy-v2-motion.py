from pathlib import Path
from statistics import median
from collections import deque

import numpy as np
from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
QA = ROOT / ".qa" / "wizy-v2"
OUTPUT = ROOT / "public" / "assets" / "wizy-v2"
CLIPS = {
    "think-lightbulb": QA / "think-lightbulb-alpha.png",
    "computer-search": QA / "computer-search-alpha.png",
    "job-match": QA / "job-match-alpha.png",
}
COLS, ROWS = 6, 2
FRAME_COUNT = 12
CANVAS = (560, 540)
TARGET_HEIGHT = 430
BASELINE = 512


def largest_component_bbox(image: Image.Image):
    alpha = np.array(image.getchannel("A"))
    visible = alpha > 24
    visited = np.zeros_like(visible, dtype=bool)
    best = []
    height, width = visible.shape
    for start_y, start_x in zip(*np.where(visible & ~visited)):
        if visited[start_y, start_x]:
            continue
        queue = deque([(int(start_y), int(start_x))])
        visited[start_y, start_x] = True
        component = []
        while queue:
            y, x = queue.popleft()
            component.append((y, x))
            for dy in (-1, 0, 1):
                for dx in (-1, 0, 1):
                    if not (dx or dy):
                        continue
                    ny, nx = y + dy, x + dx
                    if 0 <= ny < height and 0 <= nx < width and visible[ny, nx] and not visited[ny, nx]:
                        visited[ny, nx] = True
                        queue.append((ny, nx))
        if len(component) > len(best):
            best = component
    if not best:
        raise RuntimeError("No visible character component")
    ys = np.array([point[0] for point in best])
    xs = np.array([point[1] for point in best])
    x, y, right, bottom = int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1
    lower_xs = xs[ys >= y + int((bottom - y) * 0.62)]
    foot_center = float(np.median(lower_xs)) if lower_xs.size else (x + right) / 2
    return (x, y, right, bottom), foot_center


def remove_small_lower_strays(image: Image.Image):
    alpha = np.array(image.getchannel("A"))
    visible = alpha > 24
    visited = np.zeros_like(visible, dtype=bool)
    height, width = visible.shape
    for start_y, start_x in zip(*np.where(visible & ~visited)):
        if visited[start_y, start_x]:
            continue
        queue = deque([(int(start_y), int(start_x))])
        visited[start_y, start_x] = True
        component = []
        while queue:
            y, x = queue.popleft()
            component.append((y, x))
            for dy in (-1, 0, 1):
                for dx in (-1, 0, 1):
                    if not (dx or dy):
                        continue
                    ny, nx = y + dy, x + dx
                    if 0 <= ny < height and 0 <= nx < width and visible[ny, nx] and not visited[ny, nx]:
                        visited[ny, nx] = True
                        queue.append((ny, nx))
        if len(component) < 1500 and sum(y for y, _ in component) / len(component) > height * 0.58:
            for y, x in component:
                alpha[y, x] = 0
    cleaned = image.copy()
    cleaned.putalpha(Image.fromarray(alpha))
    return cleaned


def split_board(board: Image.Image):
    frames = []
    horizontal_recovery = 24
    for index in range(FRAME_COUNT):
        col, row = index % COLS, index // COLS
        frames.append(board.crop((
            max(0, round(col * board.width / COLS) - horizontal_recovery),
            round(row * board.height / ROWS),
            min(board.width, round((col + 1) * board.width / COLS) + horizontal_recovery),
            round((row + 1) * board.height / ROWS),
        )))
    return frames


def build_clip(name: str, source: Path):
    frames = split_board(Image.open(source).convert("RGBA"))
    measurements = [largest_component_bbox(frame) for frame in frames]
    heights = [box[3] - box[1] for box, _ in measurements]
    scale = TARGET_HEIGHT / median(heights)
    destination = OUTPUT / name
    destination.mkdir(parents=True, exist_ok=True)

    for index, (frame, (box, foot_center)) in enumerate(zip(frames, measurements), start=1):
        resized = frame.resize((round(frame.width * scale), round(frame.height * scale)), Image.Resampling.LANCZOS)
        canvas = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
        scaled_center = foot_center * scale
        scaled_baseline = box[3] * scale
        x = round(CANVAS[0] / 2 - scaled_center)
        y = round(BASELINE - scaled_baseline)
        canvas.alpha_composite(resized, (x, y))
        if name == "think-lightbulb":
            canvas = remove_small_lower_strays(canvas)
        canvas.save(destination / f"{index:02d}.png", "PNG", optimize=True)

    print(f"Built {name}: {FRAME_COUNT} frames, shared scale {scale:.4f}")


def main():
    for name, source in CLIPS.items():
        build_clip(name, source)


if __name__ == "__main__":
    main()
