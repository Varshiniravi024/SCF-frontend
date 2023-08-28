import React, { useState } from "react";
import { Row, Col, Input, Card } from "antd";
import moment from "moment";
import { useNavigate, useLocation } from "react-router-dom";
import { InterimState, Type } from "../../../../utils/enum/choices";
import CurrencyField from "../../function/currency";
import Breadcrumbs from "../../heading/breadcrumb";
const FinanceRequestDetail = () => {
  const { state } = useLocation();
  const Navigator = useNavigate();
  const [invoice_detail] = useState(state as any);
  const [commentsValue, setCommentsvalue] = useState(null as any);
  const { TextArea } = Input;
 
  const UploadDetail = invoice_detail?.data?.type === Type.INVOICEUPLOAD ?
    [
      {
        label: "Seller Name",
        value: invoice_detail
          ? invoice_detail?.data?.seller_details?.[0]?.name : "-",
          id:"sellerName"
      },
      {
        label: "Buyer Name",
        value: invoice_detail
          ? invoice_detail?.data?.buyer_details?.[0]?.name
          : "-",
          id:"buyerName"
      },
      {
        label: "Invoice Number",
        value: invoice_detail
          ? invoice_detail?.data?.record_datas?.values?.[0]?.fields?.invoices?.[0]?.InvoiceNo
          : "",
          id:"invoiceNumber"
      },
      {
        label: "Invoice Date",
        value: invoice_detail
          ? invoice_detail?.data?.record_datas?.values?.[0]?.fields?.invoices?.[0]?.InvoiceDate
          : "",
          id:"invoiceDate"
      },
      {
        label: "Invoice Amount",
        value:
          `${invoice_detail
            ? invoice_detail?.data?.record_datas?.values?.[0]?.fields?.invoices?.[0]?.InvoiceCurrency : "-"}${" "}${invoice_detail.data.record_datas?.values?.[0]?.fields?.invoices?.[0]?.InvoiceAmount}`,
            id:"invoiceAmount"
      },
      {
        label: "Due Date",
        value: invoice_detail
          ?
          invoice_detail?.data?.record_datas?.values?.[0]?.fields?.invoices?.[0]?.DueDate
          : "",
          id:"dueDate"
      },
      {
        label: "Finance Amount",
        value:
          `${invoice_detail
            ? invoice_detail?.data.record_datas?.values?.[0]?.fields?.invoices?.[0]?.InvoiceCurrency : "-"}${" "}${invoice_detail.data.record_datas?.values?.[0]?.fields?.invoices?.[0]?.FinanceAmount}`,
            id:"financeAmount"
      },
      {
        label: "Status",
        value: invoice_detail ? invoice_detail?.data?.interim_state : "-",
        id:"financeStatus"
      },

    ] : [
      {
        label: "Seller Name",
        value: invoice_detail
          ? invoice_detail?.data?.seller_details?.[0]?.name : "-",
          id:"sellerName"
      },
      {
        label: "Buyer Name",
        value: invoice_detail
          ? invoice_detail?.data?.buyer_details ? invoice_detail?.data?.buyer_details?.[0]?.name : invoice_detail?.data?.current_to_party_name
          : "-",
          id:"buyerName"
      },
      {
        label: "Invoice Number",
        value: invoice_detail
          ? invoice_detail?.data?.record_datas?.values?.[0]?.fields?.invoice_no
          : "",
          id:"invoiceNumber"
      },
      {
        label: "Invoice Date",
        value:
          moment(
            invoice_detail
              ? invoice_detail?.data?.record_datas?.values?.[0]?.fields?.invoice_date
              : ""
          ).format("DD-MM-YYYY"),
          id:"invoiceDate"
      },
      {
        label: "Invoice Amount",
        value: <CurrencyField currencyvalue={invoice_detail?.data?.record_datas?.values?.[0]?.fields?.invoice_currency} amount={invoice_detail?.data?.record_datas?.values?.[0]?.fields?.amount} />,
        id:"invoiceAmount"
      },
      {
        label: "Due Date",
        value: invoice_detail
          ? moment(invoice_detail?.data?.record_datas?.values?.[0]?.fields?.due_date).format("DD-MM-YYYY")
          : "",
          id:"dueDate"
      },
      {
        label: "Finance Amount",
        value: <CurrencyField currencyvalue={invoice_detail?.data?.record_datas?.values?.[0]?.fields?.finance_currency} amount={invoice_detail?.data?.record_datas?.values?.[0]?.fields?.finance_amount} />,
        id:"financeAmount"
      },
      {
        label: "Status",
        value: invoice_detail ? ((invoice_detail?.data?.type === Type.INVOICE && invoice_detail?.fromMenu === "inbox" && invoice_detail?.data?.interim_state === InterimState.AWAITINGBUYERA)) ? "Awaiting_approval" : invoice_detail?.data?.interim_state : "-",
        id:"financeStatus"
      },
    ]

  const onClickExit = () => {
    Navigator(`/${invoice_detail.fromMenu}`)
  };

  return (
    <React.Fragment>
      <div className="fixedContainer">
      <Breadcrumbs 
        // flag={programData?.fromMenu} 
        // text={programData?.fromMenu} 
        // subText="" 
        Data={invoice_detail}
        onClickExit={onClickExit}
        commentsValue={commentsValue}
        flag="invoice"
        onClickAction={onClickExit}

        />
        {/* <div className="ProgramDetailContainer">
          <div className="breadcrumbContainer">
            <span onClick={onClickExit}>{invoice_detail.fromMenu}</span>
            <img src={BreadcrumbArrow} alt="BreadcrumbArrow" />
            {invoice_detail.recordType !== "" ?
              <> <span className="fromMenutext">{invoice_detail.recordType}</span>
                <img src={BreadcrumbArrow} alt="BreadcrumbArrow" />
              </>
              : ""}
            <span>{invoice_detail.data.type}</span></div>
          <ButtonContainer Data={invoice_detail} commentsValue={commentsValue} />
        </div> */}
      </div>
      <div className="Card_Main_Container mainContentContainer">
        <Card className="CardContainer">
          <h3>{invoice_detail.data.type === Type.INVOICEUPLOAD ? "Upload " : "Invoice "}Detail</h3>
          <div className="SummaryContainer">
            <Row className="counterPartyCollapseDetails" style={{ marginTop: "1%" }} >
              <Col span={12} >
                {UploadDetail.map((data: any, index: number) => {
                  return (
                    <Row gutter={24}>
                      <Col span={3}></Col>
                      <Col span={10}>{data.label}</Col>
                      <Col span={10} className="counterPartyValue" id={data.id}>
                        {data.value}
                      </Col>
                    </Row>
                  )
                })}
              </Col>
              <Col span={12}
              >
                {/* <div className="UploadCardContainer">
                  <div className="pdfImageContainer">
                    <img src={pdfIcon} alt="pdf" />
                <img src={pdfIcon} alt="pdf" />
                  </div>
                </div> */}
              </Col>
            </Row>

          </div>
          <Row gutter={24}>
            <Col span={2}> </Col>
            <Col span={5} style={{ padding: 0 }}>
              <div className="SummaryLabel">Comments</div>
            </Col>
            <Col span={16} style={{ padding: 0 }}>
              <TextArea style={{ width: "50%", margin: "0px 0px" }} onChange={(e: any) => setCommentsvalue(e.target.value)} id="comments"/>
            </Col>
          </Row>
        </Card>
      </div>
    </React.Fragment>
    // <div>
    //   <div className="ProgramMainContainer">

    //   </div>

    // </div>
  );
};
export default FinanceRequestDetail;
