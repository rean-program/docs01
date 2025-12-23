# Type Manipulation

Learn advanced type operations in TypeScript.

::: info What You'll Learn
- How to extract and transform types with keyof and typeof
- Indexed access types to get property types
- Conditional types for dynamic type logic
- Mapped types to transform all properties
- Template literal types for string manipulation
:::

## Why Type Manipulation?

Type manipulation lets you **create new types from existing ones**. Instead of writing redundant type definitions, you can derive types programmatically - keeping your code DRY and type-safe.

```
Original Type          Transformation         New Type
┌─────────────┐       ┌───────────────┐      ┌─────────────┐
│ User        │  ───▶ │ Make optional │ ───▶ │ PartialUser │
│ - id        │       └───────────────┘      │ - id?       │
│ - name      │                              │ - name?     │
│ - email     │                              │ - email?    │
└─────────────┘                              └─────────────┘
```

## Keyof Operator

`keyof` extracts all property keys from a type as a union:

```typescript
interface User {
    id: number;
    name: string;
    email: string;
}

// keyof extracts the keys as a union type
type UserKeys = keyof User;  // "id" | "name" | "email"

// Practical use: type-safe property access
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
    return obj[key];
}

const user: User = { id: 1, name: "John", email: "john@example.com" };

const name = getProperty(user, "name");   // ✅ type: string
const id = getProperty(user, "id");       // ✅ type: number
// getProperty(user, "password");         // ❌ Error: "password" not in keyof User
```

### Visual Guide

```
interface User {
    id: number;        ─┐
    name: string;       │─── keyof User = "id" | "name" | "email"
    email: string;     ─┘
}

keyof User  →  "id" | "name" | "email"  (union of literal types)
```

## Typeof Operator

`typeof` gets the type from a **value** (not a type):

```typescript
// Get type from a value
const config = {
    host: "localhost",
    port: 3000,
    secure: false
};

type Config = typeof config;
// { host: string; port: number; secure: boolean }

// Works with functions too
function createUser(name: string, age: number) {
    return { name, age, createdAt: new Date() };
}

type CreateUserReturn = ReturnType<typeof createUser>;
// { name: string; age: number; createdAt: Date }
```

### Using `as const` for Literal Types

```typescript
// Without 'as const' - types are widened
const routes = {
    home: "/",
    about: "/about"
};
type Routes1 = typeof routes;
// { home: string; about: string }  ← string, not "/"

// With 'as const' - preserves literal types
const routesConst = {
    home: "/",
    about: "/about"
} as const;

type Routes2 = typeof routesConst;
// { readonly home: "/"; readonly about: "/about" }  ← exact strings!
```

## Indexed Access Types

Access the type of a specific property using bracket notation:

```typescript
interface User {
    id: number;
    name: string;
    address: {
        street: string;
        city: string;
    };
    roles: string[];
}

// Get single property type
type UserId = User["id"];           // number
type UserName = User["name"];       // string

// Get nested property type
type UserAddress = User["address"]; // { street: string; city: string }
type UserCity = User["address"]["city"]; // string

// Get array element type
type UserRoles = User["roles"];         // string[]
type RoleType = User["roles"][number];  // string

// Multiple keys at once (union)
type IdOrName = User["id" | "name"];    // number | string

// All property types
type UserPropertyTypes = User[keyof User];
// number | string | { street: string; city: string } | string[]
```

### Visual Breakdown

```
User["id"]       →  number
User["name"]     →  string
User["address"]  →  { street: string; city: string }

User["id" | "name"]  →  number | string (union of both)

User[keyof User]     →  all property types combined
```

## Conditional Types

Types that change based on conditions - like ternary operators for types:

```typescript
// Syntax: T extends U ? TrueType : FalseType
type IsString<T> = T extends string ? true : false;

type A = IsString<"hello">;  // true
type B = IsString<123>;      // false
type C = IsString<string>;   // true
```

### Common Use Cases

```typescript
// Filter out null/undefined
type NonNullable<T> = T extends null | undefined ? never : T;

type D = NonNullable<string | null>;     // string
type E = NonNullable<number | undefined>; // number

// Get function return type
type ReturnType<T> = T extends (...args: any[]) => infer R ? R : never;

function greet() { return "Hello"; }
type GreetReturn = ReturnType<typeof greet>;  // string

// Get array element type
type Flatten<T> = T extends (infer E)[] ? E : T;

type Num = Flatten<number[]>;  // number
type Str = Flatten<string>;    // string (not an array, returns T)
```

### The `infer` Keyword

`infer` lets you **extract** a type within a conditional:

```typescript
// Extract return type
type GetReturnType<T> = T extends (...args: any[]) => infer R
    ? R      // If T is a function, R is the return type
    : never; // If not a function, return never

// Extract array element
type GetElementType<T> = T extends (infer E)[]
    ? E      // If T is an array, E is the element type
    : T;     // If not an array, return T itself

// Extract Promise value
type Awaited<T> = T extends Promise<infer U>
    ? U      // If T is a Promise, U is the resolved value type
    : T;     // If not a Promise, return T itself

type Result = Awaited<Promise<string>>;  // string
```

### Visual Guide to infer

```
T extends (infer E)[]
        │        │
        │        └─── Extract this type as 'E'
        └─── Check if T matches this pattern

Example:
number[] extends (infer E)[]
                   ↓
                 E = number

Promise<string> extends Promise<infer U>
                               ↓
                             U = string
```

## Mapped Types

Transform all properties of a type systematically:

```typescript
// Basic syntax: iterate over keys
type Stringify<T> = {
    [K in keyof T]: string;  // Make all properties strings
};

interface User {
    id: number;
    name: string;
    age: number;
}

type StringifiedUser = Stringify<User>;
// { id: string; name: string; age: string }
```

### Built-in Mapped Types

```typescript
// Make all properties optional
type Partial<T> = {
    [K in keyof T]?: T[K];  // ? makes optional
};

// Make all properties required
type Required<T> = {
    [K in keyof T]-?: T[K];  // -? removes optional
};

// Make all properties readonly
type Readonly<T> = {
    readonly [K in keyof T]: T[K];
};

// Remove readonly
type Mutable<T> = {
    -readonly [K in keyof T]: T[K];  // -readonly removes readonly
};
```

### Usage Examples

```typescript
interface User {
    id: number;
    name: string;
    email?: string;  // optional
}

// All optional
type PartialUser = Partial<User>;
// { id?: number; name?: string; email?: string }

// All required
type RequiredUser = Required<User>;
// { id: number; name: string; email: string }

// All readonly
type ReadonlyUser = Readonly<User>;
// { readonly id: number; readonly name: string; readonly email?: string }
```

### Key Remapping with `as`

Rename keys during mapping:

```typescript
// Add prefix to all keys
type Prefixed<T, P extends string> = {
    [K in keyof T as `${P}${string & K}`]: T[K];
};

interface User {
    name: string;
    age: number;
}

type PrefixedUser = Prefixed<User, "user_">;
// { user_name: string; user_age: number }
```

### Filtering Properties

```typescript
// Keep only string properties
type OnlyStrings<T> = {
    [K in keyof T as T[K] extends string ? K : never]: T[K];
};

interface Mixed {
    name: string;
    age: number;
    email: string;
    active: boolean;
}

type StringProps = OnlyStrings<Mixed>;
// { name: string; email: string }
```

### Visual Guide to Mapped Types

```
type Partial<T> = {
    [K in keyof T]?: T[K];
     │    │     │    │
     │    │     │    └─── Keep the same value type
     │    │     └─── Make it optional
     │    └─── Iterate over all keys of T
     └─── K is the current key

Input:  { id: number; name: string }
Output: { id?: number; name?: string }
```

## Template Literal Types

Manipulate strings at the type level:

```typescript
// Basic template literal type
type Greeting = `Hello, ${string}!`;

const greet1: Greeting = "Hello, World!";  // ✅ OK
// const greet2: Greeting = "Hi there!";   // ❌ Error

// Combine with union types
type Color = "red" | "green" | "blue";
type Size = "small" | "medium" | "large";

type ColorSize = `${Color}-${Size}`;
// "red-small" | "red-medium" | "red-large" |
// "green-small" | "green-medium" | "green-large" |
// "blue-small" | "blue-medium" | "blue-large"
```

### String Manipulation Utilities

```typescript
// Built-in string type utilities
type Upper = Uppercase<"hello">;      // "HELLO"
type Lower = Lowercase<"HELLO">;      // "hello"
type Cap = Capitalize<"hello">;       // "Hello"
type Uncap = Uncapitalize<"Hello">;   // "hello"
```

### Creating Getter Types

```typescript
// Generate getter names from properties
type Getters<T> = {
    [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K];
};

interface User {
    name: string;
    age: number;
}

type UserGetters = Getters<User>;
// { getName: () => string; getAge: () => number }
```

### Creating Event Handler Types

```typescript
// Generate event handler names
type EventHandlers<T> = {
    [K in keyof T as `on${Capitalize<string & K>}Change`]: (value: T[K]) => void;
};

interface Form {
    username: string;
    password: string;
    age: number;
}

type FormHandlers = EventHandlers<Form>;
// {
//   onUsernameChange: (value: string) => void;
//   onPasswordChange: (value: string) => void;
//   onAgeChange: (value: number) => void;
// }
```

## Utility Types Reference

TypeScript provides many built-in utility types:

### Object Manipulation

```typescript
interface User {
    id: number;
    name: string;
    email: string;
    password: string;
}

// Partial<T> - all properties optional
type PartialUser = Partial<User>;

// Required<T> - all properties required
type RequiredUser = Required<PartialUser>;

// Readonly<T> - all properties readonly
type ReadonlyUser = Readonly<User>;

// Pick<T, K> - select specific properties
type UserCredentials = Pick<User, "email" | "password">;
// { email: string; password: string }

// Omit<T, K> - exclude specific properties
type PublicUser = Omit<User, "password">;
// { id: number; name: string; email: string }

// Record<K, V> - create object type from keys and value type
type UserRoles = Record<"admin" | "user" | "guest", boolean>;
// { admin: boolean; user: boolean; guest: boolean }
```

### Union Manipulation

```typescript
type MyUnion = string | number | boolean | null | undefined;

// Exclude<T, U> - remove types from union
type NotNull = Exclude<MyUnion, null | undefined>;
// string | number | boolean

// Extract<T, U> - keep only matching types
type OnlyPrimitives = Extract<MyUnion, string | number>;
// string | number

// NonNullable<T> - remove null and undefined
type Defined = NonNullable<MyUnion>;
// string | number | boolean
```

### Function Types

```typescript
function createUser(name: string, age: number): { name: string; age: number } {
    return { name, age };
}

// Parameters<T> - get function parameter types as tuple
type Params = Parameters<typeof createUser>;
// [string, number]

// ReturnType<T> - get function return type
type Return = ReturnType<typeof createUser>;
// { name: string; age: number }

// ConstructorParameters<T> - get constructor parameter types
class MyClass {
    constructor(public name: string, public value: number) {}
}
type CtorParams = ConstructorParameters<typeof MyClass>;
// [string, number]

// InstanceType<T> - get instance type of a class
type Instance = InstanceType<typeof MyClass>;
// MyClass
```

## Advanced Patterns

### Deep Partial

Make all nested properties optional:

```typescript
type DeepPartial<T> = T extends object
    ? { [K in keyof T]?: DeepPartial<T[K]> }
    : T;

interface Config {
    server: {
        host: string;
        port: number;
    };
    database: {
        url: string;
        name: string;
    };
}

type PartialConfig = DeepPartial<Config>;
// {
//   server?: { host?: string; port?: number };
//   database?: { url?: string; name?: string };
// }
```

### Deep Readonly

Make all nested properties readonly:

```typescript
type DeepReadonly<T> = T extends object
    ? { readonly [K in keyof T]: DeepReadonly<T[K]> }
    : T;

const config: DeepReadonly<Config> = {
    server: { host: "localhost", port: 3000 },
    database: { url: "mongodb://...", name: "mydb" }
};

// config.server.host = "other";  // ❌ Error: readonly
```

### Path Types (Dot Notation)

Generate all valid dot-notation paths:

```typescript
type PathKeys<T, Prefix extends string = ""> = T extends object
    ? {
          [K in keyof T]: K extends string
              ? `${Prefix}${K}` | PathKeys<T[K], `${Prefix}${K}.`>
              : never;
      }[keyof T]
    : never;

interface Data {
    user: {
        name: string;
        address: {
            city: string;
        };
    };
}

type DataPaths = PathKeys<Data>;
// "user" | "user.name" | "user.address" | "user.address.city"
```

## Practice Exercise

Create a type-safe form builder:

```typescript
// Form field types
type FieldType = "text" | "number" | "email" | "password" | "select";

interface FieldConfig<T extends FieldType> {
    type: T;
    label: string;
    required?: boolean;
    defaultValue?: T extends "number" ? number : string;
    options?: T extends "select" ? string[] : never;
}

// Form schema type
type FormSchema = Record<string, FieldConfig<FieldType>>;

// Extract form values type from schema
type FormValues<T extends FormSchema> = {
    [K in keyof T]: T[K]["type"] extends "number" ? number : string;
};

// Form builder class
class FormBuilder<T extends FormSchema> {
    private schema: T;
    private values: Partial<FormValues<T>> = {};

    constructor(schema: T) {
        this.schema = schema;
        this.initDefaults();
    }

    private initDefaults(): void {
        for (const key in this.schema) {
            const field = this.schema[key];
            if (field.defaultValue !== undefined) {
                (this.values as any)[key] = field.defaultValue;
            }
        }
    }

    setValue<K extends keyof T>(
        field: K,
        value: FormValues<T>[K]
    ): this {
        this.values[field] = value;
        return this;
    }

    getValue<K extends keyof T>(field: K): FormValues<T>[K] | undefined {
        return this.values[field];
    }

    validate(): { valid: boolean; errors: Partial<Record<keyof T, string>> } {
        const errors: Partial<Record<keyof T, string>> = {};

        for (const key in this.schema) {
            const field = this.schema[key];
            const value = this.values[key];

            if (field.required && (value === undefined || value === "")) {
                errors[key] = `${field.label} is required`;
            }
        }

        return {
            valid: Object.keys(errors).length === 0,
            errors
        };
    }

    getValues(): FormValues<T> {
        return this.values as FormValues<T>;
    }
}

// Usage
const loginSchema = {
    email: {
        type: "email" as const,
        label: "Email",
        required: true
    },
    password: {
        type: "password" as const,
        label: "Password",
        required: true
    },
    rememberMe: {
        type: "text" as const,
        label: "Remember Me",
        defaultValue: "no"
    }
} satisfies FormSchema;

const form = new FormBuilder(loginSchema);

form.setValue("email", "user@example.com")
    .setValue("password", "secret123");

const { valid, errors } = form.validate();
console.log(valid, errors);

const values = form.getValues();
// Type: { email: string; password: string; rememberMe: string }
```

## Summary

| Operator/Type | Purpose | Example |
|---------------|---------|---------|
| `keyof T` | Get all keys as union | `keyof User` → `"id" \| "name"` |
| `typeof value` | Get type from value | `typeof config` |
| `T[K]` | Access property type | `User["name"]` → `string` |
| `T extends U ? X : Y` | Conditional type | `IsString<T>` |
| `infer R` | Extract type in conditional | Extract return type |
| `[K in keyof T]` | Mapped type | Transform all properties |
| Template literals | String type manipulation | `` `get${K}` `` |

---

[Next: Modules →](/guide/typescript/07-modules)
