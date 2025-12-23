import { defineConfig } from 'vitepress'

export default defineConfig({
  title: 'AI Documentation',
  description: 'Comprehensive AI Learning Guide with Multi-language Support',
  lang: 'en-US',
  
  // Multi-language support
  locales: {
    root: {
      label: 'English',
      lang: 'en-US',
      title: 'AI Documentation',
      description: 'Comprehensive AI Learning Guide',
    },
    km: {
      label: 'ភាសាខ្មែរ',
      lang: 'km-KH',
      title: 'ឯកសារ AI',
      description: 'មគ្គុទ្ធិការរៀនសូត្របន្ថែម AI',
      link: '/km/',
    },
    zh: {
      label: '中文',
      lang: 'zh-CN',
      title: 'AI 文档',
      description: 'AI 综合学习指南',
      link: '/zh/',
    },
    ja: {
      label: '日本語',
      lang: 'ja-JP',
      title: 'AI ドキュメント',
      description: '包括的な AI 学習ガイド',
      link: '/ja/',
    },
  },

  theme: {
    config: {
      // Navigation for each language
      nav: [
        { text: 'Home', link: '/' },
        { text: 'Guide', link: '/guide/' },
        { text: 'CSS', link: '/guide/css/' },
      ],

      sidebar: {
        '/': [
          {
            text: 'Guide',
            items: [
              { text: 'Introduction', link: '/guide/ai/01-introduction' },
              { text: 'ML Basics', link: '/guide/ai/02-ml-basics' },
            ],
          },
          {
            text: 'CSS',
            items: [
              { text: 'Basics', link: '/guide/css/01-basics' },
              { text: 'Layout', link: '/guide/css/02-layout' },
            ],
          },
        ],
        '/km/': [
          {
            text: 'មគ្គុទ្ធិ',
            items: [
              { text: 'ការណែនាំ', link: '/km/guide/ai/01-introduction' },
              { text: 'មូលដ្ឋាននៃ ML', link: '/km/guide/ai/02-ml-basics' },
            ],
          },
        ],
        '/zh/': [
          {
            text: '指南',
            items: [
              { text: '介绍', link: '/zh/guide/ai/01-introduction' },
              { text: 'ML 基础', link: '/zh/guide/ai/02-ml-basics' },
            ],
          },
        ],
        '/ja/': [
          {
            text: 'ガイド',
            items: [
              { text: '紹介', link: '/ja/guide/ai/01-introduction' },
              { text: 'ML の基礎', link: '/ja/guide/ai/02-ml-basics' },
            ],
          },
        ],
      },

      socialLinks: [
        { icon: 'github', link: 'https://github.com' },
      ],

      editLink: {
        pattern: 'https://github.com/yourusername/repo/edit/main/docs/:path',
        text: 'Edit this page',
      },

      lastUpdated: true,
      lastUpdatedText: 'Last updated',

      docFooter: {
        prev: 'Previous',
        next: 'Next',
      },
    },
  },

  markdown: {
    lineNumbers: true,
    theme: 'material-palenight',
  },

  // Build optimization
  build: {
    minify: 'terser',
    target: 'esnext',
  },

  // Head metadata for each language
  head: [
    ['meta', { charset: 'utf-8' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    ['link', { rel: 'icon', href: '/favicon.ico' }],
  ],
})
