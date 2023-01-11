import { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { httpClient } from '../../common/httpClient';
import { Button, Form, notification, Space } from 'antd';
import { withPadding } from '../../common/hocs';
import { SightingForm } from '../components/SightingForm';

export function SightingPage() {
  const { reportNumber } = useParams();
  const [api, notificationContext] = notification.useNotification();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [isInvalidSighting, setIsInvalidSighting] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    httpClient
      .get(`/sightings/${reportNumber}`)
      .then(({ data }) => form.setFieldsValue(data))
      .catch((err) => {
        setIsInvalidSighting(true);
        api.error({
          message: err?.response?.data?.error || err?.message,
          placement: 'top',
          duration: 2
        });
      })
      .finally(() => setIsLoading(false));
  }, [reportNumber]);

  const updateSighting = useCallback((reportNumber, payload) => {
    httpClient
      .patch(`/sightings/${reportNumber}`, payload)
      .then(({ data }) => {
        form.setFieldsValue(data);
        api.success({
          message: 'Successfully updated sighting',
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
      });
  }, []);

  return withPadding(
    <>
      {notificationContext}
      <SightingForm isLoading={isLoading} form={form} disabled={isInvalidSighting}>
        <Space>
          <Button
            type="primary"
            onClick={() => {
              const { report_number: reportNumber, ...payload } = form.getFieldValue();
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
