# Event Handling

Events allow your Vue application to respond to user interactions. In this tutorial, you'll learn how to handle DOM events, pass arguments, use modifiers, and create custom events.

## Listening to Events

Use the `v-on` directive (or `@` shorthand) to listen to DOM events:

::: code-group
```vue [JavaScript]
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}

function greet() {
  alert('Hello!')
}
</script>

<template>
  <!-- Full syntax -->
  <button v-on:click="increment">Count: {{ count }}</button>

  <!-- Shorthand (recommended) -->
  <button @click="increment">Count: {{ count }}</button>

  <!-- Inline handler -->
  <button @click="count++">Count: {{ count }}</button>

  <!-- Method handler -->
  <button @click="greet">Say Hello</button>
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, Ref } from 'vue'

const count: Ref<number> = ref(0)

function increment(): void {
  count.value++
}

function greet(): void {
  alert('Hello!')
}
</script>

<template>
  <!-- Full syntax -->
  <button v-on:click="increment">Count: {{ count }}</button>

  <!-- Shorthand (recommended) -->
  <button @click="increment">Count: {{ count }}</button>

  <!-- Inline handler -->
  <button @click="count++">Count: {{ count }}</button>

  <!-- Method handler -->
  <button @click="greet">Say Hello</button>
</template>
```
:::

## Accessing the Event Object

### Automatic Event Parameter

::: code-group
```vue [JavaScript]
<script setup>
function handleClick(event) {
  console.log('Event type:', event.type)
  console.log('Target:', event.target)
  console.log('Coordinates:', event.clientX, event.clientY)
}

function handleInput(event) {
  console.log('Input value:', event.target.value)
}
</script>

<template>
  <button @click="handleClick">Click Me</button>
  <input @input="handleInput" placeholder="Type something..." />
</template>
```

```vue [TypeScript]
<script setup lang="ts">
function handleClick(event: MouseEvent): void {
  console.log('Event type:', event.type)
  console.log('Target:', event.target)
  console.log('Coordinates:', event.clientX, event.clientY)
}

function handleInput(event: Event): void {
  const target = event.target as HTMLInputElement
  console.log('Input value:', target.value)
}
</script>

<template>
  <button @click="handleClick">Click Me</button>
  <input @input="handleInput" placeholder="Type something..." />
</template>
```
:::

### Using $event

::: code-group
```vue [JavaScript]
<script setup>
import { ref } from 'vue'

const message = ref('')

function handleClick(msg, event) {
  console.log(msg)
  console.log(event.target)
}

function updateMessage(event) {
  message.value = event.target.value
}
</script>

<template>
  <!-- Pass custom argument AND event -->
  <button @click="handleClick('Hello!', $event)">Click</button>

  <!-- Using $event inline -->
  <input
    :value="message"
    @input="message = $event.target.value"
  />
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, Ref } from 'vue'

const message: Ref<string> = ref('')

function handleClick(msg: string, event: MouseEvent): void {
  console.log(msg)
  console.log(event.target)
}
</script>

<template>
  <!-- Pass custom argument AND event -->
  <button @click="handleClick('Hello!', $event)">Click</button>

  <!-- Using $event inline -->
  <input
    :value="message"
    @input="message = ($event.target as HTMLInputElement).value"
  />
</template>
```
:::

## Passing Arguments

::: code-group
```vue [JavaScript]
<script setup>
import { ref } from 'vue'

const items = ref([
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' },
  { id: 3, name: 'Orange' }
])

function selectItem(item) {
  console.log('Selected:', item.name)
}

function deleteItem(id, event) {
  console.log('Deleting item:', id)
  console.log('Event:', event)
  items.value = items.value.filter(item => item.id !== id)
}

function handleAction(action, item, event) {
  console.log(`Action: ${action}, Item: ${item.name}`)
  event.stopPropagation()
}
</script>

<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      <!-- Pass single argument -->
      <span @click="selectItem(item)">{{ item.name }}</span>

      <!-- Pass multiple arguments with event -->
      <button @click="deleteItem(item.id, $event)">Delete</button>

      <!-- Pass multiple custom arguments -->
      <button @click="handleAction('edit', item, $event)">Edit</button>
    </li>
  </ul>
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, Ref } from 'vue'

interface Item {
  id: number
  name: string
}

const items: Ref<Item[]> = ref([
  { id: 1, name: 'Apple' },
  { id: 2, name: 'Banana' },
  { id: 3, name: 'Orange' }
])

function selectItem(item: Item): void {
  console.log('Selected:', item.name)
}

function deleteItem(id: number, event: MouseEvent): void {
  console.log('Deleting item:', id)
  console.log('Event:', event)
  items.value = items.value.filter(item => item.id !== id)
}

function handleAction(action: string, item: Item, event: MouseEvent): void {
  console.log(`Action: ${action}, Item: ${item.name}`)
  event.stopPropagation()
}
</script>

<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      <!-- Pass single argument -->
      <span @click="selectItem(item)">{{ item.name }}</span>

      <!-- Pass multiple arguments with event -->
      <button @click="deleteItem(item.id, $event)">Delete</button>

      <!-- Pass multiple custom arguments -->
      <button @click="handleAction('edit', item, $event)">Edit</button>
    </li>
  </ul>
</template>
```
:::

## Event Modifiers

Vue provides modifiers that handle common event patterns:

### Common Modifiers

```vue
<template>
  <!-- .prevent - calls event.preventDefault() -->
  <form @submit.prevent="onSubmit">
    <button type="submit">Submit</button>
  </form>

  <!-- .stop - calls event.stopPropagation() -->
  <div @click="handleOuter">
    <button @click.stop="handleInner">Won't bubble</button>
  </div>

  <!-- .once - event fires only once -->
  <button @click.once="doOnce">Click me (once only)</button>

  <!-- .self - only trigger if event.target is the element itself -->
  <div @click.self="handleSelf">
    <button>Click me (won't trigger parent)</button>
  </div>

  <!-- .capture - use capture mode -->
  <div @click.capture="handleCapture">
    Capture phase
  </div>

  <!-- .passive - improves scroll performance -->
  <div @scroll.passive="onScroll">
    Passive scroll
  </div>
</template>
```

### Chaining Modifiers

```vue
<template>
  <!-- Chain multiple modifiers -->
  <a @click.stop.prevent="handleClick" href="#">
    Stop propagation AND prevent default
  </a>

  <!-- Order matters for some combinations -->
  <form @submit.prevent.stop="onSubmit">
    Prevent then stop
  </form>
</template>
```

### Key Modifiers

::: code-group
```vue [JavaScript]
<script setup>
import { ref } from 'vue'

const searchQuery = ref('')

function search() {
  console.log('Searching for:', searchQuery.value)
}

function save() {
  console.log('Saving...')
}

function selectAll() {
  console.log('Select all')
}
</script>

<template>
  <!-- Specific keys -->
  <input
    v-model="searchQuery"
    @keyup.enter="search"
    placeholder="Press Enter to search"
  />

  <!-- Key aliases -->
  <input @keyup.escape="searchQuery = ''" placeholder="Press Esc to clear" />

  <!-- Key combinations -->
  <input @keyup.ctrl.s="save" placeholder="Ctrl+S to save" />
  <input @keyup.ctrl.a="selectAll" placeholder="Ctrl+A" />

  <!-- Multiple keys (any of them) -->
  <input @keyup.enter.tab="search" placeholder="Enter or Tab" />
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, Ref } from 'vue'

const searchQuery: Ref<string> = ref('')

function search(): void {
  console.log('Searching for:', searchQuery.value)
}

function save(): void {
  console.log('Saving...')
}

function selectAll(): void {
  console.log('Select all')
}
</script>

<template>
  <!-- Specific keys -->
  <input
    v-model="searchQuery"
    @keyup.enter="search"
    placeholder="Press Enter to search"
  />

  <!-- Key aliases -->
  <input @keyup.escape="searchQuery = ''" placeholder="Press Esc to clear" />

  <!-- Key combinations -->
  <input @keyup.ctrl.s="save" placeholder="Ctrl+S to save" />
  <input @keyup.ctrl.a="selectAll" placeholder="Ctrl+A" />
</template>
```
:::

### Key Aliases

| Alias | Key |
|-------|-----|
| `.enter` | Enter |
| `.tab` | Tab |
| `.delete` | Delete or Backspace |
| `.esc` | Escape |
| `.space` | Space |
| `.up` | Arrow Up |
| `.down` | Arrow Down |
| `.left` | Arrow Left |
| `.right` | Arrow Right |

### System Modifiers

```vue
<template>
  <!-- System modifier keys -->
  <input @keyup.ctrl="onCtrl" />
  <input @keyup.alt="onAlt" />
  <input @keyup.shift="onShift" />
  <input @keyup.meta="onMeta" /> <!-- Cmd on Mac, Windows key on Windows -->

  <!-- Exact modifier -->
  <button @click.ctrl.exact="onCtrlClick">
    Only fires with Ctrl (no other modifiers)
  </button>

  <button @click.exact="onClick">
    Only fires without any modifiers
  </button>
</template>
```

### Mouse Button Modifiers

```vue
<template>
  <button @click.left="onLeftClick">Left Click</button>
  <button @click.right="onRightClick">Right Click</button>
  <button @click.middle="onMiddleClick">Middle Click</button>
</template>
```

## Common DOM Events

### Mouse Events

::: code-group
```vue [JavaScript]
<script setup>
import { ref } from 'vue'

const position = ref({ x: 0, y: 0 })
const isHovered = ref(false)

function onMouseMove(event) {
  position.value = {
    x: event.clientX,
    y: event.clientY
  }
}
</script>

<template>
  <div
    class="mouse-area"
    @click="console.log('Clicked')"
    @dblclick="console.log('Double clicked')"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @mousemove="onMouseMove"
    @mousedown="console.log('Mouse down')"
    @mouseup="console.log('Mouse up')"
    @contextmenu.prevent="console.log('Right click')"
    :class="{ hovered: isHovered }"
  >
    <p>Move mouse here</p>
    <p>Position: {{ position.x }}, {{ position.y }}</p>
  </div>
</template>

<style scoped>
.mouse-area {
  padding: 40px;
  background: #f0f0f0;
  border: 2px solid #ddd;
  transition: all 0.3s;
}
.mouse-area.hovered {
  background: #e0f0e0;
  border-color: #42b883;
}
</style>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, Ref } from 'vue'

interface Position {
  x: number
  y: number
}

const position: Ref<Position> = ref({ x: 0, y: 0 })
const isHovered: Ref<boolean> = ref(false)

function onMouseMove(event: MouseEvent): void {
  position.value = {
    x: event.clientX,
    y: event.clientY
  }
}
</script>

<template>
  <div
    class="mouse-area"
    @click="console.log('Clicked')"
    @dblclick="console.log('Double clicked')"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
    @mousemove="onMouseMove"
    @mousedown="console.log('Mouse down')"
    @mouseup="console.log('Mouse up')"
    @contextmenu.prevent="console.log('Right click')"
    :class="{ hovered: isHovered }"
  >
    <p>Move mouse here</p>
    <p>Position: {{ position.x }}, {{ position.y }}</p>
  </div>
</template>

<style scoped>
.mouse-area {
  padding: 40px;
  background: #f0f0f0;
  border: 2px solid #ddd;
  transition: all 0.3s;
}
.mouse-area.hovered {
  background: #e0f0e0;
  border-color: #42b883;
}
</style>
```
:::

### Keyboard Events

::: code-group
```vue [JavaScript]
<script setup>
import { ref } from 'vue'

const pressedKeys = ref([])
const lastKey = ref('')

function onKeyDown(event) {
  lastKey.value = event.key
  if (!pressedKeys.value.includes(event.key)) {
    pressedKeys.value.push(event.key)
  }
}

function onKeyUp(event) {
  pressedKeys.value = pressedKeys.value.filter(k => k !== event.key)
}
</script>

<template>
  <div>
    <input
      @keydown="onKeyDown"
      @keyup="onKeyUp"
      @keypress="console.log('Key press:', $event.key)"
      placeholder="Press keys here..."
    />
    <p>Last key: {{ lastKey }}</p>
    <p>Currently pressed: {{ pressedKeys.join(', ') }}</p>
  </div>
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, Ref } from 'vue'

const pressedKeys: Ref<string[]> = ref([])
const lastKey: Ref<string> = ref('')

function onKeyDown(event: KeyboardEvent): void {
  lastKey.value = event.key
  if (!pressedKeys.value.includes(event.key)) {
    pressedKeys.value.push(event.key)
  }
}

function onKeyUp(event: KeyboardEvent): void {
  pressedKeys.value = pressedKeys.value.filter(k => k !== event.key)
}
</script>

<template>
  <div>
    <input
      @keydown="onKeyDown"
      @keyup="onKeyUp"
      @keypress="console.log('Key press:', $event.key)"
      placeholder="Press keys here..."
    />
    <p>Last key: {{ lastKey }}</p>
    <p>Currently pressed: {{ pressedKeys.join(', ') }}</p>
  </div>
</template>
```
:::

### Focus Events

::: code-group
```vue [JavaScript]
<script setup>
import { ref } from 'vue'

const isFocused = ref(false)
const focusHistory = ref([])

function onFocus(event) {
  isFocused.value = true
  focusHistory.value.push(`Focused: ${event.target.name}`)
}

function onBlur(event) {
  isFocused.value = false
  focusHistory.value.push(`Blurred: ${event.target.name}`)
}
</script>

<template>
  <div>
    <input
      name="field1"
      @focus="onFocus"
      @blur="onBlur"
      placeholder="Focus me"
      :class="{ focused: isFocused }"
    />

    <div class="history">
      <p v-for="(event, index) in focusHistory" :key="index">{{ event }}</p>
    </div>
  </div>
</template>

<style scoped>
input.focused {
  outline: 2px solid #42b883;
}
</style>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, Ref } from 'vue'

const isFocused: Ref<boolean> = ref(false)
const focusHistory: Ref<string[]> = ref([])

function onFocus(event: FocusEvent): void {
  isFocused.value = true
  const target = event.target as HTMLInputElement
  focusHistory.value.push(`Focused: ${target.name}`)
}

function onBlur(event: FocusEvent): void {
  isFocused.value = false
  const target = event.target as HTMLInputElement
  focusHistory.value.push(`Blurred: ${target.name}`)
}
</script>

<template>
  <div>
    <input
      name="field1"
      @focus="onFocus"
      @blur="onBlur"
      placeholder="Focus me"
      :class="{ focused: isFocused }"
    />

    <div class="history">
      <p v-for="(event, index) in focusHistory" :key="index">{{ event }}</p>
    </div>
  </div>
</template>

<style scoped>
input.focused {
  outline: 2px solid #42b883;
}
</style>
```
:::

## Custom Component Events

See [Components & Props](/guide/vue/03-components) for detailed coverage of emits.

::: code-group
```vue [JavaScript]
<!-- Child: SearchInput.vue -->
<script setup>
import { ref } from 'vue'

const emit = defineEmits(['search', 'clear'])
const query = ref('')

function handleSearch() {
  emit('search', query.value)
}

function handleClear() {
  query.value = ''
  emit('clear')
}
</script>

<template>
  <div class="search-input">
    <input
      v-model="query"
      @keyup.enter="handleSearch"
      placeholder="Search..."
    />
    <button @click="handleSearch">Search</button>
    <button @click="handleClear">Clear</button>
  </div>
</template>
```

```vue [TypeScript]
<!-- Child: SearchInput.vue -->
<script setup lang="ts">
import { ref, Ref } from 'vue'

const emit = defineEmits<{
  search: [query: string]
  clear: []
}>()

const query: Ref<string> = ref('')

function handleSearch(): void {
  emit('search', query.value)
}

function handleClear(): void {
  query.value = ''
  emit('clear')
}
</script>

<template>
  <div class="search-input">
    <input
      v-model="query"
      @keyup.enter="handleSearch"
      placeholder="Search..."
    />
    <button @click="handleSearch">Search</button>
    <button @click="handleClear">Clear</button>
  </div>
</template>
```
:::

Using the component:

```vue
<template>
  <SearchInput
    @search="handleSearch"
    @clear="handleClear"
  />
</template>
```

## Practical Example: Interactive Card

::: code-group
```vue [JavaScript]
<script setup>
import { ref } from 'vue'

const cards = ref([
  { id: 1, title: 'Card 1', content: 'Content for card 1', likes: 0, selected: false },
  { id: 2, title: 'Card 2', content: 'Content for card 2', likes: 5, selected: false },
  { id: 3, title: 'Card 3', content: 'Content for card 3', likes: 10, selected: false }
])

const contextMenu = ref({ visible: false, x: 0, y: 0, cardId: null })

function toggleSelect(card) {
  card.selected = !card.selected
}

function like(card, event) {
  event.stopPropagation()
  card.likes++
}

function showContextMenu(card, event) {
  event.preventDefault()
  contextMenu.value = {
    visible: true,
    x: event.clientX,
    y: event.clientY,
    cardId: card.id
  }
}

function hideContextMenu() {
  contextMenu.value.visible = false
}

function deleteCard(id) {
  cards.value = cards.value.filter(c => c.id !== id)
  hideContextMenu()
}

function duplicateCard(id) {
  const card = cards.value.find(c => c.id === id)
  if (card) {
    const newCard = {
      ...card,
      id: Date.now(),
      title: card.title + ' (copy)',
      likes: 0,
      selected: false
    }
    cards.value.push(newCard)
  }
  hideContextMenu()
}
</script>

<template>
  <div class="card-container" @click="hideContextMenu">
    <div
      v-for="card in cards"
      :key="card.id"
      class="card"
      :class="{ selected: card.selected }"
      @click="toggleSelect(card)"
      @dblclick="like(card, $event)"
      @contextmenu="showContextMenu(card, $event)"
      @mouseenter="card.hovered = true"
      @mouseleave="card.hovered = false"
    >
      <h3>{{ card.title }}</h3>
      <p>{{ card.content }}</p>
      <div class="card-footer">
        <span>{{ card.likes }} likes</span>
        <button @click="like(card, $event)">Like</button>
      </div>
    </div>

    <!-- Context Menu -->
    <div
      v-if="contextMenu.visible"
      class="context-menu"
      :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
      @click.stop
    >
      <button @click="duplicateCard(contextMenu.cardId)">Duplicate</button>
      <button @click="deleteCard(contextMenu.cardId)" class="danger">Delete</button>
    </div>
  </div>
</template>

<style scoped>
.card-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 20px;
}

.card {
  padding: 20px;
  border: 2px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}

.card:hover {
  border-color: #42b883;
  transform: translateY(-2px);
}

.card.selected {
  border-color: #42b883;
  background: #f0fff4;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.context-menu {
  position: fixed;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  z-index: 1000;
}

.context-menu button {
  display: block;
  width: 100%;
  padding: 10px 20px;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
}

.context-menu button:hover {
  background: #f0f0f0;
}

.context-menu button.danger:hover {
  background: #ffe0e0;
  color: red;
}
</style>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, Ref } from 'vue'

interface Card {
  id: number
  title: string
  content: string
  likes: number
  selected: boolean
  hovered?: boolean
}

interface ContextMenu {
  visible: boolean
  x: number
  y: number
  cardId: number | null
}

const cards: Ref<Card[]> = ref([
  { id: 1, title: 'Card 1', content: 'Content for card 1', likes: 0, selected: false },
  { id: 2, title: 'Card 2', content: 'Content for card 2', likes: 5, selected: false },
  { id: 3, title: 'Card 3', content: 'Content for card 3', likes: 10, selected: false }
])

const contextMenu: Ref<ContextMenu> = ref({ visible: false, x: 0, y: 0, cardId: null })

function toggleSelect(card: Card): void {
  card.selected = !card.selected
}

function like(card: Card, event: MouseEvent): void {
  event.stopPropagation()
  card.likes++
}

function showContextMenu(card: Card, event: MouseEvent): void {
  event.preventDefault()
  contextMenu.value = {
    visible: true,
    x: event.clientX,
    y: event.clientY,
    cardId: card.id
  }
}

function hideContextMenu(): void {
  contextMenu.value.visible = false
}

function deleteCard(id: number | null): void {
  if (id !== null) {
    cards.value = cards.value.filter(c => c.id !== id)
  }
  hideContextMenu()
}

function duplicateCard(id: number | null): void {
  if (id === null) return
  const card = cards.value.find(c => c.id === id)
  if (card) {
    const newCard: Card = {
      ...card,
      id: Date.now(),
      title: card.title + ' (copy)',
      likes: 0,
      selected: false
    }
    cards.value.push(newCard)
  }
  hideContextMenu()
}
</script>

<template>
  <div class="card-container" @click="hideContextMenu">
    <div
      v-for="card in cards"
      :key="card.id"
      class="card"
      :class="{ selected: card.selected }"
      @click="toggleSelect(card)"
      @dblclick="like(card, $event)"
      @contextmenu="showContextMenu(card, $event)"
      @mouseenter="card.hovered = true"
      @mouseleave="card.hovered = false"
    >
      <h3>{{ card.title }}</h3>
      <p>{{ card.content }}</p>
      <div class="card-footer">
        <span>{{ card.likes }} likes</span>
        <button @click="like(card, $event)">Like</button>
      </div>
    </div>

    <!-- Context Menu -->
    <div
      v-if="contextMenu.visible"
      class="context-menu"
      :style="{ left: contextMenu.x + 'px', top: contextMenu.y + 'px' }"
      @click.stop
    >
      <button @click="duplicateCard(contextMenu.cardId)">Duplicate</button>
      <button @click="deleteCard(contextMenu.cardId)" class="danger">Delete</button>
    </div>
  </div>
</template>

<style scoped>
.card-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  padding: 20px;
}

.card {
  padding: 20px;
  border: 2px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  user-select: none;
}

.card:hover {
  border-color: #42b883;
  transform: translateY(-2px);
}

.card.selected {
  border-color: #42b883;
  background: #f0fff4;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.context-menu {
  position: fixed;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  z-index: 1000;
}

.context-menu button {
  display: block;
  width: 100%;
  padding: 10px 20px;
  border: none;
  background: none;
  cursor: pointer;
  text-align: left;
}

.context-menu button:hover {
  background: #f0f0f0;
}

.context-menu button.danger:hover {
  background: #ffe0e0;
  color: red;
}
</style>
```
:::

## Summary

| Concept | Syntax | Example |
|---------|--------|---------|
| Listen to event | `@event` | `@click="handler"` |
| Event object | `$event` | `@click="fn($event)"` |
| Prevent default | `.prevent` | `@submit.prevent` |
| Stop propagation | `.stop` | `@click.stop` |
| Key modifier | `.key` | `@keyup.enter` |
| System modifier | `.ctrl` | `@click.ctrl` |
| Once | `.once` | `@click.once` |
| Custom emit | `emit()` | `emit('custom', data)` |

## What's Next?

In the next chapter, we'll learn about [Computed & Watchers](/guide/vue/06-computed-watchers) - derived state and side effects.

---

[Previous: Reactivity & State](/guide/vue/04-reactivity) | [Next: Computed & Watchers →](/guide/vue/06-computed-watchers)
