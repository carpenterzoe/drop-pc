import { GET_COURSES } from '@/graphql/course';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';
import { useQuery } from '@apollo/client';

export const useCourses = (
  pageNum = 1,
  pageSize = DEFAULT_PAGE_SIZE,
) => {
  const { refetch, data } = useQuery<TCourseQuery>(GET_COURSES, {
    // 避免 useQuery 内部封装的初始化请求，在一进页面就执行
    // 让 antd protable 的 request 执行即可，避免重复请求
    skip: true,
    variables: {
      page: {
        pageNum,
        pageSize,
      },
    },
  });

  // 这里 refetchHandler 再一次封装，是为了适配 ProTable。
  // 但是处理逻辑又跟 component 分开，保持 component 内容单一。
  const refetchHandler = async (params: {
    name?: string;
    pageSize?: number;
    current?: number;
  }) => {
    const { data: res, errors } = await refetch({
      name: params.name,
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
      total: res?.getCourses.page?.total,
      data: res?.getCourses.data,
      success: true,
    };
  };
  return {
    refetch: refetchHandler,
    data: data?.getCourses.data,
  };
};
