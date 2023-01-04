import { Form, Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { httpClient } from '../common/httpClient';

export function SightingPage() {
  const [sighting, setSighting] = useState({});
  const { reportNumber } = useParams();

  useEffect(() => {
    httpClient.get(`/sightings/${reportNumber}`).then(({ data }) => setSighting(data));
  }, [reportNumber]);

  return (
    <Form layout="horizontal">
      <Form.Item label="Year">
        <Input value={sighting.YEAR} />
      </Form.Item>

      <Form.Item label="Month">
        <Input value={sighting.MONTH} />
      </Form.Item>

      <Form.Item label="Date">
        <Input value={sighting.DATE} />
      </Form.Item>

      <Form.Item label="Description">
        <TextArea value={sighting.OBSERVED} rows={8} />
      </Form.Item>
    </Form>
  );
}
