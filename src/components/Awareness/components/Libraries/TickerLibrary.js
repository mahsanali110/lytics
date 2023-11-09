import React from 'react';
import Table from '../../../Common/Table';
import './tickerLibrary.scss';
import { Button } from 'components/Common';
import { pick, map, result } from 'lodash';

function TickerLibrary() {
  const columns = [
    {
      title: 'Date & Time',
      dataIndex: 'programName',
      sorter: true,
      //   sorter: (a, b) => a.programName.localeCompare(b.programName),
      //   render: (text, record) => {
      //     return (
      //       <div style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
      //         <span>{text}</span>
      //       </div>
      //     );
      //   },
    },
    {
      title: 'Theme',
      dataIndex: 'jobState',
      //sorter: (a, b) => a.jobState.localeCompare(b.jobState),
      sortDirections: ['descend'],
      //   render: (text, record) => {
      //     return (
      //       <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
      //         <span className={`${getStatusColor(text)}`}> {text} </span>
      //       </div>
      //     );
      //   },
    },
    {
      title: 'Sub-Theme',
      dataIndex: 'jobState',
      //sorter: (a, b) => a.jobState.localeCompare(b.jobState),
      sortDirections: ['descend'],
      //   render: (text, record) => {
      //     return (
      //       <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
      //         <span className={`${getStatusColor(text)}`}> {text} </span>
      //       </div>
      //     );
      //   },
    },
    {
      title: 'Thumbnail',
      dataIndex: 'jobState',
      //sorter: (a, b) => a.jobState.localeCompare(b.jobState),
      sortDirections: ['descend'],
      //   render: (text, record) => {
      //     return (
      //       <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
      //         <span className={`${getStatusColor(text)}`}> {text} </span>
      //       </div>
      //     );
      //   },
    },
    {
      title: (
        <Button
          variant="secondary"
          onClick={(e, index) => {
            e.preventDefault();
            // handleTableRowClick(record._id, index);
          }}
        >
          COMPARE
        </Button>
      ),
      //   dataIndex: 'jobState',
      //   render: (text, record) => {
      //     return (
      //       <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
      //         {/* <Button
      //           variant="secondary"
      //           disabled={disable(record.jobState, record.transcriptionFlag)}
      //           onClick={(e, index) => {
      //             e.preventDefault();
      //             // handleTableRowClick(record._id, index);
      //           }}
      //         >
      //           QC
      //         </Button> */}
      //       </div>
      //     );
      //   },
    },
  ];
  return (
    <div className="ticket-library-wrapper">
      <Table
        columns={columns}
        // data={() => {}}
        scroll={{ y: 380 }}
        pagination={false}
        // onRow={(record, index) => {
        //   if (record.jobState === 'Failed' || record.jobState === 'Quota Exceeded') {
        //     return;
        //   }
        //   return {
        //     onClick: event => handleRowClick(index, record), // click row
        //   };
        // }}
        // rowClassName={record =>
        //   (['Clipping', 'Transcribing', 'Failed'].includes(record.jobState) && 'disabled-row') ||
        //   (record._id === Job?._id && 'highlight-row')
        // }
      ></Table>
    </div>
  );
}

export default TickerLibrary;
