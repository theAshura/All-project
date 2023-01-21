import { useEffect, useMemo, useState } from 'react';
import { v4 } from 'uuid';
import cx from 'classnames';
import { useDispatch, useSelector } from 'react-redux';

import { useLocation, useParams } from 'react-router';
import Button, { ButtonType } from 'components/ui/button/Button';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import HeaderPage from 'components/common/header-page/HeaderPage';
import useEffectOnce from 'hoc/useEffectOnce';
import { LanguageEnum } from 'constants/module-configuration.cons';
import history from 'helpers/history.helper';
import {
  getListModuleConfigurationActions,
  resetModuleConfigState,
  selectModule,
} from 'store/module-configuration/module-configuration.action';
import images from 'assets/images/images';
import { AppRouteConst } from 'constants/route.const';
import LabelListTable from './components/LabelListTable';
import styles from './module-config-detail.module.scss';
import listStyle from '../../../components/list-common.module.scss';
import ModuleForm from './components/ModuleForm';

interface ParamsType {
  id: string;
  companyId: string;
}

const ModuleConfigDetail = () => {
  const uniqueId = useMemo(() => v4(), []);
  const dispatch = useDispatch();
  const { listModuleConfiguration } = useSelector(
    (store) => store.moduleConfiguration,
  );
  const { companyId, id } = useParams<ParamsType>();
  const { search } = useLocation();
  const [language, setLanguage] = useState<LanguageEnum>();

  const isEditMode = useMemo(() => {
    if (search.includes('edit')) {
      return true;
    }

    return false;
  }, [search]);

  useEffect(() => {
    if (!listModuleConfiguration && companyId) {
      dispatch(
        getListModuleConfigurationActions.request({
          companyId,
          pageSize: -1,
        }),
      );
    }
  }, [companyId, dispatch, listModuleConfiguration]);

  useEffect(() => {
    if (listModuleConfiguration && id) {
      const selectedItem = listModuleConfiguration?.data?.find(
        (module) => module.id === id,
      );

      if (selectedItem) {
        dispatch(selectModule(selectedItem));
      }
    }
  }, [dispatch, id, listModuleConfiguration]);

  useEffectOnce(() => () => {
    dispatch(resetModuleConfigState());
  });

  return (
    <div key={uniqueId}>
      <HeaderPage
        breadCrumb={
          isEditMode
            ? BREAD_CRUMB.MODULE_CONFIGURATION_EDIT
            : BREAD_CRUMB.MODULE_CONFIGURATION_VIEW
        }
        titlePage="Module Configuration"
      >
        <div className={listStyle.headerBtnContainer}>
          <Button
            className={cx('me-3', listStyle.buttonFilter)}
            buttonType={ButtonType.CancelOutline}
            onClick={() =>
              history.push(
                AppRouteConst.getListModuleConfigByCompanyID(companyId || ''),
              )
            }
          >
            <span>Back</span>
          </Button>

          {!isEditMode && (
            <Button
              className={cx('me-3', listStyle.buttonFilter)}
              buttonType={ButtonType.Primary}
              onClick={() =>
                history.push(
                  `${AppRouteConst.getModuleConfigurationDetailById(
                    id,
                    companyId,
                  )}?edit`,
                )
              }
            >
              <span className="pe-2">Edit</span>
              <img
                src={images.icons.icEdit}
                alt="edit"
                className={styles.icEdit}
              />
            </Button>
          )}
        </div>
      </HeaderPage>

      <div className={styles.container}>
        <ModuleForm
          isModeEdit={isEditMode}
          setLanguage={setLanguage}
          language={language}
        />
        <LabelListTable
          isEditMode={isEditMode}
          language={language}
          companyId={companyId}
        />
      </div>
    </div>
  );
};

export default ModuleConfigDetail;
