import { AppRouteConst } from 'constants/route.const';
import images from 'assets/images/images';
import { useEffect, useState, useCallback } from 'react';
import cx from 'classnames';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  CreateWorkflowParams,
  WorkflowRoles,
} from 'models/api/work-flow/work-flow.model';
import PermissionCheck from 'hoc/withPermissionCheck';
import {
  Features,
  SubFeatures,
  ActionTypeEnum,
} from 'constants/roleAndPermission.const';
import NoPermission from 'containers/no-permission';
import { CommonQuery } from 'constants/common.const';
import history from 'helpers/history.helper';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import Button, { ButtonType } from 'components/ui/button/Button';
import HeaderPage from 'components/common/header-page/HeaderPage';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import {
  getWorkFlowDetailActions,
  deleteWorkFlowActions,
  updateWorkFlowActions,
} from 'store/work-flow/work-flow.action';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import styles from './detail.module.scss';
import WorkFlowForm, { DataForm } from '../forms/WorkFlowForm';

export default function WorkFlowDetailContainer() {
  const { search } = useLocation();
  const dispatch = useDispatch();

  const { workFlowDetail } = useSelector((state) => state.workFlow);
  const { t } = useTranslation([
    I18nNamespace.VESSEL_TYPE,
    I18nNamespace.COMMON,
  ]);
  const { id } = useParams<{ id: string }>();
  const [isEdit, setIsEdit] = useState(false);
  const { userInfo } = useSelector((state) => state.authenticate);

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationCommonWorkflowConfiguration,
    modulePage: isEdit ? ModulePage.Edit : ModulePage.View,
  });

  const onDeleteWorkflow = () => {
    dispatch(
      deleteWorkFlowActions.request({
        id,
        isDetail: true,
        handleSuccess: () => {
          history.push(AppRouteConst.WORK_FLOW);
        },
      }),
    );
  };

  const handleSubmit = useCallback(
    (formData: DataForm) => {
      const workflowRoles: WorkflowRoles[] = [];
      let newData: CreateWorkflowParams = {
        workflowType: formData.workflowType,
      };
      if (formData?.description?.trim()) {
        newData = { ...newData, description: formData.description };
      }
      formData?.creator?.forEach((item) => {
        workflowRoles.push({
          roleId: item,
          permission: 'creator',
        });
      });
      formData?.ownerManager?.forEach((item) => {
        workflowRoles.push({
          roleId: item,
          permission: 'owner/manager',
        });
      });
      formData?.approver?.forEach((item) => {
        workflowRoles.push({
          roleId: item,
          permission: 'approver',
        });
      });
      formData?.reviewer?.forEach((item) => {
        workflowRoles.push({
          roleId: item,
          permission: 'reviewer',
        });
      });
      formData?.publisher?.forEach((item) => {
        workflowRoles.push({
          roleId: item,
          permission: 'publisher',
        });
      });
      formData?.auditor?.forEach((item) => {
        workflowRoles.push({
          roleId: item,
          permission: 'auditor',
        });
      });
      formData?.reviewer1?.forEach((item) => {
        workflowRoles.push({
          roleId: item,
          permission: 'reviewer1',
        });
      });
      formData?.reviewer2?.forEach((item) => {
        workflowRoles.push({
          roleId: item,
          permission: 'reviewer2',
        });
      });
      formData?.reviewer3?.forEach((item) => {
        workflowRoles.push({
          roleId: item,
          permission: 'reviewer3',
        });
      });
      formData?.reviewer4?.forEach((item) => {
        workflowRoles.push({
          roleId: item,
          permission: 'reviewer4',
        });
      });
      formData?.reviewer5?.forEach((item) => {
        workflowRoles.push({
          roleId: item,
          permission: 'reviewer5',
        });
      });

      formData?.close_out?.forEach((item) => {
        workflowRoles.push({
          roleId: item,
          permission: 'close_out',
        });
      });
      formData?.verification?.forEach((item) => {
        workflowRoles.push({
          roleId: item,
          permission: 'verification',
        });
      });
      if (workflowRoles?.length > 0) {
        newData = { ...newData, workflowRoles };
      }

      newData = {
        ...newData,
        resetForm: () =>
          history.push(
            `${AppRouteConst.WORK_FLOW}?${formData?.workflowType?.replaceAll(
              ' ',
              '-',
            )}`,
          ),
      };

      dispatch(updateWorkFlowActions.request({ id, ...newData }));
    },
    [dispatch, id],
  );

  const handleDelete = () => {
    showConfirmBase({
      isDelete: true,
      txTitle: t('modal.delete'),
      txMsg: t('modal.areYouSureYouWantToDelete'),
      onPressButtonRight: onDeleteWorkflow,
    });
  };

  useEffect(() => {
    if (search !== CommonQuery.EDIT) {
      setIsEdit(false);
    } else {
      setIsEdit(true);
    }
  }, [search]);

  useEffect(() => {
    dispatch(getWorkFlowDetailActions.request(id));
    return () => {
      dispatch(
        getWorkFlowDetailActions.success({
          id: '',
          createdAt: '',
          updatedAt: '',
          companyId: '',
          workflowType: '',
          approverType: '',
          status: '',
          createdUserId: '',
          updatedUserId: '',
          description: '',
          version: '',
          workflowRoles: [],
        }),
      );
    };
  }, [dispatch, id]);

  // render
  return (
    <PermissionCheck
      options={{
        feature: Features.CONFIGURATION,
        subFeature: SubFeatures.WORKFLOW_CONFIGURATION,
        action:
          search === CommonQuery.EDIT
            ? ActionTypeEnum.UPDATE
            : ActionTypeEnum.VIEW,
      }}
    >
      {({ hasPermission }) =>
        hasPermission ? (
          <div className={styles.vesselTypeDetail}>
            <HeaderPage
              breadCrumb={
                search === CommonQuery.EDIT
                  ? BREAD_CRUMB.WORK_FLOW_EDIT
                  : BREAD_CRUMB.WORK_FLOW_DETAIL
              }
              titlePage="WorkFlow Configuration"
            >
              {!isEdit && (
                <div>
                  <Button
                    className={cx('me-2', styles.buttonFilter)}
                    buttonType={ButtonType.CancelOutline}
                    onClick={(e) => {
                      history.goBack();
                    }}
                  >
                    <span className="pe-2">Back</span>
                  </Button>
                  {userInfo?.id === workFlowDetail?.createdUserId && (
                    <>
                      <PermissionCheck
                        options={{
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.WORKFLOW_CONFIGURATION,
                          action: ActionTypeEnum.UPDATE,
                        }}
                      >
                        {({ hasPermission }) =>
                          hasPermission && (
                            <Button
                              className={cx('me-1', styles.buttonFilter)}
                              onClick={(e) => {
                                history.push(
                                  `${AppRouteConst.getWorkFlowById(
                                    workFlowDetail?.id,
                                  )}${CommonQuery.EDIT}`,
                                );
                              }}
                            >
                              <span className="pe-2">Edit</span>
                              <img
                                src={images.icons.icEdit}
                                alt="edit"
                                className={styles.icEdit}
                              />
                            </Button>
                          )
                        }
                      </PermissionCheck>

                      <PermissionCheck
                        options={{
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.WORKFLOW_CONFIGURATION,
                          action: ActionTypeEnum.DELETE,
                        }}
                      >
                        {({ hasPermission }) =>
                          hasPermission && (
                            <Button
                              className={cx('ms-1', styles.buttonFilter)}
                              buttonType={ButtonType.Orange}
                              onClick={handleDelete}
                            >
                              <span className="pe-2">Delete</span>
                              <img
                                src={images.icons.icRemove}
                                alt="remove"
                                className={styles.icRemove}
                              />
                            </Button>
                          )
                        }
                      </PermissionCheck>
                    </>
                  )}
                </div>
              )}
            </HeaderPage>
            <WorkFlowForm
              isEdit={isEdit}
              dynamicLabels={dynamicLabels}
              data={workFlowDetail}
              onSubmit={handleSubmit}
            />
          </div>
        ) : (
          <NoPermission />
        )
      }
    </PermissionCheck>
  );
}
