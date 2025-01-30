import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { client } from './utils/apollo';
import { ROUTE_CONFIG } from './routes';
import Page404 from './containers/404';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <ApolloProvider client={client}>
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
  </ApolloProvider>,
);
