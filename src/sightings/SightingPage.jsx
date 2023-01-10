import { Button, Form, Input, Skeleton, Space } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { httpClient } from '../common/httpClient';
import { notification } from 'antd';
import { withPadding } from '../common/hocs';

export function SightingPage() {
  const [sighting, setSighting] = useState({});
  const { reportNumber } = useParams();
  const [api, notificationContext] = notification.useNotification();
  const [isInvalidSighting, setInvalidSighting] = useState(false);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const labelMapping = useMemo(
    () => ({
      Year: 'YEAR',
      Month: 'MONTH',
      Date: 'DATE'
    }),
    []
  );

  useEffect(() => {
    setIsLoading(true);
    httpClient
      .get(`/sightings/${reportNumber}`)
      .then(({ data }) => setSighting(data))
      .catch((err) => {
        setInvalidSighting(true);
        api.error({
          message: err?.response?.data?.error || err?.message,
          placement: 'top',
          duration: 2
        });
      })
      .finally(() => setIsLoading(false));
    console.log(isLoading);
  }, [reportNumber]);

  return withPadding(
    <Form layout="horizontal">
      {notificationContext}
      {['Year', 'Month', 'Date'].map((label) => (
        <Form.Item label={label} key={label}>
          {isLoading ? (
            <Skeleton.Input key={label} block active />
          ) : (
            <Input value={sighting[labelMapping[label]]} disabled={isInvalidSighting} />
          )}
        </Form.Item>
      ))}

      <Form.Item label="Description">
        {isLoading ? (
          <Skeleton.Input block active style={{ height: '186px' }} />
        ) : (
          <TextArea value={sighting.OBSERVED} rows={8} disabled={isInvalidSighting} />
        )}
      </Form.Item>

      <Space>
        <Button type="primary" disabled>
          Edit
        </Button>
        <Button onClick={() => navigate(-1)}>Back</Button>
      </Space>
    </Form>
  );
}
