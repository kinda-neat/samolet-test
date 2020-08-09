import memoizee from 'memoizee';

import * as T from './types';
import * as conv from './converters';

const ACCESS_TOKEN = '';

export const loadRegions = memoizee(
  (): Promise<T.Region[]> =>
    fetch(
      `https://data.gov.ru/sites/default/files/opendata/7705851331-stat_library/data-2016-11-10T00-00-00-structure-2016-09-12T00-00-00.json?access_token=${ACCESS_TOKEN}`,
      { credentials: 'include' },
    )
      .then(x => x.json())
      .then(x => x.map(conv.convertToRegion)),
  { promise: true },
);
