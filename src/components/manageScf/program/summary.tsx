import React, { useEffect, useState } from "react";
import { Row, Col, Collapse, Button, Spin, Input, message } from "antd";
import "../manageScf.scss";
import { useNavigate } from "react-router-dom";
import images from "../../../assets/images";
import httpClient from "../../../utils/config/core/httpClient";
import baseurl from "../../../utils/config/url/base";
import { useDispatch, useSelector } from "react-redux";
import {
  program_Basicdetails,
  program_counterpartydetails,
  allInterestType,
  allInterestRateType,
} from "../../../redux/action";
import closeUploadedDoc from "../../../assets/images/closeUploadedDoc.png"
import pdfImage from "../../../assets/images/pdfImage.png";
import imageBaseurl from "../../../utils/config/url/image";
import { Currency } from "../../api/base";
import { Action, InterestDeduction, InterestPaidBy, ProgramType, ResponseStatus, TransactionType } from "../../../utils/enum/choices";

interface IProps {
  previousPage: any;
  nextpage: any;
  programData: any;
  CounterPartyData: any;
}
interface BasicDetails {
  total_limit_amount: number;
  limit_currency: string;
  expiry_date: any;
  settlement_currency: string;
  maximum_amount: number;
  max_finance_percentage: number;
  max_invoice_age_for_funding: number;
  grace_period: number;
  interest_type: string;
  interest_rate_type: string;
  margin: number;
  comments: string;
}

const Summary = (props: React.PropsWithChildren<IProps>) => {
  const dispatch = useDispatch();
  const [currencyData, setCurrencyData] = useState([]);
  // const Programdata = useSelector(select_Programdata)

  const interest_Type_data = useSelector(allInterestType);
  const interest_Rate_Type_data = useSelector(allInterestRateType);
  const basicDetailsData = useSelector(program_Basicdetails);
  const basicDetailsDatas = basicDetailsData.payload.programBasicdetailsData
  const [basicDetail, setBasicDetail] = useState({} as any);
  const [BasicDetailsInfo, setBasicDetailsInfo] = useState<BasicDetails>(
    {} as BasicDetails
  );
  const [counterPartyDetails, setCounterpartyDetails] = useState([] as any);
  const [wfItemId, setWfItemId] = useState("");
  const navigate = useNavigate();
  const [type, setType] = useState("");
  const [rateType, setRateType] = useState("");
  const [disableButton, setDisableButton] = useState(false);
  const [commentsValue, setCommentsvalue] = useState(null as any)
  const { TextArea } = Input;
  const [counterPartyFile, setCounterPartyFile] = useState([])
  const { CollapseCloseIcon, CollapseOpenIcon } = images;
  const { Panel } = Collapse;
  const [isLoading, setIsLoading] = useState(true);
  const [CurrencyValue, setCurrencyValue] = useState([])
  const [programFile, setProgramFile] = useState([]);
  const [repaymentDetail, setRepaymentDetail] = useState({
    currency: "",
    account_number: ""
  })
  const onClickPrevious = () => {
    props.previousPage("2");
  };
  const getCurrency = async () => {
    const data = await Currency()
    setCurrencyData(data)
  }
  const onClickAction = (buttonKey: string) => {
    const loginlocalItems = localStorage.getItem("login_detail") as any;

    const formdata = new FormData();
    formdata.append('comments', commentsValue)
    setDisableButton(true)
    const id = basicDetailsDatas ? basicDetailsDatas.id : "";
    if (id) {
      httpClient
        .getInstance()
        .get(`${baseurl}api/resource/action/status/?action=${buttonKey}&type=transaction.programs&t_id=${id}`)
        .then((resp: any) => {
          if (resp.data.status === ResponseStatus.SUCCESS) {
            const body = {
              type: TransactionType.TPROGRAM,
              action: buttonKey,
              t_id: id,
              from_party: resp.data.data.from_party,
              to_party: resp.data.data.to_party,
              party: JSON.parse(loginlocalItems).party_id
            }
            httpClient
              .getInstance()
              .post(`${baseurl}finflo/transition/`, body)
              .then((resp: any) => {
                localStorage.removeItem("program_t_id")
                localStorage.getItem("user") === "Bank" ?
                  navigate("/inbox")
                  :
                  navigate("/ManageScf")
                message.success(resp.data.status)
                dispatch(program_Basicdetails(null))
                dispatch(program_counterpartydetails(null))

              }).catch((err: any) => {
                setDisableButton(false)

              })
          } else {
            message.error(resp.data.data)
            setDisableButton(false)
          }
        }).catch((err: any) => {
          setDisableButton(false)
        })
    }
  };
  useEffect(() => {
    getCurrency();
    httpClient
      .getInstance()
      .get(`${baseurl}api-auth/currency/`)
      .then((resp: any) => {
        setCurrencyValue(resp.data.data)

      });
    setTimeout(() => {
      const id = basicDetailsDatas ? basicDetailsDatas.id : "";
      if (id) {

        httpClient
          .getInstance()
          .get(`${baseurl}api/pairing/?pg_id=${id}`)
          // .get(`${baseurl}api/counterparty/?program_type=${basicDetailsDatas.program_type}`)
          .then((resp: any) => {
            setTimeout(() => {
              setIsLoading(false)
              setCounterpartyDetails(resp.data.data);
              if (resp.data.data.length < 0) {
                httpClient
                  .getInstance()
                  .get(`${baseurl}api/resource/file/?pairing=${resp.data.data[0].id}`)
                  .then((resp: any) => {
                    setCounterPartyFile(resp.data.data)
                  });
              }
            }, 1000)

          });

        httpClient
          .getInstance()
          .get(`${baseurl}api/program/${id}/`)
          .then((resp: any) => {
            if (resp.data.data.attachments !== null) {
              setProgramFile(resp.data.data.attachments?.file)
            }
            setRepaymentDetail(resp.data.data.repayment_account)
            setWfItemId(resp.data.data.wf_item_id);
            setBasicDetail(resp.data.data);
          });
        interest_Type_data &&
          interest_Type_data.payload.interestType?.allInterestType.map((type: any) => {
            if (basicDetailsDatas.record_datas) {
              if (
                type.id === basicDetailsDatas.record_datas.model[0].interest_type_id
              ) {
                setType(type.description);
              }
            }
          });
        interest_Rate_Type_data &&
          interest_Rate_Type_data.payload.interestRateType.allInterestRateType.map((rateType: any) => {
            if (basicDetailsDatas.record_datas) {
              if (
                rateType.id ===
                basicDetailsDatas.record_datas.model[0].interest_rate_type_id
              ) {
                setRateType(rateType.description);
              }
            }
          });
      }
    }, 5000)

  }, []);

  const onClickprevious = () => {
    navigate("/ManageScf");
  };
  // const onClickSave = () => {
  //   let id = basicDetailsDatas ? basicDetailsDatas.id : "";
  //   let loginlocalItems = localStorage.getItem("login_detail") as any;

  //   const body = {
  //     t_id: id,
  //     type: TransactionType.TPROGRAM,
  //     from_party: JSON.parse(loginlocalItems).party_id,
  //     to_party: JSON.parse(loginlocalItems).party_id,
  //     party: JSON.parse(loginlocalItems).party_id
  //   }
  //   httpClient
  //     .getInstance()
  //     .post(`${baseurl}finflo/transition/`, body)
  //     .then((resp: any) => {
  //     })
  // }

  return isLoading ? <Spin /> : (
    <div className="SummaryContainer">
      <Button className="actionButtonSaveContainer" htmlType="submit" disabled={counterPartyDetails.length === 0 ? true : false} loading={disableButton} onClick={onClickprevious} id="summary_save" style={{ position: "fixed", zIndex: 99999 }}>
        Save</Button>
      {/* <Button className="actionButtonExitContainer" onClick={onClickprevious} id="summary_exit" style={{ position: "fixed", zIndex: 99999 }}>
        Exit</Button> */}
      {localStorage.getItem("user") === "Bank" ?
        <Button className="nextButtonContainer" onClick={() => onClickAction(Action.MODIFY)} disabled={
          basicDetailsDatas
            ? basicDetailsDatas.program_type === ProgramType.APF
              ? counterPartyDetails.length === 0
                ? true
                : false
              : false
            : false
        }
          loading={disableButton} id="summary_submit">Submit</Button>
        :
        <Button className="nextButtonContainer" onClick={() => onClickAction(Action.SUBMIT)} disabled={
          basicDetailsDatas
            ? basicDetailsDatas.program_type === ProgramType.APF
              ? counterPartyDetails.length === 0
                ? true
                : false
              : false
            : false
        }
          loading={disableButton} id="summary_submit">Submit</Button>
      }
      <h3>Basic Details</h3>
      <Row gutter={24}>
        <Col span={12}>
          {/* {BasicDetails &&
            BasicDetails.map((data: any, index: number) => {
              return ( */}
          <Row>
            <Col span={12} className="SummaryLabel">
              Limit Amount
            </Col>
            <Col span={12} className="SummaryDesc" id="summaryLimitAmount">
              {/* {Data.limitType} {Data.limit} */}
              {
                currencyData.map((item: any) => {
                  if (item.id === basicDetailsDatas.limit_currency) {
                    return `${item.description} ${basicDetailsDatas.max_limit_amount}`
                  }
                })
              }
              {/* {basicDetailsDatas ? basicDetailsDatas.limit_currency : "-"}{" "} */}
              {/* {
                new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(basicDetailsDatas ? basicDetailsDatas.total_limit_amount : 0)

              } */}
              {/* {basicDetailsDatas ? basicDetailsDatas.max_limit_amount : "-"} */}
            </Col>
          </Row>
          <Row>
            <Col span={12} className="SummaryLabel">
              Expiry Date
            </Col>
            <Col span={12} className="SummaryDesc" id="summaryExpiryDate">
              {basicDetailsDatas ? basicDetailsDatas.expiry_date : "-"}
            </Col>
          </Row>
          <Row>
            <Col span={12} className="SummaryLabel">
              Max Invoice Amount
            </Col>
            <Col span={12} className="SummaryDesc" id="summaryMaxAmount">
              {
                currencyData.map((item: any) => {
                  if (item.id === basicDetailsDatas.max_invoice_currency) {
                    return `${item.description} ${basicDetailsDatas.max_invoice_amount}`
                  }
                })
              }
              {/* {basicDetailsDatas ? basicDetailsDatas.max_invoice_currency : "-"}{" "}
              {basicDetailsDatas ? basicDetailsDatas.max_invoice_amount : "-"} */}
              {/* {Data.maxInvocieAmountType} {Data.maxInvocieAmount} */}
            </Col>
          </Row>
          <Row>
            <Col span={12} className="SummaryLabel">
              Max Invoice PCT
            </Col>
            <Col span={12} className="SummaryDesc" id="summaryMaxPCT">
              {basicDetailsDatas
                ? basicDetailsDatas.max_invoice_percent
                : "-"}
            </Col>
          </Row>
          <Row>
            <Col span={12} className="SummaryLabel">
              Max Tenor
            </Col>
            <Col span={12} className="SummaryDesc" id="summaryMaxtenor">
              {basicDetailsDatas
                ? basicDetailsDatas.max_tenor
                : "-"}
            </Col>
          </Row>
          <Row>
            <Col span={12} className="SummaryLabel">
              Grace Period
            </Col>
            <Col span={12} className="SummaryDesc" id="summaryGracePeriod">
              {/* {Data.gracePeriod} */}
              {basicDetailsDatas ? basicDetailsDatas.grace_period : "-"}
            </Col>
          </Row>
          <Row>
            <Col span={12} className="SummaryLabel">
              Interest Type
            </Col>
            <Col span={12} className="SummaryDesc" id="summaryInterestType">
              {basicDetailsDatas ? basicDetailsDatas.interest_type === 1 ? "Fixed" : basicDetailsDatas.interest_type === 2 ? "Floating"
                : basicDetailsDatas.interest_type === "FIXED" ? "Fixed"
                  : basicDetailsDatas.interest_type === "FLOATING" ? "Floating"
                    : basicDetailsDatas.interest_type === "FLOATING" ? "Floating"

                      : "" : ""}
            </Col>
          </Row>
          {basicDetailsDatas && basicDetailsDatas.interest_type === "FIXED" ? (
            ""
          ) : (
            <Row>
              <Col span={12} className="SummaryLabel">
                Interest rate type
              </Col>
              <Col span={12} className="SummaryDesc" id="summaryInterestRateType">
                {basicDetailsDatas ?
                  basicDetailsDatas.interest_type === 1 ? "-"
                    : basicDetailsDatas.interest_type === "fixed" ? "-"
                      : basicDetailsDatas.interest_rate_type === 1 ? "Euribor"
                        : basicDetailsDatas.interest_rate_type === 2 ? "Libor"
                          : basicDetailsDatas.interest_rate_type === 3 ? "Sofr"
                            : basicDetailsDatas.interest_rate_type === 4 ? ""
                              : basicDetailsDatas.interest_rate_type === "EURIBOR" ? "Euribor"
                                : basicDetailsDatas.interest_rate_type === "LIBOR" ? "Libor"
                                  : basicDetailsDatas.interest_rate_type === "SOFR" ? "Sofr"
                                    : basicDetailsDatas.interest_rate_type === "NULL" ? "" :
                                      rateType : rateType
                }
              </Col>
            </Row>
          )}
          <Row>
            <Col span={12} className="SummaryLabel">
              Fixed rate / Margin
            </Col>
            <Col span={12} className="SummaryDesc" id="summaryMargin">
              {basicDetailsDatas ? basicDetailsDatas.margin : "-"}
            </Col>
          </Row>
          {props?.programData === ProgramType.APF || props?.programData?.program === ProgramType.APF || props?.programData?.program_type === ProgramType.APF ?
            <>
              <Row>
                <Col span={12} className="SummaryLabel">
                  Interest Paid By
                </Col>
                <Col span={12} className="SummaryDesc" id="summaryInterestPaidBy">
                  {basicDetailsDatas ? basicDetailsDatas.interest_paid_by === InterestPaidBy.OWNPARTY ? "Ownparty" : basicDetailsDatas?.interest_paid_by === InterestPaidBy.COUNTERPARTY ? "Counterparty" : basicDetailsDatas?.interest_paid_by : "-"}
                </Col>
              </Row>
              <Row>
                <Col span={12} className="SummaryLabel">
                  Overdue Interest Rate
                </Col>
                <Col span={12} className="SummaryDesc" id="summaryOverdueInterestRate">
                  {basicDetailsDatas ? basicDetailsDatas.overdue_interest_rate : "-"}

                </Col>
              </Row>
              <Row>
                <Col span={12} className="SummaryLabel">
                  Interest Deduction Stage
                </Col>
                <Col span={12} className="SummaryDesc" id="summaryInterestDeduction">
                  {basicDetailsDatas ?
                    basicDetailsDatas.interest_deduction === InterestDeduction.FINANCING ? "Financing" : basicDetailsDatas.interest_deduction === InterestDeduction.REPAYMENT ? "Repayment" : basicDetailsDatas.interest_deduction
                    : "-"}

                </Col>
              </Row>
              <Row>
                <Col span={12} className="SummaryLabel">
                  Repayment Account
                </Col>
                <Col span={12} className="SummaryDesc" id="summaryRepaymentAccount">
                  {
                    currencyData.map((item: any) => {
                      if (item.id === repaymentDetail.currency) {
                        return `${item.description} ${repaymentDetail.account_number}`
                      }
                    })
                  }
                </Col>
              </Row>
              <Row>
                <Col span={12} className="SummaryLabel">
                  Allow Invoice upload by buyer
                </Col>
                <Col span={12} className="SummaryDesc" id="summaryInvoiceUploadBy">
                  {basicDetailsDatas?.buyer_details?.[0]?.self_invoice_upload === false ? "No" : "Yes"}
                </Col>
              </Row>
              <Row>
                <Col span={12} className="SummaryLabel">
                  Auto Debit for Invoices not financed
                </Col>
                <Col span={12} className="SummaryDesc" id="summaryAutoDebitInvoice">
                  {basicDetailsDatas ? basicDetailsDatas.auto_debit_invoice === false ? "No" : "Yes" : "-"}

                </Col>
              </Row>
              <Row>
                <Col span={12} className="SummaryLabel">
                  Allow Rebate for Buyer
                </Col>
                <Col span={12} className="SummaryDesc" id="summaryRebateBuyer">
                  {basicDetailsDatas ? basicDetailsDatas.buyer_rebate === false ? "No" : "Yes" : "-"}

                </Col>
              </Row>
              <Row>
                <Col span={12} className="SummaryLabel">
                  Buyer Rebate PCT
                </Col>
                <Col span={12} className="SummaryDesc" id="summaryRebateBuyerPct">
                  {basicDetailsDatas ? basicDetailsDatas.buyer_rebate_percent : "-"}

                </Col>
              </Row>
              <Row>
                <Col span={12} className="SummaryLabel">
                  Backed by Insurance
                </Col>
                <Col span={12} className="SummaryDesc" id="summaryInsuranceBacked">
                  {basicDetailsDatas ? basicDetailsDatas.insurance_backed === false ? "No" : "Yes" : "-"}

                </Col>
              </Row>
              <Row>
                <Col span={12} className="SummaryLabel">
                  Fee
                </Col>
                <Col span={12} className="SummaryDesc" id="summaryFee">
                  {basicDetailsDatas ? basicDetailsDatas.fee : "-"}

                </Col>
              </Row>

            </>



            :
            props?.programData === ProgramType.RF || props?.programData?.program === ProgramType.RF || props?.programData?.program_type === ProgramType.RF ?
              <>
                <Row>
                  <Col span={12} className="SummaryLabel">
                    Repayment Account
                  </Col>
                  <Col span={12} className="SummaryDesc" id="summaryRepaymentAccount">
                    {
                      currencyData.map((item: any) => {
                        if (item.id === repaymentDetail.currency) {
                          return `${item.description} ${repaymentDetail.account_number}`
                        }
                      })
                    }
                  </Col>
                </Row>
                <Row>
                  <Col span={12} className="SummaryLabel">
                    Overdue Interest Rate
                  </Col>
                  <Col span={12} className="SummaryDesc" id="summaryOverdueInterestRate">
                    {basicDetailsDatas ? basicDetailsDatas.overdue_interest_rate : "-"}

                  </Col>
                </Row>
                <Row>
                  <Col span={12} className="SummaryLabel">
                    Interest Deduction Stage
                  </Col>
                  <Col span={12} className="SummaryDesc" id="summaryInterestDeduction">
                    {basicDetailsDatas ?
                      basicDetailsDatas.interest_deduction === InterestDeduction.FINANCING ? "Financing" : basicDetailsDatas.interest_deduction === InterestDeduction.REPAYMENT ? "Repayment" : basicDetailsDatas.interest_deduction
                      : "-"}

                  </Col>
                </Row>

                <Row>
                  <Col span={12} className="SummaryLabel">
                    Allow Finance Invoices
                  </Col>
                  <Col span={12} className="SummaryDesc" id="summaryAutoFinanceInvoice">
                    {basicDetailsDatas ? basicDetailsDatas.auto_finance : "-"}

                  </Col>
                </Row>
                <Row>
                  <Col span={12} className="SummaryLabel">
                    Backed by Insurance
                  </Col>
                  <Col span={12} className="SummaryDesc" id="summaryInsuranceBacked">
                    {basicDetailsDatas ? basicDetailsDatas.insurance_backed === false ? "No" : "Yes" : "-"}

                  </Col>
                </Row>
                <Row>
                  <Col span={12} className="SummaryLabel">
                    Fee
                  </Col>
                  <Col span={12} className="SummaryDesc" id="summaryFee">
                    {basicDetailsDatas ? basicDetailsDatas.fee : "-"}

                  </Col>
                </Row>

                <Row>
                  <Col span={12} className="SummaryLabel">
                    Refund Interest during Early Repayment
                  </Col>
                  <Col span={12} className="SummaryDesc" id="summaryInvoiceUploadBy">
                    -
                  </Col>
                </Row>
              </>
              : ""
          }
        </Col>
        <Col span={12}>
          <div className="UploadCardContainer" style={{ display: "flex" }}  id="summaryAttachments">
            {/* {basicDetailsDatas.attachments ? basicDetailsDatas.attachments.file.length > 0 ? */}
            {(programFile.map((file: any, index: any) => {
              const splitedValue = file.file_path.split("/")
              const lastValue = splitedValue.pop()
              return (
                <div key={index} style={{ border: '1px dashed #006666', borderRadius: '5px', alignItems: 'center', width: '100px', height: '130px', position: 'relative', padding: 10, paddingRight: 5, marginRight: "10px" }}>
                  <img src={`${imageBaseurl}${file.file_path}`} style={{ objectFit: 'cover', width: '45px', height: '60px', position: 'absolute', top: 20 }} alt="file" />
                  <p style={{ position: 'absolute', bottom: 0, fontSize: 12, color: '#006666' }}>
                    <a href={`${imageBaseurl}${file.file_path}`} target="_blank" id="summaryImages"> {lastValue}</a>
                  </p>
                </div>
              )
            })
            )
            }
          </div>
        </Col>
      </Row>
      <div className="containerCollapse">
        <h3>Counterparty List</h3>
        <Row className="counterPartyHeaderDetails">
          <Col span={8} >Counterparty Name</Col>
          <Col span={8}>City</Col>
          <Col span={8} >Limit</Col>
        </Row>
        {counterPartyDetails.length === 0 ? (
          <div style={{ textAlign: "center", fontSize: "18px" }}>no data</div>
        ) : (
          counterPartyDetails &&
          counterPartyDetails.map((Data: any, index: number) => {
            return (

              <Collapse accordion className="counterPartyDetails" key={index}
                expandIcon={({ isActive }) => isActive ? <img src={CollapseOpenIcon} alt="collapseIcon" id={`summaryCollapseOpen${index}`} /> : <img src={CollapseCloseIcon} alt="collapseIcon" id={`summaryCollapseClose${index}`} />}
              >
                <Panel
                  header={
                    <Row style={{ borderRadius: 25 }}>
                      <Col span={8} id={`summarycounterpartyId${index}`} >{Data.counter_party_name}</Col>
                      <Col span={8} id={`summaryCity${index}`}>{Data.city}</Col>
                      <Col span={8} id={`summaryMaxLimitAmount${index}`}>{Data.max_limit_amount}</Col>
                    </Row>
                  }
                  key="1"
                >
                  <Row
                    className="counterPartyCollapseDetails"
                  >
                    <Col span={1}></Col>
                    <Col span={5}>Limit</Col>
                    <Col span={1}></Col>
                    <Col span={5} className="counterPartyValue" id={`summaryCP_LimitAmount${index}`}>
                      {CurrencyValue.map((item: any) => {
                        return (
                          item.id === Data.limit_currency &&
                          item.description


                        )
                      })}
                      {" "}
                      {Data.max_limit_amount}
                    </Col>
                    <Col span={1}></Col>
                    <Col span={5}>Expiry Date</Col>
                    <Col span={1}></Col>
                    <Col span={5} className="counterPartyValue" id={`summaryCP_ExpiryDate${index}`}>
                      {Data.expiry_date}
                    </Col>
                    <Col span={1}></Col>
                  </Row>
                  <Row
                    className="counterPartyCollapseDetails"
                  >
                    <Col span={1}></Col>
                    <Col span={5}>Max Invoice Amount</Col>
                    <Col span={1}></Col>
                    <Col span={5} className="counterPartyValue" id={`summaryCP_MaxInvoiceAmount${index}`}>
                      {CurrencyValue.map((item: any) => {
                        return (
                          item.id === Data.max_invoice_currency &&
                          item.description


                        )
                      })}
                      {" "}
                      {Data.max_invoice_amount}
                    </Col>
                    <Col span={1}></Col>
                    <Col span={5}>Max Invoice PCT</Col>
                    <Col span={1}></Col>
                    <Col span={5} className="counterPartyValue" id={`summaryCP_MaxInvoicePCT${index}`}>
                      {Data ? Data.max_invoice_percent : "-"}
                    </Col>

                    <Col span={1}></Col>
                  </Row>
                  <Row
                    className="counterPartyCollapseDetails"
                  >
                    <Col span={1}></Col>
                    <Col span={5}>Grace Period</Col>
                    <Col span={1}></Col>
                    <Col span={5} className="counterPartyValue" id={`summaryCP_GracePeriod${index}`}>
                      {Data.grace_period}
                    </Col>
                    <Col span={1}></Col>
                    <Col span={5}>Max Tenor</Col>
                    <Col span={1}></Col>
                    <Col span={5} className="counterPartyValue" id={`summaryCP_MaxTenor${index}`}>

                      {Data ? Data.max_tenor : "-"}
                    </Col>

                    <Col span={1}></Col>
                  </Row>
                  <Row
                    className="counterPartyCollapseDetails"
                  >
                    <Col span={1}></Col>
                    <Col span={5}>Interest Rate Type</Col>
                    <Col span={1}></Col>
                    <Col span={5} className="counterPartyValue" id={`summaryCP_InterestRateType${index}`}>

                      {Data.interest_type === 1
                        ? "-"
                        : Data.interest_rate_type === 1 ? "Euribor"
                          : Data.interest_rate_type === 2 ? "Libor"
                            : Data.interest_rate_type === 3 ? "Sofr"

                              : "-"
                      }
                    </Col>
                    <Col span={1}></Col>
                    <Col span={5}>Interest Type</Col>
                    <Col span={1}></Col>
                    <Col span={5} className="counterPartyValue" id={`summaryCP_interestType${index}`}>

                      {Data.interest_type === 1 ? "Fixed" : Data.interest_type === 2 ? "Floating" : "-"
                      }
                    </Col>

                    <Col span={1}></Col>
                  </Row>
                  {props?.programData === ProgramType.APF || props?.programData?.program === ProgramType.APF || props?.programData?.program_type === ProgramType.APF
                    ?
                    <>
                      <Row className="counterPartyCollapseDetails">
                        <Col span={1}></Col>
                        <Col span={5}>Fixed Rate/ Margin</Col>
                        <Col span={1}></Col>
                        <Col span={5} className="counterPartyValue" id={`summaryCP_Margin${index}`}>
                          {Data.margin}
                        </Col>
                        <Col span={1}></Col>
                        <Col span={5}>Interest Paid By</Col>
                        <Col span={1}></Col>
                        <Col span={5} className="counterPartyValue" id={`summaryCP_InterestPaidBy${index}`}>
                          {Data.interest_paid_by === InterestPaidBy.OWNPARTY ? "Ownparty" : Data?.interest_paid_by === InterestPaidBy.COUNTERPARTY ? "Counterparty" : Data?.interest_paid_by}
                        </Col>
                      </Row>
                      <Row className="counterPartyCollapseDetails">
                        <Col span={1}></Col>
                        <Col span={5}>Overdue Interest Rate</Col>
                        <Col span={1}></Col>
                        <Col span={5} className="counterPartyValue" id={`summaryCP_OverdueInterestRate${index}`}>
                          {Data.overdue_interest_rate}
                        </Col>
                        <Col span={1}></Col>
                        <Col span={5}>Interest Deduction Stage</Col>
                        <Col span={1}></Col>
                        <Col span={5} className="counterPartyValue" id={`summaryCP_InterestDeduction${index}`}>
                          {Data.interest_deduction === InterestDeduction.FINANCING ? "Financing" : Data.interest_deduction === InterestDeduction.REPAYMENT ? "Repayment" : Data.interest_deduction}
                        </Col>
                      </Row>
                      <Row className="counterPartyCollapseDetails">
                        <Col span={1}></Col>
                        <Col span={5}>Auto Debit for Invoices not Financed</Col>
                        <Col span={1}></Col>
                        <Col span={5} className="counterPartyValue" id={`summaryCP_AutoDebitInvoice${index}`}>
                          {Data.auto_debit_invoice === false ? "No" : "Yes"}
                        </Col>
                        <Col span={1}></Col>
                        <Col span={5}>Allow Rebate for Buyer</Col>
                        <Col span={1}></Col>
                        <Col span={5} className="counterPartyValue" id={`summaryCP_BuyerRebate${index}`}>
                          {Data.buyer_rebate === false ? "No" : "Yes"}
                        </Col>
                      </Row>
                      <Row className="counterPartyCollapseDetails">
                        <Col span={1}></Col>
                        <Col span={5}>Backed by Insurance</Col>
                        <Col span={1}></Col>
                        <Col span={5} className="counterPartyValue" id={`summaryCP_InsuranceBacked${index}`}>
                          {Data.insurance_backed === false ? "No" : "Yes"}
                        </Col>
                        <Col span={1}></Col>
                        <Col span={5}> Buyer Rebate PCT</Col>
                        <Col span={1}></Col>
                        <Col span={5} className="counterPartyValue" id={`summaryCP_BuyerRebatePct${index}`}>
                          {Data.buyer_rebate_percent}
                        </Col>
                      </Row>
                      <Row className="counterPartyCollapseDetails">
                        <Col span={1}></Col>
                        <Col span={5}>Fee</Col>
                        <Col span={1}></Col>
                        <Col span={5} className="counterPartyValue" id={`summaryCP_Fee${index}`}>
                          {Data.fee}
                        </Col>
                        <Col span={1}></Col>
                        <Col span={5}></Col>
                        <Col span={1}></Col>
                        <Col span={5} className="counterPartyValue" id={`summaryCP${index}`}>

                        </Col>
                      </Row>
                    </> :
                    <>
                      <Row className="counterPartyCollapseDetails">
                        <Col span={1}></Col>
                        <Col span={5}>Fixed Rate/ Margin</Col>
                        <Col span={1}></Col>
                        <Col span={5} className="counterPartyValue" id={`summaryCP_Margin${index}`}>
                          {Data.margin}
                        </Col>
                        <Col span={1}></Col>
                        <Col span={5}>Interest Deduction Stage</Col>
                        <Col span={1}></Col>
                        <Col span={5} className="counterPartyValue" id={`summaryCP_InterestDeduction${index}`}>
                          {Data.interest_deduction === InterestDeduction.FINANCING ? "Financing" : Data.interest_deduction === InterestDeduction.REPAYMENT ? "Repayment" : Data.interest_deduction}
                        </Col>
                      </Row>
                      <Row className="counterPartyCollapseDetails">
                        <Col span={1}></Col>
                        <Col span={5}>Overdue Interest Rate</Col>
                        <Col span={1}></Col>
                        <Col span={5} className="counterPartyValue" id={`summaryCP_OverdueInterestRate${index}`}>
                          {Data.overdue_interest_rate}
                        </Col>
                        <Col span={1}></Col>
                        <Col span={5}>Backed by Insurance</Col>
                        <Col span={1}></Col>
                        <Col span={5} className="counterPartyValue" id={`summaryCP_InsuranceBacked${index}`}>
                          {Data.insurance_backed === false ? "No" : "Yes"}

                        </Col>
                      </Row>
                      <Row className="counterPartyCollapseDetails">
                        <Col span={1}></Col>
                        <Col span={5}>Fee</Col>
                        <Col span={1}></Col>
                        <Col span={5} className="counterPartyValue" id={`summaryCP_Fee${index}`}>
                          {Data.fee}
                        </Col>
                        <Col span={1}></Col>
                        <Col span={5}>Auto Finance Invoices</Col>
                        <Col span={1}></Col>
                        <Col span={5} className="counterPartyValue" id={`summaryCP_AutoFinanceInvoice${index}`}>
                          {Data.auto_finance ? Data.auto_finance === false ? "No" : "Yes" : "No"}

                        </Col>
                      </Row>
                      <Row className="counterPartyCollapseDetails">
                        <Col span={1}></Col>
                        <Col span={5}>Refund Interest during Early Repayment</Col>
                        <Col span={1}></Col>
                        <Col span={5} className="counterPartyValue" id={`summaryCP_RefundEarlyPay${index}`}>
                          {Data.refund_int_early_repay === false ? "No" : "Yes"}

                        </Col>
                        <Col span={1}></Col>
                        <Col span={5}></Col>
                        <Col span={1}></Col>
                        <Col span={5} className="counterPartyValue" id={`summaryCP${index}`}>

                        </Col>
                      </Row>

                    </>
                  }
                  {Data.attachments.file.length > 0 ?
                    <Row className="counterPartyCollapseDetails">
                      <Col span={1}></Col>
                      <Col span={5}>Attachments</Col>
                    </Row> : ""}
                  <Row gutter={24} className="counterPartyCollapseDetails">
                    <Col span={1}></Col>
                    {Data.attachments.file.map((value: any) => {
                      const splitedValue = value.file_path.split("/")
                      const lastValue = splitedValue.pop()
                      return (
                        <Col span={4} key={lastValue}>
                          <div className="fileAttachmentsText" >
                            <a href={`${imageBaseurl}${value.file_path}`} target="_blank" id={`summaryCP_images${index}`}>{lastValue}</a>
                          </div>
                        </Col>
                      )
                    })
                    }
                  </Row>
                </Panel>
              </Collapse>
            );
          })
        )}
      </div>
      <div className="SummaryContainer">
        <div className="SummaryLabel">Comment Section</div>
        <TextArea style={{ width: "50%", margin: "0px 10px", backgroundColor: "#FAFAFA" }} onChange={(e: any) => setCommentsvalue(e.target.value)} id="SummaryComment" />
      </div>
    </div>
  );
};
export default Summary;
