import ButtonContainer from "../detail/program/buttonContainer";
import InvoiceButtonContainer from "../detail/invoice/buttonContainer";
import images from "../../../assets/images";
import { Action, InterimState, OnboardingStatus, Status } from "../../../utils/enum/choices";
import { Button } from "antd";

interface Iprops {
  // flag:string,
  // text:any,
  // subText:any,
  Data: any,
  onClickExit: any,
  commentsValue: any
  flag: any
  onClickAction: any
}
const Breadcrumbs = ({ Data, onClickExit, commentsValue, flag, onClickAction }: Iprops) => {
  const { BreadcrumbArrow, LeftArrow } = images;
  const loginData = localStorage.getItem("login_detail") as any;

  return (
    <div className="breadcrumbMainContainer">
      {console.log("text", Data)}
      {flag === "cponboarding" ?
        <>
          <div className="BreadcrumbHeadingTxt">
            {Data}
            {/* {subText ? <span> {subText}</span>:null} */}

          </div>

          {/* <div
      //  className="ProgramDetailContainer"
      >
        <div
          className="breadcrumbContainer"
        >
        
                          <Button
                            onClick={onClickAction}
                            className="SaveButtonContainer"
                            disabled={JSON.parse(loginData).onboarding_status === OnboardingStatus.STB && JSON.parse(loginData).status === Status.IN_PROGRESS ? true : false}
                          >Submit</Button>



        </div>
      </div> */}
        </>
        :
        <>
          <div className="BreadcrumbHeadingTxt">
            <span><img src={LeftArrow} alt="LeftArrow" onClick={onClickExit} className="breadcrumbBackArrow" /></span>
            {Data?.fromMenu}
            {/* {subText ? <span> {subText}</span>:null} */}

          </div>

          <div
          //  className="ProgramDetailContainer"
          >
            <div
              className="breadcrumbContainer"
            >
              {console.log("data", Data)}
              <span onClick={onClickExit}>{Data?.fromMenu}</span>
              <img src={BreadcrumbArrow} alt="BreadcrumbArrow" />
              {Data?.recordType !== "" ?
                <>
                  <span onClick={onClickExit}>{Data?.recordType}</span>
                  <img src={BreadcrumbArrow} alt="BreadcrumbArrow" />
                </> : ""}
              <span>{flag === "manual" || flag === "BulkUpload" || flag === "bulk upload" ? Data?.data?.type : Data?.data?.type + " detail"}</span>
              {flag === "program" ?
                <ButtonContainer Data={Data} commentsValue={commentsValue} />
                : flag === "financeRequest" ?
                  <div className="Button_Container">

                    {console.log("Data", Data)}
                    {
                      Data.fromMenu === "sent" || Data.fromMenu === "sent_awap" ? "" :
                        Data.fromMenu === "draft" ?
                          <Button className="SaveButtonContainer" onClick={() => onClickAction(Data.data.action)} id={"financeRequest_release"}>
                            {console.log("enetered 3")}
                            Release  </Button>
                          :
                          Data.data.next_available_transitions && Data.data.next_available_transitions.values.length > 0 ?
                            <>
                              {console.log("enetered 2")}
                              <Button className="SaveButtonContainer" onClick={() => onClickAction(Action.RETURN)} id={"financeRequest_return"}> Return </Button>
                              <Button className="SaveButtonContainer" onClick={() => onClickAction(Data.data.action)} id={"financeRequest_release"}> Release  </Button>

                            </>
                            :
                            Data.data.interim_state === InterimState.REJECTEDBYB || Data.data.interim_state === InterimState.SETTLED || Data.data.interim_state === InterimState.FINANCED ? "" :
                              <>
                                {console.log("enetered 3")}

                                <Button className="ExitButtonContainer" onClick={() => onClickAction(Action.REJECT)} id={"financeRequest_reject"}> Reject </Button>

                                <Button className="ExitButtonContainer" onClick={() => onClickAction(Action.RECHECK)} id={"financeRequest_recheck"}> Recheck </Button>
                                <Button className="SaveButtonContainer" style={{ width: "145px" }} onClick={() => onClickAction(Action.APPROVE)} id={"financeRequest_approve"}>Approve </Button>

                              </>
                    }
                  </div>
                  : flag === "onboarding" ?
                    <div className="Button_Container">
                      {/* {Data.fromMenu === "sent" || Data.data.interim_state === InterimState.COMPLETED || Data.data.interim_state === InterimState.REJECTED ? "" :

           <Button
               className="ExitButtonContainer"
               onClick={() => onClickAction(Action.REJECT)}
           >
               Reject
           </Button>
       } */}
                      {Data.fromMenu === "sent" || Data.fromMenu === "sent_awap" || Data.data.interim_state === InterimState.COMPLETED || Data.data.interim_state === InterimState.REJECTED ? "" : Data.fromMenu === "inbox" && Data.data.interim_state === InterimState.RETURNED
                        || (Data?.data && Data?.data?.next_available_transitions && Data?.data?.next_available_transitions?.values?.length > 0)

                        ?
                        <>
                          <Button className="ExitButtonContainer" onClick={onClickExit} id="onboarding_return">
                            Return
                          </Button>
                          <Button className="SaveButtonContainer" onClick={() => onClickAction(Data.data.action)} id="onboarding_release">
                            Release
                          </Button>

                        </> :
                        Data.fromMenu === "sent" || Data.fromMenu === "sent_awap" || Data.data.interim_state === InterimState.COMPLETED || Data.data.interim_state === InterimState.REJECTED || Data.data.interim_state === InterimState.APPROVED ? "" :
                          <>
                            <Button
                              className="ExitButtonContainer"
                              onClick={() => onClickAction(Action.REJECT)} id="onboarding_reject"
                            >
                              Reject
                            </Button>
                            <Button
                              className="SaveButtonContainer"
                              htmlType="submit"
                              onClick={() => onClickAction(Action.APPROVE)} id="onboarding_approve"
                            >
                              Approve
                            </Button>
                          </>


                      }



                    </div>
                    : flag === "invoice" ?
                      <InvoiceButtonContainer Data={Data} commentsValue={commentsValue} />

                      : flag === "repayment" ?
                        <div className="Button_Container">
                          {/* <Button className="ExitButtonContainer" onClick={onClickExit} id={"repayment_exit"}> Exit </Button> */}
                          {Data.data.next_available_transitions && Data.data.next_available_transitions.values.length > 0 ?
                            <>
                              <Button className="SaveButtonContainer" onClick={() => onClickAction(Action.RETURN)} id={"repayment_return"}> Return </Button>
                              <Button className="SaveButtonContainer" onClick={() => onClickAction(Data.data.action)} id={"repayment_release"}> Release </Button>
                            </>
                            : ""
                          }
                        </div>
                        : flag === "pendingInvoice" ?
                          <div className="Button_Container">

                            {/* <Button className="ExitButtonContainer" onClick={onClickExit} id={"pendingInvoice_exit"}>
                              Exit
                            </Button> */}
                            <Button
                              className="SaveButtonContainer"
                              onClick={onClickAction} id={"pendingInvoice_submit"}
                            >
                              Submit
                            </Button>
                          </div>
                          : flag === "manual" ?
                            <div className="Button_Container">
                              {/* <Button className="ExitButtonContainer" onClick={onClickExit} id="invManual_exitBtn"> Exit </Button> */}
                              <Button className="ExitButtonContainer" onClick={() => onClickAction("save")} id="invManual_saveBtn"> Save </Button>
                              <Button className="SaveButtonContainer" onClick={() => onClickAction("SUBMIT")} id="invManual_submitBtn"> Submit </Button>
                            </div>
                            : flag === "cponboarding" ?
                              <Button
                                onClick={onClickAction}
                                className="onboardingSubmit"
                                disabled={JSON.parse(loginData).onboarding_status === OnboardingStatus.STB && JSON.parse(loginData).status === Status.IN_PROGRESS ? true : false}
                                id="onboarding_submit"
                              >Submit</Button>
                              : flag === "BulkUpload" ?
                                <div className="Button_Container">
                                  {/* <Button className="ExitButtonContainer" onClick={() => Navigator("/New")} >
    Exit
</Button> */}
                                  <Button className="SaveButtonContainer" onClick={onClickAction}
                                  // loading={uploadBtnLoader}
                                  >
                                    Upload
                                  </Button>

                                </div>
                                : flag === "bulk upload" ?
                                  <div className="Button_Container">

                                    {commentsValue === true ?
                                      <Button className="SaveButtonContainer" onClick={onClickAction}>Create Invoice</Button>
                                      :
                                      <Button className="SaveButtonContainer" onClick={onClickAction}>Upload</Button>
                                    }
                                  </div>
                                  : ""}

            </div>
          </div>
        </>}
    </div>
  )
}
export default Breadcrumbs