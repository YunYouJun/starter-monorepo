import type { DefaultTheme } from 'vitepress'
import { transformerTwoslash } from '@shikijs/vitepress-twoslash'
import { getVitepressConfig } from '@yunyoujun/docs'
import { defineConfig } from 'vitepress'
import { groupIconMdPlugin } from 'vitepress-plugin-group-icons'
import { version } from '../../../package.json' with { type: 'json' }
import typedocSidebar from '../../api/typedoc-sidebar.json' with { type: 'json' }

const REPOSITORY_URL = 'https://github.com/YunYouJun/starter-monorepo'

const ZH_MARKDOWN = {
  container: {
    infoLabel: '信息',
    noteLabel: '说明',
    tipLabel: '提示',
    warningLabel: '警告',
    dangerLabel: '危险',
    detailsLabel: '详情',
    importantLabel: '重要',
    cautionLabel: '注意',
  },
  codeCopyButton: {
    tooltipText: '复制代码',
    copiedText: '已复制',
  },
}

const EN_GUIDES: DefaultTheme.NavItemWithLink[] = [
  { text: 'What is starter-monorepo?', link: '/guide/what-is' },
  { text: 'Getting Started', link: '/guide/getting-started' },
  { text: 'Configuration', link: '/guide/configuration' },
]

const ZH_GUIDES: DefaultTheme.NavItemWithLink[] = [
  { text: '什么是 starter-monorepo？', link: '/zh/guide/what-is' },
  { text: '快速开始', link: '/zh/guide/getting-started' },
  { text: '配置', link: '/zh/guide/configuration' },
]

const EN_VERSIONS: (DefaultTheme.NavItemWithLink | DefaultTheme.NavItemChildren)[] = [
  { text: `v${version} (current)`, link: '/' },
  { text: `Release Notes`, link: `${REPOSITORY_URL}/releases` },
  { text: `Changelog`, link: '/changelog' },
]

const ZH_VERSIONS: (DefaultTheme.NavItemWithLink | DefaultTheme.NavItemChildren)[] = [
  { text: `v${version}（当前版本）`, link: '/zh/' },
  { text: `发布说明`, link: `${REPOSITORY_URL}/releases` },
  { text: `更新日志（英文）`, link: '/changelog' },
]

const vpConfig = getVitepressConfig({
  repo: REPOSITORY_URL,
})

export default defineConfig({
  ...vpConfig,

  title: 'starter-monorepo',
  description: 'TypeScript Monorepo Starter with VitePress Documentation',
  locales: {
    root: {
      label: 'English',
      lang: 'en',
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      description: '基于 TypeScript、内置 VitePress 文档的 Monorepo 起始模板',
      markdown: ZH_MARKDOWN,
      themeConfig: {
        nav: [
          {
            text: '指南',
            items: [
              {
                items: ZH_GUIDES,
              },
            ],
          },
          {
            text: 'API（英文）',
            link: '/api/',
          },
          {
            text: `v${version}`,
            items: ZH_VERSIONS,
          },
        ],
        sidebar: {
          '/zh/guide/': [
            {
              text: '指南',
              items: ZH_GUIDES,
            },
          ],
        },
        outline: {
          level: [2, 4],
          label: '本页目录',
        },
        editLink: {
          pattern: `${REPOSITORY_URL}/edit/main/docs/:path`,
          text: '在 GitHub 上编辑此页',
        },
        lastUpdated: {
          text: '最后更新于',
          formatOptions: {
            dateStyle: 'short',
            timeStyle: 'short',
            forceLocale: true,
          },
        },
        docFooter: {
          prev: '上一页',
          next: '下一页',
        },
        footer: {
          message: '基于 MIT 许可证发布。',
          copyright: '版权所有 © 2025-PRESENT YunYouJun。',
        },
        darkModeSwitchLabel: '外观',
        lightModeSwitchTitle: '切换到浅色主题',
        darkModeSwitchTitle: '切换到深色主题',
        sidebarMenuLabel: '菜单',
        returnToTopLabel: '返回顶部',
        langMenuLabel: '切换语言',
        skipToContentLabel: '跳转到正文',
        notFound: {
          title: '页面未找到',
          quote: '你访问的页面不存在或已被移动。',
          link: '/zh/',
          linkLabel: '返回中文首页',
          linkText: '返回首页',
        },
      },
    },
  },
  markdown: {
    // VitePress local search initializes the renderer before locale options are merged.
    locales: {
      zh: ZH_MARKDOWN,
    },
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
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索',
                buttonAriaLabel: '搜索文档',
              },
              modal: {
                displayDetails: '显示详细列表',
                resetButtonTitle: '重置搜索',
                backButtonTitle: '关闭搜索',
                noResultsText: '没有找到相关结果',
                footer: {
                  selectText: '选择',
                  navigateText: '切换',
                  closeText: '关闭',
                },
              },
            },
          },
        },
      },
    },

    nav: [
      {
        text: 'Guide',
        items: [
          {
            items: EN_GUIDES,
          },
        ],
      },
      {
        text: 'API',
        link: '/api/',
      },
      {
        text: `v${version}`,
        items: EN_VERSIONS,
      },
    ],
    sidebar: {
      '/guide/': [
        {
          text: 'Guide',
          items: EN_GUIDES,
        },
      ],
      '/api/': typedocSidebar,
    },

    i18nRouting: (_, route, targetLocale) => {
      const isSharedEnglishPage = route.path === '/changelog'
        || route.path.startsWith('/api/')

      if (isSharedEnglishPage) {
        const targetHome = targetLocale === 'root' ? '/' : `/${targetLocale}/`
        return `${targetHome}${route.query}${route.hash}`
      }

      const localeFreePath = route.path.replace(/^\/zh(?=\/|$)/, '') || '/'
      const targetPath = targetLocale === 'root'
        ? localeFreePath
        : `/${targetLocale}${localeFreePath === '/' ? '/' : localeFreePath}`

      return `${targetPath}${route.query}${route.hash}`
    },

    outline: {
      level: [2, 4],
      label: 'On this page',
    },

    editLink: {
      pattern: `${REPOSITORY_URL}/edit/main/docs/:path`,
      text: 'Edit this page on GitHub',
    },

    lastUpdated: {
      text: 'Last updated',
    },

    docFooter: {
      prev: 'Previous page',
      next: 'Next page',
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
