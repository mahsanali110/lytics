import { useState, useEffect } from 'react';
import propTypes from 'prop-types';
import { Card, HashTag } from '../';
import './HashCard.scss';
import { Input, message as antMessage } from 'antd';
import commonActions from 'modules/common/actions';
import { useDispatch } from 'react-redux';
const HashCard = ({
  hashTagOptions,
  handleSubmit,
  originalTags,
  setState,
  placeholder,
  hashtags,
  size,
  index,
  ...rest
}) => {
  const dispatch = useDispatch();
  const [listOptions, setListOptions] = useState();
  const [roundClass, setRoundClass] = useState('round-radius');
  const [hide, setHide] = useState('hide');
  const [searchText, setSearchText] = useState('');
  useEffect(() => {
    if (originalTags) {
      originalTags?.data[0]?.segments[0]?.hashtags[0].originalTag.map(tag => {
        hashtags.push(tag);
      });
    }
  }, []);

  useEffect(() => {
    setListOptions([...hashTagOptions]);
  }, [hashTagOptions]);
  const handleOnFocus = () => {
    setRoundClass('');
    setHide('');
  };
  const handleOnBlur = e => {
    setRoundClass('round-radius');
    setHide('hide');
  };
  const handleOnChange = e => {
    setSearchText(e.target.value);
    // const updateHashtags=()=>{

    // }
    const newList = hashTagOptions.filter(({ hashTag }) => {
      if (!e.target.value.trim()) return true;
      if (hashTag.includes(e.target.value)) {
        return true;
      }
      return false;
    });
    setListOptions(newList);
    // if (!originalTags?.data[0]?.segments[0]?.hashtags[0].originalTag.includes(e.target.value)) {
    //   originalTags?.data[0]?.segments[0]?.hashtags[0].originalTag.push(e.target.value);
    //   setState(originalTags);
    //   console.log(originalTags)
    // }
  };
  const handleOnSubmit = value => {
    if (!value.trim()) return;
    if (!value.startsWith('#')) return antMessage.error('Hashtag must starts with #', 2);
    if (hashtags.includes(value)) return antMessage.error('Hashtag already exist', 2);
    if (!hashTagOptions.map(({ hashTag }) => hashTag).includes(value)) {
      dispatch(commonActions.createHashtag.request({ hashTag: value }));
    }
    handleSubmit({ value: [...hashtags, value], field: 'hashtags', index });
    setSearchText('');
    setListOptions(hashTagOptions);
  };
  const handleDelete = i => {
    const newArray = [...hashtags];
    newArray.splice(i, 1);
    handleSubmit({ value: [...newArray], field: 'hashtags', index });
  };
  const content = (
    <div className="hash-container">
      <h2>Add Hashtag</h2>
      <div className={`hash-search-field ${roundClass}`}>
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
            {listOptions?.map(({ hashTag }, index) => {
              return (
                <li
                  key={index}
                  onMouseDownCapture={() => handleOnSubmit(hashTag)}
                  className="hashtag"
                >
                  {hashTag}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      <div className="hashtag-collection" style={{ width: '100%' }}>
        {hashtags.map((tag, index) => (
          <HashTag key={index} hashtag={tag} handleDelete={handleDelete} index={index} />
        ))}
      </div>
    </div>
  );
  return <Card title="Hashtags" content={content} />;
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
  hashTagOptions: [],
  shape: '',
  placeholder: 'Search Hashtag',
  size: 'large',
  onChange: () => {},
  handleSubmit: () => {},
};
export default HashCard;
