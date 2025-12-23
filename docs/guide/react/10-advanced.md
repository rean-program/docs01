# Advanced Patterns

This chapter covers advanced React patterns and techniques for building scalable, performant applications. You'll learn about Context API, performance optimization, code splitting, and architectural patterns.

## Context API - Global State

### Creating a Complete Context

::: code-group
```jsx [JavaScript]
import { createContext, useContext, useReducer, useCallback } from 'react';

// 1. Define initial state
const initialState = {
    user: null,
    theme: 'light',
    notifications: []
};

// 2. Define actions
const actionTypes = {
    SET_USER: 'SET_USER',
    LOGOUT: 'LOGOUT',
    SET_THEME: 'SET_THEME',
    ADD_NOTIFICATION: 'ADD_NOTIFICATION',
    REMOVE_NOTIFICATION: 'REMOVE_NOTIFICATION'
};

// 3. Reducer function
function appReducer(state, action) {
    switch (action.type) {
        case actionTypes.SET_USER:
            return { ...state, user: action.payload };
        case actionTypes.LOGOUT:
            return { ...state, user: null };
        case actionTypes.SET_THEME:
            return { ...state, theme: action.payload };
        case actionTypes.ADD_NOTIFICATION:
            return {
                ...state,
                notifications: [...state.notifications, action.payload]
            };
        case actionTypes.REMOVE_NOTIFICATION:
            return {
                ...state,
                notifications: state.notifications.filter(
                    n => n.id !== action.payload
                )
            };
        default:
            return state;
    }
}

// 4. Create context
const AppContext = createContext(null);

// 5. Provider component
function AppProvider({ children }) {
    const [state, dispatch] = useReducer(appReducer, initialState);

    // Memoized actions
    const setUser = useCallback((user) => {
        dispatch({ type: actionTypes.SET_USER, payload: user });
    }, []);

    const logout = useCallback(() => {
        dispatch({ type: actionTypes.LOGOUT });
    }, []);

    const setTheme = useCallback((theme) => {
        dispatch({ type: actionTypes.SET_THEME, payload: theme });
    }, []);

    const addNotification = useCallback((notification) => {
        const id = Date.now();
        dispatch({
            type: actionTypes.ADD_NOTIFICATION,
            payload: { ...notification, id }
        });

        // Auto-remove after 5 seconds
        setTimeout(() => {
            dispatch({ type: actionTypes.REMOVE_NOTIFICATION, payload: id });
        }, 5000);
    }, []);

    const value = {
        ...state,
        setUser,
        logout,
        setTheme,
        addNotification
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

// 6. Custom hook
function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
}

export { AppProvider, useApp };
```

```tsx [TypeScript]
import {
    createContext,
    useContext,
    useReducer,
    useCallback,
    ReactNode
} from 'react';

// 1. Define types
interface User {
    id: string;
    name: string;
    email: string;
}

interface Notification {
    id: number;
    message: string;
    type: 'success' | 'error' | 'info';
}

interface AppState {
    user: User | null;
    theme: 'light' | 'dark';
    notifications: Notification[];
}

interface AppContextValue extends AppState {
    setUser: (user: User) => void;
    logout: () => void;
    setTheme: (theme: 'light' | 'dark') => void;
    addNotification: (notification: Omit<Notification, 'id'>) => void;
}

type AppAction =
    | { type: 'SET_USER'; payload: User }
    | { type: 'LOGOUT' }
    | { type: 'SET_THEME'; payload: 'light' | 'dark' }
    | { type: 'ADD_NOTIFICATION'; payload: Notification }
    | { type: 'REMOVE_NOTIFICATION'; payload: number };

// 2. Initial state
const initialState: AppState = {
    user: null,
    theme: 'light',
    notifications: []
};

// 3. Reducer function
function appReducer(state: AppState, action: AppAction): AppState {
    switch (action.type) {
        case 'SET_USER':
            return { ...state, user: action.payload };
        case 'LOGOUT':
            return { ...state, user: null };
        case 'SET_THEME':
            return { ...state, theme: action.payload };
        case 'ADD_NOTIFICATION':
            return {
                ...state,
                notifications: [...state.notifications, action.payload]
            };
        case 'REMOVE_NOTIFICATION':
            return {
                ...state,
                notifications: state.notifications.filter(
                    (n: Notification) => n.id !== action.payload
                )
            };
        default:
            return state;
    }
}

// 4. Create context
const AppContext = createContext<AppContextValue | null>(null);

// 5. Provider component
interface AppProviderProps {
    children: ReactNode;
}

function AppProvider({ children }: AppProviderProps): JSX.Element {
    const [state, dispatch] = useReducer(appReducer, initialState);

    // Memoized actions
    const setUser = useCallback((user: User): void => {
        dispatch({ type: 'SET_USER', payload: user });
    }, []);

    const logout = useCallback((): void => {
        dispatch({ type: 'LOGOUT' });
    }, []);

    const setTheme = useCallback((theme: 'light' | 'dark'): void => {
        dispatch({ type: 'SET_THEME', payload: theme });
    }, []);

    const addNotification = useCallback((notification: Omit<Notification, 'id'>): void => {
        const id = Date.now();
        dispatch({
            type: 'ADD_NOTIFICATION',
            payload: { ...notification, id }
        });

        // Auto-remove after 5 seconds
        setTimeout(() => {
            dispatch({ type: 'REMOVE_NOTIFICATION', payload: id });
        }, 5000);
    }, []);

    const value: AppContextValue = {
        ...state,
        setUser,
        logout,
        setTheme,
        addNotification
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

// 6. Custom hook
function useApp(): AppContextValue {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within AppProvider');
    }
    return context;
}

export { AppProvider, useApp };
export type { User, Notification, AppState };
```
:::

### Splitting Contexts for Performance

::: code-group
```jsx [JavaScript]
// Separate contexts for different concerns
const UserContext = createContext(null);
const ThemeContext = createContext(null);
const NotificationContext = createContext(null);

// Compose providers
function AppProviders({ children }) {
    return (
        <UserProvider>
            <ThemeProvider>
                <NotificationProvider>
                    {children}
                </NotificationProvider>
            </ThemeProvider>
        </UserProvider>
    );
}

// Components only re-render when their specific context changes
function UserDisplay() {
    const { user } = useUser(); // Only re-renders on user changes
    return <p>Hello, {user?.name}</p>;
}

function ThemeToggle() {
    const { theme, setTheme } = useTheme(); // Only re-renders on theme changes
    return (
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            Current: {theme}
        </button>
    );
}
```

```tsx [TypeScript]
import { createContext, useContext, ReactNode } from 'react';

// Type definitions
interface User {
    id: string;
    name: string;
}

interface UserContextValue {
    user: User | null;
    setUser: (user: User) => void;
}

interface ThemeContextValue {
    theme: 'light' | 'dark';
    setTheme: (theme: 'light' | 'dark') => void;
}

// Separate contexts for different concerns
const UserContext = createContext<UserContextValue | null>(null);
const ThemeContext = createContext<ThemeContextValue | null>(null);

// Custom hooks with type safety
function useUser(): UserContextValue {
    const context = useContext(UserContext);
    if (!context) throw new Error('useUser must be within UserProvider');
    return context;
}

function useTheme(): ThemeContextValue {
    const context = useContext(ThemeContext);
    if (!context) throw new Error('useTheme must be within ThemeProvider');
    return context;
}

// Compose providers
interface AppProvidersProps {
    children: ReactNode;
}

function AppProviders({ children }: AppProvidersProps): JSX.Element {
    return (
        <UserProvider>
            <ThemeProvider>
                {children}
            </ThemeProvider>
        </UserProvider>
    );
}

// Components only re-render when their specific context changes
function UserDisplay(): JSX.Element {
    const { user } = useUser(); // Only re-renders on user changes
    return <p>Hello, {user?.name}</p>;
}

function ThemeToggle(): JSX.Element {
    const { theme, setTheme } = useTheme(); // Only re-renders on theme changes
    return (
        <button onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
            Current: {theme}
        </button>
    );
}
```
:::

## Performance Optimization

### React.memo

Prevent unnecessary re-renders of child components:

::: code-group
```jsx [JavaScript]
import { memo, useState } from 'react';

// Without memo - re-renders every time parent renders
function ExpensiveList({ items }) {
    console.log('ExpensiveList rendered');
    return (
        <ul>
            {items.map(item => (
                <li key={item.id}>{item.name}</li>
            ))}
        </ul>
    );
}

// With memo - only re-renders when items change
const MemoizedList = memo(function ExpensiveList({ items }) {
    console.log('MemoizedList rendered');
    return (
        <ul>
            {items.map(item => (
                <li key={item.id}>{item.name}</li>
            ))}
        </ul>
    );
});

// Custom comparison function
const MemoizedWithCompare = memo(
    function UserCard({ user, onClick }) {
        return (
            <div onClick={onClick}>
                <h2>{user.name}</h2>
                <p>{user.email}</p>
            </div>
        );
    },
    (prevProps, nextProps) => {
        // Return true if props are equal (skip re-render)
        return prevProps.user.id === nextProps.user.id;
    }
);

// Parent component
function Parent() {
    const [count, setCount] = useState(0);
    const [items] = useState([
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' }
    ]);

    return (
        <div>
            <button onClick={() => setCount(count + 1)}>
                Count: {count}
            </button>
            {/* MemoizedList won't re-render when count changes */}
            <MemoizedList items={items} />
        </div>
    );
}
```

```tsx [TypeScript]
import { memo, useState, MouseEvent } from 'react';

// Type definitions
interface Item {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface ListProps {
    items: Item[];
}

interface UserCardProps {
    user: User;
    onClick: (e: MouseEvent<HTMLDivElement>) => void;
}

// Without memo - re-renders every time parent renders
function ExpensiveList({ items }: ListProps): JSX.Element {
    console.log('ExpensiveList rendered');
    return (
        <ul>
            {items.map((item: Item) => (
                <li key={item.id}>{item.name}</li>
            ))}
        </ul>
    );
}

// With memo - only re-renders when items change
const MemoizedList = memo(function ExpensiveList({ items }: ListProps): JSX.Element {
    console.log('MemoizedList rendered');
    return (
        <ul>
            {items.map((item: Item) => (
                <li key={item.id}>{item.name}</li>
            ))}
        </ul>
    );
});

// Custom comparison function
const MemoizedWithCompare = memo<UserCardProps>(
    function UserCard({ user, onClick }) {
        return (
            <div onClick={onClick}>
                <h2>{user.name}</h2>
                <p>{user.email}</p>
            </div>
        );
    },
    (prevProps: UserCardProps, nextProps: UserCardProps): boolean => {
        // Return true if props are equal (skip re-render)
        return prevProps.user.id === nextProps.user.id;
    }
);

// Parent component
function Parent(): JSX.Element {
    const [count, setCount] = useState<number>(0);
    const [items] = useState<Item[]>([
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' }
    ]);

    return (
        <div>
            <button onClick={() => setCount(count + 1)}>
                Count: {count}
            </button>
            {/* MemoizedList won't re-render when count changes */}
            <MemoizedList items={items} />
        </div>
    );
}
```
:::

### useMemo and useCallback

::: code-group
```jsx [JavaScript]
import { useMemo, useCallback, useState } from 'react';

function SearchResults({ items, query }) {
    // Memoize expensive computation
    const filteredItems = useMemo(() => {
        console.log('Filtering items...');
        return items.filter(item =>
            item.name.toLowerCase().includes(query.toLowerCase())
        );
    }, [items, query]);

    // Memoize sorted results
    const sortedItems = useMemo(() => {
        console.log('Sorting items...');
        return [...filteredItems].sort((a, b) =>
            a.name.localeCompare(b.name)
        );
    }, [filteredItems]);

    return (
        <ul>
            {sortedItems.map(item => (
                <li key={item.id}>{item.name}</li>
            ))}
        </ul>
    );
}

function ParentWithCallbacks() {
    const [items, setItems] = useState([]);

    // With useCallback - stable reference
    const handleDelete = useCallback((id) => {
        setItems(prev => prev.filter(item => item.id !== id));
    }, []); // Empty deps because we use functional update

    const handleAdd = useCallback((newItem) => {
        setItems(prev => [...prev, newItem]);
    }, []);

    return (
        <ItemList
            items={items}
            onDelete={handleDelete}
            onAdd={handleAdd}
        />
    );
}
```

```tsx [TypeScript]
import { useMemo, useCallback, useState } from 'react';

interface Item {
    id: number;
    name: string;
}

interface SearchResultsProps {
    items: Item[];
    query: string;
}

interface ItemListProps {
    items: Item[];
    onDelete: (id: number) => void;
    onAdd: (item: Item) => void;
}

function SearchResults({ items, query }: SearchResultsProps): JSX.Element {
    // Memoize expensive computation
    const filteredItems = useMemo((): Item[] => {
        console.log('Filtering items...');
        return items.filter((item: Item) =>
            item.name.toLowerCase().includes(query.toLowerCase())
        );
    }, [items, query]);

    // Memoize sorted results
    const sortedItems = useMemo((): Item[] => {
        console.log('Sorting items...');
        return [...filteredItems].sort((a: Item, b: Item) =>
            a.name.localeCompare(b.name)
        );
    }, [filteredItems]);

    return (
        <ul>
            {sortedItems.map((item: Item) => (
                <li key={item.id}>{item.name}</li>
            ))}
        </ul>
    );
}

function ParentWithCallbacks(): JSX.Element {
    const [items, setItems] = useState<Item[]>([]);

    // With useCallback - stable reference
    const handleDelete = useCallback((id: number): void => {
        setItems((prev: Item[]) => prev.filter((item: Item) => item.id !== id));
    }, []); // Empty deps because we use functional update

    const handleAdd = useCallback((newItem: Item): void => {
        setItems((prev: Item[]) => [...prev, newItem]);
    }, []);

    return (
        <ItemList
            items={items}
            onDelete={handleDelete}
            onAdd={handleAdd}
        />
    );
}
```
:::

### Virtualization for Large Lists

::: code-group
```jsx [JavaScript]
import { useRef, useState } from 'react';

function VirtualizedList({ items, itemHeight = 50, windowHeight = 400 }) {
    const [scrollTop, setScrollTop] = useState(0);
    const containerRef = useRef();

    const totalHeight = items.length * itemHeight;
    const startIndex = Math.floor(scrollTop / itemHeight);
    const endIndex = Math.min(
        startIndex + Math.ceil(windowHeight / itemHeight) + 1,
        items.length
    );

    const visibleItems = items.slice(startIndex, endIndex);
    const offsetY = startIndex * itemHeight;

    const handleScroll = (e) => {
        setScrollTop(e.target.scrollTop);
    };

    return (
        <div
            ref={containerRef}
            onScroll={handleScroll}
            style={{
                height: windowHeight,
                overflow: 'auto',
                position: 'relative'
            }}
        >
            <div style={{ height: totalHeight }}>
                <div
                    style={{
                        position: 'absolute',
                        top: offsetY,
                        width: '100%'
                    }}
                >
                    {visibleItems.map((item) => (
                        <div
                            key={item.id}
                            style={{
                                height: itemHeight,
                                borderBottom: '1px solid #eee',
                                padding: '10px'
                            }}
                        >
                            {item.name}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
```

```tsx [TypeScript]
import { useRef, useState, UIEvent } from 'react';

interface Item {
    id: number;
    name: string;
}

interface VirtualizedListProps {
    items: Item[];
    itemHeight?: number;
    windowHeight?: number;
}

function VirtualizedList({
    items,
    itemHeight = 50,
    windowHeight = 400
}: VirtualizedListProps): JSX.Element {
    const [scrollTop, setScrollTop] = useState<number>(0);
    const containerRef = useRef<HTMLDivElement>(null);

    const totalHeight: number = items.length * itemHeight;
    const startIndex: number = Math.floor(scrollTop / itemHeight);
    const endIndex: number = Math.min(
        startIndex + Math.ceil(windowHeight / itemHeight) + 1,
        items.length
    );

    const visibleItems: Item[] = items.slice(startIndex, endIndex);
    const offsetY: number = startIndex * itemHeight;

    const handleScroll = (e: UIEvent<HTMLDivElement>): void => {
        setScrollTop(e.currentTarget.scrollTop);
    };

    return (
        <div
            ref={containerRef}
            onScroll={handleScroll}
            style={{
                height: windowHeight,
                overflow: 'auto',
                position: 'relative'
            }}
        >
            <div style={{ height: totalHeight }}>
                <div
                    style={{
                        position: 'absolute',
                        top: offsetY,
                        width: '100%'
                    }}
                >
                    {visibleItems.map((item: Item) => (
                        <div
                            key={item.id}
                            style={{
                                height: itemHeight,
                                borderBottom: '1px solid #eee',
                                padding: '10px'
                            }}
                        >
                            {item.name}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
```
:::

## Code Splitting

### React.lazy and Suspense

::: code-group
```jsx [JavaScript]
import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load components
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));
const Analytics = lazy(() => import('./pages/Analytics'));

// Loading fallback component
function LoadingSpinner() {
    return (
        <div className="loading">
            <div className="spinner"></div>
            <p>Loading...</p>
        </div>
    );
}

// App with code splitting
function App() {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/analytics" element={<Analytics />} />
            </Routes>
        </Suspense>
    );
}
```

```tsx [TypeScript]
import { lazy, Suspense, LazyExoticComponent, ComponentType } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load components with type annotations
const Dashboard: LazyExoticComponent<ComponentType> = lazy(
    () => import('./pages/Dashboard')
);
const Settings: LazyExoticComponent<ComponentType> = lazy(
    () => import('./pages/Settings')
);
const Analytics: LazyExoticComponent<ComponentType> = lazy(
    () => import('./pages/Analytics')
);

// Loading fallback component
function LoadingSpinner(): JSX.Element {
    return (
        <div className="loading">
            <div className="spinner"></div>
            <p>Loading...</p>
        </div>
    );
}

// App with code splitting
function App(): JSX.Element {
    return (
        <Suspense fallback={<LoadingSpinner />}>
            <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/analytics" element={<Analytics />} />
            </Routes>
        </Suspense>
    );
}
```
:::

### Named Exports with Lazy

::: code-group
```jsx [JavaScript]
import { lazy } from 'react';

// For components that are not default exports
const Dashboard = lazy(() =>
    import('./pages/Dashboard').then(module => ({
        default: module.Dashboard
    }))
);

// Or create a utility
function lazyNamed(importFn, componentName) {
    return lazy(() =>
        importFn().then(module => ({
            default: module[componentName]
        }))
    );
}

const Settings = lazyNamed(
    () => import('./pages/Settings'),
    'Settings'
);
```

```tsx [TypeScript]
import { lazy, LazyExoticComponent, ComponentType } from 'react';

// For components that are not default exports
const Dashboard: LazyExoticComponent<ComponentType> = lazy(() =>
    import('./pages/Dashboard').then(module => ({
        default: module.Dashboard
    }))
);

// Or create a utility with generics
function lazyNamed<T extends ComponentType<any>>(
    importFn: () => Promise<{ [key: string]: T }>,
    componentName: string
): LazyExoticComponent<T> {
    return lazy(() =>
        importFn().then(module => ({
            default: module[componentName]
        }))
    );
}

const Settings = lazyNamed<ComponentType>(
    () => import('./pages/Settings'),
    'Settings'
);
```
:::

## Compound Components Pattern

::: code-group
```jsx [JavaScript]
import { createContext, useContext, useState } from 'react';

// Context for compound component
const AccordionContext = createContext();

// Main component
function Accordion({ children, defaultOpen = null }) {
    const [openItem, setOpenItem] = useState(defaultOpen);

    const toggle = (id) => {
        setOpenItem(prev => prev === id ? null : id);
    };

    return (
        <AccordionContext.Provider value={{ openItem, toggle }}>
            <div className="accordion">
                {children}
            </div>
        </AccordionContext.Provider>
    );
}

// Item component
function AccordionItem({ children, id }) {
    const { openItem } = useContext(AccordionContext);
    const isOpen = openItem === id;

    return (
        <div className={`accordion-item ${isOpen ? 'open' : ''}`}>
            {children}
        </div>
    );
}

// Header component
function AccordionHeader({ children, id }) {
    const { openItem, toggle } = useContext(AccordionContext);
    const isOpen = openItem === id;

    return (
        <button
            className="accordion-header"
            onClick={() => toggle(id)}
            aria-expanded={isOpen}
        >
            {children}
            <span className="icon">{isOpen ? '-' : '+'}</span>
        </button>
    );
}

// Panel component
function AccordionPanel({ children, id }) {
    const { openItem } = useContext(AccordionContext);
    const isOpen = openItem === id;

    if (!isOpen) return null;

    return (
        <div className="accordion-panel">
            {children}
        </div>
    );
}

// Attach sub-components
Accordion.Item = AccordionItem;
Accordion.Header = AccordionHeader;
Accordion.Panel = AccordionPanel;

// Usage
function FAQ() {
    return (
        <Accordion defaultOpen="q1">
            <Accordion.Item id="q1">
                <Accordion.Header id="q1">
                    What is React?
                </Accordion.Header>
                <Accordion.Panel id="q1">
                    React is a JavaScript library for building user interfaces.
                </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item id="q2">
                <Accordion.Header id="q2">
                    Why use React?
                </Accordion.Header>
                <Accordion.Panel id="q2">
                    React makes it easy to build interactive UIs.
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    );
}
```

```tsx [TypeScript]
import { createContext, useContext, useState, ReactNode } from 'react';

// Type definitions
interface AccordionContextValue {
    openItem: string | null;
    toggle: (id: string) => void;
}

interface AccordionProps {
    children: ReactNode;
    defaultOpen?: string | null;
}

interface AccordionItemProps {
    children: ReactNode;
    id: string;
}

interface AccordionHeaderProps {
    children: ReactNode;
    id: string;
}

interface AccordionPanelProps {
    children: ReactNode;
    id: string;
}

// Context for compound component
const AccordionContext = createContext<AccordionContextValue | null>(null);

// Custom hook for context
function useAccordion(): AccordionContextValue {
    const context = useContext(AccordionContext);
    if (!context) {
        throw new Error('Accordion components must be used within Accordion');
    }
    return context;
}

// Main component
function Accordion({ children, defaultOpen = null }: AccordionProps): JSX.Element {
    const [openItem, setOpenItem] = useState<string | null>(defaultOpen);

    const toggle = (id: string): void => {
        setOpenItem((prev: string | null) => prev === id ? null : id);
    };

    return (
        <AccordionContext.Provider value={{ openItem, toggle }}>
            <div className="accordion">
                {children}
            </div>
        </AccordionContext.Provider>
    );
}

// Item component
function AccordionItem({ children, id }: AccordionItemProps): JSX.Element {
    const { openItem } = useAccordion();
    const isOpen: boolean = openItem === id;

    return (
        <div className={`accordion-item ${isOpen ? 'open' : ''}`}>
            {children}
        </div>
    );
}

// Header component
function AccordionHeader({ children, id }: AccordionHeaderProps): JSX.Element {
    const { openItem, toggle } = useAccordion();
    const isOpen: boolean = openItem === id;

    return (
        <button
            className="accordion-header"
            onClick={() => toggle(id)}
            aria-expanded={isOpen}
        >
            {children}
            <span className="icon">{isOpen ? '-' : '+'}</span>
        </button>
    );
}

// Panel component
function AccordionPanel({ children, id }: AccordionPanelProps): JSX.Element | null {
    const { openItem } = useAccordion();
    const isOpen: boolean = openItem === id;

    if (!isOpen) return null;

    return (
        <div className="accordion-panel">
            {children}
        </div>
    );
}

// Attach sub-components with proper typing
Accordion.Item = AccordionItem;
Accordion.Header = AccordionHeader;
Accordion.Panel = AccordionPanel;

// Usage
function FAQ(): JSX.Element {
    return (
        <Accordion defaultOpen="q1">
            <Accordion.Item id="q1">
                <Accordion.Header id="q1">
                    What is React?
                </Accordion.Header>
                <Accordion.Panel id="q1">
                    React is a JavaScript library for building user interfaces.
                </Accordion.Panel>
            </Accordion.Item>

            <Accordion.Item id="q2">
                <Accordion.Header id="q2">
                    Why use React?
                </Accordion.Header>
                <Accordion.Panel id="q2">
                    React makes it easy to build interactive UIs.
                </Accordion.Panel>
            </Accordion.Item>
        </Accordion>
    );
}
```
:::

## Render Props Pattern

::: code-group
```jsx [JavaScript]
import { useState, useEffect } from 'react';

// Render prop component
function MouseTracker({ render }) {
    const [position, setPosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return render(position);
}

// Usage with render prop
function App() {
    return (
        <MouseTracker
            render={({ x, y }) => (
                <div>
                    <h1>Mouse Position</h1>
                    <p>X: {x}, Y: {y}</p>
                </div>
            )}
        />
    );
}

// Alternative: children as function
function DataFetcher({ url, children }) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch(url)
            .then(res => res.json())
            .then(data => {
                setData(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err);
                setLoading(false);
            });
    }, [url]);

    return children({ data, loading, error });
}

// Usage
function UserList() {
    return (
        <DataFetcher url="/api/users">
            {({ data, loading, error }) => {
                if (loading) return <p>Loading...</p>;
                if (error) return <p>Error: {error.message}</p>;
                return (
                    <ul>
                        {data?.map(user => (
                            <li key={user.id}>{user.name}</li>
                        ))}
                    </ul>
                );
            }}
        </DataFetcher>
    );
}
```

```tsx [TypeScript]
import { useState, useEffect, ReactNode } from 'react';

// Type definitions
interface Position {
    x: number;
    y: number;
}

interface MouseTrackerProps {
    render: (position: Position) => ReactNode;
}

interface DataFetcherProps<T> {
    url: string;
    children: (state: {
        data: T | null;
        loading: boolean;
        error: Error | null;
    }) => ReactNode;
}

interface User {
    id: number;
    name: string;
}

// Render prop component
function MouseTracker({ render }: MouseTrackerProps): JSX.Element {
    const [position, setPosition] = useState<Position>({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent): void => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return <>{render(position)}</>;
}

// Usage with render prop
function App(): JSX.Element {
    return (
        <MouseTracker
            render={({ x, y }: Position) => (
                <div>
                    <h1>Mouse Position</h1>
                    <p>X: {x}, Y: {y}</p>
                </div>
            )}
        />
    );
}

// Generic DataFetcher: children as function
function DataFetcher<T>({ url, children }: DataFetcherProps<T>): JSX.Element {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        fetch(url)
            .then((res: Response) => res.json())
            .then((data: T) => {
                setData(data);
                setLoading(false);
            })
            .catch((err: Error) => {
                setError(err);
                setLoading(false);
            });
    }, [url]);

    return <>{children({ data, loading, error })}</>;
}

// Usage
function UserList(): JSX.Element {
    return (
        <DataFetcher<User[]> url="/api/users">
            {({ data, loading, error }) => {
                if (loading) return <p>Loading...</p>;
                if (error) return <p>Error: {error.message}</p>;
                return (
                    <ul>
                        {data?.map((user: User) => (
                            <li key={user.id}>{user.name}</li>
                        ))}
                    </ul>
                );
            }}
        </DataFetcher>
    );
}
```
:::

## Higher-Order Components (HOC)

::: code-group
```jsx [JavaScript]
import { Navigate } from 'react-router-dom';

// HOC for adding loading state
function withLoading(WrappedComponent) {
    return function WithLoadingComponent({ isLoading, ...props }) {
        if (isLoading) {
            return <div className="loading">Loading...</div>;
        }
        return <WrappedComponent {...props} />;
    };
}

// HOC for authentication
function withAuth(WrappedComponent) {
    return function WithAuthComponent(props) {
        const { isAuthenticated, user } = useAuth();

        if (!isAuthenticated) {
            return <Navigate to="/login" />;
        }

        return <WrappedComponent {...props} user={user} />;
    };
}

// Usage
const UserListWithLoading = withLoading(UserList);
const ProtectedDashboard = withAuth(Dashboard);
```

```tsx [TypeScript]
import { ComponentType } from 'react';
import { Navigate } from 'react-router-dom';

// Type definitions
interface User {
    id: string;
    name: string;
}

interface WithLoadingProps {
    isLoading: boolean;
}

interface WithAuthProps {
    user: User;
}

// HOC for adding loading state
function withLoading<P extends object>(
    WrappedComponent: ComponentType<P>
): ComponentType<P & WithLoadingProps> {
    return function WithLoadingComponent({
        isLoading,
        ...props
    }: P & WithLoadingProps): JSX.Element {
        if (isLoading) {
            return <div className="loading">Loading...</div>;
        }
        return <WrappedComponent {...(props as P)} />;
    };
}

// HOC for authentication
function withAuth<P extends object>(
    WrappedComponent: ComponentType<P & WithAuthProps>
): ComponentType<Omit<P, keyof WithAuthProps>> {
    return function WithAuthComponent(
        props: Omit<P, keyof WithAuthProps>
    ): JSX.Element {
        const { isAuthenticated, user } = useAuth();

        if (!isAuthenticated) {
            return <Navigate to="/login" />;
        }

        return <WrappedComponent {...(props as P)} user={user} />;
    };
}

// Usage
interface UserListProps {
    title: string;
}

interface DashboardProps {
    user: User;
}

const UserListWithLoading = withLoading<UserListProps>(UserList);
const ProtectedDashboard = withAuth<DashboardProps>(Dashboard);
```
:::

## Error Boundaries

::: code-group
```jsx [JavaScript]
import { Component } from 'react';

class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        // Log to error reporting service
        console.error('Error:', error);
        console.error('Error Info:', errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                this.props.fallback || (
                    <div className="error-boundary">
                        <h2>Something went wrong</h2>
                        <button onClick={() => this.setState({ hasError: false })}>
                            Try again
                        </button>
                    </div>
                )
            );
        }

        return this.props.children;
    }
}

// Usage
function App() {
    return (
        <ErrorBoundary fallback={<ErrorPage />}>
            <Header />
            <ErrorBoundary fallback={<p>Widget failed to load</p>}>
                <ComplexWidget />
            </ErrorBoundary>
            <Footer />
        </ErrorBoundary>
    );
}
```

```tsx [TypeScript]
import { Component, ReactNode, ErrorInfo } from 'react';

// Type definitions
interface ErrorBoundaryProps {
    children: ReactNode;
    fallback?: ReactNode;
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    constructor(props: ErrorBoundaryProps) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): ErrorBoundaryState {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
        // Log to error reporting service
        console.error('Error:', error);
        console.error('Error Info:', errorInfo);
    }

    render(): ReactNode {
        if (this.state.hasError) {
            return (
                this.props.fallback || (
                    <div className="error-boundary">
                        <h2>Something went wrong</h2>
                        <button onClick={() => this.setState({ hasError: false, error: null })}>
                            Try again
                        </button>
                    </div>
                )
            );
        }

        return this.props.children;
    }
}

// Usage
function App(): JSX.Element {
    return (
        <ErrorBoundary fallback={<ErrorPage />}>
            <Header />
            <ErrorBoundary fallback={<p>Widget failed to load</p>}>
                <ComplexWidget />
            </ErrorBoundary>
            <Footer />
        </ErrorBoundary>
    );
}
```
:::

## Custom Hook with useReducer

::: code-group
```jsx [JavaScript]
import { useReducer, useCallback } from 'react';

function useShoppingCart() {
    const initialState = {
        items: [],
        total: 0,
        itemCount: 0
    };

    function cartReducer(state, action) {
        switch (action.type) {
            case 'ADD_ITEM': {
                const existingItem = state.items.find(
                    item => item.id === action.payload.id
                );

                let newItems;
                if (existingItem) {
                    newItems = state.items.map(item =>
                        item.id === action.payload.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                } else {
                    newItems = [...state.items, { ...action.payload, quantity: 1 }];
                }

                return {
                    ...state,
                    items: newItems,
                    total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
                    itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0)
                };
            }

            case 'REMOVE_ITEM': {
                const newItems = state.items.filter(
                    item => item.id !== action.payload
                );
                return {
                    ...state,
                    items: newItems,
                    total: newItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
                    itemCount: newItems.reduce((sum, item) => sum + item.quantity, 0)
                };
            }

            case 'CLEAR_CART':
                return initialState;

            default:
                return state;
        }
    }

    const [state, dispatch] = useReducer(cartReducer, initialState);

    const addItem = useCallback((item) => {
        dispatch({ type: 'ADD_ITEM', payload: item });
    }, []);

    const removeItem = useCallback((id) => {
        dispatch({ type: 'REMOVE_ITEM', payload: id });
    }, []);

    const clearCart = useCallback(() => {
        dispatch({ type: 'CLEAR_CART' });
    }, []);

    return {
        ...state,
        addItem,
        removeItem,
        clearCart
    };
}
```

```tsx [TypeScript]
import { useReducer, useCallback } from 'react';

// Type definitions
interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

interface CartState {
    items: CartItem[];
    total: number;
    itemCount: number;
}

type CartAction =
    | { type: 'ADD_ITEM'; payload: Omit<CartItem, 'quantity'> }
    | { type: 'REMOVE_ITEM'; payload: number }
    | { type: 'CLEAR_CART' };

interface UseShoppingCartResult extends CartState {
    addItem: (item: Omit<CartItem, 'quantity'>) => void;
    removeItem: (id: number) => void;
    clearCart: () => void;
}

function useShoppingCart(): UseShoppingCartResult {
    const initialState: CartState = {
        items: [],
        total: 0,
        itemCount: 0
    };

    function cartReducer(state: CartState, action: CartAction): CartState {
        switch (action.type) {
            case 'ADD_ITEM': {
                const existingItem = state.items.find(
                    (item: CartItem) => item.id === action.payload.id
                );

                let newItems: CartItem[];
                if (existingItem) {
                    newItems = state.items.map((item: CartItem) =>
                        item.id === action.payload.id
                            ? { ...item, quantity: item.quantity + 1 }
                            : item
                    );
                } else {
                    newItems = [...state.items, { ...action.payload, quantity: 1 }];
                }

                return {
                    ...state,
                    items: newItems,
                    total: newItems.reduce(
                        (sum: number, item: CartItem) => sum + item.price * item.quantity,
                        0
                    ),
                    itemCount: newItems.reduce(
                        (sum: number, item: CartItem) => sum + item.quantity,
                        0
                    )
                };
            }

            case 'REMOVE_ITEM': {
                const newItems = state.items.filter(
                    (item: CartItem) => item.id !== action.payload
                );
                return {
                    ...state,
                    items: newItems,
                    total: newItems.reduce(
                        (sum: number, item: CartItem) => sum + item.price * item.quantity,
                        0
                    ),
                    itemCount: newItems.reduce(
                        (sum: number, item: CartItem) => sum + item.quantity,
                        0
                    )
                };
            }

            case 'CLEAR_CART':
                return initialState;

            default:
                return state;
        }
    }

    const [state, dispatch] = useReducer(cartReducer, initialState);

    const addItem = useCallback((item: Omit<CartItem, 'quantity'>): void => {
        dispatch({ type: 'ADD_ITEM', payload: item });
    }, []);

    const removeItem = useCallback((id: number): void => {
        dispatch({ type: 'REMOVE_ITEM', payload: id });
    }, []);

    const clearCart = useCallback((): void => {
        dispatch({ type: 'CLEAR_CART' });
    }, []);

    return {
        ...state,
        addItem,
        removeItem,
        clearCart
    };
}
```
:::

## Portal for Modals

::: code-group
```jsx [JavaScript]
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

function Modal({ isOpen, onClose, children }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content"
                onClick={e => e.stopPropagation()}
            >
                <button className="modal-close" onClick={onClose}>
                    x
                </button>
                {children}
            </div>
        </div>,
        document.body
    );
}

// Usage
function App() {
    const [showModal, setShowModal] = useState(false);

    return (
        <div>
            <button onClick={() => setShowModal(true)}>
                Open Modal
            </button>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <h2>Modal Title</h2>
                <p>Modal content goes here.</p>
            </Modal>
        </div>
    );
}
```

```tsx [TypeScript]
import { createPortal } from 'react-dom';
import { useEffect, useState, ReactNode, MouseEvent } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

function Modal({ isOpen, onClose, children }: ModalProps): JSX.Element | null {
    const [mounted, setMounted] = useState<boolean>(false);

    useEffect(() => {
        setMounted(true);

        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    if (!mounted || !isOpen) return null;

    return createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="modal-content"
                onClick={(e: MouseEvent<HTMLDivElement>) => e.stopPropagation()}
            >
                <button className="modal-close" onClick={onClose}>
                    x
                </button>
                {children}
            </div>
        </div>,
        document.body
    );
}

// Usage
function App(): JSX.Element {
    const [showModal, setShowModal] = useState<boolean>(false);

    return (
        <div>
            <button onClick={() => setShowModal(true)}>
                Open Modal
            </button>

            <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
                <h2>Modal Title</h2>
                <p>Modal content goes here.</p>
            </Modal>
        </div>
    );
}
```
:::

## Summary

| Pattern | Use Case | TypeScript Benefit |
|---------|----------|-------------------|
| **Context API** | Global state, theming, auth | Type-safe context values |
| **React.memo** | Prevent re-renders of pure components | Typed comparison functions |
| **useMemo/useCallback** | Memoize values and callbacks | Return type inference |
| **Code Splitting** | Reduce initial bundle size | Typed lazy imports |
| **Compound Components** | Related components that share state | Typed context and props |
| **Render Props** | Share logic between components | Generic render functions |
| **HOCs** | Cross-cutting concerns | Generic component wrapping |
| **Error Boundaries** | Graceful error handling | Typed error states |
| **Portals** | Render outside DOM hierarchy | Same type safety |

## Congratulations!

You've completed the React tutorial series! You now have a solid foundation in:

- JSX and component basics (JavaScript and TypeScript)
- State management with hooks
- Event handling and forms
- Routing and navigation
- Data fetching patterns
- Advanced optimization techniques

Keep practicing and building projects to solidify your knowledge!

---

[Back to React Overview →](/guide/react/)
