import {
  ExclamationCircleFilled,
  FileOutlined,
  LoadingOutlined,
  PaperClipOutlined,
} from '@ant-design/icons';
import Col from 'antd/lib/col';
import { useLocation, useParams } from 'react-router-dom';
import Row from 'antd/lib/row';
import Tooltip from 'antd/lib/tooltip';
import { uploadFileApi } from 'api/audit-inspection-workspace.api';
import images from 'assets/images/images';
import cx from 'classnames';
import Button from 'components/ui/button/Button';
import Radio from 'components/ui/radio/Radio';
import SelectUI from 'components/ui/select/Select';
import {
  FilePrefix,
  CommonQuery,
  FileType,
  QuestionOptionsType,
} from 'constants/common.const';
import { toastError } from 'helpers/notification.helper';
import { formatDateTime } from 'helpers/utils.helper';
import lowerCase from 'lodash/lowerCase';
import {
  FillQuestionExtend,
  QuestionChecklist,
} from 'models/api/audit-inspection-workspace/audit-inspection-workspace.model';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import { DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS } from 'constants/dynamic/inspection-workspace.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { clearDMSReducer, getListFileActions } from 'store/dms/dms.action';
import {
  checkFinding,
  checkRequireAttachment,
  checkRequireEvidence,
  isRemark,
} from '../../checkQuestion.helper';
import ModalAttachment from '../modal/ModalAttachment';
import ModalFile from '../modal/ModalEvidence';
import ModalImage from '../modal/ModalImage';
import ModalReferencesAndCategories from '../modal/ModalReferencesAndCategories';
import ModalReportOfFinding from '../modal/ModalReportOfFinding';
import TextAreaQuestion from '../text-area/TextAreaQuestion';
import styles from './question-form.module.scss';

export interface SubmitParams {
  natureFindingId: string;
  auditTypeId: string;
  isSignificant: boolean;
  mainCategoryId: string;
  secondCategoryId: string;
  thirdCategoryId: string;
}
interface CProps {
  question: FillQuestionExtend;
  data: QuestionChecklist;
  isSubmit: boolean;
  disabled?: boolean;
  questionIndex: number;
  onChangeAnswer: (
    id: string,
    fieldName: string,
    params: string | string[],
  ) => void;
  onChangeFindingReport: (
    id: string,
    fieldName: string,
    values: string,
  ) => void;
  onSubmitModal: (id: string, params: SubmitParams) => void;
  isFocus: boolean;
  dynamicLabels?: IDynamicLabel;
}
enum AnswerTypeYesNoNa {
  YES = 'yes',
  NO = 'no',
  NA = 'na',
}

const QuestionForm: FC<CProps> = ({
  question,
  data,
  onChangeFindingReport,
  onSubmitModal,
  onChangeAnswer,
  disabled = false,
  questionIndex,
  isSubmit,
  isFocus,
  dynamicLabels,
}) => {
  const [answer, setAnswer] = useState<string[]>(question?.answers);
  const [loadingAttachment, setLoadingAttachment] = useState<boolean>(false);
  const [loadingEvidence, setLoadingEvidence] = useState<boolean>(false);
  const [isFirstCheckRemark, setIsFirstCheckRemark] = useState<boolean>(true);
  const [openReferencesAndCategories, setOpenReferencesAndCategories] =
    useState(false);
  const [openModalAttachment, setOpenModalAttachment] = useState(false);
  const [modalRofVisible, setModalRofVisible] = useState<boolean>(false);
  const [modalAttachment, setModalAttachment] = useState(false);
  const [modalEvidence, setModalEvidence] = useState(false);

  const uploadAttachment = useRef(null);
  const uploadEvidence = useRef(null);
  const dispatch = useDispatch();
  const { id } = useParams<{ id: string }>();
  const { search } = useLocation();

  useEffect(() => {
    if (question) {
      onChangeAnswer(question?.id, 'answers', answer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [answer, question?.id]);

  useEffect(() => {
    if (question && question?.answers) {
      setAnswer(question?.answers);
    }
  }, [question]);

  // useEffect(() => {
  //   if (data) {
  //     getQuestionReferencesDetailApi({
  //       idAuditChecklist: data?.chkQuestion?.auditChecklistId,
  //       idQuestion: data?.chkQuestion?.id,
  //     }).then((res: any) => {
  //       setDataReferences(res?.data);
  //     });
  //   }
  // }, [data]);

  useEffect(() => {
    if (openModalAttachment && data?.chkQuestion?.attachments?.length > 0) {
      dispatch(
        getListFileActions.request({
          ids: data?.chkQuestion?.attachments || [],
        }),
      );
    } else {
      dispatch(clearDMSReducer());
    }
  }, [data?.chkQuestion?.attachments, dispatch, openModalAttachment]);

  const onChangeEvidencePictures = (event) => {
    const { files } = event.target;
    const newFiles: any[] = [];

    Object.keys(files).forEach((key) => {
      newFiles.push(files[key]);
    });
    const formDataImages = new FormData();
    newFiles.forEach((item) => {
      formDataImages.append('files', item);
    });

    formDataImages.append('fileType', FileType.ATTACHMENT);
    formDataImages.append('prefix', FilePrefix.ATTACHMENT);
    const sizeImage = files[0]?.size;

    if (sizeImage < 5242881) {
      uploadFileApi(formDataImages)
        .then((res) => {
          const fileLists = res.data.map((item) => item?.id);
          onChangeAnswer(data?.id, 'evidencePictures', [
            ...question.evidencePictures,
            ...fileLists,
          ]);
          setLoadingEvidence(false);
        })
        .catch((e) => {
          toastError(e.message);
          setLoadingEvidence(false);
        });
      uploadEvidence.current.value = null;
    } else {
      setLoadingEvidence(false);
      toastError(
        `This specified file ${files[0]?.name} could not be uploaded. The file is exceeding the maximum file size of 5 MB`,
      );
      return null;
    }
    return null;
  };

  const onChangeAttachment = (event) => {
    const { files } = event.target;
    const typeImage = ['png', 'jpg', 'jpeg'];
    const newFiles: any[] = [];
    Object.keys(files).forEach((key) => {
      const fileName = files[key]?.name?.split('.');
      const lengthFileName = fileName?.length || 0;
      const textImage = lengthFileName > 0 ? fileName[lengthFileName - 1] : '';
      const isImage = typeImage.some(
        (image) => image === textImage.toLowerCase(),
      );
      if (isImage) {
        newFiles.push(files[key]);
      }
    });
    const formDataImages = new FormData();
    newFiles.forEach((item) => {
      formDataImages.append('files', item);
    });
    const sizeImage = files[0]?.size;

    formDataImages.append('fileType', FileType.ATTACHMENT);
    formDataImages.append('prefix', FilePrefix.ATTACHMENT);
    if (sizeImage < 5242881) {
      uploadFileApi(formDataImages)
        .then((res) => {
          const newImages = res.data.map((item) => item?.id);
          onChangeAnswer(data?.id, 'attachments', [
            ...question.attachments,
            ...newImages,
          ]);
          setLoadingAttachment(false);
        })
        .catch((e) => {
          setLoadingAttachment(false);
          toastError(e.message);
        });
    } else {
      setLoadingAttachment(false);
      toastError(
        `This specified file ${files[0]?.name} could not be uploaded. The file is exceeding the maximum file size of 5 MB`,
      );
      return null;
    }

    uploadAttachment.current.value = null;
    return null;
  };

  // const isErrorRemark = useMemo(() => checkRemark(question), [question]);
  const isErrorFinding = useMemo(() => checkFinding(question), [question]);

  const isErrorAttachment = useMemo(
    () => checkRequireAttachment(question),
    [question],
  );

  const isErrorEvidence = useMemo(
    () => checkRequireEvidence(question),
    [question],
  );

  const isRemarkRequired = useMemo(() => isRemark(question), [question]);

  useEffect(() => {
    if (isSubmit && isRemarkRequired) {
      setIsFirstCheckRemark(false);
    }
  }, [isSubmit, isRemarkRequired]);

  const formatQuestion = useMemo(() => {
    if (data?.chkQuestion?.type === QuestionOptionsType.YES_NO) {
      const yesQuestion = data?.chkQuestion?.answerOptions?.find(
        (item) => lowerCase(item.content) === AnswerTypeYesNoNa.YES,
      );
      const noQuestion = data?.chkQuestion?.answerOptions?.find(
        (item) => lowerCase(item.content) === 'no',
      );
      return [yesQuestion, noQuestion];
    }
    if (data?.chkQuestion?.type === QuestionOptionsType.YES_NO_NA) {
      const yesQuestion = data?.chkQuestion?.answerOptions?.find(
        (item) => lowerCase(item.content) === AnswerTypeYesNoNa.YES,
      );
      const noQuestion = data?.chkQuestion?.answerOptions?.find(
        (item) => lowerCase(item.content) === 'no',
      );
      const NAQuestion = data?.chkQuestion?.answerOptions?.find(
        (item) => lowerCase(item.content) === 'na',
      );
      return [yesQuestion, noQuestion, { id: NAQuestion?.id, content: 'N/A' }];
    }
    return data?.chkQuestion?.answerOptions;
  }, [data]);

  return (
    <div id={`question_${question?.id}`}>
      <div className={cx(styles.questionWrapper, '')}>
        <div className="ps-2">
          <div className={cx(styles.questions, 'd-flex')}>
            <div className={cx(' text-nowrap ', styles.questionBold)}>
              {renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS[
                  'Checklist information'
                ].Question,
              )}{' '}
              {questionIndex}
              {question?.isMandatory && (
                <img
                  className={cx(styles.requiredImg, 'ms-0')}
                  src={images.icons.icRequiredAsterisk}
                  alt="required"
                />
              )}
              :
            </div>
            <div className="ps-1"> {data.chkQuestion.question}</div>
          </div>
          <div className={cx(styles.codeWrapper, 'd-flex align-items-center')}>
            <div className={cx(styles.code)}>
              <span className={cx(styles.codeValue)}>
                {data.chkQuestion.companyMixCode}
              </span>
            </div>
            <div className={cx(styles.stick, 'mx-2')} />
            <div className={cx(styles.code)}>
              <span className={cx(styles.codeValue)}>
                {data.chkQuestion.vesselTypeMixCode}
              </span>
            </div>
          </div>
          {data?.chkQuestion?.hint && (
            <div className={cx(styles.hint, 'd-flex')}>
              <div className={cx(styles.icon, 'pe-0')}>
                <ExclamationCircleFilled className={cx(styles.icHint)} />
              </div>
              <div className={cx(styles.contentHint, 'ps-0')}>
                {data?.chkQuestion?.hint}
              </div>
            </div>
          )}
          <div>
            {data?.chkQuestion?.type === QuestionOptionsType.COMBO ? (
              <div className={cx(styles.inputSelect)}>
                <SelectUI
                  data={formatQuestion?.map((item) => ({
                    value: item?.id,
                    label: item.content,
                  }))}
                  value={question?.answers[0]}
                  disabled={disabled}
                  placeholder={renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS[
                      'Checklist information'
                    ]['Choose your answer'],
                  )}
                  className={cx('w-100')}
                  onChange={(value) => setAnswer([String(value)])}
                />
              </div>
            ) : (
              formatQuestion &&
              formatQuestion?.map((answerItem) => (
                <Col key={answerItem.id} xs={24}>
                  <Radio
                    tooltip
                    label={answerItem.content}
                    key={answerItem.content}
                    disabled={disabled}
                    onChange={(e) => {
                      const { checked } = e.target;
                      if (checked) {
                        setAnswer([String(answerItem?.id)]);
                      }
                    }}
                    className={styles.radio}
                    name={data?.id}
                    checked={answer?.includes(answerItem?.id)}
                  />
                </Col>
              ))
            )}
            {!answer?.length && question?.isMandatory && isSubmit && (
              <div className={cx(styles.errorMessage)}>
                {renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['This field is required'],
                )}
              </div>
            )}
            <Row className="pb-3">
              <Col span={12} className={styles.pr10}>
                <div className={cx(styles.questions, styles.questionBold)}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS[
                      'Checklist information'
                    ]['Findings/Remarks'],
                  )}
                  {isRemarkRequired && !disabled && (
                    <img
                      className={cx(styles.requiredImg)}
                      src={images.icons.icRequiredAsterisk}
                      alt="required"
                    />
                  )}
                </div>
                <TextAreaQuestion
                  autoFocus={isFocus}
                  placeholder={renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS[
                      'Checklist information'
                    ]['Enter findings/remarks'],
                  )}
                  disabled={disabled}
                  maxLength={500}
                  name={question?.id}
                  id="input_remark"
                  autoSize={{ minRows: 2 }}
                  value={question?.findingRemark || ''}
                  onChange={(event) => {
                    onChangeFindingReport(
                      question?.id,
                      'findingRemark',
                      event.target.value,
                    );
                  }}
                />
                {!question?.findingRemark &&
                  !isFirstCheckRemark &&
                  isRemarkRequired && (
                    <div className={cx(styles.errorMessage)}>
                      {renderDynamicLabel(
                        dynamicLabels,
                        COMMON_DYNAMIC_FIELDS['This field is required'],
                      )}
                    </div>
                  )}
              </Col>
              <Col span={12} className={styles.pl10}>
                <div className={cx(styles.questions, styles.questionBold)}>
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS[
                      'Checklist information'
                    ].Memo,
                  )}
                </div>
                <TextAreaQuestion
                  placeholder={renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS[
                      'Checklist information'
                    ]['Enter memo'],
                  )}
                  disabled={disabled}
                  maxLength={500}
                  name={question?.id}
                  id="input_memo"
                  autoSize={{ minRows: 2 }}
                  value={question?.memo || ''}
                  onChange={(event) => {
                    onChangeFindingReport(
                      question?.id,
                      'memo',
                      event.target.value,
                    );
                  }}
                />
              </Col>
            </Row>
          </div>

          <div className="d-flex  justify-content-between ">
            <div className={cx('d-flex flex-wrap', styles.btnWrapper)}>
              <label htmlFor="file-input">
                <input
                  type="file"
                  multiple
                  ref={uploadAttachment}
                  accept="image/*"
                  className={styles.inputFile}
                  onChange={(e) => {
                    setLoadingAttachment(true);
                    onChangeAttachment(e);
                  }}
                />
              </label>
              {!disabled && (
                <div className="">
                  <Button
                    className={cx(
                      styles.btn,
                      {
                        [styles.btnErrors]: isErrorAttachment && !disabled,
                      },
                      'me-3 mt-3',
                    )}
                    onClick={() => uploadAttachment.current.click()}
                    renderPrefix={
                      !loadingAttachment ? (
                        <PaperClipOutlined
                          style={{ position: 'relative', top: -3, left: -6 }}
                          className={cx(styles.iconBtn)}
                        />
                      ) : (
                        <LoadingOutlined
                          style={{
                            position: 'relative',
                            top: -3,
                            left: -6,
                            color: '#fff',
                          }}
                          className={cx(styles.iconBtn)}
                        />
                      )
                    }
                  >
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS[
                        'Checklist information'
                      ]['Attach image'],
                    )}
                    {!!question?.minPictureRequired && !disabled && (
                      <span className={cx(styles.requiredWhite)}>*</span>
                    )}
                    {!!question?.minPictureRequired && (
                      <span>
                        ({question?.attachments?.length}/
                        {question?.minPictureRequired})
                      </span>
                    )}
                  </Button>
                  {isErrorAttachment && isSubmit && (
                    <div className={cx(styles.errorMessage)}>
                      {renderDynamicLabel(
                        dynamicLabels,
                        COMMON_DYNAMIC_FIELDS['This field is required'],
                      )}
                    </div>
                  )}
                </div>
              )}

              <Button
                className={cx(styles.btn, 'me-3 mt-3')}
                disabled={!question?.attachments?.length}
                onClick={() => setModalAttachment(true)}
                renderPrefix={
                  <img src={images.icons.icPhotoWhite} alt="icPhotoAlbum" />
                }
              >
                {renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS[
                    'Checklist information'
                  ]['View image'],
                )}{' '}
                {question?.attachments?.length
                  ? `(${question?.attachments?.length})`
                  : ''}
              </Button>
              <div className="">
                <Button
                  className={cx(
                    styles.btn,
                    {
                      [styles.btnErrors]:
                        isErrorFinding && isRemarkRequired && !disabled,
                    },
                    'me-3 mt-3',
                  )}
                  onClick={() => {
                    if ((id && search !== CommonQuery.EDIT) || disabled) {
                      setModalRofVisible(true);
                    } else {
                      if (question?.findingRemark || !isRemarkRequired) {
                        setModalRofVisible(true);
                      }
                      if (isRemarkRequired) {
                        setIsFirstCheckRemark(false);
                      }
                    }
                  }}
                >
                  {renderDynamicLabel(
                    dynamicLabels,
                    DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS[
                      'Checklist information'
                    ]['Report of finding'],
                  )}
                  {isRemarkRequired && !disabled && (
                    <span className={cx(styles.requiredWhite)}>*</span>
                  )}
                </Button>
                {isErrorFinding && isRemarkRequired && isSubmit && (
                  <div className={cx(styles.errorMessage)}>
                    {renderDynamicLabel(
                      dynamicLabels,
                      COMMON_DYNAMIC_FIELDS['This field is required'],
                    )}
                  </div>
                )}
              </div>

              <label htmlFor="file-input">
                <input
                  type="file"
                  multiple
                  ref={uploadEvidence}
                  className={styles.inputFile}
                  onChange={(e) => {
                    setLoadingEvidence(true);
                    onChangeEvidencePictures(e);
                  }}
                />
              </label>

              {!disabled && (
                <div className="">
                  <Button
                    onClick={() => uploadEvidence.current.click()}
                    className={cx(
                      styles.btn,
                      {
                        [styles.btnErrors]:
                          !question?.evidencePictures?.length &&
                          isErrorEvidence &&
                          !disabled,
                      },
                      'me-3 mt-3',
                    )}
                    renderPrefix={
                      loadingEvidence && (
                        <LoadingOutlined
                          style={{
                            position: 'relative',
                            top: -3,
                            left: -6,
                            color: '#fff',
                          }}
                          className={cx(styles.iconBtn)}
                        />
                      )
                    }
                  >
                    {renderDynamicLabel(
                      dynamicLabels,
                      DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS[
                        'Checklist information'
                      ]['Add evidence'],
                    )}
                    {question?.requireEvidencePicture && !disabled && (
                      <span className={cx(styles.requiredWhite)}>*</span>
                    )}
                  </Button>
                  {!question?.evidencePictures?.length &&
                    isErrorEvidence &&
                    isSubmit && (
                      <div className={cx(styles.errorMessage)}>
                        {renderDynamicLabel(
                          dynamicLabels,
                          COMMON_DYNAMIC_FIELDS['This field is required'],
                        )}
                      </div>
                    )}
                </div>
              )}
              <Button
                className={cx(styles.btnEvidence, 'me-3 mt-3')}
                disabled={!question?.evidencePictures?.length}
                onClick={() => setModalEvidence(true)}
                renderPrefix={
                  <FileOutlined
                    style={{ position: 'relative', top: -3, left: -6 }}
                    className={cx(styles.iconBtn)}
                  />
                }
              >
                {renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS[
                    'Checklist information'
                  ]['View evidence'],
                )}{' '}
                {question?.evidencePictures?.length
                  ? `(${question?.evidencePictures?.length})`
                  : ''}
              </Button>
            </div>
            <div className="d-flex justify-content-end pt-3">
              <Tooltip
                placement="topRight"
                title={renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS[
                    'Checklist information'
                  ].Attachment,
                )}
                trigger="hover"
                color="#3B9FF3"
              >
                <div
                  className={cx('d-flex mt-2', styles.infoCategory)}
                  onClick={() => setOpenModalAttachment(true)}
                >
                  <img src={images.icons.icFolder} alt="icInfoCircle" />
                </div>
              </Tooltip>
              <Tooltip
                placement="topRight"
                title={renderDynamicLabel(
                  dynamicLabels,
                  DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS[
                    'Checklist information'
                  ]['Category mapping'],
                )}
                trigger="hover"
                color="#3B9FF3"
              >
                <div
                  className={cx('d-flex mt-2 ms-3', styles.infoCategory)}
                  onClick={() => setOpenReferencesAndCategories(true)}
                >
                  <img src={images.icons.icInfoCircle} alt="icInfoCircle" />
                </div>
              </Tooltip>
            </div>
          </div>
          {data?.updatedUser?.username && data?.updatedAt && (
            <div className={styles.updateByText}>
              {`${renderDynamicLabel(
                dynamicLabels,
                DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS[
                  'Checklist information'
                ]['Update by'],
              )} ${data?.updatedUser?.username} at ${formatDateTime(
                data?.updatedAt,
              )}`}
            </div>
          )}
        </div>
        <ModalAttachment
          isOpen={openModalAttachment}
          data={data?.chkQuestion?.attachments}
          dynamicLabels={dynamicLabels}
          title={renderDynamicLabel(
            dynamicLabels,
            DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Checklist information']
              .Attachment,
          )}
          toggle={() => {
            setOpenModalAttachment(false);
          }}
        />
        <ModalReportOfFinding
          isOpen={modalRofVisible}
          isRemarkRequired={isRemarkRequired}
          data={question}
          disabled={disabled}
          required={isRemarkRequired && !disabled}
          dynamicLabels={dynamicLabels}
          onSubmitModal={onSubmitModal}
          dataChecklist={data}
          title={renderDynamicLabel(
            dynamicLabels,
            DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Checklist information'][
              'Report of finding'
            ],
          )}
          toggle={() => {
            setModalRofVisible(false);
          }}
        />
        <ModalImage
          isOpen={modalAttachment}
          imageIds={question?.attachments}
          title={renderDynamicLabel(
            dynamicLabels,
            DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Checklist information']
              .Attachment,
          )}
          disabled={disabled}
          id={data?.id}
          onChangeAnswer={onChangeAnswer}
          toggle={() => {
            setModalAttachment(false);
          }}
        />
        <ModalFile
          disabled={disabled}
          isOpen={modalEvidence}
          onChangeAnswer={onChangeAnswer}
          fileIds={question?.evidencePictures}
          dynamicLabels={dynamicLabels}
          title={renderDynamicLabel(
            dynamicLabels,
            DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Checklist information']
              .Evidence,
          )}
          id={data?.id}
          toggle={() => {
            setModalEvidence(false);
          }}
        />

        <ModalReferencesAndCategories
          isOpen={openReferencesAndCategories}
          data={data}
          title={renderDynamicLabel(
            dynamicLabels,
            DETAIL_INSPECTION_WORKSPACE_DYNAMIC_FIELDS['Checklist information'][
              'References and Categories'
            ],
          )}
          toggle={() => {
            setOpenReferencesAndCategories(false);
          }}
          key={question?.id}
        />
      </div>
    </div>
  );
};

export default QuestionForm;
