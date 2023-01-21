import { FC, useCallback, useMemo, useState } from 'react';
import cx from 'classnames';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import images from 'assets/images/images';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { Action } from 'models/common.model';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import TableCp from 'components/common/table/TableCp';
import Button, { ButtonType } from 'components/ui/button/Button';
import { RowComponent } from 'components/common/table/row/rowCp';
import NoDataImg from 'components/common/no-data/NoData';
import { ReviewType } from 'models/api/incident-investigation/incident-investigation.model';
import { handleLongTextTable } from 'helpers/utils.helper';
import styles from './form.module.scss';
import ModalAddReview from '../common/ModalReview';
import './table.scss';

interface AddReviewProps {
  reviews: ReviewType[];
  setData: (data) => void;
  disabled?: boolean;
  loading?: boolean;
  className?: any;
}

const AddReview: FC<AddReviewProps> = ({
  loading,
  reviews,
  disabled = false,
  setData,
  className,
}) => {
  const { t } = useTranslation(I18nNamespace.SAIL_GENERAL_REPORT);
  const [itemSelected, setItemSelected] = useState<any>(null);
  const [indexSelected, setIndexSelected] = useState<number>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const handleDelete = useCallback(
    (index: number) => {
      showConfirmBase({
        isDelete: true,
        txTitle: t('deleteTitle'),
        txMsg: t('deleteMessage'),
        onPressButtonRight: () => {
          const newState = [...reviews].filter(
            (item, indexItem) => index !== indexItem,
          );
          setData(newState);
        },
      });
    },
    [reviews, setData, t],
  );

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
        label: t('sNoTx'),
        sort: false,
        width: '200',
      },
      {
        id: 'remark',
        label: t('remark'),
        sort: false,
        width: '200',
      },
      {
        id: 'riskFactor',
        label: t('table.riskFactor'),
        sort: false,
        width: '200',
      },
      {
        id: 'vesselAcceptable',
        label: t('table.vesselAcceptable'),
        sort: false,
        width: '200',
      },
      {
        id: 'incidentStatus',
        label: t('table.incidentStatus'),
        sort: false,
        width: '200',
      },
      {
        id: 'attachment',
        label: t('attachment'),
        sort: false,
        width: '200',
      },
    ],
    [t],
  );

  const handleSubmit = useCallback(
    (dataForm: any, index?: number, isNew?: boolean) => {
      const newState = reviews ? [...reviews] : [];
      // Edit
      if (isEdit && Number.isInteger(index)) {
        setData(
          newState.map((item, indexItem) =>
            index === indexItem ? dataForm : item,
          ),
        );
      } else {
        // Create
        setData([...newState, dataForm]);
      }
      if (isNew) {
        setIsEdit(false);
      }
      setIndexSelected(null);
    },
    [reviews, setData, isEdit],
  );

  const sanitizeData = useCallback((review, index) => {
    const finalData = {
      sno: index + 1,
      remark: handleLongTextTable(review.remark || ''),
      riskFactor: review.riskFactor?.name || '',
      vesselAcceptable: review.vesselAcceptable || '',
      incidentStatus: review.incidentStatus || '',
      attachment: review?.attachments?.length ? (
        <Button
          buttonType={ButtonType.Outline}
          className={styles.btnAttachment}
          onClick={(e) => {
            e.stopPropagation();
            setIsEdit(true);
            setIsOpen(true);
            setIndexSelected(index);
            setItemSelected(review);
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
      if (loading || reviews?.length <= 0) {
        return null;
      }
      return (
        <tbody>
          {reviews?.map((item, index) => {
            const finalData = sanitizeData(item, index);
            const actions: Action[] = [
              {
                img: images.icons.icViewDetail,
                function: () => {
                  setIsEdit(false);
                  setIsOpen(true);
                  setIndexSelected(index);
                  setItemSelected(item);
                },
                feature: Features.QUALITY_ASSURANCE,
                subFeature: SubFeatures.SAIL_GENERAL_REPORT,
                action: ActionTypeEnum.VIEW,
                cssClass: 'me-1',
              },
              {
                img: images.icons.icEdit,
                function: !disabled
                  ? () => {
                      setIsEdit(true);
                      setIsOpen(true);
                      setIndexSelected(index);
                      setItemSelected(item);
                    }
                  : undefined,
                feature: Features.QUALITY_ASSURANCE,
                subFeature: SubFeatures.SAIL_GENERAL_REPORT,
                action: ActionTypeEnum.UPDATE,
                disable: disabled,
              },
              {
                img: images.icons.icRemove,
                function: !disabled ? () => handleDelete(index) : undefined,
                action: ActionTypeEnum.DELETE,
                feature: Features.QUALITY_ASSURANCE,
                subFeature: SubFeatures.SAIL_GENERAL_REPORT,
                buttonType: ButtonType.Orange,
                cssClass: 'ms-1',
                disable: disabled,
              },
            ];
            return (
              <RowComponent
                key={item.id}
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
    [reviews, disabled, handleDelete, loading, sanitizeData],
  );

  return (
    <div className={cx(styles.wrapperContainer)}>
      <div className={cx(styles.containerForm)}>
        <div className="d-flex justify-content-between pb-3">
          <div className={cx('fw-bold ', styles.labelHeader)}>
            {t('additionalReviewTitle')}
          </div>
          {!disabled && (
            <Button
              onClick={() => {
                setIsOpen(true);
                setIndexSelected(null);
                setItemSelected(null);
              }}
              className={styles.btnAdd}
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
        <div className={cx(styles.table, 'table_wrapper')}>
          {!loading && !reviews?.length ? (
            <NoDataImg />
          ) : (
            <TableCp
              rowLabels={rowLabels}
              classNameNodataWrapper={styles.noData}
              isEmpty={undefined}
              renderRow={renderRow}
              loading={false}
              scrollVerticalAttachment
            />
          )}
        </div>

        <ModalAddReview
          isOpen={isOpen}
          index={indexSelected}
          review={itemSelected}
          handleSubmitForm={handleSubmit}
          disabled={disabled || (Number.isInteger(indexSelected) && !isEdit)}
          toggle={() => {
            setIsOpen(false);
            setIsEdit(false);
            setIndexSelected(null);
            setItemSelected(null);
          }}
        />
      </div>
    </div>
  );
};

export default AddReview;
