## 2026-04-03 - Accessible Status Indicators for Game State
**Learning:** For dynamic game stats like lives, relying solely on visual icons (like hearts) makes the game state inaccessible to screen reader users. Using `role="status"` combined with localized, screen-reader-only text ensures state changes are announced politely.
**Action:** Always wrap dynamic status indicators in a `role="status"` container and provide a descriptive `.sr-only` summary that updates with the state.
