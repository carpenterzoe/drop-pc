import { useSchedules } from '@/services/dashboard';
import {
  Result, Spin, Steps,
} from 'antd';
// import { SCHEDULE_STATUS } from '@/utils/constants';

interface IProps {
  day: string;
}

/**
* 某一天的课程表
*/
const Schedule = ({
  day,
}: IProps) => {
  const { data, loading } = useSchedules(day);
  if (data?.length === 0) {
    return (
      <Result
        status="warning"
        title="当前没有排课，快去排课吧"
      />
    );
  }
  return (
    <Spin spinning={loading}>
      <Steps
        direction="vertical"
        items={
          data?.map((item) => ({
            title: `${item.startTime}-${item.endTime} ${item.course.name}`,
          }))
        }
      />
    </Spin>
  );
};

export default Schedule;
