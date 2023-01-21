import { useCallback, useContext } from 'react';
import { CalendarTimeTableContext } from 'contexts/audit-time-table/CalendarTimeTable';
import { useDispatch, useSelector } from 'react-redux';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import Container from 'components/common/container/ContainerPage';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { renderDynamicModuleLabel } from 'helpers/dynamic.helper';
import cx from 'classnames';
import { CreateAuditTimeTableParams } from 'models/api/audit-time-table/audit-time-table.model';
import { createAuditTimeTableActions } from 'store/audit-time-table/audit-time-table.action';
import styles from './create.module.scss';
import AuditTimeTableForm from '../forms/AuditTimeTableForm';

export default function ChartOwnerCreate() {
  const { listEvent } = useContext(CalendarTimeTableContext);
  const { loading } = useSelector((store) => store.auditTimeTable);
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);
  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.AuditInspectionAuditTimeTable,
    modulePage: ModulePage.Create,
  });
  const dispatch = useDispatch();
  const handleSaveDraft = useCallback(
    (formData: CreateAuditTimeTableParams) => {
      dispatch(
        createAuditTimeTableActions.request({
          ...formData,
          calendars:
            listEvent.map((item) => {
              if (item.operator === 'add') {
                const { id, operator, ...other } = item;
                return other;
              }
              return item;
            }) || [],
        }),
      );
    },
    [dispatch, listEvent],
  );

  const onSubmit = useCallback(
    (formData: CreateAuditTimeTableParams) => {
      dispatch(
        createAuditTimeTableActions.request({
          ...formData,
          calendars:
            listEvent.map((item) => {
              if (item.operator === 'add') {
                const { id, operator, ...other } = item;
                return other;
              }
              return item;
            }) || [],
        }),
      );
    },
    [dispatch, listEvent],
  );

  return (
    <div className={styles.chartOwnerCreate}>
      <Container>
        <div className={cx(styles.headers)}>
          <BreadCrumb current={BREAD_CRUMB.AUDIT_TIME_TABLE_CREATE} />
          <div className={cx('fw-bold', styles.title)}>
            {renderDynamicModuleLabel(
              listModuleDynamicLabels,
              DynamicLabelModuleName.AuditInspectionAuditTimeTable,
            )}
          </div>
        </div>

        <AuditTimeTableForm
          isEdit={!loading}
          data={null}
          isCreate
          onSaveDraft={handleSaveDraft}
          onSubmit={onSubmit}
          dynamicLabels={dynamicLabels}
        />
      </Container>
    </div>
  );
}
