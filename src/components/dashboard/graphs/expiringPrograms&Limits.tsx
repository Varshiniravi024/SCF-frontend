import React, { useState,useEffect } from 'react';
import { Select,Spin } from 'antd';
import moment from "moment"
const ExpiringProgramsAndLimits =({expiringPrograms}:any) => {
    const [value, setValue] = React.useState("Next_1_month");
  const [ loading,setLoading]=useState(true)

    const { Option } = Select;

const onChangeDropDown=(value:any)=> {
  setValue(value)
  if(value === "Next_3_months"){
    setDataSource(expiringPrograms?.Next_3_months)
  }else if(value === "Next_2_months"){
    setDataSource(expiringPrograms?.Next_2_months)
  } else if(value === "Next_1_month"){
    setDataSource(expiringPrograms?.Next_1_month)
  }
  
}
    const [dataSource,setDataSource] = useState(expiringPrograms? expiringPrograms?.Next_1_month : [])
      const columns = [
          {
              title:"Customer",
              dataIndex:"customer"
          },
          {
            title:"Program",
            dataIndex:"program"
        },
        {
            title:"Limit",
            dataIndex:"limit"
        },
          {
            title:"Expiry",
            dataIndex:"expiry"
          }
      ]
      useEffect(()=>{
setDataSource(expiringPrograms?.Next_1_month)
setTimeout(()=>{
  setLoading(false)

},1000)
      },[])
    return(
        <div style={{ padding: "24px" }}>
          <h2>Expiring Programs/Limits</h2>
            <Select
    placeholder="Select a person"
    optionFilterProp="children"
    onChange={onChangeDropDown}
    style={{width:"35%",float:"right",marginTop:"-50px"}}
    defaultValue={"Next_1_month"}
  >
    <Option value="Next_1_month">Next 1 Month</Option>
    <Option value="Next_2_months">Next 2 Months</Option>
    <Option value="Next_3_months">Next 3 Months</Option>
  </Select>
            
    {/* <Table
    dataSource={dataSource}
    columns={columns}
    pagination={false}
    rowKey={(record: any, index: any) => index}
    /> */}
    <div className='containerTable'>
        <div className="OuterDiv">
        <div className='HeadInnerDiv'>
                <h1 className='head'>Customer</h1>
                <h1 className='head'>Program Name</h1>
                <h1 className='head'> Limit Amount
                </h1>
                <h1 className='head'>Expiry Date</h1>
                </div>
        </div>
        {loading ? <Spin /> :
        <div className='OuterDiv' 
        style={{overflow:"scroll",height:"19vh",
        paddingBottom:"23px"
        ,justifyContent:"unset"
      }} >
        {dataSource ?
          dataSource?.map((record:any,index:number)=>{
            return(
              <div key={index} 
              className={'InnerDiv'} 
              style={{cursor:"default"}}
              >
                <h5 className='body'>  {record?.party__name}  </h5>
                <h5 className='body'>  {record?.program_type}  </h5>
                <h5 className='body'> {record?.max_limit_amount}
                 </h5>
                <h5 className='body' style={{whiteSpace:"nowrap"}}>  {record?.expiry_date !== null ? moment(record.expiry_date).format("DD-MM-YYYY"): "-"}  </h5>
                    </div>
            )
          }):
          expiringPrograms? 
          expiringPrograms?.Next_1_month?.map((record:any,index:number)=>{
            return(
              <div key={index} 
              className={'InnerDiv'} 
              style={{cursor:"default"}}
              >
                <h5 className='body'>  {record?.party__name}  </h5>
                <h5 className='body'>  {record?.program_type}  </h5>
                <h5 className='body'> {record?.max_limit_amount} 
                 </h5>
                <h5 className='body' style={{whiteSpace:"nowrap"}}>  {record?.expiry_date !== null ? moment(record.expiry_date).format("DD-MM-YYYY"): "-"}  </h5>
                   
                    </div>
            )
          })
          :null}
      </div>
}
      </div>
        </div>
    )
}

export default ExpiringProgramsAndLimits;