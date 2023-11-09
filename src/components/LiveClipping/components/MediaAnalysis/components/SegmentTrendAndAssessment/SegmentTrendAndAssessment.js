import { useEffect, useRef } from 'react';
import { Typography, Row, Col, Tooltip, Spin } from 'antd';
import moment from 'moment';
import { RedoOutlined } from '@ant-design/icons';

import { TOOLTIP_COLORS } from 'constants/options';
import { useDispatch, useSelector } from 'react-redux';
import { Card, SegmentContainer, Button, TopicCard, HashCard } from 'components/Common';
import { SegmentTrend, Summary, Analysis, Anchor, ProcessButton } from './components';
import { CLIPPER_SEGMENT_COLORS } from 'constants/options';
import { createSegmentBoundry } from 'modules/common/utils';

import { markerEditActions } from 'modules/markerEdit/actions';

import './SegmentTrendAndAssessment.scss';
import GuestAnalysis from '../../../GuestAnalysis/GuestAnalysis';
import commonReducer from 'modules/common/reducer';

const { Text } = Typography;
const {
  updateTrend,
  updateAnchor,
  updateSummary,
  updateAnalysis,
  updateTheme,
  updateSegmentTitle,
  getAnalysisSentiment,
  anchorSentiment,
  summarySentiment,
  changeTopic1,
  updateHashtags,
} = markerEditActions;

const SegmentTrendAndAssessment = props => {
  const state = useSelector(state => state);
  const { topicsError, hashtagsError } = useSelector(state => state.commonReducer);
  const toolTip = useRef(null);

  function mouseMove(e) {
    var x = e.clientX,
      y = e.clientY;
    toolTip.current.style.top = y + 20 + 'px';
    toolTip.current.style.left = x + 20 + 'px';
  }

  const { segments, guests, programDate, programTime } = state.markerEditReducer;
  const { loading, segIndex } = useSelector(state => state.liveClippingReducer);
  const dispatch = useDispatch();
  const yoo = useSelector(state => state.markerEditReducer);
  const anchors = useSelector(state => state.markerEditReducer.anchor);
  const handleTrend = props => dispatch(updateTrend(props));
  const handleChangeAnchor = props => dispatch(updateAnchor(props));
  const handleChangeAnchr = props => dispatch(anchorSentiment.request(props));
  const handleChangeAna = props => dispatch(getAnalysisSentiment.request(props));
  const handleChangeSummarySentiments = props => dispatch(summarySentiment.request(props));
  const handleChangeAnalysis = props => dispatch(updateAnalysis(props));
  const handleChangeSummary = props => dispatch(updateSummary(props));
  const handleSegmentTitle = props => dispatch(updateSegmentTitle(props));
  const handleChangeTheme = ({ index, field, value }) =>
    dispatch(changeTopic1({ index, field, value }));
  const handleHashtagChange = props => dispatch(updateHashtags(props));

  useEffect(() => {
    if (!toolTip.current) return;
    if (segments.length > 1) return;
    window.addEventListener('mousemove', mouseMove);
    return () => {
      window.removeEventListener('mousemove', mouseMove);
    };
  }, [toolTip.current]);

  useEffect(() => {
    if (!segments.length) return;
    window.removeEventListener('mousemove', mouseMove);
  }, [segments.length]);

  let lowestActiveInex = segments.length - 1;

  const content = (
    <div className="segment-analysis-wrapper-clipper" style={{ position: 'relative' }}>
      {segments.map(
        (
          {
            title,
            color,
            themes,
            topics,
            time,
            merge,
            segmentAnalysis: { trend, anchor, analysis, summary },
            guestAnalysis,
            dragging,
            id,
            thumbnail,
            active,
            hashtags,
          },
          index
        ) => {
          // console.log(topics);
          // console.log(state.commonReducer.topics)
          let _color = color === CLIPPER_SEGMENT_COLORS[0] ? CLIPPER_SEGMENT_COLORS[1] : color;
          let pointerevent = _color === CLIPPER_SEGMENT_COLORS[1] || merge ? 'none' : 'auto';
          let display;
          if (segments.length > 1 && _color === CLIPPER_SEGMENT_COLORS[1]) display = 'none';
          let prevSegTime = 0;
          if (index) {
            prevSegTime = segments[index - 1].time;
          }
          const { from, to } = createSegmentBoundry(props.startTime, prevSegTime, time);
          const segTime = `${moment(from).format('HH:mm:ss')} to ${moment(to).format('HH:mm:ss')}`;

          if (index < lowestActiveInex && active) {
            lowestActiveInex = index;
          }
          return (
            <SegmentContainer
              key={index}
              index={index}
              title={title}
              color={_color}
              segTime={segTime}
              thumbnail={thumbnail}
              variant="secondary"
              handleChange={value => handleSegmentTitle({ index, field: 'title', value })}
              editable
              pointerevent={pointerevent}
              display={display}
              themeOptions={state.commonReducer.themes}
              topicOptions={state.commonReducer.topics}
              topic1={topics?.topic1}
              topic2={topics?.topic2}
              topic3={topics?.topic3}
              onChange={payload => handleChangeTheme({ index, ...payload })}
              merge={merge}
              isMarker={true}
              isClipper={true}
              dragging={dragging}
              lowestActiveInex={lowestActiveInex}
              refreshMetaData={props.refreshMetaData}
              // content={content}
            >
              <section
                style={{ pointerEvents: pointerevent }}
                // style={{ border: `2px solid ${color}`, padding: '0.2rem' }}
                className="segment-wrapper"
              >
                <Row style={{ padding: '5px 10px ', display: merge && 'none' }}>
                  <Col span="24" style={{ padding: '10px' }}>
                    <Row gutter={16} className="mb-10">
                      <Col span="14">
                        <Spin spinning={topicsError} delay={500}>
                          <TopicCard
                            topics={topics}
                            topicOptions={state.commonReducer.topics}
                            index={index}
                          />
                        </Spin>
                      </Col>
                      <Col span="10">
                        <Spin spinning={hashtagsError} delay={500}>
                          <HashCard
                            hashTagOptions={state.commonReducer.hashTagOptions}
                            hashtags={hashtags}
                            handleSubmit={handleHashtagChange}
                            index={index}
                          />
                        </Spin>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </section>
              <section>
                <Row style={{ width: '100%', display: merge && 'none' }}>
                  <Col span="24" style={{ textAlign: 'center', paddingBottom: '10px' }}>
                    <ProcessButton
                      loading={loading && segIndex == index}
                      text={dragging ? 'PROCESS SEGMENT' : 'UPDATE'}
                      onClick={
                        dragging
                          ? () => props.handleSubmit(index)
                          : () => props.handleUpdate(index, id)
                      }
                      disabled={
                        !props.disableField ||
                        pointerevent == 'none' ||
                        (segments[index - 1]?.active && segments[index - 1]?.dragging)
                      }
                      thumbnail={thumbnail}
                    />
                    {/* {dragging ? (
                      <Tooltip
                        placement="top"
                        title={
                          !props.disableField ||
                          pointerevent == 'none' ||
                          (segments[index - 1]?.active && segments[index - 1]?.dragging)
                            ? 'Click ‘Start Segmentation’ to enable it'
                            : null
                        }
                      >
                        <Button
                          loading={loading && segIndex == index}
                          variant="secondary"
                          // onKeyPress={e => e.key === 'Enter' && handleSubmit()}
                          onClick={() => props.handleSubmit(index)}
                          disabled={
                            !props.disableField ||
                            pointerevent == 'none' ||
                            (segments[index - 1]?.active && segments[index - 1]?.dragging)
                          }
                        >
                          PROCESS SEGMENT
                        </Button>
                      </Tooltip>
                    ) : (
                      <Button
                        loading={loading && segIndex == index}
                        variant="secondary"
                        // onKeyPress={e => e.key === 'Enter' && handleSubmit()}
                        onClick={() => props.handleUpdate(index, id)}
                      >
                        UPDATE
                      </Button>
                    )}{' '} */}
                  </Col>
                </Row>
              </section>
              {pointerevent == 'none' && index == segments.length - 1 && (
                <span ref={toolTip} className="tooltip-span">
                  Add segment to enable this section
                </span>
              )}
            </SegmentContainer>
          );
        }
      )}
    </div>
  );
  return (
    <div className="card-wrapper">
      <Card
        className="card-container-primary medium square overflow"
        title="Segment Marking"
        shape="square"
        content={content}
      />
    </div>
  );
};

export default SegmentTrendAndAssessment;
