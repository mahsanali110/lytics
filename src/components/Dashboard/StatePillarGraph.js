import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DatePicker } from 'antd';
import moment from 'moment';
import { Space, Spin } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import './report.scss';
import { modifyOptions, onSelect, onDeselect } from './utils';

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  LabelList,
} from 'recharts';

import analyticsActions from 'modules/analytics/actions';

import { Button } from 'components/Common';
import { Select } from 'antd';
const { Option } = Select;
import { GenerateGraphReport } from './GenerateGraphReport';
const { RangePicker } = DatePicker;

const StatePillarGraph = ({ channels, programNames, programTypes, runFunction }) => {
  const dispatch = useDispatch();
  const { statePillarStats } = useSelector(state => state.analyticsReducer);
  let [startDate, setStartDate] = useState();
  let [endDate, setEndDate] = useState();
  const [selectedChannel, setSelectedChannel] = useState([]);
  const [selectedProgram, setSelectedProgram] = useState([]);
  const [programMap, setProgramMap] = useState({});

  let name = 'Trend Analysis ';

  const channelsSelect = [];
  const [programsSelect, setProgramsSelect] = useState([]);
  let pillerGraph = useRef(null);
  for (let i = 0; i < channels?.length; i++) {
    channelsSelect.push(channels[i].name);
  }

  // for (let i = 0; i < programNames?.length; i++) {
  //   programsSelect.push(programNames[i].title);
  // }
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

  const handleRangeChange = (dates, dateStrings) => {
    setStartDate();
    setEndDate();
    setStartDate(dateStrings[0]);
    setEndDate(dateStrings[1]);
  };

  // useEffect(() => {
  //   let allPro = programNames?.map(pro =>  pro.title);
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
    dispatch(
      analyticsActions.getStatePillarStats.request({
        startDate,
        endDate,
        channel: selectedChannel,
        programName: selectedProgram,
      })
    );
  }, [selectedProgram]);
  useEffect(() => {
    handleGraphSearch();
  }, [startDate]);
  useEffect(() => {
    handleGraphSearch();
  }, [selectedChannel]);
  useEffect(() => {
    if (runFunction === true) {
      run();
    }
  }, [runFunction]);
  function run() {
    dispatch(
      analyticsActions.getStatePillarStats.request({
        startDate,
        endDate,
        channel: selectedChannel,
        programName: selectedProgram,
      })
    );
  }
  const handleMainGraphsReport = () => {
    let node = pillerGraph.current.container;
    GenerateGraphReport(node, startDate, endDate, name);
  };
  const handleGraphSearch = () => {
    dispatch(
      analyticsActions.getStatePillarStats.request({
        startDate,
        endDate,
        channel: selectedChannel,
        programName: selectedProgram,
      })
    );
  };
  return (
    <>
      <div className="trend-analysis">
        <div className="graph-heading">
          <span style={{ fontWeight: 'bold' }}>Trend Analysis w.r.t Pillars Of State</span>
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
              onChange={(value, e) => {
                setSelectedProgram(value);
              }}
              onSelect={value =>
                onSelect(value, programsSelect, selectedProgram, setSelectedProgram)
              }
              onDeselect={value =>
                onDeselect(value, programsSelect, selectedProgram, setSelectedProgram)
              }
              showSearch={true}
            >
              {modifyOptions(programsSelect).map((program, index) => {
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
        </div>
        <div className="graph-container">
          <ResponsiveContainer>
            <BarChart
              data={statePillarStats}
              layout="vertical"
              margin={{ top: 20, right: 50, left: -30, bottom: 50 }}
            >
              <XAxis
                tick={{ fill: '#C0C7CE' }}
                interval={0}
                // ticks={[0, 25, 50, 75, 100]}
                type="number"
                label={{
                  value: 'Trend Percentage',
                  angle: 0,
                  position: 'bottom',
                  fill: '#fff',
                }}
              />
              <YAxis
                tick={{ fill: '#C0C7CE' }}
                label={{
                  value: 'Pillars of State',
                  angle: -90,
                  position: 'left',
                  padding: { top: 100 },
                  fill: '#fff',
                }}
                type="category"
                width={150}
                padding={{ left: 20 }}
                dataKey="name"
              />

              <Bar
                dataKey="Positive"
                stackId="a"
                fill="#1EA476"
                isAnimationActiveBoolean={false}
                isAnimationActive={false}
              >
                <LabelList dataKey="pos" position="middle" fill="#fff" />
              </Bar>
              <Bar
                dataKey="Negative"
                stackId="a"
                fill="#EC4040"
                isAnimationActiveBoolean={false}
                isAnimationActive={false}
              >
                <LabelList dataKey="neg" position="middle" fill="#fff" />
              </Bar>
              <Bar
                dataKey="Balanced"
                stackId="a"
                fill="#0091BF"
                isAnimationActiveBoolean={false}
                isAnimationActive={false}
              >
                <LabelList dataKey="bal" position="middle" fill="#fff" />
              </Bar>
              <Bar
                dataKey="Objective"
                stackId="a"
                fill="#C377DF"
                isAnimationActiveBoolean={false}
                isAnimationActive={false}
              >
                <LabelList dataKey="obj" position="middle" fill="#fff" />
              </Bar>
              <Bar
                dataKey="Critical"
                stackId="a"
                fill="#EF233C"
                isAnimationActiveBoolean={false}
                isAnimationActive={false}
              >
                <LabelList dataKey="cri" position="middle" fill="#fff" />
              </Bar>
              <Legend
                align="right"
                verticalAlign="top"
                height={36}
                wrapperStyle={{ paddingBottom: '40px' }}
              />
              {/* <Tooltip cursor={{ fill: 'transparent' }} /> */}
              <CartesianGrid horizontal={false} stroke="#ccc" strokeDasharray="2 4" />
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
        id="graph"
      >
        <ResponsiveContainer
          style={{ maxHeight: '500px', maxWidth: '400px', backgroundColor: 'red' }}
        >
          <BarChart
            ref={pillerGraph}
            data={statePillarStats}
            layout="vertical"
            isAnimationActive={false}
            margin={{ top: 50, right: 50, left: 30, bottom: 50 }}
          >
            <XAxis
              tick={{ fill: '#201F1F' }}
              interval={0}
              type="number"
              label={{
                value: 'Trend Percentage',
                angle: 0,
                position: 'bottom',
                fill: '#201F1F',
                fontSize: 40,
              }}
              style={{ fontSize: '25px' }}
            />
            <YAxis
              tick={{ fill: '#201F1F' }}
              label={{
                value: 'Pillars of State',
                angle: -90,
                position: 'left',
                padding: { top: 100 },
                fill: '#201F1F',
                fontSize: 40,
              }}
              type="category"
              width={150}
              padding={{ left: 20 }}
              dataKey="name"
              style={{ fontSize: '30px' }}
            />
            <Bar
              dataKey="Positive"
              stackId="a"
              fill="#1EA476"
              isAnimationActiveBoolean={false}
              isAnimationActive={false}
            >
              <LabelList dataKey="Positive" position="middle" fill="#fff" />
            </Bar>
            <Bar
              dataKey="Negative"
              stackId="a"
              fill="#EC4040"
              isAnimationActiveBoolean={false}
              isAnimationActive={false}
            >
              <LabelList dataKey="Negative" position="middle" fill="#fff" />
            </Bar>
            <Bar
              dataKey="Balanced"
              stackId="a"
              fill="#0091BF"
              isAnimationActiveBoolean={false}
              isAnimationActive={false}
            >
              <LabelList dataKey="Balanced" position="middle" fill="#fff" />
            </Bar>
            <Bar
              dataKey="Objective"
              stackId="a"
              fill="#C377DF"
              isAnimationActiveBoolean={false}
              isAnimationActive={false}
            >
              <LabelList dataKey="Objective" position="middle" fill="#fff" />
            </Bar>
            <Bar
              dataKey="Critical"
              stackId="a"
              fill="#EF233C"
              isAnimationActiveBoolean={false}
              isAnimationActive={false}
            >
              <LabelList dataKey="Critical" position="middle" fill="#fff" />
            </Bar>
            <Tooltip cursor={{ fill: 'transparent' }} />
            <Legend
              align="right"
              verticalAlign="top"
              height={50}
              wrapperStyle={{ fontSize: '30px', marginBottom: '40px' }}
            />
            <CartesianGrid horizontal={false} stroke="#ccc" strokeDasharray="2 4" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </>
  );
};

export default StatePillarGraph;
