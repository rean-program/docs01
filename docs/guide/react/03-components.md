# Components & Props

Components are the building blocks of React applications. In this tutorial, you'll learn how to create reusable components and pass data between them using props.

## What are Components?

Components are independent, reusable pieces of UI. Think of them as custom HTML elements with their own logic and appearance.

```
┌─────────────────────────────────────────────────────────────┐
│                    React Application                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   ┌─────────────────────────────────────────────────────┐  │
│   │                    <App />                           │  │
│   │  ┌──────────────────────────────────────────────┐   │  │
│   │  │              <Header />                       │   │  │
│   │  │  ┌─────────┐  ┌─────────┐  ┌─────────┐      │   │  │
│   │  │  │ <Logo/> │  │ <Nav/>  │  │<Search/>│      │   │  │
│   │  │  └─────────┘  └─────────┘  └─────────┘      │   │  │
│   │  └──────────────────────────────────────────────┘   │  │
│   │  ┌──────────────────────────────────────────────┐   │  │
│   │  │              <Main />                         │   │  │
│   │  │  ┌─────────────────┐  ┌─────────────────┐   │   │  │
│   │  │  │   <Sidebar />   │  │   <Content />   │   │   │  │
│   │  │  └─────────────────┘  └─────────────────┘   │   │  │
│   │  └──────────────────────────────────────────────┘   │  │
│   │  ┌──────────────────────────────────────────────┐   │  │
│   │  │              <Footer />                       │   │  │
│   │  └──────────────────────────────────────────────┘   │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Function Components

Modern React uses **function components** - JavaScript/TypeScript functions that return JSX/TSX.

### Basic Component

::: code-group
```jsx [JavaScript]
// A simple component
function Welcome() {
    return <h1>Hello, World!</h1>;
}

// Arrow function syntax
const Welcome = () => {
    return <h1>Hello, World!</h1>;
};

// Implicit return (single expression)
const Welcome = () => <h1>Hello, World!</h1>;
```

```tsx [TypeScript]
// A simple component with return type
function Welcome(): JSX.Element {
    return <h1>Hello, World!</h1>;
}

// Arrow function syntax
const Welcome: React.FC = () => {
    return <h1>Hello, World!</h1>;
};

// Implicit return (single expression)
const Welcome = (): JSX.Element => <h1>Hello, World!</h1>;
```
:::

### Using Components

::: code-group
```jsx [JavaScript]
function App() {
    return (
        <div>
            <Welcome />
            <Welcome />
            <Welcome />
        </div>
    );
}

// Output:
// Hello, World!
// Hello, World!
// Hello, World!
```

```tsx [TypeScript]
function App(): JSX.Element {
    return (
        <div>
            <Welcome />
            <Welcome />
            <Welcome />
        </div>
    );
}

// Output:
// Hello, World!
// Hello, World!
// Hello, World!
```
:::

## Component Naming Rules

| Rule | Example | Notes |
|------|---------|-------|
| Start with uppercase | `<Welcome />` | Lowercase = HTML element |
| PascalCase for multi-word | `<UserProfile />` | Not `userProfile` |
| Descriptive names | `<ProductCard />` | Clear purpose |
| No hyphens | `<MyComponent />` | Not `<my-component />` |

```jsx
// ✅ Correct
<Header />
<UserProfile />
<ShoppingCart />

// ❌ Wrong
<header />        // Treated as HTML <header>
<userProfile />   // Won't work
<shopping-cart /> // Invalid
```

## Understanding Props

Props (properties) allow you to pass data from parent to child components.

```
┌─────────────────────────────────────────────────────────────┐
│                      Props Flow                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Parent Component                                          │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  <UserCard name="John" age={25} />                  │  │
│   └─────────────────────────────────────────────────────┘  │
│                         │                                   │
│                         │ Props passed down                 │
│                         ▼                                   │
│   Child Component                                           │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  function UserCard({ name, age }) {                 │  │
│   │      return <p>{name} is {age} years old</p>;       │  │
│   │  }                                                   │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
│   ⚠️  Props are READ-ONLY (one-way data flow)              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Passing Props

::: code-group
```jsx [JavaScript]
// Parent component
function App() {
    return (
        <div>
            {/* Passing different props to each instance */}
            <Greeting name="Alice" />
            <Greeting name="Bob" />
            <Greeting name="Charlie" />
        </div>
    );
}

// Child component receiving props
function Greeting(props) {
    return <h1>Hello, {props.name}!</h1>;
}
```

```tsx [TypeScript]
// Define props interface
interface GreetingProps {
    name: string;
}

// Parent component
function App(): JSX.Element {
    return (
        <div>
            {/* Passing different props to each instance */}
            <Greeting name="Alice" />
            <Greeting name="Bob" />
            <Greeting name="Charlie" />
        </div>
    );
}

// Child component receiving typed props
function Greeting(props: GreetingProps): JSX.Element {
    return <h1>Hello, {props.name}!</h1>;
}
```
:::

### Destructuring Props

The preferred way to access props:

::: code-group
```jsx [JavaScript]
// Method 1: Destructure in parameter
function Greeting({ name }) {
    return <h1>Hello, {name}!</h1>;
}

// Method 2: Destructure in body
function Greeting(props) {
    const { name } = props;
    return <h1>Hello, {name}!</h1>;
}

// Multiple props
function UserCard({ name, email, avatar }) {
    return (
        <div className="user-card">
            <img src={avatar} alt={name} />
            <h2>{name}</h2>
            <p>{email}</p>
        </div>
    );
}
```

```tsx [TypeScript]
// Method 1: Destructure in parameter with type
interface GreetingProps {
    name: string;
}

function Greeting({ name }: GreetingProps): JSX.Element {
    return <h1>Hello, {name}!</h1>;
}

// Multiple props with interface
interface UserCardProps {
    name: string;
    email: string;
    avatar: string;
}

function UserCard({ name, email, avatar }: UserCardProps): JSX.Element {
    return (
        <div className="user-card">
            <img src={avatar} alt={name} />
            <h2>{name}</h2>
            <p>{email}</p>
        </div>
    );
}
```
:::

## Prop Types

### Passing Different Data Types

::: code-group
```jsx [JavaScript]
function ProductDisplay({
    // String
    title,
    // Number
    price,
    // Boolean
    inStock,
    // Array
    tags,
    // Object
    seller,
    // Function
    onBuy
}) {
    return (
        <div className="product">
            <h2>{title}</h2>
            <p>${price.toFixed(2)}</p>
            <p>{inStock ? 'In Stock' : 'Out of Stock'}</p>
            <p>Tags: {tags.join(', ')}</p>
            <p>Sold by: {seller.name}</p>
            <button onClick={onBuy}>Buy Now</button>
        </div>
    );
}

// Usage
<ProductDisplay
    title="Laptop"                          // String
    price={999.99}                          // Number
    inStock={true}                          // Boolean
    tags={['electronics', 'computers']}     // Array
    seller={{ name: 'Tech Store', id: 1 }} // Object
    onBuy={() => alert('Purchased!')}       // Function
/>
```

```tsx [TypeScript]
// Define interfaces for complex types
interface Seller {
    name: string;
    id: number;
}

interface ProductDisplayProps {
    title: string;
    price: number;
    inStock: boolean;
    tags: string[];
    seller: Seller;
    onBuy: () => void;
}

function ProductDisplay({
    title,
    price,
    inStock,
    tags,
    seller,
    onBuy
}: ProductDisplayProps): JSX.Element {
    return (
        <div className="product">
            <h2>{title}</h2>
            <p>${price.toFixed(2)}</p>
            <p>{inStock ? 'In Stock' : 'Out of Stock'}</p>
            <p>Tags: {tags.join(', ')}</p>
            <p>Sold by: {seller.name}</p>
            <button onClick={onBuy}>Buy Now</button>
        </div>
    );
}

// Usage - TypeScript will validate all props
<ProductDisplay
    title="Laptop"
    price={999.99}
    inStock={true}
    tags={['electronics', 'computers']}
    seller={{ name: 'Tech Store', id: 1 }}
    onBuy={() => alert('Purchased!')}
/>
```
:::

### Prop Syntax Summary

| Type | Syntax | Example |
|------|--------|---------|
| String | `prop="value"` | `name="John"` |
| Number | `prop={value}` | `age={25}` |
| Boolean (true) | `prop` or `prop={true}` | `active` |
| Boolean (false) | `prop={false}` | `active={false}` |
| Array | `prop={[...]}` | `items={[1, 2, 3]}` |
| Object | `prop={ {...} }` | `user={ { name: 'John' } }` |
| Function | `prop={fn}` | `onClick={handleClick}` |
| Variable | `prop={var}` | `data={userData}` |

## Default Props

Set fallback values when props aren't provided:

::: code-group
```jsx [JavaScript]
// Method 1: Default parameters (recommended)
function Button({ text = 'Click me', color = 'blue', size = 'medium' }) {
    return (
        <button className={`btn btn-${color} btn-${size}`}>
            {text}
        </button>
    );
}

// Usage
<Button />                          // Uses all defaults
<Button text="Submit" />            // Custom text, default color and size
<Button text="Delete" color="red" /> // Custom text and color
```

```tsx [TypeScript]
// Interface with optional props (?)
interface ButtonProps {
    text?: string;
    color?: 'blue' | 'red' | 'green';  // Union type for allowed values
    size?: 'small' | 'medium' | 'large';
}

function Button({
    text = 'Click me',
    color = 'blue',
    size = 'medium'
}: ButtonProps): JSX.Element {
    return (
        <button className={`btn btn-${color} btn-${size}`}>
            {text}
        </button>
    );
}

// Usage - TypeScript enforces valid values
<Button />                          // Uses all defaults
<Button text="Submit" />            // Custom text, default color and size
<Button text="Delete" color="red" /> // Custom text and color
// <Button color="purple" />        // Error: "purple" not in union type
```
:::

::: code-group
```jsx [JavaScript]
// Method 2: Default props object
function Avatar({ src, alt, size = 50 }) {
    return (
        <img
            src={src || '/default-avatar.png'}
            alt={alt || 'User avatar'}
            width={size}
            height={size}
        />
    );
}
```

```tsx [TypeScript]
interface AvatarProps {
    src?: string;
    alt?: string;
    size?: number;
}

function Avatar({ src, alt, size = 50 }: AvatarProps): JSX.Element {
    return (
        <img
            src={src || '/default-avatar.png'}
            alt={alt || 'User avatar'}
            width={size}
            height={size}
        />
    );
}
```
:::

## Spread Props

Pass all properties of an object as props:

::: code-group
```jsx [JavaScript]
function Profile({ name, email, avatar, bio }) {
    return (
        <div className="profile">
            <img src={avatar} alt={name} />
            <h2>{name}</h2>
            <p>{email}</p>
            <p>{bio}</p>
        </div>
    );
}

// Without spread
const user = {
    name: 'John',
    email: 'john@example.com',
    avatar: '/john.jpg',
    bio: 'Developer'
};

<Profile
    name={user.name}
    email={user.email}
    avatar={user.avatar}
    bio={user.bio}
/>

// With spread (cleaner!)
<Profile {...user} />
```

```tsx [TypeScript]
interface ProfileProps {
    name: string;
    email: string;
    avatar: string;
    bio: string;
}

function Profile({ name, email, avatar, bio }: ProfileProps): JSX.Element {
    return (
        <div className="profile">
            <img src={avatar} alt={name} />
            <h2>{name}</h2>
            <p>{email}</p>
            <p>{bio}</p>
        </div>
    );
}

// User object with matching type
const user: ProfileProps = {
    name: 'John',
    email: 'john@example.com',
    avatar: '/john.jpg',
    bio: 'Developer'
};

// With spread - TypeScript validates the object shape
<Profile {...user} />
```
:::

### Combining Spread with Other Props

```jsx
const baseButtonProps = {
    type: 'button',
    className: 'btn'
};

// Spread first, then override
<button {...baseButtonProps} className="btn-primary">
    Submit
</button>
// Result: type="button" className="btn-primary"

// Order matters!
<button className="btn-primary" {...baseButtonProps}>
    Submit
</button>
// Result: type="button" className="btn"
```

## The Children Prop

The special `children` prop contains content between opening and closing tags:

::: code-group
```jsx [JavaScript]
// Component accepting children
function Card({ title, children }) {
    return (
        <div className="card">
            <div className="card-header">
                <h2>{title}</h2>
            </div>
            <div className="card-body">
                {children}
            </div>
        </div>
    );
}

// Usage - content becomes children
<Card title="Welcome">
    <p>This is the card content.</p>
    <p>It can contain multiple elements.</p>
    <button>Action</button>
</Card>
```

```tsx [TypeScript]
import { ReactNode } from 'react';

interface CardProps {
    title: string;
    children: ReactNode;  // ReactNode accepts any renderable content
}

function Card({ title, children }: CardProps): JSX.Element {
    return (
        <div className="card">
            <div className="card-header">
                <h2>{title}</h2>
            </div>
            <div className="card-body">
                {children}
            </div>
        </div>
    );
}

// Usage - content becomes children
<Card title="Welcome">
    <p>This is the card content.</p>
    <p>It can contain multiple elements.</p>
    <button>Action</button>
</Card>
```
:::

### Children Examples

::: code-group
```jsx [JavaScript]
// Layout component
function Container({ children }) {
    return (
        <div className="container">
            {children}
        </div>
    );
}

// Button with icon
function IconButton({ icon, children }) {
    return (
        <button className="icon-btn">
            <span className="icon">{icon}</span>
            <span className="label">{children}</span>
        </button>
    );
}

<IconButton icon="🔍">Search</IconButton>
```

```tsx [TypeScript]
import { ReactNode } from 'react';

// Layout component
interface ContainerProps {
    children: ReactNode;
}

function Container({ children }: ContainerProps): JSX.Element {
    return (
        <div className="container">
            {children}
        </div>
    );
}

// Button with icon
interface IconButtonProps {
    icon: string;
    children: ReactNode;
}

function IconButton({ icon, children }: IconButtonProps): JSX.Element {
    return (
        <button className="icon-btn">
            <span className="icon">{icon}</span>
            <span className="label">{children}</span>
        </button>
    );
}

<IconButton icon="🔍">Search</IconButton>
```
:::

::: code-group
```jsx [JavaScript]
// Modal component
function Modal({ isOpen, onClose, title, children }) {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button onClick={onClose}>×</button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
}

// Usage
<Modal
    isOpen={showModal}
    onClose={() => setShowModal(false)}
    title="Confirm Delete"
>
    <p>Are you sure you want to delete this item?</p>
    <button onClick={handleDelete}>Yes, Delete</button>
</Modal>
```

```tsx [TypeScript]
import { ReactNode } from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: ReactNode;
}

function Modal({ isOpen, onClose, title, children }: ModalProps): JSX.Element | null {
    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <div className="modal-header">
                    <h2>{title}</h2>
                    <button onClick={onClose}>×</button>
                </div>
                <div className="modal-body">
                    {children}
                </div>
            </div>
        </div>
    );
}

// Usage
<Modal
    isOpen={showModal}
    onClose={() => setShowModal(false)}
    title="Confirm Delete"
>
    <p>Are you sure you want to delete this item?</p>
    <button onClick={handleDelete}>Yes, Delete</button>
</Modal>
```
:::

## Component Composition

Build complex UIs by combining simple components:

::: code-group
```jsx [JavaScript]
// Small, focused components
function Avatar({ src, alt, size = 'medium' }) {
    return (
        <img
            src={src}
            alt={alt}
            className={`avatar avatar-${size}`}
        />
    );
}

function UserInfo({ name, title }) {
    return (
        <div className="user-info">
            <h3 className="name">{name}</h3>
            <p className="title">{title}</p>
        </div>
    );
}

function Badge({ type, children }) {
    return (
        <span className={`badge badge-${type}`}>
            {children}
        </span>
    );
}

// Composed into a larger component
function UserCard({ user }) {
    return (
        <div className="user-card">
            <Avatar src={user.avatar} alt={user.name} size="large" />
            <UserInfo name={user.name} title={user.jobTitle} />
            <div className="badges">
                {user.isVerified && <Badge type="success">Verified</Badge>}
                {user.isPro && <Badge type="premium">Pro</Badge>}
            </div>
        </div>
    );
}

// Usage
const user = {
    name: 'Sarah Johnson',
    jobTitle: 'Senior Developer',
    avatar: '/sarah.jpg',
    isVerified: true,
    isPro: true
};

<UserCard user={user} />
```

```tsx [TypeScript]
import { ReactNode } from 'react';

// Small, focused components with types
interface AvatarProps {
    src: string;
    alt: string;
    size?: 'small' | 'medium' | 'large';
}

function Avatar({ src, alt, size = 'medium' }: AvatarProps): JSX.Element {
    return (
        <img
            src={src}
            alt={alt}
            className={`avatar avatar-${size}`}
        />
    );
}

interface UserInfoProps {
    name: string;
    title: string;
}

function UserInfo({ name, title }: UserInfoProps): JSX.Element {
    return (
        <div className="user-info">
            <h3 className="name">{name}</h3>
            <p className="title">{title}</p>
        </div>
    );
}

interface BadgeProps {
    type: 'success' | 'premium' | 'warning';
    children: ReactNode;
}

function Badge({ type, children }: BadgeProps): JSX.Element {
    return (
        <span className={`badge badge-${type}`}>
            {children}
        </span>
    );
}

// Define user type
interface User {
    name: string;
    jobTitle: string;
    avatar: string;
    isVerified: boolean;
    isPro: boolean;
}

interface UserCardProps {
    user: User;
}

// Composed into a larger component
function UserCard({ user }: UserCardProps): JSX.Element {
    return (
        <div className="user-card">
            <Avatar src={user.avatar} alt={user.name} size="large" />
            <UserInfo name={user.name} title={user.jobTitle} />
            <div className="badges">
                {user.isVerified && <Badge type="success">Verified</Badge>}
                {user.isPro && <Badge type="premium">Pro</Badge>}
            </div>
        </div>
    );
}

// Usage with typed user object
const user: User = {
    name: 'Sarah Johnson',
    jobTitle: 'Senior Developer',
    avatar: '/sarah.jpg',
    isVerified: true,
    isPro: true
};

<UserCard user={user} />
```
:::

## Organizing Components

### File Structure

::: code-group
```[JavaScript Project]
src/
├── components/
│   ├── common/           # Reusable components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Avatar.jsx
│   │   └── index.js      # Export all
│   ├── layout/           # Layout components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── Sidebar.jsx
│   └── features/         # Feature-specific
│       ├── UserCard.jsx
│       └── ProductList.jsx
├── pages/                # Page components
│   ├── Home.jsx
│   └── Profile.jsx
└── App.jsx
```

```[TypeScript Project]
src/
├── components/
│   ├── common/           # Reusable components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Avatar.tsx
│   │   └── index.ts      # Export all
│   ├── layout/           # Layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Sidebar.tsx
│   └── features/         # Feature-specific
│       ├── UserCard.tsx
│       └── ProductList.tsx
├── pages/                # Page components
│   ├── Home.tsx
│   └── Profile.tsx
├── types/                # Shared type definitions
│   └── index.ts
└── App.tsx
```
:::

### Export Patterns

::: code-group
```jsx [JavaScript]
// components/common/Button.jsx
export default function Button({ children, variant = 'primary' }) {
    return (
        <button className={`btn btn-${variant}`}>
            {children}
        </button>
    );
}

// components/common/index.js (barrel export)
export { default as Button } from './Button';
export { default as Card } from './Card';
export { default as Avatar } from './Avatar';

// Usage in other files
import { Button, Card, Avatar } from './components/common';
```

```tsx [TypeScript]
// components/common/Button.tsx
import { ReactNode } from 'react';

interface ButtonProps {
    children: ReactNode;
    variant?: 'primary' | 'secondary' | 'danger';
}

export default function Button({ children, variant = 'primary' }: ButtonProps): JSX.Element {
    return (
        <button className={`btn btn-${variant}`}>
            {children}
        </button>
    );
}

// components/common/index.ts (barrel export)
export { default as Button } from './Button';
export { default as Card } from './Card';
export { default as Avatar } from './Avatar';

// Re-export types if needed
export type { ButtonProps } from './Button';

// Usage in other files
import { Button, Card, Avatar } from './components/common';
```
:::

## Practical Example: Blog Post Card

Let's build a complete blog post card component:

::: code-group
```jsx [JavaScript]
// components/BlogCard.jsx

// Sub-components
function AuthorInfo({ author }) {
    return (
        <div className="author-info">
            <img
                src={author.avatar}
                alt={author.name}
                className="author-avatar"
            />
            <div>
                <span className="author-name">{author.name}</span>
                <span className="post-date">{author.date}</span>
            </div>
        </div>
    );
}

function TagList({ tags }) {
    return (
        <div className="tag-list">
            {tags.map(tag => (
                <span key={tag} className="tag">
                    #{tag}
                </span>
            ))}
        </div>
    );
}

function ReadMoreButton({ onClick }) {
    return (
        <button className="read-more-btn" onClick={onClick}>
            Read More →
        </button>
    );
}

// Main component
function BlogCard({
    title,
    excerpt,
    coverImage,
    author,
    tags = [],
    readTime = '5 min',
    onReadMore
}) {
    return (
        <article className="blog-card">
            {coverImage && (
                <img
                    src={coverImage}
                    alt={title}
                    className="cover-image"
                />
            )}

            <div className="content">
                <header>
                    <h2 className="title">{title}</h2>
                    <span className="read-time">{readTime} read</span>
                </header>

                <p className="excerpt">{excerpt}</p>

                {tags.length > 0 && <TagList tags={tags} />}

                <footer>
                    <AuthorInfo author={author} />
                    <ReadMoreButton onClick={onReadMore} />
                </footer>
            </div>
        </article>
    );
}

export default BlogCard;
```

```tsx [TypeScript]
// components/BlogCard.tsx

// Type definitions
interface Author {
    name: string;
    avatar: string;
    date: string;
}

interface AuthorInfoProps {
    author: Author;
}

interface TagListProps {
    tags: string[];
}

interface ReadMoreButtonProps {
    onClick: () => void;
}

interface BlogCardProps {
    title: string;
    excerpt: string;
    coverImage?: string;
    author: Author;
    tags?: string[];
    readTime?: string;
    onReadMore: () => void;
}

// Sub-components
function AuthorInfo({ author }: AuthorInfoProps): JSX.Element {
    return (
        <div className="author-info">
            <img
                src={author.avatar}
                alt={author.name}
                className="author-avatar"
            />
            <div>
                <span className="author-name">{author.name}</span>
                <span className="post-date">{author.date}</span>
            </div>
        </div>
    );
}

function TagList({ tags }: TagListProps): JSX.Element {
    return (
        <div className="tag-list">
            {tags.map((tag: string) => (
                <span key={tag} className="tag">
                    #{tag}
                </span>
            ))}
        </div>
    );
}

function ReadMoreButton({ onClick }: ReadMoreButtonProps): JSX.Element {
    return (
        <button className="read-more-btn" onClick={onClick}>
            Read More →
        </button>
    );
}

// Main component
function BlogCard({
    title,
    excerpt,
    coverImage,
    author,
    tags = [],
    readTime = '5 min',
    onReadMore
}: BlogCardProps): JSX.Element {
    return (
        <article className="blog-card">
            {coverImage && (
                <img
                    src={coverImage}
                    alt={title}
                    className="cover-image"
                />
            )}

            <div className="content">
                <header>
                    <h2 className="title">{title}</h2>
                    <span className="read-time">{readTime} read</span>
                </header>

                <p className="excerpt">{excerpt}</p>

                {tags.length > 0 && <TagList tags={tags} />}

                <footer>
                    <AuthorInfo author={author} />
                    <ReadMoreButton onClick={onReadMore} />
                </footer>
            </div>
        </article>
    );
}

export default BlogCard;
```
:::

### Using the BlogCard

::: code-group
```jsx [JavaScript]
// Usage in App.jsx
import BlogCard from './components/BlogCard';

function App() {
    const post = {
        title: 'Getting Started with React',
        excerpt: 'Learn the fundamentals of React and start building modern web applications...',
        coverImage: '/react-tutorial.jpg',
        author: {
            name: 'John Doe',
            avatar: '/john.jpg',
            date: 'Dec 15, 2024'
        },
        tags: ['react', 'javascript', 'tutorial'],
        readTime: '8 min'
    };

    const handleReadMore = () => {
        console.log('Navigate to full post');
    };

    return (
        <div className="blog-list">
            <BlogCard
                {...post}
                onReadMore={handleReadMore}
            />
        </div>
    );
}
```

```tsx [TypeScript]
// Usage in App.tsx
import BlogCard from './components/BlogCard';

interface Post {
    title: string;
    excerpt: string;
    coverImage: string;
    author: {
        name: string;
        avatar: string;
        date: string;
    };
    tags: string[];
    readTime: string;
}

function App(): JSX.Element {
    const post: Post = {
        title: 'Getting Started with React',
        excerpt: 'Learn the fundamentals of React and start building modern web applications...',
        coverImage: '/react-tutorial.jpg',
        author: {
            name: 'John Doe',
            avatar: '/john.jpg',
            date: 'Dec 15, 2024'
        },
        tags: ['react', 'javascript', 'tutorial'],
        readTime: '8 min'
    };

    const handleReadMore = (): void => {
        console.log('Navigate to full post');
    };

    return (
        <div className="blog-list">
            <BlogCard
                {...post}
                onReadMore={handleReadMore}
            />
        </div>
    );
}
```
:::

## Props Best Practices

### Do's and Don'ts

```jsx
// ✅ DO: Use descriptive prop names
<Button variant="primary" size="large" disabled={isLoading}>
    Submit
</Button>

// ❌ DON'T: Use vague names
<Button v="p" s="l" d={isLoading}>Submit</Button>
```

```jsx
// ✅ DO: Keep components focused
function UserAvatar({ src, name, size }) {
    return <img src={src} alt={name} className={`avatar-${size}`} />;
}

// ❌ DON'T: Create god components
function User({ /* 20+ props */ }) {
    // Handles everything about a user
}
```

::: code-group
```jsx [JavaScript]
// ✅ DO: Use sensible defaults
function Pagination({ currentPage = 1, pageSize = 10 }) { ... }
```

```tsx [TypeScript]
// ✅ DO: Use sensible defaults with TypeScript
interface PaginationProps {
    currentPage?: number;
    pageSize?: number;
}

function Pagination({ currentPage = 1, pageSize = 10 }: PaginationProps) { ... }

// ✅ DO: Use union types for constrained values
interface ButtonProps {
    children: React.ReactNode;
    onClick: () => void;
    variant?: 'primary' | 'secondary' | 'danger';
    size?: 'small' | 'medium' | 'large';
}
```
:::

## Summary

| Concept | Description |
|---------|-------------|
| **Component** | Reusable piece of UI |
| **Props** | Data passed from parent to child |
| **Children** | Content between component tags |
| **Default Props** | Fallback values for props |
| **Spread Props** | Pass all object properties as props |
| **Composition** | Building complex UIs from simple components |

### Key Rules

1. **Props are read-only** - Never modify props directly
2. **Data flows down** - Parent → Child only
3. **Components should be pure** - Same props = Same output
4. **Keep components small** - Single responsibility
5. **Compose, don't inherit** - Prefer composition over inheritance

### TypeScript Benefits

- **Compile-time validation** - Catch prop errors before runtime
- **IntelliSense** - IDE autocomplete for props
- **Documentation** - Interfaces serve as documentation
- **Refactoring safety** - Rename props confidently

## What's Next?

In the next chapter, we'll learn about [State & useState](/guide/react/04-state) - how to make components interactive by managing their own data.

---

[Next: State & useState →](/guide/react/04-state)
