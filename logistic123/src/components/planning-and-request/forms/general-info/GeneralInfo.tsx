import { useMemo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Col, Row } from 'reactstrap';
import cx from 'classnames';
import { visitingTypeOptions } from 'constants/filter.const';
import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import DatepickerWithTimeChecking from 'components/ui/datepicker/DatepickerWithTimeChecking';
import SelectUI from 'components/ui/select/Select';
import AsyncSelectResultForm from 'components/react-hook-form/async-select/AsyncSelectResultForm';
import ToggleSwitch from 'components/ui/toggle-switch/ToggleSwitch';
import moment from 'moment';
import { AuditVisitTypeValues } from 'constants/components/planning.const';
import { DETAIL_PLANNING_DYNAMIC_FIELDS } from 'constants/dynamic/planning.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import TableCp from 'components/common/table/TableCp';
import { NewAsyncOptions } from 'components/ui/async-select/NewAsyncSelect';
import AsyncSelectForm from 'components/react-hook-form/async-select/AsyncSelectForm';
import { getListPortActions } from 'store/port/port.action';
import { EntityType } from 'models/common.model';
import Button, { ButtonSize } from 'components/ui/button/Button';
import TextAreaForm from 'components/react-hook-form/text-area/TextAreaForm';
import { MaxLength } from 'constants/common.const';
import ModalListForm from 'components/react-hook-form/modal-list-form/ModalListForm';
import { compareStatus } from 'helpers/utils.helper';
import { formatDateNoTime } from 'helpers/date.helper';
import { PLANNING_STATUES } from 'constants/planning-and-request.const';
import { RowComponent } from 'components/common/table/row/rowCp';
import { getListAuditTypeActions } from 'store/audit-type/audit-type.action';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import EntityDynamic from '../EntityDynamic/EntityDynamic';
import styles from '../form.module.scss';
import ListTimeOff from '../../components/modal/ListTimeOff';
import {
  departmentRowLabels,
  auditorRowLabels,
  populateAuditorData,
} from '../planning.func';

const GeneralInfo = (props) => {
  const { userInfo } = useSelector((state) => state.authenticate);
  const { listAuditTypes } = useSelector((state) => state.auditType);
  const { listLocations } = useSelector((state) => state.location);

  const {
    control,
    data,
    disableAuditor,
    dispatch,
    errors,
    firstErrorId,
    isCreate,
    isEdit,
    leaderOptions,
    loading,
    portOptions,
    register,
    setValue,
    userOptions,
    watchEntity,
    watchFromETA,
    watchFromETD,
    watchPlannedFrom,
    watchPlannedTo,
    watchToETA,
    watchToETD,
    watchVisitType,
    watchWorkingType,
    setFirstErrorId,
    setFieldsTouched,
    watch,
    setError,
    setModal,
    listAuditorUnAvailable,
    departmentDueDateData,
    dynamicLabels,
  } = props;

  const requirePort = useMemo(
    () =>
      watchVisitType === AuditVisitTypeValues.PORT ||
      watchVisitType === AuditVisitTypeValues.SAILING,
    [watchVisitType],
  );

  const renderRow = useCallback(
    (isScrollable?: boolean) => (
      <tbody>
        {departmentDueDateData?.map((item) => {
          const finalData = {
            department: item?.name || '-',
            dateOfLastInspection: formatDateNoTime(item.dateOfLastInspection),
            dueDate: formatDateNoTime(item.dueDate),
          };
          return (
            <RowComponent
              key={item?.department}
              isScrollable={isScrollable}
              data={finalData}
              onClickRow={undefined}
              rowLabels={departmentRowLabels(dynamicLabels)}
            />
          );
        })}
      </tbody>
    ),
    [departmentDueDateData, dynamicLabels],
  );

  const auditTypeOptions: Array<NewAsyncOptions> = useMemo(
    () =>
      listAuditTypes?.data?.map((item) => ({
        value: item?.id,
        label: item?.name,
      })),
    [listAuditTypes],
  );

  const allowEditGeneralInfo = useMemo(() => {
    if (isCreate) {
      return true;
    }
    const draftCase = compareStatus(data?.status, PLANNING_STATUES.Draft);
    const rejectedCase = compareStatus(data?.status, PLANNING_STATUES.Rejected);
    if (isEdit && (draftCase || rejectedCase)) {
      return true;
    }
    return false;
  }, [data?.status, isCreate, isEdit]);

  const auditorData = useCallback(
    (dataUser) =>
      populateAuditorData(dataUser, data?.auditors, listAuditorUnAvailable),
    [data?.auditors, listAuditorUnAvailable],
  );

  const renderDateInspectionAndDueDate = useMemo(
    () => (
      <>
        <Col xs={4}>
          <DateTimePicker
            disabled
            messageRequired={errors?.dateOfLastInspection?.message || ''}
            label={renderDynamicLabel(
              dynamicLabels,
              DETAIL_PLANNING_DYNAMIC_FIELDS['Date of last inspection'],
            )}
            placeholder={
              isEdit
                ? renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS['Please select'],
                  )
                : ''
            }
            control={control}
            className={cx('w-100', styles.disabledDatePicker)}
            minDate={moment()}
            name="dateOfLastInspection"
            id="dateOfLastInspection"
            inputReadOnly
          />
        </Col>
        <Col xs={4}>
          <DateTimePicker
            disabled
            messageRequired={errors?.dueDate?.message || ''}
            label={renderDynamicLabel(
              dynamicLabels,
              DETAIL_PLANNING_DYNAMIC_FIELDS['Due date'],
            )}
            className={cx('w-100', styles.disabledDatePicker)}
            placeholder={
              isEdit
                ? renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS['Please select'],
                  )
                : ''
            }
            control={control}
            minDate={moment()}
            name="dueDate"
            id="dueDate"
            inputReadOnly
          />
        </Col>
      </>
    ),
    [
      control,
      dynamicLabels,
      errors?.dateOfLastInspection?.message,
      errors?.dueDate?.message,
      isEdit,
    ],
  );

  const isVesselType = useMemo(
    () => watchEntity === EntityType.Vessel,
    [watchEntity],
  );
  const isOfficeType = useMemo(
    () => watchEntity === EntityType.Office,
    [watchEntity],
  );

  const oldestETA = useMemo(() => {
    const fromETAUnix = moment(watchFromETA).unix();
    const toETAUnix = moment(watchToETA).unix();
    if (watchFromETA && watchToETA) {
      if (fromETAUnix < toETAUnix) {
        return watchFromETA;
      }
      return watchToETA;
    }
    return watchFromETA || watchToETA || null;
  }, [watchFromETA, watchToETA]);

  const largestETD = useMemo((): moment.Moment => {
    const fromETDUnix = moment(watchFromETD).unix();
    const toETDUnix = moment(watchToETD).unix();
    if (watchFromETD && watchToETD) {
      if (fromETDUnix > toETDUnix) {
        return watchFromETD;
      }
      return watchToETD;
    }

    return watchFromETD || watchToETD || null;
  }, [watchFromETD, watchToETD]);

  const resetPlannedDate = useCallback(() => {
    setValue('plannedFromDate', null);
    setValue('plannedToDate', null);
  }, [setValue]);

  const locationOptions = useMemo(() => {
    if (listLocations?.data?.length) {
      return listLocations?.data?.map((item) => ({
        label: item?.name,
        value: item?.id,
      }));
    }
    return [];
  }, [listLocations?.data]);

  return (
    <div>
      <div
        onClick={() => setFirstErrorId('')}
        className={cx(styles.wrapperContainer)}
      >
        <div className={cx(styles.containerForm)}>
          <div className={cx(styles.titleContainer)}>
            {renderDynamicLabel(
              dynamicLabels,
              DETAIL_PLANNING_DYNAMIC_FIELDS['General information'],
            )}
          </div>
          <EntityDynamic
            errors={errors}
            control={control}
            isEdit={allowEditGeneralInfo}
            isCreate={isCreate}
            watch={watch}
            watchEntity={watchEntity}
            data={data}
            setValue={setValue}
            register={register}
            setError={setError}
            dynamicLabels={dynamicLabels}
          />
          <Row className="pt-2">
            {isVesselType && (
              <Col sm={6} lg={4}>
                <div className={cx('disabledInput', styles.disabledInput)}>
                  <SelectUI
                    labelSelect={renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_PLANNING_DYNAMIC_FIELDS['Vessel type'],
                    )}
                    data={[]}
                    placeholder={renderDynamicLabel(
                      dynamicLabels,
                      COMMON_DYNAMIC_FIELDS['Please select'],
                    )}
                    disabled
                    name="vesselTypeId"
                    id="vesselTypeId"
                    messageRequired={errors?.vesselTypeId?.message || ''}
                    className={cx(
                      styles.inputSelect,
                      styles.disabledInput,
                      'w-100',
                    )}
                    control={control}
                  />
                </div>
              </Col>
            )}
            {isVesselType && renderDateInspectionAndDueDate}
          </Row>
          <Row className="pt-2">
            <Col sm={6} lg={4}>
              {isVesselType && (
                <SelectUI
                  labelSelect={renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_PLANNING_DYNAMIC_FIELDS['Visit type'],
                  )}
                  data={visitingTypeOptions}
                  placeholder={renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS['Please select'],
                  )}
                  isRequired
                  disabled={!allowEditGeneralInfo}
                  name="typeOfAudit"
                  id="typeOfAudit"
                  className={cx(styles.inputSelect, 'w-100')}
                  control={control}
                  messageRequired={errors?.typeOfAudit?.message || ''}
                />
              )}
              {!isVesselType && (
                <SelectUI
                  labelSelect={renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_PLANNING_DYNAMIC_FIELDS.Location,
                  )}
                  data={locationOptions}
                  placeholder={renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS['Please select'],
                  )}
                  isRequired
                  disabled={!allowEditGeneralInfo}
                  name="locationId"
                  id="locationId"
                  className={cx(styles.inputSelect, 'w-100')}
                  control={control}
                  messageRequired={errors?.locationId?.message || ''}
                />
              )}
            </Col>
            <Col sm={6} lg={4}>
              <AsyncSelectResultForm
                multiple
                disabled={!allowEditGeneralInfo}
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_PLANNING_DYNAMIC_FIELDS['Inspection type'],
                )}
                control={control}
                name="auditTypeIds"
                dynamicLabels={dynamicLabels}
                id="auditTypeIds"
                titleResults={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS.Selected,
                )}
                isRequired
                placeholder={
                  isEdit
                    ? renderDynamicLabel(
                        dynamicLabels,
                        COMMON_DYNAMIC_FIELDS['Please select'],
                      )
                    : ''
                }
                textSelectAll={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Select all'],
                )}
                messageRequired={errors?.auditTypeIds?.message || ''}
                onChangeSearch={(value: string) => {
                  setFieldsTouched((prev) => ({
                    ...prev,
                    auditTypeIds: true,
                  }));
                  dispatch(
                    getListAuditTypeActions.request({
                      pageSize: -1,
                      isRefreshLoading: false,
                      content: value,
                      companyId: userInfo?.mainCompanyId,
                    }),
                  );
                }}
                options={auditTypeOptions}
              />
            </Col>
            <Col sm={6} lg={4}>
              <div className={styles.wrapWorkingType}>
                <div className={styles.label}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_PLANNING_DYNAMIC_FIELDS['Working type'],
                  )}
                </div>
                <div className="d-flex align-items-center">
                  <ToggleSwitch
                    isRequired
                    disabled={!allowEditGeneralInfo}
                    control={control}
                    name="workingType"
                  />
                  <div className={styles.value}>
                    {!watchWorkingType
                      ? renderDynamicLabel(
                          dynamicLabels,
                          DETAIL_PLANNING_DYNAMIC_FIELDS.Physical,
                        )
                      : renderDynamicLabel(
                          dynamicLabels,
                          DETAIL_PLANNING_DYNAMIC_FIELDS.Remote,
                        )}
                  </div>
                </div>
              </div>
            </Col>
          </Row>
          {isOfficeType && departmentDueDateData?.length ? (
            <Row className="pt-2">
              <Col className={styles.wrapDepartmentTable}>
                <TableCp
                  isHiddenAction
                  dynamicLabels={dynamicLabels}
                  loading={false}
                  rowLabels={departmentRowLabels(dynamicLabels)}
                  isEmpty={false}
                  renderRow={renderRow}
                />
              </Col>
            </Row>
          ) : null}
        </div>
      </div>
      <div className={cx(styles.wrapperContainer, 'mt-3')}>
        <div className={cx(styles.containerForm)}>
          <div
            className={cx(
              styles.wrapTitle,
              'd-flex align-items-center w-100 justify-content-between mt-0',
            )}
          >
            <div className={styles.title}>
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_PLANNING_DYNAMIC_FIELDS['Inspectors schedule'],
              )}
            </div>
            <div className="d-flex">
              <ListTimeOff
                dynamicLabels={dynamicLabels}
                disabledAction={!isEdit}
              />
              <Button
                onClick={() => setModal(true)}
                buttonSize={ButtonSize.Medium}
                disabled={loading}
                className={cx(styles.buttonPort, 'ms-4')}
              >
                {renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_PLANNING_DYNAMIC_FIELDS['Inspectors scheduler'],
                )}
              </Button>
            </div>
          </div>

          {!isOfficeType && (
            <Row className="pt-2">
              <Col xs={4}>
                <AsyncSelectForm
                  disabled={!isEdit}
                  isRequired={requirePort}
                  labelSelect={renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_PLANNING_DYNAMIC_FIELDS[
                      watchVisitType === AuditVisitTypeValues.PORT
                        ? 'Port'
                        : 'From port'
                    ],
                  )}
                  control={control}
                  name="fromPortId"
                  id="fromPortId"
                  placeholder={
                    isEdit
                      ? renderDynamicLabel(
                          dynamicLabels,
                          COMMON_DYNAMIC_FIELDS['Please select'],
                        )
                      : ''
                  }
                  messageRequired={errors?.fromPortId?.message || ''}
                  onChangeSearch={(value: string) =>
                    dispatch(
                      getListPortActions.request({
                        pageSize: -1,
                        status: 'active',
                        isRefreshLoading: false,
                        content: value,
                        companyId: userInfo?.mainCompanyId,
                      }),
                    )
                  }
                  options={portOptions}
                />
              </Col>
              <Col xs={4}>
                <DatepickerWithTimeChecking
                  disabled={!isEdit}
                  currentValue={watchFromETA}
                  toDateDisable={watchFromETD}
                  showNow={false}
                  showTime={{ format: 'HH:mm' }}
                  format="DD/MM/YYYY HH:mm"
                  messageRequired={
                    errors?.fromPortEstimatedTimeArrival?.message || ''
                  }
                  onChange={(e) => {
                    setValue('fromPortEstimatedTimeArrival', e);
                    setError('fromPortEstimatedTimeArrival', null);
                    resetPlannedDate();
                    if (!watchFromETD) {
                      setValue(
                        'fromPortEstimatedTimeDeparture',
                        moment(e).endOf('day'),
                      );
                      setError('fromPortEstimatedTimeDeparture', null);
                    }
                  }}
                  label={renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_PLANNING_DYNAMIC_FIELDS.ETA,
                  )}
                  placeholder={
                    isEdit
                      ? renderDynamicLabel(
                          dynamicLabels,
                          COMMON_DYNAMIC_FIELDS['Please select'],
                        )
                      : ''
                  }
                  className="w-100"
                  control={control}
                  name="fromPortEstimatedTimeArrival"
                  id="fromPortEstimatedTimeArrival"
                  focus={firstErrorId === 'fromPortEstimatedTimeArrival'}
                  inputReadOnly
                />
              </Col>

              <Col xs={4}>
                <DatepickerWithTimeChecking
                  disabled={!isEdit}
                  currentValue={watchFromETD}
                  fromDateDisable={watchFromETA}
                  showTime={{ format: 'HH:mm' }}
                  showNow={false}
                  format="DD/MM/YYYY HH:mm"
                  messageRequired={
                    errors?.fromPortEstimatedTimeDeparture?.message || ''
                  }
                  onChange={(e) => {
                    setValue('fromPortEstimatedTimeDeparture', e);
                    setError('fromPortEstimatedTimeDeparture', null);
                    resetPlannedDate();
                  }}
                  label={renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_PLANNING_DYNAMIC_FIELDS.ETD,
                  )}
                  placeholder={
                    isEdit
                      ? renderDynamicLabel(
                          dynamicLabels,
                          COMMON_DYNAMIC_FIELDS['Please select'],
                        )
                      : ''
                  }
                  className="w-100"
                  control={control}
                  name="fromPortEstimatedTimeDeparture"
                  id="fromPortEstimatedTimeDeparture"
                  focus={firstErrorId === 'fromPortEstimatedTimeDeparture'}
                  inputReadOnly
                />
              </Col>
            </Row>
          )}
          {!isOfficeType && watchVisitType !== AuditVisitTypeValues.PORT && (
            <Row className="pt-2">
              <Col xs={4}>
                <AsyncSelectForm
                  disabled={!isEdit}
                  isRequired={requirePort}
                  labelSelect={renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_PLANNING_DYNAMIC_FIELDS['To port'],
                  )}
                  control={control}
                  name="toPortId"
                  id="toPortId"
                  placeholder={
                    isEdit
                      ? renderDynamicLabel(
                          dynamicLabels,
                          COMMON_DYNAMIC_FIELDS['Please select'],
                        )
                      : ''
                  }
                  messageRequired={errors?.toPortId?.message || ''}
                  onChangeSearch={(value: string) =>
                    dispatch(
                      getListPortActions.request({
                        pageSize: -1,
                        isRefreshLoading: false,
                        content: value,
                        status: 'active',
                        companyId: userInfo?.mainCompanyId,
                      }),
                    )
                  }
                  options={portOptions}
                />
              </Col>
              <Col xs={4}>
                <DatepickerWithTimeChecking
                  disabled={!isEdit}
                  showTime={{ format: 'HH:mm' }}
                  format="DD/MM/YYYY HH:mm"
                  currentValue={watchToETA}
                  toDateDisable={watchToETD}
                  showNow={false}
                  messageRequired={
                    errors?.toPortEstimatedTimeArrival?.message || ''
                  }
                  onChange={(e) => {
                    setValue('toPortEstimatedTimeArrival', e);
                    setError('toPortEstimatedTimeArrival', null);
                    resetPlannedDate();
                    if (!watchToETD) {
                      setValue(
                        'toPortEstimatedTimeDeparture',
                        moment(e).endOf('day'),
                      );
                      setError('toPortEstimatedTimeDeparture', null);
                    }
                  }}
                  label={renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_PLANNING_DYNAMIC_FIELDS.ETA,
                  )}
                  placeholder={
                    isEdit
                      ? renderDynamicLabel(
                          dynamicLabels,
                          COMMON_DYNAMIC_FIELDS['Please select'],
                        )
                      : ''
                  }
                  className="w-100"
                  control={control}
                  name="toPortEstimatedTimeArrival"
                  id="toPortEstimatedTimeArrival"
                  focus={firstErrorId === 'toPortEstimatedTimeArrival'}
                  inputReadOnly
                />
              </Col>
              <Col xs={4}>
                <DatepickerWithTimeChecking
                  disabled={!isEdit}
                  showTime={{ format: 'HH:mm' }}
                  format="DD/MM/YYYY HH:mm"
                  currentValue={watchToETD}
                  fromDateDisable={watchToETA}
                  showNow={false}
                  messageRequired={
                    errors?.toPortEstimatedTimeDeparture?.message || ''
                  }
                  onChange={(e) => {
                    setValue('toPortEstimatedTimeDeparture', e);
                    setError('toPortEstimatedTimeDeparture', null);
                    resetPlannedDate();
                  }}
                  label={renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_PLANNING_DYNAMIC_FIELDS.ETD,
                  )}
                  placeholder={
                    isEdit
                      ? renderDynamicLabel(
                          dynamicLabels,
                          COMMON_DYNAMIC_FIELDS['Please select'],
                        )
                      : ''
                  }
                  className="w-100"
                  control={control}
                  focus={firstErrorId === 'toPortEstimatedTimeDeparture'}
                  name="toPortEstimatedTimeDeparture"
                  id="toPortEstimatedTimeDeparture"
                  inputReadOnly
                />
              </Col>
            </Row>
          )}

          <Row className="pt-2">
            <Col xs={4}>
              <DatepickerWithTimeChecking
                disabled={!isEdit}
                messageRequired={errors?.plannedFromDate?.message || ''}
                showTime={{ format: 'HH:mm' }}
                format="DD/MM/YYYY HH:mm"
                fromDateDisable={oldestETA}
                toDateDisable={watchPlannedTo || largestETD}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Please select'],
                )}
                label={renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_PLANNING_DYNAMIC_FIELDS['Planned from date'],
                )}
                currentValue={watchPlannedFrom}
                focus={firstErrorId === 'plannedFromDate'}
                showNow={false}
                setValue={setValue}
                isRequired
                className="w-100"
                // disabledDate={validatePlannedFromDate}
                control={control}
                name="plannedFromDate"
                id="plannedFromDate"
                inputReadOnly
              />
            </Col>
            <Col xs={4}>
              <DatepickerWithTimeChecking
                disabled={!isEdit}
                messageRequired={errors?.plannedToDate?.message || ''}
                showTime={{ format: 'HH:mm' }}
                format="DD/MM/YYYY HH:mm"
                fromDateDisable={watchPlannedFrom || oldestETA}
                toDateDisable={largestETD}
                currentValue={watchPlannedTo}
                showNow={false}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Please select'],
                )}
                label={renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_PLANNING_DYNAMIC_FIELDS['Planned to date'],
                )}
                isRequired
                className="w-100"
                control={control}
                setValue={setValue}
                name="plannedToDate"
                // disabledDate={validatePlannedToDate}
                focus={firstErrorId === 'plannedToDate'}
                id="plannedToDate"
                inputReadOnly
              />
            </Col>
          </Row>
          <Row className="pt-2">
            <Col xs={4}>
              <ModalListForm
                name="auditorIds"
                id="auditorIds"
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_PLANNING_DYNAMIC_FIELDS['Name of inspector'],
                )}
                title={renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_PLANNING_DYNAMIC_FIELDS['Name of inspector'],
                )}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Please select'],
                )}
                disable={!isEdit}
                dynamicLabels={dynamicLabels}
                control={control}
                data={auditorData(userOptions || [])}
                rowLabels={auditorRowLabels(dynamicLabels)}
                notAllowSortData
                // error={errors?.auditorIds?.message || ''}
                verticalResultClassName={styles.resultBox}
                disableCloseWhenClickOut
                descriptionSelect={renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_PLANNING_DYNAMIC_FIELDS[
                    'Please assign inspectors to accept the schedule'
                  ],
                )}
              />
            </Col>
            <Col xs={4}>
              <SelectUI
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_PLANNING_DYNAMIC_FIELDS['Name of lead inspector'],
                )}
                data={leaderOptions?.filter((i) => i) || []}
                disabled={disableAuditor}
                name="leadAuditorId"
                id="leadAuditorId"
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Please select'],
                )}
                className={cx(styles.inputSelect, 'w-100')}
                control={control}
              />
            </Col>
            <Col xs={4} className={styles.wrapMemo}>
              <span className={cx(styles.labelSelect)}>
                {renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_PLANNING_DYNAMIC_FIELDS.Memo,
                )}
              </span>
              <TextAreaForm
                control={control}
                autoSize={{ minRows: 1 }}
                {...register('memo')}
                disabled={!isEdit}
                className={styles.memoForm}
                maxLength={MaxLength.MAX_LENGTH_COMMENTS}
                placeholder={
                  isEdit
                    ? renderDynamicLabel(
                        dynamicLabels,
                        DETAIL_PLANNING_DYNAMIC_FIELDS['Enter memo'],
                      )
                    : ''
                }
              />
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
};
export default GeneralInfo;
