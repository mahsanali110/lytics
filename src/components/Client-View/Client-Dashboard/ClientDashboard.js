import { Col, Row, Tooltip } from 'antd';
import StatePillarGraph from 'components/Dashboard/StatePillarGraph';
import SubThemeGraph from 'components/Dashboard/SubThemeGraph';
import channelsActions from 'modules/channels/actions';
import commonActions from 'modules/common/actions';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
} from 'recharts';
import './ClientDashboard.scss';
const ClientDashboard = () => {
  const dispatch = useDispatch();
  const { channels } = useSelector(state => state.channelsReducer);
  const { programNames, programTypes, themes, topics } = useSelector(state => state.commonReducer);
  const [runSubFunction, setRunSubFunction] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setRunSubFunction(true);
    }, 60000);
    return () => {
      setTimeout(function () {
        setRunSubFunction(false);
      }, 1000);
      clearInterval(interval);
    };
  });

  const fetchDefaultConfigurations = () => {
    dispatch(commonActions.fetchProgramNames.request());
    dispatch(commonActions.fetchProgramTypes.request());
    dispatch(channelsActions.getChannels.request());
    dispatch(commonActions.fetchThemes.request());
    dispatch(commonActions.fetchTopics.request());
  };

  useEffect(() => {
    fetchDefaultConfigurations();
  }, []);

  const dataChart8 = [
    {
      name: 'Jan',
      uv: 4000,
      pv: 5000,
    },
    {
      name: 'Feb',
      uv: 3000,
      pv: 2200,
    },
    {
      name: 'Mar',
      uv: 2000,
      pv: 2100,
    },
    {
      name: 'Apr',
      uv: 2780,
      pv: 5000,
    },
    {
      name: 'May',
      uv: 1890,
      pv: 5000,
    },
    {
      name: 'Jun',
      pv: 5000,
      uv: 2390,
    },
    {
      name: 'Jul',
      uv: 3490,
      pv: 3900,
    },
    {
      name: 'Aug',
      uv: 2490,
      pv: 4100,
    },
    {
      name: 'Sep',
      uv: 3100,
      pv: 4900,
    },
    {
      name: 'Oct',
      uv: 3990,
      pv: 3600,
    },
    {
      name: 'Nov',
      uv: 2500,
      pv: 2600,
    },
    {
      name: 'Dec',
      uv: 1600,
      pv: 3200,
    },
  ];
  return (
    <>
      <div className="client-dashboard-wrapper">
        {/* KE Dashboard v1 */}
        {/* <iframe
          title="Report Section"
          width="1300"
          height="780"
          src="https://app.powerbi.com/view?r=eyJrIjoiZDhmZjkzODAtOTYyNS00ZTA5LWE0ODktY2IyMjhmMTI4MjNjIiwidCI6IjU2ZWI3NmE3LTI5ODktNGNiNi1hZDBhLTBmZTAzNTUwMDY2ZCIsImMiOjl9"
          frameborder="0"
          allowFullScreen="true"
        ></iframe> */}

        {/* KE Dashboard v2 */}
        <iframe
          title="Report Section"
          width="1300"
          height="780"
          src="https://app.powerbi.com/view?r=eyJrIjoiZmRhYjliZDItMTViYy00MmUwLTkwY2MtMDQ3MzI3Y2ZiNjg1IiwidCI6IjU2ZWI3NmE3LTI5ODktNGNiNi1hZDBhLTBmZTAzNTUwMDY2ZCIsImMiOjl9"
          frameborder="0"
          allowFullScreen="true"
        ></iframe>
      </div>
    </>
  );
};

export default ClientDashboard;
