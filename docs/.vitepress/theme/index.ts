import DefaultTheme from 'vitepress/theme'
import { App } from 'vue'
import './custom.css'

export default {
  ...DefaultTheme,
  async enhanceApp({ app }: { app: App }) {
    app.component(
      'Counter',
      (await import('../components/Counter.vue')).default
    )
    app.component(
      'VideoPlayer',
      (await import('../components/VideoPlayer.vue')).default
    ),
     app.component(
      'CssTip',
      (await import('../components/css/CssTip.vue')).default
    )
    app.component(
      'JsTip',
      (await import('../components/js/JsTip.vue')).default
    )
  },
}
