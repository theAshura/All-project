import { FC, useCallback, useMemo, useState } from 'react';
import cx from 'classnames';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import images from 'assets/images/images';
import Button, { ButtonType } from 'components/ui/button/Button';
import moment from 'moment';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { Action } from 'models/common.model';
import NoDataImg from 'components/common/no-data/NoData';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { formatDateTimeDay } from 'helpers/utils.helper';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import { ExternalInspectionReports } from 'models/api/external/external.model';
import Table, { ColumnsType } from 'antd/lib/table';
import ModalFinding from '../common/ModalFinding';
import styles from './form.module.scss';
import './table.scss';

interface AddRemarkProps {
  data: ExternalInspectionReports[];
  setRemarkList: (data) => void;
  disable: boolean;
  watchDateOfInspection?: moment.Moment;
}

const AddRemark: FC<AddRemarkProps> = ({
  data,
  disable,
  setRemarkList,
  watchDateOfInspection,
}) => {
  const { t } = useTranslation(I18nNamespace.PORT_STATE_CONTROL);

  const [itemSelected, setItemSelected] =
    useState<ExternalInspectionReports>(null);
  const [indexSelected, setIndexSelected] = useState<number>(null);
  const [isView, setIsView] = useState<boolean>(false);

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
          setRemarkList(newState);
        },
      });
    },
    [data, setRemarkList, t],
  );

  const columnsModal: ColumnsType = useMemo(
    () => [
      {
        title: t('action'),
        key: 'action',
        width: 175,
        fixed: true,
        render: (text, item, index) => {
          const actions: Action[] = [
            {
              img: images.icons.icViewDetail,
              function: () => {
                setIsView(true);
                setIsOpen(true);
                setIndexSelected(index);
                setItemSelected(data[index]);
              },
              action: ActionTypeEnum.VIEW,
              feature: Features.QUALITY_ASSURANCE,
              subFeature: SubFeatures.SAIL_GENERAL_REPORT,
              buttonType: ButtonType.Blue,
            },
            {
              img: images.icons.icEdit,
              function: () => {
                setIsView(false);
                setIsOpen(true);
                setIndexSelected(index);
                setItemSelected(data[index]);
              },
              action: ActionTypeEnum.UPDATE,
              feature: Features.QUALITY_ASSURANCE,
              subFeature: SubFeatures.SAIL_GENERAL_REPORT,
              disable,
              cssClass: 'ms-1',
            },
            {
              img: images.icons.icRemove,
              function: () => handleDelete(index),
              action: ActionTypeEnum.DELETE,
              feature: Features.QUALITY_ASSURANCE,
              subFeature: SubFeatures.SAIL_GENERAL_REPORT,
              buttonType: ButtonType.Orange,
              disable,
              cssClass: 'ms-1',
            },
          ];
          return (
            <span className={cx(styles.textContent, 'limit-line-text')}>
              <ActionBuilder actionList={actions} />
            </span>
          );
        },
      },
      {
        title: t('sNo'),
        dataIndex: 'sNo',
        key: 'sNo',
        width: 100,
        render: (text) => (
          <span className={cx(styles.textContent, 'limit-line-text')}>
            {text}
          </span>
        ),
      },
      // {
      //   title: t('viqCategory'),
      //   dataIndex: 'viqCategory',
      //   key: 'viqCategory',
      //   width: 180,
      //   render: (text) => (
      //     <span className={cx(styles.textContent, 'limit-line-text')}>
      //       {text}
      //     </span>
      //   ),
      // },
      {
        title: t('finding'),
        dataIndex: 'finding',
        key: 'finding',
        width: 180,
        render: (text) => (
          <span className={cx(styles.textContent, 'limit-line-text')}>
            {text}
          </span>
        ),
      },
      {
        title: t('estimatedCompletion'),
        dataIndex: 'estimatedCompletion',
        key: 'estimatedCompletion',
        width: 180,
        render: (text) => (
          <span className={cx(styles.textContent, 'limit-line-text')}>
            {text}
          </span>
        ),
      },
      {
        title: t('actualCompletion'),
        dataIndex: 'actualCompletion',
        key: 'actualCompletion',
        width: 180,
        render: (text) => (
          <span className={cx(styles.textContent, 'limit-line-text')}>
            {text}
          </span>
        ),
      },
      {
        title: t('status'),
        dataIndex: 'status',
        key: 'status',
        width: 180,
        render: (text) => (
          <span className={cx(styles.textContent, 'limit-line-text')}>
            {text}
          </span>
        ),
      },
    ],
    [data, disable, handleDelete, t],
  );

  const handleSubmit = useCallback(
    (dataForm, index?: number) => {
      const dataLength = data?.length || 0;

      const newState = data ? [...data] : [];
      // Edit
      if (dataLength && Number.isInteger(index)) {
        setRemarkList(
          newState.map((item, indexItem) =>
            index === indexItem ? dataForm : item,
          ),
        );
      } else {
        // Create
        setRemarkList([...newState, dataForm]);
      }
      setIndexSelected(null);
    },
    [data, setRemarkList],
  );

  const dataSource = useMemo(
    () =>
      data?.map((item, index) => ({
        sNo: index + 1,
        // viqCategory: item?.viq?.viqVesselType,
        finding: item?.finding,
        status: item?.status,
        estimatedCompletion: item?.estimatedCompletion
          ? formatDateTimeDay(item?.estimatedCompletion)
          : '',
        actualCompletion: item?.actualCompletion
          ? formatDateTimeDay(item?.actualCompletion)
          : '',
      })),
    [data],
  );

  return (
    <div className={cx(styles.wrapperContainer)}>
      <div className={cx(styles.containerForm)}>
        <div className="d-flex justify-content-between pb-3">
          <div className={cx('fw-bold ', styles.labelHeader)}>
            {t('externalInspectionReport')}
          </div>
          {!disable && (
            <Button
              onClick={() => {
                setIsView(false);
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
              {t('addFindings')}
            </Button>
          )}
        </div>

        <div className={cx(styles.table, 'table_wrapper')}>
          {data?.length <= 0 ? (
            <NoDataImg />
          ) : (
            <Table
              columns={columnsModal}
              className={cx(styles.tableWrapper)}
              dataSource={dataSource}
              scroll={{ x: 1000, y: 135 }}
              pagination={false}
              rowClassName={styles.rowWrapper}
              locale={{ emptyText: 'No data' }}
            />
          )}
        </div>
        <ModalFinding
          isOpen={isOpen}
          index={indexSelected}
          isView={isView}
          data={itemSelected}
          watchDateOfInspection={watchDateOfInspection}
          handleSubmitForm={handleSubmit}
          toggle={() => {
            setIsView(false);
            setIsOpen(false);
            setIndexSelected(null);
            setItemSelected(null);
          }}
        />
      </div>
    </div>
  );
};

export default AddRemark;
