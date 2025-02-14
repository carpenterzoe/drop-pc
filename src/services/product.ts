import {
  GET_PRODUCTS,
} from '@/graphql/product';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';
import { useQuery } from '@apollo/client';

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
