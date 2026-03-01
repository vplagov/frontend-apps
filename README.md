# UI Monorepo

This repository is a monorepo for various UI projects. It uses Angular's multi-project workspace structure.

## Projects

- **fuel-tracker-ui**: The main application for tracking fuel consumption.
- **shared-ui**: A shared library containing reusable components and models used across projects.

## Development

To start a local development server for the main app, run:

```bash
npx ng serve fuel-tracker-ui
```

To build a specific project:

```bash
npx ng build fuel-tracker-ui
npx ng build shared-ui
```

To build everything:

```bash
npx ng build shared-ui && npx ng build fuel-tracker-ui
```

## CI/CD

The project uses **GitHub Actions** for continuous integration and deployment.

### How it works:
1. **Change Detection**: We use `dorny/paths-filter` to detect which projects have changed.
2. **Selective Build**:
   - If `projects/shared-ui` changes, the library is built and then all dependent applications (like `fuel-tracker-ui`) are also built to ensure compatibility.
   - If only `projects/fuel-tracker-ui` changes, only that application is built.
3. **Linting**: ESLint runs on the entire workspace to maintain code quality.
4. **Deployment**: On every push to the `main` branch, if the build is successful, the respective application is deployed (currently a placeholder in `.github/workflows/ci-cd.yml`).

## Code Scaffolding

Angular CLI includes powerful code scaffolding tools. To generate a new component, run:

```bash
npx ng generate component component-name --project=fuel-tracker-ui
```

For a complete list of available schematics (such as `components`, `directives`, or `pipes`), run:

```bash
npx ng generate --help
```

## Building

To build the projects, run:

```bash
npx ng build fuel-tracker-ui
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
npx ng test fuel-tracker-ui
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
npx ng e2e fuel-tracker-ui
```

Angular CLI does not come with an end-to-end testing framework by default. You can choose one that suits your needs.

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
