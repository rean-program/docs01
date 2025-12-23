# Form Handling

Forms are essential for user input in web applications. In this tutorial, you'll learn how to handle forms in React with controlled components, validation, and best practices.

## Controlled vs Uncontrolled Components

```
┌─────────────────────────────────────────────────────────────┐
│              Controlled vs Uncontrolled                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   Controlled (Recommended)                                  │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  React state is the "single source of truth"        │  │
│   │  • value={state} + onChange={setState}              │  │
│   │  • Full control over input value                    │  │
│   │  • Easy validation and formatting                   │  │
│   │  • Predictable behavior                             │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
│   Uncontrolled                                              │
│   ┌─────────────────────────────────────────────────────┐  │
│   │  DOM is the source of truth                         │  │
│   │  • Use ref to access values                         │  │
│   │  • Less code for simple forms                       │  │
│   │  • Integrates with non-React code                   │  │
│   └─────────────────────────────────────────────────────┘  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## Controlled Components

### Basic Text Input

::: code-group
```jsx [JavaScript]
import { useState } from 'react';

function TextInputExample() {
    const [name, setName] = useState('');

    const handleChange = (event) => {
        setName(event.target.value);
    };

    return (
        <div>
            <label>
                Name:
                <input
                    type="text"
                    value={name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                />
            </label>
            <p>Hello, {name || 'stranger'}!</p>
        </div>
    );
}
```

```tsx [TypeScript]
import { useState, ChangeEvent } from 'react';

function TextInputExample(): JSX.Element {
    const [name, setName] = useState<string>('');

    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setName(event.target.value);
    };

    return (
        <div>
            <label>
                Name:
                <input
                    type="text"
                    value={name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                />
            </label>
            <p>Hello, {name || 'stranger'}!</p>
        </div>
    );
}
```
:::

### Different Input Types

::: code-group
```jsx [JavaScript]
function InputTypes() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [age, setAge] = useState(0);
    const [date, setDate] = useState('');

    return (
        <form>
            {/* Email */}
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
            />

            {/* Password */}
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
            />

            {/* Number */}
            <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                min="0"
                max="120"
            />

            {/* Date */}
            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />
        </form>
    );
}
```

```tsx [TypeScript]
import { useState, ChangeEvent } from 'react';

function InputTypes(): JSX.Element {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [age, setAge] = useState<number>(0);
    const [date, setDate] = useState<string>('');

    return (
        <form>
            {/* Email */}
            <input
                type="email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                placeholder="email@example.com"
            />

            {/* Password */}
            <input
                type="password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                placeholder="Password"
            />

            {/* Number */}
            <input
                type="number"
                value={age}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setAge(Number(e.target.value))}
                min="0"
                max="120"
            />

            {/* Date */}
            <input
                type="date"
                value={date}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setDate(e.target.value)}
            />
        </form>
    );
}
```
:::

### Textarea

::: code-group
```jsx [JavaScript]
function TextareaExample() {
    const [message, setMessage] = useState('');
    const maxLength = 500;

    return (
        <div>
            <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your message..."
                rows={5}
                maxLength={maxLength}
            />
            <p>{message.length}/{maxLength} characters</p>
        </div>
    );
}
```

```tsx [TypeScript]
import { useState, ChangeEvent } from 'react';

function TextareaExample(): JSX.Element {
    const [message, setMessage] = useState<string>('');
    const maxLength: number = 500;

    return (
        <div>
            <textarea
                value={message}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
                placeholder="Write your message..."
                rows={5}
                maxLength={maxLength}
            />
            <p>{message.length}/{maxLength} characters</p>
        </div>
    );
}
```
:::

### Select Dropdown

::: code-group
```jsx [JavaScript]
function SelectExample() {
    const [country, setCountry] = useState('');
    const [languages, setLanguages] = useState([]);

    const countries = [
        { value: 'us', label: 'United States' },
        { value: 'uk', label: 'United Kingdom' },
        { value: 'ca', label: 'Canada' },
        { value: 'au', label: 'Australia' }
    ];

    const languageOptions = ['English', 'Spanish', 'French', 'German'];

    // Multiple select
    const handleLanguageChange = (e) => {
        const options = Array.from(e.target.selectedOptions);
        setLanguages(options.map(option => option.value));
    };

    return (
        <div>
            {/* Single select */}
            <select value={country} onChange={(e) => setCountry(e.target.value)}>
                <option value="">Select a country</option>
                {countries.map(c => (
                    <option key={c.value} value={c.value}>
                        {c.label}
                    </option>
                ))}
            </select>

            {/* Multiple select */}
            <select
                multiple
                value={languages}
                onChange={handleLanguageChange}
                size={4}
            >
                {languageOptions.map(lang => (
                    <option key={lang} value={lang}>{lang}</option>
                ))}
            </select>
            <p>Selected: {languages.join(', ')}</p>
        </div>
    );
}
```

```tsx [TypeScript]
import { useState, ChangeEvent } from 'react';

interface Country {
    value: string;
    label: string;
}

function SelectExample(): JSX.Element {
    const [country, setCountry] = useState<string>('');
    const [languages, setLanguages] = useState<string[]>([]);

    const countries: Country[] = [
        { value: 'us', label: 'United States' },
        { value: 'uk', label: 'United Kingdom' },
        { value: 'ca', label: 'Canada' },
        { value: 'au', label: 'Australia' }
    ];

    const languageOptions: string[] = ['English', 'Spanish', 'French', 'German'];

    // Multiple select
    const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>): void => {
        const options = Array.from(e.target.selectedOptions);
        setLanguages(options.map(option => option.value));
    };

    return (
        <div>
            {/* Single select */}
            <select
                value={country}
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setCountry(e.target.value)}
            >
                <option value="">Select a country</option>
                {countries.map((c: Country) => (
                    <option key={c.value} value={c.value}>
                        {c.label}
                    </option>
                ))}
            </select>

            {/* Multiple select */}
            <select
                multiple
                value={languages}
                onChange={handleLanguageChange}
                size={4}
            >
                {languageOptions.map((lang: string) => (
                    <option key={lang} value={lang}>{lang}</option>
                ))}
            </select>
            <p>Selected: {languages.join(', ')}</p>
        </div>
    );
}
```
:::

### Checkboxes

::: code-group
```jsx [JavaScript]
function CheckboxExample() {
    // Single checkbox
    const [isSubscribed, setIsSubscribed] = useState(false);

    // Multiple checkboxes
    const [interests, setInterests] = useState([]);

    const interestOptions = ['Sports', 'Music', 'Movies', 'Gaming', 'Travel'];

    const handleInterestChange = (interest) => {
        setInterests(prev => {
            if (prev.includes(interest)) {
                return prev.filter(i => i !== interest);
            }
            return [...prev, interest];
        });
    };

    return (
        <div>
            {/* Single checkbox */}
            <label>
                <input
                    type="checkbox"
                    checked={isSubscribed}
                    onChange={(e) => setIsSubscribed(e.target.checked)}
                />
                Subscribe to newsletter
            </label>

            {/* Multiple checkboxes */}
            <fieldset>
                <legend>Interests</legend>
                {interestOptions.map(interest => (
                    <label key={interest} style={{ display: 'block' }}>
                        <input
                            type="checkbox"
                            checked={interests.includes(interest)}
                            onChange={() => handleInterestChange(interest)}
                        />
                        {interest}
                    </label>
                ))}
            </fieldset>
            <p>Selected: {interests.join(', ') || 'None'}</p>
        </div>
    );
}
```

```tsx [TypeScript]
import { useState, ChangeEvent } from 'react';

function CheckboxExample(): JSX.Element {
    // Single checkbox
    const [isSubscribed, setIsSubscribed] = useState<boolean>(false);

    // Multiple checkboxes
    const [interests, setInterests] = useState<string[]>([]);

    const interestOptions: string[] = ['Sports', 'Music', 'Movies', 'Gaming', 'Travel'];

    const handleInterestChange = (interest: string): void => {
        setInterests((prev: string[]) => {
            if (prev.includes(interest)) {
                return prev.filter((i: string) => i !== interest);
            }
            return [...prev, interest];
        });
    };

    return (
        <div>
            {/* Single checkbox */}
            <label>
                <input
                    type="checkbox"
                    checked={isSubscribed}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setIsSubscribed(e.target.checked)}
                />
                Subscribe to newsletter
            </label>

            {/* Multiple checkboxes */}
            <fieldset>
                <legend>Interests</legend>
                {interestOptions.map((interest: string) => (
                    <label key={interest} style={{ display: 'block' }}>
                        <input
                            type="checkbox"
                            checked={interests.includes(interest)}
                            onChange={() => handleInterestChange(interest)}
                        />
                        {interest}
                    </label>
                ))}
            </fieldset>
            <p>Selected: {interests.join(', ') || 'None'}</p>
        </div>
    );
}
```
:::

### Radio Buttons

::: code-group
```jsx [JavaScript]
function RadioExample() {
    const [plan, setPlan] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');

    const plans = [
        { id: 'free', name: 'Free', price: '$0/month' },
        { id: 'pro', name: 'Pro', price: '$10/month' },
        { id: 'enterprise', name: 'Enterprise', price: '$50/month' }
    ];

    return (
        <div>
            <fieldset>
                <legend>Select Plan</legend>
                {plans.map(p => (
                    <label key={p.id} style={{ display: 'block' }}>
                        <input
                            type="radio"
                            name="plan"
                            value={p.id}
                            checked={plan === p.id}
                            onChange={(e) => setPlan(e.target.value)}
                        />
                        {p.name} - {p.price}
                    </label>
                ))}
            </fieldset>

            <fieldset>
                <legend>Payment Method</legend>
                <label>
                    <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    Credit Card
                </label>
                <label>
                    <input
                        type="radio"
                        name="payment"
                        value="paypal"
                        checked={paymentMethod === 'paypal'}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    PayPal
                </label>
            </fieldset>
        </div>
    );
}
```

```tsx [TypeScript]
import { useState, ChangeEvent } from 'react';

interface Plan {
    id: string;
    name: string;
    price: string;
}

function RadioExample(): JSX.Element {
    const [plan, setPlan] = useState<string>('');
    const [paymentMethod, setPaymentMethod] = useState<string>('');

    const plans: Plan[] = [
        { id: 'free', name: 'Free', price: '$0/month' },
        { id: 'pro', name: 'Pro', price: '$10/month' },
        { id: 'enterprise', name: 'Enterprise', price: '$50/month' }
    ];

    return (
        <div>
            <fieldset>
                <legend>Select Plan</legend>
                {plans.map((p: Plan) => (
                    <label key={p.id} style={{ display: 'block' }}>
                        <input
                            type="radio"
                            name="plan"
                            value={p.id}
                            checked={plan === p.id}
                            onChange={(e: ChangeEvent<HTMLInputElement>) => setPlan(e.target.value)}
                        />
                        {p.name} - {p.price}
                    </label>
                ))}
            </fieldset>

            <fieldset>
                <legend>Payment Method</legend>
                <label>
                    <input
                        type="radio"
                        name="payment"
                        value="card"
                        checked={paymentMethod === 'card'}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPaymentMethod(e.target.value)}
                    />
                    Credit Card
                </label>
                <label>
                    <input
                        type="radio"
                        name="payment"
                        value="paypal"
                        checked={paymentMethod === 'paypal'}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setPaymentMethod(e.target.value)}
                    />
                    PayPal
                </label>
            </fieldset>
        </div>
    );
}
```
:::

## Form Submission

::: code-group
```jsx [JavaScript]
function ContactForm() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent page reload

        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Form submitted:', formData);

            // Reset form
            setFormData({ name: '', email: '', message: '' });
            alert('Message sent successfully!');
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to send message');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name">Name:</label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label htmlFor="email">Email:</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label htmlFor="message">Message:</label>
                <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                />
            </div>

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
        </form>
    );
}
```

```tsx [TypeScript]
import { useState, ChangeEvent, FormEvent } from 'react';

interface ContactFormData {
    name: string;
    email: string;
    message: string;
}

function ContactForm(): JSX.Element {
    const [formData, setFormData] = useState<ContactFormData>({
        name: '',
        email: '',
        message: ''
    });
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleChange = (
        e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ): void => {
        const { name, value } = e.target;
        setFormData((prev: ContactFormData) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault(); // Prevent page reload

        setIsSubmitting(true);

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            console.log('Form submitted:', formData);

            // Reset form
            setFormData({ name: '', email: '', message: '' });
            alert('Message sent successfully!');
        } catch (error) {
            console.error('Error:', error);
            alert('Failed to send message');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="name">Name:</label>
                <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label htmlFor="email">Email:</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                />
            </div>

            <div>
                <label htmlFor="message">Message:</label>
                <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                />
            </div>

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send Message'}
            </button>
        </form>
    );
}
```
:::

## Form Validation

### Basic Validation

::: code-group
```jsx [JavaScript]
function ValidationExample() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};

        // Email validation
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
        }

        // Password validation
        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            console.log('Form is valid!', { email, password });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    className={errors.email ? 'error' : ''}
                />
                {errors.email && (
                    <span className="error-message">{errors.email}</span>
                )}
            </div>

            <div>
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    className={errors.password ? 'error' : ''}
                />
                {errors.password && (
                    <span className="error-message">{errors.password}</span>
                )}
            </div>

            <button type="submit">Submit</button>
        </form>
    );
}
```

```tsx [TypeScript]
import { useState, ChangeEvent, FormEvent } from 'react';

interface FormErrors {
    email?: string;
    password?: string;
}

function ValidationExample(): JSX.Element {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [errors, setErrors] = useState<FormErrors>({});

    const validate = (): boolean => {
        const newErrors: FormErrors = {};

        // Email validation
        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Email is invalid';
        }

        // Password validation
        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 8) {
            newErrors.password = 'Password must be at least 8 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if (validate()) {
            console.log('Form is valid!', { email, password });
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <input
                    type="email"
                    value={email}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                    placeholder="Email"
                    className={errors.email ? 'error' : ''}
                />
                {errors.email && (
                    <span className="error-message">{errors.email}</span>
                )}
            </div>

            <div>
                <input
                    type="password"
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    placeholder="Password"
                    className={errors.password ? 'error' : ''}
                />
                {errors.password && (
                    <span className="error-message">{errors.password}</span>
                )}
            </div>

            <button type="submit">Submit</button>
        </form>
    );
}
```
:::

### Real-time Validation

::: code-group
```jsx [JavaScript]
function RealTimeValidation() {
    const [username, setUsername] = useState('');
    const [touched, setTouched] = useState(false);

    // Validate on every change
    const validateUsername = (value) => {
        if (!value) return 'Username is required';
        if (value.length < 3) return 'Username must be at least 3 characters';
        if (value.length > 20) return 'Username must be less than 20 characters';
        if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            return 'Username can only contain letters, numbers, and underscores';
        }
        return '';
    };

    const error = validateUsername(username);
    const isValid = !error;
    const showError = touched && error;

    return (
        <div>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={() => setTouched(true)}
                placeholder="Username"
                style={{
                    borderColor: showError ? 'red' : isValid && touched ? 'green' : 'gray'
                }}
            />
            {showError && <p style={{ color: 'red' }}>{error}</p>}
            {isValid && touched && (
                <p style={{ color: 'green' }}>Username is valid!</p>
            )}
        </div>
    );
}
```

```tsx [TypeScript]
import { useState, ChangeEvent, FocusEvent } from 'react';

function RealTimeValidation(): JSX.Element {
    const [username, setUsername] = useState<string>('');
    const [touched, setTouched] = useState<boolean>(false);

    // Validate on every change
    const validateUsername = (value: string): string => {
        if (!value) return 'Username is required';
        if (value.length < 3) return 'Username must be at least 3 characters';
        if (value.length > 20) return 'Username must be less than 20 characters';
        if (!/^[a-zA-Z0-9_]+$/.test(value)) {
            return 'Username can only contain letters, numbers, and underscores';
        }
        return '';
    };

    const error: string = validateUsername(username);
    const isValid: boolean = !error;
    const showError: boolean = touched && !!error;

    return (
        <div>
            <input
                type="text"
                value={username}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                onBlur={(e: FocusEvent<HTMLInputElement>) => setTouched(true)}
                placeholder="Username"
                style={{
                    borderColor: showError ? 'red' : isValid && touched ? 'green' : 'gray'
                }}
            />
            {showError && <p style={{ color: 'red' }}>{error}</p>}
            {isValid && touched && (
                <p style={{ color: 'green' }}>Username is valid!</p>
            )}
        </div>
    );
}
```
:::

### Complete Validation Example

::: code-group
```jsx [JavaScript]
function RegistrationForm() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    const validationRules = {
        username: (value) => {
            if (!value) return 'Username is required';
            if (value.length < 3) return 'Minimum 3 characters';
            return '';
        },
        email: (value) => {
            if (!value) return 'Email is required';
            if (!/\S+@\S+\.\S+/.test(value)) return 'Invalid email format';
            return '';
        },
        password: (value) => {
            if (!value) return 'Password is required';
            if (value.length < 8) return 'Minimum 8 characters';
            if (!/[A-Z]/.test(value)) return 'Include an uppercase letter';
            if (!/[0-9]/.test(value)) return 'Include a number';
            return '';
        },
        confirmPassword: (value) => {
            if (!value) return 'Please confirm password';
            if (value !== formData.password) return 'Passwords do not match';
            return '';
        }
    };

    const validateField = (name, value) => {
        const validate = validationRules[name];
        return validate ? validate(value) : '';
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Validate on change if field has been touched
        if (touched[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: validateField(name, value)
            }));
        }
    };

    const handleBlur = (e) => {
        const { name, value } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));
        setErrors(prev => ({
            ...prev,
            [name]: validateField(name, value)
        }));
    };

    const validateAll = () => {
        const newErrors = {};
        Object.keys(formData).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) newErrors[key] = error;
        });
        setErrors(newErrors);
        setTouched({
            username: true,
            email: true,
            password: true,
            confirmPassword: true
        });
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateAll()) {
            console.log('Registration successful:', formData);
        }
    };

    const renderField = (name, type, placeholder) => (
        <div className="form-field">
            <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={placeholder}
                className={touched[name] && errors[name] ? 'error' : ''}
            />
            {touched[name] && errors[name] && (
                <span className="error-text">{errors[name]}</span>
            )}
        </div>
    );

    return (
        <form onSubmit={handleSubmit}>
            {renderField('username', 'text', 'Username')}
            {renderField('email', 'email', 'Email')}
            {renderField('password', 'password', 'Password')}
            {renderField('confirmPassword', 'password', 'Confirm Password')}
            <button type="submit">Register</button>
        </form>
    );
}
```

```tsx [TypeScript]
import { useState, ChangeEvent, FocusEvent, FormEvent, ReactNode } from 'react';

interface RegistrationFormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

interface FormErrors {
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
}

interface TouchedFields {
    username?: boolean;
    email?: boolean;
    password?: boolean;
    confirmPassword?: boolean;
}

type ValidationRules = {
    [K in keyof RegistrationFormData]: (value: string) => string;
};

function RegistrationForm(): JSX.Element {
    const [formData, setFormData] = useState<RegistrationFormData>({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [touched, setTouched] = useState<TouchedFields>({});

    const validationRules: ValidationRules = {
        username: (value: string): string => {
            if (!value) return 'Username is required';
            if (value.length < 3) return 'Minimum 3 characters';
            return '';
        },
        email: (value: string): string => {
            if (!value) return 'Email is required';
            if (!/\S+@\S+\.\S+/.test(value)) return 'Invalid email format';
            return '';
        },
        password: (value: string): string => {
            if (!value) return 'Password is required';
            if (value.length < 8) return 'Minimum 8 characters';
            if (!/[A-Z]/.test(value)) return 'Include an uppercase letter';
            if (!/[0-9]/.test(value)) return 'Include a number';
            return '';
        },
        confirmPassword: (value: string): string => {
            if (!value) return 'Please confirm password';
            if (value !== formData.password) return 'Passwords do not match';
            return '';
        }
    };

    const validateField = (
        name: keyof RegistrationFormData,
        value: string
    ): string => {
        const validate = validationRules[name];
        return validate ? validate(value) : '';
    };

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        const fieldName = name as keyof RegistrationFormData;
        setFormData((prev: RegistrationFormData) => ({ ...prev, [fieldName]: value }));

        // Validate on change if field has been touched
        if (touched[fieldName]) {
            setErrors((prev: FormErrors) => ({
                ...prev,
                [fieldName]: validateField(fieldName, value)
            }));
        }
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>): void => {
        const { name, value } = e.target;
        const fieldName = name as keyof RegistrationFormData;
        setTouched((prev: TouchedFields) => ({ ...prev, [fieldName]: true }));
        setErrors((prev: FormErrors) => ({
            ...prev,
            [fieldName]: validateField(fieldName, value)
        }));
    };

    const validateAll = (): boolean => {
        const newErrors: FormErrors = {};
        (Object.keys(formData) as Array<keyof RegistrationFormData>).forEach(key => {
            const error = validateField(key, formData[key]);
            if (error) newErrors[key] = error;
        });
        setErrors(newErrors);
        setTouched({
            username: true,
            email: true,
            password: true,
            confirmPassword: true
        });
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        if (validateAll()) {
            console.log('Registration successful:', formData);
        }
    };

    const renderField = (
        name: keyof RegistrationFormData,
        type: string,
        placeholder: string
    ): ReactNode => (
        <div className="form-field">
            <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder={placeholder}
                className={touched[name] && errors[name] ? 'error' : ''}
            />
            {touched[name] && errors[name] && (
                <span className="error-text">{errors[name]}</span>
            )}
        </div>
    );

    return (
        <form onSubmit={handleSubmit}>
            {renderField('username', 'text', 'Username')}
            {renderField('email', 'email', 'Email')}
            {renderField('password', 'password', 'Password')}
            {renderField('confirmPassword', 'password', 'Confirm Password')}
            <button type="submit">Register</button>
        </form>
    );
}
```
:::

## Custom Form Hook

Create a reusable form hook:

::: code-group
```jsx [JavaScript]
function useForm(initialValues, validate) {
    const [values, setValues] = useState(initialValues);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setValues(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));

        if (validate) {
            const validationErrors = validate(values);
            setErrors(validationErrors);
        }
    };

    const handleSubmit = (onSubmit) => async (e) => {
        e.preventDefault();

        // Touch all fields
        const allTouched = Object.keys(values).reduce(
            (acc, key) => ({ ...acc, [key]: true }),
            {}
        );
        setTouched(allTouched);

        // Validate
        if (validate) {
            const validationErrors = validate(values);
            setErrors(validationErrors);

            if (Object.keys(validationErrors).length > 0) {
                return;
            }
        }

        setIsSubmitting(true);
        try {
            await onSubmit(values);
        } finally {
            setIsSubmitting(false);
        }
    };

    const reset = () => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
    };

    const getFieldProps = (name) => ({
        name,
        value: values[name],
        onChange: handleChange,
        onBlur: handleBlur
    });

    return {
        values,
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        reset,
        getFieldProps
    };
}

// Usage
function LoginForm() {
    const validate = (values) => {
        const errors = {};
        if (!values.email) errors.email = 'Required';
        if (!values.password) errors.password = 'Required';
        return errors;
    };

    const {
        values,
        errors,
        touched,
        isSubmitting,
        handleSubmit,
        getFieldProps
    } = useForm({ email: '', password: '' }, validate);

    const onSubmit = async (values) => {
        console.log('Login:', values);
        // API call here
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <input
                    type="email"
                    placeholder="Email"
                    {...getFieldProps('email')}
                />
                {touched.email && errors.email && (
                    <span>{errors.email}</span>
                )}
            </div>

            <div>
                <input
                    type="password"
                    placeholder="Password"
                    {...getFieldProps('password')}
                />
                {touched.password && errors.password && (
                    <span>{errors.password}</span>
                )}
            </div>

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
        </form>
    );
}
```

```tsx [TypeScript]
import { useState, ChangeEvent, FocusEvent, FormEvent } from 'react';

// Generic types for the hook
interface UseFormReturn<T> {
    values: T;
    errors: Partial<Record<keyof T, string>>;
    touched: Partial<Record<keyof T, boolean>>;
    isSubmitting: boolean;
    handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
    handleBlur: (e: FocusEvent<HTMLInputElement>) => void;
    handleSubmit: (onSubmit: (values: T) => Promise<void>) => (e: FormEvent) => Promise<void>;
    reset: () => void;
    getFieldProps: (name: keyof T) => {
        name: keyof T;
        value: T[keyof T];
        onChange: (e: ChangeEvent<HTMLInputElement>) => void;
        onBlur: (e: FocusEvent<HTMLInputElement>) => void;
    };
}

function useForm<T extends Record<string, any>>(
    initialValues: T,
    validate?: (values: T) => Partial<Record<keyof T, string>>
): UseFormReturn<T> {
    const [values, setValues] = useState<T>(initialValues);
    const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
    const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
        const { name, value, type, checked } = e.target;
        setValues((prev: T) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleBlur = (e: FocusEvent<HTMLInputElement>): void => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));

        if (validate) {
            const validationErrors = validate(values);
            setErrors(validationErrors);
        }
    };

    const handleSubmit = (onSubmit: (values: T) => Promise<void>) =>
        async (e: FormEvent): Promise<void> => {
            e.preventDefault();

            // Touch all fields
            const allTouched = Object.keys(values).reduce(
                (acc, key) => ({ ...acc, [key]: true }),
                {} as Partial<Record<keyof T, boolean>>
            );
            setTouched(allTouched);

            // Validate
            if (validate) {
                const validationErrors = validate(values);
                setErrors(validationErrors);

                if (Object.keys(validationErrors).length > 0) {
                    return;
                }
            }

            setIsSubmitting(true);
            try {
                await onSubmit(values);
            } finally {
                setIsSubmitting(false);
            }
        };

    const reset = (): void => {
        setValues(initialValues);
        setErrors({});
        setTouched({});
    };

    const getFieldProps = (name: keyof T) => ({
        name,
        value: values[name],
        onChange: handleChange,
        onBlur: handleBlur
    });

    return {
        values,
        errors,
        touched,
        isSubmitting,
        handleChange,
        handleBlur,
        handleSubmit,
        reset,
        getFieldProps
    };
}

// Usage
interface LoginFormValues {
    email: string;
    password: string;
}

function LoginForm(): JSX.Element {
    const validate = (values: LoginFormValues): Partial<Record<keyof LoginFormValues, string>> => {
        const errors: Partial<Record<keyof LoginFormValues, string>> = {};
        if (!values.email) errors.email = 'Required';
        if (!values.password) errors.password = 'Required';
        return errors;
    };

    const {
        errors,
        touched,
        isSubmitting,
        handleSubmit,
        getFieldProps
    } = useForm<LoginFormValues>({ email: '', password: '' }, validate);

    const onSubmit = async (values: LoginFormValues): Promise<void> => {
        console.log('Login:', values);
        // API call here
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <input
                    type="email"
                    placeholder="Email"
                    {...getFieldProps('email')}
                />
                {touched.email && errors.email && (
                    <span>{errors.email}</span>
                )}
            </div>

            <div>
                <input
                    type="password"
                    placeholder="Password"
                    {...getFieldProps('password')}
                />
                {touched.password && errors.password && (
                    <span>{errors.password}</span>
                )}
            </div>

            <button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
        </form>
    );
}
```
:::

## Uncontrolled Components with useRef

::: code-group
```jsx [JavaScript]
import { useRef } from 'react';

function UncontrolledForm() {
    const nameRef = useRef();
    const emailRef = useRef();
    const fileRef = useRef();

    const handleSubmit = (e) => {
        e.preventDefault();

        console.log('Name:', nameRef.current.value);
        console.log('Email:', emailRef.current.value);
        console.log('File:', fileRef.current.files[0]);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                ref={nameRef}
                defaultValue="John"
                placeholder="Name"
            />

            <input
                type="email"
                ref={emailRef}
                placeholder="Email"
            />

            <input
                type="file"
                ref={fileRef}
            />

            <button type="submit">Submit</button>
        </form>
    );
}
```

```tsx [TypeScript]
import { useRef, FormEvent } from 'react';

function UncontrolledForm(): JSX.Element {
    const nameRef = useRef<HTMLInputElement>(null);
    const emailRef = useRef<HTMLInputElement>(null);
    const fileRef = useRef<HTMLInputElement>(null);

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();

        console.log('Name:', nameRef.current?.value);
        console.log('Email:', emailRef.current?.value);
        console.log('File:', fileRef.current?.files?.[0]);
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                ref={nameRef}
                defaultValue="John"
                placeholder="Name"
            />

            <input
                type="email"
                ref={emailRef}
                placeholder="Email"
            />

            <input
                type="file"
                ref={fileRef}
            />

            <button type="submit">Submit</button>
        </form>
    );
}
```
:::

## File Upload

::: code-group
```jsx [JavaScript]
function FileUpload() {
    const [files, setFiles] = useState([]);
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleFileSelect = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles(selectedFiles);
    };

    const handleUpload = async () => {
        if (files.length === 0) return;

        setUploading(true);
        setProgress(0);

        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });

        try {
            // Simulate upload with progress
            for (let i = 0; i <= 100; i += 10) {
                await new Promise(r => setTimeout(r, 200));
                setProgress(i);
            }

            console.log('Upload complete!');
            setFiles([]);
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <input
                type="file"
                multiple
                onChange={handleFileSelect}
                accept="image/*,.pdf"
            />

            {files.length > 0 && (
                <div>
                    <h4>Selected files:</h4>
                    <ul>
                        {files.map((file, index) => (
                            <li key={index}>
                                {file.name} ({(file.size / 1024).toFixed(1)} KB)
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {uploading && (
                <div className="progress-bar">
                    <div style={{ width: `${progress}%` }}>{progress}%</div>
                </div>
            )}

            <button
                onClick={handleUpload}
                disabled={files.length === 0 || uploading}
            >
                {uploading ? 'Uploading...' : 'Upload'}
            </button>
        </div>
    );
}
```

```tsx [TypeScript]
import { useState, ChangeEvent } from 'react';

function FileUpload(): JSX.Element {
    const [files, setFiles] = useState<File[]>([]);
    const [uploading, setUploading] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);

    const handleFileSelect = (e: ChangeEvent<HTMLInputElement>): void => {
        const selectedFiles = Array.from(e.target.files || []);
        setFiles(selectedFiles);
    };

    const handleUpload = async (): Promise<void> => {
        if (files.length === 0) return;

        setUploading(true);
        setProgress(0);

        const formData = new FormData();
        files.forEach((file: File) => {
            formData.append('files', file);
        });

        try {
            // Simulate upload with progress
            for (let i = 0; i <= 100; i += 10) {
                await new Promise(r => setTimeout(r, 200));
                setProgress(i);
            }

            console.log('Upload complete!');
            setFiles([]);
        } catch (error) {
            console.error('Upload failed:', error);
        } finally {
            setUploading(false);
        }
    };

    return (
        <div>
            <input
                type="file"
                multiple
                onChange={handleFileSelect}
                accept="image/*,.pdf"
            />

            {files.length > 0 && (
                <div>
                    <h4>Selected files:</h4>
                    <ul>
                        {files.map((file: File, index: number) => (
                            <li key={index}>
                                {file.name} ({(file.size / 1024).toFixed(1)} KB)
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {uploading && (
                <div className="progress-bar">
                    <div style={{ width: `${progress}%` }}>{progress}%</div>
                </div>
            )}

            <button
                onClick={handleUpload}
                disabled={files.length === 0 || uploading}
            >
                {uploading ? 'Uploading...' : 'Upload'}
            </button>
        </div>
    );
}
```
:::

## Dynamic Form Fields

::: code-group
```jsx [JavaScript]
function DynamicForm() {
    const [fields, setFields] = useState([{ id: 1, value: '' }]);

    const addField = () => {
        setFields(prev => [
            ...prev,
            { id: Date.now(), value: '' }
        ]);
    };

    const removeField = (id) => {
        setFields(prev => prev.filter(field => field.id !== id));
    };

    const updateField = (id, value) => {
        setFields(prev =>
            prev.map(field =>
                field.id === id ? { ...field, value } : field
            )
        );
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const values = fields.map(f => f.value).filter(Boolean);
        console.log('Submitted values:', values);
    };

    return (
        <form onSubmit={handleSubmit}>
            {fields.map((field, index) => (
                <div key={field.id} style={{ marginBottom: '10px' }}>
                    <input
                        type="text"
                        value={field.value}
                        onChange={(e) => updateField(field.id, e.target.value)}
                        placeholder={`Item ${index + 1}`}
                    />
                    {fields.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removeField(field.id)}
                        >
                            Remove
                        </button>
                    )}
                </div>
            ))}

            <button type="button" onClick={addField}>
                + Add Field
            </button>

            <button type="submit">Submit</button>
        </form>
    );
}
```

```tsx [TypeScript]
import { useState, ChangeEvent, FormEvent } from 'react';

interface DynamicField {
    id: number;
    value: string;
}

function DynamicForm(): JSX.Element {
    const [fields, setFields] = useState<DynamicField[]>([{ id: 1, value: '' }]);

    const addField = (): void => {
        setFields((prev: DynamicField[]) => [
            ...prev,
            { id: Date.now(), value: '' }
        ]);
    };

    const removeField = (id: number): void => {
        setFields((prev: DynamicField[]) =>
            prev.filter((field: DynamicField) => field.id !== id)
        );
    };

    const updateField = (id: number, value: string): void => {
        setFields((prev: DynamicField[]) =>
            prev.map((field: DynamicField) =>
                field.id === id ? { ...field, value } : field
            )
        );
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
        e.preventDefault();
        const values = fields.map((f: DynamicField) => f.value).filter(Boolean);
        console.log('Submitted values:', values);
    };

    return (
        <form onSubmit={handleSubmit}>
            {fields.map((field: DynamicField, index: number) => (
                <div key={field.id} style={{ marginBottom: '10px' }}>
                    <input
                        type="text"
                        value={field.value}
                        onChange={(e: ChangeEvent<HTMLInputElement>) =>
                            updateField(field.id, e.target.value)
                        }
                        placeholder={`Item ${index + 1}`}
                    />
                    {fields.length > 1 && (
                        <button
                            type="button"
                            onClick={() => removeField(field.id)}
                        >
                            Remove
                        </button>
                    )}
                </div>
            ))}

            <button type="button" onClick={addField}>
                + Add Field
            </button>

            <button type="submit">Submit</button>
        </form>
    );
}
```
:::

## Form Best Practices

| Practice | Description |
|----------|-------------|
| Use `htmlFor` on labels | Links label to input for accessibility |
| Add `id` to inputs | Required for label association |
| Use `required` attribute | Browser-native validation |
| Show clear error messages | Help users fix mistakes |
| Disable submit while loading | Prevent double submissions |
| Use appropriate input types | email, tel, number for better UX |
| Handle form reset | Clear state on successful submit |

## What's Next?

In the next chapter, we'll learn about [React Router](/guide/react/08-routing) - how to add navigation and multiple pages to your React application.

---

[Next: React Router →](/guide/react/08-routing)
