import React, { useEffect, useState } from "react";
import { Spin, Card } from "antd";
import httpClient from "../../utils/config/core/httpClient";
import baseurl from "../../utils/config/url/base";
import { Currency } from "../api/base";
import { useNavigate } from "react-router-dom";
import CurrencyField from "../common/function/currency";
import Heading from "../common/heading/heading";

const PendingInvoices = () => {
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
        httpClient
            .getInstance()
            .get(`${baseurl}api/invoice/pending/`)
            .then((resp: any) => {
                setInvoiceData(resp.data.data)
                setLoading(false)
            }).catch((err: any) => {
                setLoading(false)

            })
            .catch(() => {
                Navigator("/Notfound")
            })

    }, [])

    const onclickDetail = (data: any) => {
        Navigator("/PendingInvoiceDetail", { state: { data: data } })
    }
    // const onClickExit = () => {
    //     Navigator("/PendingInvoices")
    // }
    const HeadersData = [{
        Type: 'Invoice No', Status: 'Status', InvoiceAmount: 'Invoice Amount', FinanceAmount: 'Outstanding Amount', FinanceDue: 'Finance Date', Due: 'Due Date'
    }]
    return Loading ? <Spin /> : (
        <React.Fragment>
            <div className="fixedContainer">
                <Heading flag="pendingInvoice" text="Pending Invoices" subText="" />
            </div>
            <div className="manageScfContainer mainContentContainer" style={{ border: "none" }}>
                {/* <div className="HeadingTxt"> Pending Invoices</div> */}
                <Card>
                    {
                        localStorage.getItem("user") === "Bank" ?
                            <>
                                <>
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
                                                        } id={`pendingInvoiceClick${index}`}
                                                    >
                                                        <h5 className='body' id={`pendingInvoice_invoiceNo${index}`}>
                                                            {data.invoice_no}
                                                        </h5>
                                                        <h5 className='body' id={`pendingInvoice_status${index}`}>
                                                            <div>{data.status}</div>
                                                        </h5>
                                                        <h5 className='body' id={`pendingInvoice_invoiceAmount${index}`}>
                                                            <CurrencyField currencyvalue={data.invoice_currency} amount={data.amount} />
                                                        </h5>
                                                        <h5 className='body'  id={`pendingInvoice_outstandingAmount${index}`}>
                                                            <CurrencyField currencyvalue={data?.finance_currency} amount={data?.outstanding_amount} />
                                                        </h5>
                                                        <h5 className='body'>
                                                            <div id={`pendingInvoice_financeDate${index}`}>
                                                                {data?.finance_details ? data?.finance_details?.[0]?.finance_date : "-"}
                                                            </div>
                                                        </h5>
                                                        <h5 className='body' id={`pendingInvoice_dueDate${index}`}>
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
                                                }  id={`pendingInvoiceClick${index}`}
                                            >
                                                <h5 className='body' id={`pendingInvoice_invoiceNo${index}`}>
                                                    {data.invoice_no}
                                                </h5>
                                                <h5 className='body' id={`pendingInvoice_status${index}`}>
                                                    <div>{data.status}</div>
                                                </h5>
                                                <h5 className='body' id={`pendingInvoice_invoiceAmount${index}`}>
                                                    <div>
                                                        {data.amount ?
                                                            currencyData?.map((value: any) => {
                                                                if (data.invoice_currency === value.id) {
                                                                    return <>{value.description} <span  id={`pendingInvoice_amount${index}`}> {data.amount ? data.amount : "-"}</span></>
                                                                } else if (data.invoice_currency === value.description) {
                                                                    return <>{value.description} <span  id={`pendingInvoice_amount${index}`}> {data.amount ? data.amount : "-"}</span></>
                                                                }
                                                                return null;
                                                            }) : "-"}
                                                        {/* {data.invoice_currency} */}
                                                    </div>
                                                    {/* <div>{data.invoice_currency}<span> {data.invoice_amount}</span></div> */}
                                                </h5>
                                                <h5 className='body'>
                                                    <div id={`pendingInvoice_outstandingAmount${index}`}>
                                                        {currencyData?.map((value: any) => {
                                                            if (data.finance_currency === value.id) {
                                                                return <>{value.description} <span id={`pendingInvoice_outstanding_amt${index}`}> {data.outstanding_amount}</span></>
                                                            } else if (data.finance_currency === value.description) {
                                                                return <>{value.description} <span id={`pendingInvoice_outstanding_amt${index}`}> {data.outstanding_amount}</span></>
                                                            }
                                                            return null;
                                                        })}
                                                        {/* {data.invoice_currency} */}
                                                    </div>
                                                    {/* <div>{data.finance_currency} {data.finance_amount}</div> */}
                                                </h5>
                                                <h5 className='body'>
                                                    <div id={`pendingInvoice_financeDate${index}`}>
                                                        {data?.finance_details ? data?.finance_details?.[0]?.finance_date ? data?.finance_details?.[0]?.finance_date : "-" : "-"}

                                                    </div>
                                                </h5>
                                                <h5 className='body' id={`pendingInvoice_dueDate${index}`}>
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
export default PendingInvoices;