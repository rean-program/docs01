# Package Managers

Package managers help you install, update, and manage external libraries and tools in your projects. They're essential for modern web development.

## What is a Package Manager?

A package manager:
- Downloads and installs packages (libraries/tools)
- Manages dependencies between packages
- Handles version compatibility
- Provides easy updates and removal

## npm (Node Package Manager)

The default package manager for Node.js and the most widely used.

### Installing Node.js and npm

Download from [nodejs.org](https://nodejs.org) - npm comes bundled with Node.js.

```bash
# Check versions
node --version   # v18.17.0
npm --version    # 9.6.7
```

### Initializing a Project

```bash
# Create package.json interactively
npm init

# Create with defaults
npm init -y
```

**package.json example:**
```json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "My web project",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "vite",
    "build": "vite build",
    "test": "jest"
  },
  "dependencies": {
    "lodash": "^4.17.21"
  },
  "devDependencies": {
    "vite": "^4.4.0"
  }
}
```

### Installing Packages

```bash
# Install a package (adds to dependencies)
npm install lodash
npm i lodash        # shorthand

# Install as dev dependency
npm install --save-dev vite
npm i -D vite       # shorthand

# Install globally (available everywhere)
npm install -g typescript

# Install specific version
npm install lodash@4.17.21

# Install from package.json
npm install
npm i
```

### Removing Packages

```bash
# Remove a package
npm uninstall lodash
npm rm lodash       # shorthand

# Remove global package
npm uninstall -g typescript
```

### Updating Packages

```bash
# Check for outdated packages
npm outdated

# Update package
npm update lodash

# Update all packages
npm update

# Update to latest (may break compatibility)
npm install lodash@latest
```

### Running Scripts

```bash
# Run a script from package.json
npm run dev
npm run build
npm run test

# Special scripts don't need 'run'
npm start
npm test
```

### Useful npm Commands

| Command | Description |
|---------|-------------|
| `npm init` | Initialize project |
| `npm install` | Install all dependencies |
| `npm install <pkg>` | Install package |
| `npm uninstall <pkg>` | Remove package |
| `npm update` | Update packages |
| `npm outdated` | Check for updates |
| `npm run <script>` | Run script |
| `npm list` | List installed packages |
| `npm search <term>` | Search packages |
| `npm info <pkg>` | Package information |

## Yarn

An alternative to npm, created by Facebook. Faster in some cases with better caching.

### Installing Yarn

```bash
# Using npm
npm install -g yarn

# Check version
yarn --version
```

### Yarn Commands

| npm | Yarn |
|-----|------|
| `npm init` | `yarn init` |
| `npm install` | `yarn` or `yarn install` |
| `npm install <pkg>` | `yarn add <pkg>` |
| `npm install -D <pkg>` | `yarn add -D <pkg>` |
| `npm uninstall <pkg>` | `yarn remove <pkg>` |
| `npm update` | `yarn upgrade` |
| `npm run <script>` | `yarn <script>` |
| `npm install -g <pkg>` | `yarn global add <pkg>` |

```bash
# Common Yarn commands
yarn add lodash
yarn add -D vite
yarn remove lodash
yarn upgrade
yarn dev         # No 'run' needed for scripts
```

## pnpm

A faster, disk-efficient alternative that uses a shared store.

### Installing pnpm

```bash
npm install -g pnpm

# Check version
pnpm --version
```

### pnpm Commands

```bash
pnpm add lodash
pnpm add -D vite
pnpm remove lodash
pnpm update
pnpm dev

# pnpm is very similar to npm in syntax
pnpm install    # Install all dependencies
```

## package.json Explained

### Key Fields

```json
{
  "name": "my-project",           // Package name
  "version": "1.0.0",             // Semantic version
  "description": "Description",    // Package description
  "main": "index.js",             // Entry point
  "type": "module",               // Enable ES modules
  "scripts": {},                  // Runnable commands
  "dependencies": {},             // Production dependencies
  "devDependencies": {},          // Development only
  "keywords": [],                 // Search keywords
  "author": "Your Name",          // Author info
  "license": "MIT"                // License type
}
```

### Scripts Section

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "test": "jest",
    "lint": "eslint src/",
    "format": "prettier --write .",
    "prepare": "husky install"
  }
}
```

**Script hooks:**
- `preinstall` - Runs before install
- `postinstall` - Runs after install
- `pretest` - Runs before test
- `posttest` - Runs after test

## Version Numbers

Semantic versioning: `MAJOR.MINOR.PATCH`

| Part | When to Increment |
|------|-------------------|
| MAJOR | Breaking changes |
| MINOR | New features (backward compatible) |
| PATCH | Bug fixes |

### Version Ranges

```json
{
  "dependencies": {
    "exact": "1.2.3",        // Exactly 1.2.3
    "patch": "~1.2.3",       // 1.2.x (>=1.2.3 <1.3.0)
    "minor": "^1.2.3",       // 1.x.x (>=1.2.3 <2.0.0)
    "any": "*",              // Any version
    "range": ">=1.0.0 <2.0.0"  // Version range
  }
}
```

### package-lock.json

Locks exact versions for reproducible builds.

- **Commit to Git**: Ensures everyone gets same versions
- **Don't edit manually**: Generated automatically
- **Regenerate**: Delete and run `npm install`

## node_modules

The folder where packages are installed.

```
project/
├── node_modules/     # Installed packages (don't commit!)
│   ├── lodash/
│   ├── vite/
│   └── ...
├── package.json
└── package-lock.json
```

### .gitignore

Always exclude node_modules:

```gitignore
# Dependencies
node_modules/

# Lock files (optional - usually commit these)
# package-lock.json
# yarn.lock
```

## Common Packages

### Build Tools

| Package | Purpose |
|---------|---------|
| `vite` | Fast dev server and bundler |
| `webpack` | Powerful bundler |
| `esbuild` | Ultra-fast bundler |
| `rollup` | ES module bundler |

### Frameworks

| Package | Purpose |
|---------|---------|
| `react` | UI library |
| `vue` | Progressive framework |
| `svelte` | Compiler-based framework |
| `express` | Node.js web server |

### Utilities

| Package | Purpose |
|---------|---------|
| `lodash` | Utility functions |
| `axios` | HTTP client |
| `date-fns` | Date utilities |
| `uuid` | Generate unique IDs |

### Development

| Package | Purpose |
|---------|---------|
| `typescript` | Type-safe JavaScript |
| `eslint` | Code linting |
| `prettier` | Code formatting |
| `jest` | Testing framework |

## Creating a New Project

### From Scratch

```bash
mkdir my-project
cd my-project
npm init -y
npm install vite -D
```

### Using Create Templates

```bash
# Vite (recommended)
npm create vite@latest my-app
cd my-app
npm install
npm run dev

# React
npm create vite@latest my-react-app -- --template react

# Vue
npm create vite@latest my-vue-app -- --template vue

# TypeScript
npm create vite@latest my-ts-app -- --template vanilla-ts
```

## Troubleshooting

### Clear Cache

```bash
npm cache clean --force
yarn cache clean
pnpm store prune
```

### Reinstall Dependencies

```bash
rm -rf node_modules package-lock.json
npm install
```

### Fix Permissions (Mac/Linux)

```bash
# Fix npm global permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
# Add to ~/.bashrc or ~/.zshrc:
export PATH=~/.npm-global/bin:$PATH
```

### Common Errors

**EACCES permission denied:**
```bash
# Mac/Linux: Fix permissions
sudo chown -R $(whoami) ~/.npm
```

**ERESOLVE peer dependency conflict:**
```bash
# Force install (use carefully)
npm install --legacy-peer-deps
```

**Module not found:**
```bash
# Reinstall dependencies
rm -rf node_modules
npm install
```

## Best Practices

1. **Commit lock files** - Ensures reproducible builds
2. **Don't commit node_modules** - Add to .gitignore
3. **Use exact versions for production** - Avoid surprises
4. **Regularly update packages** - Security and features
5. **Audit for vulnerabilities** - `npm audit`
6. **Use dev dependencies correctly** - Don't ship test tools

## Summary

- npm, Yarn, and pnpm manage JavaScript packages
- `package.json` defines your project and dependencies
- Version numbers follow semantic versioning
- Always include `node_modules` in `.gitignore`
- Use lock files for reproducible builds
- Regularly update and audit packages

## Next Steps

Learn about [Web Security Basics](/guide/best-practices/web-security) to protect your applications.
