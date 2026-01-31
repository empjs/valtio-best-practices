---
name: Project Rules
description: Follow these development rules and patterns for the valtio-best-practices project.
---

# Project Development Rules

## Directory Structure
- **Routes**: organizing code into a modular structure with subdirectories for each route (e.g. `src/routes/Home/`).
  - `*.page.tsx`: Main page component (e.g., `Home.page.tsx`).
  - `index.tsx`: Entry point for the route component export.
  - `config.tsx`: Static data and configurations.
  - `snippets.ts`: Code snippets for the route.
  - `demos.store.ts`: Demo stores specific to the route.
  - `components/`: Route-specific components.

## Coding Standards
- **Imports**: Always use absolute imports starting with `src/` for internal files within `apps/valtio-offical`.
  - Example: `import {useT} from 'src/i18n'` instead of `../../i18n`.
- **Styling**:
  - **Demo Buttons**: Use the "12 hao" (size 12) style:
    - `text-xs`
    - `px-2 py-1`
    - `whitespace-nowrap`
    - `rounded`
    - `font-medium`
    - Example classes: `cursor-pointer whitespace-nowrap rounded border border-transparent bg-blue-600 px-2 py-1 text-xs font-medium text-white transition-colors duration-200 hover:bg-blue-700 focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2 dark:bg-blue-600 dark:text-white dark:hover:bg-blue-700 dark:focus-visible:ring-offset-slate-900`
  - **Demo Content**:
    - Use `text-xs`.
    - Use `truncate` for long content to prevent wrapping.
    - Provide full content in `title` attribute for hover visibility.
    - Containers for multiple buttons should use `flex-wrap` to handle overflow gracefully in most cases, or `flex-nowrap` with horizontal scroll if explicitly requested for specific compact layouts.

## Refactoring Guidelines
- When refactoring logic from a monolithic file, ensure all related parts (stores, snippets, sub-components) are extracted into their respective files in the route's directory.
- Verify that `src/routes/index.ts` exports the refactored components correctly.

