import { A11y, Navigation, Pagination, Scrollbar } from 'swiper';

import { InfoNFT } from '@namo-workspace/services';
import styled from 'styled-components';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { ReactComponent as IcETH } from '@assets/images/ic-Etherium.svg';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Colors } from '@namo-workspace/themes';
import { parseWei } from '@namo-workspace/utils';

interface Props {
  recommendList?: InfoNFT[];
}

const RecommendNFT = ({ recommendList }: Props) => {
  return (
    <>
      <div className="d-flex justify-content-between pb-3 pb-3 pt-4">
        <SliderTopUserDescription>
          More from this store
        </SliderTopUserDescription>
      </div>

      <SliderTopUser>
        <div>
          <Swiper
            className="swiper-container"
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={10}
            slidesPerView={4}
            navigation
          >
            {recommendList?.map((item) => {
              return (
                <SwiperSlide key={item.id}>
                  <WrapperSlider>
                    <SliderRecommendImg
                      src={item?.metaData?.image}
                    ></SliderRecommendImg>
                    <NameTopUser>{item?.name ? item?.name : '-'}</NameTopUser>
                    <PriceTopUser>
                      <IcETH width={16} height={16} />
                      {parseWei(
                        item?.packageDurationMin?.price
                          ? item?.packageDurationMin?.price
                          : 0
                      )}
                      /
                      {item?.packageDurationMin?.label
                        ? item?.packageDurationMin?.label
                        : '-'}
                    </PriceTopUser>
                  </WrapperSlider>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </SliderTopUser>
    </>
  );
};

export const SliderTopUser = styled.div`
  .swiper-button-prev {
    border-radius: 19px;
    width: 34px;
    height: 34px;
    background: url('../../../assets/images/ic-back-button.png');
    background-repeat: no-repeat;
    background-position: center;
  }
  .swiper-button-next {
    border-radius: 19px;

    width: 34px;
    height: 34px;
    background: url('../../../assets/images/ic-next-button.png');
    background-repeat: no-repeat;
    background-position: center;
  }
  .swiper-button-next:after,
  .swiper-button-prev:after {
    font-size: 0px;
  }
  padding-bottom: 10px;
  .swiper-wrapper {
    margin-left: 30px;
  }
`;

export const SliderTopUserImg = styled.div<{ srcImg: string | undefined }>`
  width: 200px;
  height: 200px;
  background: url(${(props) => props.srcImg});
  background-size: cover;
  background-repeat: no-repeat;
  img {
    width: 45px;
    height: 45px;
  }
`;

export const SliderRecommendImg = styled.img`
  width: 200px;
  height: 200px;
  vertical-align: middle;
  max-height: 100%;
  max-width: 100%;
  img {
    width: 45px;
    height: 45px;
  }
`;
export const NameTopUser = styled.div`
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  padding: 10px 10px 0px 0px;
`;
export const PriceTopUser = styled.div`
  font-size: 14px;
  font-weight: 700;
  text-align: center;
  padding: 10px 10px 0px 0px;
`;

export const ViewMoreTopUser = styled.div`
  padding-right: 10px;
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  color: #f5b24c;
  cursor: pointer;
  &:hover {
    color: rgb(221, 156, 58);
  }
`;
export const WrapperSlider = styled.div`
  padding: 8px;
  border: 1px solid ${Colors.strokeLevel3};
  border-radius: 30px;
  height: 300px;
  width: 78%;
`;
export const SliderTopUserDescription = styled.div`
  font-size: 24px;
  font-weight: 700;
`;

export default RecommendNFT;
