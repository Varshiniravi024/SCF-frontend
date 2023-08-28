import { Select } from "antd";

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
    available: 4000,
    utilized: 2400,
    amt: 2400
  },
  {
    name: "Page B",
    available: 3000,
    utilized: 1398,
    amt: 2210
  },
  {
    name: "Page C",
    available: 2000,
    utilized: 9800,
    amt: 2290
  },
  {
    name: "Page D",
    available: 2780,
    utilized: 3908,
    amt: 2000
  },
  {
    name: "Page E",
    available: 1890,
    utilized: 4800,
    amt: 2181
  },
  {
    name: "Page F",
    available: 2390,
    utilized: 3800,
    amt: 2500
  },
  {
    name: "Page G",
    available: 3490,
    utilized: 4300,
    amt: 2100
  }
];

export default function App() {
  const { Option } = Select;
  const onChangeDropDown = (value: any) => {
  };
  return (
    <div>
      <h2>Limit Availablity</h2>
      <Select
        placeholder="Select a person"
        optionFilterProp="children"
        onChange={onChangeDropDown}
      >
        <Option value="Next 7 days">Next 7 days</Option>
        <Option value="Next 1 Month">Next 1 Month</Option>
        <Option value="Next 3 Months">Next 3 Months</Option>
      </Select>
      <BarChart
        width={500}
        height={300}
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
        
      >
        <XAxis dataKey="name" />
        <YAxis />
        <Legend />
        <Bar dataKey="utilized" stackId="a" fill="#0F7E8B" />
        <Bar dataKey="available" stackId="a" fill="#FF8368" />
      </BarChart>
    </div>
  );
}
