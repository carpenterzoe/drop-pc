import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { ROUTE_COMPONENT } from '@/routes/component';
import { routes } from '@/routes/menus';
import { client } from './utils/apollo';
import './index.css';
import UserInfoProvider from './components/UserInfoProvider';
import Layout from './components/Layout';
import Login from './containers/Login';

createRoot(document.getElementById('root')!).render(
  <ApolloProvider client={client}>
    <BrowserRouter>

      {/* 1. 这是一个包含有用户信息的provider. 包裹的内层组件都能拿到用户信息.
          2. 这里没有传 value={value}，因为store的传值在factory中统一封装了。
          3. 要包裹到 BrowserRouter 之内，否则无法使用react router相关方法。  */}
      <UserInfoProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Layout />}>
            {/* 这里面的内容可以用 useOutlet 拿到 */}
            {
              routes.map((item) => {
                const Component = ROUTE_COMPONENT[item.key];
                return <Route path={item.path} element={<Component />} key={item.key} />;
              })
            }
          </Route>
        </Routes>
      </UserInfoProvider>
    </BrowserRouter>
  </ApolloProvider>,
);
