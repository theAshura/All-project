import cx from 'classnames';
import { FC, ReactElement, useEffect, useMemo, useState } from 'react';
import ModalComponent from 'components/ui/modal/Modal';
import { Col, Row } from 'reactstrap';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { filterContentSelect } from 'helpers/filterSelect.helper';
import * as yup from 'yup';
import { useSelector } from 'react-redux';
import { ReportHeader } from 'models/api/report-template/report-template.model';
import NewAsyncSelect from 'components/ui/async-select/NewAsyncSelect';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  getCurrentModulePageByStatus,
  renderDynamicLabel,
} from 'helpers/dynamic.helper';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import { REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/report-template-master.const';
import styles from './form.module.scss';

export interface OptionProps {
  value: string;
  label: string | ReactElement;
  image?: string;
  selected: boolean;
}

interface ModalAddProps {
  data?: ReportHeader[];
  handleAdd?: (data) => void;
  handSelection?: (data) => void;
  loading?: boolean;
  isAdd?: boolean;
  isCreate?: boolean;
  selectedData?: ReportHeader;
  headerIndex?: number;
  vesselSelected: OptionProps;

  isShow?: boolean;
  setShow?: () => void;
  title?: string;
  isEdit?: boolean;
}

const defaultValues = {
  topic: '',
  auditTypeIds: [],
  topicType: 'header',
  minScore: undefined,
  maxScore: undefined,
};

export const ModalChoseVersionTemplate: FC<ModalAddProps> = (props) => {
  const {
    loading,
    isShow,
    handSelection,
    setShow,
    vesselSelected,
    isEdit,
    isCreate,
  } = props;

  const [modal, setModal] = useState(isShow || false);
  const { listReportTemplates } = useSelector((state) => state.ReportTemplate);
  const [templateOptions, setTemplateOptions] = useState([]);

  const dynamicFields = useDynamicLabels({
    moduleKey:
      DynamicLabelModuleName.ConfigurationInspectionReportTemplateMaster,
    modulePage: getCurrentModulePageByStatus(isEdit, isCreate),
  });

  const schema = yup.object().shape({
    topic: yup
      .string()
      .trim()
      .nullable()
      .required(
        renderDynamicLabel(
          dynamicFields,
          REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
            'This field is required'
          ],
        ),
      ),
    auditTypeIds: yup
      .array()
      .min(
        1,
        renderDynamicLabel(
          dynamicFields,
          REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
            'This field is required'
          ],
        ),
      ),
    minScore: yup
      .number()
      .required(
        renderDynamicLabel(
          dynamicFields,
          REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
            'This field is required'
          ],
        ),
      ),
    maxScore: yup
      .number()
      .moreThan(yup.ref('minScore'))
      .required(
        renderDynamicLabel(
          dynamicFields,
          REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
            'This field is required'
          ],
        ),
      ),
  });
  const {
    setValue,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(schema),
  });

  const resetForm = () => {
    // reset(data)
    setValue('topic', '');
    setValue('auditTypeIds', []);
    setValue('minScore', undefined);
    setValue('maxScore', undefined);
  };
  const listOptionReportTemplate = useMemo(
    () =>
      (listReportTemplates?.data &&
        listReportTemplates.data.map((item) => ({
          value: item.id,
          label: item.version,
        }))) ||
      [],
    [listReportTemplates],
  );

  useEffect(() => {
    setTemplateOptions(listOptionReportTemplate);
  }, [listOptionReportTemplate]);

  useEffect(() => {
    setModal(isShow);
  }, [isShow]);

  const renderForm = () => (
    <>
      <div>
        <Row className="mx-0">
          <Col className="ps-0">
            <NewAsyncSelect
              labelSelect={renderDynamicLabel(
                dynamicFields,
                REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                  'Version template'
                ],
              )}
              options={templateOptions}
              disabled={loading}
              textSelectAll={renderDynamicLabel(
                dynamicFields,
                REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS['Select all'],
              )}
              placeholder={renderDynamicLabel(
                dynamicFields,
                REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS['Please select'],
              )}
              value={vesselSelected}
              className={cx(styles.inputSelect, 'w-100')}
              handleConfirm={(value: OptionProps[]) => {
                if (value[0] && vesselSelected !== value[0]) {
                  handSelection(value[0]);
                  setShow();
                }
              }}
              onChangeSearch={(value: string) => {
                const newData = filterContentSelect(
                  value,
                  listOptionReportTemplate || [],
                );
                setTemplateOptions(newData);
              }}
              messageRequired={errors?.auditTypeIds?.message || ''}
            />
          </Col>
        </Row>
      </div>
    </>
  );

  return (
    <ModalComponent
      isOpen={modal}
      toggle={() => {
        if (!loading) {
          setModal(false);
          setShow();
          resetForm();
        }
      }}
      title={renderDynamicLabel(
        dynamicFields,
        REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS['Choose version template'],
      )}
      content={renderForm()}
    />
  );
};
