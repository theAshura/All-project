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

import styles from './reference.module.scss';
import ModalReference from '../modals/Reference';

interface TableReferenceProps {
  references: { referenceModule: string }[];
  setData: (state: any) => void;
  loading: boolean;
  className?: any;
  disabled?: boolean;
}

const TableReference = ({
  references,
  loading,
  setData,
  className,
  disabled,
}: TableReferenceProps) => {
  const { t } = useTranslation(I18nNamespace.SELF_ASSESSMENT);
  const [referenceSelected, setReferenceSelected] = useState({});
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
        id: 'reference',
        label: t('reference'),
        sort: false,
        width: '200',
      },
      {
        id: 'referenceModule',
        label: t('form.referenceModule'),
        sort: false,
        width: '200',
      },
      {
        id: 'upload',
        label: t('form.upload'),
        sort: false,
        width: '200',
      },
      {
        id: 'navigate',
        label: t('form.navigate'),
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
          const newState = [...references].filter(
            (item, indexItem) => index !== indexItem,
          );
          setData((prev) => ({
            ...prev,
            references: newState,
          }));
        },
      });
    },
    [references, setData, t],
  );

  const handleSubmit = useCallback(
    (value, index, isNew) => {
      const dataLength = references?.length;

      if (index > dataLength) {
        setData((prev) => ({
          ...prev,
          references: [...prev.references, value],
        }));
      } else {
        const newState = [...references];
        newState[index] = value;
        setData((prev) => ({
          ...prev,
          references: newState,
        }));
      }
      if (isNew) {
        setIndexSelected(dataLength + 1);
      } else {
        setIndexSelected(null);
      }
    },
    [references, setData],
  );

  const sanitizeData = useCallback((reference, index) => {
    const finalData = {
      levelNo: index + 1,
      referenceModule: reference.referenceModule,
    };
    return finalData;
  }, []);

  const renderRow = useCallback(
    (isScrollable?: boolean) => {
      if (loading || references?.length <= 0) {
        return null;
      }
      return (
        <tbody>
          {references?.map((item, index) => {
            const finalData = sanitizeData(item, index);
            const actions: Action[] = [
              {
                img: images.icons.icEdit,
                function: !disabled
                  ? () => {
                      setIsEdit(true);
                      setIsOpen(true);
                      setIndexSelected(index);
                      setReferenceSelected(item);
                    }
                  : null,
                feature: Features.QUALITY_ASSURANCE,
                subFeature: SubFeatures.SELF_ASSESSMENT,
                action: ActionTypeEnum.EXECUTE,
                disable: disabled,
              },
              {
                img: images.icons.icRemove,
                function: () => handleDelete(index),
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
                key={item.referenceModule}
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
    [disabled, handleDelete, loading, references, sanitizeData],
  );

  const addReference = useCallback(() => {
    setIsEdit(false);
    setIsOpen(true);
    setIndexSelected(references?.length || 0);
  }, [references?.length]);

  const toggleReferenceModal = useCallback(() => {
    setIsEdit(false);
    setIsOpen(false);
    setIndexSelected(null);
  }, []);

  return (
    <div className={cx(styles.wrapperContainer, className)}>
      <div className={cx(styles.containerForm)}>
        <div className="d-flex justify-content-between pb-3">
          <div className={cx('fw-bold ', styles.titleForm)}>
            {t('otherReferenceModules')}
          </div>
          <Button
            onClick={addReference}
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
          isEmpty={!loading && (references?.length === 0 || !references)}
          renderRow={renderRow}
          loading={loading}
        />
        <ModalReference
          isOpen={isOpen}
          index={indexSelected}
          reference={referenceSelected}
          setIsEdit={setIsEdit}
          isEdit={isEdit}
          handleSubmitForm={handleSubmit}
          toggle={toggleReferenceModal}
        />
      </div>
    </div>
  );
};

export default TableReference;
