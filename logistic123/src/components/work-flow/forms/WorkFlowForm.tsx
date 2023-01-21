import { yupResolver } from '@hookform/resolvers/yup';
import images from 'assets/images/images';
import cx from 'classnames';
import { GroupButton } from 'components/ui/button/GroupButton';
import Input from 'components/ui/input/Input';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { getListRolesActions } from 'store/role/role.action';
import SelectUI from 'components/ui/select/Select';
import { MAX_LENGTH_TEXT } from 'constants/common.const';
import {
  WORK_FLOW_TYPE_OPTIONS,
  STATUS_WORK_FLOW,
} from 'constants/filter.const';
import Container from 'components/common/container/Container';

import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import { WorkflowRoleDetail } from 'models/api/work-flow/work-flow.model';
import { FC, useEffect, useMemo, useCallback } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useSelector, useDispatch } from 'react-redux';
import ModalListForm from 'components/react-hook-form/modal-list-form/ModalListForm';
import { Col, Row } from 'reactstrap';
import * as yup from 'yup';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { WORK_FLOW_FIELDS_DETAILS } from 'constants/dynamic/work-flow.const';

import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import styles from './form.module.scss';

export interface DataForm {
  workflowType: string;
  description: string;
  status: string;
  creator: string[];
  approver: string[];
  reviewer: string[];
  publisher: string[];
  reviewer1: string[];
  reviewer2: string[];
  reviewer3: string[];
  reviewer4: string[];
  reviewer5: string[];
  auditor?: string[];
  verification?: string[];
  ownerManager?: string[];
  close_out?: string[];
  isNew?: boolean;
  resetForm?: () => void;
}

interface WorkFlowFormProps {
  isEdit: boolean;
  isCreate?: boolean;
  data: WorkflowRoleDetail;
  onSubmit: (data: DataForm) => void;
  dynamicLabels?: IDynamicLabel;
}

const rowLabels = [
  {
    label: 'checkbox',
    id: 'checkbox',
    width: 80,
  },
  {
    label: 'Name',
    id: 'name',
    width: 710,
  },
];

const defaultValues = {
  workflowType: 'Audit checklist',
  description: '',
  status: 'Published',
  creator: [],
  approver: [],
  reviewer: [],
  publisher: [],
  reviewer1: [],
  reviewer2: [],
  reviewer3: [],
  reviewer4: [],
  reviewer5: [],
  ownerManager: [],
  auditor: [],
  close_out: [],
};

const WorkFlowForm: FC<WorkFlowFormProps> = ({
  isEdit,
  isCreate,
  data,
  onSubmit,
  dynamicLabels,
}) => {
  // state
  const dispatch = useDispatch();

  const { listRoles } = useSelector((state) => state.roleAndPermission);
  const { loading, params } = useSelector((state) => state.workFlow);
  const schema = yup.object().shape({
    workflowType: yup
      .string()
      .trim()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    status: yup
      .string()
      .trim()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    creator: yup
      .array()
      .nullable()
      .min(
        1,
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    ownerManager: yup
      .array()
      .nullable()
      .when('workflowType', {
        is: (value) => ['Planning request'].includes(value),
        then: yup
          .array()
          .nullable()
          .min(
            1,
            renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
        otherwise: yup.array().nullable(),
      }),

    verification: yup
      .array()
      .nullable()
      .when('workflowType', {
        is: (value) => ['CAR/CAP'].includes(value),
        then: yup
          .array()
          .nullable()
          .min(
            1,
            renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
        otherwise: yup.array().nullable(),
      }),
    approver: yup
      .array()
      .nullable()
      .when('workflowType', {
        is: (value) =>
          [
            'Audit checklist',
            'Internal audit report',
            'Planning request',
          ].includes(value),
        then: yup
          .array()
          .nullable()
          .min(
            1,
            renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
        otherwise: yup.array().nullable(),
      }),
    reviewer: yup
      .array()
      .nullable()
      .when('workflowType', {
        is: (value) =>
          !['Internal audit report', 'Planning request'].includes(value),
        then: yup
          .array()
          .nullable()
          .min(
            1,
            renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
        otherwise: yup.array().nullable(),
      }),
    publisher: yup
      .array()
      .nullable()
      .when('workflowType', {
        is: (value) => ['Self assessment'].includes(value),
        then: yup
          .array()
          .nullable()
          .min(
            1,
            renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
        otherwise: yup.array().nullable(),
      }),

    auditor: yup
      .array()
      .nullable()
      .when('workflowType', {
        is: (value) => ['Planning request'].includes(value),
        then: yup
          .array()
          .nullable()
          .min(
            1,
            renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
        otherwise: yup.array().nullable(),
      }),
    close_out: yup
      .array()
      .nullable()
      .when('workflowType', {
        is: (value) => ['Report finding'].includes(value),
        then: yup
          .array()
          .nullable()
          .min(
            1,
            renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
        otherwise: yup.array().nullable(),
      }),

    reviewer1: yup
      .array()
      .nullable()
      .when('workflowType', {
        is: (value) => ['Internal audit report'].includes(value),
        then: yup
          .array()
          .nullable()
          .min(
            1,
            renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['This field is required'],
            ),
          ),
        otherwise: yup.array().nullable(),
      }),
  });

  const {
    register,
    control,
    watch,
    handleSubmit,
    setValue,
    // reset,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const workflowType = watch('workflowType');

  const isShowAuditor = useMemo(
    () => workflowType === 'Planning request',
    [workflowType],
  );

  const isSelfAssessment = useMemo(
    () => workflowType === 'Self assessment',
    [workflowType],
  );

  const isShowApprover = useMemo(
    () =>
      workflowType === 'Audit checklist' || workflowType === 'Planning request',
    [workflowType],
  );

  const isPlanningRequest = useMemo(
    () => workflowType === 'Planning request',
    [workflowType],
  );

  const isShowReviewSub = useMemo(
    () => workflowType === 'Internal audit report',
    [workflowType],
  );

  const isShowCloseOut = useMemo(
    () => workflowType === 'Report finding',
    [workflowType],
  );

  const isVerification = useMemo(
    () => workflowType === 'CAR/CAP',
    [workflowType],
  );

  // Report finding

  const roleOptions = useMemo(
    () =>
      listRoles?.data
        ?.filter((i) => i?.status === 'active')
        ?.map((item) => ({
          id: item.id,
          label: item?.name,
          name: item?.name,
        })) || [],
    [listRoles],
  );

  // function
  // const resetForm = () => {
  //   reset(defaultValues);
  // };

  const onSubmitForm = (data) => {
    let dataSubmit = { ...data };
    if (workflowType !== 'Planning request') {
      dataSubmit = { ...dataSubmit, ownerManager: [] };
    }
    onSubmit(dataSubmit);
  };

  // const handleSubmitAndNew = (data: DataForm) => {
  //   const dataNew: DataForm = { ...data, isNew: true, resetForm };
  //   onSubmit(dataNew);
  // };

  const handleCancel = () => {
    if (!isEdit) {
      history.push(`${AppRouteConst.WORK_FLOW}?${params?.tabKey}`);
    } else {
      showConfirmBase({
        isDelete: false,
        txTitle: renderDynamicLabel(
          dynamicLabels,
          WORK_FLOW_FIELDS_DETAILS['Confirmation?'],
        ),
        txMsg: renderDynamicLabel(
          dynamicLabels,
          WORK_FLOW_FIELDS_DETAILS[
            'Are you sure you want to proceed with this action?'
          ],
        ),
        txButtonLeft: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS.Cancel,
        ),
        txButtonRight: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS.Confirm,
        ),
        onPressButtonRight: () =>
          history.push(`${AppRouteConst.WORK_FLOW}?${params?.tabKey}`),
      });
    }
  };
  const listAdditionalRoles = useMemo(() => {
    const additionalRole = [];
    data?.workflowRoles?.forEach((item) => {
      const existRole = roleOptions?.find((i) => i?.id === item?.roleId);
      if (!existRole) {
        additionalRole.push({
          id: item.roleId,
          label: item?.role?.name,
          name: item?.role?.name,
        });
      }
    }, []);
    return additionalRole;
  }, [data?.workflowRoles, roleOptions]);

  const listRolesOption = useMemo(() => {
    if (listAdditionalRoles?.length) {
      return [...roleOptions, ...listAdditionalRoles];
    }
    return roleOptions || [];
  }, [listAdditionalRoles, roleOptions]);

  // effect
  useEffect(() => {
    if (data) {
      const creator: string[] = [];
      const approver: string[] = [];
      const reviewer: string[] = [];
      const publisher: string[] = [];
      const reviewer1: string[] = [];
      const reviewer2: string[] = [];
      const reviewer3: string[] = [];
      const reviewer4: string[] = [];
      const reviewer5: string[] = [];
      const ownerManager: string[] = [];
      const close_out: string[] = [];
      const auditor: string[] = [];
      const verification: string[] = [];
      if (data?.workflowRoles?.length > 0) {
        data?.workflowRoles?.forEach((item) => {
          switch (item?.permission) {
            case 'creator':
              creator.push(item?.roleId);
              break;
            case 'owner/manager':
              ownerManager.push(item?.roleId);
              break;
            case 'approver':
              approver.push(item?.roleId);
              break;
            case 'close_out':
              close_out.push(item?.roleId);
              break;
            case 'reviewer':
              reviewer.push(item?.roleId);
              break;
            case 'publisher':
              publisher.push(item?.roleId);
              break;
            case 'reviewer1':
              reviewer1.push(item?.roleId);
              break;
            case 'reviewer2':
              reviewer2.push(item?.roleId);
              break;
            case 'reviewer3':
              reviewer3.push(item?.roleId);
              break;
            case 'reviewer4':
              reviewer4.push(item?.roleId);
              break;
            case 'reviewer5':
              reviewer5.push(item?.roleId);
              break;
            case 'auditor':
              auditor.push(item?.roleId);
              break;
            case 'verification':
              verification.push(item?.roleId);
              break;
            default:
          }
        });
      }
      setValue('workflowType', data?.workflowType);
      setValue('description', data?.description);
      setValue('status', data?.status);
      setValue('creator', creator || []);
      setValue('approver', approver || []);
      setValue('reviewer1', reviewer1 || []);
      setValue('reviewer2', reviewer2 || []);
      setValue('reviewer3', reviewer3 || []);
      setValue('reviewer4', reviewer4 || []);
      setValue('reviewer5', reviewer5 || []);
      setValue('ownerManager', ownerManager || []);
      setValue('reviewer', reviewer || []);
      setValue('publisher', publisher || []);
      setValue('close_out', close_out || []);
      setValue('auditor', auditor || []);
      setValue('verification', verification || []);
    }
  }, [data, setValue]);

  useEffect(() => {
    if (isCreate) {
      setValue('workflowType', params?.workflowType);
    }
    dispatch(getListRolesActions.request({ page: 1, pageSize: -1 }));
  }, [dispatch, isCreate, params?.workflowType, setValue]);

  const renderDescription = useCallback(
    (role: string) => (
      <div className={styles.wrapWorkflowDescription}>
        <img
          src={images.icons.icBlueWarning}
          alt="icBlueWarning"
          className={styles.icon}
        />
        <div>
          {renderDynamicLabel(
            dynamicLabels,
            WORK_FLOW_FIELDS_DETAILS[
              'Any users in the group can claim the permission as'
            ],
          )}{' '}
          {role}
        </div>
      </div>
    ),
    [dynamicLabels],
  );

  const convertWorkflowType = useMemo(() => {
    switch (workflowType) {
      case 'Planning request':
        return 'Planning';
      case 'Audit checklist':
        return 'Inspection checklist';
      default:
        return workflowType;
    }
  }, [workflowType]);
  // render
  return loading && !isCreate ? (
    <div className="d-flex justify-content-center">
      <img
        src={images.common.loading}
        className={styles.loading}
        alt="loading"
      />
    </div>
  ) : (
    <Container>
      <div className={styles.container}>
        <Row className="pt-2 mx-0">
          <Col className="p-0 me-3">
            <SelectUI
              labelSelect={renderDynamicLabel(
                dynamicLabels,
                WORK_FLOW_FIELDS_DETAILS['Workflow type'],
              )}
              data={WORK_FLOW_TYPE_OPTIONS}
              disabled={!isCreate || loading}
              name="workflowType"
              className={cx(styles.inputSelect, 'w-100')}
              control={control}
              messageRequired={errors?.vettingRiskScore?.message || ''}
            />
          </Col>
          <Col className="p-0 mx-3">
            <Input
              label={renderDynamicLabel(
                dynamicLabels,
                WORK_FLOW_FIELDS_DETAILS.Description,
              )}
              {...register('description')}
              readOnly={loading || !isEdit}
              disabledCss={loading || !isEdit}
              messageRequired={errors?.description?.message || ''}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                WORK_FLOW_FIELDS_DETAILS['Enter description'],
              )}
              maxLength={MAX_LENGTH_TEXT}
            />
          </Col>
          <Col className="p-0 ms-3">
            <SelectUI
              labelSelect={renderDynamicLabel(
                dynamicLabels,
                WORK_FLOW_FIELDS_DETAILS.Status,
              )}
              data={STATUS_WORK_FLOW}
              disabled
              name="status"
              className={cx(styles.inputSelect, 'w-100')}
              control={control}
              messageRequired={errors?.status?.message || ''}
            />
          </Col>
        </Row>
        <p className={cx('pt-2 mb-0', styles.labelType)}>
          {convertWorkflowType && `${convertWorkflowType}:`}
        </p>
        <Row className={cx(styles.rowWrapper, 'mt-2')}>
          <Col className={cx(styles.colItem)} sm={4}>
            <ModalListForm
              name="creator"
              labelSelect={renderDynamicLabel(
                dynamicLabels,
                WORK_FLOW_FIELDS_DETAILS.Creator,
              )}
              title={renderDynamicLabel(
                dynamicLabels,
                WORK_FLOW_FIELDS_DETAILS.Creator,
              )}
              disable={!isEdit}
              isRequired
              control={control}
              data={listRolesOption}
              rowLabels={rowLabels}
              error={errors?.creator?.message || ''}
              verticalResultClassName={styles.resultBox}
              dynamicLabels={dynamicLabels}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['Please select'],
              )}
            />
            {renderDescription(
              `${workflowType === 'CAR/CAP' ? 'CAP ' : ''}creator`,
            )}
          </Col>
          {isPlanningRequest
            ? null
            : !isShowReviewSub && (
                <Col className={cx(styles.colItem)} sm={4}>
                  <ModalListForm
                    name="reviewer"
                    labelSelect={renderDynamicLabel(
                      dynamicLabels,
                      WORK_FLOW_FIELDS_DETAILS.Reviewer,
                    )}
                    title={renderDynamicLabel(
                      dynamicLabels,
                      WORK_FLOW_FIELDS_DETAILS.Reviewer,
                    )}
                    disable={!isEdit}
                    isRequired
                    control={control}
                    data={listRolesOption}
                    rowLabels={rowLabels}
                    error={errors?.reviewer?.message || ''}
                    verticalResultClassName={styles.resultBox}
                    dynamicLabels={dynamicLabels}
                    placeholder={renderDynamicLabel(
                      dynamicLabels,
                      COMMON_DYNAMIC_FIELDS['Please select'],
                    )}
                  />
                  {renderDescription(
                    `${workflowType === 'CAR/CAP' ? 'CAP ' : ''}reviewer`,
                  )}
                </Col>
              )}
          {isSelfAssessment && (
            <Col className={cx(styles.colItem)} sm={4}>
              <ModalListForm
                name="publisher"
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  WORK_FLOW_FIELDS_DETAILS.Publisher,
                )}
                title={renderDynamicLabel(
                  dynamicLabels,
                  WORK_FLOW_FIELDS_DETAILS.Publisher,
                )}
                disable={!isEdit}
                isRequired
                control={control}
                data={listRolesOption}
                rowLabels={rowLabels}
                error={errors?.publisher?.message || ''}
                verticalResultClassName={styles.resultBox}
                dynamicLabels={dynamicLabels}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Please select'],
                )}
              />
              {renderDescription(
                `${
                  workflowType === 'Self assessment' ? 'Self assessment ' : ''
                }publisher`,
              )}
            </Col>
          )}
          {isShowReviewSub && (
            <Col className={cx(styles.colItem)} sm={4}>
              <ModalListForm
                name="reviewer1"
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  WORK_FLOW_FIELDS_DETAILS['First Reviewer'],
                )}
                title={renderDynamicLabel(
                  dynamicLabels,
                  WORK_FLOW_FIELDS_DETAILS['First Reviewer'],
                )}
                disable={!isEdit}
                isRequired
                control={control}
                data={listRolesOption}
                rowLabels={rowLabels}
                error={errors?.reviewer1?.message || ''}
                verticalResultClassName={styles.resultBox}
                dynamicLabels={dynamicLabels}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Please select'],
                )}
              />
              {renderDescription('first reviewer')}
            </Col>
          )}
          {isShowReviewSub && (
            <Col className={cx(styles.colItem)} sm={4}>
              <ModalListForm
                name="reviewer2"
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  WORK_FLOW_FIELDS_DETAILS['Second Reviewer'],
                )}
                title={renderDynamicLabel(
                  dynamicLabels,
                  WORK_FLOW_FIELDS_DETAILS['Second Reviewer'],
                )}
                disable={!isEdit}
                control={control}
                data={listRolesOption}
                rowLabels={rowLabels}
                verticalResultClassName={styles.resultBox}
                dynamicLabels={dynamicLabels}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Please select'],
                )}
              />
              {renderDescription('second reviewer')}
            </Col>
          )}
          {isShowReviewSub && (
            <Col className={cx(styles.colItem)} sm={4}>
              <ModalListForm
                name="reviewer3"
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  WORK_FLOW_FIELDS_DETAILS['Third Reviewer'],
                )}
                title={renderDynamicLabel(
                  dynamicLabels,
                  WORK_FLOW_FIELDS_DETAILS['Third Reviewer'],
                )}
                disable={!isEdit}
                control={control}
                data={listRolesOption}
                rowLabels={rowLabels}
                error={errors?.reviewer3?.message || ''}
                verticalResultClassName={styles.resultBox}
                dynamicLabels={dynamicLabels}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Please select'],
                )}
              />
              {renderDescription('third reviewer')}
            </Col>
          )}
          {isShowReviewSub && (
            <Col className={cx(styles.colItem)} sm={4}>
              <ModalListForm
                name="reviewer4"
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  WORK_FLOW_FIELDS_DETAILS['Fourth Reviewer'],
                )}
                title={renderDynamicLabel(
                  dynamicLabels,
                  WORK_FLOW_FIELDS_DETAILS['Fourth Reviewer'],
                )}
                disable={!isEdit}
                control={control}
                data={listRolesOption}
                rowLabels={rowLabels}
                verticalResultClassName={styles.resultBox}
                dynamicLabels={dynamicLabels}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Please select'],
                )}
              />
              {renderDescription('fourth reviewer')}
            </Col>
          )}
          {isShowReviewSub && (
            <Col className={cx(styles.colItem)} sm={4}>
              <ModalListForm
                name="reviewer5"
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  WORK_FLOW_FIELDS_DETAILS['Fifth Reviewer'],
                )}
                title={renderDynamicLabel(
                  dynamicLabels,
                  WORK_FLOW_FIELDS_DETAILS['Fifth Reviewer'],
                )}
                disable={!isEdit}
                control={control}
                data={listRolesOption}
                rowLabels={rowLabels}
                verticalResultClassName={styles.resultBox}
                dynamicLabels={dynamicLabels}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Please select'],
                )}
              />
              {renderDescription('fifth reviewer')}
            </Col>
          )}
          {(isShowApprover || isShowReviewSub) && (
            <Col className={cx(styles.colItem)} sm={4}>
              <ModalListForm
                name="approver"
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  WORK_FLOW_FIELDS_DETAILS.Approver,
                )}
                title={renderDynamicLabel(
                  dynamicLabels,
                  WORK_FLOW_FIELDS_DETAILS.Approver,
                )}
                disable={!isEdit}
                isRequired
                control={control}
                data={listRolesOption}
                rowLabels={rowLabels}
                error={errors?.approver?.message || ''}
                verticalResultClassName={styles.resultBox}
                dynamicLabels={dynamicLabels}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Please select'],
                )}
              />
              {renderDescription('approver')}
            </Col>
          )}
          {isShowAuditor && (
            <Col className={cx(styles.colItem)} sm={4}>
              <ModalListForm
                name="auditor"
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  WORK_FLOW_FIELDS_DETAILS.Acceptor,
                )}
                title={renderDynamicLabel(
                  dynamicLabels,
                  WORK_FLOW_FIELDS_DETAILS.Acceptor,
                )}
                disable={!isEdit}
                isRequired
                control={control}
                data={listRolesOption}
                rowLabels={rowLabels}
                error={errors?.auditor?.message || ''}
                verticalResultClassName={styles.resultBox}
                dynamicLabels={dynamicLabels}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Please select'],
                )}
              />
              {renderDescription('acceptor')}
            </Col>
          )}

          {isPlanningRequest && (
            <Col className={cx(styles.colItem)} sm={4}>
              <ModalListForm
                name="ownerManager"
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  WORK_FLOW_FIELDS_DETAILS['Owner/manager'],
                )}
                title={renderDynamicLabel(
                  dynamicLabels,
                  WORK_FLOW_FIELDS_DETAILS['Owner/manager'],
                )}
                disable={!isEdit}
                isRequired
                control={control}
                data={listRolesOption}
                rowLabels={rowLabels}
                error={errors?.ownerManager?.message || ''}
                verticalResultClassName={styles.resultBox}
                dynamicLabels={dynamicLabels}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Please select'],
                )}
              />
              {renderDescription('owner/manager')}
            </Col>
          )}
          {isShowCloseOut && (
            <Col className={cx(styles.colItem)} sm={4}>
              <ModalListForm
                name="close_out"
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  WORK_FLOW_FIELDS_DETAILS['Close out'],
                )}
                title={renderDynamicLabel(
                  dynamicLabels,
                  WORK_FLOW_FIELDS_DETAILS['Close out'],
                )}
                disable={!isEdit}
                isRequired
                control={control}
                data={listRolesOption}
                rowLabels={rowLabels}
                error={errors?.close_out?.message || ''}
                verticalResultClassName={styles.resultBox}
                dynamicLabels={dynamicLabels}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Please select'],
                )}
              />
              {renderDescription('close out')}
            </Col>
          )}

          {isVerification && (
            <Col className={cx(styles.colItem)} sm={4}>
              <ModalListForm
                name="verification"
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  WORK_FLOW_FIELDS_DETAILS['Verification creator'],
                )}
                title={renderDynamicLabel(
                  dynamicLabels,
                  WORK_FLOW_FIELDS_DETAILS['Verification creator'],
                )}
                disable={!isEdit}
                isRequired
                control={control}
                data={listRolesOption}
                rowLabels={rowLabels}
                error={errors?.verification?.message || ''}
                verticalResultClassName={styles.resultBox}
                dynamicLabels={dynamicLabels}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Please select'],
                )}
              />
              {renderDescription('Verification creator')}
            </Col>
          )}
        </Row>
        {isEdit && (
          <GroupButton
            className={styles.footer}
            handleCancel={handleCancel}
            handleSubmit={handleSubmit(onSubmitForm)}
            // handleSubmitAndNew={
            //   isCreate ? handleSubmit(handleSubmitAndNew) : undefined
            // }
            disable={!isEdit || loading}
            dynamicLabels={dynamicLabels}
          />
        )}
      </div>
    </Container>
  );
};

export default WorkFlowForm;
