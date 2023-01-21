import images from 'assets/images/images';
import cx from 'classnames';
import NoDataImg from 'components/common/no-data/NoData';
import { RowComponent } from 'components/common/table/row/rowCp';
import { useDispatch, useSelector } from 'react-redux';
import { formatDateLocalWithTime } from 'helpers/date.helper';
import TableCp from 'components/common/table/TableCp';
import Button, { ButtonType, ButtonSize } from 'components/ui/button/Button';
import { useParams } from 'react-router-dom';
import { getListProvidedInspectionActions } from 'store/user/user.action';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import PermissionCheck from 'hoc/withPermissionCheck';
import { Action } from 'models/common.model';
import { FC, useCallback, useState, useMemo } from 'react';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/userManagement.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import ModalEditProvided from './ModalEditProvidedInspection';
import styles from './provided-inspection.module.scss';

interface Props {
  disabled?: boolean;
  dynamicLabels?: IDynamicLabel;
}

const ProvidedInspection: FC<Props> = ({ disabled, dynamicLabels }) => {
  const { listProvidedInspection } = useSelector((state) => state.user);
  const [modalProvidedVisible, setModalProvidedVisible] = useState(false);
  const [isEditProvided, setIsEditProvided] = useState(false);
  const [isEditProvidedAll, setIsEditProvidedAll] = useState(false);
  const [idSelected, setIdSelected] = useState(null);
  const dispatch = useDispatch();
  const { userDetailResponse } = useSelector((state) => state.user);
  const { userInfo } = useSelector((state) => state.authenticate);
  const { id } = useParams<{ id: string }>();

  const handleGetList = useCallback(() => {
    dispatch(
      getListProvidedInspectionActions.request({
        id: id || userDetailResponse?.id,
        companyId: userInfo?.parentCompanyId || userInfo?.companyId,
      }),
    );
  }, [
    dispatch,
    id,
    userDetailResponse?.id,
    userInfo?.companyId,
    userInfo?.parentCompanyId,
  ]);

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
        id: 'inspectionType',
        label: renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Inspection type'],
        ),
        sort: false,
        minWidth: 100,
        width: '100',
      },
      {
        id: 'service',
        label: renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Service provided'],
        ),
        sort: false,
        minWidth: 100,
        width: '100',
      },
      {
        id: 'verified',
        label: renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.Verified,
        ),
        sort: false,
        minWidth: 100,
        width: '100',
      },
      {
        id: 'verifyBy',
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

  const sanitizeData = useCallback(
    (data: any, index: any) => ({
      id: data?.id,
      sno: index + 1,
      inspectionType: data?.inspectionType?.name || '-',
      service: data?.serviceProvided ? 'Yes' : 'No',
      verified: data?.isVerified ? 'Yes' : 'No',
      verifyBy: data?.verifyUser?.username || '-',
      verifiedDateTime: formatDateLocalWithTime(data?.verifiedAt) || '-',
    }),
    [],
  );

  const renderRow = useCallback(
    (isScrollable?: boolean) => {
      if (listProvidedInspection?.length <= 0) {
        return null;
      }
      return (
        <tbody>
          {listProvidedInspection?.map((item, index) => {
            const finalData = sanitizeData(item, index);

            const actions: Action[] = [
              {
                img: images.icons.icViewDetail,
                function: () => {
                  setModalProvidedVisible(true);
                  setIsEditProvided(false);
                  setIdSelected(item.id);
                },
                feature: Features.AUDIT_INSPECTION,
                subFeature: SubFeatures.REPORT_OF_FINDING,
                buttonType: ButtonType.Blue,
                action: ActionTypeEnum.UPDATE,
                // disable: disabled,
              },
              {
                img: images.icons.icEdit,
                function: () => {
                  setModalProvidedVisible(true);
                  setIsEditProvided(true);
                  setIdSelected(item.id);
                },
                feature: Features.AUDIT_INSPECTION,
                subFeature: SubFeatures.REPORT_OF_FINDING,
                action: ActionTypeEnum.UPDATE,
                disable: disabled || item?.isVerified,
                cssClass: 'ms-1',
              },
              // {
              //   img: images.icons.icRemove,
              //   function: () => {
              //     console.log('lol');
              //   },
              //   feature: Features.AUDIT_INSPECTION,
              //   subFeature: SubFeatures.REPORT_OF_FINDING,
              //   action: ActionTypeEnum.DELETE,
              //   buttonType: ButtonType.Orange,
              //   disable: disabled,
              //   cssClass: 'ms-1',
              // },
            ];

            return (
              <PermissionCheck
                options={{
                  feature: Features.AUDIT_INSPECTION,
                  subFeature: SubFeatures.REPORT_OF_FINDING,
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
                    classNameRow={styles.textDefault}
                  />
                )}
              </PermissionCheck>
            );
          })}
        </tbody>
      );
    },
    [disabled, listProvidedInspection, sanitizeData],
  );

  const disabledEditAll = useMemo(() => {
    const isAllVerified = listProvidedInspection?.some(
      (item) => !item.isVerified,
    );
    return disabled || !isAllVerified;
  }, [disabled, listProvidedInspection]);

  return (
    <div className={styles.wrap}>
      <div
        className={cx(
          styles.header,
          'd-flex align-items-center justify-content-between',
        )}
      >
        <div className={styles.title}>
          {renderDynamicLabel(
            dynamicLabels,
            USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Provided inspection'],
          )}
        </div>
        <Button
          disabled={disabledEditAll}
          disabledCss={disabledEditAll}
          onClick={() => {
            setModalProvidedVisible(true);
            setIsEditProvidedAll(true);
          }}
          className={styles.btnAdd}
          buttonSize={ButtonSize.Medium}
          buttonType={ButtonType.Primary}
          renderSuffix={
            <img
              src={images.icons.icEdit}
              alt="createNew"
              className={styles.addIc}
            />
          }
        >
          {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Edit)}
        </Button>
      </div>
      {listProvidedInspection.length ? (
        <TableCp
          rowLabels={rowLabels}
          renderRow={renderRow}
          loading={false}
          isEmpty={undefined}
          scrollVertical
        />
      ) : (
        <NoDataImg />
      )}
      <ModalEditProvided
        isOpen={modalProvidedVisible}
        onClose={() => {
          setModalProvidedVisible(false);
          setIsEditProvidedAll(false);
          setIsEditProvided(false);
          setIdSelected(null);
        }}
        onSuccess={handleGetList}
        isEdit={isEditProvided}
        isEditAll={isEditProvidedAll}
        recordId={idSelected}
        disabled={disabled}
        dynamicLabels={dynamicLabels}
      />
    </div>
  );
};

export default ProvidedInspection;
