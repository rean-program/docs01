# Web Security Basics

Web security protects your application and users from attacks. Understanding common vulnerabilities and how to prevent them is essential for every web developer.

## Why Security Matters

- Protects user data and privacy
- Maintains trust and reputation
- Prevents financial losses
- Ensures legal compliance (GDPR, etc.)
- Avoids service disruption

## Common Vulnerabilities (OWASP Top 10)

### 1. Cross-Site Scripting (XSS)

Attackers inject malicious scripts into web pages viewed by other users.

**Types:**
- **Stored XSS**: Script saved in database
- **Reflected XSS**: Script in URL parameters
- **DOM-based XSS**: Script manipulates client-side code

```javascript
// ❌ Vulnerable: Directly inserting user input
element.innerHTML = userInput;
document.write(userInput);

// User input: <script>stealCookies()</script>
```

**Prevention:**

```javascript
// ✅ Use textContent instead of innerHTML
element.textContent = userInput;

// ✅ Sanitize HTML if needed
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);

// ✅ Use framework's built-in escaping
// React: {userInput} is automatically escaped
// Vue: {{ userInput }} is automatically escaped
```

### 2. Cross-Site Request Forgery (CSRF)

Tricks users into performing unwanted actions on a site where they're authenticated.

```html
<!-- Attacker's page tricks user into deleting their account -->
<img src="https://bank.com/transfer?to=attacker&amount=1000">
```

**Prevention:**

```javascript
// ✅ Use CSRF tokens
<form method="POST">
    <input type="hidden" name="csrf_token" value="random-token">
</form>

// ✅ Check request origin
if (request.headers.origin !== 'https://yoursite.com') {
    return forbidden();
}

// ✅ Use SameSite cookies
Set-Cookie: session=abc123; SameSite=Strict; Secure; HttpOnly
```

### 3. SQL Injection

Attackers inject malicious SQL queries through user input.

```javascript
// ❌ Vulnerable: String concatenation
const query = `SELECT * FROM users WHERE id = ${userId}`;
// If userId = "1; DROP TABLE users;" - disaster!

// ✅ Use parameterized queries
const query = 'SELECT * FROM users WHERE id = ?';
db.query(query, [userId]);

// ✅ Or use an ORM
const user = await User.findById(userId);
```

### 4. Insecure Authentication

Weak login systems that can be bypassed or exploited.

**Common Issues:**
- Weak passwords allowed
- No rate limiting
- Session not invalidated on logout
- Sensitive data in URLs

**Prevention:**

```javascript
// ✅ Enforce strong passwords
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

// ✅ Rate limit login attempts
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5 // 5 attempts per window
});

// ✅ Secure session handling
app.use(session({
    secret: process.env.SESSION_SECRET,
    cookie: {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));
```

### 5. Sensitive Data Exposure

Failing to protect sensitive information.

**Prevention:**

```javascript
// ✅ Use HTTPS everywhere
// ✅ Never log sensitive data
console.log(user); // ❌ May include password
console.log(user.email); // ✅ Log only what's needed

// ✅ Hash passwords
import bcrypt from 'bcrypt';
const hashedPassword = await bcrypt.hash(password, 10);

// ✅ Encrypt sensitive data
// ✅ Don't expose in URLs
// ❌ /reset-password?token=abc123&email=user@example.com
// ✅ /reset-password?token=abc123
```

## Input Validation

Never trust user input. Validate everything.

### Client-Side Validation

```html
<!-- HTML5 validation -->
<input type="email" required minlength="5" maxlength="100">
<input type="number" min="1" max="100">
<input pattern="[A-Za-z]{3,}">
```

```javascript
// JavaScript validation
function validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validateForm(data) {
    const errors = [];

    if (!data.name || data.name.length < 2) {
        errors.push('Name must be at least 2 characters');
    }

    if (!validateEmail(data.email)) {
        errors.push('Invalid email address');
    }

    return errors;
}
```

### Server-Side Validation (Required!)

```javascript
// Always validate on server - client validation can be bypassed
app.post('/register', (req, res) => {
    const { email, password, name } = req.body;

    // Validate types
    if (typeof email !== 'string') {
        return res.status(400).json({ error: 'Invalid email' });
    }

    // Validate format
    if (!isValidEmail(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate length
    if (password.length < 8) {
        return res.status(400).json({ error: 'Password too short' });
    }

    // Sanitize input
    const sanitizedName = sanitize(name);

    // Proceed with registration...
});
```

## Secure Headers

HTTP headers that improve security.

```javascript
// Using Helmet.js in Express
import helmet from 'helmet';
app.use(helmet());

// Or set manually
app.use((req, res, next) => {
    // Prevent clickjacking
    res.setHeader('X-Frame-Options', 'DENY');

    // Prevent MIME sniffing
    res.setHeader('X-Content-Type-Options', 'nosniff');

    // XSS protection
    res.setHeader('X-XSS-Protection', '1; mode=block');

    // Content Security Policy
    res.setHeader('Content-Security-Policy',
        "default-src 'self'; script-src 'self'; style-src 'self'");

    // Strict Transport Security
    res.setHeader('Strict-Transport-Security',
        'max-age=31536000; includeSubDomains');

    next();
});
```

### Content Security Policy (CSP)

Controls what resources can be loaded.

```html
<meta http-equiv="Content-Security-Policy"
      content="default-src 'self';
               script-src 'self' https://trusted.cdn.com;
               style-src 'self' 'unsafe-inline';
               img-src 'self' data: https:;">
```

## Password Security

### Hashing Passwords

```javascript
import bcrypt from 'bcrypt';

// Hash password before storing
async function hashPassword(password) {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
}

// Verify password on login
async function verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}
```

### Password Requirements

```javascript
function validatePassword(password) {
    const requirements = {
        minLength: password.length >= 8,
        hasUppercase: /[A-Z]/.test(password),
        hasLowercase: /[a-z]/.test(password),
        hasNumber: /\d/.test(password),
        hasSpecial: /[!@#$%^&*]/.test(password)
    };

    const isValid = Object.values(requirements).every(Boolean);
    return { isValid, requirements };
}
```

## HTTPS

Always use HTTPS in production.

**Benefits:**
- Encrypts data in transit
- Prevents man-in-the-middle attacks
- Required for many modern features
- SEO ranking factor

**Implementation:**
- Get SSL certificate (free with Let's Encrypt)
- Redirect HTTP to HTTPS
- Use secure cookies

```javascript
// Redirect HTTP to HTTPS
app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] !== 'https') {
        return res.redirect(`https://${req.hostname}${req.url}`);
    }
    next();
});
```

## Secure Cookie Settings

```javascript
res.cookie('session', sessionId, {
    httpOnly: true,    // Can't be accessed by JavaScript
    secure: true,      // Only sent over HTTPS
    sameSite: 'strict', // Prevents CSRF
    maxAge: 3600000,   // 1 hour expiry
    path: '/',         // Cookie scope
    domain: '.example.com'  // Domain scope
});
```

| Flag | Purpose |
|------|---------|
| `httpOnly` | Prevents XSS from reading cookie |
| `secure` | HTTPS only |
| `sameSite` | CSRF protection |
| `maxAge` | Limits exposure time |

## Environment Variables

Never hardcode secrets.

```bash
# .env file (never commit!)
DATABASE_URL=postgres://user:pass@localhost/db
API_KEY=secret_key_here
JWT_SECRET=your_jwt_secret
```

```javascript
// Access in code
const apiKey = process.env.API_KEY;

// Check required variables
const requiredEnvVars = ['DATABASE_URL', 'API_KEY', 'JWT_SECRET'];
for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
        throw new Error(`Missing required env var: ${envVar}`);
    }
}
```

```gitignore
# .gitignore
.env
.env.local
.env.production
```

## Security Checklist

### Authentication
- [ ] Strong password requirements
- [ ] Rate limiting on login
- [ ] Secure password reset flow
- [ ] Session timeout
- [ ] Logout invalidates session

### Data Protection
- [ ] HTTPS enabled
- [ ] Passwords hashed with bcrypt
- [ ] Sensitive data encrypted
- [ ] No secrets in code/logs

### Input/Output
- [ ] All input validated server-side
- [ ] Output encoded/escaped
- [ ] File uploads validated
- [ ] SQL injection prevented

### Headers & Cookies
- [ ] Security headers set
- [ ] CSP configured
- [ ] Cookies are HttpOnly, Secure, SameSite
- [ ] CSRF tokens used

### Dependencies
- [ ] Regular `npm audit`
- [ ] Dependencies updated
- [ ] No known vulnerabilities

## Tools for Security

### Vulnerability Scanning

```bash
# Check npm packages
npm audit
npm audit fix

# Snyk for deeper analysis
npx snyk test
```

### Security Headers Testing
- [securityheaders.com](https://securityheaders.com)
- [Mozilla Observatory](https://observatory.mozilla.org)

### OWASP Resources
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [OWASP Cheat Sheets](https://cheatsheetseries.owasp.org/)

## Summary

- Never trust user input - validate everything
- Prevent XSS by escaping output
- Use parameterized queries to prevent SQL injection
- Implement CSRF protection
- Use HTTPS and secure cookie settings
- Keep secrets in environment variables
- Regularly audit dependencies
- Set security headers

## What's Next?

You now have a comprehensive understanding of web development fundamentals. Start building with the [HTML Tutorial](/guide/html/) or explore other topics in the guide.
