import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { ROUTE_CONFIG } from './routes';
import './index.css';
import Page404 from './containers/404';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      {
        ROUTE_CONFIG.map((item) => (
          <Route path={item.path} element={<item.element />} key={item.key} />
        ))
      }
      <Route path="*" element={<Page404 />} />
    </Routes>
  </BrowserRouter>,
);
