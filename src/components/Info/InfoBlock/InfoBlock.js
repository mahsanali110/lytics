import { Link } from 'react-router-dom';
import { Typography, Collapse } from 'antd';

import { Card } from 'components/Common';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import { useState, useEffect } from 'react';
const { Panel } = Collapse;
const { Title, Paragraph } = Typography;
import { UpOutlined, DownOutlined } from '@ant-design/icons';

const InfoBlock = props => {
  const { searchText } = useSelector(state => state.commonReducer);
  const [faqsData, setFaqsData] = useState([]);
  const { Icon, FaqIcon, title, description, faqs, path } = props;

  useEffect(() => {
    setFaqsData(faqs);
  }, [faqs]);

  useEffect(() => {
    if (searchText === '') {
      setFaqsData(faqs);
    } else {
      let faqs_data = faqs.filter(faq => faq.ans.toLowerCase().includes(searchText.toLowerCase()));
      setFaqsData(faqs_data);
    }
  }, [searchText]);
  function callback(key) {}

  return (
    <>
      <div className="info-body-content">
        <Link to={path}>
          <Card
            title=""
            bg="lighter"
            shape="round"
            content={
              <div className="info-card-content">
                <Icon />
              </div>
            }
          />
        </Link>
        <div className="info-card-text">
          <Link to={path}>
            {' '}
            <Title level={3}>{title}</Title>
          </Link>
          <Paragraph>{_.truncate(description, { length: 150 })}</Paragraph>
        </div>
        {faqs?.length > 0 && (
          <Collapse
            expandIconPosition="right"
            expandIcon={({ isActive }) => (isActive ? <DownOutlined /> : <UpOutlined />)}
            onChange={callback}
          >
            {faqsData.map(({ quiz, ans }) => (
              <Panel
                header={<span title={quiz}>{_.truncate(quiz)}</span>}
                key={quiz}
                extra={<FaqIcon />}
              >
                <p>{ans}</p>
              </Panel>
            ))}
          </Collapse>
        )}
      </div>
    </>
  );
};

export default InfoBlock;
