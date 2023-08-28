import Form from "../common/form";
import axios from "axios";
import baseurl from "../../utils/config/url/base";
import { message } from "antd";
import { useState } from "react";
import { InputPatterns } from "../../utils/validators/inputPattern";
import { ResponseStatus } from "../../utils/enum/choices";
interface IProps {
  enableOtp: any;
  fieldValue:any
}
const LoginForm = (props: React.PropsWithChildren<IProps>) => {
  const [disableButton,setDisableButton]=useState(false)
  const onFinish = (values: any) => {
    setDisableButton(true)
    const body = {
      data:values.data.toLowerCase(),
      env:"DEV"
      // env:"TEST"
    };

    props.fieldValue(values);
    axios
    .post(`${baseurl}api-auth/otp/`, body)
    .then((resp: any) => {
      if(resp.data.status === ResponseStatus.FAILURE){
        resp.data.detail ? message.error(resp.data.detail) :message.error(resp.data.data)
        setDisableButton(false)
      }else{
        message.success(resp.data.data)
        setDisableButton(false)
        // message.success("Logged in successfully",3)

        props.enableOtp(true);
    
    }
    }).catch((err:any)=>{
      console.log(err)
    })
  };

  const inputValues = [
    {
      inputLabel: "Email/ Mobile Number",
      keyword: "data",
      placeholder: "Enter your email/ mobile number",
      // patter:/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})|(^[1-9]{1}[0-9]{9})+$/,
      pattern: InputPatterns.EMAILANDMOBILE,
      errorMessage: "Please enter valid email/ mobile number!",
      id:"loginId",
      required:true
    }
  ];
  return (
    <div>
      <Form
        inputValues={inputValues}
        buttonValue="Login"
        onFinish={onFinish}
        flag="Login"
        disableButton={disableButton}
      />
    </div>
  );
};
export default LoginForm;
