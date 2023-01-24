import { Button, Form, Space } from 'antd';
import { useCallback, useState } from 'react';
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

  const createSighting = useCallback(() => {
    const payload = form.getFieldsValue();
    httpClient
      .post(`/sightings/${payload.reportNumber}`, payload)
      .then(() => {
        setIsFormDisabled(true);
        notify(
          'success',
          `Successfully created sighting with report number ${payload.reportNumber}`
        );
        setTimeout(() => {
          navigate('/sightings');
        }, 2000);
      })
      .catch((err) => notify('error', err?.response?.data?.error || err?.message));
  }, []);

  return withPadding(
    <>
      {notifyContext}
      <SightingForm form={form} disabled={isFormDisabled} isEditing={true}>
        <Space>
          <Button type="primary" oonClick={createSighting} disabled={isFormDisabled}>
            Save
          </Button>
          <Button onClick={() => navigate(-1)} disabled={isFormDisabled}>
            Back
          </Button>
        </Space>
      </SightingForm>
    </>
  );
}
