import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import cx from 'classnames';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import images from 'assets/images/images';
import { useTranslation } from 'react-i18next';
import { I18nNamespace } from 'constants/i18n.const';
import TableCp from 'components/common/table/TableCp';
import { Action } from 'models/common.model';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import PermissionCheck from 'hoc/withPermissionCheck';
import { RowComponent } from 'components/common/table/row/rowCp';
import ModalComponent from 'components/ui/modal/Modal';
import { GroupButton } from 'components/ui/button/GroupButton';
import * as yup from 'yup';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Col, Row } from 'reactstrap';
import Input from 'components/ui/input/Input';
import { MaxLength } from 'constants/common.const';
import SelectUI from 'components/ui/select/Select';
import { statusOptions } from 'constants/filter.const';
import { useDispatch, useSelector } from 'react-redux';
import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import { AdditionalReviewer } from 'models/api/report-of-finding/report-of-finding.model';
import { formatDateTime } from 'helpers/utils.helper';
import AsyncSelectForm from 'components/react-hook-form/async-select/AsyncSelectForm';
import { getListUserActions } from 'store/user/user.action';
import styles from './form.module.scss';

interface TableAdditionalReviewerProps {
  loading?: boolean;
  value?: AdditionalReviewer[];
  onchange?: (comment) => void;
  disable?: boolean;
}
const defaultValues = {
  code: '',
  name: '',
  description: '',
  shoreDepartmentIds: [],
  status: 'active',
};

export const TableAdditionalReviewer: FC<TableAdditionalReviewerProps> = (
  props,
) => {
  const dispatch = useDispatch();

  const { loading, value, onchange, disable } = props;
  const { listUser } = useSelector((state) => state.user);
  const [additional, setAdditional] = useState<AdditionalReviewer[]>(
    value || [],
  );
  const userOptions = useMemo(
    () =>
      listUser?.data?.map((item) => ({
        value: item.id,
        label: [item?.firstName, item?.lastName].join(' '),
      })),
    [listUser?.data],
  );
  const { t } = useTranslation([
    I18nNamespace.PLANNING_AND_REQUEST,
    I18nNamespace.COMMON,
  ]);
  const schema = yup.object().shape({
    reviewerId: yup.array().nullable().required(t('errors.required')),
    rankId: yup.string().trim().nullable().required(t('errors.required')),
    targetDate: yup.string().trim().nullable().required(t('errors.required')),
  });

  const {
    register,
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(schema),
  });
  const [modal, setModal] = useState(false);

  const rowLabels = [
    {
      id: 'action',
      label: t('buttons.txAction'),
      sort: false,
      width: '50',
    },
    {
      id: 'no',
      label: t('txSNo'),
      sort: true,
      width: '100px',
    },
    {
      id: 'reviewerId',
      label: t('txReviewerName'),
      sort: true,
      width: '200',
    },
    {
      id: 'rankId',
      label: t('txReviewDepartmentRank'),
      sort: true,
      width: '200',
    },
    {
      id: 'comment',
      label: t('txReviewerComment'),
      sort: true,
      width: '200',
    },
    {
      id: 'status',
      label: t('txStatus'),
      sort: true,
      width: '200',
    },
    {
      id: 'targetDate',
      label: t('txTargetDate'),
      sort: true,
      width: '200',
    },
  ];

  const onSubmitForm = (data) => {
    const newAdditional = [...additional];
    const reviewerId = getValues('reviewerId').map((e) => e.value)[0];
    const rankId = '707d0888-cbba-4523-813b-1d2d957a9611';
    newAdditional.push({
      ...data,
      targetDate: new Date(data?.targetDate).toISOString(),
      reviewerId,
      rankId,
    });

    setAdditional(newAdditional);
    setModal(false);
  };

  const handleCancel = () => {
    setModal(false);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const handleDelete = (index) => {
    const newAdditional = [...additional];
    newAdditional.splice(index, 1);
    setAdditional(newAdditional);
  };

  const sanitizeData = (data, index) => {
    const finalData = {
      id: index,
      no: data.no,
      reviewerId: data.reviewerId[0]?.label,
      rankId: data.rankId,
      comment: data.comment,
      status: data.status,
      targetDate: formatDateTime(data.targetDate),
    };
    return finalData;
  };

  const renderRow = useCallback(
    (isScrollable?: boolean) => {
      if (loading || !additional.length) {
        return null;
      }
      return (
        <tbody>
          {additional.map((item, index) => {
            const finalData = sanitizeData(item, index);
            const actions: Action[] = [
              {
                img: images.icons.icRemove,
                function: !disable ? () => handleDelete(index) : undefined,
                feature: Features.AUDIT_INSPECTION,
                subFeature: SubFeatures.REPORT_OF_FINDING,
                action: ActionTypeEnum.DELETE,
                buttonType: ButtonType.Orange,
                cssClass: 'ms-1',
              },
            ];
            return (
              <PermissionCheck
                options={{
                  feature: Features.AUDIT_INSPECTION,
                  subFeature: SubFeatures.REPORT_OF_FINDING,
                  action: ActionTypeEnum.UPDATE,
                }}
                key={JSON.stringify(item)}
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
    },
    [additional, disable, handleDelete, loading],
  );

  useEffect(() => {
    onchange(additional);
  }, [additional, onchange]);

  useEffect(() => {
    setValue('rankId', 'Leader');
  }, [setValue]);

  const renderForm = () => (
    <>
      <div>
        <Row className="pt-4 mx-0">
          <Col className="ps-0">
            <AsyncSelectForm
              isRequired
              disabled={loading}
              labelSelect={t('txReviewerName')}
              control={control}
              name="reviewerId"
              placeholder="Please select"
              messageRequired={errors?.reviewerId?.message || ''}
              onChangeSearch={(value: string) =>
                dispatch(
                  getListUserActions.request({
                    pageSize: -1,
                    isRefreshLoading: false,
                    content: value,
                    status: 'active',
                  }),
                )
              }
              options={userOptions}
            />
          </Col>
          <Col className="pe-0">
            <SelectUI
              isRequired
              labelSelect={t('txRank')}
              data={[]}
              disabled
              name="rankId"
              className={cx(styles.inputSelect, 'w-100')}
              control={control}
              messageRequired={errors?.rankId?.message || ''}
            />
          </Col>
        </Row>
        <Row className="pt-4 mx-0">
          <Col className="ps-0">
            <DateTimePicker
              isRequired
              messageRequired={errors?.targetDate?.message || ''}
              label={t('txTargetDate')}
              className="w-100"
              control={control}
              name="targetDate"
              inputReadOnly
            />
          </Col>
          <Col className="pe-0">
            <SelectUI
              labelSelect={t('txStatus')}
              data={statusOptions}
              disabled={loading}
              name="status"
              className={cx(styles.inputSelect, 'w-100')}
              control={control}
              messageRequired={errors?.status?.message || ''}
            />
          </Col>
        </Row>
        <Row className="pt-4 mx-0">
          <Col className="ps-0 pe-0">
            <Input
              label={t('txReviewerComment')}
              {...register('comment')}
              disabled={loading}
              maxLength={MaxLength.MAX_LENGTH_OPTIONAL}
            />
          </Col>
        </Row>
      </div>
    </>
  );

  const renderFooter = () => (
    <>
      <div>
        <GroupButton
          className={cx(styles.GroupButton, 'mt-4 justify-content-end')}
          buttonTypeLeft={ButtonType.PrimaryLight}
          handleCancel={handleCancel}
          handleSubmit={handleSubmit(onSubmitForm)}
          disable={loading}
        />
      </div>
    </>
  );

  return (
    <div className={cx('mt-4', styles.wrapperContainer)}>
      <div className={cx(styles.containerForm)}>
        <div className="d-flex justify-content-between align-items-center">
          <div className={cx(styles.titleContainer)}>{t('txReviewer')}</div>
          <Button
            disabled={disable}
            disabledCss={disable}
            onClick={() => setModal(true)}
            buttonSize={ButtonSize.Medium}
            buttonType={ButtonType.Primary}
            className={cx('mt-auto ', styles.button)}
            renderSuffix={
              <img
                src={images.icons.icAddCircle}
                alt="createNew"
                className={styles.icButton}
              />
            }
          >
            {t('buttons.add')}
          </Button>
        </div>
        <div className={cx('pt-4', styles.table)}>
          <TableCp
            rowLabels={rowLabels}
            renderRow={renderRow}
            loading={loading}
            isEmpty={undefined}
          />
        </div>
      </div>
      <ModalComponent
        isOpen={modal}
        toggle={() => {
          setModal(false);
        }}
        title={t('txTitleAdditionalReviewer')}
        content={renderForm()}
        footer={renderFooter()}
      />
    </div>
  );
};
