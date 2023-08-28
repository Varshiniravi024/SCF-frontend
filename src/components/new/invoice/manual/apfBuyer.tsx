import { useState, useEffect } from "react";
import { Input, Select, DatePicker, Form } from "antd";
import httpClient from "../../../../utils/config/core/httpClient";
import baseurl from "../../../../utils/config/url/base";
import moment from "moment";
import { UploadImage } from "../../../common/UploadImage/manualInvoiceUpload";
import images from "../../../../assets/images";
import { useNavigate } from "react-router";

const Header_APF_Buyer = [{
  Id: "Seller Id", Name: "Seller Name", InvNo: "Inv No", InvDate: "Inv Date", InvAmt: "Inv Amount", DueDate: "Due Date", FinanceAmount: "Finance Amount", FinanceCurrency: "Financing Currency", SettlementCurrency: "Settlement Currency", autoFinance: "Auto Finance", attached: "Attached"
}]
const ApfSeller = ({ invoice_detail, getApfBuyerdataSource, getApfBuyercounterPartyList }: any) => {
  const { TextArea } = Input;
  const { Option } = Select;
  const Navigate = useNavigate()

  const { DeleteIcon, DatePickerImg, DropdownIcon } = images
  // const [buyerId, setBuyerId] = useState("");
  // const [programUser, setProgramUser] = useState([] as any);
  const [counterpartyId, setCounterpartyId] = useState([] as any);
  const [commentsValue, setCommentsvalue] = useState(null as any);
  const [MaxInvoicePercent, setMaxInvoicePercent] = useState("");
  const [counterPartyList, setCounterPartyList] = useState([] as any);
  const [sellerName, setSellerName] = useState("");
  const [buyerName, setBuyerName] = useState([] as any);

  const [sellerId, setSellerId] = useState([]);
  const [currencyList, SetCurrencyList] = useState([]);
  const [FinanceAmountvalue, setFinanceAmount] = useState(0);
  const [fileList, setFileList] = useState([] as any);
  const [loading, setLoading] = useState(false)

  const [apfBuyerdataSource, setApfBuyerDataSource] = useState([
    {
      SellerID: "" as any,
      SellerName: sellerName as any,
      InvoiceNo: "" as any,
      InvoiceDate: "" as any,
      InvoiceCurrency: "" as any,

      InvoiceAmount: 0 as any,
      DueDate: "" as any,
      FinancingCurrency: "" as any,
      SettlementCurrency: "" as any,
      counter_party: counterpartyId as any,
      FinanceAmount: 0 as any
    }])

  getApfBuyerdataSource(apfBuyerdataSource)
  getApfBuyercounterPartyList(counterPartyList)
  const apfBuyerAppendData = () => {
    const newInput = {
      SellerID: "",
      SellerName: "",
      InvoiceNo: "",
      InvoiceDate: "",
      InvoiceAmount: 0,
      InvoiceCurrency: "",
      DueDate: "",
      FinancingCurrency: 0,
      SettlementCurrency: 0,
      counterparty_id: counterpartyId,
      FinanceAmount: 0,
    } as any;
    setApfBuyerDataSource([...apfBuyerdataSource, newInput]);

  }
  const selectedFiles = (value: any) => {
    setFileList(value)
  }
  useEffect(() => {
    setLoading(true)
    httpClient
      .getInstance()
      .get(`${baseurl}api/pairing/?pg_id=${invoice_detail.id}`)
      .then((resp: any) => {
        setLoading(false)
        setCounterPartyList(resp.data.data);
        const partyName = [] as any;
        resp.data.data.map((items: any, index: number) => {
          return partyName.push(items.buyer_name);
        });
        setBuyerName(partyName);

        const sellerIds = [] as any;
        resp.data.data.map((items: any, index: number) => {
          return sellerIds.push(items.counterparty_uid);
        });
        setSellerId(sellerIds);

        setLoading(true)
      })
      .catch(() => {
        Navigate("/Notfound")
      })




    httpClient
      .getInstance()
      .get(`${baseurl}api-auth/currency/`)
      .then((resp: any) => {
        SetCurrencyList(resp.data.data);
      })
      .catch(() => {
        Navigate("/Notfound")
      })

  }, [])
  const disabledDate = (current: any) => {
    return current && current < moment().startOf("day");
  };
  const disabledInvoiceDate = (current: any) => {
    return current && current > moment().endOf("day");
  }
  const onRowDelete = (value: any) => {
    const apfbuyerlist = apfBuyerdataSource
    apfBuyerdataSource.map((data: any, index: any) => {

      if ((value.SellerID === data.SellerID) && (value.InvoiceNo === data.InvoiceNo)) {
        apfbuyerlist.splice(index, 1);
      }
      setApfBuyerDataSource(apfBuyerdataSource)
    })
  }
  const onFinish = (values: any) => {
    console.log("values apf buyer login", values)
  }

  const onFinishFailed = (values: any) => {
    console.log("values apf buyer login failed error message", values)
  }

  return (
    <div>
      <Form
        name="basic"
        initialValues={{ remember: true }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        validateTrigger="onBlur"
      >
        {/* <button>saving</button> */}
        <div className='containerTable'>
          <div className="OuterDiv">
            {
              Header_APF_Buyer && Header_APF_Buyer.map((item: any, index: any) => {
                return (
                  <div key={index} className='HeadInnerDiv'>
                    <h1 className='head' style={{ width: "11%" }}>{item.Id}</h1>
                    <h1 className='head' style={{ width: "10%" }}>{item.Name}</h1>
                    <h1 className='head' style={{ width: "10%" }}>{item.InvNo}</h1>
                    <h1 className='head' style={{ width: "12%" }}>{item.InvDate}</h1>
                    <h1 className='head' style={{ width: "20%" }}>{item.InvAmt}</h1>
                    <h1 className='head' style={{ width: "10%" }}>{item.DueDate}</h1>
                    <h1 className='head' style={{ width: "19%" }}>{item.FinanceAmount}</h1>
                    <h1 className='head' style={{ width: "6%" }}>{item.attached}</h1>
                  </div>
                )
              })

            }
          </div>
          <div className='OuterDiv'>

            {

              apfBuyerdataSource && apfBuyerdataSource.map((record: any, index: number) => {
                return (

                  <div key={index} className='InnerDiv' >
                    {/* <Form.Item
                      label=""
                      name="sellerId"
                      key="sellerId"
                      rules={
                        [
                          {
                            required: true,
                            message: "seller id"
                          }
                        ]
                      }
                      initialValue={record.SellerID}
                    > */}
                    <h5 className='body' style={{ width: "12%", fontSize: "10px" }} id={`invApfBuyer_sellerId${index}`}>
                      {
                        sellerId.length > 1 ?
                          <Select
                            showSearch
                            optionFilterProp="children"
                            defaultValue=""
                            style={{
                              width: 115,
                              color: "#000000",
                              fontSize: "14px"
                            }}
                            suffixIcon={<img src={DropdownIcon} alt="DropdownIcon" />}

                            onSelect={(event: string) => {
                              const arr = [...apfBuyerdataSource];
                              arr[index].SellerID = event;
                              setApfBuyerDataSource(arr);
                              const names: any[] = [];
                              let values: any;
                              counterPartyList.map((data: any) => {
                                if (event === data.counterparty_uid) {

                                  return (
                                    (values = {
                                      id: data.counterparty_uid,
                                      name: data.counterparty_id,
                                    }),
                                    names.push(values),
                                    setSellerName(data.counterparty_id),
                                    // setProgramUser(data.program_user),
                                    setCounterpartyId(data.counterparty_id),
                                    setMaxInvoicePercent(data.max_invoice_percent),
                                    (arr[index].SellerName = data.counter_party_name),
                                    (arr[index].counter_party = data.counter_party),
                                    setApfBuyerDataSource(arr)
                                  );
                                }
                                return true;
                              });
                            }}
                          >

                            {sellerId.map((partyList: any, index: any) => {
                              return (
                                <Option value={partyList} key={partyList} id={`invApfBuyer_${partyList}`}>
                                  {partyList}
                                </Option>
                              );
                            })}
                          </Select>
                          : <div style={{ fontSize: "14px" }}>{sellerId[0]}</div>
                      }
                    </h5>
                    {/* </Form.Item> */}

                    <h5 className='body' style={{ width: "10%" }} id={`invApfBuyer_sellerName${index}`}>
                      <div>{sellerId.length === 1 ? counterPartyList[0]?.counter_party_name : record.SellerName}</div>
                    </h5>
                    <h5 className='body' style={{ width: "10%" }} id="invApfBuyer_InvoiceNumber">
                      <div >
                        <Input
                          id={`invApfBuyer_InvoiceNumber${index}`}
                          className="InputContainer"
                          onChange={(event: any) => {
                            const arr = apfBuyerdataSource;
                            arr[index].InvoiceNo = event.target.value;
                            if (sellerId.length === 1) {
                              arr[index].SellerID = sellerId[0];
                              arr[index].SellerName = counterPartyList[0]?.counter_party_name;
                              arr[index].counter_party = counterPartyList[0]?.counter_party;
                              setMaxInvoicePercent(counterPartyList?.[0]?.max_invoice_percent)

                            }
                            setApfBuyerDataSource(arr);
                          }}
                        />
                      </div>
                    </h5>
                    <h5 className='body' style={{ width: "12%" }} id="invApfBuyer_InvoiceDate">

                      <DatePicker
                        id={`invApfBuyer_InvoiceDate${index}`}
                        suffixIcon={<img src={DatePickerImg} alt="pickericon" style={{ width: "17px", height: "17px" }} />}

                        format="DD-MM-YYYY"
                        onChange={(event: any) => {
                          const arr = apfBuyerdataSource;
                          arr[index].InvoiceDate = moment(event._d).format("DD-MM-YYYY");
                          setApfBuyerDataSource(arr);
                        }}
                        style={{ width: 100 }}
                        className="InputContainer"
                        disabledDate={disabledInvoiceDate}
                      />

                    </h5>

                    <h5 className='body' style={{ width: "20%" }} id={`invApfBuyer_Invoice${index}`}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span style={{ paddingRight: "10px" }} id={`invApfBuyer_InvoiceCurrency${index}`}>
                          <Select
                            showSearch
                            style={{ width: 100 }}
                            onSelect={(event: string) => {
                              const arr = [...apfBuyerdataSource];
                              arr[index].InvoiceCurrency = event;
                              arr[index].FinancingCurrency = event;
                              setApfBuyerDataSource(arr);

                            }}
                            suffixIcon={<img src={DropdownIcon} alt="DropdownIcon" />}

                          >
                            {currencyList &&
                              currencyList.map((item: any, index: any) => {
                                return (
                                  <Option
                                    value={item.description}
                                    id={item.description}
                                    key={item.description}
                                  >
                                    {item.description}
                                  </Option>
                                );
                              })}
                          </Select>
                        </span>
                        <Input
                          className="InputContainer"
                          id={`invApfBuyer_InvoiceAmount${index}`}
                          onChange={(event: any) => {
                            const arr = [...apfBuyerdataSource];
                            arr[index].InvoiceAmount = parseInt(event.target.value);
                            setApfBuyerDataSource(arr);
                            arr[index].FinanceAmount = parseInt(event.target.value) * (parseInt(MaxInvoicePercent) / 100)
                            setFinanceAmount(parseInt(event.target.value) * (parseInt(MaxInvoicePercent) / 100))
                          }}
                        />
                      </div>
                    </h5>
                    <h5 className='body' style={{ width: "10%" }}>
                      <div>
                        <DatePicker
                          id={`invApfBuyer_DueDate${index}`}
                          disabledDate={disabledDate}
                          suffixIcon={<img src={DatePickerImg} alt="pickericon" style={{ width: "17px", height: "17px" }} />}

                          format="DD-MM-YYYY"
                          onChange={(event: any) => {
                            const arr = apfBuyerdataSource;
                            arr[index].DueDate = moment(event._d).format("DD-MM-YYYY");
                            setApfBuyerDataSource(arr);
                          }}
                          style={{ width: 100 }}
                          className="InputContainer"
                        />
                      </div>
                    </h5>
                    <h5 className='body' style={{ width: "20%" }} id={`invApfBuyer_Finance${index}`}>
                      <div style={{ display: "flex" }}>
                        <span id={`invApfBuyer_FinanceCurrency${index}`} style={{ marginRight: "10px", border: "1px solid #d9d9d9", width: "50%", height: " 43px", borderRadius: "10px", padding: "6px", backgroundColor: "#FFFFFF" }}>
                          {record.InvoiceCurrency}
                        </span>

                        <div style={{ display: "block" }}>
                          <Input
                            className="InputContainer"
                            style={{ width: "80%" }}
                            id={`invApfBuyer_FinanceAmount${index}`}
                            defaultValue={record.FinanceAmount}
                            value={(record.FinanceAmount).toFixed(2)}
                            onChange={(event: any) => {
                              const arr = [...apfBuyerdataSource];
                              arr[index].FinanceAmount = parseInt(event.target.value)
                              setApfBuyerDataSource(arr);

                              // if (FinanceAmountvalue < parseFloat(event.target.value)) {

                              // } else {

                              // }

                            }}
                          />

                        </div>




                      </div>
                    </h5>

                    <h5 className='body' style={{ width: "6%" }} id={`invApfBuyer_attachments${index}`}>
                      <UploadImage selectedFiles={selectedFiles} attachmentFiles={[]} />
                    </h5>
                    <h5 id={`invApfBuyer_delete${index}`}>
                      <img src={DeleteIcon} alt="deleteIcon"
                        onClick={() => onRowDelete(record)}
                      />
                    </h5>
                  </div>

                )
              })

            }
          </div>


        </div>
        <div
          onClick={apfBuyerAppendData}
          style={{
            position: "absolute",
            right: "5%",
            padding: "0px 8px",
            backgroundColor: "#FFB800",
            color: "#FFFFFF",
            marginTop: "10px"
          }}
          id="addInvoice"
        >
          +
        </div>
        <div className="SummaryContainer" style={{ marginTop: "5%" }}>
          <div className="SummaryLabel">Comments</div>
          <TextArea
            style={{ width: "50%", margin: "0px 10px" }}
            onChange={(e: any) => setCommentsvalue(e.target.value)}
            id={`inv_comments`}
          />
        </div>
      </Form>
    </div>
  )
}
export default ApfSeller