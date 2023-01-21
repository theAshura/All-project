import { useMemo, useState } from 'react';
import cx from 'classnames';
import { useDispatch, useSelector } from 'react-redux';

import { convertNumberInt } from 'helpers/utils.helper';
import { getCompanyOutstandingIssuesActions } from 'store/dashboard/dashboard.action';
import useEffectOnce from 'hoc/useEffectOnce';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { MAIN_DASHBOARD_DYNAMIC_FIELDS } from 'constants/dynamic/main-dashboard.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import OutStandingIssueModalContainer from './OutStandingIssueModalContainer';
import { ModalDashboardType } from '../../constants/company.const';
import styles from '../dashboard-master.module.scss';

const OutStandingIssue = () => {
  const dispatch = useDispatch();
  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.Dashboard,
    modulePage: ModulePage.List,
  });

  const [openIssueModal, setOpenIssueModal] = useState<ModalDashboardType>(
    ModalDashboardType.HIDDEN,
  );

  const { companyOutstandingIssues } = useSelector((state) => state.dashboard);

  const outStandingIssue = useMemo(() => {
    let totalNonConformity = 0;
    companyOutstandingIssues?.outstandingIssuesNonConformity?.forEach(
      (item) => {
        totalNonConformity += Number(item.total);
      },
    );
    let totalObservation = 0;
    companyOutstandingIssues?.outstandingIssuesObservation?.forEach((item) => {
      totalObservation += Number(item.total);
    });

    const totalIAR = companyOutstandingIssues?.outstandingIssuesIar?.length;

    const totalAuditTimeTable =
      companyOutstandingIssues?.outstandingIssuesTimeTable?.length;

    const totalROF =
      companyOutstandingIssues?.outstandingIssuesFindingForm?.length;

    return [
      {
        name: renderDynamicLabel(
          dynamicLabels,
          MAIN_DASHBOARD_DYNAMIC_FIELDS[
            'Number of open non-conformity (last 30 days)'
          ],
        ),
        number: convertNumberInt(totalNonConformity),
        modalType: ModalDashboardType.NON_CONFORMITY,
      },
      {
        name: renderDynamicLabel(
          dynamicLabels,
          MAIN_DASHBOARD_DYNAMIC_FIELDS[
            'Number of open observations (last 30 days)'
          ],
        ),
        number: convertNumberInt(totalObservation),
        modalType: ModalDashboardType.OBSERVATIONS,
      },
      {
        name: renderDynamicLabel(
          dynamicLabels,
          MAIN_DASHBOARD_DYNAMIC_FIELDS[
            'Number of inspection time tables not closed out'
          ],
        ),
        number: convertNumberInt(totalAuditTimeTable),
        modalType: ModalDashboardType.NUMBER_AUDIT_TIME_TABLE,
      },
      {
        name: renderDynamicLabel(
          dynamicLabels,
          MAIN_DASHBOARD_DYNAMIC_FIELDS[
            'Number of report of findings not closed out'
          ],
        ),
        number: convertNumberInt(totalROF),
        modalType: ModalDashboardType.NUMBER_REPORT_OF_FINDING,
      },
      {
        name: renderDynamicLabel(
          dynamicLabels,
          MAIN_DASHBOARD_DYNAMIC_FIELDS[
            'Number of inspection reports not closed out'
          ],
        ),
        number: convertNumberInt(totalIAR),
        modalType: ModalDashboardType.NUMBER_INTERNAL_AUDIT_REPORT,
      },
    ];
  }, [
    companyOutstandingIssues?.outstandingIssuesFindingForm?.length,
    companyOutstandingIssues?.outstandingIssuesIar?.length,
    companyOutstandingIssues?.outstandingIssuesNonConformity,
    companyOutstandingIssues?.outstandingIssuesObservation,
    companyOutstandingIssues?.outstandingIssuesTimeTable?.length,
    dynamicLabels,
  ]);

  useEffectOnce(() => {
    dispatch(getCompanyOutstandingIssuesActions.request({}));
  });

  return (
    <div className={cx(styles.contentContainer, styles.wrapTrendOfOutstading)}>
      <strong className={styles.textTitle}>
        {renderDynamicLabel(
          dynamicLabels,
          MAIN_DASHBOARD_DYNAMIC_FIELDS['Outstanding issue'],
        )}
      </strong>
      <div className={styles.openIssueContent}>
        {outStandingIssue.map((each, index) => (
          <div key={each.modalType}>
            <div className={styles.issueContainer}>
              <div className={styles.left}>{each.name}</div>
              <div className={styles.right}>
                <strong>{Number(each?.number) || 0}</strong>
                {Number(each?.number) > 0 && (
                  <div
                    onClick={() => setOpenIssueModal(each?.modalType)}
                    className={styles.viewMoreText}
                  >
                    {renderDynamicLabel(
                      dynamicLabels,
                      MAIN_DASHBOARD_DYNAMIC_FIELDS['View more'],
                    )}
                  </div>
                )}
              </div>
            </div>
            {index !== outStandingIssue.length - 1 && (
              <div className={styles.borderBottom} />
            )}
          </div>
        ))}
      </div>

      <OutStandingIssueModalContainer
        openIssueModal={openIssueModal}
        setOpenIssueModal={setOpenIssueModal}
      />
    </div>
  );
};

export default OutStandingIssue;
