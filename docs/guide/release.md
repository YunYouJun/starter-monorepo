# Release

Before the first release, replace template metadata and confirm that package names, registry access, and documentation URLs belong to your project. Keep the root package private.

## Validate a Release

Run these checks from the repository root:

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:exports
pnpm docs:build
```

Review the changes and start from a clean working tree on the intended release branch.

## Local Publishing

```bash
pnpm release
```

The script runs `bumpp -r && pnpm -r publish`. With the installed bumpp defaults, it prompts for a version, updates package versions recursively, creates a release commit and tag, and pushes them to the remote. It then publishes eligible workspace packages to npm. The package `prepack` hook builds the output before publishing.

This command performs remote Git and npm writes. Run it when you are ready to release and authenticated with the destination registry. A successful run completes npm publishing.

## GitHub Release Automation

The supplied GitHub release workflow runs on `v*` tag pushes. It validates the project, builds documentation, and uses `changelogithub` to generate the GitHub release notes. Its npm publishing step is commented out by default; npm publishing is handled by the local release command above.

If you enable npm publishing in CI, change the local release script to version and tag only, then configure the workflow's registry authentication and package access. Choose one publishing owner for each version to keep the local command and CI from publishing the same version twice.
