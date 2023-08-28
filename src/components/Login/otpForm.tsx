import React, { useState } from "react";
import Label from "../common/form";
import { useNavigate } from "react-router-dom";
import { message } from "antd";
import axios from "axios";
import baseurl from "../../utils/config/url/base";
import { login } from "../../redux/action";
import { useDispatch } from "react-redux";
import { ErrorMessage, FieldErrorMessages } from "../../utils/enum/messageChoices";
import { OnboardingStatus, PartyType, ResponseStatus, Status } from "../../utils/enum/choices";


interface IProps {
  enableOtp: any;
  loginDetails: any;
}

const OtpForm = (props: React.PropsWithChildren<IProps>) => {
  const [disableButton, setDisableButton] = useState(false)
  const dispatch = useDispatch();

  const history = useNavigate();

  const onFinish = (values: any) => {
    const body = {
      otp: values.otp
    }

    axios
      .post(`${baseurl}api-auth/otp/verify/?data=${props.loginDetails.data}`, body)
      .then((resp: any) => {
        if (resp.data.status === ResponseStatus.FAILURE) {
          message.error(resp.data.data)
          setDisableButton(false)
        } else {
          dispatch(login(
            resp.data.data
          ))
          setDisableButton(false)


          props.enableOtp(true);
          localStorage.setItem("login_detail", JSON.stringify(resp.data.data));

          localStorage.setItem("login_email", resp.data.data.email)
          localStorage.setItem("party", resp.data.data.party)
          localStorage.setItem("party_id", resp.data.data.party_id)
          localStorage.setItem("party_name", resp.data.data.party)
          localStorage.setItem("token", resp.data.data.token)

          if (resp.data.data.party_type === PartyType.BANK) {
            localStorage.setItem("user", "Bank");
          } else if (resp.data.data.party_type === PartyType.CUSTOMER) {
            localStorage.setItem("user", "Customer");
          } else if (resp.data.data.party_type === PartyType.NON_CUSTOMER) {
            localStorage.setItem("user", "NonCustomer");
          } else if (resp.data.data.party_type === PartyType.NONE) {
            localStorage.setItem("user", "None");
          }

          setTimeout(() => {
            setDisableButton(false);
            if ((resp.data.data.party_type === PartyType.NONE && resp.data.data.status === Status.NEW && resp.data.data.onboarding_status === OnboardingStatus.DRAFT)) {
            // || 
            // (resp.data.data.party_type === PartyType.NONE && resp.data.data.status === Status.IN_PROGRESS && resp.data.data.onboarding_status === OnboardingStatus.STC)) {
              history("/CounterPartyOnboarding")
              window.location.reload();
            } else if ((resp.data.data.party_type === PartyType.NONE && resp.data.data.status === Status.IN_PROGRESS && resp.data.data.onboarding_status === OnboardingStatus.STC)) {
              // history("/CounterPartyOnboarding")
              history("/Inbox")

              window.location.reload();
            } else if ((resp.data.data.party_type === PartyType.NONE && resp.data.data.status === Status.DEACTIVATED && resp.data.data.onboarding_status === OnboardingStatus.REJECTED)) {
              history("/Inbox")
              window.location.reload();
            } else if ((resp.data.data.party_type === PartyType.NONE && resp.data.data.status === Status.IN_PROGRESS && resp.data.data.onboarding_status === OnboardingStatus.STB)) {
              message.success(ErrorMessage.OPB, 3)
              setTimeout(() => {
                history("/Sent")
                window.location.reload();
              }, 3000);
            } else {
              history("/Dashboard")
              window.location.reload();
              message.success(ErrorMessage.LIS, 5)
            }
          }, 1000);

          // setTimeout(() => {
          //   message.success("Logged in successfully",5)
          // }, 2000);
        }

      })
  };

  const inputValues = [
    {
      inputLabel: "OTP",
      keyword: "otp",
      placeholder: "Enter your OTP",
      errorMessage: FieldErrorMessages.OTP,
      id: "loginOtp",
      required: true
    },
  ];
  return (
    <div>
      <Label
        inputValues={inputValues}
        buttonValue="Submit"
        onFinish={onFinish}
        flag="Otp"
        disableButton={disableButton}
      />
    </div>
  );
};
export default OtpForm;
