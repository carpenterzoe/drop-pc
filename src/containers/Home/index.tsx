import { useUserContext } from '@/hooks/userHooks';

const Home = () => {
  const { store } = useUserContext();
  return (
    <div style={{
      backgroundColor: 'orange',
      height: '30vh',
    }}
    >
      {store.tel}
    </div>
  );
};
export default Home;
