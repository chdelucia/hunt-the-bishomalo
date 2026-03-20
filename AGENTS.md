# AGENTS.md

Welcome to the **Hunt The Bishomalo** repository! As an AI agent working on this codebase, you MUST follow the guidelines defined in this project to ensure consistency, performance, and security.

## Core Guidelines

1. **Angular Developer Skill**: You MUST follow the official Angular Developer guidelines for all Angular-related tasks (creating components, services, reactivity, testing, etc.).
   - Guidelines: [Angular Developer Skill](.jules/skills/angular-developer/SKILL.md)
   - References: [.jules/skills/angular-developer/references/](.jules/skills/angular-developer/references/)

2. **Domain-Driven Architecture**: This project follows a strict Nx domain-driven architecture.
   - Refer to [.cursor/.rules/nx-domain-architecture.mdc](.cursor/.rules/nx-domain-architecture.mdc) for layering rules (api, data-access, feature, shell).
   - Cross-domain communication MUST happen only via `api` libraries using `InjectionToken`s.

3. **Performance (Bolt)**: Prioritize performance optimizations.
   - Refer to [.jules/bolt.md](.jules/bolt.md) for critical performance learnings.
   - Use `requestAnimationFrame` for heavy DOM manipulations in directives.

4. **Security (Sentinel)**: Follow security best practices.
   - Refer to [.jules/sentinel.md](.jules/sentinel.md) for security patterns and findings.
   - Sanitize player inputs and enforce length limits.

5. **Testing**: Maintain a code coverage threshold of at least 90% for all new changes.

## Verification

Before submitting any change, ensure:
- `bun x nx build` passes.
- `bun x nx test` passes with relevant coverage.
- E2E tests in `e2e/` pass if applicable.
