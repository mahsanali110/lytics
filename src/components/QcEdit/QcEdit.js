import { useEffect, useState, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Select, Image, message as antMessage } from 'antd';
import { LeftOutlined } from '@ant-design/icons';
import { pick } from 'lodash';
import { LoadingPage, Tabs } from 'components/Common';
import { Button, PageNavigation, VideoPlayer, Statement, ProgramInfo } from 'components/Common';
import navActions from 'modules/navigation/actions';
import { beatTime, uploadPath } from 'constants/index.js';
import { jobActions } from 'modules/jobs/actions';
import { makeTextFrom, rowCOl } from 'modules/common/utils';
import { Divider, Input } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './QcEdit.scss';
import jobs from 'services/jobs';
import guestsActions from 'modules/guests/actions';
import contentExportActions from 'modules/contentExport/action';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCommentsDollar, faMars, faVenus } from '@fortawesome/free-solid-svg-icons';
import { Spin } from 'antd';
import { object } from 'prop-types';
import { USERS_BASE_URL } from 'constants/config';
import { ImageSlider } from './components';

var jobIds = [];
import { io } from 'socket.io-client';
import moment from 'moment';
import axios from 'axios';
import { useHistory } from 'react-router';
import { commonActions } from 'modules/common/actions';
const QcEdit = ({ history, match: { params } }) => {
  const { Option } = Select;
  const dispatch = useDispatch();
  const nextPageProps = useSelector(state => state.pageNavReducer);
  const {qcButtonType} = useSelector(state => state.commonReducer);
  const QCjob = useSelector(state => state.jobsReducer);
  const Exportjob = useSelector(state => state.contentExportReducer);
  const user = useSelector(state => state.authReducer.user);
  const [loading, setLoading] = useState(false);
  const [btn_loading, setbtn_loading] = useState(false);
  const [job, setjob] = useState();
  const uniqueTags = [];
  const [items, setitems] = useState([]);
  const [name, setname] = useState('');
  const hosts = useSelector(state => state.jobsReducer.job.anchor);
  const [currentIndex, setCurrentIndex] = useState('');
  const [disable, setDisable] = useState(false);
  const [Languagedisable, setLanguageDisable] = useState(false);
  const [len, setLen] = useState('');
  const [loadPage, setLoadPage] = useState(true);
  const [PlayCheck, setPlayCheck] = useState(true);
  const { guests } = useSelector(state => state.guestsReducer);
  const [wordCount, setWordCount] = useState(0);
  const [buttonType, setButtonType] = useState(null);
  useEffect(() => {
    let lock_interval;
    if (job && job.id === params.jobId) {
      if (job.locked !== undefined || job?.locked?.length > 0) {
        let lockOBJ = null;
        if ((job.role = user.role && job.name !== user.firstName + ' ' + user.lastName)) {
          lockOBJ = job;
        }
        if (lockOBJ.length > 0) {
          let dateoflocked = new Date(lockOBJ.lockedAt);
          let currentDate = new Date();
          let time = currentDate - dateoflocked;
          time = time / 1000 / 60;
          if (time < 5) {
            antMessage.info(`${lockOBJ[0].name} is working on it!`, 2);
            history.push(`/jobs`);
            return;
          }
        } else {
          // lock_interval = setInterval(() => {
          let data = {
            lockJobId: params.jobId,
            unlockJobId:
              jobIds[
                qcButtonType === 'prev'
                  ? currentIndex + 1
                  : qcButtonType === 'next'
                  ? currentIndex - 1
                  : null
              ],
          };
          dispatch(jobActions.lockUnlockJob.request(data));
          // }, beatTime);
        }
      } else {
        // lock_interval = setInterval(() => {
        dispatch(jobActions.lockJob.request({ id: params.jobId }));
        // }, beatTime);
      }
    }

    return () => {
      if (job && job.id === params.jobId) {
        // clearInterval(lock_interval);
        dispatch(jobActions.unlockJob.request({ id: params.jobId }));
      }
    };
  }, [job && job.id === params.jobId, qcButtonType]);
  const [workAssement, setWorkAssesment] = useState({
    userName: '',
    role: '',
    page: '',
    jobUrl: '',
    programName: '',
    programTime: '',
    programDate: '',
    qcedDate: '',
    qcedTime: '',
    keyPressed: '',
  });

  const colorPickers = [
    'classPicker1',
    'classPicker2',
    'classPicker3',
    'classPicker4',
    'classPicker5',
    'classPicker6',
    'classPicker7',
    'classPicker8',
    'classPicker9',
    'classPicker10',
    'classPicker11',
    'classPicker12',
    'classPicker13',
    'classPicker14',
    'classPicker15',
    'classPicker16',
    'classPicker17',
    'classPicker18',
    'classPicker19',
    'classPicker20',
  ];
  let guestNames = [];
  guests.map(guest => {
    guestNames.push(guest.name);
  });
  var increment = 0;

  const videoCurrentTime = useSelector(state => state.commonReducer.videoCurrentTime);
  const { index, next, prev } = nextPageProps.job?.nav ?? {};
  const programInfo = pick(job, [
    'source',
    'channel',
    'clippedBy',
    'programName',
    'programDate',
    'segmentTime',
    'programTime',
    'thumbnailPath',
    'channelLogoPath',
    'videoPath',
    'articleImagePaths',
  ]);
  useEffect(() => {
    setWorkAssesment(prev => ({
      ...prev,
      userName: user.firstName + ' ' + user.lastName,
      page: 'QC Edit',
      role: user.role,
      jobUrl: window.location.href,
      programName: programInfo.programName,
      programTime: programInfo.programTime,
      programDate: moment(programInfo.programDate).format('DD/MM/YYYY'),
      qcedDate: moment().format('DD/MM/YYYY'),
      qcedTime: moment().format('HH:mm:ss'),
      keyPressed: wordCount,
    }));
  }, [job, wordCount]);
  useEffect(() => {
    let ids = sessionStorage.getItem('job_ids');
    if (ids) {
      jobIds = ids.split(',');
    }
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
    dispatch(guestsActions.getGuests.request());
  }, []);
  useEffect(() => {
    if (user.role !== 'Clipper') {
      dispatch(jobActions.getJobById.request(params.jobId));
    } else if (user.role === 'Clipper') {
      dispatch(contentExportActions.getExportJobById.request(params.jobId));
    }
  }, [params.jobId, user]);

  useEffect(() => {
    window.addEventListener('beforeunload', saveAssesment);
    return () => {
      window.removeEventListener('beforeunload', saveAssesment);
    };
  }, [workAssement]);

  useEffect(() => {
    if (user.role !== 'Clipper' && QCjob?.job?.id === params?.jobId) {
      setjob(QCjob.job);
      setLoading(QCjob.loading);
      setbtn_loading(QCjob.buttonloading);
    } else if (user.role === 'Clipper') {
      setjob(Exportjob.job);
      setLoading(Exportjob.loading);
    }
  }, [QCjob, Exportjob, user]);

  useEffect(() => {
    guests?.map(guest => {
      if (hosts?.indexOf(guest.name === -1)) {
        hosts?.push(guest.name);
      }
    });
  }, []);

  if (hosts !== undefined && guests !== undefined) {
    let sp = guests.concat(hosts);
  }
  useEffect(() => {
    setitems(guestNames);
  }, [guests]);

  const handleSubmit = type => {
    const data = pick(job, [
      'programName',
      'programDescription',
      'comments',
      'clippedBy',
      'translation',
      'transcription',
    ]);
    data.type = type;
    var l = true;
    if (type === 'save') {
      data.flag = true;
      saveAssesment();
    }
    if (type === 'translate') {
      l = false;
    }
    if (user.role !== 'Clipper') {
      dispatch(jobActions.updateJob.request({ id: params.jobId, data, loading: l }));
    } else if (user.role === 'Clipper') {
      dispatch(
        contentExportActions.updateExportJob.request({ id: params.jobId, data, loading: l })
      );
    }
  };
  function saveAssesment() {
    var startTime = workAssement.qcedTime;
    var endTime = moment().format('HH:mm:ss');
    let diff = moment
      .utc(moment(endTime, 'HH:mm:ss').diff(moment(startTime, 'HH:mm:ss')))
      .format('HH:mm:ss');
    workAssement.timeSpent = diff;
    axios
      .post(`${USERS_BASE_URL}/analytics/workassessment`, workAssement)
      .then(res => {})
      .catch(err => {});
  }
  const getJobsDetailUri = role => {
    const jobsDetailByRole = {
      QC: '/qc-edit',
      Marker: 'marker-edit',
    };

    return jobsDetailByRole[role];
  };

  const nav = index => {
    if (jobIds.length > 0) {
      if (index === 'prev') {
        dispatch(commonActions.buttonType(index))
        let cIndex = currentIndex - 1;
        setCurrentIndex(cIndex);
        let current_video = jobIds[cIndex];

        history.push(`/qc-edit/${current_video}`);
      }
      if (index === 'next') {
        dispatch(commonActions.buttonType(index))
        let cIndex = currentIndex + 1;
        setCurrentIndex(cIndex);
        let current_video = jobIds[cIndex];
        history.push(`/qc-edit/${current_video}`);
      }
    }
  };

  useEffect(() => {
    if (job?.language === 'ENG' || job?.language === 'ENGLISH') {
      setLanguageDisable(true);
    } else if (job?.language === 'URDU') {
      setLanguageDisable(false);
    }
  }, [job?.language]);

  if (programInfo?.channelLogoPath != undefined) {
    const searchLogoPath = programInfo?.channelLogoPath.search('logoPath');
    const logoPath = programInfo?.channelLogoPath.slice(searchLogoPath);
    programInfo.channelLogoPath = logoPath;
  }
  return (
    <div>
      {QCjob.loading === false ? (
        <div className="qc-edit-wrapper">
          <div className="qc-edit-header-wrapper">
            <div></div>
            <div className="right-wrapper">
              <Button
                disabled={Languagedisable}
                loading={btn_loading}
                variant="secondary"
                type="big"
                onClick={() => {
                  handleSubmit('translate');
                  setDisable(true);
                }}
              >
                TRANSLATE
              </Button>
              <Button variant="primary" type="big" onClick={() => handleSubmit('save')}>
                PROCESS
              </Button>
            </div>
          </div>
          <Row gutter={8}>
            <Col span="10">
              <div className="qc-video-wrapper">
                <div className="program-info">
                  <div style={{ height: '5rem' }}>
                    <ProgramInfo programInfo={programInfo} />
                  </div>
                </div>
                <div className="middle-wrapper">
                  <Button
                    variant="secondary"
                    onClick={() => {
                      saveAssesment();
                      nav('prev');
                    }}
                    disabled={currentIndex === 0 ? true : false}
                  >
                    PREVIOUS
                  </Button>

                  <Button
                    variant="secondary"
                    onClick={() => {
                      saveAssesment();
                      nav('next');
                    }}
                    disabled={currentIndex === len - 1 ? true : false}
                  >
                    NEXT
                  </Button>
                </div>
                {programInfo?.videoPath?.includes('.mp4') ? (
                  <div>
                    <VideoPlayer
                      isQC={true}
                      setPlayCheck={setPlayCheck}
                      loading={jobs.loading}
                      src={programInfo.videoPath}
                      programInfo={programInfo}
                      style={{ marginTop: '10px' }}
                    />
                  </div>
                ) : programInfo?.source === 'Ticker' ? (
                  <div style={{ marginTop: '5%' }}>
                    <Image
                      src={`${USERS_BASE_URL}/${uploadPath}/${programInfo?.thumbnailPath}`}
                      width="40vw"
                      height="8vh"
                      fallback="placeholder.png"
                      preview={false}
                    />
                  </div>
                ) : programInfo?.articleImagePaths?.length ? (
                  <div style={{ marginTop: '10px' }}>
                    <ImageSlider images={programInfo?.articleImagePaths} />
                  </div>
                ) : (
                  <div style={{ marginTop: '5%' }}>
                    <Image
                      src={`${USERS_BASE_URL}/${uploadPath}/${programInfo?.thumbnailPath}`}
                      width="40vw"
                      height="60vh"
                      fallback="placeholder.png"
                      preview={false}
                    />
                  </div>
                )}
                <div className="qc-video-statment-spacing" />
              </div>
            </Col>

            <Col span="14" style={{ marginTop: '-70px' }}>
              <Tabs
                type="card"
                tabPanes={[
                  {
                    title: 'Transcription',
                    content: (
                      <Statement
                        Ttype="Transcription"
                        height="calc(100vh - 25rem)"
                        content={rowCOl(job?.transcription, videoCurrentTime, 'Transcription')}
                        handleOnchange={value => {
                          if (user.role === 'QC') {
                            dispatch(jobActions.updateByField({ field: 'transcription', value }));
                          } else if (user.role === 'Clipper') {
                            dispatch(
                              contentExportActions.updateByField({ field: 'transcription', value })
                            );
                          }
                          if (!loading) setDisable(false);
                        }}
                        setDisable={setDisable}
                        programInfo={programInfo}
                        saveIcon={job?.id}
                        language={job?.language?.toLowerCase()}
                        PlayCheck={PlayCheck}
                        isQC={true}
                        user={user}
                        setWordCount={setWordCount}
                      />
                    ),
                  },
                  {
                    title: 'Translation',
                    content: (
                      <Statement
                        Ttype="Translation"
                        height="calc(100vh - 25rem)"
                        content={rowCOl(job?.translation, videoCurrentTime, 'Translation')}
                        handleOnchange={value => {
                          if (user.role === 'QC') {
                            dispatch(jobActions.updateByField({ field: 'translation', value }));
                          } else if (user.role === 'Clipper') {
                            dispatch(
                              contentExportActions.updateByField({ field: 'translation', value })
                            );
                          }
                        }}
                        setDisable={setDisable}
                        programInfo={programInfo}
                        saveIcon={job?.id}
                        PlayCheck={PlayCheck}
                        isQC={true}
                        user={user}
                      />
                    ),
                  },
                ]}
              />
            </Col>
          </Row>
        </div>
      ) : (
        <LoadingPage />
      )}
    </div>
  );
};

export default QcEdit;
