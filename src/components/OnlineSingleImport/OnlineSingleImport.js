import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Prompt } from 'react-router-dom';

import moment from 'moment';
import { useHotkeys } from 'react-hotkeys-hook';
import { Row, Col, Image } from 'antd';
import { cloneDeep, pick } from 'lodash';
import { message as antMessage } from 'antd';
import {
  Tabs,
  Button,
  PageNavigation,
  VideoPlayer,
  Statement,
  LoadingPage,
  UploadFile,
} from 'components/Common';
import { DEFAULT_SEGMENT, SEGMENT_COLORS } from 'constants/options';
import { markerEditActions } from 'modules/markerEdit/actions';
import { USERS_BASE_URL } from 'constants/config';
import navActions from 'modules/navigation/actions';
import commonActions from 'modules/common/actions';
import programNamesActions from 'modules/programNames/actions';
import programTypesActions from 'modules/programTypes/actions';
import guestsActions from 'modules/guests/actions';
import hostsActions from 'modules/hosts/actions';
import { SegmentTrendAndAssessment } from '../LiveClipping/components/MediaAnalysis/components';
import ProgramInformation from './components/ProgramInformation/ProgramInformation';
// import './MarkerEdit.scss';
import { SAVE } from 'constants/hotkeys';
import {
  makeTextFrom,
  calculateWidth,
  modifySeg,
  modifyAllSeg,
  formatDate,
} from 'modules/common/utils';

function OnlineSingleImport({ history, match: { params } }) {
  const dispatch = useDispatch();
  const nextPageProps = useSelector(state => state.pageNavReducer);
  const [markers, setMarkers] = useState([]);
  const [disable, setDisable] = useState(true);
  const [currentIndex, setCurrentIndex] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isFilePicked, setIsFilePicked] = useState(false);
  const [videoURL, setVideoURL] = useState(null);
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

  const [channelInfo, setChannelInfo] = useState({ channelName: '', channelLogoPath: '' });
  const [disableField, setDisableField] = useState(false);

  const job = useSelector(state => state.markerEditReducer);
  const { loading } = useSelector(state => state.markerEditReducer);
  const guests = useSelector(state => state.markerEditReducer.guests);
  const { videoCurrentTime, videoDuration } = useSelector(state => state.commonReducer);

  const onFileChange = info => {
    let URL = window.URL || window.webkitURL;
    let src = URL.createObjectURL(info.file.originFileObj);
    setVideoURL(src);
    setSelectedFile(info.file.originFileObj);
    setIsFilePicked(true);
  };

  const initBeforeUnLoad = showExitPrompt => {
    window.onbeforeunload = event => {
      if (showExitPrompt) {
        const e = event || window.event;
        e.preventDefault();
        if (e) {
          e.returnValue = '';
        }
        window.history.pushState({}, '', '/#/onlineSinlgeImport');
        return '';
      }
    };
  };
  const data = pick(job, [
    'guests',
    'segments',
    'translation',
    'programDescription',
    'comments',
    'clippedBy',
    // 'channel',
    'clippedBy',
    // 'segmentTime',
    'programName',
    'programType',
    // 'programDate',
    // 'programTime',
    'thumbnailPath',
    // 'channelLogoPath',
    // 'videoPath',
    'anchor',
    'region',
    'priority',
    'language',
  ]);
  const programInfo = pick(job, [
    'channel',
    'clippedBy',
    'programName',
    'programType',
    'programDate',
    'programTime',
    'thumbnailPath',
    'channelLogoPath',
    'segmentTime',
    'videoPath',
    'anchor',
    'guests',
    'region',
    'priority',
    'language',
  ]);

  useEffect(() => {
    fetchDefaultConfigurations();
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

  useEffect(() => {
    let segments = [...job.segments];
    if (segments.length > 1) return;
    if (segments[0].time !== videoDuration) {
      segments[0].time = videoDuration;
      dispatch(
        markerEditActions.updateByField({
          field: 'segments',
          value: segments,
        })
      );
    }
  }, [videoDuration, job.segments, loading]);
  useEffect(() => {
    let segments = [...job.segments];
    let prevTotal = 0;
    let _markers = segments.map(segment => {
      let currentWidth = calculateWidth({ currentTime: segment.time, duration: videoDuration });
      const actualWidth = currentWidth - prevTotal;
      prevTotal += actualWidth;
      return {
        width: actualWidth,
        color: segment.color,
        duration: segment.time,
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
    dispatch(programNamesActions.getProgramNames.request());
    dispatch(programTypesActions.getProgramTypes.request());
    dispatch(guestsActions.getGuests.request());
    dispatch(hostsActions.getHosts.request());
    dispatch(commonActions.fetchHashtags.request());
    dispatch(commonActions.fetchTopics.request());
  };
  const refresh = useCallback(() => {
    fetchDefaultConfigurations();
    antMessage.success('Refreshed', 2);
  });
  const addSegment = () => {
    dispatch(
      markerEditActions.updateByField({
        field: 'segments',
        value: [
          {
            ...modifySeg({ ...cloneDeep(DEFAULT_SEGMENT) }, guests),
            time: videoCurrentTime,
            color: SEGMENT_COLORS[(job.segments.length + 1) % 10],
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
    let _currentTime = currentTime === +999 ? playerCurrentPosition : currentTime;
    if (_currentTime < 0) _currentTime = 0;
    if (_currentTime > videoDuration) _currentTime = videoDuration - 1;
    let segments = [...job.segments];
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
  // Function to segment
  //////////////////////////////////
  const deleteSegment = index => {
    let segments = [...job.segments];
    if (index === 0 && segments.length === 1) return;
    let _segments = segments;
    _segments.splice(index, 1);
    updateMarkers(_segments);
  };
  // const handleSubmit = () => {
  //   let check = true;
  //   data.segments.forEach((segment, i) => {
  //     if (i === data.segments.length - 1) return;
  //     if (
  //       !segment.topics.topic1 ||
  //       !segment.topics.topic2.length ||
  //       !segment.topics.topic3.length
  //     ) {
  //       check = false;
  //     }
  //   });
  //   if (check) {
  //     dispatch(
  //       markerEditActions.updateMarker.request({
  //         id: params.jobId,
  //         data: { ...data, type: 'save' },
  //       })
  //     );
  //   } else {
  //     antMessage.error('Topics are required on each segment.');
  //   }
  // };

  if (programInfo?.channelLogoPath != undefined) {
    const searchLogoPath = programInfo?.channelLogoPath.search('logoPath');
    const logoPath = programInfo?.channelLogoPath.slice(searchLogoPath);
    programInfo.channelLogoPath = logoPath;
  }

  var handleSubmit = index => {
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
    const parts = createParts(segments, 0, _from).filter(segment => segment.active == true);
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
    if (check) {
      data = { ...data, guests: guest };
      dispatch(liveClippingActions.createJob.request(data));
    } else {
      antMessage.error(errMsg, 2);
    }
  };
  return (
    <div>
      <div className="marker-edit-wrapper">
        <Row gutter={16}>
          <Col
            span="7"
            style={{
              height: '89vh',
              padding: '10px 10px 0px 0px',
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
          >
            <Row>
              <Col span={24} style={{ marginBottom: '30px' }}>
                {programInfo?.videoPath?.includes('.mp4') || isFilePicked ? (
                  <div>
                    {' '}
                    <VideoPlayer
                      src={videoURL}
                      programInfo={{
                        ...addProgramInfo,
                        programTime: `${addProgramInfo.fromTime} to ${addProgramInfo.toTime}`,
                      }}
                      variant="secondary"
                      markers={markers}
                      addMarker={addSegment}
                      resetSegmentTime={resetSegmentTime}
                      deleteSegment={deleteSegment}
                      isMarker={true}
                      style={{ maxHeight: '350px' }}
                      showTimeline
                    />
                  </div>
                ) : (
                  <div style={{ marginTop: '5%' }}>
                    <div className="container " style={{ width: '30vw', height: '30vh' }}>
                      <UploadFile onChange={onFileChange} />
                    </div>
                  </div>
                )}
              </Col>
              <Col span={24}>
                <ProgramInformation
                  programInfo={addProgramInfo}
                  setProgramInfo={setAddProgramInfo}
                  channelInfo={channelInfo}
                  disableField={disableField}
                  setDisableField={setDisableField}
                  videoURL={videoURL}
                />
              </Col>
            </Row>
          </Col>
          <Col span="17" style={{ height: '89vh', overflow: 'hidden' }}>
            <SegmentTrendAndAssessment
              // handleUpdate={handleSubmit}
              handleSubmit={handleSubmit}
              // startTime={startTime}
              // disableField={disableField}
              refreshMetaData={refresh}
              jobID={job.id}
            />
          </Col>
        </Row>
      </div>
      <Prompt
        when={true}
        message={'You will lose the unsaved changes if you switch the page. Are you sure?'}
      />
    </div>
  );
}
export default OnlineSingleImport;
