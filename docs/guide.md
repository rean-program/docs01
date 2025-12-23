---
title: Guide
---

# Getting Started

This is a guide for your VitePress documentation.

## Running Translation

### Debug & Test Setup

First, verify your translation setup is working:

```bash
npm run debug
```

This will check:
- ✅ Node.js environment
- ✅ Dependencies installed
- ✅ Translation API connectivity
- ✅ File structure
- ✅ CSS markdown files
- ✅ Output directories
- ✅ Markdown parsing
- ✅ Package.json scripts

### Translate CSS Tutorials

Once debug passes, translate your CSS tutorials:

```bash
# Translate to Khmer
npm run translate:css:km

# Translate to Chinese
npm run translate:css:zh

# Translate to Japanese
npm run translate:css:ja

# Or translate to multiple languages at once
npm run translate -- --lang km,zh,ja
```

### Check Translated Files

After translation completes, check the output:

```bash
# View translated Khmer files
ls -la docs/km/

# View translated Chinese files
ls -la docs/zh/

# View translated Japanese files
ls -la docs/ja/
```

### Troubleshooting

If you encounter errors:

1. **Check dependencies:**
   ```bash
   npm install
   ```

2. **Run debug with verbose output:**
   ```bash
   npm run debug -- --verbose
   ```

3. **Test single file translation:**
   ```bash
   npm run translate:css -- --lang km --file docs/css/basics/intro.md --verbose
   ```

4. **Check translation log:**
   ```bash
   npm run translate:css:km 2>&1 | tee translation.log
   ```
