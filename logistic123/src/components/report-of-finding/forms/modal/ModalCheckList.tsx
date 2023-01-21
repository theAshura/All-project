import { FC, useCallback, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { ButtonType } from 'components/ui/button/Button';
import { getListFileActions } from 'store/dms/dms.action';
import cx from 'classnames';
import { RowComponent } from 'components/common/table/row/rowCp';
import TableCp from 'components/common/table/TableCp';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import Modal, { ModalType } from 'components/ui/modal/Modal';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS } from 'constants/dynamic/report-of-finding.const';
import { TableAttachment } from 'components/common/table-attachment/TableAttachment';
import { Controller, FieldValues, useForm } from 'react-hook-form';
import { GroupButton } from 'components/ui/button/GroupButton';
import styles from './modal-check-list.module.scss';

interface Props {
  isEdit?: boolean;
  isCreate?: boolean;
  modal: boolean;
  toggle: () => void;
  handleAdd?: (data) => void;
  setCheckListView?: (value: boolean) => void;
  header?: string;
  data?: any[];
  bodyClassName?: string;
  loading?: boolean;
  attachments: string[];
  dynamicLabels?: IDynamicLabel;
}

const sanitizeData = (dataItem: {
  auditType: string;
  id: string;
  checklistName: string;
  checklistNo: string;
}) => {
  const finalData = {
    id: dataItem?.id,
    checklistNo: dataItem?.checklistNo,
    checklistName: dataItem?.checklistName,
    auditType: dataItem?.auditType,
  };

  return finalData;
};

const CheckListModal: FC<Props> = (props) => {
  const {
    modal,
    toggle,
    data,
    attachments = [],
    handleAdd,
    setCheckListView,
    isEdit,
    dynamicLabels,
  } = props;
  const dispatch = useDispatch();
  const { control, handleSubmit, setValue } = useForm<FieldValues>({
    mode: 'onChange',
  });

  const rowLabels = [
    // {
    //   id: 'action',
    //   label: 'Action',
    //   sort: false,
    //   width: '100',
    // },
    {
      id: 'checklistNo',
      label: renderDynamicLabel(
        dynamicLabels,
        DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Checklist no'],
      ),
      sort: false,
      width: '100',
    },
    {
      id: 'checklistName',
      label: renderDynamicLabel(
        dynamicLabels,
        DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Checklist name'],
      ),
      sort: false,
      width: '50',
    },
    {
      id: 'auditType',
      label: renderDynamicLabel(
        dynamicLabels,
        DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS['Inspection type'],
      ),
      sort: false,
      width: '50',
    },
  ];

  useEffect(() => {
    if (modal && attachments.length > 0) {
      dispatch(getListFileActions.request({ ids: attachments }));
      setValue('attachments', attachments);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modal]);

  const onSubmitForm = (formData) => {
    handleAdd(formData);
    setCheckListView(false);
  };

  const renderRow = useCallback(
    (isScrollable?: boolean) => {
      if (data?.length > 0) {
        return (
          <tbody>
            {data?.map((item, index) => {
              const finalData = sanitizeData(item);

              // const actions: Action[] = [
              //   {
              //     img: images.icons.icEdit,
              //     function: () => undefined,
              //     feature: Features.AUDIT_INSPECTION,
              //     subFeature: SubFeatures.REPORT_OF_FINDING,
              //     action: ActionTypeEnum.UPDATE,
              //     cssClass: 'me-1',
              //   },
              // ];
              return (
                <RowComponent
                  key={item.id}
                  isScrollable={isScrollable}
                  data={finalData}
                  // actionList={actions}
                />
              );
            })}
          </tbody>
        );
      }
      return null;
    },
    [data],
  );
  const renderContent = () => (
    <div className={styles.wrapContentModalScroll}>
      <div>
        <TableCp
          loading={false}
          rowLabels={rowLabels}
          isEmpty={false}
          isHiddenAction
          renderRow={renderRow}
        />

        <Controller
          control={control}
          name="attachments"
          render={({ field }) => (
            <TableAttachment
              featurePage={Features.AUDIT_INSPECTION}
              subFeaturePage={SubFeatures.REPORT_OF_FINDING}
              loading={false}
              isEdit={isEdit}
              value={field.value}
              buttonName={renderDynamicLabel(
                dynamicLabels,
                DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS.Attach,
              )}
              onchange={field.onChange}
              dynamicLabels={dynamicLabels}
            />
          )}
        />
      </div>
    </div>
  );

  const renderFooter = () => (
    <>
      <div>
        <GroupButton
          className={cx(styles.GroupButton, 'mt-4 justify-content-end')}
          buttonTypeLeft={ButtonType.OutlineGray}
          handleCancel={() => setCheckListView(false)}
          dynamicLabels={dynamicLabels}
          handleSubmit={handleSubmit(onSubmitForm)}
        />
      </div>
    </>
  );

  return (
    <Modal
      w={700}
      content={renderContent()}
      isOpen={modal}
      toggle={toggle}
      footer={isEdit ? renderFooter() : undefined}
      title={renderDynamicLabel(
        dynamicLabels,
        DETAIL_REPORT_OF_FINDING_DYNAMIC_FIELDS.Checklist,
      )}
      dynamicLabels={dynamicLabels}
      modalType={ModalType.CENTER}
    />
  );
};

export default CheckListModal;
