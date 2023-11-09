import { Typography, Collapse } from 'antd';

import { Card } from 'components/Common';

import './InfoDetails.scss';

import InfoContent from 'constants/info-content';

const { Panel } = Collapse;


const { Title, Paragraph } = Typography;

const TrainingBook = (props) => {
  const pagePath = props.match.path
  const {title, description, faqs, FaqIcon, subHeading } = InfoContent.find(info => info.path === pagePath);

  function callback(key) {
    console.log(key);
  }

  return (
    <div className="infoDetailsCard">
      <Card
        title={title}
        bg="light"
        shape="round"
        content={
          <>
            <div className="InfoDetails-wrapper">
              <div className="InfoDetails-body-wrapper">
                <div className="InfoDetails-body-content">
                  <div className="InfoDetails-card-text">
                  <Title level={4} className="text-left">{subHeading}</Title>
                    <Paragraph>
                      {description}
                    </Paragraph>
                  </div>
                  <Collapse expandIconPosition="right" onChange={callback} accordion>
                  {faqs?.map(({ quiz, ans }) => (
                      <Panel header={quiz} key={quiz} extra={<FaqIcon />}>
                        <p>{ans}</p>
                      </Panel>
                    ))}
                  </Collapse>
                </div>
              </div>
            </div>
          </>
        }
      />
    </div>
  );
};

export default TrainingBook;
