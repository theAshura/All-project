import Tooltip from 'antd/lib/tooltip';
import { uploadFileApi } from 'api/user.api';
import images from 'assets/images/images';
import cx from 'classnames';
import Card from 'components/common/card/Card';
import { InternalAuditReportStatus } from 'components/internal-audit-report/details';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { INSPECTION_REPORT_FIELDS_DETAILS } from 'constants/dynamic/inspection-report.const';
import Button from 'components/ui/button/Button';
import InfoField from 'components/ui/info-field/InfoField';
import { CommonQuery, TOOLTIP_COLOR } from 'constants/common.const';

import { InternalAuditReportFormContext } from 'contexts/internal-audit-report/IARFormContext';
import { formatDateNoTime } from 'helpers/date.helper';
import { toastError } from 'helpers/notification.helper';

import { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { Col, Row } from 'reactstrap';
import styles from '../form.module.scss';
import { useAuditor } from '../helpers/helpers';
import ModalSchedulerROFStatus from '../scheduler-rof-status';

const GeneralInformation = ({ dynamicLabels }) => {
  const { internalAuditReportDetail } = useSelector(
    (store) => store.internalAuditReport,
  );

  const { handleSetBackgroundImage, backgroundImage } = useContext(
    InternalAuditReportFormContext,
  );
  const { search } = useLocation();
  const isAuditor = useAuditor();
  const [loadingBackground, setLoadingBackground] = useState<boolean>(false);
  const [openScheduler, setOpenScheduler] = useState<boolean>(false);

  const uploadFile = useRef(null);

  const isEditBackgroundImage = useMemo(() => {
    if (
      isAuditor() &&
      [
        InternalAuditReportStatus.DRAFT.toString(),
        InternalAuditReportStatus.REASSIGNED.toString(),
      ].includes(internalAuditReportDetail?.status) &&
      search === CommonQuery.EDIT
    ) {
      return true;
    }
    return false;
  }, [isAuditor, internalAuditReportDetail?.status, search]);

  const handleDelete = useCallback(() => {
    handleSetBackgroundImage(null);
  }, [handleSetBackgroundImage]);

  const onChangeFile = useCallback(
    // eslint-disable-next-line consistent-return
    (event) => {
      const { files } = event.target;
      const typeFile: string[] = (files && files[0]?.type?.split('/')) || [];
      const formDataImages = new FormData();
      formDataImages.append('files', files[0]);
      formDataImages.append('fileType', 'image');
      formDataImages.append('prefix', 'avatars');
      if (
        typeFile[0] === 'image' &&
        files[0]?.size < 5242881 &&
        (typeFile[1] === 'jpg' ||
          typeFile[1] === 'png' ||
          typeFile[1] === 'jpeg')
      ) {
        setLoadingBackground(true);
        uploadFileApi(formDataImages)
          .then((r) => {
            if (r?.data && r?.data[0]) {
              handleSetBackgroundImage(r?.data[0]);
            }
          })
          .catch((e) => toastError(e))
          .finally(() => setLoadingBackground(false));
        return null;
      }

      if (
        typeFile[0] === 'image' &&
        files[0]?.size > 5242880 &&
        (typeFile[1] === 'jpg' ||
          typeFile[1] === 'png' ||
          typeFile[1] === 'jpeg')
      ) {
        toastError(
          `This specified file ${
            files[0]?.name
          } could not be uploaded. The file is ${
            // eslint-disable-next-line no-restricted-properties
            files[0]?.size / Math.pow(2, 20)
          } exceeding the maximum file size of 5 MB`,
        );
        return null;
      }
      if (files[0]?.size > 1) {
        toastError('This type is not supported');
      }
    },
    [handleSetBackgroundImage],
  );

  return useMemo(() => {
    const leadAuditors =
      internalAuditReportDetail?.iarUsers?.length > 0
        ? internalAuditReportDetail?.iarUsers
            ?.filter((item) => item.relationship === 'leadAuditor')
            ?.map((item) => item.username)
            ?.join(', ')
        : '';
    const auditors =
      internalAuditReportDetail?.iarUsers?.length > 0
        ? internalAuditReportDetail?.iarUsers
            ?.filter(
              (item) =>
                item.relationship === 'leadAuditor' ||
                item.relationship === 'auditor',
            )
            ?.map((item) => item.username)
            ?.join(', ')
        : '';

    return (
      <Card className={styles.wrapperContainer}>
        <div className="d-flex flex-row justify-content-between">
          <p className={styles.titleForm}>
            {' '}
            {renderDynamicLabel(
              dynamicLabels,
              INSPECTION_REPORT_FIELDS_DETAILS['General information'],
            )}
          </p>

          <div>
            <Button
              onClick={() => setOpenScheduler(true)}
              className={cx({ 'me-2': isEditBackgroundImage })}
            >
              {renderDynamicLabel(
                dynamicLabels,
                INSPECTION_REPORT_FIELDS_DETAILS[
                  'Scheduler and report of findings status'
                ],
              )}
            </Button>
            {isEditBackgroundImage && (
              <label htmlFor="file-input">
                <input
                  type="file"
                  ref={uploadFile}
                  accept=".png, .jpg"
                  className={styles.inputFile}
                  onChange={onChangeFile}
                />
                <Button
                  onClick={() => uploadFile.current.click()}
                  renderSuffix={
                    <img src={images.icons.icAddImage} alt="add-cover" />
                  }
                  classSuffix="ms-1"
                >
                  {renderDynamicLabel(
                    dynamicLabels,
                    INSPECTION_REPORT_FIELDS_DETAILS['Add cover image'],
                  )}
                </Button>
              </label>
            )}
          </div>
        </div>
        <Row className="pt-4 mx-0">
          {internalAuditReportDetail.entityType === 'Vessel' && (
            <Col xs={3} className="p-0">
              <InfoField
                label={renderDynamicLabel(
                  dynamicLabels,
                  INSPECTION_REPORT_FIELDS_DETAILS['Inspection type'],
                )}
                value={
                  <Tooltip
                    placement="topLeft"
                    title={
                      internalAuditReportDetail?.iarPlanningRequest?.vesselName
                    }
                    color={TOOLTIP_COLOR}
                  >
                    <p className="limit-line-text">
                      {
                        internalAuditReportDetail?.iarPlanningRequest
                          ?.vesselName
                      }
                    </p>
                  </Tooltip>
                }
              />
            </Col>
          )}
          {internalAuditReportDetail.entityType === 'Office' && (
            <Col xs={3} className="p-0">
              <InfoField
                label={renderDynamicLabel(
                  dynamicLabels,
                  INSPECTION_REPORT_FIELDS_DETAILS['Company name'],
                )}
                value={
                  <Tooltip
                    placement="topLeft"
                    title={
                      internalAuditReportDetail?.iarPlanningRequest
                        ?.auditCompanyName
                    }
                    color={TOOLTIP_COLOR}
                  >
                    <p className="limit-line-text">
                      {internalAuditReportDetail?.company?.name}
                    </p>
                  </Tooltip>
                }
              />
            </Col>
          )}
          {internalAuditReportDetail.entityType === 'Office' && (
            <Col xs={3} className="p-0">
              <InfoField
                label={renderDynamicLabel(
                  dynamicLabels,
                  INSPECTION_REPORT_FIELDS_DETAILS['Company name'],
                )}
                value={
                  <Tooltip
                    placement="topLeft"
                    title={
                      internalAuditReportDetail?.iarPlanningRequest?.departments
                        ?.map((i) => i.name)
                        .join(', ') || '-'
                    }
                    color={TOOLTIP_COLOR}
                  >
                    <p className="limit-line-text">
                      {internalAuditReportDetail?.iarPlanningRequest?.departments
                        ?.map((i) => i.name)
                        .join(', ') || '-'}
                    </p>
                  </Tooltip>
                }
              />
            </Col>
          )}
          <Col xs={3} className="p-0">
            <InfoField
              label={renderDynamicLabel(
                dynamicLabels,
                INSPECTION_REPORT_FIELDS_DETAILS['Inspection type'],
              )}
              value={
                <Tooltip
                  placement="topLeft"
                  title={
                    internalAuditReportDetail?.iarAuditTypes?.length > 0
                      ? internalAuditReportDetail?.iarAuditTypes
                          ?.map((item) => item.auditTypeName)
                          ?.join(', ')
                      : ''
                  }
                  color={TOOLTIP_COLOR}
                >
                  <p className="limit-line-text">
                    {internalAuditReportDetail?.iarAuditTypes?.length > 0
                      ? internalAuditReportDetail?.iarAuditTypes
                          ?.map((item) => item.auditTypeName)
                          ?.join(', ')
                      : ''}
                  </p>
                </Tooltip>
              }
            />
          </Col>
          <Col xs={3} className="p-0">
            <InfoField
              label={renderDynamicLabel(
                dynamicLabels,
                INSPECTION_REPORT_FIELDS_DETAILS['Actual inspection from date'],
              )}
              value={
                <Tooltip
                  placement="topLeft"
                  title={
                    formatDateNoTime(
                      internalAuditReportDetail.reportFindingForm
                        ?.planningRequest?.auditTimeTable?.actualFrom,
                    ) || '-'
                  }
                  color={TOOLTIP_COLOR}
                >
                  <p className="limit-line-text">
                    {formatDateNoTime(
                      internalAuditReportDetail.reportFindingForm
                        ?.planningRequest?.auditTimeTable?.actualFrom,
                    ) || '-'}
                  </p>
                </Tooltip>
              }
            />
          </Col>
          <Col xs={3} className="p-0">
            <InfoField
              label={renderDynamicLabel(
                dynamicLabels,
                INSPECTION_REPORT_FIELDS_DETAILS['Inspection type'],
              )}
              value={
                <Tooltip
                  placement="topLeft"
                  title={
                    formatDateNoTime(
                      internalAuditReportDetail.reportFindingForm
                        ?.planningRequest?.auditTimeTable?.actualTo,
                    ) || '-'
                  }
                  color={TOOLTIP_COLOR}
                >
                  <p className="limit-line-text">
                    {formatDateNoTime(
                      internalAuditReportDetail.reportFindingForm
                        ?.planningRequest?.auditTimeTable?.actualTo,
                    ) || '-'}
                  </p>
                </Tooltip>
              }
            />
          </Col>

          {internalAuditReportDetail.entityType !== 'Office' && (
            <Col xs={3} className="p-0">
              <InfoField
                label={renderDynamicLabel(
                  dynamicLabels,
                  INSPECTION_REPORT_FIELDS_DETAILS[
                    'Actual inspection from port'
                  ],
                )}
                value={
                  <Tooltip
                    placement="topLeft"
                    title={
                      internalAuditReportDetail?.iarPlanningRequest
                        ?.fromPortName || ''
                    }
                    color={TOOLTIP_COLOR}
                  >
                    <p className="limit-line-text">
                      {internalAuditReportDetail?.iarPlanningRequest
                        ?.fromPortName || ''}
                    </p>
                  </Tooltip>
                }
              />
            </Col>
          )}
          {internalAuditReportDetail.entityType !== 'Office' && (
            <Col xs={3} className="p-0">
              <InfoField
                label={renderDynamicLabel(
                  dynamicLabels,
                  INSPECTION_REPORT_FIELDS_DETAILS['Actual inspection to port'],
                )}
                value={
                  <Tooltip
                    placement="topLeft"
                    title={
                      internalAuditReportDetail?.iarPlanningRequest
                        ?.toPortName || ''
                    }
                    color={TOOLTIP_COLOR}
                  >
                    <p className="limit-line-text">
                      {internalAuditReportDetail?.iarPlanningRequest
                        ?.toPortName || ''}
                    </p>
                  </Tooltip>
                }
              />
            </Col>
          )}
          <Col xs={3} className="p-0">
            <InfoField
              label={renderDynamicLabel(
                dynamicLabels,
                INSPECTION_REPORT_FIELDS_DETAILS['Visit type'],
              )}
              value={
                <Tooltip
                  placement="topLeft"
                  title={
                    internalAuditReportDetail?.reportFindingForm
                      ?.planningRequest?.typeOfAudit
                  }
                  color={TOOLTIP_COLOR}
                >
                  <p className="limit-line-text">
                    {
                      internalAuditReportDetail?.reportFindingForm
                        ?.planningRequest?.typeOfAudit
                    }
                  </p>
                </Tooltip>
              }
            />
          </Col>
          <Col xs={3} className="p-0">
            <InfoField
              label={renderDynamicLabel(
                dynamicLabels,
                INSPECTION_REPORT_FIELDS_DETAILS['Lead inspector name'],
              )}
              value={
                <Tooltip
                  placement="topLeft"
                  title={leadAuditors}
                  color={TOOLTIP_COLOR}
                >
                  <p className="limit-line-text">{leadAuditors}</p>
                </Tooltip>
              }
            />
          </Col>

          <Col xs={3} className="p-0">
            <InfoField
              label={renderDynamicLabel(
                dynamicLabels,
                INSPECTION_REPORT_FIELDS_DETAILS['Inspector name'],
              )}
              value={
                <Tooltip
                  placement="topLeft"
                  title={auditors}
                  color={TOOLTIP_COLOR}
                >
                  <p
                    className="limit-line-text pr-3"
                    style={{ paddingRight: '1rem' }}
                  >
                    {auditors}
                  </p>
                </Tooltip>
              }
            />
          </Col>
          <Col xs={3} className="p-0">
            <InfoField
              label={renderDynamicLabel(
                dynamicLabels,
                INSPECTION_REPORT_FIELDS_DETAILS['Cover image'],
              )}
              value={
                <div className={styles.backgroundWrapper}>
                  {loadingBackground ? (
                    <div className="d-flex justify-content-center">
                      <img
                        src={images.common.loading}
                        style={{ height: 40, width: 40 }}
                        alt="loading"
                      />
                    </div>
                  ) : (
                    <>
                      {backgroundImage ? (
                        <>
                          <a
                            target="_blank"
                            href={backgroundImage?.link}
                            rel="noreferrer"
                            style={{ wordWrap: 'break-word', marginRight: 20 }}
                          >
                            {backgroundImage?.originName}
                          </a>
                          {isEditBackgroundImage && backgroundImage ? (
                            <Button
                              onClick={handleDelete}
                              disabled={
                                !isEditBackgroundImage || loadingBackground
                              }
                              className={styles.deleteBtn}
                            >
                              <img
                                src={images.icons.icDeleteFiles}
                                alt="delete-file"
                              />
                            </Button>
                          ) : null}
                        </>
                      ) : (
                        '-'
                      )}
                    </>
                  )}
                </div>
              }
            />
          </Col>
        </Row>

        <ModalSchedulerROFStatus
          isOpen={openScheduler}
          title={renderDynamicLabel(
            dynamicLabels,
            INSPECTION_REPORT_FIELDS_DETAILS[
              'Scheduler and report of findings status'
            ],
          )}
          dynamicLabels={dynamicLabels}
          toggle={() => setOpenScheduler(false)}
        />
      </Card>
    );
  }, [
    internalAuditReportDetail?.iarUsers,
    internalAuditReportDetail.entityType,
    internalAuditReportDetail?.iarPlanningRequest?.vesselName,
    internalAuditReportDetail?.iarPlanningRequest?.auditCompanyName,
    internalAuditReportDetail?.iarPlanningRequest?.departments,
    internalAuditReportDetail?.iarPlanningRequest?.fromPortName,
    internalAuditReportDetail?.iarPlanningRequest?.toPortName,
    internalAuditReportDetail?.company?.name,
    internalAuditReportDetail?.iarAuditTypes,
    internalAuditReportDetail.reportFindingForm?.planningRequest?.auditTimeTable
      ?.actualFrom,
    internalAuditReportDetail.reportFindingForm?.planningRequest?.auditTimeTable
      ?.actualTo,
    internalAuditReportDetail.reportFindingForm?.planningRequest?.typeOfAudit,
    dynamicLabels,
    isEditBackgroundImage,
    onChangeFile,
    loadingBackground,
    backgroundImage,
    handleDelete,
    openScheduler,
  ]);
};

export default GeneralInformation;
