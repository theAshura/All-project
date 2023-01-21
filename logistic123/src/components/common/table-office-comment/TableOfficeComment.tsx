import { yupResolver } from '@hookform/resolvers/yup';
import images from 'assets/images/images';
import cx from 'classnames';
import NoDataImg from 'components/common/no-data/NoData';
import { RowComponent } from 'components/common/table/row/rowCp';
import TableCp from 'components/common/table/TableCp';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { GroupButton } from 'components/ui/button/GroupButton';
import Input from 'components/ui/input/Input';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import ModalComponent from 'components/ui/modal/Modal';
import { ActivePermission, MaxLength } from 'constants/common.const';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';
import { formatDateTime } from 'helpers/utils.helper';
import { RofOfficeComments } from 'models/api/report-of-finding/report-of-finding.model';
import { Action } from 'models/common.model';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { DETAIL_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-follow-up.const';
import { useSelector } from 'react-redux';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import * as yup from 'yup';
import styles from './form.module.scss';

interface TableOfficeCommentProps {
  loading?: boolean;
  value?: RofOfficeComments[];
  onchange?: (comment) => void;
  disable?: boolean;
  feature?: string;
  dynamicLabels?: IDynamicLabel;
  subFeature?: string;
}
const defaultValues = {
  comment: '',
};

export const TableOfficeComment: FC<TableOfficeCommentProps> = (props) => {
  const { workFlowActiveUserPermission } = useSelector(
    (state) => state.workFlow,
  );
  const {
    loading,
    value,
    onchange,
    disable,
    feature,
    subFeature,
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
  const [comment, setComment] = useState<RofOfficeComments[]>(value);
  const rowLabels = useMemo(
    () => [
      {
        id: 'action',
        label: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS.Action,
        ),
        sort: false,
        width: '100',
      },
      {
        id: 'sNo',
        label: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS['S.No'],
        ),
        sort: true,
        width: '100',
      },
      {
        id: 'comment',
        label: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS.Comment,
        ),
        sort: true,
        width: '210',
      },
      {
        id: 'commentedBy',
        label: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS['Commented by'],
        ),
        sort: true,
        width: '100',
        maxWidth: '200',
      },
      {
        id: 'jobTitle',
        label: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS['Job title'],
        ),
        sort: true,
        width: '100',
        maxWidth: '200',
      },
      {
        id: 'commentedDate',
        label: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS['Commented date'],
        ),
        sort: true,
        width: '70',
      },
    ],
    [dynamicLabels],
  );

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [comment],
  );

  const handleDelete = useCallback(
    (index?) =>
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
      }),
    [dynamicLabels, onDeleteComment],
  );

  const sanitizeData = (data, index) => {
    const finalData = {
      id: data?.id || index,
      sNo: index + 1,
      comment: data?.comment || '',
      commentedBy: data?.createdUser?.username || '',
      jobTitle: data?.createdUser?.jobTitle || '',
      commentedDate: formatDateTime(data?.createdAt) || '',
    };
    return finalData;
  };

  const checkWorkFlow = useMemo(() => {
    if (
      workFlowActiveUserPermission.some(
        (item) => item === ActivePermission.CREATOR,
      )
    ) {
      return true;
    }
    return false;
  }, [workFlowActiveUserPermission]);

  const renderRow = useCallback(
    (isScrollable?: boolean) => {
      if (!loading && comment?.length > 0) {
        return (
          <tbody>
            {comment?.map((item, index) => {
              const finalData = sanitizeData(item, index);
              const actions: Action[] = [
                {
                  img: images.icons.icRemove,
                  function: !disable ? () => handleDelete(index) : undefined,
                  feature: feature || Features.AUDIT_INSPECTION,
                  subFeature: subFeature || SubFeatures.PLANNING_AND_REQUEST,
                  //   action: ActionTypeEnum.DELETE,
                  buttonType: ButtonType.Orange,
                  disable,
                },
              ];
              return (
                <RowComponent
                  isScrollable={isScrollable}
                  data={finalData}
                  actionList={actions}
                  validWordFlow={checkWorkFlow}
                  rowLabels={rowLabels}
                  key={item?.serialNumber}
                />
              );
            })}
          </tbody>
        );
      }
      return null;
    },
    [
      loading,
      comment,
      feature,
      disable,
      subFeature,
      checkWorkFlow,
      rowLabels,
      handleDelete,
    ],
  );

  const renderForm = () => (
    <>
      <div>
        <Input
          isRequired
          label={renderDynamicLabel(
            dynamicLabels,
            DETAIL_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS['Office comment'],
          )}
          {...register('comment')}
          messageRequired={errors?.comment?.message || ''}
          placeholder={renderDynamicLabel(
            dynamicLabels,
            DETAIL_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS['Enter comment'],
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

  return (
    <div className={cx('mt-4', styles.wrapperContainer)}>
      <div className={cx(styles.containerForm)}>
        <div className="d-flex justify-content-between align-items-center">
          <div className={cx(styles.titleContainer)}>
            {renderDynamicLabel(
              dynamicLabels,
              DETAIL_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS[
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
        <div className={cx('pt-4', styles.table)}>
          {comment?.length ? (
            <TableCp
              rowLabels={rowLabels}
              renderRow={renderRow}
              loading={loading}
              isEmpty={undefined}
            />
          ) : (
            <NoDataImg />
          )}
        </div>
      </div>
      <ModalComponent
        isOpen={modal}
        toggle={() => {
          setModal(false);
        }}
        title={renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_FOLLOW_UP_DYNAMIC_FIELDS['Add comment'],
        )}
        content={renderForm()}
        footer={renderFooter()}
      />
    </div>
  );
};
