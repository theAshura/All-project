import images from 'assets/images/images';
import cx from 'classnames';
import HeaderPage from 'components/common/header-page/HeaderPage';
import Button, { ButtonType } from 'components/ui/button/Button';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { CommonQuery } from 'constants/common.const';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import { MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/mailTemplate.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { AppRouteConst } from 'constants/route.const';
import {
  getCurrentModulePageByStatus,
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import history from 'helpers/history.helper';
import useDynamicLabels from 'hoc/useDynamicLabels';
import PermissionCheck from 'hoc/withPermissionCheck';
import { NewMailManagement } from 'models/api/mail-management/mail-management.model';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import {
  deleteMailManagementActions,
  getMailManagementDetailActions,
  updateMailManagementActions,
} from 'store/mail-management/mail-management.action';
import MailManagementForm from '../forms/MailManagementForm';
import styles from './detail.module.scss';

export default function PortDetailContainer() {
  const { search } = useLocation();
  const dispatch = useDispatch();

  const { mailManagementDetail } = useSelector((state) => state.mailManagement);
  const { userInfo } = useSelector((state) => state.authenticate);
  const { id } = useParams<{ id: string }>();
  const [isEdit, setIsEdit] = useState(false);
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  const dynamicFields = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionMailTemplate,
    modulePage: getCurrentModulePageByStatus(isEdit, false),
  });

  const onDeletePort = () => {
    dispatch(
      deleteMailManagementActions.request({
        id,
        isDetail: true,
        handleSuccess: () => {
          history.push(AppRouteConst.MAIL_MANAGEMENT);
        },
      }),
    );
  };

  const handleSubmit = useCallback(
    (formData: NewMailManagement) =>
      dispatch(
        updateMailManagementActions.request({
          id,
          ...formData,
          mailTypeId: Number(formData.mailTypeId),
        }),
      ),
    [dispatch, id],
  );

  const handleDelete = () => {
    showConfirmBase({
      isDelete: true,
      txTitle: renderDynamicLabel(
        dynamicFields,
        MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS['Delete?'],
      ),
      txMsg: renderDynamicLabel(
        dynamicFields,
        MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS[
          'Are you sure you want to delete this record? This action cannot be undone and you will not be able to recover any data.'
        ],
      ),
      txButtonLeft: renderDynamicLabel(
        dynamicFields,
        MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS.Cancel,
      ),
      txButtonRight: renderDynamicLabel(
        dynamicFields,
        MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS.Delete,
      ),
      onPressButtonRight: onDeletePort,
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
    dispatch(getMailManagementDetailActions.request(id));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // render
  return (
    <div className={styles.portDetail}>
      <HeaderPage
        breadCrumb={
          search === CommonQuery.EDIT
            ? BREAD_CRUMB.MAIL_MANAGEMENT_EDIT
            : BREAD_CRUMB.MAIL_MANAGEMENT_DETAIL
        }
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationInspectionMailTemplate,
        )}
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
              <span>
                {renderDynamicLabel(
                  dynamicFields,
                  MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS.Back,
                )}
              </span>
            </Button>
            {userInfo?.mainCompanyId === mailManagementDetail?.companyId && (
              <>
                <PermissionCheck
                  options={{
                    feature: Features.CONFIGURATION,
                    subFeature: SubFeatures.MAIL_MANAGEMENT,
                    action: ActionTypeEnum.UPDATE,
                  }}
                >
                  {({ hasPermission }) =>
                    hasPermission && (
                      <Button
                        className={cx('me-1', styles.buttonFilter)}
                        onClick={(e) => {
                          history.push(
                            `${AppRouteConst.getMailManagementById(
                              mailManagementDetail?.id,
                            )}${CommonQuery.EDIT}`,
                          );
                        }}
                      >
                        <span className="pe-2">
                          {renderDynamicLabel(
                            dynamicFields,
                            MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS.Edit,
                          )}
                        </span>
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
                    subFeature: SubFeatures.MAIL_MANAGEMENT,
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
                        <span className="pe-2">
                          {renderDynamicLabel(
                            dynamicFields,
                            MAIL_TEMPLATE_DYNAMIC_DETAIL_FIELDS.Delete,
                          )}
                        </span>
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

      <MailManagementForm
        isEdit={isEdit}
        data={mailManagementDetail}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
