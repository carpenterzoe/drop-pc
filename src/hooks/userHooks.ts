import { GET_USER } from '@/graphql/user';
import { connectFactory, useAppContext } from '@/utils/contextFactory';
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

/**
 * 当前hook的三要素：
 *
 * 1. useGetUser 存数据
 * 2. wrapProvider 提供Provider，用于包裹子组件
 * 3. useUserContext 取数据
 *
 * 0. useUserContext 基础api，存取数据都要先调用
 *
 * 所以从这个hook可以总结，当我们封装一个模块，需要确定 在当前维度，什么样的信息需要被抽象在内。
 * 比如 userHook 中，只包含用户信息存取的内容；
 * 而更上一层的抽象，contextFactory 都是聚焦于 context 的抽象。
 */

const KEY = 'userInfo';
const DEFAULT_VALUE = {};

// 0. 基础api，基础api，存取数据都要先调用
// equal to useContext. use it to get store or setStore method.
// 这里再套一层function，是为了其他组件方便调用，把user相关的内容都封装到当前hook
export const useUserContext = () => useAppContext(KEY);

// 1. 存数据
// req data and set to store
export const useGetUser = () => {
  const { setStore } = useUserContext();
  const nav = useNavigate();

  useQuery(GET_USER, {
    onCompleted: (data) => {
      if (data.getUserInfo) {
        setStore(data.getUserInfo);
        return;
      }

      nav('/login');
    },
  });
};

// 2. Provider 包裹子组件
export const wrapProvider = connectFactory(KEY, DEFAULT_VALUE);

// 3. 取数据 useContext
