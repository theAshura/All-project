import { FC, useCallback, Fragment } from 'react';
import cx from 'classnames';
import { Action } from 'models/common.model';
import Button, { ButtonSize } from 'components/ui/button/Button';
import PermissionCheck from 'hoc/withPermissionCheck';
import Tooltip from 'antd/lib/tooltip';
import ToggleSwitch from 'components/ui/toggle-switch/ToggleSwitch';

import styles from '../table.module.scss';

interface Props {
  actionList: Action[];
  validWordFlow?: boolean;
}

const TOOLTIP_COLOR = '#3B9FF3';

const ActionBuilder: FC<Props> = ({ actionList, validWordFlow }) => {
  const renderButton = useCallback((action: Action) => {
    const button = (
      <Button
        disabledCss={action?.disable}
        disabled={action?.disable}
        className={cx({ [action.cssClass]: !!action.cssClass })}
        buttonSize={ButtonSize.IconSmallAction}
        buttonType={action.buttonType ? action.buttonType : undefined}
        onClick={(e) => {
          if (action?.function) {
            action?.function();
          }
          e.stopPropagation();
        }}
      >
        <img src={action.img} alt="edit" className={styles.icImg} />
      </Button>
    );
    return action?.tooltipTitle ? (
      <Tooltip
        placement="top"
        title={action?.tooltipTitle}
        color={TOOLTIP_COLOR}
      >
        {button}
      </Tooltip>
    ) : (
      button
    );
  }, []);

  const renderActions = useCallback(() => {
    const actions = actionList?.filter((item) => item);
    if (actions?.length > 0) {
      return actions.map((action) => (
        <Fragment key={action.img + action.cssClass}>
          <PermissionCheck
            options={{
              feature: action.feature,
              subFeature: action.subFeature,
              action: action.action,
              disableFeatureChecking: action?.disableFeatureChecking || false,
            }}
          >
            {({ hasPermission }) =>
              ((hasPermission || validWordFlow) &&
                (!action.isSwitch ? (
                  renderButton(action)
                ) : (
                  <Tooltip
                    placement="top"
                    title={action?.tooltipTitle}
                    color={TOOLTIP_COLOR}
                  >
                    <div className="d-flex align-items-center">
                      <ToggleSwitch
                        disabled={action?.disable}
                        onChange={(value) => action?.onchange(value)}
                        checked={action?.valueSwitch}
                        wrapperClassName={action?.classNameToggleSwitch}
                      />
                    </div>
                  </Tooltip>
                ))) ||
              null
            }
          </PermissionCheck>
        </Fragment>
      ));
    }
    return (
      <Button
        className={styles.btnNone}
        buttonSize={ButtonSize.IconSmallAction}
      >
        1
      </Button>
    );
  }, [actionList, renderButton, validWordFlow]);

  return <>{renderActions()}</>;
};

export default ActionBuilder;
