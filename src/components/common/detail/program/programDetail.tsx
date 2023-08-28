import React, { useState, useEffect } from "react";
import { Button, Input, Card } from "antd";
import images from "../../../../assets/images";
import BasicDetails from "./basicDetails";
import CounterPartyDetail from "./counterParty";
import { useNavigate, useLocation } from "react-router-dom";
import ButtonContainer from "./buttonContainer";
import Heading from "../../heading/heading";
import Breadcrumbs from "../../heading/breadcrumb";
const ProgramDetail = () => {
  const { state } = useLocation();
  const [programData] = useState(state as any);
  const [commentsValue, setCommentsvalue] = useState("" as any)
  const [displayComments, setDisplayComments] = useState(false)
  const { BreadcrumbArrow } = images;
  const Navigator = useNavigate();
  const { TextArea } = Input;
  const onClickExit = () => {
    if (programData.fromMenu === "InboxHistory") {
      Navigator(`/Inbox/History`, { state: { workFlowItem: programData.data.workflowitems } })
    } else {
      Navigator(`/${programData.fromMenu}`)
    }
  };

  const displayHistory = () => {
    setDisplayComments(true)
    Navigator("/Inbox/History", { state: programData })
  };

  useEffect(() => {
    if (localStorage.getItem("user") === "Bank") {
      setDisplayComments(true);
    }
  }, [])
  
  return (
    <React.Fragment>
      <div className="fixedContainer">
        <Breadcrumbs 
        // flag={programData?.fromMenu} 
        // text={programData?.fromMenu} 
        // subText="" 
        Data={programData}
        onClickExit={onClickExit}
        commentsValue={commentsValue}
        flag="program"
        onClickAction={onClickExit}

        />
      {/* <Heading flag={programData?.fromMenu} text={programData?.fromMenu} subText="" /> */}

      {/* <span onClick={onClickExit}>{programData?.fromMenu}</span> */}
        {/* <div className="ProgramDetailContainer">
          <div className="breadcrumbContainer">
            <span onClick={onClickExit}>{programData?.fromMenu}</span>
            <img src={BreadcrumbArrow} alt="BreadcrumbArrow" />
            {programData?.recordType !== "" ?
              <>
                <span onClick={navigateBack}>{programData?.recordType}</span>
                <img src={BreadcrumbArrow} alt="BreadcrumbArrow" />
              </> : ""}
            <span>{programData?.data?.type} detail</span>
          </div>
          <ButtonContainer Data={programData} commentsValue={commentsValue} />
        </div> */}
      </div>

      <div className="ProgramMainContainer mainContentContainer">

        <div className="Card_Main_Container">
          <Card className="CardContainer">
            {programData?.fromMenu !== "InboxHistory" ?
              <Button className="HistoryButtonContainer" onClick={displayHistory}><div style={{ float: "right" }}> History </div></Button>
              : ""}
            <div className="SummaryContainer">
              <BasicDetails flag={programData?.data?.fromMenu} fromMenu={programData?.data?.fromMenu} programData={programData?.data} />
              <CounterPartyDetail flag={programData?.data?.fromMenu} fromMenu={programData?.data?.fromMenu} programData={programData?.data} />
            </div>
            {displayComments ?
              <div className="SummaryContainer">
                <div className="SummaryLabel">Comments</div>
                <TextArea style={{ width: "50%", margin: "0px 10px" }} onChange={(e: any) => setCommentsvalue(e.target.value)} id={`${programData?.fromMenu}_${programData?.recordType}_program_comments`} />
              </div>
              : ""}
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};
export default ProgramDetail;
