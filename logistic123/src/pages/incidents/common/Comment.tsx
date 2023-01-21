import { FC, useMemo, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import images from 'assets/images/images';
import cx from 'classnames';
import { RowComponent } from 'components/common/table/row/rowCp';
import TableCp from 'components/common/table/TableCp';
import Button, { ButtonType } from 'components/ui/button/Button';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { I18nNamespace } from 'constants/i18n.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { Action } from 'models/common.model';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import * as yup from 'yup';
import { formatDateLocalWithTime } from 'helpers/date.helper';
import { DATA_SPACE } from 'constants/components/ag-grid.const';
import { IComment } from 'pages/vessel-screening/utils/models/common.model';
import styles from './comment.module.scss';
import { ModalComment } from './ModalComment';

interface TableCommentProps {
  loading?: boolean;
  value?: IComment[];
  onchange?: (comment) => void;
  disable?: boolean;
  className?: string;
  classNameBtn?: string;
}

const defaultValues = {
  comments: [],
};

export const TableComment: FC<TableCommentProps> = ({
  loading,
  value,
  onchange,
  disable,
  className,
  classNameBtn,
}) => {
  const { t } = useTranslation([
    I18nNamespace.VESSEL_SCREENING,
    I18nNamespace.COMMON,
  ]);
  const [modal, setModal] = useState(false);
  const [comments, setComments] = useState<IComment[]>(value || []);
  const [selected, setSelected] = useState<IComment>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(null);

  const { userInfo } = useSelector((state) => state.authenticate);

  const schema = useMemo(
    () =>
      yup.object().shape({
        comments: yup.string().trim().nullable().required(t('errors.required')),
      }),
    [t],
  );

  const { reset } = useForm<FieldValues>({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const rowLabels = useMemo(
    () => [
      {
        id: 'action',
        label: t('buttons.txAction'),
        sort: false,
        width: '100',
      },
      {
        id: 'sNo',
        label: t('table.sNo'),
        sort: false,
        width: '50',
      },
      {
        id: 'comment',
        label: t('table.txComment'),
        sort: false,
        width: '150',
      },
      {
        id: 'createdDate',
        label: t('table.createdDate'),
        sort: false,
        width: '150',
      },
      {
        id: 'createdByUser',
        label: t('table.createdByUser'),
        sort: false,
        width: '150',
      },
      {
        id: 'updatedDate',
        label: t('table.updatedDate'),
        sort: false,
        width: '150',
      },
      {
        id: 'updatedByUser',
        label: t('table.updatedByUser'),
        sort: false,
        width: '150',
      },
    ],
    [t],
  );

  const onSubmitForm = useCallback(
    (data) => {
      const newComment = comments ? [...comments] : [];
      if (Number.isInteger(index)) {
        newComment[index].comment = data?.comment;
      } else {
        newComment.unshift(data);
      }
      onchange(newComment);
      setModal(false);
    },
    [comments, index, onchange],
  );

  const onDeleteComment = useCallback(
    (index) => {
      const newComment = comments ? [...comments] : [];
      newComment.splice(index, 1);
      onchange(newComment);
    },
    [comments, onchange],
  );

  const editDetail = useCallback((item, index) => {
    setIsEdit(true);
    setSelected(item);
    setModal(true);
    setIndex(index);
  }, []);
  const viewDetail = useCallback((item, index) => {
    setIsEdit(false);
    setSelected(item);
    setModal(true);
    setIndex(index);
  }, []);

  const handleDelete = useCallback(
    (index) => {
      showConfirmBase({
        isDelete: true,
        txTitle: t('modal.delete'),
        txMsg: t('modal.areYouSureYouWantToDelete'),
        onPressButtonRight: () => onDeleteComment(index),
      });
    },
    [onDeleteComment, t],
  );

  const sanitizeData = useCallback((data: IComment, index) => {
    const finalData = {
      id: index,
      no: index + 1,
      comment: data?.comment,
      createdDate: data?.createdAt
        ? formatDateLocalWithTime(data?.createdAt)
        : DATA_SPACE,
      createdByUser: data?.createdUser?.username,
      updatedDate: data?.updatedUser
        ? formatDateLocalWithTime(data?.updatedAt)
        : DATA_SPACE,
      updatedByUser: data?.updatedUser
        ? data?.updatedUser?.username
        : DATA_SPACE,
    };
    return finalData;
  }, []);

  const checkIsCreatedUser = useCallback(
    (item: IComment) => {
      if (
        (!item.createdUser || userInfo.id === item.createdUser?.id) &&
        !disable
      ) {
        return true;
      }
      return false;
    },
    [disable, userInfo.id],
  );

  const renderRow = useCallback(
    (isScrollable?: boolean) => {
      if (!loading && comments?.length > 0) {
        return (
          <tbody>
            {comments?.map((item, index) => {
              const finalData = sanitizeData(item, index);
              let actions: Action[] = [
                {
                  img: images.icons.icViewDetail,
                  function: () => viewDetail(item, index),
                  feature: Features.QUALITY_ASSURANCE,
                  subFeature: SubFeatures.INCIDENTS,
                  action: ActionTypeEnum.VIEW,
                  buttonType: ButtonType.Blue,
                  cssClass: 'me-1',
                },
              ];
              if (checkIsCreatedUser(item)) {
                const extraActions = [
                  {
                    img: images.icons.icEdit,
                    function: !disable
                      ? () => editDetail(item, index)
                      : undefined,
                    feature: Features.QUALITY_ASSURANCE,
                    subFeature: SubFeatures.INCIDENTS,
                    action: ActionTypeEnum.UPDATE,
                    cssClass: 'me-1',
                    disable,
                  },
                  {
                    img: images.icons.icRemove,
                    function: !disable ? () => handleDelete(index) : undefined,
                    feature: Features.QUALITY_ASSURANCE,
                    subFeature: SubFeatures.INCIDENTS,
                    action: ActionTypeEnum.DELETE,
                    buttonType: ButtonType.Orange,
                    disable,
                  },
                ];
                actions = [...actions, ...extraActions];
              }

              return (
                <RowComponent
                  isScrollable={isScrollable}
                  data={finalData}
                  actionList={actions}
                  rowLabels={rowLabels}
                  key={item?.id}
                />
              );
            })}
          </tbody>
        );
      }
      return null;
    },
    [
      checkIsCreatedUser,
      comments,
      disable,
      editDetail,
      handleDelete,
      loading,
      rowLabels,
      sanitizeData,
      viewDetail,
    ],
  );

  useEffect(() => {
    if (!modal) {
      reset(defaultValues);
      setIndex(null);
      setSelected(null);
      setIsEdit(false);
    }
  }, [modal, reset]);

  useEffect(() => {
    setComments(value);
  }, [value]);

  return (
    <div className={cx('mt-3', styles.wrapperContainer, className)}>
      <div className={cx(styles.containerForm)}>
        <div className="d-flex justify-content-between align-items-center">
          <div className={cx(styles.titleContainer)}>{t('labels.comment')}</div>
          {!disable && (
            <Button
              onClick={() => {
                setIsEdit(true);
                setModal(true);
                setIndex(null);
              }}
              className={cx('mt-auto ', styles.button, classNameBtn)}
              renderSuffix={
                <img
                  src={images.icons.icAddCircle}
                  alt="createNew"
                  className={styles.icButton}
                />
              }
            >
              {t('addNew')}
            </Button>
          )}
        </div>
        <div className={cx('pt-4', styles.table)}>
          {comments?.length ? (
            <TableCp
              rowLabels={rowLabels}
              renderRow={renderRow}
              loading={loading}
              isEmpty={undefined}
              scrollVerticalAttachment
            />
          ) : (
            <div className={cx(styles.dataWrapperEmpty)}>
              <img
                src={images.icons.icNoData}
                className={styles.noData}
                alt="no data"
              />
            </div>
          )}
        </div>
      </div>
      <ModalComment
        isOpen={modal}
        toggle={() => {
          setModal((e) => !e);
          setIsEdit(false);
          setIndex(null);
          setSelected(null);
        }}
        isEdit={isEdit}
        data={selected}
        handleSubmitForm={onSubmitForm}
      />
    </div>
  );
};
