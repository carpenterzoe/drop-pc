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
import { useUserContext } from '@/hooks/userHooks';

import styles from './index.module.less';

interface IValue {
  tel: string;
  code: string;
  rememberLogin: boolean;
}

const Login = () => {
  const [sendCaptcha] = useMutation(SEND_CODE_MSG);
  const [login] = useMutation(LOGIN);
  useTitle('login');
  const [urlParams] = useSearchParams();
  const nav = useNavigate();
  const { store } = useUserContext();

  const loginHandler = async (values: IValue) => {
    const res = await login({
      variables: {
        code: values.code,
        tel: values.tel,
      },
    });
    const { code, data, message: msg } = res.data.login;
    if (code === 200) {
      console.log('store: ', store);
      store.refetchHandler();
      /**
       * 这里需要明确真实用户的常见使用场景：
       * 1. 在当前窗口刷新，正常情况不应该重新登录；也就是 sessionStorage
       * 2. 如果用户勾选记住登录状态，说明用户希望较长时间内都不要重新登录，也就是重开页签重开浏览器都不再登录，即 localStorage
       *
       * 记住登录状态，是一直记住，包括 a. 打开新页签，b. 下次打开浏览器；
       * 不记住的话，不切换页签，当前窗口刷新也应该保留
       */
      if (values.rememberLogin) {
        sessionStorage.setItem(AUTH_TOKEN, ''); // 这里清空的操作，确保 storage 只存有一份最新的 token，存哪个 就把另一个清空。
        localStorage.setItem(AUTH_TOKEN, data);
      } else {
        sessionStorage.setItem(AUTH_TOKEN, data);
        localStorage.setItem(AUTH_TOKEN, '');
      }
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
          <ProFormCheckbox noStyle name="rememberLogin">
            记住登录状态
          </ProFormCheckbox>
        </div>
      </LoginFormPage>
    </div>
  );
};

export default Login;
