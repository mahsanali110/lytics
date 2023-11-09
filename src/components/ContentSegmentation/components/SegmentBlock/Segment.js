import { useEffect, useState } from 'react';
import {
  Row,
  Col,
  Tooltip,
  Button,
  Form,
  TimePicker,
  Image,
  DatePicker,
  message as antMessage,
} from 'antd';
import { useLocation } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardDetail, Select, SegmentContainer, TopicCard, HashCard } from 'components/Common';
import moment from 'moment';
import { formatDate } from 'modules/common/utils';
import { markerEditActions } from 'modules/markerEdit/actions';
import { CLIPPER_SEGMENT_COLORS } from 'constants/options';
import { jobActions } from 'modules/jobs/actions';
import './Segment.scss';
import { CHANNEL_LANGUAGE, CHANNEL_REGION } from 'constants/strings';
import actions from '../../../../modules/common/actions';
import commonActions from 'modules/common/actions';
import programNamesActions from 'modules/programNames/actions';
import programTypesActions from 'modules/programTypes/actions';
import channelsActions from 'modules/channels/actions';

const { updateHashtags } = markerEditActions;

const PrintSegment = ({ data, setData, channelType, setImportSingle }) => {
  const dispatch = useDispatch();
  const location = useLocation();
  const [segmentFlag, setSegmentFlag] = useState(false);
  const [articleLogo, setArticleLogo] = useState('');
  const [fromTime, setFromTime] = useState('');
  const [segmentData, setSegmentData] = useState(data);

  if (location.pathname === '/print' || location.pathname === '/web') {
    useEffect(() => {
      dispatch(actions.fetchHosts.request());
      dispatch(actions.fetchGuests.request());
      dispatch(programNamesActions.getProgramNames.request());
      dispatch(programTypesActions.getProgramTypes.request());
      dispatch(commonActions.fetchHashtags.request());
      dispatch(channelsActions.getChannels.request());
      dispatch(actions.fetchTopics.request());
    }, []);
  }

  const refreshData = () => {
    dispatch(actions.fetchHosts.request());
    dispatch(actions.fetchGuests.request());
    dispatch(programNamesActions.getProgramNames.request());
    dispatch(programTypesActions.getProgramTypes.request());
    dispatch(commonActions.fetchHashtags.request());
    dispatch(channelsActions.getChannels.request());
    dispatch(actions.fetchTopics.request());
    antMessage.success('Refreshed', 1);
  };

  useEffect(() => {
    dispatch(jobActions.importVideos(data.fileList));
  }, [data]);

  const handleSubmit = () => {
    const formData = new FormData();
    data.data.forEach(element => {
      const filterfile = data.fileList.filter(
        f => f.type === 'image/jpeg' || f.type === 'image/png' || f.type === 'image/jpg'
      );
      formData.append('files', filterfile[0]);
      formData.append('data', JSON.stringify(element));
      console.log('dispatching form Data: ', element);
      dispatch(jobActions.createMediaJobs.request({ data: formData }));

      // console log formData
      for (var pair of formData.entries()) {
        console.log(pair[0] + ', ' + pair[1]);
      }
    });
    setData([]);
    // setImportSingle(false);
  };
  const setLogo = value => {
    const path = channelNames.filter(channel => {
      if (channel.name === value) {
        setArticleLogo(channel.logoPath);
      }
    });
  };

  const state = useSelector(state => state);
  const { topics } = useSelector(state => state.commonReducer);
  const hostNames = state.commonReducer.hosts;
  const guestNames = state.commonReducer.guests;
  const channelNames = state.channelsReducer.channels;
  const programTypes = state.programTypesReducer.programTypes;
  const programNames = state.programNamesReducer.programNames;
  const programInfoFlag = state.commonReducer.showProgramInfo;
  const topic123 = state.markerEditReducer.segments[0].topics;
  const handleHashtagChange = props => {
    dispatch(updateHashtags(props));
    data.data[0].segments[0].hashtags[0].originalTag = props.value;
  };

  const sortedChannels = channelNames.filter(channel => {
    if (channel.type === channelType) {
      return channel;
    }
  });

  const setTopics = () => {
    data.data[0].segments[0].topics.topic1 = topic123.topic1;
    data.data[0].segments[0].topics.topic2 = topic123.topic2;
    data.data[0].segments[0].topics.topic3 = topic123.topic3;
  };
  const { segments, programDate, programTime } = state.markerEditReducer;
  const contentSeg = state.markerEditReducer.contentSeg || false;
  const content = (
    <div className="segment-analysis-reviewer-wrapper">
      {segments.map(
        (
          {
            title,
            color,
            themes,
            // topics,
            merge,
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
              title={'Meta Data'}
              color={_color}
              programDate={programDate}
              programTime={programTime}
              mainTheme={themes?.mainTheme}
              subTheme={themes?.subTheme}
              topic1={topics?.topic1}
              topic2={topics?.topic2}
              topic3={topics?.topic3}
              endTime={time}
              merge={merge}
              prevSegTime={prevSegTime}
              display={display}
              variant="secondary"
              isMarker={false}
              isMarkerView={false}
              refreshMetaData={refreshData}
            >
              <section className="segment-wrapper">
                <Row style={{ padding: '5px 10px ' }}>
                  <Col span="24" style={{ padding: '10px' }}>
                    <Row gutter={16} className="mb-10">
                      <Col span="14">
                        <TopicCard
                          csvData={data}
                          setState={setData}
                          topicOptions={state.commonReducer.topics}
                          topics={topics}
                          index={index}
                        />
                      </Col>
                      {topic123.topic1.length > 0 ? setTopics() : ''}
                      <Col span="10">
                        <HashCard
                          originalTags={data}
                          setState={setData}
                          hashTagOptions={state.commonReducer.hashTagOptions}
                          handleSubmit={handleHashtagChange}
                          hashtags={hashtags}
                          index={index}
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </section>
              <section>
                <Row style={{ width: '100%' }}>
                  <Col span="24" style={{ textAlign: 'center', paddingBottom: '10px' }}>
                    <Tooltip placement="top">
                      <Button
                        type="primary"
                        style={{
                          height: '2.5rem',
                          width: '10rem',
                          borderRadius: ' 5px',
                          border: 'none',
                          display: 'block',
                          marginLeft: 'auto',
                          marginRight: 'auto',
                          marginBottom: '10px',
                          backgroundColor: '#EF233C',
                        }}
                        onClick={handleSubmit}
                      >
                        PROCESS SEGMENT
                      </Button>
                    </Tooltip>
                  </Col>
                </Row>
              </section>
            </SegmentContainer>
          );
        }
      )}
    </div>
  );
  const contentPi = (
    <>
      <section className="program-infomation-wrapper">
        <Form layout="vertical" style={{ height: '400px' }}>
          <section className="program-info-body-wrapper">
            <div>
              <div className="wrapper-anchors input-margin">
                <div className="warapper" style={{ marginRight: '10px' }}>
                  <Form.Item label="Channel Name">
                    <Image
                      src={articleLogo}
                      width={48}
                      height={48}
                      alt="logo"
                      preview={false}
                      fallback="placeholder.png"
                    />
                    <Select
                      placeholder="Please select"
                      style={{ width: '100%', marginLeft: '2%' }}
                      options={sortedChannels.map(channelName => ({
                        title: channelName.name,
                        value: channelName.name,
                      }))}
                      required
                      onChange={value => {
                        setLogo(value);
                        data.data[0].channel = value;
                      }}
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="input-margin">
                <div className="time-fields">
                  <div className="time-from">
                    <Form.Item label="Date" required>
                      <DatePicker
                        placeholder="Program Date"
                        style={{ width: '100%' }}
                        required
                        onChange={date => {
                          data.data[0].programDate = formatDate(
                            moment(date).format(),
                            'DD/MM/YYYY'
                          );
                        }}
                      />
                    </Form.Item>
                  </div>
                  <div className="time-from">
                    <Form.Item label="Time" required>
                      <TimePicker
                        showTime={{ format: 'HH:mm', use12Hours: true }}
                        style={{ width: '100%' }}
                        required
                        onChange={(time, timeString) => {
                          setFromTime(timeString.toUpperCase());
                        }}
                        defaultOpenValue={moment('00:00:00', 'HH:mm:ss')}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
              <div className="input-margin">
                <Form.Item label="Program Type" style={{ width: '99.5%' }} required>
                  <Select
                    placeholder="Please select"
                    style={{ width: '100%' }}
                    options={programTypes.map(option => ({
                      value: option.name,
                      title: option.name,
                    }))}
                    required
                    onChange={value => (data.data[0].programType = value)}
                  />
                </Form.Item>
              </div>
              <div className="input-margin">
                <Form.Item label="Program Name" style={{ width: '99.5%' }} required>
                  <Select
                    placeholder="Please select"
                    style={{ width: '100%' }}
                    options={programNames.map(program => ({
                      value: program.title,
                      title: program.title,
                    }))}
                    required
                    onChange={value => (data.data[0].programName = value)}
                  />
                </Form.Item>
              </div>
              <div className="wrapper-anchors input-margin">
                <div className="warapper" style={{ marginRight: '10px' }}>
                  <Form.Item label="Author Name">
                    <Select
                      placeholder="Please select"
                      style={{ width: '100%' }}
                      options={hostNames.map(option => ({
                        value: option.name,
                        title: option.name,
                      }))}
                      required
                      onChange={value => {
                        data.data[0].publisher = value;
                      }}
                    />
                  </Form.Item>
                </div>
                <div className="warapper">
                  <Form.Item label="Guest" style={{ width: '99.5%' }}>
                    <Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      placeholder="Please select"
                      maxTagCount={5}
                      options={guestNames.map(option => ({
                        value: option.name,
                        title: option.name,
                      }))}
                      onChange={value => {
                        data.data[0].guests = value;
                      }}
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="priority-detail input-margin">
                <div className="format-detail" style={{ marginRight: '10px' }}>
                  <Form.Item label="Language" required>
                    <Select
                      style={{ width: '100%' }}
                      placeholder="Please select"
                      options={CHANNEL_LANGUAGE.map(language => ({
                        title: language,
                        value: language,
                      }))}
                      required
                      onChange={value => (data.data[0].language = value)}
                    />
                  </Form.Item>
                </div>
                <div className="format-detail">
                  <Form.Item label="Region" required>
                    <Select
                      style={{ width: '100%' }}
                      placeholder="Please select"
                      options={CHANNEL_REGION.map(region => ({ title: region, value: region }))}
                      required
                      onChange={value => {
                        data.data[0].region = value;
                      }}
                      onSelect={() => {
                        setSegmentData(data);
                        setSegmentFlag(true);
                      }}
                    />
                  </Form.Item>
                </div>
              </div>
            </div>
          </section>
        </Form>
      </section>
    </>
  );
  return (
    <>
      <div>
        {programInfoFlag === true ? (
          <div className="program-infomation-container" style={{ padding: '1%' }}>
            <Card
              className="card-container-primary medium square program-information-card"
              title="Program Information"
              shape="square"
              variant="primary"
              style={{ background: '#2A324A' }}
              content={contentPi}
              disabled={true}
            />
          </div>
        ) : (
          <div className="program-infomation-container" style={{ padding: '1%' }}>
            <Card
              className="card-container-primary medium square program-information-card"
              title="Program Information"
              shape="square"
              variant="primary"
              style={{ background: '#2A324A' }}
              content={contentPi}
              disabled={true}
            />
          </div>
        )}
        {segmentFlag ? (
          <Card shape="square" content={content} />
        ) : (
          <Card shape="square" content={content} />
        )}
      </div>
    </>
  );
};
export default PrintSegment;
