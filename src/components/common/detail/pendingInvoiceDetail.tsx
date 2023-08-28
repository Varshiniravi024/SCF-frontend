import React, { useState, useEffect } from "react";
import { Row, Col, Select, Input, message, Card, Radio } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import httpClient from "../../../utils/config/core/httpClient";
import baseurl from "../../../utils/config/url/base";
import images from "../../../assets/images"
import { useSelector } from "react-redux";
import { allCurrency } from "../../../redux/action";
import { transition } from "../../api/finfloTransition";
import { ErrorMessage } from "../../../utils/enum/messageChoices";
import { Action, ResponseStatus, TransactionType } from "../../../utils/enum/choices";
import CurrencyField from "../function/currency";
import Breadcrumbs from "../heading/breadcrumb";
const { Option } = Select;
const FinanceRequestDetail = () => {
  const { state } = useLocation();
  const Navigator = useNavigate();

  const [invoice_detail] = useState(state as any);
  const { DropdownIcon } = images;
  const currency_data = useSelector(allCurrency);

  const [allCurrencyData, setallCurrencyData] = useState([]);
  const [RepaymentValue, setRepaymentValue] = useState("");
  const [OtherAmountValue, setOtherAmountValue] = useState("")
  const [PartyAccountDetails, setPartyAccountDetails] = useState([])
  const [PartyAccountCurrencyDetails, setPartyAccountCurrencyDetails] = useState("")
  // const [selectedPartyAccountDetails, setSelectedPartyAccountCurrencyDetails] = useState("")
  const [repaymentId, setRepaymentId] = useState("")
  const onClickExit = () => {
    Navigator(`/PendingInvoices`)
  };
  const returnRoute = (data: any) => {
    if (data === true) {
      Navigator(`/PendingInvoices`)
    }
  }
  const onClickSubmitAction = () => {
    if (RepaymentValue === "") {
      message.error(ErrorMessage.PCR)
    } else {
      if (RepaymentValue === "Other Amount") {
        if (OtherAmountValue === "") {
          message.error(ErrorMessage.PFOAMT)
        } else {
          const bodyData = {
            repayment_amount: parseFloat(OtherAmountValue),
            repayment_account: repaymentId ? repaymentId : invoice_detail?.data?.repayment_account.id
          }
          httpClient
            .getInstance()
            .put(`${baseurl}api/invoice/${invoice_detail.data.id}/`, bodyData)
            .then((resp: any) => {

              if (resp.data.status === ResponseStatus.SUCCESS) {
                httpClient
                  .getInstance()
                  .get(`${baseurl}api/resource/action/status/?action=${Action.SUBMIT}&type=${TransactionType.TINVOICE}&t_id=${invoice_detail.data.id}`)
                  .then((respo: any) => {
                    if (respo.data.status === ResponseStatus.SUCCESS) {
                      transition(invoice_detail, "Submit", respo.data.data.from_party, respo.data.data.to_party, "PendingInvoices", returnRoute)
                    } else {
                      message.error(respo.data.data)
                    }
                  })
              }
            })
        }

      } else {
        const bodyData = {
          repayment_amount: parseFloat(invoice_detail?.data?.outstanding_amount),
          repayment_account: repaymentId ? repaymentId : invoice_detail?.data?.repayment_account.id
        }
        httpClient
          .getInstance()
          .put(`${baseurl}api/invoice/${invoice_detail.data.id}/`, bodyData)
          .then((resp: any) => {
            if (resp.data.status === ResponseStatus.SUCCESS) {
              httpClient
                .getInstance()
                .get(`${baseurl}api/resource/action/status/?action=${Action.SUBMIT}&type=${TransactionType.TINVOICE}&t_id=${invoice_detail.data.id}`)
                .then((resp: any) => {
                  if (resp.data.status === ResponseStatus.SUCCESS) {
                    transition(invoice_detail, "Submit", resp.data.data.from_party, resp.data.data.to_party, "PendingInvoices", returnRoute)
                  }
                })
            }
          })

      }
    }


  }
  useEffect(() => {
    setPartyAccountCurrencyDetails(invoice_detail?.data?.repayment_account?.currency)
    httpClient
      .getInstance()
      .get(`${baseurl}api-auth/currency/`)
      .then((resp: any) => {
        setallCurrencyData(resp.data.data);
      });
    httpClient
      .getInstance()
      .get(`${baseurl}api-auth/party/party-accounts/`)
      .then((resp: any) => {
        setPartyAccountDetails(resp.data.data)
      })
  }, []);

  return (
    <React.Fragment>
 <div>
      {/* <div className="ProgramMainContainer">
        <div className="ProgramDetailContainer"> */}
      <div className="fixedContainer">
      <Breadcrumbs 
        // flag={programData?.fromMenu} 
        // text={programData?.fromMenu} 
        // subText="" 
        Data={"Pending Invoice"}
        onClickExit={onClickExit}
        commentsValue={""}
        flag="pendingInvoice"
        onClickAction={onClickSubmitAction}

        />
        {/* <div className="ProgramDetailContainer">
          <div className="breadcrumbContainer">
            <span onClick={onClickExit}>Pending Invoice</span>
            <img src={BreadcrumbArrow} alt="BreadcrumbArrow" />
            <>
              <span className="fromMenutext">Detail</span>
            </>
          </div>
          <div className="Button_Container">

            <Button className="ExitButtonContainer" onClick={onClickExit}>
              Exit
            </Button>
            <Button
              className="SaveButtonContainer"
              onClick={onClickSubmitAction}
            >
              Submit
            </Button>
          </div>
        </div> */}


      </div>
      {/* </div>
      </div> */}
      <div className="Card_Main_Container mainContentContainer">
        <Card className="CardContainer">
          <div className="DetailCardHead">Pending Invoice Detail</div>
          <div className="SummaryContainer">
            <Row
              className="counterPartyCollapseDetails"
              style={{ marginTop: "3%" }}
            >
              <Col span={2}></Col>
              <Col span={5}>Invoice No</Col>
              <Col span={5} className="counterPartyValue">
                {
                  invoice_detail?.data?.invoice_no
                }
              </Col>
            </Row>
            <Row
              className="counterPartyCollapseDetails"
            >
              <Col span={2}></Col>
              {/* <Col span={5}>
                Finance Date
              </Col>
              <Col span={5} className="counterPartyValue">
                {invoice_detail?.data?.finance_details ? invoice_detail?.data?.finance_details?.[0]?.finance_date ? invoice_detail?.data?.finance_details?.[0]?.finance_date : "-" : "-"}
              </Col> */}
              {/* <Col span={1}></Col> */}
              <Col span={5}>Due Date</Col>
              <Col span={5} className="counterPartyValue">
                {invoice_detail?.data?.due_date !== null ? invoice_detail?.data?.due_date : "-"}

              </Col>
              <Col span={1}></Col>
            </Row>
            <Row
              className="counterPartyCollapseDetails"
            >
              <Col span={2}></Col>
              <Col span={5}>Invoice Amount</Col>
              <Col span={5} className="counterPartyValue">
                {invoice_detail?.data?.amount ?
                  <CurrencyField currencyvalue={invoice_detail?.data?.invoice_currency} amount={invoice_detail?.data?.amount} />
                  : "-"}
              </Col>
              <Col span={1}></Col>
              {/* <Col span={5}>Finance Amount</Col>
              <Col span={5}>
                <CurrencyField currencyvalue={invoice_detail?.data?.finance_currency} amount={invoice_detail?.data?.finance_amount} />
              </Col> */}

              <Col span={1}></Col>
            </Row>

            {/* <Row
              className="counterPartyCollapseDetails"
            >
              <Col span={2}></Col>
              <Col span={5}>{invoice_detail?.data?.interest_amount !== null ? "Interest Rate" : ""}</Col>
              <Col span={5} className="counterPartyValue">
                {invoice_detail?.data?.finance_details ? invoice_detail?.data?.finance_details?.[0]?.interest_rate ? invoice_detail?.data?.finance_details?.[0]?.interest_rate : "-" : ""}
              </Col>
              <Col span={1}></Col>
              <Col span={5}>{invoice_detail?.data?.interest_amount !== null ? "Interest Amount" : ""}</Col>
              <Col span={5}>
                {invoice_detail?.data?.finance_details?.[0]?.interest_amount !== null
                  ?
                <CurrencyField currencyvalue={invoice_detail?.data?.finance_currency} amount={invoice_detail?.data?.finance_details?.[0]?.interest_amount} />
:""
                }
                 </Col>
              <Col span={1}></Col>
            </Row> */}
            <Row
              className="counterPartyCollapseDetails"
            >
              <Col span={2}></Col>
              <Col span={5}>Repayment Account</Col>
              <Col span={5} className="counterPartyValue">
                <Row>
                  {/* <Col span={5}> */}
                  <div >
                    {currency_data?.payload.currencyData.allCurrency &&
                      currency_data?.payload.currencyData.allCurrency.map((item: any, index: number) => {
                        if ((PartyAccountCurrencyDetails === item.id)
                        ) {
                          return (
                            <span>{item.description}</span>
                          );
                        }

                      })}
                  </div>
                  {/* </Col> */}
                  <Col span={17}
                    style={{ padding: "0 5px" }}
                    className="repaymentAccountContainer"
                  >
                    <Select
                      id="repayment_account"
                      showSearch
                      placeholder="Select"
                      optionFilterProp="children"
                      defaultValue={invoice_detail?.data?.repayment_account?.account_number}
                      style={{ width: "100%", marginTop: "-28px" }}
                      suffixIcon={<img src={DropdownIcon} alt="DropdownIcon" />}
                      onChange={
                        (e) => {
                          let repaymentCurrency = ""
                          PartyAccountDetails &&
                            PartyAccountDetails.map((item: any, index: number) => {
                              if (e === item.account_number) {
                                repaymentCurrency = item.currency
                                setPartyAccountCurrencyDetails(item.currency)
                                // setSelectedPartyAccountCurrencyDetails(item.account_number)
                                setRepaymentId(item.id)
                              }

                            })
                          let fromCurrency = ""
                          currency_data?.payload.currencyData.allCurrency &&
                            currency_data?.payload.currencyData.allCurrency.map((item: any, index: number) => {

                              if (invoice_detail?.data?.finance_currency === item.id) {
                                return (
                                  fromCurrency = item.description
                                );
                              }

                            })
                          let tocurrency = ""
                          currency_data?.payload.currencyData.allCurrency &&
                            currency_data?.payload.currencyData.allCurrency.map((item: any, index: number) => {

                              if (repaymentCurrency === item.id) {
                                return (
                                  tocurrency = item.description
                                );
                              }

                            })



                          const bodyData = {
                            from_currency: fromCurrency,
                            to_currency: tocurrency,
                            from_amount: RepaymentValue === "Other Amount" ? parseFloat(OtherAmountValue) : parseFloat(invoice_detail?.data?.repay_total_amount)
                          }
                          httpClient
                            .getInstance()
                            .post(`${baseurl}api/resource/currency/conversion/`, bodyData)
                            .then((resp: any) => {
                              setOtherAmountValue(resp.data.data)
                            })
                        }
                      }

                    >
                      {PartyAccountDetails &&
                        PartyAccountDetails.map((item: any, index: number) => {
                          return (
                            <Option value={item.account_number} key={item.account_number} id={`account_number${index}`}
                            >
                              {/* <CurrencyField currencyvalue={item.currency} amount={item.account_number} /> */}
                              <div >
                                <span>
                                  {allCurrencyData &&
                                    allCurrencyData.map((items: any, index: number) => {
                                      let repaymentcurr = '' as any
                                      if (item.currency === items.id) {
                                        repaymentcurr = items.description
                                      }
                                      return repaymentcurr
                                    })}</span>  {" "}
                                {item.account_number}
                              </div>
                            </Option>
                          );
                        })}
                    </Select>

                  </Col>
                </Row>
              </Col>
              <Col span={1}></Col>
            </Row>
            <Row
              className="counterPartyCollapseDetails"
            >
              <Col span={2}></Col>
              <Col span={5}>Repay</Col>
              <Col span={15} className="counterPartyValue repaymentText">
                <Radio.Group
                  onChange={(e) => {
                    setRepaymentValue(e.target.value)
                  }
                  }
                  id="radioButtonGroup"

                >
                  <Row
                    className="counterPartyCollapseDetails"

                  >
                    <Radio value={"Repay Total Amount"}  id="repayTotalAmount">
                      <div style={{ display: "flex" }}>Repay Total Amount - {" "}
                        <CurrencyField currencyvalue={invoice_detail?.data?.finance_currency} amount={parseFloat(invoice_detail?.data?.outstanding_amount)} />
                      </div>
                      {/* {currency_data?.allCurrency &&
                        currency_data?.allCurrency.map((item: any, index: number) => {
                          if (invoice_detail?.data?.finance_currency === item.id) {
                            return (
                              <span>{item.description} </span>
                            );
                          }
                        })} {parseFloat(invoice_detail?.data?.outstanding_amount)} */}
                    </Radio>

                  </Row>
                  {/* <Row
                    className="counterPartyCollapseDetails"
                  >
                    <Radio value={"Other Amount"}>Other Amount</Radio>
                  </Row> */}
                </Radio.Group>
                <Row>
                  {RepaymentValue === "Other Amount" ?
                    <Input style={{ width: "40%" }} id="otherAmount" onChange={(e: any) => setOtherAmountValue(e.target.value)} prefix={allCurrencyData &&
                      allCurrencyData.map((item: any, index: number) => {
                        if (invoice_detail?.data?.finance_currency === item.id) {
                          return (
                            <span>{item.description} </span>
                          );
                        }

                      })} /> : ""}
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
