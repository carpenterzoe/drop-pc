import { useEffect } from 'react';

export const useTitle = (title: string) => {
  /**
   * useEffect接收两个参数：第一个参数是一个函数，包含要执行的逻辑；
   * 第二个参数是一个依赖项数组，用于控制useEffect的执行时机。
   *
   * ‌空依赖项数组‌：副作用函数仅在组件挂载时执行一次，类似于componentDidMount。
   * 所以这里的逻辑在组件初始化时执行
   */

  // document.title = title;
  useEffect(() => {
    document.title = title;
  }, []);
};
