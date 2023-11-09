import { CloseCircleTwoTone } from '@ant-design/icons';
import useActusPlayer from 'hooks/useActusPlayer';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { channelActions } from '../../../modules/multiview/actions';
import { ActusPlayer } from '../../Common';
import moment from 'moment';
import PlayerControls from '../PlayerControls';
import './Channelwindow.scss';
import { formatDate } from 'modules/common/utils';

let volume;
let channels = [];
// let actusPlayer;
let currentChannel;

const { removeWindowAwareness } = channelActions;
const ChannelWindow = ({
  id,
  name,
  icon,
  showCloseIcon,
  windowIndex,
  onEditClip,
  ControlMute,
  setvisibleT,
  setVisibleB,
  setVisibleC,
  setVisibleF,
  setVisibleTw,
  setVisibleY,
  setVisibleW,
  setvisibleChannel,
  drawerFlag,
  height,
}) => {
  const dispatch = useDispatch();
  const channelNames = useSelector(state => state.commonReducer.channelName);
  const actusPlayerRef = useRef(null);
  const [actusPlayerInstance, setActusPlayerInstance] = useState(null);
  const [channelName, setChannelName] = useState('');
  const [playerCurrentPosition, setPlayerCurrentPosition] = useState(0);
  const [actusPlayer, setActusPlayer] = useState(null);
  const [Error, setError] = useState('');
  const [status, setStatus] = useState(false);
  const handle = useFullScreenHandle();
  const [windowDimensions, setWindowDimensions] = useState(getWindowDimensions());

  const [screenHeight, setScreenHeight] = useState(getWindowDimensions().width / 83);
  const [playerCurrentTime, setPlayerCurrentTime] = useState(null);

  useEffect(() => {
    // actusPlayer = actusPlayerRef.current;
    if (!actusPlayerRef.current) return;
    setActusPlayer(actusPlayerRef.current);
    // setActusPlayerInstance(actusPlayer);
    // actusPlayer.connectToServer('administrator', 'actus', clbkLogin);
  }, [actusPlayerRef]);
  function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
      width,
      height,
    };
  }
  useEffect(() => {
    function handleResize() {
      setWindowDimensions(getWindowDimensions());
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  useEffect(() => {}, [drawerFlag]);
  useEffect(() => {
    if (!actusPlayer) return;
    setActusPlayerInstance(actusPlayer);
    actusPlayer.connectToServer('administrator', 'actus', clbkLogin);
  }, [actusPlayer]);
  const clbkgetPlayerById = playerStatus => {
    if (playerStatus == '') {
      // show error if want to
      console.log('Error');
      return;
    }
    if (playerStatus.date_time_position) {
      setStatus(true);
      setPlayerCurrentTime(parseInt(moment(playerStatus.date_time_position).format('x')));
    }
    setPlayerCurrentPosition(playerStatus.position);
    volume = playerStatus.volume;
  };

  //Callback to login
  //Get a response object.
  const clbkLogin = response => {
    if (response.error) {
      console.error(response.error);
      actusPlayer.connectToServer('administrator', 'actus', clbkLogin);
      return;
    }
    actusPlayer.playLive(name, clbkFunction);
    setChannelName(name);
  };

  const clbkFunction = response => {
    if (response.error) {
      setError(response.error);
    }
  };

  const clbkPlay = response => {
    if (response.error) {
      //setError(response.error);
      console.error(response.error);
      return;
    }
    currentChannel = actusPlayer.selectedChannel;
  };
  useEffect(() => {
    setTimeout(() => {}, 3000);
  }, []);

  return (
    <TransitionGroup component={null}>
      <CSSTransition key={id} appear={true} timeout={500} classNames="fade">
        <div
          className={`awareness-channel-window-container`}
          style={
            height
              ? { minHeight: `calc(60vh + 140px)`, transition: 'min-height 0.5s ease-in-out' }
              : drawerFlag
              ? {
                  minHeight: `calc(${screenHeight}vh + 140px)`,
                  transition: 'min-height 0.5s ease-in-out',
                }
              : {
                  minHeight: `calc(${screenHeight}vh + 3vh + 140px)`,
                  transition: 'min-height 0.5s ease-in-out',
                }
          }
        >
          {showCloseIcon && (
            <CloseCircleTwoTone
              className="window-close-icon"
              onClick={() => {
                dispatch(removeWindowAwareness({ windowIndex }));
              }}
            />
          )}
          <div
            className="player-container"
            style={
              height
                ? { minHeight: '60vh', transition: 'min-height 0.5s ease-in-out' }
                : drawerFlag
                ? { minHeight: `${screenHeight}vh`, transition: 'min-height 0.5s ease-in-out' }
                : {
                    minHeight: `calc(${screenHeight}vh + 3vh )`,
                    transition: 'min-height 0.5s ease-in-out',
                  }
            }
          >
            <FullScreen handle={handle}>
              <ActusPlayer
                actusPlayer={actusPlayerRef}
                onStatusChange={clbkgetPlayerById}
                channelName={name}
                channelindex={name + windowIndex}
              />
            </FullScreen>
            {Error !== '' ? <h1 className="no-live-media">No Live Media</h1> : null}
          </div>

          <PlayerControls
            style={{ backgroundColor: 'red' }}
            className="player-controls-container"
            actusPlayer={actusPlayerInstance}
            channelName={channelName}
            channelIcon={icon}
            clbkgetPlayerById={clbkgetPlayerById}
            clbkPlay={clbkPlay}
            playerCurrentPosition={playerCurrentPosition}
            playerCurrentTime={playerCurrentTime}
            handle={handle}
            onEditClip={onEditClip}
            ControlMute={ControlMute}
            windowIndex={windowIndex}
            status={status}
            setStatus={setStatus}
            setvisibleT={setvisibleT}
            setVisibleB={setVisibleB}
            setVisibleC={setVisibleC}
            setVisibleF={setVisibleF}
            setVisibleTw={setVisibleTw}
            setVisibleY={setVisibleY}
            setVisibleW={setVisibleW}
            setvisibleChannel={setvisibleChannel}
          />
        </div>
      </CSSTransition>{' '}
    </TransitionGroup>
  );
};

ChannelWindow.propTypes = {
  id: PropTypes.string.isRequired, // channel id
  icon: PropTypes.string.isRequired, // channel icon
  name: PropTypes.string.isRequired, // channel name
  showCloseIcon: PropTypes.bool, // whether to display the close window icon
  windowIndex: PropTypes.number, // index of current window
};

ChannelWindow.defaultProps = {
  showCloseIcon: true,
  windowIndex: 0,
};

export default ChannelWindow;
