import { Card, Row, Col, Tooltip } from "antd";
import moment from 'moment'
import { useNavigate } from "react-router";
import images from "../../../assets/images";
const Program = ({ programData }: any) => {
  const navigate = useNavigate();
  const {BlackRightArrow} = images
  const routeToProgram = (key: any) => {
    if (key === "apf") {
      navigate("/ProgramDetailView", { state: { data: programData?.apf, programType: "apf" } })
    } else {
      navigate("/ProgramDetailView", { state: { data: programData?.rf, programType: "rf" } })
    }
  }
  return (
    <div className="dashboardProgramCard">
      <h2>Program </h2>
      {
        (((programData?.rf !==null ) && (programData?.apf === null))||((programData?.rf?.count > 0 ) && (programData?.apf?.count === 0))) ?
            <>
              <Row gutter={24} style={{ marginBottom: "30px" }}>
                <Col span={24} style={{ marginBottom: "30px" }}>
                  <Card className="programContainer" >
                    <div className="programRowContainer">
                      <h1>Receivable Finance ( {programData?.rf?.count} )</h1>
                    </div>
                    <div style={{ float: "right", marginTop: "-40px", fontSize: "18px",cursor:"pointer" }} onClick={() => routeToProgram("rf")}>More <span><img src={BlackRightArrow} alt="rightarrow" className="dashboardRightArrow"/></span></div>
                    <div className='dashboardContainerTable '>
                      <div className="OuterDiv">
                        <div className='HeadInnerDiv'>
                          <h1 className='head'>{'Max. Limit Amt'}</h1>
                          <h1 className='head'>{'Available Limit'}</h1>
                          <h1 className='head'>{'Expiry Date'}</h1>
                        </div>
                      </div>
                      {programData?.rf?.data.slice(0, 3).map((item: any) => {
                        return <Tooltip title={
                          <div>
                            <p>Max.Invoice Amount : {item?.max_invoice_currency__description} {item.max_invoice_amount}</p>
                            <p>Max.Invoice PCT : {item.max_invoice_percent}</p>
                            <p>Max Tenor : {item.max_tenor}</p>
                            <p>Grace Period : {item.grace_period}</p>
                            <p>Interest Rate (%): {item.interest_type__description === "FIXED" ? item.margin : item.interest_rate_type__description + " + " + item.margin}</p>

                          </div>
                        } >
                          <div className='OuterDiv'>
                            <div className="InnerDiv" style={{cursor:"default"}}>
                              <h5 className='body'>
                                {item?.limit_currency__description}  {item?.max_limit_amount}
                              </h5>
                              <h5 className='body'>
                                {item?.limit_currency__description} {item?.available_limit}
                              </h5>
                              <h5 className='body'>
                                {moment(item?.expiry_date).format("DD-MM-YYYY")}
                              </h5>
                            </div>
                          </div>
                        </Tooltip>
                      })}

                    </div>
                  </Card>

                </Col>

              </Row>
            </>
            : (((programData?.apf !==null) && (programData?.rf === null))||((programData?.apf?.count >0) && (programData?.rf?.count === 0)) ) ?
              <>
                <Row gutter={24} style={{ marginBottom: "30px" }}>
                  <Col span={24} style={{ marginBottom: "30px" }}>
                    <Card className="programContainer" >
                      <div className="programRowContainer">
                        <h1>Approved Payable Finance ( {programData?.apf?.count} )</h1>
                      </div>
                      <div style={{ float: "right", marginTop: "-40px", fontSize: "18px",cursor:"pointer" }} onClick={() => routeToProgram("apf")}>More<span><img src={BlackRightArrow} alt="rightarrow" className="dashboardRightArrow"/></span></div>
                      <div className='dashboardContainerTable '>
                        <div className="OuterDiv">
                          <div className='HeadInnerDiv'>
                            <h1 className='head'>{'Max. Limit Amt'}</h1>
                            <h1 className='head'>{'Available Limit'}</h1>
                            <h1 className='head'>{'Expiry Date'}</h1>
                          </div>
                        </div>
                        {programData?.apf?.data.slice(0, 3).map((item: any) => {
                          return <Tooltip title={
                            <div>
                              <p>Max.Invoice Amount : {item?.max_invoice_currency__description} {item.max_invoice_amount}</p>
                              <p>Max.Invoice PCT : {item.max_invoice_percent}</p>
                              <p>Max Tenor : {item.max_tenor}</p>
                              <p>Grace Period : {item.grace_period}</p>
                              <p>Interest Rate (%): {item.interest_type__description === "FIXED" ? item.margin : item.interest_rate_type__description + " + " + item.margin}</p>
                            </div>
                          } >
                            <div className='OuterDiv'>
                              <div className="InnerDiv" style={{cursor:"default"}}>
                                <h5 className='body'>
                                  {item?.limit_currency__description}  {item?.max_limit_amount}
                                </h5>
                                <h5 className='body'>
                                  {item?.limit_currency__description} {item?.available_limit}
                                </h5>
                                <h5 className='body'>
                                  {moment(item?.expiry_date).format("DD-MM-YYYY")}
                                </h5>
                              </div>
                            </div>
                          </Tooltip>
                        })}
                      </div>
                    </Card>
                  </Col>
                </Row>
              </>
              :
              <>
                <Row gutter={24}>
                  <Col span={24} >
                    <Card className="programContainer" >
                      <div className="programRowContainer">
                        <h1>Approved Payable Finance ( {programData?.apf?.count} )</h1>
                      </div>
                      <div style={{ float: "right", marginTop: "-48px", fontSize: "18px",cursor:"pointer" }} onClick={() => routeToProgram("apf")}>More<span><img src={BlackRightArrow} alt="rightarrow" className="dashboardRightArrow"/></span></div>
                      <div className='dashboardContainerTable '>
                        <div className="OuterDiv">
                          <div className='HeadInnerDiv'>
                            <h1 className='head'>{'Max. Limit Amt'}</h1>
                            <h1 className='head'>{'Available Limit'}</h1>
                            <h1 className='head'>{'Expiry Date'}</h1>
                          </div>
                        </div>
                        {programData?.apf?.data.slice(0, 1).map((item: any) => {
                          return <Tooltip title={
                            <div>
                              <p>Max.Invoice Amount : {item?.max_invoice_currency__description} {item.max_invoice_amount}</p>
                              <p>Max.Invoice PCT : {item.max_invoice_percent}</p>
                              <p>Max Tenor : {item.max_tenor}</p>
                              <p>Grace Period : {item.grace_period}</p>
                              <p>Interest Rate (%): {item.interest_type__description === "FIXED" ? item.margin : item.interest_rate_type__description + " + " + item.margin}</p>
                            </div>
                          } >
                            <div className='OuterDiv'>
                              <div className="InnerDiv" style={{cursor:"default"}}>
                                <h5 className='body'>
                                  {item?.limit_currency__description}  {item?.max_limit_amount}
                                </h5>
                                <h5 className='body'>
                                  {item?.limit_currency__description} {item?.available_limit}
                                </h5>
                                <h5 className='body'>
                                  {moment(item?.expiry_date).format("DD-MM-YYYY")}
                                </h5>
                              </div>
                            </div>
                          </Tooltip>
                        })}
                      </div>
                    </Card>
                  </Col>
                </Row>
                <Row gutter={24} style={{ marginBottom: "30px" }}>
                <Col span={24} style={{ marginBottom: "30px" }}>
                  <Card className="programContainer" >
                    <div className="programRowContainer">
                      <h1>Receivable Finance ( {programData?.rf?.count} )</h1>
                    </div>
                    <div style={{ float: "right", marginTop: "-48px", fontSize: "18px",cursor:"pointer" }} onClick={() => routeToProgram("rf")}>More <span><img src={BlackRightArrow} alt="rightarrow" className="dashboardRightArrow"/></span></div>
                    <div className='dashboardContainerTable '>
                      <div className="OuterDiv">
                        <div className='HeadInnerDiv'>
                          <h1 className='head'>{'Max. Limit Amt'}</h1>
                          <h1 className='head'>{'Available Limit'}</h1>
                          <h1 className='head'>{'Expiry Date'}</h1>
                        </div>
                      </div>
                      {programData?.rf?.data.slice(0, 1).map((item: any) => {
                        return <Tooltip title={
                          <div>
                            <p>Max.Invoice Amount : {item?.max_invoice_currency__description} {item.max_invoice_amount}</p>
                            <p>Max.Invoice PCT : {item.max_invoice_percent}</p>
                            <p>Max Tenor : {item.max_tenor}</p>
                            <p>Grace Period : {item.grace_period}</p>
                            <p>Interest Rate (%): {item.interest_type__description === "FIXED" ? item.margin : item.interest_rate_type__description + " + " + item.margin}</p>

                          </div>
                        } >
                          <div className='OuterDiv'>
                            <div className="InnerDiv" style={{cursor:"default"}}>
                              <h5 className='body'>
                                {item?.limit_currency__description}  {item?.max_limit_amount}
                              </h5>
                              <h5 className='body'>
                                {item?.limit_currency__description} {item?.available_limit}
                              </h5>
                              <h5 className='body'>
                                {moment(item?.expiry_date).format("DD-MM-YYYY")}
                              </h5>
                            </div>
                          </div>
                        </Tooltip>
                      })}

                    </div>
                  </Card>

                </Col>

              </Row>
              </>
      }
    </div>
  )
}
export default Program;
