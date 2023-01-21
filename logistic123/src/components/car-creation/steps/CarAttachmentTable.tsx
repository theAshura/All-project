import { getListFileApi } from 'api/dms.api';
import { uploadFileApi } from 'api/support.api';
import images from 'assets/images/images';
import cx from 'classnames';
import NoDataImg from 'components/common/no-data/NoData';
import { RowComponent } from 'components/common/table/row/rowCp';
import TableCp from 'components/common/table/TableCp';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { useSelector } from 'react-redux';
import { FilePrefix, FileType } from 'constants/common.const';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';
import { toastError } from 'helpers/notification.helper';
import { convertBToMB, formatDateTime } from 'helpers/utils.helper';
import cloneDeep from 'lodash/cloneDeep';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { Action } from 'models/common.model';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { CAR_CAP_DYNAMIC_FIELDS } from 'constants/dynamic/car-cap.const';
import { FC, useCallback, useContext, useMemo, useRef } from 'react';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { Attachment, CarFormContext } from '../CarFormContext';
import styles from './step.module.scss';

interface Props {
  title?: string;
  hideTotalSize?: boolean;
  disabled?: boolean;
  isStep4?: boolean;
  featurePage: Features;
  subFeaturePage: SubFeatures;
  dynamicLabels?: IDynamicLabel;
}

const CarAttachmentTable: FC<Props> = ({
  title,
  disabled,
  isStep4,
  hideTotalSize,
  featurePage,
  subFeaturePage,
  dynamicLabels,
}) => {
  const fileUpload = useRef(null);
  const { step1Values, step4Values, setStep4Values, setStep1Values } =
    useContext(CarFormContext);
  const { userInfo } = useSelector((state) => state.authenticate);

  const attachments = useMemo(() => {
    if (isStep4) {
      return step4Values?.attachments || [];
    }
    return (
      step1Values?.attachments?.concat(step1Values?.attachmentsFromFinding) ||
      []
    );
  }, [
    isStep4,
    step1Values?.attachments,
    step1Values.attachmentsFromFinding,
    step4Values?.attachments,
  ]);

  const attachmentsExcepFinding = useMemo(() => {
    if (isStep4) {
      return step4Values?.attachments || [];
    }
    return step1Values?.attachments || [];
  }, [isStep4, step1Values?.attachments, step4Values?.attachments]);

  const rowLabels = useMemo(
    () => [
      {
        id: 'action',
        label: renderDynamicLabel(dynamicLabels, CAR_CAP_DYNAMIC_FIELDS.Action),
        sort: false,
        width: '100',
      },
      {
        id: 'sNo',
        label: renderDynamicLabel(
          dynamicLabels,
          CAR_CAP_DYNAMIC_FIELDS['S.No'],
        ),
        sort: true,
        width: '100',
      },
      {
        id: 'fileName',
        label: renderDynamicLabel(
          dynamicLabels,
          CAR_CAP_DYNAMIC_FIELDS['File name'],
        ),
        sort: true,
        width: '210',
      },
      {
        id: 'fileSize',
        label: renderDynamicLabel(
          dynamicLabels,
          CAR_CAP_DYNAMIC_FIELDS['File size'],
        ),
        sort: true,
        width: '100',
        maxWidth: '200',
      },
      {
        id: 'lastModifiedDate',
        label: renderDynamicLabel(
          dynamicLabels,
          CAR_CAP_DYNAMIC_FIELDS['Uploaded date time'],
        ),
        sort: true,
        width: '100',
        maxWidth: '200',
      },
      {
        id: 'uploadByUser',
        label: renderDynamicLabel(
          dynamicLabels,
          CAR_CAP_DYNAMIC_FIELDS['Uploaded by'],
        ),
        sort: true,
        width: '70',
      },
    ],
    [dynamicLabels],
  );

  const sanitizeData = useCallback(
    (item, index) => {
      const finalData = {
        id: item?.id || index,
        sNo: index + 1,
        fileName: item.name,
        fileSize: `${convertBToMB(item?.size)} MB`,
        lastModifiedDate:
          item?.lastModifiedDate && formatDateTime(item?.lastModifiedDate),
        uploadByUser: item?.uploadByUser || userInfo?.username,
      };
      return finalData;
    },
    [userInfo?.username],
  );

  const handleViewAttachment = useCallback(
    (index) => {
      if (attachments[index]?.link) {
        window.open(attachments[index]?.link, '_blank');
      }
    },
    [attachments],
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

  const onDeleteAttachment = useCallback(
    (id) => {
      const newAttach = step1Values?.attachments?.filter(
        (item) => item?.id !== id,
      );
      if (isStep4) {
        setStep4Values((prev) => ({ ...prev, attachments: newAttach }));
      } else {
        const newAttachFinding = step1Values?.attachmentsFromFinding?.filter(
          (item) => item?.id !== id,
        );
        setStep1Values((prev) => ({
          ...prev,
          attachments: newAttach,
          attachmentsFromFinding: newAttachFinding,
        }));
      }
      fileUpload.current.value = null;
    },
    [
      isStep4,
      setStep1Values,
      setStep4Values,
      step1Values?.attachments,
      step1Values?.attachmentsFromFinding,
    ],
  );

  const handleDeleteAttachment = useCallback(
    (id) => {
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
        onPressButtonRight: () => onDeleteAttachment(id),
      });
    },
    [dynamicLabels, onDeleteAttachment],
  );

  const renderRow = useCallback(
    (isScrollable?: boolean) => {
      if (attachments?.length > 0) {
        return (
          <tbody>
            {attachments?.map((item, index) => {
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
                  // disable: disabled,
                },
                !disabled && {
                  img: images.icons.icDownloadWhite,
                  function: () => handleDownloadAttachment(item),
                  feature: featurePage,
                  subFeature: subFeaturePage,
                  action: '',
                  buttonType: ButtonType.Yellow,
                  cssClass: 'icon-white ms-1',
                  disable: disabled,
                },
                !disabled && {
                  img: images.icons.icRemove,
                  function: () => handleDeleteAttachment(item?.id),
                  feature: featurePage,
                  subFeature: subFeaturePage,
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
                  key={String(item?.id + index)}
                />
              );
            })}
          </tbody>
        );
      }
      return null;
    },
    [
      attachments,
      disabled,
      featurePage,
      handleDeleteAttachment,
      handleViewAttachment,
      rowLabels,
      sanitizeData,
      subFeaturePage,
    ],
  );

  const onChangeFile = (event) => {
    const { files } = event.target;
    const newFiles: any[] = [];
    Object.keys(files).forEach((key) => {
      newFiles.push(files[key]);
    });
    const formDataImages = new FormData();
    let isOverSize = false;
    newFiles?.forEach((item) => {
      formDataImages.append('files', item);
      if (item?.size > 5242881) {
        toastError(
          `This specified file ${item?.name} could not be uploaded. The file is exceeding the maximum file size of 8.5 MB`,
        );
        isOverSize = true;
      }
    });
    if (isOverSize) {
      return;
    }
    formDataImages.append('fileType', FileType.ATTACHMENT);
    formDataImages.append('prefix', FilePrefix.ATTACHMENT);
    // const hasFile = attachments?.find((i) => i.name === files[0]?.name);

    // if (hasFile) {
    //   toastError(`The file/image is existed`);
    //   return null;
    // }

    uploadFileApi(formDataImages).then((res) => {
      const { data } = res;
      const newAttachments: Attachment[] = cloneDeep(attachmentsExcepFinding);
      data?.forEach((item: any) => {
        newAttachments.push({
          id: item.id,
          name: item?.name || item?.originName,
          size: `${convertBToMB(item?.size)} MB`,
          mimetype: item?.type,
          lastModifiedDate: new Date(),
          link: item.link,
          uploadByUser: userInfo?.username,
        });
      });

      if (isStep4) {
        setStep4Values((e) => ({
          ...e,
          attachments: newAttachments,
        }));
      } else {
        setStep1Values((e) => ({
          ...e,
          attachments: newAttachments,
        }));
      }
    });
  };

  const renderTotalSize = useMemo(() => {
    if (hideTotalSize) {
      return null;
    }
    let total = 0;
    attachments.forEach((i) => {
      const size = String(i.size)?.includes('MB')
        ? Number(String(i.size).replace(' MB', '')) * 1024 * 1024
        : i.size;
      total += Number(size);
    });
    return (
      <div className="mb-3">
        {renderDynamicLabel(
          dynamicLabels,
          CAR_CAP_DYNAMIC_FIELDS['Total size'],
        )}
        : {Number(total / 1024).toFixed(2)} KB
      </div>
    );
  }, [attachments, dynamicLabels, hideTotalSize]);

  return (
    <div>
      <label htmlFor="file-input">
        <input
          type="file"
          ref={fileUpload}
          multiple
          className={styles.inputFile}
          onChange={onChangeFile}
          hidden
        />
      </label>
      <div className={styles.headerTable}>
        <div>
          {title ||
            renderDynamicLabel(
              dynamicLabels,
              CAR_CAP_DYNAMIC_FIELDS['CAR attachment'],
            )}
        </div>
        <Button
          disabled={disabled}
          disabledCss={disabled}
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
          {renderDynamicLabel(dynamicLabels, CAR_CAP_DYNAMIC_FIELDS.Add)}
        </Button>
      </div>
      {attachments?.length ? (
        <TableCp
          rowLabels={rowLabels}
          renderRow={renderRow}
          loading={false}
          isEmpty={undefined}
        />
      ) : (
        <NoDataImg />
      )}
      {renderTotalSize}
    </div>
  );
};

export default CarAttachmentTable;
