import { COMMIT_COURSE, GET_COURSE, GET_COURSES } from '@/graphql/course';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { message } from 'antd';

/**
 * ? 1. 如果 useQuery 加上了skip: true之后，refetch 和 data 不能同时用，为什么前面列表请求的时候这样写了？
 * 可以忽略，都是graphql相关的
 */

// 列表 list
export const useCourses = (
  pageNum = 1,
  pageSize = DEFAULT_PAGE_SIZE,
) => {
  const { refetch, data } = useQuery<TCoursesQuery>(GET_COURSES, {
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

// 查询课程详情
export const useCourse = (): { getCourse: Function, loading: boolean, data: ICourse } => {
  // useLazyQuery 如果入参不发生变化，调get触发，也不会重新请求
  const [get, { data, loading }] = useLazyQuery(GET_COURSE);

  const getCourse = async (
    id: string,
  ) => {
    const res = await get({
      variables: {
        id,
      },
    });
    return res.data.getCourseInfo.data; // 这里是外部调 getCourse 拿到的data，字段简化
  };

  return {
    getCourse,
    loading,
    data,
  };
};

export const useCourseInfo = (id: string) => {
  const { data, loading, refetch } = useQuery<TCourseQuery>(GET_COURSE, {
    variables: {
      id,
    },
  });
  return {
    data: data?.getCourseInfo.data,
    loading,
    refetch,
  };
};
