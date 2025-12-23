import { h } from 'vue'
import Theme from 'vitepress/theme'
import './style.css'

export default {
  extends: Theme,
  
  Layout() {
    return h(Theme.Layout, null, {
      // Add custom slots here if needed
    })
  },

  enhanceApp({ app, router, siteData }) {
    // Store language info globally
    app.config.globalProperties.$langs = {
      en: { name: 'English', nativeName: 'English' },
      km: { name: 'Khmer', nativeName: 'ភាសាខ្មែរ' },
      zh: { name: 'Chinese', nativeName: '中文' },
      ja: { name: 'Japanese', nativeName: '日本語' },
      ko: { name: 'Korean', nativeName: '한국어' },
      vi: { name: 'Vietnamese', nativeName: 'Tiếng Việt' },
      fr: { name: 'French', nativeName: 'Français' },
      es: { name: 'Spanish', nativeName: 'Español' },
      de: { name: 'German', nativeName: 'Deutsch' },
    }

    // Get current language from route
    app.config.globalProperties.$currentLang = () => {
      const path = router.currentRoute.value.path
      const match = path.match(/^\/([a-z]{2})\//)
      return match ? match[1] : 'en'
    }
  },
}
