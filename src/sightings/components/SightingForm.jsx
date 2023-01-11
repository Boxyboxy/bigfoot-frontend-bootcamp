import { Form, Input, Skeleton } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useMemo } from 'react';

export function SightingForm({ form, isLoading, children, ...props }) {
  const labelMapping = useMemo(
    () => ({
      Year: 'year',
      Month: 'month',
      Date: 'date'
    }),
    []
  );

  return (
    <Form layout="horizontal" form={form} {...props}>
      <Form.Item label={'Report Number'} name="report_number">
        {isLoading ? (
          <Skeleton.Input block active />
        ) : (
          <Input
            value={form.getFieldValue('report_number')}
            disabled={!!form.getFieldValue('report_number') || props.disabled}
          />
        )}
      </Form.Item>

      {['Year', 'Month', 'Date'].map((label) => (
        <Form.Item label={label} key={label} name={labelMapping[label]}>
          {isLoading ? (
            <Skeleton.Input key={label} block active />
          ) : (
            <Input value={form.getFieldValue(labelMapping[label])} />
          )}
        </Form.Item>
      ))}

      <Form.Item label="Description" name="observed">
        {isLoading ? (
          <Skeleton.Input block active style={{ height: '186px' }} />
        ) : (
          <TextArea value={form.getFieldValue('observed')} rows={8} />
        )}
      </Form.Item>

      {children}
    </Form>
  );
}
