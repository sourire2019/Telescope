// 菜单配置
// headerMenuConfig：头部导航配置
// asideMenuConfig：侧边导航配置

const headerMenuConfig = [
  {
    id : "language",
    external: true,
    icon: 'fa fa-language fa-lg mt-4',
  },
  {
    path: 'https://github.com/DSiSc/justitia',
    external: true,
    newWindow: true,
    icon: 'fa fa-github fa-lg mt-4',
  },
];

const asideMenuConfig = [
  {
    name: 'Nav17',
    path: '/page17',
    icon: 'icon-home',
  },
  {
    name: 'NODES',
    path: '/nodes',
    icon: 'icon-options-vertical',
  },
  {
    name: 'BLOCKS',
    path: '/blocks',
    icon: 'icon-grid',
  },
  {
    name: 'CONTRACTS',
    path: '/contracts',
    icon: 'icon-layers',
  },
  {
    name: 'CHAINS',
    path: '/chains',
    icon: 'icon-graph',
  },
  {
    name: 'TRANSACTIONS',
    path: '/transactions',
    icon: 'icon-social-tumblr',
  },
];

export { headerMenuConfig, asideMenuConfig };
