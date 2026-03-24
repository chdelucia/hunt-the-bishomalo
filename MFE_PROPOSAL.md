# Microfrontend Migration Proposal: Hunt The Bishomalo

This document outlines the architectural proposal and best practices for decomposing the **Hunt The Bishomalo** monorepo into a microfrontend (MFE) architecture using `@angular-architects/native-federation`.

## 1. Architectural Vision

The application is divided into a **Shell** (Host) application and several **Remote** applications. Each remote represents a strictly isolated domain.

### Shell Application
- **Responsibility**: Hosting the main layout, navigation, global configuration, and loading remotes.
- **Key Components**: Navigation menu, Footer, Global state provider (Core Store).
- **Security**: Centralized guards (like `homeGuard` and `secretGuard`).

### Remote Applications
Remotes are self-contained applications that expose specific features:
1. **Game Remote**: Core gameplay (Hunt the Wumpus, Boss fight).
2. **Achievements Remote**: (Pilot) Achievement management and display.
3. **Shop Remote**: Item store and gold management.
4. **Gamestats Remote**: Leaderboards and post-game results.

## 2. Core Principles for Microfrontends

To ensure true independence and avoid runtime coupling, all MFEs must adhere to these rules:

### 2.1 Independent Runtimes & DI
Each MFE must be able to run independently. They should not rely on the Shell providing complex service instances via Dependency Injection.
- **Rule**: Never share Angular service *implementations* between MFEs.
- **Implementation**: Implementation logic (Services, Components, Stores) must reside within the Remote's source directory (`apps/remote-name/src/app/...`).

### 2.2 Communication via Events and Storage
MFEs should communicate through decoupled mechanisms rather than direct service method calls.
- **Primary Mechanism**: `CustomEvent` dispatched on the `window` object.
- **Secondary Mechanism**: Shared persistent storage (`localStorage`) for state synchronization across sessions.
- **Event Naming**: Use clear, domain-prefixed event names (e.g., `achievement-unlocked`, `gold-updated`).

### 2.3 Strict Domain Isolation
- **API Libraries**: Use `libs/domain/api` for sharing interfaces, DTOs, and `InjectionToken`s. These are the only libraries the Shell should import from a Remote's domain.
- **No Cross-Remote Imports**: A Remote must never import from another Remote or another domain's `data-access` library.
- **Relative Imports**: Inside a Remote, use relative imports (`./`, `../`) to ensure it doesn't depend on Nx library path mappings that might point to external code.

## 3. Technology Choice: Native Federation

Given that the project uses **Angular 21** and **esbuild**, we use **Native Federation**.

### Configuration (federation.config.js)
Both Shell and Remotes must configure shared libraries carefully:
- **Singletons**: Core Angular libraries (`@angular/core`, etc.) and internal `api` libraries must be shared as singletons.
- **Strict Versioning**: Use `strictVersion: true` to prevent runtime conflicts between different versions of the same library.

```javascript
shared: {
  ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  '@hunt-the-bishomalo/core/api': { singleton: true, strictVersion: true, requiredVersion: 'auto' },
  // ... other API/Contract libraries
},
```

## 4. Implementation Strategy (The "Isolation" Pattern)

When migrating a domain to an MFE:
1. **Move Code**: Move all logic from `libs/domain/*` into `apps/remote-name/src/app/domain`.
2. **Refactor**: Update all imports to be relative within the new directory.
3. **Expose Routes**: Expose the domain's entry routes via `federation.config.js`.
4. **Decouple Shell**: Remove concrete service imports from the Shell's `app.config.ts`. Replace them with lightweight "Shell Services" that implement the domain's interface but only perform essential tracking or dispatch events.
5. **Sync State**: Use `window.addEventListener` in the Remote to listen for events dispatched by the Shell (and vice versa).

## 5. Recommended Roadmap
1. **Pilot (Completed)**: `achievements-remote` isolated and using `CustomEvent` communication.
2. **Expansion**: Migrate `shop` and `gamestats`.
3. **Core**: Migrate `game` and `boss`.
4. **Final Polish**: Complete removal of domain-specific implementation libraries from the monorepo root.
