import cx from 'classnames';
import { FC, useEffect, useMemo, useState } from 'react';
import { Col, Row } from 'reactstrap';
import ToggleSwitch from 'components/ui/toggle-switch/ToggleSwitch';
import Modal, { ModalType } from 'components/ui/modal/Modal';
import SelectUI from 'components/ui/select/Select';
import {
  FillQuestionExtend,
  QuestionChecklist,
} from 'models/api/audit-inspection-workspace/audit-inspection-workspace.model';
import { useSelector, useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { getListSecondCategoryByMainIdActions } from 'store/second-category/second-category.action';
import { DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-workspace.const';
import { useForm, FieldValues } from 'react-hook-form';
import { GroupButton } from 'components/ui/button/GroupButton';
import * as yup from 'yup';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import styles from './modal.module.scss';
import { SubmitParams } from '../TabChecklist/QuestionForm';

interface ModalFindingProps {
  isOpen: boolean;
  required: boolean;
  title: string;
  data: FillQuestionExtend;
  dataChecklist: QuestionChecklist;
  isRemarkRequired?: boolean;
  disabled: boolean;
  isAdd?: boolean;
  toggle?: () => void;
  onSubmitModal: (id: string, params: SubmitParams) => void;
  dynamicLabels?: IDynamicLabel;
  w?: string | number;
  h?: string | number;
}
const defaultValues = {
  auditTypeId: undefined,
  natureFindingId: undefined,
  mainCategoryId: undefined,
  isSignificant: false,
  secondCategoryId: undefined,
  thirdCategoryId: undefined,
  rectifiedOnBoard: false,
};

const ModalReportOfFinding: FC<ModalFindingProps> = ({
  isOpen,
  toggle,
  data,
  required,
  title,
  disabled,
  isRemarkRequired,
  dataChecklist,
  onSubmitModal,
  w,
  h,
  dynamicLabels,
}) => {
  const schema = useMemo(
    () =>
      yup.object().shape({
        auditTypeId:
          required &&
          yup
            .string()
            .trim()
            .nullable()
            .required(
              renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['This field is required'],
              ),
            ),
        natureFindingId:
          required &&
          yup
            .string()
            .trim()
            .nullable()
            .required(
              renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['This field is required'],
              ),
            ),
        mainCategoryId:
          required &&
          yup
            .string()
            .trim()
            .nullable()
            .required(
              renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['This field is required'],
              ),
            ),
      }),
    [dynamicLabels, required],
  );

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });
  const mainCategoryIdWatch = watch('mainCategoryId');

  const close = () => {
    reset();
    toggle();
  };
  const dispatch = useDispatch();

  const { listAuditTypes } = useSelector((state) => state.auditType);
  const { auditInspectionWorkspaceDetail } = useSelector(
    (state) => state.auditInspectionWorkspace,
  );

  const { listMainCategories } = useSelector((state) => state.mainCategory);
  const { listSecondCategories } = useSelector((state) => state.secondCategory);
  const { listThirdCategories } = useSelector((state) => state.thirdCategory);
  const { listNatureOfFindingsMaster } = useSelector(
    (state) => state.natureOfFindingsMaster,
  );
  const [isFirstLoadingCategory, setIsSecondLoadingCategory] = useState(true);

  const optionDataAuditTypes = useMemo(
    () =>
      listAuditTypes?.data?.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    [listAuditTypes],
  );
  const optionDataMainCategories = useMemo(
    () =>
      listMainCategories?.data.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    [listMainCategories],
  );
  const optionDataSecondCategories = useMemo(
    () =>
      listSecondCategories?.data.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    [listSecondCategories],
  );
  const optionDataThirdCategories = useMemo(
    () =>
      listThirdCategories?.data.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    [listThirdCategories],
  );

  const optionDataNatureOfFindings = useMemo(() => {
    const filterFindingList = listNatureOfFindingsMaster?.data?.filter((item) =>
      auditInspectionWorkspaceDetail?.natureFindings?.includes(item?.id),
    );
    return filterFindingList?.map((item) => ({
      value: item.id,
      label: item.name,
    }));
  }, [listNatureOfFindingsMaster, auditInspectionWorkspaceDetail]);

  const thirdCategoryIdData = useMemo(
    () =>
      dataChecklist?.chkQuestion?.referencesCategoryData?.find(
        (item) => item.masterTableId === 'third-category',
      ),
    [dataChecklist],
  );

  const secondCategoryIdData = useMemo(
    () =>
      dataChecklist?.chkQuestion?.referencesCategoryData?.find(
        (item) => item.masterTableId === 'second-category',
      ),
    [dataChecklist],
  );

  const onSubmitForm = (dataForm) => {
    onSubmitModal(data.id, dataForm);
    close();
  };

  useEffect(() => {
    if (mainCategoryIdWatch?.length > 0) {
      dispatch(
        getListSecondCategoryByMainIdActions.request({
          pageSize: -1,
          mainCategoryId: mainCategoryIdWatch?.toString(),
          status: 'active',
        }),
      );
    }

    if (!isFirstLoadingCategory) {
      setValue('secondCategoryId', null);
    }
    setIsSecondLoadingCategory(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainCategoryIdWatch]);

  useEffect(() => {
    if (data && isOpen) {
      setValue(
        'auditTypeId',
        data?.reportFindingItem?.auditTypeId || undefined,
      );
      setValue(
        'natureFindingId',
        data?.reportFindingItem?.natureFindingId || undefined,
      );
      setValue(
        'mainCategoryId',
        dataChecklist?.chkQuestion?.mainCategoryId || undefined,
      );

      setValue(
        'secondCategoryId',
        secondCategoryIdData?.valueId ||
          data?.reportFindingItem?.secondCategoryId ||
          undefined,
      );
      setValue(
        'thirdCategoryId',
        thirdCategoryIdData?.valueId ||
          data?.reportFindingItem?.thirdCategoryId ||
          undefined,
      );
      setValue(
        'isSignificant',
        data?.reportFindingItem?.isSignificant || false,
      );
      setValue(
        'rectifiedOnBoard',
        data?.reportFindingItem?.rectifiedOnBoard || false,
      );

      if (dataChecklist?.chkQuestion?.mainCategoryId) {
        dispatch(
          getListSecondCategoryByMainIdActions.request({
            pageSize: -1,
            mainCategoryId: dataChecklist?.chkQuestion?.mainCategoryId,
            status: 'active',
          }),
        );
      }
    } else {
      setIsSecondLoadingCategory(true);
    }
  }, [
    data,
    setValue,
    listNatureOfFindingsMaster,
    secondCategoryIdData,
    thirdCategoryIdData,
    dataChecklist,
    isOpen,
    dispatch,
  ]);

  return (
    <Modal
      isOpen={isOpen}
      title={title}
      toggle={close}
      content={
        <div className={cx(styles.contentWrapper)}>
          <Row className="pt-2 mx-0">
            <Col className={cx('pe-3 w-50 m-0 ps-0')}>
              <SelectUI
                control={control}
                name="auditTypeId"
                isRequired={required}
                messageRequired={errors?.auditTypeId?.message || undefined}
                data={optionDataAuditTypes}
                disabled={disabled}
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS[
                    'Checklist information'
                  ]['Inspection type'],
                )}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Please select'],
                )}
                className={cx(
                  styles.inputSelect,
                  styles.disabledSelect,
                  'w-100',
                )}
              />
            </Col>
            <Col className={cx('ps-3 w-50 m-0 pe-0')}>
              <SelectUI
                isRequired={required}
                control={control}
                name="natureFindingId"
                messageRequired={errors?.natureFindingId?.message || undefined}
                disabled={disabled}
                data={optionDataNatureOfFindings}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Please select'],
                )}
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS[
                    'Checklist information'
                  ]['Findings type'],
                )}
                className={cx(
                  styles.inputSelect,
                  styles.disabledSelect,
                  'w-100',
                )}
              />
            </Col>
          </Row>
          <Row className="pt-2  mx-0 d-flex align-items-center">
            <Col md={3} className="ps-0">
              <ToggleSwitch
                disabled={disabled}
                control={control}
                name="isSignificant"
                label={renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS[
                    'Checklist information'
                  ]['Is significant'],
                )}
              />
            </Col>
            <Col className="pr-3" md={3}>
              {isRemarkRequired && (
                <ToggleSwitch
                  disabled={disabled}
                  control={control}
                  name="rectifiedOnBoard"
                  label={renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS[
                      'Checklist information'
                    ]['Rectified on board'],
                  )}
                />
              )}
            </Col>
            <Col className="ps-3 pe-0" md={6}>
              <SelectUI
                control={control}
                name="mainCategoryId"
                messageRequired={errors?.mainCategoryId?.message || undefined}
                disabled={disabled}
                data={optionDataMainCategories}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Please select'],
                )}
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS[
                    'Checklist information'
                  ]['Main category'],
                )}
                className={cx(
                  styles.inputSelect,
                  styles.disabledSelect,
                  'w-100',
                )}
                onChange={() => {}}
              />
            </Col>
          </Row>
          <Row className="pt-2 mx-0">
            {secondCategoryIdData?.valueId && (
              <Col md={6} className={cx('pe-3 w-50 m-0 ps-0')}>
                <SelectUI
                  control={control}
                  name="secondCategoryId"
                  messageRequired={
                    errors?.secondCategoryId?.message || undefined
                  }
                  disabled={disabled}
                  data={optionDataSecondCategories}
                  labelSelect={renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS[
                      'Checklist information'
                    ]['Second category'],
                  )}
                  placeholder={renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS['Please select'],
                  )}
                  className={cx(
                    styles.inputSelect,
                    styles.disabledSelect,
                    'w-100',
                  )}
                />
              </Col>
            )}
            <Col
              md={6}
              className={
                secondCategoryIdData?.valueId
                  ? cx('ps-3 w-50 m-0 pe-0')
                  : cx('pe-3 w-50 m-0 ps-0')
              }
            >
              <SelectUI
                control={control}
                name="thirdCategoryId"
                messageRequired={errors?.thirdCategoryId?.message || undefined}
                data={optionDataThirdCategories}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Please select'],
                )}
                disabled={disabled}
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS[
                    'Checklist information'
                  ]['Third category'],
                )}
                className={cx(
                  styles.inputSelect,
                  styles.disabledSelect,
                  'w-100',
                )}
              />
            </Col>
          </Row>
          {!disabled && (
            <GroupButton
              className={cx('pt-2')}
              handleCancel={close}
              dynamicLabels={dynamicLabels}
              handleSubmit={handleSubmit(onSubmitForm)}
              handleSubmitAndNew={undefined}
            />
          )}
        </div>
      }
      w={800}
      modalType={ModalType.CENTER}
    />
  );
};

export default ModalReportOfFinding;
