import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import moment from 'moment';

import './JobTable.scss';

import columns from './columns';
import { LoadingPage, Table, SearchField } from 'components/Common';
import PaginationComp from 'components/Common/Pagination/PaginationComp';

import { jobActions } from 'modules/jobs/actions';
import libraryJobsActions from 'modules/libraryJobs/actions';
import { filterJobSources } from 'constants/index';
import { checkSpecialCharacterExists } from 'modules/common/utils';

function JobTable({ isLytics, isCompany, isPersonal, closeWindow, resetReducers }) {
  const dispatch = useDispatch();
  const selectedChannelWindows = useSelector(state => state.liveClippingReducer.selectedWindows);
  const interval = useRef(null);

  const {
    results,
    searchText: text,
    loading,
    totalPages,
    job,
  } = useSelector(state => state.jobsReducer);

  const {
    company,
    personal,
    loading: libraryLoading,
  } = useSelector(state => state.libraryJobsReducer);

  const [searchText, setSearchText] = useState('');
  const { channels: allChannels } = useSelector(state => state.channelsReducer);
  const [pageNumber, setPageNumber] = useState(1);
  const [data, setData] = useState([]);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [rowId, setRowId] = useState('');
  const format = 'YYYY-MM-DDTHH:mm:ss';

  const [tableFilters, setTableFilters] = useState({
    start_date: moment().subtract(3, 'days').format(format), // ! set the date to previous 3 days, kindly don't change it
    end_date: moment().format(format),
    source: filterJobSources.filter(source => source === 'Tv' || source === 'Online'),
    limit: 8,
    guest: '',
    page: pageNumber ?? 1,
    escalation: '',
    channel: [
      ...allChannels
        .filter(_ => {
          if (_.type === 'Tv' || _.type === 'Online') return _;
        })
        .map(_ => _.name),
    ],
    association: '',
    appliedPreset: '',
    searchText: searchText,
    jobState: ['Ready for QC', 'Ready for Marking', 'Completed'],
  });

  const handleSearch = () => {
    if (checkSpecialCharacterExists(searchText)) {
      return antMessage.error('Only [& | -] operators are allowed!');
    }
    setTableFilters({ ...tableFilters, searchText: searchText, page: 1 });
    setPageNumber(1);
  };

  useEffect(() => {
    if (isLytics) {
      dispatch(jobActions.fetchJobs.request({ ...tableFilters }));
    }
    if (isPersonal) {
      dispatch(
        libraryJobsActions.fetchJobsPersonal.request({ ...tableFilters, isPersonalLibrary: true })
      );
    }

    if (isCompany) {
      dispatch(
        libraryJobsActions.fetchJobsCompany.request({ ...tableFilters, isCompanyLibrary: true })
      );
    }
  }, [tableFilters]);

  useEffect(() => {
    interval.current = setInterval(() => {
      // if (isLytics) {
      //   dispatch(jobActions.fetchJobs.request({ ...tableFilters, loading: false }));
      // }
      if (isPersonal) {
        dispatch(
          libraryJobsActions.fetchJobsPersonal.request({
            ...tableFilters,
            isPersonalLibrary: true,
            loading: false,
          })
        );
      }

      if (isCompany) {
        dispatch(
          libraryJobsActions.fetchJobsCompany.request({
            ...tableFilters,
            isCompanyLibrary: true,
            loading: false,
          })
        );
      }
    }, 10000);

    return () => clearInterval(interval.current);
  }, [tableFilters]);

  useEffect(() => {
    if (isLytics) setData(results);
    if (isCompany) setData(company.results);
    if (isPersonal) setData(personal.results);
  }, [results, company, personal]);

  useEffect(() => {
    if (isLytics) setNumberOfPages(totalPages ?? 0);
    if (isCompany) setNumberOfPages(company?.totalPages ?? 0);
    if (isPersonal) setNumberOfPages(personal?.totalPages ?? 0);
  }, [totalPages, company, personal]);

  useEffect(() => {
    if (isLytics) {
      dispatch(jobActions.fetchJobs.request({ ...tableFilters }));
    }
    if (isPersonal) {
      dispatch(
        libraryJobsActions.fetchJobsPersonal.request({ ...tableFilters, isPersonalLibrary: true })
      );
    }

    if (isCompany) {
      dispatch(
        libraryJobsActions.fetchJobsCompany.request({ ...tableFilters, isCompanyLibrary: true })
      );
    }
  }, [tableFilters]);

  const handleTableRowClick = (index, record) => {
    // setRowClickLoading(true);
    // dispatch(navActions.updateLink({ type: 'job', index }));
    // dispatch({ type: 'SET_COUNT_OF_CURRENT_JOB', payload: record.wordCount });
    if (isLytics) dispatch(jobActions.getJobById.request(record.id));
    if (isCompany || isPersonal) dispatch(libraryJobsActions.getJobById.request(record.id));
  };

  const setRowClassName = record => {
    return record.id === job?.id ? 'clickRowStyl' : '';
  };

  return (
    <div className="job-table-container">
      <SearchField
        extraClass="no-margin"
        placeholder="Search"
        searchText={searchText}
        handleOnChange={e => {
          setSearchText(e.target.value);
        }}
        handleSearch={handleSearch}
      />

      <Table
        className="table-columns"
        columns={columns()}
        rowKey={(record, index) => {
          record.id;
        }}
        data={data ?? []}
        pagination={false}
        disable={loading}
        loading={isLytics ? loading : libraryLoading}
        scroll={{ y: true }}
        showSorterTooltip={false}
        sortDirections={[]}
        sorter={false}
        sortOrder={false}
        onRow={(record, index) => {
          return {
            onClick: async event => {
              if (selectedChannelWindows.length) {
                const ifConfirm = await closeWindow();
                if (!ifConfirm) return;
                resetReducers();
              }
              resetReducers();

              handleTableRowClick(index, record);
              setRowId(record.id);
            },
          };
        }}
        rowClassName={setRowClassName}
      />
      <PaginationComp
        extraClass={'no-margin'}
        currentPage={pageNumber}
        totalCount={numberOfPages}
        onPageChange={page => {
          setPageNumber(page ?? 1);
          setTableFilters({ ...tableFilters, page: page });
          // dispatch(jobfilters.addPage.request(page));
        }}
      />
    </div>
  );
}

export default JobTable;
