import { useEffect, useState } from 'react';
import moment from 'moment';
import { Typography, Tooltip } from 'antd';
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
import { IconButton } from 'components/JobLibrary/components';
import { Checkbox } from 'V3/components/Common';
import { descriptionSVG, TranscriptSVG } from 'assets/icons/V3';

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
    ? '#0FA3B1'
    : src === 'Print'
    ? '#C696FF'
    : src === 'Online'
    ? '#F1BF98'
    : src === 'Blog'
    ? '#FF9B42;'
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
    title: 'Date & Time',
    align: 'left',
    dataIndex: 'broadcastDate',
    // sortDirections: ['descend', 'ascend'],
    // sorter: (a, b) => moment(a.broadcastDate).unix() - moment(b.broadcastDate).unix(),
    width: '6%',
    render: (text, record) => {
      let programTime = record?.programTime;
      record?.source === 'Tv'
        ? (programTime = moment(record.segmentStartTime).format('hh:mm A'))
        : (programTime = moment(record.programTime, 'HH:mm A').format('hh:mm A'));
      const broadcastDate = formatDate(record.broadcastDate, 'DD MMM YY');
      return (
        <div style={{ textAlign: 'left' }}>
          <div>
            <span className="text-white ff-roboto">{`${broadcastDate}\u00A0 \u2022 \u00A0${
              programTime !== undefined && programTime.length ? programTime : '12:00AM'
            }`}</span>
          </div>
        </div>
      );
    },
  },
  {
    title: 'Topics/Tags',
    dataIndex: 'topic',
    width: '6%',
    // sorter: (a, b) => a.topic?.length - b.topic?.length,
    // sortDirections: ['descend'],
    align: 'left',
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
            className="ff-roboto"
            ellipsis
            style={{
              color: 'white',
              // display: 'flex',
              letterSpacing: '0.4px',
              //   justifyContent: 'center',

              fontWeight: '400',
              // marginLeft: '7%',
              overflow: 'hidden !important',

              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',

              maxWidth: '100%',
            }}
          >
            <b style={{ fontWeight: '400' }}>{record?.segments[0]?.topics?.topic2[0]}</b>
            {'\u00A0 '} | {record?.segments[0]?.topics?.topic3[0]}
          </Text>
        </>
      );
      return Topics;
    },
  },
  {
    title: 'Title',
    align: 'left',
    dataIndex: 'programName',
    // sorter: (a, b) => a.programName.length - b.programName.length,
    // sortDirections: ['descend'],
    width: '6%',
    render: (text, record) => {
      return (
        <Tooltip
          overlayClassName={`v3-tooltip ${checkLanguageDirection(text)}`}
          style={{ color: 'black' }}
          placement="top"
          color="white"
          title={text}
          mouseEnterDelay={1}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}
            className="title-wrapper"
          >
            <div className="center-content" style={{ padding: '6px', position: 'relative' }}>
              {record?.transcription?.length ? (
                <TranscriptSVG
                  className="transcript-svg"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    // display: 'none',
                  }}
                />
              ) : null}
            </div>
            <Text
              className={`title ${checkLanguageDirection(text)}`}
              ellipsis
              style={{
                color: 'white',
                fontSize: '14px',
                fontFamily: checkFontLanguage(text),
                direction: checkLanguageDirection(text),
                whiteSpace: 'nowrap',
                flex: '1',
                textOverflow: 'ellipsis',
                minWidth: '0',
              }}
            >
              {record.source === 'Social' ? splitSocialWord(text) : text}
            </Text>
          </div>
        </Tooltip>
      );
    },
  },
  {
    title: 'Speaker',
    align: 'left',
    dataIndex: 'anchor',
    width: '3%',
    // sorter: (a, b) => a.anchor.length - b.anchor.length,
    // sortDirections: ['descend'],
    render: (text, record) => {
      // if (!text.length)
      //   return (
      //     <div
      //       style={{
      //         display: 'flex',
      //         flexDirection: 'inherit',
      //         //   marginLeft: '12%',
      //         alignItems: 'center',
      //       }}
      //     >
      //       <span style={{ paddingLeft: '3%' }}></span>
      //     </div>
      //   );
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'inherit',
            // marginLeft: '12%',
            alignItems: 'center',
          }}
        >
          <span className="ff-roboto">Speaker</span>
        </div>
      );
    },
  },
  {
    title: 'Channel',
    align: 'left',
    dataIndex: 'channel',
    // sorter: (a, b) => a.channel.length - b.channel.length,
    // sortDirections: ['descend'],
    width: '3%',
    render: text => {
      return (
        <span className="ff-roboto" style={{ display: 'flex', flexDirection: 'inherit' }}>
          {text}
        </span>
      );
    },
  },
  {
    title: 'Source',
    dataIndex: 'source',
    width: '3%',
    align: 'left',
    // sorter: (a, b) => a.source.length - b.source.length,
    // sortDirections: ['descend'],
    render: (text, { programType }) => {
      let jobDetails = { type: programType, source: text };
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
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
    title: 'Type',
    align: 'left',
    dataIndex: 'programType',
    // sorter: (a, b) => a.programType.length - b.programType.length,
    // sortDirections: ['descend'],
    width: '3%',
    render: text => {
      return <span className="ff-roboto">{text}</span>;
    },
  },
  //   {
  //     title: 'KEYWORDS',
  //     dataIndex: 'queryWords',
  //     sorter: false,
  //     width: '4%',
  //     align: 'center',
  //     sorter: (a, b) => a.queryWords.length - b.queryWords.length,
  //     // sortDirections: ['descend'],
  //     render: (queryWords, record) => {
  //       if (!queryWords.length)
  //         return (
  //           <span
  //             style={{
  //               marginLeft: '11%',
  //               fontFamily: 'Noto Nastaliq',
  //             }}
  //           ></span>
  //         );
  //       return (
  //         <>
  //           <div
  //             style={{
  //               display: 'flex',
  //               width: '100%',
  //               gap: '10px',
  //               justifyContent: 'center',
  //             }}
  //           >
  //             {queryWords.map((obj, index) =>
  //               index <= 2 ? (
  //                 <div
  //                   style={{
  //                     display: 'flex',
  //                     alignItems: 'center',
  //                   }}
  //                 >
  //                   <div
  //                     style={{
  //                       width: '4px',
  //                       alignItems: 'center',
  //                       height: '100%',
  //                       borderRadius: '2px 1px 1px 2px',
  //                       backgroundColor: srcColorHandler(record.source),
  //                     }}
  //                   ></div>

  //                   <span
  //                     style={{
  //                       padding: '5px 10px',
  //                       alignItems: 'center',
  //                       background: '#293255',
  //                       borderRadius: ' 0px 7px 7px 0px',
  //                       fontFamily: checkFontLanguage(obj.word),
  //                       fontstyle: 'normal',
  //                       fontweight: '500',
  //                       fontsize: '7px',
  //                     }}
  //                   >
  //                     {obj.word}
  //                   </span>
  //                 </div>
  //               ) : null
  //             )}
  //           </div>
  //         </>
  //       );
  //     },
  //   },
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
          value={bulkCheckbox}
          onChange={checked => {
            setBulkCheckbox(checked);
            checked ? setBulkJobs(data.map(job => job.id)) : setBulkJobs([]);
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
            value={bulkJobs.filter(id => id == record.id).length}
            onChange={checked => {
              if (checked) {
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
