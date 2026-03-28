## 2026-03-18 - [Input Validation for Player Name]
**Vulnerability:** Lack of input validation on player name field allowed for potential UI-based DoS and served as an unvalidated entry point for XSS.
**Learning:** Even simple configuration forms should have strict validation to maintain defense-in-depth and prevent unexpected behavior.
**Prevention:** Always implement maxLength and pattern validation for user-provided strings in Angular Reactive Forms and reflect these constraints in the HTML template.

## 2026-03-19 - [Restricting MFE Overrides to Development]
**Vulnerability:** Persistent Micro-Frontend (MFE) hijacking was possible via the `MFE_REMOTES_OVERRIDE` localStorage key in production environments. An attacker could use XSS to redirect users to malicious remote modules.
**Learning:** Debug-oriented configuration overrides that leverage client-side storage must be strictly gated by environment checks to avoid creating critical security gaps in production.
**Prevention:** Always wrap debug-only features in explicit environment checks (e.g., `isDev`) at the source to ensure they are unreachable in production builds.
