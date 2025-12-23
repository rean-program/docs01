#!/usr/bin/env node
/**
 * Master Translation Script
 * Runs translation for ALL pages to Khmer language
 * With progress tracking and detailed reporting
 */

import { translate } from '@vitalets/google-translate-api'
import fs from 'fs/promises'
import path from 'path'
import { glob } from 'glob'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Supported languages - ONLY Khmer
const LANGUAGES = {
  km: { name: 'Khmer', nativeName: 'ភាសាខ្មែរ', code: 'km' },
}

const translationCache = new Map()

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * Parse markdown with enhanced code block detection
 */
function parseMarkdown(content) {
  const parts = []
  let currentIndex = 0

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
  const codeBlockRegex = /(```[\s\S]*?```|<style[^>]*>[\s\S]*?<\/style>|<script[^>]*>[\s\S]*?<\/script>|<!--[\s\S]*?-->)/gi
  
  const segments = restContent.split(codeBlockRegex)

  for (const segment of segments) {
    if (!segment) continue

    if (segment.match(/^```[\s\S]*```$/) || 
        segment.match(/^<style/i) || 
        segment.match(/^<script/i) ||
        segment.match(/^<!--/)) {
      parts.push({
        type: 'code',
        content: segment,
        translate: false,
      })
    } else if (segment.trim()) {
      parts.push({
        type: 'text',
        content: segment,
        translate: true,
      })
    } else if (segment) {
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
 * Translate text with all preservation logic
 */
async function translateText(text, targetLang, retries = 3) {
  if (!text.trim()) return text

  const cacheKey = `${text.substring(0, 100)}_${targetLang}`
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey)
  }

  const langCode = LANGUAGES[targetLang].code

  const inlineCodeMatches = []
  let processedText = text.replace(/`([^`]+)`/g, (match) => {
    inlineCodeMatches.push(match)
    return `__INLINE_CODE_${inlineCodeMatches.length - 1}__`
  })

  const linkMatches = []
  processedText = processedText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, linkText, url) => {
    linkMatches.push({ text: linkText, url })
    return `__LINK_${linkMatches.length - 1}__`
  })

  const imageMatches = []
  processedText = processedText.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, url) => {
    imageMatches.push({ alt, url })
    return `__IMAGE_${imageMatches.length - 1}__`
  })

  const htmlMatches = []
  processedText = processedText.replace(/<[^>]+>/g, (match) => {
    htmlMatches.push(match)
    return `__HTML_${htmlMatches.length - 1}__`
  })

  try {
    const result = await translate(processedText, { to: langCode })
    let translatedText = result.text

    htmlMatches.forEach((tag, i) => {
      const regex = new RegExp(`__HTML_\\s*${i}\\s*__`, 'gi')
      translatedText = translatedText.replace(regex, tag)
    })

    inlineCodeMatches.forEach((code, i) => {
      const regex = new RegExp(`__INLINE_CODE_\\s*${i}\\s*__`, 'gi')
      translatedText = translatedText.replace(regex, code)
    })

    for (let i = 0; i < linkMatches.length; i++) {
      const { text: linkText, url } = linkMatches[i]
      const translatedLinkText = (await translate(linkText, { to: langCode })).text
      const regex = new RegExp(`__LINK_\\s*${i}\\s*__`, 'gi')
      translatedText = translatedText.replace(regex, `[${translatedLinkText}](${url})`)
    }

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
    if (retries > 0) {
      await delay(1000)
      return translateText(text, targetLang, retries - 1)
    }
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

/**
 * Get all markdown files
 */
async function getMarkdownFiles() {
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

/**
 * Get translated file path
 */
function getTranslatedPath(originalPath, lang) {
  const relativePath = originalPath.replace(/^docs\//, '')
  return path.join('docs', lang, relativePath)
}

/**
 * Translate single file
 */
async function translateFile(filePath, lang, progressCallback) {
  const outputPath = getTranslatedPath(filePath, lang)

  try {
    const content = await fs.readFile(filePath, 'utf-8')

    if (!content.trim()) {
      return { skipped: true, reason: 'empty' }
    }

    // Check if already exists
    try {
      await fs.access(outputPath)
      return { skipped: true, reason: 'exists' }
    } catch {
      // Continue with translation
    }

    const translated = await translateMarkdown(content, lang)
    await fs.mkdir(path.dirname(outputPath), { recursive: true })
    await fs.writeFile(outputPath, translated, 'utf-8')

    return { success: true }
  } catch (error) {
    return { error: error.message }
  }
}

/**
 * Progress bar helper
 */
function getProgressBar(current, total, width = 30) {
  const percentage = (current / total) * 100
  const filled = Math.round((width * current) / total)
  const empty = width - filled
  const bar = '█'.repeat(filled) + '░'.repeat(empty)
  return `${bar} ${percentage.toFixed(1)}%`
}

/**
 * Format time duration
 */
function formatDuration(ms) {
  const seconds = Math.floor(ms / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)

  if (hours > 0) return `${hours}h ${minutes % 60}m`
  if (minutes > 0) return `${minutes}m ${seconds % 60}s`
  return `${seconds}s`
}

/**
 * Main execution
 */
async function main() {
  console.clear()
  console.log('\n' + '='.repeat(70))
  console.log('🌍 MASTER TRANSLATION SUITE - ALL PAGES TO KHMER')
  console.log('='.repeat(70))

  const startTime = Date.now()

  // Get all files
  const files = await getMarkdownFiles()
  const langs = Object.keys(LANGUAGES)

  console.log(`\n📁 Source files: ${files.length}`)
  console.log(`🌐 Target languages: ${langs.length}`)
  console.log(`📊 Total translations: ${files.length * langs.length}\n`)

  const stats = {
    total: 0,
    success: 0,
    skipped: 0,
    errors: 0,
    byLanguage: {},
    byFile: {},
  }

  // Initialize stats
  for (const lang of langs) {
    stats.byLanguage[lang] = { success: 0, skipped: 0, errors: 0 }
  }
  for (const file of files) {
    stats.byFile[file] = { success: 0, skipped: 0, errors: 0 }
  }

  // Translate for each language
  for (const langIndex in langs) {
    const lang = langs[langIndex]
    const langNum = parseInt(langIndex) + 1
    
    console.log(`\n${'='.repeat(70)}`)
    console.log(`[${langNum}/${langs.length}] 🌍 ${LANGUAGES[lang].name} (${LANGUAGES[lang].nativeName})`)
    console.log(`${'='.repeat(70)}\n`)

    const langStartTime = Date.now()

    for (const fileIndex in files) {
      const file = files[fileIndex]
      const fileNum = parseInt(fileIndex) + 1
      const currentTranslation = (parseInt(langIndex) * files.length) + fileNum
      const totalTranslations = files.length * langs.length

      const result = await translateFile(file, lang)

      stats.total++

      if (result.success) {
        stats.success++
        stats.byLanguage[lang].success++
        stats.byFile[file].success++
        const status = '✅'
        const shortPath = file.length > 45 ? '...' + file.slice(-42) : file
        const progress = getProgressBar(currentTranslation, totalTranslations, 25)
        console.log(`${status} ${shortPath}`)
        console.log(`   ${progress}`)
      } else if (result.skipped) {
        stats.skipped++
        stats.byLanguage[lang].skipped++
        stats.byFile[file].skipped++
        const reason = result.reason === 'exists' ? '(already exists)' : '(empty)'
        const shortPath = file.length > 45 ? '...' + file.slice(-42) : file
        console.log(`⏭️  ${shortPath} ${reason}`)
      } else if (result.error) {
        stats.errors++
        stats.byLanguage[lang].errors++
        stats.byFile[file].errors++
        const shortPath = file.length > 45 ? '...' + file.slice(-42) : file
        console.log(`❌ ${shortPath}`)
        console.log(`   Error: ${result.error}`)
      }

      if (result.success) {
        await delay(500)
      }
    }

    const langDuration = formatDuration(Date.now() - langStartTime)
    console.log(`\n✨ ${LANGUAGES[lang].name} completed in ${langDuration}`)
  }

  // Final summary
  const totalDuration = formatDuration(Date.now() - startTime)

  console.log(`\n\n${'='.repeat(70)}`)
  console.log('📊 FINAL SUMMARY')
  console.log(`${'='.repeat(70)}\n`)

  console.log(`⏱️  Total time: ${totalDuration}`)
  console.log(`📝 Total operations: ${stats.total}`)
  console.log(`✅ Successful: ${stats.success}`)
  console.log(`⏭️  Skipped: ${stats.skipped}`)
  console.log(`❌ Errors: ${stats.errors}\n`)

  console.log(`Per-Language Stats:`)
  for (const lang of langs) {
    const langStats = stats.byLanguage[lang]
    console.log(
      `  ${LANGUAGES[lang].name.padEnd(12)} ✅ ${langStats.success.toString().padStart(3)} | ⏭️  ${langStats.skipped.toString().padStart(3)} | ❌ ${langStats.errors}`
    )
  }

  console.log(`\n${'='.repeat(70)}`)
  if (stats.errors === 0) {
    console.log('✨ All translations completed successfully!')
  } else {
    console.log(`⚠️  ${stats.errors} error(s) encountered. Review above for details.`)
  }
  console.log(`${'='.repeat(70)}\n`)

  // Save summary report
  const reportPath = `translation-all-${new Date().toISOString().split('T')[0]}.json`
  await fs.writeFile(
    reportPath,
    JSON.stringify({
      timestamp: new Date().toISOString(),
      duration: totalDuration,
      stats,
    }, null, 2),
    'utf-8'
  )
  console.log(`📄 Report saved: ${reportPath}\n`)

  process.exit(stats.errors > 0 ? 1 : 0)
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error.message)
  if (process.argv.includes('--verbose')) {
    console.error(error.stack)
  }
  process.exit(1)
})
