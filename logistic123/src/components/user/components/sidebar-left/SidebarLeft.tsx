import { FC, useCallback, useContext } from 'react';
import { TabName, UserContext } from 'contexts/user/UserContext';
import StepItem from 'components/ui/step-item/StepItem';
import { RoleScope } from 'constants/roleAndPermission.const';
import { useSelector } from 'react-redux';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';

import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/userManagement.const';

import styles from './sidebar-left.module.scss';

interface SidebarLeftProps {
  dynamicLabels: IDynamicLabel;
}

const SidebarLeft: FC<SidebarLeftProps> = ({ dynamicLabels }) => {
  const { userInfo } = useSelector((state) => state.authenticate);
  const { statusStep, isInspector, handleSetCurrentTab, activeTabs } =
    useContext(UserContext);

  const changeTabs = useCallback(
    (tab: TabName) => {
      handleSetCurrentTab(tab);
    },
    [handleSetCurrentTab],
  );

  return (
    <div className={styles.wrapSidebarLeft}>
      <p className={styles.title}>
        {renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.Information,
        )}
      </p>
      <div className={styles.steps}>
        <button onClick={() => changeTabs(TabName.ACCOUNT_INFORMATION)}>
          <StepItem
            status={statusStep[TabName.ACCOUNT_INFORMATION]}
            isInfo
            label={renderDynamicLabel(
              dynamicLabels,
              USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['User information'],
            )}
          />
        </button>

        <button
          disabled={!activeTabs.includes(TabName.PASSWORD)}
          onClick={() => changeTabs(TabName.PASSWORD)}
        >
          <StepItem
            status={statusStep[TabName.PASSWORD]}
            isInfo
            label={renderDynamicLabel(
              dynamicLabels,
              USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.Password,
            )}
          />
        </button>
        {userInfo?.roleScope !== RoleScope.SuperAdmin && (
          <button
            disabled={!activeTabs.includes(TabName.ROLE_AND_PERMISSION)}
            onClick={() => changeTabs(TabName.ROLE_AND_PERMISSION)}
          >
            <StepItem
              status={statusStep[TabName.ROLE_AND_PERMISSION]}
              isInfo
              label={renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Role and permission'],
              )}
            />
          </button>
        )}
        {isInspector && (
          <button
            // disabled={!activeTabs.includes(TabName.AVAILABLE_AREA)}
            onClick={() => changeTabs(TabName.AVAILABLE_AREA)}
          >
            <StepItem
              status={statusStep[TabName.AVAILABLE_AREA]}
              isInfo
              label={renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Available area'],
              )}
            />
          </button>
        )}
        {isInspector && (
          <button
            // disabled={!activeTabs.includes(TabName.INSPECTOR_DETAIL)}
            onClick={() => changeTabs(TabName.INSPECTOR_DETAIL)}
          >
            <StepItem
              status={statusStep[TabName.INSPECTOR_DETAIL]}
              isInfo
              label={renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Inspector detail'],
              )}
            />
          </button>
        )}
      </div>
    </div>
  );
};

export default SidebarLeft;
