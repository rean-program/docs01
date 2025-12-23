# Event Handling

Events allow your React components to respond to user interactions. In this tutorial, you'll learn how to handle clicks, keyboard input, form events, and more.

## React Events Overview

React uses **synthetic events** - a cross-browser wrapper around native browser events that works identically across all browsers.

```
┌─────────────────────────────────────────────────────────────┐
│                    React Event System                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   User Action                                               │
│       ↓                                                     │
│   Browser Event (native)                                    │
│       ↓                                                     │
│   React SyntheticEvent (normalized)                        │
│       ↓                                                     │
│   Your Event Handler                                        │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  Benefits:                                           │  │
│   │  • Same API across all browsers                     │  │
│   │  • Automatic event delegation                       │  │
│   │  • Pooled for performance                           │  │
│   │  • Access to native event if needed                 │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Event Naming Convention

| HTML | React |
|------|-------|
| `onclick` | `onClick` |
| `onchange` | `onChange` |
| `onsubmit` | `onSubmit` |
| `onkeydown` | `onKeyDown` |
| `onmouseover` | `onMouseOver` |

```jsx
// HTML
<button onclick="handleClick()">Click</button>

// React - camelCase and function reference
<button onClick={handleClick}>Click</button>
```

## Basic Event Handling

### Click Events

::: code-group
```jsx [JavaScript]
function Button() {
    // Define handler function
    const handleClick = () => {
        alert('Button clicked!');
    };

    return (
        <button onClick={handleClick}>
            Click Me
        </button>
    );
}
```

```tsx [TypeScript]
function Button(): JSX.Element {
    // Define handler function with void return type
    const handleClick = (): void => {
        alert('Button clicked!');
    };

    return (
        <button onClick={handleClick}>
            Click Me
        </button>
    );
}
```
:::

### Inline Handlers

::: code-group
```jsx [JavaScript]
function Buttons() {
    return (
        <div>
            {/* Inline arrow function */}
            <button onClick={() => alert('Hello!')}>
                Say Hello
            </button>

            {/* Inline with console.log */}
            <button onClick={() => console.log('Logged!')}>
                Log Message
            </button>
        </div>
    );
}
```

```tsx [TypeScript]
function Buttons(): JSX.Element {
    return (
        <div>
            {/* Inline arrow function */}
            <button onClick={() => alert('Hello!')}>
                Say Hello
            </button>

            {/* Inline with console.log */}
            <button onClick={() => console.log('Logged!')}>
                Log Message
            </button>
        </div>
    );
}
```
:::

### The Event Object

::: code-group
```jsx [JavaScript]
function EventInfo() {
    const handleClick = (event) => {
        console.log('Event type:', event.type);        // "click"
        console.log('Target:', event.target);          // The button element
        console.log('Current target:', event.currentTarget);
        console.log('Timestamp:', event.timeStamp);
        console.log('Mouse X:', event.clientX);
        console.log('Mouse Y:', event.clientY);
    };

    return (
        <button onClick={handleClick}>
            Click for Event Info
        </button>
    );
}
```

```tsx [TypeScript]
import { MouseEvent } from 'react';

function EventInfo(): JSX.Element {
    // Type the event as MouseEvent<HTMLButtonElement>
    const handleClick = (event: MouseEvent<HTMLButtonElement>): void => {
        console.log('Event type:', event.type);        // "click"
        console.log('Target:', event.target);          // The button element
        console.log('Current target:', event.currentTarget);
        console.log('Timestamp:', event.timeStamp);
        console.log('Mouse X:', event.clientX);
        console.log('Mouse Y:', event.clientY);
    };

    return (
        <button onClick={handleClick}>
            Click for Event Info
        </button>
    );
}
```
:::

## TypeScript Event Types

### Common Event Types

```tsx
import {
    MouseEvent,      // onClick, onMouseEnter, onMouseLeave, etc.
    KeyboardEvent,   // onKeyDown, onKeyUp, onKeyPress
    ChangeEvent,     // onChange for inputs
    FormEvent,       // onSubmit
    FocusEvent,      // onFocus, onBlur
    DragEvent,       // onDrag, onDrop, onDragOver
    ClipboardEvent,  // onCopy, onPaste, onCut
    TouchEvent,      // onTouchStart, onTouchEnd, onTouchMove
    WheelEvent,      // onWheel
    AnimationEvent,  // onAnimationStart, onAnimationEnd
    TransitionEvent, // onTransitionEnd
} from 'react';

// Generic type parameter specifies the element type
const handleClick = (e: MouseEvent<HTMLButtonElement>) => { ... };
const handleChange = (e: ChangeEvent<HTMLInputElement>) => { ... };
const handleSubmit = (e: FormEvent<HTMLFormElement>) => { ... };
```

### Event Type Quick Reference

```tsx
// Button click
const handleButtonClick = (e: MouseEvent<HTMLButtonElement>): void => { };

// Div click (or any element)
const handleDivClick = (e: MouseEvent<HTMLDivElement>): void => { };

// Input change
const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => { };

// Select change
const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>): void => { };

// Textarea change
const handleTextareaChange = (e: ChangeEvent<HTMLTextAreaElement>): void => { };

// Form submit
const handleFormSubmit = (e: FormEvent<HTMLFormElement>): void => { };

// Key press
const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => { };

// Focus/Blur
const handleFocus = (e: FocusEvent<HTMLInputElement>): void => { };
```

## Passing Arguments to Handlers

### Using Arrow Functions

::: code-group
```jsx [JavaScript]
function ItemList() {
    const items = ['Apple', 'Banana', 'Cherry'];

    const handleItemClick = (item, index) => {
        console.log(`Clicked: ${item} at index ${index}`);
    };

    return (
        <ul>
            {items.map((item, index) => (
                <li
                    key={index}
                    onClick={() => handleItemClick(item, index)}
                >
                    {item}
                </li>
            ))}
        </ul>
    );
}
```

```tsx [TypeScript]
function ItemList(): JSX.Element {
    const items: string[] = ['Apple', 'Banana', 'Cherry'];

    const handleItemClick = (item: string, index: number): void => {
        console.log(`Clicked: ${item} at index ${index}`);
    };

    return (
        <ul>
            {items.map((item: string, index: number) => (
                <li
                    key={index}
                    onClick={() => handleItemClick(item, index)}
                >
                    {item}
                </li>
            ))}
        </ul>
    );
}
```
:::

### With Event Object

::: code-group
```jsx [JavaScript]
function ButtonGroup() {
    const handleClick = (id, event) => {
        console.log('Button ID:', id);
        console.log('Event:', event.type);
    };

    return (
        <div>
            <button onClick={(e) => handleClick(1, e)}>Button 1</button>
            <button onClick={(e) => handleClick(2, e)}>Button 2</button>
            <button onClick={(e) => handleClick(3, e)}>Button 3</button>
        </div>
    );
}
```

```tsx [TypeScript]
import { MouseEvent } from 'react';

function ButtonGroup(): JSX.Element {
    const handleClick = (id: number, event: MouseEvent<HTMLButtonElement>): void => {
        console.log('Button ID:', id);
        console.log('Event:', event.type);
    };

    return (
        <div>
            <button onClick={(e) => handleClick(1, e)}>Button 1</button>
            <button onClick={(e) => handleClick(2, e)}>Button 2</button>
            <button onClick={(e) => handleClick(3, e)}>Button 3</button>
        </div>
    );
}
```
:::

### Using bind()

::: code-group
```jsx [JavaScript]
function Counter() {
    const [count, setCount] = useState(0);

    const handleIncrement = (amount) => {
        setCount(prev => prev + amount);
    };

    return (
        <div>
            <p>Count: {count}</p>
            {/* Using bind */}
            <button onClick={handleIncrement.bind(null, 1)}>+1</button>
            <button onClick={handleIncrement.bind(null, 5)}>+5</button>
            <button onClick={handleIncrement.bind(null, 10)}>+10</button>
        </div>
    );
}
```

```tsx [TypeScript]
import { useState } from 'react';

function Counter(): JSX.Element {
    const [count, setCount] = useState<number>(0);

    const handleIncrement = (amount: number): void => {
        setCount((prev: number) => prev + amount);
    };

    return (
        <div>
            <p>Count: {count}</p>
            {/* Using bind */}
            <button onClick={handleIncrement.bind(null, 1)}>+1</button>
            <button onClick={handleIncrement.bind(null, 5)}>+5</button>
            <button onClick={handleIncrement.bind(null, 10)}>+10</button>
        </div>
    );
}
```
:::

## Common Event Types

### Mouse Events

::: code-group
```jsx [JavaScript]
function MouseEvents() {
    return (
        <div
            onClick={() => console.log('clicked')}
            onDoubleClick={() => console.log('double clicked')}
            onMouseEnter={() => console.log('mouse entered')}
            onMouseLeave={() => console.log('mouse left')}
            onMouseMove={(e) => console.log(`x: ${e.clientX}, y: ${e.clientY}`)}
            onMouseDown={() => console.log('mouse down')}
            onMouseUp={() => console.log('mouse up')}
            onContextMenu={(e) => {
                e.preventDefault();
                console.log('right click');
            }}
            style={{ padding: '50px', background: '#eee' }}
        >
            Interact with this box
        </div>
    );
}
```

```tsx [TypeScript]
import { MouseEvent } from 'react';

function MouseEvents(): JSX.Element {
    const handleClick = (): void => console.log('clicked');
    const handleDoubleClick = (): void => console.log('double clicked');
    const handleMouseEnter = (): void => console.log('mouse entered');
    const handleMouseLeave = (): void => console.log('mouse left');

    const handleMouseMove = (e: MouseEvent<HTMLDivElement>): void => {
        console.log(`x: ${e.clientX}, y: ${e.clientY}`);
    };

    const handleContextMenu = (e: MouseEvent<HTMLDivElement>): void => {
        e.preventDefault();
        console.log('right click');
    };

    return (
        <div
            onClick={handleClick}
            onDoubleClick={handleDoubleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
            onMouseDown={() => console.log('mouse down')}
            onMouseUp={() => console.log('mouse up')}
            onContextMenu={handleContextMenu}
            style={{ padding: '50px', background: '#eee' }}
        >
            Interact with this box
        </div>
    );
}
```
:::

### Keyboard Events

::: code-group
```jsx [JavaScript]
function KeyboardEvents() {
    const handleKeyDown = (event) => {
        console.log('Key:', event.key);
        console.log('Code:', event.code);
        console.log('Ctrl:', event.ctrlKey);
        console.log('Shift:', event.shiftKey);
        console.log('Alt:', event.altKey);

        // Check for specific keys
        if (event.key === 'Enter') {
            console.log('Enter pressed!');
        }

        if (event.ctrlKey && event.key === 's') {
            event.preventDefault();
            console.log('Ctrl+S - Save!');
        }
    };

    return (
        <input
            type="text"
            onKeyDown={handleKeyDown}
            onKeyUp={(e) => console.log('Key up:', e.key)}
            placeholder="Type here..."
        />
    );
}
```

```tsx [TypeScript]
import { KeyboardEvent } from 'react';

function KeyboardEvents(): JSX.Element {
    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
        console.log('Key:', event.key);
        console.log('Code:', event.code);
        console.log('Ctrl:', event.ctrlKey);
        console.log('Shift:', event.shiftKey);
        console.log('Alt:', event.altKey);

        // Check for specific keys
        if (event.key === 'Enter') {
            console.log('Enter pressed!');
        }

        if (event.ctrlKey && event.key === 's') {
            event.preventDefault();
            console.log('Ctrl+S - Save!');
        }
    };

    const handleKeyUp = (event: KeyboardEvent<HTMLInputElement>): void => {
        console.log('Key up:', event.key);
    };

    return (
        <input
            type="text"
            onKeyDown={handleKeyDown}
            onKeyUp={handleKeyUp}
            placeholder="Type here..."
        />
    );
}
```
:::

### Focus Events

::: code-group
```jsx [JavaScript]
function FocusEvents() {
    const [focused, setFocused] = useState(false);

    return (
        <input
            type="text"
            onFocus={() => {
                console.log('Input focused');
                setFocused(true);
            }}
            onBlur={() => {
                console.log('Input blurred');
                setFocused(false);
            }}
            style={{
                border: focused ? '2px solid blue' : '1px solid gray'
            }}
            placeholder="Focus me..."
        />
    );
}
```

```tsx [TypeScript]
import { useState, FocusEvent } from 'react';

function FocusEvents(): JSX.Element {
    const [focused, setFocused] = useState<boolean>(false);

    const handleFocus = (e: FocusEvent<HTMLInputElement>): void => {
        console.log('Input focused');
        setFocused(true);
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>): void => {
        console.log('Input blurred');
        setFocused(false);
    };

    return (
        <input
            type="text"
            onFocus={handleFocus}
            onBlur={handleBlur}
            style={{
                border: focused ? '2px solid blue' : '1px solid gray'
            }}
            placeholder="Focus me..."
        />
    );
}
```
:::

### Form Events

::: code-group
```jsx [JavaScript]
function FormEvents() {
    const [value, setValue] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault(); // Prevent page reload
        console.log('Form submitted with:', value);
    };

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const handleReset = () => {
        setValue('');
    };

    return (
        <form onSubmit={handleSubmit} onReset={handleReset}>
            <input
                type="text"
                value={value}
                onChange={handleChange}
                placeholder="Enter text..."
            />
            <button type="submit">Submit</button>
            <button type="reset">Reset</button>
        </form>
    );
}
```

```tsx [TypeScript]
import { useState, FormEvent, ChangeEvent } from 'react';

function FormEvents(): JSX.Element {
    const [value, setValue] = useState<string>('');

    const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
        event.preventDefault(); // Prevent page reload
        console.log('Form submitted with:', value);
    };

    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setValue(event.target.value);
    };

    const handleReset = (): void => {
        setValue('');
    };

    return (
        <form onSubmit={handleSubmit} onReset={handleReset}>
            <input
                type="text"
                value={value}
                onChange={handleChange}
                placeholder="Enter text..."
            />
            <button type="submit">Submit</button>
            <button type="reset">Reset</button>
        </form>
    );
}
```
:::

## Preventing Default Behavior

::: code-group
```jsx [JavaScript]
function PreventDefault() {
    // Prevent form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Form submitted without page reload');
    };

    // Prevent link navigation
    const handleClick = (e) => {
        e.preventDefault();
        console.log('Link clicked but not navigated');
    };

    // Prevent right-click menu
    const handleContextMenu = (e) => {
        e.preventDefault();
        console.log('Custom right-click menu');
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <button type="submit">Submit</button>
            </form>

            <a href="https://google.com" onClick={handleClick}>
                Click me (won't navigate)
            </a>

            <div onContextMenu={handleContextMenu}>
                Right-click me
            </div>
        </div>
    );
}
```

```tsx [TypeScript]
import { FormEvent, MouseEvent } from 'react';

function PreventDefault(): JSX.Element {
    // Prevent form submission
    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        console.log('Form submitted without page reload');
    };

    // Prevent link navigation
    const handleClick = (e: MouseEvent<HTMLAnchorElement>): void => {
        e.preventDefault();
        console.log('Link clicked but not navigated');
    };

    // Prevent right-click menu
    const handleContextMenu = (e: MouseEvent<HTMLDivElement>): void => {
        e.preventDefault();
        console.log('Custom right-click menu');
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <button type="submit">Submit</button>
            </form>

            <a href="https://google.com" onClick={handleClick}>
                Click me (won't navigate)
            </a>

            <div onContextMenu={handleContextMenu}>
                Right-click me
            </div>
        </div>
    );
}
```
:::

## Event Propagation

### Stopping Propagation

::: code-group
```jsx [JavaScript]
function EventPropagation() {
    const handleParentClick = () => {
        console.log('Parent clicked');
    };

    const handleChildClick = (e) => {
        e.stopPropagation(); // Prevents event from bubbling up
        console.log('Child clicked');
    };

    return (
        <div onClick={handleParentClick} style={{ padding: '20px', background: '#ddd' }}>
            <p>Parent (click me)</p>
            <button onClick={handleChildClick}>
                Child (click me - won't trigger parent)
            </button>
        </div>
    );
}
```

```tsx [TypeScript]
import { MouseEvent } from 'react';

function EventPropagation(): JSX.Element {
    const handleParentClick = (): void => {
        console.log('Parent clicked');
    };

    const handleChildClick = (e: MouseEvent<HTMLButtonElement>): void => {
        e.stopPropagation(); // Prevents event from bubbling up
        console.log('Child clicked');
    };

    return (
        <div onClick={handleParentClick} style={{ padding: '20px', background: '#ddd' }}>
            <p>Parent (click me)</p>
            <button onClick={handleChildClick}>
                Child (click me - won't trigger parent)
            </button>
        </div>
    );
}
```
:::

### Event Bubbling vs Capturing

```
┌─────────────────────────────────────────────────────────────┐
│                 Event Propagation Phases                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   1. Capture Phase (top → down)                             │
│      Window → Document → HTML → Body → Target              │
│                                                             │
│   2. Target Phase                                           │
│      Event reaches the target element                       │
│                                                             │
│   3. Bubble Phase (down → top)                              │
│      Target → Body → HTML → Document → Window              │
│                                                             │
│   ┌───────────────────────────────────────────┐            │
│   │  <div onClickCapture={...}>  ← 1st       │            │
│   │    <div onClick={...}>       ← 3rd       │            │
│   │      <button onClick={...}>  ← 2nd       │            │
│   │      </button>                            │            │
│   │    </div>                                 │            │
│   │  </div>                                   │            │
│   └───────────────────────────────────────────┘            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

::: code-group
```jsx [JavaScript]
function CaptureExample() {
    return (
        <div
            onClickCapture={() => console.log('1. Outer capture')}
            onClick={() => console.log('4. Outer bubble')}
        >
            <div
                onClickCapture={() => console.log('2. Inner capture')}
                onClick={() => console.log('3. Inner bubble')}
            >
                <button onClick={() => console.log('Target')}>
                    Click Me
                </button>
            </div>
        </div>
    );
}
// Output order: 1, 2, Target, 3, 4
```

```tsx [TypeScript]
function CaptureExample(): JSX.Element {
    return (
        <div
            onClickCapture={() => console.log('1. Outer capture')}
            onClick={() => console.log('4. Outer bubble')}
        >
            <div
                onClickCapture={() => console.log('2. Inner capture')}
                onClick={() => console.log('3. Inner bubble')}
            >
                <button onClick={() => console.log('Target')}>
                    Click Me
                </button>
            </div>
        </div>
    );
}
// Output order: 1, 2, Target, 3, 4
```
:::

## Event Handlers with State

### Counter Example

::: code-group
```jsx [JavaScript]
function Counter() {
    const [count, setCount] = useState(0);

    const increment = () => setCount(prev => prev + 1);
    const decrement = () => setCount(prev => prev - 1);
    const reset = () => setCount(0);

    return (
        <div>
            <h2>Count: {count}</h2>
            <button onClick={decrement}>-</button>
            <button onClick={reset}>Reset</button>
            <button onClick={increment}>+</button>
        </div>
    );
}
```

```tsx [TypeScript]
import { useState } from 'react';

function Counter(): JSX.Element {
    const [count, setCount] = useState<number>(0);

    const increment = (): void => setCount((prev: number) => prev + 1);
    const decrement = (): void => setCount((prev: number) => prev - 1);
    const reset = (): void => setCount(0);

    return (
        <div>
            <h2>Count: {count}</h2>
            <button onClick={decrement}>-</button>
            <button onClick={reset}>Reset</button>
            <button onClick={increment}>+</button>
        </div>
    );
}
```
:::

### Toggle Example

::: code-group
```jsx [JavaScript]
function Toggle() {
    const [items, setItems] = useState([
        { id: 1, name: 'Item 1', selected: false },
        { id: 2, name: 'Item 2', selected: false },
        { id: 3, name: 'Item 3', selected: false }
    ]);

    const toggleItem = (id) => {
        setItems(prev =>
            prev.map(item =>
                item.id === id
                    ? { ...item, selected: !item.selected }
                    : item
            )
        );
    };

    const selectAll = () => {
        setItems(prev => prev.map(item => ({ ...item, selected: true })));
    };

    const deselectAll = () => {
        setItems(prev => prev.map(item => ({ ...item, selected: false })));
    };

    return (
        <div>
            <button onClick={selectAll}>Select All</button>
            <button onClick={deselectAll}>Deselect All</button>

            <ul>
                {items.map(item => (
                    <li
                        key={item.id}
                        onClick={() => toggleItem(item.id)}
                        style={{
                            cursor: 'pointer',
                            background: item.selected ? '#e0e0ff' : 'transparent'
                        }}
                    >
                        {item.selected ? '✓' : '○'} {item.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}
```

```tsx [TypeScript]
import { useState } from 'react';

interface Item {
    id: number;
    name: string;
    selected: boolean;
}

function Toggle(): JSX.Element {
    const [items, setItems] = useState<Item[]>([
        { id: 1, name: 'Item 1', selected: false },
        { id: 2, name: 'Item 2', selected: false },
        { id: 3, name: 'Item 3', selected: false }
    ]);

    const toggleItem = (id: number): void => {
        setItems((prev: Item[]) =>
            prev.map((item: Item) =>
                item.id === id
                    ? { ...item, selected: !item.selected }
                    : item
            )
        );
    };

    const selectAll = (): void => {
        setItems((prev: Item[]) => prev.map((item: Item) => ({ ...item, selected: true })));
    };

    const deselectAll = (): void => {
        setItems((prev: Item[]) => prev.map((item: Item) => ({ ...item, selected: false })));
    };

    return (
        <div>
            <button onClick={selectAll}>Select All</button>
            <button onClick={deselectAll}>Deselect All</button>

            <ul>
                {items.map((item: Item) => (
                    <li
                        key={item.id}
                        onClick={() => toggleItem(item.id)}
                        style={{
                            cursor: 'pointer',
                            background: item.selected ? '#e0e0ff' : 'transparent'
                        }}
                    >
                        {item.selected ? '✓' : '○'} {item.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}
```
:::

## Practical Example: Interactive Card

::: code-group
```jsx [JavaScript]
function InteractiveCard({ title, content }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    const handleCardClick = () => {
        setIsExpanded(prev => !prev);
    };

    const handleLikeClick = (e) => {
        e.stopPropagation(); // Don't trigger card expansion
        setIsLiked(prev => !prev);
        setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
    };

    const handleShare = (e) => {
        e.stopPropagation();
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied!');
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick();
        }
    };

    return (
        <div
            className="card"
            onClick={handleCardClick}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            aria-expanded={isExpanded}
            style={{
                border: '1px solid #ddd',
                padding: '16px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s'
            }}
        >
            <h3>{title}</h3>

            {isExpanded && (
                <p style={{ marginTop: '12px' }}>{content}</p>
            )}

            <div
                style={{
                    display: 'flex',
                    gap: '8px',
                    marginTop: '12px'
                }}
            >
                <button
                    onClick={handleLikeClick}
                    style={{
                        background: isLiked ? '#ff4444' : '#eee',
                        color: isLiked ? 'white' : 'black'
                    }}
                >
                    {isLiked ? '❤️' : '🤍'} {likeCount}
                </button>

                <button onClick={handleShare}>
                    Share
                </button>
            </div>

            <p style={{ fontSize: '12px', color: '#666' }}>
                {isExpanded ? 'Click to collapse' : 'Click to expand'}
            </p>
        </div>
    );
}
```

```tsx [TypeScript]
import { useState, MouseEvent, KeyboardEvent } from 'react';

interface InteractiveCardProps {
    title: string;
    content: string;
}

function InteractiveCard({ title, content }: InteractiveCardProps): JSX.Element {
    const [isExpanded, setIsExpanded] = useState<boolean>(false);
    const [isLiked, setIsLiked] = useState<boolean>(false);
    const [likeCount, setLikeCount] = useState<number>(0);

    const handleCardClick = (): void => {
        setIsExpanded((prev: boolean) => !prev);
    };

    const handleLikeClick = (e: MouseEvent<HTMLButtonElement>): void => {
        e.stopPropagation(); // Don't trigger card expansion
        setIsLiked((prev: boolean) => !prev);
        setLikeCount((prev: number) => isLiked ? prev - 1 : prev + 1);
    };

    const handleShare = (e: MouseEvent<HTMLButtonElement>): void => {
        e.stopPropagation();
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied!');
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>): void => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleCardClick();
        }
    };

    return (
        <div
            className="card"
            onClick={handleCardClick}
            onKeyDown={handleKeyDown}
            tabIndex={0}
            role="button"
            aria-expanded={isExpanded}
            style={{
                border: '1px solid #ddd',
                padding: '16px',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.3s'
            }}
        >
            <h3>{title}</h3>

            {isExpanded && (
                <p style={{ marginTop: '12px' }}>{content}</p>
            )}

            <div
                style={{
                    display: 'flex',
                    gap: '8px',
                    marginTop: '12px'
                }}
            >
                <button
                    onClick={handleLikeClick}
                    style={{
                        background: isLiked ? '#ff4444' : '#eee',
                        color: isLiked ? 'white' : 'black'
                    }}
                >
                    {isLiked ? '❤️' : '🤍'} {likeCount}
                </button>

                <button onClick={handleShare}>
                    Share
                </button>
            </div>

            <p style={{ fontSize: '12px', color: '#666' }}>
                {isExpanded ? 'Click to collapse' : 'Click to expand'}
            </p>
        </div>
    );
}

// Usage
function App(): JSX.Element {
    return (
        <InteractiveCard
            title="Interactive Card"
            content="This is the full content of the card that appears when expanded."
        />
    );
}
```
:::

## Practical Example: Drag and Drop

::: code-group
```jsx [JavaScript]
function DragDropList() {
    const [items, setItems] = useState([
        { id: 1, text: 'Item 1' },
        { id: 2, text: 'Item 2' },
        { id: 3, text: 'Item 3' },
        { id: 4, text: 'Item 4' }
    ]);
    const [draggedItem, setDraggedItem] = useState(null);
    const [dragOverIndex, setDragOverIndex] = useState(null);

    const handleDragStart = (e, item) => {
        setDraggedItem(item);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e, index) => {
        e.preventDefault();
        setDragOverIndex(index);
    };

    const handleDragEnd = () => {
        setDraggedItem(null);
        setDragOverIndex(null);
    };

    const handleDrop = (e, dropIndex) => {
        e.preventDefault();

        if (!draggedItem) return;

        const newItems = items.filter(item => item.id !== draggedItem.id);
        newItems.splice(dropIndex, 0, draggedItem);
        setItems(newItems);

        setDraggedItem(null);
        setDragOverIndex(null);
    };

    return (
        <ul style={{ listStyle: 'none', padding: 0 }}>
            {items.map((item, index) => (
                <li
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    onDrop={(e) => handleDrop(e, index)}
                    style={{
                        padding: '12px',
                        margin: '4px 0',
                        background: dragOverIndex === index ? '#e0e0ff' : '#f5f5f5',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        cursor: 'grab',
                        opacity: draggedItem?.id === item.id ? 0.5 : 1
                    }}
                >
                    {item.text}
                </li>
            ))}
        </ul>
    );
}
```

```tsx [TypeScript]
import { useState, DragEvent } from 'react';

interface DragItem {
    id: number;
    text: string;
}

function DragDropList(): JSX.Element {
    const [items, setItems] = useState<DragItem[]>([
        { id: 1, text: 'Item 1' },
        { id: 2, text: 'Item 2' },
        { id: 3, text: 'Item 3' },
        { id: 4, text: 'Item 4' }
    ]);
    const [draggedItem, setDraggedItem] = useState<DragItem | null>(null);
    const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

    const handleDragStart = (e: DragEvent<HTMLLIElement>, item: DragItem): void => {
        setDraggedItem(item);
        e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragOver = (e: DragEvent<HTMLLIElement>, index: number): void => {
        e.preventDefault();
        setDragOverIndex(index);
    };

    const handleDragEnd = (): void => {
        setDraggedItem(null);
        setDragOverIndex(null);
    };

    const handleDrop = (e: DragEvent<HTMLLIElement>, dropIndex: number): void => {
        e.preventDefault();

        if (!draggedItem) return;

        const newItems = items.filter((item: DragItem) => item.id !== draggedItem.id);
        newItems.splice(dropIndex, 0, draggedItem);
        setItems(newItems);

        setDraggedItem(null);
        setDragOverIndex(null);
    };

    return (
        <ul style={{ listStyle: 'none', padding: 0 }}>
            {items.map((item: DragItem, index: number) => (
                <li
                    key={item.id}
                    draggable
                    onDragStart={(e) => handleDragStart(e, item)}
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDragEnd={handleDragEnd}
                    onDrop={(e) => handleDrop(e, index)}
                    style={{
                        padding: '12px',
                        margin: '4px 0',
                        background: dragOverIndex === index ? '#e0e0ff' : '#f5f5f5',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        cursor: 'grab',
                        opacity: draggedItem?.id === item.id ? 0.5 : 1
                    }}
                >
                    {item.text}
                </li>
            ))}
        </ul>
    );
}
```
:::

## Event Handler Best Practices

### Naming Conventions

```jsx
// ✅ Good: Descriptive handler names
const handleSubmit = () => { ... };
const handleUserClick = () => { ... };
const handleInputChange = () => { ... };

// For props passed to children
const onSubmit = () => { ... };
const onUserSelect = () => { ... };

// ❌ Avoid: Vague names
const click = () => { ... };
const doThing = () => { ... };
```

### Performance Tips

::: code-group
```jsx [JavaScript]
// ❌ Avoid: Creating new function on every render
function List({ items }) {
    return items.map(item => (
        <Item
            key={item.id}
            onClick={() => handleClick(item.id)} // New function every render
        />
    ));
}

// ✅ Better: Use callback with id
function List({ items }) {
    const handleClick = useCallback((id) => {
        console.log('Clicked:', id);
    }, []);

    return items.map(item => (
        <Item
            key={item.id}
            id={item.id}
            onClick={handleClick}
        />
    ));
}

function Item({ id, onClick }) {
    return <button onClick={() => onClick(id)}>Item {id}</button>;
}
```

```tsx [TypeScript]
import { useCallback } from 'react';

interface ItemType {
    id: number;
    name: string;
}

interface ListProps {
    items: ItemType[];
}

// ✅ Better: Use callback with id
function List({ items }: ListProps): JSX.Element {
    const handleClick = useCallback((id: number): void => {
        console.log('Clicked:', id);
    }, []);

    return (
        <>
            {items.map((item: ItemType) => (
                <Item
                    key={item.id}
                    id={item.id}
                    onClick={handleClick}
                />
            ))}
        </>
    );
}

interface ItemProps {
    id: number;
    onClick: (id: number) => void;
}

function Item({ id, onClick }: ItemProps): JSX.Element {
    return <button onClick={() => onClick(id)}>Item {id}</button>;
}
```
:::

## Events Reference Table

| Event | Description | TypeScript Type |
|-------|-------------|-----------------|
| `onClick` | Click event | `MouseEvent<T>` |
| `onDoubleClick` | Double click | `MouseEvent<T>` |
| `onChange` | Input value change | `ChangeEvent<T>` |
| `onSubmit` | Form submission | `FormEvent<T>` |
| `onFocus` | Element gains focus | `FocusEvent<T>` |
| `onBlur` | Element loses focus | `FocusEvent<T>` |
| `onKeyDown` | Key pressed down | `KeyboardEvent<T>` |
| `onKeyUp` | Key released | `KeyboardEvent<T>` |
| `onMouseEnter` | Mouse enters element | `MouseEvent<T>` |
| `onMouseLeave` | Mouse leaves element | `MouseEvent<T>` |
| `onMouseMove` | Mouse moves over element | `MouseEvent<T>` |
| `onScroll` | Element scrolled | `UIEvent<T>` |
| `onDrag` | Element being dragged | `DragEvent<T>` |
| `onDrop` | Element dropped | `DragEvent<T>` |

## What's Next?

In the next chapter, we'll learn about [React Hooks](/guide/react/06-hooks) - useEffect, useRef, useContext, and other essential hooks for managing side effects and more.

---

[Next: React Hooks →](/guide/react/06-hooks)
