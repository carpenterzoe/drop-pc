import { useMemo } from 'react';
import {
  useCourseInfo,
  useEditCourseInfo,
} from '@/services/course';
import { message } from 'antd';
import { DAYS, isWorkDay, workDays } from './constants';

export const useOrderTime = (id: string, currentDayKey: TWeek) => {
  // 初始化数据重新放回useQuery处理，因为useLazyQuery在无法重新手动触发请求
  const { data, refetch, loading } = useCourseInfo(id);
  const [edit, editLoading] = useEditCourseInfo();

  /**
     * 这里的逻辑其实是比较清晰的。预约时间的计算时机：
     * 1. 数据初始化时 2. 切换tab时
     * 也就是 useMemo 的2个dependencies
     */

  // useMemo返回的值也是响应式的
  // ? 为什么这里用useMemo，如果不用这个，还有什么可以实现
  const orderTime = useMemo(
    // as IOrderTime[] 显式指定这里肯定有值，否则后面数组操作的时候类型提示可能是undefined，无法数组展开
    () => (data?.reducibleTime || []).find((item) => item.week
    === currentDayKey)?.orderTime as IOrderTime[] || [],
    [data, currentDayKey],
  );

  const onSaveHandler = (ot: IOrderTime[]) => {
    const rt = [...(data?.reducibleTime || [])];

    // orderTime 这里拿到的是一周当中某一天的数据
    const index = rt.findIndex((item) => item.week === currentDayKey);

    const todayOrderTime = {
      week: currentDayKey,
      orderTime: ot,
    };
    if (index > -1) {
      rt[index] = todayOrderTime;
    } else {
      rt.push(todayOrderTime);
    }

    // 编辑成功，传一个回调 数据刷新
    edit(id, {
      reducibleTime: rt,
    }, () => refetch());
  };

  const onDeleteHandler = (key: number) => {
    const newOt = orderTime.filter((item) => item.key !== key);
    onSaveHandler(newOt);
  };

  const allWorkDaySyncHandler = () => {
    if (!isWorkDay(currentDayKey)) {
      message.error('当前非工作日');
      return;
    }
    // 工作日 统一生成
    const workDayRt: IWeekCourse[] = workDays.map((week) => ({
      week,
      orderTime: [...orderTime],
    }));
    // 周末 保留原来的
    const weekendRt = (data?.reducibleTime || []).filter((item) => !isWorkDay(item.week));
    const rt: IWeekCourse[] = [...workDayRt, ...weekendRt];
    edit(id, {
      reducibleTime: rt,
    }, () => refetch());
  };

  const allWeekSyncHandler = () => {
    const rt: IWeekCourse[] = DAYS.map((item) => ({
      week: item.key,
      orderTime,
    }));
    edit(id, {
      reducibleTime: rt,
    }, () => refetch());
  };

  return {
    loading: loading || editLoading,
    orderTime,
    onSaveHandler,
    onDeleteHandler,
    allWorkDaySyncHandler,
    allWeekSyncHandler,
  };
};
