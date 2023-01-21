import cx from 'classnames';
import { FC, useEffect, useMemo, useState, useCallback } from 'react';
import { ButtonType } from 'components/ui/button/Button';
import { useTranslation } from 'react-i18next';
import { I18nNamespace } from 'constants/i18n.const';
import ModalComponent, { ModalType } from 'components/ui/modal/Modal';
import { Col, Row } from 'reactstrap';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { MaxLength } from 'constants/common.const';
import Input from 'components/ui/input/Input';
import { GroupButton } from 'components/ui/button/GroupButton';
import { useDispatch, useSelector } from 'react-redux';
import SelectUI from 'components/ui/select/Select';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import {
  ReportOfFindingItems,
  ReportOfFinding,
} from 'models/api/report-of-finding/report-of-finding.model';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS } from 'constants/dynamic/report-of-finding.const';
import ToggleSwitch from 'components/ui/toggle-switch/ToggleSwitch';
import { TableAttachment } from 'components/common/table-attachment/TableAttachment';
import { getListSecondCategoryByMainIdActions } from 'store/second-category/second-category.action';
import { getListFileActions } from 'store/dms/dms.action';
import styles from '../form.module.scss';

interface ModalInputFieldsProps {
  data?: ReportOfFinding;
  handleAdd?: (data) => void;
  handleEdit?: (data, selectedIndex) => void;
  loading?: boolean;
  isAdd?: boolean;
  isCreate?: boolean;
  selectedData?: ReportOfFindingItems;
  selectedIndex?: number;
  isOpen?: boolean;
  setIsVisibleModalInputFields?: (value: boolean) => void;
  title?: string;
  isEdit?: boolean;
  toggle?: () => void;
  isView?: boolean;
  dynamicLabels?: IDynamicLabel;
}

const defaultValues = {
  isSignificant: false,
};

export const ModalInputFields: FC<ModalInputFieldsProps> = (props) => {
  const {
    data,
    handleAdd,
    selectedData,
    loading,
    isOpen,
    isEdit,
    toggle,
    handleEdit,
    selectedIndex,
    setIsVisibleModalInputFields,
    title,
    isView,
    dynamicLabels,
  } = props;

  const { t } = useTranslation([
    I18nNamespace.PLANNING_AND_REQUEST,
    I18nNamespace.REPORT_OF_FINDING,
    I18nNamespace.COMMON,
  ]);
  const dispatch = useDispatch();
  const { listAuditTypes } = useSelector((state) => state.auditType);
  const { listVIQs } = useSelector((state) => state.viq);
  const { listNatureOfFindings } = useSelector(
    (state) => state.inspectionMapping,
  );
  const { listDepartmentMaster } = useSelector(
    (state) => state.departmentMaster,
  );
  const { listMainCategories } = useSelector((state) => state.mainCategory);
  const { listSecondCategories } = useSelector((state) => state.secondCategory);

  const [isFirstLoadingCategory, setIsSecondLoadingCategory] = useState(true);

  const schema = yup.object().shape({
    reference: yup.string().nullable().trim().required(t('errors.required')),
    auditTypeId: yup.string().nullable().trim().required(t('errors.required')),
    natureFindingId: yup
      .string()
      .nullable()
      .trim()
      .required(t('errors.required')),
    isSignificant: yup.string().trim().nullable(),
    departmentId: yup.string().nullable(),
    mainCategoryId: yup.string().nullable(),
    secondCategoryId: yup.string().nullable(),
    findingComment: yup
      .string()
      .nullable()
      .trim()
      .required(t('errors.required')),
    findingRemark: yup.string().nullable(),
  });

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    watch,
  } = useForm<FieldValues>({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const mainCategoryIdWatch = watch('mainCategoryId');
  useEffect(() => {
    if (mainCategoryIdWatch?.length) {
      dispatch(
        getListSecondCategoryByMainIdActions.request({
          pageSize: -1,
          mainCategoryId: mainCategoryIdWatch?.toString(),
          status: 'active',
        }),
      );
    }
    if (
      (selectedData && mainCategoryIdWatch && !isFirstLoadingCategory) ||
      !selectedData
    ) {
      setValue('secondCategoryId', null);
    }

    if (selectedData && mainCategoryIdWatch && isFirstLoadingCategory) {
      setIsSecondLoadingCategory(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainCategoryIdWatch]);

  const listOptionAuditType = useMemo(() => {
    const duplicateData = data?.rofAuditTypes?.find(
      (item) => item.auditTypeId === selectedData?.auditTypeId,
    );
    if (selectedData?.auditTypeId && !duplicateData) {
      const additionalAudiType = listAuditTypes?.data?.find(
        (item) => item.id === selectedData?.auditTypeId,
      );
      if (additionalAudiType) {
        return data?.rofAuditTypes
          ?.map((item) => ({
            value: item?.auditTypeId,
            label: item?.auditTypeName,
          }))
          ?.concat({
            label: additionalAudiType.name,
            value: additionalAudiType.id,
          });
      }
      return data?.rofAuditTypes?.map((item) => ({
        value: item?.auditTypeId,
        label: item?.auditTypeName,
      }));
    }
    return data?.rofAuditTypes?.map((item) => ({
      value: item?.auditTypeId,
      label: item?.auditTypeName,
    }));
  }, [data, selectedData, listAuditTypes]);
  const optionDataNatureOfFindings = useMemo(
    () =>
      listNatureOfFindings?.data?.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    [listNatureOfFindings],
  );

  const optionListDepartment = useMemo(
    () =>
      listDepartmentMaster?.data
        ?.filter((i) => i?.status === 'active')
        ?.map((item) => ({
          value: item.id,
          label: item.name,
        })),
    [listDepartmentMaster],
  );
  const optionListMainCategory = useMemo(
    () =>
      listMainCategories?.data
        ?.filter((i) => i?.status === 'active')
        ?.map((item) => ({
          value: item.id,
          label: item.name,
        })),
    [listMainCategories],
  );

  const optionListSecondCategory = useMemo(
    () =>
      listSecondCategories?.data?.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    [listSecondCategories],
  );

  const optionListVIQ = useMemo(
    () =>
      listVIQs?.data?.map((item) => ({
        value: item.id,
        label: item.refNo,
      })),
    [listVIQs],
  );

  const handleAddItem = useCallback(
    (formData) => {
      const newAttachment = formData?.findingAttachments?.length
        ? formData?.findingAttachments?.map((i) => i?.id || i)
        : [];
      const natureFindingName =
        optionDataNatureOfFindings.find(
          (item) => item.value === formData?.natureFindingId,
        )?.label || '';
      const newData = {
        ...formData,
        id: selectedData?.id || null,
        isSignificant: formData?.isSignificant === 'true',
        findingAttachments: newAttachment,
        natureFindingName,
      };

      if (!selectedData) {
        handleAdd(newData);
      } else {
        handleEdit(newData, selectedIndex);
      }
      reset();
      toggle();
      setIsVisibleModalInputFields(false);
    },
    [
      handleAdd,
      handleEdit,
      optionDataNatureOfFindings,
      reset,
      selectedData,
      selectedIndex,
      setIsVisibleModalInputFields,
      toggle,
    ],
  );

  const onSubmitForm = useCallback(
    (formData) => {
      // if exist car when change natureFinding => show message
      if (
        selectedData?.carId &&
        selectedData?.natureFindingName === 'Non Conformity' &&
        selectedData?.natureFindingId !== formData.natureFindingId
      ) {
        showConfirmBase({
          txTitle: 'Confirm',
          txMsg:
            'The CAR will be removed if you update the finding type from non-conformity to other finding types. Are you sure to update the finding type from the non-conformity to other finding types?',
          onPressButtonRight: () => handleAddItem(formData),
        });
        return;
      }
      handleAddItem(formData);
    },
    [
      handleAddItem,
      selectedData?.carId,
      selectedData?.natureFindingId,
      selectedData?.natureFindingName,
    ],
  );

  useEffect(() => {
    if (selectedData && isOpen) {
      setValue('auditTypeId', selectedData?.auditTypeId);
      setValue('natureFindingId', selectedData?.natureFindingId);
      setValue('reference', selectedData?.reference || 'N/A');
      setValue('isSignificant', selectedData?.isSignificant || false);
      setValue('rectifiedOnBoard', selectedData?.rectifiedOnBoard || false);
      setValue('departmentId', selectedData?.departmentId || null);
      setValue('mainCategoryId', selectedData?.mainCategoryId || null);
      setValue('secondCategoryId', selectedData?.secondCategoryId || null);
      setValue(
        'viqId',
        selectedData?.viqId ||
          selectedData?.chkQuestion?.referencesCategoryData?.[0]?.valueId ||
          null,
      );
      setValue('findingComment', selectedData?.findingComment || null);
      setValue('findingRemark', selectedData?.findingRemark || null);
      setValue('findingAttachments', selectedData?.findingAttachments || null);
    } else {
      setValue('auditTypeId', null);
      setValue('natureFindingId', null);
      setValue('reference', null);
      setValue('rectifiedOnBoard', false);
      setValue('rectifiedOnBoard', false);
      setValue('isSignificant', false);
      setValue('departmentId', data?.departmentId || null);
      setValue('mainCategoryId', null);
      setValue('secondCategoryId', null);
      setValue('viqId', null);
      setValue('findingComment', null);
      setValue('findingRemark', null);
      setValue('findingAttachments', []);
    }
  }, [selectedData, setValue, data, isOpen]);

  useEffect(() => {
    if (!isOpen) {
      setValue('auditTypeId', null);
      setValue('natureFindingId', null);
      setValue('reference', null);
      setValue('rectifiedOnBoard', false);
      setValue('isSignificant', false);
      setValue('departmentId', null);
      setValue('mainCategoryId', null);
      setValue('secondCategoryId', null);
      setValue('viqId', null);
      setValue('findingComment', null);
      setValue('findingRemark', null);
      setValue('findingAttachments', []);
      setIsSecondLoadingCategory(true);
      // dispatch(
      //   getListSecondCategoryActions.request({
      //     pageSize: -1,
      //     companyId: userInfo?.mainCompanyId,
      //   }),
      // );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && selectedData?.findingAttachments?.length > 0) {
      dispatch(
        getListFileActions.request({
          ids: selectedData?.findingAttachments,
        }),
      );
      setValue('findingAttachments', selectedData?.findingAttachments);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const hideViqAutogenerate = useMemo(() => {
    if (
      selectedData?.chkQuestionId &&
      !selectedData?.viqId &&
      !selectedData?.chkQuestion?.referencesCategoryData?.[0]?.valueId
    ) {
      return true;
    }
    return false;
  }, [
    selectedData?.chkQuestion?.referencesCategoryData,
    selectedData?.chkQuestionId,
    selectedData?.viqId,
  ]);

  const hideSecondCategoryAutogenerate = useMemo(() => {
    if (selectedData?.chkQuestionId && !selectedData?.secondCategoryId) {
      return true;
    }
    return false;
  }, [selectedData?.chkQuestionId, selectedData?.secondCategoryId]);

  const renderForm = () => (
    <div className={styles.wrapContentModalScroll}>
      <div
        style={{
          marginLeft: -10,
          marginRight: -10,
        }}
      >
        <Row className=" mx-0">
          <Col>
            <Input
              isRequired
              label={renderDynamicLabel(
                dynamicLabels,
                DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Reference number'],
              )}
              {...register('reference')}
              disabled={loading || isView}
              maxLength={MaxLength.MAX_LENGTH_OPTIONAL}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Enter reference'],
              )}
              messageRequired={errors?.reference?.message || ''}
            />
          </Col>
          <Col>
            <SelectUI
              data={listOptionAuditType}
              labelSelect={renderDynamicLabel(
                dynamicLabels,
                DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Inspection type'],
              )}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Please select'],
              )}
              control={control}
              name="auditTypeId"
              disabled={loading || isView}
              isRequired
              className={cx(styles.inputSelect, styles.disabledSelect, 'w-100')}
              messageRequired={errors?.auditTypeId?.message || ''}
            />
          </Col>
        </Row>
        <Row className="pt-4 mx-0">
          <Col md={6}>
            <SelectUI
              data={optionDataNatureOfFindings}
              labelSelect={renderDynamicLabel(
                dynamicLabels,
                DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Findings type'],
              )}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Please select'],
              )}
              control={control}
              name="natureFindingId"
              disabled={loading || isView}
              isRequired
              className={cx(styles.inputSelect, styles.disabledSelect, 'w-100')}
              messageRequired={errors?.natureFindingId?.message || ''}
            />
          </Col>
          <Col className={cx('pe-0', styles.toggleSwitch)} md={3}>
            <ToggleSwitch
              label={renderDynamicLabel(
                dynamicLabels,
                DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Is significant'],
              )}
              disabled={loading || isView}
              control={control}
              name="isSignificant"
            />
          </Col>
          <Col className={cx(styles.toggleSwitch)} md={3}>
            <ToggleSwitch
              disabled={loading || isView}
              control={control}
              name="rectifiedOnBoard"
              label={renderDynamicLabel(
                dynamicLabels,
                DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Rectified on board'],
              )}
            />
          </Col>
        </Row>
        <Row className="pt-4 mx-0">
          <Col>
            <SelectUI
              data={optionListDepartment}
              labelSelect={renderDynamicLabel(
                dynamicLabels,
                DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS.Department,
              )}
              // isRequired
              disabled={loading || isView}
              control={control}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Please select'],
              )}
              name="departmentId"
              className={cx(styles.inputSelect, styles.disabledSelect, 'w-100')}
            />
          </Col>
          <Col>
            <SelectUI
              data={optionListMainCategory}
              // isRequired
              disabled={loading || isView}
              labelSelect={renderDynamicLabel(
                dynamicLabels,
                DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Main category'],
              )}
              control={control}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Please select'],
              )}
              name="mainCategoryId"
              className={cx(styles.inputSelect, styles.disabledSelect, 'w-100')}
            />
          </Col>
        </Row>

        <Row className="pt-4 mx-0">
          {!hideSecondCategoryAutogenerate && (
            <Col>
              <SelectUI
                data={optionListSecondCategory}
                disabled={loading || isView}
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Second category'],
                )}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Please select'],
                )}
                control={control}
                name="secondCategoryId"
                className={cx(
                  styles.inputSelect,
                  styles.disabledSelect,
                  'w-100',
                )}
              />
            </Col>
          )}
          {!hideViqAutogenerate && (
            <Col>
              <SelectUI
                data={optionListVIQ}
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['VIQ category'],
                )}
                control={control}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Please select'],
                )}
                disabled={loading || isView}
                name="viqId"
                className={cx(
                  styles.inputSelect,
                  styles.disabledSelect,
                  'w-100',
                )}
                messageRequired={errors?.viqId?.message || ''}
              />
            </Col>
          )}
        </Row>

        <Row className="pt-4 mx-0">
          <Col>
            <Input
              label={renderDynamicLabel(
                dynamicLabels,
                DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS.Findings,
              )}
              name="findingComment"
              disabled={isView || loading}
              isRequired
              {...register('findingComment')}
              maxLength={MaxLength.MAX_LENGTH_OPTIONAL}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Enter findings'],
              )}
              messageRequired={errors?.findingComment?.message || ''}
            />
          </Col>
        </Row>
        <Row className="pt-4 mx-0">
          <Col>
            <Input
              label={renderDynamicLabel(
                dynamicLabels,
                DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Findings remarks'],
              )}
              {...register('findingRemark')}
              disabled={isView || loading}
              name="findingRemark"
              maxLength={MaxLength.MAX_LENGTH_OPTIONAL}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS[
                  'Enter findings remarks'
                ],
              )}
            />
          </Col>
        </Row>
      </div>
      {/* <hr /> */}
      <Controller
        control={control}
        name="findingAttachments"
        render={({ field }) => (
          <TableAttachment
            featurePage={Features.AUDIT_INSPECTION}
            subFeaturePage={SubFeatures.REPORT_OF_FINDING}
            loading={false}
            isEdit={!isEdit}
            disable={isView || loading}
            value={field.value}
            onchange={field.onChange}
            dynamicLabels={dynamicLabels}
          />
        )}
      />
    </div>
  );

  const renderFooter = () => (
    <>
      <div>
        <GroupButton
          className={cx(styles.GroupButton, 'mt-4 justify-content-end')}
          buttonTypeLeft={ButtonType.OutlineGray}
          disable={isView || loading}
          handleCancel={() => {
            setIsVisibleModalInputFields(false);
            toggle();
            reset();
          }}
          dynamicLabels={dynamicLabels}
          handleSubmit={handleSubmit(onSubmitForm)}
        />
      </div>
    </>
  );

  return (
    <ModalComponent
      isOpen={isOpen}
      toggle={() => {
        setIsVisibleModalInputFields(false);
        toggle();
        reset();
      }}
      title={title}
      content={renderForm()}
      footer={renderFooter()}
      modalType={ModalType.CENTER}
    />
  );
};
