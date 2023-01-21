import { RowComponent } from 'components/common/table/row/rowCp';
import TableCp from 'components/common/table/TableCp';
import { CollapseUI } from 'components/ui/collapse/CollapseUI';
import { InternalAuditReportFormContext } from 'contexts/internal-audit-report/IARFormContext';
import { formatDateTime } from 'helpers/utils.helper';
import { FC, useCallback, useContext, useState, useMemo } from 'react';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { INSPECTION_REPORT_FIELDS_DETAILS } from 'constants/dynamic/inspection-report.const';
import { TOOLTIP_COLOR } from 'constants/common.const';
import Tooltip from 'antd/lib/tooltip';
import { CommentComponent } from './Comment';
import styles from '../form.module.scss';
import '../form.scss';

interface Props {
  isEdit: boolean;
  dynamicLabels?: IDynamicLabel;
}

const InternalAuditComments: FC<Props> = (props) => {
  const { isEdit, dynamicLabels } = props;
  const {
    internalAuditComments,
    listLastAuditFindings,
    handleFillComment,
    setTouched,
  } = useContext(InternalAuditReportFormContext);

  const rowLabels = useMemo(
    () => [
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
        id: 'auditDate',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS['Inspection date'],
        ),
        width: '120',
        sort: false,
      },
      {
        id: 'auditType',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS['Inspection type'],
        ),
        sort: false,
        width: '100',
        maxWidth: '300',
      },
      {
        id: 'natureOfFinding',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS['Nature of findings'],
        ),
        sort: false,
        width: '160',
      },
      {
        id: 'finding',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS.Finding,
        ),
        sort: false,
        width: '100',
        maxWidth: '400',
      },
      {
        id: 'ncVerification',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS['NC verification'],
        ),
        sort: false,
        width: '120',
      },
      {
        id: 'ncStatus',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS['NC status'],
        ),
        sort: false,
        width: '120',
      },
    ],
    [dynamicLabels],
  );

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const sanitizeData = (item) => {
    const finalData = {
      auditNumber: item?.internalAuditReport?.planningRequest?.auditNo,
      auditDate: formatDateTime(
        item?.internalAuditReport?.planningRequest?.auditTimeTable?.actualFrom,
      ),
      auditType: (
        <Tooltip
          placement="topLeft"
          title={item?.auditType?.name}
          color={TOOLTIP_COLOR}
        >
          <span className="limit-line-text">{item?.auditTypeName}</span>
        </Tooltip>
      ),
      natureOfFinding: item?.natureFindingName,
      finding: (
        <Tooltip
          placement="topLeft"
          title={item?.findingComment}
          color={TOOLTIP_COLOR}
        >
          <span className="limit-line-text">{item?.findingComment}</span>
        </Tooltip>
      ),
      ncVerification: item?.isVerify ? 'true' : 'false',
      ncStatus: item?.isOpen ? 'open' : 'close',
    };
    return finalData;
  };

  const renderRow = useCallback(
    (isScrollable?: boolean) => {
      if (listLastAuditFindings?.length > 0) {
        return (
          <tbody>
            {listLastAuditFindings?.map((item) => {
              const finalData = sanitizeData(item);
              return (
                <RowComponent
                  key={item.id}
                  isScrollable={isScrollable}
                  data={finalData}
                  onClickRow={undefined}
                  rowLabels={rowLabels}
                />
              );
            })}
          </tbody>
        );
      }
      return null;
    },
    [listLastAuditFindings, rowLabels],
  );

  const handleOnChangeComment = useCallback(
    (field: string, value: string) => {
      handleFillComment(field, value);
    },
    [handleFillComment],
  );

  return (
    <CollapseUI
      title={renderDynamicLabel(
        dynamicLabels,
        INSPECTION_REPORT_FIELDS_DETAILS['Inspection comments'],
      )}
      collapseClassName={styles.collapse}
      isOpen={isOpen}
      content={
        <div className={styles.internalAuditComments}>
          {internalAuditComments.map((i) => (
            <CommentComponent
              key={i.label}
              {...i}
              label={renderDynamicLabel(
                dynamicLabels,
                INSPECTION_REPORT_FIELDS_DETAILS[i.label],
              )}
              placeholder={
                isEdit
                  ? renderDynamicLabel(
                      dynamicLabels,
                      INSPECTION_REPORT_FIELDS_DETAILS[
                        `Enter ${String(i.label).toLocaleLowerCase()}`
                      ] || `Enter ${String(i.label).toLocaleLowerCase()}`,
                    )
                  : ''
              }
              isEdit={isEdit}
              dynamicLabels={dynamicLabels}
              handleOnChangeComment={(field: string, value: string) => {
                handleOnChangeComment(field, value);
                setTouched(true);
              }}
            />
          ))}
          <p className={styles.titleForm}>
            {renderDynamicLabel(
              dynamicLabels,
              INSPECTION_REPORT_FIELDS_DETAILS['Status of last audit findings'],
            )}
          </p>
          <TableCp
            isHiddenAction
            loading={false}
            rowLabels={rowLabels}
            renderRow={renderRow}
            isEmpty={!listLastAuditFindings || !listLastAuditFindings?.length}
            classNameNodataWrapper={styles.dataWrapperEmpty}
          />
        </div>
      }
      toggle={() => setIsOpen((prev) => !prev)}
    />
  );
};

export default InternalAuditComments;
