import React from 'react';
import Draggable from 'react-draggable';
import line from 'assets/images/line.png';
import lineLive from 'assets/images/live-line.png';
const MarkerPoint = ({
  width,
  totalDuration,
  from,
  dragging,
  to,
  outerParent,
  position,
  resetSegmentTime,
}) => {
  const img = position ? line : lineLive;
  const mouseDown = () => {
    if (dragging) {
      let outerParentRect = outerParent.current.getBoundingClientRect();
      let outerlength = outerParentRect.right - outerParentRect.left;
      let currentTime;
      window.addEventListener('mousemove', mousemove);
      window.addEventListener('mouseup', mouseup);

      function mousemove(event) {
        let newX = event.clientX - outerParentRect.left;
        let width = (newX / outerlength) * 100;
        currentTime = (width / 100) * totalDuration;
        // handleSeekbarChange(currentTime)
      }

      function mouseup() {
        resetSegmentTime(currentTime, position);
        window.removeEventListener('mousemove', mousemove);
        window.removeEventListener('mouseup', mouseup);
      }
    }
  };
  return (
    <div className="timeline" style={{ width: `${width}%` }}>
      <Draggable
        axis="x"
        position={{ x: 0, y: 0 }}
        bounds={{ left: from, top: 0, right: to, bottom: 0 }}
        onMouseDown={mouseDown}
      >
        <img onClick={e => e.stopPropagation()} className="pin" src={img} />
      </Draggable>
    </div>
  );
};
export default MarkerPoint;
