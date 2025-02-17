import { COMMIT_CARD, DELETE_CARD, GET_CARDS } from '@/graphql/card';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { message } from 'antd';

/**
 * service 就是对 useQuery useMutation 这样的api二次包装
 * 把入参和返回值包到一起，让外部调用更简洁
 */

// 获取消费卡信息
export const useCards = (id: string) => {
  const { data, loading, refetch } = useQuery<TCardsQuery>(GET_CARDS, {
    variables: {
      courseId: id,
    },
  });
  return {
    data: data?.getCards.data,
    loading,
    refetch,
  };
};

// 手动触发，根据 courseId 获取 cards
export const useLazyCards = () => {
  const [get, { data, loading }] = useLazyQuery(GET_CARDS);

  const getCards = (courseId: string) => {
    get({
      variables: {
        courseId,
      },
    });
  };
  return {
    loading,
    data: data?.getCards.data,
    getCards,
  };
};

// 编辑消费卡
export const useEditCardInfo = (): [
  handleEdit: (id: string, courseId: string, params: TBaseCard, callback: () => void) => void,
  loading: boolean,
] => {
  const [edit, { loading }] = useMutation(COMMIT_CARD);
  const handleEdit = async (
    id: string,
    courseId: string,
    params: TBaseCard,
    callback: () => void,
  ) => {
    const res = await edit({
      variables: {
        params,
        courseId,
        id,
      },
    });
    if (res.data.commitCardInfo.code === 200) {
      message.success(res.data.commitCardInfo.message);
      callback();
      return;
    }
    message.error(res.data.commitCardInfo.message);
  };
  return [handleEdit, loading];
};

// 删除消费卡
export const useDeleteCard = (): [
  delHandler: (id: number, callback: () => void) => void,
  loading: boolean,
] => {
  const [del, { loading }] = useMutation(DELETE_CARD);
  const delHandler = async (id: number, callback: () => void) => {
    const res = await del({
      variables: {
        id,
      },
    });
    if (res.data.deleteCard.code === 200) {
      message.success(res.data.deleteCard.message);
      callback();
      return;
    }
    message.error(res.data.deleteCard.message);
  };

  return [delHandler, loading];
};
