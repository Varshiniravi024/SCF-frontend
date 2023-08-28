import { useState } from "react";
import Form from '../common/form';
import baseurl from "../../utils/config/url/base";
import httpClient from "../../utils/config/core/httpClient";
import { message } from "antd";
import { FieldErrorMessages } from "../../utils/enum/messageChoices";
import { ResponseStatus } from "../../utils/enum/choices";
interface IProps {
  enableOtp: any
}
const SignUpForm = (props: React.PropsWithChildren<IProps>) => {
  const [disableButton, setDisableButton] = useState(false)
  const onFinish = (values: any) => {
    setDisableButton(true)
    httpClient
      .getInstance()
      .post(`${baseurl}api-auth/party-check/`, values)
      .then((resp: any) => {
        if (resp.data.status === ResponseStatus.SUCCESS) {
          message.success(resp.data.detail, 3)

        } else {
          message.error(resp.data.data, 3)
        }
      });
    setDisableButton(false)
  };
  const inputValues = [
    {
      inputLabel: 'Account Number',
      keyword: "account_number",
      placeholder: 'Enter your account number',
      errorMessage: FieldErrorMessages.ACCNO,
      required: false,
      id: "signupAccountNo"
    },
    {
      inputLabel: 'Customer ID',
      keyword: "customer_id",
      placeholder: 'Enter your customerId',
      errorMessage: FieldErrorMessages.CUSID,
      required: false,
      id: "signupCustomerId"
    }
  ]
  return (
    <div>
      <Form inputValues={inputValues} buttonValue="Submit" onFinish={onFinish} flag="SignUp" disableButton={disableButton} />
    </div>
  )
}
export default SignUpForm