import { Col } from 'antd';
import NewsBoardLiveChannel from './livePlayer';
import { memo } from 'react';

const TV = 'Tv';
const staticChannels = ['Geo News', 'ARY News', 'Express News'];
const filterChannels = ({ type: source, name }) => source === TV && staticChannels.includes(name);

const NewsBoardLivePlayers = ({ channels, userChannels, handleChannelChange }) => {
  return (
    <>
      {userChannels.map((channel, index) => (
        <Col className="gutter-row" span={6} key={index}>
          <NewsBoardLiveChannel
            channel={channel}
            channels={channels}
            handleChannelChange={handleChannelChange}
            index={index}
          />
        </Col>
      ))}
    </>
  );
};
export default memo(NewsBoardLivePlayers);
