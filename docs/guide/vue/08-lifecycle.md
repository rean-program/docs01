# Lifecycle Hooks

Every Vue component goes through a series of lifecycle stages. In this tutorial, you'll learn about lifecycle hooks and when to use each one.

## Lifecycle Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    Vue Component Lifecycle                   │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Creation Phase                                            │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  setup()                                             │  │
│   │     ↓                                                │  │
│   │  onBeforeMount()                                     │  │
│   │     ↓                                                │  │
│   │  onMounted() ← DOM is ready, fetch data here        │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
│   Update Phase (when reactive data changes)                │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  onBeforeUpdate() ← Before DOM updates               │  │
│   │     ↓                                                │  │
│   │  onUpdated() ← After DOM updates                     │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
│   Destruction Phase                                         │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  onBeforeUnmount() ← Cleanup timers, listeners       │  │
│   │     ↓                                                │  │
│   │  onUnmounted() ← Component is destroyed              │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Lifecycle Hooks Overview

| Hook | When it runs | Common use cases |
|------|--------------|------------------|
| `onBeforeMount` | Before initial render | Last-minute setup |
| `onMounted` | After DOM is rendered | API calls, DOM access |
| `onBeforeUpdate` | Before DOM updates | Access pre-update state |
| `onUpdated` | After DOM updates | Post-update DOM operations |
| `onBeforeUnmount` | Before component unmounts | Cleanup (timers, listeners) |
| `onUnmounted` | After component unmounts | Final cleanup |

## onMounted

The most commonly used hook - runs after the component is mounted to the DOM:

::: code-group
```vue [JavaScript]
<script setup>
import { ref, onMounted } from 'vue'

const data = ref(null)
const loading = ref(true)
const error = ref(null)
const containerRef = ref(null)

onMounted(async () => {
  console.log('Component mounted!')

  // Access DOM elements
  console.log('Container element:', containerRef.value)

  // Fetch data
  try {
    const response = await fetch('https://api.example.com/data')
    data.value = await response.json()
  } catch (err) {
    error.value = err.message
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div ref="containerRef">
    <p v-if="loading">Loading...</p>
    <p v-else-if="error">Error: {{ error }}</p>
    <div v-else>{{ data }}</div>
  </div>
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, onMounted, Ref } from 'vue'

interface DataType {
  id: number
  name: string
}

const data: Ref<DataType | null> = ref(null)
const loading: Ref<boolean> = ref(true)
const error: Ref<string | null> = ref(null)
const containerRef: Ref<HTMLDivElement | null> = ref(null)

onMounted(async () => {
  console.log('Component mounted!')

  // Access DOM elements
  console.log('Container element:', containerRef.value)

  // Fetch data
  try {
    const response = await fetch('https://api.example.com/data')
    data.value = await response.json()
  } catch (err) {
    error.value = (err as Error).message
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div ref="containerRef">
    <p v-if="loading">Loading...</p>
    <p v-else-if="error">Error: {{ error }}</p>
    <div v-else>{{ data }}</div>
  </div>
</template>
```
:::

## onBeforeUnmount & onUnmounted

Clean up resources when component is destroyed:

::: code-group
```vue [JavaScript]
<script setup>
import { ref, onMounted, onBeforeUnmount, onUnmounted } from 'vue'

const count = ref(0)
let intervalId = null

onMounted(() => {
  // Start a timer
  intervalId = setInterval(() => {
    count.value++
    console.log('Tick:', count.value)
  }, 1000)

  // Add event listener
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  console.log('Component about to unmount')
  // Clear the timer
  if (intervalId) {
    clearInterval(intervalId)
  }
})

onUnmounted(() => {
  console.log('Component unmounted')
  // Remove event listener
  window.removeEventListener('resize', handleResize)
})

function handleResize() {
  console.log('Window resized')
}
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
  </div>
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, onUnmounted, Ref } from 'vue'

const count: Ref<number> = ref(0)
let intervalId: ReturnType<typeof setInterval> | null = null

onMounted(() => {
  // Start a timer
  intervalId = setInterval(() => {
    count.value++
    console.log('Tick:', count.value)
  }, 1000)

  // Add event listener
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  console.log('Component about to unmount')
  // Clear the timer
  if (intervalId) {
    clearInterval(intervalId)
  }
})

onUnmounted(() => {
  console.log('Component unmounted')
  // Remove event listener
  window.removeEventListener('resize', handleResize)
})

function handleResize(): void {
  console.log('Window resized')
}
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
  </div>
</template>
```
:::

## onBeforeUpdate & onUpdated

::: code-group
```vue [JavaScript]
<script setup>
import { ref, onBeforeUpdate, onUpdated } from 'vue'

const count = ref(0)
const listRef = ref(null)

onBeforeUpdate(() => {
  console.log('Before update - count:', count.value)
  // Access DOM before it updates
  if (listRef.value) {
    console.log('List height before:', listRef.value.scrollHeight)
  }
})

onUpdated(() => {
  console.log('After update - count:', count.value)
  // Access DOM after it updates
  if (listRef.value) {
    console.log('List height after:', listRef.value.scrollHeight)
  }
})
</script>

<template>
  <div>
    <button @click="count++">Count: {{ count }}</button>
    <ul ref="listRef">
      <li v-for="n in count" :key="n">Item {{ n }}</li>
    </ul>
  </div>
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, onBeforeUpdate, onUpdated, Ref } from 'vue'

const count: Ref<number> = ref(0)
const listRef: Ref<HTMLUListElement | null> = ref(null)

onBeforeUpdate(() => {
  console.log('Before update - count:', count.value)
  if (listRef.value) {
    console.log('List height before:', listRef.value.scrollHeight)
  }
})

onUpdated(() => {
  console.log('After update - count:', count.value)
  if (listRef.value) {
    console.log('List height after:', listRef.value.scrollHeight)
  }
})
</script>

<template>
  <div>
    <button @click="count++">Count: {{ count }}</button>
    <ul ref="listRef">
      <li v-for="n in count" :key="n">Item {{ n }}</li>
    </ul>
  </div>
</template>
```
:::

## Practical Example: Data Fetching Component

::: code-group
```vue [JavaScript]
<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'

const props = defineProps({
  userId: {
    type: Number,
    required: true
  }
})

const user = ref(null)
const loading = ref(true)
const error = ref(null)
let abortController = null

async function fetchUser(id) {
  // Cancel previous request
  if (abortController) {
    abortController.abort()
  }

  abortController = new AbortController()
  loading.value = true
  error.value = null

  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users/${id}`,
      { signal: abortController.signal }
    )

    if (!response.ok) throw new Error('User not found')

    user.value = await response.json()
  } catch (err) {
    if (err.name !== 'AbortError') {
      error.value = err.message
    }
  } finally {
    loading.value = false
  }
}

// Fetch on mount
onMounted(() => {
  fetchUser(props.userId)
})

// Fetch when userId changes
watch(() => props.userId, (newId) => {
  fetchUser(newId)
})

// Cleanup on unmount
onBeforeUnmount(() => {
  if (abortController) {
    abortController.abort()
  }
})
</script>

<template>
  <div class="user-card">
    <div v-if="loading" class="loading">Loading user...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="user" class="user-info">
      <h2>{{ user.name }}</h2>
      <p>{{ user.email }}</p>
      <p>{{ user.company?.name }}</p>
    </div>
  </div>
</template>

<style scoped>
.user-card {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.loading {
  color: #666;
}
.error {
  color: red;
}
</style>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, Ref } from 'vue'

interface User {
  id: number
  name: string
  email: string
  company?: {
    name: string
  }
}

interface Props {
  userId: number
}

const props = defineProps<Props>()

const user: Ref<User | null> = ref(null)
const loading: Ref<boolean> = ref(true)
const error: Ref<string | null> = ref(null)
let abortController: AbortController | null = null

async function fetchUser(id: number): Promise<void> {
  // Cancel previous request
  if (abortController) {
    abortController.abort()
  }

  abortController = new AbortController()
  loading.value = true
  error.value = null

  try {
    const response = await fetch(
      `https://jsonplaceholder.typicode.com/users/${id}`,
      { signal: abortController.signal }
    )

    if (!response.ok) throw new Error('User not found')

    user.value = await response.json()
  } catch (err) {
    if ((err as Error).name !== 'AbortError') {
      error.value = (err as Error).message
    }
  } finally {
    loading.value = false
  }
}

// Fetch on mount
onMounted(() => {
  fetchUser(props.userId)
})

// Fetch when userId changes
watch(() => props.userId, (newId: number) => {
  fetchUser(newId)
})

// Cleanup on unmount
onBeforeUnmount(() => {
  if (abortController) {
    abortController.abort()
  }
})
</script>

<template>
  <div class="user-card">
    <div v-if="loading" class="loading">Loading user...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="user" class="user-info">
      <h2>{{ user.name }}</h2>
      <p>{{ user.email }}</p>
      <p>{{ user.company?.name }}</p>
    </div>
  </div>
</template>

<style scoped>
.user-card {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.loading {
  color: #666;
}
.error {
  color: red;
}
</style>
```
:::

## Summary

| Hook | Purpose | Example Use Case |
|------|---------|------------------|
| `onMounted` | After DOM ready | API calls, DOM manipulation |
| `onBeforeUnmount` | Before destroy | Cancel requests, clear timers |
| `onUnmounted` | After destroy | Remove event listeners |
| `onBeforeUpdate` | Before DOM update | Save scroll position |
| `onUpdated` | After DOM update | Update third-party libraries |

## What's Next?

In the next chapter, we'll learn about [Composables](/guide/vue/09-composables) - reusable composition functions.

---

[Previous: Form Handling](/guide/vue/07-forms) | [Next: Composables →](/guide/vue/09-composables)
