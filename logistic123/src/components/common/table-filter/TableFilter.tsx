import { FC, ReactElement } from 'react';
import cx from 'classnames';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import Select, { OptionProp } from 'components/ui/select/Select';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import AsyncSelectForm from 'components/react-hook-form/async-select/AsyncSelectForm';
import { NewAsyncOptions } from 'components/ui/async-select/NewAsyncSelect';
import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import images from 'assets/images/images';
import Input from 'components/ui/input/Input';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { I18nNamespace } from 'constants/i18n.const';
import { KeyPress } from 'constants/common.const';
import styles from './tableFilter.module.scss';

interface TableFilterProps {
  handleChangeSearchValue?: (
    field: string,
    value: string | number | NewAsyncOptions,
  ) => void;
  handleClearSearchValue?: () => void;
  handleChangeCountrySearch?: (value: string) => void;
  handleGetList?: () => void;
  content?: string;
  status?: string | number;
  auditEntity?: string;
  startDate?: string;
  vetting?: string;
  company?: string;
  role?: string;
  group?: string;
  fieldType?: string;
  viqVesselType?: string;
  portType?: string;
  country?: NewAsyncOptions;
  scope?: string;
  actualAuditFrom?: string;
  actualAuditTo?: string;
  vesselType?: string;
  statusFilterOptions?: OptionProp[];
  entityOptions?: OptionProp[];
  vesselTypeOptions?: OptionProp[];
  roleOptions?: OptionProp[];
  groupOptions?: OptionProp[];
  companyOptions?: OptionProp[];
  fieldTypeOptions?: OptionProp[];
  vettingFilterOptions?: OptionProp[];
  viqVesselTypeFilterOptions?: OptionProp[];
  portTypeFilterOptions?: OptionProp[];
  countryFilterOptions?: NewAsyncOptions[];
  scopeFilterOptions?: OptionProp[];
  dateRangeFilter?: Boolean;
  disable?: boolean;
  isWrap?: boolean;
  isWrap1024?: boolean;
  isStartDate?: boolean;
  className?: string;
  isResizeInputSearch?: boolean;
  hasClearAllButton?: boolean;
  dynamicLabels?: IDynamicLabel;
}

const TableFilter: FC<TableFilterProps> = (props) => {
  const {
    handleChangeSearchValue,
    handleClearSearchValue,
    handleChangeCountrySearch,
    handleGetList,
    content,
    status,
    startDate,
    auditEntity,
    vetting,
    role,
    group,
    vesselType,
    viqVesselType,
    portType,
    country,
    scope,
    actualAuditFrom,
    actualAuditTo,
    isStartDate,
    vesselTypeOptions,
    roleOptions,
    groupOptions,
    statusFilterOptions,
    entityOptions,
    vettingFilterOptions,
    viqVesselTypeFilterOptions,
    portTypeFilterOptions,
    companyOptions,
    company,
    countryFilterOptions,
    scopeFilterOptions,
    dateRangeFilter,
    disable,
    // isWrap,
    isWrap1024,
    className,
    isResizeInputSearch = false,
    fieldType,
    fieldTypeOptions,
    hasClearAllButton = true,
    dynamicLabels,
  } = props;
  const { t } = useTranslation([
    I18nNamespace.VESSEL_TYPE,
    I18nNamespace.VIQ,
    I18nNamespace.COMMON,
  ]);

  const onKeyUp = (e) => {
    if (e.keyCode === KeyPress.ENTER) {
      handleGetList();
    }
  };

  const shouldClearAllBtnBeDisabled = (): boolean => {
    const isDisabled =
      content?.trim()?.length === 0 &&
      Boolean(status) === (status?.toString()?.toLowerCase() === 'all') &&
      Boolean(vetting) === (vetting?.toLowerCase() === 'all') &&
      Boolean(vesselType) === (vesselType?.toLowerCase() === 'all') &&
      Boolean(fieldType) === (fieldType?.toLowerCase() === 'all') &&
      Boolean(viqVesselType) === (viqVesselType?.toLowerCase() === 'all') &&
      Boolean(company) === (company?.toLowerCase() === 'all') &&
      Boolean(portType) === (portType?.toLowerCase() === 'all') &&
      Boolean(country?.value) === (country?.value === 'all') &&
      Boolean(scope) === (scope?.toLowerCase() === 'all') &&
      Boolean(actualAuditTo) === (actualAuditTo?.trim()?.length === 0) &&
      Boolean(startDate) === (startDate?.trim()?.length === 0) &&
      Boolean(actualAuditFrom) === (actualAuditFrom?.trim()?.length === 0) &&
      Boolean(role) === (role?.toLowerCase() === 'all') &&
      Boolean(group) === (group?.toString()?.toLowerCase() === 'all') &&
      Boolean(auditEntity) ===
        (auditEntity?.toString()?.toLowerCase() === 'all');

    return isDisabled;
  };

  const renderStatusSelection = (): ReactElement => (
    <div className={styles.wrapSelect}>
      <Select
        labelSelect={renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS.Status,
        )}
        placeholder={renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Please select'],
        )}
        data={statusFilterOptions}
        value={status}
        disabled={disable}
        className={styles.inputSelect}
        styleLabel={styles.labelFilter}
        onChange={(value) => handleChangeSearchValue('status', value)}
      />
    </div>
  );

  const renderCompanySelection = (): ReactElement => (
    <div className={styles.wrapSelectCompany}>
      <Select
        labelSelect={renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS.Company,
        )}
        placeholder={renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Please select'],
        )}
        data={companyOptions}
        value={company}
        disabled={disable}
        className={cx(styles.selectCompany)}
        styleLabel={styles.labelFilter}
        onChange={(value) => handleChangeSearchValue('company', value)}
      />
    </div>
  );

  const renderEntitySelection = (): ReactElement => (
    <div className={styles.wrapSelect}>
      <Select
        labelSelect={renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS.Entity,
        )}
        placeholder={renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Please select'],
        )}
        data={entityOptions}
        value={auditEntity}
        disabled={disable}
        className={styles.inputSelect}
        styleLabel={styles.labelFilter}
        onChange={(value) => handleChangeSearchValue('auditEntity', value)}
      />
    </div>
  );

  const renderVettingSelection = (): ReactElement => (
    <div className={styles.wrapSelect}>
      <Select
        labelSelect={renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Vetting management risk score'],
        )}
        placeholder={renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Please select'],
        )}
        data={vettingFilterOptions}
        value={vetting}
        disabled={disable}
        className={cx(styles.selectMedium)}
        styleLabel={styles.labelFilter}
        onChange={(value) => handleChangeSearchValue('vetting', value)}
      />
    </div>
  );
  const renderRoleSelection = (): ReactElement => (
    <div className={styles.wrapSelect}>
      <Select
        labelSelect={renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS.Role,
        )}
        placeholder={renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Please select'],
        )}
        data={roleOptions}
        value={role}
        disabled={disable}
        className={styles.inputSelect}
        styleLabel={styles.labelFilter}
        onChange={(value) => handleChangeSearchValue('role', value)}
      />
    </div>
  );

  const renderGroupSelection = (): ReactElement => (
    <div className={styles.wrapSelect}>
      <Select
        labelSelect={renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS.Group,
        )}
        data={groupOptions}
        placeholder={renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Please select'],
        )}
        value={group}
        disabled={disable}
        className={styles.inputSelect}
        styleLabel={styles.labelFilter}
        onChange={(value) => handleChangeSearchValue('group', value)}
      />
    </div>
  );
  const renderVesselTypeSelection = (): ReactElement => (
    <div className={styles.wrapSelect}>
      <Select
        labelSelect={renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Vessel type'],
        )}
        data={vesselTypeOptions}
        placeholder={renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Please select'],
        )}
        value={vesselType}
        disabled={disable}
        className={cx(styles.selectSmall)}
        styleLabel={styles.labelFilter}
        onChange={(value) => handleChangeSearchValue('vesselType', value)}
      />
    </div>
  );

  const renderFieldTypeSelection = (): ReactElement => (
    <div className={styles.wrapSelect}>
      <Select
        labelSelect={renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Field type'],
        )}
        data={fieldTypeOptions}
        value={fieldType}
        placeholder={renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Please select'],
        )}
        disabled={disable}
        className={cx(styles.selectSmall)}
        styleLabel={styles.labelFilter}
        onChange={(value) => handleChangeSearchValue('fieldType', value)}
      />
    </div>
  );

  const renderVIQVesselTypeSelection = (): ReactElement => (
    <div className={styles.wrapSelect}>
      <Select
        labelSelect={renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['VIQ vessel type'],
        )}
        data={viqVesselTypeFilterOptions}
        value={viqVesselType}
        placeholder={renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Please select'],
        )}
        disabled={disable}
        className={styles.selectSmall}
        onChange={(value) => handleChangeSearchValue('viqVesselType', value)}
      />
    </div>
  );

  const renderPortTypeSelection = (): ReactElement => (
    <div className={styles.wrapSelect}>
      <Select
        labelSelect={renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Port type'],
        )}
        data={portTypeFilterOptions}
        value={portType}
        placeholder={renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Please select'],
        )}
        disabled={disable}
        className={cx(styles.selectSmall, styles.resizePortType)}
        styleLabel={styles.labelFilter}
        onChange={(value) => handleChangeSearchValue('portType', value)}
      />
    </div>
  );

  const renderCountrySelection = (): ReactElement => (
    <div className={styles.wrapSelect}>
      <AsyncSelectForm
        disabled={disable}
        className={cx(styles.selectLarge, styles.resizeCountry)}
        labelSelect={renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS.Country,
        )}
        placeholder={renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Please select'],
        )}
        searchContent={t('txCountry')}
        textSelectAll="Select all"
        textBtnConfirm="Confirm"
        hasImage
        value={country}
        handleConfirm={(value) => {
          handleChangeSearchValue('country', value[0]);
        }}
        onChangeSearch={(value) => handleChangeCountrySearch(value)}
        options={countryFilterOptions}
      />
    </div>
  );

  const renderScopeSelection = (): ReactElement => (
    <div className={styles.wrapSelect}>
      <Select
        labelSelect={renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS.Scope,
        )}
        data={scopeFilterOptions}
        placeholder={renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Please select'],
        )}
        value={scope}
        disabled={disable}
        className={styles.inputSelect}
        onChange={(value) => handleChangeSearchValue('scope', value)}
      />
    </div>
  );

  const renderDateRangeSelection = (): ReactElement => (
    <>
      <DateTimePicker
        wrapperClassName={styles.datePickerWrapper}
        className="w-100 mr-2"
        label={renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Date from'],
        )}
        value={actualAuditFrom ? moment(actualAuditFrom) : undefined}
        onChangeDate={(e) => {
          handleChangeSearchValue('actualAuditFrom', e?.toISOString());
        }}
        inputReadOnly
      />
      <DateTimePicker
        wrapperClassName={styles.datePickerWrapper}
        className="w-100"
        label={renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Date to'],
        )}
        minDate={actualAuditFrom ? moment(actualAuditFrom) : undefined}
        value={actualAuditTo ? moment(actualAuditTo) : undefined}
        onChangeDate={(e) => {
          handleChangeSearchValue('actualAuditTo', e?.toISOString());
        }}
        inputReadOnly
      />
    </>
  );

  const renderStartDate = (): ReactElement => (
    <div className={styles.mr10}>
      <DateTimePicker
        wrapperClassName={cx(styles.datePickerWrapper)}
        className="w-100 "
        label={renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Start date'],
        )}
        value={startDate ? moment(startDate) : undefined}
        onChangeDate={(e) => {
          handleChangeSearchValue('startDate', e?.startOf('day').toISOString());
        }}
      />
    </div>
  );

  return (
    <div
      className={cx(
        styles.wrapperFilter,
        className,
        styles.wrapperFilterNormal,
        'mb-3',
        {
          [styles.wrapFilter1024]: isWrap1024,
        },
      )}
    >
      <Input
        renderPrefix={
          <img src={images.icons.menu.icSearchInActive} alt="buttonReset" />
        }
        onKeyUp={onKeyUp}
        label={renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Search)}
        className={cx(styles.inputSearch)}
        onChange={(e) => handleChangeSearchValue('search', e.target.value)}
        value={content}
        disabled={disable}
        inputSearchCustom={isResizeInputSearch ? styles.inputSearchCustom : ''}
        maxLength={128}
        styleLabel={styles.labelFilter}
        placeholder={renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS.Search,
        )}
      />
      <div className="d-flex align-items-end">
        {vettingFilterOptions && renderVettingSelection()}
        {isStartDate && renderStartDate()}
        {vesselTypeOptions && renderVesselTypeSelection()}
        {fieldTypeOptions && renderFieldTypeSelection()}
        {companyOptions && renderCompanySelection()}
        {viqVesselTypeFilterOptions && renderVIQVesselTypeSelection()}
        {portTypeFilterOptions && renderPortTypeSelection()}
        {countryFilterOptions && renderCountrySelection()}
        {scopeFilterOptions && renderScopeSelection()}
        {dateRangeFilter && renderDateRangeSelection()}
        {roleOptions && renderRoleSelection()}
        {groupOptions && renderGroupSelection()}
        {entityOptions && renderEntitySelection()}
        {statusFilterOptions && renderStatusSelection()}
        <Button
          className={styles.buttonFilter}
          onClick={() => handleGetList()}
          disabled={disable}
          buttonType={ButtonType.Outline}
          buttonSize={ButtonSize.Medium}
        >
          {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Search)}
        </Button>
        {hasClearAllButton && (
          <Button
            onClick={() => handleClearSearchValue()}
            buttonType={ButtonType.OutlineDangerous}
            buttonSize={ButtonSize.Medium}
            className={styles.buttonFilter}
            disabledCss={shouldClearAllBtnBeDisabled()}
            disabled={disable || shouldClearAllBtnBeDisabled()}
          >
            {renderDynamicLabel(
              dynamicLabels,
              COMMON_DYNAMIC_FIELDS['Clear all'],
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default TableFilter;
