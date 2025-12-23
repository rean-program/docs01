# Authentication in Express.js

Authentication verifies who a user is. This tutorial covers session-based authentication, JWT tokens, and OAuth with Passport.js.

## Authentication vs Authorization

- **Authentication**: Verifying identity (Who are you?)
- **Authorization**: Verifying permissions (What can you do?)

## Password Hashing

Never store plain-text passwords. Use bcrypt for secure hashing:

```bash
npm install bcrypt
```

```javascript
const bcrypt = require('bcrypt');

// Hash password
const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

// Verify password
const verifyPassword = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

// Usage
const hash = await hashPassword('mypassword123');
// $2b$10$N9qo8uLOickgx2ZMRZoMye...

const isValid = await verifyPassword('mypassword123', hash);
// true
```

## Session-Based Authentication

Sessions store user data on the server, with a session ID in a cookie.

### Setup

```bash
npm install express-session connect-mongo
```

```javascript
const express = require('express');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI
  }),
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 1 day
  }
}));
```

### Implementation

```javascript
const bcrypt = require('bcrypt');

// Register
app.post('/auth/register', async (req, res) => {
  const { email, password, name } = req.body;

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'Email already registered' });
  }

  // Hash password and create user
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    password: hashedPassword,
    name
  });

  // Create session
  req.session.userId = user.id;

  res.status(201).json({
    message: 'Registration successful',
    user: { id: user.id, email: user.email, name: user.name }
  });
});

// Login
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const isValid = await bcrypt.compare(password, user.password);
  if (!isValid) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Create session
  req.session.userId = user.id;

  res.json({
    message: 'Login successful',
    user: { id: user.id, email: user.email, name: user.name }
  });
});

// Logout
app.post('/auth/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.clearCookie('connect.sid');
    res.json({ message: 'Logged out' });
  });
});

// Auth middleware
const requireAuth = async (req, res, next) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Authentication required' });
  }

  const user = await User.findById(req.session.userId);
  if (!user) {
    return res.status(401).json({ error: 'User not found' });
  }

  req.user = user;
  next();
};

// Protected route
app.get('/profile', requireAuth, (req, res) => {
  res.json({ user: req.user });
});
```

## JWT Authentication

JSON Web Tokens are stateless and work well for APIs.

### Setup

```bash
npm install jsonwebtoken
```

### Implementation

```javascript
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = '7d';

// Generate tokens
const generateTokens = (userId) => {
  const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
  return { accessToken, refreshToken };
};

// Register
app.post('/auth/register', async (req, res) => {
  const { email, password, name } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ error: 'Email already registered' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await User.create({
    email,
    password: hashedPassword,
    name
  });

  const tokens = generateTokens(user.id);

  res.status(201).json({
    message: 'Registration successful',
    user: { id: user.id, email: user.email, name: user.name },
    ...tokens
  });
});

// Login
app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  const tokens = generateTokens(user.id);

  res.json({
    message: 'Login successful',
    user: { id: user.id, email: user.email, name: user.name },
    ...tokens
  });
});

// Refresh token
app.post('/auth/refresh', async (req, res) => {
  const { refreshToken } = req.body;

  try {
    const decoded = jwt.verify(refreshToken, JWT_SECRET);
    const tokens = generateTokens(decoded.userId);
    res.json(tokens);
  } catch (err) {
    res.status(401).json({ error: 'Invalid refresh token' });
  }
});

// Auth middleware
const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Protected route
app.get('/profile', authenticate, (req, res) => {
  res.json({ user: req.user });
});
```

## Passport.js

Passport is authentication middleware with 500+ strategies.

### Setup

```bash
npm install passport passport-local passport-jwt
```

### Local Strategy (Username/Password)

```javascript
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

passport.use(new LocalStrategy(
  { usernameField: 'email' },
  async (email, password, done) => {
    try {
      const user = await User.findOne({ email });

      if (!user) {
        return done(null, false, { message: 'Invalid credentials' });
      }

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        return done(null, false, { message: 'Invalid credentials' });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// Session serialization (for session-based auth)
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Usage
app.use(passport.initialize());
app.use(passport.session()); // For session-based auth

app.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({ user: req.user });
});
```

### JWT Strategy

```javascript
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

passport.use(new JwtStrategy(
  {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET
  },
  async (payload, done) => {
    try {
      const user = await User.findById(payload.userId);

      if (!user) {
        return done(null, false);
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// Usage
app.get('/profile',
  passport.authenticate('jwt', { session: false }),
  (req, res) => {
    res.json({ user: req.user });
  }
);
```

### OAuth (Google)

```bash
npm install passport-google-oauth20
```

```javascript
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/auth/google/callback'
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      // Find or create user
      let user = await User.findOne({ googleId: profile.id });

      if (!user) {
        user = await User.create({
          googleId: profile.id,
          email: profile.emails[0].value,
          name: profile.displayName,
          avatar: profile.photos[0]?.value
        });
      }

      return done(null, user);
    } catch (err) {
      return done(err);
    }
  }
));

// Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Generate JWT and redirect
    const token = jwt.sign({ userId: req.user.id }, JWT_SECRET);
    res.redirect(`/auth/success?token=${token}`);
  }
);
```

## Role-Based Authorization

```javascript
// Authorization middleware
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }

    next();
  };
};

// Usage
app.get('/admin/users',
  authenticate,
  authorize('admin'),
  async (req, res) => {
    const users = await User.find();
    res.json(users);
  }
);

app.delete('/posts/:id',
  authenticate,
  authorize('admin', 'moderator'),
  async (req, res) => {
    await Post.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted' });
  }
);
```

## Security Best Practices

### Rate Limiting

```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 attempts
  message: { error: 'Too many login attempts, try again later' }
});

app.post('/auth/login', loginLimiter, (req, res) => {
  // Login logic
});
```

### Account Lockout

```javascript
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes

app.post('/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Check if locked
  if (user.lockUntil && user.lockUntil > Date.now()) {
    const remaining = Math.ceil((user.lockUntil - Date.now()) / 1000 / 60);
    return res.status(423).json({
      error: `Account locked. Try again in ${remaining} minutes`
    });
  }

  const isValid = await bcrypt.compare(password, user.password);

  if (!isValid) {
    user.loginAttempts = (user.loginAttempts || 0) + 1;

    if (user.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
      user.lockUntil = Date.now() + LOCK_TIME;
    }

    await user.save();
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  // Reset on successful login
  user.loginAttempts = 0;
  user.lockUntil = null;
  await user.save();

  // Generate token and respond
});
```

### Secure Headers

```javascript
const helmet = require('helmet');
app.use(helmet());
```

## Summary

In this tutorial, you learned:

- Password hashing with bcrypt
- Session-based authentication
- JWT token authentication
- Passport.js strategies
- OAuth integration
- Role-based authorization
- Security best practices

Next, we'll explore [Database Integration](/guide/express/09-database) for persisting data.
