import React, { useState, useEffect } from "react";
import { Row, Col, Card, Checkbox, Dropdown, Menu, List } from "antd";
import FinanceMaturing from "./graphs/financeMaturing";
import FinanceAnalysis from "./graphs/financeAnalysis";
import "./dashboard.scss";
import TopBorrowers from "./graphs/topBorrowers";
import LimitUtilization from "./graphs/limitUtilization";
import ExpiringProgramsAndLimits from "./graphs/expiringPrograms&Limits";
import MonthlyTurnover from "./graphs/monthlyTurnover";
import FundAnalysis from "./graphs/fundAnalysis";
import useForceUpdate from "use-force-update";
import images from "../../assets/images";
import ReactDragListView from "react-drag-listview";
import { useDispatch,useSelector } from "react-redux";
import httpClient from "../../utils/config/core/httpClient";
import baseurl from "../../utils/config/url/base"
import ProgramCard from "./graphs/program";
import FundsExpected from "./graphs/fundsExpected";
import { PartyType, ResponseStatus } from "../../utils/enum/choices";
import { socketInfoDetails } from "../../redux/action";
import socketurl from "../../utils/config/url/socket";
const { DragColumn } = ReactDragListView;

const Dashboard = () => {
  const dispatch = useDispatch();
  const socketData = useSelector(socketInfoDetails)
  const socketInfoData = socketData?.payload?.socketInfo
  console.log("socketInfoData",socketInfoData)

  const [programData, setProgramData] = useState({} as any)
  const [financeRequestDetails, setFinanceRequestDetails] = useState({} as any)
  const [financeMaturingDetails, setFinanceMaturingDetails] = useState({} as any)
  const [topBorrowers, setTopBorrowers] = useState([] as any)
  const [invoiceDetails, setInvoiceDetails] = useState({} as any)
  const [limitUtilization, setLimitUtilization] = useState([] as any)
  const [expiringPrograms, setExpiringPrograms] = useState([] as any)
  const [financeAgeing, setFinanceAgeing] = useState([] as any)
  const [monthlyTurnoverRevenue, setMonthlyTurnoverRevenue] = useState([] as any)
  const [fundsExpected, setFundsExpected] = useState([] as any)

  const [menuStatusData, setMenuStatusData] = useState({} as any)
  const [profiledata, setProfiledata] = useState({} as any)

  useEffect(() => {
    
    const loginData = localStorage.getItem("login_detail") || "";
        const logindata = JSON.parse(loginData);
        // const ws = new WebSocket(socketurl);
        // ws.onopen = (event: any) => {
        //     console.log('socket opening connection')
        //     const data = {
        //         // "record_type": 'ALL',
        //         // "party_id": logindata.party_id
                
        //             "party_id" : logindata.party_id,
        //             "record_type" : [
        //                 {
        //                     "inbox" : "ALL",
        //                     "sent" : "ALL",
        //                     "sent_aw" : "ALL"
        //                 }
        //             ],
        //             "data_type" : "DASHBOARD",
        //             "page_size" : 1,
        //             "page_number" : 1
                
        //     }
        //     //  setInterval(()=>{
        //     // ws.send(JSON.stringify(data));

        //     // ws.onmessage = (e: any) => {
        //     //     console.log("MenuStatusData message layout", e)
        //     //     const message = JSON.parse(e.data);
        //     //     dispatch(
        //     //         socketInfoDetails(message)
        //     //     )
        //     //     //   setConvoChatList(message)
        //     //     console.log("message layout", message)


        //     // };
        //   }

  },[])

  useEffect(() => {
    setProgramData(socketInfoData?.dashboard_data?.program);
        setFinanceRequestDetails(socketInfoData?.dashboard_data?.finance_details)
        setFinanceMaturingDetails(socketInfoData?.dashboard_data?.finance_maturing);
        setInvoiceDetails(socketInfoData?.dashboard_data?.invoice_details)
        setFundsExpected(socketInfoData?.dashboard_data?.Funds_Expected)

        setTopBorrowers(socketInfoData?.dashboard_data?.top_borrowers);
        setLimitUtilization(socketInfoData?.dashboard_data?.limit_utilization)
        setExpiringPrograms(socketInfoData?.dashboard_data?.Expiring_programs)
        setFinanceAgeing(socketInfoData?.dashboard_data?.Finance_ageing_analysis)
        setMonthlyTurnoverRevenue(socketInfoData?.dashboard_data?.Monthly_turnover_and_revenue)
    httpClient
      .getInstance()
      .get(`${baseurl}api-auth/user/profile/`)
      .then((resp: any) => {
        if (resp.data.status === ResponseStatus.SUCCESS) {
          setMenuStatusData(resp.data.data?.[0]?.menu_status);
          setProfiledata(resp.data.data?.[0]?.party_status?.[0]);
        }
      });

    // httpClient
    //   .getInstance()
    //   .get(`${baseurl}api/resource/dashboard/`)
    //   .then((response: any) => {
    //     setProgramData(response.data.program);
    //     setFinanceRequestDetails(response.data.finance_details)
    //     setFinanceMaturingDetails(response.data.finance_maturing);
    //     setInvoiceDetails(response?.data?.invoice_details)
    //     setFundsExpected(response?.data?.Funds_Expected)

    //     setTopBorrowers(response?.data?.bank_details?.top_borrowers);
    //     setLimitUtilization(response?.data?.bank_details?.limit_utilization)
    //     setExpiringPrograms(response?.data?.bank_details?.Expiring_programs)
    //     setFinanceAgeing(response?.data?.bank_details?.Finance_ageing_analysis)
    //     setMonthlyTurnoverRevenue(response?.data?.bank_details?.Monthly_turnover_and_revenue)
    //   })
  }, [])


  const forceUpdate = useForceUpdate();
  const CheckboxGroup = Checkbox.Group;
  const { crossIcon, FilterIcon } = images;

  const defaultCheckedList = localStorage.getItem("user") === "Bank" ?
    [
      "Top Borrowers",
      "Limit Utilization",
      "Expiring Programs",
      "Finance Ageing Analysis",
      "Monthly Turnover/Revenue",
      "Cost of Funds Analysis",
    ] :
    [
      "Program",
      "Finance Details",

      "Invoice Details",
      "Finances Maturing",
      "Funds Expected",

    ]

  const [openModal, setOpenModal] = useState(false);
  const [specificData, setSpecificData] = useState("");
  const [checkedList, setCheckedList] = React.useState(defaultCheckedList);

  const onClickFilter = () => {
    setOpenModal(true);
  };

  const onClickClose = (data: any) => {
    setSpecificData(data);
    const array = checkedList;
    const index = array.indexOf(data);
    if (index > -1) {
      array.splice(index, 1);
    }
    setCheckedList(array)
  };
  const onDragEnd = (fromIndex: any, toIndex: any) => {
    if (toIndex < 0) return; // Ignores if outside designated area

    const items = [...checkedList];
    const item = items.splice(fromIndex, 1)[0];
    items.splice(toIndex, 0, item);
    setCheckedList(items);
  };
  const onDragEnd1 = (fromIndex: any, toIndex: any) => {
    if (toIndex < 0) return; // Ignores if outside designated area

    const items = [...checkedList];
    const item = items.splice(fromIndex, 1)[0];
    items.splice(toIndex, 0, item);
    setCheckedList(items);
  };
  const onChange = (list: any) => {
    const array = checkedList;
    array.splice(array.indexOf(specificData), 1);
    setCheckedList(list);
  };
  
  const items = (
    <Menu>
      <Menu.Item>
        {localStorage.getItem("user") === "Bank" ?
          <Checkbox.Group
            style={{ width: "100%", display: "grid" }}
            onChange={onChange}
            defaultValue={checkedList}
            value={checkedList}
          >
            <Checkbox value="Top Borrowers">Top Borrowers</Checkbox>
            <Checkbox value="Limit Utilization">Limit Utilization</Checkbox>
            <Checkbox value="Expiring Programs"> Expiring Programs/Limits </Checkbox>
            <Checkbox value="Finance Ageing Analysis">  Finance Ageing Analysis </Checkbox>
            <Checkbox value="Monthly Turnover/Revenue">  Monthly Turnover/Revenue </Checkbox>
            <Checkbox value="Cost of Funds Analysis"> Cost of Funds Analysis </Checkbox>
          </Checkbox.Group> :
          // profiledata.RF_seller === true ?
          socketInfoData?.status_data?.[0]?.RF_seller === true ?
            <Checkbox.Group
              style={{ width: "100%", display: "grid" }}
              onChange={onChange}
              defaultValue={checkedList}
              value={checkedList}
            >
              {programData !== null ? <Checkbox value="Program">Program</Checkbox> : null}
              <Checkbox value="Finance Details">Finance Details</Checkbox>
              {socketInfoData?.status_data?.[0]?.party_type === PartyType.CUSTOMER ? <Checkbox value="Finances Maturing">Finances Maturing</Checkbox> : null}
              <Checkbox value="Funds Expected">Funds Expected</Checkbox>
            </Checkbox.Group>
            :
            socketInfoData?.status_data?.[0].APF_seller === true ?
              <Checkbox.Group
                style={{ width: "100%", display: "grid" }}
                onChange={onChange}
                defaultValue={checkedList}
                value={checkedList}
              >
                {programData !== null ? <Checkbox value="Program">Program</Checkbox> : null}
                <Checkbox value="Invoice Details">Invoice Details</Checkbox>
                <Checkbox value="Funds Expected">Funds Expected</Checkbox>
                {socketInfoData?.status_data?.[0].party_type === PartyType.CUSTOMER ? <Checkbox value="Finances Maturing">Finances Maturing</Checkbox> : null}

              </Checkbox.Group>
              : socketInfoData?.status_data?.[0].APF_buyer === true ?
                <Checkbox.Group
                  style={{ width: "100%", display: "grid" }}
                  onChange={onChange}
                  defaultValue={checkedList}
                  value={checkedList}
                >
                  {socketInfoData?.status_data?.[0].party_type === PartyType.CUSTOMER ? <Checkbox value="Finances Maturing">Finances Maturing</Checkbox> : null}
                </Checkbox.Group>
                :

                null
        }
      </Menu.Item>
    </Menu>
  );
  return (
    (
      <div>
        <div className="fixedContainer">
          <Row>
            <Col span={22}>
              <div className="HeadingTxt"> Dashboard</div>

            </Col>
            <Col span={2}>
              <div
                className="filterContainer"
                //   style={{ 
                //   zIndex: 2, 
                //  }}
                onClick={onClickFilter}
              >
                <Dropdown.Button
                  trigger={['click']}
                  icon={<img src={FilterIcon} alt="filter" />}
                  overlay={items}
                  // menu={{items}}
                >

                </Dropdown.Button>
              </div>
            </Col>
          </Row>
        </div>



        <div className="dashboardContainer mainContentContainer">
          {localStorage.getItem("user") === "Bank" ? (
            <Row
              gutter={24}
              style={{ padding: 0 }}
            >
              <Col span={12} style={{ padding: 0 }}>
                <ReactDragListView
                  nodeSelector=".ant-list-item.draggble"
                  onDragEnd={onDragEnd}
                >
                  <List
                    size="small"
                    dataSource={checkedList}
                    renderItem={(item) => {
                      const draggble =
                        item !== "Racing car sprays burning fuel into crowd.";
                      return (
                        <List.Item
                          className={draggble ? "draggble" : ""}
                        >
                          <Col span={24}>
                            {item === "Top Borrowers" ? (
                              <List.Item.Meta
                                title={""}
                                description={
                                  <Card
                                    className="cardContainer"
                                    style={{
                                      height: "410px",
                                      marginBottom: "20px",
                                      borderRadius: "25px",
                                    }}
                                  >
                                    <span onClick={() => onClickClose(item)}>
                                      <img
                                        src={crossIcon}
                                        alt="closeIcon"
                                        className="closeIcon"
                                      />
                                    </span>
                                    <TopBorrowers topBorrowersData={topBorrowers} />
                                  </Card>
                                }
                                className={draggble ? "draggble" : ""}
                              />
                            ) : item === "Expiring Programs" ? (
                              <List.Item.Meta
                                title={""}
                                description={
                                  <Card
                                    className="cardContainer"
                                    style={{
                                      height: "410px",
                                      marginBottom: "20px",
                                      borderRadius: "25px",
                                    }}
                                  >
                                    <span onClick={() => onClickClose(item)}>
                                      <img
                                        src={crossIcon}
                                        alt="closeIcon"
                                        className="closeIcon"
                                      />
                                    </span>
                                    <ExpiringProgramsAndLimits expiringPrograms={expiringPrograms} />
                                  </Card>
                                }
                                className={draggble ? "draggble" : ""}
                              />
                            ) : item === "Monthly Turnover/Revenue" ? (
                              <List.Item.Meta
                                title={""}
                                description={
                                  <Card
                                    className="cardContainer"
                                    style={{
                                      height: "410px",
                                      marginBottom: "20px",
                                      borderRadius: "25px",
                                    }}
                                  >
                                    <span onClick={() => onClickClose(item)}>
                                      <img
                                        src={crossIcon}
                                        alt="closeIcon"
                                        className="closeIcon"
                                      />
                                    </span>
                                    <MonthlyTurnover monthlyTurnoverRevenue={monthlyTurnoverRevenue} />
                                  </Card>
                                }
                                className={draggble ? "draggble" : ""}
                              />
                            ) : (
                              ""
                            )}
                          </Col>
                        </List.Item>
                      );
                    }}
                  />
                </ReactDragListView>
              </Col>
              <Col span={12} style={{ padding: 0 }}>
                <ReactDragListView
                  nodeSelector=".ant-list-item.draggble"
                  onDragEnd={onDragEnd1}
                >
                  <List
                    size="small"
                    dataSource={checkedList}
                    renderItem={(item) => {
                      const draggble =
                        item !== "Racing car sprays burning fuel into crowd.";
                      return (
                        <List.Item
                          className={draggble ? "draggble" : ""}
                        >
                          <Col span={24} style={{ padding: 0 }}>
                            {

                              item === "Limit Utilization" ? (
                                <List.Item.Meta
                                  title={""}
                                  description={
                                    <Card
                                      className="cardContainer"
                                      style={{
                                        height: "410px",
                                        marginBottom: "20px",
                                        borderRadius: "25px",
                                      }}
                                    > <span onClick={() => onClickClose(item)}>
                                        <img
                                          src={crossIcon}
                                          alt="closeIcon"
                                          className="closeIcon"
                                        />
                                      </span>

                                      <LimitUtilization limitUtilizationData={limitUtilization} />
                                    </Card>
                                  }
                                  className={draggble ? "draggble" : ""}
                                />
                              ) : item === "Finance Ageing Analysis" ? (
                                <List.Item.Meta
                                  title={""}
                                  description={
                                    <Card
                                      className="cardContainer"
                                      style={{
                                        height: "410px",
                                        marginBottom: "20px",
                                        borderRadius: "25px",
                                      }}
                                    >
                                      <span onClick={() => onClickClose(item)}>
                                        <img
                                          src={crossIcon}
                                          alt="closeIcon"
                                          className="closeIcon"
                                        />
                                      </span>

                                      <FinanceAnalysis financeAgeing={financeAgeing} />
                                    </Card>
                                  }
                                  className={draggble ? "draggble" : ""}
                                />
                              ) : item === "Cost of Funds Analysis" ? (
                                <List.Item.Meta
                                  title={""}
                                  description={
                                    <Card
                                      className="cardContainer"
                                      style={{
                                        height: "410px",
                                        marginBottom: "20px",
                                        borderRadius: "25px",
                                      }}
                                    >
                                      <span onClick={() => onClickClose(item)}>
                                        <img
                                          src={crossIcon}
                                          alt="closeIcon"
                                          className="closeIcon"
                                        />
                                      </span>
                                      <h2 style={{ padding: "24px" }}>
                                        Cost of Funds Analysis

                                      </h2>
                                      <FundAnalysis />
                                    </Card>
                                  }
                                  className={draggble ? "draggble" : ""}
                                />
                              ) : (
                                ""
                              )}
                          </Col>
                        </List.Item>
                      );
                    }}
                  />
                </ReactDragListView>
              </Col>
            </Row>
          ) : socketInfoData?.status_data?.[0].RF_seller === true ? (

            <Row gutter={24} style={{ padding: 0 }}>
              <Col span={12} style={{ padding: 0 }}>
                <ReactDragListView
                  nodeSelector=".ant-list-item.draggble"
                  onDragEnd={onDragEnd}
                >
                  <List
                    size="small"
                    dataSource={checkedList}
                    renderItem={(item) => {
                      const draggble =
                        item !== "Racing car sprays burning fuel into crowd.";
                      return (
                        <List.Item
                          className={draggble ? "draggble" : ""}
                        >
                          <Col span={24}>
                            {programData !== null && item === "Program" ? (
                              <List.Item.Meta
                                title={""}
                                description={
                                  <Card
                                    className="cardContainer"
                                    style={{
                                      height: "410px",
                                      marginBottom: "20px",
                                      borderRadius: "25px",
                                    }}
                                  >
                                    <span onClick={() => onClickClose(item)}>
                                      <img
                                        src={crossIcon}
                                        alt="closeIcon"
                                        className="closeIcon"
                                      />
                                    </span>
                                    <ProgramCard programData={programData} />
                                  </Card>
                                }
                                className={draggble ? "draggble" : ""}
                              />
                            )
                              : item === "Funds Expected" ? (
                                <List.Item.Meta
                                  title={""}
                                  description={
                                    <Card
                                      className="cardContainer"
                                      style={{
                                        height: "410px",
                                        marginBottom: "20px",
                                        borderRadius: "25px",
                                      }}
                                    >
                                      <span onClick={() => onClickClose(item)}>
                                        <img
                                          src={crossIcon}
                                          alt="closeIcon"
                                          className="closeIcon"
                                        />
                                      </span>

                                      <FundsExpected fundsExpected={fundsExpected} />
                                    </Card>
                                  }
                                  className={draggble ? "draggble" : ""}
                                />
                              )
                                : ""}
                          </Col>
                        </List.Item>
                      )
                    }}
                  />
                </ReactDragListView>
              </Col>
              <Col span={12} style={{ padding: 0 }}>
                <ReactDragListView
                  nodeSelector=".ant-list-item.draggble"
                  onDragEnd={onDragEnd}
                >
                  <List
                    size="small"
                    dataSource={checkedList}
                    renderItem={(item) => {
                      const draggble =
                        item !== "Racing car sprays burning fuel into crowd.";
                      return (
                        <List.Item
                          className={draggble ? "draggble" : ""}
                        >
                          <Col span={24}>
                            {
                              item === "Finance Details" ? (
                                <List.Item.Meta
                                  title={""}
                                  description={
                                    <Card
                                      className="cardContainer"
                                      style={{
                                        height: "410px",
                                        marginBottom: "20px",
                                        borderRadius: "25px",
                                        padding: "0"
                                      }}
                                    >
                                      <span onClick={() => onClickClose(item)}>
                                        <img
                                          src={crossIcon}
                                          alt="closeIcon"
                                          className="closeIcon"
                                        />
                                      </span>

                                      <h2>Finance Details </h2>

                                      <Row gutter={24} style={{ marginBottom: "30px" }}>
                                        <Col span={12}>
                                          <Card style={{ backgroundColor: "#E6F5B3" }}>
                                            <h1>Financed</h1>
                                            <p>INR {financeRequestDetails ? financeRequestDetails?.FINANCED !== null ? financeRequestDetails?.FINANCED : 0 : 0}</p>
                                          </Card>
                                        </Col>
                                        <Col span={12}>
                                          <Card style={{ backgroundColor: "#F5E8B3" }}>
                                            <h1>Settled</h1>
                                            <p>INR {financeRequestDetails ? financeRequestDetails?.SETTLED !== null ? financeRequestDetails?.SETTLED : 0 : 0}</p>
                                          </Card>
                                        </Col>
                                      </Row>
                                      <Row gutter={24}>
                                        <Col span={12}>
                                          <Card style={{ backgroundColor: "#DDECFF" }}>
                                            <h1>OverDue</h1>
                                            <p>INR {financeRequestDetails ? financeRequestDetails?.OVERDUE !== null ? financeRequestDetails?.OVERDUE : 0 : 0}</p>
                                          </Card>
                                        </Col>
                                        <Col span={12}>
                                          <Card style={{ backgroundColor: "#F5BBB3" }}>
                                            <h1>Rejected</h1>
                                            <p>INR {financeRequestDetails ? financeRequestDetails?.REJECTED !== null ? financeRequestDetails?.REJECTED : 0 : 0}</p>
                                          </Card>
                                        </Col>
                                      </Row>
                                    </Card>
                                  }
                                  className={draggble ? "draggble" : ""}
                                />
                              ) :
                                item === "Finances Maturing" && socketInfoData?.status_data?.[0].party_type === PartyType.CUSTOMER ? (
                                  <List.Item.Meta
                                    title={""}
                                    description={
                                      <Card
                                        className="cardContainer"
                                        style={{
                                          height: "410px",
                                          marginBottom: "20px",
                                          borderRadius: "25px",
                                        }}
                                      >
                                        <span onClick={() => onClickClose(item)}>
                                          <img
                                            src={crossIcon}
                                            alt="closeIcon"
                                            className="closeIcon"
                                          />
                                        </span>

                                        <FinanceMaturing financeMaturingDetails={financeMaturingDetails} />
                                      </Card>
                                    }
                                    className={draggble ? "draggble" : ""}
                                  />
                                )
                                  : ""}
                          </Col>
                        </List.Item>
                      )
                    }}
                  />
                </ReactDragListView>
              </Col>
            </Row>
          )
            : socketInfoData?.status_data?.[0].APF_seller === true ? (
              <Row gutter={24} style={{ padding: 0 }}>
                <Col span={12} style={{ padding: 0 }}>
                  <ReactDragListView
                    nodeSelector=".ant-list-item.draggble"
                    onDragEnd={onDragEnd}
                  >
                    <List
                      size="small"
                      dataSource={checkedList}
                      renderItem={(item) => {
                        const draggble =
                          item !== "Racing car sprays burning fuel into crowd.";
                        return (
                          <List.Item
                            className={draggble ? "draggble" : ""}
                          >
                            <Col span={24}>
                              {programData !== null && item === "Program" ? (
                                <List.Item.Meta
                                  title={""}
                                  description={
                                    <Card
                                      className="cardContainer"
                                      style={{
                                        height: "410px",
                                        marginBottom: "20px",
                                        borderRadius: "25px",
                                      }}
                                    >
                                      <span onClick={() => onClickClose(item)}>
                                        <img
                                          src={crossIcon}
                                          alt="closeIcon"
                                          className="closeIcon"
                                        />
                                      </span>
                                      <ProgramCard programData={programData} />
                                    </Card>
                                  }
                                  className={draggble ? "draggble" : ""}
                                />
                              )

                                : item === "Funds Expected" ? (
                                  <List.Item.Meta
                                    title={""}
                                    description={
                                      <Card
                                        className="cardContainer"
                                        style={{
                                          height: "410px",
                                          marginBottom: "20px",
                                          borderRadius: "25px",
                                        }}
                                      >
                                        <span onClick={() => onClickClose(item)}>
                                          <img
                                            src={crossIcon}
                                            alt="closeIcon"
                                            className="closeIcon"
                                          />
                                        </span>

                                        <FundsExpected fundsExpected={fundsExpected} />
                                      </Card>
                                    }
                                    className={draggble ? "draggble" : ""}
                                  />
                                )

                                  : ""}
                            </Col>
                          </List.Item>
                        )
                      }}
                    />
                  </ReactDragListView>
                </Col>
                <Col span={12} style={{ padding: 0 }}>
                  <ReactDragListView
                    nodeSelector=".ant-list-item.draggble"
                    onDragEnd={onDragEnd}
                  >
                    <List
                      size="small"
                      dataSource={checkedList}
                      renderItem={(item) => {
                        const draggble =
                          item !== "Racing car sprays burning fuel into crowd.";
                        return (
                          <List.Item
                            className={draggble ? "draggble" : ""}
                          >
                            <Col span={24}>
                              {
                                item === "Invoice Details" ? (
                                  <List.Item.Meta
                                    title={""}
                                    description={
                                      <Card
                                        className="cardContainer"
                                        style={{
                                          height: "410px",
                                          marginBottom: "20px",
                                          borderRadius: "25px",
                                          padding: "0"
                                        }}
                                      >
                                        <span onClick={() => onClickClose(item)}>
                                          <img
                                            src={crossIcon}
                                            alt="closeIcon"
                                            className="closeIcon"
                                          />
                                        </span>

                                        <h2>Invoice Details </h2>

                                        <Row gutter={24} style={{ marginBottom: "30px" }}>
                                          <Col span={12}>
                                            <Card style={{ backgroundColor: "#E6F5B3" }}>
                                              <h1>Awaiting Buyer Approval</h1>
                                              <p> {invoiceDetails?.AWAITING_BUYER_APPROVAL ? invoiceDetails?.AWAITING_BUYER_APPROVAL : 0}</p>
                                            </Card>
                                          </Col>
                                          <Col span={12}>
                                            <Card style={{ backgroundColor: "#F5E8B3" }}>
                                              <h1>Approved by Buyer</h1>
                                              <p> {invoiceDetails?.APPROVED_BY_BUYER ? invoiceDetails?.APPROVED_BY_BUYER : 0}</p>
                                            </Card>
                                          </Col>
                                        </Row>
                                        <Row gutter={24}>
                                          <Col span={12}>
                                            <Card style={{ backgroundColor: "#DDECFF" }}>
                                              <h1>Finance Requested</h1>
                                              <p> {invoiceDetails?.FINANCE_REQUESTED ? invoiceDetails?.FINANCE_REQUESTED : 0}</p>
                                            </Card>
                                          </Col>
                                          <Col span={12}>
                                            <Card style={{ backgroundColor: "#F5BBB3" }}>
                                              <h1>Financed</h1>
                                              <p> {invoiceDetails?.FINANCED ? invoiceDetails?.FINANCED : 0}</p>
                                            </Card>
                                          </Col>
                                        </Row>
                                      </Card>
                                    }
                                    className={draggble ? "draggble" : ""}
                                  />
                                )

                                  :
                                  item === "Finances Maturing" && socketInfoData?.status_data?.[0].party_type === PartyType.CUSTOMER ? (
                                    <List.Item.Meta
                                      title={""}
                                      description={
                                        <Card
                                          className="cardContainer"
                                          style={{
                                            height: "410px",
                                            marginBottom: "20px",
                                            borderRadius: "25px",
                                          }}
                                        >
                                          <span onClick={() => onClickClose(item)}>
                                            <img
                                              src={crossIcon}
                                              alt="closeIcon"
                                              className="closeIcon"
                                            />
                                          </span>

                                          <FinanceMaturing financeMaturingDetails={financeMaturingDetails} />
                                        </Card>
                                      }
                                      className={draggble ? "draggble" : ""}
                                    />
                                  )
                                    : ""}
                            </Col>
                          </List.Item>
                        )
                      }}
                    />
                  </ReactDragListView>
                </Col>
              </Row>
            )
              : socketInfoData?.status_data?.[0].APF_buyer === true ? (
                <Row gutter={24} style={{ padding: 0 }}>

                  <Col span={12} style={{ padding: 0 }}>
                    <ReactDragListView
                      nodeSelector=".ant-list-item.draggble"
                      onDragEnd={onDragEnd}
                    >
                      <List
                        size="small"
                        dataSource={checkedList}
                        renderItem={(item) => {
                          const draggble =
                            item !== "Racing car sprays burning fuel into crowd.";
                          return (
                            <List.Item
                              className={draggble ? "draggble" : ""}
                            >
                              <Col span={24}>
                                {

                                  item === "Finances Maturing" && socketInfoData?.status_data?.[0].party_type === PartyType.CUSTOMER ? (
                                    <List.Item.Meta
                                      title={""}
                                      description={
                                        <Card
                                          className="cardContainer"
                                          style={{
                                            height: "410px",
                                            marginBottom: "20px",
                                            borderRadius: "25px",
                                          }}
                                        >
                                          <span onClick={() => onClickClose(item)}>
                                            <img
                                              src={crossIcon}
                                              alt="closeIcon"
                                              className="closeIcon"
                                            />
                                          </span>

                                          <FinanceMaturing financeMaturingDetails={financeMaturingDetails} />
                                        </Card>
                                      }
                                      className={draggble ? "draggble" : ""}
                                    />
                                  )
                                    : ""}
                              </Col>
                            </List.Item>
                          )
                        }}
                      />
                    </ReactDragListView>
                  </Col>
                </Row>

              )
                :
                null
          }

        </div>
      </div>
    )
  );
};
export default Dashboard;
