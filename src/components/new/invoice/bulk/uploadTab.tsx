import React, { useState, useEffect } from "react";
import { Tabs, Button, Spin, message, Card } from "antd";
import Complete from "./completeFile";
import InComplete from "./incompleteFiles";
import { useNavigate, useLocation } from "react-router";
import httpClient from "../../../../utils/config/core/httpClient";
import baseurl from "../../../../utils/config/url/base";
import { transition } from "../../../api/finfloTransition";
import { Action, ResponseStatus, TransactionType } from "../../../../utils/enum/choices";
import Breadcrumbs from "../../../common/heading/breadcrumb";
const UploadTab = () => {
    const { TabPane } = Tabs;
    const navigate = useNavigate();
    const { state } = useLocation();
    const [upload_detail] = useState(state as any);
    const [tabValue, setTabValue] = useState("1");
    const [IncompleteDatas, setIncompleteData] = useState([]);
    const [completeDatas, setcompleteData] = useState([])
    const [isLoading, setIsLoading] = useState(false);
    const [showCreateInvoiceBtn, SetShowCreateInvocieBtn] = useState(false);
    const [CompletedInvoiceDatas, setCompletedInvoiceDatas] = useState([]);
    const [InCompletedInvoiceDatas, setInCompletedInvoiceDatas] = useState([]);
    const callback = (key: any) => {
        setTabValue(key);
    };

    useEffect(() => {
        console.log("api/invoice/upload/?type=no")
        setIsLoading(true)
        // setInterval(()=>{
            IncompleteInvoice();
            // CompleteInvoice()
            // setIsLoading(false)
        // },1500)
        

    }, [])
    const IncompleteInvoice = () => {
        httpClient
            .getInstance()
            .get(`${baseurl}api/invoice/upload/?type=no`)
            .then((resp: any) => {
                if(resp.data.status === ResponseStatus.SUCCESS){
                    setInCompletedInvoiceDatas(resp.data.data)
                    if (resp.data.data.length === 0) {
                        SetShowCreateInvocieBtn(true)
                        setTabValue("2");
                    }
                    CompleteInvoice()
                }else{
                    setIsLoading(false)
                }
                
            })
            .catch(() => {
                navigate("/Notfound")
            })
    }
    const CompleteInvoice = () => {
        httpClient
            .getInstance()
            .get(`${baseurl}api/invoice/upload/?type=yes`)
            .then((resp: any) => {
                setIsLoading(false)
                if(resp.data.status === ResponseStatus.SUCCESS){
                    if (resp.data.data.length === 0) {
                        SetShowCreateInvocieBtn(false)
    
                    } else {
                        IncompleteInvoice();
                        setCompletedInvoiceDatas(resp.data.data)
    
                    }
                    
                }
                
                
            })
            .catch(() => {
                navigate("/Notfound")
            })
    }
    const UploadInvoice = () => {
        console.log("IncompleteDatas", IncompleteDatas)
        setIsLoading(true)
        if (IncompleteDatas.length > 0) {
            IncompleteDatas.map((item: any, index: any) => {
                let body = {} as any
                if (upload_detail.party_details.APF_buyer === true) {
                    body = {
                        invoices:[
                            {
                                "SellerID": item.invoices[0].SellerID,
                                "SellerName": item.invoices[0].SellerName,
                                "InvoiceNo": item.invoices[0].InvoiceNo,
                                "InvoiceDate": item.invoices[0].InvoiceDate,
                                "InvoiceAmount": item.invoices[0].InvoiceAmount,
                                "DueDate": item.invoices[0].DueDate,
                                "FinancingCurrency": item.invoices[0].FinancingCurrency,
                                "SettlementCurrency": item.invoices[0].SettlementCurrency,
                                "InvoiceCurrency": item.invoices[0].InvoiceCurrency,
                                "FinanceAmount" : item.invoices[0].FinanceAmount,
                                "auto_finance":item.invoices[0].auto_finance
                            }
                        ]
                    }
                }else{
                    body = {
                        invoices: [{
                            buyerId: item.invoices[0].buyerId,
                            buyerName: item.invoices[0].buyerName,
                            invoiceNo: item.invoices[0].InvoiceNo,
                            invoiceDate: item.invoices[0].InvoiceDate,
                            InvoiceCurrency: item.invoices[0].InvoiceCurrency,
                            invoiceAmount: item.invoices[0].InvoiceAmount,
                            dueDate: item.invoices[0].DueDate,
                            financingCurrency: item.invoices[0].FinancingCurrency,
                            settlementCurrency: item.invoices[0].SettlementCurrency
                        }]
                    }
                }
                 
                return httpClient
                    .getInstance()
                    .put(`${baseurl}api/invoice/upload/${item.id}/`, body)
                    .then((resp: any) => {
                        IncompleteInvoice();
                        CompleteInvoice();
                        setIsLoading(false)
                    })
                    .catch(() => {
                        navigate("/Notfound")
                    })
            })
        } else {
            navigate("/new")
        }
    }
    const cancelInvoice = () => {

        CompletedInvoiceDatas && CompletedInvoiceDatas.map((item: any) => {
            return httpClient
                .getInstance()
                .delete(`${baseurl}api/invoice/upload/${item.id}/`)
                .then((resp: any) => {
                    navigate("/new")
                })
                .catch(() => {
                    navigate("/Notfound")
                })
        })
        InCompletedInvoiceDatas && InCompletedInvoiceDatas.map((item: any) => {
            return httpClient
                .getInstance()
                .delete(`${baseurl}api/invoice/upload/${item.id}/`)
                .then((resp: any) => {
                    navigate("/new")
                })
                .catch(() => {
                    navigate("/Notfound")
                })
        })


    }

    const InCompleteData = (data: any) => {
        setIncompleteData(data)
        if (data.length === 0) {
            SetShowCreateInvocieBtn(true)
            setTabValue("2");
        }
        setIncompleteData(data)
    }
    const completedData = (data: any) => {
        setcompleteData(data)
    }
    const CreateInvoice = () => {
        const loginlocalItems = localStorage.getItem("login_detail") as any;

        completeDatas && completeDatas.map((item: any, index: any) => {
            return httpClient
                .getInstance()
                .get(`${baseurl}api/resource/action/status/?action=${Action.SUBMIT}&type=${TransactionType.TINVOICEUPLOADS}&t_id=${item.id}`)
                .then((response: any) => {
                    if (response.data.status === ResponseStatus.SUCCESS) {
                        transition(response.data.data, "Submit", response.data.data.from_party, response.data.data.to_party, "New", returnRoute)
                        // transition(item, "Submit", JSON.parse(loginlocalItems).party_id, JSON.parse(loginlocalItems).party_id, "New", returnRoute)

                    } else {
                        message.error(response.data.data)
                    }
                })
                .catch(() => {
                    navigate("/Notfound")
                })
        })
    }
    const returnRoute = (data: any) => {
        if (data === true) {
            navigate("/New");
        }
    }
    const onClickExit = () => {
        navigate("/New");
    };
    const getTabValue = (value: string) => {
        setTabValue(value);
    }
    const data = {
        fromMenu: "Invoice",
        data: {
            type: "bulk upload"
        },
        recordType: ""
    }
    const items =[
       {
        label:"Incomplete",
        key:"1",
        children: <InComplete
        incompleteData={InCompleteData}
        upload_detail={upload_detail}
        InCompletedInvoiceDatas={InCompletedInvoiceDatas}
        tabValue={getTabValue}
    />
       },
       {
        label:"Complete",
        key:"2",
        children: <Complete upload_detail={upload_detail} CompletedInvoiceDatas={CompletedInvoiceDatas} completedData={completedData} />
       }

    ]
    return isLoading ? <Spin /> : (
        <React.Fragment>
            <div className="fixedContainer">
                <Breadcrumbs
                    Data={data}
                    onClickExit={onClickExit}
                    commentsValue={showCreateInvoiceBtn}
                    flag="bulk upload"
                    onClickAction={showCreateInvoiceBtn === true ? CreateInvoice : UploadInvoice}

                />
            </div>
            {/* <div className="ProgramDetailContainer">
                <div className="breadcrumbContainer">
                    <span onClick={onClickExit}>Invoice</span>
                    <img src={BreadcrumbArrow} alt="BreadcrumbArrow" />
                    
                    <span>Bulk Upload</span></div>
                <div className="Button_Container">
                    <Button className="ExitButtonContainer" onClick={cancelInvoice}>
                        Exit
                    </Button>
                    {showCreateInvoiceBtn === true ?
                        <Button className="SaveButtonContainer" onClick={CreateInvoice}>Create Invoice</Button>
                        :
                        <Button className="SaveButtonContainer" onClick={UploadInvoice}>Upload</Button>
                    }
                </div>
            </div> */}

            <div className="approvedFinanceContainer mainContentContainer">

                <div className="Card_Main_Container ">
                    <Card className="CardContainer">
                        <h1>Upload File</h1>
                        <Tabs defaultActiveKey={tabValue} onChange={callback} activeKey={tabValue} items={items} />
                    </Card>
                </div>
            </div>
        </React.Fragment>
    );
};

export default UploadTab;