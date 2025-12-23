# DevDocs - Programming Tutorials

A comprehensive web development documentation site built with VitePress, covering everything from fundamentals to advanced topics.

## Topics Covered

- **HTML** - Semantic markup, accessibility, and modern HTML5 features
- **CSS** - Flexbox, Grid, animations, and responsive design
- **JavaScript** - ES6+, async programming, DOM manipulation, and OOP
- **TypeScript** - Type safety, generics, decorators, and advanced patterns
- **NestJS** - Enterprise Node.js applications with modular architecture
- **Hono** - Ultrafast web framework for Edge computing
- **Python** - Web development, data structures, and OOP
- **AI & Machine Learning** - Neural networks, deep learning, and LLMs

## Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (comes with Node.js)

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start development server**
   ```bash
   npm run docs:dev
   ```

3. **Open in browser**

   Visit `http://localhost:5173/doc01/`

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run docs:dev` | Start local development server |
| `npm run docs:build` | Build for production |
| `npm run docs:preview` | Preview production build locally |

## Project Structure

```
doc01/
├── docs/
│   ├── .vitepress/
│   │   ├── config.ts      # VitePress configuration
│   │   └── components/    # Vue components
│   ├── guide/
│   │   ├── html/          # HTML tutorials
│   │   ├── css/           # CSS tutorials
│   │   ├── javascript/    # JavaScript tutorials
│   │   ├── typescript/    # TypeScript tutorials
│   │   ├── nestjs/        # NestJS tutorials
│   │   ├── hono/          # Hono tutorials
│   │   ├── python/        # Python tutorials
│   │   └── ai/            # AI & ML tutorials
│   └── index.md           # Homepage
├── .github/
│   └── workflows/
│       └── deploy.yml     # GitHub Pages deployment
└── package.json
```

## Deployment

The site automatically deploys to GitHub Pages on push to the `main` branch via GitHub Actions.

## Built With

- [VitePress](https://vitepress.dev/) - Static Site Generator
- [Vue.js](https://vuejs.org/) - JavaScript Framework

## License

ISC
