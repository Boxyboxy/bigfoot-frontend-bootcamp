import { Button, Form, notification, Space } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { withPadding } from '../../common/hocs';
import { httpClient } from '../../common/httpClient';
import { SightingForm } from '../components';

export function NewSightingPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [api, notificationContext] = notification.useNotification();
  const [isFormDisabled, setIsFormDisabled] = useState(false);

  return withPadding(
    <>
      {notificationContext}
      <SightingForm form={form} disabled={isFormDisabled}>
        <Space>
          <Button
            type="primary"
            onClick={() => {
              const payload = form.getFieldsValue();
              httpClient
                .post(`/sightings/${payload.report_number}`, payload)
                .then(() => {
                  setIsFormDisabled(true);
                  api.success({
                    message: `Successfully created sighting with report number ${payload.report_number}`,
                    placement: 'top',
                    duration: 2
                  });
                  setTimeout(() => {
                    navigate('/sightings');
                  }, 2000);
                })
                .catch((err) => {
                  api.error({
                    message: err?.response?.data?.error || err?.message,
                    placement: 'top',
                    duration: 2
                  });
                });
            }}>
            Save
          </Button>
          <Button onClick={() => navigate(-1)}>Back</Button>
        </Space>
      </SightingForm>
    </>
  );
}
