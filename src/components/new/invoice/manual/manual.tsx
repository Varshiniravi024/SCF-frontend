import React, { useState } from "react";
import { Card } from "antd";
import "../../new.scss";
import { useNavigate, useLocation } from "react-router-dom";
import httpClient from "../../../../utils/config/core/httpClient";
import baseurl from "../../../../utils/config/url/base";
import ApfSeller from "./apfSeller";
import ApfBuyer from "./apfBuyer";
import RfBuyer from "./rfBuyer";
import { manualActionStatus } from "../../../api/actionStatusUpload";
import { ProgramType, ResponseStatus, TransactionType } from "../../../../utils/enum/choices";
import Breadcrumbs from "../../../common/heading/breadcrumb";
const Manual = () => {
  const { state } = useLocation();

  const [invoice_detail] = useState(state as any);
  const [counterPartyList, setCounterPartyList] = useState([]);
  const [fileList, setFileList] = useState([] as any);
  const [apfSellerdataSource, setApfSellerDataSource] = useState([]);
  const [apfBuyerdataSource, setApfBuyerDataSource] = useState([])

  const [rfBuyerdataSource, setrfBuyerDataSource] = useState([])

  const [commentsValue, setCommentsvalue] = useState(null as any);
  const history = useNavigate();

  const onClickExit = () => {
    history("/New");
  };

  const postManualFile = (id: any) => {
    const formdata = new FormData();
    fileList.map((item: any, index: any) => {
      formdata.append(`files`, item[0]);
      formdata.append(`comments`, "manualfile");
    });
    formdata.append("invoice_upload", id.toString());

    httpClient
      .getInstance()
      .post(`${baseurl}api/resource/file/`, formdata)
      // .then((response: any) => {
      // })
      .catch(() => {
        history("/Notfound")
      })
  }

  const postInvoiceUpload = (bodyData: any, buttonKey: any) => {
    httpClient
      .getInstance()
      .post(`${baseurl}api/invoice/upload/`, bodyData)
      .then((resp: any) => {
        if (resp.data.status === ResponseStatus.SUCCESS) {
          if (fileList.length > 0) {
            postManualFile(resp.data.data.id)
          }
          if (buttonKey === "SUBMIT") {
            const data = manualActionStatus(TransactionType.TINVOICEUPLOADS, resp.data.data.id, buttonKey)
            history(`/new`)
          } else {
            localStorage.setItem("invoice_t_id", resp.data.data.id)
            history(`/new`)
          }
        }
      })
      .catch(() => {
        history("/Notfound")
      })
  }
  const onClickSubmit = (buttonkey: string) => {
    const formdata = new FormData();
    formdata.append("comments", commentsValue);
    if (invoice_detail.party_details?.APF_seller === true) {
      let body = {} as any
      apfSellerdataSource.map((datas: any) => {
        counterPartyList.map((values: any, index: any) => {
          return values.counterparty_id === datas.counter_party_name ?
            body = {
              program_type: "APF",
              invoices: [datas],
              comments: commentsValue,
              counter_party: values.counter_party,
              anchor_party: values.anchor_party,
            } : null
        })
        postInvoiceUpload(body, buttonkey)
      })
    } else if (invoice_detail.party_details?.APF_buyer === true) {
      let body = {} as any
      apfBuyerdataSource.map((datas: any) => {
        counterPartyList.map((values: any, index: any) => {
          if (values.counter_party === datas.counter_party) {
            body = {
              program_type: "APF",
              invoices: [datas],
              comments: commentsValue,
              counter_party: values.counter_party,
              anchor_party: values.anchor_party,
            };
          }
        })
        postInvoiceUpload(body, buttonkey)
      })
    } else if (invoice_detail.party_details?.RF_seller === true) {
      let body = {} as any
      rfBuyerdataSource.map((datas: any) => {
        counterPartyList.map((values: any, index: any) => {
          if (values.counter_party === datas.counterparty_id) {
            body = {
              program_type: "RF",
              invoices: [datas],
              comments: commentsValue,
              counter_party: values.counter_party,
              anchor_party: values.anchor_party,
            };
          }
        })
        postInvoiceUpload(body, buttonkey);

      })
    }
  };

  const getApfSellerdataSource = (data: any) => {
    setApfSellerDataSource(data)
  }
  const getApfBuyerdataSource = (data: any) => {
    setApfBuyerDataSource(data)
  }
  const getApfBuyercounterPartyList = (data: any) => {
    setCounterPartyList(data)
  }
  const getApfSellercounterPartyList = (data: any) => {
    setCounterPartyList(data)
  }
  const getrfBuyercounterPartyList = (data: any) => {
    setCounterPartyList(data)
  }
  const getRfBuyerdataSource = (data: any) => {
    setrfBuyerDataSource(data)
  }
  const data={
    fromMenu:"Invoice",
    data:{
      type:"manual"
    },
    recordType:""
  }
  return (
    <React.Fragment>
      <div className="fixedContainer">
      <Breadcrumbs 
        // flag={programData?.fromMenu} 
        // text={programData?.fromMenu} 
        // subText="" 
        Data={data}
        onClickExit={onClickExit}
        commentsValue={commentsValue}
        flag="manual"
        onClickAction={onClickSubmit}

        />
        {/* <div className="ProgramDetailContainer">
          <div className="breadcrumbContainer">
            <span onClick={onClickExit}>Invoice</span>
            <img src={BreadcrumbArrow} alt="BreadcrumbArrow" />
            <span>Manual</span></div>
          <div className="Button_Container">
            <Button className="ExitButtonContainer" onClick={onClickExit} id="invManual_exitBtn"> Exit </Button>
            <Button className="SaveButtonContainer" onClick={() => onClickSubmit("save")} id="invManual_saveBtn"> Save </Button>
            <Button className="SaveButtonContainer" onClick={() => onClickSubmit("SUBMIT")} id="invManual_submitBtn"> Submit </Button>
          </div>
        </div> */}
      </div>
      <div className="ManualContainer mainContentContainer">

        <div className="Card_Main_Container new_card_main_container">
          <Card className="CardContainer">
            <h1>Manual</h1>
            {
              invoice_detail.party_details?.APF_seller === true && invoice_detail.program_type === ProgramType.APF ?
                <ApfSeller invoice_detail={invoice_detail} getApfSellerdataSource={getApfSellerdataSource} getApfSellercounterPartyList={getApfSellercounterPartyList} />
                : invoice_detail.party_details?.APF_buyer === true && invoice_detail.program_type === ProgramType.APF ?
                  <ApfBuyer invoice_detail={invoice_detail} getApfBuyerdataSource={getApfBuyerdataSource} getApfBuyercounterPartyList={getApfBuyercounterPartyList} />
                  : invoice_detail.party_details?.RF_seller === true && invoice_detail.program_type === ProgramType.RF ?
                    <RfBuyer invoice_detail={invoice_detail} getRfBuyerdataSource={getRfBuyerdataSource} getrfBuyercounterPartyList={getrfBuyercounterPartyList} />
                    : "No records"
            }
          </Card>
        </div>
      </div>
    </React.Fragment>

  );
};
export default Manual;
