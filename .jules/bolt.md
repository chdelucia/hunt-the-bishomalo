# Bolt's Journal - Critical Learnings

## 2026-03-19 - [Rendering Optimization in VisualEffectDirective]
**Learning:** Heavy DOM manipulations within directives that react to frequent state changes (like game perceptions) can block the main thread and degrade Interaction to Next Paint (INP).
**Action:** Use `requestAnimationFrame` to batch DOM updates and `cancelAnimationFrame` to debounce redundant updates within a single frame. Always use `DestroyRef` to clean up pending frames.

## 2026-03-20 - [Selective Input Binding in Grid Components]
**Learning:** Passing global state (like a player object) to every component in a large grid causes unnecessary change detection cycles across the entire grid whenever that state changes.
**Action:** Use selective binding in the parent component to only pass the active state to the specific grid cell that needs it. Provide stable references (e.g., a constant empty array) for the other cells to avoid reference-change-triggered detection.
