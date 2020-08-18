import React from 'react';
import Button from 'antd/lib/button';
import { RouteComponentProps, Link, navigate } from '@reach/router';
import { Spin, Empty } from 'antd';

import { RegionDetails as RegionDetailsComponent } from 'features/regions';
import { handleRemoteData, doNothing, RemoteData } from 'utils';
import { Region } from 'api/types';

type RouterProps = {
  regions: RemoteData<Region[]>;
  regionID?: string;
} & RouteComponentProps;

type Props = RouterProps;

export function RegionDetails({ regionID, regions }: Props) {

  React.useEffect(() => {
    const regionIDInvalid = isNaN(Number(regionID));
    if (regionIDInvalid) navigate('/', { replace: true });
  }, []);

  const navigateIfRegionNotFound = React.useCallback(
    (regions: Region[]) => {
      if (!regions.some(r => r.order === Number(regionID))) {
        console.log('navigating', { regionID, regions });
        navigate('/', { replace: true });
      }
    },
    [regionID],
  );

  React.useEffect(() => {
    handleRemoteData(regions, doNothing, doNothing, doNothing, navigateIfRegionNotFound);
  }, [regions]);

  return handleRemoteData(
    regions,
    () => <div>Initializing</div>,
    () => <Spin />,
    () => <Empty description="Failed to load data about region" />,
    regions => {
      const region = regions.find(r => r.order === Number(regionID));
      return region ? (
        <>
          <Link to="/">
            <Button>Back</Button>
          </Link>
          <RegionDetailsComponent region={region} />
        </>
      ) : null;
    },
  );
}
