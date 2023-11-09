import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import './LibraryPlayerControls2.0.scss';
import { Card } from 'components/Common';
import { useHotkeys } from 'react-hotkeys-hook';
import { TOOLTIP_COLORS } from 'constants/options';
import {
  SpeakerIcon,
  MuteIcon,
  PlayC,
  PreviousC,
  NextC,
  UndoC,
  RedoC,
  ForwardTen,
  BackwardTen,
} from 'assets/icons';
import { UPDATE_SEGMENT_TIME } from 'modules/common/actions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Slider, Typography, Menu, Dropdown, Tooltip, Button, Row, Col } from 'antd';
import { faPause, faExpand, faVolumeMute, faVolumeUp } from '@fortawesome/free-solid-svg-icons';

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

const { Text } = Typography;

const LibraryPlayerControls = ({
  startTime,
  endTime,
  startSegmentTime,
  endSegmentTime,
  addMarker,
  handleVolume,
  progress,
  channel,
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
  playStorageF,
  playStorageB,
  actusPlayer,
  isClipper,
  from,
  to,
  setPaused,
  setMuted,
  playerSpeed,
  duration,
  currentTime,
  status,
  pointerEvents,
}) => {
  const [width, setWidth] = useState('100%');
  const [videoSpeed, setVideoSpeed] = useState(playerSpeed);
  const [time, settime] = useState('00:00');
  const dispatch = useDispatch();
  const segments = useSelector(state => state.commonReducer.segments);
  const clbkPlay = response => {
    if (response.error) {
      return;
    }
  };

  function timeCheck(value) {
    if (Math.floor(value) <= 3600 && value != null) {
      var MMSS = new Date(value * 1000).toISOString().substring(14, 19);
      return MMSS;
    } else {
      let hours = Math.floor(value / 3600);
      value %= 3600;
      let minutes = Math.floor(value / 60);
      let seconds = value % 60;
      // If you want strings with leading zeroes:
      minutes = String(minutes).padStart(2, '0');
      hours = String(hours).padStart(2, '0');
      seconds = String(seconds).padStart(2, '0');
      let secondConverted = Math.floor(seconds);
      if (secondConverted < 10) {
        secondConverted = '0' + secondConverted;
      }
      if (hours === '00' && duration < 3600) {
        return minutes + ':' + secondConverted; // Return is MM : SS
      } else {
        return hours + ':' + minutes + ':' + secondConverted; // Return is HH : MM : SS
      }
    }
  }
  const s = moment(startSegmentTime ? startSegmentTime : startTime, ['h:mm A']).format('HH:mm:ss');
  const e = moment(endSegmentTime ? endSegmentTime : endTime, ['h:mm A']).format('HH:mm:ss');

  function convertHMS(value) {
    const sec = value; // convert value to number if it's string
    let hourss = Math.floor(sec / 3600); // get hours
    let minutess = Math.floor((sec - hourss * 3600) / 60); // get minutes
    let secondss = sec - hourss * 3600 - minutess * 60; //  get seconds
    let secondConverted = Math.floor(secondss);
    // add 0 if value < 10; Example: 2 => 02

    if (hourss < 10) {
      hourss = '0' + hourss;
    }
    if (minutess < 10) {
      minutess = '0' + minutess;
    }
    if (secondConverted < 10) {
      secondConverted = '0' + secondConverted;
    }
    if (hourss === '00' && duration < 3600) {
      return minutess + ':' + secondConverted; // Return is HH : MM : SS
    } else {
      return hourss + ':' + minutess + ':' + secondConverted; // Return is HH : MM : SS
    }
  }

  useEffect(() => {
    if (!actusPlayer) {
      return;
    } else if (from === undefined || to === undefined) {
      return;
    } else {
      actusPlayer.playStorage(channel, from, to, clbkPlay);
    }
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
    <Menu style={{ minWidth: '50px', padding: '5px 10px 5px 0px', backgroundColor: '#2F395E' }}>
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
    <Menu style={{ minWidth: '50px', padding: '5px 10px 5px 0px', backgroundColor: '#2F395E' }}>
      <Menu.Item onClick={() => skip(-10)} key="1" className="menuItem_dropDown_menu5">
        -10 Sec
      </Menu.Item>
      <Menu.Item onClick={() => skip(-20)} key="2" className="menuItem_dropDown_menu5">
        -20 Sec
      </Menu.Item>
      <Menu.Item onClick={() => skip(-60)} key="3" className="menuItem_dropDown_menu5">
        -1 Min
      </Menu.Item>
      <Menu.Item onClick={() => skip(-180)} key="3" className="menuItem_dropDown_menu5">
        -3 Min
      </Menu.Item>
      <Menu.Item onClick={() => skip(-300)} key="3" className="menuItem_dropDown_menu5">
        -5 Min
      </Menu.Item>
    </Menu>
  );

  const menu4 = (
    <Menu style={{ minWidth: '50px', padding: '5px 10px 5px 0px', backgroundColor: '#2F395E' }}>
      <Menu.Item onClick={() => skip(10)} key="1" className="menuItem_dropDown_menu5">
        +10 Sec
      </Menu.Item>
      <Menu.Item onClick={() => skip(20)} key="2" className="menuItem_dropDown_menu5">
        +20 Sec
      </Menu.Item>
      <Menu.Item onClick={() => skip(60)} key="3" className="menuItem_dropDown_menu5">
        +1 Min
      </Menu.Item>
      <Menu.Item onClick={() => skip(180)} key="3" className="menuItem_dropDown_menu5">
        +3 Min
      </Menu.Item>
      <Menu.Item onClick={() => skip(300)} key="3" className="menuItem_dropDown_menu5">
        +5 Min
      </Menu.Item>
    </Menu>
  );
  const menu5 = (
    <Menu style={{ minWidth: '50px', padding: '5px 10px 5px 0px', backgroundColor: '#2F395E' }}>
      <Menu.Item
        onClick={() => {
          setVideoSpeed('1');
          handlePlaybackRate(1);
        }}
        key="1"
        className="menuItem_dropDown_menu5"
      >
        <span style={{ marginRight: '12px', fontSize: '15px' }}>x</span>
        <span>1</span>
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          setVideoSpeed('2');
          handlePlaybackRate(2);
        }}
        key="2"
        className="menuItem_dropDown_menu5"
      >
        <span style={{ marginRight: '12px', fontSize: '15px' }}>x</span>
        <span>2</span>
      </Menu.Item>
      <Menu.Item
        onClick={() => {
          setVideoSpeed('4');
          handlePlaybackRate(4);
        }}
        key="3"
        className="menuItem_dropDown_menu5"
      >
        <span style={{ marginRight: '12px', fontSize: '15px' }}>x</span>
        <span>4</span>
      </Menu.Item>
    </Menu>
  );
  const [playerTimer, setPlayerTimer] = useState('12:00'); //Player Timer State
  const fullScreen = async () => {
    try {
      await actusPlayer.requestFullscreen();
    } catch (error) {}
  };

  // useHotkeys(
  //   PLAY_PAUSE,
  //   e => {
  //     e.preventDefault();
  //     togglePlay();
  //   },
  //   [togglePlay]
  // );

  // useHotkeys(
  //   BACKWARD_SPEED,
  //   e => {
  //     e.preventDefault();
  //     handlePlaybackRate(-0.5);
  //   },
  //   [handlePlaybackRate]
  // );

  // useHotkeys(
  //   FORWARD_30_SECONDS,
  //   e => {
  //     e.preventDefault();
  //     skip();
  //   },
  //   [skip]
  // );

  // useHotkeys(
  //   FIRST_FRAME,
  //   e => {
  //     e.preventDefault();
  //     handlePosition(-1);
  //   },
  //   [handlePosition]
  // );

  // useHotkeys(
  //   LAST_FRAME,
  //   e => {
  //     e.preventDefault();
  //     handlePosition(1);
  //   },
  //   [handlePosition]
  // );

  // useHotkeys(
  //   FORWARD_SPEED,
  //   e => {
  //     e.preventDefault();
  //     handlePlaybackRate(0.5);
  //   },
  //   [handlePlaybackRate]
  // );

  // useHotkeys(
  //   MUTE_VOLUME,
  //   e => {
  //     e.preventDefault();
  //     handleMute(!muted);
  //   },
  //   [handleMute]
  // );

  // useHotkeys(
  //   ADD_PIN,
  //   e => {
  //     e.preventDefault();
  //     addMarker();
  //   },
  //   [addMarker]
  // );
  // useHotkeys(
  //   PLAY_3_SEC,
  //   e => {
  //     e.preventDefault();
  //     skip(-3);
  //     if (paused) {
  //       togglePlay();
  //     }
  //   },
  //   [skip]
  // );
  // useHotkeys(
  //   PLAY_10_SEC_backward,
  //   e => {
  //     e.preventDefault();
  //     skip(-10);
  //   },
  //   [skip]
  // );
  // useHotkeys(
  //   PLAY_10_SEC_forward,
  //   e => {
  //     e.preventDefault();
  //     skip(10);
  //   },
  //   [skip]
  // );

  const content = (
    <div className="short-controls-wrapper">
      <div className="speed-btn-container">
        <div className="channel-wrapper channel-playtime">
          <Text
            style={{
              fontFamily: 'Roboto',
              fontStyle: 'normal',
              letterSpacing: '0.5px',
              lineHeight: '15px',
              color: '#FFFFFF;',
              fontWeight: '400',
              display: 'flex',
              justifyContent: 'space-between',
            }}
            className="text-white small-font-size-minus"
          >
            {` ${convertHMS(currentTime)} / ${timeCheck(duration)}`}
          </Text>
        </div>
        {/* <section className="speed-btn">
          <Dropdown overlay={menu5} trigger={['hover']}>
            <div className="icon-container" style={{ cursor: 'auto' }}>
              <span class="player-speed" style={{ cursor: 'auto' }}>
                <span>{`${videoSpeed} x`}</span>
              </span>
            </div>
          </Dropdown>
        </section> */}
      </div>
      <div className={`controls-${variant}`}>
        <div className="controls_div control-div">
          <div className="player-volume-container">
            {muted ? (
              <MuteIcon
                style={{ outline: 'none' }}
                height={22}
                width={22}
                tabIndex="0"
                onClick={() => {
                  setMuted(!muted);
                  handleMute(!muted);
                }}
              />
            ) : (
              <SpeakerIcon
                style={{ outline: 'none' }}
                height={22}
                width={22}
                tabIndex="0"
                onClick={() => {
                  setMuted(!muted);
                  handleMute(!muted);
                }}
              />
            )}
            <div className="ims-slider2">
              <Slider
                style={{ width: '100%' }}
                value={volume}
                step={0.05}
                min={0}
                max={1}
                tooltipVisible={false}
                onChange={handleVolume}
                disabled={muted}
              />
            </div>
          </div>
          <div style={{ width: '50%' }}>
            <section>
              <div
                className="controls-icons"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between ',
                  alignItems: 'center',
                  gap: '5%',
                  color: 'white',
                }}
              >
                <div className="icon-container">
                  <Dropdown overlay={menu3} trigger={['hover']}>
                    <UndoC tabIndex="0" style={{ cursor: 'pointer' }} />
                  </Dropdown>
                </div>
                <div className="icon-container">
                  <PreviousC
                    tabIndex="0"
                    onKeyPress={e => e.key === 'Enter' && handlePosition(-1)}
                    onClick={() => scrub(0)}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
                <div
                  className="icon-container"
                  role="button"
                  tabIndex="0"
                  onKeyPress={e => e.key === 'ctrl+e' && togglePlay()}
                  onClick={togglePlay}
                >
                  {/* <Tooltip
                    placement="top"
                    color={TOOLTIP_COLORS[0]}
                    title={paused ? 'Play (Alt + A)' : 'Pause (Alt + A)'}
                  > */}
                  {paused ? (
                    <PlayC
                      tabIndex="0"
                      style={{ cursor: 'pointer', width: '15.67px', height: '17.92px' }}
                      className="play-icon"
                    />
                  ) : (
                    <FontAwesomeIcon
                      className="icon"
                      icon={faPause}
                      size="lg"
                      style={{ cursor: 'pointer' }}
                    />
                  )}
                  {/* </Tooltip> */}
                </div>
                <div className="icon-container">
                  <NextC
                    tabIndex="0"
                    onKeyPress={e => e.key === 'Enter' && handlePosition(-1)}
                    onClick={() => scrub(100)}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
                <div className="icon-container">
                  <Dropdown overlay={menu4} trigger={['hover']}>
                    <RedoC tabIndex="0" style={{ cursor: 'pointer' }} />
                  </Dropdown>
                </div>
              </div>
            </section>
          </div>
          <div style={{ display: 'flex', justifyContent: 'end', width: '25%' }}>
            <section className="controls-right-wrapper volume-wrapper ml-relative">
              <div
              // style={{
              //   width: '120px',
              //   display: 'flex',
              //   justifyContent: 'flex-end',
              //   alignItems: 'center',
              // }}
              >
                <Tooltip placement="top" color={TOOLTIP_COLORS[0]} title="Fullscreen">
                  <FontAwesomeIcon
                    icon={faExpand}
                    size="lg"
                    style={{ color: 'aliceblue', cursor: 'pointer' }}
                    onClick={fullScreen}
                  />
                </Tooltip>
              </div>
            </section>
          </div>
        </div>
        <div className="player-progress-wrapper control-div">
          <div className="ims-slider" id="ims-slider">
            <Slider
              value={progress}
              step={0.1}
              min={0.2}
              max={100}
              tooltipVisible={false}
              onChange={scrub}
            />
          </div>
        </div>
        <div className="controls_div control-div">
          <div className="player-volume-container">
            {muted ? (
              <MuteIcon
                style={{ outline: 'none' }}
                height={22}
                width={22}
                tabIndex="0"
                onClick={() => {
                  setMuted(!muted);
                  handleMute(!muted);
                }}
              />
            ) : (
              <SpeakerIcon
                style={{ outline: 'none' }}
                height={22}
                width={22}
                tabIndex="0"
                onClick={() => {
                  setMuted(!muted);
                  handleMute(!muted);
                }}
              />
            )}
            <div className="ims-slider2">
              <Slider
                style={{ width: '100%' }}
                value={volume}
                step={0.05}
                min={0}
                max={1}
                tooltipVisible={false}
                onChange={handleVolume}
                disabled={muted}
              />
            </div>
          </div>
          <div style={{ width: '50%' }}>
            <section>
              <div
                className="controls-icons"
                style={{
                  display: 'flex',
                  justifyContent: 'space-between ',
                  alignItems: 'center',
                  gap: '5%',
                  color: 'white',
                }}
              >
                <div className="icon-container">
                  <Dropdown overlay={menu3} trigger={['hover']}>
                    <UndoC tabIndex="0" style={{ cursor: 'pointer' }} />
                  </Dropdown>
                </div>
                <div className="icon-container">
                  <PreviousC
                    tabIndex="0"
                    onKeyPress={e => e.key === 'Enter' && handlePosition(-1)}
                    onClick={() => scrub(0)}
                    style={{ cursor: 'pointer' }}
                  />
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
                    {paused ? (
                      <PlayC
                        tabIndex="0"
                        style={{ cursor: 'pointer', width: '15.67px', height: '17.92px' }}
                        className="play-icon"
                      />
                    ) : (
                      <FontAwesomeIcon
                        className="icon"
                        icon={faPause}
                        size="lg"
                        style={{ cursor: 'pointer' }}
                      />
                    )}
                  </Tooltip>
                </div>
                <div className="icon-container">
                  <NextC
                    tabIndex="0"
                    onKeyPress={e => e.key === 'Enter' && handlePosition(-1)}
                    onClick={() => scrub(100)}
                    style={{ cursor: 'pointer' }}
                  />
                </div>
                <div className="icon-container">
                  <Dropdown overlay={menu4} trigger={['hover']}>
                    <RedoC tabIndex="0" style={{ cursor: 'pointer' }} />
                  </Dropdown>
                </div>
              </div>
            </section>
          </div>
          <div style={{ display: 'flex', justifyContent: 'end', width: '25%' }}>
            <section className="controls-right-wrapper volume-wrapper ml-relative">
              <div
              // style={{
              //   width: '120px',
              //   display: 'flex',
              //   justifyContent: 'flex-end',
              //   alignItems: 'center',
              // }}
              >
                <Tooltip placement="top" color={TOOLTIP_COLORS[0]} title="Fullscreen">
                  <FontAwesomeIcon
                    icon={faExpand}
                    size="lg"
                    style={{ color: 'aliceblue', cursor: 'pointer' }}
                    onClick={fullScreen}
                  />
                </Tooltip>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <div className="short-controls-wrapper" style={{ pointerEvents: pointerEvents }}>
      <Row style={{ alignItems: 'center', flexWrap: 'nowrap' }}>
        <Col style={{ flexBasis: '25%' }}>
          <Text
            style={{
              fontFamily: 'Roboto',
              fontStyle: 'normal',
              letterSpacing: '0.5px',
              lineHeight: '15px',
              color: '#FFFFFF;',
              fontWeight: '400',
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '12px',
            }}
            className="text-white small-font-size-minus"
          >
            {` ${convertHMS(currentTime)} / ${timeCheck(duration)}`}
          </Text>
        </Col>
        <Col style={{ flexBasis: '50%' }} className="center-content">
          <Row gutter={16} className="short__player-controls-buttons">
            <Col>
              <div className="icon-container">
                <BackwardTen
                  tabIndex="0"
                  style={{ cursor: 'pointer', width: '14px', height: '16px' }}
                  onClick={() => skip(-10)}
                />
              </div>
            </Col>
            <Col>
              <div
                className="icon-container"
                role="button"
                tabIndex="0"
                onKeyPress={e => e.key === 'ctrl+e' && togglePlay()}
                onClick={togglePlay}
              >
                {/* <Tooltip
                  placement="top"
                  color={TOOLTIP_COLORS[0]}
                  title={paused ? 'Play (Alt + A)' : 'Pause (Alt + A)'}
                > */}
                {paused ? (
                  <PlayC
                    tabIndex="0"
                    style={{ cursor: 'pointer', width: '14px', height: '16px' }}
                    className="play-icon"
                  />
                ) : (
                  <FontAwesomeIcon
                    className="icon"
                    icon={faPause}
                    size="lg"
                    style={{ cursor: 'pointer', width: '14px', height: '16px' }}
                  />
                )}
                {/* </Tooltip> */}
              </div>
            </Col>
            <Col>
              <div className="icon-container">
                <ForwardTen
                  tabIndex="0"
                  style={{ cursor: 'pointer', width: '14px', height: '16px' }}
                  onClick={() => skip(10)}
                />
              </div>
            </Col>
          </Row>
        </Col>
        <Col style={{ flexBasis: '25%' }} className="justify-end">
          <div className="center-content">
            <Button type="text" className="control-icon-volume">
              <FontAwesomeIcon
                style={{ width: '18px' }}
                icon={muted ? faVolumeMute : faVolumeUp}
                size="md"
                onClick={() => {
                  setMuted(!muted);
                  handleMute(!muted);
                }}
              />
            </Button>
            <Slider
              style={{ width: '75px', margin: '0px', marginLeft: '10px' }}
              className="volume-slider"
              value={volume}
              step={0.1}
              min={0.2}
              max={1}
              tooltipVisible={false}
              // disabled={muted}
              onChange={handleVolume}
            />
          </div>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Slider
            className="progress-slider"
            value={progress}
            step={0.1}
            min={0.2}
            max={100}
            tooltipVisible={false}
            onChange={scrub}
          />
        </Col>
      </Row>
    </div>
  );
};

LibraryPlayerControls.defaultProps = {
  isMarker: false,
  isClipper: false,
};

export default LibraryPlayerControls;
