import { GET_COURSES } from '@/graphql/course';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';
import { useQuery } from '@apollo/client';

export const useCourses = (
  pageNum = 1,
  pageSize = DEFAULT_PAGE_SIZE,
) => {
  const { refetch, data } = useQuery(GET_COURSES, {
    variables: {
      page: {
        pageNum,
        pageSize,
      },
    },
  });
  return {
    refetch,
    data: data?.getCourses.data,
  };
};
