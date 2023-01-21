import images from 'assets/images/images';
import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import DetectEsc from 'components/common/modal/DetectEsc';
import { useDispatch, useSelector } from 'react-redux';
import useEffectOnce from 'hoc/useEffectOnce';
import { getListUserActions } from 'store/user/user.action';
import { CarFormContext } from './CarFormContext';
import styles from './modal-car-creation.module.scss';
import Step1 from './steps/Step1';
import Step2 from './steps/Step2';
import Step3 from './steps/Step3';
import Step4 from './steps/Step4';

interface ModalComponentProps {
  onClose: () => void;
  planningAndRequestId?: string;
  carId: string;
  dynamicLabels?: IDynamicLabel;
  sNo?: string;
  featurePage: Features;
  subFeaturePage: SubFeatures;
}

const CarSteps: FC<ModalComponentProps> = ({
  onClose,
  planningAndRequestId,
  carId,
  dynamicLabels,
  sNo,
  featurePage,
  subFeaturePage,
  ...other
}) => {
  const [data, setData] = useState(null);
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.authenticate);
  const {
    activeStep,
    setPlanningAndRequestId,
    handleGetCarDetail,
    closeAndResetData,
  } = useContext(CarFormContext);

  const closeAndClearData = useCallback(() => {
    setData(null);
    onClose();
  }, [onClose]);

  const renderStep = useMemo(() => {
    switch (activeStep) {
      case 1:
        return (
          <Step1
            featurePage={featurePage}
            subFeaturePage={subFeaturePage}
            sNo={sNo}
            dynamicLabels={dynamicLabels}
          />
        );
      case 2:
        return (
          <Step2 onClose={closeAndClearData} dynamicLabels={dynamicLabels} />
        );
      case 3:
        return (
          <Step3 onClose={closeAndClearData} dynamicLabels={dynamicLabels} />
        );
      case 4:
        return (
          <Step4
            featurePage={featurePage}
            subFeaturePage={subFeaturePage}
            onClose={closeAndClearData}
            dynamicLabels={dynamicLabels}
          />
        );
      default:
        return (
          <Step1
            featurePage={featurePage}
            subFeaturePage={subFeaturePage}
            dynamicLabels={dynamicLabels}
          />
        );
    }
  }, [
    activeStep,
    closeAndClearData,
    dynamicLabels,
    featurePage,
    sNo,
    subFeaturePage,
  ]);

  useEffect(() => {
    setPlanningAndRequestId(planningAndRequestId);
  }, [planningAndRequestId, setPlanningAndRequestId]);

  useEffectOnce(() => {
    dispatch(
      getListUserActions.request({
        pageSize: -1,
        companyId: userInfo?.mainCompanyId,
      }),
    );
  });

  useEffect(() => {
    if (carId) {
      handleGetCarDetail(carId, true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [carId]);

  return (
    <div>
      <div className={styles.header}>
        <div>
          {data?.entityType}{' '}
          {renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['Corrective action request'],
          )}
        </div>
        <div className={styles.closeBtn} onClick={closeAndResetData}>
          <img src={images.icons.icClose} alt="ic-close-modal" />
        </div>
      </div>
      <DetectEsc close={closeAndResetData} />
      <div className={styles.content}>{renderStep}</div>
    </div>
  );
};

export default CarSteps;
