import { Tabs, Checkbox, Spin, Button, Row, Col, message } from "antd";
import { useEffect, useState } from "react";
import httpClient from "../../../utils/config/core/httpClient";
import baseurl from "../../../utils/config/url/base";
import { useNavigate } from "react-router";
import { ErrorMessage } from "../../../utils/enum/messageChoices";
import { ResponseStatus } from "../../../utils/enum/choices";
const ApprovedPayable = () => {
    const loginData = localStorage.getItem("login_detail") || "";
    const logindata = JSON.parse(loginData)
    const navigate = useNavigate()
    const { TabPane } = Tabs;
    const [tabList, setTabList] = useState([] as any);
    const [isLoading, setIsLoading] = useState(false)
    // const [actionData, setActionData] = useState([])
    const [buttonLoading, setButtonLoading] = useState(false)
    const getTransactionAuth = () => {
        httpClient
            .getInstance()
            .get(`${baseurl}api/transaction-auth/`)
            .then((resp: any) => {
                if (resp?.data?.data?.APF_BUYER) {
                    setTabList(resp?.data?.data?.APF_BUYER)
                } else if (resp?.data?.data?.APF_SELLER) {
                    setTabList(resp?.data?.data?.APF_SELLER)
                } else if (resp?.data?.data?.BANK) {
                    setTabList(resp?.data?.data?.BANK)

                } else {
                    setTabList(resp?.data?.data)
                }
            })
            .catch(()=>{
                navigate("/Notfound")
              })
    }
    useEffect(() => {
        httpClient
            .getInstance()
            .get(`${baseurl}finflo/action/?party_id=${logindata.party_id}`)
            .then((response: any) => {
                if (response.data.data.length !== 0) {
                    localStorage.setItem("enableMenu", "true")
                    getTransactionAuth()
                } else {
                    getTransactionAuth()
                }
            })
            .catch(()=>{
                navigate("/Notfound")
              })
        setTimeout(() => {
            setIsLoading(false)
        }, 1000)
    }, [])

    const transactionAuth = (value: any) => {
        httpClient
            .getInstance()
            .get(`${baseurl}finflo/action/?party_id=${logindata.party_id}&model=${value}`)
            .then((response: any) => {
                if (response.data.data.length !== 0) {
                    // setActionData(response.data.data)

                }
            })
            .catch(()=>{
                navigate("/Notfound")
              })
    }

    const callback = (value: any) => {
        transactionAuth(value)
    }

    const handleCheckboxChange = (rowId: number, data: any, columnName: any) => {
        setIsLoading(true)
        setTabList((prevData: any) =>
            prevData.map((row: any) => {
                if (row.name === data.name) {
                    data.action.map((value: any) => {
                        if (value.type === rowId) {
                            if (columnName === "dataEntry") {
                                const updatedRow = { value, [columnName]: !row[columnName] };
                                if (updatedRow[columnName]) {
                                    updatedRow.value.sign_required = 1
                                } else {
                                    updatedRow.value.sign_required = 1
                                }
                                return updatedRow;
                            } else if (columnName === "signA") {
                                const updatedRow = { value, [columnName]: !row[columnName] };
                                if (updatedRow[columnName]) {
                                    updatedRow.value.sign_required = 2
                                }
                                else {
                                    updatedRow.value.sign_required = 1
                                }
                                return updatedRow;
                            } else
                                if (columnName === "signB") {
                                    const updatedRow = { value, [columnName]: !row[columnName] };
                                    if (updatedRow[columnName]) {
                                        updatedRow.value.sign_required = 3
                                    } else {
                                        updatedRow.value.sign_required = 2
                                    }
                                    return updatedRow;
                                } else if (columnName === "signC") {
                                    const updatedRow = { value, [columnName]: !row[columnName] };
                                    if (updatedRow[columnName]) {
                                        updatedRow.value.sign_required = 4
                                    } else {
                                        updatedRow.value.sign_required = 3
                                    }
                                    return updatedRow;
                                }
                        }
                        return value;
                    })
                }
                return row;
            })
        );
        setTimeout(() => {
            setIsLoading(false)
        }, 1000)
    };

    const transactionSubmit = () => {
        setButtonLoading(true)
        httpClient
            .getInstance()
            .get(`${baseurl}finflo/action/?party_id=${logindata.party_id}`)
            .then((resp: any) => {
                if (resp.data.data.length === 0) {
                    const body = {
                        type: "transaction",
                        data: tabList
                    }
                    httpClient
                        .getInstance()
                        .post(`${baseurl}api/transaction-auth/`, body)
                        .then((resp: any) => {
                            setButtonLoading(false)
                            if (resp.data.status === ResponseStatus.SUCCESS) {
                                message.success(ErrorMessage.TCS)
                                localStorage.setItem("enableMenu", "false")
                            navigate("/Dashboard")
                            window.location.reload()
                            }else{
                                message.error(resp.data.data,3)
                                // window.location.reload()
                                setTimeout(()=>{
                                    window.location.reload()
                                },2000)
                            }
                            
                        })
                        .catch(()=>{
                            navigate("/Notfound")
                          })

                } else {
                    const body = {
                        type: "transaction",
                        data: tabList
                    }
                    httpClient
                        .getInstance()
                        .put(`${baseurl}api/transaction-auth/update/`, body)
                        .then((resp: any) => {
                            setButtonLoading(false)
                            if (resp.data.status === ResponseStatus.SUCCESS) {
                                message.success(ErrorMessage.TUS)
                                navigate("/Dashboard")
                            }
                            else{
                                message.error(resp.data.data,3)
                                setTimeout(()=>{
                                    window.location.reload()
                                },2000)
                            }
                            
                        })
                        .catch(()=>{
                            navigate("/Notfound")
                          })
                }

            })
            .catch(()=>{
                navigate("/Notfound")
              })
    }

    return (
        <>
            <Row>
                <Col span={21}></Col>
                <Col span={3}>
                    <Button className="transactionSubmit" onClick={transactionSubmit} loading={buttonLoading}id="transactionSubmit">submit</Button>
                </Col>
            </Row>
            <div className="TabContainer">
                <Tabs defaultActiveKey="1" onChange={callback} id={`transaction`}
                items={tabList?.map((item: any, idex: number) => ({
                    key: item.name,
                    label: item.name,
                    id:item.name,
                    children: <div className='containerTable'>
                    <div className="OuterDiv">
                        <div className='HeadInnerDiv'>
                            <h1 className='head' style={{width:"20%",textAlign:"center"}}>Actions</h1>
                            <h1 className='head' style={{width:"20%",textAlign:"center"}}>Data Entry</h1>
                            <h1 className='head' style={{width:"20%",textAlign:"center"}}>Sign A</h1>
                            <h1 className='head' style={{width:"20%",textAlign:"center"}}>Sign B</h1>
                            <h1 className='head' style={{width:"20%",textAlign:"center"}}>Sign C</h1>
                        </div>

                    </div>
                    {isLoading ? <Spin /> :
                        <div className='OuterDiv'>
                            {tabList[idex]?.action && tabList[idex]?.action?.map((record: any, indx: number) => {
                                return (
                                    <div
                                        key={indx}
                                        className={'InnerDiv'}id={`transaction${record.type}`} >
                                        <h5 className='body' style={{width:"20%",textAlign:"center"}}>
                                            {record?.type}
                                        </h5>
                                        <h5 className='body' key={record.id}style={{width:"20%",textAlign:"center"}}>
                                            <Checkbox
                                                id={`${item.name}${record?.type}dataentry$`}
                                                defaultChecked={record.sign_required === 1 || record.sign_required === 2 || record.sign_required === 3 || record.sign_required === 4 ? true : false}
                                                onChange={() => handleCheckboxChange(record?.type, tabList[idex], "dataEntry")}
                                            />
                                        </h5>
                                        <h5 className='body'style={{width:"20%",textAlign:"center"}}>
                                            <Checkbox
                                                defaultChecked={(record.sign_required === 4 || record.sign_required === 3 || record.sign_required === 2) ? true : false}
                                                onChange={() => handleCheckboxChange(record?.type, tabList[idex], "signA")}
                                                id={`${item.name}${record?.type}signA`}
                                            />
                                        </h5>
                                        <h5 className='body' style={{width:"20%",textAlign:"center"}}>
                                            <Checkbox
                                                defaultChecked={record.sign_required === 4 || record.sign_required === 3 ? true : false}
                                                onChange={() => handleCheckboxChange(record.type, tabList[idex], "signB")}
                                                id={`${item.name}${record?.type}signB`}
                                            />
                                        </h5>
                                        <h5 className='body' style={{width:"20%",textAlign:"center"}}>
                                            <Checkbox
                                                defaultChecked={record.sign_required === 4 ? true : false}
                                                id={`${item.name}${record?.type}signC`}
                                                onChange={() => handleCheckboxChange(record.type, tabList[idex], "signC")}

                                            />
                                        </h5>
                                    </div>
                                )
                            })}
                        </div>
                    }

                </div>
                }))}
                />
            </div>
        </>
    );
};

export default ApprovedPayable;
