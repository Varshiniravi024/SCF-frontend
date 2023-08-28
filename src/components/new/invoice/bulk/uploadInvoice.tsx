import React, { useState } from "react";
import { Button, message, Card, Modal, Checkbox } from "antd";
import UploadCSV from "./uploadfile";
import httpClient from "../../../../utils/config/core/httpClient";
import baseurl from "../../../../utils/config/url/base";
import { useNavigate, useLocation } from "react-router-dom";
import images from "../../../../assets/images";
import { CSVLink } from "react-csv";
import { ErrorMessage } from "../../../../utils/enum/messageChoices";
import { ResponseStatus } from "../../../../utils/enum/choices";
import Breadcrumbs from "../../../common/heading/breadcrumb";

// import FileSaver from 'file-saver';
// import {EXCEL_FILE_BASE64} from "./InvoiceTemplate";
const UploadInvoice = () => {
    const Navigator = useNavigate();
    const { state } = useLocation();
    const [upload_detail] = useState(state as any);
    const [fileList, setFileList] = useState([]);
    const [uploadBtnLoader, setUploadBtnLoader] = useState(false)

    const { BreadcrumbArrow } = images;
    const selectedFiles = (value: any) => {
        setFileList(value)
    }

    const csvModal = () => {
        if (upload_detail.party_details.self_invoice_upload === false) {
            Modal.info({
                title: '',
                className: "manualBtn",
                content: (
                    <div>
                        <p><Checkbox
                        // onChange={}
                        />  Raise Finance request automatically for approved invoices?</p>
                    </div>
                ),
                onOk() { csvUpload() },
            });
        } else {
            csvUpload()
        }
    }
    const csvUpload = () => {
        Navigator("/UploadDetail", { state: upload_detail })

        httpClient
            .getInstance()
            .get(`${baseurl}api/invoice/upload/?type=yes`)
            .then((resp: any) => {
                if (resp.data.data.length > 0) {
                    resp.data.data.map((item: any) => {
                        return (
                            httpClient
                                .getInstance()
                                .delete(`${baseurl}api/invoice/upload/${item.id}/`)
                                // .then((resp: any) => {

                                // })
                                .catch(() => {
                                    Navigator("/Notfound")
                                })
                        )
                    })
                }

            })
            .catch(() => {
                Navigator("/Notfound")
            })
        httpClient
            .getInstance()
            .get(`${baseurl}api/invoice/upload/?type=no`)
            .then((resp: any) => {
                if (resp.data.data.length > 0) {
                    resp.data.data.map((item: any) => {
                        return (
                            httpClient
                                .getInstance()
                                .delete(`${baseurl}api/invoice/upload/${item.id}/`)
                                // .then((resp: any) => {
                                // })
                                .catch(() => {
                                    Navigator("/Notfound")
                                })
                        )
                    })
                }
            })
            .catch(() => {
                Navigator("/Notfound")
            })
        setUploadBtnLoader(true)
        setTimeout(() => {
            const docs = [...fileList] as any;
            docs[0] = fileList;
            if (fileList.length > 0) {
                const formdata = new FormData();
                fileList.map((item: any, index: any) => {
                    return formdata.append(`data`, item[0]);
                });

                httpClient
                    .getInstance()
                    .post(`${baseurl}api/invoice/upload/csv/`, formdata)
                    .then((resp: any) => {
                        if (resp.data.status === ResponseStatus.SUCCESS) {
                            message.success(resp.data.data)
                            Navigator("/UploadDetail", { state: upload_detail })
                            setUploadBtnLoader(false)
                        } else {
                            message.error(resp.data.data)
                            setUploadBtnLoader(false)
                        }
                    })
                    .catch((err: any) => {
                        message.error(ErrorMessage.FCA, 3)
                        setUploadBtnLoader(false)
                        Navigator("/Notfound")

                    })
            } else {
                setUploadBtnLoader(false)
                message.error(ErrorMessage.PAF)
            }
            setFileList(docs);
        }, 1000)
    }
    const csvData = upload_detail.party_details.APF_buyer === true ?
        [["SellerID", "SellerName", "InvoiceNo", "Invoicedate", "Invoiceamount", "Duedate", "FinancingCurrency", "SettlementCurrency", "InvoiceCurrency"],
        ["", "", "", "", "", "", "", "", ""],] :
        [
            ["BuyerID", "BuyerName", "InvoiceNo", "Invoicedate", "Invoiceamount", "Duedate", "FinancingCurrency", "SettlementCurrency", "InvoiceCurrency"],
            ["", "", "", "", "", "", "", "", ""],
        ];
    // const handleDownload = () => {
    //     let datablob = EXCEL_FILE_BASE64
    //     let sliceSize = 1024;
    //     let byteCharacters= atob(datablob);
    //     let byteslength = byteCharacters.length;
    //     let sliceCount = Math.ceil(byteslength/sliceSize);
    //     let byteArrays = new Array(sliceCount);
    //     for (let sliceIndex = 0; sliceIndex<sliceCount; ++sliceIndex){
    //       let begin=sliceIndex *sliceSize;
    //       let end = Math.min(begin + sliceSize,byteslength);
    //       let bytes = new Array(end-begin)
    //       for (var offset = begin, i=0;offset < end;i++,++offset){
    //         bytes[i] = byteCharacters[offset].charCodeAt(0);
    //       }
    //       byteArrays[sliceIndex] = new Uint8Array(bytes);
    //     }
    //     let blob = new Blob(byteArrays,{type:"application/vnd.ms-excel"});
    //     FileSaver.saveAs(new Blob([blob],{}),"Invoice_Template.xlsx")

    //   }
    const onClickExit = () => {
        Navigator("/New")
    }
    const data = {
        fromMenu: "Invoice",
        data: {
            type: "Bulk upload"
        },
        recordType: ""
    }
    return (
        <React.Fragment>
            <div className="fixedContainer">
                {/* <Breadcrumbs flag="manageScf" text="Manage Your Credit" subText={`- ${localStorage.getItem("party_name")}`} /> */}
                <Breadcrumbs
                    // flag={programData?.fromMenu} 
                    // text={programData?.fromMenu} 
                    // subText="" 
                    Data={data}
                    onClickExit={onClickExit}
                    commentsValue={""}
                    flag="BulkUpload"
                    onClickAction={csvModal}

                />
            </div>
            <div className="approvedFinanceContainer mainContentContainer">
                {/* <div className="ProgramDetailContainer">
                <div className="breadcruauto_financembContainer">
                    <span onClick={() => Navigator("/New")} >Invoice</span>
                    <img src={BreadcrumbArrow} alt="BreadcrumbArrow" />
                    
                    <span>Bulk Upload</span></div>
                <div className="Button_Container">
                    <Button className="ExitButtonContainer" onClick={() => Navigator("/New")} >
                        Exit
                    </Button>
                    <Button className="SaveButtonContainer" onClick={csvModal} loading={uploadBtnLoader}>
                        Upload
                    </Button>

                </div>
            </div> */}
                {/* <div className=" " style={{height:'unset'}}> */}
                <Card className="CardContainer"
                // style={{height:'unset'}}
                >
                    {/* <div> */}
                    <h3>Upload Files</h3>
                    <CSVLink
                        data={csvData}
                        filename={"Invoice_Template.csv"}
                        className="btn btn-primary"
                        target="_blank"
                    > <Button className="TemplateButtonContainer" onClick={csvUpload} >
                            Download Template
                        </Button> </CSVLink>
                    {/* </div> */}
                    <UploadCSV selectedFiles={selectedFiles} attachmentFiles={[]} />
                </Card>
                {/* </div> */}
            </div>
        </React.Fragment>

    );
};

export default UploadInvoice;
