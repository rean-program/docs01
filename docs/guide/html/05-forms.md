# Forms and Input

Learn how to create interactive forms to collect user input in HTML.

## Form Basics

The `<form>` element creates a container for user input:

```html
<form action="/submit" method="POST">
    <label for="name">Name:</label>
    <input type="text" id="name" name="name">
    <button type="submit">Submit</button>
</form>
```

### Form Attributes

| Attribute | Purpose |
|-----------|---------|
| `action` | URL to submit form data |
| `method` | HTTP method (GET or POST) |
| `enctype` | How data is encoded |
| `autocomplete` | Enable/disable autocomplete |
| `novalidate` | Disable browser validation |

```html
<form action="/upload"
      method="POST"
      enctype="multipart/form-data"
      autocomplete="on">
    <!-- form content -->
</form>
```

## Input Types

### Text Input

```html
<label for="username">Username:</label>
<input type="text"
       id="username"
       name="username"
       placeholder="Enter username"
       maxlength="20"
       required>
```

### Password Input

```html
<label for="password">Password:</label>
<input type="password"
       id="password"
       name="password"
       minlength="8"
       required>
```

### Email Input

```html
<label for="email">Email:</label>
<input type="email"
       id="email"
       name="email"
       placeholder="you@example.com"
       required>
```

### Number Input

```html
<label for="age">Age:</label>
<input type="number"
       id="age"
       name="age"
       min="0"
       max="120"
       step="1">

<label for="price">Price:</label>
<input type="number"
       id="price"
       name="price"
       min="0"
       step="0.01">
```

### Tel (Phone) Input

```html
<label for="phone">Phone:</label>
<input type="tel"
       id="phone"
       name="phone"
       pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
       placeholder="123-456-7890">
```

### URL Input

```html
<label for="website">Website:</label>
<input type="url"
       id="website"
       name="website"
       placeholder="https://example.com">
```

### Search Input

```html
<label for="search">Search:</label>
<input type="search"
       id="search"
       name="q"
       placeholder="Search...">
```

### Date and Time Inputs

```html
<!-- Date -->
<label for="date">Date:</label>
<input type="date" id="date" name="date">

<!-- Time -->
<label for="time">Time:</label>
<input type="time" id="time" name="time">

<!-- Date and Time -->
<label for="datetime">Date & Time:</label>
<input type="datetime-local" id="datetime" name="datetime">

<!-- Month -->
<label for="month">Month:</label>
<input type="month" id="month" name="month">

<!-- Week -->
<label for="week">Week:</label>
<input type="week" id="week" name="week">
```

### Color Picker

```html
<label for="color">Choose color:</label>
<input type="color" id="color" name="color" value="#ff0000">
```

### Range Slider

```html
<label for="volume">Volume:</label>
<input type="range"
       id="volume"
       name="volume"
       min="0"
       max="100"
       value="50"
       step="10">
```

### File Upload

```html
<label for="file">Upload file:</label>
<input type="file"
       id="file"
       name="file"
       accept=".pdf,.doc,.docx">

<!-- Multiple files -->
<input type="file"
       id="photos"
       name="photos"
       accept="image/*"
       multiple>
```

### Hidden Input

```html
<input type="hidden" name="user_id" value="12345">
```

## Checkbox and Radio

### Checkboxes

For multiple selections:

```html
<fieldset>
    <legend>Select your interests:</legend>

    <label>
        <input type="checkbox" name="interests" value="music">
        Music
    </label>

    <label>
        <input type="checkbox" name="interests" value="sports">
        Sports
    </label>

    <label>
        <input type="checkbox" name="interests" value="reading" checked>
        Reading
    </label>
</fieldset>
```

### Radio Buttons

For single selection from a group:

```html
<fieldset>
    <legend>Select payment method:</legend>

    <label>
        <input type="radio" name="payment" value="credit" required>
        Credit Card
    </label>

    <label>
        <input type="radio" name="payment" value="debit">
        Debit Card
    </label>

    <label>
        <input type="radio" name="payment" value="paypal">
        PayPal
    </label>
</fieldset>
```

## Select Dropdown

### Basic Select

```html
<label for="country">Country:</label>
<select id="country" name="country">
    <option value="">Select a country</option>
    <option value="us">United States</option>
    <option value="uk">United Kingdom</option>
    <option value="ca">Canada</option>
    <option value="au" selected>Australia</option>
</select>
```

### Option Groups

```html
<label for="car">Choose a car:</label>
<select id="car" name="car">
    <optgroup label="Swedish Cars">
        <option value="volvo">Volvo</option>
        <option value="saab">Saab</option>
    </optgroup>
    <optgroup label="German Cars">
        <option value="mercedes">Mercedes</option>
        <option value="audi">Audi</option>
        <option value="bmw">BMW</option>
    </optgroup>
</select>
```

### Multiple Select

```html
<label for="skills">Select skills:</label>
<select id="skills" name="skills" multiple size="5">
    <option value="html">HTML</option>
    <option value="css">CSS</option>
    <option value="js">JavaScript</option>
    <option value="python">Python</option>
    <option value="java">Java</option>
</select>
```

## Textarea

For multi-line text input:

```html
<label for="message">Message:</label>
<textarea id="message"
          name="message"
          rows="5"
          cols="40"
          placeholder="Enter your message..."
          maxlength="500"></textarea>
```

## Datalist

Autocomplete suggestions for inputs:

```html
<label for="browser">Choose a browser:</label>
<input type="text" id="browser" name="browser" list="browsers">
<datalist id="browsers">
    <option value="Chrome">
    <option value="Firefox">
    <option value="Safari">
    <option value="Edge">
    <option value="Opera">
</datalist>
```

## Buttons

### Submit Button

```html
<button type="submit">Submit Form</button>

<!-- Or using input -->
<input type="submit" value="Submit Form">
```

### Reset Button

```html
<button type="reset">Reset Form</button>

<!-- Or using input -->
<input type="reset" value="Reset Form">
```

### Regular Button

```html
<button type="button" onclick="doSomething()">Click Me</button>
```

### Image Button

```html
<input type="image" src="submit-button.png" alt="Submit">
```

## Labels and Accessibility

### Explicit Labels

```html
<label for="email">Email Address:</label>
<input type="email" id="email" name="email">
```

### Implicit Labels

```html
<label>
    Email Address:
    <input type="email" name="email">
</label>
```

::: tip
Always use labels! They improve accessibility and usability by making the label text clickable.
:::

## Fieldset and Legend

Group related form elements:

```html
<form>
    <fieldset>
        <legend>Personal Information</legend>
        <label for="fname">First Name:</label>
        <input type="text" id="fname" name="fname">

        <label for="lname">Last Name:</label>
        <input type="text" id="lname" name="lname">
    </fieldset>

    <fieldset>
        <legend>Contact Information</legend>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email">

        <label for="phone">Phone:</label>
        <input type="tel" id="phone" name="phone">
    </fieldset>
</form>
```

## Form Validation

### Required Fields

```html
<input type="text" name="username" required>
```

### Pattern Validation

```html
<!-- US Phone number -->
<input type="tel"
       pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
       title="Format: 123-456-7890">

<!-- Postal code -->
<input type="text"
       pattern="[0-9]{5}"
       title="5-digit postal code">
```

### Length Validation

```html
<input type="text"
       minlength="3"
       maxlength="20"
       name="username">

<textarea maxlength="500"></textarea>
```

### Range Validation

```html
<input type="number" min="1" max="100" name="quantity">
<input type="date" min="2024-01-01" max="2024-12-31">
```

### Custom Validation Messages

```html
<input type="email"
       required
       oninvalid="this.setCustomValidity('Please enter a valid email')"
       oninput="this.setCustomValidity('')">
```

## Input Attributes Reference

| Attribute | Purpose |
|-----------|---------|
| `name` | Field name for form data |
| `value` | Default/current value |
| `placeholder` | Hint text |
| `required` | Must be filled |
| `disabled` | Cannot be edited |
| `readonly` | Cannot be changed |
| `autofocus` | Focus on page load |
| `autocomplete` | on/off |
| `pattern` | Regex validation |
| `min`, `max` | Value range |
| `minlength`, `maxlength` | Character length |
| `step` | Number increment |
| `multiple` | Multiple values allowed |

## Complete Form Example

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration Form</title>
</head>
<body>
    <h1>Registration Form</h1>

    <form action="/register" method="POST">
        <fieldset>
            <legend>Account Information</legend>

            <div>
                <label for="username">Username:</label>
                <input type="text"
                       id="username"
                       name="username"
                       minlength="3"
                       maxlength="20"
                       pattern="[a-zA-Z0-9_]+"
                       title="Letters, numbers, and underscores only"
                       required>
            </div>

            <div>
                <label for="email">Email:</label>
                <input type="email"
                       id="email"
                       name="email"
                       placeholder="you@example.com"
                       required>
            </div>

            <div>
                <label for="password">Password:</label>
                <input type="password"
                       id="password"
                       name="password"
                       minlength="8"
                       required>
            </div>
        </fieldset>

        <fieldset>
            <legend>Personal Information</legend>

            <div>
                <label for="fullname">Full Name:</label>
                <input type="text" id="fullname" name="fullname" required>
            </div>

            <div>
                <label for="dob">Date of Birth:</label>
                <input type="date" id="dob" name="dob">
            </div>

            <div>
                <label for="phone">Phone:</label>
                <input type="tel"
                       id="phone"
                       name="phone"
                       pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
                       placeholder="123-456-7890">
            </div>

            <div>
                <label for="country">Country:</label>
                <select id="country" name="country" required>
                    <option value="">Select country</option>
                    <option value="us">United States</option>
                    <option value="uk">United Kingdom</option>
                    <option value="ca">Canada</option>
                </select>
            </div>
        </fieldset>

        <fieldset>
            <legend>Preferences</legend>

            <div>
                <p>Notification preferences:</p>
                <label>
                    <input type="checkbox" name="notify" value="email" checked>
                    Email notifications
                </label>
                <label>
                    <input type="checkbox" name="notify" value="sms">
                    SMS notifications
                </label>
            </div>

            <div>
                <p>Account type:</p>
                <label>
                    <input type="radio" name="account_type" value="personal" checked>
                    Personal
                </label>
                <label>
                    <input type="radio" name="account_type" value="business">
                    Business
                </label>
            </div>
        </fieldset>

        <fieldset>
            <legend>Additional Information</legend>

            <div>
                <label for="bio">Bio:</label>
                <textarea id="bio"
                          name="bio"
                          rows="4"
                          maxlength="500"
                          placeholder="Tell us about yourself..."></textarea>
            </div>

            <div>
                <label for="avatar">Profile Picture:</label>
                <input type="file"
                       id="avatar"
                       name="avatar"
                       accept="image/*">
            </div>
        </fieldset>

        <div>
            <label>
                <input type="checkbox" name="terms" required>
                I agree to the Terms and Conditions
            </label>
        </div>

        <div>
            <button type="submit">Register</button>
            <button type="reset">Clear Form</button>
        </div>
    </form>
</body>
</html>
```

## Exercises

### Exercise 1: Login Form
Create a simple login form with email and password.

::: details Solution
```html
<form action="/login" method="POST">
    <h2>Login</h2>

    <div>
        <label for="email">Email:</label>
        <input type="email"
               id="email"
               name="email"
               required
               autofocus>
    </div>

    <div>
        <label for="password">Password:</label>
        <input type="password"
               id="password"
               name="password"
               minlength="8"
               required>
    </div>

    <div>
        <label>
            <input type="checkbox" name="remember">
            Remember me
        </label>
    </div>

    <button type="submit">Login</button>
</form>
```
:::

### Exercise 2: Contact Form
Create a contact form with name, email, subject, and message.

::: details Solution
```html
<form action="/contact" method="POST">
    <h2>Contact Us</h2>

    <div>
        <label for="name">Name:</label>
        <input type="text" id="name" name="name" required>
    </div>

    <div>
        <label for="email">Email:</label>
        <input type="email" id="email" name="email" required>
    </div>

    <div>
        <label for="subject">Subject:</label>
        <select id="subject" name="subject" required>
            <option value="">Select a subject</option>
            <option value="general">General Inquiry</option>
            <option value="support">Technical Support</option>
            <option value="billing">Billing Question</option>
            <option value="feedback">Feedback</option>
        </select>
    </div>

    <div>
        <label for="message">Message:</label>
        <textarea id="message"
                  name="message"
                  rows="6"
                  required
                  placeholder="How can we help you?"></textarea>
    </div>

    <button type="submit">Send Message</button>
</form>
```
:::

### Exercise 3: Survey Form
Create a survey form with various input types.

::: details Solution
```html
<form action="/survey" method="POST">
    <h2>Customer Survey</h2>

    <fieldset>
        <legend>Rate Our Service</legend>

        <div>
            <label>How satisfied are you?</label>
            <label><input type="radio" name="satisfaction" value="5"> Very Satisfied</label>
            <label><input type="radio" name="satisfaction" value="4"> Satisfied</label>
            <label><input type="radio" name="satisfaction" value="3"> Neutral</label>
            <label><input type="radio" name="satisfaction" value="2"> Dissatisfied</label>
            <label><input type="radio" name="satisfaction" value="1"> Very Dissatisfied</label>
        </div>

        <div>
            <label for="rating">Overall Rating (1-10):</label>
            <input type="range" id="rating" name="rating" min="1" max="10" value="5">
        </div>
    </fieldset>

    <fieldset>
        <legend>About You</legend>

        <div>
            <label for="age-group">Age Group:</label>
            <select id="age-group" name="age_group">
                <option value="under-18">Under 18</option>
                <option value="18-24">18-24</option>
                <option value="25-34">25-34</option>
                <option value="35-44">35-44</option>
                <option value="45+">45+</option>
            </select>
        </div>

        <div>
            <label>Which features do you use?</label>
            <label><input type="checkbox" name="features" value="dashboard"> Dashboard</label>
            <label><input type="checkbox" name="features" value="reports"> Reports</label>
            <label><input type="checkbox" name="features" value="settings"> Settings</label>
            <label><input type="checkbox" name="features" value="support"> Support</label>
        </div>
    </fieldset>

    <div>
        <label for="comments">Additional Comments:</label>
        <textarea id="comments" name="comments" rows="4"></textarea>
    </div>

    <button type="submit">Submit Survey</button>
</form>
```
:::

## Summary

- `<form>` wraps all form elements with `action` and `method`
- Many input types: text, email, password, number, date, etc.
- Use checkboxes for multiple selections, radio for single choice
- `<select>` creates dropdown menus
- `<textarea>` for multi-line text
- Always use `<label>` for accessibility
- Group related fields with `<fieldset>` and `<legend>`
- Built-in validation: required, pattern, min/max, etc.

## Next Steps

Continue to [Semantic HTML](/guide/html/06-semantic) to learn about meaningful HTML structure.
