import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card } from '../';
import './TopicCard.scss';
import { TreeSelect } from '../';
import { message as antMessage } from 'antd';
import {
  getTopicKeys,
  getTopicValue,
  getTopicKeyFromValue,
  isNewTopic,
} from 'modules/common/utils';
import { markerEditActions } from 'modules/markerEdit/actions';
const { changeTopic3 } = markerEditActions;
const TopicCard = ({ csvData, setState, topics, topicOptions, index, ...rest }) => {
  const dispatch = useDispatch();
  const topicMap = useSelector(state => state.commonReducer.topicMap);
  let data = csvData?.data[0]?.segments[0]?.topics?.topic3[0];

  const [csvValue, setCsvValue] = useState(data);
  const handleOnChange = (val, node, extra) => {
    if (
      topics?.topic3?.length &&
      extra.checked &&
      isNewTopic(
        getTopicKeyFromValue(topics?.topic3[0], topicMap, topics?.topic1),
        extra?.triggerValue
      )
    ) {
      return antMessage.error('Max topic 1 limit reached', 2);
    }
    // else if (val.length > 1) {
    //   return antMessage.error('Max topic 1 limit reached', 2);
    // }
    else {
      setCsvValue(getTopicKeyFromValue(topics.topic3, topicMap, topics.topic1));
      // if (!csvData?.data[0]?.segments[0]?.topics?.topic3.includes(val)) {
      //   csvData?.data[0]?.segments[0]?.topics?.topic3.push(val);
      //   setState(csvData);
      // }
    }
    let topic1 = '',
      topic2 = [];
    // get the values for topic1 and topic 2
    if (val.length) {
      const { topic1Key, topic2Keys } = getTopicKeys(val, true, true);
      topic1 = getTopicValue(topic1Key, topicMap, true);
      topic2 = getTopicValue(topic2Keys, topicMap, true);
    }
    dispatch(changeTopic3({ index, field: 'topic3', value: { topic1, topic2, topic3: node } }));
  };
  const handleOnSelect = (value, info) => {};
  const content = (
    <div className="topic-container">
      <TreeSelect
        treeData={topicOptions}
        value={getTopicKeyFromValue(topics.topic3, topicMap, topics.topic1)}
        handleOnChange={handleOnChange}
        handleOnSelect={handleOnSelect}
        placeholder="Search topics"
        {...rest}
      />
    </div>
  );
  return <Card title="Topics" content={content} />;
};
export default TopicCard;
