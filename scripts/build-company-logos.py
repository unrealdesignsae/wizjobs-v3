from pathlib import Path

from PIL import Image


ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / ".qa" / "company-logos-board.png"
OUTPUT = ROOT / "public" / "assets" / "job-people"
BLUE = (69, 95, 246)


def flatten_brand_color(cell: Image.Image):
    result = Image.new("RGB", cell.size, "white")
    source = cell.convert("RGB")
    output = result.load()
    pixels = source.load()
    for y in range(cell.height):
        for x in range(cell.width):
            r, g, b = pixels[x, y]
            distance = 255 - min(r, g, b)
            if distance <= 20:
                output[x, y] = (255, 255, 255)
            elif distance >= 46:
                output[x, y] = BLUE
            else:
                amount = (distance - 20) / 26
                output[x, y] = tuple(round(255 + (channel - 255) * amount) for channel in BLUE)
    return result


def main():
    board = Image.open(SOURCE)
    OUTPUT.mkdir(parents=True, exist_ok=True)
    for index in range(6):
        col, row = index % 3, index // 3
        cell = board.crop((col * board.width // 3, row * board.height // 2, (col + 1) * board.width // 3, (row + 1) * board.height // 2))
        flatten_brand_color(cell).resize((256, 256), Image.Resampling.LANCZOS).save(OUTPUT / f"{index + 1:02d}.jpg", quality=94, optimize=True)
    print("Built six flat-color company logo thumbnails")


if __name__ == "__main__":
    main()
