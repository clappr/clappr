// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      link: {
        type: 'generated-index',
      },
      collapsed: false,
      items: [
        'getting-started/installation',
        'getting-started/configuration',
        'getting-started/development',
        'getting-started/playground',
      ],
    },
    {
      type: 'category',
      label: 'Guides',
      link: {
        type: 'generated-index',
      },
      collapsed: false,
      items: [
        'guides/events',
        'guides/playbacks',
        {
          type: 'category',
          label: 'Plugins',
          link: {
            type: 'generated-index',
          },
          collapsed: false,
          items: [
            'guides/plugins/intro',
            'guides/plugins/metrics',
            'guides/plugins/built-in',
            'guides/plugins/external',
            'guides/plugins/building',
          ],
        },
      ],
    },
    'supported_formats',
    'architecture',
    'faq',
  ],
};

module.exports = sidebars;
