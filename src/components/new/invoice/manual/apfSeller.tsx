import { useState, useEffect } from "react";
import { Input, Select, DatePicker, Checkbox } from "antd";
import httpClient from "../../../../utils/config/core/httpClient";
import baseurl from "../../../../utils/config/url/base";
import moment from "moment";
import { UploadImage } from "../../../common/UploadImage/manualInvoiceUpload";
import images from "../../../../assets/images";
import { useNavigate } from "react-router";

const Header_APF_Seller = [{
  Name: "Buyer Name", InvNo: "Inv No", InvDate: "Inv Date", InvAmt: "Inv Amount", DueDate: "Due Date", FinanceAmount: "Finance Amount", FinanceCurrency: "Financing Currency", SettlementCurrency: "Settlement Currency", autoFinance: "Auto Finance", attached: "Attached"
}]
const ApfSeller = ({ invoice_detail, getApfSellerdataSource, getApfSellercounterPartyList }: any) => {
  const { TextArea } = Input;
  const Navigate = useNavigate()

  const { Option } = Select;
  const { DeleteIcon, DatePickerImg, DropdownIcon } = images
  const [buyerId, setBuyerId] = useState("");
  const [programUser, setProgramUser] = useState([] as any);
  const [counterpartyId, setCounterpartyId] = useState([] as any);
  const [commentsValue, setCommentsvalue] = useState(null as any);
  const [MaxInvoicePercent, setMaxInvoicePercent] = useState("");
  const [counterPartyList, setCounterPartyList] = useState([] as any);
  const [buyerName, setBuyerName] = useState([] as any);
  const [sellerId, setSellerId] = useState([]);
  const [currencyList, SetCurrencyList] = useState([]);
  const [FinanceAmountvalue, setFinanceAmount] = useState(0);
  const [fileList, setFileList] = useState([] as any);


  const [apfSellerdataSource, setApfSellerDataSource] = useState([
    {
      BuyerID: buyerId,
      BuyerName: "" as any,
      InvoiceNo: "" as any,
      InvoiceDate: "" as any,
      InvoiceCurrency: "" as any,
      InvoiceAmount: "" as any,
      DueDate: "" as any,
      FinancingCurrency: "" as any,
      SettlementCurrency: "" as any,
      program_user: programUser as any,
      counterparty_id: counterpartyId as any,
      auto_finance: localStorage.getItem("autofinance") === "true" ? true : false as any,
      FinanceAmount: 0 as any
    },
  ]);
  getApfSellerdataSource(apfSellerdataSource)
  getApfSellercounterPartyList(counterPartyList)

  const apfSellerAppendData = () => {
    const newInput = {
      BuyerID: buyerId,
      BuyerName: "",
      InvoiceNo: "",
      InvoiceDate: "",
      InvoiceAmount: 0,
      InvoiceCurrency: "",
      DueDate: 0,
      FinancingCurrency: 0,
      SettlementCurrency: 0,
      program_user: programUser,
      counterparty_id: counterpartyId,
      auto_finance: localStorage.getItem("autofinance") === "true" ? true : false as any,
      FinanceAmount: 0,
    } as any;
    setApfSellerDataSource([...apfSellerdataSource, newInput]);

  }
  const selectedFiles = (value: any) => {
    setFileList(value)
  }
  useEffect(() => {
    httpClient
      .getInstance()
      .get(`${baseurl}api/pairing/?pg_id=${invoice_detail.program_id}`)
      .then((resp: any) => {
        setCounterPartyList(resp.data.data);
        const partyName = [] as any;
        resp.data.data.map((items: any, index: number) => {
          return partyName.push(items.buyer_name);
        });
        setBuyerName(partyName);

        setCounterPartyList(resp.data.data);
        const sellerIds = [] as any;
        resp.data.data.map((items: any, index: number) => {
          return sellerIds.push(items.counterparty_uid);
        });
        setSellerId(sellerIds);
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

  return (
    <div>


      <div className='containerTable'>
        <div className="OuterDiv">
          {

            Header_APF_Seller && Header_APF_Seller.map((item: any, index: any) => {
              return (
                <div key={index} className='HeadInnerDiv'>
                  <h1 className='head' style={{ width: "10%" }}>{item.Name}</h1>
                  <h1 className='head' style={{ width: "10%" }}>{item.InvNo}</h1>
                  <h1 className='head' style={{ width: "10%" }}>{item.InvDate}</h1>
                  <h1 className='head' style={{ width: "20%" }}>{item.InvAmt}</h1>
                  <h1 className='head' style={{ width: "10%" }}>{item.DueDate}</h1>
                  <h1 className='head' style={{ width: "20%" }}>{item.FinanceAmount}</h1>
                  <h1 className='head' style={{ width: "10%" }}>{item.autoFinance}</h1>
                  <h1 className='head' style={{ width: "6%" }}>{item.attached}</h1>
                </div>
              )
            })

          }
        </div>
        <div className='OuterDiv'>

          {

            apfSellerdataSource && apfSellerdataSource.map((record: any, index: number) => {
              return (
                <div key={index} className='InnerDiv' >
                  <h5 className='body' style={{ width: "10%" }} id={`invApfSeller_buyerId${index}`}>
                    {buyerName.length !== 1 ?
                      <Select
                        showSearch
                        optionFilterProp="children"
                        defaultValue=""
                        style={{
                          width: 100,
                        }}
                        suffixIcon={<img src={DropdownIcon} alt="DropdownIcon" />}

                        onSelect={(event: string) => {
                          const array = [...apfSellerdataSource];
                          array[index].BuyerName = event;
                          setApfSellerDataSource(array);
                          const names: any[] = [];
                          let values: any;
                          counterPartyList.map((data: any) => {
                            const array = apfSellerdataSource;
                            if (event === data.buyer_name) {
                              return (
                                (values = {
                                  id: data.id,
                                  name: data.buyer_name,
                                }),
                                names.push(values),
                                setBuyerId(data.id),
                                setProgramUser(data.program_user),
                                setCounterpartyId(data.counterparty_id),
                                setMaxInvoicePercent(data.max_invoice_percent),
                                (array[index].BuyerID = data.id),
                                (array[index].BuyerName = data.buyer_name),
                                (array[index].program_user = data.program_user),
                                (array[index].counterparty_id = data.counterparty_id),
                                setApfSellerDataSource(array)
                              );
                            }
                            return true;
                          });
                        }}
                      >
                        {buyerName.map((partyList: any, index: any) => {
                          return (
                            <Option value={partyList} key={partyList} id={`invApfSeller_${partyList}${index}`}>
                              {partyList}
                            </Option>
                          );
                        })}
                      </Select>
                      : <div id={`invApfSeller_${counterPartyList?.[0]?.buyer_name}${index}`}>
                        {counterPartyList[0].buyer_name}</div>}
                  </h5>
                  <h5 className='body' style={{ width: "10%" }}>
                    <div >
                      <Input
                        id={`invApfSeller_InvoiceNumber${index}`}
                        className="InputContainer"
                        onChange={(event: any) => {
                          const array = apfSellerdataSource;
                          array[index].InvoiceNo = event.target.value;
                          if (buyerName.length === 1) {
                            array[index].BuyerID = counterPartyList?.[0]?.id;
                            array[index].BuyerName = counterPartyList?.[0]?.buyer_name;
                            array[index].program_user = counterPartyList?.[0]?.program_user;
                            array[index].counterparty_id = counterPartyList?.[0]?.counterparty_id;
                            setMaxInvoicePercent(counterPartyList?.[0]?.max_invoice_percent)

                          }
                          setApfSellerDataSource(array);
                        }}
                      />
                    </div>
                  </h5>
                  <h5 className='body' style={{ width: "10%" }}>

                    <DatePicker
                      id={`invApfSeller_InvoiceDate${index}`}
                      format="DD-MM-YYYY"
                      suffixIcon={<img src={DatePickerImg} alt="pickericon" style={{ width: "17px", height: "17px" }} />}

                      onChange={(event: any) => {
                        const array = apfSellerdataSource;
                        array[index].InvoiceDate = moment(event._d).format("DD-MM-YYYY");
                        setApfSellerDataSource(array);
                      }}
                      style={{ width: 100 }}
                      className="InputContainer"
                      disabledDate={disabledInvoiceDate}
                    />

                  </h5>

                  <h5 className='body' style={{ width: "20%" }} id={`invApfSeller_Invoice${index}`}>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <span style={{ paddingRight: "10px" }}>
                        <Select
                          showSearch
                          style={{ width: 100 }}
                          onSelect={(event: string) => {
                            const array = [...apfSellerdataSource];
                            array[index].InvoiceCurrency = event;
                            array[index].FinancingCurrency = event;
                            setApfSellerDataSource(array);
                          }}
                          suffixIcon={<img src={DropdownIcon} alt="DropdownIcon" />}

                          id={`invApfSeller_InvoiceCurrency${index}`}
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
                        id={`invApfSeller_InvoiceAmount${index}`}
                        onChange={(event: any) => {
                          const array = [...apfSellerdataSource];
                          array[index].InvoiceAmount = parseInt(event.target.value);
                          setApfSellerDataSource(array);
                          array[index].FinanceAmount = parseInt(event.target.value) * (parseInt(MaxInvoicePercent) / 100)
                          setFinanceAmount(parseInt(event.target.value) * (parseInt(MaxInvoicePercent) / 100))

                        }}
                      />
                    </div>
                  </h5>
                  <h5 className='body' style={{ width: "10%" }}>
                    <div>
                      <DatePicker
                        disabledDate={disabledDate}
                        format="DD-MM-YYYY"
                        suffixIcon={<img src={DatePickerImg} alt="pickericon" style={{ width: "17px", height: "17px" }} />}
                        id={`invApfSeller_DueDate${index}`}
                        onChange={(event: any) => {
                          const array = apfSellerdataSource;
                          array[index].DueDate = moment(event._d).format("DD-MM-YYYY");
                          setApfSellerDataSource(array);
                        }}
                        style={{ width: 100 }}
                        className="InputContainer"
                      />
                    </div>
                  </h5>
                  <h5 className='body' style={{ width: "20%" }} id={`invApfSeller_Finance${index}`}>
                    <div style={{ display: "flex" }}>
                      <span id={`invApfSeller_FinanceCurrency${index}`} style={{ marginRight: "10px", border: "1px solid #d9d9d9", width: "50%", height: " 43px", borderRadius: "10px", padding: "6px", backgroundColor: "#FFFFFF" }}>
                        {record.InvoiceCurrency}
                      </span>
                      <div style={{ display: "block" }}>
                        <Input
                          className="InputContainer"
                          style={{ width: "80%" }}
                          id={`invApfSeller_FinanceAmount${index}`}
                          defaultValue={record.FinanceAmount}
                          value={(record.FinanceAmount).toFixed(2)}
                          onChange={(event: any) => {
                            const arr = [...apfSellerdataSource];
                            arr[index].FinanceAmount = parseInt(event.target.value)
                            setApfSellerDataSource(arr);

                            // if (FinanceAmountvalue < parseFloat(event.target.value)) {

                            // } else {

                            // }

                          }}
                        />
                        {/* for now this error msg is commented */}
                        {/* {FinanceAmountError === true ? <div className="errorMessage">Error </div> : ""} */}
                      </div>
                    </div>
                  </h5>

                  <h5 className='body' style={{ width: "10%" }}>
                    <div>
                      <Checkbox id={`invApfSeller_AutoFinance${index}`} onChange={(event) => {
                        const array = apfSellerdataSource;
                        array[index].auto_finance = event.target.checked;
                        setApfSellerDataSource(array);
                      }
                      }
                        defaultChecked={localStorage.getItem("autofinance") === "true" ? true : false}
                      />
                    </div>
                  </h5>
                  <h5 className='body' style={{ width: "6%" }} id={`invApfSeller_attachments${index}`}>
                    <UploadImage selectedFiles={selectedFiles} attachmentFiles={[]} />
                  </h5>
                  <h5 >
                    <img src={DeleteIcon} alt="deleteIcon" id={`invApfSeller_delete${index}`}
                    />
                  </h5>
                </div>
              )
            })


          }
        </div>

      </div>
      <div
        onClick={apfSellerAppendData}
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

    </div>
  )
}
export default ApfSeller