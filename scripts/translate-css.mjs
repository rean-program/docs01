#!/usr/bin/env node
/**
 * CSS Tutorial Translation Script
 * Extends the main translation script with CSS-specific handling
 * 
 * ⚠️  NODE.JS ONLY - Do not import in browser/HTML files
 * Run from command line: node scripts/translate-css.mjs --lang km
 */

// Check if running in Node.js environment
if (typeof window !== 'undefined') {
  throw new Error('❌ This script can only be run in Node.js environment, not in a browser. Use: node scripts/translate-css.mjs')
}

import { translate } from '@vitalets/google-translate-api'
import fs from 'fs/promises'
import path from 'path'
import { glob } from 'glob'

const CSS_LANGUAGES = {
  km: { name: 'Khmer', nativeName: 'ភាសាខ្មែរ', code: 'km' },
  zh: { name: 'Chinese', nativeName: '中文', code: 'zh-CN' },
  ja: { name: 'Japanese', nativeName: '日本語', code: 'ja' },
}

/**
 * Parse CSS-specific markdown with enhanced code block preservation
 */
function parseCSSMarkdown(content) {
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

  const restContent = content.slice(currentIndex)

  // Enhanced regex to catch CSS, HTML, JavaScript code blocks
  const codeBlockRegex = /(```(?:css|html|javascript|js|vue|jsx)\n[\s\S]*?```|```\n[\s\S]*?```|<style[^>]*>[\s\S]*?<\/style>|<script[^>]*>[\s\S]*?<\/script>|<!--[\s\S]*?-->)/gi
  const segments = restContent.split(codeBlockRegex)

  for (const segment of segments) {
    if (segment.match(/^```(?:css|html|javascript|js|vue|jsx)\n/) || 
        segment.match(/^```\n/) ||
        segment.match(/^<style/i) || 
        segment.match(/^<script/i) ||
        segment.match(/^<!--/)) {
      // Code block, style, script, or comment - don't translate
      parts.push({
        type: 'code',
        content: segment,
        translate: false,
      })
    } else if (segment.trim()) {
      // Regular text - translate it
      parts.push({
        type: 'text',
        content: segment,
        translate: true,
      })
    } else if (segment) {
      // Whitespace only
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
 * Translate CSS tutorial text with better error handling
 */
async function translateCSSText(text, targetLang, retries = 3) {
  if (!text.trim()) return text

  const langCode = CSS_LANGUAGES[targetLang].code

  // Preserve CSS property names and values
  const cssMatches = []
  let processedText = text.replace(/\b(color|background|padding|margin|border|font-size|width|height|display|flex|grid):/gi, (match) => {
    cssMatches.push(match)
    return `__CSS_PROP_${cssMatches.length - 1}__`
  })

  // Preserve inline code
  const inlineCodeMatches = []
  processedText = processedText.replace(/`([^`]+)`/g, (match) => {
    inlineCodeMatches.push(match)
    return `__CODE_${inlineCodeMatches.length - 1}__`
  })

  // Preserve links
  const linkMatches = []
  processedText = processedText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, linkText, url) => {
    linkMatches.push({ text: linkText, url })
    return `__LINK_${linkMatches.length - 1}__`
  })

  try {
    const result = await translate(processedText, { to: langCode })
    let translatedText = result.text

    // Restore CSS properties
    cssMatches.forEach((prop, i) => {
      translatedText = translatedText.replace(new RegExp(`__CSS_PROP_\\s*${i}\\s*__`, 'gi'), prop)
    })

    // Restore inline code
    inlineCodeMatches.forEach((code, i) => {
      translatedText = translatedText.replace(new RegExp(`__CODE_\\s*${i}\\s*__`, 'gi'), code)
    })

    // Restore links
    for (let i = 0; i < linkMatches.length; i++) {
      const { text: linkText, url } = linkMatches[i]
      const translatedLinkText = (await translate(linkText, { to: langCode })).text
      translatedText = translatedText.replace(
        new RegExp(`__LINK_\\s*${i}\\s*__`, 'gi'),
        `[${translatedLinkText}](${url})`
      )
    }

    return translatedText
  } catch (error) {
    if (retries > 0) {
      console.log(`    ⏳ Retrying (${retries} attempts left)...`)
      await new Promise(resolve => setTimeout(resolve, 2000))
      return translateCSSText(text, targetLang, retries - 1)
    }
    console.error(`    ❌ Translation failed: ${error.message}`)
    return text
  }
}

/**
 * Translate CSS markdown content
 */
async function translateCSSMarkdown(content, targetLang) {
  const parts = parseCSSMarkdown(content)
  const translatedParts = []

  for (const part of parts) {
    if (part.translate) {
      const translated = await translateCSSText(part.content, targetLang)
      translatedParts.push(translated)
    } else {
      translatedParts.push(part.content)
    }
  }

  return translatedParts.join('')
}

/**
 * Get CSS tutorial files
 */
async function getCSSFiles(specificFile = null) {
  if (specificFile) {
    return [specificFile]
  }

  const files = await glob('docs/css/**/*.md', {
    ignore: [
      'docs/node_modules/**',
      'docs/.vitepress/cache/**',
      'docs/.vitepress/dist/**',
      'docs/km/**',
      'docs/zh/**',
      'docs/ja/**',
    ]
  })

  return files.sort()
}

/**
 * Get translated file path
 */
function getTranslatedPath(originalPath, lang) {
  const relativePath = originalPath.replace(/^docs\//, '')
  return path.join('docs', lang, relativePath)
}

/**
 * Translate CSS tutorial file
 */
async function translateCSSFile(filePath, lang) {
  const outputPath = getTranslatedPath(filePath, lang)

  try {
    const content = await fs.readFile(filePath, 'utf-8')

    if (!content.trim()) {
      console.log(`  ⏭️  Skipping (empty): ${filePath}`)
      return { skipped: true }
    }

    console.log(`  🔄 Translating: ${filePath}`)

    const translated = await translateCSSMarkdown(content, lang)

    await fs.mkdir(path.dirname(outputPath), { recursive: true })
    await fs.writeFile(outputPath, translated, 'utf-8')

    console.log(`  ✅ Saved: ${outputPath}`)
    return { success: true }
  } catch (error) {
    console.error(`  ❌ Error translating ${filePath}: ${error.message}`)
    return { error: error.message }
  }
}

/**
 * Parse command line arguments
 */
function parseArgs() {
  const args = process.argv.slice(2)
  const options = {
    lang: 'km',
    file: null,
    verbose: false,
  }

  for (let i = 0; i < args.length; i++) {
    if ((args[i] === '--lang' || args[i] === '-l') && args[i + 1]) {
      options.lang = args[++i]
    } else if ((args[i] === '--file' || args[i] === '-f') && args[i + 1]) {
      options.file = args[++i]
    } else if (args[i] === '--verbose' || args[i] === '-v') {
      options.verbose = true
    } else if (args[i] === '--help' || args[i] === '-h') {
      printHelp()
      process.exit(0)
    }
  }

  return options
}

function printHelp() {
  console.log(`
🎨 CSS Tutorial Translation Script

Usage:
  node scripts/translate-css.mjs --lang <code> [options]

Options:
  --lang, -l    Target language code (default: km)
                Supported: ${Object.keys(CSS_LANGUAGES).join(', ')}
  --file, -f    Translate specific file only
  --verbose, -v Show detailed debug information
  --help, -h    Show this help message

Examples:
  node scripts/translate-css.mjs --lang km
  node scripts/translate-css.mjs --lang zh --file docs/css/basics/01-introduction.md
  node scripts/translate-css.mjs --lang ja --verbose
`)
}

/**
 * Main execution for CSS tutorials
 */
async function main() {
  const options = parseArgs()

  if (!CSS_LANGUAGES[options.lang]) {
    console.error(`❌ Error: Unsupported language "${options.lang}"`)
    console.error(`✅ Supported: ${Object.keys(CSS_LANGUAGES).join(', ')}`)
    process.exit(1)
  }

  const files = await getCSSFiles(options.file)

  if (files.length === 0) {
    console.log(`⚠️  No CSS files found in docs/css/`)
    console.log(`📁 Checked: docs/css/**/*.md`)
    process.exit(0)
  }

  console.log(`\n${'='.repeat(60)}`)
  console.log(`🎨 CSS Tutorial Translation`)
  console.log(`${'='.repeat(60)}`)
  console.log(`📚 Found ${files.length} CSS tutorial file(s)`)
  console.log(`🌐 Target language: ${CSS_LANGUAGES[options.lang].name} (${CSS_LANGUAGES[options.lang].nativeName})`)
  if (options.verbose) console.log(`🔍 Verbose mode: ON\n`)
  else console.log(``)

  let success = 0, skipped = 0, errors = 0

  for (const file of files) {
    if (options.verbose) console.log(`📄 Processing: ${file}`)
    
    const result = await translateCSSFile(file, options.lang)
    
    if (result.success) success++
    else if (result.skipped) skipped++
    else if (result.error) errors++

    if (result.success) {
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }

  console.log(`\n${'='.repeat(60)}`)
  console.log(`📊 Translation Complete`)
  console.log(`${'='.repeat(60)}`)
  console.log(`✅ Translated: ${success}`)
  console.log(`⏭️  Skipped: ${skipped}`)
  console.log(`❌ Errors: ${errors}`)
  console.log(`${'='.repeat(60)}\n`)

  if (errors > 0) process.exit(1)
}

main().catch((error) => {
  console.error(`\n❌ Fatal error: ${error.message}`)
  if (process.argv.includes('--verbose')) {
    console.error(error.stack)
  }
  process.exit(1)
})
