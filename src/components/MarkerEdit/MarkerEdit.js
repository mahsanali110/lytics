import { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHotkeys } from 'react-hotkeys-hook';
import { Row, Col, Image } from 'antd';
import { cloneDeep, pick } from 'lodash';
import { jobActions } from 'modules/jobs/actions';
import { message as antMessage } from 'antd';
import {
  Tabs,
  Button,
  PageNavigation,
  VideoPlayer,
  Statement,
  LoadingPage,
} from 'components/Common';
import { MediaAnalysis, GuestAnalysis } from './components';
import { uploadPath } from 'constants/index';
import { DEFAULT_SEGMENT, SEGMENT_COLORS } from 'constants/options';
import { markerEditActions } from 'modules/markerEdit/actions';
import { USERS_BASE_URL } from 'constants/config';
import navActions from 'modules/navigation/actions';
import commonActions from 'modules/common/actions';
import programNamesActions from 'modules/programNames/actions';
import programTypesActions from 'modules/programTypes/actions';
import guestsActions from 'modules/guests/actions';
import hostsActions from 'modules/hosts/actions';
import {
  ProgramInformation,
  SegmentTrendAndAssessment,
} from './components/MediaAnalysis/components';
import './MarkerEdit.scss';
import { SAVE } from 'constants/hotkeys';
import {
  makeTextFrom,
  calculateWidth,
  modifySeg,
  modifyAllSeg,
  formatDate,
} from 'modules/common/utils';
import { ANT_MARK } from 'antd/lib/locale-provider';
var jobIds = [];
const MarkerEdit = ({ history, match: { params } }) => {
  const dispatch = useDispatch();
  const nextPageProps = useSelector(state => state.pageNavReducer);
  const [markers, setMarkers] = useState([]);
  const [disable, setDisable] = useState(true);
  const [currentIndex, setCurrentIndex] = useState('');
  const [len, setLen] = useState('');
  const { index, next, prev } = nextPageProps.job?.nav ?? {};
  const job = useSelector(state => state.markerEditReducer);
  const { loading } = useSelector(state => state.markerEditReducer);
  const guests = useSelector(state => state.markerEditReducer.guests);
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
  const { videoCurrentTime, videoDuration } = useSelector(state => state.commonReducer);
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
  console.log('hello');
  useEffect(() => {
    let ids = sessionStorage.getItem('job_ids');
    jobIds = ids.split(',');
  }, []);
  useEffect(() => {
    let str = history.location.pathname;
    let get = str.split('/');
    let currentId = get[2];
    setLen(jobIds.length);
    for (var i = 0; i < jobIds.length; i++) {
      if (jobIds[i] === currentId) {
        setCurrentIndex(i);
      }
    }
  }, [jobIds]);
  useEffect(() => {
    fetchDefaultConfigurations();
  }, []);
  useEffect(() => {
    dispatch(markerEditActions.getDataById.request(params.jobId));
  }, [params.jobId]);
  useEffect(() => {
    if (loading === false) {
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
  const handleSubmit = () => {
    let check = true;
    data.segments.forEach((segment, i) => {
      if (i === data.segments.length - 1) return;
      if (
        !segment.topics.topic1 ||
        !segment.topics.topic2.length ||
        !segment.topics.topic3.length
      ) {
        check = false;
      }
    });
    if (check) {
      dispatch(
        markerEditActions.updateMarker.request({
          id: params.jobId,
          data: { ...data, type: 'save' },
        })
      );
    } else {
      antMessage.error('Topics are required on each segment.');
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
  const nav = index => {
    console.log(jobIds.length);
    if (jobIds.length > 0) {
      console.log('pagination');
      if (index === 'prev') {
        let cIndex = currentIndex - 1;
        setCurrentIndex(cIndex);
        let current_video = jobIds[cIndex];
        window.location.href = `/#/marker-edit/${current_video}`;
        // location.reload();
      }
      if (index === 'next') {
        let cIndex = currentIndex + 1;
        setCurrentIndex(cIndex);
        let current_video = jobIds[cIndex];
        window.location.href = `/#/marker-edit/${current_video}`;
        // location.reload();
      }
    }
  };
  if (programInfo?.channelLogoPath != undefined) {
    const searchLogoPath = programInfo?.channelLogoPath.search('logoPath');
    const logoPath = programInfo?.channelLogoPath.slice(searchLogoPath);
    programInfo.channelLogoPath = logoPath;
  }
  return (
    <div>
      {loading === false ? (
        <div className="marker-edit-wrapper">
          <Row gutter={16}>
            <Col
              span="7"
              style={{ height: '89vh', padding: '10px 10px 0px 0px', overflow: 'auto' }}
            >
              <Row>
                <Col span={24} style={{ marginBottom: '30px' }}>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div style={{ marginTop: 10, marginBottom: 17 }}>
                      <Button
                        variant="secondary"
                        onClick={() => nav('prev')}
                        disabled={currentIndex === 0 ? true : false}
                      >
                        Previous
                      </Button>
                    </div>
                    <div>
                      <Button
                        variant="secondary"
                        style={{ marginTop: 10 }}
                        onClick={() => nav('next')}
                        disabled={currentIndex === len - 1 ? true : false}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                  {programInfo?.videoPath?.includes('.mp4') ? (
                    <div>
                      {' '}
                      <VideoPlayer
                        src={programInfo.videoPath}
                        programInfo={programInfo}
                        variant="secondary"
                        markers={markers}
                        addMarker={addSegment}
                        resetSegmentTime={resetSegmentTime}
                        deleteSegment={deleteSegment}
                        isMarker={true}
                        style={{ maxHeight: '350px' }}
                      />
                    </div>
                  ) : (
                    <div style={{ marginTop: '5%' }}>
                      <Image
                        src={`${USERS_BASE_URL}/${uploadPath}/${programInfo?.thumbnailPath}`}
                        width="30vw"
                        height="30vh"
                        fallback="placeholder.png"
                        preview={false}
                      />
                    </div>
                  )}
                </Col>
                <Col span={24}>
                  <ProgramInformation programInfo={programInfo} to="string" />
                </Col>
              </Row>
            </Col>
            <Col span="17" style={{ height: '89vh', overflow: 'hidden' }}>
              <SegmentTrendAndAssessment
                handleUpdate={handleSubmit}
                // handleSubmit={handleSubmit}
                // startTime={startTime}
                // disableField={disableField}
                refreshMetaData={refresh}
                jobID={job.id}
              />
              {/* <Tabs
                type="card"
                tabPanes={[
                  { title: 'Media Analysis', content: <MediaAnalysis jobID={job.id} /> },
                  { title: 'Participant Analysis', content: <GuestAnalysis jobID={job.id} /> },
                ]}
              />
              <div className="submit-wrapper">
                <Button
                  variant="secondary"
                  tabIndex="0"
                  onKeyPress={e => e.key === 'Enter' && handleSubmit()}
                  onClick={handleSubmit}
                >
                  Save
                </Button>
              </div> */}
            </Col>
          </Row>
        </div>
      ) : (
        <LoadingPage />
      )}
    </div>
  );
};
export default MarkerEdit;
