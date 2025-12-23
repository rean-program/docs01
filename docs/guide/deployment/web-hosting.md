# Web Hosting & Deployment

Once you've built a website, you need to deploy it so others can access it. This guide covers hosting options and deployment strategies.

## Hosting Types

### Static Hosting

For websites with only HTML, CSS, and JavaScript (no server-side code).

**Best for:**
- Portfolio sites
- Landing pages
- Documentation sites
- Blogs (generated)

**Popular platforms:**
- GitHub Pages (free)
- Netlify (free tier)
- Vercel (free tier)
- Cloudflare Pages (free)

### Dynamic Hosting

For applications with server-side code and databases.

**Best for:**
- Web applications
- E-commerce sites
- APIs
- CMS-powered sites

**Popular platforms:**
- Vercel
- Railway
- Render
- DigitalOcean
- AWS, Google Cloud, Azure

## Free Static Hosting

### GitHub Pages

Host directly from your GitHub repository.

**Setup:**
1. Push code to GitHub repository
2. Go to repository Settings → Pages
3. Select branch (usually `main`) and folder
4. Your site is live at `username.github.io/repo-name`

```bash
# Basic workflow
git add .
git commit -m "Update website"
git push origin main
# Site auto-deploys!
```

**Custom domain:**
1. Add `CNAME` file with your domain
2. Configure DNS at your registrar

### Netlify

Automatic deploys with modern features.

**Setup:**
1. Sign up at netlify.com
2. Connect your GitHub repository
3. Configure build settings (if needed)
4. Deploy!

**Features:**
- Automatic HTTPS
- Form handling
- Serverless functions
- Deploy previews for PRs
- Instant rollbacks

**netlify.toml configuration:**
```toml
[build]
  publish = "dist"
  command = "npm run build"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Vercel

Optimized for frontend frameworks.

**Setup:**
1. Sign up at vercel.com
2. Import Git repository
3. Configure framework preset
4. Deploy!

**Features:**
- Automatic framework detection
- Edge functions
- Analytics
- Preview deployments
- Serverless API routes

**vercel.json configuration:**
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Cloudflare Pages

Fast global CDN with generous free tier.

**Setup:**
1. Sign up at cloudflare.com
2. Go to Pages → Create project
3. Connect Git repository
4. Configure build settings
5. Deploy!

## Domain Names

### Getting a Domain

Popular registrars:
- **Namecheap** - Affordable, good interface
- **Google Domains** - Simple, integrated
- **Cloudflare** - At-cost pricing
- **Porkbun** - Low prices

### DNS Configuration

Common DNS records:

| Record | Purpose | Example |
|--------|---------|---------|
| **A** | Points to IPv4 address | `192.168.1.1` |
| **AAAA** | Points to IPv6 address | `2001:db8::1` |
| **CNAME** | Alias to another domain | `www` → `example.com` |
| **TXT** | Text record (verification) | `v=spf1...` |
| **MX** | Mail server | `mail.example.com` |

**Example setup for Netlify:**
```
Type    Name    Value
A       @       75.2.60.5
CNAME   www     your-site.netlify.app
```

### HTTPS/SSL

Most platforms provide free SSL certificates:
- Automatic with Netlify, Vercel, Cloudflare
- Let's Encrypt for self-managed servers

## Deployment Strategies

### Manual Deployment

Upload files directly (FTP, SFTP).

```bash
# Using rsync
rsync -avz ./dist/ user@server:/var/www/html/
```

**Pros:** Simple, full control
**Cons:** Error-prone, no automation

### Git-based Deployment

Push to Git, site auto-deploys.

```bash
git push origin main  # Triggers deployment
```

**Pros:** Automated, version controlled
**Cons:** Requires initial setup

### CI/CD Pipeline

Automated testing and deployment.

**GitHub Actions example:**
```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Install dependencies
        run: npm ci

      - name: Run tests
        run: npm test

      - name: Build
        run: npm run build

      - name: Deploy to Netlify
        uses: netlify/actions/cli@master
        with:
          args: deploy --prod --dir=dist
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## Environment Variables

Store sensitive data outside your code.

### Local Development

**.env file:**
```bash
API_KEY=your_secret_key
DATABASE_URL=postgres://localhost/mydb
NODE_ENV=development
```

**.gitignore:**
```bash
# Never commit .env files!
.env
.env.local
.env.production
```

### Production

Set in hosting platform's dashboard:
- Netlify: Site settings → Environment variables
- Vercel: Project settings → Environment variables
- GitHub Actions: Repository secrets

### Using Environment Variables

```javascript
// Node.js
const apiKey = process.env.API_KEY;

// Vite
const apiKey = import.meta.env.VITE_API_KEY;

// Create React App
const apiKey = process.env.REACT_APP_API_KEY;
```

## Build Process

### Common Build Commands

```json
// package.json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  }
}
```

### Build Output

```
project/
├── src/           # Source code
├── dist/          # Built files (deploy this!)
│   ├── index.html
│   ├── assets/
│   │   ├── main.js
│   │   └── style.css
│   └── images/
└── node_modules/  # Don't deploy!
```

### Typical Build Steps

1. Install dependencies: `npm install`
2. Run tests: `npm test`
3. Build: `npm run build`
4. Deploy `dist/` folder

## Deployment Checklist

### Before Deploying

- [ ] All tests pass
- [ ] No console errors
- [ ] Build completes successfully
- [ ] Environment variables configured
- [ ] Images optimized
- [ ] Meta tags set (title, description)
- [ ] Favicon added

### After Deploying

- [ ] Site loads correctly
- [ ] HTTPS working
- [ ] All pages accessible
- [ ] Forms working
- [ ] Links not broken
- [ ] Mobile responsive
- [ ] Performance acceptable

## Rollback Strategies

### Git-based Rollback

```bash
# Revert to previous commit
git revert HEAD
git push origin main

# Or reset to specific commit
git reset --hard <commit-hash>
git push -f origin main  # Force push (careful!)
```

### Platform Rollback

Most platforms keep deployment history:
- Netlify: Deploys → Select previous deploy → Publish
- Vercel: Deployments → Promote to Production
- GitHub Pages: Revert commit in Git

## Monitoring

### Error Tracking

- **Sentry** - Error monitoring
- **LogRocket** - Session replay
- **Rollbar** - Error tracking

### Analytics

- **Google Analytics** - Traffic analytics
- **Plausible** - Privacy-focused
- **Vercel Analytics** - Performance metrics

### Uptime Monitoring

- **UptimeRobot** - Free monitoring
- **Pingdom** - Advanced monitoring
- **Better Uptime** - Status pages

## Cost Comparison

| Platform | Free Tier | Paid Starting |
|----------|-----------|---------------|
| GitHub Pages | Unlimited | - |
| Netlify | 100GB/month | $19/month |
| Vercel | 100GB/month | $20/month |
| Cloudflare Pages | Unlimited | $20/month |
| Render | 100GB/month | $7/month |

## Summary

- Static sites can be hosted for free
- Git-based deployment automates updates
- Use environment variables for secrets
- Set up CI/CD for reliable deployments
- Always test before deploying
- Monitor your production site

## Next Steps

Learn about [APIs & Data Fetching](/guide/skills/apis-data-fetching) to connect your frontend to backend services.
