import React from 'react';
import ReactDOM from 'react-dom';
import { ConfigProvider } from 'antd';
import ruRU from 'antd/lib/locale-provider/ru_RU';
import 'antd/dist/antd.css';

import App from './app';

ReactDOM.render(
  <ConfigProvider locale={ruRU}>
    <App />
  </ConfigProvider>,
  document.getElementById('root'),
);
