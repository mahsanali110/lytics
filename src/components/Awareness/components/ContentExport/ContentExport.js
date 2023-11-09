import React, { useState, useEffect } from 'react';
import { SegmentContainer, Button, Select, Card } from 'components/Common';
import { Typography, Form, Input, Checkbox, Skeleton, Space, Spin } from 'antd';
import { SelectAll } from 'modules/common/utils';
import { useDispatch, useSelector } from 'react-redux';
import guestsActions from 'modules/guests/actions';
import { PRIORITY_COLORS } from 'constants/options';
import ExportJobTable from './ExportJobTable';
import contentExportActions from 'modules/contentExport/action';
import { message as antMessage } from 'antd';
import { CloseCircleTwoTone } from '@ant-design/icons';
import moment from 'moment';
import { networkError, errorCount, errorDelay } from 'constants/config/errorLoader';

const { TextArea } = Input;

import './ContentExport.scss';
const { Text } = Typography;

function ContentExport({
  programInfo,
  channel,
  refresh,
  programTypes,
  hosts,
  programNames,
  process,
  setProcess,
  handleSubmit,
  processExport,
  setProcessExport,
  transcriptionFlag,
  settranscriptionFlag,
  setContentInfo,
}) {
  const dispatch = useDispatch();
  const [guestsCount, setGuestsCount] = useState(1);
  const { guests, guestError } = useSelector(state => state.guestsReducer);
  const { hostsError, programTypesError, programNamesError } = useSelector(
    state => state.commonReducer
  );
  useEffect(() => {
    dispatch(guestsActions.getGuests.request());
  }, []);

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

  const onChange = ({ field, value }) =>
    setProcess(prev => ({
      ...prev,
      [field]: value,
    }));
  const [ChannelProgramName, setChannelProgramName] = useState([]);
  const [ChannelALLProgramName, setChannelALLProgramName] = useState([]);
  const [ChannelHostName, setChannelHostName] = useState([]);
  const [seletedProgramName, setseletedProgramName] = useState('');
  const [seletedProgramType, setseletedProgramType] = useState('');
  const [checkparticipent, setcheckparticipent] = useState(false);
  const [checkAnchor, setcheckAnchor] = useState(true);
  const [selectedProgram, setselectedProgramm] = useState([]);
  const [Job, setJob] = useState(null);

  useEffect(() => {
    setProcess(prev => ({ ...prev, language: channel.language, region: channel.region }));
    let temp = [];
    programNames.forEach(p => {
      if (channel.actusId == p.channel && p.type == seletedProgramType) {
        temp.push(p);
        // setProcess(prev => ({ ...prev, language: channel.language, region: channel.region }));
      }
    });
    setChannelProgramName(temp);
    if (seletedProgramType === selectedProgram[0]?.type) return;
    console.log('called');
    setProcess(prev => ({ ...prev, programName: '', anchor: [] }));
    let temp2 = [];
    programNames.forEach(p => {
      if (channel.actusId == p.channel) {
        temp2.push(p);
      }
    });
    setChannelALLProgramName(temp2);
  }, [programNames, channel, seletedProgramType, selectedProgram]);

  useEffect(() => {
    let temp = [];
    ChannelALLProgramName.forEach(p => {
      temp.push(p.host);
    });
    temp = temp.flat(1);
    setChannelHostName(temp);
  }, [ChannelALLProgramName]);
  useEffect(() => {
    ChannelProgramName.forEach(p => {
      if (p.title === seletedProgramName) {
        setProcess(prev => ({ ...prev, anchor: p.host }));
        if (p.host.length == 0) {
          setcheckAnchor(false);
        } else {
          setcheckAnchor(true);
        }
        console.log(p.host.length);
      }
    });
  }, [seletedProgramName]);
  function onSearch(val) {
    console.log('search:', val);
  }

  useEffect(() => {
    if (!programInfo) return;
    console.log({ programNames });
    let channelProgrames = programNames.filter(p => {
      if (programInfo?.channel == p.channel && p.fromTime) {
        return true;
      }
    });

    let program = channelProgrames?.filter(
      ({ fromTime, toTime }) =>
        moment(moment(fromTime).format('HH:mm A'), 'h:mma').format('x') <=
          moment(moment().format('YYYY-MM-DD') + ' ' + programInfo.programTimeFrom).format('x') &&
        moment(moment(toTime).format('HH:mm A'), 'h:mma').format('x') >=
          moment(moment().format('YYYY-MM-DD') + ' ' + programInfo.programTimeTo).format('x')
    );
    // console.log({ program });
    setselectedProgramm(program);
    let programTitle = program[0]?.title ?? '';
    let programType = program[0]?.type ?? '';
    let programAnchors = program[0]?.host ?? [];
    setProcess(prev => ({
      ...prev,
      programType: programType,
      programName: programTitle,
      anchor: programAnchors,
    }));
    setseletedProgramType(program[0]?.type);
    setseletedProgramName(program[0]?.title);
  }, [programNames, programInfo]);

  useEffect(() => {}, [process]);

  return (
    <div className="content-export-parent">
      <SegmentContainer
        title="Clip Export"
        color="#A86CE4"
        variant="secondary"
        isAwareness={true}
        refreshData={refresh}
      >
        <Card
          bg="dark"
          variant="secondary"
          content={
            <section className="process-wrapper">
              <div>
                {programInfo?.channelLogoPath !== undefined ? (
                  <>
                    <div className="grey-box">
                      <section className="card-detail-body mt-10">
                        <div className="sub-heading">
                          <div style={{ display: 'flex' }}>
                            <div className="">
                              <img
                                height="30px"
                                width="30px"
                                src={programInfo?.channelLogoPath}
                                alt=""
                                crossOrigin="Anonymous"
                              />
                            </div>
                            <Text
                              className="text-pink small-font-size"
                              style={{
                                marginLeft: '5px',
                                marginTop: '5px',
                                color: '#9E1D40',
                              }}
                            >
                              {programInfo?.channel}
                            </Text>
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                            }}
                          >
                            <Text
                              style={{
                                color: '#9E1D40',
                              }}
                              className="text-pink small-font-size"
                            >
                              {programInfo?.programDate}
                            </Text>
                            {programInfo?.programTimeFrom !== undefined ||
                            programInfo?.programTimeTo !== undefined ? (
                              <Text
                                style={{
                                  color: '#9E1D40',
                                }}
                                className="text-pink small-font-size"
                              >
                                {`${programInfo?.programTimeFrom} to ${programInfo?.programTimeTo}`}
                              </Text>
                            ) : (
                              ''
                            )}
                          </div>
                        </div>

                        <Form layout="vertical">
                          <Form.Item label="Program Type" required>
                            <Spin spinning={programTypesError} delay={500}>
                              <Select
                                value={process.programType}
                                size="small"
                                allowClear
                                onClear={() => {
                                  setProcess(prev => ({
                                    ...prev,
                                    programName: '',
                                    anchor: [],
                                    guest: [],
                                  }));
                                }}
                                onChange={value => {
                                  onChange({ field: 'programType', value });
                                  setseletedProgramType(value);
                                }}
                                options={programTypes.map(({ name }) => ({
                                  title: name,
                                  value: name,
                                }))}
                              />
                            </Spin>
                          </Form.Item>
                          <Form.Item label="Program Name" required>
                            <Spin spinning={programNamesError} delay={500}>
                              <Select
                                value={process.programName}
                                size="small"
                                allowClear
                                onClear={() => {
                                  setProcess(prev => ({ ...prev, anchor: [] }));
                                }}
                                onChange={value => {
                                  onChange({ field: 'programName', value }),
                                    setseletedProgramName(value);
                                }}
                                options={ChannelProgramName.map(({ title }) => ({
                                  title,
                                  value: title,
                                }))}
                              />
                            </Spin>
                          </Form.Item>

                          <Form.Item label="Channel Anchors" required={checkAnchor}>
                            <Spin spinning={hostsError} delay={500}>
                              <Select
                                value={process.anchor}
                                SelectAll={SelectAll}
                                mode="multiple"
                                size="small"
                                allowClear
                                onChange={value => {
                                  value.includes('All')
                                    ? value.map(value => {
                                        onChange({
                                          field: 'anchor',
                                          value: [value, ...ChannelHostName.map(name => name)],
                                        });
                                      })
                                    : onChange({
                                        field: 'anchor',
                                        value,
                                      });
                                }}
                                onDeselect={value => {
                                  if (value === 'All') onChange({ field: 'anchor', value: [] });
                                }}
                                options={ChannelHostName.map(name => ({
                                  title: name,
                                  value: name,
                                }))}
                              />
                            </Spin>
                          </Form.Item>
                          <Form.Item label="Participant(s) Name" required={checkparticipent}>
                            <Spin spinning={guestError} delay={500}>
                              <Select
                                value={process.guest}
                                mode="multiple"
                                size="small"
                                SelectAll={SelectAll}
                                allowClear
                                onSearch={onSearch}
                                maxTagCount={3}
                                maxTagTextLength={7}
                                // filterOption={true}
                                // showSearch
                                onChange={value => {
                                  value.includes('All')
                                    ? value.map(value => {
                                        onChange({
                                          field: 'guest',
                                          value: [
                                            value,
                                            ...guests?.map(
                                              ({ name, association, description }) =>
                                                `${name}|${association}|${description}`
                                            ),
                                          ],
                                        });
                                      })
                                    : onChange({
                                        field: 'guest',
                                        value,
                                      });
                                }}
                                onDeselect={value => {
                                  if (value === 'All') onChange({ field: 'guest', value: [] });
                                }}
                                options={guests.map(({ name, association, description }) => ({
                                  value: `${name}|${association}|${description}`,
                                  title: `${name} (${association})`,
                                }))}
                              />
                            </Spin>
                          </Form.Item>
                          <div
                            style={{
                              display: 'flex',
                              flexDirection: 'row',
                              justifyContent: 'space-between',
                              width: '100%',
                            }}
                          >
                            <div style={{ width: '30%' }}>
                              <Form.Item label="Priority" required>
                                <Select
                                  className={`${PRIORITY_COLORS[process.priority]}`}
                                  value={process.priority}
                                  placeholder=""
                                  size="small"
                                  allowClear
                                  onChange={value => onChange({ field: 'priority', value })}
                                  options={Object.keys(PRIORITY_COLORS).map(title => ({
                                    title,
                                    value: title,
                                  }))}
                                />
                              </Form.Item>
                            </div>
                            <div style={{ width: '30%' }}>
                              <Form.Item label="Language" required>
                                <Select
                                  value={process.language}
                                  size="small"
                                  allowClear
                                  onChange={value => onChange({ field: 'language', value })}
                                  options={['URDU', 'ENGLISH'].map(title => ({
                                    title,
                                    value: title,
                                  }))}
                                />
                              </Form.Item>
                            </div>
                            <div style={{ width: '30%' }}>
                              <Form.Item label="Region" required>
                                <Select
                                  value={process.region}
                                  size="small"
                                  allowClear
                                  onChange={value => onChange({ field: 'region', value })}
                                  options={['Local', 'National', 'International'].map(title => ({
                                    title,
                                    value: title,
                                  }))}
                                />
                              </Form.Item>
                            </div>
                          </div>

                          <Form.Item label="Analysis">
                            <TextArea
                              style={{ height: '10rem' }}
                              value={process.comments}
                              onChange={e => onChange({ field: 'comments', value: e.target.value })}
                              className="bg-light-grey"
                              rows={4}
                              placeholder="Enter Text Here..."
                            />
                          </Form.Item>
                        </Form>
                      </section>
                      <div className="content-footer">
                        <Checkbox
                          style={{
                            boxShadow: '0px 5px 5px #3e404b',
                          }}
                          className="checkbox-export"
                          checked={transcriptionFlag}
                          onChange={e => {
                            settranscriptionFlag(e.target.checked);
                          }}
                        >
                          With Transcription
                        </Checkbox>
                        <Button
                          variant="secondary"
                          onClick={() => {
                            if (programInfo?.channel == undefined) {
                              antMessage.error('No Clip is Generated For Processing');
                              return;
                            } else {
                              handleSubmit();
                            }
                          }}
                        >
                          PROCESS
                        </Button>
                      </div>
                      <CloseCircleTwoTone
                        className="window-close-icon"
                        style={{
                          position: 'absolute',
                          top: '-7px',
                          // left: '100%',
                          right: '-5px',
                          fontSize: '1.3rem',
                          height: '20px',
                          zIndex: '9999',
                          color: 'rgba(242, 106, 50, 1)',
                          marginTop: '5px',
                          marginRight: '10px',
                        }}
                        onClick={() => {
                          setContentInfo({});
                        }}
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <Card
                        bg="dark"
                        variant="secondary"
                        content={
                          <>
                            <Space
                              style={{
                                display: 'flex',
                                flexDirection: 'column',
                                marginTop: '10px',
                              }}
                            >
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'row',
                                  justifyContent: 'space-between',
                                  width: '350px',
                                }}
                              >
                                <div>
                                  <Skeleton.Avatar
                                    active={false}
                                    size={'default'}
                                    shape={'circle'}
                                  />
                                  <Skeleton.Input
                                    style={{
                                      width: 60,
                                      height: 20,
                                      borderRadius: '5px',
                                      marginLeft: '5px',
                                      marginTop: '6px',
                                    }}
                                    active={false}
                                    size={'default'}
                                  />
                                </div>
                                <Skeleton.Input
                                  style={{ width: 100, borderRadius: '5px' }}
                                  active={false}
                                  size={'default'}
                                />
                              </div>
                              <div
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  marginTop: '20px',
                                }}
                              >
                                <div>
                                  <Skeleton.Input
                                    style={{ width: 355, borderRadius: '5px' }}
                                    active={false}
                                    size={'default'}
                                  />
                                  <Skeleton.Input
                                    style={{ width: 355, marginTop: '20px', borderRadius: '5px' }}
                                    active={false}
                                    size={'default'}
                                  />
                                  <Skeleton.Input
                                    style={{ width: 355, marginTop: '20px', borderRadius: '5px' }}
                                    active={false}
                                    size={'default'}
                                  />
                                  <Skeleton.Input
                                    style={{ width: 355, marginTop: '20px', borderRadius: '5px' }}
                                    active={false}
                                    size={'default'}
                                  />
                                </div>
                                <div style={{ marginTop: '20px' }}>
                                  <Skeleton.Input
                                    style={{ width: 107, borderRadius: '5px' }}
                                    active={false}
                                    size={'default'}
                                  />
                                  <Skeleton.Input
                                    style={{ width: 107, marginLeft: '15px', borderRadius: '5px' }}
                                    active={false}
                                    size={'default'}
                                  />
                                  <Skeleton.Input
                                    style={{ width: 107, marginLeft: '15px', borderRadius: '5px' }}
                                    active={false}
                                    size={'default'}
                                  />
                                </div>
                              </div>
                            </Space>
                            <Skeleton.Input
                              style={{
                                width: 355,
                                height: 150,
                                marginTop: '20px',
                                borderRadius: '5px',
                              }}
                              active={false}
                              size={'default'}
                            />
                            <div
                              style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                marginTop: '20px',
                                marginBottom: '15px',
                              }}
                            >
                              <Skeleton.Input
                                style={{
                                  width: 107,
                                  borderRadius: '5px',
                                  marginTop: '5px',
                                }}
                                active={false}
                                size={'default'}
                              />
                              <Skeleton.Button
                                active={false}
                                size={'large'}
                                style={{ width: '120px', height: '40px', borderRadius: '10px' }}
                                shape={'default'}
                                block={true}
                              />
                            </div>
                          </>
                        }
                      />
                    </div>
                  </>
                )}
              </div>

              <div className="table-wrapper">
                <ExportJobTable setJob={setJob} Job={Job}></ExportJobTable>
              </div>
              <div className="export-footer">
                <Button
                  disabled={Job === null}
                  onClick={() => {
                    dispatch(
                      contentExportActions.exportToDrive.request({ id: Job._id, data: Job })
                    );
                    setJob(null);
                  }}
                >
                  EXPORT
                </Button>
              </div>
            </section>
          }
        />
      </SegmentContainer>
    </div>
  );
}

export default ContentExport;
