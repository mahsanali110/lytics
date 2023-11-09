import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { calculateWidth, updateSegmentTime, calcTime } from 'modules/common/utils';
import { Timeline } from 'components/Common';
import MarkerPoint from './Marker';
import { TIME_OPTIONS } from 'constants/options';
import { useHotkeys } from 'react-hotkeys-hook';
import useConfirm from 'hooks/useConfirm';
import { markerEditActions } from 'modules/markerEdit/actions';
import { cloneDeep } from 'lodash';
import { DEFAULT_SEGMENT } from 'constants/options';
import { liveClippingActions } from 'modules/LiveClipping/actions';
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
  faExpandAlt,
  faExpand,
  faVolumeMute,
  faVolumeUp,
  faCut,
  faPlusCircle,
  faSearchPlus,
} from '@fortawesome/free-solid-svg-icons';
import {
  PLAY_PAUSE,
  MUTE_VOLUME,
  BACKWARD_SPEED,
  BACKWARD_N_SECONDS,
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
  Tag,
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
  playerCurrentTime,
  handle,
  clbkPlay,
  onEditClip,
  ControlMute,
  windowIndex,
  status,
  setStatus,
  addSegment,
  resetSegmentTime,
  resetAllSegmentsTime,
  setStartTime,
  handleClick,
  setVideoDuration,
  markersTimeLine,
  deleteSegment,
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
  const [liveSeekbarPosition, setLiveSeekbarPosition] = useState(0);
  const [currentSeekbarTime, setCurrentSeekbarTime] = useState(0);
  const [liveActusTime, setLiveActusTime] = useState(0);
  const [liveTime, setLiveTime] = useState(0);
  const [livePin, setLivePin] = useState([{ time: 0, dragging: false, position: null }]);
  const [markers, setMarkers] = useState([]);
  const [userSelectedDate, setUserSelectedDate] = useState(0);
  const [width, setWidth] = useState('100%');
  // const [playerCurrentTime, setPlayerCurrentTime] = useState(0);
  const [isLive, setIsLive] = useState(true);
  const [clipperData, setClipperData] = useState({});
  const [playerSpeed, setPlayerSpeed] = useState(1);
  const [totalDuration, setTotalDuration] = useState(0);
  const flag = useRef(true);
  const selectedWindows = useSelector(state => state.multiViewReducer);
  // useEffect(() => {
  //   setPlayerCurrentTime(playerCurrentPosition);
  // }, []);
  const { confirm } = useConfirm();
  const dispatch = useDispatch();
  const isReMount = useRef(false);
  const count = useSelector(state => state.commonReducer.count);
  const { dateAll, toTimeAll, fromTimeAll, broadcastAll } = useSelector(
    state => state.commonReducer
  );

  const calcTime = () => {
    return (playerCurrentTime - fromTimeSlider) / 1000;
  };
  useEffect(() => {
    console.log({ flag: flag.current });
  }, [flag.current]);

  useEffect(() => {
    if (broadcastType === 'interval') return;
    if (playerCurrentTime && !fromTimeSlider) {
      setFromTimeSlider(moment(playerCurrentTime).subtract(TIME_OPTIONS.storage, 'minutes'));
      setToTimeSlider(moment(playerCurrentTime).add(TIME_OPTIONS.live, 'minutes'));
    }
    if (flag.current && fromTimeSlider) {
      setLiveSeekbarPosition(calcTime());
      setCurrentSeekbarTime(calcTime());
    }
    if (fromTimeSlider && isLive) {
      setLivePin(updateSegmentTime(livePin.length - 1, livePin, calcTime()));
      setLiveTime(calcTime());
    }
    if (toTimeSlider && playerCurrentTime >= toTimeSlider) {
      // setFromTimeSlider(moment(fromTimeSlider).add(TIME_OPTIONS.live, 'minutes'));
      setToTimeSlider(moment(toTimeSlider).add(TIME_OPTIONS.live, 'minutes'));
      resetAllSegmentsTime();
    }
  }, [playerCurrentTime]);
  useEffect(() => {
    // if (broadcastType === 'interval') return;
    if (!fromTimeSlider) return;
    if (!liveSeekbarPosition) {
      setLiveSeekbarPosition(calcTime());
      setCurrentSeekbarTime(calcTime());
      setLiveTime(calcTime());
    }
    setTotalDuration((toTimeSlider - fromTimeSlider) / 1000);
    setVideoDuration((toTimeSlider - fromTimeSlider) / 1000);
    setStartTime(fromTimeSlider);
  }, [toTimeSlider]);

  useEffect(() => {
    let prevTotal = 0;
    let _markers = livePin
      .sort((a, b) => {
        if (a.time > b.time) return 1;
        if (a.time < b.time) return -1;

        return 0;
      })
      .map(segment => {
        let currentWidth = calculateWidth({
          currentTime: segment.time,
          duration: (toTimeSlider - fromTimeSlider) / 1000,
        });
        let actualWidth = currentWidth - prevTotal;
        prevTotal += actualWidth;

        return {
          width: actualWidth,
          duration: segment.time,
          dragging: segment.dragging,
          position: segment.position,
        };
      });
    setMarkers(_markers);
  }, [livePin]);

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
  // console.log({ playerCurrentPosition });
  const handleRewind = ({ key }) => {
    actusPlayer.setPosition(playerCurrentPosition - parseInt(key));
    setIsPlaying(true);
    setIsLive(false);
  };
  const handleForward = ({ key }) => {
    actusPlayer.setPosition(playerCurrentPosition + parseInt(key));
    setIsPlaying(true);
  };
  const onLiveSeekbarChange = value => {
    flag.current = false;
    setLiveSeekbarPosition(parseInt(value));
  };
  const onLiveSeekbarAfterChange = value => {
    if (value < liveTime) {
      setIsLive(false);
    } else {
      playLive();
    }
    actusPlayer.setPosition(playerCurrentPosition - (currentSeekbarTime - parseInt(value)));
    setCurrentSeekbarTime(liveSeekbarPosition);
    setIsPlaying(true);

    flag.current = true;
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
    flag.current = true;
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
  const onApplyClick = async (broadcastType, selectedDate, selectedFromTime, selectedToTime) => {
    let isConfirm = await confirm('Your current Progress will be lost!');
    if (isConfirm) {
      dispatch(
        markerEditActions.updateByField({
          field: 'segments',
          value: [cloneDeep(DEFAULT_SEGMENT)],
        })
      );
      setPlayerSpeed(1);
      setVisible(false);
      setStatus(!mute);
      setBroadcastType(broadcastType);
      if (broadcastType === 'live') {
        setFromTimeSlider(0);
        setToTimeSlider(0);
        dispatch(liveClippingActions.updateProgDate(moment()));
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
        dispatch(liveClippingActions.updateProgDate(selectedDate));
        actusPlayer.playStorage(channelName, fromTime, toTime, clbkPlay);
      }
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
    setLiveActusTime(moment(currentTimeInMillis).format('HH:mm:ss'));
    return moment(currentTimeInMillis).format('HH:mm:ss');
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
    BACKWARD_N_SECONDS,
    e => {
      e.preventDefault();
      handleRewind({ key: 5 });
    },
    [handleRewind]
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
      broadcastType === 'interval'
        ? addSegment(playerCurrentPosition)
        : addSegment(currentSeekbarTime);
    },
    [handleEditClip, currentSeekbarTime, playerCurrentPosition]
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
  const zoom = (
    <Menu style={{ minWidth: '50px', padding: '5px 10px' }}>
      <Menu.Item onClick={() => setWidth('100%')} key="1">
        1x Zoom
      </Menu.Item>
      <Menu.Item onClick={() => setWidth('200%')} key="2">
        2x Zoom
      </Menu.Item>
      <Menu.Item onClick={() => setWidth('400%')} key="3">
        4x Zoom
      </Menu.Item>
      <Menu.Item onClick={() => setWidth('800%')} key="4">
        8x Zoom
      </Menu.Item>
      <Menu.Item onClick={() => setWidth('1600%')} key="5">
        16x Zoom
      </Menu.Item>
    </Menu>
  );
  let pointerEvents = status ? 'initial' : 'none';
  return (
    <div className="player-controls-container-content">
      <Row justify="space-between">
        <Col>
          <Row>
            <Col>
              <Image
                src={channelIcon}
                style={{ paddingTop: '1.4rem', marginLeft: '0.7rem' }}
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
            {broadcastType === 'interval' ? null : (
              <>
                {broadcastType !== 'interval' && isLive ? (
                  <Col className="live-play-control-content">
                    <Button
                      type="text"
                      onClick={() => {
                        if (!mute) setStatus(true);
                        if (mute) setStatus(false);
                        playLive();
                      }}
                      style={{
                        backgroundColor: '#EC4040',
                        color: 'white',
                        padding: '0px',
                        height: '22px',
                        paddingLeft: '3px',
                        paddingRight: '7px',
                      }}
                    >
                      {/* <PlaySquareTwoTone className="control-icon live-play-icon" twoToneColor="#1EA476" /> */}
                      <div>• {LIVE}</div>
                    </Button>
                  </Col>
                ) : (
                  <Col className="live-play-control-content">
                    <Button
                      type="text"
                      onClick={() => {
                        if (!mute) setStatus(true);
                        if (mute) setStatus(false);
                        playLive();
                      }}
                      style={{
                        backgroundColor: 'inherit',
                        color: 'white',
                        padding: '0px',
                        height: '22px',
                        paddingLeft: '3px',
                        paddingRight: '7px',
                      }}
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
        <Col>
          <Row>
            <Col>
              <div
                style={{
                  paddingTop: '1rem',
                  paddingRight: '0rem',
                  letterSpacing: '0.2rem',
                  textAlign: 'right',
                  fontFamily: 'unispace',
                }}
              >
                {liveActusTime}
                {/* {broadcastType === 'interval'
                  ? moment(fromTimeSlider + playerCurrentPosition).format('HH:mm:ss')
                  : moment().format('HH:mm:ss')} */}
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
            <Col>
              <div
                className="segment-btn"
                style={{ marginLeft: '0px !important', pointerEvents: status ? 'initial' : 'none',marginLeft:'20px' }}
              >
                <div
                  className="btn-content"
                  onClick={() =>
                    broadcastType === 'interval'
                      ? addSegment(playerCurrentPosition)
                      : addSegment(currentSeekbarTime)
                  }
                >
                  <FontAwesomeIcon
                    icon={faPlusCircle}
                    size="lg"
                    style={{ marginBottom: '0.5rem' }}
                  />
                  <Text className="text-white regular-font-size">ADD SEGMENT</Text>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* )} */}
      <Row style={{ pointerEvents: pointerEvents }} align="middle">
        <Col span={16}>
          <Row style={{ paddingLeft: '0.6rem', paddingBottom: '1rem' }} align="middle">
            <Col>
              <Dropdown overlay={optionsRewind} placement="topCenter" arrow>
                <Button
                  type="text"
                  // onClick={() => handleChangePosition('rewind')}
                  className="control-icon"
                >
                  <UndoOutlined style={{ fontSize: '1rem' }} rotate="-180" />
                </Button>
              </Dropdown>
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
            </Col>

            <Col onClick={togglePlay}>
              <Button type="text" onClick={togglePlay} className="control-icon">
                {isPlaying ? <PauseOutlined /> : <CaretRightOutlined />}
              </Button>
            </Col>
            <Col>
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
              </div>
            </Col>
            {isLive ? (
              <></>
            ) : (
              <Col style={{ marginRight: '.5rem'}}>
                <Dropdown overlay={optionsForward} placement="topCenter" arrow>
                  <Button
                    type="text"
                    onClick={() => handleChangePosition('forward')}
                    className="control-icon"
                  >
                    <RedoOutlined style={{ fontSize: '1rem' }} rotate="-180" />
                  </Button>
                </Dropdown>
              </Col>
            )}
            <Col style={{ paddingTop: '13px' }}>
              <Tooltip color={TOOLTIP_COLORS[0]} placement="bottom" title="">
                <span className="player-speed" style={{ fontSize: '1rem' }}>
                  <span>{`${playerSpeed}`}</span>
                  <span>{` x`}</span>
                </span>
              </Tooltip>
            </Col>
            {/* <Col style={{ flexGrow: '1' }}>
              <div className="awareness-controls">
                <div className="awareness-controls_pin">
                  <div className="controls">
                    <span class="pin pin-start">[</span>
                    <span class="pin pin-end">]</span>
                    <span class="pin pin-custom">5 Min</span>
                  </div>
                </div>
                <div className="awareness-controls_ticker">
                  <span className="tag tag-ticker">Ticker</span>
                  <span className="tag tag-screen">Screen</span>
                  <span className="tag tag-clip">Clip</span>
                </div>
              </div>
            </Col> */}
          </Row>
        </Col>
        <Col span={8}>
          <Row
            style={{ paddingRight: '0.6rem', paddingBottom: '1rem', paddingTop: '0rem' }}
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
      <Row justify="space-between" style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
        <Col className="player-time player-time-start" span={4}>
          {moment(fromTimeSlider).format('HH:mm:ss')}
        </Col>
        <Col className="player-time player-time-end" span={4}>
          {moment(toTimeSlider).format('HH:mm:ss')}
        </Col>
      </Row>
      <div className="zoom-container">
        <Row style={{ paddingLeft: '1rem', paddingRight: '1rem', width: width }} align="middle">
          <Col span={24}>
            {broadcastType === 'interval' ? (
              <Slider
                className="live-slider"
                min={0}
                max={(toTimeSlider - fromTimeSlider) / 1000}
                value={playerCurrentPosition}
                onChange={onSeekbarChange}
                onAfterChange={onSeekbarAfterChange}
                tipFormatter={tipFormatter}
              />
            ) : (
              <Slider
                className="live-slider"
                min={0}
                max={totalDuration}
                value={liveSeekbarPosition}
                onChange={onLiveSeekbarChange}
                onAfterChange={onLiveSeekbarAfterChange}
                tipFormatter={tipFormatter}
              ></Slider>
            )}

            <div className="time-line--container">
              {broadcastType !== 'interval'
                ? markers.map(({ width, duration, dragging, position }, i, array) => {
                    let to, from;
                    if (i === array.length - 1) {
                      from = 0;
                      to = 0;
                    } else if (array.length > 1) {
                      let timePercent = (duration / totalDuration) * 100;
                      let left = (timePercent / 100) * outerParentRect?.width;
                      from = -left;
                      let nextDuration = totalDuration - duration;
                      let nextPercent = (nextDuration / totalDuration) * 100;
                      let right = (nextPercent / 100) * outerParentRect?.width;
                      to = right;
                    }
                    return (
                      <MarkerPoint
                        key={i}
                        position={position}
                        width={width}
                        duration={duration}
                        i={i}
                        dragging={dragging}
                      />
                    );
                  })
                : null}
            </div>
          </Col>
        </Row>
        <Row style={{ paddingLeft: '1rem', paddingRight: '1rem', width: width }} align="middle">
          <Timeline
            liveTime={liveTime}
            markers={markersTimeLine}
            resetSegmentTime={resetSegmentTime}
            handleClick={handleClick}
            liveClipper={true}
            deleteSegment={deleteSegment}
          />
        </Row>
      </div>
      <Row justify="end" style={{ paddingTop: '0.5rem', paddingRight: '1rem' }}>
        <Dropdown
          style={{ zIndex: '10000' }}
          overlay={zoom}
          placement="topCenter"
          trigger={['hover']}
        >
          <FontAwesomeIcon
            style={{ cursor: 'pointer' }}
            className="zoom-icon"
            icon={faSearchPlus}
            size="lg"
          />
        </Dropdown>
      </Row>
    </div>
  );
};
PlayerControls.propTypes = {
  channelIcon: PropTypes.string.isRequired,
  channelName: PropTypes.string.isRequired,
};
export default PlayerControls;
