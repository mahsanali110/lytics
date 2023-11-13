import React from "react";
import { PieChart, Pie, Cell } from "recharts";

const data02 = [
  { name: "Economy", value: 100 },
  { name: "Health", value: 300 },
  { name: "Elections", value: 100 },
  { name: "Crime", value: 80 },
  { name: "National Security", value: 40 }
];

const yellowColor = "#FFFF00"; // Yellow color


export default function LivePieChart() {
  return (
    <PieChart width={400} height={400}>
        <Pie
        data={data02}
        dataKey="value"
        cx={150}
        cy={100}
        innerRadius={50}
        outerRadius={63}
        fill={yellowColor}
        // label
        label={(entry) => entry.name}
        labelLine={false}
      >
        {data02.map((entry, index) => (
          <Cell key={`cell-${index}`} fill={'#6692FF'} stroke={'none'} strokeWidth={45} />
        ))}
      </Pie>
    </PieChart>
  );
}
