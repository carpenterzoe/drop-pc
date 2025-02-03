import { wrapProvider, useGetUser } from '@/hooks/userHooks';

/**
 * 该组件做的事情：
 * 1. 数据初始化，存用户信息到 user context
 * 2. 返回 UserInfoProvider，让包裹的子组件能拿到数据
 *
 */

/**
 * 为什么 user context 相关的内容需要进一步拆分到2个文件？
 *
 * 可以看到，当前这个组件的作用 只是
 * 1. 作为Provider 在最外层包裹组件；2. 数据初始化。 这样的特定场景；
 *
 * 而 userHook 抽象可复用的程度更高；
 *
 * 拆分的优点可以总结为：
 * 将组件调用，和 可复用逻辑 拆分开；保持逻辑部分的独立性。
 *
 * 否则如果数据初始化、根组件包裹Provider 这样特定的场景，
 * 和其他可复用的逻辑部分混在一起，显得不伦不类，很混乱。
 *
 * 所以这样做其实是：调用层面，和逻辑层面的一种解耦。
 * 调用场景可以有多个，而统一可复用的底层逻辑是同一套。
 */

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
