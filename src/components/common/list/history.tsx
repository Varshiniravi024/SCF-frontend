import { Row, Col, Button, Spin, Card } from "antd";
import React, { useEffect, useState } from "react";
import httpClient from "../../../utils/config/core/httpClient";
import baseurl from "../../../utils/config/url/base";
import TableComponent from "../table/Table";
import { useNavigate, useLocation } from "react-router-dom";
import Heading from "../heading/heading";
// interface IProps {
//   // flag: any;
//   // fromMenu: string;
//   // recordType:string
// }
const HistoryList = (props: any) => {
  const Navigator = useNavigate();
  const [dataSource, setDataSource] = useState([]);
  const [isLoading, SetIsLoading] = useState(false);
  const { state } = useLocation();
  const program_detail = useState(state as any);

  useEffect(() => {
    if (program_detail?.[0]?.workFlowItem) {
      httpClient
        .getInstance()
        .get(`${baseurl}api/message/workflow-history/?wf_item=${program_detail?.[0]?.workFlowItem}`)
        .then((resp: any) => {
          setDataSource(resp.data.data);
          SetIsLoading(false);
        });
    } else {
      httpClient
        .getInstance()
        .get(`${baseurl}api/message/workflow-history/?wf_item=${program_detail?.[0]?.data?.id}`)
        .then((resp: any) => {
          setDataSource(resp.data.data);
          SetIsLoading(false);
        });
    }

  }, []);

  const hideHistory = () => {
    // props.flag("programDetail");

  };

  const onClickExit = () => {
    Navigator("/inbox")
  }

  return isLoading ? (
    <Spin />
  ) : (
   <React.Fragment>
    {console.log("props",props)}
     <div className="fixedContainer">
                <Heading flag={"History"} text={"History"} subText="" />
            </div>
      <div className="allContainer mainContentContainer">
        <div className="ProgramDetailContainer">
          <div className="breadcrumbContainer">
            {/* <span onClick={onClickExit}>{programData.fromMenu}</span>
          <img src={BreadcrumbArrow} alt="BreadcrumbArrow" />
          {programData.recordType !== "" ?
          <>
          <span className="fromMenutext">{programData.recordType}</span>
          <img src={BreadcrumbArrow} alt="BreadcrumbArrow" /> 
          </> :""}
          <span>{programData.data.type}</span></div> */}
          </div>
          {/* <div className="Button_Container">
            <Button className="ExitButtonContainer"
              onClick={onClickExit}
            //  id={`${program_detail.fromMenu}_${program_detail.recordType}_program_exit`}
            >
              Exit
            </Button>



          </div> */}
        </div>
        <Card className="
        tableContainer 
        historyCardContainer 
        " 
        >

          <Row className="InvoiceGroupButtons">
            <Col span={3} className="InvoiceSelectedRowLength">
              History
            </Col>
          </Row>
          <TableComponent
            datas={dataSource}
            // flag={props.flag}
            fromPage={"InboxHistory"}
            fromMenu={"InboxHistory"}
            recordType=""
          // fromMenu={props.fromMenu}
          // recordType={props.recordType}
          />
          {/* <Row style={{ marginTop: "3%" }}>
        <Col span={5}></Col>
        <Col span={3}>
          <Button className="SaveButton" 
          onClick={hideHistory}
          >
            Exit
          </Button>
        </Col>
      </Row> */}
        </Card>
      </div>
    </React.Fragment>
  );
};
export default HistoryList;
