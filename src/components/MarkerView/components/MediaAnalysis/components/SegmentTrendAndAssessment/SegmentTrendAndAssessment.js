import { Row, Col } from 'antd';

import { useSelector } from 'react-redux';
import { Card, SegmentContainer, TopicCard, HashCard } from 'components/Common';
import { SegmentTrend, Summary, Analysis, Anchor } from './components';
import { CLIPPER_SEGMENT_COLORS } from 'constants/options';

import './SegmentTrendAndAssessment.scss';

const SegmentTrendAndAssessment = () => {
  const state = useSelector(state => state);
  console.log("topics",  state.commonReducer.topics)

  const { segments, programDate, programTime } = state.markerEditReducer;
  const contentSeg = state.markerEditReducer.contentSeg || false;

  const content = (
    <div className="segment-analysis-reviewer-wrapper">
      {console.log("topics",  state.commonReducer.topics)}
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

          return (
            <SegmentContainer
              key={index}
              title={title}
              color={_color}
              programDate={programDate}
              programTime={programTime}
              mainTheme={themes?.mainTheme}
              subTheme={themes?.subTheme}
              topic1={topics?.topic1}
              topic2={topics?.topic2}
              topic3={topics?.topic3}
              endTime={time}
              prevSegTime={prevSegTime}
              display={display}
              variant="secondary"
              isMarker={true}
              isMarkerView={true}
            >
              <section className="segment-wrapper">
                <Row gutter={10} className="mb-10" style={{ paddingLeft: '10px' }}>
                  <Col span="14">
                    <TopicCard
                      topics={topics}
                      topicOptions={state.commonReducer.topics}
                      disabled={true}
                    />
                  </Col>
                  <Col span="10">
                    <HashCard
                      hashTagOptions={state.commonReducer.hashTagOptions}
                      hashtags={hashtags || []}
                      index={index}
                      disabled={true}
                    />
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
