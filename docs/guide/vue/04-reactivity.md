# Reactivity & State

Vue's reactivity system is the core feature that makes the framework so powerful. In this tutorial, you'll learn how Vue tracks changes and automatically updates the DOM.

## What is Reactivity?

Reactivity means when data changes, the view updates automatically.

```
┌─────────────────────────────────────────────────────────────┐
│                    Vue Reactivity System                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   1. You change data                                        │
│      count.value = 5                                        │
│             │                                               │
│             ▼                                               │
│   2. Vue detects the change                                 │
│      (Proxy-based tracking)                                 │
│             │                                               │
│             ▼                                               │
│   3. Vue updates the DOM                                    │
│      <p>Count: 5</p>                                        │
│                                                             │
│   All automatic! No manual DOM manipulation! ✨             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## ref() - Reactive References

`ref()` creates a reactive reference for primitive values (strings, numbers, booleans).

### Basic Usage

::: code-group
```vue [JavaScript]
<script setup>
import { ref } from 'vue'

// Create reactive values
const count = ref(0)
const message = ref('Hello')
const isActive = ref(false)

// Access/modify with .value in script
function increment() {
  count.value++
}

function toggleActive() {
  isActive.value = !isActive.value
}

function updateMessage() {
  message.value = 'Updated!'
}
</script>

<template>
  <!-- In template, .value is automatic -->
  <p>Count: {{ count }}</p>
  <p>Message: {{ message }}</p>
  <p>Active: {{ isActive }}</p>

  <button @click="increment">Add</button>
  <button @click="toggleActive">Toggle</button>
  <button @click="updateMessage">Update</button>
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, Ref } from 'vue'

// Create typed reactive values
const count: Ref<number> = ref(0)
const message: Ref<string> = ref('Hello')
const isActive: Ref<boolean> = ref(false)

// Access/modify with .value in script
function increment(): void {
  count.value++
}

function toggleActive(): void {
  isActive.value = !isActive.value
}

function updateMessage(): void {
  message.value = 'Updated!'
}
</script>

<template>
  <!-- In template, .value is automatic -->
  <p>Count: {{ count }}</p>
  <p>Message: {{ message }}</p>
  <p>Active: {{ isActive }}</p>

  <button @click="increment">Add</button>
  <button @click="toggleActive">Toggle</button>
  <button @click="updateMessage">Update</button>
</template>
```
:::

### ref with Objects and Arrays

::: code-group
```vue [JavaScript]
<script setup>
import { ref } from 'vue'

// ref can also hold objects and arrays
const user = ref({
  name: 'Alice',
  age: 25
})

const items = ref(['Apple', 'Banana', 'Orange'])

function updateUser() {
  user.value.name = 'Bob'
  user.value.age = 30
}

function addItem() {
  items.value.push('Mango')
}

function replaceItems() {
  items.value = ['New', 'Items']
}
</script>

<template>
  <p>Name: {{ user.name }}, Age: {{ user.age }}</p>
  <ul>
    <li v-for="item in items" :key="item">{{ item }}</li>
  </ul>
  <button @click="updateUser">Update User</button>
  <button @click="addItem">Add Item</button>
  <button @click="replaceItems">Replace Items</button>
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, Ref } from 'vue'

interface User {
  name: string
  age: number
}

// ref can also hold objects and arrays
const user: Ref<User> = ref({
  name: 'Alice',
  age: 25
})

const items: Ref<string[]> = ref(['Apple', 'Banana', 'Orange'])

function updateUser(): void {
  user.value.name = 'Bob'
  user.value.age = 30
}

function addItem(): void {
  items.value.push('Mango')
}

function replaceItems(): void {
  items.value = ['New', 'Items']
}
</script>

<template>
  <p>Name: {{ user.name }}, Age: {{ user.age }}</p>
  <ul>
    <li v-for="item in items" :key="item">{{ item }}</li>
  </ul>
  <button @click="updateUser">Update User</button>
  <button @click="addItem">Add Item</button>
  <button @click="replaceItems">Replace Items</button>
</template>
```
:::

## reactive() - Reactive Objects

`reactive()` creates a reactive object (no `.value` needed for properties).

### Basic Usage

::: code-group
```vue [JavaScript]
<script setup>
import { reactive } from 'vue'

// Create a reactive object
const state = reactive({
  count: 0,
  message: 'Hello',
  user: {
    name: 'Alice',
    age: 25
  }
})

// No .value needed!
function increment() {
  state.count++
}

function updateUser() {
  state.user.name = 'Bob'
  state.user.age = 30
}
</script>

<template>
  <p>Count: {{ state.count }}</p>
  <p>Message: {{ state.message }}</p>
  <p>User: {{ state.user.name }}, {{ state.user.age }}</p>

  <button @click="increment">Add</button>
  <button @click="updateUser">Update User</button>
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { reactive } from 'vue'

interface User {
  name: string
  age: number
}

interface State {
  count: number
  message: string
  user: User
}

// Create a typed reactive object
const state: State = reactive({
  count: 0,
  message: 'Hello',
  user: {
    name: 'Alice',
    age: 25
  }
})

// No .value needed!
function increment(): void {
  state.count++
}

function updateUser(): void {
  state.user.name = 'Bob'
  state.user.age = 30
}
</script>

<template>
  <p>Count: {{ state.count }}</p>
  <p>Message: {{ state.message }}</p>
  <p>User: {{ state.user.name }}, {{ state.user.age }}</p>

  <button @click="increment">Add</button>
  <button @click="updateUser">Update User</button>
</template>
```
:::

## ref vs reactive

```
┌─────────────────────────────────────────────────────────────┐
│                    ref vs reactive                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ref()                           reactive()                │
│   ┌─────────────────────┐        ┌─────────────────────┐   │
│   │ • Any value type    │        │ • Objects only      │   │
│   │ • Need .value       │        │ • No .value needed  │   │
│   │ • Can reassign      │        │ • Can't reassign    │   │
│   │ • Auto-unwrap in    │        │ • Same object ref   │   │
│   │   template          │        │   always            │   │
│   └─────────────────────┘        └─────────────────────┘   │
│                                                             │
│   // ref                          // reactive              │
│   const count = ref(0)            const state = reactive({ │
│   count.value++                     count: 0               │
│                                   })                       │
│   const user = ref({...})         state.count++            │
│   user.value = newUser  ✅                                 │
│                                   state = newState  ❌     │
│                                                             │
│   Recommendation: Use ref() for most cases                 │
│   Use reactive() for complex state objects                 │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### When to Use Each

::: code-group
```vue [JavaScript]
<script setup>
import { ref, reactive } from 'vue'

// ✅ Use ref for primitives
const count = ref(0)
const isLoading = ref(false)
const errorMessage = ref('')

// ✅ Use ref for values that might be reassigned
const selectedUser = ref(null)
function selectUser(user) {
  selectedUser.value = user  // Can reassign entire value
}

// ✅ Use reactive for complex state objects
const formState = reactive({
  username: '',
  email: '',
  password: '',
  errors: {}
})

// ✅ Use reactive for store-like state
const appState = reactive({
  users: [],
  currentPage: 1,
  filters: {
    search: '',
    category: 'all'
  }
})
</script>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, reactive, Ref } from 'vue'

interface User {
  id: number
  name: string
}

interface FormState {
  username: string
  email: string
  password: string
  errors: Record<string, string>
}

interface AppState {
  users: User[]
  currentPage: number
  filters: {
    search: string
    category: string
  }
}

// ✅ Use ref for primitives
const count: Ref<number> = ref(0)
const isLoading: Ref<boolean> = ref(false)
const errorMessage: Ref<string> = ref('')

// ✅ Use ref for values that might be reassigned
const selectedUser: Ref<User | null> = ref(null)
function selectUser(user: User): void {
  selectedUser.value = user  // Can reassign entire value
}

// ✅ Use reactive for complex state objects
const formState: FormState = reactive({
  username: '',
  email: '',
  password: '',
  errors: {}
})

// ✅ Use reactive for store-like state
const appState: AppState = reactive({
  users: [],
  currentPage: 1,
  filters: {
    search: '',
    category: 'all'
  }
})
</script>
```
:::

## Reactivity Limitations

### reactive() Limitations

::: code-group
```vue [JavaScript]
<script setup>
import { reactive, ref } from 'vue'

// ❌ Can't replace the whole object
let state = reactive({ count: 0 })
state = reactive({ count: 1 })  // Loses reactivity!

// ❌ Destructuring loses reactivity
const { count } = reactive({ count: 0 })
// count is now just a plain value, not reactive

// ✅ Solution 1: Don't destructure, access directly
const state = reactive({ count: 0 })
console.log(state.count)  // Still reactive

// ✅ Solution 2: Use ref instead
const count = ref(0)
console.log(count.value)  // Always reactive
</script>
```

```vue [TypeScript]
<script setup lang="ts">
import { reactive, ref, Ref } from 'vue'

interface State {
  count: number
}

// ❌ Can't replace the whole object
let state: State = reactive({ count: 0 })
state = reactive({ count: 1 })  // Loses reactivity!

// ❌ Destructuring loses reactivity
const { count } = reactive({ count: 0 })
// count is now just a plain number, not reactive

// ✅ Solution 1: Don't destructure, access directly
const state2: State = reactive({ count: 0 })
console.log(state2.count)  // Still reactive

// ✅ Solution 2: Use ref instead
const count2: Ref<number> = ref(0)
console.log(count2.value)  // Always reactive
</script>
```
:::

### toRefs() - Preserve Reactivity When Destructuring

::: code-group
```vue [JavaScript]
<script setup>
import { reactive, toRefs } from 'vue'

const state = reactive({
  count: 0,
  message: 'Hello'
})

// Convert reactive properties to refs
const { count, message } = toRefs(state)

// Now these are reactive refs!
function increment() {
  count.value++  // Changes state.count too
}
</script>

<template>
  <p>Count: {{ count }}</p>
  <p>Message: {{ message }}</p>
  <button @click="increment">Add</button>
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { reactive, toRefs, Ref } from 'vue'

interface State {
  count: number
  message: string
}

const state: State = reactive({
  count: 0,
  message: 'Hello'
})

// Convert reactive properties to refs
const { count, message }: { count: Ref<number>; message: Ref<string> } = toRefs(state)

// Now these are reactive refs!
function increment(): void {
  count.value++  // Changes state.count too
}
</script>

<template>
  <p>Count: {{ count }}</p>
  <p>Message: {{ message }}</p>
  <button @click="increment">Add</button>
</template>
```
:::

### toRef() - Single Property

::: code-group
```vue [JavaScript]
<script setup>
import { reactive, toRef } from 'vue'

const state = reactive({
  count: 0,
  message: 'Hello'
})

// Create a ref for a single property
const countRef = toRef(state, 'count')

function increment() {
  countRef.value++  // Changes state.count
}
</script>

<template>
  <p>Count: {{ countRef }}</p>
  <button @click="increment">Add</button>
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { reactive, toRef, Ref } from 'vue'

interface State {
  count: number
  message: string
}

const state: State = reactive({
  count: 0,
  message: 'Hello'
})

// Create a ref for a single property
const countRef: Ref<number> = toRef(state, 'count')

function increment(): void {
  countRef.value++  // Changes state.count
}
</script>

<template>
  <p>Count: {{ countRef }}</p>
  <button @click="increment">Add</button>
</template>
```
:::

## shallowRef() and shallowReactive()

For performance optimization, use shallow versions when you only need top-level reactivity:

::: code-group
```vue [JavaScript]
<script setup>
import { shallowRef, shallowReactive, triggerRef } from 'vue'

// Only .value assignment triggers update (not nested changes)
const shallowData = shallowRef({
  nested: { count: 0 }
})

// This WON'T trigger update
function nestedChange() {
  shallowData.value.nested.count++
  // Need to manually trigger
  triggerRef(shallowData)
}

// This WILL trigger update
function replaceAll() {
  shallowData.value = { nested: { count: 1 } }
}

// Only top-level properties are reactive
const shallowState = shallowReactive({
  count: 0,
  nested: { value: 0 }
})

// This triggers update
function topLevelChange() {
  shallowState.count++
}

// This WON'T trigger update
function deepChange() {
  shallowState.nested.value++
}
</script>

<template>
  <p>Shallow Ref: {{ shallowData.nested.count }}</p>
  <p>Shallow State: {{ shallowState.count }}, {{ shallowState.nested.value }}</p>
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { shallowRef, shallowReactive, triggerRef, ShallowRef } from 'vue'

interface NestedData {
  nested: { count: number }
}

interface ShallowState {
  count: number
  nested: { value: number }
}

// Only .value assignment triggers update (not nested changes)
const shallowData: ShallowRef<NestedData> = shallowRef({
  nested: { count: 0 }
})

// This WON'T trigger update
function nestedChange(): void {
  shallowData.value.nested.count++
  // Need to manually trigger
  triggerRef(shallowData)
}

// This WILL trigger update
function replaceAll(): void {
  shallowData.value = { nested: { count: 1 } }
}

// Only top-level properties are reactive
const shallowState: ShallowState = shallowReactive({
  count: 0,
  nested: { value: 0 }
})

// This triggers update
function topLevelChange(): void {
  shallowState.count++
}

// This WON'T trigger update
function deepChange(): void {
  shallowState.nested.value++
}
</script>

<template>
  <p>Shallow Ref: {{ shallowData.nested.count }}</p>
  <p>Shallow State: {{ shallowState.count }}, {{ shallowState.nested.value }}</p>
</template>
```
:::

## readonly()

Create a read-only version of a reactive object:

::: code-group
```vue [JavaScript]
<script setup>
import { ref, reactive, readonly } from 'vue'

const original = reactive({ count: 0 })
const readOnlyCopy = readonly(original)

// ❌ This will warn in dev and fail silently in prod
function tryToModify() {
  readOnlyCopy.count++  // Warning: Set operation on key "count" failed
}

// ✅ Modify the original instead
function modifyOriginal() {
  original.count++
  // readOnlyCopy.count also updates (it's a readonly view)
}
</script>

<template>
  <p>Original: {{ original.count }}</p>
  <p>Read-only: {{ readOnlyCopy.count }}</p>
  <button @click="modifyOriginal">Modify Original</button>
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { reactive, readonly, DeepReadonly } from 'vue'

interface State {
  count: number
}

const original: State = reactive({ count: 0 })
const readOnlyCopy: DeepReadonly<State> = readonly(original)

// ❌ TypeScript error: Cannot assign to 'count' because it is a read-only property
function tryToModify(): void {
  // readOnlyCopy.count++  // This won't compile!
}

// ✅ Modify the original instead
function modifyOriginal(): void {
  original.count++
  // readOnlyCopy.count also updates (it's a readonly view)
}
</script>

<template>
  <p>Original: {{ original.count }}</p>
  <p>Read-only: {{ readOnlyCopy.count }}</p>
  <button @click="modifyOriginal">Modify Original</button>
</template>
```
:::

## Practical Example: Shopping Cart

::: code-group
```vue [JavaScript]
<script setup>
import { ref, reactive, computed } from 'vue'

// Products list (could come from API)
const products = ref([
  { id: 1, name: 'T-Shirt', price: 25.00 },
  { id: 2, name: 'Jeans', price: 50.00 },
  { id: 3, name: 'Sneakers', price: 80.00 },
  { id: 4, name: 'Hat', price: 15.00 }
])

// Shopping cart state
const cart = reactive({
  items: [],
  discount: 0
})

// Computed values
const cartTotal = computed(() => {
  const subtotal = cart.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity)
  }, 0)
  return subtotal * (1 - cart.discount / 100)
})

const itemCount = computed(() => {
  return cart.items.reduce((sum, item) => sum + item.quantity, 0)
})

// Cart actions
function addToCart(product) {
  const existingItem = cart.items.find(item => item.id === product.id)

  if (existingItem) {
    existingItem.quantity++
  } else {
    cart.items.push({
      ...product,
      quantity: 1
    })
  }
}

function removeFromCart(productId) {
  const index = cart.items.findIndex(item => item.id === productId)
  if (index > -1) {
    cart.items.splice(index, 1)
  }
}

function updateQuantity(productId, quantity) {
  const item = cart.items.find(item => item.id === productId)
  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      item.quantity = quantity
    }
  }
}

function applyDiscount(percent) {
  cart.discount = Math.min(100, Math.max(0, percent))
}

function clearCart() {
  cart.items = []
  cart.discount = 0
}
</script>

<template>
  <div class="shopping-app">
    <div class="products">
      <h2>Products</h2>
      <div v-for="product in products" :key="product.id" class="product">
        <span>{{ product.name }} - ${{ product.price.toFixed(2) }}</span>
        <button @click="addToCart(product)">Add to Cart</button>
      </div>
    </div>

    <div class="cart">
      <h2>Shopping Cart ({{ itemCount }} items)</h2>

      <div v-if="cart.items.length === 0" class="empty">
        Your cart is empty
      </div>

      <div v-else>
        <div v-for="item in cart.items" :key="item.id" class="cart-item">
          <span>{{ item.name }}</span>
          <div class="quantity">
            <button @click="updateQuantity(item.id, item.quantity - 1)">-</button>
            <span>{{ item.quantity }}</span>
            <button @click="updateQuantity(item.id, item.quantity + 1)">+</button>
          </div>
          <span>${{ (item.price * item.quantity).toFixed(2) }}</span>
          <button @click="removeFromCart(item.id)" class="remove">X</button>
        </div>

        <div class="discount">
          <label>Discount %:</label>
          <input
            type="number"
            :value="cart.discount"
            @input="applyDiscount(Number($event.target.value))"
            min="0"
            max="100"
          />
        </div>

        <div class="total">
          <strong>Total: ${{ cartTotal.toFixed(2) }}</strong>
          <span v-if="cart.discount > 0" class="savings">
            ({{ cart.discount }}% off!)
          </span>
        </div>

        <button @click="clearCart" class="clear">Clear Cart</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shopping-app {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  padding: 20px;
}

.products, .cart {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.product, .cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.quantity {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity button {
  width: 30px;
  height: 30px;
}

.empty {
  color: #999;
  text-align: center;
  padding: 20px;
}

.total {
  margin-top: 20px;
  font-size: 1.2em;
}

.savings {
  color: #42b883;
  margin-left: 10px;
}

.discount {
  margin-top: 15px;
}

.discount input {
  width: 60px;
  margin-left: 10px;
}

.remove {
  background: #ff4444;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.clear {
  margin-top: 15px;
  padding: 10px 20px;
  background: #666;
  color: white;
  border: none;
  cursor: pointer;
}

button {
  padding: 5px 15px;
  cursor: pointer;
}
</style>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, reactive, computed, Ref, ComputedRef } from 'vue'

interface Product {
  id: number
  name: string
  price: number
}

interface CartItem extends Product {
  quantity: number
}

interface Cart {
  items: CartItem[]
  discount: number
}

// Products list (could come from API)
const products: Ref<Product[]> = ref([
  { id: 1, name: 'T-Shirt', price: 25.00 },
  { id: 2, name: 'Jeans', price: 50.00 },
  { id: 3, name: 'Sneakers', price: 80.00 },
  { id: 4, name: 'Hat', price: 15.00 }
])

// Shopping cart state
const cart: Cart = reactive({
  items: [],
  discount: 0
})

// Computed values
const cartTotal: ComputedRef<number> = computed(() => {
  const subtotal = cart.items.reduce((sum, item) => {
    return sum + (item.price * item.quantity)
  }, 0)
  return subtotal * (1 - cart.discount / 100)
})

const itemCount: ComputedRef<number> = computed(() => {
  return cart.items.reduce((sum, item) => sum + item.quantity, 0)
})

// Cart actions
function addToCart(product: Product): void {
  const existingItem = cart.items.find(item => item.id === product.id)

  if (existingItem) {
    existingItem.quantity++
  } else {
    cart.items.push({
      ...product,
      quantity: 1
    })
  }
}

function removeFromCart(productId: number): void {
  const index = cart.items.findIndex(item => item.id === productId)
  if (index > -1) {
    cart.items.splice(index, 1)
  }
}

function updateQuantity(productId: number, quantity: number): void {
  const item = cart.items.find(item => item.id === productId)
  if (item) {
    if (quantity <= 0) {
      removeFromCart(productId)
    } else {
      item.quantity = quantity
    }
  }
}

function applyDiscount(percent: number): void {
  cart.discount = Math.min(100, Math.max(0, percent))
}

function clearCart(): void {
  cart.items = []
  cart.discount = 0
}
</script>

<template>
  <div class="shopping-app">
    <div class="products">
      <h2>Products</h2>
      <div v-for="product in products" :key="product.id" class="product">
        <span>{{ product.name }} - ${{ product.price.toFixed(2) }}</span>
        <button @click="addToCart(product)">Add to Cart</button>
      </div>
    </div>

    <div class="cart">
      <h2>Shopping Cart ({{ itemCount }} items)</h2>

      <div v-if="cart.items.length === 0" class="empty">
        Your cart is empty
      </div>

      <div v-else>
        <div v-for="item in cart.items" :key="item.id" class="cart-item">
          <span>{{ item.name }}</span>
          <div class="quantity">
            <button @click="updateQuantity(item.id, item.quantity - 1)">-</button>
            <span>{{ item.quantity }}</span>
            <button @click="updateQuantity(item.id, item.quantity + 1)">+</button>
          </div>
          <span>${{ (item.price * item.quantity).toFixed(2) }}</span>
          <button @click="removeFromCart(item.id)" class="remove">X</button>
        </div>

        <div class="discount">
          <label>Discount %:</label>
          <input
            type="number"
            :value="cart.discount"
            @input="applyDiscount(Number(($event.target as HTMLInputElement).value))"
            min="0"
            max="100"
          />
        </div>

        <div class="total">
          <strong>Total: ${{ cartTotal.toFixed(2) }}</strong>
          <span v-if="cart.discount > 0" class="savings">
            ({{ cart.discount }}% off!)
          </span>
        </div>

        <button @click="clearCart" class="clear">Clear Cart</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.shopping-app {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  padding: 20px;
}

.products, .cart {
  padding: 20px;
  border: 1px solid #ddd;
  border-radius: 8px;
}

.product, .cart-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.quantity {
  display: flex;
  align-items: center;
  gap: 10px;
}

.quantity button {
  width: 30px;
  height: 30px;
}

.empty {
  color: #999;
  text-align: center;
  padding: 20px;
}

.total {
  margin-top: 20px;
  font-size: 1.2em;
}

.savings {
  color: #42b883;
  margin-left: 10px;
}

.discount {
  margin-top: 15px;
}

.discount input {
  width: 60px;
  margin-left: 10px;
}

.remove {
  background: #ff4444;
  color: white;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
}

.clear {
  margin-top: 15px;
  padding: 10px 20px;
  background: #666;
  color: white;
  border: none;
  cursor: pointer;
}

button {
  padding: 5px 15px;
  cursor: pointer;
}
</style>
```
:::

## Summary

| API | Use Case | Syntax |
|-----|----------|--------|
| `ref()` | Primitives, reassignable values | `ref(0)`, access with `.value` |
| `reactive()` | Objects, complex state | `reactive({})`, direct access |
| `toRefs()` | Destructure reactive object | `toRefs(state)` |
| `toRef()` | Single property ref | `toRef(state, 'prop')` |
| `readonly()` | Prevent modifications | `readonly(state)` |
| `shallowRef()` | Performance (top-level only) | `shallowRef({})` |

## What's Next?

In the next chapter, we'll learn about [Event Handling](/guide/vue/05-events) - responding to user interactions.

---

[Previous: Components & Props](/guide/vue/03-components) | [Next: Event Handling →](/guide/vue/05-events)
