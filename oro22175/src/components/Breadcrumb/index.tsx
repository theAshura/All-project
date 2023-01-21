import { capitalizeEachFirstLetter } from "helpers/utilities.helper";
import { FC, useMemo } from "react";
import { Link } from "react-router-dom";
import classes from "./breadcrumb.module.scss";

const Breadcrumb: FC = () => {
  const renderSubBreadcrumb = useMemo(() => {
    let pathname = window.location.pathname;
    let url = window.location.pathname;
    if (pathname === "/") {
      pathname = "";
    }

    pathname = capitalizeEachFirstLetter(
      pathname.split("/").join(" / ").split("-").join(" ")
    );
    if (pathname.slice(-1) === "/") {
      pathname = pathname.slice(0, pathname.length - 1);
    }

    if (url.slice(-1) === "/") {
      url = url.slice(0, url.length - 1);
    }

    return { pathname, url } as {
      pathname: string;
      url: string;
    };
  }, []);

  const render = useMemo(() => {
    return {
      listUrl: renderSubBreadcrumb.url.split("/"),
      listPathName: renderSubBreadcrumb.pathname.split("/"),
    };
  }, [renderSubBreadcrumb]);

  const isHomePage = useMemo(() => {
    if (
      render?.listPathName &&
      render?.listPathName?.length === 1 &&
      render?.listUrl &&
      render?.listUrl?.length === 1
    ) {
      return true;
    }
    return false;
  }, [render]);

  return (
    <div className={classes.wrapBreakcrumb}>
      <Link
        to={isHomePage ? "/?refesher=true" : "/"}
        style={{ marginRight: 5 }}
      >
        Home
      </Link>
      {render.listUrl.map((item, index) => {
        return (
          <>
            {index !== 0 && item && (
              <>
                <span>/ &nbsp;</span>
                {render.listUrl.length - 1 === index ? (
                  <div>{render.listPathName[index]}</div>
                ) : (
                  <Link key={item} to={`/${item}`} style={{ marginRight: 5 }}>
                    {render.listPathName[index]}
                  </Link>
                )}
              </>
            )}
          </>
        );
      })}
    </div>
  );
};

export default Breadcrumb;
