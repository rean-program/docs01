# NPM & Package Management

NPM (Node Package Manager) is the world's largest software registry. In this tutorial, you'll learn how to manage dependencies, publish packages, and use best practices for Node.js projects.

## What is NPM?

```
┌─────────────────────────────────────────────────────────────┐
│                    NPM Ecosystem                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   NPM Registry (npmjs.com)                                  │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  2+ million packages                                 │  │
│   │  • express  • react  • lodash  • typescript         │  │
│   │  • axios    • jest   • webpack • and more...        │  │
│   └─────────────────────────────────────────────────────┘  │
│                          ↑↓                                 │
│   NPM CLI                                                   │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  npm install  npm publish  npm update  npm search   │  │
│   └─────────────────────────────────────────────────────┘  │
│                          ↑↓                                 │
│   Your Project                                              │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  package.json  node_modules/  package-lock.json     │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Getting Started

### Check NPM Version

```bash
npm --version
# or
npm -v
```

### Initialize a Project

```bash
# Interactive setup
npm init

# Quick setup with defaults
npm init -y
```

This creates `package.json`:

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}
```

## Understanding package.json

```json
{
  "name": "my-awesome-app",
  "version": "1.0.0",
  "description": "A fantastic Node.js application",
  "main": "src/index.js",
  "scripts": {
    "start": "node src/index.js",
    "dev": "node --watch src/index.js",
    "test": "jest",
    "build": "tsc",
    "lint": "eslint src/"
  },
  "keywords": ["nodejs", "api", "backend"],
  "author": "Your Name <you@example.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/user/repo.git"
  },
  "bugs": {
    "url": "https://github.com/user/repo/issues"
  },
  "homepage": "https://github.com/user/repo#readme",
  "engines": {
    "node": ">=18.0.0"
  },
  "dependencies": {
    "express": "^4.18.2",
    "dotenv": "^16.0.3"
  },
  "devDependencies": {
    "jest": "^29.5.0",
    "eslint": "^8.40.0"
  }
}
```

### Key Fields Explained

| Field | Description |
|-------|-------------|
| `name` | Package name (lowercase, no spaces) |
| `version` | Semantic version (major.minor.patch) |
| `main` | Entry point for require/import |
| `scripts` | Runnable commands via `npm run` |
| `dependencies` | Production packages |
| `devDependencies` | Development-only packages |
| `peerDependencies` | Required by host package |
| `engines` | Required Node.js version |

## Installing Packages

### Install Production Dependency

```bash
# Install and add to dependencies
npm install express
npm i express  # shorthand

# Install specific version
npm install express@4.18.2

# Install latest version
npm install express@latest
```

### Install Development Dependency

```bash
# Install and add to devDependencies
npm install --save-dev jest
npm i -D jest  # shorthand
```

### Install Globally

```bash
# Install globally (available everywhere)
npm install --global nodemon
npm i -g nodemon  # shorthand

# Check global packages
npm list -g --depth=0
```

### Install All Dependencies

```bash
# Install everything from package.json
npm install
npm i  # shorthand

# Install production only (no devDependencies)
npm install --production
npm i --omit=dev  # Node 16+
```

## Understanding Version Ranges

```
┌─────────────────────────────────────────────────────────────┐
│                    Semantic Versioning                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    4.18.2                                   │
│                    │ │  │                                   │
│                    │ │  └── Patch (bug fixes)              │
│                    │ └───── Minor (new features, backward  │
│                    │              compatible)               │
│                    └─────── Major (breaking changes)        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Version Specifiers

| Specifier | Meaning | Example |
|-----------|---------|---------|
| `4.18.2` | Exact version | Only 4.18.2 |
| `^4.18.2` | Compatible with | 4.18.2 to < 5.0.0 |
| `~4.18.2` | Approximately | 4.18.2 to < 4.19.0 |
| `>4.18.2` | Greater than | Any > 4.18.2 |
| `>=4.18.2` | Greater or equal | Any >= 4.18.2 |
| `<4.18.2` | Less than | Any < 4.18.2 |
| `4.18.x` | Any patch | 4.18.0 to 4.18.x |
| `*` | Any version | Latest |

### Recommendation

```json
{
  "dependencies": {
    "express": "^4.18.2"  // Caret (^) is the default and recommended
  }
}
```

## package-lock.json

The lock file ensures everyone installs the exact same versions.

```
┌─────────────────────────────────────────────────────────────┐
│                    Why Lock Files?                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Without lock file:                                        │
│   ┌──────────────┐    ┌──────────────┐                     │
│   │ Developer A  │    │ Developer B  │                     │
│   │ express 4.18 │    │ express 4.19 │  ← Different!      │
│   └──────────────┘    └──────────────┘                     │
│                                                             │
│   With lock file:                                           │
│   ┌──────────────┐    ┌──────────────┐                     │
│   │ Developer A  │    │ Developer B  │                     │
│   │ express 4.18.2│   │ express 4.18.2│ ← Same!           │
│   └──────────────┘    └──────────────┘                     │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**Important:** Always commit `package-lock.json` to version control!

## Managing Dependencies

### Update Packages

```bash
# Check for updates
npm outdated

# Update all to latest allowed by package.json
npm update

# Update specific package
npm update express

# Update to latest (ignoring version range)
npm install express@latest
```

### Remove Packages

```bash
# Remove and update package.json
npm uninstall express
npm un express  # shorthand

# Remove dev dependency
npm uninstall --save-dev jest
npm un -D jest

# Remove global package
npm uninstall -g nodemon
```

### List Packages

```bash
# List installed packages
npm list
npm ls  # shorthand

# List top-level only
npm list --depth=0

# List production only
npm list --prod

# List with details
npm list --long
```

## NPM Scripts

### Defining Scripts

```json
{
  "scripts": {
    "start": "node src/index.js",
    "dev": "node --watch src/index.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "build": "tsc",
    "clean": "rm -rf dist",
    "prebuild": "npm run clean",
    "postbuild": "echo 'Build complete!'"
  }
}
```

### Running Scripts

```bash
# Run a script
npm run dev
npm run test

# Special scripts (don't need 'run')
npm start
npm test
npm stop
npm restart

# Run with arguments
npm run test -- --watch
npm test -- --coverage
```

### Pre and Post Hooks

```json
{
  "scripts": {
    "pretest": "npm run lint",
    "test": "jest",
    "posttest": "echo 'Tests complete!'",

    "prebuild": "npm run clean",
    "build": "tsc",
    "postbuild": "npm run copy-assets"
  }
}
```

Execution order for `npm run build`:
1. `prebuild` (automatically)
2. `build`
3. `postbuild` (automatically)

### Chaining Scripts

```json
{
  "scripts": {
    "build:all": "npm run clean && npm run build && npm run test",
    "dev:full": "npm run lint & npm run dev"
  }
}
```

- `&&` - Run sequentially (next runs if previous succeeds)
- `&` - Run in parallel (both run simultaneously)
- `||` - Run next if previous fails

## Working with node_modules

### Structure

```
node_modules/
├── express/
│   ├── package.json
│   ├── index.js
│   └── lib/
├── lodash/
│   ├── package.json
│   └── lodash.js
└── .package-lock.json
```

### Best Practices

```gitignore
# .gitignore
node_modules/
```

**Never:**
- Commit node_modules to git
- Manually edit files in node_modules
- Assume node_modules exists (always run `npm install`)

## NPX - Execute Packages

NPX runs packages without installing them globally.

```bash
# Run without installing
npx create-react-app my-app
npx cowsay "Hello!"

# Run specific version
npx typescript@4.9 --version

# Run local binary
npx jest

# Run from GitHub
npx github:user/repo
```

## Creating and Publishing Packages

### Prepare Your Package

```
my-package/
├── src/
│   └── index.js
├── package.json
├── README.md
├── LICENSE
└── .npmignore
```

**package.json:**
```json
{
  "name": "@yourname/my-package",
  "version": "1.0.0",
  "description": "A useful package",
  "main": "src/index.js",
  "files": ["src"],
  "keywords": ["utility", "helper"],
  "author": "Your Name",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourname/my-package"
  }
}
```

### Files to Include/Exclude

**.npmignore:**
```
# Similar to .gitignore
tests/
*.test.js
.env
.github/
docs/
```

Or use `files` field in package.json (whitelist approach):
```json
{
  "files": [
    "src",
    "dist",
    "README.md"
  ]
}
```

### Publishing

```bash
# Login to npm
npm login

# Check what will be published
npm pack --dry-run

# Publish
npm publish

# Publish scoped package as public
npm publish --access public

# Update version and publish
npm version patch  # 1.0.0 → 1.0.1
npm version minor  # 1.0.0 → 1.1.0
npm version major  # 1.0.0 → 2.0.0
npm publish
```

## Security

### Audit Packages

```bash
# Check for vulnerabilities
npm audit

# Auto-fix vulnerabilities
npm audit fix

# Force fix (may have breaking changes)
npm audit fix --force

# Get detailed report
npm audit --json
```

### Best Practices

```bash
# Use exact versions for production
npm install --save-exact express

# Check package before installing
npm view express

# Check download stats
npm info express

# Check for typosquatting
# Double-check package names!
```

## Alternative Package Managers

### Yarn

```bash
# Install yarn
npm install -g yarn

# Common commands
yarn init
yarn add express
yarn add --dev jest
yarn remove express
yarn install
yarn run test
```

### pnpm

```bash
# Install pnpm
npm install -g pnpm

# Common commands
pnpm init
pnpm add express
pnpm add -D jest
pnpm remove express
pnpm install
pnpm run test
```

### Comparison

| Feature | npm | yarn | pnpm |
|---------|-----|------|------|
| Speed | Good | Fast | Fastest |
| Disk Space | More | More | Less |
| Lock File | package-lock.json | yarn.lock | pnpm-lock.yaml |
| Workspaces | Yes | Yes | Yes |

## Workspaces (Monorepo)

Manage multiple packages in one repository.

### Setup

```
my-monorepo/
├── package.json
├── packages/
│   ├── core/
│   │   └── package.json
│   ├── cli/
│   │   └── package.json
│   └── web/
│       └── package.json
```

**Root package.json:**
```json
{
  "name": "my-monorepo",
  "private": true,
  "workspaces": [
    "packages/*"
  ]
}
```

### Using Workspaces

```bash
# Install all dependencies
npm install

# Run script in specific workspace
npm run build --workspace=packages/core
npm run build -w packages/core  # shorthand

# Run in all workspaces
npm run build --workspaces
npm run build -ws  # shorthand

# Add dependency to workspace
npm install lodash --workspace=packages/core
```

## Practical Example: Project Setup

```bash
# Create project
mkdir my-api && cd my-api
npm init -y

# Install dependencies
npm install express dotenv cors
npm install -D typescript @types/node @types/express nodemon jest

# Update package.json
```

```json
{
  "name": "my-api",
  "version": "1.0.0",
  "description": "My Express API",
  "main": "dist/index.js",
  "scripts": {
    "start": "node dist/index.js",
    "dev": "nodemon src/index.ts",
    "build": "tsc",
    "test": "jest",
    "lint": "eslint src/"
  },
  "engines": {
    "node": ">=18.0.0"
  },
  "dependencies": {
    "cors": "^2.8.5",
    "dotenv": "^16.0.3",
    "express": "^4.18.2"
  },
  "devDependencies": {
    "@types/express": "^4.17.17",
    "@types/node": "^20.2.5",
    "jest": "^29.5.0",
    "nodemon": "^2.0.22",
    "typescript": "^5.0.4"
  }
}
```

## Summary

| Command | Description |
|---------|-------------|
| `npm init` | Initialize project |
| `npm install <pkg>` | Install package |
| `npm install -D <pkg>` | Install dev dependency |
| `npm install -g <pkg>` | Install globally |
| `npm uninstall <pkg>` | Remove package |
| `npm update` | Update packages |
| `npm outdated` | Check for updates |
| `npm run <script>` | Run npm script |
| `npm audit` | Security check |
| `npm publish` | Publish package |
| `npx <pkg>` | Run without install |

## What's Next?

In the next chapter, we'll explore [Debugging](/guide/nodejs/09-debugging) - how to find and fix bugs in Node.js applications.

---

[Next: Debugging →](/guide/nodejs/09-debugging)
