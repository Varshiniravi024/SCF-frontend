import { Card, Row, Col, Table, Button } from "antd";
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import httpClient from "../../utils/config/core/httpClient";
import baseurl from "../../utils/config/url/base";
import moment from "moment";
import { Type } from "../../utils/enum/choices";
const EnquiryDetail = () => {
  const Navigator = useNavigate();
  const { state } = useLocation();
  const [enquiryData] = useState(state as any);
  const [dataSource, setDataSource] = useState([]);
  const [currencyList, setCurrencyList] = useState([]);
  const getCurrency = () => {
    httpClient
      .getInstance()
      .get(`${baseurl}api-auth/currency/`)
      .then((resp: any) => {
        setCurrencyList(resp.data.data);
      });
  }
  useEffect(() => {
    getCurrency()
    httpClient
      .getInstance()
      .get(`${baseurl}api/message/workflow-history/?wf_item=${enquiryData.id}`)
      .then((resp: any) => {
        setDataSource(resp.data.data);
      });
  }, []);
  const onClickExit = () => {
    Navigator("/Enquiry");
  };
  const columns = [
    {
      title: "Created Date",
      dataIndex: "created_date",
      render: (record: any) => <div>{moment(record).format("DD-MM-YYYY")}</div>,
    },
    {
      title: "To",
      dataIndex: "to_party_name",
    },
    {
      title: "From Status",
      dataIndex: "initial_state",
    },
    {
      title: "To Status",
      dataIndex: "final_state",
    },
    {
      title: "User",
      dataIndex: "event_user_details",
    },
    {
      title: "Action",
      dataIndex: "action",
    },
  ];
  return (
    <div className="ProgramMainContainer">
      <div className="ProgramDetailContainer">
        <div className="breadcrumbContainer">
          <h1 className="HeadingTxt">Enquiry Detail</h1></div>
        <div className="Button_Container">
          <Button className="ExitButtonContainer" onClick={onClickExit} id={`enquiry__exit`}>
            Back
          </Button>



        </div>
      </div>
      <div className="Card_Main_Container">
        <Card className="CardContainer">

          <Row gutter={24}>
            <Col span={6}>
              <h3>Type</h3>
            </Col>
            <Col span={6}>
              <p>{enquiryData.type}</p>
            </Col>
            <Col span={6}>
              <h3>Status</h3>
            </Col>
            <Col span={6}>
              <p>
                {enquiryData?.type === Type.INVOICEUPLOAD ? enquiryData?.interim_state
                  : enquiryData?.interim_state}
              </p>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={6}>
              <h3>Program Name</h3>
            </Col>
            <Col span={6}>
              <p>{enquiryData?.type ===Type.INVOICEUPLOAD ? enquiryData?.record_datas?.values?.[0]?.fields?.program_type : enquiryData?.type === Type.INVOICE ? enquiryData?.record_datas?.values?.[0]?.fields?.program_type : "-"} Program</p>
            </Col>
            <Col span={6}>
              <h3>Amount</h3>
            </Col>
            <Col span={6}>
              <p>
                {enquiryData?.type === Type.INVOICEUPLOAD ? enquiryData?.record_datas?.values?.[0]?.fields?.invoices?.[0]?.InvoiceCurrency :
                  enquiryData?.type === Type.INVOICE ?
                    currencyList.map((item: any) => {
                      let desc = ""
                      if (item.id === enquiryData?.record_datas?.values?.[0]?.fields?.invoice_currency) {
                        desc = item.description
                      }
                      return desc
                    })
                    : "-"}{" "}
                {enquiryData?.type === Type.INVOICEUPLOAD ? enquiryData?.record_datas?.values?.[0]?.fields?.invoices?.[0]?.Invoiceamount :
                  enquiryData?.type === Type.INVOICE ? enquiryData?.record_datas?.values?.[0]?.fields?.amount : "-"}{" "}
              </p>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={6}>
              <h3>Transaction ID</h3>
            </Col>
            <Col span={6}>
              <p>{enquiryData.id}</p>
            </Col>
            <Col span={6}>
              <h3>Due/Expire Date</h3>
            </Col>
            <Col span={6}>
              <p>{enquiryData?.type === Type.INVOICEUPLOAD ? enquiryData?.record_datas?.values?.[0]?.fields?.invoices?.[0]?.Duedate :
                enquiryData?.type === Type.INVOICE ? enquiryData?.record_datas?.values?.[0]?.fields?.due_date : "-"}</p>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={6}>
              <h3>CounterParty</h3>
            </Col>
            <Col span={6}>
              <p>{enquiryData?.counterparty ? enquiryData?.counterparty?.counterparty_name : "-"}</p>
            </Col>
          </Row>
          <div className='containerTable' style={{ marginTop: "5%" }}>
            <div className="OuterDiv">

              <div className='HeadInnerDiv'>
                <h1 className='head'>Created Date</h1>
                <h1 className='head'>To</h1>
                <h1 className='head'>From Status</h1>
                <h1 className='head'>To Status</h1>
                <h1 className='head'>User</h1>
                <h1 className='head'>Action</h1>
              </div>

            </div>
            <div className='OuterDiv'>
              {dataSource && dataSource.map((record: any, index: number) => {
                return (
                  <div key={index}
                    className={
                      'InnerDiv'} id={`enquiryDetail_table`} style={{ cursor: "default" }}>
                    <h5 className='body' id={`enquiryDetail_date`}>
                      <div>{moment(record?.record_datas?.values?.[0]?.fields?.created_date).format("DD-MM-YYYY")}</div>
                    </h5>
                    <h5 className='body' id={`enquiryDetail_to`}>
                      <div>
                        {record?.to_party_name}
                      </div>
                    </h5>
                    <h5 className='body' id={`enquiryDetail_fromStatus`}>
                      <div>
                        {record?.initial_state}
                      </div>
                    </h5>
                    <h5 className='body' id={`enquiryDetail_toStatus`}>
                      <div>
                        {record?.final_state}
                      </div>
                    </h5>
                    <h5 className='body' id={`enquiryDetail_user`}>
                      <div>
                        {record?.event_user_details}
                      </div>
                    </h5>
                    <h5 className='body' id={`enquiry_action`}>
                      <div>
                        {record.action}
                      </div>
                    </h5>

                  </div>
                )
              })}
            </div>
          </div>
        </Card>
      </div>

    </div>
  );
};

export default EnquiryDetail;
