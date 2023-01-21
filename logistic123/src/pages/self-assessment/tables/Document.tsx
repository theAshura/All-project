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

import styles from './document.module.scss';
import ModalDocument from '../modals/Document';

interface TableDocumentProps {
  documents: { documentTitle: string }[];
  setData: (state: any) => void;
  loading: boolean;
  className?: any;
  disabled?: boolean;
}

const TableDocument = ({
  documents,
  loading,
  setData,
  className,
  disabled,
}: TableDocumentProps) => {
  const { t } = useTranslation(I18nNamespace.SELF_ASSESSMENT);
  const [documentSelected, setDocumentSelected] = useState({});
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
        sort: true,
        width: '300',
      },
      {
        id: 'documentTitle',
        label: t('form.documentTitle'),
        sort: true,
        width: '500',
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
          const newState = [...documents].filter(
            (item, indexItem) => index !== indexItem,
          );
          setData((prev) => ({
            ...prev,
            documents: newState,
          }));
        },
      });
    },
    [documents, setData, t],
  );

  const handleSubmit = useCallback(
    (value, index, isNew) => {
      const dataLength = documents?.length;

      if (index > dataLength) {
        setData((prev) => ({
          ...prev,
          documents: [...prev.documents, value],
        }));
      } else {
        const newState = [...documents];
        newState[index] = value;
        setData((prev) => ({
          ...prev,
          documents: newState,
        }));
      }
      if (isNew) {
        setIndexSelected(dataLength + 1);
      } else {
        setIndexSelected(null);
      }
    },
    [documents, setData],
  );

  const sanitizeData = useCallback((document, index) => {
    const finalData = {
      levelNo: index + 1,
      documentTitle: document.documentTitle,
    };
    return finalData;
  }, []);

  const renderRow = useCallback(
    (isScrollable?: boolean) => {
      if (loading || documents?.length <= 0) {
        return null;
      }
      return (
        <tbody>
          {documents?.map((item, index) => {
            const finalData = sanitizeData(item, index);
            const actions: Action[] = [
              {
                img: images.icons.icEdit,
                function: () => {
                  setIsEdit(true);
                  setIsOpen(true);
                  setIndexSelected(index);
                  setDocumentSelected(item);
                },
                feature: Features.QUALITY_ASSURANCE,
                subFeature: SubFeatures.SELF_ASSESSMENT,
                action: ActionTypeEnum.UPDATE,
                disable: disabled,
              },
              {
                img: images.icons.icRemove,
                function: () => handleDelete(index),
                action: ActionTypeEnum.DELETE,
                feature: Features.QUALITY_ASSURANCE,
                subFeature: SubFeatures.SELF_ASSESSMENT,
                buttonType: ButtonType.Orange,
                cssClass: 'ms-1',
                disable: disabled,
              },
            ];
            return (
              <RowComponent
                key={item.documentTitle}
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
    [disabled, documents, handleDelete, loading, sanitizeData],
  );

  const addDocument = useCallback(() => {
    setIsEdit(false);
    setIsOpen(true);
    setIndexSelected(documents?.length || 0);
  }, [documents?.length]);

  const toggleDocumentModal = useCallback(() => {
    setIsEdit(false);
    setIsOpen(false);
    setIndexSelected(null);
  }, []);

  return (
    <div className={cx(styles.wrapperContainer, className)}>
      <div className={cx(styles.containerForm)}>
        <div className={cx('fw-bold mb-3', styles.titleForm)}>
          {t('objectiveEvidence')}
        </div>

        <div className="d-flex justify-content-between pb-3">
          <div className={cx('fw-bold ', styles.titleForm)}>
            {t('documentManagementSystem')}
          </div>
          <Button
            onClick={addDocument}
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
            {t('button.addDocument')}
          </Button>
        </div>
        <TableCp
          rowLabels={rowLabels}
          classNameNodataWrapper={styles.noData}
          isEmpty={!loading && (documents?.length === 0 || !documents)}
          renderRow={renderRow}
          loading={loading}
        />
        <ModalDocument
          isOpen={isOpen}
          index={indexSelected}
          document={documentSelected}
          setIsEdit={setIsEdit}
          isEdit={isEdit}
          handleSubmitForm={handleSubmit}
          toggle={toggleDocumentModal}
        />
      </div>
    </div>
  );
};

export default TableDocument;
