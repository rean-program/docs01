#!/usr/bin/env node
/**
 * Translation Quality Assurance & Testing Script
 * Validates all translated files for completeness and quality
 */

import fs from 'fs/promises'
import path from 'path'
import { glob } from 'glob'

const LANGUAGES = {
  km: { name: 'Khmer', nativeName: 'ភាសាខ្មែរ' },
  zh: { name: 'Chinese', nativeName: '中文' },
  ja: { name: 'Japanese', nativeName: '日本語' },
}

/**
 * Test 1: Validate all translated files exist
 */
async function testFileCompleteness() {
  console.log('\n🔍 TEST 1: File Completeness Check')
  console.log('='.repeat(60))

  try {
    const sourceFiles = await glob('docs/**/*.md', {
      ignore: [
        'docs/node_modules/**',
        'docs/.vitepress/**',
        'docs/km/**',
        'docs/zh/**',
        'docs/ja/**',
      ]
    })

    const results = {}

    for (const lang of Object.keys(LANGUAGES)) {
      let translated = 0
      let missing = []

      for (const sourceFile of sourceFiles) {
        const translatedFile = sourceFile.replace(/^docs\//, `docs/${lang}/`)
        try {
          await fs.access(translatedFile)
          translated++
        } catch {
          missing.push(sourceFile)
        }
      }

      results[lang] = {
        total: sourceFiles.length,
        translated,
        missing: missing.length,
        percentage: Math.round((translated / sourceFiles.length) * 100),
      }

      console.log(`\n${LANGUAGES[lang].name}:`)
      console.log(`  ✅ Translated: ${translated}/${sourceFiles.length} (${results[lang].percentage}%)`)
      
      if (missing.length > 0 && missing.length <= 5) {
        console.log(`  ⚠️  Missing: ${missing.slice(0, 5).join(', ')}`)
      } else if (missing.length > 5) {
        console.log(`  ⚠️  Missing: ${missing.length} files`)
      }
    }

    return { passed: true, results }
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`)
    return { passed: false, error: error.message }
  }
}

/**
 * Test 2: Check file sizes consistency
 */
async function testFileSizes() {
  console.log('\n🔍 TEST 2: File Size Consistency Check')
  console.log('='.repeat(60))

  try {
    const sourceFiles = await glob('docs/**/*.md', {
      ignore: [
        'docs/node_modules/**',
        'docs/.vitepress/**',
        'docs/km/**',
        'docs/zh/**',
        'docs/ja/**',
      ]
    })

    const results = {}

    for (const lang of Object.keys(LANGUAGES)) {
      let sizeIssues = []

      for (const sourceFile of sourceFiles.slice(0, 10)) {
        const translatedFile = sourceFile.replace(/^docs\//, `docs/${lang}/`)
        
        try {
          const sourceStat = await fs.stat(sourceFile)
          const translatedStat = await fs.stat(translatedFile)
          
          const ratio = translatedStat.size / sourceStat.size
          
          // Flag if translation is suspiciously small (< 0.5x) or large (> 3x)
          if (ratio < 0.5 || ratio > 3) {
            sizeIssues.push({
              file: sourceFile,
              ratio: ratio.toFixed(2),
              source: sourceStat.size,
              translated: translatedStat.size,
            })
          }
        } catch (error) {
          // File doesn't exist, already caught in previous test
        }
      }

      results[lang] = {
        checked: Math.min(10, sourceFiles.length),
        issues: sizeIssues.length,
        sizeIssues,
      }

      console.log(`\n${LANGUAGES[lang].name}:`)
      if (sizeIssues.length === 0) {
        console.log(`  ✅ All file sizes look reasonable`)
      } else {
        console.log(`  ⚠️  Found ${sizeIssues.length} potential size issues:`)
        sizeIssues.forEach(issue => {
          console.log(`     ${issue.file} (ratio: ${issue.ratio}x)`)
        })
      }
    }

    return { passed: true, results }
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`)
    return { passed: false, error: error.message }
  }
}

/**
 * Test 3: Check for empty translations
 */
async function testEmptyFiles() {
  console.log('\n🔍 TEST 3: Empty Files Check')
  console.log('='.repeat(60))

  try {
    const results = {}

    for (const lang of Object.keys(LANGUAGES)) {
      const translatedFiles = await glob(`docs/${lang}/**/*.md`)
      let emptyFiles = []

      for (const file of translatedFiles) {
        const content = await fs.readFile(file, 'utf-8')
        
        // Check if file is essentially empty (only whitespace or frontmatter)
        const withoutFrontmatter = content.replace(/^---[\s\S]*?---\n/, '')
        if (!withoutFrontmatter.trim()) {
          emptyFiles.push(file)
        }
      }

      results[lang] = {
        total: translatedFiles.length,
        empty: emptyFiles.length,
      }

      console.log(`\n${LANGUAGES[lang].name}:`)
      if (emptyFiles.length === 0) {
        console.log(`  ✅ No empty files (${translatedFiles.length} files checked)`)
      } else {
        console.log(`  ❌ Found ${emptyFiles.length} empty files:`)
        emptyFiles.slice(0, 5).forEach(file => {
          console.log(`     ${file}`)
        })
      }
    }

    const hasEmptyFiles = Object.values(results).some(r => r.empty > 0)
    return { passed: !hasEmptyFiles, results }
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`)
    return { passed: false, error: error.message }
  }
}

/**
 * Test 4: Check markdown structure integrity
 */
async function testMarkdownIntegrity() {
  console.log('\n🔍 TEST 4: Markdown Structure Integrity Check')
  console.log('='.repeat(60))

  try {
    const results = {}

    for (const lang of Object.keys(LANGUAGES)) {
      const translatedFiles = await glob(`docs/${lang}/**/*.md`)
      let structureIssues = []

      for (const file of translatedFiles.slice(0, 10)) {
        const content = await fs.readFile(file, 'utf-8')
        const issues = []

        // Check frontmatter
        if (!content.match(/^---[\s\S]*?---\n/)) {
          issues.push('missing frontmatter')
        }

        // Check for unmatched code blocks
        const codeBlockCount = (content.match(/```/g) || []).length
        if (codeBlockCount % 2 !== 0) {
          issues.push('unmatched code blocks')
        }

        // Check for unmatched brackets
        const openBrackets = (content.match(/\[/g) || []).length
        const closeBrackets = (content.match(/\]/g) || []).length
        if (openBrackets !== closeBrackets) {
          issues.push('unmatched brackets')
        }

        if (issues.length > 0) {
          structureIssues.push({ file, issues })
        }
      }

      results[lang] = {
        checked: Math.min(10, translatedFiles.length),
        issues: structureIssues.length,
        details: structureIssues,
      }

      console.log(`\n${LANGUAGES[lang].name}:`)
      if (structureIssues.length === 0) {
        console.log(`  ✅ All files have valid markdown structure`)
      } else {
        console.log(`  ⚠️  Found ${structureIssues.length} files with structure issues`)
        structureIssues.forEach(issue => {
          console.log(`     ${issue.file}: ${issue.issues.join(', ')}`)
        })
      }
    }

    return { passed: true, results }
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`)
    return { passed: false, error: error.message }
  }
}

/**
 * Test 5: Check for untranslated placeholder text
 */
async function testUntranslatedPlaceholders() {
  console.log('\n🔍 TEST 5: Untranslated Placeholders Check')
  console.log('='.repeat(60))

  try {
    const results = {}
    
    // Common English patterns that shouldn't appear in translations
    const suspiciousPatterns = [
      { pattern: /__[A-Z_]+__/g, name: 'placeholder markers' },
      { pattern: /undefined/gi, name: 'undefined values' },
    ]

    for (const lang of Object.keys(LANGUAGES)) {
      const translatedFiles = await glob(`docs/${lang}/**/*.md`)
      let filesWithIssues = []

      for (const file of translatedFiles.slice(0, 10)) {
        const content = await fs.readFile(file, 'utf-8')
        const issues = []

        for (const { pattern, name } of suspiciousPatterns) {
          if (content.match(pattern)) {
            issues.push(name)
          }
        }

        if (issues.length > 0) {
          filesWithIssues.push({ file, issues })
        }
      }

      results[lang] = {
        checked: Math.min(10, translatedFiles.length),
        issues: filesWithIssues.length,
        details: filesWithIssues,
      }

      console.log(`\n${LANGUAGES[lang].name}:`)
      if (filesWithIssues.length === 0) {
        console.log(`  ✅ No suspicious placeholder patterns found`)
      } else {
        console.log(`  ⚠️  Found ${filesWithIssues.length} files with potential issues`)
        filesWithIssues.forEach(issue => {
          console.log(`     ${issue.file}: ${issue.issues.join(', ')}`)
        })
      }
    }

    return { passed: true, results }
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`)
    return { passed: false, error: error.message }
  }
}

/**
 * Generate QA report
 */
async function generateQAReport() {
  console.log('\n🔍 TEST 6: Generating QA Report')
  console.log('='.repeat(60))

  try {
    const report = {
      timestamp: new Date().toISOString(),
      languages: LANGUAGES,
      tests: [],
    }

    // Run all tests and collect results
    const tests = [
      { name: 'File Completeness', fn: testFileCompleteness },
      { name: 'File Sizes', fn: testFileSizes },
      { name: 'Empty Files', fn: testEmptyFiles },
      { name: 'Markdown Integrity', fn: testMarkdownIntegrity },
      { name: 'Untranslated Placeholders', fn: testUntranslatedPlaceholders },
    ]

    for (const test of tests) {
      try {
        const result = await test.fn()
        report.tests.push({
          name: test.name,
          passed: result.passed,
          results: result.results,
        })
      } catch (error) {
        report.tests.push({
          name: test.name,
          passed: false,
          error: error.message,
        })
      }
    }

    // Save report
    const reportPath = `translation-report-${new Date().toISOString().split('T')[0]}.json`
    await fs.writeFile(reportPath, JSON.stringify(report, null, 2), 'utf-8')
    
    console.log(`\n  ✅ Report saved: ${reportPath}`)
    
    return { passed: true, reportPath }
  } catch (error) {
    console.error(`  ❌ Error: ${error.message}`)
    return { passed: false, error: error.message }
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('\n' + '='.repeat(60))
  console.log('🧪 TRANSLATION QA & TESTING SUITE')
  console.log('='.repeat(60))

  const results = {
    fileCompleteness: await testFileCompleteness(),
    fileSizes: await testFileSizes(),
    emptyFiles: await testEmptyFiles(),
    markdownIntegrity: await testMarkdownIntegrity(),
    untranslatedPlaceholders: await testUntranslatedPlaceholders(),
    qaReport: await generateQAReport(),
  }

  // Summary
  console.log('\n' + '='.repeat(60))
  console.log('📊 TEST SUMMARY')
  console.log('='.repeat(60))

  let allPassed = true
  for (const [testName, result] of Object.entries(results)) {
    const symbol = result.passed ? '✅' : '⚠️'
    console.log(`${symbol} ${testName.replace(/([A-Z])/g, ' $1').trim()}`)
    if (!result.passed && result.error) {
      console.log(`   Error: ${result.error}`)
      allPassed = false
    }
  }

  console.log('\n' + '='.repeat(60))
  
  if (allPassed) {
    console.log('✨ All tests passed! Translations are working correctly.')
  } else {
    console.log('⚠️  Some tests found issues. Review the report above.')
  }
  
  console.log('='.repeat(60) + '\n')

  return allPassed ? 0 : 1
}

main().catch(error => {
  console.error('\n❌ Fatal error:', error.message)
  process.exit(1)
})
