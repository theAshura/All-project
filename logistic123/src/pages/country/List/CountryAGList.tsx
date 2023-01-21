import {
  memo,
  useMemo,
  useState,
  useCallback,
  Dispatch,
  SetStateAction,
  FC,
} from 'react';
import { useTranslation } from 'react-i18next';

import images from 'assets/images/images';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import moment from 'moment-timezone';
import { ButtonType } from 'components/ui/button/Button';
import {
  DEFAULT_COL_DEF,
  MODULE_TEMPLATE,
} from 'constants/components/ag-grid.const';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { useDispatch, useSelector } from 'react-redux';
import { Action, CommonApiParam } from 'models/common.model';
import { getListCountryMasterActions } from 'store/country-master/country-master.action';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import { I18nNamespace } from 'constants/i18n.const';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import CountryModal from '../Modal/CountryModal';
import { CountryAGTimeFormat, DISABLE } from '../country.constants';

interface CountryAGListProps {
  isOpenModal: boolean;
  setIsOpenModal: Dispatch<SetStateAction<boolean>>;
}

const CountryAGList: FC<CountryAGListProps> = ({
  isOpenModal,
  setIsOpenModal,
}) => {
  const dispatch = useDispatch();
  const { listCountryMaster, loading } = useSelector(
    (globalState) => globalState.countryMaster,
  );
  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const { t } = useTranslation([
    I18nNamespace.ATTACHMENT_KIT,
    I18nNamespace.COMMON,
    I18nNamespace.GROUP,
  ]);
  const [isView, setIsView] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);

  const handleGetList = useCallback(
    (_params?: CommonApiParam) => {
      dispatch(getListCountryMasterActions.request({ pageSize: -1 }));
    },
    [dispatch],
  );

  const handleOnModalAction = useCallback(
    (action: 'view' | 'edit', country?: any) => {
      setIsOpenModal(true);
      setSelectedCountry(country || null);

      if (action === 'view') {
        setIsView(true);
        return null;
      }

      setIsView(false);
      return null;
    },
    [setIsOpenModal],
  );

  const handleClearData = useCallback(() => {
    setSelectedCountry(null);
  }, []);

  const handleOnCloseModal = useCallback(() => {
    setIsOpenModal(false);
    setSelectedCountry(null);
    setIsView(false);
  }, [setIsOpenModal]);

  const handleDeleteCountryMaster = useCallback((_id?: string) => {
    //
  }, []);

  const handleDelete = useCallback(
    (id?: string) => {
      showConfirmBase({
        isDelete: true,
        txTitle: t('modal.delete'),
        txMsg: t('modal.areYouSureYouWantToDelete'),
        onPressButtonRight: () => handleDeleteCountryMaster(id),
      });
    },
    [handleDeleteCountryMaster, t],
  );

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: t('buttons.txAction'),
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
              buttonType: ButtonType.Blue,
              // TODO: Fix this to match the feature
              feature: Features.USER_ROLE,
              subFeature: SubFeatures.USER,
              // TODO: End
              action: ActionTypeEnum.VIEW,
              cssClass: 'me-1',
              function: () => handleOnModalAction('view', data),
            },
            !DISABLE && {
              img: images.icons.icEdit,
              feature: Features.USER_ROLE,
              subFeature: SubFeatures.USER,
              action: ActionTypeEnum.UPDATE,
              function: () => handleOnModalAction('edit', data),
            },
            !DISABLE && {
              img: images.icons.icRemove,
              feature: Features.USER_ROLE,
              subFeature: SubFeatures.USER,
              action: ActionTypeEnum.DELETE,
              buttonType: ButtonType.Orange,
              cssClass: 'ms-1',
              function: () => handleDelete(data?.id),
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
        headerName: 'ISO alpha-2 code',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'code3',
        headerName: 'ISO alpha-3 code',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'name',
        headerName: 'Country Name',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'nationality',
        headerName: 'Nationality',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'dialCode',
        headerName: 'Dial code',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'status',
        headerName: 'Status',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
        cellRenderer: 'cellRenderStatus',
      },
      {
        field: 'createdAt',
        headerName: 'Created date',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'updatedAt',
        headerName: 'Updated date',
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [t, isMultiColumnFilter, handleOnModalAction, handleDelete],
  );

  const dataTable = useMemo(() => {
    if (!listCountryMaster) {
      return [];
    }

    return listCountryMaster.data.map((country) => ({
      ...country,
      updatedAt: moment(country?.updatedAt).format(CountryAGTimeFormat) || '',
      createdAt: moment(country?.createdAt).format(CountryAGTimeFormat) || '',
    }));
  }, [listCountryMaster]);

  return (
    <div className="mt-3">
      <AGGridModule
        loading={loading}
        params={null}
        colDefProp={DEFAULT_COL_DEF}
        hasRangePicker={false}
        dataFilter={null}
        columnDefs={columnDefs}
        moduleTemplate={MODULE_TEMPLATE.countryAGList}
        fileName={t('sidebar.country')}
        dataTable={dataTable}
        height="calc(100vh - 230px)"
        getList={handleGetList}
        setIsMultiColumnFilter={setIsMultiColumnFilter}
        pageSizeDefault={10}
      />

      <CountryModal
        isOpen={isOpenModal}
        countrySelected={selectedCountry}
        handleGetList={handleGetList}
        viewMode={isView}
        clearData={handleClearData}
        onClose={handleOnCloseModal}
      />
    </div>
  );
};

export default memo(CountryAGList);
