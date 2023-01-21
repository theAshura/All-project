import { useCallback, useState, useMemo } from 'react';
import cx from 'classnames';
import BreadCrumb from 'components/breadcrumb/BreadCrumb';
import Container from 'components/common/container/Container';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { BREAD_CRUMB } from 'constants/components/breadcrumb.const';
import useEffectOnce from 'hoc/useEffectOnce';
import { renderDynamicModuleLabel } from 'helpers/dynamic.helper';
import { useDispatch, useSelector } from 'react-redux';
import { getListFocusRequestActions } from 'store/focus-request/focus-request.action';
import { createPlanningAndRequestActions } from 'store/planning-and-request/planning-and-request.action';
import PlanningAndRequestForm from '../forms/PlanningAndRequestForm';
import styles from './create.module.scss';

export default function ShoreRankCreate() {
  const { loading } = useSelector((store) => store.planningAndRequest);
  const { listFocusRequests } = useSelector((state) => state.focusRequest);
  const { userInfo } = useSelector((state) => state.authenticate);
  const { listModuleDynamicLabels } = useSelector((state) => state.dynamic);
  const [modalAssignMentVisible, openModalAssignment] =
    useState<boolean>(false);

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.AuditInspectionPar,
    modulePage: ModulePage.Create,
  });
  const dispatch = useDispatch();

  const dataFocusRequest = useMemo(
    () =>
      listFocusRequests?.data?.map((item) => ({
        focusRequestId: item.id,
        question: item.question,
        memo: '',
        answer: 'No',
      })) || [],
    [listFocusRequests],
  );

  useEffectOnce(() => {
    // todo
    dispatch(
      getListFocusRequestActions.request({
        pageSize: -1,
        status: 'active',
        companyId: userInfo?.mainCompanyId,
      }),
    );
  });
  const handleSubmit = useCallback(
    (formData) => {
      const { id, ...other } = formData;
      dispatch(createPlanningAndRequestActions.request(other));
    },
    [dispatch],
  );

  return (
    <div className={styles.createContainer}>
      <Container className={styles.headerContainer}>
        <div className={cx(styles.headers)}>
          <BreadCrumb current={BREAD_CRUMB.PLANNING_AND_REQUEST_CREATE} />
          <div className="d-flex justify-content-between">
            <div className={cx('fw-bold', styles.title)}>
              {renderDynamicModuleLabel(
                listModuleDynamicLabels,
                DynamicLabelModuleName.AuditInspectionPar,
              )}
            </div>
          </div>
        </div>
      </Container>
      <Container className={styles.formContainer}>
        <PlanningAndRequestForm
          isEdit={!loading}
          data={null}
          isCreate
          onSubmit={handleSubmit}
          dataFocusRequest={dataFocusRequest}
          modalAssignMentVisible={modalAssignMentVisible}
          openModalAssignment={openModalAssignment}
          dynamicLabels={dynamicLabels}
        />
      </Container>
    </div>
  );
}
