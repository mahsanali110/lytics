import React, { memo, useState, useEffect, useCallback } from 'react';
import '../../NewsBoardNew.scss';
import NewsBoardLivePlayers from './Live';
import NewsBoardPreviewPlayers from './Preview';
import { useDispatch, useSelector } from 'react-redux';

import { getUser, arrayFromObjValue } from 'modules/common/utils';
import usersActions from 'modules/users/actions';
import newsboardActions from 'modules/newsboard/actions';
import { Grid } from '@mui/material';

const staticChannels = ['BOL News', 'Express News', 'ARY News', 'Geo News'];
const filterChannels = ({ type: source, name }) => source === 'Tv' && staticChannels.includes(name);

const NewsBoardPlayers = ({
  isLoading,
  programInfo,
  channels,
  handlePreviewPlaying,
  isPreviewPlaying,
}) => {
  const dispatch = useDispatch();
  const [userChannels, setUserChannels] = useState(arrayFromObjValue(getUser()?.liveTvChannels) || []);

  // functions
  const makeFormData = (channelArr) => {
    const channelObject = channelArr.reduce((accumulator, cha, ind) => {
      accumulator[`channel${ind + 1}`] = cha.id || cha._id;
      return accumulator;
    }, {});
    const formData = new FormData();
    formData.append('device', 'web');
    formData.append('liveTvChannels', JSON.stringify(channelObject));
    return formData;
  };

  // callbacks
  const handleChannelChange = useCallback(
    (channel, index) => {
      const newUserChannels = userChannels.map((_, i) => {
        if (i === index) return channel;
        return _;
      });
      setUserChannels(newUserChannels);
      const data = makeFormData(newUserChannels);
      dispatch(newsboardActions.updateCurrentUser.request({ userId: getUser().id, data }));
    },
    [userChannels]
  );

  // Effects
  useEffect(() => {
    if (userChannels && userChannels.length) return;
    setUserChannels(channels?.filter(filterChannels));
  }, [channels]);

  return (
    <div>
      <Grid container spacing={2} className="demo">
        {/* news board preview and live player  */}
        <Grid item xs={12}>
          <NewsBoardPreviewPlayers
            programInfo={programInfo}
            handlePreviewPlaying={handlePreviewPlaying}
            isPreviewPlaying={isPreviewPlaying}
            isLoading={isLoading}
            channels={channels}
            channel={userChannels[0]}
            handleChannelChange={handleChannelChange}
          />
        </Grid>
        {/* news board live players  */}
        {channels && (
          <Grid item xs={12}>
            {/* <NewsBoardLivePlayers
              channels={channels}
              userChannels={userChannels.slice(1)}
              handleChannelChange={handleChannelChange}
            /> */}
          </Grid>
        )}
      </Grid>
    </div>
  );
};

export default memo(NewsBoardPlayers);
