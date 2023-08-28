import React from "react";
import { Form, Input, Button } from "antd";
import "./common.scss";

interface IProps {
  inputValues: any;
  buttonValue: string;
  onFinish: any;
  flag: string;
  disableButton: boolean
}
const Label = (props: React.PropsWithChildren<IProps>) => {
  const onFinish = (values: any) => {
    props.onFinish(values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log(errorInfo)
  };
  return (
    <div>
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        layout="vertical"
      >
        {props.inputValues &&
          props.inputValues.map((data: any) => {
            return (
              <Form.Item
                label={data.inputLabel}
                name={data.keyword}
                className="FormContainer"
                key={data.keyword}
                rules={[
                  {
                    required: data.required,
                    pattern: data.pattern,
                    message: data.errorMessage,
                  },
                ]}
              >
                <Input placeholder={data.placeholder} id={data.id} autoFocus={data.keyword === "otp" ? true : false} />
              </Form.Item>
            );
          })}

        {props.flag === "Otp" ? (
          <div className="resendOtpContainer">Don't receive the OTP ? <span>Resend OTP</span></div>
        ) : ("")}
        {props.flag === "CreateNewAccount" ? (
          <div className="buttonGroup">
            <Form.Item>
              <Button type="default" className="ExitBtnLabel">
                Exit
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="default" htmlType="submit" className="ExitBtnLabel" >
                {props.buttonValue}
              </Button>
            </Form.Item>
          </div>
        ) : (
          <Form.Item>
            <Button type="primary" htmlType="submit" className="loginBtnLabel" disabled={props.disableButton} loading={props.disableButton}>
              {props.buttonValue}
            </Button>
          </Form.Item>
        )}
      </Form>
    </div>
  );
};
export default Label;
