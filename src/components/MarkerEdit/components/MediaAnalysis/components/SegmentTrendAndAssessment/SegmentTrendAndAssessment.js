import { useEffect } from 'react';
import { Typography, Row, Col, Spin } from 'antd';

import { useDispatch, useSelector } from 'react-redux';
import { Card, SegmentContainer, TopicCard, HashCard, Button } from 'components/Common';
import { SegmentTrend, Summary, Analysis, Anchor } from './components';
import { CLIPPER_SEGMENT_COLORS } from 'constants/options';

import { markerEditActions } from 'modules/markerEdit/actions';
import { calcSegmentTime } from 'modules/common/utils';

import './SegmentTrendAndAssessment.scss';

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

  const { segments, guests, programDate, programTime, thumbnailPath } = state.markerEditReducer;
  const contentSeg = state.markerEditReducer.contentSeg || true;

  const dispatch = useDispatch();
  const anchors = useSelector(state => state.markerEditReducer.anchor);

  const handleTrend = props => dispatch(updateTrend(props));
  const handleChangeAnchor = props => dispatch(updateAnchor(props));
  const handleChangeAnchr = props => dispatch(anchorSentiment.request(props));
  const handleChangeAna = props => dispatch(getAnalysisSentiment.request(props));
  const handleChangeSummarySentiments = props => dispatch(summarySentiment.request(props));
  const handleChangeAnalysis = props => dispatch(updateAnalysis(props));
  const handleChangeSummary = props => dispatch(updateSummary(props));
  const handleSegmentTitle = props => dispatch(updateSegmentTitle(props));
  const handleChangeTopic = ({ index, field, value }) =>
    dispatch(changeTopic1({ index, field, value }));
  const handleHashtagChange = props => dispatch(updateHashtags(props));

  const content = (
    <div className="segment-analysis-wrapper">
      {segments.map(
        (
          {
            title,
            color,
            themes,
            topics,
            time,
            segmentAnalysis: { trend, anchor, analysis, summary },
            hashtags,
          },
          index
        ) => {
          let display;
          let pointerevent = 'auto';
          let _color = index === segments.length - 1 ? CLIPPER_SEGMENT_COLORS[0] : color;
          if (!contentSeg) {
            pointerevent = index === segments.length - 1 ? 'none' : pointerevent;
            if (segments.length > 1 && index === segments.length - 1) display = 'none';
            _color = pointerevent === 'none' ? 'gray' : _color;
          }
          let prevSegTime;
          if (index) {
            prevSegTime = segments[index - 1].time;
          }
          const segTime = calcSegmentTime(programTime, time, prevSegTime, index);

          return (
            <SegmentContainer
              key={index}
              index={index}
              title={title}
              color={_color}
              segTime={segTime}
              prevSegTime={prevSegTime}
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
              onChange={payload => handleChangeTopic({ index, ...payload })}
              isMarker={true}
              refreshMetaData={props.refreshMetaData}
              thumbnail={thumbnailPath}
            >
              <section
                style={{ pointerEvents: pointerevent }}
                // style={{ border: `2px solid ${color}`, padding: '0.2rem' }}
                className="segment-wrapper"
              >
                <Row gutter={10} className="mb-10" style={{ paddingLeft: '10px' }}>
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
                        hashtags={hashtags || []}
                        handleSubmit={handleHashtagChange}
                        index={index}
                      />
                    </Spin>
                  </Col>
                </Row>

                <Row style={{ width: '100%' }}>
                  <Col span="24" style={{ textAlign: 'center', paddingBottom: '10px' }}>
                    <Button
                      // loading={loading && segIndex == index}
                      variant="secondary"
                      // onKeyPress={e => e.key === 'Enter' && handleSubmit()}
                      onClick={props.handleUpdate}
                    >
                      UPDATE
                    </Button>
                  </Col>
                </Row>
              </section>
            </SegmentContainer>
          );
        }
      )}
    </div>
  );
  return <Card title="Segment Analysis" shape="square" content={content} />;
};

export default SegmentTrendAndAssessment;
