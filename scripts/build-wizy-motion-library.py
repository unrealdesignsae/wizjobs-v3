from pathlib import Path
from PIL import Image
import json
from statistics import median


ROOT = Path(__file__).resolve().parents[1]
BOARDS = ROOT / "public" / "assets" / "wizy" / "motion-boards" / "alpha"
FRAMES = ROOT / "public" / "assets" / "wizy" / "clips"

CLIPS = [
    ("idle-breathe", "01-idle-breathe.png", True, 10),
    ("idle-glance", "02-idle-glance.png", False, 10),
    ("idle-shift", "03-idle-shift.png", True, 10),
    ("greet-pop", "04-greet-pop.png", False, 12),
    ("greet-wave", "05-greet-wave.png", False, 12),
    ("listen-lean", "06-listen-lean.png", False, 10),
    ("listen-tilt", "07-listen-tilt.png", True, 10),
    ("think-idea", "08-think-idea.png", True, 10),
    ("coach-explain", "09-coach-explain.png", False, 12),
    ("coach-point", "10-coach-point.png", False, 12),
    ("coach-thumb", "11-coach-thumb.png", False, 12),
    ("celebrate-clap", "12-celebrate-clap.png", False, 12),
    ("celebrate-hop", "13-celebrate-hop.png", False, 12),
    ("playful-tap", "14-playful-tap.png", False, 10),
    ("playful-stumble", "15-playful-stumble.png", False, 12),
]


def main():
    manifest = {}
    for name, source, loop, fps in CLIPS:
        board = Image.open(BOARDS / source).convert("RGBA")
        width, height = board.size
        destination = FRAMES / name
        destination.mkdir(parents=True, exist_ok=True)

        # Generated boards do not keep the robot on an exact shared anchor.
        # Normalize each eight-frame family before export so pose changes read
        # as intentional movement instead of camera shake or size popping.
        cells = []
        for index in range(8):
            left = round(index * width / 8)
            right = round((index + 1) * width / 8)
            cells.append(board.crop((left, 0, right, height)))

        bounds = []
        for cell in cells:
            alpha = cell.getchannel("A").point(lambda value: 255 if value > 16 else 0)
            bounds.append(alpha.getbbox())

        visible_heights = [bottom - top for left, top, right, bottom in bounds]
        visible_widths = [right - left for left, top, right, bottom in bounds]
        source_baseline = median(bottom for left, top, right, bottom in bounds)
        scale = min(320 / median(visible_heights), 304 / max(visible_widths))

        for index, (cell, bounds_box) in enumerate(zip(cells, bounds)):
            left, top, right, bottom = bounds_box
            sprite = cell.crop(bounds_box)
            sprite = sprite.resize(
                (max(1, round(sprite.width * scale)), max(1, round(sprite.height * scale))),
                Image.Resampling.LANCZOS,
            )
            canvas = Image.new("RGBA", (320, height), (0, 0, 0, 0))
            target_bottom = round(520 + (bottom - source_baseline) * scale)
            target_left = round((320 - sprite.width) / 2)
            canvas.alpha_composite(sprite, (target_left, target_bottom - sprite.height))
            canvas.save(destination / f"{index + 1:02}.webp", "WEBP", quality=92, method=4)
        manifest[name] = {
            "fps": fps,
            "loop": loop,
            "registration": "shared-size-center-baseline",
            "frames": [f"/assets/wizy/clips/{name}/{index + 1:02}.webp" for index in range(8)],
        }
    (FRAMES / "manifest.json").write_text(json.dumps(manifest, indent=2), encoding="utf-8")


if __name__ == "__main__":
    main()
