## 2025-03-22 - Global Focus Visibility and Semantic Navigation
**Learning:** Keyboard accessibility is often overlooked in game interfaces. Using `:focus-visible` ensures that keyboard users have a clear focus indicator without adding visual noise for mouse users. Additionally, wrapping interactive elements like icons in semantic `<a>` tags with `[routerLink]` is superior to using `(click)` or `[routerLink]` directly on `<img>` tags, as it provides native focusability and better screen reader context.

**Action:** Always implement `:focus-visible` styles for interactive elements and use semantic HTML (`<a>`, `<button>`) for navigation and actions, avoiding direct interaction on non-interactive elements like `<img>` or `div`.

## 2024-05-23 - Angular Signals and Side Effects Architecture
**Learning:** Using Angular `effect()` within services is a powerful way to decouple reactive logic (like sound or auto-achievements) from imperative engine actions. However, `effect()` MUST be called within an injection context, typically the constructor. Attempting to call `effect()` in an initialization method called after the service is instantiated will result in a runtime error unless a manual `Injector` is provided. To avoid memory leaks and ensure the effect's lifecycle is correctly managed, prefer registering effects once in the constructor.

**Action:** Consolidate reactive side effects into specialized services that register Angular `effect()` calls in their constructor, ensuring zero-overhead orchestration of UI and audio responses to state changes.
## 2025-03-23 - Tactile Feedback for Game Interactions
**Learning:** In pixel-art games, visual feedback for interactions is crucial for immersion. Adding a simple `translateY(2px)` to the `:active` state of buttons provides a tactile "press" feel that significantly improves the user's perception of responsiveness, especially on mobile devices where audio feedback might be muted.

**Action:** Implement tactile feedback using `transform: translateY(2px)` on the `:active` state for all interactive game elements globally.
