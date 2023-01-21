import images from 'assets/images/images';
import cx from 'classnames';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import Container from 'components/common/container/ContainerPage';
import Button, { ButtonType } from 'components/ui/button/Button';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { CommonQuery } from 'constants/common.const';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { I18nNamespace } from 'constants/i18n.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import PermissionCheck from 'hoc/withPermissionCheck';
import {
  ShoreRank,
  UpdateShoreRankParams,
} from 'models/api/shore-rank/shore-rank.model';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import {
  deleteShoreRankActions,
  getShoreRankDetailActions,
  updateShoreRankActions,
} from 'store/shore-rank/shore-rank.action';
import ShoreRankForm from '../forms/ShoreRankForm';
import styles from './detail.module.scss';

export default function ShoreRankDetailContainer() {
  const { search } = useLocation();
  const dispatch = useDispatch();

  const shoreRankDetail = useSelector(
    (state) => state.shoreRank?.shoreRankDetail,
  );

  const { t } = useTranslation([
    I18nNamespace.SHORE_RANK,
    I18nNamespace.COMMON,
  ]);
  const { id } = useParams<{ id: string }>();
  const [isEdit, setIsEdit] = useState(false);

  const onDeleteShoreRank = () => {
    dispatch(
      deleteShoreRankActions.request({
        id,
        isDetail: true,
        getListShoreRank: () => {
          history.push(AppRouteConst.SHORE_RANK);
        },
      }),
    );
  };

  const handleSubmit = useCallback(
    (formData: ShoreRank) => {
      const finalParams: UpdateShoreRankParams = { id, body: formData };

      dispatch(updateShoreRankActions.request(finalParams));
    },
    [dispatch, id],
  );

  const handleDelete = () => {
    showConfirmBase({
      isDelete: true,
      txTitle: t('modal.delete'),
      txMsg: t('modal.areYouSureYouWantToDelete'),
      onPressButtonRight: onDeleteShoreRank,
    });
  };

  useEffect(() => {
    if (search !== CommonQuery.EDIT) {
      setIsEdit(false);
    } else {
      setIsEdit(true);
    }
  }, [search]);

  useEffect(() => {
    dispatch(getShoreRankDetailActions.request(id));
    return () => {
      dispatch(
        getShoreRankDetailActions.success({
          id: '',
          code: '',
          name: '',
          status: 'active',
          description: '',
        }),
      );
    };
  }, [dispatch, id]);

  // render
  return (
    <div className={styles.shoreRankDetail}>
      <Container>
        <div className="d-flex justify-content-between">
          <div className={styles.headers}>
            <BreadCrumb
              current={
                search === CommonQuery.EDIT
                  ? BREAD_CRUMB.SHORE_RANK_EDIT
                  : BREAD_CRUMB.SHORE_RANK_DETAIL
              }
            />
            <div className={cx('fw-bold', styles.title)}>
              {t('txShoreRank')}
            </div>
          </div>
          {!isEdit && (
            <div>
              <Button
                className={cx('me-2', styles.buttonFilter)}
                buttonType={ButtonType.CancelOutline}
                onClick={(e) => {
                  history.goBack();
                }}
              >
                <span className="pe-2">Back</span>
              </Button>
              <PermissionCheck
                options={{
                  feature: Features.CONFIGURATION,
                  subFeature: SubFeatures.SHORE_RANK,
                  action: ActionTypeEnum.UPDATE,
                }}
              >
                {({ hasPermission }) =>
                  hasPermission && (
                    <Button
                      className={cx('me-1', styles.buttonFilter)}
                      onClick={(e) => {
                        history.push(
                          `${AppRouteConst.getShoreRankById(
                            shoreRankDetail?.id,
                          )}${CommonQuery.EDIT}`,
                        );
                      }}
                    >
                      <span className="pe-2">{t('buttons.txEdit')}</span>
                      <img
                        src={images.icons.icEdit}
                        alt="edit"
                        className={styles.icEdit}
                      />
                    </Button>
                  )
                }
              </PermissionCheck>

              <PermissionCheck
                options={{
                  feature: Features.CONFIGURATION,
                  subFeature: SubFeatures.SHORE_RANK,
                  action: ActionTypeEnum.DELETE,
                }}
              >
                {({ hasPermission }) =>
                  hasPermission && (
                    <Button
                      className={cx('ms-1', styles.buttonFilter)}
                      buttonType={ButtonType.Orange}
                      onClick={handleDelete}
                    >
                      <span className="pe-2">Delete</span>
                      <img
                        src={images.icons.icRemove}
                        alt="remove"
                        className={styles.icRemove}
                      />
                    </Button>
                  )
                }
              </PermissionCheck>
            </div>
          )}
        </div>

        <ShoreRankForm
          isEdit={isEdit}
          data={shoreRankDetail}
          onSubmit={handleSubmit}
        />
      </Container>
    </div>
  );
}
