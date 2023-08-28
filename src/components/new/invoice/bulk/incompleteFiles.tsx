
import React,{useState,useEffect} from "react";
import { Input, Row, Col, Button, message,Popconfirm, Spin } from "antd";
import images from "../../../../assets/images";
import "../../new.scss";
import httpClient from "../../../../utils/config/core/httpClient";
import baseurl from "../../../../utils/config/url/base";
import { useNavigate } from "react-router";

const { FileAttachIcon,DeleteIcon } = images;


const IncompleteFiles = (props:any) => {
  const Navigate = useNavigate()

  const [completedInvoices,setCompletedInvoices]=useState(props.InCompletedInvoiceDatas ? props.InCompletedInvoiceDatas :[]);
  const [loading,setLoadings]=useState(true);
const [buyerIdError,setBuyerIdError] =useState(false as any);

useEffect(() => {
  setLoadings(true)
  IncompleteNo();    
},[props.InCompletedInvoiceDatas]);
const IncompleteNo = () => {
  setLoadings(true)
  httpClient
  .getInstance()
  .get(`${baseurl}api/invoice/upload/?type=no`)
  .then((resp: any) => {
    setCompletedInvoices(resp.data.data)
    props.incompleteData(resp.data.data)
   if(resp.data.data.length ===0){
    props.tabValue("2")
   }
   setLoadings(false);
  })
  .catch(()=>{
    Navigate("/Notfound")
  })
}

const Header_APF_Buyer = [{
  Id:"Seller Id",Name: "Seller Name",InvNo: "Inv No",InvDate: "Inv Date",InvAmt: "Inv Amount",DueDate: "Due Date",FinanceCurrency: "Financing Currency",SettlementCurrency: "Settlement Currency",autoFinance: "Auto Finance", attached: "Attached"
}]
const deleteRecord = (record:any) => {
  setLoadings(true);
  httpClient
  .getInstance()
  .delete(`${baseurl}api/invoice/upload/${record.id}/`)
  .then((resp: any) => {
    setLoadings(false);
    IncompleteNo();
  }).catch((err)=>{
    setLoadings(false);
    Navigate("/Notfound")

  })
}
const ClearAllData = () => {
  httpClient
  .getInstance()
  .post(`${baseurl}api/invoice/upload/delete/?type=NO`)
  .then((resp: any) => {
    setLoadings(false);
    message.success(resp.data.data)
    IncompleteNo();
    props.tabValue("2")
  }).catch((err)=>{
    setLoadings(false)
    Navigate("/Notfound")

  })
}
  return loading ? <Spin/> : (
    <React.Fragment>
 <div className="ManualContainer" style={{ marginTop: "0" }}>
      <Button className="clearAllButton ExitButtonContainer" onClick={ClearAllData}>Clear All</Button>

      <div className='containerTable'>
        <div className="OuterDiv">
          {
          props.upload_detail.party_details.APF_buyer === true ? 
          Header_APF_Buyer.map((head: any, index: number) => {
            return (
              <div key={index} className='HeadInnerDiv'>
                <h1 className='head'style={{ width: "11%" }}>{head.Id}</h1>
                <h1 className='head'style={{ width: "10%" }}>{head.Name}</h1>
                <h1 className='head'style={{ width: "10%" }}>{head.InvNo}</h1>
                <h1 className='head'style={{ width: "12%" }}>{head.InvDate}</h1>
                <h1 className='head'style={{ width: "20%" }}>{head.InvAmt}</h1>
                <h1 className='head'style={{ width: "10%" }}>{head.DueDate}</h1>
                <h1 className='head'style={{ width: "10%" }}>{head.FinanceCurrency}</h1>
                <h1 className='head'style={{ width: "10%" }}>{head.SettlementCurrency}</h1>
                {/* <h1 className='head'style={{ width: "5%" }}>{head.autoFinance}</h1> */}
                <h1 className='head'style={{ width: "6%" }}>{head.attached}</h1>
              </div>
            )
          }) :""}
         
        </div>
        <div className='OuterDiv'>
          {console.log("completedInvoices",completedInvoices)}
          {props.upload_detail.party_details.APF_buyer === true ? 
          completedInvoices ? completedInvoices.map((record: any, index: number) => {
            return (
              <div key={index} className='InnerDiv'>
          {console.log("completedInvoices",completedInvoices)}

                <h5 className='body' style={{ width: "11%" }}>
                  <Input
                    onChange={(e) => {
                      const arr = completedInvoices as any;
                      arr[index].invoices[0].SellerID = e.target.value
                      setCompletedInvoices(arr) 
                      setBuyerIdError(true)
                      
                      props.incompleteData(completedInvoices)
                    }}
                    defaultValue={record?.invoices?.[0]?.SellerID}
                  />
                  {buyerIdError !== true ? record.errors.length > 0 ?
                    record.errors[0].map((err: any, index: number) => {
                      return <div className="errorMsg" key={index}> {err.SellerID}</div>
                    })
                    : "" : ""}
                </h5>
                <h5 className='body'style={{ width: "10%" }}>
                  <Input
                    onChange={(e) => {
                      const arr =completedInvoices as any;
                      arr[index].invoices[0].SellerName = e.target.value
                      setCompletedInvoices(arr) 
                      props.incompleteData(completedInvoices)
                    }}
                    defaultValue={record?.invoices?.[0]?.SellerName}
                  />

                  {record?.errors?.length > 0 ?
                    record?.errors?.[0]?.map((err: any, index: number) => {
                     const value = buyerIdError === index
                      return value === true ? "" : <div className="errorMsg" key={index}> {err.SellerName}</div>
                    })
                    : ""}
                </h5>
                <h5 className='body' style={{ width: "10%" }}>
                  <div>
                    <Input
                      onChange={(e) => {
                        const arr = completedInvoices as any;
                        arr[index].invoices[0].InvoiceNo = e.target.value
                        setCompletedInvoices(arr) 

                        props.incompleteData(completedInvoices)

                      }}
                      defaultValue={record?.invoices?.[0]?.InvoiceNo}
                    />
                    {record?.errors?.length > 0 ?
                      record?.errors?.[0]?.map((err: any, index: number) => {
                        return <div className="errorMsg"key={index}> {err.InvoiceNo}</div>
                      })
                      : ""}
                  </div>
                </h5>
                <h5 className='body'style={{ width: "12%" }}>
                  <div>
                    <Input
                      onChange={(e) => {
                        const arr = completedInvoices as any;
                        arr[index].invoices[0].InvoiceDate = e.target.value
                        setCompletedInvoices(arr) 
                       
                        props.incompleteData(completedInvoices)

                      }}
                      defaultValue={record?.invoices?.[0]?.InvoiceDate}
                    />
                    {record?.errors?.length > 0 ?
                      record?.errors?.[0]?.map((err: any, index: number) => {
                        return <div className="errorMsg"key={index}> {err.InvoiceDate}</div>
                      })
                      : ""}
                  </div>
                </h5>
                <h5 className='body'style={{ width: "20%" }}>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Input
                        onChange={(e) => {
                          const arr = completedInvoices as any;
                          arr[index].invoices[0].InvoiceCurrency = e.target.value
                          setCompletedInvoices(arr) 

                          props.incompleteData(completedInvoices)

                        }}
                        defaultValue={`${record?.invoices?.[0]?.InvoiceCurrency} `}
                      />
                    </Col>
                    <Col span={12}>
                      <Input
                        onChange={(e) => {
                          const arr = completedInvoices as any;
                          arr[index].invoices[0].InvoiceAmount = e.target.value
                          setCompletedInvoices(arr) 

                        }}
                        defaultValue={`${record?.invoices?.[0]?.InvoiceAmount}`}
                      />
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={12}>
                      {record.errors.length > 0 ?
                        record.errors[0].map((err: any, index: number) => {
                          return <div className="errorMsg"key={index}> {err.InvoiceCurrency}</div>
                        })
                        : ""}
                    </Col>
                    <Col span={12}>
                      {record.errors.length > 0 ?
                        record.errors[0].map((err: any, index: number) => {
                          return <div className="errorMsg"key={index}> {err.InvoiceAmount}</div>
                        })
                        : ""}
                    </Col>
                  </Row>


                </h5>
                <h5 className='body' style={{ width: "10%" }}>
                  <div>
                    <Input
                      onChange={(e) => {
                        const arr = completedInvoices as any;
                        arr[index].invoices[0].DueDate = e.target.value
                        setCompletedInvoices(arr) 

                        props.incompleteData(completedInvoices)
                        if (e.target.value) {
                          setBuyerIdError(index)
                          
                        } else {
                          setBuyerIdError(index)
                        }
                      }}
                      defaultValue={record ? record.invoices.length > 0 ? record.invoices[0].DueDate : "" : ""}
                    />
                    {record.errors.length > 0 ?
                      record.errors[0].map((err: any, index: number) => {
                       return completedInvoices.map((item: any, index: any) => {
                         return index === buyerIdError ?  <div key={index}></div>
                         :
                         <div className="errorMsg"key={index}> {err.DueDate}</div>
                        })
                      })
                      : ""}
                  </div>
                </h5>
                <h5 className='body'style={{ width: "10%" }}>
                  <div>
                    <Input
                      onChange={(e) => {
                        const arr = completedInvoices as any;
                        arr[index].invoices[0].FinancingCurrency = e.target.value
                        setCompletedInvoices(arr) 

                      }}
                      defaultValue={record ? record.invoices.length > 0 ? record.invoices[0].FinancingCurrency : "" : ""}
                    />
                    {record.errors.length > 0 ?
                      record.errors[0].map((err: any, index: number) => {
                        return <div className="errorMsg"key={index}> {err.FinancingCurrency}</div>
                      })
                      : ""}
                  </div>
                </h5>
                <h5 className='body'style={{ width: "10%" }}>
                  <div>
                    <Input
                      onChange={(e) => {
                        const arr = completedInvoices as any;
                        arr[index].invoices[0].SettlementCurrency = e.target.value
                        setCompletedInvoices(arr) 

                      props.incompleteData(completedInvoices)

                      }}
                      defaultValue={record ? record.invoices.length > 0 ? record.invoices[0].SettlementCurrency : "" : ""}
                    />
                    {record.errors.length > 0 ?
                      record.errors[0].map((err: any, index: number) => {
                        return <div className="errorMsg" key={index}>{err.SettlementCurrency}</div>
                      })
                      : ""}
                  </div>

                </h5>
                <h5 className='body'style={{ width: "6%" }}>
                  <img src={FileAttachIcon} alt="fileAttach" />
                  <Popconfirm
                    title="Sure to delete?"
                    onConfirm={() => deleteRecord(record)}
                  >
                    <img src={DeleteIcon} alt="delete"style={{ marginLeft: "20px" }} />
                  </Popconfirm>
                </h5>
              </div>
            )
          }) : [] :
          completedInvoices ? completedInvoices.map((record: any, index: number) => {
            return (
              <div key={index} className='InnerDiv'>
                <h5 className='body'>
                  <Input
                    onChange={(e) => {
                      const arr = completedInvoices as any;
                      arr[index].invoices[0].buyerId = e.target.value
                      setCompletedInvoices(arr) 
                      setBuyerIdError(true)
                      
                      props.incompleteData(completedInvoices)
                    }}
                    defaultValue={record?.invoices?.[0]?.buyerId}
                  />
                  {buyerIdError !== true ? record.errors.length > 0 ?
                    record.errors[0].map((err: any, index: number) => {
                      return <div className="errorMsg"key={index}> {err.buyerId}</div>
                    })
                    : "" : ""}
                </h5>
                <h5 className='body'>
                  <Input
                    onChange={(e) => {
                      const arr = completedInvoices as any;
                      arr[index].invoices[0].buyerName = e.target.value
                      setCompletedInvoices(arr) 

                      props.incompleteData(completedInvoices)
                    }}
                    defaultValue={record?.invoices?.[0]?.buyerName}
                  />

                  {record.errors.length > 0 ?
                    record.errors[0].map((err: any, index: number) => {
                      const value = buyerIdError === index
                      return value === true ? "" : <div className="errorMsg"key={index}> {err.buyerName}</div>
                    })
                    : ""}
                </h5>
                <h5 className='body' style={{ width: "12%" }}>
                  <div>
                    <Input
                      onChange={(e) => {
                        const arr = completedInvoices as any;
                        arr[index].invoices[0].invoiceNo = e.target.value
                        setCompletedInvoices(arr) 

                        props.incompleteData(completedInvoices)

                      }}
                      defaultValue={record?.invoices?.[0]?.invoiceNo}
                    />
                    {record.errors.length > 0 ?
                      record.errors[0].map((err: any, index: number) => {
                        return <div className="errorMsg"key={index}> {err.invoiceNo}</div>
                      })
                      : ""}
                  </div>
                </h5>
                <h5 className='body'>
                  <div>
                    <Input
                      onChange={(e) => {
                        const arr = completedInvoices as any;
                        arr[index].invoices[0].invoiceDate = e.target.value
                        setCompletedInvoices(arr) 

                        props.incompleteData(completedInvoices)

                      }}
                      defaultValue={record?.invoices?.[0]?.invoiceDate}
                    />
                    {record.errors.length > 0 ?
                      record.errors[0].map((err: any, index: number) => {
                        return <div className="errorMsg"key={index}> {err.invoiceDate}</div>
                      })
                      : ""}
                  </div>
                </h5>
                <h5 className='body'>
                  <Row gutter={24}>
                    <Col span={12}>
                      <Input
                        onChange={(e) => {
                          const arr = completedInvoices as any;
                          arr[index].invoices[0].InvoiceCurrency = e.target.value
                          setCompletedInvoices(arr) 

                          props.incompleteData(completedInvoices)

                        }}
                        defaultValue={`${record?.invoices?.[0]?.InvoiceCurrency} `}
                      />
                    </Col>
                    <Col span={12}>
                      <Input
                        onChange={(e) => {
                          const arr = completedInvoices as any;
                          arr[index].invoices[0].invoiceAmount = e.target.value
                          setCompletedInvoices(arr) 

                        }}
                        defaultValue={`${record?.invoices?.[0]?.invoiceAmount}`}
                      />
                    </Col>
                  </Row>
                  <Row gutter={24}>
                    <Col span={12}>
                      {record.errors.length > 0 ?
                        record.errors[0].map((err: any, index: number) => {
                          return <div className="errorMsg"key={index}> {err.InvoiceCurrency}</div>
                        })
                        : ""}
                    </Col>
                    <Col span={12}>
                      {record.errors.length > 0 ?
                        record.errors[0].map((err: any, index: number) => {
                          return <div className="errorMsg"key={index}> {err.invoiceAmount}</div>
                        })
                        : ""}
                    </Col>
                  </Row>


                </h5>
                <h5 className='body'>
                  <div>
                    <Input
                      onChange={(e) => {
                        const arr = completedInvoices as any;
                        arr[index].invoices[0].dueDate = e.target.value
                        setCompletedInvoices(arr) 

                        props.incompleteData(completedInvoices)
                        if (e.target.value) {
                          setBuyerIdError(index)
                        } else {
                          setBuyerIdError(false)
                          
                        }
                      }}
                      defaultValue={record ? record.invoices.length > 0 ? record.invoices[0].dueDate : "" : ""}
                    />
                    {record.errors.length > 0 ?
                      record.errors[0].map((err: any, index: number) => {
                        return completedInvoices.map((item: any, index: any) => {
                          return index === buyerIdError ? <div></div> :
                          <div className="errorMsg"key={index}> {err.dueDate}</div>
                        })
                      })
                      : ""}
                  </div>
                </h5>
                <h5 className='body'>
                  <div>
                    <Input
                      onChange={(e) => {
                        const arr = completedInvoices as any;
                        arr[index].invoices[0].financingCurrency = e.target.value
                        setCompletedInvoices(arr) 

                      }}
                      defaultValue={record ? record.invoices.length > 0 ? record.invoices[0].financingCurrency : "" : ""}
                    />
                    {record.errors.length > 0 ?
                      record.errors[0].map((err: any, index: number) => {
                        return <div className="errorMsg"key={index}> {err.financingCurrency}</div>
                      })
                      : ""}
                  </div>
                </h5>
                <h5 className='body'>
                  <div>
                    <Input
                      onChange={(e) => {
                        const arr = completedInvoices as any;
                        arr[index].invoices[0].settlementCurrency = e.target.value
                        setCompletedInvoices(arr) 
                        props.incompleteData(completedInvoices)

                      }}
                      defaultValue={record ? record.invoices.length > 0 ? record.invoices[0].settlementCurrency : "" : ""}
                    />
                    {record.errors.length > 0 ?
                      record.errors[0].map((err: any, index: number) => {
                        return <div className="errorMsg" key={index}>{err.settlementCurrency}</div>
                      })
                      : ""}
                  </div>

                </h5>
                <h5 className='body'>
                  <img src={FileAttachIcon} alt="fileAttach" />
                  <Popconfirm
                    title="Sure to delete?"
                    onConfirm={() => deleteRecord(record)}
                  >
                    <img src={DeleteIcon} alt="delete"style={{ marginLeft: "20px" }} />
                  </Popconfirm>
                </h5>
              </div>
            )
          }) : []}
         </div>
      </div>
    </div>
    </React.Fragment>
  );

}
export default IncompleteFiles;