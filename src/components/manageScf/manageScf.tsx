import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Row, Col, Card, Spin } from "antd";
import Images from "../../assets/images";
import "./manageScf.scss";
import { useDispatch } from "react-redux";

import httpClient from "../../utils/config/core/httpClient";
import baseurl from "../../utils/config/url/base";
import { Currency } from "../api/base";
import { ProgramType } from "../../utils/enum/choices";
import Heading from "../common/heading/heading";

const ManageScf = () => {

  const Navigator = useNavigate();
  const dispatch = useDispatch();
  const index = 0 as any;

  const { ApfProgram, RfProgram, DfProgram, halfCircle } = Images;

  const [hoverData, setHoverData] = useState("");
  const [currencyData, setCurrencyData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [programList, setProgramList] = useState([] as any)

  const scfHoverContent = [
    {
      heading: "APF Program",
      paragraph: `Approved Payables Finance is provided through a buyer-led programme within which sellers in the buyer’s supply chain are able to access finance by means of Receivables Purchase. The technique provides a seller of goods or services with the option of receiving the discounted value of receivables (represented by outstanding invoices) prior to their actual due date and typically at a financing cost aligned with the credit risk of the buyer. The payable continues to be due by the buyer until its due date.`,
      image: ApfProgram,
    },
    {
      heading: "RF Program",
      paragraph: `Receivables financing is when a business transforms its outstanding accounts receivables (AR) into cash via a financing facility using the receivables as collateral. These receivables are invoices issued to customers, but the payment has not been made yet.`,
      image: RfProgram,
    },
    {
      heading: "DF Program",
      paragraph: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.`,
      image: DfProgram,
    },
  ];


  const onClickProgram = (programType: string, routeTo: string) => {
    console.log("resp program type", programType)
    // if (programList.length > 0) {
    //   programList.map((item: any, index: any) => {
    //     if (item.program_type === programType) {
    //       Navigator(`/${routeTo}`, { state: programType });
    //       // Navigator(`/${routeTo}`, { state: item });
    //       // toStoreProgramData(item)
    //       // dispatch(program_Basicdetails(item))
    //     } else {
    //       Navigator(`/${routeTo}`, { state: programType });
    //     }
    //   })
    // } else {
      setLoading(true)
    Navigator(`/${routeTo}`, { state: programType });
    // }
    setTimeout(()=>{
      setLoading(false)
    },1000)
  }
  const mouseOver = (data: any) => {
    setHoverData(data);
  };

  const getCurrency = async () => {
    const data = await Currency()
    setCurrencyData(data)
  }
  const getProgram = () => {
    setLoading(true)
    httpClient
      .getInstance()
      .get(`${baseurl}api/program/`)
      .then((resp: any) => {
        setProgramList(resp.data.data);
        // dispatch(
        //   program_Basicdetails(resp.data.data[0]
        //   ))
        setTimeout(() => {
          setLoading(false)
        }, 1000)

      })
  }
  useEffect(() => {
    getCurrency();
    // if (localStorage.getItem("user") === "Bank") {
    //   httpClient
    //     .getInstance()
    //     .get(`${baseurl}api/program/?party_name=${program_basicdetail_data?.payload?.programBasicdetailsData[0].name}`)
    //     .then((resp: any) => {
    //       setLoading(false)
    //       // toStoreProgramData(resp.data.data[0])
    //       // dispatch(program_Basicdetails(resp.data.data?.[0]))
    //     })
    //     .catch((error) => {
    //       setLoading(false)
    //     })
    // } else {
    getProgram();
    // }
  }, []);

  return loading ? <Spin /> : (
    <React.Fragment>
      {/* <div > */}
      <div className="fixedContainer">
        <Heading flag="manageScf" text="Manage Your Credit" subText={`- ${localStorage.getItem("party_name")}`} />
      </div>
      <div
      // style={{padding:"24px"}}
      >


        <div
          className="manageScfContainer mainContentContainer"
        // style={{paddingTop:"45px"}}
        >

          <Row gutter={24}>
            <Col span={8} >
              <Card id={"APF"} key={"APF"} onMouseOver={() => mouseOver("APF")} onClick={() => onClickProgram("APF", "ApprovedPayableFinancing")} className="programCard" >
                <h1 id={`APF Program`}>{"Approved Payable Finance"} Program</h1>
                <p>
                  {programList?.[1]?.limit_currency || programList?.[0]?.limit_currency !== undefined ?
                    currencyData.map((currency: any) => {
                      if (programList?.[1]?.program_type === ProgramType.APF) {
                        if (currency.id === programList?.[1]?.limit_currency) {
                          return `${currency.description} ${new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(programList[1].max_limit_amount)}`
                        }
                      } else if (programList?.[0]?.program_type === ProgramType.APF) {
                        if (currency.id === programList?.[0]?.limit_currency) {
                          return `${currency.description} ${new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(programList[0].max_limit_amount)}`
                        }
                      }
                    }) : "0.00"}
                </p>
                <Button className={programList?.[index]?.status === "APPROVED"
                  ? "approvedButtonView"
                  : programList?.[index]?.status === "IN PROGRESS"
                    ? "pendingButtonView"
                    : "notEnrolledButtonView"}
                  id={"apf_status"}>
                  {programList?.[index]?.status !== undefined ?
                    programList?.[1]?.program_type === ProgramType.APF ? programList?.[1]?.status
                      : programList?.[0]?.program_type === ProgramType.APF ? programList?.[0]?.status
                        : "NOT ENROLLED" : "NOT ENROLLED"}
                </Button>
                <img src={ApfProgram} alt="scfprogramimage" className="program_image" />
              </Card>
            </Col>
            <Col span={8}>
              <Card id={"RF"} key={"RF"} onMouseOver={() => mouseOver("RF")} onClick={() => onClickProgram("RF", "ReceivableFinancing")} className="programCard" >
                <h1 id={`${"RF "}Program`}>{"Receivable Finance"} Program</h1>

                <p key={"RF"}>
                  {/* {console.log("data render",programList?.[1]?.limit_currency,"1",programList?.[0]?.limit_currency)}
          {console.log("data render",programList?.[1]?.program_type,"1",programList?.[0]?.program_type)} */}
                  {programList?.[1]?.limit_currency !== undefined && programList?.[0]?.limit_currency !== ProgramType.RF ?
                    currencyData.map((currency: any) => {
                      if (programList?.[1]?.program_type === ProgramType.RF) {
                        if (currency.id === programList?.[1]?.limit_currency) {
                          return `${currency.description} ${new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(programList[1].max_limit_amount)}`
                        }
                      } else if (programList?.[0]?.program_type === ProgramType.RF) {
                        if (currency.id === programList?.[0]?.limit_currency) {
                          return `${currency.description} ${new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(programList[0].max_limit_amount)}`
                        }
                      }
                    }) : "0.00"}
                </p>
                <Button className={programList?.[1]?.limit_currency !== undefined && programList?.[0]?.limit_currency !== ProgramType.RF && programList?.[0]?.status === "APPROVED"
                  ? "approvedButtonView"
                  : programList?.[1]?.limit_currency !== undefined && programList?.[0]?.limit_currency !== ProgramType.RF && programList?.[0]?.status === "IN PROGRESS" ?
                    "pendingButtonView" :
                    programList?.[1]?.limit_currency !== undefined && programList?.[1]?.limit_currency !== ProgramType.RF && programList?.[1]?.status === "APPROVED"
                      ? "approvedButtonView"
                      : programList?.[1]?.limit_currency !== undefined && programList?.[1]?.limit_currency !== ProgramType.RF && programList?.[1]?.status === "IN PROGRESS" ?
                        "pendingButtonView"
                        //  : programList?.[0]?.limit_currency !== undefined && programList?.[0]?.status === "IN PROGRESS" ?
                        //  : programList?.[index]?.status === "IN PROGRESS"
                        //    ? "pendingButtonView"
                        : "notEnrolledButtonView"}

                  id={"rf_status"}>
                  {programList?.[index]?.status !== undefined ?
                    programList?.[1]?.program_type === ProgramType.RF ? programList?.[1]?.status
                      : programList?.[0]?.program_type === ProgramType.RF ? programList?.[0]?.status
                        : "NOT ENROLLED" : "NOT ENROLLED"}
                </Button>
                <img src={RfProgram} alt="scfprogramimage" className="program_image" />
              </Card>
            </Col>
            <Col span={8} >
              <Card id={"DF"} key={"DF"} onMouseOver={() => mouseOver("DF")}
                // onClick={() => onClickProgram("DF", "ReceivableFinancing")} 
                className="programCard" style={{ cursor: "auto" }}>
                <h1 id={`${"DF "}Program`}>{"D Finance"} Program</h1>

                <p key={"DF"}>
                  {/* {console.log("data render",programList?.[1]?.limit_currency,"1",programList?.[0]?.limit_currency)}
          {console.log("data render",programList?.[1]?.program_type,"1",programList?.[0]?.program_type)} */}
                  {programList?.[1]?.limit_currency !== undefined && programList?.[0]?.limit_currency !== ProgramType.RF ?
                    currencyData.map((currency: any) => {
                      if (programList?.[1]?.program_type === ProgramType.RF) {
                        if (currency.id === programList?.[1]?.limit_currency) {
                          return `${currency.description} ${new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(programList[1].max_limit_amount)}`
                        }
                      } else if (programList?.[0]?.program_type === ProgramType.RF) {
                        if (currency.id === programList?.[0]?.limit_currency) {
                          return `${currency.description} ${new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(programList[0].max_limit_amount)}`
                        }
                      }
                    }) : "0.00"}
                </p>
                <Button className={"notEnrolledButtonView"} id={"rf_status"}>
                  {programList?.[index]?.status !== undefined ?
                    programList?.[1]?.program_type === ProgramType.RF ? programList?.[1]?.status
                      : programList?.[0]?.program_type === ProgramType.RF ? programList?.[0]?.status
                        : "NOT ENROLLED" : "NOT ENROLLED"}
                </Button>
                <img src={DfProgram} alt="scfprogramimage" className="program_image" />
              </Card>
            </Col>
          </Row>
          <Card className="manageProgramHoverCard">
            <Row gutter={24}>
              <Col span={17}>
                <h1> {hoverData === "DF" ? scfHoverContent[2].heading : hoverData === ProgramType.RF ? scfHoverContent[1].heading : scfHoverContent[0].heading} </h1>
                <p> {hoverData === "DF" ? scfHoverContent[2].paragraph : hoverData === ProgramType.RF ? scfHoverContent[1].paragraph : scfHoverContent[0].paragraph} </p>
              </Col>
              <Col span={7}>
                <img src={halfCircle} alt="circleBackground" className="programHover_circleImage" />
                <img src={hoverData === "DF" ? scfHoverContent[2].image : hoverData === ProgramType.RF ? scfHoverContent[1].image : scfHoverContent[0].image} className="programHover_image" alt="hoverContent" />
              </Col>
            </Row>
          </Card>
        </div>
      </div>

    </React.Fragment>
  );
};
export default ManageScf;