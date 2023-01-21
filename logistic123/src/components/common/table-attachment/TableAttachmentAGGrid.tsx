import { getListFileApi } from 'api/dms.api';
import { uploadFileApi } from 'api/support.api';
import images from 'assets/images/images';
import axios from 'axios';
import cx from 'classnames';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import ToggleSwitch from 'components/ui/toggle-switch/ToggleSwitch';
import { FilePrefix, FileType } from 'constants/common.const';
import { I18nNamespace } from 'constants/i18n.const';
import { saveAs } from 'file-saver';
import { getFileContents } from 'helpers/file.helper';
import { toastError } from 'helpers/notification.helper';
import { DEFAULT_COL_DEF_TYPE_FLEX_QA } from 'constants/components/ag-grid.const';
import { DETAIL_PLANNING_DYNAMIC_FIELDS } from 'constants/dynamic/planning.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import {
  convertBToMB,
  formatDateTime,
  dateStringComparator,
} from 'helpers/utils.helper';
import useEffectOnce from 'hoc/useEffectOnce';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import { Action } from 'models/common.model';
import {
  FC,
  ReactElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { getListTemplateDictionaryActions } from 'store/template/template.action';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';

import { clearDMSReducer } from 'store/dms/dms.action';
import styles from './table-attachment.module.scss';

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
  onchange?: (attachment) => void;
  loading?: boolean;
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
  moduleTemplate?: string;
  pageSizeDefault?: number;
  aggridId?: string;
  dynamicLabels?: IDynamicLabel;
}

export const TableAttachmentAGGrid: FC<TableAttachmentProps> = (props) => {
  const dispatch = useDispatch();
  const {
    loading,
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
    featurePage,
    subFeaturePage,
    disableFeatureChecking,
    moduleTemplate,
    pageSizeDefault,
    aggridId,
    dynamicLabels,
  } = props;
  const [attachment, setAttachment] = useState<Attachment[]>([]);
  const [isZipFile, setIsZipFile] = useState<boolean>(false);
  const [sizeZip, setSizeZip] = useState<string>('');
  const [fileZip, setFileZip] = useState<Attachment>(null);
  const uploadFile = useRef(null);
  const { userInfo } = useSelector((state) => state.authenticate);
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

  const { t } = useTranslation([
    I18nNamespace.PLANNING_AND_REQUEST,
    I18nNamespace.COMMON,
  ]);

  const onDeleteAttachment = useCallback(
    (index) => {
      const newAttach = [...attachment];
      newAttach.splice(index, 1);
      setAttachment(newAttach);
      const newAttachmentForm = value;
      newAttachmentForm.splice(index, 1);
      onchange(newAttachmentForm);
      uploadFile.current.value = null;
    },
    [attachment, onchange, value],
  );

  const handleDeleteAttachment = useCallback(
    (index) => {
      showConfirmBase({
        isDelete: true,
        txTitle: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Delete?'],
        ),
        txMsg: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS[
            'Are you sure you want to delete this record? This action cannot be undone and you will not be able to recover any data.'
          ],
        ),
        txButtonLeft: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS.Cancel,
        ),
        txButtonRight: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS.Delete,
        ),
        onPressButtonRight: () => onDeleteAttachment(index),
      });
    },
    [dynamicLabels, onDeleteAttachment],
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

  const handleDownloadFileZip = useCallback(() => {
    const link = document.createElement('a');
    const url = fileZip.link;
    link.download = fileZip?.name;
    link.href = url;
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
  }, [fileZip]);

  const handleViewAttachment = useCallback(
    (index: number) => {
      if (attachment[index]?.link) {
        window.open(attachment[index]?.link, '_blank');
      }
    },
    [attachment],
  );

  const checkWorkflow = useCallback(
    (item, index) => {
      let actions: Action[] = [
        {
          img: images.icons.icViewDetail,
          function: () => handleViewAttachment(index),
          feature: featurePage,
          subFeature: subFeaturePage,
          action: '',
          buttonType: ButtonType.Blue,
          cssClass: 'icon-white',
          disableFeatureChecking,
        },
        {
          img: images.icons.icDownloadWhite,
          function: () => handleDownloadAttachment(index),
          feature: featurePage,
          subFeature: subFeaturePage,
          action: '',
          buttonType: ButtonType.Yellow,
          cssClass: 'icon-white ms-1',
          disableFeatureChecking,
        },
      ];
      if (!disable) {
        actions = [
          ...actions,
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
            disable,
            disableFeatureChecking,
          },
        ];
      }
      return actions;
    },
    [
      disable,
      disableFeatureChecking,
      featurePage,
      handleDeleteAttachment,
      handleDownloadAttachment,
      handleViewAttachment,
      subFeaturePage,
    ],
  );

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_PLANNING_DYNAMIC_FIELDS.Action,
        ),
        filter: false,
        sortable: false,
        enableRowGroup: false,
        lockPosition: true,
        minWidth: 125,
        maxWidth: 125,
        pinned: 'left',
        cellRendererFramework: (params) => {
          const { data, rowIndex } = params;
          let actions = checkWorkflow(data, rowIndex);
          if (!data) {
            actions = [];
          }
          return (
            <div
              className={cx(
                'd-flex justify-content-start align-items-center',
                styles.subAction,
              )}
            >
              <ActionBuilder actionList={actions} />
            </div>
          );
        },
      },
      {
        field: 'SID',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_PLANNING_DYNAMIC_FIELDS['S.No'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'name',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_PLANNING_DYNAMIC_FIELDS['File name'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'size',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_PLANNING_DYNAMIC_FIELDS['File size'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },

      {
        field: 'lastModifiedDate',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_PLANNING_DYNAMIC_FIELDS['Uploaded date time'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
      {
        field: 'uploadByUser',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DETAIL_PLANNING_DYNAMIC_FIELDS['Uploaded by'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [dynamicLabels, isMultiColumnFilter, checkWorkflow],
  );
  const getList = useCallback(() => {
    dispatch(
      getListTemplateDictionaryActions.request({
        content: moduleTemplate,
      }),
    );
  }, [dispatch, moduleTemplate]);
  useEffectOnce(() => () => {
    dispatch(clearDMSReducer());
  });

  useEffect(() => {
    if (isZipFile) {
      // eslint-disable-next-line no-use-before-define
      handleZipFile();
    }
    if (attachment?.length === 0) {
      setIsZipFile(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [attachment, nameFileZip]);
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

  const onChangeFile = (event) => {
    const { files } = event.target;

    const newFiles: any[] = [];
    Object.keys(files).forEach((key) => {
      newFiles.push(files[key]);
    });

    const newData = filterDataAttachments(newFiles);

    let i = 0;
    let totalNewFiles = 0;
    const lengthFiles = newData?.length || 0;
    for (i = 0; i < lengthFiles; i += 1) {
      totalNewFiles += newData[i].size;
      // from 150 MB to Byte
      if (newData[i].size > 157286400) {
        toastError(
          `This specified file ${newData[i]?.name} could not be uploaded. The file is exceeding the maximum file size of 150 MB`,
        );
        uploadFile.current.value = null;
        return null;
      }
    }

    const totalAttachment = totalSize + Number(convertBToMB(totalNewFiles));

    if (hasFileZip && totalAttachment > 150) {
      toastError(`The file is exceeding the maximum file size of 150 MB`);
      uploadFile.current.value = null;
      return null;
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
      const newAttachmentState = data?.map((item) => ({
        name: item?.originName,
        size: `${convertBToMB(item?.size)} MB`,
        sizeNumber: Number(convertBToMB(item?.size)) || 0,
        mimetype: item?.type,
        lastModifiedDate: new Date(),
        link: item?.link,
        uploadByUser: userInfo?.username,
      }));
      const listId = data?.map((itemAttachment) => itemAttachment.id);
      newAttach = [...newAttach, ...listId];
      await onchange(newAttach || []);
      setAttachment((e) => [...e, ...newAttachmentState]);
    });

    return null;
  };

  const dataTable = useMemo(
    () =>
      attachment.map((data, index) => ({
        id: index,
        SID: index + 1,
        name: data.name,
        size: data.size,
        lastModifiedDate:
          data?.lastModifiedDate && formatDateTime(data?.lastModifiedDate),
        uploadByUser: data?.uploadByUser,
      })) || [],
    [attachment],
  );

  useEffect(() => {
    if (value?.length) {
      getListFileApi({
        ids: value,
      }).then((res) => {
        const listAttachment = res?.data?.map((item) => ({
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
    }
    return () => {
      setAttachment([]);
    };
  }, [value]);

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
          setFileZip({
            name: data[0]?.originName,
            link: data[0]?.link,
            size: `${convertBToMB(data[0]?.size)} MB`,
            sizeNumber: data[0]?.size || 0,
            mimetype: data[0]?.type,
          });
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
    if (getSizes) {
      getSizes(totalSize, Number(sizeZip));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalSize, sizeZip]);

  useEffect(() => {
    if (dataFileZipDetail) {
      setFileZip(dataFileZipDetail);
      getSizes(totalSize, Number(dataFileZipDetail?.size));
      setIsZipFile(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dataFileZipDetail]);

  const onChangeZip = useCallback(
    (value: boolean) => {
      setIsZipFile(value);
      if (value) {
        handleZipFile();
      } else {
        getFileZipId('');
        setFileZip(null);
      }
    },
    [handleZipFile, getFileZipId],
  );

  return (
    <div
      className={cx(
        styles.wrapperContainerAttachment,
        styles.customPadding,
        classWrapper,
        {
          [styles.hasFileZip]: hasFileZip,
          [styles.customMarginBottom]: isEdit,
        },
      )}
    >
      <div className={cx(styles.containerForm)}>
        <div className="d-flex justify-content-between align-items-center">
          <div className={cx(styles.titleContainer)}>
            {!disableTitle &&
              (title ||
                renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_PLANNING_DYNAMIC_FIELDS.Attachments,
                ))}
          </div>

          <div className="d-flex">
            {hasFileZip && isEdit && (
              <div className="d-flex align-items-center">
                <ToggleSwitch
                  onChange={onChangeZip}
                  checked={isZipFile}
                  disabled={!attachment.length || !isEdit}
                />
                <span className="px-2">
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_PLANNING_DYNAMIC_FIELDS['Zip files'],
                  )}
                </span>
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
                onClick={() => uploadFile.current.click()}
                buttonSize={ButtonSize.Medium}
                buttonType={ButtonType.Primary}
                className={cx('mt-3 ', styles.button)}
                renderSuffix={
                  <img
                    src={images.icons.icAddCircle}
                    alt="createNew"
                    className={styles.icButton}
                  />
                }
              >
                {buttonName
                  ? t(buttonName)
                  : renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_PLANNING_DYNAMIC_FIELDS.Add,
                    )}
              </Button>
            ) : null}
          </div>
        </div>
        <div className={cx('pt-2', styles.table)}>
          <AGGridModule
            loading={loading}
            params={null}
            setIsMultiColumnFilter={setIsMultiColumnFilter}
            hasRangePicker={false}
            columnDefs={columnDefs}
            dataFilter={null}
            moduleTemplate={moduleTemplate}
            fileName="Table Attachment"
            dataTable={dataTable}
            height="275px"
            colDefProp={DEFAULT_COL_DEF_TYPE_FLEX_QA}
            getList={getList}
            pageSizeDefault={pageSizeDefault}
            classNameHeader={styles.header}
            aggridId={aggridId}
            dynamicLabels={dynamicLabels}
          />
        </div>
        {!!attachment.length && (
          <p
            className={cx('mb-0', styles.customPaddingTop)}
          >{`${renderDynamicLabel(
            dynamicLabels,
            DETAIL_PLANNING_DYNAMIC_FIELDS['Total size'],
          )}: ${totalSize} MB`}</p>
        )}
        {attachment?.length > 0 && isZipFile && fileZip && (
          <button
            onClick={() => handleDownloadFileZip()}
            className={cx(styles.buttonZipFile, 'mt-2')}
          >{`${renderDynamicLabel(
            dynamicLabels,
            DETAIL_PLANNING_DYNAMIC_FIELDS['Zip file'],
          )}: ${fileZip?.name} (${
            sizeZip || convertBToMB(fileZip?.sizeNumber)
          } MB)`}</button>
        )}
      </div>
    </div>
  );
};
