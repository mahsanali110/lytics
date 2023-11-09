import { CloseCircleTwoTone } from '@ant-design/icons';
import useActusPlayer from 'hooks/useActusPlayer';
import PropTypes from 'prop-types';
import React, { useEffect, useRef, useState } from 'react';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { useDispatch, useSelector } from 'react-redux';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import { liveClippingActions } from '../../../modules/LiveClipping/actions';
import { markerEditActions } from 'modules/markerEdit/actions';
import { cloneDeep, pick } from 'lodash';
import { DEFAULT_SEGMENT } from 'constants/options';
import { ActusPlayer } from '../../Common';
import useConfirm from 'hooks/useConfirm';
import moment from 'moment';
import PlayerControls from '../PlayerControls';
import './Channelwindow.scss';
let volume;
let channels = [];
// let actusPlayer;
let currentChannel;

const { removeWindow } = liveClippingActions;
const ChannelWindow = ({
  id,
  name,
  icon,
  showCloseIcon,
  windowIndex,
  onEditClip,
  ControlMute,
  addSegment,
  resetSegmentTime,
  handleClick,
  resetAllSegmentsTime,
  setStartTime,
  setChannelInfo,
  setVideoDuration,
  markersTimeLine,
  resetProgramData,
  deleteSegment,
}) => {
  const dispatch = useDispatch();
  const channelNames = useSelector(state => state.commonReducer.channelName);
  const actusPlayerRef = useRef(null);
  const [actusPlayerInstance, setActusPlayerInstance] = useState(null);
  const [channelName, setChannelName] = useState('');
  const [playerCurrentPosition, setPlayerCurrentPosition] = useState(0);
  const [playerCurrentTime, setPlayerCurrentTime] = useState(0);
  const [actusPlayer, setActusPlayer] = useState(null);
  const [Error, setError] = useState('');
  const [status, setStatus] = useState(false);
  const handle = useFullScreenHandle();
  const { confirm } = useConfirm();

  useEffect(() => {
    // actusPlayer = actusPlayerRef.current;
    if (!actusPlayerRef.current) return;
    setActusPlayer(actusPlayerRef.current);
    // setActusPlayerInstance(actusPlayer);
    // actusPlayer.connectToServer('administrator', 'actus', clbkLogin);
  }, [actusPlayerRef]);
  useEffect(() => {
    setChannelInfo({
      channelName: name,
      channelLogoPath: icon,
    });
  }, [name, icon]);

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
      // console.log(parseInt(moment(playerStatus.date_time_position).format('x')));
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
        <div className={`channel-window-container-content`}>
          {showCloseIcon && (
            <CloseCircleTwoTone
              className="window-close-icon"
              onClick={async () => {
                let ifConfirm = await confirm('You will lose your unsaved progress!');

                if (ifConfirm) {
                  resetProgramData();
                  dispatch(liveClippingActions.updateStartPro(false));
                  dispatch(liveClippingActions.updateProgDate(moment()));
                  dispatch(removeWindow({ windowIndex }));
                }
              }}
            />
          )}
          <div className="player-container">
            <FullScreen handle={handle}>
              <ActusPlayer actusPlayer={actusPlayerRef} onStatusChange={clbkgetPlayerById} />
            </FullScreen>
            {Error !== '' ? <h1 className="no-live-media">No Live Media</h1> : null}
          </div>
          <PlayerControls
            className="player-controls-container-content"
            actusPlayer={actusPlayerInstance}
            channelName={name}
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
            addSegment={addSegment}
            resetSegmentTime={resetSegmentTime}
            resetAllSegmentsTime={resetAllSegmentsTime}
            setStartTime={setStartTime}
            handleClick={handleClick}
            setVideoDuration={setVideoDuration}
            markersTimeLine={markersTimeLine}
            deleteSegment={deleteSegment}
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
