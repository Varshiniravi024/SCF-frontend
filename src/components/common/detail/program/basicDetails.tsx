import { Row, Col, Spin } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Currency } from "../../../api/base";
import imageBaseurl from "../../../../utils/config/url/image";
import httpClient from "../../../../utils/config/core/httpClient";
import baseurl from "../../../../utils/config/url/base"
import { allInterestRateType } from "../../../../redux/action";
import { InterestTypeField } from "../../function/dropdown_view";
import { InterestDeduction, InterestPaidBy, ProgramType } from "../../../../utils/enum/choices";
import CurrencyField from "../../function/currency";

interface IProps {
  flag: any;
  fromMenu: string;
  programData: any;
}

const BasicDetail = (props: React.PropsWithChildren<IProps>) => {
  const interest_Rate_Type_data = useSelector(allInterestRateType);
  const [currencyData, setCurrencyData] = useState([]);
  const [partyAccountDetails, setPartyAccountDetails] = useState([] as any)
  const program_detail = props.programData
  const basicDetails = program_detail?.record_datas ? program_detail?.record_datas?.values?.length > 0 ? program_detail?.record_datas?.values?.[0]?.fields : program_detail?.record_datas : program_detail?.record_datas

  const [isLoading, setIsLoading] = useState(false)
  const getCurrency = async () => {
    const data = await Currency()
    setCurrencyData(data)
  }
  const getRepaymentAccounts = () => {
    if (localStorage.getItem("user") === "Bank") {
      httpClient
        .getInstance()
        .get(`${baseurl}api-auth/party/party-accounts/${basicDetails?.repayment_account}/`)
        .then((resp: any) => {
          setPartyAccountDetails([resp.data.data])
        })
    } else {
      httpClient
        .getInstance()
        .get(`${baseurl}api-auth/party/party-accounts/`)
        .then((resp: any) => {
          setPartyAccountDetails(resp.data.data)
        })
    }
  }

  useEffect(() => {
    getCurrency();
    getRepaymentAccounts();
    setTimeout(()=>{
      setIsLoading(false)
    },2000)
  }, []);

  // const LimitCurrency = currencyData.map((item: any) => {
  //   if (item.id === basicDetails?.limit_currency) {
  //     return `${item.description} ${basicDetails?.max_limit_amount}`
  //   }
  // })
  // const MaxCurrency = currencyData.map((item: any) => {
  //   if (item.id === basicDetails?.max_invoice_currency) {
  //     return `${item.description} ${basicDetails?.max_invoice_amount}`
  //   }
  // })
  let repaymentCurrency = "" as any
  currencyData.map((item: any) => {
    partyAccountDetails.map((values: any, index: any) => {
      if (values.id === basicDetails?.repayment_account) {
        if (item.id === values?.currency) {
          repaymentCurrency = `${item.description} ${values.account_number}`
        }
      }
    })
  })
  const BasicDetailsData = program_detail?.record_datas?.values?.[0]?.fields?.program_type === ProgramType.RF ?
    [
      {
        label: "Seller Name",
        data: program_detail?.buyer_details?.[0]?.name,
        id: "program_sellerName"
      },
      {
        label: "Limit",
        data: <CurrencyField currencyvalue={basicDetails?.limit_currency} amount={basicDetails?.max_limit_amount} />,
        id: "program_limitAmount"
      },
      {
        label: "Expiry Date",
        data: basicDetails?.expiry_date,
        id: "program_expiryDate"
      }, {
        label: "Max Invoice Amount",
        data: <CurrencyField currencyvalue={basicDetails?.max_invoice_currency} amount={basicDetails?.max_invoice_amount} />,
        id: "program_maxInvoiceAmount"
      }, {
        label: "Max Invoice PCT",
        data: basicDetails?.max_invoice_percent,
        id: "program_maxInvoicePCT"
      },
      {
        label: "Max Tenor",
        data: basicDetails?.max_tenor,
        id: "program_maxTenor"
      },
      {
        label: "Grace Period",
        data: basicDetails?.grace_period,
        id: "program_gracePeriod"
      }, {
        label: "Interest Type",
        data: <InterestTypeField interestType={basicDetails?.interest_type} />,

        id: "program_interestType"
      }, {
        label: "Interest rate type",
        data: interest_Rate_Type_data?.payload?.interestRateType?.allInterestRateType.map((item: any) => {
          if (item.id === basicDetails?.interest_rate_type) {
            return item.description
          }
        }),
        id: "program_interestRateType"
      }, {
        label: "Fixed rate / Margin",
        data: basicDetails?.margin,
        id: "program_margin"
      },

      {
        label: "Repayment Account",
        data: repaymentCurrency,
        id: "program_repaymentAccount"
      },
      {
        label: "Overdue Interest Rate",
        data: basicDetails.overdue_interest_rate,
        id: "program_overdue_interest_rate"
      },
      {
        label: "Interest Deduction Stage",
        data: basicDetails.interest_deduction === InterestDeduction.FINANCING ? "Financing" : basicDetails.interest_deduction === InterestDeduction.REPAYMENT ? "Repayment" : basicDetails.interest_deduction,
        id: "program_interest_deduction_stage"
      },
      {
        label: "Auto Finance Invoices",
        data: basicDetails.auto_finance === true ? "Yes" : "No",
        id: "program_autoFinance_invoices"
      },
      {
        label: "Backed by Insurance",
        data: basicDetails.insurance_backed === true ? "Yes" : "No",
        id: "program_backed_insurance"
      },
      {
        label: "Fee",
        data: basicDetails.fee,
        id: "program_fee"
      },
      {
        label: "Refund Interest during Early Repayment",
        data: basicDetails.refund_int_early_repay === true ? "Yes" : "No",
        id: "program_refund_interest_early_repayment"
      }
    ]
    :
    [
      {
        label: "Buyer Name",
        data: program_detail?.buyer_details?.[0]?.name,
        id: "program_buyerName"
      },
      {
        label: "Limit",
        data: <CurrencyField currencyvalue={basicDetails?.limit_currency} amount={basicDetails?.max_limit_amount} />,
        id: "program_limitAmount"
      },
      {
        label: "Expiry Date",
        data: basicDetails?.expiry_date,
        id: "program_expiryDate"
      }, {
        label: "Max Invoice Amount",
        data: <CurrencyField currencyvalue={basicDetails?.max_invoice_currency} amount={basicDetails?.max_invoice_amount} />,
        id: "program_maxInvoiceAmount"
      }, {
        label: "Max Invoice PCT",
        data: basicDetails?.max_invoice_percent,
        id: "program_maxInvoicePCT"
      },
      {
        label: "Max Tenor",
        data: basicDetails?.max_tenor,
        id: "program_maxTenor"
      },
      {
        label: "Grace Period",
        data: basicDetails?.grace_period,
        id: "program_gracePeriod"
      }, {
        label: "Interest Type",
        data: <InterestTypeField interestType={basicDetails?.interest_type} />,
        id: "program_interestType"
      }, {
        label: "Interest rate type",
        data: interest_Rate_Type_data?.payload?.interestRateType?.allInterestRateType.map((item: any) => {
          if (item.id === basicDetails?.interest_rate_type) {
            return item.description
          }
        }),
        id: "program_interestRateType"
      }, {
        label: "Fixed rate / Margin",
        data: basicDetails?.margin,
        id: "program_margin"
      },
      {
        label: "Interest Paid By",
        data: basicDetails?.interest_paid_by !== null ? basicDetails?.interest_paid_by === InterestPaidBy.OWNPARTY ? "Ownparty" : basicDetails?.interest_paid_by === InterestPaidBy.COUNTERPARTY ? "Counterparty" : basicDetails?.interest_paid_by : "-",
        id: "program_interestPaidBy"
      },
      {
        label: "Overdue Interest Rate",
        data: basicDetails.overdue_interest_rate,
        id: "program_overdue_interest_rate"
      },
      {
        label: "Interest Deduction Stage",
        data: basicDetails.interest_deduction === InterestDeduction.FINANCING ? "Financing" : basicDetails.interest_deduction === InterestDeduction.REPAYMENT ? "Repayment" : basicDetails.interest_deduction,
        id: "program_interest_deduction_stage"
      },
      {
        label: "Repayment Account",
        data: repaymentCurrency,
        id: "program_repaymentAccount"
      },
      {
        label: "Allow Invoice upload by buyer",
        data: basicDetails?.buyer_details?.[0]?.self_invoice_upload === false ? "No" : "Yes",
        id: "program_uploadByBuyer"
      },
      {
        label: "Auto Debit for Invoices not financed",
        data: basicDetails.auto_debit_invoice === true ? "Yes" : "No",
        id: "program_autodebit_invoices_notFinanced"
      },
      {
        label: "Allow Rebate for Buyer",
        data: basicDetails.buyer_rebate === true ? "Yes" : "No",
        id: "program_rebate_buyer"
      },
      {
        label: "Buyer Rebate PCT",
        data: basicDetails.buyer_rebate_percent,
        id: "program_buyer_rebate_pct"
      },
      {
        label: "Backed by Insurance",
        data: basicDetails.insurance_backed === true ? "Yes" : "No",
        id: "program_backed_insurance"
      },
      {
        label: "Fee",
        data: basicDetails.fee,
        id: "program_fee"
      }
    ]
  return isLoading ? <Spin /> : (
    <div>
      <h3>Basic Details</h3>
      <Row gutter={24}>
        <Col span={12}>
          {BasicDetailsData.map((datas: any, index: number) => {
            return (
              <Row key={index}>
                <Col span={12} className="SummaryLabel">
                  {datas.label}
                </Col>
                <Col span={12} className="SummaryDesc" id={datas.id} style={{ textTransform: "capitalize" }}>
                  {datas.data}
                </Col>
              </Row>
            )
          })}
        </Col>
        <Col span={12}>
          <div className="UploadCardContainer">
            <div className="pdfImageContainer">
              {program_detail?.attachments !== null ?
                program_detail?.attachments?.program_attachments.map((file: any, index: number) => {
                  const splitedValue = file.file_path.split("/")
                  const lastValue = splitedValue.pop()
                  return (
                    <div key={index} style={{ border: '1px dashed #006666', borderRadius: '5px', alignItems: 'center', width: '100px', height: '130px', position: 'relative', padding: 10, paddingRight: 5 }}>
                      <img src={`${imageBaseurl}${file.file_path}`}
                        style={{ objectFit: 'cover', width: '45px', height: '60px', position: 'absolute', top: 20 }} alt="file" />
                      <p style={{ position: 'absolute', bottom: 0, fontSize: 12, color: '#006666' }}>
                        <a href={`${imageBaseurl}${file.file_path}`} target="_blank" style={{ color: '#006666' }}> {lastValue}</a>
                      </p>
                    </div>
                  )
                })
                : ""}
            </div>
          </div>
        </Col>
      </Row>
    </div>
  );
};
export default BasicDetail;