import { useCallback, useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { getGroupDetailApi } from 'api/group.api';
import { toastError } from 'helpers/notification.helper';
import { EditGroupParams } from 'models/api/group/group.model';
import NoPermission from 'containers/no-permission';
import {
  clearErrorMessages,
  editGroupAction,
  deleteGroupActions,
} from 'store/group/group.action';
import { AppRouteConst } from 'constants/route.const';
import { I18nNamespace } from 'constants/i18n.const';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import { CommonQuery } from 'constants/common.const';
import PermissionCheck from 'hoc/withPermissionCheck';
import {
  Features,
  SubFeatures,
  ActionTypeEnum,
} from 'constants/roleAndPermission.const';
import ModalConfirm from 'components/common/modal/ModalConfirm';
import history from 'helpers/history.helper';
import images from 'assets/images/images';
import Form, { Errors } from 'components/group/forms/GroupForm';
import styles from './detail.module.scss';

const GroupManagementDetail = () => {
  const [groupCode, setGroupCode] = useState<string>('');
  const [modal, setModal] = useState(false);
  const [groupName, setGroupName] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [numCompanies, setNumCompanies] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [errors, setErrors] = useState<Errors>({});
  const { id } = useParams<{ id: string; edit: string }>();
  const { search } = useLocation();
  const { t } = useTranslation(I18nNamespace.COMMON);
  const dispatch = useDispatch();
  const { messageError } = useSelector((state) => state.group);

  useEffect(() => {
    getGroupDetailApi(id)
      .then((r) => {
        setGroupCode(r.data.code);
        setGroupName(r.data.name);
        setDescription(r.data.description);
        setNumCompanies(r.data.numCompanies);
      })
      .catch((e) => {
        toastError(e);
        if (e?.statusCode === 404) {
          history.push(AppRouteConst.GROUP);
        }
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    dispatch(clearErrorMessages());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      let messages = {};
      messageError?.forEach((i) => {
        messages = { ...messages, [i?.fieldName]: i?.message };
      });
      setErrors(messages);
    }
    return () => {
      isMounted = false;
    };
  }, [messageError]);

  const handleEdit = () => {
    history.push(`${AppRouteConst.getGroupById(id)}${CommonQuery.EDIT}`);
  };

  const onOpenModal = () => {
    setModal(true);
  };

  const handleSubmit = () => {
    const params: EditGroupParams = {
      id,
      body: {
        code: groupCode,
        name: groupName,
        description,
      },
    };
    dispatch(editGroupAction.request(params));
  };

  const handleDelete = async () => {
    dispatch(
      deleteGroupActions.request({
        id,
        isDetail: true,
        getList: () => {
          history.push(AppRouteConst.GROUP);
        },
      }),
    );
  };

  const renderPageCheck = useCallback(
    (hasPermission: boolean) => {
      if (search === CommonQuery.EDIT) {
        if (numCompanies === 0 && hasPermission) {
          return true;
        }
        return false;
      }
      if (hasPermission && search !== CommonQuery.EDIT) {
        return true;
      }
      return false;
    },
    [search, numCompanies],
  );

  return (
    <>
      {loading ? (
        <div className="d-flex justify-content-center">
          <img
            src={images.common.loading}
            className={styles.loading}
            alt="loading"
          />
        </div>
      ) : (
        <>
          <PermissionCheck
            options={{
              feature: Features.GROUP_COMPANY,
              subFeature: SubFeatures.GROUP_MASTER,
              action:
                search === CommonQuery.EDIT
                  ? ActionTypeEnum.UPDATE
                  : ActionTypeEnum.VIEW,
            }}
          >
            {({ hasPermission }) =>
              renderPageCheck(hasPermission) ? (
                <Form
                  code={groupCode}
                  name={groupName}
                  currentBreadcrumbs={
                    search !== CommonQuery.EDIT
                      ? BREAD_CRUMB.GROUP_DETAIL
                      : BREAD_CRUMB.GROUP_EDIT
                  }
                  handleEdit={handleEdit}
                  handleDelete={onOpenModal}
                  handleSubmit={handleSubmit}
                  setCode={setGroupCode}
                  setName={setGroupName}
                  setDescription={setDescription}
                  description={description}
                  isDetail={search !== CommonQuery.EDIT}
                  hideAction={numCompanies !== 0}
                  errors={errors}
                  loading={loading}
                />
              ) : (
                <NoPermission />
              )
            }
          </PermissionCheck>

          <ModalConfirm
            disable={loading}
            isDelete
            toggle={() => setModal(!modal)}
            modal={modal}
            handleSubmit={() => handleDelete()}
            title={t('modal.delete')}
            content={t('modal.areYouSureYouWantToDelete')}
          />
        </>
      )}
    </>
  );
};

export default GroupManagementDetail;
