import { ProColumns } from '@ant-design/pro-components';
import { Button, Popconfirm } from 'antd';

export interface IDay {
  key: TWeek;
  label: string;
}

export const DAYS: IDay[] = [
  {
    key: 'monday',
    label: '周一',
  },
  {
    key: 'tuesday',
    label: '周二',
  },
  {
    label: '周三',
    key: 'wednesday',
  },
  {
    label: '周四',
    key: 'thursday',
  },
  {
    label: '周五',
    key: 'friday',
  },
  {
    label: '周六',
    key: 'saturday',
  },
  {
    label: '周日',
    key: 'sunday',
  },
];

export const getColumns = (onDeleteHandler: Function): ProColumns[] => [
  {
    title: '序号',
    dataIndex: 'key',
    width: 50,
    editable: false,
    align: 'center',
  },
  {
    title: '开始时间',
    dataIndex: 'startTime',
    valueType: 'time',
    width: 160,
    align: 'center',
  },
  {
    title: '结束时间',
    dataIndex: 'endTime',
    valueType: 'time',
    width: 160,
    align: 'center',
  },
  {
    title: '操作',
    valueType: 'option',
    width: 150,
    align: 'center',
    render: (text, record, _, action) => (
      <>
        <Button
          style={{ height: '22px' }}
          type="link"
          size="small"
          key="edit"
          onClick={() => {
            action?.startEditable(record.key || '');
          }}
        >
          编辑
        </Button>
        <Popconfirm
          title="提醒"
          description="确认要删除吗？"
          onConfirm={() => onDeleteHandler(record.key)}
        >
          <Button
            style={{ height: '22px' }}
            type="link"
            size="small"
            key="delete"
          >
            删除
          </Button>
        </Popconfirm>
      </>
    ),
  },
];

export const workDays: TWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'];
export const isWorkDay = (day: TWeek) => workDays.includes(day);
