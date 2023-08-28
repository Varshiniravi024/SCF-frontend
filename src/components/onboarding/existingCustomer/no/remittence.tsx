import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { Input, Form, Row, Col, Card, Select } from "antd";
import "../../onboarding.scss";
import httpClient from "../../../../utils/config/core/httpClient";
import baseurl from "../../../../utils/config/url/base";
import images from "../../../../assets/images";
import { Currency } from "../../../api/base";
import { FieldErrorMessages } from "../../../../utils/enum/messageChoices";
import { InputPatterns } from "../../../../utils/validators/inputPattern";
const Remittance = (props: any) => {
  const Navigate = useNavigate()
  const { TextArea } = Input;
  const { DropdownIcon } = images;
  const { Option } = Select;
  const [remittanceData, setRemittance] = useState([] as any);
  const [bicCodeError, setBicCodeError] = useState(false);
  const [ifscCodeError, setIfscCodeError] = useState(false);
  const [currencyData, setCurrencyData] = useState([]);

  const getCurrency = async () => {
    const data = await Currency()
    setCurrencyData(data)
  }

  useEffect(() => {
    getCurrency();

    httpClient
      .getInstance()
      .get(`${baseurl}api-auth/onboarding/remittance-config/`)
      .then((response: any) => {
        setRemittance(response.data.data[0]);
        props.remittanceData(response.data.data[0]);
      })
      .catch(() => {
        Navigate("/Notfound")
      })
  }, []);

  const onFinish = (values: any) => {
    remittanceData &&
      remittanceData.mandatory_documents &&
      remittanceData.mandatory_documents.documents.map((data: any) => {
        if (
          data.document_required === "false" &&
          data.document_name === "Account_number"
        ) {
          values.account_id = "";
        } else if (
          data.document_required === "false" &&
          data.document_name === "IFSC code"
        ) {
          values.ifsc_code = "";
        } else if (
          data.document_required === "false" &&
          data.document_name === "IBAN"
        ) {
          values.iban_no = "";
        }
        return null;
      });
    const body = {
      values,
    };

    httpClient
      .getInstance()
      .post(`${baseurl}api-auth/onboarding/remittance-info/`, body)
      // .then((response: any) => {
      // })
      .catch(() => {
        Navigate("/Notfound")
      })
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log(errorInfo)
  };

  return (
    <div className="remittanceContainer">
      <div>
        <Form
          name="basic"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Row gutter={24}>
            <Col span={20}>
              <h3>Remittance Details </h3>
            </Col>
          </Row>
          <Card style={{ width: "50%", margin: "auto" }}>
            {remittanceData &&
              remittanceData.mandatory_documents &&
              remittanceData.mandatory_documents.documents.map((data: any) => {
                return (
                  <>
                    {data.document_name === "Account_number" &&
                      data.document_required === true ? (
                      <Form.Item
                        label={
                          <div>
                            Account Number
                            <span style={{ color: "red" }}>*</span>
                          </div>
                        }
                        className="FormContainer"
                        key={"Account_number"}
                        rules={[
                          {
                            message: FieldErrorMessages.ACCNUM,
                          },
                        ]}
                      >
                        <div style={{ display: "flex" }}>
                          <Select
                            id="onboarding_limit_currency"
                            showSearch
                            placeholder="Select"
                            optionFilterProp="children"

                            style={{ width: "40%" }}
                            suffixIcon={<img src={DropdownIcon} alt="DropdownIcon" />}
                            onChange={(e: any) => {
                              props.accountCurrency(e)
                            }}
                          >
                            {currencyData &&
                              currencyData.map((item: any, index: number) => {
                                return (
                                  <Option value={item.id} key={item.description}>
                                    {item.description}
                                  </Option>
                                );
                              })}
                          </Select>
                          <Input
                            placeholder={`Enter your Account Number`}
                            id={"Account_id"}
                            defaultValue={props?.remittanceValues?.[0]?.account_id}
                            onChange={(e) => props.accountNumber(e.target.value)}
                            maxLength={data.InputFieldLength}
                          />
                        </div>
                      </Form.Item>
                    ) : (
                      ""
                    )}

                    {data.document_name === "Account_name" &&
                      data.document_required === true ? (
                      <Form.Item
                        label={
                          <div>
                            Account Name<span style={{ color: "red" }}>*</span>
                          </div>
                        }
                        className="FormContainer"
                        key={"Account_name"}
                        rules={[
                          {
                            message: FieldErrorMessages.ACCNAME,
                          },
                        ]}
                      >
                        <Input
                          placeholder={`Enter your Account name`}
                          defaultValue={props?.remittanceValues?.[0]?.account_name
                          }
                          onChange={(e) => props.accountName(e.target.value)}
                          maxLength={data.InputFieldLength}
                        />
                      </Form.Item>
                    ) : (
                      ""
                    )}
                    {data.document_name === "Account_with_bank" &&
                      data.document_required === true ? (
                      <Form.Item
                        label={
                          <div>
                            Account with bank
                            <span style={{ color: "red" }}>*</span>
                          </div>
                        }
                        className="FormContainer"
                        key={"Account_with_bank"}
                        rules={[
                          {
                            message: FieldErrorMessages.BANKACC,
                          },
                        ]}
                      >
                        <Input
                          placeholder={`Enter your Account with bank`}
                          defaultValue={props?.remittanceValues?.[0]?.bank_name}
                          onChange={(e) =>
                            props.accountWithBank(e.target.value)
                          }
                          maxLength={data.InputFieldLength}
                        />
                      </Form.Item>
                    ) : (
                      ""
                    )}
                    {data.document_name === "BIC code" &&
                      data.document_required === true ? (
                      <Form.Item
                        label={
                          <div>
                            BIC code<span style={{ color: "red" }}>*</span>
                          </div>
                        }
                        className="FormContainer"
                        key={"BIC code"}
                        rules={[
                          {
                            message: FieldErrorMessages.BIC,
                          },
                        ]}
                      >
                        <Input
                          placeholder={`Enter your Bic Code`}
                          defaultValue={props?.remittanceValues?.[0]?.bic_code}
                          onChange={(e) => {
                            props.bicCode(e.target.value)
                            if (e.target.value.length === 11 || e.target.value.length === 8) {
                              setBicCodeError(false)
                            } else {
                              setBicCodeError(true)
                            }
                          }}
                          maxLength={data.InputFieldLength}
                          minLength={data.InputFieldLength}
                        />
                        <span className="errorMessage" style={bicCodeError ? { display: "flex" } : { display: "none" }}>{FieldErrorMessages.INVALIDBIC}</span>
                      </Form.Item>
                    ) : (
                      ""
                    )}
                    {data.document_name === "IFSC code" &&
                      data.document_required === true ? (
                      <Form.Item
                        label={
                          <div>
                            IFSC code<span style={{ color: "red" }}>*</span>
                          </div>
                        }
                        className="FormContainer"
                        key={"ifscCode"}
                        rules={[
                          {
                            pattern: InputPatterns.IFSC,
                            message: FieldErrorMessages.IFSC,
                          },
                        ]}
                      >
                        <Input
                          placeholder={`Enter your ifscCode`}
                          defaultValue={props?.remittanceValues?.[0]?.ifsc_code}
                          onChange={(e) => {
                            props.ifscCode(e.target.value)
                            const pattern = InputPatterns.IFSC
                            const isSuccess = pattern.test(e.target.value)
                            if (isSuccess) {
                              setIfscCodeError(false)
                            } else {
                              setIfscCodeError(true)
                            }
                          }}
                          maxLength={data.InputFieldLength}
                        />
                        <span className="errorMessage" style={ifscCodeError ? { display: "flex" } : { display: "none" }}>{FieldErrorMessages.INVALIDIFSC}</span>
                      </Form.Item>
                    ) : (
                      ""
                    )}
                    {data.document_name === "IBAN" &&
                      data.document_required === true ? (
                      <Form.Item
                        label={
                          <div>
                            IBAN code<span style={{ color: "red" }}>*</span>
                          </div>
                        }
                        className="FormContainer"
                        key={"IbanCode"}
                        rules={[
                          {
                            message: FieldErrorMessages.IBAN,
                          },
                        ]}
                      >
                        <Input
                          placeholder={`Enter your IbanCode`}
                          defaultValue={props?.remittanceValues?.[0]?.iban_no}
                          onChange={(e) => props.iban(e.target.value)}
                          maxLength={data.InputFieldLength}
                        />
                      </Form.Item>
                    ) : (
                      ""
                    )}
                  </>
                );
              })}
            <Form.Item
              label={<div>Comments</div>}
              className="FormContainer"
              key={"comments"}
              rules={[
                {
                  required: false,
                  message: FieldErrorMessages.COMMENTS,
                },
              ]}
            >
              <TextArea
                placeholder={`Enter your comments`}
                defaultValue={props?.remittanceValues?.[0]?.comments}
                id={"comments"}
                onChange={(e) => props.comment(e.target.value)}
              />
            </Form.Item>
          </Card>
        </Form>
      </div>
    </div>
  );
};
export default Remittance;
