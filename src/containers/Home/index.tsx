import { useUserContext } from '@/hooks/userHooks';
import { PageContainer } from '@ant-design/pro-components';
import { useOrganization } from '@/services/org';
import {
  Button, Card, Col, DatePicker, Row, message,
} from 'antd';
import { useState } from 'react';
import type { Dayjs } from 'dayjs';
import { DAY_FORMAT } from '@/utils/constants';
import { useAutoCreateSchedule } from '@/services/dashboard';

const { RangePicker } = DatePicker;

/**
 * 循环依赖：Home组件引用了 routes ， routes 内部也 import 了当前组件。
 * 解决方案：把存在循环依赖的某部分单独隔离开。比如这里是 routes 中的 element，所以要想办法隔离。
 */
const Home = () => {
  const [range, setRange] = useState<[string, string]>(['', '']);
  const { store } = useUserContext();
  const { data: org } = useOrganization(store.currentOrg || '');
  const [run, loading] = useAutoCreateSchedule();
  if (!org) {
    return null;
  }

  const startScheduleHandler = () => {
    if (!range[0]) {
      message.error('请选择时间区间');
      return;
    }
    run(...range);
  };

  const onRangeChangeHandler = (days: [Dayjs | null, Dayjs | null] | null) => {
    if (!days || !days[0] || !days[1]) {
      return;
    }
    setRange([days[0].format(DAY_FORMAT), days[1].format(DAY_FORMAT)]);
  };
  return (
    <div>
      <PageContainer
        content={org.address}
        header={{
          title: org.name,
        }}
      >
        <Row gutter={20}>
          <Col flex="auto">
            <Card
              extra={
              (
                <span>
                  <RangePicker onChange={(days) => onRangeChangeHandler(days)} />
                  <Button
                    loading={loading}
                    type="link"
                    onClick={startScheduleHandler}
                  >
                    开始排课
                  </Button>
                </span>
              )
            }
            >
              {/* <Schedule day={day} /> */}
            </Card>
          </Col>
        </Row>
      </PageContainer>
    </div>
  );
};

export default Home;
