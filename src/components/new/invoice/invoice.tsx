import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Row, Col, Card, Modal, Spin } from "antd";
import "./../new.scss";
import { CSVLink } from "react-csv";
import httpClient from "../../../utils/config/core/httpClient";
import baseurl from "../../../utils/config/url/base";
import { Currency } from "../../api/base";
import moment from "moment"
import { ResponseStatus } from "../../../utils/enum/choices";
import Heading from "../../common/heading/heading";
const Invoice = () => {
  const Navigator = useNavigate();
  // const MenuStatusData = useSelector(selectMenuStatus);
  const [invoiceData, setInvoiceData] = useState([])
  const [currencyData, setCurrencyData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  // const [AutoFinance,setAutoFinance]=useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [Datas, setDatas] = useState({} as any);
  const handleOk = () => {
    // const body = {
    //   program_id :Datas.program_id,
    //    auto_finance: true
    //  }
    //  httpClient
    //    .getInstance()
    //    .put(`${baseurl}api/pairing/${Datas.id}/`, body)
    //    .then((response: any) => {
    localStorage.setItem("autofinance", "true")
    Navigator("/Manual", { state: Datas });
    //  getPartyData(response.data.data)
    //  })
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    // const body = {
    //   program_id :Datas.program_id,
    //    auto_finance: false
    //  }
    //  httpClient
    //    .getInstance()
    //    .put(`${baseurl}api/pairing/${Datas.id}/`, body)
    //    .then((response: any) => {
    localStorage.setItem("autofinance", "false")

    Navigator("/Manual", { state: Datas });
    //  getPartyData(response.data.data)
    //  })
    setIsModalOpen(false);
  };
  const onClickManual = (data: any) => {
    if (data?.auto_finance === null) {
      if (data?.party_details?.APF_seller === true) {
        if (data?.party_details?.self_invoice_upload === false) {
          setIsModalOpen(true)
          setDatas(data)
        } else {
          Navigator("/Manual", { state: data });

        }
      } else {
        Navigator("/Manual", { state: data });
      }
    } else {
      if (data?.auto_finance === true) {
        localStorage.setItem("autofinance", "true")
      } else if (data?.auto_finance === false) {
        localStorage.setItem("autofinance", "false")
      }
      Navigator("/Manual", { state: data });
    }


  };

  const onOkClick = (data: any) => {
    Navigator("/Upload", { state: data })
  }

  const getCurrency = async () => {
    const data = await Currency()
    setCurrencyData(data)
  }
  const showModal = (data: any) => {
    Modal.info({
      title: '',
      content: (
        <div>
          <CSVLink
            data={csvData}
            filename={"Invoice_Template.csv"}
            className="btn btn-primary"
            target="_blank"
          >Click Here </CSVLink>
          <p>to download the template(.csv) for Bulk upload of Invoices.</p>
          <div style={{ display: "flex" }}>
            <div className="importantMark">!</div>
            <p style={{ paddingLeft: "10px" }}>The upload file should have the same column names as in the sample upload template.</p>

          </div>

        </div>
      ),
      onOk() { onOkClick(data) },
    });
  };
  const csvData = [
    ["buyerId", "buyerName", "invoiceNo", "invoiceDate", "invoiceAmount", "dueDate", "financingCurrency", "settlementCurrency", "InvoiceCurrency"],
    ["", "", "", "", "", "", "", "", ""],
  ];

  useEffect(() => {
    getCurrency();
    httpClient
      .getInstance()
      .get(`${baseurl}api/resource/menu-data/`)
      .then((resp: any) => {
        if (resp.data.status === ResponseStatus.SUCCESS) {
          setIsLoading(false)
          setInvoiceData(resp.data.data)
        } else {
          setIsLoading(false)
        }

      }).catch((error) => {
        setIsLoading(false)
      })
  }, [])
  // useEffect(() => {
  //   const handleOutsideClick = (event:any) => {
  //     // if (modalRef.current && !modalRef.current.contains(event.target)) {
  //       setIsModalOpen(false);
  //     // }
  //   };

  //   if (isModalOpen) {
  //     document.addEventListener('mousedown', handleOutsideClick);
  //   } else {
  //     document.removeEventListener('mousedown', handleOutsideClick);
  //   }

  //   return () => {
  //     document.removeEventListener('mousedown', handleOutsideClick);
  //   };
  // }, [isModalOpen]);
  return isLoading ? <Spin /> : (
    <React.Fragment>
      <div className="fixedContainer">
        <Heading flag="invoice" text="Invoice" subText="" />
      </div>
      <div className="manageScfContainer mainContentContainer">
        {/* <div className="HeadingTxt"> Invoice</div> */}
        <Modal
        maskClosable={true}
          open={isModalOpen}
          title="" onOk={handleOk} onCancel={handleCancel}
          cancelButtonProps={{ type: "primary", id: "autoFinanceNo", size: "small", style: { fontSize: "12px", fontWeight: 500, borderColor: "#006666" }, ghost: true }}
          okButtonProps={{ size: "small", id: "autoFinanceYes", style: { fontSize: "12px", fontWeight: 500, backgroundColor: "#006666" } }}
          okText={"Yes"}
          cancelText="No"
        >
          <p>Raise Finance request automatically for approved invoices?</p>

        </Modal>
        {invoiceData.length > 0 ?
          <Row gutter={24}>
            {invoiceData.map((data: any, index: number) => {
              return (
                <Col span={8} key={index}>
                  <Card
                    key={index}
                    style={{ position: 'relative', height: "260px", marginBottom: "6%" }}
                    id={`invoiceCard${index + 1}`}
                  >
                    <h1 id={`${data.buyer_details?.[0]?.name}${index + 1}`}>{data.buyer_details?.[0]?.name} - {data.program_type}
                    </h1>
                    <p>
                      {
                        currencyData.map((item: any) => {
                          let description = ""
                          if (item.id === data.limit_currency) {
                            description = `${item.description}`
                          }
                          return description
                        })
                      }
                      <span> {new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data.max_limit_amount)}</span></p>
                    <div className="invoiceCard">Available Limit - {
                      currencyData.map((item: any) => {
                        let description = ""
                        if (item.id === data.limit_currency) {
                          description = `${item.description}`
                        }
                        return description
                      })
                    }
                      <span id={`Invoice_availableLimit${index}`}> {new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(data.available_limit)}</span></div>
                    <div className="invoiceCard" id={`Invoice_expiryDate${index}`} >Valid Till - {moment(data.expiry_date).format("DD-MM-YYYY")}</div>
                    <Button className="GreenButtonContainer" onClick={() => onClickManual(data)} id="Invoice_manualUploadButton">Manual</Button>
                    <Button className="GreenButtonContainer"
                      onClick={() => showModal(data)} id="Invoice_bulkUploadButton"
                    >Bulk Upload</Button>
                    {/* <img src={ApfProgram} alt="scfprogramimage" style={{ position: 'absolute', right: 20, bottom: 20 }} /> */}
                  </Card>
                </Col>
              );
            })}
          </Row>
          : "No Invoice Found"}
      </div>
    </React.Fragment>
  );
};
export default Invoice;
