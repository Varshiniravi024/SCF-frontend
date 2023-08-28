import React, { useEffect, useState } from "react";
import { Row, Col, Collapse } from "antd";
import { useSelector } from "react-redux";

import httpClient from "../../../../utils/config/core/httpClient";
import baseurl from "../../../../utils/config/url/base";
import imageBaseurl from "../../../../utils/config/url/image"
import images from "../../../../assets/images";
import { allInterestType, allInterestRateType } from "../../../../redux/action";
import { InterestDeduction, InterestPaidBy, ProgramType } from "../../../../utils/enum/choices";
import CurrencyField from "../../function/currency";

interface IProps {
  flag: any;
  fromMenu: string;
  programData: any;
}
const CounterPartyDetail = (props: React.PropsWithChildren<IProps>) => {
  const program_detail = props.programData;
  const { Panel } = Collapse;
  const { CollapseCloseIcon, CollapseOpenIcon } = images;
  const interest_Type_data = useSelector(allInterestType);
  const interest_Rate_Type_data = useSelector(allInterestRateType);
  const [counterPartyList, setCounterPartyList] = useState([]);
  const [file, setFile] = useState([]);
  useEffect(() => {
    if (program_detail) {
      let id = "";
      if (props.flag === "historyDetail") {
        id = program_detail.work_model.t_id;
        httpClient
          .getInstance()
          .get(`${baseurl}api/pairing/?pg_id=${id}`)
          .then((resp: any) => {
            setCounterPartyList(resp.data.data);
            if (resp.data.data.length > 0) {
              httpClient
                .getInstance()
                .get(`${baseurl}api/resource/file/?pairing=${resp.data.data[0].id}`)
                .then((resp: any) => {
                  setFile(resp.data.data);
                });
            }
          });
      }
      if (program_detail.record_datas.values) {
        id = program_detail.work_model.t_id;
      } else {
        id = program_detail.work_model.t_id;
      }
      httpClient
        .getInstance()
        .get(`${baseurl}api/pairing/?pg_id=${id}`)
        .then((resp: any) => {
          setCounterPartyList(resp.data.data);
        });
    }
  }, []);

  return (
    <div>
      <h3>Counterparty List</h3>
      <Row className="counterPartyHeaderDetails">
        <Col span={8}>Counterparty Name</Col>
        <Col span={8}>City</Col>
        <Col span={8}>Limit</Col>
      </Row>

      {counterPartyList && counterPartyList.map((party: any, index: number) => {
        return (
          program_detail && program_detail.pairings.map((Data: any, index: number) => {
            if (party.id === Data.id) {
              const partyData = [
                {
                  label1: "Limit",
                  value1: <CurrencyField currencyvalue={Data.limit_currency_id} amount={Data.max_limit_amount} />,
                  id1: "cp_limitAmount",
                  label2: "Expiry Date",
                  value2: Data.expiry_date,
                  id2: "cp_expiryDate"
                },
                {
                  label1: "Max Invoice Amount",
                  value1: <CurrencyField currencyvalue={Data.max_invoice_currency_id} amount={Data.max_invoice_amount} />,
                  id1: "cp_maxInvoiceAmount",
                  label2: "Max Invoice PCT",
                  value2: Data.max_invoice_percent,
                  id2: "cp_maxInvoicePCT"
                },
                {
                  label1: "Grace Period",
                  value1: Data.grace_period,
                  id1: "cp_gracePeriod",
                  label2: "Max Tenor",
                  value2: Data.max_tenor,
                  id2: "cp_maxTenor",

                },
                {
                  label1: "Interest Rate Type",
                  value1: interest_Rate_Type_data?.payload?.interestRateType?.allInterestRateType.map((item: any) => {
                    if (Data.interest_type_id === 1) {
                      return "-"
                    } else if (item.id === Data.interest_rate_type_id) {
                      return item.description
                    }
                  }),
                  id1: "cp_interestRateType",
                  label2: "Interest Type",
                  value2: interest_Type_data?.payload?.interestType?.allInterestType.map((item: any) => {
                    if (item.id === Data.interest_type_id) {
                      return item.description
                    }
                  }),
                  id2: "cp_interestType"
                },
                {
                  label1: "Fixed Rate/ Margin",
                  value1: Data.margin,
                  id1: "cp_margin",
                  label2: program_detail?.record_datas?.values?.[0]?.fields?.program_type === ProgramType.RF ? "Interest Deduction Stage" : "Interest Paid By",
                  value2: program_detail?.record_datas?.values?.[0]?.fields?.program_type === ProgramType.RF ? Data.interest_deduction === InterestDeduction.FINANCING ? "Financing" : Data.interest_deduction === InterestDeduction.REPAYMENT ? "Repayment" : Data.interest_deduction : Data.interest_paid_by !== null ? Data.interest_paid_by === InterestPaidBy.OWNPARTY ? "Ownparty" : Data?.interest_paid_by === InterestPaidBy.COUNTERPARTY ? "Counterparty" : Data?.interest_paid_by : "-",
                  id2: program_detail?.record_datas?.values?.[0]?.fields?.program_type === ProgramType.RF ? "cp_interest_deduction" : "cp_interestPaidBy",
                },
                {
                  label1: program_detail?.record_datas?.values?.[0]?.fields?.program_type === ProgramType.RF ? "Overdue Interest Rate" : "Overdue Interest Rate",
                  value1: program_detail?.record_datas?.values?.[0]?.fields?.program_type === ProgramType.RF ? Data?.overdue_interest_rate : Data?.overdue_interest_rate,
                  id1: program_detail?.record_datas?.values?.[0]?.fields?.program_type === ProgramType.RF ? "cp_overdue_interest_rate" : "cp_overdue_interest_rate",
                  label2: program_detail?.record_datas?.values?.[0]?.fields?.program_type === ProgramType.RF ? "Backed by Insurance" : "Interest Deduction Stage",
                  value2: program_detail?.record_datas?.values?.[0]?.fields?.program_type === ProgramType.RF ? Data.insurance_backed === true ? "Yes" : "No" : Data.interest_deduction === InterestDeduction.FINANCING ? "Financing" : Data.interest_deduction === InterestDeduction.REPAYMENT ? "Repayment" : Data.interest_deduction,
                  id2: program_detail?.record_datas?.values?.[0]?.fields?.program_type === ProgramType.RF ? "cp_backed_insurance" : "cp_interest_deduction",
                },
                {
                  label1: program_detail?.record_datas?.values?.[0]?.fields?.program_type === ProgramType.RF ? "Fee" : "Auto Debit for Invoices not financed",
                  value1: program_detail?.record_datas?.values?.[0]?.fields?.program_type === ProgramType.RF ? Data.fee : Data.auto_debit_invoice === true ? "Yes" : "No",
                  id1: program_detail?.record_datas?.values?.[0]?.fields?.program_type === ProgramType.RF ? "cp_fee" : "cp_autodebit_invoices_notFinanced",
                  label2: program_detail?.record_datas?.values?.[0]?.fields?.program_type === ProgramType.RF ? "" : "Allow Rebate for Buyer",
                  value2: program_detail?.record_datas?.values?.[0]?.fields?.program_type === ProgramType.RF ? "" : Data.buyer_rebate === true ? "Yes" : "No",
                  id2: program_detail?.record_datas?.values?.[0]?.fields?.program_type === ProgramType.RF ? "" : "cp_allow_rebate_buyer",
                },
                {
                  label1: program_detail?.record_datas?.values?.[0]?.fields?.program_type === ProgramType.RF ? "Auto Finance Invoices" : "Buyer Rebate PCT",
                  value1: program_detail?.record_datas?.values?.[0]?.fields?.program_type === ProgramType.RF ? Data.auto_finance === true ? "Yes" : "No" : Data.buyer_rebate_percent,
                  id1: program_detail?.record_datas?.values?.[0]?.fields?.program_type === ProgramType.RF ? "cp_autofinance_invoices" : "cp_buyer_rebate_pct",
                  label2: program_detail?.record_datas?.values?.[0]?.fields?.program_type === ProgramType.RF ? "Refund Interest during Early Repayment" : "Backed by Insurance",
                  value2: program_detail?.record_datas?.values?.[0]?.fields?.program_type === ProgramType.RF ? Data.refund_int_early_repay === true ? "Yes" : "No" : Data.insurance_backed === true ? "Yes" : "No",
                  id2: program_detail?.record_datas?.values?.[0]?.fields?.program_type === ProgramType.RF ? "cp_refund_interest_early_repayment" : "cp_backed_insurance",
                },
                {
                  label1: program_detail?.record_datas?.values?.[0]?.fields?.program_type === ProgramType.RF ? "" : "Fee",
                  value1: program_detail?.record_datas?.values?.[0]?.fields?.program_type === ProgramType.RF ? "" : Data.fee,
                  id1: program_detail?.record_datas?.values?.[0]?.fields?.program_type === ProgramType.RF ? "" : "cp_fee",
                  label2: program_detail?.record_datas?.values?.[0]?.fields?.program_type === ProgramType.RF ? "" : "",
                  value2: program_detail?.record_datas?.values?.[0]?.fields?.program_type === ProgramType.RF ? "" : "",
                  id2: program_detail?.record_datas?.values?.[0]?.fields?.program_type === ProgramType.RF ? "" : "",
                }
              ]
              return (
                <Collapse accordion className="counterPartyDetails" key={index}
                  expandIcon={({ isActive }) => isActive ? <img src={CollapseOpenIcon} alt="collapseIcon" id={`cp_CollapseOpen${index}`} /> : <img src={CollapseCloseIcon} alt="collapseIcon" id={`cp_CollapseClose${index}`} />}>
                  <Panel
                    header={
                      <Row>
                        <Col span={8} id={`cp_counterpartyId${index}`}>{party.counter_party_name}</Col>
                        <Col span={8} id={`cp_City${index}`}>{party.city}</Col>
                        <Col span={8} id={`cp_MaxLimitAmount${index}`}>{Data.max_limit_amount}</Col>
                      </Row>
                    }
                    key="1"
                  >
                    {partyData.map((item: any, idx: number) => {
                      return (
                        <Row className="counterPartyCollapseDetails" key={idx} >
                          <Col span={1}></Col>
                          <Col span={5}>{item.label1}</Col>
                          <Col span={1}></Col>
                          <Col span={5} className="counterPartyValue" id={`${item.id1}${index}`}>
                            {item.value1}
                          </Col>
                          <Col span={1}></Col>
                          <Col span={5}>{item.label2}</Col>
                          <Col span={1}></Col>
                          <Col span={5} className="counterPartyValue" id={`${item.id2}${index}`}>
                            {item.value2}
                          </Col>
                          <Col span={1}></Col>
                        </Row>
                      )
                    })}

                    {party.attachments.file.length > 0 ? (
                      <Row className="counterPartyCollapseDetails">
                        <Col span={1}></Col>
                        <Col span={5}>Attachments</Col>
                      </Row>
                    ) : (
                      ""
                    )}
                    <Row gutter={24} className="counterPartyCollapseDetails">
                      <Col span={1}></Col>
                      {party.attachments.file.map((value: any, index: number) => {
                        const splitedValue = value.file_path.split("/");
                        const lastValue = splitedValue.pop();
                        return (
                          <Col span={4} key={lastValue}>
                            <div className="fileAttachmentsText">
                              <a href={`${imageBaseurl}${value.file_path}`} target="_blank" id={`summaryCP_images${index}`}>{lastValue}</a>
                            </div>
                          </Col>
                        );
                      })}
                    </Row>
                  </Panel>
                </Collapse>
              );
            }

          })
        )
      })}
    </div>
  );
};
export default CounterPartyDetail;
