# JSX & TSX - JavaScript/TypeScript XML

JSX (and TSX for TypeScript) is the syntax that makes React special. It looks like HTML but lives inside JavaScript/TypeScript. In this tutorial, you'll master JSX/TSX and understand how it works.

## What is JSX/TSX?

JSX stands for **JavaScript XML**, TSX is the TypeScript version. It's a syntax extension that lets you write HTML-like code in JavaScript/TypeScript.

```
┌─────────────────────────────────────────────────────────────┐
│                    JSX Transformation                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   What you write (JSX/TSX):                                 │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  <h1 className="title">Hello, World!</h1>           │  │
│   └─────────────────────────────────────────────────────┘  │
│                          │                                  │
│                          ▼ Babel/TypeScript transforms      │
│   What React sees (JavaScript):                             │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  React.createElement(                                │  │
│   │    'h1',                                             │  │
│   │    { className: 'title' },                           │  │
│   │    'Hello, World!'                                   │  │
│   │  )                                                   │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
│   JSX/TSX is syntactic sugar for React.createElement()!    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## JSX vs HTML

JSX looks like HTML, but there are important differences:

| HTML | JSX/TSX | Why? |
|------|---------|------|
| `class` | `className` | `class` is reserved in JS/TS |
| `for` | `htmlFor` | `for` is reserved in JS/TS |
| `onclick` | `onClick` | camelCase for events |
| `tabindex` | `tabIndex` | camelCase for attributes |
| `<br>` | `<br />` | Must close all tags |
| `style="color: red"` | `style={ { color: 'red' } }` | Object, not string |

### Examples

::: code-group
```jsx [JavaScript]
// JSX syntax
<div className="container" onClick={handleClick}>
  <label htmlFor="name">Name:</label>
  <input type="text" tabIndex={1} />
  <br />
  <img src="photo.jpg" alt="Photo" />
</div>
```

```tsx [TypeScript]
// TSX syntax (same as JSX, but in .tsx files)
<div className="container" onClick={handleClick}>
  <label htmlFor="name">Name:</label>
  <input type="text" tabIndex={1} />
  <br />
  <img src="photo.jpg" alt="Photo" />
</div>
```
:::

## Embedding JavaScript/TypeScript Expressions

Use curly braces `{}` to embed code in JSX/TSX:

### Variables

::: code-group
```jsx [JavaScript]
function Greeting() {
  const name = "Alice"
  const age = 25

  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>You are {age} years old.</p>
    </div>
  )
}
```

```tsx [TypeScript]
function Greeting(): JSX.Element {
  const name: string = "Alice"
  const age: number = 25

  return (
    <div>
      <h1>Hello, {name}!</h1>
      <p>You are {age} years old.</p>
    </div>
  )
}
```
:::

### Expressions

::: code-group
```jsx [JavaScript]
function MathExample() {
  const a = 10
  const b = 5

  return (
    <div>
      <p>Sum: {a + b}</p>
      <p>Product: {a * b}</p>
      <p>Random: {Math.floor(Math.random() * 100)}</p>
      <p>Date: {new Date().toLocaleDateString()}</p>
    </div>
  )
}
```

```tsx [TypeScript]
function MathExample(): JSX.Element {
  const a: number = 10
  const b: number = 5

  return (
    <div>
      <p>Sum: {a + b}</p>
      <p>Product: {a * b}</p>
      <p>Random: {Math.floor(Math.random() * 100)}</p>
      <p>Date: {new Date().toLocaleDateString()}</p>
    </div>
  )
}
```
:::

### Function Calls

::: code-group
```jsx [JavaScript]
function formatName(user) {
  return `${user.firstName} ${user.lastName}`
}

function UserInfo() {
  const user = {
    firstName: "John",
    lastName: "Doe"
  }

  return <h1>Hello, {formatName(user)}!</h1>
}
```

```tsx [TypeScript]
interface User {
  firstName: string;
  lastName: string;
}

function formatName(user: User): string {
  return `${user.firstName} ${user.lastName}`
}

function UserInfo(): JSX.Element {
  const user: User = {
    firstName: "John",
    lastName: "Doe"
  }

  return <h1>Hello, {formatName(user)}!</h1>
}
```
:::

## Conditional Rendering

### Using Ternary Operator

::: code-group
```jsx [JavaScript]
function Greeting({ isLoggedIn }) {
  return (
    <div>
      {isLoggedIn ? (
        <h1>Welcome back!</h1>
      ) : (
        <h1>Please sign in.</h1>
      )}
    </div>
  )
}
```

```tsx [TypeScript]
interface GreetingProps {
  isLoggedIn: boolean;
}

function Greeting({ isLoggedIn }: GreetingProps): JSX.Element {
  return (
    <div>
      {isLoggedIn ? (
        <h1>Welcome back!</h1>
      ) : (
        <h1>Please sign in.</h1>
      )}
    </div>
  )
}
```
:::

### Using && (Short Circuit)

::: code-group
```jsx [JavaScript]
function Notification({ hasMessages, count }) {
  return (
    <div>
      {/* Shows only if hasMessages is true */}
      {hasMessages && <p>You have {count} new messages!</p>}

      {/* Shows only if count > 0 */}
      {count > 0 && <span className="badge">{count}</span>}
    </div>
  )
}
```

```tsx [TypeScript]
interface NotificationProps {
  hasMessages: boolean;
  count: number;
}

function Notification({ hasMessages, count }: NotificationProps): JSX.Element {
  return (
    <div>
      {/* Shows only if hasMessages is true */}
      {hasMessages && <p>You have {count} new messages!</p>}

      {/* Shows only if count > 0 */}
      {count > 0 && <span className="badge">{count}</span>}
    </div>
  )
}
```
:::

### Multiple Conditions

::: code-group
```jsx [JavaScript]
function StatusBadge({ status }) {
  return (
    <span className="badge">
      {status === 'active' && '🟢 Active'}
      {status === 'pending' && '🟡 Pending'}
      {status === 'inactive' && '🔴 Inactive'}
    </span>
  )
}
```

```tsx [TypeScript]
type Status = 'active' | 'pending' | 'inactive';

interface StatusBadgeProps {
  status: Status;
}

function StatusBadge({ status }: StatusBadgeProps): JSX.Element {
  return (
    <span className="badge">
      {status === 'active' && '🟢 Active'}
      {status === 'pending' && '🟡 Pending'}
      {status === 'inactive' && '🔴 Inactive'}
    </span>
  )
}
```
:::

## Rendering Lists

Use `map()` to render arrays:

### Simple List

::: code-group
```jsx [JavaScript]
function FruitList() {
  const fruits = ['Apple', 'Banana', 'Orange', 'Mango']

  return (
    <ul>
      {fruits.map((fruit, index) => (
        <li key={index}>{fruit}</li>
      ))}
    </ul>
  )
}
```

```tsx [TypeScript]
function FruitList(): JSX.Element {
  const fruits: string[] = ['Apple', 'Banana', 'Orange', 'Mango']

  return (
    <ul>
      {fruits.map((fruit: string, index: number) => (
        <li key={index}>{fruit}</li>
      ))}
    </ul>
  )
}
```
:::

### List of Objects

::: code-group
```jsx [JavaScript]
function UserList() {
  const users = [
    { id: 1, name: 'Alice', role: 'Developer' },
    { id: 2, name: 'Bob', role: 'Designer' },
    { id: 3, name: 'Charlie', role: 'Manager' }
  ]

  return (
    <div className="user-list">
      {users.map(user => (
        <div key={user.id} className="user-card">
          <h3>{user.name}</h3>
          <p>{user.role}</p>
        </div>
      ))}
    </div>
  )
}
```

```tsx [TypeScript]
interface User {
  id: number;
  name: string;
  role: string;
}

function UserList(): JSX.Element {
  const users: User[] = [
    { id: 1, name: 'Alice', role: 'Developer' },
    { id: 2, name: 'Bob', role: 'Designer' },
    { id: 3, name: 'Charlie', role: 'Manager' }
  ]

  return (
    <div className="user-list">
      {users.map((user: User) => (
        <div key={user.id} className="user-card">
          <h3>{user.name}</h3>
          <p>{user.role}</p>
        </div>
      ))}
    </div>
  )
}
```
:::

### The `key` Prop

::: warning Important
Always provide a unique `key` when rendering lists!
:::

```jsx
// ❌ Bad - using index as key (avoid when list changes)
{items.map((item, index) => (
  <Item key={index} data={item} />
))}

// ✅ Good - using unique ID
{items.map(item => (
  <Item key={item.id} data={item} />
))}
```

## Styling in JSX/TSX

### Inline Styles

::: code-group
```jsx [JavaScript]
function StyledComponent() {
  const containerStyle = {
    backgroundColor: '#f0f0f0',
    padding: '20px',
    borderRadius: '8px'
  }

  return (
    <div style={containerStyle}>
      <h1 style={{ color: '#333', fontSize: '24px' }}>
        Styled Title
      </h1>
    </div>
  )
}
```

```tsx [TypeScript]
import { CSSProperties } from 'react'

function StyledComponent(): JSX.Element {
  const containerStyle: CSSProperties = {
    backgroundColor: '#f0f0f0',
    padding: '20px',
    borderRadius: '8px'
  }

  const titleStyle: CSSProperties = {
    color: '#333',
    fontSize: '24px'
  }

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>Styled Title</h1>
    </div>
  )
}
```
:::

### Dynamic Styles

::: code-group
```jsx [JavaScript]
function DynamicButton({ isActive, size }) {
  const buttonStyle = {
    backgroundColor: isActive ? '#4CAF50' : '#ccc',
    color: isActive ? 'white' : '#666',
    padding: size === 'large' ? '16px 32px' : '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: isActive ? 'pointer' : 'not-allowed'
  }

  return (
    <button style={buttonStyle}>
      {isActive ? 'Active' : 'Inactive'}
    </button>
  )
}
```

```tsx [TypeScript]
import { CSSProperties } from 'react'

interface DynamicButtonProps {
  isActive: boolean;
  size: 'small' | 'large';
}

function DynamicButton({ isActive, size }: DynamicButtonProps): JSX.Element {
  const buttonStyle: CSSProperties = {
    backgroundColor: isActive ? '#4CAF50' : '#ccc',
    color: isActive ? 'white' : '#666',
    padding: size === 'large' ? '16px 32px' : '8px 16px',
    border: 'none',
    borderRadius: '4px',
    cursor: isActive ? 'pointer' : 'not-allowed'
  }

  return (
    <button style={buttonStyle}>
      {isActive ? 'Active' : 'Inactive'}
    </button>
  )
}
```
:::

### CSS Classes

::: code-group
```jsx [JavaScript]
function Button({ variant, children }) {
  return (
    <button className={`btn btn-${variant}`}>
      {children}
    </button>
  )
}

// Usage
<Button variant="primary">Click Me</Button>
<Button variant="secondary">Cancel</Button>
```

```tsx [TypeScript]
import { ReactNode } from 'react'

interface ButtonProps {
  variant: 'primary' | 'secondary' | 'danger';
  children: ReactNode;
}

function Button({ variant, children }: ButtonProps): JSX.Element {
  return (
    <button className={`btn btn-${variant}`}>
      {children}
    </button>
  )
}

// Usage - TypeScript validates variant values
<Button variant="primary">Click Me</Button>
<Button variant="secondary">Cancel</Button>
```
:::

## Fragments

When you need to return multiple elements without a wrapper:

```jsx
// ❌ Adds unnecessary div
function Items() {
  return (
    <div>
      <li>Item 1</li>
      <li>Item 2</li>
    </div>
  )
}

// ✅ Using Fragment - no extra DOM element
function Items() {
  return (
    <>
      <li>Item 1</li>
      <li>Item 2</li>
    </>
  )
}
```

### Fragment with Key

::: code-group
```jsx [JavaScript]
function Glossary({ items }) {
  return (
    <dl>
      {items.map(item => (
        <React.Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </React.Fragment>
      ))}
    </dl>
  )
}
```

```tsx [TypeScript]
import React from 'react'

interface GlossaryItem {
  id: number;
  term: string;
  description: string;
}

interface GlossaryProps {
  items: GlossaryItem[];
}

function Glossary({ items }: GlossaryProps): JSX.Element {
  return (
    <dl>
      {items.map((item: GlossaryItem) => (
        <React.Fragment key={item.id}>
          <dt>{item.term}</dt>
          <dd>{item.description}</dd>
        </React.Fragment>
      ))}
    </dl>
  )
}
```
:::

## Spread Attributes

Pass all properties of an object as props:

::: code-group
```jsx [JavaScript]
function Button(props) {
  return <button {...props} />
}

// Usage
const buttonProps = {
  className: 'btn',
  onClick: handleClick,
  disabled: false
}

<Button {...buttonProps}>Submit</Button>
```

```tsx [TypeScript]
import { ButtonHTMLAttributes } from 'react'

// Extend native button attributes
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
}

function Button({ variant = 'primary', ...props }: ButtonProps): JSX.Element {
  return (
    <button className={`btn btn-${variant}`} {...props} />
  )
}

// Usage - full type safety for all button attributes
<Button onClick={handleClick} disabled={false}>
  Submit
</Button>
```
:::

## Practical Example: Product Card

::: code-group
```jsx [JavaScript]
function ProductCard({ product }) {
  const { name, price, originalPrice, inStock, rating, tags } = product

  const discount = originalPrice
    ? Math.round((1 - price / originalPrice) * 100)
    : 0

  return (
    <div className="product-card">
      <h3>{name}</h3>

      {/* Rating */}
      <div className="rating">
        {'★'.repeat(Math.floor(rating))}
        {'☆'.repeat(5 - Math.floor(rating))}
      </div>

      {/* Price */}
      <div className="price">
        <span className="current">${price}</span>
        {originalPrice && (
          <>
            <span className="original">${originalPrice}</span>
            <span className="discount">-{discount}%</span>
          </>
        )}
      </div>

      {/* Stock Status */}
      <p className={inStock ? 'in-stock' : 'out-of-stock'}>
        {inStock ? '✓ In Stock' : '✗ Out of Stock'}
      </p>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="tags">
          {tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
      )}

      <button disabled={!inStock}>
        {inStock ? 'Add to Cart' : 'Sold Out'}
      </button>
    </div>
  )
}
```

```tsx [TypeScript]
interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  rating: number;
  tags?: string[];
}

interface ProductCardProps {
  product: Product;
}

function ProductCard({ product }: ProductCardProps): JSX.Element {
  const { name, price, originalPrice, inStock, rating, tags } = product

  const discount: number = originalPrice
    ? Math.round((1 - price / originalPrice) * 100)
    : 0

  return (
    <div className="product-card">
      <h3>{name}</h3>

      {/* Rating */}
      <div className="rating">
        {'★'.repeat(Math.floor(rating))}
        {'☆'.repeat(5 - Math.floor(rating))}
      </div>

      {/* Price */}
      <div className="price">
        <span className="current">${price}</span>
        {originalPrice && (
          <>
            <span className="original">${originalPrice}</span>
            <span className="discount">-{discount}%</span>
          </>
        )}
      </div>

      {/* Stock Status */}
      <p className={inStock ? 'in-stock' : 'out-of-stock'}>
        {inStock ? '✓ In Stock' : '✗ Out of Stock'}
      </p>

      {/* Tags */}
      {tags && tags.length > 0 && (
        <div className="tags">
          {tags.map((tag: string, index: number) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
      )}

      <button disabled={!inStock}>
        {inStock ? 'Add to Cart' : 'Sold Out'}
      </button>
    </div>
  )
}
```
:::

## TypeScript-Specific: Common Types

```tsx
import {
  ReactNode,
  ReactElement,
  CSSProperties,
  MouseEvent,
  ChangeEvent
} from 'react';

// Common prop types
interface CommonProps {
  // Any renderable content
  children: ReactNode;

  // A single React element
  icon: ReactElement;

  // Inline styles
  style?: CSSProperties;

  // CSS class
  className?: string;

  // Event handlers
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}
```

## Summary

| Concept | JavaScript | TypeScript |
|---------|------------|------------|
| **File Extension** | `.jsx` | `.tsx` |
| **Expression** | `{variable}` | `{variable}` |
| **Props** | `{ name }` | `{ name }: Props` |
| **Styles** | `style={ { } }` | `style: CSSProperties` |
| **Event Handler** | `onClick={fn}` | `onClick: (e: MouseEvent) => void` |
| **List Types** | `items.map()` | `items.map((item: Type) => )` |

## What's Next?

In the next chapter, we'll learn about [Components & Props](/guide/react/03-components) - how to create reusable components and pass data between them.

---

[Next: Components & Props →](/guide/react/03-components)
