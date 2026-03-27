## 2026-03-18 - [Input Validation for Player Name]
**Vulnerability:** Lack of input validation on player name field allowed for potential UI-based DoS and served as an unvalidated entry point for XSS.
**Learning:** Even simple configuration forms should have strict validation to maintain defense-in-depth and prevent unexpected behavior.
**Prevention:** Always implement maxLength and pattern validation for user-provided strings in Angular Reactive Forms and reflect these constraints in the HTML template.

## 2025-05-15 - [MFE Configuration Hijacking via LocalStorage]
**Vulnerability:** The microfrontend loader allowed overriding remote URLs using a `MFE_REMOTES_OVERRIDE` key in `localStorage` without environment checks.
**Learning:** Debugging features that alter application architecture or load external code must be strictly gated by environment flags (e.g., `isDev`) to prevent production exploitation (MFE hijacking).
**Prevention:** Ensure all `localStorage`-based configuration overrides are wrapped in environment-aware conditionals.
