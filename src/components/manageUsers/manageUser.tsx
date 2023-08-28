import React, { useEffect, useState } from 'react';
import { Table, Select, Input, InputNumber, Popconfirm, Form, Typography, Button, Spin, Tooltip, message } from 'antd';
import httpClient from "../../utils/config/core/httpClient"
import baseurl from "../../utils/config/url/base"
import images from "../../assets/images";
import { ErrorMessage } from '../../utils/enum/messageChoices';
import { ResponseStatus } from '../../utils/enum/choices';
import Heading from '../common/heading/heading';

interface Item {
  key: string;
  name: string;
  age: number;
  address: string;
  phone: string;
  email: string;
  display_name: string;
  party: any;
  is_active: any;
  first_name: any;
  id: any;
}
interface DataType {
  key: React.Key;
  name: string;
  age: string;
  address: string;
}
interface EditableTableState {
  dataSource: DataType[];
  count: number;
}
const originData: Item[] = [];
interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: Item;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;
  const emailFormat = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
  const mobileFormat = /^[1-9]{1}[0-9]{9}$/

  const format = title === "Email Id" ? emailFormat :
    title === "Mobile Number" ?
      mobileFormat
      : /^[a-z,A-Z].{0,24}$/
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              pattern: format,
              required: true,
              message: `Please Input ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const EditableTable = () => {
  const { Edit_Icon, Close_Icon, Correct_Icon, DeleteIcon } = images;
  const { Option } = Select;

  const [form] = Form.useForm();
  const [data, setData] = useState(originData);
  const [editingKey, setEditingKey] = useState('' as any);
  const [dataSource, setDataSource] = useState([] as any);
  const [disableAddRow, setDisbleAddRow] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [status, SetStatus] = useState("");
  const [type, SetType] = useState("");
  const [onclickEditBtn, setOnclickEditbtn] = useState(false)
  const isEditing = (record: Item) => record.id === editingKey;

  const edit = (record: Partial<Item> & { key: React.Key }) => {
    form.setFieldsValue({ name: '', age: '', address: '', ...record });
    setEditingKey(record.id);
    setOnclickEditbtn(true)
  };

  const deleteUser = (record: any) => {
    httpClient
      .getInstance()
      .delete(`${baseurl}api-auth/user/${record.id}/`)
      .then((resp: any) => {
        setIsLoading(true)
        user();
        message.success(ErrorMessage.UDS)
      })
      .catch((err) => {
        user()
        setDisbleAddRow(false)
      })
  }
  const onCancel = () => {
    setDisbleAddRow(false)
  }
  const onOk = () => {
    if (onclickEditBtn === true) {
      setEditingKey('');
      setOnclickEditbtn(false)
      setIsLoading(true)
      user();
      setDisbleAddRow(false)
      form.resetFields();
    } else {
      setEditingKey('');
      setOnclickEditbtn(false)
      setIsLoading(true)
      form.resetFields();
      httpClient
        .getInstance()
        .delete(`${baseurl}api-auth/user/${editingKey}/`)
        .then((resp: any) => {
          form.resetFields();
          setIsLoading(true)
          user()
        })
        .catch((err) => {
          user()
          setDisbleAddRow(false)
        })
    }

    setTimeout(() => {
      setIsLoading(false)
      form.resetFields();
    }, 2000);
  };
  useEffect(() => {
    httpClient
      .getInstance()
      .get(`${baseurl}api-auth/user/`)
      .then((resp: any) => {
        setDataSource(resp.data.data);
        setIsLoading(false)
      });
  }, []);

  const save = async (datas: any) => {
    try {
      const row = (await form.validateFields()) as Item;

      const newData = [...data];
      const index = newData.findIndex(item => datas.key === item.key);
      setDisbleAddRow(false)
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        setData(newData);
        setEditingKey('');
      }
      newData.push(row);
      setData(newData);
      setEditingKey('');

      if (disableAddRow === true) {
        const body = {
          phone: row.phone,
          email: row.email,
          first_name: "null",
          last_name: "null",
          display_name: row.display_name,
          party: localStorage.getItem("party_id"),
          is_active: status
            ? status !== "InActive"
              ? true
              : false : false,
          administrator: type === "Admin" ? true : false,
          supervisor: type === "Supervisor" ? true : false,
        };
        httpClient
          .getInstance()
          .post(`${baseurl}api-auth/user/signup/`, body)
          .then((resp: any) => {
            if (resp.data.status === ResponseStatus.SUCCESS) {
              setIsLoading(true)
              form.resetFields();
              user()
            } else {
              setIsLoading(false)
              message.error(ErrorMessage.PUDE)
            }
          }).catch((err: any) => {
            message.error(ErrorMessage.UNF)
            setIsLoading(false)
          })
      } else {
        const body = {
          phone: row.phone,
          email: row.email,
          first_name: "null",
          last_name: "null",
          display_name: row.display_name,
          party: localStorage.getItem("party_id"),
          is_active: status
            ? status !== "InActive"
              ? true
              : false : false,
          is_administrator: type === "Admin" ? true : false,
          is_supervisor: type === "Supervisor" ? true : false,
        };
        httpClient
          .getInstance()
          .put(`${baseurl}api-auth/user/${editingKey}/`, body)
          .then((resp: any) => {
            form.resetFields();
            user()
            if (resp.data.status === ResponseStatus.SUCCESS) {
              setIsLoading(true)
              user()
            } else {
              setIsLoading(false)
              message.error(ErrorMessage.PUDE)
            }

          });
      }

    } catch (errInfo) {
      console.log(errInfo)
    }
  };
  const user = () => {
    setIsLoading(true)
    httpClient
      .getInstance()
      .get(`${baseurl}api-auth/user/`)
      .then((resp: any) => {
        setDataSource(resp.data.data);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000)
        setIsLoading(false)
      });
  }
  const handleAdd = () => {
    setIsLoading(true)
    setDisbleAddRow(true)

    const newDatas: DataType = {
      key: "",
      display_name: "",
      email: "",
      phone: "",
      is_active: "",
      id: "",
    } as any;
    setDataSource(dataSource.concat(newDatas))
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  };


  const columns = [
    {
      title: 'User Name',
      dataIndex: 'display_name',
      width: '20%',
      editable: true,
      id: "userName"
    },
    {
      title: 'Email Id',
      dataIndex: 'email',
      width: '20%',
      editable: true,
      id: "userEmail"
    },
    {
      title: 'Mobile Number',
      dataIndex: 'phone',
      width: '20%',
      editable: true,
      id: "userMobileNumber"
    },
    {
      title: 'Type',
      width: '15%',
      render: (data: any, record: any, index: any) => {
        const editable = isEditing(record);
        return (
          <div id={`userType${index}`} key={index}>
            {editable ? (
              <Select
                onChange={(e) => { SetType(e) }}
                defaultValue={
                  record.is_supervisor === true
                    ? "Supervisor"
                    : record.is_administrator === true
                      ? "Admin"
                      : "-"
                }
                style={{ width: 100, marginTop: "6px" }}
              >
                <Option value="Supervisor" id="Supervisor">
                  Supervisor
                </Option>
                <Option value="Admin" id="Admin">
                  Admin
                </Option>
              </Select>
            ) : (
              <div key={index}>
                {record.is_supervisor === true
                  ? "Supervisor"
                  : record.is_administrator === true
                    ? "Admin"
                    : "-"}
              </div>
            )}
          </div>

        )
      },
    },
    {
      title: 'Status',
      dataIndex: 'is_active',
      width: '15%',
      render: (data: any, record: any, index: any) => {
        const editable = isEditing(record);
        return (
          <div id={`userStatus${index}`} key={index}>
            {editable ? (
              <Select
                style={{ width: 100, marginTop: "6px" }}
                defaultValue={record.is_active === false ? "Inactive" : "Active"}
                onChange={(e) => SetStatus(e)}
              >
                <Option value="true" id="Active">
                  Active
                </Option>
                <Option value="InActive" id="InActive">
                  InActive
                </Option>
              </Select>
            ) : (
              <div key={index}>{record.is_active !== true ? "Inactive" : "Active"}</div>
            )}
          </div>
        )
      },
    },
    {
      title: ' ',
      dataIndex: 'operation',
      render: (_: any, record: Item) => {
        const editable = isEditing(record);
        return editable ? (
          <span style={{ display: "flex" }}>
            <Typography.Link onClick={() => save(record)} style={{ marginRight: 8 }}>
              <Tooltip title="Save">
                <img
                  src={Correct_Icon}
                  alt="save"
                  style={{ marginRight: "20px" }}
                  id="userSave"
                />
              </Tooltip>
            </Typography.Link>
            <Popconfirm title="Sure to cancel?" onConfirm={onOk} onCancel={onCancel}>
              <Tooltip title="Cancel"> <img src={Close_Icon} alt="InboxClose" id="userCancel" />
              </Tooltip>
            </Popconfirm>
          </span>
        ) : (
          <div style={{ display: "flex" }}>
            <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
              <Tooltip title="Edit">
                <img
                  src={Edit_Icon}
                  alt="edit"
                  style={{ marginRight: "20px" }}
                  id="userEdit"
                />
              </Tooltip>

            </Typography.Link>
            <Typography.Link onClick={() => deleteUser(record)}>

              <Tooltip title="Delete" >
                <img
                  src={DeleteIcon}
                  alt="delete"
                  style={{ marginRight: "20px" }}
                  id="userDelete"
                />
              </Tooltip>
            </Typography.Link>
          </div>
        );
      },
    },
  ];

  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Item) => ({
        record,
        inputType: col.dataIndex === 'age' ? 'number' : 'text',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });

  return (
    isLoading ? <Spin /> :
      <React.Fragment>
        <div className="fixedContainer">
          <Heading flag="manageUsers" text="Manage Users" subText="" />
        </div>
        <div className='mainContentContainer'>
          <Form form={form} component={false} >

            <Table

              // style={{paddingTop:"45px"}}
              components={{
                body: {
                  cell: EditableCell,
                },
              }}
              bordered
              dataSource={dataSource}
              columns={mergedColumns}
              rowClassName="editable-row"
              pagination={false}
              rowKey={(record: any, index: any) => index}
            />
            <Button onClick={handleAdd} type="primary" style={{ backgroundColor: "#FFB800", marginTop: 16, borderColor: "#FFB800" }} disabled={disableAddRow} id="addUser">
              +
            </Button>
          </Form>
        </div>
      </React.Fragment>

  );
};

export default () => <EditableTable />;