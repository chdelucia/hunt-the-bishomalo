## 2026-03-18 - [Input Validation for Player Name]
**Vulnerability:** Lack of input validation on player name field allowed for potential UI-based DoS and served as an unvalidated entry point for XSS.
**Learning:** Even simple configuration forms should have strict validation to maintain defense-in-depth and prevent unexpected behavior.
**Prevention:** Always implement maxLength and pattern validation for user-provided strings in Angular Reactive Forms and reflect these constraints in the HTML template.

## 2025-05-22 - [MFE Configuration Hijacking via LocalStorage]
**Vulnerability:** The application allowed overriding micro-frontend remote URLs via `localStorage['MFE_REMOTES_OVERRIDE']` in all environments, including production.
**Learning:** Debugging features that allow dynamic configuration changes can become a persistent hijacking vector if not strictly restricted to non-production environments.
**Prevention:** Always wrap environment-specific debugging or configuration override logic in strict checks (e.g., `if (isDev)`) to ensure they cannot be exploited in production.

## 2026-03-31 - [Harden CSP by removing unsafe-inline from script-src]
**Vulnerability:** The application used an inline script for Google Tag Manager, requiring `'unsafe-inline'` in the CSP's `script-src` directive, which increased the risk of XSS.
**Learning:** Inline scripts, even for legitimate purposes like analytics, create a significant security gap. Moving them to external files allows for a much stricter CSP.
**Prevention:** Always move inline scripts to external files and strictly avoid `'unsafe-inline'` in the `script-src` CSP directive to minimize the attack surface for script injection.

## 2026-04-01 - [Nginx add_header Inheritance Vulnerability]
**Vulnerability:** Security headers defined at the server level were not being applied to static assets because the static assets location block had its own add_header directive, which overrides all parent add_header directives in Nginx.
**Learning:** In Nginx, add_header directives do not merge across levels. If a child block (like a location block for static assets) defines any add_header, it must explicitly repeat all security headers from the parent level.
**Prevention:** Always ensure that security headers (HSTS, CSP, XSS protection) are explicitly repeated in any Nginx location block that uses the add_header directive, or use an include file to manage common headers across blocks.
