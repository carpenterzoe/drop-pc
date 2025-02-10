import { useMutation, useQuery } from '@apollo/client';
import {
  COMMIT_ORG,
  DEL_ORG,
  GET_ORG,
  GET_ORGS,
} from '@/graphql/org';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';
import { message } from 'antd';

/**
 * service作用
 * 1. 发请求
 * 2. 对返回数据做一层转换处理
 */
export const useOrganizations = (
  pageNum = 1,
  pageSize = DEFAULT_PAGE_SIZE,
) => {
  // useQuery<T> 这里<T>定义的是 useQuery 的返回类型
  const { loading, data, refetch } = useQuery<TOrgsQuery>(GET_ORGS, {
    variables: {
      page: {
        pageNum,
        pageSize,
      },
    },
  });

  return {
    loading,
    refetch,
    page: data?.getOrganizations.page,
    data: data?.getOrganizations.data,
  };
};

export const useDeleteOrg = (): [handleEdit: Function, loading: boolean] => {
  const [del, { loading }] = useMutation(DEL_ORG);

  const delHandler = async (id: number, callback: () => void) => {
    const res = await del({
      variables: {
        id,
      },
    });
    if (res.data.deleteOrganization.code === 200) {
      message.success(res.data.deleteOrganization.message);
      callback();
      return;
    }
    message.error(res.data.deleteOrganization.message);
  };

  return [delHandler, loading];
};

export const useOrganization = (id: string) => {
  const { loading, data } = useQuery<TOrgQuery>(GET_ORG, {
    variables: {
      id,
    },
  });

  return {
    loading,
    data: data?.getOrganizationInfo.data,
  };
};

export const useEditInfo = (): [handleEdit: Function, loading: boolean] => {
  const [edit, { loading }] = useMutation(COMMIT_ORG);

  const handleEdit = async (id: number, params: TBaseOrganization) => {
    const res = await edit({
      variables: {
        id,
        params,
      },
    });
    message.info(res.data.commitOrganization.message);
  };

  return [handleEdit, loading];
};
