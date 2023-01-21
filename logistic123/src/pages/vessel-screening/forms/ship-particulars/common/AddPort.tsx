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
import { PortType } from 'pages/vessel-screening/utils/models/common.model';

import { RowComponent } from 'components/common/table/row/rowCp';
import { PlusCircleOutlined } from '@ant-design/icons';
import ModalPortType from './ModalPort';
import styles from './add-port.module.scss';
import './table.scss';

interface AddPortProps {
  values: PortType[];
  setValues: (data) => void;
  disable: boolean;
  loading?: boolean;
  title?: string;
  className?: string;
}

const AddPort: FC<AddPortProps> = ({
  values = [],
  disable,
  setValues,
  loading,
  title,
  className,
}) => {
  const { t } = useTranslation([
    I18nNamespace.VESSEL_SCREENING,
    I18nNamespace.COMMON,
  ]);

  const [itemSelected, setItemSelected] = useState<PortType>(null);
  const [indexSelected, setIndexSelected] = useState<number>(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleDelete = useCallback(
    (index: number) => {
      showConfirmBase({
        isDelete: true,
        txTitle: t('modal.delete'),
        txMsg: t('modal.areYouSureYouWantToDelete'),
        onPressButtonRight: () => {
          const newState = [...values].filter(
            (item, indexItem) => index !== indexItem,
          );
          setValues(newState);
        },
      });
    },
    [values, setValues, t],
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
        id: 'port',
        label: t('tablePort.port'),
        sort: false,
        width: '50',
      },
      {
        id: t('country'),
        label: t('tablePort.country'),
        sort: false,
        width: '150',
      },
      {
        id: 'terminal',
        label: t('tablePort.terminal'),
        sort: false,
        width: '150',
      },
      {
        id: 'berth',
        label: t('tablePort.berth'),
        sort: false,
        width: '150',
      },
      {
        id: 'layCanDate',
        label: t('tablePort.layCanDate'),
        sort: false,
        width: '150',
      },
    ],
    [t],
  );

  const sanitizeData = useCallback((item: PortType) => {
    const portInfo = item?.port;
    const terminalInfo = item?.terminal;
    const finalData = {
      port: portInfo?.name || '',
      country: portInfo?.country || '',
      terminal: terminalInfo?.name || '',
      berth: item?.berth,
      layCanDate: item?.layCanDate
        ? formatDateLocalWithTime(item?.layCanDate)
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
            const finalData = sanitizeData(item);
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
                subFeature: SubFeatures.SAIL_GENERAL_REPORT,
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
                subFeature: SubFeatures.SAIL_GENERAL_REPORT,
                action: ActionTypeEnum.UPDATE,
                disable,
              },
              {
                img: images.icons.icRemove,
                function: !disable ? () => handleDelete(index) : undefined,
                action: ActionTypeEnum.DELETE,
                feature: Features.QUALITY_ASSURANCE,
                subFeature: SubFeatures.SAIL_GENERAL_REPORT,
                buttonType: ButtonType.Orange,
                cssClass: 'ms-1',
                disable,
              },
            ];
            return (
              <RowComponent
                key={String(index + item?.portId)}
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
        setValues(
          newState.map((item, indexItem) =>
            index === indexItem ? dataForm : item,
          ),
        );
        setIsEdit(false);
      } else {
        // Create
        setValues([dataForm, ...newState]);
      }
      setIndexSelected(null);
    },
    [values, setValues],
  );

  return (
    <div className={cx(styles.wrapperContainer, className)}>
      <div className={cx(styles.containerForm)}>
        <div className="d-flex justify-content-between pb-3">
          <div className={cx('fw-bold ', styles.labelHeader)}>
            {title || t('basicInfo.portInformation')}
          </div>
          {!disable && (
            <Button
              buttonType={ButtonType.Primary}
              onClick={() => {
                setIsOpen(true);
                setIndexSelected(null);
                setItemSelected(null);
              }}
              className="py-2"
              renderSuffix={<PlusCircleOutlined />}
              classSuffix={cx('ps-2', styles.icon)}
            >
              {t('buttons.addPort')}
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

        <ModalPortType
          isOpen={isOpen}
          index={indexSelected}
          data={itemSelected}
          disabled={disable || (Number.isInteger(indexSelected) && !isEdit)}
          handleSubmitForm={handleSubmit}
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

export default AddPort;
