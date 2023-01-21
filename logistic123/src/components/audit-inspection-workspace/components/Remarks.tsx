import images from 'assets/images/images';
import cx from 'classnames';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import Button, { ButtonType } from 'components/ui/button/Button';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import {
  DATA_SPACE,
  DEFAULT_COL_DEF_TYPE_FLEX,
  MODULE_TEMPLATE,
} from 'constants/components/ag-grid.const';
import { DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-workspace.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import {
  RemarkItem,
  RemarkParam,
} from 'models/api/audit-inspection-workspace/audit-inspection-workspace.model';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { Action, CommonApiParam } from 'models/common.model';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  createRemarkActions,
  deleteRemarkActions,
  getRemarksActions,
  updateRemarkActions,
} from 'store/audit-inspection-workspace/audit-inspection-workspace.action';
import { getListTemplateDictionaryActions } from 'store/template/template.action';
import ModalRemark from './modal/ModalRemark';
import styles from './tab.module.scss';
import './tab.scss';

interface RemarkTabProps {
  loading: boolean;
  activeTab: string;
  disabled: boolean;
  id: string;
  dynamicLabels?: IDynamicLabel;
}

const RemarksTab: FC<RemarkTabProps> = ({
  loading,
  disabled,
  activeTab,
  id,
  dynamicLabels,
}) => {
  const { userInfo } = useSelector((state) => state.authenticate);

  const { listRemark, params, dataFilter } = useSelector(
    (state) => state.auditInspectionWorkspace,
  );
  const dispatch = useDispatch();
  const [openRemark, setOpenRemark] = useState<boolean>(false);
  const [isViewDetail, setIsViewDetail] = useState<boolean>(false);
  const [dataRemarkDetail, setDataDetailRemark] = useState<RemarkItem>(null);

  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

  useEffect(() => {
    if (activeTab === 'Remarks') {
      dispatch(
        getRemarksActions.request({
          auditWorkspaceId: id,

          handleSuccess: () => {
            dispatch(
              getListTemplateDictionaryActions.request({
                content: MODULE_TEMPLATE.remarkInspectionWorkspace,
              }),
            );
          },
        }),
      );
      // setSelectedItem(undefined);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab]);

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      dispatch(
        getRemarksActions.request({
          auditWorkspaceId: id,
          isRefreshLoading: true,
        }),
      );
    },
    [dispatch, id],
  );

  const dataTable = useMemo(
    () =>
      listRemark?.data?.map((item, index) => ({
        id: item?.id || DATA_SPACE,
        sNo: index + 1 || DATA_SPACE,
        title: item?.title || DATA_SPACE,
        remarks: item?.remark || DATA_SPACE,
        security: item?.isPublic ? 'Public' : 'Private',
        createdBy: item?.createdUser?.username || DATA_SPACE,
        createdUserId: item?.createdUserId,
      })),
    [listRemark],
  );

  const handleDeleteRemark = useCallback(
    (idRemark: string) => {
      dispatch(
        deleteRemarkActions.request({
          auditWorkspaceId: id,
          id: idRemark,
          handleSuccess: () => {
            dispatch(
              getRemarksActions.request({
                auditWorkspaceId: id,

                handleSuccess: () => {
                  dispatch(
                    getListTemplateDictionaryActions.request({
                      content: MODULE_TEMPLATE.remarkInspectionWorkspace,
                    }),
                  );
                },
              }),
            );
          },
        }),
      );
    },
    [dispatch, id],
  );

  const handleDelete = useCallback(
    (id: string) => {
      showConfirmBase({
        isDelete: true,
        txTitle: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Remarks['Delete?'],
        ),
        txMsg: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Remarks[
            'Are you sure you want to delete this record? This action cannot be undone and you will not be able to recover any data.'
          ],
        ),
        onPressButtonRight: () => handleDeleteRemark(id),
      });
    },
    [dynamicLabels, handleDeleteRemark],
  );

  const viewDetail = useCallback(
    (idRemark?: string) => {
      const data = listRemark?.data?.find((i) => i.id === idRemark);
      setDataDetailRemark(data);
      setOpenRemark(true);
      setIsViewDetail(true);
      return true;
    },
    [listRemark],
  );

  const editDetail = useCallback(
    (idRemark?: string) => {
      const data = listRemark?.data?.find((i) => i.id === idRemark);
      setDataDetailRemark(data);
      setOpenRemark(true);
      setIsViewDetail(false);
    },
    [listRemark],
  );

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Remarks.Action,
        ),
        filter: false,
        enableRowGroup: false,
        sortable: false,
        lockPosition: true,
        minWidth: 125,
        maxWidth: 125,
        pinned: 'left',
        cellRendererFramework: (params) => {
          const { data } = params;
          const isCreator = data?.createdUserId === userInfo?.id;
          let actions: Action[] = [
            {
              img: images.icons.icViewDetail,
              function: () => data && viewDetail(data?.id),
              feature: Features.AUDIT_INSPECTION,
              subFeature: SubFeatures.AUDIT_INSPECTION_WORKSPACE,
              action: ActionTypeEnum.VIEW,
              buttonType: ButtonType.Blue,
              cssClass: 'me-1',
            },
          ];

          if (isCreator && !disabled) {
            actions = [
              ...actions,
              {
                img: images.icons.icEdit,
                function: () => data && editDetail(params?.data?.id),
                feature: Features.AUDIT_INSPECTION,
                subFeature: SubFeatures.AUDIT_INSPECTION_WORKSPACE,
                action: ActionTypeEnum.UPDATE,
                cssClass: 'me-1',
              },

              {
                img: images.icons.icRemove,
                function: () => data && handleDelete(data?.id),
                feature: Features.AUDIT_INSPECTION,
                subFeature: SubFeatures.AUDIT_INSPECTION_WORKSPACE,
                action: ActionTypeEnum.DELETE,
                buttonType: ButtonType.Orange,
                cssClass: 'me-1',
              },
            ];
          }

          if (!data) {
            actions = [];
          }
          return (
            <div
              className={cx(
                'd-flex justify-content-start align-items-center',
                styles.subAction,
              )}
            >
              <ActionBuilder actionList={actions} />
            </div>
          );
        },
      },
      {
        field: 'sNo',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Remarks['S.No'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'title',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Remarks.Title,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'remarks',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Remarks.Remarks,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'security',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Remarks.Security,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'createdBy',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Remarks['Created by'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [
      dynamicLabels,
      isMultiColumnFilter,
      userInfo?.id,
      disabled,
      viewDetail,
      editDetail,
      handleDelete,
    ],
  );

  const handleRemarkSubmit = useCallback(
    (dataRemark: RemarkParam) => {
      if (!dataRemarkDetail) {
        dispatch(
          createRemarkActions.request({
            data: { ...dataRemark.data, auditWorkspaceId: id },
            handleSuccess: () => {
              dataRemark.handleSuccess();
              dispatch(
                getRemarksActions.request({
                  auditWorkspaceId: id,

                  handleSuccess: () => {
                    dispatch(
                      getListTemplateDictionaryActions.request({
                        content: MODULE_TEMPLATE.remarkInspectionWorkspace,
                      }),
                    );
                  },
                }),
              );
            },
          }),
        );
      } else {
        dispatch(
          updateRemarkActions.request({
            data: {
              ...dataRemark.data,
              id: dataRemarkDetail.id,
              auditWorkspaceId: id,
            },
            handleSuccess: () => {
              dataRemark.handleSuccess();
              dispatch(
                getRemarksActions.request({
                  auditWorkspaceId: id,
                  handleSuccess: () => {
                    dispatch(
                      getListTemplateDictionaryActions.request({
                        content: MODULE_TEMPLATE.remarkInspectionWorkspace,
                      }),
                    );
                  },
                }),
              );
            },
          }),
        );
      }
    },
    [dataRemarkDetail, dispatch, id],
  );

  return (
    <div className="">
      <div className={cx(styles.TabContainer)}>
        <div className={cx(styles.contentWrapperRemark)}>
          <div className="d-flex justify-content-between mb-2">
            <div className={cx(styles.headerTitle)}>
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Remarks.Remarks,
              )}
            </div>
            {!disabled && (
              <Button
                onClick={() => {
                  setOpenRemark(true);
                  setIsViewDetail(false);
                }}
                className={styles.btnAdd}
                renderSuffix={
                  <img
                    src={images.icons.icAddCircle}
                    alt="createNew"
                    className={styles.icButton}
                  />
                }
              >
                {renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Remarks.Add,
                )}
              </Button>
            )}
          </div>
          {dataTable?.length ? (
            <AGGridModule
              loading={loading}
              params={params}
              setIsMultiColumnFilter={setIsMultiColumnFilter}
              hasRangePicker={false}
              columnDefs={columnDefs}
              dataFilter={dataFilter}
              moduleTemplate={MODULE_TEMPLATE.remarkInspectionWorkspace}
              fileName="Remarks"
              colDefProp={DEFAULT_COL_DEF_TYPE_FLEX}
              dataTable={dataTable}
              height="calc(100vh - 300px)"
              view={viewDetail}
              getList={handleGetList}
            />
          ) : (
            <div className={cx(styles.noDataWrapper)}>
              <img
                src={images.icons.icNoData}
                className={styles.noData}
                alt="no data"
              />
            </div>
          )}
        </div>
      </div>
      <ModalRemark
        title={renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Remarks.Remarks,
        )}
        isOpen={openRemark}
        toggle={() => {
          setOpenRemark((p) => !p);
          setDataDetailRemark(null);
        }}
        onSubmit={handleRemarkSubmit}
        data={dataRemarkDetail}
        isView={isViewDetail}
        loading={loading}
        dynamicLabels={dynamicLabels}
      />
    </div>
  );
};

export default RemarksTab;
