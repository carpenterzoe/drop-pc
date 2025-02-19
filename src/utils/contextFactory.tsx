/**
 * 和 userHooks 对比，可以看到 这个模块都是关于 context 层面的封装；
 * 包括：
 * 1. 创建 context
 * 2. 用 key 缓存 context
 * 3. 封装更便捷取数据的 useContext (传key 到缓存中取context)
 * 4. Provider 包裹子组件，抽象复用
 *
 * 其层级比 userHook 要再往上层多抽象一层，封装内容聚焦。
 */

// 这里是一个工厂，生成器
// 需要结合工厂模式理解，以及思考该场景之下工厂模式的优点

/* eslint-disable react/jsx-props-no-spreading */
import {
  createContext, useContext, useMemo, useState,
} from 'react';

interface IStore<T> {
  key: string;
  store: T;
  setStore: (payload: Partial<T>) => void;
}

// 通过该函数生成一个Provider，包裹在组件外面。
function getCxtProvider<T>(
  key: string,
  defaultValue: T,
  AppContext: React.Context<IStore<T>>,
) {
  // 注意这里原本是连续箭头，返回一个函数， ({ children }: IPropChild) 这里是函数的入参类型
  return ({ children }: IPropChild) => {
    // 如果这里不抽象，那么每次组件调用时，为了数据响应式，以及刷新优化
    // 都得 useState & useMemo

    // 不用useState defaultValue 就不能响应式了。
    const [store, setStore] = useState(defaultValue);
    // useMemo to improve performance, value only changes when [store] changes
    const value = useMemo(() => ({
      // 这3个属性是给Provider包裹的子组件使用的
      key,
      store,
      // 增量更新，避免setStore时把已有的值覆盖
      // 这里是接收入参，调用 useState 的 setStore
      // useState 的 setStore 参数中传递更新函数，以拿到最新的state
      setStore: (payload = {}) => setStore((state) => ({
        ...state,
        ...payload,
      })),
    }), [store]);

    return (
      <AppContext.Provider value={value}>
        {children}
      </AppContext.Provider>
    );
  };
}

// cache context by key. cuz there're many context in one app usually.
const cxtCache:Record<string, Cxt> = {};

// useContext 适用于数据需要跨多层访问的场景, 避免数据通过props层层传递的繁琐
class Cxt<T = any> {
  defaultStore: IStore<T>;

  AppContext: React.Context<IStore<T>>;

  Provider:({ children }: IPropChild) => JSX.Element;

  constructor(key: string, defaultValue: T) {
    this.defaultStore = {
      key, // 相当于一个命名空间，因为系统中会存在多个context
      store: defaultValue,
      setStore: () => {}, // ? 这里是否不需要？ 在getCxtProvider useState有对应的 setStore function
    };

    // createContext 创建上下文, 必须先创建上下文, 其他组件才能使用context中的数据和方法
    this.AppContext = createContext<IStore<T>>(this.defaultStore);

    // 创建Provider, Provide 用来包裹组件, 使组件可以访问上下文中的数据和方法
    this.Provider = getCxtProvider<T>(key, defaultValue, this.AppContext);

    cxtCache[key] = this; // 缓存context
  }
}

// 这里的好处是只需要传入key，就能拿到需要的context数据，而不需要在每个子组件都导入具体的context
export function useAppContext <T>(key: string) {
  const cxt = cxtCache[key] as Cxt<T>;
  const app = useContext(cxt.AppContext);
  return {
    store: app.store,
    setStore: app.setStore,
  };
}

/**
 * key 用来区分不同的 context, store.
 * 返回高阶组件 HOC, 入参是Child, 返回一个函数, 这个函数接收props参数, 并返回 CurCxt.Provider 包裹的Child

 * input key and defaultValue, return a HOC to wrap component.
 * key and defaultValue are used to distinguish different context, especially their store.
 *
 * The HOC accept a component Child as parameter, and return a new function component,
 * which wrap Child with CurCxt.Provider.
 */
export function connectFactory<T>(key: string, defaultValue: T) {
  const cxt = cxtCache[key];

  let CurCxt:Cxt<T>;
  if (cxt) {
    CurCxt = cxt;
  } else {
    CurCxt = new Cxt<T>(key, defaultValue); // 构造函数中有缓存逻辑
  }
  /**
   * 这里是返回一个新的function component.
   * (props: any) => (
      <CurCxt.Provider>
        <Child {...props} />
      </CurCxt.Provider>
    );
   * 这里的props是外部调用func时传入, 而不是一开始的参数Child中的.  实际上是拿到props, 传给Child.
   *
   这个 props 实际上是外部在使用高阶组件时传入的，而不是一开始在 Child 组件中就有的。具体流程如下：
    connectFactory 返回一个高阶组件（HOC），这个 HOC 接收一个 Child 组件作为参数。
    当你在外部使用这个高阶组件时，会传入 props。
    这些 props 会被传递给返回的函数组件。
    返回的函数组件再将这些 props 传递给 Child 组件。
   */
  return (Child: React.FunctionComponent<any>) => (props: any) => (
    <CurCxt.Provider>
      <Child {...props} />
    </CurCxt.Provider>
  );
}

export const connectFactory1 = (key: string, defaultValue: Record<string, any>) => {
  const cxt = cxtCache[key];

  let CurCxt: Cxt;
  if (cxt) {
    CurCxt = cxt;
  } else {
    CurCxt = new Cxt(key, defaultValue);
  }

  return (Child: React.FunctionComponent<any>) => (props: any) => (
    <CurCxt.Provider>
      <Child {...props} />
    </CurCxt.Provider>
  );
};
