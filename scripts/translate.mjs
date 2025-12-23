#!/usr/bin/env node
/**
 * AI Translation Script for VitePress Documentation
 * Uses Google Translate (free, no API key required)
 * 
 * Supports: Khmer (km)
 *
 * Usage:
 *   npm run translate:km                  # Translate all to Khmer
 *   npm run translate -- --lang km --force # Force regenerate all
 *   npm run translate -- --lang km --file docs/guide.md  # Single file
 */

import { translate } from '@vitalets/google-translate-api'
import fs from 'fs/promises'
import path from 'path'
import { glob } from 'glob'

// Supported languages - ONLY Khmer
const LANGUAGES = {
  km: { name: 'Khmer', nativeName: 'ភាសាខ្មែរ', code: 'km' },
}

const translationCache = new Map()

// Rate limiting configuration
const RATE_LIMIT = {
  delayMs: 2000,           // 2 seconds between translations
  retryDelayMs: 5000,      // 5 seconds before retry on rate limit
  maxRetries: 5,           // Maximum retries on rate limit
  batchSize: 5,            // Process 5 files before longer pause
}

let translationCount = 0
let batchCount = 0

/**
 * Split markdown into translatable and non-translatable parts
 * Preserves code blocks, frontmatter, and special syntax
 */
function parseMarkdown(content) {
  const parts = []
  let currentIndex = 0

  // Extract frontmatter first
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n/)
  if (frontmatterMatch) {
    parts.push({
      type: 'frontmatter',
      content: frontmatterMatch[0],
      translate: false,
    })
    currentIndex = frontmatterMatch[0].length
  }

  // Process the rest of the content
  const restContent = content.slice(currentIndex)

  // Enhanced regex to catch ALL code blocks:
  // - Code blocks with language specification (```js, ```css, etc.)
  // - Code blocks without language specification
  // - Inline code with backticks (handled separately)
  // - HTML style/script tags
  // - HTML comments
  const codeBlockRegex = /(```[\s\S]*?```|<style[^>]*>[\s\S]*?<\/style>|<script[^>]*>[\s\S]*?<\/script>|<!--[\s\S]*?-->)/gi
  
  const segments = restContent.split(codeBlockRegex)

  for (const segment of segments) {
    if (!segment) continue

    // Check if this is a code block
    if (segment.match(/^```[\s\S]*```$/) || 
        segment.match(/^<style/i) || 
        segment.match(/^<script/i) ||
        segment.match(/^<!--/)) {
      // Code block - don't translate
      parts.push({
        type: 'code',
        content: segment,
        translate: false,
      })
    } else if (segment.trim()) {
      // Regular text - ALWAYS translate
      parts.push({
        type: 'text',
        content: segment,
        translate: true,
      })
    } else if (segment) {
      // Whitespace only - preserve as-is
      parts.push({
        type: 'whitespace',
        content: segment,
        translate: false,
      })
    }
  }

  return parts
}

/**
 * Translate text while preserving markdown formatting
 */
async function translateText(text, targetLang, retries = RATE_LIMIT.maxRetries) {
  if (!text.trim()) return text

  const cacheKey = `${text.substring(0, 100)}_${targetLang}`
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)
  }

  const langCode = LANGUAGES[targetLang].code

  // Preserve inline code
  const inlineCodeMatches = []
  let processedText = text.replace(/`([^`]+)`/g, (match) => {
    inlineCodeMatches.push(match)
    return `__INLINE_CODE_${inlineCodeMatches.length - 1}__`
  })

  // Preserve links
  const linkMatches = []
  processedText = processedText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, linkText, url) => {
    linkMatches.push({ text: linkText, url })
    return `__LINK_${linkMatches.length - 1}__`
  })

  // Preserve images
  const imageMatches = []
  processedText = processedText.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, url) => {
    imageMatches.push({ alt, url })
    return `__IMAGE_${imageMatches.length - 1}__`
  })

  // Preserve HTML tags
  const htmlMatches = []
  processedText = processedText.replace(/<[^>]+>/g, (match) => {
    htmlMatches.push(match)
    return `__HTML_${htmlMatches.length - 1}__`
  })

  try {
    const result = await translate(processedText, { to: langCode })
    let translatedText = result.text

    // Restore HTML tags
    htmlMatches.forEach((tag, i) => {
      const regex = new RegExp(`__HTML_\\s*${i}\\s*__`, 'gi')
      translatedText = translatedText.replace(regex, tag)
    })

    // Restore inline code
    inlineCodeMatches.forEach((code, i) => {
      const regex = new RegExp(`__INLINE_CODE_\\s*${i}\\s*__`, 'gi')
      translatedText = translatedText.replace(regex, code)
    })

    // Restore and translate links
    for (let i = 0; i < linkMatches.length; i++) {
      const { text: linkText, url } = linkMatches[i]
      const translatedLinkText = (await translate(linkText, { to: langCode })).text
      const regex = new RegExp(`__LINK_\\s*${i}\\s*__`, 'gi')
      translatedText = translatedText.replace(regex, `[${translatedLinkText}](${url})`)
    }

    // Restore images with translated alt text
    for (let i = 0; i < imageMatches.length; i++) {
      const { alt, url } = imageMatches[i]
      let translatedAlt = alt
      if (alt.trim()) {
        translatedAlt = (await translate(alt, { to: langCode })).text
      }
      const regex = new RegExp(`__IMAGE_\\s*${i}\\s*__`, 'gi')
      translatedText = translatedText.replace(regex, `![${translatedAlt}](${url})`)
    }

    translationCache.set(cacheKey, translatedText)
    return translatedText
  } catch (error) {
    // Check if it's a rate limiting error
    if (error.message.includes('Too Many Requests') || error.status === 429) {
      if (retries > 0) {
        const waitTime = RATE_LIMIT.retryDelayMs
        console.warn(`    ⚠️  Rate limited. Waiting ${waitTime}ms before retry (${retries} attempts left)`)
        await delay(waitTime)
        return translateText(text, targetLang, retries - 1)
      } else {
        console.error(`    ❌ Rate limit exceeded after ${RATE_LIMIT.maxRetries} retries`)
        return text
      }
    }

    // Other errors - retry with standard delay
    if (retries > 0) {
      await delay(1000)
      return translateText(text, targetLang, retries - 1)
    }
    console.error(`    ❌ Translation error: ${error.message}`)
    return text
  }
}

/**
 * Translate markdown content
 */
async function translateMarkdown(content, targetLang) {
  const parts = parseMarkdown(content)
  const translatedParts = []

  for (const part of parts) {
    if (part.translate) {
      const translated = await translateText(part.content, targetLang)
      translatedParts.push(translated)
    } else {
      translatedParts.push(part.content)
    }
  }

  return translatedParts.join('')
}

// Get all markdown files
async function getMarkdownFiles(specificFile = null) {
  if (specificFile) {
    return [specificFile]
  }

  const files = await glob('docs/**/*.md', {
    ignore: [
      'docs/node_modules/**',
      'docs/.vitepress/cache/**',
      'docs/.vitepress/dist/**',
      'docs/km/**',
    ]
  })

  return files.sort()
}

// Get translated file path
function getTranslatedPath(originalPath, lang) {
  const relativePath = originalPath.replace(/^docs\//, '')
  return path.join('docs', lang, relativePath)
}

// Delay function for rate limiting
async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// Parse command line arguments
function parseArgs() {
  const args = process.argv.slice(2)
  const options = {
    languages: [],
    file: null,
    force: false,
    verbose: false,
  }

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--lang':
      case '-l':
        options.languages = args[++i]?.split(',').filter(Boolean) || []
        break
      case '--file':
      case '-f':
        options.file = args[++i]
        break
      case '--force':
        options.force = true
        break
      case '--verbose':
      case '-v':
        options.verbose = true
        break
      case '--help':
      case '-h':
        printHelp()
        process.exit(0)
    }
  }

  return options
}

function printHelp() {
  console.log(`
📚 VitePress Translation Script
Uses Google Translate (free, no API key required)

Supported Languages: Khmer (km)

Usage:
  npm run translate:km                    # Translate all to Khmer
  npm run translate -- --lang km --force  # Force regenerate all
  npm run translate -- --lang km --file <file>  # Single file

Options:
  --lang, -l    Target language (default: km)
  --file, -f    Translate specific file only
  --force       Regenerate all translations (overwrite existing)
  --verbose, -v Show detailed information
  --help, -h    Show this help message

Examples:
  npm run translate:km
  npm run translate -- --lang km --force
  npm run translate -- --lang km --verbose
  npm run translate -- --lang km --file docs/guide/ai/01-introduction.md

Note: Translation includes automatic rate limiting to prevent API throttling

Clean & Regenerate:
  npm run clean:translations    # Remove all Khmer translations
  npm run translate:km          # Regenerate fresh translations
`)
}

// Translate file
async function translateFile(filePath, lang, options) {
  const outputPath = getTranslatedPath(filePath, lang)

  // Check if translation exists
  if (!options.force) {
    try {
      await fs.access(outputPath)
      console.log(`  ⏭️  Skipping (exists): ${outputPath}`)
      return { skipped: true }
    } catch {
      // File doesn't exist, continue
    }
  } else {
    // Force mode - remove existing file
    try {
      await fs.unlink(outputPath)
      console.log(`  🔄 Replacing: ${outputPath}`)
    } catch {
      // File doesn't exist, that's fine
    }
  }

  try {
    const content = await fs.readFile(filePath, 'utf-8')

    if (!content.trim()) {
      console.log(`  ⏭️  Skipping (empty): ${filePath}`)
      return { skipped: true }
    }

    console.log(`  🔄 Translating: ${filePath}`)

    const translated = await translateMarkdown(content, lang)

    await fs.mkdir(path.dirname(outputPath), { recursive: true })
    await fs.writeFile(outputPath, translated, 'utf-8')

    console.log(`  ✅ Saved: ${outputPath}`)
    return { success: true }
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`)
    return { error: error.message }
  }
}

// Main execution
async function main() {
  const options = parseArgs()

  // Set default language to Khmer if not specified
  if (options.languages.length === 0) {
    options.languages = ['km']
  }

  // Validate languages
  for (const lang of options.languages) {
    if (!LANGUAGES[lang]) {
      console.error(`❌ Error: Unsupported language "${lang}"`)
      console.error(`Supported: ${Object.keys(LANGUAGES).join(', ')}`)
      process.exit(1)
    }
  }

  const files = await getMarkdownFiles(options.file)

  console.log(`\n📚 Found ${files.length} markdown file(s)`)
  console.log(`🌐 Target: ${options.languages.map(l => `${LANGUAGES[l].name} (${l})`).join(', ')}`)
  console.log(`💡 Mode: Translate all text except code blocks`)
  console.log(`⏱️  Rate limit: ${RATE_LIMIT.delayMs}ms between translations`)
  if (options.force) {
    console.log(`⚡ Force: Regenerating all translations\n`)
  } else {
    console.log(`💾 Skip existing translations\n`)
  }

  const stats = {
    total: 0,
    success: 0,
    skipped: 0,
    errors: 0,
  }

  for (const lang of options.languages) {
    console.log(`\n${'='.repeat(60)}`)
    console.log(`🌍 Translating to ${LANGUAGES[lang].name}`)
    console.log(`${'='.repeat(60)}\n`)

    translationCount = 0
    batchCount = 0

    for (const file of files) {
      stats.total++
      const result = await translateFile(file, lang, options)

      if (result.success) {
        stats.success++
        translationCount++
        batchCount++

        // Longer pause every N files to avoid rate limiting
        if (batchCount >= RATE_LIMIT.batchSize) {
          console.log(`  ⏸️  Batch pause (${RATE_LIMIT.delayMs * 2}ms)...`)
          await delay(RATE_LIMIT.delayMs * 2)
          batchCount = 0
        } else {
          // Standard delay between files
          await delay(RATE_LIMIT.delayMs)
        }
      } else if (result.skipped) {
        stats.skipped++
      } else if (result.error) {
        stats.errors++
      }
    }
  }

  console.log(`\n${'='.repeat(60)}`)
  console.log('📊 Summary')
  console.log(`${'='.repeat(60)}`)
  console.log(`  Total: ${stats.total}`)
  console.log(`  ✅ Success: ${stats.success}`)
  console.log(`  ⏭️  Skipped: ${stats.skipped}`)
  console.log(`  ❌ Errors: ${stats.errors}`)
  console.log(`  Total translations: ${translationCount}`)
  console.log(`${'='.repeat(60)}\n`)

  if (stats.errors > 0) {
    process.exit(1)
  }
}

main().catch(console.error)