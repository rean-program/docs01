#!/usr/bin/env node
/**
 * Configuration Validation Script
 * Verifies all translation and VitePress configuration is correct
 */

import fs from 'fs/promises'
import path from 'path'

async function validateConfigs() {
  console.log('\n' + '='.repeat(60))
  console.log('🔍 CONFIGURATION VALIDATION')
  console.log('='.repeat(60) + '\n')

  let allValid = true

  // Check translation.config.json
  try {
    console.log('📋 Checking translation.config.json...')
    const translationConfig = JSON.parse(
      await fs.readFile('translation.config.json', 'utf-8')
    )

    if (!translationConfig.sourceLanguage) {
      console.log('  ❌ Missing sourceLanguage')
      allValid = false
    } else {
      console.log(`  ✅ Source language: ${translationConfig.sourceLanguage}`)
    }

    if (!translationConfig.targetLanguages || translationConfig.targetLanguages.length === 0) {
      console.log('  ❌ Missing or empty targetLanguages')
      allValid = false
    } else {
      console.log(`  ✅ Target languages: ${translationConfig.targetLanguages.join(', ')}`)
    }

    if (!translationConfig.languages || Object.keys(translationConfig.languages).length === 0) {
      console.log('  ❌ Missing or empty languages configuration')
      allValid = false
    } else {
      console.log(`  ✅ Configured languages: ${Object.keys(translationConfig.languages).length}`)
    }

    if (!translationConfig.translationSettings) {
      console.log('  ⚠️  Missing translationSettings')
    } else {
      console.log('  ✅ Translation settings configured')
    }
  } catch (error) {
    console.log(`  ❌ Error reading translation.config.json: ${error.message}`)
    allValid = false
  }

  // Check VitePress config
  try {
    console.log('\n📋 Checking VitePress config...')
    const config = await fs.readFile('.vitepress/config.js', 'utf-8')

    if (!config.includes('locales')) {
      console.log('  ⚠️  No locales configured in VitePress')
    } else {
      console.log('  ✅ Locales configured')
    }

    if (!config.includes('defineConfig')) {
      console.log('  ❌ Missing defineConfig')
      allValid = false
    } else {
      console.log('  ✅ defineConfig present')
    }
  } catch (error) {
    console.log(`  ❌ Error reading VitePress config: ${error.message}`)
    allValid = false
  }

  // Check theme config
  try {
    console.log('\n📋 Checking theme configuration...')
    const themeExists = await fs.access('docs/.vitepress/theme/index.js').then(() => true).catch(() => false)
    
    if (themeExists) {
      console.log('  ✅ Theme index.js exists')
    } else {
      console.log('  ⚠️  Theme index.js not found')
    }

    const styleExists = await fs.access('docs/.vitepress/theme/style.css').then(() => true).catch(() => false)
    
    if (styleExists) {
      console.log('  ✅ Theme style.css exists')
    } else {
      console.log('  ⚠️  Theme style.css not found')
    }
  } catch (error) {
    console.log(`  ⚠️  Error checking theme: ${error.message}`)
  }

  // Check package.json
  try {
    console.log('\n📋 Checking package.json...')
    const pkg = JSON.parse(await fs.readFile('package.json', 'utf-8'))

    const requiredScripts = ['docs:dev', 'docs:build', 'translate:all', 'debug']
    const missingScripts = requiredScripts.filter(s => !pkg.scripts[s])

    if (missingScripts.length > 0) {
      console.log(`  ⚠️  Missing scripts: ${missingScripts.join(', ')}`)
    } else {
      console.log('  ✅ All required scripts present')
    }

    const requiredDeps = ['vitepress', '@vitalets/google-translate-api', 'glob']
    const missingDeps = requiredDeps.filter(d => !pkg.dependencies[d])

    if (missingDeps.length > 0) {
      console.log(`  ⚠️  Missing dependencies: ${missingDeps.join(', ')}`)
      allValid = false
    } else {
      console.log('  ✅ All required dependencies installed')
    }
  } catch (error) {
    console.log(`  ❌ Error reading package.json: ${error.message}`)
    allValid = false
  }

  // Check directory structure
  try {
    console.log('\n📋 Checking directory structure...')
    const requiredDirs = ['docs', 'scripts', '.vitepress']
    
    for (const dir of requiredDirs) {
      const exists = await fs.access(dir).then(() => true).catch(() => false)
      console.log(`  ${exists ? '✅' : '❌'} ${dir}`)
      if (!exists) allValid = false
    }
  } catch (error) {
    console.log(`  ⚠️  Error checking directories: ${error.message}`)
  }

  // Summary
  console.log('\n' + '='.repeat(60))
  if (allValid) {
    console.log('✅ All configurations are valid!')
  } else {
    console.log('❌ Some configurations are missing or invalid.')
    console.log('Please review the issues above.')
  }
  console.log('='.repeat(60) + '\n')

  process.exit(allValid ? 0 : 1)
}

validateConfigs().catch(error => {
  console.error('Fatal error:', error.message)
  process.exit(1)
})
