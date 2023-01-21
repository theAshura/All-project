/* eslint-disable no-param-reassign */
/* eslint-disable arrow-body-style */
/* eslint-disable max-len */
/* eslint-disable no-plusplus */
import { FC, useCallback, useMemo, useEffect, useState } from 'react';
import cx from 'classnames';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { useTranslation } from 'react-i18next';
import { I18nNamespace } from 'constants/i18n.const';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import { Action, CommonApiParam } from 'models/common.model';
import { handleFilterParams } from 'helpers/filterParams.helper';
import {
  MODULE_TEMPLATE,
  DEFAULT_COL_DEF_TYPE_FLEX,
} from 'constants/components/ag-grid.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import images from 'assets/images/images';
import { getListNatureOfFindingActions } from 'store/inspection-mapping/inspection-mapping.action';
import { getListDepartmentMasterActions } from 'store/department-master/department-master.action';
import { getListMainCategoryActions } from 'store/main-category/main-category.action';
import { getListSecondCategoryActions } from 'store/second-category/second-category.action';
import { getListVIQActions } from 'store/viq/viq.action';
import { getListAuditTypeActions } from 'store/audit-type/audit-type.action';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS } from 'constants/dynamic/report-of-finding.const';
import { useDispatch, useSelector } from 'react-redux';
import Excel from 'exceljs';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import {
  ReportOfFinding,
  ReportOfFindingItems,
} from 'models/api/report-of-finding/report-of-finding.model';
import styles from './form.module.scss';
import { ModalInputFields } from './modal/ModalInputFields';
import { ModalImportExcel } from './modal/ModalImportExcel';

interface ReportOfFindingTableProps {
  data?: ReportOfFinding;
  handleAdd?: (data) => void;
  handleDelete?: () => void;
  reportFindingItems?: ReportOfFindingItems[];
  loading?: boolean;
  disabled?: boolean;
  isCreate?: boolean;
  dynamicLabels?: IDynamicLabel;
}
export interface ReportOfFindingsTable {
  refNo: number | string;
  auditType: string;
  findingsType: string;
  findingsComments: string;
  findingsRemarks: string;
  isSignificant: boolean;
}
// const defaultValues = {
//   code: '',
//   name: '',
//   description: '',
//   status: 'active',
// };

export const ReportOfFindingTable: FC<ReportOfFindingTableProps> = (props) => {
  const [selectedData, setSelectedData] = useState<ReportOfFindingItems>(); // fix after
  const [selectedIndex, setSelectedIndex] = useState<number>(undefined); // fix after
  const {
    data,
    handleAdd,
    loading,
    disabled,
    reportFindingItems,
    dynamicLabels,
  } = props;
  const { userInfo } = useSelector((state) => state.authenticate);
  const { listAuditTypes } = useSelector((state) => state.auditType);
  const { listNatureOfFindings } = useSelector(
    (state) => state.inspectionMapping,
  );

  const { listDepartmentMaster } = useSelector(
    (state) => state.departmentMaster,
  );
  const { listMainCategories } = useSelector((state) => state.mainCategory);
  const { listSecondCategories } = useSelector((state) => state.secondCategory);
  const { listVIQs } = useSelector((state) => state.viq);

  const { t } = useTranslation([
    I18nNamespace.REPORT_OF_FINDING,
    I18nNamespace.COMMON,
  ]);
  const dispatch = useDispatch();

  const [isVisibleModalImportExcel, setIsVisibleModalImportExcel] =
    useState<boolean>(false);
  const [isVisibleModalInputFields, setIsVisibleModalInputFields] =
    useState<boolean>(false);
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

  const [viewRof, setViewRof] = useState<boolean>(false);

  const handleDeleteRow = useCallback(
    (indexItem: number) => {
      const dataFiltered = reportFindingItems?.filter(
        (item, index) => index !== indexItem,
      );
      handleAdd(dataFiltered);
    },
    [handleAdd, reportFindingItems],
  );

  const deleteReportOfFindingTable = useCallback(
    (index: number) => {
      showConfirmBase({
        isDelete: true,
        txTitle: t('modal.delete'),
        txMsg: t('modal.areYouSureYouWantToDelete'),
        onPressButtonRight: () => handleDeleteRow(index),
      });
    },
    [handleDeleteRow, t],
  );
  const checkWorkflow = useCallback(
    (item, index) => {
      const disable = disabled || item?.isSyncToIAR;
      const actions: Action[] = [
        {
          img: images.icons.icViewDetail,
          function: () => {
            setIsVisibleModalInputFields(true);
            setViewRof(true);
            setSelectedData(item);
            setSelectedIndex(index);
          },
          feature: Features.AUDIT_INSPECTION,
          subFeature: SubFeatures.REPORT_OF_FINDING,
          action: ActionTypeEnum.VIEW,
          buttonType: ButtonType.Blue,
        },
        {
          img: images.icons.icEdit,
          function: !disable
            ? () => {
                setSelectedData(item);
                setIsVisibleModalInputFields(true);
                setSelectedIndex(index);
              }
            : undefined,
          feature: Features.AUDIT_INSPECTION,
          subFeature: SubFeatures.REPORT_OF_FINDING,
          action: ActionTypeEnum.EXECUTE,
          disable,
          cssClass: 'ms-1',
        },
        {
          img: images.icons.icRemove,
          function: !disable
            ? () => deleteReportOfFindingTable(index)
            : undefined,
          feature: Features.AUDIT_INSPECTION,
          subFeature: SubFeatures.REPORT_OF_FINDING,
          action: ActionTypeEnum.DELETE,
          buttonType: ButtonType.Orange,
          disable,
          cssClass: 'ms-1',
        },
      ];
      return actions;
    },
    [deleteReportOfFindingTable, disabled],
  );

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS.Action,
        ),
        filter: false,
        sortable: false,
        enableRowGroup: false,
        lockPosition: true,
        minWidth: 125,
        maxWidth: 125,
        pinned: 'left',
        cellRendererFramework: (params) => {
          const { data, rowIndex } = params;
          let actions = checkWorkflow(data, rowIndex);
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
        field: 'refNo',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['S.No'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'reference',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Reference number'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'auditTypeName',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Inspection type'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'findingComment',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Findings comments'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'findingRemark',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Findings remarks'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'natureFindingName',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Findings type'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [dynamicLabels, isMultiColumnFilter, checkWorkflow],
  );

  const getList = useCallback(
    (params?: CommonApiParam) => {
      const newParams = handleFilterParams(params);
      dispatch(
        getListNatureOfFindingActions.request({ ...newParams, pageSize: -1 }),
      );
    },
    [dispatch],
  );

  const exportFile = async (workbook: Excel.Workbook) => {
    const buffer2 = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer2], {
      type: 'application/json;charset=utf-8',
    });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a'); // Or maybe get it from the current document
    link.href = blobUrl;
    link.setAttribute('download', 'Export Excel Template.xlsx'); // or any other extension
    document.body.appendChild(link);

    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  };

  const formatExport = useCallback(
    (dataItem: ReportOfFindingItems) => {
      const auditTypeCurrent = listAuditTypes?.data?.find(
        (item) => item.id === dataItem?.auditTypeId,
      );
      const natureOfFindingCurrent = listNatureOfFindings?.data?.find(
        (item) => item.id === dataItem?.natureFindingId,
      );
      const departmentCurrent = listDepartmentMaster?.data?.find(
        (item) => item.id === dataItem?.departmentId,
      );
      const mainCategoryCurrent = listMainCategories?.data?.find(
        (item) => item.id === dataItem?.mainCategoryId,
      );
      const secondCategoryCurrent = listSecondCategories?.data?.find(
        (item) => item.id === dataItem?.secondCategoryId,
      );
      const viqCurrent = listVIQs?.data?.find(
        (item) => item.id === dataItem?.viqId,
      );
      return [
        dataItem?.reference || null,
        null,
        auditTypeCurrent?.name || null,
        natureOfFindingCurrent?.name || null,
        dataItem?.isSignificant && typeof dataItem?.isSignificant === 'boolean'
          ? 'Yes'
          : 'No' || null,
        departmentCurrent?.name || null,
        mainCategoryCurrent?.name || null,
        secondCategoryCurrent?.name || null,
        viqCurrent?.refNo || null,
        dataItem?.findingComment || null,
        dataItem?.findingRemark || null,
      ];
    },
    [
      listAuditTypes?.data,
      listDepartmentMaster?.data,
      listMainCategories?.data,
      listNatureOfFindings?.data,
      listSecondCategories?.data,
      listVIQs?.data,
    ],
  );

  const findLargestData = (listLengthData: number[]) => {
    let largestData = 0;
    listLengthData.forEach((item) => {
      if (item > largestData) {
        largestData = item;
      }
    });
    return largestData;
  };

  const handleExportFile = async () => {
    const workbook = new Excel.Workbook();
    workbook.addWorksheet('Sheet1');
    workbook.addWorksheet('DataValues', { state: 'hidden' });

    const sheet1 = workbook.worksheets[0];
    const sheet2 = workbook.worksheets[1];
    sheet1.columns = [
      {
        header: `${renderDynamicLabel(
          dynamicLabels,
          DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Reference number'],
        )}*`,
        key: 'referenceNumber',
        width: 20,
      },
      {
        header: `${renderDynamicLabel(
          dynamicLabels,
          DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Inspection type'],
        )}*`,
        key: 'auditType',
        width: 20,
      },
      {
        header: `${renderDynamicLabel(
          dynamicLabels,
          DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Findings type'],
        )}*`,
        key: 'findingType',
        width: 20,
      },
      {
        header: `${renderDynamicLabel(
          dynamicLabels,
          DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Is significant'],
        )}`,
        key: 'isSignificant',
        width: 20,
      },
      {
        header: renderDynamicLabel(
          dynamicLabels,
          DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS.Department,
        ),
        key: 'department',
        width: 20,
      },
      {
        header: renderDynamicLabel(
          dynamicLabels,
          DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Main category'],
        ),
        key: 'mainCategory',
        width: 20,
      },
      {
        header: renderDynamicLabel(
          dynamicLabels,
          DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Second category'],
        ),
        key: 'secondCategory',
        width: 20,
      },
      {
        header: renderDynamicLabel(
          dynamicLabels,
          DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['VIQ category'],
        ),
        key: 'viqCategory',
        width: 20,
      },
      {
        header: `${renderDynamicLabel(
          dynamicLabels,
          DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS.Findings,
        )}*`,
        key: 'findingsComments',
        width: 20,
      },
      {
        header: renderDynamicLabel(
          dynamicLabels,
          DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Findings remarks'],
        ),
        key: 'findingsRemarks',
        width: 20,
      },
    ];

    const demoCell = [
      null,
      'Select',
      'Select',
      'Select',
      'Select',
      'Select',
      'Select',
      'Select',
      null,
      null,
      null,
    ];

    const listActiveNatureOfFindings = listNatureOfFindings?.data?.filter(
      (i) => i?.status === 'active',
    );
    const listActiveDepartmentMaster = listDepartmentMaster?.data?.filter(
      (i) => i?.status === 'active',
    );
    const listActiveMainCategories = listMainCategories?.data?.filter(
      (i) => i?.status === 'active',
    );
    const listActiveSecondCategories = listSecondCategories?.data?.filter(
      (i) => i?.status === 'active',
    );

    sheet1.addRow(demoCell);
    sheet2.addRow(['Select', 'Select', 'Select', 'Select', 'Select', 'Select']);
    const largestData = findLargestData([
      data?.rofAuditTypes?.length || 0,
      listActiveNatureOfFindings?.length || 0,
      listActiveDepartmentMaster?.length || 0,
      listActiveMainCategories?.length || 0,
      listActiveSecondCategories?.length || 0,
      listVIQs?.data?.length || 0,
    ]);

    new Array(largestData + 3).fill(0).forEach((item, index) => {
      sheet2.addRow([
        data?.rofAuditTypes[index]?.auditTypeName || null,
        listActiveNatureOfFindings[index]?.name || null,
        listActiveDepartmentMaster[index]?.name || null,
        listActiveMainCategories[index]?.name || null,
        listActiveSecondCategories[index]?.name || null,
        listVIQs?.data[index]?.refNo || null,
      ]);
    });

    sheet1.getColumnKey('auditType').eachCell((cellItem) => {
      cellItem.dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [`DataValues!$A$1:$A$${data?.rofAuditTypes?.length + 3}`],
      };
    });
    sheet1.getColumnKey('findingType').eachCell((cellItem) => {
      cellItem.dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [
          `DataValues!$B$1:$B$${listActiveNatureOfFindings?.length + 3}`,
        ],
      };
    });
    sheet1.getColumnKey('isSignificant').eachCell((cellItem) => {
      cellItem.dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: ['"Select,Yes,No"'],
      };
    });
    sheet1.getColumnKey('department').eachCell((cellItem) => {
      cellItem.dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [
          `DataValues!$C$1:$C$${listActiveDepartmentMaster?.length + 3}`,
        ],
      };
    });
    sheet1.getColumnKey('mainCategory').eachCell((cellItem) => {
      cellItem.dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [
          `DataValues!$D$1:$D$${listActiveMainCategories?.length + 3}`,
        ],
      };
    });
    sheet1.getColumnKey('secondCategory').eachCell((cellItem) => {
      cellItem.dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [
          `DataValues!$E$1:$E$${listActiveSecondCategories?.length + 3}`,
        ],
      };
    });
    sheet1.getColumnKey('viqCategory').eachCell((cellItem) => {
      cellItem.dataValidation = {
        type: 'list',
        allowBlank: true,
        formulae: [`DataValues!$F$1:$F$${listVIQs?.data?.length + 3}`],
      };
    });
    sheet1.getRow(1).eachCell((cellItem, colIndex) => {
      if (colIndex <= formatExport(undefined).length) {
        cellItem.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '666699' },
          // bgColor: { argb: '666699' },
        };
        cellItem.dataValidation = {
          type: 'textLength',
          formulae: [],
        };
        cellItem.model.style.font = {
          color: { argb: 'ffffff' },
          bold: true,
          size: 12,
        };
        cellItem.model.style.border = {
          top: { style: 'thin', color: { argb: '000000' } },
          left: { style: 'thin', color: { argb: '000000' } },
          bottom: { style: 'thin', color: { argb: '000000' } },
          right: { style: 'thin', color: { argb: '000000' } },
        };
      }
    });

    exportFile(workbook);
  };

  useEffect(() => {
    if (data?.planningRequest?.id) {
      dispatch(
        getListAuditTypeActions.request({
          pageSize: -1,
          companyId: userInfo?.mainCompanyId,
        }),
      );
      dispatch(
        getListDepartmentMasterActions.request({
          pageSize: -1,
          companyId: userInfo?.mainCompanyId,
        }),
      );
      dispatch(
        getListMainCategoryActions.request({
          pageSize: -1,
          companyId: userInfo?.mainCompanyId,
        }),
      );
      dispatch(
        getListSecondCategoryActions.request({
          pageSize: -1,
          companyId: userInfo?.mainCompanyId,
        }),
      );
      dispatch(
        getListVIQActions.request({
          pageSize: -1,
          companyId: userInfo?.mainCompanyId,
        }),
      );
      dispatch(
        getListNatureOfFindingActions.request({
          planningRequestId: data?.planningRequest?.id,
          workSpace: true,
          companyId: userInfo?.mainCompanyId,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);
  const dataTable = useMemo(
    () =>
      (!loading &&
        reportFindingItems?.length > 0 &&
        reportFindingItems.map((data: any, index) => {
          const currentAuditType = listAuditTypes?.data?.find(
            (i) => i.id === data?.auditTypeId,
          );
          const currentNatureFinding = listNatureOfFindings?.data?.find(
            (i) => i.id === data?.natureFindingId,
          );
          return {
            id: data?.id,
            refNo: index + 1,
            reference: data?.reference || 'N/A',
            auditTypeName: data?.auditTypeName || currentAuditType?.name,
            auditTypeId: data?.auditTypeId,
            findingComment: data?.findingComment,
            findingRemark: data?.findingRemark,
            natureFindingName:
              currentNatureFinding?.name || data?.natureFindingName || '',
            mainCategoryId: data?.mainCategoryId,
            secondCategoryId: data?.secondCategoryId,
            viqId: data?.viqId,
            findingAttachments: data?.findingAttachments || [],
            natureFindingId: data?.natureFindingId || '',
            isSignificant: data?.isSignificant || false,
            rectifiedOnBoard: data?.rectifiedOnBoard || false,
            departmentId: data?.departmentId,
          };
        })) ||
      [],
    [
      listAuditTypes?.data,
      listNatureOfFindings?.data,
      loading,
      reportFindingItems,
    ],
  );

  const isCloseoutStatus = data?.status === 'Close out';

  return (
    <div
      className={cx(
        styles.wrapperContainer,
        styles.wrapperContainerReportOfFinding,
      )}
    >
      <div className={cx(styles.containerForm)}>
        <div
          className={cx(
            'd-flex',
            styles.containerHeader,
            styles.containerMarginHeader,
          )}
        >
          <div className={cx(styles.titleContainer)}>
            {renderDynamicLabel(
              dynamicLabels,
              DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Report of findings'],
            )}
          </div>
          <div>
            <Button
              onClick={handleExportFile}
              buttonSize={ButtonSize.Medium}
              buttonType={ButtonType.Primary}
              disabled={disabled || !data?.planningRequest}
              disabledCss={disabled || !data?.planningRequest}
              className={cx('mt-auto', styles.button, styles.buttonImportExcel)}
              renderSuffix={
                <img
                  src={images.icons.icExportExcel}
                  alt="createNew"
                  className={cx(styles.icButton, styles.icBtnImport)}
                />
              }
            >
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Export template'],
              )}
            </Button>
            <Button
              onClick={() => setIsVisibleModalImportExcel((e) => !e)}
              buttonSize={ButtonSize.Medium}
              buttonType={ButtonType.Primary}
              disabled={disabled || !data?.planningRequest || isCloseoutStatus}
              disabledCss={
                disabled || !data?.planningRequest || isCloseoutStatus
              }
              className={cx('mt-auto', styles.button, styles.buttonImportExcel)}
              renderSuffix={
                <img
                  src={images.icons.icImportExcel}
                  alt="createNew"
                  className={cx(styles.icButton, styles.icBtnImport)}
                />
              }
            >
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Import template'],
              )}
            </Button>
            <Button
              buttonSize={ButtonSize.Medium}
              buttonType={ButtonType.Green}
              disabled={disabled || !data?.planningRequest || isCloseoutStatus}
              disabledCss={
                disabled || !data?.planningRequest || isCloseoutStatus
              }
              className={cx('mt-auto', styles.button)}
              onClick={() => setIsVisibleModalInputFields((e) => !e)}
            >
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Input fields'],
              )}
            </Button>
          </div>
        </div>
        <AGGridModule
          loading={loading}
          params={null}
          setIsMultiColumnFilter={setIsMultiColumnFilter}
          hasRangePicker={false}
          columnDefs={columnDefs}
          dataFilter={null}
          moduleTemplate={MODULE_TEMPLATE.reportOfFindingTable}
          fileName="Report of finding"
          dataTable={dataTable}
          height="275px"
          colDefProp={DEFAULT_COL_DEF_TYPE_FLEX}
          getList={getList}
          pageSizeDefault={5}
          classNameHeader={styles.header}
          aggridId="ag-grid-table-1"
        />
      </div>
      <ModalInputFields
        isOpen={isVisibleModalInputFields}
        isView={viewRof}
        data={data}
        setIsVisibleModalInputFields={(value) =>
          setIsVisibleModalInputFields(value)
        }
        handleAdd={(data) => {
          const arrData: ReportOfFindingItems[] = [...reportFindingItems, data];
          handleAdd(arrData);
        }}
        handleEdit={(data, indexData) => {
          const arrData = reportFindingItems.map((item, index) => {
            if (indexData === index) {
              return data;
            }
            return item;
          });
          handleAdd(arrData);
        }}
        toggle={() => {
          setSelectedData(undefined);
          setSelectedIndex(undefined);
          setViewRof(false);
        }}
        selectedIndex={selectedIndex}
        selectedData={selectedData}
        dynamicLabels={dynamicLabels}
        title={renderDynamicLabel(
          dynamicLabels,
          DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS[
            'Report of finding input fields'
          ],
        )}
      />
      <ModalImportExcel
        title={renderDynamicLabel(
          dynamicLabels,
          DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Import excel'],
        )}
        isVisibleModal={isVisibleModalImportExcel}
        setIsVisibleModalImportExcel={(value) =>
          setIsVisibleModalImportExcel(value)
        }
        dynamicLabels={dynamicLabels}
        handleAdd={(data: ReportOfFindingItems[]) => {
          const arrData = reportFindingItems?.concat(data);
          handleAdd(arrData);
        }}
      />
    </div>
  );
};
