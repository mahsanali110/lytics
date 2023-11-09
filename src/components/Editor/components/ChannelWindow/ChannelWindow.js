import React, { useEffect, useState, useRef } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { CloseCircleTwoTone } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import moment from 'moment';
import axios from 'axios';
import { message as antMessage } from 'antd';

import './ChannelWindow.scss';

import { ActusPlayer } from '../../../Common';
import PlayerControls from '../PlayerControls/PlayerControls';
import { liveClippingActions } from 'modules/LiveClipping/actions';

// import PlayerControls from '../PlayerControls';

function ChannelWindow({ id, name, windowIndex, icon, closeWindow }) {
  const dispatch = useDispatch();
  const handle = useFullScreenHandle();
  const actusPlayerRef = useRef(null);
  const [actusPlayerInstance, setActusPlayerInstance] = useState(null);
  const [playerCurrentPosition, setPlayerCurrentPosition] = useState(0);
  const [playerCurrentTime, setPlayerCurrentTime] = useState(null);
  const [status, setStatus] = useState(false);
  const [channelLogoErro, setChannelLogoError] = useState(false);

  const [actusPlayer, setActusPlayer] = useState(null);
  const [Error, setError] = useState('');

  useEffect(() => {
    if (!actusPlayerRef.current) return;
    setActusPlayer(actusPlayerRef.current);
  }, [actusPlayerRef]);

  useEffect(() => {
    axios
      .get(icon)
      .then(res => {
        // console.log({ res });
      })
      .catch(err => {
        setChannelLogoError(true);
      });
  }, [icon]);

  useEffect(() => {
    if (!channelLogoErro) return;
    antMessage.warning(`${name} streaming disturbance. Processing might be problematic.`, 5);
  }, [channelLogoErro]);

  useEffect(() => {
    if (!actusPlayer) return;
    setActusPlayerInstance(actusPlayer);
    actusPlayer.connectToServer('administrator', 'actus', clbkLogin);
  }, [actusPlayer]);

  const clbkLogin = response => {
    if (response.error) {
      actusPlayer.connectToServer('administrator', 'actus', clbkLogin);
      return;
    }
    actusPlayer.playLive(name, clbkFunction);
    // setChannelName(name);
  };

  const clbkFunction = response => {
    if (response.error) {
      setError(response.error);
    }
  };

  const clbkPlay = response => {
    if (response.error) {
      return;
    }
    // currentChannel = actusPlayer.selectedChannel;
  };

  const clbkgetPlayerById = playerStatus => {
    if (playerStatus == '') {
      // show error if want to
      return;
    }
    if (playerStatus.date_time_position) {
      if (!status) setStatus(true);
      setPlayerCurrentTime(parseInt(moment(playerStatus.date_time_position).format('x')));
    }
    setPlayerCurrentPosition(playerStatus.position);
    // volume = playerStatus.volume;
  };

  return (
    <div className="live-channel-wrapper">
      <div className="channel-controls-wrapper">
        <span className="channel-name ff-roboto">{name}</span>
        {/* <CloseCircleTwoTone className="window-close-icon" onClick={closeWindow} /> */}
        <div className="actus-player-wrapper">
          <FullScreen handle={handle}>
            <ActusPlayer
              actusPlayer={actusPlayerRef}
              onStatusChange={clbkgetPlayerById}
              channelName={name}
              channelindex={name + windowIndex}
            />
          </FullScreen>
          {Error !== '' ? <h1 className="no-live-media ff-roboto">No Live Media</h1> : null}
        </div>
        <div>
          <PlayerControls
            actusPlayer={actusPlayerInstance}
            channelName={name}
            channelIcon={icon}
            clbkgetPlayerById={clbkgetPlayerById}
            clbkPlay={clbkPlay}
            playerCurrentPosition={playerCurrentPosition}
            playerCurrentTime={playerCurrentTime}
            handle={handle}
            // onEditClip={(onEditClip)}
            // ControlMute={ControlMute}
            windowIndex={windowIndex}
            status={status}
            // setStatus={setStatus}
            // setvisibleT={setvisibleT}
            // setVisibleB={setVisibleB}
            // setVisibleC={setVisibleC}
            // setVisibleF={setVisibleF}
            // setVisibleTw={setVisibleTw}
            // setVisibleY={setVisibleY}
            // setVisibleW={setVisibleW}
            // setvisibleChannel={setvisibleChannel}
          />
        </div>
      </div>
    </div>
  );
}

export default ChannelWindow;
