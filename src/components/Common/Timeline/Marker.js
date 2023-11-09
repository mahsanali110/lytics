import React from 'react';
import line from 'assets/images/line.png';
import Draggable from 'react-draggable';
import { Menu, Dropdown, message as antMessage } from 'antd';
import { useDispatch } from 'react-redux';
import { DELETE_ALL_SEGMENTS } from 'modules/common/actions';

const Marker = ({
  width,
  color,
  outerParent,
  duration,
  handleClick,
  totalDuration,
  i,
  resetSegmentTime,
  handleSeekbarChange,
  from,
  to,
  dragging,
  deleteSegment,
  actusPlayer,
  isMarker,
  liveTime,
  liveClipper,
}) => {
  const dispatch = useDispatch();
  const handleDeleteClick = e => {
    e.domEvent.stopPropagation();
    deleteSegment(i);
  };

  const handleDeleteClickAll = e => {
    e.domEvent.stopPropagation();
    dispatch({ type: DELETE_ALL_SEGMENTS });
  };
  const seekbarToMarker = e => {
    e.domEvent.stopPropagation();
    if (!actusPlayer) return;
    handleSeekbarChange(duration);
    actusPlayer.setPosition(duration);
  };
  const markerToSeekbar = e => {
    e.domEvent.stopPropagation();
    resetSegmentTime(+999, i);
  };
  const handleForward = e => {
    e.domEvent.stopPropagation();
    let newTime = duration + 10;
    resetSegmentTime(newTime, i);
  };
  const handleBackward = e => {
    e.domEvent.stopPropagation();
    let newTime = duration - 10;
    resetSegmentTime(newTime, i);
  };
  const menu = (
    <Menu>
      {dragging && (
        <>
          <Menu.Item disabled={dragging ? false : true} onClick={e => handleDeleteClick(e)} key="1">
            Delete Pin
          </Menu.Item>
          {!isMarker && !liveClipper && (
            <Menu.Item
              disabled={dragging ? false : true}
              onClick={e => handleDeleteClickAll(e)}
              key="2"
            >
              Delete All Pins
            </Menu.Item>
          )}
        </>
      )}

      {dragging && (
        <>
          <Menu.Item disabled={dragging ? false : true} onClick={e => handleForward(e)} key="3">
            10 Sec Forward
          </Menu.Item>
          <Menu.Item disabled={dragging ? false : true} onClick={e => handleBackward(e)} key="4">
            10 Sec Backward
          </Menu.Item>
          {!isMarker && !liveClipper && (
            <Menu.Item disabled={dragging ? false : true} onClick={markerToSeekbar} key="5">
              Pin to Seekbar
            </Menu.Item>
          )}
        </>
      )}

      {!isMarker && dragging && !liveClipper && (
        <>
          <Menu.Item onClick={e => e.stopPropagation()} onClick={seekbarToMarker} key="2">
            Seekbar to Pin
          </Menu.Item>
        </>
      )}
    </Menu>
  );
  let boundNode = outerParent.current;

  // callback for dragging
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
        if (liveTime) {
          currentTime > liveTime
            ? antMessage.error(`Segment time can't exceed live time`, 2)
            : resetSegmentTime(currentTime, i);
        } else {
          resetSegmentTime(currentTime, i);
        }
        window.removeEventListener('mousemove', mousemove);
        window.removeEventListener('mouseup', mouseup);
      }
    }
  };
  return (
    <>
      <div
        className="timeline"
        onClick={() => handleClick(duration, i)}
        style={{ width: `${width}%`, backgroundColor: color }}
      >
        <Dropdown overlay={menu} trigger={['contextMenu']}>
          <span>
            <MarkerPoint boundNode={boundNode} to={to} from={from} mouseDown={mouseDown} i={i} />
          </span>
        </Dropdown>

        {/* <Dropdown overlay={menu} trigger={['contextMenu']}>
            <Draggable axis="x" position={{x:0,y:0}} offsetParent={boundNode} bounds={{left:from, top:0, right:to, bottom:0}} onStart={mouseDown}  >
              <img onDoubleClick={handleDooubleClick} style={{zIndex: '999', display: 'inline-block'}} key={i} className="timeline-marker" src={line} />
            </Draggable>
          </Dropdown> */}
      </div>
    </>
  );
};

const MarkerPoint = ({ boundNode, to, from, mouseDown, i }) => {
  return (
    <Draggable
      axis="x"
      position={{ x: 0, y: 0 }}
      offsetParent={boundNode}
      bounds={{ left: from, top: 0, right: to, bottom: 0 }}
      onMouseDown={mouseDown}
    >
      <img
        onClick={e => e.stopPropagation()}
        style={{ zIndex: '999', display: 'inline-block', height: '42px' }}
        key={i}
        className="timeline-marker"
        src={line}
      />
    </Draggable>
  );
};

export default React.memo(Marker);
