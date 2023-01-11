import { Button, notification, Popconfirm, Space, Table, Tooltip } from 'antd';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { httpClient } from '../../common/httpClient';
import { SightingsFilter } from '../components/SightingsFilter';
import { withPadding } from '../../common/hocs';
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';

export function SightingsTable() {
  const [sightings, setSightings] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [api, notificationContext] = notification.useNotification();

  const SIGHTINGS_COLUMNS = useMemo(
    () => [
      {
        title: 'Report Number',
        dataIndex: 'report_number',
        key: 'report_number',
        width: 100,
        sortDirections: ['ascend', 'descend'],
        sorter: () => null
      },
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
        width: 120
      },
      {
        title: 'Observation',
        dataIndex: 'observed',
        key: 'observed',
        ellipsis: true
      },
      {
        title: 'Location',
        dataIndex: 'location',
        key: 'location',
        width: 180
      },
      {
        title: 'Action',
        key: 'ACTION',
        render: (_, record) => (
          <Space>
            <Tooltip title="View">
              <Button
                shape="circle"
                icon={<SearchOutlined />}
                onClick={() => navigate(`/sightings/${record.report_number}`)}
              />
            </Tooltip>

            <Tooltip title="Delete">
              <Popconfirm
                placement="left"
                title={`Confirm deletion of sighting ${record.report_number}`}
                description="Are you sure you want to delete this sighting?"
                okText="Yes"
                onConfirm={async () => {
                  await deleteSighting(record.report_number);
                  await fetchSightings(searchParams);
                }}
                cancelText="No">
                <Button shape="circle" icon={<DeleteOutlined />} />
              </Popconfirm>
            </Tooltip>
          </Space>
        ),
        width: 100
      }
    ],
    [searchParams]
  );

  const fetchSightings = useCallback((params) => {
    setIsLoading(true);
    return httpClient
      .get('/sightings', {
        params
      })
      .then(({ data }) => setSightings(data))
      .finally(() => setIsLoading(false));
  }, []);

  const deleteSighting = useCallback((reportNumber) => {
    setIsLoading(true);
    return httpClient
      .delete(`/sightings/${reportNumber}`)
      .then(() => {
        api.success({
          message: `Successfully deleted sighting with report number ${reportNumber}`,
          placement: 'top',
          duration: 2
        });
      })
      .catch((err) => {
        api.error({
          message: err?.response?.data?.error || err?.message,
          placement: 'top',
          duration: 2
        });
      })
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    fetchSightings(searchParams);
  }, [searchParams]);

  return withPadding(
    <>
      {notificationContext}

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
