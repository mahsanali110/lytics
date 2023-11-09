import React, { useState, useEffect, useRef } from 'react';
import {
  Drawer,
  //   Button,
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
import './AdvanceSearchDrawer.scss';
import moment from 'moment';
import { filterJobSources } from 'constants/index';
import { DownCircleOutlined, UpCircleOutlined } from '@ant-design/icons';
import _ from 'lodash';
import jobfilters from 'modules/jobfilters/actions';

import { MultiSelect, SingleSelect, Button } from 'V3/components/Common';
import { DeleteSVG, AddSVG } from 'assets/icons/V3';
import EntityData from 'HOCs/EntityData';

const SearchDrawer = ({
  getDataFromChild,
  source: contentSource,
  drawerModel,
  setDrawerModel,
  poolType,
  setPoolType,
  handleRemovePreset,
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

  const [currentPresetValue, setCurrentPresetValue] = useState(undefined);
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
    if (!defaultFilterId) {
      setCurrentPresetValue(() => undefined);
      return;
    }
    if (presets.length) {
      const indexOfPresest = presets.findIndex(preset => preset._id === defaultFilterId);
      if (indexOfPresest >= 0) setCurrentPresetValue(() => indexOfPresest + 1);
    }
  }, [defaultFilterId]);

  useEffect(() => {
    if (!appliedPresetValue.appliedPreset) {
      setData(appliedPresetValue);
      checkDate(appliedPresetValue.start_date_Status);
      setDefaultFilterId('');
    }
  }, [appliedPresetValue]);

  const handleDataChange = (value, path) => {
    setDefaultFilterId(null);
    const updatedData = { ...data, appliedPreset: '' };
    _.set(updatedData, path, value);
    setData(prev => updatedData);
  };

  const onClose = () => {
    setDrawerModel(false);
    setVisible(false);
  };
  const contentOptions = [
    {
      id: 0,
      value: 'All',
      title: 'All',
    },
    {
      id: 1,
      value: 'Tv',
      title: 'TV',
    },
    {
      id: 2,
      value: 'Online',
      title: 'Online',
    },
    {
      id: 3,
      value: 'Print',
      title: 'Print',
    },
    {
      id: 4,
      value: 'Blog',
      title: 'Web',
    },
    {
      id: 5,
      value: 'Social',
      title: 'Social',
    },
    {
      id: 6,
      value: 'Ticker',
      title: 'Ticker',
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

  const onRemovePreset = () => {
    handleRemovePreset();
    setCurrentPresetValue(() => undefined);
  };

  return (
    <div className="AdvanceSearchDrawer">
      <Drawer
        className="advance-search-drawer"
        placement={placement}
        closable={true}
        width={'25%'}
        onClose={onClose}
        maskClosable={true}
        visible={drawerModel}
        title="Advance Search"
        mask={true}
        maskStyle={{
          opacity: '1',
        }}
        footer={<Footer clearData={clearData} applyFilter={applyFilter} />}
      >
        {' '}
        <div className="pool-form mb-20">
          <div>
            <label className="fs-md fw-600 ff-roboto py-5 inline-block text-white">
              Search From
            </label>
          </div>
          <Radio.Group onChange={e => handlePool(e.target.value)} value={poolType}>
            <Radio value={1} className="v3-radio">
              <label className="fs-md fw-400 ff-roboto py-5 inline-block text-white">
                Company Data Pool
              </label>
            </Radio>
            <Radio value={2} className="v3-radio">
              <label className="fs-md fw-400 ff-roboto py-5 inline-block text-white">
                Lytics Data Pool
              </label>
            </Radio>
          </Radio.Group>
        </div>
        <div className="">
          <EntityData onChange={handleDataChange} source={data}>
            <MultiSelect
              className="mb-20"
              options={contentOptions}
              path="source"
              maxTagCount="responsive"
              label="Content Source"
              placeholder="Select Source"
            />

            <MultiSelect
              className="mb-20"
              path="channel"
              maxTagCount="responsive"
              label="Channel"
              placeholder="Select Channel"
              options={[
                { value: 'All', title: 'All' },
                ...dbchannels
                  .map(({ name }) => ({ value: name, title: name }))
                  .sort(compareFirstNames),
              ]}
            />

            <MultiSelect
              className="mb-20"
              path="programType"
              maxTagCount="responsive"
              label="ProgramType"
              placeholder="Select Program Type"
              options={programArr?.map(({ name }) => ({ value: name, title: name }))}
            />

            <MultiSelect
              className="mb-20"
              path="hosts"
              maxTagCount="responsive"
              label="Host"
              placeholder="Select Host"
              options={hosts
                ?.map(({ name }) => ({ value: name, title: name }))
                .sort(compareFirstNames)}
            />

            <MultiSelect
              className="mb-20"
              path="guests"
              maxTagCount="responsive"
              label="Guest"
              placeholder="Select Guest"
              options={guests
                ?.map(({ name }) => ({ value: name, title: name }))
                .sort(compareFirstNames)}
            />
          </EntityData>
        </div>
        <label className="fs-md fw-600 ff-roboto py-5 inline-block text-white">Date</label>
        <div className="date-section mb-20">
          {givenDates?.map((date, index) => {
            return (
              <div>
                <Button
                  varient={'transparent'}
                  className={`filter-date-button ${currentDateIndex === index && 'bg-active'}`}
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
              </div>
            );
          })}
        </div>
        <div className="preset-section">
          <span className="fs-md fw-600">Search Presets</span>
          {/* <Button className={`fs-sm`} varient={'transparent'}>
            <span className="center-content gap-5">
              <AddSVG />
              <span>Add New</span>
            </span>
          </Button> */}
          <div className="dropdown-wrapper">
            <div className="dropdown">
              <SingleSelect
                value={currentPresetValue}
                placeholder={'Select Preset'}
                options={presets.map((preset, index) => ({
                  value: index + 1, // 0 is falsy vlaue for input fields
                  title: preset?.presist[0],
                }))}
                onChange={value => {
                  const indexedValue = value - 1; // 0 is falsy vlaue for input fields
                  presetOnClick(indexedValue, presets[indexedValue]._id);
                  setPresetClicked(1);
                  setCurrentPresetValue(value);
                }}
                className="bg-black"
              />
            </div>
            <DeleteSVG onClick={onRemovePreset} className="cursor-pointer" />
          </div>
        </div>
      </Drawer>
    </div>
  );
};

function Footer({ clearData, applyFilter }) {
  return (
    <div className="Footer">
      <Button onClick={clearData} varient={'secondary'}>
        Reset
      </Button>
      <Button onClick={applyFilter}>Apply Filters</Button>
    </div>
  );
}

export default SearchDrawer;
