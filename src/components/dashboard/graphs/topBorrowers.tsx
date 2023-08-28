import React, { useState,useEffect } from "react";
import { Radio, Table, Select, Spin } from "antd";

const TopBorrowers = ({topBorrowersData}:any) => {
  const [value, setValue] = React.useState("turnover");
  const [filter, setFilter] = React.useState("Last 1 month");
  const [dataSource, setDataSource] = useState(topBorrowersData? topBorrowersData?.last_1_month :[]);
  const [ loading,setLoading]=useState(true)
  useEffect(() => {
    setTimeout(()=>{
      setLoading(false)

    },1000)
    setDataSource(topBorrowersData?.last_1_month)

  },[])
  const onChange = (e: any) => {
    setValue(e.target.value);
    
  };
  const columns = [
    {
      title: "customerName",
      dataIndex: "customer_name",
    },
    {
      title: value,
      dataIndex: value,
    },
  ];
  const { Option } = Select;
  const onChangeDropDown = (value: any) => {
    setFilter(value)
    if(value === "Last 3 months"){
      setDataSource(topBorrowersData?.last_3_month)
    }else if(value === "Last 1 month"){
      setDataSource(topBorrowersData?.last_1_month)
    }
  };
  return (
    <div style={{ padding: "24px" }}>
      <div>
        <h2>Top Borrowers</h2>
        <Select
          placeholder="Select a person"
          optionFilterProp="children"
          onChange={onChangeDropDown}
          style={{ width: "35%", float: "right"}}
          defaultValue={"Last 1 month"}
        >
          <Option value="Last 1 month">Last 1 month</Option>
          <Option value="Last 3 months">Last 3 months</Option>
        </Select>
      </div>
      <Radio.Group onChange={onChange} value={value}>
        <Radio value={"turnover"}>Turnover</Radio>
        <Radio value={"revenue"}>Revenue</Radio>
      </Radio.Group>
      <div className='containerTable'>
        <div className="OuterDiv">
        <div className='HeadInnerDiv'>
                <h1 className='head' style={{whiteSpace:"nowrap"}}>Customer Name</h1>
                <h1 className='head'>{value === "revenue" ?"Revenue (Amt)": "Turnover (Amt)"} </h1>
                </div>
        </div>
        {loading ? <Spin /> : 
        <div className='OuterDiv' style={
          {overflow:"scroll",height:"19vh",justifyContent:"unset",paddingBottom:"23px"}
          }>
          {dataSource !== undefined? 
          dataSource?.map((record:any,index:number)=>{
            return(
              <div key={index} 
              className={'InnerDiv'} style={{cursor:"default",}}>
                <h5 className='body'>  {record.customer_name}  </h5>
                    <h5 className='body'> {value==="revenue" ? record?.revenue : record?.turnover}
                     </h5>
                    </div>
            )
          })

          : topBorrowersData?.length !== 0 ? topBorrowersData?.last_1_month?.map((record:any,index:number)=>{
            return(
              <div key={index} 
              className={'InnerDiv'} style={{cursor:"default",}}>
                <h5 className='body'>  {record.customer_name}  </h5>
                    <h5 className='body'> {value==="revenue" ? record?.revenue : record?.turnover}
                     </h5>
                    </div>
            )
          })
:[]
          }
          
        </div>
}
        </div>
    </div>
  );
};

export default TopBorrowers;
