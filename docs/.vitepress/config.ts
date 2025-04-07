import type { DefaultTheme } from 'vitepress'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { getVitepressConfig } from '@yunyoujun/docs'
import { defineConfig } from 'vitepress'
import { groupIconMdPlugin } from 'vitepress-plugin-group-icons'
import { version } from '../../package.json'

import vite from './vite.config'

const GUIDES: DefaultTheme.NavItemWithLink[] = [
  { text: 'Getting Started', link: '/guide/' },
  { text: 'Installation & Usage', link: '/guide/install' },
]

const VERSIONS: (DefaultTheme.NavItemWithLink | DefaultTheme.NavItemChildren)[] = [
  { text: `v${version} (current)`, link: '/' },
  { text: `Release Notes`, link: 'https://github.com/YunYouJun/pkg-placeholder/releases' },
]

const vpConfig = getVitepressConfig({
  repo: 'https://github.com/YunYouJun/starter-monorepo',
})

export default defineConfig({
  ...vpConfig,

  title: 'pkg-placeholder',
  description: '_description_',
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
  vite,
  themeConfig: {
    ...vpConfig.themeConfig,

    // logo: '/logo.svg',
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
    },

    socialLinks: [
      { icon: 'github', link: 'https://github.com/YunYouJun/pkg-placeholder' },
    ],

    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2025-PRESENT YunYouJun.',
    },
  },

  head: [
    // ['meta', { name: 'theme-color', content: '#ffffff' }],
    // ['link', { rel: 'icon', href: '/logo.svg', type: 'image/svg+xml' }],
    ['meta', { name: 'author', content: 'YunYouJun' }],
    // ['meta', { property: 'og:title', content: '' }],
    // ['meta', { property: 'og:image', content: '' }],
    // ['meta', { property: 'og:description', content: '_description_' }],
    // ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    // ['meta', { name: 'twitter:image', content: '' }],
    ['meta', { name: 'viewport', content: 'width=device-width, initial-scale=1.0, viewport-fit=cover' }],
  ],
})
