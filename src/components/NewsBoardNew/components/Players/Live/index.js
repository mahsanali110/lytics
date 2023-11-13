import { Grid } from '@mui/material';
import React, { memo } from 'react';
// import NewsBoardLiveChannel from './livePlayer';

const TV = 'Tv';
const staticChannels = ['Geo News', 'ARY News', 'Express News'];
const filterChannels = ({ type: source, name }) => source === TV && staticChannels.includes(name);

const NewsBoardLivePlayers = ({ channels, userChannels, handleChannelChange }) => {
  return (
    <Grid container spacing={2}>
      {userChannels.map((channel, index) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
          {/* <NewsBoardLiveChannel
            channel={channel}
            channels={channels}
            handleChannelChange={handleChannelChange}
            index={index}
          /> */}
        </Grid>
      ))}
    </Grid>
  );
};

export default memo(NewsBoardLivePlayers);
