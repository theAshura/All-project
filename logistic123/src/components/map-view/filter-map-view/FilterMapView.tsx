import { FC, useMemo, useState, useCallback, useEffect } from 'react';
import cx from 'classnames';
import Tabs from 'antd/lib/tabs';
import AsyncSelectResultForm from 'components/react-hook-form/async-select/AsyncSelectResultForm';
import images from 'assets/images/images';
import moment from 'moment';
import { Col, Row } from 'reactstrap';
import SelectUI from 'components/ui/select/Select';
import { NewAsyncOptions } from 'components/ui/async-select/NewAsyncSelect';
import { useDispatch, useSelector } from 'react-redux';
import { getCountryActions } from 'store/user/user.action';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import DatePicker from 'antd/lib/date-picker';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { MAP_VIEW_DYNAMIC_FIELDS } from 'constants/dynamic/map-view.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { toastError } from 'helpers/notification.helper';
// import { getListCompanyActions } from 'store/fleet/fleet.action';
import { getListChildCompanyApi } from 'api/company.api';
import * as yup from 'yup';
// import { I18nNamespace } from 'constants/i18n.const';
import { GetListInspectionInspector } from 'pages/map-view/utils/model';
import { CompanyLevelEnum } from 'constants/common.const';
import { formatDateIso } from 'helpers/date.helper';
import ToggleSwitch from 'components/ui/toggle-switch/ToggleSwitch';
import Button, { ButtonType } from 'components/ui/button/Button';
import {
  getListMapViewInspectionActions,
  getListMapViewInspectorActions,
} from 'pages/map-view/store/action';
import {
  MAP_VIEW_TABS,
  PLANNING_TYPE_OPTIONS,
  AVAILABILITY_OPTIONS,
  ENTITY_TYPE_OPTIONS,
} from './filter.const';
import classes from './filter-map-view.module.scss';
import './filter-map.scss';
import {
  getListAuditorsInCompanies,
  getListMapViewPort,
  getListPrAuditorsInCompanies,
} from '../../../pages/map-view/utils/api';

const { RangePicker } = DatePicker;

const { TabPane } = Tabs;

interface Props {
  toggle: () => void;
  isOpen?: boolean;
  onSearch: (params?: GetListInspectionInspector) => void;
  activeTab: string;
  setActiveTab: (value: string) => void;
  clearData?: () => void;
}

enum EntityChangedField {
  ALL = 'All',
  VESSEL = 'Vessel',
  OFFICE = 'Office',
}

const FilterMapView: FC<Props> = ({
  toggle,
  isOpen,
  activeTab,
  setActiveTab,
  onSearch,
  clearData,
}) => {
  // const { listCompany } = useSelector((state) => state.fleet);
  const { listCountry } = useSelector((state) => state.user);
  const { userInfo } = useSelector((state) => state.authenticate);
  const [listInspector, setListInspector] = useState<any>([]);
  const [listCompany, setListCompany] = useState<any>([]);
  const [listPort, setListPort] = useState<any>([]);
  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.AuditInspectionMapView,
    modulePage: ModulePage.View,
  });

  const isCompanyLevelInExternalInternal = useMemo(() => {
    if (
      userInfo?.companyLevel === CompanyLevelEnum.EXTERNAL_COMPANY ||
      userInfo?.companyLevel === CompanyLevelEnum.INTERNAL_COMPANY
    ) {
      return true;
    }
    return false;
  }, [userInfo?.companyLevel]);

  const defaultValues = useMemo(
    () => ({
      inspector: {
        availability: null,
        dateTime: null,
        byCountry: false,
        byPort: false,
        searchAvailability: 'All',
        baseLocation: true,
        includeServiceArea: true,
        auditorIds: null,
        companyId: [
          {
            value: userInfo?.mainCompany?.id,
            label: userInfo?.mainCompany?.name,
          },
        ],
      },
      inspection: {
        availability: null,
        dateTime: null,
        byCountry: false,
        byPort: false,
        entityVessel: true,
        entityOffice: true,
        entityType: 'All',
        planningType: 'All',
        auditorIds: null,
        companyId: [
          {
            value: userInfo?.company?.id,
            label: userInfo?.company?.name,
          },
        ],
      },
    }),
    [
      userInfo?.mainCompany?.id,
      userInfo?.mainCompany?.name,
      userInfo?.company?.id,
      userInfo?.company?.name,
    ],
  );

  const schema = yup.object().shape({
    inspector: yup.object().shape({
      // baseLocation: yup.string().nullable().required('This field is required'),
    }),
    inspection: yup.object().shape({
      // lol: yup.string().nullable().required('This field is required'),
    }),
  });

  const {
    watch,
    // register,
    control,
    handleSubmit,
    // setError,
    setValue,
    getValues,
    reset,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(schema),
  });
  const dispatch = useDispatch();
  const dateTimeInspectorWatch = watch('inspector.dateTime');
  const dateTimeInspectionWatch = watch('inspection.dateTime');
  const byCountryWatch = watch('inspector.byCountry');
  const byPortWatch = watch('inspector.byPort');
  const byCountryInspectionWatch = watch('inspection.byCountry');
  const byPortInspectionWatch = watch('inspection.byPort');
  const baseLocationWatch = watch('inspector.baseLocation');
  const includeServiceAreaWatch = watch('inspector.includeServiceArea');
  const watchChildCompanyInspector = watch('inspector.companyId');
  const watchCountryInspector = watch('inspector.country');
  const watchChildCompanyInspection = watch('inspection.companyId');
  const watchCountryInspection = watch('inspector.country');
  const watchInspectionPlanningType = watch('inspection.planningType');
  const watchEntityType = watch('inspection.entityType');

  const handleListChildCompany = useCallback(
    (value?: string) => {
      getListChildCompanyApi({
        companyId: userInfo?.mainCompanyId,
        status: 'active',
        content: value || '',
      })
        .then((res) => {
          setListCompany(
            [
              {
                name: userInfo?.mainCompany?.name,
                id: userInfo?.mainCompany?.id,
              },
            ]
              ?.concat(res?.data || [])
              ?.filter((item) => item?.name?.includes(value)),
          );
          if (activeTab === MAP_VIEW_TABS.INSPECTION) {
            setValue('inspection.portIds', []);
          } else {
            setValue('inspector.portIds', []);
          }
        })
        .catch((err) => toastError(err));
    },
    [
      activeTab,
      setValue,
      userInfo?.mainCompany?.id,
      userInfo?.mainCompany?.name,
      userInfo?.mainCompanyId,
    ],
  );

  const handleGetViewPort = useCallback(
    (search?: string) => {
      const params =
        activeTab === MAP_VIEW_TABS.INSPECTION
          ? {
              page: 1,
              pageSize: -1,
              childCompanyIds: watchChildCompanyInspection?.length
                ? watchChildCompanyInspection?.map((item) => item?.value)
                : null,
              countryNames: watchCountryInspection?.length
                ? watchCountryInspection?.map((item) => item?.value)
                : null,
              content: search || '',
            }
          : {
              page: 1,
              pageSize: -1,
              childCompanyIds: watchChildCompanyInspector?.length
                ? watchChildCompanyInspector?.map((item) => item?.value)
                : null,
              countryNames: watchCountryInspector?.length
                ? watchCountryInspector?.map((item) => item?.value)
                : null,
              baseLocation: baseLocationWatch || false,
              includeServiceArea: includeServiceAreaWatch || false,
              content: search || '',
            };
      getListMapViewPort(params)
        .then((res: any) => {
          setListPort(res?.data?.data || []);
          // setValue('inspector.portIds', null);
          // setValue('inspection.portIds', null);
        })
        .catch((err) => toastError(err));
    },
    [
      activeTab,
      baseLocationWatch,
      includeServiceAreaWatch,
      watchChildCompanyInspection,
      watchChildCompanyInspector,
      watchCountryInspection,
      watchCountryInspector,
    ],
  );

  // useEffect(() => {
  //   handleGetViewPort();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [
  //   activeTab,
  //   watchChildCompanyInspection,
  //   watchChildCompanyInspector,
  //   watchCountryInspection,
  //   watchCountryInspector,
  // ]);

  useEffect(() => {
    dispatch(getCountryActions.request({ content: '' }));
    handleListChildCompany();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    setValue('inspector.dateTime', [moment().subtract(3, 'months'), moment()]);
    setValue('inspection.dateTime', [moment().subtract(3, 'months'), moment()]);
  }, [setValue]);

  const getListAuditorInCompanies = useCallback(
    (value?: string) => {
      const portIds =
        activeTab === MAP_VIEW_TABS.INSPECTION
          ? getValues('inspection.portIds')
          : getValues('inspector.portIds');
      const country =
        activeTab === MAP_VIEW_TABS.INSPECTION
          ? getValues('inspection.country')
          : getValues('inspector.country');
      const companyId =
        activeTab === MAP_VIEW_TABS.INSPECTION
          ? getValues('inspection.companyId')
          : getValues('inspector.companyId');
      const existPortOrCountry = portIds?.length || country?.length;

      if (activeTab === MAP_VIEW_TABS.INSPECTION || existPortOrCountry) {
        getListPrAuditorsInCompanies({
          portIds: portIds?.length ? portIds?.map((item) => item?.value) : null,
          countryNames: country?.length
            ? country?.map((item) => item?.value)
            : null,
          childCompanyIds: companyId?.length
            ? companyId?.map((item) => item?.value)
            : null,
          forInspectorMapping: activeTab === MAP_VIEW_TABS.INSPECTOR,
          content: value || '',
        })
          .then((res: any) => {
            setListInspector(res?.data);
          })
          .catch((err) => toastError(err));
      } else {
        getListAuditorsInCompanies({
          childCompanyIds: companyId?.length
            ? companyId?.map((item) => item?.value)
            : null,
          content: value || '',
        })
          .then((res: any) => {
            setListInspector(res?.data);
          })
          .catch((err) => toastError(err));
      }
    },
    [activeTab, getValues],
  );

  useEffect(() => {
    getListAuditorInCompanies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const companyOptionProps = useMemo(
    () =>
      listCompany?.map((item) => ({
        value: item.id,
        label: item.name,
      })),
    [listCompany],
  );

  const countryOptionProps: NewAsyncOptions[] = useMemo(
    () =>
      listCountry.map((item) => ({
        value: item?.name || '',
        label: item?.name || '',
        image: item?.flagImg || '',
      })),
    [listCountry],
  );

  const getChildCompanyIds = useMemo(() => {
    if (watchEntityType === EntityChangedField.ALL) {
      return null;
    }

    return watchChildCompanyInspection?.length
      ? watchChildCompanyInspection?.map((item) => item?.value)
      : null;
  }, [watchEntityType, watchChildCompanyInspection]);

  const handleData = useCallback(
    (value: any) => {
      let searchData;
      if (activeTab === MAP_VIEW_TABS.INSPECTION) {
        searchData = {
          page: 1,
          pageSize: -1,
          // companyId: userInfo?.companyId,
          entityTypes:
            watchEntityType === EntityChangedField.ALL
              ? ([EntityChangedField.OFFICE, EntityChangedField.VESSEL] as any)
              : ([watchEntityType] as any),
          childCompanyIds:
            watchEntityType === EntityChangedField.VESSEL
              ? null
              : getChildCompanyIds,
          fromDate: value?.inspection?.dateTime
            ? formatDateIso(value?.inspection?.dateTime?.[0])
            : null,
          toDate: value?.inspection?.dateTime
            ? formatDateIso(value?.inspection?.dateTime?.[1])
            : null,
          planningType: value?.inspection?.planningType || 'All',
          auditorIds:
            value?.inspection?.auditorIds?.length &&
            watchInspectionPlanningType !== 'Unassigned'
              ? value?.inspection?.auditorIds?.map((item) => item?.value)
              : null,
          portIds:
            value?.inspection?.portIds?.length && byPortInspectionWatch
              ? value?.inspection?.portIds?.map((item) => item?.value)
              : null,
          countryNames:
            value?.inspection?.country?.length && byCountryInspectionWatch
              ? value?.inspection?.country?.map((item) => item?.value)
              : null,
        };
      } else {
        searchData = {
          page: 1,
          // companyId: userInfo?.companyId,
          childCompanyIds: value?.inspector?.companyId?.length
            ? value?.inspector?.companyId?.map((item) => item?.value)
            : null,
          fromDate: value?.inspector?.dateTime
            ? formatDateIso(value?.inspector?.dateTime?.[0])
            : null,
          toDate: value?.inspector?.dateTime
            ? formatDateIso(value?.inspector?.dateTime?.[1])
            : null,
          searchAvailability: value?.inspector?.searchAvailability || 'All',
          baseLocation: value?.inspector?.baseLocation || false,
          includeServiceArea: value?.inspector?.includeServiceArea || false,
          inspectorIds: value?.inspector?.inspectorIds?.length
            ? value?.inspector?.inspectorIds?.map((item) => item?.value)
            : null,
          portIds:
            value?.inspector?.portIds?.length && byPortWatch
              ? value?.inspector?.portIds?.map((item) => item?.value)
              : null,
          countryNames:
            value?.inspector?.country?.length && byCountryWatch
              ? value?.inspector?.country?.map((item) => item?.value)
              : null,
        };
      }
      onSearch(searchData);
    },
    [
      activeTab,
      byCountryInspectionWatch,
      byCountryWatch,
      byPortInspectionWatch,
      byPortWatch,
      getChildCompanyIds,
      onSearch,
      watchEntityType,
      watchInspectionPlanningType,
    ],
  );

  const handleClearData = useCallback(() => {
    if (activeTab === MAP_VIEW_TABS.INSPECTION) {
      reset(defaultValues);
      dispatch(
        getListMapViewInspectionActions.success({
          data: [],
        }),
      );
    } else {
      reset(defaultValues);
      dispatch(
        getListMapViewInspectorActions.success({
          pickedPlanningRequests: [],
          selectedInspectorsInfo: [],
        }),
      );
    }
    setTimeout(() => {
      setValue('inspector.dateTime', [
        moment().subtract(3, 'months'),
        moment(),
      ]);
      setValue('inspection.dateTime', [
        moment().subtract(3, 'months'),
        moment(),
      ]);
    }, 0);
    clearData();
    // onSearch({});
  }, [activeTab, clearData, defaultValues, dispatch, reset, setValue]);

  return (
    <div className={cx(classes.wrap, { [classes.hideFilter]: !isOpen })}>
      <div className="d-flex align-items-center justify-content-between">
        <div className={classes.title}>
          {renderDynamicLabel(
            dynamicLabels,
            MAP_VIEW_DYNAMIC_FIELDS['Map view'],
          )}
        </div>
        <div className={classes.closeIcon} onClick={toggle}>
          <img src={images.icons.icBlackSingleClose} alt="icClose" />
        </div>
      </div>
      <Tabs
        style={{ overflow: 'visible' }}
        defaultActiveKey={activeTab}
        onChange={(tab) => {
          setActiveTab(tab);
        }}
      >
        <TabPane
          tab={renderDynamicLabel(
            dynamicLabels,
            MAP_VIEW_DYNAMIC_FIELDS['Inspector view'],
          )}
          key={MAP_VIEW_TABS.INSPECTOR}
        >
          <div className={classes.content}>
            <div
              className={cx('d-flex align-items-center', classes.wrapToggle)}
            >
              <ToggleSwitch
                disabled={false}
                control={control}
                name="inspector.baseLocation"
              />
              <div className={classes.label}>
                {renderDynamicLabel(
                  dynamicLabels,
                  MAP_VIEW_DYNAMIC_FIELDS['Base location'],
                )}
              </div>
            </div>
            <div
              className={cx('d-flex align-items-center', classes.wrapToggle)}
            >
              <ToggleSwitch
                disabled={false}
                control={control}
                name="inspector.includeServiceArea"
              />
              <div className={classes.label}>
                {renderDynamicLabel(
                  dynamicLabels,
                  MAP_VIEW_DYNAMIC_FIELDS['Include service area'],
                )}
              </div>
            </div>
            <div className={classes.wrapInfo}>
              <AsyncSelectResultForm
                multiple
                disabled={false}
                dynamicLabels={dynamicLabels}
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  MAP_VIEW_DYNAMIC_FIELDS.Company,
                )}
                control={control}
                name="inspector.companyId"
                id="companyId"
                titleResults={renderDynamicLabel(
                  dynamicLabels,
                  MAP_VIEW_DYNAMIC_FIELDS.Selected,
                )}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  MAP_VIEW_DYNAMIC_FIELDS['Please select'],
                )}
                textSelectAll={renderDynamicLabel(
                  dynamicLabels,
                  MAP_VIEW_DYNAMIC_FIELDS['Select all'],
                )}
                messageRequired={errors?.companyId?.message || ''}
                onChangeSearch={(value: string) => {
                  handleListChildCompany(value);
                }}
                options={companyOptionProps || []}
              />
            </div>
            <div className={classes.wrapInfo}>
              <SelectUI
                disabled={false}
                control={control}
                name="inspector.searchAvailability"
                messageRequired={errors?.searchAvailability?.message}
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  MAP_VIEW_DYNAMIC_FIELDS['Search availability'],
                )}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  MAP_VIEW_DYNAMIC_FIELDS['Please select'],
                )}
                onChange={(e) => {
                  setValue('inspector.searchAvailability', e);
                }}
                className="w-100"
                data={AVAILABILITY_OPTIONS || []}
              />
            </div>

            <div className={classes.wrapInfo}>
              <div className={classes.label}>
                {renderDynamicLabel(
                  dynamicLabels,
                  MAP_VIEW_DYNAMIC_FIELDS['Date range'],
                )}
              </div>
              <RangePicker
                className={cx('date__picker', classes.dateTime)}
                separator={<div>-</div>}
                format="DD/MM/YYYY"
                value={dateTimeInspectorWatch || null}
                allowClear={false}
                onChange={(e) => setValue('inspector.dateTime', e)}
              />
            </div>

            <Row
              className={cx(
                classes.wrapInfo,
                'd-flex align-items-center justify-content-between',
              )}
            >
              <Col
                className={cx('d-flex align-items-center', classes.wrapToggle)}
              >
                <ToggleSwitch
                  disabled={false}
                  control={control}
                  name="inspector.byCountry"
                />
                <div className={classes.label}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    MAP_VIEW_DYNAMIC_FIELDS['By country'],
                  )}
                </div>
              </Col>
              {includeServiceAreaWatch && (
                <Col
                  className={cx(
                    'd-flex align-items-center',
                    classes.wrapToggle,
                  )}
                >
                  <ToggleSwitch
                    disabled={false}
                    control={control}
                    name="inspector.byPort"
                  />
                  <div className={classes.label}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      MAP_VIEW_DYNAMIC_FIELDS['By port'],
                    )}
                  </div>
                </Col>
              )}
            </Row>
            {byCountryWatch && (
              <div className={classes.wrapInfo}>
                <AsyncSelectResultForm
                  multiple
                  disabled={false}
                  dynamicLabels={dynamicLabels}
                  labelSelect={renderDynamicLabel(
                    dynamicLabels,
                    MAP_VIEW_DYNAMIC_FIELDS['Country name'],
                  )}
                  control={control}
                  name="inspector.country"
                  id="country"
                  titleResults={renderDynamicLabel(
                    dynamicLabels,
                    MAP_VIEW_DYNAMIC_FIELDS.Selected,
                  )}
                  placeholder={renderDynamicLabel(
                    dynamicLabels,
                    MAP_VIEW_DYNAMIC_FIELDS['Please select'],
                  )}
                  textSelectAll={renderDynamicLabel(
                    dynamicLabels,
                    MAP_VIEW_DYNAMIC_FIELDS['Select all'],
                  )}
                  messageRequired={errors?.country?.message || ''}
                  onChangeSearch={(value: string) => {
                    dispatch(
                      getCountryActions.request({ content: value || '' }),
                    );
                  }}
                  options={countryOptionProps || []}
                />
              </div>
            )}
            {byPortWatch && includeServiceAreaWatch && (
              <div className={classes.wrapInfo}>
                <AsyncSelectResultForm
                  multiple
                  disabled={false}
                  dynamicLabels={dynamicLabels}
                  labelSelect={renderDynamicLabel(
                    dynamicLabels,
                    MAP_VIEW_DYNAMIC_FIELDS['Port code'],
                  )}
                  control={control}
                  name="inspector.portIds"
                  id="portIds"
                  titleResults={renderDynamicLabel(
                    dynamicLabels,
                    MAP_VIEW_DYNAMIC_FIELDS.Selected,
                  )}
                  placeholder={renderDynamicLabel(
                    dynamicLabels,
                    MAP_VIEW_DYNAMIC_FIELDS['Please select'],
                  )}
                  textSelectAll={renderDynamicLabel(
                    dynamicLabels,
                    MAP_VIEW_DYNAMIC_FIELDS['Select all'],
                  )}
                  messageRequired={errors?.portIds?.message || ''}
                  onChangeSearch={(value: string) => {
                    handleGetViewPort(value);
                  }}
                  options={
                    listPort?.map((item) => ({
                      label: item?.code,
                      value: item?.id,
                    })) || []
                  }
                />
              </div>
            )}
            <div className={classes.wrapInfo}>
              <AsyncSelectResultForm
                multiple
                disabled={false}
                dynamicLabels={dynamicLabels}
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  MAP_VIEW_DYNAMIC_FIELDS['Inspector name'],
                )}
                control={control}
                name="inspector.inspectorIds"
                id="inspectorIds"
                titleResults={renderDynamicLabel(
                  dynamicLabels,
                  MAP_VIEW_DYNAMIC_FIELDS.Selected,
                )}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  MAP_VIEW_DYNAMIC_FIELDS['Please select'],
                )}
                textSelectAll={renderDynamicLabel(
                  dynamicLabels,
                  MAP_VIEW_DYNAMIC_FIELDS['Select all'],
                )}
                messageRequired={errors?.inspectorIds?.message || ''}
                onChangeSearch={(value: string) => {
                  getListAuditorInCompanies(value);
                }}
                options={
                  listInspector?.map((item) => ({
                    label: item?.username,
                    value: item?.id,
                  })) || []
                }
              />
            </div>
          </div>
        </TabPane>
        <TabPane
          tab={renderDynamicLabel(
            dynamicLabels,
            MAP_VIEW_DYNAMIC_FIELDS['Inspection view'],
          )}
          key={MAP_VIEW_TABS.INSPECTION}
        >
          <div className={classes.content}>
            <div className={classes.wrapInfo}>
              <SelectUI
                disabled={false}
                control={control}
                name="inspection.entityType"
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  MAP_VIEW_DYNAMIC_FIELDS.Entity,
                )}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  MAP_VIEW_DYNAMIC_FIELDS['Please select'],
                )}
                onChange={(e) => {
                  setValue('inspection.entityType', e);
                }}
                className="w-100"
                data={ENTITY_TYPE_OPTIONS || []}
              />
            </div>
            {watchEntityType === EntityChangedField.OFFICE &&
              !isCompanyLevelInExternalInternal && (
                <div className={classes.wrapInfo}>
                  <AsyncSelectResultForm
                    multiple
                    disabled={false}
                    dynamicLabels={dynamicLabels}
                    labelSelect={renderDynamicLabel(
                      dynamicLabels,
                      MAP_VIEW_DYNAMIC_FIELDS.Company,
                    )}
                    control={control}
                    name="inspection.companyId"
                    id="companyId"
                    titleResults={renderDynamicLabel(
                      dynamicLabels,
                      MAP_VIEW_DYNAMIC_FIELDS.Selected,
                    )}
                    placeholder={renderDynamicLabel(
                      dynamicLabels,
                      MAP_VIEW_DYNAMIC_FIELDS['Please select'],
                    )}
                    textSelectAll={renderDynamicLabel(
                      dynamicLabels,
                      MAP_VIEW_DYNAMIC_FIELDS['Select all'],
                    )}
                    messageRequired={errors?.companyId?.message || ''}
                    onChangeSearch={(value: string) => {
                      handleListChildCompany(value);
                    }}
                    options={companyOptionProps || []}
                  />
                </div>
              )}

            <div className={classes.wrapInfo}>
              <SelectUI
                disabled={false}
                control={control}
                name="inspection.planningType"
                messageRequired={errors?.planningType?.message}
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  MAP_VIEW_DYNAMIC_FIELDS['Search unassigned inspection plan'],
                )}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  MAP_VIEW_DYNAMIC_FIELDS['Please select'],
                )}
                onChange={(e) => {
                  setValue('inspection.planningType', e);
                }}
                className="w-100"
                data={PLANNING_TYPE_OPTIONS || []}
              />
            </div>
            <div className={classes.wrapInfo}>
              <div className={classes.label}>
                {renderDynamicLabel(
                  dynamicLabels,
                  MAP_VIEW_DYNAMIC_FIELDS['Date range'],
                )}
              </div>
              <RangePicker
                className={cx('date__picker', classes.dateTime)}
                separator={<div>-</div>}
                format="DD/MM/YYYY"
                allowClear={false}
                value={dateTimeInspectionWatch || null}
                onChange={(e) => setValue('inspection.dateTime', e)}
              />
            </div>
            <Row
              className={cx(
                classes.wrapInfo,
                'd-flex align-items-center justify-content-between',
              )}
            >
              <Col
                className={cx('d-flex align-items-center', classes.wrapToggle)}
              >
                <ToggleSwitch
                  disabled={false}
                  control={control}
                  name="inspection.byCountry"
                />
                <div className={classes.label}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    MAP_VIEW_DYNAMIC_FIELDS['By country'],
                  )}
                </div>
              </Col>
              <Col
                className={cx('d-flex align-items-center', classes.wrapToggle)}
              >
                <ToggleSwitch
                  disabled={false}
                  control={control}
                  name="inspection.byPort"
                />
                <div className={classes.label}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    MAP_VIEW_DYNAMIC_FIELDS['By port'],
                  )}
                </div>
              </Col>
            </Row>
            {byCountryInspectionWatch && (
              <div className={classes.wrapInfo}>
                <AsyncSelectResultForm
                  multiple
                  disabled={false}
                  dynamicLabels={dynamicLabels}
                  labelSelect={renderDynamicLabel(
                    dynamicLabels,
                    MAP_VIEW_DYNAMIC_FIELDS['Country name'],
                  )}
                  control={control}
                  name="inspection.country"
                  id="country"
                  titleResults={renderDynamicLabel(
                    dynamicLabels,
                    MAP_VIEW_DYNAMIC_FIELDS.Selected,
                  )}
                  placeholder={renderDynamicLabel(
                    dynamicLabels,
                    MAP_VIEW_DYNAMIC_FIELDS['Please select'],
                  )}
                  textSelectAll={renderDynamicLabel(
                    dynamicLabels,
                    MAP_VIEW_DYNAMIC_FIELDS['Select all'],
                  )}
                  messageRequired={errors?.country?.message || ''}
                  onChangeSearch={(value: string) => {
                    dispatch(
                      getCountryActions.request({ content: value || '' }),
                    );
                  }}
                  options={countryOptionProps || []}
                />
              </div>
            )}
            {byPortInspectionWatch && (
              <div className={classes.wrapInfo}>
                <AsyncSelectResultForm
                  multiple
                  disabled={false}
                  dynamicLabels={dynamicLabels}
                  labelSelect={renderDynamicLabel(
                    dynamicLabels,
                    MAP_VIEW_DYNAMIC_FIELDS['Port code'],
                  )}
                  control={control}
                  name="inspection.portIds"
                  id="portIds"
                  titleResults={renderDynamicLabel(
                    dynamicLabels,
                    MAP_VIEW_DYNAMIC_FIELDS.Selected,
                  )}
                  placeholder={renderDynamicLabel(
                    dynamicLabels,
                    MAP_VIEW_DYNAMIC_FIELDS['Please select'],
                  )}
                  textSelectAll={renderDynamicLabel(
                    dynamicLabels,
                    MAP_VIEW_DYNAMIC_FIELDS['Select all'],
                  )}
                  messageRequired={errors?.portIds?.message || ''}
                  onChangeSearch={(value: string) => {
                    handleGetViewPort(value);
                  }}
                  options={
                    listPort?.map((item) => ({
                      label: item?.code,
                      value: item?.id,
                    })) || []
                  }
                />
              </div>
            )}
            {watchInspectionPlanningType !== 'Unassigned' && (
              <div className={classes.wrapInfo}>
                <AsyncSelectResultForm
                  multiple
                  disabled={false}
                  dynamicLabels={dynamicLabels}
                  labelSelect={renderDynamicLabel(
                    dynamicLabels,
                    MAP_VIEW_DYNAMIC_FIELDS['Inspector name'],
                  )}
                  control={control}
                  name="inspection.auditorIds"
                  id="auditorIds"
                  titleResults={renderDynamicLabel(
                    dynamicLabels,
                    MAP_VIEW_DYNAMIC_FIELDS.Selected,
                  )}
                  placeholder={renderDynamicLabel(
                    dynamicLabels,
                    MAP_VIEW_DYNAMIC_FIELDS['Please select'],
                  )}
                  textSelectAll={renderDynamicLabel(
                    dynamicLabels,
                    MAP_VIEW_DYNAMIC_FIELDS['Select all'],
                  )}
                  messageRequired={errors?.auditorIds?.message || ''}
                  onChangeSearch={(value: string) => {
                    getListAuditorInCompanies(value);
                  }}
                  options={
                    listInspector?.map((item) => ({
                      label: item?.username,
                      value: item?.id,
                    })) || []
                  }
                />
              </div>
            )}
          </div>
        </TabPane>
      </Tabs>
      <div
        className={cx(
          'd-flex align-items-center justify-content-end',
          classes.wrapBtn,
        )}
      >
        <Button
          buttonType={ButtonType.Outline}
          className={classes.clearBtn}
          onClick={handleClearData}
        >
          {renderDynamicLabel(
            dynamicLabels,
            MAP_VIEW_DYNAMIC_FIELDS['Clear all'],
          )}
        </Button>
        <Button
          buttonType={ButtonType.Outline}
          onClick={handleSubmit(handleData)}
        >
          {renderDynamicLabel(dynamicLabels, MAP_VIEW_DYNAMIC_FIELDS.Search)}
        </Button>
      </div>
    </div>
  );
};

export default FilterMapView;
