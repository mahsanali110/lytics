import React, { useEffect, useState } from 'react';
import { Col, Row, Space, Spin } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import Settings from 'components/Settings';
import { Table } from 'components/Common';
import programTypesActions from 'modules/programTypes/actions';
import { networkError, errorCount, errorDelay } from 'constants/config/errorLoader';

const ProgramTableRecord = () => {
  const dispatch = useDispatch();
  const [programTypeCount, setProgramTypeCount] = useState(1);
  const { programTypes, programTypesError, loading } = useSelector(
    state => state.programTypesReducer
  );
  const { searchText } = useSelector(state => state.commonReducer);
  let [programNameTypes, setProgramNamesType] = useState([]);
  useEffect(() => {
    dispatch(programTypesActions.getProgramTypes.request());
  }, []);
  useEffect(() => {
    if (programTypesError || programTypesError === networkError) {
      setProgramTypeCount(prevCount => prevCount + 1);
      if (programTypeCount <= errorCount) {
        setTimeout(() => {
          dispatch(programTypesActions.getProgramTypes.request());
        }, errorDelay);
      } else if (programTypesError === networkError) {
        alert(`${programTypesError}, Please refresh!`);
        window.location.reload();
      } else if (programTypesError !== networkError) {
        alert(`${programTypesError}, Please refresh!`);
        window.location.reload();
      }
    }
  }, [programTypesError]);
  useEffect(() => {
    setProgramNamesType(programTypes);
  }, [programTypes]);
  useEffect(() => {
    if (searchText === '') {
      dispatch(programTypesActions.getProgramTypes.request());
    } else {
      let program_names = programNameTypes.filter(
        program =>
          program.name.toLowerCase().includes(searchText.toLowerCase()) ||
          program.description.toLowerCase().includes(searchText.toLowerCase())
      );
      setProgramNamesType(program_names);
    }
  }, [searchText]);
  const getProgramType = programTypeId => {
    dispatch(programTypesActions.getProgramType.request(programTypeId));
  };

  const deleteProgramType = programTypeId => {
    const confirmDelete = window.confirm(
      'This action cannot be undone. Are you sure you want to delete this item?'
    );
    if (confirmDelete) dispatch(programTypesActions.deleteProgramType.request(programTypeId));
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
      dataIndex: 'name',
    },
    {
      align: 'center',
      title: 'Description',
      dataIndex: 'description',
    },
    {
      align: 'center',
      title: 'Source',
      dataIndex: 'source',
    },
    {
      align: 'center',
      title: 'Edit',
      key: 'edit',
      render: ({ id }) => (
        <Space onClick={() => getProgramType(id)} style={{ cursor: 'pointer' }}>
          <EditOutlined style={{ fontSize: '18px' }} />
        </Space>
      ),
    },
    {
      align: 'center',
      title: 'Delete',
      key: 'delete',
      render: ({ id }) => (
        <Space onClick={() => deleteProgramType(id)} style={{ cursor: 'pointer' }}>
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
            <Spin spinning={programTypesError} delay={500}>
              <Table
                columns={columns}
                data={programNameTypes.map((programType, index) => ({
                  key: programType.id,
                  sr: index + 1,
                  ...programType,
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
const ProgramTypes = () => {
  return <Settings newTable={ProgramTableRecord} />;
};

export default ProgramTypes;
