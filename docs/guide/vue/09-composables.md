# Composables

Composables are reusable functions that encapsulate stateful logic using Vue's Composition API. In this tutorial, you'll learn how to create and use composables to share logic across components.

## What are Composables?

Composables are functions that leverage Vue's reactivity system to create reusable, stateful logic.

```
┌─────────────────────────────────────────────────────────────┐
│                    Composables                               │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Traditional Approach         With Composables             │
│   ┌─────────────────────┐     ┌─────────────────────┐      │
│   │ Component A         │     │ useCounter()        │      │
│   │ - counter logic     │     │ - count             │      │
│   │ - mouse logic       │     │ - increment         │      │
│   └─────────────────────┘     │ - decrement         │      │
│   ┌─────────────────────┐     └─────────────────────┘      │
│   │ Component B         │              ↓                   │
│   │ - same counter      │     Used by multiple             │
│   │ - same mouse        │     components!                  │
│   └─────────────────────┘                                  │
│                                                             │
│   Problem: Duplicate code     Solution: Shared logic        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Creating Composables

### Basic Composable

::: code-group
```js [JavaScript - useCounter.js]
// src/composables/useCounter.js
import { ref } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)

  function increment() {
    count.value++
  }

  function decrement() {
    count.value--
  }

  function reset() {
    count.value = initialValue
  }

  return {
    count,
    increment,
    decrement,
    reset
  }
}
```

```ts [TypeScript - useCounter.ts]
// src/composables/useCounter.ts
import { ref, Ref } from 'vue'

interface UseCounterReturn {
  count: Ref<number>
  increment: () => void
  decrement: () => void
  reset: () => void
}

export function useCounter(initialValue: number = 0): UseCounterReturn {
  const count: Ref<number> = ref(initialValue)

  function increment(): void {
    count.value++
  }

  function decrement(): void {
    count.value--
  }

  function reset(): void {
    count.value = initialValue
  }

  return {
    count,
    increment,
    decrement,
    reset
  }
}
```
:::

### Using the Composable

::: code-group
```vue [JavaScript]
<script setup>
import { useCounter } from '@/composables/useCounter'

// Each component gets its own state
const { count, increment, decrement, reset } = useCounter(10)

// You can use multiple counters
const counter2 = useCounter(0)
</script>

<template>
  <div>
    <h2>Counter 1: {{ count }}</h2>
    <button @click="decrement">-</button>
    <button @click="increment">+</button>
    <button @click="reset">Reset</button>

    <h2>Counter 2: {{ counter2.count }}</h2>
    <button @click="counter2.increment">+</button>
  </div>
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { useCounter } from '@/composables/useCounter'

// Each component gets its own state
const { count, increment, decrement, reset } = useCounter(10)

// You can use multiple counters
const counter2 = useCounter(0)
</script>

<template>
  <div>
    <h2>Counter 1: {{ count }}</h2>
    <button @click="decrement">-</button>
    <button @click="increment">+</button>
    <button @click="reset">Reset</button>

    <h2>Counter 2: {{ counter2.count }}</h2>
    <button @click="counter2.increment">+</button>
  </div>
</template>
```
:::

## Common Composable Patterns

### useFetch - Data Fetching

::: code-group
```js [JavaScript - useFetch.js]
// src/composables/useFetch.js
import { ref, watchEffect, toValue } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)
  const loading = ref(false)

  async function fetchData() {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(toValue(url))
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      data.value = await response.json()
    } catch (err) {
      error.value = err.message
    } finally {
      loading.value = false
    }
  }

  // Fetch immediately and refetch when url changes
  watchEffect(() => {
    fetchData()
  })

  return {
    data,
    error,
    loading,
    refetch: fetchData
  }
}
```

```ts [TypeScript - useFetch.ts]
// src/composables/useFetch.ts
import { ref, watchEffect, toValue, Ref, MaybeRefOrGetter } from 'vue'

interface UseFetchReturn<T> {
  data: Ref<T | null>
  error: Ref<string | null>
  loading: Ref<boolean>
  refetch: () => Promise<void>
}

export function useFetch<T>(url: MaybeRefOrGetter<string>): UseFetchReturn<T> {
  const data: Ref<T | null> = ref(null)
  const error: Ref<string | null> = ref(null)
  const loading: Ref<boolean> = ref(false)

  async function fetchData(): Promise<void> {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(toValue(url))
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      data.value = await response.json()
    } catch (err) {
      error.value = (err as Error).message
    } finally {
      loading.value = false
    }
  }

  // Fetch immediately and refetch when url changes
  watchEffect(() => {
    fetchData()
  })

  return {
    data,
    error,
    loading,
    refetch: fetchData
  }
}
```
:::

Usage:

::: code-group
```vue [JavaScript]
<script setup>
import { ref, computed } from 'vue'
import { useFetch } from '@/composables/useFetch'

const userId = ref(1)
const url = computed(() => `https://jsonplaceholder.typicode.com/users/${userId.value}`)

const { data: user, error, loading, refetch } = useFetch(url)
</script>

<template>
  <div>
    <select v-model="userId">
      <option v-for="id in 10" :key="id" :value="id">User {{ id }}</option>
    </select>

    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else-if="user">
      <h2>{{ user.name }}</h2>
      <p>{{ user.email }}</p>
    </div>

    <button @click="refetch">Refetch</button>
  </div>
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, computed, Ref, ComputedRef } from 'vue'
import { useFetch } from '@/composables/useFetch'

interface User {
  id: number
  name: string
  email: string
}

const userId: Ref<number> = ref(1)
const url: ComputedRef<string> = computed(() =>
  `https://jsonplaceholder.typicode.com/users/${userId.value}`
)

const { data: user, error, loading, refetch } = useFetch<User>(url)
</script>

<template>
  <div>
    <select v-model="userId">
      <option v-for="id in 10" :key="id" :value="id">User {{ id }}</option>
    </select>

    <div v-if="loading">Loading...</div>
    <div v-else-if="error">Error: {{ error }}</div>
    <div v-else-if="user">
      <h2>{{ user.name }}</h2>
      <p>{{ user.email }}</p>
    </div>

    <button @click="refetch">Refetch</button>
  </div>
</template>
```
:::

### useMouse - Mouse Position

::: code-group
```js [JavaScript - useMouse.js]
// src/composables/useMouse.js
import { ref, onMounted, onUnmounted } from 'vue'

export function useMouse() {
  const x = ref(0)
  const y = ref(0)

  function update(event) {
    x.value = event.clientX
    y.value = event.clientY
  }

  onMounted(() => {
    window.addEventListener('mousemove', update)
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', update)
  })

  return { x, y }
}
```

```ts [TypeScript - useMouse.ts]
// src/composables/useMouse.ts
import { ref, onMounted, onUnmounted, Ref } from 'vue'

interface UseMouseReturn {
  x: Ref<number>
  y: Ref<number>
}

export function useMouse(): UseMouseReturn {
  const x: Ref<number> = ref(0)
  const y: Ref<number> = ref(0)

  function update(event: MouseEvent): void {
    x.value = event.clientX
    y.value = event.clientY
  }

  onMounted(() => {
    window.addEventListener('mousemove', update)
  })

  onUnmounted(() => {
    window.removeEventListener('mousemove', update)
  })

  return { x, y }
}
```
:::

### useLocalStorage - Persistent State

::: code-group
```js [JavaScript - useLocalStorage.js]
// src/composables/useLocalStorage.js
import { ref, watch } from 'vue'

export function useLocalStorage(key, defaultValue) {
  // Get initial value from localStorage
  const stored = localStorage.getItem(key)
  const initial = stored ? JSON.parse(stored) : defaultValue

  const data = ref(initial)

  // Watch for changes and sync to localStorage
  watch(data, (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue))
  }, { deep: true })

  return data
}
```

```ts [TypeScript - useLocalStorage.ts]
// src/composables/useLocalStorage.ts
import { ref, watch, Ref } from 'vue'

export function useLocalStorage<T>(key: string, defaultValue: T): Ref<T> {
  // Get initial value from localStorage
  const stored = localStorage.getItem(key)
  const initial: T = stored ? JSON.parse(stored) : defaultValue

  const data: Ref<T> = ref(initial) as Ref<T>

  // Watch for changes and sync to localStorage
  watch(data, (newValue) => {
    localStorage.setItem(key, JSON.stringify(newValue))
  }, { deep: true })

  return data
}
```
:::

Usage:

```vue
<script setup>
import { useLocalStorage } from '@/composables/useLocalStorage'

// This persists to localStorage automatically!
const theme = useLocalStorage('theme', 'light')
const settings = useLocalStorage('settings', {
  notifications: true,
  language: 'en'
})
</script>

<template>
  <div>
    <select v-model="theme">
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>

    <label>
      <input type="checkbox" v-model="settings.notifications" />
      Enable notifications
    </label>
  </div>
</template>
```

### useDebounce - Debounced Value

::: code-group
```js [JavaScript - useDebounce.js]
// src/composables/useDebounce.js
import { ref, watch } from 'vue'

export function useDebounce(value, delay = 300) {
  const debouncedValue = ref(value.value)
  let timeout = null

  watch(value, (newValue) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      debouncedValue.value = newValue
    }, delay)
  })

  return debouncedValue
}
```

```ts [TypeScript - useDebounce.ts]
// src/composables/useDebounce.ts
import { ref, watch, Ref } from 'vue'

export function useDebounce<T>(value: Ref<T>, delay: number = 300): Ref<T> {
  const debouncedValue: Ref<T> = ref(value.value) as Ref<T>
  let timeout: ReturnType<typeof setTimeout> | null = null

  watch(value, (newValue: T) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => {
      debouncedValue.value = newValue
    }, delay)
  })

  return debouncedValue
}
```
:::

## Composable Best Practices

### Naming Convention

Always use `use` prefix:

```js
// ✅ Good
useCounter()
useFetch()
useAuth()

// ❌ Bad
counter()
fetchData()
auth()
```

### Return Reactive References

::: code-group
```js [JavaScript]
// ✅ Good - return refs (keeps reactivity)
export function useCounter() {
  const count = ref(0)
  return { count }
}

// ❌ Bad - returning .value loses reactivity
export function useCounter() {
  const count = ref(0)
  return { count: count.value }
}
```

```ts [TypeScript]
// ✅ Good - return refs (keeps reactivity)
export function useCounter(): { count: Ref<number> } {
  const count: Ref<number> = ref(0)
  return { count }
}

// ❌ Bad - returning .value loses reactivity
export function useCounter(): { count: number } {
  const count: Ref<number> = ref(0)
  return { count: count.value }  // Not reactive!
}
```
:::

### Clean Up Side Effects

Always clean up in `onUnmounted`:

```js
export function useEventListener(target, event, callback) {
  onMounted(() => {
    target.addEventListener(event, callback)
  })

  // ✅ Always clean up!
  onUnmounted(() => {
    target.removeEventListener(event, callback)
  })
}
```

## Summary

| Concept | Description |
|---------|-------------|
| Composable | Reusable function with Vue reactivity |
| Naming | Always prefix with `use` |
| State | Return refs to keep reactivity |
| Cleanup | Use `onUnmounted` for side effects |
| Sharing | Import and call in any component |

## What's Next?

In the next chapter, we'll learn about [Vue Router](/guide/vue/10-routing) - navigation in single-page applications.

---

[Previous: Lifecycle Hooks](/guide/vue/08-lifecycle) | [Next: Vue Router →](/guide/vue/10-routing)
