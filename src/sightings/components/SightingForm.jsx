import { Form, Skeleton, Input, Select } from 'antd';
import { useMemo } from 'react';

export function SightingForm({
  form,
  isLoading,
  disabled,
  isEditing,
  children,
  categories,
  ...props
}) {
  console.log(categories);
  const sightingFormFields = useMemo(
    () => [
      {
        name: 'reportNumber',
        label: 'Report Number',
        generateEditDisplay: () => (
          <Input disabled={disabled || form.getFieldValue('reportNumber')} />
        ),
        generateDisplay: () => form.getFieldValue('reportNumber')
      },
      {
        name: 'categories',
        label: 'Categories',
        generateEditDisplay: () => (
          <Select
            mode="multiple"
            allowClear
            placeholder="Select your categories"
            options={categories}></Select>
        ),
        generateDisplay: () => {
          const categories = form.getFieldValue('categories');
          if (!categories) return '-';
          return categories.map(({ label }) => label).join(', ');
        }
      },
      {
        name: 'year',
        label: 'Year',
        generateEditDisplay: () => <Input disabled={disabled} />,
        generateDisplay: () => form.getFieldValue('year')
      },
      {
        name: 'month',
        label: 'Month',
        generateEditDisplay: () => <Input disabled={disabled} />,
        generateDisplay: () => form.getFieldValue('month')
      },
      {
        name: 'date',
        label: 'Date',
        generateEditDisplay: () => <Input disabled={disabled} />,
        generateDisplay: () => form.getFieldValue('date')
      },
      {
        name: 'location',
        label: 'Location',
        generateEditDisplay: () => <Input disabled={disabled} />,
        generateDisplay: () => form.getFieldValue('location')
      },
      {
        name: 'observed',
        label: 'Observed',
        generateEditDisplay: () => <Input.TextArea disabled={disabled} rows={8} />,
        generateDisplay: () => form.getFieldValue('observed')
      }
    ],
    [form, disabled, categories]
  );

  return (
    <>
      <Form layout="horizontal" form={form} {...props}>
        {sightingFormFields.map(({ label, name, generateEditDisplay, generateDisplay }) => {
          if (isLoading)
            return (
              <Form.Item label={label} key={name}>
                <Skeleton.Input block active key={name} />
              </Form.Item>
            );

          if (isEditing)
            return (
              <Form.Item key={name} name={name} label={label}>
                {generateEditDisplay()}
              </Form.Item>
            );

          return (
            <Form.Item key={name} label={label}>
              {generateDisplay() || '-'}
            </Form.Item>
          );
        })}
        {children}
      </Form>
    </>
  );
}
