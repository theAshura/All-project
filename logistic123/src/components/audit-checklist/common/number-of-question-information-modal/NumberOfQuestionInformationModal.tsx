import { FC, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Tooltip from 'antd/lib/tooltip';
import { I18nNamespace } from 'constants/i18n.const';
import { Row, Col } from 'reactstrap';
import cx from 'classnames';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import ModalComponent, { ModalType } from 'components/ui/modal/Modal';
import { AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/auditInspectionTemplate.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import styles from './number-of-question-information-modal.module.scss';

interface Props {
  modal: boolean;
  toggle: () => void;
  header?: string;
  dataMaster?: {
    name: string;
    value: string;
  }[];
  iconActives?: string[];
  dynamicLabels?: IDynamicLabel;
}
const sortIndex = [
  'topicId',
  'location',
  'hint',
  'vessel-type',
  'cdi',
  'viq',
  'charter-owner',
  'main-category',
  'second-category',
  'third-category',
  'shore-rank',
  'shore-department',
  'ship-department',
];

const titleObj = {
  'main-category': 'mainCategory',
  topicId: 'topicId',
  'shore-department': 'shoreDepartment',
  'ship-department': 'shipDepartment',
  hint: 'hint',
  location: 'location',
  'vessel-type': 'vesselType',
  viq: 'viq',
  'second-category': 'secondCategory',
  'third-category': 'thirdCategory',
  'shore-rank': 'shoreRank',
  'charter-owner': 'charterOwner',
  cdi: 'cdi',
};
const NumberOfQuestionInformationModal: FC<Props> = (props) => {
  const { t } = useTranslation(I18nNamespace.AUDIT_CHECKLIST);
  const { modal, toggle, dataMaster, iconActives, dynamicLabels, header } =
    props;
  const TOOLTIP_COLOR = '#3B9FF3';
  const formatData: any = useMemo(() => {
    let result = {};
    dataMaster?.forEach((item) => {
      result = { ...result, [item.name]: item.value };
    });
    return result;
  }, [dataMaster]);

  const nonUsedField = ['ship-rank'];

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const icons = [];

  const iconSort = [
    ...iconActives.filter(
      (item) =>
        !nonUsedField.includes(item) &&
        dataMaster.find((i) => i.name === item && i.value),
    ),
  ];
  iconSort.sort((a, b) => sortIndex.indexOf(a) - sortIndex.indexOf(b));
  iconSort?.forEach((item, index) => {
    if (!(index % 3)) {
      icons.push([item]);
    } else {
      icons[Math.floor(index / 3)].push(item);
    }
  });

  const renderTitle = useCallback(
    (title: string) => {
      switch (title) {
        case 'numberOfQuestionInformation.topicId':
          return renderDynamicLabel(
            dynamicLabels,
            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList.Topic,
          );
        case 'numberOfQuestionInformation.location':
          return renderDynamicLabel(
            dynamicLabels,
            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList
              .Location,
          );
        case 'numberOfQuestionInformation.hint':
          return renderDynamicLabel(
            dynamicLabels,
            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList.Hint,
          );
        case 'numberOfQuestionInformation.vesselType':
          return renderDynamicLabel(
            dynamicLabels,
            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
              'Vessel type'
            ],
          );
        case 'numberOfQuestionInformation.cdi':
          return renderDynamicLabel(
            dynamicLabels,
            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
              'Vessel type'
            ],
          );
        case 'numberOfQuestionInformation.viq':
          return renderDynamicLabel(
            dynamicLabels,
            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList.VIQ,
          );
        case 'numberOfQuestionInformation.charterOwner':
          return renderDynamicLabel(
            dynamicLabels,
            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
              'Charter/ Owner'
            ],
          );
        case 'numberOfQuestionInformation.mainCategory':
          return renderDynamicLabel(
            dynamicLabels,
            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
              'Main category'
            ],
          );
        case 'numberOfQuestionInformation.secondCategory':
          return renderDynamicLabel(
            dynamicLabels,
            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
              'Second category'
            ],
          );
        case 'numberOfQuestionInformation.thirdCategory':
          return renderDynamicLabel(
            dynamicLabels,
            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
              'Third category'
            ],
          );
        case 'numberOfQuestionInformation.1stCategory':
          return renderDynamicLabel(
            dynamicLabels,
            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
              'Second category'
            ],
          );
        case 'numberOfQuestionInformation.shoreRank':
          return renderDynamicLabel(
            dynamicLabels,
            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
              'Shore rank'
            ],
          );
        case 'numberOfQuestionInformation.shoreDepartment':
          return renderDynamicLabel(
            dynamicLabels,
            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
              'Shore department'
            ],
          );
        case 'numberOfQuestionInformation.shipDepartment':
          return renderDynamicLabel(
            dynamicLabels,
            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
              'Ship department'
            ],
          );
        default:
          return '';
      }
    },
    [dynamicLabels],
  );

  const renderContent = useCallback(
    () => (
      <div className={styles.wrapContent}>
        {icons?.map((arr, index) => (
          <Row className="pb-3 mx-0" key={formatData[arr[0]]}>
            <Col className={styles.noInput}>
              <p className={cx(styles.text, styles.title)}>
                {renderTitle(
                  `numberOfQuestionInformation.${titleObj[arr[0]]}`,
                ) || t(`numberOfQuestionInformation.${titleObj[arr[0]]}`)}
              </p>
              <Tooltip
                placement="topLeft"
                title={formatData[arr[0]]}
                color={TOOLTIP_COLOR}
              >
                <p
                  className={cx('limit-line-text', styles.text, styles.content)}
                >
                  {formatData[arr[0]]}
                </p>
              </Tooltip>
            </Col>
            <Col className={styles.noInput}>
              {arr[1] ? (
                <p className={cx(styles.text, styles.title)}>
                  {renderTitle(
                    `numberOfQuestionInformation.${titleObj[arr[1]]}`,
                  ) || t(`numberOfQuestionInformation.${titleObj[arr[1]]}`)}
                </p>
              ) : (
                ''
              )}
              {arr[1] ? (
                <Tooltip
                  placement="topLeft"
                  title={formatData[arr[1]]}
                  color={TOOLTIP_COLOR}
                >
                  <p
                    className={cx(
                      'limit-line-text',
                      styles.text,
                      styles.content,
                    )}
                  >
                    {formatData[arr[1]]}
                  </p>
                </Tooltip>
              ) : (
                ''
              )}
            </Col>
            <Col className={styles.noInput}>
              {arr[2] ? (
                <p className={cx(styles.text, styles.title)}>
                  {renderTitle(
                    `numberOfQuestionInformation.${titleObj[arr[2]]}`,
                  ) || t(`numberOfQuestionInformation.${titleObj[arr[2]]}`)}
                </p>
              ) : (
                ''
              )}
              {arr[2] ? (
                <Tooltip
                  placement="topLeft"
                  title={formatData[arr[2]]}
                  color={TOOLTIP_COLOR}
                >
                  <p
                    className={cx(
                      'limit-line-text',
                      styles.text,
                      styles.content,
                    )}
                  >
                    {formatData[arr[2]]}
                  </p>
                </Tooltip>
              ) : (
                ''
              )}
            </Col>
          </Row>
        ))}
      </div>
    ),
    [icons, renderTitle, t, formatData],
  );

  return (
    <ModalComponent
      content={renderContent()}
      isOpen={modal}
      bodyClassName={styles.modalBody}
      toggle={toggle}
      title={header}
      modalType={ModalType.CENTER}
    />
  );
};

export default NumberOfQuestionInformationModal;
