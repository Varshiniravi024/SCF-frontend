import {useState, useEffect } from "react"
import moment from "moment";
import { Currency } from "../../../api/base";
import { InterimState, Type } from "../../../../utils/enum/choices";
 const InvoiceData = (invoice_detail:any) => {
  const [CurrencyValue, setCurrencyValue] = useState([])
  const getCurrency = async () => {
    const data = await Currency()
    setCurrencyValue(data)
  }
    useEffect(()=> {
        getCurrency()
    },[])
    const UploadDetail = invoice_detail?.data?.type === Type.INVOICEUPLOAD ?
    [
      {
        label: "From",
        value: invoice_detail ? invoice_detail?.data?.current_from_party_name : "-"
      },
      {
        label: "Buyer Name",
        value: invoice_detail
          ? invoice_detail.data?.buyer_details?.[0]?.party__name
          : "-"
      },
      {
        label: "Invoice Number",
        value: invoice_detail
          ? invoice_detail?.data?.record_datas?.values?.[0]?.fields?.invoices?.[0]?.InvoiceNo
          : ""
      },
      {
        label: "Invoice Date",
        value: invoice_detail
          ? invoice_detail?.data?.record_datas?.values?.[0]?.fields?.invoices?.[0]?.Invoicedate
          : ""
      },
      {
        label: "Invoice Amount",
        value:
          `${invoice_detail
            ? invoice_detail?.data?.record_datas?.values?.[0]?.fields?.invoices?.[0]?.InvoiceCurrency : "-"}${" "}${invoice_detail.data.record_datas?.values?.[0]?.fields?.invoices?.[0]?.Invoiceamount}`
      },
      {
        label: "Due Date",
        value: invoice_detail
          ?
          invoice_detail?.data?.record_datas?.values?.[0]?.fields?.invoices?.[0]?.Duedate
          : ""
      },
      {
        label: "Finance Amount",
        value:
          `${invoice_detail
            ? invoice_detail?.data?.record_datas?.values?.[0]?.fields?.invoices?.[0]?.InvoiceCurrency : "-"}${" "}${invoice_detail.data.record_datas?.values?.[0]?.fields?.invoices?.[0]?.FinanceAmount}`
      },
      {
        label: "Status",
        value: invoice_detail ? invoice_detail.data?.interim_state : "-"
      },

    ] : invoice_detail?.data?.type === Type.INVOICE ? 
    [
      {
        label: "From",
        value: invoice_detail ? invoice_detail?.data?.from_party_name ? invoice_detail?.data?.from_party_name : invoice_detail?.data?.current_from_party_name : "-"
      },
      {
        label: "Buyer Name",
        value: invoice_detail
          ? invoice_detail?.data?.buyer_details ? invoice_detail?.data?.buyer_details?.[0]?.party__name : invoice_detail?.data?.current_to_party_name
          : "-"
      },
      {
        label: "Invoice Number",
        value: invoice_detail
          ? invoice_detail?.data?.record_datas?.values?.[0]?.fields?.invoice_no
          : ""
      },
      {
        label: "Invoice Date",
        value:
          moment(
            invoice_detail
              ? invoice_detail?.data?.record_datas?.values?.[0]?.fields?.invoice_date
              : ""
          ).format("DD-MM-YYYY")
      },
      {
        label: "Invoice Amount",
        value: CurrencyValue.map((value: any) => {
          if (invoice_detail?.data?.record_datas?.values?.[0]?.fields
            ?.invoice_currency === value.id) {
            return `${invoice_detail
              ? value.description : "-"}${" "}${invoice_detail?.data?.record_datas?.values?.[0]?.fields
                ?.amount}`
          }
        })

      },
      {
        label: "Due Date",
        value: invoice_detail
          ? moment(invoice_detail?.data?.record_datas?.values?.[0]?.fields?.due_date).format("DD-MM-YYYY")
          : ""
      },
      {
        label: "Finance Amount",
        value:
          CurrencyValue.map((value: any) => {
            if (invoice_detail?.data?.record_datas?.values?.[0]?.fields
              .finance_currency === value.id) {
              return `${invoice_detail
                ? value.description : "-"}${" "}${invoice_detail?.data?.record_datas?.values?.[0]?.fields
                  .finance_amount}`
            }
          })
      },
      {
        label: "Status",
        value: invoice_detail ? ((invoice_detail?.data?.type ===Type.INVOICE && invoice_detail?.fromMenu === "inbox" && invoice_detail?.data?.interim_state === InterimState.AWAITINGBUYERA)) ? "Awaiting_approval" : invoice_detail?.data?.interim_state : "-"
      },
    ]
    :[]
    return (
        <div>
        </div>
    )
}

export default InvoiceData;