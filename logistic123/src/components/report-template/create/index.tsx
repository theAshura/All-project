import { useCallback, useEffect, useState } from 'react';
import {
  createReportTemplateActions,
  clearReportTemplateErrorsReducer,
} from 'store/report-template/report-template.action';
import { useDispatch, useSelector } from 'react-redux';
import Container from 'components/common/container/ContainerPage';
import { createReportTemplateActionsApi } from 'api/report-template.api';
import { toastError, toastSuccess } from 'helpers/notification.helper';
import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';

import styles from './create.module.scss';
import ReportTemplate from '../forms/ReportTemplateForm';

export default function ReportTemplateNew() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.ReportTemplate);
  const [submitLoading, setSubmitLoading] = useState(false);
  const handleSubmit = useCallback(
    async (formData) => {
      const { isNew, resetForm, ...params } = formData;
      setSubmitLoading(true);
      createReportTemplateActionsApi(params)
        .then((_response) => {
          dispatch(createReportTemplateActions.success());
          toastSuccess('You have created successfully');

          if (isNew) {
            resetForm();
          } else {
            history.push(AppRouteConst.REPORT_TEMPLATE);
          }
        })
        .catch((e) => {
          if (e?.statusCode === 400) {
            if (Array.isArray(e?.errorList)) {
              dispatch(createReportTemplateActions.failure(e?.errorList));
            }

            if (e?.message) {
              dispatch(
                createReportTemplateActions.failure([
                  { message: e?.message, fieldName: 'versionExisted' },
                ]),
              );
            }
          } else {
            toastError(e);
            dispatch(createReportTemplateActions.failure(undefined));
          }
        })
        .finally(() => {
          setSubmitLoading(false);
        });
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch(clearReportTemplateErrorsReducer());
  }, [dispatch]);

  return (
    <div className={styles.ReportTemplate}>
      <Container>
        <ReportTemplate
          isEdit={!loading}
          data={null}
          onSubmit={handleSubmit}
          isCreate={!loading}
          submitLoading={submitLoading}
        />
      </Container>
    </div>
  );
}
