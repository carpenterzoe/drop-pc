// import OSSImageUpload from '@/components/OSSImageUpload';
import OSSImageUpload from '@/components/OSSImageUpload';
import { UPDATE_USER } from '@/graphql/user';
import { useUserContext } from '@/hooks/userHooks';
import {
  PageContainer, ProForm, ProFormInstance, ProFormText, ProFormTextArea,
} from '@ant-design/pro-components';
import { useMutation } from '@apollo/client';
import {
  Col, Row, Form,
  message,
} from 'antd';
import { useEffect, useRef } from 'react';

/**
 * 疑问
 * 1. useRef 是干啥的，这个react提供的方法 怎么和 ProForm UI框架关联上了
 *    Answer: useRef 传到子组件中，使父组件能够调用到子组件的方法。
 *    参考antpro 文档 https://procomponents.ant.design/components/form#proform-demo-formref-1
 *
 * 2. useRef 如果是用来响应式的，那么 和  useState 啥区别， 是否可替代使用
 *    Answer: 数据变化时，useState 触发组件重新渲染； useRef 不触发。
 */

/**
 * useRef useState 区别：
 * 1. 数据变化时，useState 触发组件重新渲染； useRef 不触发。
 *
 * 2. useRef 得到引用对象，传到子组件中，使父组件能够调用到子组件的方法。
 *    参考antpro 文档 https://procomponents.ant.design/components/form#proform-demo-formref-1
 *
 * 当前场景是作用2。
 */
const My = () => {
  const { store } = useUserContext();
  const formRef = useRef<ProFormInstance>();

  useEffect(() => {
    if (!store.tel) return;
    formRef.current?.setFieldsValue({
      tel: store.tel,
      name: store.name,
      desc: store.desc,
      avatar: {
        url: store.avatar,
      },
    });
  }, [store]);

  const [updateUserInfo] = useMutation(UPDATE_USER);

  return (
    <PageContainer>
      <ProForm
        formRef={formRef}
        layout="horizontal"
        submitter={{
          resetButtonProps: {
            style: {
              display: 'none',
            },
          },
        }}
        onFinish={async (values) => {
          const res = await updateUserInfo({
            variables: {
              id: store.id,
              params: {
                name: values.name,
                desc: values.desc,
                avatar: values.avatar?.url || '',
              },
            },
          });
          if (res.data.updateUserInfo.code === 200) {
            store.refetchHandler(); // 提交成功立刻刷新用户store，右上角内容即时更新
            message.success(res.data.updateUserInfo.message);
            return;
          }
          message.error(res.data.updateUserInfo.message);
        }}
      >
        <Row gutter={20}>
          <Col>
            <ProFormText
              name="tel"
              label="手机号"
              tooltip="不能修改"
              disabled
            />
            <ProFormText
              name="name"
              label="昵称"
              placeholder="请输入昵称"
            />
            <ProFormTextArea
              name="desc"
              label="简介"
              placeholder="请输入简介信息"
            />
          </Col>
          <Col>
            <Form.Item name="avatar">
              <OSSImageUpload label="更改头像" />
            </Form.Item>
          </Col>
        </Row>
      </ProForm>
    </PageContainer>
  );
};
export default My;
