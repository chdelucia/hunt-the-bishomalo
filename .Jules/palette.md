## 2025-03-22 - Global Focus Visibility and Semantic Navigation
**Learning:** Keyboard accessibility is often overlooked in game interfaces. Using `:focus-visible` ensures that keyboard users have a clear focus indicator without adding visual noise for mouse users. Additionally, wrapping interactive elements like icons in semantic `<a>` tags with `[routerLink]` is superior to using `(click)` or `[routerLink]` directly on `<img>` tags, as it provides native focusability and better screen reader context.

**Action:** Always implement `:focus-visible` styles for interactive elements and use semantic HTML (`<a>`, `<button>`) for navigation and actions, avoiding direct interaction on non-interactive elements like `<img>` or `div`.

## 2025-03-23 - Tactile Feedback for Game Interactions
**Learning:** In pixel-art games, visual feedback for interactions is crucial for immersion. Adding a simple `translateY(2px)` to the `:active` state of buttons provides a tactile "press" feel that significantly improves the user's perception of responsiveness, especially on mobile devices where audio feedback might be muted.

**Action:** Implement tactile feedback using `transform: translateY(2px)` on the `:active` state for all interactive game elements globally.
