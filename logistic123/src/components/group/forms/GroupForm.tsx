import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Row } from 'reactstrap';
import cx from 'classnames';
import { I18nNamespace } from 'constants/i18n.const';
import { AppRouteConst } from 'constants/route.const';
import ModalConfirm from 'components/role/modal/ModalConfirm';
import history from 'helpers/history.helper';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import images from 'assets/images/images';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import Input from 'components/ui/input/Input';
import Container from 'components/common/container/ContainerPage';
import Card from 'components/common/card/Card';
import styles from './form.module.scss';

export interface Errors {
  code?: string;
  name?: string;
}

interface Props {
  code: string;
  name: string;
  description: string;
  isDetail?: boolean;
  setCode?: (value: string) => void;
  setName?: (value: string) => void;
  setDescription?: (value: string) => void;
  handleSubmit?: () => void;
  handleCancel?: () => void;
  handleEdit?: () => void;
  handleDelete?: () => void;
  currentBreadcrumbs: string;
  hideAction?: boolean;
  loading?: boolean;
  errors?: Errors;
  isCreate?: boolean;
}

const Form: FC<Props> = (props) => {
  const { t } = useTranslation([I18nNamespace.GROUP, I18nNamespace.COMMON]);
  const [modal, setModal] = useState<boolean>(false);
  const {
    code,
    name,
    description,
    setCode,
    setName,
    setDescription,
    handleSubmit,
    handleEdit,
    handleDelete,
    currentBreadcrumbs,
    hideAction,
    isDetail,
    errors,
    loading,
    isCreate,
  } = props;

  const openCancelModal = () => {
    setModal(true);
  };

  return loading && !isCreate ? (
    <div className="d-flex justify-content-center">
      <img
        src={images.common.loading}
        className={styles.loading}
        alt="loading"
      />
    </div>
  ) : (
    <Container className={styles.wrapper}>
      <BreadCrumb current={currentBreadcrumbs} highLightCurrent />
      <div
        className={cx(
          'd-flex justify-content-between',
          styles.titleActionWrapper,
        )}
      >
        <div className={cx('fw-bold pt-1', styles.mainTitle)}>{t('group')}</div>
        <div className={styles.detailBtns}>
          {isDetail ? (
            <Button
              className={cx(styles.btn)}
              buttonType={ButtonType.CancelOutline}
              onClick={(e) => {
                history.goBack();
              }}
            >
              <span className="pe-2">Back</span>
            </Button>
          ) : null}
          {isDetail && !hideAction && (
            <>
              <Button
                buttonType={ButtonType.Primary}
                className={cx('mr-4', styles.btn)}
                onClick={handleEdit}
              >
                {t('edit')}
                <img src={images.icons.icEdit} alt="edit" />
              </Button>
              <Button
                buttonType={ButtonType.Orange}
                className={styles.btn}
                onClick={handleDelete}
              >
                {t('delete')}
                <img src={images.icons.icRemove} alt="remove" />
              </Button>
            </>
          )}
        </div>
      </div>
      <Card className={cx('p-4', styles.card)}>
        <p className={cx('fw-bold', styles.title)}>{t('group')}</p>
        <Row className="pt-4">
          <Col>
            <Input
              maxLength={128}
              label={t('groupCode')}
              value={code}
              placeholder={t('placeHolder.enterGroupCode')}
              onChange={setCode ? (e) => setCode(e.target.value) : undefined}
              isRequired
              messageRequired={errors?.code}
              readOnly={isDetail}
              disabledCss={isDetail}
            />
          </Col>
          <Col>
            <Input
              maxLength={128}
              label={t('groupName')}
              value={name}
              placeholder={t('placeHolder.enterGroupName')}
              onChange={setName ? (e) => setName(e.target.value) : undefined}
              isRequired
              messageRequired={errors?.name}
              readOnly={isDetail}
              disabledCss={isDetail}
            />
          </Col>
        </Row>
        <Row className="pt-4">
          <Col>
            <Input
              maxLength={128}
              label={t('description')}
              value={description}
              placeholder={t('placeHolder.enterDescription')}
              onChange={
                setDescription
                  ? (e) => setDescription(e.target.value)
                  : undefined
              }
              readOnly={isDetail}
              disabledCss={isDetail}
            />
          </Col>
          <Col />
        </Row>
        {!isDetail && (
          <div
            className={cx('d-flex justify-content-end pt-3', styles.wrapBtn)}
          >
            <Button
              className="me-3"
              buttonType={ButtonType.Select}
              buttonSize={ButtonSize.Small}
              onClick={openCancelModal}
            >
              {t('expiredLink.buttonCancel')}
            </Button>
            <Button buttonSize={ButtonSize.Small} onClick={handleSubmit}>
              {t('buttons.save')}
            </Button>
          </div>
        )}
      </Card>
      <ModalConfirm
        toggle={() => setModal(!modal)}
        modal={modal}
        handleSubmit={() => history.push(AppRouteConst.GROUP)}
        title={t('modal.cancelTitle')}
        content={t('modal.cancelMessage')}
      />
    </Container>
  );
};

Form.defaultProps = {
  setCode: undefined,
  setName: undefined,
  setDescription: undefined,
  handleCancel: undefined,
  handleSubmit: undefined,
  handleEdit: undefined,
  handleDelete: undefined,
  isDetail: false,
  hideAction: false,
  errors: {},
};

export default Form;
