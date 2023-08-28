import { Form, Input, Button, Select, DatePicker } from 'antd';

const { Option } = Select;

const MyForm = ({ formFields }:any) => {
  const onFinish = (values:any) => {
  };

  const renderField = (field:any) => {
    switch (field.type) {
      case 'input':
        return <Input />;
      case 'select':
        return (
          <Select>
            {field.options.map((option:any) => (
              <Option key={option.value} value={option.value}>
                {option.label}
              </Option>
            ))}
          </Select>
        );
      case 'datePicker':
        return <DatePicker />;
      // Add more cases for other field types as needed
      default:
        return null;
    }
  };

  return (
    <Form layout="vertical" onFinish={onFinish}>
      {formFields.map((field:any) => (
        <Form.Item
          key={field.name}
          label={field.label}
          name={field.name}
          rules={[
            { required: true, message: `${field.label} is required` },
          ]}
        >
          {renderField(field)}
        </Form.Item>
      ))}

      <Form.Item>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
};

export default MyForm;
