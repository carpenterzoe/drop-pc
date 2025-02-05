import {
  HomeOutlined,
} from '@ant-design/icons';
import Page404 from '@/containers/404';
import Home from '../containers/Home';

interface IRoute {
  path: string;
  name: string;
  element: () => JSX.Element;
  icon?: React.ReactNode;
  hideInMenu?: boolean;
}

// 这里路由用key值匹配，是为了不同地方跳转时，只要用变量即可
// 如果用字符串匹配，到处都要修改，尤其是微前端跨项目的场景，前缀经常变动，修改很麻烦，很容易遗漏
export const ROUTE_KEY = {
  HOME: 'home',
  MY: 'my',
  PAGE_404: 'p404',
};

export const ROUTE_CONFIG: Record<string, IRoute> = {
  [ROUTE_KEY.HOME]: {
    path: 'home', // 这里没有斜杠，因为Layout已经写了
    name: '首页',
    icon: <HomeOutlined />,
    element: Home,
  },
  [ROUTE_KEY.MY]: {
    path: 'my',
    name: '个人信息',
    hideInMenu: true,
    icon: <HomeOutlined />,
    element: Home,
  },
  [ROUTE_KEY.PAGE_404]: {
    path: '*',
    hideInMenu: true,
    name: '404',
    element: Page404,
  },
};

// 根据key value的内容，生成真正的给router使用的配置
export const routes = Object.keys(ROUTE_CONFIG).map((key) => ({ ...ROUTE_CONFIG[key], key }));

export const getRouteByKey = (key: string) => ROUTE_CONFIG[key];
