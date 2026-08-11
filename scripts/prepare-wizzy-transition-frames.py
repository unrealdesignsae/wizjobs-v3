from pathlib import Path
from PIL import Image, ImageFilter


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / "public" / "assets" / "wizzy" / "transition-boards"
OUTPUT = ROOT / "public" / "assets" / "wizzy" / "transition-frames"


def remove_green(frame):
    rgba = frame.convert("RGBA")
    pixels = rgba.load()
    alpha = Image.new("L", rgba.size, 255)
    mask = alpha.load()
    width, height = rgba.size
    for y in range(height):
        for x in range(width):
            r, g, b, _ = pixels[x, y]
            green_strength = g - max(r, b)
            if g > 115 and green_strength > 24:
                mask[x, y] = 0
            elif g > 105 and green_strength > 12:
                mask[x, y] = max(0, 255 - int((green_strength - 12) * 20))
                # Remove green fringe from antialiased edge pixels.
                pixels[x, y] = (r, min(g, max(r, b) + 8), b, 255)
    alpha = alpha.filter(ImageFilter.GaussianBlur(0.45))
    rgba.putalpha(alpha)
    return rgba


def main():
    OUTPUT.mkdir(parents=True, exist_ok=True)
    output_index = 1
    for board_index in range(1, 4):
        board = Image.open(SOURCE / f"transition-{board_index}.png").convert("RGB")
        width, height = board.size
        for cell in range(6):
            left = round(cell * width / 6)
            right = round((cell + 1) * width / 6)
            frame = board.crop((left, 0, right, height))
            frame = remove_green(frame)
            frame.save(OUTPUT / f"frame-{output_index:02}.png", "PNG", optimize=True)
            output_index += 1


if __name__ == "__main__":
    main()
