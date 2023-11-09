import React from 'react';
import moment from 'moment';
import { getStatusColor, getPriorityColor, pascalCase, formatDate } from 'modules/common/utils';
import { Image, Button as B } from 'antd';
import { ReloadOutlined, DownloadOutlined } from '@ant-design/icons';
import { CalendarIcon, ClockIcon } from 'assets/icons';

import { USERS_BASE_URL } from 'constants/config';
import { uploadPath } from 'constants/index';

const formateTime = time => {
  const [startTime, endTime] = time?.split(' to ') ?? [];
  let ST = moment(startTime, ['hh:mm:ss A']);
  let ET = moment(endTime, ['hh:mm:ss A']);
  var t = ST.format('HH:mm:ss') + ' to ' + ET.format('HH:mm:ss');
  return t;
};

export const twitterColumns = [
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
    title: 'Tweet Image',
    dataIndex: 'thumbnailPathURL',
    sorter: false,
    render: (text, record, index) => {
      return (
        <Image
          width={120}
          height={70}
          src={record.thumbnailPathURL}
          preview={false}
          fallback="placeholder.png"
        />
      );
    },
  },
  {
    title: 'Tweet Name',
    dataIndex: 'channel',
    sorter: true,
    sorter: (a, b) => a.channel.localeCompare(b.channel),
  },
  {
    title: 'Tweet Type',
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
    render: (text, record) => {
      return (
        <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
          <span> Pending </span>
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
