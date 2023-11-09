import { Card, SearchField } from 'components/Common';
import InfoBlock from './InfoBlock';
import {useState, useEffect} from 'react';
import {useDispatch} from 'react-redux'
import './Info.scss';
import InfoContent from 'constants/info-content';
const Info = () => {
  const dispatch = useDispatch()
  const [searchText, setSearchText] = useState('');
  const handleOnChange = e => {
  setSearchText(e.target.value)
  };
  const handleSearch = () => {
    dispatch({ type: 'SEARCH_SETTINGS', payload: searchText });
  };
  return (
    <div>
      <Card
        title="Information Centre"
        bg="light"
        shape="round"
        content={
          <>
            <div className="info-wrapper">
              <SearchField
                placeholder="Search"
                handleOnChange={handleOnChange}
                handleSearch={handleSearch}
              />
              <div className="info-body-wrapper">
                {InfoContent.map((info, i) => (
                  <InfoBlock {...info} key={i} searchText={searchText}/>
                ))}
              </div>
            </div>
          </>
        }
      />
    </div>
  );
};

export default Info;
