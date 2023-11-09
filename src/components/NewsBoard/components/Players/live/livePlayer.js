import { Radio, Tabs } from 'antd';
import { memo, useState } from 'react';
import LiveVideoPlayer from '../../LiveVideoPlayer/LiveVideoPlayer';
import CustomTabs from 'components/Common/CustomTabs';
import ChannelDropdown from 'components/Common/Dropdown/Dropdown';

const NewsBoardLiveChannel = ({ channel, channels, handleChannelChange, index }) => {
  // const [currentChannel, setCurrentChannel] = useState(channel);
  const [mode, setMode] = useState('Tv');
  const handleTabChange = e => {
    setMode(e.target.value);
  };
  const TV = 'Tv';
  const GRAPH = 'Graph';

  const items = [
    { label: TV, key: TV, children: channel && <LiveVideoPlayer channel={channel} /> },
    { label: GRAPH, key: GRAPH },
  ];

  const changeChannel = channel => {
    // setCurrentChannel(channel);
    handleChannelChange(channel, index + 1);
  };
  return (
    <CustomTabs
      tabHeader={
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0 5px',
              marginBottom: '8px',
            }}
          >
            <ChannelDropdown
              channels={channels}
              title={channel?.name ?? 'Channels'}
              onSelect={changeChannel}
            />
            <Radio.Group
              onChange={handleTabChange}
              value={mode}
              className="channels-radio-group"
              buttonStyle="solid"
              disabled={true}
            >
              <Radio.Button value={GRAPH}>{GRAPH.toUpperCase()}</Radio.Button>
              <Radio.Button value={TV}>{TV.toUpperCase()}</Radio.Button>
            </Radio.Group>
          </div>
        </div>
      }
      activeTab={mode}
      defautTab={TV}
      tabItems={items}
    />
  );
};

export default memo(NewsBoardLiveChannel);
