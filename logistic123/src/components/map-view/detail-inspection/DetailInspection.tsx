import { FC, useMemo, useCallback } from 'react';
import cx from 'classnames';
import images from 'assets/images/images';
import { MAP_VIEW_DYNAMIC_FIELDS } from 'constants/dynamic/map-view.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { formatDateNoTime, formatDateLocalNoTime } from 'helpers/date.helper';
import classes from './detail-inspection.module.scss';
import { MAP_VIEW_TABS } from '../filter-map-view/filter.const';

interface Props {
  toggle: () => void;
  isOpen?: boolean;
  inspectionSelected?: any;
  activeTab?: string;
}

const DetailInspection: FC<Props> = ({
  toggle,
  inspectionSelected,
  isOpen,
  activeTab,
}) => {
  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.AuditInspectionMapView,
    modulePage: ModulePage.View,
  });

  const renderRowInfo = useCallback(
    (label?: string, value?: any) => (
      <div className={classes.lineInfo}>
        <div className={classes.label}>
          {renderDynamicLabel(dynamicLabels, MAP_VIEW_DYNAMIC_FIELDS[label])}
        </div>
        <div className={classes.value}>{value || '-'}</div>
      </div>
    ),
    [dynamicLabels],
  );

  const renderList = useMemo(() => {
    if (activeTab === MAP_VIEW_TABS.INSPECTION) {
      return (
        <div className="position-relative">
          <div
            className={cx(classes.toggleButton, {
              [classes.hideButton]: !isOpen,
            })}
            onClick={toggle}
          >
            <img src={images.icons.icArrowLeft} alt="icArrowLeft" />
          </div>

          <div
            className={cx(classes.wrap, {
              [classes.hideDetail]: !isOpen,
            })}
          >
            <img
              src={
                inspectionSelected?.logo && inspectionSelected?.logo?.link
                  ? inspectionSelected?.logo?.link
                  : images.common.imageDefault
              }
              onError={({ currentTarget }) => {
                if (currentTarget && currentTarget?.src) {
                  // eslint-disable-next-line no-param-reassign
                  currentTarget.src = images.common.imageDefault;
                }
              }}
              alt=""
              className={classes.logo}
            />

            <div className={classes.wrapInfo}>
              <div className={cx(classes.name, 'pb-0')}>
                {renderRowInfo('Inspection no', inspectionSelected?.auditNo)}
              </div>
              {renderRowInfo(
                inspectionSelected?.entityType === 'Office'
                  ? 'Company name'
                  : 'Vessel name',
                inspectionSelected?.entityType === 'Office'
                  ? inspectionSelected?.auditCompany?.name
                  : inspectionSelected?.vessel?.name,
              )}
              {inspectionSelected?.entityType === 'Office' &&
                renderRowInfo(
                  'Department',
                  inspectionSelected?.department?.name,
                )}
              {inspectionSelected?.entityType === 'Vessel' &&
                renderRowInfo(
                  'Fleet name',
                  inspectionSelected?.vessel?.fleet?.name,
                )}
              {inspectionSelected?.entityType === 'Vessel' &&
                renderRowInfo(
                  'Vessel type',
                  inspectionSelected?.vessel?.vesselType?.name,
                )}
              {renderRowInfo('Visit type', inspectionSelected?.typeOfAudit)}
              {renderRowInfo(
                'Inspection type',
                inspectionSelected?.auditTypes?.map((e) => e?.name)?.join(', '),
              )}
              {renderRowInfo('Working type', inspectionSelected?.workingType)}
              {inspectionSelected?.entityType !== 'Office' &&
                renderRowInfo('From port', inspectionSelected?.fromPort?.name)}
              {inspectionSelected?.entityType !== 'Office' &&
                renderRowInfo('To port', inspectionSelected?.toPort?.name)}
              {renderRowInfo(
                'Planned from date',
                formatDateNoTime(inspectionSelected?.plannedFromDate),
              )}
              {renderRowInfo(
                'Planned to date',
                formatDateNoTime(inspectionSelected?.plannedToDate),
              )}
              {renderRowInfo(
                'Name of inspector',
                inspectionSelected?.auditors
                  ?.map((e) => e?.username)
                  ?.join(', ') || '-',
              )}

              {renderRowInfo(
                'Name of lead inspector',
                inspectionSelected?.leadAuditor?.username,
              )}
            </div>
          </div>
        </div>
      );
    }
    return (
      <div className="position-relative">
        <div
          className={cx(classes.toggleButton, {
            [classes.hideButton]: !isOpen,
          })}
          onClick={toggle}
        >
          <img src={images.icons.icArrowLeft} alt="icArrowLeft" />
        </div>

        <div
          className={cx(classes.wrap, {
            [classes.hideDetail]: !isOpen,
          })}
        >
          <img
            src={
              inspectionSelected?.avatarUrl?.link
                ? `${inspectionSelected?.avatarUrl?.link}`
                : images.common.imageDefault
            }
            onError={({ currentTarget }) => {
              if (currentTarget && currentTarget?.src) {
                // eslint-disable-next-line no-param-reassign
                currentTarget.src = images.common.imageDefault;
              }
            }}
            alt=""
            className={classes.logo}
          />

          <div className={classes.wrapInfo}>
            <div className={classes.name}>{inspectionSelected?.username}</div>
            {renderRowInfo('First name', inspectionSelected?.firstName)}
            {renderRowInfo('Last name', inspectionSelected?.lastName)}
            {renderRowInfo('Job title', inspectionSelected?.jobTitle)}
            {renderRowInfo('Company', inspectionSelected?.company?.name)}
            {renderRowInfo('Nationality', inspectionSelected?.nationality)}
            {renderRowInfo('Email', inspectionSelected?.email)}
            {renderRowInfo('Phone number', inspectionSelected?.phoneNumber)}
            {renderRowInfo('Gender', inspectionSelected?.gender)}
            {renderRowInfo(
              'Date of birth',
              formatDateLocalNoTime(inspectionSelected?.dob),
            )}
          </div>
        </div>
      </div>
    );
  }, [activeTab, inspectionSelected, isOpen, renderRowInfo, toggle]);
  return renderList;
};

export default DetailInspection;
