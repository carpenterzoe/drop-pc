import { Drawer } from 'antd';
import { EditableProTable } from '@ant-design/pro-components';
import { getColumns } from './constants';

interface IProps {
  id: string;
  onClose: (isReload?: boolean) => void;
}

const OrderTime = ({
  onClose,
  id,
}: IProps) => {
  const onDeleteHandler = (rowId: string) => {
    console.log('这个id是组件行内抛出来的 rowId', rowId);
  };
  console.log('id', id);

  const onSaveHandler = (rowData: any) => {
    console.log('rowData: ', rowData);
  };

  return (
    <Drawer
      title="编辑消费卡"
      width="70vw"
      open
      onClose={() => onClose()}
    >
      <EditableProTable<ICard>
        headerTitle="请管理该课程的消费卡"
        rowKey="id"
        columns={getColumns(onDeleteHandler)}
        recordCreatorProps={{
          record: () => ({
            id: 'new', // ? 每次都是 new 不重复吗
            name: '',
            type: 'time',
            time: 0,
            validityDay: 0,
          }
          ),
        }}
        editable={{
          onSave: async (rowKey, rowData) => {
            console.log('rowKey: ', rowKey);
            onSaveHandler(rowData);
          },
          onDelete: async (rowKey) => {
            onDeleteHandler(rowKey as string);
          },
        }}
      />

    </Drawer>
  );
};

export default OrderTime;
