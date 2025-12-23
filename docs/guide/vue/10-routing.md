# Vue Router

Vue Router is the official routing library for Vue.js. It enables navigation between pages in single-page applications (SPAs). In this tutorial, you'll learn how to set up and use Vue Router.

## Installation

```bash
npm install vue-router@4
```

## Basic Setup

::: code-group
```js [JavaScript - router/index.js]
// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    component: About
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```

```ts [TypeScript - router/index.ts]
// src/router/index.ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import Home from '@/views/Home.vue'
import About from '@/views/About.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    component: About
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
```
:::

Register in main:

::: code-group
```js [JavaScript - main.js]
// src/main.js
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App)
  .use(router)
  .mount('#app')
```

```ts [TypeScript - main.ts]
// src/main.ts
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

createApp(App)
  .use(router)
  .mount('#app')
```
:::

## Navigation Components

### RouterLink and RouterView

::: code-group
```vue [JavaScript]
<!-- src/App.vue -->
<script setup>
// Router components are globally available
</script>

<template>
  <div id="app">
    <nav>
      <!-- RouterLink for navigation -->
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <RouterLink :to="{ name: 'about' }">About (by name)</RouterLink>
    </nav>

    <!-- RouterView renders the matched component -->
    <RouterView />
  </div>
</template>

<style>
nav {
  padding: 20px;
}
nav a {
  margin-right: 15px;
}
/* Active link styling */
nav a.router-link-active {
  color: #42b883;
  font-weight: bold;
}
</style>
```

```vue [TypeScript]
<!-- src/App.vue -->
<script setup lang="ts">
// Router components are globally available
</script>

<template>
  <div id="app">
    <nav>
      <!-- RouterLink for navigation -->
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <RouterLink :to="{ name: 'about' }">About (by name)</RouterLink>
    </nav>

    <!-- RouterView renders the matched component -->
    <RouterView />
  </div>
</template>

<style>
nav {
  padding: 20px;
}
nav a {
  margin-right: 15px;
}
/* Active link styling */
nav a.router-link-active {
  color: #42b883;
  font-weight: bold;
}
</style>
```
:::

## Dynamic Routes

### Route Parameters

::: code-group
```js [JavaScript - router/index.js]
const routes = [
  {
    path: '/users/:id',
    name: 'user',
    component: () => import('@/views/User.vue')
  },
  {
    path: '/posts/:category/:id',
    name: 'post',
    component: () => import('@/views/Post.vue')
  }
]
```

```ts [TypeScript - router/index.ts]
const routes: RouteRecordRaw[] = [
  {
    path: '/users/:id',
    name: 'user',
    component: () => import('@/views/User.vue')
  },
  {
    path: '/posts/:category/:id',
    name: 'post',
    component: () => import('@/views/Post.vue')
  }
]
```
:::

### Accessing Parameters

::: code-group
```vue [JavaScript]
<!-- src/views/User.vue -->
<script setup>
import { useRoute } from 'vue-router'
import { ref, watch } from 'vue'

const route = useRoute()

// Access route params
const userId = ref(route.params.id)

// Watch for param changes
watch(
  () => route.params.id,
  (newId) => {
    userId.value = newId
    // Fetch new user data
  }
)
</script>

<template>
  <div>
    <h1>User {{ userId }}</h1>
    <p>Full path: {{ route.fullPath }}</p>
    <p>Query: {{ route.query }}</p>
  </div>
</template>
```

```vue [TypeScript]
<!-- src/views/User.vue -->
<script setup lang="ts">
import { useRoute, RouteLocationNormalizedLoaded } from 'vue-router'
import { ref, watch, Ref } from 'vue'

const route: RouteLocationNormalizedLoaded = useRoute()

// Access route params
const userId: Ref<string | string[]> = ref(route.params.id)

// Watch for param changes
watch(
  () => route.params.id,
  (newId: string | string[]) => {
    userId.value = newId
    // Fetch new user data
  }
)
</script>

<template>
  <div>
    <h1>User {{ userId }}</h1>
    <p>Full path: {{ route.fullPath }}</p>
    <p>Query: {{ route.query }}</p>
  </div>
</template>
```
:::

## Programmatic Navigation

::: code-group
```vue [JavaScript]
<script setup>
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

function goToUser(id) {
  // Navigate by path
  router.push(`/users/${id}`)

  // Navigate by name with params
  router.push({ name: 'user', params: { id } })

  // Navigate with query
  router.push({ path: '/search', query: { q: 'vue' } })

  // Replace history (no back button)
  router.replace('/new-page')

  // Go back/forward
  router.go(-1)  // back
  router.go(1)   // forward
}
</script>

<template>
  <div>
    <button @click="goToUser(1)">Go to User 1</button>
    <button @click="router.push('/')">Go Home</button>
    <button @click="router.back()">Back</button>
  </div>
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { useRouter, useRoute, Router, RouteLocationNormalizedLoaded } from 'vue-router'

const router: Router = useRouter()
const route: RouteLocationNormalizedLoaded = useRoute()

function goToUser(id: number): void {
  // Navigate by path
  router.push(`/users/${id}`)

  // Navigate by name with params
  router.push({ name: 'user', params: { id: id.toString() } })

  // Navigate with query
  router.push({ path: '/search', query: { q: 'vue' } })

  // Replace history (no back button)
  router.replace('/new-page')

  // Go back/forward
  router.go(-1)  // back
  router.go(1)   // forward
}
</script>

<template>
  <div>
    <button @click="goToUser(1)">Go to User 1</button>
    <button @click="router.push('/')">Go Home</button>
    <button @click="router.back()">Back</button>
  </div>
</template>
```
:::

## Navigation Guards

### Global Guards

::: code-group
```js [JavaScript - router/index.js]
const router = createRouter({
  history: createWebHistory(),
  routes
})

// Global before guard
router.beforeEach((to, from) => {
  const isAuthenticated = localStorage.getItem('token')

  // Redirect to login if accessing protected route
  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // Allow navigation
  return true
})

// Global after hook
router.afterEach((to, from) => {
  // Update document title
  document.title = to.meta.title || 'My App'
})
```

```ts [TypeScript - router/index.ts]
import { createRouter, createWebHistory, RouteLocationNormalized } from 'vue-router'

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Global before guard
router.beforeEach((to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  const isAuthenticated = localStorage.getItem('token')

  // Redirect to login if accessing protected route
  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  // Allow navigation
  return true
})

// Global after hook
router.afterEach((to: RouteLocationNormalized) => {
  // Update document title
  document.title = (to.meta.title as string) || 'My App'
})
```
:::

### Route-Level Guards

::: code-group
```js [JavaScript]
const routes = [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true, title: 'Dashboard' },
    beforeEnter: (to, from) => {
      // Route-specific guard
      const hasPermission = checkPermission()
      if (!hasPermission) {
        return { name: 'unauthorized' }
      }
    }
  }
]
```

```ts [TypeScript]
const routes: RouteRecordRaw[] = [
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/views/Dashboard.vue'),
    meta: { requiresAuth: true, title: 'Dashboard' },
    beforeEnter: (to, from) => {
      // Route-specific guard
      const hasPermission = checkPermission()
      if (!hasPermission) {
        return { name: 'unauthorized' }
      }
    }
  }
]
```
:::

### Component Guards

::: code-group
```vue [JavaScript]
<script setup>
import { onBeforeRouteLeave, onBeforeRouteUpdate } from 'vue-router'
import { ref } from 'vue'

const hasUnsavedChanges = ref(false)

// Before leaving this route
onBeforeRouteLeave((to, from) => {
  if (hasUnsavedChanges.value) {
    const answer = window.confirm('You have unsaved changes. Leave anyway?')
    if (!answer) return false
  }
})

// When route params change (same component)
onBeforeRouteUpdate((to, from) => {
  // Fetch new data when params change
  console.log('Route updated:', to.params)
})
</script>
```

```vue [TypeScript]
<script setup lang="ts">
import { onBeforeRouteLeave, onBeforeRouteUpdate, RouteLocationNormalized } from 'vue-router'
import { ref, Ref } from 'vue'

const hasUnsavedChanges: Ref<boolean> = ref(false)

// Before leaving this route
onBeforeRouteLeave((to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  if (hasUnsavedChanges.value) {
    const answer = window.confirm('You have unsaved changes. Leave anyway?')
    if (!answer) return false
  }
})

// When route params change (same component)
onBeforeRouteUpdate((to: RouteLocationNormalized, from: RouteLocationNormalized) => {
  // Fetch new data when params change
  console.log('Route updated:', to.params)
})
</script>
```
:::

## Nested Routes

::: code-group
```js [JavaScript - router/index.js]
const routes = [
  {
    path: '/users',
    component: () => import('@/views/UsersLayout.vue'),
    children: [
      {
        path: '',
        name: 'users',
        component: () => import('@/views/UsersList.vue')
      },
      {
        path: ':id',
        name: 'user',
        component: () => import('@/views/UserDetail.vue')
      },
      {
        path: ':id/edit',
        name: 'user-edit',
        component: () => import('@/views/UserEdit.vue')
      }
    ]
  }
]
```

```ts [TypeScript - router/index.ts]
const routes: RouteRecordRaw[] = [
  {
    path: '/users',
    component: () => import('@/views/UsersLayout.vue'),
    children: [
      {
        path: '',
        name: 'users',
        component: () => import('@/views/UsersList.vue')
      },
      {
        path: ':id',
        name: 'user',
        component: () => import('@/views/UserDetail.vue')
      },
      {
        path: ':id/edit',
        name: 'user-edit',
        component: () => import('@/views/UserEdit.vue')
      }
    ]
  }
]
```
:::

Parent layout with nested RouterView:

```vue
<!-- src/views/UsersLayout.vue -->
<template>
  <div class="users-layout">
    <nav>
      <RouterLink :to="{ name: 'users' }">All Users</RouterLink>
    </nav>

    <!-- Nested routes render here -->
    <RouterView />
  </div>
</template>
```

## Lazy Loading Routes

::: code-group
```js [JavaScript]
const routes = [
  {
    path: '/',
    name: 'home',
    // Eagerly loaded
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    // Lazy loaded - creates separate chunk
    component: () => import('@/views/About.vue')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    // With chunk name for better debugging
    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard.vue')
  }
]
```

```ts [TypeScript]
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    // Eagerly loaded
    component: Home
  },
  {
    path: '/about',
    name: 'about',
    // Lazy loaded - creates separate chunk
    component: () => import('@/views/About.vue')
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    // With chunk name for better debugging
    component: () => import(/* webpackChunkName: "dashboard" */ '@/views/Dashboard.vue')
  }
]
```
:::

## 404 Not Found

::: code-group
```js [JavaScript]
const routes = [
  // ... other routes

  // Catch-all 404 route (must be last)
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFound.vue')
  }
]
```

```ts [TypeScript]
const routes: RouteRecordRaw[] = [
  // ... other routes

  // Catch-all 404 route (must be last)
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    component: () => import('@/views/NotFound.vue')
  }
]
```
:::

## Summary

| Feature | Description |
|---------|-------------|
| `RouterLink` | Navigation component |
| `RouterView` | Renders matched component |
| `useRouter()` | Programmatic navigation |
| `useRoute()` | Access current route |
| Route params | Dynamic path segments `:id` |
| Navigation guards | Control route access |
| Nested routes | Child route components |
| Lazy loading | Code splitting for routes |

## What's Next?

Congratulations! You've completed the Vue.js tutorial series. Here are some next steps:

- Explore [Pinia](https://pinia.vuejs.org/) for state management
- Learn about [Nuxt.js](https://nuxt.com/) for server-side rendering
- Build a full application with everything you've learned!

---

[Previous: Composables](/guide/vue/09-composables) | [Back to Vue Tutorial →](/guide/vue/)
