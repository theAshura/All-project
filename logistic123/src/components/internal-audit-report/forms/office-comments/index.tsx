import Tooltip from 'antd/lib/tooltip';
import images from 'assets/images/images';
import cx from 'classnames';
import { RowComponent } from 'components/common/table/row/rowCp';
import TableCp from 'components/common/table/TableCp';
import { InternalAuditReportStatus } from 'components/internal-audit-report/details';
import {
  CommentModalType,
  showCommentModal,
} from 'components/internal-audit-report/forms/common/modals/comment-modal/CommentModal';
import Button, { ButtonType } from 'components/ui/button/Button';
import { CollapseUI } from 'components/ui/collapse/CollapseUI';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { CommonQuery, TOOLTIP_COLOR } from 'constants/common.const';
import {
  CommentProps,
  InternalAuditReportFormContext,
} from 'contexts/internal-audit-report/IARFormContext';
import { formatDateLocalWithTime } from 'helpers/date.helper';
import { Action } from 'models/common.model';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { INSPECTION_REPORT_FIELDS_DETAILS } from 'constants/dynamic/inspection-report.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { useCallback, useContext, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import styles from '../form.module.scss';

const OfficeComments = ({ dynamicLabels }) => {
  const rowLabels = useMemo(
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
        sort: true,
        width: '100',
      },
      {
        id: 'comment',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS.Comment,
        ),
        sort: true,
        width: '100',
        maxWidth: '400',
      },
      {
        id: 'commentedBy',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS['Commented by'],
        ),
        sort: true,
        width: '100',
        maxWidth: '200',
      },
      {
        id: 'jobTitle',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS['Job title'],
        ),
        sort: true,
        width: '100',
        maxWidth: '200',
      },
      {
        id: 'commentedDate',
        label: renderDynamicLabel(
          dynamicLabels,
          INSPECTION_REPORT_FIELDS_DETAILS['Commented date'],
        ),
        sort: true,
        width: '70',
      },
    ],
    [dynamicLabels],
  );

  const { officeComment, handleSetOfficeComment } = useContext(
    InternalAuditReportFormContext,
  );
  const { internalAuditReportDetail } = useSelector(
    (store) => store.internalAuditReport,
  );
  const { search } = useLocation();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const isEdit = useMemo(() => {
    if (search === CommonQuery.EDIT) {
      return true;
    }
    return false;
  }, [search]);

  const handleDelete = useCallback(
    (idComment: string) => {
      const newAttachments = officeComment?.filter(
        (item) => item.id !== idComment,
      );
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
        onPressButtonRight: () => handleSetOfficeComment(newAttachments),
      });
    },
    [dynamicLabels, handleSetOfficeComment, officeComment],
  );

  const sanitizeData = (item: CommentProps, index: number) => {
    const finalData = {
      id: item.id,
      sNo: index + 1,
      comment: (
        <Tooltip
          placement="topLeft"
          title={item?.comment}
          color={TOOLTIP_COLOR}
        >
          <span className="limit-line-text-extend">{item?.comment}</span>
        </Tooltip>
      ),
      commentedBy: item?.commentedBy,
      jobTitle: item?.jobTitle,
      commentedDate: formatDateLocalWithTime(item.commentedDate),
    };
    return finalData;
  };

  const renderRow = useCallback(
    (isScrollable?: boolean) => {
      if (officeComment?.length > 0) {
        return (
          <tbody>
            {officeComment?.map((item, index) => {
              const finalData = sanitizeData(item, index);
              const actions: Action[] = [
                {
                  img: images.icons.icRemove,
                  function: () => handleDelete(item?.id),
                  feature: Features.AUDIT_INSPECTION,
                  subFeature: SubFeatures.INTERNAL_AUDIT_REPORT,
                  action: ActionTypeEnum.DELETE,
                  buttonType: ButtonType.Orange,
                  cssClass: 'ms-1',
                },
              ];
              return (
                <RowComponent
                  key={item.id}
                  isScrollable={isScrollable}
                  data={finalData}
                  actionList={isEdit ? actions : []}
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
    [handleDelete, isEdit, officeComment, rowLabels],
  );

  const disableAddOfficeComment = useMemo(() => {
    // const isPIC =
    //   internalAuditReportDetail?.nonConformities?.data?.some(
    //     (i) => i.picId === userInfo?.id,
    //   ) ||
    //   internalAuditReportDetail?.observations?.data?.some(
    //     (i) => i.picId === userInfo?.id,
    //   );

    const isCloseOut =
      internalAuditReportDetail?.status === InternalAuditReportStatus.CLOSEOUT;
    // const isDraft =
    //   internalAuditReportDetail?.status === InternalAuditReportStatus.DRAFT;
    if (!isEdit || isCloseOut) {
      return true;
    }
    return false;
  }, [internalAuditReportDetail?.status, isEdit]);

  return (
    <CollapseUI
      title={renderDynamicLabel(
        dynamicLabels,
        INSPECTION_REPORT_FIELDS_DETAILS['Office comments'],
      )}
      collapseClassName={styles.collapse}
      isOpen={isOpen}
      content={
        <>
          {!disableAddOfficeComment ? (
            <div className="d-flex justify-content-end pb-4">
              <Button
                renderSuffix={
                  <img
                    className={cx('ps-2')}
                    src={images.icons.icPlusCircle}
                    alt="plus"
                  />
                }
                onClick={() =>
                  showCommentModal({
                    commentType: CommentModalType.OFFICE,
                    label: renderDynamicLabel(
                      dynamicLabels,
                      INSPECTION_REPORT_FIELDS_DETAILS['Office comments'],
                    ),
                  })
                }
              >
                {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Add)}
              </Button>
            </div>
          ) : null}
          <TableCp
            loading={false}
            rowLabels={rowLabels}
            renderRow={renderRow}
            isEmpty={!officeComment?.length || !officeComment}
            classNameNodataWrapper={styles.dataWrapperEmpty}
          />
        </>
      }
      toggle={() => setIsOpen((prev) => !prev)}
    />
  );
};

export default OfficeComments;
