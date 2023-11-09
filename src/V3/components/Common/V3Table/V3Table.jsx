import { Table } from 'antd';
import PropTypes from 'prop-types';

import './V3Table.scss';

const V3Table = ({
  searchedValue,
  columns,
  data,
  pagination,
  loading,
  handleTableChange,
  variant,
  ...rest
}) => (
  <div className={`V3Table ${variant}`}>
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

V3Table.propTypes = {
  columns: PropTypes.array,
  variant: PropTypes.oneOf(['primary', 'secondary']),
};

V3Table.defaultProps = {
  variant: 'primary',
};

export default V3Table;
