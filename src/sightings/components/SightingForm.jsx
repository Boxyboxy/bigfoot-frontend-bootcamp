import { Form, Skeleton, Input } from 'antd';
import { cloneElement, useMemo } from 'react';

export function SightingForm({ form, isLoading, disabled, isEditing, children, ...props }) {
  const componentVariantHashmap = useMemo(
    () => ({
      textarea: <Input.TextArea rows={8} />,
      input: <Input />
    }),
    []
  );

  const sightingFormFields = useMemo(
    () => [
      {
        name: 'reportNumber',
        label: 'Report Number',
        variant: 'input',
        disabled: disabled || !!form.getFieldValue('reportNumber')
      },
      {
        name: 'year',
        label: 'Year',
        variant: 'input',
        disabled
      },
      {
        name: 'month',
        label: 'Month',
        variant: 'input',
        disabled
      },
      {
        name: 'date',
        label: 'Date',
        variant: 'input',
        disabled
      },
      {
        name: 'location',
        label: 'Location',
        variant: 'input',
        disabled
      },
      {
        name: 'observed',
        label: 'Observed',
        variant: 'textarea',
        disabled
      }
    ],
    [form, disabled]
  );

  return (
    <>
      <Form layout="horizontal" form={form} {...props}>
        {sightingFormFields.map(({ name, label, variant, disabled }) => {
          if (isLoading)
            return (
              <Form.Item label={label} key={name}>
                <Skeleton.Input block active key={name} />
              </Form.Item>
            );

          return isEditing ? (
            <Form.Item key={name} label={label} name={name}>
              {cloneElement(componentVariantHashmap[variant], { disabled })}
            </Form.Item>
          ) : (
            <Form.Item key={name} label={label}>
              {form.getFieldValue(name) || '-'}
            </Form.Item>
          );
        })}
      </Form>
      {children}
    </>
  );
}
