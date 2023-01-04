import { Button, Form, Input } from 'antd';
import { useSearchParams } from 'react-router-dom';
import { FilterOutlined } from '@ant-design/icons';

export function SightingsFilter() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [form] = Form.useForm();

  return (
    <Form
      form={form}
      layout="inline"
      onFinish={({ year }) => {
        setSearchParams({ ...searchParams, year });
      }}
      validateTrigger="onSubmit">
      <Form.Item
        rules={[
          { required: true, message: 'Year is required' },
          {
            validator: (_, year) =>
              new Promise((resolve, reject) => {
                if (isNaN(year)) reject('Year must be a number');
                const currentYear = new Date().getFullYear();
                if (year < 0 || year > currentYear)
                  reject(`Year must be between 0 and ${currentYear}`);
                resolve();
              })
          }
        ]}
        name="year">
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
