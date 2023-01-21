import { FC, useMemo, useCallback, useEffect, useState } from 'react';
import { yupResolver } from '@hookform/resolvers/yup';
import images from 'assets/images/images';
import cx from 'classnames';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { PlanningRequestOfficeComments } from 'models/api/planning-and-request/planning-and-request.model';
import { GroupButton } from 'components/ui/button/GroupButton';
import Input from 'components/ui/input/Input';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { DETAIL_PLANNING_DYNAMIC_FIELDS } from 'constants/dynamic/planning.const';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import ModalComponent from 'components/ui/modal/Modal';
import { MaxLength } from 'constants/common.const';
import { formatDateNoTime } from 'helpers/date.helper';

import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import { dateStringComparator } from 'helpers/utils.helper';
import { getListTemplateDictionaryActions } from 'store/template/template.action';
import { DEFAULT_COL_DEF_TYPE_FLEX_QA } from 'constants/components/ag-grid.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { Action } from 'models/common.model';
import { FieldValues, useForm } from 'react-hook-form';

import * as yup from 'yup';
import { useDispatch } from 'react-redux';
import styles from './form.module.scss';

// interface Comment {
//   serialNumber?: string;
//   comment?: string;
// }
interface TableOfficeCommentProps {
  loading?: boolean;
  value?: PlanningRequestOfficeComments[];
  onchange?: (comment) => void;
  disable?: boolean;
  pageSizeDefault?: number;
  moduleTemplate?: string;
  aggridId?: string;
  dynamicLabels?: IDynamicLabel;
}
const defaultValues = {
  comment: '',
};

export const TableOfficeComment: FC<TableOfficeCommentProps> = (props) => {
  const {
    loading,
    value,
    onchange,
    disable,
    moduleTemplate,
    pageSizeDefault,
    aggridId,
    dynamicLabels,
  } = props;

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
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

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
  const [comment, setComment] =
    useState<PlanningRequestOfficeComments[]>(value);

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
          placeholder={renderDynamicLabel(
            dynamicLabels,
            DETAIL_PLANNING_DYNAMIC_FIELDS['Enter comment'],
          )}
          label={renderDynamicLabel(
            dynamicLabels,
            DETAIL_PLANNING_DYNAMIC_FIELDS['Office comment'],
          )}
          {...register('comment')}
          messageRequired={errors?.comment?.message || ''}
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
          handleCancel={handleCancel}
          dynamicLabels={dynamicLabels}
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal]);

  useEffect(() => {
    setComment(value);
  }, [value]);

  const checkWorkflow = useCallback(
    (item, index) => {
      const actions: Action[] = [
        {
          img: images.icons.icRemove,
          function: () => handleDelete(index),
          feature: Features.AUDIT_INSPECTION,
          subFeature: SubFeatures.PLANNING_AND_REQUEST,
          action: ActionTypeEnum.EXECUTE,
          buttonType: ButtonType.Orange,
          // disable,
        },
      ];
      return actions;
    },
    [handleDelete],
  );

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_PLANNING_DYNAMIC_FIELDS.Action,
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
                // styles.subAction,
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
          DETAIL_PLANNING_DYNAMIC_FIELDS['S.No'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'comment',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_PLANNING_DYNAMIC_FIELDS.Comment,
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'commentBy',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_PLANNING_DYNAMIC_FIELDS['Commented by'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'jobTitle',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_PLANNING_DYNAMIC_FIELDS['Job title'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'commentedDate',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_PLANNING_DYNAMIC_FIELDS['Commented date'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
    ],
    [dynamicLabels, isMultiColumnFilter, checkWorkflow],
  );
  const getList = useCallback(() => {
    dispatch(
      getListTemplateDictionaryActions.request({
        content: moduleTemplate,
      }),
    );
  }, [dispatch, moduleTemplate]);

  const dataTable = useMemo(
    () =>
      comment.map((data, index) => ({
        id: index,
        sNo: index + 1,
        comment: data.comment,
        commentBy:
          data?.updatedUser?.username || data?.createdUser?.username || '',
        jobTitle:
          data?.updatedUser?.jobTitle || data?.createdUser?.username || '',
        commentedDate: formatDateNoTime(data?.updatedAt),
      })) || [],
    [comment],
  );

  return (
    <div
      className={cx(
        'mt-3',
        styles.wrapperContainer,
        styles.wrapperContainerHeight,
      )}
    >
      <div className={cx(styles.containerForm)}>
        <div className="d-flex justify-content-between align-items-center">
          <div className={cx(styles.titleContainer)}>
            {renderDynamicLabel(
              dynamicLabels,
              DETAIL_PLANNING_DYNAMIC_FIELDS[
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
            {renderDynamicLabel(
              dynamicLabels,
              DETAIL_PLANNING_DYNAMIC_FIELDS.Add,
            )}
          </Button>
        </div>
        <div className={cx('pt-2')}>
          <AGGridModule
            loading={loading}
            params={null}
            setIsMultiColumnFilter={setIsMultiColumnFilter}
            hasRangePicker={false}
            columnDefs={columnDefs}
            dataFilter={null}
            moduleTemplate={moduleTemplate}
            fileName="Table office comment"
            dataTable={dataTable}
            height="275px"
            colDefProp={DEFAULT_COL_DEF_TYPE_FLEX_QA}
            getList={getList}
            pageSizeDefault={pageSizeDefault}
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
          DETAIL_PLANNING_DYNAMIC_FIELDS['Add comment'],
        )}
        content={renderForm()}
        footer={renderFooter()}
      />
    </div>
  );
};
