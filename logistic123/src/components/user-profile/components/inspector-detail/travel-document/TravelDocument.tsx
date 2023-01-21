import images from 'assets/images/images';
import cx from 'classnames';
import NoDataImg from 'components/common/no-data/NoData';
import { formatDateNoTime } from 'helpers/date.helper';
import { RowComponent } from 'components/common/table/row/rowCp';
import TableCp from 'components/common/table/TableCp';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { toastSuccess, toastError } from 'helpers/notification.helper';
import { deleteTravelDocumentApi } from 'api/user.api';
import PermissionCheck from 'hoc/withPermissionCheck';
import { getListTravelDocumentActions } from 'store/user/user.action';
import { Action } from 'models/common.model';
import { FC, useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/userManagement.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import ModalEditTravelDocument from './ModalEditTravelDocument';
import styles from './travel-document.module.scss';

interface Props {
  disabled?: boolean;
  dynamicLabels?: IDynamicLabel;
}

const TravelDocument: FC<Props> = ({ disabled, dynamicLabels }) => {
  const { listTravelDocument } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [modalTravelDocument, setModalTravelDocument] = useState(false);
  const [isEditTravelDocument, setIsEditTravelDocument] = useState(false);

  const [idTravelDocumentSelected, setIdTravelDocumentSelected] =
    useState(null);

  const { id } = useParams<{ id: string }>();
  const { userDetailResponse } = useSelector((state) => state.user);

  const handleGetList = useCallback(() => {
    dispatch(
      getListTravelDocumentActions.request({
        id: id || userDetailResponse?.id,
      }),
    );
  }, [dispatch, id, userDetailResponse?.id]);

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
        id: 'documentType',
        label: renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Document type'],
        ),
        sort: false,
        minWidth: 100,
        width: '100',
      },
      {
        id: 'passportNumber',
        label: renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Passport/Visa number'],
        ),
        sort: false,
        minWidth: 100,
        width: '100',
      },
      {
        id: 'issuedDate',
        label: renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Date of issue'],
        ),
        sort: false,
        minWidth: 100,
        width: '100',
      },
      {
        id: 'expiryDate',
        label: renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Date of expiry'],
        ),
        sort: false,
        minWidth: 100,
        width: '100',
      },
      {
        id: 'verifyUser',
        label: renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Verified by'],
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
      documentType: data?.type || '-',
      passportNumber: data?.number || '-',
      issuedDate: formatDateNoTime(data?.issuedDate),
      expiryDate: formatDateNoTime(data?.expiryDate),
      verifyUser: data?.verifyUser?.username || '-',
    }),
    [],
  );
  const handleDeleteTravelDocument = useCallback(
    (id: string) => {
      deleteTravelDocumentApi(id)
        .then((res) => {
          toastSuccess('Delete travel document successfully');
          handleGetList();
        })
        .catch((err) =>
          toastError(
            err?.message ||
              renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Something went wrong!'],
              ),
          ),
        );
    },
    [dynamicLabels, handleGetList],
  );

  const renderRow = useCallback(
    (isScrollable?: boolean) => {
      if (listTravelDocument?.data?.length <= 0) {
        return null;
      }
      return (
        <tbody>
          {listTravelDocument?.data?.map((item, index) => {
            const finalData = sanitizeData(item, index);

            const disabledEdit = item.isVerified;
            // const disabledDelete = item.isVerified;

            const actions: Action[] = [
              {
                img: images.icons.icViewDetail,
                function: () => {
                  setModalTravelDocument(true);
                  setIsEditTravelDocument(false);
                  setIdTravelDocumentSelected(item.id);
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
                  setModalTravelDocument(true);
                  setIsEditTravelDocument(true);
                  setIdTravelDocumentSelected(item.id);
                },
                feature: Features.AUDIT_INSPECTION,
                subFeature: SubFeatures.REPORT_OF_FINDING,
                action: ActionTypeEnum.UPDATE,
                disable: disabled || disabledEdit,
                cssClass: 'ms-1',
              },
              {
                img: images.icons.icRemove,
                function: () => {
                  showConfirmBase({
                    isDelete: true,
                    txTitle: renderDynamicLabel(
                      dynamicLabels,
                      COMMON_DYNAMIC_FIELDS['Delete?'],
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
                    onPressButtonRight: () =>
                      handleDeleteTravelDocument(item.id),
                  });
                },
                feature: Features.AUDIT_INSPECTION,
                subFeature: SubFeatures.REPORT_OF_FINDING,
                action: ActionTypeEnum.DELETE,
                buttonType: ButtonType.Orange,
                disable: disabled || item.isVerified,
                cssClass: 'ms-1',
              },
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
                    tooltip
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
      dynamicLabels,
      handleDeleteTravelDocument,
      listTravelDocument?.data,
      sanitizeData,
    ],
  );

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
            USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Travel document'],
          )}
        </div>
        <Button
          onClick={() => {
            setModalTravelDocument(true);
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

      {listTravelDocument?.data?.length ? (
        <TableCp
          rowLabels={rowLabels}
          renderRow={renderRow}
          loading={false}
          isEmpty={undefined}
        />
      ) : (
        <NoDataImg />
      )}
      <ModalEditTravelDocument
        isOpen={modalTravelDocument}
        onClose={() => {
          setModalTravelDocument(false);
          setIsEditTravelDocument(false);
          setIdTravelDocumentSelected(null);
        }}
        onSuccess={handleGetList}
        isEdit={isEditTravelDocument}
        recordId={idTravelDocumentSelected}
        disabled={disabled}
        dynamicLabels={dynamicLabels}
      />
    </div>
  );
};

export default TravelDocument;
