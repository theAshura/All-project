import { FC, useCallback, useMemo, useState } from 'react';
import cx from 'classnames';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import { ComplianceAnswer } from 'models/api/standard-master/standard-master.model';
import images from 'assets/images/images';
import Button, { ButtonType } from 'components/ui/button/Button';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { Action } from 'models/common.model';
import NoDataImg from 'components/common/no-data/NoData';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import Table, { ColumnsType } from 'antd/lib/table';
import ModalComplianceAnswer from './ModalComplianceAnswer';
import styles from './table.module.scss';
import './table.scss';

interface TableComplianceAnswerProps {
  data: ComplianceAnswer[];
  setComplianceAnswerList: (data) => void;
  disable: boolean;
}

const TableComplianceAnswer: FC<TableComplianceAnswerProps> = ({
  data,
  disable,
  setComplianceAnswerList,
}) => {
  const { t } = useTranslation(I18nNamespace.STANDARD_MASTER);

  const [itemSelected, setItemSelected] = useState<ComplianceAnswer>(null);
  const [indexSelected, setIndexSelected] = useState<number>(null);

  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleDelete = useCallback(
    (index: number) => {
      showConfirmBase({
        isDelete: true,
        txTitle: t('deleteTitle'),
        txMsg: t('deleteMessage'),
        onPressButtonRight: () => {
          const newState = [...data].filter(
            (item, indexItem) => index !== indexItem,
          );
          setComplianceAnswerList(newState);
        },
      });
    },
    [data, setComplianceAnswerList, t],
  );

  const columnsModal: ColumnsType = [
    {
      title: t('action'),
      key: 'action',
      width: 100,
      fixed: true,
      render: (text, item, index) => {
        const actions: Action[] = [
          {
            img: images.icons.icRemove,
            function: () => handleDelete(index),
            action: ActionTypeEnum.DELETE,
            feature: Features.QUALITY_ASSURANCE,
            subFeature: SubFeatures.STANDARD_MASTER,
            buttonType: ButtonType.Orange,
            cssClass: 'ms-1',
          },
        ];
        return (
          <span className={cx(styles.textContent, 'limit-line-text')}>
            {!disable && <ActionBuilder actionList={actions} />}
          </span>
        );
      },
    },
    {
      title: t('form.answerNo'),
      dataIndex: 'answerNo',
      key: 'answerNo',
      width: 100,
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {text}
        </span>
      ),
    },
    {
      title: t('form.answer'),
      dataIndex: 'answer',
      key: 'answer',
      width: 280,
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {text}
        </span>
      ),
    },
    {
      title: t('form.compliance'),
      width: 135,
      key: 'compliance',
      dataIndex: 'compliance',
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {text}
        </span>
      ),
    },
    {
      title: t('form.colour'),
      width: 100,
      key: 'colour',
      dataIndex: 'colour',
      render: (text) => (
        <div
          className={styles.colorColumn}
          style={{ backgroundColor: text || 'transparent' }}
        />
      ),
    },
  ];

  const handleSubmit = useCallback(
    (dataForm, isNew) => {
      const dataLength = data?.length || 0;

      setComplianceAnswerList((prev) =>
        dataLength ? [...data, dataForm] : [dataForm],
      );

      if (isNew) {
        setIndexSelected(dataLength + 1);
      } else {
        setIndexSelected(null);
      }
    },
    [data, setComplianceAnswerList],
  );

  const dataSource = useMemo(
    () =>
      data?.map((item, index) => ({
        answerNo: index + 1,
        answer: item?.answer,
        compliance: item?.compliance,
        colour: item?.colour,
      })),
    [data],
  );

  return (
    <div className={cx(styles.wrapperContainer)}>
      <div className={cx(styles.containerForm)}>
        <div className="d-flex justify-content-between pb-3">
          <div className={cx('fw-bold ', styles.titleForm)}>
            {t('form.complianceAnswer')}
          </div>
          {!disable && (
            <Button
              onClick={() => {
                setIsOpen(true);
                setIndexSelected(data?.length || 0);
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
              {t('add')}
            </Button>
          )}
        </div>

        <div className={cx(styles.table, 'table_wrapper')}>
          {!dataSource?.length ? (
            <NoDataImg />
          ) : (
            <Table
              columns={columnsModal}
              className={cx(styles.tableWrapper)}
              dataSource={dataSource}
              scroll={{ x: 675, y: 135 }}
              pagination={false}
              rowClassName={styles.rowWrapper}
              locale={{ emptyText: 'No data' }}
            />
          )}
        </div>
        <ModalComplianceAnswer
          isOpen={isOpen}
          index={indexSelected}
          data={itemSelected}
          handleSubmitForm={handleSubmit}
          toggle={() => {
            setIsOpen(false);
            setIndexSelected(null);
            setItemSelected(null);
          }}
        />
      </div>
    </div>
  );
};

export default TableComplianceAnswer;
