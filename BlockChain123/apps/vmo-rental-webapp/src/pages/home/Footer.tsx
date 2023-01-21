import styled from 'styled-components';

const Footer = () => {
  return (
    <FooterWrapper>
      <ul>
        <HeaderLi>VMORS</HeaderLi>
        <LiNormal>A brand new model NFT marketplace</LiNormal>
      </ul>
      <GroupRightFooter>
        <ul>
          <HeaderLi>About</HeaderLi>
          <LiNormal>About us</LiNormal>
          <LiNormal>Term of Use</LiNormal>
          <LiNormal>Privacy Policy</LiNormal>
        </ul>
        <ul>
          <HeaderLi>Contact Us</HeaderLi>
          <LiNormal>info@vmo.market</LiNormal>
        </ul>
      </GroupRightFooter>
    </FooterWrapper>
  );
};

export const FooterWrapper = styled.div`
  padding-top: 50px;
  display: flex;
  justify-content: space-between;
  ul {
    list-style-type: none;
  }
  @media (max-width: 767.98px) {
    flex-direction: column;
    text-align: center;
  }
`;

export const HeaderLi = styled.div`
  font-size: 24px;
  font-weight: 700;
`;

export const LiNormal = styled.div`
  font-size: 16px;
`;

export const GroupRightFooter = styled.div`
  display: flex;
  @media (max-width: 767.98px) {
    flex-direction:column;
    .button-subscribe{
      margin-top:15px
      text-align:center
    }
  }
`;

export default Footer;
