import { useEffect, useState } from "react"
import { Form, Input, Row, Select, Col } from "antd";
import { useNavigate } from "react-router";
import images from "../../../../assets/images"
import "../../../new/new.scss";
import httpClient from "../../../../utils/config/core/httpClient";
import baseurl from "../../../../utils/config/url/base";
import { FieldErrorMessages } from "../../../../utils/enum/messageChoices";

const CreateNewAccount = (props: any) => {
  const Navigate = useNavigate()
  const { DropdownIcon } = images;
  const { Option } = Select;

  const [currencyList, SetCurrencyList] = useState([]);

  useEffect(() => {
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
  return (
    <div>
      <div className="textHeading">Account Details</div>
      <div className="createNewAccount loginContainer">

        <Form
          name="basic"
          initialValues={{ remember: true }}
          autoComplete="off"
        >
          <Form.Item
            label={"Account Number"}
            name={"account_number"}
            className="FormContainer"
            key={"account_number"}
            rules={[
              {
                required: true,
                message: FieldErrorMessages.ACCNO,
              },
            ]}
            initialValue={props?.partyData?.account_number}
          >
            <Row>
              <Col span={6}>
                <Select
                  id="onboarding_account_currency"
                  showSearch
                  placeholder="Select"
                  optionFilterProp="children"
                  style={{ width: "" }}
                  suffixIcon={<img src={DropdownIcon} alt="DropdownIcon" />}
                  onChange={(e: any) => props.accCurrency(e)}
                >
                  {currencyList &&
                    currencyList.map((item: any, index: number) => {
                      return (
                        <Option value={item.id} key={item.description} id={item.description}>
                          {item.description}
                        </Option>
                      );
                    })}
                </Select>
              </Col>
              <Col span={18}>
                <Input placeholder={"Enter your account number"} id='onboarding_accountNumber'
                  defaultValue={props?.partyData?.account_number}
                  onChange={(e) =>
                    props.account(e.target.value, "account")} />
              </Col>
            </Row>
          </Form.Item>
          <Form.Item
            label={"Customer ID"}
            name={"customer_id"}
            className="FormContainer"
            key={"customer_id"}
            rules={[
              {
                required: true,
                message: FieldErrorMessages.CUSID,
              },
            ]}
            initialValue={props?.partyData?.customer_id}
          >
            <Input placeholder={"Enter your customerId"} onChange={(e) => props.customer(e.target.value)}  id={"onboarding_customerId"} />
          </Form.Item>

        </Form>
      </div>
    </div>
  );
};
export default CreateNewAccount;
