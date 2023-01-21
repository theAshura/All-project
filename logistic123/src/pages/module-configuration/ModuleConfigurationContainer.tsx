import { v4 } from 'uuid';
import { useMemo, memo, useCallback } from 'react';
import cx from 'classnames';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';

import HeaderPage from 'components/common/header-page/HeaderPage';
import Button, { ButtonType } from 'components/ui/button/Button';
import useEffectOnce from 'hoc/useEffectOnce';
import { RoleScope } from 'constants/roleAndPermission.const';
import NoPermissionContainer from 'containers/no-permission';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import CompanyList from './CompanyList';

import styles from '../../components/list-common.module.scss';
import ModuleConfigurationList from './ModuleConfigurationList';

const ModuleConfigurationContainer = () => {
  const uniqueId = useMemo(() => v4(), []);
  const handleOnClickBack = useCallback(() => {
    history.push(AppRouteConst.MODULE_CONFIGURATION);
  }, []);
  const { userInfo } = useSelector((store) => store.authenticate);
  const { id } = useParams<{ id: string }>();

  useEffectOnce(() => {
    window.history.replaceState({}, document.title);
  });

  if (userInfo?.roleScope !== RoleScope.SuperAdmin) {
    return <NoPermissionContainer />;
  }

  return (
    <div key={uniqueId}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.MODULE_CONFIGURATION}
        titlePage="Module Configuration"
      >
        {id && (
          <div className={cx(styles.headerBtnContainer, styles.btnEnd)}>
            <Button
              className={cx('me-3', styles.buttonFilter)}
              buttonType={ButtonType.CancelOutline}
              onClick={handleOnClickBack}
            >
              <span>Back</span>
            </Button>
          </div>
        )}
      </HeaderPage>
      {!id ? <CompanyList /> : <ModuleConfigurationList />}
    </div>
  );
};

export default memo(ModuleConfigurationContainer);
