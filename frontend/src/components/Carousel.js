import React from 'react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

import dash1 from '../assets/Dash1.jpeg';
import dash2 from '../assets/Dash2.jpeg';
import dash3 from '../assets/Dash3.jpeg';

const Carousel = ({ className = '' }) => { 
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    autoplay: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

  const images = [dash1, dash2, dash3];

  return (
    <div className="w-full max-w-3xl mx-auto mt-4 rounded-2xl overflow-hidden shadow-lg">
      <Slider {...settings}>
        {images.map((img, index) => (
          <div key={index}>
            <img
              src={img}
              alt={`dashboard ${index + 1}`}
              className={`w-full h-full object-cover block ${className}`}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default Carousel;
