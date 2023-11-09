import './LiveVideoPlayer.scss';

import { ChannelWindow } from '../';

function LiveVideoPlayer({ channel }) {
  return (
    <div className="video-player-container">
      <ChannelWindow key={channel.id} id={channel.id} name={channel.name} />
    </div>
  );
}

export default LiveVideoPlayer;
