# Template Syntax

Vue uses an HTML-based template syntax that allows you to declaratively bind the rendered DOM to the underlying component's data. In this tutorial, you'll learn all about Vue's powerful templating features.

## Text Interpolation

The most basic form of data binding is text interpolation using "Mustache" syntax (double curly braces):

::: code-group
```vue [JavaScript]
<script setup>
import { ref } from 'vue'

const message = ref('Hello, Vue!')
const count = ref(42)
</script>

<template>
  <!-- Text interpolation -->
  <p>{{ message }}</p>
  <p>Count: {{ count }}</p>

  <!-- Expressions are allowed -->
  <p>{{ message.toUpperCase() }}</p>
  <p>{{ count * 2 }}</p>
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, Ref } from 'vue'

const message: Ref<string> = ref('Hello, Vue!')
const count: Ref<number> = ref(42)
</script>

<template>
  <!-- Text interpolation -->
  <p>{{ message }}</p>
  <p>Count: {{ count }}</p>

  <!-- Expressions are allowed -->
  <p>{{ message.toUpperCase() }}</p>
  <p>{{ count * 2 }}</p>
</template>
```
:::

## JavaScript Expressions

Vue supports full JavaScript expressions inside all data bindings:

::: code-group
```vue [JavaScript]
<script setup>
import { ref } from 'vue'

const number = ref(5)
const ok = ref(true)
const message = ref('hello')
const id = ref('item-123')
</script>

<template>
  <!-- Math operations -->
  <p>{{ number + 1 }}</p>

  <!-- Ternary operator -->
  <p>{{ ok ? 'YES' : 'NO' }}</p>

  <!-- Method calls -->
  <p>{{ message.split('').reverse().join('') }}</p>

  <!-- Template literals -->
  <p>{{ `ID: ${id}` }}</p>

  <!-- Array methods -->
  <p>{{ [1, 2, 3].map(n => n * 2).join(', ') }}</p>
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, Ref } from 'vue'

const number: Ref<number> = ref(5)
const ok: Ref<boolean> = ref(true)
const message: Ref<string> = ref('hello')
const id: Ref<string> = ref('item-123')
</script>

<template>
  <!-- Math operations -->
  <p>{{ number + 1 }}</p>

  <!-- Ternary operator -->
  <p>{{ ok ? 'YES' : 'NO' }}</p>

  <!-- Method calls -->
  <p>{{ message.split('').reverse().join('') }}</p>

  <!-- Template literals -->
  <p>{{ `ID: ${id}` }}</p>

  <!-- Array methods -->
  <p>{{ [1, 2, 3].map(n => n * 2).join(', ') }}</p>
</template>
```
:::

::: warning Expression Limitations
- Only expressions, not statements
- No `if`, `for`, `while`, etc. (use directives instead)
- No variable declarations

```vue
<!-- ❌ These won't work -->
{{ var a = 1 }}
{{ if (ok) { return message } }}

<!-- ✅ Use expressions instead -->
{{ ok ? message : '' }}
```
:::

## Raw HTML

To output real HTML, use the `v-html` directive:

::: code-group
```vue [JavaScript]
<script setup>
import { ref } from 'vue'

const rawHtml = ref('<span style="color: red">This is red</span>')
</script>

<template>
  <!-- Escaped (shows as text) -->
  <p>{{ rawHtml }}</p>

  <!-- Rendered as HTML -->
  <p v-html="rawHtml"></p>
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, Ref } from 'vue'

const rawHtml: Ref<string> = ref('<span style="color: red">This is red</span>')
</script>

<template>
  <!-- Escaped (shows as text) -->
  <p>{{ rawHtml }}</p>

  <!-- Rendered as HTML -->
  <p v-html="rawHtml"></p>
</template>
```
:::

::: danger Security Warning
Only use `v-html` on trusted content. Never use it on user-provided content as it can lead to XSS attacks.
:::

## Attribute Binding

Use `v-bind` (or shorthand `:`) to bind attributes:

::: code-group
```vue [JavaScript]
<script setup>
import { ref } from 'vue'

const dynamicId = ref('my-element')
const imageUrl = ref('/images/photo.jpg')
const isDisabled = ref(true)
const buttonClass = ref('btn-primary')
</script>

<template>
  <!-- Full syntax -->
  <div v-bind:id="dynamicId">Element with dynamic ID</div>

  <!-- Shorthand (recommended) -->
  <div :id="dynamicId">Element with dynamic ID</div>

  <!-- Common use cases -->
  <img :src="imageUrl" :alt="'Photo'" />
  <button :disabled="isDisabled">Submit</button>
  <a :href="'/users/' + dynamicId">User Link</a>
  <div :class="buttonClass">Styled Button</div>
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, Ref } from 'vue'

const dynamicId: Ref<string> = ref('my-element')
const imageUrl: Ref<string> = ref('/images/photo.jpg')
const isDisabled: Ref<boolean> = ref(true)
const buttonClass: Ref<string> = ref('btn-primary')
</script>

<template>
  <!-- Full syntax -->
  <div v-bind:id="dynamicId">Element with dynamic ID</div>

  <!-- Shorthand (recommended) -->
  <div :id="dynamicId">Element with dynamic ID</div>

  <!-- Common use cases -->
  <img :src="imageUrl" :alt="'Photo'" />
  <button :disabled="isDisabled">Submit</button>
  <a :href="'/users/' + dynamicId">User Link</a>
  <div :class="buttonClass">Styled Button</div>
</template>
```
:::

### Boolean Attributes

::: code-group
```vue [JavaScript]
<script setup>
import { ref } from 'vue'

const isDisabled = ref(true)
const isRequired = ref(false)
</script>

<template>
  <!-- Will render: <button disabled> -->
  <button :disabled="isDisabled">Can't click</button>

  <!-- Will render: <input> (no required attribute) -->
  <input :required="isRequired" />
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, Ref } from 'vue'

const isDisabled: Ref<boolean> = ref(true)
const isRequired: Ref<boolean> = ref(false)
</script>

<template>
  <!-- Will render: <button disabled> -->
  <button :disabled="isDisabled">Can't click</button>

  <!-- Will render: <input> (no required attribute) -->
  <input :required="isRequired" />
</template>
```
:::

### Binding Multiple Attributes

::: code-group
```vue [JavaScript]
<script setup>
import { ref } from 'vue'

const inputAttrs = ref({
  id: 'username',
  type: 'text',
  placeholder: 'Enter username',
  class: 'form-input'
})
</script>

<template>
  <!-- Bind all attributes at once -->
  <input v-bind="inputAttrs" />

  <!-- Equivalent to: -->
  <!-- <input id="username" type="text" placeholder="Enter username" class="form-input" /> -->
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, Ref } from 'vue'

interface InputAttrs {
  id: string
  type: string
  placeholder: string
  class: string
}

const inputAttrs: Ref<InputAttrs> = ref({
  id: 'username',
  type: 'text',
  placeholder: 'Enter username',
  class: 'form-input'
})
</script>

<template>
  <!-- Bind all attributes at once -->
  <input v-bind="inputAttrs" />
</template>
```
:::

## Class Binding

Vue provides special enhancements for class binding:

### Object Syntax

::: code-group
```vue [JavaScript]
<script setup>
import { ref } from 'vue'

const isActive = ref(true)
const hasError = ref(false)
const isLoading = ref(true)
</script>

<template>
  <!-- Single class -->
  <div :class="{ active: isActive }">Active when true</div>

  <!-- Multiple classes -->
  <div :class="{ active: isActive, 'text-danger': hasError }">
    Multiple classes
  </div>

  <!-- Combined with static class -->
  <div class="base-class" :class="{ active: isActive }">
    Static + Dynamic
  </div>

  <!-- Complex example -->
  <button
    class="btn"
    :class="{
      'btn-primary': !hasError,
      'btn-danger': hasError,
      'btn-loading': isLoading
    }"
  >
    Submit
  </button>
</template>

<style scoped>
.active { color: green; }
.text-danger { color: red; }
.btn { padding: 10px 20px; }
.btn-primary { background: blue; color: white; }
.btn-danger { background: red; color: white; }
.btn-loading { opacity: 0.7; }
</style>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, Ref } from 'vue'

const isActive: Ref<boolean> = ref(true)
const hasError: Ref<boolean> = ref(false)
const isLoading: Ref<boolean> = ref(true)
</script>

<template>
  <!-- Single class -->
  <div :class="{ active: isActive }">Active when true</div>

  <!-- Multiple classes -->
  <div :class="{ active: isActive, 'text-danger': hasError }">
    Multiple classes
  </div>

  <!-- Combined with static class -->
  <div class="base-class" :class="{ active: isActive }">
    Static + Dynamic
  </div>

  <!-- Complex example -->
  <button
    class="btn"
    :class="{
      'btn-primary': !hasError,
      'btn-danger': hasError,
      'btn-loading': isLoading
    }"
  >
    Submit
  </button>
</template>

<style scoped>
.active { color: green; }
.text-danger { color: red; }
.btn { padding: 10px 20px; }
.btn-primary { background: blue; color: white; }
.btn-danger { background: red; color: white; }
.btn-loading { opacity: 0.7; }
</style>
```
:::

### Array Syntax

::: code-group
```vue [JavaScript]
<script setup>
import { ref } from 'vue'

const activeClass = ref('active')
const errorClass = ref('text-danger')
const isActive = ref(true)
</script>

<template>
  <!-- Array of classes -->
  <div :class="[activeClass, errorClass]">Array syntax</div>

  <!-- Conditional in array -->
  <div :class="[isActive ? activeClass : '', errorClass]">
    Conditional
  </div>

  <!-- Object in array -->
  <div :class="[{ active: isActive }, errorClass]">
    Object in array
  </div>
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, Ref } from 'vue'

const activeClass: Ref<string> = ref('active')
const errorClass: Ref<string> = ref('text-danger')
const isActive: Ref<boolean> = ref(true)
</script>

<template>
  <!-- Array of classes -->
  <div :class="[activeClass, errorClass]">Array syntax</div>

  <!-- Conditional in array -->
  <div :class="[isActive ? activeClass : '', errorClass]">
    Conditional
  </div>

  <!-- Object in array -->
  <div :class="[{ active: isActive }, errorClass]">
    Object in array
  </div>
</template>
```
:::

## Style Binding

Similar to class binding, but for inline styles:

### Object Syntax

::: code-group
```vue [JavaScript]
<script setup>
import { ref } from 'vue'

const activeColor = ref('red')
const fontSize = ref(20)
const bgColor = ref('#f0f0f0')
</script>

<template>
  <!-- Object syntax -->
  <div :style="{ color: activeColor, fontSize: fontSize + 'px' }">
    Styled text
  </div>

  <!-- camelCase or kebab-case -->
  <div :style="{ 'font-size': fontSize + 'px', backgroundColor: bgColor }">
    Both work
  </div>
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, Ref } from 'vue'

const activeColor: Ref<string> = ref('red')
const fontSize: Ref<number> = ref(20)
const bgColor: Ref<string> = ref('#f0f0f0')
</script>

<template>
  <!-- Object syntax -->
  <div :style="{ color: activeColor, fontSize: fontSize + 'px' }">
    Styled text
  </div>

  <!-- camelCase or kebab-case -->
  <div :style="{ 'font-size': fontSize + 'px', backgroundColor: bgColor }">
    Both work
  </div>
</template>
```
:::

### Style Object

::: code-group
```vue [JavaScript]
<script setup>
import { ref, computed } from 'vue'

const isHighlighted = ref(true)

const cardStyle = computed(() => ({
  backgroundColor: isHighlighted.value ? '#ffffd0' : 'white',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
}))
</script>

<template>
  <div :style="cardStyle">
    Clean style object
  </div>
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, computed, Ref, ComputedRef, CSSProperties } from 'vue'

const isHighlighted: Ref<boolean> = ref(true)

const cardStyle: ComputedRef<CSSProperties> = computed(() => ({
  backgroundColor: isHighlighted.value ? '#ffffd0' : 'white',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
}))
</script>

<template>
  <div :style="cardStyle">
    Clean style object
  </div>
</template>
```
:::

### Array Syntax (Multiple Style Objects)

::: code-group
```vue [JavaScript]
<script setup>
import { ref } from 'vue'

const baseStyles = ref({
  color: 'blue',
  fontSize: '16px'
})

const overrideStyles = ref({
  fontWeight: 'bold'
})
</script>

<template>
  <!-- Merge multiple style objects -->
  <div :style="[baseStyles, overrideStyles]">
    Combined styles
  </div>
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, Ref, CSSProperties } from 'vue'

const baseStyles: Ref<CSSProperties> = ref({
  color: 'blue',
  fontSize: '16px'
})

const overrideStyles: Ref<CSSProperties> = ref({
  fontWeight: 'bold'
})
</script>

<template>
  <!-- Merge multiple style objects -->
  <div :style="[baseStyles, overrideStyles]">
    Combined styles
  </div>
</template>
```
:::

## Conditional Rendering

### v-if / v-else-if / v-else

::: code-group
```vue [JavaScript]
<script setup>
import { ref } from 'vue'

const isLoggedIn = ref(false)
const userRole = ref('admin')
const score = ref(85)
</script>

<template>
  <!-- Simple condition -->
  <div v-if="isLoggedIn">Welcome back!</div>
  <div v-else>Please log in</div>

  <!-- Multiple conditions -->
  <div v-if="userRole === 'admin'">Admin Panel</div>
  <div v-else-if="userRole === 'editor'">Editor Panel</div>
  <div v-else-if="userRole === 'user'">User Dashboard</div>
  <div v-else>Guest View</div>

  <!-- With expressions -->
  <div v-if="score >= 90">Grade: A</div>
  <div v-else-if="score >= 80">Grade: B</div>
  <div v-else-if="score >= 70">Grade: C</div>
  <div v-else>Grade: F</div>
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, Ref } from 'vue'

type UserRole = 'admin' | 'editor' | 'user' | 'guest'

const isLoggedIn: Ref<boolean> = ref(false)
const userRole: Ref<UserRole> = ref('admin')
const score: Ref<number> = ref(85)
</script>

<template>
  <!-- Simple condition -->
  <div v-if="isLoggedIn">Welcome back!</div>
  <div v-else>Please log in</div>

  <!-- Multiple conditions -->
  <div v-if="userRole === 'admin'">Admin Panel</div>
  <div v-else-if="userRole === 'editor'">Editor Panel</div>
  <div v-else-if="userRole === 'user'">User Dashboard</div>
  <div v-else>Guest View</div>

  <!-- With expressions -->
  <div v-if="score >= 90">Grade: A</div>
  <div v-else-if="score >= 80">Grade: B</div>
  <div v-else-if="score >= 70">Grade: C</div>
  <div v-else>Grade: F</div>
</template>
```
:::

### v-show

::: code-group
```vue [JavaScript]
<script setup>
import { ref } from 'vue'

const isVisible = ref(true)
</script>

<template>
  <!-- v-show toggles CSS display property -->
  <div v-show="isVisible">
    I'm visible (display: block)
  </div>

  <button @click="isVisible = !isVisible">
    Toggle
  </button>
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, Ref } from 'vue'

const isVisible: Ref<boolean> = ref(true)
</script>

<template>
  <!-- v-show toggles CSS display property -->
  <div v-show="isVisible">
    I'm visible (display: block)
  </div>

  <button @click="isVisible = !isVisible">
    Toggle
  </button>
</template>
```
:::

### v-if vs v-show

```
┌─────────────────────────────────────────────────────────────┐
│                    v-if vs v-show                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   v-if                          v-show                      │
│   ┌─────────────────────┐      ┌─────────────────────┐     │
│   │ • Lazy: element is  │      │ • Always rendered   │     │
│   │   created only when │      │ • Just toggles CSS  │     │
│   │   condition is true │      │   display property  │     │
│   │                     │      │                     │     │
│   │ • Higher toggle     │      │ • Higher initial    │     │
│   │   cost              │      │   render cost       │     │
│   │                     │      │                     │     │
│   │ • Good for rarely   │      │ • Good for frequent │     │
│   │   changing content  │      │   toggling          │     │
│   └─────────────────────┘      └─────────────────────┘     │
│                                                             │
│   Use v-if for: authentication, permissions, one-time      │
│   Use v-show for: tabs, modals, frequently toggled content │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Grouping with `<template>`

::: code-group
```vue [JavaScript]
<script setup>
import { ref } from 'vue'

const showDetails = ref(true)
</script>

<template>
  <!-- Group multiple elements without extra wrapper -->
  <template v-if="showDetails">
    <h2>Product Details</h2>
    <p>Description goes here...</p>
    <p>Price: $99.99</p>
  </template>
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, Ref } from 'vue'

const showDetails: Ref<boolean> = ref(true)
</script>

<template>
  <!-- Group multiple elements without extra wrapper -->
  <template v-if="showDetails">
    <h2>Product Details</h2>
    <p>Description goes here...</p>
    <p>Price: $99.99</p>
  </template>
</template>
```
:::

## List Rendering (v-for)

### Arrays

::: code-group
```vue [JavaScript]
<script setup>
import { ref } from 'vue'

const fruits = ref(['Apple', 'Banana', 'Orange', 'Mango'])

const users = ref([
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com' }
])
</script>

<template>
  <!-- Simple array -->
  <ul>
    <li v-for="fruit in fruits" :key="fruit">
      {{ fruit }}
    </li>
  </ul>

  <!-- With index -->
  <ul>
    <li v-for="(fruit, index) in fruits" :key="index">
      {{ index + 1 }}. {{ fruit }}
    </li>
  </ul>

  <!-- Array of objects -->
  <div v-for="user in users" :key="user.id" class="user-card">
    <h3>{{ user.name }}</h3>
    <p>{{ user.email }}</p>
  </div>
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, Ref } from 'vue'

interface User {
  id: number
  name: string
  email: string
}

const fruits: Ref<string[]> = ref(['Apple', 'Banana', 'Orange', 'Mango'])

const users: Ref<User[]> = ref([
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com' }
])
</script>

<template>
  <!-- Simple array -->
  <ul>
    <li v-for="fruit in fruits" :key="fruit">
      {{ fruit }}
    </li>
  </ul>

  <!-- With index -->
  <ul>
    <li v-for="(fruit, index) in fruits" :key="index">
      {{ index + 1 }}. {{ fruit }}
    </li>
  </ul>

  <!-- Array of objects -->
  <div v-for="user in users" :key="user.id" class="user-card">
    <h3>{{ user.name }}</h3>
    <p>{{ user.email }}</p>
  </div>
</template>
```
:::

### Objects

::: code-group
```vue [JavaScript]
<script setup>
import { ref } from 'vue'

const userProfile = ref({
  name: 'John Doe',
  age: 30,
  email: 'john@example.com',
  location: 'New York'
})
</script>

<template>
  <!-- Iterate over object -->
  <ul>
    <li v-for="(value, key) in userProfile" :key="key">
      <strong>{{ key }}:</strong> {{ value }}
    </li>
  </ul>

  <!-- With index -->
  <ul>
    <li v-for="(value, key, index) in userProfile" :key="key">
      {{ index }}. {{ key }}: {{ value }}
    </li>
  </ul>
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, Ref } from 'vue'

interface UserProfile {
  name: string
  age: number
  email: string
  location: string
}

const userProfile: Ref<UserProfile> = ref({
  name: 'John Doe',
  age: 30,
  email: 'john@example.com',
  location: 'New York'
})
</script>

<template>
  <!-- Iterate over object -->
  <ul>
    <li v-for="(value, key) in userProfile" :key="key">
      <strong>{{ key }}:</strong> {{ value }}
    </li>
  </ul>

  <!-- With index -->
  <ul>
    <li v-for="(value, key, index) in userProfile" :key="key">
      {{ index }}. {{ key }}: {{ value }}
    </li>
  </ul>
</template>
```
:::

### Range

```vue
<template>
  <!-- Render 1 to 10 -->
  <span v-for="n in 10" :key="n">{{ n }} </span>

  <!-- Output: 1 2 3 4 5 6 7 8 9 10 -->
</template>
```

### v-for with v-if

::: warning Important
Don't use `v-for` and `v-if` on the same element. Use a wrapper `<template>` instead.
:::

::: code-group
```vue [JavaScript]
<script setup>
import { ref, computed } from 'vue'

const todos = ref([
  { id: 1, text: 'Learn Vue', done: true },
  { id: 2, text: 'Build app', done: false },
  { id: 3, text: 'Deploy', done: false }
])

// Filter in computed (recommended)
const incompleteTodos = computed(() =>
  todos.value.filter(todo => !todo.done)
)
</script>

<template>
  <!-- ❌ Don't do this -->
  <!-- <li v-for="todo in todos" v-if="!todo.done" :key="todo.id"> -->

  <!-- ✅ Option 1: Use computed property -->
  <ul>
    <li v-for="todo in incompleteTodos" :key="todo.id">
      {{ todo.text }}
    </li>
  </ul>

  <!-- ✅ Option 2: Use template wrapper -->
  <ul>
    <template v-for="todo in todos" :key="todo.id">
      <li v-if="!todo.done">
        {{ todo.text }}
      </li>
    </template>
  </ul>
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, computed, Ref, ComputedRef } from 'vue'

interface Todo {
  id: number
  text: string
  done: boolean
}

const todos: Ref<Todo[]> = ref([
  { id: 1, text: 'Learn Vue', done: true },
  { id: 2, text: 'Build app', done: false },
  { id: 3, text: 'Deploy', done: false }
])

// Filter in computed (recommended)
const incompleteTodos: ComputedRef<Todo[]> = computed(() =>
  todos.value.filter(todo => !todo.done)
)
</script>

<template>
  <!-- ✅ Option 1: Use computed property -->
  <ul>
    <li v-for="todo in incompleteTodos" :key="todo.id">
      {{ todo.text }}
    </li>
  </ul>

  <!-- ✅ Option 2: Use template wrapper -->
  <ul>
    <template v-for="todo in todos" :key="todo.id">
      <li v-if="!todo.done">
        {{ todo.text }}
      </li>
    </template>
  </ul>
</template>
```
:::

## Key Attribute

Always use a unique `key` with `v-for`:

```
┌─────────────────────────────────────────────────────────────┐
│                    Why :key is Important                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Without key:                                              │
│   Vue uses "in-place patch" strategy                        │
│   Can cause bugs with form inputs and component state       │
│                                                             │
│   With key:                                                 │
│   Vue tracks each element's identity                        │
│   Proper reordering and removal                             │
│                                                             │
│   ┌─────────────────────────────────────────────┐          │
│   │ <!-- ❌ Bad: index as key -->               │          │
│   │ <li v-for="(item, i) in items" :key="i">   │          │
│   │                                             │          │
│   │ <!-- ✅ Good: unique id as key -->          │          │
│   │ <li v-for="item in items" :key="item.id">  │          │
│   └─────────────────────────────────────────────┘          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Template References

Access DOM elements directly with `ref`:

::: code-group
```vue [JavaScript]
<script setup>
import { ref, onMounted } from 'vue'

// Create a template ref
const inputRef = ref(null)

onMounted(() => {
  // Focus the input when component mounts
  inputRef.value.focus()
})

function focusInput() {
  inputRef.value.focus()
}
</script>

<template>
  <input ref="inputRef" type="text" placeholder="I'll be focused" />
  <button @click="focusInput">Focus Input</button>
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, onMounted, Ref } from 'vue'

// Create a typed template ref
const inputRef: Ref<HTMLInputElement | null> = ref(null)

onMounted(() => {
  // Focus the input when component mounts
  inputRef.value?.focus()
})

function focusInput(): void {
  inputRef.value?.focus()
}
</script>

<template>
  <input ref="inputRef" type="text" placeholder="I'll be focused" />
  <button @click="focusInput">Focus Input</button>
</template>
```
:::

## Summary

| Feature | Syntax | Example |
|---------|--------|---------|
| Text | `{{ }}` | `{{ message }}` |
| Raw HTML | `v-html` | `<div v-html="html"></div>` |
| Attribute | `:attr` | `:href="url"` |
| Class | `:class` | `:class="{ active: isActive }"` |
| Style | `:style` | `:style="{ color: 'red' }"` |
| Condition | `v-if` | `<div v-if="show">` |
| Show/Hide | `v-show` | `<div v-show="visible">` |
| Loop | `v-for` | `<li v-for="item in items">` |
| Ref | `ref` | `<input ref="myInput">` |

## What's Next?

In the next chapter, we'll learn about [Components & Props](/guide/vue/03-components) - building reusable components and passing data between them.

---

[Previous: Getting Started](/guide/vue/01-introduction) | [Next: Components & Props →](/guide/vue/03-components)
