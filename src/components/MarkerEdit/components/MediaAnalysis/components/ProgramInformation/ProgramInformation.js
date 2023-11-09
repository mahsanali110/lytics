import { Typography, Form, Space, message, TimePicker, Skeleton, Tooltip, Image, Spin } from 'antd';
import { ReloadOutlined } from '@ant-design/icons';
import { TOOLTIP_COLORS } from 'constants/options';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from 'lodash';
import { DEFAULT_SEGMENT } from 'constants/options';
import { Card, CardDetail, Button, Select, ProgramInfo } from 'components/Common';
import { markerEditActions } from 'modules/markerEdit/actions';
import { CHANNEL_LANGUAGE, CHANNEL_REGION } from 'constants/strings';
import { PRIORITY_COLORS } from 'constants/options';
import { USERS_BASE_URL } from 'constants/config/config.dev';
import useConfirm from 'hooks/useConfirm';
const { Text, Title } = Typography;
import './ProgramInformation.scss';
import { formatDate } from 'modules/common/utils';
import { useEffect, useState } from 'react';
import programNamesActions from 'modules/programNames/actions';
import programTypesActions from 'modules/programTypes/actions';
import guestsActions from 'modules/guests/actions';
import hostsActions from 'modules/hosts/actions';
import { SelectAll } from 'modules/common/utils';
import { liveClippingActions } from 'modules/LiveClipping/actions';
import { uploadPath } from 'constants/index';
import { networkError, errorCount, errorDelay } from 'constants/config/errorLoader';

const ProgramInformation = ({ programInfo, setProgramInfo, to }) => {
  const guestsValues = programInfo?.guests.map(guest => guest?.name) ?? [];
  const state = useSelector(state => state);
  const { channelName } = useSelector(state => state.commonReducer);
  const programTypes = useSelector(state => state.programTypesReducer.programTypes);
  const { programTypesError } = useSelector(state => state.programTypesReducer);
  const { guests, guestError } = useSelector(state => state.guestsReducer);
  const { channels } = useSelector(state => state.channelsReducer);
  const { programNames, programNamesError } = useSelector(state => state.programNamesReducer);
  const { hosts, hostError } = useSelector(state => state.hostsReducer);
  const dispatch = useDispatch();
  const { confirm } = useConfirm();
  const [programList, setProgramList] = useState([]);
  const [programTypeCount, setProgramTypeCount] = useState(1);
  const [programNameCount, setProgramNameCount] = useState(1);
  const [guestCount, setGuestCount] = useState(1);
  const [hostCount, setHostCount] = useState(1);

  const { updateJobField } = markerEditActions;

  const handleJobChange = (field, value, fullField) => {
    dispatch(updateJobField({ field, value, fullField }));
  };
  const fetchData = () => {
    dispatch(programNamesActions.getProgramNames.request());
    dispatch(programTypesActions.getProgramTypes.request());
    dispatch(guestsActions.getGuests.request());
    dispatch(hostsActions.getHosts.request());
  };
  const refreshData = () => {
    dispatch(programNamesActions.getProgramNames.request());
    dispatch(programTypesActions.getProgramTypes.request());
    dispatch(guestsActions.getGuests.request());
    dispatch(hostsActions.getHosts.request());
    message.success('Refreshed', 1);
  };
  useEffect(() => {
    if (programTypesError || programTypesError === networkError) {
      setProgramTypeCount(prevCount => prevCount + 1);
      if (programTypeCount <= errorCount) {
        setTimeout(() => {
          dispatch(programTypesActions.getProgramTypes.request());
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
    if (programNamesError || programNamesError === networkError) {
      setProgramNameCount(prevCount => prevCount + 1);
      if (programNameCount <= errorCount) {
        setTimeout(() => {
          dispatch(programNamesActions.getProgramNames.request());
        }, errorDelay);
      } else if (programNamesError === networkError) {
        alert(`${programNamesError}, Please refresh!`);
        window.location.reload();
      } else if (programNamesError !== networkError) {
        alert(`${programNamesError}, Please refresh!`);
        window.location.reload();
      }
    }
  }, [programNamesError]);
  useEffect(() => {
    if (guestError || guestError === networkError) {
      setGuestCount(prevCount => prevCount + 1);
      if (guestCount <= errorCount) {
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
    if (hostError || hostError === networkError) {
      setHostCount(prevCount => prevCount + 1);
      if (hostCount <= errorCount) {
        setTimeout(() => {
          dispatch(hostsActions.getHosts.request());
        }, errorDelay);
      } else if (hostError === networkError) {
        alert(`${hostError}, Please refresh!`);
        window.location.reload();
      } else if (hostError !== networkError) {
        alert(`${hostError}, Please refresh!`);
        window.location.reload();
      }
    }
  }, [hostError]);
  const refresh = () => {
    fetchData();
    message.success('Refreshed', 2);
  };
  useEffect(() => {
    fetchData();
  }, []);
  // useEffect(() => {
  //   if (!channelInfo.channelName) return;
  //   let list = channels.filter(
  //     ({ name, actusId }) => channelInfo.channelName == name || channelInfo.channelName == actusId
  //   );
  //   list.length > 0
  //     ? setProgramInfo(prev => ({ ...prev, language: list[0].language, region: list[0].region }))
  //     : null;
  // }, [channelInfo.channelName]);
  useEffect(() => {
    let list = programNames.filter(
      ({ type, channel }) =>
        type?.toLowerCase() == programInfo?.programType?.toLowerCase() &&
        channel == programInfo.channel
    );
    setProgramList(list);
  }, [programInfo?.programType]);
  // useEffect(() => {
  //   if (!programInfo.channel) return;
  //   let currentChannelPro = programNames?.filter(
  //     ({ channel, fromTime }) => programInfo.channel == channel && fromTime
  //   );
  //   let program = currentChannelPro?.filter(
  //     ({ fromTime, toTime }) =>
  //       moment(moment(fromTime).format('HH:mm A'), 'h:mma').format('x') >=
  //         programInfo.fromTime.format('x') &&
  //       moment(moment(toTime).format('HH:mm A'), 'h:mma').format('x') <=
  //         programInfo.toTime.format('x')
  //   );
  //   let programTitle = program[0]?.title ?? '';
  //   let programType = program[0]?.type ?? '';
  //   setProgramInfo(prev => ({ ...prev, programType, programName: programTitle }));
  // }, [programInfo.fromTime, programInfo.toTime, channelInfo.channelName]);
  // useEffect(() => {
  //   let list = programNames.filter(({ title }) => title == programInfo.programName);
  //   list.length > 0
  //     ? setProgramInfo({ ...programInfo, anchor: list[0].host })
  //     : setProgramInfo({ ...programInfo, anchor: [] });
  // }, [programInfo.programName]);
  // useEffect(() => {
  //   setProgramInfo({ ...programInfo, programId: uuidv4() });
  // }, []);
  const handleResetProgram = async () => {
    let ifConfirm = await confirm(
      'Unsaved Segments will be lost - Are you sure you want to start a new Program?'
    );
    if (ifConfirm) {
      setProgramInfo({
        programId: uuidv4(),
        programName: '',
        programType: '',
        anchor: [],
        priority: 'MEDIUM',
        guest: [],
        language: 'URDU',
        region: 'National',
        fromTime: moment(`${moment().format('HH')}:00`, 'HH:mm'),
        toTime: moment(`${moment().add(1, 'hour').format('HH')}:00`, 'HH:mm'),
      });
      dispatch(
        markerEditActions.updateByField({
          field: 'segments',
          value: [cloneDeep(DEFAULT_SEGMENT)],
        })
      );
      setDisableField(false);
      dispatch(liveClippingActions.updateStartPro(true));
    }
  };
  const handleFormSubmit = async () => {
    if (
      // programInfo.anchor.length > 0 &&
      programInfo.programName != '' &&
      programInfo.priority != '' &&
      programInfo.language != '' &&
      programInfo.region != ''
      // programInfo.guest.length > 0
    ) {
      let result = await confirm(
        'Once a program is saved you can’t edit its fields. Are you sure you want to start the program segmentation?'
      );
      setDisableField(result);
    } else {
      message.error('Fill all the required (*) fields');
    }
  };
  const content = (
    <>
      <CardDetail>
        <div className="display-flex align-center">
          <div className="icon-wrapper">
            <Image
              src={`${USERS_BASE_URL}/${uploadPath}/${programInfo?.channelLogoPath}`}
              width={48}
              height={48}
              alt="logo"
              preview={false}
              // fallback="placeholder.png"
            />
          </div>
          <div className="card-left-wrapper">
            <Text style={{ color: '#EF233C' }} className="text-primary large-font-size">
              {programInfo.channel == '' ? 'Channel Name' : programInfo.channel}
            </Text>
          </div>
        </div>
        <div className="card-right-wrapper">
          {/* <Tooltip placement="top" color={TOOLTIP_COLORS[0]} title="Refresh The Metadata">
            <RedoOutlined style={{ color: 'white' }} onClick={refresh} />
          </Tooltip> */}
          <Text
            style={{
              letterSpacing: '0.1rem',
              fontWeight: 'bold',
              color: '#EF233C',
            }}
            className="text-primary small-font-size margin-left"
          >
            <ReloadOutlined
              onClick={() => refreshData()}
              style={{ color: 'white', fontSize: '16px', marginRight: '5px' }}
            />
            {formatDate(moment(programInfo.programDate).format(), 'DD/MM/YYYY')}
          </Text>
        </div>
      </CardDetail>
      <section className="program-infomation-wrapper">
        <Form layout="vertical" style={{ height: '400px' }}>
          <section className="program-info-body-wrapper">
            <div>
              <div className="input-margin">
                <div className="time-fields">
                  <div className="time-from">
                    <Form.Item label="From" required>
                      <TimePicker
                        className="time-picker-color"
                        format={'HH:mm'}
                        value={moment(programInfo.programTime?.split(' to ')[0], 'HH:mm')}
                        disabled
                        onChange={value => {
                          const progTime = `${formatDate(value, 'hh:mmA')} to ${
                            programInfo.programTime.split(' to ')[1]
                          }`;
                          handleJobChange('programTime', progTime);
                        }}
                      />
                    </Form.Item>
                  </div>
                  <div className="time-from">
                    <Form.Item label="To" required>
                      <TimePicker
                        className="time-picker-color"
                        format="HH:mm"
                        value={moment(programInfo.programTime?.split(' to ')[1], 'HH:mm')}
                        disabled
                        onChange={value => {
                          const progTime = `${
                            programInfo.programTime.split(' to ')[0]
                          } to ${formatDate(value, 'hh:mmA')}`;
                          handleJobChange('programTime', progTime);
                        }}
                      />
                    </Form.Item>
                  </div>
                </div>
              </div>
              <div className="input-margin">
                <Form.Item label="Program Type" required>
                  <Select
                    // mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="Please select"
                    value={programInfo.programType ? programInfo.programType : null}
                    onClear={() => {
                      handleJobChange('programName', '');
                      handleJobChange('anchor', []);
                      handleJobChange('guests', []);
                    }}
                    onChange={value => handleJobChange('programType', value)}
                    options={programTypes.map(({ name }) => ({ value: name, title: name }))}
                  />
                </Form.Item>
              </div>
              <div className="input-margin">
                <Form.Item label="Program Name" required>
                  <Select
                    style={{ width: '100%' }}
                    placeholder="Please select"
                    value={programInfo.programName ? programInfo.programName : null}
                    onClear={() => {
                      handleJobChange('anchor', []);
                    }}
                    onChange={value => handleJobChange('programName', value, programList)}
                    options={programList?.map(({ title }) => ({ value: title, title: title }))}
                  />
                </Form.Item>
              </div>
              <div className="wrapper-anchors input-margin">
                <div className="warapper" style={{ marginRight: '10px' }}>
                  <Form.Item label="Anchors">
                    <Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      SelectAll={SelectAll}
                      placeholder="Please select"
                      value={programInfo.anchor}
                      maxTagCount={1}
                      onChange={value => {
                        value.includes('All')
                          ? value.map(value => {
                              handleJobChange('anchor', [value, ...hosts.map(({ name }) => name)]);
                            })
                          : handleJobChange('anchor', value);
                      }}
                      onDeselect={value => {
                        if (value === 'All') handleJobChange('anchor', []);
                      }}
                      options={hosts?.map(({ name }) => ({ value: name, title: name }))}
                    />
                  </Form.Item>
                </div>
                <div className="warapper">
                  <Form.Item label="Guest">
                    <Select
                      mode="multiple"
                      style={{ width: '100%' }}
                      SelectAll={SelectAll}
                      placeholder="Please select"
                      value={guestsValues}
                      maxTagCount={1}
                      onChange={value => {
                        value.includes('All')
                          ? value.map(value => {
                              handleJobChange('guests', [value, ...guests.map(({ name }) => name)]);
                            })
                          : handleJobChange('guests', value);
                      }}
                      onDeselect={value => {
                        if (value === 'All') handleJobChange('guests', []);
                      }}
                      options={guests?.map(({ name }) => ({ value: name, title: name }))}
                    />
                  </Form.Item>
                </div>
              </div>
              <div className="priority-detail input-margin">
                <div className="format-detail" style={{ marginRight: '10px' }}>
                  <Form.Item label="Priority" required>
                    <Select
                      style={{ width: '100%' }}
                      placeholder="Please select"
                      value={programInfo.priority}
                      onChange={value => handleJobChange('priority', value)}
                      options={Object.keys(PRIORITY_COLORS).map(priority => ({
                        title: priority,
                        value: priority.toUpperCase(),
                      }))}
                    />
                  </Form.Item>
                </div>
                <div className="format-detail" style={{ marginRight: '10px' }}>
                  <Form.Item label="Language" required>
                    <Select
                      style={{ width: '100%' }}
                      placeholder="Please select"
                      value={programInfo.language}
                      onChange={value => handleJobChange('language', value)}
                      options={CHANNEL_LANGUAGE.map(language => ({
                        title: language,
                        value: language,
                      }))}
                    />
                  </Form.Item>
                </div>
                <div className="format-detail">
                  <Form.Item label="Region" required>
                    <Select
                      style={{ width: '100%' }}
                      placeholder="Please select"
                      value={programInfo.region}
                      onChange={value => handleJobChange('region', value)}
                      options={CHANNEL_REGION.map(region => ({ title: region, value: region }))}
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
    <div className="program-infomation-container">
      <Spin
        spinning={programTypesError || programNamesError || guestError || hostError}
        delay={500}
      >
        <Card
          className="card-container-primary medium square program-information-card"
          title="Program Information"
          shape="square"
          variant="primary"
          style={{ background: '#131C3A' }}
          content={content}
        />
      </Spin>
    </div>
  );
};
ProgramInfo.defaultProps = {
  setProgramInfo: () => {},
};
export default ProgramInformation;
