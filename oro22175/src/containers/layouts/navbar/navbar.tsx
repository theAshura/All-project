import { MenuFoldOutlined } from "@ant-design/icons";
import { Dropdown, MenuProps } from "antd";
import imgLayoutORO from "assets/img/layoutORO.webp";
import useScreenDetect from "hooks/useScreenDetect";
import useSessionStorage from "hooks/useSessionStorage";
import { FC, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "services/i18n";
import { actions } from "store";
import styled from "styled-components";
import classes from "./navbar.module.scss";
import Styled from "./navbar.style";
interface Props {
  handleChangeCollapsed?: () => void;
}

const Navbar: FC<Props> = ({ handleChangeCollapsed }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentWidthScreen } = useScreenDetect();
  const { t, i18n } = useTranslation();
  const [refreshToken, setRefreshToken] = useSessionStorage<string | null>(
    "__token",
    null
  );

  const handleLogout = useCallback(async () => {
    setRefreshToken("");
    dispatch(actions.auth.logoutAction());
  }, [dispatch, setRefreshToken]);

  const renderUserMenu = useMemo(() => {
    const items: MenuProps["items"] = [
      {
        key: "1",
        label: (
          <Link style={{ textDecoration: "none" }} to={"user-profile"}>
            My Profile
          </Link>
        ),
      },
      {
        key: "2",
        label: <div onClick={handleLogout}>Logout</div>,
      },
    ];
    if (!refreshToken) {
      return null;
    }

    return (
      <Dropdown menu={{ items }} placement="bottomRight" arrow>
        <ImgInfo src={imgLayoutORO} />
      </Dropdown>
    );
  }, [handleLogout, refreshToken]);

  const handleChangeCollapsedStart = useCallback(() => {
    if (currentWidthScreen < 1200 && handleChangeCollapsed) {
      handleChangeCollapsed();
    }
  }, [currentWidthScreen, handleChangeCollapsed]);

  return (
    <Styled.Container>
      <div className={classes.logo} onClick={() => navigate("/")}>
        <img src={imgLayoutORO} alt="logo" />
      </div>
      <div className={classes.layoutPageHeaderMain}>
        <MenuFoldOutlined
          className={classes.iconExpandMenu}
          onClick={handleChangeCollapsedStart}
        />
        <Styled.Right>
          {/* <Select options={languageOptions} onChange={handleChange} /> */}
          {renderUserMenu}
        </Styled.Right>
      </div>
    </Styled.Container>
  );
};
const ImgInfo = styled.img`
  width: 3rem;
  cursor: pointer;
  height: 3rem;
  border-radius: 100%;
  object-fit: cover;
`;
export default Navbar;
