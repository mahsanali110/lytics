import { Typography } from 'antd';
import { useSelector } from 'react-redux';

import { formatDate } from 'modules/common/utils';
import { Card, CardDetail } from 'components/Common';

const { Text } = Typography;

import './ProgramInformation.scss';

const ProgramInformation = () => {
  const state = useSelector(state => state);

  const {
    programName,
    programType,
    programDate,
    anchor,
    clippedBy,
    qcBy,
    guests,
    themes,
    channelLogoPath,
    programTime,
    markedBy,
  } = state.markerEditReducer;

  const content = (
    <>
      <section className="program-info-wrapper">
        <section className="program-info-body-wrapper-reviewer">
          <CardDetail variant="secondary">
            <section className="card-detail-body mt-10">
              <div className="mb-10">
                <Text className="text-grey medium-font-size mr-10">Channel:</Text>
                <img src={channelLogoPath} width="23.33" height="28.97" />
              </div>
              <div className="mb-10">
                <Text className="text-grey medium-font-size mr-10">Date:</Text>
                <Text className="text-pink medium-font-size">
                  {formatDate(programDate, 'DD/MM/YYYY')}{' '}
                </Text>
              </div>
              <div className="mb-10">
                <Text className="text-grey medium-font-size mr-10">Time:</Text>
                <Text className="text-pink medium-font-size">{programTime} </Text>
              </div>
              <div className="mb-10">
                <Text className="text-grey medium-font-size mr-10">Program Title:</Text>
                <Text className="text-pink medium-font-size">{programName} </Text>
              </div>
              <section style={{ marginTop: '30px' }}>
                <div className="mb-10">
                  <Text className="text-grey medium-font-size mr-10">Clipped By:</Text>
                  <Text className="text-pink medium-font-size">{clippedBy} </Text>
                </div>
                <div className="mb-10">
                  <Text className="text-grey medium-font-size mr-10">QC By:</Text>
                  <Text className="text-blue medium-font-size">{qcBy} </Text>
                </div>
                <div className="mb-10">
                  <Text className="text-grey medium-font-size mr-10">Marked By:</Text>
                  <Text className="text-green medium-font-size">{markedBy} </Text>
                </div>
              </section>
            </section>
          </CardDetail>
          <CardDetail variant="secondary" type="invert">
            <section className="card-detail-body mt-10">
              <div className="mb-10 list-container">
                <Text className="text-grey medium-font-size">Anchor(s):</Text>
                <ol>
                  {anchor?.map(name => (
                    <li className="text-pink medium-font-size" key={name}>
                      {name}
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          </CardDetail>
          <CardDetail variant="secondary" type="invert">
            <section className="card-detail-body mt-10">
              <div className="mb-10 list-container">
                <Text className="text-grey medium-font-size">Guest(s):</Text>
                <ol>
                  {guests?.map(guest => (
                    <li className="text-pink medium-font-size" key={guest.id}>
                      {guest.name}
                    </li>
                  ))}
                </ol>
              </div>
            </section>
          </CardDetail>
          <CardDetail variant="secondary" type="invert">
            <section className="card-detail-body mt-10">
              <div className="mb-10 list-container">
                <Text className="text-grey medium-font-size">Main Themes(s):</Text>
                <ol>
                  {themes.map(({ mainTheme }) => (
                    <li className="text-pink medium-font-size" key={mainTheme}>
                      {mainTheme}
                    </li>
                  ))}
                </ol>
              </div>
              <div className="mb-10 list-container">
                <Text className="text-grey medium-font-size">Sub Themes(s):</Text>
                <ol>
                  {themes
                    .map(({ subTheme }) => subTheme)
                    .flat()
                    .map(name => (
                      <li className="text-pink medium-font-size" key={name}>
                        {name}
                      </li>
                    ))}
                </ol>
              </div>
            </section>
          </CardDetail>
        </section>
      </section>
    </>
  );
  return <Card title="Program Information" shape="square" variant="primary" content={content} />;
};

export default ProgramInformation;
