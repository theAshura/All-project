import { FC, useContext, useCallback, useMemo } from 'react';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import upperFirst from 'lodash/upperFirst';
import {
  InternalAuditReportFormContext,
  IARReportSubHeaderDescriptionState,
} from 'contexts/internal-audit-report/IARFormContext';
import { showDescriptionModal } from 'components/internal-audit-report/forms/common/modals/description-modal/DescriptionModal';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { RowComponent } from 'components/common/table/row/rowCp';
import { Action } from 'models/common.model';
import { IARReportHeaders } from 'models/api/internal-audit-report/internal-audit-report.model';
import { TOOLTIP_COLOR } from 'constants/common.const';
import Tooltip from 'antd/lib/tooltip';
import images from 'assets/images/images';
import TableCp from 'components/common/table/TableCp';
import Input from 'components/ui/input/Input';
import cx from 'classnames';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';

import Button, { ButtonType } from 'components/ui/button/Button';
import InternalType from '../data-types/InternalType';
import EditorType from '../data-types/EditorType';
import InspectionHistoryAndStatusType from '../data-types/InspectionHistoryAndStatusType';
import styles from '../form.module.scss';
import '../form.scss';

interface Props {
  isEdit: boolean;
  subHeader: IARReportHeaders;
  isOpen?: boolean;
  handleCollapseSubHeader?: () => void;
}

const ReportSubHeader: FC<Props> = ({
  isEdit,
  subHeader,
  handleCollapseSubHeader,
  isOpen,
}) => {
  const { t } = useTranslation([
    I18nNamespace.INTERNAL_AUDIT_REPORT,
    I18nNamespace.COMMON,
  ]);
  const {
    IARRpSubHeaderDescription,
    handleDeleteRpHeaderDescription,
    handleGetRpHeaderComment,
    handleFillRpHeaderComment,
  } = useContext(InternalAuditReportFormContext);
  const subDescription = useMemo(
    () =>
      IARRpSubHeaderDescription.filter(
        (i) => i.headerId === subHeader?.reportHeaderId,
      ),
    [IARRpSubHeaderDescription, subHeader],
  );

  const descriptionLabels = useMemo(
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
        maxWidth: '90',
      },
      {
        id: 'topic',
        label: upperFirst('topic'),
        sort: false,
        width: '100',
        maxWidth: '100',
      },
      {
        id: 'score',
        label: upperFirst('score'),
        sort: false,
        width: '100',
        maxWidth: '100',
      },
      {
        id: 'description',
        label: upperFirst('description'),
        sort: false,
        width: '590',
        maxWidth: '590',
      },
    ],
    [t],
  );

  const handleDelete = useCallback(
    (item: IARReportSubHeaderDescriptionState) => {
      showConfirmBase({
        isDelete: true,
        txTitle: t('modal.delete'),
        txMsg: t('modal.areYouSureYouWantToDelete'),
        onPressButtonRight: () =>
          handleDeleteRpHeaderDescription(item.id, true),
      });
    },
    [handleDeleteRpHeaderDescription, t],
  );

  const sanitizeData = (
    item: IARReportSubHeaderDescriptionState,
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

  const renderRow = useCallback(
    (isScrollable?: boolean) => {
      if (subDescription?.length > 0) {
        return (
          <tbody>
            {subDescription?.map((item, index) => {
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
                  function: () => {
                    showDescriptionModal({
                      id: item?.id,
                      headerId: item?.headerId,
                      isChild: true,
                      isNew: false,
                      parentId: item?.parentId,
                    });
                  },
                  feature: Features.AUDIT_INSPECTION,
                  subFeature: SubFeatures.INTERNAL_AUDIT_REPORT,
                  cssClass: 'ms-1',
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
                />
              );
            })}
          </tbody>
        );
      }
      return null;
    },
    [handleDelete, isEdit, subDescription],
  );

  const dynamicType = useMemo(
    () => (
      <div>
        <div className="d-flex flex-row align-items-center justify-content-between">
          <p className={styles.titleForm}>{`${t('description')}/${t(
            'comments',
          )}`}</p>
          {isEdit ? (
            <Button
              onClick={() =>
                showDescriptionModal({
                  headerId: subHeader?.reportHeaderId,
                  isChild: true,
                  isNew: true,
                  parentId: subHeader?.parentId,
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
          rowLabels={descriptionLabels}
          renderRow={renderRow}
          isEmpty={!subDescription || !subDescription.length}
          classNameNodataWrapper={styles.dataWrapperEmpty}
        />
        <div className={styles.comment}>
          <h6>{t('comments')}</h6>
          <Input
            disabled={!isEdit}
            placeholder={isEdit ? 'Enter comment' : ''}
            value={handleGetRpHeaderComment({
              headerId: subHeader?.reportHeaderId,
              isChild: true,
            })}
            onChange={(e) =>
              handleFillRpHeaderComment({
                headerId: subHeader?.reportHeaderId,
                isChild: true,
                data: e.target.value,
              })
            }
          />
        </div>
      </div>
    ),
    [
      descriptionLabels,
      handleFillRpHeaderComment,
      handleGetRpHeaderComment,
      isEdit,
      renderRow,
      subDescription,
      subHeader?.parentId,
      subHeader?.reportHeaderId,
      t,
    ],
  );

  const renderSubHeaderByType = useMemo(() => {
    if (subHeader.type === 'Inspection history table') {
      return <InspectionHistoryAndStatusType isEdit={isEdit} />;
    }
    if (subHeader.type === 'CK editor') {
      return isOpen ? (
        <EditorType isEdit={isEdit} headerItem={subHeader} />
      ) : null;
    }
    if (subHeader.type === 'Internal audit table') {
      return (
        <>
          <InternalType isEdit={isEdit} />
          {dynamicType}
        </>
      );
    }
    return dynamicType;
  }, [dynamicType, isEdit, isOpen, subHeader]);

  return useMemo(
    () => (
      <div
        className={cx(styles.formContainer, styles.wrapSubHeader, {
          [styles.wrapSubHeaderWithCollapse]: isOpen,
        })}
      >
        <div
          className={cx(
            styles.titleForm,
            styles.subheaderTitle,
            'd-flex justify-content-between align-items-center',
          )}
          onClick={handleCollapseSubHeader}
        >
          <div>
            {`${subHeader?.serialNumber}. ${subHeader?.topic}`}{' '}
            {subHeader?.parentTopic && `Sub of ${subHeader?.parentTopic}`}
          </div>
          <div className={styles.customBtnCollapse}>
            <img
              className={cx({ [styles.routeCollapseImg]: !isOpen })}
              src={images.common.whiteArrowUp}
              alt="ic-collapse"
            />
          </div>
        </div>
        <div
          className={cx(styles.collapseItem, { [styles.expandItem]: isOpen })}
        >
          {renderSubHeaderByType}
        </div>
      </div>
    ),
    [isOpen, handleCollapseSubHeader, renderSubHeaderByType, subHeader],
  );
};

export default ReportSubHeader;
