
import React,{useState,useEffect} from "react";
import { Spin, Popconfirm } from "antd";
import images from "../../../../assets/images";
import "../../new.scss";
import httpClient from "../../../../utils/config/core/httpClient";
import baseurl from "../../../../utils/config/url/base";
const { DeleteIcon, FileAttachIcon } = images;

const CompleteFiles = (props:any) => {
  const [completedInvoices,setCompletedInvoices]=useState(props.CompletedInvoiceDatas ? props.CompletedInvoiceDatas :[]);
  const [loading,setLoadings]=useState(true)

  const HeadersData =  props.upload_detail.party_details.APF_buyer === true ? 
  [{
    Type: 'Seller Id', Date: 'Seller Name', Status: 'Inv No', From: 'Inv Date', dueDate: "Due Date", Program: 'Invoice Amount', Amount: 'Financing Currency', Due: 'Settlement Currency', Attached: 'Attached'
  }]
  : [{
    Type: 'Buyer Id', Date: 'Buyer Name', Status: 'Inv No', From: 'Inv Date', dueDate: "Due Date", Program: 'Invoice Amount', Amount: 'Financing Currency', Due: 'Settlement Currency', Attached: 'Attached'
  }]
  useEffect(() => {
    setLoadings(true)
    completedRecords();
  },[props.CompletedInvoiceDatas])

  const completedRecords = () => {
    setLoadings(true)
    httpClient
    .getInstance()
    .get(`${baseurl}api/invoice/upload/?type=yes`)
    .then((resp: any) => {
      setLoadings(false);
      setCompletedInvoices(resp.data.data)
      props.completedData(resp.data.data)
    })
  }
  
  const handleDelete = (data:any) => {
    setLoadings(true);
    httpClient
    .getInstance()
    .delete(`${baseurl}api/invoice/upload/${data.id}/`)
    .then((resp: any) => {
      setLoadings(false);
      completedRecords();
    }).catch((err)=>{
      setLoadings(false);

    })
  }
  return loading ? <Spin/> :  (
    <div className="ManualContainer" style={{ marginTop: "0" }}>
      <div className='containerTable'>
        <div className="OuterDiv">
          {HeadersData.map((head: any, index: number) => {
            return (
              <div key={index} className='HeadInnerDiv'>
                <h1 className='head' style={{ width: "11%" }}>{head.Type}</h1>
                <h1 className='head' style={{ width: "10%" }}>{head.Date}</h1>
                <h1 className='head' style={{ width: "10%" }}>{head.Status}</h1>
                <h1 className='head' style={{ width: "12%" }}>{head.From}</h1>
                <h1 className='head' style={{ width: "20%" }}>{head.Program}</h1>
                <h1 className='head' style={{ width: "10%" }}>{head.dueDate}</h1>
                <h1 className='head' style={{ width: "10%" }}>{head.Amount}</h1>
                <h1 className='head' style={{ width: "10%" }}>{head.Due}</h1>
                <h1 className='head' style={{ width: "6%" }}>{head.Attached}</h1>
              </div>
            )
          })}
        </div>
        <div className='OuterDiv'>
          {completedInvoices && completedInvoices.map((record: any, index: number) => {
            return (
              <div key={index} className='InnerDiv'>
                <h5 className='body' style={{ width: "11%" }}>
                  {props.upload_detail.party_details.APF_buyer === true ? record?.invoices?.[0]?.SellerID : record?.invoices?.[0]?.BuyerID}
                </h5>
                <h5 className='body' style={{ width: "10%" }}>
                  {props.upload_detail.party_details.APF_buyer === true ? record?.invoices?.[0]?.SellerName : record?.invoices?.[0]?.BuyerName}
                </h5>
                <h5 className='body' style={{ width: "10%" }}>
                  {record?.invoices?.[0]?.InvoiceNo}
                </h5>
                <h5 className='body' style={{ width: "12%" }}>
                  <div>
                    {record?.invoices?.[0]?.InvoiceDate}
                  </div>
                </h5>
                <h5 className='body' style={{ width: "20%" }}>
                  <span>{record?.invoices?.[0]?.InvoiceCurrency} </span>
                  {record?.invoices?.[0]?.InvoiceAmount}
                </h5>
                <h5 className='body'style={{ width: "10%" }}>
                  <div>
                    {record?.invoices?.[0]?.DueDate}
                  </div>
                </h5>
                <h5 className='body'style={{ width: "10%" }}>
                  <div>
                    {record?.invoices?.[0]?.FinancingCurrency}
                  </div>
                </h5>
                <h5 className='body'style={{ width: "10%" }}>
                  {record?.invoices?.[0]?.SettlementCurrency}

                </h5>
                <h5 className='body'style={{ width: "6%" }}>
                  {/* {this.state.dataSource.length >= 1 ? ( */}
                  <Popconfirm
                    title="Sure to delete?"
                    onConfirm={() => handleDelete(record.key)}
                  >
                    <img
                      src={FileAttachIcon}
                      alt="fileAttach"
                      style={{ marginRight: "20px" }}
                    />
                    <img src={DeleteIcon} alt="delete" />
                  </Popconfirm>
                  {/* ) : null} */}
                </h5>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  );
}
export default CompleteFiles;




