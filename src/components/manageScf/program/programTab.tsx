import React, { useState } from "react";
import { Tabs, Row, Col } from "antd";
import BasicDetailsForm from "./basicDetails";
import CounterPartyForm from "./counterParty";
import Summary from "./summary";
import "../manageScf.scss";
import { useLocation, useNavigate } from "react-router-dom";
import images from "../../../assets/images";
import { useSelector } from "react-redux";
import { program_Basicdetails } from "../../../redux/action";
import httpClient from "../../../utils/config/core/httpClient";
import baseurl from "../../../utils/config/url/base";

const ApprovedPayable = () => {
  const { TabPane } = Tabs;
  const { state } = useLocation();
  const navigate = useNavigate()
  const basicDetailsDatas = useSelector(program_Basicdetails);
  // const programDatas = useSelector(select_Programdata);
  const { LeftArrow, BreadcrumbArrow } = images

  const [tabValue, setTabValue] = useState("1");
  const statevalue = state as any
  const [programData] = useState(statevalue ? statevalue?.fromMenu ? statevalue.data : statevalue : statevalue as any);
  const [CounterPartyData, setCounterPartyData] = useState({});
  const [counterPartyDetails, setCounterpartyDetails] = useState([] as any);

  const basicDtsData = basicDetailsDatas?.payload?.programBasicdetailsData

  const callback = (key: any) => {
    setTabValue(key);
  };

  const previousPage = (data: string) => {
    setTabValue(data);
  };

  const nextpage = (data: string) => {
    setTabValue(data);
    const id = basicDetailsDatas ? basicDetailsDatas?.payload?.programBasicdetailsData?.id : "";
    if (id) {
      httpClient
        .getInstance()
        .get(`${baseurl}api/pairing/?pg_id=${id}`)
        .then((resp: any) => {
          setCounterpartyDetails(resp.data.data);
        })
    }
  };

  const CounterPartyDetails = (data: any) => {
    setCounterPartyData(data);
  };

  const user = localStorage.getItem("user")
  const items = [
    {
      label: "Basic Details",
      key: "1",
      id: "Basic Details",
      children: <BasicDetailsForm nextpage={nextpage} programData={programData?.fromMenu === "inbox" && user === "Bank" ? programData?.data : programData}
      // Pdatas={programDatas}
      />
    },
    {
      label: "CounterParty",
      key: "2",
      id: "CounterParty",
      disabled: basicDtsData === null ? true : false,
      children: <CounterPartyForm previousPage={previousPage} nextpage={nextpage} programData={programData} CounterPartyDetails={CounterPartyDetails} />
    },
    {
      label: "Summary",
      key: "3",
      id: "Summary",
      disabled: basicDtsData === null ? true : counterPartyDetails.length === 0 ? true : false,
      children: <Summary previousPage={previousPage} nextpage={nextpage} programData={programData} CounterPartyData={CounterPartyData} />
    }
  ]
  return (
    <React.Fragment>
      <div className="fixedContainer">
        <Row gutter={24}>
          <Col span={tabValue === "2" ? 17 : 18}>
            <h1>
              <span><img src={LeftArrow} alt="LeftArrow" onClick={() => {
                localStorage.getItem("user") === "Bank" ? navigate("/Inbox") :
                  navigate("/ManageScf")
              }
              } className="breadcrumbBackArrow" /></span>
              {programData?.data?.record_datas
                ? programData?.data?.record_datas?.values?.[0]?.fields?.program_type
                : programData?.record_datas
                  ? programData?.record_datas?.values?.[0]?.fields?.program_type
                  : programData?.program_type ? programData?.program_type : programData}{" "} Program
            </h1>
            <p className="breadcrumb">{tabValue === "3" ? <span>Basic Details <img src={BreadcrumbArrow} alt="BreadcrumbArrow" /> CounterParty  <img src={BreadcrumbArrow} alt="BreadcrumbArrow" /> Summary</span> : tabValue === "2" ? <span>Basic Details  <img src={BreadcrumbArrow} alt="BreadcrumbArrow" /> CounterParty </span> : "Basic Details"}</p>
          </Col>
        </Row>
      </div>

      <div className="approvedFinanceContainer mainContentContainer">

        <Tabs defaultActiveKey="1" onChange={callback} activeKey={tabValue} id="programTabs" items={items} /> 
      </div>
    </React.Fragment>
  );
};

export default ApprovedPayable;
