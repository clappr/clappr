// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    'getting_started',
    {
      type: 'category',
      label: 'Guides',
      link: {
        type: 'generated-index',
      },
      collapsed: false,
      items: [
        'guides/events',
        'guides/how_to_build_plugins',
      ],
    },
    'supported_formats',
    'architecture',
    'api',
    'faq',
  ],
};

module.exports = sidebars;
