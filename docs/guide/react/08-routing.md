# React Router

React Router enables navigation between different views in your single-page application. In this tutorial, you'll learn how to add routing, handle navigation, and work with URL parameters.

## Installation

```bash
npm install react-router-dom
```

For TypeScript, the types are included in the package.

## Basic Setup

::: code-group
```jsx [JavaScript]
// main.jsx
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

createRoot(document.getElementById('root')).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);
```

```tsx [TypeScript]
// main.tsx
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
);
```
:::

## How React Router Works

```
┌─────────────────────────────────────────────────────────────┐
│                    React Router Flow                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   URL: /products/123                                        │
│            ↓                                                │
│   BrowserRouter (listens to URL changes)                   │
│            ↓                                                │
│   Routes (matches URL to components)                        │
│            ↓                                                │
│   ┌─────────────────────────────────────┐                  │
│   │ Route path="/products/:id"           │                  │
│   │     ↓                                │                  │
│   │ <ProductDetail />  ← renders this   │                  │
│   └─────────────────────────────────────┘                  │
│                                                             │
│   Navigation:                                               │
│   <Link to="/products/123"> → Updates URL                  │
│   navigate('/products/123') → Programmatic navigation      │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Defining Routes

::: code-group
```jsx [JavaScript]
// App.jsx
import { Routes, Route } from 'react-router-dom';

// Page components
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import NotFound from './pages/NotFound';

function App() {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
}

export default App;
```

```tsx [TypeScript]
// App.tsx
import { Routes, Route } from 'react-router-dom';

// Page components
import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import NotFound from './pages/NotFound';

function App(): JSX.Element {
    return (
        <div>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </div>
    );
}

export default App;
```
:::

## Navigation

### Link Component

::: code-group
```jsx [JavaScript]
import { Link } from 'react-router-dom';

function Navigation() {
    return (
        <nav>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/products">Products</Link>
            <Link to="/contact">Contact</Link>
        </nav>
    );
}
```

```tsx [TypeScript]
import { Link } from 'react-router-dom';

function Navigation(): JSX.Element {
    return (
        <nav>
            <Link to="/">Home</Link>
            <Link to="/about">About</Link>
            <Link to="/products">Products</Link>
            <Link to="/contact">Contact</Link>
        </nav>
    );
}
```
:::

### NavLink with Active Styles

::: code-group
```jsx [JavaScript]
import { NavLink } from 'react-router-dom';

function Navigation() {
    return (
        <nav>
            <NavLink
                to="/"
                className={({ isActive }) =>
                    isActive ? 'nav-link active' : 'nav-link'
                }
            >
                Home
            </NavLink>

            <NavLink
                to="/about"
                style={({ isActive }) => ({
                    color: isActive ? 'red' : 'black',
                    fontWeight: isActive ? 'bold' : 'normal'
                })}
            >
                About
            </NavLink>

            {/* With end prop for exact match */}
            <NavLink to="/products" end>
                Products
            </NavLink>
        </nav>
    );
}
```

```tsx [TypeScript]
import { NavLink } from 'react-router-dom';
import { CSSProperties } from 'react';

function Navigation(): JSX.Element {
    return (
        <nav>
            <NavLink
                to="/"
                className={({ isActive }: { isActive: boolean }): string =>
                    isActive ? 'nav-link active' : 'nav-link'
                }
            >
                Home
            </NavLink>

            <NavLink
                to="/about"
                style={({ isActive }: { isActive: boolean }): CSSProperties => ({
                    color: isActive ? 'red' : 'black',
                    fontWeight: isActive ? 'bold' : 'normal'
                })}
            >
                About
            </NavLink>

            {/* With end prop for exact match */}
            <NavLink to="/products" end>
                Products
            </NavLink>
        </nav>
    );
}
```
:::

### Programmatic Navigation

::: code-group
```jsx [JavaScript]
import { useNavigate } from 'react-router-dom';

function LoginForm() {
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        // ... login logic

        // Navigate after login
        navigate('/dashboard');

        // With options
        navigate('/dashboard', { replace: true }); // Replace history entry
        navigate(-1); // Go back
        navigate(1);  // Go forward
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* form fields */}
            <button type="submit">Login</button>
        </form>
    );
}
```

```tsx [TypeScript]
import { useNavigate, NavigateFunction } from 'react-router-dom';
import { FormEvent } from 'react';

function LoginForm(): JSX.Element {
    const navigate: NavigateFunction = useNavigate();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        // ... login logic

        // Navigate after login
        navigate('/dashboard');

        // With options
        navigate('/dashboard', { replace: true }); // Replace history entry
        navigate(-1); // Go back
        navigate(1);  // Go forward
    };

    return (
        <form onSubmit={handleSubmit}>
            {/* form fields */}
            <button type="submit">Login</button>
        </form>
    );
}
```
:::

## URL Parameters

### Dynamic Routes

::: code-group
```jsx [JavaScript]
import { useParams } from 'react-router-dom';

// Route definition
// <Route path="/products/:id" element={<ProductDetail />} />
// <Route path="/users/:userId/posts/:postId" element={<Post />} />

// Usage
function ProductDetail() {
    const { id } = useParams();

    return <h1>Product ID: {id}</h1>;
}

function Post() {
    const { userId, postId } = useParams();

    return (
        <div>
            <p>User: {userId}</p>
            <p>Post: {postId}</p>
        </div>
    );
}
```

```tsx [TypeScript]
import { useParams, Params } from 'react-router-dom';

// Define param types
interface ProductParams extends Params {
    id: string;
}

interface PostParams extends Params {
    userId: string;
    postId: string;
}

// Usage
function ProductDetail(): JSX.Element {
    const { id } = useParams<ProductParams>();

    return <h1>Product ID: {id}</h1>;
}

function Post(): JSX.Element {
    const { userId, postId } = useParams<PostParams>();

    return (
        <div>
            <p>User: {userId}</p>
            <p>Post: {postId}</p>
        </div>
    );
}
```
:::

### Complete Example with Data Fetching

::: code-group
```jsx [JavaScript]
import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';

function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await fetch(`/api/products/${id}`);

                if (!response.ok) {
                    throw new Error('Product not found');
                }

                const data = await response.json();
                setProduct(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]); // Re-fetch when ID changes

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!product) return <p>Product not found</p>;

    return (
        <div>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
        </div>
    );
}
```

```tsx [TypeScript]
import { useParams, Params } from 'react-router-dom';
import { useState, useEffect } from 'react';

interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
}

interface ProductParams extends Params {
    id: string;
}

function ProductDetail(): JSX.Element {
    const { id } = useParams<ProductParams>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProduct = async (): Promise<void> => {
            try {
                setLoading(true);
                const response = await fetch(`/api/products/${id}`);

                if (!response.ok) {
                    throw new Error('Product not found');
                }

                const data: Product = await response.json();
                setProduct(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]); // Re-fetch when ID changes

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;
    if (!product) return <p>Product not found</p>;

    return (
        <div>
            <h1>{product.name}</h1>
            <p>{product.description}</p>
            <p>Price: ${product.price}</p>
        </div>
    );
}
```
:::

## Query Parameters

::: code-group
```jsx [JavaScript]
import { useSearchParams, Link } from 'react-router-dom';

function ProductList() {
    const [searchParams, setSearchParams] = useSearchParams();

    // Read query params
    const category = searchParams.get('category') || 'all';
    const sort = searchParams.get('sort') || 'name';
    const page = parseInt(searchParams.get('page')) || 1;

    // Update query params
    const handleCategoryChange = (newCategory) => {
        setSearchParams({
            category: newCategory,
            sort,
            page: '1' // Reset to page 1
        });
    };

    const handleSortChange = (newSort) => {
        setSearchParams(prev => {
            prev.set('sort', newSort);
            return prev;
        });
    };

    return (
        <div>
            {/* Filter controls */}
            <select
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
            >
                <option value="all">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
            </select>

            <select
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
            >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
            </select>

            {/* Links with query params */}
            <Link to="?category=electronics&sort=price">
                Electronics by Price
            </Link>

            {/* Pagination */}
            <Link to={`?category=${category}&sort=${sort}&page=${page - 1}`}>
                Previous
            </Link>
            <span>Page {page}</span>
            <Link to={`?category=${category}&sort=${sort}&page=${page + 1}`}>
                Next
            </Link>
        </div>
    );
}
```

```tsx [TypeScript]
import { useSearchParams, Link, SetURLSearchParams } from 'react-router-dom';
import { ChangeEvent } from 'react';

function ProductList(): JSX.Element {
    const [searchParams, setSearchParams]: [URLSearchParams, SetURLSearchParams] =
        useSearchParams();

    // Read query params
    const category: string = searchParams.get('category') || 'all';
    const sort: string = searchParams.get('sort') || 'name';
    const page: number = parseInt(searchParams.get('page') || '1');

    // Update query params
    const handleCategoryChange = (newCategory: string): void => {
        setSearchParams({
            category: newCategory,
            sort,
            page: '1' // Reset to page 1
        });
    };

    const handleSortChange = (newSort: string): void => {
        setSearchParams((prev: URLSearchParams) => {
            prev.set('sort', newSort);
            return prev;
        });
    };

    return (
        <div>
            {/* Filter controls */}
            <select
                value={category}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    handleCategoryChange(e.target.value)
                }
            >
                <option value="all">All Categories</option>
                <option value="electronics">Electronics</option>
                <option value="clothing">Clothing</option>
            </select>

            <select
                value={sort}
                onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                    handleSortChange(e.target.value)
                }
            >
                <option value="name">Sort by Name</option>
                <option value="price">Sort by Price</option>
            </select>

            {/* Links with query params */}
            <Link to="?category=electronics&sort=price">
                Electronics by Price
            </Link>

            {/* Pagination */}
            <Link to={`?category=${category}&sort=${sort}&page=${page - 1}`}>
                Previous
            </Link>
            <span>Page {page}</span>
            <Link to={`?category=${category}&sort=${sort}&page=${page + 1}`}>
                Next
            </Link>
        </div>
    );
}
```
:::

## Nested Routes

::: code-group
```jsx [JavaScript]
// App.jsx
import { Routes, Route, Outlet, Link } from 'react-router-dom';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="dashboard" element={<Dashboard />}>
                    <Route index element={<DashboardHome />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="settings" element={<Settings />} />
                </Route>
            </Route>
        </Routes>
    );
}

// Layout.jsx - Parent component
function Layout() {
    return (
        <div>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/dashboard">Dashboard</Link>
            </nav>

            <main>
                <Outlet /> {/* Child routes render here */}
            </main>

            <footer>© 2024 My App</footer>
        </div>
    );
}

// Dashboard.jsx - Nested layout
function Dashboard() {
    return (
        <div className="dashboard">
            <aside>
                <Link to="/dashboard">Overview</Link>
                <Link to="/dashboard/profile">Profile</Link>
                <Link to="/dashboard/settings">Settings</Link>
            </aside>

            <div className="dashboard-content">
                <Outlet /> {/* Nested routes render here */}
            </div>
        </div>
    );
}
```

```tsx [TypeScript]
// App.tsx
import { Routes, Route, Outlet, Link } from 'react-router-dom';

function App(): JSX.Element {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="dashboard" element={<Dashboard />}>
                    <Route index element={<DashboardHome />} />
                    <Route path="profile" element={<Profile />} />
                    <Route path="settings" element={<Settings />} />
                </Route>
            </Route>
        </Routes>
    );
}

// Layout.tsx - Parent component
function Layout(): JSX.Element {
    return (
        <div>
            <nav>
                <Link to="/">Home</Link>
                <Link to="/about">About</Link>
                <Link to="/dashboard">Dashboard</Link>
            </nav>

            <main>
                <Outlet /> {/* Child routes render here */}
            </main>

            <footer>© 2024 My App</footer>
        </div>
    );
}

// Dashboard.tsx - Nested layout
function Dashboard(): JSX.Element {
    return (
        <div className="dashboard">
            <aside>
                <Link to="/dashboard">Overview</Link>
                <Link to="/dashboard/profile">Profile</Link>
                <Link to="/dashboard/settings">Settings</Link>
            </aside>

            <div className="dashboard-content">
                <Outlet /> {/* Nested routes render here */}
            </div>
        </div>
    );
}
```
:::

## Protected Routes

::: code-group
```jsx [JavaScript]
import { Navigate, useLocation } from 'react-router-dom';

// Auth context (simplified)
function useAuth() {
    // In real app, this would come from context
    return {
        user: null, // or user object
        isAuthenticated: false
    };
}

// Protected route wrapper
function ProtectedRoute({ children }) {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect to login, saving the attempted URL
        return (
            <Navigate
                to="/login"
                state={{ from: location }}
                replace
            />
        );
    }

    return children;
}

// Usage in routes
function App() {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            {/* Protected routes */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

// Login component - redirect back after login
function Login() {
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogin = async () => {
        // ... login logic

        // Redirect to original destination or dashboard
        const from = location.state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
    };

    return (
        <form onSubmit={handleLogin}>
            {/* login form */}
        </form>
    );
}
```

```tsx [TypeScript]
import {
    Navigate,
    useLocation,
    useNavigate,
    Location,
    NavigateFunction
} from 'react-router-dom';
import { ReactNode, FormEvent } from 'react';

// Auth types
interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthContext {
    user: User | null;
    isAuthenticated: boolean;
}

// Auth context (simplified)
function useAuth(): AuthContext {
    // In real app, this would come from context
    return {
        user: null, // or user object
        isAuthenticated: false
    };
}

// Props for protected route
interface ProtectedRouteProps {
    children: ReactNode;
}

// Location state type
interface LocationState {
    from?: Location;
}

// Protected route wrapper
function ProtectedRoute({ children }: ProtectedRouteProps): JSX.Element {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        // Redirect to login, saving the attempted URL
        return (
            <Navigate
                to="/login"
                state={{ from: location } as LocationState}
                replace
            />
        );
    }

    return <>{children}</>;
}

// Usage in routes
function App(): JSX.Element {
    return (
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            {/* Protected routes */}
            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />

            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}

// Login component - redirect back after login
function Login(): JSX.Element {
    const navigate: NavigateFunction = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState | null;

    const handleLogin = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();
        // ... login logic

        // Redirect to original destination or dashboard
        const from: string = state?.from?.pathname || '/dashboard';
        navigate(from, { replace: true });
    };

    return (
        <form onSubmit={handleLogin}>
            {/* login form */}
        </form>
    );
}
```
:::

## Route Guards with Roles

::: code-group
```jsx [JavaScript]
function RoleProtectedRoute({ children, allowedRoles }) {
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
}

// Usage
<Route
    path="/admin"
    element={
        <RoleProtectedRoute allowedRoles={['admin']}>
            <AdminPanel />
        </RoleProtectedRoute>
    }
/>

<Route
    path="/editor"
    element={
        <RoleProtectedRoute allowedRoles={['admin', 'editor']}>
            <EditorDashboard />
        </RoleProtectedRoute>
    }
/>
```

```tsx [TypeScript]
import { Navigate, useLocation, Location } from 'react-router-dom';
import { ReactNode } from 'react';

type UserRole = 'admin' | 'editor' | 'user';

interface User {
    id: string;
    name: string;
    role: UserRole;
}

interface AuthContext {
    user: User | null;
    isAuthenticated: boolean;
}

interface RoleProtectedRouteProps {
    children: ReactNode;
    allowedRoles: UserRole[];
}

function RoleProtectedRoute({
    children,
    allowedRoles
}: RoleProtectedRouteProps): JSX.Element {
    const { user, isAuthenticated } = useAuth();
    const location: Location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <>{children}</>;
}

// Usage
<Route
    path="/admin"
    element={
        <RoleProtectedRoute allowedRoles={['admin']}>
            <AdminPanel />
        </RoleProtectedRoute>
    }
/>

<Route
    path="/editor"
    element={
        <RoleProtectedRoute allowedRoles={['admin', 'editor']}>
            <EditorDashboard />
        </RoleProtectedRoute>
    }
/>
```
:::

## Loading States and Error Handling

::: code-group
```jsx [JavaScript]
import { useNavigation, useRouteError, Link, Outlet } from 'react-router-dom';

// Global loading indicator
function Layout() {
    const navigation = useNavigation();

    return (
        <div>
            {navigation.state === 'loading' && (
                <div className="loading-bar">Loading...</div>
            )}
            <Outlet />
        </div>
    );
}

// Error boundary for routes
function ErrorBoundary() {
    const error = useRouteError();

    return (
        <div className="error-page">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error occurred.</p>
            <p>{error.statusText || error.message}</p>
            <Link to="/">Go to Home</Link>
        </div>
    );
}

// Usage
<Route
    path="/"
    element={<Layout />}
    errorElement={<ErrorBoundary />}
>
    {/* child routes */}
</Route>
```

```tsx [TypeScript]
import {
    useNavigation,
    useRouteError,
    Link,
    Outlet,
    Navigation
} from 'react-router-dom';

interface RouteError {
    statusText?: string;
    message?: string;
}

// Global loading indicator
function Layout(): JSX.Element {
    const navigation: Navigation = useNavigation();

    return (
        <div>
            {navigation.state === 'loading' && (
                <div className="loading-bar">Loading...</div>
            )}
            <Outlet />
        </div>
    );
}

// Error boundary for routes
function ErrorBoundary(): JSX.Element {
    const error = useRouteError() as RouteError;

    return (
        <div className="error-page">
            <h1>Oops!</h1>
            <p>Sorry, an unexpected error occurred.</p>
            <p>{error.statusText || error.message}</p>
            <Link to="/">Go to Home</Link>
        </div>
    );
}

// Usage
<Route
    path="/"
    element={<Layout />}
    errorElement={<ErrorBoundary />}
>
    {/* child routes */}
</Route>
```
:::

## Location and State

::: code-group
```jsx [JavaScript]
import { useLocation, Link, useNavigate } from 'react-router-dom';

function CurrentLocation() {
    const location = useLocation();

    console.log(location.pathname);  // "/products"
    console.log(location.search);    // "?sort=price"
    console.log(location.hash);      // "#section1"
    console.log(location.state);     // Any passed state

    return <p>Current path: {location.pathname}</p>;
}

// Passing state through navigation
function ProductCard({ product }) {
    return (
        <Link
            to={`/products/${product.id}`}
            state={{ fromSearch: true, product }}
        >
            {product.name}
        </Link>
    );
}

// Receiving state
function ProductDetail() {
    const location = useLocation();
    const { fromSearch, product } = location.state || {};

    return (
        <div>
            {fromSearch && <p>You came from search</p>}
            {product && <p>Pre-loaded: {product.name}</p>}
        </div>
    );
}
```

```tsx [TypeScript]
import { useLocation, Link, Location } from 'react-router-dom';

function CurrentLocation(): JSX.Element {
    const location: Location = useLocation();

    console.log(location.pathname);  // "/products"
    console.log(location.search);    // "?sort=price"
    console.log(location.hash);      // "#section1"
    console.log(location.state);     // Any passed state

    return <p>Current path: {location.pathname}</p>;
}

// Product interface
interface Product {
    id: string;
    name: string;
    price: number;
}

// Props for ProductCard
interface ProductCardProps {
    product: Product;
}

// State passed through navigation
interface ProductLocationState {
    fromSearch: boolean;
    product: Product;
}

// Passing state through navigation
function ProductCard({ product }: ProductCardProps): JSX.Element {
    const state: ProductLocationState = {
        fromSearch: true,
        product
    };

    return (
        <Link
            to={`/products/${product.id}`}
            state={state}
        >
            {product.name}
        </Link>
    );
}

// Receiving state
function ProductDetail(): JSX.Element {
    const location = useLocation();
    const state = location.state as ProductLocationState | null;

    return (
        <div>
            {state?.fromSearch && <p>You came from search</p>}
            {state?.product && <p>Pre-loaded: {state.product.name}</p>}
        </div>
    );
}
```
:::

## Practical Example: E-commerce Routes

::: code-group
```jsx [JavaScript]
// App.jsx
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* Public routes */}
                <Route index element={<Home />} />
                <Route path="products" element={<Products />} />
                <Route path="products/:category" element={<Products />} />
                <Route path="product/:id" element={<ProductDetail />} />
                <Route path="cart" element={<Cart />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />

                {/* Protected routes */}
                <Route
                    path="checkout"
                    element={
                        <ProtectedRoute>
                            <Checkout />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Orders />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="orders/:id" element={<OrderDetail />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}
```

```tsx [TypeScript]
// App.tsx
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Orders from './pages/Orders';
import OrderDetail from './pages/OrderDetail';
import NotFound from './pages/NotFound';
import ProtectedRoute from './components/ProtectedRoute';

function App(): JSX.Element {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                {/* Public routes */}
                <Route index element={<Home />} />
                <Route path="products" element={<Products />} />
                <Route path="products/:category" element={<Products />} />
                <Route path="product/:id" element={<ProductDetail />} />
                <Route path="cart" element={<Cart />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />

                {/* Protected routes */}
                <Route
                    path="checkout"
                    element={
                        <ProtectedRoute>
                            <Checkout />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<Orders />} />
                    <Route path="orders" element={<Orders />} />
                    <Route path="orders/:id" element={<OrderDetail />} />
                </Route>

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
            </Route>
        </Routes>
    );
}
```
:::

::: code-group
```jsx [JavaScript]
// components/Layout.jsx
import { Outlet, Link, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

function Layout() {
    const { user, logout } = useAuth();

    return (
        <div className="app">
            <header>
                <Link to="/" className="logo">MyShop</Link>

                <nav>
                    <NavLink to="/products">Products</NavLink>
                    <NavLink to="/products/electronics">Electronics</NavLink>
                    <NavLink to="/products/clothing">Clothing</NavLink>
                </nav>

                <div className="header-actions">
                    <Link to="/cart">Cart</Link>
                    {user ? (
                        <>
                            <Link to="/dashboard">My Account</Link>
                            <button onClick={logout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </div>
            </header>

            <main>
                <Outlet />
            </main>

            <footer>
                <p>© 2024 MyShop</p>
            </footer>
        </div>
    );
}
```

```tsx [TypeScript]
// components/Layout.tsx
import { Outlet, Link, NavLink } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface User {
    id: string;
    name: string;
    email: string;
}

interface AuthHook {
    user: User | null;
    logout: () => void;
}

function Layout(): JSX.Element {
    const { user, logout }: AuthHook = useAuth();

    return (
        <div className="app">
            <header>
                <Link to="/" className="logo">MyShop</Link>

                <nav>
                    <NavLink to="/products">Products</NavLink>
                    <NavLink to="/products/electronics">Electronics</NavLink>
                    <NavLink to="/products/clothing">Clothing</NavLink>
                </nav>

                <div className="header-actions">
                    <Link to="/cart">Cart</Link>
                    {user ? (
                        <>
                            <Link to="/dashboard">My Account</Link>
                            <button onClick={logout}>Logout</button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </div>
            </header>

            <main>
                <Outlet />
            </main>

            <footer>
                <p>© 2024 MyShop</p>
            </footer>
        </div>
    );
}
```
:::

## Routing Hooks Summary

| Hook | Purpose | TypeScript Type |
|------|---------|-----------------|
| `useNavigate` | Programmatic navigation | `NavigateFunction` |
| `useParams` | Access URL parameters | `Params<ParamKey>` |
| `useSearchParams` | Access/modify query params | `[URLSearchParams, SetURLSearchParams]` |
| `useLocation` | Access current location | `Location` |
| `useMatch` | Check if path matches | `PathMatch<ParamKey> \| null` |
| `useNavigation` | Navigation state (loading) | `Navigation` |
| `useRouteError` | Access route errors | `unknown` |

## What's Next?

In the next chapter, we'll learn about [Data Fetching](/guide/react/09-api) - how to fetch data from APIs and manage server state in React.

---

[Next: Data Fetching →](/guide/react/09-api)
