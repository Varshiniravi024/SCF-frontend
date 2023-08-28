import { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import moment from "moment";
import images from "../../../assets/images";
import { program_Basicdetails } from "../../../redux/action";
import { useNavigate } from "react-router-dom";
import imageBaseurl from "../../../utils/config/url/image";
import httpClient from "../../../utils/config/core/httpClient";
import baseurl from "../../../utils/config/url/base";
import { Action, InterimState, Type, ProgramType } from "../../../utils/enum/choices";
import CurrencyField from "../function/currency";
import {Pagination, Spin } from "antd";
import socketurl from "../../../utils/config/url/socket";
import { socketInfoDetails,pageSizeDetails } from "../../../redux/action";


interface Iprops {
  datas: any;
  fromPage: string;
  fromMenu: string;
  recordType: string
}

const TableComponent = (props: Iprops) => {
  const { FileAttachIcon, AwaitingIcon } = images;
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ws = useRef(null) as any;
  const [isPaused, setPause] = useState(false);
  const[pageNumber,setpageNumber] = useState(1)
  const socketData = useSelector(socketInfoDetails)
  const socketInfoData = socketData?.payload?.socketInfo
  const pageSizeDatas = useSelector(pageSizeDetails);
  const PageSizeCount = pageSizeDatas?.payload?.pageSizeData
console.log("innerwidth PageSizeCount",PageSizeCount)
const [loading,setLoading] =useState(false)
  const HeadersData = [{
    Type: 'Type', Date: 'Date', Status: 'Status', From: 'From', Program: 'Program Name', Amount: 'Amount', Due: 'Due Date', Attached: 'Attachments'
  }]

  const OnClickHistoryDetail = (data: any) => {
    if (props.fromPage === "InboxHistory") {
      navigate("/Inbox/HistoryDetail", { state: { fromMenu: props.fromMenu, data: data, recordType: props.recordType } })

    }
  };
  const OnClickDetails = (data: any) => {
    if (props.fromMenu === "inbox" || props.fromMenu === "draft" || props.fromMenu === "sent") {

      const body = {
        is_read: false,
        model_type: props.fromMenu === "inbox" || props.fromMenu === "draft" ? "WF" : "WE",
        id: data.id
      }
      httpClient
        .getInstance()
        .put(`${baseurl}api/message/update/${data.id}/`, body)
        .then((resp: any) => {
          console.log(resp)
        })
    }
    if (data.type === Type.PROGRAM) {
      if (props.fromMenu === "draft") {
        if (data?.record_datas?.values?.[0]?.fields.program_type === ProgramType.APF) {
          navigate(`/ApprovedPayableFinancing`, { state: { fromMenu: props.fromMenu, data: data, recordType: props.recordType, programData: data?.record_datas?.values?.[0]?.fields?.program_type } })
          dispatch(program_Basicdetails(data?.record_datas?.values?.[0]?.fields))

        } else {
          navigate(`/${props.fromMenu}/ProgramDetail`, { state: { fromMenu: props.fromMenu, data: data, recordType: props.recordType } })
        }


      } else {
        navigate(`/${props.fromMenu}/ProgramDetail`, { state: { fromMenu: props.fromMenu, data: data, recordType: props.recordType } })

      }

    } else if (data.type === Type.INVOICEUPLOAD) {
      if (props.fromMenu === "draft") {
        // navigate("/Manual", { state: { fromMenu: props.fromMenu, data: data, recordType: props.recordType } })

        navigate("/Draft/UploadDetail", { state: { fromMenu: props.fromMenu, data: data, recordType: props.recordType } })

      } else {
        navigate("/Inbox/UploadDetail", { state: { fromMenu: props.fromMenu, data: data, recordType: props.recordType } })

      }
    } else if (data.type === Type.FINANCERQ || data.type === Type.FINANCEREQ) {
      navigate(`/${props.fromMenu}/FinanceRequestDetail`, { state: { fromMenu: props.fromMenu, data: data, recordType: props.recordType } })

    } else if (data.type === Type.FINANCEREPAYMENT) {
      navigate(`/${props.fromMenu}/FinanceRepaymentDetail`, { state: { fromMenu: props.fromMenu, data: data, recordType: props.recordType } })

    } else if (data.type === Type.INVOICE) {
      if (localStorage.getItem("user") === "Bank") {
        if (data.action === Action.REQFINANCE || data.action === Action.FINANCED) {
          navigate(`/${props.fromMenu}/FinanceRequestDetail`, { state: { fromMenu: props.fromMenu, data: data, recordType: props.recordType } })
        }
      } else {
        navigate(`/${props.fromMenu}/InvoiceDetail`, { state: { fromMenu: props.fromMenu, data: data, recordType: props.recordType } })

      }


    } else if (data.type === Type.COUNTERPARTY) {
      navigate(`/${props.fromMenu}/CounterpartyDetail`, { state: { fromMenu: props.fromMenu, data: data, recordType: props.recordType } })

    }
  }

  const loginlocalItems = localStorage.getItem("login_detail") as any;
  const loginData = localStorage.getItem("login_detail") || "";
  const logindata = JSON.parse(loginData);
  
  useEffect(() => {
    setLoading(true)
    ws.current = new WebSocket(socketurl);
    // console.log("props.fromMenu",props.fromMenu)
    // console.log("props.fromMenu",props,"recordType",props.recordType)
    const data = {
        // "record_type": 'ALL',
        // "party_id": logindata.party_id

        "party_id": logindata.party_id,
        "record_type": [
            {
                "inbox": props.fromMenu === "inbox" ? props.recordType : "ALL",
                "sent": props.fromMenu === "sent" ? props.recordType :"ALL",
                "sent_aw": props.fromMenu === "sent_awap" ? props.recordType :"ALL"
            }
        ],
        "data_type": "ALL",
        "page_size": PageSizeCount,
        "page_number": pageNumber

    }

    // ws.current.onopen = () => console.log("ws opened");
    ws.current.onopen = () => {
        console.log("ws opened");
        ws.current.send(JSON.stringify(data));
        ws.current.onmessage = (e: any) => {
            console.log("MenuStatusData message layout", e)
            const message = JSON.parse(e.data);
        console.log("e msg usseeffect 2", message);

            dispatch(
                socketInfoDetails(message)
            )
            setTimeout(()=>{
              setLoading(false)
    
            },1000)
        }
    }
    // ws.current.send(JSON.stringify(data));
    // ws.current.onclose = () => console.log("ws closed");

    const wsCurrent = ws.current;

    return () => {
        wsCurrent.close();
    };
}, []);

useEffect(() => {
    if (!ws.current) return;

    ws.current.onmessage = (e: any) => {
        if (isPaused) return;
        const message = JSON.parse(e.data);
        console.log("e msg usseeffect", message,"isPaused",isPaused);
        dispatch(
            socketInfoDetails(message)
        )
    };
}, [isPaused]);
console.log("props return data",props,"props",props?.datas)
console.log("props return data",props,"props",props?.datas)
console.log("socketInfoData",socketInfoData)
const datasource = props.fromMenu === "inbox" ? socketInfoData?.message_data?.inbox?.data 
: props.fromMenu === "sent" ? socketInfoData?.message_data?.sent?.data 
: props.fromMenu === "sent_awap" ? socketInfoData?.message_data?.sent_awap?.data 
: []

const paginationTotalCount = props.fromMenu === "inbox" ? socketInfoData?.message_data?.inbox?.overall_count
: props.fromMenu === "sent" ? socketInfoData?.message_data?.sent?.overall_count
: props.fromMenu === "sent_awap" ? socketInfoData?.message_data?.sent_awap?.overall_count
: []
console.log("datasource",datasource)
const onChange = (e:any) => {
  console.log("evenet data",e)
  setpageNumber(e)
  setLoading(true)
  ws.current = new WebSocket(socketurl);

  const data = {
    // "record_type": 'ALL',
    // "party_id": logindata.party_id

    "party_id": logindata.party_id,
    "record_type": [
        {
            "inbox": props.fromMenu === "inbox" ? props.recordType : "ALL",
            "sent": props.fromMenu === "sent" ? props.recordType :"ALL",
            "sent_aw": props.fromMenu === "sent_awap" ? props.recordType :"ALL"
        }
    ],
    "data_type": "ALL",
    "page_size": PageSizeCount,
    "page_number": e

}

// ws.current.onopen = () => console.log("ws opened");
ws.current.onopen = () => {
    console.log("ws opened");
    ws.current.send(JSON.stringify(data));
   
    ws.current.onmessage = (e: any) => {
        console.log("MenuStatusData message layout", e)
        const message = JSON.parse(e.data);
    console.log("e msg usseeffect 2", message);

        dispatch(
            socketInfoDetails(message)
        )
        setTimeout(()=>{
          setLoading(false)

        },1000)
    }
}

}
  return  (
    <div>
      <div className='containerTable'>
        <div className="OuterDiv">
          {HeadersData && HeadersData.map((head: any, index: number) => {
            return (
              <div key={index} className='HeadInnerDiv'>
                <h1 className='head'>{head.Type}</h1>
                <h1 className='head'>{head.Date}</h1>
                <h1 className='head'
                // style={{ width: "18%" }}
                >{head.Status}</h1>
                <h1 className='head'>{props?.fromMenu === "sent" || props?.fromMenu === "sent_awap" ? "To" : head.From}</h1>
                <h1 className='head'>{head.Program}</h1>
                <h1 className='head'>{head.Amount}</h1>
                <h1 className='head'>{head.Due}</h1>
                {/* <h1 className='head'>{head.Attached}</h1> */}
              </div>
            )
          })}
        </div>
        {loading ? <Spin/> : <div className='BodyOuterDiv'>
          {/* {props?.datas && props?.datas. */}
          {datasource?.map((record: any, index: number) => {
            return (
              <div key={index}
                className={((props?.fromMenu === "inbox" || props?.fromMenu === "draft") && record.is_read === true) ? "unreadInnerDiv" : 'InnerDiv'} onClick={() => {
                  props?.fromPage === "InboxHistory"
                    ? OnClickHistoryDetail(record)
                    : OnClickDetails(record);
                }} id={`${props?.fromMenu}_${props?.recordType}_table${index}`}>
                <h5 className='body' id={`${props?.fromMenu}_${props?.recordType}_type${index}`}>
                  {props?.fromMenu === "inbox" &&
                    record?.next_available_transitions &&
                    record?.next_available_transitions?.values.length > 0 ? (
                    <div>
                      <img src={AwaitingIcon} alt="AwaitingIcon" style={{ marginRight: "5px" }} />
                      Awaiting
                    </div>
                  ) : record.type === Type.INVOICEUPLOAD ? (
                    "Invoiceupload"
                  ) :
                    record.type === Type.UPLOAD ? "Invoice"
                      :
                      (record.type === Type.COUNTERPARTY && localStorage.getItem("user") === "Customer") ? ("Onboarding"
                      ) : (
                        record.type
                      )}
                </h5>
                <h5 className='body' id={`${props?.fromMenu}_${props?.recordType}_date${index}`}>
                  <div>{moment(record?.record_datas?.values?.[0]?.fields?.created_date).format("DD-MM-YYYY")}</div>
                </h5>
                <h5 className='body'
                  // style={{ width: "18%" }} 
                  id={`${props?.fromMenu}_${props?.recordType}_status${index}`}>
                  <div
                    // className={((record.action === Action.RETURN) || record.action === Action.REJECT) ?"redStatus" :((record.action === Action.APPROVE) || (record.action === Action.FINANCED)) ?"greenStatus":"yellowStatus"}
                    className={"ApprovedStatus"}
                  >
                    {record.action === Action.RETURN ? "RETURNED" : (localStorage.getItem("user") === "Bank" && record.interim_state === InterimState.STB) ? "Await Onboarding"
                      : (record.type === Type.INVOICE && props?.fromMenu === "inbox" && record.interim_state === InterimState.AWAITINGBUYERA) ? "Awaiting approval"
                        : record.interim_state}
                  </div>
                </h5>
                <h5 className='body' id={`${props?.fromMenu}_${props?.recordType}_from/to${index}`}>
                  <div>
                    {props?.fromMenu === "sent_awap" && props?.fromPage === "InboxHistory"
                      ? record.to_party
                      : props?.fromMenu === "sent_awap"
                        ? record.current_to_party_name
                        : props?.fromMenu === "sent" ?
                          record.to_party === "financing_module" ? record.to_party_name :
                            record.to_party_name ? record.to_party_name
                              : record.current_to_party_name
                          : props?.fromMenu === "draft" ?
                            JSON.parse(loginlocalItems).party
                            : props?.fromMenu === "inbox"
                              ?
                              record.from_party === "financing_module" ?
                                record.current_from_party_name :
                                props?.fromPage === "InboxHistory"
                                  ? record.from_party_name
                                    ? record.from_party_name
                                    : record.current_from_party_name
                                  : record.current_from_party_name
                              : props?.fromMenu === "InboxHistory"
                                ? props?.fromPage === "InboxHistory"
                                  ? record.from_party_name
                                  : record.current_from_party_name
                                : ""
                    }
                  </div>
                </h5>
                <h5 className='body' id={`${props?.fromMenu}_${props?.recordType}_programName${index}`}>
                  <div>
                    {record.record_datas?.values?.[0]?.fields?.program_type === ProgramType.RF ? "RF" : record.record_datas?.values?.[0]?.fields?.program_type === ProgramType.APF ? "APF" : record.type === Type.COUNTERPARTY ? "APF" : "-"}

                  </div>

                </h5>
                <h5 className='body' id={`${props?.fromMenu}_${props?.recordType}_amount${index}`}>
                  {/* <div>
                    <span style={{ paddingRight: "10px" }} id={`${props?.fromMenu}_${props?.recordType}_amountcurrency`}> */}
                  {record
                    ? record.type === Type.COUNTERPARTY
                      ? record?.pairings?.[0]?.max_invoice_currency_id ?
                        <CurrencyField currencyvalue={record.pairings?.[0]?.max_invoice_currency_id} amount={record.pairings?.[0]?.max_limit_amount} />
                        : "-"
                      : record.type === Type.INVOICEUPLOAD
                        ?
                        <CurrencyField currencyvalue={record.record_datas?.values?.[0]?.fields?.invoices?.[0]?.InvoiceCurrency} amount={record.record_datas?.values?.[0]?.fields?.invoices?.[0]?.InvoiceAmount} />


                        : record.type === Type.PROGRAM
                          ? record.record_datas
                            ? record.record_datas?.values
                              ? record.record_datas?.values?.[0]?.fields?.limit_currency ?
                                <CurrencyField currencyvalue={record.record_datas.values?.[0]?.fields?.limit_currency} amount={record.record_datas.values?.[0]?.fields?.max_limit_amount} />
                                : ""
                              :
                              <CurrencyField currencyvalue={record.record_datas.limit_currency} amount={record.record_datas.max_limit_amount} />
                            : "-"
                          : record.type === Type.INVOICE ?
                            <CurrencyField currencyvalue={record.record_datas?.values?.[0]?.fields?.invoice_currency} amount={record.record_datas?.values?.[0]?.fields?.amount} />
                            :
                            record.type === Type.FINANCERQ || record.type === Type.FINANCEREQ ?
                              <CurrencyField currencyvalue={record.record_datas?.values?.[0]?.fields?.finance_currency} amount={record.record_datas?.values?.[0]?.fields?.finance_amount} />
                              : record.type === Type.FINANCEREPAYMENT ?
                                <CurrencyField currencyvalue={record.record_datas?.values?.[0]?.fields?.invoice_currency} amount={record.record_datas?.values?.[0]?.fields?.repayment_amount} />
                                : "-"
                    : ""
                  }
                </h5>
                <h5 className='body' id={`${props?.fromMenu}_${props?.recordType}_dueDate${index}`} style={{ display: "flex", whiteSpace: "nowrap" }}>
                  <div style={{ paddingRight: "28px" }}>
                    {record
                      ? record.type === Type.COUNTERPARTY
                        ? moment(record.pairings?.[0]?.expiry_date).format("DD-MM-YYYY")
                        : record.type === Type.INVOICEUPLOAD
                          ? record.record_datas?.values?.[0]?.fields?.invoices?.[0]?.DueDate
                          : record.type === Type.PROGRAM
                            ? record.record_datas
                              ? props?.fromPage === "InboxHistory"
                                ?
                                moment(record.record_datas?.values?.[0]?.fields?.expiry_date
                                ).format("DD-MM-YYYY")
                                :
                                moment(
                                  record.record_datas?.values?.[0]?.fields?.expiry_date
                                ).format("DD-MM-YYYY")
                              : "-"
                            : record.type === Type.INVOICE
                              ? moment(record.record_datas?.values?.[0]?.fields?.due_date).format("DD-MM-YYYY")

                              :
                              record.type === Type.FINANCERQ || record.type === Type.FINANCEREQ ?
                                moment(record.record_datas?.values?.[0]?.fields?.due_date).format("DD-MM-YYYY")
                                :
                                record.type === Type.FINANCEREPAYMENT ?
                                  moment(record.record_datas?.values?.[0]?.fields?.due_date).format("DD-MM-YYYY")

                                  : "-"
                      : ""}
                  </div>
                  <span > {record.type === Type.PROGRAM ?
                    record?.attachments?.program_attachments?.[0] ?
                      <a href={`${imageBaseurl}${record?.attachments?.program_attachments?.[0].file_path}`} target="_blank" style={{ color: '#006666' }} > <img src={FileAttachIcon} alt="fileAttach" id={`${props?.fromMenu}_${props?.recordType}_attachments${index}`} /> </a>
                      : "" :
                    record.type === Type.INVOICEUPLOAD ?

                      record?.attachments?.file?.[0] ?
                        <a href={`${imageBaseurl}${record?.attachments?.file?.[0].file_path}`} target="_blank" style={{ color: '#006666' }}> <img src={FileAttachIcon} alt="fileAttach" id={`${props?.fromMenu}_${props?.recordType}_attachments${index}`} /> </a>
                        : ""
                      : ""
                  }</span>
                </h5>
                {/* <h5 className='body'  id={`${props?.fromMenu}_${props?.recordType}_attachments`}>
                  {record.type === Type.PROGRAM ?
                    record?.attachments?.program_attachments?.[0] ?
                      <a href={`${imageBaseurl}${record?.attachments?.program_attachments?.[0].file_path}`} target="_blank" style={{ color: '#006666' }}> <img src={FileAttachIcon} alt="fileAttach" /> </a>
                      : "" :
                    record.type === Type.INVOICEUPLOAD ?

                      record?.attachments?.file?.[0] ?
                        <a href={`${imageBaseurl}${record?.attachments?.file?.[0].file_path}`} target="_blank" style={{ color: '#006666' }}> <img src={FileAttachIcon} alt="fileAttach" /> </a>
                        : ""
                      : ""
                  }
                </h5> */}
              </div>
            )
          })}
        </div>
}
      </div>
      <Pagination 
      // defaultPageSize={2}
      pageSize={PageSizeCount}
      // showTotal={total => `Total ${total} items`}
      showTotal={(total, range) => `${range[0]}-${range[1]} of ${total} items`}
      // showTotal={(total:any,range)=> console.log("to",total,range)}
      // total={20}
      total={paginationTotalCount}
      responsive={true}
      onChange={onChange}
      />
    </div>
  );
};
export default TableComponent;