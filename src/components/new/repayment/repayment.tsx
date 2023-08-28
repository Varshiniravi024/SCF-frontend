import React, { useEffect, useState } from "react";
import { Spin, Card, Button } from "antd";
import httpClient from "../../../utils/config/core/httpClient";
import baseurl from "../../../utils/config/url/base";
import { Currency } from "../../api/base";
import { useNavigate } from "react-router-dom";
import Heading from "../../common/heading/heading";

const Repayment = () => {
    const [Loading, setLoading] = useState(true)
    const [invoiceData, setInvoiceData] = useState([])
    const [currencyData, setCurrencyData] = useState([]);
    const Navigator = useNavigate();

    const getCurrency = async () => {
        const data = await Currency()
        setCurrencyData(data)
    }

    useEffect(() => {
        getCurrency();
        if (localStorage.getItem("user") !== "Bank") {
            httpClient
                .getInstance()
                .get(`${baseurl}api/finance-request/`)
                .then((resp: any) => {
                    setLoading(false)
                    setInvoiceData(resp.data.data)

                })
                .catch((error) => {
                    setLoading(false)
                    Navigator("/Notfound")
                })
        } else {
            httpClient
                .getInstance()
                .get(`${baseurl}api/finance-request/?customer_id=${localStorage.getItem("repayment_customerID")}`)
                .then((resp: any) => {
                    setLoading(false)
                    setInvoiceData(resp.data.data)

                })
                .catch((error) => {
                    setLoading(false)
                    Navigator("/Notfound")
                })
        }

    }, [])
    // const onFinish = (values: any) => {
    //     httpClient
    //         .getInstance()
    //         .get(`${baseurl}api/finance-request/?customer_id=${values.customer_id}`)
    //         .then((resp: any) => {
    //             setLoading(false)
    //             setInvoiceData(resp.data.data)

    //         })
    //         .catch((error) => {
    //             setLoading(false)
    //             Navigator("/Notfound")
    //         })

    // }
    const onclickDetail = (data: any) => {
        Navigator("/RepaymentDetail", { state: { data: data } })
    }
    const onClickExit = () => {
        Navigator("/RepaymentCustomer")
    }
    const HeadersData = [{
        Type: 'Invoice No', Status: 'Status', InvoiceAmount: 'Invoice Amount', FinanceAmount: 'Outstanding Amount', FinanceDue: 'Finance Date', Due: 'Due Date'
    }]
    return Loading ? <Spin /> : (
        <React.Fragment>
            <div className="fixedContainer">
                <Heading flag="repayment" text="Repayment" subText="" />
            </div>
            <div className="manageScfContainer mainContentContainer" style={{ marginTop: "12px", border: "none" }}>
                {/* <Row gutter={24}>
                    <Col span={18}>
                        <h2>Repayment</h2>
                    </Col>

                </Row> */}
                <Card>
                    {
                        localStorage.getItem("user") === "Bank" ?
                            <>
                                <>
                                    <Button type="default" className="ExitBtnLabel" onClick={onClickExit} id="repaymentBack">
                                        Back
                                    </Button>
                                    <div className='containerTable'>
                                        <div className="OuterDiv">
                                            {HeadersData && HeadersData.map((head: any, index: number) => {
                                                return (
                                                    <div key={index} className='HeadInnerDiv'>
                                                        <h1 className='head' style={{ border: "None" }}>{head.Type}</h1>
                                                        <h1 className='head' style={{ border: "None" }}>{head.Status}</h1>
                                                        <h1 className='head' style={{ border: "None" }}>{head.InvoiceAmount}</h1>
                                                        <h1 className='head' style={{ border: "None" }}>{head.FinanceAmount}</h1>
                                                        <h1 className='head' style={{ border: "None" }}>{head.FinanceDue}</h1>
                                                        <h1 className='head' style={{ border: "None" }}>{head.Due}</h1>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                        <div className='OuterDiv'>
                                            {invoiceData.map((data: any, index: number) => {
                                                return (
                                                    <div key={index} className='InnerDiv'
                                                        onClick={() =>
                                                            onclickDetail(data)
                                                        } id={`repaymentClick${index}`}
                                                    >
                                                        <h5 className='body' id={`repayment_invoiceNo${index}`}>
                                                            {data.invoice_no}
                                                        </h5>
                                                        <h5 className='body' id={`repayment_status${index}`}>
                                                            <div>{data.status}</div>
                                                        </h5>
                                                        <h5 className='body' >
                                                            <div id={`repayment_invoiceAmount${index}`}>
                                                                {currencyData?.map((value: any) => {
                                                                    if (data.invoice_currency === value.id) {
                                                                        return <>{value.description} <span  id={`repayment_amount${index}`}> {new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data.invoice_amount)}</span></>
                                                                    } else if (data.invoice_currency === value.description) {
                                                                        return <>{value.description} <span  id={`repayment_amount${index}`}> {new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data.invoice_amount)}</span></>
                                                                    }
                                                                    return null;
                                                                })}
                                                            </div>
                                                        </h5>
                                                        <h5 className='body' >
                                                            <div id={`repayment_outstandingAmount${index}`}>
                                                                {currencyData?.map((value: any) => {
                                                                    if (data.finance_currency === value.id) {
                                                                        return <>{value.description} <span  id={`repayment_outstanding_amt${index}`}> {new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data.finance_amount)}</span></>
                                                                    } else if (data.finance_currency === value.description) {
                                                                        return <>{value.description} <span  id={`repayment_outstanding_amt${index}`}> {new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data.finance_amount)}</span></>
                                                                    }
                                                                    return null;
                                                                })}
                                                                {/* {data.finance_currency} {data.finance_amount} */}
                                                            </div>
                                                        </h5>
                                                        <h5 className='body'>
                                                            <div  id={`repayment_financeDate${index}`}>
                                                                {data.finance_date}
                                                            </div>
                                                        </h5>
                                                        <h5 className='body' id={`repayment_dueDate${index}`}>
                                                            {data.due_date}
                                                        </h5>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </>
                            </>
                            :
                            <div className='containerTable'>
                                <div className="OuterDiv">
                                    {HeadersData && HeadersData.map((head: any, index: number) => {
                                        return (
                                            <div key={index} className='HeadInnerDiv'>
                                                <h1 className='head' style={{ border: "None" }}>{head.Type}</h1>
                                                <h1 className='head' style={{ border: "None" }}>{head.Status}</h1>
                                                <h1 className='head' style={{ border: "None" }}>{head.InvoiceAmount}</h1>
                                                <h1 className='head' style={{ border: "None" }}>{head.FinanceAmount}</h1>
                                                <h1 className='head' style={{ border: "None" }}>{head.FinanceDue}</h1>
                                                <h1 className='head' style={{ border: "None" }}>{head.Due}</h1>
                                            </div>
                                        )
                                    })}
                                </div>
                                <div className='OuterDiv'>
                                    {invoiceData.map((data: any, index: number) => {
                                        return (
                                            <div key={index} className='InnerDiv'
                                                onClick={() =>
                                                     onclickDetail(data)
                                                } id={`repaymentClick${index}`}
                                            >
                                                <h5 className='body' id={`repayment_invoiceNo${index}`}>
                                                    {data.invoice_no}
                                                </h5>
                                                <h5 className='body' id={`repayment_status${index}`}>
                                                    <div>{data.status}</div>
                                                </h5>
                                                <h5 className='body'>
                                                    <div  id={`repayment_invoiceAmount${index}`}>
                                                        {currencyData?.map((value: any) => {
                                                            if (data.invoice_currency === value.id) {
                                                                return <>{value.description} <span  id={`repayment_amount${index}`}> {data.invoice_amount}</span></>
                                                            } else if (data.invoice_currency === value.description) {
                                                                return <>{value.description} <span  id={`repayment_amount${index}`}> {data.invoice_amount}</span></>
                                                            }
                                                            return null;
                                                        })}
                                                        {/* {data.invoice_currency} */}
                                                    </div>
                                                    {/* <div>{data.invoice_currency}<span> {data.invoice_amount}</span></div> */}
                                                </h5>
                                                <h5 className='body'>
                                                    <div id={`repayment_outstandingAmount${index}`}>
                                                        {currencyData?.map((value: any) => {
                                                            if (data.finance_currency === value.id) {
                                                                return <>{value.description} <span id={`repayment_outstanding_amt${index}`}> {data.repay_total_amount}</span></>
                                                            } else if (data.finance_currency === value.description) {
                                                                return <>{value.description} <span id={`repayment_outstanding_amt${index}`}> {data.repay_total_amount}</span></>
                                                            }
                                                            return null;
                                                        })}
                                                        {/* {data.invoice_currency} */}
                                                    </div>
                                                    {/* <div>{data.finance_currency} {data.finance_amount}</div> */}
                                                </h5>
                                                <h5 className='body'>
                                                    <div id={`repayment_financeDate${index}`}>
                                                        {data.finance_date}
                                                    </div>
                                                </h5>
                                                <h5 className='body'  id={`repayment_dueDate${index}`}>
                                                    {data.due_date}
                                                </h5>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                    }
                </Card>
            </div>

        </React.Fragment>
    )
}
export default Repayment;