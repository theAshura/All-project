import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppRouteConst } from 'constants/route.const';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import Container from 'components/common/container/ContainerPage';
import { I18nNamespace } from 'constants/i18n.const';
import Tabs from 'antd/lib/tabs';
import cx from 'classnames';
import history from 'helpers/history.helper';
import { useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getWorkFlowActiveUserPermissionActions } from 'store/work-flow/work-flow.action';
import useEffectOnce from 'hoc/useEffectOnce';
import { WorkFlowType } from 'constants/common.const';
import styles from './create.module.scss';
import StandardAndMatrixForm from './forms/StandardAndMatrix';
import { SELF_ASSESSMENT_STEPS } from './utils/constant';
import DeclarationForm from './forms/Declaration';
import { CreateSelfAssessmentParams } from './utils/model';
import {
  clearSelfAssessmentErrorsReducer,
  clearSelfAssessmentDetailReducer,
  createSelfAssessmentActions,
} from './store/action';

const SelfAssessmentPageCreate = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.selfAssessment);
  const { t } = useTranslation(I18nNamespace.SELF_ASSESSMENT);
  const { search } = useLocation();

  const currentTab = useMemo(() => {
    if (search === `?${SELF_ASSESSMENT_STEPS.standardAndMatrix}`) {
      return SELF_ASSESSMENT_STEPS.standardAndMatrix;
    }
    if (search === `?${SELF_ASSESSMENT_STEPS.declaration}`) {
      return SELF_ASSESSMENT_STEPS.declaration;
    }
    return '';
  }, [search]);

  const handleSubmit = useCallback(
    (formData: CreateSelfAssessmentParams) => {
      dispatch(createSelfAssessmentActions.request(formData));
    },
    [dispatch],
  );

  useEffectOnce(() => {
    dispatch(
      getWorkFlowActiveUserPermissionActions.request({
        workflowType: WorkFlowType.SELF_ASSESSMENT,
        isRefreshLoading: false,
      }),
    );
    return () => {
      dispatch(clearSelfAssessmentDetailReducer());
    };
  });

  useEffect(() => {
    dispatch(clearSelfAssessmentErrorsReducer());
  }, [dispatch]);

  return (
    <>
      <div className={cx(styles.wrapHeader, 'd-flex justify-content-between')}>
        <div className={cx(styles.headers)}>
          <BreadCrumb current={BREAD_CRUMB.SELF_ASSESSMENT_CREATE} />
          <div className={cx('fw-bold', styles.title)}>
            {t('selfAssessmentList')}
          </div>
        </div>
      </div>
      <Tabs
        activeKey={currentTab}
        tabBarStyle={{ margin: '0 20px' }}
        onChange={(tabId: string) => {
          if (!loading) {
            history.push(`${AppRouteConst.SELF_ASSESSMENT_CREATE}?${tabId}`);
          }
        }}
      >
        <Tabs.TabPane
          tab={
            <div
              className={cx(styles.tableTabTitle, {
                [styles.activeTab]:
                  currentTab === SELF_ASSESSMENT_STEPS.standardAndMatrix,
              })}
            >
              {t('standardAndMatrix')}
            </div>
          }
          key={SELF_ASSESSMENT_STEPS.standardAndMatrix}
        >
          <div className={styles.wrapContent}>
            <Container>
              <StandardAndMatrixForm
                screen="create"
                isEdit={!loading}
                data={null}
                onSubmit={handleSubmit}
                isCreate={!loading}
              />
            </Container>
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <div
              className={cx(styles.tableTabTitle, {
                [styles.activeTab]:
                  currentTab === SELF_ASSESSMENT_STEPS.declaration,
              })}
            >
              {t('declaration')}
            </div>
          }
          key={SELF_ASSESSMENT_STEPS.declaration}
        >
          <div className={styles.wrapContent}>
            <Container>
              <DeclarationForm />
            </Container>
          </div>
        </Tabs.TabPane>
      </Tabs>
    </>
  );
};

export default SelfAssessmentPageCreate;
