import React, { memo, useState } from 'react';
import { Grid, Radio, Typography } from '@mui/material';
import LiveVideoPlayer from '../../LiveVideoPlayer/LiveVideoPlayer';
import CustomTabs from 'components/Common/CustomTabs';
import ChannelDropdown from 'components/Common/Dropdown/Dropdown';

const NewsBoardLiveChannel = ({ channel, channels, handleChannelChange, index }) => {
  const [mode, setMode] = useState('Tv');

  const handleTabChange = (e) => {
    setMode(e.target.value);
  };

  const TV = 'Tv';
  const GRAPH = 'Graph';

  const items = [
    { label: TV, key: TV, children: channel && <LiveVideoPlayer channel={channel} /> },
    { label: GRAPH, key: GRAPH },
  ];

  const changeChannel = (channel) => {
    handleChannelChange(channel, index + 1);
  };

  return (
    <Grid item xs={12} sm={6} md={4} lg={3}>
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
                <Radio.Button value={GRAPH}>
                  <Typography variant="body2">{GRAPH.toUpperCase()}</Typography>
                </Radio.Button>
                <Radio.Button value={TV}>
                  <Typography variant="body2">{TV.toUpperCase()}</Typography>
                </Radio.Button>
              </Radio.Group>
            </div>
          </div>
        }
        activeTab={mode}
        defautTab={TV}
        tabItems={items}
      />
    </Grid>
  );
};

export default memo(NewsBoardLiveChannel);
