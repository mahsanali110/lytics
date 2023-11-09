import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHotkeys } from 'react-hotkeys-hook';
import { Prompt } from 'react-router-dom';
import { Row, Col, Space, Image } from 'antd';
import { cloneDeep, pick } from 'lodash';
import { jobActions } from 'modules/jobs/actions';
import { liveClippingActions } from 'modules/LiveClipping/actions';
import { message as antMessage } from 'antd';
import Channels from './Channels';
import ChannelWindow from './ChannelWindow';
import channelActions from 'modules/channels/actions';
import commonActions from 'modules/common/actions';
import { MenuOutlined, RightOutlined, LeftOutlined } from '@ant-design/icons';
import PlayerControls from './PlayerControls/PlayerControls';
import { TIME_OPTIONS } from 'constants/options';
import {
  createParts,
  getUser,
  formatDate,
  timeDifference,
  createThumbnail,
  isEmpty,
  createSegmentThumbnail,
} from 'modules/common/utils';
import {
  Tabs,
  Button,
  PageNavigation,
  VideoPlayer,
  Statement,
  LoadingPage,
} from 'components/Common';
import { MediaAnalysis, GuestAnalysis } from './components';
import { DEFAULT_SEGMENT, SEGMENT_COLORS, CLIPPER_SEGMENT_COLORS } from 'constants/options';
import { ACTUS_PATH, ACTUS_CHANNELS_API_PATH } from 'constants/index';

import {
  ProgramInformation,
  SegmentTrendAndAssessment,
} from './components/MediaAnalysis/components';

import { markerEditActions } from 'modules/markerEdit/actions';

import navActions from 'modules/navigation/actions';
import { v1 as uuid } from 'uuid';
import useConfirm from 'hooks/useConfirm';
import { MenuAlt } from 'assets/icons';

import './LiveClipping.scss';
import { SAVE } from 'constants/hotkeys';
import { makeTextFrom, calculateWidth, modifySeg, modifyAllSeg } from 'modules/common/utils';
import { ANT_MARK } from 'antd/lib/locale-provider';
import { height } from 'dom-helpers';
import moment from 'moment';
import channelsActions from 'modules/channels/actions';

import programNamesActions from 'modules/programNames/actions';
import programTypesActions from 'modules/programTypes/actions';
import guestsActions from 'modules/guests/actions';
import hostsActions from 'modules/hosts/actions';
import axios from 'axios';
import { channelActions as CA } from '../../modules/multiview/actions';
import { networkError, errorCount, errorDelay } from 'constants/config/errorLoader';

const { addWindow } = liveClippingActions;
// var jobIds = [];
const LiveClipping = ({ history, match: { params } }) => {
  const dispatch = useDispatch();
  const { channels } = useSelector(state => state.channelsReducer);
  const { progDate } = useSelector(state => state.liveClippingReducer);
  const [visibleChannel, setvisibleChannel] = useState('inactive');
  const [channelInfo, setChannelInfo] = useState({ channelName: '', channelLogoPath: '' });
  const nextPageProps = useSelector(state => state.pageNavReducer);
  const [markers, setMarkers] = useState([]);
  const [disable, setDisable] = useState(true);
  const [currentIndex, setCurrentIndex] = useState('');
  const [videoDuration, setVideoDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [disableField, setDisableField] = useState(false);
  const [selectedChannel, setSelectedChannel] = useState([]);
  const [processExport, setProcessExport] = useState({
    comments: '',
    programDescription: '',
    output: {
      programType: '',
      format: '',
      frameSizePixel: '',
      frameSize: '',
    },
  });
  // const [segments, setSegments] = useState([cloneDeep(DEFAULT_SEGMENT)]);
  const [len, setLen] = useState('');
  const { index, next, prev } = nextPageProps.job?.nav ?? {};
  const [Newchannels, SetNewchannels] = useState([]);

  // New Async States
  const [themesCount, setThemesCount] = useState(1);
  const [topicsCount, setTopicsCount] = useState(1);
  const [hashtagsCount, setHashtagsCount] = useState(1);
  // New Async States

  const job = useSelector(state => state.markerEditReducer);
  const { loading } = useSelector(state => state.markerEditReducer);
  const guests = useSelector(state => state.markerEditReducer.guests);
  const selectedChannelWindows = useSelector(state => state.liveClippingReducer.selectedWindows);
  const activeWindows = useSelector(state => state.liveClippingReducer.selectedWindows);
  const { themeError, topicsError, hashtagsError } = useSelector(state => state.commonReducer);
  const { confirm } = useConfirm();

  const fetchData = useCallback(() => {
    dispatch(programNamesActions.getProgramNames.request());
    dispatch(programTypesActions.getProgramTypes.request());
    dispatch(guestsActions.getGuests.request());
    dispatch(hostsActions.getHosts.request());
    dispatch(commonActions.fetchHashtags.request());
    dispatch(commonActions.fetchTopics.request());
  });

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

  const refresh = useCallback(() => {
    fetchData();
    antMessage.success('Refreshed', 2);
  });

  const resetProgramData = useCallback(() => {
    setChannelInfo({ channelName: '', channelLogoPath: '' });
    setAddProgramInfo({
      fromTime: moment(`${moment().format('HH')}:00`, 'HH:mm'),
      toTime: moment(`${moment().add(1, 'hour').format('HH')}:00`, 'HH:mm'),
      programName: '',
      programType: '',
      anchor: [],
      priority: '',
      guest: [],
      language: '',
      region: '',
    });
    setDisableField(false);
    dispatch(
      markerEditActions.updateByField({
        field: 'segments',
        value: [cloneDeep(DEFAULT_SEGMENT)],
      })
    );
  }, []);
  useEffect(() => {
    setSelectedChannel(selectedChannelWindows);
  }, [selectedChannelWindows]);
  // useEffect(() => {
  //   if(job.segments.length > 1){
  //     dispatch(
  //       markerEditActions.updateByField({
  //         field: 'segments',
  //         value: [
  //           ...modifyAllSeg([...job.segments], guests)
  //         ].sort((a, b) => {
  //           if (a.time > b.time) return 1;
  //           if (a.time < b.time) return -1;

  //           return 0;
  //         }),
  //       })
  //     );
  //     // console.log(...modifyAllSeg([...job.segments], guests))
  //   }

  // },[guests.length])

  // const { videoCurrentTime, videoDuration } = useSelector(state => state.commonReducer);
  // useEffect(()=>{

  // },[channelInfo])
  const data = pick(job, [
    'guests',
    'themes',
    'segments',
    'translation',
    'programDescription',
    'comments',
    'clippedBy',
  ]);

  const programInfo = pick(job, [
    'channel',
    'clippedBy',
    'programName',
    'programDate',
    'programTime',
    'thumbnailPath',
    'channelLogoPath',
    'videoPath',
  ]);
  const [addProgramInfo, setAddProgramInfo] = useState({
    fromTime: moment(`${moment().format('HH')}:00`, 'HH:mm'),
    toTime: moment(`${moment().add(1, 'hour').format('HH')}:00`, 'HH:mm'),
    programName: '',
    programType: '',
    anchor: [],
    priority: '',
    guest: [],
    language: '',
    region: '',
  });
  const initBeforeUnLoad = showExitPrompt => {
    window.onbeforeunload = event => {
      if (showExitPrompt) {
        const e = event || window.event;
        e.preventDefault();
        if (e) {
          e.returnValue = '';
        }
        window.history.pushState({}, '', '/#/liveClipping');
        return '';
      }
    };
  };

  useEffect(() => {
    fetchDefaultConfigurations();
    dispatch(channelsActions.getChannels.request());
    window.onload = function () {
      initBeforeUnLoad(true);
    };
    return () => {
      dispatch(
        markerEditActions.updateByField({
          field: 'segments',
          value: [cloneDeep(DEFAULT_SEGMENT)],
        })
      );
    };
  }, []);

  // useEffect(() => {
  //   dispatch(markerEditActions.getDataById.request(params.jobId));
  // }, [params.jobId]);
  useEffect(() => {
    // if (loading === false) {
    let segments = job.segments;
    if (segments.length > 1) return;
    if (segments[0].time === 0 || segments[0].time !== videoDuration) {
      segments[0].time = videoDuration;

      dispatch(
        markerEditActions.updateByField({
          field: 'segments',
          value: segments,
        })
      );
    }
    // }
  }, [videoDuration, job.segments]);
  useEffect(() => {
    let prevTotal = 0;

    let _markers = job.segments.map(segment => {
      let currentWidth = calculateWidth({ currentTime: segment.time, duration: videoDuration });

      const actualWidth = currentWidth - prevTotal;

      prevTotal += actualWidth;

      return {
        width: actualWidth,
        color: segment.color,
        duration: segment.time,
        active: segment.active,
        dragging: segment.dragging,
      };
    });
    setMarkers([..._markers]);
  }, [job.segments, videoDuration]);

  const fetchDefaultConfigurations = () => {
    dispatch(commonActions.fetchHosts.request());
    dispatch(commonActions.fetchThemes.request());
    dispatch(commonActions.fetchTopics.request());
    dispatch(commonActions.fetchGuests.request());
    dispatch(commonActions.fetchHashtags.request());
  };

  useEffect(() => {
    if (themeError || themeError === networkError) {
      setThemesCount(prevCount => prevCount + 1);
      if (themesCount <= errorCount) {
        setTimeout(() => {
          dispatch(commonActions.fetchThemes.request());
        }, errorDelay);
      } else if (themeError === networkError) {
        alert(`${themeError}, Please refresh!`);
        window.location.reload();
      } else if (themeError !== networkError) {
        alert(`${themeError}, Please refresh!`);
        window.location.reload();
      }
    }
  }, [themeError]);
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
    if (hashtagsError || hashtagsError === networkError) {
      setHashtagsCount(prevCount => prevCount + 1);
      if (hashtagsCount <= errorCount) {
        setTimeout(() => {
          dispatch(commonActions.fetchHashtags.request());
        }, errorDelay);
      } else if (hashtagsError === networkError) {
        alert(`${hashtagsError}, Please refresh!`);
        window.location.reload();
      } else if (hashtagsError !== networkError) {
        alert(`${hashtagsError}, Please refresh!`);
        window.location.reload();
      }
    }
  }, [hashtagsError]);

  const showDrawer = type => {
    if (type === 'channel') {
      if (visibleChannel === 'inactive') {
        setvisibleChannel('');
      } else {
        setvisibleChannel('inactive');
      }
    }
  };

  const addSegment = videoCurrentTime => {
    dispatch(
      markerEditActions.updateByField({
        field: 'segments',
        value: [
          {
            ...modifySeg({ ...cloneDeep(DEFAULT_SEGMENT) }, guests),
            time: videoCurrentTime,
            color: SEGMENT_COLORS[(job.segments.length + 1) % 10],
            thumbnail: [
              {
                url: createSegmentThumbnail(
                  job.segments,
                  videoCurrentTime,
                  startTime,
                  channelInfo.channelName
                ),
              },
            ],
          },
          ...job.segments,
        ].sort((a, b) => {
          if (a.time > b.time) return 1;
          if (a.time < b.time) return -1;

          return 0;
        }),
      })
    );
  };

  const updateMarkers = updatedMarkers => {
    dispatch(
      markerEditActions.updateByField({
        field: 'segments',
        value: [...updatedMarkers].sort((a, b) => {
          if (a.time > b.time) return 1;
          if (a.time < b.time) return -1;

          return 0;
        }),
      })
    );
  };
  //////////////////////////////////
  // Function to update segment time
  //////////////////////////////////
  const resetSegmentTime = (currentTime, index) => {
    let _currentTime = currentTime;
    if (_currentTime < 0) _currentTime = 0;
    if (_currentTime > videoDuration) _currentTime = videoDuration - 1;
    let segments = [...job.segments];
    if (index > 0) {
      if (!segments[index - 1]?.dragging && _currentTime < segments[index - 1]?.time)
        return antMessage.error('Cannot mutate the boundary of processed segment', 2);
    }

    let _segments = segments.map((segment, i) => {
      if (index === i) {
        segment.time = _currentTime !== undefined ? _currentTime : segment.time;
      }
      return segment;
    });
    let sortedSegments = [..._segments].sort((a, b) => {
      if (a.time > b.time) return 1;
      if (a.time < b.time) return -1;

      return 0;
    });

    updateMarkers(sortedSegments);
  };

  //////////////////////////////////
  // Function to delete segment
  //////////////////////////////////

  const deleteSegment = index => {
    let segments = [...job.segments];
    if (index === 0 && segments.length === 1) return;
    let _segments = segments;
    _segments.splice(index, 1);
    updateMarkers(_segments);
  };

  //////////////////////////////////
  // Function to disable segment
  //////////////////////////////////

  const handleTimelineClick = (time, index) => {
    let segments = [...job.segments];
    if (index === segments.length - 1) return;
    if (!segments[index].dragging) return antMessage.error(`Can't disable processed segment`);
    const colors = {
      true: SEGMENT_COLORS[(index + 2) % 10],
      false: CLIPPER_SEGMENT_COLORS[1],
    };
    let updatedSegments = segments.map(segment => {
      return segment.time === time
        ? { ...segment, active: !segment.active, color: colors[!segment.active] }
        : segment;
    });
    updateMarkers(updatedSegments);
  };

  //////////////////////////////////
  // Function to reset time of all segments
  //////////////////////////////////

  const resetAllSegmentsTime = () => {
    let segments = [...job.segments];
    let updatedSegments = segments.map((segment, index) => {
      if (index === segments.length - 1) {
        segment.time = segment.time + TIME_OPTIONS.live * 60;
      }
      return segment;
    });
    updateMarkers(updatedSegments);
  };

  const handleSubmit = index => {
    let guest = [];
    if (addProgramInfo.guest.length > 0) {
      addProgramInfo.guest.forEach(g => {
        guest.push({
          name: g.split('|')[0],
          association: g.split('|')[1],
          description: g.split('|')[2],
        });
      });
    }
    let segments = [job.segments[index]];
    let thumbnail = job.segments[index].thumbnail;

    for (var i = index + 1; i < job.segments.length; i++) {
      if (job.segments[i].merge || !job.segments[i].active) {
        segments.push(job.segments[i]);
      } else break;
    }
    let _from = index ? job.segments[index - 1].time : 0;
    const parts = createParts(segments, startTime, _from).filter(segment => segment.active == true);
    const { firstName, lastName } = getUser();
    /// for joining two variables in an array
    const clippedBy = [firstName, lastName].join(' ');
    let data = {
      jobIndex: index,
      contentSeg: true,
      parentId: addProgramInfo.programId,
      channel: channelInfo.channelName,
      channelLogoPath: channelInfo.channelLogoPath,
      // guests: guest,
      thumbnailPath: thumbnail,
      programTime: [
        formatDate(addProgramInfo.fromTime, 'hh:mmA'),
        formatDate(addProgramInfo.toTime, 'hh:mmA'),
      ].join(' to '),
      programStartTime: formatDate(addProgramInfo.fromTime, 'HH:mm'),
      programEndTime: formatDate(addProgramInfo.toTime, 'HH:mm'),
      segmentTime: [
        formatDate(parts[0].from, 'hh:mmA'),
        formatDate(parts[parts.length - 1].to, 'hh:mmA'),
      ].join('to'),
      segmentStartTime: formatDate(parts[0].from, 'DD/MM/YYYY HH:mm:ss'),
      segmentEndTime: formatDate(parts[parts.length - 1].to, 'DD/MM/YYYY HH:mm:ss'),
      segmentDuration: timeDifference(parts[0].from, parts[parts.length - 1].to, 'seconds'),
      programName: addProgramInfo.programName,
      programType: addProgramInfo.programType,
      programDate: moment(progDate).format('DD/MM/YYYY'),
      anchor: addProgramInfo.anchor,
      priority: addProgramInfo.priority,
      language: addProgramInfo.language,
      region: addProgramInfo.region,
      actusRequest: {
        from: parts[0].from,
        to: parts[parts.length - 1].to,
        parts,
      },
      clippedBy,
      segments: [job.segments[index]],
      ...processExport,
    };
    let check = true;
    let errMsg;
    if (
      !job.segments[index].topics.topic1 ||
      !job.segments[index].topics.topic2.length ||
      !job.segments[index].topics.topic3.length
    ) {
      check = false;
      errMsg = 'Topics are required on each segment.';
    } else {
      Object.keys(addProgramInfo).map(key => {
        if (key == 'guest' || key == 'anchor') return;
        if (isEmpty(addProgramInfo[key])) {
          check = false;
          errMsg = `All fields of program information are required`;
        }
      });
    }
    // if (moment(data.actusRequest.from) > moment(data.actusRequest.parts[0].from)) {
    //   console.log('time problem');
    //   check = false;
    //   errMsg = `Segment Time should be between program time`;
    // }
    if (check) {
      data = { ...data, guests: guest };
      dispatch(liveClippingActions.createJob.request(data));
    } else {
      antMessage.error(errMsg, 2);
    }
  };

  const handleUpdate = (index, id) => {
    let guest = [];
    if (addProgramInfo.guest.length > 0) {
      addProgramInfo.guest.forEach(g => {
        guest.push({
          name: g.split('|')[0],
          association: g.split('|')[1],
          description: g.split('|')[2],
        });
      });
    }
    let thumbnail = job.segments[index].thumbnail;
    let data = {
      jobIndex: index,
      thumbnailPath: thumbnail,
      // guests: guest,
      segments: [job.segments[index]],
    };
    let check = true;
    let errMsg;
    if (
      !job.segments[index].topics.topic1 ||
      !job.segments[index].topics.topic2.length ||
      !job.segments[index].topics.topic3.length
    ) {
      check = false;
      errMsg = 'Topics are required on each segment.';
    } else {
      Object.keys(addProgramInfo).map(key => {
        if (key == 'guest' || key == 'anchor') return;
        if (isEmpty(addProgramInfo[key])) {
          check = false;
          errMsg = `All fields of program information are required`;
        }
      });
    }
    if (check) {
      data = { ...data, guests: guest };
      if (!data?.thumbnailPath?.length) {
        antMessage.error('Thumbnail is required');
        return;
      }
      dispatch(liveClippingActions.updateJob.request({ id, data }));
    } else {
      antMessage.error(errMsg, 2);
    }
  };

  useHotkeys(
    SAVE,
    e => {
      e.preventDefault();
      handleSubmit();
    },
    [handleSubmit]
  );
  // const nav = index => {
  //   console.log(jobIds.length);
  //   if (jobIds.length > 0) {
  //     console.log('pagination');
  //     if (index === 'prev') {
  //       let cIndex = currentIndex - 1;
  //       setCurrentIndex(cIndex);
  //       let current_video = jobIds[cIndex];
  //       window.location.href = `/#/marker-edit/${current_video}`;
  //       // location.reload();
  //     }
  //     if (index === 'next') {
  //       let cIndex = currentIndex + 1;
  //       setCurrentIndex(cIndex);
  //       let current_video = jobIds[cIndex];
  //       window.location.href = `/#/marker-edit/$LiveClipping{current_video}`;
  //       // location.reload();
  //     }
  //   }
  // };
  useEffect(() => {
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
    <div className="marker-edit-wrapper" style={{ position: 'relative' }}>
      <div
        className="live-wrapper"
        style={{
          position: 'absolute',
          width: visibleChannel == 'inactive' ? '70px' : '350px',
          zIndex: '10000',
          transition: 'width 0.5s ease-in-out',
          top: 0,
          left: 0,
          // overflow: 'hidden',
          scrollbarWidth: 'thin',
        }}
      >
        <div className={`channel-wrapper ${visibleChannel}`}>
          <Channels
            data={Newchannels}
            showDrawer={showDrawer}
            resetProgramData={resetProgramData}
          />
        </div>
        <div className="channel-drawer-button-main">
          <div className="channel-drawer-button-left">
            <Space style={{ display: 'flex', flexDirection: 'column' }}>
              <div
                onClick={() => showDrawer('channel')}
                className="channel-drawer-button-wrapper"
                style={{ height: '70px' }}
              >
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
              <div style={{ maxHeight: '90%', backgroundColor: '#131C3A' }}>
                {Newchannels.map(c => (
                  <Image
                    style={{
                      //  marginLeft: '8px',
                      marginTop: '10px',
                      // marginRight:'15px',
                      // marginBottom: '10px',
                      cursor: 'pointer',
                      //margin:'10px',
                      //  padding:'14px',
                      paddingLeft: '14px',
                      paddingRight: '14px',
                      paddingBottom: '8px',
                      paddingTop: '8px',
                      marginHorizontal: 10,
                      //  backgroundColor:'grey',
                    }}
                    src={c.logoPath}
                    width={70}
                    height={60}
                    preview={false}
                    fallback="placeholder.png"
                    onClick={async () => {
                      if (activeWindows.length && c.name === activeWindows[0].name) {
                        antMessage.info('Selected channel is already live', 2);
                        return;
                      }
                      if (activeWindows.length) {
                        let ifConfirm = await confirm(
                          'You will lose the unsaved changes if you switch the channel. Are you sure?'
                        );
                        if (ifConfirm) {
                          dispatch(
                            markerEditActions.updateByField({
                              field: 'segments',
                              value: [cloneDeep(DEFAULT_SEGMENT)],
                            })
                          );
                          // resetProgramData();
                          dispatch(liveClippingActions.updateStartPro(false));
                          dispatch(liveClippingActions.updateProgDate(moment()));
                          dispatch(addWindow({ ...c, id: uuid() }));
                          setvisibleChannel('inactive');
                          dispatch({ type: 'CHANNEL_NAME', payload: c.actusId });
                        } else {
                          setvisibleChannel('inactive');
                        }
                      } else {
                        // resetProgramData();
                        dispatch(liveClippingActions.updateStartPro(false));
                        dispatch(liveClippingActions.updateProgDate(moment()));
                        dispatch(addWindow({ ...c, id: uuid() }));
                        setvisibleChannel('inactive');
                        dispatch({ type: 'CHANNEL_NAME', payload: c.actusId });
                      }
                    }}
                  ></Image>
                ))}
              </div>
            </Space>
          </div>
        </div>
      </div>
      <Row>
        <Col
          span="9"
          className="remove-scrollbar"
          style={{ height: '89vh', padding: '10px 10px 0px 0px', overflow: 'auto' }}
        >
          <Row style={{ marginBottom: '20px' }}>
            {selectedChannel.length ? (
              selectedChannel.map((ch, index) => {
                return (
                  <Col span="20" offset="3" className="animate__animated animate__slideInLeft">
                    <ChannelWindow
                      key={ch.id}
                      id={ch.id}
                      name={ch.name}
                      icon={ch.logoPath}
                      windowIndex={index}
                      // onEditClip={onEditClip}
                      setVideoDuration={setVideoDuration}
                      addSegment={addSegment}
                      resetSegmentTime={resetSegmentTime}
                      deleteSegment={deleteSegment}
                      handleClick={handleTimelineClick}
                      resetAllSegmentsTime={resetAllSegmentsTime}
                      setStartTime={setStartTime}
                      setChannelInfo={setChannelInfo}
                      markersTimeLine={markers}
                      resetProgramData={resetProgramData}
                      ControlMute={{
                        Muteflag: index ? true : false,
                        Count: index === 1 ? 1 : 0,
                      }}
                    />
                  </Col>
                );
              })
            ) : (
              <Col span="20" offset="3">
                <div className="channel-window-container-content dummy-window">
                  Select any channel from the list
                </div>
              </Col>
            )}
          </Row>
          <Row>
            <Col span="20" offset="3">
              <ProgramInformation
                programInfo={addProgramInfo}
                setProgramInfo={setAddProgramInfo}
                channelInfo={channelInfo}
                disableField={disableField}
                setDisableField={setDisableField}
              />
            </Col>
          </Row>
        </Col>
        <Col span="15" style={{ height: '89vh' }}>
          <SegmentTrendAndAssessment
            programInformation={addProgramInfo}
            handleUpdate={handleUpdate}
            handleSubmit={handleSubmit}
            startTime={startTime}
            disableField={disableField}
            refreshMetaData={refresh}
          />
        </Col>
      </Row>
      <Prompt
        when={true}
        message={'You will lose the unsaved changes if you switch the page. Are you sure?'}
      />
    </div>
  );
};

export default LiveClipping;
