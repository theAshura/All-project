import { FC, useContext, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { InternalAuditReportFormContext } from 'contexts/internal-audit-report/IARFormContext';
import { RowComponent } from 'components/common/table/row/rowCp';
import { Action } from 'models/common.model';
import { showInternalAuditModal } from 'components/internal-audit-report/forms/common/modals/internal-audit-modal/InternalAuditModal';
import { PreviousInternalAuditReport } from 'models/api/internal-audit-report/internal-audit-report.model';
import { InternalAuditReportStatus } from 'components/internal-audit-report/details';
import images from 'assets/images/images';
import { formatDateLocalNoTime } from 'helpers/date.helper';
import TableCp from 'components/common/table/TableCp';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { INSPECTION_REPORT_FIELDS_DETAILS } from 'constants/dynamic/inspection-report.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { ButtonType } from 'components/ui/button/Button';
import { useAuditor } from '../helpers/helpers';
import styles from '../form.module.scss';
import '../form.scss';

interface Props {
  isEdit: boolean;
  dynamicLabels?: IDynamicLabel;
}

export enum IARVerificationStatus {
  YET_TO_VERIFIED = 'Yet To Verify',
  PARTIALLY_VERIFIED = 'Partially Verified',
  ALL_VERIFIED = 'All Verified',
  VERIFIED = 'Verified',
}

const InternalType: FC<Props> = ({ isEdit, dynamicLabels }) => {
  const isAuditor = useAuditor();
  const { listPreviousIAR } = useContext(InternalAuditReportFormContext);
  const { internalAuditReportDetail } = useSelector(
    (store) => store.internalAuditReport,
  );

  const verificationStatus = useMemo(
    () => [
      { name: IARVerificationStatus.PARTIALLY_VERIFIED, color: '#18BA92' },
      { name: IARVerificationStatus.ALL_VERIFIED, color: '#18BA92' },
      { name: IARVerificationStatus.YET_TO_VERIFIED, color: '#F42829' },
    ],
    [],
  );

  const internalAuditLabels = useMemo(
    () => [
      {
        id: 'action',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS.Action,
        ),
        sort: true,
        width: '100',
      },
      {
        id: 'sNo',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS['S.No'],
        ),
        sort: false,
        width: '150',
      },
      {
        id: 'auditNumber',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS['Inspection number'],
        ),
        sort: false,
        width: '150',
      },
      {
        id: 'auditType',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS['Inspection type'],
        ),
        sort: false,
        width: '100',
      },
      {
        id: 'auditDate',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS['Inspection date'],
        ),
        width: '110',
        sort: false,
      },
      {
        id: 'verificationStatus',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS['Verification status'],
        ),
        sort: false,
        width: '140',
      },
      {
        id: 'verificationDate',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS['Verification date'],
        ),
        sort: false,
        width: '140',
      },
    ],
    [dynamicLabels],
  );

  const sanitizeIAData = useCallback(
    (item: PreviousInternalAuditReport) => {
      const thisVerificationStatus = verificationStatus.find(
        (i) => i.name === item?.internalAuditReport_verificationStatus,
      );
      const finalData = {
        sNo: item?.internalAuditReport_serialNumber,
        auditNumber: item?.prAuditNo,
        auditType: item?.iarAuditTypes_auditTypeName,
        auditDate: formatDateLocalNoTime(item?.actualFrom),
        verificationStatus: (
          <span style={{ color: thisVerificationStatus.color }}>
            {thisVerificationStatus.name}
          </span>
        ),
        verificationDate: formatDateLocalNoTime(
          item?.internalAuditReport_verificationDate,
        ),
      };
      return finalData;
    },
    [verificationStatus],
  );
  const renderIARow = useCallback(
    (isScrollable?: boolean) => {
      if (!listPreviousIAR?.length) {
        return null;
      }
      return (
        <tbody>
          {listPreviousIAR?.map((item) => {
            const finalData = sanitizeIAData(item);
            const actions: Action[] = [
              {
                img: images.icons.icViewDetail,
                function: () =>
                  showInternalAuditModal({
                    isEdit: false,
                    IAR: item,
                  }),
                feature: Features.AUDIT_INSPECTION,
                subFeature: SubFeatures.INTERNAL_AUDIT_REPORT,
                action: ActionTypeEnum.VIEW,
                buttonType: ButtonType.Blue,
                cssClass: 'me-1',
              },
            ];
            if (
              item?.internalAuditReport_verificationStatus !==
                IARVerificationStatus.ALL_VERIFIED &&
              internalAuditReportDetail?.status !==
                InternalAuditReportStatus.CLOSEOUT &&
              isAuditor() &&
              isEdit
            ) {
              actions.push({
                img: images.icons.icEdit,
                function: () =>
                  showInternalAuditModal({
                    isEdit: true,
                    IAR: item,
                  }),
                feature: Features.AUDIT_INSPECTION,
                subFeature: SubFeatures.INTERNAL_AUDIT_REPORT,
                action: ActionTypeEnum.UPDATE,
              });
            }
            return (
              <RowComponent
                key={item?.internalAuditReport_id}
                isScrollable={isScrollable}
                data={finalData}
                onClickRow={undefined}
                actionList={actions}
                rowLabels={internalAuditLabels}
              />
            );
          })}
        </tbody>
      );
    },
    [
      listPreviousIAR,
      sanitizeIAData,
      internalAuditReportDetail?.status,
      isAuditor,
      isEdit,
      internalAuditLabels,
    ],
  );

  return useMemo(
    () => (
      <div className={styles.formContainer}>
        <p className={styles.titleForm}>
          {renderDynamicLabel(
            dynamicLabels,
            INSPECTION_REPORT_FIELDS_DETAILS['Internal audit'],
          )}
        </p>
        <TableCp
          rowLabels={internalAuditLabels}
          isEmpty={!listPreviousIAR || !listPreviousIAR.length}
          renderRow={renderIARow}
          loading={false}
          // isHiddenAction
          classNameNodataWrapper={styles.dataWrapperEmpty}
        />
      </div>
    ),
    [dynamicLabels, internalAuditLabels, listPreviousIAR, renderIARow],
  );
};

export default InternalType;
