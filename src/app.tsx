import React from 'react';
import Layout from 'antd/lib/layout';
import { Router } from '@reach/router';

import { loadRegions } from 'api/requests';
import { loading, success, failure, RemoteData } from 'utils';
import { RegionDetails, PageX } from 'pages';
import { Region } from 'api/types';

import './app.css';

export default function App() {
  const [regionsData, setRegionsData] = React.useState<RemoteData<Region[]>>(loading);

  const requestRegions = React.useCallback(async () => {
    try {
      const regions = await loadRegions();
      setRegionsData(success(regions));
    } catch (e) {
      setRegionsData(failure(e));
    }
  }, []);

  React.useEffect(() => {
    requestRegions();
  }, []);

  return (
    <Layout style={{ height: '100%' }}>
      <Router>
        <PageX default path="/" regions={regionsData} />
        <RegionDetails path="region/:regionID" regions={regionsData} />
      </Router>
    </Layout>
  );
}
