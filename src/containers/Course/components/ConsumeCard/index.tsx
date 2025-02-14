import { Drawer } from 'antd';
import { EditableProTable } from '@ant-design/pro-components';
import { useCards, useDeleteCard, useEditCardInfo } from '@/services/card';
import { getColumns } from './constants';

interface IProps {
  id: string;
  onClose: (isReload?: boolean) => void;
}

const ConsumeCard = ({
  onClose,
  id,
}: IProps) => {
  const { data, loading, refetch } = useCards(id); // 这里传的id是 courseId
  const [edit, editLoading] = useEditCardInfo();
  const [delelete, deleteLoading] = useDeleteCard();
  const onDeleteHandler = (rowId: string) => {
    delelete(rowId, refetch);
  };

  const onSaveHandler = (rowData: ICard) => {
    const {
      name, type, time, validityDay,
    } = rowData;

    edit(
      rowData.id === 'new' ? '' : rowData.id,
      id,
      {
        name, type, time, validityDay,
      },
      refetch,
    );
  };

  return (
    <Drawer
      title="编辑消费卡"
      width="70vw"
      open
      onClose={() => onClose()}
    >
      <EditableProTable<ICard>
        value={data}
        loading={loading || editLoading || deleteLoading}
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

export default ConsumeCard;
