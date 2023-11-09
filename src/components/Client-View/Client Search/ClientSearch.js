import React, { useState } from 'react';
import './ClientSearch.scss';
import { useHistory } from 'react-router-dom';
import { jobActions } from 'modules/jobs/actions';
import { SearchOutlined } from '@ant-design/icons';
import { useDispatch } from 'react-redux';
import { Input, message as antMessage } from 'antd';

import LyticsLogo from 'assets/images/Lytics_logo_W 1.png';

function ClientSearch() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [searchText, setSearchText] = useState('');

  const handleFetchJobs = () => {
    if (!searchText) {
      antMessage.error('Please provide a text to search!');
      return;
    }

    const hashObj = {
      searchText,
      isRedirect: true,
    };

    dispatch(jobActions.setHash.request(hashObj));

    history.push('/libraries');
  };

  const handleChange = e => {
    const { value } = e.target;
    setSearchText(value);
  };

  return (
    <div className="search background-db">
      <div className="content">
        <img src={LyticsLogo} alt="Lytics" style={{ marginBottom: '35px', width: '300px' }}></img>
        <div className="responsive-search-field" style={{ position: 'relative' }}>
          <Input
            size="large"
            placeholder="Search in Today..."
            onChange={handleChange}
            onPressEnter={handleFetchJobs}
            className="search-bar"
            prefix={
              <SearchOutlined
                style={{
                  color: '#EF233C',
                  paddingRight: '4px',
                  paddingLeft: '8px',
                  fontSize: '1.5rem',
                }}
              />
            }
            style={{ zIndex: 999 }}
          />
        </div>
      </div>
    </div>
  );
}
export default ClientSearch;
