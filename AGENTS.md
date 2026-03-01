# Agent Development Guidelines for UI Monorepo

This document provides context for AI agents working on this repository, explaining the architectural decisions, structure, and workflows.

## Workspace Architecture

This is an **Angular Monorepo** managed through the standard Angular CLI workspace structure (multi-project).

### Core Structure
- `/projects/`: Contains all applications and libraries.
- `/projects/shared-ui/`: The central library for reusable components, models, and services.
- `/projects/fuel-tracker-ui/`: The primary application in the workspace.

### Key Configuration
- **Root `tsconfig.json`**: Contains path mapping for `shared-ui` to allow direct source imports during development.
  ```json
  "paths": {
    "shared-ui": ["projects/shared-ui/src/public-api.ts"]
  }
  ```
- **Shared Models**: All API models (request/response) should reside in `projects/shared-ui/src/lib/models/` and be exported through `public-api.ts`.
- **Tailwind CSS**: The root configuration (if any) or project-specific configurations should be aware of both the app and the shared library to ensure utility classes are correctly scanned.

## Adding a New UI Project

When building a new UI project in this monorepo:

1.  **Generate the App**: Use `ng generate application <project-name>`.
2.  **Use Shared Library**: Always prefer using components and models from `shared-ui`. Import from `shared-ui` (the path mapping handles this).
3.  **Update CI/CD**:
    - Add the new project path to the `filters` section in `.github/workflows/ci-cd.yml`.
    - Create a build job for the new project in the workflow.
4.  **Tailwind Configuration**: Ensure the new project's `tailwind.config.js` includes the `shared-ui` path in its `content` array.

## Updating an Existing UI Project

1.  **Shared Components**: If a change is needed in a shared component, update it in `shared-ui`. Note that this might affect all projects using it.
2.  **Build Validation**: After changing `shared-ui`, rebuild all projects to ensure compatibility.
3.  **Consistency**: Maintain consistent naming and structure as established in `fuel-tracker-ui`.

## CI/CD Workflow (GitHub Actions)

The pipeline is located in `.github/workflows/ci-cd.yml`. It uses `dorny/paths-filter` to perform selective builds:
- Changes to `shared-ui` trigger builds for **all** dependent projects.
- Changes to a specific project (e.g., `fuel-tracker-ui`) trigger only that project's build.
- Global linting is performed on every PR.

## Development Scripts

- `npx ng serve fuel-tracker-ui`: Starts `fuel-tracker-ui`.
- `npx ng build fuel-tracker-ui`: Builds `fuel-tracker-ui`.
- `npx ng build shared-ui && npx ng build fuel-tracker-ui`: Builds the shared library and the main application.
- `npx ng build <project-name>`: Builds a specific project.

## Important Note for Agents

Always check `angular.json` to understand the workspace configuration and the root `tsconfig.json` for path mappings. When adding new shared elements, ensure they are exported via `projects/shared-ui/src/public-api.ts`.
