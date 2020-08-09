import React from 'react';
import Button from 'antd/lib/button';
import { RouteComponentProps, Link, navigate } from '@reach/router';
import { Spin, Empty } from 'antd';

import { RegionDetails as RegionDetailsComponent } from 'features/regions';
import { loadRegions } from 'api/requests';
import { useApi } from 'utils';

type RouterProps = {
  regionID?: string;
} & RouteComponentProps;

type Props = RouterProps;

export function RegionDetails({ regionID }: Props) {
  const [areRegionsLoading, regions, error] = useApi(() => loadRegions(), []);
  const region = React.useMemo(() => regions?.find(r => r.order === Number(regionID)), [regions]);

  React.useEffect(() => {
    const regionIDInvalid = isNaN(Number(regionID));
    if (regionIDInvalid) navigate('/', { replace: true });
  }, []);

  React.useEffect(() => {
    const loadingFinished = typeof regions !== 'undefined' && !areRegionsLoading;
    const notFound = loadingFinished && typeof region === 'undefined';
    if (notFound) {
      navigate('/', { replace: true });
    }
  }, [areRegionsLoading, regions, region]);

  if (error !== null) {
    return <Empty description="Failed to load data about region" />;
  }

  if (areRegionsLoading) return <Spin />;

  return region ? (
    <>
      <Link to="/">
        <Button>Back</Button>
      </Link>
      <RegionDetailsComponent region={region} />
    </>
  ) : null;
}
