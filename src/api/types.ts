export type ServerRegion = {
  order: number;
  fullname: string;
  kopuk: string;
  territory: string;
  address: string;
  libraries: number;
  site: number;
  users: number;
  visits: string;
};

export type Region = {
  key: string | number;
  fullName: string;
} & ServerRegion &
  Omit<ServerRegion, 'fullname'>;
