import cx from 'classnames';
import { Col, Row } from 'reactstrap';
import Input from 'components/ui/input/Input';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import { FieldValues, useForm } from 'react-hook-form';
import AsyncSelectForm from 'components/react-hook-form/async-select/AsyncSelectForm';
import LabelUI from 'components/ui/label/LabelUI';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
import images from 'assets/images/images';
// import { useSelector, useDispatch } from 'react-redux';
import useVesselHeaderRightShip from 'pages/vessel-screening/utils/hooks/useVesselHeaderRightship';
import { GroupButton } from 'components/ui/button/GroupButton';
import { useCallback } from 'react';
// import history from 'helpers/history.helper';
// import { AppRouteConst } from 'constants/route.const';
import moment from 'moment';
import styles from './right-ship.module.scss';

const FormRightShip = () => {
  // const { vesselDetail } = useSelector((state) => state.vessel);
  const metadata = useVesselHeaderRightShip();
  // const dispatch = useDispatch();

  const { t } = useTranslation([
    I18nNamespace.RIGHT_SHIP,
    I18nNamespace.COMMON,
  ]);
  const defaultValues = {
    ratingDate: null,
    rating: null,
    evdi: null,
    verified: false,
    plus: null,
    safetyScore: null,
    safetyScoreDate: null,
    indicativeScore: null,
    docSafetyScore: null,
    inspectionRequired: null,
    lastInspectionOutcome: null,
    lastInspectionVadity: null,
    inspectionAdditionalData: null,
    technicalManagerName: null,
    technicalManagerCode: null,
    plaftformLink: null,
  };
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'all',
    defaultValues,
  });
  //   const renderButtonGroup = useMemo(
  //     () => (
  //       <GroupButton
  //         className="pt-3"
  //         handleCancel={handleCancel}
  //         handleSubmit={handleSubmit(onSubmitForm, scrollToView)}
  //         txButtonBetween={t('buttons.save')}
  //         txButtonLeft={t('buttons.cancel')}
  //         buttonTypeLeft={ButtonType.CancelOutline}
  //       />
  //     ),
  //     [handleCancel, handleSubmit, onSubmitForm, scrollToView, t],
  //   );
  const onSubmitForm = useCallback((formData) => {
    const params = {
      ghg_rating: moment(formData?.ghg_rating).toISOString(),
      rating: formData?.rating,
      evdi: formData.evdi,
      verified: formData?.verified,
      plus: formData?.plus?.[0]?.value,
      safetyScore: formData?.safetyScore,
      safetyScoreDate: moment(formData?.safetyScoreDate).toISOString(),
      indicativeScore: formData.indicativeScore,
      docSafetyScore: formData.docSafetyScore,
      inspectionRequired: formData?.inspectionRequired,
      lastInspectionOutcome: formData?.lastInspectionOutcome,
      lastInspectionVadity: moment(
        formData?.lastInspectionVadity,
      ).toISOString(),
      inspectionAdditionalData: formData?.inspectionAdditionalData,
      technicalManagerName: formData?.technicalManagerName,
      technicalManagerCode: formData?.technicalManagerCode,
      plaftformLink: formData.plaftformLink,
      // handleSuccess: () => history.push(AppRouteConst.VESSEL_SCREENING),
    };
    // eslint-disable-next-line no-console
    console.log(params);
  }, []);
  return (
    <>
      <div className={cx(styles.wrapperContainer)}>
        <div className={cx(styles.header)}>
          {metadata}
          <ul>
            <li>
              <div>
                <img alt="buttonImport" src={images.icons.buttonImport} />
              </div>
            </li>
          </ul>
        </div>
        <div className={styles.container}>
          <div className={cx(styles.part)}>
            <div className={cx('fw-bold', styles.titleForm)}>
              {t('RightShip Information')}
            </div>
            <Row gutter={[24, 0]} className="pt-2 mx-0">
              <Col span={8}>
                <DateTimePicker
                  messageRequired={errors?.dateRequest?.message || ''}
                  label={t('labels.txratingDate')}
                  control={control}
                  className={cx('w-100')}
                  name="ghg_rating"
                  id="ghg_rating"
                  inputReadOnly
                />
              </Col>
              <Col span={8}>
                <Input
                  label={t('labels.txrating')}
                  placeholder={t('placeholders.rating')}
                  {...register('rating')}
                />
              </Col>
              <Col span={8} className={cx('pt-3')} />
            </Row>
          </div>
          <div className={cx(styles.part)}>
            <div className={cx('fw-bold', styles.titleForm)}>
              {t('GHG Additional data')}
            </div>
            <Row gutter={[24, 0]} className="pt-2 mx-0">
              <Col span={8}>
                <Input
                  label={t('labels.txevdi')}
                  maxLength={300}
                  placeholder={t('placeholders.evdi')}
                  {...register('evdi')}
                />
              </Col>
              <Col span={8}>
                <LabelUI
                  className={cx(styles.labelForm)}
                  label={t('labels.txverified')}
                />
                <RadioForm
                  className={cx(styles.radio)}
                  name="verfied"
                  control={control}
                  radioOptions={[
                    {
                      value: true,
                      label: 'Yes',
                    },
                    {
                      value: false,
                      label: 'No',
                    },
                  ]}
                />
              </Col>
              <Col span={8}>
                <AsyncSelectForm
                  control={control}
                  name="plus"
                  id="plus"
                  labelSelect={t('labels.txplus')}
                  searchContent={t('plus')}
                  placeholder={t('placeholders.plus')}
                />
              </Col>
            </Row>
          </div>
          <div className={cx(styles.part)}>
            <Row gutter={[24, 0]} className="pt-2 mx-0">
              <Col span={8}>
                <Input
                  label={t('labels.txsafetyScore')}
                  placeholder={t('placeholders.safetyScore')}
                  {...register('safetyScore')}
                />
              </Col>
              <Col span={8}>
                <DateTimePicker
                  messageRequired={errors?.dateRequest?.message || ''}
                  label={t('labels.txsafetyScoreDate')}
                  control={control}
                  className={cx('w-100')}
                  name="safetyScoreDate"
                  id="safetyScoreDate"
                  inputReadOnly
                />
              </Col>
              <Col span={8} />
            </Row>
          </div>
          <div className={cx(styles.part)}>
            <div className={cx('fw-bold', styles.titleForm)}>
              {t('Safety score addition data')}
            </div>
            <Row gutter={[24, 0]} className="pt-2 mx-0">
              <Col span={8}>
                <LabelUI
                  className={cx(styles.labelForm)}
                  label={t('labels.txindicativeScore')}
                />
                <RadioForm
                  className={cx(styles.radio)}
                  name="indicativeScore"
                  control={control}
                  radioOptions={[
                    {
                      value: true,
                      label: 'Yes',
                    },
                    {
                      value: false,
                      label: 'No',
                    },
                  ]}
                />
              </Col>

              <Col span={8}>
                <Input
                  label={t('labels.txdocSafetyScore')}
                  maxLength={300}
                  placeholder={t('placeholders.docSafetyScore')}
                  {...register('docSafetyScore')}
                />
              </Col>
              <Col span={8} />
            </Row>
            <Row gutter={[24, 0]} className="pt-2 mx-0">
              <Col span={8}>
                <LabelUI
                  className={cx(styles.labelForm)}
                  label={t('labels.txinspectionRequired')}
                />
                <RadioForm
                  className={cx(styles.radio)}
                  name="inspectionRequired"
                  control={control}
                  radioOptions={[
                    {
                      value: true,
                      label: 'Yes',
                    },
                    {
                      value: false,
                      label: 'No',
                    },
                  ]}
                />
              </Col>
              <Col span={8}>
                <Input
                  label={t('labels.txlastInspectionOutcome')}
                  maxLength={300}
                  placeholder={t('placeholders.lastInspectionOutcome')}
                  {...register('lastInspectionOutcome')}
                />
              </Col>
              <Col span={8}>
                <DateTimePicker
                  messageRequired={errors?.dateRequest?.message || ''}
                  label={t('labels.txratingDate')}
                  control={control}
                  className={cx('w-100')}
                  name="lastInspectionValidity"
                  id="lastInspectionValidity"
                  inputReadOnly
                />
              </Col>
            </Row>
            <Row gutter={[24, 0]} className="pt-2 mx-0">
              <Col span={8}>
                <Input
                  label={t('labels.txinspectionAdditionalData')}
                  maxLength={300}
                  placeholder={t('placeholders.inspectionAdditionalData')}
                  {...register('inspectionAdditionalData')}
                />
              </Col>
              <Col span={8}>
                <Input
                  label={t('labels.txtechnicalManagerName')}
                  maxLength={300}
                  placeholder={t('placeholders.technicalManagerName')}
                  {...register('technicalManagerName')}
                />
              </Col>
              <Col span={8}>
                <Input
                  label={t('labels.txtechnicalManagerCode')}
                  maxLength={300}
                  placeholder={t('placeholders.technicalManagerCode')}
                  {...register('technicalManagerCode')}
                />
              </Col>
            </Row>
            <Row gutter={[24, 0]} className="pt-2 mx-0">
              <Col span={8}>
                <Input
                  label={t('labels.txplaftformLink')}
                  maxLength={300}
                  placeholder={t('placeholders.plaftformLink')}
                  {...register('plaftformLink')}
                />
              </Col>
              <Col span={8} />
              <Col span={8} />
            </Row>
            <GroupButton
              className="pt-3"
              handleSubmit={handleSubmit(onSubmitForm)}
              txButtonBetween={t('buttons.save')}
              txButtonLeft={t('buttons.cancel')}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default FormRightShip;
