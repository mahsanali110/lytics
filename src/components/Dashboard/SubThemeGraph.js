import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DatePicker } from 'antd';
import moment from 'moment';
import { Space, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { GenerateGraphReport } from './GenerateGraphReport';
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
} from 'recharts';

import analyticsActions from 'modules/analytics/actions';

import { Button } from 'components/Common';
import { Select } from 'antd';
import topicsReducer from 'modules/topic/reducer';
const { Option, OptGroup } = Select;
const { RangePicker } = DatePicker;

const SubThemeGraph = ({
  channels,
  themes,
  topics,
  programNames,
  programTypes,
  runSubFunction,
  leftMargin,
}) => {
  const dispatch = useDispatch();
  const { subThemeStats, subTopicStats } = useSelector(state => state.analyticsReducer);
  const [allPrograms, setAllPrograms] = useState([]);
  let [startDate, setStartDate] = useState();
  let [endDate, setEndDate] = useState();
  const [selectedChannel, setSelectedChannel] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState([]);
  const [selectedTheme, setSelectedTheme] = useState(['Top 5']);
  const [selectedSubTopic, setSelectedSubTopic] = useState(['Top 5']);
  const [subTopicOptions, setSubTopicOptions] = useState([]);
  const [programMap, setProgramMap] = useState({});

  let themeGraph = useRef(null);
  let name = 'Significant Sub-Themes ';

  const channelsSelect = [];
  const [programsSelect, setProgramsSelect] = useState([]);
  const themesSelect = [];
  for (let i = 0; i < channels?.length; i++) {
    channelsSelect.push(channels[i].name);
  }

  // for (let i = 0; i < programNames?.length; i++) {
  //   programsSelect.push(programNames[i].title);
  // }
  for (let i = 0; i < topics?.length; i++) {
    themesSelect.push({ mainTheme: topics[i].name, subTheme: topics[i].topic2 });
  }

  useEffect(() => {
    if (!topics.length) return;
    let options = topics.map(topic => {
      return { mainTopic: topic.name, subTopic: topic.topic2 };
    });
    setSubTopicOptions([...options]);
  }, [topics]);

  useEffect(() => {
    handleGraphSearch();
  }, [selectedSubTopic]);
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
  //   let allPro = programNames?.map(pro => pro.title);
  //   setSelectedProgram(['All', ...allPro]);
  // }, [programNames]);

  useEffect(() => {
    let all = channels?.map(cha => cha.name);
    setSelectedChannel(['All', ...all]);
  }, [channels]);
  const handleRangeChange = (dates, dateStrings) => {
    setStartDate();
    setEndDate();
    setStartDate(dateStrings[0]);
    setEndDate(dateStrings[1]);
  };
  const handleGraphSearch = () => {
    const data = {
      startDate,
      endDate,
      channel: selectedChannel,
      programName: selectedProgram,
      topics: selectedSubTopic,
    };
    dispatch(analyticsActions.getSubTopicStats.request(data));
  };
  useEffect(() => {
    let lte = moment().format('YYYY-MM-DD');
    let gte = moment().subtract(1, 'day').format('YYYY-MM-DD');
    setStartDate(gte);
    setEndDate(lte);
  }, []);

  useEffect(() => {
    const data = {
      startDate,
      endDate,
      channel: selectedChannel,
      programName: selectedProgram,
      topics: selectedSubTopic,
    };
    dispatch(analyticsActions.getSubTopicStats.request(data));
  }, [selectedProgram]);
  useEffect(() => {
    if (runSubFunction === true) {
      run();
    } else {
    }
  }, [runSubFunction]);
  function run() {
    const data = {
      startDate,
      endDate,
      channel: selectedChannel,
      programName: selectedProgram,
      topics: selectedSubTopic,
    };
    dispatch(analyticsActions.getSubTopicStats.request(data));
  }
  useEffect(() => {
    handleGraphSearch();
  }, [selectedChannel]);
  useEffect(() => {
    handleGraphSearch();
  }, [startDate]);
  useEffect(() => {
    handleGraphSearch();
  }, [selectedTheme]);

  const handleMainGraphsReport = () => {
    let node = themeGraph.current.container;
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
  let labels = [];
  subTopicStats.forEach(d => {
    Object.keys(d).map(key => {
      if (labels.includes(key) == true) return;
      if (key == 'topic1') return;
      labels.push(key);
    });
  });

  const CustomToolTip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div
          className="custom-tooltip"
          style={{ background: 'white', padding: '6px', paddingTop: '19px' }}
        >
          {payload[0] &&
            Object.keys(payload[0]?.payload).map(key => {
              if (key == 'mainTheme') {
                return (
                  <>
                    <p className="label" style={{ fontSize: '12px' }}>{`${
                      payload && payload[0]?.payload?.mainTheme
                    }`}</p>
                  </>
                );
              } else if (key == 'topic1') {
                return;
              } else {
                return (
                  <>
                    <p className="label" style={{ fontSize: '12px' }}>{`${
                      payload && payload[0]?.payload[key]?.name
                    } : ${payload[0].payload[key].Count}`}</p>
                  </>
                );
              }
            })}
        </div>
      );
    }
    return null;
  };

  return (
    <>
      <div className="significant-sub-themes">
        <div className="graph-heading">
          <span style={{ fontWeight: 'bold' }}>Significant Sub-Themes of the Day</span>
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
              onChange={(value, e) => {
                setSelectedChannel(value);
                handleGraphSearch(value);
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
                handleGraphSearch(value);
              }}
              onSelect={value =>
                onSelect(value, programsSelect, selectedProgram, setSelectedProgram)
              }
              onDeselect={value =>
                onDeselect(value, programsSelect, selectedProgram, setSelectedProgram)
              }
              showSearch={true}
              // defaultValue="All"
            >
              {modifyOptions(programsSelect).map((program, index) => {
                if (index === 0) {
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
            <p className="graph_fonts">Sub Topics</p>
            <Select
              size="medium"
              getPopupContainer={trigger => trigger.parentNode}
              placeholder="Sub Topics"
              mode="multiple"
              maxTagCount="responsive"
              value={selectedSubTopic}
              style={{ minWidth: 110, width: 110, marginLeft: '10px' }}
              onChange={value => {
                setSelectedSubTopic(value);
                handleGraphSearch(value);
              }}
              onSelect={value =>
                onSelect(value, subTopicOptions, selectedSubTopic, setSelectedSubTopic, true)
              }
              onDeselect={value =>
                onDeselect(value, subTopicOptions, selectedSubTopic, setSelectedSubTopic)
              }
              showSearch={true}
            >
              {modifyOptions(subTopicOptions, 'top', 'subTopic').map((topic, index) => {
                {
                  if (index == 0) {
                    return (
                      <Option key={index} value={topic.subTopic} id="subThemeAllOption">
                        <div>
                          <span>{topic.subTopic}</span>
                        </div>
                      </Option>
                    );
                  }
                  if (index == 1) {
                    return (
                      <Option key={index} value={topic.subTopic} id="subThemeTopFiveOption">
                        <div>
                          <span>{topic.subTopic}</span>
                        </div>
                      </Option>
                    );
                  }
                  if (index == 2) {
                    return (
                      <Option key={index} value={topic.subTopic} id="subThemeTopOption">
                        <div>
                          <span>{topic.subTopic}</span>
                          <hr id="hrSelect"></hr>
                        </div>
                      </Option>
                    );
                  }
                  return (
                    <OptGroup label={topic.mainTopic}>
                      {topic.subTopic.map(sub => {
                        return (
                          <Option value={sub.name} id="themeOption">
                            <div>
                              <span>{sub.name}</span>
                            </div>
                          </Option>
                        );
                      })}
                    </OptGroup>
                  );
                }
              })}
            </Select>
          </div>
        </div>
        <div className="graph-container">
        <ResponsiveContainer>
          <BarChart
            ref={themeGraph}
            data={subTopicStats}
            layout="vertical"
            margin={{ top: 50, right: 50, left: 50, bottom: 50 }}
          >
            <defs>
              <linearGradient id="subThemeColorBarChart" x1="0" y1="0" x2="1" y2="0">
                <stop offset="4%" stopColor="#19BCFD" stopOpacity={1} />
                <stop offset="60%" stopColor="#54E9E5" stopOpacity={1} />
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
                padding={{ top: 100, bottom: 10 }}
                label={{
                  value: 'Sub Topics',
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
            {labels.map(label => {
              return (
                <Bar
                  barSize={100}
                  isAnimationActiveBoolean={false}
                  isAnimationActive={false}
                  dataKey={`${label}.Count`}
                  fill="url(#subThemeColorBarChart)"
                  minPointSize={130}
                  style={{ marginTop: '10px', borderRadius: '1 rem', height: '15px' }}
                  id="bar"
                >
                  <LabelList
                    dataKey={`${label}.name`}
                    position="middle"
                    fill="#fff"
                    style={{ fontSize: '10px', color: 'white !important' }}
                    id="label"
                  />
                </Bar>
              );
            })}
            {/* <Bar
              barSize={100}
              barCategoryGap={40}
              barGap={35}
              dataKey="subTheme2"
              fill="url(#subThemeColorBarChart)"
              minPointSize={130}
              style={{ marginTop: '5px', borderRadius: '1 rem', height: '15px' }}
              id="bar"
            ></Bar> */}
            <Tooltip cursor={{ fill: 'transparent' }} />
          </BarChart>
        </ResponsiveContainer>
          <div className="graph-download-button">
            <span>
              <Button
                disabled={subTopicStats.length>0 ? false : true}
                variant="secondary"
                onClick={handleMainGraphsReport}
              >
                REPORT
              </Button>
            </span>
          </div>
        </div>
      </div>
      {/* <div
        className="graph-container-copy"
        style={{ visibility: 'none', marginLeft: '-3900px', marginTop: '-1210px' }}
      >
    
      </div> */}
    </>
  );
};

export default SubThemeGraph;
