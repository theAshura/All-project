import images from 'assets/images/images';
import cx from 'classnames';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import NoDataImg from 'components/common/no-data/NoData';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import { getListTemplateActions } from 'store/template/template.action';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import Input from 'components/ui/input/Input';
import { useSelector, useDispatch } from 'react-redux';
import { KeyPress } from 'constants/common.const';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { getListCompanyActions } from 'store/fleet/fleet.action';
import { I18nNamespace } from 'constants/i18n.const';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import {
  DEFAULT_COL_DEF_TYPE_FLEX,
  MODULE_TEMPLATE,
} from 'constants/components/ag-grid.const';
import {
  ActionTypeEnum,
  FIXED_ROLE_NAME,
} from 'constants/roleAndPermission.const';
import { AppRouteConst } from 'constants/route.const';
import { Action, CommonApiParam } from 'models/common.model';
import {
  FC,
  useCallback,
  useMemo,
  useState,
  useContext,
  useEffect,
} from 'react';
import { StatusPage, UserContext } from 'contexts/user/UserContext';
// import { useDispatch } from 'react-redux';
import styles from './role-and-permission.module.scss';
import ModalAddRole from '../modal/ModalAddRole';

interface Props {
  onSubmit?: (
    data: any,
    keepCurrentPage?: boolean,
    tab?: string,
    existInspector?: boolean,
  ) => void;
  modalAddRoleVisible?: boolean;
  setModalAddRoleVisible?: (toggle?: boolean) => void;
}

const RoleAndPermissionWithAdmin: FC<Props> = ({
  onSubmit,
  modalAddRoleVisible,
  setModalAddRoleVisible,
}) => {
  const { t } = useTranslation([
    I18nNamespace.PLANNING_AND_REQUEST,
    I18nNamespace.COMMON,
  ]);

  const { watch, setValue, clearErrors } = useFormContext();
  const watchForm = watch();
  const watchCompany = watch('accountInformation.parentCompanyId');
  const switchableCompanies = watch('switchableCompanies');

  const [search, setSearch] = useState<string>('');
  const {
    statusPage,
    listRoleAndPermissionAdmin,
    setListRoleAndPermissionAdmin,
  } = useContext(UserContext);
  const dispatch = useDispatch();
  const { userDetailResponse, loading } = useSelector((state) => state.user);
  const { userInfo } = useSelector((state) => state.authenticate);
  const { listCompany } = useSelector((state) => state.fleet);
  const [listData, setListData] = useState([]);

  const [selectedItem, setSelectedItem] = useState(null);
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

  useEffect(() => {
    dispatch(
      getListCompanyActions.request({
        page: 1,
        pageSize: -1,
        status: 'active',
      }),
    );
  }, [dispatch]);

  const handleSaveData = useCallback(
    (data) => {
      let existInspector = false;
      const listRoles = [];
      data?.forEach((item) => {
        if (item?.roles?.length) {
          item?.roles?.forEach((i) => {
            if (i.name === FIXED_ROLE_NAME.INSPECTOR) {
              existInspector = true;
            }
            listRoles.push(i?.id);
          });
        }
      });
      clearErrors('roles');
      setValue('roles', listRoles);
      onSubmit(
        {
          ...watchForm,
          roles: listRoles,
        },
        true,
        'roleAndPermissionAdmin',
        existInspector,
      );
    },
    [clearErrors, onSubmit, setValue, watchForm],
  );

  const isDisabled = useMemo(
    () => statusPage === StatusPage.VIEW,
    [statusPage],
  );

  const companyList = useMemo(
    () => listCompany?.data?.concat(userInfo?.company),
    [listCompany?.data, userInfo?.company],
  );

  const handleSearch = useCallback(() => {
    const result = listRoleAndPermissionAdmin?.filter(
      (i) =>
        i?.company?.name?.includes(search) ||
        i?.roles?.join('')?.includes(search),
    );
    setListData(result);
  }, [listRoleAndPermissionAdmin, search]);

  const getList = useCallback(() => {
    let listCompanyWithRoles = [];

    userDetailResponse?.roles?.forEach((role) => {
      const companyChecked = listCompanyWithRoles?.find(
        (i) => i?.companyId === role?.companyId,
      );

      if (companyChecked) {
        listCompanyWithRoles = listCompanyWithRoles.map((i) => {
          if (i?.companyId === companyChecked?.companyId) {
            return {
              ...i,
              roles: companyChecked?.roles?.concat(role),
            };
          }
          return i;
        });
      } else {
        const companySelected = companyList?.find(
          (company) => company?.id === role?.companyId,
        );

        listCompanyWithRoles.push({
          ...role,
          company: companySelected,
          roles: [role],
        });
      }
    });

    setListRoleAndPermissionAdmin(listCompanyWithRoles);
    setListData(listCompanyWithRoles);
  }, [companyList, setListRoleAndPermissionAdmin, userDetailResponse?.roles]);

  useEffect(() => {
    if (userDetailResponse?.roles) {
      getList();
      dispatch(
        getListTemplateActions.request({
          content: MODULE_TEMPLATE.roleAndPermissionTemplate,
        }),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetailResponse, getList]);

  const dataSource = useMemo(
    () =>
      listData?.map((item) => ({
        key: item?.company?.id,
        company: item?.company?.name,
        companyId: item?.company?.id,
        listRoles: item?.roles,
        roles: item?.roles?.map((i) => i?.name)?.join(', '),
      })) || [],
    [listData],
  );

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: 'Action',
        filter: false,
        enableRowGroup: false,
        sortable: false,
        lockPosition: true,
        minWidth: 125,
        maxWidth: 125,
        pinned: 'left',
        cellRendererFramework: (params) => {
          const { data } = params;
          let actions: Action[] = [
            {
              img: images.icons.icEdit,
              function: () => {
                setModalAddRoleVisible(true);
                setSelectedItem(data);
              },
              // feature: featurePage,
              // subFeature: subFeaturePage,
              disableFeatureChecking: true,
              action: ActionTypeEnum.EXECUTE,
              cssClass: 'me-1',
              disable: isDisabled,
            },
            {
              img: images.icons.icRemove,
              function: () => {
                showConfirmBase({
                  isDelete: true,
                  txTitle: t('modal.delete'),
                  txMsg: t('modal.areYouSureYouWantToDelete'),
                  onPressButtonRight: () => {
                    const dataDeleted = listRoleAndPermissionAdmin?.filter(
                      (i) => i.companyId !== data?.companyId,
                    );
                    // setListData(dataDeleted);
                    // setListRoleAndPermissionAdmin(dataDeleted);
                    handleSaveData(dataDeleted);
                  },
                });
              },
              // feature: featurePage,
              // subFeature: subFeaturePage,
              disableFeatureChecking: true,
              action: ActionTypeEnum.EXECUTE,
              buttonType: ButtonType.Orange,
              cssClass: 'me-1',
              disable: isDisabled,
            },
          ];
          if (!data) {
            actions = [];
          }
          return (
            <div
              className={cx(
                'd-flex justify-content-start align-items-center',
                styles.subAction,
              )}
            >
              <ActionBuilder actionList={actions} />
            </div>
          );
        },
      },
      {
        field: 'company',
        headerName: 'Company',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'roles',
        headerName: 'Role and permission',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [
      handleSaveData,
      isDisabled,
      isMultiColumnFilter,
      listRoleAndPermissionAdmin,
      setModalAddRoleVisible,
      t,
    ],
  );

  return (
    <div className={styles.wrap}>
      {/* <Button
        disabled={loading || isDisabled}
        disabledCss={loading || isDisabled}
        onClick={() => setModalAddRoleVisible(true)}
        buttonSize={ButtonSize.Medium}
        buttonType={ButtonType.Primary}
        className={cx('mt-auto ', styles.buttonAddRole)}
        renderSuffix={
          <img
            src={images.icons.icAddCircle}
            alt="createNew"
            className={styles.icButton}
          />
        }
      >
        Add Role
      </Button> */}
      <div className={cx(styles.wrapSearch)}>
        <Input
          label="Search"
          placeholder="Search"
          renderPrefix={
            <img src={images.icons.menu.icSearchInActive} alt="buttonReset" />
          }
          autoFocus
          value={search}
          onKeyUp={(e) => {
            if (e.keyCode === KeyPress.ENTER) {
              handleSearch();
            }
          }}
          onChange={(e) => {
            setSearch(e.target.value);
          }}
          className={styles.searchInput}
          wrapperInput="w-100"
        />
        <Button
          className={styles.btnSearch}
          buttonSize={ButtonSize.Medium}
          buttonType={ButtonType.Outline}
          onClick={handleSearch}
        >
          Search
        </Button>
        <Button
          onClick={() => {
            setSearch('');
            setListData(listRoleAndPermissionAdmin);
          }}
          buttonType={ButtonType.OutlineDangerous}
          buttonSize={ButtonSize.Medium}
          className={styles.btnClear}
          disabledCss={!search}
          disabled={!search}
        >
          Clear all
        </Button>
      </div>
      <div>
        {dataSource?.length ? (
          <AGGridModule
            loading={loading}
            params={null}
            setIsMultiColumnFilter={setIsMultiColumnFilter}
            hasRangePicker={false}
            columnDefs={columnDefs}
            dataFilter={null}
            moduleTemplate={MODULE_TEMPLATE.roleAndPermissionTemplate}
            fileName="Inspection history"
            dataTable={dataSource}
            height="500px"
            colDefProp={DEFAULT_COL_DEF_TYPE_FLEX}
            view={(params?: CommonApiParam) => {
              const win = window.open(
                AppRouteConst.getPlanningAndRequestById(params.id),
                '_blank',
              );
              win.focus();
              return true;
            }}
            getList={getList}
          />
        ) : (
          <NoDataImg />
        )}
      </div>

      <ModalAddRole
        isOpen={modalAddRoleVisible}
        selectedItem={selectedItem}
        listCompanySelected={listData}
        parentCompanySelected={watchCompany}
        switchableCompanies={switchableCompanies}
        onClose={() => {
          setModalAddRoleVisible(false);
          setSelectedItem(null);
        }}
        onSave={(data) => {
          setSearch('');
          setSelectedItem(null);
          setListRoleAndPermissionAdmin(data);
          setListData(data);
          setModalAddRoleVisible(false);
          handleSaveData(data);
        }}
      />
    </div>
  );
};

export default RoleAndPermissionWithAdmin;
