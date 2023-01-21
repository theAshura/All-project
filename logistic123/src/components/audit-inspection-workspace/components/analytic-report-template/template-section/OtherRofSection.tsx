import cx from 'classnames';
import { Col, Row, Table } from 'reactstrap';
import styles from './template-section.module.scss';
import LayoutTemplate from '../layout-template/LayoutTemplate';

const OtherRofSection = () => {
  const data = [
    {
      questionCode: 'CDM:01-8test',
      item: {
        Q: 'The interval between the inspections should not be more than 12 months,The interval between the inspections should not be more than 12 months',
        Finding:
          'No 4 WBT and No 5 WBT not inspected for over 24 months. SMS states period of inspection as 12 months',
      },
      answer: 'yes',
      rectified: '',
    },
    // {
    //   questionCode: 'CDM:01-8',
    //   item: {
    //     Q: 'The interval between the inspections should not be more than 12 months,The interval between the inspections should not be more than 12 months',
    //     Finding:
    //       'No 4 WBT and No 5 WBT not inspected for over 24 months. SMS states period of inspection as 12 months',
    //   },
    //   answer: 'yes',
    //   rectified: '',
    // },
    // {
    //   questionCode: 'CDM:01-8',
    //   item: {
    //     Q: 'The interval between the inspections should not be more than 12 months,The interval between the inspections should not be more than 12 months',
    //     Finding:
    //       'No 4 WBT and No 5 WBT not inspected for over 24 months. SMS states period of inspection as 12 months',
    //   },
    //   answer: 'yes',
    //   rectified: '',
    // },
    // {
    //   questionCode: 'CDM:01-8',
    //   item: {
    //     Q: 'The interval between the inspections should not be more than 12 months,The interval between the inspections should not be more than 12 months',
    //     Finding:
    //       'No 4 WBT and No 5 WBT not inspected for over 24 months. SMS states period of inspection as 12 months',
    //   },
    //   answer: 'yes',
    //   rectified: '',
    // },
    // {
    //   questionCode: 'CDM:01-8',
    //   item: {
    //     Q: 'The interval between the inspections should not be more than 12 months,The interval between the inspections should not be more than 12 months',
    //     Finding:
    //       'No 4 WBT and No 5 WBT not inspected for over 24 months. SMS states period of inspection as 12 months',
    //   },
    //   answer: 'yes',
    //   rectified: '',
    // },
    // {
    //   questionCode: 'CDM:01-8',
    //   item: {
    //     Q: 'The interval between the inspections should not be more than 12 months,The interval between the inspections should not be more than 12 months',
    //     Finding:
    //       'No 4 WBT and No 5 WBT not inspected for over 24 months. SMS states period of inspection as 12 months',
    //   },
    //   answer: 'yes',
    //   rectified: '',
    // },
  ];
  return (
    <LayoutTemplate>
      <div className={cx(styles.pdfWrap)}>
        <p className={styles.titleHeader}>Other Report of Finding</p>
        <Row>
          <Col xs={12}>
            <Table hover className={styles.table}>
              <thead>
                <tr className={styles.title}>
                  <th>CODE</th>
                  <th>ITEM</th>
                  <th>FINDING</th>
                  <th>ANSWER</th>
                  <th>RECTIEFIED ON BOARD</th>
                  <th> </th>
                </tr>
              </thead>

              <tbody>
                {data.map((item, index) => (
                  <tr key={String(`other-rof-${index}`)}>
                    <td className={cx(styles.inputCode)}>
                      {item.questionCode}
                    </td>
                    <td className={cx(styles.inputItem)}>
                      <p>
                        <span className={cx(styles.highLight)}>
                          CERTIFICATE & DOCUMENT MANAGEMENT
                        </span>
                        <p>
                          <span>
                            {' '}
                            <span
                              className={cx(styles.highLight, styles.normal)}
                            >
                              Q:
                            </span>
                          </span>
                          {item.item.Q}
                        </p>
                      </p>
                    </td>
                    <td className={cx(styles.inputFinding)}>
                      <p>{item.item.Finding}</p>
                    </td>
                    <td className={cx(styles.inputAnswer)}>{item.answer}</td>
                    <td className={cx(styles.inputRectified)}>
                      {item.rectified}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Col>
        </Row>
      </div>
    </LayoutTemplate>
  );
};

export default OtherRofSection;
