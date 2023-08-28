
import { Row, Col, message, Card } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import baseurl from "../../../utils/config/url/base";
import httpClient from "../../../utils/config/core/httpClient";
import React ,{ useEffect, useState } from "react";
import { useSelector } from "react-redux";
import OnboardingTab from "../../onboarding/onboardingTabs";
import "../../common/common.scss";
import images from "../../../assets/images";
import moment from "moment";
import { allInterestType, allInterestRateType } from "../../../redux/action";
import { InterimState, ResponseStatus } from "../../../utils/enum/choices";
import CurrencyField from "../function/currency";
import NotFound from "../../../utils/page/500";
import Breadcrumbs from "../heading/breadcrumb";
import imageBaseurl from "../../../utils/config/url/image";

const OnBoardingDetail = () => {
    const Navigator = useNavigate();
    const { state } = useLocation();
    const [onBoardingData] = useState(state as any);
    const [CountryList, SetCountryList] = useState([])
    const { FileAttachIcon } = images;
    const interest_Type_data = useSelector(allInterestType);
    const interest_Rate_Type_data = useSelector(allInterestRateType);

    useEffect(() => {
        httpClient
            .getInstance()
            .get(`${baseurl}api-auth/country/`)
            .then((resp: any) => {
                SetCountryList(resp.data.data);
            });
    }, [])

    const onClickExit = () => {
        Navigator(`/${onBoardingData.fromMenu}`)
    };

    const onClickAction = (buttonKey: string) => {
        // const transitionBody = {
        //     action: buttonKey,
        //     party_id: onBoardingData.data.work_model.t_id
        // }
        // httpClient
        //     .getInstance()
        //     .post(`${baseurl}api/counterparty/transition/`, transitionBody)
        //     .then((response: any) => {
        //         if (response.data.status === ResponseStatus.SUCCESS) {
        //             message.success(response.data.data)
        //             Navigator(`/${onBoardingData.fromMenu}`)
        //         }
        //     })
        const loginlocalItems = localStorage.getItem("login_detail") as any;

        const id =  localStorage.getItem("user") === "Bank" ?onBoardingData?.data?.work_model?.t_id  : JSON.parse(loginlocalItems).party_id
        httpClient
            .getInstance()
            // .post(`${baseurl}api/counterparty/transition/`, body)
            .get(`${baseurl}api/resource/action/status/?action=${buttonKey}&type=accounts.parties&t_id=${id}`)

            .then((response: any) => {
                if (response.data.status === ResponseStatus.SUCCESS) {
                    message.success(response.data.data)
                    // transition(info,buttonKey===Action.DRAFT ? "SUBMIT" : buttonKey,resp.data.data.from_party,resp.data.data.to_party,info.fromMenu,returnRoute)
                    const body = {
                        type: "accounts.parties",
                        t_id: id,
                        action: buttonKey,
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
                                Navigator("/Inbox")
                                message.success(response.data.status)
                            } else {
                                message.error(response.data.data)
                            }
                        })
                        .catch((err) => {
                            // message.error(ErrorMessage.INTRANS)
                            <NotFound />
                        })
                    //  navigate("/Sent")
                }
                // setDisableSubmitBtn(false)
            })
            .catch(() => {
                Navigator("/Notfound")
            })

    }
    const CounterpartyData = [
        {
            label1: "Name",
            value1: onBoardingData.data?.record_datas?.values?.[0]?.fields?.name,
            label2: "Mobile",
            value2: onBoardingData.data?.user_details?.[0].phone
        },
        {
            label1: "Email",
            value1: onBoardingData.data?.user_details?.[0].email,
            label2: "Address",
            value2: onBoardingData.data?.record_datas?.values?.[0]?.fields?.address_line
        },
        {
            label1: "City",
            value1: onBoardingData.data?.record_datas?.values?.[0]?.fields?.city,
            label2: "Country",
            value2: CountryList.map((countrys: any) => {
                let countryValue= ""
                if (countrys.id === onBoardingData.data?.record_datas?.values?.[0]?.fields?.country_code) {
                    // return countrys.country
                    countryValue = countrys.country
                } else if (countrys.country === onBoardingData.data?.record_datas?.values?.[0]?.fields?.country_code) {
                    // return countrys.country
                    countryValue = countrys.country
                }
                return countryValue
            })
        }
    ]
    const LimitData = [
        {
            label1: "Limit",
            value1: <CurrencyField currencyvalue={onBoardingData.data?.pairings?.[0]?.limit_currency_id} amount={onBoardingData.data?.pairings?.[0]?.max_limit_amount} />,
            label2: "Expiry Date",
            value2: moment(onBoardingData.data?.pairings?.[0]?.expiry_date).format("DD-MM-YYYY")
        },
        {
            label1: "Max Invoice Amount",
            value1: <CurrencyField currencyvalue={onBoardingData.data?.pairings?.[0]?.max_invoice_currency_id} amount={onBoardingData.data?.pairings?.[0]?.max_invoice_amount} />,
            label2: "Max Invoice PCT",
            value2: onBoardingData.data?.pairings?.[0]?.max_invoice_percent
        },
        {
            label1: "Max Tenor",
            value1: onBoardingData.data?.pairings?.[0]?.max_tenor,
            label2: "Grace Period",
            value2: onBoardingData.data?.pairings?.[0]?.grace_period
        },
        {
            label1: "Interest Type",
            value1: interest_Type_data.payload.interestType.allInterestType.map((item: any) => {
                if (item.id === onBoardingData.data?.pairings?.[0]?.interest_type_id) {
                    return item.description
                }
            }),
            label2: "Interest Rate Type",
            value2: interest_Rate_Type_data.payload.interestRateType.allInterestRateType.map((item: any) => {
                if (onBoardingData.data?.pairings?.[0]?.interest_type_id === 1) {
                    return "-"
                } else if (item.id === onBoardingData.data?.pairings?.[0]?.interest_rate_type_id) {
                    return item.description
                }
            })
        },
        {
            label1: "Fixed Rate/ Margin",
            value1: onBoardingData.data?.pairings?.[0]?.margin,
            label2: "Comments",
            value2: onBoardingData.data?.pairings?.[0]?.comments
        },
        {
            label1: "Auto Finance",
            value1: onBoardingData.data?.pairings?.[0]?.auto_finance === true ? "Yes" : "No",
            label2: "",
            value2: ""
        }
    ]

    return (
        <React.Fragment>
           <div className="fixedContainer">
        <Breadcrumbs 
        // flag={programData?.fromMenu} 
        // text={programData?.fromMenu} 
        // subText="" 
        Data={onBoardingData}
        onClickExit={onClickExit}
        commentsValue={""}
        flag="onboarding"
        onClickAction={onClickAction}
        />
     
      </div>
         <div className="onboardingDetailContainer mainContentContainer">
            {/* <div className="ProgramDetailContainer">
                <div className="breadcrumbContainer">
                    <span onClick={onClickExit}>{onBoardingData.fromMenu}</span>
                    <img src={BreadcrumbArrow} alt="BreadcrumbArrow" />
                    {onBoardingData.recordType !== "" ?
                        <>
                            <span className="fromMenutext">{onBoardingData.recordType}</span>
                            <img src={BreadcrumbArrow} alt="BreadcrumbArrow" />
                        </> : ""}
                    <span>{onBoardingData.data.type}</span></div>
                <div className="Button_Container">
                    <Button className="ExitButtonContainer" onClick={onClickExit}>
                        Exit
                    </Button>
                     {onBoardingData.fromMenu === "sent" || onBoardingData.data.interim_state === InterimState.COMPLETED || onBoardingData.data.interim_state === InterimState.REJECTED ? "" :
                        <Button
                            className="ExitButtonContainer"
                            onClick={() => onClickAction(Action.REJECT)}
                        >
                            Reject
                        </Button>
                    }
                    {onBoardingData.fromMenu === "sent" || onBoardingData.data.interim_state === InterimState.COMPLETED || onBoardingData.data.interim_state === InterimState.REJECTED ? "" : onBoardingData.fromMenu === "inbox" && onBoardingData.data.interim_state === InterimState.RETURNED
                        || (onBoardingData?.data && onBoardingData?.data?.next_available_transitions && onBoardingData?.data?.next_available_transitions?.values?.length > 0)

                        ?
                        <Button className="SaveButton" onClick={onClickExit}>
                            Release
                        </Button> :
                        <Button
                            className="SaveButtonContainer"
                            htmlType="submit"
                            onClick={() => onClickAction(Action.APPROVE)}
                        >
                            Approve
                        </Button>
                    }
                   
                    {onBoardingData.fromMenu === "sent" || onBoardingData.data.interim_state === InterimState.COMPLETED || onBoardingData.data.interim_state === InterimState.REJECTED ? "" :
                        <Button className="SaveButtonContainer" onClick={() => onClickAction(Action.RETURN)}>
                            Return
                        </Button>
                    }

                </div>
            </div> */}
            <div className="Card_Main_Container">
                <Card className="CardContainer">
                    <>
                        <h2>Onboarding Details</h2>
                        {onBoardingData.fromMenu === "inbox" && onBoardingData.data.interim_state === InterimState.RETURNED ?
                            <div>
                                <OnboardingTab />
                            </div> :
                            <>
                                <Row gutter={24}>
                                    <Col span={5} className="onboardingHeadingText">
                                        <p>Program Type</p>
                                    </Col>
                                    <Col span={7}>
                                        APF
                                        {/* {onBoardingData.data.buyer_details ? onBoardingData.data.buyer_details.program_type ? onBoardingData.data.buyer_details.program_type + " Program" : "-" : "-"} */}
                                    </Col>
                                </Row>

                                <h4>Counterparty Details</h4>
                                {CounterpartyData.map((data: any, index: number) => {
                                    return (
                                        <Row gutter={24} key={index}>
                                            <Col span={5} style={{ color: "#006666", fontSize: "14px", fontFamily: "Poppins" }}>
                                                <p>{data.label1}</p>
                                            </Col>
                                            <Col span={7}>
                                                <p>{data.value1}</p>
                                            </Col>
                                            <Col span={5} style={{ color: "#006666", fontSize: "14px", fontFamily: "Poppins" }}>
                                                <p>{data.label2}</p>
                                            </Col>
                                            <Col span={7}>
                                                <p>{data.value2}</p>
                                            </Col>
                                        </Row>
                                    )
                                })}
                                <h4>Limit Details</h4>
                                {LimitData.map((data: any, index: number) => {
                                    return (
                                        <Row gutter={24} key={index}>
                                            <Col span={5} style={{ color: "#006666", fontSize: "14px", fontFamily: "Poppins" }}>
                                                <p>{data.label1}</p>
                                            </Col>
                                            <Col span={7}>
                                                <p>{data.value1}</p>
                                            </Col>
                                            <Col span={5} style={{ color: "#006666", fontSize: "14px", fontFamily: "Poppins" }}>
                                                <p>{data.label2}</p>
                                            </Col>
                                            <Col span={7}>
                                                <p>{data.value2}</p>
                                            </Col>
                                        </Row>
                                    )
                                })}

                                {onBoardingData.data.record_datas.values[0].fields.account_number ?
                                    <>
                                        <h2>Account Details</h2>
                                        <Row gutter={24}>
                                            <Col span={5} className="onboardingHeadingText">Account Number</Col>
                                            <Col span={7}>
                                                {onBoardingData.data.record_datas.values[0].fields.account_number ? onBoardingData.data.record_datas.values[0].fields.account_number : "-"}
                                            </Col>
                                            <Col span={5} className="onboardingHeadingText">Customer Id</Col>
                                            <Col span={7}>
                                                {onBoardingData.data.record_datas.values[0].fields.customer_id ? onBoardingData.data.record_datas.values[0].fields.customer_id : "-"}
                                            </Col>
                                        </Row>
                                    </>
                                    : ""}
                                {onBoardingData.data.kyc_details.Kyc_information.length > 0 ?
                                    <>
                                        <h2>KYC Details</h2>
                                        <Row gutter={24}>
                                            <Col span={5}> <h4>Document</h4></Col>
                                            <Col span={7}>
                                                <h4>Document in Value</h4>
                                            </Col>
                                            <Col span={7}> <h4> Document in Images </h4></Col>
                                        </Row>
                                        {onBoardingData.data.kyc_details.Kyc_information.length > 0 && onBoardingData.data.kyc_details.Kyc_information[0].uploaded_document.mandatory.map((item: any, index: any) => (
                                            <Row gutter={24} style={{ marginBottom: "20px" }}>
                                                <Col span={5} className="onboardingHeadingText" >{item.DocumentName}</Col>
                                                <Col span={7}>
                                                    {item.DocumentInputField ? item.DocumentInputField : "-"}
                                                </Col>
                                                <Col span={7} style={{ marginBottom: "20px" }}>
                                                    {onBoardingData.data.kyc_details.kyc_attachments.length > 0 && onBoardingData.data.kyc_details.kyc_attachments.map((data: any, index: any) => (
                                                        data.comments === item.DocumentName ?
                                                            <a href={imageBaseurl + data.file_path} target="_blank" key={index}><img src={FileAttachIcon} alt="FileAttach" /> </a>
                                                            : <div></div>
                                                    ))}
                                                </Col>
                                            </Row>
                                        ))}
                                        {onBoardingData.data.kyc_details.Kyc_information.length > 0 && onBoardingData.data.kyc_details.Kyc_information[0].uploaded_document.non_mandatory.map((item: any, index: any) => (
                                            <Row gutter={24} style={{ marginBottom: "20px" }} key={index}>
                                                <Col span={5} className="onboardingHeadingText">{item.DocumentName}</Col>
                                                <Col span={7}>
                                                    {item.DocumentInputField ? item.DocumentInputField : "-"}
                                                </Col>
                                                <Col span={7}>
                                                    {onBoardingData.data.kyc_details.kyc_attachments.length > 0 && onBoardingData.data.kyc_details.kyc_attachments.map((data: any, index: any) => (
                                                        data.comments === item.DocumentName ?
                                                            <a href={imageBaseurl + data.file_path} target="_blank"><img src={FileAttachIcon} alt="FileAttach" /> </a>
                                                            :
                                                            null
                                                    ))}
                                                </Col>

                                            </Row>
                                        ))}
                                    </> : ""
                                }
                                {onBoardingData.data.kyc_details.Remittance_information.length > 0 ?
                                    <>
                                        <h2>Remittance Details</h2>
                                        <Row gutter={24}>
                                            <Col span={5} className="onboardingHeadingText">
                                                <p>Account Number</p>
                                                <p>Account with bank</p>
                                                <p>IFSC code</p>
                                                <p>Comments</p>
                                            </Col>
                                            <Col span={7}>
                                                <p>{onBoardingData.data.kyc_details.Remittance_information.length > 0 && onBoardingData.data.kyc_details.Remittance_information[0].account_id}</p>
                                                <p>{onBoardingData.data.kyc_details.Remittance_information.length > 0 && onBoardingData.data.kyc_details.Remittance_information[0].bank_name}</p>
                                                <p>{onBoardingData.data.kyc_details.Remittance_information.length > 0 && onBoardingData.data.kyc_details.Remittance_information[0].ifsc_code}</p>
                                                <p>{onBoardingData.data.kyc_details.Remittance_information.length > 0 && onBoardingData.data.kyc_details.Remittance_information[0].comments ? onBoardingData.data.kyc_details.Remittance_information[0].comments : "-"}</p>
                                            </Col>
                                            <Col span={5} className="onboardingHeadingText">
                                                <p>Account Name</p>
                                                <p>BIC code</p>
                                                <p>IBAN code</p>
                                            </Col>
                                            <Col span={7}>
                                                <p>{onBoardingData.data.kyc_details.Remittance_information.length > 0 && onBoardingData.data.kyc_details.Remittance_information[0].account_name}</p>
                                                <p>{onBoardingData.data.kyc_details.Remittance_information.length > 0 && onBoardingData.data.kyc_details.Remittance_information[0].bic_code}</p>
                                                <p>{onBoardingData.data.kyc_details.Remittance_information.length > 0 && onBoardingData.data.kyc_details.Remittance_information[0].iban_no ? onBoardingData.data.kyc_details.Remittance_information[0].iban_no : "-"}</p>
                                            </Col>
                                        </Row>
                                    </>
                                    : ""}
                            </>
                        }
                    </>
                </Card>
            </div>

        </div>
        </React.Fragment>
       
    )
}
export default OnBoardingDetail;