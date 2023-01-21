import { FC, useCallback, useEffect, useRef, useState } from 'react';
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
import { uploadFileApi } from 'api/support.api';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { FilePrefix, FileType } from 'constants/common.const';
import { toastError } from 'helpers/notification.helper';
import { convertBToMB, formatDateTime } from 'helpers/utils.helper';
import styles from './form.module.scss';

interface Attachment {
  id?: string;
  name?: string;
  size?: number | string;
  mimetype?: string;
  key?: string;
  lastModifiedDate?: Date;
}
interface TableAttachmentProps {
  value?: Attachment[];
  onchange?: (attachment) => void;
  loading?: boolean;
  isEdit?: boolean;
  disable?: boolean;
  featurePage: Features;
  subFeaturePage: SubFeatures;
}

export const TableAttachment: FC<TableAttachmentProps> = (props) => {
  const {
    loading,
    isEdit,
    value,
    onchange,
    disable,
    featurePage,
    subFeaturePage,
  } = props;
  const [attachment, setAttachment] = useState<Attachment[]>(value || []);
  const uploadFile = useRef(null);
  const { t } = useTranslation([
    I18nNamespace.PLANNING_AND_REQUEST,
    I18nNamespace.COMMON,
  ]);
  const rowLabels = [
    {
      id: 'action',
      label: t('buttons.txAction'),
      sort: false,
      width: '100',
    },
    {
      id: 'sNo',
      label: t('txSNo'),
      sort: true,
      width: '100',
    },
    {
      id: 'name',
      label: t('txFileName'),
      sort: true,
      width: '180',
    },
    {
      id: 'size',
      label: t('txFileSize'),
      sort: true,
      width: '120',
    },
    {
      id: 'lastModifiedDate',
      label: t('txUploadedDateTime'),
      sort: true,
      width: '200',
    },
  ];

  const onDeleteAttachment = useCallback(
    (index) => {
      const newAttach = [...attachment];
      newAttach.splice(index, 1);
      setAttachment(newAttach);
      uploadFile.current.value = null;
    },
    [attachment],
  );

  const handleDeleteAttachment = useCallback(
    (index) => {
      showConfirmBase({
        isDelete: true,
        txTitle: t('modal.delete'),
        txMsg: t('modal.areYouSureYouWantToDelete'),
        onPressButtonRight: () => onDeleteAttachment(index),
      });
    },
    [onDeleteAttachment, t],
  );

  const onChangeFile = (event) => {
    const { files } = event.target;
    const formDataImages = new FormData();
    formDataImages.append('files', files[0]);
    formDataImages.append('fileType', FileType.ATTACHMENT);
    formDataImages.append('prefix', FilePrefix.ATTACHMENT);
    const hasFile = attachment?.find((i) => i.name === files[0]?.name);

    if (hasFile) {
      toastError(`The file/image is existed`);
      return null;
    }
    if (files[0]?.size < 5242881) {
      uploadFileApi(formDataImages).then((res) => {
        const { data } = res;
        const newAttach = value || [];
        newAttach?.push(data[0]);
        onchange(newAttach);
        setAttachment((e) => [
          ...e,
          {
            name: files[0]?.name,
            size: `${convertBToMB(files[0]?.size)} MB`,
            mimetype: files[0]?.type,
            lastModifiedDate: new Date(),
          },
        ]);
      });
      return null;
    }

    if (files[0]?.size > 5242880) {
      toastError(
        `This specified file ${files[0]?.name} could not be uploaded. The file is exceeding the maximum file size of 5 MB`,
      );

      return null;
    }
    if (files[0]?.size > 1) {
      toastError('This type is not supported');
    }
    return null;
  };

  const viewDetail = useCallback((id?: string) => {}, []);

  const editDetail = useCallback((id?: string) => {}, []);

  const sanitizeData = (data, index) => {
    const finalData = {
      sNo: index + 1,
      name: data.name,
      size: data.size,
      lastModifiedDate: formatDateTime(data?.lastModifiedDate),
    };
    return finalData;
  };

  const renderRow = useCallback(
    (isScrollable?: boolean) => {
      if (!loading && attachment?.length > 0) {
        return (
          <tbody>
            {attachment?.map((item, index) => {
              const finalData = sanitizeData(item, index);
              const actions: Action[] = isEdit
                ? [
                    {
                      img: images.icons.icDownloadWhite,
                      function: () => editDetail(item?.id),
                      feature: featurePage,
                      subFeature: subFeaturePage,
                      action: ActionTypeEnum.UPDATE,
                      cssClass: 'icon-white',
                    },
                  ]
                : [
                    {
                      img: images.icons.icRemove,
                      function: () => handleDeleteAttachment(index),
                      feature: featurePage,
                      subFeature: subFeaturePage,
                      action: ActionTypeEnum.DELETE,
                      buttonType: ButtonType.Orange,
                      cssClass: 'ms-1',
                    },
                  ];
              return (
                <PermissionCheck
                  options={{
                    feature: featurePage,
                    subFeature: subFeaturePage,
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
    [
      loading,
      attachment,
      isEdit,
      featurePage,
      subFeaturePage,
      editDetail,
      handleDeleteAttachment,
      viewDetail,
    ],
  );

  useEffect(() => {
    onchange(attachment);
  }, [attachment, onchange]);

  return (
    <div
      className={cx(
        'mt-4',
        styles.wrapperContainer,
        styles.wrapperContainerModal,
      )}
    >
      <div className={cx(styles.containerForm)}>
        <div className="d-flex justify-content-between align-items-center">
          <div className={cx(styles.titleContainer)}>{t('txAttachments')}</div>
          <div>
            <label htmlFor="file-input">
              <input
                type="file"
                ref={uploadFile}
                className={styles.inputFile}
                onChange={onChangeFile}
              />
            </label>
            <Button
              disabled={disable}
              disabledCss={disable}
              onClick={() => uploadFile.current.click()}
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
    </div>
  );
};
