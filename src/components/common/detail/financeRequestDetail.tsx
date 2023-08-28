import React, { useState, useEffect } from "react";
import { Row, Col, Card, Input } from "antd";
import { useNavigate, useLocation } from "react-router-dom"; 
import { actionStatus } from "../../api/actionStatus";
import httpClient from "../../../utils/config/core/httpClient";
import baseurl from "../../../utils/config/url/base";
import CurrencyField from "../function/currency";
import Breadcrumbs from "../heading/breadcrumb";
const FinanceRequestDetail = () => {
  const { state } = useLocation();
  const Navigator = useNavigate();
  const [invoice_detail] = useState(state as any); 
  const [errorsvalue, setErrorsValue] = useState([] as any)
  const { TextArea } = Input;
  const [commentsValue, setCommentsvalue] = useState(null as any);

  const onClickExit = () => {
    Navigator(`/${invoice_detail.fromMenu}`)
  };

  const onClickAction = (buttonKey: any) => {
    const commentsBody = {
      t_id: invoice_detail.data.work_model.t_id,
      type: invoice_detail.data.model_type,
      comments: commentsValue
    }
    httpClient
      .getInstance()
      .post(`${baseurl}api/message/comments/`, commentsBody)
      .then((resp: any) => {
        actionStatus(invoice_detail, buttonKey, returnRoute)
      })
  };
  const returnRoute = (data: any) => {
    if (data === true) {
      Navigator(`/${invoice_detail.fromMenu}`)
    }
  }
  useEffect(() => {
    setErrorsValue(invoice_detail?.data?.record_datas?.values?.[0]?.fields?.errors)
  }, []);

  return (
    <React.Fragment>
      <div className="fixedContainer">
      <Breadcrumbs 
        // flag={programData?.fromMenu} 
        // text={programData?.fromMenu} 
        // subText="" 
        Data={invoice_detail}
        onClickExit={onClickExit}
        commentsValue={commentsValue}
        flag="financeRequest"
        onClickAction={onClickAction}
        />
        {/* <div className="ProgramDetailContainer">
          <div className="breadcrumbContainer">
            <span onClick={onClickExit}>{invoice_detail.fromMenu}</span>
            <img src={BreadcrumbArrow} alt="BreadcrumbArrow" />
            {invoice_detail.recordType !== "" ?
              <> <span className="fromMenutext">{invoice_detail.recordType}</span>
                <img src={BreadcrumbArrow} alt="BreadcrumbArrow" />
              </>
              : ""}
            <span>{invoice_detail.data.type}</span></div>
          <div className="Button_Container">
            <Button className="ExitButtonContainer" onClick={onClickExit}>
              Exit
            </Button>
            {console.log("invoice_detail", invoice_detail)}
            {
              invoice_detail.fromMenu === "sent" || invoice_detail.fromMenu === "sent_awap" ? "" :
                invoice_detail.fromMenu === "draft" ?
                  <Button className="SaveButtonContainer" onClick={() => onClickAction(invoice_detail.data.action)}> Release  </Button>
                  :
                  invoice_detail.data.next_available_transitions && invoice_detail.data.next_available_transitions.values.length > 0 ?
                    <>
                      <Button className="SaveButtonContainer" onClick={() => onClickAction(invoice_detail.data.action)}> Release  </Button>
                      <Button className="SaveButtonContainer" onClick={() => onClickAction(Action.RETURN)}> Return </Button>
                    </>
                    :
                    invoice_detail.data.interim_state === InterimState.REJECTEDBYB || invoice_detail.data.interim_state === InterimState.SETTLED || invoice_detail.data.interim_state === InterimState.FINANCED ? "" :
                      <>
                        <Button className="ExitButtonContainer" onClick={() => onClickAction(Action.RECHECK)}> Recheck </Button>
                        <Button className="ExitButtonContainer" onClick={() => onClickAction(Action.REJECT)}> Reject </Button>
                        <Button className="SaveButtonContainer" style={{width:"145px"}}onClick={() => onClickAction(Action.APPROVE)}> Force Approve </Button>

                      </>
            }
          </div>
        </div> */}
      </div>
      <div className="Card_Main_Container mainContentContainer">
        <Card className="CardContainer">
          <div className="programHeading">Finance Request</div>
          <div className="SummaryContainer">
            <Row
              className="counterPartyCollapseDetails"
              style={{ marginTop: "3%" }}
            >
              <Col span={2}></Col>
              <Col span={5}>Buyer Name</Col>
              <Col span={5} className="counterPartyValue">
                {invoice_detail?.data?.buyer_details?.[0]?.name
                }
              </Col>
              <Col span={1}></Col>
              <Col span={5}>Seller Name</Col>
              <Col span={5} className="counterPartyValue">
                {invoice_detail?.data?.seller_details?.[0]?.name}
              </Col>
            </Row>

            <Row
              className="counterPartyCollapseDetails"
            >
              <Col span={2}></Col>
              <Col span={5}>Invoice No</Col>
              <Col span={5} className="counterPartyValue">
                {
                  invoice_detail?.data?.record_datas?.values?.[0]?.fields?.invoice_no
                }
              </Col>
            </Row>

            <Row
              className="counterPartyCollapseDetails"
            >
              <Col span={2}></Col>
              <Col span={5}>Invoice Date</Col>
              <Col span={5} className="counterPartyValue">
                {invoice_detail?.data?.record_datas?.values?.[0]?.fields?.invoice_date}
                {/* {JSON.parse(loginDetail).display_name} */}
              </Col>
              <Col span={1}></Col>
              <Col span={5}>Due Date</Col>
              <Col span={5} className="counterPartyValue">
                {
                  invoice_detail?.data?.record_datas?.values?.[0]?.fields?.due_date
                }

              </Col>

              <Col span={1}></Col>
            </Row>

            <Row
              className="counterPartyCollapseDetails"
            >
              <Col span={2}></Col>
              <Col span={5}>Invoice Amount</Col>
              <Col span={5} className="counterPartyValue">
                <CurrencyField currencyvalue={invoice_detail?.data?.record_datas?.values?.[0]?.fields?.finance_currency} amount={invoice_detail?.data?.record_datas?.values?.[0]?.fields?.invoice_amount} />
              </Col>
              <Col span={1}></Col>
              <Col span={5}>Finance Amount</Col>
              <Col span={5} className="counterPartyValue">
                <CurrencyField currencyvalue={invoice_detail?.data?.record_datas?.values?.[0]?.fields?.finance_currency} amount={invoice_detail?.data?.record_datas?.values?.[0]?.fields?.finance_amount} />
              </Col>
              <Col span={1}></Col>
            </Row>

            <Row
              className="counterPartyCollapseDetails"

            >
              <Col span={2}></Col>
              <Col span={5}>
                {invoice_detail?.data?.record_datas?.values?.[0]?.fields?.interest_rate ? "Interest Rate" : ""}</Col>
              <Col span={5} className="counterPartyValue">

                {
                  invoice_detail?.data?.record_datas?.values?.[0]?.fields?.interest_rate ? invoice_detail?.data?.record_datas?.values?.[0]?.fields?.interest_rate : ""}
              </Col>
              <Col span={1}></Col>
              <Col span={5}>{invoice_detail?.data?.record_datas?.values?.[0]?.fields?.interest_amount ? "Interest Amount" : ""}</Col>
              <Col span={5} className="counterPartyValue">
                {invoice_detail?.data?.record_datas?.values?.[0]?.fields?.interest_amount ?
                  <CurrencyField currencyvalue={invoice_detail?.data?.record_datas?.values?.[0]?.fields?.finance_currency} amount={invoice_detail?.data?.record_datas?.values?.[0]?.fields?.interest_amount} />
                  : ""}
              </Col>
              <Col span={1}></Col>

            </Row>
            {(localStorage.getItem("user") === "Bank") ?
              "" :
              <Row
                className="counterPartyCollapseDetails"
              >
                <Col span={2}> </Col>
                <Col span={5} >
                  <div className="SummaryLabel">Comments From Bank</div>
                </Col>
                <Col style={{ padding: 0 }}>
                  <div>
                    {invoice_detail.data.comments}
                  </div>
                  {/* <TextArea style={{ width: "50%", margin: "0px 0px" }} onChange={(e: any) => setCommentsvalue(e.target.value)} /> */}
                </Col>
              </Row>
            }
            {
              errorsvalue !== null && errorsvalue?.length !== 0 ?
                <>
                  <Row
                    className="counterPartyCollapseDetails"
                    gutter={24}>
                    <Col span={2}></Col>
                    <Col span={22} style={{ color: "black" }}> Automatic Finance Rejection: Please review error details</Col>

                  </Row>
                  <Row
                    className="counterPartyCollapseDetails"
                    gutter={24}>
                    <Col span={2}></Col>
                    <Col span={22} style={{ fontSize: "1em", color: "red" }}>
                      {errorsvalue?.map((item: any, index: number) => {
                        return (
                          <div style={{ height: "30px" }}>
                            {index + 1}. <>{item?.finance_amount}
                              {item?.finance_percent}
                              {item?.system_date}
                              {item?.due_date}
                              {item?.status}</>
                          </div>
                        )
                      })}


                    </Col>
                  </Row>
                </>
                : ""}

            <Row gutter={24}>
              <Col span={2}> </Col>
              <Col span={5} >
                <div className="SummaryLabel">Comments </div>
              </Col>
              <Col span={16} style={{ padding: 0 }}>
                <TextArea style={{ width: "50%", margin: "0px 0px" }} onChange={(e: any) => setCommentsvalue(e.target.value)} id="comments" />
              </Col>
            </Row>
          </div>
        </Card>
      </div>
    </React.Fragment>
    // <div>
    //   <div className="ProgramMainContainer">

    //   </div>


    // </div>
  );
};
export default FinanceRequestDetail;
