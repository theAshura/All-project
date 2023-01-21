/* LAYOUT NAVBAR COMPONENT STYLES
   ========================================================================== */

import styled from "styled-components";

const Styled = {
  Container: styled.header`
    display: flex;
    align-items: center;
    justify-content: space-between;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 9;
    background: #fff;
    box-shadow: 0 4px 10px #dddddd;
    height: 64px;
  `,
  Right: styled.div`
    display: flex;
    align-items: center;
  `,
  ThemeSwitcher: styled.div`
    margin-left: 20px;
  `,
};

export default Styled;
