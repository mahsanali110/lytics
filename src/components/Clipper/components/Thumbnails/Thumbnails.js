import { useState, useEffect } from 'react';
import moment from 'moment';
import { Typography, Slider, Image } from 'antd';
import { Card } from 'components/Common';
import { formatDate } from 'modules/common/utils';
import { useSelector } from 'react-redux';
import { LazyLoadImage } from 'react-lazy-load-image-component';

import image from './../../../../assets/images/image.jpg';
const { Text } = Typography;

import './Thumbnails.scss';

const Thumbnails = ({
  channel,
  from,
  to,
  programDate,
  handleSeekbarChange,
  playerCurrentPosition,
  actusPlayer,
  setPlayerCurrentPosition,
  play,
}) => {
  const [thumbnailInterval, setThumbnailInterval] = useState(2);

  const [thumbnails, setThumbnails] = useState([]);
  const ACTUS_WEBHOST = useSelector(state => state.multiviewReducer.actus_webhost);

  const marks = [2, 5, 10, 15].reduce((acc, c) => {
    acc[c] = {
      label: `${c}`,

      style: { color: c == thumbnailInterval ? '#EF233C' : '#d3d3d3' },
    };

    return acc;
  }, {});
  ///This function will auto scroll the statement to the time
  var t;
  useEffect(() => {
    if (play === true) {
      t = setInterval(scroll, 1000);
    }
    //  else if (play === false) {
    //   clearInterval(t);
    // }
    return () => clearInterval(t);
  }, [play]);
  const scroll = e => {
    let tag = document.querySelector('.glow-class');
    if (tag !== undefined && tag !== null) {
      // tag.parentNode.scrollTop = tag.offsetTop;
      tag.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'nearest',
        boundary: document.getElementsByClassName(tag.parentNode),
      });
    }
  };
  useEffect(() => {
    const fromDuration = moment.duration(from).asSeconds();
    const toDuration = moment.duration(to).asSeconds();
    let _thumnails = [];
    let _thumbnailInterval = 0;
    for (let i = fromDuration; i <= toDuration; i += thumbnailInterval) {
      let currentTime = moment(from).set({
        hours: from.get('hour'),
        minutes: from.get('minute'),
        seconds: from.get('second') + _thumbnailInterval,
      });

      _thumnails.push({
        thumbnail: formatDate(currentTime, 'YYYY_MM_DD_HH_mm_ss'),
        second: _thumbnailInterval,
      });

      _thumbnailInterval = _thumbnailInterval + thumbnailInterval;
    }
    setThumbnails(_thumnails);
  }, [from, to, thumbnailInterval]);

  return (
    <Card
      bg="dark"
      variant="secondary"
      content={
        <section className="thumbnails-wrapper">
          <section className="card-detail-body mt-10">
            <div className="">
              <Text className="text-pink">Thumbnails</Text>
            </div>
            <div>
              <Slider
                style={{ marginLeft: '30px', marginRight: '30px' }}
                marks={marks}
                step={15}
                value={thumbnailInterval}
                min={2}
                max={15}
                dots
                onChange={val => setThumbnailInterval(val)}
              />
            </div>
            <div className="thumbnails-container mt-10">
              {thumbnails.map((thumb, index) => {
                return (
                  <figure
                    key={index}
                    onClick={() => {
                      handleSeekbarChange(thumb.second), actusPlayer.setPosition(thumb.second);
                    }}
                  >
                    {/* <img
                      data-time={thumb.second}
                      className={
                        playerCurrentPosition >= thumb.second &&
                        playerCurrentPosition < thumbnails[index + 1]?.second
                          ? 'glow-class'
                          : ''
                      }
                      width="100%"
                      src={`${ACTUS_WEBHOST}/api/channels/${channel}/thumbnail?time=${thumb.thumbnail}`}
                    /> */}
                    <LazyLoadImage
                      //alt={image}
                      className={
                        playerCurrentPosition >= thumb.second &&
                        playerCurrentPosition < thumbnails[index + 1]?.second
                          ? 'glow-class'
                          : ''
                      }
                      placeholderSrc={image}
                      effect="blur"
                      src={`${ACTUS_WEBHOST}/api/channels/${channel}/thumbnail?time=${thumb.thumbnail}`} // use normal <img> attributes as props
                      width="100%"
                    />
                    <figcaption>
                      <Text className="text-grey">
                        {thumb.thumbnail.slice(11, 19).replaceAll('_', ':')}
                      </Text>
                    </figcaption>
                  </figure>
                );
              })}
            </div>
          </section>
        </section>
      }
    />
  );
};

export default Thumbnails;
