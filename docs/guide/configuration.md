# Configuration

## Build Configuration

The project uses `unbuild` as the build tool. Configuration is located in each package's `build.config.ts`.

### Default Configuration

```typescript
import { defineBuildConfig } from 'unbuild'

export default defineBuildConfig({
  entries: ['src/index'],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: false,
  },
})
```

### Configuration Options

- `entries`: Entry point files
- `declaration`: Generate TypeScript declaration files
- `clean`: Clean output directory before build
- `rollup`: Rollup-specific options

## TypeScript Configuration

TypeScript configuration is in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "skipLibCheck": true,
    "esModuleInterop": true
  }
}
```

## ESLint Configuration

The project uses `@antfu/eslint-config`. Configuration is in `eslint.config.js`:

```javascript
import antfu from '@antfu/eslint-config'

export default antfu({
  // Your custom config
})
```

## Package Manager Configuration

Using pnpm workspaces, configured in `pnpm-workspace.yaml`:

```yaml
packages:
  - playground
  - docs
  - packages/*
  - examples/*
```

## Git Hooks

Using `simple-git-hooks` and `lint-staged` for pre-commit checks:

```json
{
  "simple-git-hooks": {
    "pre-commit": "pnpm lint-staged"
  },
  "lint-staged": {
    "*": "eslint --fix"
  }
}
```

## Documentation Configuration

### VitePress Configuration

Documentation is built with VitePress. Configuration is in `docs/.vitepress/config/index.ts`.

### TypeDoc Configuration

API documentation is generated with TypeDoc. Configuration is in `typedoc.json`:

```json
{
  "$schema": "https://typedoc.org/schema.json",
  "docsRoot": "./docs",
  "entryPoints": ["./packages/pkg-placeholder/src/index.ts"],
  "out": "./docs/api",
  "categorizeByGroup": true,
  "plugin": ["typedoc-plugin-markdown", "typedoc-vitepress-theme"],
  "sourceLinkTemplate": "https://github.com/YunYouJun/starter-monorepo/tree/{gitRevision}/{path}#L{line}",
  "sidebar": {
    "autoConfiguration": true,
    "format": "vitepress",
    "pretty": true,
    "collapsed": false
  }
}
```

### Customizing Docs

To add more packages to API documentation, update `typedoc.json`:

```json
{
  "entryPoints": [
    "./packages/pkg-placeholder/src/index.ts",
    "./packages/another-package/src/index.ts"
  ]
}
```

## Environment Variables

No environment variables are required for basic usage. For deployment, see deployment configuration.

## Next Steps

- Read the [Getting Started Guide](/guide/getting-started)
- Explore [API Reference](/api/)
