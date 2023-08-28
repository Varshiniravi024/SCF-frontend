import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Tabs, Button, message } from "antd";
import OnboardingParty from "./onboardingParty";
import AccountDetails from "./existingCustomer/yes/accountDetails";
import Kyc from "./existingCustomer/no/kyc";
import httpClient from "../../utils/config/core/httpClient";
import baseurl from "../../utils/config/url/base";
import Remittance from "./existingCustomer/no/remittence";
import "./onboarding.scss";
import { ErrorMessage } from "../../utils/enum/messageChoices";
import { Action, OnboardingStatus, ResponseStatus, Status } from "../../utils/enum/choices";
import Breadcrumbs from "../common/heading/breadcrumb";
const OnboardingTabs = () => {
    const { TabPane } = Tabs;
    const navigate = useNavigate();
    const loginData = localStorage.getItem("login_detail") as any;
    const [tabValue, setTabValue] = useState("1");
    const [existingPartyValue, setExistingPartyValue] = useState("")
    const [AccountInputValue, setAccountInputValue] = useState("")
    const [CustomerIdInputValue, setCustomerIdInputValue] = useState("")
    const [AccCurrencyvalue, setAccCurrencyvalue] = useState("")
    //kyc
    const [kycData, setKycData] = useState([]);
    const [NonMandatoryKycData, setNonMandatoryKycData] = useState([]);
    const [KycConfig, setkycConfig] = useState([]);
    const [countryId, setCountryId] = useState("");
    const [mandatoryFileList, setMandatoryFileList] = useState([])
    const [NonMandatoryFileLists, setNonMandatoryFileList] = useState([])
    const [TotalMandatoryDocLists, setTotalMandatoryDocLists] = useState([])
    // Remittance
    const [accountCurrencyValue, setAccountCurrencyValue] = useState("")
    const [accountNumberValue, setAccountNumberValue] = useState("")
    const [accountNameValue, setAccountNameValue] = useState("")
    const [accountWithBankValue, setAccountWithBankValue] = useState("")
    const [bicCodeValue, setBicCodeValue] = useState("")
    const [ifscCodeValue, setIfscCodeValue] = useState("")
    const [ibanValue, setIbanValue] = useState("")
    const [commentsValue, setCommentsValue] = useState("");
    const [partyData, setPartyData] = useState({} as any);
    const [ExistingCustomerData, setExistingCustomerData] = useState("" as any)
    const [remittanceValues, setRemittanceValues] = useState([]);
    const [accountFieldsError, setAccountFieldsError] = useState(false);
    const [CountryList, SetCountryList] = useState("")
    // let CountryLists = ""
    useEffect(() => {

        httpClient
            .getInstance()
            .get(`${baseurl}api-auth/onboarding/remittance-info/`)
            .then((response: any) => {
                setRemittanceValues(response.data.data)
            })
            .catch(() => {
                navigate("/Notfound")
            })

        httpClient
            .getInstance()
            .get(`${baseurl}api/counterparty/onboarding/`)
            .then((resp: any) => {
                SetCountryList(resp.data.data[0].country_code)
                setExistingCustomerData(resp.data.data[0].existing_customer)
            })
            .catch(() => {
                navigate("/Notfound")
            })

    }, [])

    const callback = (key: any) => {
        setTabValue(key);
    };
    const kycConfigValue = (value: any) => {
        setkycConfig(value)
    }
    const countryvalue = (value: any) => {
        setCountryId(value)
    }
    const [disableSubmitBtn, setDisableSubmitBtn] = useState(false)
    const existingParty = (data: any) => {
        setExistingPartyValue(data)
        if (data === "YES") {
            setTabValue("2")
        } else if (data === "NO") {
            setTabValue("4")
        }
    }

    const getPartyData = (data: any) => {
        setPartyData(data)
    }
    const onboardingSubmit = () => {
        setDisableSubmitBtn(true)
        const loginlocalItems = localStorage.getItem("login_detail") as any;
        if (partyData) {
            if (partyData.existing_customer === "YES" && partyData.account_number !== null && partyData.customer_id !== null) {
                if (AccountInputValue !== "" && CustomerIdInputValue !== "" && AccCurrencyvalue !== "") {
                    const body = {
                        account_number: AccountInputValue,
                        customer_id: CustomerIdInputValue,
                        account_currency: AccCurrencyvalue
                    }
                    httpClient
                        .getInstance()
                        .put(`${baseurl}api-auth/party/${JSON.parse(loginlocalItems).party_id}/`, body)
                        .then((response: any) => {
                            if (response.data.status === ResponseStatus.SUCCESS) {
                                // const body = {
                                //     action: Action.SUBMIT,
                                //     party_id: JSON.parse(loginlocalItems).party_id
                                // }
                                httpClient
                                    .getInstance()
                                    // .post(`${baseurl}api/counterparty/transition/`, body)
                                    .get(`${baseurl}api/resource/action/status/?action=SUBMIT&type=accounts.parties&t_id=${JSON.parse(loginlocalItems).party_id}`)
                                    .then((response: any) => {
                                        if (response.data.status === ResponseStatus.SUCCESS) {
                                            message.success(response.data.data)
                                            const body = {
                                                type: "accounts.parties",
                                                t_id: JSON.parse(loginlocalItems).party_id,
                                                action: "SUBMIT",
                                                from_party: response.data.data.from_party,
                                                to_party: response.data.data.to_party,
                                                party: JSON.parse(loginlocalItems).party_id
                                            }
                                            httpClient
                                                .getInstance()
                                                .post(`${baseurl}finflo/transition/`, body)
                                                .then((response: any) => {
                                                    if (response.data.status) {
                                                        // returnRoute(true)
                                                        setTimeout(()=>{
                                                            navigate("/Inbox")
                                                        },1000)
                                                        message.success(response.data.status)
                                                    } else {
                                                        message.error(response.data.data)
                                                    }
                                                })
                                                .catch((err) => {
                                                    // message.error(ErrorMessage.INTRANS)
                                                    navigate("/Notfound")
                                                })

                                        }
                                        setDisableSubmitBtn(false)
                                    })
                                    .catch(() => {
                                        navigate("/Notfound")
                                    })
                            } else {
                                setDisableSubmitBtn(false)
                            }

                        })
                        .catch(() => {
                            navigate("/Notfound")
                        })
                } else {
                    message.error(ErrorMessage.KFAC)
                    setTabValue("2");
                    setDisableSubmitBtn(false)
                }
            } else if (partyData.existing_customer === "YES"
                && partyData.account_number === null && partyData.customer_id === null
            ) {
                if (AccountInputValue !== "" && CustomerIdInputValue !== "" && AccCurrencyvalue !== "") {
                    const body = {
                        account_number: AccountInputValue,
                        customer_id: CustomerIdInputValue,
                        account_currency: AccCurrencyvalue
                    }
                    httpClient
                        .getInstance()
                        .put(`${baseurl}api-auth/party/${JSON.parse(loginlocalItems).party_id}/`, body)
                        .then((response: any) => {
                            if (response.data.status === ResponseStatus.SUCCESS) {
                                // const body = {
                                //     action: Action.SUBMIT,
                                //     party_id: JSON.parse(loginlocalItems).party_id
                                // }
                                httpClient
                                    .getInstance()
                                    // .post(`${baseurl}api/counterparty/transition/`, body)
                                    .get(`${baseurl}api/resource/action/status/?action=SUBMIT&type=accounts.parties&t_id=${JSON.parse(loginlocalItems).party_id}`)
                                    .then((response: any) => {
                                        if (response.data.status === ResponseStatus.SUCCESS) {
                                            message.success(response.data.data)
                                            const body = {
                                                type: "accounts.parties",
                                                t_id: JSON.parse(loginlocalItems).party_id,
                                                action: "SUBMIT",
                                                from_party: response.data.data.from_party,
                                                to_party: response.data.data.to_party,
                                                party: JSON.parse(loginlocalItems).party_id
                                            }
                                            httpClient
                                                .getInstance()
                                                .post(`${baseurl}finflo/transition/`, body)
                                                .then((response: any) => {
                                                    if (response.data.status) {
                                                        // returnRoute(true)
                                                        setTimeout(()=>{
                                                            navigate("/Inbox")
                                                        },1000)
                                                        message.success(response.data.status)
                                                    } else {
                                                        message.error(response.data.data)
                                                    }
                                                })
                                                .catch((err) => {
                                                    // message.error(ErrorMessage.INTRANS)
                                                    navigate("/Notfound")
                                                })
                                            // navigate("/Sent")

                                        }
                                        setDisableSubmitBtn(false)

                                    })
                                    .catch(() => {
                                        navigate("/Notfound")
                                    })
                            } else {
                                setDisableSubmitBtn(false)
                            }
                        })
                        .catch(() => {
                            navigate("/Notfound")
                        })
                } else {
                    message.error(ErrorMessage.KFAC)
                    setTabValue("2");
                    setDisableSubmitBtn(false)
                }
            } else {
                if (TotalMandatoryDocLists.length !== mandatoryFileList.length) {
                    message.error(ErrorMessage.PUM)
                    setTabValue("4");
                    setDisableSubmitBtn(false)
                } else if (countryId === "" || KycConfig.length === 0 || kycData.length === 0) {
                    message.error(ErrorMessage.PUKYC)
                    setTabValue("4");
                    setDisableSubmitBtn(false)
                } else if (CountryList === "UNITED ARAB EMIRATES") {
                    if (accountWithBankValue === "" || accountNameValue === ""
                        || bicCodeValue === "") {
                        message.error(ErrorMessage.PMF)
                        setTabValue("3");
                        setDisableSubmitBtn(false)
                    } else {
                        submitData()
                    }
                } else if (CountryList === "INDIA") {
                    if (accountWithBankValue === "" || accountNameValue === ""
                        || accountNumberValue === "" || accountCurrencyValue === ""
                        || bicCodeValue === "" || ifscCodeValue === "") {
                        message.error(ErrorMessage.PMF)
                        setTabValue("3");
                        setDisableSubmitBtn(false)
                    } else {
                        submitData()
                    }
                } else if (CountryList === "CHINA" || CountryList === "SINGAPORE" || CountryList === "HONG KONG") {
                    if (accountWithBankValue === "" || accountNameValue === ""
                        || accountNumberValue === "" || accountCurrencyValue === ""
                        || bicCodeValue === "") {
                        message.error(ErrorMessage.PMF)
                        setTabValue("3");
                        setDisableSubmitBtn(false)
                    } else {
                        submitData()
                    }
                } else {
                    setDisableSubmitBtn(false)
                }
                // else if (accountWithBankValue === "" || accountNameValue === "" 
                // // || accountNumberValue === "" 
                // || bicCodeValue === "") {
                //     message.error("Please fill the Mandatory fields")
                //     setTabValue("3");
                //     setDisableSubmitBtn(false)
                // }

            }
        }
    }
    const submitData = () => {
        const loginlocalItems = localStorage.getItem("login_detail") as any;

        setDisableSubmitBtn(true)
        const KYCbody = {
            client_id: JSON.parse(loginlocalItems).party_id,
            country: countryId,
            kyc_config: KycConfig,
            uploaded_document: {
                mandatory: kycData,
                non_mandatory: NonMandatoryKycData
            }
        }
        const formdata = new FormData();

        httpClient
            .getInstance()
            .post(`${baseurl}api-auth/onboarding/kyc-info/`, KYCbody)
            .then((response) => {
                if (response.data.status === ResponseStatus.SUCCESS) {
                    const loginlocalItems = localStorage.getItem("login_detail") as any;
                    formdata.append(`party`, JSON.parse(loginlocalItems).party_id);

                    mandatoryFileList.map((item: any) => {
                        formdata.append(`files`, item.files);
                        formdata.append(`comments`, item.filename);
                        return null;
                    })
                    NonMandatoryFileLists.map((item: any) => {
                        formdata.append(`files`, item.files);
                        formdata.append(`comments`, item.filename);
                        return null;
                    })
                    httpClient
                        .getInstance()
                        .post(`${baseurl}api/resource/file/`, formdata)
                        .then((response) => {
                            const body = {
                                client_id: JSON.parse(loginlocalItems).party_id,
                                bank_name: accountWithBankValue,
                                account_name: accountNameValue,
                                account_id: accountNumberValue,
                                bic_code: bicCodeValue,
                                iban_no: ibanValue,
                                ifsc_code: ifscCodeValue,
                                comments: commentsValue,
                                currency: accountCurrencyValue
                            }
                            httpClient
                                .getInstance()
                                .post(`${baseurl}api-auth/onboarding/remittance-info/`, body)
                                .then((response: any) => {
                                    if (response.data.status === ResponseStatus.SUCCESS) {
                                        message.success(response.data.data)
                                        httpClient
                                            .getInstance()
                                            .get(`${baseurl}api-auth/party/?party_type=bank`)
                                            .then((resp: any) => {
                                                if (response.data.status === ResponseStatus.SUCCESS) {

                                                    // const transionBody = {
                                                    //     action: Action.SUBMIT,
                                                    //     party_id: JSON.parse(loginlocalItems).party_id,
                                                    // }
                                                    httpClient
                                                        .getInstance()
                                                        // .post(`${baseurl}api/counterparty/transition/`, transionBody)
                                                        .get(`${baseurl}api/resource/action/status/?action=SUBMIT&type=accounts.parties&t_id=${JSON.parse(loginlocalItems).party_id}`)

                                                        .then((response: any) => {
                                                            if (response.data.status === ResponseStatus.SUCCESS) {
                                                                message.success(response.data.data)
                                                                const body = {
                                                                    type: "accounts.parties",
                                                                    t_id: JSON.parse(loginlocalItems).party_id,
                                                                    action: "SUBMIT",
                                                                    from_party: response.data.data.from_party,
                                                                    to_party: response.data.data.to_party,
                                                                    party: JSON.parse(loginlocalItems).party_id
                                                                }
                                                                httpClient
                                                                    .getInstance()
                                                                    .post(`${baseurl}finflo/transition/`, body)
                                                                    .then((response: any) => {
                                                                        if (response.data.status) {
                                                                            // returnRoute(true)
                                                                            
                                                                            message.success(response.data.status)
                                                                            setTimeout(()=>{
                                                                                navigate("/Inbox")
                                                                            },1000)
                                                                        } else {
                                                                            message.error(response.data.data)
                                                                        }
                                                                    })
                                                                    .catch((err) => {
                                                                        // message.error(ErrorMessage.INTRANS)
                                                                        navigate("/Notfound")
                                                                    })

                                                            } else {
                                                                setDisableSubmitBtn(false)

                                                            }
                                                        })
                                                        .catch(() => {
                                                            navigate("/Notfound")
                                                        })
                                                } else {
                                                    message.error(response.data.data)
                                                    setDisableSubmitBtn(false)

                                                }
                                            })
                                            .catch(() => {
                                                navigate("/Notfound")
                                            })
                                    } else {
                                        message.error(ErrorMessage.IRD)
                                        setDisableSubmitBtn(false)
                                    }
                                })
                                .catch(() => {
                                    navigate("/Notfound")
                                })
                        })
                        .catch((err: any) => {
                            message.error(ErrorMessage.INFU)
                            setDisableSubmitBtn(false)
                        })
                } else {
                    message.error(ErrorMessage.INKYCD)
                    setDisableSubmitBtn(false)

                }
            }).catch((err: any) => {
                setDisableSubmitBtn(false)
                navigate("/Notfound")
            })
            .catch((err: any) => {
                setDisableSubmitBtn(false)
            })
    }
    const customerDetails = (data: any) => {
        setCustomerIdInputValue(data)
    }
    const accountCurrencyDetails = (data: any) => {
        setAccCurrencyvalue(data);
    }
    const accountDetails = (data: any, flag: any) => {
        if (data !== "") {
            setAccountInputValue(data)
            setAccountFieldsError(false)
        } else {
            setAccountFieldsError(true)

        }


    }
    const accountCurrency = (data: any) => {
        setAccountCurrencyValue(data)
    }
    const accountNumber = (data: any) => {
        setAccountNumberValue(data)
    }
    const accountName = (data: any) => {
        setAccountNameValue(data)
    }
    const accountWithBank = (data: any) => {
        setAccountWithBankValue(data)
    }
    const bicCode = (data: any) => {
        setBicCodeValue(data)
    }
    const ifscCode = (data: any) => {
        setIfscCodeValue(data)
    }
    const iban = (data: any) => {
        setIbanValue(data)
    }
    const comment = (data: any) => {
        setCommentsValue(data)
    }

    const RemittanceInputValues = (data: any) => {
        console.log(data)
    }
    const kycInfosNonMandatory = (datas: any) => {
        setNonMandatoryKycData(datas)
    }
    const kycInfos = (datas: any) => {
        setKycData(datas)
    }
    const mandatoryfilelist = (file: any) => {
        setMandatoryFileList(file)
    }
    const NonMandatoryfileList = (file: any) => {
        setNonMandatoryFileList(file)
    }
    const totalMandatoryDocList = (totalList: any) => {
        setTotalMandatoryDocLists(totalList)
    }
    const remittanceData = (remittanceDatas: any) => {
        console.log(remittanceDatas)

    }
    const items = [
        {
            label:"Party Details",
            key:"1",
            children: <OnboardingParty existingParty={existingParty} partyData={partyData} getPartyData={getPartyData} ExistingCustomerData={ExistingCustomerData} />
        },
        ...(existingPartyValue === "YES") ?

        [{
            label:"Account Details",
            key:"2",
            children:  <AccountDetails account={accountDetails} customer={customerDetails} accCurrency={accountCurrencyDetails} partyData={partyData} accountFieldsError={accountFieldsError} />
        }] : [],
        ...(existingPartyValue === "NO") ?

        [{
            label:"KYC Info",
            key:"4",
            children:   <Kyc
            kycInfos={kycInfos}
            kycConfigValue={kycConfigValue}
            countryValue={countryvalue}
            mandatoryfilelist={mandatoryfilelist}
            nonMandatoryfileList={NonMandatoryfileList}
            kycInfosNonMandatory={kycInfosNonMandatory}
            totalMandatoryDocList={totalMandatoryDocList}

        />
        }] : [],
        ...(existingPartyValue === "NO") ?

        [{
            label:"Remittance Info",
            key:"3",
            children:  <Remittance
            accountCurrency={accountCurrency}
            accountNumber={accountNumber}
            accountName={accountName}
            accountWithBank={accountWithBank}
            bicCode={bicCode}
            ifscCode={ifscCode}
            iban={iban}
            comment={comment}
            inputValues={RemittanceInputValues}
            remittanceData={remittanceData}
            remittanceValues={remittanceValues}
        />
        }] : [],
    ]
    return (
        <React.Fragment>
 <div className="fixedContainer">
 <Breadcrumbs 
        // flag={programData?.fromMenu} 
        // text={programData?.fromMenu} 
        // subText="" 
        Data={"Onboarding"}
        onClickExit={onboardingSubmit}
        commentsValue={commentsValue}
        flag="cponboarding"
        onClickAction={onboardingSubmit}

        />
            </div>
<div className="OnboadingTabsContainer mainContentContainer">
            {/* <h1>Onboarding</h1> */}
            {existingPartyValue === "YES" || existingPartyValue === "NO" ?
                <Button
                    onClick={onboardingSubmit}
                    className="onboardingSubmit"
                    disabled={JSON.parse(loginData).onboarding_status === OnboardingStatus.STB && JSON.parse(loginData).status === Status.IN_PROGRESS ? true : disableSubmitBtn}
                    id="onboarding_submit"
                >Submit</Button>
                : ""}
            <Tabs defaultActiveKey="1" onChange={callback} activeKey={tabValue}
            items={items}
            />
        </div>
        </React.Fragment>
        
    )
}
export default OnboardingTabs