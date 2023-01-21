import { FC } from 'react';
import { useSelector } from 'react-redux';
import { CommonQuery } from 'constants/common.const';
import { useLocation } from 'react-router';
import { InternalAuditReportStatus } from 'components/internal-audit-report/details';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import cx from 'classnames';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { IARActionBtns } from '.';
import { sortIarHeaders } from '../../../helpers/utils.helper';
import Attachments from './attachments';
import GeneralInformation from './general-information';
import FindingSummary from './finding-summary';
import Observation from './observation/Observation';
import OfficeComments from './office-comments';
import ReportHeader from './report-headers';
import AdditionalReviewerSectionContent from './additional-reviewer-section';
import InternalAuditComments from './internal-audit-comment';
// import InspectionHistoryAndStatus from './inspection-history-and-status';
import NonConformity from './non-conformity/NonConformity';
import UserHistory from './user-history/UserHistory';
import WorkFlowRemark from './workflow-remark';
import InspectionHistory from './inspection-history/InspectionHistory';
import CarCapDetail from './car-cap/index';

import styles from './form.module.scss';

interface InternalAuditReportFormProps {
  hasEditRest: boolean;
  IARActionBtns: IARActionBtns[];
  handleCancel: () => void;
}

const InternalAuditReportForm: FC<InternalAuditReportFormProps> = ({
  hasEditRest,
  IARActionBtns,
  handleCancel,
}) => {
  const { search } = useLocation();
  const { internalAuditReportDetail } = useSelector(
    (store) => store.internalAuditReport,
  );
  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.AuditInspectionInspectionReport,
    modulePage: search === CommonQuery.EDIT ? ModulePage.Edit : ModulePage.View,
  });
  // const { userInfo } = useSelector((store) => store.authenticate);

  // const isPIC = useMemo(
  //   () =>
  //     internalAuditReportDetail?.nonConformities?.data?.some(
  //       (i) => i.picId === userInfo?.id,
  //     ) ||
  //     internalAuditReportDetail?.observations?.data?.some(
  //       (i) => i.picId === userInfo?.id,
  //     ),
  //   [
  //     internalAuditReportDetail?.nonConformities?.data,
  //     internalAuditReportDetail?.observations?.data,
  //     userInfo?.id,
  //   ],
  // );

  // internalAuditReportComment
  return (
    <div className={styles.formContainer}>
      <GeneralInformation dynamicLabels={dynamicLabels} />
      <FindingSummary dynamicLabels={dynamicLabels} />
      {/* <Overview
        isEdit={hasEditRest}
        headerItem={internalAuditReportDetail?.IARReportHeaders[0]}
      />
      <InspectionHistoryAndStatus isEdit={hasEditRest} /> */}
      {/* <SMSRelated isEdit={hasEditRest} /> */}
      {sortIarHeaders(internalAuditReportDetail?.IARReportHeaders).map(
        (i, index) =>
          !i?.parentId && (
            <ReportHeader
              dynamicLabels={dynamicLabels}
              hideSerialNumber={index === 0 || index === 1}
              isEdit={hasEditRest}
              header={i}
              key={i.id}
            />
          ),
      )}

      <NonConformity dynamicLabels={dynamicLabels} />
      <CarCapDetail dynamicLabels={dynamicLabels} />
      <Observation dynamicLabels={dynamicLabels} />
      <Attachments dynamicLabels={dynamicLabels} disabled={!hasEditRest} />
      <InternalAuditComments
        dynamicLabels={dynamicLabels}
        isEdit={hasEditRest}
      />

      <UserHistory dynamicLabels={dynamicLabels} />
      {internalAuditReportDetail?.internalAuditReportHistories?.some(
        (item) => item.status === 'reassigned',
      ) && <AdditionalReviewerSectionContent dynamicLabels={dynamicLabels} />}
      <WorkFlowRemark
        dynamicLabels={dynamicLabels}
        disabled={
          !(
            search === CommonQuery.EDIT &&
            ![
              InternalAuditReportStatus.APPROVED.toString() &&
                InternalAuditReportStatus.CLOSEOUT.toString(),
            ].includes(internalAuditReportDetail?.status)
          )
        }
      />
      <OfficeComments dynamicLabels={dynamicLabels} />
      <InspectionHistory dynamicLabels={dynamicLabels} />
      {search === CommonQuery.EDIT && (
        <div className={cx('d-flex justify-content-end', styles.groupBtns)}>
          <Button
            buttonType={ButtonType.CancelOutline}
            buttonSize={ButtonSize.Medium}
            onClick={handleCancel}
          >
            {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Cancel)}
          </Button>
          {IARActionBtns.map((i) => {
            if (i.visible) {
              return (
                <Button
                  key={i.name}
                  buttonType={i.buttonType}
                  buttonSize={i.buttonSize}
                  className={i.className}
                  onClick={i.onClick}
                >
                  {i.text}
                </Button>
              );
            }
            return null;
          })}
        </div>
      )}
    </div>
  );
  // );
};

export default InternalAuditReportForm;
