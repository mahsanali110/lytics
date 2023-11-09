import { Table } from 'antd';

import './Table.scss';

const IMSTable = ({
  searchedValue,
  columns,
  data,
  pagination,
  loading,
  handleTableChange,
  variant,
  ...rest
}) => (
  <div className={`table-container ${variant}`}>
    <Table
      columns={columns}
      rowKey={record => record.key}
      dataSource={data}
      pagination={pagination}
      loading={loading}
      onChange={handleTableChange}
      {...rest}
      style={{ fontSize: '14px' }}
    />
  </div>
);

export default IMSTable;
