# Components & Props

Components are the building blocks of Vue applications. In this tutorial, you'll learn how to create reusable components, pass data through props, and emit events to communicate between components.

## What are Components?

Components are reusable, self-contained pieces of UI with their own template, logic, and styling.

```
┌─────────────────────────────────────────────────────────────┐
│                    Component Architecture                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────────────────────────────────────────────┐  │
│   │                      App.vue                         │  │
│   │  ┌─────────────────────────────────────────────┐    │  │
│   │  │              Header.vue                      │    │  │
│   │  └─────────────────────────────────────────────┘    │  │
│   │  ┌─────────────────────────────────────────────┐    │  │
│   │  │              Sidebar.vue                     │    │  │
│   │  │  ┌─────────┐ ┌─────────┐ ┌─────────┐        │    │  │
│   │  │  │NavItem  │ │NavItem  │ │NavItem  │        │    │  │
│   │  │  └─────────┘ └─────────┘ └─────────┘        │    │  │
│   │  └─────────────────────────────────────────────┘    │  │
│   │  ┌─────────────────────────────────────────────┐    │  │
│   │  │              Content.vue                     │    │  │
│   │  │  ┌─────────────────┐ ┌─────────────────┐    │    │  │
│   │  │  │   Card.vue      │ │   Card.vue      │    │    │  │
│   │  │  │   ┌─────────┐   │ │   ┌─────────┐   │    │    │  │
│   │  │  │   │ Button  │   │ │   │ Button  │   │    │    │  │
│   │  │  │   └─────────┘   │ │   └─────────┘   │    │    │  │
│   │  │  └─────────────────┘ └─────────────────┘    │    │  │
│   │  └─────────────────────────────────────────────┘    │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
│   Components can be nested and reused!                      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Creating Components

### Basic Component

::: code-group
```vue [JavaScript]
<!-- src/components/HelloWorld.vue -->
<script setup>
// Component logic goes here
const greeting = 'Hello from Component!'
</script>

<template>
  <div class="hello">
    <h1>{{ greeting }}</h1>
    <p>This is a Vue component</p>
  </div>
</template>

<style scoped>
.hello {
  padding: 20px;
  background: #f0f0f0;
  border-radius: 8px;
}
</style>
```

```vue [TypeScript]
<!-- src/components/HelloWorld.vue -->
<script setup lang="ts">
// Component logic goes here
const greeting: string = 'Hello from Component!'
</script>

<template>
  <div class="hello">
    <h1>{{ greeting }}</h1>
    <p>This is a Vue component</p>
  </div>
</template>

<style scoped>
.hello {
  padding: 20px;
  background: #f0f0f0;
  border-radius: 8px;
}
</style>
```
:::

### Using Components

::: code-group
```vue [JavaScript]
<!-- src/App.vue -->
<script setup>
// Import the component
import HelloWorld from './components/HelloWorld.vue'
import MyButton from './components/MyButton.vue'
</script>

<template>
  <div class="app">
    <!-- Use components in template -->
    <HelloWorld />
    <MyButton />

    <!-- Components can be used multiple times -->
    <HelloWorld />
  </div>
</template>
```

```vue [TypeScript]
<!-- src/App.vue -->
<script setup lang="ts">
// Import the component
import HelloWorld from './components/HelloWorld.vue'
import MyButton from './components/MyButton.vue'
</script>

<template>
  <div class="app">
    <!-- Use components in template -->
    <HelloWorld />
    <MyButton />

    <!-- Components can be used multiple times -->
    <HelloWorld />
  </div>
</template>
```
:::

## Props (Parent to Child)

Props allow you to pass data from parent components to child components.

```
┌─────────────────────────────────────────────────────────────┐
│                    Props Data Flow                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Parent Component                                          │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  <UserCard name="Alice" :age="25" />                │  │
│   └──────────────────────┬──────────────────────────────┘  │
│                          │                                  │
│                          ▼  Props flow DOWN                 │
│   Child Component                                           │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  defineProps({ name: String, age: Number })          │  │
│   │                                                      │  │
│   │  <h1>{{ name }}</h1>  <!-- Alice -->                 │  │
│   │  <p>Age: {{ age }}</p> <!-- 25 -->                   │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Defining Props

::: code-group
```vue [JavaScript]
<!-- src/components/UserCard.vue -->
<script setup>
// Option 1: Array syntax (simple)
// const props = defineProps(['name', 'email', 'age'])

// Option 2: Object syntax (with validation)
const props = defineProps({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    default: 'Not provided'
  },
  age: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: false
  }
})
</script>

<template>
  <div class="user-card" :class="{ active: isActive }">
    <h2>{{ name }}</h2>
    <p>Email: {{ email }}</p>
    <p>Age: {{ age }}</p>
    <span v-if="isActive" class="badge">Active</span>
  </div>
</template>

<style scoped>
.user-card {
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 8px 0;
}
.user-card.active {
  border-color: #42b883;
  background: #f0fff4;
}
.badge {
  background: #42b883;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}
</style>
```

```vue [TypeScript]
<!-- src/components/UserCard.vue -->
<script setup lang="ts">
// TypeScript interface for props
interface Props {
  name: string
  email?: string
  age?: number
  isActive?: boolean
}

// Define props with defaults
const props = withDefaults(defineProps<Props>(), {
  email: 'Not provided',
  age: 0,
  isActive: false
})
</script>

<template>
  <div class="user-card" :class="{ active: isActive }">
    <h2>{{ name }}</h2>
    <p>Email: {{ email }}</p>
    <p>Age: {{ age }}</p>
    <span v-if="isActive" class="badge">Active</span>
  </div>
</template>

<style scoped>
.user-card {
  padding: 16px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 8px 0;
}
.user-card.active {
  border-color: #42b883;
  background: #f0fff4;
}
.badge {
  background: #42b883;
  color: white;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 12px;
}
</style>
```
:::

### Passing Props

::: code-group
```vue [JavaScript]
<!-- src/App.vue -->
<script setup>
import { ref } from 'vue'
import UserCard from './components/UserCard.vue'

const users = ref([
  { id: 1, name: 'Alice', email: 'alice@email.com', age: 28, active: true },
  { id: 2, name: 'Bob', email: 'bob@email.com', age: 32, active: false },
  { id: 3, name: 'Charlie', age: 25, active: true }
])
</script>

<template>
  <div class="app">
    <!-- Static props -->
    <UserCard name="John Doe" email="john@example.com" />

    <!-- Dynamic props with v-bind (:) -->
    <UserCard
      :name="users[0].name"
      :email="users[0].email"
      :age="users[0].age"
      :is-active="users[0].active"
    />

    <!-- Passing all props from object -->
    <UserCard
      v-for="user in users"
      :key="user.id"
      :name="user.name"
      :email="user.email"
      :age="user.age"
      :is-active="user.active"
    />
  </div>
</template>
```

```vue [TypeScript]
<!-- src/App.vue -->
<script setup lang="ts">
import { ref, Ref } from 'vue'
import UserCard from './components/UserCard.vue'

interface User {
  id: number
  name: string
  email?: string
  age: number
  active: boolean
}

const users: Ref<User[]> = ref([
  { id: 1, name: 'Alice', email: 'alice@email.com', age: 28, active: true },
  { id: 2, name: 'Bob', email: 'bob@email.com', age: 32, active: false },
  { id: 3, name: 'Charlie', age: 25, active: true }
])
</script>

<template>
  <div class="app">
    <!-- Static props -->
    <UserCard name="John Doe" email="john@example.com" />

    <!-- Dynamic props with v-bind (:) -->
    <UserCard
      :name="users[0].name"
      :email="users[0].email"
      :age="users[0].age"
      :is-active="users[0].active"
    />

    <!-- Passing all props from object -->
    <UserCard
      v-for="user in users"
      :key="user.id"
      :name="user.name"
      :email="user.email"
      :age="user.age"
      :is-active="user.active"
    />
  </div>
</template>
```
:::

### Prop Types

| Type | Example | Notes |
|------|---------|-------|
| String | `prop="value"` | Static string |
| Number | `:prop="42"` | Must use v-bind |
| Boolean | `prop` or `:prop="true"` | Prop presence = true |
| Array | `:prop="[1, 2, 3]"` | Must use v-bind |
| Object | `:prop="{ key: 'value' }"` | Must use v-bind |
| Function | `:prop="handleClick"` | Pass function reference |

### Props Are Read-Only

::: warning Important
Props are one-way data flow. Never mutate props directly!
:::

::: code-group
```vue [JavaScript]
<script setup>
const props = defineProps({
  count: Number
})

// ❌ Wrong - Don't mutate props!
function increment() {
  props.count++ // This will cause a warning
}

// ✅ Correct - Use local state or emit event
import { ref } from 'vue'

const localCount = ref(props.count)

function increment() {
  localCount.value++
}
</script>
```

```vue [TypeScript]
<script setup lang="ts">
interface Props {
  count: number
}

const props = defineProps<Props>()

// ❌ Wrong - Don't mutate props!
function increment(): void {
  props.count++ // TypeScript error!
}

// ✅ Correct - Use local state or emit event
import { ref, Ref } from 'vue'

const localCount: Ref<number> = ref(props.count)

function increment(): void {
  localCount.value++
}
</script>
```
:::

## Emits (Child to Parent)

Emits allow child components to communicate back to parent components.

```
┌─────────────────────────────────────────────────────────────┐
│                    Emits Data Flow                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Parent Component                                          │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  <Counter @increment="handleIncrement" />            │  │
│   │                                                      │  │
│   │  function handleIncrement(value) {                   │  │
│   │    console.log('Received:', value)                   │  │
│   │  }                                                   │  │
│   └──────────────────────▲──────────────────────────────┘  │
│                          │                                  │
│                          │  Events flow UP                  │
│   Child Component        │                                  │
│   ┌──────────────────────┴──────────────────────────────┐  │
│   │  const emit = defineEmits(['increment'])             │  │
│   │                                                      │  │
│   │  emit('increment', newValue)                         │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Defining Emits

::: code-group
```vue [JavaScript]
<!-- src/components/Counter.vue -->
<script setup>
import { ref } from 'vue'

const props = defineProps({
  initialCount: {
    type: Number,
    default: 0
  }
})

// Define emits
const emit = defineEmits(['increment', 'decrement', 'reset'])

const count = ref(props.initialCount)

function increment() {
  count.value++
  emit('increment', count.value)
}

function decrement() {
  count.value--
  emit('decrement', count.value)
}

function reset() {
  count.value = 0
  emit('reset')
}
</script>

<template>
  <div class="counter">
    <button @click="decrement">-</button>
    <span>{{ count }}</span>
    <button @click="increment">+</button>
    <button @click="reset">Reset</button>
  </div>
</template>

<style scoped>
.counter {
  display: flex;
  gap: 10px;
  align-items: center;
}
button {
  padding: 8px 16px;
  font-size: 16px;
}
span {
  min-width: 40px;
  text-align: center;
  font-size: 20px;
}
</style>
```

```vue [TypeScript]
<!-- src/components/Counter.vue -->
<script setup lang="ts">
import { ref, Ref } from 'vue'

interface Props {
  initialCount?: number
}

const props = withDefaults(defineProps<Props>(), {
  initialCount: 0
})

// Define typed emits
const emit = defineEmits<{
  increment: [value: number]
  decrement: [value: number]
  reset: []
}>()

const count: Ref<number> = ref(props.initialCount)

function increment(): void {
  count.value++
  emit('increment', count.value)
}

function decrement(): void {
  count.value--
  emit('decrement', count.value)
}

function reset(): void {
  count.value = 0
  emit('reset')
}
</script>

<template>
  <div class="counter">
    <button @click="decrement">-</button>
    <span>{{ count }}</span>
    <button @click="increment">+</button>
    <button @click="reset">Reset</button>
  </div>
</template>

<style scoped>
.counter {
  display: flex;
  gap: 10px;
  align-items: center;
}
button {
  padding: 8px 16px;
  font-size: 16px;
}
span {
  min-width: 40px;
  text-align: center;
  font-size: 20px;
}
</style>
```
:::

### Listening to Emits

::: code-group
```vue [JavaScript]
<!-- src/App.vue -->
<script setup>
import { ref } from 'vue'
import Counter from './components/Counter.vue'

const total = ref(0)
const history = ref([])

function handleIncrement(value) {
  total.value = value
  history.value.push(`Incremented to ${value}`)
}

function handleDecrement(value) {
  total.value = value
  history.value.push(`Decremented to ${value}`)
}

function handleReset() {
  total.value = 0
  history.value.push('Reset to 0')
}
</script>

<template>
  <div class="app">
    <Counter
      :initial-count="5"
      @increment="handleIncrement"
      @decrement="handleDecrement"
      @reset="handleReset"
    />

    <p>Current total: {{ total }}</p>

    <div class="history">
      <h3>History:</h3>
      <p v-for="(item, index) in history" :key="index">{{ item }}</p>
    </div>
  </div>
</template>
```

```vue [TypeScript]
<!-- src/App.vue -->
<script setup lang="ts">
import { ref, Ref } from 'vue'
import Counter from './components/Counter.vue'

const total: Ref<number> = ref(0)
const history: Ref<string[]> = ref([])

function handleIncrement(value: number): void {
  total.value = value
  history.value.push(`Incremented to ${value}`)
}

function handleDecrement(value: number): void {
  total.value = value
  history.value.push(`Decremented to ${value}`)
}

function handleReset(): void {
  total.value = 0
  history.value.push('Reset to 0')
}
</script>

<template>
  <div class="app">
    <Counter
      :initial-count="5"
      @increment="handleIncrement"
      @decrement="handleDecrement"
      @reset="handleReset"
    />

    <p>Current total: {{ total }}</p>

    <div class="history">
      <h3>History:</h3>
      <p v-for="(item, index) in history" :key="index">{{ item }}</p>
    </div>
  </div>
</template>
```
:::

## Slots (Content Distribution)

Slots allow you to pass template content to components.

### Default Slot

::: code-group
```vue [JavaScript]
<!-- src/components/Card.vue -->
<script setup>
defineProps({
  title: String
})
</script>

<template>
  <div class="card">
    <h2 v-if="title">{{ title }}</h2>
    <!-- Default slot: content goes here -->
    <slot></slot>
  </div>
</template>

<style scoped>
.card {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 10px 0;
}
</style>
```

```vue [TypeScript]
<!-- src/components/Card.vue -->
<script setup lang="ts">
interface Props {
  title?: string
}

defineProps<Props>()
</script>

<template>
  <div class="card">
    <h2 v-if="title">{{ title }}</h2>
    <!-- Default slot: content goes here -->
    <slot></slot>
  </div>
</template>

<style scoped>
.card {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
  margin: 10px 0;
}
</style>
```
:::

Using the slot:

```vue
<template>
  <Card title="Welcome">
    <p>This content goes into the slot!</p>
    <button>Click me</button>
  </Card>
</template>
```

### Named Slots

::: code-group
```vue [JavaScript]
<!-- src/components/Layout.vue -->
<script setup>
// No props needed
</script>

<template>
  <div class="layout">
    <header>
      <slot name="header">Default Header</slot>
    </header>

    <main>
      <slot>Default Content</slot>
    </main>

    <footer>
      <slot name="footer">Default Footer</slot>
    </footer>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
header {
  background: #333;
  color: white;
  padding: 20px;
}
main {
  flex: 1;
  padding: 20px;
}
footer {
  background: #f0f0f0;
  padding: 20px;
  text-align: center;
}
</style>
```

```vue [TypeScript]
<!-- src/components/Layout.vue -->
<script setup lang="ts">
// No props needed
</script>

<template>
  <div class="layout">
    <header>
      <slot name="header">Default Header</slot>
    </header>

    <main>
      <slot>Default Content</slot>
    </main>

    <footer>
      <slot name="footer">Default Footer</slot>
    </footer>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}
header {
  background: #333;
  color: white;
  padding: 20px;
}
main {
  flex: 1;
  padding: 20px;
}
footer {
  background: #f0f0f0;
  padding: 20px;
  text-align: center;
}
</style>
```
:::

Using named slots:

```vue
<template>
  <Layout>
    <template #header>
      <h1>My App</h1>
      <nav>Navigation here</nav>
    </template>

    <!-- Default slot (no name needed) -->
    <p>Main content goes here</p>

    <template #footer>
      <p>&copy; 2024 My Company</p>
    </template>
  </Layout>
</template>
```

### Scoped Slots

Pass data from child to parent through slots:

::: code-group
```vue [JavaScript]
<!-- src/components/UserList.vue -->
<script setup>
import { ref } from 'vue'

const users = ref([
  { id: 1, name: 'Alice', role: 'Admin' },
  { id: 2, name: 'Bob', role: 'User' },
  { id: 3, name: 'Charlie', role: 'Editor' }
])
</script>

<template>
  <ul class="user-list">
    <li v-for="user in users" :key="user.id">
      <!-- Pass user data to parent through slot -->
      <slot :user="user" :index="user.id">
        <!-- Default content -->
        {{ user.name }}
      </slot>
    </li>
  </ul>
</template>
```

```vue [TypeScript]
<!-- src/components/UserList.vue -->
<script setup lang="ts">
import { ref, Ref } from 'vue'

interface User {
  id: number
  name: string
  role: string
}

const users: Ref<User[]> = ref([
  { id: 1, name: 'Alice', role: 'Admin' },
  { id: 2, name: 'Bob', role: 'User' },
  { id: 3, name: 'Charlie', role: 'Editor' }
])
</script>

<template>
  <ul class="user-list">
    <li v-for="user in users" :key="user.id">
      <!-- Pass user data to parent through slot -->
      <slot :user="user" :index="user.id">
        <!-- Default content -->
        {{ user.name }}
      </slot>
    </li>
  </ul>
</template>
```
:::

Using scoped slots:

```vue
<template>
  <UserList>
    <template #default="{ user, index }">
      <div class="custom-item">
        <span>{{ index }}. {{ user.name }}</span>
        <span class="role">{{ user.role }}</span>
      </div>
    </template>
  </UserList>
</template>
```

## Component v-model

Create two-way binding between parent and child:

::: code-group
```vue [JavaScript]
<!-- src/components/CustomInput.vue -->
<script setup>
const props = defineProps({
  modelValue: String
})

const emit = defineEmits(['update:modelValue'])

function updateValue(event) {
  emit('update:modelValue', event.target.value)
}
</script>

<template>
  <input
    :value="modelValue"
    @input="updateValue"
    class="custom-input"
  />
</template>

<style scoped>
.custom-input {
  padding: 10px;
  border: 2px solid #42b883;
  border-radius: 4px;
  font-size: 16px;
}
</style>
```

```vue [TypeScript]
<!-- src/components/CustomInput.vue -->
<script setup lang="ts">
interface Props {
  modelValue: string
}

const props = defineProps<Props>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function updateValue(event: Event): void {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<template>
  <input
    :value="modelValue"
    @input="updateValue"
    class="custom-input"
  />
</template>

<style scoped>
.custom-input {
  padding: 10px;
  border: 2px solid #42b883;
  border-radius: 4px;
  font-size: 16px;
}
</style>
```
:::

Using component v-model:

::: code-group
```vue [JavaScript]
<script setup>
import { ref } from 'vue'
import CustomInput from './components/CustomInput.vue'

const searchQuery = ref('')
</script>

<template>
  <!-- v-model works on custom components! -->
  <CustomInput v-model="searchQuery" />
  <p>You typed: {{ searchQuery }}</p>
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, Ref } from 'vue'
import CustomInput from './components/CustomInput.vue'

const searchQuery: Ref<string> = ref('')
</script>

<template>
  <!-- v-model works on custom components! -->
  <CustomInput v-model="searchQuery" />
  <p>You typed: {{ searchQuery }}</p>
</template>
```
:::

### Multiple v-model Bindings

::: code-group
```vue [JavaScript]
<!-- src/components/UserForm.vue -->
<script setup>
defineProps({
  firstName: String,
  lastName: String
})

const emit = defineEmits(['update:firstName', 'update:lastName'])
</script>

<template>
  <div class="user-form">
    <input
      :value="firstName"
      @input="emit('update:firstName', $event.target.value)"
      placeholder="First name"
    />
    <input
      :value="lastName"
      @input="emit('update:lastName', $event.target.value)"
      placeholder="Last name"
    />
  </div>
</template>
```

```vue [TypeScript]
<!-- src/components/UserForm.vue -->
<script setup lang="ts">
interface Props {
  firstName: string
  lastName: string
}

defineProps<Props>()

const emit = defineEmits<{
  'update:firstName': [value: string]
  'update:lastName': [value: string]
}>()
</script>

<template>
  <div class="user-form">
    <input
      :value="firstName"
      @input="emit('update:firstName', ($event.target as HTMLInputElement).value)"
      placeholder="First name"
    />
    <input
      :value="lastName"
      @input="emit('update:lastName', ($event.target as HTMLInputElement).value)"
      placeholder="Last name"
    />
  </div>
</template>
```
:::

Using multiple v-model:

```vue
<template>
  <UserForm
    v-model:first-name="first"
    v-model:last-name="last"
  />
  <p>Full name: {{ first }} {{ last }}</p>
</template>
```

## Practical Example: Todo List

::: code-group
```vue [JavaScript]
<!-- src/components/TodoItem.vue -->
<script setup>
const props = defineProps({
  todo: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['toggle', 'delete'])
</script>

<template>
  <div class="todo-item" :class="{ done: todo.done }">
    <input
      type="checkbox"
      :checked="todo.done"
      @change="emit('toggle', todo.id)"
    />
    <span>{{ todo.text }}</span>
    <button @click="emit('delete', todo.id)">Delete</button>
  </div>
</template>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-bottom: 1px solid #eee;
}
.todo-item.done span {
  text-decoration: line-through;
  color: #999;
}
button {
  margin-left: auto;
  padding: 4px 8px;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
```

```vue [TypeScript]
<!-- src/components/TodoItem.vue -->
<script setup lang="ts">
interface Todo {
  id: number
  text: string
  done: boolean
}

interface Props {
  todo: Todo
}

const props = defineProps<Props>()

const emit = defineEmits<{
  toggle: [id: number]
  delete: [id: number]
}>()
</script>

<template>
  <div class="todo-item" :class="{ done: todo.done }">
    <input
      type="checkbox"
      :checked="todo.done"
      @change="emit('toggle', todo.id)"
    />
    <span>{{ todo.text }}</span>
    <button @click="emit('delete', todo.id)">Delete</button>
  </div>
</template>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px;
  border-bottom: 1px solid #eee;
}
.todo-item.done span {
  text-decoration: line-through;
  color: #999;
}
button {
  margin-left: auto;
  padding: 4px 8px;
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
</style>
```
:::

::: code-group
```vue [JavaScript]
<!-- src/App.vue -->
<script setup>
import { ref } from 'vue'
import TodoItem from './components/TodoItem.vue'

const newTodo = ref('')
const todos = ref([
  { id: 1, text: 'Learn Vue basics', done: true },
  { id: 2, text: 'Build a component', done: false },
  { id: 3, text: 'Master props & emits', done: false }
])

let nextId = 4

function addTodo() {
  if (newTodo.value.trim()) {
    todos.value.push({
      id: nextId++,
      text: newTodo.value,
      done: false
    })
    newTodo.value = ''
  }
}

function toggleTodo(id) {
  const todo = todos.value.find(t => t.id === id)
  if (todo) {
    todo.done = !todo.done
  }
}

function deleteTodo(id) {
  todos.value = todos.value.filter(t => t.id !== id)
}
</script>

<template>
  <div class="todo-app">
    <h1>Todo List</h1>

    <div class="add-todo">
      <input
        v-model="newTodo"
        @keyup.enter="addTodo"
        placeholder="Add a new todo..."
      />
      <button @click="addTodo">Add</button>
    </div>

    <div class="todo-list">
      <TodoItem
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
        @toggle="toggleTodo"
        @delete="deleteTodo"
      />
    </div>

    <p class="stats">
      {{ todos.filter(t => t.done).length }} / {{ todos.length }} completed
    </p>
  </div>
</template>

<style scoped>
.todo-app {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}
.add-todo {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.add-todo input {
  flex: 1;
  padding: 10px;
  font-size: 16px;
}
.add-todo button {
  padding: 10px 20px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.stats {
  text-align: center;
  color: #666;
  margin-top: 20px;
}
</style>
```

```vue [TypeScript]
<!-- src/App.vue -->
<script setup lang="ts">
import { ref, Ref } from 'vue'
import TodoItem from './components/TodoItem.vue'

interface Todo {
  id: number
  text: string
  done: boolean
}

const newTodo: Ref<string> = ref('')
const todos: Ref<Todo[]> = ref([
  { id: 1, text: 'Learn Vue basics', done: true },
  { id: 2, text: 'Build a component', done: false },
  { id: 3, text: 'Master props & emits', done: false }
])

let nextId: number = 4

function addTodo(): void {
  if (newTodo.value.trim()) {
    todos.value.push({
      id: nextId++,
      text: newTodo.value,
      done: false
    })
    newTodo.value = ''
  }
}

function toggleTodo(id: number): void {
  const todo = todos.value.find(t => t.id === id)
  if (todo) {
    todo.done = !todo.done
  }
}

function deleteTodo(id: number): void {
  todos.value = todos.value.filter(t => t.id !== id)
}
</script>

<template>
  <div class="todo-app">
    <h1>Todo List</h1>

    <div class="add-todo">
      <input
        v-model="newTodo"
        @keyup.enter="addTodo"
        placeholder="Add a new todo..."
      />
      <button @click="addTodo">Add</button>
    </div>

    <div class="todo-list">
      <TodoItem
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
        @toggle="toggleTodo"
        @delete="deleteTodo"
      />
    </div>

    <p class="stats">
      {{ todos.filter(t => t.done).length }} / {{ todos.length }} completed
    </p>
  </div>
</template>

<style scoped>
.todo-app {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
}
.add-todo {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}
.add-todo input {
  flex: 1;
  padding: 10px;
  font-size: 16px;
}
.add-todo button {
  padding: 10px 20px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.stats {
  text-align: center;
  color: #666;
  margin-top: 20px;
}
</style>
```
:::

## Summary

| Concept | Purpose | Syntax |
|---------|---------|--------|
| Props | Pass data down | `defineProps()` |
| Emits | Send events up | `defineEmits()` |
| Slots | Pass content | `<slot>` |
| v-model | Two-way binding | `v-model` |

## What's Next?

In the next chapter, we'll learn about [Reactivity & State](/guide/vue/04-reactivity) - Vue's powerful reactivity system.

---

[Previous: Template Syntax](/guide/vue/02-template-syntax) | [Next: Reactivity & State →](/guide/vue/04-reactivity)
