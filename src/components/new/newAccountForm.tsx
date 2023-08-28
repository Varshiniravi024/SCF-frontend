import React, { useEffect, useState, useRef } from "react";
import { Form, Input, Button, Row, Col, Select, AutoComplete } from "antd";
import httpClient from "../../utils/config/core/httpClient";
import baseurl from "../../utils/config/url/base";
import { useNavigate } from "react-router-dom";
import { FieldErrorMessages } from "../../utils/enum/messageChoices";
import { InputPatterns } from "../../utils/validators/inputPattern";

const NewForm = () => {
  const { Option } = Select;
  const navigate = useNavigate();

  const [countryList, SetCountryList] = useState([]);
  const [countryCode, setCountryCode] = useState("" as any);
  const [selectedCountryId, setSelectedCountryId] = useState(0);
  const [counterpartyNameDataSource, setCounterpartyNameDataSource] = useState([])
  const [partyDetail, setPartyDetail] = useState(
    {
      id: "",
      name: "",
      address: "",
      city: "",
      country: "",
      zipcode: "",
      state: "",
      baseCurrency: "",
      customerId: "",
      accountNo: ""
    }

  )
  const [currencyList, SetCurrencyList] = useState([]);

  const onchangeCountry = (id: number) => {
    setSelectedCountryId(id);
    countryList.map((data: any) => {
      if (data.id === id) {
        setCountryCode(data.dial_code);
      }
    });
  };
  const onCounterPartyNameSearch = (searchtext: any) => {
    httpClient
      .getInstance()
      .get(`${baseurl}api-auth/party/?party_type=` + searchtext)
      .then((resp: any) => {
        setCounterpartyNameDataSource(resp.data.data)
      })
  }
  let selectedTextValue = ""

  const onCounterPartyNameSelect = (selectedText: any) => {
    selectedTextValue = selectedText
    counterpartyNameDataSource.map((item: any) => {
      if (item.name === selectedText) {

        setPartyDetail({
          id: item.id,
          name: item.name,
          address: item.address_line_1,
          city: item.city,
          country: item.country_code,
          zipcode: item.zipcode,
          state: item.state,
          baseCurrency: item.base_currency,
          customerId: item.customer_id,
          accountNo: item.account_number
        })
      }
    })
  }
  useEffect(() => {
    httpClient
      .getInstance()
      .get(`${baseurl}api-auth/party/?party_type=buyer`)
      .then((resp: any) => {
        setCounterpartyNameDataSource(resp.data.data)
      })
    httpClient
      .getInstance()
      .get(`${baseurl}api-auth/currency/`)
      .then((resp: any) => {
        SetCurrencyList(resp.data.data);
      });

    httpClient
      .getInstance()
      .get(`${baseurl}api-auth/country/`)
      .then((resp: any) => {
        SetCountryList(resp.data.data);
      });
  }, [])
  const onclickExit = () => {
    navigate("/NewAccount");
  }
  const onFinish = (values: any) => {

    const body = {
      account_number: values.AccountNumber === "" ? partyDetail.accountNo : values.AccountNumber,
      customer_id: values.CustomerId === "" ? partyDetail.customerId : values.CustomerId,
      name: values.name === "" ? partyDetail.name : values.name,
      city: values.city === "" ? partyDetail.city : values.city,
      currency: values.baseCurrency === "" ? partyDetail.baseCurrency : values.baseCurrency,
      country: values.country === "" ? partyDetail.country : values.country,
      zipcode: values.zipcode === "" ? partyDetail.zipcode : values.zipcode,
      party: values.party,
      address: values.address === "" ? partyDetail.address : values.address,
      state: values.state === "" ? partyDetail.state : values.state,
      email: values.email,
      phone: values.phone

    }
    httpClient
      .getInstance()
      .post(`${baseurl}api-auth/signup_process/`, body)
      .then((response: any) => {
      })
  }
  return (
    <div>
      <div className="textHeading">Signup Account</div>
      <div className="loginContainer">

        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete="off"
        >
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label={"Account Number"}
                name={"AccountNumber"}
                className="FormContainer"
                key={partyDetail?.accountNo || "AccountNumber"}

              >
                {
                  partyDetail.accountNo ?
                    <div className="readOnlyField">{partyDetail.accountNo} </div>
                    :
                    <Input placeholder={"Please enter the account number"} id={"AccountNumber"} />
                }
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={"Customer Id"}
                name={"CustomerId"}
                className="FormContainer"
                key={partyDetail.customerId ? partyDetail.customerId : "CustomerId"}
              >
                {
                  partyDetail.customerId ?
                    <div className="readOnlyField">{partyDetail.customerId} </div>
                    :
                    <Input placeholder={"Please enter the account number"} id={"AccountNumber"} />
                }
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label={"Name"}
                name={"name"}
                className="FormContainer"
                key={partyDetail.name ? partyDetail.name : "name"}
              >
                {
                  partyDetail.name ?
                    <div className="readOnlyField">{partyDetail.name} </div>
                    :
                    <Input placeholder={"Please enter the account number"} id={"AccountNumber"} />
                }
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={"Party"}
                name={"party"}
                className="FormContainer"
                key={"party"}

              >

                <AutoComplete
                  dataSource={counterpartyNameDataSource && counterpartyNameDataSource.map((value: any) => value.name)}
                  style={{ width: "100%" }}
                  onSelect={onCounterPartyNameSelect}
                  onSearch={onCounterPartyNameSearch}
                  onChange={onCounterPartyNameSearch}
                  placeholder="Select counterparty Name"
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>

              <Form.Item
                label={"Base Currency"}
                name={"baseCurrency"}
                className="FormContainer"
                key={partyDetail.baseCurrency ? partyDetail.baseCurrency : "baseCurrency"}
              >
                {
                  partyDetail.baseCurrency ?
                    <div className="readOnlyField">{partyDetail.baseCurrency} </div>
                    :
                    <Select
                      showSearch
                      placeholder="Select"
                      optionFilterProp="children"
                      style={{ width: "" }}
                    >
                      {currencyList &&
                        currencyList.map((item: any, index: number) => {
                          return (
                            <Option value={item.description} key={item.description}>
                              {item.description}
                            </Option>
                          );
                        })}
                    </Select>
                }
              </Form.Item>

            </Col>
            <Col span={12}>
              <Form.Item
                label={"Address"}
                name={"address"}
                className="FormContainer"
                key={partyDetail.address ? partyDetail.address : "address"}
              >
                {
                  partyDetail.address ?
                    <div className="readOnlyField">{partyDetail.address} </div>
                    :
                    <Input placeholder={"Please enter the account number"} id={"AccountNumber"} />
                }
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label={"City"}
                name={"city"}
                className="FormContainer"
                key={partyDetail.city ? partyDetail.city : "city"}
              >
                {
                  partyDetail.city ?
                    <div className="readOnlyField">{partyDetail.city} </div>
                    :
                    <Input placeholder={"Please enter the account number"} id={"AccountNumber"} />
                }
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={"State"}
                name={"state"}
                className="FormContainer"
                key={partyDetail.state ? partyDetail.state : "state"}
              >
                {
                  partyDetail.state ?
                    <div className="readOnlyField">{partyDetail.state} </div>
                    :
                    <Input placeholder={"Please enter the account number"} id={"AccountNumber"} />
                }
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label={"ZipCode"}
                name={"zipcode"}
                className="FormContainer"
                key={partyDetail.zipcode ? partyDetail.zipcode : "zipcode"}
              >
                {
                  partyDetail.zipcode ?
                    <div className="readOnlyField">{partyDetail.zipcode} </div>
                    :
                    <Input placeholder={"Please enter the account number"} id={"AccountNumber"} />
                }
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={"Country"}
                name={"country"}
                className="FormContainer"
                key={partyDetail.country ? partyDetail.country : "country"}
              >
                {
                  partyDetail.country ?
                    <div className="readOnlyField">{partyDetail.country} </div>
                    :
                    <Select
                      showSearch
                      placeholder="Enter your country"
                      optionFilterProp="children"
                      style={{
                        width: "100%",
                        marginTop: "6px",
                        marginRight: "",
                      }}
                      onChange={onchangeCountry}
                    >
                      {countryList &&
                        countryList.map((item: any, index: number) => {
                          return (
                            <Option value={item.country} id={item.country}>
                              {item.country}
                            </Option>
                          );
                        })}
                    </Select>
                }
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col span={12}>
              <Form.Item
                label={"Email"}
                name={"email"}
                className="FormContainer"
                key={"email"}
                rules={[
                  {
                    required: true,
                    pattern: InputPatterns.EMAIL,
                    message: FieldErrorMessages.EMAIL,
                  },
                ]}
              >
                <Input placeholder={"Please enter the account number"} id={"AccountNumber"} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label={"Mobile Number"}
                name={"phone"}
                className="FormContainer"
                key={"phone"}
                rules={[
                  {
                    required: true,
                    pattern: InputPatterns.MOBILE,
                    message: FieldErrorMessages.MOBILENO,
                  },
                ]}
              >
                <Input
                  placeholder={"Please enter the account number"} id={"AccountNumber"} />
              </Form.Item>
            </Col>
          </Row>

          <div className="buttonGroup">
            <Form.Item>
              <Button type="default" onClick={onclickExit} className="ExitBtnLabel">
                Exit
              </Button>
            </Form.Item>
            <Form.Item>
              <Button type="default" htmlType="submit" className="ExitBtnLabel" >
                Submit
              </Button>
            </Form.Item>

          </div>
        </Form>
      </div>
    </div>
  )

}
export default NewForm