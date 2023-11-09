import { Typography, Form, message, TimePicker, Skeleton, Tooltip, Image, Spin, Space } from 'antd';
import { RedoOutlined } from '@ant-design/icons';
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
import useConfirm from 'hooks/useConfirm';
import { ReloadOutlined } from '@ant-design/icons';

const { Text, Title } = Typography;

import './ProgramInformation.scss';
import { formatDate } from 'modules/common/utils';
import { useEffect, useState } from 'react';
import programNamesActions from 'modules/programNames/actions';
import programTypesActions from 'modules/programTypes/actions';
import guestsActions from 'modules/guests/actions';
import hostsActions from 'modules/hosts/actions';
import channelsActions from 'modules/channels/actions';
import { SelectAll } from 'modules/common/utils';
import { liveClippingActions } from 'modules/LiveClipping/actions';
import { networkError, errorCount, errorDelay } from 'constants/config/errorLoader';

const ProgramInformation = ({
  programInfo,
  setProgramInfo,
  channelInfo,
  disableField,
  setDisableField,
}) => {
  const programTypes = useSelector(state => state.programTypesReducer.programTypes);
  const { programTypesError } = useSelector(state => state.programTypesReducer);
  const { guests, guestError } = useSelector(state => state.guestsReducer);
  const { channels } = useSelector(state => state.channelsReducer);
  const { programNames, programNamesError } = useSelector(state => state.programNamesReducer);
  const { hosts, hostError } = useSelector(state => state.hostsReducer);
  const { startPro } = useSelector(state => state.liveClippingReducer);
  const { progDate } = useSelector(state => state.liveClippingReducer);
  const dispatch = useDispatch();
  const { confirm } = useConfirm();

  const [programList, setProgramList] = useState([]);
  const [programTypeCount, setProgramTypeCount] = useState(1);
  const [programNameCount, setProgramNameCount] = useState(1);
  const [guestCount, setGuestCount] = useState(1);
  const [hostCount, setHostCount] = useState(1);

  const fetchData = () => {
    dispatch(programNamesActions.getProgramNames.request());
    dispatch(programTypesActions.getProgramTypes.request());
    dispatch(guestsActions.getGuests.request());
    dispatch(hostsActions.getHosts.request());
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
    dispatch(channelsActions.getChannels.request());
  }, []);
  useEffect(() => {
    if (!channelInfo.channelName) return;
    let list = channels.filter(
      ({ name, actusId }) => channelInfo.channelName == name || channelInfo.channelName == actusId
    );
    list.length > 0
      ? setProgramInfo(prev => ({ ...prev, language: list[0].language, region: list[0].region }))
      : null;
  }, [channelInfo.channelName]);

  useEffect(() => {
    let list = programNames.filter(
      ({ type, channel }) =>
        type?.toLowerCase() == programInfo?.programType?.toLowerCase() &&
        channel == channelInfo.channelName
    );
    setProgramList(list);
  }, [programInfo.programType]);

  const refreshData = () => {
    dispatch(programNamesActions.getProgramNames.request());
    dispatch(programTypesActions.getProgramTypes.request());
    dispatch(guestsActions.getGuests.request());
    dispatch(hostsActions.getHosts.request());
    message.success('Refreshed', 1);
  };

  useEffect(() => {
    if (!channelInfo.channelName) return;
    let currentChannelPro = programNames?.filter(
      ({ channel, fromTime }) => channelInfo.channelName == channel && fromTime
    );
    let program = currentChannelPro?.filter(
      ({ fromTime, toTime }) =>
        moment(moment(fromTime).format('HH:mm A'), 'h:mma').format('x') >=
          programInfo.fromTime.format('x') &&
        moment(moment(toTime).format('HH:mm A'), 'h:mma').format('x') <=
          programInfo.toTime.format('x')
    );

    let programTitle = program[0]?.title ?? '';
    let programType = program[0]?.type ?? '';
    setProgramInfo(prev => ({ ...prev, programType, programName: programTitle }));
  }, [programInfo.fromTime, programInfo.toTime, channelInfo.channelName]);

  useEffect(() => {
    let list = programNames.filter(({ title }) => title == programInfo.programName);
    list.length > 0
      ? setProgramInfo({ ...programInfo, anchor: list[0].host })
      : setProgramInfo({ ...programInfo, anchor: [] });
  }, [programInfo.programName]);
  useEffect(() => {
    setProgramInfo({ ...programInfo, programId: uuidv4() });
  }, []);
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
        <div className="add-program">
          <Button
            disabled={!channelInfo.channelName || disableField}
            variant="secondary"
            onClick={handleFormSubmit}
          >
            START SEGMENTATION
          </Button>
          <Button disabled={!channelInfo.channelName} onClick={handleResetProgram}>
            + NEW PROGRAM
          </Button>
        </div>
        <div className="display-flex align-center">
          <div className="icon-wrapper">
            {channelInfo.channelLogoPath ? (
              <Image
                src={channelInfo.channelLogoPath}
                width={48}
                height={48}
                alt="logo"
                preview={false}
                fallback="placeholder.png"
              />
            ) : (
              <Skeleton.Image
                style={{ width: '48px', height: '48px', background: 'transparent' }}
              />
            )}
          </div>
          <div className="card-left-wrapper">
            <Text style={{ color: '#EF233C' }} className="text-primary large-font-size">
              {channelInfo.channelName == '' ? 'Channel Name' : channelInfo.channelName}
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
              style={{
                color: 'white',
                fontSize: '16px',
                marginRight: '5px',
                pointerEvents: !channelInfo.channelName || disableField === true ? 'none' : 'auto',
              }}
            />
            {formatDate(moment(progDate).format(), 'DD/MM/YYYY')}
          </Text>
        </div>
      </CardDetail>
      <section className="program-infomation-wrapper">
        <Form layout="vertical" style={{ height: '350px' }}>
          <section className="program-info-body-wrapper">
            <div>
              <div className="input-margin">
                <div className="time-fields">
                  <div className="time-from">
                    {!channelInfo.channelName == '' && startPro ? (
                      <Form.Item label="From" required>
                        <TimePicker
                          style={{ color: 'white' }}
                          disabled={disableField}
                          format={'HH:mm'}
                          value={programInfo.fromTime}
                          getPopupContainer={trigger => trigger.parentNode}
                          onChange={value => setProgramInfo({ ...programInfo, fromTime: value })}
                        />
                      </Form.Item>
                    ) : (
                      <Skeleton.Input
                        style={{
                          width: 132,
                          height: 40,
                          borderRadius: '5px',
                          marginTop: '6px',
                        }}
                        active={false}
                        size={'default'}
                      />
                    )}
                  </div>
                  <div className="time-from">
                    {!channelInfo.channelName == '' && startPro ? (
                      <Form.Item label="To" required>
                        <TimePicker
                          disabled={disableField}
                          format="HH:mm"
                          value={programInfo.toTime}
                          getPopupContainer={trigger => trigger.parentNode}
                          onChange={value => setProgramInfo({ ...programInfo, toTime: value })}
                        />
                      </Form.Item>
                    ) : (
                      <Skeleton.Input
                        style={{
                          width: 132,
                          height: 40,
                          borderRadius: '5px',
                          marginTop: '6px',
                        }}
                        active={false}
                        size={'default'}
                      />
                    )}
                  </div>
                </div>
              </div>
              <div className="input-margin">
                {!channelInfo.channelName == '' && startPro ? (
                  <Form.Item label="Program Type" required>
                    <Select
                      // mode="multiple"
                      disabled={disableField}
                      style={{ width: '100%' }}
                      placeholder="Please select"
                      value={programInfo.programType ? programInfo.programType : null}
                      getPopupContainer={trigger => trigger.parentNode}
                      onClear={() => {
                        setProgramInfo(prev => ({ ...prev, programName: '', guest: [] }));
                      }}
                      onChange={value => setProgramInfo(prev => ({ ...prev, programType: value }))}
                      options={programTypes.map(({ name }) => ({ value: name, title: name }))}
                    />
                  </Form.Item>
                ) : (
                  <Skeleton.Input
                    style={{
                      width: 500,
                      height: 40,
                      borderRadius: '5px',
                      marginTop: '6px',
                    }}
                    active={false}
                    size={'default'}
                  />
                )}
              </div>
              <div className="input-margin">
                {!channelInfo.channelName == '' && startPro ? (
                  <Form.Item label="Program Name" required>
                    <Select
                      disabled={disableField}
                      style={{ width: '100%' }}
                      placeholder="Please select"
                      value={programInfo.programName ? programInfo.programName : null}
                      getPopupContainer={trigger => trigger.parentNode}
                      onChange={value => setProgramInfo({ ...programInfo, programName: value })}
                      options={programList?.map(({ title }) => ({ value: title, title: title }))}
                    />
                  </Form.Item>
                ) : (
                  <Skeleton.Input
                    style={{
                      width: 500,
                      height: 40,
                      borderRadius: '5px',
                      marginTop: '6px',
                    }}
                    active={false}
                    size={'default'}
                  />
                )}
              </div>
              <div className="wrapper-anchors input-margin">
                <div className="warapper" style={{ marginRight: '10px' }}>
                  {!channelInfo.channelName == '' && startPro ? (
                    <Form.Item label="Anchors">
                      <Select
                        mode="multiple"
                        SelectAll={SelectAll}
                        style={{ width: '100%' }}
                        placeholder="Please select"
                        value={programInfo.anchor}
                        maxTagCount={1}
                        disabled={disableField}
                        //                         maxTagCount={2}
                        getPopupContainer={trigger => trigger.parentNode}
                        onChange={value => {
                          value.includes('All')
                            ? value.map(value => {
                                setProgramInfo({
                                  ...programInfo,
                                  anchor: [value, ...hosts?.map(({ name }) => name)],
                                });
                              })
                            : setProgramInfo({ ...programInfo, anchor: value });
                        }}
                        onDeselect={value => {
                          if (value === 'All')
                            setProgramInfo({
                              ...programInfo,
                              anchor: [],
                            });
                        }}
                        options={hosts?.map(({ name }) => ({ value: name, title: name }))}
                      />
                    </Form.Item>
                  ) : (
                    <Skeleton.Input
                      style={{
                        width: 240,
                        height: 40,
                        borderRadius: '5px',
                        marginTop: '6px',
                      }}
                      active={false}
                      size={'default'}
                    />
                  )}
                </div>
                <div className="warapper">
                  {!channelInfo.channelName == '' && startPro ? (
                    <Form.Item label="Guest">
                      <Select
                        mode="multiple"
                        SelectAll={SelectAll}
                        style={{ width: '100%' }}
                        placeholder="Please select"
                        value={programInfo.guest}
                        maxTagCount={1}
                        disabled={disableField}
                        //                         maxTagCount={2}
                        getPopupContainer={trigger => trigger.parentNode}
                        onChange={value => {
                          value.includes('All')
                            ? value.map(value => {
                                setProgramInfo({
                                  ...programInfo,
                                  guest: [value, ...guests?.map(({ name }) => name)],
                                });
                              })
                            : setProgramInfo({ ...programInfo, guest: value });
                        }}
                        onDeselect={value => {
                          if (value === 'All')
                            setProgramInfo({
                              ...programInfo,
                              guest: [],
                            });
                        }}
                        options={guests?.map(({ name }) => ({ value: name, title: name }))}
                      />
                    </Form.Item>
                  ) : (
                    <Skeleton.Input
                      style={{
                        width: 245,
                        height: 40,
                        borderRadius: '5px',
                        marginTop: '6px',
                      }}
                      active={false}
                      size={'default'}
                    />
                  )}
                </div>
              </div>
              <div className="priority-detail input-margin">
                <div className="format-detail" style={{ marginRight: '10px' }}>
                  {!channelInfo.channelName == '' && startPro ? (
                    <Form.Item label="Priority" required>
                      <Select
                        style={{ width: '100%' }}
                        placeholder="Please select"
                        value={programInfo.priority}
                        disabled={disableField}
                        onChange={value => setProgramInfo({ ...programInfo, priority: value })}
                        options={Object.keys(PRIORITY_COLORS).map(priority => ({
                          title: priority,
                          value: priority.toUpperCase(),
                        }))}
                      />
                    </Form.Item>
                  ) : (
                    <Skeleton.Input
                      style={{
                        width: 160,
                        height: 40,
                        borderRadius: '5px',
                        // marginLeft: '5px',
                        marginTop: '6px',
                      }}
                      active={false}
                      size={'default'}
                    />
                  )}
                </div>
                <div className="format-detail" style={{ marginRight: '10px' }}>
                  {!channelInfo.channelName == '' && startPro ? (
                    <Form.Item label="Language" required>
                      <Select
                        style={{ width: '100%' }}
                        placeholder="Please select"
                        disabled={disableField}
                        value={programInfo.language}
                        onChange={value => setProgramInfo({ ...programInfo, language: value })}
                        options={CHANNEL_LANGUAGE.map(language => ({
                          title: language,
                          value: language,
                        }))}
                      />
                    </Form.Item>
                  ) : (
                    <Skeleton.Input
                      style={{
                        width: 160,
                        height: 40,
                        borderRadius: '5px',
                        // marginLeft: '5px',
                        marginTop: '6px',
                      }}
                      active={false}
                      size={'default'}
                    />
                  )}
                </div>
                <div className="format-detail">
                  {!channelInfo.channelName == '' && startPro ? (
                    <Form.Item label="Region" required>
                      <Select
                        style={{ width: '100%' }}
                        disabled={disableField}
                        placeholder="Please select"
                        value={programInfo.region}
                        onChange={value => setProgramInfo({ ...programInfo, region: value })}
                        options={CHANNEL_REGION.map(region => ({ title: region, value: region }))}
                      />
                    </Form.Item>
                  ) : (
                    <Skeleton.Input
                      style={{
                        width: 160,
                        height: 40,
                        borderRadius: '5px',
                        // marginLeft: '5px',
                        marginTop: '6px',
                      }}
                      active={false}
                      size={'default'}
                    />
                  )}
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
export default ProgramInformation;

// ant-card-head-title
