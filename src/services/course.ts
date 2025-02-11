import { COMMIT_COURSE, GET_COURSE, GET_COURSES } from '@/graphql/course';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';
import { useMutation, useQuery } from '@apollo/client';
import { message } from 'antd';

// 列表 list
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

// 编辑
export const useEditCourseInfo = (): [handleEdit: Function, loading: boolean] => {
  const [edit, { loading }] = useMutation(COMMIT_COURSE);

  const handleEdit = async (
    id: number,
    params: TBaseCourse,
    callback: (isReload: boolean) => void,
  ) => {
    const res = await edit({
      variables: {
        id,
        params,
      },
    });
    if (res.data.commitCourseInfo.code === 200) {
      message.success(res.data.commitCourseInfo.message);
      callback(true);
      return;
    }
    message.error(res.data.commitCourseInfo.message);
  };

  return [handleEdit, loading];
};
