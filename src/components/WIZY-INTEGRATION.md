# Wizy Pet

`WizyPet.jsx` is the portable recruitment-site companion. Copy the component, the `.wizzy-*` CSS rules from `src/styles.css`, and `public/assets/wizy-v2` into another React website.

The approved library contains 60 transparent PNG frames across four calm, registered clips: 24 `calm-idle` frames plus 12 frames each for `think-lightbulb`, `computer-search`, and `job-match`. Each clip uses per-frame timing with long settled holds instead of a fixed high frame rate. Wizy completes two idle loops between automatic feature actions, returns to idle after each action, points props toward the screen-left chat panel, and respects `prefers-reduced-motion`.

Chat input routes matching/job prompts to `job-match`, CV/search prompts to `computer-search`, and general questions to `think-lightbulb`. Opening the chat plays `computer-search` once before Wizy settles back to idle.
