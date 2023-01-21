import { uploadFileApi } from 'api/support.api';
import images from 'assets/images/images';
import cx from 'classnames';
import NoDataImg from 'components/common/no-data/NoData';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { FilePrefix, FileType } from 'constants/common.const';
import { toastError } from 'helpers/notification.helper';
import { convertBToMB, convertMBtoB } from 'helpers/utils.helper';
import { useCallback, useRef } from 'react';
import { useSelector } from 'react-redux';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import styles from './list-attach-zip.module.scss';

interface AttachFileZipProps {
  values?: any[];
  onchange?: (attachment) => void;
  loading?: boolean;
  disabled?: boolean;
  isOverSize?: boolean;
  dynamicLabels?: IDynamicLabel;
}

const AttachFileZip = ({
  loading,
  values,
  onchange,
  disabled,
  isOverSize,
  dynamicLabels,
}: AttachFileZipProps) => {
  const fileUpload = useRef(null);
  const { userInfo } = useSelector((state) => state.authenticate);

  const onDeleteAttachment = useCallback(
    (id) => {
      const newData = values.filter((i) => i.id !== id);
      onchange(newData);
    },
    [onchange, values],
  );

  const calcSizeOverSize = useCallback(
    (fileSize: number) => {
      let total = 0;
      if (fileSize) {
        total += convertMBtoB(fileSize);
      }
      values?.forEach((e) => {
        const size = convertMBtoB(e.size);
        total += size;
      });

      if (total > 9437184) {
        return true;
      }
      return false;
    },
    [values],
  );

  const onChangeFile = useCallback(
    (event) => {
      const { files } = event.target;
      const newFiles: any[] = [];
      Object.keys(files).forEach((key) => {
        newFiles.push(files[key]);
      });

      const totalSize = newFiles?.reduce((a, b) => a + b?.size, 0);

      if (calcSizeOverSize(totalSize)) {
        if (files?.length > 1) {
          toastError(
            `These files could not be uploaded. These files are exceeding the maximum file size of 8.5 MB`,
          );
        } else {
          toastError(
            `This specified file ${files[0]?.name} could not be uploaded. The file is exceeding the maximum file size of 8.5 MB`,
          );
        }

        return;
      }

      const formDataImages = new FormData();

      newFiles.forEach((item) => {
        formDataImages.append('files', item);
      });

      formDataImages.append('fileType', FileType.ATTACHMENT);
      formDataImages.append('prefix', FilePrefix.ATTACHMENT);

      uploadFileApi(formDataImages).then((res) => {
        const { data } = res;
        const newAttach = values || [];
        const newAttachmentState = data?.map((item: any) => ({
          id: item?.id,
          name: item?.name || item?.originName,
          size: `${convertBToMB(item?.size)} MB`,
          mimetype: item?.type,
          lastModifiedDate: new Date(),
          link: item.link,
          uploadByUser: userInfo?.username,
        }));

        onchange([...newAttach, ...newAttachmentState]);
      });
    },
    [calcSizeOverSize, onchange, userInfo?.username, values],
  );

  const handleClickAttach = useCallback(() => {
    if (isOverSize) {
      toastError(
        'The files are exceeding the maximum attachment size of 9 MB, please reduce the size of files',
      );
      return;
    }
    if (!disabled) {
      fileUpload.current.click();
    }
  }, [disabled, isOverSize]);

  return (
    <div>
      <div className={cx(styles.containerForm)}>
        <div className="d-flex justify-content-between align-items-center">
          <div />
          <div>
            <label htmlFor="file-input">
              <input
                type="file"
                ref={fileUpload}
                className={styles.inputFile}
                multiple
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
              {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Attach)}
            </Button>
          </div>
        </div>
        <div className={cx('pt-4', styles.wrapList)}>
          {values?.length ? (
            values?.map((i, index) => (
              <div className={styles.zipLineItem} key={i?.id || index}>
                <div className="d-flex align-items-center">
                  {' '}
                  <a
                    href={i?.link || '/'}
                    target="_blank"
                    className={styles.name}
                    rel="noreferrer"
                  >
                    {i?.name}
                  </a>
                  <div className={styles.size}>{`${convertBToMB(
                    i?.size,
                  )} MB`}</div>
                </div>
                <div onClick={() => onDeleteAttachment(i?.id)}>
                  <img
                    src={images.icons.icBlackSingleClose}
                    alt="icClose"
                    className={styles.closeIcon}
                  />
                </div>
              </div>
            ))
          ) : (
            <NoDataImg />
          )}
        </div>
      </div>
    </div>
  );
};

export default AttachFileZip;
