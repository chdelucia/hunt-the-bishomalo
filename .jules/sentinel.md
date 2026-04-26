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

## 2026-04-02 - [Harden CSP and Permissions-Policy wildcard]
**Vulnerability:** The application's Content Security Policy used a wildcard `*.workers.dev` in `img-src` and `connect-src` directives, which allowed any Cloudflare Worker subdomain to serve images or receive data from the app. Additionally, the `Permissions-Policy` was missing several recommended privacy and security restrictions.
**Learning:** Wildcards in CSP should be avoided whenever possible, especially on platforms where subdomains are easily attainable by third parties. A more restrictive `Permissions-Policy` reduces the attack surface for browser-based features that the application does not utilize.
**Prevention:** Always use specific, trusted domains in CSP instead of wildcards like `*.workers.dev`. Regularly audit and harden `Permissions-Policy` to disable unused browser features like `payment`, `usb`, and `interest-cohort`.

## 2026-04-03 - [Harden Nginx headers with always and expanded Permissions-Policy]
**Vulnerability:** Nginx `add_header` directives were missing the `always` parameter, meaning security headers were not sent on error responses (like 4xx or 5xx). Additionally, the `Permissions-Policy` was only partially restricted, and several other recommended headers were missing.
**Learning:** Security headers should be sent for all responses, including errors, to maintain protection. A comprehensive `Permissions-Policy` and the use of `upgrade-insecure-requests` in CSP provide a much stronger defense-in-depth posture.
**Prevention:** Always use the `always` parameter for `add_header` directives in Nginx. Explicitly disable all unused browser features in `Permissions-Policy` and use `X-XSS-Protection "0"` to prevent legacy filter exploits.

## 2026-04-04 - [Hardening Sentry tracePropagationTargets]
**Vulnerability:** Sentry's `tracePropagationTargets` contained a placeholder domain (`yourserver.io`), which could lead to leaking tracing headers (and potentially sensitive metadata) to an untrusted external domain.
**Learning:** Default or placeholder configurations for monitoring tools can create security gaps if not reviewed and updated to reflect the actual environment. Whitelisting only trusted domains prevents accidental data leakage.
**Prevention:** Always audit monitoring tool configurations (like Sentry, LogRocket, etc.) to ensure that only authorized domains are whitelisted for sensitive operations like distributed tracing header propagation.

## 2026-04-05 - [Harden Sentry tracePropagationTargets with Anchored Regex]
**Vulnerability:** Sentry's `tracePropagationTargets` used loose string matches and unanchored regular expressions, which could allow sensitive tracing headers (`sentry-trace`, `baggage`) to be leaked to malicious domains that included the whitelisted domain as a substring or prefix (e.g., `hunt-the-bishomalo.vercel.app.malicious.com`).
**Learning:** String entries in `tracePropagationTargets` are treated as substring matches by Sentry. Without anchors (`^`, `$`) and proper delimiter handling, whitelists can be easily bypassed via subdomain or path-based exploitation.
**Prevention:** Always use strict, anchored regular expressions (e.g., `/^https:\/\/domain\.com($|\/)/`) for `tracePropagationTargets` to ensure tracing headers are only propagated to verified, exact origins.

## 2025-05-23 - [Prototype Pollution in MiniBusService]
**Vulnerability:** The `MiniBusService` used a plain object as an event store, making it susceptible to Prototype Pollution if malicious event names (e.g., `__proto__`) were emitted.
**Learning:** Shared event systems that persist state in plain objects must be hardened against prototype-related keys to prevent global object pollution.
**Prevention:** Use `Object.create(null)` for internal stores and explicitly block forbidden keys like `__proto__`, `constructor`, and `prototype`.

## 2025-05-23 - [Client-side Path Traversal in AchievementService]
**Vulnerability:** The `AchievementService` used the `appId` from an external event directly in a fetch URL, which could allow fetching unauthorized local files if manipulated.
**Learning:** Data received from cross-component communication or events should be treated as untrusted and sanitized before use in security-sensitive operations like URL construction.
**Prevention:** Always sanitize identifiers using strict regex (e.g., `/[^a-zA-Z0-9\-_]/g`) before including them in file paths or API requests.

## 2026-04-26 - [Harden JSON parsing against Prototype Pollution]
**Vulnerability:** `JSON.parse` was used on untrusted data from `localStorage` and remote configurations without any sanitization, leaving the application vulnerable to Prototype Pollution.
**Learning:** Standard `JSON.parse` will process special keys like `__proto__`. If the parsed object is then merged with other objects, it can pollute the global `Object.prototype`.
**Prevention:** Always use a reviver function with `JSON.parse` to strip forbidden keys (`__proto__`, `constructor`, `prototype`) and recursively sanitize already-parsed objects before merging them into application state.
