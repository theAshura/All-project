import { yupResolver } from '@hookform/resolvers/yup';
import Tooltip from 'antd/lib/tooltip';
import { getListCarApiRequest } from 'api/car.api';
import { updateInspectionFollowUpDetailApiRequest } from 'api/internal-audit-report.api';
import images from 'assets/images/images';
import cx from 'classnames';
import { TableOfficeComment } from 'components/common/table-office-comment/TableOfficeComment';
import { ButtonType } from 'components/ui/button/Button';
import { GroupButton } from 'components/ui/button/GroupButton';
import { showConfirmBase } from 'components/ui/modal/confirmBase';

import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { formatDateTimeDay } from 'helpers/utils.helper';
import {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { Controller, FieldValues, useForm } from 'react-hook-form';

import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import * as yup from 'yup';
import { DETAIL_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-follow-up.const';
import styles from './form.module.scss';
import TableCARCAP from './TableCARCAP';
import TableSummary from './TableSummary';

interface InspectionFollowUpFormProps {
  isEdit: boolean;
  dynamicLabels?: IDynamicLabel;
}
export interface OptionProps {
  value: string;
  label: string | ReactElement;
  image?: string;
  selected: boolean;
}

const defaultValues = {
  vesselId: [],
  vesselTypeId: '',
  fleetId: '',
  attachments: [],
  comments: [],
  additionalReviewers: [],
  fromPortId: '',
  toPortId: '',
  plannedFromDate: undefined,
  plannedToDate: undefined,
  auditTypes: [],
  memo: '',
  auditors: [],
  leadAuditor: '',
};

const InspectionFollowUpForm: FC<InspectionFollowUpFormProps> = ({
  isEdit,
  dynamicLabels,
}) => {
  const [isTouched, setTouched] = useState(false);
  const [listCar, setListCar] = useState([]);

  const { id } = useParams<{ id: string }>();

  const { loading, inspectionFollowDetail } = useSelector(
    (state) => state.internalAuditReport,
  );

  const schema = yup.object().shape({});

  const { control, handleSubmit, setValue, watch } = useForm<FieldValues>({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const comments = watch('comments');

  const onSaveData = () => {
    const params = {
      id,
      comments: comments?.map((i) => ({
        comment: i.comment,
      })),
    };
    updateInspectionFollowUpDetailApiRequest(params)
      .then((res) => {
        toastSuccess('Update inspection follow up successfully');
        history.push(`${AppRouteConst.INSPECTION_FOLLOW_UP}`);
      })
      .catch((err) => toastError(err));
  };

  const handleCancel = () => {
    if (isEdit && isTouched) {
      showConfirmBase({
        isDelete: false,
        txTitle: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Cancel?'],
        ),
        txMsg: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS[
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
        onPressButtonRight: () => {
          if (isTouched) {
            setTouched(false);
          }
          history.goBack();
        },
      });
    } else {
      history.goBack();
    }
  };

  const getListByRelationship = useCallback(
    (relationship) => {
      if (inspectionFollowDetail?.rofUsers?.length > 0) {
        const rofUserManager = inspectionFollowDetail?.rofUsers?.filter(
          (item) => item.relationship === relationship,
        );
        return rofUserManager.map((item) => item.username)?.join(', ');
      }
      return '-';
    },
    [inspectionFollowDetail],
  );

  const renderActiveVesselManager = useMemo(() => {
    if (inspectionFollowDetail?.rofUsers?.length > 0) {
      const vesselManager =
        inspectionFollowDetail?.vessel?.vesselDocHolders?.filter(
          (item) => item.status === 'active',
        );

      return vesselManager?.length > 0
        ? vesselManager?.[0]?.company?.name
        : '-';
    }
    return '-';
  }, [
    inspectionFollowDetail?.rofUsers?.length,
    inspectionFollowDetail?.vessel?.vesselDocHolders,
  ]);

  const vesselManagerList = useMemo(
    () => getListByRelationship('vesselManager'),
    [getListByRelationship],
  );
  const leadAuditorList = useMemo(
    () => getListByRelationship('leadAuditor'),
    [getListByRelationship],
  );

  const auditorList = useMemo(() => {
    if (inspectionFollowDetail?.rofUsers?.length > 0) {
      const rofUserManager = inspectionFollowDetail?.rofUsers?.filter(
        (item) =>
          item.relationship === 'auditor' ||
          item.relationship === 'leadAuditor',
      );
      return rofUserManager.map((item) => item.username)?.join(', ');
    }
    return '-';
  }, [inspectionFollowDetail]);

  const auditTypeList = useMemo(() => {
    if (inspectionFollowDetail?.rofAuditTypes?.length > 0) {
      return inspectionFollowDetail?.rofAuditTypes
        ?.map((item) => item.auditTypeName)
        ?.join(', ');
    }
    return '-';
  }, [inspectionFollowDetail]);

  const handleGetListCar = useCallback(() => {
    if (inspectionFollowDetail?.planningRequest?.id) {
      getListCarApiRequest({
        pageSize: -1,
        planningRequestId: inspectionFollowDetail?.planningRequest?.id,
      })
        .then((res) => {
          setListCar(res?.data?.data || []);
        })
        .catch((err) => toastError(err));
    }
  }, [inspectionFollowDetail?.planningRequest?.id]);

  useEffect(() => {
    if (inspectionFollowDetail?.planningRequest?.id) {
      handleGetListCar();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inspectionFollowDetail?.planningRequest?.id]);

  useEffect(() => {
    if (inspectionFollowDetail?.followUp?.followUpComments) {
      setValue(
        'comments',
        inspectionFollowDetail?.followUp?.followUpComments || [],
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inspectionFollowDetail?.followUp?.followUpComments]);

  const renderGeneral = useCallback(
    () => (
      <div className={cx(styles.wrapperContainer)}>
        <div className={cx(styles.containerForm)}>
          <div className={cx(styles.titleContainer)}>
            {renderDynamicLabel(
              dynamicLabels,
              DETAIL_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS['General information'],
            )}
          </div>
          <Row className="pt-2 mx-0">
            <Col className="ps-0">
              {inspectionFollowDetail?.rofPlanningRequest?.vesselName && (
                <div className={styles.generalInformation}>
                  <div className={styles.title}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS['Vessel name'],
                    )}
                  </div>
                  <div className={styles.content}>
                    <Tooltip
                      placement="topLeft"
                      title={
                        inspectionFollowDetail?.rofPlanningRequest?.vesselName
                      }
                      color="#3B9FF3"
                    >
                      <div className={styles.wrapTextOverflow}>
                        {inspectionFollowDetail?.rofPlanningRequest?.vesselName}
                      </div>
                    </Tooltip>
                  </div>
                </div>
              )}
              {!inspectionFollowDetail?.rofPlanningRequest?.vesselName && (
                <div className={styles.generalInformation}>
                  <div className={styles.title}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS[
                        'Company name'
                      ],
                    )}
                  </div>
                  <div className={styles.content}>
                    <Tooltip
                      placement="topLeft"
                      title={
                        inspectionFollowDetail?.rofPlanningRequest
                          ?.auditCompanyName
                      }
                      color="#3B9FF3"
                    >
                      <div className={styles.wrapTextOverflow}>
                        {
                          inspectionFollowDetail?.rofPlanningRequest
                            ?.auditCompanyName
                        }
                      </div>
                    </Tooltip>
                  </div>
                </div>
              )}
            </Col>
            <Col>
              {inspectionFollowDetail?.rofPlanningRequest?.vesselName && (
                <div className={styles.generalInformation}>
                  <div className={styles.title}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS[
                        'Vessel manager'
                      ],
                    )}
                  </div>
                  <div className={styles.content}>
                    <Tooltip
                      placement="topLeft"
                      title={vesselManagerList}
                      color="#3B9FF3"
                    >
                      <div className={styles.wrapTextOverflow}>
                        {renderActiveVesselManager}
                      </div>
                    </Tooltip>
                  </div>
                </div>
              )}
              {!inspectionFollowDetail?.rofPlanningRequest?.vesselName && (
                <div className={styles.generalInformation}>
                  <div className={styles.title}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS.Department,
                    )}
                  </div>
                  <div className={styles.content}>
                    <Tooltip
                      placement="topLeft"
                      title={
                        inspectionFollowDetail?.rofPlanningRequest?.departments
                          ?.map((i) => i.name)
                          .join(', ') || '-'
                      }
                      color="#3B9FF3"
                    >
                      <div className={styles.wrapTextOverflow}>
                        {inspectionFollowDetail?.rofPlanningRequest?.departments
                          ?.map((i) => i.name)
                          .join(', ') || '-'}
                      </div>
                    </Tooltip>
                  </div>
                </div>
              )}
            </Col>
            <Col>
              <div className={styles.generalInformation}>
                <div className={styles.title}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS[
                      'Inspection number'
                    ],
                  )}
                </div>
                <div className={styles.content}>
                  {inspectionFollowDetail?.planningRequest?.auditNo}
                </div>
              </div>
            </Col>
            <Col className="pe-0">
              <Col className="ps-0">
                <div className={styles.generalInformation}>
                  <div className={styles.title}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS[
                        'Inspection type'
                      ],
                    )}
                  </div>
                  <div className={styles.content}>
                    <Tooltip
                      placement="topLeft"
                      title={auditTypeList}
                      color="#3B9FF3"
                    >
                      <div className={styles.wrapTextOverflow}>
                        {auditTypeList}
                      </div>
                    </Tooltip>
                  </div>
                </div>
              </Col>
            </Col>
          </Row>
          <Row className="pt-2 mx-0">
            <Col className="ps-0">
              <div className={styles.generalInformation}>
                <div className={styles.title}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS[
                      'Lead inspector name'
                    ],
                  )}
                </div>
                <div className={styles.content}>
                  <Tooltip
                    placement="topLeft"
                    title={leadAuditorList}
                    id="leadAuditorList"
                    color="#3B9FF3"
                  >
                    <div className={styles.wrapTextOverflow}>
                      {leadAuditorList}
                    </div>
                  </Tooltip>
                </div>
              </div>
            </Col>
            <Col>
              <div className={styles.generalInformation}>
                <div className={styles.title}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS[
                      'Inspector name'
                    ],
                  )}
                </div>
                <div className={styles.content}>
                  <Tooltip
                    placement="topLeft"
                    title={auditorList}
                    color="#3B9FF3"
                  >
                    <div className={styles.wrapTextOverflow}>{auditorList}</div>
                  </Tooltip>
                </div>
              </div>
            </Col>
            <Col>
              <div className={styles.generalInformation}>
                <div className={styles.title}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS[
                      'Actual inspection from port'
                    ],
                  )}
                </div>
                <div className={styles.content}>
                  {inspectionFollowDetail?.rofPlanningRequest?.fromPortName}
                </div>
              </div>
            </Col>
            <Col className="pe-0">
              <div className={styles.generalInformation}>
                <div className={styles.title}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS[
                      'Actual inspection to port'
                    ],
                  )}
                </div>
                <div className={styles.content}>
                  {inspectionFollowDetail?.rofPlanningRequest?.toPortName}
                </div>
              </div>
            </Col>
          </Row>
          <Row className="pt-2">
            <Col>
              <div className={styles.generalInformation}>
                <div className={styles.title}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS[
                      'Planned from date'
                    ],
                  )}
                </div>
                <div className={styles.content}>
                  {formatDateTimeDay(
                    inspectionFollowDetail?.planningRequest?.plannedFromDate,
                  ) || undefined}
                </div>
              </div>
            </Col>
            <Col>
              <div className={styles.generalInformation}>
                <div className={styles.title}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS[
                      'Planned to date'
                    ],
                  )}
                </div>
                <div className={styles.content}>
                  {formatDateTimeDay(
                    inspectionFollowDetail?.planningRequest?.plannedToDate,
                  ) || undefined}
                </div>
              </div>
            </Col>
            <Col />
            <Col />
          </Row>
        </div>
      </div>
    ),
    [
      dynamicLabels,
      inspectionFollowDetail?.rofPlanningRequest?.vesselName,
      inspectionFollowDetail?.rofPlanningRequest?.auditCompanyName,
      inspectionFollowDetail?.rofPlanningRequest?.departments,
      inspectionFollowDetail?.rofPlanningRequest?.fromPortName,
      inspectionFollowDetail?.rofPlanningRequest?.toPortName,
      inspectionFollowDetail?.planningRequest?.auditNo,
      inspectionFollowDetail?.planningRequest?.plannedFromDate,
      inspectionFollowDetail?.planningRequest?.plannedToDate,
      vesselManagerList,
      renderActiveVesselManager,
      auditTypeList,
      leadAuditorList,
      auditorList,
    ],
  );

  return loading ? (
    <div className="d-flex justify-content-center">
      <img
        src={images.common.loading}
        className={styles.loading}
        alt="loading"
      />
    </div>
  ) : (
    <div className="pb-4">
      {renderGeneral()}
      <div className={styles.wrapperContainer}>
        <TableSummary
          dynamicLabels={dynamicLabels}
          inspectionFollowDetail={inspectionFollowDetail}
        />
      </div>

      <TableCARCAP
        planningAndRequestId={inspectionFollowDetail?.planningRequest?.id}
        rofId={inspectionFollowDetail?.planningRequest?.id}
        handleGetListCar={handleGetListCar}
        listCar={listCar}
        disabledAllDelete
        dynamicLabels={dynamicLabels}
      />

      <TableCARCAP
        justCap
        planningAndRequestId={inspectionFollowDetail?.planningRequest?.id}
        rofId={inspectionFollowDetail?.planningRequest?.id}
        handleGetListCar={handleGetListCar}
        listCar={listCar}
        disabledAllDelete
        dynamicLabels={dynamicLabels}
      />

      <Controller
        control={control}
        name="comments"
        render={({ field }) => (
          <TableOfficeComment
            disable={!isEdit}
            dynamicLabels={dynamicLabels}
            loading={false}
            value={field.value}
            onchange={(value) => {
              field.onChange(value);
              setTouched(true);
            }}
          />
        )}
      />
      {isEdit && (
        <GroupButton
          className={cx(styles.GroupButton, 'mt-4 pb-4')}
          handleCancel={handleCancel}
          handleSubmit={handleSubmit(onSaveData)}
          disable={loading}
          buttonTypeRight={ButtonType.Green}
          dynamicLabels={dynamicLabels}
          txButtonRight={renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS.Submit,
          )}
        />
      )}
    </div>
  );
};

export default InspectionFollowUpForm;
