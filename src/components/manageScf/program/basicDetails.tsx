import React, { useState, useEffect } from "react";
import { Form, Input, Button, Row, Col, Select, message, DatePicker, Spin, } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  program_Basicdetails, program_counterpartydetails, allCurrency,allInterestType,allInterestRateType
} from "../../../redux/action";
import { UploadImage } from "../../common/UploadImage/Uploadimage";
import { InterestType } from "../../api/base";
import { DropdownField } from "../../common/function/dropdown";
import { CheckboxField } from "../../common/function/checkbox";
import httpClient from "../../../utils/config/core/httpClient";
import baseurl from "../../../utils/config/url/base";
import images from "../../../assets/images";
import moment from "moment";
import "../manageScf.scss";
import { ErrorMessage, FieldErrorMessages } from "../../../utils/enum/messageChoices";
import { InputPatterns } from "../../../utils/validators/inputPattern";
import { Action, InterestPaidBy, ProgramType, ResponseStatus } from "../../../utils/enum/choices";
import { InterestDeduction, InterestPaidByData } from "../../../utils/validators/dropdown";

interface IProps {
  nextpage: any;
  programData: any;
  // Pdatas: any
}

interface BasicDetails {
  id: number;
  max_limit_amount: number;
  limit_currency: string;
  expiry_date: any;
  max_invoice_currency: string;
  max_invoice_amount: number;
  max_invoice_percent: number;
  max_tenor: number;
  grace_period: number;
  interest_type: string;
  interest_rate_type: string;
  margin: number;
  comments: string;
  workflowitems: {
    interim_state: string;
  }
  repayment_account_currency: string;
  attachments: any;
  work_model: {
    t_id: ""
  },
  interest_paid_by: any,
  buyer_details: [
    {
      self_invoice_upload: boolean
    }
  ],
  repayment_account: {
    account_number: "",
    currency: ""
  },
  interest_deduction: "",
  overdue_interest_rate: "",
  buyer_rebate: boolean,
  auto_debit_invoice: boolean,
  insurance_backed: any,
  buyer_rebate_percent: any,
  fee: null | any,
  auto_finance: boolean,
  refund_int_early_repay: boolean
}

const BasicDetailsForm = (props: React.PropsWithChildren<IProps>) => {
  // console.log("props",props)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { DropdownIcon, DatePickerImg } = images;
  const program_basicdetail_data = useSelector(program_Basicdetails)
  const Currency_Data = useSelector(allCurrency);
  const InterestType_Data = useSelector(allInterestType);
  const InterestRatetype_Data = useSelector(allInterestRateType);
  // console.log("program_basicdetail_data payload",program_basicdetail_data)
  // console.log("program_basicdetail_data payload",program_basicdetail_data.payload.programBasicdetailsData)
  const basicValues = program_basicdetail_data.payload.programBasicdetailsData
  // const basicDetailsDatacontainer = useSelector(basicDetails);
  // const basicDetailsDatas = basicDetailsDatacontainer?.payload?.basicDetailsData
  // console.log("payload basicDetailsDatas",basicDetailsDatas)
  // console.log("payload basicDetailsDatas",basicDetailsDatas?.payload?.basicDetailsData)
  //   let basicDtsData = basicDetailsDatas && basicDetailsDatas?.payload?.basicDetailsData;
  const [BasicDetailsInfo, setBasicDetailsInfo] = useState<BasicDetails>(
    {} as BasicDetails
  );
  // const BasicDetailsInfo = basicDetailsDatas && basicDetailsDatas?.payload?.basicDetailsData;
  const [fileList, setFileList] = useState([] as any);
  const [interestType, setInterestType] = useState(basicValues?.interest_type ? basicValues?.interest_type : "" as any);
  const [currencyList, SetCurrencyList] = useState([]);
  const [disableButton, setDisableButton] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [maxInvoiceAmtValue, setMaxInvoiceAmtValue] = useState(basicValues ? basicValues?.max_invoice_amount : "" as any)
  const [maxInvoiceAmtError, setMaxInvoiceAmtError] = useState(false)
  const [gracePeriodValue, setGracePeriodValue] = useState(basicValues ? basicValues?.grace_period : "")
  const [gracePeriodError, setgracePeriodError] = useState(false)
  const [maxInvoicePctError, setMaxInvoicePctError] = useState(false)
  const [limitAmount, setLimitAmount] = useState(basicValues
    ? basicValues?.max_limit_amount
    : "" as any)
  const [maxTenorAmount, setMaxTenorAmount] = useState("")
  const disableButtonValue = basicValues ? basicValues?.workflowitems ? basicValues?.workflowitems.interim_state : "" : "";
  const basedOnStatusValue = disableButtonValue === "AWAITING_APPROVAL" ? true : disableButtonValue === "AWAITING_SIGN_A" ? true : disableButtonValue === "AWAITING_SIGN_B" ? true : false
  const [disableButtonBasedStatus, setDisableButtonBasedStatus] = useState(basedOnStatusValue);
  const [maxInvoicePctValue, setMaxInvoicePctValue] = useState("")
  const [interestRateType, setInterestRateType] = useState(null)
  const [interestTypeData, setInterestTypeData] = useState('');
  const [PartyAccountDetails, setPartyAccountDetails] = useState([])
  const [PartyAccountCurrencyDetails, setPartyAccountCurrencyDetails] = useState("")
  const [uploadBuyer, setUploadBuyer] = useState(basicValues?.buyer_details?.[0]?.self_invoice_upload ? basicValues?.buyer_details?.[0]?.self_invoice_upload : false)
  const [partyAccountId, setPartyAccountId] = useState("");
  const [autoFinanceDebit, setAutoFinanceDebit] = useState(false)
  const [autoFinanceInvoice, setAutoFinanceInvoice] = useState(false)
  const [backedInsurance, setBackedInsurance] = useState(basicValues ? basicValues?.insurance_backed : false)
  const [rebateBuyer, setRebateBuyer] = useState(basicValues ? basicValues?.buyer_rebate : false)
  const [refundEarlyPay, setRefundEarlyPay] = useState(false)
  const [intDeduction, setIntDeduction] = useState("")


  const [limitCurrency, setLimitCurrency] = useState(null)
  const [maxInvoiceCurrency, setMaxInvoiceCurrency] = useState(null)
  const [interestPaidBy, setInterestPaidBy] = useState(basicValues?.interest_paid_by)

  const [currencyError, setCurrencyError] = useState(false);
  const [invoiceCurrencyError, setInvoiceCurrencyError] = useState(false);
  const [interestTypeError, setInterestTypeError] = useState(false);
  const [interestRateTypeError, setInterestRateTypeError] = useState(false);


  const { Option } = Select;
  const { TextArea } = Input;

  const onFinish = (values: any) => {
    setDisableButton(true);
    let programType = "";
    if (props?.programData?.record_datas) {
      programType = props?.programData?.record_datas.values[0].fields.program_type;
    } else {
      programType = props?.programData?.program;
    }

    const partyId = localStorage.getItem("party_id")
    let body;
    // if (((interestType === "FLOATING" || interestType === "Floating" || interestType === 2) && interestRateType === null) || ((interestType === "FLOATING" || interestType === "Floating" || interestType === 2) && values.interest_rate_type === null)) {
    //   message.error(ErrorMessage.PSIRT, 3)
    //   setDisableButton(false)
    // } else {
    if (localStorage.getItem("user") === "Bank") {
      console.log("values", values)
      // body = {
      //   program_type: props?.programData?.record_datas
      //     ? props?.programData?.record_datas?.values?.[0]?.fields?.program_type
      //     : props?.programData?.program_type ? props?.programData?.program_type : props?.programData,
      //   finance_request_type: "AUTOMATIC",
      //   limit_currency: values.limit_currency,
      //   max_limit_amount: parseInt(values.limit_amount),
      //   expiry_date: moment(values.expiry_date._d).format("YYYY-MM-DD"),
      //   max_invoice_currency: values.max_invoice_currency,
      //   max_invoice_amount: maxInvoiceAmtValue ? maxInvoiceAmtValue : parseInt(values.max_invoice_amount),
      //   max_invoice_percent: maxInvoicePctValue ? maxInvoicePctValue : parseInt(values.max_invoice_percent),
      //   max_tenor: parseInt(values.max_tenor),
      //   grace_period: gracePeriodValue ? gracePeriodValue : parseInt(values.grace_period),
      //   interest_type: interestType === "Fixed" ? 1 : interestType === "FIXED" ? 1 : interestType === "FLOATING" ? 2 : interestType === "Floating" ? 2 : interestType,
      //   interest_rate_type: interestType === "Fixed" || interestType === 1 ? null : interestRateType,
      //   margin: parseFloat(values.margin),
      //   comments: values.comments,
      //   upload_by_buyer: uploadBuyer ? uploadBuyer : values.upload_by_buyer,
      //   interest_paid_by: values.interest_paid_by ? values.interest_paid_by : interestPaidBy,
      //   party_id: partyId,
      //   repayment_account: partyAccountId,
      //   interest_deduction: interestPaidBy === InterestPaidBy.OWNPARTY || values.interest_deduction === InterestPaidBy.OWNPARTY ? "REPAYMENT" : intDeduction ? intDeduction : values.interest_deduction,
      //   buyer_rebate: rebateBuyer ? rebateBuyer !== undefined ? rebateBuyer : false : values.buyer_rebate !== undefined ? values.buyer_rebate : false,
      //   buyer_rebate_percent: 
      //   // rebateBuyer === false || values.buyer_rebate === false 
      //   // // || values.buyer_rebate === undefined || rebateBuyer === undefined 
      //   // ? 0 : 
      //   values.buyer_rebate_percent ? parseFloat(values.buyer_rebate_percent) : 0,
      //   // buyer_rebate_percent: rebateBuyer === false || values.buyer_rebate === false || values.buyer_rebate === undefined || rebateBuyer === undefined ? 0 : values.buyer_rebate_percent ? parseFloat(values.buyer_rebate_percent) : 0,
      //   overdue_interest_rate: values.overdue_interest_rate ? values.overdue_interest_rate : 0,
      //   refund_int_early_repay: refundEarlyPay,
      //   auto_debit_invoice: autoFinanceDebit,
      //   insurance_backed: backedInsurance,
      //   fee: values.fee !== null ? backedInsurance === false ? null : values.fee : null,
      //   auto_finance: autoFinanceInvoice,
      // };
      body = {
        program_type:
          //  basicValues?.program_type,
          props?.programData?.record_datas
            ? props?.programData?.record_datas?.values?.[0]?.fields?.program_type
            : props?.programData?.program_type ? props?.programData?.program_type : props?.programData,
        finance_request_type: "AUTOMATIC",
        limit_currency: values.limit_currency ? values.limit_currency : limitCurrency,
        max_limit_amount: limitAmount ? limitAmount : parseInt(values.limit_amount),
        expiry_date:
          // values.expiry_date !== "" ||
          values?.expiry_date !== undefined ? moment(values?.expiry_date?._d).format("DD-MM-YYYY") : moment(basicValues?.expiry_date).format("DD-MM-YYYY"),
        max_invoice_currency: values.max_invoice_currency ? values.max_invoice_currency : maxInvoiceCurrency,
        max_invoice_amount: maxInvoiceAmtValue ? maxInvoiceAmtValue : parseInt(values.max_invoice_amount),
        max_invoice_percent: maxInvoicePctValue ? maxInvoicePctValue : parseInt(values.max_invoice_percent),
        max_tenor: parseInt(values.max_tenor),
        grace_period: gracePeriodValue ? gracePeriodValue : parseInt(values.grace_period),
        interest_type: interestType === "Fixed" ? 1 : interestType === "FIXED" ? 1 : interestType === "FLOATING" ? 2 : interestType === "Floating" ? 2 : interestType,
        interest_rate_type: interestType === "Fixed" || interestType === 1 ? null : interestRateType ? interestRateType : values.interest_rate_type === "Euribor" ? 1 : values.interest_rate_type === "Libor" ? 2 : values.interest_rate_type === "Sofr" ? 3 : values.interest_rate_type,
        margin: parseFloat(values.margin),
        comments: values.comments,
        upload_by_buyer: uploadBuyer ? uploadBuyer : values.upload_by_buyer === "" ? false : values.upload_by_buyer,
        interest_paid_by: interestPaidBy ? interestPaidBy : values.interest_paid_by,
        repayment_account: partyAccountId ? partyAccountId : basicValues?.repayment_account?.id,
        interest_deduction: interestPaidBy === InterestPaidBy.OWNPARTY || values.interest_deduction === InterestPaidBy.OWNPARTY ? "REPAYMENT" : intDeduction ? intDeduction : values.interest_deduction,
        buyer_rebate: rebateBuyer ? rebateBuyer !== undefined ? rebateBuyer : false : values.buyer_rebate !== undefined ? values.buyer_rebate : false,
        buyer_rebate_percent: rebateBuyer === false || values.buyer_rebate === false
          // || values.buyer_rebate === undefined || rebateBuyer === undefined 
          ? 0 : values.buyer_rebate_percent ? parseFloat(values.buyer_rebate_percent) : 0,
        // buyer_rebate_percent: rebateBuyer === false || values.buyer_rebate === false || values.buyer_rebate === undefined || rebateBuyer === undefined ? 0 : values.buyer_rebate_percent ? parseFloat(values.buyer_rebate_percent) : 0,
        overdue_interest_rate: values.overdue_interest_rate,
        refund_int_early_repay: refundEarlyPay,
        auto_debit_invoice: autoFinanceDebit,
        insurance_backed: backedInsurance,
        fee: values.fee !== "" || values.fee !== null ? backedInsurance === false ? null : values.fee !== "" ? values.fee : null : null,
        auto_finance: autoFinanceInvoice,
      };

    } else {
      body = {
        program_type:
          //  basicValues?.program_type,
          props?.programData?.record_datas
            ? props?.programData?.record_datas?.values?.[0]?.fields?.program_type
            : props?.programData?.program_type ? props?.programData?.program_type : props?.programData,
        finance_request_type: "AUTOMATIC",
        limit_currency: values.limit_currency ? values.limit_currency : limitCurrency,
        max_limit_amount: limitAmount ? limitAmount : parseInt(values.limit_amount),
        expiry_date:
          // values.expiry_date !== "" ||
          values?.expiry_date !== undefined ? moment(values?.expiry_date?._d).format("DD-MM-YYYY") : moment(basicValues?.expiry_date).format("DD-MM-YYYY"),
        max_invoice_currency: values.max_invoice_currency ? values.max_invoice_currency : maxInvoiceCurrency,
        max_invoice_amount: maxInvoiceAmtValue ? maxInvoiceAmtValue : parseInt(values.max_invoice_amount),
        max_invoice_percent: maxInvoicePctValue ? maxInvoicePctValue : parseInt(values.max_invoice_percent),
        max_tenor: parseInt(values.max_tenor),
        grace_period: gracePeriodValue ? gracePeriodValue : parseInt(values.grace_period),
        interest_type: interestType === "Fixed" ? 1 : interestType === "FIXED" ? 1 : interestType === "FLOATING" ? 2 : interestType === "Floating" ? 2 : interestType,
        interest_rate_type: interestType === "Fixed" || interestType === 1 ? null : interestRateType ? interestRateType : values.interest_rate_type === "Euribor" ? 1 : values.interest_rate_type === "Libor" ? 2 : values.interest_rate_type === "Sofr" ? 3 : values.interest_rate_type,
        margin: parseFloat(values.margin),
        comments: values.comments,
        upload_by_buyer: uploadBuyer ? uploadBuyer : values.upload_by_buyer === "" ? false : values.upload_by_buyer,
        interest_paid_by: interestPaidBy ? interestPaidBy : values.interest_paid_by,
        repayment_account: partyAccountId ? partyAccountId : basicValues?.repayment_account?.id,
        interest_deduction: interestPaidBy === InterestPaidBy.OWNPARTY || values.interest_deduction === InterestPaidBy.OWNPARTY ? "REPAYMENT" : intDeduction ? intDeduction : values.interest_deduction,
        buyer_rebate: rebateBuyer ? rebateBuyer !== undefined ? rebateBuyer : false : values.buyer_rebate !== undefined ? values.buyer_rebate : false,
        buyer_rebate_percent: rebateBuyer === false || values.buyer_rebate === false
          // || values.buyer_rebate === undefined || rebateBuyer === undefined 
          ? 0 : values.buyer_rebate_percent ? parseFloat(values.buyer_rebate_percent) : 0,
        // buyer_rebate_percent: rebateBuyer === false || values.buyer_rebate === false || values.buyer_rebate === undefined || rebateBuyer === undefined ? 0 : values.buyer_rebate_percent ? parseFloat(values.buyer_rebate_percent) : 0,
        overdue_interest_rate: values.overdue_interest_rate,
        refund_int_early_repay: refundEarlyPay,
        auto_debit_invoice: autoFinanceDebit,
        insurance_backed: backedInsurance,
        fee: values.fee !== "" || values.fee !== null ? backedInsurance === false ? null : values.fee !== "" ? values.fee : null : null,
        auto_finance: autoFinanceInvoice,
      };
      console.log("body", body)

    }
    console.log("basic values", basicValues)
    if (basicValues && basicValues?.work_model) {
      console.log("if program", body)
      httpClient
        .getInstance()
        .put(`${baseurl}api/program/${basicValues.work_model.t_id}/`, body)
        .then((resp: any) => {
          if (resp.data.status !== ResponseStatus.FAILURE) {
            setDisableButton(false)
            message.success(ErrorMessage.SB);
            localStorage.setItem("program_id", resp.data.data.id);
            localStorage.setItem("program_t_id", resp.data.data.id)
            setBasicDetailsInfo(resp.data.data);
            getProgramDetails(resp.data.data)
            dispatch(
              program_counterpartydetails(null)
            )
            // dispatch(
            //   basicDetails({
            //     basicDetails: resp.data.data,
            //   })
            // );
            // storingProgramData(resp.data.data)

            props.nextpage("2");
            if (fileList.length > 0) {
              const formdata = new FormData();
              fileList.map((item: any, index: any) => {
                formdata.append(`files`, item[0]);
                formdata.append(`comments`, "programfile");
              });
              formdata.append("program", resp.data.data.id.toString());

              httpClient
                .getInstance()
                .post(`${baseurl}api/resource/file/`, formdata)
                // .then((response: any) => {
                // });
            }
          } else {
            message.error(resp.data.data[0]);
            setDisableButton(false)
          }
        })
        .catch((error) => {
          setDisableButton(false)
        })
    } else if (basicValues && basicValues?.id) {
      // bank login - modify
      console.log("if else program", body)
      httpClient
        .getInstance()
        .put(`${baseurl}api/program/${basicValues.id}/`, body)
        .then((resp: any) => {
          if (resp.data.status !== ResponseStatus.FAILURE) {
            setDisableButton(false)
            message.success(ErrorMessage.SB);
            localStorage.setItem("program_id", resp.data.data.id);
            localStorage.setItem("program_t_id", resp.data.data.id)
            setBasicDetailsInfo(resp.data.data);
            getProgramDetails(resp.data.data)
            dispatch(
              program_counterpartydetails(null)
            )
            // dispatch(
            //   basicDetails({
            //     basicDetails: resp.data.data,
            //   })
            // );
            // storingProgramData(resp.data.data)

            props.nextpage("2");
            if (fileList.length > 0) {
              const formdata = new FormData();
              fileList.map((item: any, index: any) => {
                formdata.append(`files`, item[0]);
                formdata.append(`comments`, "programfile");
              });
              formdata.append("program", resp.data.data.id.toString());

              httpClient
                .getInstance()
                .post(`${baseurl}api/resource/file/`, formdata)
                // .then((response: any) => {
                // });
            }
          } else {
            message.error(resp.data.data);
            setDisableButton(false)
          }
        })
        .catch((error) => {
          setDisableButton(false)
        })
    }
    else {
      console.log("else program", body)
      httpClient
        .getInstance()
        .post(`${baseurl}api/program/`, body)
        .then((resp: any) => {

          if (resp.data.status !== ResponseStatus.FAILURE) {
            setDisableButton(false)
            message.success(ErrorMessage.SB);
            localStorage.setItem("program_id", resp.data.data.id);
            localStorage.setItem("program_t_id", resp.data.data.id)
            dispatch(
              program_counterpartydetails(null)
            )
            setBasicDetailsInfo(resp.data.data);
            getProgramDetails(resp.data.data)
            // dispatch(
            //   basicDetails({
            //     basicDetails: resp.data.data,
            //   })
            // );
            // storingProgramData(resp.data.data)

            props.nextpage("2");
            if (fileList.length > 0) {
              const formdata = new FormData();
              fileList.map((item: any, index: any) => {
                formdata.append(`files`, item[0]);
                formdata.append(`comments`, "programfile");
              });
              formdata.append("program", resp.data.data.id.toString());

              httpClient
                .getInstance()
                .post(`${baseurl}api/resource/file/`, formdata)
                // .then((response: any) => {
                // });
            }
          } else {
            message.error(ErrorMessage.PFCD);
            setDisableButton(false)
          }
        }).catch((error) => {
          setDisableButton(false)
        })
    }
    // }
  };

  const onFinishFailed = (errorInfo: any) => {
    message.error(ErrorMessage.PFD);
  };

  const onClickprevious = () => {
    navigate("/ManageScf");
  };
  const getInterestType = async () => {
    const data = await InterestType()
    setInterestTypeData(data)

  }
  useEffect(() => {
    console.log("effect")
    httpClient
      .getInstance()
      .get(`${baseurl}api-auth/party/party-accounts/`)
      .then((resp: any) => {
        setPartyAccountDetails(resp.data.data)
        setIsLoading(false)
      })

      const disableButtonValue = BasicDetailsInfo ? BasicDetailsInfo.workflowitems ? BasicDetailsInfo.workflowitems.interim_state : "" : "";
      const basedOnStatusValue = disableButtonValue === "AWAITING_APPROVAL" ? true : disableButtonValue === "AWAITING_SIGN_A" ? true : disableButtonValue === "AWAITING_SIGN_B" ? true : false
    setTimeout(() => {
      setDisableButtonBasedStatus(basedOnStatusValue);
      setRebateBuyer(basicValues?.buyer_rebate)
      setBackedInsurance(basicValues?.insurance_backed)
      setInterestPaidBy(basicValues?.interest_paid_by)
    }, 1000);


    httpClient
      .getInstance()
      .get(`${baseurl}api-auth/currency/`)
      .then((resp: any) => {
        SetCurrencyList(resp.data.data);
      });

    getProgramDetails(props)


  }, []);

  const getProgramDetails = async (respData: any) => {
    setIsLoading(true)
    console.log("respData", respData)
    console.log("respData", respData?.program_type)
    // const fromDraftProgramType =
    // console.log("respData draftData",fromDraftProgramType)
    const programType = respData?.programData?.record_datas?.values?.[0]?.fields.program_type || respData?.programData || respData.program_type
    console.log("respData programType programType", programType)

    if (programType) {

      await httpClient
        .getInstance()
        .get(`${baseurl}api/program/?program_type=${programType}`)
        .then((resp: any) => {
          // console.log("respData resp get all progeam",resp?.data?.data)
          if (resp.data.status === ResponseStatus.SUCCESS) {
            console.log("5")

            if (localStorage.getItem("user") === "Bank") {
              console.log("4")

              if (basicValues) {
                console.log("3")

                resp?.data?.data?.map((item: any) => {
                  console.log("2", item, "basicValues", basicValues)
                  console.log("2", item.id, "22", basicValues?.data?.work_model?.t_id)
                  console.log("2", item.id === basicValues?.data?.work_model?.t_id)

                  if (item.id === basicValues?.data?.work_model?.t_id) {
                    console.log("1", item)
                    dispatch(program_Basicdetails(item))

                    if (resp.data.data) {
                      setUploadBuyer(item?.buyer_details?.[0]?.self_invoice_upload)
                      setInterestType(item?.interest_type)
                      setInterestPaidBy(item?.interest_paid_by)
                      setRebateBuyer(item?.buyer_rebate)
                      setBackedInsurance(item?.insurance_backed)
                      setBasicDetailsInfo(item)

                    }

                    httpClient
                      .getInstance()
                      .get(`${baseurl}api-auth/party/party-accounts/`)
                      .then((resps: any) => {
                        resps.data.data &&
                          resps.data.data.map((item: any, index: number) => {
                            if (resp.data.data?.repayment_account?.account_number === item?.account_number) {
                              setPartyAccountId(item.id)
                            }

                          })
                      })

                    setTimeout(() => {
                      setIsLoading(false)
                    }, 3000)
                  }
                })


              }
            } else {
              if (resp?.data?.data?.length > 0) {
                // httpClient
                //       .getInstance()
                //       .get(`${baseurl}api/program/${basicValues !== null ? basicValues?.id:respData?.id}/`)
                //       .then((resp: any) => {
                //         console.log("resp get basic details",respData?.id)
                //         console.log("resp get basic details",resp.data.data,resp.data.data.program_type)
                //         console.log("resp get basic details",basicValues)
                // console.log("programmmmm",resp.data.data.program_type ,props?.programData)
                // if (resp.data.data.program_type === props?.programData) {
                // if (resp.data.data.program_type === basicValues?.program_type) {
                // localStorage.setItem("program_id", basicValues?.id);
                dispatch(program_Basicdetails(resp.data.data?.[0]))
                setIsLoading(true)

                if (resp.data.data) {
                  setUploadBuyer(resp.data.data?.buyer_details?.[0]?.self_invoice_upload)
                  setInterestType(resp.data.data?.[0]?.interest_type)
                  setInterestPaidBy(resp.data.data?.[0]?.interest_paid_by)
                  setRebateBuyer(resp.data.data?.[0]?.buyer_rebate)
                  setBackedInsurance(resp.data.data?.[0]?.insurance_backed)
                  setBasicDetailsInfo(resp.data.data)

                }

                httpClient
                  .getInstance()
                  .get(`${baseurl}api-auth/party/party-accounts/`)
                  .then((resps: any) => {
                    resps.data.data &&
                      resps.data.data.map((item: any, index: number) => {
                        if (resp.data.data?.repayment_account?.account_number === item?.account_number) {
                          setPartyAccountId(item.id)
                        }

                      })
                  })

                setTimeout(() => {
                  setIsLoading(false)
                  console.log("enter1")
                }, 5000)

                // }
                // });

              } else {
                dispatch(program_Basicdetails(null))
                setTimeout(() => {
                  setIsLoading(false)
                  console.log("enter2")

                }, 5000)

              }
            }

          } else {
            message.error(resp.data.status)
          }

        })
      // await httpClient
      //             .getInstance()
      //             .get(`${baseurl}api/program/`)
      //             .then((resp: any) => {
      // console.log("resp get all progeam",resp?.data?.data)
      // resp?.data?.data?.map((data:any)=>{
      //   console.log("resp enetered if map",respData?.programData === data?.program_type)

      //   if(respData?.programData === data?.program_type){
      //     console.log("resp enetered if map",data?.program_type)
      //     console.log("resp enetered if map",respData?.programData)

      //      httpClient
      //             .getInstance()
      //             .get(`${baseurl}api/program/${data?.id}/`)
      //             .then((resp: any) => {
      //               console.log("resp get basic details",respData?.id)
      //               console.log("resp get basic details",resp.data.data,resp.data.data.program_type)
      //               console.log("resp get basic details",basicValues)
      //               // console.log("programmmmm",resp.data.data.program_type ,props?.programData)
      //               // if (resp.data.data.program_type === props?.programData) {
      //               // if (resp.data.data.program_type === basicValues?.program_type) {
      //                 // localStorage.setItem("program_id", basicValues?.id);
      //                 dispatch(program_Basicdetails(resp.data.data))

      //                 if (resp.data.data) {
      //                   setUploadBuyer(resp.data.data?.buyer_details?.[0]?.self_invoice_upload)
      //                   setInterestType(resp.data.data.interest_type)
      //                   // dispatch(
      //                   //   basicDetails({
      //                   //     basicDetails: resp.data.data,
      //                   //   })
      //                   // );

      //                   setBasicDetailsInfo(resp.data.data)

      //                 }

      //                 httpClient
      //                   .getInstance()
      //                   .get(`${baseurl}api-auth/party/party-accounts/`)
      //                   .then((resps: any) => {
      //                     resps.data.data &&
      //                       resps.data.data.map((item: any, index: number) => {
      //                         if (resp.data.data?.repayment_account?.account_number === item?.account_number) {
      //                           setPartyAccountId(item.id)
      //                         }

      //                       })
      //                   })
      //                   setTimeout(()=>{
      //                     setIsLoading(false)
      //                   },3000)
      //               // }
      //             });
      //         // }

      //   }else{
      //     console.log("resp program data else")
      //     dispatch(
      //       program_Basicdetails(null))
      //       setTimeout(()=>{
      //         setIsLoading(false)
      //       },3000)
      //   }



      // })
      //             })

    }
    // else if(){

    // }

    // if (props?.programData?.work_model) {

    //   await httpClient
    //     .getInstance()
    //     .get(`${baseurl}api/program/${props.programData.work_model.t_id}/`)
    //     .then((resp: any) => {
    //       setInterestType(resp.data.data.interest_type)
    //       setUploadBuyer(resp.data.data?.buyer_details?.[0]?.self_invoice_upload)
    //       localStorage.setItem("program_id", resp.data.data.id);
    //       // dispatch(
    //       //   basicDetails({
    //       //     basicDetails: resp.data.data,
    //       //   })
    //       // );
    //       setBasicDetailsInfo(resp.data.data);
    //       httpClient
    //         .getInstance()
    //         .get(`${baseurl}api-auth/party/party-accounts/`)
    //         .then((resps: any) => {
    //           resps.data.data &&
    //             resps.data.data.map((item: any, index: number) => {
    //               if (resp.data.data?.repayment_account?.account_number === item.account_number) {
    //                 setPartyAccountId(item.id)
    //               }

    //             })
    //         })
    //     });
    // } else if ((props?.Pdatas?.programType === props?.programData) || (props?.Pdatas?.programType === props?.programData?.program_type)) {

    //   await httpClient
    //     .getInstance()
    //     .get(`${baseurl}api/program/${props?.Pdatas?.id}/`)
    //     .then((resp: any) => {
    //       setInterestType(resp.data.data.interest_type)
    //       setUploadBuyer(resp.data.data?.buyer_details?.[0]?.self_invoice_upload)
    //       // localStorage.setItem("program_id", basicDetailsDatas?.payload?.basicDetails?.basicDetails?.id);
    //       if (resp.data.data) {
    //         // dispatch(
    //         //   basicDetails({
    //         //     basicDetails: resp.data.data,
    //         //   })
    //         // );
    //         setBasicDetailsInfo(resp.data.data);
    //         httpClient
    //           .getInstance()
    //           .get(`${baseurl}api-auth/party/party-accounts/`)
    //           .then((resps: any) => {
    //             resps.data.data &&
    //               resps.data.data.map((item: any, index: number) => {
    //                 if (resp.data.data?.repayment_account?.account_number === item?.account_number) {
    //                   setPartyAccountId(item.id)
    //                 }

    //               })
    //           })

    //       }
    //     });

    // } else {

    // if (basicValues) {
    // if (basicValues || respData) {
    //   await httpClient
    //     .getInstance()
    //     .get(`${baseurl}api/program/${basicValues !== null ? basicValues?.id:respData?.id}/`)
    //     .then((resp: any) => {
    //       // if (resp.data.data.program_type === props?.programData) {
    //       if (resp.data.data.program_type === basicValues?.program_type) {
    //         // localStorage.setItem("program_id", basicValues?.id);
    //         dispatch(program_Basicdetails(resp.data.data))
    //         if (resp.data.data) {
    //           setUploadBuyer(resp.data.data?.buyer_details?.[0]?.self_invoice_upload)
    //           setInterestType(resp.data.data.interest_type)
    //           // dispatch(
    //           //   basicDetails({
    //           //     basicDetails: resp.data.data,
    //           //   })
    //           // );

    //           setBasicDetailsInfo(resp.data.data)

    //         }

    //         httpClient
    //           .getInstance()
    //           .get(`${baseurl}api-auth/party/party-accounts/`)
    //           .then((resps: any) => {
    //             resps.data.data &&
    //               resps.data.data.map((item: any, index: number) => {
    //                 if (resp.data.data?.repayment_account?.account_number === item?.account_number) {
    //                   setPartyAccountId(item.id)
    //                 }

    //               })
    //           })
    //       }
    //     });
    // }
    // }
    // }
  }


  const onClickInterestType = (e: any) => {
    if (e === 1) {
      setInterestType(e)
      setInterestRateType(null)
    } else {
      setInterestType(e)
    }
  };
  const limitCurrencyData = (e: any) => {
    console.log("err0r e", e)
    console.log("err0r e", e?.target?.value)
    // if(e){
    //   setLimitCurrency(e)
    // }
    if (e?.target?.value === "" || e?.target?.value === null) {
      setCurrencyError(true)

    } else {
      setCurrencyError(false)
    }

    console.log("err0r e", e)
  }
  const maxInvCurrencyData = (e: any) => {
    setMaxInvoiceCurrency(e)
    setInvoiceCurrencyError(!e)
  }
  const intTypeData = (e: any) => {
    setInterestType(e)
    setInterestTypeError(!e)
  }
  const intPaidByData = (e: any) => {
    setInterestPaidBy(e)
    console.log("e", e)
  }
  const onClickInterestRateType = (e: any) => {
    setInterestRateType(e)
    setInterestRateTypeError(!e)
  }
  // const onClickInterestPaid = (e: any) => {

  // }
  const onClickInterestDeduction = (e: any) => {
    setIntDeduction(e)

  }
  // const onchangeUploadByBuyer = (e: any) => {
  //   setUploadBuyer(e)
  // }

  const disabledDate = (current: any) => {
    return current && current < moment().endOf("day");
  };
  const selectedFiles = (value: any) => {
    setFileList(value)
  }
  // const validateCurrency = (rule: any, value: any, callback: any) => {
  //   console.log("rate value", value)
  //   console.log("rate rule", rule)
  //   console.log("rate callback", callback)
  // }
  // const validateInterestRateType = (rule: any, value: any, callback: any) => {
  //   console.log("rate value", value)
  //   console.log("rate rule", rule)
  //   console.log("rate callback", callback)
  //   if (!value) {
  //     return Promise.reject('Input your Interest rate type');
  //   }
  //   return Promise.resolve();

  // }
  const exceptThisSymbols = ["e", "E", "+", "-"];

  return isLoading ? <Spin /> : (

    <div className="col_Desc approvedPayableFinacing">
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        validateTrigger="onBlur"
        layout="vertical"
      >
        <Button className="actionButtonSaveContainer" htmlType="submit" disabled={disableButton} loading={disableButton} id="program_save" style={{ position: "fixed", zIndex: 99999 }}>
          Save</Button>
        {/* <Button className="actionButtonExitContainer" onClick={onClickprevious} style={{position:"fixed",zIndex:99999}}>
          Exit</Button> */}
        <Button className="nextButtonContainer" htmlType="submit"
          disabled={disableButton}
          loading={disableButton} id="program_next">Next</Button>

        <Row gutter={24}>
          <Col span={16}>
            <Row>
              <Col span={12}>
                <div className="labelContainer">Limit Amount<span className="mandatoryField">*</span></div>
                <Row>
                  <Col span={7}>
                    <Form.Item
                      label=""
                      name="limit_currency"
                      className="FormContainer"
                      key="limit_currency"
                      initialValue={basicValues?.limit_currency}
                      rules={[
                        {
                          required: true,
                          message: FieldErrorMessages.LIMITCURR,
                          // validator:validateCurrency
                          // validateTrigger: ['onBlur','onChange','onFocus']
                        },
                      ]}
                    // validateTrigger={['onBlur']}
                    // validateFirst={true}
                    // // validateStatus={currencyError ? 'error' : ''}
                    // validateStatus={'error'}
                    // help={
                    //   currencyError && 
                    //   'Please select a currency'}
                    // help={currencyError && 'Please select a currency'}
                    // key={
                    //   BasicDetailsInfo ? BasicDetailsInfo.limit_currency : ""
                    // }
                    // initialValue={
                    //   BasicDetailsInfo ? BasicDetailsInfo.limit_currency : limitCurrency ? limitCurrency : ""
                    // }
                    >
                      {/* <DropdownField id="program_limit_currency" disabled={disableButtonBasedStatus} defaultVal={basicValues?.limit_currency} flag="currency" 
                      onchange={limitCurrencyData} 
                     /> */}
                      <Select
                        id={"program_limit_currency"}
                        showSearch={true}
                        placeholder="Select"
                        optionFilterProp="children"
                        defaultValue={basicValues?.limit_currency}
                        onChange={limitCurrencyData}
                        style={{ width: "" }}
                        disabled={disableButtonBasedStatus}
                        suffixIcon={<img src={DropdownIcon} alt="DropdownIcon" />}
                        // onBlur={limitCurrencyData}
                      >
                        {Currency_Data.payload.currencyData.allCurrency?.map((item: any, index: number) => {
                          return (
                            <Option value={item.id} key={item.description}>
                              {item.description}
                            </Option>
                          );
                        })}
                      </Select>


                    </Form.Item>
                  </Col>
                  <Col span={17} style={{ padding: "0 5px" }}>
                    <Form.Item
                      label=""
                      name="limit_amount"
                      className="FormContainer"
                      id="limitAmount"
                      key="limit_amount"
                      // initialValue={
                      //   basicValues
                      //     ? basicValues?.max_limit_amount
                      //     : limitAmount ? maxInvoiceCurrency : ""
                      // }
                      initialValue={basicValues ? basicValues?.max_limit_amount : ""}
                      // key={
                      //   BasicDetailsInfo
                      //     ? BasicDetailsInfo.max_limit_amount
                      //     : ""
                      // }
                      // initialValue={
                      //   BasicDetailsInfo
                      //     ? BasicDetailsInfo.max_limit_amount
                      //     : ""
                      // }
                      rules={[
                        {
                          pattern:InputPatterns.INVOICEAMT,
                          required: true,
                          message: FieldErrorMessages.lIMITAMT,
                        },
                      ]}
                    >
                      <Input
                        id="program_limit_amount"
                        onKeyDown={(e) =>
                          exceptThisSymbols.includes(e.key) &&
                          e.preventDefault()
                        }
                        key="limitAmount"
                        onChange={(e) => {
                          setLimitAmount(e.target.value)
                          localStorage.setItem("limitamt", e.target.value)

                          if (parseFloat(e.target.value) < parseFloat(maxInvoiceAmtValue)) {
                            setMaxInvoiceAmtError(true)
                          // } else if (parseFloat(e.target.value) < (BasicDetailsInfo
                          //   && BasicDetailsInfo.max_invoice_amount)) {

                          } else {
                            setMaxInvoiceAmtError(false)
                          }
                        }}
                        // onFocus={() => {
                        //   console.log("limitCurrency",limitCurrency)
                        //   if(limitCurrency === "" || limitCurrency === null){
                        //     setCurrencyError(true)
                        //   }else{
                        //     setCurrencyError(false)

                        //   }
                        // }}
                        defaultValue={basicValues?.max_limit_amount}
                        type="number"
                        placeholder="Enter your limit"
                        disabled={disableButtonBasedStatus}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={12} >
                {/* {console.log("basicValues?.expiry_date",basicValues ? basicValues?.expiry_date ? basicValues?.expiry_date:"":"")} */}
                <Form.Item name="expiry_date"
                  label={<>Expiry Date <span className="mandatoryField"> *</span> </>}
                  
                  className="FormContainer"
                  rules={[
                    {
                      required: basicValues ? basicValues?.expiry_date ? false : true: true,
                      message: FieldErrorMessages.EXPIRYDTE,
                    },
                  ]}
                // key="expiry_date"
                // initialValue={basicValues ? basicValues?.expiry_date ? basicValues?.expiry_date:"":""}
                // initialValue={
                //   basicValues
                //     ? basicValues.expiry_date
                //       ? basicValues.expiry_date
                //       : ""
                //     : "-"
                // }

                >
                  {/* {console.log("expiry b",BasicDetailsInfo)}
                   {console.log("expiry b",BasicDetailsInfo?.expiry_date)} */}
                  {/* {console.log("expiry b",moment(current).add(1,"days"))} */}
                  <DatePicker
                    // format={"YYYY-MM-DD"}
                    id="program_datePicker"
                    disabledDate={disabledDate}
                    suffixIcon={<img src={DatePickerImg} alt="pickericon" />}
                    placeholder={basicValues ? basicValues?.expiry_date : "YYYY-MM-DD"}
                    // defaultValue={moment(BasicDetailsInfo ? BasicDetailsInfo?.expiry_date : "")}
                    // value={moment(BasicDetailsInfo ? BasicDetailsInfo?.expiry_date : "")}
                    className={basicValues?.expiry_date ? "valueExpiryDate" : ""}
                    style={{
                      lineHeight: "2.5",
                      borderRadius: "8px",
                      fontSize: "13px",
                      padding: "5px 15px",
                      width: "100%",
                      height: "40px",
                    }}
                    disabled={disableButtonBasedStatus}
                  />

                </Form.Item>
              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <div className="labelContainer">Max Invoice Amount<span className="mandatoryField">*</span></div>
                <Row >
                  <Col span={7}>
                    <Form.Item
                      label=""
                      name="max_invoice_currency"
                      className="FormContainer"
                      key="max_invoice_currency"
                      // key={
                      //   BasicDetailsInfo
                      //     ? BasicDetailsInfo.max_invoice_currency
                      //     : ""
                      // }
                      initialValue={
                        basicValues
                          ? basicValues?.max_invoice_currency
                          : maxInvoiceCurrency ? maxInvoiceCurrency : ""
                      }
                      rules={[
                        {
                          required: true,
                          message: FieldErrorMessages.INVCURR,
                          // validateTrigger: ['onBlur']
                        },
                      ]}
                    // validateTrigger={['onBlur']}
                    // validateFirst={true}
                    // validateStatus={invoiceCurrencyError ? 'error' : ''}
                    // help={invoiceCurrencyError && 'Please select a currency'}

                    >
                      {/* <DropdownField id="program_invoice_currency" disabled={disableButtonBasedStatus} defaultVal={basicValues?.max_invoice_currency} flag="currency" onchange={maxInvCurrencyData} /> */}
                      <Select
                        id={"program_invoice_currency"}
                        showSearch={true}
                        placeholder="Select"
                        optionFilterProp="children"
                        defaultValue={basicValues?.max_invoice_currency}
                        onChange={maxInvCurrencyData}
                        style={{ width: "" }}
                        disabled={disableButtonBasedStatus}
                        suffixIcon={<img src={DropdownIcon} alt="DropdownIcon" />}
                        // onBlur={maxInvCurrencyData}
                      >
                        {Currency_Data.payload.currencyData.allCurrency?.map((item: any, index: number) => {
                          return (
                            <Option value={item.id} key={item.description}>
                              {item.description}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={17} style={{ padding: "0 5px" }}>
                    <Form.Item
                      label=""
                      name="max_invoice_amount"
                      className="FormContainer"
                      id="MaxInvcAmount"
                      key={
                        basicValues ? basicValues?.max_invoice_amount : ""
                      }
                      initialValue={
                        basicValues ? basicValues?.max_invoice_amount : ""
                      }
                      rules={[
                        {
                          pattern: InputPatterns.INVOICEAMT,
                          required: maxInvoiceAmtError? false : true,
                          message: FieldErrorMessages.INVAMT,
                        },
                      ]}
                    >
                      <Input
                        id="program_invoice_amount"
                        placeholder="Enter your max invoice amount"
                        type="number"
                        onChange={(e) => {
                          setMaxInvoiceAmtValue(e.target.value)
                          if (parseFloat(e.target.value) > parseFloat(limitAmount)) {
                            setMaxInvoiceAmtError(true)
                          } else {
                            setMaxInvoiceAmtError(false)
                          }
                        }}
                        defaultValue={maxInvoiceAmtValue}
                        disabled={disableButtonBasedStatus}
                        onFocus={() => {
                          console.log("limitCurrency", maxInvoiceCurrency)
                          if (maxInvoiceCurrency === "" || maxInvoiceCurrency === null) {
                            setInvoiceCurrencyError(true)
                          } else {
                            setInvoiceCurrencyError(false)

                          }
                        }}
                      />
                    </Form.Item>
                    <span className="errorMessage" style={maxInvoiceAmtError ? { display: "flex" } : { display: "none" }}>{FieldErrorMessages.INVAMTE}</span>

                  </Col>
                </Row>
              </Col>
              <Col span={12}>
                <Row gutter={24} className="maxInvoicePCTColumn colContainer">
                  <Col span={12} style={{ padding: "0 10px" }}>
                    <Form.Item
                      label={<>Max Inv. PCT<span className="mandatoryField">*</span></>}
                      name="max_invoice_percent"
                      className="FormContainer"
                      rules={[
                        {
                          required: true,
                          message: FieldErrorMessages.INVPCT,
                        },
                      ]}
                      key={
                        basicValues
                          ? basicValues?.max_invoice_percent
                          : ""
                      }
                      initialValue={
                        basicValues
                          ? basicValues?.max_invoice_percent
                          : ""
                      }
                    >

                      <Input
                        id="program_invoice_pct"
                        placeholder="Enter your max invoice pct"
                        type="number"
                        suffix="%"
                        onChange={(e) => {
                          setMaxInvoicePctValue(e.target.value)
                          const pattern = InputPatterns.INVOICEPCT
                          const isSuccess = pattern.test(e.target.value)
                          if (isSuccess) {
                            setMaxInvoicePctError(false)
                          } else {
                            setMaxInvoicePctError(true)
                          }
                        }}
                        disabled={disableButtonBasedStatus}
                        value={maxInvoicePctValue}
                      />

                    </Form.Item>
                    <span className="errorMessage" style={maxInvoicePctError ? { display: "flex" } : { display: "none" }}>{FieldErrorMessages.INVPCTE}</span>

                  </Col>
                  <Col span={12} style={{ padding: "0 10px" }}>
                    <Form.Item
                      label={<>Max Tenor<span className="mandatoryField">*</span></>}
                      name="max_tenor"
                      className="FormContainer"
                      rules={[
                        {
                          pattern: InputPatterns.MAXTENOR,
                          required: true,
                          message: FieldErrorMessages.MAXTENOR,
                        },
                      ]}
                      key={
                        basicValues
                          ? basicValues?.max_tenor
                          : ""
                      }
                      initialValue={
                        basicValues
                          ? basicValues?.max_tenor
                          : ""
                      }
                    >
                      <Input
                        id="program_max_tenor"
                        onKeyDown={(e) =>
                          exceptThisSymbols.includes(e.key) &&
                          e.preventDefault()
                        }
                        placeholder="Enter your max tenor"
                        type="number"
                        onChange={(e) => (
                          setMaxTenorAmount(e.target.value)

                        )}
                        disabled={disableButtonBasedStatus}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  label={<>Grace Period<span className="mandatoryField">*</span></>}
                  name="grace_period"
                  className="FormContainer"
                  rules={[
                    {
                      required: true,
                      message: FieldErrorMessages.GRACEPERIOD,
                    },
                  ]}
                  key={basicValues ? basicValues?.grace_period : ""}
                  initialValue={
                    basicValues ? basicValues?.grace_period : ""
                  }
                >
                  <Input
                    id="program_grace_period"
                    type="number"
                    placeholder="Enter your grace period"
                    onChange={(e) => {
                      setGracePeriodValue(e.target.value)
                      const pattern = InputPatterns.GRACEPERIOD
                      const isSuccess = pattern.test(e.target.value)
                      if (isSuccess) {
                        setgracePeriodError(false)
                      } else {
                        setgracePeriodError(true)
                      }
                      if (parseFloat(e.target.value) > parseFloat(maxTenorAmount)) {
                        setgracePeriodError(true)

                      } else {
                        setgracePeriodError(false)
                      }
                    }}
                    defaultValue={gracePeriodValue}
                    disabled={disableButtonBasedStatus}
                  />

                </Form.Item>
                <span className="errorMessage" style={gracePeriodError ? { display: "flex" } : { display: "none" }}>{FieldErrorMessages.GRACEPERIODE}</span>

              </Col>
              <Col span={12}>
                <Form.Item
                  label={<>Interest Type<span className="mandatoryField">*</span></>}
                  name="interest_type"
                  className="FormContainer"
                  rules={[
                    {
                      required: true,
                      message: FieldErrorMessages.INTTYPE,
                      // validateTrigger: ['onBlur']
                    },
                  ]}
                  // validateTrigger={['onBlur']}
                  //     validateFirst={true}
                  //     validateStatus={interestTypeError ? 'error' : ''}
                  //     help={interestTypeError && 'Please select a currency'}

                  key={basicValues ? basicValues?.interest_type : ""}
                  initialValue={
                    basicValues ? basicValues?.interest_type : interestType ? interestType : ""
                  }
                >

                  {/* <DropdownField id="program_interest_type" disabled={disableButtonBasedStatus} defaultVal={basicValues?.interest_type} flag="interestType" onchange={intTypeData} /> */}
                  <Select
                        id={"program_interest_type"}
                        showSearch={false}
                        placeholder="Select"
                        optionFilterProp="children"
                        defaultValue={basicValues?.interest_type}
                        onChange={intTypeData}
                        style={{ width: "" }}
                        disabled={disableButtonBasedStatus}
                        suffixIcon={<img src={DropdownIcon} alt="DropdownIcon" />}
                        // onBlur={intTypeData}
                      >
                        {/* {console.log("data mappingData",mappingData)} */}
                        {InterestType_Data.payload.interestType.allInterestType?.map((item: any, index: number) => {
                          return (
                            <Option value={item.id} key={item.description}>
                              {item.description}
                            </Option>
                          );
                        })}
                      </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                {/* {console.log("respData interestType",interestType)} */}
                <Form.Item
                  label={(interestType === "FLOATING" || (interestType === "Floating") || interestType === 2) ? <>Interest Rate Type<span className="mandatoryField">*</span></> : "Interest Rate Type"}
                  name="interest_rate_type"
                  className="FormContainer"
                  rules={[
                    {
                      required: interestType === "FIXED" || interestType === "Fixed" || interestType === 1 ? false : ((interestType === "FLOATING" || (interestType === "Floating") || interestType === 2) && interestRateType !==null) ? false :true,
                      // interestType === "FIXED" || interestType === "Fixed" || interestType === 1 ? false :true,
                      // (interestType === "FLOATING" || (interestType === "Floating") || interestType === 2) ? true : false,
                      message: FieldErrorMessages.INTRATETYPE,
                      // validator:validateInterestRateType
                    },
                  ]}
                  key={
                    basicValues
                      ? (basicValues?.interest_type === "FIXED" || basicValues?.interest_type === "Fixed")
                        ? ""
                        : basicValues?.interest_rate_type
                      : ""
                  }
                  initialValue={
                    interestType === "Fixed" || interestType === "FIXED" || interestType === 1 ? "" :
                      basicValues
                        ? (basicValues?.interest_type === "FIXED" || basicValues?.interest_type === "Fixed")
                          ? null
                          : basicValues?.interest_rate_type
                        : interestRateType ? interestRateType : ""
                  }
                >
                  {interestType === "FIXED" || interestType === "Fixed" || interestType === 1
                    ? (
                      <div className="inputDiv" 
                      ></div>
                      // <Input readOnly disabled/>
                    ) : (
                      // <DropdownField id="program_interest_rate_type" disabled={disableButtonBasedStatus ? disableButtonBasedStatus : interestType === "FIXED" ? true : false} defaultVal={BasicDetailsInfo
                      //   ? (basicValues?.interest_type === "FIXED" || basicValues?.interest_type === "Fixed")
                      //     ? ""
                      //     : basicValues?.interest_rate_type
                      //   : ""} flag="interestRateType" onchange={onClickInterestRateType} />
                      <Select
                        id={"program_interest_rate_type"}
                        showSearch={false}
                        placeholder="Select"
                        optionFilterProp="children"
                        defaultValue={BasicDetailsInfo
                          ? (basicValues?.interest_type === "FIXED" || basicValues?.interest_type === "Fixed" || basicValues?.interest_type === 1)
                            ? ""
                            : basicValues?.interest_rate_type
                          : ""}
                        onChange={onClickInterestRateType}
                        style={{ width: "" }}
                        disabled={disableButtonBasedStatus ? disableButtonBasedStatus : interestType === "FIXED" ? true : false}
                        suffixIcon={<img src={DropdownIcon} alt="DropdownIcon" />}
                        // onBlur={onClickInterestRateType}
                      >
                        {/* {console.log("data mappingData",mappingData)} */}
                        {InterestRatetype_Data.payload.interestRateType.allInterestRateType?.map((item: any, index: number) => {
                          return (
                            <Option value={item.id} key={item.description}>
                              {item.description}
                            </Option>
                          );
                        })}
                      </Select>
                   )}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={<>Fixed Rate/ Margin<span className="mandatoryField">*</span></>}
                  name="margin"
                  className="FormContainer"
                  rules={[
                    {
                      pattern: InputPatterns.MARGIN,
                      required: true,
                      message: FieldErrorMessages.MARGIN,
                    },
                  ]}
                  key={basicValues ? basicValues?.margin : ""}
                  initialValue={basicValues ? basicValues?.margin : ""}
                >
                  <Input
                    id="program_margin"
                    type="number"
                    placeholder="Please input your fixed rate/margin!"
                    disabled={disableButtonBasedStatus}
                  />
                </Form.Item>
              </Col>
            </Row>
            {props?.programData === ProgramType.APF || props?.programData?.program === ProgramType.APF || props?.programData?.program_type === ProgramType.APF || props?.programData?.record_datas?.values?.[0]?.fields?.program_type ?
              <>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label={<>Interest Paid By<span className="mandatoryField">*</span></>}
                      name="interest_paid_by"
                      className="FormContainer"
                      key={basicValues ? basicValues?.interest_paid_by : ""}
                      initialValue={basicValues ? basicValues?.interest_paid_by : interestPaidBy ? interestPaidBy : ""}
                      rules={[
                        {
                          required: true,
                          message: FieldErrorMessages.INTPAIDBY,
                        },
                      ]}
                    >
                      {/* <DropdownField id="program_interest_paid_by" disabled={disableButtonBasedStatus} defaultVal={basicValues?.interest_paid_by} flag="interestPaidBy" onchange={intPaidByData} /> */}
                      <Select
                        id={"program_interest_paid_by"}
                        showSearch={false}
                        placeholder="Select"
                        optionFilterProp="children"
                        defaultValue={basicValues?.interest_paid_by}
                        onChange={intPaidByData}
                        style={{ width: "" }}
                        disabled={disableButtonBasedStatus}
                        suffixIcon={<img src={DropdownIcon} alt="DropdownIcon" />}
                        // onBlur={intPaidByData}
                      >
                        {/* {console.log("data mappingData",mappingData)} */}
                        {InterestPaidByData?.map((item: any, index: number) => {
                          return (
                            <Option value={item.id} key={item.description}>
                              {item.description}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Overdue Interest Rate"
                      name="overdue_interest_rate"
                      className="FormContainer"
                      rules={[
                        {
                          pattern: InputPatterns.OVERDUEINTRATE,
                          required: false,
                          message: FieldErrorMessages.OVERDUEINT,
                        },
                      ]}
                      key={basicValues ? basicValues?.overdue_interest_rate : ""}
                      initialValue={basicValues ? basicValues?.overdue_interest_rate : ""}
                    >

                      <Input
                        id="program_overdue_interest_rate"
                        type="number"
                        defaultValue={basicValues ? basicValues?.overdue_interest_rate : ""}
                        placeholder="Please input your overdue interest rate!"
                        disabled={disableButtonBasedStatus}
                      />

                    </Form.Item>
                  </Col>
                </Row>

                <Row>
                  <Col span={12}>
                    <Form.Item
                      label={<>Interest Deduction Stage<span className="mandatoryField">*</span></>}
                      name="interest_deduction"
                      className="FormContainer"
                      rules={[
                        {
                          required: interestPaidBy === InterestPaidBy.OWNPARTY || intDeduction === InterestPaidBy.OWNPARTY?false : intDeduction !== "null" ? false :true,
                          // required: basicValues ? basicValues?.interest_paid_by === InterestPaidBy.OWNPARTY ? false : basicValues?.interest_deduction : true,
                          message: FieldErrorMessages.INTDEDUCTION,
                        },
                      ]}
                      key={basicValues ? basicValues?.interest_deduction : ""}
                      initialValue={basicValues ? basicValues?.interest_paid_by === InterestPaidBy.OWNPARTY ? "REPAYMENT" : basicValues?.interest_deduction : ""}

                    >
                      {console.log(interestPaidBy)}
                      {/* {console.log("bd intDeduction",intDeduction)} */}
                      {/* {console.log("bd deduction",interestPaidBy === InterestPaidBy.OWNPARTY || intDeduction === InterestPaidBy.OWNPARTY)} */}
                      {
                        interestPaidBy === InterestPaidBy.OWNPARTY || intDeduction === InterestPaidBy.OWNPARTY
                          // || 
                          // basicValues?.interest_paid_by === InterestPaidBy.OWNPARTY 
                          ?
                          // <Input id="program_interest_deduction_stage" readOnly
                          //   disabled={disableButtonBasedStatus}
                          //   value="REPAYMENT"
                          //   defaultValue={"REPAYMENT"}
                          // />
                          <div className="inputDiv" id={"program_interest_deduction_stage"}>REPAYMENT</div>
                          :
                          <Select
                            id={"program_interest_deduction_stage"}
                            showSearch={false}
                            placeholder="Select"
                            optionFilterProp="children"
                            defaultValue={basicValues?.interest_deduction}
                            onChange={onClickInterestDeduction}
                            style={{ width: "" }}
                            disabled={disableButtonBasedStatus}
                            suffixIcon={<img src={DropdownIcon} alt="DropdownIcon" />}
                            // onBlur={onClickInterestDeduction}
                          >
                            {/* {console.log("data mappingData",mappingData)} */}
                            {InterestDeduction?.map((item: any, index: number) => {
                              return (
                                <Option value={item.id} key={item.description}>
                                  {item.description}
                                </Option>
                              );
                            })}
                          </Select>
                        // <DropdownField id="program_interest_deduction_stage" disabled={disableButtonBasedStatus} defaultVal={basicValues?.interest_deduction} flag="interestDeduction" onchange={onClickInterestDeduction} />
                      }

                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <div className="labelContainer">Repayment Account<span className="mandatoryField">*</span></div>

                    <Row>
                      <Col span={7}>
                        <Form.Item
                          label=""
                          name="repayment_account_currency"
                          className="FormContainer"
                          style={{ backgroundColor: "#FAFAFA", height: "43px" }}
                          key={
                            basicValues ? basicValues?.repayment_account?.currency : ""
                          }
                          initialValue={
                            basicValues ? basicValues?.repayment_account?.currency : ""
                          }
                        >
                          <div style={{
                            height: "43px", padding: "5px 15px", lineHeight: "2.5",
                            borderRadius: "8px",
                            fontSize: "13px"
                          }} id="repayment_currency"
                          >
                            {currencyList &&
                              currencyList.map((item: any, index: number) => {
                                let repaymentcurr = '' as any
                                if (PartyAccountCurrencyDetails === item.id) {
                                  repaymentcurr = item.description
                                } else if (basicValues?.repayment_account?.currency === item.id) {
                                  repaymentcurr = item.description
                                }
                                return repaymentcurr
                              })}
                          </div>

                        </Form.Item>
                      </Col>
                      <Col span={17}
                        style={{ padding: "0 5px" }}
                      >
                        <Form.Item
                          label=""
                          name="repayment_account"
                          className="FormContainer"
                          id="repayment_account"
                          key={
                            basicValues
                              ? basicValues?.repayment_account?.account_number
                              : ""
                          }
                          initialValue={
                            basicValues
                              ? basicValues?.repayment_account?.account_number
                              : ""
                          }
                          rules={[
                            {
                              required: true,
                              message: FieldErrorMessages.REPAYMENTACC,
                            },
                          ]}
                        >
                          <Select
                            id="repayment_account"
                            showSearch
                            placeholder="Select"
                            optionFilterProp="children"
                            style={{
                              width: "",
                            }}
                            disabled={disableButtonBasedStatus}
                            suffixIcon={<img src={DropdownIcon} alt="DropdownIcon" />}
                            onChange={
                              (e) => {

                                PartyAccountDetails &&
                                  PartyAccountDetails.map((item: any, index: number) => {
                                    if (e === item.account_number) {
                                      setPartyAccountId(item.id)
                                      setPartyAccountCurrencyDetails(item.currency)
                                    }

                                  })
                              }
                            }

                          >
                            {PartyAccountDetails &&
                              PartyAccountDetails.map((item: any, index: number) => {
                                return (
                                  <Option value={item.account_number} key={item.account_number}>
                                    <div >
                                      <span >
                                        {currencyList &&
                                          currencyList.map((items: any, index: number) => {
                                            let repaymentcurr = '' as any
                                            if (PartyAccountCurrencyDetails === items.id) {
                                              repaymentcurr = items.description
                                            } else if (basicValues?.repayment_account?.currency === item.id) {
                                              repaymentcurr = items.description
                                            }
                                            else if (item.currency === items.id) {
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

                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label=" "
                      name="upload_by_buyer"
                      className="FormContainer"
                      rules={[
                        {
                          required: false,
                          message: FieldErrorMessages.UPLOADBUYER,
                        },
                      ]}
                      initialValue={
                        basicValues ?
                          basicValues?.buyer_details?.[0]?.self_invoice_upload
                          : uploadBuyer
                      }
                    >
                      <div id="program_upload_by_buyer" className="checkboxClass">Allow Invoice Upload By Buyer <CheckboxField onchange={(e: any) => setUploadBuyer(e)} defaultChecked={
                        basicValues ?
                          basicValues?.buyer_details?.[0]?.self_invoice_upload
                          : uploadBuyer
                      } value={basicValues ?
                        basicValues?.buyer_details?.[0]?.self_invoice_upload
                        : uploadBuyer} />

                      </div>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label=" "
                      name="auto_debit_invoice"
                      className="FormContainer"
                      rules={[
                        {
                          required: false,
                          message: FieldErrorMessages.AUTODEBITINV,
                        },
                      ]}
                      initialValue={basicValues ? basicValues?.auto_debit_invoice : false}
                    >
                      <div id="program_autoDebit_for_invoices" className="checkboxClass">Auto Debit for Invoices not financed
                        <CheckboxField onchange={(e: any) => setAutoFinanceDebit(e)} defaultChecked={basicValues ? basicValues?.auto_debit_invoice : autoFinanceDebit} value={basicValues?.auto_debit_invoice ? basicValues?.auto_debit_invoice : autoFinanceDebit} />

                      </div>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label=" "
                      name="buyer_rebate"
                      className="FormContainer"
                      rules={[
                        {
                          required: false,
                          message: FieldErrorMessages.BUYERREBATE,
                        },
                      ]}
                      initialValue={basicValues ? basicValues?.buyer_rebate : false}
                    > <div id="program_rebate_for_buyer" className="checkboxClass" >Allow Rebate for Buyer
                        <CheckboxField onchange={(e: any) => setRebateBuyer(e)} defaultChecked={basicValues ? basicValues?.buyer_rebate : rebateBuyer} value={basicValues ? basicValues?.buyer_rebate : rebateBuyer} />

                      </div>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label=" "
                      name="insurance_backed"
                      className="FormContainer"
                      rules={[
                        {
                          required: false,
                          message: FieldErrorMessages.INSBACKED,
                        },
                      ]}
                      key={basicValues ? basicValues?.insurance_backed : ""}
                      initialValue={basicValues ? basicValues?.insurance_backed : ""}
                    >
                      <div id="program_backed_by_insurance" className="checkboxClass">Backed by Insurance
                        <CheckboxField
                          onchange={(e: any) => setBackedInsurance(e)}
                          defaultChecked={basicValues ? basicValues?.insurance_backed : backedInsurance}
                          value={basicValues ? basicValues?.insurance_backed : backedInsurance}
                        />

                      </div>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label={basicValues?.buyer_rebate === true || rebateBuyer === true ? <>Buyer Rebate PCT<span className="mandatoryField">*</span></> : "Buyer Rebate PCT"}
                      name="buyer_rebate_percent"
                      className="FormContainer"
                      rules={[
                        {
                          pattern: InputPatterns.INVOICEPCT,
                          required: (basicValues?.buyer_rebate === true || rebateBuyer === true) ? true : false,
                          message: FieldErrorMessages.BUYERREBATEPCT,
                        },
                      ]}
                      key={basicValues ? basicValues?.buyer_rebate_percent : ""}
                      initialValue={basicValues ? rebateBuyer === false ? "" : basicValues?.buyer_rebate_percent : ""}
                    >
                      <Input
                        id="program_rebate_percent"
                        type="number"
                        suffix="%"
                        placeholder="Please input your Buyer Rebate PCT!"
                        disabled={rebateBuyer === true ? false : rebateBuyer === false ? true
                          : disableButtonBasedStatus}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={basicValues?.insurance_backed === true || backedInsurance === true ? <>Fee<span className="mandatoryField">*</span></> : "Fee"}
                      name="fee"
                      className="FormContainer"
                      rules={[
                        {
                          required: basicValues?.insurance_backed === true || backedInsurance === true ? true : false,
                          message: FieldErrorMessages.FEE,
                        },
                      ]}
                      key={basicValues ? basicValues?.fee : ""}
                      initialValue={basicValues ? backedInsurance === false ? "" : basicValues?.fee : ""}
                    >
                      <Input
                        id="program_fee"
                        placeholder="Please input your Fee!"
                        disabled={backedInsurance === true ? false : backedInsurance === false ? true : backedInsurance === undefined ? true
                          : disableButtonBasedStatus}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </>

              :
              <>
                <Row>
                  <Col span={12}>
                  <div className="labelContainer">Repayment Account<span className="mandatoryField">*</span></div>

                    <Row>
                      <Col span={7}>
                        <Form.Item
                          label=""
                          name="repayment_account_currency"
                          className="FormContainer"
                          style={{ backgroundColor: "#FAFAFA" }}
                          key={
                            basicValues ? basicValues?.repayment_account?.currency : ""
                          }
                          initialValue={
                            basicValues ? basicValues?.repayment_account?.currency : ""
                          }
                        >

                          <div style={{ height: "43px", padding: "5px 15px", lineHeight: "2.5", borderRadius: "8px", fontSize: "13px" }}  id="repayment_currency">
                            {currencyList &&
                              currencyList.map((item: any, index: number) => {
                                let repaymentcurr = '' as any
                                if (PartyAccountCurrencyDetails === item.id) {
                                  repaymentcurr = item.description
                                } else if (basicValues?.repayment_account?.currency === item.id) {
                                  repaymentcurr = item.description
                                }
                                return repaymentcurr
                              })}
                          </div>

                        </Form.Item>
                      </Col>
                      <Col span={17}
                        style={{ padding: "0 5px" }}
                        className="repaymentAccountContainer"
                      >
                        <Form.Item
                          label=""
                          name="repayment_account"
                          className="FormContainer"
                          id="repayment_account"
                          key={
                            basicValues
                              ? basicValues?.repayment_account?.account_number
                              : ""
                          }
                          initialValue={
                            basicValues
                              ? basicValues?.repayment_account?.account_number
                              : ""
                          }
                          rules={[
                            {
                              required: true,
                              message: FieldErrorMessages.REPAYMENTACC,
                            },
                          ]}
                        >
                          <Select
                            id="repayment_account"
                            showSearch
                            placeholder="Select"
                            optionFilterProp="children"
                            style={{ width: "" }}
                            disabled={disableButtonBasedStatus}
                            suffixIcon={<img src={DropdownIcon} alt="DropdownIcon" />}
                            onChange={
                              (e) => {
                                PartyAccountDetails &&
                                  PartyAccountDetails.map((item: any, index: number) => {
                                    if (e === item.account_number) {
                                      setPartyAccountId(item.id)
                                      setPartyAccountCurrencyDetails(item.currency)
                                    }

                                  })
                              }
                            }

                          >
                            {PartyAccountDetails &&
                              PartyAccountDetails.map((item: any, index: number) => {
                                return (
                                  <Option value={item.account_number} key={item.account_number} id={`${item.account_number}${index}`}>
                                    <div >
                                      <span>
                                        {currencyList &&
                                          currencyList.map((items: any, index: number) => {
                                            let repaymentcurr = '' as any
                                            if (PartyAccountCurrencyDetails === items.id) {
                                              repaymentcurr = items.description
                                            } else if (basicValues?.repayment_account?.currency === items.id) {
                                              repaymentcurr = items.description
                                            } else if (item.currency === items.id) {
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

                        </Form.Item>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label="Overdue Interest Rate"
                      name="overdue_interest_rate"
                      className="FormContainer"
                      rules={[
                        {
                          pattern: InputPatterns.OVERDUEINTRATE,
                          required: false,
                          message: "Please input your Overdue Interest Rate!",
                        },
                      ]}
                      key={basicValues ? basicValues?.overdue_interest_rate : ""}
                      initialValue={basicValues ? basicValues?.overdue_interest_rate : ""}

                    >
                      <Input
                        id="program_overdue_interest_rate"
                        type="number"
                        placeholder="Please input your overdue interest rate!"
                        disabled={disableButtonBasedStatus}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label="Interest Deduction Stage"
                      name="interest_deduction"
                      className="FormContainer"
                      rules={[
                        {
                          required: false,
                          message: FieldErrorMessages.INTDEDUCTION,
                        },
                      ]}
                      key={basicValues ? basicValues?.interest_deduction : ""}
                      initialValue={basicValues ? basicValues?.interest_deduction : ""}

                    >
                      <DropdownField id="program_interest_deduction_stage" disabled={disableButtonBasedStatus} defaultVal={basicValues?.interest_deduction} flag="interestDeduction" onchange={onClickInterestDeduction} />

                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label=" "
                      name="auto_finance"
                      className="FormContainer"
                      rules={[
                        {
                          required: false,
                          message: FieldErrorMessages.AUTOFINANCEINV,
                        },
                      ]}
                      key={"auto_finance"}
                    // initialValue={basicDetailsDatas ? basicDetailsDatas?.payload?.basicDetails?.auto_finance : ""}

                    >
                      <div id="program_autoDebit_for_invoices" className="checkboxClass">Auto Finance Invoices
                        <CheckboxField
                          onchange={(e: any) => setAutoFinanceInvoice(e)}
                          defaultChecked={basicValues ? basicValues?.auto_finance : autoFinanceInvoice}
                          value={basicValues ? basicValues?.auto_finance : autoFinanceInvoice}
                        />

                      </div>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label=" "
                      name="insurance_backed"
                      className="FormContainer"
                      rules={[
                        {
                          required: false,
                          message: FieldErrorMessages.INSBACKED,
                        },
                      ]}
                      key={"backedByInsurance"}
                      initialValue={basicValues ? basicValues?.insurance_backed : backedInsurance}

                    >
                      <div id="program_backed_by_insurance" className="checkboxClass">Backed by Insurance  <CheckboxField
                        onchange={(e: any) => setBackedInsurance(e)}
                        defaultChecked={basicValues ? basicValues?.insurance_backed : backedInsurance}
                        value={basicValues ? basicValues?.insurance_backed : backedInsurance}
                      />
                      </div>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label=" "
                      name="refund_int_early_repay"
                      className="FormContainer"
                      rules={[
                        {
                          required: false,
                          message: FieldErrorMessages.REFUNDINT
                        },
                      ]}
                      key={"refund_int_early_repay"}
                      initialValue={basicValues ? basicValues?.refund_int_early_repay : refundEarlyPay}

                    >
                      <div id="program_refund_int_earlyPay" className="checkboxClass" >Refund Interest during Early Repayment <CheckboxField
                        onchange={(e: any) => setRefundEarlyPay(e)}
                        defaultChecked={basicValues ? basicValues?.refund_int_early_repay : refundEarlyPay}
                        value={basicValues ? basicValues?.refund_int_early_repay : refundEarlyPay}
                      />
                      </div>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label="Fee"
                      name="fee"
                      className="FormContainer"
                      rules={[
                        {
                          required: false,
                          message: FieldErrorMessages.FEE,
                        },
                      ]}
                      key={basicValues ? basicValues?.fee : ""}
                      initialValue={basicValues ? basicValues?.fee : ""}
                    >
                      <Input
                        id="program_fee"
                        placeholder="Please input your Fee!"
                        disabled={backedInsurance === true ? false : backedInsurance === false ? true
                          : disableButtonBasedStatus}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </>
            }

            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  label="Comment Section"
                  name="comments"
                  className="commentField FormContainer"
                  rules={[
                    {
                      required: false,
                      message: FieldErrorMessages.COMMENT,
                    },
                  ]}
                  key={basicValues ? basicValues.comments : ""}
                  initialValue={
                    basicValues ? basicValues.comments : ""
                  }
                >
                  <TextArea
                    id="program_comments"
                    placeholder="Please input your comment!"
                    disabled={disableButtonBasedStatus}
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>
          <Col span={8}>
            <Form.Item
              label={"Upload Document / Attached file "}
              className="FormContainer"
            >
              <div className="UploadCardContainer" id="program_upload_image">
                <UploadImage selectedFiles={selectedFiles}
                  attachmentFiles={
                    basicValues ? basicValues?.attachments ? basicValues?.attachments?.file : [] :
                      []
                  }
                />
              </div>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>

  );
};
export default BasicDetailsForm;
