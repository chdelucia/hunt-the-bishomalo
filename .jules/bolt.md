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

## 2026-03-26 - [Loop-level @let Optimization in Grids]
**Learning:** Identity comparisons (like `currentCell === cell`) or signal reads performed multiple times within a single iteration of a large `@for` loop can be cached using the `@let` syntax. This significantly reduces the total number of operations per change detection cycle, especially in grid-based UIs.
**Action:** Always hoist repeated loop-specific expressions and signal reads into `@let` variables within the loop body to optimize performance in high-frequency rendering paths.

## 2026-03-27 - [Perception De-duplication in Game Logic]
**Learning:** Redundant state assessments (like checking multiple adjacent cells for the same hazard) can trigger duplicate expensive side effects (like audio playback) and UI updates (translation lookups), leading to cluttered feedback and wasted CPU cycles.
**Action:** Use a `Set` to de-duplicate hazard types before processing their associated sensory effects (sounds, messages) to ensure each unique feedback is triggered only once per state change.

## 2026-03-28 - [Local MFE Manifest Optimization]
**Learning:** Fetching MFE remote configuration from external worker URLs during the bootstrap phase adds unnecessary network latency and creates a potential point of failure. External manifests can also lead to the shell app incorrectly loading itself as a remote if not strictly managed.
**Action:** Serve MFE remote configuration files locally from the root `public/` directory and use relative paths in `fetchRemoteConfig` to eliminate external latency and ensure the manifest only contains required remotes.
