import { useCallback, useMemo, useState } from 'react';
import cx from 'classnames';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import TableCp from 'components/common/table/TableCp';
import images from 'assets/images/images';
import { RowComponent } from 'components/common/table/row/rowCp';
import Button, { ButtonType } from 'components/ui/button/Button';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { Action } from 'models/common.model';
import { showConfirmBase } from 'components/ui/modal/confirmBase';

import { handleLongTextTable } from 'helpers/utils.helper';
import styles from './comment.module.scss';
import ModalComment from '../modals/Comment';

interface TableCommentProps {
  comments: { topic: string; description: string; attachments?: string[] }[];
  setData: (state: any) => void;
  loading: boolean;
  className?: any;
  disabled?: boolean;
}

const TableComment = ({
  comments,
  loading,
  setData,
  className,
  disabled,
}: TableCommentProps) => {
  const { t } = useTranslation(I18nNamespace.SELF_ASSESSMENT);
  const [commentSelected, setCommentSelected] = useState({});
  const [indexSelected, setIndexSelected] = useState<number>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const rowLabels = useMemo(
    () => [
      {
        id: 'action',
        label: t('table.action'),
        sort: false,
        width: '100',
      },
      {
        id: 'sno',
        label: t('form.sno'),
        sort: false,
        width: '200',
      },
      {
        id: 'topic',
        label: t('form.topic'),
        sort: false,
        width: '200',
      },
      {
        id: 'descriptionComment',
        label: t('form.descriptionComment'),
        sort: false,
        width: '200',
      },
      {
        id: 'upload',
        label: t('form.upload'),
        sort: false,
        width: '200',
      },
    ],
    [t],
  );

  const handleDelete = useCallback(
    (index: number) => {
      showConfirmBase({
        isDelete: true,
        txTitle: t('deleteTitle'),
        txMsg: t('deleteMessage'),
        onPressButtonRight: () => {
          const newState = [...comments].filter(
            (item, indexItem) => index !== indexItem,
          );
          setData((prev) => ({
            ...prev,
            comments: newState,
          }));
        },
      });
    },
    [comments, setData, t],
  );

  const handleSubmit = useCallback(
    (value, index, isNew) => {
      const dataLength = comments?.length;
      if (index > dataLength) {
        setData((prev) => ({
          ...prev,
          comments: [...prev.comments, value],
        }));
      } else {
        const newState = [...comments];
        newState[index] = value;
        setData((prev) => ({
          ...prev,
          comments: newState,
        }));
      }
      if (isNew) {
        if (isEdit) {
          setIndexSelected(dataLength);
          setIsEdit(false);
        } else {
          setIndexSelected(dataLength + 1);
        }
      } else {
        setIndexSelected(dataLength + 1);
      }
    },
    [comments, setData, isEdit],
  );

  const sanitizeData = useCallback((comment, index) => {
    const finalData = {
      levelNo: index + 1,
      topic: comment.topic,
      description: handleLongTextTable(comment.description),
      upload: comment?.attachments?.length ? (
        <Button
          buttonType={ButtonType.Outline}
          className={styles.btnAttachment}
          onClick={(e) => {
            e.stopPropagation();
            setIsEdit(false);
            setIsOpen(true);
            setIndexSelected(index);
            setCommentSelected(comment);
          }}
        >
          Attachment
        </Button>
      ) : (
        ''
      ),
    };
    return finalData;
  }, []);

  const renderRow = useCallback(
    (isScrollable?: boolean) => {
      if (loading || comments?.length <= 0) {
        return null;
      }
      return (
        <tbody>
          {comments?.map((item, index) => {
            const finalData = sanitizeData(item, index);
            const actions: Action[] = [
              {
                img: images.icons.icEdit,
                function: !disabled
                  ? () => {
                      setIsEdit(true);
                      setIsOpen(true);
                      setIndexSelected(index);
                      setCommentSelected(item);
                    }
                  : undefined,
                feature: Features.QUALITY_ASSURANCE,
                subFeature: SubFeatures.SELF_ASSESSMENT,
                action: ActionTypeEnum.EXECUTE,
                disable: disabled,
              },
              {
                img: images.icons.icRemove,
                function: !disabled ? () => handleDelete(index) : undefined,
                action: ActionTypeEnum.EXECUTE,
                feature: Features.QUALITY_ASSURANCE,
                subFeature: SubFeatures.SELF_ASSESSMENT,
                buttonType: ButtonType.Orange,
                cssClass: 'ms-1',
                disable: disabled,
              },
            ];
            return (
              <RowComponent
                key={item.topic}
                isScrollable={isScrollable}
                data={finalData}
                actionList={actions}
                onClickRow={undefined}
              />
            );
          })}
        </tbody>
      );
    },
    [comments, disabled, handleDelete, loading, sanitizeData],
  );

  const addComment = useCallback(() => {
    setIsEdit(false);
    setIsOpen(true);
    setIndexSelected(comments?.length || 0);
  }, [comments?.length]);

  const toggleCommentModal = useCallback(() => {
    setIsEdit(false);
    setIsOpen(false);
    setIndexSelected(null);
    setCommentSelected(undefined);
  }, []);

  return (
    <div className={cx(styles.wrapperContainer, className)}>
      <div className={cx(styles.containerForm)}>
        <div className="d-flex justify-content-between pb-3">
          <div className={cx('fw-bold ', styles.titleForm)}>{t('comment')}</div>
          <Button
            onClick={addComment}
            disabled={disabled}
            disabledCss={disabled}
            className={styles.btnAdd}
            renderSuffix={
              <img
                src={images.icons.icAddCircle}
                alt="createNew"
                className={styles.icButton}
              />
            }
          >
            {t('button.addNew')}
          </Button>
        </div>
        <TableCp
          rowLabels={rowLabels}
          classNameNodataWrapper={styles.noData}
          isEmpty={!loading && (comments?.length === 0 || !comments)}
          renderRow={renderRow}
          loading={loading}
          scrollVerticalAttachment
        />
        <ModalComment
          isOpen={isOpen}
          index={indexSelected}
          comment={commentSelected}
          disabled={disabled}
          handleSubmitForm={handleSubmit}
          toggle={toggleCommentModal}
        />
      </div>
    </div>
  );
};

export default TableComment;
