import React from 'react';
import Table, { ColumnProps } from 'antd/lib/table';
import Input from 'antd/lib/input';
import { Link } from '@reach/router';

import { Region } from 'api/types';

type Props = {
  regions: Region[];
};

const columns: ColumnProps<Region>[] = [
  {
    title: 'Region',
    dataIndex: 'territory',
    render: (text, record) => <Link to={`region/${record.order}`}>{text}</Link>,
  },
  {
    title: 'Libraries count',
    dataIndex: 'libraries',
    sorter: (a, b) => a.libraries - b.libraries,
  },
];

export function RegionsTable({ regions }: Props) {
  const [searchValue, setSearchValue] = React.useState('');

  const regionsBySearchValue = React.useMemo(
    () =>
      searchValue
        ? regions.filter(r => r.fullname.toLowerCase().includes(searchValue.trim().toLowerCase()))
        : regions,
    [regions, searchValue],
  );

  return (
    <>
      <Input.Search placeholder="Search by region" onSearch={setSearchValue} />
      <Table pagination={false} columns={columns} dataSource={regionsBySearchValue} />
    </>
  );
}
