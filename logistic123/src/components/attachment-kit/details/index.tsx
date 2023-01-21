import images from 'assets/images/images';
import cx from 'classnames';
import HeaderPage from 'components/common/header-page/HeaderPage';
import Button, { ButtonType } from 'components/ui/button/Button';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { CommonQuery } from 'constants/common.const';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import { AttachmentKitData } from 'models/api/attachment-kit/attachment-kit.model';
import PermissionCheck from 'hoc/withPermissionCheck';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';

import {
  updateAttachmentKitActions,
  getAttachmentKitDetailActions,
  deleteAttachmentKitActions,
} from 'store/attachment-kit/attachment-kit.action';

import useDynamicLabels from 'hoc/useDynamicLabels';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import { ATTACHMENT_KIT_DETAIL_DYNAMIC_FIELDS } from 'constants/dynamic/attachmentKit.const';
import {
  getCurrentModulePageByStatus,
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import AttachmentKitForm from '../forms/AttachmentKitForm';
import styles from './detail.module.scss';

export default function PortDetailContainer() {
  const { search } = useLocation();
  const dispatch = useDispatch();

  const { attachmentKitDetail } = useSelector((state) => state.attachmentKit);
  const { userInfo } = useSelector((state) => state.authenticate);
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  const { id } = useParams<{ id: string }>();
  const [isEdit, setIsEdit] = useState(false);

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionAttachmentKit,
    modulePage: getCurrentModulePageByStatus(isEdit, false),
  });

  const onDeleteAttachment = useCallback(() => {
    dispatch(
      deleteAttachmentKitActions.request({
        id,
        isDetail: true,
        handleSuccess: () => {
          history.push(AppRouteConst.ATTACHMENT_KIT);
        },
      }),
    );
  }, [dispatch, id]);

  const handleSubmit = useCallback(
    (formData: AttachmentKitData) => {
      dispatch(updateAttachmentKitActions.request({ id, ...formData }));
    },
    [dispatch, id],
  );

  const handleDelete = () => {
    showConfirmBase({
      isDelete: true,
      txTitle: renderDynamicLabel(
        dynamicLabels,
        ATTACHMENT_KIT_DETAIL_DYNAMIC_FIELDS['Delete?'],
      ),
      txMsg: renderDynamicLabel(
        dynamicLabels,
        ATTACHMENT_KIT_DETAIL_DYNAMIC_FIELDS[
          'Are you sure you want to delete this record? This action cannot be undone and you will not be able to recover any data.'
        ],
      ),
      txButtonLeft: renderDynamicLabel(
        dynamicLabels,
        ATTACHMENT_KIT_DETAIL_DYNAMIC_FIELDS.Cancel,
      ),
      txButtonRight: renderDynamicLabel(
        dynamicLabels,
        ATTACHMENT_KIT_DETAIL_DYNAMIC_FIELDS.Delete,
      ),
      onPressButtonRight: onDeleteAttachment,
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
    dispatch(getAttachmentKitDetailActions.request(id));
    return () => {
      dispatch(getAttachmentKitDetailActions.success(null));
    };
  }, [dispatch, id]);

  // render
  return (
    <div className={styles.detail}>
      <HeaderPage
        breadCrumb={
          search === CommonQuery.EDIT
            ? BREAD_CRUMB.ATTACHMENT_KIT_EDIT
            : BREAD_CRUMB.ATTACHMENT_KIT_DETAIL
        }
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationInspectionAttachmentKit,
        )}
      >
        {!isEdit && attachmentKitDetail?.companyId && (
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
                  dynamicLabels,
                  ATTACHMENT_KIT_DETAIL_DYNAMIC_FIELDS.Back,
                )}
              </span>
            </Button>
            {userInfo?.mainCompanyId === attachmentKitDetail?.companyId && (
              <>
                <PermissionCheck
                  options={{
                    feature: Features.CONFIGURATION,
                    subFeature: SubFeatures.ATTACHMENT_KIT,
                    action: ActionTypeEnum.UPDATE,
                  }}
                >
                  {({ hasPermission }) =>
                    hasPermission && (
                      <Button
                        className={cx('me-1', styles.buttonFilter)}
                        onClick={(e) => {
                          history.push(
                            `${AppRouteConst.getAttachmentKiteById(
                              attachmentKitDetail?.id,
                            )}${CommonQuery.EDIT}`,
                          );
                        }}
                      >
                        <span className="pe-2">
                          {renderDynamicLabel(
                            dynamicLabels,
                            ATTACHMENT_KIT_DETAIL_DYNAMIC_FIELDS.Edit,
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
              </>
            )}

            {userInfo?.id === attachmentKitDetail?.createdUserId && (
              <PermissionCheck
                options={{
                  feature: Features.CONFIGURATION,
                  subFeature: SubFeatures.ATTACHMENT_KIT,
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
                          dynamicLabels,
                          ATTACHMENT_KIT_DETAIL_DYNAMIC_FIELDS.Delete,
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
            )}
          </div>
        )}
      </HeaderPage>

      <AttachmentKitForm
        isEdit={isEdit}
        data={attachmentKitDetail}
        onSubmit={handleSubmit}
      />
    </div>
  );
}
