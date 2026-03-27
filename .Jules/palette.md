## 2025-03-22 - Global Focus Visibility and Semantic Navigation
**Learning:** Keyboard accessibility is often overlooked in game interfaces. Using `:focus-visible` ensures that keyboard users have a clear focus indicator without adding visual noise for mouse users. Additionally, wrapping interactive elements like icons in semantic `<a>` tags with `[routerLink]` is superior to using `(click)` or `[routerLink]` directly on `<img>` tags, as it provides native focusability and better screen reader context.

**Action:** Always implement `:focus-visible` styles for interactive elements and use semantic HTML (`<a>`, `<button>`) for navigation and actions, avoiding direct interaction on non-interactive elements like `<img>` or `div`.

## 2026-03-27 - Motion Sensitivity and Decorative Clutter
**Learning:** High-motion animations like rapid blinking or floating elements can cause discomfort for users with vestibular disorders. Additionally, decorative emojis and redundant alt text in toast notifications create auditory clutter for screen reader users. Proper use of `prefers-reduced-motion` and `aria-hidden` significantly improves the inclusive experience.

**Action:** Implement `@media (prefers-reduced-motion: reduce)` to disable high-intensity animations. Use `aria-hidden="true"` on decorative symbols and ensure toast containers use `role="status"` with `aria-live="polite"`.
