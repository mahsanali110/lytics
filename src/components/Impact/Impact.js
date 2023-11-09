import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row } from 'antd';
import { jobActions } from 'modules/jobs/actions';
import EditableTable from './columns';
import { SearchField, Button } from 'components/Common';
import { pick, map, filter } from 'lodash';
import ModelView from './ModelView';
import './impact.scss';
import useSearch from '../../hooks/useSearch';
const Impact = () => {
  const { loading } = useSelector(state => state.jobsReducer);
  const jobs = useSelector(state => state.jobsReducer);
  const dispatch = useDispatch();
  const [searchText, setSearchText] = useState('');
  const [tableFilters, setTableFilters] = useState({});
  const [pagination, setPagination] = useState(10);
  const [searchFilters, setSearchFilters] = useState([]);
  const [openModal, setopenModal] = useState(false);
  const [data, setData] = useState([]);
  const applySearch = useSearch();
  useEffect(() => {
    fetchData();
  }, [tableFilters]);

  useEffect(() => {
    setData(jobs.results);
  }, [jobs]);

  const fetchData = () => {
    dispatch(jobActions.fetchJobs.request({ ...tableFilters, searchText, searchFilters }));
  };

  const handleTableChange = (pagination, filters, sorter) => {
    const tableFiltersObj = {
      sortField: sorter.field,
      sortOrder: sorter.order,
      page: pagination,
    };
    setTableFilters(tableFiltersObj);
  };
  const handleOnChange = e => {
    const { value } = e.target;
    setSearchText(value);
  };
  const handleSearch = () => {
    setData(applySearch(jobs.results, ['programName', 'channel'], searchText));
    // fetchData();
  };

  const getFormatedJobs = () =>
    map(data, job =>
      pick(job, [
        'id',
        'programName',
        'channel',
        'programDate',
        'programTime',
        'impact',
        'channelLogoPath',
      ])
    );

  const openModalHandeler = () => {
    setopenModal(true);
  };
  return (
    <>
      <Row>
        <Col span={1} />

        <Col span={19}>
          <SearchField
            className="Search-field"
            style={{ backgroundColor: '#3e404b !important' }}
            searchText={searchText}
            handleOnChange={handleOnChange}
            handleSearch={handleSearch}
          />
        </Col>
        <Col span={3}>
          <Button variant="secondary" style={{ height: '55px' }} onClick={openModalHandeler}>
            Import Impact
          </Button>
        </Col>
        <Col span={1} />
      </Row>
      <Row>
        <Col span={1} />
        <Col span={22}>
          <EditableTable
            rowKey={record => record.id}
            data={getFormatedJobs()}
            pagination={pagination}
            onChange={handleTableChange}
          />
        </Col>
        <Col span={1} />
      </Row>
      {openModal ? (
        <ModelView openModal={openModal} setopenModal={setopenModal} jobs={jobs}></ModelView>
      ) : null}
    </>
  );
};

export default Impact;
