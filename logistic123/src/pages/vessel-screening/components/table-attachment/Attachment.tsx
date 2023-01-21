import { getListFileApi } from 'api/dms.api';
import { uploadFileApi } from 'api/support.api';
import images from 'assets/images/images';
import axios from 'axios';
import cx from 'classnames';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import ToggleSwitch from 'components/ui/toggle-switch/ToggleSwitch';
import { FilePrefix, FileType } from 'constants/common.const';
import { I18nNamespace } from 'constants/i18n.const';
import { saveAs } from 'file-saver';
import { getFileContents } from 'helpers/file.helper';
import { toastError } from 'helpers/notification.helper';
import { convertBToMB, formatDateTime } from 'helpers/utils.helper';
import {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';
import Dropdown from 'antd/lib/dropdown';
import Menu from 'antd/lib/menu';
import TableAntd from 'components/common/table-antd/TableAntd';
import {
  createSummaryAttachmentsAndRemarksActions,
  updateSummaryAttachmentsAndRemarksActions,
} from 'pages/vessel-screening/store/vessel-summary.action';
import { useParams } from 'react-router-dom';
import styles from './attachment.module.scss';

export interface Attachment {
  id?: string;
  name?: string;
  size?: number | string;
  sizeNumber?: number;
  mimetype?: string;
  key?: string;
  link?: string;
  lastModifiedDate?: Date;
  uploadByUser?: string;
}
interface TableAttachmentProps {
  value?: string[];
  onchange?: (attachment: any) => void;
  isCreate?: boolean;
  disable?: boolean;
  buttonName?: string;
  isEdit?: boolean;
  hasFileZip?: boolean;
  getFileZipId?: (fileZipID: string) => void;
  nameFileZip?: string;
  scrollVerticalAttachment?: boolean;
  dataFileZipDetail?: Attachment;
  getSizes?: (totalSize: number, fileZipSize?: number) => void;
  title?: (() => ReactElement) | ReactElement | string;
  classWrapper?: string;
  featurePage?: Features;
  subFeaturePage?: SubFeatures;
  disableFeatureChecking?: boolean;
  disableTitle?: boolean;
  getSummarySection?: () => void;
  tabName?: string;
}

export const TableAttachment: FC<TableAttachmentProps> = (props) => {
  const dispatch = useDispatch();
  const {
    isEdit,
    value,
    onchange,
    disable,
    buttonName,
    nameFileZip,
    dataFileZipDetail,
    hasFileZip,
    disableTitle,
    getFileZipId,
    getSizes,
    title,
    classWrapper,
    getSummarySection,
    tabName,
  } = props;
  const [isZipFile, setIsZipFile] = useState<boolean>(false);
  const [sizeZip, setSizeZip] = useState<string>('');
  const { id } = useParams<{ id: string }>();
  const uploadFile = useRef(null);
  const { summaryByTab, loading } = useSelector((state) => state.vesselSummary);
  const [attachment, setAttachment] = useState<Attachment[]>([]);
  const { t } = useTranslation([I18nNamespace.COMMON]);

  const initAttachment = useMemo(
    () => summaryByTab?.attachment?.attachments,
    [summaryByTab?.attachment?.attachments],
  );

  const submitCreateAttachment = useCallback(
    (value: string[]) => {
      if (tabName) {
        if (summaryByTab?.attachment?.id) {
          dispatch(
            updateSummaryAttachmentsAndRemarksActions.request({
              vesselScreeningId: id,
              tabName,
              attachments: value,
              recordId: summaryByTab?.attachment?.id,
              handleSuccess: getSummarySection,
            }),
          );
        } else {
          dispatch(
            createSummaryAttachmentsAndRemarksActions.request({
              vesselScreeningId: id,
              tabName,
              attachments: value,
              handleSuccess: getSummarySection,
            }),
          );
        }
      }
    },
    [dispatch, getSummarySection, id, summaryByTab?.attachment?.id, tabName],
  );

  const submitDeleteAttachment = useCallback(
    (index: number) => {
      const attachmentIds = attachment?.map((item) => item.id);
      attachmentIds.splice(index, 1);
      if (tabName && summaryByTab?.attachment?.id) {
        dispatch(
          updateSummaryAttachmentsAndRemarksActions.request({
            vesselScreeningId: id,
            tabName,
            attachments: attachmentIds,
            recordId: summaryByTab?.attachment?.id,
            isDelete: true,
            handleSuccess: getSummarySection,
          }),
        );
      }
    },
    [
      attachment,
      dispatch,
      getSummarySection,
      id,
      summaryByTab?.attachment?.id,
      tabName,
    ],
  );

  const onDeleteAttachment = useCallback(
    (index: number) => {
      submitDeleteAttachment(index);
      uploadFile.current.value = null;
    },
    [submitDeleteAttachment],
  );

  const handleDeleteAttachment = useCallback(
    (index: number) => {
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
    (index: number) => {
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
        axios
          .get(url, {
            responseType: 'blob',
          })
          .then((res) => {
            saveAs(res.data, attachment[index]?.name);
          });
      } else link.href = url;
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
    },
    [attachment],
  );

  const handleViewAttachment = useCallback(
    (index: number) => {
      if (attachment[index]?.link) {
        window.open(attachment[index]?.link, '_blank');
      }
    },
    [attachment],
  );

  const uploadFileZip = useCallback(
    (dataFile: any) => {
      const formDataZip = new FormData();
      formDataZip.append('files', dataFile, `${nameFileZip || 'zip file'}.zip`);
      formDataZip.append('fileType', FileType.ATTACHMENT);
      formDataZip.append('prefix', FilePrefix.ATTACHMENT);
      const limitSize = 1024 * 1024 * 8.5;
      if (dataFile?.size <= limitSize) {
        uploadFileApi(formDataZip).then((res) => {
          const { data } = res;
          getFileZipId(data[0]?.id);
        });
      } else {
        toastError(
          `The files are exceeding the maximum attachment kit size of 8.5 MB, please reduce the files`,
        );
        uploadFile.current.value = null;
      }

      return null;
    },
    [getFileZipId, nameFileZip],
  );

  const handleZipFile = useCallback(() => {
    const files = attachment?.map((file) => ({
      name: file.name,
      link: file.link,
    }));
    const dataFiles = getFileContents(files);
    dataFiles.generateAsync({ type: 'blob' }).then((blob) => {
      setSizeZip(convertBToMB(blob.size));
      uploadFileZip(blob);
    });
  }, [attachment, uploadFileZip]);

  useEffect(() => {
    if (isZipFile) {
      handleZipFile();
    }
    if (attachment?.length === 0) {
      setIsZipFile(false);
    }
  }, [attachment?.length, handleZipFile, isZipFile]);

  const totalSize = useMemo(() => {
    const total =
      Math.round(
        attachment.reduce((a, b) => Number(a) + Number(b.sizeNumber), 0) * 100,
      ) / 100 || 0;

    return total;
  }, [attachment]);

  const filterDataAttachments = useCallback(
    (newFiles: any[]) => {
      const newData = [];
      newFiles.forEach((item) => {
        if (!attachment.some((i) => i.name === item.name)) {
          newData.push(item);
        }
      });
      return newData;
    },
    [attachment],
  );

  const onChangeFile = useCallback(
    (event: { target: { files: any } }) => {
      const { files } = event.target;
      const newFiles: any[] = [];
      Object.keys(files).forEach((key) => {
        newFiles.push(files[key]);
      });
      const newData = filterDataAttachments(newFiles);
      let i = 0;
      const lengthFiles = newData?.length || 0;
      for (i = 0; i < lengthFiles; i += 1) {
        if (newData[i].size > 5242880) {
          toastError(
            `This specified file ${newData[i]?.name} could not be uploaded. The file is exceeding the maximum file size of 5 MB`,
          );
          uploadFile.current.value = null;
          return null;
        }
      }

      const formDataImages = new FormData();
      newData.forEach((item) => {
        formDataImages.append('files', item);
      });

      formDataImages.append('fileType', FileType.ATTACHMENT);
      formDataImages.append('prefix', FilePrefix.ATTACHMENT);
      uploadFileApi(formDataImages).then(async (res) => {
        const { data } = res;
        let newAttach = value || [];
        const listId = data?.map((itemAttachment) => itemAttachment.id);
        newAttach = [...listId, ...newAttach];
        await onchange(newAttach || []);
        submitCreateAttachment(newAttach);
      });

      return null;
    },
    [filterDataAttachments, onchange, submitCreateAttachment, value],
  );

  const menuOptions = useCallback(
    (index: number) => (
      <Menu>
        <Menu.Item
          key="1"
          className={styles.dropdown_item_custom}
          onClick={() => {
            handleViewAttachment(index);
          }}
        >
          {t('buttons.view')}
        </Menu.Item>

        <Menu.Item
          key="2"
          className={styles.dropdown_item_custom}
          onClick={() => {
            handleDownloadAttachment(index);
          }}
        >
          {t('buttons.download')}
        </Menu.Item>

        <Menu.Item
          key="3"
          className={styles.dropdown_item_custom}
          onClick={() => {
            handleDeleteAttachment(index);
          }}
        >
          {t('buttons.delete')}
        </Menu.Item>
      </Menu>
    ),
    [handleDeleteAttachment, handleDownloadAttachment, handleViewAttachment, t],
  );

  const handleGetInfoAttachment = useCallback(() => {
    getListFileApi({
      ids: summaryByTab?.attachment?.attachments,
    }).then((res) => {
      const listAttachment = res?.data?.map((item) => ({
        id: item?.id,
        name: item.originName,
        size: `${convertBToMB(item?.size)} MB`,
        sizeNumber: Number(convertBToMB(item?.size)) || 0,
        mimetype: item.mimetype,
        key: item.key,
        link: item.link,
        lastModifiedDate: item?.createdAt,
        uploadByUser: item?.uploadByUser?.username,
      }));
      setAttachment(listAttachment);
    });
  }, [summaryByTab?.attachment]);

  useEffect(() => {
    if (initAttachment && initAttachment?.length && !loading) {
      handleGetInfoAttachment();
      setAttachment([]);
      onchange(initAttachment);
    }
    return () => {
      setAttachment([]);
      onchange([]);
    };
  }, [initAttachment, onchange, handleGetInfoAttachment, loading]);

  useEffect(() => {
    if (getSizes) {
      getSizes(totalSize, Number(sizeZip));
    }
  }, [getSizes, sizeZip, totalSize]);

  useEffect(() => {
    if (dataFileZipDetail) {
      getSizes(totalSize, Number(dataFileZipDetail?.size));
      setIsZipFile(true);
    }
  }, [dataFileZipDetail, getSizes, totalSize]);

  const onChangeZip = useCallback(
    (value: boolean) => {
      setIsZipFile(value);
      if (value) {
        handleZipFile();
      } else {
        getFileZipId('');
      }
    },
    [getFileZipId, handleZipFile],
  );

  const columns = useMemo(
    () => [
      {
        title: t('attachment.txSNO'),
        key: 'sNo',
        dataIndex: 'sNo',
        width: 60,
      },
      {
        title: t('attachment.txAttachment'),
        dataIndex: 'name',
        key: 'name',
        width: 100,
      },
      {
        title: t('attachment.txUploadedDate'),
        dataIndex: 'lastModifiedDate',
        key: 'lastModifiedDate',
        width: 80,
      },
      {
        title: '',
        dataIndex: 'action',
        key: 'action',
        width: 30,
      },
    ],
    [t],
  );

  const dataTable = useMemo(
    () =>
      initAttachment?.length
        ? attachment?.map((item, index) => ({
            sNo: index + 1,
            name: item.name,
            lastModifiedDate: item?.lastModifiedDate
              ? formatDateTime(item?.lastModifiedDate)
              : '',
            action: (
              <Dropdown overlay={() => menuOptions(index)} trigger={['click']}>
                <span className={styles.wrapperAction}>
                  <img
                    src={images.icons.ic3DotVertical}
                    alt="more"
                    className={styles.moreAction}
                  />
                </span>
              </Dropdown>
            ),
          }))
        : [],
    [attachment, initAttachment, menuOptions],
  );

  return (
    <div
      className={cx(styles.wrapperContainerAttachment, classWrapper, {
        [styles.hasFileZip]: hasFileZip,
      })}
    >
      <div className={cx(styles.containerForm)}>
        <div className="d-flex justify-content-between align-items-center">
          <div className={cx(styles.titleContainer)}>
            {!disableTitle && (title || t('attachment.txAttachments'))}
          </div>

          <div className="d-flex">
            {hasFileZip && isEdit && (
              <div className="d-flex align-items-center">
                <ToggleSwitch
                  onChange={onChangeZip}
                  checked={isZipFile}
                  disabled={!attachment.length || !isEdit}
                />
                <span className="px-2">Zip files</span>
              </div>
            )}

            <label htmlFor="file-input">
              <input
                type="file"
                multiple
                ref={uploadFile}
                className={styles.inputFile}
                onChange={onChangeFile}
              />
            </label>
            {isEdit ? (
              <Button
                disabled={!isEdit || disable}
                disabledCss={!isEdit || disable}
                onClick={(e) => {
                  uploadFile.current.click();
                }}
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
        <div className={cx('pt-3', styles.table)}>
          {loading && !attachment?.length ? (
            <div className="d-flex justify-content-center">
              <img
                src={images.common.loading}
                className={styles.loading}
                alt="loading"
              />
            </div>
          ) : (
            <TableAntd
              columns={columns}
              dataSource={dataTable}
              scroll={{ x: 'max-content', y: 180 }}
            />
          )}
        </div>
      </div>
    </div>
  );
};
