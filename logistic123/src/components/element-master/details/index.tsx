import { AppRouteConst } from 'constants/route.const';
import { useEffect, useState, useCallback } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PermissionCheck from 'hoc/withPermissionCheck';
import {
  Features,
  SubFeatures,
  ActionTypeEnum,
} from 'constants/roleAndPermission.const';
import NoPermission from 'containers/no-permission';
import Container from 'components/common/container/ContainerPage';
import history from 'helpers/history.helper';
import { I18nNamespace } from 'constants/i18n.const';
import { useTranslation } from 'react-i18next';
import ModalConfirm from 'components/common/modal/ModalConfirm';
import {
  deleteStandardMasterActions,
  getListElementMasterActions,
  getStandardMasterDetailActions,
  updateElementMasterActions,
} from 'store/element-master/element-master.action';
import { BulkUpdateElementMasterParams } from 'models/api/element-master/element-master.model';
import { getListTemplateActions } from 'store/template/template.action';
import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import styles from './detail.module.scss';
import ElementMaster from '../forms/ElementMasterForm';

export default function ElementMasterDetailContainer() {
  const { search } = useLocation();
  const dispatch = useDispatch();

  const { loading, standardMasterDetail } = useSelector(
    (state) => state.elementMaster,
  );

  const { t } = useTranslation([
    I18nNamespace.ELEMENT_MASTER,
    I18nNamespace.COMMON,
  ]);
  const { id } = useParams<{ id: string }>();
  const [isEdit, setIsEdit] = useState(false);
  const [modal, setModal] = useState(false);

  useEffect(() => {
    if (search !== '?edit') {
      setIsEdit(false);
    } else {
      setIsEdit(true);
    }
  }, [search]);

  const handleSubmit = useCallback(
    (formData: BulkUpdateElementMasterParams) => {
      dispatch(updateElementMasterActions.request({ id, data: formData }));
    },
    [dispatch, id],
  );
  const handleDelete = useCallback(() => {
    dispatch(
      deleteStandardMasterActions.request({
        id,
        data: {
          deleteEleMasterIds:
            standardMasterDetail?.elementMasters?.map((item) => item.id) || [],
        },
        isDetail: true,
        getListStandardMaster: () => {
          history.push(AppRouteConst.ELEMENT_MASTER);
        },
      }),
    );
  }, [dispatch, id, standardMasterDetail]);

  useEffect(() => {
    dispatch(getStandardMasterDetailActions.request(id));
    dispatch(getListElementMasterActions.request(id));
    dispatch(
      getListTemplateActions.request({
        content: MODULE_TEMPLATE.selfAssessmentElementMaster,
      }),
    );
    return () => {
      dispatch(
        getStandardMasterDetailActions.success({
          id: '',
          code: '',
          name: '',
          status: '',
          companyId: '',
          scoreApplicable: false,
          levels: [],
          createdUserId: '',
          elementMasters: [],
        }),
      );
      dispatch(
        getListElementMasterActions.success({
          data: [],
          page: 0,
          pageSize: 0,
          totalPage: 0,
          totalItem: 0,
        }),
      );
    };
  }, [dispatch, id]);

  return (
    <PermissionCheck
      options={{
        feature: Features.QUALITY_ASSURANCE,
        subFeature: SubFeatures.ELEMENT_MASTER,
        action:
          search === '?edit' ? ActionTypeEnum.UPDATE : ActionTypeEnum.VIEW,
      }}
    >
      {({ hasPermission }) =>
        hasPermission ? (
          <div className={styles.ElementMasterDetail}>
            <Container>
              <ModalConfirm
                title={t('modal.delete')}
                content={t('modal.areYouSureYouWantToDelete')}
                isDelete
                disable={loading}
                toggle={() => {
                  setModal(!modal);
                }}
                modal={modal}
                handleSubmit={handleDelete}
              />
              <ElementMaster
                isEdit={isEdit}
                data={standardMasterDetail}
                onDelete={() => setModal(true)}
                onSubmit={handleSubmit}
              />
            </Container>
          </div>
        ) : (
          <NoPermission />
        )
      }
    </PermissionCheck>
  );
}
