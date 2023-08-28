import React, { useState } from "react";
import { Select } from 'antd';
import { BarChart, Bar, XAxis, YAxis, Legend,Tooltip } from "recharts";
import moment from "moment";

export default function TurnoverAndRevenue({ monthlyTurnoverRevenue }: any) {
  const { Option } = Select;
  const [datasource, setDatasource] = useState(monthlyTurnoverRevenue ? monthlyTurnoverRevenue?.less_than_3_months : []);

  const onChangeDropDown = (value: any) => {
    if (value === "last_1_year") {
      setDatasource(monthlyTurnoverRevenue?.last_1_year)
    } else if (value === "less_than_6_months") {
      setDatasource(monthlyTurnoverRevenue?.less_than_6_months)
    } else {
      setDatasource(monthlyTurnoverRevenue?.less_than_3_months)
    }
  }
  
  const dateFormat = (tickItem: any) => {
    return moment(tickItem).format("MMM'YY")
  }
  return (
    <div style={{ padding: "24px" }} className="MonthlyTurnoverContainer">
      <h2>Monthly Turnover and Revenue</h2>
      <Select placeholder="Select a person"
        optionFilterProp="children" onChange={onChangeDropDown} style={{ width: "35%", float: "right", marginTop: "-40px" }} defaultValue="less_than_3_months" >
        <Option value="less_than_3_months">Last 3 Months</Option>
        <Option value="less_than_6_months">Last 6 Months</Option>
        <Option value="last_1_year">Last 1 year</Option>
      </Select>
      {monthlyTurnoverRevenue?.less_than_3_months?.length > 0 ?
      <BarChart width={500} height={300} data={datasource ? datasource : monthlyTurnoverRevenue?.less_than_3_months}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }} >
        <Bar dataKey="turnover" fill="#0F7E8B" />
        <Bar dataKey="revenue" fill="#ff8368" />
        <XAxis dataKey="month-in-year" label={{ value: 'Date', position: 'insideBottom', offset: 0, fontFamily: "Poppins", padding: '10px' }}
          axisLine={{ stroke: '#E3E3E3' }} tickFormatter={dateFormat} />
        <YAxis label={{ value: 'Amount (INR)', angle: -90, position: 'insideLeft', fontFamily: "Poppins" }}
          axisLine={{ stroke: '#E3E3E3' }}  tickFormatter={(tick) => {
            if (tick >= 1000 && tick < 1000000) return ((tick / 1000) + 'K')
            else if (tick >= 1000000) return ((tick / 1000000) + 'M');
            else return tick;
          }} />
          <Tooltip cursor={{fill: 'transparent'}} />
        <Legend verticalAlign="top" />
      </BarChart>
      :<div style={{margin:"auto",fontSize:"20px",textAlign:"center",alignContent:"center",marginTop:"20%"}}>No Data</div>}
    </div>
  );
}
