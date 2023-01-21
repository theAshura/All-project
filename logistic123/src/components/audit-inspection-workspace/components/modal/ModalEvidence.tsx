import cx from 'classnames';
import { FC, useCallback, useEffect, useState } from 'react';
import Modal, { ModalType } from 'components/ui/modal/Modal';
import { getListFileApi } from 'api/dms.api';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import images from 'assets/images/images';
import Table, { ColumnsType } from 'antd/lib/table';
import { UploadResponsive } from 'models/api/audit-inspection-workspace/audit-inspection-workspace.model';
import { convertBToMB, formatDateTime } from 'helpers/utils.helper';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import styles from './modal.module.scss';

interface ModalFileProps {
  isOpen: boolean;
  disabled: boolean;
  dynamicLabels?: IDynamicLabel;
  title: string;
  id: string;
  fileIds: string[];
  onChangeAnswer: (
    id: string,
    fieldName: string,
    params: string | string[],
  ) => void;
  isAdd?: boolean;
  toggle?: () => void;
  w?: string | number;
  h?: string | number;
}

const ModalFile: FC<ModalFileProps> = ({
  isOpen,
  toggle,
  disabled,
  title,
  fileIds,
  id,
  onChangeAnswer,
  w,
  h,
  dynamicLabels,
}) => {
  const [fileLink, setFileLink] = useState<UploadResponsive[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (fileIds?.length && isOpen) {
      getListFileApi({
        ids: fileIds,
        isAttachment: true,
      })
        .then((res) => {
          setFileLink(res.data);
          setLoading(false);
        })
        .catch((e) => {
          setLoading(false);
        });
    }
  }, [fileIds, isOpen]);

  const handleDelete = useCallback(
    (idFile) => {
      const newImages = fileIds?.filter((item) => item !== idFile);
      const newImageLinks = fileLink?.filter((item) => item.id !== idFile);

      onChangeAnswer(id, 'evidencePictures', newImages);
      setFileLink(newImageLinks);
      if (!newImages?.length) {
        toggle();
        setLoading(true);
      }
    },
    [fileIds, fileLink, onChangeAnswer, id, toggle],
  );

  const handleDownloadAttachment = (item) => {
    const link = document.createElement('a');
    const url = item.link;
    link.download = item.originName;
    link.href = url;
    document.body.appendChild(link);

    link.click();
    link.parentNode.removeChild(link);
  };

  const columns: ColumnsType = [
    {
      title: renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Action),
      key: 'Action',
      // fixed: '',
      dataIndex: 'id',
      width: 100,
      render: (id, record) => (
        <div className={cx(styles.action)}>
          {!disabled && (
            <div
              onClick={() => handleDelete(id)}
              className={cx(styles.icon, styles.delete)}
            >
              <img src={images.icons.icRemove} alt="del" />
            </div>
          )}
          <div
            onClick={() => handleDownloadAttachment(record)}
            className={cx(styles.icon, styles.download)}
          >
            <img src={images.icons.icDownloadWhite} alt="download" />
          </div>
        </div>
      ),
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        COMMON_DYNAMIC_FIELDS['File name'],
      ),
      key: 'originName',
      dataIndex: 'originName',
      width: 300,
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {text}
        </span>
      ),
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        COMMON_DYNAMIC_FIELDS['File size'],
      ),
      key: 'size',
      dataIndex: 'size',
      width: 120,
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {`${convertBToMB(text)} MB`}
        </span>
      ),
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        COMMON_DYNAMIC_FIELDS['Create at'],
      ),
      key: 'createdAt',
      dataIndex: 'createdAt',
      width: 160,
      render: (text) => (
        <span className={cx(styles.textContent, 'limit-line-text')}>
          {formatDateTime(text)}
        </span>
      ),
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      title={title}
      modalType={ModalType.CENTER}
      toggle={() => {
        toggle();
        setLoading(true);
      }}
      content={
        <div className={cx(styles.contentWrapper)}>
          {loading ? (
            <div className="d-flex justify-content-center">
              <img
                src={images.common.loading}
                className={styles.loading}
                alt="loading"
              />
            </div>
          ) : (
            <Table
              columns={columns}
              className={cx(styles.tableWrapper)}
              dataSource={fileLink}
              pagination={false}
              scroll={{ y: 360 }}
              rowClassName={styles.rowWrapper}
            />
          )}
        </div>
      }
      w={800}
    />
  );
};

export default ModalFile;
