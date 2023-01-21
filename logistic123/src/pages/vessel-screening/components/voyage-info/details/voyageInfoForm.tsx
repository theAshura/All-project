import cx from 'classnames';
import Input from 'components/ui/input/Input';
import { fieldVoyageInfo } from 'constants/common.const';
import queryString from 'query-string';
import { I18nNamespace } from 'constants/i18n.const';
import { getVoyageInfoDetailActions } from 'pages/vessel-screening/store/voyageInfo-store/voyage-info.action';
import { VoyageInfo } from 'pages/vessel-screening/utils/models/voyage-info.model';
import { FC, useEffect, useMemo } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router';
import { Col, Row, Table } from 'reactstrap';
import { formatDateWithTimeUTC } from 'helpers/date.helper';
import styles from './detail.module.scss';

interface VoyageInfoFormProps {
  isEdit: boolean;
  data: VoyageInfo;
}

const VoyageInfoForm: FC<VoyageInfoFormProps> = ({ isEdit, data }) => {
  const { t } = useTranslation([I18nNamespace.VOYAGE, I18nNamespace.COMMON]);
  const dispatch = useDispatch();
  const { search } = useLocation();

  const parsed = queryString.parse(search);

  const { voyageInfoDetail } = useSelector((state) => state.voyageInfo);
  const { register, setValue } = useForm<FieldValues>({
    mode: 'onChange',
  });

  useEffect(() => {
    dispatch(
      getVoyageInfoDetailActions.request(parsed?.voyageInfoId.toString()),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsed?.voyageInfo]);

  const cargos = useMemo(() => {
    const cargoNamestr = voyageInfoDetail?.cargoName;
    const cargoNostr = voyageInfoDetail?.cargoNo;
    const cargoNameArrs =
      cargoNamestr?.split(',')?.map((item) => item.trim()) || [];
    const cargoNoArrs =
      cargoNostr?.split(',')?.map((item) => item.trim()) || [];
    const cargoList = [];
    for (let i = 0; i < cargoNameArrs?.length; i += 1) {
      cargoList.push({
        name: cargoNameArrs?.[i],
        no: cargoNoArrs?.[i],
      });
    }

    return cargoList;
  }, [voyageInfoDetail?.cargoName, voyageInfoDetail?.cargoNo]);

  useEffect(() => {
    if (voyageInfoDetail) {
      fieldVoyageInfo.forEach((item) => {
        setValue(item, voyageInfoDetail[item]);
      });
      setValue('companyCode', voyageInfoDetail?.company?.name);

      setValue(
        'loadDate',
        formatDateWithTimeUTC(voyageInfoDetail?.loadDate) || '-',
      );
      setValue(
        'lastUpdateGMT',
        formatDateWithTimeUTC(voyageInfoDetail?.lastUpdateGMT) || '-',
      );
      setValue(
        'completeDateGMT',
        formatDateWithTimeUTC(voyageInfoDetail?.completeDateGMT) || '-',
      );
      setValue(
        'commenceDateGMT',
        formatDateWithTimeUTC(voyageInfoDetail?.commenceDateGMT) || '-',
      );
      setValue(
        'commenceDateLocal',
        formatDateWithTimeUTC(voyageInfoDetail?.commenceDateLocal) || '-',
      );
      setValue(
        'completeDateLocal',
        formatDateWithTimeUTC(voyageInfoDetail?.completeDateLocal) || '-',
      );
      setValue('vesselType', voyageInfoDetail?.vessel?.vesselType.name);
      setValue('vesselCode', voyageInfoDetail?.vessel?.code);
      setValue('vesselName', voyageInfoDetail?.vessel?.name);
    }
  }, [data, setValue, voyageInfoDetail]);

  return (
    <>
      <div className={cx(styles.container)}>
        <div className={cx(styles.containerForm)}>
          <div className={cx(styles.voyageDetail)}>
            <div className={cx('fw-bold', styles.titleForm)}>
              {t('txVoyageDetail')}
            </div>
            <Row className="pt-2 mx-0">
              <Col className="p-0 me-3">
                <Input
                  label={t('txVoyageStatus')}
                  readOnly
                  disabledCss
                  {...register('voyageStatus')}
                />
              </Col>
              <Col>
                <Input
                  label={t('txVoyageNo')}
                  readOnly
                  disabledCss
                  {...register('voyageNo')}
                />
              </Col>
              <Col className="p-0 ms-3">
                <Input
                  label={t('txOpsCoordinator')}
                  readOnly
                  disabledCss
                  {...register('opsCoordinator')}
                />
              </Col>
            </Row>
            <Row className="pt-2 mx-0">
              <Col className="p-0 me-3">
                <Input
                  label={t('txCompanyCode')}
                  readOnly
                  disabledCss
                  {...register('companyCode')}
                />
              </Col>
              <Col>
                <Input
                  label={t('txLoadDate')}
                  readOnly
                  disabledCss
                  {...register('loadDate')}
                />
              </Col>
              <Col className="p-0 ms-3">
                <Input
                  label={t('txConsecutive')}
                  readOnly
                  disabledCss
                  {...register('consecutive')}
                />
              </Col>
            </Row>
            <Row className="pt-2 mx-0">
              <Col className="p-0 me-3">
                <Input
                  label={t('txFirstTCI')}
                  readOnly
                  disabledCss
                  {...register('firstTCI')}
                />
              </Col>
              <Col>
                <Input
                  label={t('txLastTCI')}
                  readOnly
                  disabledCss
                  {...register('lastTCI')}
                />
              </Col>
              <Col className="p-0 ms-3">
                <Input
                  label={t('txTotalLoadCargoVol')}
                  readOnly
                  disabledCss
                  {...register('totalLoadCargoVol')}
                />
              </Col>
            </Row>
            <Row className="pt-2 mx-0">
              <Col className="p-0 me-3">
                <Input
                  label={t('txTradeAreaNo')}
                  readOnly
                  disabledCss
                  {...register('tradeAreaNo')}
                />
              </Col>
              <Col>
                <Input
                  label={t('txFirstLoadPortNo')}
                  readOnly
                  disabledCss
                  {...register('firstLoadPortNo')}
                />
              </Col>
              <Col className="p-0 ms-3">
                <Input
                  label={t('txFirstLoadPort')}
                  readOnly
                  disabledCss
                  {...register('firstLoadPort')}
                />
              </Col>
            </Row>
            <Row className="pt-2 mx-0">
              <Col className="p-0 me-3">
                <Input
                  label={t('txVesselType')}
                  readOnly
                  disabledCss
                  {...register('vesselType')}
                />
              </Col>
              <Col>
                <Input
                  label={t('txLastDischargePortNo')}
                  readOnly
                  disabledCss
                  {...register('lastDischargePortNo')}
                />
              </Col>
              <Col className="p-0 ms-3">
                <Input
                  label={t('txLastDischargePort')}
                  readOnly
                  disabledCss
                  {...register('lastDischargePort')}
                />
              </Col>
            </Row>
            <Row className="pt-2 mx-0">
              <Col className="p-0 me-3">
                <Input
                  label={t('txFixtureNo')}
                  readOnly
                  disabledCss
                  {...register('fixtureNo')}
                />
              </Col>
              <Col>
                <Input
                  label={t('txEstimateId')}
                  readOnly
                  disabledCss
                  {...register('estimateId')}
                />
              </Col>
              <Col className="p-0 ms-3">
                <Input
                  label={t('txCargoGradesList')}
                  readOnly
                  disabledCss
                  {...register('cargoGradesList')}
                />
              </Col>
            </Row>
            <Row className="pt-2 mx-0">
              <Col className="p-0 me-3">
                <Input
                  label={t('txCargoCounterPartyShortName')}
                  readOnly
                  disabledCss
                  {...register('cargoCounterpartyShortnames')}
                />
              </Col>
              <Col>
                <Input
                  label={t('txImosUrl')}
                  readOnly
                  disabledCss
                  {...register('imosUrl')}
                />
              </Col>
              <Col className="p-0 ms-3">
                <Input
                  label={t('txLastUpdateGmt')}
                  readOnly
                  disabledCss
                  {...register('lastUpdateGMT')}
                />
              </Col>
            </Row>
            <Row className="pt-2 mx-0">
              <Col className="p-0 me-3">
                <Input
                  label={t('txCompleteDateGmt')}
                  readOnly
                  disabledCss
                  {...register('completeDateGMT')}
                />
              </Col>
              <Col>
                <Input
                  label={t('txCommenceDateGmt')}
                  readOnly
                  disabledCss
                  {...register('commenceDateGMT')}
                />
              </Col>
              <Col className="p-0 ms-3">
                <Input
                  label={t('txOprType')}
                  readOnly
                  disabledCss
                  {...register('oprType')}
                />
              </Col>
            </Row>
            <Row className="pt-2 mx-0">
              <Col className="p-0 me-3">
                <Input
                  label={t('txVesselCode')}
                  readOnly
                  disabledCss
                  {...register('vesselCode')}
                />
              </Col>
              <Col>
                <Input
                  isRequired
                  label={t('txVesselName')}
                  readOnly
                  disabledCss
                  {...register('vesselName')}
                />
              </Col>
              <Col className="p-0 ms-3">
                <Input
                  label={t('txCommenceDateLocal')}
                  readOnly
                  disabledCss
                  {...register('commenceDateLocal')}
                />
              </Col>
            </Row>
            <Row className="pt-2 mx-0">
              <Col className={cx('p-0 me-3')}>
                <Input
                  label={t('txCompleteDateLocal')}
                  readOnly
                  disabledCss
                  {...register('completeDateLocal')}
                />
              </Col>
              <Col>{}</Col>
              <Col className="p-0 ms-3">{}</Col>
            </Row>
          </div>
        </div>
        <div className={cx(styles.caroList)}>
          <p className={cx('fw-bold', styles.titleForm)}>Cargo List</p>
          <Table hover className={styles.table}>
            <thead>
              <tr className={styles.title}>
                <th>{t('txCargoNo')}</th>
                <th>{t('txCargoShortName')}</th>
              </tr>
            </thead>
            <tbody>
              {cargos &&
                cargos.map((item, index) => (
                  <tr key={item?.no}>
                    <td>{item?.no}</td>
                    <td>{item?.name}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </div>
      </div>
    </>
  );
};

export default VoyageInfoForm;
