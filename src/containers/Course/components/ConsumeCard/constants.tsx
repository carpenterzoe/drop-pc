import { CARD_TYPE } from '@/utils/constants';
import { ProColumns } from '@ant-design/pro-components';
import { Button, Popconfirm, Space } from 'antd';

export const getColumns = (onDeleteHandler: (id: string) => void): ProColumns[] => [
  {
    title: '序号',
    dataIndex: 'key',
    width: 50,
    editable: false,
    align: 'center',
    // 渲染样式
    render: (_text, _record, index) => index + 1,
  },
  {
    title: '名称',
    dataIndex: 'name',
    align: 'center',
  },
  {
    title: '有效期（天）',
    dataIndex: 'validityDay',
    valueType: 'digit',
    align: 'center',
  },
  {
    title: '类型',
    dataIndex: 'type',
    valueType: 'select',
    align: 'center',
    // 注意这种下拉枚举配置的方式，固定数据却配到request字段，有点子奇怪的
    request: async () => [
      {
        value: CARD_TYPE.TIME,
        label: '次卡',
      },
      {
        value: CARD_TYPE.DURATION,
        label: '时长卡',
      },
    ],
  },
  {
    title: '次数',
    dataIndex: 'time',
    valueType: 'digit',
    width: 100,
    align: 'center',
  },
  {
    title: '操作',
    valueType: 'option',
    dataIndex: 'id',
    width: 150,
    align: 'center',
    render: (_text, record, _, action) => [
      <Space key="space">
        <Button
          key="edit"
          type="link"
          onClick={() => {
            action?.startEditable?.(record.id || '');
          }}
        >
          编辑
        </Button>
        <Popconfirm
          key="popconfirm"
          title="提醒"
          description="确认要删除吗"
          onConfirm={() => onDeleteHandler(record.id)}
        >
          <Button
            key="delete"
            type="link"
          >
            删除
          </Button>
        </Popconfirm>
      </Space>,
    ],
  },
];
