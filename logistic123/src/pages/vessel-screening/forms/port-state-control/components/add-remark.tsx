import { FC, useMemo, useState } from 'react';
import cx from 'classnames';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import images from 'assets/images/images';
import Button, { ButtonType } from 'components/ui/button/Button';
import { ActionTypeEnum, Features } from 'constants/roleAndPermission.const';
import { Action } from 'models/common.model';
import { formatDateTimeDay } from 'helpers/utils.helper';
import { PortStateInspectionReport } from 'models/api/port-state-control/port-state-control.model';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import Table, { ColumnsType } from 'antd/lib/table';
import NoDataImg from 'components/common/no-data/NoData';
import ModalFinding from '../../../components/ModalFinding';
import styles from './add-remark.module.scss';
import '../../../table.scss';

interface AddRemarkProps {
  values: PortStateInspectionReport[];
  setRemarkList: (values) => void;
  disable: boolean;
}

const AddRemark: FC<AddRemarkProps> = ({ values, disable, setRemarkList }) => {
  const { t } = useTranslation(I18nNamespace.PORT_STATE_CONTROL);

  const [itemSelected, setItemSelected] =
    useState<PortStateInspectionReport>(null);
  const [indexSelected, setIndexSelected] = useState<number>(null);
  const [isView, setIsView] = useState<boolean>(false);

  const [isOpen, setIsOpen] = useState<boolean>(false);

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
                setItemSelected(values[index]);
              },
              action: ActionTypeEnum.VIEW,
              feature: Features.QUALITY_ASSURANCE,
              // subFeature: SubFeatures.VESSEL_SCREENING,
              buttonType: ButtonType.Blue,
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
      {
        title: t('pscDeficiencyName'),
        dataIndex: 'pscDeficiencyName',
        key: 'pscDeficiencyName',
        width: 180,
        render: (text) => (
          <span className={cx(styles.textContent, 'limit-line-text')}>
            {text}
          </span>
        ),
      },
      {
        title: t('pscActionName'),
        dataIndex: 'pscActionName',
        key: 'pscActionName',
        width: 180,
        render: (text) => (
          <span className={cx(styles.textContent, 'limit-line-text')}>
            {text}
          </span>
        ),
      },
      {
        title: t('viqCategory'),
        dataIndex: 'viqCategory',
        key: 'viqCategory',
        width: 180,
        render: (text) => (
          <span className={cx(styles.textContent, 'limit-line-text')}>
            {text}
          </span>
        ),
      },
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
    [values, t],
  );

  const dataSource = useMemo(
    () =>
      values?.map((item, index) => ({
        sNo: index + 1,
        pscDeficiencyName: item?.pscDeficiency?.name,
        pscActionName: item?.pscAction?.name,
        viqCategory: item?.viq?.viqVesselType,
        finding: item?.finding,
        status: item?.status,
        estimatedCompletion: item?.estimatedCompletion
          ? formatDateTimeDay(item?.estimatedCompletion)
          : '',
        actualCompletion: item?.actualCompletion
          ? formatDateTimeDay(item?.actualCompletion)
          : '',
      })),
    [values],
  );

  return (
    <div className={cx(styles.wrapperContainer)}>
      <div className={cx(styles.containerForm)}>
        <div className="d-flex justify-content-between pb-3">
          <div className={cx('fw-bold ', styles.labelHeader)}>
            {t('inspectionReport')}
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
          {values?.length <= 0 ? (
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
          handleSubmitForm={() => {}}
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
