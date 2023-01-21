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
import {
  createSummaryWebServicesActions,
  deleteSummaryWebServicesActions,
  getSummaryWebServicesActions,
  updateSummaryWebServicesActions,
} from 'pages/vessel-screening/store/vessel-summary.action';
import { WebService } from 'pages/vessel-screening/utils/models/summary.model';
import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import Dropdown from 'antd/lib/dropdown';
import Menu from 'antd/lib/menu';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { VesselScreeningContext } from 'pages/vessel-screening/VesselScreeningContext';
import { ModalWebServices } from 'pages/vessel-screening/components/ModalWebServices';
import TableAntd from 'components/common/table-antd/TableAntd';
import styles from './web-services.module.scss';

interface IProps {
  className?: string;
  tabName?: string;
}

export const WebServices: FC<IProps> = ({ className, tabName }) => {
  const { t } = useTranslation([
    I18nNamespace.VESSEL_SCREENING,
    I18nNamespace.COMMON,
  ]);
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const [isVisibleModal, setIsVisibleModal] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [selected, setSelected] = useState<WebService>(null);
  const { isEditVessel } = useContext(VesselScreeningContext);
  const { vesselScreeningDetail } = useSelector(
    (store) => store.vesselScreening,
  );
  const { listWebServices } = useSelector((state) => state.vesselSummary);

  const getListWebServices = useCallback(() => {
    if (vesselScreeningDetail?.id) {
      dispatch(
        getSummaryWebServicesActions.request({
          vesselScreeningId: vesselScreeningDetail.id,
          tabName,
          pageSize: -1,
        }),
      );
    }
  }, [dispatch, tabName, vesselScreeningDetail?.id]);

  useEffect(() => {
    getListWebServices();
  }, [getListWebServices]);

  const handleSubmitSuccess = useCallback(() => {
    setIsVisibleModal((e) => !e);
    setSelected(null);
    setIsEdit(false);
    getListWebServices();
  }, [getListWebServices]);

  const handleSubmitWebServices = useCallback(
    (value: { name: string; url: string }) => {
      let action = null;
      const params: any = {
        vesselScreeningId: id,
        tabName,
        webName: value?.name,
        url: value?.url,
        handleSuccess: handleSubmitSuccess,
      };
      if (selected?.id) {
        action = updateSummaryWebServicesActions.request;
        params.webServiceId = selected.id;
      } else {
        action = createSummaryWebServicesActions.request;
      }
      dispatch(action?.(params));
    },
    [dispatch, id, selected?.id, tabName, handleSubmitSuccess],
  );

  const handleDeleteWebServices = useCallback(
    (webServiceId: string) => {
      dispatch(
        deleteSummaryWebServicesActions.request({
          vesselScreeningId: id,
          webServiceId,
          handleSuccess: () => {
            setSelected(null);
            getListWebServices();
          },
        }),
      );
    },
    [dispatch, getListWebServices, id],
  );

  const handleDelete = useCallback(
    (id: string) => {
      showConfirmBase({
        isDelete: true,
        txTitle: t('modal.delete'),
        txMsg: t('modal.areYouSureYouWantToDelete'),
        onPressButtonRight: () => handleDeleteWebServices(id),
      });
    },
    [handleDeleteWebServices, t],
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
            setIsVisibleModal(true);
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
                    setIsVisibleModal(true);
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
                  key={`${item.id}_3`}
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

  const columns = useMemo(
    () => [
      {
        title: t('summary.sno'),
        key: 'sNo',
        dataIndex: 'sNo',
        width: 60,
      },
      {
        title: t('summary.txWebName'),
        dataIndex: 'name',
        key: 'name',
        width: 100,
      },
      {
        title: t('summary.url'),
        dataIndex: 'url',
        key: 'url',
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
      listWebServices?.data?.map((item, index) => ({
        sNo: index + 1,
        name: item?.webName,
        url: (
          <a href={item?.url} target="_blank" rel="noreferrer">
            {item?.url}
          </a>
        ),
        action: (
          <Dropdown overlay={() => menuOptions(item)} trigger={['click']}>
            <span className={styles.wrapperAction}>
              <img
                src={images.icons.ic3DotVertical}
                alt="more"
                className={styles.moreAction}
              />
            </span>
          </Dropdown>
        ),
      })),
    [listWebServices?.data, menuOptions],
  );

  return (
    <div className={cx(styles.wrapperContainer, className)}>
      <div
        className={cx(
          styles.title,
          'd-flex justify-content-between align-items-center',
        )}
      >
        <span className={styles.titleContainer}>
          {t('summary.webServices')}
        </span>
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
                  setIsVisibleModal(true);
                }}
                buttonSize={ButtonSize.Medium}
                className="button_create"
              >
                {t('buttons.request')}
              </Button>
            )
          }
        </PermissionCheck>
      </div>
      <div className="pt-3">
        <TableAntd
          columns={columns}
          dataSource={dataTable}
          scroll={{ x: 'max-content', y: 180 }}
        />
      </div>

      <ModalWebServices
        isOpen={isVisibleModal}
        toggle={() => {
          setIsVisibleModal((e) => !e);
          setIsEdit(false);
          setSelected(null);
        }}
        handleSubmitForm={handleSubmitWebServices}
        isEdit={isEdit}
        data={selected}
      />
    </div>
  );
};
