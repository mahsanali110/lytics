import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { useHotkeys } from 'react-hotkeys-hook';
import {
  PauseOutlined,
  PlayCircleOutlined,
  CaretRightOutlined,
  PlaySquareTwoTone,
  RedoOutlined,
  UndoOutlined,
  BackwardOutlined,
  StepBackwardOutlined,
  FastForwardOutlined,
  StepForwardOutlined,
  ForwardOutlined,
} from '@ant-design/icons';
import {
  faCalendarAlt,
  faCamera,
  faExpand,
  faVolumeMute,
  faVolumeUp,
  faCut,
} from '@fortawesome/free-solid-svg-icons';
import {
  PLAY_PAUSE,
  MUTE_VOLUME,
  BACKWARD_SPEED,
  FORWARD_SPEED,
  FIRST_FRAME,
  LAST_FRAME,
  FORWARD_30_SECONDS,
  ADD_PIN,
} from 'constants/hotkeys';
import { SET_ALL_LIVE, SET_BROADCAST_TYPE } from 'modules/common/actions';
import { AddAnotherIcon } from 'assets/icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  Menu,
  Dropdown,
  Button,
  Col,
  Row,
  Slider,
  Tooltip,
  Popover,
  Typography,
  Image,
} from 'antd';
import { LIVE } from '../../../constants/strings';
import DateTimeSelectorControl from './DateTimeSelectorControl';
import VolumeControl from './VolumeControl';
import { TOOLTIP_COLORS } from 'constants/options';
const { Text } = Typography;
import './PlayerControls.scss';
import { useDispatch, useSelector } from 'react-redux';
const PlayerControls = ({
  actusPlayer,
  channelIcon,
  channelName,
  clbkgetPlayerById,
  playerCurrentPosition,
  handle,
  clbkPlay,
  onEditClip,
  ControlMute,
  windowIndex,
  status,
  setStatus,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [visible, setVisible] = useState(false);
  const [mute, setMute] = useState(ControlMute.Muteflag);
  const [volumeControlVisible, setVolumeControlVisible] = useState(false);
  const [changePosition, setChangePosition] = useState(false);
  const [playerVolume, setPlayerVolume] = useState(30);
  const [broadcastType, setBroadcastType] = useState('live');
  const [fromTimeSlider, setFromTimeSlider] = useState(0);
  const [toTimeSlider, setToTimeSlider] = useState(0);
  const [userSelectedDate, setUserSelectedDate] = useState(0);
  // const [playerCurrentTime, setPlayerCurrentTime] = useState(0);
  const [isLive, setIsLive] = useState(true);
  const [clipperData, setClipperData] = useState({});
  const [playerSpeed, setPlayerSpeed] = useState(1);
  const selectedWindows = useSelector(state => state.multiViewReducer);
  // useEffect(() => {
  //   setPlayerCurrentTime(playerCurrentPosition);
  // }, []);
  const dispatch = useDispatch();
  const isReMount = useRef(false);
  const count = useSelector(state => state.commonReducer.count);
  const { dateAll, toTimeAll, fromTimeAll, broadcastAll } = useSelector(
    state => state.commonReducer
  );
  useEffect(() => {
    if (!actusPlayer) return;
    if (status === true) {
      actusPlayer.setVolume(0.3);
    }
    if (ControlMute.Muteflag == true) {
      // setPlayerVolume(0);
      setMute(mute);
      mute && actusPlayer.setVolume(0);
    } else {
      setMute(mute);
      mute && actusPlayer.setVolume(0);
    }
  }, [ControlMute, actusPlayer, status]);
  const handleEditClip = () => {
    onEditClip({ ...clipperData, channelIcon });
  };
  const setIsLiveStatus = val => {
    setIsLive(val);
  };
  const toggleMute = () => {
    if (!mute) {
      actusPlayer.setVolume(0);
    } else {
      changeVolume(playerVolume);
    }
    setMute(!mute);
  };
  // const setStatus trueute) => {
  //   if(mute){
  //     actusPlayer.setVolume(0);
  //   }else{
  //     actusPlayer.setVolume(playerVolume)
  //   }
  // }
  const handleRewind = ({ key }) => {
    actusPlayer.setPosition(playerCurrentPosition - parseInt(key));
    setIsPlaying(true);
    setIsLive(false);
  };
  const handleForward = ({ key }) => {
    actusPlayer.setPosition(playerCurrentPosition + parseInt(key));
    setIsPlaying(true);
  };
  const handleChangePosition = action => {
    setIsLiveStatus(false);
    setChangePosition(action);
  };
  const togglePlay = () => {
    !isPlaying ? actusPlayer.play() : actusPlayer.pause();
    setIsPlaying(!isPlaying);
    setPlayerSpeed(1);
    setIsLiveStatus(false);
  };
  const playLive = () => {
    if (!actusPlayer) return;
    actusPlayer.playLive(channelName, clbkPlay);
    setIsLiveStatus(true);
    setIsPlaying(true);
  };
  const toggleFullScreen = () => {
    //TODO: Actus switch to Full Screen
  };
  const changeVolume = value => {
    const volume = value ? value / 100 : 0;
    setPlayerVolume(value);
    actusPlayer.setVolume(volume);
  };
  const handleVisibleChange = volumeControlVisible => {
    setVolumeControlVisible(volumeControlVisible);
  };
  // useEffect(() => {
  //   if (isLive) {
  //     console.log('live');
  //   }
  // }, [isLive]);
  // useEffect(() => {
  //   dispatch({type: SET_BROADCAST_TYPE, payload: 'live'})
  // },[])

  useLayoutEffect(() => {
    if (count === 0) return;
    onApplyClick(broadcastAll, dateAll, fromTimeAll, toTimeAll);
    dispatch({ type: SET_ALL_LIVE, payload: 0 });
  }, [count]);
  isReMount.current = true;
  const onApplyClick = (broadcastType, selectedDate, selectedFromTime, selectedToTime) => {
    setVisible(false);
    setStatus(!mute);
    setBroadcastType(broadcastType);
    if (broadcastType === 'live') {
      playLive();
    } else {
      const fromTime = moment(selectedDate).set({
        hour: selectedFromTime.get('hour'),
        minute: selectedFromTime.get('minute'),
        second: selectedFromTime.get('second'),
      });
      const toTime = moment(selectedDate).set({
        hour: selectedToTime.get('hour'),
        minute: selectedToTime.get('minute'),
        second: selectedToTime.get('second'),
      });
      // setVisible(false);
      setIsLive(false);
      setUserSelectedDate(moment(selectedDate).format('DD/MM/YYYY'));
      setFromTimeSlider(parseInt(fromTime.format('x')));
      setToTimeSlider(parseInt(toTime.format('x')));
      setClipperData({ programDate: selectedDate, fromTime, toTime, channelName });
      actusPlayer.playStorage(channelName, fromTime, toTime, clbkPlay);
    }
  };

  const onApplyAll = () => {
    setStatus(!mute);
    dispatch({ type: SET_ALL_LIVE, payload: count + 1 });
  };

  const handleSlowMotion = value => {
    actusPlayer.slowMotion();
  };
  const handleNextFrame = value => {
    setIsPlaying(false);
    actusPlayer.nextFrame();
  };
  const handlePreviousFrame = value => {
    setIsPlaying(false);
    actusPlayer.previousFrame();
  };
  const handleFastForward = value => {
    if (playerSpeed * 2 > 4) return;
    if (playerSpeed < 0) {
      let speed = 1;
      setPlayerSpeed(speed * 2);
    } else {
      setPlayerSpeed(playerSpeed * 2);
    }
    setIsPlaying(true);
    actusPlayer.fastForward();
  };
  const handleFastRewind = value => {
    if (playerSpeed * 2 < -4) return;
    if (playerSpeed >= 1) {
      let speed = -1;
      setPlayerSpeed(speed);
    } else {
      setPlayerSpeed(playerSpeed * 2);
    }
    setIsPlaying(true);
    actusPlayer.fastBackward();
  };
  const captureScreenshot = () => {
    const date = moment().format('DD/MM/yy h:mm:ss A');
    const strDate = date.toString();
    const filename = channelName + '_' + strDate;
    actusPlayer.screenshot(filename);
  };
  const onSeekbarChange = value => {
    actusPlayer.setPosition(value);
  };
  const onSeekbarAfterChange = value => {
    // console.log('onAfterChange: ', value);
  };
  const tipFormatter = value => {
    const currentTimeInMillis = fromTimeSlider + value * 1000;
    return moment(currentTimeInMillis).format('h:mm:ss A');
  };

  useHotkeys(
    PLAY_PAUSE,
    e => {
      e.preventDefault();
      togglePlay();
    },
    [togglePlay]
  );

  useHotkeys(
    BACKWARD_SPEED,
    e => {
      e.preventDefault();
      handleFastRewind();
    },
    [handleFastRewind]
  );

  useHotkeys(
    FORWARD_30_SECONDS,
    e => {
      e.preventDefault();
      handleSlowMotion();
    },
    [handleSlowMotion]
  );

  useHotkeys(
    FIRST_FRAME,
    e => {
      e.preventDefault();
      handlePreviousFrame();
    },
    [handlePreviousFrame]
  );

  useHotkeys(
    LAST_FRAME,
    e => {
      e.preventDefault();
      handleNextFrame();
    },
    [handleNextFrame]
  );

  useHotkeys(
    FORWARD_SPEED,
    e => {
      e.preventDefault();
      handleFastForward();
    },
    [handleFastForward]
  );

  useHotkeys(
    MUTE_VOLUME,
    e => {
      e.preventDefault();
      toggleMute();
    },
    [toggleMute]
  );

  useHotkeys(
    ADD_PIN,
    e => {
      e.preventDefault();
      handleEditClip();
    },
    [handleEditClip]
  );
  const optionsRewind = (
    <Menu>
      <Menu.Item onClick={handleRewind} key="10">
        -10sec
      </Menu.Item>
      <Menu.Item onClick={handleRewind} key="20">
        -20sec
      </Menu.Item>
      <Menu.Item onClick={handleRewind} key="60">
        -1min
      </Menu.Item>
      <Menu.Item onClick={handleRewind} key="180">
        -3min
      </Menu.Item>
    </Menu>
  );
  const optionsForward = (
    <Menu>
      <Menu.Item onClick={handleForward} key="10">
        +10sec
      </Menu.Item>
      <Menu.Item onClick={handleForward} key="20">
        +20sec
      </Menu.Item>
      <Menu.Item onClick={handleForward} key="60">
        +1min
      </Menu.Item>
      <Menu.Item onClick={handleForward} key="180">
        +3min
      </Menu.Item>
    </Menu>
  );
  let pointerEvents = status ? 'initial' : 'none';
  return (
    <div className="player-controls-container">
      <Row justify="space-between">
        <Col>
          <Image
            src={channelIcon}
            style={{
              paddingTop: '1.5rem',
              marginLeft: '0.5rem',
            }}
            width={30}
            className="channel-icon"
            preview={false}
            fallback="placeholder.png"
          ></Image>
          <div
            style={{
              fontSize: '1rem',
              paddingTop: '1.7rem',
              marginLeft: '1rem',
              letterSpacing: '0.1rem',
              float: 'right',
            }}
          >
            {channelName}
          </div>
        </Col>
        <Col>
          <Row>
            <Col>
              <div
                style={{
                  paddingTop: '1.2rem',
                  paddingRight: '0rem',
                  letterSpacing: '0.2rem',
                  textAlign: 'right',
                  fontFamily: 'unispace',
                }}
              >
                {broadcastType === 'interval'
                  ? moment(fromTimeSlider + playerCurrentPosition).format('HH:mm:ss')
                  : moment().format('HH:mm:ss')}
                {/*new Date().toLocaleTimeString('en-US')*/}
              </div>
              <div
                style={{
                  paddingTop: '0.5rem',
                  paddingRight: '0rem',
                  letterSpacing: '0.2rem',
                  textAlign: 'right',
                }}
              >
                {broadcastType === 'interval' ? userSelectedDate : moment().format('DD/MM/YYYY')}
              </div>
            </Col>
            <Col>
              <Popover
                content={
                  <DateTimeSelectorControl
                    style={{ overflow: 'auto' }}
                    onCancelClick={() => {
                      setVisible(false);
                    }}
                    onApplyClick={onApplyClick}
                    onApplyAll={onApplyAll}
                    setParentBroadcast={setBroadcastType}
                  />
                }
                placement="bottom"
                style={{ overflow: 'auto' }}
                trigger="click"
                visible={visible}
                onVisibleChange={visible => {
                  setVisible(visible);
                }}
              >
                <Button style={{ paddingRight: '0.8rem' }} type="text" className="control-icon">
                  <FontAwesomeIcon icon={faCalendarAlt} size="lg" />
                </Button>
              </Popover>
            </Col>
            {broadcastType == 'interval' ? (
              <Col>
                <div className="segment-btn" style={{ marginLeft: '0px !important' }}>
                  <div className="btn-content" onClick={handleEditClip}>
                    <FontAwesomeIcon icon={faCut} size="md" style={{ marginBottom: '0.5rem' }} />
                    <Text className="text-white regular-font-size">Edit Clip</Text>
                  </div>
                </div>
              </Col>
            ) : null}
          </Row>
        </Col>
      </Row>
      {broadcastType === 'interval' ? (
        <Row style={{ paddingLeft: '1rem' }} align="middle">
          <Col span={4}>{moment(fromTimeSlider).format('HH:mm:ss')}</Col>
          <Col span={16}>
            <Slider
              min={0}
              max={(toTimeSlider - fromTimeSlider) / 1000}
              value={playerCurrentPosition}
              onChange={onSeekbarChange}
              onAfterChange={onSeekbarAfterChange}
              tipFormatter={tipFormatter}
            />
          </Col>
          <Col span={4}>{moment(toTimeSlider).format('HH:mm:ss')}</Col>
        </Row>
      ) : null}
      <Row style={{ pointerEvents: pointerEvents, marginTop: '-10px' }} align="middle">
        <Col span={13}>
          <Row
            style={{ paddingLeft: '1rem', paddingBottom: '1rem', paddingLeft: '1rem' }}
            align="middle"
          >
            <Col>
              {broadcastType !== 'interval' ? (
                <Dropdown overlay={optionsRewind} placement="topCenter" arrow>
                  <Button
                    type="text"
                    // onClick={() => handleChangePosition('rewind')}
                    className="control-icon"
                  >
                    <UndoOutlined rotate="-180" />
                  </Button>
                </Dropdown>
              ) : (
                <>
                  <Tooltip color={TOOLTIP_COLORS[0]} placement="bottom" title="Fast Backward">
                    <Button type="text" onClick={handleFastRewind} className="control-icon">
                      <BackwardOutlined />
                    </Button>
                  </Tooltip>
                  <Tooltip color={TOOLTIP_COLORS[0]} placement="bottom" title="Previous Frame">
                    <Button type="text" onClick={handlePreviousFrame} className="control-icon">
                      <StepBackwardOutlined />
                    </Button>
                  </Tooltip>
                </>
              )}
            </Col>

            <Col onClick={togglePlay}>
              <Button type="text" onClick={togglePlay} className="control-icon">
                {isPlaying ? <PauseOutlined /> : <CaretRightOutlined />}
              </Button>
            </Col>
            {isLive ? (
              <></>
            ) : (
              <Col>
                {broadcastType !== 'interval' ? (
                  <Dropdown overlay={optionsForward} placement="topCenter" arrow>
                    <Button
                      type="text"
                      onClick={() => handleChangePosition('forward')}
                      className="control-icon"
                    >
                      <RedoOutlined rotate="-180" />
                    </Button>
                  </Dropdown>
                ) : (
                  <div style={{ paddingTop: '0rem !important' }}>
                    <Tooltip color={TOOLTIP_COLORS[0]} placement="bottom" title="Slow Motion">
                      <Button type="text" onClick={handleSlowMotion} className="control-icon">
                        <FastForwardOutlined />
                      </Button>
                    </Tooltip>
                    <Tooltip color={TOOLTIP_COLORS[0]} placement="bottom" title="Next Frame">
                      <Button type="text" onClick={handleNextFrame} className="control-icon">
                        <StepForwardOutlined />
                      </Button>
                    </Tooltip>
                    <Tooltip color={TOOLTIP_COLORS[0]} placement="bottom" title="Fast Forward">
                      <Button type="text" onClick={handleFastForward} className="control-icon">
                        <ForwardOutlined />
                      </Button>
                    </Tooltip>
                    <Tooltip color={TOOLTIP_COLORS[0]} placement="bottom" title="">
                      <span className="player-speed" style={{ fontSize: '1.1rem' }}>
                        <span>{`${playerSpeed}`}</span>
                        <span>{` x`}</span>
                      </span>
                    </Tooltip>
                  </div>
                )}
              </Col>
            )}
            {broadcastType === 'interval' ? null : (
              <>
                {broadcastType !== 'interval' && isLive ? (
                  <Col className="live-play-control">
                    <Button
                      type="text"
                      onClick={() => {
                        if (!mute) setStatus(true);
                        if (mute) setStatus(false);
                        playLive();
                      }}
                      style={{ backgroundColor: '#EF233C', color: 'white' }}
                    >
                      {/* <PlaySquareTwoTone className="control-icon live-play-icon" twoToneColor="#1EA476" /> */}
                      <div>{LIVE}</div>
                    </Button>
                  </Col>
                ) : (
                  <Col className="live-play-control">
                    <Button
                      type="text"
                      onClick={() => {
                        if (!mute) setStatus(true);
                        if (mute) setStatus(false);
                        playLive();
                      }}
                      style={{ backgroundColor: 'inherit', color: 'white' }}
                    >
                      {/* <PlaySquareTwoTone className="control-icon live-play-icon" twoToneColor="#1EA476" /> */}
                      <div>{LIVE}</div>
                    </Button>
                  </Col>
                )}
              </>
            )}
          </Row>
        </Col>
        <Col span={10} offset={1}>
          <Row
            style={{ paddingRight: '1rem', paddingBottom: '1rem', paddingTop: '0rem' }}
            justify="end"
          >
            <Col style={{ flexGrow: '1', display: 'flex', justifyContent: 'space-around' }}>
              <Slider
                style={{ flexGrow: '1', width: '50px', paddingTop: '1rem' }}
                defaultValue={playerVolume}
                step={10}
                min={0}
                max={100}
                disabled={mute}
                onChange={changeVolume}
              />
              <Button type="text" className="control-icon" style={{ width: '30px' }}>
                <FontAwesomeIcon
                  icon={mute ? faVolumeMute : faVolumeUp}
                  size="md"
                  onClick={toggleMute}
                />
              </Button>
            </Col>
            <Col>
              <Tooltip placement="bottom" color={TOOLTIP_COLORS[0]} title="Capture">
                <Button type="text" className="control-icon" onClick={captureScreenshot}>
                  <FontAwesomeIcon icon={faCamera} size="md" />
                </Button>
              </Tooltip>
            </Col>
            <Col>
              <Tooltip placement="bottom" color={TOOLTIP_COLORS[0]} title="Fullscreen">
                <Button type="text" className="control-icon" onClick={handle.enter}>
                  <FontAwesomeIcon icon={faExpand} size="md" />
                </Button>
              </Tooltip>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};
PlayerControls.propTypes = {
  channelIcon: PropTypes.string.isRequired,
  channelName: PropTypes.string.isRequired,
};
export default PlayerControls;
