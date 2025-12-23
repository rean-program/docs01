#!/usr/bin/env node
/**
 * Clean Translation Script
 * Removes existing translated files to regenerate fresh translations
 */

import fs from 'fs/promises'
import path from 'path'
import { glob } from 'glob'

async function cleanTranslations() {
  console.log('\n' + '='.repeat(60))
  console.log('🗑️  TRANSLATION CLEANUP')
  console.log('='.repeat(60) + '\n')

  try {
    // Get all Khmer translated files
    const kmFiles = await glob('docs/km/**/*.md')

    if (kmFiles.length === 0) {
      console.log('ℹ️  No Khmer translations found to clean.')
      console.log('='.repeat(60) + '\n')
      return
    }

    console.log(`Found ${kmFiles.length} Khmer translation file(s) to remove:\n`)

    // Remove each file
    let removed = 0
    for (const file of kmFiles) {
      try {
        await fs.unlink(file)
        console.log(`  ✅ Removed: ${file}`)
        removed++
      } catch (error) {
        console.log(`  ⚠️  Failed to remove: ${file} - ${error.message}`)
      }
    }

    // Remove empty directories
    const kmDirs = await glob('docs/km/**/*/') 
    for (const dir of kmDirs.reverse()) {
      try {
        const files = await fs.readdir(dir)
        if (files.length === 0) {
          await fs.rmdir(dir)
          console.log(`  ✅ Removed empty dir: ${dir}`)
        }
      } catch {
        // Ignore errors on directory removal
      }
    }

    // Try to remove km root directory if empty
    try {
      const kmRoot = 'docs/km'
      const files = await fs.readdir(kmRoot)
      if (files.length === 0) {
        await fs.rmdir(kmRoot)
        console.log(`  ✅ Removed empty dir: ${kmRoot}`)
      }
    } catch {
      // Ignore if directory not empty or doesn't exist
    }

    console.log(`\n${'='.repeat(60)}`)
    console.log(`📊 Cleanup Summary`)
    console.log(`${'='.repeat(60)}`)
    console.log(`  Total removed: ${removed} file(s)`)
    console.log(`${'='.repeat(60)}\n`)

    console.log('✨ Ready to regenerate fresh translations!')
    console.log('   Run: npm run translate:km\n')

  } catch (error) {
    console.error(`❌ Error during cleanup: ${error.message}`)
    process.exit(1)
  }
}

cleanTranslations().catch(console.error)
