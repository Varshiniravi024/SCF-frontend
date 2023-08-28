import React, { useState } from "react";
import { Row, Col, Spin, Card, Form, Input, Button } from "antd";
import httpClient from "../../../utils/config/core/httpClient";
import baseurl from "../../../utils/config/url/base";
// import { Currency } from "../../api/base";
import { useNavigate } from "react-router-dom";
import { FieldErrorMessages } from "../../../utils/enum/messageChoices";

const Repayment = () => {
    const [Loading, setLoading] = useState(true)
    // const [invoiceData, setInvoiceData] = useState([])
    // const [currencyData, setCurrencyData] = useState([]);
    const [buttonLoading, setButtonLoading] = useState(false)
    const Navigator = useNavigate();


    // const getCurrency = async () => {
    //     const data = await Currency()
    //     setCurrencyData(data)
    // }

    // useEffect(() => {
    //     getCurrency();


    // }, [])
    const onFinish = (values: any) => {
        setButtonLoading(true)
        httpClient
            .getInstance()
            .get(`${baseurl}api/finance-request/?customer_id=${values.customer_id}`)
            .then((resp: any) => {
                setButtonLoading(false)
                setLoading(false)
                localStorage.setItem("repayment_customerID", values.customer_id)
                Navigator("/Repayment")

            })
            .catch((error) => {
                setLoading(false);
                Navigator("/Notfound")
            })

    }
    // const onclickDetail = (data: any) => {
    //     Navigator("/RepaymentDetail", { state: { data: data } })
    // }
    // const onClickExit = () => {
    //     setInvoiceData([])
    // }
    // const HeadersData = [{
    //     Type: 'Invoice No', Status: 'Status', InvoiceAmount: 'Invoice Amount', FinanceAmount: 'Outstanding Amount', FinanceDue: 'Finance Date', Due: 'Due Date'
    // }]
    return Loading ? <Spin /> : (
        <React.Fragment>

            <div className="manageScfContainer" style={{ marginTop: "12px", border: "none" }}>
                <Row gutter={24}>
                    <Col span={18}>
                        <h2>Repayment</h2>
                    </Col>

                </Row>
                <Card>
                    {
                        <>
                            <div className="createNewAccount loginContainer">

                                <Form
                                    name="basic"
                                    initialValues={{ remember: true }}
                                    onFinish={onFinish}
                                    autoComplete="off"
                                >

                                    <Form.Item
                                        label={"Customer ID"}
                                        name={"customer_id"}
                                        className="FormContainer"
                                        key={"customer_id"}
                                        rules={[
                                            {
                                                required: false,
                                                message: FieldErrorMessages.CUSID,
                                            },
                                        ]}
                                    >
                                        <Input placeholder={"Enter your customerId"} id={"customerId"} />
                                    </Form.Item>

                                    <div className="buttonGroup">
                                        {/* <Form.Item>
                                                 <Button type="default" className="ExitBtnLabel">
                                                     Exit
                                                 </Button>
                                             </Form.Item> */}
                                        <Form.Item>
                                            <Button type="default" htmlType="submit" className="ExitBtnLabel" loading={buttonLoading} id="repay_sumbit">
                                                Submit
                                            </Button>
                                        </Form.Item>
                                    </div>
                                </Form>

                            </div>

                        </>

                    }
                </Card>
            </div>

        </React.Fragment>
    )
}
export default Repayment;