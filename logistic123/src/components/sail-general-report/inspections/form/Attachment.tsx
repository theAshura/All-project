import { getListFileApi } from 'api/dms.api';
import { uploadFileApi } from 'api/support.api';
import images from 'assets/images/images';
import cx from 'classnames';
import { RowComponent } from 'components/common/table/row/rowCp';
import TableCp from 'components/common/table/TableCp';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { FilePrefix, FileType } from 'constants/common.const';
import { I18nNamespace } from 'constants/i18n.const';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';
import { formatDateLocalWithTime } from 'helpers/date.helper';
import { toastError } from 'helpers/notification.helper';
import { convertBToMB } from 'helpers/utils.helper';
import { GetListFile } from 'models/api/dms/dms.model';
import { Action } from 'models/common.model';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './attachment.module.scss';

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
  disabled?: boolean;
  isEdit?: boolean;
  className?: any;
  headerName?: string;
  fileList: GetListFile[];
}

const TableAttachment = ({
  loading,
  value,
  onchange,
  disabled,
  className,
  headerName,
  fileList,
}: TableAttachmentProps) => {
  const [attachment, setAttachment] = useState<Attachment[]>([]);
  const fileUpload = useRef(null);
  const { t } = useTranslation([
    I18nNamespace.SELF_ASSESSMENT,
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
        id: 'sno',
        label: t('table.sno'),
        sort: false,
        width: '100',
      },
      {
        id: 'fileName',
        label: t('table.fileName'),
        sort: false,
        width: '180',
      },
      {
        id: 'fileSize',
        label: t('table.fileSize'),
        sort: false,
        width: '120',
      },
      {
        id: 'uploadedDateTime',
        label: t('table.uploadedDateTime'),
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

  const handleDownloadAttachment = useCallback((item) => {
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
  }, []);

  const onChangeFile = useCallback(
    (event) => {
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
      if (files[0]?.size > 1) {
        toastError('This type is not supported');
        return null;
      }
      return null;
    },
    [attachment, onchange, value],
  );

  const sanitizeData = useCallback((data, index) => {
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
  }, []);

  const handleClickAttach = useCallback(() => {
    if (!disabled) {
      fileUpload.current.click();
    }
  }, [disabled]);

  const renderRow = useCallback(
    (isScrollable?: boolean) => {
      if (loading || attachment?.length <= 0) {
        return null;
      }
      return (
        <tbody className={cx(styles.tablePlaning)}>
          {attachment?.map((item, index) => {
            const finalData = sanitizeData(item, index);
            const actions: Action[] = [
              {
                img: images.icons.icDownloadWhite,
                function: () => handleDownloadAttachment(item),
                feature: Features.QUALITY_ASSURANCE,
                subFeature: SubFeatures.SAIL_GENERAL_REPORT,
                action: '',
                buttonType: ButtonType.Yellow,
                cssClass: 'icon-white ms-1',
              },
              {
                img: images.icons.icRemove,
                function: !disabled
                  ? () => handleDeleteAttachment(index)
                  : undefined,
                feature: Features.QUALITY_ASSURANCE,
                subFeature: SubFeatures.SAIL_GENERAL_REPORT,
                action: '',
                buttonType: ButtonType.Orange,
                cssClass: 'ms-1',
                disable: disabled,
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
    },
    [
      attachment,
      disabled,
      handleDeleteAttachment,
      handleDownloadAttachment,
      loading,
      rowLabels,
      sanitizeData,
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
    const ids = fileList?.map((item) => item.id) || [];
    onchange(ids);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileList]);

  return (
    <div className={cx('mt-4', styles.wrapperContainer, className)}>
      <div className={cx(styles.containerForm)}>
        <div className="d-flex justify-content-between align-items-center">
          <div className={cx(styles.titleContainer)}>
            {headerName || t('attachments')}
          </div>
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
              disabled={disabled}
              disabledCss={disabled}
              onClick={handleClickAttach}
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
              scrollVerticalAttachment
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

export default TableAttachment;
