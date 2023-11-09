import React from 'react';
import Draggable from 'react-draggable';
import line from 'assets/images/line.png';
import lineLive from 'assets/images/live-line.png';
const MarkerPoint = ({ width, dragging, position, resetSegmentTime }) => {
  const img = position ? line : lineLive;
  const zIndex = position ? '9999' : '0';
  const mouseDown = () => {
    console.log(dragging);
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
        bounds={{ left: 0, top: 0, right: 0, bottom: 0 }}
        onMouseDown={mouseDown}
      >
        <img
          style={{ zIndex: zIndex }}
          onClick={e => e.stopPropagation()}
          className="pin"
          src={img}
        />
      </Draggable>
    </div>
  );
};
export default MarkerPoint;
