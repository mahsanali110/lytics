import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row, DatePicker, Spin } from 'antd';
import { LoadingPage, Select } from 'components/Common';
import moment from 'moment';

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts';

import commonActions from 'modules/common/actions';
import channelActions from 'modules/channels/actions';
import MainThemeGraph from './MainThemeGraph';
import SubThemeGraph from './SubThemeGraph';
import StatePillarGraph from './StatePillarGraph';
import analyticsActions from 'modules/analytics/actions';
import guestsActions from 'modules/guests/actions';
import alarmActions from 'modules/alarms/actions';
import topicActions from 'modules/topic/actions';
import './Dashboard.scss';
import { networkError, errorCount, errorDelay } from 'constants/config/errorLoader';

const { RangePicker } = DatePicker;

const QueryinitialValues = {
  words: '',
  startDate: '',
  endDate: '',
};
const GuestinitialValues = {
  guestName: '',
  startDate: '',
  endDate: '',
};

const Dashboard = () => {
  const [channelsCount, setChannelsCount] = useState(1);
  const [programTypesCount, setProgramTypesCount] = useState(1);
  const [topicsCount, setTopicsCount] = useState(1);
  const [alarmCount, setAlarmCount] = useState(1);
  const [guestsCount, setGuestsCount] = useState(1);
  const dispatch = useDispatch();

  const { channels, channelsError } = useSelector(state => state.channelsReducer);
  const { themes, topics, programNames, programTypes, loading, topicsError, programTypesError } =
    useSelector(state => state.commonReducer);
  var { wordCount, secondWordCount, guestCount, secondGuestCount } = useSelector(
    state => state.analyticsReducer
  );
  const [queryWord, setQueryWord] = useState(QueryinitialValues);
  const [secondQueryWord, setSecondQueryWord] = useState(QueryinitialValues);
  const [guestMentions, setGuestMentions] = useState(GuestinitialValues);
  const [guestMentionsSecond, setGuestMentionsSecond] = useState(GuestinitialValues);
  const [runMainFunctuion, setRunMainFunction] = useState(true);
  const [runSubFunction, setRunSubFunction] = useState(true);
  const [runSetFunction, setRunSetFunction] = useState(true);
  const { guests, guestError } = useSelector(state => state.guestsReducer);
  const { alarms, alarmsError } = useSelector(state => state.alarmReducer);

  const fetchDefaultConfigurations = () => {
    dispatch(commonActions.fetchHosts.request());
    dispatch(commonActions.fetchThemes.request());
    dispatch(commonActions.fetchTopics.request());
    dispatch(commonActions.fetchGuests.request());
    dispatch(commonActions.fetchProgramNames.request());
    dispatch(commonActions.fetchProgramTypes.request());
    dispatch(channelActions.getChannels.request());
    dispatch(guestsActions.getGuests.request());
    dispatch(alarmActions.getAlarms.request());
    dispatch(topicActions.getTopics.request());
  };

  useEffect(() => {
    if (channelsError || channelsError === networkError) {
      setChannelsCount(prevCount => prevCount + 1);
      if (channelsCount <= errorCount) {
        setTimeout(() => {
          dispatch(channelActions.getChannels.request());
        }, errorDelay);
      } else if (channelsError === networkError) {
        alert(`${channelsError}, Please refresh!`);
        window.location.reload();
      } else if (channelsError !== networkError) {
        alert(`${channelsError}, Please refresh!`);
        window.location.reload();
      }
    }
  }, [channelsError]);
  useEffect(() => {
    if (programTypesError || programTypesError === networkError) {
      setProgramTypesCount(prevCount => prevCount + 1);
      if (programTypesCount <= errorCount) {
        setTimeout(() => {
          dispatch(commonActions.fetchProgramTypes.request());
        }, errorDelay);
      } else if (programTypesError === networkError) {
        alert(`${programTypesError}, Please refresh!`);
        window.location.reload();
      } else if (programTypesError !== networkError) {
        alert(`${programTypesError}, Please refresh!`);
        window.location.reload();
      }
    }
  }, [programTypesError]);
  useEffect(() => {
    if (guestError || guestError === networkError) {
      setGuestsCount(prevCount => prevCount + 1);
      if (guestsCount <= errorCount) {
        setTimeout(() => {
          dispatch(guestsActions.getGuests.request());
        }, errorDelay);
      } else if (guestError === networkError) {
        alert(`${guestError}, Please refresh!`);
        window.location.reload();
      } else if (guestError !== networkError) {
        alert(`${guestError}, Please refresh!`);
        window.location.reload();
      }
    }
  }, [guestError]);
  useEffect(() => {
    if (topicsError || topicsError === networkError) {
      setTopicsCount(prevCount => prevCount + 1);
      if (topicsCount <= errorCount) {
        setTimeout(() => {
          dispatch(commonActions.fetchTopics.request());
        }, errorDelay);
      } else if (topicsError === networkError) {
        alert(`${topicsError}, Please refresh!`);
        window.location.reload();
      } else if (topicsError !== networkError) {
        alert(`${topicsError}, Please refresh!`);
        window.location.reload();
      }
    }
  }, [topicsError]);
  useEffect(() => {
    if (alarmsError || alarmsError === networkError) {
      setAlarmCount(prevCount => prevCount + 1);
      if (alarmCount <= errorCount) {
        setTimeout(() => {
          dispatch(alarmActions.getAlarms.request());
        }, errorDelay);
      } else if (alarmsError === networkError) {
        alert(`${alarmsError}, Please refresh!`);
        window.location.reload();
      } else if (alarmsError !== networkError) {
        alert(`${alarmsError}, Please refresh!`);
        window.location.reload();
      }
    }
  }, [alarmsError]);

  useEffect(() => {
    fetchDefaultConfigurations();
  }, []);

  const handleQueryChange = (event, order) => {
    const data = {};
    if (order === 'first') {
      setQueryWord({
        ...queryWord,
        words: event,
      });
      data.words = event;
      (data.startDate = queryWord.startDate), (data.endDate = queryWord.endDate);
      dispatch(analyticsActions.addAlaramStats.request(data));
    } else {
      setSecondQueryWord({
        ...secondQueryWord,
        words: event,
      });
      data.words = event;
      data.startDate = secondQueryWord.startDate;
      data.endDate = secondQueryWord.endDate;
      dispatch(analyticsActions.addSecondAlramStats.request(data));
    }
  };

  const handleRangeChange = (dates, dateStrings) => {
    setQueryWord({
      ...queryWord,
      startDate: dateStrings[0],
      endDate: dateStrings[1],
    });
    const data = {
      queryWord: queryWord.words,
      startDate: dateStrings[0],
      endDate: dateStrings[1],
    };
    dispatch(analyticsActions.addAlaramStats.request(data));
  };
  const handleRangeChangeSecond = (dates, dateStrings) => {
    setSecondQueryWord({
      ...secondQueryWord,
      startDate: dateStrings[0],
      endDate: dateStrings[1],
    });
    const data = {
      queryWord: queryWord.words,
      startDate: dateStrings[0],
      endDate: dateStrings[1],
    };
    dispatch(analyticsActions.addSecondAlramStats.request(data));
  };

  const handleGuestTimeFirst = (dates, dateStrings) => {
    setGuestMentions({
      ...guestMentions,
      startDate: dateStrings[0],
      endDate: dateStrings[1],
    });
    const data = {
      guestName: guestMentions.guestName,
      startDate: dateStrings[0],
      endDate: dateStrings[1],
    };
    dispatch(analyticsActions.getGuestReportStats.request(data));
  };

  const handleGuestTimeSecond = (dates, dateStrings) => {
    setGuestMentionsSecond({
      ...guestMentionsSecond,
      startDate: dateStrings[0],
      endDate: dateStrings[1],
    });
    const data = {
      guestName: guestMentionsSecond.guestName,
      startDate: dateStrings[0],
      endDate: dateStrings[1],
    };
    dispatch(analyticsActions.getSecondGuestReportStats.request(data));
  };

  const handleGuestChange = (event, order) => {
    var data = {};
    if (order === 'first') {
      setGuestMentions({
        ...guestMentions,
        guestName: event,
      });
      data.guestName = event;
      data.startDate = guestMentions.startDate;
      data.endDate = guestMentions.endDate;
      dispatch(analyticsActions.getGuestReportStats.request(data));
    } else {
      setGuestMentionsSecond({
        ...guestMentionsSecond,
        guestName: event,
      });
      data.guestName = event;
      data.startDate = guestMentionsSecond.startDate;
      data.endDate = guestMentionsSecond.endDate;
      dispatch(analyticsActions.getSecondGuestReportStats.request(data));
    }
  };

  const dataChart8 = [
    {
      name: 'January',
      uv: 4000,
    },
    {
      name: 'February',
      uv: 3000,
    },
    {
      name: 'March',
      uv: 2000,
    },
    {
      name: 'April',
      uv: 2780,
    },
    {
      name: 'May',
      uv: 1890,
    },
    {
      name: 'June',
      uv: 2390,
    },
    {
      name: 'July',
      uv: 3490,
    },
    {
      name: 'August',
      uv: 2490,
    },
    {
      name: 'Spetember',
      uv: 3100,
    },
    {
      name: 'October',
      uv: 3990,
    },
    {
      name: 'November',
      uv: 2500,
    },
    {
      name: 'December',
      uv: 1600,
    },
  ];
  useEffect(() => {
    const interval = setInterval(() => {
      setRunSetFunction(true);
      setRunMainFunction(true);
      setRunSubFunction(true);
    }, 60000);
    return () => {
      setTimeout(function () {
        setRunSetFunction(false);
        setRunMainFunction(false);
        setRunSubFunction(false);
      }, 1000);
      clearInterval(interval);
    };
  });
  return loading ? (
    <LoadingPage />
  ) : (
    <div className="dashboard-container" key={123}>
      <Spin spinning={channelsError || programTypesError || topicsError} delay={500}>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} style={{ marginBottom: '20px' }}>
          <Col span={8}>
            <MainThemeGraph
              channels={channels}
              themes={themes}
              topics={topics}
              programNames={programNames}
              programTypes={programTypes}
              runMainFunctuion={runMainFunctuion}
            />
          </Col>
          <Col span={8} className="dashboard-col">
            <SubThemeGraph
              channels={channels}
              themes={themes}
              topics={topics}
              programNames={programNames}
              programTypes={programTypes}
              runSubFunction={runSubFunction}
              leftMargin={-30}
            />
          </Col>
          <Col span={8} className="dashboard-col">
            <StatePillarGraph
              channels={channels}
              programNames={programNames}
              programTypes={programTypes}
              runFunction={runSetFunction}
            />
          </Col>
        </Row>
      </Spin>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col span={12}>
          <Spin spinning={alarmsError} delay={500}>
            <Row gutter={48} className="mini-stats-container">
              <Col span={12} style={{ marginLeft: '-20px' }}>
                <div className="mini-stats">
                  <h2 className="query-header">Query Word</h2>
                  <div className="query-inputs-div">
                    <div>
                      <label className="left-labels">Word</label>
                      <br />
                      <Select
                        placeholder="Words"
                        options={Object.values(alarms)?.map(alarm => ({
                          title: alarm.queryWord,
                          value: alarm.queryWord,
                        }))}
                        className="query-inputs"
                        onChange={event => handleQueryChange(event, 'first')}
                      />
                    </div>
                    <div>
                      <label className="right-labels">Duration</label>
                      <br />
                      <RangePicker className="range-picker" onChange={handleRangeChange} />
                    </div>
                  </div>
                  <h1 className="query-count">{wordCount.length} Times</h1>
                </div>
              </Col>
              <Col span={12} style={{ marginLeft: '15px' }}>
                <div className="mini-stats">
                  <h2 className="query-header">Query Word</h2>
                  <div className="query-inputs-div">
                    <div>
                      <label className="left-labels">Word</label>
                      <br />
                      <Select
                        placeholder="Words"
                        options={Object.values(alarms)?.map(alarm => ({
                          title: alarm.queryWord,
                          value: alarm.queryWord,
                        }))}
                        className="query-inputs"
                        onChange={event => handleQueryChange(event, 'second')}
                      />
                    </div>

                    <div>
                      <label className="right-labels">Duration</label>
                      <br />
                      <RangePicker className="range-picker" onChange={handleRangeChangeSecond} />
                    </div>
                  </div>
                  <h1 className="query-count">{secondWordCount.length} Times</h1>
                </div>
              </Col>
            </Row>
          </Spin>
          <Spin spinning={guestError} delay={500}>
            <Row gutter={48} className="mini-stats-container">
              <Col span={12} style={{ marginLeft: '-20px' }}>
                <div className="mini-stats">
                  <h2 className="query-header">Guest Mentions</h2>
                  <div className="query-inputs-div">
                    <div>
                      <label className="left-labels">Guest Name</label>
                      <br />
                      <Select
                        options={guests.map(guest => ({ title: guest.name, value: guest.name }))}
                        placeholder="Guest Name"
                        className="query-inputs"
                        onChange={event => handleGuestChange(event, 'first')}
                      />
                    </div>

                    <div>
                      <label className="right-labels">Duration</label>
                      <br />
                      <RangePicker className="range-picker" onChange={handleGuestTimeFirst} />
                    </div>
                  </div>
                  <h1 className="query-count">{guestCount.length} Times</h1>
                </div>
              </Col>
              <Col span={12} style={{ marginLeft: '15px' }}>
                <div className="mini-stats">
                  <h2 className="query-header">Guest Mentions</h2>
                  <div className="query-inputs-div">
                    <div>
                      <label className="left-labels">Guest Name</label>
                      <br />
                      <Select
                        options={guests.map(guest => ({ title: guest.name, value: guest.name }))}
                        placeholder="Guest Name"
                        className="query-inputs"
                        onChange={event => handleGuestChange(event, 'second')}
                      />
                    </div>

                    <div>
                      <label className="right-labels">Durations</label>
                      <br />
                      <RangePicker className="range-picker" onChange={handleGuestTimeSecond} />
                    </div>
                  </div>
                  <h1 className="query-count">{secondGuestCount.length} Times</h1>
                </div>
              </Col>
            </Row>
          </Spin>
        </Col>
        <Col span={12}>
          <div className="negative-sentiments">
            <ResponsiveContainer>
              <LineChart data={dataChart8} margin={{ top: 50, right: 50, left: 30, bottom: 50 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="uv" stroke="#EF233C" strokeWidth={2} />
                <CartesianGrid vertical={false} stroke="#1b1d28" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
