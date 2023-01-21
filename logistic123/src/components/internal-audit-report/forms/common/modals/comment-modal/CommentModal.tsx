import {
  forwardRef,
  useState,
  useImperativeHandle,
  createRef,
  useContext,
} from 'react';
import { useForm, FieldValues } from 'react-hook-form';

import { yupResolver } from '@hookform/resolvers/yup';
import { GroupButton } from 'components/ui/button/GroupButton';
import { InternalAuditReportFormContext } from 'contexts/internal-audit-report/IARFormContext';
import { v4 } from 'uuid';
import * as yup from 'yup';
import Input from 'components/ui/input/Input';
import cx from 'classnames';
import Modal, { ModalType } from 'components/ui/modal/Modal';
import styles from 'components/internal-audit-report/forms/form.module.scss';
import 'components/internal-audit-report/forms/form.scss';
import { MaxLength, CommonQuery } from 'constants/common.const';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { useLocation } from 'react-router-dom';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { INSPECTION_REPORT_FIELDS_DETAILS } from 'constants/dynamic/inspection-report.const';

export enum CommentModalType {
  OFFICE = 'office',
  SMS = 'sms',
  HULL_AND_DECK = 'hullAndDeck',
  NAVIGATION = 'navigation',
}

interface CommentModalData {
  commentType: typeof CommentModalType[keyof typeof CommentModalType];
  label: string;
}

const CommentModalComponent = forwardRef((_, ref) => {
  const [visible, setVisible] = useState<boolean>(false);

  const { search } = useLocation();
  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.AuditInspectionInspectionReport,
    modulePage: search === CommonQuery.EDIT ? ModulePage.Edit : ModulePage.View,
  });
  const [currentType, setCurrentType] =
    useState<typeof CommentModalType[keyof typeof CommentModalType]>();
  const { officeComment, handleSetOfficeComment, setTouched } = useContext(
    InternalAuditReportFormContext,
  );
  const schema = yup.object().shape({
    comment: yup
      .string()
      .trim()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
  });
  const defaultValues = {
    comment: '',
  };
  const {
    formState: { errors },
    register,
    handleSubmit,
    reset,
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const toggle = () => setVisible((prev) => !prev);

  const close = () => {
    reset();
    setCurrentType(undefined);
    toggle();
  };

  const onSubmitForm = (dataForm) => {
    setTouched(true);
    const newState = [
      ...officeComment,
      {
        id: v4(),
        comment: dataForm?.comment?.toString(),
        isNew: true,
      },
    ];
    handleSetOfficeComment(newState);
    close();
  };

  useImperativeHandle(ref, () => ({
    showCommentModal: (data: CommentModalData) => {
      setVisible(true);
      setCurrentType(data.commentType);
    },
  }));

  return (
    <Modal
      isOpen={visible}
      title={
        currentType === CommentModalType.OFFICE
          ? renderDynamicLabel(
              dynamicLabels,
              INSPECTION_REPORT_FIELDS_DETAILS['Add comment'],
            )
          : renderDynamicLabel(
              dynamicLabels,
              INSPECTION_REPORT_FIELDS_DETAILS['Add description'],
            )
      }
      modalType={ModalType.CENTER}
      toggle={() => setVisible((prev) => !prev)}
      content={
        <div className={cx(styles.contentWrapper)}>
          {/* <TextAreaForm
            name="comment"
            placeholder={
              currentType === CommentModalType.OFFICE
                ? t('placeholderComment')
                : t('placeholderDescription')
            }
            maxLength={5000}
            minRows={1}
            control={control}
          /> */}
          <Input
            name="comment"
            isRequired
            label={renderDynamicLabel(
              dynamicLabels,
              INSPECTION_REPORT_FIELDS_DETAILS['Office comment'],
            )}
            messageRequired={errors?.comment?.message || ''}
            placeholder={
              currentType === CommentModalType.OFFICE
                ? renderDynamicLabel(
                    dynamicLabels,
                    INSPECTION_REPORT_FIELDS_DETAILS['Enter comment'],
                  )
                : renderDynamicLabel(
                    dynamicLabels,
                    INSPECTION_REPORT_FIELDS_DETAILS['Enter description'],
                  )
            }
            {...register('comment')}
            maxLength={MaxLength.MAX_LENGTH_OPTIONAL}
          />
        </div>
      }
      footer={
        <GroupButton
          className={cx(styles.GroupButton, 'mt-4 justify-content-end')}
          handleCancel={close}
          handleSubmit={handleSubmit(onSubmitForm)}
          txButtonBetween={renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS.Confirm,
          )}
          dynamicLabels={dynamicLabels}
          handleSubmitAndNew={undefined}
          disable={false}
        />
      }
    />
  );
});

type ModalRef = {
  showCommentModal: (data: CommentModalData) => void;
};
const modalRef = createRef<ModalRef>();
export const CommentModal = () => <CommentModalComponent ref={modalRef} />;
export const showCommentModal = (data: CommentModalData) => {
  modalRef.current?.showCommentModal(data);
};
