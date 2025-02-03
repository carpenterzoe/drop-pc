import { useUserContext } from '@/hooks/userHooks';

const Home = () => {
  const { store } = useUserContext();
  return (
    <div>
      {store.tel}
    </div>
  );
};
export default Home;
