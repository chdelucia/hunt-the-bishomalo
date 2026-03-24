# Bolt's Journal - Critical Learnings

## 2026-03-19 - [Rendering Optimization in VisualEffectDirective]
**Learning:** Heavy DOM manipulations within directives that react to frequent state changes (like game perceptions) can block the main thread and degrade Interaction to Next Paint (INP).
**Action:** Use `requestAnimationFrame` to batch DOM updates and `cancelAnimationFrame` to debounce redundant updates within a single frame. Always use `DestroyRef` to clean up pending frames.

## 2026-03-20 - [Selective Input Binding in Grid Components]
**Learning:** Passing global state (like a player object) to every component in a large grid causes unnecessary change detection cycles across the entire grid whenever that state changes.
**Action:** Use selective binding in the parent component to only pass the active state to the specific grid cell that needs it. Provide stable references (e.g., a constant empty array) for the other cells to avoid reference-change-triggered detection.

## 2026-03-23 - [Angular Template Control Flow & Signal Caching]
**Learning:** While @let improves signal read efficiency in templates, moving O(N) logic (like inventory scans) from class-level computed signals into template expressions removes caching benefits and can lead to redundant work on every change detection cycle. Additionally, the 'as' variable alias is supported in @if but NOT in @else if blocks.
**Action:** Keep complex logic in computed signals to leverage caching, and use @let in templates primarily for aliasing and reducing multiple signal reads. Always use nested @if or @let instead of 'as' in @else if blocks.
