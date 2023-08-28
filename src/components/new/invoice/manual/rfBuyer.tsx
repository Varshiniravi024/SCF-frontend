import { useState, useEffect } from "react";
import { Input, Select, DatePicker, Checkbox } from "antd";
import httpClient from "../../../../utils/config/core/httpClient";
import baseurl from "../../../../utils/config/url/base";
import moment from "moment";
import { UploadImage } from "../../../common/UploadImage/manualInvoiceUpload";
import images from "../../../../assets/images";
import { useNavigate } from "react-router";

const Header_RF_Seller = [{
  Name: "Buyer Name", InvNo: "Inv No", InvDate: "Inv Date", InvAmt: "Inv Amount", DueDate: "Due Date", FinanceAmount: "Finance Amount", RepaymentCurrency: "repaymentCurrency", RepaymentAccount: "repayment Account", AutoFinance: "Auto Finance",
  attached: "Attached"
}]
const RfBuyer = ({ invoice_detail, getRfBuyerdataSource, getrfBuyercounterPartyList }: any) => {
  const Navigate = useNavigate()

  const { TextArea } = Input;
  const { Option } = Select;
  const { DeleteIcon, DatePickerImg, DropdownIcon } = images
  const [buyerId, setBuyerId] = useState("");
  // const [programUser, setProgramUser] = useState([] as any);
  const [counterpartyId, setCounterpartyId] = useState([] as any);
  const [commentsValue, setCommentsvalue] = useState(null as any);
  console.log(commentsValue)
  const [MaxInvoicePercent, setMaxInvoicePercent] = useState("");
  const [counterPartyList, setCounterPartyList] = useState([] as any);
  // const [sellerName, setSellerName] = useState("");
  const [buyerName, setBuyerName] = useState([] as any);

  // const [sellerId, setSellerId] = useState([]);
  const [currencyList, SetCurrencyList] = useState([]);
  const [FinanceAmountvalue, setFinanceAmount] = useState(0);
  const [fileList, setFileList] = useState([] as any);
  const [PartyAccountDetails, setPartyAccountDetails] = useState([]);

  console.log(commentsValue,fileList)

  const [rfBuyerdataSource, setrfBuyerDataSource] = useState([
    {
      BuyerID: "" as any,
      BuyerName: buyerName as any,
      InvoiceNo: "" as any,
      InvoiceDate: "" as any,
      InvoiceCurrency: "" as any,
      InvoiceAmount: "" as any,
      DueDate: "" as any,
      FinanceAmount: 0 as any,
      FinancingCurrency: "" as any,
      RepaymentAccount: "" as any,
      RepaymentCurrency: 0 as any,
      counterparty_id: counterpartyId as any,
      RepaymentID: 0 as any,
      auto_finance: "" as any
    }])

  getRfBuyerdataSource(rfBuyerdataSource)
  getrfBuyercounterPartyList(counterPartyList)
  const selectedFiles = (value: any) => {
    setFileList(value)
  }
  const getPartyAccounts = () => {
    httpClient
      .getInstance()
      .get(`${baseurl}api-auth/party/party-accounts/`)
      .then((resp: any) => {
        setPartyAccountDetails(resp.data.data)
      })
      .catch(() => {
        Navigate("/Notfound")
      })
  }
  useEffect(() => {
    getPartyAccounts();

    httpClient
      .getInstance()
      .get(`${baseurl}api/pairing/?pg_id=${invoice_detail.id}`)
      .then((resp: any) => {
        if (invoice_detail.party_details?.RF_seller === true) {
          setCounterPartyList(resp.data.data);
          const partyName = [] as any;
          resp.data.data.map((items: any, index: number) => {
            return partyName.push(items.counter_party_name);
          });
          setBuyerName(partyName);

          setCounterPartyList(resp.data.data);
          const sellerIds = [] as any;
          resp.data.data.map((items: any, index: number) => {
            return sellerIds.push(items.counterparty_uid);
          });
          // setSellerId(sellerIds);

        } 
        // else {
        //   setCounterPartyList(resp.data.data);
        //   let partyName = [] as any;
        //   resp.data.data.map((items: any, index: number) => {
        //     return partyName.push(items.buyer_name);
        //   });
        //   setBuyerName(partyName);

        //   setCounterPartyList(resp.data.data);
        //   let sellerIds = [] as any;
        //   resp.data.data.map((items: any, index: number) => {
        //     return sellerIds.push(items.counterparty_uid);
        //   });
        //   setSellerId(sellerIds);
        // }
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
  const rfBuyerAppendData = () => {
    const newInput = {
      BuyerID: buyerId,
      BuyerName: "",
      InvoiceNo: "",
      InvoiceDate: "",
      InvoiceAmount: 0,
      InvoiceCurrency: "",
      DueDate: 0,
      FinancingCurrency: 0,
      RepaymentAccount: "" as any,
      RepaymentCurrency: "" as any,
      counterparty_id: counterpartyId,
      FinanceAmount: 0,
      RepaymentID: 0 as any,
    } as any;
    setrfBuyerDataSource([...rfBuyerdataSource, newInput]);

  }

  // const onRowDelete = (value: any) => {
  //   let apfbuyerlist = rfBuyerdataSource
  //   rfBuyerdataSource.map((data: any, index: any) => {

  //     if ((value.SellerID === data.SellerID) && (value.InvoiceNo === data.InvoiceNo)) {
  //       apfbuyerlist.splice(index, 1);
  //     }
  //     setrfBuyerDataSource(rfBuyerdataSource)

  //   })
  // }
  return (
    <div>
      <div className='containerTable'>
        <div className="OuterDiv">
          {
            Header_RF_Seller && Header_RF_Seller.map((item: any, index: any) => {
              return (
                <div key={index} className='HeadInnerDiv'>
                  <h1 className='head' style={{ width: "12%" }}>{item.Name}</h1>
                  <h1 className='head' style={{ width: "10%" }}>{item.InvNo}</h1>
                  <h1 className='head' style={{ width: "10%" }}>{item.InvDate}</h1>
                  <h1 className='head' style={{ width: "20%" }}>{item.InvAmt}</h1>
                  <h1 className='head' style={{ width: "10%" }}>{item.DueDate}</h1>
                  <h1 className='head' style={{ width: "20%" }}>{item.FinanceAmount}</h1>
                  <h1 className='head' style={{ width: "20%" }}>{item.RepaymentAccount}</h1>
                  <h1 className='head' style={{ width: "6%" }}>{item.AutoFinance}</h1>
                  <h1 className='head' style={{ width: "6%" }}>{item.attached}</h1>
                </div>
              )
            })

          }
        </div>
        <div className='OuterDiv'>

          {
            invoice_detail.party_details?.RF_seller === true ?
              rfBuyerdataSource && rfBuyerdataSource.map((record: any, index: number) => {
                return (
                  <div key={index} className='InnerDiv' >
                    <h5 className='body' style={{ width: "12%", fontSize: "10px" }}>
                      {buyerName.length !== 1 ?
                        <Select
                          optionFilterProp="children"
                          defaultValue=""
                          style={{
                            width: 100,
                          }}
                          suffixIcon={<img src={DropdownIcon} alt="DropdownIcon" />}

                          onSelect={(event: string) => {
                            const array = [...rfBuyerdataSource];
                            array[index].BuyerName = event;
                            setrfBuyerDataSource(array);
                            const names: any[] = [];
                            let values: any;
                            counterPartyList.map((data: any) => {
                              const array = rfBuyerdataSource;
                              if (event === data.counter_party_name) {
                                return (
                                  (values = {
                                    id: data.id,
                                    name: data.counter_party,
                                  }),
                                  names.push(values),
                                  setBuyerId(data.id),
                                  // setProgramUser(data.program_user),
                                  setCounterpartyId(data.counter_party),
                                  setMaxInvoicePercent(data.max_invoice_percent),
                                  (array[index].BuyerID = data.id),
                                  (array[index].counterparty_id = data.counter_party),
                                  setrfBuyerDataSource(array)
                                );
                              }
                              return true;
                            });
                          }}
                        >
                          {buyerName.map((partyList: any, index: any) => {
                            return (
                              <Option value={partyList} key={partyList} id={`invRfBuyer_partyName${index}`}>
                                {partyList}
                              </Option>
                            );
                          })}
                        </Select>
                        : <div  id={`invRfBuyer_partyName${index}`}>
                          {counterPartyList[0].buyer_name}</div>}
                    </h5>

                    <h5 className='body' style={{ width: "10%" }}>
                      <div >
                        <Input
                          className="InputContainer"
                          onChange={(event: any) => {
                            const array = rfBuyerdataSource;
                            array[index].InvoiceNo = event.target.value;
                            if (buyerName.length === 1) {
                              setBuyerId(counterPartyList?.[0]?.id)
                              // setProgramUser(counterPartyList?.[0]?.program_user)
                              setCounterpartyId(counterPartyList?.[0]?.counter_party)
                              setMaxInvoicePercent(counterPartyList?.[0]?.max_invoice_percent)
                              array[index].BuyerID = counterPartyList?.[0]?.id
                              array[index].counterparty_id = counterPartyList?.[0]?.counter_party
                            }
                            setrfBuyerDataSource(array);
                          }}
                          id={`invRfBuyer_InvoiceNumber${index}`}
                        />
                      </div>
                    </h5>
                    <h5 className='body' style={{ width: "10%" }}>

                      <DatePicker
                        format="DD-MM-YYYY"
                        suffixIcon={<img src={DatePickerImg} alt="pickericon" style={{ width: "17px", height: "17px" }} />}

                        onChange={(event: any) => {
                          const array = rfBuyerdataSource;
                          array[index].InvoiceDate = moment(event._d).format("DD-MM-YYYY");
                          setrfBuyerDataSource(array);
                        }}
                        style={{ width: 100 }}
                        className="InputContainer"
                        disabledDate={disabledInvoiceDate}
                        id={`invRfBuyer_InvoiceDate${index}`}
                      />

                    </h5>

                    <h5 className='body' style={{ width: "20%" }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span style={{ paddingRight: "10px" }}>
                          <Select
                            showSearch
                            style={{ width: 90 }}
                            onSelect={(event: string) => {
                              const array = [...rfBuyerdataSource];
                              array[index].InvoiceCurrency = event;
                              array[index].FinancingCurrency = event;
                              setrfBuyerDataSource(array);
                            }}
                            suffixIcon={<img src={DropdownIcon} alt="DropdownIcon" />}
                            id={`invRfBuyer_InvoiceCurrency${index}`}
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
                          onChange={(event: any) => {
                            const array = [...rfBuyerdataSource];
                            array[index].InvoiceAmount = parseInt(event.target.value);
                            array[index].FinanceAmount = (parseInt(event.target.value) * (parseInt(MaxInvoicePercent) / 100)).toFixed(2)
                            setFinanceAmount(parseInt(event.target.value) * (parseInt(MaxInvoicePercent) / 100))
                            setrfBuyerDataSource(array)
                          }}
                          id={`invRfBuyer_InvoiceAmount${index}`}
                        />
                      </div>
                    </h5>
                    <h5 className='body' style={{ width: "10%" }}>
                      <div>
                        <DatePicker
                          disabledDate={disabledDate}
                          format="DD-MM-YYYY"
                          suffixIcon={<img src={DatePickerImg} alt="pickericon" style={{ width: "17px", height: "17px" }} />}

                          onChange={(event: any) => {
                            const array = rfBuyerdataSource;
                            array[index].DueDate = moment(event._d).format("DD-MM-YYYY");
                            setrfBuyerDataSource(array);
                          }}
                          style={{ width: 100 }}
                          className="InputContainer"
                          id={`invRfBuyer_DueDate${index}`}
                        />
                      </div>
                    </h5>
                    <h5 className='body' style={{ width: "20%" }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span id={`invRfBuyer_FinanceCurrency${index}`} style={{ marginRight: "10px", border: "1px solid #d9d9d9", width: "50%", height: " 43px", borderRadius: "10px", padding: "6px", backgroundColor: "#FFFFFF" }}>
                          {record.InvoiceCurrency}

                        </span>
                        <div style={{ display: "block" }}>
                          <Input
                            className="InputContainer"
                            style={{ width: "80%" }}
                            id={`invRfBuyer_FinanceAmount${index}`}
                            defaultValue={record.FinanceAmount}
                            value={record.FinanceAmount}
                            onChange={(event: any) => {
                              const arr = [...rfBuyerdataSource];
                              arr[index].FinanceAmount = parseInt(event.target.value)
                              setrfBuyerDataSource(arr);

                              // if (FinanceAmountvalue < parseFloat(event.target.value)) {
                              // } else {

                              // }


                            }}
                          />
                        </div>
                      </div>
                    </h5>
                    <h5 className='body repaymentAccountContainer' style={{ width: "20%" }}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <span
                          style={{
                            width: 80, textAlign: "center",
                            height: "43px",
                            display: "grid",
                            borderRadius: "10px",
                            border: "1px solid #d9d9d9",
                            marginRight: "10px",
                            alignContent: "center"
                            , backgroundColor: "#FFFFFF"
                          }}
                          id={`invRfBuyer_RepaymentCurrency${index}`}
                        >
                          {PartyAccountDetails &&
                            PartyAccountDetails.map((item: any, index: any) => {
                              return record.RepaymentAccount === item.account_number ?
                                currencyList &&
                                currencyList.map((currency: any) => {
                                  return currency.id === item.currency ?
                                    currency.description : null
                                })
                                : null
                            })
                          }
                        </span>
                        <Select
                          showSearch
                          style={{ width: 100 }}
                          defaultValue={record.RepaymentAccount}
                          value={record.RepaymentAccount}
                          suffixIcon={<img src={DropdownIcon} alt="DropdownIcon" />}
                          id={`invRfBuyer_RepaymentAccount${index}`}
                          onSelect={(event: string) => {
                            const array = [...rfBuyerdataSource];
                            array[index].RepaymentAccount = event;

                            PartyAccountDetails &&
                              PartyAccountDetails.map((item: any) => {
                                return event === item.account_number ?
                                  currencyList &&
                                  currencyList.map((currency: any) => {
                                    return currency.id === item.currency ?
                                      (array[index].RepaymentCurrency = currency.description,
                                        array[index].RepaymentID = item.id) : null
                                  }) : null
                              })
                            setrfBuyerDataSource(array);
                          }}
                          
                        >
                          {PartyAccountDetails &&
                            PartyAccountDetails.map((item: any, index: any) => {
                              return (
                                <Option
                                  value={item.account_number}
                                  id={item.account_number}
                                  key={item.account_number}
                                >
                                  <div >
                                    <span>
                                      {currencyList &&
                                        currencyList.map((items: any, index: number) => {
                                          let repaymentcurr = '' as any
                                          if (item.currency === items.id) {
                                            repaymentcurr = items.description
                                          }
                                          return repaymentcurr
                                        })}</span>  {" "}
                                    {item.account_number}
                                  </div>
                                </Option>
                              );
                            })}
                        </Select>
                      </div>
                    </h5>
                    <h5 className='body' style={{ width: "6%" }}>
                      <div>
                        <Checkbox onChange={(event) => {
                          const array = rfBuyerdataSource;
                          array[index].auto_finance = event.target.checked;
                          setrfBuyerDataSource(array);
                        }
                        } id={`invRfBuyer_AutoFinance${index}`}
                          defaultChecked={localStorage.getItem("autofinance") === "true" ? true : false}
                        />
                      </div>
                    </h5>
                    <h5 className='body' style={{ width: "6%" }} id={`invRfBuyer_attachments${index}`}>
                      <UploadImage selectedFiles={selectedFiles} attachmentFiles={[]} />
                    </h5>
                    <h5 >
                      <img src={DeleteIcon} alt="deleteIcon"  id="invRfBuyer_delete"
                      />
                    </h5>
                  </div>
                )
              })
              : ""
          }
        </div>
      </div>
      <div
        onClick={rfBuyerAppendData}
        style={{
          position: "absolute",
          right: "5%",
          padding: "0px 8px",
          backgroundColor: "#FFB800",
          color: "#FFFFFF",
          marginTop: "10px"
        }} id="addInvoice"
      >
        +
      </div>
      <div className="SummaryContainer" style={{ marginTop: "5%" }}>
        <div className="SummaryLabel">Comments</div>
        <TextArea
          style={{ width: "50%", margin: "0px 10px" }}
          onChange={(e: any) => setCommentsvalue(e.target.value)} id="comments"
        />
      </div>

    </div>
  )
}
export default RfBuyer