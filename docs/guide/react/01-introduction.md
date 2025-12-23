# Getting Started with React

React is the most popular JavaScript library for building user interfaces. In this tutorial, you'll learn how to set up React with both JavaScript and TypeScript, understand its core concepts, and create your first application.

## What is React?

React is a **declarative, component-based** library for building user interfaces.

```
┌─────────────────────────────────────────────────────────────┐
│                    React Key Concepts                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   1. COMPONENTS                                             │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  Think of them as LEGO blocks                        │  │
│   │  Each component is a reusable piece of UI            │  │
│   │                                                      │  │
│   │   ┌──────┐  ┌──────┐  ┌──────┐                      │  │
│   │   │Header│  │ Card │  │Button│  ← Components        │  │
│   │   └──────┘  └──────┘  └──────┘                      │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
│   2. DECLARATIVE                                            │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  You describe WHAT you want, not HOW to do it        │  │
│   │                                                      │  │
│   │  "Show a button that says Click Me"                  │  │
│   │  NOT "Create element, add text, append to DOM..."    │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
│   3. VIRTUAL DOM                                            │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  React keeps a copy of the DOM in memory             │  │
│   │  Compares changes → Updates only what's needed       │  │
│   │  Result: FAST updates! ⚡                            │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Setting Up Your Development Environment

### Prerequisites

Make sure you have Node.js installed:

```bash
# Check Node.js version (v18+ recommended)
node --version

# Check npm version
npm --version
```

### Creating a React Project

::: code-group
```bash [JavaScript]
# Create new project with JavaScript
npm create vite@latest my-react-app -- --template react

# Navigate to project folder
cd my-react-app

# Install dependencies
npm install

# Start development server
npm run dev
```

```bash [TypeScript]
# Create new project with TypeScript
npm create vite@latest my-react-app -- --template react-ts

# Navigate to project folder
cd my-react-app

# Install dependencies
npm install

# Start development server
npm run dev
```
:::

Open `http://localhost:5173` in your browser.

## Project Structure

::: code-group
```[JavaScript Project]
my-react-app/
├── node_modules/        # Dependencies
├── public/              # Static files
│   └── vite.svg
├── src/                 # Your code goes here!
│   ├── assets/          # Images, fonts, etc.
│   ├── App.css          # Styles for App component
│   ├── App.jsx          # Main App component
│   ├── index.css        # Global styles
│   └── main.jsx         # Entry point (renders App)
├── .gitignore
├── index.html           # HTML template
├── package.json         # Project config & dependencies
└── vite.config.js       # Vite configuration
```

```[TypeScript Project]
my-react-app/
├── node_modules/        # Dependencies
├── public/              # Static files
│   └── vite.svg
├── src/                 # Your code goes here!
│   ├── assets/          # Images, fonts, etc.
│   ├── App.css          # Styles for App component
│   ├── App.tsx          # Main App component (.tsx)
│   ├── index.css        # Global styles
│   ├── main.tsx         # Entry point (.tsx)
│   └── vite-env.d.ts    # Vite type declarations
├── .gitignore
├── index.html           # HTML template
├── package.json         # Project config & dependencies
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration (.ts)
```
:::

## Understanding Key Files

### Entry Point (main)

::: code-group
```jsx [main.jsx]
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// This is where React "mounts" your app to the DOM
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

```tsx [main.tsx]
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// The '!' tells TypeScript we're sure this element exists
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```
:::

### App Component

::: code-group
```jsx [App.jsx]
import './App.css'

function App() {
  return (
    <div>
      <h1>Hello, React!</h1>
    </div>
  )
}

export default App
```

```tsx [App.tsx]
import './App.css'

function App(): JSX.Element {
  return (
    <div>
      <h1>Hello, React!</h1>
    </div>
  )
}

export default App
```
:::

## Your First React Component

Let's create a simple component:

::: code-group
```jsx [JavaScript]
// App.jsx
function App() {
  // This is JavaScript - you can use variables!
  const name = "React Developer"
  const currentYear = new Date().getFullYear()

  return (
    <div className="app">
      <h1>Welcome, {name}!</h1>
      <p>You're learning React in {currentYear}</p>
      <p>This is JSX - HTML-like syntax in JavaScript!</p>
    </div>
  )
}

export default App
```

```tsx [TypeScript]
// App.tsx
function App(): JSX.Element {
  // TypeScript infers these types automatically
  const name: string = "React Developer"
  const currentYear: number = new Date().getFullYear()

  return (
    <div className="app">
      <h1>Welcome, {name}!</h1>
      <p>You're learning React in {currentYear}</p>
      <p>This is TSX - HTML-like syntax in TypeScript!</p>
    </div>
  )
}

export default App
```
:::

## Creating Multiple Components

::: code-group
```jsx [JavaScript]
// App.jsx

// Component 1: Header
function Header() {
  return (
    <header>
      <h1>My React App</h1>
      <nav>
        <a href="#">Home</a>
        <a href="#">About</a>
        <a href="#">Contact</a>
      </nav>
    </header>
  )
}

// Component 2: Greeting Card
function GreetingCard({ message }) {
  return (
    <div className="card">
      <h2>Hello!</h2>
      <p>{message}</p>
    </div>
  )
}

// Component 3: Footer
function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer>
      <p>&copy; {year} My React App</p>
    </footer>
  )
}

// Main App Component
function App() {
  return (
    <div className="app">
      <Header />
      <main>
        <GreetingCard message="Welcome to React!" />
        <GreetingCard message="Components are reusable!" />
      </main>
      <Footer />
    </div>
  )
}

export default App
```

```tsx [TypeScript]
// App.tsx

// Component 1: Header
function Header(): JSX.Element {
  return (
    <header>
      <h1>My React App</h1>
      <nav>
        <a href="#">Home</a>
        <a href="#">About</a>
        <a href="#">Contact</a>
      </nav>
    </header>
  )
}

// Define props interface
interface GreetingCardProps {
  message: string;
}

// Component 2: Greeting Card (with typed props)
function GreetingCard({ message }: GreetingCardProps): JSX.Element {
  return (
    <div className="card">
      <h2>Hello!</h2>
      <p>{message}</p>
    </div>
  )
}

// Component 3: Footer
function Footer(): JSX.Element {
  const year: number = new Date().getFullYear()
  return (
    <footer>
      <p>&copy; {year} My React App</p>
    </footer>
  )
}

// Main App Component
function App(): JSX.Element {
  return (
    <div className="app">
      <Header />
      <main>
        <GreetingCard message="Welcome to React!" />
        <GreetingCard message="Components are reusable!" />
        {/* TypeScript error if message is missing or wrong type */}
      </main>
      <Footer />
    </div>
  )
}

export default App
```
:::

## Component Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                    Component Tree                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                         App                                 │
│                          │                                  │
│           ┌──────────────┼──────────────┐                  │
│           │              │              │                  │
│           ▼              ▼              ▼                  │
│        Header          main          Footer                │
│           │              │                                  │
│           │      ┌───────┴───────┐                         │
│           │      │               │                         │
│           │      ▼               ▼                         │
│          nav   Card 1         Card 2                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Adding Styles

::: code-group
```css [App.css]
/* CSS works the same for both JS and TS */
.app {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.card {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 20px;
  margin: 10px 0;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

header {
  background: #333;
  color: white;
  padding: 20px;
  margin-bottom: 20px;
}

header nav a {
  color: white;
  margin-right: 15px;
  text-decoration: none;
}

footer {
  text-align: center;
  padding: 20px;
  color: #666;
}
```
:::

### Inline Styles

::: code-group
```jsx [JavaScript]
function Card() {
  const cardStyle = {
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    padding: '20px',
    margin: '10px 0'
  }

  return (
    <div style={cardStyle}>
      <h2>Card Title</h2>
    </div>
  )
}
```

```tsx [TypeScript]
import { CSSProperties } from 'react'

function Card(): JSX.Element {
  const cardStyle: CSSProperties = {
    backgroundColor: '#f5f5f5',
    borderRadius: '8px',
    padding: '20px',
    margin: '10px 0'
  }

  return (
    <div style={cardStyle}>
      <h2>Card Title</h2>
    </div>
  )
}
```
:::

## TypeScript-Specific Concepts

If you're using TypeScript, here are some key concepts:

### Common React Types

```tsx
import { ReactNode, ReactElement, CSSProperties } from 'react';

interface Props {
  // For any renderable content (strings, numbers, elements)
  children: ReactNode;

  // For a single React element only
  icon: ReactElement;

  // For inline styles
  style?: CSSProperties;

  // For className
  className?: string;
}
```

### Props Interface Pattern

```tsx
// Define props interface
interface ButtonProps {
  label: string;
  onClick: () => void;
  disabled?: boolean;  // Optional prop
  variant?: 'primary' | 'secondary';  // Union type
}

// Use in component
function Button({ label, onClick, disabled = false, variant = 'primary' }: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant}`}
    >
      {label}
    </button>
  );
}
```

## Exercise: Build a Profile Card

::: code-group
```jsx [JavaScript]
// ProfileCard.jsx
function ProfileCard() {
  const user = {
    name: "Jane Doe",
    title: "Frontend Developer",
    location: "San Francisco, CA",
    skills: ["React", "JavaScript", "CSS"]
  }

  return (
    <div className="profile-card">
      <h2>{user.name}</h2>
      <p className="title">{user.title}</p>
      <p className="location">📍 {user.location}</p>
      <div className="skills">
        {user.skills.map((skill, index) => (
          <span key={index} className="skill-badge">
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
}

export default ProfileCard
```

```tsx [TypeScript]
// ProfileCard.tsx
interface User {
  name: string;
  title: string;
  location: string;
  skills: string[];
}

function ProfileCard(): JSX.Element {
  const user: User = {
    name: "Jane Doe",
    title: "Frontend Developer",
    location: "San Francisco, CA",
    skills: ["React", "TypeScript", "CSS"]
  }

  return (
    <div className="profile-card">
      <h2>{user.name}</h2>
      <p className="title">{user.title}</p>
      <p className="location">📍 {user.location}</p>
      <div className="skills">
        {user.skills.map((skill: string, index: number) => (
          <span key={index} className="skill-badge">
            {skill}
          </span>
        ))}
      </div>
    </div>
  )
}

export default ProfileCard
```
:::

## Common Mistakes to Avoid

### 1. Forgetting to Return JSX

```jsx
// ❌ Wrong - no return
function Broken() {
  <div>Hello</div>
}

// ✅ Correct
function Working() {
  return <div>Hello</div>
}
```

### 2. Multiple Root Elements

```jsx
// ❌ Wrong - multiple roots
function Broken() {
  return (
    <h1>Title</h1>
    <p>Paragraph</p>
  )
}

// ✅ Correct - wrap in single element or Fragment
function Working() {
  return (
    <>
      <h1>Title</h1>
      <p>Paragraph</p>
    </>
  )
}
```

### 3. Using class Instead of className

```jsx
// ❌ Wrong
<div class="container">

// ✅ Correct
<div className="container">
```

## Summary

| Concept | JavaScript | TypeScript |
|---------|------------|------------|
| File extension | `.jsx` | `.tsx` |
| Component | Function returning JSX | Function with return type |
| Props | Destructured object | Interface + destructure |
| Styles | Object or CSS | CSSProperties type |
| Entry point | `main.jsx` | `main.tsx` |

## What's Next?

In the next chapter, we'll dive deeper into [JSX/TSX](/guide/react/02-jsx) - the syntax that makes React so powerful.

---

[Next: JSX/TSX →](/guide/react/02-jsx)
