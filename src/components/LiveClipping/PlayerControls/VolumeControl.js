import { faVolumeMute, faVolumeUp } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button, Slider } from 'antd';
import PropTypes from 'prop-types';
import React from 'react';
import './PlayerControls.scss';

const VolumeControl = ({ volume, mute, toggleMute, changeVolume }) => {
  return (
    <div className="volume-control-container">
      <div className="volume-control">
        <Slider
          vertical
          min={0}
          max={100}
          defaultValue={volume}
          disabled={mute}
          onChange={changeVolume}
        />
      </div>
      <Button type="text" className="control-icon" onClick={toggleMute}>
        <FontAwesomeIcon icon={mute ? faVolumeMute : faVolumeUp} size="lg" />
      </Button>
    </div>
  );
};

VolumeControl.propTypes = {
  mute: PropTypes.bool.isRequired,
  toggleMute: PropTypes.func.isRequired,
};

export default VolumeControl;
