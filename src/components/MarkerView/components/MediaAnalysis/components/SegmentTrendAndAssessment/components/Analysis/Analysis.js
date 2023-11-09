import PropTypes from 'prop-types';

import { Input, Typography } from 'antd';
import { Card, Tag } from 'components/Common';

const { TextArea } = Input;
const { Text } = Typography;

const Analysis = ({ scale, analyst }) => {
  return (
    <Card
      title="Overall Segment Analysis"
      shape="square"
      bg="mid-dark"
      content={
        <section className="card-detail-body">
          <div>
            <Tag text={scale} variant={scale ? scale.toLowerCase() : 'default'} />
          </div>
          <div>
            <Text className="text-grey small-font-size mr-10">Analyst Remarks</Text>{' '}
            <TextArea value={analyst} className="bg-light-grey" rows={5} readOnly />
          </div>
        </section>
      }
    />
  );
};

Analysis.propTypes = {
  scale: PropTypes.string,
  analyst: PropTypes.string,
};

export default Analysis;
