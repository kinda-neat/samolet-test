import * as React from 'react';
import Spin from 'antd/lib/spin';
import Empty from 'antd/lib/empty';
import { RouteComponentProps } from '@reach/router';

import { RegionsTable } from 'features/regions';
import { handleRemoteData, loading, success, failure, RemoteData } from 'utils';
import { Region } from 'api/types';

type Props = {
  regions: RemoteData<Region[]>;
} & RouteComponentProps;

export function PageX({ regions }: Props) {

  return handleRemoteData(
    regions,
    () => <div>Initializing...</div>,
    () => <Spin />,
    () => <Empty description="Failed to load data about regions" />,
    x => <RegionsTable regions={x} />,
  );
}
