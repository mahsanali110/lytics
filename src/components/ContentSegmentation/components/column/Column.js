import moment from 'moment';

import { getStatusColor, getPriorityColor, pascalCase, formatDate } from 'modules/common/utils';
import { Image } from 'antd';

import { CalendarIcon, ClockIcon } from 'assets/icons';

export const columns = [
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
            {record.programTime}
          </div>
        </div>
      );
    },
  },
  {
    title: 'Channel',
    dataIndex: 'channel',
    sorter: (a, b) => a.channel.length - b.channel.length,
    sorter: true,
    //sortDirections: ['descend'],
    render: (text, record) => {
      return (
        <figure>
          <Image
            width={25}
            src={record.channelLogoPath}
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
    render: (text, record) => (
      <Image width={80} height={47} src={text} preview={false} fallback="placeholder.png" />
    ),
  },
  {
    title: 'Program Title',
    dataIndex: 'programName',
    sorter: false,
  },
  {
    title: 'Language',
    dataIndex: 'language',
    sorter: false,
  },
  {
    title: 'Program Type',
    dataIndex: 'programType',
    sorter: (a, b) => a.programType.localeCompare(b.programType),
    sortDirections: ['descend'],
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
    title: 'Priority',
    dataIndex: 'priority',
    sorter: (a, b) => a.priority.localeCompare(b.priority),
    sortDirections: ['descend'],
    render: (text, record) => {
      return (
        <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
          <span className={`bg-black priority-tag ${getPriorityColor(pascalCase(text))}`}>
            {' '}
            {pascalCase(text)}{' '}
          </span>
        </div>
      );
    },
  },
];
