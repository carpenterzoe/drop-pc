import { ActionType, PageContainer, ProTable } from '@ant-design/pro-components';
import { useCourses } from '@/services/course';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useRef, useState } from 'react';
import { getColumns } from './constants';
import EditCourse from './components/EditCourse';

// import OrderTime from './components/OrderTime';

/**
* 当前门店下开设的课程
*/
const Course = () => {
  const actionRef = useRef<ActionType>();
  const [curId, setCurId] = useState('');

  // 这里 useCourses 拿到的数据，是怎么到当前组件里来 并且render的？
  const { refetch, data } = useCourses();

  const [showInfo, setShowInfo] = useState(false);
  // const [showOrderTime, setShowOrderTime] = useState(false);

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

  // const onOrderTimeHandler = (id: string) => {
  //   setCurId(id);
  //   setShowOrderTime(true);
  // };
  return (
    <PageContainer header={{ title: '当前门店下开设的课程' }}>
      <ProTable
        rowKey="id"
        actionRef={actionRef}
        // COLUMNS 配置指定了类型是数组，所以  request={refetch} 返回的类型 也是数组。否则编译报错。
        columns={getColumns({
          onEditHandler: onClickAddHandler,
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
      {showInfo && <EditCourse open={showInfo} id={curId} onClose={closeAndRefetchHandler} />}
      {/* {showOrderTime && <OrderTime id={curId} onClose={() => setShowOrderTime(false)} />} */}
    </PageContainer>
  );
};

export default Course;
