# Getting Started with Vue.js

Vue.js is a progressive JavaScript framework for building user interfaces. In this tutorial, you'll learn how to set up Vue with both JavaScript and TypeScript, understand its core concepts, and create your first application.

## What is Vue.js?

Vue (pronounced "view") is a **progressive, component-based** framework for building user interfaces.

```
┌─────────────────────────────────────────────────────────────┐
│                    Vue.js Core Concepts                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   1. DECLARATIVE RENDERING                                  │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  Describe your UI as a function of state             │  │
│   │                                                      │  │
│   │  State: { message: "Hello" }                         │  │
│   │  Template: <p>{{ message }}</p>                      │  │
│   │  Result: <p>Hello</p>                                │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
│   2. REACTIVITY                                             │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  Vue tracks changes and updates the DOM              │  │
│   │                                                      │  │
│   │  Change data → Vue detects → Updates view            │  │
│   │  You don't manually manipulate the DOM! ⚡           │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
│   3. SINGLE-FILE COMPONENTS                                 │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  Template + Script + Style in one .vue file          │  │
│   │                                                      │  │
│   │  ┌─────────────────────────────────┐                │  │
│   │  │ <script setup>...</script>      │ ← Logic        │  │
│   │  │ <template>...</template>        │ ← Structure    │  │
│   │  │ <style>...</style>              │ ← Styling      │  │
│   │  └─────────────────────────────────┘                │  │
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

### Creating a Vue Project

::: code-group
```bash [JavaScript]
# Create new project with JavaScript
npm create vue@latest my-vue-app

# Select these options:
# ✔ Add TypeScript? No
# ✔ Add JSX Support? No
# ✔ Add Vue Router? No
# ✔ Add Pinia? No
# ✔ Add Vitest? No
# ✔ Add ESLint? Yes
# ✔ Add Prettier? Yes

# Navigate to project folder
cd my-vue-app

# Install dependencies
npm install

# Start development server
npm run dev
```

```bash [TypeScript]
# Create new project with TypeScript
npm create vue@latest my-vue-app

# Select these options:
# ✔ Add TypeScript? Yes
# ✔ Add JSX Support? No
# ✔ Add Vue Router? No
# ✔ Add Pinia? No
# ✔ Add Vitest? No
# ✔ Add ESLint? Yes
# ✔ Add Prettier? Yes

# Navigate to project folder
cd my-vue-app

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
my-vue-app/
├── node_modules/        # Dependencies
├── public/              # Static files
│   └── favicon.ico
├── src/                 # Your code goes here!
│   ├── assets/          # Images, fonts, etc.
│   ├── components/      # Vue components
│   │   └── HelloWorld.vue
│   ├── App.vue          # Root component
│   └── main.js          # Entry point
├── .gitignore
├── index.html           # HTML template
├── package.json         # Project config
└── vite.config.js       # Vite configuration
```

```[TypeScript Project]
my-vue-app/
├── node_modules/        # Dependencies
├── public/              # Static files
│   └── favicon.ico
├── src/                 # Your code goes here!
│   ├── assets/          # Images, fonts, etc.
│   ├── components/      # Vue components
│   │   └── HelloWorld.vue
│   ├── App.vue          # Root component
│   ├── main.ts          # Entry point (.ts)
│   └── vite-env.d.ts    # Type declarations
├── .gitignore
├── index.html           # HTML template
├── package.json         # Project config
├── tsconfig.json        # TypeScript config
└── vite.config.ts       # Vite configuration
```
:::

## Understanding Key Files

### Entry Point (main)

::: code-group
```js [main.js]
import { createApp } from 'vue'
import App from './App.vue'

import './assets/main.css'

// Create and mount the Vue application
createApp(App).mount('#app')
```

```ts [main.ts]
import { createApp } from 'vue'
import App from './App.vue'

import './assets/main.css'

// Create and mount the Vue application
// The app is mounted to the element with id="app"
createApp(App).mount('#app')
```
:::

### Root Component (App.vue)

::: code-group
```vue [JavaScript]
<script setup>
// Component logic here
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div>
    <h1>Hello Vue!</h1>
    <HelloWorld msg="Welcome to Vue 3" />
  </div>
</template>

<style scoped>
h1 {
  color: #42b883;
}
</style>
```

```vue [TypeScript]
<script setup lang="ts">
// Component logic here
import HelloWorld from './components/HelloWorld.vue'
</script>

<template>
  <div>
    <h1>Hello Vue!</h1>
    <HelloWorld msg="Welcome to Vue 3" />
  </div>
</template>

<style scoped>
h1 {
  color: #42b883;
}
</style>
```
:::

## Your First Vue Component

Let's create a simple component:

::: code-group
```vue [JavaScript]
<!-- src/App.vue -->
<script setup>
import { ref } from 'vue'

// Reactive state using ref()
const name = ref('Vue Developer')
const currentYear = new Date().getFullYear()
</script>

<template>
  <div class="app">
    <h1>Welcome, {{ name }}!</h1>
    <p>You're learning Vue in {{ currentYear }}</p>
    <p>This is a Single-File Component!</p>
  </div>
</template>

<style scoped>
.app {
  font-family: Arial, sans-serif;
  padding: 20px;
  text-align: center;
}

h1 {
  color: #42b883;
}
</style>
```

```vue [TypeScript]
<!-- src/App.vue -->
<script setup lang="ts">
import { ref, Ref } from 'vue'

// Typed reactive state
const name: Ref<string> = ref('Vue Developer')
const currentYear: number = new Date().getFullYear()
</script>

<template>
  <div class="app">
    <h1>Welcome, {{ name }}!</h1>
    <p>You're learning Vue in {{ currentYear }}</p>
    <p>This is a Single-File Component!</p>
  </div>
</template>

<style scoped>
.app {
  font-family: Arial, sans-serif;
  padding: 20px;
  text-align: center;
}

h1 {
  color: #42b883;
}
</style>
```
:::

## Understanding `<script setup>`

The `<script setup>` is a compile-time syntactic sugar for using the Composition API:

```
┌─────────────────────────────────────────────────────────────┐
│                    <script setup> Benefits                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   1. Less boilerplate code                                  │
│   2. Variables and imports are available in template        │
│   3. Better TypeScript support                              │
│   4. Better runtime performance                             │
│                                                             │
│   ┌─────────────────────┐    ┌─────────────────────┐       │
│   │ Without setup:      │    │ With setup:         │       │
│   │                     │    │                     │       │
│   │ export default {    │    │ <script setup>      │       │
│   │   setup() {         │ => │ const msg = ref('') │       │
│   │     const msg = ... │    │ </script>           │       │
│   │     return { msg }  │    │                     │       │
│   │   }                 │    │ Much cleaner! ✨    │       │
│   │ }                   │    │                     │       │
│   └─────────────────────┘    └─────────────────────┘       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Creating Multiple Components

::: code-group
```vue [JavaScript]
<!-- src/components/Header.vue -->
<script setup>
// No additional logic needed
</script>

<template>
  <header>
    <h1>My Vue App</h1>
    <nav>
      <a href="#">Home</a>
      <a href="#">About</a>
      <a href="#">Contact</a>
    </nav>
  </header>
</template>

<style scoped>
header {
  background: #333;
  color: white;
  padding: 20px;
}

nav a {
  color: white;
  margin-right: 15px;
  text-decoration: none;
}
</style>
```

```vue [TypeScript]
<!-- src/components/Header.vue -->
<script setup lang="ts">
// No additional logic needed
</script>

<template>
  <header>
    <h1>My Vue App</h1>
    <nav>
      <a href="#">Home</a>
      <a href="#">About</a>
      <a href="#">Contact</a>
    </nav>
  </header>
</template>

<style scoped>
header {
  background: #333;
  color: white;
  padding: 20px;
}

nav a {
  color: white;
  margin-right: 15px;
  text-decoration: none;
}
</style>
```
:::

::: code-group
```vue [JavaScript]
<!-- src/components/GreetingCard.vue -->
<script setup>
// Define props
const props = defineProps({
  message: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="card">
    <h2>Hello!</h2>
    <p>{{ message }}</p>
  </div>
</template>

<style scoped>
.card {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 20px;
  margin: 10px 0;
}
</style>
```

```vue [TypeScript]
<!-- src/components/GreetingCard.vue -->
<script setup lang="ts">
// Define typed props
interface Props {
  message: string
}

const props = defineProps<Props>()
</script>

<template>
  <div class="card">
    <h2>Hello!</h2>
    <p>{{ message }}</p>
  </div>
</template>

<style scoped>
.card {
  background: #f5f5f5;
  border-radius: 8px;
  padding: 20px;
  margin: 10px 0;
}
</style>
```
:::

::: code-group
```vue [JavaScript]
<!-- src/components/Footer.vue -->
<script setup>
const year = new Date().getFullYear()
</script>

<template>
  <footer>
    <p>&copy; {{ year }} My Vue App</p>
  </footer>
</template>

<style scoped>
footer {
  text-align: center;
  padding: 20px;
  color: #666;
}
</style>
```

```vue [TypeScript]
<!-- src/components/Footer.vue -->
<script setup lang="ts">
const year: number = new Date().getFullYear()
</script>

<template>
  <footer>
    <p>&copy; {{ year }} My Vue App</p>
  </footer>
</template>

<style scoped>
footer {
  text-align: center;
  padding: 20px;
  color: #666;
}
</style>
```
:::

### Using Components Together

::: code-group
```vue [JavaScript]
<!-- src/App.vue -->
<script setup>
import Header from './components/Header.vue'
import GreetingCard from './components/GreetingCard.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div class="app">
    <Header />
    <main>
      <GreetingCard message="Welcome to Vue!" />
      <GreetingCard message="Components are reusable!" />
    </main>
    <Footer />
  </div>
</template>

<style>
.app {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
}
</style>
```

```vue [TypeScript]
<!-- src/App.vue -->
<script setup lang="ts">
import Header from './components/Header.vue'
import GreetingCard from './components/GreetingCard.vue'
import Footer from './components/Footer.vue'
</script>

<template>
  <div class="app">
    <Header />
    <main>
      <GreetingCard message="Welcome to Vue!" />
      <GreetingCard message="Components are reusable!" />
    </main>
    <Footer />
  </div>
</template>

<style>
.app {
  font-family: Arial, sans-serif;
  max-width: 800px;
  margin: 0 auto;
}
</style>
```
:::

## Component Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                    Component Tree                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                         App.vue                             │
│                            │                                │
│           ┌────────────────┼────────────────┐              │
│           │                │                │              │
│           ▼                ▼                ▼              │
│       Header.vue        main           Footer.vue          │
│           │                │                               │
│           │        ┌───────┴───────┐                       │
│           │        │               │                       │
│           │        ▼               ▼                       │
│          nav   GreetingCard   GreetingCard                 │
│                   .vue           .vue                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Styling in Vue

### Scoped Styles

Styles with `scoped` only apply to the current component:

```vue
<style scoped>
/* Only affects THIS component */
h1 {
  color: red;
}
</style>
```

### Global Styles

Without `scoped`, styles apply globally:

```vue
<style>
/* Affects ALL components */
body {
  margin: 0;
  font-family: sans-serif;
}
</style>
```

### CSS Modules

::: code-group
```vue [JavaScript]
<script setup>
// Styles are available as $style
</script>

<template>
  <div :class="$style.card">
    <h2 :class="$style.title">Card Title</h2>
  </div>
</template>

<style module>
.card {
  background: #f5f5f5;
  padding: 20px;
}

.title {
  color: #42b883;
}
</style>
```

```vue [TypeScript]
<script setup lang="ts">
// Styles are available as $style
</script>

<template>
  <div :class="$style.card">
    <h2 :class="$style.title">Card Title</h2>
  </div>
</template>

<style module>
.card {
  background: #f5f5f5;
  padding: 20px;
}

.title {
  color: #42b883;
}
</style>
```
:::

## Exercise: Build a Profile Card

::: code-group
```vue [JavaScript]
<!-- src/components/ProfileCard.vue -->
<script setup>
import { ref } from 'vue'

const user = ref({
  name: 'Jane Doe',
  title: 'Frontend Developer',
  location: 'San Francisco, CA',
  skills: ['Vue', 'JavaScript', 'CSS']
})
</script>

<template>
  <div class="profile-card">
    <h2>{{ user.name }}</h2>
    <p class="title">{{ user.title }}</p>
    <p class="location">{{ user.location }}</p>
    <div class="skills">
      <span
        v-for="(skill, index) in user.skills"
        :key="index"
        class="skill-badge"
      >
        {{ skill }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.profile-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 300px;
}

h2 {
  margin: 0 0 8px 0;
  color: #333;
}

.title {
  color: #42b883;
  font-weight: 500;
  margin: 0 0 4px 0;
}

.location {
  color: #666;
  font-size: 14px;
}

.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.skill-badge {
  background: #e8f5e9;
  color: #42b883;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
}
</style>
```

```vue [TypeScript]
<!-- src/components/ProfileCard.vue -->
<script setup lang="ts">
import { ref, Ref } from 'vue'

interface User {
  name: string
  title: string
  location: string
  skills: string[]
}

const user: Ref<User> = ref({
  name: 'Jane Doe',
  title: 'Frontend Developer',
  location: 'San Francisco, CA',
  skills: ['Vue', 'TypeScript', 'CSS']
})
</script>

<template>
  <div class="profile-card">
    <h2>{{ user.name }}</h2>
    <p class="title">{{ user.title }}</p>
    <p class="location">{{ user.location }}</p>
    <div class="skills">
      <span
        v-for="(skill, index) in user.skills"
        :key="index"
        class="skill-badge"
      >
        {{ skill }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.profile-card {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 300px;
}

h2 {
  margin: 0 0 8px 0;
  color: #333;
}

.title {
  color: #42b883;
  font-weight: 500;
  margin: 0 0 4px 0;
}

.location {
  color: #666;
  font-size: 14px;
}

.skills {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 16px;
}

.skill-badge {
  background: #e8f5e9;
  color: #42b883;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 14px;
}
</style>
```
:::

## Common Mistakes to Avoid

### 1. Forgetting `.value` with ref

::: code-group
```vue [JavaScript]
<script setup>
import { ref } from 'vue'

const count = ref(0)

// ❌ Wrong - forgetting .value in script
function increment() {
  count++ // This won't work!
}

// ✅ Correct - use .value in script
function increment() {
  count.value++
}
</script>

<template>
  <!-- ✅ In template, .value is automatic -->
  <p>{{ count }}</p>
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, Ref } from 'vue'

const count: Ref<number> = ref(0)

// ❌ Wrong - forgetting .value in script
function increment(): void {
  count++ // TypeScript error!
}

// ✅ Correct - use .value in script
function increment(): void {
  count.value++
}
</script>

<template>
  <!-- ✅ In template, .value is automatic -->
  <p>{{ count }}</p>
</template>
```
:::

### 2. Missing `key` in v-for

```vue
<!-- ❌ Wrong - no key -->
<li v-for="item in items">{{ item }}</li>

<!-- ✅ Correct - with unique key -->
<li v-for="item in items" :key="item.id">{{ item.name }}</li>
```

### 3. Mutating Props Directly

::: code-group
```vue [JavaScript]
<script setup>
const props = defineProps({
  count: Number
})

// ❌ Wrong - mutating props
function increment() {
  props.count++ // Don't do this!
}

// ✅ Correct - emit event to parent
const emit = defineEmits(['update:count'])

function increment() {
  emit('update:count', props.count + 1)
}
</script>
```

```vue [TypeScript]
<script setup lang="ts">
interface Props {
  count: number
}

const props = defineProps<Props>()

// ❌ Wrong - mutating props
function increment(): void {
  props.count++ // TypeScript error!
}

// ✅ Correct - emit event to parent
const emit = defineEmits<{
  'update:count': [value: number]
}>()

function increment(): void {
  emit('update:count', props.count + 1)
}
</script>
```
:::

## Summary

| Concept | JavaScript | TypeScript |
|---------|------------|------------|
| Script Tag | `<script setup>` | `<script setup lang="ts">` |
| Reactive State | `ref(value)` | `ref<Type>(value)` |
| Props | `defineProps({...})` | `defineProps<Props>()` |
| Emits | `defineEmits([...])` | `defineEmits<{...}>()` |
| Entry Point | `main.js` | `main.ts` |

## What's Next?

In the next chapter, we'll dive deeper into [Template Syntax](/guide/vue/02-template-syntax) - Vue's powerful templating system.

---

[Next: Template Syntax →](/guide/vue/02-template-syntax)
