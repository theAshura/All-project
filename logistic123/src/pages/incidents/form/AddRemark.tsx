import { FC, useCallback, useMemo, useState } from 'react';
import cx from 'classnames';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import images from 'assets/images/images';
import Button, { ButtonType } from 'components/ui/button/Button';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { Action } from 'models/common.model';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { formatDateLocalWithTime } from 'helpers/date.helper';
import { DATA_SPACE } from 'constants/components/ag-grid.const';
import NoDataImg from 'components/common/no-data/NoData';
import TableCp from 'components/common/table/TableCp';
import { RowComponent } from 'components/common/table/row/rowCp';
import ModalRemarkType from '../common/ModalRemark';
import styles from './form.module.scss';
import './table.scss';
import { RemarkType } from '../utils/models/common.model';

interface AddRemarkProps {
  values: RemarkType[];
  setRemarkList: (data) => void;
  disable: boolean;
  loading?: boolean;
  title?: string;
  className?: string;
}

const AddRemark: FC<AddRemarkProps> = ({
  values,
  disable,
  setRemarkList,
  loading,
  title,
  className,
}) => {
  const { t } = useTranslation(I18nNamespace.SAIL_GENERAL_REPORT);

  const [itemSelected, setItemSelected] = useState<RemarkType>(null);
  const [indexSelected, setIndexSelected] = useState<number>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleDelete = useCallback(
    (index: number) => {
      showConfirmBase({
        isDelete: true,
        txTitle: t('deleteTitle'),
        txMsg: t('deleteMessage'),
        onPressButtonRight: () => {
          const newState = [...values].filter(
            (item, indexItem) => index !== indexItem,
          );

          setRemarkList(newState);
        },
      });
    },
    [values, setRemarkList, t],
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
        id: 'sNo',
        label: t('sNoTx'),
        sort: false,
        width: '50',
      },
      {
        id: t('additionalRemarks'),
        label: t('remark'),
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

  const sanitizeData = useCallback((item, index) => {
    const finalData = {
      sNo: index + 1,
      remark: item?.remark,
      createdDate: item?.createdAt
        ? formatDateLocalWithTime(item?.createdAt)
        : DATA_SPACE,
      createdByUser: item?.createdUser?.username,
      updatedDate: item?.updatedUser
        ? formatDateLocalWithTime(item?.updatedAt)
        : DATA_SPACE,
      updatedByUser: item?.updatedUser
        ? item?.updatedUser?.username
        : DATA_SPACE,
    };
    return finalData;
  }, []);

  const renderRow = useCallback(
    (isScrollable?: boolean) => {
      if (loading || values?.length <= 0) {
        return null;
      }
      return (
        <tbody>
          {values?.map((item, index) => {
            const finalData = sanitizeData(item, index);
            const actions: Action[] = [
              {
                img: images.icons.icViewDetail,
                function: () => {
                  setIsOpen(true);
                  setIsEdit(false);
                  setIndexSelected(index);
                  setItemSelected(item);
                },
                feature: Features.QUALITY_ASSURANCE,
                subFeature: SubFeatures.INCIDENTS,
                action: ActionTypeEnum.VIEW,
                buttonType: ButtonType.Blue,

                cssClass: 'me-1',
              },
              {
                img: images.icons.icEdit,
                function: !disable
                  ? () => {
                      setIsOpen(true);
                      setIsEdit(true);
                      setIndexSelected(index);
                      setItemSelected(item);
                    }
                  : undefined,
                feature: Features.QUALITY_ASSURANCE,
                subFeature: SubFeatures.INCIDENTS,
                action: ActionTypeEnum.UPDATE,
                disable,
              },
              {
                img: images.icons.icRemove,
                function: !disable ? () => handleDelete(index) : undefined,
                action: ActionTypeEnum.DELETE,
                feature: Features.QUALITY_ASSURANCE,
                subFeature: SubFeatures.INCIDENTS,
                buttonType: ButtonType.Orange,
                cssClass: 'ms-1',
                disable,
              },
            ];
            return (
              <RowComponent
                key={item.remark}
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
    [values, disable, handleDelete, loading, sanitizeData],
  );

  const handleSubmit = useCallback(
    (dataForm, index?: number) => {
      const dataLength = values?.length || 0;

      const newState = values ? [...values] : [];
      // Edit
      if (dataLength && Number.isInteger(index)) {
        setRemarkList(
          newState.map((item, indexItem) =>
            index === indexItem ? dataForm : item,
          ),
        );
        setIsEdit(false);
      } else {
        // Create
        setRemarkList([dataForm, ...newState]);
      }
      setIndexSelected(null);
    },
    [values, setRemarkList],
  );

  const modalTitle = useMemo(() => {
    if (disable) {
      return 'View remark';
    }
    if (isEdit) {
      return 'Edit remark';
    }
    return 'Add remark';
  }, [disable, isEdit]);

  return (
    <div className={cx(styles.wrapperContainer, className)}>
      <div className={cx(styles.containerForm)}>
        <div className="d-flex justify-content-between align-items-center pb-3">
          <div className={cx('fw-bold ', styles.labelHeader)}>
            {title || t('remarksTitle')}
          </div>
          {!disable && (
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
          {!loading && !values?.length ? (
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

        <ModalRemarkType
          isOpen={isOpen}
          index={indexSelected}
          data={itemSelected}
          disabled={disable || (Number.isInteger(indexSelected) && !isEdit)}
          handleSubmitForm={handleSubmit}
          title={modalTitle}
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

export default AddRemark;
