import { FC, useState, useContext, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CollapseUI } from 'components/ui/collapse/CollapseUI';
import {
  InternalAuditReportFormContext,
  IARReportHeaderDescriptionState,
} from 'contexts/internal-audit-report/IARFormContext';
import { sortIarHeaders } from 'helpers/utils.helper';
import { showDescriptionModal } from 'components/internal-audit-report/forms/common/modals/description-modal/DescriptionModal';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { RowComponent } from 'components/common/table/row/rowCp';
import { Action } from 'models/common.model';
import { IARReportHeaders } from 'models/api/internal-audit-report/internal-audit-report.model';
import { TOOLTIP_COLOR } from 'constants/common.const';
import Tooltip from 'antd/lib/tooltip';
import images from 'assets/images/images';
import TableCp from 'components/common/table/TableCp';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { INSPECTION_REPORT_FIELDS_DETAILS } from 'constants/dynamic/inspection-report.const';
import Input from 'components/ui/input/Input';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import Button, { ButtonType } from 'components/ui/button/Button';
import SubReportHeader from './SubReportHeader';
import EditorType from '../data-types/EditorType';
import InternalType from '../data-types/InternalType';
import InspectionHistoryAndStatusType from '../data-types/InspectionHistoryAndStatusType';
import styles from '../form.module.scss';
import '../form.scss';

interface Props {
  isEdit: boolean;
  header: IARReportHeaders;
  hideSerialNumber?: boolean;
  dynamicLabels?: IDynamicLabel;
}

const ReportHeader: FC<Props> = ({
  isEdit,
  dynamicLabels,
  header,
  hideSerialNumber,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [listChildrenCollapse, setListChildrenCollapse] = useState<string[]>(
    [],
  );
  const {
    IARRpHeaderDescription,
    handleGetRpHeaderComment,
    handleFillRpHeaderComment,
    handleDeleteRpHeaderDescription,
  } = useContext(InternalAuditReportFormContext);
  const { internalAuditReportDetail } = useSelector(
    (store) => store.internalAuditReport,
  );
  const Description = useMemo(
    () =>
      IARRpHeaderDescription.filter(
        (i) => i.headerId === header?.reportHeaderId,
      ),
    [IARRpHeaderDescription, header],
  );

  const listSubHeaderRecursive: IARReportHeaders[] = useMemo(() => {
    const listSubHeader = [];
    const findListChildren = (reportHeaderId: string, parentTopic: string) => {
      const listChildren = internalAuditReportDetail?.IARReportHeaders?.filter(
        (i) => reportHeaderId === i?.parentId,
      )?.map((i) => ({ ...i, parentTopic }));

      if (listChildren?.length > 0) {
        listSubHeader.push(listChildren);
        listChildren.forEach((item) => {
          findListChildren(item.reportHeaderId, item.topic);
        });
      }
    };
    findListChildren(header?.reportHeaderId, header?.topic);
    // setListChildrenCollapse(
    //   listSubHeader?.flat(1)?.map((i) => i?.reportHeaderId),
    // );
    return listSubHeader.flat(1);
  }, [
    header?.reportHeaderId,
    header?.topic,
    internalAuditReportDetail?.IARReportHeaders,
  ]);

  const handleCollapseSubHeader = useCallback(
    (reportHeaderId: string) => {
      if (listChildrenCollapse?.some((i) => i === reportHeaderId)) {
        const newList = listChildrenCollapse.filter(
          (i) => i !== reportHeaderId,
        );
        setListChildrenCollapse(newList);
      } else {
        setListChildrenCollapse([...listChildrenCollapse, reportHeaderId]);
      }
    },
    [listChildrenCollapse],
  );

  const descriptionLabels = useMemo(
    () => [
      {
        id: 'action',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS.Action,
        ),
        sort: false,
        width: '100',
      },
      {
        id: 'S.no',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS['S.No'],
        ),
        sort: false,
        width: '90',
        maxWidth: '90',
      },
      {
        id: 'topic',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS.Topic,
        ),
        sort: false,
        width: '100',
        maxWidth: '100',
      },
      {
        id: 'score',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS.Score,
        ),
        sort: false,
        width: '100',
        maxWidth: '100',
      },
      {
        id: 'description',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS.Description,
        ),
        sort: false,
        width: '590',
        maxWidth: '590',
      },
    ],
    [dynamicLabels],
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

  const handleDelete = useCallback(
    (item: IARReportHeaderDescriptionState) => {
      showConfirmBase({
        isDelete: true,
        txTitle: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Delete?'],
        ),
        txMsg: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS[
            'Are you sure you want to delete this record? This action cannot be undone and you will not be able to recover any data.'
          ],
        ),
        txButtonLeft: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS.Cancel,
        ),
        txButtonRight: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS.Delete,
        ),
        onPressButtonRight: () =>
          handleDeleteRpHeaderDescription(item.id, false),
      });
    },
    [dynamicLabels, handleDeleteRpHeaderDescription],
  );

  const renderRow = useCallback(
    (isScrollable?: boolean) => {
      if (Description?.length > 0) {
        return (
          <tbody>
            {Description?.map((item, index) => {
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
                      headerId: item?.headerId,
                      id: item.id,
                      isChild: false,
                      isNew: false,
                      parentId: '',
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
    [Description, handleDelete, isEdit],
  );

  const dynamicType = useMemo(
    () => (
      <>
        <div className="d-flex flex-row align-items-center justify-content-between">
          <p className={styles.titleForm}>
            {renderDynamicLabel(
              dynamicLabels,
              INSPECTION_REPORT_FIELDS_DETAILS['Description/Comments'],
            )}
          </p>
          {isEdit ? (
            <Button
              onClick={() =>
                showDescriptionModal({
                  headerId: header?.reportHeaderId,
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
              {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Add)}
            </Button>
          ) : null}
        </div>
        <TableCp
          loading={false}
          rowLabels={descriptionLabels}
          renderRow={renderRow}
          isEmpty={!Description || !Description.length}
          classNameNodataWrapper={styles.dataWrapperEmpty}
        />
        <div className={styles.comment}>
          <h6>
            {renderDynamicLabel(
              dynamicLabels,
              INSPECTION_REPORT_FIELDS_DETAILS.Comments,
            )}
          </h6>
          <Input
            disabled={!isEdit}
            placeholder={
              isEdit
                ? renderDynamicLabel(
                    dynamicLabels,
                    INSPECTION_REPORT_FIELDS_DETAILS['Enter comment'],
                  )
                : ''
            }
            value={handleGetRpHeaderComment({
              headerId: header?.reportHeaderId,
              isChild: false,
            })}
            onChange={(e) =>
              handleFillRpHeaderComment({
                headerId: header?.reportHeaderId,
                isChild: false,
                data: e.target.value,
              })
            }
          />
        </div>
      </>
    ),
    [
      Description,
      descriptionLabels,
      dynamicLabels,
      handleFillRpHeaderComment,
      handleGetRpHeaderComment,
      header?.reportHeaderId,
      isEdit,
      renderRow,
    ],
  );

  const renderSubHeaderByType = useMemo(() => {
    if (header.type === 'Inspection history table') {
      return (
        <InspectionHistoryAndStatusType
          dynamicLabels={dynamicLabels}
          isEdit={isEdit}
        />
      );
    }
    if (header.type === 'CK editor') {
      return isOpen ? (
        <EditorType
          isEdit={isEdit}
          dynamicLabels={dynamicLabels}
          headerItem={header}
        />
      ) : null;
    }
    if (header.type === 'Internal audit table') {
      return (
        <>
          <InternalType dynamicLabels={dynamicLabels} isEdit={isEdit} />
          {dynamicType}
        </>
      );
    }
    return dynamicType;
  }, [dynamicLabels, dynamicType, header, isEdit, isOpen]);

  const renderInspectionType = useMemo(() => {
    if (!header?.auditTypes?.length) {
      return null;
    }
    const listAuditTypes = [];

    header?.auditTypes?.forEach((item) => {
      const auditFound = internalAuditReportDetail?.iarAuditTypes?.find(
        (i) => String(i.auditTypeId) === String(item),
      );
      if (auditFound) {
        listAuditTypes.push(auditFound?.auditTypeName);
      }
    });

    return listAuditTypes?.length
      ? listAuditTypes?.map((i) => (
          <div key={i} className={styles.inspectionType}>
            {i}
          </div>
        ))
      : null;
  }, [header?.auditTypes, internalAuditReportDetail?.iarAuditTypes]);

  return useMemo(
    () => (
      <CollapseUI
        title={
          hideSerialNumber
            ? header?.topic
            : `${header?.serialNumber}. ${header?.topic}`
        }
        collapseClassName={styles.collapse}
        collapseHeaderClassName={styles.wrapCollapse}
        badges={renderInspectionType}
        isOpen={isOpen}
        content={
          <div className={styles.formContainer}>
            {renderSubHeaderByType}
            {listSubHeaderRecursive.length > 0 ? (
              <>
                {sortIarHeaders(listSubHeaderRecursive).map((i) => (
                  <SubReportHeader
                    subHeader={i}
                    isOpen={listChildrenCollapse.some(
                      (ip) => ip === i.reportHeaderId,
                    )}
                    isEdit={isEdit}
                    handleCollapseSubHeader={() =>
                      handleCollapseSubHeader(i.reportHeaderId)
                    }
                    key={i.id}
                  />
                ))}
              </>
            ) : null}
          </div>
        }
        toggle={() => setIsOpen((prev) => !prev)}
      />
    ),
    [
      hideSerialNumber,
      header?.topic,
      header?.serialNumber,
      renderInspectionType,
      isOpen,
      renderSubHeaderByType,
      listSubHeaderRecursive,
      listChildrenCollapse,
      isEdit,
      handleCollapseSubHeader,
    ],
  );
};

export default ReportHeader;
