import { memo } from 'react';
import { A11y, Autoplay, Navigation, Pagination, Scrollbar } from 'swiper';

import styled from 'styled-components';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Swiper, SwiperSlide } from 'swiper/react';
import { SliderWrapper } from './banner.styled';

const Banner = () => {
  const img = [
    { src: '../../../assets/images/ic-banner1.png' },
    { src: '../../../assets/images/ic-banner2.png' },
    { src: '../../../assets/images/ic-banner3.png' },
    { src: '../../../assets/images/ic-banner4.png' },
  ];
  return (
    <SliderWrapper>
      <div className="swiper-wrapper">
        <Swiper
          className="swiper-container"
          modules={[Navigation, Pagination, Scrollbar, A11y, Autoplay]}
          spaceBetween={50}
          slidesPerView={1}
          navigation
          pagination={{ clickable: true }}
          centeredSlides
          autoplay={{ delay: 5000 }}
        >
          {img.map((item, index) => {
            return (
              <SwiperSlide>
                <SliderTopUserImg srcImg={item.src}></SliderTopUserImg>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </SliderWrapper>
  );
};

export const SliderTopUserImg = styled.div<{ srcImg: string | undefined }>`
  width: auto;
  height: 90%;
  background: url(${(props) => props.srcImg}) no-repeat center center fixed;
  border-radius: 8px;
  background-size: contain;
  background-size: cover;
`;

export default memo(Banner);
