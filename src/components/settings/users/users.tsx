import { Collapse, Row, Col, Tabs, Checkbox, Spin, Button, message } from "antd"
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import httpClient from "../../../utils/config/core/httpClient";
import baseurl from "../../../utils/config/url/base";
import images from "../../../assets/images";
import { ErrorMessage } from "../../../utils/enum/messageChoices";
import { ResponseStatus } from "../../../utils/enum/choices";
const Users = () => {
  const Navigate = useNavigate()
  const { Panel } = Collapse;
  const { CollapseOpenIcon, CollapseCloseIcon } = images
  const [tabList, setTabList] = useState([] as any);
  const [isLoading, setIsLoading] = useState(false)
  const { TabPane } = Tabs;
  const [userData, setUserData] = useState([])
  const [actionData, setActionData] = useState([])
  const [buttonLoading, setButtonLoading] = useState(false)
  useEffect(() => {
    httpClient
      .getInstance()
      .get(`${baseurl}api-auth/user/`)
      .then((resp: any) => {
        setUserData(resp.data.data)
      })
      .catch(() => {
        Navigate("/Notfound")
      })

  }, [])
  const userProcessAuthData = (record: any) => {
    setIsLoading(true)

    httpClient
      .getInstance()
      .get(`${baseurl}api/transaction-auth/`)
      .then((resps: any) => {
        setTabList(resps?.data?.data)
        resps?.data?.data.map((values: any) => {
          values.action.map((datas: any) => {
            if (datas.type) {
              const updatedRow = { datas };
              updatedRow.datas.data_entry = false
              updatedRow.datas.sign_a = false
              updatedRow.datas.sign_b = false
              updatedRow.datas.sign_c = false

              return updatedRow;
            }
          })
          return values
        })

        httpClient
          .getInstance()
          .get(`${baseurl}api-auth/user/userprocess/?user_id=${record.id}`)
          .then((response: any) => {
            if (response.data.data.length !== 0) {
              httpClient
                .getInstance()
                .get(`${baseurl}api-auth/user/userprocess/?user_id=${record.id}&model=${resps?.data?.data?.[0]?.name}`)
                .then((resp: any) => {
                  setActionData(resp.data.data)
                  setTabList((prevData: any) =>
                    prevData.map((values: any) => {
                      resp.data.data.map((item: any) => {
                        if (values.name === item.model) {
                          values.action.map((datas: any) => {
                            if (datas.type === item.action) {
                              const updatedRow = { datas };
                              updatedRow.datas.data_entry = item.data_entry
                              updatedRow.datas.sign_a = item.sign_a
                              updatedRow.datas.sign_b = item.sign_b
                              updatedRow.datas.sign_c = item.sign_c

                              return updatedRow;
                            }

                          })
                        }

                        return item
                      })

                      return values
                    })
                  )

                })
                .catch(() => {
                  Navigate("/Notfound")
                })


            }
          })
          .catch(() => {
            Navigate("/Notfound")
          })
      })
      .catch(() => {
        Navigate("/Notfound")
      })
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)


  }

  const CheckboxChange = (event: any, rowId: number, data: any, columnName: any) => {

    setTabList((prevData: any) =>

      prevData.map((row: any) => {
        if (row.name === data.name) {
          data.action.map((testData: any) => {
            if (testData.type === rowId) {
              if (columnName === "data_entry") {
                const updatedRow = { testData, [columnName]: !row[columnName] };
                if (updatedRow[columnName]) {
                  updatedRow.testData.data_entry = event.target.checked
                  updatedRow.testData.sign_a
                  updatedRow.testData.sign_b
                  updatedRow.testData.sign_c
                  updatedRow.testData.sign_required
                }
                return updatedRow;

              } else
                if (columnName === "sign_a") {
                  const updatedRow = { testData, [columnName]: !row[columnName] };

                  if (updatedRow[columnName]) {
                    updatedRow.testData.sign_a = event.target.checked
                    updatedRow.testData.data_entry
                    updatedRow.testData.sign_b
                    updatedRow.testData.sign_c
                    updatedRow.testData.sign_required
                  }
                  return updatedRow;


                }
                else if (columnName === "sign_b") {
                  const updatedRow = { testData, [columnName]: !row[columnName] };
                  if (updatedRow[columnName]) {
                    updatedRow.testData.sign_b = event.target.checked
                    updatedRow.testData.data_entry
                    updatedRow.testData.sign_a
                    updatedRow.testData.sign_c
                    updatedRow.testData.sign_required
                  }

                  return updatedRow;
                }
                else if (columnName === "sign_c") {
                  const updatedRow = { testData, [columnName]: !row[columnName] };
                  if (updatedRow[columnName]) {
                    updatedRow.testData.sign_c = event.target.checked
                    updatedRow.testData.data_entry
                    updatedRow.testData.sign_a
                    updatedRow.testData.sign_b
                    updatedRow.testData.sign_required
                  }
                  return updatedRow;

                }
            }

            return testData
          })
        }
        return row;
      })


    )

  }

  const handleCheckboxChange_update = (event: any, rowId: number, data: any, columnName: any, recordValue: any) => {
    setTabList((prevData: any) =>

      prevData.map((row: any) => {
        if (row.name === data.name) {

          data.action.map((testData: any) => {
            if (testData.type === rowId) {

              if (columnName === "data_entry") {
                const updatedRow = { testData, [columnName]: !row[columnName] };
                if (updatedRow[columnName]) {

                  updatedRow.testData.data_entry = event.target.checked
                  updatedRow.testData.sign_a = updatedRow.testData.sign_a !== undefined ? updatedRow.testData.sign_a : recordValue.sign_a
                  updatedRow.testData.sign_b = updatedRow.testData.sign_b !== undefined ? updatedRow.testData.sign_b : recordValue.sign_b
                  updatedRow.testData.sign_c = updatedRow.testData.sign_c !== undefined ? updatedRow.testData.sign_c : recordValue.sign_c
                  updatedRow.testData.sign_required

                }

                return updatedRow;

              } else
                if (columnName === "sign_a") {

                  const updatedRow = { testData, [columnName]: !row[columnName] };

                  if (updatedRow[columnName]) {
                    updatedRow.testData.sign_a = event.target.checked
                    updatedRow.testData.data_entry = updatedRow.testData.data_entry !== undefined ? updatedRow.testData.data_entry : recordValue.data_entry
                    updatedRow.testData.sign_b = updatedRow.testData.sign_b !== undefined ? updatedRow.testData.sign_b : recordValue.sign_b
                    updatedRow.testData.sign_c = updatedRow.testData.sign_c !== undefined ? updatedRow.testData.sign_c : recordValue.sign_c
                    updatedRow.testData.sign_required

                  }

                  return updatedRow;


                }
                else if (columnName === "sign_b") {
                  const updatedRow = { testData, [columnName]: !row[columnName] };

                  if (updatedRow[columnName]) {
                    updatedRow.testData.sign_b = event.target.checked
                    updatedRow.testData.data_entry = updatedRow.testData.data_entry !== undefined ? updatedRow.testData.data_entry : recordValue.data_entry
                    updatedRow.testData.sign_a = updatedRow.testData.sign_a !== undefined ? updatedRow.testData.sign_a : recordValue.sign_a
                    updatedRow.testData.sign_c = updatedRow.testData.sign_c !== undefined ? updatedRow.testData.sign_c : recordValue.sign_c
                    updatedRow.testData.sign_required
                  }

                  return updatedRow;
                }
                else if (columnName === "sign_c") {
                  const updatedRow = { testData, [columnName]: !row[columnName] };
                  if (updatedRow[columnName]) {
                    updatedRow.testData.sign_c = event.target.checked
                    updatedRow.testData.data_entry = updatedRow.testData.data_entry !== undefined ? updatedRow.testData.data_entry : recordValue.data_entry
                    updatedRow.testData.sign_a = updatedRow.testData.sign_a !== undefined ? updatedRow.testData.sign_a : recordValue.sign_a
                    updatedRow.testData.sign_b = updatedRow.testData.sign_b !== undefined ? updatedRow.testData.sign_b : recordValue.sign_b
                    updatedRow.testData.sign_required
                  }
                  return updatedRow;

                }


            }

            return testData
          })
        }
        return row;
      })


    )
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }


  const userSubmit = (record: any) => {
    httpClient
      .getInstance()
      .get(`${baseurl}api-auth/user/userprocess/?user_id=${record.id}`)
      .then((resp: any) => {
        if (resp.data.data.length === 0) {
          const body = {
            user_id: record.id,
            type: "user",
            data: tabList
          }
          httpClient
            .getInstance()
            .post(`${baseurl}api/transaction-auth/`, body)
            .then((resp: any) => {
              setButtonLoading(false)
              if (resp.data.status === ResponseStatus.SUCCESS) {
                message.success(ErrorMessage.UTCS)
              }
            })
            .catch(() => {
              Navigate("/Notfound")
            })
        } else {
          const body = {
            user_id: record.id,
            type: "user",
            data: tabList
          }
          httpClient
            .getInstance()
            .put(`${baseurl}api/transaction-auth/update/`, body)
            .then((resp: any) => {
              setButtonLoading(false)
              if (resp.data.status === ResponseStatus.SUCCESS) {
                message.success(ErrorMessage.UTUS)
              }
            })
            .catch(() => {
              Navigate("/Notfound")
            })
        }
      })
      .catch(() => {
        Navigate("/Notfound")
      })


  }
  const callback = (value: any, record: any) => {
    if (actionData.length !== 0) {
      httpClient
        .getInstance()
        .get(`${baseurl}api-auth/user/userprocess/?user_id=${record.id}&model=${value}`)
        .then((resp: any) => {
          setActionData(resp.data.data)
          setIsLoading(false)

          setTabList((prevData: any) =>
            prevData.map((values: any) => {
              resp.data.data.map((item: any) => {
                if (values.name === item.model) {
                  values.action.map((datas: any) => {
                    if (datas.type === item.action) {
                      const updatedRow = { datas };
                      updatedRow.datas.data_entry = item.data_entry
                      updatedRow.datas.sign_a = item.sign_a
                      updatedRow.datas.sign_b = item.sign_b
                      updatedRow.datas.sign_c = item.sign_c

                      return updatedRow;
                    }

                  })
                }

                return item
              })

              return values
            })
          )
        })
        .catch(() => {
          Navigate("/Notfound")
        })
    }

  }

  // const items =  tabList.map((items: any, idex: number) => {
  //   return 
  //   // [
  //     // {
  //       "label":"items.name",
  //       "key":items.name,
  //       id:`${items.name}`,
  //       children:   <div className='containerTable'>
  //       <div className="OuterDiv">
  //         <div className='HeadInnerDiv'>
  //           <h1 className='head'style={{width:"20%",textAlign:"center"}}>Actions</h1>
  //           <h1 className='head'style={{width:"20%",textAlign:"center"}}>Data Entry</h1>
  //           <h1 className='head'style={{width:"20%",textAlign:"center"}}>Sign A</h1>
  //           <h1 className='head'style={{width:"20%",textAlign:"center"}}>Sign B</h1>
  //           <h1 className='head'style={{width:"20%",textAlign:"center"}}>Sign C</h1>
  //         </div>

  //       </div>
  //       {isLoading ? <Spin /> :
  //         <div className='OuterDiv'>
  //           {actionData.length !== 0 ?
  //             actionData && actionData?.map((record: any, indx: number) => {
  //               return (
  //                 <div
  //                   key={record.id}
  //                   className={
  //                     'InnerDiv'}  >
  //                   <h5 className='body' style={{width:"20%",textAlign:"center"}}>
  //                     {record?.action}
  //                   </h5>
  //                   <h5 className='body' key={record.id}style={{width:"20%",textAlign:"center"}}>
  //                     <Checkbox
  //                       id={`dataentry${record.id}`}
  //                       disabled={record.sign_required === 1 || record.sign_required === 2 || record.sign_required === 3 || record.sign_required === 4 ? false : true}
  //                       defaultChecked={record.data_entry === true ? true : false}
  //                       onChange={(e: any) => handleCheckboxChange_update(e, record?.action, tabList[idex], "data_entry", record)}
  //                     /> </h5>
  //                   <h5 className='body'style={{width:"20%",textAlign:"center"}}>
  //                     <div>
  //                       <Checkbox
  //                         disabled={(record.sign_required === 4 || record.sign_required === 3 || record.sign_required === 2) ? false : true}
  //                         defaultChecked={(record.sign_a === true) ? true : false}
  //                         onChange={(e: any) => handleCheckboxChange_update(e, record?.action, tabList[idex], "sign_a", record)}
  //                         id={`signA${record.id}`}
  //                       />
  //                     </div>
  //                   </h5>
  //                   <h5 className='body' style={{width:"20%",textAlign:"center"}}>
  //                     <div>
  //                       <Checkbox
  //                         disabled={record.sign_required === 4 || record.sign_required === 3 ? false : true}
  //                         defaultChecked={record.sign_b === true ? true : false}
  //                         onChange={(e: any) => handleCheckboxChange_update(e, record.action, tabList[idex], "sign_b", record)}
  //                         id={`signB${record.id}`}
  //                       />
  //                     </div>
  //                   </h5>
  //                   <h5 className='body'style={{width:"20%",textAlign:"center"}} >
  //                     <div>
  //                       <Checkbox
  //                         disabled={record.sign_required === 4 ? false : true}
  //                         defaultChecked={record.sign_c === true ? true : false}
  //                         id={`signC${record.id}`}
  //                         onChange={(e: any) => handleCheckboxChange_update(e, record.action, tabList[idex], "sign_c", record)}
  //                       />
  //                     </div>

  //                   </h5>
  //                 </div>
  //               )
  //             })
  //             :
  //             tabList[idex].action && tabList[idex].action?.map((record: any, indx: number) => {
  //               return (
  //                 <div
  //                   key={record.id}
  //                   className={
  //                     'InnerDiv'}  >
  //                   <h5 className='body' style={{width:"20%",textAlign:"center"}}>
  //                     {record?.type}
  //                   </h5>
  //                   <h5 className='body' key={record.id}style={{width:"20%",textAlign:"center"}}>
  //                     <Checkbox
  //                       id={`dataentry${record.id}`}
  //                       disabled={record.sign_required === 1 || record.sign_required === 2 || record.sign_required === 3 || record.sign_required === 4 ? false : true}
  //                       defaultChecked={record.data_entry === true ? true : false}
  //                       onChange={(e: any) => CheckboxChange(e, record?.type, tabList[idex], "data_entry")}
  //                     /> </h5>
  //                   <h5 className='body'style={{width:"20%",textAlign:"center"}}>
  //                     <div>
  //                       <Checkbox
  //                         disabled={(record.sign_required === 4 || record.sign_required === 3 || record.sign_required === 2) ? false : true}
  //                         defaultChecked={(record.sign_a === true) ? true : false}
  //                         onChange={(e: any) => CheckboxChange(e, record?.type, tabList[idex], "sign_a")}
  //                         id={`signA${record.id}`}
  //                       />
  //                     </div>
  //                   </h5>
  //                   <h5 className='body' style={{width:"20%",textAlign:"center"}}>
  //                     <div>
  //                       <Checkbox
  //                         disabled={record.sign_required === 4 || record.sign_required === 3 ? false : true}
  //                         defaultChecked={record.sign_b === true ? true : false}
  //                         onChange={(e: any) => CheckboxChange(e, record.type, tabList[idex], "sign_b")}
  //                         id={`signB${record.id}`}
  //                       />
  //                     </div>
  //                   </h5>
  //                   <h5 className='body' style={{width:"20%",textAlign:"center"}}>
  //                     <div>
  //                       <Checkbox
  //                         disabled={record.sign_required === 4 ? false : true}
  //                         defaultChecked={record.sign_c === true ? true : false}
  //                         id={`signC${record.id}`}
  //                         onChange={(e: any) => CheckboxChange(e, record.type, tabList[idex], "sign_c")}
  //                       />
  //                     </div>

  //                   </h5>
  //                 </div>
  //               )
  //             })}
  //         </div>
  //       }

  //     </div>
  //   //   }
  //   // ]

  // })
  return (
    <div className="userSettingsCollapse">
      {userData?.length > 0 ?
        <Collapse className="counterPartyDetails"
          accordion

          expandIconPosition="end"
          expandIcon={({ isActive }) => isActive ? <img src={CollapseOpenIcon} alt="collapseIcon"
          /> : <img src={CollapseCloseIcon} alt="collapseIcon"
          />}
        >
          {userData?.map((item: any, index: number) => {
            return (
              <Panel
                key={index}
                header={
                  <Row gutter={24} style={{ borderRadius: 25 }} onClick={() => userProcessAuthData(item)}>
                    <Col span={1} ></Col>
                    <Col span={4} >{item.display_name}</Col>
                    <Col span={7} >{item.email}</Col>
                    <Col span={5} >{item.is_administrator === true ? "Admin" : item.is_supervisor === true ? "Supervisor" : "user"}</Col>
                    <Col span={2} >{item.is_active === true ? "Active" : "Inactive"}</Col>
                  </Row>
                }
                id={`users_${index}`}
              >
                <div>
                  <Row>
                    <Col span={21}></Col>
                    <Col span={3}>
                      <Button className="transactionSubmit" onClick={() => userSubmit(item)} loading={buttonLoading} id="userSubmit">submit</Button>
                    </Col>
                  </Row>
                  <div className="TabContainer">
                    <Tabs
                      defaultActiveKey="1"
                      onChange={(e: any) => callback(e, item)}
                      id="users"
                      items={tabList.map((tab: any, idex: number) => ({
                        key: `${tab.name}${idex}`,
                        label: tab.name,
                        id: `${tab.name}${idex}`,
                        children:
                          <div className='containerTable'>
                            <div className="OuterDiv">
                              <div className='HeadInnerDiv'>
                                <h1 className='head' style={{ width: "20%", textAlign: "center" }}>Actions</h1>
                                <h1 className='head' style={{ width: "20%", textAlign: "center" }}>Data Entry</h1>
                                <h1 className='head' style={{ width: "20%", textAlign: "center" }}>Sign A</h1>
                                <h1 className='head' style={{ width: "20%", textAlign: "center" }}>Sign B</h1>
                                <h1 className='head' style={{ width: "20%", textAlign: "center" }}>Sign C</h1>
                              </div>

                            </div>
                            {isLoading ? <Spin /> :
                              <div className='OuterDiv'>
                                {actionData.length !== 0 ?
                                  actionData && actionData?.map((record: any, indx: number) => {
                                    return (
                                      <div
                                        key={indx}
                                        className={
                                          'InnerDiv'}  >
                                        <h5 className='body' style={{ width: "20%", textAlign: "center" }}>
                                          {record?.action}
                                        </h5>
                                        <h5 className='body' key={record.id} style={{ width: "20%", textAlign: "center" }}>
                                          <Checkbox
                                            id={`dataentry${indx}`}
                                            disabled={record.sign_required === 1 || record.sign_required === 2 || record.sign_required === 3 || record.sign_required === 4 ? false : true}
                                            defaultChecked={record.data_entry === true ? true : false}
                                            onChange={(e: any) => handleCheckboxChange_update(e, record?.action, tabList[idex], "data_entry", record)}
                                          /> </h5>
                                        <h5 className='body' style={{ width: "20%", textAlign: "center" }}>
                                          <div>
                                            <Checkbox
                                              disabled={(record.sign_required === 4 || record.sign_required === 3 || record.sign_required === 2) ? false : true}
                                              defaultChecked={(record.sign_a === true) ? true : false}
                                              onChange={(e: any) => handleCheckboxChange_update(e, record?.action, tabList[idex], "sign_a", record)}
                                              id={`signA${indx}`}
                                            />
                                          </div>
                                        </h5>
                                        <h5 className='body' style={{ width: "20%", textAlign: "center" }}>
                                          <div>
                                            <Checkbox
                                              disabled={record.sign_required === 4 || record.sign_required === 3 ? false : true}
                                              defaultChecked={record.sign_b === true ? true : false}
                                              onChange={(e: any) => handleCheckboxChange_update(e, record.action, tabList[idex], "sign_b", record)}
                                              id={`signB${indx}`}
                                            />
                                          </div>
                                        </h5>
                                        <h5 className='body' style={{ width: "20%", textAlign: "center" }} >
                                          <div>
                                            <Checkbox
                                              disabled={record.sign_required === 4 ? false : true}
                                              defaultChecked={record.sign_c === true ? true : false}
                                              id={`signC${indx}`}
                                              onChange={(e: any) => handleCheckboxChange_update(e, record.action, tabList[idex], "sign_c", record)}
                                            />
                                          </div>

                                        </h5>
                                      </div>
                                    )
                                  })
                                  :
                                  tabList[idex].action && tabList[idex].action?.map((record: any, indx: number) => {
                                    return (
                                      <div
                                        key={record.id}
                                        className={
                                          'InnerDiv'}  >
                                        <h5 className='body' style={{ width: "20%", textAlign: "center" }}>
                                          {record?.type}
                                        </h5>
                                        <h5 className='body' key={record.id} style={{ width: "20%", textAlign: "center" }}>
                                          <Checkbox
                                            id={`dataentry${record.id}`}
                                            disabled={record.sign_required === 1 || record.sign_required === 2 || record.sign_required === 3 || record.sign_required === 4 ? false : true}
                                            defaultChecked={record.data_entry === true ? true : false}
                                            onChange={(e: any) => CheckboxChange(e, record?.type, tabList[idex], "data_entry")}
                                          /> </h5>
                                        <h5 className='body' style={{ width: "20%", textAlign: "center" }}>
                                          <div>
                                            <Checkbox
                                              disabled={(record.sign_required === 4 || record.sign_required === 3 || record.sign_required === 2) ? false : true}
                                              defaultChecked={(record.sign_a === true) ? true : false}
                                              onChange={(e: any) => CheckboxChange(e, record?.type, tabList[idex], "sign_a")}
                                              id={`signA${record.id}`}
                                            />
                                          </div>
                                        </h5>
                                        <h5 className='body' style={{ width: "20%", textAlign: "center" }}>
                                          <div>
                                            <Checkbox
                                              disabled={record.sign_required === 4 || record.sign_required === 3 ? false : true}
                                              defaultChecked={record.sign_b === true ? true : false}
                                              onChange={(e: any) => CheckboxChange(e, record.type, tabList[idex], "sign_b")}
                                              id={`signB${record.id}`}
                                            />
                                          </div>
                                        </h5>
                                        <h5 className='body' style={{ width: "20%", textAlign: "center" }}>
                                          <div>
                                            <Checkbox
                                              disabled={record.sign_required === 4 ? false : true}
                                              defaultChecked={record.sign_c === true ? true : false}
                                              id={`signC${record.id}`}
                                              onChange={(e: any) => CheckboxChange(e, record.type, tabList[idex], "sign_c")}
                                            />
                                          </div>

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
                </div>
              </Panel>
            )
          })}
        </Collapse>
        : "No Records Found"}

    </div>
  )
}
export default Users