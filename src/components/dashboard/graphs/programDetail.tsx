import { useState } from 'react';
import { Card, Row, Col, Button } from "antd";
import { useNavigate, useLocation } from "react-router";
import moment from 'moment';
const Program = () => {
    const { state } = useLocation();
    const navigate = useNavigate()
    const [programData] = useState(state as any);
    const onClickExit = () => {
        navigate("/Dashboard")
    }
    return (
        <>
            <div className="ProgramDetailContainer">
                <div className="Button_Container">
                    <Button className="ExitButtonContainer" onClick={onClickExit} id={`${programData?.fromMenu}_${programData?.recordType}_program_exit`}>
                        Exit
                    </Button>
                </div>
            </div>
            <Card style={{ paddingTop: "6%" }}>
                <div className="dashboardProgramCard">
                    <h2>{programData?.programType === "apf" ? `Approved Payable Finance ( ${programData?.data?.count} )` : `Receivable Finance ( ${programData?.data?.count} )`} </h2>
                    {

                        <Row gutter={24} style={{ marginBottom: "30px" }}>

                            <Col span={24} style={{ marginBottom: "30px" }}>
                                <div className='containerTable '>
                                    <div className="OuterDiv">

                                        <div className='HeadInnerDiv'>
                                            <h1 className='head'>{'Buyer'}</h1>
                                            <h1 className='head'>{'Max. Limit Amt'}</h1>
                                            <h1 className='head'>{'Available Limit'}</h1>
                                            <h1 className='head'>{'Expiry Date'}</h1>
                                            <h1 className='head'>{'Max.Invoice Amt'}</h1>
                                            <h1 className='head'>{'Max.Invoice PCT'}</h1>
                                            <h1 className='head'>{'Max Tenor'}</h1>
                                            <h1 className='head'>{'Interest Rate (%)'}</h1>
                                        </div>

                                    </div>
                                    {programData?.data?.data?.map((item: any) => {
                                        return (
                                            <div className='OuterDiv'>
                                                <div className="InnerDiv" style={{cursor:"default"}}>
                                                    <h5 className='body'>
                                                        {item?.buyer_name}
                                                    </h5>
                                                    <h5 className='body'>
                                                        {item?.limit_currency__description}  {item?.max_limit_amount}
                                                    </h5>
                                                    <h5 className='body'>
                                                        {item?.limit_currency__description} {item?.available_limit}
                                                    </h5>
                                                    <h5 className='body'>
                                                        {moment(item?.expiry_date).format("DD-MM-YYYY")}
                                                    </h5>
                                                    <h5 className='body'>
                                                        {item?.max_invoice_currency__description} {item.max_invoice_amount}
                                                    </h5>
                                                    <h5 className='body'>
                                                        {item.max_invoice_percent}
                                                    </h5>
                                                    <h5 className='body'>
                                                        {item.max_tenor}
                                                    </h5>
                                                    <h5 className='body'>
                                                        {item.interest_type__description === "FIXED" ? item.margin : item.interest_rate_type__description + " + " + item.margin}
                                                    </h5>
                                                </div>

                                            </div>
                                        )

                                    })}
                                </div>
                            </Col>
                        </Row>
                    }
                </div>
            </Card>
        </>
    )
}
export default Program;
