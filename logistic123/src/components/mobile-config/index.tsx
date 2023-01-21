import { getListMobileConfigActionsApi } from 'api/mobile-config.api';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import HeaderPage from 'components/common/header-page/HeaderPage';
import { MobileConfig } from 'models/api/mobile-config/mobile-config';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { renderDynamicModuleLabel } from 'helpers/dynamic.helper';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import MobileConfigForm from './MobileConfigForm';
import styles from './mobile-config.module.scss';

export default function DMSCreate() {
  const [data, setData] = useState<MobileConfig>();
  const [loading, setLoading] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  useEffect(() => {
    setLoading(true);
    getListMobileConfigActionsApi()
      .then((res) => {
        setData(res?.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <div className={styles.MobileConfig}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.MOBILE_CONFIG}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationInspectionMobileconfig,
        )}
      />
      {/* <div className={cx('d-flex justify-content-between')}>
          <div className={cx(styles.headers)}>
            <BreadCrumb current={BREAD_CRUMB.MOBILE_CONFIG} />
            <div className={cx('fw-bold', styles.title)}>
              {t('txMobileConfig')}
            </div>
          </div>
          TODO
          {roleScope === RoleScope.SuperAdmin && !isEdit && (
            <Button
              className={cx('me-1', styles.buttonFilter)}
              onClick={() => {
                setIsEdit(true);
              }}
            >
              <span className="pe-2">{t('buttons.txEdit')}</span>
              <img
                src={images.icons.icEdit}
                alt="edit"
                className={styles.icEdit}
              />
            </Button>
          )}
        </div> */}
      <MobileConfigForm
        isEdit={isEdit}
        data={data}
        isCreate
        loading={loading}
        setEdit={(e) => setIsEdit(e)}
      />
    </div>
  );
}
