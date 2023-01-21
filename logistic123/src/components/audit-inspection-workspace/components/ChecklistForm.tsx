import cx from 'classnames';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';

import { Col, Row } from 'reactstrap';

import Button, { ButtonType } from 'components/ui/button/Button';
import {
  AuditInspectionWorkspaceDetailResponse,
  AuditInspectionChecklistResponse,
  FillQuestionExtend,
} from 'models/api/audit-inspection-workspace/audit-inspection-workspace.model';
import Tabs from 'antd/lib/tabs';
import {
  formatDateTimeDay,
  handleAndDownloadFilePdf,
} from 'helpers/utils.helper';
import {
  getAuditWorkspaceChecklistDetailActions,
  updateAuditWorkspaceChecklistDetailActions,
  submitAuditWorkspaceChecklistDetailActions,
} from 'store/audit-inspection-workspace/audit-inspection-workspace.action';

import { FillAuditChecklistStatus } from 'constants/common.const';
import images from 'assets/images/images';
import { pdfFillChecklistActionsApi } from 'api/audit-inspection-workspace.api';
import { toastError } from 'helpers/notification.helper';
import {
  ArrowLeftOutlined,
  DownloadOutlined,
  LoadingOutlined,
} from '@ant-design/icons';
import PermissionCheck from 'hoc/withPermissionCheck';
import {
  ActionTypeEnum,
  Features,
  SubFeatures,
} from 'constants/roleAndPermission.const';
import { DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-workspace.const';
import { useSelector, useDispatch } from 'react-redux';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { IDynamicLabel } from '../../../models/api/dynamic/dynamic.model';
import styles from './tab.module.scss';
import QuestionForm from './TabChecklist/QuestionForm';
import {
  checkRemark,
  checkRequireAttachment,
  checkRequireEvidence,
} from '../checkQuestion.helper';

interface ChecklistFormProps {
  data: AuditInspectionWorkspaceDetailResponse;
  selectedItem: AuditInspectionChecklistResponse;
  disabled?: boolean;
  loading?: boolean;
  toggle: () => void;
  dynamicLabels?: IDynamicLabel;
}

const ChecklistForm: FC<ChecklistFormProps> = ({
  data,
  selectedItem,
  toggle,
  loading,
  disabled,
  dynamicLabels,
}) => {
  const { fillQuestionDetail } = useSelector(
    (state) => state.auditInspectionWorkspace,
  );

  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('');
  const [firstErrorId, setFirstErrorId] = useState('');
  const [loadingExport, setExportLoading] = useState<boolean>(false);

  const [isSubmit, setIsSubmit] = useState(false);

  const [errorTabs, setErrorTabs] = useState<string[]>([]);

  const [fillChecklist, setFillChecklist] = useState<FillQuestionExtend[]>([]);

  useEffect(() => {
    if (selectedItem) {
      dispatch(
        getAuditWorkspaceChecklistDetailActions.request({
          workspaceId: selectedItem?.auditWorkspaceId,
          fillChecklistId: selectedItem?.id,
        }),
      );
    }
    return () => {
      dispatch(getAuditWorkspaceChecklistDetailActions.success(undefined));
    };
  }, [dispatch, selectedItem]);

  useEffect(() => {
    if (fillQuestionDetail && fillQuestionDetail?.length) {
      if (fillQuestionDetail?.length) {
        setActiveTab(fillQuestionDetail[0]?.topic);
      } else {
        setActiveTab(undefined);
      }
      const questions: FillQuestionExtend[] = [];

      fillQuestionDetail.forEach((topicItem) => {
        topicItem?.questions?.forEach((item) => {
          // const auditTypeId = item?.chkQuestion?.auditChecklist?.id || '';
          const auditTypeId =
            item?.chkQuestion?.auditChecklist?.inspectionMappings?.[0]
              ?.auditTypeId || '';
          const natureFindingId =
            item?.chkQuestion?.auditChecklist?.inspectionMappings?.[0]
              ?.natureFindings?.[0]?.natureFindingId || '';

          questions?.push({
            id: item?.id,
            hasRemark: item?.chkQuestion?.hasRemark || '',
            topicName: topicItem?.topic || '',
            remarkSpecificAnswers:
              item?.chkQuestion?.remarkSpecificAnswers || [],
            requireEvidencePicture: item?.chkQuestion?.requireEvidencePicture,
            isMandatory: item?.chkQuestion?.isMandatory,
            answers: item?.answers || [],
            evidencePictures: item?.evidencePictures || [],
            attachments: item?.attachments || [],
            minPictureRequired: item?.chkQuestion?.minPictureRequired || 0,
            chkQuestionId: item?.chkQuestionId || '',
            findingRemark: item?.findingRemark,
            memo: item?.memo || '',
            referenceData: item?.referenceData,
            reportFindingItem: {
              id: item?.reportFindingItem?.id,
              auditChecklistId: item?.chkQuestion?.auditChecklistId,
              natureFindingId:
                item?.reportFindingItem?.natureFindingId ||
                natureFindingId ||
                '',
              auditTypeId:
                item?.reportFindingItem?.auditTypeId || auditTypeId || '',
              isSignificant: item?.reportFindingItem?.isSignificant,
              rectifiedOnBoard: item?.reportFindingItem?.rectifiedOnBoard,
              findingComment: item?.reportFindingItem?.findingComment,
              mainCategoryId:
                item?.reportFindingItem?.mainCategoryId ||
                item?.chkQuestion?.mainCategoryId,
              secondCategoryId:
                item?.reportFindingItem?.secondCategoryId ||
                item?.chkQuestion?.referencesCategoryData?.find(
                  (item) => item.masterTableId === 'second-category',
                )?.valueId,
              thirdCategoryId:
                item?.reportFindingItem?.thirdCategoryId ||
                item?.chkQuestion?.referencesCategoryData?.find(
                  (item) => item.masterTableId === 'third-category',
                )?.valueId,
            },
          });
        });
      });
      setFillChecklist(questions);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fillQuestionDetail]);

  useEffect(() => {
    if (isSubmit) {
      let errorsFilters = [];
      fillChecklist.forEach((checklistItem) => {
        if (
          !checklistItem?.answers?.length ||
          checkRemark(checklistItem) ||
          checkRequireAttachment(checklistItem) ||
          checkRequireEvidence(checklistItem)
        ) {
          if (!errorsFilters.includes(checklistItem.topicName)) {
            errorsFilters = [...errorsFilters, checklistItem.topicName];
          }
        }
      });
      setErrorTabs(errorsFilters);
    }
  }, [isSubmit, fillChecklist]);

  const handleChangeAnswer = useCallback(
    (id: string, fieldName: string, params: string[] | string) => {
      const newState = fillChecklist.map((item) => {
        if (id === item?.id && fieldName !== 'id') {
          return { ...item, [fieldName]: params };
        }
        return item;
      });
      setFillChecklist(newState);
    },
    [fillChecklist],
  );

  const handleChangeFindingReport = useCallback(
    (id: string, fieldName: string, values: string) => {
      const newState = fillChecklist.map((item) => {
        if (id === item?.id && fieldName !== 'id') {
          if (fieldName === 'findingRemark') {
            return {
              ...item,
              findingRemark: values,
              reportFindingItem: {
                ...item.reportFindingItem,
                findingComment: values,
              },
            };
          }

          if (fieldName === 'memo') {
            return {
              ...item,
              memo: values,
              reportFindingItem: {
                ...item.reportFindingItem,
              },
            };
          }
          return {
            ...item,
            reportFindingItem: {
              ...item.reportFindingItem,
              [fieldName]: values,
            },
          };
        }
        return item;
      });
      setFillChecklist(newState);
    },
    [fillChecklist],
  );

  const handleSubmitFindingReportModal = useCallback(
    (id: string, params) => {
      const newState = fillChecklist.map((item) => {
        if (id === item?.id) {
          return {
            ...item,
            reportFindingItem: {
              ...item.reportFindingItem,
              ...params,
            },
          };
        }
        return item;
      });

      setFillChecklist(newState);
    },
    [fillChecklist],
  );

  const renderVesselInformation = useCallback(
    () => (
      <div className={cx(styles.contentChecklistWrapper)}>
        <div className={cx(styles.headerTitle)}>
          {renderDynamicLabel(
            dynamicLabels,
            DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Checklist information'][
              'Checklist information'
            ],
          )}
        </div>
        <Row className="pt-2 mx-0">
          <Col className={cx('p-0  pe-2  ')}>
            <div className={styles.textLabel}>
              {' '}
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS[
                  'Checklist information'
                ]['Checklist code'],
              )}
            </div>
            <div className={cx(styles.textContent, 'limit-line-text')}>
              {selectedItem?.auditChecklist?.code}
            </div>
          </Col>
          <Col className={cx('p-0  pe-2 ')}>
            <div className={styles.textLabel}>
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS[
                  'Checklist information'
                ]['Revision number'],
              )}
            </div>
            <div className={cx(styles.textContent, 'limit-line-text')}>
              {selectedItem?.auditChecklist?.revisionNumber}
            </div>
          </Col>
          <Col className={cx('p-0  pe-2 ')}>
            <div className={styles.textLabel}>
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS[
                  'Checklist information'
                ]['Revision date'],
              )}
            </div>
            <div className={cx(styles.textContent, 'limit-line-text')}>
              {(selectedItem?.auditChecklist?.revisionDate &&
                formatDateTimeDay(
                  selectedItem?.auditChecklist?.revisionDate,
                )) ||
                ''}
            </div>
          </Col>
          <Col className={cx('p-0  pe-2 ')}>
            <div className={styles.textLabel}>
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS[
                  'Checklist information'
                ]['Publish date'],
              )}
            </div>
            <div className={cx(styles.textContent, 'limit-line-text')}>
              {formatDateTimeDay(selectedItem?.auditChecklist?.publishedDate)}
            </div>
          </Col>
        </Row>
        <Row className="pt-2 mx-0">
          <Col className={cx('p-0  pe-2  ')}>
            <div className={styles.textLabel}>
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS[
                  'Checklist information'
                ]['Valid from'],
              )}
            </div>
            <div className={cx(styles.textContent, 'limit-line-text')}>
              {formatDateTimeDay(selectedItem?.auditChecklist?.validityFrom)}
            </div>
          </Col>
          <Col className={cx('p-0  pe-2 ')}>
            <div className={styles.textLabel}>
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS[
                  'Checklist information'
                ]['Valid to'],
              )}
            </div>
            <div className={cx(styles.textContent, 'limit-line-text')}>
              {formatDateTimeDay(selectedItem?.auditChecklist?.validityTo)}
            </div>
          </Col>
          <Col className={cx('p-0  pe-2 ')} />
          {/* <div className={styles.textLabel}>{t('vesselName')}</div>
            <div className={cx(styles.textContent, 'limit-line-text')}>
              {data?.vessel?.name}
            </div>
          </Col> */}
          <Col className={cx('p-0  pe-2 ')} />
          {/* <div className={styles.textLabel}>{t('vesselType')}</div>
            <div className={cx(styles.textContent, 'limit-line-text')}>
              {data?.vessel?.vesselType?.name}
            </div>
          </Col> */}
        </Row>
      </div>
    ),
    [
      dynamicLabels,
      selectedItem?.auditChecklist?.code,
      selectedItem?.auditChecklist?.publishedDate,
      selectedItem?.auditChecklist?.revisionDate,
      selectedItem?.auditChecklist?.revisionNumber,
      selectedItem?.auditChecklist?.validityFrom,
      selectedItem?.auditChecklist?.validityTo,
    ],
  );

  const scrollToView = (id: string) => {
    const el = document.querySelector(`.info_checklist #question_${id}`);

    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setFirstErrorId(id);
    }
  };

  const onSave = () => {
    const params = fillChecklist?.map((item) => {
      const {
        reportFindingItem,
        hasRemark,
        remarkSpecificAnswers,
        minPictureRequired,
        topicName,
        requireEvidencePicture,
        referenceData,
        ...other
      } = item;
      let newFinding = {};
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, value] of Object.entries(reportFindingItem)) {
        if (value !== undefined && key !== 'auditTypeId') {
          newFinding = { ...newFinding, [key]: value };
        }
        if (key === 'auditTypeId' && value) {
          newFinding = { ...newFinding, [key]: value };
        }
      }
      const reference = `${referenceData?.viq || 'N/A'}, ${
        referenceData?.cdi || 'N/A'
      }, ${referenceData?.charter_owner || 'N/A'} `;
      newFinding = { ...newFinding, reference };

      return {
        ...other,
        reportFindingItem: { ...newFinding },
      };
    });

    dispatch(
      updateAuditWorkspaceChecklistDetailActions.request({
        workspaceId: data?.id,
        fillChecklistId: selectedItem?.id,
        data: { fillQuestions: params, timezone: 'Asia/Ho_Chi_Minh' },
        afterSubmit: () => {
          toggle();
        },
      }),
    );
  };

  const onSubmit = (event) => {
    event.stopPropagation();
    setIsSubmit(true);
    const params = fillChecklist?.map((item) => {
      const {
        reportFindingItem,
        hasRemark,
        minPictureRequired,
        isMandatory,
        remarkSpecificAnswers,
        requireEvidencePicture,
        topicName,
        referenceFrom,
        ...other
      } = item;
      let newFinding = {};
      // eslint-disable-next-line no-restricted-syntax
      for (const [key, value] of Object.entries(reportFindingItem)) {
        if (value !== undefined) {
          newFinding = { ...newFinding, [key]: value };
        }
      }
      newFinding = { ...newFinding, reference: referenceFrom };
      return {
        ...other,
        reportFindingItem: { ...newFinding },
      };
    });

    // eslint-disable-next-line no-restricted-syntax
    for (const checklistItem of fillChecklist) {
      if (
        (!checklistItem.answers?.length && checklistItem?.isMandatory) ||
        checkRemark(checklistItem) ||
        checkRequireAttachment(checklistItem) ||
        checkRequireEvidence(checklistItem)
      ) {
        scrollToView(checklistItem?.id);
        return;
      }
    }

    dispatch(
      submitAuditWorkspaceChecklistDetailActions.request({
        workspaceId: data?.id,
        fillChecklistId: selectedItem?.id,
        data: { fillQuestions: params, timezone: 'Asia/Ho_Chi_Minh' },
        afterSubmit: () => {
          toggle();
        },
      }),
    );
  };

  const getPdfChecklist = () => {
    pdfFillChecklistActionsApi({
      workspaceId: selectedItem?.auditWorkspaceId,
      fillChecklistId: selectedItem?.id,
    })
      .then(async (res) => {
        await setExportLoading(true);
        await handleAndDownloadFilePdf(res.data, 'Checklist Information');
        setExportLoading(false);
      })
      .catch((e) => {
        toastError(e);
        setExportLoading(false);
      });
  };

  const renderTab = useMemo(
    () =>
      fillQuestionDetail?.length ? (
        <div className={cx(styles.contentChecklistWrapper, 'p-0 pt-2')}>
          <Tabs
            activeKey={activeTab}
            tabBarStyle={{
              margin: '0 20px',
              borderBottom: '1px solid #D2D1D4',
            }}
            onChange={setActiveTab}
          >
            {fillQuestionDetail?.map((topicItem) => (
              <Tabs.TabPane
                tab={
                  <div
                    className={cx(styles.tabTitle, {
                      [styles.errorTab]: errorTabs?.includes(topicItem?.topic),
                      [styles.activeTab]: activeTab === topicItem?.topic,
                    })}
                    style={{
                      color: errorTabs.find((i) => i === topicItem?.topic)
                        ? '#f42829'
                        : '#8e8c94',
                    }}
                  >
                    {topicItem?.topic}
                  </div>
                }
                className={cx('px-3 py-2')}
                key={topicItem?.topic}
              >
                {topicItem?.questions?.length &&
                  topicItem?.questions?.map((questionItem, index) => {
                    const fillQuestionData = fillChecklist.find(
                      (item) => item?.id === questionItem?.id,
                    );
                    return (
                      <QuestionForm
                        onChangeAnswer={handleChangeAnswer}
                        onChangeFindingReport={handleChangeFindingReport}
                        data={questionItem}
                        questionIndex={index + 1}
                        dynamicLabels={dynamicLabels}
                        disabled={
                          (selectedItem &&
                            selectedItem?.status ===
                              FillAuditChecklistStatus.COMPLETED) ||
                          disabled
                        }
                        isSubmit={isSubmit}
                        question={fillQuestionData}
                        onSubmitModal={handleSubmitFindingReportModal}
                        key={fillQuestionData?.id}
                        isFocus={fillQuestionData?.id === firstErrorId}
                      />
                    );
                  })}
              </Tabs.TabPane>
            ))}
          </Tabs>
        </div>
      ) : null,
    [
      fillQuestionDetail,
      activeTab,
      errorTabs,
      fillChecklist,
      handleChangeAnswer,
      handleChangeFindingReport,
      dynamicLabels,
      selectedItem,
      disabled,
      isSubmit,
      handleSubmitFindingReportModal,
      firstErrorId,
    ],
  );

  if (loading) {
    return (
      <div className={styles.loadingWrapper}>
        <img
          src={images.common.loading}
          className={cx(styles.loading)}
          alt="loading"
        />
      </div>
    );
  }

  return (
    <div
      onClick={() => {
        setFirstErrorId(undefined);
      }}
      className={cx(styles.checklistContainer, 'info_checklist')}
    >
      <div className="d-flex justify-content-between">
        <Button
          className={styles.buttonBack}
          onClick={() => {
            toggle();
            setErrorTabs([]);
            if (fillQuestionDetail?.length) {
              setActiveTab(fillQuestionDetail[0]?.topic);
            } else {
              setActiveTab(undefined);
            }
            setIsSubmit(false);
          }}
          buttonType={ButtonType.CancelOutline}
        >
          <ArrowLeftOutlined />{' '}
          <span className="ps-2">
            {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Back)}
          </span>
        </Button>
        <PermissionCheck
          options={{
            feature: Features.AUDIT_INSPECTION,
            subFeature: SubFeatures.AUDIT_INSPECTION_WORKSPACE,
            action: ActionTypeEnum.EXPORT,
          }}
        >
          {({ hasPermission }) =>
            hasPermission && (
              <Button className={styles.buttonExport} onClick={getPdfChecklist}>
                <span className="pe-2">
                  {renderDynamicLabel(
                    dynamicLabels,
                    COMMON_DYNAMIC_FIELDS.Export,
                  )}
                </span>
                {loadingExport ? <LoadingOutlined /> : <DownloadOutlined />}
              </Button>
            )
          }
        </PermissionCheck>
      </div>
      {renderVesselInformation()}

      {/* tab topic question */}
      {renderTab}
      {selectedItem &&
        !disabled &&
        selectedItem?.status !== FillAuditChecklistStatus.COMPLETED && (
          <div className={cx('d-flex justify-content-end py-4')}>
            <Button
              onClick={() => {
                toggle();
                setErrorTabs([]);
                if (fillQuestionDetail?.length) {
                  setActiveTab(fillQuestionDetail[0]?.topic);
                } else {
                  setActiveTab(undefined);
                }
                setIsSubmit(false);
              }}
              buttonType={ButtonType.CancelOutline}
              className={cx(styles.btnFooter, styles.btnCancel)}
            >
              {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Cancel)}
            </Button>
            <Button
              onClick={onSave}
              className={cx(styles.btnFooter, styles.btnSave)}
            >
              {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Save)}
            </Button>
            <Button
              onClick={onSubmit}
              className={cx(styles.btnFooter, styles.btnSubmit)}
            >
              {renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS.Complete,
              )}
            </Button>
          </div>
        )}
    </div>
  );
};

export default ChecklistForm;
