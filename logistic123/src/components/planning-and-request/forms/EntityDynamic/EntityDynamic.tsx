import { FC, useMemo } from 'react';
import cx from 'classnames';
import AsyncSelectForm from 'components/react-hook-form/async-select/AsyncSelectForm';
import { NewAsyncOptions } from 'components/ui/async-select/NewAsyncSelect';
import SelectUI from 'components/ui/select/Select';
import { ENTITY_OPTIONS } from 'constants/filter.const';
import { PlanningAndRequest } from 'models/api/planning-and-request/planning-and-request.model';
import { EntityType } from 'models/common.model';
import Input from 'components/ui/input/Input';
import AsyncSelectResultForm from 'components/react-hook-form/async-select/AsyncSelectResultForm';
import { useDispatch, useSelector } from 'react-redux';
import { CompanyLevelEnum, ModuleName } from 'constants/common.const';
import { getListDepartmentMasterActions } from 'store/department-master/department-master.action';
import { PLANNING_STATUES } from 'constants/planning-and-request.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { DETAIL_PLANNING_DYNAMIC_FIELDS } from 'constants/dynamic/planning.const';
import { Col, Row } from 'reactstrap';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { getListVesselActions } from 'store/vessel/vessel.action';
import styles from '../form.module.scss';
import '../form.scss';

interface Props {
  isEdit: boolean;
  isCreate?: boolean;
  watch: any;
  control: any;
  errors: any;
  setValue: any;
  data?: PlanningAndRequest;
  register: any;
  watchEntity?: string;
  setError?: any;
  dynamicLabels?: IDynamicLabel;
}

const EntityDynamic: FC<Props> = ({
  isEdit,
  watch,
  errors,
  control,
  setValue,
  register,
  data,
  isCreate,
  watchEntity,
  setError,
  dynamicLabels,
}) => {
  // state
  const dispatch = useDispatch();

  const { listVesselResponse } = useSelector((state) => state.vessel);
  const { userInfo } = useSelector((state) => state.authenticate);
  const { listCompanyManagementTypes } = useSelector(
    (state) => state.companyManagement,
  );
  const { listDepartmentMaster } = useSelector(
    (state) => state.departmentMaster,
  );
  const { PlanningAndRequestDetail } = useSelector(
    (state) => state.planningAndRequest,
  );
  const watchCompanyId = watch('auditCompanyId');
  const watchFleetId = watch('fleetId');

  const vesselNameOptions: Array<NewAsyncOptions> = useMemo(
    () =>
      listVesselResponse?.data?.map((item) => ({
        value: item?.id,
        label: item?.name,
      })),
    [listVesselResponse],
  );

  const companyOptions = useMemo(() => {
    const companyOptions =
      listCompanyManagementTypes?.data?.map((item) => ({
        label: item?.name,
        value: item?.id,
      })) || [];

    if (isCreate || isEdit) {
      return companyOptions;
    }

    if (
      companyOptions?.some((item) => item?.value === userInfo?.mainCompany?.id)
    ) {
      return companyOptions;
    }

    return companyOptions?.concat({
      label: userInfo?.mainCompany?.name,
      value: userInfo?.mainCompany?.id,
    });
  }, [
    isCreate,
    isEdit,
    listCompanyManagementTypes?.data,
    userInfo?.mainCompany?.id,
    userInfo?.mainCompany?.name,
  ]);

  const departmentOptions: Array<NewAsyncOptions> = useMemo(
    () =>
      listDepartmentMaster?.data?.map((item) => ({
        value: item?.id,
        label: item?.name,
      })),
    [listDepartmentMaster?.data],
  );

  const renderFormByEntity = useMemo(() => {
    const selectedCompany = listCompanyManagementTypes?.data?.find(
      (item) => item?.id === watchCompanyId,
    );
    const isMainCompany =
      selectedCompany?.companyLevel === CompanyLevelEnum.MAIN_COMPANY;

    if (watchEntity === EntityType.Office) {
      return (
        <>
          <Col sm={6} lg={4}>
            <SelectUI
              labelSelect={renderDynamicLabel(
                dynamicLabels,
                DETAIL_PLANNING_DYNAMIC_FIELDS['Company name'],
              )}
              data={companyOptions}
              isRequired
              disabled={!isEdit}
              name="auditCompanyId"
              id="auditCompanyId"
              className={cx(styles.inputSelect, 'w-100')}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['Please select'],
              )}
              control={control}
              messageRequired={errors?.auditCompanyId?.message || ''}
              onChange={(value) => {
                setValue('auditCompanyId', value);
                setValue('departmentIds', []);
              }}
            />
          </Col>
          <Col sm={6} lg={4}>
            {isMainCompany && (
              <AsyncSelectResultForm
                multiple
                disabled={!isEdit || !watchCompanyId}
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_PLANNING_DYNAMIC_FIELDS.Department,
                )}
                control={control}
                name="departmentIds"
                id="departmentIds"
                titleResults={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS.Selected,
                )}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Please select'],
                )}
                textSelectAll={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Select all'],
                )}
                messageRequired={errors?.departmentId?.message || ''}
                onChangeSearch={(value: string) => {
                  dispatch(
                    getListDepartmentMasterActions.request({
                      companyId: userInfo?.mainCompanyId,
                      type: 'shore',
                    }),
                  );
                }}
                options={departmentOptions}
              />
            )}
          </Col>
        </>
      );
    }

    return (
      <>
        <Col sm={6} lg={4}>
          <AsyncSelectForm
            disabled={
              !isEdit ||
              PlanningAndRequestDetail?.status === PLANNING_STATUES?.Rejected
            }
            labelSelect={renderDynamicLabel(
              dynamicLabels,
              DETAIL_PLANNING_DYNAMIC_FIELDS['Vessel name'],
            )}
            control={control}
            name="vesselId"
            id="vesselId"
            isRequired
            placeholder={
              isEdit
                ? renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS['Please select'],
                  )
                : ''
            }
            searchContent={renderDynamicLabel(
              dynamicLabels,
              DETAIL_PLANNING_DYNAMIC_FIELDS['Vessel name'],
            )}
            messageRequired={errors?.vesselId?.message || ''}
            onChangeSearch={(value: string) =>
              dispatch(
                getListVesselActions.request({
                  pageSize: -1,
                  isRefreshLoading: false,
                  content: value,
                  status: 'active',
                  companyId: userInfo?.mainCompanyId,
                  moduleName: ModuleName.INSPECTION,
                }),
              )
            }
            options={vesselNameOptions}
          />
        </Col>
        <Col sm={6} lg={4}>
          {watchFleetId && (
            <div className={cx('disabledInput', styles.disabledInput)}>
              <Input
                label={renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_PLANNING_DYNAMIC_FIELDS.Fleet,
                )}
                className={cx({ [styles.disableInputForm]: true })}
                readOnly
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Please select'],
                )}
                messageRequired={errors?.fleetId?.message || ''}
                {...register('fleetId')}
              />
            </div>
          )}
        </Col>
      </>
    );
  }, [
    PlanningAndRequestDetail?.status,
    companyOptions,
    control,
    departmentOptions,
    dispatch,
    dynamicLabels,
    errors?.auditCompanyId?.message,
    errors?.departmentId?.message,
    errors?.fleetId?.message,
    errors?.vesselId?.message,
    isEdit,
    listCompanyManagementTypes?.data,
    register,
    setValue,
    userInfo?.mainCompanyId,
    vesselNameOptions,
    watchCompanyId,
    watchEntity,
    watchFleetId,
  ]);
  return (
    <Row className="pt-2">
      <Col sm={6} lg={4}>
        <SelectUI
          labelSelect={renderDynamicLabel(
            dynamicLabels,
            DETAIL_PLANNING_DYNAMIC_FIELDS.Entity,
          )}
          data={ENTITY_OPTIONS}
          isRequired
          disabled={!isEdit}
          name="entityType"
          onChange={(value) => {
            setValue('entityType', value);
            if (value === EntityType.Office) {
              setValue(
                'auditCompanyId',
                data?.auditCompanyId || userInfo?.company?.id,
              );
              setError('fromPortId', null);
              setError('toPortId', null);
            }
          }}
          id="entityType"
          className={cx(styles.inputSelect, 'w-100')}
          control={control}
          messageRequired={errors?.entityType?.message || ''}
        />
      </Col>
      {renderFormByEntity}
    </Row>
  );
};

export default EntityDynamic;
