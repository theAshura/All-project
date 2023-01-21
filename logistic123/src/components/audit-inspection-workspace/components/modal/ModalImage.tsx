import cx from 'classnames';
import { FC, useCallback, useEffect, useState } from 'react';
import Modal, { ModalType } from 'components/ui/modal/Modal';
import { getListFileApi } from 'api/dms.api';
import images from 'assets/images/images';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import Image from 'antd/lib/image';

import styles from './modal.module.scss';
import './modal.scss';

interface ModalImageProps {
  isOpen: boolean;
  disabled: boolean;

  title: string;
  id: string;
  imageIds: string[];
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

interface ImageType {
  id: string;
  link: string;
}

const ModalImage: FC<ModalImageProps> = ({
  isOpen,
  toggle,
  disabled,
  title,
  imageIds,
  id,
  onChangeAnswer,
  w,
  h,
}) => {
  const [imagesLink, setImagesLink] = useState<ImageType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (imageIds?.length && isOpen) {
      getListFileApi({
        ids: imageIds,
        isAttachment: true,
      })
        .then((res) => {
          setImagesLink(
            res.data.map((item) => ({
              id: item.id,
              link: item.link,
            })),
          );
        })
        .catch((e) => {});
      setLoading(false);
    }
  }, [imageIds, isOpen]);

  const handleDelete = useCallback(
    (idImage) => {
      const newImages = imageIds?.filter((item) => item !== idImage);
      const newImageLinks = imagesLink?.filter((item) => item.id !== idImage);

      onChangeAnswer(id, 'attachments', newImages);
      setImagesLink(newImageLinks);
      if (!newImages?.length) {
        toggle();
        setLoading(true);
      }
    },
    [imageIds, imagesLink, onChangeAnswer, id, toggle],
  );

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
        <div className={cx(styles.contentWrapper, 'modal-antd-images')}>
          {loading ? (
            <div className="d-flex justify-content-center">
              <img
                src={images.common.loading}
                className={styles.loading}
                alt="loading"
              />
            </div>
          ) : (
            <Row className={styles.modalContent}>
              <Image.PreviewGroup>
                {imagesLink?.map((item) => (
                  <Col xs={8} className={cx(styles.imgWrapper)} key={item?.id}>
                    {!disabled && (
                      <div
                        onClick={() => handleDelete(item.id)}
                        className={cx(styles.closeBtn)}
                      >
                        <img src={images.icons.icRemove} alt="delete" />
                      </div>
                    )}
                    <Image
                      className={cx(styles.imagesModal)}
                      width={250}
                      height={250}
                      src={item.link}
                    />
                  </Col>
                ))}
              </Image.PreviewGroup>
            </Row>
          )}
        </div>
      }
      w={800}
    />
  );
};

export default ModalImage;
