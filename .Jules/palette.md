## 2025-03-22 - Global Focus Visibility and Semantic Navigation
**Learning:** Keyboard accessibility is often overlooked in game interfaces. Using `:focus-visible` ensures that keyboard users have a clear focus indicator without adding visual noise for mouse users. Additionally, wrapping interactive elements like icons in semantic `<a>` tags with `[routerLink]` is superior to using `(click)` or `[routerLink]` directly on `<img>` tags, as it provides native focusability and better screen reader context.

**Action:** Always implement `:focus-visible` styles for interactive elements and use semantic HTML (`<a>`, `<button>`) for navigation and actions, avoiding direct interaction on non-interactive elements like `<img>` or `div`.

## 2024-05-23 - Angular Signals and Side Effects Architecture
**Learning:** Using Angular `effect()` within services is a powerful way to decouple reactive logic (like sound or auto-achievements) from imperative engine actions. However, `effect()` MUST be called within an injection context, typically the constructor. Attempting to call `effect()` in an initialization method called after the service is instantiated will result in a runtime error unless a manual `Injector` is provided. To avoid memory leaks and ensure the effect's lifecycle is correctly managed, prefer registering effects once in the constructor.

**Action:** Consolidate reactive side effects into specialized services that register Angular `effect()` calls in their constructor, ensuring zero-overhead orchestration of UI and audio responses to state changes.
## 2025-03-23 - Tactile Feedback for Game Interactions
**Learning:** In pixel-art games, visual feedback for interactions is crucial for immersion. Adding a simple `translateY(2px)` to the `:active` state of buttons provides a tactile "press" feel that significantly improves the user's perception of responsiveness, especially on mobile devices where audio feedback might be muted.

**Action:** Implement tactile feedback using `transform: translateY(2px)` on the `:active` state for all interactive game elements globally.

## 2026-03-29 - Global Motion Accessibility Reset
**Learning:** For users with vestibular disorders or motion sensitivities, animations like the blinking "New Game" button or rapid slide transitions can be disorienting or physically distressing. Implementing a global `prefers-reduced-motion: reduce` media query in the base stylesheet that resets animation and transition durations to a near-zero value ensures that the application remains accessible without requiring manual intervention in every component. This pattern is a fundamental accessibility "fail-safe" for motion-intensive interfaces like games.

**Action:** Always include a global `prefers-reduced-motion` reset in the main stylesheet and specifically target high-intensity animations (like blinking or flashing) in component-level styles.

## 2026-04-04 - Accessible HUD Status Announcements
**Learning:** In fast-paced or HUD-intensive interfaces, changes to critical status indicators (like lives or level progress) must be announced to screen reader users without them having to manually navigate to those elements. Using a container with `role="status"` and `aria-live="polite"`, combined with a hidden `.sr-only` descriptive label, ensures that updates are communicated naturally as they occur. Centralizing the `.sr-only` utility in a global stylesheet also prevents redundant CSS definitions and ensures a consistent accessibility pattern workspace-wide.

**Action:** For all HUD or real-time status indicators, use a `role="status"` container with `aria-live="polite"` and an `.sr-only` descriptive label that includes current and maximum values where applicable.

## 2026-04-07 - Contextual Form Accessibility and SVG Labeling
**Learning:** For users of screen readers, ensuring that inputs have full context (like character limits and real-time error messages) is essential for a smooth form-filling experience. Associating these elements with the input using `aria-describedby` provides this context without extra navigation. Additionally, complex SVG-based branding should be treated as a single informative image by using `role="img"` and a descriptive `aria-label`, while hiding internal animated elements to prevent "visual noise" for screen readers.

**Action:** Always link form inputs with character counters and error spans using `aria-describedby`. For SVG titles, use `role="img"` and `aria-label` on the root tag and `aria-hidden="true"` on internal paths/groups.
