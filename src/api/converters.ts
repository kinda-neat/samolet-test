import * as T from './types';

export function convertToRegion(x: T.ServerRegion): T.Region {
  return {
    ...x,
    fullName: x.fullname,
    key: x.order,
  };
}
