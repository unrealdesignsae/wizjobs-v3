from pathlib import Path
from PIL import Image
import json


ROOT = Path(__file__).resolve().parents[1]
CLIPS = ROOT / "public" / "assets" / "wizy" / "clips"


def main():
    manifest = json.loads((CLIPS / "manifest.json").read_text(encoding="utf-8"))
    assert len(manifest) == 15, f"expected 15 clips, found {len(manifest)}"
    listed = [path for clip in manifest.values() for path in clip["frames"]]
    assert len(listed) == 120, f"expected 120 listed frames, found {len(listed)}"

    files = sorted(CLIPS.glob("*/*.webp"))
    assert len(files) == 120, f"expected 120 WebP files, found {len(files)}"

    for path in files:
        image = Image.open(path).convert("RGBA")
        alpha = image.getchannel("A")
        corners = [alpha.getpixel((0, 0)), alpha.getpixel((image.width - 1, 0)), alpha.getpixel((0, image.height - 1)), alpha.getpixel((image.width - 1, image.height - 1))]
        assert max(corners) == 0, f"non-transparent corner in {path.name}: {corners}"
        visible = sum(1 for value in alpha.getdata() if value > 16)
        coverage = visible / (image.width * image.height)
        assert 0.04 < coverage < 0.55, f"implausible subject coverage {coverage:.3f} in {path}"

    print("Wizy motion verification passed: 15 clips, 120 transparent frames.")


if __name__ == "__main__":
    main()
