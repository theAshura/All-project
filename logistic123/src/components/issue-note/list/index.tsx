import images from 'assets/images/images';
import HeaderPage from 'components/common/header-page/HeaderPage';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';

import { I18nNamespace } from 'constants/i18n.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { handleFilterParams } from 'helpers/filterParams.helper';
import { dateStringComparator, formatDateTime } from 'helpers/utils.helper';
import PermissionCheck from 'hoc/withPermissionCheck';
import { IssueNote } from 'models/api/issue-note/issue-note.model';
import { Action, CommonApiParam } from 'models/common.model';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import {
  createIssueNoteActions,
  deleteIssueNoteActions,
  getListIssueNoteActions,
  updateIssueNoteActions,
} from 'store/issue-note/issue-note.action';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import styles from '../../list-common.module.scss';
import ModalIssueNote from '../common/ModalIssueNote';

const IssueNoteContainer = () => {
  const { t } = useTranslation([
    I18nNamespace.ISSUE_NOTE,
    I18nNamespace.COMMON,
  ]);

  const dispatch = useDispatch();
  const { loading, listIssues, params } = useSelector(
    (state) => state.issueNote,
  );
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);

  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [isCreate, setIsCreate] = useState<boolean>(false);
  const [isView, setIsView] = useState<boolean>(false);
  const [selectedData, setSelectedData] = useState<IssueNote>(undefined);

  const handleGetList = useCallback(
    (params?: CommonApiParam) => {
      const { createdAtFrom, createdAtTo, ...newParams } =
        handleFilterParams(params);
      dispatch(
        getListIssueNoteActions.request({
          ...newParams,
          pageSize: -1,
          isLeftMenu: false,
        }),
      );
    },
    [dispatch],
  );

  const handleDeleteFn = useCallback(
    (id: string) => {
      dispatch(
        deleteIssueNoteActions.request({
          id,
          getListIssue: () => {
            handleGetList();
          },
        }),
      );
    },
    [dispatch, handleGetList],
  );

  const handleDelete = useCallback(
    (id: string) => {
      showConfirmBase({
        isDelete: true,
        txTitle: t('modal.delete'),
        txMsg: t('modal.areYouSureYouWantToDelete'),
        onPressButtonRight: () => handleDeleteFn(id),
      });
    },
    [handleDeleteFn, t],
  );

  const dataTable = useMemo(() => {
    if (!listIssues?.data) {
      return [];
    }
    return listIssues?.data?.map((data) => ({
      id: data.id,
      code: data?.code || '',
      name: data?.name || '',
      sectionType: data?.modules?.join(', ') || '',
      modules: data?.modules || '',
      description: data?.description || '',
      createdAt: formatDateTime(data?.createdAt) || '',
      createdUser: data.createdUser?.username || '',
      updatedAt:
        (data.updatedUser?.username && formatDateTime(data?.updatedAt)) || '',
      updatedUser: data.updatedUser?.username || '',
      status: data.status || '',
      company: data?.company?.name || '',
      companyId: data?.company?.id || '',
    }));
  }, [listIssues?.data]);

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: t('fieldTable.action'),
        filter: false,
        sortable: false,
        enableRowGroup: false,
        lockPosition: true,
        maxWidth: 125,
        pinned: 'left',
        cellRendererFramework: ({ data }: { data: any }) => {
          const actions: Action[] = [
            {
              img: images.icons.icViewDetail,
              function: () => {
                setVisibleModal(true);
                setIsCreate(false);
                setSelectedData(data);
                setIsView(true);
              },
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.ISSUE_NOTE,
              action: ActionTypeEnum.VIEW,
              buttonType: ButtonType.Blue,
              cssClass: 'me-1',
            },
            {
              img: images.icons.icEdit,
              function: () => {
                setVisibleModal(true);
                setIsCreate(false);
                setSelectedData(data);
              },
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.ISSUE_NOTE,
              action: ActionTypeEnum.UPDATE,
            },
            {
              img: images.icons.icRemove,
              function: () => handleDelete(data?.id),
              feature: Features.CONFIGURATION,
              subFeature: SubFeatures.ISSUE_NOTE,
              action: ActionTypeEnum.DELETE,
              buttonType: ButtonType.Orange,
              cssClass: 'ms-1',
            },
          ];
          return (
            <div className="d-flex justify-content-start align-items-center">
              <ActionBuilder actionList={data ? actions : []} />
            </div>
          );
        },
      },
      {
        field: 'code',
        headerName: t('code'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'name',
        headerName: t('name'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'sectionType',
        headerName: t('sectionType'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'description',
        headerName: t('description'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'createdAt',
        headerName: t('createdDate'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
      {
        field: 'createdUser',
        headerName: t('createdUser'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'updatedAt',
        headerName: t('updatedDate'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        comparator: dateStringComparator,
      },
      {
        field: 'updatedUser',
        headerName: t('updatedUser'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'status',
        headerName: t('status'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'company',
        headerName: t('fieldTable.company'),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [t, isMultiColumnFilter, handleDelete],
  );

  const onSubmitForm = (formData) => {
    if (isCreate) {
      const { isNew, resetForm, ...other } = formData;
      dispatch(
        createIssueNoteActions.request({
          ...other,
          afterCreate: () => {
            resetForm();

            if (!isNew) {
              setVisibleModal((e) => !e);
              setIsCreate(false);
            }
          },
        }),
      );
    } else {
      const { isNew, resetForm, ...other } = formData;
      dispatch(
        updateIssueNoteActions.request({
          id: selectedData?.id,
          data: other,
          afterUpdate: () => {
            if (isNew) {
              resetForm();

              setIsCreate(true);
              handleGetList();
              return;
            }
            setVisibleModal((e) => !e);
            setIsCreate(false);
            handleGetList();
          },
        }),
      );
    }
  };

  return (
    <div className={styles.wrapper}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.ISSUE_NOTE}
        titlePage={t('headPageTitle')}
      >
        <PermissionCheck
          options={{
            feature: Features.CONFIGURATION,
            // [DuongDT]
            subFeature: SubFeatures.ISSUE_NOTE,
            action: ActionTypeEnum.CREATE,
          }}
        >
          {({ hasPermission }) =>
            hasPermission && (
              <Button
                onClick={() => {
                  setVisibleModal(true);
                  setIsCreate(true);
                  setSelectedData(undefined);
                }}
                buttonSize={ButtonSize.Medium}
                className="button_create"
                renderSuffix={
                  <img
                    src={images.icons.icAddCircle}
                    alt="createNew"
                    className={styles.icButton}
                  />
                }
              >
                {t('createNew')}
              </Button>
            )
          }
        </PermissionCheck>
      </HeaderPage>

      <AGGridModule
        loading={loading}
        params={params}
        setIsMultiColumnFilter={setIsMultiColumnFilter}
        hasRangePicker={false}
        columnDefs={columnDefs}
        dataFilter={null}
        moduleTemplate={MODULE_TEMPLATE.issueNote}
        fileName="Issue Note"
        dataTable={dataTable}
        height="calc(100vh - 137px)"
        getList={handleGetList}
        classNameHeader={styles.header}
      />

      <ModalIssueNote
        title={t('generalInformation')}
        isOpen={visibleModal}
        loading={loading}
        toggle={() => {
          setVisibleModal((e) => !e);
          setSelectedData(undefined);
          setIsCreate(undefined);
          setIsView(false);
        }}
        isCreate={isCreate}
        isView={isView}
        handleSubmitForm={onSubmitForm}
        data={selectedData}
        setIsCreate={(value) => setIsCreate(value)}
      />
    </div>
  );
};

export default IssueNoteContainer;
