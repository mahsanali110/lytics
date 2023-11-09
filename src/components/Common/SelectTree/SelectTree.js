import { TreeSelect } from 'antd';
import propTypes from 'prop-types';
const { SHOW_PARENT } = TreeSelect;

import './SelectTree.scss';

const IMSTreeSelect = ({ treeData, value, handleOnChange, placeholder, size, ...rest }) => {
  return (
    <div className="tree-select-container">
      <TreeSelect
        treeData={treeData}
        size={size}
        getPopupContainer={trigger => trigger.parentNode}
        dropdownClassName="tree-select-dropdown"
        showSearch={true}
        filterTreeNode={(search, item) => {
          return item.title.toLowerCase().indexOf(search.toLowerCase()) >= 0;
        }}
        maxTagCount="responsive"
        showArrow={true}
        allowClear={true}
        value={value}
        multiple={false}
        onChange={handleOnChange}
        treeCheckable={true}
        //   showCheckedStrategy={SHOW_PARENT}
        style={{ width: '100%' }}
        placeholder={placeholder}
        {...rest}
      />
    </div>
  );
};

IMSTreeSelect.propTypes = {
  treeData: propTypes.array,
};

IMSTreeSelect.defaultProps = {
  size: 'large',
  placeholder: 'Select',
  handleOnChange: () => {},
};

export default IMSTreeSelect;
