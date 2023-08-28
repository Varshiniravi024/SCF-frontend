import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Select,
  Card,
  message,
  Tabs,
  Spin,
} from "antd";
import { useNavigate } from "react-router";
import images from "../../../../assets/images";
import httpClient from "../../../../utils/config/core/httpClient";
import baseurl from "../../../../utils/config/url/base";
import imageBaseurl from "../../../../utils/config/url/image";
import "../../onboarding.scss";
import { ErrorMessage, FieldErrorMessages } from "../../../../utils/enum/messageChoices";

const KycDetails = (props) => {
  const Navigate = useNavigate();
  const { DropdownIcon, UploadDocs, DocumentIcon, DeleteIcon } = images;
  const { Option } = Select;
  const [fileList, setFileList] = useState([]);
  const [nonfileList, setNonFileList] = useState([]);
  const [selectedMandatoryDocs, setSelectedMandatoryDocs] = useState({});
  const [selectedNonMandatoryDocs, setSelectedNonMandatoryDocs] = useState({});
  const { TabPane } = Tabs;
  const [tabValue, setTabValue] = useState("1");
  const [DocumentDetails, SetDocumentDetails] = useState([]);
  const [NonDocumentDetails, SetNonDocumentDetails] = useState([]);
  const [selectedFile, setSelectedFile] = useState([]);
  const [nonMandatorySelectedFile, setNonMandatorySelectedFile] = useState([]);
  const [docList, setDocList] = useState([]);
  const [nonMandatoryDocList, setNonMandatoryDocList] = useState([]);
  const [mandatoryFiles, setmandatoryFiles] = useState([]);
  const [nonMandatoryFiles, setNonmandatoryFiles] = useState([]);
  const [mandatoryDoc, setmandatoryDoc] = useState([]);
  const [NonmandatoryDoc, setNonmandatoryDoc] = useState([]);
  const [SelectedDocError, SetSelectedDocError] = useState(false);
  const [SelectedNonMandatoryDocError, SetSelectedNonMandatoryDocError] =
    useState(false);
  const [DisableAddBtn, SetDisableAddBtn] = useState(true);
  const [DisableAddBtn_InNonMandatory, SetDisableAddBtn_InNonMandatory] =
    useState(true);
  const [attachmentList, setAttachmentList] = useState([]);
  const [mandatoryTableLoading, setMandatoryTableLoading] = useState(false);
  const [nonMandatoryTableLoading, setNonMandatoryTableLoading] = useState(false);
  let mandatorykycFiles;
  let nonMandatorykycFiles;
  const [InputValue, SetInputValue] = useState("");
  const [NonMandatoryDocumentValue, setNonMandatoryDocumentValue] =
    useState("");
  const [MandatoryDocumentValue, setMandatoryDocumentValue] = useState("");

  const selectedFiles = (value) => {
    setFileList(value);
    let file = [];
    if (fileList.length > 0) {
      fileList.map((item, index) => {
        file.push({
          filename: selectedMandatoryDocs.DocumentName,
          files: item[0],
        });
        return file;
      });
    }
  };

  const NonSelectedFile = (value) => {
    setNonFileList(value);
    let file = [];
    if (nonfileList.length > 0) {
      nonfileList.map((item, index) => {
        file.push({
          filename: selectedNonMandatoryDocs.DocumentName,
          files: item[0],
        });
        return file;
      });
    }
  };

  const callback = (key) => {
    setTabValue(key);
  };

  useEffect(() => {
    httpClient
      .getInstance()
      .get(`${baseurl}api-auth/onboarding/kyc-info/`)
      .then((infoResp) => {
        if (infoResp.data.data.length === 0) {
          httpClient
            .getInstance()
            .get(`${baseurl}api-auth/onboarding/kyc-config/`)
            .then((resp) => {
              props.kycConfigValue(resp.data.data?.[0]?.id);
              SetDocumentDetails(
                resp.data.data?.[0]?.mandatory_documents.mandatory
              );
              props.totalMandatoryDocList(
                resp.data.data?.[0]?.mandatory_documents.mandatory
              );
              SetNonDocumentDetails(
                resp.data.data?.[0]?.mandatory_documents.non_mandatory
              );
              httpClient
                .getInstance()
                .get(`${baseurl}api-auth/country/?country_name=${resp.data.data?.[0]?.country}`)
                .then((response) => {
                  props.countryValue(response.data.data?.[0]?.id);
                })
                .catch(()=>{
                  Navigate("/Notfound")
                })
            })
            .catch(()=>{
              Navigate("/Notfound")
            })
        } else {
          setAttachmentList(infoResp.data.data?.[0]?.attachments?.file);
          setDocList(infoResp.data.data?.[0]?.uploaded_document.mandatory);
          setNonMandatoryDocList(
            infoResp.data.data?.[0]?.uploaded_document.non_mandatory
          );
          SetDocumentDetails(
            infoResp.data.data?.[0]?.required_documents.mandatory
          );
          SetNonDocumentDetails(
            infoResp.data.data?.[0]?.required_documents.non_mandatory
          );
        }
      })
      .catch(()=>{
        Navigate("/Notfound")
      })
  }, []);
  let data = [];
  let docs = docList;
  let nonmandatoryData = [];
  let nonMandatoryDocs = nonMandatoryDocList;
  let mandatoryFileData = [];
  let nonMandatoryFileData = [];
  const HeadersData = [
    {
      Type: "Type",
      Input: "Input",
      Upload: "Upload",
      Status: "Status",
      From: "From",
      Program: "Program Name",
      Amount: "Amount",
      Due: "Due Date",
      Attached: "Attached",
    },
  ];
  const HeadersData1 = [
    {
      Type: "Type",
      Input: "Input",
      Upload: "Upload",
      Status: "Status",
      From: "From",
      Program: "Program Name",
      Amount: "Amount",
      Due: "Due Date",
      Attached: "Attached",
    },
  ];
  const changeHandler = (e) => {
    const files = e.target.files;
    if (files.length) {
      const file = Array.prototype.slice.call(files);
      setmandatoryDoc(file);
      const uploaded = [...selectedFile];
      const uploadedDetails = [...selectedFile];
      setSelectedFile(uploaded, uploaded.push(file));
      selectedFiles(uploadedDetails, uploadedDetails.push(file));
      if (attachmentList.length > 0) {
        attachmentList.map((attachments) => {
          if (attachments.comments === MandatoryDocumentValue) {
            const formdata = new FormData();
            formdata.append(`files`, files[0]);
            formdata.append(`party`, attachments.party_id);
            httpClient
              .getInstance()
              .put(`${baseurl}api/resource/file/${attachments.id}/`, formdata)
              // .then((response) => {})
              .catch(()=>{
                Navigate("/Notfound")
              })
          }
          return attachmentList
        });
      }
    }
  };

  const nonMandatorychangeHandler = (e) => {
    const files = e.target.files;
    if (files.length) {
      const file = Array.prototype.slice.call(files);
      setNonmandatoryDoc(file);
      const uploaded = [...nonMandatorySelectedFile];
      const uploadedDetails = [...nonMandatorySelectedFile];
      setNonMandatorySelectedFile(uploaded, uploaded.push(file));
      NonSelectedFile(uploadedDetails, uploadedDetails.push(file));
      if (attachmentList.length > 0) {
        attachmentList.map((attachments) => {
          if (attachments.comments === MandatoryDocumentValue) {
            const formdata = new FormData();
            formdata.append(`files`, files[0]);
            formdata.append(`party`, attachments.party_id);
            httpClient
              .getInstance()
              .put(`${baseurl}api/resource/file/${attachments.id}/`, formdata)
              // .then((response) => {})
              .catch(()=>{
                Navigate("/Notfound")
              })
          }
          return attachmentList
        });
      }
    }
  };

  const onFinishNon = (values) => {
    if (NonmandatoryDoc.length === 0) {
      message.error(ErrorMessage.PUD, 3);
    } else {
      if (nonfileList.length > 0) {
        let input_value;

        let items;
        nonfileList.map((item, index) => { 
          items = item[0];
          if (selectedNonMandatoryDocs.DocumentInputField === true) {
            //
            input_value = InputValue;
          } else {
            input_value = "";
            SetInputValue("");
          }
          return nonfileList
        });

        nonMandatoryFileData.push({
          filename: selectedNonMandatoryDocs.DocumentName,
          files: items,
        });
        nonMandatorykycFiles = nonMandatoryFiles.concat(nonMandatoryFileData);

        setNonmandatoryFiles(nonMandatoryFiles.concat(nonMandatoryFileData));
        props.nonMandatoryfileList(nonMandatorykycFiles);
        if (nonMandatoryDocList.length !== 0) {
          if (
            nonMandatoryDocList.DocumentName !==
            selectedNonMandatoryDocs.DocumentName
          ) {
            nonmandatoryData.push({
              DocumentName: selectedNonMandatoryDocs.DocumentName,
              DocumentInputField: input_value,
              DocumentUpload: NonmandatoryDoc,
            });

            setNonMandatoryDocList(
              nonMandatoryDocList.concat(nonmandatoryData)
            );
            SetDisableAddBtn_InNonMandatory(true);
          }
        } else {
          nonMandatoryDocs.push({
            DocumentName: selectedNonMandatoryDocs.DocumentName,
            DocumentInputField: input_value,
            DocumentUpload: NonmandatoryDoc,
          });
        }
        SetDisableAddBtn_InNonMandatory(true);
        SetInputValue("");
        setNonMandatoryDocumentValue("");
        props.kycInfosNonMandatory(nonMandatoryDocList);
      }
    }
  };

  const onChangeInput = (e) => {
    SetInputValue(e.target.value);
  };

  const onFinish = (values) => {
    if (mandatoryDoc.length === 0) {
      message.error(ErrorMessage.PUD, 3);
    } else {
      if (fileList.length > 0) {
        let input_value;

        let items;
        fileList.map((item, index) => {
          items = item[0];
          if (selectedMandatoryDocs.DocumentInputField === true) {
            //
            input_value = InputValue;
          } else {
            input_value = "";
            SetInputValue("");
          }
          return input_value;
        });

        mandatoryFileData.push({
          filename: selectedMandatoryDocs.DocumentName,
          files: items,
        });
        mandatorykycFiles = mandatoryFiles.concat(mandatoryFileData);
        setmandatoryFiles(mandatoryFiles.concat(mandatoryFileData));
        props.mandatoryfilelist(mandatorykycFiles);
        if (docList.length !== 0) {
          if (docList.DocumentName !== selectedMandatoryDocs.DocumentName) {
            data.push({
              DocumentName: selectedMandatoryDocs.DocumentName,
              DocumentInputField: input_value,
              DocumentUpload: mandatoryDoc,
            });
            setmandatoryDoc([]);
            setDocList(docList.concat(data));
            SetDisableAddBtn(true);
          }
        } else {
          docs.push({
            DocumentName: selectedMandatoryDocs.DocumentName,
            DocumentInputField: input_value,
            DocumentUpload: mandatoryDoc,
          });
        }
        SetInputValue("");
        SetDisableAddBtn(true);
        setMandatoryDocumentValue("");

        props.kycInfos(docList.concat(data));
      }
    }
  };
  const onFinishFailed = (errorInfo) => {
    message.error(ErrorMessage.PFD);
  };
  const onFinishFailedNon = (errorInfo) => {
    message.error(ErrorMessage.PFD);
  };
  const MandatoryDocumentSelect = (data) => {
    setMandatoryDocumentValue(data);
    SetInputValue("");
    SetDisableAddBtn(false);
    let docError = false;
    DocumentDetails.map((item, index) => {
      if (item.DocumentName === data) {
        setSelectedMandatoryDocs(item);
        setmandatoryDoc([]);
        SetInputValue("");
      }
      return null
    });
    docList.map((lists) => {
      if (lists.DocumentName === data) {
        docError = true;
      }
     
      SetSelectedDocError(docError);
      return docError;
    });
  };
  const NonMandatoryDocumentSelect = (data) => {
    SetDisableAddBtn_InNonMandatory(false);
    setNonMandatoryDocumentValue(data);
    SetInputValue("");

    NonDocumentDetails.map((item, index) => {
      if (item.DocumentName === data) {
        setSelectedNonMandatoryDocs(item);
        setNonmandatoryDoc([]);
        SetInputValue("");
      }
      return null
    });
    let nonMandatoryDocError = false;

    nonMandatoryDocList.map((list) => {
      if (list.DocumentName === data) {
        nonMandatoryDocError = true;
        SetDisableAddBtn_InNonMandatory(true);
       
      }
      return nonMandatoryDocError
    });
    SetSelectedNonMandatoryDocError(nonMandatoryDocError);
  };
  const deleteMandatoryDocs = (documentRecord) => {
    setMandatoryTableLoading(true);
  
    docList &&
      docList.map((record, index) => {
      
        let docslist = docList;

        if (record.DocumentName === documentRecord.DocumentName) {
         docslist.splice(index, 1);
           }
        
        setDocList(docslist);
        setTimeout(() => {
          setMandatoryTableLoading(false);
        }, 1000);
        return docslist;
      });
      
  };
  const deleteNonMandatoryDocs = (documentRecord) => {
    setNonMandatoryTableLoading(true);
    nonMandatoryDocList &&
    nonMandatoryDocList.map((record, index) => {
       let docslist = docList;

        if (record.DocumentName === documentRecord.DocumentName) {
         docslist.splice(index, 1);
          }
        setNonMandatoryDocList(docslist);
         setTimeout(() => {
          setNonMandatoryTableLoading(false);
        }, 1000);
        return docslist;
      });
  };
  const items = [
    {
      label:"Mandatory Documents",
      key:"1",
      children: <div className="approvedPayableFinacing">
      <div className="containerTable">
        <div className="OuterDiv">
          {HeadersData.map((head, index) => {
            return (
              <div key={index} className="HeadInnerDiv">
                <h1 className="head">Document Type</h1>
                <h1 className="head">Document no.</h1>
                <h1 className="head">Upload Document</h1>
                <h1 className="head"> </h1>
              </div>
            );
          })}
        </div>
        <div className="OuterDiv">
          <div className="InnerDiv">
            <Form
              name="mandatory"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              onFinishFailed={onFinishFailed}
              autoComplete="off"
              style={{ display: "flex" }}
            >
              <Form.Item
                label={""}
                name={"DocumentName"}
                className="FormContainer"
                key={"DocumentName"}
                rules={[
                  {
                    required: true,
                    message: FieldErrorMessages.DOCNAME,
                  },
                ]}
                initialValue={selectedMandatoryDocs}
              >
                <h5 className="body">
                  <Select
                    showSearch
                    placeholder="Select"
                    optionFilterProp="children"
                    style={{ width: "" }}
                    suffixIcon={
                      <img src={DropdownIcon} alt="DropdownIcon" id="mandatory_dropdown_icon"/>
                    }
                    value={MandatoryDocumentValue}
                    onSelect={MandatoryDocumentSelect}
                  >
                    {DocumentDetails &&
                      DocumentDetails.map((item, index) => {
                        return (
                          <Option
                            value={item.DocumentName}
                            key={item.DocumentName}
                          >
                            {item.DocumentName}
                          </Option>
                        );
                      })}
                  </Select>
                </h5>
                {SelectedDocError === true ? (
                  <div className="errorMessage">
                    {FieldErrorMessages.DOCUPLOADED}
                  </div>
                ) : (
                  ""
                )}
              </Form.Item>

              <Form.Item
                label={""}
                name={"DocumentInputField"}
                className="FormContainer"
                key={"DocumentInputField"}
                rules={[
                  {
                    required:
                      selectedMandatoryDocs.DocumentInputField === true
                        ? true
                        : false,
                    message: FieldErrorMessages.DOCINPUT,
                  },
                ]}
              >
                <h5 className="body" style={{ width: "20%" }}>
                  {selectedMandatoryDocs.DocumentInputField === true ? (
                    <Input onChange={onChangeInput} value={InputValue} />
                  ) : (
                    <div style={{ width: "20%" }}></div>
                  )}
                </h5>
              </Form.Item>
              <Form.Item
                label={""}
                name={"DocumentUpload"}
                className="FormContainer"
                key={"DocumentUpload"}
                rules={[
                  {
                    required: false,
                    message: FieldErrorMessages.DOCUPLOAD,
                  },
                ]}
              >
                <h5 className="body">
                  <div
                    style={{
                      padding: "5px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "5px",
                    }}
                  >
                    <label
                      htmlFor="filePicker"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        fontSize: "14px",
                        margin: "auto",
                      }}
                    >
                      <img
                        src={UploadDocs}
                        alt="uploadDocument"
                        style={{ width: "20px", margin: "auto" }}
                      />
                    </label>
                  </div>
                  <input
                    id="filePicker"
                    type="file"
                    style={{
                      border: "1px solid #000000",
                      visibility: "hidden",
                    }}
                    name="file"
                    onChange={(e) => changeHandler(e)}
                  />
                </h5>
              </Form.Item>
              <Form.Item>
                <h5 className="body">
                  <Button
                    htmlType="submit"
                    disabled={
                      DisableAddBtn === true
                        ? true
                        : SelectedDocError === true
                        ? true
                        : false
                    }
                  >
                    Add
                  </Button>
                </h5>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
      <h2>Uploaded Mandatory Document List</h2>
      {docList ? (
        <div className="containerTable">
          <div className="OuterDiv">
            <div className="HeadInnerDiv">
              <h1 className="head">Document Type</h1>
              <h1 className="head">Input</h1>
              <h1 className="head">Upload Document</h1>
              <h1 className="head"> </h1>
            </div>
          </div>
          {mandatoryTableLoading ? (
            <Spin />
          ) : (
            docList.map((record, index) => {
              return (
                <div className="OuterDiv">
                  <div
                    key={index}
                    className="InnerDivList mandatoryDocContainer"
                  >
                    <h5 className="body">{record.DocumentName}</h5>
                    <h5 className="body">
                      <div>{record.DocumentInputField}</div>
                    </h5>
                    <h5 className="body" key={index}>
                      {attachmentList?.length > 0 ? (
                        attachmentList.map((attachments) => {
                          if (
                            attachments.comments === record.DocumentName
                          ) {
                            return (
                              <a
                                href={
                                  imageBaseurl + attachments.file_path
                                }
                                target="_blank"
                                rel="noreferrer"
                              >
                                <img src={DocumentIcon} alt="file" />
                              </a>
                            );
                          }
                          return null;
                        })
                      ) : (
                        <div>
                          {record.DocumentUpload.length !== 0
                            ? "Document uploaded"
                            : ""}
                        </div>
                      )}
                    </h5>
                    <h5 className="body">
                      <img
                        src={DeleteIcon}
                        alt="delete"
                        onClick={() => deleteMandatoryDocs(record)}
                      />
                    </h5>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        ""
      )}
    </div>
    },
    {
      label:"Non-Mandatory Documents",
      key:"2",
      children: <div className="approvedPayableFinacing">
      <div className="containerTable">
        <div className="OuterDiv">
          {HeadersData.map((head, index) => {
            return (
              <div key={index} className="HeadInnerDiv">
                <h1 className="head">Document Type</h1>
                <h1 className="head">Document no.</h1>
                <h1 className="head">Upload Document</h1>
                <h1 className="head"> </h1>
              </div>
            );
          })}
        </div>

        <div className="OuterDiv">
          <div className="InnerDiv">
            <Form
              name="basic"
              initialValues={{ remember: true }}
              onFinish={onFinishNon}
              onFinishFailed={onFinishFailedNon}
              autoComplete="off"
              style={{ display: "flex" }}
            >
              <Form.Item
                label={""}
                name={"DocumentName"}
                className="FormContainer"
                key={"DocumentName"}
                rules={[
                  {
                    required: true,
                    message: FieldErrorMessages.DOCNAME,
                  },
                ]}
                initialValue={selectedNonMandatoryDocs}
              >
                <h5 className="body">
                  <Select
                    showSearch
                    placeholder="Select"
                    optionFilterProp="children"
                    style={{ width: "" }}
                    suffixIcon={
                      <img src={DropdownIcon} alt="DropdownIcon" id="non_mandatory_dropdown_icon" />
                    }
                    onSelect={NonMandatoryDocumentSelect}
                    value={NonMandatoryDocumentValue}
                  >
                    {NonDocumentDetails &&
                      NonDocumentDetails.map((item, index) => {
                        return (
                          <Option
                            value={item.DocumentName}
                            key={item.DocumentName}
                          >
                            {item.DocumentName}
                          </Option>
                        );
                      })}
                  </Select>
                </h5>
                {SelectedNonMandatoryDocError === true ? (
                  <div className="errorMessage">
                    {FieldErrorMessages.DOCUPLOADED}
                  </div>
                ) : (
                  ""
                )}
              </Form.Item>
              <Form.Item
                label={""}
                name={"DocumentInputField"}
                className="FormContainer"
                key={"DocumentInputField"}
                rules={[
                  {
                    required:
                      selectedNonMandatoryDocs.DocumentInputField === true
                        ? true
                        : false,
                    message: FieldErrorMessages.DOCINPUT,
                  },
                ]}
                initialValue={InputValue ? InputValue : ""}
              >
                <h5 className="body">
                  {selectedNonMandatoryDocs.DocumentInputField ===
                  true ? (
                    <Input
                      onChange={onChangeInput}
                      maxLength={
                        selectedNonMandatoryDocs.DocumentInputFieldTotalLength
                      }
                      value={InputValue}
                    />
                  ) : (
                    ""
                  )}
                </h5>
              </Form.Item>
              <Form.Item
                label={""}
                name={"DocumentUpload"}
                className="FormContainer"
                key={"DocumentUpload"}
                rules={[
                  {
                    required: false,
                    message: FieldErrorMessages.DOCUPLOAD,
                  },
                ]}
              >
                <h5 className="body">
                  <div
                    style={{
                      padding: "5px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      borderRadius: "5px",
                    }}
                  >
                    <label
                      htmlFor="filePicker1"
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        fontSize: "14px",
                        margin: "auto",
                      }}
                    >
                      <img
                        src={UploadDocs}
                        alt="uploadDocument"
                        style={{ width: "20px", margin: "auto" }}
                      />
                    </label>
                  </div>
                  <input
                    id="filePicker1"
                    type="file"
                    style={{
                      border: "1px solid #000000",
                      visibility: "hidden",
                    }}
                    name="file"
                    onChange={(e) => nonMandatorychangeHandler(e)}
                  />
                </h5>
              </Form.Item>
              <Form.Item>
                <h5 className="body">
                  <Button
                    htmlType="submit"
                    disabled={
                      DisableAddBtn_InNonMandatory === true
                        ? true
                        : SelectedDocError === true
                        ? true
                        : false
                    }
                  >
                    Add
                  </Button>
                </h5>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
      <h2>Uploaded Non-Mandatory Document List</h2>

      {nonMandatoryDocList ? (
        <div className="containerTable">
          <div className="OuterDiv">
            {HeadersData1.map((head, index) => {
              return (
                <div key={index} className="HeadInnerDiv">
                  <h1 className="head">Document Type</h1>
                  <h1 className="head">Document no.</h1>
                  <h1 className="head">Upload Document</h1>
                  <h1 className="head"> </h1>

                </div>
              );
            })}
          </div>
          {nonMandatoryTableLoading ? <Spin/>:
          nonMandatoryDocList.map((record, index) => {
            return (
              <div className="OuterDiv">
                <div
                  key={index}
                  className="InnerDivList mandatoryDocContainer"
                >
                  <h5 className="body">{record.DocumentName}</h5>
                  <h5 className="body">
                    <div>{record.DocumentInputField}</div>
                  </h5>
                  <h5 className="body" key={index}>
                    {attachmentList?.length > 0 ? (
                      attachmentList.map((attachments) => {
                        if (
                          attachments.comments === record.DocumentName
                        ) {
                          return (
                            <a
                              href={imageBaseurl + attachments.file_path}
                              target="_blank"
                              rel="noreferrer"
                            >
                              <img src={DocumentIcon} alt="file" />
                            </a>
                          );
                        }
                        return null;
                      })
                    ) : (
                      <div>
                        {record.DocumentUpload.length !== 0
                          ? "Document uploaded"
                          : ""}
                      </div>
                    )}
                  </h5>
                  <h5 className="body">
                      <img
                        src={DeleteIcon}
                        alt="delete"
                        onClick={() => deleteNonMandatoryDocs(record)}
                      />
                    </h5>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        ""
      )}
    </div>
    }
  ]
  return (
    <Card className="kycContainer">
      
      <Row gutter={24}>
        <Col span={20}>
          <h3>KYC Details </h3>
        </Col>
      </Row>
      <Tabs defaultActiveKey="1" onChange={callback} activeKey={tabValue} items={items}/>
    </Card>
  );
};
export default KycDetails;
