import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { calculateWidth } from 'modules/common/utils';
import { updateSegmentTime, createParts } from './utils';
import { TIME_OPTIONS } from 'constants/options';
import moment from 'moment';
import MarkerPoint from './Marker';
import { useHotkeys } from 'react-hotkeys-hook';
import { v4 as uuidv4 } from 'uuid';
import { commonActions } from 'modules/common/actions';
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
  message as antMessage,
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
  setvisibleChannel,
  setvisibleT,
  setVisibleB,
  setVisibleC,
  setVisibleF,
  setVisibleTw,
  setVisibleY,
  setVisibleW,
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
  const [userSelectedDate, setUserSelectedDate] = useState(0);
  const [isLive, setIsLive] = useState(true);
  const [clipperData, setClipperData] = useState({});
  const [playerSpeed, setPlayerSpeed] = useState(1);
  const [liveTime, setLiveTime] = useState(0);
  const [segments, setSegments] = useState([{ time: 0, dragging: false, position: null }]);
  const [markers, setMarkers] = useState([]);
  const [startPin, setStartPin] = useState(false);
  const [endPin, setEndPin] = useState(false);
  const [totalDuration, setTotalDuration] = useState(0);
  const flag = useRef(true);
  let outerParent = useRef(null);
  let outerParentRect;
  if (outerParent.current) {
    outerParentRect = outerParent.current.getBoundingClientRect();
  }

  const selectedWindows = useSelector(state => state.multiViewReducer);
  const { tickerArray, shotArray } = useSelector(state => state.commonReducer);

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
    if (broadcastType === 'interval') return;
    if (playerCurrentTime && !fromTimeSlider) {
      console.log(fromTimeSlider);
      setFromTimeSlider(moment(playerCurrentTime).subtract(TIME_OPTIONS.storage, 'minutes'));
      setToTimeSlider(moment(playerCurrentTime).add(TIME_OPTIONS.live, 'minutes'));
    }
    if (flag.current && fromTimeSlider) {
      setLiveSeekbarPosition(calcTime());
      setCurrentSeekbarTime(calcTime());
    }
    if (fromTimeSlider && isLive) {
      setSegments(updateSegmentTime(segments.length - 1, segments, calcTime()));
      setLiveTime(calcTime());
    }
    if (toTimeSlider && playerCurrentTime >= toTimeSlider) {
      setFromTimeSlider(moment(fromTimeSlider).add(TIME_OPTIONS.live, 'minutes'));
      setToTimeSlider(moment(toTimeSlider).add(TIME_OPTIONS.live, 'minutes'));
      updateSegBoundries();
    }
  }, [playerCurrentTime]);
  useEffect(() => {
    if (broadcastType === 'interval') return;
    if (!fromTimeSlider) return;
    if (!liveSeekbarPosition) {
      setLiveSeekbarPosition(calcTime());
      setCurrentSeekbarTime(calcTime());
      setLiveTime(calcTime());
    }
    setSegments(updateSegmentTime(segments.length - 1, segments, calcTime()));
  }, [fromTimeSlider]);
  useEffect(() => {
    setTotalDuration((toTimeSlider - fromTimeSlider) / 1000);
  }, [fromTimeSlider]);

  useEffect(() => {
    let prevTotal = 0;
    let _markers = segments
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
  }, [segments]);

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

  const addStartPin = () => {
    if (broadcastType === 'live') {
      if (currentSeekbarTime > liveTime) return antMessage.error('Cannot exceed live time', 2);
      if (startPin) {
        resetSegmentTime(currentSeekbarTime, 'start');
      } else {
        let pin = {
          time: currentSeekbarTime,
          dragging: true,
          position: 'start',
        };
        setSegments(prev => [...prev, pin]);
        setStartPin(true);
      }
    } else {
      if (startPin) {
        resetSegmentTime(playerCurrentPosition, 'start');
      } else {
        let pin = {
          time: playerCurrentPosition,
          dragging: true,
          position: 'start',
        };
        setSegments(prev => [...prev, pin]);
        setStartPin(true);
      }
    }
  };

  const addEndPin = () => {
    if (broadcastType === 'live') {
      if (currentSeekbarTime > liveTime) return antMessage.error('Cannot exceed live time', 2);
      if (startPin) {
        if (segments.filter(seg => seg.position == 'start')[0].time >= currentSeekbarTime) {
          antMessage.error(`End pin time can't be less than start time`, 2);
        } else {
          if (endPin) {
            resetSegmentTime(currentSeekbarTime, 'end');
          } else {
            let pin = {
              time: currentSeekbarTime,
              dragging: true,
              position: 'end',
            };
            setSegments(prev => [...prev, pin]);
            setEndPin(true);
          }
        }
      }
    } else {
      if (startPin) {
        if (segments.filter(seg => seg.position == 'start')[0].time >= playerCurrentPosition) {
          antMessage.error(`End pin time can't be less than start`, 2);
        } else {
          if (endPin) {
            resetSegmentTime(playerCurrentPosition, 'end');
          } else {
            let pin = {
              time: playerCurrentPosition,
              dragging: true,
              position: 'end',
            };
            setSegments(prev => [...prev, pin]);
            setEndPin(true);
          }
        }
      }
    }
  };

  const handleTimePreset = ({ key }) => {
    if (broadcastType === 'live') {
      let currentTime = currentSeekbarTime;
      if (currentTime - parseInt(key) < 0) {
        antMessage.error('Current chunk is not available', 2);
      } else {
        let endPin = {
          time: currentTime,
          dragging: true,
          position: 'end',
        };
        let startPin = {
          time: currentTime - parseInt(key),
          dragging: true,
          position: 'start',
        };
        setSegments(prev => [
          startPin,
          endPin,
          ...prev.filter(segment => segment.position == null),
        ]);
        setStartPin(true);
        setEndPin(true);
      }
    } else {
      let currentTime = playerCurrentPosition;
      if (currentTime - parseInt(key) < 0) {
        antMessage.error('Current chunk is not available', 2);
      } else {
        let endPin = {
          time: currentTime,
          dragging: true,
          position: 'end',
        };
        let startPin = {
          time: currentTime - parseInt(key),
          dragging: true,
          position: 'start',
        };
        setSegments(prev => [
          startPin,
          endPin,
          ...prev.filter(segment => segment.position == null),
        ]);
        setStartPin(true);
        setEndPin(true);
      }
    }
  };

  const resetSegmentTime = (currentTime, position) => {
    let _currentTime = currentTime;
    if (broadcastType === 'live') {
      if (_currentTime > liveTime)
        return antMessage.error(`You can only set time before live time`, 2);
    }
    let startPinTime = segments.filter(seg => seg.position == 'start')[0].time;
    let endPinTime = segments.filter(seg => seg.position == 'end')[0]?.time;

    if (position == 'start' && _currentTime >= endPinTime)
      return antMessage.error(`Start time should be less than end time`, 2);

    if (position == 'end' && _currentTime <= startPinTime)
      return antMessage.error(`End time should be larger than start time`, 2);

    if (_currentTime < 0) _currentTime = 0;
    if (_currentTime > totalDuration) _currentTime = totalDuration - 1;

    let _segments = segments.map(segment => {
      if (segment.position === position) {
        segment.time = _currentTime !== undefined ? _currentTime : segment.time;
      }
      return segment;
    });
    let sortedSegments = [..._segments].sort((a, b) => {
      if (a.time > b.time) return 1;
      if (a.time < b.time) return -1;

      return 0;
    });
    setSegments([...sortedSegments]);
  };

  const updateSegBoundries = () => {
    let _segments = segments.map(segment => {
      if (segment.position) {
        segment.time = segment.time - TIME_OPTIONS.live * 60;
      }
      return segment;
    });
    setSegments([..._segments]);
  };

  const clip = () => {
    const parts = createParts(segments, fromTimeSlider);
    const data = {
      parts,
      from: parts.from,
      to: parts.to,
      programData: {
        channel: channelName,
        channelLogoPath: channelIcon,
        programDate:
          broadcastType === 'interval' ? userSelectedDate : moment().format('DD/MM/YYYY'),
        programTimeFrom: moment(parts.from).format('HH:mm:ss'),
        programTimeTo: moment(parts.to).format('HH:mm:ss'),
      },
    };
    onEditClip(data);
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
  const onApplyClick = (broadcastType, selectedDate, selectedFromTime, selectedToTime) => {
    setVisible(false);
    setStatus(!mute);
    setBroadcastType(broadcastType);
    if (broadcastType === 'live') {
      playLive();
      setSegments([{ time: 0, dragging: false, position: null }]);
      setStartPin(false);
      setEndPin(false);
      setFromTimeSlider(0);
      setToTimeSlider(0);
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
      setSegments([]);
      setStartPin(false);
      setEndPin(false);
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

  const timePreset = (
    <Menu>
      <Menu.Item onClick={handleTimePreset} key="900">
        15 Min
      </Menu.Item>
      <Menu.Item onClick={handleTimePreset} key="600">
        10 Min
      </Menu.Item>
      <Menu.Item onClick={handleTimePreset} key="300">
        5 Min
      </Menu.Item>
    </Menu>
  );
  let pointerEvents = status ? 'initial' : 'none';

  //Ticker Starts here
  const { channels } = useSelector(state => state.channelsReducer);

  const [tickerSize, settickerSize] = useState(null);
  const [yAxisOffset, setyAxisOffset] = useState(null);

  const [tickerRatioOfVideo, setTickerRatioOfVideo] = useState('');
  const [xAxisCrop, setxAxisCrop] = useState('');

  const canvasRefTicker = useRef(null);
  const canvasRefShot = useRef(null);

  const TickerSizeStateRef = useRef(tickerSize);
  const yAxisOffsetStateRef = useRef(yAxisOffset);
  const xAxisCropStateRef = useRef(xAxisCrop);
  const tickerRatioOfVideoRef = useRef(tickerRatioOfVideo);

  useEffect(() => {
    channels.forEach(t => {
      if (t.name == channelName) {
        settickerSize(t.tickerSize);
        setyAxisOffset(t.yaxisOffset);
        TickerSizeStateRef.current = t.tickerSize;
        yAxisOffsetStateRef.current = t.yaxisOffset;
        xAxisCropStateRef.current = t.xaxisCrop;
      }
    });
  }, [channels, channelName]);
  const drawTicker = (id, size, IMGsrc) => {
    const canvas = canvasRefTicker.current;
    let context = canvas.getContext('2d');

    const MAX_TICKERS_ALLOWED = 8;
    let i = windowIndex;
    if (size >= MAX_TICKERS_ALLOWED) {
      antMessage.success('Max tickers added to this collection', 1);
      return;
    } else {
      let el = '';

      let img = (document
        ?.querySelector(`[channelindex="${channelName}${i}"]`)
        ?.getElementsByTagName('video'))[0];

      canvas.width = img.videoWidth;
      canvas.height = img.videoHeight;
      const newTickerHeight =
        img.videoWidth /
        ((img.videoWidth - xAxisCropStateRef.current) / TickerSizeStateRef.current);

      context.drawImage(
        img,
        0,
        yAxisOffsetStateRef.current,
        img.videoWidth - xAxisCropStateRef.current,
        TickerSizeStateRef.current,
        0,
        0,
        img.videoWidth,
        newTickerHeight
      );
      let tempCanvas = document.querySelector(`[id="${channelName}Canvasticker${windowIndex}"]`);
      el = tempCanvas.toDataURL();
      dispatch(commonActions.addTickerSource({ id, data: [...IMGsrc, el], sizeCtrl: 1 }));
    }
  };
  //Ticker Ends Here

  //Breaking start Here

  const drawShot = (id, size, IMGsrc) => {
    // if (gap > 350) return;
    let canvas = canvasRefShot.current;
    let context = canvas.getContext('2d');
    canvas.width = 430;
    canvas.height = 400;
    let i = windowIndex;
    if (size > 5) {
      antMessage.success('Max Screen Shot added to this collection', 1);
      return;
    }
    let videotag1 = document
      ?.querySelector(`[channelindex="${channelName}${i}"]`)
      ?.getElementsByTagName('video');
    context.drawImage(videotag1[0], 0, 0, 400, 400);
    let el = document.querySelector(`[id="${channelName}CanvasShot${windowIndex}"]`)?.toDataURL();
    dispatch(commonActions.addShotSource({ id, data: [...IMGsrc, el], sizeCtrl: 1 }));
  };

  return (
    <div className="player-controls-container">
      <Row justify="space-between" style={{ paddingLeft: '1rem', paddingRight: '1rem' }}>
        <Col>
          <Image
            src={channelIcon}
            style={{ paddingTop: '1.2rem' }}
            width={30}
            preview={false}
            className="channel-icon"
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
                <Button type="text" className="control-icon control-icon-last">
                  <FontAwesomeIcon icon={faCalendarAlt} size="lg" />
                </Button>
              </Popover>
            </Col>
            {/* {broadcastType == 'interval' ? (
              <Col>
                <div className="segment-btn" style={{ marginLeft: '0px !important' }}>
                  <div className="btn-content" onClick={handleEditClip}>
                    <FontAwesomeIcon icon={faCut} size="md" style={{ marginBottom: '0.5rem' }} />
                    <Text className="text-white regular-font-size">Edit Clip</Text>
                  </div>
                </div>
              </Col>
            ) : null} */}
          </Row>
        </Col>
      </Row>

      <Row
        style={{ paddingLeft: '1rem', paddingRight: '1rem', paddingTop: '0.9rem' }}
        align="middle"
      >
        <Col className="player-time player-time-left" span={3}>
          {moment(fromTimeSlider).format('HH:mm:ss')}
        </Col>
        <Col span={18}>
          {broadcastType === 'interval' ? (
            <Slider
              style={{ margin: '10px 0px' }}
              min={0}
              max={(toTimeSlider - fromTimeSlider) / 1000}
              value={playerCurrentPosition}
              onChange={onSeekbarChange}
              onAfterChange={onSeekbarAfterChange}
              tipFormatter={tipFormatter}
            />
          ) : (
            <Slider
              style={{ margin: '10px 0px' }}
              min={0}
              max={totalDuration}
              value={liveSeekbarPosition}
              onChange={onLiveSeekbarChange}
              onAfterChange={onLiveSeekbarAfterChange}
              tipFormatter={tipFormatter}
            ></Slider>
          )}
          <div ref={outerParent} className="time-line--container">
            {markers.map(({ width, duration, dragging, position }, i, array) => {
              let to, from;
              if (i === array.length - 1 && broadcastType === 'live') {
                from = 0;
                to = 0;
              } else {
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
                  outerParent={outerParent}
                  // handleClick={handleClick}
                  key={i}
                  position={position}
                  width={width}
                  // color={color}
                  duration={duration}
                  totalDuration={totalDuration}
                  i={i}
                  resetSegmentTime={resetSegmentTime}
                  from={from}
                  to={to}
                  dragging={dragging}
                  // deleteSegment={deleteSegment}
                  // actusPlayer={actusPlayer}
                  // isMarker={isMarker}
                />
              );
            })}
          </div>
        </Col>
        <Col className="player-time player-time-right" span={3}>
          {moment(toTimeSlider).format('HH:mm:ss')}
        </Col>
      </Row>

      <Row style={{ pointerEvents: pointerEvents, backgroundColor: '#21232e' }} align="middle">
        <Col span={17}>
          <Row
            style={{ paddingLeft: '1rem', paddingBottom: '1rem', paddingLeft: '1rem' }}
            align="middle"
          >
            <Col>
              <Dropdown overlay={optionsRewind} placement="topCenter" arrow>
                <Button
                  type="text"
                  // onClick={() => handleChangePosition('rewind')}
                  className="control-icon"
                >
                  <UndoOutlined rotate="-180" />
                </Button>
              </Dropdown>
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
                <Dropdown overlay={optionsForward} placement="topCenter" arrow>
                  <Button
                    type="text"
                    onClick={() => handleChangePosition('forward')}
                    className="control-icon"
                  >
                    <RedoOutlined rotate="-180" />
                  </Button>
                </Dropdown>
              </Col>
            )}
            {broadcastType === 'interval' ? null : (
              <>
                {broadcastType !== 'interval' && isLive ? (
                  <Col className="live-play-control" style={{ paddingLeft: '5px' }}>
                    <Button
                      type="text"
                      onClick={() => {
                        if (!mute) setStatus(true);
                        if (mute) setStatus(false);
                        playLive();
                      }}
                      style={{
                        backgroundColor: '#EF233C',
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
                  <Col className="live-play-control" style={{ paddingLeft: '5px' }}>
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
            <Col style={{ flexGrow: '1' }}>
              <div className="awareness-controls">
                <div className="awareness-controls_pin">
                  <div className="controls">
                    <span onClick={addStartPin} className="pin pin-start">
                      [
                    </span>
                    <span onClick={addEndPin} className="pin pin-end">
                      ]
                    </span>
                    <Dropdown overlay={timePreset} placement="topCenter" arrow>
                      <span className="pin pin-custom">5 Min</span>
                    </Dropdown>
                  </div>
                </div>
                <div className="awareness-controls_ticker">
                  <span
                    windowIndex={windowIndex}
                    id={`${channelName}Ticker`}
                    onClick={() => {
                      setvisibleT('');
                      setVisibleB('inactive');
                      setVisibleC('inactive');
                      setvisibleChannel('inactive');
                      // addticker(channelIcon, channelName);
                      let channelDataTicker = {
                        channelIcon,
                        channelName,
                        windowIndex,
                        IMGsrc: [],
                        tickerLength: 0,
                      };
                      let flag = false;
                      let id = '';
                      let size = 0;
                      let IMGsrc = [];
                      if (channelDataTicker) {
                        if (tickerArray.length > 0) {
                          tickerArray.forEach(f => {
                            if (f.channelName === channelDataTicker.channelName) {
                              flag = true;
                              id = f.id;
                              size = f.tickerLength;
                              IMGsrc = f.IMGsrc;
                            }
                          });
                          if (flag === false) {
                            channelDataTicker.id = uuidv4();
                            // setticketId(channelDataTicker.id);
                            dispatch(commonActions.addTicker([...tickerArray, channelDataTicker]));
                            drawTicker(
                              channelDataTicker.id,
                              channelDataTicker.tickerLength,
                              channelDataTicker.IMGsrc
                            );
                          }
                          if (flag === true) {
                            drawTicker(id, size, IMGsrc);
                          }
                        } else {
                          channelDataTicker.id = uuidv4();
                          // setticketId(channelDataTicker.id);
                          dispatch(commonActions.addTicker([...tickerArray, channelDataTicker]));
                          drawTicker(
                            channelDataTicker.id,
                            channelDataTicker.tickerLength,
                            channelDataTicker.IMGsrc
                          );
                        }
                      }
                    }}
                    className="tag tag-ticker"
                  >
                    Ticker
                  </span>
                  <span
                    windowIndex={windowIndex}
                    id={`${channelName}Shot`}
                    onClick={() => {
                      setVisibleB('');
                      setvisibleT('inactive');
                      setVisibleC('inactive');
                      setvisibleChannel('inactive');
                      // addShot(channelIcon, channelName);
                      let channelDataTicker = {
                        channelIcon,
                        channelName,
                        windowIndex,
                        IMGsrc: [],

                        shotLength: 0,
                      };
                      let flag = false;
                      let id = '';
                      let size = 0;
                      let IMGsrc = [];
                      if (channelDataTicker) {
                        if (shotArray.length > 0) {
                          shotArray.forEach(f => {
                            if (f.channelName === channelDataTicker.channelName) {
                              flag = true;
                              id = f.id;
                              size = f.shotLength;
                              IMGsrc = f.IMGsrc;
                            }
                          });
                          if (flag === false) {
                            channelDataTicker.id = uuidv4();
                            dispatch(commonActions.addShot([...shotArray, channelDataTicker]));
                            drawShot(
                              channelDataTicker.id,
                              channelDataTicker.shotLength,
                              channelDataTicker.IMGsrc
                            );
                          }
                          if (flag === true) {
                            drawShot(id, size, IMGsrc);
                          }
                        } else {
                          channelDataTicker.id = uuidv4();
                          dispatch(commonActions.addShot([...shotArray, channelDataTicker]));
                          drawShot(
                            channelDataTicker.id,
                            channelDataTicker.shotLength,
                            channelDataTicker.IMGsrc
                          );
                        }
                      }
                    }}
                    className="tag tag-screen"
                  >
                    Screen
                  </span>
                  {startPin && endPin ? (
                    <span
                      onClick={() => {
                        setVisibleC('');
                        setvisibleT('inactive');
                        setVisibleB('inactive');
                        setvisibleChannel('inactive');
                        clip();
                      }}
                      className="tag tag-clip"
                    >
                      Clip
                    </span>
                  ) : (
                    <span
                      style={{ pointerEvents: 'none' }}
                      onClick={() => {
                        clip();
                      }}
                      className="tag tag-clip"
                    >
                      Clip
                    </span>
                  )}
                </div>
              </div>
            </Col>
          </Row>
        </Col>
        <Col span={7}>
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
                <Button
                  type="text"
                  className="control-icon control-icon-last"
                  onClick={handle.enter}
                >
                  <FontAwesomeIcon icon={faExpand} size="md" />
                </Button>
              </Tooltip>
            </Col>
          </Row>
        </Col>
      </Row>
      <canvas
        style={{ display: 'none' }}
        id={`${channelName}Canvasticker${windowIndex}`}
        ref={canvasRefTicker}
      ></canvas>
      <canvas
        style={{ display: 'none' }}
        id={`${channelName}CanvasShot${windowIndex}`}
        ref={canvasRefShot}
      ></canvas>
    </div>
  );
};
PlayerControls.propTypes = {
  channelIcon: PropTypes.string.isRequired,
  channelName: PropTypes.string.isRequired,
};
export default PlayerControls;
