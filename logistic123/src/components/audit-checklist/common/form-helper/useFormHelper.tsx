import {
  getAuditCheckListCodeApi,
  getReferencesCategoryApi,
  getQuestionDetailApi,
} from 'api/audit-checklist.api';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { I18nNamespace } from 'constants/i18n.const';
import useEffectOnce from 'hoc/useEffectOnce';
import { tz } from 'moment-timezone';
import { useLocation } from 'react-router';
import { toastError } from 'helpers/notification.helper';
import {
  Item,
  StepStatus,
  ItemStatus,
} from 'components/common/step-line/lineStepInfoCP';
import isEmpty from 'lodash/isEmpty';
import { MasterDataId, WorkFlowType } from 'constants/common.const';
import { AppRouteConst } from 'constants/route.const';
import { getListLocationsActionsApi } from 'api/location.api';
import { getListTopicsActionsApi } from 'api/topic.api';
import { getListShipDirectResponsiblesActionsApi } from 'api/ship-direct-responsible.api';
import { getPriorityMaster } from 'api/priority-master.api';
import {
  GetAuditCheckListCode,
  MasterData,
  StatusHistory,
} from 'models/api/audit-checklist/audit-checklist.model';
import { checkIsCreatedInitialData } from 'store/audit-checklist/audit-checklist.action';
import { QuestionDetail } from 'models/store/audit-checklist/audit-checklist.model';
import {
  getListSecondCategoryActionsApi,
  getListSecondCategoryByMainIdActionsApi,
} from 'api/second-category.api';
import { getListThirdCategoryActionsApi } from 'api/third-category.api';
import { useState, useEffect, useMemo, useCallback } from 'react';
import { getListCharterOwnersActionsApi } from 'api/charter-owner.api';
import { getListRankMasterActionsApi } from 'api/rank-master.api';
import { getListDepartmentMasterActionsApi } from 'api/department-master.api';
import { getListVesselTypeActionsApi } from 'api/vessel-type.api';
import { getListVIQsActionsApi } from 'api/viq.api';
import { getListCDIsActionsApi } from 'api/cdi.api';
import { getListMainCategoryActionsApi } from 'api/main-category.api';
import history from 'helpers/history.helper';
import { getWorkFlowActiveUserPermissionActions } from 'store/work-flow/work-flow.action';
// import { useParams } from 'react-router-dom';

interface Option {
  value: string | number;
  label: string;
}
export interface ACDataPackage {
  listRefCategory?: string[];
  dueDiligence: any[];
  pms: any[];
  location: Option[];
  vesselType: any[];
  CDI: Option[];
  charterOwner: Option[];
  VIQ: Option[];
  SMS: any[];
  mainCategory: Option[];
  subCategory: Option[];
  subCategory2: Option[];
  shipDepartment: Option[];
  department: any[];
  SDR: any[];
  shipRanks: Option[];
  shipShipDirectResponsible: Option[];
  shoreDepartment: Option[];
  shoreRank: Option[];
  topic: Option[];
  criticality: any[];
  potentialRisk: any[];
}

export const paramDefaults = { page: 1, pageSize: -1, status: 'active' };

export const useFormHelper = () => {
  const { t } = useTranslation([
    I18nNamespace.AUDIT_CHECKLIST,
    I18nNamespace.COMMON,
  ]);
  const { userInfo } = useSelector((state) => state.authenticate);

  const { search } = useLocation();
  const dispatch = useDispatch();
  const [currentTimeZone, setCurrentTimeZone] = useState<string>('');
  const [chkCode, setChkCode] = useState<GetAuditCheckListCode>();
  const [dataPackage, setDataPackage] = useState<ACDataPackage>();
  const [masterDataOptions, setMasterDataOptions] = useState<MasterData[]>([]);
  const [listRefCategory, setListRefCategory] = useState<string[]>([]);
  const [questionDetail, setQuestionDetail] = useState<QuestionDetail | null>();
  const [statusHistory, setStatusHistory] = useState<StatusHistory[]>([]);
  const { isCreatedInitialData } = useSelector((store) => store.auditCheckList);
  const [loadingQuestionDetail, setLoadingQuestionDetail] =
    useState<boolean>(false);

  const paramsMaster = {
    page: 1,
    pageSize: -1,
    status: 'active',
    companyId: userInfo?.mainCompanyId,
  };

  const loading = useMemo(() => {
    if (
      history.location.pathname.includes(
        AppRouteConst.AUDIT_CHECKLIST_CREATE,
      ) &&
      (!chkCode ||
        isEmpty(chkCode) ||
        masterDataOptions.length === 0 ||
        !currentTimeZone)
    ) {
      return true;
    }
    if (
      masterDataOptions.length === 0 &&
      !history.location.pathname.includes(AppRouteConst.AUDIT_CHECKLIST_CREATE)
    ) {
      return true;
    }
    return false;
  }, [chkCode, masterDataOptions, currentTimeZone]);

  const fetchQuestionListData = useCallback(async () => {
    try {
      if (listRefCategory && listRefCategory.length > 0) {
        let finalPackage: ACDataPackage;
        let newListRefCategory: string[] = [
          MasterDataId.TOPIC_ID,
          ...listRefCategory,
        ];
        if (listRefCategory.includes(MasterDataId.MAIN_CATEGORY)) {
          newListRefCategory = [
            MasterDataId.THIRD_CATEGORY,
            MasterDataId.SECOND_CATEGORY,
            ...newListRefCategory,
          ];
        }
        newListRefCategory = [...newListRefCategory, 'department'];
        await Promise.all(
          newListRefCategory
            .filter((i) => i !== MasterDataId.SDR)
            .map(async (i) => {
              switch (i) {
                case MasterDataId.LOCATION: {
                  const response = await getListLocationsActionsApi(
                    paramsMaster,
                  );
                  return {
                    id: MasterDataId.LOCATION,
                    list: response.data.data,
                  };
                }
                case MasterDataId.TOPIC_ID: {
                  const response = await getListTopicsActionsApi(paramsMaster);
                  return {
                    id: MasterDataId.TOPIC_ID,
                    list: response.data.data,
                  };
                }
                case MasterDataId.MAIN_CATEGORY: {
                  const response = await getListMainCategoryActionsApi(
                    paramsMaster,
                  );

                  return {
                    id: MasterDataId.MAIN_CATEGORY,
                    list: response.data.data || [],
                  };
                }
                case MasterDataId.SECOND_CATEGORY: {
                  const response = await getListSecondCategoryActionsApi(
                    paramsMaster,
                  );
                  return {
                    id: MasterDataId.SECOND_CATEGORY,
                    list: response.data.data || [],
                  };
                }
                case MasterDataId.THIRD_CATEGORY: {
                  const response = await getListThirdCategoryActionsApi(
                    paramsMaster,
                  );
                  return {
                    id: MasterDataId.THIRD_CATEGORY,
                    list: response.data.data || [],
                  };
                }
                case MasterDataId.CHARTER_OWNER: {
                  const response = await getListCharterOwnersActionsApi({
                    ...paramsMaster,
                  });
                  return {
                    id: MasterDataId.CHARTER_OWNER,
                    list: response.data.data,
                  };
                }
                case MasterDataId.CDI: {
                  const response = await getListCDIsActionsApi(paramsMaster);
                  return { id: MasterDataId.CDI, list: response.data.data };
                }
                case MasterDataId.CRITICALITY: {
                  return { id: MasterDataId.CRITICALITY, list: [] };
                }
                case MasterDataId.POTENTIAL_RISK: {
                  const response = await getPriorityMaster({
                    companyId: userInfo?.mainCompanyId,
                  });
                  return {
                    id: MasterDataId.POTENTIAL_RISK,
                    list: response.data,
                  };
                }
                // case MasterDataId.SDR: {
                //   const response = await getListShipDepartmentsActionsApi({
                //     isRefreshLoading: false,
                //     paramsList: paramsMaster,
                //   });
                //   return { id: MasterDataId.SDR, list: response.data.data };
                // }
                case MasterDataId.SHIP_DEPARTMENT: {
                  const response = await getListDepartmentMasterActionsApi({
                    ...paramsMaster,
                    type: 'ship',
                  });
                  return {
                    id: MasterDataId.SHIP_DEPARTMENT,
                    list: response.data.data,
                  };
                }
                case MasterDataId.DEPARTMENT: {
                  const response = await getListDepartmentMasterActionsApi({
                    ...paramsMaster,
                    companyId: userInfo?.mainCompanyId,
                  });
                  return {
                    id: MasterDataId.DEPARTMENT,
                    list: response.data.data,
                  };
                }
                case MasterDataId.SHIP_RANK: {
                  const response = await getListRankMasterActionsApi({
                    ...paramsMaster,
                    type: 'ship',
                  });
                  return {
                    id: MasterDataId.SHIP_RANK,
                    list: response.data.data,
                  };
                }
                case MasterDataId.SHORE_DEPARTMENT: {
                  const response = await getListDepartmentMasterActionsApi({
                    ...paramsMaster,
                    type: 'shore',
                  });
                  return {
                    id: MasterDataId.SHORE_DEPARTMENT,
                    list: response.data.data,
                  };
                }
                case MasterDataId.SHORE_RANK: {
                  const response = await getListRankMasterActionsApi({
                    ...paramsMaster,
                    type: 'shore',
                  });
                  return {
                    id: MasterDataId.SHORE_RANK,
                    list: response.data.data,
                  };
                }
                case MasterDataId.SMS: {
                  return { id: MasterDataId.SMS, list: [] };
                }
                case MasterDataId.VESSEL_TYPE: {
                  const response = await getListVesselTypeActionsApi(
                    paramsMaster,
                  );
                  return {
                    id: MasterDataId.VESSEL_TYPE,
                    list: response.data.data,
                  };
                }
                case MasterDataId.VIQ: {
                  const response = await getListVIQsActionsApi(paramsMaster);
                  return { id: MasterDataId.VIQ, list: response.data.data };
                }
                default:
                  return { id: i, list: [] };
              }
            }),
        ).then((r) =>
          r.forEach((i) => {
            switch (i.id) {
              case MasterDataId.LOCATION: {
                finalPackage = {
                  ...finalPackage,
                  location:
                    i.list?.map((item) => ({
                      value: item.id,
                      label: item.name,
                    })) || [],
                };
                break;
              }
              case MasterDataId.TOPIC_ID: {
                finalPackage = {
                  ...finalPackage,
                  topic:
                    i.list?.map((item) => ({
                      value: item.id,
                      label: item.name,
                    })) || [],
                };
                break;
              }
              case MasterDataId.DEPARTMENT: {
                finalPackage = {
                  ...finalPackage,
                  department:
                    i.list?.map((item) => ({
                      value: item.id,
                      label: item.name,
                    })) || [],
                };
                break;
              }
              case MasterDataId.MAIN_CATEGORY: {
                finalPackage = {
                  ...finalPackage,
                  mainCategory:
                    i.list?.map((item) => ({
                      value: item.id,
                      label: item.name,
                    })) || [],
                };
                break;
              }

              case MasterDataId.SECOND_CATEGORY: {
                finalPackage = {
                  ...finalPackage,
                  subCategory:
                    i.list?.map((item) => ({
                      value: item.id,
                      label: item.name,
                    })) || [],
                };
                break;
              }
              case MasterDataId.THIRD_CATEGORY: {
                finalPackage = {
                  ...finalPackage,
                  subCategory2:
                    i.list?.map((item) => ({
                      value: item.id,
                      label: item.name,
                    })) || [],
                };
                break;
              }

              case MasterDataId.CHARTER_OWNER: {
                finalPackage = {
                  ...finalPackage,
                  charterOwner:
                    i.list?.map((item) => ({
                      value: item.id,
                      label: item.name,
                    })) || [],
                };
                break;
              }
              case MasterDataId.CDI: {
                finalPackage = {
                  ...finalPackage,
                  CDI:
                    i.list?.map((item) => ({
                      value: item.id,
                      label: item.name,
                    })) || [],
                };
                break;
              }
              case MasterDataId.CRITICALITY: {
                finalPackage = {
                  ...finalPackage,
                  criticality:
                    i.list?.map((item) => ({
                      value: item.id,
                      label: item.name,
                    })) || [],
                };
                break;
              }
              case MasterDataId.POTENTIAL_RISK: {
                finalPackage = {
                  ...finalPackage,
                  potentialRisk:
                    i.list?.map((item) => ({
                      value: item.id,
                      label: item.risk,
                    })) || [],
                };
                break;
              }
              // case MasterDataId.SDR: {
              //   finalPackage = { ...finalPackage, SDR: i.list };
              //   break;
              // }
              case MasterDataId.SHIP_DEPARTMENT: {
                finalPackage = {
                  ...finalPackage,
                  shipDepartment:
                    i.list?.map((item) => ({
                      value: item.id,
                      label: item.name,
                    })) || [],
                };
                break;
              }
              case MasterDataId.SHIP_RANK: {
                finalPackage = {
                  ...finalPackage,
                  shipRanks:
                    i.list?.map((item) => ({
                      value: item.id,
                      label: item.name,
                    })) || [],
                };
                break;
              }
              case MasterDataId.SHORE_DEPARTMENT: {
                finalPackage = {
                  ...finalPackage,
                  shoreDepartment:
                    i.list?.map((item) => ({
                      value: item.id,
                      label: item.name,
                    })) || [],
                };
                break;
              }
              case MasterDataId.SHORE_RANK: {
                finalPackage = {
                  ...finalPackage,
                  shoreRank:
                    i.list?.map((item) => ({
                      value: item.id,
                      label: item.name,
                    })) || [],
                };
                break;
              }
              case MasterDataId.SMS: {
                finalPackage = {
                  ...finalPackage,
                  SMS:
                    i.list?.map((item) => ({
                      value: item.id,
                      label: item.name,
                    })) || [],
                };
                break;
              }
              case MasterDataId.VESSEL_TYPE: {
                finalPackage = {
                  ...finalPackage,
                  vesselType:
                    i.list?.map((item) => ({
                      value: item.id,
                      label: item.name,
                    })) || [],
                };
                break;
              }
              case MasterDataId.VIQ: {
                finalPackage = {
                  ...finalPackage,
                  VIQ:
                    i.list?.map((item) => ({
                      value: item.id,
                      label: item.refNo,
                    })) || [],
                };
                break;
              }
              default:
                break;
            }
          }),
        );

        finalPackage = { ...finalPackage, listRefCategory };
        setDataPackage(finalPackage);
      }
    } catch (e) {
      toastError(e);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listRefCategory, userInfo?.companyId]);

  const fetchLocationData = (content: string) => {
    let finalPackage: ACDataPackage = { ...dataPackage };

    getListLocationsActionsApi({ ...paramsMaster, content })
      .then((r) => {
        finalPackage = {
          ...finalPackage,
          location:
            r?.data?.data?.map((item) => ({
              value: item.id,
              label: item.name,
            })) || [],
        };
        setDataPackage({ ...finalPackage });
      })
      .catch((e) => toastError(e));
  };

  const setQuestionDetailChecklist = (
    idAuditChecklist: string,
    idQuestion: string,
    actionFunction?: () => void,
  ) => {
    setLoadingQuestionDetail(true);
    getQuestionDetailApi({ idAuditChecklist, idQuestion })
      .then((r) => {
        setQuestionDetail({ ...r?.data });
      })
      .catch((e) => toastError(e))
      .finally(() => setLoadingQuestionDetail(false));
    if (actionFunction) actionFunction();
  };

  const fetchCategoryData = (content: string, levels: string, id?: string) => {
    let finalPackage: ACDataPackage = { ...dataPackage };
    switch (levels) {
      case '1': {
        getListMainCategoryActionsApi({
          ...paramsMaster,
          content,
        })
          .then((r) => {
            finalPackage = {
              ...finalPackage,
              mainCategory:
                r?.data?.data?.map((item) => ({
                  value: item.id,
                  label: item.name,
                })) || [],
            };
            setDataPackage({ ...finalPackage });
          })
          .catch((e) => toastError(e));
        break;
      }
      case '2': {
        if (id) {
          getListSecondCategoryByMainIdActionsApi({
            ...paramsMaster,
            content,
            mainCategoryId: id,
          })
            .then((r) => {
              finalPackage = {
                ...finalPackage,
                subCategory:
                  r?.data?.map((item) => ({
                    value: item.id,
                    label: item.name,
                  })) || [],
              };
              setDataPackage({ ...finalPackage });
            })
            .catch((e) => toastError(e));
        } else {
          getListSecondCategoryActionsApi({
            ...paramsMaster,
            content,
          })
            .then((r) => {
              finalPackage = {
                ...finalPackage,
                subCategory:
                  r?.data?.data?.map((item) => ({
                    value: item.id,
                    label: item.name,
                  })) || [],
              };
              setDataPackage({ ...finalPackage });
            })
            .catch((e) => toastError(e));
        }

        break;
      }
      case '3': {
        getListThirdCategoryActionsApi({
          ...paramsMaster,
          content,
        })
          .then((r) => {
            finalPackage = {
              ...finalPackage,
              subCategory2:
                r?.data?.data?.map((item) => ({
                  value: item.id,
                  label: item.name,
                })) || [],
            };
            setDataPackage({ ...finalPackage });
          })
          .catch((e) => toastError(e));
        break;
      }

      default:
    }
  };

  const fetchVesselTypeData = (content: string) => {
    let finalPackage: ACDataPackage = { ...dataPackage };

    getListVesselTypeActionsApi({
      ...paramsMaster,
      content,
    })
      .then((r) => {
        finalPackage = {
          ...finalPackage,
          vesselType:
            r?.data?.data?.map((item) => ({
              value: item.id,
              label: item.name,
            })) || [],
        };
        setDataPackage({ ...finalPackage });
      })
      .catch((e) => toastError(e));
  };

  const fetchShipDirectResponsibleData = (content: string) => {
    let finalPackage: ACDataPackage = { ...dataPackage };

    getListShipDirectResponsiblesActionsApi({
      ...paramsMaster,
      content,
    })
      .then((r) => {
        finalPackage = {
          ...finalPackage,
          shipShipDirectResponsible:
            r?.data?.data?.map((item) => ({
              value: item.id,
              label: item.name,
            })) || [],
        };
        setDataPackage({ ...finalPackage });
      })
      .catch((e) => toastError(e));
  };

  const fetchCDIData = (content: string) => {
    let finalPackage: ACDataPackage = { ...dataPackage };

    getListCDIsActionsApi({
      ...paramsMaster,
      content,
    })
      .then((r) => {
        finalPackage = {
          ...finalPackage,
          CDI:
            r?.data?.data?.map((item) => ({
              value: item.id,
              label: item.name,
            })) || [],
        };
        setDataPackage({ ...finalPackage });
      })
      .catch((e) => toastError(e));
  };

  const fetchShoreRankData = (content: string) => {
    let finalPackage: ACDataPackage = { ...dataPackage };
    getListRankMasterActionsApi({
      ...paramsMaster,
      content,
      type: 'shore',
    })
      .then((r) => {
        finalPackage = {
          ...finalPackage,
          shoreRank:
            r?.data?.data?.map((item) => ({
              value: item?.id,
              label: item?.name,
            })) || [],
        };
        setDataPackage({ ...finalPackage });
      })
      .catch((e) => toastError(e));
  };

  const fetchCharterOwnerData = (content: string) => {
    let finalPackage: ACDataPackage = { ...dataPackage };

    getListCharterOwnersActionsApi({ ...paramsMaster, content })
      .then((r) => {
        finalPackage = {
          ...finalPackage,
          charterOwner:
            r?.data?.data?.map((item) => ({
              value: item.id,
              label: item.name,
            })) || [],
        };
        setDataPackage({ ...finalPackage });
      })
      .catch((e) => toastError(e));
  };

  // const fetchSDRData = (content: string) => {
  //   let finalPackage: ACDataPackage = { ...dataPackage };
  //   // err
  //   getListShipDepartmentsActionsApi({
  //     isRefreshLoading: false,
  //     paramsList: { ...paramsMaster, content },
  //   })
  //     .then((r) => {
  //       finalPackage = {
  //         ...finalPackage,
  //         shipDepartment:
  //           r?.data?.data?.map((item) => ({
  //             value: item.id,
  //             label: item.name,
  //           })) || [],
  //       };
  //       setDataPackage({ ...finalPackage });
  //     })
  //     .catch((e) => toastError(e));
  // };

  const fetchShipDepartmentData = (content: string) => {
    let finalPackage: ACDataPackage = { ...dataPackage };
    getListDepartmentMasterActionsApi({
      isRefreshLoading: false,
      ...paramsMaster,
      content,
      type: 'ship',
    })
      .then((r) => {
        finalPackage = {
          ...finalPackage,
          shipDepartment:
            r?.data?.data?.map((item) => ({
              value: item.id,
              label: item.name,
            })) || [],
        };
        setDataPackage({ ...finalPackage });
      })
      .catch((e) => toastError(e));
  };

  const fetchShipRanksData = (content: string) => {
    let finalPackage: ACDataPackage = { ...dataPackage };

    getListRankMasterActionsApi({
      isRefreshLoading: false,
      ...paramsMaster,
      content,
      type: 'ship',
    })
      .then((r) => {
        finalPackage = {
          ...finalPackage,
          shipRanks:
            r?.data?.data?.map((item) => ({
              value: item.id,
              label: item.name,
            })) || [],
        };
        setDataPackage({ ...finalPackage });
      })
      .catch((e) => toastError(e));
  };

  const fetchTopicsData = (content: string) => {
    let finalPackage: ACDataPackage = { ...dataPackage };

    getListTopicsActionsApi({ ...paramsMaster, content })
      .then((r) => {
        finalPackage = {
          ...finalPackage,
          topic:
            r?.data?.data?.map((item) => ({
              value: item.id,
              label: item.name,
            })) || [],
        };
        setDataPackage({ ...finalPackage });
      })
      .catch((e) => toastError(e));
  };

  const fetchShoreDepartmentData = (content: string) => {
    let finalPackage: ACDataPackage = { ...dataPackage };

    getListDepartmentMasterActionsApi({
      ...paramsMaster,
      content,
      type: 'shore',
    })
      .then((r) => {
        finalPackage = {
          ...finalPackage,
          shoreDepartment:
            r?.data?.data?.map((item) => ({
              value: item.id,
              label: item.name,
            })) || [],
        };
        setDataPackage({ ...finalPackage });
      })
      .catch((e) => toastError(e));
  };

  const fetchVIQData = (content: string) => {
    let finalPackage: ACDataPackage = { ...dataPackage };

    getListVIQsActionsApi({
      ...paramsMaster,
      content,
    })
      .then((r) => {
        finalPackage = {
          ...finalPackage,
          VIQ:
            r?.data?.data?.map((item) => ({
              value: item.id,
              label: item?.refNo,
            })) || [],
        };
        setDataPackage({ ...finalPackage });
      })
      .catch((e) => toastError(e));
  };

  const removeDataQuestionDetail = () => setQuestionDetail((prev) => null);

  useEffect(() => {
    let mounted = true;
    if (mounted) {
      fetchQuestionListData();
    }
    return () => {
      mounted = false;
    };
  }, [fetchQuestionListData]);

  useEffectOnce(() => {
    dispatch(
      getWorkFlowActiveUserPermissionActions.request({
        workflowType: WorkFlowType.AUDIT_CHECKLIST,
        isRefreshLoading: false,
      }),
    );
  });

  const fetchGeneralInfoData = async (timezone: string, mounted: boolean) => {
    if (mounted && !isCreatedInitialData) {
      if (
        history.location.pathname.includes(
          AppRouteConst.AUDIT_CHECKLIST_CREATE,
        ) &&
        !search
      ) {
        const codeResponse = await getAuditCheckListCodeApi({ timezone });
        setChkCode({
          code: codeResponse?.data?.code,
          verifySignature: codeResponse?.data?.verifySignature,
        });
      }
      const refCategoryResponse = await getReferencesCategoryApi({
        companyId: userInfo?.mainCompanyId,
      });
      setMasterDataOptions(refCategoryResponse?.data);
      dispatch(checkIsCreatedInitialData(true));
    }
  };

  useEffectOnce(() => {
    let mounted = true;
    const timezone = tz?.guess();
    setCurrentTimeZone(timezone);
    try {
      fetchGeneralInfoData(timezone, mounted);
    } catch (e) {
      toastError(e);
    }

    return () => {
      mounted = false;
    };
  });

  const DEFAULT_STATUS_ITEMS: Item[] = useMemo(
    () => [
      {
        id: ItemStatus.DRAFT,
        name: t('draft'),
        status: StepStatus.INACTIVE,
        info:
          statusHistory
            ?.filter((item) => item?.status === ItemStatus.DRAFT)
            ?.map((item) => ({
              datetime: item?.createdAt,
              name: item?.createdUser?.username,
              description: item?.createdUser?.jobTitle,
            })) || [],
      },
      {
        id: ItemStatus.SUBMITTED,
        name: t('submitted'),
        status: StepStatus.INACTIVE,

        info:
          statusHistory
            ?.filter((item) => item?.status === ItemStatus.SUBMITTED)
            ?.map((item) => ({
              datetime: item?.createdAt,
              name: item?.createdUser?.username,
              description: item?.createdUser?.jobTitle,
            })) || [],
      },
      {
        id: ItemStatus.REVIEWED,
        name: t('reviewed'),
        status: StepStatus.INACTIVE,
        info:
          statusHistory
            ?.filter((item) => item?.status === ItemStatus.REVIEWED)
            ?.map((item) => ({
              datetime: item?.createdAt,
              name: item?.createdUser?.username,
              description: item?.createdUser?.jobTitle,
            })) || [],
      },
      {
        id: ItemStatus.APPROVED,
        name: t('approved'),
        status: StepStatus.INACTIVE,
        info:
          statusHistory
            ?.filter((item) => item?.status === ItemStatus.APPROVED)
            ?.map((item) => ({
              datetime: item?.createdAt,
              name: item?.createdUser?.username,
              description: item?.createdUser?.jobTitle,
            })) || [],
      },
      {
        id: ItemStatus.CANCELLED,
        name: t('cancelled'),
        status: StepStatus.INACTIVE,

        info:
          statusHistory
            ?.filter((item) => item?.status === ItemStatus.CANCELLED)
            ?.map((item) => ({
              datetime: item?.createdAt,
              name: item?.createdUser?.username,
              description: item?.createdUser?.jobTitle,
            })) || [],
      },
    ],
    [statusHistory, t],
  );

  return {
    currentTimeZone,
    chkCode,
    masterDataOptions,
    loading,
    dataPackage,
    DEFAULT_STATUS_ITEMS,
    statusHistory,
    setStatusHistory,
    questionDetail,
    loadingQuestionDetail,
    removeDataQuestionDetail,
    setListRefCategory,
    fetchLocationData,
    fetchCategoryData,
    fetchVesselTypeData,
    fetchCDIData,
    fetchCharterOwnerData,
    // fetchSDRData,
    fetchShipRanksData,
    fetchShoreDepartmentData,
    fetchVIQData,
    fetchShoreRankData,
    fetchTopicsData,
    fetchShipDepartmentData,
    fetchShipDirectResponsibleData,
    setLoadingQuestionDetail,
    setQuestionDetailChecklist,
  };
};
