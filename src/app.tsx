import React from 'react';
import Layout from 'antd/lib/layout';
import { Router, Redirect } from '@reach/router';

import { RegionDetails, Regions } from 'pages';

import './app.css';

export default function App() {
  return (
    <Layout style={{ height: '100%' }}>
      <Router>
        <Regions default path="/" />
        <RegionDetails path="region/:regionID" />
      </Router>
    </Layout>
  );
}
