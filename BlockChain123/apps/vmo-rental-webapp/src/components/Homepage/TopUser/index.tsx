import { memo, useCallback } from 'react';
import { A11y, Navigation, Pagination, Scrollbar } from 'swiper';
import { defaultAvatar } from '@assets/images';

import { ListTopUserResponse } from '@namo-workspace/services';
import styled from 'styled-components';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import { Swiper, SwiperSlide } from 'swiper/react';
import medal1 from '../../../assets/images/ic-medal1.png';
import medal2 from '../../../assets/images/ic-medal2.png';
import medal3 from '../../../assets/images/ic-medal3.png';
import invisibleImg from '../../../assets/images/ic-transparent-pic.png';
import { ROUTES } from '@constants/routes';
import { Link } from 'react-router-dom';
import { LinkS } from '@components/ListNFT/listNFT.styled';

interface Props {
  listTopUser?: ListTopUserResponse[];
}

const TopUser = ({ listTopUser }: Props) => {
  const addMedal = useCallback((index: number) => {
    if (index === 0) {
      return medal1;
    }
    if (index === 1) {
      return medal2;
    }
    if (index === 2) {
      return medal3;
    }
    return invisibleImg;
  }, []);
  return (
    <>
      <div className="d-flex justify-content-between pb-3 pb-3 pt-4">
        <SliderTopUserDescription>Top Users</SliderTopUserDescription>
        <ViewMoreTopUser
          to={`${ROUTES.TOP_USERS}`}
          className="button-subscribe"
        >
          View more
        </ViewMoreTopUser>
      </div>

      <SliderTopUser>
        <div>
          <Swiper
            className="swiper-container"
            modules={[Navigation, Pagination, Scrollbar, A11y]}
            spaceBetween={10}
            slidesPerView={5}
            navigation
          >
            {Array.isArray(listTopUser) &&
              listTopUser.map((item, index) => {
                return (
                  <SwiperSlide key={item.id}>
                    <LinkS to={`${ROUTES.PROFILE_PUBLIC}/${item.address}`}>
                      <SliderTopUserImg srcImg={item.avatar || defaultAvatar}>
                        <img
                          className="medal"
                          src={addMedal(index)}
                          alt="none"
                        />
                      </SliderTopUserImg>
                      <NameTopUser>{item.name}</NameTopUser>
                    </LinkS>
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
`;

export const SliderTopUserImg = styled.div<{ srcImg: string | undefined }>`
  width: 200px;
  height: 200px;
  border: 1px solid #e2c4ff;
  border-radius: 100%;
  background: url(${(props) => props.srcImg});
  background-size: cover;
`;
export const NameTopUser = styled.div`
  font-size: 16px;
  font-weight: 700;
  text-align: center;
  padding: 10px 10px 0px 0px;
`;

export const ViewMoreTopUser = styled(Link)`
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

export const SliderTopUserDescription = styled.div`
  font-size: 24px;
  font-weight: 700;
`;

export default memo(TopUser);
