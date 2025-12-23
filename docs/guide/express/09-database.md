# Database Integration in Express.js

Most applications need to persist data. This tutorial covers integrating Express with MongoDB (using Mongoose) and PostgreSQL (using Prisma).

## MongoDB with Mongoose

Mongoose is an ODM (Object Document Mapper) for MongoDB.

### Setup

```bash
npm install mongoose
```

### Connection

```javascript
// config/database.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;
```

```javascript
// app.js
const connectDB = require('./config/database');

connectDB();
```

### Defining Schemas and Models

```javascript
// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [50, 'Name cannot exceed 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't include in queries by default
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user'
  },
  avatar: String,
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true // Adds createdAt and updatedAt
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Instance method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Static method
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};

// Virtual property
userSchema.virtual('fullName').get(function() {
  return this.name;
});

module.exports = mongoose.model('User', userSchema);
```

```javascript
// models/Post.js
const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tags: [String],
  published: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Index for search
postSchema.index({ title: 'text', content: 'text' });

module.exports = mongoose.model('Post', postSchema);
```

### CRUD Operations

```javascript
// routes/users.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Create
router.post('/', async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(400).json({ error: err.message });
  }
});

// Read all with pagination
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find().skip(skip).limit(limit).sort('-createdAt'),
    User.countDocuments()
  ]);

  res.json({
    data: users,
    page,
    totalPages: Math.ceil(total / limit),
    total
  });
});

// Read one
router.get('/:id', async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

// Update
router.put('/:id', async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

// Delete
router.delete('/:id', async (req, res) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.status(204).send();
});

module.exports = router;
```

### Querying with Mongoose

```javascript
// Find with conditions
const activeUsers = await User.find({ isActive: true });

// Find with projection (select fields)
const users = await User.find({}, 'name email');

// Find with sorting
const users = await User.find().sort({ createdAt: -1 });

// Find with population (join)
const posts = await Post.find()
  .populate('author', 'name email')
  .sort('-createdAt');

// Complex queries
const posts = await Post.find({
  published: true,
  tags: { $in: ['javascript', 'nodejs'] },
  createdAt: { $gte: new Date('2024-01-01') }
})
.populate('author')
.limit(10);

// Aggregation
const stats = await Post.aggregate([
  { $match: { published: true } },
  { $group: {
    _id: '$author',
    totalPosts: { $sum: 1 },
    avgLength: { $avg: { $strLenCP: '$content' } }
  }},
  { $sort: { totalPosts: -1 } }
]);
```

## PostgreSQL with Prisma

Prisma is a modern ORM with great TypeScript support.

### Setup

```bash
npm install prisma @prisma/client
npx prisma init
```

### Schema Definition

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  password  String
  role      Role     @default(USER)
  posts     Post[]
  profile   Profile?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Profile {
  id     Int     @id @default(autoincrement())
  bio    String?
  avatar String?
  user   User    @relation(fields: [userId], references: [id])
  userId Int     @unique
}

model Post {
  id        Int       @id @default(autoincrement())
  title     String
  content   String
  published Boolean   @default(false)
  author    User      @relation(fields: [authorId], references: [id])
  authorId  Int
  tags      Tag[]
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
}

model Tag {
  id    Int    @id @default(autoincrement())
  name  String @unique
  posts Post[]
}

enum Role {
  USER
  ADMIN
}
```

### Migration and Client Generation

```bash
# Create and run migration
npx prisma migrate dev --name init

# Generate client
npx prisma generate
```

### Using Prisma Client

```javascript
// lib/prisma.js
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = prisma;
```

```javascript
// routes/users.js
const express = require('express');
const router = express.Router();
const prisma = require('../lib/prisma');
const bcrypt = require('bcrypt');

// Create
router.post('/', async (req, res) => {
  const { email, name, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    });
    res.status(201).json(user);
  } catch (err) {
    if (err.code === 'P2002') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    throw err;
  }
});

// Read all with pagination
router.get('/', async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        createdAt: true
      }
    }),
    prisma.user.count()
  ]);

  res.json({
    data: users,
    page,
    totalPages: Math.ceil(total / limit),
    total
  });
});

// Read one with relations
router.get('/:id', async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: parseInt(req.params.id) },
    include: {
      profile: true,
      posts: {
        where: { published: true },
        orderBy: { createdAt: 'desc' }
      }
    }
  });

  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }

  res.json(user);
});

// Update
router.put('/:id', async (req, res) => {
  try {
    const user = await prisma.user.update({
      where: { id: parseInt(req.params.id) },
      data: req.body,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        updatedAt: true
      }
    });
    res.json(user);
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    throw err;
  }
});

// Delete
router.delete('/:id', async (req, res) => {
  try {
    await prisma.user.delete({
      where: { id: parseInt(req.params.id) }
    });
    res.status(204).send();
  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'User not found' });
    }
    throw err;
  }
});

module.exports = router;
```

### Advanced Prisma Queries

```javascript
// Filtering
const posts = await prisma.post.findMany({
  where: {
    published: true,
    OR: [
      { title: { contains: 'express' } },
      { content: { contains: 'express' } }
    ]
  }
});

// Relations
const userWithPosts = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: {
      include: {
        tags: true
      }
    }
  }
});

// Create with relations
const post = await prisma.post.create({
  data: {
    title: 'New Post',
    content: 'Content here',
    author: { connect: { id: 1 } },
    tags: {
      connectOrCreate: [
        { where: { name: 'javascript' }, create: { name: 'javascript' } },
        { where: { name: 'express' }, create: { name: 'express' } }
      ]
    }
  },
  include: {
    author: true,
    tags: true
  }
});

// Transactions
const [user, post] = await prisma.$transaction([
  prisma.user.create({ data: userData }),
  prisma.post.create({ data: postData })
]);

// Interactive transaction
await prisma.$transaction(async (tx) => {
  const user = await tx.user.update({
    where: { id: 1 },
    data: { balance: { decrement: 100 } }
  });

  if (user.balance < 0) {
    throw new Error('Insufficient balance');
  }

  await tx.order.create({ data: orderData });
});

// Aggregation
const stats = await prisma.post.aggregate({
  _count: true,
  _avg: { views: true },
  where: { published: true }
});

// Group by
const postsByAuthor = await prisma.post.groupBy({
  by: ['authorId'],
  _count: { id: true },
  orderBy: { _count: { id: 'desc' } }
});
```

## Connection Pooling

### Mongoose

```javascript
mongoose.connect(process.env.MONGODB_URI, {
  maxPoolSize: 10,
  minPoolSize: 5,
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000
});
```

### Prisma

```env
DATABASE_URL="postgresql://user:pass@localhost:5432/db?connection_limit=10&pool_timeout=20"
```

## Error Handling

```javascript
// Generic database error handler
const handleDBError = (err, res) => {
  // Mongoose errors
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ errors });
  }

  if (err.code === 11000) {
    return res.status(400).json({ error: 'Duplicate field value' });
  }

  // Prisma errors
  if (err.code === 'P2002') {
    return res.status(400).json({ error: 'Unique constraint violation' });
  }

  if (err.code === 'P2025') {
    return res.status(404).json({ error: 'Record not found' });
  }

  // Unknown error
  console.error(err);
  res.status(500).json({ error: 'Database error' });
};
```

## Summary

In this tutorial, you learned:

- MongoDB setup with Mongoose
- PostgreSQL setup with Prisma
- Defining schemas and models
- CRUD operations
- Relationships and population
- Advanced queries and aggregation
- Transactions
- Error handling

Next, we'll explore [Deployment](/guide/express/10-deployment) for taking your app to production.
