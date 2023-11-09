import React, { useState, useEffect } from 'react';
import { Drawer, Space, Row, Col, Image } from 'antd';
import { MenuOutlined, RightOutlined, LeftOutlined } from '@ant-design/icons';
import Channels from './Channels';
import channelActions from 'modules/channels/actions';
import Ticker from './components/Ticker/Ticker';
import BreakingNews from './components/BreakingNews/BreakingNews';
import ContentExport from './components/ContentExport/ContentExport';
import Facebook from './components/facebook/facebook';
import Twitter from './components/twitter/Twitter';
import Youtube from './components/youtube/youtube';
import WhatsApp from './components/whatsapp/whatsapp';
import commonActions from 'modules/common/actions';
import { message as antMessage } from 'antd';
import ChannelWindow from './ChannelWindow';
import { formatDate, timeDifference, getUser } from 'modules/common/utils';
import contentExportActions from 'modules/contentExport/action';
import './awareness.scss';
import { v1 as uuid } from 'uuid';
import CONFIG from '../../player_config.json';
import { channelActions as CA } from '../../modules/multiview/actions';
import {
  CHANNELS,
  CHANNELS_SEARCH_PLACEHOLDER,
  MAXIMUM_WINDOWS_ACTIVE,
} from '../../constants/strings';
import { ACTUS_PATH, ACTUS_CHANNELS_API_PATH } from 'constants/index';

import TickerLibrary from './components/Libraries/TickerLibrary';
import ScreenLibrary from './components/Libraries/ScreenLibrary';
import ClipLibrary from './components/Libraries/ClipLibrary';

import {
  Tabs,
  SegmentContainer,
  Button,
  // ActusPlayer,
  CustomPlayerControls,
} from 'components/Common';
import { useSelector, useDispatch } from 'react-redux';
import { MenuAlt } from 'assets/icons';
import axios from 'axios';
const { addWindowAwareness } = CA;
import { networkError, errorCount, errorDelay } from 'constants/config/errorLoader';

function Awareness() {
  const dispatch = useDispatch();
  const { channels } = useSelector(state => state.channelsReducer);
  const [editClipper, setEditClipper] = useState(false);
  const [clipperData, setClipperData] = useState({});
  const [visibleChannel, setvisibleChannel] = useState('inactive');
  const [visibleT, setvisibleT] = useState('inactive');
  const [visibleB, setVisibleB] = useState('inactive');
  const [visibleC, setVisibleC] = useState('inactive');
  const [visibleF, setVisibleF] = useState('inactive');
  const [visibleTw, setVisibleTw] = useState('inactive');
  const [visibleY, setVisibleY] = useState('inactive');
  const [visibleW, setVisibleW] = useState('inactive');
  const [contentInfo, setContentInfo] = useState({});
  const [channel, setchannel] = useState({});
  const [channelDataTicker, setchannelDataTicker] = useState();
  const [channelDataShot, setchannelDataShot] = useState();
  const [qualtiyOptions, setQualtiyOptions] = useState([]);
  const [guests, setGuests] = useState([]);
  const [transcriptionFlag, settranscriptionFlag] = useState(false);
  const [drawerFlag, setDrawerFlag] = useState(false);
  const [hostCount, setHostCount] = useState(1);
  const [programTypeCount, setProgramTypeCount] = useState(1);
  const [programNameCount, setProgramNameCount] = useState(1);
  const { selectedWindowsAWARENESS } = useSelector(state => state.multiviewReducer);

  const [process, setProcess] = useState({
    programName: '',
    programType: '',
    anchor: [],
    priority: '',
    guest: [],
    language: '',
    region: '',
    comments: '',
  });
  const [Newchannels, SetNewchannels] = useState([]);

  const [placement, setPlacement] = useState('left');
  useEffect(() => {
    fetchChannels();
    fetchDefaultConfigurations();
  }, []);

  const checkActus = () => {
    axios
      .get('http://172.168.1.131/actus5/api/channels', {
        headers: {
          ActAuth: `ActAuth eyJpZCI6MiwibmFtZSI6ImFkbWluaXN0cmF0b3IiLCJhY3R1c191c2VyX2dyb3VwX2lkIjowLCJzZXNzaW9uX2d1aWQiOiJjN2UyMDIwNC1kMmNhLTQ2MjYtYjQyYi03ODc2YmRiNjkzNDYiLCJpbl9kaXJlY3Rvcnlfc2VydmljZSI6ZmFsc2UsImFkX2dyb3VwX25hbWUiOm51bGwsInNjb3BlIjoiY2xpcHBpbmciLCJJZGVudGl0eSI6bnVsbH0mWCZYJlgtNDY1Nzk0Njkw`,
        },
      })
      .then(res => {
        console.log('http://172.168.1.131/actus5');
        dispatch(CA.updateActus({ field: 'private', value: 'http://172.168.1.131/actus5' }));

        return;
      })
      .catch(error => {
        console.error(error);
      });
    axios
      .get(ACTUS_CHANNELS_API_PATH, {
        headers: {
          ActAuth: `ActAuth eyJpZCI6MiwibmFtZSI6ImFkbWluaXN0cmF0b3IiLCJhY3R1c191c2VyX2dyb3VwX2lkIjowLCJzZXNzaW9uX2d1aWQiOiJjN2UyMDIwNC1kMmNhLTQ2MjYtYjQyYi03ODc2YmRiNjkzNDYiLCJpbl9kaXJlY3Rvcnlfc2VydmljZSI6ZmFsc2UsImFkX2dyb3VwX25hbWUiOm51bGwsInNjb3BlIjoiY2xpcHBpbmciLCJJZGVudGl0eSI6bnVsbH0mWCZYJlgtNDY1Nzk0Njkw`,
        },
      })
      .then(res => {
        console.log(ACTUS_PATH);
        dispatch(CA.updateActus({ field: 'public', value: ACTUS_PATH }));

        return;
      })
      .catch(error => {
        console.error(error);
      });
  };
  useEffect(() => {
    checkActus();
    dispatch(CA.getActusURL.request());
  }, []);
  useEffect(() => {
    fetch('./preset.json').then(res => {
      res.json().then(data => {
        setQualtiyOptions([...data]);
      });
    });
  }, []);
  useEffect(() => {
    channels.map(
      channel => {
        if (channel.actusId === contentInfo?.programData?.channel) {
          setchannel(channel);
        }
      },
      [contentInfo, channels]
    );
  }, [channels, contentInfo]);
  useEffect(() => {
    setDrawerFlag(
      visibleT != 'inactive' ||
        visibleB != 'inactive' ||
        visibleC != 'inactive' ||
        visibleF != 'inactive' ||
        visibleTw != 'inactive' ||
        visibleY != 'inactive' ||
        visibleW != 'inactive' ||
        visibleChannel != 'inactive'
    );
  }, [visibleT, visibleChannel, visibleC, visibleB, visibleF, visibleTw, visibleY, visibleW]);
  const fetchDefaultConfigurations = () => {
    dispatch(commonActions.fetchHosts.request());
    dispatch(commonActions.fetchProgramTypes.request());
    dispatch(commonActions.fetchProgramNames.request());
  };
  const fetchChannels = () => dispatch(channelActions.getChannels.request());
  const { hosts, programTypes, programNames, hostsError, programTypesError, programNamesError } =
    useSelector(state => state.commonReducer);

  useEffect(() => {
    if (hostsError || hostsError === networkError) {
      setHostCount(prevCount => prevCount + 1);
      if (hostCount <= errorCount) {
        setTimeout(() => {
          dispatch(commonActions.fetchHosts.request());
        }, errorDelay);
      } else if (hostsError === networkError) {
        alert(`${hostsError}, Please refresh!`);
        window.location.reload();
      } else if (hostsError !== networkError) {
        alert(`${hostsError}, Please refresh!`);
        window.location.reload();
      }
    }
  }, [hostsError]);
  useEffect(() => {
    if (programNamesError || programNamesError === networkError) {
      setProgramNameCount(prevCount => prevCount + 1);
      if (programNameCount <= errorCount) {
        console.log(programNameCount);
        setTimeout(() => {
          dispatch(commonActions.fetchProgramNames.request());
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
    if (programTypesError || programTypesError === networkError) {
      setProgramTypeCount(prevCount => prevCount + 1);
      if (programTypeCount <= errorCount) {
        console.log(programTypeCount);
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

  const selectedChannelWindows = useSelector(
    state => state.multiviewReducer.selectedWindowsAWARENESS
  );

  const refresh = () => {
    fetchDefaultConfigurations();
    fetchChannels();
    antMessage.success('Refreshed', 1);
  };
  const showDrawer = type => {
    if (type === 'channel') {
      if (visibleChannel === 'inactive') {
        setvisibleChannel('');
        setvisibleT('inactive');
        setVisibleB('inactive');
        setVisibleC('inactive');
        setVisibleF('inactive');
        setVisibleTw('inactive');
        setVisibleY('inactive');
        setVisibleW('inactive');
      } else {
        setvisibleChannel('inactive');
      }
    } else if (type === 'T') {
      if (visibleT === 'inactive') {
        setvisibleT('');
        setvisibleChannel('inactive');
        setVisibleB('inactive');
        setVisibleC('inactive');
        setVisibleF('inactive');
        setVisibleTw('inactive');
        setVisibleY('inactive');
        setVisibleW('inactive');
      } else {
        setvisibleT('inactive');
      }
    } else if (type === 'B') {
      if (visibleB === 'inactive') {
        setVisibleB('');
        setvisibleChannel('inactive');
        setvisibleT('inactive');
        setVisibleC('inactive');
        setVisibleF('inactive');
        setVisibleTw('inactive');
        setVisibleY('inactive');
        setVisibleW('inactive');
      } else {
        setVisibleB('inactive');
      }
    } else if (type === 'C') {
      if (visibleC === 'inactive') {
        setVisibleC('');
        setvisibleT('inactive');
        setVisibleB('inactive');
        setVisibleF('inactive');
        setVisibleTw('inactive');
        setVisibleY('inactive');
        setVisibleW('inactive');
        setvisibleChannel('inactive');
      } else {
        setVisibleC('inactive');
      }
    } else if (type === 'F') {
      if (visibleF === 'inactive') {
        setVisibleF('');
        setVisibleC('inactive');
        setvisibleT('inactive');
        setVisibleB('inactive');
        setVisibleTw('inactive');
        setVisibleY('inactive');
        setVisibleW('inactive');
        setvisibleChannel('inactive');
      } else {
        setVisibleF('inactive');
      }
    } else if (type === 'Y') {
      if (visibleY === 'inactive') {
        setVisibleY('');
        setVisibleC('inactive');
        setvisibleT('inactive');
        setVisibleB('inactive');
        setVisibleF('inactive');
        setVisibleTw('inactive');
        setVisibleW('inactive');
        setvisibleChannel('inactive');
      } else {
        setVisibleY('inactive');
      }
    } else if (type === 'Tw') {
      if (visibleTw === 'inactive') {
        setVisibleY('inactive');
        setVisibleC('inactive');
        setvisibleT('inactive');
        setVisibleB('inactive');
        setVisibleF('inactive');
        setVisibleTw('');
        setVisibleW('inactive');
        setvisibleChannel('inactive');
      } else {
        setVisibleTw('inactive');
      }
    } else if (type === 'W') {
      if (visibleW === 'inactive') {
        setVisibleY('inactive');
        setVisibleC('inactive');
        setvisibleT('inactive');
        setVisibleB('inactive');
        setVisibleF('inactive');
        setVisibleTw('inactive');
        setVisibleW('');
        setvisibleChannel('inactive');
      } else {
        setVisibleW('inactive');
      }
    }
  };
  const onClose = type => {
    if (type === 'channel') {
      setvisibleChannel('inactive');
    } else if (type === 'T') {
      setvisibleT(false);
    } else if (type === 'B') {
      setVisibleB(false);
    } else if (type === 'C') {
      setVisibleC(false);
    }
  };
  const onEditClip = data => {
    // setClipperData(data);
    setContentInfo(data);
  };

  const handleExportSubmit = () => {
    if (process.guest.length > 0) {
      setGuests([]);
      process.guest.forEach(g =>
        guests.push({
          name: g.split('|')[0],
          association: g.split('|')[1],
          description: g.split('|')[2],
        })
      );
    }
    let anlysis = process.comments;
    const { firstName, lastName } = getUser();
    const clippedBy = [firstName, lastName].join(' ');
    const {
      parts,
      from,
      to,
      programData: { programTimeFrom, programTimeTo },
    } = contentInfo;
    let data = {
      channel: channel.name,
      channelLogoPath: channel.logoPath,
      programTime: [
        contentInfo?.programData.programTimeFrom,
        contentInfo?.programData.programTimeTo,
      ].join(' to '),
      programStartTime: programTimeFrom,
      programEndTime: programTimeTo,
      segmentStartTime: formatDate(from, 'DD/MM/YYYY HH:mm:ss'),
      segmentEndTime: formatDate(to, 'DD/MM/YYYY HH:mm:ss'),
      segmentDuration: timeDifference(from, to, 'seconds'),
      programDate: contentInfo?.programData.programDate,
      actusRequest: {
        from: formatDate(parts.from, 'YYYY-MM-DD HH:mm:ss'),
        to: formatDate(parts.to, 'YYYY-MM-DD HH:mm:ss'),
        parts: [parts],
      },
      // quality: processExport.output.format,
      // programName: processExport.output.programType,
      clippedBy,
      output: {
        programType: '',
        format: '',
        frameSizePixel: '',
        frameSize: '',
      },
      ...process,
      transcriptionFlag,
      source: 'Export',
    };
    delete data.comments;
    let check = true;
    Object.values(data).map(obj => {
      if (obj === '') {
        check = false;
      }
    });
    if (check) {
      data = { ...data, guests, comments: anlysis };
      delete data.guest;
      dispatch(contentExportActions.createExportJob.request(data));
      settranscriptionFlag(false);

      setProcess({
        programName: '',
        programType: '',
        anchor: [],
        priority: '',
        guest: [],
        language: '',
        region: '',
        comments: '',
      });
      setContentInfo({});
    } else {
      antMessage.error('All fields are required', 2);
    }
  };
  const rightDrawer =
    (visibleT != 'inactive' ||
      visibleB != 'inactive' ||
      visibleC != 'inactive' ||
      visibleF != 'inactive' ||
      visibleTw != 'inactive' ||
      visibleY != 'inactive' ||
      visibleW != 'inactive') &&
    selectedChannelWindows.length > 1;

  useEffect(() => {
    // SetNewchannels(_.find(channels, { type: 'Tv' }));
    SetNewchannels(
      channels
        .filter(obj => {
          return obj.type === 'Tv';
        })
        .sort(function (a, b) {
          if (a.name < b.name) {
            return -1;
          }
          if (a.name > b.name) {
            return 1;
          }
          return 0;
        })
    );
  }, [channels]);
  return (
    <div className="awareness-wrapper">
      <div className={`channel-wrapper ${visibleChannel}`}>
        <Channels data={Newchannels} showDrawer={showDrawer} />
      </div>
      <div className={`left-drawer-wrapper-breakingnewsT ${visibleT}`}>
        <Ticker channelDataShot={channelDataTicker}></Ticker>
      </div>
      <div className={`left-drawer-wrapper-breakingnews ${visibleB}`}>
        <BreakingNews channelDataShot={channelDataShot}></BreakingNews>
      </div>
      <div className={`left-drawer-wrapper-content ${visibleC}`}>
        <ContentExport
          programInfo={contentInfo?.programData}
          channel={channel}
          refresh={refresh}
          programTypes={programTypes}
          hosts={hosts}
          programNames={programNames}
          process={process}
          setProcess={setProcess}
          handleSubmit={handleExportSubmit}
          transcriptionFlag={transcriptionFlag}
          settranscriptionFlag={settranscriptionFlag}
          setContentInfo={setContentInfo}
        ></ContentExport>
      </div>

      <div
        style={{
          height: '87vh',

          overflow: 'scroll',
          padding: '12px',
        }}
        className={
          rightDrawer
            ? rightDrawer
              ? 'right-drawer-open'
              : 'right-drawer-close'
            : visibleChannel != 'inactive' && selectedChannelWindows.length > 1
            ? 'left-drawer-open  right-drawer-open'
            : 'right-drawer-close '
        }
      >
        <div>
          <div>
            {selectedChannelWindows.length <= 1 ? (
              <Row style={{}}>
                {selectedChannelWindows.map((ch, index) => {
                  return (
                    <React.Fragment key={ch.id}>
                      {index % 2 === 0 ? <Col span={1} /> : null}
                      <Col
                        style={{ paddingLeft: '0px', marginTop: '1rem' }}
                        span={17}
                        key={ch.id}
                        className="ant-last-col animate__animated animate__slideInLeft abc"
                      >
                        <ChannelWindow
                          key={ch.id}
                          id={ch.id}
                          name={ch.name}
                          icon={ch.logoPath}
                          windowIndex={index}
                          onEditClip={onEditClip}
                          ControlMute={{
                            Muteflag: index ? true : false,
                            Count: index === 1 ? 1 : 0,
                          }}
                          setvisibleT={setvisibleT}
                          setVisibleB={setVisibleB}
                          setVisibleC={setVisibleC}
                          setVisibleF={setVisibleF}
                          setVisibleTw={setVisibleTw}
                          setVisibleY={setVisibleY}
                          setVisibleW={setVisibleW}
                          setvisibleChannel={setvisibleChannel}
                          drawerFlag={drawerFlag}
                          height={true}
                          style={{}}
                        />
                      </Col>
                    </React.Fragment>
                  );
                })}
              </Row>
            ) : (
              <Row
                gutter={
                  drawerFlag
                    ? [
                        { xs: 16, sm: 32, md: 32, lg: 32 },
                        { xs: 16, sm: 32, md: 32, lg: 60 },
                      ]
                    : [
                        { xs: 8, sm: 16, md: 16, lg: 48 },
                        { xs: 8, sm: 16, md: 16, lg: 32 },
                      ]
                }
              >
                {selectedChannelWindows.map((ch, index) => {
                  return (
                    <React.Fragment key={ch.id}>
                      {index % 2 === 0 ? <Col span={1} /> : null}
                      <Col
                        style={{ paddingLeft: '0px', marginTop: '1rem' }}
                        span={11}
                        key={ch.id}
                        className="ant-last-col animate__animated animate__slideInLeft "
                      >
                        <ChannelWindow
                          key={ch.id}
                          id={ch.id}
                          name={ch.name}
                          icon={ch.logoPath}
                          windowIndex={index}
                          onEditClip={onEditClip}
                          ControlMute={{
                            Muteflag: index ? true : false,
                            Count: index === 1 ? 1 : 0,
                          }}
                          setvisibleT={setvisibleT}
                          setVisibleB={setVisibleB}
                          setVisibleC={setVisibleC}
                          setVisibleF={setVisibleF}
                          setVisibleTw={setVisibleTw}
                          setVisibleY={setVisibleY}
                          setVisibleW={setVisibleW}
                          setvisibleChannel={setvisibleChannel}
                          drawerFlag={drawerFlag}
                          height={false}
                        />
                      </Col>
                      {index % 2 !== 0 ? <Col span={1} /> : null}
                    </React.Fragment>
                  );
                })}
              </Row>
            )}
          </div>
        </div>
        {/* <div style={{ width: '90%', margin: '0 5%' }}>
          <Tabs
            type="card"
            tabPanes={[
              {
                title: 'Awareness',
                content: (
                  <div style={{ height: '77vh', overflow: 'auto' }}>
                    <div style={{ height: '95vh' }}>
                      {selectedChannelWindows.length <= 1 ? (
                        <Row style={{}}>
                          {selectedChannelWindows.map((ch, index) => {
                            return (
                              <React.Fragment key={ch.id}>
                                {index % 2 === 0 ? <Col span={1} /> : null}
                                <Col
                                  style={{ paddingLeft: '0px', marginTop: '1rem' }}
                                  span={17}
                                  key={ch.id}
                                  className="ant-last-col animate__animated animate__slideInLeft abc"
                                >
                                  <ChannelWindow
                                    key={ch.id}
                                    id={ch.id}
                                    name={ch.name}
                                    icon={ch.logoPath}
                                    windowIndex={index}
                                    onEditClip={onEditClip}
                                    ControlMute={{
                                      Muteflag: index ? true : false,
                                      Count: index === 1 ? 1 : 0,
                                    }}
                                    setvisibleT={setvisibleT}
                                    setVisibleB={setVisibleB}
                                    setVisibleC={setVisibleC}
                                    setvisibleChannel={setvisibleChannel}
                                    drawerFlag={drawerFlag}
                                    height={true}
                                    style={{}}
                                  />
                                </Col>
                              </React.Fragment>
                            );
                          })}
                        </Row>
                      ) : (
                        <Row
                          gutter={
                            drawerFlag
                              ? [
                                  { xs: 16, sm: 32, md: 32, lg: 32 },
                                  { xs: 16, sm: 32, md: 32, lg: 60 },
                                ]
                              : [
                                  { xs: 8, sm: 16, md: 16, lg: 48 },
                                  { xs: 8, sm: 16, md: 16, lg: 32 },
                                ]
                          }
                        >
                          {selectedChannelWindows.map((ch, index) => {
                            return (
                              <React.Fragment key={ch.id}>
                                {index % 2 === 0 ? <Col span={1} /> : null}
                                <Col
                                  style={{ paddingLeft: '0px', marginTop: '1rem' }}
                                  span={11}
                                  key={ch.id}
                                  className="ant-last-col animate__animated animate__slideInLeft "
                                >
                                  <ChannelWindow
                                    key={ch.id}
                                    id={ch.id}
                                    name={ch.name}
                                    icon={ch.logoPath}
                                    windowIndex={index}
                                    onEditClip={onEditClip}
                                    ControlMute={{
                                      Muteflag: index ? true : false,
                                      Count: index === 1 ? 1 : 0,
                                    }}
                                    setvisibleT={setvisibleT}
                                    setVisibleB={setVisibleB}
                                    setVisibleC={setVisibleC}
                                    setvisibleChannel={setvisibleChannel}
                                    drawerFlag={drawerFlag}
                                    height={false}
                                  />
                                </Col>
                                {index % 2 !== 0 ? <Col span={1} /> : null}
                              </React.Fragment>
                            );
                          })}
                        </Row>
                      )}
                    </div>
                  </div>
                ),
              },
              {
                title: 'Ticker Library',
                content: <TickerLibrary></TickerLibrary>,
              },
              { title: 'Screen Library', content: <ScreenLibrary></ScreenLibrary> },
              { title: 'Clip Library', content: <ClipLibrary></ClipLibrary> },
            ]}
          />
        </div> */}
      </div>
      <div className="channel-drawer-button-main">
        <div className="channel-drawer-button-left">
          <Space>
            <div
              // onMouseLeave={() => setvisibleChannel('inactive')}
              // onMouseEnter={() => setvisibleChannel('')}
              className="channel-drawer-button-wrapper"
              style={{ display: 'flex', flexDirection: 'column' }}
            >
              <div style={{ height: '70px' }} onClick={() => showDrawer('channel')}>
                <MenuAlt
                  style={{
                    width: '3rem',
                    height: '3rem',
                    // fontSize: '2rem',
                    marginTop: '1rem',
                    marginLeft: '12px',
                    marginBottom: '2rem',
                  }}
                ></MenuAlt>
                {/* <MenuOutlined
                  style={{
                    fontSize: '1.5rem',
                    marginTop: '1.45rem',
                    marginLeft: '18px',
                    marginBottom: '2rem',
                  }}
                />
                <RightOutlined
                  style={{ fontSize: '1.5rem', marginTop: '1.45rem', marginBottom: '2rem' }}
                /> */}
              </div>
              <div style={{ maxHeight: '90%', overflow: 'auto' }}>
                {Newchannels.map(c => (
                  <Image
                    style={{
                      //  marginLeft: '5px',
                      marginTop: '10px',
                      // marginBottom: '10px',
                      cursor: 'pointer',
                      //margin:'10px',
                      // padding: '14px',
                      paddingLeft: '14px',
                      paddingRight: '14px',
                      paddingBottom: '8px',
                      paddingTop: '8px',
                      marginHorizontal: 10,
                      //  backgroundColor:'grey'
                    }}
                    src={c.logoPath}
                    width={70}
                    height={60}
                    fallback="placeholder.png"
                    preview={false}
                    onClick={() => {
                      if (selectedWindowsAWARENESS.length < CONFIG.MULTIVIEW.MAX_WINDOWS) {
                        console.log(c);
                        dispatch(addWindowAwareness({ ...c, id: uuid() }));
                        dispatch({ type: 'CHANNEL_NAME', payload: c.actusId });
                      } else {
                        antMessage.warning(MAXIMUM_WINDOWS_ACTIVE);
                      }
                    }}
                  ></Image>
                ))}
              </div>
            </div>
          </Space>
        </div>
        <div className="channel-drawer-button-right">
          <Space>
            <div className="drawer-button-wrapper">
              <div
                onClick={() => showDrawer('T')}
                className="right-drawer-buttons"
                style={{
                  backgroundColor: '#5077DB',
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}
              >
                <LeftOutlined
                  style={{
                    fontWeight: '500px',
                    fontSize: '1rem',
                    marginLeft: '2px',
                    // marginTop: '2px',
                  }}
                />{' '}
                <span className="draw-text-style">Ticker</span>
              </div>
              <div
                onClick={() => showDrawer('B')}
                className="right-drawer-buttons"
                style={{
                  backgroundColor: '#FF566B',
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}
              >
                <LeftOutlined
                  style={{
                    fontWeight: '500px',
                    fontSize: '1rem',
                    marginLeft: '2px',
                    // marginTop: '2px',
                  }}
                />{' '}
                <span className="draw-text-style">Screen</span>
              </div>

              <div
                onClick={() => showDrawer('C')}
                className="right-drawer-buttons"
                style={{
                  backgroundColor: '#A86CE4',
                  display: 'flex',
                  justifyContent: 'flex-start',
                  alignItems: 'center',
                }}
              >
                <LeftOutlined style={{ fontSize: '1rem', marginLeft: '2px' }} />{' '}
                <div className="draw-text-style">Clip</div>
              </div>
            </div>
          </Space>
        </div>
      </div>
    </div>
  );
}

export default Awareness;
