import { Button, Form, Input } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { FilterOutlined } from '@ant-design/icons';
import { useEffect } from 'react';

export function SightingsFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldValue('year', searchParams.get('year'));
  }, [searchParams]);

  return (
    <Form
      form={form}
      layout="inline"
      onFinish={({ year }) => {
        setSearchParams({ ...searchParams, year });
      }}
      validateTrigger="onSubmit"
      style={{ justifyContent: 'flex-end', marginBottom: '1rem' }}>
      <Form.Item rules={[{ required: true, message: 'Year is required' }]} name="year">
        <Input placeholder="Year" />
      </Form.Item>
      <Form.Item>
        <Button icon={<FilterOutlined />} htmlType="submit" />
      </Form.Item>
      <Form.Item>
        <Button
          onClick={() => {
            form.resetFields();
            const newSearchParams = { ...searchParams };
            delete newSearchParams.year;
            setSearchParams(newSearchParams);
          }}>
          Clear
        </Button>
      </Form.Item>
    </Form>
  );
}
