import Table, { ColumnsType } from 'antd/lib/table';
import Tooltip from 'antd/lib/tooltip';
import { getListTopicsActionsApi } from 'api/topic.api';

import cx from 'classnames';
import { OptionsType } from 'components/common/options-container/OptionsContainer';
import ModalComponent, { ModalType } from 'components/ui/modal/Modal';
import { AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/auditInspectionTemplate.const';
import { I18nNamespace } from 'constants/i18n.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { toastError } from 'helpers/notification.helper';
import useEffectOnce from 'hoc/useEffectOnce';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import NoDataImg from 'components/common/no-data/NoData';
import { Topic } from 'models/api/topic/topic.model';
import { FC, useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styles from './section-information-modal.module.scss';

interface Props {
  modal: boolean;
  toggle: () => void;
  header?: string;
  dynamicLabel?: IDynamicLabel;
}

const SectionInformationModal: FC<Props> = ({
  modal,
  toggle,
  header,
  dynamicLabel,
}) => {
  const { t } = useTranslation([
    I18nNamespace.AUDIT_CHECKLIST,
    I18nNamespace.COMMON,
  ]);
  const { listQuestion } = useSelector((store) => store.auditCheckList);
  const { userInfo } = useSelector((state) => state.authenticate);

  const [dataTopic, setDataTopic] = useState<Topic[]>([]);
  const paramDefaults = {
    page: 1,
    pageSize: -1,
    status: 'active',
    companyId: userInfo?.mainCompanyId,
  };
  const TOOLTIP_COLOR = '#3B9FF3';
  const columnsSectionInformation: ColumnsType = useMemo(
    () => [
      {
        title: dynamicLabel
          ? renderDynamicLabel(
              dynamicLabel,
              AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                'S.No'
              ],
            )
          : t('sectionInformation.sNo'),
        key: 'sNo',
        width: 100,
        dataIndex: 'sNo',
        render: (text) => (
          <Tooltip placement="topLeft" title={text} color={TOOLTIP_COLOR}>
            <span className={cx(styles.textContent, 'limit-line-text')}>
              {text}
            </span>
          </Tooltip>
        ),
      },
      {
        title: dynamicLabel
          ? renderDynamicLabel(
              dynamicLabel,
              AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                'Question code'
              ],
            )
          : t('sectionInformation.questionCode'),
        key: 'questionCode',
        width: 160,
        dataIndex: 'questionCode',
        render: (text) => (
          <Tooltip placement="topLeft" title={text} color={TOOLTIP_COLOR}>
            <span className={cx(styles.textContent, 'limit-line-text')}>
              {text}
            </span>
          </Tooltip>
        ),
      },
      {
        title: dynamicLabel
          ? renderDynamicLabel(
              dynamicLabel,
              AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                'Question name'
              ],
            )
          : t('sectionInformation.questionName'),
        key: 'questionName',
        width: 160,
        dataIndex: 'questionName',
        render: (text) => (
          <Tooltip placement="topLeft" title={text} color={TOOLTIP_COLOR}>
            <span className={cx(styles.textContent, 'limit-line-text')}>
              {text}
            </span>
          </Tooltip>
        ),
      },
      {
        title: dynamicLabel
          ? renderDynamicLabel(
              dynamicLabel,
              AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                'Question type'
              ],
            )
          : t('sectionInformation.questionType'),
        key: 'questionType',
        width: 160,
        dataIndex: 'questionType',
        render: (text) => (
          <Tooltip placement="topLeft" title={text} color={TOOLTIP_COLOR}>
            <span className={cx(styles.textContent, 'limit-line-text')}>
              {text}
            </span>
          </Tooltip>
        ),
      },
      {
        title: dynamicLabel
          ? renderDynamicLabel(
              dynamicLabel,
              AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                'Allow values'
              ],
            )
          : t('sectionInformation.allowValues'),
        key: 'allowValues',
        width: 160,
        dataIndex: 'allowValues',
        render: (text) => (
          <Tooltip placement="topLeft" title={text} color={TOOLTIP_COLOR}>
            <span className={cx(styles.textContent, 'limit-line-text')}>
              {text}
            </span>
          </Tooltip>
        ),
      },
      {
        title: dynamicLabel
          ? renderDynamicLabel(
              dynamicLabel,
              AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList.Hint,
            )
          : t('sectionInformation.hint'),
        key: 'hint',
        width: 160,
        dataIndex: 'hint',
        render: (text) => (
          <Tooltip placement="topLeft" title={text} color={TOOLTIP_COLOR}>
            <span className={cx(styles.textContent, 'limit-line-text')}>
              {text}
            </span>
          </Tooltip>
        ),
      },
      // {
      //   title: t('sectionInformation.allowDecimal'),
      //   key: 'allowDecimal',
      //   width: 160,
      //   dataIndex: 'allowDecimal',
      //   render: (text) => (
      //     <Tooltip placement="topLeft" title={text} color={TOOLTIP_COLOR}>
      //       <span className={cx(styles.textContent, 'limit-line-text')}>
      //         {text}
      //       </span>
      //     </Tooltip>
      //   ),
      // },
      {
        title: dynamicLabel
          ? renderDynamicLabel(
              dynamicLabel,
              AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                'Mandatory remarks'
              ],
            )
          : t('sectionInformation.mandatoryRemarks'),
        key: 'mandatoryRemarks',
        width: 160,
        dataIndex: 'mandatoryRemarks',
        render: (text) => (
          <Tooltip placement="topLeft" title={text} color={TOOLTIP_COLOR}>
            <span className={cx(styles.textContent, 'limit-line-text')}>
              {text}
            </span>
          </Tooltip>
        ),
      },
      {
        title: dynamicLabel
          ? renderDynamicLabel(
              dynamicLabel,
              AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                'Min picture required'
              ],
            )
          : t('sectionInformation.minPicRequired'),
        key: 'minPicRequired',
        width: 160,
        dataIndex: 'minPicRequired',
        render: (text) => (
          <Tooltip placement="topLeft" title={text} color={TOOLTIP_COLOR}>
            <span className={cx(styles.textContent, 'limit-line-text')}>
              {text}
            </span>
          </Tooltip>
        ),
      },
      {
        title: dynamicLabel
          ? renderDynamicLabel(
              dynamicLabel,
              AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
                'Rating Criteria'
              ],
            )
          : t('sectionInformation.ratingCriteria'),
        key: 'ratingCriteria',
        width: 160,
        dataIndex: 'ratingCriteria',
        render: (text) => (
          <Tooltip placement="topLeft" title={text} color={TOOLTIP_COLOR}>
            <span className={cx(styles.textContent, 'limit-line-text')}>
              {text}
            </span>
          </Tooltip>
        ),
      },
      {
        title: dynamicLabel
          ? renderDynamicLabel(
              dynamicLabel,
              AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList.Topic,
            )
          : t('sectionInformation.topic'),
        key: 'topic',
        width: 160,
        dataIndex: 'topic',
        render: (text) => (
          <Tooltip placement="topLeft" title={text} color={TOOLTIP_COLOR}>
            <span className={cx(styles.textContent, 'limit-line-text')}>
              {text}
            </span>
          </Tooltip>
        ),
      },
      {
        title: dynamicLabel
          ? renderDynamicLabel(
              dynamicLabel,
              AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList
                .Evidence,
            )
          : t('sectionInformation.evidence'),
        key: 'evidence',
        width: 160,
        dataIndex: 'evidence',
        render: (text) => (
          <Tooltip placement="topLeft" title={text} color={TOOLTIP_COLOR}>
            <span className={cx(styles.textContent, 'limit-line-text')}>
              {text}
            </span>
          </Tooltip>
        ),
      },
    ],
    [dynamicLabel, t],
  );

  const dataQuestionSectionInformation: Object[] = useMemo(
    () =>
      listQuestion?.map((item, index) => ({
        key: `id${index + 1}`,
        id: item?.id,
        sNo: index + 1,
        questionCode: item?.code,
        questionName: item?.question,
        questionType: item?.type,
        allowValues:
          OptionsType.YES_NO_NA !== item?.type &&
          OptionsType.YES_NO !== item?.type
            ? item?.answerOptions?.map((item) => item?.content).join(', ')
            : null,
        hint: item?.hint,
        mandatoryRemarks: item?.isMandatory ? 'Yes' : 'No',
        minPicRequired: item?.minPictureRequired,
        ratingCriteria: item?.ratingCriteria,
        topic: dataTopic?.find((i) => i?.id === item?.topicId)?.name,
        evidence: item?.requireEvidencePicture ? 'Yes' : 'No',
      })),
    [listQuestion, dataTopic],
  );

  const renderContent = useCallback(
    () => (
      <div className={cx(styles.contentWrapper)}>
        <div className={styles.title}>
          {renderDynamicLabel(
            dynamicLabel,
            AUDIT_CHECKLIST_TEMPLATE_DYNAMIC_DETAIL_FIELDS.questionList[
              'Question details'
            ],
          )}
        </div>
        <div className={styles.table}>
          {dataQuestionSectionInformation?.length ? (
            <Table
              columns={columnsSectionInformation}
              className={cx(styles.tableWrapper)}
              dataSource={dataQuestionSectionInformation}
              scroll={{ x: 900, y: 300 }}
              rowClassName={styles.rowWrapper}
              size="large"
              pagination={false}
            />
          ) : (
            <div className={cx(styles.dataWrapperEmpty)}>
              <NoDataImg />
            </div>
          )}
        </div>
      </div>
    ),
    [columnsSectionInformation, dataQuestionSectionInformation, dynamicLabel],
  );

  useEffectOnce(() => {
    getListTopicsActionsApi({ ...paramDefaults })
      .then((r) => {
        setDataTopic(r?.data?.data);
      })
      .catch((e) => toastError(e));
  });

  return (
    <ModalComponent
      content={renderContent()}
      isOpen={modal}
      bodyClassName={styles.modalBody}
      toggle={toggle}
      title={header}
      modalType={ModalType.CENTER}
      w="900px"
    />
  );
};

export default SectionInformationModal;
