import { Table } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { httpClient } from '../common/httpClient';
import { SightingsFilter } from './SightingsFilter';
import { withPadding } from '../common/hocs';

export function SightingsTable() {
  const [sightings, setSightings] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);

  const SIGHTINGS_COLUMNS = useMemo(
    () => [
      {
        title: 'Year',
        dataIndex: 'year',
        key: 'year',
        width: 100
      },
      {
        title: 'Month',
        dataIndex: 'month',
        key: 'month',
        width: 120
      },
      {
        title: 'Date',
        dataIndex: 'date',
        key: 'date',
        width: 180
      },
      {
        title: 'Report Number',
        dataIndex: 'report_number',
        key: 'report_number',
        width: 100,
        sortDirections: ['ascend', 'descend'],
        sorter: () => null
      },
      {
        title: 'Observation',
        dataIndex: 'observed',
        key: 'observed',
        ellipsis: true
      },
      {
        title: 'Action',
        key: 'ACTION',
        render: (_, record) => <Link to={`/sightings/${record.report_number}`}>View</Link>,
        width: 100
      }
    ],
    []
  );

  useEffect(() => {
    setIsLoading(true);
    httpClient
      .get('/sightings', {
        params: searchParams
      })
      .then(({ data }) => setSightings(data))
      .finally(() => setIsLoading(false));
  }, [searchParams]);

  return withPadding(
    <>
      <SightingsFilter />

      <Table
        dataSource={sightings}
        columns={SIGHTINGS_COLUMNS}
        rowKey={(record) => record.report_number}
        loading={isLoading}
        onChange={(pagination, filters, { order, field }) => {
          const newParams = {};
          for (const [key, value] of searchParams) {
            newParams[key] = value;
          }
          if (!order) delete newParams.sort;
          else newParams.sort = [`${field.toLowerCase()}:${order}`];
          setSearchParams(newParams);
        }}
      />
    </>
  );
}
