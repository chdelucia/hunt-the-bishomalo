## 2026-03-18 - [Input Validation for Player Name]
**Vulnerability:** Lack of input validation on player name field allowed for potential UI-based DoS and served as an unvalidated entry point for XSS.
**Learning:** Even simple configuration forms should have strict validation to maintain defense-in-depth and prevent unexpected behavior.
**Prevention:** Always implement maxLength and pattern validation for user-provided strings in Angular Reactive Forms and reflect these constraints in the HTML template.

## 2025-05-22 - [MFE Configuration Hijacking via LocalStorage]
**Vulnerability:** The application allowed overriding micro-frontend remote URLs via `localStorage['MFE_REMOTES_OVERRIDE']` in all environments, including production.
**Learning:** Debugging features that allow dynamic configuration changes can become a persistent hijacking vector if not strictly restricted to non-production environments.
**Prevention:** Always wrap environment-specific debugging or configuration override logic in strict checks (e.g., `if (isDev)`) to ensure they cannot be exploited in production.
