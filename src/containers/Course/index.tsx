import { ActionType, PageContainer, ProTable } from '@ant-design/pro-components';
import { useCourses } from '@/services/course';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useRef, useState } from 'react';
import { getColumns } from './constants';
import EditCourse from './components/EditCourse';
import OrderTime from './components/OrderTime';
import ConsumeCard from './components/ConsumeCard';

/**
* 当前门店下开设的课程
*/
const Course = () => {
  const actionRef = useRef<ActionType>();
  const [curId, setCurId] = useState('');
  const [showCard, setShowCard] = useState(false);

  // 这里 useCourses 拿到的数据，是怎么到当前组件里来 并且render的？
  const { refetch, data } = useCourses();

  const [showInfo, setShowInfo] = useState(false);
  const [showOrderTime, setShowOrderTime] = useState(false);

  const onClickAddHandler = (id?: string) => {
    if (id) {
      setCurId(id);
    } else {
      setCurId('');
    }
    setShowInfo(true);
  };

  const closeAndRefetchHandler = (isReload?: boolean) => {
    setShowInfo(false);
    if (isReload) {
      // antd pro 组件的，手动触发刷新方法
      actionRef.current?.reload();
    }
  };

  const onOrderTimeHandler = (id: string) => {
    setCurId(id);
    setShowOrderTime(true);
  };

  const onCardHandler = (id: string) => {
    setCurId(id);
    setShowCard(true);
  };
  return (
    <PageContainer header={{ title: '当前门店下开设的课程' }}>
      <ProTable
        rowKey="id"
        actionRef={actionRef}
        // COLUMNS 配置指定了类型是数组，所以  request={refetch} 返回的类型 也是数组。否则编译报错。
        columns={getColumns({
          onEditHandler: onClickAddHandler,
          onOrderTimeHandler,
          onCardHandler,
        })}
        pagination={{
          pageSize: DEFAULT_PAGE_SIZE,
        }}
        toolBarRender={() => [
          <Button
            key="add"
            onClick={() => onClickAddHandler()}
            type="primary"
            icon={<PlusOutlined />}
          >
            新建
          </Button>,
        ]}
        request={refetch}
        dataSource={data}
      />
      {/*
        onClose={closeAndRefetchHandler} 要透传，而不是 () => closeAndRefetchHandler()，
        否则拿不到内部调这个func传过来的值
      */}
      {showInfo && <EditCourse id={curId} onClose={closeAndRefetchHandler} />}
      {showOrderTime && <OrderTime id={curId} onClose={() => setShowOrderTime(false)} />}
      {showCard && <ConsumeCard id={curId} onClose={() => setShowCard(false)} />}
    </PageContainer>
  );
};

export default Course;
