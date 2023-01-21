import {
  forwardRef,
  useState,
  useImperativeHandle,
  createRef,
  useContext,
  useEffect,
} from 'react';
import { InternalAuditReportFormContext } from 'contexts/internal-audit-report/IARFormContext';
import { useSelector } from 'react-redux';
import { useForm, FieldValues } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { GroupButton } from 'components/ui/button/GroupButton';
import { v4 } from 'uuid';
import Modal, { ModalType } from 'components/ui/modal/Modal';
import Input from 'components/ui/input/Input';
import * as Yup from 'yup';
import styles from 'components/internal-audit-report/forms/form.module.scss';
import 'components/internal-audit-report/forms/form.scss';
import { useLocation } from 'react-router-dom';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { CommonQuery } from 'constants/common.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { INSPECTION_REPORT_FIELDS_DETAILS } from 'constants/dynamic/inspection-report.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';

export enum DescriptionModalType {
  SMS = 'sms',
  HULL_AND_DECK = 'hullAndDeck',
  NAVIGATION = 'navigation',
}

interface DescriptionModalData {
  headerId: string;
  isNew: boolean;
  isChild: boolean;
  parentId: string;
  id?: string;
}

const DescriptionModalComponent = forwardRef((_, ref) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [id, setId] = useState<string>('');
  const [isNew, setIsNew] = useState<boolean>(true);
  const [isChild, setIsChild] = useState<boolean>(false);
  const [headerId, setHeaderId] = useState<string>('');
  const [parentId, setParentId] = useState<string>('');
  const [minScore, setMinScore] = useState<number>(null);
  const [maxScore, setMaxScore] = useState<number>(null);

  const { search } = useLocation();
  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.AuditInspectionInspectionReport,
    modulePage: search === CommonQuery.EDIT ? ModulePage.Edit : ModulePage.View,
  });

  const {
    IARRpHeaderDescription,
    IARRpSubHeaderDescription,
    updateRpHeaders,
    handleSetUpdateRpHeader,
    handleChangeRpHeaderDescription,
    handleAddRpHeaderDescription,
    setTouched,
  } = useContext(InternalAuditReportFormContext);
  const { internalAuditReportDetail } = useSelector(
    (store) => store.internalAuditReport,
  );

  const schema = Yup.object().shape({
    topic: Yup.string(),
    score: Yup.number()
      .max(30)
      .transform((v) => (v === '' || Number.isNaN(v) ? null : v))
      .nullable(true),
    description: Yup.string(),
  });

  const schema2 = Yup.object().shape({
    topic: Yup.string(),
    score: Yup.number()
      .min(minScore)
      .max(maxScore)
      .transform((v) => (v === '' || Number.isNaN(v) ? null : v))
      .nullable(true)
      .notOneOf(
        [null],
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    description: Yup.string(),
  });

  const defaultValues = {
    topic: '',
    score: null,
    description: '',
  };

  const {
    register,
    setValue,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onSubmit',
    defaultValues,
    resolver: minScore && maxScore ? yupResolver(schema2) : yupResolver(schema),
  });

  useEffect(() => {
    if (!isNew) {
      if (isChild) {
        const subHeader = IARRpSubHeaderDescription.find((i) => i.id === id);

        setValue('topic', subHeader?.topic);
        setValue('score', subHeader?.score);
        setValue('description', subHeader?.description);
        setMinScore(subHeader?.minScore || null);
        setMaxScore(subHeader?.maxScore || null);
      } else {
        const header = IARRpHeaderDescription.find(
          (i) => i.headerId === headerId,
        );
        setValue('topic', header?.topic);
        setValue('score', header?.score);
        setValue('description', header?.description);
        setMinScore(header?.minScore || null);
        setMaxScore(header?.maxScore || null);
      }
    } else if (isNew) {
      const header = internalAuditReportDetail?.IARReportHeaders?.find(
        (i) => i.reportHeaderId === headerId,
      );
      setMinScore(header?.minScore || null);
      setMaxScore(header?.maxScore || null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    isNew,
    IARRpSubHeaderDescription,
    headerId,
    IARRpHeaderDescription,
    id,
    internalAuditReportDetail,
  ]);

  const toggle = () => {
    setVisible((prev) => !prev);
    setId('');
    setIsNew(true);
    setIsChild(false);
    setHeaderId('');
    setMinScore(null);
    setMaxScore(null);
    reset();
  };

  const close = () => {
    toggle();
  };

  const onSubmitForm = (dataForm) => {
    const newId = v4();
    setTouched(true);

    if (isNew) {
      if (isChild) {
        handleAddRpHeaderDescription({
          id: newId,
          headerId,
          parentId,
          topic: dataForm.topic,
          score: dataForm.score,
          description: dataForm.description,
          minScore,
          maxScore,
          isNew,
        });
        const newUpdateHeader = [...updateRpHeaders];
        const headerIndex = newUpdateHeader.findIndex((i) => i.id === id);
        if (headerIndex > -1) {
          newUpdateHeader[headerIndex]?.IARReportHeaderDescriptions?.push({
            id: undefined,
            topic: dataForm.topic,
            score: dataForm.score,
            description: dataForm.description,
          });
          handleSetUpdateRpHeader(newUpdateHeader);
        }
      } else {
        handleAddRpHeaderDescription({
          id: newId,
          headerId,
          parentId: null,
          topic: dataForm.topic,
          score: dataForm.score,
          description: dataForm.description,
          minScore,
          maxScore,
          isNew,
        });
        const newUpdateHeader = [...updateRpHeaders];
        const headerIndex = newUpdateHeader.findIndex((i) => i.id === id);
        if (headerIndex > -1) {
          newUpdateHeader[headerIndex]?.IARReportHeaderDescriptions?.push({
            id: newId,
            topic: dataForm.topic,
            score: dataForm.score,
            description: dataForm.description,
          });
          handleSetUpdateRpHeader(newUpdateHeader);
        }
      }
    } else if (!isNew) {
      if (isChild) {
        handleChangeRpHeaderDescription(
          id,
          dataForm.topic,
          dataForm.score,
          dataForm.description,
          true,
        );
        const newUpdateHeader = [...updateRpHeaders];
        const headerIndex = newUpdateHeader.findIndex((i) => i.id === headerId);
        if (headerIndex > -1) {
          newUpdateHeader[headerIndex]?.IARReportHeaderDescriptions?.filter(
            (i) => i.id !== id,
          )?.push({
            id,
            topic: dataForm.topic,
            score: dataForm.score,
            description: dataForm.description,
          });
          handleSetUpdateRpHeader(newUpdateHeader);
        }
      } else {
        handleChangeRpHeaderDescription(
          id,
          dataForm.topic,
          dataForm.score,
          dataForm.description,
          false,
        );
        const newUpdateHeader = [...updateRpHeaders];
        const headerIndex = newUpdateHeader.findIndex((i) => i.id === headerId);
        if (headerIndex > -1) {
          newUpdateHeader[headerIndex]?.IARReportHeaderDescriptions?.filter(
            (i) => i.id !== id,
          )?.push({
            id,
            topic: dataForm.topic,
            score: dataForm.score,
            description: dataForm.description,
          });
          handleSetUpdateRpHeader(newUpdateHeader);
        }
      }
    }
    close();
  };

  useImperativeHandle(ref, () => ({
    showDescriptionModal: (data: DescriptionModalData) => {
      setVisible(true);
      setId(data.id);
      setIsNew(data.isNew);
      setIsChild(data.isChild);
      setHeaderId(data.headerId);
      setParentId(data.parentId);
    },
  }));

  return (
    <Modal
      isOpen={visible}
      modalType={ModalType.CENTER}
      title={
        isNew
          ? renderDynamicLabel(
              dynamicLabels,
              INSPECTION_REPORT_FIELDS_DETAILS['Add description'],
            )
          : renderDynamicLabel(
              dynamicLabels,
              INSPECTION_REPORT_FIELDS_DETAILS['Change description'],
            )
      }
      toggle={close}
      content={
        <div className={styles.descriptionWrapper}>
          <Input
            {...register('topic')}
            placeholder={renderDynamicLabel(
              dynamicLabels,
              INSPECTION_REPORT_FIELDS_DETAILS['Enter topic'],
            )}
            label={renderDynamicLabel(
              dynamicLabels,
              INSPECTION_REPORT_FIELDS_DETAILS.Topic,
            )}
          />
          <Input
            {...register('score')}
            label={renderDynamicLabel(
              dynamicLabels,
              INSPECTION_REPORT_FIELDS_DETAILS.Score,
            )}
            placeholder={renderDynamicLabel(
              dynamicLabels,
              INSPECTION_REPORT_FIELDS_DETAILS['Enter score'],
            )}
            type="number"
            messageRequired={errors?.score?.message || ''}
            isRequired={!!minScore && !!maxScore}
          />
          <Input
            {...register('description')}
            placeholder={renderDynamicLabel(
              dynamicLabels,
              INSPECTION_REPORT_FIELDS_DETAILS['Enter description'],
            )}
            label={renderDynamicLabel(
              dynamicLabels,
              INSPECTION_REPORT_FIELDS_DETAILS.Description,
            )}
          />
        </div>
      }
      footer={
        <GroupButton
          className={styles.modalGroupBtns}
          handleCancel={close}
          handleSubmit={handleSubmit(onSubmitForm)}
          txButtonBetween={renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS.Confirm,
          )}
          handleSubmitAndNew={undefined}
          dynamicLabels={dynamicLabels}
          disable={false}
        />
      }
    />
  );
});

type ModalRef = {
  showDescriptionModal: (data: DescriptionModalData) => void;
};
const modalRef = createRef<ModalRef>();
export const DescriptionModal = () => (
  <DescriptionModalComponent ref={modalRef} />
);
export const showDescriptionModal = (data: DescriptionModalData) => {
  modalRef.current?.showDescriptionModal(data);
};
