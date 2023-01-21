import { Colors, FontSize } from '@namo-workspace/themes';
import styled from 'styled-components';

export const SliderWrapper = styled.div`
  background: url('../../assets/images/Banner.svg') no-repeat center;
  background-size: cover;
  background-position: 0px 65px;

  width: 100%;
  .swiper-container {
    width: 68%;
    height: 600px;
    margin: 0 auto;
    text-align: center;
    padding: 0;
    img {
      border-radius: 8px;
      margin-top: 82px;
    }
  }
  .swiper-button-prev,
  .swiper-button-next {
    background-color: transparent;
    right: 10px;
    padding: 10px 20px 10px 20px;
    color: ${Colors.white} !important;
    fill: black !important;
    border: 1px solid ${Colors.white};
    border-radius: 8px;
  }

  .swiper-button-next:after,
  .swiper-button-prev:after {
    font-size: ${FontSize.body1}px;
  }
`;
