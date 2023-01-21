import cx from 'classnames';
import styles from 'components/common/table/table.module.scss';
import lowerCase from 'lodash/lowerCase';
import upperFirst from 'lodash/upperFirst';

export interface RowStatusProps {
  status: string;
}

export const statusColor = {
  blue_3: [
    'active',
    'open',
    'submitted',
    'new',
    'in progress',
    'reviewed',
    'accepted',
    'auditor accepted',
    'vessel',
    'planned',
    lowerCase('Sent CAR/Under CAP preparation'),
    lowerCase('Approved verification/Closed'),
    lowerCase('Approved CAP/No need further verification/Closed'),
    lowerCase('Waiting Verification'),
    lowerCase('Opening schedule'),
    lowerCase('Approved report'),
    lowerCase('Submit CAP/Waiting CAP approval'),
    lowerCase('Disapproved CAP/Waiting CAP approval'),
    lowerCase('Submitted report/Under 1st approval'),
    lowerCase('Disapproved report'),
  ],
  iar_reviewed: [
    'reviewed1',
    'reviewed2',
    'reviewed3',
    'reviewed4',
    'reviewed5',
  ],
  red_6: ['closeout', 'rejected', 'reassigned', 'reassign', 'office'],
  orange_3: ['draft', 'yet to start', 'sign out'],
  red_3: ['cancelled', 'inactive', 'close', 'closed'],
  green_1: ['approved', 'close out', 'closeout', 'sign in'],
  green_2: ['planned successfully', 'completed', 'final'],
  yellow_2: ['pending'],
};

const RowStatus = ({ status }: RowStatusProps) => (
  <span
    className={cx({
      [styles.blue_3]:
        statusColor.blue_3.includes(lowerCase(status)) ||
        statusColor.iar_reviewed.includes(status),
      [styles.red_3]: statusColor.red_3.includes(lowerCase(status)),
      [styles.orange_3]: statusColor.orange_3.includes(lowerCase(status)),
      [styles.red_6]: statusColor.red_6.includes(lowerCase(status)),
      [styles.green_1]: statusColor.green_1.includes(lowerCase(status)),
      [styles.green_2]: statusColor.green_2.includes(lowerCase(status)),
      [styles.yellow_2]: statusColor.yellow_2.includes(lowerCase(status)),
    })}
  >
    {upperFirst(status)}
  </span>
);

export default RowStatus;
