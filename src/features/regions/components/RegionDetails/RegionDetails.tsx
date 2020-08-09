import * as React from 'react';
import Descriptions from 'antd/lib/descriptions';

import { Region } from 'api/types';

type Props = {
  region: Region;
};

export function RegionDetails({ region }: Props) {
  return (
    <Descriptions title="Region Info">
      <Descriptions.Item label="Name">{region.fullname}</Descriptions.Item>
      <Descriptions.Item label="Address">{region.address}</Descriptions.Item>
      <Descriptions.Item label="Users count">{region.users}</Descriptions.Item>
      <Descriptions.Item label="Total visits">{region.visits}</Descriptions.Item>
    </Descriptions>
  );
}
