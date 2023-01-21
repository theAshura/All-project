import { memo } from 'react';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { SliderWrapper } from './banner.styled';
import styled from 'styled-components';

const Banner = () => {
  return (
    <SliderWrapper>
      <div className="swiper-wrapper">
        <Swiper
          className="swiper-container"
          modules={[Navigation, Pagination, Scrollbar, A11y]}
          spaceBetween={50}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          centeredSlides
        >
          <SwiperSlide>
            <SliderTopUserImg></SliderTopUserImg>
          </SwiperSlide>
          <SwiperSlide>
            <SliderTopUserImg></SliderTopUserImg>
          </SwiperSlide>
          <SwiperSlide>
            <SliderTopUserImg></SliderTopUserImg>
          </SwiperSlide>
          <SwiperSlide>
            <SliderTopUserImg></SliderTopUserImg>
          </SwiperSlide>
        </Swiper>
      </div>
    </SliderWrapper>
  );
};

export const SliderTopUserImg = styled.div`
  width: auto;
  height: 90%;
  background: url('../../assets/images/Dogbanner.jpg');
  border-radius: 8px;
  background-size: contain;
  background-size: 100%;
`;

export default memo(Banner);
