import { useCallback, useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Container from 'components/common/container/ContainerPage';
import Tabs from 'antd/lib/tabs';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import { I18nNamespace } from 'constants/i18n.const';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';
import { useLocation, useParams } from 'react-router-dom';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';
import { checkAssignmentPermission } from 'helpers/permissionCheck.helper';
import PermissionCheck from 'hoc/withPermissionCheck';
import { ActivePermission, WorkFlowType } from 'constants/common.const';
import images from 'assets/images/images';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import { getCurrentModulePageByStatus } from 'helpers/dynamic.helper';
import WatchListManagement from 'components/watch-list-icon/WatchListIcon';
import { WatchlistModuleEnum } from 'pages/watch-list/watch-list.const';
import useEffectOnce from 'hoc/useEffectOnce';
import { getWorkFlowActiveUserPermissionActions } from 'store/work-flow/work-flow.action';
import {
  createSelfAssessmentActions,
  clearSelfAssessmentErrorsReducer,
  clearSelfAssessmentDetailReducer,
  getSelfAssessmentDetailActions,
  updateSelfAssessmentActions,
} from './store/action';
import { CreateSelfAssessmentParams } from './utils/model';
import styles from './create.module.scss';
import StandardAndMatrixForm from './forms/StandardAndMatrix';
import DeclarationForm from './forms/Declaration';
import { SELF_ASSESSMENT_STEPS } from './utils/constant';

const SelfAssessmentPageDetail = () => {
  const dispatch = useDispatch();
  const { loading, selfAssessmentDetail } = useSelector(
    (state) => state.selfAssessment,
  );

  const { userInfo } = useSelector((state) => state.authenticate);

  const { t } = useTranslation(I18nNamespace.SELF_ASSESSMENT);
  const { search } = useLocation();
  const { id } = useParams<{ id: string }>();

  const currentTab = useMemo(() => {
    if (search.includes(SELF_ASSESSMENT_STEPS.standardAndMatrix)) {
      return SELF_ASSESSMENT_STEPS.standardAndMatrix;
    }
    if (search.includes(SELF_ASSESSMENT_STEPS.declaration)) {
      return SELF_ASSESSMENT_STEPS.declaration;
    }
    return SELF_ASSESSMENT_STEPS.standardAndMatrix;
  }, [search]);

  const inEditMode = useMemo(() => search.includes('edit'), [search]);

  const dynamicLabels = useDynamicLabels({
    moduleKey:
      DynamicLabelModuleName.QuantityAssuranceSelfAssessmentSelfAssessment,
    modulePage: getCurrentModulePageByStatus(inEditMode),
  });

  const reviewerAssignmentPermission = useMemo(
    () =>
      checkAssignmentPermission(
        userInfo?.id,
        ActivePermission.REVIEWER,
        selfAssessmentDetail?.userAssignments,
      ),
    [selfAssessmentDetail?.userAssignments, userInfo?.id],
  );

  const publisherAssignmentPermission = useMemo(
    () =>
      checkAssignmentPermission(
        userInfo?.id,
        ActivePermission.PUBLISHER,
        selfAssessmentDetail?.userAssignments,
      ),
    [selfAssessmentDetail?.userAssignments, userInfo?.id],
  );

  const handleSubmit = useCallback(
    (formData: CreateSelfAssessmentParams) => {
      let action;
      if (inEditMode) {
        action = updateSelfAssessmentActions.request({
          id,
          data: formData,
          handleSuccess: () => {
            dispatch(getSelfAssessmentDetailActions.request(id));
          },
        });
      } else {
        action = createSelfAssessmentActions.request(formData);
      }
      dispatch(action);
    },
    [dispatch, id, inEditMode],
  );

  const backToList = useCallback(() => {
    history.push(AppRouteConst.SELF_ASSESSMENT);
  }, []);

  const renderBackAndEditButtons = useMemo(() => {
    if (inEditMode) {
      return null;
    }

    const isShowEditBtn =
      publisherAssignmentPermission ||
      (userInfo?.id === selfAssessmentDetail?.createdUserId &&
        selfAssessmentDetail?.status === 'Open') ||
      (reviewerAssignmentPermission &&
        selfAssessmentDetail?.status !== 'Closed');

    return (
      <div>
        <PermissionCheck
          options={{
            feature: Features.QUALITY_ASSURANCE,
            subFeature: SubFeatures.SELF_ASSESSMENT,
          }}
        >
          {({ hasPermission }) =>
            hasPermission && (
              <div className="d-flex align-items-center">
                <WatchListManagement
                  dynamicLabels={dynamicLabels}
                  referenceId={id}
                  referenceModuleName={WatchlistModuleEnum.SELF_ASSESSMENT}
                  referenceRefId={selfAssessmentDetail?.sNo}
                />
                <Button
                  className={cx('me-2', styles.buttonFilter)}
                  buttonType={ButtonType.CancelOutline}
                  onClick={backToList}
                >
                  <span className="pe-2">Back</span>
                </Button>

                {isShowEditBtn && (
                  <Button
                    onClick={() => {
                      history.push(
                        `${AppRouteConst.SELF_ASSESSMENT_DETAIL}/${id}?${currentTab}&edit`,
                      );
                    }}
                    buttonSize={ButtonSize.Medium}
                    renderSuffix={
                      <img
                        src={images.icons.icEdit}
                        alt="edit"
                        className={styles.icEdit}
                      />
                    }
                    disabled={loading}
                  >
                    {t('button.edit')}&nbsp;&nbsp;
                  </Button>
                )}
              </div>
            )
          }
        </PermissionCheck>
      </div>
    );
  }, [
    backToList,
    currentTab,
    dynamicLabels,
    id,
    inEditMode,
    loading,
    publisherAssignmentPermission,
    reviewerAssignmentPermission,
    selfAssessmentDetail?.createdUserId,
    selfAssessmentDetail?.sNo,
    selfAssessmentDetail?.status,
    t,
    userInfo?.id,
  ]);

  const renderSNO = useMemo(
    () => (
      <div className={cx('fw-bold', styles.sno)}>
        S.NO:&nbsp;
        <span>{selfAssessmentDetail?.sNo || ''}</span>
      </div>
    ),
    [selfAssessmentDetail?.sNo],
  );

  const handleChangeTab = useCallback(
    (tabId: string) => {
      if (!loading) {
        let link = `${AppRouteConst.SELF_ASSESSMENT_DETAIL}/${id}?${tabId}`;
        if (inEditMode) {
          link += '&edit';
        }
        if (tabId === SELF_ASSESSMENT_STEPS.standardAndMatrix) {
          dispatch(getSelfAssessmentDetailActions.request(id));
        }
        history.push(link);
      }
    },
    [dispatch, id, inEditMode, loading],
  );

  useEffectOnce(() => {
    if (id) {
      dispatch(getSelfAssessmentDetailActions.request(id));
    }
    dispatch(
      getWorkFlowActiveUserPermissionActions.request({
        workflowType: WorkFlowType.SELF_ASSESSMENT,
        isRefreshLoading: false,
      }),
    );
  });

  useEffect(() => {
    dispatch(clearSelfAssessmentErrorsReducer());

    return () => {
      dispatch(clearSelfAssessmentDetailReducer());
    };
  }, [dispatch]);

  return (
    <>
      <div className={cx(styles.wrapHeader, 'd-flex justify-content-between')}>
        <div className={cx(styles.headers)}>
          <BreadCrumb
            current={
              inEditMode
                ? BREAD_CRUMB.SELF_ASSESSMENT_EDIT
                : BREAD_CRUMB.SELF_ASSESSMENT_DETAIL
            }
          />
          <div className={cx('fw-bold', styles.title)}>
            {t('selfAssessmentList')}
          </div>
        </div>
        {renderBackAndEditButtons}
      </div>

      <Tabs
        activeKey={currentTab}
        tabBarStyle={{ margin: '0 20px' }}
        tabBarExtraContent={!loading && renderSNO}
        onChange={handleChangeTab}
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
                screen={inEditMode ? 'edit' : 'detail'}
                isEdit={inEditMode}
                data={null}
                onSubmit={handleSubmit}
                isCreate={false}
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
              <DeclarationForm screen={inEditMode ? 'edit' : 'detail'} />
            </Container>
          </div>
        </Tabs.TabPane>
      </Tabs>
    </>
  );
};

export default SelfAssessmentPageDetail;
