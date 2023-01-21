import images from 'assets/images/images';
import cx from 'classnames';
import Button, { ButtonSize } from 'components/ui/button/Button';
import { I18nNamespace } from 'constants/i18n.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import PermissionCheck from 'hoc/withPermissionCheck';
import { ModalFeedbackAndRemarks } from 'pages/vessel-screening/components/ModalFeedbackAndRemarks';
import {
  createFeedbackAndRemarksActions,
  deleteFeedbackAndRemarksActions,
  getFeedbackAndRemarksActions,
  updateFeedbackAndRemarksActions,
} from 'pages/vessel-screening/store/vessel-summary.action';
import { FeedbackAndRemark } from 'pages/vessel-screening/utils/models/summary.model';
import { FC, useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import Dropdown from 'antd/lib/dropdown';
import Menu from 'antd/lib/menu';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import moment from 'moment';
import { VesselScreeningContext } from 'pages/vessel-screening/VesselScreeningContext';
import styles from './summary-remarks.module.scss';

interface Props {
  className?: string;
}

export const SummaryRemarks: FC<Props> = ({ className }) => {
  const { t } = useTranslation([
    I18nNamespace.VESSEL_SCREENING,
    I18nNamespace.COMMON,
  ]);
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const [isVisibleFeedback, setIsVisibleFeedback] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [selected, setSelected] = useState<FeedbackAndRemark>(null);
  const { listRemarks } = useSelector((state) => state.vesselSummary);
  const { isEditVessel } = useContext(VesselScreeningContext);
  const getList = useCallback(
    (id: string) => {
      dispatch(
        getFeedbackAndRemarksActions.request({
          id,
          pageSize: -1,
        }),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    if (id) {
      getList(id);
    }
  }, [getList, id]);

  const handleSubmitFeedbackAndRemarks = useCallback(
    (value: { remark: string }) => {
      if (selected?.id) {
        dispatch(
          updateFeedbackAndRemarksActions.request({
            vesselId: id,
            id: selected.id,
            remark: value?.remark,
            handleSuccess: () => {
              setIsVisibleFeedback((e) => !e);
              setSelected(null);
              setIsEdit(false);
              getList(id);
            },
          }),
        );
      } else {
        dispatch(
          createFeedbackAndRemarksActions.request({
            vesselId: id,
            remark: value?.remark,
            handleSuccess: () => {
              setIsVisibleFeedback((e) => !e);
              setSelected(null);
              setIsEdit(false);
              getList(id);
            },
          }),
        );
      }
    },
    [dispatch, getList, id, selected],
  );

  const handleDeleteRemark = useCallback(
    (remarkId: string) => {
      dispatch(
        deleteFeedbackAndRemarksActions.request({
          vesselId: id,
          remarkId,
          handleSuccess: () => {
            setSelected(null);
            getList(id);
          },
        }),
      );
    },
    [dispatch, getList, id],
  );

  const handleDelete = useCallback(
    (id: string) => {
      showConfirmBase({
        isDelete: true,
        txTitle: t('modal.delete'),
        txMsg: t('modal.areYouSureYouWantToDelete'),
        onPressButtonRight: () => handleDeleteRemark(id),
      });
    },
    [handleDeleteRemark, t],
  );

  const menuOptions = useCallback(
    (item) => (
      <Menu>
        <Menu.Item
          key={`${item.id}_1`}
          className={styles.dropdown_item_custom}
          onClick={() => {
            setSelected(item);
            setIsEdit(false);
            setIsVisibleFeedback(true);
          }}
        >
          {t('view')}
        </Menu.Item>
        {isEditVessel && (
          <PermissionCheck
            options={{
              feature: Features.QUALITY_ASSURANCE,
              subFeature: SubFeatures.VESSEL_SCREENING,
              action: ActionTypeEnum.UPDATE,
            }}
          >
            {({ hasPermission }) =>
              hasPermission && (
                <Menu.Item
                  key={`${item.id}_2`}
                  className={styles.dropdown_item_custom}
                  onClick={() => {
                    setSelected(item);
                    setIsEdit(true);
                    setIsVisibleFeedback(true);
                  }}
                >
                  {t('edit')}
                </Menu.Item>
              )
            }
          </PermissionCheck>
        )}
        {isEditVessel && (
          <PermissionCheck
            options={{
              feature: Features.QUALITY_ASSURANCE,
              subFeature: SubFeatures.VESSEL_SCREENING,
              action: ActionTypeEnum.DELETE,
            }}
          >
            {({ hasPermission }) =>
              hasPermission && (
                <Menu.Item
                  key={`${item.id}_2`}
                  className={styles.dropdown_item_custom}
                  onClick={() => {
                    handleDelete(item?.id);
                  }}
                >
                  {t('delete')}
                </Menu.Item>
              )
            }
          </PermissionCheck>
        )}
      </Menu>
    ),
    [handleDelete, isEditVessel, t],
  );

  const renderItem = useCallback(
    (item: FeedbackAndRemark, index: number) => (
      <div key={index} className="d-flex justify-content-between">
        <div className={styles.leftContent}>
          <div>
            <p className={styles.content}>{`${index + 1}. ${item?.remark}`}</p>
          </div>
          <div className={cx('d-flex justify-content-end', styles.extraInfo)}>
            <span className={styles.name}>{item?.createdUser?.username}</span>
            <span className={styles.dash}>-</span>
            <span className={styles.date}>{item?.createdUser?.jobTitle}</span>
            <img
              src={images.icons.icDotBlue}
              alt="icon"
              className={styles.icDotBlue}
            />
            <span className={styles.formatDate}>
              {moment(item?.updatedAt).local().format('DD/MM/YYYY - hh:mm A')}
            </span>
          </div>
        </div>
        <div className={styles.rightContent}>
          <div className={styles.actions}>
            <Dropdown overlay={() => menuOptions(item)} trigger={['click']}>
              <span className={styles.wrapperAction}>
                <img
                  src={images.icons.ic3DotVertical}
                  alt="more"
                  className={styles.moreAction}
                />
              </span>
            </Dropdown>
          </div>
        </div>
      </div>
    ),
    [menuOptions],
  );
  return (
    <div className={cx(styles.container, className)}>
      <div
        className={cx(
          styles.title,
          'd-flex justify-content-between align-items-center',
        )}
      >
        <span>{t('summary.feedbackRemarks')}</span>
        <PermissionCheck
          options={{
            feature: Features.QUALITY_ASSURANCE,
            subFeature: SubFeatures.VESSEL_SCREENING,
            action: ActionTypeEnum.CREATE,
          }}
        >
          {({ hasPermission }) =>
            hasPermission && (
              <Button
                onClick={() => {
                  setSelected(null);
                  setIsEdit(true);
                  setIsVisibleFeedback(true);
                }}
                buttonSize={ButtonSize.Medium}
                className={styles.btnCreate}
                renderSuffix={
                  <img
                    src={images.icons.icAddCircle}
                    alt="createNew"
                    className={styles.icButton}
                  />
                }
              >
                {t('summary.createNew')}
              </Button>
            )
          }
        </PermissionCheck>
      </div>
      <div className={styles.contentWrapper}>
        {listRemarks?.data?.length ? (
          listRemarks.data?.map((item, index) => (
            <div key={item?.id}>{renderItem(item, index)}</div>
          ))
        ) : (
          <div className="d-flex justify-content-center align-items-center">
            <img
              src={images.icons.icNoData}
              className={styles.noData}
              alt="loading"
            />
          </div>
        )}
      </div>
      <ModalFeedbackAndRemarks
        isOpen={isVisibleFeedback}
        toggle={() => {
          setIsVisibleFeedback((e) => !e);
          setIsEdit(false);
          setSelected(null);
        }}
        handleSubmitForm={handleSubmitFeedbackAndRemarks}
        isEdit={isEdit}
        data={selected}
      />
    </div>
  );
};
