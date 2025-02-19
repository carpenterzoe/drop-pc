import {
  Button,
  Col,
  Divider,
  Drawer, Form, Input, InputNumber, Row, Space, Spin,
} from 'antd';
// import UploadImage from '@/components/OSSImageUpload';
import { useEditProductInfo, useProductInfo } from '@/services/product';
import { useEffect, useState } from 'react';
import TypeSelect from '@/components/TypeSelect';

const { TextArea } = Input;

/**
* 创建/编辑商品
*/
const EditProduct = ({
  onClose,
  id,
}: IProps) => {
  const [form] = Form.useForm();
  const [edit, editLoading] = useEditProductInfo();
  const { loading, refetch } = useProductInfo(id || '');
  const [open, setOpen] = useState(true);

  useEffect(() => {
    const init = async () => {
      if (id) {
        const res = await refetch();
        form.setFieldsValue(res);
      } else {
        form.resetFields();
      }
    };
    init();
  }, [id]);

  const onSubmitHandler = async () => {
    const values = await form.validateFields(); // Form表单绑定的值都在values，不需要额外再传值或者更新操作
    if (values) {
      const newValues = {
        ...values,
        // coverUrl: values.coverUrl[0].url,
        // bannerUrl: values.bannerUrl[0].url,
        coverUrl: 'http://drop-assets-zoe.oss-cn-shenzhen.aliyuncs.com/images/rc-upload-1739773562061-9.jpg',
        bannerUrl: 'http://drop-assets-zoe.oss-cn-shenzhen.aliyuncs.com/images/rc-upload-1739773562061-9.jpg',
      };
      edit(id, newValues, () => onClose(true));
    }
  };

  /**
   * onClose 是父组件传入的。
   * const closeAndRefetchHandler = (isReload?: boolean) => {
   *   setShowInfo(false)
   * }
   * setShowInfo 销毁了当前弹窗，所以直接执行的话，视觉上会呈现出组件忽然不见了，没有动画效果。

    * 改为切换open属性控制弹窗显示隐藏，再 调afterOpenChange 去执行 父组件传入的 onCose
    * 这样即可在组件的淡出动画执行完毕后再执行上层传入的销毁、刷新等动作。
   */

  return (
    <Drawer
      title={id ? '编辑商品' : '新建商品'}
      width={900}
      open={open}
      onClose={() => setOpen(false)}
      // 右侧隐藏动画之后，再 onClose 销毁当前组件
      afterOpenChange={(isOpen) => !isOpen && onClose()}
      extra={(
        <Space>
          <Button onClick={() => setOpen(false)}>取消</Button>
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
          <Row gutter={20}>
            <Col span={18}>
              <Form.Item
                label="名称"
                name="name"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="商品分类"
                name="type"
                rules={[{ required: true }]}
              >
                {/* value, onChange 是Form.Item 透传的，所以这里不需要自己额外传 */}
                <TypeSelect />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col span={6}>
              <Form.Item
                label="库存总额"
                name="stock"
                rules={[{ required: true }]}
              >
                <InputNumber />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="原价"
                name="originalPrice"
                rules={[{ required: true }]}
              >
                <InputNumber />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="优惠价"
                name="preferentialPrice"
                rules={[{ required: true }]}
              >
                <InputNumber />
              </Form.Item>
            </Col>
            <Col span={6}>
              <Form.Item
                label="每人限购数量"
                name="limitBuyNumber"
                rules={[{ required: true }]}
              >
                <InputNumber />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item
            label="商品简介"
            name="desc"
            rules={[{ required: true }]}
          >
            <TextArea
              maxLength={200}
              rows={5}
              allowClear
              showCount
            />
          </Form.Item>
          <Divider>图片设置</Divider>
          {/* <Row gutter={20}>
            <Col span={12}>
              <Form.Item
                name="coverUrl"
                label="商品封面图：图片长宽要求比例为 16:9 "
                rules={[{ required: true }]}
                labelCol={{
                  span: 24,
                }}
              >
                <UploadImage
                  maxCount={1}
                  imgCropAspect={16 / 9}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="bannerUrl"
                label="商品 Banner 横图：图片长宽要求比例为 16:9 "
                rules={[{ required: true }]}
                labelCol={{
                  span: 24,
                }}
              >
                <UploadImage
                  maxCount={1}
                  imgCropAspect={16 / 9}
                />
              </Form.Item>
            </Col>
          </Row> */}
        </Form>
      </Spin>
    </Drawer>
  );
};

// 可选属性，必须指定默认值
EditProduct.defaultProps = {
  id: '',
};

export default EditProduct;
