/* eslint-disable jsx-a11y/label-has-associated-control */
import { yupResolver } from '@hookform/resolvers/yup';
import { useSelector } from 'react-redux';
import Table, { ColumnsType } from 'antd/lib/table';
import {
  getDetailProvidedInspectionApi,
  getListProvidedInspection,
  updateProvidedInspectionApi,
} from 'api/user.api';
import images from 'assets/images/images';
import { RoleScope } from 'constants/roleAndPermission.const';
import cx from 'classnames';
import NoDataImg from 'components/common/no-data/NoData';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import Checkbox from 'components/ui/checkbox/Checkbox';
import Input from 'components/ui/input/Input';
import { KeyPress } from 'constants/common.const';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { FieldValues, useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/userManagement.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { Modal, ModalProps } from 'reactstrap';
import * as yup from 'yup';
import styles from './provided-inspection.module.scss';

interface ModalComponentProps extends ModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalClassName?: string;
  contentClassName?: string;
  classesName?: string;
  onSuccess: () => void;
  isEdit?: boolean;
  recordId?: string;
  disabled?: boolean;
  dynamicLabels?: IDynamicLabel;
}

const schema = yup.object().shape({});

const defaultValues = {};

const ModalEditProvided: FC<ModalComponentProps> = ({
  isOpen,
  onClose,
  modalClassName,
  contentClassName,
  classesName,
  onSuccess,
  isEdit,
  recordId,
  disabled,
  dynamicLabels,
  ...other
}) => {
  const {
    // control,
    handleSubmit,
    // setValue,
    // getValues,
    // setError,
    // watch,
    // reset,
    // register,
    // formState: { errors },
  } = useForm<FieldValues>({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(schema),
  });
  const { userInfo } = useSelector((state) => state.authenticate);

  const [listDataSelected, selectData] = useState([]);
  const [initialData, setInitialData] = useState([]);
  const [listData, setListData] = useState([]);
  const [search, setSearch] = useState('');
  const [isEditFile, setEditFile] = useState(false);
  const [viewOnly, setViewOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const { id } = useParams<{ id: string }>();
  const { userDetailResponse } = useSelector((state) => state.user);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
    if (recordId && !isEdit) {
      setEditFile(false);
      return;
    }
    setEditFile(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const handleGetListProvidedInspection = useCallback(() => {
    getListProvidedInspection({
      id: id || userDetailResponse?.id,
      isVerified: false,
    })
      .then((res) => {
        setInitialData(res.data || []);
        setListData(res.data || []);
        selectData(res.data || []);
      })
      .catch((err) => toastError(err?.message || 'Something went wrong!'));
  }, [id, userDetailResponse?.id]);

  useEffect(() => {
    if (isOpen) {
      if (recordId) {
        getDetailProvidedInspectionApi(recordId, id || userDetailResponse?.id)
          .then((res) => {
            if (res?.data?.isVerified) {
              setViewOnly(true);
            }
            setInitialData(res?.data ? [res?.data] : []);
            setListData(res?.data ? [res?.data] : []);
            selectData(res?.data ? [res?.data] : []);
          })
          .catch((err) =>
            toastError(
              err?.message ||
                renderDynamicLabel(
                  dynamicLabels,
                  USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS[
                    'Something went wrong!'
                  ],
                ),
            ),
          );
      } else {
        handleGetListProvidedInspection();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, recordId]);

  const handleSelectData = useCallback(
    (id: string, key?: string) => {
      if (id === 'all') {
        if (
          listDataSelected?.filter((i) => i?.[key])?.length === listData?.length
        ) {
          selectData(listDataSelected?.map((i) => ({ ...i, [key]: false })));
        } else {
          selectData(
            listDataSelected?.map((i) => ({
              ...i,
              [key]: true,
            })),
          );
        }
        return;
      }
      const newList = listDataSelected?.map((i) => {
        if (i.id === id) {
          return { ...i, [key]: !i?.[key] };
        }
        return i;
      });
      selectData(newList);
    },
    [listData, listDataSelected],
  );

  const handleFilterBySearch = useCallback(() => {
    if (!search) {
      setListData(initialData);
      return;
    }

    const result = initialData.filter((i) =>
      i?.inspectionType?.name?.includes(search),
    );

    setListData(result);
  }, [initialData, search]);

  const columns: ColumnsType = [
    {
      title: renderDynamicLabel(
        dynamicLabels,
        USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['S.No'],
      ),
      dataIndex: 'sNo',
      key: 'sNo',
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Inspection type'],
      ),
      dataIndex: 'inspectionType',
      key: 'inspectionType',
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Service provided'],
      ),
      dataIndex: 'serviceProvided',
      key: 'serviceProvided',
      width: 200,
      render: (id, record: any) => (
        <div className="position-relative">
          {listData && listData[0]?.id === record?.id && (
            <div className={styles.customSelectAll}>
              <Checkbox
                value={id}
                disabled={
                  disabled ||
                  viewOnly ||
                  !isEditFile ||
                  userInfo?.roleScope === RoleScope.User
                }
                checked={
                  listData?.length &&
                  listData?.length ===
                    listDataSelected?.filter((i) => i?.serviceProvided)?.length
                }
                onChange={(e) => {
                  handleSelectData('all', 'serviceProvided');
                }}
              />
            </div>
          )}
          <Checkbox
            value={id}
            disabled={
              disabled ||
              viewOnly ||
              !isEditFile ||
              userInfo?.roleScope === RoleScope.User
            }
            checked={
              listDataSelected?.find((i) => i.id === record?.id)
                ?.serviceProvided
            }
            onChange={(e) => {
              handleSelectData(record?.id, 'serviceProvided');
            }}
          />
        </div>
      ),
    },
    {
      title: renderDynamicLabel(
        dynamicLabels,
        USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.Verified,
      ),
      dataIndex: 'isVerified',
      key: 'isVerified',
      width: 200,
      render: (id, record: any) => (
        <div className="position-relative">
          {listData && listData[0]?.id === record?.id && (
            <div className={styles.customSelectAll}>
              <Checkbox
                value={id}
                disabled={disabled || viewOnly || !isEditFile}
                checked={
                  listData?.length &&
                  listData?.length ===
                    listDataSelected?.filter((i) => i?.isVerified)?.length
                }
                onChange={(e) => {
                  handleSelectData('all', 'isVerified');
                }}
              />
            </div>
          )}
          <Checkbox
            value={id}
            disabled={disabled || viewOnly || !isEditFile}
            checked={
              listDataSelected?.find((i) => i.id === record?.id)?.isVerified
            }
            onChange={(e) => {
              handleSelectData(record?.id, 'isVerified');
            }}
          />
        </div>
      ),
    },
  ];

  const dataSource = useMemo(
    () =>
      listData?.map((item, index) => ({
        id: item?.id,
        sNo: index + 1,
        inspectionType: item?.inspectionType?.name || '-',
        serviceProvided: item?.serviceProvided,
        isVerified: item?.isVerified,
      })),
    [listData],
  );

  const closeAndClearData = useCallback(() => {
    onClose();
    selectData([]);
    setSearch('');
    setViewOnly(false);
    setEditFile(false);
  }, [onClose]);

  const onSubmitForm = useCallback(
    (data: any) => {
      const bodyParams = listDataSelected?.map((i) => ({
        id: i.id,
        isVerified: i.isVerified,
        serviceProvided: i.serviceProvided,
      }));
      setLoading(true);
      updateProvidedInspectionApi(
        { updateProvidedInspection: bodyParams },
        id || userDetailResponse?.id,
      )
        .then((res) => {
          toastSuccess(
            renderDynamicLabel(
              dynamicLabels,
              USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS[
                'You have updated successfully'
              ],
            ),
          );
          onSuccess();
          closeAndClearData();
          setLoading(false);
        })
        .catch((err) => {
          toastError(
            err?.message ||
              renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Something went wrong!'],
              ),
          );
          setLoading(false);
        });
    },
    [
      closeAndClearData,
      dynamicLabels,
      id,
      listDataSelected,
      onSuccess,
      userDetailResponse?.id,
    ],
  );

  return (
    <Modal
      className={cx(styles.wrapModal, classesName)}
      modalClassName={cx(styles.modalClassName, modalClassName)}
      contentClassName={cx(styles.contentClassName, contentClassName)}
      isOpen={isOpen}
      {...other}
    >
      <div className={styles.header}>
        <div>
          {renderDynamicLabel(
            dynamicLabels,
            USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Provided inspection'],
          )}
        </div>
        <div className={styles.closeBtn} onClick={closeAndClearData}>
          <img src={images.icons.icClose} alt="ic-close-modal" />
        </div>
      </div>
      <div className={styles.content}>
        <div className={cx(styles.filterWrapper, 'd-flex ')}>
          <Input
            renderPrefix={
              <img
                src={images.icons.menu.icSearchInActive}
                alt="buttonReset"
                className={styles.icon}
              />
            }
            wrapperInput={styles.wrapperInput}
            onKeyUp={(e) => {
              if (e.keyCode === KeyPress.ENTER) {
                handleFilterBySearch();
              }
            }}
            className={styles.inputSearch}
            onChange={(e) => setSearch(String(e.target.value))}
            value={search}
            // label="Search"
            maxLength={128}
            styleLabel={styles.labelFilter}
            placeholder={renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS.Search,
            )}
          />
          <div>
            <Button
              className={styles.buttonFilter}
              onClick={handleFilterBySearch}
              buttonType={ButtonType.Primary}
            >
              {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Search)}
            </Button>
            {/* <Button
              buttonType={ButtonType.OutlineDangerous}
              buttonSize={ButtonSize.Medium}
              className={styles.buttonFilter}
              disabled={!search}
              disabledCss={!search}
              onClick={() => {
                setSearch('');
                setListData(initialData);
              }}
            >
              Clear all
            </Button> */}
          </div>
        </div>
        <div className={styles.scrollVertical}>
          {listData?.length ? (
            <Table
              columns={columns}
              className={cx(styles.tableWrapper)}
              dataSource={dataSource}
              pagination={false}
              scroll={{ x: 'max-content' }}
              rowClassName={styles.rowWrapper}
            />
          ) : (
            <NoDataImg />
          )}
        </div>
        <div className="d-flex justify-content-end align-items-center">
          <Button
            className={styles.btnCancel}
            buttonType={ButtonType.CancelOutline}
            onClick={closeAndClearData}
          >
            {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Cancel)}
          </Button>
          <Button
            buttonType={ButtonType.Primary}
            buttonSize={ButtonSize.Medium}
            disabled={disabled || viewOnly || loading}
            disabledCss={disabled || viewOnly || loading}
            onClick={
              !isEditFile ? () => setEditFile(true) : handleSubmit(onSubmitForm)
            }
          >
            {!isEditFile
              ? renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Edit)
              : renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Save)}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalEditProvided;
