import images from 'assets/images/images';
import cx from 'classnames';
import { useDispatch, useSelector } from 'react-redux';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { StatusPage, UserContext } from 'contexts/user/UserContext';
import { LicensesCertification } from 'models/api/user/user.model';
import moment from 'moment';
import {
  clearUserLicensesCertificationErrorReducer,
  createUserLicensesCertificationActions,
  deleteUserLicensesCertificationActions,
  getListLicensesCertificationActions,
  updateUserLicensesCertificationActions,
} from 'store/user/user.action';
import {
  FC,
  useCallback,
  useContext,
  useEffect,
  useState,
  useMemo,
} from 'react';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { formatDateTimeDay } from 'helpers/utils.helper';
import { Action } from 'models/common.model';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import TableCp from 'components/common/table/TableCp';
import NoDataImg from 'components/common/no-data/NoData';
import PermissionCheck from 'hoc/withPermissionCheck';
import { RowComponent } from 'components/common/table/row/rowCp';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/userManagement.const';
import ModalLicensesCertification from './ModalLicensesCertification';
import styles from './licenses-certification.module.scss';

interface Props {
  disabled?: boolean;
  dynamicLabels?: IDynamicLabel;
}

const LicensesCertificationList: FC<Props> = ({ disabled, dynamicLabels }) => {
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);
  const [selected, setSelected] = useState<LicensesCertification>(null);
  const { licensesCertification, userDetailResponse } = useSelector(
    (state) => state.user,
  );

  const rowLabels = useMemo(
    () => [
      {
        id: 'action',
        label: renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.Action,
        ),
        sort: false,
        minWidth: 100,
        width: '100',
      },
      {
        id: 'sno',
        label: renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['S.No'],
        ),
        sort: false,
        minWidth: 100,
        width: '100',
      },
      {
        id: 'type',
        label: renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.Type,
        ),
        sort: false,
        minWidth: 100,
        width: '100',
      },
      {
        id: 'name',
        label: renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['License name'],
        ),
        sort: false,
        minWidth: 100,
        width: '100',
      },
      {
        id: 'issuedBy',
        label: renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Issued by'],
        ),
        sort: false,
        minWidth: 100,
        width: '100',
      },
      {
        id: 'issueCountry',
        label: renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Issue country'],
        ),
        sort: false,
        minWidth: 100,
        width: '100',
      },
      {
        id: 'verifiedBy',
        label: renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Verified by'],
        ),
        sort: false,
        minWidth: 100,
        width: '100',
      },
      {
        id: 'verifiedDateTime',
        label: renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Verified date time'],
        ),
        sort: false,
        minWidth: 100,
        width: '100',
      },
    ],
    [dynamicLabels],
  );

  const dispatch = useDispatch();
  const { isInspector, statusPage } = useContext(UserContext);

  const handleDelete = useCallback(
    (id: string) => {
      dispatch(
        deleteUserLicensesCertificationActions.request({
          id,
          handleSuccess: () => {
            dispatch(
              getListLicensesCertificationActions.request({
                id: userDetailResponse.id,
                params: { pageSize: -1 },
              }),
            );
          },
        }),
      );
    },
    [dispatch, userDetailResponse.id],
  );

  const sanitizeData = useCallback(
    (data: LicensesCertification, index: any) => ({
      id: data?.id,
      sno: index + 1,
      type: data.type,
      name: data.name,
      issuedBy: data.issuedBy || '-',
      issueCountry: data.issueCountry || '-',
      verifiedBy: data?.verifyUser?.username || '-',
      verifiedDateTime: formatDateTimeDay(data?.verifiedAt) || '-',
    }),
    [],
  );

  const onEdit = useCallback((data: LicensesCertification) => {
    setSelected(data);
    setOpenModal(true);
    setIsView(false);
  }, []);

  const onView = useCallback((data: LicensesCertification) => {
    setSelected(data);
    setOpenModal(true);
    setIsView(true);
  }, []);

  const onDelete = useCallback(
    (id: string) => {
      showConfirmBase({
        isDelete: true,
        txTitle: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS.Delete,
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
        onPressButtonRight: () => handleDelete(id),
      });
    },
    [dynamicLabels, handleDelete],
  );
  const handleSubmit = useCallback(
    (dataForm, idLicensesCertification?: string) => {
      const { endDate, ...other } = dataForm;
      const params = {
        ...other,
        userId: userDetailResponse.id,
        issuedDate: moment(dataForm.issuedDate).toISOString(),
        expiryDate: moment(dataForm.expiryDate).toISOString(),
        issueCountry: dataForm.issueCountry?.[0]?.value,
      };
      if (!idLicensesCertification) {
        dispatch(
          createUserLicensesCertificationActions.request({
            ...params,
            handleSuccess: () => {
              dispatch(
                getListLicensesCertificationActions.request({
                  id: userDetailResponse.id,
                  params: { pageSize: -1 },
                }),
              );
              setOpenModal(false);
              setSelected(null);
              setIsView(false);
            },
          }),
        );
      } else {
        dispatch(
          updateUserLicensesCertificationActions.request({
            id: idLicensesCertification,
            data: { ...params, endDate },
            handleSuccess: () => {
              dispatch(
                getListLicensesCertificationActions.request({
                  id: userDetailResponse.id,
                  params: { pageSize: -1 },
                }),
              );
              setOpenModal(false);
              setSelected(null);
              setIsView(false);
            },
          }),
        );
      }
    },
    [dispatch, userDetailResponse.id],
  );

  const renderRow = useCallback(
    (isScrollable?: boolean) => {
      if (licensesCertification?.list?.data?.length <= 0) {
        return null;
      }
      return (
        <tbody>
          {licensesCertification?.list?.data?.map((item, index) => {
            const finalData = sanitizeData(item, index);

            const actions: Action[] = [
              {
                img: images.icons.icViewDetail,
                function: () => onView(item),

                feature: Features.USER_ROLE,
                subFeature: SubFeatures.USER,
                buttonType: ButtonType.Blue,
                disable: disabled,
              },
              {
                img: images.icons.icEdit,
                function: () => onEdit(item),
                feature: Features.USER_ROLE,
                subFeature: SubFeatures.USER,
                action: ActionTypeEnum.UPDATE,
                disable:
                  disabled ||
                  statusPage === StatusPage.VIEW ||
                  item?.isVerified,
                cssClass: 'ms-1',
              },
              {
                img: images.icons.icRemove,
                function: () => onDelete(item?.id),
                feature: Features.USER_ROLE,
                subFeature: SubFeatures.USER,
                action: ActionTypeEnum.DELETE,
                buttonType: ButtonType.Orange,
                disable: disabled || statusPage === StatusPage.VIEW,
                cssClass: 'ms-1',
              },
            ];

            return (
              <PermissionCheck
                options={{
                  feature: Features.USER_ROLE,
                  subFeature: SubFeatures.USER,
                  action: ActionTypeEnum.UPDATE,
                }}
                key={String(JSON.stringify(item) + index)}
              >
                {({ hasPermission }) => (
                  <RowComponent
                    isScrollable={isScrollable}
                    data={finalData}
                    actionList={actions}
                    validWordFlow
                    key={item?.id}
                    onClickRow={() => {}}
                  />
                )}
              </PermissionCheck>
            );
          })}
        </tbody>
      );
    },
    [
      disabled,
      licensesCertification?.list?.data,
      onDelete,
      onEdit,
      onView,
      sanitizeData,
      statusPage,
    ],
  );

  useEffect(() => {
    if (userDetailResponse?.id && isInspector) {
      dispatch(
        getListLicensesCertificationActions.request({
          id: userDetailResponse?.id,
          params: { pageSize: -1 },
        }),
      );
    }

    return () => {
      dispatch(clearUserLicensesCertificationErrorReducer());
    };
  }, [dispatch, isInspector, userDetailResponse?.id]);

  return (
    <div className={styles.wrap}>
      <div
        className={cx(
          styles.header,
          'd-flex align-items-center justify-content-between mb-3',
        )}
      >
        <div className={styles.title}>
          {renderDynamicLabel(
            dynamicLabels,
            USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Licenses certification'],
          )}
        </div>
        <Button
          disabled={disabled || statusPage === StatusPage.VIEW}
          disabledCss={disabled || statusPage === StatusPage.VIEW}
          onClick={() => {
            setOpenModal(true);
            setSelected(null);
            setIsView(false);
          }}
          className={styles.btnAdd}
          buttonSize={ButtonSize.Medium}
          buttonType={ButtonType.Primary}
          renderSuffix={
            <img
              src={images.icons.icAddCircle}
              alt="createNew"
              className={styles.addIc}
            />
          }
        >
          {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Add)}
        </Button>
      </div>
      {licensesCertification?.list?.data?.length ? (
        <TableCp
          rowLabels={rowLabels}
          renderRow={renderRow}
          loading={false}
          isEmpty={undefined}
        />
      ) : (
        <NoDataImg />
      )}

      <ModalLicensesCertification
        isOpen={openModal}
        isView={isView}
        data={selected}
        onClose={() => {
          setSelected(null);
          setOpenModal(false);
        }}
        onSubmit={handleSubmit}
        dynamicLabels={dynamicLabels}
      />
    </div>
  );
};

export default LicensesCertificationList;
