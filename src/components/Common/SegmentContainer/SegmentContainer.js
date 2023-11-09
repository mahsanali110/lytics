import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import PicturesWall from 'components/AdminPanel/ImageUpload';
import { v4 as uuidv4 } from 'uuid';

import { Typography, Input, Checkbox, Skeleton, Tooltip } from 'antd';
import { formatDate, formateTime, calcSegmentTime } from 'modules/common/utils';
import { Select, Card } from 'components/Common';
import { markerEditActions } from 'modules/markerEdit/actions';
import { useDispatch } from 'react-redux';
import { RedoOutlined } from '@ant-design/icons';
import { USERS_BASE_URL } from 'constants/config/config.dev';
import { TOOLTIP_COLORS } from 'constants/options';
import './SegmentContainer.scss';
import { uploadPath } from 'constants/index';

const { Text } = Typography;

const SegmentContainer = ({
  index,
  children,
  title,
  programDate,
  segTime,
  thumbnail,
  color,
  variant,
  editable,
  handleChange,
  pointerevent,
  display,
  // themeOptions,
  topicOptions,
  topic1,
  topic2,
  topic3,
  onChange,
  merge,
  isMarker,
  isClipper,
  isMarkerView,
  dragging,
  lowestActiveInex,
  height,
  refreshData,
  refreshMetaData,
  content,
  isAwareness,
}) => {
  const [fileList, setFileList] = useState(thumbnail);
  const [topicOpitons3, setTopicOpitons3] = useState([]);
  // useEffect(() => {
  //   if (isMarkerView) return;
  //   if (isMarker || isClipper) {
  //     if (topic2.length) onChange({ field: 'topic2', value: [] });
  //     if (topic3.length) onChange({ field: 'topic3', value: [] });
  //   }
  // }, [topic1]);

  // useEffect(() => {
  //   if (isMarkerView) return;
  //   if (isMarker || isClipper) {
  //     let value = [];
  //     let optObj = {};
  //     topicOpitons3.forEach((opt, ind) => {
  //       optObj[opt] = ind;
  //     });
  //     topic3.forEach(top => {
  //       if (top in optObj) value.push(top);
  //     });
  //     onChange({ field: 'topic3', value });
  //   }
  // }, [topicOpitons3]);

  // useEffect(() => {
  //   if (isMarkerView) return;
  //   if (isMarker || isClipper) {
  //     const currentTopic = topicOptions.find(topic => topic.name === topic1) ?? {};
  //     const topics2 = currentTopic?.topic2 ?? [];
  //     const objSubTopics2 = {};
  //     topics2.forEach(topic => {
  //       objSubTopics2[topic.name] = topic;
  //     });
  //     let subTopics3 = [];
  //     topic2.forEach(topic => {
  //       if (topic in objSubTopics2) subTopics3.push(objSubTopics2[topic].topic3);
  //     });
  //     subTopics3 = [].concat(...subTopics3);
  //     setTopicOpitons3(subTopics3.map(value => value.name));
  //   }
  // }, [topic2.length]);

  const dispatch = useDispatch();

  ///// Options for topic2 ///////
  const topicOptions2 = () => {
    const currentTopic = topicOptions.find(topic => topic.name === topic1) ?? {};
    const Topic2 = currentTopic?.topic2 ?? [];
    return Topic2.map(value => ({ value: value.name, title: value.name }));
  };

  /////// callback to change thumbnail /////
  const handleImageChange = ({ fileList }) => {
    setFileList(fileList);
    if (isClipper)
      dispatch(
        markerEditActions.updateSegmentField({ field: 'thumbnail', index, value: fileList })
      );
    if (isMarker && !isClipper)
      dispatch(markerEditActions.updateJobField({ field: 'thumbnailPath', value: fileList }));
  };
  const thumb = `${USERS_BASE_URL}/${uploadPath}/${thumbnail}`;
  let _thumbnail = typeof thumbnail === 'string' ? [{ uid: uuidv4(), url: thumb }] : thumbnail;
  return (
    <div className={`segment-container`} style={{ display: display }}>
      <div className="segment-container-header" style={{ backgroundColor: color }}>
        <div className="left-segment">
          {isMarker ? (
            <>
              {isClipper && pointerevent == 'none' ? (
                <Skeleton.Image size="small" style={{ width: '60px', height: '40px' }} />
              ) : (
                <PicturesWall handleImageChange={handleImageChange} fileList={_thumbnail} />
              )}
              {/* <Select
                className="select"
                placeholder="Topic 1"
                name="topic1"
                value={topic1 === '' ? null : topic1}
                // onChange={value => onChange({ field: 'topic1', value })}
                disabled={pointerevent === 'none' ? true : !editable}
                options={
                  editable ? topicOptions?.map(({ name }) => ({ value: name, title: name })) : []
                }
              />
              <Select
                className="select"
                placeholder="Topic 2"
                name="Topic2"
                showArrow
                mode="multiple"
                value={topic2}
                maxTagCount="responsive"
                allowClear
                // onChange={value => onChange({ field: 'topic2', value })}
                disabled={pointerevent === 'none' ? true : !editable}
                options={editable ? topicOptions2() : []}
              />
              <Select
                className="select"
                placeholder="Topic 3"
                name="Topic3"
                showArrow
                mode="multiple"
                value={topic3}
                maxTagCount="responsive"
                allowClear
                // onChange={value => onChange({ field: 'topic3', value })}
                disabled={pointerevent === 'none' ? true : !editable}
                options={topicOpitons3.map(value => ({ value, title: value }))}
              /> */}
              {!(index == lowestActiveInex) && dragging && isClipper && (
                <Checkbox
                  onChange={() => {
                    dispatch(
                      markerEditActions.updateSegmentField({ field: 'merge', index, value: !merge })
                    );
                  }}
                  checked={merge}
                  className="checkbox"
                >
                  <span className="merge-text">{merge ? 'Merged' : 'Merge'}</span>
                </Checkbox>
              )}
            </>
          ) : (
            <>
              <Input
                value={title}
                placeholder="Segment Name"
                onChange={e => handleChange(e.target.value)}
                readOnly={pointerevent === 'none' ? true : !editable}
              />
              {isAwareness ? (
                <Tooltip placement="top" color={TOOLTIP_COLORS[0]} title="Refresh The Metadata">
                  <RedoOutlined className="refrehBtnClass" onClick={refreshData} />
                </Tooltip>
              ) : null}
            </>
          )}
        </div>
        {isMarker && (
          <div className="right-segment">
            <Text className="text-white small-font-s display: merge && 'none' }ize-minus">
              {formatDate(programDate, 'DD/MM/YYYY')}
            </Text>
            <Text className="text-white small-font-size-minus">{segTime}</Text>
          </div>
        )}
        {!isAwareness ? (
          // <Card
          //   style={{ backgroundColor: 'inherit', paddingLeft: '8px' }}
          //   extra={
          <div>
            <Tooltip placement="left" color={TOOLTIP_COLORS[0]} title="Refresh The Metadata">
              <RedoOutlined
                style={{
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: 'bolder',
                  cursor: 'pointer',
                  pointerEvents: pointerevent === 'none' ? 'none' : 'auto',
                }}
                onClickCapture={refreshMetaData}
              />
            </Tooltip>
          </div>
        ) : //   }
        //   content={content}
        // />
        null}
      </div>
      <div
        className={`segment-container-body ${variant}-bg`}
        style={{ overflow: 'auto', height: `${height}vh`, paddingTop: '5px' }}
      >
        {children}
      </div>
    </div>
  );
};

SegmentContainer.propTypes = {
  title: PropTypes.string,
  color: PropTypes.string,
  children: PropTypes.node,
  programDate: PropTypes.string,
  programTime: PropTypes.string,
  editable: PropTypes.bool,
  handleChange: PropTypes.func,
  variant: PropTypes.oneOf(['primary', 'secondary']),
};

SegmentContainer.defaultProps = {
  variant: 'primary',
  editable: false,
  isMarker: false,
  isClipper: false,
  thumbnail: null,
  dragging: true,
  topic2: [],
  topic: [],
  isMarkerView: false,
  onChange: () => {},
};

export default SegmentContainer;
