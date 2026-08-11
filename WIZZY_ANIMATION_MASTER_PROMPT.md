# Wizy Animation Prompt Master

## Production target

Build Wizy as a reusable website pet with authored animation drawings played at 12 fps. The final system uses state-based clips instead of one repeating slideshow. Target: 120 cleaned transparent frames across six motion sets.

## Immutable character lock

Use the supplied Wizy reference as the only character identity. Preserve exactly:

- Oversized rounded white helmet and compact white torso.
- Glossy cobalt-blue armor accents.
- Black glass face screen with simple cyan facial animation.
- Compact circular side caps; never add pointed ears, fins, horns, antennae, or spikes.
- Rounded asymmetric white Wizjobs `W` on the cobalt forehead badge.
- Short articulated limbs, rounded hands, chunky white-and-blue boots.
- Cute 3D product-render finish, clean blue outline, consistent front three-quarter camera.
- Identical head/body/limb proportions and identical logo geometry in every frame.

No costume changes. No extra accessories. No text. No captions. No frame labels. No camera movement. No cropped limbs. No changing scale. No background objects.

## Rendering and extraction lock

- Generate one clip per sprite board.
- Exactly 8 consecutive frames per board in a single horizontal row.
- Every cell has equal dimensions and identical character registration.
- Full body visible in every cell with feet aligned to one shared baseline.
- Flat chroma green `#00FF00` background, without shadows, floor, glow, gradient, or texture.
- Use strong pose continuity: each frame changes only enough to advance the same motion.
- Animation principles: anticipation, clear arcs, spacing, overlap, follow-through, overshoot, settle, squash and stretch kept subtle enough for a robot.
- Facial animation must lead or follow the body naturally; avoid random expression changes.

## Motion library — 120 authored frames

### A. Living idle — 24 frames

Three 8-frame boards: breathe and blink; glance toward page content; tiny weight shift and relaxed return. Seamless loop. Quiet enough to run continuously.

### B. Chat-open greeting — 16 frames

Two 8-frame boards: notices click, anticipates downward, pops up, waves twice, smiles, settles facing the chat panel.

### C. Listening and thinking — 24 frames

Three 8-frame boards: attentive lean; head tilt and blink; chin tap, eye movement, small idea reaction, controlled settle.

### D. Interview coaching — 24 frames

Three 8-frame boards: open-handed explanation; confident point toward page content; supportive thumbs-up with anticipation and overshoot.

### E. Success celebration — 16 frames

Two 8-frame boards: delighted reaction, two readable claps, small hop, landing compression, proud settle.

### F. Playful pet moment — 16 frames

Two 8-frame boards: curious peek, tiny foot tap, playful turn, brief stumble, recovery, shy smile. Runs rarely so it remains charming.

## Runtime behavior

- Playback: 12 fps for motion; 6–8 fps for subtle idle holds when appropriate.
- Default state chooses among living-idle clips with randomized pauses.
- Click triggers greeting, then opens chat and transitions into listening.
- User typing triggers attentive listening.
- Waiting for a reply triggers thinking.
- Job recommendations trigger explanation or pointing.
- Positive outcomes trigger thumbs-up or celebration.
- Rare inactivity triggers the playful pet moment.
- Every non-idle clip must transition through a settle frame before returning to idle.
- Respect `prefers-reduced-motion` with a single calm idle pose and expression changes only.

## Board prompt template

Create a production animation sprite board with exactly eight equal cells in one horizontal row. Show eight consecutive frames of `[CLIP BEAT]`. Apply the immutable Wizy character lock exactly. The motion begins at `[START POSE]`, passes through `[ANTICIPATION / KEY ACTION / OVERSHOOT]`, and ends at `[SETTLE POSE]`. Maintain identical character scale, registration, baseline, lighting, proportions, logo, circular side caps, and camera in every cell. Use believable arcs, spacing, overlap, follow-through, subtle robotic squash and stretch, and face/body timing. Perfect flat chroma green `#00FF00` background. No shadows, floor, gradients, text, labels, borders, frame numbers, accessories, extra objects, cropping, or overlapping cells.

## Acceptance gates

- Exactly 120 extracted transparent frames exist.
- No circular container or colored disc appears behind Wizy.
- No pointed ears appear in any frame.
- Logo and proportions stay consistent across the complete atlas.
- Idle loop has no visible jump at its seam.
- Each interaction clip has anticipation, action, overshoot, and settle frames.
- Runtime visibly changes states in response to chat events.
- Desktop and mobile layouts do not clip the pet or chat panel.
- Build, interaction tests, and visual motion QA pass before packaging.
