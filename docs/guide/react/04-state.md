# State & useState

State is what makes React components interactive. In this tutorial, you'll learn how to use the `useState` hook to manage component data that changes over time.

## What is State?

State is data that a component manages internally and can change over time. When state changes, React automatically re-renders the component.

```
┌─────────────────────────────────────────────────────────────┐
│                    Props vs State                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Props                          State                      │
│   ┌────────────────────┐        ┌────────────────────┐     │
│   │ • Passed from      │        │ • Managed inside   │     │
│   │   parent           │        │   component        │     │
│   │ • Read-only        │        │ • Can be changed   │     │
│   │ • Component input  │        │ • Component memory │     │
│   │ • Like function    │        │ • Triggers         │     │
│   │   parameters       │        │   re-render        │     │
│   └────────────────────┘        └────────────────────┘     │
│                                                             │
│   Example:                                                  │
│   ┌──────────────────────────────────────────────────────┐ │
│   │ <Counter initialValue={0} />                         │ │
│   │            ↓ (prop)                                   │ │
│   │ const [count, setCount] = useState(initialValue);    │ │
│   │              ↓ (state - changes when user clicks)    │ │
│   └──────────────────────────────────────────────────────┘ │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## The useState Hook

### Basic Syntax

::: code-group
```jsx [JavaScript]
import { useState } from 'react';

function Counter() {
    // Declare state variable
    const [count, setCount] = useState(0);
    //     ↑       ↑              ↑
    //     │       │              └── Initial value
    //     │       └── Function to update state
    //     └── Current state value

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>
                Increment
            </button>
        </div>
    );
}
```

```tsx [TypeScript]
import { useState } from 'react';

function Counter(): JSX.Element {
    // TypeScript infers type from initial value
    const [count, setCount] = useState(0);
    // count is inferred as number
    // setCount accepts number | ((prev: number) => number)

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>
                Increment
            </button>
        </div>
    );
}

// Explicit type annotation (when needed)
function Counter2(): JSX.Element {
    const [count, setCount] = useState<number>(0);

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>
                Increment
            </button>
        </div>
    );
}
```
:::

### How useState Works

```
┌─────────────────────────────────────────────────────────────┐
│                    useState Flow                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   1. Initial Render                                         │
│      useState(0) → count = 0                                │
│                                                             │
│   2. User Clicks Button                                     │
│      setCount(1) called                                     │
│                                                             │
│   3. React Schedules Re-render                              │
│      Component function runs again                          │
│                                                             │
│   4. Next Render                                            │
│      useState(0) → count = 1  (React remembers new value)  │
│                                                             │
│   5. UI Updates                                             │
│      Display shows "Count: 1"                               │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Updating State

### Direct Update

::: code-group
```jsx [JavaScript]
function Counter() {
    const [count, setCount] = useState(0);

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>+1</button>
            <button onClick={() => setCount(count - 1)}>-1</button>
            <button onClick={() => setCount(0)}>Reset</button>
        </div>
    );
}
```

```tsx [TypeScript]
function Counter(): JSX.Element {
    const [count, setCount] = useState<number>(0);

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>+1</button>
            <button onClick={() => setCount(count - 1)}>-1</button>
            <button onClick={() => setCount(0)}>Reset</button>
        </div>
    );
}
```
:::

### Functional Update (Recommended)

When the new state depends on the previous state, use a function:

::: code-group
```jsx [JavaScript]
function Counter() {
    const [count, setCount] = useState(0);

    // ✅ Better: Use functional update
    const increment = () => {
        setCount(prevCount => prevCount + 1);
    };

    const decrement = () => {
        setCount(prevCount => prevCount - 1);
    };

    // Increment by 3 (multiple updates)
    const incrementByThree = () => {
        // ❌ This only increments by 1!
        // setCount(count + 1);
        // setCount(count + 1);
        // setCount(count + 1);

        // ✅ This correctly increments by 3
        setCount(prev => prev + 1);
        setCount(prev => prev + 1);
        setCount(prev => prev + 1);
    };

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={increment}>+1</button>
            <button onClick={decrement}>-1</button>
            <button onClick={incrementByThree}>+3</button>
        </div>
    );
}
```

```tsx [TypeScript]
function Counter(): JSX.Element {
    const [count, setCount] = useState<number>(0);

    // ✅ Better: Use functional update with typed parameter
    const increment = (): void => {
        setCount((prevCount: number) => prevCount + 1);
    };

    const decrement = (): void => {
        setCount((prevCount: number) => prevCount - 1);
    };

    // Increment by 3 (multiple updates)
    const incrementByThree = (): void => {
        // ✅ This correctly increments by 3
        setCount((prev: number) => prev + 1);
        setCount((prev: number) => prev + 1);
        setCount((prev: number) => prev + 1);
    };

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={increment}>+1</button>
            <button onClick={decrement}>-1</button>
            <button onClick={incrementByThree}>+3</button>
        </div>
    );
}
```
:::

### Why Functional Updates?

```jsx
// Problem with direct updates:
function BadExample() {
    const [count, setCount] = useState(0);

    const handleClick = () => {
        // All three use count = 0 (stale closure)
        setCount(count + 1); // 0 + 1 = 1
        setCount(count + 1); // 0 + 1 = 1
        setCount(count + 1); // 0 + 1 = 1
        // Result: count = 1
    };
}

// Solution with functional updates:
function GoodExample() {
    const [count, setCount] = useState(0);

    const handleClick = () => {
        // Each uses the latest value
        setCount(prev => prev + 1); // 0 + 1 = 1
        setCount(prev => prev + 1); // 1 + 1 = 2
        setCount(prev => prev + 1); // 2 + 1 = 3
        // Result: count = 3
    };
}
```

## State with Different Data Types

### String State

::: code-group
```jsx [JavaScript]
function NameInput() {
    const [name, setName] = useState('');

    return (
        <div>
            <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
            />
            <p>Hello, {name || 'stranger'}!</p>
        </div>
    );
}
```

```tsx [TypeScript]
import { ChangeEvent } from 'react';

function NameInput(): JSX.Element {
    const [name, setName] = useState<string>('');

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setName(e.target.value);
    };

    return (
        <div>
            <input
                type="text"
                value={name}
                onChange={handleChange}
                placeholder="Enter your name"
            />
            <p>Hello, {name || 'stranger'}!</p>
        </div>
    );
}
```
:::

### Boolean State

::: code-group
```jsx [JavaScript]
function Toggle() {
    const [isOn, setIsOn] = useState(false);

    return (
        <div>
            <button onClick={() => setIsOn(!isOn)}>
                {isOn ? 'ON' : 'OFF'}
            </button>

            {/* Alternative: functional update */}
            <button onClick={() => setIsOn(prev => !prev)}>
                Toggle
            </button>
        </div>
    );
}
```

```tsx [TypeScript]
function Toggle(): JSX.Element {
    const [isOn, setIsOn] = useState<boolean>(false);

    return (
        <div>
            <button onClick={() => setIsOn(!isOn)}>
                {isOn ? 'ON' : 'OFF'}
            </button>

            {/* Alternative: functional update */}
            <button onClick={() => setIsOn((prev: boolean) => !prev)}>
                Toggle
            </button>
        </div>
    );
}
```
:::

### Number State

::: code-group
```jsx [JavaScript]
function Temperature() {
    const [celsius, setCelsius] = useState(0);

    const fahrenheit = (celsius * 9/5) + 32;

    return (
        <div>
            <input
                type="range"
                min="-50"
                max="50"
                value={celsius}
                onChange={(e) => setCelsius(Number(e.target.value))}
            />
            <p>{celsius}°C = {fahrenheit.toFixed(1)}°F</p>
        </div>
    );
}
```

```tsx [TypeScript]
import { ChangeEvent } from 'react';

function Temperature(): JSX.Element {
    const [celsius, setCelsius] = useState<number>(0);

    const fahrenheit: number = (celsius * 9/5) + 32;

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setCelsius(Number(e.target.value));
    };

    return (
        <div>
            <input
                type="range"
                min="-50"
                max="50"
                value={celsius}
                onChange={handleChange}
            />
            <p>{celsius}°C = {fahrenheit.toFixed(1)}°F</p>
        </div>
    );
}
```
:::

## Object State

When state is an object, you must create a new object when updating:

::: code-group
```jsx [JavaScript]
function UserProfile() {
    const [user, setUser] = useState({
        name: 'John',
        email: 'john@example.com',
        age: 25
    });

    // ❌ Wrong: Mutating state directly
    const wrongUpdate = () => {
        user.name = 'Jane'; // This won't trigger re-render!
        setUser(user);
    };

    // ✅ Correct: Create new object with spread
    const updateName = (newName) => {
        setUser({
            ...user,           // Copy all existing properties
            name: newName      // Override the one we're changing
        });
    };

    const updateEmail = (newEmail) => {
        setUser(prev => ({
            ...prev,
            email: newEmail
        }));
    };

    return (
        <div>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Age: {user.age}</p>
            <button onClick={() => updateName('Jane')}>
                Change Name
            </button>
        </div>
    );
}
```

```tsx [TypeScript]
// Define the user interface
interface User {
    name: string;
    email: string;
    age: number;
}

function UserProfile(): JSX.Element {
    const [user, setUser] = useState<User>({
        name: 'John',
        email: 'john@example.com',
        age: 25
    });

    // ✅ Correct: Create new object with spread
    const updateName = (newName: string): void => {
        setUser({
            ...user,           // Copy all existing properties
            name: newName      // Override the one we're changing
        });
    };

    const updateEmail = (newEmail: string): void => {
        setUser((prev: User) => ({
            ...prev,
            email: newEmail
        }));
    };

    return (
        <div>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Age: {user.age}</p>
            <button onClick={() => updateName('Jane')}>
                Change Name
            </button>
        </div>
    );
}
```
:::

### Nested Objects

::: code-group
```jsx [JavaScript]
function NestedState() {
    const [person, setPerson] = useState({
        name: 'John',
        address: {
            city: 'New York',
            country: 'USA'
        }
    });

    // Update nested property
    const updateCity = (newCity) => {
        setPerson(prev => ({
            ...prev,
            address: {
                ...prev.address,
                city: newCity
            }
        }));
    };

    return (
        <div>
            <p>{person.name}</p>
            <p>{person.address.city}, {person.address.country}</p>
            <button onClick={() => updateCity('Los Angeles')}>
                Move to LA
            </button>
        </div>
    );
}
```

```tsx [TypeScript]
// Define nested interfaces
interface Address {
    city: string;
    country: string;
}

interface Person {
    name: string;
    address: Address;
}

function NestedState(): JSX.Element {
    const [person, setPerson] = useState<Person>({
        name: 'John',
        address: {
            city: 'New York',
            country: 'USA'
        }
    });

    // Update nested property
    const updateCity = (newCity: string): void => {
        setPerson((prev: Person) => ({
            ...prev,
            address: {
                ...prev.address,
                city: newCity
            }
        }));
    };

    return (
        <div>
            <p>{person.name}</p>
            <p>{person.address.city}, {person.address.country}</p>
            <button onClick={() => updateCity('Los Angeles')}>
                Move to LA
            </button>
        </div>
    );
}
```
:::

## Array State

Working with arrays in state requires creating new arrays:

::: code-group
```jsx [JavaScript]
function TodoList() {
    const [todos, setTodos] = useState([
        { id: 1, text: 'Learn React', done: false },
        { id: 2, text: 'Build an app', done: false }
    ]);

    // Add item
    const addTodo = (text) => {
        setTodos([
            ...todos,
            { id: Date.now(), text, done: false }
        ]);
    };

    // Remove item
    const removeTodo = (id) => {
        setTodos(todos.filter(todo => todo.id !== id));
    };

    // Update item
    const toggleTodo = (id) => {
        setTodos(todos.map(todo =>
            todo.id === id
                ? { ...todo, done: !todo.done }
                : todo
        ));
    };

    // Replace item
    const updateTodoText = (id, newText) => {
        setTodos(todos.map(todo =>
            todo.id === id
                ? { ...todo, text: newText }
                : todo
        ));
    };

    return (
        <ul>
            {todos.map(todo => (
                <li key={todo.id}>
                    <span
                        style={{
                            textDecoration: todo.done ? 'line-through' : 'none'
                        }}
                    >
                        {todo.text}
                    </span>
                    <button onClick={() => toggleTodo(todo.id)}>
                        {todo.done ? 'Undo' : 'Done'}
                    </button>
                    <button onClick={() => removeTodo(todo.id)}>
                        Delete
                    </button>
                </li>
            ))}
        </ul>
    );
}
```

```tsx [TypeScript]
// Define the Todo interface
interface Todo {
    id: number;
    text: string;
    done: boolean;
}

function TodoList(): JSX.Element {
    const [todos, setTodos] = useState<Todo[]>([
        { id: 1, text: 'Learn React', done: false },
        { id: 2, text: 'Build an app', done: false }
    ]);

    // Add item
    const addTodo = (text: string): void => {
        setTodos((prev: Todo[]) => [
            ...prev,
            { id: Date.now(), text, done: false }
        ]);
    };

    // Remove item
    const removeTodo = (id: number): void => {
        setTodos((prev: Todo[]) => prev.filter(todo => todo.id !== id));
    };

    // Update item
    const toggleTodo = (id: number): void => {
        setTodos((prev: Todo[]) => prev.map(todo =>
            todo.id === id
                ? { ...todo, done: !todo.done }
                : todo
        ));
    };

    // Replace item
    const updateTodoText = (id: number, newText: string): void => {
        setTodos((prev: Todo[]) => prev.map(todo =>
            todo.id === id
                ? { ...todo, text: newText }
                : todo
        ));
    };

    return (
        <ul>
            {todos.map((todo: Todo) => (
                <li key={todo.id}>
                    <span
                        style={{
                            textDecoration: todo.done ? 'line-through' : 'none'
                        }}
                    >
                        {todo.text}
                    </span>
                    <button onClick={() => toggleTodo(todo.id)}>
                        {todo.done ? 'Undo' : 'Done'}
                    </button>
                    <button onClick={() => removeTodo(todo.id)}>
                        Delete
                    </button>
                </li>
            ))}
        </ul>
    );
}
```
:::

### Array Operations Reference

| Operation | Code |
|-----------|------|
| Add to end | `[...arr, newItem]` |
| Add to start | `[newItem, ...arr]` |
| Remove | `arr.filter(item => item.id !== id)` |
| Update | `arr.map(item => item.id === id ? {...item, prop: value} : item)` |
| Insert at index | `[...arr.slice(0, i), newItem, ...arr.slice(i)]` |
| Reorder | `[...arr].sort(...)` |

## Multiple State Variables

You can use multiple `useState` calls for independent values:

::: code-group
```jsx [JavaScript]
function Form() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState(0);
    const [isSubscribed, setIsSubscribed] = useState(false);

    return (
        <form>
            <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
            />
            <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
            />
            <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
            />
            <label>
                <input
                    type="checkbox"
                    checked={isSubscribed}
                    onChange={(e) => setIsSubscribed(e.target.checked)}
                />
                Subscribe to newsletter
            </label>
        </form>
    );
}
```

```tsx [TypeScript]
import { ChangeEvent } from 'react';

function Form(): JSX.Element {
    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [age, setAge] = useState<number>(0);
    const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

    const handleNameChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setName(e.target.value);
    };

    const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setEmail(e.target.value);
    };

    const handleAgeChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setAge(Number(e.target.value));
    };

    const handleSubscribeChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setIsSubscribed(e.target.checked);
    };

    return (
        <form>
            <input
                value={name}
                onChange={handleNameChange}
                placeholder="Name"
            />
            <input
                value={email}
                onChange={handleEmailChange}
                placeholder="Email"
            />
            <input
                type="number"
                value={age}
                onChange={handleAgeChange}
            />
            <label>
                <input
                    type="checkbox"
                    checked={isSubscribed}
                    onChange={handleSubscribeChange}
                />
                Subscribe to newsletter
            </label>
        </form>
    );
}
```
:::

### When to Use Object vs Multiple States

::: code-group
```jsx [JavaScript]
// ✅ Multiple states: When values change independently
const [name, setName] = useState('');
const [email, setEmail] = useState('');
const [loading, setLoading] = useState(false);

// ✅ Object state: When values change together
const [position, setPosition] = useState({ x: 0, y: 0 });
const [size, setSize] = useState({ width: 100, height: 100 });
```

```tsx [TypeScript]
// ✅ Multiple states: When values change independently
const [name, setName] = useState<string>('');
const [email, setEmail] = useState<string>('');
const [loading, setLoading] = useState<boolean>(false);

// ✅ Object state: When values change together
interface Position {
    x: number;
    y: number;
}

interface Size {
    width: number;
    height: number;
}

const [position, setPosition] = useState<Position>({ x: 0, y: 0 });
const [size, setSize] = useState<Size>({ width: 100, height: 100 });
```
:::

## Lazy Initial State

For expensive initial values, pass a function:

::: code-group
```jsx [JavaScript]
// ❌ Runs on every render (even if not used)
const [data, setData] = useState(expensiveComputation());

// ✅ Only runs on first render
const [data, setData] = useState(() => expensiveComputation());

// Example: Load from localStorage
function ThemeToggle() {
    const [theme, setTheme] = useState(() => {
        // Only runs once on mount
        const saved = localStorage.getItem('theme');
        return saved || 'light';
    });

    const toggleTheme = () => {
        setTheme(prev => {
            const newTheme = prev === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            return newTheme;
        });
    };

    return (
        <button onClick={toggleTheme}>
            Current: {theme}
        </button>
    );
}
```

```tsx [TypeScript]
type Theme = 'light' | 'dark';

// ✅ Only runs on first render
const [data, setData] = useState<DataType>(() => expensiveComputation());

// Example: Load from localStorage
function ThemeToggle(): JSX.Element {
    const [theme, setTheme] = useState<Theme>(() => {
        // Only runs once on mount
        const saved = localStorage.getItem('theme') as Theme | null;
        return saved || 'light';
    });

    const toggleTheme = (): void => {
        setTheme((prev: Theme) => {
            const newTheme: Theme = prev === 'light' ? 'dark' : 'light';
            localStorage.setItem('theme', newTheme);
            return newTheme;
        });
    };

    return (
        <button onClick={toggleTheme}>
            Current: {theme}
        </button>
    );
}
```
:::

## Practical Example: Shopping Cart

::: code-group
```jsx [JavaScript]
function ShoppingCart() {
    const [items, setItems] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    const addItem = (product) => {
        setItems(prev => {
            // Check if item exists
            const existing = prev.find(item => item.id === product.id);

            if (existing) {
                // Increase quantity
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                // Add new item
                return [...prev, { ...product, quantity: 1 }];
            }
        });
    };

    const removeItem = (productId) => {
        setItems(prev => prev.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId, quantity) => {
        if (quantity <= 0) {
            removeItem(productId);
            return;
        }

        setItems(prev =>
            prev.map(item =>
                item.id === productId
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const clearCart = () => {
        setItems([]);
    };

    const total = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const itemCount = items.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    return (
        <div className="cart-container">
            <button onClick={() => setIsOpen(!isOpen)}>
                Cart ({itemCount})
            </button>

            {isOpen && (
                <div className="cart-dropdown">
                    {items.length === 0 ? (
                        <p>Your cart is empty</p>
                    ) : (
                        <>
                            {items.map(item => (
                                <div key={item.id} className="cart-item">
                                    <span>{item.name}</span>
                                    <span>${item.price}</span>
                                    <div className="quantity-controls">
                                        <button
                                            onClick={() =>
                                                updateQuantity(item.id, item.quantity - 1)
                                            }
                                        >
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button
                                            onClick={() =>
                                                updateQuantity(item.id, item.quantity + 1)
                                            }
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button onClick={() => removeItem(item.id)}>
                                        ×
                                    </button>
                                </div>
                            ))}
                            <div className="cart-total">
                                <strong>Total: ${total.toFixed(2)}</strong>
                            </div>
                            <button onClick={clearCart}>Clear Cart</button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
```

```tsx [TypeScript]
// Define types
interface Product {
    id: number;
    name: string;
    price: number;
}

interface CartItem extends Product {
    quantity: number;
}

function ShoppingCart(): JSX.Element {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const addItem = (product: Product): void => {
        setItems((prev: CartItem[]) => {
            // Check if item exists
            const existing = prev.find(item => item.id === product.id);

            if (existing) {
                // Increase quantity
                return prev.map(item =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            } else {
                // Add new item
                return [...prev, { ...product, quantity: 1 }];
            }
        });
    };

    const removeItem = (productId: number): void => {
        setItems((prev: CartItem[]) => prev.filter(item => item.id !== productId));
    };

    const updateQuantity = (productId: number, quantity: number): void => {
        if (quantity <= 0) {
            removeItem(productId);
            return;
        }

        setItems((prev: CartItem[]) =>
            prev.map(item =>
                item.id === productId
                    ? { ...item, quantity }
                    : item
            )
        );
    };

    const clearCart = (): void => {
        setItems([]);
    };

    const total: number = items.reduce(
        (sum: number, item: CartItem) => sum + item.price * item.quantity,
        0
    );

    const itemCount: number = items.reduce(
        (sum: number, item: CartItem) => sum + item.quantity,
        0
    );

    return (
        <div className="cart-container">
            <button onClick={() => setIsOpen(!isOpen)}>
                Cart ({itemCount})
            </button>

            {isOpen && (
                <div className="cart-dropdown">
                    {items.length === 0 ? (
                        <p>Your cart is empty</p>
                    ) : (
                        <>
                            {items.map((item: CartItem) => (
                                <div key={item.id} className="cart-item">
                                    <span>{item.name}</span>
                                    <span>${item.price}</span>
                                    <div className="quantity-controls">
                                        <button
                                            onClick={() =>
                                                updateQuantity(item.id, item.quantity - 1)
                                            }
                                        >
                                            -
                                        </button>
                                        <span>{item.quantity}</span>
                                        <button
                                            onClick={() =>
                                                updateQuantity(item.id, item.quantity + 1)
                                            }
                                        >
                                            +
                                        </button>
                                    </div>
                                    <button onClick={() => removeItem(item.id)}>
                                        ×
                                    </button>
                                </div>
                            ))}
                            <div className="cart-total">
                                <strong>Total: ${total.toFixed(2)}</strong>
                            </div>
                            <button onClick={clearCart}>Clear Cart</button>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
```
:::

## TypeScript State Patterns

### Nullable State

```tsx
// State that might be null
interface User {
    id: number;
    name: string;
    email: string;
}

function UserProfile(): JSX.Element {
    // User can be null (not loaded yet)
    const [user, setUser] = useState<User | null>(null);

    // Loading state
    const [loading, setLoading] = useState<boolean>(true);

    // Error state
    const [error, setError] = useState<string | null>(null);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!user) return <p>No user found</p>;

    return (
        <div>
            <h1>{user.name}</h1>
            <p>{user.email}</p>
        </div>
    );
}
```

### Union Types for State

```tsx
type Status = 'idle' | 'loading' | 'success' | 'error';

interface FetchState<T> {
    status: Status;
    data: T | null;
    error: string | null;
}

function useFetchState<T>(initialData: T | null = null): FetchState<T> {
    const [state, setState] = useState<FetchState<T>>({
        status: 'idle',
        data: initialData,
        error: null
    });

    return state;
}
```

### Generic State Types

```tsx
// Reusable state type for any list
interface ListState<T> {
    items: T[];
    selectedId: number | null;
    filter: string;
}

function useListState<T>(initialItems: T[] = []): [ListState<T>, React.Dispatch<React.SetStateAction<ListState<T>>>] {
    const [state, setState] = useState<ListState<T>>({
        items: initialItems,
        selectedId: null,
        filter: ''
    });

    return [state, setState];
}
```

## Common Mistakes

### 1. Mutating State Directly

```jsx
// ❌ Wrong
const [user, setUser] = useState({ name: 'John' });
user.name = 'Jane'; // Mutation!
setUser(user);      // Same reference, no re-render

// ✅ Correct
setUser({ ...user, name: 'Jane' });
```

### 2. Using Stale State

```jsx
// ❌ Wrong
const [count, setCount] = useState(0);
setCount(count + 1);
setCount(count + 1); // Still uses old count

// ✅ Correct
setCount(prev => prev + 1);
setCount(prev => prev + 1);
```

### 3. Setting State in Render

```jsx
// ❌ Wrong - Infinite loop!
function Bad() {
    const [count, setCount] = useState(0);
    setCount(count + 1); // Called every render!
    return <p>{count}</p>;
}

// ✅ Correct - In event handler
function Good() {
    const [count, setCount] = useState(0);
    return (
        <button onClick={() => setCount(count + 1)}>
            {count}
        </button>
    );
}
```

## State Rules Summary

| Rule | Explanation |
|------|-------------|
| Call useState at top level | Not inside loops, conditions, or nested functions |
| State is preserved between renders | React remembers state values |
| Setting state triggers re-render | Component function runs again |
| State updates are asynchronous | May be batched for performance |
| Always create new references | For objects and arrays |
| Use functional updates | When new state depends on old state |

### TypeScript Benefits for State

| Benefit | Example |
|---------|---------|
| Type inference | `useState(0)` → `number` |
| Explicit types | `useState<User>(null)` |
| Union types | `useState<'idle' \| 'loading'>` |
| Nullable state | `useState<User \| null>` |
| Array types | `useState<Todo[]>([])` |

## What's Next?

In the next chapter, we'll learn about [Event Handling](/guide/react/05-events) - how to respond to user interactions like clicks, typing, and form submissions.

---

[Next: Event Handling →](/guide/react/05-events)
