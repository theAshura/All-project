import cx from 'classnames';
import { DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-workspace.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import RowStatus from '../../common/table/row-status/RowStatus';
import { convertStatus } from '../helpers/convertStatus.helper';
import styles from './tab.module.scss';

const HeaderInfo = ({ data, dynamicLabels }) => (
  <div className="d-flex flex-wrap">
    <div className={cx(styles.headerInformation)}>
      {renderDynamicLabel(
        dynamicLabels,
        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary['Global status'],
      )}
      : <RowStatus status={data?.planningRequest?.globalStatus || '-'} />
    </div>
    <div className={cx(styles.headerInformation)}>
      {renderDynamicLabel(
        dynamicLabels,
        DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS.Summary.Status,
      )}
      : <RowStatus status={convertStatus(data?.status) || ''} />
    </div>
  </div>
);

export default HeaderInfo;
