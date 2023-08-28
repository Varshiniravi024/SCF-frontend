import { useState, useEffect } from "react";
import { Select, Spin, Input, DatePicker, Card } from "antd";
import httpClient from "../../utils/config/core/httpClient";
import baseurl from "../../utils/config/url/base";
import "./enquiry.scss";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import images from "../../assets/images";
import { InterimState, Type } from "../../utils/enum/choices";
import Heading from "../common/heading/heading";

const Enquiry = () => {
  const { Option } = Select;
  const { Search } = images
  const [currencyList, setCurrencyList] = useState([]);
  const Navigator = useNavigate();
  const counterPartyList = [] as any;
  const type = [] as any;
  const [counterpartyData, setCounterpartyDate] = useState([]);
  const [typeData, setTypeData] = useState([]);
  const [dataSource, setDataSource] = useState([
    {
      date: "05-04-2022",
      type: "Program",
      id: 100,
      program_Type: "APF",
      counterParty: "DELL",
      status: "Approved",
      amt_currency: "INR",
      amt: "20,000.00",
      dueDate: "05-06-2022",
    },
  ] as any);
  const [isLoading, setIsLoading] = useState(true);
  const [searchWord, setSearchWord] = useState<string>("");
  let filteredRepositories = [] as any

  useEffect(() => {
    httpClient
      .getInstance()
      .get(`${baseurl}api-auth/currency/`)
      .then((resp: any) => {
        setCurrencyList(resp.data.data);
      });

    getEnquiry()
  }, []);
  const enquiryDetail = (data: any) => {
    Navigator("/EnquiryDetail", { state: data });
  };
  const globalSearch = () => {
    filteredRepositories = dataSource.filter((value: any) => {
      return (
        value?.interim_state?.toLowerCase().includes(searchWord?.toLowerCase()) ||
        value?.type?.toLowerCase().includes(searchWord?.toLowerCase()) ||
        value?.id?.toString().includes(searchWord) ||
        value?.record_datas?.values?.[0]?.fields?.program_type?.toLowerCase().includes(searchWord?.toLowerCase()) ||
        value?.record_datas?.values?.[0]?.fields?.invoices?.[0]?.Duedate?.toString().includes(searchWord) ||
        value?.record_datas?.values?.[0]?.fields?.due_date?.toString().includes(searchWord) ||
        value?.record_datas?.values?.[0]?.fields?.expiry_date?.toString().includes(searchWord) ||
        value?.record_datas?.values?.[0]?.fields?.invoices?.[0]?.Invoiceamount?.toString().includes(searchWord) ||
        value?.record_datas?.values?.[0]?.fields?.invoices?.[0]?.max_invoice_amount?.toString().includes(searchWord) ||
        value?.record_datas?.values?.[0]?.fields?.amount?.toString().includes(searchWord) ||
        value?.record_datas?.values?.[0]?.fields?.invoices?.[0]?.InvoiceCurrency?.toLowerCase().includes(searchWord?.toLowerCase()) ||
        value?.record_datas?.values?.[0]?.fields?.invoice_currency?.toString().includes(searchWord) ||
        value?.record_datas?.values?.[0]?.fields?.max_invoice_currency?.toLowerCase().includes(searchWord?.toLowerCase()) ||
        value?.counterparty?.counterparty_name?.toLowerCase().includes(searchWord?.toLowerCase())
      );
    });
    return (
      setDataSource(filteredRepositories),
      setIsLoading(false)
    );
  };

  const getEnquiry = () => {
    setIsLoading(true)
    httpClient
      .getInstance()
      .get(`${baseurl}api/message/enquiry/`)
      .then((resp: any) => {
        setIsLoading(false);
        setDataSource(resp.data.data);
        setIsLoading(false);
        resp.data.data.map((item: any, index: any) => {
          if (item.counterparty !== null) {
            counterPartyList.push({ desc: item.counterparty });
          }
          if (item.type) {
            type.push({ desc: item.type });
          }
          setTimeout(() => {
            setCounterpartyDate(counterPartyList);
            setTypeData(type);
          }, 2000);
        });
      });
  }
  const options = {
    isCaseSensitive: false,
    includeScore: false,
    shouldSort: true,
    includeMatches: true,
    findAllMatches: true,
    minMatchCharLength: 1,
    location: 0,
    threshold: 0.6,
    distance: 100,
    useExtendedSearch: false,
    ignoreLocation: false,
    ignoreFieldNorm: false,
    fieldNormWeight: 2.0,
    keys: ['interim_state',
      'type',
      'record_datas.values.fields.program_type',
      'record_datas.values.fields.due_date',
      'record_datas.values.fields.invoices.Duedate',
      'record_datas.values.fields.due_date',
      'record_datas.values.fields.expiry_date',
      'counterparty.counterparty_name',
      'record_datas.values.fields.invoices.Invoiceamount',
      'record_datas.values.fields.invoices.max_invoice_amount',
      'record_datas.values.fields.amount',
      'record_datas.values.fields.invoices.InvoiceCurrency',
      'record_datas.values.fields.invoice_currency',
      'record_datas.values.fields.max_invoice_currency',
    ]
  }

  return (
    <div className="ProgramMainContainer">

      <div>
        <div className="fixedContainer">
          <Heading flag="Enquiry" text="Enquiry" subText="" />
        </div>
        {/* <h1 className="HeadingTxt">Enquiry</h1> */}
        <div style={{ display: "flex" }} className="mainContentContainer">
          <Select
            showSearch
            placeholder="Type"
            optionFilterProp="children"
            className="dropDownContainer"
          >
            <Option value={"Invoice"} id={"Invoice"}>
              Invoice
            </Option>
            <Option value={"Program"} id={"Program"}>
              Program
            </Option>
          </Select>
          <Select
            showSearch
            placeholder="Program"
            optionFilterProp="children"
            className="dropDownContainer"
          >
            <Option value={"APF"} id={"APF"}>
              APF
            </Option>
            <Option value={"RF"} id={"RF"}>
              RF
            </Option>
            <Option value={"DF"} id={"DF"}>
              DF
            </Option>
          </Select>
          <Select
            showSearch
            placeholder="Counterparty"
            optionFilterProp="children"
            className="dropDownContainer"
          >
            {counterpartyData &&
              counterpartyData.map((item: any, index: number) => {
                return (
                  <Option value={item.desc} id={item.desc} key={item.desc}>
                    {item.desc}
                  </Option>
                );
              })}

          </Select>

          <Select
            showSearch
            placeholder="Currency"
            optionFilterProp="children"
            className="dropDownContainer"
          >
            {currencyList &&
              currencyList.map((item: any, index: number) => {
                return (
                  <Option value={item.id} id={item.id} key={item.id}>
                    {item.description}
                  </Option>
                );
              })}
          </Select>
          <Input placeholder="Amount" className="inputContainer" />

          <DatePicker
            format={"DD/MM/YYYY"}
            className="datepickerContainer"
            placeholder="Transaction date"
          />
          <DatePicker
            format={"DD/MM/YYYY"}
            className="datepickerContainer"
            placeholder="Due/Expire date"
          />
        </div>
        <Input
          className="inputSearchField"
          placeholder="Search"
          suffix={<img src={Search} alt="search" onClick={globalSearch} style={{ cursor: "pointer" }} />}
          style={{ width: "35%", height: "45px", borderRadius: "5px" }}
          onChange={(event) => {
            if (event.target.value === "") {
              getEnquiry()
            }
            setSearchWord(event.target.value)
          }
          }
        />
        <div className="Card_Main_Container" style={{ paddingTop: "4vh" }}>
          <Card className="CardContainer">
            {
              isLoading ? (
                <Spin />
              ) :
                <>

                  <div className='containerTable'>
                    <div className="OuterDiv">

                      <div className='HeadInnerDiv'>
                        <h1 className='head'>Date</h1>
                        <h1 className='head'>Type</h1>
                        <h1 className='head'>Transation ID</h1>
                        <h1 className='head'>Program Name</h1>
                        <h1 className='head'>counterparty</h1>
                        <h1 className='head'>status</h1>
                        <h1 className='head' >Amount</h1>
                        <h1 className='head'>Duedate</h1>
                      </div>

                    </div>
                    <div className='OuterDiv'>
                      {dataSource && dataSource.map((record: any, index: number) => {
                        return (
                          <div key={index}
                            className={
                              'InnerDiv'} onClick={() => {
                                enquiryDetail(record);
                              }} id={`enquiry_table`}>
                            <h5 className='body' id={`enquiry_date`}>
                              <div>{moment(record?.record_datas?.values?.[0]?.fields?.created_date).format("DD-MM-YYYY")}</div>

                            </h5>
                            <h5 className='body' id={`enquiry_type`}>
                              <div>
                                {record.type === Type.INVOICE &&
                                  record.interim_state === InterimState.FINANCERQ
                                  ? "FINANCE REQUESTED"
                                  : record.type === Type.INVOICE && record.final_state === InterimState.FINANCED
                                    ? "FINANCE REQUESTED"
                                    : record.type === Type.UPLOAD
                                      ? "INVOICE"
                                      : record.type}
                              </div>
                              {/* <div>{moment(record?.pairings?.[0]?.created_date).format("DD-MM-YYYY")}</div> */}
                              {/* <div>{moment(record).format("DD/MM/YYYY")}</div> */}
                            </h5>
                            <h5 className='body' id={`enquiry_transactionId`}>
                              <div> {record ? record.id : ""}</div>
                            </h5>
                            <h5 className='body' id={`enquiry_programType`}>
                              <div>
                                {record ? (record?.record_datas?.values?.[0]?.fields?.program_type) : ""}</div>
                            </h5>
                            <h5 className='body' id={`enquiry_counterparty`}>
                              <div>{record ? record.counterparty?.counterparty_name : "-"}</div>

                            </h5>
                            <h5 className='body' id={`enquiry_status`}>
                              <div>
                                {record.interim_state}
                              </div>
                            </h5>
                            <h5 className='body' id={`enquiry_amount`}
                            >
                              <div>
                                {
                                  record ?
                                    record?.type === Type.INVOICEUPLOAD
                                      ? record?.record_datas?.values?.[0]?.fields?.invoices?.[0]?.InvoiceCurrency
                                      : record?.type === Type.INVOICE ?
                                        currencyList.map((item: any) => {
                                          let desc = ""
                                          if (item.id === record?.record_datas?.values?.[0]?.fields?.invoice_currency) {
                                            desc = item.description
                                          }
                                          return desc
                                        })

                                        : record?.type === Type.PROGRAM ?
                                          currencyList.map((item: any) => {
                                            let desc = ""
                                            if (item.id === record?.record_datas?.values?.[0]?.fields?.max_invoice_currency) {
                                              desc = item.description
                                            }
                                            return desc
                                          })
                                          : "-"
                                    : "-"
                                } {" "}
                                <span>

                                  {record
                                    ? record?.record_datas
                                      ? record?.type === Type.INVOICEUPLOAD
                                        ? record?.record_datas?.values?.[0]?.fields?.invoices
                                          ? record?.record_datas?.values?.[0]?.fields?.invoices?.[0]?.Invoiceamount
                                          : "-"
                                        : record.type === Type.PROGRAM
                                          ? record?.record_datas?.values?.[0]?.fields?.max_invoice_amount

                                          : record.type === Type.INVOICE
                                            ? record?.record_datas?.values?.[0]?.fields?.amount
                                            : "-"
                                      : "-"
                                    : "-"}

                                </span>
                                {/* {record
            ? record.record_datas
              ? record.type === "UPLOAD"
                ? record.model[0].invoices
                  ? record.model[0].invoices[0].InvoiceCurrency
                  : "-0"
                : record.type === "Program"
                ? record.pairings[0].limit_currency_id
                : "-"
              : record.type === "Invoice"
              ? record?.record_datas?.values?.[0]?.fields?.invoices?.[0]?.InvoiceCurrency
              : "-"
            : "-"} */}
                              </div>
                            </h5>
                            <h5 className='body' id={`enquiry_duedate`}>
                              <div>
                                <div>
                                  {record ? record.type === Type.INVOICE ? moment(record?.record_datas?.values?.[0]?.fields?.due_date).format("DD-MM-YYYY") : record.type === Type.INVOICEUPLOAD ? record?.record_datas?.values?.[0]?.fields?.invoices?.[0]?.Duedate : record.type === Type.PROGRAM ? moment(record?.record_datas?.values?.[0]?.fields?.expiry_date).format("DD-MM-YYYY") : "-" : "-"}

                                </div>
                              </div>
                            </h5>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </>
            }

          </Card>
        </div>
      </div>
    </div>
  );
};
export default Enquiry;
