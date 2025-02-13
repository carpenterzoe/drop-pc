import {
  Drawer, Space, Button, Tabs,
  Col,
  Row,
} from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { EditableProTable } from '@ant-design/pro-components';
import { RedoOutlined, ChromeOutlined } from '@ant-design/icons';
import {
  useCourse,
  useEditCourseInfo,
} from '@/services/course';
import { omit } from 'lodash';
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
  const [reducibleTime, setReducibleTime] = useState<IWeekCourse[]>([]);
  const { getCourse, loading } = useCourse();
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
    () => reducibleTime.find((item) => item.week === currentDay.key)?.orderTime as IOrderTime[],
    [reducibleTime, currentDay],
  );

  // 初始化 拿到一整周的可约时间
  const init = async () => {
    if (id) {
      const res = await getCourse(id);
      // ? 这个存的值到哪去了？ - useMemo监听到变化，计算得到 orderTime，渲染到列表里
      setReducibleTime(res.reducibleTime || []);
    } else {
      console.log('clear');
    }
  };

  useEffect(() => {
    init();
  }, [id]);

  const onSaveHandler = (ot: IOrderTime[]) => {
    const rt = [...reducibleTime];

    // orderTime 这里拿到的是一周当中某一天的数据
    const index = reducibleTime.findIndex((item) => item.week === currentDay.key);

    const todayOrderTime = {
      week: currentDay.key,
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
    }, () => init());
  };

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
      {/* <IOrderTime> 指定 value 的类型 */}
      <EditableProTable<IOrderTime>
        loading={loading || editLoading}
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
          record: (index) => ({
            key: index + 1,
            startTime: '12:00:00',
            endTime: '12:30:00',
          }),
        }}
        value={orderTime}
        editable={{
          onSave: async (rowKey, data) => {
            const newData = omit(data, 'index'); // 删掉对象中的指定字段

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
