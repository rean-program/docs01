# React Tutorial

::: info Official Documentation
This tutorial is based on the official React documentation. For the most up-to-date information, visit: [https://react.dev/](https://react.dev/)
:::

Welcome to the React tutorial! Learn how to build modern, interactive user interfaces with the world's most popular JavaScript library. This tutorial covers both **JavaScript** and **TypeScript** approaches.

## What is React?

React is a **JavaScript library** for building user interfaces, created by Facebook (Meta). It lets you create reusable UI components and efficiently update the DOM when data changes.

```
┌─────────────────────────────────────────────────────────────┐
│                    How React Works                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Your Code (JSX/TSX)        Virtual DOM         Real DOM   │
│   ┌─────────────┐          ┌───────────┐       ┌─────────┐ │
│   │ <Button />  │  ─────►  │  React    │ ───►  │ Browser │ │
│   │ <Card />    │  render  │  compares │ patch │   DOM   │ │
│   │ <List />    │          │  changes  │       │         │ │
│   └─────────────┘          └───────────┘       └─────────┘ │
│                                                             │
│   React only updates what's necessary! ⚡                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## JavaScript vs TypeScript

This tutorial provides examples in both JavaScript and TypeScript:

| Feature | JavaScript | TypeScript |
|---------|------------|------------|
| File Extension | `.jsx` | `.tsx` |
| Type Safety | Runtime errors | Compile-time errors |
| Learning Curve | Easier | Slightly steeper |
| IDE Support | Good | Excellent |
| Industry Trend | Common | Increasingly preferred |

::: tip Recommendation
If you're new to React, start with **JavaScript**. If you know TypeScript or want type safety, use **TypeScript**.
:::

## Why Learn React?

| Feature | Description |
|---------|-------------|
| **Component-Based** | Build encapsulated components that manage their own state |
| **Declarative** | Describe what you want, React figures out how |
| **Virtual DOM** | Efficient updates for better performance |
| **Huge Ecosystem** | Thousands of libraries and tools |
| **Job Market** | Most in-demand frontend skill |
| **Learn Once, Write Anywhere** | React Native for mobile apps |

## What You'll Learn

### Beginner
- [Getting Started](/guide/react/01-introduction) - Setup with Vite (JS & TS)
- [JSX/TSX](/guide/react/02-jsx) - HTML-like syntax in JavaScript/TypeScript
- [Components & Props](/guide/react/03-components) - Building blocks of React

### Intermediate
- [State](/guide/react/04-state) - Managing component data
- [Events](/guide/react/05-events) - Handling user interactions
- [Hooks](/guide/react/06-hooks) - useState, useEffect, and more

### Advanced
- [Forms](/guide/react/07-forms) - Controlled components, validation
- [Routing](/guide/react/08-routing) - Multi-page apps with React Router
- [Data Fetching](/guide/react/09-api) - APIs, loading states, error handling
- [Advanced Patterns](/guide/react/10-advanced) - Context, performance, best practices

## Prerequisites

Before starting this tutorial, you should know:

- ✅ HTML & CSS basics
- ✅ JavaScript fundamentals (ES6+)
- ✅ Basic understanding of the DOM
- ⭐ TypeScript basics (optional, for TS examples)

::: tip New to JavaScript?
Check out our [JavaScript Tutorial](/guide/javascript/) first!
:::

## Quick Preview

::: code-group
```jsx [JavaScript]
// A simple React component
function Welcome({ name }) {
  return (
    <div className="welcome">
      <h1>Hello, {name}!</h1>
      <p>Welcome to React</p>
    </div>
  );
}

// Using the component
function App() {
  return (
    <div>
      <Welcome name="Developer" />
      <Welcome name="Student" />
    </div>
  );
}
```

```tsx [TypeScript]
// Define props interface
interface WelcomeProps {
  name: string;
}

// A typed React component
function Welcome({ name }: WelcomeProps) {
  return (
    <div className="welcome">
      <h1>Hello, {name}!</h1>
      <p>Welcome to React</p>
    </div>
  );
}

// Using the component (type-checked!)
function App() {
  return (
    <div>
      <Welcome name="Developer" />
      <Welcome name="Student" />
    </div>
  );
}
```
:::

## Setting Up Your Environment

### JavaScript Setup

```bash
# Create a new React app with Vite (JavaScript)
npm create vite@latest my-react-app -- --template react

cd my-react-app
npm install
npm run dev
```

### TypeScript Setup

```bash
# Create a new React app with Vite (TypeScript)
npm create vite@latest my-react-app -- --template react-ts

cd my-react-app
npm install
npm run dev
```

Your app will be running at `http://localhost:5173`

## Project Structure

::: code-group
```[JavaScript]
my-react-app/
├── node_modules/
├── public/
│   └── vite.svg
├── src/
│   ├── App.css
│   ├── App.jsx          ← Main component
│   ├── index.css
│   └── main.jsx         ← Entry point
├── index.html
├── package.json
└── vite.config.js
```

```[TypeScript]
my-react-app/
├── node_modules/
├── public/
│   └── vite.svg
├── src/
│   ├── App.css
│   ├── App.tsx          ← Main component (.tsx)
│   ├── index.css
│   ├── main.tsx         ← Entry point (.tsx)
│   └── vite-env.d.ts    ← Type declarations
├── index.html
├── package.json
├── tsconfig.json        ← TypeScript config
└── vite.config.ts
```
:::

## Video Tutorials

::: tip Recommended Video Resources
Learn React through these excellent video tutorials from the community.
:::

### Free Courses

| Course | Creator | Description |
|--------|---------|-------------|
| [React Course for Beginners](https://www.youtube.com/watch?v=bMknfKXIFA8) | freeCodeCamp | 12-hour comprehensive beginner course |
| [React Tutorial for Beginners](https://www.youtube.com/watch?v=SqcY0GlETPk) | Programming with Mosh | 1-hour crash course |
| [React JS Full Course](https://www.youtube.com/watch?v=b9eMGE7QtTk) | Dave Gray | 9-hour complete course |
| [React in 100 Seconds](https://www.youtube.com/watch?v=Tn6-PIqc4UM) | Fireship | Quick 100-second explanation |

### Official Resources

| Resource | Description |
|----------|-------------|
| [React.dev Learn](https://react.dev/learn) | Official React documentation with interactive tutorials |
| [React.dev Tutorial](https://react.dev/learn/tutorial-tic-tac-toe) | Build Tic-Tac-Toe step by step |

### Topic-Specific Videos

| Topic | Video | Duration |
|-------|-------|----------|
| React Hooks | [React Hooks Tutorial](https://www.youtube.com/watch?v=TNhaISOUy6Q) | ~30 min |
| React Router | [React Router v6 Tutorial](https://www.youtube.com/watch?v=Ul3y1LXxzdU) | ~30 min |
| State Management | [Redux Toolkit Tutorial](https://www.youtube.com/watch?v=bbkBuqC1rU4) | ~2 hours |
| TypeScript + React | [React TypeScript Tutorial](https://www.youtube.com/watch?v=TPACABQTHvM) | ~1 hour |

## Let's Begin!

Ready to start building with React? Head over to the [Getting Started](/guide/react/01-introduction) guide!

---

[Get Started →](/guide/react/01-introduction)
