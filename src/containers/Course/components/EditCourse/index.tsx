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
  open: boolean;
}

/**
* 创建/编辑课程
*/
const EditCourse = ({
  open,
  onClose,
  id,
}: IProps) => {
  // 类似于ref, 获取表单实例
  const [form] = Form.useForm();
  const [edit, editLoading] = useEditCourseInfo();

  const onSubmitHandler = async () => {
    const values = await form.validateFields();
    if (values) {
      // 这里传入的 onClose，在提交成功的调用逻辑中 callback(true)，所以刷新了。
      edit(id, values, onClose);
    }
  };

  return (
    <Drawer
      title={id ? '编辑课程' : '新建课程'}
      width={720}
      open={open}
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
      {/* spinning={loading} */}
      <Spin>
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
