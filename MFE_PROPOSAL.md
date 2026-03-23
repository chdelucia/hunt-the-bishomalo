# Microfrontend Migration Proposal: Hunt The Bishomalo

This document outlines a proposal for decomposing the **Hunt The Bishomalo** monorepo into a microfrontend (MFE) architecture using `@angular-architects/native-federation`.

## 1. Architectural Vision

The application will be divided into a **Shell** application and several **Remote** applications. This transition allows for independent development, deployment, and testing of different game modules while maintaining a cohesive user experience.

### Shell Application
- **Responsibility**: Hosting the main layout, navigation, global configuration, and loading remotes.
- **Key Components**: Navigation menu, Footer, Global state provider (Core Store).
- **Security**: Centralized guards (like `homeGuard` and `secretGuard`).

### Remote Applications
Each remote will represent a significant domain of the application:
1. **Game Remote**: Core gameplay (Hunt the Wumpus, Boss fight).
2. **Achievements Remote**: Achievement management and display.
3. **Shop Remote**: Item store and gold management.
4. **Gamestats Remote**: Leaderboards and post-game results.
5. **Config Remote**: Game settings and character selection.

## 2. Technology Choice: Native Federation

Given that the project uses **Angular 21** and **esbuild** (as specified in `package.json` and `project.json`), we recommend **Native Federation** over traditional Webpack-based Module Federation.

### Why Native Federation?
- **Framework Agnostic**: Works without being tied to a specific bundler (it uses ES Modules).
- **Esbuild Support**: Fully compatible with Angular's modern build system.
- **Performance**: Faster builds and smaller bundles through native browser capabilities.

## 3. Implementation Strategy

### Step 1: Install Dependencies
```bash
bun add @angular-architects/native-federation -D
```

### Step 2: Configure the Shell
The `src/app/app.routes.ts` will be updated to load remotes dynamically:

```typescript
export const appRoutes: Route[] = [
  {
    path: RouteTypes.ACHIEVEMENTS,
    loadChildren: () => loadRemoteModule('achievements', './Component').then(m => m.AchievementsModule),
  },
  // ... other remotes
];
```

### Step 3: Configure Remotes
Each remote will expose its main entry point via a `federation.config.js`:

```javascript
// libs/achievements/shell/federation.config.js
const { withNativeFederation, shareAll } = require('@angular-architects/native-federation/config');

module.exports = withNativeFederation({
  name: 'achievements',
  exposes: {
    './Component': './libs/achievements/shell/src/index.ts',
  },
  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
});
```

## 4. Shared State Management

The `CoreStore` (currently in `libs/core/data-access`) must remain a **singleton** shared across the Shell and all Remotes.

- **Solution**: Mark `@hunt-the-bishomalo/core/api` and `@hunt-the-bishomalo/core/data-access` as shared libraries in the Federation configuration.
- This ensures that when a Remote updates the player's gold or health, the Shell and other Remotes see the same data in real-time.

## 5. Domain Isolation & API Tokens

The project already follows a strict domain isolation (enforced by ESLINT). To make MFE migration successful:
- Continue using `InjectionToken`s defined in `api` libraries.
- Remotes should not import from each other directly; they should interact via the Shell or shared `api` libraries.

## 6. Impact on Workflow

- **Local Development**: `nx serve-many --projects shell,game-remote,shop-remote` will allow running parts of the system.
- **CI/CD**: Only the affected remote application needs to be rebuilt and redeployed on changes.
- **Versioning**: Each remote can be versioned independently.

## 7. Recommended Roadmap
1. **Pilot**: Migrate `achievements` (it's the most isolated domain).
2. **Expansion**: Migrate `shop` and `gamestats`.
3. **Core**: Migrate `game` and `boss`.
4. **Shell Cleanup**: Remove the heavy library dependencies from the Shell application.
