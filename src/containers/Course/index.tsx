// import { ICourse } from '@/utils/types';
import { ActionType, PageContainer, ProTable } from '@ant-design/pro-components';
// import { useCourses } from '@/services/course';
import { DEFAULT_PAGE_SIZE } from '@/utils/constants';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useRef } from 'react';
// import { getColumns } from './constants';
// import EditCourse from './components/EditCourse';
// import OrderTime from './components/OrderTime';

/**
* 当前门店下开设的课程
*/
const Course = () => {
  const actionRef = useRef<ActionType>();
  // const [curId, setCurId] = useState('');
  // const { refetch } = useCourses();
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
        columns={[{
          title: '课程标题',
          dataIndex: 'name',
          ellipsis: true,
        },
        {
          title: '限制人数',
          dataIndex: 'limitNumber',
          width: 75,
          search: false,
        }]}
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
        // request={refetch}
      />
      {/* {showInfo && <EditCourse id={curId} onClose={closeAndRefetchHandler} />} */}
      {/* {showOrderTime && <OrderTime id={curId} onClose={() => setShowOrderTime(false)} />} */}
    </PageContainer>
  );
};

export default Course;
