# React Hooks

Hooks let you use state and other React features in function components. In this tutorial, you'll learn the essential hooks: useEffect, useRef, useContext, useMemo, and useCallback.

## What are Hooks?

Hooks are functions that let you "hook into" React features. They follow two simple rules:

```
┌─────────────────────────────────────────────────────────────┐
│                    Rules of Hooks                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   1. Only call Hooks at the top level                       │
│      ❌ Don't call inside loops, conditions, or nested fns │
│      ✅ Always call at the top level of your component     │
│                                                             │
│   2. Only call Hooks from React functions                   │
│      ❌ Don't call from regular JavaScript functions        │
│      ✅ Call from React function components                │
│      ✅ Call from custom Hooks                             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## useEffect - Side Effects

`useEffect` handles side effects: data fetching, subscriptions, DOM manipulation, timers, etc.

### Basic Syntax

::: code-group
```jsx [JavaScript]
import { useEffect, useState } from 'react';

function Example() {
    const [count, setCount] = useState(0);

    // Runs after every render
    useEffect(() => {
        document.title = `Count: ${count}`;
    });

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>+</button>
        </div>
    );
}
```

```tsx [TypeScript]
import { useEffect, useState } from 'react';

function Example(): JSX.Element {
    const [count, setCount] = useState<number>(0);

    // Runs after every render
    useEffect(() => {
        document.title = `Count: ${count}`;
    });

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>+</button>
        </div>
    );
}
```
:::

### Dependency Array

The dependency array controls when the effect runs:

::: code-group
```jsx [JavaScript]
// Run after EVERY render
useEffect(() => {
    console.log('Runs every render');
});

// Run only ONCE (on mount)
useEffect(() => {
    console.log('Runs once on mount');
}, []); // Empty array

// Run when specific values change
useEffect(() => {
    console.log('Count changed:', count);
}, [count]); // Only when count changes

// Multiple dependencies
useEffect(() => {
    console.log('User or page changed');
}, [userId, currentPage]);
```

```tsx [TypeScript]
// Run after EVERY render
useEffect((): void => {
    console.log('Runs every render');
});

// Run only ONCE (on mount)
useEffect((): void => {
    console.log('Runs once on mount');
}, []); // Empty array

// Run when specific values change
useEffect((): void => {
    console.log('Count changed:', count);
}, [count]); // Only when count changes

// Multiple dependencies
useEffect((): void => {
    console.log('User or page changed');
}, [userId, currentPage]);
```
:::

### Effect Lifecycle

```
┌─────────────────────────────────────────────────────────────┐
│                    useEffect Lifecycle                       │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Component Mounts                                          │
│        ↓                                                    │
│   Render JSX to screen                                      │
│        ↓                                                    │
│   Run useEffect (setup)                                     │
│        ↓                                                    │
│   [User interacts, state changes]                           │
│        ↓                                                    │
│   Re-render JSX                                             │
│        ↓                                                    │
│   Run cleanup (if any) ← Previous effect                    │
│        ↓                                                    │
│   Run useEffect (setup) ← New effect                       │
│        ↓                                                    │
│   Component Unmounts                                        │
│        ↓                                                    │
│   Run cleanup (final)                                       │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Cleanup Function

Return a function to clean up:

::: code-group
```jsx [JavaScript]
function Timer() {
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        // Setup: Start interval
        const intervalId = setInterval(() => {
            setSeconds(prev => prev + 1);
        }, 1000);

        // Cleanup: Stop interval
        return () => {
            clearInterval(intervalId);
        };
    }, []); // Run once on mount

    return <p>Time: {seconds}s</p>;
}
```

```tsx [TypeScript]
function Timer(): JSX.Element {
    const [seconds, setSeconds] = useState<number>(0);

    useEffect(() => {
        // Setup: Start interval
        const intervalId: NodeJS.Timeout = setInterval(() => {
            setSeconds((prev: number) => prev + 1);
        }, 1000);

        // Cleanup: Stop interval
        return (): void => {
            clearInterval(intervalId);
        };
    }, []); // Run once on mount

    return <p>Time: {seconds}s</p>;
}
```
:::

### Event Listener Cleanup

::: code-group
```jsx [JavaScript]
function WindowSize() {
    const [size, setSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useEffect(() => {
        const handleResize = () => {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);

        // Cleanup: Remove listener
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return <p>Window: {size.width} x {size.height}</p>;
}
```

```tsx [TypeScript]
interface WindowSize {
    width: number;
    height: number;
}

function WindowSize(): JSX.Element {
    const [size, setSize] = useState<WindowSize>({
        width: window.innerWidth,
        height: window.innerHeight
    });

    useEffect(() => {
        const handleResize = (): void => {
            setSize({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        window.addEventListener('resize', handleResize);

        // Cleanup: Remove listener
        return (): void => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return <p>Window: {size.width} x {size.height}</p>;
}
```
:::

### Data Fetching

::: code-group
```jsx [JavaScript]
function UserProfile({ userId }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Reset state when userId changes
        setLoading(true);
        setError(null);

        // Fetch user data
        fetch(`https://api.example.com/users/${userId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('User not found');
                }
                return response.json();
            })
            .then(data => {
                setUser(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, [userId]); // Re-fetch when userId changes

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!user) return null;

    return (
        <div>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
        </div>
    );
}
```

```tsx [TypeScript]
interface User {
    id: number;
    name: string;
    email: string;
}

interface UserProfileProps {
    userId: number;
}

function UserProfile({ userId }: UserProfileProps): JSX.Element | null {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        // Reset state when userId changes
        setLoading(true);
        setError(null);

        // Fetch user data
        fetch(`https://api.example.com/users/${userId}`)
            .then((response: Response) => {
                if (!response.ok) {
                    throw new Error('User not found');
                }
                return response.json();
            })
            .then((data: User) => {
                setUser(data);
                setLoading(false);
            })
            .catch((err: Error) => {
                setError(err.message);
                setLoading(false);
            });
    }, [userId]); // Re-fetch when userId changes

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!user) return null;

    return (
        <div>
            <h2>{user.name}</h2>
            <p>{user.email}</p>
        </div>
    );
}
```
:::

### Async in useEffect

::: code-group
```jsx [JavaScript]
function AsyncExample() {
    const [data, setData] = useState(null);

    useEffect(() => {
        // Option 1: Define async function inside
        const fetchData = async () => {
            try {
                const response = await fetch('/api/data');
                const json = await response.json();
                setData(json);
            } catch (error) {
                console.error('Fetch error:', error);
            }
        };

        fetchData();
    }, []);

    // Option 2: IIFE (Immediately Invoked Function Expression)
    useEffect(() => {
        (async () => {
            const response = await fetch('/api/data');
            const json = await response.json();
            setData(json);
        })();
    }, []);

    return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```

```tsx [TypeScript]
interface DataType {
    id: number;
    value: string;
}

function AsyncExample(): JSX.Element {
    const [data, setData] = useState<DataType | null>(null);

    useEffect(() => {
        // Option 1: Define async function inside
        const fetchData = async (): Promise<void> => {
            try {
                const response: Response = await fetch('/api/data');
                const json: DataType = await response.json();
                setData(json);
            } catch (error) {
                console.error('Fetch error:', error);
            }
        };

        fetchData();
    }, []);

    // Option 2: IIFE (Immediately Invoked Function Expression)
    useEffect(() => {
        (async (): Promise<void> => {
            const response: Response = await fetch('/api/data');
            const json: DataType = await response.json();
            setData(json);
        })();
    }, []);

    return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
```
:::

## useRef - References

`useRef` creates a mutable reference that persists across renders without causing re-renders.

### DOM References

::: code-group
```jsx [JavaScript]
function TextInput() {
    const inputRef = useRef(null);

    const focusInput = () => {
        inputRef.current.focus();
    };

    const selectAll = () => {
        inputRef.current.select();
    };

    return (
        <div>
            <input ref={inputRef} type="text" placeholder="Type here..." />
            <button onClick={focusInput}>Focus Input</button>
            <button onClick={selectAll}>Select All</button>
        </div>
    );
}
```

```tsx [TypeScript]
import { useRef } from 'react';

function TextInput(): JSX.Element {
    // Type the ref with the HTML element type
    const inputRef = useRef<HTMLInputElement>(null);

    const focusInput = (): void => {
        inputRef.current?.focus();
    };

    const selectAll = (): void => {
        inputRef.current?.select();
    };

    return (
        <div>
            <input ref={inputRef} type="text" placeholder="Type here..." />
            <button onClick={focusInput}>Focus Input</button>
            <button onClick={selectAll}>Select All</button>
        </div>
    );
}
```
:::

### Storing Values

::: code-group
```jsx [JavaScript]
function RenderCounter() {
    const [count, setCount] = useState(0);
    const renderCount = useRef(0);

    // This increments on every render without causing re-render
    renderCount.current++;

    return (
        <div>
            <p>Count: {count}</p>
            <p>Component rendered {renderCount.current} times</p>
            <button onClick={() => setCount(count + 1)}>Increment</button>
        </div>
    );
}
```

```tsx [TypeScript]
import { useState, useRef } from 'react';

function RenderCounter(): JSX.Element {
    const [count, setCount] = useState<number>(0);
    const renderCount = useRef<number>(0);

    // This increments on every render without causing re-render
    renderCount.current++;

    return (
        <div>
            <p>Count: {count}</p>
            <p>Component rendered {renderCount.current} times</p>
            <button onClick={() => setCount(count + 1)}>Increment</button>
        </div>
    );
}
```
:::

### Previous Value

::: code-group
```jsx [JavaScript]
function PreviousValue() {
    const [count, setCount] = useState(0);
    const prevCountRef = useRef();

    useEffect(() => {
        prevCountRef.current = count;
    }, [count]);

    const prevCount = prevCountRef.current;

    return (
        <div>
            <p>Current: {count}</p>
            <p>Previous: {prevCount}</p>
            <button onClick={() => setCount(count + 1)}>+</button>
        </div>
    );
}
```

```tsx [TypeScript]
import { useState, useRef, useEffect } from 'react';

function PreviousValue(): JSX.Element {
    const [count, setCount] = useState<number>(0);
    const prevCountRef = useRef<number | undefined>();

    useEffect(() => {
        prevCountRef.current = count;
    }, [count]);

    const prevCount: number | undefined = prevCountRef.current;

    return (
        <div>
            <p>Current: {count}</p>
            <p>Previous: {prevCount ?? 'N/A'}</p>
            <button onClick={() => setCount(count + 1)}>+</button>
        </div>
    );
}
```
:::

### Timer Reference

::: code-group
```jsx [JavaScript]
function Stopwatch() {
    const [time, setTime] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef(null);

    const start = () => {
        if (isRunning) return;
        setIsRunning(true);
        intervalRef.current = setInterval(() => {
            setTime(prev => prev + 10);
        }, 10);
    };

    const stop = () => {
        setIsRunning(false);
        clearInterval(intervalRef.current);
    };

    const reset = () => {
        stop();
        setTime(0);
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => clearInterval(intervalRef.current);
    }, []);

    const formatTime = (ms) => {
        const minutes = Math.floor(ms / 60000);
        const seconds = Math.floor((ms % 60000) / 1000);
        const centiseconds = Math.floor((ms % 1000) / 10);
        return `${minutes}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
    };

    return (
        <div>
            <h2>{formatTime(time)}</h2>
            <button onClick={start} disabled={isRunning}>Start</button>
            <button onClick={stop} disabled={!isRunning}>Stop</button>
            <button onClick={reset}>Reset</button>
        </div>
    );
}
```

```tsx [TypeScript]
import { useState, useRef, useEffect } from 'react';

function Stopwatch(): JSX.Element {
    const [time, setTime] = useState<number>(0);
    const [isRunning, setIsRunning] = useState<boolean>(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const start = (): void => {
        if (isRunning) return;
        setIsRunning(true);
        intervalRef.current = setInterval(() => {
            setTime((prev: number) => prev + 10);
        }, 10);
    };

    const stop = (): void => {
        setIsRunning(false);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };

    const reset = (): void => {
        stop();
        setTime(0);
    };

    // Cleanup on unmount
    useEffect(() => {
        return (): void => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    const formatTime = (ms: number): string => {
        const minutes: number = Math.floor(ms / 60000);
        const seconds: number = Math.floor((ms % 60000) / 1000);
        const centiseconds: number = Math.floor((ms % 1000) / 10);
        return `${minutes}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
    };

    return (
        <div>
            <h2>{formatTime(time)}</h2>
            <button onClick={start} disabled={isRunning}>Start</button>
            <button onClick={stop} disabled={!isRunning}>Stop</button>
            <button onClick={reset}>Reset</button>
        </div>
    );
}
```
:::

## useContext - Sharing Data

`useContext` allows you to share data across components without prop drilling.

### Creating Context

::: code-group
```jsx [JavaScript]
import { createContext, useContext, useState } from 'react';

// 1. Create the context
const ThemeContext = createContext(null);

// 2. Create a provider component
function ThemeProvider({ children }) {
    const [theme, setTheme] = useState('light');

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

// 3. Create a custom hook for easy access
function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}

export { ThemeProvider, useTheme };
```

```tsx [TypeScript]
import { createContext, useContext, useState, ReactNode } from 'react';

// Define context value type
interface ThemeContextType {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
}

// 1. Create the context with type
const ThemeContext = createContext<ThemeContextType | null>(null);

// Define provider props
interface ThemeProviderProps {
    children: ReactNode;
}

// 2. Create a provider component
function ThemeProvider({ children }: ThemeProviderProps): JSX.Element {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    const toggleTheme = (): void => {
        setTheme((prev) => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

// 3. Create a custom hook for easy access
function useTheme(): ThemeContextType {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}

export { ThemeProvider, useTheme };
```
:::

### Using Context

::: code-group
```jsx [JavaScript]
// App.jsx
import { ThemeProvider } from './ThemeContext';

function App() {
    return (
        <ThemeProvider>
            <Header />
            <Main />
            <Footer />
        </ThemeProvider>
    );
}

// Any nested component can access theme
function Header() {
    const { theme, toggleTheme } = useTheme();

    return (
        <header style={{
            background: theme === 'light' ? '#fff' : '#333',
            color: theme === 'light' ? '#333' : '#fff'
        }}>
            <h1>My App</h1>
            <button onClick={toggleTheme}>
                Toggle to {theme === 'light' ? 'dark' : 'light'}
            </button>
        </header>
    );
}
```

```tsx [TypeScript]
// App.tsx
import { ThemeProvider, useTheme } from './ThemeContext';

function App(): JSX.Element {
    return (
        <ThemeProvider>
            <Header />
            <Main />
            <Footer />
        </ThemeProvider>
    );
}

// Any nested component can access theme
function Header(): JSX.Element {
    const { theme, toggleTheme } = useTheme();

    return (
        <header style={{
            background: theme === 'light' ? '#fff' : '#333',
            color: theme === 'light' ? '#333' : '#fff'
        }}>
            <h1>My App</h1>
            <button onClick={toggleTheme}>
                Toggle to {theme === 'light' ? 'dark' : 'light'}
            </button>
        </header>
    );
}
```
:::

### Complex Context Example

::: code-group
```jsx [JavaScript]
// AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check for existing session
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const response = await fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        const userData = await response.json();

        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const value = {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}

export { AuthProvider, useAuth };
```

```tsx [TypeScript]
// AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Define user type
interface User {
    id: number;
    email: string;
    name: string;
}

// Define context value type
interface AuthContextType {
    user: User | null;
    loading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

interface AuthProviderProps {
    children: ReactNode;
}

function AuthProvider({ children }: AuthProviderProps): JSX.Element {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Check for existing session
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser) as User);
        }
        setLoading(false);
    }, []);

    const login = async (email: string, password: string): Promise<void> => {
        const response = await fetch('/api/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
        const userData: User = await response.json();

        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
    };

    const logout = (): void => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const value: AuthContextType = {
        user,
        loading,
        isAuthenticated: !!user,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

function useAuth(): AuthContextType {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
}

export { AuthProvider, useAuth };
```
:::

## useMemo - Memoized Values

`useMemo` caches computed values to avoid expensive recalculations.

::: code-group
```jsx [JavaScript]
import { useMemo, useState } from 'react';

function ExpensiveList({ items, filter }) {
    const [sortOrder, setSortOrder] = useState('asc');

    // Only recalculate when items, filter, or sortOrder changes
    const processedItems = useMemo(() => {
        console.log('Processing items...');

        // Filter
        let result = items.filter(item =>
            item.name.toLowerCase().includes(filter.toLowerCase())
        );

        // Sort
        result.sort((a, b) => {
            if (sortOrder === 'asc') {
                return a.name.localeCompare(b.name);
            }
            return b.name.localeCompare(a.name);
        });

        return result;
    }, [items, filter, sortOrder]);

    return (
        <div>
            <button onClick={() => setSortOrder(prev =>
                prev === 'asc' ? 'desc' : 'asc'
            )}>
                Sort: {sortOrder}
            </button>
            <ul>
                {processedItems.map(item => (
                    <li key={item.id}>{item.name}</li>
                ))}
            </ul>
        </div>
    );
}
```

```tsx [TypeScript]
import { useMemo, useState } from 'react';

interface Item {
    id: number;
    name: string;
}

interface ExpensiveListProps {
    items: Item[];
    filter: string;
}

function ExpensiveList({ items, filter }: ExpensiveListProps): JSX.Element {
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

    // Only recalculate when items, filter, or sortOrder changes
    const processedItems = useMemo((): Item[] => {
        console.log('Processing items...');

        // Filter
        let result: Item[] = items.filter((item: Item) =>
            item.name.toLowerCase().includes(filter.toLowerCase())
        );

        // Sort
        result.sort((a: Item, b: Item) => {
            if (sortOrder === 'asc') {
                return a.name.localeCompare(b.name);
            }
            return b.name.localeCompare(a.name);
        });

        return result;
    }, [items, filter, sortOrder]);

    return (
        <div>
            <button onClick={() => setSortOrder((prev) =>
                prev === 'asc' ? 'desc' : 'asc'
            )}>
                Sort: {sortOrder}
            </button>
            <ul>
                {processedItems.map((item: Item) => (
                    <li key={item.id}>{item.name}</li>
                ))}
            </ul>
        </div>
    );
}
```
:::

### When to Use useMemo

```jsx
// ✅ Good: Expensive computation
const sortedList = useMemo(() => {
    return [...hugeArray].sort((a, b) => a.value - b.value);
}, [hugeArray]);

// ✅ Good: Reference equality for child props
const memoizedObject = useMemo(() => ({
    id: user.id,
    name: user.name
}), [user.id, user.name]);

// ❌ Bad: Simple computation
const doubled = useMemo(() => count * 2, [count]);
// Just use: const doubled = count * 2;
```

## useCallback - Memoized Functions

`useCallback` caches function references to prevent unnecessary re-renders.

::: code-group
```jsx [JavaScript]
import { useCallback, useState, memo } from 'react';

function ParentComponent() {
    const [count, setCount] = useState(0);
    const [items, setItems] = useState([]);

    // This function is recreated on every render
    const handleClickBad = () => {
        console.log('Clicked');
    };

    // This function is memoized
    const handleClick = useCallback(() => {
        console.log('Clicked');
    }, []);

    // With dependencies
    const addItem = useCallback((item) => {
        setItems(prev => [...prev, item]);
    }, []); // No dependencies needed with functional update

    const logCount = useCallback(() => {
        console.log('Count is:', count);
    }, [count]); // Re-create when count changes

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>+</button>
            <ChildComponent onClick={handleClick} />
            <ItemList onAddItem={addItem} />
        </div>
    );
}

// Child that only re-renders when props change
const ChildComponent = memo(({ onClick }) => {
    console.log('ChildComponent rendered');
    return <button onClick={onClick}>Click Me</button>;
});
```

```tsx [TypeScript]
import { useCallback, useState, memo } from 'react';

function ParentComponent(): JSX.Element {
    const [count, setCount] = useState<number>(0);
    const [items, setItems] = useState<string[]>([]);

    // This function is memoized
    const handleClick = useCallback((): void => {
        console.log('Clicked');
    }, []);

    // With dependencies
    const addItem = useCallback((item: string): void => {
        setItems((prev: string[]) => [...prev, item]);
    }, []); // No dependencies needed with functional update

    const logCount = useCallback((): void => {
        console.log('Count is:', count);
    }, [count]); // Re-create when count changes

    return (
        <div>
            <p>Count: {count}</p>
            <button onClick={() => setCount(count + 1)}>+</button>
            <ChildComponent onClick={handleClick} />
            <ItemList onAddItem={addItem} />
        </div>
    );
}

// Define props interface
interface ChildComponentProps {
    onClick: () => void;
}

// Child that only re-renders when props change
const ChildComponent = memo(({ onClick }: ChildComponentProps): JSX.Element => {
    console.log('ChildComponent rendered');
    return <button onClick={onClick}>Click Me</button>;
});
```
:::

### useCallback vs useMemo

```jsx
// These are equivalent:
const memoizedFn = useCallback(() => {
    doSomething(a, b);
}, [a, b]);

const memoizedFn = useMemo(() => {
    return () => {
        doSomething(a, b);
    };
}, [a, b]);
```

## Custom Hooks

Create reusable hooks by combining built-in hooks:

### useLocalStorage

::: code-group
```jsx [JavaScript]
function useLocalStorage(key, initialValue) {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function
                ? value(storedValue)
                : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue];
}

// Usage
function App() {
    const [name, setName] = useLocalStorage('name', 'Guest');

    return (
        <input
            value={name}
            onChange={(e) => setName(e.target.value)}
        />
    );
}
```

```tsx [TypeScript]
import { useState, Dispatch, SetStateAction } from 'react';

function useLocalStorage<T>(
    key: string,
    initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? (JSON.parse(item) as T) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const setValue: Dispatch<SetStateAction<T>> = (value) => {
        try {
            const valueToStore = value instanceof Function
                ? value(storedValue)
                : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error);
        }
    };

    return [storedValue, setValue];
}

// Usage
function App(): JSX.Element {
    const [name, setName] = useLocalStorage<string>('name', 'Guest');

    return (
        <input
            value={name}
            onChange={(e) => setName(e.target.value)}
        />
    );
}
```
:::

### useFetch

::: code-group
```jsx [JavaScript]
function useFetch(url) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const abortController = new AbortController();

        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await fetch(url, {
                    signal: abortController.signal
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const json = await response.json();
                setData(json);
                setError(null);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return () => abortController.abort();
    }, [url]);

    return { data, loading, error };
}

// Usage
function UserList() {
    const { data, loading, error } = useFetch('/api/users');

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <ul>
            {data?.map(user => (
                <li key={user.id}>{user.name}</li>
            ))}
        </ul>
    );
}
```

```tsx [TypeScript]
import { useState, useEffect } from 'react';

interface UseFetchResult<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

function useFetch<T>(url: string): UseFetchResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const abortController = new AbortController();

        const fetchData = async (): Promise<void> => {
            try {
                setLoading(true);
                const response: Response = await fetch(url, {
                    signal: abortController.signal
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const json: T = await response.json();
                setData(json);
                setError(null);
            } catch (err) {
                if ((err as Error).name !== 'AbortError') {
                    setError((err as Error).message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();

        return (): void => abortController.abort();
    }, [url]);

    return { data, loading, error };
}

// Usage
interface User {
    id: number;
    name: string;
}

function UserList(): JSX.Element {
    const { data, loading, error } = useFetch<User[]>('/api/users');

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <ul>
            {data?.map((user: User) => (
                <li key={user.id}>{user.name}</li>
            ))}
        </ul>
    );
}
```
:::

### useToggle

::: code-group
```jsx [JavaScript]
function useToggle(initialValue = false) {
    const [value, setValue] = useState(initialValue);

    const toggle = useCallback(() => {
        setValue(prev => !prev);
    }, []);

    const setTrue = useCallback(() => setValue(true), []);
    const setFalse = useCallback(() => setValue(false), []);

    return [value, toggle, setTrue, setFalse];
}

// Usage
function Modal() {
    const [isOpen, toggleModal, openModal, closeModal] = useToggle();

    return (
        <div>
            <button onClick={openModal}>Open</button>
            {isOpen && (
                <div className="modal">
                    <p>Modal Content</p>
                    <button onClick={closeModal}>Close</button>
                </div>
            )}
        </div>
    );
}
```

```tsx [TypeScript]
import { useState, useCallback } from 'react';

type UseToggleReturn = [boolean, () => void, () => void, () => void];

function useToggle(initialValue: boolean = false): UseToggleReturn {
    const [value, setValue] = useState<boolean>(initialValue);

    const toggle = useCallback((): void => {
        setValue((prev: boolean) => !prev);
    }, []);

    const setTrue = useCallback((): void => setValue(true), []);
    const setFalse = useCallback((): void => setValue(false), []);

    return [value, toggle, setTrue, setFalse];
}

// Usage
function Modal(): JSX.Element {
    const [isOpen, toggleModal, openModal, closeModal] = useToggle();

    return (
        <div>
            <button onClick={openModal}>Open</button>
            {isOpen && (
                <div className="modal">
                    <p>Modal Content</p>
                    <button onClick={closeModal}>Close</button>
                </div>
            )}
        </div>
    );
}
```
:::

### useDebounce

::: code-group
```jsx [JavaScript]
function useDebounce(value, delay) {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}

// Usage: Search input
function SearchInput() {
    const [query, setQuery] = useState('');
    const debouncedQuery = useDebounce(query, 500);

    useEffect(() => {
        if (debouncedQuery) {
            console.log('Searching for:', debouncedQuery);
            // Perform search API call
        }
    }, [debouncedQuery]);

    return (
        <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
        />
    );
}
```

```tsx [TypeScript]
import { useState, useEffect, ChangeEvent } from 'react';

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer: NodeJS.Timeout = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return (): void => clearTimeout(timer);
    }, [value, delay]);

    return debouncedValue;
}

// Usage: Search input
function SearchInput(): JSX.Element {
    const [query, setQuery] = useState<string>('');
    const debouncedQuery: string = useDebounce<string>(query, 500);

    useEffect(() => {
        if (debouncedQuery) {
            console.log('Searching for:', debouncedQuery);
            // Perform search API call
        }
    }, [debouncedQuery]);

    return (
        <input
            value={query}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
            placeholder="Search..."
        />
    );
}
```
:::

## Hooks Summary

| Hook | Purpose | Returns |
|------|---------|---------|
| `useState` | Manage local state | `[value, setValue]` |
| `useEffect` | Side effects | `void` |
| `useRef` | Mutable reference | `{ current: value }` |
| `useContext` | Access context | Context value |
| `useMemo` | Memoize values | Cached value |
| `useCallback` | Memoize functions | Cached function |
| `useReducer` | Complex state logic | `[state, dispatch]` |

### TypeScript Benefits for Hooks

| Hook | TypeScript Feature |
|------|--------------------|
| `useState<T>` | Generic type for state |
| `useRef<T>` | Typed ref.current |
| `useContext` | Typed context value |
| `useMemo<T>` | Return type inference |
| `useCallback` | Function type safety |
| Custom hooks | Full type inference |

## What's Next?

In the next chapter, we'll learn about [Form Handling](/guide/react/07-forms) - controlled components, validation, and managing complex form state.

---

[Next: Form Handling →](/guide/react/07-forms)
