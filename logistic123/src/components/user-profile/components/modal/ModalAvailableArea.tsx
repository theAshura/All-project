import images from 'assets/images/images';
import cx from 'classnames';
import Button, { ButtonType } from 'components/ui/button/Button';
import { AvailableAreaDetail } from 'models/store/user/user.model';
import AsyncSelectTableProps from 'components/ui/async-select/async-select-table/AsyncSelectTable';

import NewAsyncSelect, {
  NewAsyncOptions,
  OptionProps,
} from 'components/ui/async-select/NewAsyncSelect';
import { toastError } from 'helpers/notification.helper';
import { getListPortActions } from 'store/port/port.action';
import { Port } from 'models/api/port/port.model';
import { FC, useEffect, useMemo, useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { getCountryActions } from 'store/user/user.action';
import { DataObj } from 'models/common.model';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/userManagement.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';

import { Modal } from 'reactstrap';
import styles from './modal.module.scss';

interface SubmitData {
  country: NewAsyncOptions;
  ports: DataObj[];
}

interface ModalAvailableAreaProps {
  modal: boolean;
  toggle: () => void;
  handleSubmit: (data: SubmitData) => void;
  loadingModal?: boolean;
  title?: string;
  isDelete?: boolean;
  type?: string;
  defaultCountry?: NewAsyncOptions;
  defaultPorts?: NewAsyncOptions[];
  dynamicLabels?: IDynamicLabel;
}

const emptyOptions: NewAsyncOptions[] = [];

const ModalAvailableArea: FC<ModalAvailableAreaProps> = (props) => {
  const {
    toggle,
    modal,
    handleSubmit,
    type,
    defaultCountry,
    defaultPorts = emptyOptions,
    dynamicLabels,
  } = props;
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const [errors, setErrors] = useState<any>(null);

  const dispatch = useDispatch();
  const { disable, listCountry } = useSelector((state) => state.user);
  const { listPort, loading: loadingPort } = useSelector((state) => state.port);

  const { watch } = useFormContext();
  const watchAvailableArea: AvailableAreaDetail = watch('availableAreas');

  const rowLabels = useMemo(
    () => [
      {
        label: renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Port code'],
        ),
        id: 'portCode',
        width: '50%',
      },
      {
        label: renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Port name'],
        ),
        id: 'portName',
        width: '50%',
      },
    ],
    [dynamicLabels],
  );

  const [hasCountryOther, setHasCountryOther] = useState(false);
  const [countryOtherPreference, setCountryOtherPreference] = useState('');

  const [countrySelect, setCountrySelect] =
    useState<NewAsyncOptions>(defaultCountry);
  const [portSelect, setPortSelect] = useState<DataObj[]>(defaultPorts);
  useEffect(() => {
    if (modal) {
      setCountrySelect(defaultCountry);
      setPortSelect(defaultPorts);
    }
  }, [defaultPorts, defaultCountry, modal]);

  useEffect(() => {
    if (!modal) {
      setIsFirstLoad(true);
    }
  }, [modal]);

  useEffect(() => {
    if (countrySelect) {
      dispatch(
        getListPortActions.request({
          country: countrySelect,
        }),
      );
    }
  }, [countrySelect, dispatch]);

  useEffect(() => {
    if (
      isFirstLoad &&
      modal &&
      defaultPorts &&
      defaultPorts[0]?.label?.toString()?.length === 0
    ) {
      const newData =
        defaultPorts?.map((item) => {
          const dataFilter: Port[] = listPort?.data?.filter(
            (i) => i?.id?.toString() === item?.value?.toString(),
          );
          if (dataFilter) {
            return {
              value: dataFilter && dataFilter[0]?.id?.toString(),
              label: dataFilter && dataFilter[0]?.name,
            };
          }
          return item;
        }) || [];
      setPortSelect([...newData]);
      setIsFirstLoad(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listPort?.data, defaultPorts]);

  const countryOptionProps: NewAsyncOptions[] = useMemo(
    () =>
      listCountry.map((item) => ({
        value: item.id.toString(),
        label: item.name,
        image: item?.flagImg || '',
      })),
    [listCountry],
  );

  const portOptionProps: DataObj[] = useMemo(() => {
    let province: DataObj[] = [];
    let newListPort: DataObj[] = [];

    const portsStrong: DataObj[] =
      watchAvailableArea?.strong?.filter(
        (i) =>
          i?.country?.value?.toString() === countrySelect?.label?.toString(),
      )[0]?.ports || [];

    const portsNeutral: DataObj[] =
      watchAvailableArea?.neutral?.filter(
        (i) =>
          i?.country?.value?.toString() === countrySelect?.label?.toString(),
      )[0]?.ports || [];

    const portsNo: DataObj[] =
      watchAvailableArea?.no?.filter(
        (i) =>
          i?.country?.value?.toString() === countrySelect?.label?.toString(),
      )[0]?.ports || [];
    if (portsNo?.length > 0) {
      setCountryOtherPreference('');
    }

    if (portsNo?.length > 0) {
      setCountryOtherPreference('');
    }

    const totalPorts: number =
      portsNo?.length + portsStrong?.length + portsNeutral?.length;

    if (totalPorts > 0) {
      const messageError: string = `is added in ${
        portsStrong?.length > 0 ? 'Strong' : ''
      } ${portsNeutral?.length > 0 ? 'Neutral' : ''} ${
        portsNo?.length > 0 ? 'No' : ''
      } preference`;
      setCountryOtherPreference(messageError.trim());
    }
    setHasCountryOther(totalPorts > 0);
    switch (type) {
      case 'no': {
        province = [...portsStrong, ...portsNeutral];
        break;
      }
      case 'strong': {
        province = [...portsNo, ...portsNeutral];
        break;
      }
      case 'neutral': {
        province = [...portsNo, ...portsStrong];
        break;
      }

      default:
    }
    newListPort = listPort?.data
      ?.filter((i) => i?.status === 'active')
      ?.map((item) => ({
        value: item.id.toString(),
        portCode: item.code,
        portName: item.name,
        content: `${item.code}-${item.name}`,
      }));
    newListPort = newListPort?.filter(
      (item) =>
        !province?.some(
          (i) => i?.value?.toString() === item?.value?.toString(),
        ),
    );
    return newListPort;
  }, [
    listPort,
    watchAvailableArea?.strong,
    watchAvailableArea?.neutral,
    watchAvailableArea?.no,
    type,
    countrySelect?.label,
  ]);

  const onCloseAndClear = useCallback(() => {
    setErrors({});
    toggle();
  }, [toggle]);

  const handleForm = useCallback(() => {
    const newErrors: any = {};

    if (!countrySelect?.value) {
      newErrors.countrySelect = renderDynamicLabel(
        dynamicLabels,
        COMMON_DYNAMIC_FIELDS['This field is required'],
      );
    }
    if (!portSelect?.length) {
      newErrors.portSelect = renderDynamicLabel(
        dynamicLabels,
        COMMON_DYNAMIC_FIELDS['This field is required'],
      );
    }
    if (newErrors?.countrySelect || newErrors?.portSelect) {
      setErrors(newErrors);
      return;
    }

    if (hasCountryOther && portOptionProps?.length === 0) {
      toastError(`${countrySelect?.label} ${countryOtherPreference}`);
      return;
    }
    if (countrySelect && portOptionProps?.length) {
      handleSubmit({
        country: countrySelect,
        ports: portSelect?.length === 0 ? [] : portSelect,
      });
    }
    if (countrySelect && portOptionProps?.length) {
      onCloseAndClear();
    }
  }, [
    countrySelect,
    portSelect,
    hasCountryOther,
    portOptionProps?.length,
    dynamicLabels,
    countryOtherPreference,
    handleSubmit,
    onCloseAndClear,
  ]);

  return (
    <Modal
      isOpen={modal}
      toggle={onCloseAndClear}
      modalClassName={cx(styles.wrapper)}
      contentClassName={cx(styles.content)}
      className={styles.customModal}
      fade={false}
      style={{ height: '100%' }}
    >
      <div
        className={cx(
          'd-flex align-items-center justify-content-between',
          styles.header,
        )}
      >
        <span>
          {defaultCountry
            ? `${renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.Edit,
              )} ${type} ${renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.preference,
              )}`
            : renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Add more'],
              )}
        </span>
        <div className={styles.icClose} onClick={onCloseAndClear}>
          <img src={images.icons.icClose} alt="ic-close-modal" />
        </div>
      </div>
      <div className={cx(styles.container)}>
        <div className="mt-3">
          <NewAsyncSelect
            disabled={disable}
            labelSelect={renderDynamicLabel(
              dynamicLabels,
              USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.Country,
            )}
            titleResults={renderDynamicLabel(
              dynamicLabels,
              USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Selected country'],
            )}
            placeholder={renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['Please select'],
            )}
            searchContent={renderDynamicLabel(
              dynamicLabels,
              USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.Country,
            )}
            textSelectAll={renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['Select all'],
            )}
            textBtnConfirm={renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS.Confirm,
            )}
            isRequired
            hasImage
            messageRequired={errors?.countrySelect}
            handleConfirm={(value: OptionProps[]) => {
              setCountrySelect(value[0]);
              setPortSelect([]);
              setErrors((prev) => ({ ...prev, countrySelect: null }));
            }}
            onChangeSearch={(value: string) =>
              dispatch(getCountryActions.request({ content: value }))
            }
            options={countryOptionProps}
            value={countrySelect}
            dynamicLabels={dynamicLabels}
          />
        </div>
        <div className="mt-3">
          <AsyncSelectTableProps
            rowLabels={rowLabels}
            handleChangeResult={(value: OptionProps[]) => {
              setPortSelect(value);
              setErrors((prev) => ({ ...prev, portSelect: null }));
            }}
            labelSelect={renderDynamicLabel(
              dynamicLabels,
              USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Port code'],
            )}
            result={portSelect}
            multiple
            messageRequired={errors?.portSelect}
            isRequired
            disabled={countrySelect === undefined || loadingPort}
            titleResults={renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS.Selected,
            )}
            placeholder={renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['Please select'],
            )}
            searchContent={renderDynamicLabel(
              dynamicLabels,
              USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.Port,
            )}
            textSelectAll={renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['Select all'],
            )}
            onChangeSearch={(value: string) => {
              dispatch(
                getListPortActions.request({
                  country: countrySelect,
                  content: value,
                }),
              );
            }}
            options={portOptionProps}
            value={portSelect}
            dynamicLabels={dynamicLabels}
          />
        </div>

        <div className="d-flex mt-3">
          <Button
            className={cx('w-100', styles.btnCancel)}
            buttonType={ButtonType.PrimaryLight}
            onClick={onCloseAndClear}
            disabled={disable}
          >
            {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Cancel)}
          </Button>
          <Button
            className={cx('w-100', styles.btnDelete)}
            disabled={disable}
            onClick={handleForm}
          >
            {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Save)}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalAvailableArea;
