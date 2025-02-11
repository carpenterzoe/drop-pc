interface ICourse {
  id: string;
  name: string; // 标题
  desc?: string;
  group?: string; // 适龄人群
  baseAbility?: string;
  limitNumber: number; // 限制人数
  duration: number; // 持续时长
  reserveInfo?: string;
  refundInfo?: string;
  otherInfo?: string;
  // reducibleTime: IWeekCourse[];
}

// data: ICourse[] 是数组，跟 COLUMNS 配置的数据类型要对应上
type TCourseQuery = { [key: string]: { __typename?: 'Query', data: ICourse[], page: IPage } };

type TBaseCourse = Partial<ICourse>;
