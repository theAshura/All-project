import cx from 'classnames';
import InvisibleBackdrop from 'components/common/backdrop/InvisibleBackdrop';
import { InputSearch } from 'components/ui/inputSearch/InputSearch';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { Features } from 'constants/roleAndPermission.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import history from 'helpers/history.helper';
import { searchBarMenu } from 'helpers/menu.helper';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import styles from './search-bar.module.scss';

interface Props {
  permissionRoleMenu: (feature?: Features) => boolean;
}

const SearchBard: FC<Props> = ({ permissionRoleMenu }) => {
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);
  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationCommonAGGrid,
    modulePage: ModulePage.List,
  });

  const searchRef = useRef<HTMLInputElement>();
  const [search, setSearch] = useState<string>();
  const [menuSelected, setMenuSelected] = useState<number>(0);
  const [searchResultVisible, setSearchResultVisible] =
    useState<boolean>(false);

  const { userInfo } = useSelector((state) => state.authenticate);

  const listMenus = useMemo(
    () =>
      searchBarMenu({
        listModuleDynamicLabels,
        userInfo,
      }),
    [listModuleDynamicLabels, userInfo],
  );

  const listSearchResult = useMemo(() => {
    const result = listMenus.filter(
      (item) =>
        item?.name
          ?.toLocaleLowerCase()
          ?.includes(search?.trim()?.toLocaleLowerCase()) && item?.visible,
    );
    return result;
  }, [listMenus, search]);
  const handleCheckKeyPress = useCallback(
    (e) => {
      const keyCode = e.key;
      if (!search) {
        return;
      }
      if (keyCode === 'Enter' && menuSelected >= 0) {
        const menuChecked = listSearchResult[menuSelected];
        if (menuChecked) {
          setSearch('');
          setMenuSelected(null);
          history.push(menuChecked?.link);
        }
      }
      if (keyCode === 'ArrowDown') {
        setMenuSelected(menuSelected >= 0 ? menuSelected + 1 : 0);
      }
      if (keyCode === 'ArrowUp') {
        setMenuSelected(menuSelected > 0 ? menuSelected - 1 : 0);
      }
    },
    [listSearchResult, menuSelected, search],
  );

  useEffect(() => {
    setSearchResultVisible(false);
  }, []);

  return (
    <InvisibleBackdrop onClick={() => setSearchResultVisible(false)}>
      <div className={styles.inputSearch}>
        <InputSearch
          ref={searchRef}
          onSearch={(e) => {
            setSearchResultVisible(true);
            setSearch(e.target.value);
            setMenuSelected(0);
          }}
          placeholder={renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS.Search,
          )}
          onClick={() => {
            setSearchResultVisible(true);
          }}
          value={search}
          pattern="[a-zA-Z\s]"
          name="search"
          onKeyUp={handleCheckKeyPress}
        />
        {search && searchResultVisible && (
          <ul
            className={styles.wrapSearchResult}
            onMouseOver={() => {
              setMenuSelected(null);
            }}
            onFocus={() => null}
          >
            {listSearchResult.map((item, index) => (
              <li key={String(index + item?.name)}>
                <Link
                  className={cx(styles.link, {
                    [styles.active]: menuSelected === index,
                  })}
                  to={item?.link}
                >
                  {item?.name}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </InvisibleBackdrop>
  );
};

export default SearchBard;
