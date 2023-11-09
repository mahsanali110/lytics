import PropTypes from 'prop-types';

import { Input, Typography } from 'antd';
import { Card, CardDetail, Tag } from 'components/Common';

const { TextArea } = Input;
const { Text } = Typography;

const Anchor = ({ name, scale, description, sentiment }) => {
  return (
    <Card
      title="Segment Anchor Particular"
      shape="square"
      bg="mid-dark"
      content={
        <section className="card-detail-body">
          <div className="mb-10">
            <Text className="text-grey medium-font-size mr-10">Anchor Name:</Text>
            <Text className="text-pink medium-font-size">{name} </Text>
          </div>
          <div className="mb-10">
            <Text className="text-grey medium-font-size mr-10">Snetiment:</Text>
            <Tag text={sentiment} variant={sentiment ? sentiment.toLowerCase() : 'default'} />
          </div>
          <div className="mb-10">
            <Text className="text-grey medium-font-size mr-10">Scale:</Text>
            <Text className="text-pink medium-font-size">{scale} </Text>
          </div>
          <div className="mb-10">
            <TextArea value={description} className="bg-light-grey" rows={2} readOnly />
          </div>
        </section>
      }
    />
  );
};

Anchor.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  sentiment: PropTypes.string,
  scale: PropTypes.string,
};

export default Anchor;
