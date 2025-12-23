#!/usr/bin/env node
/**
 * Translation Debug & Testing Script
 * Validates translation setup and tests all components
 */

import { translate } from '@vitalets/google-translate-api'
import fs from 'fs/promises'
import path from 'path'
import { glob } from 'glob'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Test configuration
const TEST_CONFIG = {
  languages: {
    km: { name: 'Khmer', code: 'km' },
    zh: { name: 'Chinese', code: 'zh-CN' },
    ja: { name: 'Japanese', code: 'ja' },
  },
  testText: 'Hello World. This is a CSS tutorial about colors and styles.',
  testMarkdown: `---
title: Test
---

# Heading

This is a test paragraph with \`inline code\` and [links](https://example.com).

\`\`\`css
.container {
  color: red;
  padding: 10px;
}
\`\`\`

Another paragraph here.
`,
}

/**
 * Test 1: Check Node.js environment
 */
async function testEnvironment() {
  console.log('\n🔍 TEST 1: Environment Check')
  console.log('=' .repeat(60))

  try {
    console.log(`✅ Node.js version: ${process.version}`)
    console.log(`✅ Platform: ${process.platform}`)
    console.log(`✅ Current directory: ${process.cwd()}`)
    console.log(`✅ Script directory: ${__dirname}`)
    return { passed: true }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`)
    return { passed: false, error: error.message }
  }
}

/**
 * Test 2: Check dependencies
 */
async function testDependencies() {
  console.log('\n🔍 TEST 2: Dependencies Check')
  console.log('='.repeat(60))

  const dependencies = [
    '@vitalets/google-translate-api',
    'fs/promises',
    'path',
    'glob',
  ]

  for (const dep of dependencies) {
    try {
      if (dep === 'fs/promises' || dep === 'path') {
        console.log(`✅ ${dep} (built-in)`)
      } else {
        await import(dep)
        console.log(`✅ ${dep}`)
      }
    } catch (error) {
      console.error(`❌ ${dep}: ${error.message}`)
      return { passed: false, error: `Missing dependency: ${dep}` }
    }
  }

  return { passed: true }
}

/**
 * Test 3: Test translation API
 */
async function testTranslationAPI() {
  console.log('\n🔍 TEST 3: Translation API Test')
  console.log('='.repeat(60))

  const results = {}

  for (const [langCode, langInfo] of Object.entries(TEST_CONFIG.languages)) {
    try {
      console.log(`\n  Testing ${langInfo.name} (${langCode})...`)
      const result = await translate(TEST_CONFIG.testText, { to: langInfo.code })
      
      if (result.text && result.text.length > 0) {
        console.log(`  ✅ Translation successful`)
        console.log(`  Original: "${TEST_CONFIG.testText}"`)
        console.log(`  Translated: "${result.text}"`)
        results[langCode] = { passed: true, translated: result.text }
      } else {
        console.error(`  ❌ Empty translation result`)
        results[langCode] = { passed: false, error: 'Empty result' }
      }

      // Rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error(`  ❌ Translation error: ${error.message}`)
      results[langCode] = { passed: false, error: error.message }
    }
  }

  const allPassed = Object.values(results).every(r => r.passed)
  return { passed: allPassed, results }
}

/**
 * Test 4: Check file structure
 */
async function testFileStructure() {
  console.log('\n🔍 TEST 4: File Structure Check')
  console.log('='.repeat(60))

  const requiredDirs = [
    'docs',
    'scripts',
    'docs/css',
  ]

  const requiredFiles = [
    'scripts/translate.mjs',
    'scripts/translate-css.mjs',
    'package.json',
  ]

  console.log('\nChecking directories:')
  for (const dir of requiredDirs) {
    try {
      await fs.access(dir)
      console.log(`  ✅ ${dir}`)
    } catch {
      console.log(`  ⚠️  ${dir} (not found)`)
    }
  }

  console.log('\nChecking files:')
  for (const file of requiredFiles) {
    try {
      await fs.access(file)
      console.log(`  ✅ ${file}`)
    } catch {
      console.log(`  ⚠️  ${file} (not found)`)
    }
  }

  return { passed: true }
}

/**
 * Test 5: Check CSS markdown files
 */
async function testCSSFiles() {
  console.log('\n🔍 TEST 5: CSS Markdown Files Check')
  console.log('='.repeat(60))

  try {
    const files = await glob('docs/css/**/*.md', {
      ignore: ['docs/km/**', 'docs/zh/**', 'docs/ja/**'],
    })

    console.log(`\nFound ${files.length} CSS markdown file(s):`)
    
    if (files.length === 0) {
      console.log('  ⚠️  No CSS files found in docs/css/')
      console.log('  💡 Create sample files in docs/css/ directory first')
      return { passed: true, filesCount: 0, files: [] }
    }

    for (const file of files.slice(0, 10)) {
      const stats = await fs.stat(file)
      console.log(`  ✅ ${file} (${stats.size} bytes)`)
    }

    if (files.length > 10) {
      console.log(`  ... and ${files.length - 10} more files`)
    }

    return { passed: true, filesCount: files.length, files }
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`)
    return { passed: false, error: error.message }
  }
}

/**
 * Test 6: Check translated output directories
 */
async function testOutputDirs() {
  console.log('\n🔍 TEST 6: Output Directories Check')
  console.log('='.repeat(60))

  const langs = ['km', 'zh', 'ja']
  const outputDirs = langs.map(lang => `docs/${lang}`)

  for (const dir of outputDirs) {
    try {
      await fs.access(dir)
      const files = await glob(`${dir}/**/*.md`)
      console.log(`  ✅ ${dir} (${files.length} translated files)`)
    } catch {
      console.log(`  ⚠️  ${dir} (not yet created - will be created on first translation)`)
    }
  }

  return { passed: true }
}

/**
 * Test 7: Test markdown parsing
 */
async function testMarkdownParsing() {
  console.log('\n🔍 TEST 7: Markdown Parsing Test')
  console.log('='.repeat(60))

  try {
    // Simple markdown parser test
    const parts = parseTestMarkdown(TEST_CONFIG.testMarkdown)
    
    console.log(`\nParsed ${parts.length} parts:`)
    
    let textCount = 0, codeCount = 0, otherCount = 0

    for (const part of parts) {
      if (part.type === 'text') textCount++
      else if (part.type === 'code') codeCount++
      else otherCount++
    }

    console.log(`  ✅ Text sections: ${textCount}`)
    console.log(`  ✅ Code blocks: ${codeCount}`)
    console.log(`  ✅ Other sections: ${otherCount}`)

    return { passed: true, parts }
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`)
    return { passed: false, error: error.message }
  }
}

/**
 * Simple markdown parser for testing
 */
function parseTestMarkdown(content) {
  const parts = []
  const codeBlockRegex = /(```[\s\S]*?```|<style[\s\S]*?<\/style>)/gi
  const segments = content.split(codeBlockRegex)

  for (const segment of segments) {
    if (segment.match(/^```/) || segment.match(/^<style/i)) {
      parts.push({ type: 'code', content: segment })
    } else if (segment.trim()) {
      parts.push({ type: 'text', content: segment })
    }
  }

  return parts
}

/**
 * Test 8: Check package.json scripts
 */
async function testPackageJSON() {
  console.log('\n🔍 TEST 8: Package.json Scripts Check')
  console.log('='.repeat(60))

  try {
    const pkg = JSON.parse(await fs.readFile('package.json', 'utf-8'))
    
    const requiredScripts = ['translate', 'translate:css', 'translate:css:km']
    
    console.log('\nAvailable scripts:')
    for (const script of Object.keys(pkg.scripts || {})) {
      const hasRequired = requiredScripts.includes(script)
      const symbol = hasRequired ? '✅' : '  '
      console.log(`  ${symbol} ${script}`)
    }

    const missingScripts = requiredScripts.filter(s => !pkg.scripts[s])
    
    return { 
      passed: missingScripts.length === 0,
      scripts: pkg.scripts,
      missing: missingScripts 
    }
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`)
    return { passed: false, error: error.message }
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log('\n' + '='.repeat(60))
  console.log('🧪 TRANSLATION DEBUG & TEST SUITE')
  console.log('='.repeat(60))

  const results = {}

  const tests = [
    { name: 'Environment', fn: testEnvironment },
    { name: 'Dependencies', fn: testDependencies },
    { name: 'Translation API', fn: testTranslationAPI },
    { name: 'File Structure', fn: testFileStructure },
    { name: 'CSS Files', fn: testCSSFiles },
    { name: 'Output Directories', fn: testOutputDirs },
    { name: 'Markdown Parsing', fn: testMarkdownParsing },
    { name: 'Package.json Scripts', fn: testPackageJSON },
  ]

  for (const test of tests) {
    try {
      const result = await test.fn()
      results[test.name] = result
    } catch (error) {
      console.error(`\n❌ Test "${test.name}" failed: ${error.message}`)
      results[test.name] = { passed: false, error: error.message }
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 TEST SUMMARY')
  console.log('='.repeat(60))

  let passed = 0, failed = 0

  for (const [testName, result] of Object.entries(results)) {
    const symbol = result.passed ? '✅' : '❌'
    console.log(`${symbol} ${testName}`)
    if (!result.passed && result.error) {
      console.log(`   Error: ${result.error}`)
    }
    if (result.passed) passed++
    else failed++
  }

  console.log('\n' + '='.repeat(60))
  console.log(`Results: ${passed} passed, ${failed} failed`)
  console.log('='.repeat(60))

  if (failed === 0) {
    console.log('\n🎉 All tests passed! Your translation setup is ready.')
    console.log('\n📝 Next steps:')
    console.log('  1. Ensure you have CSS files in docs/css/')
    console.log('  2. Run: npm run translate:css:km')
    console.log('  3. Check docs/km/ for translated files\n')
  } else {
    console.log('\n⚠️  Some tests failed. Please fix the issues above.\n')
    process.exit(1)
  }
}

// Run tests
runAllTests().catch(error => {
  console.error('\n❌ Fatal error:', error.message)
  if (process.argv.includes('--verbose')) {
    console.error(error.stack)
  }
  process.exit(1)
})
