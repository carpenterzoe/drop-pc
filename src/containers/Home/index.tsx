import { useGoTo } from '@/hooks';
import { useUserContext } from '@/hooks/userHooks';
import { ROUTE_KEY } from '@/routes/menus';
import { Button } from 'antd';

/**
 * 循环依赖：Home组件引用了 routes ， routes 内部也 import 了当前组件。
 *
 * 解决方案：把存在循环依赖的某部分单独隔离开。比如这里是 routes 中的 element，所以要想办法隔离。
 */
const Home = () => {
  const { store } = useUserContext();
  const { go } = useGoTo();
  return (
    <div style={{
      backgroundColor: 'orange',
      height: '30vh',
    }}
    >
      <Button onClick={() => go(ROUTE_KEY.MY)}>去个人中心</Button>
      {store.currentOrg}
    </div>
  );
};
export default Home;
