import { Form, Input, Button, message } from "antd";
import "./new.scss";
import { useNavigate } from 'react-router-dom';
import httpClient from "../../utils/config/core/httpClient";
import baseurl from "../../utils/config/url/base";
import { useDispatch } from "react-redux";
import { basicDetails } from "../../redux/action";
import { FieldErrorMessages } from "../../utils/enum/messageChoices";

const CreateNewAccount = () => {
  const history = useNavigate();
  const dispatch = useDispatch();

  const onFinish = (values: any) => {
    httpClient
      .getInstance()
      .post(`${baseurl}api-auth/party-check/`, values)
      .then((resp: any) => {
        if (resp.data.Status !== "Failure") {
          localStorage.setItem("party_id", resp.data.data[0].id)
          localStorage.setItem("party_name", resp.data.data[0].name)
          dispatch(
            basicDetails({
              basicDetails: resp.data.data,
            })
          );
          history("/ManageScf");
        } else {
          message.error(resp.data.data)
        }
      });

  };

  const onFinishFailed = (errorInfo: any) => {
    console.log(errorInfo)
  };

  const inputValues = [
    {
      inputLabel: "Account Number",
      placeholder: "Enter your account number",
      errorMessage: FieldErrorMessages.ACCNO,
      keyword: "account_number",
      required: false,
      id:"accountNumber"
    },
    {
      inputLabel: "Customer ID",
      placeholder: "Enter your customerId",
      errorMessage: FieldErrorMessages.CUSID,
      keyword: "customer_id",
      required: false,
      id:"customerId"
    },
  ];
  return (
    <div>
      <div className="textHeading">Create New Account</div>
      <div className="createNewAccount loginContainer">
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          {inputValues &&
            inputValues.map((data: any) => {
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
                  <Input placeholder={data.placeholder} id={data.id} />
                </Form.Item>
              );
            })}
          <div className="buttonGroup">
            <Form.Item>
              <Button type="default" className="ExitBtnLabel"  id={`exit`}>
                Exit
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="default" htmlType="submit" className="ExitBtnLabel" id={`next`}>
                Next
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
};
export default CreateNewAccount;
