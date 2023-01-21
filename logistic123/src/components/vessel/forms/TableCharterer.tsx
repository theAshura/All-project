import { FC, useMemo, useCallback, useEffect, useState } from 'react';
// import { useSelector } from 'react-redux';
import images from 'assets/images/images';
import cx from 'classnames';
import { RowComponent } from 'components/common/table/row/rowCp';
import TableCp from 'components/common/table/TableCp';
import Button, { ButtonType } from 'components/ui/button/Button';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { formatDateNoTime } from 'helpers/date.helper';
import { VesselCharterers } from 'models/api/vessel/vessel.model';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { VESSEL_DETAIL_DYNAMIC_FIELDS } from 'constants/dynamic/vessel.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { Action } from 'models/common.model';
import { FieldValues, useForm } from 'react-hook-form';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { DATA_SPACE } from 'constants/components/ag-grid.const';
import styles from './table.module.scss';
import { ModalCharterer } from './ModalCharterer';

import {
  checkTimeLine,
  handleDataCompanyUpdate,
  handleSortByDate,
  TIME_LINE,
} from './management-ownership/doc-holder/doc.func';

interface Props {
  loading?: boolean;
  value?: any[];
  onchange?: (charterer) => void;
  disable?: boolean;
  className?: string;
  classNameBtn?: string;
  initialData?: VesselCharterers[];
  dynamicLabels?: IDynamicLabel;
}

const defaultValues = {
  charterers: [],
};

export const TableCharterer: FC<Props> = ({
  loading,
  value,
  onchange,
  disable,
  className,
  classNameBtn,
  initialData,
  dynamicLabels,
}) => {
  const [modal, setModal] = useState(false);
  const [charterers, setCharterers] = useState(value || []);
  const [selected, setSelected] = useState(null);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [index, setIndex] = useState<number>(null);

  const { reset } = useForm<FieldValues>({
    mode: 'all',
    defaultValues,
  });

  const rowLabels = useMemo(
    () => [
      {
        id: 'action',
        label: renderDynamicLabel(
          dynamicLabels,
          VESSEL_DETAIL_DYNAMIC_FIELDS.Action,
        ),
        sort: false,
        width: '100',
      },
      {
        id: 'sNo',
        label: renderDynamicLabel(
          dynamicLabels,
          VESSEL_DETAIL_DYNAMIC_FIELDS['S.No'],
        ),
        sort: false,
        width: '50',
      },
      {
        id: 'name',
        label: renderDynamicLabel(
          dynamicLabels,
          VESSEL_DETAIL_DYNAMIC_FIELDS['Charterer name'],
        ),
        sort: false,
        width: '150',
      },
      {
        id: 'type',
        label: renderDynamicLabel(
          dynamicLabels,
          VESSEL_DETAIL_DYNAMIC_FIELDS['Charterer type'],
        ),
        sort: false,
        width: '150',
      },
      {
        id: 'code',
        label: renderDynamicLabel(
          dynamicLabels,
          VESSEL_DETAIL_DYNAMIC_FIELDS['Charterer code'],
        ),
        sort: false,
        width: '150',
      },
      {
        id: 'fromDate',
        label: renderDynamicLabel(
          dynamicLabels,
          VESSEL_DETAIL_DYNAMIC_FIELDS['From date'],
        ),
        sort: false,
        width: '150',
      },
      {
        id: 'toDate',
        label: renderDynamicLabel(
          dynamicLabels,
          VESSEL_DETAIL_DYNAMIC_FIELDS['To date'],
        ),
        sort: false,
        width: '150',
      },
      {
        id: 'responsiblePartyIps',
        label: renderDynamicLabel(
          dynamicLabels,
          VESSEL_DETAIL_DYNAMIC_FIELDS['Responsible party (Inspection)'],
        ),
        sort: false,
        width: '150',
      },
      {
        id: 'responsiblePartyQA',
        label: renderDynamicLabel(
          dynamicLabels,
          VESSEL_DETAIL_DYNAMIC_FIELDS['Responsible party (QA)'],
        ),
        sort: false,
        width: '150',
      },
    ],
    [dynamicLabels],
  );

  const onSubmitForm = useCallback(
    (data) => {
      const newCharterer = handleDataCompanyUpdate(
        charterers,
        data,
        index,
        !initialData?.length,
      );
      onchange(newCharterer);
      setModal(false);
    },
    [charterers, index, initialData?.length, onchange],
  );

  const onDeleteCharterer = useCallback(
    (index) => {
      const newCharterer = charterers ? [...charterers] : [];
      newCharterer.splice(index, 1);
      onchange(newCharterer);
    },
    [charterers, onchange],
  );

  const editDetail = useCallback((item, index) => {
    setIsEdit(true);
    setSelected(item);
    setModal(true);
    setIndex(index);
  }, []);
  const viewDetail = useCallback((item, index) => {
    setIsEdit(false);
    setSelected(item);
    setModal(true);
    setIndex(index);
  }, []);

  const handleDelete = useCallback(
    (index) => {
      showConfirmBase({
        isDelete: true,
        txTitle: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Delete?'],
        ),
        txMsg: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS[
            'Are you sure you want to delete this record? This action cannot be undone and you will not be able to recover any data.'
          ],
        ),
        txButtonLeft: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS.Cancel,
        ),
        txButtonRight: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS.Delete,
        ),
        onPressButtonRight: () => onDeleteCharterer(index),
      });
    },
    [dynamicLabels, onDeleteCharterer],
  );

  const sanitizeData = useCallback((data, index) => {
    const finalData = {
      id: data?.id,
      no: index + 1,
      name: data?.name || DATA_SPACE,
      type: data?.type || DATA_SPACE,
      code: data?.code || DATA_SPACE,
      fromDate: formatDateNoTime(data?.fromDate),
      toDate: formatDateNoTime(data?.toDate),
      responsiblePartyIps: data?.responsiblePartyInspection ? 'Yes' : 'No',
      responsiblePartyQA: data?.responsiblePartyQA ? 'Yes' : 'No',
    };
    return finalData;
  }, []);

  const renderRow = useCallback(
    (isScrollable?: boolean) => {
      if (!loading && charterers?.length > 0) {
        return (
          <tbody>
            {charterers?.map((item, index) => {
              const finalData = sanitizeData(item, index);
              const timeLine = checkTimeLine(item?.fromDate, item?.toDate);
              const dataUnsaved = !!item?.id;
              const actions: Action[] = [
                {
                  img: images.icons.icViewDetail,
                  function: () => viewDetail(item, index),
                  feature: Features.CONFIGURATION,
                  subFeature: SubFeatures.VESSEL,
                  action: ActionTypeEnum.VIEW,
                  buttonType: ButtonType.Blue,
                  cssClass: 'me-1',
                },
                !disable &&
                  (timeLine === TIME_LINE.FUTURE ||
                    timeLine === TIME_LINE.CURRENT ||
                    !dataUnsaved) && {
                    img: images.icons.icEdit,
                    function: () => editDetail(item, index),
                    feature: Features.CONFIGURATION,
                    subFeature: SubFeatures.VESSEL,
                    action: ActionTypeEnum.UPDATE,
                    cssClass: 'me-1',
                  },
                !disable &&
                  (timeLine === TIME_LINE.FUTURE || !dataUnsaved) && {
                    img: images.icons.icRemove,
                    function: () => handleDelete(index),
                    feature: Features.CONFIGURATION,
                    subFeature: SubFeatures.VESSEL,
                    action: ActionTypeEnum.DELETE,
                    buttonType: ButtonType.Orange,
                  },
              ]?.filter((item) => item);

              return (
                <RowComponent
                  isScrollable={isScrollable}
                  data={finalData}
                  actionList={actions}
                  rowLabels={rowLabels}
                  key={item?.id}
                />
              );
            })}
          </tbody>
        );
      }
      return null;
    },
    [
      charterers,
      disable,
      editDetail,
      handleDelete,
      loading,
      rowLabels,
      sanitizeData,
      viewDetail,
    ],
  );

  useEffect(() => {
    if (!modal) {
      reset(defaultValues);
      setIndex(undefined);
      setSelected(null);
      setIsEdit(false);
    }
  }, [modal, reset]);

  useEffect(() => {
    setCharterers(handleSortByDate(value));
  }, [value]);

  return (
    <div className={cx('mt-2', styles.wrapperContainer, className)}>
      <div className={cx(styles.containerForm)}>
        <div className="d-flex justify-content-between align-items-center">
          <div className={cx(styles.titleContainer)}>
            {renderDynamicLabel(
              dynamicLabels,
              VESSEL_DETAIL_DYNAMIC_FIELDS.Charterer,
            )}
          </div>
          {!disable && (
            <Button
              onClick={() => {
                setIsEdit(true);
                setModal(true);
                setIndex(undefined);
              }}
              className={cx('mt-auto ', styles.button, classNameBtn)}
              renderSuffix={
                <img
                  src={images.icons.icAddCircle}
                  alt="createNew"
                  className={styles.icButton}
                />
              }
            >
              {renderDynamicLabel(
                dynamicLabels,
                VESSEL_DETAIL_DYNAMIC_FIELDS['Add New'],
              )}
            </Button>
          )}
        </div>
        <div className={cx('pt-4', styles.table)}>
          {charterers?.length ? (
            <TableCp
              rowLabels={rowLabels}
              renderRow={renderRow}
              loading={loading}
              isEmpty={undefined}
              scrollVerticalAttachment
            />
          ) : (
            <div className={cx(styles.dataWrapperEmpty)}>
              <img
                src={images.icons.icNoData}
                className={styles.noData}
                alt="no data"
              />
            </div>
          )}
        </div>
      </div>
      <ModalCharterer
        isOpen={modal}
        toggle={() => {
          setModal((e) => !e);
          setIsEdit(false);
          setIndex(undefined);
          setSelected(null);
        }}
        isEdit={isEdit}
        data={selected}
        dynamicLabels={dynamicLabels}
        handleSubmitForm={onSubmitForm}
        listData={charterers || []}
        selectedIndex={index}
        allowEditHistory={!initialData?.length}
        initialData={handleSortByDate(initialData)}
      />
    </div>
  );
};
