## 2026-03-18 - [Input Validation for Player Name]
**Vulnerability:** Lack of input validation on player name field allowed for potential UI-based DoS and served as an unvalidated entry point for XSS.
**Learning:** Even simple configuration forms should have strict validation to maintain defense-in-depth and prevent unexpected behavior.
**Prevention:** Always implement maxLength and pattern validation for user-provided strings in Angular Reactive Forms and reflect these constraints in the HTML template.

## 2026-03-28 - [MFE Configuration Hijacking Prevention]
**Vulnerability:** Allowing `localStorage` overrides for MFE remote configurations in production environments creates a risk of MFE hijacking, where a malicious user could redirect a remote entry to a compromised server.
**Learning:** Configuration overrides intended for local development should be strictly environment-guarded at the bootstrapping level to prevent unauthorized production overrides.
**Prevention:** Restrict `localStorage` configuration lookups in `fetchRemoteConfig` to development mode (`isDev === true`) only.
