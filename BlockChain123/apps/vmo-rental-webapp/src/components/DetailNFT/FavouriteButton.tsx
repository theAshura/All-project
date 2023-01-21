import { FcLike } from 'react-icons/fc';

import styled, { css } from 'styled-components';

type Props = {
  isFavourite?: boolean;
  onClick?: (isFavourite: boolean) => void;
};

export default function FavouriteButton({ isFavourite, onClick }: Props) {
  return (
    <ButtonS isFavourite={isFavourite} onClick={() => onClick?.(!isFavourite)}>
      <FcLike />
    </ButtonS>
  );
}

const ButtonS = styled.button<{ isFavourite?: boolean }>`
  background: none;
  border: none;
  outline: none;
  box-shadow: none;
  transition: all 0.3s;
  ${(props) =>
    !props.isFavourite &&
    css`
      svg {
        stroke: black;
        stroke-width: 1;
        path {
          fill: white;
        }
      }
    `};
  &:hover {
    scale: 1.2;
  }
`;
