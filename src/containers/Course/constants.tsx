import { ProColumns } from '@ant-design/pro-components';
import { Button, Space } from 'antd';

interface IProps {
  onEditHandler: (id: string) => void
  onOrderTimeHandler: (id: string) => void
  onCardHandler: (id: string) => void
}
// ! 这里改成function，是为了让组件调用的时候传入操作方法作为参数，给操作列指定function
export const getColumns = ({
  onEditHandler,
  onOrderTimeHandler,
  onCardHandler,
}: IProps): ProColumns<ICourse, 'text'>[] => [
  {
    title: '课程标题',
    dataIndex: 'name',
    ellipsis: true,
  },
  {
    title: '限制人数',
    dataIndex: 'limitNumber',
    width: 75,
    search: false,
  },
  {
    title: '持续时长',
    dataIndex: 'duration',
    width: 75,
    search: false,
  },
  {
    title: '操作',
    valueType: 'option',
    dataIndex: 'id',
    align: 'center',
    width: 240,
    render: (text, entity) => (
      <Space size="small">
        <Button
          size="small"
          key="edit"
          type="link"
        // ? 这里调的是组件中的function，怎么传进来的
          onClick={() => onEditHandler(entity.id)}
        >
          编辑
        </Button>
        <Button
          size="small"
          key="orderTime"
          type="link"
          onClick={() => onOrderTimeHandler(entity.id)}
        >
          可约时间
        </Button>
        <Button
          key="card"
          type="link"
          size="small"
          onClick={() => onCardHandler(entity.id)}
        >
          关联消费卡
        </Button>
      </Space>
    ),
  },
];
