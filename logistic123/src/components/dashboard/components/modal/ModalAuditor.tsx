import cx from 'classnames';
import { FC, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Modal, { ModalType } from 'components/ui/modal/Modal';
import ProgressUI from 'components/common/progress/ProgressUI';
import Col from 'antd/lib/col';
import Row from 'antd/lib/row';
import { getListFileApi } from 'api/dms.api';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { INSPECTION_DASHBOARD_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-dashboard.const';
import images from 'assets/images/images';
import styles from './modal.module.scss';

export interface AuditorType {
  username: string;
  periodOfTime: number;
  imageId: string;

  id: string;
}

export interface AuditorTypeExtend extends AuditorType {
  avatar?: string;
  link?: string;
}
export interface ModalAuditorProps {
  isOpen: boolean;
  title: string;
  data: AuditorType[];
  toggle?: () => void;
  w?: string | number;
  h?: string | number;
  dynamicLabels?: IDynamicLabel;
}

function financial(x) {
  return Number.parseFloat(x).toFixed(2);
}

const ModalAuditor: FC<ModalAuditorProps> = ({
  isOpen,
  toggle,
  title,
  data,
  w,
  h,
  dynamicLabels,
}) => {
  const [imagesLink, setImagesLink] = useState<AuditorTypeExtend[]>(data);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    if (data?.length && isOpen && loading) {
      const imageIds = data
        .filter((item) => item.imageId)
        .map((item) => item.imageId);
      if (imageIds?.length) {
        getListFileApi({
          ids: imageIds,
          isAttachment: true,
        })
          .then((res) => {
            const imageList = res.data;

            const newState = data.map((item) => {
              const findImage = imageList.find((i) => i.id === item.imageId);
              return { ...item, avatar: findImage?.link || '' };
            });
            setImagesLink(newState);
            setLoading(false);
          })
          .catch((e) => {
            setLoading(false);
          });
      }
    }
  }, [data, isOpen, loading, setImagesLink]);

  const close = () => {
    toggle();
    setLoading(true);
  };

  return (
    <Modal
      isOpen={isOpen}
      title={title}
      toggle={close}
      bodyClassName={styles.bodyModal}
      w={w || 970}
      h={h}
      content={
        <div className={cx(styles.contentWrapper, 'px-2')}>
          <div
            className={cx(
              'd-flex justify-content-between py-2',
              styles.labelWrapper,
            )}
          >
            <div className={cx(styles.colTitle, 'ps-4', styles.textTitle)}>
              {renderDynamicLabel(
                dynamicLabels,
                INSPECTION_DASHBOARD_DYNAMIC_FIELDS.Inspector,
              )}
            </div>
            <div className={cx(styles.colTitle, 'pe-4', styles.textTitle)}>
              {renderDynamicLabel(
                dynamicLabels,
                INSPECTION_DASHBOARD_DYNAMIC_FIELDS['Period of time (Days)'],
              )}
            </div>
          </div>
          {imagesLink?.length ? (
            <div className={cx(styles.userList)}>
              {imagesLink.map((user) => (
                <Row className={styles.userInfo} key={user?.id}>
                  <Col span={6} className="d-flex">
                    <div className={styles.avatarImg}>
                      {user.avatar && !loading ? (
                        <img
                          src={user.avatar}
                          alt={user.username}
                          className={cx(styles.avatar)}
                        />
                      ) : (
                        <img
                          src={images.common.icAvatar}
                          alt={user.username}
                          className={cx(styles.avatarDefault)}
                        />
                      )}
                    </div>
                    <div className="d-flex justify-content-center flex-column">
                      <div className={cx('px-3', styles.textTitle)}>
                        {user.username}
                      </div>
                      {user?.link && (
                        <Link
                          to={user.link}
                          target="_blank"
                          className={cx('px-3', styles.viewMore)}
                        >
                          {renderDynamicLabel(
                            dynamicLabels,
                            COMMON_DYNAMIC_FIELDS['View More'],
                          )}
                        </Link>
                      )}
                    </div>
                  </Col>
                  <Col span={16} className="py-2">
                    <ProgressUI
                      percent={Number(
                        financial((user.periodOfTime / 30) * 100),
                      )}
                    />
                  </Col>
                  <Col
                    span={2}
                    className={cx('py-2 pe-1', styles.periodOfTime)}
                  >
                    <span>{financial(user.periodOfTime)}</span>
                  </Col>
                </Row>
              ))}
            </div>
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
      }
      hiddenFooter
      modalType={ModalType.CENTER}
    />
  );
};

export default ModalAuditor;
