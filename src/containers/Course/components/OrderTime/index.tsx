import {
  Drawer, Space, Button, Tabs,
  Col,
  Row,
} from 'antd';
import { useState } from 'react';
import { EditableProTable } from '@ant-design/pro-components';
import { RedoOutlined, ChromeOutlined } from '@ant-design/icons';

import { omit } from 'lodash';
import {
  DAYS, getColumns, IDay, isWorkDay,
} from './constants';

import style from './index.module.less';
import { useOrderTime } from './hooks';

interface IProps {
  id: string;
  onClose: (isReload?: boolean) => void;
  open: boolean;
}

const OrderTime = ({
  open,
  onClose,
  id,
}: IProps) => {
  const [currentDay, setCurrentDay] = useState<IDay>(DAYS[0]);

  const {
    orderTime,
    loading,
    onSaveHandler,
    onDeleteHandler,
    allWorkDaySyncHandler,
    allWeekSyncHandler,
  } = useOrderTime(id, currentDay.key);

  const onTabChangeHandler = (key: string) => {
    const current = DAYS.find((item) => item.key === key) as IDay; // as IDay，因为这里肯定有值
    setCurrentDay(current);
  };

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
      {/* <IOrderTime> 指定 value 的类型 */}
      <EditableProTable<IOrderTime>
        loading={loading}
        columns={getColumns(onDeleteHandler)}
        headerTitle={(
          <Space>
            选择
            <span className={style.name}>
              {currentDay.label}
            </span>
            的课开放预约的时间
          </Space>
        )}
        rowKey="key"
        recordCreatorProps={{
          record: (index: number) => ({
            key: index + 1,
            startTime: '12:00:00',
            endTime: '12:30:00',
          }),
        }}
        value={orderTime}
        editable={{
          onSave: async (rowKey, rowData) => {
            const newData = omit(rowData, 'index'); // 删掉对象中的指定字段

            let newOrderTime = [];
            // 在table中找到编辑的这一行
            const curIdx = orderTime?.findIndex((item) => item.key === rowKey);
            // 修改某一行
            if (curIdx > -1) {
              newOrderTime = orderTime?.map((item) => (item.key === rowKey ? newData : item));
            } else {
              // 新增行
              newOrderTime = [...orderTime, newData];
            }

            onSaveHandler(newOrderTime);
          },
        }}
      />

      <Row gutter={20} className={style.buttons}>
        <Col span={12}>
          <Button
            icon={<RedoOutlined />}
            style={{ width: '100%' }}
            type="primary"
            disabled={!isWorkDay(currentDay.key)}
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

export default OrderTime;
