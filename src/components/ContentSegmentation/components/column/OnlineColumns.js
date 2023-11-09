import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { pascalCase, formatDate } from 'modules/common/utils';
import { Image, Button as B } from 'antd';
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

export const getColumns = fullData => {
  const urlArray = new Array();
  const [data, setData] = useState([]);
  const [thumbnailImg, setThumbnailImg] = useState('');
  const [priorityColor, setPriorityColor] = useState('low');
  const importedVideos = useSelector(state => state.jobsReducer.importVideos);
  // console.log('data in columns: ',data);

  const columns = [
    {
      title: 'Date',
      dataIndex: 'dataTime',
      sorter: true,
      sorter: (a, b) => moment(a.programDate).unix() - moment(b.programDate).unix(),
      render: (text, record) => {
        return (
          <div style={{ textAlign: 'left', paddingLeft: '30px', fontSize: 'large' }}>
            <div style={{ marginBottom: '5px' }}>
              <span className="table-icon-wrapper">
                <CalendarIcon />
              </span>{' '}
              <span className="text-white">{formatDate(record.programDate, 'DD/MM/YYYY')}</span>
            </div>
            {/* <div> */}
            {/* <span className="table-icon-wrapper">
                <ClockIcon />
              </span>{' '}
              {formateTime(record.programTime)}
            </div> */}
          </div>
        );
      },
    },
    {
      title: 'Channel',
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
      title: 'Publisher',
      dataIndex: 'anchor',
      sorter: true,
      sorter: (a, b) => a.anchor.localeCompare(b.anchor),
    },
    {
      title: 'Thumbnails',
      dataIndex: 'thumbnailPathURL',
      sorter: false,
      render: (text, record, index) => {
        // const data  = handlePreview();
        // console.log('images record: ',record.thumbnailPath);
        // if (record.thumbnailPath.includes('jpg')) {
        //   // const processDATA=  async1(fullData, record.thumbnailPath);
        //   const processDATA = processJobs(fullData, record.thumbnailPath);
        //   console.log('ProcessJobs() return: ', processDATA);
        // }
        return (
          <>
            <Image
              width={120}
              height={70}
              src={record.thumbnailPathURL}
              preview={false}
              fallback="placeholder.png"
            />
          </>
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
      title: 'Priority',
      dataIndex: 'priority',
      sorter: true,
      sorter: (a, b) => a.priority.localeCompare(b.priority),

      render: (text, record) => {
        if (text === 'URGENT') {
          setPriorityColor('urgent');
        } else if (text === 'HIGH') {
          setPriorityColor('high');
        } else if (text === 'NORMAL') {
          setPriorityColor('normal');
        } else if (text === 'LOW') {
          setPriorityColor('low');
        }
        return (
          <div style={{ wordWrap: 'break-word', wordBreak: 'break-word' }}>
            <div
              style={{
                height: '50px',
                width: '65%',
                backgroundColor: '#1B1D28',
                borderRadius: '10px',
                textAlign: 'center',
              }}
            >
              <span
                style={{
                  fontSize: '17px',
                  display: 'inline-block',
                  margin: '7px 0 0 0',
                  padding: '5px 10px',
                }}
                className={`${priorityColor}-color`}
              >
                {' '}
                {pascalCase(text)}{' '}
              </span>
            </div>
          </div>
        );
      },
    },
  ];
  return columns;
};
