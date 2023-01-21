import images from 'assets/images/images';
import cx from 'classnames';
import { RowComponent } from 'components/common/table/row/rowCp';
import useEffectOnce from 'hoc/useEffectOnce';
import TableCp from 'components/common/table/TableCp';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { FilePrefix, FileType } from 'constants/common.const';
import { I18nNamespace } from 'constants/i18n.const';
import {
  // ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';

import { uploadFileApi } from 'api/support.api';
import { toastError } from 'helpers/notification.helper';
import { formatDateLocalWithTime } from 'helpers/date.helper';
import { convertBToMB } from 'helpers/utils.helper';
import { clearDMSReducer, getListFileActions } from 'store/dms/dms.action';
import { Action } from 'models/common.model';
import { FC, useCallback, useEffect, useRef, useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import styles from './table-attachment.module.scss';

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
  buttonName?: string;
  isEdit?: boolean;
  isModal?: boolean;
  featurePage: Features;
  subFeaturePage: SubFeatures;
}

export const TableAttachment: FC<TableAttachmentProps> = (props) => {
  const dispatch = useDispatch();
  const {
    loading,
    isEdit,
    isModal,
    value,
    onchange,
    disable,
    buttonName,
    isCreate,
    featurePage,
    subFeaturePage,
  } = props;
  const [attachment, setAttachment] = useState<Attachment[]>([]);
  const uploadFile = useRef(null);
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
        label: t('txSNO'),
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
      const newAttach = [...fileList];
      newAttach.splice(index, 1);
      dispatch(getListFileActions.success([...newAttach]));
      const newAttachmentForm = value;
      newAttachmentForm.splice(index, 1);
      onchange(newAttachmentForm);
      uploadFile.current.value = null;
    },
    [dispatch, fileList, onchange, value],
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

  const handleDownloadAttachment = useCallback(
    (index) => {
      const link = document.createElement('a');
      const arrFileBlank = ['image', 'text', 'text/plain'];
      const arrTextBlank = ['application/pdf', 'video/mp4'];
      const url = attachment[index].link;
      link.download = attachment[index]?.name;
      const isBlank = arrFileBlank.includes(
        attachment[index].mimetype.split('/')[0],
      );
      const isMimetypeBlank = arrTextBlank.includes(attachment[index].mimetype);

      if (isBlank || isMimetypeBlank) {
        window.open(url, '_blank');
      } else link.href = url;
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    },
    [attachment],
  );

  useEffectOnce(() => () => {
    dispatch(clearDMSReducer());
  });

  const onChangeFile = (event) => {
    const { files } = event.target;
    const formDataImages = new FormData();
    formDataImages.append('files', files[0]);
    formDataImages.append('fileType', FileType.ATTACHMENT);
    formDataImages.append('prefix', FilePrefix.ATTACHMENT);
    const sizeImage = files[0]?.size;
    const hasFile = attachment?.find((i) => i.name === files[0]?.name);
    if (hasFile) {
      toastError(`The file/image is existed`);
      return null;
    }
    if (sizeImage < 5242881) {
      uploadFileApi(formDataImages).then((res) => {
        const { data } = res;
        const newAttach = value || [];
        newAttach?.push(data[0]?.id);
        onchange(newAttach);
        dispatch(
          getListFileActions.success([
            ...fileList,
            {
              name: files[0]?.name,
              size: sizeImage,
              mimetype: files[0]?.type,
              createdAt: new Date(),
            },
          ]),
        );
      });
      return null;
    }
    if (sizeImage > 5242880) {
      toastError(
        `This specified file ${files[0]?.name} could not be uploaded. The file is exceeding the maximum file size of 5 MB`,
      );
      return null;
    }

    if (sizeImage > 1) {
      toastError('This type is not supported');
    }
    return null;
  };

  const sanitizeData = (data, index) => {
    const finalData = {
      id: index,
      SID: index + 1,
      name: data.name,
      size: data.size,
      lastModifiedDate:
        data?.lastModifiedDate &&
        formatDateLocalWithTime(data?.lastModifiedDate),
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
              const actions: Action[] =
                !isCreate && item?.key
                  ? [
                      {
                        img: images.icons.icDownloadWhite,
                        function: () => handleDownloadAttachment(index),
                        feature: featurePage,
                        subFeature: subFeaturePage,
                        action: '',
                        cssClass: 'icon-white',
                      },
                    ]
                  : [
                      {
                        img: images.icons.icRemove,
                        function: !disable
                          ? () => handleDeleteAttachment(index)
                          : undefined,
                        feature: featurePage,
                        subFeature: subFeaturePage,
                        action: '',
                        buttonType: ButtonType.Orange,
                        cssClass: 'ms-1',
                      },
                    ];
              if (!isCreate && item?.key && isEdit) {
                actions.push({
                  img: images.icons.icRemove,
                  function: !disable
                    ? () => handleDeleteAttachment(index)
                    : undefined,
                  feature: featurePage,
                  subFeature: subFeaturePage,
                  action: '',
                  buttonType: ButtonType.Orange,
                  cssClass: 'ms-1',
                });
              }
              return (
                <RowComponent
                  key={item.id}
                  isScrollable={isScrollable}
                  data={finalData}
                  actionList={actions}
                  rowLabels={rowLabels}
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
      isCreate,
      featurePage,
      subFeaturePage,
      disable,
      isEdit,
      rowLabels,
      handleDownloadAttachment,
      handleDeleteAttachment,
    ],
  );

  useEffect(() => {
    const data = [];
    fileList?.forEach((element) => {
      data.push({
        name: element.name || element.originName,
        size: `${convertBToMB(element?.size)} MB`,
        mimetype: element.mimetype,
        key: element.key,
        link: element.link,
        lastModifiedDate: element?.createdAt,
      });
    });
    setAttachment(data);
  }, [fileList]);

  return (
    <div
      className={cx(styles.wrapperContainerAttachment, {
        'mt-4': !isModal,
        'p-0': isModal,
      })}
    >
      <div className={cx(styles.containerForm, { 'pb-0': isModal })}>
        {!isModal && (
          <div className="d-flex justify-content-between align-items-center">
            <div className={cx(styles.titleContainer)}>
              {t('txAttachments')}
            </div>
            <div>
              <label htmlFor="file-input">
                <input
                  type="file"
                  ref={uploadFile}
                  className={styles.inputFile}
                  onChange={onChangeFile}
                />
              </label>
              {isEdit ? (
                <Button
                  disabled={!isEdit}
                  disabledCss={!isEdit}
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
                  {buttonName ? t(buttonName) : t('buttons.add')}
                </Button>
              ) : null}
            </div>
          </div>
        )}

        <div className={cx({ 'pt-4': !isModal }, styles.table)}>
          <TableCp
            rowLabels={rowLabels}
            renderRow={renderRow}
            loading={loading}
            isEmpty={!attachment || !attachment.length}
            classNameNodataWrapper={styles.dataWrapperEmpty}
          />
        </div>
      </div>
    </div>
  );
};
