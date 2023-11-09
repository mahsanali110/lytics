import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { useScript } from '../../../modules/common/useScriptHook';
import { useSelector, useDispatch } from 'react-redux';

const ActusPlayer = ({
  onStatusChange,
  onResponse,
  actusPlayer,
  paused,
  channelName,
  channelindex,
}) => {
  const addResponseEventListener = () => {
    actusPlayer.current.addEventListener('onresponse', event => {
      if (event.detail.error) {
        event.target.onResponse({ error: event.detail.error });
        return;
      }

      switch (event.target.command) {
        case 'login':
          event.target.availableChannels = event.detail;
          break;
        case 'source':
          event.target.selectedChannel = event.detail;
          break;
      }

      event.target.onResponse({ error: null });
    });
  };

  const addStatusChangeEventListener = () => {
    actusPlayer.current.addEventListener('status-change', event => {
      event.target.onStatus(event.detail);
    });
  };

  const connectToActusServer = () => {
    actusPlayer.current.connectToServer = function (username, password, onResponse) {
      actusPlayer.current.command = 'login';
      actusPlayer.current.onResponse = onResponse;

      this.setAttribute(
        'login',
        JSON.stringify({
          user: username,
          password: password,
        })
      );
    };
  };

  const onPlayLiveChannel = () => {
    actusPlayer.current.playLive = function (channel_name, onResponse) {
      actusPlayer.current.command = 'source';
      actusPlayer.current.onResponse = onResponse;
      this.setAttribute(
        'source',
        JSON.stringify({
          channel: channel_name,
          mode: 'live',
        })
      );
    };
  };

  const onPlayChannelOldTelecast = () => {
    actusPlayer.current.playStorage = function (channel_name, _from, _to, onResponse) {
      actusPlayer.current.command = 'source';
      actusPlayer.current.onResponse = onResponse;
      console.log('[actus]: ', _from.format('hh:mm'), _to.format('hh:mm'));
      this.setAttribute(
        'source',
        JSON.stringify({
          channel: channel_name,
          mode: 'storage',
          from: JSON.stringify(_from),
          to: JSON.stringify(_to),
        })
      );
    };
  };

  const onChannelPause = () => {
    actusPlayer.current.pause = function () {
      this.setAttribute(
        'control',
        JSON.stringify({
          action: 'pause',
        })
      );
    };
  };

  const onChannelPlay = () => {
    actusPlayer.current.play = function () {
      this.setAttribute(
        'control',
        JSON.stringify({
          action: 'play',
        })
      );
    };
  };

  const onChannelClose = () => {
    actusPlayer.current.close = function () {
      this.setAttribute('source', null);
    };
  };

  const onChannelLanguageChange = () => {
    actusPlayer.current.setLanguage = function (lng) {
      this.setAttribute(
        'control',
        JSON.stringify({
          action: 'lang_set',
          value: lng,
        })
      );
    };
  };

  const onSetSubtitle = () => {
    actusPlayer.current.setSubtitle = function (sbt) {
      this.setAttribute(
        'control',
        JSON.stringify({
          action: 'sbt_set',
          value: sbt,
        })
      );
    };
  };

  const onSetTeleText = () => {
    actusPlayer.current.setTeletext = function (ttxt) {
      this.setAttribute(
        'control',
        JSON.stringify({
          action: 'ttxt_set',
          value: ttxt,
        })
      );
    };
  };

  const onSetPosition = () => {
    actusPlayer.current.setPosition = function (pos) {
      this.setAttribute(
        'control',
        JSON.stringify({
          action: 'progress-bar-position',
          value: pos,
        })
      );
    };
  };

  const onSetVolume = () => {
    actusPlayer.current.setVolume = function (volume) {
      if (volume > 1) volume = 1;
      if (volume < 0) volume = 0;

      this.setAttribute(
        'control',
        JSON.stringify({
          action: 'volume',
          value: volume,
        })
      );
    };
  };

  const onNextFrame = () => {
    actusPlayer.current.nextFrame = function () {
      this.setAttribute(
        'control',
        JSON.stringify({
          action: 'next_frame',
        })
      );
    };
  };

  const onPreviousFrame = () => {
    actusPlayer.current.previousFrame = function () {
      this.setAttribute(
        'control',
        JSON.stringify({
          action: 'previous_frame',
        })
      );
    };
  };

  const onFastForward = () => {
    actusPlayer.current.fastForward = function () {
      this.setAttribute(
        'control',
        JSON.stringify({
          action: 'fast_forward',
        })
      );
    };
  };

  const onFastBackward = () => {
    actusPlayer.current.fastBackward = function () {
      this.setAttribute(
        'control',
        JSON.stringify({
          action: 'fast_backward',
        })
      );
    };
  };

  const onSlowMotion = () => {
    actusPlayer.current.slowMotion = function () {
      this.setAttribute(
        'control',
        JSON.stringify({
          action: 'slow_motion',
        })
      );
    };
  };

  const onScreenshot = () => {
    actusPlayer.current.screenshot = function (file_name) {
      this.setAttribute(
        'control',
        JSON.stringify({
          action: 'screenshot',
          value: file_name,
        })
      );
    };
  };

  const initiateActusPlayer = () => {
    if (actusPlayer) {
      actusPlayer.current.command = '';

      actusPlayer.current.availableChannels = [];
      actusPlayer.current.selectedChannel = {};

      actusPlayer.current.onResponse = response => {
        onResponse(response);
      };
      actusPlayer.current.onStatus = onStatusChange;

      addResponseEventListener();
      addStatusChangeEventListener();
      connectToActusServer();
      onPlayLiveChannel();
      onPlayChannelOldTelecast();
      onChannelPause();
      onChannelPlay();
      onChannelClose();
      onChannelLanguageChange();
      onSetSubtitle();
      onSetTeleText();
      onSetPosition();
      onSetVolume();
      onNextFrame();
      onPreviousFrame();
      onFastForward();
      onFastBackward();
      onSlowMotion();
      onScreenshot();
    }
  };

  useEffect(() => {
    if (actusPlayer) {
      initiateActusPlayer();
    }
  }, [actusPlayer]);

  const actus_webhost_Url = useSelector(state => state.multiviewReducer.actus_webhost_Url);

  useScript('./runtime-es2015.js');
  useScript('./polyfills-es2015.js');
  useScript('./main-es2015.js');
  console.log({ actus_webhost_Url });

  return (
    // <div style={{ position: 'absolute' }}>
    <actus-player
      ref={actusPlayer}
      id="actusPlayer"
      channel={channelName}
      channelindex={channelindex}
      web-host={
        actus_webhost_Url.private !== '' ? actus_webhost_Url.private : actus_webhost_Url.public
      }
    ></actus-player>
    // </div>
  );
};

ActusPlayer.propTypes = {
  actusPlayer: PropTypes.any,
  onStatusChange: PropTypes.func,
  onResponse: PropTypes.func,
};

ActusPlayer.defaultProps = {
  onResponse: response => {
    console.log(response);
  },
  onStatusChange: status => {
    if (status === '') {
      console.error('Error in Actus Player Status Change');
    }
  },
};

export default React.memo(ActusPlayer);
