import {
  COMMIT_PRODUCT,
  DEL_PRODUCT,
  GET_PRODUCT,
  GET_PRODUCTS,
} from '@/graphql/product';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';
import { useMutation, useQuery } from '@apollo/client';
import { message } from 'antd';
import { useMemo } from 'react';

export const useProducts = (
  pageNum: number = 1,
  pageSize: number = DEFAULT_PAGE_SIZE,
) => {
  const { loading, data, refetch } = useQuery<TProductsQuery>(GET_PRODUCTS, {
    skip: true,
    variables: {
      page: {
        pageNum,
        pageSize,
      },
    },
  });

  const refetchHandler = async (
    params: {
      name?: string,
      pageSize?: number,
      current?: number
    },
  ) => {
    const { data: res, errors } = await refetch({
      name: params.name || '',
      page: {
        pageNum: params.current || 1,
        pageSize: params.pageSize || DEFAULT_PAGE_SIZE,
      },
    });
    if (errors) {
      return {
        success: false,
      };
    }
    return {
      page: res?.getProducts.page.total,
      data: res?.getProducts.data,
      success: true,
    };
  };
  return {
    loading,
    refetch: refetchHandler,
    page: data?.getProducts.page,
    data: data?.getProducts.data,
  };
};

// 编辑商品信息
export const useEditProductInfo = (): [
  handleEdit: (id: string, params: TBaseProduct, callback: ()=> void) => void,
  loading: boolean,
] => {
  const [edit, { loading }] = useMutation(COMMIT_PRODUCT);
  const handleEdit = async (id: string, params: TBaseProduct, callback: ()=> void) => {
    const res = await edit({
      variables: {
        id,
        params,
      },
    });
    if (res.data.commitProductInfo.code === 200) {
      message.success(res.data.commitProductInfo.message);
      callback();
      return;
    }
    message.error(res.data.commitProductInfo.message);
  };
  return [handleEdit, loading];
};

// 获取商品信息 及时获取商品信息
export const useProductInfo = (id: string) => {
  const { data, loading, refetch } = useQuery<TProductQuery>(GET_PRODUCT, {
    skip: !id, // id不存在跳过请求
    variables: {
      id,
    },
  });

  const refetchHandler = async () => {
    const res = await refetch();
    const newData = {
      ...res.data?.getProductInfo.data,
      coverUrl: [{ url: res.data?.getProductInfo.data.coverUrl }],
      bannerUrl: [{ url: res.data?.getProductInfo.data.bannerUrl }],
    };
    return res.data?.getProductInfo.data ? newData : undefined;
  };

  // 对返回的数据进行数组的包裹
  const newData = useMemo(() => ({
    ...data?.getProductInfo.data,
    coverUrl: [{ url: data?.getProductInfo.data.coverUrl }],
    bannerUrl: [{ url: data?.getProductInfo.data.bannerUrl }],
  }), [data]);
  return {
    data: data?.getProductInfo.data ? newData : undefined,
    loading,
    refetch: refetchHandler,
  };
};

// 删除商品信息
export const useDeleteProduct = (): [
  delHandler: (id: string, callback: () => void) => void,
  loading: boolean,
] => {
  const [del, { loading }] = useMutation(DEL_PRODUCT);
  const delHandler = async (id: string, callback: () => void) => {
    const res = await del({
      variables: {
        id,
      },
    });
    if (res.data.deleteProduct.code === 200) {
      message.success(res.data.deleteProduct.message);
      // setTimeout(() => {
      callback();
      // }, 1000);
      return;
    }
    message.error(res.data.deleteProduct.message);
  };

  return [delHandler, loading];
};
