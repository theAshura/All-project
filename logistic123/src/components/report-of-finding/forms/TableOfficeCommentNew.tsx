import { FC, useMemo, useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import images from 'assets/images/images';
import cx from 'classnames';
import { dateStringComparator, formatDateTime } from 'helpers/utils.helper';
import { getListTemplateDictionaryActions } from 'store/template/template.action';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import { Action } from 'models/common.model';

import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import {
  MODULE_TEMPLATE,
  DEFAULT_COL_DEF_TYPE_FLEX,
} from 'constants/components/ag-grid.const';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { GroupButton } from 'components/ui/button/GroupButton';
import Input from 'components/ui/input/Input';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import ModalComponent from 'components/ui/modal/Modal';
import { MaxLength } from 'constants/common.const';

import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { RofOfficeComments } from 'models/api/report-of-finding/report-of-finding.model';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { FieldValues, useForm } from 'react-hook-form';

import * as yup from 'yup';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS } from 'constants/dynamic/report-of-finding.const';
import styles from './form.module.scss';

interface TableOfficeCommentProps {
  loading?: boolean;
  value?: RofOfficeComments[];
  onchange?: (comment) => void;
  disable?: boolean;
  aggridId?: string;
  dynamicLabels?: IDynamicLabel;
}
const defaultValues = {
  comment: '',
};

export const TableOfficeComment: FC<TableOfficeCommentProps> = (props) => {
  const { loading, value, onchange, disable, aggridId, dynamicLabels } = props;

  const schema = yup.object().shape({
    comment: yup
      .string()
      .trim()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(schema),
  });
  const [modal, setModal] = useState(false);
  const dispatch = useDispatch();
  const [comment, setComment] = useState<RofOfficeComments[]>(value);
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

  const onSubmitForm = (data) => {
    const newComment = [...comment];
    newComment.push(data);
    onchange(newComment);
    setModal(false);
  };

  const handleCancel = () => {
    setModal(false);
  };

  const onDeleteComment = useCallback(
    (index) => {
      const newComment = [...comment];
      newComment.splice(index, 1);
      onchange(newComment);
    },
    [comment, onchange],
  );

  const handleDelete = useCallback(
    (index?) => {
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
        onPressButtonRight: () => onDeleteComment(index),
      });
    },
    [dynamicLabels, onDeleteComment],
  );

  const renderForm = () => (
    <>
      <div>
        <Input
          isRequired
          label={renderDynamicLabel(
            dynamicLabels,
            DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Office comment'],
          )}
          {...register('comment')}
          messageRequired={errors?.comment?.message || ''}
          placeholder={renderDynamicLabel(
            dynamicLabels,
            DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Enter comment'],
          )}
          disabled={loading}
          maxLength={MaxLength.MAX_LENGTH_OPTIONAL}
        />
      </div>
    </>
  );

  const renderFooter = () => (
    <>
      <div>
        <GroupButton
          className={cx(styles.GroupButton, 'mt-4 justify-content-end')}
          buttonTypeLeft={ButtonType.PrimaryLight}
          dynamicLabels={dynamicLabels}
          handleCancel={handleCancel}
          handleSubmit={handleSubmit(onSubmitForm)}
          disable={loading}
        />
      </div>
    </>
  );

  useEffect(() => {
    if (!modal) {
      reset(defaultValues);
    }
  }, [modal, reset]);

  useEffect(() => {
    setComment(value);
  }, [value]);

  const checkWorkflow = useCallback(
    (item, index) => {
      const actions: Action[] = [
        {
          img: images.icons.icRemove,
          function: !disable ? () => handleDelete(index) : undefined,
          feature: Features.AUDIT_INSPECTION,
          subFeature: SubFeatures.REPORT_OF_FINDING,
          action: ActionTypeEnum.EXECUTE,
          buttonType: ButtonType.Orange,
          disable,
        },
      ];
      return actions;
    },
    [disable, handleDelete],
  );

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS.Action,
        ),
        filter: false,
        sortable: false,
        enableRowGroup: false,
        lockPosition: true,
        minWidth: 125,
        maxWidth: 125,
        pinned: 'left',
        cellRendererFramework: (params) => {
          const { data, rowIndex } = params;
          let actions = checkWorkflow(data, rowIndex);
          if (!data) {
            actions = [];
          }
          return (
            <div
              className={cx(
                'd-flex justify-content-start align-items-center',
                styles.subAction,
              )}
            >
              <ActionBuilder actionList={actions} />
            </div>
          );
        },
      },
      {
        field: 'sNo',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['S.No'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'comment',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS.Comment,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'commentedBy',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Commented by'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'jobTitle',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Job title'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'commentedDate',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Commented date'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
    ],
    [dynamicLabels, isMultiColumnFilter, checkWorkflow],
  );

  const dataTable = useMemo(
    () =>
      (!loading &&
        comment?.length > 0 &&
        comment.map((data: any, index) => ({
          id: data?.id || index,
          sNo: index + 1,
          comment: data?.comment || '',
          commentedBy: data?.createdUser?.username || '',
          jobTitle: data?.createdUser?.jobTitle || '',
          commentedDate: formatDateTime(data?.createdAt) || '',
        }))) ||
      [],
    [loading, comment],
  );

  const getList = useCallback(() => {
    dispatch(
      getListTemplateDictionaryActions.request({
        content: MODULE_TEMPLATE.tableOfficeCommentNew,
      }),
    );
  }, [dispatch]);

  return (
    <div
      className={cx(
        'mt-4',
        styles.wrapperContainer,
        styles.wrapperContainerReportOfFinding,
      )}
    >
      <div className={cx(styles.containerForm)}>
        <div className="d-flex justify-content-between align-items-center">
          <div className={cx(styles.titleContainer)}>
            {renderDynamicLabel(
              dynamicLabels,
              DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS[
                'Inspection management team comment'
              ],
            )}
          </div>
          <Button
            disabled={disable}
            disabledCss={disable}
            onClick={() => setModal(true)}
            buttonSize={ButtonSize.Medium}
            buttonType={ButtonType.Primary}
            className={cx('mt-auto ', styles.button)}
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
        </div>
        <div className={cx('pt-2', styles.table)}>
          <AGGridModule
            loading={loading}
            params={null}
            setIsMultiColumnFilter={setIsMultiColumnFilter}
            hasRangePicker={false}
            columnDefs={columnDefs}
            dataFilter={null}
            moduleTemplate={MODULE_TEMPLATE.tableOfficeCommentNew}
            fileName="Table office comment new"
            dataTable={dataTable}
            height="275px"
            colDefProp={DEFAULT_COL_DEF_TYPE_FLEX}
            getList={getList}
            pageSizeDefault={5}
            classNameHeader={styles.header}
            aggridId={aggridId}
          />
        </div>
      </div>
      <ModalComponent
        isOpen={modal}
        toggle={() => {
          setModal(false);
        }}
        title={renderDynamicLabel(
          dynamicLabels,
          DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Add comment'],
        )}
        content={renderForm()}
        footer={renderFooter()}
      />
    </div>
  );
};
