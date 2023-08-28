import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

export default function FinanceAnalysis({ financeAgeing }: any) {
  const data = [
    { name: "<30 days", value: financeAgeing?.less_than_30 !== null ? financeAgeing?.less_than_30 : 0 },
    { name: "30-60 days", value: financeAgeing?.from_30_to_60 !== null ? financeAgeing?.from_30_to_60 : 0 },
    { name: "60-90 days", value: financeAgeing?.from_60_to_90 !== null ? financeAgeing?.from_60_to_90 : 0 },
    { name: ">90 days", value: financeAgeing?.greater_than_90 !== null ? financeAgeing?.greater_than_90 : 0 },
  ];
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="black" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <div style={{ padding: "24px" }} className="financeAgeingContainer">
      <h2>Finance Ageing Analysis</h2>
      {data ?
        <PieChart width={800} height={400}>
          <Legend layout="vertical" verticalAlign="middle" align="center" />

          <Pie
            data={data}
            cx={120}
            cy={200}
            innerRadius={60}
            outerRadius={80}
            labelLine={false}
            label={renderCustomizedLabel}
            fill="#8884d8"
            paddingAngle={1}
            dataKey="value"
          >

            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
        </PieChart>
        : <div style={{ margin: "auto", fontSize: "20px", textAlign: "center", alignContent: "center", marginTop: "20%" }}>No Data</div>}
    </div>
  );
}
