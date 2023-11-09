import { useEffect, useState } from 'react';
import moment from 'moment';
import { Typography, Tooltip } from 'antd';
import { Button, KeywordCount } from 'components/Common';
import { convertGroups, formatDate, sourceBtn, selectIcon } from 'modules/common/utils';
import IconButton from '../IconButton/IconButton';
import { checkFontLanguage, checkLanguageDirection, splitSocialWord } from 'modules/common/utils';
const { Text } = Typography;

function columns() {
  const srcColorHandler = src => {
    return src === 'Tv'
      ? '#33C6B0'
      : src === 'Print'
      ? '#C28DFF'
      : src === 'Online'
      ? '#FD8894'
      : src === 'Blog'
      ? '#FFD76F'
      : src === 'Social'
      ? '#F26A32'
      : src === 'Ticker'
      ? '#ef233c'
      : '';
  };
  const commonCols = [
    {
      title: 'DATE & TIME',
      align: 'left',
      dataIndex: 'programDate',
      sortDirections: ['descend', 'ascend'],
      sorter: (a, b) => moment(a.programDate).unix() - moment(b.programDate).unix(),
      width: '10%',
      render: (text, record) => {
        let programTime = record?.programTime;
        record?.source == 'Social'
          ? (programTime = moment(record.programTime, 'HH:mm').format('hh:mm A'))
          : ([programTime] = record?.programTime?.split(' to ') ?? '');
        const programDate = formatDate(record.programDate, 'DD MMM YY');
        return (
          <div style={{ textAlign: 'left' }}>
            <div>
              <span className="text-white">{`${programDate}\u00A0 \u2022 \u00A0${
                programTime !== undefined && programTime.length ? programTime : '12:00AM'
              }`}</span>
            </div>
          </div>
        );
      },
    },
    {
      title: 'TITLE',
      align: 'center',
      dataIndex: 'programName',
      sorter: (a, b) => a.programName.length - b.programName.length,
      // sortDirections: ['descend'],
      width: '10%',
      render: (text, record) => {
        return (
          <Tooltip placement="top" color="#3F4D7E" title={text}>
            <Text
              className="title"
              ellipsis
              style={{
                width: '90%',
                color: 'white',
                fontSize: '15px',
                padding: '5px',
                fontFamily: checkFontLanguage(text),
                direction: checkLanguageDirection(text),

                fontFamily: 'Noto Nastaliq',
                textAlign: 'center',
                whiteSpace: 'nowrap',
                overflow: 'hidden !important',
                textOverflow: 'ellipsis',
              }}
            >
              {record.source === 'Social' ? splitSocialWord(text) : text}
            </Text>
          </Tooltip>
        );
      },
    },
    {
      title: 'CHANNEL',
      align: 'center',
      dataIndex: 'channel',
      sorter: (a, b) => a.channel.length - b.channel.length,
      // sortDirections: ['descend'],
      width: '10%',
      render: text => {
        return (
          <Text
            style={{
              display: 'flex',
              flexDirection: 'inherit',
              textAlign: 'center',
              color: 'white',
              display: 'block',
            }}
          >
            {text}
          </Text>
        );
      },
    },
    {
      title: 'SOURCE',
      dataIndex: 'source',
      width: '10%',
      align: 'center',
      sorter: (a, b) => a.source.length - b.source.length,
      // sortDirections: ['descend'],
      render: (text, { programType }) => {
        let jobDetails = { type: programType, source: text };
        return (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <IconButton
              title={
                text == 'Blog' ? 'Web' : text == 'Tv' ? 'TV' : text == 'Social' ? 'Twitter' : text
              }
              iconDetails={jobDetails}
            />
          </div>
        );
      },
    },
  ];
  return commonCols;
}

export default columns;
