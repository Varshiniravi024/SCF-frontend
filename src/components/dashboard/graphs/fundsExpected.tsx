import moment from 'moment';
import { BarChart, Bar, XAxis, YAxis,Tooltip } from "recharts";

export default function FundsExpected({ fundsExpected }: any) {
  const dateFormat = (tickItem: any) => {
    return moment(tickItem).format("DD/MM")
  }
  return (
    <div style={{ padding: "24px" }}>
      <div>
        <h2>Funds Expected</h2>
      </div>
      {fundsExpected?.length > 0 ?
      <BarChart width={500} height={290} data={fundsExpected} style={{ strokeWidth: 1 }}
        margin={{ top: 5, right: 30, left: 20, bottom: 5  }} >
        <XAxis dataKey="due_date"
          label={{ value: 'Date', position: 'insideBottom', offset: 0, fontFamily: "Poppins", padding: '10px' }} axisLine={{ stroke: '#E3E3E3' }} tickFormatter={dateFormat} />
        <YAxis scale="auto"
          tickFormatter={(tick) => {
            if (tick >= 1000 && tick < 1000000) return ((tick / 1000) + 'K')
            else if (tick >= 1000000) return ((tick / 1000000) + 'M');
            else return tick;
          }} dx={-5 }
          axisLine={{ stroke: '#E3E3E3' }} label={{ value: 'Amount (INR)', angle: -90, position: 'insideLeft', fontFamily: "Poppins" }} tickCount={6} tick={true} />
        <Bar dataKey="amount" fill="#ff8368" barSize={15} />
        <Tooltip cursor={{fill: 'transparent'}} />
      </BarChart>
      :<div style={{margin:"auto",fontSize:"20px",textAlign:"center",alignContent:"center",marginTop:"20%"}}>No Data</div>}
    </div>
  );
}
