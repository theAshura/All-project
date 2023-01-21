import {
  FC,
  useState,
  useContext,
  useEffect,
  useMemo,
  useCallback,
} from 'react';
import images from 'assets/images/images';
import cx from 'classnames';
import { StatusPage, UserContext } from 'contexts/user-profile/UserContext';
import { useFormContext } from 'react-hook-form';
import {
  AvailableAreaDetail,
  AvailableAreaItem,
} from 'models/store/user/user.model';
import isEqual from 'lodash/isEqual';
import { getListPortActions } from 'store/port/port.action';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/userManagement.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { useDispatch } from 'react-redux';
import ModalAvailableArea from '../../modal/ModalAvailableArea';
import ModalAvailableShow from '../../modal/ModalAvailableShow';
import styles from './preference.module.scss';
import Dropdown, { MenuOption } from '../../../../ui/drop-down/Dropdowns';

interface PreferenceItemProps {
  preferenceDetail?: AvailableAreaItem;
  dynamicLabels?: IDynamicLabel;
}

const PreferenceItem: FC<PreferenceItemProps> = (props) => {
  const { preferenceDetail, dynamicLabels } = props;

  const { watch, setValue } = useFormContext();

  const watchAvailableArea: AvailableAreaDetail = watch('availableAreas');
  const [editModal, setEditModal] = useState(false);
  const [isShowOptions, setIsShowOptions] = useState(false);
  const dispatch = useDispatch();

  const { statusPage } = useContext(UserContext);

  useEffect(() => {
    if (editModal || isShowOptions) {
      dispatch(
        getListPortActions.request({
          country: String(preferenceDetail.country?.value) || '',
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editModal, isShowOptions]);

  const handleDelete = useCallback(() => {
    let newData = watchAvailableArea || {};

    const newFillData = watchAvailableArea[preferenceDetail.preference]?.filter(
      (i) => !isEqual(i, preferenceDetail),
    );
    newData = { ...newData, [preferenceDetail.preference]: newFillData };

    setValue('availableAreas', newData);
  }, [preferenceDetail, setValue, watchAvailableArea]);

  const menuOptions = useMemo<MenuOption[]>(
    () => [
      {
        label: renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Edit),
        icon: (
          <img className="me-2" src={images.icons.icEditGray} alt="ic-edit" />
        ),
        onClick: () => {
          setEditModal(true);
        },
      },
      {
        label: renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Delete),
        icon: (
          <img
            className="me-2"
            src={images.icons.icRemoveRed}
            alt="ic-remove"
          />
        ),
        type: 'danger',
        onClick: handleDelete,
      },
    ],
    [dynamicLabels, handleDelete],
  );

  return (
    <div
      className={cx(
        'd-flex align-items-center justify-content-between',
        styles.preferenceItem,
      )}
    >
      <img
        className={styles.countryFlag}
        src={preferenceDetail?.country?.image || images.common.avatarDefault}
        alt="avatar"
      />
      <div className={cx('text-start', styles.country)}>
        <p className="mb-0">{preferenceDetail?.country?.label}</p>
        <button
          onClick={() => {
            setIsShowOptions(true);
          }}
        >{`${preferenceDetail?.ports?.length} ${renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.ports,
        )}`}</button>
      </div>
      {statusPage !== StatusPage.VIEW && (
        <>
          <div className={styles.actions}>
            <Dropdown menuOptions={menuOptions}>
              <img
                src={images.icons.ic3Dot}
                alt="more"
                className={styles.moreAction}
              />
            </Dropdown>
          </div>
          <ModalAvailableArea
            defaultPorts={preferenceDetail.ports}
            defaultCountry={preferenceDetail.country}
            type={preferenceDetail?.preference}
            isDelete
            toggle={() => setEditModal((p) => !p)}
            modal={editModal}
            handleSubmit={({ country, ports }) => {
              let newData = watchAvailableArea || {};

              const newFillData = watchAvailableArea[
                preferenceDetail.preference
              ]?.map((i) => {
                if (isEqual(i, preferenceDetail)) {
                  return { ...preferenceDetail, country, ports };
                }
                return i;
              });

              newData = {
                ...newData,
                [preferenceDetail.preference]: newFillData,
              };

              setValue('availableAreas', newData);
            }}
            title={renderDynamicLabel(
              dynamicLabels,
              USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.Country,
            )}
            dynamicLabels={dynamicLabels}
          />
        </>
      )}

      <ModalAvailableShow
        defaultPorts={preferenceDetail.ports}
        defaultCountry={preferenceDetail.country}
        type={preferenceDetail?.preference}
        isDelete
        toggle={() => {
          setIsShowOptions((p) => !p);
        }}
        modal={isShowOptions}
        handleSubmit={({ country, ports }) => {}}
        title={renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.Country,
        )}
        dynamicLabels={dynamicLabels}
      />
    </div>
  );
};

export default PreferenceItem;
