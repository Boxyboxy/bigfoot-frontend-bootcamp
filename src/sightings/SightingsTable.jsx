import { Table } from 'antd';
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { httpClient } from '../common/httpClient';
import { SightingsFilter } from './SightingsFilter';

export function SightingsTable() {
  const [sightings, setSightings] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const SIGHTINGS_COLUMNS = useMemo(
    () => [
      {
        title: 'Year',
        dataIndex: 'YEAR',
        key: 'YEAR',
        width: 100
      },
      {
        title: 'Month',
        dataIndex: 'MONTH',
        key: 'MONTH',
        width: 120
      },
      {
        title: 'Date',
        dataIndex: 'DATE',
        key: 'DATE',
        width: 180
      },
      {
        title: 'Report Number',
        dataIndex: 'REPORT_NUMBER',
        key: 'REPORT_NUMBER',
        width: 100,
        sortDirections: ['ascend', 'descend'],
        sorter: () => null
      },
      {
        title: 'Observation',
        dataIndex: 'OBSERVED',
        key: 'OBSERVED',
        ellipsis: true
      },
      {
        title: 'Action',
        key: 'ACTION',
        render: (_, record) => <Link to={`/sightings/${record.REPORT_NUMBER}`}>View</Link>,
        width: 100
      }
    ],
    []
  );

  useEffect(() => {
    httpClient
      .get('/sightings', {
        params: searchParams
      })
      .then(({ data }) => setSightings(data));
  }, [searchParams]);

  return (
    <>
      <SightingsFilter />

      <Table
        dataSource={sightings}
        columns={SIGHTINGS_COLUMNS}
        rowKey={(record) => record.REPORT_NUMBER}
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
