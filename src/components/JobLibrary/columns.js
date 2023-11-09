import { useEffect, useState } from 'react';
import moment from 'moment';
import { Typography, Checkbox, Tooltip } from 'antd';
import { cloneDeep } from 'lodash';
import { useDispatch, useSelector } from 'react-redux';
import { Button, KeywordCount } from 'components/Common';
import {
  convertGroups,
  formatDate,
  formatUTCDate,
  sourceBtn,
  selectIcon,
} from 'modules/common/utils';
import { IconButton } from './components';

const { Text } = Typography;

const labelColorHandler = (transC, transL) => {
  if (transC && transL && transL !== '[]' && transL !== 'null' && transL?.length >= 1) {
    return '#00AB4B';
  } else return '#FF6D31';
};

const labelHeadingHandler = (transC, transL) => {
  if (transC && transL && transL !== '[]' && transL !== 'null' && transL?.length >= 1) {
    return 'Transcription and Translation';
  } else return 'Transcription';
};

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
    ? '#00ACEE'
    : src === 'Ticker'
    ? '#F26A32'
    : '';
};

const checkLanguageDirection = str => {
  const urduRegex = /[\u0600-\u06FF]/; // matches any Urdu characters
  const hasUrdu = urduRegex.test(str); // check if the string contains any Urdu characters
  return hasUrdu ? 'rtl' : 'ltr'; // return "rtl" if the string has Urdu characters, otherwise "ltr"
};
const splitSocialWord = str => {
  const urduRegex = /[\u0600-\u06FF\s]+/g; // matches any Urdu characters and white space
  const filteredText = str.match(urduRegex).join(''); // extracts the Urdu text and joins it together
  const hasUrdu = urduRegex.test(str); // check if the string contains any Urdu characters
  function hasNonSpaceCharacters(str) {
    return str.trim().length > 0;
  }
  if (filteredText && hasUrdu && hasNonSpaceCharacters(filteredText)) {
    return filteredText;
  } else {
    return str;
  }
};
const checkFontLanguage = str => {
  const urduRegex = /[\u0600-\u06FF]/; // matches any Urdu characters
  const hasUrdu = urduRegex.test(str); // check if the string contains any Urdu characters
  return hasUrdu ? 'Noto Nastaliq' : 'Roboto'; // return "rtl" if the string has Urdu characters, otherwise "ltr"
};

const commonCols = [
  {
    title: 'DATE & TIME',
    align: 'left',
    dataIndex: 'broadcastDate',
    sortDirections: ['descend', 'ascend'],
    sorter: (a, b) => moment(a.broadcastDate).unix() - moment(b.broadcastDate).unix(),
    width: '2.5%',
    render: (text, record) => {
      let programTime = record?.programTime;
      record?.source === 'Tv'
        ? (programTime = moment(record.segmentStartTime).format('hh:mm A'))
        : (programTime = moment(record.programTime, 'HH:mm A').format('hh:mm A'));
      const broadcastDate = formatDate(record.broadcastDate, 'DD MMM YY');
      return (
        <div style={{ textAlign: 'left' }}>
          <div>
            <span className="text-white">{`${broadcastDate}\u00A0 \u2022 \u00A0${
              programTime !== undefined && programTime.length ? programTime : '12:00AM'
            }`}</span>
          </div>
        </div>
      );
    },
  },
  {
    title: 'TOPICS',
    dataIndex: 'topic',
    width: '3%',
    sorter: (a, b) => a.topic?.length - b.topic?.length,
    // sortDirections: ['descend'],
    align: 'center',
    render: (text, record) => {
      if (!record?.segments[0]?.topics.topic1.length)
        return (
          <>
            <span
              style={{
                color: 'white',
                display: 'flex',
                justifyContent: 'center',
                letterSpacing: '0.4px',
                alignItems: 'center',
                // marginLeft: '7%',
              }}
            ></span>
          </>
        );
      const Topics = (
        <>
          {' '}
          <Text
            ellipsis
            style={{
              color: 'white',
              display: 'flex',
              letterSpacing: '0.4px',
              justifyContent: 'center',
              alignItems: 'center',
              // marginLeft: '7%',
            }}
          >
            <b>{record?.segments[0]?.topics?.topic2[0]}</b>
            {'\u00A0 '} | {record?.segments[0]?.topics?.topic3[0]}
          </Text>
        </>
      );
      return Topics;
    },
  },
  {
    title: 'TITLE',
    align: 'center',
    dataIndex: 'programName',
    sorter: (a, b) => a.programName.length - b.programName.length,
    // sortDirections: ['descend'],
    width: '3%',
    render: (text, record) => {
      return (
        <Tooltip placement="top" color="#3F4D7E" title={text}>
          <Text
            className="title"
            ellipsis
            style={{
              width: '70%',
              color: 'white',
              fontSize: '15px',
              padding: '5px 10px',
              fontFamily: checkFontLanguage(text),
              marginLeft: '10%',
              direction: checkLanguageDirection(text),
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
    title: 'SPEAKERS / WRITERS',
    align: 'left',
    dataIndex: 'anchor',
    width: '3%',
    sorter: (a, b) => a.anchor.length - b.anchor.length,
    // sortDirections: ['descend'],
    render: (text, record) => {
      if (!text.length)
        return (
          <div
            style={{
              display: 'flex',
              flexDirection: 'inherit',
              marginLeft: '12%',
              alignItems: 'center',
            }}
          >
            <span style={{ paddingLeft: '3%' }}></span>
          </div>
        );
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'inherit',
            marginLeft: '12%',
            alignItems: 'center',
          }}
        >
          <Tooltip
            placement="top"
            color="#3F4D7E"
            title={labelHeadingHandler(record?.transcription, record?.translation)}
          >
            <div
              style={{
                width: '4px',
                height: '15px',
                borderRadius: '1px',
                backgroundColor: labelColorHandler(record?.transcription, record?.translation),
              }}
            ></div>
          </Tooltip>
          <span style={{ paddingLeft: '2%' }}>{text[0]}</span>
        </div>
      );
    },
  },
  {
    title: 'CHANNEL',
    align: 'left',
    dataIndex: 'channel',
    sorter: (a, b) => a.channel.length - b.channel.length,
    // sortDirections: ['descend'],
    width: '2%',
    render: text => {
      return (
        <span style={{ display: 'flex', flexDirection: 'inherit', marginLeft: '15%' }}>{text}</span>
      );
    },
  },
  {
    title: 'SOURCE',
    dataIndex: 'source',
    width: '2%',
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
  {
    title: 'TYPE',
    align: 'center',
    dataIndex: 'programType',
    sorter: (a, b) => a.programType.length - b.programType.length,
    // sortDirections: ['descend'],
    width: '2%',
    render: text => {
      return <span>{text}</span>;
    },
  },
  {
    title: 'KEYWORDS',
    dataIndex: 'queryWords',
    sorter: false,
    width: '4%',
    align: 'center',
    sorter: (a, b) => a.queryWords.length - b.queryWords.length,
    // sortDirections: ['descend'],
    render: (queryWords, record) => {
      if (!queryWords.length)
        return (
          <span
            style={{
              marginLeft: '11%',
              fontFamily: 'Noto Nastaliq',
            }}
          ></span>
        );
      return (
        <>
          <div
            style={{
              display: 'flex',
              width: '100%',
              gap: '10px',
              justifyContent: 'center',
            }}
          >
            {queryWords.map((obj, index) =>
              index <= 2 ? (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  <div
                    style={{
                      width: '4px',
                      alignItems: 'center',
                      height: '100%',
                      borderRadius: '2px 1px 1px 2px',
                      backgroundColor: srcColorHandler(record.source),
                    }}
                  ></div>

                  <span
                    style={{
                      padding: '5px 10px',
                      alignItems: 'center',
                      background: '#293255',
                      borderRadius: ' 0px 7px 7px 0px',
                      fontFamily: checkFontLanguage(obj.word),
                      fontstyle: 'normal',
                      fontweight: '500',
                      fontsize: '7px',
                    }}
                  >
                    {obj.word}
                  </span>
                </div>
              ) : null
            )}
          </div>
        </>
      );
    },
  },
];
export const getColumns = (
  { role, firstName, lastName, company },
  { setBulkJobs, bulkJobs, bulkCheckbox, setBulkCheckbox, data }
) => {
  const [treeData, setTreeData] = useState([]);
  const [treeMap, setTreeMap] = useState({});
  const [userMap, setUserMap] = useState({});
  const dispatch = useDispatch();
  const { users } = useSelector(state => state.usersReducer);
  const { groups } = useSelector(state => state.groupsReducer);
  useEffect(() => {
    let userMap = {};
    users.map(user => {
      if (!user.company) return;
      if (userMap[user.company.id]) {
        userMap[user.company.id].push({ ...cloneDeep(user) });
      } else {
        userMap[user.company.id] = [{ ...cloneDeep(user) }];
      }
    });
    setUserMap(userMap);
  }, [users]);
  useEffect(() => {
    let _groups = [...groups];
    _groups = _groups.map(group => {
      group.companies.forEach(com => {
        const matchingUsers = userMap[com.id] || [];
        com.children = matchingUsers;
      });
      return group;
    });
    const [treeData, treeMap] = convertGroups(_groups, ['companies', 'children']);
    setTreeData(treeData);
    setTreeMap(treeMap);
  }, [userMap, groups]);
  const columns = [
    {
      title: () => (
        <Checkbox
          checked={bulkCheckbox}
          onChange={e => {
            setBulkCheckbox(e.target.checked);
            e.target.checked ? setBulkJobs(data.map(job => job.id)) : setBulkJobs([]);
          }}
          onClick={e => e.stopPropagation()}
          className="checkbox"
        />
      ),
      dataIndex: 'dataTime',
      width: '1%',
      render: (text, record) => {
        return (
          <Checkbox
            checked={bulkJobs.filter(id => id == record.id).length}
            onChange={e => {
              if (e.target.checked) {
                bulkJobs.length + 1 === data.length && setBulkCheckbox(true);
                setBulkJobs(prev => [...prev, record.id]);
              } else {
                setBulkCheckbox(false);
                setBulkJobs(prev => prev.filter(id => id !== record.id));
              }
            }}
            onClick={e => e.stopPropagation()}
            className="checkbox"
          />
        );
      },
    },
    ...commonCols,
  ];
  return columns;
};
