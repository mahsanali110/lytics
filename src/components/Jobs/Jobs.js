import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { pick, map, result } from 'lodash';
import moment from 'moment';
import {
  getStatusColor,
  getPriorityColor,
  pascalCase,
  formatDate,
  checkSpecialCharacterExists,
} from 'modules/common/utils';
import { Pagination, Image, Button as B, message, DatePicker, Select } from 'antd';
import { ReloadOutlined, DownloadOutlined } from '@ant-design/icons';
import { CalendarIcon, ClockIcon } from 'assets/icons';
import { CSVLink } from 'react-csv';
import { Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingPage } from 'components/Common';
import useSearch from 'hooks/useSearch';
import navActions from 'modules/navigation/actions';
import { jobActions } from 'modules/jobs/actions';
import { uploadPath } from 'constants/index';
import { Table, Taskbar, Button, SearchField } from 'components/Common';
import axios from 'axios';
import './Jobs.scss';
import { USERS_BASE_URL } from 'constants/config';
import { saveAs } from 'file-saver';
import { message as antMessage } from 'antd';
import { tvColumns } from './tvColumns';
import { blogColumns } from './blogColumns';
import { printColumns } from './printColumns';
import { onlineColumns } from './onlineColumns';
import PaginationComp from '../../components/Common/Pagination/PaginationComp';
import SearchDrawer from '../Common/SearchDrawer';
import jobfilters from 'modules/jobfilters/actions';
import { twitterColumns } from './twitterColumn';
import { tickerColumns } from './tickerColumn';
const { RangePicker } = DatePicker;
var num = 1;
const Jobs = ({ history, jobSource }) => {
  const format = 'YYYY-MM-DDTHH:mm:ss';
  const jobs = useSelector(state => state.jobsReducer);
  const { loading } = useSelector(state => state.jobsReducer);
  const user = useSelector(state => state.authReducer.user);
  const { statuses, startDate, endDate, filterPage } = useSelector(state => state.jobfilterReducer);
  const [source, setSource] = useState(jobSource);
  const [pageNumber, setPageNumber] = useState(filterPage !== '' ? filterPage : 1);
  const [dateCheck, setDateCheck] = useState(false);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [rangePickerDate, setrangePickerDate] = useState([
    localStorage.getItem('start_date')
      ? moment(localStorage.getItem('start_date'))
      : moment().subtract(1, 'day'),
    localStorage.getItem('end_date') ? moment(localStorage.getItem('end_date')) : moment(),
  ]);
  const dateRef = useRef(null);
  const limitRef = useRef(20);
  const pageRef = useRef(1);
  const [tableFilters, setTableFilters] = useState({
    start_date: moment().format(),
    end_date: moment().format(),
    source: source,
  });
  const [drawerModel, setDrawerModel] = useState(false);
  useEffect(() => {
    dispatch(
      jobfilters.addDate.request([
        moment(dateRef.current.props.defaultValue[0]).format(format),
        moment(dateRef.current.props.defaultValue[1]).format(format),
      ])
    );
    localStorage.setItem(
      'start_date',
      moment(dateRef.current.props.defaultValue[0]).format(format)
    );
    localStorage.setItem('end_date', moment(dateRef.current.props.defaultValue[1]).format(format));
    if (dateRef.current) {
      setTableFilters(prev => ({
        ...prev,
        start_date: moment(dateRef.current.props.defaultValue[0]).format(format),
        end_date: moment(dateRef.current.props.defaultValue[1]).format(format),
      }));
    }
  }, [dateRef.current]);
  let statusArray = [
    { value: 'Ready for QC', label: 'Ready for QC' },
    { value: 'Ready for Marking', label: 'Ready for Marking' },
    { value: 'Clipping', label: 'Clipping' },
    { value: 'Transcribing', label: 'Transcribing' },
    { value: 'Completed', label: 'Completed' },
    { value: 'Failed', label: 'Failed' },
  ];
  let statusArrayMarker = [
    { value: 'Ready for Marking', label: 'Ready for Marking' },
    { value: 'Completed', label: 'Completed' },
  ];

  useEffect(() => {
    if (statuses.length) return;
    const defaultStatuses =
      user.role === 'QC'
        ? statuses?.length > 0
          ? statuses
          : [statusArray[0].value, statusArray[1].value, statusArray[2].value, statusArray[3].value]
        : [statusArrayMarker[0].value];
    dispatch(jobfilters.addstatus.request([...defaultStatuses]));
  }, []);
  // const [statusFilter, setStatusFilter] = useState(  // for common filter
  //   user.role === 'QC'
  //     ? statuses?.length > 0
  //       ? statuses
  //       : [
  //           statusArray[0].value,
  //           statusArray[1].value,
  //           statusArray[2].value,
  //           statusArray[3].value,
  //           statusArray[4].value,
  //           statusArray[5].value,
  //         ]
  //     : [statusArrayMarker[0].value]
  // );

  const [statusFilter, setStatusFilter] = useState(
    // for component filter
    user.role === 'QC'
      ? statuses?.length > 0
        ? statuses
        : [statusArray[0].value, statusArray[1].value, statusArray[2].value, statusArray[3].value]
      : [statusArrayMarker[0].value]
  );
  // useEffect(() => {
  //   dispatch(jobfilters.addstatus.request([statusArray[0].value, statusArray[1].value]));   // old filter
  // }, []);
  const [limit, setLimit] = useState(20);
  const [data, setData] = useState([]);
  // const [pagination, setPagination] = useState(11);
  const [searchText, setSearchText] = useState('');
  const [searchFilters, setSearchFilters] = useState([]);
  // const [thumbnailPaths, setThumbnailPaths] = useState('');
  const dispatch = useDispatch();
  // const applySearch = useSearch();
  const [visible, setVisible] = useState(false);
  const [total, setTotal] = useState();
  // const [active, setActive] = useState(num);
  const [time, setTime] = useState(Date.now());
  // const [controlInterval, setControlInterval] = useState(true);
  const [downloadicon, setdownloadicon] = useState(true);
  // const [loader, setloader] = useState(true);
  var count = 0;
  useEffect(() => {
    setNumberOfPages(jobs?.totalPages ?? 0);
  }, [jobs.totalPages]);
  // useEffect(() => {
  //   let interval = setInterval(() => setTime(fetchData(false)), 10000);
  //   return () => {
  //     clearInterval(interval);
  //   };
  // }, [searchText, statusFilter, source, statuses, startDate, endDate, filterPage]);
  useEffect(() => {
    fetch('./PaginationLimit.json')
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        limitRef.current = Number(data.Limit);
        return setLimit(Number(data.Limit) ?? 20);
      });
  }, []);
  useEffect(() => {
    if (limit > 0) {
      fetchData(true);
    }
  }, [source, pageNumber, limit]);
  useEffect(() => {
    getJobIds();
    setTotal(jobs?.results?.length);
    setData(jobs?.results.filter((_, ind) => ind < limitRef.current));
  }, [jobs?.results]);
  useEffect(() => {
    !searchText && setData(jobs?.results);
  }, [searchText]);

  const fetchData = loading => {
    // for component filter
    localStorage.setItem(
      'start_date',
      moment(dateRef.current.props.defaultValue[0]).format(format)
    );
    localStorage.setItem('end_date', moment(dateRef.current.props.defaultValue[1]).format(format));
    dispatch(
      jobActions.fetchJobs.request({
        source,
        start_date: localStorage.getItem('start_date')
          ? moment(localStorage.getItem('start_date')).format(format)
          : moment(dateRef.current.props.defaultValue[0]).format(format),
        end_date: localStorage.getItem('end_date')
          ? moment(localStorage.getItem('end_date')).format(format)
          : moment(dateRef.current.props.defaultValue[1]).format(format),
        searchText,
        searchFilters,
        page: filterPage ? filterPage : pageRef.current,
        jobState: statuses?.length > 0 ? statuses : statusFilter,
        limit: Number(limitRef.current),
        loading,
      })
    );

    setVisible(false);
  };

  // const fetchData = loading => { // for common filter
  //   dispatch(
  //     jobActions.fetchJobs.request({
  //       source, // coming from parent
  //       start_date: startDate ? startDate : moment().subtract(moment().hours(), 'h').format(),
  //       end_date: endDate ? endDate : moment().add(23, 'hours').format(),
  //       searchText,
  //       searchFilters,
  //       page: filterPage ? filterPage : pageRef.current,
  //       jobState: statuses ? statuses : statusFilter,
  //       limit: Number(limitRef.current),
  //       loading,
  //     })
  //   );

  //   setVisible(false);
  // };
  const handleRefreshBtn = (e, requestedJob) => {
    dispatch(jobActions.refreshJob.request(requestedJob));
  };
  const getTaskbarInfo = () => {
    let count = 0;
    data?.map(job => {
      (job.jobState === 'Completed' || job.jobState === 'Ready for Marking') && count++;
    });
    const completedPercent = (count / total) * 100;
    return { completedPercent, total, count };
  };
  const disabledDate = current => {
    return current > moment();
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
      setDateCheck(true);
      return antMessage.error('Date difference should not be more than 6 months');
    }
    setDateCheck(false);
    setrangePickerDate([moment(startdate), moment(enddate)]);
    dispatch({
      type: 'SET_RANGEPICKER_DATE',
      payload: {
        startdate: startdate,
        enddate: enddate,
      },
    });
    setTableFilters(prev => ({ ...prev, start_date: startdate, end_date: enddate }));
  };
  // @this method will download video from actus server directly if the cors are enabled on Actus server
  // const downloadVideo = link => {
  //   axios({
  //     url: link,
  //     method: 'GET',
  //     responseType: 'blob',
  //     crossdomain: true,
  //   }).then(response => {
  //     // const url = window.URL.createObjectURL(new Blob([response.data]));
  //     var blob = new Blob([response.data], {
  //       type: 'video/mp4',
  //     });
  //     saveAs(blob, 'video.mp4');
  //   });
  // };
  const download = async (video_name, record) => {
    antMessage.success('Video Downloading Initiated', 2);
    let status;
    setdownloadicon(false);
    let jobId = record.id;
    await updateBool(jobId, true);
    fetchData();
    await axios
      .head(`${USERS_BASE_URL}/${uploadPath}/${video_name.split('/')[1]}`)
      .then(res => {
        status = res.status;
      })
      .catch(error => {
        status = error.message;
      });
    if (status == 200) {
      var video = `${USERS_BASE_URL}/${uploadPath}/${video_name.split('/')[1]}`;
      axios({
        url: video,
        method: 'GET',
        responseType: 'blob',
        crossdomain: true,
      })
        .then(response => {
          var blob = new Blob([response.data], {
            type: 'video/mp4',
          });
          updateBool(jobId, false);
          saveAs(blob, `${video_name}`);
          setdownloadicon(true);
          antMessage.success('Video Downloaded Successfully', 2);
        })
        .catch(error => {
          updateBool(jobId, false);
          setdownloadicon(true);
          antMessage.error('Video Downloaded Failed', 2);
        });
    } else if (status == 'Request failed with status code 404') {
      await axios.post(`${USERS_BASE_URL}/jobs/download-video`, { video_name, jobId }).then(res => {
        if (res.data == 'ok') {
          var video = `${USERS_BASE_URL}/${uploadPath}/${video_name.split('/')[1]}`;
          axios({
            url: video,
            method: 'GET',
            responseType: 'blob',
            crossdomain: true,
          })
            .then(response => {
              var blob = new Blob([response.data], {
                type: 'video/mp4',
              });
              updateBool(jobId, false);
              saveAs(blob, `${video_name}`);
              setdownloadicon(true);
              antMessage.success('Video Downloaded Successfully', 5);
            })
            .catch(error => {
              updateBool(jobId, false);
              setdownloadicon(true);
              antMessage.error('Video Downloaded Failed', 5);
            });
        } else if (res.data == 'Video Not Found') {
          updateBool(jobId, false);
          setdownloadicon(true);
          antMessage.error('Video Not Found', 5);
        }
      });
    }
  };
  const updateBool = async (jobId, _bool) => {
    let ans = await axios.post(`${USERS_BASE_URL}/jobs/update-video-bool`, { jobId, _bool });
    if (ans.data == 'updated') {
      fetchData();
      setdownloadicon(true);
    }
  };
  const getFormatedJobs = () =>
    map(data, job =>
      pick(job, [
        'id',
        'programName',
        'programType',
        'priority',
        'jobState',
        'programDate',
        'programTime',
        'segmentStartTime',
        'jobState',
        'thumbnailPath',
        'channelLogoPath',
        'language',
        'videoPath',
        'activeDownload',
        'author',
        'articleName',
        'articleType',
        'videoTitle',
        'videoType',
        'publisher',
        'source',
        'locked',
        'channel',
      ])
    );

  const getJobsDetailUri = role => {
    const jobsDetailByRole = {
      QC: '/qc-edit',
      Marker: 'marker-edit',
    };
    return jobsDetailByRole[role];
  };
  const redirectToJobsDeails = id => {
    const uri = getJobsDetailUri(user.role);
    if (!uri) return;
    // window.location.href = `/#${uri}/${id}`;
    history.push(`${uri}/${id}`);
    // location.reload();
  };
  const handleTableRowClick = (index, record) => {
    if (record.locked) {
      let lockOBJ = null;
      if ((record.locked.role = user.role)) {
        lockOBJ = record;
      }
      let dateoflocked = new Date(lockOBJ.locked.lockedAt);
      let currentDate = new Date();
      let time = currentDate - dateoflocked;
      time = time / 1000 / 60;
      if (time < 5) {
        antMessage.info(`${lockOBJ.locked.name} is working on it!`, 2);
        return;
      } else {
        // unlock call
        dispatch(jobActions.unlockJob.request({ id: record.id }));
      }
    }
    dispatch(jobActions.lockJob.request({ id: record.id }));
    dispatch(navActions.updateLink({ type: 'job', index }));
    redirectToJobsDeails(record.id);
    dispatch({ type: 'SET_SOURCE', payload: source });
  };
  const getJobIds = () => {
    let ids = [];
    for (var i = 0; i < jobs.results?.length; i++) {
      const { jobState, id } = jobs.results[i];
      // if (num == 5) {
      //   if (jobState === 'Completed') ids.push(id);
      // } else {
      //   if (jobState === 'Ready for Marking' || jobState === 'Ready for QC') ids.push(id);
      // }

      if (
        jobState === 'Completed' ||
        jobState === 'Ready for Marking' ||
        jobState === 'Ready for QC'
      ) {
        ids.push(id);
      }
    }
    sessionStorage.setItem('job_ids', ids);
    // dispatch({ type: 'NAVS', payload: ids });
  };

  const handleOnChange = e => {
    const { value } = e.target;
    setSearchText(value);
  };

  const handleSearch = () => {
    if (checkSpecialCharacterExists(searchText)) {
      return antMessage.error('Only [& | -] operators are allowed!');
    }

    fetchData();
  };

  // let headers = [
  //   { label: 'Date & Time', key: 'programDate' },
  //   { label: 'Channel', key: 'channel' },
  //   { label: 'Thumbnails', key: 'thumbnailPath' },
  //   { label: 'Program Title', key: 'programName' },
  //   { label: 'Program Type', key: 'programType' },
  //   { label: 'Status', key: 'jobState' },
  //   { label: 'Priority', key: 'priority' },
  // ];
  const formateTime = time => {
    const [startTime, endTime] = time?.split(' to ') ?? [];
    let ST = moment(startTime, ['hh:mm:ss A']);
    let ET = moment(endTime, ['hh:mm:ss A']);
    var t = ST.format('HH:mm:ss') + ' to ' + ET.format('HH:mm:ss');
    return t;
  };
  const columns = [
    {
      title: 'Date & Time',
      dataIndex: 'dataTime',
      sorter: true,
      sorter: (a, b) => moment(a.programDate).unix() - moment(b.programDate).unix(),
      render: (text, record) => {
        return (
          <div style={{ textAlign: 'left', paddingLeft: '30px' }}>
            <div style={{ marginBottom: '5px' }}>
              <span className="table-icon-wrapper">
                <CalendarIcon />
              </span>{' '}
              <span className="text-white">{formatDate(record.programDate, 'DD MMMM YYYY')}</span>
            </div>
            <div>
              <span className="table-icon-wrapper">
                <ClockIcon />
              </span>{' '}
              {formateTime(record.programTime)}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Channel',
      dataIndex: 'channel',
      sorter: true,
      sorter: (a, b) => a.channel.length - b.channel.length,
      //sortDirections: ['descend'],
      render: (text, record) => {
        const logo = `${USERS_BASE_URL}/${uploadPath}/${record.channelLogoPath}`;
        return (
          <figure>
            <Image
              width={45}
              style={{ marginTop: '10px' }}
              src={logo}
              preview={false}
              fallback="placeholder.png"
            />
            <figcaption>{text}</figcaption>
          </figure>
        );
      },
    },
    {
      title: 'Thumbnails',
      dataIndex: 'thumbnailPath',
      sorter: false,
      render: (text, record) => {
        const thumbnail = `${USERS_BASE_URL}/${uploadPath}/${record.thumbnailPath}`;
        return (
          <Image
            width={120}
            height={70}
            src={thumbnail}
            preview={false}
            fallback="placeholder.png"
          />
        );
      },
    },
    {
      title: 'Program Title',
      dataIndex: 'programName',
      sorter: true,
      sorter: (a, b) => a.programName.localeCompare(b.programName),
    },
    {
      title: 'Language',
      dataIndex: 'language',
      sorter: true,
      sorter: (a, b) => a.language.localeCompare(b.language),
    },
    {
      title: 'Program Type',
      dataIndex: 'programType',
      sorter: true,
      sorter: (a, b) => a.programType.localeCompare(b.programType),
    },
    {
      title: 'Status',
      dataIndex: 'jobState',
      sorter: true,
      sorter: (a, b) => a.jobState.localeCompare(b.jobState),
      // sortDirections: ['descend'],
      render: (text, record) => {
        let id = record;
        if (text === 'Failed' || text === 'Quota Exceeded') {
          return (
            <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
              <span className={`${getStatusColor(text)}`}> {text} </span>
              <span className="info-icon-wrapper">
                <B
                  onClick={(e, record) => {
                    handleRefreshBtn(e, id);
                  }}
                  style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                >
                  <ReloadOutlined style={{ color: 'white' }} />
                </B>
              </span>
            </div>
          );
        }
        return (
          <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
            <span className={`${getStatusColor(text)}`}> {text} </span>
          </div>
        );
      },
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      sorter: true,
      sorter: (a, b) => a.priority.localeCompare(b.priority),
      render: (text, record) => {
        return (
          <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
            <span> {pascalCase(text)} </span>
          </div>
        );
      },
    },
    // {
    //   title: 'Download',
    //   dataIndex: 'videoPath',
    //   sorter: (a, b) => a.priority.localeCompare(b.priority),
    //   sorter: false,
    //   render: (text, record) => {
    //     return record.jobState !== 'Clipping' ? (
    //       <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
    //         <span>
    //           {record?.activeDownload == true ? (
    //             <Spin />
    //           ) : (
    //             <DownloadOutlined
    //               className="download-icon"
    //               onClick={e => {
    //                 e.stopPropagation();
    //                 download(text, record);
    //               }}
    //             />
    //           )}
    //         </span>
    //       </div>
    //     ) : null;
    //   },
    // },
  ];
  const onlineColumns = [
    {
      title: 'Date & Time',
      dataIndex: 'dataTime',
      sorter: true,
      sorter: (a, b) => moment(a.programDate).unix() - moment(b.programDate).unix(),
      render: (text, record) => {
        return (
          <div style={{ textAlign: 'left', paddingLeft: '30px' }}>
            <div style={{ marginBottom: '5px' }}>
              <span className="table-icon-wrapper">
                <CalendarIcon />
              </span>{' '}
              <span className="text-white">{formatDate(record.programDate, 'DD MMMM YYYY')}</span>
            </div>
            <div>
              <span className="table-icon-wrapper">
                <ClockIcon />
              </span>{' '}
              {formateTime(record.programTime)}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Channel',
      dataIndex: 'channel',
      sorter: true,
      sorter: (a, b) => a.channel.length - b.channel.length,
      //sortDirections: ['descend'],
      render: (text, record) => {
        const logo = `${USERS_BASE_URL}/${uploadPath}/${record.channelLogoPath}`;
        return (
          <figure>
            <Image
              width={45}
              style={{ marginTop: '10px' }}
              src={logo}
              preview={false}
              fallback="placeholder.png"
            />
            <figcaption>{text}</figcaption>
          </figure>
        );
      },
    },
    {
      title: 'Publisher',
      dataIndex: 'publisher',
      sorter: true,
      sorter: (a, b) => a && a.publisher && a.publisher.localeCompare(b.publisher),
    },
    {
      title: 'Thumbnails',
      dataIndex: 'thumbnailPath',
      sorter: false,
      render: (text, record) => {
        const thumbnail = `${USERS_BASE_URL}/${uploadPath}/${record.thumbnailPath}`;
        return (
          <Image
            width={120}
            height={70}
            src={thumbnail}
            preview={false}
            fallback="placeholder.png"
          />
        );
      },
    },
    {
      title: 'Video Title',
      dataIndex: 'programName',
      sorter: true,
      sorter: (a, b) => a.programName.localeCompare(b.programName),
    },
    {
      title: 'Video Type',
      dataIndex: 'programType',
      sorter: true,
      sorter: (a, b) => a.programType.localeCompare(b.programType),
    },
    {
      title: 'Language',
      dataIndex: 'language',
      sorter: true,
      sorter: (a, b) => a.language.localeCompare(b.language),
    },
    {
      title: 'Status',
      dataIndex: 'jobState',
      sorter: true,
      sorter: (a, b) => a.jobState.localeCompare(b.jobState),
      // sortDirections: ['descend'],
      render: (text, record) => {
        let id = record;
        if (text === 'Failed' || text === 'Quota Exceeded') {
          return (
            <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
              <span className={`${getStatusColor(text)}`}> {text} </span>
              <span className="info-icon-wrapper">
                <B
                  onClick={(e, record) => {
                    handleRefreshBtn(e, id);
                  }}
                  style={{ backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
                >
                  <ReloadOutlined style={{ color: 'white' }} />
                </B>
              </span>
            </div>
          );
        }
        return (
          <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
            <span className={`${getStatusColor(text)}`}> {text} </span>
          </div>
        );
      },
    },
    {
      title: 'Priority',
      dataIndex: 'priority',
      sorter: true,
      sorter: (a, b) => a.priority.localeCompare(b.priority),
      render: (text, record) => {
        return (
          <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
            <span> {pascalCase(text)} </span>
          </div>
        );
      },
    },
  ];

  const handleFilterButtonClick = () => {
    setPageNumber(1);
    pageRef.current = 1;
    dispatch(jobfilters.addPage.request('1'));
    dispatch(
      jobfilters.addDate.request([
        dateRef.current.props.defaultValue[0],
        dateRef.current.props.defaultValue[1],
      ])
    );
    dispatch(jobfilters.addstatus.request([...statusFilter]));
    localStorage.setItem(
      'start_date',
      moment(dateRef.current.props.defaultValue[0]).format(format)
    );
    localStorage.setItem('end_date', moment(dateRef.current.props.defaultValue[1]).format(format));
    dispatch(
      jobActions.fetchJobs.request({
        source,
        start_date: moment(dateRef.current.props.defaultValue[0]).format(format),
        end_date: moment(dateRef.current.props.defaultValue[1]).format(format),
        searchText,
        searchFilters,
        page: pageRef.current,
        jobState: statusFilter,
        limit: Number(limitRef.current),
        loading,
      })
    );
  };
  const handleStatusFilterChange = values => {
    setStatusFilter([...values]);
    dispatch(jobfilters.addstatus.request([...values]));
  };
  // const ApplyCommonFilter = data => { // for common filter
  //   setChildData({ ...data });
  //   setPageNumber(1);
  //   pageRef.current = 1;
  //   dispatch(jobfilters.addPage.request('1'));
  //   dispatch(jobfilters.addDate.request([data.start_date, data.end_date]));
  //   dispatch(jobfilters.addstatus.request([...data.jobState]));
  //   dispatch(
  //     jobActions.fetchJobs.request({
  //       source,
  //       start_date: data.start_date,
  //       end_date: data.end_date,
  //       jobState: [...data.jobState],
  //       // programFromTime: moment(data.programFromTime),
  //       // programToTime: moment(data.programToTime), //
  //       channel: data.channel, //
  //       hosts: data.hosts, //
  //       guests: data.guests, //
  //       programType: data.programType, //
  //       searchText,
  //       searchFilters,
  //       page: pageRef.current,
  //       limit: Number(limitRef.current),
  //       loading,
  //     })
  //   );
  // };
  return (
    <>
      {visible ? (
        <LoadingPage />
      ) : (
        <div className="jobs-wrapper">
          <div className="page-header-wrapper">
            <Taskbar
              title="Progress"
              barOneStartColor="#fc324b"
              barOneEndColor="#EF233C"
              barOnePercentage={getTaskbarInfo().completedPercent}
              barOneText={`${getTaskbarInfo().total} Jobs `}
              completedText={`${getTaskbarInfo().count} Jobs `}
            />
            <SearchField
              style={{ marginTop: '0px !important', marginLeft: '1vh' }}
              className="Search-field"
              searchText={searchText}
              handleOnChange={handleOnChange}
              handleSearch={handleSearch}
              maxLength="32"
            />
            {/* <Button variant="secondary" type="big">
              <CSVLink data={data} headers={headers} filename={`Week ${weekPage} Jobs.csv`}>
                EXPORT RESULTS
              </CSVLink>
            </Button> */}
          </div>
          <div className="filter-row-container">
            <div className="filters-wrapper">
              <span style={{ color: 'white' }}>Date : </span>
              <RangePicker
                ref={dateRef}
                style={{ margin: '0px 5px', backgroundColor: '#1b1d28 !important' }}
                onChange={handleRangeChange}
                className="form-input"
                disabledDate={disabledDate}
                defaultValue={rangePickerDate}
              />
              <div className="filter-conainer">
                <span style={{ color: 'white', marginLeft: 10 }}>Status : </span>
                <Select
                  name="ReadyForFilter"
                  getPopupContainer={trigger => trigger.parentNode}
                  value={statusFilter}
                  onChange={e => handleStatusFilterChange(e)}
                  options={user.role === 'Marker' ? statusArrayMarker : statusArray}
                  allowClear
                  maxTagCount="responsive"
                  showSearch
                  mode="multiple"
                  style={{ width: '150px', marginLeft: 5 }}
                />
              </div>
              <div className="button-actions-container">
                <Button
                  onClick={handleFilterButtonClick}
                  type="small"
                  variant="secondary"
                  style={{ marginLeft: 10 }}
                  disabled={dateCheck ? true : false}
                >
                  APPLY FILTERS
                </Button>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ height: 'calc(100vh - 19rem)' }}>
              {source === 'Tv' ? (
                <Table
                  loading={loading}
                  columns={columns}
                  scroll={{ y: 'calc(100vh - 24.5rem)' }}
                  showSorterTooltip={false}
                  rowKey={record => record.id}
                  data={getFormatedJobs()}
                  pagination={false}
                  // scroll={{ y: 630 }}
                  onRow={(record, index) => {
                    if (record.jobState === 'Failed' || record.jobState === 'Quota Exceeded') {
                      return;
                    }
                    return {
                      onClick: event => handleTableRowClick(index, record), // click row
                    };
                  }}
                  rowClassName={record => {
                    let classes = 'animate__animated animate__slideInLeft';
                    if (['Clipping', 'Transcripting', 'Transcribing'].includes(record.jobState))
                      classes = `${classes} 'disabled-row'`;
                    if (record.locked === true && record.role === user.role)
                      classes = `${classes} 'locked-row'`;
                    return classes;
                  }}
                />
              ) : source === 'Online' ? (
                <Table
                  scroll={{ y: 'calc(100vh - 24.5rem)' }}
                  loading={loading}
                  columns={onlineColumns}
                  showSorterTooltip={false}
                  rowKey={record => record.id}
                  data={getFormatedJobs()}
                  pagination={false}
                  // scroll={{ y: 630 }}
                  onRow={(record, index) => {
                    if (record.jobState === 'Failed' || record.jobState === 'Quota Exceeded') {
                      return;
                    }
                    return {
                      onClick: event => handleTableRowClick(index, record), // click row
                    };
                  }}
                  rowClassName={record => {
                    let classes = 'animate__animated animate__slideInLeft';
                    if (['Clipping', 'Transcripting', 'Transcribing'].includes(record.jobState))
                      classes = `${classes} 'disabled-row'`;
                    return classes;
                  }}
                />
              ) : source === 'Print' ? (
                <Table
                  scroll={{ y: 'calc(100vh - 24.5rem)' }}
                  loading={loading}
                  columns={printColumns}
                  showSorterTooltip={false}
                  rowKey={record => record.id}
                  data={getFormatedJobs()}
                  pagination={false}
                  // scroll={{ y: 630 }}
                  onRow={(record, index) => {
                    if (record.jobState === 'Failed' || record.jobState === 'Quota Exceeded') {
                      return;
                    }
                    return {
                      onClick: event => handleTableRowClick(index, record), // click row
                    };
                  }}
                  rowClassName={record => {
                    let classes = 'animate__animated animate__slideInLeft';
                    if (['Clipping', 'Transcripting', 'Transcribing'].includes(record.jobState))
                      classes = `${classes} 'disabled-row'`;
                    return classes;
                  }}
                />
              ) : source === 'Social' ? (
                <Table
                  scroll={{ y: 'calc(100vh - 24.5rem)' }}
                  loading={loading}
                  columns={twitterColumns}
                  showSorterTooltip={false}
                  rowKey={record => record.id}
                  data={getFormatedJobs()}
                  pagination={false}
                  // scroll={{ y: 630 }}
                  onRow={(record, index) => {
                    if (record.jobState === 'Failed' || record.jobState === 'Quota Exceeded') {
                      return;
                    }
                    return {
                      onClick: event => handleTableRowClick(index, record), // click row
                    };
                  }}
                  rowClassName={record => {
                    let classes = 'animate__animated animate__slideInLeft';
                    if (['Clipping', 'Transcripting', 'Transcribing'].includes(record.jobState))
                      classes = `${classes} 'disabled-row'`;
                    return classes;
                  }}
                />
              ) : source === 'Ticker' ? (
                <Table
                  scroll={{ y: 'calc(100vh - 24.5rem)' }}
                  loading={loading}
                  columns={tickerColumns}
                  showSorterTooltip={false}
                  rowKey={record => record.id}
                  data={getFormatedJobs()}
                  pagination={false}
                  // scroll={{ y: 630 }}
                  onRow={(record, index) => {
                    if (record.jobState === 'Failed' || record.jobState === 'Quota Exceeded') {
                      return;
                    }
                    return {
                      onClick: event => handleTableRowClick(index, record), // click row
                    };
                  }}
                  rowClassName={record => {
                    let classes = 'animate__animated animate__slideInLeft';
                    if (['Clipping', 'Transcripting', 'Transcribing'].includes(record.jobState))
                      classes = `${classes} 'disabled-row'`;
                    return classes;
                  }}
                />
              ) : (
                <Table
                  scroll={{ y: 'calc(100vh - 24.5rem)' }}
                  loading={loading}
                  columns={blogColumns}
                  showSorterTooltip={false}
                  rowKey={record => record.id}
                  data={getFormatedJobs()}
                  pagination={false}
                  // scroll={{ y: 630 }}
                  onRow={(record, index) => {
                    if (record.jobState === 'Failed' || record.jobState === 'Quota Exceeded') {
                      return;
                    }
                    return {
                      onClick: event => handleTableRowClick(index, record), // click row
                    };
                  }}
                  rowClassName={record => {
                    let classes = 'animate__animated animate__slideInLeft';
                    if (['Clipping', 'Transcripting', 'Transcribing'].includes(record.jobState))
                      classes = `${classes} 'disabled-row'`;
                    return classes;
                  }}
                />
              )}
            </div>
            {/* <SearchDrawer
              source={source}
              drawerModel={drawerModel}
              setDrawerModel={setDrawerModel}
              getDataFromChild={data => {
                ApplyCommonFilter(data);
              }}
            /> */}
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
      )}
    </>
  );
};
Jobs.propTypes = {};
Jobs.defaultProps = {};
export default Jobs;
