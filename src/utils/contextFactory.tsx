/* eslint-disable react/jsx-props-no-spreading */
import {
  createContext, useContext, useMemo, useState,
} from 'react';

interface IStore {
  key: string;
  store: Record<string, any>;
  setStore: (payload: Record<string, any>) => void;
}

interface IProp {
  children: React.ReactNode;
}

const getCxtProvider = (
  key: string,
  defaultValue: Record<string, any>,
  AppContext: React.Context<IStore>,
) => ({ children }: IProp) => {
  const [store, setStore] = useState(defaultValue);
  // useMemo to improve performance, value only changes when [store] changes
  const value = useMemo(() => ({
    key,
    store,
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

// cache context by key. cuz there're many context in one app usually.
const cxtCache:Record<string, Cxt> = {};

// useContext 适用于数据需要跨多层访问的场景, 避免数据通过props层层传递的繁琐
class Cxt {
  defaultStore: IStore;

  AppContext: React.Context<IStore>;

  Provider:({ children }: IProp) => JSX.Element;

  constructor(key: string, defaultValue: Record<string, any>) {
    this.defaultStore = {
      key,
      store: defaultValue,
      setStore: () => {},
    };

    // createContext 创建上下文, 必须先创建上下文, 其他组件才能使用context中的数据和方法
    this.AppContext = createContext<IStore>(this.defaultStore);

    // 创建Provider, Provide 用来包裹组件, 使组件可以访问上下文中的数据和方法
    this.Provider = getCxtProvider(key, defaultValue, this.AppContext);
  }
}

// 这里可以理解为 useContext 生成器
export const useAppContext = (key: string) => {
  const cxt = cxtCache[key];
  const app = useContext(cxt.AppContext);
  return {
    store: app.store,
    setStore: app.setStore,
  };
};

/**
 * key 用来区分不同的 context, store.
 * 返回高阶组件 HOC, 入参是Child, 返回一个函数, 这个函数接收props参数, 并返回 CurCxt.Provider 包裹的Child

 * input key and defaultValue, return a HOC to wrap component.
 * key and defaultValue are used to distinguish different context, especially their store.
 *
 * The HOC accept a component Child as parameter, and return a new function component,
 * which wrap Child with CurCxt.Provider.
 */
export const connectFactory = (key: string, defaultValue: Record<string, any>) => {
  const cxt = cxtCache[key];

  let CurCxt:Cxt;
  if (cxt) {
    CurCxt = cxt;
  } else {
    CurCxt = new Cxt(key, defaultValue);
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
};
