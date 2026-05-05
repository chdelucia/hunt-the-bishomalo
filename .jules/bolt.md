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

## 2026-03-30 - [Host Filtering in Native Federation Manifest]
**Learning:** Native Federation attempts to load all remotes listed in the manifest, including the host itself if present. This results in a redundant and failing/redundant fetch for `remoteEntry.json` of the host application during the bootstrap phase.
**Action:** Always filter out the host application name from the merged manifest before calling `initFederation` in `main.ts` to optimize initial network requests and bootstrap speed.

## 2026-04-02 - [Logic Hoisting to Parent Template in Grids]
**Learning:** Moving complex state derived logic (e.g., `inventory.some()`) from child component `computed` signals into the parent component's template using `@let` significantly reduces overhead. In a grid, this prevents the logic from being re-evaluated for every single cell independently, instead computing it once and passing it as a simple boolean input.
**Action:** Identify expensive computations within repeated child components and hoist them to the parent template using `@let` to transform complex state into primitive inputs.

## 2026-04-02 - [Consolidated Stats Calculation in Results]
**Learning:** Performing multiple independent iterations (via `reduce`, `sort`, etc.) over a dataset in separate `computed` signals can be inefficient. Consolidating these into a single O(N) pass within a private `computed` signal and then deriving the public signals from it significantly reduces overhead.
**Action:** Identify opportunities to consolidate multiple O(N) or O(N log N) operations into a single O(N) pass when they all depend on the same underlying signal.

## 2026-04-05 - [Store-level Memoization for Global Inventory Checks]
**Learning:** Hoisting O(N) logic (like `inventory.some`) to parent template `@let` blocks still triggers the scan on every change detection cycle of the parent. Moving this logic into a `computed` signal within the Store ensures the scan only runs when the underlying `inventory` signal actually changes.
**Action:** Prefer store-level `computed` signals for expensive state derivations (scans, filters, maps) over template-level `@let` expressions to maximize the benefits of signal memoization.

## 2026-04-05 - [Specific Dependency for Derived Computed Signals]
**Learning:** Derived computed signals (like `hasLantern`) that depend on broad state objects (like `hunter`) will re-evaluate whenever any property of that object changes (e.g., position), even if the relevant property (e.g., `inventory`) remains the same.
**Action:** Make derived computed signals depend on the most granular computed signals available (e.g., `inventory()`) instead of broad state signals (e.g., `hunter()`) to fully leverage signal memoization and prevent redundant re-evaluations during frequent state changes like movement.

## 2026-04-08 - [Efficient 2D Grid Coordinate Hashing]
**Learning:** Using string templates for 2D coordinate lookups (e.g., `Set(['0,0'])`) in high-frequency generation loops causes excessive string allocation and GC pressure.
**Action:** Use numeric hashing (e.g., `x * 100 + y`) for 2D grid lookups in performance-critical paths (like board generation) to leverage faster numeric comparisons and reduce memory overhead.
