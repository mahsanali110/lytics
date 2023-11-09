import React, { useState, useEffect } from 'react';
import Table from '../../../Common/Table';
import './exportTable.scss';
import { useDispatch, useSelector } from 'react-redux';
import contentExportActions from 'modules/contentExport/action';
import { pick, map, result } from 'lodash';
import { getStatusColor, getPriorityColor, pascalCase, formatDate } from 'modules/common/utils';
import { Button } from 'components/Common';
import navActions from 'modules/navigation/actions';

function ExportJobTable({ Job, setJob }) {
  const dispatch = useDispatch();
  const [count, setCount] = useState(10);
  const [time, setTime] = useState(Date.now());

  const { exportJobs } = useSelector(state => state.contentExportReducer);
  const user = useSelector(state => state.authReducer.user);
  const getFormatedJobs = () =>
    map(exportJobs, exportJob =>
      pick(exportJob, [
        '_id',
        'programName',
        'channel',
        'thumbnailPath',
        'programType',
        'priority',
        'jobState',
        'programDate',
        'programTime',
        'jobState',
        'channelLogoPath',
        'language',
        'videoPath',
        'activeDownload',
        'transcriptionFlag',
      ])
    );
  const getJobIds = () => {
    let ids = [];

    for (var i = 0; i < exportJobs.length; i++) {
      const { jobState, _id } = exportJobs[i];
      if (jobState === 'Completed' || jobState === 'Ready for QC') ids.push(_id);
    }
    sessionStorage.setItem('job_ids', ids);
    // dispatch({ type: 'NAVS', payload: ids });
  };
  useEffect(() => {
    getJobIds();
  }, [exportJobs]);
  useEffect(() => {
    let clippedBy = user.firstName + ' ' + user.lastName;
    let data = {
      clippedBy,
      count,
    };
    let interval = setInterval(() => setTime(fetchJobs(data)), 5000);
    return () => {
      clearInterval(interval);
    };
  }, [count]);
  useEffect(() => {
    let clippedBy = user.firstName + ' ' + user.lastName;
    let data = {
      clippedBy,
      count,
    };
    fetchJobs(data);
  }, [count]);
  const fetchJobs = data => {
    // let clippedBy = user.firstName + ' ' + user.lastName;
    // let data = {
    //   clippedBy,
    //   count,
    // };
    // let params = {
    //   jobId: '6167ba09c8f6cc34402afba2',
    // };
    dispatch(contentExportActions.getExportJobs.request(data));
    // dispatch(contentExportActions.getExportJobById.request(params.jobId));
  };
  const incrementCount = () => {
    setCount(count + 10);
  };
  const getJobsDetailUri = role => {
    const jobsDetailByRole = {
      Clipper: '/qc-edit',
      QC: '/qc-edit',
      Marker: 'marker-edit',
    };

    return jobsDetailByRole[role];
  };
  const redirectToJobsDeails = id => {
    const uri = getJobsDetailUri(user.role);
    if (!uri) return;
    window.location.href = `/#${uri}/${id}`;
    // history.push(`${uri}/${id}`);
    // location.reload();
  };

  const handleTableRowClick = record => {
    // dispatch(navActions.updateLink({ type: 'job', index }));
    redirectToJobsDeails(record);
  };
  const handleRowClick = (index, record) => {
    let data = record._id;
    setJob(record);
  };

  const disable = (jobState, transcriptionFlag) => {
    if (transcriptionFlag === true) {
      if (jobState === 'Completed' || jobState === 'Ready for QC' || jobState === 'Exported')
        return false;
      else return true;
    } else return true;
  };
  const columns = [
    {
      title: 'Program Title',
      dataIndex: 'programName',
      sorter: true,
      sorter: (a, b) => a.programName.localeCompare(b.programName),
      render: (text, record) => {
        return (
          <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
            <span>{text}</span>
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'jobState',
      sorter: (a, b) => a.jobState.localeCompare(b.jobState),
      sortDirections: ['descend'],
      render: (text, record) => {
        return (
          <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
            <span className={`${getStatusColor(text)}`}> {text} </span>
          </div>
        );
      },
    },
    {
      title: 'QC',
      //   dataIndex: 'jobState',
      render: (text, record) => {
        return (
          <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
            <Button
              variant="secondary"
              disabled={disable(record.jobState, record.transcriptionFlag)}
              onClick={(e, index) => {
                e.preventDefault();
                handleTableRowClick(record._id, index);
              }}
            >
              QC
            </Button>
          </div>
        );
      },
    },
  ];
  return (
    <div className="exportTable-wrapper">
      <Table
        columns={columns}
        data={getFormatedJobs()}
        scroll={{ y: 280 }}
        pagination={false}
        onRow={(record, index) => {
          if (record.jobState === 'Failed' || record.jobState === 'Quota Exceeded') {
            return;
          }
          return {
            onClick: event => handleRowClick(index, record), // click row
          };
        }}
        rowClassName={record =>
          (['Clipping', 'Transcribing', 'Failed'].includes(record.jobState) && 'disabled-row') ||
          (record._id === Job?._id && 'highlight-row')
        }
      ></Table>
      <div className="exportTable-load">
        <h1
          onClick={() => {
            incrementCount();
            getJobIds();
          }}
        >
          Load More...
        </h1>
      </div>
    </div>
  );
}

export default ExportJobTable;
