from pathlib import Path
from statistics import median

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / ".qa" / "wizy-v2" / "calm-idle-alpha.png"
OUTPUT = ROOT / "public" / "assets" / "wizy-v2" / "calm-idle"
FRAME_COUNT = 12
COLS = 6
ROWS = 2
CANVAS = (560, 540)
TARGET_HEIGHT = 430


def alpha_bbox(image: Image.Image):
    return image.getchannel("A").getbbox()


def main():
    board = Image.open(SOURCE).convert("RGBA")
    OUTPUT.mkdir(parents=True, exist_ok=True)
    cells = []
    for index in range(FRAME_COUNT):
        col, row = index % COLS, index // COLS
        left = round(col * board.width / COLS)
        right = round((col + 1) * board.width / COLS)
        top = round(row * board.height / ROWS)
        bottom = round((row + 1) * board.height / ROWS)
        cell = board.crop((left, top, right, bottom))
        box = alpha_bbox(cell)
        if not box:
            raise RuntimeError(f"Frame {index + 1} has no visible character")
        cells.append(cell.crop(box))

    # One canonical scale, center, and baseline prevents generated size popping.
    heights = [image.height for image in cells]
    scale = TARGET_HEIGHT / median(heights)
    registered = []
    for image in cells:
        resized = image.resize(
            (round(image.width * scale), round(image.height * scale)),
            Image.Resampling.LANCZOS,
        )
        canvas = Image.new("RGBA", CANVAS, (0, 0, 0, 0))
        x = (CANVAS[0] - resized.width) // 2
        y = 512 - resized.height
        canvas.alpha_composite(resized, (x, y))
        registered.append(canvas)

    for index, frame in enumerate(registered, start=1):
        frame.save(OUTPUT / f"{index:02d}.png", "PNG", optimize=True)

    durations = [900, 180, 180, 180, 240, 320, 240, 180, 180, 180, 240, 1400]
    registered[0].save(
        ROOT / ".qa" / "wizy-v2" / "calm-idle-test.webp",
        "WEBP",
        save_all=True,
        append_images=registered[1:],
        duration=durations,
        loop=0,
        lossless=True,
        method=6,
    )
    print(f"Built {FRAME_COUNT} registered calm-idle frames")


if __name__ == "__main__":
    main()
