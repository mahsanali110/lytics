import { useState, useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Slider, Typography, Image } from 'antd';
import LibraryPlayerControls from '../LibraryPlayerControls/LibraryPlayerControls';
import { Timeline, CustomPlayerControls, LibraryPlayerControls2 } from 'components/Common';
import reloadImage from 'assets/images/playerBg.jpg';
import commonActions from 'modules/common/actions';
import { USERS_BASE_URL } from 'constants/config';

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

const { Text } = Typography;
import './VideoPlayer.scss';
import { formatDate } from 'modules/common/utils';

const VideoPlayer = ({
  variant,
  src,
  showTimeline,
  markers,
  addMarker,
  resetSegmentTime,
  deleteSegment,
  programInfo: { channelLogoPath, thumbnailPath, programTime, programDate, channel, segmentTime },
  isQC,
  isMarker,
  isOutputSearch,
  isClient,
  setPlayCheck,
  isLibrary,
  shortPlayerControls,
  handlePreviewPlaying,
  isPreviewPlaying,
  ...rest
}) => {
  const [paused, setPaused] = useState(true);
  const [muted, setMuted] = useState(false);
  const [controlHide, setControlHide] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [progress, setProgress] = useState(0);
  const [startTime, endTime] = programTime?.split(' to ') ?? [];
  const [startSegmentTime, endSegmentTime] = segmentTime?.split('to') ?? [];
  const [playerSpeed, setPlayerSpeed] = useState(1);
  const [duration, setDuration] = useState(null);
  const { exactVideoDuration } = useSelector(state => state.commonReducer);
  const dispatch = useDispatch();
  const videoEl = useRef(null);
  const video = videoEl.current;
  useEffect(() => dispatch(commonActions.setVideoCurrentTime(-1)), []);
  useEffect(() => {
    if (
      videoEl?.current?.duration &&
      (videoEl?.current?.duration !== undefined || videoEl?.current?.duration !== NaN)
    ) {
      setDuration(videoEl?.current?.duration);
    } else {
      return;
    }
  }, [videoEl?.current?.duration]);

  const togglePlay = () => {
    const isPaused = video?.paused ?? false;
    const method = isPaused ? 'play' : 'pause';
    setPaused(!isPaused);
    setCurrentTime(video.currentTime);
    video?.[method]();
    if (isQC) {
      setPlayCheck(!isPaused);
    }
    if (isOutputSearch) {
      setPlayCheck(!isPaused);
    }
    if (isClient) {
      setPlayCheck(!isPaused);
    }
  };
  useEffect(() => {
    setPaused(true);
    setPlayerSpeed(1);
    setProgress(0);
  }, [src]);

  const handlePosition = type => {
    if (type === 'start') {
      video.pause();
      video.currentTime = 0;
      return;
    }
    video.currentTime += type;
  };

  const skip = time => {
    video.currentTime += time;
  };

  const handleProgress = () => {
    dispatch(commonActions.setVideoCurrentTime(video.currentTime));
    const percent = (video.currentTime / video.duration) * 100;

    setProgress(percent);

    if (video.ended) {
      setPaused(true);
      video.currentTime = 0;
    }
  };

  const scrub = percent => {
    if (!isFinite(video.duration)) return;

    setProgress(percent);
    const scrubTime = (video.duration / 100) * percent;
    video.currentTime = scrubTime;
  };
  useEffect(() => {
    if (video !== null) {
      if (exactVideoDuration > 0) {
        video.currentTime = exactVideoDuration;
      }
    }
  }, [exactVideoDuration]);
  const handlePlaybackRate = value => {
    const speed = video.playbackRate + (value > 0 ? 0.25 : -0.25);
    if (speed <= 0) return;

    if (speed > 4) return;
    setPlayerSpeed(speed);

    video.playbackRate = speed;
  };
  const handlePlaybackRate2 = value => {
    video.playbackRate = 1;
    const speed = video.playbackRate + value;
    if (speed == 2) {
      setPlayerSpeed(1);
    } else {
      setPlayerSpeed(speed);

      video.playbackRate = speed;
    }
  };

  const handleVolume = value => {
    setVolume(value);
    video.volume = value;

    if (value > 0) handleMute(false);
    if (value === 0) handleMute(true);
  };

  const handleMute = mute => {
    setMuted(mute);
    video.muted = mute;
  };
  var m = false;
  const handlekeypress = e => {
    if (e.altKey && e.keyCode == 65) {
      e.preventDefault();

      !isClient && togglePlay();
    } else if (e.altKey && e.keyCode == 83) {
      e.preventDefault();
      skip(-3);

      setPaused(false);
      video?.['play']();
    } else if (e.altKey && e.keyCode == 38) {
      e.preventDefault();
      skip(10);
    } else if (e.altKey && e.keyCode == 40) {
      e.preventDefault();
      skip(-10);
    } else if (e.altKey && e.keyCode == 37) {
      e.preventDefault();
      skip(-1);
    } else if (e.altKey && e.keyCode == 39) {
      e.preventDefault();
      skip(1);
    } else if (e.altKey && e.keyCode == 68) {
      e.preventDefault();
      handlePlaybackRate(-0.5);
    } else if (e.altKey && e.keyCode == 70) {
      e.preventDefault();
      handlePlaybackRate(0.5);
    } else if (e.altKey && e.keyCode == 77) {
      e.preventDefault();
      if (m === true) {
        video.muted = false;
        m = false;
        setMuted(m);
      } else if (m === false) {
        video.muted = true;
        m = true;
        setMuted(m);
      }
    }
  };
  useEffect(() => {
    window.addEventListener('keydown', handlekeypress);
    return () => {
      window.removeEventListener('keydown', handlekeypress);
    };
  }, [video]);

  useEffect(() => {
    // isPlayerPlaying indicates that the video Preview player is paused or not as (isplayerPlaying)
    // IsplayerPlaying set to true once double click on Tv/Omline job
    // Control hide set to true once video is loaded so toggles paused that is default using is player playing
    if (isPreviewPlaying && controlHide) {
      togglePlay();
      handlePreviewPlaying(false);
    }
  }, [isPreviewPlaying, controlHide]);

  const content = (
    <div>
      <div className="controls-body">
        <section>
          <div className="channel-wrapper">
            <Image
              src={channelLogoPath}
              width={39}
              height={29}
              fallback="placeholder.png"
              preview={false}
            />
            <Text className="text-white medium-font-size">{channel}</Text>
          </div>
        </section>
        <section className="display-flex">
          <section className="controls-right-wrapper">
            {/* <Text className="text-white small-font-size-minus">{startTime}</Text> */}
            <Text className="text-white small-font-size-minus">
              {formatDate(programDate, 'DD/MM/YY')}
            </Text>
          </section>
          {showTimeline && (
            <div className="segment-btn">
              <div className="btn-content" onClick={addMarker}>
                <AddAnotherIcon />
                <Text className="text-white regular-font-size">ADD SEGMENT</Text>
              </div>
            </div>
          )}
        </section>
      </div>

      <div className={`controls-${variant}`}>
        <div className="palyer-progress-wrapper">
          <Text className="text-white small-font-size-minus mt-10">{startTime}</Text>
          <div className="ims-slider">
            <Slider
              value={progress}
              step={0.1}
              min={0.2}
              max={100}
              tooltipVisible={false}
              onChange={scrub}
            />
            {showTimeline && (
              <Timeline markers={markers} isMarker={true} resetSegmentTime={resetSegmentTime} />
            )}
          </div>
          <Text className="text-white small-font-size-minus mt-10">{endTime}</Text>
        </div>
        <div className="controls-body">
          <section>
            <div className="controls-icons">
              <div className="icon-container" title="rewind">
                <RewindIcon
                  tabIndex="0"
                  onKeyPress={e => e.key === 'Enter' && handlePlaybackRate(-1)}
                  onClick={() => handlePlaybackRate(-1)}
                />
              </div>
              <div className="icon-container">
                {' '}
                <PreviousIcon
                  tabIndex="0"
                  onKeyPress={e => e.key === 'Enter' && handlePosition(-1)}
                  onClick={() => handlePosition('start')}
                />
              </div>
              <div
                className="icon-container"
                role="button"
                tabIndex="0"
                onKeyPress={e => e.key === 'Enter' && togglePlay()}
                onClick={togglePlay}
              >
                {paused ? <PlayIcon /> : <PauseIcon />}
              </div>
              <div
                className="icon-container"
                onKeyPress={e => e.key === 'Enter' && skip()}
                onClick={skip}
              >
                {' '}
                <SkipIcon tabIndex="0" />
              </div>
              <div className="icon-container">
                <NextIcon
                  tabIndex="0"
                  onKeyPress={e => e.key === 'Enter' && handlePosition(1)}
                  onClick={() => handlePosition('end')}
                />
              </div>
              <div className="icon-container">
                <ForwardIcon
                  tabIndex="0"
                  onKeyPress={e => e.key === 'Enter' && handlePlaybackRate(1)}
                  onClick={() => handlePlaybackRate(1)}
                />
              </div>
            </div>
          </section>
          <section className="controls-right-wrapper volume-wrapper controls-icons">
            <div className="palyer-volume-container">
              <Slider
                value={volume}
                step={0.05}
                min={0}
                max={1}
                tooltipVisible={false}
                onChange={handleVolume}
                onClick={handleVolume}
              />
            </div>
            <div
              className="icon-container"
              onKeyPress={e => e.key === 'Enter' && handleMute(!muted)}
              onClick={() => handleMute(!muted)}
            >
              {muted ? <MuteIcon tabIndex="0" /> : <SpeakerIcon tabIndex="0" />}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
  return (
    <div className="video-player-wrapper">
      <video
        onContextMenu={e => e.preventDefault()}
        ref={videoEl}
        key={src}
        preload="auto"
        onLoadedData={() => {
          setControlHide(true);
        }}
        onTimeUpdate={handleProgress}
        onLoadedMetadata={meta => {
          dispatch(commonActions.setVideoDuration(meta.target?.duration));
        }}
        width="100%"
        // height={isLibrary ? 250 : '60%'}
        style={{ aspectRatio: '16/9' }}
        {...rest}
      >
        <source src={src} type="video/mp4" />
      </video>
      {isClient && shortPlayerControls ? (
        <LibraryPlayerControls2
          showTimeline={showTimeline}
          markers={markers}
          startTime={startTime}
          endTime={endTime}
          startSegmentTime={startSegmentTime}
          endSegmentTime={endSegmentTime}
          addMarker={addMarker}
          handleVolume={handleVolume}
          progress={progress}
          channelLogoPath={channelLogoPath}
          channel={channel}
          programDate={programDate}
          variant={variant}
          muted={muted}
          setMuted={setMuted}
          paused={paused}
          scrub={scrub}
          handlePlaybackRate={handlePlaybackRate2}
          handleMute={handleMute}
          handlePosition={handlePosition}
          skip={skip}
          togglePlay={togglePlay}
          volume={volume}
          isQC={isQC}
          resetSegmentTime={resetSegmentTime}
          deleteSegment={deleteSegment}
          isMarker={isMarker}
          isOutputSearch={isOutputSearch}
          playerSpeed={playerSpeed}
          // fullScreen={fullScreen}
          actusPlayer={video}
          currentTime={video?.currentTime}
          duration={duration}
          pointerEvents={controlHide ? '' : 'none'}
        />
      ) : isClient && controlHide ? (
        <LibraryPlayerControls
          showTimeline={showTimeline}
          markers={markers}
          startTime={startTime}
          endTime={endTime}
          startSegmentTime={startSegmentTime}
          endSegmentTime={endSegmentTime}
          addMarker={addMarker}
          handleVolume={handleVolume}
          progress={progress}
          channelLogoPath={channelLogoPath}
          channel={channel}
          programDate={programDate}
          variant={variant}
          muted={muted}
          setMuted={setMuted}
          paused={paused}
          scrub={scrub}
          handlePlaybackRate={handlePlaybackRate2}
          handleMute={handleMute}
          handlePosition={handlePosition}
          skip={skip}
          togglePlay={togglePlay}
          volume={volume}
          isQC={isQC}
          resetSegmentTime={resetSegmentTime}
          deleteSegment={deleteSegment}
          isMarker={isMarker}
          isOutputSearch={isOutputSearch}
          playerSpeed={playerSpeed}
          // fullScreen={fullScreen}
          actusPlayer={video}
          currentTime={video?.currentTime}
          duration={duration}
        />
      ) : (
        <>
          {isClient ? null : (
            <CustomPlayerControls
              showTimeline={showTimeline}
              markers={markers}
              startTime={startTime}
              endTime={endTime}
              startSegmentTime={startSegmentTime}
              endSegmentTime={endSegmentTime}
              addMarker={addMarker}
              handleVolume={handleVolume}
              progress={progress}
              channelLogoPath={channelLogoPath}
              channel={channel}
              programDate={programDate}
              variant={variant}
              muted={muted}
              paused={paused}
              scrub={scrub}
              handlePlaybackRate={handlePlaybackRate}
              handleMute={handleMute}
              handlePosition={handlePosition}
              skip={skip}
              togglePlay={togglePlay}
              volume={volume}
              isQC={isQC}
              resetSegmentTime={resetSegmentTime}
              deleteSegment={deleteSegment}
              isMarker={isMarker}
              isOutputSearch={isOutputSearch}
              playerSpeed={playerSpeed}
              // fullScreen={fullScreen}
              actusPlayer={video}
              Vsrc={src}
            />
          )}
        </>
      )}
    </div>
  );
};

VideoPlayer.propTypes = {
  src: PropTypes.string.isRequired,
  variant: PropTypes.oneOf(['primary', 'secondary']),
  programInfo: PropTypes.object,
  showTimeline: PropTypes.bool,
  markers: PropTypes.array,
  addMarker: PropTypes.func,
  shortPlayerControls: PropTypes.bool,
};

VideoPlayer.defaultProps = {
  variant: 'primary',
  src: '',
  showTimeline: false,
  addMarker: () => {},
  isQC: false,
  isMarker: false,
  shortPlayerControls: false,
};

export default VideoPlayer;
