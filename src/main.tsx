import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { client } from './utils/apollo';
import { ROUTE_CONFIG } from './routes';
import Page404 from './containers/404';
import './index.css';
import UserInfoProvider from './components/UserInfoProvider';

createRoot(document.getElementById('root')!).render(
  <ApolloProvider client={client}>
    {/* 这是一个包含有用户信息的provider. 包裹的内层组件都能拿到用户信息. */}
    <UserInfoProvider>
      <BrowserRouter>
        <Routes>
          {
        ROUTE_CONFIG.map((item) => (
          <Route path={item.path} element={<item.element />} key={item.key} />
        ))
      }
          <Route path="*" element={<Page404 />} />
        </Routes>
      </BrowserRouter>
    </UserInfoProvider>
  </ApolloProvider>,
);
