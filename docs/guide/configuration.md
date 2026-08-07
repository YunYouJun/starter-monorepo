# Configuration

## Build Configuration

The project uses `tsdown` as the build tool. Configuration is located in each package's `tsdown.config.ts`.

### Default Configuration

```typescript
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['src/index.ts'],
  dts: true,
  exports: true,
  publint: true,
})
```

### Configuration Options

- `entry`: Entry point files
- `dts`: Generate TypeScript declaration files
- `exports`: Keep package exports synchronized with build outputs
- `publint`: Validate the package after building

## TypeScript Configuration

TypeScript configuration is in `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "lib": ["ESNext"],
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "resolveJsonModule": true,
    "strict": true,
    "strictNullChecks": true,
    "noEmit": true,
    "esModuleInterop": true,
    "verbatimModuleSyntax": true,
    "skipDefaultLibCheck": true,
    "skipLibCheck": true
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
  - apps/*
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
  "entryPoints": ["./packages/pkg-placeholder/src/index.ts"],
  "out": "./docs/api",
  "plugin": ["typedoc-plugin-markdown", "typedoc-vitepress-theme"],
  "readme": "none",
  "docsRoot": "docs",
  "gitRevision": "main",
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
