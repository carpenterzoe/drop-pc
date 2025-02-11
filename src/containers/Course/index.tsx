// import { ICourse } from '@/utils/types';
import { ActionType, PageContainer, ProTable } from '@ant-design/pro-components';
import { useCourses } from '@/services/course';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useRef } from 'react';
import { COLUMNS } from './constants';
// import { getColumns } from './constants';
// import EditCourse from './components/EditCourse';
// import OrderTime from './components/OrderTime';

/**
* 当前门店下开设的课程
*/
const Course = () => {
  const actionRef = useRef<ActionType>();
  // const [curId, setCurId] = useState('');

  // 这里 useCourses 拿到的数据，是怎么到当前组件里来 并且render的？
  const { refetch, data } = useCourses();

  // const [showInfo, setShowInfo] = useState(false);
  // const [showOrderTime, setShowOrderTime] = useState(false);

  // const onClickAddHandler = (id?: string) => {
  //   if (id) {
  //     setCurId(id);
  //   } else {
  //     setCurId('');
  //   }
  //   setShowInfo(true);
  // };

  // const closeAndRefetchHandler = (isReload?: boolean) => {
  //   setShowInfo(false);
  //   if (isReload) {
  //     actionRef.current?.reload();
  //   }
  // };

  // const onOrderTimeHandler = (id: string) => {
  //   setCurId(id);
  //   setShowOrderTime(true);
  // };
  return (
    <PageContainer header={{ title: '当前门店下开设的课程' }}>
      <ProTable
        rowKey="id"
        actionRef={actionRef}
        columns={COLUMNS}
        pagination={{
          pageSize: DEFAULT_PAGE_SIZE,
        }}
        toolBarRender={() => [
          <Button
            key="add"
            // onClick={() => onClickAddHandler()}
            type="primary"
            icon={<PlusOutlined />}
          >
            新建
          </Button>,
        ]}
        request={refetch}
        dataSource={data}
      />
      {/* {showInfo && <EditCourse id={curId} onClose={closeAndRefetchHandler} />} */}
      {/* {showOrderTime && <OrderTime id={curId} onClose={() => setShowOrderTime(false)} />} */}
    </PageContainer>
  );
};

export default Course;
