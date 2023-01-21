import { ellipsisHidden } from '@assets/styles/global.style';
import { Colors, FontHeight, FontSize } from '@namo-workspace/themes';
import { Body3 } from '@namo-workspace/ui/Typography';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export interface ColorVisible {
  color?: string;
}

export const WrapperListNFT = styled.div`
  padding-top: 30px;
  width: 100%;
  border-radius: 16px;
`;

export const WrapperNFT = styled.div`
  position: relative;
  max-height: 280px;
`;
export const PriceItem = styled(Body3)`
  font-size: ${FontSize.body2}px;
  font-weight: 600;
  color: ${Colors.foreground};
  display: block;
  ${ellipsisHidden}
  height: 20px;

  @media (max-width: 575.98px) {
    font-size: ${FontSize.sub}px;
    line-height: ${FontHeight.sub}px;
  }
`;

export const ContainerNFT = styled.div`
  overflow: hidden;
  position: relative;
  box-shadow: 0px 3px 5px rgba(9, 30, 66, 0.2),
    0px 0px 1px rgba(9, 30, 66, 0.31);
  border-radius: 30px;
  margin: 1rem 0.5rem;
  transition: all 0.3s cubic-bezier(0.075, 0.82, 0.165, 1);
  &:hover {
    box-shadow: 0px 18px 28px rgba(9, 30, 66, 0.15),
      0px 0px 1px rgba(9, 30, 66, 0.31);
  }
`;

export const LinkS = styled(Link)`
  text-decoration: none;
`;

export const WrapNFT = styled.div`
  position: relative;
  cursor: pointer;
  overflow: hidden;
  padding-bottom: 100%;
  height: 0px;
`;

export const DotVisible = styled.div<ColorVisible>`
  position: absolute;
  top: 5%;
  left: 5%;
  width: 12px;
  height: 12px;
  border: 1px solid ${Colors.background};
  border-radius: 50%;
  z-index: 2;
  transform: translate(-10%, -10%);
  background-color: ${({ color }) => color};
`;

export const WrapperInfo = styled.div`
  display: block;
  width: 100%;
  padding: 12px 16px;
  height: 96px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(4px);
  border-radius: 0 0 16px 16px;
  opacity: 0;
  visibility: 0;
  transition: all 0.3s ease-in-out;
  top: 100%;
  position: absolute;

  &.wrapperInfo-mobile {
    position: initial;
    opacity: 1;
    visibility: visible;
    height: auto;
  }

  img {
    width: 20px;
    height: 20px;
    margin-right: 7px;
  }

  @media (max-width: 991.98px) {
    padding: 12px 0;
  }
`;

export const AvatarUser = styled.img`
  width: 14px;
  height: 14px;
  border-radius: 50%;
`;

export const WrapInfoUser = styled.div`
  display: inline-flex;
  align-items: center;
  width: 100%;
`;

export const UserName = styled(Body3)`
  /* color: ${Colors.textLevel2}; */
  color: transparent;
  background: -webkit-linear-gradient(rgb(255, 214, 0), rgb(255, 122, 0));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;

  display: block;
  ${ellipsisHidden}

  @media (max-width: 575.98px) {
    font-size: ${FontSize.sub}px;
    line-height: ${FontHeight.sub}px;
  }
`;

export const NameItem = styled(Body3)`
  font-weight: 600;
  color: ${Colors.foreground};
  display: block;
  ${ellipsisHidden}

  @media (max-width: 575.98px) {
    font-size: ${FontSize.sub}px;
    line-height: ${FontHeight.sub}px;
  }
`;

export const BoxSelect = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.3;
  z-index: 2;
  cursor: pointer;
`;

export const WrapIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #007aff;
  border: 2px solid ${Colors.background};
  border-radius: 50%;
  width: 20px;
  height: 20px;

  position: absolute;
  top: 5%;
  right: 5%;
  transform: translate(-10%, -10%);
  z-index: 6;
  opacity: 1;
`;
