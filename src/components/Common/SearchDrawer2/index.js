import React, { useState, useEffect, useRef } from 'react';
import {
  Drawer,
  Button,
  Row,
  Col,
  Form,
  Input,
  Radio,
  message as antMessage,
  DatePicker,
  Checkbox,
} from 'antd';
import { Select } from 'components/Common';
import { useSelector, useDispatch } from 'react-redux';
import { getUserId, SelectAll } from 'modules/common/utils';
import channelsActions from 'modules/channels/actions';
import programTypes from 'modules/programTypes/actions';
import hostsActions from 'modules/hosts/actions';
import guestsActions from 'modules/guests/actions';
import filterActions from 'modules/filter/actions';
import associationsActions from 'modules/associations/actions';
import usersActions from 'modules/users/actions';
import './SearchDrawer2.scss';
import moment from 'moment';
import { filterJobSources } from 'constants/index';
import { DownCircleOutlined, UpCircleOutlined } from '@ant-design/icons';
import _ from 'lodash';
import jobfilters from 'modules/jobfilters/actions';

const SearchDrawer = ({
  getDataFromChild,
  source: contentSource,
  drawerModel,
  setDrawerModel,
  poolType,
  setPoolType,
}) => {
  const dispatch = useDispatch();
  const { RangePicker } = DatePicker;
  const d = new Date();
  const userId = getUserId();
  const format = 'YYYY-MM-DDTHH:mm:ss';
  const [currentDateIndex, setCurrentDateIndex] = useState(0);
  const [PresetClicked, setPresetClicked] = useState(0);
  const [SaveCheck, setSaveCheck] = useState(false);
  const [defaultFilterId, setDefaultFilterId] = useState('');
  const [currentField, setCurrentField] = useState(0);
  const { channels: dbchannels } = useSelector(state => state.channelsReducer);
  const { programTypes: programArr } = useSelector(state => state.programTypesReducer);
  const [presetName, setPresetName] = useState('');
  const { hosts } = useSelector(state => state.hostsReducer);
  const { guests } = useSelector(state => state.guestsReducer);
  const { presets, appliedPresetValue, defaultPreset } = useSelector(state => state.filterReducer);
  const InitialState = {
    tags: [],
    source: filterJobSources,
    channel: ['All', ...dbchannels.map(({ name }) => name)],
    programType: [],
    hosts: [],
    guests: [],
    limit: 30,
    jobState: ['Ready for QC', 'Ready for Marking', 'Completed'],
    association: null,
    searchText: appliedPresetValue.searchText,
    escalation: [],
    start_date_Status: 'Today',
    start_date: moment(d).format(format),
    end_date: moment(d).format(format),
    programFromTime: moment(d).subtract(1, 'h').subtract(moment().minutes(), 'm').format('HH:mm'),
    programToTime: moment(d).format('HH:mm'),
    appliedPreset: '',
    isUserPool: true,
  };
  const [data, setData] = useState(InitialState);
  const [subFilter, setSubFilter] = useState(false);
  const [dateCheck, setDateCheck] = useState(false);
  const [dateDisable, setDateDisable] = useState(false);
  const chanel = useRef();
  chanel.current = true;
  const [placement, setPlacement] = useState('right');
  const [visible, setVisible] = useState(true);
  const dateRef = useRef();
  useEffect(async () => {
    dispatch(channelsActions.getChannels.request());
    dispatch(programTypes.getProgramTypes.request());
    dispatch(hostsActions.getHosts.request());
    dispatch(guestsActions.getGuests.request());
    dispatch(filterActions.getAllPreset.request(userId));
    dispatch(associationsActions.getAssociations.request());
    dispatch(usersActions.getUsers.request({ role: 'Client' }));
  }, []);

  useEffect(() => {
    console.log({ currentDateIndex });
  }, [currentDateIndex]);

  /* handles byDefault preset setting */
  useEffect(() => {
    if (!SaveCheck) {
      if (defaultPreset) {
        dispatch(jobfilters.addcurrentFilterData.request(defaultPreset));
        setDefaultFilterId(defaultPreset._id);
        checkDateStatus(defaultPreset);
        setDateDisable(false);
      } else {
        setData(InitialState);
      }
    }
  }, [presets, dbchannels, SaveCheck]);

  useEffect(() => {
    if (data.appliedPreset && PresetClicked === 0) getDataFromChild(data);
  }, [defaultPreset, data.appliedPreset]);

  useEffect(() => {
    if (!appliedPresetValue.appliedPreset) {
      setData(appliedPresetValue);
      checkDate(appliedPresetValue.start_date_Status);
      setDefaultFilterId('');
    }
  }, [appliedPresetValue]);

  const onClose = () => {
    setDrawerModel(false);
    setVisible(false);
  };
  const Content = [
    {
      id: 0,
      name: 'All',
    },
    {
      id: 1,
      name: 'Tv',
    },
    {
      id: 2,
      name: 'Online',
    },
    {
      id: 3,
      name: 'Print',
    },
    {
      id: 4,
      name: 'Blog',
    },
    {
      id: 5,
      name: 'Social',
    },
    {
      id: 6,
      name: 'Ticker',
    },
  ];
  const givenDates = [
    {
      id: 0,
      name: 'Today',
      value: '',
      start_date: moment(d).format(format),
      end_date: moment(d).format(format),
    },
    {
      id: 1,
      name: 'Yesterday',
      value: '',
      start_date: moment(d).subtract(1, 'days').format(format),
      end_date: moment(d).subtract(1, 'days').format(format),
    },
    {
      id: 2,
      name: 'Last 7 Days',
      value: '',
      start_date: moment(d).subtract(7, 'days').format(format),
      end_date: moment(d).format(format),
    },
    {
      id: 3,
      name: 'This Month',
      value: '',
      start_date: `${d.getFullYear()}-${moment(d).format('MM')}-1`,
      end_date: moment(d).format(format),
    },
    // {
    //   id: 4,
    //   name: 'This Quater',
    //   value: '',
    //   start_date: `${d.getFullYear()}-${moment(d).format('MM') - 2}-1`,
    //   end_date: moment(d).format(format),
    // },
    // {
    //   id: 5,
    //   name: 'This Year',
    //   value: '',
    //   start_date: `1/1/${new Date().getFullYear()}`,
    //   end_date: moment(d).format(format),
    // },
  ];
  const clearData = () => {
    setPoolType(1);
    setCurrentDateIndex('');
    setData({
      ...data,
      source: [],
      channel: [],
      programType: [],
      hosts: [],
      guests: [],
      association: [],
      escalation: [],
      start_date: moment(d).subtract(1, 'days').format(format),
      end_date: moment(d).format(format),
    });
  };

  useEffect(() => {
    programArr.unshift({ name: 'All' });
  }, [dbchannels]);
  const handleData = ({ value }) => {
    if (data.source?.includes(value)) {
      setData(prev => ({
        ...prev,
        source: data.source.filter(obj => obj !== value),
        appliedPreset: '',
      }));
    } else {
      setData(prev => ({ ...prev, source: [...data.source, value], appliedPreset: '' }));
    }
  };
  const applyFilter = () => {
    if (dateCheck) return antMessage.error('Date difference should not be more than 6 months');

    const diffTime = Math.abs(new Date(data.end_date) - new Date(data.start_date));
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const { tags, ...rest } = data;
    dispatch(filterActions.defaultPreset.request(rest));
    getDataFromChild(rest);
  };
  const onSearch1 = val => {};

  const saveAsPreset = () => {
    if (presets.length < 4 && presetName) {
      setData({
        ...data,
        presetName: presetName,
        appliedPreset: presetName,
        userId: userId,
      });
      dispatch(
        filterActions.savePreset.request({
          ...data,
          start_date: data.start_date_Status ?? 'Today',
          presist: presetName,
          byDefaultSave: false,
          userId: userId,
          searchFrom: poolType,
        })
      );
      antMessage.success('Preset Saved Successfully!', 2);
      // setPresetName('');
      // setData({
      //   ...data,
      //   source: filterJobSources,
      //   channel: [],
      //   programType: [],
      //   hosts: [],
      //   guests: [],
      //   association: [],
      //   escalation: [],
      //   start_date: moment(d).subtract(1, 'days').format(format),
      //   end_date: moment(d).format(format),
      // });
      // setCurrentDateIndex(0);
    }
    setSaveCheck(true);
  };
  const saveAsDefault = () => {
    if (defaultFilterId) {
      dispatch(
        filterActions.updatePreset.request({
          objectId: defaultFilterId,
          userId: userId,
          data: {
            userId: userId,
            defaultId: defaultFilterId,
            byDefaultSave: true,
            remainingIds: presets.map(p => p._id).filter(id => id !== defaultFilterId),
          },
        })
      );
      antMessage.success('Preset Set As Default!', 2);
    } else {
      alert('Please Select the Preset');
    }
  };
  const presetOnClick = (value, id) => {
    setDefaultFilterId(id);
    setPoolType(presets[value]?.searchFrom);
    setData({ ...data, appliedPreset: presets[value]?.presist[0] ?? `preset${value + 1}` });
    checkDateStatus(presets[value]);
  };

  function checkDate(status) {
    if (dateDisable) return;
    switch (status) {
      case 'Today':
        setData(prev => ({
          ...prev,
          start_date: moment(d).format(format),
          end_date: moment(d).format(format),
        }));
        setCurrentDateIndex(0);
        break;
      case 'Yesterday':
        setData(prev => ({
          ...prev,
          start_date: moment(d).subtract(1, 'days').format(format),
          end_date: moment(d).format(format),
        }));
        setCurrentDateIndex(1);
        break;

      case 'Last 7 Days':
        setData(prev => ({
          ...prev,
          start_date: moment(d).subtract(7, 'days').format(format),
          end_date: moment(d).format(format),
        }));
        setCurrentDateIndex(2);
        break;
      case 'This Month':
        setData(prev => ({
          ...prev,
          start_date: `${d.getFullYear()}-${moment(d).format('MM')}-1`,
          end_date: moment(d).format(format),
        }));
        setCurrentDateIndex(3);
        break;
      case 'This Quater':
        setData(prev => ({
          ...prev,
          start_date: moment(d).subtract(moment().hours(), 'h').format(),
          end_date: moment(d).format(format),
        }));
        setCurrentDateIndex(4);
        break;
      case 'This Year':
        setData(prev => ({
          ...prev,
          start_date: moment(d).subtract(moment().hours(), 'h').format(),
          end_date: moment(d).format(format),
        }));
        setCurrentDateIndex(5);
        break;
      default:
    }
  }
  const checkDateStatus = input => {
    switch (input?.start_date) {
      case 'Today':
        setData({
          ...input,
          appliedPreset: input?.presist[0],
          start_date: moment(d).subtract(moment().hours(), 'h').format(),
          end_date: moment(d).format(format),
        });
        setCurrentDateIndex(0);
        break;
      case 'Yesterday':
        setData({
          ...input,
          appliedPreset: input?.presist[0],
          start_date: moment(d).subtract(1, 'days').format(format),
          end_date: moment(d).subtract(1, 'days').format(format),
        });
        setCurrentDateIndex(1);
        break;

      case 'Last 7 Days':
        setData({
          ...input,
          appliedPreset: input?.presist[0],
          start_date: moment(d).subtract(7, 'days').format(format),
          end_date: moment(d).format(format),
        });
        setCurrentDateIndex(2);
        break;
      case 'This Month':
        setData({
          ...input,
          appliedPreset: input?.presist[0],
          start_date: `${d.getFullYear()}-${moment(d).format('MM')}-1`,
          end_date: moment(d).format(format),
        });
        setCurrentDateIndex(3);
        break;
      case 'This Quater':
        setData({
          ...input,
          appliedPreset: input?.presist[0],
          start_date: `${d.getFullYear()}-${moment(d).format('MM') - 2}-1`,
          end_date: moment(d).format(format),
        });
        setCurrentDateIndex(4);
        break;
      case 'This Year':
        setData({
          ...input,
          appliedPreset: input?.presist[0],
          start_date: `1/1/${new Date().getFullYear()}`,
          end_date: moment(d).format(format),
        });
        setCurrentDateIndex(5);
        break;
      default:
    }
  };
  function compareFirstNames(a, b) {
    if (a.value < b.value) {
      return -1;
    }
    if (a.value > b.value) {
      return 1;
    }
    return 0;
  }
  const handleRangeChange = dateStrings => {
    const startdate = moment(dateStrings[0]).format(format);
    const enddate = moment(dateStrings[1]).format(format);
    const startdate1 = moment(dateStrings[0]);
    const enddate1 = moment(dateStrings[1]);
    let timeDiff = enddate1.diff(startdate1, 'month');

    if (timeDiff > 6) return setDateCheck(true);

    setData({ ...data, start_date: startdate, end_date: enddate, appliedPreset: '' });
    setDateCheck(false);
    setCurrentDateIndex(null);
    setDefaultFilterId(null);
  };
  const disabledDate = current => {
    return current > moment();
  };

  const handlePool = value => {
    setPoolType(value);
    setData({ ...data, appliedPreset: '', isUserPool: value === 1 ? true : false });
  };

  return (
    <div>
      <Drawer
        className="search-drawer2"
        placement={placement}
        width={'25%'}
        closable={true}
        onClose={onClose}
        maskClosable={true}
        visible={drawerModel}
      >
        <Form>
          <Row className="heading_row">
            <Col className="filter_heading" span={12}>
              Filters
            </Col>
            <Col
              span={12}
              className="header-btn align_center"
              style={{ alignItems: 'baseline' }}
            ></Col>
          </Row>
          <br />

          <Row></Row>
          <div className="p-10 bg-1C2542">
            <Row className="content_heading ">Presets</Row>

            <Row className="mt-10 justify-content-between">
              <Col span={12}>
                <div className="bg-222D4F w-99">
                  {presets?.length > 0 && presets[0]?.presist[0] ? (
                    <Button
                      className={
                        defaultFilterId === presets[0]._id
                          ? 'w-100 text-align-left bg-green border-none h-100 color-white let-space-4 hover ff-roboto'
                          : 'w-100 text-align-left bg-preset border-none h-100 color-white let-space-4 hover ff-roboto'
                      }
                      onClick={() => {
                        presetOnClick(0, presets[0]._id);
                        setPresetClicked(1);
                      }}
                    >
                      {presets[0]?.presist[0]?.length > 0 ? presets[0]?.presist[0] : `Preset ${1}`}
                    </Button>
                  ) : (
                    <Input
                      value={currentField === 1 ? presetName : ''}
                      className=""
                      bordered={false}
                      maxLength={20}
                      type="text"
                      placeholder="Name Preset"
                      onChange={e => {
                        setCurrentField(1);
                        setPresetName(e.target.value);
                      }}
                    />
                  )}
                </div>
              </Col>
              <Col span={12}>
                <div className="bg-222D4F w-99 ml-2">
                  {presets?.length > 1 && presets[1]?.presist[0] ? (
                    <Button
                      className={
                        defaultFilterId === presets[1]._id
                          ? 'w-100 text-align-left bg-green border-none h-100 color-white let-space-4 ff-roboto'
                          : 'w-100 text-align-left bg-preset border-none h-100 color-white let-space-4 ff-roboto'
                      }
                      onClick={() => {
                        presetOnClick(1, presets[1]._id);
                        setPresetClicked(1);
                      }}
                    >
                      {presets[1]?.presist[0]?.length > 0 ? presets[1]?.presist[0] : `Preset ${2}`}
                    </Button>
                  ) : (
                    <Input
                      value={currentField === 2 ? presetName : ''}
                      className=""
                      maxLength={20}
                      bordered={false}
                      type="text"
                      placeholder="Name Preset"
                      onChange={e => {
                        setCurrentField(2);
                        setPresetName(e.target.value);
                      }}
                    />
                  )}
                </div>
              </Col>
            </Row>
            <Row className="mt-3 justify-content-between">
              <Col span={12}>
                <div className="bg-222D4F w-99">
                  {presets?.length > 2 && presets[2]?.presist[0] ? (
                    <Button
                      className={
                        defaultFilterId === presets[2]._id
                          ? 'w-100 text-align-left bg-green border-none h-100 color-white let-space-4 ff-roboto'
                          : 'w-100 text-align-left bg-preset border-none h-100 color-white let-space-4 ff-roboto'
                      }
                      onClick={() => {
                        presetOnClick(2, presets[2]._id);
                        setPresetClicked(1);
                      }}
                    >
                      {presets[2]?.presist[0].length > 0 ? presets[2]?.presist[0] : `Preset ${3}`}
                    </Button>
                  ) : (
                    <Input
                      value={currentField === 3 ? presetName : ''}
                      className=""
                      maxLength={20}
                      bordered={false}
                      type="text"
                      placeholder="Name Preset"
                      onChange={e => {
                        setCurrentField(3);
                        setPresetName(e.target.value);
                      }}
                    />
                  )}
                </div>
              </Col>
              <Col span={12}>
                <div className="bg-222D4F w-99 ml-2">
                  {presets?.length > 3 && presets[3]?.presist[0] ? (
                    <Button
                      className={
                        defaultFilterId === presets[3]._id
                          ? 'w-100 text-align-left bg-green border-none h-100 color-white let-space-4 ff-roboto'
                          : 'w-100 text-align-left bg-preset border-none h-100 color-white let-space-4 ff-roboto'
                      }
                      onClick={() => {
                        presetOnClick(3, presets[3]._id);
                        setPresetClicked(1);
                      }}
                    >
                      {presets[3]?.presist[0].length > 0 ? presets[3]?.presist[0] : `Preset ${4}`}
                    </Button>
                  ) : (
                    <Input
                      value={currentField === 4 ? presetName : ''}
                      className=""
                      bordered={false}
                      type="text"
                      maxLength={20}
                      placeholder="Name Preset"
                      onChange={e => {
                        setCurrentField(4);
                        setPresetName(e.target.value);
                      }}
                    />
                  )}
                </div>
              </Col>
            </Row>
            <Row className="mt-15 mb-15 justify-content-center">
              <Col>
                <button
                  onClick={() => {
                    saveAsPreset();
                    setPresetClicked(1);
                  }}
                  className="pointer-cursor border-none br-5 fs-11 font-normal p-5 color-white mr-4 bg-455177 let-space-4 shadow ff-roboto"
                >
                  Save As Preset
                </button>
              </Col>
              <Col>
                <button
                  onClick={() => {
                    saveAsDefault();
                  }}
                  className="pointer-cursor border-none br-5 fs-11 font-normal p-5 color-white bg-455177 let-space-4 shadow ff-roboto"
                >
                  Set As Default
                </button>
              </Col>
            </Row>
          </div>
          <br />

          {/* Search Pool */}
          <Row className="pool_row">
            <Col span={5}>Search From</Col>
            <Col span={19}>
              <Radio.Group onChange={e => handlePool(e.target.value)} value={poolType}>
                <Radio value={1} className="radio">
                  Company Data Pool
                </Radio>
                <Radio value={2} className="radio">
                  Lytics Data Pool
                </Radio>
              </Radio.Group>
            </Col>
          </Row>
          <br />
          {/* Search Pool */}

          <Row className="content_heading">Content Source</Row>
          <br />

          <Row className="d-flex-justify-between" style={{ rowGap: '10px' }}>
            {Content.map((cont, index) => {
              return (
                <>
                  {contentSource !== '' && cont.name.startsWith(contentSource) ? (
                    <Col
                      span={cont.name === 'All' ? '3' : '4'}
                      className="d-flex-justify-center"
                      key={index}
                    >
                      <Button
                        className={
                          cont.name.startsWith(contentSource)
                            ? 'btn-style-orng border-style '
                            : 'btn-style border-style btn-bg'
                        }
                        onClick={() => {
                          contentSource === '' || contentSource === null;
                          (contentSource === '' || contentSource === null) &&
                            setData(prev => ({ ...prev, appliedPreset: '', source: cont.name }));
                          setDefaultFilterId(null);
                        }}
                      >
                        {cont.name === 'Blog' ? 'Web' : cont.name}
                      </Button>
                    </Col>
                  ) : contentSource === '' ? (
                    <Col
                      key={index}
                      span={cont.name === 'All' ? '3' : '4'}
                      className="d-flex-justify-center"
                    >
                      <Button
                        className={
                          data?.source?.includes(cont.name) &&
                          cont.name === 'All' &&
                          data?.source?.length === Content.length
                            ? 'btn-style-orng border-style border-none'
                            : data?.source?.includes(cont.name) && cont.name !== 'All'
                            ? 'btn-style-orng border-style border-none'
                            : 'btn-style border-style'
                        }
                        onClick={() => {
                          setDefaultFilterId(null);
                          cont.name === 'All'
                            ? setData({
                                ...data,
                                appliedPreset: '',
                                source:
                                  data?.source?.length === Content.length
                                    ? []
                                    : Content.map(content => content.name),
                              })
                            : handleData({ value: cont.name });
                        }}
                      >
                        {cont.name === 'Tv' ? 'TV' : cont.name === 'Blog' ? 'Web' : cont.name}
                      </Button>
                    </Col>
                  ) : (
                    ''
                  )}
                </>
              );
            })}
          </Row>
          <br />
          <Row className="chanels_heading">Channel</Row>
          <br />
          <Row>
            <Select
              mode="multiple"
              showSearch
              allowClear
              showArrow={true}
              maxTagCount={1}
              placeholder="Select channel"
              value={data.channel}
              options={[
                { value: 'All', title: 'All' },
                ...dbchannels
                  .map(({ name }) => ({ value: name, title: name }))
                  .sort(compareFirstNames),
              ]}
              onChange={value => {
                value.includes('All')
                  ? value.map(value => {
                      setData({
                        ...data,
                        appliedPreset: '',
                        channel: [value, ...dbchannels?.map(({ name }) => name)],
                      });
                    })
                  : setData({ ...data, appliedPreset: '', channel: value });
                setDefaultFilterId(null);
              }}
              onDeselect={value => {
                if (value === 'All') {
                  setData({ ...data, appliedPreset: '', channel: [] });
                } else {
                  setData({
                    ...data,
                    appliedPreset: '',
                    channel: [...data?.channel.filter(cl => cl !== value && cl !== 'All')],
                  });
                }
                setDefaultFilterId(null);
              }}
              style={{ width: '60%' }}
              getPopupContainer={trigger => trigger.parentNode}
            ></Select>
          </Row>
          <br />

          <Row className="date_heading">Date</Row>
          <Row className="mt-10">
            {givenDates?.map((date, index) => {
              return (
                <Button
                  className={
                    currentDateIndex === index ? 'selected-date-style-orng' : 'selected-date-style'
                  }
                  onClick={() => {
                    setCurrentDateIndex(index);
                    setDefaultFilterId(null);
                    setDateDisable(false);
                    setData(prev => ({
                      ...prev,
                      appliedPreset: '',
                      start_date_Status: date.name,
                      start_date: date.start_date,
                      end_date: date.end_date,
                    }));
                  }}
                >
                  {date.name}
                </Button>
              );
            })}
          </Row>
          {/* <Row className="mt-15">
            <Checkbox
              className="checkbox"
              autoFocus={false}
              checked={dateDisable}
              onChange={() => {
                setDateDisable(dateDisable != true ? true : false);
                setCurrentDateIndex(null);
              }}
            >
              Enable Date Range
            </Checkbox>

            <Col className="sub_heading" span={24}>
              Date Range
            </Col>
          </Row>
          <Row className="mt-15">
            <Col span={24}>
              <RangePicker
                ref={dateRef}
                style={{ margin: '0px 5px', backgroundColor: '#131c3a !important' }}
                onChange={handleRangeChange}
                disabledDate={disabledDate}
                disabled={dateDisable == true ? false : true}
                getPopupContainer={trigger => trigger.parentNode}
              ></RangePicker>
            </Col>
          </Row> */}

          {subFilter && (
            <>
              <Row className="program_heading mt-15">Program Type</Row>
              <br />
              <Row>
                <Select
                  mode="multiple"
                  showSearch
                  allowClear
                  showArrow={true}
                  maxTagCount={1}
                  // SelectAll={SelectAll}
                  placeholder="Select Program type"
                  value={data.programType}
                  options={programArr?.map(({ name }) => ({ value: name, title: name }))}
                  onChange={value => {
                    setDefaultFilterId(null);
                    value.includes('All')
                      ? value.map(value => {
                          setData({
                            ...data,
                            appliedPreset: '',
                            programType: [value, ...programArr?.map(({ name }) => name)],
                          });
                        })
                      : setData({ ...data, appliedPreset: '', programType: value });
                  }}
                  onDeselect={value => {
                    if (value === 'All') setData({ ...data, appliedPreset: '', programType: [] });
                  }}
                  style={{ width: '60%' }}
                  getPopupContainer={trigger => trigger.parentNode}
                ></Select>
              </Row>
              <br />
            </>
          )}

          {subFilter && (
            <>
              <Row className="mt-15">
                <Col className="sub_heading" span={12}>
                  Host
                </Col>
                <Col className="sub_heading" span={12}>
                  {' '}
                  Guest
                </Col>
              </Row>
              <Row className="mt-15">
                <Col span={12}>
                  {' '}
                  <Select
                    mode="multiple"
                    showSearch
                    allowClear
                    SelectAll={SelectAll}
                    showArrow={true}
                    maxTagCount={1}
                    placeholder="Select host"
                    value={data.hosts}
                    options={hosts
                      ?.map(({ name }) => ({ value: name, title: name }))
                      .sort(compareFirstNames)}
                    onChange={value => {
                      setDefaultFilterId(null);
                      value.includes('All')
                        ? value.map(value => {
                            setData({
                              ...data,
                              appliedPreset: '',
                              hosts: [value, ...hosts?.map(({ name }) => name)],
                            });
                          })
                        : setData({ ...data, appliedPreset: '', hosts: value });
                    }}
                    onDeselect={value => {
                      if (value === 'All') setData({ ...data, appliedPreset: '', hosts: [] });
                    }}
                    style={{ width: '90%' }}
                    getPopupContainer={trigger => trigger.parentNode}
                  ></Select>
                </Col>
                <Col span={12}>
                  {' '}
                  <Select
                    mode="multiple"
                    showSearch
                    allowClear
                    SelectAll={SelectAll}
                    showArrow={true}
                    maxTagCount={1}
                    placeholder="Select guest"
                    value={data.guests}
                    options={guests
                      ?.map(({ name }) => ({ value: name, title: name }))
                      .sort(compareFirstNames)}
                    getPopupContainer={trigger => trigger.parentNode}
                    onChange={value => {
                      setDefaultFilterId(null);

                      value.includes('All')
                        ? value.map(value => {
                            setData({
                              ...data,
                              appliedPreset: '',
                              guests: [value, ...guests?.map(({ name }) => name)],
                            });
                          })
                        : setData({ ...data, appliedPreset: '', guests: value });
                    }}
                    onDeselect={value => {
                      if (value === 'All') setData({ ...data, appliedPreset: '', guests: [] });
                    }}
                    onSearch={onSearch1}
                    style={{ width: '90%' }}
                  ></Select>
                  ,
                </Col>
              </Row>
            </>
          )}

          <Row className="justify-content-center mt-30">
            <Col span={24} className="display-flex justify-content-center">
              <Button
                className="border-none br-10 fs-11 font-normal p-5a color-white mr-4 clear-btn let-space-4 shadow w-15 ff-roboto"
                onClick={clearData}
              >
                Clear
              </Button>
              <Button
                className="border-none br-10 hover-color fs-11 font-normal p-5a color-white mr-4 ml-2 bg-455177 let-space-4 shadow bg-orange w-30 ff-roboto"
                onClick={applyFilter}
              >
                Apply Filters
              </Button>
            </Col>
          </Row>
          {!subFilter && (
            <Row className="justify-content-center mt-25">
              <div>
                <div className="color-white let-space-4 ff-roboto">View Advanced Filters</div>
                <div className="display-flex justify-content-center">
                  <DownCircleOutlined className="iconsAdvance" onClick={() => setSubFilter(true)} />
                </div>
              </div>
            </Row>
          )}
          {subFilter && (
            <Row className="justify-content-center mt-25">
              <div>
                <div className="display-flex justify-content-center">
                  <UpCircleOutlined className="iconsAdvance" onClick={() => setSubFilter(false)} />
                </div>
                <div className="color-white let-space-4 ff-roboto">Close Advanced Filters</div>
              </div>
            </Row>
          )}
        </Form>
      </Drawer>
    </div>
  );
};

export default SearchDrawer;
