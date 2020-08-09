import * as React from 'react';
import Spin from 'antd/lib/spin';
import Empty from 'antd/lib/empty';
import { RouteComponentProps } from '@reach/router';

import { loadRegions } from 'api/requests';
import { RegionsTable } from 'features/regions';
import { useApi } from 'utils';

type Props = RouteComponentProps;

export function Regions(_: Props) {
  const [areRegionsLoading, regions, error] = useApi(() => loadRegions(), [], []);

  if (error !== null) {
    return <Empty description="Failed to load data about regions" />
  }

  return areRegionsLoading ? <Spin /> : <RegionsTable regions={regions} />;
}
