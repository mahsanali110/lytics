import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend
} from "recharts";
import './Bargraph.scss';

const data = [
  {
    name: "Economy",
    uv: 4000,
    percentage: 2400,
    amt: 2400
  },
  {
    name: "Health",
    uv: 3000,
    percentage: 1398,
    amt: 2210
  },
  {
    name: "Elections",
    uv: 2000,
    percentage: 9800,
    amt: 2290
  },
  {
    name: "Crime",
    uv: 2780,
    percentage: 3908,
    amt: 2000
  },
  {
    name: "National Security",
    uv: 1890,
    percentage: 4800,
    amt: 2181
  },
];

export default function BarGraph() {
  return (
    <BarChart
      width={350}
      height={240}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5
      }}
      barSize={12}
      layout="vertical" // Specify horizontal layout
    >
      {/* Switch XAxis and YAxis */}
      <XAxis type="number" dataKey="percentage" />
      <YAxis
        dataKey="name"
        type="category"
      
        axisLine={false}
        dx={-15}
        // scale="point"
        // padding={{ top: 10, bottom: 10 }}
      />

      <Tooltip />
      <Legend />
      {/* <CartesianGrid strokeDasharray="10" /> */}
      {/* Switch dataKey to "name" for horizontal bars */}
      <Bar dataKey="percentage" fill="#6692FF" />
  {/* <Bar dataKey="uv" fill="#82ca9d" /> */}
    </BarChart>
  );
}
