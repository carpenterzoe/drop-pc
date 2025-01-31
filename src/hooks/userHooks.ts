import { GET_USER } from '@/graphql/user';
import { connectFactory, useAppContext } from '@/utils/contextFactory';
import { useQuery } from '@apollo/client';
import { useNavigate } from 'react-router-dom';

const KEY = 'userInfo';
const DEFAULT_VALUE = {};

export const wrapProvider = connectFactory(KEY, DEFAULT_VALUE);

// equal to useContext. use it to get store or setStore method.
export const useUserContext = () => useAppContext(KEY);

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
