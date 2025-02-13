import {
  useCourse,
  useEditCourseInfo,
} from '@/services/course';
import {
  Button, Col, Drawer, Form, Input, InputNumber, Row, Space, Spin,
} from 'antd';
import { useEffect } from 'react';

const { TextArea } = Input;

interface IProps {
  id?: string;
  onClose: (isReload?: boolean) => void;
}

/**
 * ! 1. EditCourse useEffect 的优化，把数据处理都包在service中，让组件的逻辑保持简单
 * 2. useEffect 第一个参数，不能直接包async，会报错
 */
const EditCourse = ({
  onClose,
  id,
}: IProps) => {
  // 类似于ref, 获取表单实例
  const [form] = Form.useForm();
  const [edit, editLoading] = useEditCourseInfo();
  const { getCourse, loading } = useCourse();

  const onSubmitHandler = async () => {
    const values = await form.validateFields();
    if (values) {
      // 这里传入的 onClose，在提交成功的调用逻辑中 callback(true)，所以刷新了。
      edit(id, values, onClose);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (id) {
        const data = await getCourse(id);
        form.setFieldsValue(data);
      } else {
        form.resetFields();
      }
    };
    init();
  }, [id]);

  return (
    <Drawer
      title={id ? '编辑课程' : '新建课程'}
      width={720}
      open
      onClose={() => onClose()}
      extra={(
        <Space>
          <Button onClick={() => onClose()}>取消</Button>
          <Button loading={editLoading} onClick={onSubmitHandler} type="primary">
            提交
          </Button>
        </Space>
      )}
    >
      <Spin spinning={loading}>
        <Form
          form={form}
        >
          <Form.Item
            label="课程名称"
            name="name"
            rules={[{
              required: true,
            }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="课程描述"
            name="desc"
            rules={[{
              required: true,
            }]}
          >
            <TextArea rows={5} showCount maxLength={200} />
          </Form.Item>
          <Row gutter={20}>
            <Col>
              <Form.Item
                label="限制人数"
                name="limitNumber"
                rules={[{
                  required: true,
                }]}
              >
                <InputNumber min={0} addonAfter="人" />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                label="持续时长"
                name="duration"
                rules={[{
                  required: true,
                }]}
              >
                <InputNumber min={0} addonAfter="分钟" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="适龄人群"
            name="group"
            rules={[{
              required: true,
            }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="基础能力"
            name="baseAbility"
            rules={[{
              required: true,
            }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="预约信息"
            name="reserveInfo"
            rules={[{
              required: true,
            }]}
          >
            <TextArea rows={5} showCount maxLength={200} />
          </Form.Item>
          <Form.Item
            label="退款信息"
            name="refundInfo"
            rules={[{
              required: true,
            }]}
          >
            <TextArea rows={5} showCount maxLength={200} />
          </Form.Item>
          <Form.Item label="其他信息" name="otherInfo">
            <TextArea rows={5} showCount maxLength={200} />
          </Form.Item>
        </Form>
      </Spin>
    </Drawer>
  );
};

// 可选属性，必须指定默认值
EditCourse.defaultProps = {
  id: '',
};

export default EditCourse;
