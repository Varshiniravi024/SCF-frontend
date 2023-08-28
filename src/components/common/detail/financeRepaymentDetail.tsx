import React, { useState, useEffect } from "react";
import { Row, Col, Card } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import httpClient from "../../../utils/config/core/httpClient";
import baseurl from "../../../utils/config/url/base";
import { allCurrency } from "../../../redux/action";
import { actionStatus } from "../../api/actionStatus";
import CurrencyField from "../function/currency";
import Breadcrumbs from "../heading/breadcrumb";
const FinanceRequestDetail = () => {
    const { state } = useLocation();
    const Navigator = useNavigate();
    const currency_data = useSelector(allCurrency);
    const [invoice_detail] = useState(state as any);
    const [PartyAccountDetails, setPartyAccountDetails] = useState({
        currency: "",
        account_number: ""
    })
    const onClickExit = () => {
        Navigator(`/${invoice_detail.fromMenu}`)
    };

    useEffect(() => {
        httpClient
            .getInstance()
            .get(`${baseurl}api-auth/party/party-accounts/`)
            .then((resp: any) => {
                resp.data.data.map((data: any) => {
                    if (data.id === invoice_detail?.data?.record_datas?.values?.[0]?.fields?.repayment_account) {
                        setPartyAccountDetails(data)
                    }
                    return PartyAccountDetails
                })
            })
    }, []);
    const returnRoute = (data: any) => {
        if (data === true) {
            Navigator(`/${invoice_detail.fromMenu}`)
        }
    }
    const onClickAction = (buttonKey: any) => {
        actionStatus(invoice_detail, buttonKey, returnRoute)
    }
    return (
        <React.Fragment>
            <div className="fixedContainer">
        <Breadcrumbs 
        // flag={programData?.fromMenu} 
        // text={programData?.fromMenu} 
        // subText="" 
        Data={invoice_detail}
        onClickExit={onClickExit}
        commentsValue={""}
        flag="repayment"
        onClickAction={onClickAction}

        />
        </div>
  <div className="RepaymentDetailContainer mainContentContainer">
            {/* <div className="ProgramMainContainer">
                <div className="ProgramDetailContainer">
                    <div className="Button_Container">
                        <Button className="ExitButtonContainer" onClick={onClickExit}> Exit </Button>
                        {invoice_detail.data.next_available_transitions && invoice_detail.data.next_available_transitions.values.length > 0 ?
                            <>
                                <Button className="SaveButtonContainer" onClick={() => onClickAction(invoice_detail.data.action)}> Release </Button>
                                <Button className="SaveButtonContainer" onClick={() => onClickAction(Action.RETURN)}> Return </Button>
                            </>
                            : ""
                        }
                    </div>
                </div>
            </div> */}
            <div className="Card_Main_Container">
                <Card className="CardContainer">
                    <div className="programHeading">Repayment </div>
                    <div className="SummaryContainer">
                        <Row className="counterPartyCollapseDetails" style={{ marginTop: "3%" }} >
                            <Col span={2}></Col>
                            <Col span={5}>Invoice No</Col>
                            <Col span={5} className="counterPartyValue">
                                {invoice_detail?.data?.record_datas?.values?.[0]?.fields?.invoice_no}
                            </Col>
                        </Row>
                        <Row className="counterPartyCollapseDetails" >
                            <Col span={2}></Col>
                            <Col span={5}> Finance Date </Col>
                            <Col span={5} className="counterPartyValue">
                                {invoice_detail?.data?.record_datas?.values?.[0]?.fields?.finance_date !== null ? invoice_detail?.data?.record_datas?.values?.[0]?.fields?.finance_date : "-"}
                            </Col>
                            <Col span={1}></Col>
                            <Col span={5}>Due Date</Col>
                            <Col span={5}>
                                {invoice_detail?.data?.record_datas?.values?.[0]?.fields?.due_date !== null ? invoice_detail?.data?.record_datas?.values?.[0]?.fields?.due_date : "-"}
                            </Col>
                            <Col span={1}></Col>
                        </Row>
                        <Row className="counterPartyCollapseDetails" >
                            <Col span={2}></Col>
                            <Col span={5}>Invoice Amount</Col>
                            <Col span={5} className="counterPartyValue">
                                <CurrencyField currencyvalue={invoice_detail?.data?.record_datas?.values?.[0]?.fields?.invoice_currency} amount={invoice_detail?.data?.record_datas?.values?.[0]?.fields?.invoice_amount} />
                            </Col>
                            <Col span={1}></Col>
                            <Col span={5}>Finance Amount</Col>
                            <Col span={5}>
                                <CurrencyField currencyvalue={invoice_detail?.data?.record_datas?.values?.[0]?.fields?.finance_currency} amount={invoice_detail?.data?.record_datas?.values?.[0]?.fields?.finance_amount} />
                            </Col>
                            <Col span={1}></Col>
                        </Row>

                        <Row className="counterPartyCollapseDetails" >
                            <Col span={2}></Col>
                            <Col span={5}>{invoice_detail?.data?.record_datas?.values?.[0]?.fields?.interest_rate !== null ? "Interest Rate" : ""}</Col>
                            <Col span={5} className="counterPartyValue">
                                {invoice_detail?.data?.record_datas?.values?.[0]?.fields?.interest_rate !== null ? invoice_detail?.data?.record_datas?.values?.[0]?.fields?.interest_rate : ""}
                            </Col>
                            <Col span={1}></Col>
                            <Col span={5}>{invoice_detail?.data?.record_datas?.values?.[0]?.fields?.interest_amount !== null ? "Interest Amount" : ""}</Col>
                            <Col span={5}>
                                {invoice_detail?.data?.record_datas?.values?.[0]?.fields?.interest_amount !== null ?
                                    <CurrencyField currencyvalue={invoice_detail?.data?.record_datas?.values?.[0]?.fields?.finance_currency} amount={invoice_detail?.data?.record_datas?.values?.[0]?.fields?.interest_amount} />
                                    : ""}</Col>
                            <Col span={1}></Col>
                        </Row>
                        <Row className="counterPartyCollapseDetails" >
                            <Col span={2}></Col>
                            <Col span={5}>Repayment Amount</Col>
                            <Col span={5} className="counterPartyValue repaymentText">
                                <CurrencyField currencyvalue={invoice_detail?.data?.record_datas?.values?.[0]?.fields?.finance_currency} amount={invoice_detail?.data?.record_datas?.values?.[0]?.fields?.repayment_amount} />
                            </Col>
                            <Col span={1}></Col>
                            <Col span={5}>Repayment Account</Col>
                            <Col span={5} className="counterPartyValue">
                                <Row>
                                    <div style={{ marginRight: "10px" }} >
                                        {currency_data?.payload?.currencyData?.allCurrency &&
                                            currency_data?.payload?.currencyData?.allCurrency.map((item: any, index: number) => {
                                                if (PartyAccountDetails.currency === item.id) {
                                                    return (
                                                        <span>{item.description} </span>
                                                    );
                                                }
                                            })
                                        }
                                    </div>
                                    <Col span={17} >
                                        <div>{PartyAccountDetails.account_number}</div>
                                    </Col>
                                </Row>
                            </Col>
                            <Col span={1}></Col>
                        </Row>
                    </div>
                </Card>
            </div>

        </div>
        </React.Fragment>
      
    );
};
export default FinanceRequestDetail;
