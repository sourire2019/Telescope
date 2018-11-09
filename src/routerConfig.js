// 以下文件格式为描述路由的协议格式
// 你可以调整 routerConfig 里的内容
// 变量名 routerConfig 为 iceworks 检测关键字，请不要修改名称

import { getRouterData } from './utils/utils';
import { asideMenuConfig } from './menuConfig';

import BasicLayout from './layouts/BasicLayout';

import Page17 from './pages/Page17';
import Nodes from './pages/Nodes';
import Blocks from './pages/Blocks';
import Contracts from './pages/Contracts';
import Chains from './pages/Chains';
import Transactions from './pages/Transactions';

const routerConfig = [
  {
    path: '/page17',
    component: Page17,
  },
  {
    path: '/nodes',
    component: Nodes,
  },
  {
    path: '/blocks',
    component: Blocks,
  },
  {
    path: '/contracts',
    component: Contracts,
  },
  {
    path: '/chains',
    component: Chains,
  },
  {
    path: '/transactions',
    component: Transactions,
  },
];

const routerData = getRouterData(routerConfig, asideMenuConfig);

export { routerData };
