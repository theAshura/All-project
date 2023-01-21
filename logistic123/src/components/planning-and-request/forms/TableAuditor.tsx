import { yupResolver } from '@hookform/resolvers/yup';
import images from 'assets/images/images';
import cx from 'classnames';
import { RowComponent } from 'components/common/table/row/rowCp';
import TableCp from 'components/common/table/TableCp';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { GroupButton } from 'components/ui/button/GroupButton';
import Input from 'components/ui/input/Input';
import ModalComponent from 'components/ui/modal/Modal';
import SelectUI from 'components/ui/select/Select';
import { MaxLength } from 'constants/common.const';
import { statusOptions } from 'constants/filter.const';
import { I18nNamespace } from 'constants/i18n.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import PermissionCheck from 'hoc/withPermissionCheck';
import { Action } from 'models/common.model';
import { FC, useCallback, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Col, Row } from 'reactstrap';
import * as yup from 'yup';
import styles from './form.module.scss';

interface TableAuditorProps {
  data?: any;
  handleAdd?: (data) => void;
  handleDelete?: () => void;
  loading?: boolean;
}

const defaultValues = {};

export const TableAuditor: FC<TableAuditorProps> = (props) => {
  const { data, handleAdd, handleDelete, loading } = props;
  const { t } = useTranslation([
    I18nNamespace.PLANNING_AND_REQUEST,
    I18nNamespace.COMMON,
  ]);
  const schema = yup.object().shape({
    code: yup.string().trim().nullable().required(t('errors.required')),
    name: yup.string().trim().nullable().required(t('errors.required')),
    shoreDepartmentIds: yup.array().nullable().required(t('errors.required')),
  });

  const {
    register,
    control,
    handleSubmit,
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
      label: t('txNo'),
      sort: true,
      width: '100px',
    },
    {
      id: 'auditorName',
      label: t('txAuditorName'),
      sort: true,
      width: '320',
    },
    {
      id: 'rank',
      label: t('txRank'),
      sort: true,
      width: '320',
    },
    {
      id: 'primaryAuditor',
      label: t('txPrimaryAuditor'),
      sort: true,
      width: '370',
    },
  ];
  const viewDetail = useCallback((id?: string) => {}, []);

  const editDetail = useCallback((id?: string) => {}, []);

  const onSubmitForm = (data) => {
    handleAdd(data);
  };
  const handleCancel = () => {
    setModal(false);
  };

  const sanitizeData = (data) => {
    const finalData = {
      no: data.no,
      auditorName: data.name,
      rank: data.rank,
      primaryAuditor: data.primaryAuditor,
    };
    return finalData;
  };

  const renderRow = useCallback(
    (isScrollable?: boolean) => {
      if (!loading && data?.data.length > 0) {
        return (
          <tbody>
            {data?.data.map((item) => {
              const finalData = sanitizeData(item);
              const actions: Action[] = [
                {
                  img: images.icons.icViewDetail,
                  function: () => viewDetail(item?.id),
                  feature: Features.CONFIGURATION,
                  subFeature: SubFeatures.VESSEL,
                  action: ActionTypeEnum.VIEW,
                  cssClass: 'me-1',
                },
                {
                  img: images.icons.icEdit,
                  function: () => editDetail(item?.id),
                  feature: Features.CONFIGURATION,
                  subFeature: SubFeatures.VESSEL,
                  action: ActionTypeEnum.UPDATE,
                },
                {
                  img: images.icons.icRemove,
                  function: () => handleDelete(),
                  feature: Features.CONFIGURATION,
                  subFeature: SubFeatures.VESSEL,
                  action: ActionTypeEnum.DELETE,
                  buttonType: ButtonType.Orange,
                  cssClass: 'ms-1',
                },
              ];
              return (
                <PermissionCheck
                  options={{
                    feature: Features.CONFIGURATION,
                    subFeature: SubFeatures.VESSEL,
                    action: ActionTypeEnum.UPDATE,
                  }}
                  key={JSON.stringify(item)}
                >
                  {({ hasPermission }) => (
                    <RowComponent
                      isScrollable={isScrollable}
                      data={finalData}
                      actionList={actions}
                      onClickRow={
                        hasPermission ? () => viewDetail(item?.id) : undefined
                      }
                    />
                  )}
                </PermissionCheck>
              );
            })}
          </tbody>
        );
      }
      return null;
    },
    [loading, data?.data, viewDetail, editDetail, handleDelete],
  );

  const renderForm = () => (
    <>
      <div>
        <Row className=" mx-0">
          <Col className="ps-0">
            <Input
              isRequired
              label={t('txNo')}
              {...register('description')}
              disabled={loading}
              maxLength={MaxLength.MAX_LENGTH_OPTIONAL}
            />
          </Col>
          <Col className="pe-0">
            <SelectUI
              isRequired
              labelSelect={t('txAuditorName')}
              data={statusOptions}
              disabled={loading}
              name="vesselTypeId"
              className={cx(styles.inputSelect, 'w-100')}
              control={control}
              messageRequired={errors?.vesselTypeId?.message || ''}
            />
          </Col>
        </Row>
        <Row className="pt-4 mx-0">
          <Col className="ps-0">
            <SelectUI
              isRequired
              labelSelect={t('txRank')}
              data={statusOptions}
              disabled={loading}
              name="vesselTypeId"
              className={cx(styles.inputSelect, 'w-100')}
              control={control}
              messageRequired={errors?.vesselTypeId?.message || ''}
            />
          </Col>
          <Col className="pe-0">
            <SelectUI
              isRequired
              labelSelect={t('txPrimaryAuditor')}
              data={statusOptions}
              disabled={loading}
              name="vesselTypeId"
              className={cx(styles.inputSelect, 'w-100')}
              control={control}
              messageRequired={errors?.vesselTypeId?.message || ''}
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
          <div className={cx(styles.titleContainer)}>{t('txAuditor')}</div>
          <Button
            onClick={() => setModal((e) => !e)}
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
        title={t('txTitleAuditor')}
        content={renderForm()}
        footer={renderFooter()}
      />
    </div>
  );
};
