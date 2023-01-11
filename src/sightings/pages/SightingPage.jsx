import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { httpClient } from '../../common/httpClient';
import { Button, Form, Space } from 'antd';
import { withPadding } from '../../common/hocs';
import { SightingForm } from '../components/SightingForm';
import { useNotification } from '../../common/hooks/useNotification';

export function SightingPage() {
  const { reportNumber } = useParams();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isInvalidSighting, setIsInvalidSighting] = useState(false);
  const { notify, notifyContext } = useNotification();

  useEffect(() => {
    setIsLoading(true);
    httpClient
      .get(`/sightings/${reportNumber}`)
      .then(({ data }) => form.setFieldsValue(data))
      .catch((err) => {
        setIsInvalidSighting(true);
        notify('error', err?.response?.data?.error || err?.message);
      })
      .finally(() => setIsLoading(false));
  }, [reportNumber]);

  const updateSighting = useCallback((reportNumber, payload) => {
    httpClient
      .patch(`/sightings/${reportNumber}`, payload)
      .then(({ data }) => {
        form.setFieldsValue(data);
        notify('success', 'Successfully updated sighting');
      })
      .catch((err) => notify('error', err?.response?.data?.error || err?.message));
  }, []);

  return withPadding(
    <>
      {notifyContext}
      <SightingForm isLoading={isLoading} form={form} disabled={isInvalidSighting}>
        <Space>
          <Button
            type="primary"
            onClick={() => {
              const { reportNumber: reportNumber, ...payload } = form.getFieldValue();
              updateSighting(reportNumber, payload);
            }}>
            Edit
          </Button>
          <Button onClick={() => navigate(-1)} disabled={false}>
            Back
          </Button>
        </Space>
      </SightingForm>
    </>
  );
}
