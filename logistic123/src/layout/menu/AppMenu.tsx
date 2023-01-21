import './app-menu.scss';

import {
  FeatureModule,
  ModuleConfiguration,
  ModuleQuality,
  PATH_FEATURE,
  PATH_FEATURE_CONFIGURATION,
  PATH_FEATURE_QUALITY,
  SOLVER_LINK,
} from 'constants/common.const';
import {
  Features,
  RoleScope,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { checkTextSearch } from 'helpers/utils.helper';
import { renderDynamicModuleLabel } from 'helpers/dynamic.helper';
import { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import Menu from 'antd/lib/menu';
import cx from 'classnames';
import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import { permissionCheck } from 'helpers/permissionCheck.helper';
import { useSelector } from 'react-redux';
import images from '../../assets/images/images';
import styles from './app-menu.module.scss';
import MenuItem from './menu-item/MenuItem';
import SearchBard from './search-bar/SearchBar';

const { SubMenu } = Menu;
const ICDown = images.icons.icDownArrow;
const ICUp = images.icons.icUpArrow;
interface AppMenuProps {
  isCollapsed?: boolean;
  setIsCollapsed?: () => void;
}
const AppMenu: FC<AppMenuProps> = ({ isCollapsed, setIsCollapsed }) => {
  const [currentUrl, setCurrentUrl] = useState<string>(
    history.location.pathname,
  );
  const [isShow, setIsShow] = useState<boolean>(isCollapsed || false);
  const [openKeys, setOpenKeys] = useState([]);
  const [search, setSearch] = useState<string>();
  const reportRef = useRef(null);
  const { userInfo } = useSelector((state) => state.authenticate);
  const { roleScope, rolePermissions, parentCompanyId } = userInfo || {};
  const menuRef = useRef(null);
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);

  // const isUserMain = useMemo(() => {
  //   if (roleScope === RoleScope.User) {
  //     return dataToken?.companyLevel === MAIN_COMPANY;
  //   }
  //   return false;
  // }, [dataToken, roleScope]);

  const permissionRoleMenu = (feature?: Features) => {
    let roleArray = rolePermissions ? [...rolePermissions] : [];
    // super admin
    if (roleScope === RoleScope.SuperAdmin) {
      switch (feature) {
        case Features.AUDIT_INSPECTION:
          return false;
        // case Features.CONFIGURATION:
        //   return false;
        case Features.QUALITY_ASSURANCE:
          return false;
        case Features.MASTER_DASHBOARD:
          return false;
        default:
          return true;
      }
    }

    // parent admin
    if (roleScope === RoleScope.Admin && !parentCompanyId) {
      roleArray = rolePermissions.filter(
        (roles) => !roles.includes(SubFeatures.GROUP_MASTER),
      );
    }

    // child  company
    if (
      roleScope === RoleScope.Admin &&
      !!parentCompanyId &&
      feature === Features.GROUP_COMPANY
    ) {
      return false;
    }

    // user
    if (roleScope === RoleScope.User) {
      switch (feature) {
        case Features.GROUP_COMPANY:
          return true;
        // case Features.USER_ROLE:
        //   return false;
        // case Features.QUALITY_ASSURANCE:
        //   return false;
        default:
          break;
      }
    }
    const dataFilter = roleArray
      ?.filter((i) => !i.includes('Configuration::DMS'))
      ?.filter(
        (item) =>
          item.includes(feature) &&
          checkTextSearch(search, item.split('::')[1]),
      );

    return !!dataFilter?.length;
  };

  const currentGroup = useMemo(() => {
    // WITH INTENTION: for readability
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(PATH_FEATURE)) {
      // Add more route path in PATH_FEATURE when add new menu Item
      if (
        typeof value === 'object' &&
        value.find((e) => currentUrl.includes(e))
      ) {
        return key;
      }
    }
    return FeatureModule.HOME_PAGE;
  }, [currentUrl]);

  const currentQuality = useMemo(() => {
    // WITH INTENTION: for readability
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(PATH_FEATURE_QUALITY)) {
      // Add more route path in PATH_FEATURE_QUALITY when add new menu Item in quality
      if (
        typeof value === 'object' &&
        value.find((e) => currentUrl.includes(e))
      ) {
        return key;
      }
    }

    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of Object.entries(PATH_FEATURE_CONFIGURATION)) {
      // Add more route path in PATH_FEATURE_CONFIGURATION when add new menu Item in quality
      if (
        typeof value === 'object' &&
        value.find((e) => currentUrl.includes(e))
      ) {
        return key;
      }
    }

    return null;
  }, [currentUrl]);

  const checkCollapsed = useCallback(
    (currentGroup: string) => {
      // todo
      if (!currentGroup) {
        return setOpenKeys([]);
      }
      switch (currentGroup) {
        case FeatureModule.AUDIT_INSPECTION:
          return setOpenKeys(['auditInspection']);
        case FeatureModule.CONFIGURATION: {
          if (currentQuality === ModuleConfiguration.COMMON) {
            return setOpenKeys(['configuration', 'configurationCommon']);
          }
          if (currentQuality === ModuleConfiguration.INSPECTION) {
            return setOpenKeys(['configuration', 'configurationInspection']);
          }
          return setOpenKeys(['configuration', 'configurationQA']);
        }
        case FeatureModule.GROUP_COMPANY:
          return setOpenKeys(['groupCompany']);
        case FeatureModule.USER_ROLE:
          return setOpenKeys(['UserRoles']);
        case FeatureModule.MASTER_DASHBOARD:
          return setOpenKeys(['mainDashboard']);
        case FeatureModule.HOME_PAGE:
          return setOpenKeys(['homepage']);
        case FeatureModule.QUALITY_ASSURANCE:
          if (currentQuality === ModuleQuality.QA_DASHBOARD) {
            return setOpenKeys(['qualityAssurance', 'dashboard']);
          }
          if (currentQuality === ModuleQuality.SELF_ASSESSMENT) {
            return setOpenKeys(['qualityAssurance', 'selfAssessment']);
          }
          if (currentQuality === ModuleQuality.SAILING_REPORT) {
            return setOpenKeys(['qualityAssurance', 'sailingReport']);
          }
          if (currentQuality === ModuleQuality.VESSEL_SCREENING) {
            return setOpenKeys(['qualityAssurance', 'vesselScreening']);
          }
          if (currentQuality === ModuleQuality.INCIDENTS) {
            return setOpenKeys(['qualityAssurance', 'incidents']);
          }

          if (currentQuality === ModuleQuality.PILOT_TERMINAL_FEEDBACK) {
            return setOpenKeys(['qualityAssurance', 'pilot-terminal-feedback']);
          }
          return setOpenKeys(['qualityAssurance']);

        default:
          return setOpenKeys([]);
      }
    },
    [currentQuality],
  );

  const toggleCollapsed = () => {
    setSearch('');
    checkCollapsed(currentGroup);
    setIsShow((e) => !e);
  };

  useEffect(() => {
    checkCollapsed(currentGroup);
  }, [checkCollapsed, currentGroup]);

  useEffect(
    () =>
      history.listen((location) => {
        setCurrentUrl(location?.pathname);
      }),
    [],
  );

  useEffect(() => {
    setIsCollapsed();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShow]);

  return (
    <div
      className={styles.appMenu}
      style={{
        width: isShow ? '60px' : '270px',
        transition: 'width 0.2s linear',
      }}
    >
      <div className={styles.contentContainer}>
        <div
          style={{
            left: isShow ? '45px' : '251px',
            transition: 'left 0.2s linear',
          }}
          className={cx(
            styles.collapsed,
            'd-flex  align-content-center ',
            !isShow ? 'justify-content-end' : 'justify-content-center',
          )}
        >
          <div onClick={toggleCollapsed}>
            <img
              sizes="24px"
              src={
                !isShow ? images.icons.icMenuApp : images.icons.icMenuAppExpand
              }
              alt="auditInspection"
              className={styles.iconCollapsed}
            />
          </div>
        </div>

        <div
          className={cx(styles.sidebar, {
            [styles.showSidebar]: !isShow,
          })}
        >
          {!isShow && <SearchBard permissionRoleMenu={permissionRoleMenu} />}

          <div>
            <Menu
              ref={menuRef}
              expandIcon={(e) =>
                e.isOpen ? (
                  <ICDown className={styles.iconExpand} />
                ) : (
                  <ICUp className={styles.iconExpand} />
                )
              }
              mode="inline"
              openKeys={openKeys}
              onOpenChange={(value) => {
                setOpenKeys(value);
              }}
              className={cx(styles.menu)}
              inlineCollapsed={isShow}
            >
              {userInfo?.roleScope !== RoleScope.SuperAdmin && (
                <SubMenu
                  key="homepage"
                  className={cx(
                    styles.subMenu,
                    styles.MenuContainerMasterDashBoard,
                    {
                      [styles.subActive]:
                        currentGroup === FeatureModule.HOME_PAGE,
                    },
                  )}
                  icon={
                    currentGroup === FeatureModule.HOME_PAGE ? (
                      <img
                        src={images.icons.menu.icHomepageActive}
                        alt="homepage"
                      />
                    ) : (
                      <img
                        src={images.icons.menu.icHomepageInActive}
                        alt="homepage"
                      />
                    )
                  }
                  title={
                    <div className={cx(styles.subTitle)}>
                      {renderDynamicModuleLabel(
                        listModuleDynamicLabels,
                        DynamicLabelModuleName.Homepage,
                      )}
                    </div>
                  }
                  onTitleClick={() => {
                    setCurrentUrl(AppRouteConst.HOME_PAGE);
                    history.push(AppRouteConst.HOME_PAGE);
                    setOpenKeys([]);
                  }}
                  popupClassName={styles.none}
                />
              )}
              {permissionCheck(
                userInfo,
                {
                  feature: Features.MASTER_DASHBOARD,
                  subFeature: SubFeatures.VIEW_DASHBOARD,
                },
                search,
              ) && (
                <SubMenu
                  key="mainDashboard"
                  className={cx(
                    styles.subMenu,
                    styles.MenuContainerMasterDashBoard,
                    {
                      [styles.subActive]:
                        currentGroup === FeatureModule.MASTER_DASHBOARD,
                    },
                  )}
                  icon={
                    currentGroup === FeatureModule.MASTER_DASHBOARD ? (
                      <img
                        src={images.icons.menu.icDashBoardActiveBlue}
                        alt="dashboard"
                      />
                    ) : (
                      <img
                        src={images.icons.menu.icDashboardInActive}
                        alt="dashboard"
                      />
                    )
                  }
                  title={
                    <div className={cx(styles.subTitle)}>
                      {renderDynamicModuleLabel(
                        listModuleDynamicLabels,
                        DynamicLabelModuleName.Dashboard,
                      )}
                    </div>
                  }
                  onTitleClick={() => {
                    setCurrentUrl(AppRouteConst.DASHBOARD_MASTER);
                    history.push(AppRouteConst.DASHBOARD_MASTER);
                    setOpenKeys([]);
                  }}
                  popupClassName={styles.none}
                />
              )}

              {/* auditInspection */}
              {permissionRoleMenu(Features.AUDIT_INSPECTION) && (
                <SubMenu
                  key="auditInspection"
                  className={cx(styles.subMenu, {
                    [styles.subActive]:
                      currentGroup === FeatureModule.AUDIT_INSPECTION,
                  })}
                  icon={
                    currentGroup === FeatureModule.AUDIT_INSPECTION ? (
                      <img
                        src={images.icons.menu.icGroupAuditActive}
                        alt="auditInspection"
                        className={styles.iconMenu}
                      />
                    ) : (
                      <img
                        src={images.icons.menu.icSearchInActive}
                        alt="auditInspection"
                        className={styles.iconMenu}
                      />
                    )
                  }
                  title={
                    <div className={cx(styles.subTitle)}>
                      {renderDynamicModuleLabel(
                        listModuleDynamicLabels,
                        DynamicLabelModuleName.AuditInspection,
                      )}
                    </div>
                  }
                >
                  {checkTextSearch(search, 'dashboard') &&
                    (permissionCheck(
                      userInfo,
                      {
                        feature: Features.AUDIT_INSPECTION,
                        subFeature: SubFeatures.VIEW_DASHBOARD,
                      },
                      search,
                    ) ||
                      userInfo?.roleScope === RoleScope.SuperAdmin) && (
                      <Menu.Item
                        ref={reportRef}
                        key={AppRouteConst.DASHBOARD}
                        className={styles.MenuItemAntd}
                      >
                        <MenuItem
                          content={renderDynamicModuleLabel(
                            listModuleDynamicLabels,
                            DynamicLabelModuleName.AuditInspectionDashboard,
                          )}
                          urlPage={AppRouteConst.DASHBOARD}
                          imagesActive={images.icons.menu.icDashboardActive}
                          imagesInActive={images.icons.menu.icDashboardInActive}
                          onClick={() => {
                            setCurrentUrl(AppRouteConst.DASHBOARD);
                          }}
                          isActive={
                            currentUrl === AppRouteConst.DASHBOARD ||
                            (currentUrl.includes(AppRouteConst.DASHBOARD) &&
                              !currentUrl.includes(
                                AppRouteConst.DASHBOARD_MASTER,
                              ) &&
                              !currentUrl.includes(
                                AppRouteConst.DASHBOARD_MASTER,
                              ))
                          }
                        />
                      </Menu.Item>
                    )}
                  {permissionCheck(
                    userInfo,
                    {
                      feature: Features.AUDIT_INSPECTION,
                      subFeature: SubFeatures.MAP_VIEW,
                    },
                    search,
                  ) && (
                    <Menu.Item
                      ref={reportRef}
                      key={AppRouteConst.MAP_VIEW}
                      className={styles.MenuItemAntd}
                    >
                      <MenuItem
                        content={renderDynamicModuleLabel(
                          listModuleDynamicLabels,
                          DynamicLabelModuleName.AuditInspectionMapView,
                        )}
                        urlPage={AppRouteConst.MAP_VIEW}
                        imagesActive={images.icons.menu.icMap}
                        imagesInActive={images.icons.menu.icMapInactive}
                        onClick={() => {
                          setCurrentUrl(AppRouteConst.MAP_VIEW);
                        }}
                        isActive={
                          currentUrl === AppRouteConst.MAP_VIEW ||
                          currentUrl.includes(AppRouteConst.MAP_VIEW)
                        }
                      />
                    </Menu.Item>
                  )}
                  {permissionCheck(
                    userInfo,
                    {
                      feature: Features.AUDIT_INSPECTION,
                      subFeature: SubFeatures.PLANNING_AND_REQUEST,
                    },
                    search,
                  ) && (
                    <Menu.Item
                      key={AppRouteConst.PLANNING}
                      className={styles.MenuItemAntd}
                    >
                      <MenuItem
                        imagesActive={images.icons.menu.icEditActive}
                        imagesInActive={images.icons.menu.icEditInActive}
                        content={renderDynamicModuleLabel(
                          listModuleDynamicLabels,
                          DynamicLabelModuleName.AuditInspectionPar,
                        )}
                        urlPage={`${AppRouteConst.PLANNING}?tab=graphicalPlanning`}
                        onClick={() => {
                          setCurrentUrl(AppRouteConst.PLANNING);
                        }}
                        isActive={
                          currentUrl === AppRouteConst.PLANNING ||
                          currentUrl.includes(AppRouteConst.PLANNING)
                        }
                      />
                    </Menu.Item>
                  )}
                  {permissionCheck(
                    userInfo,
                    {
                      feature: Features.AUDIT_INSPECTION,
                      subFeature: SubFeatures.AUDIT_TIME_TABLE,
                    },
                    search,
                  ) && (
                    <Menu.Item
                      key={AppRouteConst.AUDIT_TIME_TABLE}
                      className={styles.MenuItemAntd}
                    >
                      <MenuItem
                        imagesActive={images.icons.menu.icATTActive}
                        imagesInActive={images.icons.menu.icATT}
                        content={renderDynamicModuleLabel(
                          listModuleDynamicLabels,
                          DynamicLabelModuleName.AuditInspectionAuditTimeTable,
                        )}
                        urlPage={AppRouteConst.AUDIT_TIME_TABLE}
                        onClick={() => {
                          setCurrentUrl(AppRouteConst.AUDIT_TIME_TABLE);
                        }}
                        isActive={
                          currentUrl === AppRouteConst.AUDIT_TIME_TABLE ||
                          currentUrl.includes(AppRouteConst.AUDIT_TIME_TABLE)
                        }
                      />
                    </Menu.Item>
                  )}
                  {permissionCheck(
                    userInfo,
                    {
                      feature: Features.AUDIT_INSPECTION,
                      subFeature: SubFeatures.AUDIT_INSPECTION_WORKSPACE,
                    },
                    search,
                  ) && (
                    <Menu.Item
                      key={AppRouteConst.AUDIT_INSPECTION_WORKSPACE}
                      className={styles.MenuItemAntd}
                    >
                      <MenuItem
                        imagesActive={images.icons.menu.icAIWActive}
                        imagesInActive={images.icons.menu.icAIW}
                        content={renderDynamicModuleLabel(
                          listModuleDynamicLabels,
                          DynamicLabelModuleName.AuditInspectionInspectionWorkspace,
                        )}
                        urlPage={AppRouteConst.AUDIT_INSPECTION_WORKSPACE}
                        onClick={() => {
                          setCurrentUrl(
                            AppRouteConst.AUDIT_INSPECTION_WORKSPACE,
                          );
                        }}
                        isActive={
                          currentUrl ===
                            AppRouteConst.AUDIT_INSPECTION_WORKSPACE ||
                          currentUrl.includes(
                            AppRouteConst.AUDIT_INSPECTION_WORKSPACE,
                          )
                        }
                      />
                    </Menu.Item>
                  )}
                  {permissionCheck(
                    userInfo,
                    {
                      feature: Features.AUDIT_INSPECTION,
                      subFeature: SubFeatures.REPORT_OF_FINDING,
                    },
                    search,
                  ) && (
                    <Menu.Item
                      key={AppRouteConst.REPORT_OF_FINDING}
                      className={styles.MenuItemAntd}
                    >
                      <MenuItem
                        imagesActive={images.icons.menu.icMessageErrorActive}
                        imagesInActive={
                          images.icons.menu.icMessageErrorInActive
                        }
                        content={renderDynamicModuleLabel(
                          listModuleDynamicLabels,
                          DynamicLabelModuleName.AuditInspectionReportOfFinding,
                        )}
                        urlPage={AppRouteConst.REPORT_OF_FINDING}
                        onClick={() => {
                          setCurrentUrl(AppRouteConst.REPORT_OF_FINDING);
                        }}
                        isActive={
                          currentUrl === AppRouteConst.REPORT_OF_FINDING ||
                          currentUrl.includes(AppRouteConst.REPORT_OF_FINDING)
                        }
                      />
                    </Menu.Item>
                  )}
                  {permissionCheck(
                    userInfo,
                    {
                      feature: Features.AUDIT_INSPECTION,
                      subFeature: SubFeatures.INTERNAL_AUDIT_REPORT,
                    },
                    search,
                  ) && (
                    <Menu.Item
                      key={AppRouteConst.INTERNAL_AUDIT_REPORT}
                      className={styles.MenuItemAntd}
                    >
                      <MenuItem
                        imagesActive={images.icons.menu.icIARActive}
                        imagesInActive={images.icons.menu.icIAR}
                        content={renderDynamicModuleLabel(
                          listModuleDynamicLabels,
                          DynamicLabelModuleName.AuditInspectionInspectionReport,
                        )}
                        urlPage={AppRouteConst.INTERNAL_AUDIT_REPORT}
                        onClick={() => {
                          setCurrentUrl(AppRouteConst.INTERNAL_AUDIT_REPORT);
                        }}
                        isActive={
                          currentUrl === AppRouteConst.INTERNAL_AUDIT_REPORT ||
                          currentUrl.includes(
                            AppRouteConst.INTERNAL_AUDIT_REPORT,
                          )
                        }
                      />
                    </Menu.Item>
                  )}
                  {permissionCheck(
                    userInfo,
                    {
                      feature: Features.AUDIT_INSPECTION,
                      subFeature: SubFeatures.INSPECTION_FOLLOW_UP,
                    },
                    search,
                  ) && (
                    <Menu.Item
                      key={AppRouteConst.INSPECTION_FOLLOW_UP}
                      className={styles.MenuItemAntd}
                    >
                      <MenuItem
                        imagesActive={
                          images.icons.menu.icInspectionFollowUpActive
                        }
                        imagesInActive={images.icons.menu.icInspectionFollowUp}
                        content={renderDynamicModuleLabel(
                          listModuleDynamicLabels,
                          DynamicLabelModuleName.AuditInspectionInspectionFollowUp,
                        )}
                        urlPage={AppRouteConst.INSPECTION_FOLLOW_UP}
                        onClick={() => {
                          setCurrentUrl(AppRouteConst.INSPECTION_FOLLOW_UP);
                        }}
                        isActive={
                          currentUrl === AppRouteConst.INSPECTION_FOLLOW_UP ||
                          currentUrl.includes(
                            AppRouteConst.INSPECTION_FOLLOW_UP,
                          )
                        }
                      />
                    </Menu.Item>
                  )}
                </SubMenu>
              )}
              {/* qualityAssurance */}
              {permissionRoleMenu(Features.QUALITY_ASSURANCE) && (
                <SubMenu
                  key="qualityAssurance"
                  className={cx(styles.subMenu, {
                    [styles.subActive]:
                      currentGroup === FeatureModule.QUALITY_ASSURANCE,
                  })}
                  icon={
                    currentGroup === FeatureModule.QUALITY_ASSURANCE ? (
                      <img
                        src={images.icons.menu.icQualityAssuranceActive}
                        alt="qualityAssurance"
                        className={styles.iconMenu}
                      />
                    ) : (
                      <img
                        src={images.icons.menu.icQualityAssuranceInActive}
                        className={styles.iconMenu}
                        alt="qualityAssurance"
                      />
                    )
                  }
                  title={
                    <div className={cx(styles.subTitle)}>
                      {renderDynamicModuleLabel(
                        listModuleDynamicLabels,
                        DynamicLabelModuleName.QuantityAssurance,
                      )}
                    </div>
                  }
                >
                  {/* {permissionCheck(
                    userInfo,
                    {
                      feature: Features.QUALITY_ASSURANCE,
                      subFeature: SubFeatures.QA_DASHBOARD,
                    },
                    search,
                  ) && (
                    <Menu.Item
                      ref={reportRef}
                      key={AppRouteConst.QA_DASHBOARD}
                      className={cx(
                        styles.MenuItemAntd,
                        styles.margin0,
                        styles.svgQA,
                      )}
                    >
                      <MenuItem
                        content={t('sidebar.qaDashboard')}
                        urlPage={AppRouteConst.QA_DASHBOARD}
                        imagesActive={images.icons.menu.icDashboardActive}
                        imagesInActive={images.icons.menu.icDashboardInActive}
                        onClick={() => {
                          setCurrentUrl(AppRouteConst.QA_DASHBOARD);
                        }}
                        isActive={currentUrl === AppRouteConst.QA_DASHBOARD}
                        contentStyle={styles.fontSize20px}
                      />
                    </Menu.Item>
                  )} */}
                  {/* second submenu quality self assessment */}
                  {permissionCheck(
                    userInfo,
                    {
                      feature: Features.QUALITY_ASSURANCE,
                      subFeature: SubFeatures.SELF_ASSESSMENT_SUB_FEATURE,
                    },
                    search,
                  ) && (
                    <SubMenu
                      key="selfAssessment"
                      className={cx(
                        styles.subMenuQuality,
                        {
                          submenu_quality_active:
                            currentQuality === ModuleQuality.SELF_ASSESSMENT,
                        },
                        'submenu_quality',
                      )}
                      icon={
                        currentQuality === ModuleQuality.SELF_ASSESSMENT ? (
                          <img
                            src={images.icons.master.icSelfAssessmentWhite}
                            alt="selfAssessment"
                            className={styles.iconMenu}
                          />
                        ) : (
                          <img
                            src={images.icons.master.icSelfAssessmentGray}
                            className={styles.iconMenu}
                            alt="selfAssessment"
                          />
                        )
                      }
                      title={renderDynamicModuleLabel(
                        listModuleDynamicLabels,
                        DynamicLabelModuleName.QuantityAssuranceSelfAssessment,
                      )}
                    >
                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.QUALITY_ASSURANCE,
                          subFeature: SubFeatures.STANDARD_MASTER,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.STANDARD_MASTER}
                          className={cx(styles.MenuItemAntd)}
                        >
                          <MenuItem
                            imagesActive={
                              images.icons.master.icMasterStandardMasterActive
                            }
                            imagesInActive={
                              images.icons.master.icMasterStandardMasterInActive
                            }
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.QuantityAssuranceSelfAssessmentStamdardMaster,
                            )}
                            urlPage={AppRouteConst.STANDARD_MASTER}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.STANDARD_MASTER);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.STANDARD_MASTER ||
                              currentUrl.includes(AppRouteConst.STANDARD_MASTER)
                            }
                            isQuality
                          />
                        </Menu.Item>
                      )}

                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.QUALITY_ASSURANCE,
                          subFeature: SubFeatures.ELEMENT_MASTER,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.ELEMENT_MASTER}
                          className={cx(styles.MenuItemAntd)}
                        >
                          <MenuItem
                            imagesActive={
                              images.icons.menu.icElementMasterActive
                            }
                            imagesInActive={
                              images.icons.menu.icElementMasterInActive
                            }
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.QuantityAssuranceSelfAssessmentElementMaster,
                            )}
                            urlPage={AppRouteConst.ELEMENT_MASTER}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.ELEMENT_MASTER);
                            }}
                            isQuality
                            isActive={
                              currentUrl === AppRouteConst.ELEMENT_MASTER ||
                              currentUrl.includes(AppRouteConst.ELEMENT_MASTER)
                            }
                          />
                        </Menu.Item>
                      )}

                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.QUALITY_ASSURANCE,
                          subFeature: SubFeatures.SELF_ASSESSMENT,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.SELF_ASSESSMENT}
                          className={cx(styles.MenuItemAntd)}
                        >
                          <MenuItem
                            imagesActive={
                              images.icons.master.icSelfAssessmentBlue
                            }
                            imagesInActive={
                              images.icons.master.icSelfAssessmentGray
                            }
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.QuantityAssuranceSelfAssessmentSelfAssessment,
                            )}
                            urlPage={AppRouteConst.SELF_ASSESSMENT}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.SELF_ASSESSMENT);
                            }}
                            isQuality
                            isActive={
                              currentUrl === AppRouteConst.SELF_ASSESSMENT ||
                              currentUrl.includes(AppRouteConst.SELF_ASSESSMENT)
                            }
                          />
                        </Menu.Item>
                      )}
                    </SubMenu>
                  )}

                  {/* second submenu quality sailing Report */}
                  {permissionCheck(
                    userInfo,
                    {
                      feature: Features.QUALITY_ASSURANCE,
                      subFeature: SubFeatures.SAILING_REPORT,
                    },
                    search,
                  ) && (
                    <SubMenu
                      key="sailingReport"
                      className={cx(
                        styles.subMenuQuality,
                        {
                          submenu_quality_active:
                            currentQuality === ModuleQuality.SAILING_REPORT,
                        },
                        'submenu_quality',
                      )}
                      icon={
                        currentQuality === ModuleQuality.SAILING_REPORT ? (
                          <img
                            src={images.icons.menu.icSailReportingActive}
                            alt="sailingReport"
                            className={cx(styles.iconMenu)}
                          />
                        ) : (
                          <img
                            src={images.icons.menu.icSailReportingInActive}
                            className={cx(styles.iconMenu)}
                            alt="sailingReport"
                          />
                        )
                      }
                      title={renderDynamicModuleLabel(
                        listModuleDynamicLabels,
                        DynamicLabelModuleName.QuantityAssuranceSailingReport,
                      )}
                    >
                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.QUALITY_ASSURANCE,
                          subFeature: SubFeatures.SAIL_GENERAL_REPORT,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.SAIL_GENERAL_REPORT}
                          className={cx(styles.MenuItemAntd)}
                        >
                          <MenuItem
                            imagesActive={
                              images.icons.master.icMasterStandardMasterActive
                            }
                            imagesInActive={
                              images.icons.master.icMasterStandardMasterInActive
                            }
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.QuantityAssuranceSailingReportSailingGeneralReport,
                            )}
                            urlPage={AppRouteConst.SAIL_GENERAL_REPORT}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.SAIL_GENERAL_REPORT);
                            }}
                            isActive={
                              currentUrl ===
                                AppRouteConst.SAIL_GENERAL_REPORT ||
                              currentUrl.includes(
                                AppRouteConst.SAIL_GENERAL_REPORT,
                              )
                            }
                            isQuality
                          />
                        </Menu.Item>
                      )}
                    </SubMenu>
                  )}

                  {/* second submenu quality incidents */}
                  {permissionCheck(
                    userInfo,
                    {
                      feature: Features.QUALITY_ASSURANCE,
                      subFeature: SubFeatures.INCIDENTS_SUB_FEATURE,
                    },
                    search,
                  ) && (
                    <SubMenu
                      key="incidents"
                      className={cx(
                        styles.subMenuQuality,
                        {
                          submenu_quality_active:
                            currentQuality === ModuleQuality.INCIDENTS,
                        },
                        'submenu_quality',
                      )}
                      icon={
                        currentQuality === ModuleQuality.INCIDENTS ? (
                          <img
                            src={images.icons.menu.icIncidentsActive}
                            alt="incidents"
                            className={cx(styles.iconMenu, styles.iconSmall)}
                          />
                        ) : (
                          <img
                            src={images.icons.menu.icIncidentsInActive}
                            className={cx(styles.iconMenu, styles.iconSmall)}
                            alt="incidents"
                          />
                        )
                      }
                      title={renderDynamicModuleLabel(
                        listModuleDynamicLabels,
                        DynamicLabelModuleName.QuantityAssuranceIncidents,
                      )}
                    >
                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.QUALITY_ASSURANCE,
                          subFeature: SubFeatures.INCIDENTS_SUMMARY,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.INCIDENTS_SUMMARY}
                          className={styles.MenuItemAntd}
                        >
                          <MenuItem
                            imagesActive={
                              images.icons.menu.icSummaryIncidentActive
                            }
                            imagesInActive={
                              images.icons.menu.icSummaryIncidentInActive
                            }
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.QuantityAssuranceIncidentsSummary,
                            )}
                            urlPage={AppRouteConst.INCIDENTS_SUMMARY}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.INCIDENTS_SUMMARY);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.INCIDENTS_SUMMARY ||
                              currentUrl.includes(
                                AppRouteConst.INCIDENTS_SUMMARY,
                              )
                            }
                            isQuality
                          />
                        </Menu.Item>
                      )}
                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.QUALITY_ASSURANCE,
                          subFeature: SubFeatures.INCIDENTS,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.INCIDENTS}
                          className={styles.MenuItemAntd}
                        >
                          <MenuItem
                            imagesActive={
                              images.icons.menu.icIncidentsSubActive
                            }
                            imagesInActive={
                              images.icons.menu.icIncidentsInActive
                            }
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.QuantityAssuranceIncidentsIncidents,
                            )}
                            urlPage={AppRouteConst.INCIDENTS}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.INCIDENTS);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.INCIDENTS ||
                              currentUrl.includes(AppRouteConst.INCIDENTS)
                            }
                            isQuality
                          />
                        </Menu.Item>
                      )}
                    </SubMenu>
                  )}

                  {/* second submenu quality pilot terminal feedback */}
                  {permissionCheck(
                    userInfo,
                    {
                      feature: Features.QUALITY_ASSURANCE,
                      subFeature: SubFeatures.PILOT_TERMINAL_FEEDBACK,
                    },
                    search,
                  ) && (
                    <SubMenu
                      key="pilot-terminal-feedback"
                      className={cx(
                        styles.subMenuQuality,
                        {
                          submenu_quality_active:
                            currentQuality ===
                            ModuleQuality.PILOT_TERMINAL_FEEDBACK,
                        },
                        'submenu_quality',
                      )}
                      icon={
                        currentQuality ===
                        ModuleQuality.PILOT_TERMINAL_FEEDBACK ? (
                          <img
                            src={images.icons.menu.icPilotFeatureActive}
                            alt="sailingReport"
                            className={cx(styles.iconMenu, styles.fixMarginTop)}
                          />
                        ) : (
                          <img
                            src={images.icons.menu.icPilotFeatureInActive}
                            className={cx(styles.iconMenu, styles.fixMarginTop)}
                            alt="sailingReport"
                          />
                        )
                      }
                      title={renderDynamicModuleLabel(
                        listModuleDynamicLabels,
                        DynamicLabelModuleName.QuantityAssurancePilotTerminalFeedback,
                      )}
                    >
                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.QUALITY_ASSURANCE,
                          subFeature: SubFeatures.PILOT_TERMINAL_FEEDBACK,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.PILOT_TERMINAL_FEEDBACK}
                          className={cx(styles.MenuItemAntd)}
                        >
                          <MenuItem
                            imagesActive={
                              images.icons.menu.icPilotSubFeatureActive
                            }
                            imagesInActive={
                              images.icons.menu.icPilotFeatureInActive
                            }
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.QuantityAssurancePilotTerminalFeedbackPilotTerminalFeedback,
                            )}
                            urlPage={AppRouteConst.PILOT_TERMINAL_FEEDBACK}
                            onClick={() => {
                              setCurrentUrl(
                                AppRouteConst.PILOT_TERMINAL_FEEDBACK,
                              );
                            }}
                            isActive={
                              currentUrl ===
                                AppRouteConst.PILOT_TERMINAL_FEEDBACK ||
                              currentUrl.includes(
                                AppRouteConst.PILOT_TERMINAL_FEEDBACK,
                              )
                            }
                            isQuality
                          />
                        </Menu.Item>
                      )}
                    </SubMenu>
                  )}

                  {/* second submenu quality vessel screening */}
                  {permissionCheck(
                    userInfo,
                    {
                      feature: Features.QUALITY_ASSURANCE,
                      subFeature: SubFeatures.VESSEL_SCREENING_SUB_FEATURE,
                    },
                    search,
                  ) && (
                    <SubMenu
                      key="vesselScreening"
                      className={cx(
                        styles.subMenuQuality,
                        {
                          submenu_quality_active:
                            currentQuality === ModuleQuality.VESSEL_SCREENING,
                        },
                        'submenu_quality',
                      )}
                      icon={
                        currentQuality === ModuleQuality.VESSEL_SCREENING ? (
                          <img
                            src={images.icons.master.icBoatWhite}
                            alt="vesselScreening"
                            className={styles.iconMenu}
                          />
                        ) : (
                          <img
                            src={images.icons.master.icBoatGray}
                            className={styles.iconMenu}
                            alt="vesselScreening"
                          />
                        )
                      }
                      title={renderDynamicModuleLabel(
                        listModuleDynamicLabels,
                        DynamicLabelModuleName.QuantityAssuranceVesselScreening,
                      )}
                    >
                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.QUALITY_ASSURANCE,
                          subFeature: SubFeatures.VESSEL_SCREENING,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.VESSEL_SCREENING}
                          className={styles.MenuItemAntd}
                        >
                          <MenuItem
                            imagesActive={images.icons.master.icBoatBlue}
                            imagesInActive={images.icons.master.icBoatGray}
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.QuantityAssuranceVesselScreeningVesselScreening,
                            )}
                            urlPage={AppRouteConst.VESSEL_SCREENING}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.VESSEL_SCREENING);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.VESSEL_SCREENING ||
                              currentUrl.includes(
                                AppRouteConst.VESSEL_SCREENING,
                              )
                            }
                            isQuality
                          />
                        </Menu.Item>
                      )}
                    </SubMenu>
                  )}
                </SubMenu>
              )}

              {/* groupCompany */}

              {(userInfo?.roleScope === RoleScope.SuperAdmin ||
                (permissionRoleMenu(Features.GROUP_COMPANY) &&
                  userInfo?.rolePermissions?.some((item) =>
                    item?.includes(`${Features.GROUP_COMPANY}::`),
                  ))) && (
                <SubMenu
                  key="groupCompany"
                  className={cx(styles.subMenu, {
                    [styles.subActive]:
                      currentGroup === FeatureModule.GROUP_COMPANY,
                  })}
                  icon={
                    currentGroup === FeatureModule.GROUP_COMPANY ? (
                      <img
                        src={images.icons.menu.icGroupCompanyActive}
                        alt="groupCompany"
                        className={styles.iconMenu}
                      />
                    ) : (
                      <img
                        src={images.icons.menu.icCompanyManagement}
                        alt="groupCompany"
                        className={styles.iconMenu}
                      />
                    )
                  }
                  title={
                    <div className={cx(styles.subTitle)}>
                      {renderDynamicModuleLabel(
                        listModuleDynamicLabels,
                        DynamicLabelModuleName.GroupCompany,
                      )}
                    </div>
                  }
                >
                  {(userInfo?.roleScope === RoleScope.SuperAdmin ||
                    permissionCheck(
                      userInfo,
                      {
                        feature: Features.GROUP_COMPANY,
                        subFeature: SubFeatures.COMPANY_TYPE,
                      },
                      search,
                    )) && (
                    <Menu.Item
                      key={AppRouteConst.COMPANY_TYPE}
                      className={styles.MenuItemAntd}
                    >
                      <MenuItem
                        imagesActive={images.icons.menu.icCompanyTypeActive}
                        imagesInActive={images.icons.menu.icCompanyTypeInActive}
                        content={renderDynamicModuleLabel(
                          listModuleDynamicLabels,
                          DynamicLabelModuleName.GroupCompanyCompanyType,
                        )}
                        urlPage={AppRouteConst.COMPANY_TYPE}
                        onClick={() => {
                          setCurrentUrl(AppRouteConst.COMPANY_TYPE);
                        }}
                        isActive={currentUrl === AppRouteConst.COMPANY_TYPE}
                      />
                    </Menu.Item>
                  )}

                  {permissionCheck(
                    userInfo,
                    {
                      feature: Features.GROUP_COMPANY,
                      subFeature: SubFeatures.COMPANY,
                    },
                    search,
                  ) && (
                    <Menu.Item
                      key={AppRouteConst.COMPANY}
                      className={styles.MenuItemAntd}
                    >
                      <MenuItem
                        imagesActive={
                          images.icons.menu.icCompanyManagementActive
                        }
                        imagesInActive={images.icons.menu.icCompanyManagement}
                        content={renderDynamicModuleLabel(
                          listModuleDynamicLabels,
                          DynamicLabelModuleName.GroupCompanyCompany,
                        )}
                        urlPage={AppRouteConst.COMPANY}
                        onClick={() => {
                          setCurrentUrl(AppRouteConst.COMPANY);
                        }}
                        isActive={
                          currentUrl === AppRouteConst.COMPANY ||
                          currentUrl.includes(AppRouteConst.COMPANY)
                        }
                      />
                    </Menu.Item>
                  )}

                  {permissionCheck(
                    userInfo,
                    {
                      feature: Features.GROUP_COMPANY,
                      subFeature: SubFeatures.GROUP_MASTER,
                    },
                    search,
                  ) && (
                    <Menu.Item
                      key={AppRouteConst.GROUP}
                      className={styles.MenuItemAntd}
                    >
                      <MenuItem
                        imagesActive={images.icons.menu.icGroupManagementActive}
                        imagesInActive={images.icons.menu.icGroupManagement}
                        content="Group master"
                        urlPage={AppRouteConst.GROUP}
                        onClick={() => {
                          setCurrentUrl(AppRouteConst.GROUP);
                        }}
                        isActive={
                          currentUrl === AppRouteConst.GROUP ||
                          currentUrl.includes(AppRouteConst.GROUP)
                        }
                      />
                    </Menu.Item>
                  )}
                </SubMenu>
              )}
              {/* UserRoles */}
              {permissionRoleMenu(Features.USER_ROLE) && (
                <SubMenu
                  key="UserRoles"
                  className={cx(styles.subMenu, {
                    [styles.subActive]:
                      currentGroup === FeatureModule.USER_ROLE,
                  })}
                  icon={
                    currentGroup === FeatureModule.USER_ROLE ? (
                      <img
                        src={images.icons.menu.icGroupUserActive}
                        alt="UserRoles"
                        className={styles.iconMenu}
                      />
                    ) : (
                      <img
                        src={images.icons.menu.icUserCircle}
                        className={styles.iconMenu}
                        alt="UserRoles"
                      />
                    )
                  }
                  title={
                    <div className={cx(styles.subTitle)}>
                      {renderDynamicModuleLabel(
                        listModuleDynamicLabels,
                        DynamicLabelModuleName.UserRoles,
                      )}
                    </div>
                  }
                >
                  {permissionCheck(
                    userInfo,
                    {
                      feature: Features.USER_ROLE,
                      subFeature: SubFeatures.ROLE_AND_PERMISSION,
                    },
                    search,
                  ) && (
                    <Menu.Item
                      key={AppRouteConst.ROLE}
                      className={styles.MenuItemAntd}
                    >
                      <MenuItem
                        imagesActive={images.icons.menu.icUserPinActive}
                        imagesInActive={images.icons.menu.icUserPinInActive}
                        content={renderDynamicModuleLabel(
                          listModuleDynamicLabels,
                          DynamicLabelModuleName.UserRolesRoleAndPermission,
                        )}
                        urlPage={AppRouteConst.ROLE}
                        onClick={() => {
                          setCurrentUrl(AppRouteConst.ROLE);
                        }}
                        isActive={
                          currentUrl === AppRouteConst.ROLE ||
                          currentUrl.includes(AppRouteConst.ROLE)
                        }
                      />
                    </Menu.Item>
                  )}

                  {permissionCheck(
                    userInfo,
                    {
                      feature: Features.USER_ROLE,
                      subFeature: SubFeatures.USER,
                    },
                    search,
                  ) && (
                    <Menu.Item
                      key={AppRouteConst.USER}
                      className={styles.MenuItemAntd}
                    >
                      <MenuItem
                        imagesActive={images.icons.menu.icUserManagementActive}
                        imagesInActive={
                          images.icons.menu.icUserManagementInActive
                        }
                        content={renderDynamicModuleLabel(
                          listModuleDynamicLabels,
                          DynamicLabelModuleName.UserRolesUser,
                        )}
                        urlPage={AppRouteConst.USER}
                        onClick={() => {
                          setCurrentUrl(AppRouteConst.USER);
                        }}
                        isActive={
                          currentUrl === AppRouteConst.USER ||
                          currentUrl.includes(AppRouteConst.USER)
                        }
                      />
                    </Menu.Item>
                  )}
                </SubMenu>
              )}

              {/* configuration */}

              {permissionRoleMenu(Features.CONFIGURATION) && (
                <SubMenu
                  key="configuration"
                  className={cx(styles.subMenu, styles.configuration, {
                    [styles.subActive]:
                      currentGroup === FeatureModule.CONFIGURATION,
                  })}
                  popupClassName={
                    roleScope === RoleScope.Admin
                      ? 'menu--configuration__admin'
                      : 'menu--configuration'
                  }
                  icon={
                    currentGroup === FeatureModule.CONFIGURATION ? (
                      <img
                        src={images.icons.menu.icGroupConfiguration}
                        alt="configuration"
                        className={styles.iconMenu}
                      />
                    ) : (
                      <img
                        src={images.icons.menu.icGroupConfigurationInactive}
                        alt="configuration"
                        className={styles.iconMenu}
                      />
                    )
                  }
                  title={
                    <div className={cx(styles.subTitle)}>
                      {renderDynamicModuleLabel(
                        listModuleDynamicLabels,
                        DynamicLabelModuleName.Configuration,
                      )}
                    </div>
                  }
                >
                  {/* Country Master */}
                  {userInfo?.roleScope === RoleScope.SuperAdmin && (
                    <Menu.Item
                      key={AppRouteConst.COUNTRY}
                      className={styles.MenuItemAntd}
                    >
                      <MenuItem
                        imagesActive={images.icons.menu.icCountryMaster}
                        imagesInActive={
                          images.icons.menu.icCountryMasterInactive
                        }
                        content="Country master"
                        urlPage={AppRouteConst.COUNTRY}
                        onClick={() => {
                          setCurrentUrl(AppRouteConst.COUNTRY);
                        }}
                        isActive={currentUrl === AppRouteConst.COUNTRY}
                      />
                    </Menu.Item>
                  )}

                  {/* Module Configuration */}
                  {userInfo?.roleScope === RoleScope.SuperAdmin && (
                    <Menu.Item
                      key={AppRouteConst.MODULE_CONFIGURATION}
                      className={styles.MenuItemAntd}
                    >
                      <MenuItem
                        imagesActive={images.icons.menu.icModuleSideBarActive}
                        imagesInActive={images.icons.menu.icModuleSideBar}
                        content="Module Configuration"
                        urlPage={AppRouteConst.MODULE_CONFIGURATION}
                        onClick={() => {
                          setCurrentUrl(AppRouteConst.MODULE_CONFIGURATION);
                        }}
                        isActive={currentUrl.includes(
                          AppRouteConst.MODULE_CONFIGURATION,
                        )}
                      />
                    </Menu.Item>
                  )}
                  {permissionCheck(
                    userInfo,
                    {
                      feature: Features.CONFIGURATION,
                      subFeature: SubFeatures.CONFIGURATION_COMMON_SUB_FEATURES,
                    },
                    search,
                  ) && (
                    <SubMenu
                      key="configurationCommon"
                      className={cx(
                        styles.subMenuQuality,
                        {
                          submenu_quality_active:
                            currentQuality === ModuleConfiguration.COMMON,
                        },
                        'submenu_quality',
                      )}
                      icon={
                        currentQuality === ModuleConfiguration.COMMON ? (
                          <img
                            src={images.icons.menu.icConfigurationCommonActive}
                            alt="icConfigurationCommonActive"
                            className={styles.iconMenu}
                          />
                        ) : (
                          <img
                            src={images.icons.menu.icConfigurationCommon}
                            className={styles.iconMenu}
                            alt="icConfigurationCommon"
                          />
                        )
                      }
                      title={renderDynamicModuleLabel(
                        listModuleDynamicLabels,
                        DynamicLabelModuleName.ConfigurationCommon,
                      )}
                    >
                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.CREW_GROUPING,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.CREW_GROUPING}
                          className={styles.MenuItemAntd}
                        >
                          <MenuItem
                            isQuality
                            imagesActive={
                              images.icons.menu.icCrewGroupingActive
                            }
                            imagesInActive={images.icons.menu.icCrewGrouping}
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.ConfigurationCommonCrewGrouping,
                            )}
                            urlPage={AppRouteConst.CREW_GROUPING}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.CREW_GROUPING);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.CREW_GROUPING
                            }
                          />
                        </Menu.Item>
                      )}
                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.DIVISION,
                        },
                        search,
                      ) && (
                        <Menu.Item className={styles.MenuItemAntd}>
                          <MenuItem
                            isQuality
                            imagesActive={images.icons.menu.icDivision}
                            imagesInActive={
                              images.icons.menu.icDivisionInactive
                            }
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.ConfigurationCommonDivision,
                            )}
                            urlPage={AppRouteConst.DIVISION}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.DIVISION);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.DIVISION ||
                              currentUrl.includes(AppRouteConst.DIVISION)
                            }
                          />
                        </Menu.Item>
                      )}

                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.DEPARTMENT_MASTER,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.DEPARTMENT_MASTER}
                          className={styles.MenuItemAntd}
                        >
                          <MenuItem
                            isQuality
                            imagesActive={
                              images.icons.menu.icShipDepartmentActive
                            }
                            imagesInActive={
                              images.icons.menu.icShipDepartmentInActive
                            }
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.ConfigurationCommonDepartment,
                            )}
                            urlPage={AppRouteConst.DEPARTMENT_MASTER}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.DEPARTMENT_MASTER);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.DEPARTMENT_MASTER ||
                              currentUrl.includes(
                                AppRouteConst.DEPARTMENT_MASTER,
                              )
                            }
                          />
                        </Menu.Item>
                      )}

                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.DIVISION_MAPPING,
                        },
                        search,
                      ) && (
                        <Menu.Item className={styles.MenuItemAntd}>
                          <MenuItem
                            isQuality
                            imagesActive={
                              images.icons.menu.icDivisionMapingActive
                            }
                            imagesInActive={images.icons.menu.icDivisionMapping}
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.ConfigurationCommonDivisionMapping,
                            )}
                            urlPage={AppRouteConst.DIVISION_MAPPING}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.DIVISION_MAPPING);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.DIVISION_MAPPING ||
                              currentUrl.includes(
                                AppRouteConst.DIVISION_MAPPING,
                              )
                            }
                          />
                        </Menu.Item>
                      )}

                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.AUDIT_TYPE,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.AUDIT_TYPE}
                          className={styles.MenuItemAntd}
                        >
                          <MenuItem
                            isQuality
                            imagesActive={images.icons.menu.icAuditTypeActive}
                            imagesInActive={
                              images.icons.menu.icAuditTypeInActive
                            }
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.ConfigurationCommonAudittype,
                            )}
                            urlPage={AppRouteConst.AUDIT_TYPE}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.AUDIT_TYPE);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.AUDIT_TYPE ||
                              currentUrl.includes(AppRouteConst.AUDIT_TYPE)
                            }
                          />
                        </Menu.Item>
                      )}
                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.LOCATION_MASTER,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.LOCATION}
                          className={styles.MenuItemAntd}
                        >
                          <MenuItem
                            isQuality
                            imagesActive={images.icons.menu.icLocationActive}
                            imagesInActive={
                              images.icons.menu.icLocationInActive
                            }
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.ConfigurationCommonLocationmaster,
                            )}
                            urlPage={AppRouteConst.LOCATION}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.LOCATION);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.LOCATION ||
                              currentUrl.includes(AppRouteConst.LOCATION)
                            }
                          />
                        </Menu.Item>
                      )}

                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.MAIN_CATEGORY,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.MAIN_CATEGORY}
                          className={styles.MenuItemAntd}
                        >
                          <MenuItem
                            isQuality
                            imagesActive={images.icons.menu.icCategoryActive}
                            imagesInActive={
                              images.icons.menu.icCategoryInActive
                            }
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.ConfigurationCommonMaincategory,
                            )}
                            urlPage={AppRouteConst.MAIN_CATEGORY}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.MAIN_CATEGORY);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.MAIN_CATEGORY ||
                              currentUrl.includes(AppRouteConst.MAIN_CATEGORY)
                            }
                          />
                        </Menu.Item>
                      )}
                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.PORT_MASTER,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.PORT}
                          className={styles.MenuItemAntd}
                        >
                          <MenuItem
                            isQuality
                            imagesActive={images.icons.menu.icPortActive}
                            imagesInActive={images.icons.menu.icPort}
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.ConfigurationCommonPortmaster,
                            )}
                            urlPage={AppRouteConst.PORT}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.PORT);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.PORT ||
                              currentUrl.includes(AppRouteConst.PORT)
                            }
                          />
                        </Menu.Item>
                      )}
                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.VESSEL,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.VESSEL}
                          className={styles.MenuItemAntd}
                        >
                          <MenuItem
                            isQuality
                            imagesActive={
                              images.icons.menu.icVesselManagementActive
                            }
                            imagesInActive={
                              images.icons.menu.icVesselManagement
                            }
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.ConfigurationCommonVessel,
                            )}
                            urlPage={AppRouteConst.VESSEL}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.VESSEL);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.VESSEL ||
                              currentUrl.includes(AppRouteConst.VESSEL)
                            }
                          />
                        </Menu.Item>
                      )}

                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.VIQ,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.VIQ}
                          className={styles.MenuItemAntd}
                        >
                          <MenuItem
                            isQuality
                            imagesActive={images.icons.menu.icVIQActive}
                            imagesInActive={images.icons.menu.icVIQInactive}
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.ConfigurationCommonVesselinspectionQuestionnaire,
                            )}
                            urlPage={AppRouteConst.VIQ}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.VIQ);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.VIQ ||
                              currentUrl.includes(AppRouteConst.VIQ)
                            }
                          />
                        </Menu.Item>
                      )}

                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.VESSEL_TYPE,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.VESSEL_TYPE}
                          className={styles.MenuItemAntd}
                        >
                          <MenuItem
                            isQuality
                            imagesActive={images.icons.menu.icVesselTypeActive}
                            imagesInActive={images.icons.menu.icVesselType}
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.ConfigurationCommonVesseltype,
                            )}
                            urlPage={AppRouteConst.VESSEL_TYPE}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.VESSEL_TYPE);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.VESSEL_TYPE ||
                              currentUrl.includes(AppRouteConst.VESSEL_TYPE)
                            }
                          />
                        </Menu.Item>
                      )}
                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.WORKFLOW_CONFIGURATION,
                        },
                        search,
                      ) && (
                        <Menu.Item className={styles.MenuItemAntd}>
                          <MenuItem
                            isQuality
                            imagesActive={images.icons.menu.icWorkflowActive}
                            imagesInActive={images.icons.menu.icWorkflow}
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.ConfigurationCommonWorkflowConfiguration,
                            )}
                            urlPage={AppRouteConst.WORK_FLOW}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.WORK_FLOW);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.WORK_FLOW ||
                              currentUrl.includes(AppRouteConst.WORK_FLOW)
                            }
                          />
                        </Menu.Item>
                      )}
                    </SubMenu>
                  )}
                  {permissionCheck(
                    userInfo,
                    {
                      feature: Features.CONFIGURATION,
                      subFeature:
                        SubFeatures.CONFIGURATION_INSPECTION_SUB_FEATURES,
                    },
                    search,
                  ) && (
                    <SubMenu
                      key="configurationInspection"
                      className={cx(
                        styles.subMenuQuality,
                        {
                          submenu_quality_active:
                            currentQuality === ModuleConfiguration.INSPECTION,
                        },
                        'submenu_quality',
                      )}
                      icon={
                        currentQuality === ModuleConfiguration.INSPECTION ? (
                          <img
                            src={images.icons.menu.icSearchInMenuActive}
                            alt="selfAssessment"
                            className={styles.iconMenu}
                          />
                        ) : (
                          <img
                            src={images.icons.menu.icSearchInActive}
                            className={styles.iconMenu}
                            alt="selfAssessment"
                          />
                        )
                      }
                      title={renderDynamicModuleLabel(
                        listModuleDynamicLabels,
                        DynamicLabelModuleName.ConfigurationInspection,
                      )}
                    >
                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.APP_TYPE_PROPERTY,
                        },
                        search,
                      ) && (
                        <Menu.Item className={styles.MenuItemAntd}>
                          <MenuItem
                            isQuality
                            imagesActive={images.icons.menu.icATPActive}
                            imagesInActive={images.icons.menu.icATP}
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.ConfigurationInspectionAppTypeProperty,
                            )}
                            urlPage={AppRouteConst.APP_TYPE_PROPERTY}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.APP_TYPE_PROPERTY);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.APP_TYPE_PROPERTY ||
                              currentUrl.includes(
                                AppRouteConst.APP_TYPE_PROPERTY,
                              )
                            }
                          />
                        </Menu.Item>
                      )}
                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.ATTACHMENT_KIT,
                        },
                        search,
                      ) && (
                        <Menu.Item className={styles.MenuItemAntd}>
                          <MenuItem
                            isQuality
                            imagesActive={images.icons.menu.icActiveWrench}
                            imagesInActive={images.icons.menu.icInActiveWrench}
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.ConfigurationInspectionAttachmentKit,
                            )}
                            urlPage={AppRouteConst.ATTACHMENT_KIT}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.ATTACHMENT_KIT);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.ATTACHMENT_KIT ||
                              currentUrl.includes(AppRouteConst.ATTACHMENT_KIT)
                            }
                          />
                        </Menu.Item>
                      )}
                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.CATEGORY_MAPPING,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.CATEGORY_MAPPING}
                          className={styles.MenuItemAntd}
                        >
                          <MenuItem
                            isQuality
                            imagesActive={images.icons.menu.icCategoryActive}
                            imagesInActive={
                              images.icons.menu.icCategoryInActive
                            }
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.ConfigurationInspectionCategoryMapping,
                            )}
                            urlPage={AppRouteConst.CATEGORY_MAPPING}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.CATEGORY_MAPPING);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.CATEGORY_MAPPING ||
                              currentUrl.includes(
                                AppRouteConst.CATEGORY_MAPPING,
                              )
                            }
                          />
                        </Menu.Item>
                      )}
                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.CHARTER_OWNER,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.CHARTER_OWNER}
                          className={styles.MenuItemAntd}
                        >
                          <MenuItem
                            isQuality
                            imagesActive={
                              images.icons.menu.icCharterOwnerActive
                            }
                            imagesInActive={
                              images.icons.menu.icCharterOwnerInActive
                            }
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.ConfigurationInspectionCharterOwner,
                            )}
                            urlPage={AppRouteConst.CHARTER_OWNER}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.CHARTER_OWNER);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.CHARTER_OWNER ||
                              currentUrl.includes(AppRouteConst.CHARTER_OWNER)
                            }
                          />
                        </Menu.Item>
                      )}
                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.CDI,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.CDI}
                          className={styles.MenuItemAntd}
                        >
                          <MenuItem
                            isQuality
                            imagesActive={images.icons.menu.icCDIActive}
                            imagesInActive={images.icons.menu.icCDIInActive}
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.ConfigurationInspectionChemicalDistributionInstitute,
                            )}
                            urlPage={AppRouteConst.CDI}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.CDI);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.CDI ||
                              currentUrl.includes(AppRouteConst.CDI)
                            }
                          />
                        </Menu.Item>
                      )}
                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.DEVICE_CONTROL,
                        },
                        search,
                      ) && (
                        <Menu.Item className={styles.MenuItemAntd}>
                          <MenuItem
                            isQuality
                            imagesActive={
                              images.icons.menu.icDeviceControlActive
                            }
                            imagesInActive={images.icons.menu.icDeviceControl}
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.ConfigurationInspectionDeviceControl,
                            )}
                            urlPage={AppRouteConst.DEVICE_CONTROL}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.DEVICE_CONTROL);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.DEVICE_CONTROL ||
                              currentUrl.includes(AppRouteConst.DEVICE_CONTROL)
                            }
                          />
                        </Menu.Item>
                      )}
                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.AUDIT_CHECKLIST,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.AUDIT_CHECKLIST}
                          className={styles.MenuItemAntd}
                        >
                          <MenuItem
                            isQuality
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.ConfigurationInspectionAuditChecklist,
                            )}
                            urlPage={AppRouteConst.AUDIT_CHECKLIST}
                            imagesActive={images.icons.menu.icSearchActive}
                            imagesInActive={images.icons.menu.icSearchInActive}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.AUDIT_CHECKLIST);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.AUDIT_CHECKLIST ||
                              currentUrl.includes(AppRouteConst.AUDIT_CHECKLIST)
                            }
                          />
                        </Menu.Item>
                      )}
                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.INSPECTION_MAPPING,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.INSPECTION_MAPPING}
                          className={styles.MenuItemAntd}
                        >
                          <MenuItem
                            isQuality
                            imagesActive={
                              images.icons.menu.icInspectionMappingActive
                            }
                            imagesInActive={
                              images.icons.menu.icInspectionMapping
                            }
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.ConfigurationInspectionInspectionMapping,
                            )}
                            urlPage={AppRouteConst.INSPECTION_MAPPING}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.INSPECTION_MAPPING);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.INSPECTION_MAPPING ||
                              currentUrl.includes(
                                AppRouteConst.INSPECTION_MAPPING,
                              )
                            }
                          />
                        </Menu.Item>
                      )}
                      {/* {(userInfo?.roleScope === RoleScope.Admin || isUserMain) &&
                        permissionCheck(
                          userInfo,
                          {
                            feature: Features.CONFIGURATION,
                            subFeature: SubFeatures.DMS,
                          },
                          search,
                        ) && (
                          <Menu.Item
                            key={AppRouteConst.DMS}
                            className={styles.MenuItemAntd}
                          >
                            <MenuItem
                                isQuality

                              imagesActive={images.icons.menu.icDocumentManagerActive}
                              imagesInActive={images.icons.menu.icDocumentManager}
                              content={t('sidebar.dms')}
                              urlPage={AppRouteConst.DMS}
                              onClick={() => {
                                setCurrentUrl(AppRouteConst.DMS);
                              }}
                              isActive={
                                currentUrl === AppRouteConst.DMS ||
                                currentUrl.includes(AppRouteConst.DMS)
                              }
                            />
                          </Menu.Item>
                        )} */}
                      {/* {(userInfo?.roleScope === RoleScope.Admin||isUserIE) &&
                        permissionCheck(
                          userInfo,
                          {
                            feature: Features.CONFIGURATION,
                            subFeature: SubFeatures.FLEET,
                          },
                          search,
                        ) && (
                          <Menu.Item
                            key={AppRouteConst.FLEET}
                            className={styles.MenuItemAntd}
                          >
                            <MenuItem
                                isQuality

                              imagesActive={images.icons.menu.icFleetActive}
                              imagesInActive={images.icons.menu.icFleetInActive}
                              content={t('sidebar.fleet')}
                              urlPage={AppRouteConst.FLEET}
                              onClick={() => {
                                setCurrentUrl(AppRouteConst.FLEET);
                              }}
                              isActive={
                                currentUrl === AppRouteConst.FLEET ||
                                currentUrl.includes(AppRouteConst.FLEET)
                              }
                            />
                          </Menu.Item>
                        )} */}

                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.FOCUS_REQUEST,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.FOCUS_REQUEST}
                          className={styles.MenuItemAntd}
                        >
                          <MenuItem
                            isQuality
                            imagesActive={
                              images.icons.master.icMasterFocusRequestActive
                            }
                            imagesInActive={
                              images.icons.master.icMasterFocusRequestInActive
                            }
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.ConfigurationInspectionFocusRequest,
                            )}
                            urlPage={AppRouteConst.FOCUS_REQUEST}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.FOCUS_REQUEST);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.FOCUS_REQUEST ||
                              currentUrl.includes(AppRouteConst.FOCUS_REQUEST)
                            }
                          />
                        </Menu.Item>
                      )}

                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.MAIL_MANAGEMENT,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.MAIL_MANAGEMENT}
                          className={styles.MenuItemAntd}
                        >
                          <MenuItem
                            isQuality
                            imagesActive={images.icons.menu.icActiveMailSend}
                            imagesInActive={
                              images.icons.menu.icInActiveMailSend
                            }
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.ConfigurationInspectionMailTemplate,
                            )}
                            urlPage={AppRouteConst.MAIL_MANAGEMENT}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.MAIL_MANAGEMENT);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.MAIL_MANAGEMENT ||
                              currentUrl.includes(AppRouteConst.MAIL_MANAGEMENT)
                            }
                          />
                        </Menu.Item>
                      )}

                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.MOBILE_CONFIG,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.MOBILE_CONFIG}
                          className={styles.MenuItemAntd}
                        >
                          <MenuItem
                            isQuality
                            imagesActive={
                              images.icons.menu.icMobileConfigActive
                            }
                            imagesInActive={images.icons.menu.icMobileConfig}
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.ConfigurationInspectionMobileconfig,
                            )}
                            urlPage={AppRouteConst.MOBILE_CONFIG}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.MOBILE_CONFIG);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.MOBILE_CONFIG ||
                              currentUrl.includes(AppRouteConst.MOBILE_CONFIG)
                            }
                          />
                        </Menu.Item>
                      )}
                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.NATURE_OF_FINDINGS_MASTER,
                        },
                        search,
                      ) && (
                        <Menu.Item className={styles.MenuItemAntd}>
                          <MenuItem
                            isQuality
                            imagesActive={images.icons.menu.icFindingActive}
                            imagesInActive={images.icons.menu.icFinding}
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.ConfigurationInspectionNatureOfFindings,
                            )}
                            urlPage={AppRouteConst.NATURE_OF_FINDINGS_MASTER}
                            onClick={() => {
                              setCurrentUrl(
                                AppRouteConst.NATURE_OF_FINDINGS_MASTER,
                              );
                            }}
                            isActive={
                              currentUrl ===
                                AppRouteConst.NATURE_OF_FINDINGS_MASTER ||
                              currentUrl.includes(
                                AppRouteConst.NATURE_OF_FINDINGS_MASTER,
                              )
                            }
                          />
                        </Menu.Item>
                      )}
                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.RANK_MASTER,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.RANK_MASTER}
                          className={styles.MenuItemAntd}
                        >
                          <MenuItem
                            isQuality
                            imagesActive={images.icons.menu.icShipRankActive}
                            imagesInActive={
                              images.icons.menu.icShipRankInActive
                            }
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.ConfigurationInspectionRank,
                            )}
                            urlPage={AppRouteConst.RANK_MASTER}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.RANK_MASTER);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.RANK_MASTER ||
                              currentUrl.includes(AppRouteConst.RANK_MASTER)
                            }
                          />
                        </Menu.Item>
                      )}

                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.REPEATED_FINDING,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.REPEATED_FINDING}
                          className={styles.MenuItemAntd}
                        >
                          <MenuItem
                            isQuality
                            imagesActive={
                              images.icons.menu
                                .icRepeatedFindingCalculationActive
                            }
                            imagesInActive={
                              images.icons.menu.icRepeatedFindingCalculation
                            }
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.ConfigurationInspectionRepeatedFinding,
                            )}
                            urlPage={AppRouteConst.REPEATED_FINDING}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.REPEATED_FINDING);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.REPEATED_FINDING ||
                              currentUrl.includes(
                                AppRouteConst.REPEATED_FINDING,
                              )
                            }
                          />
                        </Menu.Item>
                      )}
                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.REPORT_TEMPLATE,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          ref={reportRef}
                          key={AppRouteConst.REPORT_TEMPLATE}
                          className={styles.MenuItemAntd}
                        >
                          <MenuItem
                            isQuality
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.ConfigurationInspectionReportTemplateMaster,
                            )}
                            urlPage={AppRouteConst.REPORT_TEMPLATE}
                            imagesActive={
                              images.icons.menu.icCalendarCheckActive
                            }
                            imagesInActive={
                              images.icons.menu.icCalendarCheckInActive
                            }
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.REPORT_TEMPLATE);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.REPORT_TEMPLATE ||
                              currentUrl.includes(AppRouteConst.REPORT_TEMPLATE)
                            }
                          />
                        </Menu.Item>
                      )}
                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.SECOND_CATEGORY,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.SECOND_CATEGORY}
                          className={styles.MenuItemAntd}
                        >
                          <MenuItem
                            isQuality
                            imagesActive={images.icons.menu.icCategoryActive}
                            imagesInActive={
                              images.icons.menu.icCategoryInActive
                            }
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.ConfigurationInspectionSecondCategory,
                            )}
                            urlPage={AppRouteConst.SECOND_CATEGORY}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.SECOND_CATEGORY);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.SECOND_CATEGORY ||
                              currentUrl.includes(AppRouteConst.SECOND_CATEGORY)
                            }
                          />
                        </Menu.Item>
                      )}
                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.THIRD_CATEGORY,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.THIRD_CATEGORY}
                          className={styles.MenuItemAntd}
                        >
                          <MenuItem
                            isQuality
                            imagesActive={images.icons.menu.icCategoryActive}
                            imagesInActive={
                              images.icons.menu.icCategoryInActive
                            }
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.ConfigurationInspectionThirdCategory,
                            )}
                            urlPage={AppRouteConst.THIRD_CATEGORY}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.THIRD_CATEGORY);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.THIRD_CATEGORY ||
                              currentUrl.includes(AppRouteConst.THIRD_CATEGORY)
                            }
                          />
                        </Menu.Item>
                      )}

                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.INSPECTOR_TIME_OFF,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.INSPECTOR_TIME_OFF}
                          className={styles.MenuItemAntd}
                        >
                          <MenuItem
                            isQuality
                            imagesActive={images.icons.menu.icTimeOffActive}
                            imagesInActive={images.icons.menu.icTimeOff}
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.ConfigurationInspectionInspectorTimeOff,
                            )}
                            urlPage={AppRouteConst.INSPECTOR_TIME_OFF}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.INSPECTOR_TIME_OFF);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.INSPECTOR_TIME_OFF ||
                              currentUrl.includes(
                                AppRouteConst.INSPECTOR_TIME_OFF,
                              )
                            }
                          />
                        </Menu.Item>
                      )}
                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.TOPIC,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.TOPIC}
                          className={styles.MenuItemAntd}
                        >
                          <MenuItem
                            isQuality
                            imagesActive={images.icons.menu.icTopicActive}
                            imagesInActive={images.icons.menu.icTopicInActive}
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.ConfigurationInspectionTopic,
                            )}
                            urlPage={AppRouteConst.TOPIC}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.TOPIC);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.TOPIC ||
                              currentUrl.includes(AppRouteConst.TOPIC)
                            }
                          />
                        </Menu.Item>
                      )}

                      {/* START_NEW_PAGE */}

                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.ANSWER_VALUE,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.VALUE_MANAGEMENT}
                          className={styles.MenuItemAntd}
                        >
                          <MenuItem
                            isQuality
                            imagesActive={images.icons.menu.icValueManagerment}
                            imagesInActive={
                              images.icons.menu.icValueManagermentActive
                            }
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.ConfigurationInspectionAnswerValue,
                            )}
                            urlPage={AppRouteConst.VALUE_MANAGEMENT}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.VALUE_MANAGEMENT);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.VALUE_MANAGEMENT
                            }
                          />
                        </Menu.Item>
                      )}
                      {/* END_NEW_PAGE */}
                    </SubMenu>
                  )}
                  {permissionCheck(
                    userInfo,
                    {
                      feature: Features.CONFIGURATION,
                      subFeature: SubFeatures.CONFIGURATION_QA_SUB_FEATURES,
                    },
                    search,
                  ) && (
                    <SubMenu
                      key="configurationQA"
                      className={cx(
                        styles.subMenuQuality,
                        {
                          submenu_quality_active:
                            currentQuality === ModuleConfiguration.QA,
                        },
                        'submenu_quality',
                      )}
                      icon={
                        currentQuality === ModuleConfiguration.QA ? (
                          <img
                            src={images.icons.menu.icConfigurationQAActive}
                            alt="icConfigurationQAActive"
                            className={styles.iconMenu}
                          />
                        ) : (
                          <img
                            src={images.icons.menu.icConfigurationQA}
                            className={styles.iconMenu}
                            alt="icConfigurationQA"
                          />
                        )
                      }
                      title={renderDynamicModuleLabel(
                        listModuleDynamicLabels,
                        DynamicLabelModuleName.ConfigurationQA,
                      )}
                    >
                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.AUTHORITY_MASTER,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.AUTHORITY_MASTER}
                          className={styles.MenuItemAntd}
                        >
                          <MenuItem
                            isQuality
                            imagesActive={images.icons.menu.icAuthorActive}
                            imagesInActive={images.icons.menu.icAuthor}
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.ConfigurationQAAuthorityMaster,
                            )}
                            urlPage={AppRouteConst.AUTHORITY_MASTER}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.AUTHORITY_MASTER);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.AUTHORITY_MASTER ||
                              currentUrl.includes(
                                AppRouteConst.AUTHORITY_MASTER,
                              )
                            }
                          />
                        </Menu.Item>
                      )}
                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.INJURY_BODY,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.INJURY_BODY}
                          className={styles.MenuItemAntd}
                        >
                          <MenuItem
                            isQuality
                            imagesActive={
                              images.icons.menu.icBodyPartInjuryActive
                            }
                            imagesInActive={images.icons.menu.icBodyPartInjury}
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.ConfigurationQAInjuryBody,
                            )}
                            urlPage={AppRouteConst.INJURY_BODY}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.INJURY_BODY);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.INJURY_BODY ||
                              currentUrl.includes(AppRouteConst.INJURY_BODY)
                            }
                          />
                        </Menu.Item>
                      )}
                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.CARGO,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.CARGO}
                          className={styles.MenuItemAntd}
                        >
                          <MenuItem
                            isQuality
                            imagesActive={images.icons.menu.icCargoActive}
                            imagesInActive={images.icons.menu.icCargo}
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.ConfigurationQACargo,
                            )}
                            urlPage={AppRouteConst.CARGO}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.CARGO);
                            }}
                            isActive={currentUrl === AppRouteConst.CARGO}
                          />
                        </Menu.Item>
                      )}

                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.CARGO_TYPE,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.CARGO_TYPE}
                          className={styles.MenuItemAntd}
                        >
                          <MenuItem
                            isQuality
                            imagesActive={images.icons.menu.icCargoTypeActive}
                            imagesInActive={images.icons.menu.icCargoType}
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.ConfigurationQACargoType,
                            )}
                            urlPage={AppRouteConst.CARGO_TYPE}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.CARGO_TYPE);
                            }}
                            isActive={currentUrl === AppRouteConst.CARGO_TYPE}
                          />
                        </Menu.Item>
                      )}

                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.EVENT_TYPE,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.EVENT_TYPE}
                          className={styles.MenuItemAntd}
                        >
                          <MenuItem
                            isQuality
                            imagesActive={images.icons.menu.icEventTypeActive}
                            imagesInActive={images.icons.menu.icEventType}
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.ConfigurationQAEventType,
                            )}
                            urlPage={AppRouteConst.EVENT_TYPE}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.EVENT_TYPE);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.EVENT_TYPE ||
                              currentUrl.includes(AppRouteConst.EVENT_TYPE)
                            }
                          />
                        </Menu.Item>
                      )}
                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.INCIDENT_TYPE,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.INCIDENT_TYPE}
                          className={styles.MenuItemAntd}
                        >
                          <MenuItem
                            isQuality
                            imagesActive={
                              images.icons.menu.icIncidentTypeActive
                            }
                            imagesInActive={images.icons.menu.icIncidentType}
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.ConfigurationQAIncidentMaster,
                            )}
                            urlPage={AppRouteConst.INCIDENT_TYPE}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.INCIDENT_TYPE);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.INCIDENT_TYPE ||
                              currentUrl.includes(AppRouteConst.INCIDENT_TYPE)
                            }
                          />
                        </Menu.Item>
                      )}

                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.INJURY_MASTER,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.INJURY_MASTER}
                          className={styles.MenuItemAntd}
                        >
                          <MenuItem
                            isQuality
                            imagesActive={
                              images.icons.menu.icInjuryMasterActive
                            }
                            imagesInActive={images.icons.menu.icInjuryMaster}
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.ConfigurationQAInjuryMaster,
                            )}
                            urlPage={AppRouteConst.INJURY_MASTER}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.INJURY_MASTER);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.INJURY_MASTER ||
                              currentUrl.includes(AppRouteConst.INJURY_MASTER)
                            }
                          />
                        </Menu.Item>
                      )}
                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.ISSUE_NOTE,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.ISSUE_NOTE}
                          className={styles.MenuItemAntd}
                        >
                          <MenuItem
                            isQuality
                            imagesActive={images.icons.menu.icTopicActive}
                            imagesInActive={images.icons.menu.icTopicInActive}
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.ConfigurationQATechnicalIssueNote,
                            )}
                            urlPage={AppRouteConst.ISSUE_NOTE}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.ISSUE_NOTE);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.ISSUE_NOTE ||
                              currentUrl.includes(AppRouteConst.ISSUE_NOTE)
                            }
                          />
                        </Menu.Item>
                      )}
                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.PLAN_DRAWING,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.PLAN_DRAWING}
                          className={styles.MenuItemAntd}
                        >
                          <MenuItem
                            isQuality
                            imagesActive={images.icons.menu.icCDIActive}
                            imagesInActive={images.icons.menu.icCDIInActive}
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.ConfigurationQAPlansDrawingsMaster,
                            )}
                            urlPage={AppRouteConst.PLAN_DRAWING}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.PLAN_DRAWING);
                            }}
                            isActive={currentUrl === AppRouteConst.PLAN_DRAWING}
                          />
                        </Menu.Item>
                      )}
                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.PSC_ACTION,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.PSC_ACTION}
                          className={styles.MenuItemAntd}
                        >
                          <MenuItem
                            isQuality
                            imagesActive={images.icons.menu.icPscActionActive}
                            imagesInActive={images.icons.menu.icPscAction}
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.ConfigurationQAPSCAction,
                            )}
                            urlPage={AppRouteConst.PSC_ACTION}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.PSC_ACTION);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.PSC_ACTION ||
                              currentUrl.includes(AppRouteConst.PSC_ACTION)
                            }
                          />
                        </Menu.Item>
                      )}

                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.PSC_DEFICIENCY,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.PSC_DEFICIENCY}
                          className={styles.MenuItemAntd}
                        >
                          <MenuItem
                            isQuality
                            imagesActive={images.icons.menu.icPscDefiActive}
                            imagesInActive={images.icons.menu.icPscDefi}
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.ConfigurationQAPSCDeficiency,
                            )}
                            urlPage={AppRouteConst.PSC_DEFICIENCY}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.PSC_DEFICIENCY);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.PSC_DEFICIENCY ||
                              currentUrl.includes(AppRouteConst.PSC_DEFICIENCY)
                            }
                          />
                        </Menu.Item>
                      )}
                      {/* {(userInfo?.roleScope === RoleScope.Admin || isUserMain) &&
                      permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.RISK_FACTOR,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.RISK_FACTOR}
                          className={styles.MenuItemAntd}
                        >
                          <MenuItem
                            isQuality
                            imagesActive={images.icons.menu.icRiskFactorActive}
                            imagesInActive={images.icons.menu.icRiskFactor}
                            content={t('sidebar.riskFactor')}
                            urlPage={AppRouteConst.RISK_FACTOR}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.RISK_FACTOR);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.RISK_FACTOR ||
                              currentUrl.includes(AppRouteConst.RISK_FACTOR)
                            }
                          />
                        </Menu.Item>
                      )} */}
                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.TERMINAL,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.TERMINAL}
                          className={styles.MenuItemAntd}
                        >
                          <MenuItem
                            isQuality
                            imagesActive={images.icons.menu.icTerminalActive}
                            imagesInActive={images.icons.menu.icTerminal}
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.ConfigurationQATerminal,
                            )}
                            urlPage={AppRouteConst.TERMINAL}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.TERMINAL);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.TERMINAL ||
                              currentUrl.includes(AppRouteConst.TERMINAL)
                            }
                          />
                        </Menu.Item>
                      )}
                      {permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.TRANSFER_TYPE,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.TRANSFER_TYPE}
                          className={styles.MenuItemAntd}
                        >
                          <MenuItem
                            isQuality
                            imagesActive={images.icons.menu.icTransferActive}
                            imagesInActive={images.icons.menu.icTransferType}
                            content={renderDynamicModuleLabel(
                              listModuleDynamicLabels,
                              DynamicLabelModuleName.ConfigurationQATransferType,
                            )}
                            urlPage={AppRouteConst.TRANSFER_TYPE}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.TRANSFER_TYPE);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.TRANSFER_TYPE ||
                              currentUrl.includes(AppRouteConst.TRANSFER_TYPE)
                            }
                          />
                        </Menu.Item>
                      )}

                      {/* {(userInfo?.roleScope === RoleScope.Admin || isUserMain) &&
                      permissionCheck(
                        userInfo,
                        {
                          feature: Features.CONFIGURATION,
                          subFeature: SubFeatures.VESSEL_OWNER_BUSINESS,
                        },
                        search,
                      ) && (
                        <Menu.Item
                          key={AppRouteConst.OWNER_BUSINESS}
                          className={styles.MenuItemAntd}
                        >
                          <MenuItem
                            isQuality
                            imagesActive={
                              images.icons.menu.icVesselOwnerBussinessActive
                            }
                            imagesInActive={
                              images.icons.menu.icVesselOwnerBussiness
                            }
                            content={t('sidebar.ownerBusiness')}
                            urlPage={AppRouteConst.OWNER_BUSINESS}
                            onClick={() => {
                              setCurrentUrl(AppRouteConst.OWNER_BUSINESS);
                            }}
                            isActive={
                              currentUrl === AppRouteConst.OWNER_BUSINESS ||
                              currentUrl.includes(AppRouteConst.OWNER_BUSINESS)
                            }
                          />
                        </Menu.Item>
                      )} */}
                    </SubMenu>
                  )}
                  {/* {roleScope === RoleScope.Admin &&
                  permissionCheck(
                    userInfo,
                    {
                      feature: Features.CONFIGURATION,
                      // TODO : Open after
                      // subFeature: SubFeatures.FEATURE_CONFIG,
                    },
                    search,
                  ) && (
                    <Menu.Item className={styles.MenuItemAntd}>
                      <MenuItem
                        imagesActive={images.icons.menu.icWorkflowActive}
                        imagesInActive={images.icons.menu.icWorkflow}
                        content={t('sidebar.featureConfig')}
                        urlPage={AppRouteConst.FEATURE_CONFIG}
                        onClick={() => {
                          setCurrentUrl(AppRouteConst.FEATURE_CONFIG);
                        }}
                        isActive={
                          currentUrl === AppRouteConst.FEATURE_CONFIG ||
                          currentUrl.includes(AppRouteConst.FEATURE_CONFIG)
                        }
                      />
                    </Menu.Item>
                  )} */}
                  {/* {(userInfo?.roleScope === RoleScope.Admin || isUserMain) &&
                  permissionCheck(
                    userInfo,
                    {
                      feature: Features.CONFIGURATION,
                      subFeature: SubFeatures.MODULE_MANAGEMENT,
                    },
                    search,
                  ) && (
                    <Menu.Item className={styles.MenuItemAntd}>
                      <MenuItem
                        imagesActive={
                          images.icons.menu.icModuleManagementActive
                        }
                        imagesInActive={
                          images.icons.menu.icModuleManagementInActive
                        }
                        content={t('sidebar.moduleManagement')}
                        urlPage={AppRouteConst.MODULE_MANAGEMENT}
                        onClick={() => {
                          setCurrentUrl(AppRouteConst.MODULE_MANAGEMENT);
                        }}
                        isActive={
                          currentUrl === AppRouteConst.MODULE_MANAGEMENT ||
                          currentUrl.includes(AppRouteConst.MODULE_MANAGEMENT)
                        }
                      />
                    </Menu.Item>
                  )} */}
                  {/* <PermissionCheck
                  options={{
                    feature: Features.CONFIGURATION,
                    subFeature: SubFeatures.SHIP_DEPARTMENT,
                  }}
                >
                  {({ hasPermission }) =>
                    hasPermission ? (
                      <Menu.Item className={styles.MenuItemAntd}>
                        <MenuItem
                          isQuality

                          content={t('sidebar.shipDepartment')}
                          urlPage={AppRouteConst.SHIP_DEPARTMENT}
                          onClick={() => {
                            setCurrentUrl(AppRouteConst.SHIP_DEPARTMENT);
                          }}
                          isActive={
                            currentUrl === AppRouteConst.SHIP_DEPARTMENT ||
                            currentUrl.includes(AppRouteConst.SHIP_DEPARTMENT)
                          }
                        />
                      </Menu.Item>
                    ) : null
                  }
                </PermissionCheck> */}
                  {/* <PermissionCheck
                  options={{
                    feature: Features.CONFIGURATION,
                    subFeature: SubFeatures.SHIP_DIRECT_RESPONSIBLE,
                  }}
                >
                  {({ hasPermission }) =>
                    hasPermission && (
                      <Menu.Item className={styles.MenuItemAntd}>
                        <MenuItem
                          isQuality

                          content={t('sidebar.shipDirectResponsible')}
                          urlPage={AppRouteConst.SHIP_DIRECT_RESPONSIBLE}
                          onClick={() => {
                            setCurrentUrl(
                              AppRouteConst.SHIP_DIRECT_RESPONSIBLE,
                            );
                          }}
                          isActive={
                            currentUrl ===
                              AppRouteConst.SHIP_DIRECT_RESPONSIBLE ||
                            currentUrl.includes(
                              AppRouteConst.SHIP_DIRECT_RESPONSIBLE,
                            )
                          }
                        />
                      </Menu.Item>
                    )
                  }
                </PermissionCheck> */}
                  {/* <PermissionCheck
                  options={{
                    feature: Features.CONFIGURATION,
                    subFeature: SubFeatures.SHIP_RANK,
                  }}
                >
                  {({ hasPermission }) =>
                    hasPermission ? (
                      <Menu.Item className={styles.MenuItemAntd}>
                        <MenuItem
                          content={t('sidebar.shipRank')}
                          urlPage={AppRouteConst.SHIP_RANK}
                          onClick={() => {
                            setCurrentUrl(AppRouteConst.SHIP_RANK);
                          }}
                          isActive={
                            currentUrl === AppRouteConst.SHIP_RANK ||
                            currentUrl.includes(AppRouteConst.SHIP_RANK)
                          }
                        />
                      </Menu.Item>
                    ) : null
                  }
                </PermissionCheck> */}
                  {/* <PermissionCheck
                  options={{
                    feature: Features.CONFIGURATION,
                    subFeature: SubFeatures.SHORE_DEPARTMENT,
                  }}
                >
                  {({ hasPermission }) =>
                    hasPermission ? (
                      <Menu.Item className={styles.MenuItemAntd}>
                        <MenuItem
                          content={t('sidebar.shoreDepartment')}
                          urlPage={AppRouteConst.SHORE_DEPARTMENT}
                          onClick={() => {
                            setCurrentUrl(AppRouteConst.SHORE_DEPARTMENT);
                          }}
                          isActive={
                            currentUrl === AppRouteConst.SHORE_DEPARTMENT ||
                            currentUrl.includes(AppRouteConst.SHORE_DEPARTMENT)
                          }
                        />
                      </Menu.Item>
                    ) : null
                  }
                </PermissionCheck> */}
                  {/* <PermissionCheck
                  options={{
                    feature: Features.CONFIGURATION,
                    subFeature: SubFeatures.SHORE_RANK,
                  }}
                >
                  {({ hasPermission }) =>
                    hasPermission && (
                      <Menu.Item className={styles.MenuItemAntd}>
                        <MenuItem
                          content={t('sidebar.shoreRankManagement')}
                          urlPage={AppRouteConst.SHORE_RANK}
                          onClick={() => {
                            setCurrentUrl(AppRouteConst.SHORE_RANK);
                          }}
                          isActive={
                            currentUrl === AppRouteConst.SHORE_RANK ||
                            currentUrl.includes(AppRouteConst.SHORE_RANK)
                          }
                        />
                      </Menu.Item>
                    )
                  }
                </PermissionCheck> */}
                </SubMenu>
              )}
            </Menu>
          </div>
        </div>
      </div>

      <div
        className={styles.footerLogo}
        style={{
          width: isShow ? '56px' : '260px',
        }}
      >
        <a href={SOLVER_LINK} target="_blank" rel="noreferrer">
          <img
            src={images.logo.logoFooterFull}
            alt="Footer Menu Logo"
            key="Footer Menu Logo"
            loading="eager"
          />
        </a>
      </div>
    </div>
  );
};

export default AppMenu;
