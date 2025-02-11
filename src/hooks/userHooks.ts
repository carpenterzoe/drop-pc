import { GET_USER } from '@/graphql/user';
import { connectFactory, useAppContext } from '@/utils/contextFactory';
import { useQuery } from '@apollo/client';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * 当前hook的三要素：
 *
 * 1. 提供 key, defaultValue => createContext
 * 2. useGetUser 存数据
 * 3. wrapProvider 提供Provider，用于包裹子组件 (connectFactory 制造)
 * 4. useUserContext 取数据
 *
 * 0. useUserContext 基础api，存取数据都要先调用
 *
 * 所以从这个hook可以总结，当我们封装一个模块，需要确定 在当前维度，什么样的信息需要被抽象在内。
 * 比如 userHook 中，只包含用户信息存取的内容；
 * 而更上一层的抽象，contextFactory 都是聚焦于 context 的抽象。
 */

const KEY = 'userInfo';
const DEFAULT_VALUE = {};

// 1. createContext
export const wrapProvider = connectFactory(KEY, DEFAULT_VALUE);

// 0. 基础api，基础api，存取数据都要先调用
// equal to useContext. use it to get store or setStore method.
// 这里再套一层function，是为了其他组件方便调用，把user相关的内容都封装到当前hook
export const useUserContext = () => useAppContext<IUser>(KEY);

// 2. 存数据
// req data and set to store
export const useGetUser = () => {
  const { setStore } = useUserContext();
  const { pathname } = useLocation();

  const nav = useNavigate(); // useNavigate 只能在路由组件中使用

  // useQuery<T>(); 指定useQuery的返回值类型
  const { loading, refetch } = useQuery<{ getUserInfo: IUser }>(GET_USER, {
    onCompleted: (data) => {
      if (data.getUserInfo) {
        // setStore(data.getUserInfo);
        const {
          id, name, tel, desc, avatar,
        } = data.getUserInfo;
        setStore({
          id,
          name,
          tel,
          desc,
          avatar,
          // 这样传是为了context包裹的其他组件都能通过store调用到这个方法，重新刷新用户数据
          refetchHandler: refetch, // 把这个function 存到store里面
          // 需要明确该方法的使用场景，如果是直接页面初始化，store里面会存用户信息
          // 该方法是要提供给除了初始化场景之外的其他方法去调用的
          // 所以这里初始化拿用户信息失败的时候，要把方法存进去
        });
        // nav('/');  // 不能无差别跳转，非登录页也会走到这里
        if (pathname.startsWith('/login')) {
          nav('/');
        }
        return;
      }

      // 需要明确该方法的使用场景，如果是直接页面初始化，store里面会存用户信息
      // 该方法是要提供给除了初始化场景之外的其他方法去调用的
      // 所以这里初始化拿用户信息失败的时候，要把方法存进去
      setStore({
        refetchHandler: refetch,
      });
    },
    onError() {
      // 需要明确该方法的使用场景，如果是直接页面初始化，store里面会存用户信息
      // 该方法是要提供给除了初始化场景之外的其他方法去调用的
      // 所以这里初始化拿用户信息失败的时候，要把方法存进去
      setStore({
        refetchHandler: refetch,
      });
      if (pathname !== '/login') {
        nav(`/login?from=${pathname}`);
      }
    },
  });

  return { loading, refetch };
};

// 3. Provider 包裹子组件
// 外部调用 wrapProvider()

// 4. 取数据 useContext
// 外部调用 useUserContext()
