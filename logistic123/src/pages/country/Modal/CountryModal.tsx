import {
  FC,
  useEffect,
  useState,
  useCallback,
  memo,
  useRef,
  ChangeEvent,
  useMemo,
} from 'react';
import { Modal, ModalProps, Col, Row } from 'reactstrap';
import { yupResolver } from '@hookform/resolvers/yup';
import { FieldValues, useForm } from 'react-hook-form';
import cx from 'classnames';
import images from 'assets/images/images';
import { useTranslation } from 'react-i18next';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import DetectEsc from 'components/common/modal/DetectEsc';
import RadioForm from 'components/react-hook-form/radio-form/RadioFrom';
import Input from 'components/ui/input/Input';
import { handleUploadFile } from 'helpers/utils.helper';
import { I18nNamespace } from 'constants/i18n.const';
import { createNewCountryMasterAPI } from 'api/country-master.api';
import { toastSuccess } from 'helpers/notification.helper';
import {
  defaultCountryValues,
  countrySchema,
  DialCodeStatus,
  FileExtension,
} from '../country.constants';
import styles from './country-modal.module.scss';

interface CountryModalProps extends ModalProps {
  isOpen: boolean;
  onClose: () => void;
  viewMode?: boolean;
  clearData: () => void;
  handleGetList: () => void;
  countrySelected: any;
}

const CountryModal: FC<CountryModalProps> = ({
  isOpen,
  onClose,
  viewMode,
  clearData,
  handleGetList,
  countrySelected,
  classesName,
  modalClassName,
  contentClassName,
  ...other
}) => {
  const [loading, setLoading] = useState(false);
  const [flagFile, setFlagFile] = useState({
    name: '',
    error: '',
  });
  const [imgLink, setImgLink] = useState('');
  const [fileUploaderResponseId, setFileUploaderResponseId] = useState('');
  const uploadFile = useRef(null);
  const { t } = useTranslation([I18nNamespace.COMMON]);
  const {
    handleSubmit,
    setError,
    setValue,
    reset,
    register,
    control,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues: defaultCountryValues,
    resolver: yupResolver(countrySchema),
  });

  const handleChangeFileFlag = useCallback(
    async (e: ChangeEvent<HTMLInputElement>) => {
      const filePath = e.target.value;

      if (filePath !== '') {
        const splitPath = filePath.split('\\');
        const nameFile = splitPath[splitPath.length - 1];
        const [fileCurrentName, fileExtension] = nameFile.split('.');

        if (fileExtension !== FileExtension.SVG) {
          setFlagFile({
            name: '',
            error: t('mustHaveSVGFormat'),
          });
        } else {
          const response = await handleUploadFile(
            e.target.files,
            fileCurrentName,
          );
          setFileUploaderResponseId(response.id);
          setFlagFile({
            name: nameFile,
            error: '',
          });
        }
      } else {
        setFlagFile({
          name: '',
          error: t('thisFieldIsRequired'),
        });
      }
    },
    [t],
  );

  const onClearData = useCallback(() => {
    reset(defaultCountryValues);
    setFlagFile({
      name: '',
      error: '',
    });
    setImgLink('');
  }, [reset]);

  const onCloseAndClearData = useCallback(() => {
    onClose();
    onClearData();
    handleGetList();
  }, [onClose, handleGetList, onClearData]);

  const onSubmitForm = useCallback(
    async (values) => {
      if (values) {
        try {
          const { data } = await createNewCountryMasterAPI({
            code: values.code,
            code3: values.code3,
            dialCode: values.dialCode,
            name: values.name,
            nationality: values?.nationality || '',
            status: values?.status
              ? DialCodeStatus.ACTIVE
              : DialCodeStatus.IN_ACTIVE,
            avatar: fileUploaderResponseId,
          });
          if (values?.mode) {
            onClearData();
          } else {
            onCloseAndClearData();
          }
          toastSuccess(data?.message);
        } catch (errors) {
          errors.errorList.forEach((err) => {
            setError(err.fieldName, {
              message: err.message,
            });
          });
        }
      }
    },
    [fileUploaderResponseId, onCloseAndClearData, setError, onClearData],
  );

  const handleClickSaveOrSaveNew = useCallback(
    (mode: 'save' | 'saveNew') => {
      if (!flagFile.name) {
        return setFlagFile({
          name: '',
          error: t('thisFieldIsRequired'),
        });
      }

      if (mode === 'save') {
        handleSubmit(onSubmitForm)();
      } else {
        handleSubmit((data) => onSubmitForm({ ...data, mode: 'SaveAndNew' }))();
      }

      return null;
    },
    [flagFile.name, handleSubmit, onSubmitForm, t],
  );

  const renderImage = useMemo(() => {
    if (imgLink) {
      return (
        <>
          <img
            src={imgLink}
            alt="icFiles"
            key="icFilesWithDefaultLink"
            className={styles.iconStyles}
          />
          {flagFile.name}
        </>
      );
    }

    if (flagFile.name) {
      return (
        <>
          <img
            src={images.icons.icFilesBlack}
            alt="icFilesBlack"
            key="icFilesBlack"
          />
          {flagFile.name}
        </>
      );
    }

    return null;
  }, [flagFile.name, imgLink]);

  useEffect(() => {
    setLoading(true);
    if (countrySelected) {
      setValue('code', countrySelected?.code);
      setValue('code3', countrySelected?.code3);
      setValue('name', countrySelected?.name);
      setValue('nationality', countrySelected?.nationality);
      setValue('dialCode', countrySelected?.dialCode);
      setValue('status', !!(countrySelected?.status === DialCodeStatus.ACTIVE));
      if (countrySelected?.flagImg) {
        setImgLink(countrySelected.flagImg);
      }
    } else {
      reset(defaultCountryValues);
    }
    setLoading(false);
  }, [countrySelected, setValue, reset]);

  return (
    <Modal
      className={cx(styles.wrapModal, classesName)}
      modalClassName={cx(styles.modalClassName, modalClassName)}
      contentClassName={cx(styles.contentClassName, contentClassName)}
      isOpen={isOpen}
      {...other}
    >
      <header className={styles.header}>
        <div>Country</div>
        <div className={styles.closeBtn} onClick={onCloseAndClearData}>
          <img src={images.icons.icClose} alt="ic-close-modal" />
        </div>
      </header>

      <DetectEsc close={onCloseAndClearData} />

      <body className={styles.content}>
        <Row>
          <Col span={12} className="mb-3">
            <div className={styles.label}>
              ISO alpha-2 code
              <span className={styles.dotRequired}>*</span>
            </div>

            <Input
              className={cx({ [styles.disabledInput]: false })}
              placeholder="Enter ISO alpha-2 code"
              isRequired
              disabled={viewMode || loading}
              {...register('code')}
              maxLength={2}
              messageRequired={errors?.code?.message || ''}
            />
          </Col>

          <Col span={12} className="mb-3">
            <div className={styles.label}>
              ISO alpha-3 code
              <span className={styles.dotRequired}>*</span>
            </div>

            <Input
              className={cx({ [styles.disabledInput]: false })}
              placeholder="Enter ISO alpha-3 code"
              isRequired
              disabled={viewMode || loading}
              {...register('code3')}
              maxLength={3}
              messageRequired={errors?.code3?.message || ''}
            />
          </Col>
        </Row>

        <Row>
          <Col span={12} className="mb-3">
            <div className={styles.label}>
              Country name
              <span className={styles.dotRequired}>*</span>
            </div>

            <Input
              className={cx({ [styles.disabledInput]: false })}
              placeholder="Enter country name"
              isRequired
              disabled={viewMode || loading}
              {...register('name')}
              maxLength={250}
              messageRequired={errors?.name?.message || ''}
            />
          </Col>
          <Col span={12} className="mb-3">
            <div className={styles.label}>
              Nationality
              <span className={styles.dotRequired}>*</span>
            </div>

            <Input
              className={cx({ [styles.disabledInput]: false })}
              placeholder="Enter nationality"
              isRequired
              disabled={viewMode || loading}
              {...register('nationality')}
              maxLength={250}
              messageRequired={errors?.nationality?.message || ''}
            />
          </Col>
        </Row>

        <Row>
          <Col span={12}>
            <div className={styles.label}>Dial code</div>
            <Input
              className={cx({ [styles.disabledInput]: false })}
              placeholder="Enter Dial code"
              isRequired
              disabled={viewMode || loading}
              {...register('dialCode')}
              maxLength={4}
              messageRequired={errors?.dialCode?.message || ''}
            />

            <div className={cx(styles.label, 'mt-3')}>
              Status
              <span className={styles.dotRequired}>*</span>
            </div>
            <RadioForm
              control={control}
              name="status"
              disabled={viewMode || loading}
              radioOptions={[
                {
                  value: true,
                  label: 'Active',
                },
                {
                  value: false,
                  label: 'Inactive',
                },
              ]}
            />
          </Col>

          <Col span={12}>
            <div className={styles.label}>
              Flag image
              <span className={styles.dotRequired}>*</span>
            </div>
            <div>
              <input
                type="file"
                id="file"
                accept=".svg"
                ref={uploadFile}
                className={styles.inputFile}
                onChange={handleChangeFileFlag}
              />

              <Button
                buttonSize={ButtonSize.Medium}
                buttonType={ButtonType.Primary}
                renderSuffix={
                  <img
                    src={images.icons.icAddCircle}
                    alt="icAddCircle"
                    className={styles.ml5}
                  />
                }
                disabledCss={viewMode || loading}
                disabled={viewMode || loading}
                onClick={() => uploadFile.current.click()}
              >
                Attach
              </Button>

              <span className={styles.formatDescriptionText}>
                * attach .svg format image
              </span>
            </div>

            {flagFile.error && (
              <div className="message-required mt-2">{flagFile.error}</div>
            )}

            <div className={styles.fileName}>{renderImage}</div>
          </Col>
        </Row>
      </body>

      <footer
        className={cx(
          'd-flex align-items-center justify-content-end',
          styles.footer,
        )}
      >
        <Button
          buttonSize={ButtonSize.Medium}
          buttonType={ButtonType.CancelOutline}
          onClick={onCloseAndClearData}
        >
          Cancel
        </Button>
        <Button
          className={styles.btnSubmit}
          buttonSize={ButtonSize.Medium}
          buttonType={ButtonType.Primary}
          onClick={() => handleClickSaveOrSaveNew('save')}
          disabledCss={viewMode || loading}
          disabled={viewMode || loading}
        >
          Save
        </Button>
        <Button
          className={styles.btnSubmit}
          buttonSize={ButtonSize.Medium}
          buttonType={ButtonType.Primary}
          onClick={() => handleClickSaveOrSaveNew('saveNew')}
          disabledCss={viewMode || loading}
          disabled={viewMode || loading}
        >
          Save & new
        </Button>
      </footer>
    </Modal>
  );
};

export default memo(CountryModal);
