import { Button, Form, Space } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { withPadding } from '../../common/hocs';
import { useNotification } from '../../common/hooks/useNotification';
import { httpClient } from '../../common/httpClient';
import { SightingForm } from '../components';

export function NewSightingPage() {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [isFormDisabled, setIsFormDisabled] = useState(false);
  const { notify, notifyContext } = useNotification();

  return withPadding(
    <>
      {notifyContext}
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
                  notify(
                    'success',
                    `Successfully created sighting with report number ${payload.report_number}`
                  );
                  setTimeout(() => {
                    navigate('/sightings');
                  }, 2000);
                })
                .catch((err) => notify('error', err?.response?.data?.error || err?.message));
            }}>
            Save
          </Button>
          <Button onClick={() => navigate(-1)}>Back</Button>
        </Space>
      </SightingForm>
    </>
  );
}
