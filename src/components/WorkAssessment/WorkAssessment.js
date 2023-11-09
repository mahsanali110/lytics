import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'antd';
import moment from 'moment';

import { Table, Taskbar } from 'components/Common';
import workAssessmentActions from 'modules/workAssessment/actions';

import './WorkAssessment.scss';

function WorkAssessment() {
  const dispatch = useDispatch();
  const { workAssessments, loading } = useSelector(state => state.workAssessmentReducer);

  useEffect(() => {
    const dateTo = new moment().toISOString()
    const dateFrom = new moment().subtract(5, 'days').toISOString()
    dispatch(workAssessmentActions.getWorkAssesment.request({dateFrom, dateTo}))
  }, []);

  const getTaskbarInfo = (completed = 50, total = 50) => {
    const completedPercent = (completed / total) * 100;
    return { completedPercent, total, completed };
  };

  const columns = [
    {
      align: 'center',
      title: 'Serial No.',
      dataIndex: 'sr',
    },
    {
      align: 'center',
      title: 'Name',
      dataIndex: 'user',
    },
    {
      align: 'center',
      title: 'Role',
      dataIndex: 'role',
      sorter: (a, b) => a.role.localeCompare(b.role),
      sortDirections: ['descend'],
    },
    {
      align: 'center',
      title: 'Current Progress',
      sorter: (a, b) => ((a.overAll.completedJobs / a.overAll.totalJobs) * 100) - ((b.overAll.completedJobs / b.overAll.totalJobs) * 100) ,
      dataIndex: 'overAll',
      sortDirections: ['descend'],
      render: overAll => (
          <>
            <Taskbar
              barOneStartColor="#EF233C"
              barOneEndColor="#EF233C"
              barOnePercentage={getTaskbarInfo(overAll.completedJobs, overAll.totalJobs).completedPercent}
              barOneText={`${overAll.totalJobs} Jobs `}
              completedText={`${overAll.completedJobs} Jobs `}
            />
            <hr />
          </>
        )
    },
    {
      align: 'center',
      title: 'Week Progress',
      sorter: (a, b) => ((a.week.completedJobs / a.week.totalJobs) * 100) - ((b.week.completedJobs / b.week.totalJobs) * 100) ,
      sortDirections: ['descend'],
      dataIndex: 'week',
      render: week => (
        <>
          <Taskbar
            barOneStartColor="#48BDEA"
            barOneEndColor="#6AE0D9"
            barOnePercentage={getTaskbarInfo(week.completedJobs, week.totalJobs).completedPercent}
            barOneText={`${week.totalJobs} Jobs `}
            completedText={`${week.completedJobs} Jobs `}
          />
          <hr />
        </>
      ),
    },
  ];

  return (
    <>
      <Row className="table-row">
        <Col span={1}></Col>
        <Col span={22}>
          <div className="table-container work-assessment-wrapper">
            <Table
              columns={columns}
              pagination={false}
              data={workAssessments.map((assessement, index) => ({
                key: assessement.id,
                sr: `${index + 1}.`,
                ...assessement,
              }))}
              loading={loading}
            />
          </div>
        </Col>
        <Col span={1}></Col>
      </Row>
    </>
  );
}

export default WorkAssessment;
