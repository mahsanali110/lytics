import React from 'react';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList,
} from 'recharts';

import './ChannelAnalyticsGraph.scss';

function ChannelAnalyticsGraph({ graphRef, data }) {
  const renderCustomizedLabel = props => {
    const { x, y, width, height, value } = props;

    return (
      <text x={x + width / 2} y={y + height / 2} fill="white" textAnchor="middle" dy=".3em">
        {value}
      </text>
    );
  };

  const truncateString = str => str.slice(0, 7);

  return (
    <ResponsiveContainer width={800} height={350} className={'invisible-chart'}>
      <BarChart
        width={800}
        height={350}
        ref={graphRef}
        data={data}
        margin={{
          top: 20,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis fontSize={15} dataKey={({ channel }) => truncateString(channel)} />
        <YAxis
          fontSize={15}
          label={{ value: 'No. of Jobs', angle: -90, position: 'insideLeft', textAnchor: 'middle' }}
        />
        <Tooltip />
        <Legend
          className="graph-legend"
          align="center"
          style={{ display: 'flex', justifyContent: 'center' }}
        />
        {/* <Legend payload={[{ value: 'Channels', type: 'line', id: 'ID01' }]} /> */}
        <Bar barSize={50} dataKey="Tv" stackId="a" fill="#b02c79">
          <LabelList dataKey="Tv" content={renderCustomizedLabel} />
        </Bar>
        <Bar barSize={50} dataKey="Online" stackId="a" fill="#562294">
          <LabelList dataKey="Online" content={renderCustomizedLabel} />
        </Bar>
        <Bar barSize={50} dataKey="Print" stackId="a" fill="#0c6c7c">
          <LabelList dataKey="Print" content={renderCustomizedLabel} />
        </Bar>
        <Bar barSize={50} dataKey="Web" stackId="a" fill="#242768">
          <LabelList dataKey="Web" content={renderCustomizedLabel} />
        </Bar>
        <Bar barSize={50} dataKey="Social" stackId="a" fill="#FFA500">
          <LabelList dataKey="Social" content={renderCustomizedLabel} />
        </Bar>
        <Bar barSize={50} dataKey="Ticker" stackId="a" fill="#2986cc">
          <LabelList dataKey="Ticker" content={renderCustomizedLabel} />
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default ChannelAnalyticsGraph;
