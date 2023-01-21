import cx from 'classnames';
import { FC, useEffect, useMemo, useState } from 'react';
import { Col, Row } from 'reactstrap';
import Input from 'components/ui/input/Input';
import { getListSecondCategoryByMainIdActions } from 'store/second-category/second-category.action';
import { AuditInspectionWorkspaceSummaryResponse } from 'models/api/audit-inspection-workspace/audit-inspection-workspace.model';
import ToggleSwitch from 'components/ui/toggle-switch/ToggleSwitch';
import Modal, { ModalType } from 'components/ui/modal/Modal';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-workspace.const';
import SelectUI from 'components/ui/select/Select';
import { yupResolver } from '@hookform/resolvers/yup';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { useForm, FieldValues } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { GroupButton } from 'components/ui/button/GroupButton';
import * as yup from 'yup';

import styles from './modal.module.scss';

interface ModalFindingProps {
  isOpen: boolean;
  title: string;
  disabled?: boolean;
  data: AuditInspectionWorkspaceSummaryResponse;
  toggle?: () => void;
  onSubmit: (onSubmit) => void;
  w?: string | number;
  h?: string | number;
  dynamicLabels?: IDynamicLabel;
}

const defaultValues = {
  auditTypeId: '',
  natureFindingId: '',
  mainCategoryId: '',
  isSignificant: false,
  rectifiedOnBoard: false,
  secondCategoryId: '',
  thirdCategoryId: '',
  findingComment: '',
};

const ModalFinding: FC<ModalFindingProps> = ({
  isOpen,
  toggle,
  title,
  data,
  disabled,
  onSubmit,
  w,
  h,
  dynamicLabels,
}) => {
  const dispatch = useDispatch();
  const schema = yup.object().shape({
    auditTypeId: yup
      .string()
      .trim()
      .nullable()
      .required('This field is required'),
    natureFindingId: yup
      .string()
      .trim()
      .nullable()
      .required('This field is required'),
  });

  const {
    control,
    handleSubmit,
    register,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });
  const watchMainCategoryId = watch('mainCategoryId');

  const [touchedFields, setTouchedFields] = useState<any>({});

  const { listAuditTypes } = useSelector((state) => state.auditType);
  const { listMainCategories } = useSelector((state) => state.mainCategory);
  const { listSecondCategories } = useSelector((state) => state.secondCategory);
  const { listThirdCategories } = useSelector((state) => state.thirdCategory);
  const { listNatureOfFindingsMaster } = useSelector(
    (state) => state.natureOfFindingsMaster,
  );

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
      listMainCategories?.data?.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    [listMainCategories],
  );
  const optionDataSecondCategories = useMemo(
    () =>
      listSecondCategories?.data?.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    [listSecondCategories],
  );
  const optionDataThirdCategories = useMemo(
    () =>
      listThirdCategories?.data?.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    [listThirdCategories],
  );

  const optionDataNatureOfFindings = useMemo(
    () =>
      listNatureOfFindingsMaster?.data?.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    [listNatureOfFindingsMaster],
  );

  const close = () => {
    reset();
    toggle();
  };

  const onSubmitForm = (dataForm) => {
    const { isSignificant, rectifiedOnBoard, ...other } = dataForm;
    let result = {};
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(other)) {
      if (value) {
        result = { ...result, [key]: value };
      }
    }
    onSubmit({ ...result, isSignificant, rectifiedOnBoard, id: data.id });
    close();
  };

  useEffect(() => {
    if (data && isOpen) {
      setValue('auditTypeId', data?.auditTypeId || '');
      setValue('natureFindingId', data?.natureFindingId || '');
      setValue('mainCategoryId', data?.mainCategoryId || '');
      setValue('secondCategoryId', data?.secondCategoryId || '');
      setValue('thirdCategoryId', data?.thirdCategoryId || '');
      setValue('isSignificant', data?.isSignificant || false);
      setValue('rectifiedOnBoard', data?.rectifiedOnBoard || false);
      setValue('findingComment', data?.findingComment || false);
    }
  }, [data, setValue, isOpen]);

  useEffect(() => {
    if (watchMainCategoryId?.length && touchedFields?.mainCategoryId) {
      dispatch(
        getListSecondCategoryByMainIdActions.request({
          pageSize: -1,
          mainCategoryId: watchMainCategoryId?.toString(),
          status: 'active',
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchMainCategoryId]);

  return (
    <Modal
      isOpen={isOpen}
      title={title}
      toggle={close}
      content={
        <div className={cx(styles.contentWrapper)}>
          <Input
            label={renderDynamicLabel(
              dynamicLabels,
              DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary']
                .Question,
            )}
            className={cx(styles.disabledInput)}
            disabled
            value={data?.chkQuestion?.question}
          />
          <Row className="pt-2">
            <Col>
              <Input
                label={renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary']
                    .Reference,
                )}
                className={cx(styles.disabledInput)}
                disabled
                value={data?.reference}
              />
            </Col>
            <Col
              className={cx(
                'd-flex justify-content-between',
                styles.toggleSwitch,
              )}
            >
              <ToggleSwitch
                control={control}
                name="isSignificant"
                disabled={disabled}
                label={renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
                    'Is significant'
                  ],
                )}
              />
              <ToggleSwitch
                disabled={disabled}
                control={control}
                name="rectifiedOnBoard"
                label={renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
                    'Rectified on board'
                  ],
                )}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={6} className={cx('pt-2')}>
              <SelectUI
                data={optionDataAuditTypes}
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
                    'Inspection type'
                  ],
                )}
                name="auditTypeId"
                messageRequired={errors?.auditTypeId?.message || ''}
                isRequired
                disabled={disabled}
                className={cx(
                  styles.inputSelect,
                  styles.disabledSelect,
                  'w-100',
                )}
                control={control}
              />
            </Col>
            <Col xs={6} className={cx('pt-2')}>
              <SelectUI
                data={optionDataNatureOfFindings}
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
                    'Finding type'
                  ],
                )}
                isRequired
                name="natureFindingId"
                messageRequired={errors?.natureFindingId?.message || ''}
                disabled={disabled}
                control={control}
                className={cx(
                  styles.inputSelect,
                  styles.disabledSelect,
                  'w-100',
                )}
              />
            </Col>
            <Col xs={6} className={cx('pt-2')}>
              <SelectUI
                data={optionDataMainCategories}
                control={control}
                name="mainCategoryId"
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
                    'Main category'
                  ],
                )}
                disabled={disabled}
                onChange={(e) => {
                  setValue('mainCategoryId', e);
                  setTouchedFields((prev) => ({
                    ...prev,
                    mainCategoryId: true,
                  }));
                }}
                className={cx(
                  styles.inputSelect,
                  styles.disabledSelect,
                  'w-100',
                )}
              />
            </Col>

            {data?.ref?.second_category?.secondCategory && (
              <Col xs={6} className={cx('pt-2')}>
                <SelectUI
                  data={optionDataSecondCategories}
                  labelSelect={renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS[
                      'Finding summary'
                    ]['Second category'],
                  )}
                  control={control}
                  name="secondCategoryId"
                  disabled={disabled}
                  className={cx(
                    styles.inputSelect,
                    styles.disabledSelect,
                    'w-100',
                  )}
                />
              </Col>
            )}
            <Col xs={6} className={cx('pt-2')}>
              <SelectUI
                data={optionDataThirdCategories}
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary'][
                    'Third category'
                  ],
                )}
                disabled={disabled}
                control={control}
                name="thirdCategoryId"
                className={cx(
                  styles.inputSelect,
                  styles.disabledSelect,
                  'w-100',
                )}
              />
            </Col>
            <Col xs={6} className={cx('pt-2')}>
              <Input
                isRequired
                label={renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Finding summary']
                    .Finding,
                )}
                className={cx(styles.disabledInput)}
                disabled={disabled}
                {...register('findingComment')}
              />
            </Col>
          </Row>

          {!disabled && (
            <GroupButton
              className={cx('pt-2')}
              dynamicLabels={dynamicLabels}
              handleCancel={close}
              handleSubmit={handleSubmit(onSubmitForm)}
              handleSubmitAndNew={undefined}
            />
          )}
        </div>
      }
      w={800}
      modalType={ModalType.NORMAL}
    />
  );
};

export default ModalFinding;
