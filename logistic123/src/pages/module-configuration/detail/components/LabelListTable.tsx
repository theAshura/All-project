import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import {
  MODULE_TEMPLATE,
  DEFAULT_COL_DEF_TYPE_FLEX,
} from 'constants/components/ag-grid.const';
import {
  ActionTypeEnum,
  Features,
  RoleScope,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { useMemo, memo, FC, useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { v4 } from 'uuid';
import cx from 'classnames';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import Input from 'components/ui/input/Input';
import { useLocation } from 'react-router';

import ModalComponent from 'components/ui/modal/Modal';
import listStyles from 'components/list-common.module.scss';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';

import {
  LabelDetailDefaultSchema,
  LabelDetailDefaultValue,
  LabelListType,
  LanguageEnum,
} from 'constants/module-configuration.cons';
import {
  LabelDetailValue,
  ListLabelDataTable,
} from 'models/store/module-configuration/module-configuration.model';
import {
  clearLabelDetail,
  getDetailLabelConfigActions,
  getListLabelConfigActions,
  updateDetailLabelConfigActions,
} from 'store/module-configuration/module-configuration.action';
import { dateStringComparator, formatDateTime } from 'helpers/utils.helper';
import images from 'assets/images/images';
import Button, { ButtonType } from 'components/ui/button/Button';
import { Action } from 'models/common.model';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import LabelUI from 'components/ui/label/LabelUI';
import TextAreaForm from 'components/react-hook-form/text-area/TextAreaForm';
import styles from './styles/label-list-module.module.scss';

interface LabelListTableProps {
  isEditMode: boolean;
  language: LanguageEnum;
  companyId: string;
}

const LabelListTable: FC<LabelListTableProps> = ({
  isEditMode = false,
  language,
  companyId,
}) => {
  const uniqueId = useMemo(() => v4(), []);
  const dispatch = useDispatch();
  const { listLabel, loading, moduleDetail, labelDetail, internalLoading } =
    useSelector((store) => store.moduleConfiguration);
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const { userInfo } = useSelector((state) => state.authenticate);
  const [defaultFilter, setDefaultFilter] = useState(LabelListType.LIST);
  const [modal, setModal] = useState({
    type: ActionTypeEnum.VIEW,
    open: false,
  });
  const { search } = useLocation();

  const {
    register,
    control,
    handleSubmit,
    setValue,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues: LabelDetailDefaultValue,
    resolver: yupResolver(LabelDetailDefaultSchema),
  });

  const handleGetList = useCallback(() => {
    if (moduleDetail && defaultFilter && language) {
      dispatch(
        getListLabelConfigActions.request({
          id: moduleDetail.id,
          action: defaultFilter,
          lang: language,
          pageSize: -1,
          companyId,
        }),
      );
    }
  }, [companyId, defaultFilter, dispatch, language, moduleDetail]);

  const handleViewDetailWithAction = useCallback(
    (labelId: string, action: ActionTypeEnum) => {
      if (moduleDetail && labelId && language) {
        dispatch(
          getDetailLabelConfigActions.request({
            id: moduleDetail.id,
            labelId,
            lang: language,
            action: defaultFilter,
          }),
        );
      }

      setModal({
        open: true,
        type: action,
      });
    },
    [defaultFilter, dispatch, language, moduleDetail],
  );

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: 'Action',
        filter: false,
        sortable: false,
        enableRowGroup: false,
        lockPosition: true,
        maxWidth: 125,
        pinned: 'left',
        cellRendererFramework: ({ data }: { data: ListLabelDataTable }) => {
          let actions: Action[] = [
            {
              img: images.icons.icViewDetail,
              // TODO: fix this later on
              feature: Features.GROUP_COMPANY,
              subFeature: SubFeatures.COMPANY,
              buttonType: ButtonType.Blue,
              action: ActionTypeEnum.VIEW,
              function: () =>
                handleViewDetailWithAction(data?.id || '', ActionTypeEnum.VIEW),
            },
            {
              img: images.icons.icEdit,
              feature: Features.GROUP_COMPANY,
              subFeature: SubFeatures.COMPANY,
              action: ActionTypeEnum.UPDATE,
              cssClass: 'ms-1',
              function: () =>
                handleViewDetailWithAction(
                  data?.id || '',
                  ActionTypeEnum.UPDATE,
                ),
              disable: !isEditMode,
            },
          ];

          if (!data) {
            actions = [];
          }
          return (
            <div
              className={cx('d-flex justify-content-start align-items-center')}
            >
              <ActionBuilder actionList={actions} />
            </div>
          );
        },
      },
      {
        field: 'fieldID',
        headerName: 'Field ID',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'defaultLabel',
        headerName: 'Field Default Label',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'userDefineLabel',
        headerName: 'Field User Define Label',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'description',
        headerName: 'Description',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'updatedDate',
        headerName: 'Update Date',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
      {
        field: 'updatedUser',
        headerName: 'Updated By User',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [handleViewDetailWithAction, isEditMode, isMultiColumnFilter],
  );

  const listLabelFilter = useMemo(
    () =>
      listLabel && listLabel?.data
        ? listLabel?.data.map((label) => ({
            id: label?.id || '',
            fieldID: label?.id || '',
            userDefineLabel: label?.userDefinedLabel || '',
            description: label?.description || '',
            updatedDate: formatDateTime(label?.updatedAt) || '',
            updatedUser: label?.modifiedBy?.username || '',
            defaultLabel: label?.defaultLabel || '',
          }))
        : [],
    [listLabel],
  );

  const handleCloseModal = useCallback(() => {
    setModal((prev) => ({ ...prev, open: false }));
    dispatch(clearLabelDetail());
    clearErrors();
    reset();
  }, [clearErrors, dispatch, reset]);

  const onSubmitUpdate = useCallback(
    (value: LabelDetailValue) => {
      if (moduleDetail && language) {
        const defaultField = {
          id: moduleDetail.id,
          labelId: value.fieldID,
          language,
          userDefinedLabel: value.definedLabel,
          companyId,
          action: defaultFilter,
        };

        const reassignObject = value.description
          ? {
              ...defaultField,
              description: value.description,
            }
          : {
              ...defaultField,
            };

        dispatch(
          updateDetailLabelConfigActions.request({
            ...reassignObject,
            onSuccess: (id?: string) => {
              handleCloseModal();
              handleGetList();
              history.push(
                `${AppRouteConst.getModuleConfigurationDetailById(
                  id,
                  companyId,
                )}${search}`,
              );
            },
          }),
        );
      }
    },
    [
      companyId,
      defaultFilter,
      dispatch,
      handleCloseModal,
      handleGetList,
      language,
      moduleDetail,
      search,
    ],
  );

  const renderContentLabelDetail = useMemo(
    () => (
      <Row gutter={[16, 12]}>
        <Col span={12}>
          <Input
            readOnly
            {...register('moduleName')}
            label="Module Name"
            isRequired
            className={cx('cssDisabled', styles.disableInput)}
            styleLabel={cx(styles.labelSelectStyle)}
          />
        </Col>
        <Col span={12}>
          <Input
            readOnly
            {...register('fieldID')}
            label="Field ID"
            isRequired
            className={cx('cssDisabled', styles.disableInput)}
            styleLabel={cx(styles.labelSelectStyle)}
          />
        </Col>
        <Col span={12}>
          <Input
            readOnly
            {...register('defaultLabel')}
            label="Default Label"
            isRequired
            className={cx('cssDisabled', styles.disableInput)}
            styleLabel={cx(styles.labelSelectStyle)}
          />
        </Col>
        <Col span={12}>
          <Input
            readOnly={modal.type === ActionTypeEnum.VIEW}
            {...register('definedLabel')}
            label="User Defined Label"
            isRequired
            className={
              modal.type === ActionTypeEnum.VIEW &&
              cx('cssDisabled', styles.disableInput)
            }
            styleLabel={cx(styles.labelSelectStyle)}
            messageRequired={errors?.definedLabel?.message}
          />
        </Col>
        <Col span={24} className="mt-2">
          <LabelUI label="Description" className="mb-2" />
          <TextAreaForm
            control={control}
            name="description"
            disabled={modal.type === ActionTypeEnum.VIEW}
          />
        </Col>
        {modal.type === ActionTypeEnum.UPDATE && (
          <>
            <Col span={24} className={cx(styles.btnGroupContainer, 'mt-3')}>
              <Button
                className={cx(
                  'me-3',
                  listStyles.buttonFilter,
                  styles.PaddingBlock15,
                )}
                buttonType={ButtonType.CancelOutline}
                onClick={() => {
                  handleCloseModal();
                }}
              >
                <span>Cancel</span>
              </Button>
              <Button
                className={cx(listStyles.buttonFilter, styles.PaddingBlock15)}
                buttonType={ButtonType.Primary}
                onClick={handleSubmit(onSubmitUpdate)}
                loading={internalLoading}
              >
                <span>Save</span>
              </Button>
            </Col>
          </>
        )}
      </Row>
    ),
    [
      control,
      errors?.definedLabel?.message,
      handleCloseModal,
      handleSubmit,
      internalLoading,
      modal.type,
      onSubmitUpdate,
      register,
    ],
  );

  const renderModalSeeList = useMemo(
    () => (
      <ModalComponent
        isOpen={modal.open}
        content={renderContentLabelDetail}
        title={
          <span className={styles.fontWeight600}>Feature Information </span>
        }
        toggle={() => {
          handleCloseModal();
        }}
      />
    ),
    [handleCloseModal, modal.open, renderContentLabelDetail],
  );

  useEffect(() => {
    handleGetList();
  }, [handleGetList]);

  useEffect(() => {
    if (labelDetail) {
      setValue(
        'moduleName',
        labelDetail?.moduleLabelConfigs?.[0]?.module?.defaultLabel || '',
      );
      setValue('fieldID', labelDetail?.id || '');
      setValue('defaultLabel', labelDetail?.defaultLabel || '');
      setValue('definedLabel', labelDetail?.userDefinedLabel || '');
      setValue('description', labelDetail?.description || '');
    }
  }, [labelDetail, setValue]);

  return (
    <div key={uniqueId} className="mt-3">
      <div>
        <Button
          className={styles.btnChart}
          buttonType={
            defaultFilter === LabelListType.LIST
              ? ButtonType.BlueChart
              : ButtonType.CancelOutline
          }
          onClick={() => setDefaultFilter(LabelListType.LIST)}
        >
          List
        </Button>
        <Button
          className={styles.btnChart}
          buttonType={
            defaultFilter === LabelListType.VIEW
              ? ButtonType.BlueChart
              : ButtonType.CancelOutline
          }
          onClick={() => setDefaultFilter(LabelListType.VIEW)}
        >
          View
        </Button>
        <Button
          className={styles.btnChart}
          buttonType={
            defaultFilter === LabelListType.CREATE
              ? ButtonType.BlueChart
              : ButtonType.CancelOutline
          }
          onClick={() => setDefaultFilter(LabelListType.CREATE)}
        >
          Create
        </Button>
        <Button
          className={styles.btnChart}
          buttonType={
            defaultFilter === LabelListType.EDIT
              ? ButtonType.BlueChart
              : ButtonType.CancelOutline
          }
          onClick={() => setDefaultFilter(LabelListType.EDIT)}
        >
          Edit
        </Button>
      </div>

      <AGGridModule
        loading={loading}
        setIsMultiColumnFilter={setIsMultiColumnFilter}
        colDefProp={DEFAULT_COL_DEF_TYPE_FLEX}
        hasRangePicker={false}
        columnDefs={columnDefs}
        dataFilter={null}
        moduleTemplate={MODULE_TEMPLATE.labelOnModuleConfigList}
        fileName="Label Configuration"
        dataTable={listLabelFilter}
        height="500px"
        view={() => true}
        hiddenTemplate={userInfo?.roleScope === RoleScope.SuperAdmin}
        extensions={
          userInfo?.roleScope === RoleScope.SuperAdmin
            ? {
                saveTemplate: false,
                saveAsTemplate: false,
                deleteTemplate: false,
                globalTemplate: false,
              }
            : {}
        }
        getList={handleGetList}
        classNameHeader={listStyles.header}
        params={null}
      />
      {renderModalSeeList}
    </div>
  );
};

export default memo(LabelListTable);
