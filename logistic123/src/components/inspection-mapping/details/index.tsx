import { AppRouteConst } from 'constants/route.const';
import images from 'assets/images/images';
import { useEffect, useState, useCallback } from 'react';
import cx from 'classnames';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PermissionCheck from 'hoc/withPermissionCheck';
import {
  Features,
  SubFeatures,
  ActionTypeEnum,
} from 'constants/roleAndPermission.const';
import NoPermission from 'containers/no-permission';
import {
  getInspectionMappingDetailActions,
  updateInspectionMappingActions,
  deleteInspectionMappingActions,
} from 'store/inspection-mapping/inspection-mapping.action';
import { CreateInspectionMappingParams } from 'models/api/inspection-mapping/inspection-mapping.model';
import { CommonQuery } from 'constants/common.const';
import HeaderPage from 'components/common/header-page/HeaderPage';
import history from 'helpers/history.helper';
import Button, { ButtonType } from 'components/ui/button/Button';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import ModalConfirm from 'components/common/modal/ModalConfirm';
import {
  getCurrentModulePageByStatus,
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS } from 'constants/dynamic/inspectionMapping.const';
import styles from './detail.module.scss';
import InspectionMappingForm from '../forms/InspectionMappingForm';

export default function InspectionMappingDetailContainer() {
  const { search } = useLocation();
  const dispatch = useDispatch();

  const { loading, inspectionMappingDetail } = useSelector(
    (state) => state.inspectionMapping,
  );
  const { userInfo } = useSelector((state) => state.authenticate);

  const { id } = useParams<{ id: string }>();
  const [isEdit, setIsEdit] = useState(false);
  const [modal, setModal] = useState(false);
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  const dynamicFields = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionInspectionMapping,
    modulePage: getCurrentModulePageByStatus(isEdit, false),
  });

  useEffect(() => {
    if (search !== CommonQuery.EDIT) {
      setIsEdit(false);
    } else {
      setIsEdit(true);
    }
  }, [search]);

  const handleSubmit = useCallback(
    (formData: CreateInspectionMappingParams) => {
      dispatch(updateInspectionMappingActions.request({ id, data: formData }));
    },
    [dispatch, id],
  );

  useEffect(() => {
    dispatch(getInspectionMappingDetailActions.request(id));
    return () => {
      dispatch(getInspectionMappingDetailActions.success(undefined));
    };
  }, [dispatch, id]);

  return (
    <PermissionCheck
      options={{
        feature: Features.CONFIGURATION,
        subFeature: SubFeatures.INSPECTION_MAPPING, // fix after
        action:
          search === CommonQuery.EDIT
            ? ActionTypeEnum.UPDATE
            : ActionTypeEnum.VIEW,
      }}
    >
      {({ hasPermission }) =>
        hasPermission ? (
          <div className={styles.inspectionMappingDetailWrapper}>
            {/* <Container> */}
            <HeaderPage
              breadCrumb={
                search === CommonQuery.EDIT
                  ? BREAD_CRUMB.INSPECTION_MAPPING_EDIT
                  : BREAD_CRUMB.INSPECTION_MAPPING_DETAIL
              }
              titlePage={renderDynamicModuleLabel(
                listModuleDynamicLabels,
                DynamicLabelModuleName.ConfigurationInspectionInspectionMapping,
              )}
            >
              {!isEdit && (
                <div>
                  <Button
                    className={cx('me-2', styles.buttonFilter)}
                    buttonType={ButtonType.CancelOutline}
                    disabled={loading}
                    onClick={(e) => {
                      history.goBack();
                    }}
                  >
                    <span>
                      {renderDynamicLabel(
                        dynamicFields,
                        INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS.Back,
                      )}
                    </span>
                  </Button>
                  {userInfo?.mainCompanyId ===
                    inspectionMappingDetail?.companyId && (
                    <>
                      <PermissionCheck
                        options={{
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.INSPECTION_MAPPING, // fix after
                          action: ActionTypeEnum.UPDATE,
                        }}
                      >
                        {({ hasPermission }) =>
                          hasPermission && (
                            <Button
                              className={cx('me-1', styles.buttonFilter)}
                              disabled={loading}
                              onClick={(e) => {
                                history.push(
                                  `${AppRouteConst.getInspectionMappingById(
                                    id,
                                  )}${CommonQuery.EDIT}`,
                                );
                              }}
                            >
                              <span className="pe-2">
                                {' '}
                                {renderDynamicLabel(
                                  dynamicFields,
                                  INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS.Edit,
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
                          subFeature: SubFeatures.INSPECTION_MAPPING, // fix after
                          action: ActionTypeEnum.DELETE,
                        }}
                      >
                        {({ hasPermission }) =>
                          hasPermission && (
                            <Button
                              disabled={loading}
                              className={cx('ms-1', styles.buttonFilter)}
                              buttonType={ButtonType.Orange}
                              onClick={(e) => setModal(true)}
                            >
                              <span className="pe-2">
                                {renderDynamicLabel(
                                  dynamicFields,
                                  INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS.Delete,
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
            <ModalConfirm
              title={renderDynamicLabel(
                dynamicFields,
                INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS['Delete?'],
              )}
              content={renderDynamicLabel(
                dynamicFields,
                INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS[
                  'Are you sure you want to delete this record? This action cannot be undone and you will not be able to recover any data.'
                ],
              )}
              isDelete
              disable={loading}
              toggle={() => setModal(!modal)}
              modal={modal}
              handleSubmit={() => {
                dispatch(
                  deleteInspectionMappingActions.request({
                    id,
                    isDetail: true,
                    getListInspectionMapping: () => {
                      history.push(AppRouteConst.INSPECTION_MAPPING);
                    },
                  }),
                );
              }}
              cancelTxt={renderDynamicLabel(
                dynamicFields,
                INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS.Cancel,
              )}
              rightTxt={renderDynamicLabel(
                dynamicFields,
                INSPECTION_MAPPING_DETAIL_DYNAMIC_LABELS.Delete,
              )}
            />
            <InspectionMappingForm
              isEdit={isEdit}
              data={inspectionMappingDetail}
              onSubmit={handleSubmit}
            />
            {/* </Container> */}
          </div>
        ) : (
          <NoPermission />
        )
      }
    </PermissionCheck>
  );
}
