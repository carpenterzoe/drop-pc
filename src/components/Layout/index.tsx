import { useUserContext } from '@/hooks/userHooks';
import { routes } from '@/routes/menus';
import { AUTH_TOKEN } from '@/utils/constants';
import { LogoutOutlined } from '@ant-design/icons';
import { MenuDataItem, ProLayout } from '@ant-design/pro-components';
import { Space } from 'antd';
import React from 'react';
import { Link, useNavigate, useOutlet } from 'react-router-dom';

// 静态方法，可以放在外层
const menuItemRender = (item: MenuDataItem, dom: React.ReactNode) => {
  const path = item.path || '/';
  return <Link to={path}>{dom}</Link>;
};

const Layout = () => {
  const outlet = useOutlet();
  const { store } = useUserContext();
  // const isOrg = useIsOrgRoute();
  // const { go } = useGoTo();
  const nav = useNavigate();

  const logoutHandler = () => {
    sessionStorage.setItem(AUTH_TOKEN, '');
    localStorage.setItem(AUTH_TOKEN, '');
    nav('/login');
  };

  // const goToOrg = () => {
  //   go(ROUTE_KEY.ORG);
  // };

  return (
    <ProLayout
      layout="mix"
      siderWidth={150}
      avatarProps={{
        src: store.avatar || null,
        title: store.tel,
        size: 'small',
        // onClick: () => go(ROUTE_KEY.MY),
      }}
      links={[
        <Space size={20} onClick={logoutHandler}>
          <LogoutOutlined />
          退出
        </Space>,
      ]}
      title={false}
      logo={<img src="https://water-drop-assets.oss-cn-hangzhou.aliyuncs.com/images/henglogo.png" alt="logo" />}
      // 该点击时间对pc版本宽度才有用，移动版的点击无效
      onMenuHeaderClick={() => nav('/home')}
      route={{
        path: '/',
        routes,
      }}
      menuItemRender={menuItemRender}
    >
      {/* outlet 相当于router的插槽 */}
      {outlet}
    </ProLayout>
  );
};

export default Layout;
