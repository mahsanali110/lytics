import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DatePicker } from 'antd';
import moment from 'moment';
import { GenerateGraphReport } from './GenerateGraphReport';
import { Space, Spin, Row, Col } from 'antd';
import { modifyOptions, onSelect, onDeselect } from './utils';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LabelList,
  Cell,
} from 'recharts';

import analyticsActions from 'modules/analytics/actions';
import { Button } from 'components/Common';
import { Select } from 'antd';
const { Option } = Select;
const { RangePicker } = DatePicker;

const MainThemeGraph = ({
  channels,
  themes,
  topics,
  programNames,
  programTypes,
  runMainFunctuion,
}) => {
  const dispatch = useDispatch();
  const { mainThemeStats, mainTopicStats, loading } = useSelector(state => state.analyticsReducer);
  const { topicRecords } = useSelector(state => state.topicsReducer);
  const [allPrograms, setAllPrograms] = useState([]);
  let [startDate, setStartDate] = useState();
  let [endDate, setEndDate] = useState();
  const [selectedChannel, setSelectedChannel] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState(['Top 5']);
  const [selectedTopic, setSelectedTopic] = useState(['Top 5']);
  const [topicOptions, setTopicOptions] = useState([]);
  const [topicColors, setTopicColors] = useState({});
  let mainGraph = useRef(null);
  const channelsSelect = [];
  const [programsSelect, setProgramsSelect] = useState([]);
  const [programMap, setProgramMap] = useState({});
  const themesSelect = [];
  let name = 'MainThemes Report ';
  for (let i = 0; i < channels?.length; i++) {
    channelsSelect.push(channels[i].name);
  }

  // for (let i = 0; i < programNames?.length; i++) {
  //   programsSelect.push(programNames[i].title);
  // }
  for (let i = 0; i < themes?.length; i++) {
    themesSelect.push(themes[i].name);
  }

  useEffect(() => {
    let newColors = {};
    topicRecords.forEach(topic => {
      newColors[topic.name] = topic.color;
    });
    setTopicColors(newColors);
  }, [topicRecords]);

  useEffect(() => {
    if (!topics.length) return;
    let options = topics.map(topic => {
      return topic.name;
    });
    setTopicOptions([...options]);
  }, [topics]);

  // useEffect to set programMap state //
  useEffect(() => {
    if (!programNames?.length) return;
    let map = {};
    programNames.forEach((program, index) => {
      map[program.channel] = [...(map[program.channel] || []), program.title];
    });
    setProgramMap(map);
  }, [programNames]);

  useEffect(() => {
    let filteredPrograms = [];
    if (selectedChannel.length > 0) {
      selectedChannel?.forEach(channel => {
        if (channel in programMap) {
          filteredPrograms = [...filteredPrograms, ...programMap[channel]];
        }
      });
    }
    let types = [];
    if (programTypes?.length) {
      types = programTypes.map(type => type.name);
    }
    setProgramsSelect([...types, ...filteredPrograms]);
    if (selectedChannel.length > 0) {
      filteredPrograms.unshift('All');
    }
    setSelectedProgram([...types, ...filteredPrograms]);
  }, [selectedChannel, programNames, programTypes]);

  // useEffect(() => {
  //   let allPro = programNames.filter(pro => pro.title);
  //   if(allPro.length) console.log({allPro});
  //   setSelectedProgram(['All',...allPro]);
  // }, [programNames]);

  useEffect(() => {
    let all = channels.map(cha => cha.name);
    setSelectedChannel(['All', ...all]);
  }, [channels]);
  useEffect(() => {
    let lte = moment().format('YYYY-MM-DD');
    let gte = moment().subtract(1, 'day').format('YYYY-MM-DD');
    setStartDate(gte);
    setEndDate(lte);
  }, []);
  useEffect(() => {
    // const data = {
    //   endDate,
    //   startDate,
    //   channel: selectedChannel,
    //   programName: selectedProgram,
    //   theme: selectedTheme,
    // };
    // dispatch(analyticsActions.getMainThemeStats.request(data));
    const data = {
      endDate,
      startDate,
      channel: selectedChannel,
      programName: selectedProgram,
      topics: selectedTopic,
    };
    dispatch(analyticsActions.getMainTopicStats.request(data));
  }, [selectedProgram]);
  useEffect(() => {
    if (runMainFunctuion === true) {
      run();
    } else {
      // setLoading(false);
    }
  }, [runMainFunctuion]);
  function run() {
    if (typeof startDate !== 'undefined' && startDate !== null) {
      // const data = {
      //   endDate,
      //   startDate,
      //   channel: selectedChannel,
      //   programName: selectedProgram,
      //   theme: selectedTheme,
      // };
      // dispatch(analyticsActions.getMainThemeStats.request(data));
      const data = {
        endDate,
        startDate,
        channel: selectedChannel,
        programName: selectedProgram,
        topics: selectedTopic,
      };
      dispatch(analyticsActions.getMainTopicStats.request(data));
    } else {
      endDate = moment().format('YYYY-MM-DD');
      startDate = moment().subtract(1, 'day').format('YYYY-MM-DD');
      const data = {
        endDate,
        startDate,
        channel: selectedChannel,
        programName: selectedProgram,
        topics: selectedTopic,
      };
      dispatch(analyticsActions.getMainTopicStats.request(data));
      // const data = {
      //   endDate,
      //   startDate,
      //   channel: selectedChannel,
      //   programName: selectedProgram,
      //   theme: selectedTheme,
      // };
      // dispatch(analyticsActions.getMainThemeStats.request(data));
    }
  }
  const handleRangeChange = (dates, dateStrings) => {
    setStartDate('');
    setEndDate('');
    setStartDate(dateStrings[0]);
    setEndDate(dateStrings[1]);
    handleGraphSearch();
  };
  useEffect(() => {
    handleGraphSearch();
  }, [selectedChannel]);
  useEffect(() => {
    handleGraphSearch();
  }, [startDate]);
  useEffect(() => {
    handleGraphSearch();
  }, [selectedTheme]);
  const handleGraphSearch = value => {
    const data = {
      endDate,
      startDate,
      channel: selectedChannel,
      programName: selectedProgram,
      topics: selectedTopic,
    };
    dispatch(analyticsActions.getMainTopicStats.request(data));
    // const data = {
    //   endDate,
    //   startDate,
    //   channel: selectedChannel,
    //   programName: selectedProgram,
    //   theme: selectedTheme,
    // };
    // dispatch(analyticsActions.getMainThemeStats.request(data));
  };
  const handleMainGraphsReport = () => {
    channelsSelect;
    let node = mainGraph.current.container;
    GenerateGraphReport(node, startDate, endDate, name);
  };
  useEffect(() => {
    if (
      selectedTheme &&
      selectedTheme.length > 1 &&
      selectedTheme.includes('All') &&
      selectedTheme.includes('Top 5') &&
      selectedTheme.includes('Top 10')
    ) {
      const newSelectedTheme = selectedTheme.splice(1);
      setSelectedTheme(newSelectedTheme);
    }
  }, [selectedTheme && selectedTheme]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active) {
      return (
        <div
          className="custom-tooltip"
          style={{ background: 'white', padding: '6px', paddingTop: '19px' }}
        >
          <p className="label" style={{ fontSize: '12px' }}>{`${label} : ${
            payload && payload[0]?.value
          }`}</p>
        </div>
      );
    }

    return null;
  };

  return (
    <>
      <div className="electronic-media">
        <div className="graph-heading">
          <span style={{ fontWeight: 'bold' }}>Electronic Media Focus: All Talk Shows</span>
          <span className="">
            {typeof startDate === 'undefined' ? (
              <>
                <p className="date_classes">
                  {moment().subtract(1, 'day').format('ll')} - {moment().format('ll')}
                </p>
              </>
            ) : (
              <>
                {startDate ? (
                  <p className="date_classes">{`${moment(startDate).format('ll')} - ${moment(
                    endDate
                  ).format('ll')}`}</p>
                ) : (
                  <></>
                )}
              </>
            )}
          </span>
        </div>
        <div className="graph-filters-container">
          <div id="select">
            <p className="graph_fonts" style={{ paddingLeft: '0px' }}>
              Date
            </p>
            <RangePicker
              onChange={handleRangeChange}
              defaultValue={[moment().subtract(1, 'day'), moment()]}
            />
          </div>

          <div id="select">
            <p className="graph_fonts">Channels</p>
            <Select
              value={selectedChannel}
              size="medium"
              mode="multiple"
              maxTagCount="responsive"
              getPopupContainer={trigger => trigger.parentNode}
              placeholder="Channel"
              style={{ minWidth: 110, width: 110, marginLeft: '10px' }}
              onChange={value => {
                setSelectedChannel(value);
                handleGraphSearch();
              }}
              onSelect={value =>
                onSelect(value, channelsSelect, selectedChannel, setSelectedChannel)
              }
              onDeselect={value =>
                onDeselect(value, channelsSelect, selectedChannel, setSelectedChannel)
              }
              showSearch={true}
            >
              {modifyOptions(channelsSelect)?.map((channel, index) => {
                if (index == 0) {
                  return (
                    <>
                      <Option key={index} value={channel} id="selectFirstOption">
                        <div>
                          <span>{channel}</span>
                          <hr id="hrSelect"></hr>
                        </div>
                      </Option>
                    </>
                  );
                } else {
                  return (
                    <Option value={channel} key={index} id="options">
                      <div>{channel}</div>
                    </Option>
                  );
                }
              })}
            </Select>
          </div>
          <div id="select">
            <p className="graph_fonts">Programs</p>
            <Select
              value={selectedProgram}
              size="medium"
              mode="multiple"
              maxTagCount="responsive"
              getPopupContainer={trigger => trigger.parentNode}
              placeholder="Program"
              style={{ minWidth: 110, width: 110, marginLeft: '10px' }}
              onChange={value => {
                setSelectedProgram(value);
                handleGraphSearch();
              }}
              onSelect={value =>
                onSelect(value, programsSelect, selectedProgram, setSelectedProgram)
              }
              onDeselect={value =>
                onDeselect(value, programsSelect, selectedProgram, setSelectedProgram)
              }
              showSearch={true}
            >
              {modifyOptions(programsSelect)?.map((program, index) => {
                if (index == 0) {
                  return (
                    <>
                      <Option key={index} value={program} id="selectFirstOption">
                        <div>
                          <span>{program}</span>
                          <hr id="hrSelect"></hr>
                        </div>
                      </Option>
                    </>
                  );
                } else {
                  return (
                    <Option value={program} key={index} id="proOptions">
                      <div>{program}</div>
                    </Option>
                  );
                }
              })}
            </Select>
          </div>
          <div id="select">
            <p className="graph_fonts">Main Topics</p>
            <Select
              size="medium"
              placeholder="Topic"
              getPopupContainer={trigger => trigger.parentNode}
              mode="multiple"
              maxTagCount="responsive"
              value={selectedTopic}
              style={{ minWidth: 110, width: 110, marginLeft: '10px' }}
              onChange={value => {
                setSelectedTopic(value);
                handleGraphSearch(value);
              }}
              onSelect={value => onSelect(value, topicOptions, selectedTopic, setSelectedTopic)}
              onDeselect={value => onDeselect(value, topicOptions, selectedTopic, setSelectedTopic)}
              showSearch={true}
            >
              {modifyOptions(topicOptions, 'top')?.map((topic, index) => {
                if (index == 0) {
                  return (
                    <Option key={index} value={topic} id="subThemeAllOption">
                      <div>
                        <span>{topic}</span>
                      </div>
                    </Option>
                  );
                }
                if (index == 1) {
                  return (
                    <Option key={index} value={topic} id="subThemeTopFiveOption">
                      <div>
                        <span>{topic}</span>
                      </div>
                    </Option>
                  );
                }
                if (index == 2) {
                  return (
                    <Option key={index} value={topic} id="subThemeTopOption">
                      <div>
                        <span>{topic}</span>
                        <hr id="hrSelect"></hr>
                      </div>
                    </Option>
                  );
                }
                return (
                  <Option key={index} value={topic} id="themeOption">
                    <div
                      onClick={() => {
                        selectedTopic?.map(sel => {
                          if (sel === 'All') selectedTopic.shift();
                          if (sel === 'Top 5') selectedTopic.shift();
                          if (sel === 'Top 10') selectedTopic.shift();
                        });
                      }}
                    >
                      <span>{topic}</span>
                    </div>
                  </Option>
                );
              })}
            </Select>
          </div>
        </div>
        <div className="graph-container">
          <ResponsiveContainer>
            <BarChart
              data={mainTopicStats}
              layout="vertical"
              margin={{ top: 20, right: 50, left: -30, bottom: 50 }}
            >
              <defs>
                <linearGradient id="colorBarChart" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="50%" stopColor="#FE9960" stopOpacity={1} />
                  <stop offset="90%" stopColor="#EF233C" stopOpacity={1} />
                </linearGradient>
              </defs>
              <XAxis
                tick={{ fill: '#C0C7CE' }}
                interval={0}
                type="number"
                label={{
                  value: 'No. of Prog/Segments',
                  angle: 0,
                  position: 'bottom',
                  fill: '#fff',
                }}
              />
              <YAxis
                tick={{ fill: '#C0C7CE' }}
                interval={0}
                label={{
                  value: 'Main Topics',
                  angle: -90,
                  position: 'left',
                  padding: { top: 100 },
                  fill: '#fff',
                }}
                type="category"
                width={120}
                padding={{ left: -25 }}
                style={{ marginLeft: '-20px' }}
                dataKey="topic1"
              />
              <CartesianGrid horizontal={false} stroke="#ccc" strokeDasharray="2 4" />
              <Bar
                dataKey="Programs"
                fill="url(#colorBarChart)"
                isAnimationActiveBoolean={false}
                isAnimationActive={false}
              >
                {mainTopicStats.map((topic, index) => {
                  return (
                    <Cell key={`cell-${index}`} fill={topicColors[topic.topic1] ?? '#EF233C'} />
                  );
                })}
                <LabelList dataKey="Programs" position="middle" fill="#fff" />
              </Bar>
              {/* <Tooltip cursor={{ fill: 'transparent' }} /> */}
              <Tooltip cursor={{ fill: 'transparent' }} content={<CustomTooltip />} />
            </BarChart>
          </ResponsiveContainer>
          <div className="graph-download-button">
            <span>
              <Button variant="secondary" onClick={handleMainGraphsReport}>
                REPORT
              </Button>
            </span>
          </div>
        </div>
      </div>
      <div
        className="graph-container-copy"
        style={{ marginTop: '-5500px', height: '1500px', width: '1500px' }}
      >
        <ResponsiveContainer
          style={{ maxHeight: '500px', maxWidth: '400px', backgroundColor: 'red' }}
        >
          <BarChart
            ref={mainGraph}
            data={mainTopicStats}
            layout="vertical"
            margin={{ top: 50, right: 50, left: 100, bottom: 50 }}
          >
            <defs>
              <linearGradient id="colorBarChart" x1="0" y1="0" x2="0" y2="1">
                <stop offset="50%" stopColor="#FE9960" stopOpacity={1} />
                <stop offset="90%" stopColor="#EF233C" stopOpacity={1} />
              </linearGradient>
            </defs>
            <XAxis
              tick={{}}
              interval={0}
              type="number"
              label={{
                value: 'No. of Prog/Segments',
                angle: 0,
                position: 'bottom',
                fontSize: 35,
              }}
              style={{ fontSize: '35px' }}
            />
            <YAxis
              tick={{}}
              label={{
                value: 'Main Topics',
                angle: -90,
                position: 'left',
                padding: { top: 100 },
                fontSize: 30,
              }}
              type="category"
              width={150}
              padding={{ left: 15 }}
              dataKey="topic1"
              style={{ fontSize: '30px' }}
            />
            <CartesianGrid horizontal={false} stroke="#ccc" strokeDasharray="2 4" />
            <Bar
              dataKey="Programs"
              fill="url(#colorBarChart)"
              isAnimationActiveBoolean={false}
              isAnimationActive={false}
            >
              {mainTopicStats.map((topic, index) => {
                return <Cell key={`cell-${index}`} fill={topicColors[topic.topic1] ?? '#EF233C'} />;
              })}
              <LabelList
                dataKey="programs"
                position="middle"
                fill="#201F1F"
                style={{ fontSize: '35px' }}
              />
            </Bar>
            <Tooltip cursor={{ fill: 'transparent' }} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default MainThemeGraph;
