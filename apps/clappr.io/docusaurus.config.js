// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Clappr',
  tagline: 'An extensible media player for web applications',
  url: 'https://clappr.io',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/favicon.ico',

  // GitHub pages deployment config.
  organizationName: 'clappr',
  projectName: 'clappr',

  // Even if you don't use internalization, you can use this field to set useful
  // metadata like html lang. For example, if your site is Chinese, you may want
  // to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'pt-BR'],
  },

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Clappr',
        logo: {
          alt: 'Clappr Logo',
          // src: 'img/clappr_logo_black.png',
          src: 'img/clappr_icon_black.png',
          // srcDark: 'img/clappr_logo_white.png',
          srcDark: 'img/clappr_icon_white.png',
        },
        items: [
          {
            to: '/docs/intro',
            label: 'Docs',
            position:
            'left'
          },
          {
            to: 'http://clappr.github.io/',
            label: 'API',
            position:
            'left'
          },
          {
            href: 'https://github.com/clappr/clappr',
            label: 'GitHub',
            position: 'right',
          },
          {
            type: 'localeDropdown',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [
          {
            title: 'Learn',
            items: [
              {
                label: 'Getting Started',
                to: '/getting-started/intro',
              },
              {
                label: 'Docs',
                to: '/docs/intro',
              },
              {
                label: 'API',
                to: 'http://clappr.github.io/',
              },
            ],
          },
          {
            title: 'Community',
            items: [
              {
                label: 'Stack Overflow',
                href: 'https://stackoverflow.com/questions/tagged/clappr',
              },
              {
                label: 'GitHub',
                href: 'https://github.com/clappr/clappr',
              },
            ],
          },
        ],
        copyright: `Copyright © ${new Date().getFullYear()} Clappr, Inc. Built with Docusaurus.`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
