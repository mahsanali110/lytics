import React from 'react';
import { Carousel } from 'antd';
import PinchZoomPan from 'react-image-zoom-pan';
import { uploadPath } from 'constants/index';

import './ImageSlider.scss';
import { USERS_BASE_URL } from 'constants/config';

function ImageSlider({ images }) {
  return (
    <div className="image-slider-wrapper">
      <Carousel>
        {images.map(image => (
          <div className="image-container">
            <PinchZoomPan maxScale={2} position="center">
              <img src={`${USERS_BASE_URL}/${uploadPath}/${image}`} />
            </PinchZoomPan>
          </div>
        ))}
      </Carousel>
    </div>
  );
}

export default ImageSlider;
