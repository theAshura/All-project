import cx from 'classnames';
import {
  FC,
  ReactElement,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { toastError } from 'helpers/notification.helper';
import useEffectOnce from 'hoc/useEffectOnce';
import SelectUI from 'components/ui/select/Select';
import moment, { Moment } from 'moment';
import TimePicker from 'antd/lib/time-picker';
import { v4 } from 'uuid';
import ModalComponent, { ModalType } from 'components/ui/modal/Modal';
import { ModuleName } from 'constants/common.const';
import { FieldValues, useForm } from 'react-hook-form';
import { CalendarDate } from 'models/api/audit-time-table/audit-time-table.model';
import { CalendarTimeTableContext } from 'contexts/audit-time-table/CalendarTimeTable';
import { useDispatch, useSelector } from 'react-redux';
import { GroupButton } from 'components/ui/button/GroupButton';
import { ButtonType } from 'components/ui/button/Button';
import { getListVesselActions } from 'store/vessel/vessel.action';
import TableCp from 'components/common/table/TableCp';
import { Action } from 'models/common.model';
import images from 'assets/images/images';
import { DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-time-table.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import PermissionCheck from 'hoc/withPermissionCheck';
import { RowComponent } from 'components/common/table/row/rowCp';
import Input from 'components/ui/input/Input';
import styles from './form.module.scss';

export interface OptionProps {
  value: string;
  label: string | ReactElement;
  image?: string;
  selected: boolean;
}

interface ModalChoseVessel {
  data?: string;
  handSelection?: (data) => void;
  loading?: boolean;
  isAdd?: boolean;
  isShow?: boolean;
  setShow?: () => void;
  title?: string;
  isEdit?: boolean;
  dynamicLabels?: IDynamicLabel;
}

const format = 'HH:mm';

export const ModalChooseAuditor: FC<ModalChoseVessel> = (props) => {
  const { loading, isShow, setShow, isEdit, dynamicLabels } = props;
  const rowLabels = useMemo(
    () => [
      {
        id: 'action',
        addAction: true,
        label: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS.Action,
        ),
        sort: false,
        width: '100',
      },
      {
        id: 'no',
        label: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS['S.No'],
        ),
        sort: true,
        width: '100',
      },
      {
        id: 'date',
        label: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS.Date,
        ),
        sort: true,
        width: '100',
      },
      {
        id: 'form',
        label: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS.From,
        ),
        sort: true,
        width: '120',
      },
      {
        id: 'to',
        label: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS.To,
        ),
        sort: true,
        width: '120',
      },
      {
        id: 'auditor',
        label: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS.Inspector,
        ),
        sort: true,
        width: '250',
      },
      {
        id: 'area',
        label: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS[
            'Area/ Process/ Function'
          ],
        ),
        sort: true,
        width: '250',
      },
      {
        id: 'auditee',
        label: renderDynamicLabel(
          dynamicLabels,
          DETAIL_INSPECTION_TIME_TABLE_DYNAMIC_FIELDS.Auditee,
        ),
        sort: true,
        width: '250',
      },
    ],
    [dynamicLabels],
  );
  const dispatch = useDispatch();
  const { listEvent, setListEvent, dateEvent, optionEditor } = useContext(
    CalendarTimeTableContext,
  );

  const [listAudiTor, setListAudiTor] = useState<CalendarDate[]>([]);
  const { userInfo } = useSelector((state) => state.authenticate);

  useEffect(() => {
    if (dateEvent && isShow) {
      const dataEvent =
        listEvent.filter((item) => item.date === dateEvent) || [];
      setListAudiTor([...dataEvent]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dateEvent, isShow]);

  useEffectOnce(() => {
    dispatch(
      getListVesselActions.request({
        pageSize: -1,
        companyId: userInfo?.mainCompanyId,
        moduleName: ModuleName.INSPECTION,
      }),
    );
  });

  const { handleSubmit } = useForm<FieldValues>({
    mode: 'all',
  });

  const handleCancel = () => {
    setListAudiTor([]);
    setShow();
  };

  const onSubmitForm = () => {
    const newListEvent = listEvent.filter((item) => item.date !== dateEvent);
    const lengthEvent: number = listAudiTor.length;
    for (let i = 0; i < lengthEvent; i += 1) {
      const beginningTime = moment(listAudiTor[i].from, 'hh:mm');
      const endTime = moment(listAudiTor[i].to, 'hh:mm');
      const errTime: boolean = beginningTime.isBefore(endTime);
      if (!errTime) {
        toastError('To time is less than from time in Row 1');
        return;
      }
      if (!listAudiTor[i].auditorId) {
        toastError('Kindly provide auditor name');
        return;
      }
      if (!listAudiTor[i].process.trim()) {
        toastError('Kindly provide description');
        return;
      }
      if (!listAudiTor[i].auditee.trim()) {
        toastError('Kindly enter Auditee');
        return;
      }
    }
    setListEvent([...newListEvent, ...listAudiTor]);
    setShow();
  };

  const newRowLabel = useMemo(() => {
    if (isEdit) return [...rowLabels];
    return rowLabels?.map((item) => {
      if (item.id === 'action') {
        return { ...item, addAction: false };
      }
      return item;
    });
  }, [isEdit, rowLabels]);

  const addMoreAudiTor = () => {
    const newList = [...listAudiTor];

    newList.push({
      id: v4(),
      date: dateEvent,
      from: '00:00:00',
      to: '00:00:00',
      process: '',
      auditee: '',
      auditorId: '',
      operator: 'add',
    });
    setListAudiTor(newList);
  };
  const changeDataRow = (id: string, field: string, value: string) => {
    const newListAudiTor = listAudiTor.map((item) => {
      if (item.id === id) {
        return {
          ...item,
          [field]: value,
          operator: item.operator === 'add' ? 'add' : 'update',
        };
      }
      return item;
    });
    setListAudiTor([...newListAudiTor]);
  };
  const sanitizeData = (data: any, index: number) => ({
    no: index + 1,
    date: data?.date,
    form: (
      <TimePicker
        disabled={!isEdit}
        suffixIcon={null}
        allowClear={false}
        defaultValue={moment(data.from, format)}
        format={format}
        onChange={(time: Moment, timeString: string) =>
          changeDataRow(data.id, 'from', `${timeString}:00`)
        }
      />
    ),
    to: (
      <TimePicker
        disabled={!isEdit}
        suffixIcon={null}
        allowClear={false}
        defaultValue={moment(data.to, format)}
        format={format}
        onChange={(time: Moment, timeString: string) =>
          changeDataRow(data.id, 'to', `${timeString}:00`)
        }
      />
    ),
    auditor: (
      <SelectUI
        placeholder={renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Please select'],
        )}
        disabled={!isEdit}
        className="w-100"
        value={data.auditorId || null}
        onChange={(value) =>
          changeDataRow(data.id, 'auditorId', value?.toString())
        }
        data={optionEditor || []}
      />
    ),
    area: (
      <Input
        disabled={!isEdit}
        type="text"
        placeholder={renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Enter area'],
        )}
        value={data.process}
        onChange={(e) => changeDataRow(data.id, 'process', e.target.value)}
      />
    ),
    auditee: (
      <Input
        readOnly={!isEdit}
        disabledCss={!isEdit}
        placeholder={renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Enter auditee'],
        )}
        type="text"
        value={data.auditee}
        onChange={(e) => changeDataRow(data.id, 'auditee', e.target.value)}
      />
    ),
  });

  const handleDeleteAuditor = (id: string) => {
    let newList = listAudiTor.filter((item) => {
      if (item.id === id && item.operator === 'add') return false;
      return true;
    });
    newList = newList.map((item) => {
      if (item.id === id) {
        return { ...item, operator: 'delete' };
      }
      return item;
    });

    setListAudiTor(newList);
  };

  const renderRow = (isScrollable?: boolean) => {
    if (!loading) {
      return (
        <tbody>
          {listAudiTor
            ?.filter((i) => i.operator !== 'delete')
            ?.map((item, index) => {
              const finalData = sanitizeData(item, index);
              const actions: Action[] = [
                {
                  img: images.icons.icRemove,
                  function: () => handleDeleteAuditor(item.id),
                  feature: Features.CONFIGURATION,
                  subFeature: SubFeatures.AUTHORITY_MASTER,
                  action: ActionTypeEnum.DELETE,
                  buttonType: ButtonType.Orange,
                  cssClass: 'ms-1',
                  disable: !isEdit,
                },
              ];
              return (
                <PermissionCheck
                  options={{
                    feature: Features.CONFIGURATION,
                    subFeature: SubFeatures.REPORT_TEMPLATE,
                    action: ActionTypeEnum.UPDATE,
                  }}
                  key={item.id}
                >
                  {({ hasPermission }) => (
                    <RowComponent
                      isScrollable={isScrollable}
                      data={finalData}
                      actionList={actions}
                    />
                  )}
                </PermissionCheck>
              );
            })}
        </tbody>
      );
    }
    return null;
  };

  const renderForm = () => (
    <>
      <div className={styles.wrapFormPlaning}>
        <TableCp
          fullHeight
          isEmpty={undefined}
          loading={false}
          renderRow={renderRow}
          rowLabels={newRowLabel}
          addRowFunction={addMoreAudiTor}
        />
      </div>
    </>
  );

  const renderFooter = () => (
    <>
      {isEdit && (
        <div>
          <GroupButton
            className={cx(styles.GroupButton, 'mt-4 justify-content-end')}
            buttonTypeLeft={ButtonType.OutlineGray}
            handleCancel={() => {
              handleCancel();
            }}
            dynamicLabels={dynamicLabels}
            handleSubmit={handleSubmit(onSubmitForm)}
            disable={loading}
          />
        </div>
      )}
    </>
  );

  return (
    <ModalComponent
      isOpen={isShow}
      returnFocusAfterClose={false}
      toggle={() => {
        setListAudiTor([]);
        setShow();
      }}
      w="100%"
      modalType={ModalType.LARGE}
      title={renderDynamicLabel(
        dynamicLabels,
        COMMON_DYNAMIC_FIELDS['Inspection time table'],
      )}
      content={renderForm()}
      footer={renderFooter()}
    />
  );
};
