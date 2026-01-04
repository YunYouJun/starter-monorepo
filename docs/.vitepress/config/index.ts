import type { DefaultTheme } from 'vitepress'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { getVitepressConfig } from '@yunyoujun/docs'
import { defineConfig } from 'vitepress'
import { groupIconMdPlugin } from 'vitepress-plugin-group-icons'
import { version } from '../../../package.json'
import typedocSidebar from '../../api/typedoc-sidebar.json'

const GUIDES: DefaultTheme.NavItemWithLink[] = [
  { text: 'What is starter-monorepo?', link: '/guide/what-is' },
  { text: 'Getting Started', link: '/guide/getting-started' },
  { text: 'Configuration', link: '/guide/configuration' },
]

const VERSIONS: (DefaultTheme.NavItemWithLink | DefaultTheme.NavItemChildren)[] = [
  { text: `v${version} (current)`, link: '/' },
  { text: `Release Notes`, link: 'https://github.com/YunYouJun/starter-monorepo/releases' },
  { text: `Changelog`, link: '/changelog' },
]

const vpConfig = getVitepressConfig({
  repo: 'https://github.com/YunYouJun/starter-monorepo',
})

export default defineConfig({
  ...vpConfig,

  title: 'starter-monorepo',
  description: 'TypeScript Monorepo Starter with VitePress Documentation',
  markdown: {
    codeTransformers: [
      transformerTwoslash(),
    ],
    languages: ['js', 'jsx', 'ts', 'tsx'],
    config: (md) => {
      md.use(groupIconMdPlugin)
    },
  },
  cleanUrls: true,

  themeConfig: {
    ...vpConfig.themeConfig,

    search: {
      provider: 'local',
    },

    nav: [
      {
        text: 'Guide',
        items: [
          {
            items: GUIDES,
          },
        ],
      },
      {
        text: 'API',
        link: '/api/',
      },
      {
        text: `v${version}`,
        items: VERSIONS,
      },
    ],
    sidebar: {
      '/': [
        {
          text: 'Guide',
          items: GUIDES,
        },
      ],
      '/api/': typedocSidebar,
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/YunYouJun/starter-monorepo' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025-PRESENT YunYouJun.',
    },
  },

  head: [
    ['link', { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'author', content: 'YunYouJun' }],
    ['meta', { property: 'og:title', content: 'starter-monorepo' }],
    ['meta', { property: 'og:description', content: 'TypeScript Monorepo Starter with VitePress Documentation' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover' }],
  ],
})
