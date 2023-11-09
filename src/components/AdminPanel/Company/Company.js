import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Col, Row, Space, Spin } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';

import { Table, Image } from 'components/Common';
import Settings from 'components/Settings';
import companyActions from 'modules/company/action';
import { networkError, errorCount, errorDelay } from 'constants/config/errorLoader';

const CompanyTableData = () => {
  const dispatch = useDispatch();
  const [companyCount, setCompanyCount] = useState(1);
  const { companies, companiesError, loading } = useSelector(state => state.companyReducer);
  const { searchText } = useSelector(state => state.commonReducer);
  let [CompanyData, setCompanyData] = useState([]);
  useEffect(() => {
    dispatch(companyActions.getCompanies.request());
  }, []);
  useEffect(() => {
    if (companiesError || companiesError === networkError) {
      setCompanyCount(prevCount => prevCount + 1);
      if (companyCount <= errorCount) {
        setTimeout(() => {
          dispatch(companyActions.getCompanies.request());
        }, errorDelay);
      } else if (companiesError === networkError) {
        alert(`${companiesError}, Please refresh!`);
        window.location.reload();
      } else if (companiesError !== networkError) {
        alert(`${companiesError}, Please refresh!`);
        window.location.reload();
      }
    }
  }, [companiesError]);
  useEffect(() => {
    setCompanyData(companies);
  }, [companies]);
  useEffect(() => {
    if (searchText === '') {
      dispatch(companyActions.getCompanies.request());
    } else {
      let company_data = CompanyData.filter(
        company =>
          company.name.toLowerCase().includes(searchText.toLowerCase()) ||
          company.contact.toLowerCase().includes(searchText.toLowerCase()) ||
          company.id.toLowerCase().includes(searchText.toLowerCase())
      );

      setCompanyData(company_data);
    }
  }, [searchText]);
  const getCompany = companyId => {
    dispatch(companyActions.getCompany.request(companyId));
  };

  const deleteCompany = companyId => {
    const confirmDelete = window.confirm(
      'This action cannot be undone. Are you sure you want to delete this item?'
    );
    if (confirmDelete) dispatch(companyActions.deleteCompany.request(companyId));
  };

  const columns = [
    {
      align: 'center',
      title: 'Serial No.',
      dataIndex: 'sr',
    },
    // {
    //   align: 'center',
    //   title: 'Image',
    //   dataIndex: 'photoPath',
    //   render: photoPath => {
    //     if (photoPath) return <Image width={40} height={47} src={photoPath} preview={false} />;
    //   },
    // },
    {
      align: 'center',
      title: 'Company Name',
      dataIndex: 'name',
    },
    {
      align: 'center',
      title: 'Contact',
      dataIndex: 'contact',
    },
    {
      align: 'center',
      title: 'Company ID',
      dataIndex: 'companyId',
    },
    {
      align: 'center',
      title: 'Edit',
      key: 'edit',
      render: ({ id }) => (
        <Space onClick={() => getCompany(id)} style={{ cursor: 'pointer' }}>
          <EditOutlined style={{ fontSize: '18px' }} />
        </Space>
      ),
    },
    {
      align: 'center',
      title: 'Delete',
      key: 'delete',
      render: ({ id }) => (
        <Space onClick={() => deleteCompany(id)} style={{ cursor: 'pointer' }}>
          <DeleteOutlined style={{ fontSize: '18px' }} />
        </Space>
      ),
    },
  ];

  return (
    <>
      <Row className="table-row">
        <Col span={2}></Col>
        <Col span={20}>
          <div className="table-container">
            <Spin spinning={companiesError} delay={500}>
              <Table
                columns={columns}
                data={CompanyData.map((company, index) => ({
                  key: company.id,
                  sr: index + 1,
                  ...company,
                }))}
                loading={loading}
              />
            </Spin>
          </div>
        </Col>
        <Col span={1}></Col>
      </Row>
    </>
  );
};

const Company = () => {
  return <Settings newTable={CompanyTableData} />;
};

export default Company;
