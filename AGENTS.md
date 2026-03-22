<!-- nx configuration start-->
<!-- Leave the start & end comments to automatically receive updates. -->

# General Guidelines for working with Nx

- For navigating/exploring the workspace, invoke the `nx-workspace` skill first - it has patterns for querying projects, targets, and dependencies
- When running tasks (for example build, lint, test, e2e, etc.), always prefer running the task through `nx` (i.e. `nx run`, `nx run-many`, `nx affected`) instead of using the underlying tooling directly
- Prefix nx commands with the workspace's package manager (e.g., `pnpm nx build`, `npm exec nx test`) - avoids using globally installed CLI
- You have access to the Nx MCP server and its tools, use them to help the user
- For Nx plugin best practices, check `node_modules/@nx/<plugin>/PLUGIN.md`. Not all plugins have this file - proceed without it if unavailable.
- NEVER guess CLI flags - always check nx_docs or `--help` first when unsure

## Scaffolding & Generators

- For scaffolding tasks (creating apps, libs, project structure, setup), ALWAYS invoke the `nx-generate` skill FIRST before exploring or calling MCP tools

## When to use nx_docs

- USE for: advanced config options, unfamiliar flags, migration guides, plugin configuration, edge cases
- DON'T USE for: basic generator syntax (`nx g @nx/react:app`), standard commands, things you already know
- The `nx-generate` skill handles generator discovery internally - don't call nx_docs just to look up generator syntax

<!-- nx configuration end-->
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
