import cx from 'classnames';
import { DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS } from 'constants/dynamic/report-of-finding.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { FC } from 'react';

import styles from './form.module.scss';

interface FindingDetailsProps {
  loading?: boolean;
  data?: any;
  memo?: string;
  dynamicLabels?: IDynamicLabel;
}

export const FindingDetails: FC<FindingDetailsProps> = (props) => {
  const { data, memo, dynamicLabels } = props;

  return (
    <div className={styles.wrapperContainer}>
      <div className={cx(styles.containerForm)}>
        <div className="d-flex justify-content-between align-items-center">
          <div className={cx(styles.titleContainer)}>
            {renderDynamicLabel(
              dynamicLabels,
              DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Findings details'],
            )}
          </div>
        </div>
        <div className={styles.tableFindingDetails}>
          <table>
            <thead>
              <tr>
                <th>
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS[
                      'Total no of findings'
                    ],
                  )}
                </th>
                <th>
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS[
                      'Total no of non conformity'
                    ],
                  )}
                </th>
                <th>
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS[
                      'Total no of observation'
                    ],
                  )}
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{data?.noOfFindings}</td>
                <td>{data?.noOfNonConformity}</td>
                <td>{data?.noOfObservation}</td>
              </tr>
            </tbody>
          </table>
          <div className={styles.divider} />
        </div>
        <div className={styles.generalInformation}>
          <div className={styles.title}>
            {renderDynamicLabel(
              dynamicLabels,
              DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS.Memo,
            )}
          </div>
          <div className={styles.content}>{memo || '-'}</div>
        </div>
      </div>
    </div>
  );
};
