import { ProColumns } from '@ant-design/pro-components';
import {
  Button, Space, Image, Popconfirm,
} from 'antd';

interface IProps {
  onEditHandler: (id: string) => void,
  onCardHandler: (id: string) => void,
  onDeleteHandler: (id: string) => void,
  onStatusChangeHandler: (id: string, status: string) => void
}

const PRODUCT_STATUS = {
  LIST: 'LIST',
  UN_LIST: 'UN_LIST',
};

export const getColumns: ({
  onEditHandler,
  onCardHandler,
  onDeleteHandler,
  onStatusChangeHandler,
}: IProps) => ProColumns<IProduct, 'text'>[] = ({
  onEditHandler,
  onCardHandler,
  onDeleteHandler,
  onStatusChangeHandler,
}) => [
  {
    dataIndex: 'id',
    title: '#',
    valueType: 'indexBorder',
    search: false,
    align: 'center',
    width: 50,
  },
  {
    title: '封面',
    dataIndex: 'coverUrl',
    search: false,
    align: 'center',
    width: 100,
    render: (_, record: IProduct) => <Image src={record.coverUrl} />,
  },
  {
    title: '商品名',
    dataIndex: 'name',
    copyable: true,
    ellipsis: true,
    formItemProps: {
      rules: [
        {
          required: true,
          message: '此项必填',
        },
      ],
    },
  },
  {
    title: '原价',
    search: false,
    dataIndex: 'originalPrice',
    width: 50,
  },
  {
    title: '优惠价',
    search: false,
    dataIndex: 'preferentialPrice',
    width: 80,
  },
  {
    title: '库存总额',
    search: false,
    width: 80,
    align: 'center',
    dataIndex: 'stock',
  },
  {
    title: '当前库存',
    search: false,
    width: 80,
    align: 'center',
    dataIndex: 'curStock',
  },
  {
    title: '每人限购',
    search: false,
    width: 80,
    align: 'center',
    dataIndex: 'limitBuyNumber',
  },
  {
    title: '销量',
    search: false,
    width: 50,
    align: 'center',
    dataIndex: 'buyNumber',
  },
  {
    title: '操作',
    valueType: 'option',
    dataIndex: 'id',
    width: 250,
    align: 'center',
    render: (_text, entity) => [
      <Space key="space" size="small">
        {entity.status === PRODUCT_STATUS.UN_LIST
          ? (
            <Button
              key="list"
              type="link"
              style={{
                color: 'green',
              }}
              onClick={() => onStatusChangeHandler(entity.id, PRODUCT_STATUS.LIST)}
            >
              上架
            </Button>
          )
          : (
            <Button
              key="unList"
              type="link"
              style={{
                color: 'red',
              }}
              onClick={() => onStatusChangeHandler(entity.id, PRODUCT_STATUS.UN_LIST)}
            >
              下架
            </Button>
          )}
        <Button
          key="edit"
          type="link"
          size="small"
          onClick={() => onEditHandler(entity.id)}
        >
          编辑
        </Button>
        <Button
          key="card"
          type="link"
          size="small"
          onClick={() => onCardHandler(entity.id)}
        >
          绑定消费卡
        </Button>
        <Popconfirm
          key="popconfirm"
          title="提醒"
          description="确认要删除吗"
          onConfirm={() => onDeleteHandler(entity.id)}
        >
          <Button
            danger
            key="del"
            type="link"
            size="small"
          >
            删除
          </Button>
        </Popconfirm>
      </Space>,
    ],
  },
];
