import { FC, useEffect, useState } from 'react';
import useEffectOnce from 'hoc/useEffectOnce';
import ModalComponent from 'components/ui/modal/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { Table } from 'reactstrap';
import { getListReportTemplateActions } from 'store/report-template/report-template.action';
import useDynamicLabels from 'hoc/useDynamicLabels';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import {
  getCurrentModulePageByStatus,
  renderDynamicLabel,
} from 'helpers/dynamic.helper';
import { REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/report-template-master.const';

interface ModalAddProps {
  data?: any[];
  isShow?: boolean;
  setShow?: () => void;
  title?: string;
  isCreate?: boolean;
  isEdit?: boolean;
}

export const ModalAuditType: FC<ModalAddProps> = (props) => {
  const { data, setShow, isShow, isCreate, isEdit } = props;
  const { userInfo } = useSelector((state) => state.authenticate);

  const dispatch = useDispatch();
  const { listAuditTypes } = useSelector((state) => state.auditType);

  const dynamicFields = useDynamicLabels({
    moduleKey:
      DynamicLabelModuleName.ConfigurationInspectionReportTemplateMaster,
    modulePage: getCurrentModulePageByStatus(isEdit, isCreate),
  });

  const [modal, setModal] = useState(isShow || false);

  useEffectOnce(() => {
    dispatch(
      getListReportTemplateActions.request({
        pageSize: -1,
        companyId: userInfo?.mainCompanyId,
      }),
    );
  });

  const convertListAuditType = (listAuditTypeId: string[]) => {
    const auditTypes = listAuditTypes?.data;
    const listAudit = auditTypes
      ?.filter((item) => listAuditTypeId?.find((i) => i === item.id))
      .map((el) => ({
        code: el.code,
        name: el.name,
      }));

    return listAudit;
  };

  useEffect(() => {
    setModal(isShow);
  }, [isShow]);

  const listAudit = convertListAuditType(data);
  const renderForm = () => (
    <>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>
              {renderDynamicLabel(
                dynamicFields,
                REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                  'Inspection type code'
                ],
              )}
            </th>
            <th>
              {renderDynamicLabel(
                dynamicFields,
                REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                  'Inspection type name'
                ],
              )}
            </th>
          </tr>
        </thead>
        <tbody>
          {listAudit.map((item, i) => (
            <tr key={item.code}>
              <td>{i + 1}</td>
              <td>{item.code}</td>
              <td>{item.name}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
  return (
    <ModalComponent
      isOpen={modal}
      toggle={() => {
        setModal(false);
        setShow();
      }}
      title={renderDynamicLabel(
        dynamicFields,
        REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS['Inspection type'],
      )}
      content={renderForm()}
    />
  );
};
