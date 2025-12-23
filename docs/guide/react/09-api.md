# Data Fetching

Modern React applications need to fetch data from APIs. In this tutorial, you'll learn different approaches to data fetching, from basic fetch to custom hooks and state management.

## Fetching Data with useEffect

### Basic Fetch Pattern

::: code-group
```jsx [JavaScript]
import { useState, useEffect } from 'react';

function UserList() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                return response.json();
            })
            .then(data => {
                setUsers(data);
                setLoading(false);
            })
            .catch(err => {
                setError(err.message);
                setLoading(false);
            });
    }, []); // Empty array = run once on mount

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <ul>
            {users.map(user => (
                <li key={user.id}>{user.name}</li>
            ))}
        </ul>
    );
}
```

```tsx [TypeScript]
import { useState, useEffect } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
}

function UserList(): JSX.Element {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch('https://jsonplaceholder.typicode.com/users')
            .then((response: Response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch users');
                }
                return response.json();
            })
            .then((data: User[]) => {
                setUsers(data);
                setLoading(false);
            })
            .catch((err: Error) => {
                setError(err.message);
                setLoading(false);
            });
    }, []); // Empty array = run once on mount

    if (loading) return <p>Loading...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <ul>
            {users.map((user: User) => (
                <li key={user.id}>{user.name}</li>
            ))}
        </ul>
    );
}
```
:::

### With Async/Await

::: code-group
```jsx [JavaScript]
function Posts() {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch('https://api.example.com/posts');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setPosts(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    // Render logic...
}
```

```tsx [TypeScript]
import { useState, useEffect } from 'react';

interface Post {
    id: number;
    title: string;
    body: string;
    userId: number;
}

function Posts(): JSX.Element {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async (): Promise<void> => {
            try {
                const response: Response = await fetch('https://api.example.com/posts');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data: Post[] = await response.json();
                setPosts(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    // Render logic...
}
```
:::

## Handling Loading, Error, and Data States

```
┌─────────────────────────────────────────────────────────────┐
│                    Data Fetching States                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Initial State                                             │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  loading: true                                       │  │
│   │  error: null                                         │  │
│   │  data: null/[]                                       │  │
│   └─────────────────────────────────────────────────────┘  │
│                         ↓                                   │
│                    Fetch starts                             │
│                         ↓                                   │
│   ┌────────────────────┬────────────────────┐             │
│   │     Success        │      Failure       │             │
│   ├────────────────────┼────────────────────┤             │
│   │  loading: false    │  loading: false    │             │
│   │  error: null       │  error: "message"  │             │
│   │  data: [...]       │  data: null/[]     │             │
│   └────────────────────┴────────────────────┘             │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

::: code-group
```jsx [JavaScript]
function DataDisplay() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/data');
            if (!response.ok) throw new Error('Failed to fetch');
            const json = await response.json();
            setData(json);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="loading">
                <Spinner />
                <p>Loading data...</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="error">
                <p>Error: {error}</p>
                <button onClick={fetchData}>Try Again</button>
            </div>
        );
    }

    // Empty state
    if (!data || data.length === 0) {
        return (
            <div className="empty">
                <p>No data available</p>
            </div>
        );
    }

    // Success state
    return (
        <div className="data">
            {/* Render data */}
        </div>
    );
}
```

```tsx [TypeScript]
import { useState, useEffect } from 'react';

interface DataItem {
    id: number;
    name: string;
}

function DataDisplay(): JSX.Element {
    const [data, setData] = useState<DataItem[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async (): Promise<void> => {
        setLoading(true);
        setError(null);

        try {
            const response: Response = await fetch('/api/data');
            if (!response.ok) throw new Error('Failed to fetch');
            const json: DataItem[] = await response.json();
            setData(json);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="loading">
                <Spinner />
                <p>Loading data...</p>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="error">
                <p>Error: {error}</p>
                <button onClick={fetchData}>Try Again</button>
            </div>
        );
    }

    // Empty state
    if (!data || data.length === 0) {
        return (
            <div className="empty">
                <p>No data available</p>
            </div>
        );
    }

    // Success state
    return (
        <div className="data">
            {/* Render data */}
        </div>
    );
}
```
:::

## Cleanup and Race Conditions

### Abort Controller

::: code-group
```jsx [JavaScript]
function SearchResults({ query }) {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        // Create abort controller
        const abortController = new AbortController();

        const search = async () => {
            setLoading(true);

            try {
                const response = await fetch(
                    `/api/search?q=${encodeURIComponent(query)}`,
                    { signal: abortController.signal }
                );

                if (!response.ok) throw new Error('Search failed');

                const data = await response.json();
                setResults(data);
            } catch (err) {
                // Ignore abort errors
                if (err.name !== 'AbortError') {
                    console.error('Search error:', err);
                }
            } finally {
                setLoading(false);
            }
        };

        search();

        // Cleanup: abort the request if query changes
        return () => {
            abortController.abort();
        };
    }, [query]);

    return (
        <div>
            {loading && <p>Searching...</p>}
            {results.map(item => (
                <div key={item.id}>{item.title}</div>
            ))}
        </div>
    );
}
```

```tsx [TypeScript]
import { useState, useEffect } from 'react';

interface SearchResult {
    id: number;
    title: string;
}

interface SearchResultsProps {
    query: string;
}

function SearchResults({ query }: SearchResultsProps): JSX.Element {
    const [results, setResults] = useState<SearchResult[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!query) {
            setResults([]);
            return;
        }

        // Create abort controller
        const abortController = new AbortController();

        const search = async (): Promise<void> => {
            setLoading(true);

            try {
                const response: Response = await fetch(
                    `/api/search?q=${encodeURIComponent(query)}`,
                    { signal: abortController.signal }
                );

                if (!response.ok) throw new Error('Search failed');

                const data: SearchResult[] = await response.json();
                setResults(data);
            } catch (err) {
                // Ignore abort errors
                if (err instanceof Error && err.name !== 'AbortError') {
                    console.error('Search error:', err);
                }
            } finally {
                setLoading(false);
            }
        };

        search();

        // Cleanup: abort the request if query changes
        return () => {
            abortController.abort();
        };
    }, [query]);

    return (
        <div>
            {loading && <p>Searching...</p>}
            {results.map((item: SearchResult) => (
                <div key={item.id}>{item.title}</div>
            ))}
        </div>
    );
}
```
:::

### Ignore Stale Responses

::: code-group
```jsx [JavaScript]
function UserProfile({ userId }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        let ignore = false;

        const fetchUser = async () => {
            const response = await fetch(`/api/users/${userId}`);
            const data = await response.json();

            // Only update if this is still the current request
            if (!ignore) {
                setUser(data);
            }
        };

        fetchUser();

        return () => {
            ignore = true;
        };
    }, [userId]);

    return user ? <div>{user.name}</div> : <p>Loading...</p>;
}
```

```tsx [TypeScript]
import { useState, useEffect } from 'react';

interface User {
    id: number;
    name: string;
    email: string;
}

interface UserProfileProps {
    userId: number;
}

function UserProfile({ userId }: UserProfileProps): JSX.Element {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        let ignore = false;

        const fetchUser = async (): Promise<void> => {
            const response: Response = await fetch(`/api/users/${userId}`);
            const data: User = await response.json();

            // Only update if this is still the current request
            if (!ignore) {
                setUser(data);
            }
        };

        fetchUser();

        return () => {
            ignore = true;
        };
    }, [userId]);

    return user ? <div>{user.name}</div> : <p>Loading...</p>;
}
```
:::

## Custom Fetch Hook

### useFetch Hook

::: code-group
```jsx [JavaScript]
import { useState, useEffect, useCallback } from 'react';

function useFetch(url, options = {}) {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async () => {
        const abortController = new AbortController();

        try {
            setLoading(true);
            setError(null);

            const response = await fetch(url, {
                ...options,
                signal: abortController.signal
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const json = await response.json();
            setData(json);
        } catch (err) {
            if (err.name !== 'AbortError') {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }

        return () => abortController.abort();
    }, [url, JSON.stringify(options)]);

    useEffect(() => {
        const cleanup = fetchData();
        return cleanup;
    }, [fetchData]);

    const refetch = useCallback(() => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch };
}

// Usage
function ProductList() {
    const { data: products, loading, error, refetch } = useFetch('/api/products');

    if (loading) return <p>Loading...</p>;
    if (error) return <button onClick={refetch}>Retry</button>;

    return (
        <ul>
            {products?.map(product => (
                <li key={product.id}>{product.name}</li>
            ))}
        </ul>
    );
}
```

```tsx [TypeScript]
import { useState, useEffect, useCallback } from 'react';

interface UseFetchResult<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
    refetch: () => void;
}

interface FetchOptions extends RequestInit {
    // Add any custom options here
}

function useFetch<T>(url: string, options: FetchOptions = {}): UseFetchResult<T> {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const fetchData = useCallback(async (): Promise<() => void> => {
        const abortController = new AbortController();

        try {
            setLoading(true);
            setError(null);

            const response: Response = await fetch(url, {
                ...options,
                signal: abortController.signal
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const json: T = await response.json();
            setData(json);
        } catch (err) {
            if (err instanceof Error && err.name !== 'AbortError') {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }

        return () => abortController.abort();
    }, [url, JSON.stringify(options)]);

    useEffect(() => {
        const cleanup = fetchData();
        return () => {
            cleanup.then(abort => abort());
        };
    }, [fetchData]);

    const refetch = useCallback((): void => {
        fetchData();
    }, [fetchData]);

    return { data, loading, error, refetch };
}

// Usage
interface Product {
    id: number;
    name: string;
    price: number;
}

function ProductList(): JSX.Element {
    const { data: products, loading, error, refetch } = useFetch<Product[]>('/api/products');

    if (loading) return <p>Loading...</p>;
    if (error) return <button onClick={refetch}>Retry</button>;

    return (
        <ul>
            {products?.map((product: Product) => (
                <li key={product.id}>{product.name}</li>
            ))}
        </ul>
    );
}
```
:::

### useApi Hook with Methods

::: code-group
```jsx [JavaScript]
function useApi() {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const request = useCallback(async (url, options = {}) => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP ${response.status}`);
            }

            const data = await response.json();
            return data;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const get = useCallback((url) => request(url), [request]);

    const post = useCallback((url, data) =>
        request(url, {
            method: 'POST',
            body: JSON.stringify(data)
        }), [request]);

    const put = useCallback((url, data) =>
        request(url, {
            method: 'PUT',
            body: JSON.stringify(data)
        }), [request]);

    const del = useCallback((url) =>
        request(url, { method: 'DELETE' }), [request]);

    return { get, post, put, del, loading, error };
}

// Usage
function TodoApp() {
    const { get, post, del, loading, error } = useApi();
    const [todos, setTodos] = useState([]);

    useEffect(() => {
        loadTodos();
    }, []);

    const loadTodos = async () => {
        const data = await get('/api/todos');
        setTodos(data);
    };

    const addTodo = async (text) => {
        const newTodo = await post('/api/todos', { text });
        setTodos(prev => [...prev, newTodo]);
    };

    const deleteTodo = async (id) => {
        await del(`/api/todos/${id}`);
        setTodos(prev => prev.filter(t => t.id !== id));
    };

    return (
        <div>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {/* Todo list UI */}
        </div>
    );
}
```

```tsx [TypeScript]
import { useState, useCallback, useEffect } from 'react';

interface UseApiResult {
    get: <T>(url: string) => Promise<T>;
    post: <T, D>(url: string, data: D) => Promise<T>;
    put: <T, D>(url: string, data: D) => Promise<T>;
    del: <T>(url: string) => Promise<T>;
    loading: boolean;
    error: string | null;
}

function useApi(): UseApiResult {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const request = useCallback(async <T>(
        url: string,
        options: RequestInit = {}
    ): Promise<T> => {
        setLoading(true);
        setError(null);

        try {
            const response: Response = await fetch(url, {
                headers: {
                    'Content-Type': 'application/json',
                    ...options.headers
                },
                ...options
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `HTTP ${response.status}`);
            }

            const data: T = await response.json();
            return data;
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Unknown error';
            setError(message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const get = useCallback(<T>(url: string): Promise<T> =>
        request<T>(url), [request]);

    const post = useCallback(<T, D>(url: string, data: D): Promise<T> =>
        request<T>(url, {
            method: 'POST',
            body: JSON.stringify(data)
        }), [request]);

    const put = useCallback(<T, D>(url: string, data: D): Promise<T> =>
        request<T>(url, {
            method: 'PUT',
            body: JSON.stringify(data)
        }), [request]);

    const del = useCallback(<T>(url: string): Promise<T> =>
        request<T>(url, { method: 'DELETE' }), [request]);

    return { get, post, put, del, loading, error };
}

// Usage
interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

function TodoApp(): JSX.Element {
    const { get, post, del, loading, error } = useApi();
    const [todos, setTodos] = useState<Todo[]>([]);

    useEffect(() => {
        loadTodos();
    }, []);

    const loadTodos = async (): Promise<void> => {
        const data = await get<Todo[]>('/api/todos');
        setTodos(data);
    };

    const addTodo = async (text: string): Promise<void> => {
        const newTodo = await post<Todo, { text: string }>('/api/todos', { text });
        setTodos((prev: Todo[]) => [...prev, newTodo]);
    };

    const deleteTodo = async (id: number): Promise<void> => {
        await del<void>(`/api/todos/${id}`);
        setTodos((prev: Todo[]) => prev.filter((t: Todo) => t.id !== id));
    };

    return (
        <div>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error}</p>}
            {/* Todo list UI */}
        </div>
    );
}
```
:::

## POST, PUT, DELETE Requests

::: code-group
```jsx [JavaScript]
function UserForm({ userId }) {
    const [formData, setFormData] = useState({
        name: '',
        email: ''
    });
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Create user
    const createUser = async () => {
        setSubmitting(true);
        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to create user');

            const newUser = await response.json();
            console.log('Created:', newUser);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    // Update user
    const updateUser = async () => {
        setSubmitting(true);
        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to update user');

            const updatedUser = await response.json();
            console.log('Updated:', updatedUser);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    // Delete user
    const deleteUser = async () => {
        if (!confirm('Are you sure?')) return;

        setSubmitting(true);
        try {
            const response = await fetch(`/api/users/${userId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete user');

            console.log('Deleted user:', userId);
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={(e) => {
            e.preventDefault();
            userId ? updateUser() : createUser();
        }}>
            <input
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Name"
            />
            <input
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                placeholder="Email"
            />
            <button type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : userId ? 'Update' : 'Create'}
            </button>
            {userId && (
                <button type="button" onClick={deleteUser} disabled={submitting}>
                    Delete
                </button>
            )}
            {error && <p className="error">{error}</p>}
        </form>
    );
}
```

```tsx [TypeScript]
import { useState, FormEvent, ChangeEvent } from 'react';

interface UserFormData {
    name: string;
    email: string;
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface UserFormProps {
    userId?: number;
}

function UserForm({ userId }: UserFormProps): JSX.Element {
    const [formData, setFormData] = useState<UserFormData>({
        name: '',
        email: ''
    });
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Create user
    const createUser = async (): Promise<void> => {
        setSubmitting(true);
        try {
            const response: Response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to create user');

            const newUser: User = await response.json();
            console.log('Created:', newUser);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setSubmitting(false);
        }
    };

    // Update user
    const updateUser = async (): Promise<void> => {
        setSubmitting(true);
        try {
            const response: Response = await fetch(`/api/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            if (!response.ok) throw new Error('Failed to update user');

            const updatedUser: User = await response.json();
            console.log('Updated:', updatedUser);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setSubmitting(false);
        }
    };

    // Delete user
    const deleteUser = async (): Promise<void> => {
        if (!confirm('Are you sure?')) return;

        setSubmitting(true);
        try {
            const response: Response = await fetch(`/api/users/${userId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Failed to delete user');

            console.log('Deleted user:', userId);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setSubmitting(false);
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        userId ? updateUser() : createUser();
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        setFormData((prev: UserFormData) => ({ ...prev, [name]: value }));
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name"
            />
            <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
            />
            <button type="submit" disabled={submitting}>
                {submitting ? 'Saving...' : userId ? 'Update' : 'Create'}
            </button>
            {userId && (
                <button type="button" onClick={deleteUser} disabled={submitting}>
                    Delete
                </button>
            )}
            {error && <p className="error">{error}</p>}
        </form>
    );
}
```
:::

## Pagination

::: code-group
```jsx [JavaScript]
function PaginatedList() {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);
    const pageSize = 10;

    useEffect(() => {
        const fetchPage = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `/api/items?page=${page}&limit=${pageSize}`
                );
                const data = await response.json();

                setItems(data.items);
                setTotalPages(Math.ceil(data.total / pageSize));
            } catch (err) {
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPage();
    }, [page]);

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {items.map(item => (
                        <li key={item.id}>{item.name}</li>
                    ))}
                </ul>
            )}

            <div className="pagination">
                <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                >
                    Previous
                </button>

                <span>Page {page} of {totalPages}</span>

                <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
```

```tsx [TypeScript]
import { useState, useEffect } from 'react';

interface Item {
    id: number;
    name: string;
}

interface PaginatedResponse {
    items: Item[];
    total: number;
}

function PaginatedList(): JSX.Element {
    const [items, setItems] = useState<Item[]>([]);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);
    const pageSize: number = 10;

    useEffect(() => {
        const fetchPage = async (): Promise<void> => {
            setLoading(true);
            try {
                const response: Response = await fetch(
                    `/api/items?page=${page}&limit=${pageSize}`
                );
                const data: PaginatedResponse = await response.json();

                setItems(data.items);
                setTotalPages(Math.ceil(data.total / pageSize));
            } catch (err) {
                console.error('Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPage();
    }, [page]);

    return (
        <div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <ul>
                    {items.map((item: Item) => (
                        <li key={item.id}>{item.name}</li>
                    ))}
                </ul>
            )}

            <div className="pagination">
                <button
                    onClick={() => setPage((p: number) => Math.max(1, p - 1))}
                    disabled={page === 1}
                >
                    Previous
                </button>

                <span>Page {page} of {totalPages}</span>

                <button
                    onClick={() => setPage((p: number) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
}
```
:::

## Infinite Scroll

::: code-group
```jsx [JavaScript]
import { useState, useEffect, useRef, useCallback } from 'react';

function InfiniteList() {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const observer = useRef();

    // Last element ref callback
    const lastItemRef = useCallback(node => {
        if (loading) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                setPage(prev => prev + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    useEffect(() => {
        const fetchItems = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/items?page=${page}&limit=20`);
                const data = await response.json();

                setItems(prev => [...prev, ...data.items]);
                setHasMore(data.items.length === 20);
            } catch (err) {
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, [page]);

    return (
        <div className="infinite-list">
            {items.map((item, index) => {
                if (index === items.length - 1) {
                    return (
                        <div key={item.id} ref={lastItemRef}>
                            {item.name}
                        </div>
                    );
                }
                return <div key={item.id}>{item.name}</div>;
            })}

            {loading && <p>Loading more...</p>}
            {!hasMore && <p>No more items</p>}
        </div>
    );
}
```

```tsx [TypeScript]
import { useState, useEffect, useRef, useCallback } from 'react';

interface Item {
    id: number;
    name: string;
}

interface FetchResponse {
    items: Item[];
}

function InfiniteList(): JSX.Element {
    const [items, setItems] = useState<Item[]>([]);
    const [page, setPage] = useState<number>(1);
    const [hasMore, setHasMore] = useState<boolean>(true);
    const [loading, setLoading] = useState<boolean>(false);
    const observer = useRef<IntersectionObserver | null>(null);

    // Last element ref callback
    const lastItemRef = useCallback((node: HTMLDivElement | null) => {
        if (loading) return;

        if (observer.current) observer.current.disconnect();

        observer.current = new IntersectionObserver((entries: IntersectionObserverEntry[]) => {
            if (entries[0].isIntersecting && hasMore) {
                setPage((prev: number) => prev + 1);
            }
        });

        if (node) observer.current.observe(node);
    }, [loading, hasMore]);

    useEffect(() => {
        const fetchItems = async (): Promise<void> => {
            setLoading(true);
            try {
                const response: Response = await fetch(`/api/items?page=${page}&limit=20`);
                const data: FetchResponse = await response.json();

                setItems((prev: Item[]) => [...prev, ...data.items]);
                setHasMore(data.items.length === 20);
            } catch (err) {
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, [page]);

    return (
        <div className="infinite-list">
            {items.map((item: Item, index: number) => {
                if (index === items.length - 1) {
                    return (
                        <div key={item.id} ref={lastItemRef}>
                            {item.name}
                        </div>
                    );
                }
                return <div key={item.id}>{item.name}</div>;
            })}

            {loading && <p>Loading more...</p>}
            {!hasMore && <p>No more items</p>}
        </div>
    );
}
```
:::

## Caching with useMemo

::: code-group
```jsx [JavaScript]
function CachedFetch() {
    const [cache, setCache] = useState({});
    const [data, setData] = useState(null);
    const [url, setUrl] = useState('/api/default');

    useEffect(() => {
        const fetchData = async () => {
            // Check cache first
            if (cache[url]) {
                setData(cache[url]);
                return;
            }

            const response = await fetch(url);
            const json = await response.json();

            // Update cache
            setCache(prev => ({ ...prev, [url]: json }));
            setData(json);
        };

        fetchData();
    }, [url, cache]);

    return (
        <div>
            <button onClick={() => setUrl('/api/users')}>Users</button>
            <button onClick={() => setUrl('/api/posts')}>Posts</button>
            {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
        </div>
    );
}
```

```tsx [TypeScript]
import { useState, useEffect } from 'react';

type CacheData = Record<string, unknown>;

function CachedFetch(): JSX.Element {
    const [cache, setCache] = useState<CacheData>({});
    const [data, setData] = useState<unknown>(null);
    const [url, setUrl] = useState<string>('/api/default');

    useEffect(() => {
        const fetchData = async (): Promise<void> => {
            // Check cache first
            if (cache[url]) {
                setData(cache[url]);
                return;
            }

            const response: Response = await fetch(url);
            const json: unknown = await response.json();

            // Update cache
            setCache((prev: CacheData) => ({ ...prev, [url]: json }));
            setData(json);
        };

        fetchData();
    }, [url, cache]);

    return (
        <div>
            <button onClick={() => setUrl('/api/users')}>Users</button>
            <button onClick={() => setUrl('/api/posts')}>Posts</button>
            {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
        </div>
    );
}
```
:::

## Practical Example: Product Store

::: code-group
```jsx [JavaScript]
// hooks/useProducts.js
function useProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({
        category: '',
        search: '',
        sort: 'name',
        page: 1
    });

    const buildUrl = useCallback(() => {
        const params = new URLSearchParams();
        if (filters.category) params.set('category', filters.category);
        if (filters.search) params.set('q', filters.search);
        params.set('sort', filters.sort);
        params.set('page', filters.page);
        return `/api/products?${params}`;
    }, [filters]);

    useEffect(() => {
        const controller = new AbortController();

        const fetchProducts = async () => {
            setLoading(true);
            try {
                const response = await fetch(buildUrl(), {
                    signal: controller.signal
                });

                if (!response.ok) throw new Error('Failed to fetch');

                const data = await response.json();
                setProducts(data.products);
                setError(null);
            } catch (err) {
                if (err.name !== 'AbortError') {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
        return () => controller.abort();
    }, [buildUrl]);

    const updateFilters = useCallback((updates) => {
        setFilters(prev => ({ ...prev, ...updates, page: 1 }));
    }, []);

    const nextPage = useCallback(() => {
        setFilters(prev => ({ ...prev, page: prev.page + 1 }));
    }, []);

    return {
        products,
        loading,
        error,
        filters,
        updateFilters,
        nextPage
    };
}

// components/ProductStore.jsx
function ProductStore() {
    const {
        products,
        loading,
        error,
        filters,
        updateFilters
    } = useProducts();

    return (
        <div className="store">
            <aside className="filters">
                <input
                    type="search"
                    placeholder="Search products..."
                    value={filters.search}
                    onChange={(e) => updateFilters({ search: e.target.value })}
                />

                <select
                    value={filters.category}
                    onChange={(e) => updateFilters({ category: e.target.value })}
                >
                    <option value="">All Categories</option>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="books">Books</option>
                </select>

                <select
                    value={filters.sort}
                    onChange={(e) => updateFilters({ sort: e.target.value })}
                >
                    <option value="name">Sort by Name</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                </select>
            </aside>

            <main className="products">
                {loading && <div className="loading">Loading...</div>}

                {error && (
                    <div className="error">
                        <p>{error}</p>
                        <button onClick={() => updateFilters({})}>Retry</button>
                    </div>
                )}

                {!loading && !error && products.length === 0 && (
                    <p>No products found</p>
                )}

                <div className="product-grid">
                    {products.map(product => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </main>
        </div>
    );
}
```

```tsx [TypeScript]
import { useState, useEffect, useCallback, ChangeEvent } from 'react';

// Types
interface Product {
    id: number;
    name: string;
    price: number;
    category: string;
}

interface ProductFilters {
    category: string;
    search: string;
    sort: string;
    page: number;
}

interface ProductsResponse {
    products: Product[];
    total: number;
}

interface UseProductsResult {
    products: Product[];
    loading: boolean;
    error: string | null;
    filters: ProductFilters;
    updateFilters: (updates: Partial<ProductFilters>) => void;
    nextPage: () => void;
}

// hooks/useProducts.ts
function useProducts(): UseProductsResult {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [filters, setFilters] = useState<ProductFilters>({
        category: '',
        search: '',
        sort: 'name',
        page: 1
    });

    const buildUrl = useCallback((): string => {
        const params = new URLSearchParams();
        if (filters.category) params.set('category', filters.category);
        if (filters.search) params.set('q', filters.search);
        params.set('sort', filters.sort);
        params.set('page', filters.page.toString());
        return `/api/products?${params}`;
    }, [filters]);

    useEffect(() => {
        const controller = new AbortController();

        const fetchProducts = async (): Promise<void> => {
            setLoading(true);
            try {
                const response: Response = await fetch(buildUrl(), {
                    signal: controller.signal
                });

                if (!response.ok) throw new Error('Failed to fetch');

                const data: ProductsResponse = await response.json();
                setProducts(data.products);
                setError(null);
            } catch (err) {
                if (err instanceof Error && err.name !== 'AbortError') {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
        return () => controller.abort();
    }, [buildUrl]);

    const updateFilters = useCallback((updates: Partial<ProductFilters>): void => {
        setFilters((prev: ProductFilters) => ({ ...prev, ...updates, page: 1 }));
    }, []);

    const nextPage = useCallback((): void => {
        setFilters((prev: ProductFilters) => ({ ...prev, page: prev.page + 1 }));
    }, []);

    return {
        products,
        loading,
        error,
        filters,
        updateFilters,
        nextPage
    };
}

// components/ProductStore.tsx
interface ProductCardProps {
    product: Product;
}

function ProductCard({ product }: ProductCardProps): JSX.Element {
    return (
        <div className="product-card">
            <h3>{product.name}</h3>
            <p>${product.price}</p>
        </div>
    );
}

function ProductStore(): JSX.Element {
    const {
        products,
        loading,
        error,
        filters,
        updateFilters
    } = useProducts();

    return (
        <div className="store">
            <aside className="filters">
                <input
                    type="search"
                    placeholder="Search products..."
                    value={filters.search}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        updateFilters({ search: e.target.value })
                    }
                />

                <select
                    value={filters.category}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                        updateFilters({ category: e.target.value })
                    }
                >
                    <option value="">All Categories</option>
                    <option value="electronics">Electronics</option>
                    <option value="clothing">Clothing</option>
                    <option value="books">Books</option>
                </select>

                <select
                    value={filters.sort}
                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                        updateFilters({ sort: e.target.value })
                    }
                >
                    <option value="name">Sort by Name</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                </select>
            </aside>

            <main className="products">
                {loading && <div className="loading">Loading...</div>}

                {error && (
                    <div className="error">
                        <p>{error}</p>
                        <button onClick={() => updateFilters({})}>Retry</button>
                    </div>
                )}

                {!loading && !error && products.length === 0 && (
                    <p>No products found</p>
                )}

                <div className="product-grid">
                    {products.map((product: Product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </main>
        </div>
    );
}
```
:::

## Data Fetching Best Practices

| Practice | Description |
|----------|-------------|
| Handle all states | Loading, error, empty, and success |
| Cancel requests | Use AbortController for cleanup |
| Avoid race conditions | Check if component is mounted |
| Show loading indicators | Provide feedback during fetches |
| Cache when appropriate | Avoid redundant requests |
| Handle errors gracefully | Show retry options |
| Use proper HTTP methods | GET for reading, POST for creating |

## What's Next?

In the next chapter, we'll explore [Advanced Patterns](/guide/react/10-advanced) - Context API, performance optimization, code splitting, and more.

---

[Next: Advanced Patterns →](/guide/react/10-advanced)
