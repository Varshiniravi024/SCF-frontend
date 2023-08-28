import React, { useState, useEffect } from "react";
import { Radio, Table, Spin } from "antd";
import moment from "moment"
const LimitUtilization = ({ limitUtilizationData }: any) => {
  const [value, setValue] = React.useState("High");
  const [loading, setLoading] = useState(true)
  const [dataSource, setDataSource] = useState(limitUtilizationData ? limitUtilizationData?.High : [] as any);
  useEffect(() => {
    setDataSource(limitUtilizationData?.High)
    setTimeout(() => {
      setLoading(false)

    }, 1000)
  }, [])
  const onChange = (e: any) => {
    setValue(e.target.value);
    if (e.target.value === "Low") {
      setDataSource(limitUtilizationData?.Low)
    } else if (e.target.value === "Rare") {
      setDataSource(limitUtilizationData?.Rare)
    } else if (e.target.value === "Nil") {
      setDataSource(limitUtilizationData?.Nil !== "None" ? limitUtilizationData?.Nil : [])
    } else if (e.target.value === "High") {
      setDataSource(limitUtilizationData?.High)
    }

  };
  const columns = [
    {
      title: "Customer",
      dataIndex: "customer",
    },
    {
      title: "Limit Amount",
      dataIndex: "limitAmount",
    },
    {
      title: (
        <div>
          Utilization % <div>{value}</div>
        </div>
      ),
      dataIndex: value,
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <h2>Limit Utilization</h2>
      <Radio.Group onChange={onChange} value={value}>
        <Radio value={"High"}>High Utilization</Radio>
        <Radio value={"Low"}>Low Utilization</Radio>
        <Radio value={"Rare"}>Rare Utilization</Radio>
        <Radio value={"Nil"}>Nil</Radio>
      </Radio.Group>

      <div className='containerTable'>
        <div className="OuterDiv">
          <div className='HeadInnerDiv'>
            <h1 className='head'>Buyer-Seller</h1>
            <h1 className='head' >Limit Amount (INR)</h1>
            <h1 className='head'> Utilization %
            </h1>
            {value !== "Rare" ? "" : <h1 className='head'>Last Utilization Date</h1>}
          </div>
        </div>
        {loading ? <Spin /> :
          <div className='OuterDiv'
            style={{
              overflow: "scroll", height: "19vh",
              paddingBottom: "23px", justifyContent: "unset"
            }}
          >
            {dataSource ?
              dataSource?.map((record: any, index: number) => {
                return (
                  <div key={index}
                    className={'InnerDiv'}
                    style={{ cursor: "default" }}
                  >
                    <h5 className='body' style={{ whiteSpace: "nowrap" }}>  {record?.anchor_party__name} - {record?.counter_party__name}  </h5>
                    <h5 className='body'>  {record?.max_limit_amount}  </h5>
                    <h5 className='body'> {record?.utilization_percent}
                    </h5>
                    {value !== "Rare" ? "" : <h5 className='body' style={{ whiteSpace: "nowrap" }}>  {record?.last_utilization_date !== null ? moment(record.last_utilization_date).format("DD-MM-YYYY") : "-"}  </h5>}
                  </div>
                )
              })
              :
              limitUtilizationData ?
                limitUtilizationData?.High?.map((record: any, index: number) => {
                  return (
                    <div key={index}
                      className={'InnerDiv'}
                      style={{ cursor: "default" }}
                    >
                      <h5 className='body' style={{ whiteSpace: "nowrap" }}>  {record?.anchor_party__name} - {record?.counterparty_id__name}  </h5>
                      <h5 className='body'>  {record?.max_limit_amount}  </h5>
                      <h5 className='body'> {record?.utilization_percent}
                      </h5>
                      {value !== "Rare" ? "" : <h5 className='body' style={{ whiteSpace: "nowrap" }}>  {record?.last_utilization_date !== null ? moment(record.last_utilization_date).format("DD-MM-YYYY") : "-"}  </h5>}
                    </div>
                  )
                })
                : <div></div>



            }

          </div>
        }
      </div>

    </div>
  );
};

export default LimitUtilization;
