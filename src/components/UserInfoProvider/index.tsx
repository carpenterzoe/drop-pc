import { wrapProvider, useGetUser } from '@/hooks/userHooks';

/**
 * 获取用户信息的组件
 */
const UserInfo = () => {
  useGetUser();
  return null;
};
/**
 * wrapProvider 返回的是一个函数组件，该函数组件被CurCxt.Provider包裹.
 * thus, 所有被 wrapProvider 包裹的组件都可以访问到CurCxt.Provider中的数据和方法.
 *
 * the function actually returns a function component, which is wrapped by CurCxt.Provider.
 * so all components wrapped by this new component can access data and methods in CurCxt.Provider.
 */
export default wrapProvider(UserInfo);
