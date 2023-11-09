import React, { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import { faExpand, faVolumeMute, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import { PauseOutlined } from '@ant-design/icons';
import { Menu, Dropdown, Button, Slider, message as antMessage } from 'antd';
import moment from 'moment';
import { useDispatch } from 'react-redux';

import './PlayerControls.scss';

import { LIVE } from 'constants/strings';
import { TIME_OPTIONS, TOOLTIP_COLORS } from 'constants/options';
import { calculateWidth, timeDifference, createThumbnail } from 'modules/common/utils';
import { updateSegmentTime, createParts } from './utils';
import MarkerPoint from './Marker';
import useConfirm from 'hooks/useConfirm';

import editorActions from 'modules/editor/actions';
import { commonActions } from 'modules/common/actions';
import {
  FastForward,
  FastRewind,
  LeftBracket,
  LeftRewind,
  PlayArrow,
  RightBracket,
  RightRewind,
} from 'assets/icons';

function PlayerControls({
  actusPlayer,
  channelName,
  clbkPlay,
  playerCurrentPosition,
  playerCurrentTime,
  handle,
  windowIndex,
  channelIcon,
  status,
  setStatus,
}) {
  const { confirm } = useConfirm();
  const dispatch = useDispatch();
  const { exportVideo } = useSelector(state => state.editorReducer);

  const [playerVolume, setPlayerVolume] = useState(30);
  const [broadcastType, setBroadcastType] = useState('live');
  const [isLive, setIsLive] = useState(true);
  const [isPlaying, setIsPlaying] = useState(true);
  const [fromTimeSlider, setFromTimeSlider] = useState(0);
  const [toTimeSlider, setToTimeSlider] = useState(0);
  const [liveSeekbarPosition, setLiveSeekbarPosition] = useState(0);
  const [currentSeekbarTime, setCurrentSeekbarTime] = useState(0);
  const [segments, setSegments] = useState([{ time: 0, dragging: false, position: null }]);
  const [markers, setMarkers] = useState([]);
  const [startPin, setStartPin] = useState(false);
  const [endPin, setEndPin] = useState(false);
  const [playerSpeed, setPlayerSpeed] = useState(1);
  const [liveTime, setLiveTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [mute, setMute] = useState(false);
  const [userSelectedDate, setUserSelectedDate] = useState(0);

  const flag = useRef(true);
  let outerParent = useRef(null);
  let outerParentRect;

  const calcTime = () => {
    return (playerCurrentTime - fromTimeSlider) / 1000;
  };

  useEffect(() => {
    if (!actusPlayer) return;
    if (status) {
      actusPlayer.setVolume(0);
      setMute(true);
    }
  }, [actusPlayer, status]);

  useEffect(() => {
    if (outerParent.current) {
      outerParentRect = outerParent.current.getBoundingClientRect();
    }
  }, [outerParent.current]);

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

  const playLive = () => {
    flag.current = true;
    if (!actusPlayer) return;
    if (mute) setStatus(false);
    actusPlayer.playLive(channelName, clbkPlay);
    setIsLive(true);
    // setMute(false);
    setIsPlaying(true);
  };

  const tipFormatter = value => {
    const currentTimeInMillis = fromTimeSlider + value * 1000;
    return moment(currentTimeInMillis).format('HH:mm:ss');
  };

  const onSeekbarChange = value => {
    actusPlayer.setPosition(value);
  };

  const onSeekbarAfterChange = value => {
    // console.log('onAfterChange: ', value);
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

  const changeVolume = value => {
    const volume = value ? value / 100 : 0;
    setPlayerVolume(value);
    if (mute) return;
    actusPlayer.setVolume(volume);
  };

  const toggleMute = () => {
    if (!mute) {
      actusPlayer.setVolume(0);
    } else {
      const volume = playerVolume ? playerVolume / 100 : 0;
      actusPlayer.setVolume(volume);
    }
    setMute(!mute);
  };

  const handleRewind = ({ key }) => {
    actusPlayer.setPosition(playerCurrentPosition - parseInt(key));
    setIsPlaying(true);
    setIsLive(false);
  };

  const handleForward = ({ key }) => {
    const newPosition = liveSeekbarPosition + parseInt(key);
    if (newPosition < liveTime) {
      setIsLive(false);
    } else {
      playLive();
    }
    actusPlayer.setPosition(playerCurrentPosition + parseInt(key));
    setIsPlaying(true);
  };

  const togglePlay = () => {
    !isPlaying ? actusPlayer.play() : actusPlayer.pause();
    setIsPlaying(!isPlaying);
    setPlayerSpeed(1);
    setIsLive(false);
  };

  //// Methods related to segments ///
  const updateSegBoundries = () => {
    let _segments = segments.map(segment => {
      if (segment.position) {
        segment.time = segment.time - TIME_OPTIONS.live * 60;
      }
      return segment;
    });
    setSegments([..._segments]);
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

  const clip = async () => {
    if (segments.length < 3) return antMessage.info('Both start and end pin are required to clip');
    if (exportVideo.actusVideoId) {
      let ifConfirm = await confirm('You will lose your unsaved progress!');
      if (!ifConfirm) return;
      dispatch(editorActions.resetClipData());
    }

    const parts = createParts(segments, fromTimeSlider);
    const data = {
      parts,
      from: parts.from,
      to: parts.to,
      thumbnailPath: createThumbnail(channelName, parts.from),
      channel: channelName,
      // channelLogoPath: channelIcon,
      programDate: broadcastType === 'interval' ? userSelectedDate : moment(parts.from),
      programTimeFrom: moment(parts.from).format('HH:mm'),
      programTimeTo: moment(parts.to).format('HH:mm'),
      programTime: [moment(parts.from).format('hh:mm A'), moment(parts.to).format('hh:mm A')].join(
        ' to '
      ),
      segmentDuration: timeDifference(parts.from, parts.to, 'seconds'),
      anchor: [],
      guests: [],
      timeStamp: parts.from,
    };
    const actusClipData = {
      actusRequest: {
        from: parts.from,
        to: parts.to,
        parts: [parts],
      },
      programName: channelName,
      description: channelName,
      channel: channelName,
    };
    dispatch(editorActions.setProgramData(data));
    dispatch(editorActions.updateByField({ field: 'activeTab', value: '0' }));

    dispatch(editorActions.exportVideo.request(actusClipData));
  };

  const setScreenData = () => {
    const data = {
      channel: channelName,
      channelLogoPath: channelIcon,
      programDate: broadcastType === 'interval' ? userSelectedDate : moment(),
    };
    if (!shotArray?.length) {
      data.timeStamp = playerCurrentTime;
    }
    if (shotArray?.length && shotArray[0].shotLength === 0) {
      data.timeStamp = playerCurrentTime;
    }
    dispatch(editorActions.setScreenData(data));
    dispatch(editorActions.updateByField({ field: 'activeTab', value: '1' }));
  };

  const setTickerData = () => {
    const data = {
      channel: channelName,
      channelLogoPath: channelIcon,
      programDate: broadcastType === 'interval' ? userSelectedDate : moment(),
    };
    if (!tickerArray?.length) {
      data.timeStamp = playerCurrentTime;
    }
    if (tickerArray?.length && tickerArray[0].tickerLength === 0) {
      data.timeStamp = playerCurrentTime;
    }
    dispatch(editorActions.setTickerData(data));
    dispatch(editorActions.updateByField({ field: 'activeTab', value: '2' }));
  };
  //Ticker Starts here
  const { channels } = useSelector(state => state.channelsReducer);

  const [tickerSize, settickerSize] = useState(null);
  const [yAxisOffset, setyAxisOffset] = useState(null);

  const [tickerRatioOfVideo, setTickerRatioOfVideo] = useState('');
  const [xAxisCrop, setxAxisCrop] = useState('');

  const canvasRefTicker = useRef(null);
  const canvasRefShot = useRef(null);

  const { tickerArray, shotArray } = useSelector(state => state.commonReducer);
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
      const tickerData = { id, data: [...IMGsrc, el], sizeCtrl: 1 };
      dispatch(commonActions.addTickerSource(tickerData));
    }
  };
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
    <div className="player-controls-wrapper-news-board" style={{ pointerEvents }}>
      <div className="player-time-wrapper">
        <span className="time start-time">{moment(fromTimeSlider).format('HH:mm:ss')}</span>

        {broadcastType !== 'interval' && isLive ? (
          <Button
            type="text"
            onClick={() => {
              // if (!mute) setStatus(true);

              playLive();
            }}
            style={{
              backgroundColor: '#EF233C',
              color: 'white',
              width: '15px',
              height: '8px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontWeight: '400',
              fontSize: '7px',
              marginRight: 'auto',
            }}
          >
            {/* <PlaySquareTwoTone className="control-icon live-play-icon" twoToneColor="#1EA476" /> */}
            • {LIVE}
          </Button>
        ) : (
          <Button
            type="text"
            onClick={() => {
              // if (!mute) setStatus(true);
              if (mute) setStatus(false);
              playLive();
            }}
            style={{
              backgroundColor: 'inherit',
              color: 'white',
              width: '15px',
              height: '8px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              fontWeight: '400',
              fontSize: '7px',
              marginRight: 'auto',
            }}
          >
            {/* <PlaySquareTwoTone className="control-icon live-play-icon" twoToneColor="#1EA476" /> */}
            <div>{LIVE}</div>
          </Button>
        )}
        <span className="time end-time"> {moment(toTimeSlider).format('HH:mm:ss')}</span>
        <div className="center-content">
          <Button type="text" className="control-icon">
            <FontAwesomeIcon
              style={{ width: '18px' }}
              icon={mute ? faVolumeMute : faVolumeUp}
              size="md"
              onClick={toggleMute}
            />
          </Button>
          <Slider
            style={{ width: '75px', margin: '0px', marginLeft: '5px' }}
            defaultValue={playerVolume}
            step={10}
            min={0}
            max={100}
            // disabled={mute}
            onChange={changeVolume}
          />
        </div>
      </div>

      <div className="slider">
        {broadcastType === 'interval' ? (
          <Slider
            min={0}
            max={(toTimeSlider - fromTimeSlider) / 1000}
            value={playerCurrentPosition}
            onChange={onSeekbarChange}
            onAfterChange={onSeekbarAfterChange}
            tipFormatter={tipFormatter}
          />
        ) : (
          <Slider
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
      </div>

      {/* <div className="control-icons-row">
        <div className="col col-1">
          <Button type="text" className="control-icon">
            <FontAwesomeIcon
              style={{ width: '22.5px' }}
              icon={mute ? faVolumeMute : faVolumeUp}
              size="md"
              onClick={toggleMute}
            />
          </Button>
          <Slider
            style={{ width: '75px', marginLeft: '5px' }}
            defaultValue={playerVolume}
            step={10}
            min={0}
            max={100}
            // disabled={mute}
            onChange={changeVolume}
          />
        </div>
      </div> */}
    </div>
  );
}

export default PlayerControls;
