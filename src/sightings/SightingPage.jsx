import { Form, Input } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BACKEND_URL } from '../configs';

export function SightingPage() {
  const [sighting, setSighting] = useState({});
  const { reportNumber } = useParams();

  useEffect(() => {
    axios.get(`${BACKEND_URL}/sightings/${reportNumber}`).then(({ data }) => setSighting(data));
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
