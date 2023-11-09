import React, { useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import line from 'assets/images/line.png';
import { CLIPPER_SEGMENT_COLORS } from 'constants/options';

import Marker from './Marker';
const TIMELINE_HEIGHT = 20;
import './Timeline.scss';
const Timeline = ({
  markers,
  handleClick,
  resetSegmentTime,
  handleSeekbarChange,
  deleteSegment,
  actusPlayer,
  isMarker,
  liveTime,
  liveClipper,
}) => {
  let outerParent = useRef(null);
  let outerParentRect;
  let totalDuration;
  let to, from, drag;
  if (markers.length) {
    totalDuration = markers[markers.length - 1].duration;
  }
  if (outerParent.current) {
    outerParentRect = outerParent.current.getBoundingClientRect();
  }

  return (
    <div
      ref={outerParent}
      className="timeline-container"
      style={{ height: `${TIMELINE_HEIGHT}px` }}
    >
      <img
        style={{ zIndex: '999', display: 'inline-block', height: '43px' }}
        className="dummy-marker"
        src={line}
      />
      {markers.map(({ width, color, duration, dragging }, i, array) => {
        if (i === array.length - 1 || !dragging) {
          from = 0;
          to = 0;
          drag = false;
        } else if (array.length > 1) {
          let timePercent = (duration / totalDuration) * 100;
          let left = (timePercent / 100) * outerParentRect?.width;
          from = -left;
          let nextDuration = totalDuration - duration;
          let nextPercent = (nextDuration / totalDuration) * 100;
          let right = (nextPercent / 100) * outerParentRect?.width;
          to = right;
          drag = dragging;
        }
        return (
          <Marker
            liveTime={liveTime}
            outerParent={outerParent}
            handleClick={handleClick}
            key={i}
            width={width}
            color={i === array.length - 1 && isMarker ? CLIPPER_SEGMENT_COLORS[0] : color}
            duration={duration}
            totalDuration={totalDuration}
            i={i}
            resetSegmentTime={resetSegmentTime}
            handleSeekbarChange={handleSeekbarChange}
            from={from}
            to={to}
            dragging={drag}
            deleteSegment={deleteSegment}
            actusPlayer={actusPlayer}
            isMarker={isMarker}
            liveClipper={liveClipper}
          />
        );
      })}
    </div>
  );
};
Timeline.propTypes = {
  markers: PropTypes.array,
};
Timeline.defaultProps = {
  markers: [],
  handleClick: () => {},
  handleSeekbarChange: () => {},
  resetSegmentTime: () => {},
  deleteSegment: () => {},
  actusPlayer: null,
  isMarker: false,
  liveTime: null,
  liveClipper: false,
};
export default Timeline;
