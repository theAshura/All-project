import cx from 'classnames';
import { useEffect, FC, ReactElement, useMemo, useCallback } from 'react';
import { Col, Row } from 'reactstrap';
import { statusOptions } from 'constants/filter.const';
import { useForm, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import history from 'helpers/history.helper';
import { AppRouteConst } from 'constants/route.const';
import Input from 'components/ui/input/Input';
import { useDispatch, useSelector } from 'react-redux';
import useEffectOnce from 'hoc/useEffectOnce';
import SelectUI from 'components/ui/select/Select';
import * as yup from 'yup';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { getListShipRankActions } from 'store/ship-rank/ship-rank.action';
import AsyncSelectForm from 'components/react-hook-form/async-select/AsyncSelectForm';
import { GroupButton } from 'components/ui/button/GroupButton';
import images from 'assets/images/images';
import isEmpty from 'lodash/isEmpty';
import { clearShipDirectResponsibleErrorsReducer } from '../../../store/ship-direct-responsible/ship-direct-responsible.action';
import {
  ShipDirectResponsible,
  ShipDirectResponsibleDetailResponse,
} from '../../../models/api/ship-direct-responsible/ship-direct-responsible.model';
import styles from './form.module.scss';

export interface OptionProps {
  value: string;
  label: string | ReactElement;
  image?: string;
  selected: boolean;
}

interface ShipDirectResponsibleFormProps {
  isEdit: boolean;
  isCreate?: boolean;
  data: ShipDirectResponsibleDetailResponse;
  messageError?: string;
  onSubmit: (CreateShipDirectResponsibleParams) => void;
}

const defaultValues = {
  code: '',
  name: '',
  status: 'active',
  shipRank: [],
};

const ShipDirectResponsibleForm: FC<ShipDirectResponsibleFormProps> = ({
  isEdit,
  data,
  onSubmit,
  isCreate,
}) => {
  const { t } = useTranslation([
    I18nNamespace.SHIP_DIRECT_RESPONSIBLE,
    I18nNamespace.COMMON,
  ]);
  const dispatch = useDispatch();

  const schema = yup.object().shape({
    code: yup.string().trim().nullable().required(t('thisFieldIsRequired')),
    name: yup.string().trim().nullable().required(t('thisFieldIsRequired')),
    shipRank: yup
      .array()
      .required(t('thisFieldIsRequired'))
      .min(1, 'This field is required'),
  });

  const { errorList, loading } = useSelector(
    (state) => state.shipDirectResponsible,
  );
  const { listShipRanks } = useSelector((state) => state.shipRank);
  useEffectOnce(() => {
    dispatch(getListShipRankActions.request({ pageSize: -1 }));
  });

  const shipRankOption: OptionProps[] = useMemo(
    () =>
      listShipRanks?.data
        .filter((item) => item.status === 'active')
        .map((item) => ({
          value: item.id.toString(),
          label: item.name,
          selected: false,
        })),
    [listShipRanks],
  );
  const {
    register,
    control,
    handleSubmit,
    getValues,
    setError,
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const handleCancel = () => {
    if (!isEdit) {
      history.push(AppRouteConst.SHIP_DIRECT_RESPONSIBLE);
    } else {
      showConfirmBase({
        isDelete: false,
        txTitle: t('modal.cancelTitle'),
        txMsg: t('modal.cancelMessage'),
        onPressButtonRight: () =>
          history.push(AppRouteConst.SHIP_DIRECT_RESPONSIBLE),
      });
    }
  };
  const resetForm = () => {
    // reset(data)
    setValue('code', '');
    setValue('name', '');
    setValue('description', '');
    setValue('shipRank', []);
    setValue('status', 'active');
  };

  const handleSubmitAndNew = (data: ShipDirectResponsible) => {
    const shipRank = getValues('shipRank');
    const shipRankId = [];
    if (Array.isArray(shipRank)) {
      getValues('shipRank').forEach((element) => {
        shipRankId.push(element.value);
      });
    } else {
      shipRankId.push(shipRank.value);
    }
    const dataNew: ShipDirectResponsible = {
      ...data,
      shipRankId: shipRankId[0],
      isNew: true,
      resetForm,
    };

    onSubmit(dataNew);
  };

  const onSubmitForm = useCallback(
    (data: ShipDirectResponsible) => {
      const shipRank = getValues('shipRank');
      const shipRankId = [];
      if (Array.isArray(shipRank)) {
        if (!shipRank.length) {
          return setError('shipRank', {
            message: t('thisFieldIsRequired'),
          });
        }
        getValues('shipRank').forEach((element) => {
          shipRankId.push(element.value);
        });
      } else {
        if (isEmpty(shipRank)) {
          return setError('shipRank', {
            message: t('thisFieldIsRequired'),
          });
        }
        shipRankId.push(shipRank.value);
      }
      const dataNew: ShipDirectResponsible = {
        ...data,
        shipRankId: shipRankId[0],
      };

      onSubmit(dataNew);
      return null;
    },
    [getValues, onSubmit, setError, t],
  );

  useEffect(() => {
    if (data) {
      const shipRank = shipRankOption?.filter(
        (item) => item.value === data.shipRankId,
      );

      setValue('code', data.code || '');
      setValue('name', data.name);
      setValue('description', data.description);
      setValue('status', data.status);
      setValue('shipRank', shipRank?.length > 0 ? shipRank : []);
    }
    return () => {
      dispatch(clearShipDirectResponsibleErrorsReducer());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, shipRankOption]);

  useEffect(() => {
    if (errorList?.length) {
      errorList.forEach((item) => {
        switch (item.fieldName) {
          case 'code':
            setError('code', { message: item.message });
            break;
          case 'name':
            setError('name', { message: item.message });
            break;
          default:
            break;
        }
      });
    } else {
      setError('code', { message: '' });
      setError('name', { message: '' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorList]);

  return loading && !isCreate ? (
    <div className="d-flex justify-content-center">
      <img
        src={images.common.loading}
        className={styles.loading}
        alt="loading"
      />
    </div>
  ) : (
    <div className={cx(styles.wrapperContainer)}>
      <div className={cx(styles.containerForm)}>
        <div className={cx('fw-bold', styles.titleForm)}>
          {t('generalInformation')}
        </div>
        <Row className="pt-4 mx-0">
          <Col className={cx('p-0 me-3')}>
            <Input
              label={t('codeForm')}
              className={cx({ [styles.disabledInput]: !isEdit })}
              isRequired
              readOnly={!isEdit}
              placeholder={t('placeholderCode')}
              messageRequired={errors?.code?.message || ''}
              {...register('code')}
              maxLength={20}
            />
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <Input
              label={t('nameForm')}
              className={cx({ [styles.disabledInput]: !isEdit })}
              {...register('name')}
              isRequired
              readOnly={!isEdit}
              messageRequired={errors?.name?.message || ''}
              placeholder={t('placeholderName')}
              maxLength={128}
            />
          </Col>
        </Row>
        <Row className="pt-4 mx-0">
          <Col className={cx('p-0 me-3')}>
            <AsyncSelectForm
              disabled={!isEdit}
              control={control}
              name="shipRank"
              labelSelect="Ship rank"
              isRequired
              placeholder="Please select"
              searchContent="Ship rank"
              textSelectAll="Select all"
              textBtnConfirm="Confirm"
              hasImage
              messageRequired={errors?.shipRank?.message || ''}
              onChangeSearch={(value: string) =>
                dispatch(getListShipRankActions.request({ content: value }))
              }
              options={shipRankOption}
            />
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <div
              className={cx(
                styles.labelSelect,
                'd-flex align-items-start pb-2',
              )}
            >
              <span className={styles.label}>{t('status')} </span>
              {/* <img src={images.icons.icRequiredAsterisk} alt="required" /> */}
            </div>
            <SelectUI
              data={statusOptions}
              disabled={!isEdit}
              name="status"
              className={cx(
                styles.inputSelect,
                { [styles.disabledSelect]: !isEdit },
                'w-100',
              )}
              control={control}
            />
          </Col>
        </Row>

        <Row className="pt-4 mx-0">
          <Col className={cx('p-0 me-3')}>
            <Input
              label={t('description')}
              className={cx({ [styles.disabledInput]: !isEdit })}
              readOnly={!isEdit}
              placeholder={t('placeholderDescription')}
              messageRequired={errors?.description?.message || ''}
              {...register('description')}
              maxLength={250}
            />
          </Col>
          <Col className={cx('p-0 ms-3')} />
        </Row>
      </div>
      {isEdit && (
        <GroupButton
          className={styles.GroupButton}
          handleCancel={handleCancel}
          handleSubmit={handleSubmit(onSubmitForm)}
          handleSubmitAndNew={
            isCreate ? handleSubmit(handleSubmitAndNew) : undefined
          }
          disable={!isEdit}
        />
      )}
    </div>
  );
};

export default ShipDirectResponsibleForm;
