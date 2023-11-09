import React from 'react';
import moment from 'moment';
import { Image, Button as B } from 'antd';
import { USERS_BASE_URL } from 'constants/config';
import { ReloadOutlined } from '@ant-design/icons';
import { CalendarIcon, ClockIcon } from 'assets/icons';
import { getStatusColor, pascalCase, formatDate } from 'modules/common/utils';
import { uploadPath } from 'constants/index';

export const tickerColumns = [
  {
    title: 'Date & Time',
    dataIndex: 'dataTime',
    sorter: true,
    defaultSortOrder: 'descend',
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
            {moment(record.programTime, ['hh:mm:ss A']).format('HH:mm:ss')}
          </div>
        </div>
      );
    },
  },
  {
    title: 'Ticker',
    dataIndex: 'channel',
    sorter: true,
    sorter: (a, b) => a.channel.length - b.channel.length,
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
      return <Image src={thumbnail} preview={false} fallback="placeholder.png" />;
    },
  },
  {
    title: 'Ticker Name',
    dataIndex: 'programName',
    sorter: true,
    render: (text, record) => {
      const fourWords = record.programName.split(' ').slice(0, 4).join(' ');
      return <span>{fourWords}</span>;
    },
  },
  {
    title: 'Ticker Type',
    dataIndex: 'programType',
    sorter: true,
    sorter: (a, b) => a.programType.localeCompare(b.programType),
  },
  {
    title: 'Status',
    dataIndex: 'jobState',
    sorter: true,
    sorter: (a, b) => a.jobState.localeCompare(b.jobState),

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
