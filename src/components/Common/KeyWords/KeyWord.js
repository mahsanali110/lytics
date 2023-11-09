import { useState, useEffect } from 'react';
import propTypes from 'prop-types';
import { Card, HashTag } from '..';
import './KeyWord.scss';
import { Input, message as antMessage } from 'antd';

const HashCard = ({ handleSubmit, placeholder, hashtags, size, index, alarmOptions, ...rest }) => {
  const [listOptions, setListOptions] = useState();
  const [roundClass, setRoundClass] = useState('round-radius');
  const [hide, setHide] = useState('hide');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    setListOptions(
      alarmOptions.map(keyWord => ({
        title: keyWord.queryWord,
        value: keyWord.queryWord,
      }))
    );
  }, [alarmOptions]);

  const handleOnFocus = () => {
    setRoundClass('');
    setHide('');
  };

  const handleOnBlur = e => {
    setRoundClass('round-radius');
    setHide('hide');
  };

  const handleOnChange = e => {
    if (e.target.value === '') {
      setListOptions(
        alarmOptions.map(keyWord => ({
          title: keyWord.queryWord,
          value: keyWord.queryWord,
        }))
      );
    } else {
      const filteredAlarms = alarmOptions.filter(keyWord =>
        keyWord.queryWord.toUpperCase().includes(e.target.value.toUpperCase())
      );
      setListOptions(
        filteredAlarms.map(keyWord => ({
          title: keyWord.queryWord,
          value: keyWord.queryWord,
        }))
      );
    }
    setSearchText(e.target.value);
  };

  const handleOnSubmit = value => {
    if (listOptions.map(item => item.title).includes(value) === false) {
      return antMessage.error('Cannot add this Keyword', 2);
    } else {
      if (!value.trim()) return;
      if (hashtags.includes(value)) return antMessage.error('Keyword already exist', 2);
      handleSubmit('', 'keyWords', [...hashtags, value]);
    }
    setSearchText('');
  };

  const handleDelete = i => {
    const newArray = [...hashtags];
    newArray.splice(i, 1);
    handleSubmit('', 'keyWords', [...newArray]);
  };
  const content = (
    <div className="keyword-container">
      <h2>Add New Keyword</h2>
      <div className={`keyword-search-field ${roundClass}`}>
        <Input
          size={size}
          value={searchText}
          allowClear
          placeholder={placeholder}
          prefix={<CustomButton handleOnSubmit={handleOnSubmit} searchText={searchText} />}
          onChangeCapture={e => handleOnChange(e)}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
          maxLength={32}
          onPressEnter={() => handleOnSubmit(searchText)}
          {...rest}
        />
        <div className={`hashtag-list-container ${hide}`}>
          <ul className="hashtag-list">
            {listOptions?.map(({ title }, index) => {
              return (
                <li
                  key={index}
                  onMouseDownCapture={() => handleOnSubmit(title)}
                  className="hashtag"
                >
                  {title}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="hashtag-collection">
        {hashtags.map((tag, index) => (
          <HashTag key={index} hashtag={tag} handleDelete={handleDelete} index={index} />
        ))}
      </div>
    </div>
  );
  return (
    <Card
      className="ant-card ant-card-small card-container-primary medium square keyword-card"
      content={content}
    />
  );
};

const CustomButton = ({ handleOnSubmit, searchText }) => {
  return (
    <span
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        background: '#2C2E35',
        width: '49px',
        height: '33px',
        borderRadius: '9px',
        color: 'white',
        fontSize: '11px',
        fontWeight: 'bold',
        lineHeight: '13px',
        letterSpacing: '0.5px',
        cursor: 'pointer',
      }}
      onClick={() => handleOnSubmit(searchText)}
    >
      {' '}
      ADD{' '}
    </span>
  );
};
HashCard.defaultProps = {
  shape: '',
  placeholder: 'Search Hashtag',
  size: 'large',
  onChange: () => {},
  handleSubmit: () => {},
};
export default HashCard;
