import { Button, Input, Space, Table } from 'antd';
import axios from 'axios';
import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FilterOutlined } from '@ant-design/icons';

export function SightingsTable() {
  const [sightings, setSightings] = useState([]);
  const [yearFilter, setYearFilter] = useState('');
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
    axios
      .get('http://localhost:3000/sightings', {
        params: searchParams
      })
      .then(({ data }) => setSightings(data));
  }, [searchParams]);

  return (
    <>
      <Space>
        <Input
          placeholder="Year"
          value={yearFilter}
          onChange={({ target }) => setYearFilter(target.value)}
        />

        <Button
          icon={<FilterOutlined />}
          onClick={() => {
            setSearchParams({
              ...searchParams,
              year: yearFilter
            });
          }}
        />
      </Space>

      <Table
        dataSource={sightings}
        columns={SIGHTINGS_COLUMNS}
        rowKey={(record) => record.REPORT_NUMBER}
      />
    </>
  );
}
