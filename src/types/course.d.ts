/**
 * 课程基本信息相关
 */
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
  reducibleTime: IWeekCourse[];
}

type TCourseQuery = { [key: string]: { __typename?: 'Query', data: ICourse } };

// data: ICourse[] 是数组，跟 COLUMNS 配置的数据类型要对应上
type TCoursesQuery = { [key: string]: { __typename?: 'Query', data: ICourse[], page: IPage } };

type TBaseCourse = Partial<ICourse>;

/**
 * 预约时间相关
 */
interface IOrderTime {
  startTime: string;
  endTime: string;
  key: number;
}

type TWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

// EditableProTable 每周几配置的可选时间
interface IWeekCourse {
  week: TWeek;
  orderTime: IOrderTime[];
}

/**
 * 消费卡相关
 */
interface ICard {
  id: string;
  name: string;
  type: string;
  time: number;
  validityDay: number;
  course?: ICourse;
}

type TBaseCard = Partial<ICard>;

type TCardsQuery = { [key: string]: { __typename?: 'Query', data: ICard[], page: IPage } };

type TCardQuery = { [key: string]: { __typename?: 'Query', data: ICard } };
