import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/docs01/',
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

  themeConfig: {
    // Navigation menu (top bar)
    nav: [
      { text: 'Home', link: '/' },
      { text: 'Guide', link: '/guide/' },
      {
        text: 'Tutorials',
        items: [
          { text: 'HTML', link: '/guide/html/' },
          { text: 'CSS', link: '/guide/css/' },
          { text: 'JavaScript', link: '/guide/javascript/' },
          { text: 'TypeScript', link: '/guide/typescript/' },
          { text: 'React', link: '/guide/react/' },
          { text: 'Node.js', link: '/guide/nodejs/' },
          { text: 'Express', link: '/guide/express/' },
          { text: 'NestJS', link: '/guide/nestjs/' },
          { text: 'PostgreSQL', link: '/guide/postgresql/' },
        ],
      },
      { text: 'PostgreSQL', link: '/guide/postgresql/' },
    ],

    // Sidebar navigation
    sidebar: {
      // PostgreSQL dedicated sidebar
      '/guide/postgresql/': [
        {
          text: 'PostgreSQL',
          items: [
            { text: 'Overview', link: '/guide/postgresql/' },
            { text: 'Introduction', link: '/guide/postgresql/01-introduction' },
            { text: 'Installation', link: '/guide/postgresql/02-installation' },
            { text: 'SQL Basics', link: '/guide/postgresql/03-basics' },
            { text: 'Data Types', link: '/guide/postgresql/04-data-types' },
            { text: 'Queries', link: '/guide/postgresql/05-queries' },
            { text: 'JOINs', link: '/guide/postgresql/06-joins' },
            { text: 'Functions', link: '/guide/postgresql/07-functions' },
            { text: 'Indexes', link: '/guide/postgresql/08-indexes' },
            { text: 'Transactions', link: '/guide/postgresql/09-transactions' },
            { text: 'Security', link: '/guide/postgresql/10-security' },
          ],
        },
      ],
      // Default sidebar
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
