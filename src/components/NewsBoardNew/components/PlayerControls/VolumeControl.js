import React from 'react';
import { Button, Slider } from '@mui/material';
import { VolumeMute, VolumeUp } from '@mui/icons-material';
import PropTypes from 'prop-types';
import './PlayerControls.scss';

const VolumeControl = ({ volume, mute, toggleMute, changeVolume }) => {
  return (
    <div className="volume-control-container">
      <div className="volume-control">
        <Slider
          orientation="vertical"
          min={0}
          max={100}
          defaultValue={volume}
          disabled={mute}
          onChange={changeVolume}
        />
      </div>
      <Button type="text" className="control-icon" onClick={toggleMute}>
        {mute ? <VolumeMute fontSize="large" /> : <VolumeUp fontSize="large" />}
      </Button>
    </div>
  );
};

VolumeControl.propTypes = {
  mute: PropTypes.bool.isRequired,
  toggleMute: PropTypes.func.isRequired,
};

export default VolumeControl;
