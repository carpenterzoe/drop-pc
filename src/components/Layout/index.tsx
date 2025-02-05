import { useUserContext } from '@/hooks/userHooks';
import { ROUTE_CONFIG } from '@/routes';
import { MenuDataItem, PageContainer, ProLayout } from '@ant-design/pro-components';
import React from 'react';
import { Link, useOutlet } from 'react-router-dom';

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
  // const nav = useNavigate();

  // const logoutHandler = () => {
  //   sessionStorage.setItem(AUTH_TOKEN, '');
  //   localStorage.setItem(AUTH_TOKEN, '');
  //   nav('/login');
  // };

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
      // links={[
      //   <Space size={20} onClick={logoutHandler}>
      //     <LogoutOutlined />
      //     退出
      //   </Space>,
      // ]}
      title={false}
      logo={<img src="https://water-drop-assets.oss-cn-hangzhou.aliyuncs.com/images/henglogo.png" alt="logo" />}
      // onMenuHeaderClick={() => nav('/')}
      route={{
        path: '/',
        routes: ROUTE_CONFIG,
      }}
      menuItemRender={menuItemRender}
      // actionsRender={() => [
      //   !isOrg && <OrgSelect />,
      //   <Tooltip title="门店管理">
      //     <ShopOutlined onClick={goToOrg} />
      //   </Tooltip>,
      // ]}
    >
      <PageContainer>
        {/* key={store.currentOrg} */}
        <div>
          {/* outlet 相当于router的插槽 */}
          {outlet}
        </div>
      </PageContainer>
    </ProLayout>
  );
};

export default Layout;
