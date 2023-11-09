import { Row } from 'antd';
import '../../NewsBoard.scss';
import NewsBoardLivePlayers from './live';
import NewsBoardPreviewPlayers from './Preview';
import { memo, useState, useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { getUser, arrayFromObjValue } from 'modules/common/utils';
import usersActions from 'modules/users/actions';
import newsboardActions from 'modules/newsboard/actions';
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
  const [userChannels, setUserChannels] = useState(
    arrayFromObjValue(getUser()?.liveTvChannels) || []
  );

  // functions
  const makeFormData = channelArr => {
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
      <Row gutter={8} className="demo">
        {/* news board preview and live player  */}
        <NewsBoardPreviewPlayers
          programInfo={programInfo}
          handlePreviewPlaying={handlePreviewPlaying}
          isPreviewPlaying={isPreviewPlaying}
          isLoading={isLoading}
          channels={channels}
          channel={userChannels[0]}
          handleChannelChange={handleChannelChange}
        />
        {/* news board live players  */}
        {channels && (
          <NewsBoardLivePlayers
            channels={channels}
            userChannels={userChannels.slice(1)}
            handleChannelChange={handleChannelChange}
          />
        )}{' '}
      </Row>
    </div>
  );
};
export default memo(NewsBoardPlayers);
