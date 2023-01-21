import { getListFileApi } from 'api/dms.api';
import { uploadFileApi } from 'api/support.api';
import images from 'assets/images/images';
import cx from 'classnames';
import { RowComponent } from 'components/common/table/row/rowCp';
import TableCp from 'components/common/table/TableCp';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { FilePrefix, FileType } from 'constants/common.const';
import useEffectOnce from 'hoc/useEffectOnce';
import { I18nNamespace } from 'constants/i18n.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { toastError } from 'helpers/notification.helper';
import { convertBToMB, formatDateTime } from 'helpers/utils.helper';
import { Action } from 'models/common.model';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styles from './form.module.scss';

interface Attachment {
  id?: string;
  name?: string;
  size?: number | string;
  mimetype?: string;
  key?: string;
  link?: string;
  lastModifiedDate?: Date;
}
interface TableAttachmentProps {
  value?: string[];
  onchange?: (attachment) => void;
  loading?: boolean;
  isCreate?: boolean;
  disable?: boolean;
  isEdit?: boolean;
  featurePage: Features;
  subFeaturePage: SubFeatures;
}

export const TableAttachment: FC<TableAttachmentProps> = (props) => {
  const { loading, value, onchange, disable, featurePage, subFeaturePage } =
    props;
  const [attachment, setAttachment] = useState<Attachment[]>([]);
  const fileUpload = useRef(null);

  const { fileList } = useSelector((state) => state.dms);
  const { t } = useTranslation([
    I18nNamespace.PLANNING_AND_REQUEST,
    I18nNamespace.COMMON,
  ]);
  const rowLabels = useMemo(
    () => [
      {
        id: 'action',
        label: t('buttons.txAction'),
        sort: false,
        width: '100',
      },
      {
        id: 'SID',
        label: 'S.No',
        sort: false,
        width: '100',
      },
      {
        id: 'name',
        label: t('txFileName'),
        sort: false,
        width: '180',
      },
      {
        id: 'size',
        label: t('txFileSize'),
        sort: false,
        width: '120',
      },
      {
        id: 'lastModifiedDate',
        label: t('txUploadedDateTime'),
        sort: false,
        width: '200',
      },
    ],
    [t],
  );

  const onDeleteAttachment = useCallback(
    (index) => {
      const newAttach = [...attachment];
      newAttach.splice(index, 1);
      setAttachment(newAttach);
      const newAttachmentForm = value;
      newAttachmentForm.splice(index, 1);
      onchange(newAttachmentForm);
      fileUpload.current.value = null;
    },
    [attachment, onchange, value],
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

  const handleDownloadAttachment = (item) => {
    getListFileApi({
      ids: [item.id],
      isAttachment: true,
    }).then((res) => {
      const link = document.createElement('a');
      const url = res.data[0].link;
      link.download = res.data[0].originName || res.data[0].originName;
      link.href = url;
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    });
  };

  const handleViewAttachment = useCallback(
    (index) => {
      if (attachment[index]?.link) {
        window.open(attachment[index]?.link, '_blank');
      }
    },
    [attachment],
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
        newAttach?.push(data[0]?.id);
        onchange(newAttach);
        setAttachment((e) => [
          ...e,
          {
            id: data[0].id,
            name: files[0]?.name,
            size: `${convertBToMB(files[0]?.size)} MB`,
            mimetype: files[0]?.type,
            lastModifiedDate: new Date(),
            link: data[0].link,
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
    toastError('This type is not supported');
    return null;
  };

  const sanitizeData = (data, index) => {
    const finalData = {
      id: index,
      SID: index + 1,
      name: data.name,
      size: data.size,
      lastModifiedDate:
        data?.lastModifiedDate && formatDateTime(data?.lastModifiedDate),
    };
    return finalData;
  };

  const renderRow = useCallback(
    (isScrollable?: boolean) => {
      if (!loading && attachment?.length > 0) {
        return (
          <tbody className={cx(styles.tablePlaning)}>
            {attachment?.map((item, index) => {
              const finalData = sanitizeData(item, index);
              const actions: Action[] = [
                {
                  img: images.icons.icViewDetail,
                  function: () => handleViewAttachment(index),
                  feature: featurePage,
                  subFeature: subFeaturePage,
                  action: '',
                  buttonType: ButtonType.Blue,
                  cssClass: 'icon-white',
                },
                {
                  img: images.icons.icDownloadWhite,
                  function: () => handleDownloadAttachment(item),
                  feature: featurePage,
                  subFeature: subFeaturePage,
                  action: '',
                  buttonType: ButtonType.Yellow,
                  cssClass: 'icon-white ms-1',
                },
                {
                  img: images.icons.icRemove,
                  function: !disable
                    ? () => handleDeleteAttachment(index)
                    : undefined,
                  feature: featurePage,
                  subFeature: subFeaturePage,
                  action: ActionTypeEnum.DELETE,
                  buttonType: ButtonType.Orange,
                  cssClass: 'ms-1',
                  disable,
                },
              ];

              return (
                <RowComponent
                  isScrollable={isScrollable}
                  data={finalData}
                  actionList={actions}
                  rowLabels={rowLabels}
                  key={item?.id}
                />
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
      featurePage,
      subFeaturePage,
      disable,
      rowLabels,
      handleViewAttachment,
      handleDeleteAttachment,
    ],
  );

  useEffect(() => {
    const data = [];
    fileList?.forEach((element) => {
      data.push({
        id: element.id,
        name: element.originName,
        size: `${convertBToMB(element?.size)} MB`,
        mimetype: element.mimetype,
        key: element.key,
        link: element.link,
        lastModifiedDate: element?.createdAt,
      });
    });
    setAttachment(data);
  }, [fileList]);

  useEffectOnce(() => () => {
    onchange([]);
  });

  return (
    <div className={cx('mt-4', styles.wrapperContainer)}>
      <div className={cx(styles.containerForm)}>
        <div className="d-flex justify-content-between align-items-center">
          <div className={cx(styles.titleContainer)}>{t('txAttachments')}</div>
          <div>
            <label htmlFor="file-input">
              <input
                type="file"
                ref={fileUpload}
                className={styles.inputFile}
                onChange={onChangeFile}
              />
            </label>
            <Button
              disabled={disable}
              disabledCss={disable}
              onClick={() => fileUpload.current.click()}
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
              {t('buttons.attach')}
            </Button>
          </div>
        </div>
        <div className={cx('pt-4', styles.table)}>
          {attachment?.length > 0 ? (
            <TableCp
              rowLabels={rowLabels}
              renderRow={renderRow}
              loading={loading}
              isEmpty={undefined}
            />
          ) : (
            <div className={cx(styles.dataWrapperEmpty)}>
              <img
                src={images.icons.icNoData}
                className={styles.noData}
                alt="no data"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
