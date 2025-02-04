import {
  LockOutlined,
  MobileOutlined,
} from '@ant-design/icons';
import {
  LoginFormPage,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { message } from 'antd';
import { useMutation } from '@apollo/client';
import { LOGIN, SEND_CODE_MSG } from '@/graphql/auth';
import { AUTH_TOKEN } from '@/utils/constants';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTitle } from '@/hooks';

import styles from './index.module.less';

interface IValue {
  tel: string;
  code: string;
}

const Login = () => {
  const [sendCaptcha] = useMutation(SEND_CODE_MSG);
  const [login] = useMutation(LOGIN);
  const nav = useNavigate();
  useTitle('login');
  const [urlParams] = useSearchParams();

  const loginHandler = async (values: IValue) => {
    const res = await login({
      variables: values,
    });
    const { code, data, message: msg } = res.data.login;
    if (code === 200) {
      localStorage.setItem(AUTH_TOKEN, data);
      const redirectPath = urlParams.get('from') || '/';
      nav(redirectPath);
      message.success(msg);
      return;
    }
    message.error(msg);
  };

  return (
    <div
      style={{
        backgroundColor: 'white',
        height: '100vh',
      }}
      className={styles.container}
    >
      <LoginFormPage
        initialValues={{ tel: '19357227510' }}
        onFinish={loginHandler}
        backgroundImageUrl="https://gw.alipayobjects.com/zos/rmsportal/FfdJeJRQWjEeGTpqgBKj.png"
        logo="http://water-drop-assets.oss-cn-hangzhou.aliyuncs.com/images/henglogo.png"
      >
        <ProFormText
          fieldProps={{
            size: 'large',
            prefix: <MobileOutlined className="prefixIcon" />,
          }}
          name="tel"
          placeholder="手机号"
          rules={[
            {
              required: true,
              message: '请输入手机号！',
            },
            {
              pattern: /^1\d{10}$/,
              message: '手机号格式错误！',
            },
          ]}
        />
        <ProFormCaptcha
          fieldProps={{
            size: 'large',
            prefix: <LockOutlined className="prefixIcon" />,
          }}
          captchaProps={{
            size: 'large',
          }}
          placeholder="请输入验证码"
          captchaTextRender={(timing, count) => {
            if (timing) {
              return `${count} ${'获取验证码'}`;
            }
            return '获取验证码';
          }}
          phoneName="tel"
          name="code"
          rules={[
            {
              required: true,
              message: '请输入验证码！',
            },
          ]}
          onGetCaptcha={async (tel: string) => {
            const res = await sendCaptcha({
              variables: {
                tel,
              },
            });
            const { code, message: msg } = res.data.sendCodeMsg;
            if (code === 200) {
              message.success(msg);
            } else {
              message.error(msg);
            }
          }}
        />

        <div
          style={{
            marginBlockEnd: 24,
          }}
        >
          {/*
            如果记住登录，不管从哪个页签，都自动登录
            如果不记住，那只有当前页签会留存登录状态，
            重新打开，又要登录
          */}
          <ProFormCheckbox noStyle name="autoLogin">
            记住登录状态
          </ProFormCheckbox>
        </div>

      </LoginFormPage>
    </div>
  );
};

export default Login;
