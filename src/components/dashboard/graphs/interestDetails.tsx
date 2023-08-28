import { Select } from 'antd';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend
} from "recharts";

const data = [
  {
    name: "Page A",
    "Market Interest": 4000,
    "SCF Interest": 2400,
    amt: 2400
  },
  {
    name: "Page B",
    "Market Interest": 3000,
    "SCF Interest": 1398,
    amt: 2210
  },
  {
    name: "Page C",
    "Market Interest": 2000,
    "SCF Interest": 9800,
    amt: 2290
  },
  {
    name: "Page D",
    "Market Interest": 2780,
    "SCF Interest": 3908,
    amt: 2000
  },
  {
    name: "Page E",
    "Market Interest": 1890,
    "SCF Interest": 4800,
    amt: 2181
  },
  {
    name: "Page F",
    "Market Interest": 2390,
    "SCF Interest": 3800,
    amt: 2500
  },
  {
    name: "Page G",
    "Market Interest": 3490,
    "SCF Interest": 4300,
    amt: 2100
  }
];

export default function App() {
  const { Option } = Select;
  const onChangeDropDown = (value: any) => {
  }
  return (
    <div>
      <h2>Interest Details</h2>
      <Select
        placeholder="Select a person"
        optionFilterProp="children"
        onChange={onChangeDropDown}
        style={{ width: "35%", float: "right" }}
      >
        <Option value="Last 1 week">Last 1 week</Option>
        <Option value="Last 1 month">Last 1 month</Option>
        <Option value="Last 3 Months">Last 3 Months</Option>
        <Option value="Last 6 months">Last 6 months</Option>
      </Select>
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <XAxis dataKey="name" />
        <YAxis />
        <Legend />
        <Bar dataKey="SCF Interest" fill="#8884d8" />
        <Bar dataKey="Market Interest" fill="#82ca9d" />
      </BarChart>
    </div>

  );
}
