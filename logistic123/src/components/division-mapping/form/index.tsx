import { useCallback, useState, useEffect, useMemo, useRef } from 'react';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { getListVesselActions } from 'store/vessel/vessel.action';
import images from 'assets/images/images';
import HeaderPage from 'components/common/header-page/HeaderPage';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router-dom';
import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import { Location } from 'history';

import {
  createDivisionMappingApiRequest,
  getDivisionMappingDetailActionsApi,
  updateDivisionMappingActionsApi,
} from 'pages/division-mapping/utils/api';

import { Col, Row } from 'reactstrap';
import Input from 'components/ui/input/Input';
import SelectUI from 'components/ui/select/Select';
import * as yup from 'yup';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Features,
  SubFeatures,
  ActionTypeEnum,
} from 'constants/roleAndPermission.const';
import cx from 'classnames';
import { Action, CommonApiParam } from 'models/common.model';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
// import { handleFilterParams } from 'helpers/filterParams.helper';
import { getListDivisionActions } from 'pages/division/store/action';
// import {} from 'pages/division-mapping/store/action';
import ActionBuilder from 'components/common/table/action-builder/ActionBuilder';
import AGGridModule from 'components/common/ag-grid/AGGridModule2';
import {
  DEFAULT_COL_DEF_TYPE_FLEX,
  MODULE_TEMPLATE,
} from 'constants/components/ag-grid.const';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import {
  renderDynamicLabel,
  renderDynamicModuleLabel,
} from 'helpers/dynamic.helper';
import { DIVISION_MAPPING_FIELDS_DETAILS } from 'constants/dynamic/division-mapping.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import styles from '../../list-common.module.scss';
import ModalSelectVessel from '../modal/ModalSelectVessel';
import classes from './form.module.scss';

const defaultValues = {
  divisionId: null,
  divisionCode: '',
};

const DivisionMappingForm = () => {
  const { state }: Location<{ isView?: boolean }> = useLocation();
  const isView = useRef<boolean>(state?.isView || false);

  const [isMultiColumnFilter, setIsMultiColumnFilter] = useState(false);
  const [modalSelectVesselVisible, setModalSelectVesselVisible] =
    useState(false);

  // const [viewMode, setViewMode] = useState(false);
  const [listVesselSelected, setListVesselSelected] = useState([]);
  const [listVesselSaved, setListVesselSaved] = useState([]);
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch();
  const { loading, params, listDivision } = useSelector(
    (state) => state.division,
  );
  const { listVesselResponse } = useSelector((state) => state.vessel);

  const [submitLoading, setSubmitLoading] = useState(false);

  // const { userInfo } = useSelector((state) => state.authenticate);

  const modulePage = useMemo((): ModulePage => ModulePage.Create, []);

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationCommonDivisionMapping,
    modulePage,
  });

  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  const schema = yup.object().shape({
    divisionId: yup
      .string()
      .nullable()
      .trim()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
  });

  const {
    control,
    handleSubmit,
    // setError,
    setValue,
    // getValues,
    watch,
    // reset,
    register,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const watchDivisionId = watch('divisionId');

  const handleGetListDivision = useCallback(
    (search?: CommonApiParam) => {
      dispatch(
        getListDivisionActions.request(
          id
            ? {
                pageSize: -1,
                isLeftMenu: false,
                status: 'active',
              }
            : {
                pageSize: -1,
                isLeftMenu: false,
                forCreateDivision: true,
                status: 'active',
              },
        ),
      );
    },

    [dispatch, id],
  );

  useEffect(() => {
    if (listVesselResponse?.data && id) {
      getDivisionMappingDetailActionsApi(id)
        .then((res) => {
          setValue('divisionId', res?.data?.id || '');
          const listVessel = res?.data?.divisionMapping?.length
            ? res?.data?.divisionMapping?.map((item) => item?.vessel)
            : [];
          setListVesselSelected(listVessel);
          setListVesselSaved(listVessel);
        })
        .catch((err) => toastError(err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, listVesselResponse?.data]);

  useEffect(() => {
    if (watchDivisionId) {
      const division = listDivision?.data?.find(
        (item) => item?.id === watchDivisionId,
      );
      setValue('divisionCode', division?.code || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchDivisionId]);

  useEffect(() => {
    dispatch(
      getListVesselActions.request({
        pageSize: -1,
        status: 'active',
        forCreateDivision: true,
      }),
    );
    handleGetListDivision();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  // const viewDetail = useCallback((id) => {
  //   setItemSelected(id);
  //   setModalSelectVesselVisible(true);
  //   setViewMode(true);
  // }, []);

  // const editDetail = useCallback((id?: string) => {
  //   setItemSelected(id);
  //   setModalSelectVesselVisible(true);
  //   // setViewMode(false);
  // }, []);

  const handleGetList = useCallback((params?: CommonApiParam) => {
    // const param = handleFilterParams(params);
    // dispatch(
    //   getListDivisionActions.request({
    //     ...param,
    //     pageSize: -1,
    //     isLeftMenu: false,
    //   }),
    // );
  }, []);

  const handleDeleteDivision = useCallback(
    (id: string) => {
      const listVessel = listVesselSelected?.filter((item) => item.id !== id);
      setListVesselSelected(listVessel);
    },
    [listVesselSelected],
  );

  const handleDelete = useCallback(
    (id: string) => {
      showConfirmBase({
        isDelete: true,
        txTitle: renderDynamicLabel(
          dynamicLabels,
          DIVISION_MAPPING_FIELDS_DETAILS['Delete?'],
        ),
        txMsg: renderDynamicLabel(
          dynamicLabels,
          DIVISION_MAPPING_FIELDS_DETAILS[
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
        onPressButtonRight: () => handleDeleteDivision(id),
      });
    },
    [dynamicLabels, handleDeleteDivision],
  );

  const dataTable = useMemo(() => {
    if (!listVesselSelected) {
      return [];
    }
    return listVesselSelected?.map((data) => ({
      id: data.id,
      imoNumber: data?.imoNumber,
      name: data?.name,
      vesselType: data?.vesselType?.name,
    }));
  }, [listVesselSelected]);

  const columnDefs = useMemo(
    () => [
      {
        field: 'action',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DIVISION_MAPPING_FIELDS_DETAILS.Action,
        ),
        filter: false,
        sortable: false,
        enableRowGroup: false,
        lockPosition: true,
        pinned: 'left',
        cellRendererFramework: ({ data }: { data: any }) => {
          const actions: Action[] = !isView.current
            ? [
                // {
                //   img: images.icons.icViewDetail,
                //   function: () => viewDetail(data?.id),
                //   feature: Features.CONFIGURATION,
                //   subFeature: SubFeatures.DIVISION_MAPPING,
                //   buttonType: ButtonType.Blue,
                //   action: ActionTypeEnum.VIEW,
                //   cssClass: 'me-1',
                // },
                // {
                //   img: images.icons.icEdit,
                //   function: () => editDetail(data?.id),
                //   feature: Features.CONFIGURATION,
                //   subFeature: SubFeatures.DIVISION_MAPPING,
                //   action: ActionTypeEnum.UPDATE,
                // },
                {
                  img: images.icons.icRemove,
                  function: () => handleDelete(data?.id),
                  feature: Features.CONFIGURATION,
                  subFeature: SubFeatures.DIVISION_MAPPING,
                  action: ActionTypeEnum.DELETE,
                  buttonType: ButtonType.Orange,
                  cssClass: 'ms-1',
                },
              ]
            : [];

          return (
            <div className="d-flex justify-content-start align-items-center">
              <ActionBuilder actionList={actions} />
            </div>
          );
        },
      },
      {
        field: 'imoNumber',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DIVISION_MAPPING_FIELDS_DETAILS['IMO number'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'name',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DIVISION_MAPPING_FIELDS_DETAILS['Vessel name'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
      {
        field: 'vesselType',
        headerName: renderDynamicLabel(
          dynamicLabels,
          DIVISION_MAPPING_FIELDS_DETAILS['Vessel type'],
        ),
        filter: isMultiColumnFilter
          ? 'agMultiColumnFilter'
          : 'agTextColumnFilter',
      },
    ],
    [dynamicLabels, isMultiColumnFilter, handleDelete],
  );

  const onSubmitForm = useCallback(
    (values) => {
      if (!listVesselSelected?.length) {
        toastError('Vessel is required');
        return;
      }
      setSubmitLoading(true);
      if (id) {
        updateDivisionMappingActionsApi({
          id: values?.divisionId,
          vesselIds: listVesselSelected?.map((item) => item?.id) || [],
        })
          .then((res) => {
            toastSuccess(
              renderDynamicLabel(
                dynamicLabels,
                DIVISION_MAPPING_FIELDS_DETAILS[
                  'Update division mapping successfully'
                ],
              ),
            );
            history.push(AppRouteConst.DIVISION_MAPPING);
          })
          .catch((err) => toastError(err))
          .finally(() => {
            setSubmitLoading(false);
          });
        return;
      }
      createDivisionMappingApiRequest({
        divisionId: values?.divisionId,
        vesselIds: listVesselSelected?.map((item) => item?.id) || [],
      })
        .then((res) => {
          toastSuccess(
            renderDynamicLabel(
              dynamicLabels,
              DIVISION_MAPPING_FIELDS_DETAILS[
                'Create division mapping successfully'
              ],
            ),
          );
          history.push(AppRouteConst.DIVISION_MAPPING);
        })
        .catch((err) => toastError(err))
        .finally(() => {
          setSubmitLoading(false);
        });
    },
    [dynamicLabels, id, listVesselSelected],
  );

  const listVessel = useMemo(() => {
    if (id) {
      return listVesselResponse?.data?.concat(listVesselSaved);
    }
    return listVesselResponse?.data;
  }, [id, listVesselResponse?.data, listVesselSaved]);

  return (
    <div className={styles.wrapper}>
      <HeaderPage
        breadCrumb={BREAD_CRUMB.DIVISION_MAPPING}
        titlePage={renderDynamicModuleLabel(
          listModuleDynamicLabels,
          DynamicLabelModuleName.ConfigurationCommonDivisionMapping,
        )}
      />
      <Row className={classes.wrapFilter}>
        <Col xs={6}>
          <div className={classes.label}>
            {renderDynamicLabel(
              dynamicLabels,
              DIVISION_MAPPING_FIELDS_DETAILS['Division name'],
            )}
            <span className={classes.dotRequired}>*</span>
          </div>
          <SelectUI
            data={listDivision?.data?.map((item) => ({
              label: item?.name,
              value: item?.id,
            }))}
            name="divisionId"
            placeholder={renderDynamicLabel(
              dynamicLabels,
              DIVISION_MAPPING_FIELDS_DETAILS['Please select'],
            )}
            id="divisionId"
            messageRequired={errors?.divisionId?.message || ''}
            className={cx(
              classes.inputSelect,
              { [classes.disabledSelect]: false },
              'w-100',
            )}
            control={control}
            disabled={!!id || loading}
            isRequired
          />
        </Col>

        <Col xs={6}>
          <div className={classes.label}>
            {renderDynamicLabel(
              dynamicLabels,
              DIVISION_MAPPING_FIELDS_DETAILS['Division code'],
            )}
            <span className={classes.dotRequired}>*</span>
          </div>
          <Input
            className={cx({ [classes.disabledInput]: true })}
            placeholder=""
            isRequired
            disabled
            {...register('divisionCode')}
            maxLength={250}
            messageRequired={errors?.divisionCode?.message || ''}
          />
        </Col>
      </Row>
      <div
        className={cx(
          classes.wrapHeader,
          'd-flex align-items-center justify-content-between',
        )}
      >
        <div className={classes.title}>
          {renderDynamicLabel(
            dynamicLabels,
            DIVISION_MAPPING_FIELDS_DETAILS['Vessel list'],
          )}
        </div>
        {!isView.current && (
          <Button
            onClick={() => setModalSelectVesselVisible(true)}
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
            {renderDynamicLabel(
              dynamicLabels,
              DIVISION_MAPPING_FIELDS_DETAILS['Select vessel'],
            )}
          </Button>
        )}
      </div>
      <AGGridModule
        loading={loading}
        params={params}
        colDefProp={DEFAULT_COL_DEF_TYPE_FLEX}
        setIsMultiColumnFilter={setIsMultiColumnFilter}
        hasRangePicker={false}
        columnDefs={columnDefs}
        dataFilter={null}
        moduleTemplate={MODULE_TEMPLATE.divisionMapping}
        fileName="Division Mapping"
        dataTable={dataTable}
        height="calc(100vh - 388px)"
        // view={(params) => {
        //   viewDetail(params);
        //   return true;
        // }}
        getList={handleGetList}
        classNameHeader={styles.header}
      />
      <ModalSelectVessel
        isOpen={modalSelectVesselVisible}
        setValue={setValue}
        itemSelected={listVesselSelected}
        onClose={() => setModalSelectVesselVisible(false)}
        onSaveData={(data) => setListVesselSelected(data)}
        listVessel={listVessel}
        loading={loading}
        params={params}
      />
      <div
        className={cx(
          'd-flex align-items-center justify-content-end',
          classes.wrapFooter,
        )}
      >
        <Button
          buttonSize={ButtonSize.Medium}
          buttonType={ButtonType.CancelOutline}
          onClick={() => history.push(AppRouteConst.DIVISION_MAPPING)}
          className={classes.cancelBtn}
        >
          {renderDynamicLabel(
            dynamicLabels,
            DIVISION_MAPPING_FIELDS_DETAILS.Cancel,
          )}
        </Button>
        {!isView.current && (
          <Button
            className={classes.btnSubmit}
            buttonSize={ButtonSize.Medium}
            buttonType={ButtonType.Primary}
            onClick={handleSubmit(onSubmitForm, (err) => {
              if (!listVesselSelected?.length) {
                toastError(
                  renderDynamicLabel(
                    dynamicLabels,
                    DIVISION_MAPPING_FIELDS_DETAILS['Vessel is required'],
                  ),
                );
              }
            })}
            disabledCss={false}
            disabled={false}
            loading={submitLoading}
          >
            {renderDynamicLabel(
              dynamicLabels,
              DIVISION_MAPPING_FIELDS_DETAILS.Save,
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default DivisionMappingForm;
