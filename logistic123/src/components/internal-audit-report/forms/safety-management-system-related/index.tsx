import Tooltip from 'antd/lib/tooltip';
import images from 'assets/images/images';
import { RowComponent } from 'components/common/table/row/rowCp';
import TableCp from 'components/common/table/TableCp';
import { InternalAuditReportStatus } from 'components/internal-audit-report/details';
import { showDescriptionModal } from 'components/internal-audit-report/forms/common/modals/description-modal/DescriptionModal';
import { showInternalAuditModal } from 'components/internal-audit-report/forms/common/modals/internal-audit-modal/InternalAuditModal';
import Button, { ButtonType } from 'components/ui/button/Button';
import { CollapseUI } from 'components/ui/collapse/CollapseUI';
import Input from 'components/ui/input/Input';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { TOOLTIP_COLOR } from 'constants/common.const';
import { I18nNamespace } from 'constants/i18n.const';
import {
  IARReportHeaderDescriptionState,
  InternalAuditReportFormContext,
} from 'contexts/internal-audit-report/IARFormContext';
import { formatDateLocalNoTime } from 'helpers/date.helper';
import upperFirst from 'lodash/upperFirst';
import { PreviousInternalAuditReport } from 'models/api/internal-audit-report/internal-audit-report.model';
import { Action } from 'models/common.model';
import { FC, useCallback, useContext, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';

import { useSelector } from 'react-redux';
import styles from '../form.module.scss';
import '../form.scss';
import { useAuditor } from '../helpers/helpers';

interface Props {
  isEdit: boolean;
}

export enum IARVerificationStatus {
  YET_TO_VERIFIED = 'Yet To Verify',
  PARTIALLY_VERIFIED = 'Partially Verified',
  ALL_VERIFIED = 'All Verified',
  VERIFIED = 'Verified',
}

const verificationStatus = [
  { name: IARVerificationStatus.PARTIALLY_VERIFIED, color: '#18BA92' },
  { name: IARVerificationStatus.ALL_VERIFIED, color: '#18BA92' },
  { name: IARVerificationStatus.YET_TO_VERIFIED, color: '#F42829' },
];

const SMSRelated: FC<Props> = ({ isEdit }) => {
  const { t } = useTranslation([
    I18nNamespace.INTERNAL_AUDIT_REPORT,
    I18nNamespace.COMMON,
  ]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isAuditor = useAuditor();
  const {
    IARRpHeaderDescription,
    listPreviousIAR,
    handleGetSMSComment,
    handleSetSMSComment,
    handleDeleteRpHeaderDescription,
  } = useContext(InternalAuditReportFormContext);

  const { internalAuditReportDetail } = useSelector(
    (store) => store.internalAuditReport,
  );

  const headerId = useMemo(
    () =>
      internalAuditReportDetail?.IARReportHeaders?.find(
        (i) => i?.topic === 'Safety management system related',
      )?.reportHeaderId,
    [internalAuditReportDetail],
  );

  const SMSDescription = useMemo(
    () => IARRpHeaderDescription.filter((i) => i.headerId === headerId),
    [IARRpHeaderDescription, headerId],
  );

  const internalAuditLabels = useMemo(
    () => [
      {
        id: 'action',
        label: t('action'),
        sort: true,
        width: '100',
      },
      {
        id: 'sNo',
        label: 'S.No',
        sort: false,
        width: '150',
      },
      {
        id: 'auditNumber',
        label: 'Inspection Number',
        sort: false,
        width: '150',
      },
      {
        id: 'auditType',
        label: 'Inspection Type',
        sort: false,
        width: '100',
      },
      {
        id: 'auditDate',
        label: 'Inspection Date',
        width: '110',
        sort: false,
      },
      {
        id: 'verificationStatus',
        label: 'Verification Status',
        sort: false,
        width: '140',
      },
      {
        id: 'verificationDate',
        label: 'Verification Date',
        sort: false,
        width: '140',
      },
    ],
    [t],
  );

  const description = useMemo(
    () => [
      {
        id: 'action',
        label: t('action'),
        sort: false,
        width: '100',
      },
      {
        id: 'S.no',
        label: 'S.No',
        sort: false,
        width: '90',
      },
      {
        id: 'topic',
        label: upperFirst('topic'),
        sort: false,
        width: '100',
      },
      {
        id: 'score',
        label: upperFirst('score'),
        sort: false,
        width: '100',
      },
      {
        id: 'description',
        label: upperFirst('description'),
        sort: false,
        width: '590',
      },
    ],
    [t],
  );

  const sanitizeIAData = useCallback((item: PreviousInternalAuditReport) => {
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
  }, []);

  const renderIARow = useCallback(
    (isScrollable?: boolean) => {
      if (listPreviousIAR?.length > 0) {
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
      }
      return null;
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

  const handleDelete = useCallback(
    (item: IARReportHeaderDescriptionState) => {
      showConfirmBase({
        isDelete: true,
        txTitle: t('modal.delete'),
        txMsg: t('modal.areYouSureYouWantToDelete'),
        onPressButtonRight: () =>
          handleDeleteRpHeaderDescription(item.id, false),
      });
    },
    [handleDeleteRpHeaderDescription, t],
  );

  const sanitizeData = (
    item: IARReportHeaderDescriptionState,
    index: number,
  ) => {
    const finalData = {
      id: item.headerId,
      sNo: index + 1,
      topic: item.topic,
      score: item.score,
      description: (
        <Tooltip
          placement="topLeft"
          title={item.description}
          color={TOOLTIP_COLOR}
        >
          <span className="limit-line-text">{item.description}</span>
        </Tooltip>
      ),
    };
    return finalData;
  };

  const renderDCRow = useCallback(
    (isScrollable?: boolean) => {
      if (SMSDescription?.length > 0) {
        return (
          <tbody>
            {SMSDescription?.map((item, index) => {
              const finalData = sanitizeData(item, index);
              const actions: Action[] = [
                {
                  img: images.icons.icRemove,
                  function: () => handleDelete(item),
                  feature: Features.AUDIT_INSPECTION,
                  subFeature: SubFeatures.INTERNAL_AUDIT_REPORT,
                  action: ActionTypeEnum.DELETE,
                  buttonType: ButtonType.Orange,
                },
                {
                  img: images.icons.icEdit,
                  function: () =>
                    showDescriptionModal({
                      headerId,
                      id: item.id,
                      isChild: false,
                      isNew: false,
                      parentId: '',
                    }),
                  cssClass: 'ms-1',
                  feature: Features.AUDIT_INSPECTION,
                  subFeature: SubFeatures.INTERNAL_AUDIT_REPORT,
                  action: ActionTypeEnum.UPDATE,
                },
              ];
              return (
                <RowComponent
                  key={item.id}
                  isScrollable={isScrollable}
                  data={finalData}
                  actionList={isEdit ? actions : []}
                  onClickRow={undefined}
                  rowLabels={description}
                />
              );
            })}
          </tbody>
        );
      }
      return null;
    },
    [SMSDescription, isEdit, description, handleDelete, headerId],
  );

  return useMemo(
    () => (
      <CollapseUI
        title="3. Safety management system related"
        collapseClassName={styles.collapse}
        isOpen={isOpen}
        content={
          <div className={styles.formContainer}>
            <p className={styles.titleForm}>3.1 Internal Inspection</p>
            <TableCp
              rowLabels={internalAuditLabels}
              isEmpty={!listPreviousIAR || !listPreviousIAR.length}
              renderRow={renderIARow}
              loading={false}
              // isHiddenAction
              classNameNodataWrapper={styles.dataWrapperEmpty}
            />
            <div className="d-flex flex-row align-items-center justify-content-between">
              <p className={styles.titleForm}>{`${t('description')}/${t(
                'comments',
              )}`}</p>
              {isEdit ? (
                <Button
                  onClick={() =>
                    showDescriptionModal({
                      headerId,
                      isChild: false,
                      isNew: true,
                      parentId: '',
                    })
                  }
                  className={styles.addBtn}
                  renderSuffix={
                    <img
                      src={images.icons.icAddCircle}
                      alt="createNew"
                      className={styles.icButton}
                    />
                  }
                >
                  {t('buttons.add')}
                </Button>
              ) : null}
            </div>
            <TableCp
              loading={false}
              rowLabels={description}
              renderRow={renderDCRow}
              isEmpty={!SMSDescription || !SMSDescription.length}
              classNameNodataWrapper={styles.dataWrapperEmpty}
            />
            <div className={styles.comment}>
              <h6>{t('comments')}</h6>
              <Input
                disabled={!isEdit}
                placeholder={isEdit ? 'Enter comment' : ''}
                value={handleGetSMSComment()}
                onChange={(e) => handleSetSMSComment(e.target.value)}
              />
            </div>
          </div>
        }
        toggle={() => setIsOpen((prev) => !prev)}
      />
    ),
    [
      isOpen,
      internalAuditLabels,
      listPreviousIAR,
      renderIARow,
      t,
      isEdit,
      description,
      renderDCRow,
      SMSDescription,
      handleGetSMSComment,
      headerId,
      handleSetSMSComment,
    ],
  );
};

export default SMSRelated;
