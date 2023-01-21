import { yupResolver } from '@hookform/resolvers/yup';
import images from 'assets/images/images';
import cx from 'classnames';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import InputForm from 'components/react-hook-form/input-form/InputForm';
import ModalListTableForm from 'components/react-hook-form/modal-list-form/ModalListTableForm';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { GroupButton } from 'components/ui/button/GroupButton';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { I18nNamespace } from 'constants/i18n.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import PermissionCheck from 'hoc/withPermissionCheck';
import isEmpty from 'lodash/isEmpty';
import {
  BulkUpdateElementMasterParams,
  ElementMaster,
  StandardMaster,
} from 'models/api/element-master/element-master.model';
import { Action } from 'models/common.model';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { Col, Row } from 'reactstrap';
import * as yup from 'yup';
import Excel from 'exceljs';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import {
  DATA_SPACE,
  MODULE_TEMPLATE,
} from 'constants/components/ag-grid.const';
import { checkElementMasterHasBeenUsedApi } from 'api/element-master.api';
import isEqual from 'lodash/isEqual';
import { toastError } from 'helpers/notification.helper';
import useEffectOnce from 'hoc/useEffectOnce';
import { getListTemplateDictionaryActions } from 'store/template/template.action';
import styles from './form.module.scss';
import { ModalCreateElement } from './modal/ModalCreateElement';
import { ModalImportExcel } from './modal/ModalImportExcel';

interface ElementMasterFormProps {
  isEdit: boolean;
  isCreate?: boolean;
  data: StandardMaster;
  onDelete?: () => void;
  onSubmit: (data: BulkUpdateElementMasterParams) => void;
}

const sortPosition = ['standardName'];

const defaultValue = {
  standardName: '',
  status: 'active',
};

const ElementMasterForm = ({
  isEdit,
  data,
  onDelete,
  onSubmit,
  isCreate,
}: ElementMasterFormProps) => {
  const { t } = useTranslation([
    I18nNamespace.ELEMENT_MASTER,
    I18nNamespace.COMMON,
  ]);
  const { loading, listStandardNoElements, listElementMasters } = useSelector(
    (state) => state.elementMaster,
  );
  const dispatch = useDispatch();
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const [isVisibleModalImportExcel, setIsVisibleModalImportExcel] =
    useState<boolean>(false);
  const [indexElement, setIndexElement] = useState<number>(undefined);
  const [elementMasterTable, setElementMasterTable] = useState<ElementMaster[]>(
    [],
  );
  const [isHasRef, setIsHasRef] = useState<boolean>(false);
  const [elementMasterDeleteIds, setElementMasterDeleteIds] = useState<
    string[]
  >([]);
  const { id } = useParams<{ id: string }>();
  const [modalCreate, setModalCreate] = useState<boolean>(false);
  const [isAdd, setIsAdd] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<ElementMaster>(undefined);
  const [selectedStandard, setSelectedStandard] =
    useState<StandardMaster>(undefined);

  const schema = useMemo(
    () =>
      yup.object().shape({
        standardName: yup
          .string()
          .nullable()
          .trim()
          .required(t('errors.required')),
      }),
    [t],
  );

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    setError,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues: defaultValue,
    resolver: yupResolver(schema),
  });

  const handleDeleteElementMaster = useCallback(
    (item: ElementMaster) => {
      const newData = elementMasterTable.filter((e) => e.id !== item.id);
      if (!item?.isAddItem) {
        setElementMasterDeleteIds([...elementMasterDeleteIds, item.id]);
      }
      setElementMasterTable(newData);
    },
    [elementMasterDeleteIds, elementMasterTable],
  );

  const handleDelete = useCallback(
    (item: ElementMaster) => {
      showConfirmBase({
        isDelete: true,
        txTitle: t('modal.delete'),
        txMsg: t('modal.areYouSureYouWantToDelete'),
        onPressButtonRight: () => handleDeleteElementMaster(item),
      });
    },
    [handleDeleteElementMaster, t],
  );

  const resetDefault = useCallback(
    (defaultParams) => {
      reset(defaultParams);
      history.goBack();
    },
    [reset],
  );

  const onCancel = useCallback(() => {
    let defaultParams: {
      standardName?: string;
      status?: string;
      elementMasterTable?: any[];
    } = {};
    const values = getValues();

    const params = {
      status: values?.status,
      standardName: values?.standardName,
      elementMasterTable,
    };
    if (isCreate) {
      defaultParams = {
        standardName: '',
        status: 'active',
        elementMasterTable: [],
      };
    } else {
      defaultParams = {
        status: data?.status,
        standardName: data?.name,
        elementMasterTable: listElementMasters?.data,
      };
    }

    if (isEqual(defaultParams, params)) {
      if (isCreate) {
        history.push(AppRouteConst.ELEMENT_MASTER);
      } else {
        history.goBack();
      }
    } else {
      const { elementMasterTable, ...other } = defaultParams;
      showConfirmBase({
        isDelete: false,
        txTitle: t('modal.cancelTitle'),
        txMsg: t('modal.cancelMessage'),
        onPressButtonRight: () =>
          isCreate
            ? history.push(AppRouteConst.ELEMENT_MASTER)
            : resetDefault(other),
      });
    }
  }, [
    data?.name,
    data?.status,
    elementMasterTable,
    getValues,
    isCreate,
    listElementMasters?.data,
    resetDefault,
    t,
  ]);

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: t('action'),
        filter: false,
        sortable: false,
        enableRowGroup: false,
        lockPosition: true,
        maxWidth: 125,
        pinned: 'left',
        cellRendererFramework: (params) => {
          const { data: dataRow, rowIndex } = params;
          const data = elementMasterTable[rowIndex];
          let actions: Action[] = [
            {
              img: images.icons.icEdit,
              function: () => {
                setSelectedData(data);
                setModalCreate(true);
                setIsAdd(false);
                setIndexElement(rowIndex);
              },
              feature: Features.QUALITY_ASSURANCE,
              subFeature: SubFeatures.ELEMENT_MASTER,
              action: ActionTypeEnum.UPDATE,
              disable: loading || !isEdit,
            },
            {
              img: images.icons.icRemove,
              function: () => handleDelete(data),
              feature: Features.QUALITY_ASSURANCE,
              subFeature: SubFeatures.ELEMENT_MASTER,
              action: ActionTypeEnum.DELETE,
              buttonType: ButtonType.Orange,
              cssClass: 'ms-1',
              disable: loading || !isEdit,
            },
          ];

          if (!dataRow) {
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
        field: 'standard',
        headerName: t('standard'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'elementCode',
        headerName: t('elementCode'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'elementName',
        headerName: t('elementName'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'elementNumber',
        headerName: t('elementNumber'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'stage',
        headerName: t('stage'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'questionNumber',
        headerName: t('questionNumber'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'keyPerformanceIndicator',
        headerName: t('keyPerformanceIndicator'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'bestPracticeGuidance',
        headerName: t('bestPracticeGuidance'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [elementMasterTable, handleDelete, isEdit, isMultiColumnFilter, loading, t],
  );

  useEffect(() => {
    if (isCreate) {
      setValue('standardName', selectedStandard?.name || '');
    } else {
      setValue('standardName', data?.name || '');
    }
  }, [data?.name, isCreate, selectedStandard?.name, setValue]);

  useEffect(() => {
    if (!isCreate && data) {
      setValue('status', data.standardMasterElements?.status || 'active');
    }
  }, [data, isCreate, setValue]);

  useEffect(() => {
    if (id) {
      checkElementMasterHasBeenUsedApi(id).then((res) =>
        setIsHasRef(res?.data?.hasRef),
      );
    }
  }, [id]);

  useEffect(() => {
    if (!isCreate && listElementMasters?.data?.length) {
      setElementMasterTable(listElementMasters?.data);
    }
  }, [isCreate, listElementMasters?.data]);

  useEffect(() => {
    if (errors?.standardName?.message && selectedStandard) {
      setError('standardName', { message: '' });
    }
  }, [errors?.standardName?.message, selectedStandard, setError]);

  useEffectOnce(() => {
    dispatch(
      getListTemplateDictionaryActions.request({
        content: `${MODULE_TEMPLATE.selfAssessmentElementMaster}__${id}`,
      }),
    );
  });

  const scrollToView = useCallback((errors) => {
    if (!isEmpty(errors)) {
      const firstError = sortPosition.find((item) => errors[item]);
      const el = document.querySelector(`.form_data #${firstError}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, []);

  const handleAddElementMaster = useCallback(
    (formData: ElementMaster) => {
      const { isNew, resetForm, ...other } = formData;
      setElementMasterTable([...elementMasterTable, other]);
      setIsAdd(true);
      if (isNew) {
        resetForm();
        setModalCreate(true);
        return;
      }
      setModalCreate(false);
    },
    [elementMasterTable],
  );

  const onSubmitForm = useCallback(() => {
    // update status for all item in list
    const dataNew: BulkUpdateElementMasterParams = {
      createEleMasters: elementMasterTable.filter((item) => item?.isAddItem),
      standardId: selectedStandard?.id,
      status: getValues('status'),
    };
    const dataEdit: BulkUpdateElementMasterParams = {
      createEleMasters: elementMasterTable.filter((item) => item?.isAddItem),
      updateEleMasters: elementMasterTable.filter((item) => !item?.isAddItem),
      deleteEleMasterIds: elementMasterDeleteIds,
      status: getValues('status'),
    };
    onSubmit(isCreate ? dataNew : dataEdit);
  }, [
    elementMasterDeleteIds,
    elementMasterTable,
    getValues,
    isCreate,
    onSubmit,
    selectedStandard?.id,
  ]);

  const handleEditElementMaster = useCallback(
    (formData: ElementMaster) => {
      const { isNew, resetForm, ...other } = formData;
      const newFormList = [...elementMasterTable];
      let item = newFormList[indexElement];
      item = {
        ...item,
        ...other,
      };
      newFormList[indexElement] = item;
      setElementMasterTable([...newFormList]);
      setIsAdd(true);
      setIndexElement(undefined);
      if (isNew) {
        resetForm();
        setModalCreate(true);
        return;
      }
      setModalCreate(false);
    },
    [elementMasterTable, indexElement],
  );

  const saveToTableElementMaster = useCallback(
    (data: ElementMaster) => {
      if (isAdd) {
        handleAddElementMaster(data);
      } else {
        handleEditElementMaster(data);
      }
      setSelectedData(undefined);
    },
    [handleAddElementMaster, handleEditElementMaster, isAdd],
  );

  const saveDataImportToTableElementMaster = useCallback(
    (data: ElementMaster[]) => {
      setElementMasterTable([...elementMasterTable, ...data]);
    },
    [elementMasterTable],
  );

  const rowLabelsStandardList = useMemo(
    () => [
      {
        title: t('standardCode'),
        dataIndex: 'standardCode',
        width: 150,
      },
      {
        title: t('standardName'),
        dataIndex: 'standardName',
        width: 150,
      },
      {
        title: t('companyCode'),
        dataIndex: 'companyCode',
        width: 150,
      },
      {
        title: t('companyName'),
        dataIndex: 'companyName',
        width: 150,
      },
    ],
    [t],
  );

  const currentBreadCrumb = useMemo(() => {
    if (isCreate) {
      return BREAD_CRUMB.ELEMENT_MASTER_CREATE;
    }
    if (isEdit) {
      return BREAD_CRUMB.ELEMENT_MASTER_EDIT;
    }
    return BREAD_CRUMB.ELEMENT_MASTER_DETAIL;
  }, [isCreate, isEdit]);

  const dataTableChooseStandard = useMemo(
    () =>
      listStandardNoElements?.data?.map((item) => ({
        id: item?.id,
        standardCode: item?.code,
        standardName: item?.name,
        companyCode: item?.company?.code,
        companyName: item?.company?.name,
      })),
    [listStandardNoElements?.data],
  );

  const dataTable = useMemo(
    () =>
      elementMasterTable?.map((item: ElementMaster) => ({
        id: item.id || DATA_SPACE,
        standard:
          (isCreate ? selectedStandard?.name : data?.name) || DATA_SPACE,
        elementCode: item?.code || DATA_SPACE,
        elementName: item?.name || DATA_SPACE,
        elementNumber: item?.number || DATA_SPACE,
        stage: item?.stage || DATA_SPACE,
        questionNumber: item?.questionNumber || DATA_SPACE,
        keyPerformanceIndicator: item?.keyPerformanceIndicator || DATA_SPACE,
        bestPracticeGuidance: item?.bestPracticeGuidance || DATA_SPACE,
      })) || [],
    [data?.name, elementMasterTable, isCreate, selectedStandard?.name],
  );

  const exportFile = useCallback(async (workbook: Excel.Workbook) => {
    const buffer2 = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer2], {
      type: 'application/json;charset=utf-8',
    });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.setAttribute('download', 'Export Excel Template.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(blobUrl);
  }, []);

  const formatExport = useCallback(
    (dataItem: ElementMaster) => {
      const stage = selectedStandard?.levels?.find(
        (item) => item === dataItem?.stage,
      );

      return [null, null, null, stage || null, null, null, null];
    },
    [selectedStandard?.levels],
  );

  const handleExportTemplate = useCallback(async () => {
    const workbook = new Excel.Workbook();
    workbook.addWorksheet('Sheet1');
    const sheet1 = workbook.worksheets[0];
    sheet1.columns = [
      {
        header: `${t('elementCode')}`,
        key: 'elementCode',
        width: 20,
      },
      {
        header: `${t('elementName')}`,
        key: 'elementName',
        width: 20,
      },
      {
        header: `${t('elementNumber')}`,
        key: 'elementNumber',
        width: 20,
      },
      {
        header: `${t('stage')}`,
        key: 'stage',
        width: 20,
      },
      {
        header: t('questionNumber'),
        key: 'questionNumber',
        width: 20,
      },
      {
        header: t('keyPerformanceIndicator'),
        key: 'keyPerformanceIndicator',
        width: 30,
      },
      {
        header: t('bestPracticeGuidance'),
        key: 'bestPracticeGuidance',
        width: 30,
      },
    ];

    const demoCell = [
      null,
      null,
      null,
      selectedStandard?.levels?.length ? 'Select' : null,
      null,
      null,
      null,
    ];

    sheet1.addRow(demoCell);
    sheet1.getColumnKey('stage').eachCell((cellItem) => {
      const dataStage = selectedStandard?.levels?.toString();
      // eslint-disable-next-line no-param-reassign
      cellItem.dataValidation = {
        type: 'list',
        allowBlank: false,
        formulae: [`"${dataStage}"`],
      };
    });

    sheet1.getRow(1).eachCell((cellItem, colIndex) => {
      if (colIndex <= formatExport(undefined).length) {
        // eslint-disable-next-line no-param-reassign
        cellItem.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: '666699' },
        };
        // eslint-disable-next-line no-param-reassign
        cellItem.dataValidation = {
          type: 'textLength',
          formulae: [],
        };
        // eslint-disable-next-line no-param-reassign
        cellItem.model.style.font = {
          color: { argb: 'ffffff' },
          bold: true,
          size: 12,
        };
        // eslint-disable-next-line no-param-reassign
        cellItem.model.style.border = {
          top: { style: 'thin', color: { argb: '000000' } },
          left: { style: 'thin', color: { argb: '000000' } },
          bottom: { style: 'thin', color: { argb: '000000' } },
          right: { style: 'thin', color: { argb: '000000' } },
        };
      }
    });
    exportFile(workbook);
  }, [exportFile, formatExport, selectedStandard?.levels, t]);

  const handleGetList = useCallback(({ handleSuccess }) => {
    handleSuccess?.();
  }, []);

  if (loading && !isCreate) {
    return (
      <div className="d-flex justify-content-center">
        <img
          src={images.common.loading}
          className={styles.loading}
          alt="loading"
        />
      </div>
    );
  }

  return (
    <div className="form_data">
      <div className={cx(styles.wrapHeader, 'd-flex justify-content-between')}>
        <div className={cx(styles.headers)}>
          <BreadCrumb current={currentBreadCrumb} />
          <div className={cx('fw-bold', styles.title)}>
            {t('ElementMasterTitle')}
          </div>
        </div>
        <div>
          {!isEdit && (
            <div className={styles.headerBtn}>
              <Button
                className={cx('me-2', styles.buttonFilter)}
                buttonType={ButtonType.CancelOutline}
                onClick={(e) => {
                  history.goBack();
                }}
              >
                <span className="pe-2">Back</span>
              </Button>
              {data?.createdUserId && (
                <PermissionCheck
                  options={{
                    feature: Features.QUALITY_ASSURANCE,
                    subFeature: SubFeatures.ELEMENT_MASTER,
                    action: ActionTypeEnum.UPDATE,
                  }}
                >
                  {({ hasPermission }) =>
                    hasPermission && (
                      <Button
                        className={cx('me-1', styles.buttonFilter)}
                        onClick={(e) => {
                          if (isHasRef) {
                            toastError(
                              'The data is used in other modules, you cannot deactivate it',
                            );
                            return;
                          }
                          history.push(
                            `${AppRouteConst.getElementMasterById(id)}?edit`,
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
              )}
              {data?.createdUserId && (
                <PermissionCheck
                  options={{
                    feature: Features.QUALITY_ASSURANCE,
                    subFeature: SubFeatures.ELEMENT_MASTER,
                    action: ActionTypeEnum.DELETE,
                  }}
                >
                  {({ hasPermission }) =>
                    hasPermission && (
                      <Button
                        className={cx('ms-1', styles.buttonFilter)}
                        buttonType={ButtonType.Orange}
                        onClick={() => {
                          if (isHasRef) {
                            toastError(
                              'The data is used in other modules, you cannot delete it',
                            );
                            return;
                          }
                          onDelete();
                        }}
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
              )}
            </div>
          )}
        </div>
      </div>
      <div className={cx(styles.wrapperContainer)}>
        <Row
          className={cx(
            'pb-3 d-flex',
            errors?.standardName?.message
              ? 'align-items-center'
              : 'align-items-end',
          )}
        >
          <Col span={3} xs="3">
            <InputForm
              messageRequired={errors?.standardName?.message || ''}
              maxLength={250}
              label={t('standard')}
              patternValidate={/^[a-z\d\-_\s]+$/i}
              control={control}
              name="standardName"
              isRequired
              disabled
              className="cssDisabled"
            />
          </Col>
          <Col
            span={3}
            sm={{
              size: 'auto',
            }}
          >
            <ModalListTableForm
              name="standardListId"
              disable={!!selectedStandard || !isCreate}
              id="standardListId"
              size="xl"
              control={control}
              title={t('standard')}
              data={dataTableChooseStandard}
              rowLabels={rowLabelsStandardList}
              buttonName={t('buttons.chooseStandard')}
              disableCloseWhenClickOut
              onChangeValues={(value) => {
                if (value) {
                  const standard = listStandardNoElements?.data?.find((item) =>
                    value.includes(item.id),
                  );
                  setSelectedStandard(standard);
                }
              }}
            />
          </Col>
          <Col span={3}>
            <RadioForm
              label={t('status')}
              labelClassName={styles.radioLabel}
              className={styles.radioForm}
              name="status"
              control={control}
              disabled={loading || !isEdit}
              radioOptions={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
            />
          </Col>
        </Row>
        <div className={cx(styles.labelForm)}>
          <span className={cx('fw-bold', styles.titleForm)}>
            {t('selfAssessmentElementMaster')}
          </span>
          {isEdit && !isHasRef && (
            <div className={cx('d-flex', styles.btnWrapper)}>
              <Button
                onClick={handleExportTemplate}
                buttonSize={ButtonSize.Medium}
                buttonType={ButtonType.Primary}
                className="mt-auto"
                renderSuffix={
                  <img
                    src={images.icons.icExportExcel}
                    alt="importTemplate"
                    className={styles.icButton}
                  />
                }
              >
                {t('buttons.txExportTemplate')}
              </Button>
              <Button
                onClick={() => setIsVisibleModalImportExcel((e) => !e)}
                buttonSize={ButtonSize.Medium}
                buttonType={ButtonType.Primary}
                disabled={isCreate ? !selectedStandard : !data}
                disabledCss={isCreate ? !selectedStandard : !data}
                className="mt-auto"
                renderSuffix={
                  <img
                    src={images.icons.icImportExcel}
                    alt="createNew"
                    className={styles.icButton}
                  />
                }
              >
                {t('buttons.importExcel')}
              </Button>
              <Button
                className={styles.buttonAdd}
                buttonSize={ButtonSize.Medium}
                onClick={() => {
                  setModalCreate(true);
                  setIsAdd(true);
                  setSelectedData(undefined);
                }}
                renderSuffix={
                  <img
                    src={images.icons.icAddCircle}
                    alt="createNew"
                    className={styles.icButton}
                  />
                }
                disabled={loading || isCreate ? !selectedStandard : !data}
                disabledCss={isCreate ? !selectedStandard : !data}
              >
                {t('buttons.add')}
              </Button>
            </div>
          )}
        </div>
        <AGGridModule
          title={t('')}
          hasRangePicker={false}
          loading={loading}
          params={null}
          setIsMultiColumnFilter={setIsMultiColumnFilter}
          columnDefs={columnDefs}
          dataFilter={null}
          moduleTemplate={`${MODULE_TEMPLATE.selfAssessmentElementMaster}__${id}`}
          fileName="Self-assessment_Self assessment element master"
          dataTable={dataTable}
          height="calc(100vh - 340px)"
          classNameHeader={styles.header}
          getList={handleGetList}
        />
      </div>
      {isEdit ? (
        <GroupButton
          className={styles.GroupButton}
          handleCancel={onCancel}
          handleSubmit={handleSubmit(onSubmitForm, scrollToView)}
          disable={loading}
        />
      ) : null}
      <ModalImportExcel
        title={t('txImportExcel')}
        isVisibleModal={isVisibleModalImportExcel}
        setIsVisibleModalImportExcel={(value) =>
          setIsVisibleModalImportExcel(value)
        }
        selectedStandard={isCreate ? selectedStandard : data}
        handleAdd={saveDataImportToTableElementMaster}
        dataTable={elementMasterTable}
      />
      {modalCreate && (
        <ModalCreateElement
          isShow={modalCreate}
          selectedStandard={isCreate ? selectedStandard : data}
          isAdd={isAdd}
          selectedData={selectedData}
          setShow={() => {
            setModalCreate((e) => !e);
          }}
          handleAdd={saveToTableElementMaster}
          dataTable={elementMasterTable}
          loading={loading}
          title={isAdd ? t('createElement') : t('editElement')}
        />
      )}
    </div>
  );
};

export default ElementMasterForm;
