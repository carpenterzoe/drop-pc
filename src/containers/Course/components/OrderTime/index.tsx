import {
  Drawer, Space, Button, Tabs,
  Col,
  Row,
} from 'antd';
import { useState } from 'react';
import { EditableProTable } from '@ant-design/pro-components';
import { RedoOutlined, ChromeOutlined } from '@ant-design/icons';
import { DAYS, getColumns, IDay } from './constants';

import style from './index.module.less';

interface IProps {
  id?: string;
  onClose: (isReload?: boolean) => void;
  open: boolean;
}

const OrderTime = ({
  open,
  onClose,
  id,
}: IProps) => {
  const [currentDay, setCurrentDay] = useState<IDay>(DAYS[0]);
  console.log(id, currentDay);

  const onTabChangeHandler = (key: string) => {
    const current = DAYS.find((item) => item.key === key) as IDay; // as IDay，因为这里肯定有值
    setCurrentDay(current);
  };
  const onDeleteHandler = () => {};
  const allWorkDaySyncHandler = () => {};
  const allWeekSyncHandler = () => {};

  return (
    <Drawer
      title="编辑预约时间"
      width={720}
      open={open}
      forceRender
      onClose={() => onClose()}
      extra={(
        <Space>
          <Button onClick={() => onClose()}>取消</Button>
          {/* <Button loading={editLoading} onClick={onSubmitHandler} type="primary">
            提交
          </Button> */}
        </Space>
    )}
    >
      <Tabs type="card" items={DAYS} onChange={onTabChangeHandler} />
      <EditableProTable
        columns={getColumns(onDeleteHandler)}
        rowKey="key"
        recordCreatorProps={{
          record: (index) => ({
            key: index + 1,
            startTime: '12:00:00',
            endTime: '12:30:00',
          }),
        }}
      />

      <Row gutter={20} className={style.buttons}>
        <Col span={12}>
          <Button
            icon={<RedoOutlined />}
            style={{ width: '100%' }}
            type="primary"
            // disabled={!isWorkDay(currentDay.key)}
            onClick={allWorkDaySyncHandler}
          >
            全工作日同步
          </Button>
        </Col>
        <Col span={12}>
          <Button
            icon={<ChromeOutlined />}
            style={{ width: '100%' }}
            type="primary"
            danger
            onClick={allWeekSyncHandler}
          >
            全周同步
          </Button>
        </Col>
      </Row>
    </Drawer>
  );
};

// 可选属性，必须指定默认值
OrderTime.defaultProps = {
  id: '',
};

export default OrderTime;
