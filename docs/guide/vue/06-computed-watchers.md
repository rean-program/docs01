# Computed Properties & Watchers

Computed properties and watchers are essential tools for reactive data management in Vue. In this tutorial, you'll learn when and how to use each.

## Computed Properties

Computed properties are cached, reactive values derived from other reactive data.

```
┌─────────────────────────────────────────────────────────────┐
│                    Computed vs Methods                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Method:                         Computed:                 │
│   ┌─────────────────────┐        ┌─────────────────────┐   │
│   │ Called every time   │        │ Cached until deps   │   │
│   │ template re-renders │        │ change              │   │
│   │                     │        │                     │   │
│   │ getFullName()       │        │ fullName            │   │
│   │ getFullName()  ←────│────────│ (cached result)     │   │
│   │ getFullName()       │        │                     │   │
│   └─────────────────────┘        └─────────────────────┘   │
│                                                             │
│   Use computed for: derived data that depends on state     │
│   Use methods for: actions, event handlers                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Basic Computed

::: code-group
```vue [JavaScript]
<script setup>
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

// Computed property - automatically updates when deps change
const fullName = computed(() => {
  console.log('Computing fullName...')  // Only runs when deps change
  return `${firstName.value} ${lastName.value}`
})

// Computed with complex logic
const items = ref([
  { name: 'Apple', price: 1.5, quantity: 3 },
  { name: 'Banana', price: 0.75, quantity: 5 },
  { name: 'Orange', price: 2.0, quantity: 2 }
])

const totalPrice = computed(() => {
  return items.value.reduce((sum, item) => {
    return sum + (item.price * item.quantity)
  }, 0)
})

const itemCount = computed(() => {
  return items.value.reduce((sum, item) => sum + item.quantity, 0)
})
</script>

<template>
  <div>
    <input v-model="firstName" placeholder="First name" />
    <input v-model="lastName" placeholder="Last name" />
    <p>Full name: {{ fullName }}</p>

    <h3>Shopping Cart</h3>
    <p>Items: {{ itemCount }}</p>
    <p>Total: ${{ totalPrice.toFixed(2) }}</p>
  </div>
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, computed, Ref, ComputedRef } from 'vue'

const firstName: Ref<string> = ref('John')
const lastName: Ref<string> = ref('Doe')

// Computed property - automatically updates when deps change
const fullName: ComputedRef<string> = computed(() => {
  console.log('Computing fullName...')  // Only runs when deps change
  return `${firstName.value} ${lastName.value}`
})

interface Item {
  name: string
  price: number
  quantity: number
}

const items: Ref<Item[]> = ref([
  { name: 'Apple', price: 1.5, quantity: 3 },
  { name: 'Banana', price: 0.75, quantity: 5 },
  { name: 'Orange', price: 2.0, quantity: 2 }
])

const totalPrice: ComputedRef<number> = computed(() => {
  return items.value.reduce((sum, item) => {
    return sum + (item.price * item.quantity)
  }, 0)
})

const itemCount: ComputedRef<number> = computed(() => {
  return items.value.reduce((sum, item) => sum + item.quantity, 0)
})
</script>

<template>
  <div>
    <input v-model="firstName" placeholder="First name" />
    <input v-model="lastName" placeholder="Last name" />
    <p>Full name: {{ fullName }}</p>

    <h3>Shopping Cart</h3>
    <p>Items: {{ itemCount }}</p>
    <p>Total: ${{ totalPrice.toFixed(2) }}</p>
  </div>
</template>
```
:::

### Writable Computed

::: code-group
```vue [JavaScript]
<script setup>
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

// Writable computed with getter and setter
const fullName = computed({
  get() {
    return `${firstName.value} ${lastName.value}`
  },
  set(newValue) {
    const parts = newValue.split(' ')
    firstName.value = parts[0] || ''
    lastName.value = parts.slice(1).join(' ') || ''
  }
})

function updateFullName() {
  fullName.value = 'Jane Smith'  // This calls the setter
}
</script>

<template>
  <div>
    <p>First: {{ firstName }}</p>
    <p>Last: {{ lastName }}</p>

    <!-- Two-way binding with writable computed -->
    <input v-model="fullName" placeholder="Full name" />

    <button @click="updateFullName">Set to Jane Smith</button>
  </div>
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, computed, Ref, WritableComputedRef } from 'vue'

const firstName: Ref<string> = ref('John')
const lastName: Ref<string> = ref('Doe')

// Writable computed with getter and setter
const fullName: WritableComputedRef<string> = computed({
  get(): string {
    return `${firstName.value} ${lastName.value}`
  },
  set(newValue: string): void {
    const parts = newValue.split(' ')
    firstName.value = parts[0] || ''
    lastName.value = parts.slice(1).join(' ') || ''
  }
})

function updateFullName(): void {
  fullName.value = 'Jane Smith'  // This calls the setter
}
</script>

<template>
  <div>
    <p>First: {{ firstName }}</p>
    <p>Last: {{ lastName }}</p>

    <!-- Two-way binding with writable computed -->
    <input v-model="fullName" placeholder="Full name" />

    <button @click="updateFullName">Set to Jane Smith</button>
  </div>
</template>
```
:::

### Computed Best Practices

::: code-group
```vue [JavaScript]
<script setup>
import { ref, computed } from 'vue'

const users = ref([
  { id: 1, name: 'Alice', role: 'admin', active: true },
  { id: 2, name: 'Bob', role: 'user', active: false },
  { id: 3, name: 'Charlie', role: 'admin', active: true }
])

const searchQuery = ref('')
const selectedRole = ref('all')

// ✅ Good: Chain computed for complex filtering
const activeUsers = computed(() => {
  return users.value.filter(user => user.active)
})

const filteredByRole = computed(() => {
  if (selectedRole.value === 'all') return activeUsers.value
  return activeUsers.value.filter(user => user.role === selectedRole.value)
})

const searchResults = computed(() => {
  const query = searchQuery.value.toLowerCase()
  if (!query) return filteredByRole.value
  return filteredByRole.value.filter(user =>
    user.name.toLowerCase().includes(query)
  )
})

// ✅ Good: Computed for formatting
const userCount = computed(() => {
  const count = searchResults.value.length
  return `${count} user${count !== 1 ? 's' : ''} found`
})

// ❌ Bad: Don't use computed for side effects
// const badComputed = computed(() => {
//   console.log('Side effect!')  // Don't do this
//   localStorage.setItem('key', 'value')  // Don't do this
//   return someValue
// })
</script>

<template>
  <div>
    <input v-model="searchQuery" placeholder="Search users..." />
    <select v-model="selectedRole">
      <option value="all">All Roles</option>
      <option value="admin">Admin</option>
      <option value="user">User</option>
    </select>

    <p>{{ userCount }}</p>

    <ul>
      <li v-for="user in searchResults" :key="user.id">
        {{ user.name }} ({{ user.role }})
      </li>
    </ul>
  </div>
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, computed, Ref, ComputedRef } from 'vue'

interface User {
  id: number
  name: string
  role: 'admin' | 'user'
  active: boolean
}

const users: Ref<User[]> = ref([
  { id: 1, name: 'Alice', role: 'admin', active: true },
  { id: 2, name: 'Bob', role: 'user', active: false },
  { id: 3, name: 'Charlie', role: 'admin', active: true }
])

const searchQuery: Ref<string> = ref('')
const selectedRole: Ref<'all' | 'admin' | 'user'> = ref('all')

// ✅ Good: Chain computed for complex filtering
const activeUsers: ComputedRef<User[]> = computed(() => {
  return users.value.filter(user => user.active)
})

const filteredByRole: ComputedRef<User[]> = computed(() => {
  if (selectedRole.value === 'all') return activeUsers.value
  return activeUsers.value.filter(user => user.role === selectedRole.value)
})

const searchResults: ComputedRef<User[]> = computed(() => {
  const query = searchQuery.value.toLowerCase()
  if (!query) return filteredByRole.value
  return filteredByRole.value.filter(user =>
    user.name.toLowerCase().includes(query)
  )
})

// ✅ Good: Computed for formatting
const userCount: ComputedRef<string> = computed(() => {
  const count = searchResults.value.length
  return `${count} user${count !== 1 ? 's' : ''} found`
})
</script>

<template>
  <div>
    <input v-model="searchQuery" placeholder="Search users..." />
    <select v-model="selectedRole">
      <option value="all">All Roles</option>
      <option value="admin">Admin</option>
      <option value="user">User</option>
    </select>

    <p>{{ userCount }}</p>

    <ul>
      <li v-for="user in searchResults" :key="user.id">
        {{ user.name }} ({{ user.role }})
      </li>
    </ul>
  </div>
</template>
```
:::

## Watchers

Watchers let you perform side effects when reactive data changes.

```
┌─────────────────────────────────────────────────────────────┐
│                    Computed vs Watch                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Computed:                       Watch:                    │
│   ┌─────────────────────┐        ┌─────────────────────┐   │
│   │ • Returns a value   │        │ • Performs actions  │   │
│   │ • Cached            │        │ • Side effects OK   │   │
│   │ • Synchronous       │        │ • Can be async      │   │
│   │ • No side effects   │        │ • Access old value  │   │
│   └─────────────────────┘        └─────────────────────┘   │
│                                                             │
│   Use computed for: derived values                         │
│   Use watch for: API calls, localStorage, animations       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Basic Watch

::: code-group
```vue [JavaScript]
<script setup>
import { ref, watch } from 'vue'

const count = ref(0)
const message = ref('')

// Watch a single ref
watch(count, (newValue, oldValue) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`)
  message.value = `Count is now ${newValue}`
})

function increment() {
  count.value++
}
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>{{ message }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, watch, Ref } from 'vue'

const count: Ref<number> = ref(0)
const message: Ref<string> = ref('')

// Watch a single ref
watch(count, (newValue: number, oldValue: number) => {
  console.log(`Count changed from ${oldValue} to ${newValue}`)
  message.value = `Count is now ${newValue}`
})

function increment(): void {
  count.value++
}
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>{{ message }}</p>
    <button @click="increment">Increment</button>
  </div>
</template>
```
:::

### Watching Multiple Sources

::: code-group
```vue [JavaScript]
<script setup>
import { ref, watch } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')
const fullName = ref('')

// Watch multiple refs
watch([firstName, lastName], ([newFirst, newLast], [oldFirst, oldLast]) => {
  console.log(`Name changed from ${oldFirst} ${oldLast} to ${newFirst} ${newLast}`)
  fullName.value = `${newFirst} ${newLast}`
})
</script>

<template>
  <div>
    <input v-model="firstName" />
    <input v-model="lastName" />
    <p>Full name: {{ fullName }}</p>
  </div>
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, watch, Ref } from 'vue'

const firstName: Ref<string> = ref('John')
const lastName: Ref<string> = ref('Doe')
const fullName: Ref<string> = ref('')

// Watch multiple refs
watch(
  [firstName, lastName],
  ([newFirst, newLast]: [string, string], [oldFirst, oldLast]: [string, string]) => {
    console.log(`Name changed from ${oldFirst} ${oldLast} to ${newFirst} ${newLast}`)
    fullName.value = `${newFirst} ${newLast}`
  }
)
</script>

<template>
  <div>
    <input v-model="firstName" />
    <input v-model="lastName" />
    <p>Full name: {{ fullName }}</p>
  </div>
</template>
```
:::

### Watch Options

::: code-group
```vue [JavaScript]
<script setup>
import { ref, reactive, watch } from 'vue'

const searchQuery = ref('')
const user = reactive({
  name: 'John',
  profile: {
    age: 25,
    city: 'NYC'
  }
})

// immediate: run immediately on mount
watch(searchQuery, (newValue) => {
  console.log('Search:', newValue)
}, { immediate: true })

// deep: watch nested properties
watch(user, (newValue) => {
  console.log('User changed:', JSON.stringify(newValue))
}, { deep: true })

// Watch specific nested property with getter
watch(
  () => user.profile.age,
  (newAge) => {
    console.log('Age changed to:', newAge)
  }
)

// once: trigger only once (Vue 3.4+)
watch(searchQuery, (newValue) => {
  console.log('First search:', newValue)
}, { once: true })
</script>

<template>
  <div>
    <input v-model="searchQuery" placeholder="Search..." />
    <input v-model="user.name" placeholder="Name" />
    <input v-model.number="user.profile.age" placeholder="Age" type="number" />
    <input v-model="user.profile.city" placeholder="City" />
  </div>
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, reactive, watch, Ref } from 'vue'

const searchQuery: Ref<string> = ref('')

interface User {
  name: string
  profile: {
    age: number
    city: string
  }
}

const user: User = reactive({
  name: 'John',
  profile: {
    age: 25,
    city: 'NYC'
  }
})

// immediate: run immediately on mount
watch(searchQuery, (newValue: string) => {
  console.log('Search:', newValue)
}, { immediate: true })

// deep: watch nested properties
watch(user, (newValue: User) => {
  console.log('User changed:', JSON.stringify(newValue))
}, { deep: true })

// Watch specific nested property with getter
watch(
  () => user.profile.age,
  (newAge: number) => {
    console.log('Age changed to:', newAge)
  }
)
</script>

<template>
  <div>
    <input v-model="searchQuery" placeholder="Search..." />
    <input v-model="user.name" placeholder="Name" />
    <input v-model.number="user.profile.age" placeholder="Age" type="number" />
    <input v-model="user.profile.city" placeholder="City" />
  </div>
</template>
```
:::

### watchEffect

`watchEffect` automatically tracks dependencies and runs immediately:

::: code-group
```vue [JavaScript]
<script setup>
import { ref, watchEffect } from 'vue'

const count = ref(0)
const doubled = ref(0)

// Automatically tracks count and runs immediately
watchEffect(() => {
  doubled.value = count.value * 2
  console.log(`Count is ${count.value}, doubled is ${doubled.value}`)
})

// watchEffect with cleanup
const searchQuery = ref('')
const results = ref([])

watchEffect((onCleanup) => {
  const controller = new AbortController()

  // Simulate API call
  fetch(`/api/search?q=${searchQuery.value}`, {
    signal: controller.signal
  })
    .then(res => res.json())
    .then(data => {
      results.value = data
    })
    .catch(err => {
      if (err.name !== 'AbortError') {
        console.error(err)
      }
    })

  // Cleanup: abort previous request
  onCleanup(() => {
    controller.abort()
  })
})
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Doubled: {{ doubled }}</p>
    <button @click="count++">Increment</button>

    <input v-model="searchQuery" placeholder="Search..." />
  </div>
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, watchEffect, Ref, WatchStopHandle } from 'vue'

const count: Ref<number> = ref(0)
const doubled: Ref<number> = ref(0)

// Automatically tracks count and runs immediately
watchEffect(() => {
  doubled.value = count.value * 2
  console.log(`Count is ${count.value}, doubled is ${doubled.value}`)
})

// watchEffect with cleanup
const searchQuery: Ref<string> = ref('')
const results: Ref<any[]> = ref([])

watchEffect((onCleanup) => {
  const controller = new AbortController()

  // Simulate API call
  fetch(`/api/search?q=${searchQuery.value}`, {
    signal: controller.signal
  })
    .then(res => res.json())
    .then(data => {
      results.value = data
    })
    .catch((err: Error) => {
      if (err.name !== 'AbortError') {
        console.error(err)
      }
    })

  // Cleanup: abort previous request
  onCleanup(() => {
    controller.abort()
  })
})
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <p>Doubled: {{ doubled }}</p>
    <button @click="count++">Increment</button>

    <input v-model="searchQuery" placeholder="Search..." />
  </div>
</template>
```
:::

### Stopping Watchers

::: code-group
```vue [JavaScript]
<script setup>
import { ref, watch, watchEffect } from 'vue'

const count = ref(0)
const isWatching = ref(true)

// watch returns a stop function
const stopWatch = watch(count, (newValue) => {
  console.log('Count:', newValue)
})

const stopWatchEffect = watchEffect(() => {
  console.log('Effect: count is', count.value)
})

function toggleWatch() {
  if (isWatching.value) {
    stopWatch()
    stopWatchEffect()
    console.log('Watchers stopped')
  }
  isWatching.value = false
}
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="count++">Increment</button>
    <button @click="toggleWatch" :disabled="!isWatching">
      Stop Watching
    </button>
  </div>
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, watch, watchEffect, Ref, WatchStopHandle } from 'vue'

const count: Ref<number> = ref(0)
const isWatching: Ref<boolean> = ref(true)

// watch returns a stop function
const stopWatch: WatchStopHandle = watch(count, (newValue: number) => {
  console.log('Count:', newValue)
})

const stopWatchEffect: WatchStopHandle = watchEffect(() => {
  console.log('Effect: count is', count.value)
})

function toggleWatch(): void {
  if (isWatching.value) {
    stopWatch()
    stopWatchEffect()
    console.log('Watchers stopped')
  }
  isWatching.value = false
}
</script>

<template>
  <div>
    <p>Count: {{ count }}</p>
    <button @click="count++">Increment</button>
    <button @click="toggleWatch" :disabled="!isWatching">
      Stop Watching
    </button>
  </div>
</template>
```
:::

## Practical Example: Search with Debounce

::: code-group
```vue [JavaScript]
<script setup>
import { ref, watch, computed } from 'vue'

// Data
const products = ref([
  { id: 1, name: 'iPhone 15', category: 'Electronics', price: 999 },
  { id: 2, name: 'MacBook Pro', category: 'Electronics', price: 1999 },
  { id: 3, name: 'AirPods Pro', category: 'Electronics', price: 249 },
  { id: 4, name: 'Nike Air Max', category: 'Shoes', price: 150 },
  { id: 5, name: 'Adidas Ultraboost', category: 'Shoes', price: 180 }
])

// Search state
const searchQuery = ref('')
const debouncedQuery = ref('')
const selectedCategory = ref('all')
const minPrice = ref(0)
const maxPrice = ref(2000)
const isSearching = ref(false)

// Debounce search input
let debounceTimer = null
watch(searchQuery, (newQuery) => {
  isSearching.value = true
  clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    debouncedQuery.value = newQuery
    isSearching.value = false
  }, 300)
})

// Computed filtered results
const categories = computed(() => {
  const cats = new Set(products.value.map(p => p.category))
  return ['all', ...cats]
})

const filteredProducts = computed(() => {
  return products.value.filter(product => {
    // Search filter
    const matchesSearch = product.name
      .toLowerCase()
      .includes(debouncedQuery.value.toLowerCase())

    // Category filter
    const matchesCategory = selectedCategory.value === 'all' ||
      product.category === selectedCategory.value

    // Price filter
    const matchesPrice = product.price >= minPrice.value &&
      product.price <= maxPrice.value

    return matchesSearch && matchesCategory && matchesPrice
  })
})

const resultCount = computed(() => {
  return `${filteredProducts.value.length} of ${products.value.length} products`
})

// Watch for filter changes (for analytics, etc.)
watch([selectedCategory, minPrice, maxPrice], ([category, min, max]) => {
  console.log('Filters changed:', { category, min, max })
  // Could send analytics event here
})
</script>

<template>
  <div class="search-app">
    <h1>Product Search</h1>

    <div class="filters">
      <div class="search-box">
        <input
          v-model="searchQuery"
          placeholder="Search products..."
          class="search-input"
        />
        <span v-if="isSearching" class="searching">Searching...</span>
      </div>

      <select v-model="selectedCategory">
        <option v-for="cat in categories" :key="cat" :value="cat">
          {{ cat === 'all' ? 'All Categories' : cat }}
        </option>
      </select>

      <div class="price-range">
        <label>
          Min: ${{ minPrice }}
          <input type="range" v-model.number="minPrice" min="0" max="2000" />
        </label>
        <label>
          Max: ${{ maxPrice }}
          <input type="range" v-model.number="maxPrice" min="0" max="2000" />
        </label>
      </div>
    </div>

    <p class="result-count">{{ resultCount }}</p>

    <div class="products">
      <div v-for="product in filteredProducts" :key="product.id" class="product">
        <h3>{{ product.name }}</h3>
        <p class="category">{{ product.category }}</p>
        <p class="price">${{ product.price }}</p>
      </div>

      <p v-if="filteredProducts.length === 0" class="no-results">
        No products found
      </p>
    </div>
  </div>
</template>

<style scoped>
.search-app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.search-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
}

.searching {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 12px;
}

select {
  padding: 10px;
  font-size: 16px;
}

.price-range {
  display: flex;
  gap: 20px;
}

.price-range label {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.result-count {
  color: #666;
  margin-bottom: 15px;
}

.products {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.product {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.product h3 {
  margin: 0 0 10px 0;
}

.category {
  color: #666;
  font-size: 14px;
}

.price {
  color: #42b883;
  font-weight: bold;
  font-size: 18px;
}

.no-results {
  grid-column: 1 / -1;
  text-align: center;
  color: #999;
  padding: 40px;
}
</style>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, watch, computed, Ref, ComputedRef } from 'vue'

interface Product {
  id: number
  name: string
  category: string
  price: number
}

// Data
const products: Ref<Product[]> = ref([
  { id: 1, name: 'iPhone 15', category: 'Electronics', price: 999 },
  { id: 2, name: 'MacBook Pro', category: 'Electronics', price: 1999 },
  { id: 3, name: 'AirPods Pro', category: 'Electronics', price: 249 },
  { id: 4, name: 'Nike Air Max', category: 'Shoes', price: 150 },
  { id: 5, name: 'Adidas Ultraboost', category: 'Shoes', price: 180 }
])

// Search state
const searchQuery: Ref<string> = ref('')
const debouncedQuery: Ref<string> = ref('')
const selectedCategory: Ref<string> = ref('all')
const minPrice: Ref<number> = ref(0)
const maxPrice: Ref<number> = ref(2000)
const isSearching: Ref<boolean> = ref(false)

// Debounce search input
let debounceTimer: ReturnType<typeof setTimeout> | null = null
watch(searchQuery, (newQuery: string) => {
  isSearching.value = true
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(() => {
    debouncedQuery.value = newQuery
    isSearching.value = false
  }, 300)
})

// Computed filtered results
const categories: ComputedRef<string[]> = computed(() => {
  const cats = new Set(products.value.map(p => p.category))
  return ['all', ...cats]
})

const filteredProducts: ComputedRef<Product[]> = computed(() => {
  return products.value.filter(product => {
    const matchesSearch = product.name
      .toLowerCase()
      .includes(debouncedQuery.value.toLowerCase())

    const matchesCategory = selectedCategory.value === 'all' ||
      product.category === selectedCategory.value

    const matchesPrice = product.price >= minPrice.value &&
      product.price <= maxPrice.value

    return matchesSearch && matchesCategory && matchesPrice
  })
})

const resultCount: ComputedRef<string> = computed(() => {
  return `${filteredProducts.value.length} of ${products.value.length} products`
})

// Watch for filter changes
watch([selectedCategory, minPrice, maxPrice], ([category, min, max]) => {
  console.log('Filters changed:', { category, min, max })
})
</script>

<template>
  <div class="search-app">
    <h1>Product Search</h1>

    <div class="filters">
      <div class="search-box">
        <input
          v-model="searchQuery"
          placeholder="Search products..."
          class="search-input"
        />
        <span v-if="isSearching" class="searching">Searching...</span>
      </div>

      <select v-model="selectedCategory">
        <option v-for="cat in categories" :key="cat" :value="cat">
          {{ cat === 'all' ? 'All Categories' : cat }}
        </option>
      </select>

      <div class="price-range">
        <label>
          Min: ${{ minPrice }}
          <input type="range" v-model.number="minPrice" min="0" max="2000" />
        </label>
        <label>
          Max: ${{ maxPrice }}
          <input type="range" v-model.number="maxPrice" min="0" max="2000" />
        </label>
      </div>
    </div>

    <p class="result-count">{{ resultCount }}</p>

    <div class="products">
      <div v-for="product in filteredProducts" :key="product.id" class="product">
        <h3>{{ product.name }}</h3>
        <p class="category">{{ product.category }}</p>
        <p class="price">${{ product.price }}</p>
      </div>

      <p v-if="filteredProducts.length === 0" class="no-results">
        No products found
      </p>
    </div>
  </div>
</template>

<style scoped>
.search-app {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.filters {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 20px;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.search-input {
  width: 100%;
  padding: 10px;
  font-size: 16px;
}

.searching {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #999;
  font-size: 12px;
}

select {
  padding: 10px;
  font-size: 16px;
}

.price-range {
  display: flex;
  gap: 20px;
}

.price-range label {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.result-count {
  color: #666;
  margin-bottom: 15px;
}

.products {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
}

.product {
  padding: 15px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.product h3 {
  margin: 0 0 10px 0;
}

.category {
  color: #666;
  font-size: 14px;
}

.price {
  color: #42b883;
  font-weight: bold;
  font-size: 18px;
}

.no-results {
  grid-column: 1 / -1;
  text-align: center;
  color: #999;
  padding: 40px;
}
</style>
```
:::

## Summary

| Feature | Use Case | Syntax |
|---------|----------|--------|
| `computed` | Derived values | `computed(() => ...)` |
| Writable computed | Two-way derived values | `computed({ get, set })` |
| `watch` | React to specific changes | `watch(source, callback)` |
| `watchEffect` | Auto-track dependencies | `watchEffect(() => ...)` |
| `immediate` | Run on mount | `{ immediate: true }` |
| `deep` | Watch nested changes | `{ deep: true }` |

## What's Next?

In the next chapter, we'll learn about [Form Handling](/guide/vue/07-forms) - v-model and form validation.

---

[Previous: Event Handling](/guide/vue/05-events) | [Next: Form Handling →](/guide/vue/07-forms)
