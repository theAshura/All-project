import images from 'assets/images/images';
import cx from 'classnames';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import SelectUI from 'components/ui/select/Select';
import { getListRolesApi } from 'api/role.api';
import { toastError } from 'helpers/notification.helper';
import cloneDeep from 'lodash/cloneDeep';
import { useSelector } from 'react-redux';
import { FC, useCallback, useState, useMemo, useEffect } from 'react';
import { Col, Modal, ModalProps, Row } from 'reactstrap';
import styles from './modal.module.scss';

interface ModalComponentProps extends ModalProps {
  isOpen: boolean;
  onClose: () => void;
  modalClassName?: string;
  contentClassName?: string;
  onSave: (data: any) => void;
  disabled?: boolean;
  selectedItem?: any;
  listCompanySelected?: any;
  parentCompanySelected?: string;
  switchableCompanies?: { label: string; value: string }[];
}

const ModalAddRole: FC<ModalComponentProps> = ({
  isOpen,
  classesName,
  modalClassName,
  contentClassName,
  onClose,
  onSave,
  disabled,
  selectedItem,
  listCompanySelected,
  parentCompanySelected,
  switchableCompanies,
  ...other
}) => {
  // const { listCompany } = useSelector((state) => state.fleet);

  const { userInfo } = useSelector((state) => state.authenticate);
  const [listRoles, setListRoles] = useState<any>([]);
  const [errors, setErrors] = useState<any>(null);
  const [listRoleSelected, setListRoleSelected] = useState<any>([]);
  const [companySelected, setCompanySelected] = useState<any>(null);
  // const [listRoleOptions, setListRoleOptions] = useState([]);
  const closeAndClearData = useCallback(() => {
    setCompanySelected(null);
    setListRoleSelected([]);
    setListRoles([]);
    onClose();
    setErrors(null);
  }, [onClose]);

  useEffect(() => {
    if (selectedItem && isOpen) {
      setCompanySelected(selectedItem?.companyId);
      setListRoleSelected(selectedItem?.listRoles || []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, selectedItem]);

  const isParentCompany = useMemo(() => {
    const company = userInfo?.parentCompanyId || userInfo?.companyId;
    return parentCompanySelected === company;
  }, [parentCompanySelected, userInfo?.companyId, userInfo?.parentCompanyId]);

  useEffect(() => {
    if (companySelected && isOpen) {
      getListRolesApi({
        companyId: companySelected,
        pageSize: -1,
        status: 'active',
      })
        .then((res) => {
          setListRoles(res?.data?.data || []);
        })
        .catch((err) => toastError(err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [companySelected, isOpen]);

  // useEffect(() => {
  //   if (parentCompanySelected && isOpen && !selectedItem) {
  //     const existCompanyInList = listCompanySelected?.find(
  //       (i) => i.companyId === parentCompanySelected,
  //     );
  //     if (!existCompanyInList) {
  //       setCompanySelected(parentCompanySelected);
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [isOpen]);

  const handleSelectRole = useCallback(
    (role) => {
      const result = cloneDeep(listRoleSelected);
      if (result?.some((i) => i?.id === role?.id)) {
        const filtered = result?.filter((i) => i?.id !== role?.id);
        setListRoleSelected(filtered);
        return;
      }
      result.push(role);
      setListRoleSelected(result);
    },
    [listRoleSelected],
  );

  const companyOptions = useMemo(() => {
    if (isParentCompany) {
      return switchableCompanies?.length ? switchableCompanies : [];
    }
    const companyChildSelected = switchableCompanies?.find(
      (i) => i?.label === parentCompanySelected,
    );

    return companyChildSelected?.value ? [companyChildSelected] : [];
  }, [isParentCompany, parentCompanySelected, switchableCompanies]);

  const handleSaveData = useCallback(() => {
    const errorsMes: any = {};
    if (!companySelected) {
      errorsMes.company = 'This field is required';
    }
    if (!listRoleSelected?.length) {
      errorsMes.role = 'This field is required';
    }
    if (Object?.keys(errorsMes)?.length) {
      setErrors(errorsMes);
      return;
    }

    const companyFullSelected = companyOptions?.find(
      (i) => i.value === companySelected,
    );
    if (!selectedItem) {
      const newList = cloneDeep(listCompanySelected);
      newList?.push({
        company: {
          id: companyFullSelected?.value,
          name: companyFullSelected?.label,
        },
        companyId: companyFullSelected?.value,
        createdAt: '',
        description: '',
        id: companyFullSelected?.value,
        listRoles: listRoleSelected,
        roles: listRoleSelected,
      });
      closeAndClearData();
      onSave(newList);
      return;
    }
    const updateList = listCompanySelected?.map((item) => {
      if (item?.companyId === selectedItem?.key) {
        return {
          ...item,
          company: {
            id: companyFullSelected?.value,
            name: companyFullSelected?.label,
          },
          companyId: companyFullSelected?.value,
          listRoles: listRoleSelected,
          roles: listRoleSelected,
        };
      }
      return item;
    });

    onSave(updateList);
    closeAndClearData();
  }, [
    closeAndClearData,
    companyOptions,
    companySelected,
    listCompanySelected,
    listRoleSelected,
    onSave,
    selectedItem,
  ]);

  return (
    <Modal
      className={cx(styles.wrapModal, classesName)}
      modalClassName={cx(styles.modalClassName, modalClassName)}
      contentClassName={cx(styles.contentClassName, contentClassName)}
      isOpen={isOpen}
      {...other}
    >
      <div className={styles.header}>
        <div>Add role</div>
        <div className={styles.closeBtn} onClick={closeAndClearData}>
          <img src={images.icons.icClose} alt="ic-close-modal" />
        </div>
      </div>
      <div className={styles.content}>
        <Row>
          <Col xs={6}>
            <SelectUI
              disabled={disabled}
              // control={control}
              value={companySelected}
              name="company"
              messageRequired={errors?.company}
              labelSelect="Company"
              placeholder={disabled ? ' ' : 'Please select'}
              onChange={(e) => {
                setErrors((prev) => ({
                  ...prev,
                  company: '',
                }));
                setCompanySelected(e);
                setListRoleSelected([]);
              }}
              isRequired
              className="w-100"
              data={
                companyOptions?.filter(
                  (item) =>
                    !listCompanySelected?.some(
                      (i) => i?.companyId === item?.value,
                    ) || selectedItem?.companyId === item.value,
                ) || []
              }
            />
          </Col>
          <Col xs={12}>
            <div className={styles.roleAndPermission}>
              <div className={cx('d-flex', styles.selectedRole)}>
                <div>
                  <div className={styles.titleSelectRole}>Selected Role:</div>
                </div>

                <div className="flex-grow-1 d-flex flex-wrap mb-2">
                  {listRoleSelected?.map((item) => (
                    <Button
                      className="ms-3 mt-2"
                      key={item?.value}
                      onClick={() => {
                        handleSelectRole(item);
                        setErrors((prev) => ({
                          ...prev,
                          role: '',
                        }));
                      }}
                      size={ButtonSize.XSmall}
                      renderSuffix={
                        <img
                          src={images.icons.icX}
                          className={styles.icXResult}
                          alt="result"
                        />
                      }
                    >
                      {item?.name}
                    </Button>
                  ))}
                </div>
                {listRoleSelected?.length ? (
                  <Button
                    onClick={() => {
                      setListRoleSelected([]);
                    }}
                    className={cx('ms-3 mt-2', styles.btnClearAll)}
                    size={ButtonSize.XSmall}
                    buttonType={ButtonType.Dangerous}
                    renderSuffix={<img src={images.icons.icX} alt="result" />}
                  >
                    Clear all
                  </Button>
                ) : null}
              </div>

              <div className={cx('d-flex mt-2', styles.wrapRole)}>
                <div className="d-flex position-relative">
                  <div className={styles.titleRole}>Role and Permission</div>
                </div>

                <div>
                  {listRoles
                    ?.filter(
                      (item) =>
                        !listRoleSelected?.some((i) => item?.id === i?.id),
                    )
                    ?.map((item) => (
                      <Button
                        className="ms-3 mb-3"
                        key={item?.id}
                        disabled={false}
                        onClick={() => handleSelectRole(item)}
                        buttonType={ButtonType.Outline}
                        size={ButtonSize.XSmall}
                      >
                        {item?.name}
                      </Button>
                    ))}
                </div>
              </div>
              {errors?.role && (
                <div className={styles.errorLine}>{errors?.role}</div>
              )}
            </div>
          </Col>
        </Row>
        <div className="d-flex justify-content-end">
          <Button
            buttonSize={ButtonSize.Medium}
            buttonType={ButtonType.CancelOutline}
            onClick={closeAndClearData}
          >
            Cancel
          </Button>
          <Button
            className={styles.saveBtn}
            buttonSize={ButtonSize.Medium}
            buttonType={ButtonType.Primary}
            onClick={handleSaveData}
          >
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalAddRole;
