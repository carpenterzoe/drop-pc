import { useGoTo } from '@/hooks';
import { useUserContext } from '@/hooks/userHooks';
import { ROUTE_KEY } from '@/routes';
import { Button } from 'antd';

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
      {store.tel}
    </div>
  );
};
export default Home;
