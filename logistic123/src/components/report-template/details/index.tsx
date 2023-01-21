import { AppRouteConst } from 'constants/route.const';
import { useEffect, useState, useCallback } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import PermissionCheck from 'hoc/withPermissionCheck';
import {
  Features,
  SubFeatures,
  ActionTypeEnum,
} from 'constants/roleAndPermission.const';
import NoPermission from 'containers/no-permission';
import {
  getReportTemplateDetailActions,
  updateReportTemplateActions,
  deleteReportTemplateActions,
} from 'store/report-template/report-template.action';
import { CreateReportTemplateParams } from 'models/api/report-template/report-template.model';
import Container from 'components/common/container/ContainerPage';
import useEffectOnce from 'hoc/useEffectOnce';
import history from 'helpers/history.helper';
import ModalConfirm from 'components/common/modal/ModalConfirm';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  getCurrentModulePageByStatus,
  renderDynamicLabel,
} from 'helpers/dynamic.helper';
import { REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/report-template-master.const';
import { DynamicLabelModuleName } from 'constants/dynamic/dynamic.const';
import styles from './detail.module.scss';
import ReportTemplateForm from '../forms/ReportTemplateForm';

export default function ReportTemplateDetailContainer() {
  const { search } = useLocation();
  const dispatch = useDispatch();

  const { loading, ReportTemplateDetail } = useSelector(
    (state) => state.ReportTemplate,
  );

  const { id } = useParams<{ id: string }>();
  const [isEdit, setIsEdit] = useState(false);
  const [modal, setModal] = useState(false);

  const dynamicFields = useDynamicLabels({
    moduleKey:
      DynamicLabelModuleName.ConfigurationInspectionReportTemplateMaster,
    modulePage: getCurrentModulePageByStatus(isEdit, false),
  });

  useEffect(() => {
    if (search !== '?edit') {
      setIsEdit(false);
    } else {
      setIsEdit(true);
    }
  }, [search]);

  const handleSubmit = useCallback(
    (formData: CreateReportTemplateParams) => {
      dispatch(updateReportTemplateActions.request({ id, data: formData }));
    },
    [dispatch, id],
  );

  useEffectOnce(() => {
    dispatch(getReportTemplateDetailActions.request(id));
    return () => {
      dispatch(
        getReportTemplateDetailActions.success({
          id: '',
          moduleName: '',
          version: '',
          serialNumber: '',
          status: '',
          companyId: '',
          createdUserId: '',
        }),
      );
    };
  });

  return (
    <PermissionCheck
      options={{
        feature: Features.CONFIGURATION,
        subFeature: SubFeatures.REPORT_TEMPLATE,
        action:
          search === '?edit' ? ActionTypeEnum.UPDATE : ActionTypeEnum.VIEW,
      }}
    >
      {({ hasPermission }) =>
        hasPermission ? (
          <div className={styles.ReportTemplateDetail}>
            <Container>
              <ModalConfirm
                title={renderDynamicLabel(
                  dynamicFields,
                  REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS['Delete?'],
                )}
                content={renderDynamicLabel(
                  dynamicFields,
                  REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS[
                    'Are you sure you want to delete this record? This action cannot be undone and you will not be able to recover any data.'
                  ],
                )}
                isDelete
                disable={loading}
                toggle={() => {
                  setModal(!modal);
                }}
                modal={modal}
                handleSubmit={() => {
                  dispatch(
                    deleteReportTemplateActions.request({
                      id,
                      isDetail: true,
                      getListReportTemplate: () => {
                        history.push(AppRouteConst.REPORT_TEMPLATE);
                      },
                    }),
                  );
                }}
                cancelTxt={renderDynamicLabel(
                  dynamicFields,
                  REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS.Cancel,
                )}
                rightTxt={renderDynamicLabel(
                  dynamicFields,
                  REPORT_TEMPLATE_MASTER_DYNAMIC_DETAIL_FIELDS.Delete,
                )}
              />
              <ReportTemplateForm
                isEdit={isEdit}
                data={ReportTemplateDetail}
                onDelete={() => setModal(true)}
                onSubmit={handleSubmit}
                submitLoading={false}
              />
            </Container>
          </div>
        ) : (
          <NoPermission />
        )
      }
    </PermissionCheck>
  );
}
