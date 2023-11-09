import { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { FullScreen, useFullScreenHandle } from 'react-full-screen';
import { useDispatch, useSelector } from 'react-redux';

import { CLIPPER_SEGMENT_COLORS } from 'constants/options';
import { calculateWidth, formatDate } from 'modules/common/utils';

import { ActusPlayer, CustomPlayerControls } from 'components/Common';
import {
  ADD_SEGMENT,
  UPDATE_SEGMENT_TIME,
  DELETE_SEGMENT,
  UPDATE_SEGMENT_COLOR,
} from '../modules/common/actions';

const useActusPlayer = ({
  isLive,
  channelName,
  from,
  to,
  channelLogoPath,
  programDate,
  ...rest
}) => {
  const actusPlayerRef = useRef(null);
  const [actusPlayer, setActusPlayer] = useState(null);
  const [playerSpeed, setPlayerSpeed] = useState(1);
  const [playerCurrentPosition, setPlayerCurrentPosition] = useState(0);
  const [play, setplay] = useState(false);
  const [paused, setPaused] = useState(false);
  const [muted, setMuted] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const [progress, setProgress] = useState(0);
  // const [segments, setSegments] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [status, setStatus] = useState(false);
  const segments = useSelector(state => state.commonReducer.segments);

  const handle = useFullScreenHandle();

  const dispatch = useDispatch();
  useEffect(() => {
    if (!actusPlayer) return;
    if (status === true) {
      actusPlayer.setVolume(volume);
      togglePlay();
    }
  }, [actusPlayer, status]);

  useEffect(() => {
    if (!actusPlayerRef.current) return;
    setActusPlayer(actusPlayerRef.current);
  }, [actusPlayerRef.current]);
  // useEffect(() => {
  //   if (!actusPlayer) return;
  //   actusPlayer.pause();
  // }, [actusPlayer]);
  useEffect(() => {
    if (!actusPlayer) return;
    actusPlayer.connectToServer('administrator', 'actus', clbkLogin);
  }, [actusPlayer]);

  useEffect(() => {
    if (!actusPlayer) return;
    paused ? actusPlayer.pause() : actusPlayer.play();
  }, [paused, actusPlayer]);

  useEffect(() => {
    handleSeekbarChange(playerCurrentPosition);
  }, [playerCurrentPosition]);

  useEffect(() => {
    if (!to || !from) return;
    const duration = moment.duration(to.diff(from));
    if (!isFinite(duration)) return;

    const durationAsSeconds = duration.asSeconds();
    setDurationAsSeconds(durationAsSeconds);
    // setSegments([
    //   {
    //     time: durationAsSeconds,
    //     color: CLIPPER_SEGMENT_COLORS[0],
    //     active: true,
    //   },
    // ]);
  }, [to, from]);
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
          duration: durationAsSeconds,
        });
        let actualWidth = currentWidth - prevTotal;
        prevTotal += actualWidth;
        console.log({ segment });
        return {
          width: actualWidth,
          color: segment.color,
          duration: segment.time,
          dragging: segment.dragging,
        };
      });
    setMarkers(_markers);
  }, [segments]);

  useEffect(() => {}, [isLive]);

  const clbkLogin = response => {
    if (response.error) {
      console.error(response.error);
      actusPlayer.connectToServer('administrator', 'actus', clbkLogin);
      return;
    }

    isLive ? playLive() : playStorage();
    // setChannelName(actusPlayer.availableChannels.channels[0].name);
  };
  const playLive = () =>
    actusPlayer.playLive(actusPlayer.availableChannels.channels[0].name, clbkFunction);

  const playStorage = () => {
    actusPlayer.playStorage(channelName, from, to, clbkFunction);
  };

  const clbkFunction = response => {};

  const onStatusChange = status => {
    if (status == '') {
      // show error if want to
      return;
    }
    if (status.date_time_position) {
      setplay(status.playing);
      setStatus(true);
    }
    setPlayerCurrentPosition(status.position);
    // console.log('>>', status.volume);
    // setVolume(status.volume);
    // actusPlayer.setVolume(value);
    // volume = status.volume;
  };

  const [durationAsSeconds, setDurationAsSeconds] = useState(0);

  // Player controls
  const handleVolume = value => {
    setVolume(value);
    if (value > 0) {
      handleMute(false);
      actusPlayer.setVolume(value);
    }
    if (value === 0) handleMute(true);
  };

  const handleMute = mute => {
    setMuted(mute);
    mute ? actusPlayer.setVolume(0) : actusPlayer.setVolume(volume);
  };

  const scrub = percent => {
    if (!isFinite(durationAsSeconds)) return;

    setProgress(percent);

    const scrubTime = (durationAsSeconds / 100) * percent;

    actusPlayer.setPosition(scrubTime);
  };

  const handleSeekbarChange = currentTime => {
    if (!actusPlayer) return;
    const percent = (currentTime / durationAsSeconds) * 100;
    setProgress(percent);
  };
  const togglePlay = () => {
    setPlayerSpeed(1);
    setPaused(!paused);
  };

  const skip = value => {
    actusPlayer.setPosition(playerCurrentPosition + value);
    // setPaused(true);
    //.currentTime += 25;
  };

  const handlePlaybackRate = value => {
    if (!actusPlayer) return;
    // const percent = ((playerCurrentPosition + value) / durationAsSeconds) * 100;
    // setProgress(percent);
    // actusPlayer.setPosition(playerCurrentPosition + value);

    setPaused(false);
    if (value === 0.5) {
      if (playerSpeed * 2 > 4) return;
      if (playerSpeed < 0) {
        let speed = 1;
        setPlayerSpeed(speed * 2);
      } else {
        setPlayerSpeed(playerSpeed * 2);
      }

      actusPlayer.fastForward();
    } else {
      if (playerSpeed * 2 < -4) return;
      if (playerSpeed >= 1) {
        let speed = -1;
        setPlayerSpeed(speed);
      } else {
        setPlayerSpeed(playerSpeed * 2);
      }
      actusPlayer.fastBackward();
    }
  };

  const handlePosition = value => {
    if (!actusPlayer) return;
    if (value === 'start') {
      actusPlayer.setPosition(0);
    } else if (value === 'end') {
      actusPlayer.setPosition(durationAsSeconds);
    } else {
      const percent = ((playerCurrentPosition + value) / durationAsSeconds) * 100;
      setProgress(percent);
      actusPlayer.setPosition(playerCurrentPosition + value);
    }
  };

  // Funtional to update the current time of the marker
  const resetSegmentTime = (currentTime, index) => {
    let _currentTime = currentTime === +999 ? playerCurrentPosition : currentTime;
    if (_currentTime < 0) _currentTime = 0;
    if (_currentTime > durationAsSeconds) _currentTime = durationAsSeconds - 1;
    let _segments = segments.map((segment, i) => {
      if (index === i) {
        // console.log({ _currentTime });
        segment.time = _currentTime !== undefined ? _currentTime : segment.time;
      }
      return segment;
    });
    let sortedSegments = [..._segments].sort((a, b) => {
      if (a.time > b.time) return 1;
      if (a.time < b.time) return -1;

      return 0;
    });
    // setSegments(sortedSegments);
    dispatch({ type: UPDATE_SEGMENT_TIME, payload: [...sortedSegments] });
  };

  // Funtion to delete marker
  const deleteSegment = index => {
    if (index === 0 && segments.length === 1) return;
    let _segments = segments;
    _segments.splice(index, 1);
    // setSegments([..._segments]);
    dispatch({ type: DELETE_SEGMENT, payload: [..._segments] });
  };

  const addMarker = () => {
    if (!playerCurrentPosition) return;

    const segment = {
      time: playerCurrentPosition,
      color: CLIPPER_SEGMENT_COLORS[0],
      active: true,
      dragging: true,
    };
    let _segments = [...segments, segment].sort((a, b) => {
      if (a.time > b.time) return 1;
      if (a.time < b.time) return -1;

      return 0;
    });

    // setSegments(_segments);
    dispatch({ type: ADD_SEGMENT, payload: _segments });
  };

  const handleTimelineClick = time => {
    const colors = { true: CLIPPER_SEGMENT_COLORS[0], false: CLIPPER_SEGMENT_COLORS[1] };
    let updatedSegments = segments.map(segment => {
      return segment.time === time
        ? { ...segment, active: !segment.active, color: colors[!segment.active] }
        : segment;
    });

    // setSegments(updatedSegments);
    dispatch({ type: UPDATE_SEGMENT_COLOR, payload: updatedSegments });
  };

  return {
    ActusPlayer: (
      <div>
        {' '}
        <div className="actus-wrapper">
          <div className="actus-player-container">
            <FullScreen handle={handle}>
              <ActusPlayer actusPlayer={actusPlayerRef} onStatusChange={onStatusChange} />
            </FullScreen>
          </div>
        </div>
        <CustomPlayerControls
          actusPlayer={actusPlayer}
          showTimeline
          markers={markers}
          handleTimelineClick={handleTimelineClick}
          startTime={formatDate(from, 'hh:mm:ss A')}
          endTime={formatDate(to, 'hh:mm:ss A')}
          addMarker={addMarker}
          resetSegmentTime={resetSegmentTime}
          deleteSegment={deleteSegment}
          handleSeekbarChange={handleSeekbarChange}
          handleVolume={handleVolume}
          progress={progress}
          channelLogoPath={channelLogoPath}
          channel={channelName}
          programDate={programDate}
          variant="secondary"
          muted={muted}
          paused={paused}
          scrub={scrub}
          handlePlaybackRate={handlePlaybackRate}
          handleMute={handleMute}
          handlePosition={handlePosition}
          skip={skip}
          togglePlay={togglePlay}
          volume={volume}
          from={from}
          to={to}
          setPaused={setPaused}
          setMuted={setMuted}
          playerSpeed={playerSpeed}
          isClipper={true}
          status={status}
          {...rest}
        />
      </div>
    ),
    actusPlayer,
    actusPlayerRef,
    playerCurrentPosition,
    onStatusChange,
    paused,
    muted,
    volume,
    progress,
    handleVolume,
    handleMute,
    scrub,
    addMarker,
    markers,
    togglePlay,
    segments,
    handleSeekbarChange,
    setPlayerCurrentPosition,
    play,
  };
};

export default useActusPlayer;
