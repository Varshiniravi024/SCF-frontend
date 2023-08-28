import React, { useEffect, useState, useRef } from "react";
import { Form, Input, Button, Row, Col, Select, Avatar, message, DatePicker, Spin, AutoComplete, Checkbox } from "antd";
import { useDispatch, useSelector } from "react-redux";
import {
  program_Basicdetails,
  program_counterpartydetails
} from "../../../redux/action";
import { CounterpartyUploadImage } from "../../common/UploadImage/counterpartyUpload";
import { CheckboxField } from "../../common/function/checkbox";
import images from "../../../assets/images";
import httpClient from "../../../utils/config/core/httpClient";
import baseurl from "../../../utils/config/url/base";
import moment from "moment";
import "../manageScf.scss";
import { ErrorMessage, FieldErrorMessages } from "../../../utils/enum/messageChoices";
import { InputPatterns } from "../../../utils/validators/inputPattern";
import { InterestPaidBy, ProgramType, ResponseStatus } from "../../../utils/enum/choices";
import { allCurrency, allInterestType, allInterestRateType, allCountry } from "../../../redux/action";
import { InterestDeduction, InterestPaidByData } from "../../../utils/validators/dropdown";

interface IProps {
  previousPage: any;
  nextpage: any;
  programData: any;
  CounterPartyDetails: any;
}

interface CounterPartyData {
  counterpartyId: number;
  counterpartyName: string;
  counterpartyEmail: string;
  counterpartyNumber: any;
  address: string;
  city: string;
  country: number;
}
const Label = (props: React.PropsWithChildren<IProps>) => {
  const dispatch = useDispatch();
  const { Option } = Select;

  const program_basicdetail_data = useSelector(program_Basicdetails)
  const basicValues = program_basicdetail_data.payload.programBasicdetailsData
  const Country_Datas = useSelector(allCountry)
  const Currency_Data = useSelector(allCurrency);
  // const datas = Reducer(allCurrency)
  const InterestType_Data = useSelector(allInterestType);
  const InterestRatetype_Data = useSelector(allInterestRateType);

  const program_counterpartydetail_data = useSelector(program_counterpartydetails)
  const partyValues = program_counterpartydetail_data?.payload?.programCounterpartydetailsData

  // const basicDetailsDataStore = useSelector(basicDetails);
  // const basicDetailsData = basicDetailsDataStore?.payload
  // const Programdata = Programdatadata?.payload

  const [counterpartyNameDataSource, setCounterpartyNameDataSource] = useState([])
  // const basicDetailsDatas = basicDetailsData && basicDetailsData.payload?.basicDetailsbasicDetails;
  const [form] = Form.useForm();
  const { DatePickerImg, CounterPartiesIcon, DeleteIcon, DropdownIcon } = images;
  const { TextArea } = Input;
  const [selectedCountryId, setSelectedCountryId] = useState(0);
  const [selectedLimitCurrencyId, setSelectedLimitCurrencyId] = useState(0);
  const [selectedCurrencyId, setSelectedCurrencyId] = useState(0);
  const [counterPartyList, setCounterPartyList] = useState([] as any);
  // const [Data, setData] = useState<CounterPartyData>({} as CounterPartyData);
  const [currencyList, SetCurrencyList] = useState([]);
  const [countryList, SetCountryList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [counterpartyInfo, setCounterpartyInfo] = useState([] as any);
  const [userPhone, setUserPhone] = useState("" as any);
  const [userEmail, setUserEmail] = useState("" as any);
  const [countryCode, setCountryCode] = useState("" as any);
  const [fileList, setFileList] = useState([] as any);
  const [disableButton, setDisableButton] = useState(false);
  const [Attachements, setAttachments] = useState([])
  const disableButtonValue = basicValues ? basicValues?.workflowitems ? basicValues?.workflowitems?.interim_state : "" : "";
  const basedOnStatusValue = disableButtonValue === "AWAITING_APPROVAL" ? true : disableButtonValue === "AWAITING_SIGN_A" ? true : disableButtonValue === "AWAITING_SIGN_B" ? true : false
  const [disableButtonBasedStatus, setDisableButtonBasedStatus] = useState(basedOnStatusValue);
  const [Expiry_Date, setExpiry_Date] = useState("");
  const [interestType, setInterestType] = useState("" as string | number);

  const [limitAmtError, setLimitAmtError] = useState(false)
  const [limitAmtValue, setLimitAmtValue] = useState("")
  const [maxInvoiceAmtValue, setMaxInvoiceAmtValue] = useState("")
  const [maxInvoiceAmtError, setMaxInvoiceAmtError] = useState(false)
  const [maxInvoiceAmtError1, setMaxInvoiceAmtError1] = useState(false)
  const [maxTenorValue, setMaxTenorValue] = useState("")
  const [maxTenorError, setMaxTenorError] = useState(false)
  const [maxInvoicePctValue, setMaxInvoicePctValue] = useState("")
  const [maxInvoicePctError, setMaxInvoicePctError] = useState(false)
  const [gracePeriodValue, setgracePeriodValue] = useState("")
  const [gracePeriodError, setgracePeriodError] = useState(false)
  const [gracePeriodError1, setgracePeriodError1] = useState(false)
  const [marginError, setMarginError] = useState(false)
  const [marginValue, setmarginValue] = useState("")
  const [expiryDateError, setexpiryDateError] = useState(false)
  const [expiryValue, setexpiryDateValue] = useState(basicValues ? basicValues.expiry_date : "")
  const [emailerror, setEmailError] = useState(false);
  const [mobileError, setMobileError] = useState(false);
  const [interestRateType, setInterestRateType] = useState(null)
  const [autoFinanceDebit, setAutoFinanceDebit] = useState(false)
  const [autoFinanceInvoice, setAutoFinanceInvoice] = useState(false)
  const [backedInsurance, setBackedInsurance] = useState(false)
  const [rebateBuyer, setRebateBuyer] = useState(false)
  const [refundEarlyPay, setRefundEarlyPay] = useState(false);
  const [intDeduction, setIntDeduction] = useState("");
  const [interestPaidBy, setInterestPaidBy] = useState("")
  const [CounterpartyUid, setCounterpartyUid] = useState('');
  const counterpartyPersonalInfo = useRef("");
  const onchangeLimitCurrency = (id: number) => {
    setSelectedLimitCurrencyId(id);
  };
  const onchangeCurrency = (id: number) => {
    setSelectedCurrencyId(id);
  };
  const onchangeCountry = (id: number) => {
    setSelectedCountryId(id);
    countryList.map((data: any) => {
      if (data.id === id) {
        setCountryCode(data.dial_code);
      }
    });
  };
  const onFinish = async (values: any) => {
    setIsLoading(true);
    await
      setDisableButton(true)
    setDisableButton(false)
    // let programId = localStorage.getItem("program_id") || "";

    let limit_currencyId = 0 as any;
    let max_invoice_type = 0 as any;
    currencyList.map((infos: any) => {
      if (basicValues) {
        if (infos.description === basicValues?.limit_currency) {
          limit_currencyId = infos.id;
        } else if (infos.id === basicValues?.limit_currency) {
          limit_currencyId = infos.id;
        }
        if (infos.description === basicValues?.max_invoice_currency) {
          max_invoice_type = infos.id;
        } else if (infos.id === basicValues?.max_invoice_currency) {
          max_invoice_type = infos.id;

        }
      } else {
        if (infos.description === values.limit_amount_type) {
          limit_currencyId = infos.id;
        } else if (infos.id === values.limit_amount_type) {
          limit_currencyId = infos.id;

        }
        if (infos.description === values.max_invoice_type) {
          max_invoice_type = infos.id;
        } else if (infos.id === values.max_invoice_type) {
          max_invoice_type = infos.id;

        }
      }
    });
    let counterId
    countryList &&
      countryList.map((item: any, index: number) => {
        if (partyValues?.length > 0) {
          if (partyValues?.country_code === item.id) {
            setSelectedCountryId(item.id);
            counterId = item.id
          } else if (partyValues?.country_code === item.country) {
            setSelectedCountryId(item.id);
            counterId = item.id
          }
        } else if (partyValues) {
          if (partyValues?.country_code === item.id) {
            setSelectedCountryId(item.id);
            counterId = item.id
          } else if (partyValues?.country_code === item.country) {
            setSelectedCountryId(item.id);
            counterId = item.id
          }
        }
      })
    let ExpiryDataValue;
    if (expiryValue !== undefined) {
      ExpiryDataValue = moment(expiryValue).format("YYYY-MM-DD")
    } else if (basicValues) {
      if (basicValues?.expiry_date) {
        // let dataft = moment(basicValues?.expiry_date, 'YYYY-MM-DD')
        ExpiryDataValue = basicValues?.expiry_date

      }
    } else {
      ExpiryDataValue = moment(new Date()).format("YYYY-MM-DD")
    }
    console.log("cp cp values", values, "interest type", interestType === "Floating" ? 2 : interestType === "FLOATING" ? 2 : interestType === 2 ? 2 : interestType === "Fixed" ? 1 : interestType === "FIXED" ? 1 : interestType === 1 ? 1 : values.interest_type === "Floating" || values.interest_type === "FLOATING" || values.interest_type === 2 ? 2 : 1)
    // const body = {
    //   name: partyValues ? partyValues?.name !== "" ? partyValues?.name : values.name.toUpperCase() : values.name.toUpperCase(),
    //   address_line: partyValues ? partyValues?.address_line !== "" ? partyValues?.address_line : values.address_line_1 : values.address_line_1,
    //   base_currency: 1,
    //   city: partyValues ? partyValues?.city !== "" ? partyValues.city : values.city : values.city,
    //   state: "Tamil Nadu",
    //   zipcode: "123456",
    //   country_code: counterId ? counterId : selectedCountryId,
    //   counterparty_email: userEmail ? userEmail : partyValues ? partyValues?.user_details?.[0]?.email !== "" ? partyValues?.user_details?.[0]?.email : values.counterparty_email : values.counterparty_email,
    //   counterparty_mobile: partyValues ? partyValues?.user_details?.[0]?.phone !== "" ? partyValues?.user_details?.[0]?.phone : parseInt(values.counterparty_mobile) : parseInt(values.counterparty_mobile),
    //   finance_request_type: "AUTOMATIC",
    //   limit_currency: values.limit_amount_currency,
    //   max_limit_amount: limitAmtValue ? limitAmtValue :
    //     parseInt(values.limit_amount),
    //   expiry_date: ExpiryDataValue !== "Invalid date" ? ExpiryDataValue : basicValues?.expiryDate,
    //   max_invoice_currency: max_invoice_type
    //     ? max_invoice_type
    //     : selectedCurrencyId,
    //   max_invoice_amount: parseInt(maxInvoiceAmtValue),
    //   max_invoice_percent: parseInt(maxInvoicePctValue),
    //   max_tenor: parseInt(maxTenorValue),
    //   grace_period: parseInt(gracePeriodValue),
    //   interest_type: interestType === "Floating" ? 2 : interestType === "FLOATING" ? 2 : interestType === 2 ? 2 : interestType === "Fixed" ? 1 : interestType === "FIXED" ? 1 : interestType === 1 ? 1 : values.interest_type === "Floating" || values.interest_type === "FLOATING" || values.interest_type === 2 ? 2 : 1,
    //   interest_rate_type: interestType === "Fixed" || interestType === "FIXED" || interestType === 1 || values.interest_type === "FIXED" || values.interest_type === "Fixed" || values.interest_type === 1 ? null : interestRateType ? interestRateType : values.interest_rate_type === "Sofr" || values.interest_rate_type === "SOFR" || values.interest_rate_type === 3 ? 3 : values.interest_rate_type === "Libor" || values.interest_rate_type === "LIBOR" || values.interest_rate_type === 2 ? 2 : values.interest_rate_type === "Euribor" || values.interest_rate_type === "EURIBOR" || values.interest_rate_type === 1 ? 1 : null,
    //   margin: marginValue ? marginValue : values.margin,
    //   program_id: basicValues?.id,
    //   //: parseInt(programId),
    //   program_type: basicValues.program_type,
    //   comments: values.comments,
    //   counterparty_uid: CounterpartyUid ? CounterpartyUid : values?.counterparty_uid,
    //   interest_paid_by: interestPaidBy ? interestPaidBy : values.interest_paid_by,
    //   interest_deduction: interestPaidBy === InterestPaidBy.OWNPARTY || values.interest_paid_by === InterestPaidBy.OWNPARTY ? "REPAYMENT" : intDeduction ? intDeduction : values.interest_deduction,
    //   buyer_rebate: rebateBuyer,
    //   buyer_rebate_percent:
    //     // rebateBuyer === false ? 0 : 
    //     values.buyer_rebate_percent ? parseFloat(values.buyer_rebate_percent) : 0,
    //   overdue_interest_rate: values.overdue_interest_rate,
    //   refund_int_early_repay: refundEarlyPay,
    //   auto_debit_invoice: autoFinanceDebit,
    //   insurance_backed: backedInsurance ? backedInsurance : values.insurance_backed,
    //   fee: values.fee !== null ? backedInsurance === false ? null : values.fee : null,
    //   auto_finance: autoFinanceInvoice,



    // };
    console.log("cp cp values bfr body", values)
    // console.log("cp cp values bfr body",userEmail ? userEmail : partyValues ? partyValues?.user_details?.[0]?.email !== "" ? partyValues?.user_details?.[0]?.email : values.counterparty_email : values.counterparty_email)
    console.log("cp cp values bfr body maxTenorValue", maxTenorValue, "INV", values?.max_tenor)
    console.log("cp cp values bfr body interestType", interestType, "INV", values.interest_type)
    console.log("cp cp values bfr body interestRateType", interestRateType, "INV", values.interest_rate_type)
    console.log("cp cp values bfr body backedInsurance", backedInsurance, "INV", values.insurance_backed)
    const body = {
      state: "Tamil Nadu",
      zipcode: "123456",
      finance_request_type: "AUTOMATIC",
      name: values.name.toUpperCase(),
      address_line: values.address_line_1,
      city: values.city,
      base_currency: 1,
      country_code: counterId ? counterId : selectedCountryId,
      counterparty_email: userEmail ? userEmail : partyValues ? partyValues?.user_details?.[0]?.email !== "" ? partyValues?.user_details?.[0]?.email : values.counterparty_email : values.counterparty_email,
      counterparty_mobile: partyValues ? partyValues?.user_details?.[0]?.phone !== "" ? partyValues?.user_details?.[0]?.phone : parseInt(values.counterparty_mobile) : parseInt(values.counterparty_mobile),

      limit_currency: values.limit_amount_currency,
      max_limit_amount: values.limit_amount ? parseInt(values.limit_amount) : limitAmtValue,
      expiry_date: ExpiryDataValue !== "Invalid date" ? ExpiryDataValue : basicValues?.expiryDate,
      max_invoice_currency: max_invoice_type
        ? max_invoice_type
        : selectedCurrencyId,
      max_invoice_amount: parseInt(maxInvoiceAmtValue),
      max_invoice_percent: parseInt(maxInvoicePctValue),
      max_tenor: parseInt(maxTenorValue),
      grace_period: parseInt(gracePeriodValue),
      interest_type: interestType === "Floating" ? 2 : interestType === "FLOATING" ? 2 : interestType === 2 ? 2 : 1,
      //  interestType === 2 ? 2 : interestType === "Fixed" ? 1 : interestType === "FIXED" ? 1 : interestType === 1 ? 1 ,
      // : values.interest_type === "Floating" || values.interest_type === "FLOATING" || values.interest_type === 2 ? 2 : 1,
      interest_rate_type: interestType === "Fixed" || interestType === "FIXED" || interestType === 1
        // || values.interest_type === "FIXED" || values.interest_type === "Fixed" || values.interest_type === 1 
        ? null : interestRateType ? interestRateType : values.interest_rate_type === "Sofr" || values.interest_rate_type === "SOFR" || values.interest_rate_type === 3 ? 3 : values.interest_rate_type === "Libor" || values.interest_rate_type === "LIBOR" || values.interest_rate_type === 2 ? 2 : values.interest_rate_type === "Euribor" || values.interest_rate_type === "EURIBOR" || values.interest_rate_type === 1 ? 1 : null,
      margin: marginValue,
      program_id: basicValues?.id,
      //: parseInt(programId),
      program_type: basicValues?.program_type,
      comments: values.comments,
      counterparty_uid: values?.counterparty_uid,
      interest_paid_by: interestPaidBy,
      interest_deduction: intDeduction,
      buyer_rebate: values.buyer_rebate,
      buyer_rebate_percent: parseFloat(values.buyer_rebate_percent),
      overdue_interest_rate: values.overdue_interest_rate,
      refund_int_early_repay: values.refund_int_early_repay || false,
      auto_debit_invoice: values.auto_debit_invoice,
      insurance_backed: backedInsurance ? backedInsurance : values.insurance_backed,
      fee: values.fee,
      auto_finance: values.autofinance || false,



    };
    console.log("cp cp party body", body)

    if ((partyValues !== null && partyValues?.id !== "") || localStorage.getItem("user") === "Bank") {
      httpClient
        .getInstance()
        .put(`${baseurl}api/counterparty/${partyValues?.pairing_details?.pairing?.[0]?.id}/`, body)
        .then((response: any) => {

          if (response.data.status === ResponseStatus.SUCCESS) {
            message.success(ErrorMessage.SC);
            form.resetFields();
            dispatch(
              program_counterpartydetails(null)
            )
            setDisableButton(false)
            httpClient
              .getInstance()
              .get(`${baseurl}api/counterparty/?program_type=${basicValues.program_type}`)
              .then((resp: any) => {
                const list: any[] = [];
                resp.data.data.map((item: any, index: number) => {
                  if (props.programData.id !== undefined) {
                    if (props.programData.id === item.program_type) {
                      list.push(item);
                      setCounterPartyList(list);

                    } else {
                      setTimeout(() => {
                        setCounterPartyList(resp.data.data);
                      }, 2000);
                    }
                  } else {
                    setTimeout(() => {
                      setCounterPartyList(resp.data.data);
                    }, 2000);
                  }
                  setTimeout(() => {

                    setInterestType(basicValues?.interest_type)
                    setIsLoading(false);
                  }, 2000)


                  if ((
                    values.name && values.name.toUpperCase()) === (item.name).toUpperCase()) {
                    if (fileList.length > 0) {
                      const formdata = new FormData();
                      fileList.map((items: any, index: any) => {
                        formdata.append(`files`, items[0]);
                        formdata.append(`comments`, "counterpartyfile");
                      });
                      formdata.append("pairing", item.pairing_details.pairing[0].id);

                      httpClient
                        .getInstance()
                        .post(`${baseurl}api/resource/file/`, formdata)
                        // .then((response: any) => {
                        // })
                        .catch((err: any) => {
                          setDisableButton(false);

                        })
                    }
                  }

                });
              }).catch((err: any) => {
                setDisableButton(false);
              })
          } else {
            setDisableButton(false);
            message.error(response.data.data)
            props.previousPage("2");
            setIsLoading(false);

          }

        }).catch((err: any) => {
          setDisableButton(false);
          props.previousPage("2");
          setIsLoading(false);
        })
    } else {
      httpClient
        .getInstance()
        .post(`${baseurl}api/counterparty/`, body)
        .then((response: any) => {
          if (response.data.status === ResponseStatus.SUCCESS) {
            message.success(ErrorMessage.SC);
            form.resetFields();
            setDisableButton(false)
            httpClient
              .getInstance()
              .get(`${baseurl}api/counterparty/?program_type=${basicValues.program_type}`)
              .then((resp: any) => {
                setDisableButton(false);
                const list: any[] = [];
                resp.data.data.map((item: any, index: number) => {
                  if (props.programData.id === item.program_type) {
                    list.push(item);
                    setCounterPartyList(list);
                  } else {
                    setTimeout(() => {
                      setCounterPartyList(resp.data.data);
                    }, 2000);
                  }
                  setTimeout(() => {
                    setIsLoading(false);
                  }, 2000)
                  if ((
                    values.name && values.name.toUpperCase()) === (item.name).toUpperCase()) {
                    if (fileList.length > 0) {
                      const formdata = new FormData();
                      fileList.map((items: any, index: any) => {
                        formdata.append(`files`, items[0]);
                        formdata.append(`comments`, "counterpartyfile");
                      });
                      formdata.append("pairing", item.pairing_details.pairing[0].id);

                      httpClient
                        .getInstance()
                        .post(`${baseurl}api/resource/file/`, formdata)
                        .catch((err: any) => {
                          setDisableButton(false);
                        })
                    }
                  }

                });
              }).catch((err: any) => {
                setDisableButton(false);
              })
          } else {
            setDisableButton(false);
            props.previousPage("2");
            setIsLoading(false);
            message.error(response?.data?.status)
          }

        }).catch((err: any) => {
          setDisableButton(false);
          props.previousPage("2");
          setIsLoading(false);
        })
    }


  };
  const onCounterPartyNameSearch = (searchtext: any) => {

    if (searchtext === "") {

      setAttachments([])

    }
    httpClient
      .getInstance()
      .get(`${baseurl}api/counterparty/?party_name=${searchtext}`)
      .then((resp: any) => {
        setCounterpartyNameDataSource(resp.data.data)

      })
  }

  const onCounterPartyNameSelect = async (selectedText: any) => {
    setIsLoading(true)

    await
      counterpartyNameDataSource.map((item: any) => {
        if (item.name === selectedText) {
          console.log("cp onselect item", item)
          dispatch(
            program_counterpartydetails(item)
          )

          setInterval(() => {
            setIsLoading(false)

          }, 3000)
          setAttachments([])
        }
      })
  }
  const onClickInterestDeduction = (e: any) => {
    setIntDeduction(e)

  }

  const onClickParties = async (data: any) => {
    console.log("party list onclick", data)
    setIsLoading(true);
    await
      dispatch(
        program_counterpartydetails(data)
      )

    setInterestType(data?.pairing_details?.pairing?.[0]?.interest_type_id)
    setAttachments(data.attachments.file);
    setIsLoading(true);
    counterpartyPersonalInfo.current = data.user_details.user_email;
    setUserPhone(data ? data.user_details.user_phone : "");

    form.resetFields();
    let countryCode = "" as any
    countryList &&
      countryList.map((item: any, index: number) => {
        if (item.country === data.country_code) {
          countryCode = item.id
        }

      })

    setTimeout(() => {
      setAttachments(data.attachments.file)


    }, 2000)
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);

  };

  const deleteParty = (data: any) => {
    setIsLoading(true)
    httpClient
      .getInstance()
      .delete(`${baseurl}api/counterparty/${data.pairing_details.pairing[0].counter_party_id}/`)
      .then((resp: any) => {
        if (resp.data.status === ResponseStatus.SUCCESS) {
          message.success(resp.data.data)
          httpClient
            .getInstance()
            .get(`${baseurl}api/counterparty/?program_type=${basicValues?.program_type}`)
            .then((resp: any) => {
              setTimeout(() => {
                setCounterPartyList(resp.data.data);
                setIsLoading(false);
              }, 2000);
            })
        } else {
          setIsLoading(false)
          message.error(resp.data.data)
        }
      })
  }
  const onFinishFailed = (errorInfo: any) => {
    props.previousPage("2");
  };
  const onClickprevious = () => {
    props.previousPage("1");
  };
  const onClickNext = () => {
    props.previousPage("3");
  };

  const onClickAddParties = async () => {

    await
      setIsLoading(true);

    form.resetFields();
    dispatch(
      program_counterpartydetails(null)
    )
    setTimeout(() => {
      setIsLoading(false);
    }, 3000)

  };
  const expiryDateFunc = (e: any) => {
    // setExpiry_Date(e._d)
    setexpiryDateValue(e._d)
  }

  useEffect(() => {
    console.log("cp cp entered effect")
    // console.log("expiry",
    // var today = new Date();
    // var tomorrow = today.setDate(today.getDate() + 1)
    // console.log("tomorrow",tomorrow)
    // )
    let ExpiryDataValue;
    if (basicValues || partyValues) {
      setTimeout(() => {
        setLimitAmtValue(basicValues ? basicValues?.max_limit_amount : "")
        setMaxInvoiceAmtValue(partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.max_invoice_amount : basicValues ? basicValues?.max_invoice_amount : "")
        setMaxTenorValue(partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.max_tenor : basicValues ? basicValues?.max_tenor : "")
        setMaxInvoicePctValue(partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.max_invoice_percent : basicValues ? basicValues?.max_invoice_percent : "")
        setgracePeriodValue(partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.grace_period : basicValues ? basicValues?.grace_period : "")
        setmarginValue(partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.margin : basicValues ? basicValues?.margin : "")
        setBackedInsurance(partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.insurance_backed : basicValues ? basicValues?.insurance_backed : false)
        setRebateBuyer(partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.buyer_rebate : basicValues ? basicValues?.buyer_rebate : false)
        setInterestPaidBy(partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.interest_paid_by : basicValues?.interest_paid_by)
        setInterestType(partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.interest_type_id : basicValues ? basicValues?.interest_type : "")
        setInterestRateType(partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.interest_rate_type_id : basicValues ? basicValues?.interest_rate_type : "")
        setIntDeduction(partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.interest_deduction : basicValues?.interest_deduction)


      }, 500)

      if (basicValues?.expiry_date) {
        ExpiryDataValue = moment(basicValues?.expiry_date).format("YYYY-MM-DD")
      }
    } else {
      ExpiryDataValue = moment(new Date()).format("YYYY-MM-DD")
    }
    const disableButtonValue = basicValues ? basicValues?.workflowitems ? basicValues?.workflowitems?.interim_state : "" : "";
    const basedOnStatusValue = disableButtonValue === "AWAITING_APPROVAL" ? true : disableButtonValue === "AWAITING_SIGN_A" ? true : disableButtonValue === "AWAITING_SIGN_B" ? true : false
    setTimeout(() => {
      setDisableButtonBasedStatus(basedOnStatusValue);
    }, 1000);

    httpClient
      .getInstance()
      .get(`${baseurl}api-auth/currency/`)
      .then((resp: any) => {
        SetCurrencyList(resp.data.data);
      });

    httpClient
      .getInstance()
      .get(`${baseurl}api-auth/country/`)
      .then((resp: any) => {
        SetCountryList(resp.data.data);
      });
    if (localStorage.getItem("user") === "Bank") {
      if (basicValues) {
        httpClient
          .getInstance()
          .get(`${baseurl}api/counterparty/?pg_id=${basicValues.id}`)
          .then((resp: any) => {
            setCounterPartyList(resp.data.data)
            setIsLoading(false);

          })
      }
    } else {
      httpClient
        .getInstance()
        .get(`${baseurl}api/counterparty/?program_type=${basicValues?.program_type}`)
        .then((resp: any) => {
          const list: any[] = [];
          if (resp.data.data.length > 0) {
            resp.data.data.map((item: any, index: number) => {
              if (props.programData?.record_datas) {
                list.push(item);
                setTimeout(() => {
                  setCounterPartyList(list);
                  setIsLoading(false);
                }, 2000);
              } else {
                list.push(item);

                setTimeout(() => {
                  setCounterPartyList(list);
                  setIsLoading(false);
                }, 2000);
              }
            });
          } else {
            setIsLoading(false);
          }
        });
    }
  }, []);

  const onClickInterestType = (e: any) => {
    setInterestType(e)
    if (e === 1) {
      setInterestRateType(null)
    }
  };
  const onClickInterestRateType = (e: any) => {
    console.log("e",e)
    setInterestRateType(e)
  }
  const onClickInterestPaid = (e: any) => {
    setInterestPaidBy(e)
  }
  const onCounterPartyIdchange = (e: any) => {
    const body = {
      customer_id: e.target.value,
    };
    httpClient
      .getInstance()
      .post(`${baseurl}api-auth/party/`, body)
      .then((resp: any) => {
        if (resp.data.data.customer_id) {
          message.error(resp.data.data.customer_id, 3);
        }
      });
  };

  const disabledDate = (current: any) => {

    return current && current > moment(basicValues && basicValues?.expiry_date).endOf("day");
  };

  const selectedFiles = (value: any) => {
    setFileList(value)
  }
  const partyEmailOnchange = (e: any) => {
    const body = {
      email: e.target.value
    }
    httpClient
      .getInstance()
      .post(`${baseurl}api-auth/user/verify/`, body)
      .then((response: any) => {
        if (response.data.status === ResponseStatus.SUCCESS) {
          setEmailError(false)
        } else {
          if (response?.data?.data?.email?.[0] === FieldErrorMessages.EMAILE) {
            setEmailError(true)
          } else {
            setEmailError(false)
          }
        }
      })
    setUserEmail(e.target.value)
  }
  const partyMobileOnchange = (e: any) => {
    const body = {
      phone: e.target.value
    }
    httpClient
      .getInstance()
      .post(`${baseurl}api-auth/user/verify/`, body)
      .then((response: any) => {
        if (response.data.status === ResponseStatus.SUCCESS) {
          setMobileError(false)
        } else {
          if (response?.data?.data?.phone?.[0] === ErrorMessage.UPNE) {
            setMobileError(true)
          } else {
            setMobileError(false)
          }
        }
      })
  }
  return isLoading ? (
    <Spin />
  ) : (
    <div className="approvedPayableFinacing">
      <Form
        form={form}
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        validateTrigger="onBlur"
        layout="vertical"
      >
        <Button className="actionButtonSaveContainer" htmlType="submit" disabled={disableButton} loading={disableButton} style={{ width: "155px", position: "fixed", zIndex: 99999 }} id="party_save_add">
          Save & Add</Button>
        {/* <Button className="actionButtonExitContainer" onClick={onClickprevious} id="party_exit" style={{ position: "fixed", zIndex: 99999 }}>
          Exit</Button> */}
        <Button className="nextButtonContainer" onClick={onClickNext} htmlType="submit" id="party_next">Next</Button>
        <Row gutter={24}>
          <Col span={16}>
            <Row>
              <Col span={12}>
                <Form.Item
                  label={<>Counter party Id<span className="mandatoryField">*</span></>}
                  name={"counterparty_uid"}
                  className="FormContainer"
                  key={
                    // counterpartyInfo
                    //   ? counterpartyInfo.counterparty_uid

                    //   :
                    "counterparty_uid"
                  }
                  initialValue={
                    CounterpartyUid ? CounterpartyUid : partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.counterparty_uid : ""
                  }
                  rules={[
                    {
                      required: true,
                      //  required:  true,
                      //  required: partyValues?.pairing_details?.pairing?.[0]?.counterparty_uid ? false : true,
                      message: FieldErrorMessages.PARTYID,
                      // whitespace:true
                    },
                  ]}
                >
                  {/* mandatory console */}
                  {/* {console.log(partyValues)} */}
                  {
                    // localStorage.getItem("user") === "Bank" ?
                    //   <div className="readOnlyField" id="party_id">{partyValues?.pairing_details?.pairing?.[0]?.counterparty_uid} </div>
                    //   :

                    partyValues?.pairing_details?.pairing?.[0]?.counterparty_uid ?
                      <div className="readOnlyField" id="party_uid">{partyValues?.pairing_details?.pairing?.[0]?.counterparty_uid} </div>
                      :
                      <Input
                        id="party_uid"
                        placeholder={"Enter your counter party id"}
                        defaultValue={partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.counterparty_uid : ""}
                        onChange={(e) => {
                          console.log("cp ide", e.target.value)
                          setCounterpartyUid(e.target.value)
                        }}
                      />
                  }
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={<>Counter Party Name<span className="mandatoryField">*</span></>}
                  name="name"
                  className="FormContainer"
                  key={
                    // counterpartyInfo
                    //   ? counterpartyInfo.name
                    //   : 
                    "counterPartyName"
                  }
                  initialValue={partyValues !== null ? partyValues?.name : ""}
                  rules={[
                    {
                      required: true,
                      // partyValues?.name ? false : true,
                      message: FieldErrorMessages.PARTYNAME,
                    },
                  ]}
                >
                  {
                    // localStorage.getItem("user") === "Bank" ?
                    //   <div className="readOnlyField" id="party_name">{partyValues.name} </div>
                    //   :
                    partyValues?.name ?
                      <div className="readOnlyField" id="party_name">{partyValues?.name} </div>
                      :
                      <AutoComplete
                        id="party_name"
                        dataSource={counterpartyNameDataSource && counterpartyNameDataSource.map((value: any) => value.name)}
                        style={{ width: "100%" }}
                        onSelect={onCounterPartyNameSelect}
                        onSearch={onCounterPartyNameSearch}
                        onChange={onCounterPartyNameSearch}
                        placeholder="Select counterparty Name"
                        defaultValue={partyValues !== null ? partyValues?.name : ""}
                      />
                  }
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={24}>
                <Form.Item
                  label={<>Address<span className="mandatoryField">*</span></>}
                  name={"address_line_1"}
                  className="FormContainer"
                  key={
                    // partyValues
                    //   ? partyValues.address
                    //   : 
                    "address"
                  }
                  initialValue={
                    partyValues !== null ? partyValues?.address_line
                      :
                      ""
                  }
                  rules={[
                    {
                      required: partyValues?.address_line ? false : true,
                      // partyValues?.address_line ? false : true,
                      message: FieldErrorMessages.ADDRESS,
                    },
                  ]}
                >
                  {
                    // localStorage.getItem("user") === "Bank" ?
                    //   <div className="readOnlyField" id="party_address">{partyValues.address_line} </div>

                    //   :
                    partyValues?.address_line ?
                      <div className="readOnlyField" id="party_address">{partyValues?.address_line} </div>
                      :
                      <Input placeholder={"Enter your address"}
                        id="party_address"
                        defaultValue={partyValues !== null ? partyValues?.address_line
                          :
                          ""}
                      />
                  }
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  label={<>City<span className="mandatoryField">*</span></>}
                  name={"city"}
                  className="FormContainer"
                  key={partyValues ? partyValues?.city : "city"}
                  initialValue={partyValues !== null ? partyValues?.city : ""}
                  rules={[
                    {
                      required: partyValues?.city ? false : true,
                      // partyValues?.city ? false : true,
                      message: FieldErrorMessages.CITY,
                    },
                  ]}
                >
                  {
                    // localStorage.getItem("user") === "Bank" ?
                    //   <div className="readOnlyField" id="party_city">{partyValues.city} </div>
                    //   :
                    partyValues?.city ?
                      <div className="readOnlyField" id="party_city">{partyValues?.city} </div>
                      :
                      <Input
                        id="party_city"
                        placeholder={"Enter your City"}
                        defaultValue={partyValues !== null ? partyValues?.city : ""}
                      />
                  }
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={<>Country<span className="mandatoryField">*</span></>}
                  name={"country_code"}
                  className="FormContainer"
                  key={
                    partyValues ? partyValues?.country_code : "country"
                  }
                  initialValue={
                    partyValues !== null ? partyValues?.country_code : ""
                  }
                  rules={[
                    {
                      required: partyValues?.country_code ? false  : true,
                      message: FieldErrorMessages.COUNTRY,
                    },
                  ]}
                >
                  {
                    // localStorage.getItem("user") === "Bank" ?
                    //   <div className="readOnlyField">
                    //     {countryList &&
                    //       countryList.map((item: any, index: number) => {
                    //         if (item.country === partyValues?.country_code) {
                    //           return <>{item.country}</>
                    //         } else if (item.id === partyValues?.country_code) {
                    //           return <>{item.country}</>
                    //         }
                    //       })}
                    //   </div> :
                    partyValues?.country_code ?
                      <div className="readOnlyField" id="party_country">
                        {countryList &&
                          countryList.map((item: any, index: number) => {
                            if (item.country === partyValues?.country_code) {
                              return <>{item.country}</>
                            } else if (item.id === partyValues?.country_code) {
                              return <>{item.country}</>
                            }
                          })}
                      </div>
                      :
                      // <DropdownField id="party_country" disabled={disableButtonBasedStatus} defaultVal={partyValues !== null && partyValues.country_code} flag="country" onchange={onchangeCountry} />
                      <Select
                        id={"party_country"}
                        showSearch={true}
                        placeholder="Select"
                        optionFilterProp="children"
                        defaultValue={partyValues !== null && partyValues.country_code}
                        onChange={onchangeCountry}
                        style={{ width: "" }}
                        disabled={disableButtonBasedStatus}
                        suffixIcon={<img src={DropdownIcon} alt="DropdownIcon" />}
                        // onBlur={onchangeCountry}
                      >
                        {/* {console.log("data mappingData",mappingData)} */}
                        {Country_Datas?.payload?.countryData?.allCountry?.map((item: any, index: number) => {
                          return (
                            <Option value={item.id} key={item.country}>
                              {item.country}
                            </Option>
                          );
                        })}
                      </Select>
                  }
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  label={<>Counterparty Email<span className="mandatoryField">*</span></>}
                  name={"counterparty_email"}
                  className="FormContainer"
                  initialValue={
                    userEmail ? userEmail : partyValues !== null ? partyValues?.user_details?.[0]?.email : ""
                  }
                  rules={[
                    {
                      required: userEmail? false : partyValues?.user_details?.[0]?.email ? false :true,
                      pattern: InputPatterns.EMAIL,
                      message: FieldErrorMessages.PARTYEMAIL,
                    },
                  ]}
                >
                  {
                    // localStorage.getItem("user") === "Bank" ?
                    //   <div className="readOnlyField" id="party_email">{partyValues?.user_details?.[0]?.email} </div>
                    //   :
                    partyValues?.user_details?.[0]?.email ?
                      <div className="readOnlyField" id="party_email">{partyValues?.user_details?.[0]?.email} </div>
                      : <Input
                        id="party_email"
                        onChange={(e) => {
                          setEmailError(false)
                          setUserEmail(e.target.value)
                        }}
                        placeholder={"Enter your counter party email"}
                        defaultValue={partyValues !== null ? partyValues?.counterpartyEmail : ""}
                        type="email"
                        onBlur={partyEmailOnchange}
                      />
                  }
                  {emailerror ? <span className="errorMessage">{FieldErrorMessages.EMAILE}</span> : ""}
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={<>Counterparty Mobile<span className="mandatoryField">*</span></>}
                  name={"counterparty_mobile"}
                  className="FormContainer counterpartyMobile"
                  rules={[
                    {
                      required: partyValues?.user_details?.[0]?.phone ? false : userPhone ?false : true,
                      pattern: InputPatterns.MOBILE,
                      message: FieldErrorMessages.PARTYPHONENO,
                    },
                  ]}
                  key={userPhone}
                  initialValue={
                    partyValues !== null ? partyValues?.user_details?.[0]?.phone : userPhone ? userPhone : ""
                  }
                >
                  <Row>
                    <Col span={6}>
                      {partyValues?.user_details?.[0]?.phone ?
                        countryList.map((countrys: any) => {
                          if (countrys.country === partyValues?.country_code) {
                            return <Input readOnly value={"+ " + countrys.dial_code} id="party_country_code" />
                          } else if (countrys.id === partyValues?.country_code) {
                            return <Input readOnly value={"+ " + countrys.dial_code} id="party_country_code" />
                          }

                        }
                        ) :
                        <Input readOnly value={"+ " + countryCode} id="party_country_code" />
                      }
                    </Col>
                    <Col span={18} style={{ padding: "0 0 0 10px" }}>
                      {
                        // localStorage.getItem("user") === "Bank" ?
                        //   <div className="readOnlyField" id="party_mobile">{partyValues?.user_details?.[0]?.phone} </div>
                        //   :
                        partyValues?.user_details?.[0]?.phone ?
                          <div className="readOnlyField" id="party_mobile">{partyValues?.user_details?.[0]?.phone} </div>
                          :
                          <Input
                            id="party_mobile"
                            type="number"
                            maxLength={10}
                            placeholder={"Enter your counter party mobile"}
                            defaultValue={partyValues ? partyValues?.user_details?.[0]?.phone : ""}
                            onBlur={partyMobileOnchange}
                            onChange={() => setMobileError(false)}
                          />
                      }
                      {mobileError ? <span className="errorMessage"> {FieldErrorMessages.PHONENOE}</span> : ""}

                    </Col>
                  </Row>

                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <div className="labelContainer">Limit Amount <span className="mandatoryField">*</span></div>
                <Row>
                  <Col span={8}>
                    <Form.Item
                      label=""
                      name="limit_amount_currency"
                      className="FormContainer"
                      key={"limitCurrency"}
                      rules={[
                        {
                          required: true,
                          message: FieldErrorMessages.LIMITCURR,
                        },
                      ]}
                      initialValue={
                        partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.limit_currency_id : basicValues ? basicValues?.limit_currency : ""
                      }
                    >
                      {/* <DropdownField id="party_limit_currency" disabled={disableButtonBasedStatus} defaultVal={partyValues ? partyValues?.pairing_details?.pairing?.[0]?.limit_currency_id : basicValues?.limit_currency} flag="currency" onchange={onchangeLimitCurrency} /> */}
                      <Select
                        id={"party_limit_currency"}
                        showSearch={true}
                        placeholder="Select"
                        optionFilterProp="children"
                        defaultValue={partyValues ? partyValues?.pairing_details?.pairing?.[0]?.limit_currency_id : basicValues?.limit_currency}
                        onChange={onchangeLimitCurrency}
                        style={{ width: "" }}
                        disabled={disableButtonBasedStatus}
                        suffixIcon={<img src={DropdownIcon} alt="DropdownIcon" />}
                        // onBlur={onchangeLimitCurrency}
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
                  <Col span={1}></Col>
                  {/* {console.log("basic cp", partyValues !== null ?
                    partyValues?.pairing_details?.pairing?.[0]?.max_limit_amount
                    : basicValues ? basicValues?.max_limit_amount : "0")} */}
                  <Col span={15}>
                    <Form.Item
                      label=""
                      name="limit_amount"
                      className="FormContainer"
                      key={"limit_amount"}
                      initialValue={
                        partyValues !== null ?
                          partyValues?.pairing_details?.pairing?.[0]?.max_limit_amount
                          : basicValues ? basicValues?.max_limit_amount :
                            ""
                        //  limitAmtValue
                      }
                      // rules={[
                      //   {
                      //     required: true,
                      //     message: 'Limit is required.',
                      //   },
                      //   () => ({
                      //     async validator(_, value) {
                      //       await new Promise(resolve => setTimeout(resolve, 100));

                      //       console.log('Input Value:', value);

                      //       const pattern = /^\d+(\.\d{1,2})?$/;
                      //       if (!pattern.test(value)) {
                      //         setLimitAmtError(true);
                      //         return Promise.reject('Invalid input format.');
                      //       }

                      //       if (basicValues && parseFloat(value) > parseFloat(basicValues.max_limit_amount)) {
                      //         setLimitAmtError(true);
                      //         return Promise.reject('Limit exceeds basic value.');
                      //       }

                      //       if (
                      //         partyValues &&
                      //         parseFloat(value) > parseFloat(partyValues.pairing_details.pairing[0].max_limit_amount)
                      //       ) {
                      //         setLimitAmtError(true);
                      //         return Promise.reject('Limit exceeds party value.');
                      //       }

                      //       if (parseFloat(value) < parseFloat(maxInvoiceAmtValue)) {
                      //         setLimitAmtError(true);
                      //         return Promise.reject('Limit must be greater than max invoice amount.');
                      //       }

                      //       console.log('All validations passed.');
                      //       setLimitAmtError(false);
                      //       return Promise.resolve();
                      //     },
                      //   }),
                      // ]}
                      // validateStatus={limitAmtError ? 'error' : ''}
                      // help={limitAmtError && 'Error message for limit'}

                      rules={[
                        {
                          required: true,
                          message: FieldErrorMessages.LIMIT,
                        }
                        // ,
                        // ({ getFieldValue }) => ({
                        //   async validator(_, value) {
                        //     await new Promise(resolve => setTimeout(resolve, 100));

                        //     console.log('party error', value);

                        //   console.log("party error",value)

                        //     const pattern = InputPatterns.LIMITAMT;
                        //     const isSuccess = pattern.test(value);
                        //     if (basicValues && parseFloat(value) > parseFloat(basicValues.max_limit_amount)) {
                        //       setLimitAmtError(true);
                        //       return Promise.reject('Limit exceeds basic value.');
                        //     }
                        //     if (
                        //       partyValues &&
                        //       parseFloat(value) > parseFloat(partyValues.pairing_details.pairing[0].max_limit_amount)
                        //     ) {
                        //       setLimitAmtError(true);
                        //       return Promise.reject('Limit exceeds party value.');
                        //     }
                        //     if (parseFloat(value) < parseFloat(maxInvoiceAmtValue)) {
                        //       setLimitAmtError(true);
                        //       return Promise.reject('Limit must be greater than max invoice amount.');
                        //     }

                        //     console.log("party getFieldValue",getFieldValue)
                        //     setLimitAmtError(false);
                        //     return Promise.resolve();

                        //   },
                        // }),

                      ]}

                    //                   validateStatus={limitAmtError ? 'error' : ''}
                    // help={limitAmtError && 'Error message for limit'}
                    >

                      <Input
                        id="party_limit_amount"
                        type="number"
                        placeholder="Enter your limit"
                        onChange={(e) => {
                          setLimitAmtValue(e.target.value)
                          const pattern = InputPatterns.LIMITAMT
                          const isSuccess = pattern.test(e.target.value)
                          if (basicValues?.max_limit_amount) {
                            if (parseFloat(e.target.value) > parseFloat(basicValues?.max_limit_amount)) {

                              setLimitAmtError(true)
                            } else {
                              setLimitAmtError(false)
                            }

                            if (parseFloat(e.target.value) < parseFloat(maxInvoiceAmtValue)) {
                              setMaxInvoiceAmtError(true)
                              setMaxInvoiceAmtError1(false)
                            } else {
                              setMaxInvoiceAmtError(false)
                              setMaxInvoiceAmtError1(false)
                            }

                          } else if (partyValues?.pairing_details?.pairing?.[0]?.max_limit_amount) {
                            if (parseFloat(e.target.value) > parseFloat(partyValues?.pairing_details?.pairing?.[0]?.max_limit_amount)) {

                              setLimitAmtError(true)
                            } else {
                              setLimitAmtError(false)
                            }

                            if (parseFloat(e.target.value) < parseFloat(maxInvoiceAmtValue)) {
                              setMaxInvoiceAmtError(true)
                              setMaxInvoiceAmtError1(false)
                            } else {
                              setMaxInvoiceAmtError(false)
                              setMaxInvoiceAmtError1(false)
                            }
                          }
                        }}
                        defaultValue={
                          partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.max_limit_amount
                            : basicValues ? basicValues?.max_limit_amount
                              :
                              ""
                          // limitAmtValue
                        }
                      />
                    </Form.Item>
                    {limitAmtError === true ? <div className="errorMessage1">{FieldErrorMessages.lIMITAMT}</div> : ""}

                  </Col>
                </Row>
              </Col>
              <Col span={12}>
                <Form.Item
                  label={<>Expiry Date<span className="mandatoryField">*</span></>}
                  name="expiry_date"
                  key="expiryDate"
                  className="FormContainer"
                  initialValue={
                    partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.expiry_date :
                      basicValues
                        ? basicValues?.expiry_date ? basicValues?.expiry_date : ""
                        : ""
                  }
                  rules={[
                    {
                      required:partyValues !== null && partyValues?.pairing_details?.pairing?.[0]?.expiry_date ? false : basicValues ? basicValues?.expiry_date ? false : true: true,
                      message: FieldErrorMessages.EXPIRYDTE,
                    },
                  ]}
                >
                  {/* {console.log("cp date",partyValues)} */}
                  {console.log(basicValues)}
                  <DatePicker
                    // format={"DD-MM-YYYY"}
                    id="party_expiry_date"
                    disabledDate={disabledDate}
                    suffixIcon={<img src={DatePickerImg} alt="pickericon" />}
                    placeholder={partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.expiry_date : basicValues
                      ? basicValues?.expiry_date && basicValues?.expiry_date : ""}
                    className={
                      partyValues !== null && partyValues?.pairing_details?.pairing?.[0]?.expiry_date ? "valueExpiryDate" :
                        basicValues ? basicValues?.expiry_date && basicValues?.expiry_date ? "valueExpiryDate" : "" : ""}
                    onChange={expiryDateFunc}
                    // defaultValue={moment(Programdata
                    //   ? Programdata?.expiryDate ? Programdata?.expiryDate?._i : Programdata?.expiryDate : "")}
                    // value={moment(Programdata
                    //   ? Programdata?.expiryDate ? Programdata?.expiryDate?._i : Programdata?.expiryDate: new Date())}

                    style={{
                      lineHeight: "2.5",
                      borderRadius: "8px",
                      fontSize: "20px",
                      padding: "5px 15px",
                      width: "100%",
                      height: "50px",
                    }}
                  />
                </Form.Item>
                {expiryDateError ? <div className="errorMessage1">{FieldErrorMessages.EXPIRYDATE}</div> : ""}

              </Col>
            </Row>

            <Row>
              <Col span={12}>
                <div className="labelContainer">Max Invoice Amount <span className="mandatoryField">*</span></div>
                <Row>
                  <Col span={8}>
                    <Form.Item
                      label=""
                      name="max_invoice_currency"
                      className="FormContainer"
                      key="maxInvoiceCurrency"
                      initialValue={
                        partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.max_invoice_currency_id : basicValues ? basicValues?.max_invoice_currency : ""
                      }
                      rules={[
                        {
                          required: true,
                          message: FieldErrorMessages.INVCURR,
                        },
                      ]}
                    >
                       <Select
                        id={"party_invoice_currency"}
                        showSearch={true}
                        placeholder="Select"
                        optionFilterProp="children"
                        defaultValue={partyValues ? partyValues?.pairing_details?.pairing?.[0]?.max_invoice_currency_id : basicValues?.max_invoice_currency}
                        onChange={onchangeCurrency}
                        style={{ width: "" }}
                        disabled={disableButtonBasedStatus}
                        suffixIcon={<img src={DropdownIcon} alt="DropdownIcon" />}
                        // onBlur={onchangeCurrency}
                      >
                        {Currency_Data.payload.currencyData.allCurrency?.map((item: any, index: number) => {
                          return (
                            <Option value={item.id} key={item.description}>
                              {item.description}
                            </Option>
                          );
                        })}
                      </Select>
                      {/* <DropdownField id="party_invoice_currency" disabled={disableButtonBasedStatus} defaultVal={partyValues ? partyValues?.pairing_details?.pairing?.[0]?.max_invoice_currency_id : basicValues?.max_invoice_currency} flag="currency" onchange={onchangeCurrency} /> */}
                    </Form.Item>
                  </Col>
                  <Col span={1}></Col>
                  <Col span={15}>
                    <Form.Item
                      label=""
                      name="max_invoice_amount"
                      className="FormContainer"
                      key="max_invoice_amount"
                      initialValue={
                        partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.max_invoice_amount : basicValues ? basicValues?.max_invoice_amount : ""

                      }
                      rules={[
                        {
                          pattern: InputPatterns.INVOICEAMT,
                          required: true,
                          message: FieldErrorMessages.INVAMT,
                        },
                      ]}
                    >
                      <Input
                        id="party_invoice_amount"
                        placeholder="Enter your max inv. amount"
                        onChange={(e) => {
                          setMaxInvoiceAmtValue(e.target.value)
                          if (parseFloat(e.target.value) > parseFloat(basicValues?.max_invoice_amount)) {
                            setMaxInvoiceAmtError1(true)
                            setMaxInvoiceAmtError(false)
                          // } else if (parseFloat(e.target.value) > parseFloat(basicValues?.max_invoice_amount)) {
                          //   setMaxInvoiceAmtError1(true)
                          //   setMaxInvoiceAmtError(false)
                          } else if (parseFloat(e.target.value) > parseFloat(limitAmtValue)) {
                            setMaxInvoiceAmtError(true)
                            setMaxInvoiceAmtError1(false)
                          } else {
                            setMaxInvoiceAmtError(false)
                            setMaxInvoiceAmtError1(false)
                          }
                        }}
                        defaultValue={
                          partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.max_invoice_amount : basicValues ? basicValues?.max_invoice_amount
                            : ""
                          // : maxInvoiceAmtValue
                        }
                      />
                      {maxInvoiceAmtError1 ? <div className="errorMessage">{FieldErrorMessages.INVALIDINVAMT}</div> : ""}
                      {maxInvoiceAmtError ? <div className="errorMessage">{FieldErrorMessages.INVAMTE}</div> : ""}
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col span={12}>
                <Row gutter={24} className="colContainer">
                  <Col span={11}>
                    <Form.Item
                      label={<>Max Inv. PCT<span className="mandatoryField">*</span></>}
                      name="max_invoice_percent"
                      className="FormContainer"
                      key="max_invoice_percent"
                      initialValue={
                        partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.max_invoice_percent :
                          basicValues ? basicValues?.max_invoice_percent
                            : ""
                      }
                      rules={[
                        {
                          pattern: InputPatterns.INVOICEPCT,
                          required: true,
                          message: FieldErrorMessages.INVPCT,
                        },
                      ]}
                    >
                      <Input
                        id="party_invoice_pct"
                        suffix="%"
                        type="number"
                        placeholder="Enter your max invoice pct"
                        onChange={(e) => {
                          setMaxInvoicePctValue(e.target.value)
                          if (basicValues?.max_invoice_percent) {
                            if (parseFloat(e.target.value) > parseFloat(basicValues?.max_invoice_percent)) {
                              setMaxInvoicePctError(true)
                            } else {

                              setMaxInvoicePctError(false)
                            }
                          // } else if (basicValues?.max_invoice_percent) {
                          //   if (parseFloat(e.target.value) > parseFloat(basicValues?.max_invoice_percent)) {
                          //     setMaxInvoicePctError(true)
                          //   } else {

                          //     setMaxInvoicePctError(false)
                          //   }
                          }
                        }}
                        defaultValue={
                          partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.max_invoice_percent :
                            basicValues ? basicValues?.max_invoice_percent
                              : maxInvoicePctValue}
                      />
                      {maxInvoicePctError === true ? <div className="errorMessage">{FieldErrorMessages.INVALIDINVPCT}</div> : ""}
                    </Form.Item>
                  </Col>
                  <Col span={11} style={{ padding: 0 }}>
                    <Form.Item
                      label={<>Max Tenor<span className="mandatoryField">*</span></>}
                      name="max_tenor"
                      className="FormContainer"
                      key="max_tenor"
                      initialValue={
                        partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.max_tenor :
                          basicValues ? basicValues?.max_tenor : ""
                      }

                      rules={[
                        {
                          pattern: InputPatterns.MAXTENOR,
                          required: maxTenorError === true ? false : true,
                          message: FieldErrorMessages.MAXTENOR
                        },
                      ]}
                    >
                      <Input
                        id="party_max_tenor"
                        placeholder="Enter your max tenor"
                        onChange={(e) => {
                          setMaxTenorValue(e.target.value)
                          if (basicValues?.max_tenor) {
                            if (parseFloat(e.target.value) > parseFloat(basicValues?.max_tenor)) {
                              setMaxTenorError(true)
                            } else {
                              setMaxTenorError(false)
                            }

                            if (parseFloat(e.target.value) < parseFloat(gracePeriodValue)) {
                              setgracePeriodError(true)
                            } else if (parseFloat(basicValues?.max_tenor) < parseFloat(gracePeriodValue)) {
                              setgracePeriodError(true)

                            } else {
                              setgracePeriodError(false)
                            }
                          }
                        }}
                        defaultValue={
                          partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.max_tenor : basicValues ? basicValues?.max_tenor
                            : ""
                          // maxTenorValue
                        }
                      />
                    </Form.Item>
                    {maxTenorError === true ? <div className="errorMessage">{FieldErrorMessages.INVALIDMAXTENOR}</div> : ""}

                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col span={12}>
                <Form.Item
                  label={<>Grace Period<span className="mandatoryField">*</span></>}
                  name={"grace_period"}
                  className="FormContainer"
                  key="grace_period"
                  initialValue={
                    partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.grace_period
                      : basicValues ? basicValues?.grace_period : ""
                  }
                >
                  <Input
                    id="party_grace_period"
                    placeholder={"Enter your grace period"}
                    onChange={(e) => {
                      setgracePeriodValue(e.target.value)
                      if (basicValues?.max_tenor) {
                        if (parseFloat(e.target.value) > parseFloat(basicValues?.grace_period)) {
                          setgracePeriodError1(true)
                          setgracePeriodError(false)

                        } else if (parseFloat(e.target.value) > parseFloat(basicValues?.max_tenor)) {
                          setgracePeriodError(true)
                          setgracePeriodError1(false)

                        } else {
                          setgracePeriodError(false)
                          setgracePeriodError1(false)
                        }
                      }
                    }}
                    defaultValue={
                      partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.grace_period :
                        basicValues ? basicValues?.grace_period
                          :
                          ""
                      // gracePeriodValue
                    }
                  />
                  {gracePeriodError1 ? <div className="errorMessage">{FieldErrorMessages.INVALIDGRACEPERIOD}</div> : ""}
                </Form.Item>
                <span className="errorMessage" style={gracePeriodError ? { display: "flex", marginTop: "-23px" } : { display: "none" }}>{FieldErrorMessages.GRACEPERIODE}</span>

              </Col>
              <Col span={12}>
                <Form.Item
                  label={<>Interest Type<span className="mandatoryField">*</span></>}
                  name={"interest_type"}
                  className="FormContainer"
                  key="interest_type"
                  initialValue={
                    partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.interest_type_id :
                      basicValues ? basicValues?.interest_type : interestType ? interestType :
                        ""
                  }
                  rules={[
                    {
                      required: partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.interest_type_id :
                        basicValues ? basicValues?.interest_type : interestType ? false : true,
                      message: FieldErrorMessages.INTTYPE,
                    },
                  ]}
                >
                  {/* <DropdownField id="party_interest_type" disabled={disableButtonBasedStatus} 
                  defaultVal={partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.interest_type_id : basicValues?.interest_type} flag="interestType" onchange={onClickInterestType} /> */}
                  <Select
                        id={"party_interest_type"}
                        showSearch={false}
                        placeholder="Select"
                        optionFilterProp="children"
                        defaultValue={partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.interest_type_id : basicValues?.interest_type}
                        onChange={onClickInterestType}
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
                <Form.Item
                  label={(interestType === "FLOATING" || (interestType === "Floating") || interestType === 2) ? <>Interest Rate Type<span className="mandatoryField">*</span></> : "Interest Rate Type"}
                  name={"interest_rate_type"}
                  className="FormContainer"
                  key="interest_rate_type"
                  initialValue={
                    partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.interest_rate_type_id :
                      // Programdata ? Programdata?.interestRateType :
                      basicValues
                        ? basicValues?.interest_rate_type
                        : ""
                  }
                  rules={[
                    {
                      required: (interestType === "FLOATING" || (interestType === "Floating") || interestType === 2) ? true : false,
                      message: FieldErrorMessages.INTRATETYPE,
                    },
                  ]}
                >
                  {
                    (interestType === "FIXED" || interestType === "Fixed" || interestType === 1
                    )
                      ? (
                        <div className="inputDiv" id="party_interest_rate_type"
                        // style={{
                        //   lineHeight: "2.5",
                        //   borderRadius: "8px",
                        //   fontSize: "13px",
                        //   padding: "5px 15px",
                        //   height: "45px",
                        //   border: 0,
                        //   backgroundColor: " #fafafa"
                        // }}
                        ></div>
                      ) : (
                        // <DropdownField id="party_interest_rate_type" disabled={interestType === "Fixed" || interestType === "FIXED" || interestType === 1 ? true : false}
                        //   defaultVal={
                        //     // Programdata ? Programdata?.interestRateType :
                        //     partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.interest_type_id :
                        //       basicValues
                        //         ? basicValues?.interest_rate_type
                        //         : ""} flag="interestRateType" onchange={onClickInterestRateType} />

                                <Select
                                id={"party_interest_rate_type"}
                                showSearch={false}
                                placeholder="Select"
                                optionFilterProp="children"
                                defaultValue={partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.interest_type_id :
                                  basicValues
                                    ? basicValues?.interest_rate_type
                                    : ""}
                                onChange={onClickInterestRateType}
                                style={{ width: "" }}
                                disabled={interestType === "Fixed" || interestType === "FIXED" || interestType === 1 ? true : false
                              }
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
                  name={"margin"}
                  className="FormContainer"
                  key="margin"
                  initialValue={
                    partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.margin :
                      basicValues ? basicValues?.margin
                        : ""
                  }
                  rules={[
                    {
                      pattern: InputPatterns.MARGIN,
                      required: false,
                      message: FieldErrorMessages.MARGIN,
                    },
                  ]}
                >
                  <Input
                    id="party_margin"
                    placeholder="Please input your fixed rate/margin!"
                    onChange={(e) => {
                      setmarginValue(e.target.value)
                      if (basicValues?.margin) {
                        if (parseFloat(e.target.value) > parseFloat(basicValues.margin)) {
                          setMarginError(true)
                        } else {
                          setMarginError(false)
                        }
                      }
                    }}
                    defaultValue={partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.margin : basicValues ? basicValues?.margin :
                      marginValue}
                  />
                  {marginError ? <div className="errorMessage">{FieldErrorMessages.INVALIDMARGIN}</div> : ""}
                </Form.Item>
              </Col>
            </Row>
            {props?.programData?.record_datas?.values?.[0]?.fields.program_type === ProgramType.APF || props?.programData === ProgramType.APF || props?.programData?.program === ProgramType.APF || props?.programData?.program_type === ProgramType.APF ?
              <>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label={<>Interest Paid By<span className="mandatoryField">*</span></>}
                      name="interest_paid_by"
                      className="FormContainer"
                      key={"interest_paid_by"}
                      initialValue={
                        // intDeduction ? intDeduction : 
                        partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.interest_paid_by : basicValues ? basicValues?.interest_paid_by : ""}
                    >
                      {/* <DropdownField id="party_interest_paid_by" disabled={disableButtonBasedStatus ? disableButtonBasedStatus : false} 
                      defaultVal={interestPaidBy ? interestPaidBy : partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.interest_paid_by : basicValues ? basicValues?.interest_paid_by : ""} flag="interestPaidBy" onchange={onClickInterestPaid} /> */}

                      <Select
                        id={"party_interest_paid_by"}
                        showSearch={false}
                        placeholder="Select"
                        optionFilterProp="children"
                        defaultValue={interestPaidBy ? interestPaidBy : partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.interest_paid_by : basicValues ? basicValues?.interest_paid_by : ""}
                        onChange={onClickInterestPaid}
                        style={{ width: "" }}
                        disabled={disableButtonBasedStatus ? disableButtonBasedStatus : false}
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
                      key="overdue_interest_rate"
                      initialValue={partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.overdue_interest_rate : basicValues ? basicValues?.overdue_interest_rate : ""}

                    >
                      <Input
                        id="party_overdue_interest_rate"
                        type="number"
                        placeholder="Please input your overdue interest rate!"
                        disabled={disableButtonBasedStatus}
                        defaultValue={partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.overdue_interest_rate : basicValues ? basicValues?.overdue_interest_rate : ""}
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
                          required: true,
                          message: FieldErrorMessages.INTDEDUCTION,
                        },
                      ]}
                      key="interest_deduction"
                      initialValue={partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.interest_deduction : basicValues ? basicValues?.interest_deduction : ""}

                    >
                      {
                        interestPaidBy === InterestPaidBy.OWNPARTY || intDeduction === InterestPaidBy.OWNPARTY
                          // ||
                          // (partyValues !== null &&partyValues?.pairing_details?.pairing?.[0]?.interest_deduction )|| (basicValues && basicValues?.interest_deduction)

                          ?
                          // <Input id="program_interest_deduction_stage" readOnly
                          //   disabled={disableButtonBasedStatus}
                          //   value={"REPAYMENT"}
                          //   defaultValue={"REPAYMENT"}
                          // />
                          <div className="inputDiv">REPAYMENT</div>
                          :
                          <Select
                          id={"party_interest_deduction_stage"}
                          showSearch={false}
                          placeholder="Select"
                          optionFilterProp="children"
                          defaultValue={partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.interest_deduction : basicValues?.interest_deduction}
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
                          // <DropdownField id="party_interest_deduction_stage" disabled={disableButtonBasedStatus} defaultVal={partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.interest_deduction : basicValues?.interest_deduction} flag="interestDeduction" onchange={onClickInterestDeduction} />
                      }

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
                      key={"auto_debit_invoice"}
                      initialValue={partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.auto_debit_invoice : basicValues ? basicValues?.auto_debit_invoice : false}

                    >

                      <span id="party_autoDebit_for_invoices" className="checkboxClass">Auto Debit for Invoices not financed
                        <CheckboxField onchange={(e: any) => setAutoFinanceDebit(e)}
                          defaultChecked={partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.auto_debit_invoice : basicValues ? basicValues?.auto_debit_invoice : autoFinanceDebit}
                          value={partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.auto_debit_invoice : basicValues ? basicValues?.auto_debit_invoice : autoFinanceDebit} />

                      </span>
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
                      key={"buyer_rebate"}
                      initialValue={partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.buyer_rebate : basicValues ? basicValues?.buyer_rebate : false}


                    > <span id="party_rebate_for_buyer" className="checkboxClass">Allow Rebate for Buyer
                        <CheckboxField onchange={(e: any) => setRebateBuyer(e)} defaultChecked={partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.buyer_rebate : basicValues ? basicValues?.buyer_rebate : rebateBuyer}
                          value={partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.buyer_rebate : basicValues ? basicValues?.buyer_rebate : rebateBuyer} />
                      </span>
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
                      key="insurance_backed"
                      initialValue={partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.insurance_backed : basicValues ? basicValues?.insurance_backed : backedInsurance}
                    >
                      <span id="party_backed_by_insurance" className="checkboxClass">Backed by Insurance
                        <CheckboxField
                          onchange={(e: any) => setBackedInsurance(e)}
                          defaultChecked={partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.insurance_backed : basicValues ? basicValues?.insurance_backed : backedInsurance}
                          value={partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.insurance_backed : basicValues ? basicValues?.insurance_backed : backedInsurance}
                        />
                      </span>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={12}>
                    <Form.Item
                      label={partyValues !== null && partyValues?.pairing_details?.pairing?.[0]?.buyer_rebate === true ? <>Buyer Rebate PCT<span className="mandatoryField">*</span></> : "Buyer Rebate PCT"}
                      name="buyer_rebate_percent"
                      className="FormContainer"
                      rules={[
                        {
                          required: partyValues !== null && partyValues?.pairing_details?.pairing?.[0]?.buyer_rebate === true ? true :
                            rebateBuyer === true ? true : false,
                          message: FieldErrorMessages.BUYERREBATEPCT,
                        },
                      ]}
                      key={"buyer_rebate_percent"}
                      initialValue={partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.buyer_rebate_percent : basicValues ? basicValues?.buyer_rebate_percent : ""}
                    >
                      {/* {console.log("cp rebateBuyer",rebateBuyer)} */}
                      <Input
                        id="program_rebate_percent"
                        type="number"
                        placeholder="Please input your Buyer Rebate PCT!"
                        disabled={partyValues !== null && partyValues?.pairing_details?.pairing?.[0]?.buyer_rebate === true ? false :
                          rebateBuyer === true ? false : rebateBuyer === false ? true
                            : disableButtonBasedStatus}
                      />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={partyValues !== null && partyValues?.pairing_details?.pairing?.[0]?.insurance_backed === true ? <>Fee<span className="mandatoryField">*</span></> : "Fee"}
                      name="fee"
                      className="FormContainer"
                      rules={[
                        {
                          required: partyValues !== null && partyValues?.pairing_details?.pairing?.[0]?.insurance_backed === true ? true :
                            backedInsurance === true ? true : false,
                          message: FieldErrorMessages.FEE,
                        },
                      ]}
                      key={basicValues ? basicValues?.fee : ""}
                      initialValue={partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.fee : basicValues ? basicValues?.fee : ""}
                    >
                      <Input
                        id="program_fee"
                        placeholder="Please input your Fee!"
                        disabled={partyValues !== null && partyValues?.pairing_details?.pairing?.[0]?.insurance_backed === true ? false :
                          backedInsurance === true ? false : backedInsurance === false ? true : backedInsurance === undefined ? true
                            : disableButtonBasedStatus}
                      />
                    </Form.Item>
                  </Col>
                </Row>
              </>
              :
              props?.programData === ProgramType.RF || props?.programData?.program === ProgramType.RF || props?.programData?.program_type === ProgramType.RF ?
                <>
                  <Row>
                    <Col span={12}>
                      <Form.Item
                        label={<>Interest Deduction Stage<span className="mandatoryField">*</span></>}
                        name="interest_deduction"
                        className="FormContainer"
                        rules={[
                          {
                            required: true,
                            message: FieldErrorMessages.INTDEDUCTION,
                          },
                        ]}
                        key="interest_deduction"
                        initialValue={partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.interest_deduction : basicValues ? basicValues?.interestDeduction : ""}

                      >
                        {/* <DropdownField id="party_interest_deduction_stage" disabled={disableButtonBasedStatus} 
                        defaultVal={basicValues.interestDeduction} 
                        flag="interestDeduction" onchange={onClickInterestDeduction} /> */}
                         <Select
                          id={"party_interest_deduction_stage"}
                          showSearch={false}
                          placeholder="Select"
                          optionFilterProp="children"
                          defaultValue={partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.interest_deduction : basicValues?.interest_deduction}
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
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label="Overdue Interest Rate"
                        name="overdue_interest_rate"
                        key="overdue_interest_rate"
                        className="FormContainer"
                        rules={[
                          {
                            pattern: InputPatterns.OVERDUEINTRATE,
                            required: false,
                            message: FieldErrorMessages.OVERDUEINT,
                          },
                        ]}
                        initialValue={partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.overdue_interest_rate : basicValues ? basicValues?.overdueInterestRate : ""}
                      >
                        <Input
                          id="party_overdue_interest_rate"
                          type="number"
                          placeholder="Please input your overdue interest rate!"
                          disabled={disableButtonBasedStatus}
                        defaultValue={partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.overdue_interest_rate : basicValues ? basicValues?.overdue_interest_rate : ""}

                        />
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
                        key={"insurance_backed"}
                        initialValue={partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.insurance_backed :basicValues ? basicValues?.backedInsurance : backedInsurance}

                      >
                        <span id="party_backed_by_insurance" className="checkboxClass">Backed by Insurance  <CheckboxField
                          onchange={(e: any) => setBackedInsurance(e)}
                          defaultChecked={partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.insurance_backed :basicValues ? basicValues?.backedInsurance : backedInsurance}
                          value={partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.insurance_backed :basicValues ? basicValues?.backedInsurance : backedInsurance}
                        />
                        </span>
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item
                        label={partyValues !== null && partyValues?.pairing_details?.pairing?.[0]?.insurance_backed === true ? <>Fee<span className="mandatoryField">*</span></> : "Fee"}

                        name="fee"
                        className="FormContainer"
                        rules={[
                          {
                            required:partyValues !== null && partyValues?.pairing_details?.pairing?.[0]?.insurance_backed === true ? true :
                            backedInsurance === true ? true : false,
                            message: FieldErrorMessages.FEE,
                          },
                        ]}
                        key="fee"
                        initialValue={partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.fee : basicValues ? basicValues?.fee : ""}

                      >
                        <Input
                          id="party_fee"
                          type="number"
                          placeholder="Please input your Fee!"
                          disabled={partyValues !== null && partyValues?.pairing_details?.pairing?.[0]?.insurance_backed === true ? false : backedInsurance === true ? false : backedInsurance === false ? true : backedInsurance === undefined ? true
                            : disableButtonBasedStatus}
                        />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>

                    <Col span={12}>
                      <Form.Item
                        label=" "
                        name="auto_finance_invoices"
                        className="FormContainer"
                        rules={[
                          {
                            required: false,
                            message: FieldErrorMessages.AUTOFINANCEINV,
                          },
                        ]}
                        key={"auto_finance"}
                        initialValue={partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.auto_finance_invoices :basicValues ? basicValues?.autoFinanceInv : ""}

                      >
                        <span id="party_autoDebit_for_invoices" className="checkboxClass">Auto Finance Invoices  <CheckboxField
                          onchange={(e: any) => setAutoFinanceInvoice(e)}
                          defaultChecked={partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.auto_finance_invoices :basicValues ? basicValues?.autoFinanceInv : autoFinanceInvoice}
                          value={partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.auto_finance_invoices :basicValues ? basicValues?.autoFinanceInv : autoFinanceInvoice}
                        />
                        </span>
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
                            message: FieldErrorMessages.REFUNDINT,
                          },
                        ]}
                        key={"refund_int_early_repay"}
                        initialValue={partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.refund_int_early_repay :basicValues ? basicValues?.refundEarlyRepay : refundEarlyPay}

                      >
                        <span id="party_autoDebit_for_invoices" className="checkboxClass" >Refund Interest during Early Repayment <CheckboxField
                          onchange={(e: any) => setRefundEarlyPay(e)}
                          defaultChecked={partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.refund_int_early_repay :basicValues ? basicValues?.refundEarlyRepay : refundEarlyPay}
                          value={partyValues !== null ? partyValues?.pairing_details?.pairing?.[0]?.refund_int_early_repay :basicValues ? basicValues?.refundEarlyRepay : refundEarlyPay}
                        />
                        </span>
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row>

                  </Row>
                </>
                : <></>
            }
            <Row gutter={24}>
              <Col span={24}>
                <Form.Item
                  label="Comment Section"
                  name={"comments"}
                  className="commentField FormContainer"
                  key={
                    basicValues ? basicValues.comments : "comment"
                  }
                  initialValue={
                    basicValues ? basicValues.comments : ""
                  }
                  rules={[
                    {
                      required: true,
                      message: FieldErrorMessages.COMMENT,
                    },
                  ]}
                >
                  <TextArea
                    id="party_comment"
                    placeholder="Please input your comment!"
                    defaultValue={
                      basicValues ? basicValues.comments : ""
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
          </Col>

          <Col span={8}>
            <>
              <div className="UploadText"> Counterparties </div>
              <div className="UploadCardContainer">
                <Form.Item>
                  <Button
                    id="party_adding"
                    style={{
                      backgroundColor: "transparent",
                      border: "none",
                      width: "100%",
                      padding: 0,
                      height: "100px",
                    }}
                  >
                    <Row
                      className="counterContainer"
                      onClick={onClickAddParties}
                      id="addCounterparty"
                    >
                      <Col span={6}>
                        <div className="addingPlusContainer">+</div>
                      </Col>
                      <Col span={18}>
                        <p>Add Counterparty</p>
                      </Col>
                    </Row>
                  </Button>
                </Form.Item>
                <div className="counyterpartyContainerList" >
                  {counterPartyList.map((data: any, index: any) => (
                    <Row
                      className="CounterpartyForm"
                      key={index}
                      id={`CounterParty${index}`}
                      style={{ cursor: "pointer" }}
                    >
                      <Col span={6} onClick={() => onClickParties(data)} id={data.id}>
                        <Avatar
                          icon={
                            <img src={CounterPartiesIcon} alt="counterParty" />
                          }
                          className="counterPartyImage"

                        />
                      </Col>
                      <Col span={16} style={{ padding: "10px 0 0 20px" }} onClick={() => onClickParties(data)} id={data.id}>
                        <p key={data.name} className="counterpartyName" id={`${data.name}${index}`}>{data.name} </p>
                        <p key={data.id} className="counterpartyid" id={`${data.id}${index}`} >{data.id}</p>
                      </Col>
                      <Col span={2} style={{ display: "flex", justifyContent: "center", alignItems: "center" }} >
                        <img src={DeleteIcon} alt="" onClick={() => deleteParty(data)} style={{ cursor: "pointer" }} id="party_delete"
                        />
                      </Col>
                    </Row>
                  ))}
                </div>
              </div>
            </>
          </Col>
        </Row>
        <Row gutter={24}>
          <Col span={24}>
            <Form.Item
              label={"Upload Document / Attached File"}
              className="FormContainer"
            >
              <div className="UploadCardContainer" id="party_image">
                <CounterpartyUploadImage selectedFiles={selectedFiles} attachmentFiles={Attachements ? Attachements : []} />
              </div>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </div>
  );
};
export default Label;
