# Bolt's Journal - Critical Learnings

## 2026-03-19 - [Rendering Optimization in VisualEffectDirective]
**Learning:** Heavy DOM manipulations within directives that react to frequent state changes (like game perceptions) can block the main thread and degrade Interaction to Next Paint (INP).
**Action:** Use `requestAnimationFrame` to batch DOM updates and `cancelAnimationFrame` to debounce redundant updates within a single frame. Always use `DestroyRef` to clean up pending frames.
