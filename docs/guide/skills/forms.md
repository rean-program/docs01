# Working with Forms

Forms are essential for collecting user input. This guide covers form creation, validation, and handling with both HTML and JavaScript.

## Basic Form Structure

```html
<form id="contactForm" action="/submit" method="POST">
    <div class="form-group">
        <label for="name">Name</label>
        <input type="text" id="name" name="name" required>
    </div>

    <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" name="email" required>
    </div>

    <div class="form-group">
        <label for="message">Message</label>
        <textarea id="message" name="message" rows="4" required></textarea>
    </div>

    <button type="submit">Send Message</button>
</form>
```

## Input Types

### Text Inputs

```html
<!-- Basic text -->
<input type="text" name="username" placeholder="Enter username">

<!-- Password (hidden characters) -->
<input type="password" name="password" placeholder="Enter password">

<!-- Email (validates format) -->
<input type="email" name="email" placeholder="email@example.com">

<!-- URL -->
<input type="url" name="website" placeholder="https://example.com">

<!-- Phone -->
<input type="tel" name="phone" placeholder="123-456-7890">

<!-- Search (with clear button) -->
<input type="search" name="query" placeholder="Search...">
```

### Number Inputs

```html
<!-- Number with constraints -->
<input type="number" name="age" min="0" max="120" step="1">

<!-- Range slider -->
<input type="range" name="volume" min="0" max="100" value="50">
<output>50</output>
```

### Date and Time

```html
<!-- Date picker -->
<input type="date" name="birthday" min="1900-01-01" max="2024-12-31">

<!-- Time picker -->
<input type="time" name="appointment">

<!-- Date and time -->
<input type="datetime-local" name="meeting">

<!-- Month -->
<input type="month" name="expiry">

<!-- Week -->
<input type="week" name="week">
```

### Selection Inputs

```html
<!-- Checkbox -->
<label>
    <input type="checkbox" name="terms" required>
    I agree to the terms
</label>

<!-- Multiple checkboxes -->
<fieldset>
    <legend>Interests</legend>
    <label><input type="checkbox" name="interests" value="sports"> Sports</label>
    <label><input type="checkbox" name="interests" value="music"> Music</label>
    <label><input type="checkbox" name="interests" value="coding"> Coding</label>
</fieldset>

<!-- Radio buttons -->
<fieldset>
    <legend>Gender</legend>
    <label><input type="radio" name="gender" value="male"> Male</label>
    <label><input type="radio" name="gender" value="female"> Female</label>
    <label><input type="radio" name="gender" value="other"> Other</label>
</fieldset>

<!-- Dropdown select -->
<select name="country">
    <option value="">Select country</option>
    <option value="us">United States</option>
    <option value="uk">United Kingdom</option>
    <option value="ca">Canada</option>
</select>

<!-- Multi-select -->
<select name="skills" multiple>
    <option value="html">HTML</option>
    <option value="css">CSS</option>
    <option value="js">JavaScript</option>
</select>
```

### Other Inputs

```html
<!-- File upload -->
<input type="file" name="avatar" accept="image/*">
<input type="file" name="documents" multiple accept=".pdf,.doc,.docx">

<!-- Color picker -->
<input type="color" name="theme" value="#3498db">

<!-- Hidden field -->
<input type="hidden" name="userId" value="12345">
```

## HTML5 Validation

### Validation Attributes

```html
<!-- Required field -->
<input type="text" required>

<!-- Minimum/maximum length -->
<input type="text" minlength="2" maxlength="50">

<!-- Pattern (regex) -->
<input type="text" pattern="[A-Za-z]{3,}" title="At least 3 letters">

<!-- Number constraints -->
<input type="number" min="1" max="100" step="5">

<!-- Email validation (built-in) -->
<input type="email" required>

<!-- URL validation (built-in) -->
<input type="url" required>
```

### Custom Validation Messages

```html
<input
    type="text"
    required
    minlength="3"
    oninvalid="this.setCustomValidity('Please enter at least 3 characters')"
    oninput="this.setCustomValidity('')"
>
```

### Styling Validation States

```css
/* Valid input */
input:valid {
    border-color: green;
}

/* Invalid input */
input:invalid {
    border-color: red;
}

/* Only show invalid after interaction */
input:not(:placeholder-shown):invalid {
    border-color: red;
}

/* Focus states */
input:focus:valid {
    outline-color: green;
}

input:focus:invalid {
    outline-color: red;
}
```

## JavaScript Form Handling

### Getting Form Data

```javascript
const form = document.getElementById('myForm');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Method 1: FormData API
    const formData = new FormData(form);
    const data = Object.fromEntries(formData);
    console.log(data);

    // Method 2: Access individual fields
    const name = form.elements.name.value;
    const email = form.elements.email.value;

    // Method 3: Query selectors
    const message = form.querySelector('#message').value;
});
```

### FormData API

```javascript
const form = document.getElementById('myForm');
const formData = new FormData(form);

// Get single value
const name = formData.get('name');

// Get all values (for multiple checkboxes)
const interests = formData.getAll('interests');

// Check if key exists
if (formData.has('newsletter')) {
    // Subscribed to newsletter
}

// Add/modify data
formData.set('timestamp', Date.now());
formData.append('source', 'web');

// Delete field
formData.delete('secretField');

// Convert to object
const data = Object.fromEntries(formData);

// Convert to URL params
const params = new URLSearchParams(formData);
```

### Custom Validation

```javascript
const form = document.getElementById('registrationForm');
const password = document.getElementById('password');
const confirmPassword = document.getElementById('confirmPassword');

// Real-time validation
confirmPassword.addEventListener('input', () => {
    if (password.value !== confirmPassword.value) {
        confirmPassword.setCustomValidity('Passwords do not match');
    } else {
        confirmPassword.setCustomValidity('');
    }
});

// Full form validation
form.addEventListener('submit', (e) => {
    e.preventDefault();

    const errors = validateForm(form);

    if (errors.length > 0) {
        displayErrors(errors);
        return;
    }

    submitForm(form);
});

function validateForm(form) {
    const errors = [];
    const data = new FormData(form);

    // Name validation
    const name = data.get('name');
    if (!name || name.length < 2) {
        errors.push('Name must be at least 2 characters');
    }

    // Email validation
    const email = data.get('email');
    if (!isValidEmail(email)) {
        errors.push('Please enter a valid email');
    }

    // Password validation
    const password = data.get('password');
    if (!isStrongPassword(password)) {
        errors.push('Password must be at least 8 characters with a number');
    }

    return errors;
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongPassword(password) {
    return password.length >= 8 && /\d/.test(password);
}
```

### Displaying Errors

```javascript
function displayErrors(errors) {
    const container = document.getElementById('errorContainer');
    container.innerHTML = errors
        .map(error => `<p class="error">${error}</p>`)
        .join('');
    container.style.display = 'block';
}

// Inline error display
function showFieldError(field, message) {
    const errorEl = field.parentElement.querySelector('.error-message');
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.style.display = 'block';
    }
    field.classList.add('invalid');
}

function clearFieldError(field) {
    const errorEl = field.parentElement.querySelector('.error-message');
    if (errorEl) {
        errorEl.style.display = 'none';
    }
    field.classList.remove('invalid');
}
```

## Submitting Forms

### Standard Submission

```html
<form action="/api/contact" method="POST">
    <!-- Form submits and page reloads -->
</form>
```

### AJAX Submission

```javascript
const form = document.getElementById('contactForm');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const submitBtn = form.querySelector('button[type="submit"]');

    try {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';

        const response = await fetch('/api/contact', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            throw new Error('Submission failed');
        }

        const result = await response.json();
        showSuccess('Message sent successfully!');
        form.reset();

    } catch (error) {
        showError('Failed to send message. Please try again.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Send Message';
    }
});
```

### JSON Submission

```javascript
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const data = Object.fromEntries(formData);

    const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
});
```

## File Uploads

```html
<form id="uploadForm" enctype="multipart/form-data">
    <input type="file" id="fileInput" name="files" multiple accept="image/*">
    <div id="preview"></div>
    <button type="submit">Upload</button>
</form>
```

```javascript
const fileInput = document.getElementById('fileInput');
const preview = document.getElementById('preview');

// Preview selected files
fileInput.addEventListener('change', () => {
    preview.innerHTML = '';

    for (const file of fileInput.files) {
        if (file.type.startsWith('image/')) {
            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.style.maxWidth = '200px';
            preview.appendChild(img);
        }
    }
});

// Upload with progress
const form = document.getElementById('uploadForm');

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(form);
    const xhr = new XMLHttpRequest();

    xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
            const percent = Math.round((e.loaded / e.total) * 100);
            console.log(`Upload: ${percent}%`);
        }
    });

    xhr.addEventListener('load', () => {
        console.log('Upload complete');
    });

    xhr.open('POST', '/api/upload');
    xhr.send(formData);
});
```

## Form Accessibility

```html
<form>
    <!-- Always use labels -->
    <label for="email">Email Address</label>
    <input type="email" id="email" name="email" required>

    <!-- Group related inputs -->
    <fieldset>
        <legend>Shipping Address</legend>
        <!-- Address fields -->
    </fieldset>

    <!-- Error messages -->
    <div class="form-group">
        <label for="phone">Phone</label>
        <input
            type="tel"
            id="phone"
            name="phone"
            aria-describedby="phoneHelp phoneError"
        >
        <span id="phoneHelp" class="help-text">Format: 123-456-7890</span>
        <span id="phoneError" class="error" role="alert"></span>
    </div>

    <!-- Required field indicator -->
    <label for="name">
        Name <span aria-label="required">*</span>
    </label>
</form>
```

## Form Styling

```css
/* Base form styles */
.form-group {
    margin-bottom: 1.5rem;
}

label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
}

input,
textarea,
select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ccc;
    border-radius: 4px;
    font-size: 1rem;
}

input:focus,
textarea:focus,
select:focus {
    outline: none;
    border-color: #3498db;
    box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
}

/* Validation states */
input:valid {
    border-color: #2ecc71;
}

input:invalid:not(:placeholder-shown) {
    border-color: #e74c3c;
}

/* Error messages */
.error-message {
    color: #e74c3c;
    font-size: 0.875rem;
    margin-top: 0.25rem;
}

/* Submit button */
button[type="submit"] {
    background: #3498db;
    color: white;
    padding: 0.75rem 2rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 1rem;
}

button[type="submit"]:hover {
    background: #2980b9;
}

button[type="submit"]:disabled {
    background: #ccc;
    cursor: not-allowed;
}
```

## Summary

- Use semantic HTML with proper labels
- Leverage HTML5 validation attributes
- Add custom JavaScript validation when needed
- Handle form submission with AJAX for better UX
- Make forms accessible with ARIA attributes
- Style validation states clearly
- Always validate on the server too

## Next Steps

Learn about [JSON & Data Formats](/guide/skills/json-data) to work with form data effectively.
