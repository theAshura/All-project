import { defaultAvatar } from '@assets/images';
import { DEFAULT_USERNAME } from '@constants/common';
import { ROUTES } from '@constants/routes';
import { UserInfo } from '@namo-workspace/services';
import { Colors, FontHeight, FontSize } from '@namo-workspace/themes';
import Button from '@namo-workspace/ui/Button';
import Loading from '@namo-workspace/ui/Loading';
import { Body2 } from '@namo-workspace/ui/Typography';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

type Props = {
  tabName: string;
  listUser: UserInfo[];
  hasMore: boolean;
  fetchMoreData: () => void;
};

export default function UserScrollList({
  tabName,
  listUser,
  fetchMoreData,
  hasMore,
}: Props) {
  return (
    <div
      id={`${tabName}-userListScroll`}
      style={{ maxHeight: '100%', overflow: 'auto' }}
    >
      <InfiniteScroll
        className="container-list"
        dataLength={listUser.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<Loading />}
        scrollableTarget={`${tabName}-userListScroll`}
      >
        {listUser?.map((user) => (
          <Wrapper key={user.id}>
            <WrapperUser to={`${ROUTES.PROFILE_PUBLIC}/${user?.address}`}>
              <AvatarS image={user.avatar || defaultAvatar} />
              <NameUser>{user.userName || DEFAULT_USERNAME}</NameUser>
            </WrapperUser>
            <Button color="main" type="button">
              Follow
            </Button>
          </Wrapper>
        ))}
      </InfiniteScroll>
    </div>
  );
}
interface Image {
  image?: string;
}
const Wrapper = styled.div`
  display: inline-flex;
  width: 100%;
  padding: 0.5rem;
`;
const WrapperUser = styled(Link)`
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  flex: 1;

  img {
    width: 48px;
    height: 48px;
    background: #fdfafa;
    border-radius: 50%;
    overflow: hidden;
  }
`;
const AvatarS = styled.div<Image>`
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 50%;
  background: #e2dcab url(${({ image }) => image}) no-repeat center;
  background-size: cover;

  svg {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  @media (max-width: 767.98px) {
    width: 38px;
    height: 38px;
  }
`;
const NameUser = styled(Body2)`
  display: inline-block;
  font-weight: 700;
  color: ${Colors.textLevel1};
  margin-left: 0.5rem;
  word-break: break-all;
  flex: 1;

  @media (max-width: 767.98px) {
    font-size: ${FontSize.body3}px;
    line-height: ${FontHeight.body3}px;
  }
`;
