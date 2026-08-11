from pathlib import Path
from collections import deque
from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public" / "assets" / "wizzy" / "interview-coach-board.png"
OUTPUT = ROOT / "public" / "assets" / "wizzy" / "frames"


def main():
    image = Image.open(SOURCE).convert("RGB")
    width, height = image.size
    frame_width, frame_height = width // 3, height // 2
    OUTPUT.mkdir(parents=True, exist_ok=True)

    for index in range(6):
        column, row = index % 3, index // 3
        left = column * frame_width
        top = row * frame_height
        frame = image.crop((left, top, left + frame_width, top + frame_height)).convert("RGBA")
        pixels = frame.load()
        background = bytearray(frame_width * frame_height)
        queue = deque()

        def add(x, y):
            offset = y * frame_width + x
            if background[offset]:
                return
            r, g, b, _ = pixels[x, y]
            # The generated board uses a connected icy-blue background. The
            # robot's white shell is protected by its dark blue outline.
            if b >= 220 and g >= 205 and b - r >= 7 and b - g >= 2:
                background[offset] = 1
                queue.append((x, y))

        for x in range(frame_width):
            add(x, 0)
            add(x, frame_height - 1)
        for y in range(frame_height):
            add(0, y)
            add(frame_width - 1, y)

        while queue:
            x, y = queue.popleft()
            if x:
                add(x - 1, y)
            if x + 1 < frame_width:
                add(x + 1, y)
            if y:
                add(x, y - 1)
            if y + 1 < frame_height:
                add(x, y + 1)

        alpha = Image.new("L", (frame_width, frame_height), 255)
        alpha_pixels = alpha.load()
        for y in range(frame_height):
            for x in range(frame_width):
                if background[y * frame_width + x]:
                    alpha_pixels[x, y] = 0
        alpha = alpha.filter(ImageFilter.GaussianBlur(0.65))
        frame.putalpha(alpha)
        frame.save(OUTPUT / f"coach-{index + 1}.png", "PNG", optimize=True)


if __name__ == "__main__":
    main()
