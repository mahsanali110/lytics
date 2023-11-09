import PropTypes from 'prop-types';
import { Slider, Typography, Image } from 'antd';
import { useHotkeys } from 'react-hotkeys-hook';
import { Card, Timeline } from 'components/Common';
import commonActions from 'modules/common/actions';
import { formatDate } from 'modules/common/utils';
import React, { useEffect, useState } from 'react';
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import { Menu, Dropdown } from 'antd';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { UPDATE_SEGMENT_TIME } from 'modules/common/actions';
import { convertHMS } from 'modules/common/utils';
import DateTimeSelectorControl from '../../MultiView/PlayerControls/DateTimeSelectorControl';

import {
  faCamera,
  faExpand,
  faDownload,
  faPlus,
  faPlusCircle,
  faUndo,
  faRedo,
  faSearchPlus,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Tooltip, Popover } from 'antd';
import {
  PlayIcon,
  PauseIcon,
  ForwardIcon,
  RewindIcon,
  NextIcon,
  PreviousIcon,
  SpeakerIcon,
  MuteIcon,
  SkipIcon,
  AddAnotherIcon,
} from 'assets/icons';
import {
  PLAY_PAUSE,
  MUTE_VOLUME,
  BACKWARD_SPEED,
  FORWARD_SPEED,
  FIRST_FRAME,
  LAST_FRAME,
  FORWARD_30_SECONDS,
  ADD_PIN,
  PLAY_3_SEC,
  PLAY_10_SEC_forward,
  PLAY_10_SEC_backward,
} from 'constants/hotkeys';

import { TOOLTIP_COLORS } from 'constants/options';

const { Text } = Typography;

import './CustomControls.scss';
import { USERS_BASE_URL } from 'constants/config/config.dev';
import { uploadPath } from 'constants/index';

const CustomPlayerControls = ({
  showTimeline,
  markers,
  startTime,
  endTime,
  startSegmentTime,
  endSegmentTime,
  addMarker,
  handleVolume,
  progress,
  channelLogoPath,
  channel,
  programDate,
  variant,
  muted,
  paused,
  scrub,
  volume,
  handlePlaybackRate,
  handleMute,
  handlePosition,
  skip,
  togglePlay,
  handleTimelineClick,
  resetSegmentTime,
  handleSeekbarChange,
  playStorageF,
  playStorageB,
  deleteSegment,
  actusPlayer,
  isMarker,
  isClipper,
  from,
  to,
  setPaused,
  setMuted,
  playerSpeed,
  isQC,
  isOutputSearch,
  status,
  captureScreenshot,
  Vsrc,
}) => {
  const [width, setWidth] = useState('100%');
  var ST = moment(startTime, ['hh:mm:ss A']);

  var ET = moment(endTime, ['hh:mm:ss A']);

  var SST = moment(startSegmentTime ? startSegmentTime : startTime, ['hh:mm:ss A']);
  var EST = moment(endSegmentTime ? endSegmentTime : endTime, ['hh:mm:ss A']);
  const dispatch = useDispatch();
  const segments = useSelector(state => state.commonReducer.segments);
  const { videoDuration, videoCurrentTime } = useSelector(state => state.commonReducer);
  const clbkPlay = response => {
    if (response.error) {
      // console.error(response.error);
      return;
    }
  };
  // console.log(startSegmentTime, endSegmentTime);
  // const s=moment(startSegmentTime,'hh:mm:ss a');
  const s = moment(startSegmentTime ? startSegmentTime : startTime, ['h:mm A']).format('HH:mm:ss');
  const e = moment(endSegmentTime ? endSegmentTime : endTime, ['h:mm A']).format('HH:mm:ss');

  // var duration = moment(e,"HH:mm:ss").diff(moment(s,"HH:mm:ss"));
  var duration = moment.duration(moment(e, 'HH:mm:ss').diff(moment(s, 'HH:mm:ss')));
  var hours = duration.get('hours');
  var minutes = duration.get('minutes');
  var seconds = duration.get('seconds');
  useEffect(() => {
    if (!actusPlayer) return;
    if (isMarker || isQC) return;
    actusPlayer.playStorage(channel, from, to, clbkPlay);
  }, [from, to]);
  const updateSegents = value => {
    let newTime = value * 60;
    let _segments = segments.map((segment, index) => {
      if (index !== segments.length - 1) {
        segment.time = segment.time + newTime;
      }
      return segment;
    });
    dispatch({ type: UPDATE_SEGMENT_TIME, payload: _segments });
  };

  const playStorageFrwd = value => {
    playStorageF(value);
    setPaused(false);
    setMuted(false);
  };

  const playStorageBkwrd = value => {
    playStorageB(value);
    updateSegents(value);
    setPaused(false);
    setMuted(false);
  };
  const menu = (
    <Menu style={{ minWidth: '50px', padding: '5px 10px' }}>
      <Menu.Item onClick={() => playStorageFrwd(10)} key="1">
        10 min
      </Menu.Item>
      <Menu.Item onClick={() => playStorageFrwd(15)} key="2">
        15 min
      </Menu.Item>
      <Menu.Item onClick={() => playStorageFrwd(30)} key="3">
        30 min
      </Menu.Item>
    </Menu>
  );

  const menu2 = (
    <Menu style={{ minWidth: '50px', padding: '5px 10px' }}>
      <Menu.Item onClick={() => playStorageBkwrd(10)} key="1">
        -10 min
      </Menu.Item>
      <Menu.Item onClick={() => playStorageBkwrd(15)} key="2">
        -15 min
      </Menu.Item>
      <Menu.Item onClick={() => playStorageBkwrd(30)} key="3">
        -30 min
      </Menu.Item>
    </Menu>
  );
  const menu3 = (
    <Menu style={{ minWidth: '50px', padding: '5px 10px' }}>
      <Menu.Item onClick={() => skip(-10)} key="1">
        -10 Sec
      </Menu.Item>
      <Menu.Item onClick={() => skip(-20)} key="2">
        -20 Sec
      </Menu.Item>
      <Menu.Item onClick={() => skip(-60)} key="3">
        -1 Min
      </Menu.Item>
      <Menu.Item onClick={() => skip(-180)} key="3">
        -3 Min
      </Menu.Item>
    </Menu>
  );

  const menu4 = (
    <Menu style={{ minWidth: '50px', padding: '5px 10px' }}>
      <Menu.Item onClick={() => skip(10)} key="1">
        +10 Sec
      </Menu.Item>
      <Menu.Item onClick={() => skip(20)} key="2">
        +20 Sec
      </Menu.Item>
      <Menu.Item onClick={() => skip(60)} key="3">
        +1 Min
      </Menu.Item>
      <Menu.Item onClick={() => skip(180)} key="3">
        +3 Min
      </Menu.Item>
    </Menu>
  );
  const menu5 = (
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
  const screenShot = async () => {
    try {
      await actusPlayer.screenshot(channel);
    } catch (error) {
      // console.warn('Unable to switch into full-screen mode.');
    }
  };
  const [visible, setVisible] = useState(false);

  const fullScreen = async () => {
    // console.log(actusPlayer);
    try {
      await actusPlayer.requestFullscreen();
    } catch (error) {
      // console.warn('Unable to switch into full-screen mode.');
    }
  };

  useHotkeys(
    PLAY_PAUSE,
    e => {
      if (!isClipper) return;
      e.preventDefault();
      togglePlay();
    },
    [togglePlay]
  );

  useHotkeys(
    BACKWARD_SPEED,
    e => {
      if (!isClipper) return;
      e.preventDefault();
      handlePlaybackRate(-0.5);
    },
    [handlePlaybackRate]
  );

  useHotkeys(
    FORWARD_30_SECONDS,
    e => {
      if (!isClipper) return;
      e.preventDefault();
      skip();
    },
    [skip]
  );

  useHotkeys(
    FIRST_FRAME,
    e => {
      if (!isClipper) return;
      e.preventDefault();
      handlePosition(-1);
    },
    [handlePosition]
  );

  useHotkeys(
    LAST_FRAME,
    e => {
      if (!isClipper) return;
      e.preventDefault();
      handlePosition(1);
    },
    [handlePosition]
  );

  useHotkeys(
    FORWARD_SPEED,
    e => {
      if (!isClipper) return;
      e.preventDefault();
      handlePlaybackRate(0.5);
    },
    [handlePlaybackRate]
  );

  useHotkeys(
    MUTE_VOLUME,
    e => {
      if (!isClipper) return;
      e.preventDefault();
      handleMute(!muted);
    },
    [handleMute]
  );

  useHotkeys(
    ADD_PIN,
    e => {
      e.preventDefault();
      addMarker();
    },
    [addMarker]
  );
  useHotkeys(
    PLAY_3_SEC,
    e => {
      if (!isClipper) return;
      e.preventDefault();
      skip(-3);
      if (paused) {
        togglePlay();
      }
    },
    [skip]
  );
  useHotkeys(
    PLAY_10_SEC_backward,
    e => {
      if (!isClipper) return;
      e.preventDefault();
      skip(-10);
    },
    [skip]
  );
  useHotkeys(
    PLAY_10_SEC_forward,
    e => {
      if (!isClipper) return;
      e.preventDefault();
      skip(10);
    },
    [skip]
  );

  const content = (
    <div className="controls-wrapper">
      <div className="controls-body">
        <section>
          <div className="channel-wrapper">
            {/* <img src={`${USERS_BASE_URL}/${uploadPath}/${channelLogoPath}`} width="39" height="29" /> */}
            <Image
              style={{ marginTop: 5 }}
              src={
                isClipper ? channelLogoPath : `${USERS_BASE_URL}/${uploadPath}/${channelLogoPath}`
              }
              width={39}
              height={29}
              preview={false}
              fallback="placeholder.png"
            />
            <Text style={{ marginTop: '0.5rem' }} className="text-white large-font-size">
              {channel}
            </Text>
          </div>
        </section>

        <section className="display-flex">
          <section className="controls-right-wrapper player-date-time">
            <Text className="text-white small-font-size-minus">
              {moment(`${hours}:${minutes}:${seconds}`, ['HH:mm:ss']).format('HH:mm:ss')}
            </Text>
            <Text className="text-white small-font-size-minus">
              {formatDate(programDate, 'DD/MM/YYYY')}
            </Text>
          </section>
          {showTimeline && (
            <div className="segment-btn">
              <div className="btn-content" onClick={addMarker}>
                <FontAwesomeIcon
                  icon={faPlusCircle}
                  size="lg"
                  style={{ color: 'white', paddingBottom: '0.3rem' }}
                />
                <Text className="text-white regular-font-size">ADD PIN</Text>
              </div>
            </div>
          )}
        </section>
      </div>

      <div style={{ marginTop: '1rem' }} className={`controls-${variant}`}>
        {(isMarker || isClipper) && showTimeline && (
          <div className="zoom-controls">
            <Dropdown overlay={menu5} placement="topCenter" trigger={['hover']}>
              <FontAwesomeIcon className="zoom-icon" icon={faSearchPlus} size="lg" />
            </Dropdown>
          </div>
        )}
        <div className="player-progress-wrapper">
          <div className="ims-slider" id="ims-slider">
            <Slider
              style={{ width: width }}
              value={progress}
              step={0.1}
              min={0.2}
              max={100}
              tooltipVisible={false}
              onChange={scrub}
            />
            {showTimeline && (
              <div style={{ width: width }} className="timeline-component-wrapper">
                <Timeline
                  handleSeekbarChange={handleSeekbarChange}
                  markers={markers}
                  resetSegmentTime={resetSegmentTime}
                  handleClick={handleTimelineClick}
                  deleteSegment={deleteSegment}
                  actusPlayer={actusPlayer}
                  isMarker={isMarker}
                />{' '}
              </div>
            )}
          </div>
        </div>

        <div className={isClipper || isMarker ? 'time__wrappper' : 'time__wrappper1'}>
          <div>
            {isMarker || isQC || isOutputSearch ? null : (
              <Dropdown disabled={!isClipper} overlay={menu2} trigger={['click']}>
                <FontAwesomeIcon
                  icon={faAngleLeft}
                  style={{ color: 'white', marginRight: '5px', cursor: 'pointer' }}
                  size="lg"
                />
              </Dropdown>
            )}
            <Text
              style={{
                letterSpacing: '0.3rem',

                fontWeight: 'bold',
                display: 'flex',
                justifyContent: 'space-between',
              }}
              className="text-white small-font-size-minus"
            >
              {SST.format('HH:mm:ss')}
            </Text>
          </div>
          <div>
            <Text
              style={{
                letterSpacing: '0.3rem',

                fontWeight: 'bold',
                display: 'flex',
                justifyContent: 'space-between',
              }}
              className="text-white small-font-size-minus"
            >
              {EST.format('HH:mm:ss')}
            </Text>
            {isMarker || isQC || isOutputSearch ? null : (
              <Dropdown disabled={!isClipper} overlay={menu} trigger={['click']}>
                <FontAwesomeIcon
                  icon={faAngleRight}
                  style={{ color: 'white', marginLeft: '5px', cursor: 'pointer' }}
                  size="lg"
                />
              </Dropdown>
            )}
          </div>
        </div>
        <div className="controls-body">
          <section>
            <div className="controls-icons">
              <div className="icon-container">
                {/* <Button type="text"  onClick={screenShot}> */}
                <Dropdown overlay={menu3} trigger={['hover']}>
                  <FontAwesomeIcon className="icon" icon={faUndo} size="sm" />
                </Dropdown>
                {/* </Button> */}
              </div>
              <div className="icon-container" style={{ marginLeft: '3px' }}>
                <Tooltip
                  placement="top"
                  color={TOOLTIP_COLORS[0]}
                  title={isMarker ? 'Rewind (Alt+D)' : 'Slow Forward (Alt + D)'}
                >
                  <RewindIcon
                    className="icon"
                    tabIndex="0"
                    onKeyPress={e => e.key === 'Enter' && handlePlaybackRate(-0.5)}
                    onClick={() => handlePlaybackRate(-0.5)}
                  />
                </Tooltip>
              </div>
              <div className="icon-container">
                {' '}
                <Tooltip placement="top" color={TOOLTIP_COLORS[0]} title="Reverse 1 Sec (Alt + ←)">
                  <PreviousIcon
                    className="icon"
                    tabIndex="0"
                    onKeyPress={e => e.key === 'Enter' && handlePosition(-1)}
                    onClick={() => handlePosition(-1)}
                  />
                </Tooltip>
              </div>
              <div
                className="icon-container"
                role="button"
                tabIndex="0"
                onKeyPress={e => e.key === 'ctrl+e' && togglePlay()}
                onClick={togglePlay}
              >
                <Tooltip
                  placement="top"
                  color={TOOLTIP_COLORS[0]}
                  title={paused ? 'Play (Alt + A)' : 'Pause (Alt + A)'}
                >
                  {paused ? <PlayIcon className="icon" /> : <PauseIcon className="icon" />}
                </Tooltip>
              </div>
              <div
                style={{ marginLeft: '2px' }}
                className="icon-container"
                onKeyPress={e => e.key === 'Enter' && skip(-3)}
                onClick={() => {
                  skip(-3);
                  if (paused) {
                    togglePlay();
                  }
                }}
              >
                {' '}
                <Tooltip placement="top" color={TOOLTIP_COLORS[0]} title="Play 3 Sec (Alt + S)">
                  <SkipIcon style={{ transform: 'scaleX(-1)' }} className="icon" tabIndex="0" />
                </Tooltip>
              </div>
              <div className="icon-container">
                <Tooltip placement="top" color={TOOLTIP_COLORS[0]} title="Forward 1 Sec (Alt + →)">
                  <NextIcon
                    className="icon"
                    tabIndex="0"
                    onKeyPress={e => e.key === 'Enter' && handlePosition(1)}
                    onClick={() => handlePosition(1)}
                  />
                </Tooltip>
              </div>
              <div className="icon-container">
                <Tooltip placement="top" color={TOOLTIP_COLORS[0]} title="Fast Forward (Alt + F)">
                  <ForwardIcon
                    disabled={playerSpeed === 4 ? true : false}
                    className="icon"
                    tabIndex="0"
                    onKeyPress={e => e.key === 'Enter' && handlePlaybackRate(0.5)}
                    onClick={() => handlePlaybackRate(0.5)}
                  />
                </Tooltip>
              </div>
              <div className="icon-container">
                {/* <Button type="text"  onClick={screenShot}> */}
                <Dropdown overlay={menu4} trigger={['hover']}>
                  <FontAwesomeIcon className="icon" icon={faRedo} size="sm" />
                </Dropdown>
                {/* </Button> */}
              </div>

              <div className="icon-container" style={{ cursor: 'auto' }}>
                <span class="player-speed" style={{ cursor: 'auto' }}>
                  {
                    <>
                      <span
                        style={{
                          fontSize: '16.5px',
                          marginLeft: '-5px',
                        }}
                      >{`${playerSpeed} `}</span>
                      &nbsp;
                      <span>{` x`}</span>
                    </>
                  }
                </span>
              </div>
            </div>
          </section>
          <section className="controls-right-wrapper volume-wrapper controls-icons ml-relative">
            <section>
              <div>
                {/* {isClipper && (
                  <Tooltip placement="top" color={TOOLTIP_COLORS[0]} title="Capture">
                    <Button type="text" className="control-icon" onClick={screenShot}>
                      <FontAwesomeIcon icon={faCamera} size="lg" />
                    </Button>
                  </Tooltip>
                )}
                {isQC && (
                  <Tooltip placement="top" color={TOOLTIP_COLORS[0]} title="Fullscreen">
                    <Button type="text" className="control-icon" onClick={fullScreen}>
                      <FontAwesomeIcon icon={faExpand} size="lg" />
                    </Button>
                  </Tooltip>
                )} */}
                <Tooltip placement="top" color={TOOLTIP_COLORS[0]} title="Fullscreen">
                  <Button type="text" className="control-icon" onClick={fullScreen}>
                    <FontAwesomeIcon icon={faExpand} size="lg" />
                  </Button>
                </Tooltip>
                {/* <Tooltip placement="top" title="Download Video">
                  <Button type="text" className="control-icon">
                    <a href={Vsrc} download>
                      <FontAwesomeIcon icon={faDownload} size="lg" />
                    </a>
                  </Button>
                </Tooltip> */}
              </div>
            </section>
            <div className="palyer-volume-container">
              <Slider
                value={volume}
                step={0.05}
                min={0}
                max={1}
                tooltipVisible={false}
                onChange={handleVolume}
                disabled={muted}
              />
            </div>
            <div
              className="icon-container"
              onClick={() => handleMute(!muted)}
              style={{ marginRight: isQC || isOutputSearch ? '10px' : '0px' }}
            >
              {muted ? (
                <MuteIcon style={{ outline: 'none' }} tabIndex="0" />
              ) : (
                <SpeakerIcon style={{ outline: 'none' }} tabIndex="0" />
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
  let pointerEvents;
  if (isClipper) {
    pointerEvents = status ? 'initial' : 'none';
  }
  return (
    <div style={{ pointerEvents: pointerEvents }} className="controls-wrapper">
      <Card bg="light" content={content} />
    </div>
  );
};

CustomPlayerControls.defaultProps = {
  isMarker: false,
  isClipper: false,
};

export default CustomPlayerControls;
