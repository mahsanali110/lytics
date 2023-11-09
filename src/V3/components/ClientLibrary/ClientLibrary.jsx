import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { pick } from 'lodash';
import { Tabs, Row, Col, message as antMessage, Image, Modal, List, Input } from 'antd';

import './ClientLibrary.scss';

import { USERS_BASE_URL } from 'constants/config/config.dev';
import { filterJobSources, uploadPath } from 'constants/index';
import { rowCOl, formatDate, sourceBtn, checkSpecialCharacterExists } from 'modules/common/utils';

import { CloseOutlined } from '@ant-design/icons';
import { SearchOutlined } from '@ant-design/icons';
import CheckMark from 'assets/icons/checkmark.svg';
import SettingIcon from 'assets/icons/setting_icon.svg';
import Avatar from 'react-avatar';

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

import {
  LoadingPage,
  Table,
  SearchField,
  Statement,
  VideoPlayer,
  Button as OldButton,
} from 'components/Common';

import {
  AdvanceSearchDrawer,
  V3Tabs,
  V3Table,
  EmptyPlaceHolder,
  Pagination,
} from 'V3/components/Common';
import { LibraryHeader, PreviewHeader, PreviewContent, PreviewFooter } from './section';
import { getColumns } from './section/LibraryTableColumns/LibraryTableColumns';

const jobInitialState = {
  translation: [],
  transcription: [],
};
function ClientLibrary() {
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
  const [showPreview, setShowPreview] = useState(false);
  const [statementFontSize, setStatementFontSize] = useState(15);

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
    // dispatch(jobActions.setLoading({ loading: false }));
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
    setShowPreview(false);
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
    // dispatch(jobActions.setLoading({ loading: true }));
    // dispatch(jobActions.getJobByIdFromReducer({ jobId: record.id }));
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
    return record.id === rowId ? 'active-row' : '';
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

  const handleOnChange = useCallback(value => {
    setSearchText(value);
    setActiveSearch('primary');
    setTranscriptionText('');
  }, []);

  const handleShowPreview = value => {
    if (value === false) setRowId(null); // remove table row indicator after closing preview
    setShowPreview(value);
  };

  const handleRemovePreset = () => {
    resetCurrentPage();
    setTableFilters({ ...InitialState, searchText: searchText }),
      dispatch(jobActions.setHash.request({ isRedirect: false })),
      dispatch(
        filterActions.defaultPreset.request({
          ...InitialState,
          appliedPreset: '',
        })
      );
  };

  const handleFont = s => {
    if (statementFontSize + s <= 20 && statementFontSize + s >= 12) {
      setStatementFontSize(statementFontSize + s);
    }
  };

  const TabOneContent = (
    <section className="table-pagination-wrapper">
      <div className="v3-table-container">
        <V3Table
          columns={columns}
          rowKey={(record, index) => {
            record.id;
          }}
          data={data ?? []}
          pagination={false}
          disable={jobs.loading || loading}
          loading={jobs.loading && RowClickLoading == false}
          scroll={{ y: true }}
          showSorterTooltip={false}
          sortDirections={[]}
          locale={{
            emptyText: (
              <EmptyPlaceHolder
                message={
                  'Try searching with Urdu keywords or check spelling for better search accuracy.'
                }
              />
            ),
          }}
          // sorter={false}
          // sortOrder={false}

          onRow={(record, index) => {
            return {
              onClick: event => {
                handleTableRowClick(index, record);
                setRowId(record.id);
                setActiveTabKey('1');
                setTranscriptionText('');
                setShowPreview(true);
              },
            };
          }}
          rowClassName={setRowClassName}
        />
      </div>
      <div className="v3-pagination-container">
        <Pagination
          currentPage={pageNumber}
          totalCount={numberOfPages}
          onPageChange={page => {
            resetCurrentPage(page);
            setTableFilters({ ...tableFilters, page: page });
            dispatch(jobfilters.addPage.request(page));
          }}
        />
      </div>
    </section>
  );
  return (
    <div className="ClientLibrary">
      <LibraryHeader
        searchText={searchText}
        handleOnChange={handleOnChange}
        setDrawerModel={setDrawerModel}
        drawerModel={drawerModel}
        handleSearch={handleSearch}
      />

      {tableFilters?.appliedPreset ? (
        <section className="job-count-section">
          <span className="d-block fw-600">{`${jobs?.totalResults ?? 0} Results`}</span>
        </section>
      ) : null}

      <section className="main-content-section">
        <div className="col col-1">
          <V3Tabs
            onChange={key => {
              key != 10
                ? (setNumberOfPages(jobs?.totalPages), setActiveTabKey(key))
                : (setActiveTabKey(key), setNumberOfPages(0));
            }}
            tabPanes={[
              { title: 'Library', content: TabOneContent },
              // { title: 'Company', content: <h1>content2</h1> },
            ]}
            defaultActiveKey="0"
            // tabBarExtraContent={<button>button</button>}
          />
        </div>
        <div className={`col col-2 ${!showPreview && 'd-none'}`}>
          {loading ? (
            <div className="loading-page-wrapper">
              <LoadingPage />
            </div>
          ) : (
            <>
              {' '}
              <div className="preview-section-header">
                <PreviewHeader onClose={handleShowPreview} />
              </div>
              <div className="preview-section-body">
                <PreviewContent
                  setPlayCheck={setPlayCheck}
                  setDisable={setDisable}
                  searchText={{
                    text:
                      activeSearch === 'primary'
                        ? searchText.toLowerCase()
                        : transcriptionText.toLowerCase(),
                    T: 'Transcription',
                  }}
                  handleOnchange={value =>
                    dispatch(jobActions.updateByField({ field: 'transcription', value }))
                  }
                  PlayCheck={PlayCheck}
                  job={job}
                  statementFontSize={statementFontSize}
                />
              </div>
              <div className="preview-section-footer">
                <PreviewFooter
                  handleOnChange={value => {
                    setTranscriptionText(value);
                    setActiveSearch('secondary');
                    setSearchText('');
                  }}
                  searchText={transcriptionText}
                  handleFont={handleFont}
                />
              </div>
            </>
          )}
        </div>
      </section>

      <AdvanceSearchDrawer
        source={''}
        drawerModel={drawerModel}
        setDrawerModel={setDrawerModel}
        poolType={poolType}
        setPoolType={setPoolType}
        getDataFromChild={data => {
          ApplyCommonFilter(data);
        }}
        handleRemovePreset={handleRemovePreset}
      />

      {
        ////////////////////////////////////////////////////
        // ==================Alert PopUp==================//
        ///////////////////////////////////////////////////
      }

      <Modal
        className="modal-wrapper"
        title="Send Alerts to"
        visible={openAlertModal}
        onCancel={() => setOpenAlertModal(false)}
        destroyOnClose={true}
        footer={[
          <OldButton
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
          </OldButton>,
          <OldButton
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
          </OldButton>,
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
    </div>
  );
}

export default ClientLibrary;
