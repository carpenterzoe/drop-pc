import Home from '@/containers/Home';
import Page404 from '@/containers/404';
import My from '@/containers/My';
import { ROUTE_KEY } from './menus';

/**
 * 解决循环依赖：把存在循环依赖的某部分单独隔离开。
 * 比如这里是把原本 routes 配置中的 element，单独隔离到另外一个文件。
 */
export const ROUTE_COMPONENT = {
  [ROUTE_KEY.HOME]: Home,
  [ROUTE_KEY.MY]: My,
  [ROUTE_KEY.PAGE_404]: Page404,
};
