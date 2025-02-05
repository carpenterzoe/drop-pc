// import OSSImageUpload from '@/components/OSSImageUpload';
import { useUserContext } from '@/hooks/userHooks';
import {
  PageContainer, ProForm, ProFormText, ProFormTextArea,
} from '@ant-design/pro-components';
import {
  Col, Row, Form,
} from 'antd';

/**
*
*/
const My = () => {
  const { store } = useUserContext();
  console.log('store: ', store);

  return (
    <PageContainer>
      <ProForm
        // formRef={formRef}
        layout="horizontal"
        submitter={{
          resetButtonProps: {
            style: {
              display: 'none',
            },
          },
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
              {/* <OSSImageUpload label="更改头像" /> */}
            </Form.Item>
          </Col>
        </Row>
      </ProForm>
    </PageContainer>
  );
};
export default My;
