# Vue.js Tutorial

::: info Official Documentation
This tutorial is based on the official Vue.js documentation. For the most up-to-date information, visit: [https://vuejs.org/](https://vuejs.org/)
:::

Welcome to the Vue.js tutorial! Learn how to build modern, reactive web applications with the progressive JavaScript framework. This tutorial covers both **JavaScript** and **TypeScript** using the **Composition API**.

## What is Vue.js?

Vue.js is a **progressive JavaScript framework** for building user interfaces. It's designed to be incrementally adoptable and focuses on the view layer.

```
┌─────────────────────────────────────────────────────────────┐
│                    Vue.js Key Features                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   1. REACTIVE DATA BINDING                                  │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  Data changes → View updates automatically           │  │
│   │                                                      │  │
│   │   Data: { count: 0 }  ──────►  <p>Count: 0</p>      │  │
│   │   Data: { count: 5 }  ──────►  <p>Count: 5</p>      │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
│   2. COMPONENT-BASED                                        │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  Build UIs with reusable, self-contained pieces      │  │
│   │                                                      │  │
│   │   ┌──────┐  ┌──────┐  ┌──────┐                      │  │
│   │   │Header│  │ Card │  │Button│  ← Components        │  │
│   │   └──────┘  └──────┘  └──────┘                      │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
│   3. SINGLE-FILE COMPONENTS (SFC)                          │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  Template + Script + Style in one .vue file          │  │
│   │  Clean, organized, and maintainable code!            │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Options API vs Composition API

Vue 3 offers two ways to write components. This tutorial focuses on the **Composition API**:

| Feature | Options API | Composition API |
|---------|-------------|-----------------|
| Structure | Object with data, methods, computed | Setup function with reactive refs |
| Code Organization | By option type | By logical concern |
| TypeScript | Good support | Excellent support |
| Reusability | Mixins | Composables |
| Learning Curve | Easier for beginners | More flexible |
| Recommended | Vue 2 style | Vue 3 recommended |

::: tip Why Composition API?
The Composition API provides better TypeScript support, code reuse through composables, and more flexible code organization. It's the recommended approach for Vue 3.
:::

## JavaScript vs TypeScript

This tutorial provides examples in both JavaScript and TypeScript:

| Feature | JavaScript | TypeScript |
|---------|------------|------------|
| File Extension | `.vue` | `.vue` (with `<script lang="ts">`) |
| Type Safety | Runtime errors | Compile-time errors |
| IDE Support | Good | Excellent |
| Props Validation | Runtime only | Compile + Runtime |

## Why Learn Vue.js?

| Feature | Description |
|---------|-------------|
| **Easy to Learn** | Gentle learning curve, great documentation |
| **Reactive** | Automatic UI updates when data changes |
| **Flexible** | Use as much or as little as you need |
| **Performant** | Virtual DOM with optimized rendering |
| **Great Tooling** | Vue DevTools, Vite, Vue CLI |
| **Rich Ecosystem** | Vue Router, Pinia, Nuxt.js |

## What You'll Learn

### Beginner
- [Getting Started](/guide/vue/01-introduction) - Setup with Vite (JS & TS)
- [Template Syntax](/guide/vue/02-template-syntax) - Interpolation, directives, binding
- [Components & Props](/guide/vue/03-components) - Building blocks of Vue

### Intermediate
- [Reactivity & State](/guide/vue/04-reactivity) - ref, reactive, and state management
- [Event Handling](/guide/vue/05-events) - User interactions and custom events
- [Computed & Watchers](/guide/vue/06-computed-watchers) - Derived state and side effects

### Advanced
- [Form Handling](/guide/vue/07-forms) - v-model, validation, form components
- [Lifecycle Hooks](/guide/vue/08-lifecycle) - Component lifecycle management
- [Composables](/guide/vue/09-composables) - Reusable composition functions
- [Vue Router](/guide/vue/10-routing) - Single-page application routing

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
```vue [JavaScript]
<script setup>
import { ref } from 'vue'

// Reactive state
const count = ref(0)
const name = ref('Vue Developer')

// Methods
function increment() {
  count.value++
}
</script>

<template>
  <div class="app">
    <h1>Hello, {{ name }}!</h1>
    <p>Count: {{ count }}</p>
    <button @click="increment">Click me</button>
  </div>
</template>

<style scoped>
.app {
  text-align: center;
  padding: 20px;
}
button {
  padding: 10px 20px;
  font-size: 16px;
}
</style>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, Ref } from 'vue'

// Typed reactive state
const count: Ref<number> = ref(0)
const name: Ref<string> = ref('Vue Developer')

// Typed methods
function increment(): void {
  count.value++
}
</script>

<template>
  <div class="app">
    <h1>Hello, {{ name }}!</h1>
    <p>Count: {{ count }}</p>
    <button @click="increment">Click me</button>
  </div>
</template>

<style scoped>
.app {
  text-align: center;
  padding: 20px;
}
button {
  padding: 10px 20px;
  font-size: 16px;
}
</style>
```
:::

## Setting Up Your Environment

### JavaScript Setup

```bash
# Create a new Vue app with Vite (JavaScript)
npm create vue@latest my-vue-app

# When prompted, select:
# ✔ Add TypeScript? No
# ✔ Add JSX Support? No
# ✔ Add Vue Router? No (for now)
# ✔ Add Pinia? No (for now)

cd my-vue-app
npm install
npm run dev
```

### TypeScript Setup

```bash
# Create a new Vue app with Vite (TypeScript)
npm create vue@latest my-vue-app

# When prompted, select:
# ✔ Add TypeScript? Yes
# ✔ Add JSX Support? No
# ✔ Add Vue Router? No (for now)
# ✔ Add Pinia? No (for now)

cd my-vue-app
npm install
npm run dev
```

Your app will be running at `http://localhost:5173`

## Project Structure

::: code-group
```[JavaScript]
my-vue-app/
├── node_modules/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/           # Static assets
│   ├── components/       # Vue components
│   │   └── HelloWorld.vue
│   ├── App.vue           # Root component
│   └── main.js           # Entry point
├── index.html
├── package.json
└── vite.config.js
```

```[TypeScript]
my-vue-app/
├── node_modules/
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/           # Static assets
│   ├── components/       # Vue components
│   │   └── HelloWorld.vue
│   ├── App.vue           # Root component
│   ├── main.ts           # Entry point (.ts)
│   └── vite-env.d.ts     # Type declarations
├── index.html
├── package.json
├── tsconfig.json         # TypeScript config
└── vite.config.ts
```
:::

## Single-File Component (SFC) Structure

Every `.vue` file has three sections:

```vue
<!-- 1. SCRIPT - JavaScript/TypeScript logic -->
<script setup>
// Your component logic here
</script>

<!-- 2. TEMPLATE - HTML structure -->
<template>
  <div>Your HTML here</div>
</template>

<!-- 3. STYLE - CSS styling (scoped by default) -->
<style scoped>
/* Your CSS here */
</style>
```

## Video Tutorials

::: tip Recommended Video Resources
Learn Vue.js through these excellent video tutorials from the community.
:::

### Free Courses

| Course | Creator | Description |
|--------|---------|-------------|
| [Vue 3 Crash Course](https://www.youtube.com/watch?v=VeNfHj6MhgA) | Traversy Media | 1-hour crash course covering Vue 3 fundamentals |
| [Vue.js Course for Beginners](https://www.youtube.com/watch?v=FXpIoQ_rT_c) | freeCodeCamp | 3+ hour comprehensive beginner course |
| [Vue 3 Tutorial](https://www.youtube.com/playlist?list=PL4cUxeGkcC9hYYGbV60Vq3IXYNfDk8At1) | The Net Ninja | Complete playlist covering Vue 3 basics |
| [Vue 3 Composition API](https://www.youtube.com/watch?v=bwItFdPt-6M) | Fireship | Quick 100-second explanation of Vue |

### Official Resources

| Resource | Description |
|----------|-------------|
| [Vue Mastery (Free Intro)](https://www.vuemastery.com/courses/intro-to-vue-3/intro-to-vue3) | Official recommended course with free intro lessons |
| [Vue School (Free Lessons)](https://vueschool.io/courses/vuejs-3-fundamentals) | Vue 3 Fundamentals course |

### Topic-Specific Videos

| Topic | Video | Duration |
|-------|-------|----------|
| Composition API | [Vue 3 Composition API Tutorial](https://www.youtube.com/watch?v=V-xK3sbc7xI) | ~30 min |
| Vue Router | [Vue Router 4 Tutorial](https://www.youtube.com/watch?v=juocv4AtrHo) | ~20 min |
| Pinia State | [Pinia Crash Course](https://www.youtube.com/watch?v=JGC7aAC-3y8) | ~30 min |
| TypeScript + Vue | [Vue 3 + TypeScript](https://www.youtube.com/watch?v=JfI5PISLr9w) | ~45 min |

## Let's Begin!

Ready to start building with Vue? Head over to the [Getting Started](/guide/vue/01-introduction) guide!

---

[Get Started →](/guide/vue/01-introduction)
