import { useState } from "react";
import { Row, Col, Tabs } from "antd";
import Images from "../../assets/images";
import "./login.scss";
import LoginForm from "./loginForm";
import SignUpForm from "./signUpForm";
import OtpForm from "./otpForm";
const Login = () => {
  const { LoginIllustration, krediqLogo } = Images;
  const [enableLoginOtp, setEnableLoginOtp] = useState(false);
  const [enableSignUpOtp, setEnableSignUpOtp] = useState(false);
  const [loginDetails, setLoginDetails] = useState({});
  const enableOtpField = () => {
    setEnableLoginOtp(true);
  };
  const enableSignUpOtpField = () => {
    setEnableSignUpOtp(true);
  };
  const fieldValue = (data: any) => {
    setLoginDetails(data);
  };
  const items = [
    {
      label:"Login",
      key:"1",
      children:enableLoginOtp === false ? (
        <LoginForm
          enableOtp={enableOtpField}
          fieldValue={fieldValue}
        />
      ) : (
        <OtpForm
          enableOtp={enableOtpField}
          loginDetails={loginDetails}
        />
      )
    },
    {
      label:"Sign Up",
      key:"2",
      children:enableSignUpOtp === false ? (
        <SignUpForm enableOtp={enableSignUpOtpField} />
      ) : (
        <OtpForm
          enableOtp={enableSignUpOtpField}
          loginDetails={loginDetails}
        />
      )
    }
    
  ]
  return (
    <div className="loginContainer">
      <Row gutter={24} style={{ width: "100%", margin: "0" }}>
        <Col span={12} className="loginImageContainer">
          <img src={LoginIllustration} alt="illustation" />
        </Col>
        <Col span={12} className="loginFormContainer">
          <div>
            <div>
              <img src={krediqLogo} alt="finfloLogo" className="finfloLogo" />
            </div>
            <Tabs defaultActiveKey="1" type="card" items={items} />
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default Login;
