import cx from 'classnames';
import { USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/userManagement.const';
import { StatusPage, UserContext } from 'contexts/user/UserContext';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { toastError } from 'helpers/notification.helper';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { AvailableAreaDetail } from 'models/store/user/user.model';
import { FC, useContext, useMemo, useCallback, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { v4 } from 'uuid';
import ModalAvailableArea from '../../modal/ModalAvailableArea';
import styles from './preference.module.scss';
import PreferenceItem from './PreferenceItem';

interface PreferenceProps {
  typePreference?: string;
  dynamicLabels?: IDynamicLabel;
}

const Preference: FC<PreferenceProps> = (props) => {
  const { typePreference, dynamicLabels } = props;
  const [modal, setModal] = useState(false);
  const { watch, setValue } = useFormContext();
  const uniqueId = v4();

  const watchAvailableArea: AvailableAreaDetail = watch('availableAreas');

  const { statusPage } = useContext(UserContext);

  const renderPreferenceTitle = () => {
    switch (typePreference) {
      case 'no':
        return renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['No preference'],
        );
      case 'neutral':
        return renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Neutral preference'],
        );
      default:
        return renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Strong preference'],
        );
    }
  };

  const filterAreaByType = useMemo(
    () => watchAvailableArea?.[typePreference] || [],
    [typePreference, watchAvailableArea],
  );

  const handleSubmit = useCallback(
    ({ country, ports }) => {
      const isError: boolean = watchAvailableArea?.[typePreference]?.some(
        (i) =>
          i?.preference === typePreference &&
          country?.value?.toString() === i?.country?.value?.toString(),
      );
      if (isError) {
        toastError(
          renderDynamicLabel(
            dynamicLabels,
            USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Country is existed'],
          ),
        );
        return;
      }

      let newData = watchAvailableArea || {};
      const newFillData = watchAvailableArea?.[typePreference] || [];
      newData = {
        ...newData,
        [typePreference]: [
          ...newFillData,
          {
            country,
            ports,
            preference: typePreference,
          },
        ],
      };
      setValue('availableAreas', newData);
    },
    [dynamicLabels, setValue, typePreference, watchAvailableArea],
  );

  return (
    <div className={styles.preference}>
      <div
        className={cx(
          'd-flex justify-content-between align-items-center',
          styles.preferenceHeader,
          {
            [styles.no]: typePreference === 'no',
            [styles.neutral]: typePreference === 'neutral',
            [styles.strong]: typePreference === 'strong',
          },
        )}
      >
        <div>{renderPreferenceTitle()}</div>
        {statusPage !== StatusPage.VIEW && (
          <button className={styles.addMore} onClick={() => setModal(true)}>
            {renderDynamicLabel(
              dynamicLabels,
              USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Add more'],
            )}{' '}
            +
          </button>
        )}
      </div>
      {filterAreaByType?.map((item, index) => (
        <PreferenceItem
          key={uniqueId + index.toString()}
          preferenceDetail={item}
          dynamicLabels={dynamicLabels}
        />
      ))}
      <ModalAvailableArea
        type={typePreference}
        isDelete
        toggle={() => setModal(!modal)}
        modal={modal}
        handleSubmit={handleSubmit}
        title={renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.Country,
        )}
        dynamicLabels={dynamicLabels}
      />
    </div>
  );
};

export default Preference;
