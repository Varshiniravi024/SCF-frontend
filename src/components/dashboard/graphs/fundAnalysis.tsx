import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Legend,
} from "recharts";

const data = [
  {
    name: "Sep",
    COF: 10,
    "SCF Interest Revenue": 10,
    amt: 1020,
  },
  {
    name: "Oct",
    COF: 3000,
    "SCF Interest Revenue": 1398,
    amt: 2210,
  },
  {
    name: "Nov",
    COF: 2000,
    "SCF Interest Revenue": 9800,
    amt: 2290,
  },
  {
    name: "Dec",
    COF: 2780,
    "SCF Interest Revenue": 3908,
    amt: 2000,
  },
  {
    name: "Jan",
    COF: 1890,
    "SCF Interest Revenue": 4800,
    amt: 2181,
  },
];

export default function App() {
  return (
    <LineChart
      width={500}
      height={300}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <XAxis
        dataKey="name"
        label={{ value: "Month", position: "insideBottom", offset: 0 }}
      />
      <YAxis label={{ value: "Amount (INR)", angle: -90, position: "insideLeft" }} />
      <Legend verticalAlign="top"/>
      <Line
        type="monotone"
        dataKey="SCF Interest Revenue"
        stroke="#0F7E8B"
        activeDot={{ r: 8 }}
        strokeWidth={2}
      />
      <Line
        type="monotone"
        dataKey="COF"
        strokeWidth={2}
        stroke="
        #FD6D47"
      />
    </LineChart>
  );
}
