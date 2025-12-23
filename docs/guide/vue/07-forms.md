# Form Handling

Forms are essential for user input in web applications. Vue's `v-model` directive makes form handling intuitive and powerful. In this tutorial, you'll learn how to handle various form inputs and validation.

## v-model Basics

`v-model` creates two-way data binding on form inputs:

::: code-group
```vue [JavaScript]
<script setup>
import { ref } from 'vue'

const message = ref('')
const name = ref('')
</script>

<template>
  <div>
    <!-- Text input -->
    <input v-model="message" placeholder="Type a message" />
    <p>Message: {{ message }}</p>

    <!-- v-model is shorthand for: -->
    <input
      :value="name"
      @input="name = $event.target.value"
      placeholder="Your name"
    />
    <p>Name: {{ name }}</p>
  </div>
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, Ref } from 'vue'

const message: Ref<string> = ref('')
const name: Ref<string> = ref('')
</script>

<template>
  <div>
    <!-- Text input -->
    <input v-model="message" placeholder="Type a message" />
    <p>Message: {{ message }}</p>

    <!-- v-model is shorthand for: -->
    <input
      :value="name"
      @input="name = ($event.target as HTMLInputElement).value"
      placeholder="Your name"
    />
    <p>Name: {{ name }}</p>
  </div>
</template>
```
:::

## Form Input Types

### Text Inputs

::: code-group
```vue [JavaScript]
<script setup>
import { ref } from 'vue'

const text = ref('')
const email = ref('')
const password = ref('')
const number = ref(0)
const textarea = ref('')
</script>

<template>
  <form>
    <!-- Text -->
    <input v-model="text" type="text" placeholder="Text" />

    <!-- Email -->
    <input v-model="email" type="email" placeholder="Email" />

    <!-- Password -->
    <input v-model="password" type="password" placeholder="Password" />

    <!-- Number (use .number modifier) -->
    <input v-model.number="number" type="number" placeholder="Number" />

    <!-- Textarea -->
    <textarea v-model="textarea" placeholder="Long text..."></textarea>
  </form>
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, Ref } from 'vue'

const text: Ref<string> = ref('')
const email: Ref<string> = ref('')
const password: Ref<string> = ref('')
const number: Ref<number> = ref(0)
const textarea: Ref<string> = ref('')
</script>

<template>
  <form>
    <!-- Text -->
    <input v-model="text" type="text" placeholder="Text" />

    <!-- Email -->
    <input v-model="email" type="email" placeholder="Email" />

    <!-- Password -->
    <input v-model="password" type="password" placeholder="Password" />

    <!-- Number (use .number modifier) -->
    <input v-model.number="number" type="number" placeholder="Number" />

    <!-- Textarea -->
    <textarea v-model="textarea" placeholder="Long text..."></textarea>
  </form>
</template>
```
:::

### Checkboxes

::: code-group
```vue [JavaScript]
<script setup>
import { ref } from 'vue'

// Single checkbox (boolean)
const agreed = ref(false)

// Multiple checkboxes (array)
const selectedFruits = ref([])
const fruits = ['Apple', 'Banana', 'Orange', 'Mango']

// Custom values
const status = ref('inactive')
</script>

<template>
  <div>
    <!-- Single checkbox -->
    <label>
      <input type="checkbox" v-model="agreed" />
      I agree to the terms
    </label>
    <p>Agreed: {{ agreed }}</p>

    <!-- Multiple checkboxes -->
    <p>Select fruits:</p>
    <label v-for="fruit in fruits" :key="fruit">
      <input type="checkbox" v-model="selectedFruits" :value="fruit" />
      {{ fruit }}
    </label>
    <p>Selected: {{ selectedFruits.join(', ') }}</p>

    <!-- Custom true/false values -->
    <label>
      <input
        type="checkbox"
        v-model="status"
        true-value="active"
        false-value="inactive"
      />
      Active status
    </label>
    <p>Status: {{ status }}</p>
  </div>
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, Ref } from 'vue'

// Single checkbox (boolean)
const agreed: Ref<boolean> = ref(false)

// Multiple checkboxes (array)
const selectedFruits: Ref<string[]> = ref([])
const fruits: string[] = ['Apple', 'Banana', 'Orange', 'Mango']

// Custom values
const status: Ref<string> = ref('inactive')
</script>

<template>
  <div>
    <!-- Single checkbox -->
    <label>
      <input type="checkbox" v-model="agreed" />
      I agree to the terms
    </label>
    <p>Agreed: {{ agreed }}</p>

    <!-- Multiple checkboxes -->
    <p>Select fruits:</p>
    <label v-for="fruit in fruits" :key="fruit">
      <input type="checkbox" v-model="selectedFruits" :value="fruit" />
      {{ fruit }}
    </label>
    <p>Selected: {{ selectedFruits.join(', ') }}</p>

    <!-- Custom true/false values -->
    <label>
      <input
        type="checkbox"
        v-model="status"
        true-value="active"
        false-value="inactive"
      />
      Active status
    </label>
    <p>Status: {{ status }}</p>
  </div>
</template>
```
:::

### Radio Buttons

::: code-group
```vue [JavaScript]
<script setup>
import { ref } from 'vue'

const selectedColor = ref('')
const colors = ['Red', 'Green', 'Blue']

const priority = ref('medium')
</script>

<template>
  <div>
    <!-- Radio group -->
    <p>Select a color:</p>
    <label v-for="color in colors" :key="color">
      <input type="radio" v-model="selectedColor" :value="color" />
      {{ color }}
    </label>
    <p>Selected: {{ selectedColor }}</p>

    <!-- Inline radio buttons -->
    <p>Priority:</p>
    <label><input type="radio" v-model="priority" value="low" /> Low</label>
    <label><input type="radio" v-model="priority" value="medium" /> Medium</label>
    <label><input type="radio" v-model="priority" value="high" /> High</label>
    <p>Priority: {{ priority }}</p>
  </div>
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, Ref } from 'vue'

const selectedColor: Ref<string> = ref('')
const colors: string[] = ['Red', 'Green', 'Blue']

type Priority = 'low' | 'medium' | 'high'
const priority: Ref<Priority> = ref('medium')
</script>

<template>
  <div>
    <!-- Radio group -->
    <p>Select a color:</p>
    <label v-for="color in colors" :key="color">
      <input type="radio" v-model="selectedColor" :value="color" />
      {{ color }}
    </label>
    <p>Selected: {{ selectedColor }}</p>

    <!-- Inline radio buttons -->
    <p>Priority:</p>
    <label><input type="radio" v-model="priority" value="low" /> Low</label>
    <label><input type="radio" v-model="priority" value="medium" /> Medium</label>
    <label><input type="radio" v-model="priority" value="high" /> High</label>
    <p>Priority: {{ priority }}</p>
  </div>
</template>
```
:::

### Select Dropdowns

::: code-group
```vue [JavaScript]
<script setup>
import { ref } from 'vue'

// Single select
const selectedCountry = ref('')
const countries = [
  { code: 'us', name: 'United States' },
  { code: 'uk', name: 'United Kingdom' },
  { code: 'jp', name: 'Japan' },
  { code: 'kr', name: 'South Korea' }
]

// Multiple select
const selectedSkills = ref([])
const skills = ['JavaScript', 'TypeScript', 'Vue', 'React', 'Node.js']
</script>

<template>
  <div>
    <!-- Single select -->
    <select v-model="selectedCountry">
      <option value="" disabled>Select a country</option>
      <option v-for="country in countries" :key="country.code" :value="country.code">
        {{ country.name }}
      </option>
    </select>
    <p>Selected: {{ selectedCountry }}</p>

    <!-- Multiple select -->
    <select v-model="selectedSkills" multiple>
      <option v-for="skill in skills" :key="skill" :value="skill">
        {{ skill }}
      </option>
    </select>
    <p>Skills: {{ selectedSkills.join(', ') }}</p>
  </div>
</template>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, Ref } from 'vue'

interface Country {
  code: string
  name: string
}

// Single select
const selectedCountry: Ref<string> = ref('')
const countries: Country[] = [
  { code: 'us', name: 'United States' },
  { code: 'uk', name: 'United Kingdom' },
  { code: 'jp', name: 'Japan' },
  { code: 'kr', name: 'South Korea' }
]

// Multiple select
const selectedSkills: Ref<string[]> = ref([])
const skills: string[] = ['JavaScript', 'TypeScript', 'Vue', 'React', 'Node.js']
</script>

<template>
  <div>
    <!-- Single select -->
    <select v-model="selectedCountry">
      <option value="" disabled>Select a country</option>
      <option v-for="country in countries" :key="country.code" :value="country.code">
        {{ country.name }}
      </option>
    </select>
    <p>Selected: {{ selectedCountry }}</p>

    <!-- Multiple select -->
    <select v-model="selectedSkills" multiple>
      <option v-for="skill in skills" :key="skill" :value="skill">
        {{ skill }}
      </option>
    </select>
    <p>Skills: {{ selectedSkills.join(', ') }}</p>
  </div>
</template>
```
:::

## v-model Modifiers

### .lazy

Updates on `change` event instead of `input`:

```vue
<template>
  <!-- Updates only when input loses focus -->
  <input v-model.lazy="message" />
</template>
```

### .number

Converts input to number:

```vue
<template>
  <!-- Automatically converts to number -->
  <input v-model.number="age" type="number" />
</template>
```

### .trim

Trims whitespace:

```vue
<template>
  <!-- Trims leading/trailing whitespace -->
  <input v-model.trim="username" />
</template>
```

### Combining Modifiers

```vue
<template>
  <!-- Multiple modifiers -->
  <input v-model.lazy.trim="message" />
  <input v-model.number.lazy="price" type="number" />
</template>
```

## Form Validation

### Basic Validation

::: code-group
```vue [JavaScript]
<script setup>
import { ref, computed } from 'vue'

const form = ref({
  email: '',
  password: '',
  confirmPassword: ''
})

const errors = ref({})
const touched = ref({})

// Validation rules
const validateEmail = (email) => {
  if (!email) return 'Email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format'
  return ''
}

const validatePassword = (password) => {
  if (!password) return 'Password is required'
  if (password.length < 8) return 'Password must be at least 8 characters'
  return ''
}

const validateConfirmPassword = (confirm, password) => {
  if (!confirm) return 'Please confirm password'
  if (confirm !== password) return 'Passwords do not match'
  return ''
}

// Computed validation
const isValid = computed(() => {
  return !validateEmail(form.value.email) &&
    !validatePassword(form.value.password) &&
    !validateConfirmPassword(form.value.confirmPassword, form.value.password)
})

// Validate on blur
function validateField(field) {
  touched.value[field] = true
  if (field === 'email') {
    errors.value.email = validateEmail(form.value.email)
  } else if (field === 'password') {
    errors.value.password = validatePassword(form.value.password)
  } else if (field === 'confirmPassword') {
    errors.value.confirmPassword = validateConfirmPassword(
      form.value.confirmPassword,
      form.value.password
    )
  }
}

function handleSubmit() {
  // Validate all fields
  errors.value.email = validateEmail(form.value.email)
  errors.value.password = validatePassword(form.value.password)
  errors.value.confirmPassword = validateConfirmPassword(
    form.value.confirmPassword,
    form.value.password
  )

  Object.keys(form.value).forEach(key => touched.value[key] = true)

  if (isValid.value) {
    console.log('Form submitted:', form.value)
    alert('Form submitted successfully!')
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="form">
    <div class="field">
      <label>Email</label>
      <input
        v-model="form.email"
        type="email"
        @blur="validateField('email')"
        :class="{ error: touched.email && errors.email }"
      />
      <span v-if="touched.email && errors.email" class="error-message">
        {{ errors.email }}
      </span>
    </div>

    <div class="field">
      <label>Password</label>
      <input
        v-model="form.password"
        type="password"
        @blur="validateField('password')"
        :class="{ error: touched.password && errors.password }"
      />
      <span v-if="touched.password && errors.password" class="error-message">
        {{ errors.password }}
      </span>
    </div>

    <div class="field">
      <label>Confirm Password</label>
      <input
        v-model="form.confirmPassword"
        type="password"
        @blur="validateField('confirmPassword')"
        :class="{ error: touched.confirmPassword && errors.confirmPassword }"
      />
      <span v-if="touched.confirmPassword && errors.confirmPassword" class="error-message">
        {{ errors.confirmPassword }}
      </span>
    </div>

    <button type="submit" :disabled="!isValid">Submit</button>
  </form>
</template>

<style scoped>
.form {
  max-width: 400px;
  margin: 0 auto;
}
.field {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
input.error {
  border-color: red;
}
.error-message {
  color: red;
  font-size: 12px;
  margin-top: 5px;
  display: block;
}
button {
  width: 100%;
  padding: 12px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
```

```vue [TypeScript]
<script setup lang="ts">
import { ref, computed, Ref, ComputedRef } from 'vue'

interface FormData {
  email: string
  password: string
  confirmPassword: string
}

interface FormErrors {
  email?: string
  password?: string
  confirmPassword?: string
}

interface TouchedFields {
  email?: boolean
  password?: boolean
  confirmPassword?: boolean
}

const form: Ref<FormData> = ref({
  email: '',
  password: '',
  confirmPassword: ''
})

const errors: Ref<FormErrors> = ref({})
const touched: Ref<TouchedFields> = ref({})

// Validation rules
const validateEmail = (email: string): string => {
  if (!email) return 'Email is required'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return 'Invalid email format'
  return ''
}

const validatePassword = (password: string): string => {
  if (!password) return 'Password is required'
  if (password.length < 8) return 'Password must be at least 8 characters'
  return ''
}

const validateConfirmPassword = (confirm: string, password: string): string => {
  if (!confirm) return 'Please confirm password'
  if (confirm !== password) return 'Passwords do not match'
  return ''
}

// Computed validation
const isValid: ComputedRef<boolean> = computed(() => {
  return !validateEmail(form.value.email) &&
    !validatePassword(form.value.password) &&
    !validateConfirmPassword(form.value.confirmPassword, form.value.password)
})

// Validate on blur
function validateField(field: keyof FormData): void {
  touched.value[field] = true
  if (field === 'email') {
    errors.value.email = validateEmail(form.value.email)
  } else if (field === 'password') {
    errors.value.password = validatePassword(form.value.password)
  } else if (field === 'confirmPassword') {
    errors.value.confirmPassword = validateConfirmPassword(
      form.value.confirmPassword,
      form.value.password
    )
  }
}

function handleSubmit(): void {
  errors.value.email = validateEmail(form.value.email)
  errors.value.password = validatePassword(form.value.password)
  errors.value.confirmPassword = validateConfirmPassword(
    form.value.confirmPassword,
    form.value.password
  )

  ;(Object.keys(form.value) as (keyof FormData)[]).forEach(key => touched.value[key] = true)

  if (isValid.value) {
    console.log('Form submitted:', form.value)
    alert('Form submitted successfully!')
  }
}
</script>

<template>
  <form @submit.prevent="handleSubmit" class="form">
    <div class="field">
      <label>Email</label>
      <input
        v-model="form.email"
        type="email"
        @blur="validateField('email')"
        :class="{ error: touched.email && errors.email }"
      />
      <span v-if="touched.email && errors.email" class="error-message">
        {{ errors.email }}
      </span>
    </div>

    <div class="field">
      <label>Password</label>
      <input
        v-model="form.password"
        type="password"
        @blur="validateField('password')"
        :class="{ error: touched.password && errors.password }"
      />
      <span v-if="touched.password && errors.password" class="error-message">
        {{ errors.password }}
      </span>
    </div>

    <div class="field">
      <label>Confirm Password</label>
      <input
        v-model="form.confirmPassword"
        type="password"
        @blur="validateField('confirmPassword')"
        :class="{ error: touched.confirmPassword && errors.confirmPassword }"
      />
      <span v-if="touched.confirmPassword && errors.confirmPassword" class="error-message">
        {{ errors.confirmPassword }}
      </span>
    </div>

    <button type="submit" :disabled="!isValid">Submit</button>
  </form>
</template>

<style scoped>
.form {
  max-width: 400px;
  margin: 0 auto;
}
.field {
  margin-bottom: 15px;
}
label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}
input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}
input.error {
  border-color: red;
}
.error-message {
  color: red;
  font-size: 12px;
  margin-top: 5px;
  display: block;
}
button {
  width: 100%;
  padding: 12px;
  background: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:disabled {
  background: #ccc;
  cursor: not-allowed;
}
</style>
```
:::

## Summary

| Feature | Syntax | Description |
|---------|--------|-------------|
| Basic binding | `v-model="value"` | Two-way binding |
| Lazy update | `v-model.lazy` | Update on change |
| Number type | `v-model.number` | Convert to number |
| Trim whitespace | `v-model.trim` | Remove whitespace |
| Checkbox array | `v-model="array"` | Multiple selection |
| Radio group | Same `v-model` | Single selection |
| Select | `v-model="value"` | Dropdown selection |

## What's Next?

In the next chapter, we'll learn about [Lifecycle Hooks](/guide/vue/08-lifecycle) - component lifecycle management.

---

[Previous: Computed & Watchers](/guide/vue/06-computed-watchers) | [Next: Lifecycle Hooks →](/guide/vue/08-lifecycle)
