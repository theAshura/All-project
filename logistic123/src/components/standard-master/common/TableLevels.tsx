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
import NoDataImg from 'components/common/no-data/NoData';
import Table, { ColumnsType } from 'antd/lib/table';
import { Action } from 'models/common.model';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';

import styles from './table.module.scss';
import ModalLevel from './ModalLevel';
import './table.scss';

interface TableLevelsProps {
  data: string[];
  setLevelList: (data) => void;
  disable?: boolean;
}

const TableLevels: FC<TableLevelsProps> = ({ data, disable, setLevelList }) => {
  const { t } = useTranslation(I18nNamespace.STANDARD_MASTER);
  const [levelSelected, setLevelSelected] = useState<string>(null);
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
          setLevelList(newState);
        },
      });
    },
    [data, setLevelList, t],
  );

  const columnsModal: ColumnsType = [
    {
      title: t('action'),
      key: 'action',
      width: 100,
      fixed: true,
      dataIndex: 'description',
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
      title: t('form.levelNo'),
      dataIndex: 'levelNo',
      key: 'levelNo',

      width: 100,
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {text}
        </span>
      ),
    },
    {
      title: t('form.levelDescription'),
      width: 300,
      key: 'description',
      dataIndex: 'description',
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {text}
        </span>
      ),
    },
  ];

  const handleSubmit = useCallback(
    (value, isNew) => {
      const dataLength = data?.length || 0;
      setLevelList((prev) => (dataLength ? [...prev, value] : [value]));

      if (isNew) {
        setIndexSelected(dataLength + 1);
      } else {
        setIndexSelected(null);
      }
    },
    [data, setLevelList],
  );

  const dataSource = useMemo(
    () =>
      data?.map((item, index) => ({
        levelNo: index + 1,
        description: item,
      })),
    [data],
  );

  return (
    <div className={cx(styles.wrapperContainer)}>
      <div className={cx(styles.containerForm)}>
        <div className="d-flex justify-content-between pb-3">
          <div className={cx('fw-bold ', styles.titleForm)}>
            {t('form.levels')}
          </div>
          {!disable && (
            <Button
              onClick={() => {
                setIsOpen(true);
                setIndexSelected(data?.length || 0);
                setLevelSelected('');
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
              scroll={{ x: 500, y: 135 }}
              pagination={false}
              rowClassName={styles.rowWrapper}
              locale={{ emptyText: 'No data' }}
            />
          )}
        </div>
        <ModalLevel
          isOpen={isOpen}
          index={indexSelected}
          data={levelSelected}
          handleSubmitForm={handleSubmit}
          toggle={() => {
            setIsOpen(false);
            setIndexSelected(null);
            setLevelSelected(null);
          }}
        />
      </div>
    </div>
  );
};

export default TableLevels;
