import { useState, useEffect } from "react";
import { RadioChangeEvent } from 'antd';
import {
  Spin,
  Row,
  Col,
  Radio,
  Checkbox
} from "antd";
import "../manageScf/manageScf.scss";
import httpClient from "../../utils/config/core/httpClient";
import baseurl from "../../utils/config/url/base";
import { Currency } from "../api/base";
import { allCountry } from "../../redux/action"
import { Country } from "../api/base";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router";


const CounterPartyOnboarding = ({ existingParty, partyData, getPartyData, ExistingCustomerData }: any) => {
  const [counterpartyNameDataSource, setCounterpartyNameDataSource] = useState([] as any)
  const [isLoading, setIsLoading] = useState(true);
  const [existingCustomerValue, setExistingCustomerValue] = useState(partyData ? partyData.existing_customer : "");
  const [CountryList, SetCountryList] = useState([])
  const [currencyData, setCurrencyData] = useState([]);
  let InterestTypeValue = [] as any
  let InterestRateTypeValue = [] as any
  const dispatch = useDispatch();
  const Navigate = useNavigate()

  const onChange = (e: RadioChangeEvent) => {
    const loginlocalItems = localStorage.getItem("login_detail") as any;
    setExistingCustomerValue(e.target.value);
    existingParty(e.target.value)
    const body = {
      existing_customer: e.target.value,
    }
    httpClient
      .getInstance()
      .put(`${baseurl}api-auth/party/${JSON.parse(loginlocalItems).party_id}/`, body)
      .then((response: any) => {
        getPartyData(response.data.data)
      })
      .catch(() => {
        Navigate("/Notfound")
      })
  };
  const onChangeCheckBox = (e: RadioChangeEvent) => {
    const body = {
      program_id: counterpartyNameDataSource.pairing_details.pairing[0].program_id_id,
      auto_finance: e.target.checked
    }
    httpClient
      .getInstance()
      .put(`${baseurl}api/pairing/${counterpartyNameDataSource.pairing_details.pairing[0].id}/`, body)
      // .then((response: any) => {
      // })
      .catch(() => {
        Navigate("/Notfound")
      })
  }
  const getCurrency = async () => {
    const data = await Currency()
    setCurrencyData(data)
  }
  const getInterestType = async () => {

    const { data } = await httpClient.getInstance().get(`${baseurl}api/resource/choices/?type=IC`);
    InterestTypeValue = data
  }

  const getInterestRateType = async () => {

    const { data } = await httpClient.getInstance().get(`${baseurl}api/resource/choices/`);
    InterestRateTypeValue = data
  }
  const getCountry = async () => {
    const data = await Country()
    dispatch(
      allCountry(data)
    );
  }
  useEffect(() => {

    getInterestType();
    getInterestRateType();
    getCurrency();
    getCountry();
    httpClient
      .getInstance()
      .get(`${baseurl}api-auth/country/`)
      .then((resp: any) => {
        SetCountryList(resp.data.data);
      })
      .catch(() => {
        Navigate("/Notfound")
      })

    httpClient
      .getInstance()
      .get(`${baseurl}api/counterparty/onboarding/`)
      .then((resp: any) => {
        setTimeout(() => {
          setCounterpartyNameDataSource(resp.data.data[0])
        }, 2000);

      })
      .catch(() => {
        Navigate("/Notfound")
      })
    const loginlocalItems = localStorage.getItem("login_detail") as any;

    httpClient
      .getInstance()
      .get(`${baseurl}api-auth/party/${JSON.parse(loginlocalItems).party_id}/`)
      .then((resp: any) => {
        httpClient
          .getInstance()
          .get(`${baseurl}api-auth/onboarding/kyc-info/`)
          .then((response: any) => {
            setTimeout(() => {
              setIsLoading(false)
              existingParty(resp.data.data.existing_customer)
              setExistingCustomerValue(resp.data.data.existing_customer)
            }, 2000);
          })
          .catch(() => {
            Navigate("/Notfound")
          })
      })
      .catch(() => {
        Navigate("/Notfound")
      })
  }, [])

  const CounterpartyData = [
    {
      label1: "Name",
      value1: counterpartyNameDataSource?.name,
      label2: "Mobile",
      value2: counterpartyNameDataSource?.user_details?.[0].phone
    },
    {
      label1: "Email",
      value1: counterpartyNameDataSource?.user_details?.[0].email,
      label2: "Address",
      value2: counterpartyNameDataSource?.address_line
    },
    {
      label1: "City",
      value1: counterpartyNameDataSource?.city,
      label2: "Country",
      value2: CountryList.map((countrys: any) => {
        if (countrys.id === counterpartyNameDataSource?.country_code) {
          return countrys.country
        } else if (countrys.country === counterpartyNameDataSource?.country_code) {
          return countrys.country
        }
        return null;
      })
    }
  ]
  const LimitData = [
    {
      label1: "Limit",
      value1: currencyData.map((item: any) => {
        if (item.id === counterpartyNameDataSource?.pairing_details?.pairing?.[0]?.limit_currency_id) {
          return `${item.description} ${new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(counterpartyNameDataSource?.pairing_details?.pairing?.[0]?.max_limit_amount)}`
        }
        return null;
      }),
      label2: "Expiry Date",
      value2: counterpartyNameDataSource?.pairing_details?.pairing?.[0]?.expiry_date
    },
    {
      label1: "Max Invoice Amount",
      value1: currencyData.map((item: any) => {
        if (item.id === counterpartyNameDataSource?.pairing_details?.pairing?.[0]?.max_invoice_currency_id) {
          return `${item.description} ${new Intl.NumberFormat('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(counterpartyNameDataSource?.pairing_details?.pairing?.[0]?.max_invoice_amount)}`
        }
        return null;
      }),
      label2: "Max Invoice PCT",
      value2: counterpartyNameDataSource?.pairing_details?.pairing?.[0]?.max_invoice_percent
    },
    {
      label1: "Max Tenor",
      value1: counterpartyNameDataSource?.pairing_details?.pairing?.[0]?.max_tenor,
      label2: "Grace Period",
      value2: counterpartyNameDataSource?.pairing_details?.pairing?.[0]?.grace_period
    },
    {
      label1: "Interest Type",
      value1: InterestTypeValue.map((item: any) => {
        if (item.id === counterpartyNameDataSource?.pairing_details?.pairing?.[0]?.interest_type_id) {
          return item.description
        }
        return null;
      }),
      label2: "Interest Rate Type",
      value2: InterestRateTypeValue.map((item: any) => {
        if (counterpartyNameDataSource?.pairing_details?.pairing?.[0]?.interest_type_id === 1) {
          return "-"
        } else if (item.id === counterpartyNameDataSource?.pairing_details?.pairing?.[0]?.interest_rate_type_id) {
          return item.description
        }
        return null;
      })
    },
    {
      label1: "Fixed Rate/ Margin",
      value1: counterpartyNameDataSource?.pairing_details?.pairing?.[0]?.margin,
      label2: "Comments",
      value2: counterpartyNameDataSource?.pairing_details?.pairing?.[0]?.comments
    }
  ]

  return isLoading ? <Spin /> : (

    <div className="approvedPayableFinacing">
      <>
        <Row gutter={24}>
          <Col span={5} style={{ color: "#4E6ACB", fontSize: "14px", fontFamily: "Poppins" }}>
            <p>Program Type</p>
          </Col>
          <Col span={7}>
            APF
          </Col>
        </Row>
        <h4>Buyer Details</h4>
        {counterpartyNameDataSource?.buyer_details?.map((value: any, index: number) => {
          return <Row gutter={24} key={index}>
            <Col span={5} style={{ color: "#4E6ACB", fontSize: "14px", fontFamily: "Poppins" }}>
              <p>Name</p>
            </Col>
            <Col span={7}>
              <p> {value?.name}</p>
            </Col>
            <Col span={5} style={{ color: "#4E6ACB", fontSize: "14px", fontFamily: "Poppins" }}>
              <p>Address</p>
            </Col>
            <Col span={7}>
              <p>{value?.city}</p>
            </Col>
          </Row>
        })}
        <h4>Counterparty Details</h4>
        {CounterpartyData?.map((data: any, index: number) => {
          return (
            <Row gutter={24} key={index}>
              <Col span={5} style={{ color: "#4E6ACB", fontSize: "14px", fontFamily: "Poppins" }}>
                <p>{data.label1}</p>
              </Col>
              <Col span={7}>
                <p>{data.value1}</p>
              </Col>
              <Col span={5} style={{ color: "#4E6ACB", fontSize: "14px", fontFamily: "Poppins" }}>
                <p>{data.label2}</p>
              </Col>
              <Col span={7}>
                <p>{data.value2}</p>
              </Col>
            </Row>
          )
        })}

        <h4>Limit Details</h4>
        {LimitData?.map((data: any, index: number) => {
          return (
            <Row gutter={24}>
              <Col span={5} style={{ color: "#4E6ACB", fontSize: "14px", fontFamily: "Poppins" }}>
                <p>{data.label1}</p>
              </Col>
              <Col span={7}>
                <p>{data.value1}</p>
              </Col>
              <Col span={5} style={{ color: "#4E6ACB", fontSize: "14px", fontFamily: "Poppins" }}>
                <p>{data.label2}</p>
              </Col>
              <Col span={7}>
                <p>{data.value2}</p>
              </Col>
            </Row>
          )
        })}

      </>
      <Row>
        <p className="SummaryLabel">Auto finance for approved Invoices</p>

        <Checkbox onChange={onChangeCheckBox} />
      </Row>

      <Row>
        <p className="SummaryLabel">Are you an existing Customer of bank?</p>
        {
          ExistingCustomerData === "YES" ?
            <Radio.Group value={"YES"} style={{ margin: "4px 10px" }}>
              <Radio value={"YES"}>Yes</Radio>
              <Radio value={"NO"}>No</Radio>
            </Radio.Group>
            :
            ExistingCustomerData === "NO" ?
              <Radio.Group value={"NO"} style={{ margin: "4px 10px" }}>
                <Radio value={"YES"}>Yes</Radio>
                <Radio value={"NO"}>No</Radio>
              </Radio.Group>
              :
              <Radio.Group onChange={onChange} defaultValue={existingCustomerValue} style={{ margin: "4px 10px" }}>
                <Radio value={"YES"}>Yes</Radio>
                <Radio value={"NO"}>No</Radio>
              </Radio.Group>
        }
      </Row>

    </div>

  );
};
export default CounterPartyOnboarding;
