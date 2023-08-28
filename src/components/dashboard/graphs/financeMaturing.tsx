import { useState } from "react";
import { Select, Spin } from 'antd';
import moment from 'moment';
import { BarChart, Bar, XAxis, YAxis,Tooltip } from "recharts";

const CustomizedAxisTick = (props:any)=>{
  const { x, y, stroke, payload } = props;
  return (
    <g transform={`translate(${x},${y})`} >
      <text x={35} y={1} dy={16} textAnchor="end" fill="#666" transform="rotate(10)" style={{marginLeft:"10px"}}>
        {moment(payload.value).format("DD/MM")}        
      </text>
    </g>
  )
}

export default function FinanceMaturing({ financeMaturingDetails }: any) {
  const { Option } = Select;
  const [isLoading, setIsLoading] = useState(false)
  const [datasource, setDatasource] = useState(financeMaturingDetails ? financeMaturingDetails?.DEFAULT : [])

  const onChangeDropDown = (value: any) => {
    if (value === "Next 1 Month") {
      setDatasource(financeMaturingDetails?.NEXT_1_MONTH)
    } else if (value === "Next 7 days") {
      setDatasource(financeMaturingDetails?.NEXT_7_DAYS)
    } else {
      setDatasource(financeMaturingDetails?.DEFAULT)

    }
  }

  const dateFormat = (tickItem: any) => {
    return moment(tickItem).format("DD/MM")
  }
  return isLoading ? <Spin /> : (
    <div style={{ padding: "24px" }}>
      <div>
        <h2>Finances Maturing</h2>
        <Select placeholder="Select" optionFilterProp="children"
          onChange={onChangeDropDown} style={{ width: "35%", marginTop: "-40px" , float: "right" }} defaultValue="Default" >
          <Option value="Default">Overdue</Option>
          <Option value="Next 7 days">Next 7 days</Option>
          <Option value="Next 1 Month">Next 1 Month</Option>
        </Select>
      </div>
      {datasource?.length > 0 || financeMaturingDetails?.DEFAULT?.length >0 ?
      <BarChart width={500} height={290} data={datasource ? datasource : financeMaturingDetails?.DEFAULT} style={{ strokeWidth: 1 }}
        margin={{ top: 5, right: 30, left: 20, bottom: 5  }} >
        <XAxis dataKey="due_date" interval={0} style={{marginTop:"10px",zIndex:1}}
          label={{ value: 'Due Date', position: 'bottom', offset: 0, fontFamily: "Poppins", padding: '10px'}}  axisLine={{ stroke: '#E3E3E3' }} tickFormatter={dateFormat} tick={<CustomizedAxisTick/>} />
        <YAxis scale="auto"
          tickFormatter={(tick) => {
            if (tick >= 1000 && tick < 1000000) return ((tick / 1000) + 'K')
            else if (tick >= 1000000) return ((tick / 1000000) + 'M');
            else return tick;
          }} dx={-5 }
          axisLine={{ stroke: '#E3E3E3' }} label={{ value: 'Amount (INR)', angle: -90, position: 'insideLeft', fontFamily: "Poppins" }} tickCount={6} tick={true} />
        <Bar dataKey="finance_amount" fill="#ff8368" barSize={15}/>
        <Tooltip cursor={{fill: 'transparent'}} />
      </BarChart>
      :<div style={{margin:"auto",fontSize:"20px",textAlign:"center",alignContent:"center",marginTop:"20%"}}>No Data</div>}
    </div>

  );
}
