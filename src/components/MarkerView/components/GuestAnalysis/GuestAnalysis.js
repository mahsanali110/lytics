import { Typography } from 'antd';

import { useSelector } from 'react-redux';
import { Table, SegmentContainer, Tag } from 'components/Common';

import './GuestAnalysis.scss';

const { Text } = Typography;

const GuestAnalysis = () => {
  const { segments, programTime, programDate } = useSelector(state => state.markerEditReducer);

  const columns = [
    {
      title: 'Guest Name',
      dataIndex: 'guest',
      key: 'guest',
      width: '30%',
      render: (name, row, index) => <Text className="text-white large-alt-font-size">{name}</Text>,
    },
    {
      title: 'Statement',
      dataIndex: 'statement',
      key: 'statement',
      width: '40%',
      render: (statement, row) => {
        return <Text className="text-white large-alt-font-size">{statement}</Text>;
      },
    },
    {
      title: 'Sentiment',
      dataIndex: 'sentiment',
      key: 'sentiment',
      width: '23%',
      render: (sentiment, row) => {
        return sentiment && <Tag text={sentiment} variant={sentiment.toLowerCase()} />;
      },
    },
  ];
  return (
    <div className="guest-analysis-wrapper">
      {segments.map(({ title, themes, color, guestAnalysis, time }, tableIndex) => {
        let pointerevent = tableIndex === (segments.length-1) ? 'none': 'auto';
        let _color = pointerevent === 'none' ? 'gray' : color;
        let display;
        if (segments.length > 1 && tableIndex === segments.length - 1) display = 'none';
        let prevSegTime
        if(tableIndex){
          prevSegTime = segments[(tableIndex -1)].time
        } 
      
        return (
          <h1>HELLO</h1>
        );
      })}
    </div>
  );
};

export default GuestAnalysis;
