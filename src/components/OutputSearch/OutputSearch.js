import { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { pick, map, isEmpty, identity, pickBy } from 'lodash';
import {
  Row,
  Col,
  Typography,
  message as antMessage,
  Select,
  DatePicker,
  Drawer,
  Image,
} from 'antd';

import navActions from 'modules/navigation/actions';
import usersActions from 'modules/users/actions';
import companyActions from 'modules/company/action';
import groupsActions from 'modules/groups/actions';
import guestsActions from 'modules/guests/actions';
import hostsActions from 'modules/hosts/actions';
import { history } from 'store';

import { jobActions } from 'modules/jobs/actions';
import jobfilters from 'modules/jobfilters/actions';
import {
  Table,
  SearchField,
  Statement,
  VideoPlayer,
  PageNavigation,
  Button,
  LoadingPage,
  Tabs,
  ProgramInfo,
} from 'components/Common';
import SearchDrawer from '../Common/SearchDrawer';
import Topics from './components/Topics/Topics';
import HashTag from './components/Hashtags/Hashtag';
import {
  makeTextFrom,
  pascalCase,
  rowCOl,
  checkSpecialCharacterExists,
} from 'modules/common/utils';
import { USERS_BASE_URL } from 'constants/config/config.dev';
import { uploadPath } from 'constants/index';
import { DAYS, ESCALATIONS_OPTIONS, MONTHS, YEARS } from 'constants/options';
import { FilterIcon } from 'assets/icons';

import { getColumns } from './columns';

import moment from 'moment';
import CONFIG from 'config.json';

import useLocalFilter from 'hooks/useLocalFilter';
import useSearch from 'hooks/useSearch';
import PaginationComp from '../../components/Common/Pagination/PaginationComp';
import './OutputSearch.scss';
import associationsActions from 'modules/associations/actions';
import SettingIcon from '../../assets/icons/setting_icon.svg';
import { filterJobSources } from 'constants/index';
const { RangePicker } = DatePicker;
const { Text } = Typography;

const OutputSearch = () => {
  const jobInitialState = {
    translation: [],
    transcription: [],
  };
  const pageRef = useRef(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [PlayCheck, setPlayCheck] = useState(true);
  const [data, setData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [searchText2, setSearchText2] = useState('');
  const [searchUrdu, setSearchUrdu] = useState('');
  const [searchEnglish, setSearchEnglish] = useState('');
  const [disable, setDisable] = useState(true);
  const [bulkJobs, setBulkJobs] = useState([]);
  const [bulkUsers, setBulkUsers] = useState([]);
  const [bulkCheckbox, setBulkCheckbox] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const [activeTabKey, setActiveTabKey] = useState('0');
  const [job, setJob] = useState(jobInitialState);
  const [rangePickerDate, setrangePickerDate] = useState([moment().subtract(1, 'day'), moment()]);
  const user = useSelector(state => state.authReducer.user);
  const { guests } = useSelector(state => state.guestsReducer);
  const { associations } = useSelector(state => state.associationsReducer);
  const { users } = useSelector(state => state.usersReducer);
  let { totalResults } = useSelector(state => state.jobsReducer);

  const [tableFilters, setTableFilters] = useState({
    start_date: moment().format('MM/DD/YYYY'),
    end_date: moment().format('MM/DD/YYYY'),
    source: [],
    limit: 30,
    guest: '',
    escalation: '',
    association: '',
  });
  const [rowId, setRowId] = useState('');
  const [drawerModel, setDrawerModel] = useState(false);
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
  } = useSelector(state => state.jobfilterReducer);
  useEffect(() => {
    fetch('./PaginationLimit.json')
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        return setTableFilters(prev => ({ ...prev, limit: Number(data.Limit) ?? 30 }));
      });
  }, []);

  const jobs = useSelector(state => state.jobsReducer);

  useEffect(() => {
    setJob(jobs.job);
  }, [jobs.job]);
  const nextPageProps = useSelector(state => state.pageNavReducer);
  const videoCurrentTime = useSelector(state => state.commonReducer.videoCurrentTime);
  const applyLocalFilter = useLocalFilter();
  const applySearch = useSearch();
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(usersActions.getUsers.request({ role: 'Reviewer' }));
    dispatch(groupsActions.getGroups.request());
    dispatch(guestsActions.getGuests.request());
    dispatch(hostsActions.getHosts.request());
    dispatch(associationsActions.getAssociations.request());
  }, []);
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

  const handleRedirect = () => {
    if (activeTabKey === '0' || activeTabKey === '1') {
      window.location.href = `/#/marker-edit/${rowId}`;
      history.push(`/#/marker-edit/${rowId}`);
    }
    if (activeTabKey === '2' || activeTabKey === '3') {
      window.location.href = `/#/qc-edit/${rowId}`;
      history.push(`/#/qc-edit/${rowId}`);
    }
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

  const handleDrawerClose = () => {
    setJob(jobInitialState);
    setShowDrawer(false);
  };

  const disabledDate = current => {
    return current > moment();
  };

  const setEscalations = payload => {
    const newArr = [...data];
    var index = newArr.findIndex(job => job.id === payload.jobId);
    if (user.role === 'Reviewer') {
      const otherEscalations = newArr[index].escalations.filter(
        escalation => escalation.company !== user.company.id
      );
      newArr[index].escalations = [...payload.data, ...otherEscalations];
    } else {
      newArr[index].escalations = payload.data;
    }
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

  const { index, next, prev } = nextPageProps.job?.nav ?? {};
  if (totalResults === undefined) {
    totalResults = 0;
  }

  const checkStringOperatorLength = text => {
    let count = 0;
    for (let i = 0; i < text.length; i++) {
      if (text[i] == '&' || text[i] == '|') {
        count++;
      }
    }
    return count;
  };

  const d = new Date();
  useEffect(() => {
    if (tableFilters.limit !== 0) {
      if (checkStringOperatorLength(searchText) > 4 || checkStringOperatorLength(searchText2) > 4) {
        return antMessage.error('Only four operators are allowed');
      }
      if (searchUrdu === '' && searchEnglish === '') {
        dispatch(
          jobActions.fetchJobs.request({
            ...tableFilters,
            page: pageNumber,
            start_date: startDateT,
            end_date: endDateT,
            source: sourceT,
            limit: 30,
            channel: channelT,
            hosts: hostsT,
            guest: guestT,
            programType: programTypeT,
            escalation: escalationT,
            association: associationT,
          })
        );
      } else if (searchUrdu === '' && searchEnglish !== '') {
        dispatch(
          jobActions.fetchJobs.request({
            ...tableFilters,
            searchEnglish,
            start_date: startDateT,
            source: sourceT,
            page: pageNumber,
          })
        );
      } else if (searchEnglish === '' && searchUrdu !== '') {
        dispatch(
          jobActions.fetchJobs.request({
            ...tableFilters,
            searchUrdu,
            limit: 30,
            start_date: startDateT ? startDateT : moment().format(),
            source: sourceT ? sourceT : filterJobSources,
            page: pageNumber,
          })
        );
      } else if (searchUrdu.trim() !== '' && searchEnglish.trim() !== '') {
        dispatch(
          jobActions.fetchJobs.request({
            ...tableFilters,
            searchUrdu,
            searchEnglish,
            page: pageNumber,
          })
        );
      } else {
        dispatch(jobActions.fetchJobs.request({ ...tableFilters, page: pageNumber }));
      }
    }
  }, [searchUrdu, searchEnglish, tableFilters, pageNumber]);

  useEffect(() => {
    setData(jobs.results);
  }, [jobs.results]);

  const getJobIds = () => {
    let ids = [];
    for (var i = 0; i < jobs?.results?.length; i++) {
      const { id } = jobs.results[i];
      ids.push(id);
    }
    sessionStorage.setItem('job_ids', ids);
  };
  useEffect(() => {
    getJobIds();
  }, [jobs]);

  const handleTableRowClick = (index, record) => {
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
    'segmentTime',
    'thumbnailPath',
    'channelLogoPath',
    'videoPath',
  ]);

  const getGuests = () => {
    let arr = [...guests?.map(guest => ({ value: guest?.name, title: guest?.name }))];
    let unique = [...new Map(arr.map(item => [item['value'], item])).values()];
    return unique;
  };

  const getSource = () => {
    let sourceArr = [
      { value: 'All', title: 'All' },
      { value: 'Tv', title: 'TV' },
      { value: 'Online', title: 'Online' },
      { value: 'Print', title: 'Print' },
      { value: 'Social', title: 'Social' },
    ];

    return sourceArr;
  };

  const getEscalations = () => {
    let arr = [
      ...users.map(role => ({
        value: role.firstName + ' ' + role.lastName,
        title: role.firstName + ' ' + role.lastName,
      })),
    ];
    let unique = [...new Map(arr.map(item => [item['value'], item])).values()];
    return unique;
  };

  const getAssociations = () => {
    let arr = [...associations?.map(guest => ({ value: guest?.name, title: guest?.name }))];

    let unique = [...new Map(arr.map(item => [item['value'], item])).values()];
    return unique;
  };

  const handleOnFilterChange = ({ value, field }) => {
    return setTableFilters(prev => ({ ...prev, [field]: value }));
  };

  const setRowClassName = record => {
    return record.id === rowId ? 'clickRowStyl' : '';
  };
  const handleRangeChange = (dates, dateStrings) => {
    if (dateStrings[0] === '' && dateStrings[1] === '') return setrangePickerDate([]);
    if (dateStrings?.length < 1) return;
    const startdate = moment(dateStrings[0]).format();
    const enddate = moment(dateStrings[1]).format();
    const startdate1 = moment(dateStrings[0]);
    const enddate1 = moment(dateStrings[1]);
    let timeDiff = enddate1.diff(startdate1, 'month');
    if (timeDiff > 6) {
      return antMessage.error('Date difference should not be more than 6 months');
    }

    setrangePickerDate([moment(startdate), moment(enddate)]);

    dispatch(
      jobActions.fetchJobs.request({
        ...tableFilters,
        start_date: startdate,
        end_date: enddate,
        page: pageNumber,
      })
    );
    setTableFilters(prev => ({ ...prev, start_date: startdate, end_date: enddate }));
  };

  const handleSearch = () => {
    checkSpecialCharacterExists(searchText)
      ? antMessage.error('Only [& | -] operators are allowed!')
      : setSearchEnglish(searchText),
      setSearchUrdu(searchText2);
  };

  useEffect(() => {
    setNumberOfPages(jobs?.totalPages ?? 0);
  }, [jobs.totalPages]);

  const ApplyCommonFilter = data => {
    setPageNumber(1);
    pageRef.current = 1;
    dispatch(
      jobActions.fetchJobs.request({
        ...tableFilters,
        searchUrdu,
        searchEnglish,
        start_date: data.start_date,
        end_date: data.end_date,
        source: data.source,
        limit: 30,
        guest: data.guests,
        escalation: data.escalation,
        association: data.association,
        page: pageNumber,
        jobState: [...data.jobState],
        channel: data.channel,
        hosts: data.hosts,
        programType: data.programType,
      })
    );
    dispatch(
      jobfilters.addcurrentFilterData.request({
        startDate: data.start_date,
        endDate: data.end_date,
        source: data.source,
        limit: 30,
        guest: data.guests,
        escalation: data.escalation,
        association: data.association,
        page: pageNumber,
        jobState: [...data.jobState],
        channel: data.channel,
        hosts: data.hosts,
        programType: data.programType,
      })
    );
    setDrawerModel(false);
  };

  return (
    <>
      <div className="output-search-wrapper">
        <div className="filter-row-container">
          <div className="filters-wrapper">
            <div className="filter-conainer"></div>
          </div>
        </div>
        <div className="output-search-container mb-10, mt-10">
          <Row gutter={30}>
            <Col span={10}>
              <SearchField
                className="Search-field"
                placeholder="Search"
                suffix={`${totalResults} Results`}
                searchText={searchText}
                handleOnChange={e => setSearchText(e.target.value)}
                handleSearch={handleSearch}
              />
            </Col>
            <Col className="search-button" span={2}>
              <Button onClick={handleSearch} type="big" variant="secondary">
                SEARCH
              </Button>
            </Col>
            <Col span={11}>
              <SearchField
                className="Search-field"
                placeholder="یہاں تلاش کریں "
                suffix={`${totalResults} Results`}
                style={{ direction: 'RTL' }}
                searchText={searchText2}
                handleOnChange={e => setSearchText2(e.target.value)}
                handleSearch={handleSearch}
              />
            </Col>
            <Col span={1}>
              <img
                className="setting_icon"
                src={SettingIcon}
                alt="setting_icon"
                onClick={() => setDrawerModel(true)}
              />
            </Col>
          </Row>

          {job.source === 'Print' || job.source === 'Blog' || job.source === 'Social' ? (
            <Drawer
              className="output-search-drawer"
              title="Basic Drawer"
              placement="left"
              closable={false}
              onClose={handleDrawerClose}
              visible={showDrawer}
              key="left"
              width={700}
            >
              <div
                style={{
                  width: '90%',
                  display: 'flex',
                  justifyContent: 'center',
                  boxShadow: ' 0px 2px 48px rgba(0, 0, 0, 0.16)',
                  margin: '0 auto',
                  marginBottom: '5%',
                }}
              >
                <div style={{ marginTop: '5%' }}>
                  <Image
                    src={`${USERS_BASE_URL}/${uploadPath}/${programInfo.thumbnailPath}`}
                    width="25vw"
                    height="35vh"
                    fallback="placeholder.png"
                    preview={false}
                  />
                </div>
              </div>
              {job.segments && (
                <Tabs
                  type="card"
                  tabBarExtraContent={
                    user.role.toLowerCase() === 'compiler' && (
                      <Button onClick={handleRedirect} variant="secondary" type="tiny" disabled>
                        EDIT
                      </Button>
                    )
                  }
                  onChange={key => setActiveTabKey(key)}
                  size="small"
                  defaultActiveKey="0"
                  className="output-tabs"
                  tabPanes={[
                    { title: 'Topics', content: <Topics topics={job?.segments[0]?.topics} /> },
                    {
                      title: 'Hashtags',
                      content: <HashTag hashtags={job?.segments[0]?.hashtags || []} />,
                    },
                    {
                      title: 'Transcription',
                      content: (
                        <Statement
                          Ttype="Transcription"
                          height="calc(100vh - 42rem)"
                          content={
                            (job.source === 'Print' ||
                              job.source === 'Blog' ||
                              job.source === 'Social') &&
                            rowCOl(job?.transcription, videoCurrentTime, 'Transcription')
                          }
                          handleOnchange={value =>
                            dispatch(jobActions.updateByField({ field: 'transcription', value }))
                          }
                          saveIcon={job.id}
                          searchText={{ text: searchUrdu, T: 'Transcription' }}
                          setDisable={setDisable}
                          programInfo={programInfo}
                          language={job?.language?.toLowerCase()}
                          PlayCheck={PlayCheck}
                          user={user}
                          extras={false}
                        />
                      ),
                    },
                  ]}
                />
              )}
            </Drawer>
          ) : (
            <Drawer
              className="output-search-drawer"
              title="Basic Drawer"
              placement="left"
              closable={false}
              onClose={handleDrawerClose}
              visible={showDrawer}
              key="left"
              width={700}
            >
              <div
                style={{
                  width: '90%',
                  display: 'flex',
                  justifyContent: 'center',
                  boxShadow: ' 0px 2px 48px rgba(0, 0, 0, 0.16)',
                  margin: '0 auto',
                  marginBottom: '5%',
                }}
              >
                {programInfo?.videoPath?.includes('.mp4') ? (
                  <div>
                    {' '}
                    <VideoPlayer
                      src={programInfo.videoPath}
                      programInfo={programInfo}
                      isOutputSearch={true}
                      setPlayCheck={setPlayCheck}
                    />
                  </div>
                ) : (
                  <div style={{ marginTop: '5%' }}>
                    <Image
                      src={`${USERS_BASE_URL}/${uploadPath}/${programInfo.thumbnailPath}`}
                      width="25vw"
                      height="35vh"
                      fallback="placeholder.png"
                      preview={false}
                    />
                  </div>
                )}
              </div>
              {job.segments && (
                <Tabs
                  type="card"
                  tabBarExtraContent={
                    user.role.toLowerCase() === 'compiler' && (
                      <Button onClick={handleRedirect} variant="secondary" type="tiny">
                        EDIT
                      </Button>
                    )
                  }
                  onChange={key => setActiveTabKey(key)}
                  size="small"
                  defaultActiveKey="0"
                  className="output-tabs"
                  tabPanes={[
                    { title: 'Topics', content: <Topics topics={job?.segments[0]?.topics} /> },
                    {
                      title: 'Hashtags',
                      content: <HashTag hashtags={job?.segments[0]?.hashtags || []} />,
                    },
                    {
                      title: 'Transcription',
                      content: (
                        <Statement
                          Ttype="Transcription"
                          height="calc(100vh - 42rem)"
                          content={
                            (job?.source === 'Tv' || job?.source === 'Online') &&
                            rowCOl(job?.transcription, videoCurrentTime, 'Transcription')
                          }
                          handleOnchange={value =>
                            dispatch(jobActions.updateByField({ field: 'transcription', value }))
                          }
                          saveIcon={job.id}
                          searchText={{ text: searchUrdu, T: 'Transcription' }}
                          setDisable={setDisable}
                          programInfo={programInfo}
                          language={job?.language?.toLowerCase()}
                          PlayCheck={PlayCheck}
                          user={user}
                          extras={false}
                        />
                      ),
                    },
                    {
                      title: 'Translation',
                      content: (
                        <Statement
                          Ttype="Translation"
                          height="calc(100vh - 42rem)"
                          content={rowCOl(job?.translation, videoCurrentTime, 'Translation')}
                          handleOnchange={value =>
                            dispatch(jobActions.updateByField({ field: 'translation', value }))
                          }
                          saveIcon={job.id}
                          searchText={{ text: searchEnglish, T: 'Translation' }}
                          setDisable={setDisable}
                          programInfo={programInfo}
                          PlayCheck={PlayCheck}
                          user={user}
                          extras={false}
                        />
                      ),
                    },
                  ]}
                />
              )}
            </Drawer>
          )}
        </div>

        <div className="list-container">
          <Table
            columns={columns}
            rowKey={(record, index) => {
              record.id;
            }}
            data={data ?? []}
            pagination={false}
            loading={jobs.loading}
            onRow={(record, index) => {
              return {
                onClick: event => {
                  handleTableRowClick(index, record), setRowId(record.id);
                  setShowDrawer(true);
                },
              };
            }}
            rowClassName={setRowClassName}
          />
          <SearchDrawer
            source={''}
            drawerModel={drawerModel}
            setDrawerModel={setDrawerModel}
            getDataFromChild={data => {
              ApplyCommonFilter(data);
            }}
          />
          <PaginationComp
            currentPage={pageNumber}
            totalCount={numberOfPages}
            onPageChange={page => {
              pageRef.current = page;
              setPageNumber(page);
              dispatch(jobfilters.addPage.request(page));
            }}
          />
        </div>
      </div>
    </>
  );
};

export default OutputSearch;
