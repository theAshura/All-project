import { ListTopUserResponse, nftApi } from '@namo-workspace/services';
import { Colors } from '@namo-workspace/themes';
import { ListedRecentUser } from '../../../../pages/profile/ProfilePublic';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const DetailTopUser = () => {
  const [topUserNFT, setTopUserNFT] = useState<ListTopUserResponse[]>();
  const listRecentTopUser = JSON.parse(
    localStorage.getItem('userListed') || '[]'
  );

  const listUserlimited = listRecentTopUser.filter(
    (data: ListedRecentUser, index: number) => index < 12
  );

  useEffect(() => {
    nftApi.fetchListTopUser().then((res) => {
      setTopUserNFT(res.data);
    });
  }, []);
  return (
    <div className="p-container">
      <TextExplore>Explore Users</TextExplore>
      <LineText></LineText>
      <div className="d-flex">
        <WraperList className="col-4 text-center">
          <div className="row">
            <TextList>Recently Listed</TextList>
          </div>

          <div className="d-flex flex-wrap text-center">
            {listUserlimited ? (
              listUserlimited?.map((item: ListedRecentUser, index: number) => {
                return (
                  <div className="col-4" key={item.id}>
                    <RecentListTopUserImg src={item.img}></RecentListTopUserImg>
                    <TextName>{item.name}</TextName>
                  </div>
                );
              })
            ) : (
              <p>Not item</p>
            )}
          </div>
        </WraperList>
        <WraperListTopUser className="col-8 text-center">
          <div className="d-flex flex-wrap text-center">
            {topUserNFT?.map((item, index) => {
              return (
                <WraperListTopUserImg key={item.id}>
                  <ListTopUserImg src={item.avatar}></ListTopUserImg>
                  <TextName>{item.name}</TextName>
                </WraperListTopUserImg>
              );
            })}
          </div>
        </WraperListTopUser>
      </div>
    </div>
  );
};

export const RecentListTopUserImg = styled.img`
  margin: 5px;
  width: 130px;
  margin-top: 30px;
  height: 130px;
  border: 1px solid #e2c4ff;
  border-radius: 100%;
  img {
    width: 45px;
    height: 45px;
  }
`;

export const TextList = styled.div`
  margin: 0 auto;
  width: 75%;
  font-size: 20px;
  font-weight: 700;
  padding-bottom: 20px;
  border-bottom: 3px solid ${Colors.strokeLevel3};
`;
export const TextExplore = styled.div`
  width: 300px;
  padding: 50px 0px 0px 60px;

  font-size: 30px;
  font-weight: 700;
`;
export const LineText = styled.div`
  width: 150px;
  border-top: 5px solid #6b72fe;
  margin-left: 85px;
`;
export const TextName = styled.div`
  font-size: 16px;
  font-weight: 700;
`;
export const WraperListTopUserImg = styled.div`
  margin: 10px;
  margin-right: 30px;
  padding: 10px;
  width: 27%;
  height: 300px;
  font-size: 16px;
  font-weight: 700;
  border: 1px solid ${Colors.strokeLevel3};
  border-radius: 30px;
  display: inline-block; ;
`;

export const WraperList = styled.div`
  border: 1px solid ${Colors.strokeLevel3};
  padding: 40px;
  border-radius: 50px;
  margin-top: 20px;
`;
export const WraperListTopUser = styled.div`
  padding: 40px;
  margin-left: 100px;
`;
export const ListTopUserImg = styled.img`
  height: 250px;
  vertical-align: middle;
  max-height: 100%;
  max-width: 100%;
`;

export default DetailTopUser;
