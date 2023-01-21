import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import SelectUI from 'components/ui/select/Select';
import ToggleSwitch from 'components/ui/toggle-switch/ToggleSwitch';
import { ENTITY_OPTIONS } from 'constants/filter.const';
import { PlanningAndRequestStatusesOptions } from 'constants/planning-and-request.const';
import { FC, useEffect } from 'react';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { LIST_PLANNING_DYNAMIC_FIELDS } from 'constants/dynamic/planning.const';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { FieldValues, useForm } from 'react-hook-form';
import { Col, Row } from 'reactstrap';
import styles from './filter-header.module.scss';
import { TYPE_GANTT } from '../GraphicalPlanning';

export const defaultValues = {
  entityType: '',
  inspectionMonth: undefined,
  status: '',
  visibleUnassigned: true,
};

interface Props {
  onSubmitForm: (values?: any) => void;
  currentTime: string;
  type?: string;
}

const FilterHeader: FC<Props> = ({ onSubmitForm, type, currentTime }) => {
  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.AuditInspectionPar,
    modulePage: ModulePage.List,
  });

  const { watch, control, handleSubmit, setValue, reset } =
    useForm<FieldValues>({
      mode: 'all',
      defaultValues,
      // resolver: yupResolver(schema),
    });
  const watchTime = watch('inspectionMonth');
  const watchStatus = watch('status');
  const watchEntity = watch('entityType');
  const watchVisibleUnassigned = watch('visibleUnassigned');
  useEffect(() => {
    if (currentTime) {
      setValue('inspectionMonth', currentTime);
    }
  }, [currentTime, setValue]);

  useEffect(() => {
    if (type === TYPE_GANTT.VESSEL) {
      setValue('entityType', 'Vessel');
    }
    if (type === TYPE_GANTT.OFFICE) {
      setValue('entityType', 'Office');
    }
  }, [setValue, type]);
  return (
    <Row>
      <Col xs={3}>
        <DateTimePicker
          label={renderDynamicLabel(
            dynamicLabels,
            LIST_PLANNING_DYNAMIC_FIELDS['Inspection month'],
          )}
          className="w-100"
          control={control}
          formatDate="MM-YYYY"
          picker="month"
          name="inspectionMonth"
          id="inspectionMonth"
          // focus={firstErrorId === 'fromPortEstimatedTimeArrival'}
          inputReadOnly
        />
      </Col>
      <Col xs={2}>
        <SelectUI
          labelSelect={renderDynamicLabel(
            dynamicLabels,
            LIST_PLANNING_DYNAMIC_FIELDS.Status,
          )}
          data={PlanningAndRequestStatusesOptions}
          name="status"
          id="status"
          className="w-100"
          control={control}
          notAllowSortData
        />
      </Col>
      <Col xs={2}>
        <SelectUI
          labelSelect={renderDynamicLabel(
            dynamicLabels,
            LIST_PLANNING_DYNAMIC_FIELDS.Entity,
          )}
          data={[{ label: 'All', value: '' }].concat(ENTITY_OPTIONS)}
          name="entityType"
          id="entityType"
          className="w-100"
          control={control}
        />
      </Col>
      <Col xs={3}>
        <div className="d-flex align-items-end h-100">
          <ToggleSwitch
            name="visibleUnassigned"
            label={renderDynamicLabel(
              dynamicLabels,
              LIST_PLANNING_DYNAMIC_FIELDS['Show unassigned inspector plans'],
            )}
            control={control}
            toggleIconClassName={styles.customSwitch}
          />
        </div>
      </Col>
      <Col xs={4} xl={2}>
        <div className="d-flex align-items-end h-100 pt-3">
          <Button
            buttonSize={ButtonSize.Medium}
            className={styles.buttonCancel}
            buttonType={ButtonType.Outline}
            onClick={handleSubmit(onSubmitForm)}
          >
            {renderDynamicLabel(
              dynamicLabels,
              LIST_PLANNING_DYNAMIC_FIELDS.Search,
            )}
          </Button>
          <Button
            buttonType={ButtonType.OutlineDangerous}
            buttonSize={ButtonSize.Medium}
            disabled={
              !watchTime &&
              !watchStatus &&
              !watchEntity &&
              watchVisibleUnassigned
            }
            disabledCss={
              !watchTime &&
              !watchStatus &&
              !watchEntity &&
              watchVisibleUnassigned
            }
            onClick={async () => {
              await reset(defaultValues);
              onSubmitForm(null);
            }}
          >
            {renderDynamicLabel(
              dynamicLabels,
              LIST_PLANNING_DYNAMIC_FIELDS['Clear all'],
            )}
          </Button>
        </div>
      </Col>
    </Row>
  );
};

export default FilterHeader;
