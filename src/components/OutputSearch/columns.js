import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { Image, Typography, Checkbox } from 'antd';
import { cloneDeep } from 'lodash';

import { formatDate } from 'modules/common/utils';
import { EditIcon, YoutubeIcon, WebSearchEngineIcon, TvScreenIcon, DetailIcon } from 'assets/icons';
import { history } from 'store';
import { DribbbleOutlined, YoutubeOutlined, FundProjectionScreenOutlined } from '@ant-design/icons';
import { CalendarIcon, ClockIcon } from 'assets/icons';
import { Tag, Select, Button, KeywordCount, TreeSelect } from 'components/Common';
import usersActions from 'modules/users/actions';
import { USERS_BASE_URL } from 'constants/config';
import { uploadPath } from 'constants/index';

import EscalateButton from './components/EscalateButton/EscalateButton';
import {
  getTopicKeys,
  getTopicValue,
  getTopicKeyFromValue,
  isNewTopic,
  convertGroups,
} from 'modules/common/utils';

import dummyData from './helper';

const { Text } = Typography;

const commonCols = [
  {
    title: 'Date & Time',
    dataIndex: 'dataTime',
    sorter: true,
    sorter: (a, b) => moment(a.programDate).unix() - moment(b.programDate).unix(),
    defaultSortOrder: 'descend',
    // sortDirections: ['ascend', 'descend', 'ascend'],

    width: '14%',
    render: (text, record) => {
      return (
        <div style={{ textAlign: 'left', paddingLeft: '20px' }}>
          <div style={{ marginBottom: '5px' }}>
            <span className="" style={{ color: 'red' }}>
              <CalendarIcon style={{ fill: 'red' }} />
            </span>{' '}
            <span className="text-white">{formatDate(record.programDate, 'DD MMMM YYYY')}</span>
          </div>
          <div>
            <span className="table-icon-wrapper">
              <ClockIcon style={{ color: 'red' }} />
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
    sortDirections: ['descend'],
    width: '7%',
    sorter: (a, b) => a.channel.length - b.channel.length,
    render: (text, record) => {
      return (
        <figure>
          <Image
            width={25}
            src={`${USERS_BASE_URL}/${uploadPath}/${record.channelLogoPath}`}
            preview={false}
            // fallback="placeholder.png"
          />
          <figcaption>{text}</figcaption>
        </figure>
      );
    },
  },
  {
    title: 'Thumbnail',
    dataIndex: 'thumbnailPath',
    width: '10%',
    render: (text, record) => (
      <Image
        width={80}
        height={47}
        src={`${USERS_BASE_URL}/${uploadPath}/${text}`}
        preview={false}
        fallback="placeholder.png"
      />
    ),
  },
  {
    title: 'Title',
    dataIndex: 'programName',
    width: '9%',
  },
  {
    title: 'Type',
    dataIndex: 'programType',
    sorter: (a, b) => a.programType.length - b.programType.length,
    sortDirections: ['descend'],
    width: '10%',
  },
  {
    title: 'Word Count',
    dataIndex: 'wordCount',
    sorter: true,
    width: '9%',
    sorter: (a, b) => a.wordCount.length - b.wordCount.length,
  },
  {
    title: 'Impact',
    dataIndex: 'impact',
    sorter: false,
    width: '7%',
    render: (impact, record) => {
      return (
        <div className="impact-icon-wrapper">
          <div className="impact-icon-container">
            <YoutubeOutlined style={{ color: '#EF233C' }} />
            <Text className="text-grey">{impact.onlineViews}</Text>
          </div>
          <div className="impact-icon-container">
            <FundProjectionScreenOutlined style={{ color: '#EF233C' }} />
            <Text className="text-grey">{impact.tvRatings}</Text>
          </div>
          <div className="impact-icon-container">
            <DribbbleOutlined style={{ color: '#EF233C' }} />{' '}
            <Text className="text-grey">{impact.webMentions}</Text>
          </div>
        </div>
      );
    },
  },
  // {
  //   title: 'Keyword',
  //   dataIndex: 'queryWords',
  //   sorter: false,
  //   width: '20%',
  //   render: (queryWords, record) => {
  //     if (!queryWords.length) return;
  //     return (
  //       <div className="container">
  //         {queryWords.map(({ word, count }, index) => {
  //           if (index >= 4) return;
  //           return (
  //             <KeywordCount key={index} highest={queryWords[0].count} word={word} count={count} />
  //           );
  //         })}
  //       </div>
  //     );
  //   },
  // },
  // {
  //   title: 'Themes',
  //   dataIndex: 'segments',
  //   width: '9%',
  //   render: (segments, record, index) => {
  //     let len = segments.length;
  //     return Object.values(segments).map(
  //       (seg, index) =>
  //         index != len - 1 && (
  //           <div>
  //             <Text className="text-orange text-bold">
  //               {seg.topics.topic1 == '' ? '-' : seg.topics.topic1}
  //             </Text>
  //           </div>
  //         )
  //     );
  //   },
  // },
];

export const getColumns = (
  { role, firstName, lastName, company },
  {
    setEscalations,
    escalateJob,
    setBulkJobs,
    bulkJobs,
    bulkCheckbox,
    setBulkCheckbox,
    setBulkUsers,
    bulkUsers,
    bulkEsclate,
    data,
  }
) => {
  const [treeData, setTreeData] = useState([]);
  const [treeMap, setTreeMap] = useState({});
  const [userMap, setUserMap] = useState({});
  const [userGroup, setUserGroup] = useState('');
  const dispatch = useDispatch();
  const { users } = useSelector(state => state.usersReducer);
  const { groups } = useSelector(state => state.groupsReducer);

  // const [treeData, treeMap] = convertGroups(dummyData, ['children']);

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

  useEffect(() => {
    dispatch(usersActions.getUsers.request({ role: ['Reviewer', 'Client'] }));
  }, []);

  useEffect(() => {
    let shouldBreak = false;
    groups.forEach(group => {
      if (shouldBreak) return;
      group.companies.forEach(com => {
        if (com?.id === company?.id) {
          setUserGroup(group.id);
          shouldBreak = true;
        }
      });
    });
  }, [company, groups]);

  const commonColumns = [
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
      // sorter: (a, b) => moment(a.programDate).unix() - moment(b.programDate).unix(),
      width: '5%',
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

  const columns =
    role === 'Reviewer'
      ? [
          ...commonColumns,
          {
            title: () => (
              <Select
                placeholder="Select Escalation"
                value={bulkUsers?.map(({ id }) => id)}
                style={{ width: '100%' }}
                mode="multiple"
                name="escalations"
                size="small"
                onClick={e => e.stopPropagation()}
                onChange={value => {
                  // const userInfo = value.map(val => getTopicValue(val, treeMap));
                  const data = value.map((userId, ind) => {
                    const parentId = `${userGroup}-${company.id}-${userId}`;
                    return {
                      id: userId,
                      parentId,
                      to: treeMap[parentId]?.title,
                      company: company?.id || '',
                      by: [firstName, lastName].join(' '),
                      time: moment().format('YYYY-MM-DD HH:mm:ss'),
                    };
                  });
                  setBulkUsers(data);
                }}
                maxTagCount="responsive"
                options={users
                  .filter(user => user.company && user?.company?.id == company?.id)
                  .map(role => ({
                    value: role.id,
                    title: role.firstName + ' ' + role.lastName,
                  }))}
              />
            ),
            dataIndex: 'escalations',
            width: '15%',
            render: (escalations, record) => (
              <Select
                placeholder="Select Escalation"
                value={escalations
                  ?.filter(user => user.company === company?.id)
                  .map(({ id }) => id)}
                style={{ width: '100%' }}
                mode="multiple"
                name="escalations"
                size="small"
                onClick={e => e.stopPropagation()}
                onChange={value => {
                  const data = {
                    jobId: record.id,
                    data: value.map((userId, ind) => {
                      const parentId = `${userGroup}-${company.id}-${userId}`;
                      return {
                        id: userId,
                        parentId,
                        to: treeMap[parentId]?.title,
                        company: company?.id || '',
                        by: [firstName, lastName].join(' '),
                        time: moment().format('YYYY-MM-DD HH:mm:ss'),
                      };
                    }),
                  };
                  console.log({ data });
                  setEscalations(data);
                }}
                maxTagCount="responsive"
                options={users
                  .filter(user => user.company && user?.company?.id == company?.id)
                  .map(role => ({
                    value: role.id,
                    title: role.firstName + ' ' + role.lastName,
                  }))}
              />
            ),
          },
          {
            title: () => (
              <div>
                <EscalateButton handleSubmit={() => bulkEsclate()} disable={!bulkJobs.length} />
              </div>
            ),
            dataIndex: 'id',
            width: '7%',
            render: (text, record) => {
              const isEscalated = record.escalations?.some(entry => entry?.time);
              return (
                <div>
                  <EscalateButton handleSubmit={() => escalateJob(record.id)} />
                </div>
              );
            },
          },
        ]
      : [
          ...commonColumns,
          {
            align: 'left',
            title: () => {
              return (
                <TreeSelect
                  treeData={treeData}
                  value={bulkUsers.map(({ parentId }) => parentId)}
                  style={{ width: '100%' }}
                  mode="multiple"
                  name="escalations"
                  size="middle"
                  onClick={e => e.stopPropagation()}
                  onChange={value => {
                    const userInfo = value.map(val => getTopicValue(val, treeMap));
                    const data = value.map((parentId, ind) => {
                      return {
                        id: parentId?.split('-')[2],
                        parentId,
                        to: treeMap[parentId]?.title,
                        company: treeMap[parentId]?.company,
                        by: [firstName, lastName].join(' '),
                        time: moment().format('YYYY-MM-DD HH:mm:ss'),
                      };
                    });
                    setBulkUsers(data);
                  }}
                  maxTagCount="responsive"
                  placeholder="Select Escalation"
                />
              );
            },
            dataIndex: 'escalations',
            width: '17%',
            render: (escalations, record) => (
              <TreeSelect
                treeData={treeData}
                value={escalations?.map(({ parentId }) => parentId)}
                style={{ width: '100%' }}
                // mode="multiple"
                name="escalations"
                size="middle"
                onClick={e => e.stopPropagation()}
                onChange={value => {
                  // const userInfo = value.map(val => getTopicValue(val, treeMap)); //userInfo [ {title, company}, ...... ]
                  const data = {
                    jobId: record.id,
                    data: value.map((parentId, ind) => ({
                      id: parentId?.split('-')[2],
                      parentId,
                      to: treeMap[parentId]?.title,
                      company: treeMap[parentId]?.company,
                      by: [firstName, lastName].join(' '),
                      time: moment().format('YYYY-MM-DD HH:mm:ss'),
                    })),
                  };
                  console.log({ data });
                  setEscalations(data);
                }}
                maxTagCount="responsive"
                placeholder="Select Escalation"
              />
            ),
          },
          {
            title: () => (
              <div>
                <EscalateButton handleSubmit={() => bulkEsclate()} disable={!bulkJobs.length} />
              </div>
            ),
            dataIndex: 'id',
            width: '7%',
            render: (text, record) => {
              const isEscalated = record.escalations?.some(entry => entry?.time);
              return (
                <div>
                  {/* {isEscalated ? (
                    <Tag variant="escalate" text="E" onClick={e => e.stopPropagation()} />
                  ) : ( */}
                  <EscalateButton handleSubmit={() => escalateJob(record.id)} />
                </div>
              );
            },
          },
        ];

  return columns;
};
