import { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import moment from 'moment';
import { pick } from 'lodash';

import { USERS_BASE_URL } from 'constants/config/config.dev';
import { filterJobSources, uploadPath } from 'constants/index';
import { rowCOl, formatDate, sourceBtn, checkSpecialCharacterExists } from 'modules/common/utils';

import { CloseOutlined } from '@ant-design/icons';
import { SearchOutlined } from '@ant-design/icons';
import CheckMark from '../../assets/icons/checkmark.svg';
import SettingIcon from '../../assets/icons/setting_icon.svg';
import Avatar from 'react-avatar';
const { TabPane } = Tabs;
import SkeletonLibrary from '../../assets/images/SkeletonLibrary.png';
import { Tabs, Row, Col, message as antMessage, Image, Modal, List, Input } from 'antd';

import './JobLibrary.scss';

import filterActions from 'modules/filter/actions';
import usersActions from 'modules/users/actions';
import hostsActions from 'modules/hosts/actions';
import channelsActions from 'modules/channels/actions';
import { jobActions } from 'modules/jobs/actions';
import groupsActions from 'modules/groups/actions';
import guestsActions from 'modules/guests/actions';
import jobfilters from 'modules/jobfilters/actions';
import navActions from 'modules/navigation/actions';
import associationsActions from 'modules/associations/actions';

import { getColumns } from 'components/JobLibrary/columns';
import SearchDrawer2 from 'components/Common/SearchDrawer2';
import PaginationComp from 'components/Common/Pagination/PaginationComp';
import { LoadingPage, Table, SearchField, Statement, VideoPlayer, Button } from 'components/Common';
import { IconButton } from './components';
import Twitter from './components/Twitter/Twitter';
import Web from './components/Web/Web';
import TwitterDetails from './components/Twitter/TwitterDetails';
const langDetector = new (require('languagedetect'))();

const jobInitialState = {
  translation: [],
  transcription: [],
};

const JobLibrary = () => {
  const dispatch = useDispatch();
  const pageRef = useRef(1);
  const format = 'YYYY-MM-DDTHH:mm:ss';
  const user = useSelector(state => state.authReducer.user);
  const { users } = useSelector(state => state.usersReducer);
  const { hashing, searchText: text, loading } = useSelector(state => state.jobsReducer);
  const jobs = useSelector(state => state.jobsReducer);
  const { channels: allChannels } = useSelector(state => state.channelsReducer);
  const videoCurrentTime = useSelector(state => state.commonReducer.videoCurrentTime);
  const {
    channel: channelT,
    startDate: startDateT,
    endDate: endDateT,
    source: sourceT,
    limit: limitT,
    escalation: escalationT,
    association: associationT,
    hosts: hostsT,
    guest: guestT,
    programType: programTypeT,
    searchText: searchTextT,
  } = useSelector(state => state.jobfilterReducer);
  const { defaultPreset } = useSelector(state => state.filterReducer);

  const [openAlertModal, setOpenAlertModal] = useState(false);
  const [pageNumber, setPageNumber] = useState(1);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [PlayCheck, setPlayCheck] = useState(true);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [transcriptionText, setTranscriptionText] = useState('');
  const [disable, setDisable] = useState(true);
  const [bulkJobs, setBulkJobs] = useState([]);
  const [bulkUsers, setBulkUsers] = useState([]);
  const [bulkCheckbox, setBulkCheckbox] = useState(false);
  const [activeTabKey, setActiveTabKey] = useState('1');
  const [companyUsers, setCompanyUsers] = useState();
  const [activeSearch, setActiveSearch] = useState('primary');
  const [job, setJob] = useState(jobInitialState);
  const [rowId, setRowId] = useState('');
  const [isChecked, setIsChecked] = useState([]);
  const [RowClickLoading, setRowClickLoading] = useState(false);
  const [drawerModel, setDrawerModel] = useState(false);
  const [poolType, setPoolType] = useState(1);

  const [tableFilters, setTableFilters] = useState({
    start_date: moment().format(format),
    end_date: moment().format(format),
    source: filterJobSources,
    limit: 30,
    guest: '',
    page: pageNumber ?? 1,
    escalation: '',
    channel: [...allChannels.map(_ => _.name)],
    association: '',
    appliedPreset: '',
    searchText: searchText,
    jobState: ['Ready for QC', 'Ready for Marking', 'Completed'],
    isUserPool: true,
  });
  var d = new Date();
  const InitialState = {
    tags: [],
    source: filterJobSources,
    channel: ['All', ...allChannels.map(({ name }) => name)],
    programType: [],
    hosts: [],
    guests: [],
    limit: 30,
    jobState: ['Ready for QC', 'Ready for Marking', 'Completed'],
    association: null,
    escalation: [],
    searchText: searchText,
    start_date_Status: 'Today',
    start_date: moment(d).format(format),
    end_date: moment(d).format(format),
    appliedPreset: '',
    isUserPool: true,
  };
  const {
    id,
    company: { name, logoPath },
    firstName,
    lastName,
  } = user;

  useEffect(() => {
    dispatch(channelsActions.getChannels.request());
    dispatch(usersActions.getUsers.request({ role: 'Client' }));
    dispatch(groupsActions.getGroups.request());
    dispatch(guestsActions.getGuests.request());
    dispatch(hostsActions.getHosts.request());
    dispatch(associationsActions.getAssociations.request());
  }, []);
  useEffect(() => {
    setCompanyUsers(
      users
        .filter(user => user.company && user?.company?.name == name && user.id !== id)
        .map(role => ({
          value: role.id,
          title: role.firstName + ' ' + role.lastName,
        }))
    );
  }, [users]);

  useEffect(() => {
    setBulkUsers([]);
    isChecked?.map(singlechecked => {
      setBulkUsers(prev => [
        ...prev,
        {
          id: companyUsers[singlechecked]?.value,
          to: companyUsers[singlechecked]?.title,
          company: name,
          by: firstName + ' ' + lastName,
        },
      ]);
    });
  }, [isChecked]);

  useEffect(() => {
    setJob(jobs.job);
  }, [jobs.job]);

  useEffect(() => {
    setData(jobs.results);
  }, [jobs.results]);

  useEffect(() => {
    setNumberOfPages(jobs?.totalPages ?? 0);
  }, [jobs.totalPages]);

  // * This cause native API call
  // useEffect(() => {
  //   console.log(filterParams(), 'im in native api call', tableFilters);
  //   if (tableFilters.limit !== 0) {
  //     if (!hashing && !defaultPreset) {
  //       console.log('in 1');
  //       dispatch(
  //         jobActions.fetchJobs.request({
  //           ...tableFilters,
  //           flag: true,
  //           ...filterParams(),
  //         })
  //       );
  //     }
  //   }
  // }, [pageNumber]);

  // * This cause native API version2 call
  useEffect(() => {
    setRowClickLoading(false);
    if (!hashing && !defaultPreset) {
      dispatch(
        jobActions.fetchJobs.request({
          ...tableFilters,
          flag: true,
          // ...filterParams(),
        })
      );
    } else {
      dispatch(
        jobActions.fetchJobs.request({
          ...tableFilters,
          flag: true,
        })
      );
    }
  }, [tableFilters]);

  // * This cause outside API call (from Search => Libraries)
  // useEffect(() => {
  //   if (hashing) {
  //     setSearchText(text);
  //     dispatch(
  //       jobActions.fetchJobs.request({
  //         ...tableFilters,
  //         flag: true,
  //         ...filterParams(),
  //         searchText: text,
  //       })
  //     );
  //   }
  // }, [hashing, pageNumber]);

  const handleAlertSearch = e => {
    setCompanyUsers(
      users
        .filter(user => user.company && user?.company?.name == name && user.id !== id)
        .map(role => ({
          value: role.id,
          title: role.firstName + ' ' + role.lastName,
        }))
        .filter(user => user.title.toLowerCase().includes(e.target.value.toLowerCase()))
    );
  };

  const escalateJob = jobId => {
    const job = data.find(job => job.id === jobId);
    const _data = pick(job, [
      'programName',
      'programDescription',
      'comments',
      'clippedBy',
      'escalations',
    ]);
    if (!_data.escalations?.length) {
      antMessage.error('Please select atleast 1 escalation');
      return;
    }
    dispatch(jobActions.updateJob.request({ id: jobId, data: _data }));
  };

  const bulkEsclate = () => {
    if (!bulkJobs.length) {
      return antMessage.error('Please select atleast 1 job', 2);
    }
    dispatch(jobActions.bulkEscalateJobs.request({ users: bulkUsers, jobs: bulkJobs }));
    setBulkJobs(prev => []);
    setBulkUsers(prev => []);
    setBulkCheckbox(prev => false);
  };

  const setEscalations = payload => {
    const newArr = [...data];
    var index = newArr.findIndex(job => job.id === payload.jobId);
    newArr[index].escalations = payload.data;
    setData(newArr);
  };

  const columns = getColumns(user, {
    escalateJob,
    setEscalations,
    setBulkJobs,
    bulkJobs,
    setBulkCheckbox,
    bulkCheckbox,
    setBulkUsers,
    bulkUsers,
    bulkEsclate,
    data,
  });

  const filterParams = useCallback(() => {
    return {
      hosts: hostsT ? hostsT : [],
      guest: guestT ? guestT : [],
      page: pageNumber ?? 1,
      source: sourceT ? sourceT : filterJobSources,
      jobState: ['Ready for QC', 'Ready for Marking', 'Completed'],
      searchText: searchText,
      start_date: startDateT ? startDateT : moment().format(format),
      end_date: endDateT ? endDateT : moment().format(format),
      limit: 30,
      channel: [...allChannels.map(_ => _.name)],
    };
  }, [hostsT, guestT, pageNumber, sourceT, startDateT, endDateT, channelT, searchTextT]);

  const fetchTodayJobs = useCallback(() => {
    dispatch(
      jobfilters.addcurrentFilterData.request({
        startDate: moment().format(format),
        endDate: moment().format(format),
        source: filterJobSources,
        limit: 30,
        searchText: searchText,
        guest: [],
        escalation: '',
        association: '',
        page: 1,
        jobState: ['Ready for QC', 'Ready for Marking', 'Completed'],
        hosts: [],
        programType: [],
        presist: [],
        channel: [...(allChannels.map(_ => _.name) ?? [])],
      })
    );
  }, []);

  const handleTableRowClick = (index, record) => {
    setRowClickLoading(true);
    dispatch(navActions.updateLink({ type: 'job', index }));
    dispatch({ type: 'SET_COUNT_OF_CURRENT_JOB', payload: record.wordCount });
    dispatch(jobActions.getJobById.request(record.id));
  };

  const programInfo = pick(job, [
    'channel',
    'clippedBy',
    'programName',
    'programDate',
    'programTime',
    'segmentStartTime',
    'segmentTime',
    'thumbnailPath',
    'channelLogoPath',
    'videoPath',
    'broadcastDate',
  ]);

  const setRowClassName = record => {
    return record.id === rowId ? 'clickRowStyl' : '';
  };

  const handleSearch = () => {
    if (checkSpecialCharacterExists(searchText)) {
      return antMessage.error('Only [& | -] operators are allowed!');
    }

    const searchPoolType = poolType === 1 ? true : false;

    setTableFilters({
      ...tableFilters,
      isUserPool: searchPoolType,
      searchText: searchText,
      page: 1,
    });
    resetCurrentPage(1);
    // dispatch(
    //   jobActions.fetchJobs.request({
    //     ...tableFilters,
    //     searchText: searchText,
    //     page: 1,
    //     flag: true,
    //   })
    // );
  };

  const resetCurrentPage = page => {
    setPageNumber(page ?? 1);
    pageRef.current = page ?? 1;
  };

  const ApplyCommonFilter = data => {
    resetCurrentPage(1);
    setActiveTabKey('1');
    dispatch(jobActions.setHash.request({ isRedirect: false }));
    const dataObj = {
      start_date: data.start_date,
      end_date: data.end_date,
      source: data.source,
      limit: 30,
      guest: data.guests,
      escalation: data.escalation,
      association: data.association,
      jobState: data.jobState ?? [],
      channel: data.channel,
      hosts: data.hosts,
      page: 1,
      programType: data.programType,
      searchText: searchText,
      appliedPreset: data.appliedPreset,
      isUserPool: data.isUserPool,
    };
    setTableFilters(dataObj);
    setDrawerModel(false);
  };

  const sendAlertFunction = () => {
    if (!bulkJobs.length) {
      return antMessage.error('Please select atleast 1 job', 2);
    }
    dispatch(jobActions.bulkEscalateJobs.request({ users: bulkUsers, jobs: bulkJobs }));
    setBulkJobs(prev => []);
    setBulkUsers(prev => []);
    setIsChecked(prev => []);
    setBulkCheckbox(prev => false);
    setCompanyUsers(
      users
        .filter(user => user.company && user?.company?.name == name && user.id !== id)
        .map(role => ({
          value: role.id,
          title: role.firstName + ' ' + role.lastName,
        }))
    );
  };

  const [programTime] = job?.programTime?.split(' to ') ?? '';

  const sourceCheck = () => {
    if (job.source !== 'Blog' || job.source !== 'Print') {
      return false;
    } else {
      return true;
    }
  };
  const checkLanguage = str => {
    if (!str) return;
    const regExp = /^[A-Za-z]*$/;
    var result = str.split(' ').map(obj => {
      if (regExp.test(obj)) {
        return true;
      } else {
        return false;
      }
    });
    if (result.includes(true)) {
      return 'Roboto';
    } else {
      return 'Noto Nastaliq';
    }
  };

  return (
    <>
      <div className="client-library-wrapper">
        <>
          <div className="client-top">
            <div className="client-library-subLeft">
              <div className="output-search-container">
                <Row span={12} className="row-div">
                  <Col
                    span={2}
                    style={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      paddingRight: '10px',
                    }}
                  >
                    {/* <Button className="client-alert-button" onClick={() => setOpenAlertModal(true)}>
                      Share
                    </Button> */}
                  </Col>
                  <Col span={8}>
                    <SearchField
                      className="search-Field"
                      placeholder="Search Libraries"
                      searchText={searchText}
                      handleOnChange={e => {
                        setSearchText(e.target.value);
                        setActiveSearch('primary');
                        setTranscriptionText('');
                      }}
                      handleSearch={handleSearch}
                      isJobLibrary={true}
                    />
                  </Col>

                  {tableFilters?.appliedPreset && (
                    <Col span={3}>
                      <Button className="preset-button">
                        {tableFilters?.appliedPreset}
                        <CloseOutlined
                          onClick={() => {
                            resetCurrentPage();
                            setTableFilters({ ...InitialState, searchText: searchText }),
                              dispatch(jobActions.setHash.request({ isRedirect: false })),
                              dispatch(
                                filterActions.defaultPreset.request({
                                  ...InitialState,
                                  appliedPreset: '',
                                })
                              );
                          }}
                          className="cross-icon"
                        />
                      </Button>
                    </Col>
                  )}
                  <Col span={2} style={{ display: 'block', flex: '0' }}>
                    <img
                      className="setting_icon"
                      src={SettingIcon}
                      alt="setting_icon"
                      onClick={() => setDrawerModel(true)}
                    />
                  </Col>
                </Row>
              </div>
              {jobs.loading && RowClickLoading == false ? (
                <div style={{ width: '100%', display: 'contents' }} className="image-skeleton">
                  <Image preview={false} src={SkeletonLibrary}></Image>
                </div>
              ) : (
                <Tabs
                  onChange={key => {
                    key != 10
                      ? (setNumberOfPages(jobs?.totalPages), setActiveTabKey(key))
                      : (setActiveTabKey(key), setNumberOfPages(0));
                  }}
                  type="card"
                  className="table-tabs"
                  style={{ minHeight: '80vh', paddingLeft: '1%' }}
                  defaultActiveKey="1"
                >
                  <TabPane tab="Library" key="1" className="tab-borders">
                    <Table
                      className="table-columns"
                      columns={columns}
                      rowKey={(record, index) => {
                        record.id;
                      }}
                      data={data ?? []}
                      pagination={false}
                      disable={jobs.loading || loading}
                      scroll={{ y: true }}
                      showSorterTooltip={false}
                      sortDirections={[]}
                      // sorter={false}
                      // sortOrder={false}

                      onRow={(record, index) => {
                        return {
                          onClick: event => {
                            handleTableRowClick(index, record);
                            setRowId(record.id);
                            setActiveTabKey('1');
                            setTranscriptionText('');
                          },
                        };
                      }}
                      rowClassName={setRowClassName}
                    />
                  </TabPane>
                </Tabs>
              )}
            </div>

            <div className="client-library-subRight">
              <>
                {(job?.source === 'Print' || job?.source === 'Blog' || job?.source === 'Social') &&
                activeTabKey != '10' ? (
                  <div
                    className="job-search-drawer"
                    placement="right"
                    closable={false}
                    maskClosable={true}
                    visible={true}
                    key="right"
                    width={700}
                  >
                    <>
                      {jobs.loading ? (
                        <LoadingPage className="loadingPage" />
                      ) : (
                        <div
                          style={{
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            padding: '0px 4px',
                            boxShadow: ' 0px 2px 48px rgba(0, 0, 0, 0.16)',
                            margin: '0 auto',
                          }}
                        >
                          <div
                            style={{
                              width: '100%',
                              // padding: '10px 10px',
                              background: ' #121A34',
                              // borderRadius: '5px',
                              justifyContent: 'center',
                              alignItems: 'center',
                              display: 'flex',
                            }}
                          >
                            <div
                              style={{
                                width: '100%',
                                backgroundColor: '#121A34',
                                // padding: '0px 0px 10px 0px',
                                paddingBottom: '10px',
                                borderRadius: '5px',
                              }}
                            >
                              <div
                                style={{
                                  width: '100%',
                                  // display: 'flex',
                                  justifyContent: 'center',
                                }}
                              >
                                {job.source == 'Social' ? (
                                  <Twitter
                                    job={job}
                                    programInfo={programInfo}
                                    programTime={programTime}
                                  />
                                ) : (
                                  activeTabKey !== '3' && <Web job={job} />
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </>

                    {job.segments && activeTabKey != '10' && (
                      <Tabs
                        onChange={key => setActiveTabKey(key)}
                        type="card"
                        className="output-tabs"
                        tabPosition="bottom"
                        defaultActiveKey="1"
                      >
                        <TabPane tab="Transcription" key="1">
                          {/* For Print, Blog & Social */}

                          <Statement
                            Ttype="Transcription"
                            height={job.source == 'Social' ? 'auto' : null}
                            isClient={true}
                            content={rowCOl(job?.transcription, videoCurrentTime, 'Transcription')}
                            handleOnchange={value =>
                              dispatch(jobActions.updateByField({ field: 'transcription', value }))
                            }
                            searchText={{
                              text:
                                activeSearch === 'primary'
                                  ? searchText.toLowerCase()
                                  : transcriptionText.toLowerCase(),
                              T: 'Transcription',
                            }}
                            saveIcon={job.id}
                            setDisable={setDisable}
                            programInfo={programInfo}
                            language={job?.language?.toLowerCase()}
                            PlayCheck={PlayCheck}
                            user={user}
                            extras={false}
                          />
                          {job.source == 'Social' ? <TwitterDetails job={job} /> : null}
                        </TabPane>
                        {/* <TabPane tab="Translation" key="2">
                          <Statement
                            Ttype="Translation"
                            // height="calc(100vh - 40vh)"
                            isClient={true}
                            content={rowCOl(job?.translation, videoCurrentTime, 'Translation')}
                            handleOnchange={value =>
                              dispatch(jobActions.updateByField({ field: 'translation', value }))
                            }
                            saveIcon={job.id}
                            setDisable={setDisable}
                            programInfo={programInfo}
                            language={job?.language?.toLowerCase()}
                            PlayCheck={PlayCheck}
                            user={user}
                            extras={false}
                          />
                        </TabPane> */}
                        {job.source === 'Ticker' || job.source === 'Social' ? null : (
                          <TabPane tab="Details" key="3" size="small">
                            <div className="drawer-details-div">
                              <div className="details-sub-div">
                                <h3>{job.channel}</h3>
                                <div className="date-section">
                                  <span style={{ marginTop: '1%', marginRight: '3.5%' }}>
                                    {`${formatDate(job.programDate, 'DD MMM YY')} . ${
                                      programTime !== undefined && programTime.length
                                        ? programTime
                                        : '12:00AM'
                                    }`}
                                  </span>
                                  <Button
                                    style={{
                                      minWidth: 'fit-content',
                                      minHeight: 'fit-content',
                                      borderRadius: '2px',
                                      color: sourceBtn(job.source),
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}
                                  >
                                    {job.source == 'Blog' ? 'Web' : job.source}
                                  </Button>
                                </div>
                              </div>
                              <div
                                className={`program-details ${
                                  checkLanguage(job.programName) === 'Roboto' ? 'english' : 'urdu'
                                }`}
                              >
                                <h1>{job.programName}</h1>
                                <span
                                  className="ff-roboto mt-10"
                                  style={{ display: 'inline-block' }}
                                >
                                  {job.programType} | {job.language}
                                </span>
                              </div>
                              {job.anchor.length > 0 && sourceCheck() === true ? (
                                <div style={{ lineHeight: '35px', marginTop: '3%' }}>
                                  <span>
                                    Host(s) - {job.anchor.map(anchorName => anchorName + ' , ')}
                                  </span>
                                </div>
                              ) : null}
                              {job.guests.name ? (
                                <span>
                                  Guest(s) - {job.guests.map(guest => guest.name + ' , ')}
                                </span>
                              ) : null}
                            </div>
                            <div className="topics-hashtags-div">
                              <div className="details-sub-div">
                                {job?.segments[0]?.topics?.topic1.length > 0 ? (
                                  <>
                                    <h1>{job.segments[0].topics.topic1}</h1>
                                    <span>
                                      {job.segments[0]?.topics?.topic2[0]} |{' '}
                                      {job.segments[0]?.topics?.topic3[0]}
                                    </span>
                                  </>
                                ) : (
                                  <h3 style={{ color: 'white' }}></h3>
                                )}
                              </div>
                              {job.queryWords.length > 3 ? (
                                <div
                                  className={`details-sub-div ${
                                    checkLanguage(job.programName) === 'Roboto' ? 'english' : 'urdu'
                                  }`}
                                >
                                  <h1>Keywords </h1>
                                  {job.queryWords.map((queryWord, index) =>
                                    index > 2 ? <span>{queryWord.word} &nbsp;</span> : null
                                  )}
                                </div>
                              ) : null}
                              <div className="hashtag_box">
                                {job.segments[0]?.hashtags.map(hashtag => {
                                  return <span className="hashtags-details">{hashtag}</span>;
                                })}
                              </div>
                            </div>
                          </TabPane>
                        )}
                      </Tabs>
                    )}
                  </div>
                ) : (
                  <div
                    className="job-search-drawer"
                    placement="right"
                    closable={false}
                    maskClosable={true}
                    visible={true}
                    key="right"
                    width={700}
                  >
                    <div
                      style={{
                        width: '100%',
                        display: 'flex',
                        padding: '0px 4px',
                        justifyContent: 'center',
                        boxShadow: ' 0px 2px 48px rgba(0, 0, 0, 0.16)',
                        margin: '0 auto',
                        // maxHeight:'50%'
                      }}
                    >
                      {programInfo?.videoPath?.includes('.mp4') && activeTabKey != '10' ? (
                        <div
                          style={{
                            width: '100%',
                            // padding: '10px ',
                            background: ' #131C3A',
                            // borderRadius: '5px',
                            justifyContent: 'center',
                            alignItems: 'center',
                            display: 'flex',
                          }}
                        >
                          <div
                            className="video-player-container"
                            style={{
                              width: '100%',
                              // padding: '10px 6px',
                              borderRadius: '5px',
                              // backgroundColor: '#232c49',
                            }}
                          >
                            <div style={{ marginTop: '1%' }}>
                              <VideoPlayer
                                isLibrary={true}
                                isClient={true}
                                setPlayCheck={setPlayCheck}
                                src={programInfo.videoPath}
                                programInfo={programInfo}
                              />
                            </div>
                          </div>
                        </div>
                      ) : (
                        activeTabKey != '10' &&
                        (jobs.loading ? (
                          <LoadingPage className="loadingPage" />
                        ) : (
                          <div
                            style={{
                              width: '100%',
                              display: 'flex',
                              justifyContent: 'center',
                              boxShadow: ' 0px 2px 48px rgba(0, 0, 0, 0.16)',
                              margin: '0 auto',
                              // maxHeight:'50%'
                            }}
                          >
                            <div
                              style={{
                                width: '100%',
                                padding: '10px 10px',
                                background: ' #131C3A',
                                // borderRadius: '5px',
                                justifyContent: 'center',
                                alignItems: 'center',
                                display: 'flex',
                              }}
                            >
                              <div
                                style={{
                                  background: '#232C49',
                                  width: '100%',
                                  padding: ' 5px 10px ',
                                }}
                              >
                                <Image
                                  src={
                                    programInfo?.thumbnailPath?.length > 0
                                      ? `${USERS_BASE_URL}/${uploadPath}/${programInfo.thumbnailPath}`
                                      : ''
                                  }
                                  style={
                                    job.source === 'Social'
                                      ? { justifyContent: 'center', display: 'flex' }
                                      : {}
                                  }
                                  width={job.source === 'Social' ? '60%' : '100%'}
                                  height={
                                    job.source === 'Ticker'
                                      ? '8vh'
                                      : job.source === 'Social'
                                      ? '60%'
                                      : '100%'
                                  }
                                  fallback="placeholder.png"
                                  preview={false}
                                />
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    {job.segments && activeTabKey != '10' && (
                      <Tabs
                        onChange={key => setActiveTabKey(key)}
                        type="card"
                        className="output-tabs"
                        tabPosition="bottom"
                        defaultActiveKey="1"
                      >
                        <TabPane tab="Transcription" key="1">
                          {/* For TV, Online & Ticker */}
                          {job.source == 'Ticker' ? (
                            <Twitter
                              job={job}
                              programInfo={programInfo}
                              programTime={programTime}
                            />
                          ) : (
                            <SearchField
                              className="search-Field-ts"
                              placeholder="Search Transcription"
                              searchText={transcriptionText}
                              handleOnChange={e => {
                                setTranscriptionText(e.target.value);
                                setActiveSearch('secondary');
                                setSearchText('');
                              }}
                              isJobLibrary={true}
                            />
                          )}

                          <Statement
                            Ttype="Transcription"
                            // height="calc(100vh - 40vh)"
                            isClient={true}
                            content={rowCOl(job?.transcription, videoCurrentTime, 'Transcription')}
                            handleOnchange={value =>
                              dispatch(jobActions.updateByField({ field: 'transcription', value }))
                            }
                            searchText={{
                              text:
                                activeSearch === 'primary'
                                  ? searchText.toLowerCase()
                                  : transcriptionText.toLowerCase(),
                              T: 'Transcription',
                            }}
                            saveIcon={job.id}
                            setDisable={setDisable}
                            programInfo={programInfo}
                            language={job?.language?.toLowerCase()}
                            PlayCheck={PlayCheck}
                            user={user}
                            extras={false}
                          />
                        </TabPane>
                        {/* <TabPane tab="Translation" key="2">
                          <Statement
                            Ttype="Translation"
                            // height="calc(100vh - 40vh)"
                            isClient={true}
                            content={rowCOl(job?.translation, videoCurrentTime, 'Translation')}
                            handleOnchange={value =>
                              dispatch(jobActions.updateByField({ field: 'translation', value }))
                            }
                            saveIcon={job.id}
                            setDisable={setDisable}
                            programInfo={programInfo}
                            language={job?.language?.toLowerCase()}
                            PlayCheck={PlayCheck}
                            user={user}
                            extras={false}
                          />
                        </TabPane> */}
                        {job.source === 'Ticker' ? null : (
                          <TabPane tab="Details" key="3" size="small">
                            <div className="drawer-details-div">
                              <div className="details-sub-div">
                                <h3>{job.channel}</h3>
                                <div className="date-section">
                                  <span style={{ marginTop: '1%', marginRight: '3.5%' }}>
                                    {`${formatDate(job.programDate, 'DD MMM YY')} . ${
                                      programTime !== undefined && programTime.length
                                        ? programTime
                                        : '12:00AM'
                                    }`}
                                  </span>
                                  <Button
                                    style={{
                                      minWidth: 'fit-content',
                                      minHeight: 'fit-content',
                                      borderRadius: '2px',
                                      color: sourceBtn(job.source),
                                      display: 'flex',
                                      alignItems: 'center',
                                    }}
                                  >
                                    {job.source == 'Blog' ? 'Web' : job.source}
                                  </Button>
                                </div>
                              </div>
                              <div
                                className={`program-details ${
                                  checkLanguage(job.programName) === 'Roboto' ? 'english' : 'urdu'
                                }`}
                              >
                                <h1>{job.programName}</h1>
                                <span>
                                  {job.programType} | {job.language}
                                </span>
                              </div>
                              {job.anchor.length > 0 && sourceCheck() === true ? (
                                <div style={{ lineHeight: '35px', marginTop: '3%' }}>
                                  <span>
                                    Host(s) - {job.anchor.map(anchorName => anchorName + ' , ')}
                                  </span>
                                </div>
                              ) : null}
                              {job.guests.length > 0 ? (
                                <span>
                                  Guest(s) - {job.guests.map(guest => guest.name + ' , ')}
                                </span>
                              ) : null}
                            </div>
                            <div className="topics-hashtags-div">
                              <div className="details-sub-div">
                                {job?.segments[0]?.topics?.topic1.length > 0 ? (
                                  <>
                                    <h1>{job.segments[0].topics.topic1}</h1>
                                    <span>
                                      {job.segments[0]?.topics?.topic2[0]} |{' '}
                                      {job.segments[0]?.topics?.topic3[0]}
                                    </span>
                                  </>
                                ) : (
                                  <h3 style={{ color: 'white' }}></h3>
                                )}
                              </div>
                              {job.queryWords.length > 3 ? (
                                <div
                                  className={`details-sub-div ${
                                    checkLanguage(job.programName) === 'Roboto' ? 'english' : 'urdu'
                                  }`}
                                >
                                  <h1>Keywords </h1>
                                  {job.queryWords.map((queryWord, index) =>
                                    index > 2 ? <span>{queryWord.word} &nbsp;</span> : null
                                  )}
                                </div>
                              ) : null}
                              <div className="hashtag_box">
                                {job.segments[0]?.hashtags.map(hashtag => {
                                  return <span className="hashtags-details">{hashtag}</span>;
                                })}
                              </div>
                            </div>
                          </TabPane>
                        )}
                      </Tabs>
                    )}
                  </div>
                )}
              </>
              <SearchDrawer2
                source={''}
                drawerModel={drawerModel}
                setDrawerModel={setDrawerModel}
                poolType={poolType}
                setPoolType={setPoolType}
                getDataFromChild={data => {
                  ApplyCommonFilter(data);
                }}
              />
            </div>
          </div>
          <div className="client-foot">
            <PaginationComp
              currentPage={pageNumber}
              totalCount={numberOfPages}
              onPageChange={page => {
                resetCurrentPage(page);
                setTableFilters({ ...tableFilters, page: page });
                dispatch(jobfilters.addPage.request(page));
              }}
            />
          </div>
          <Modal
            className="modal-wrapper"
            title="Send Alerts to"
            visible={openAlertModal}
            onCancel={() => setOpenAlertModal(false)}
            destroyOnClose={true}
            footer={[
              <Button
                key="2"
                type="primary"
                onClick={() => setIsChecked([])}
                style={{
                  background: '#212A4A',
                  borderRadius: '7px',
                  height: '26px',
                  width: '54px',
                  marginRight: '15px',
                }}
              >
                Clear
              </Button>,
              <Button
                key="1"
                type="primary"
                disabled={isChecked.length > 0 ? false : true}
                style={{
                  background: '#455177',
                  borderRadius: '7px',
                  height: '26px',
                  width: '88px',
                }}
                onClick={() => {
                  setOpenAlertModal(false);
                  sendAlertFunction();
                }}
              >
                Send Alert
              </Button>,
            ]}
          >
            <Input
              placeholder="Search"
              allowClear
              enterButton="Search"
              size="large"
              style={{
                background: '#455177',
                paddingTop: '-10px',
                boxShadow: '0px 11.9429px 24.9714px rgba(0, 0, 0, 0.02)',
                borderRadius: '6px',
                border: 'none',
                marginBottom: '10px',
              }}
              prefix={<SearchOutlined style={{ color: '#EF233C', marginRight: '3px' }} />}
              onChange={handleAlertSearch}
            />
            <div
              className="company-select"
              onClick={() => {
                if (companyUsers.length == isChecked.length && isChecked.length > 0) {
                  setIsChecked([]);
                } else {
                  companyUsers.map((user, index) => {
                    if (isChecked.length > companyUsers.length) {
                      setIsChecked([]);
                    } else {
                      setIsChecked(isChecked => [...isChecked, index]);
                    }
                  });
                }
              }}
            >
              <img
                style={{ margin: '10px 0 10px 0' }}
                alt="Company"
                src={`${USERS_BASE_URL}/${uploadPath}/${logoPath}`}
                width="47"
                height="34"
              />
              <div
                style={{
                  color: 'white',
                  fontSize: '14px',
                  letterSpacing: '0.4px',
                  marginLeft: '14px',
                }}
              >
                {name}
              </div>
            </div>
            <List
              size="small"
              dataSource={companyUsers}
              renderItem={(user, index) => (
                <List.Item style={{ paddingLeft: 0 }}>
                  <List.Item.Meta
                    style={{ alignItems: 'center' }}
                    onClick={e => {
                      if (isChecked.indexOf(index) !== -1) {
                        isChecked.splice(isChecked.indexOf(index), 1);
                        setIsChecked([...isChecked]);
                      } else {
                        setIsChecked(prev => [...prev, index]);
                      }
                    }}
                    avatar={
                      isChecked.includes(index) ? (
                        <Avatar src={CheckMark} className="checkBox" size={50}></Avatar>
                      ) : (
                        <Avatar
                          name={user.title}
                          size={50}
                          style={{ fontSize: '16px', fontWeight: '700' }}
                        ></Avatar>
                      )
                    }
                    title={
                      <div
                        style={{
                          color: 'white',
                          fontSize: '14px',
                          letterSpacing: '0.4px',
                          fontWeight: '400',
                        }}
                      >
                        {user.title}
                      </div>
                    }
                  ></List.Item.Meta>
                </List.Item>
              )}
            />
          </Modal>
        </>
      </div>
    </>
  );
};

export default JobLibrary;
