import Home from '../containers/Home';
import Login from '../containers/Login';

export const ROUTE_CONFIG = [
  {
    key: 'home',
    path: '/',
    element: Home,
    name: '首页',
  },
  {
    key: 'login',
    path: '/login',
    element: Login,
    name: '登录',
    hideInMenu: true,
  },
];
