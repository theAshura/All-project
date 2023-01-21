import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Container from 'components/common/container/ContainerPage';
import {
  BulkUpdateElementMasterParams,
  StandardType,
  Status,
} from 'models/api/element-master/element-master.model';
import { getListTemplateActions } from 'store/template/template.action';
import { MODULE_TEMPLATE } from 'constants/components/ag-grid.const';
import {
  clearElementMasterErrorsReducer,
  getListStandardMasterNoElementActions,
  updateElementMasterActions,
} from 'store/element-master/element-master.action';
import styles from './create.module.scss';
import ElementMaster from '../forms/ElementMasterForm';

export default function ElementMasterNew() {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.elementMaster);

  const handleSubmit = useCallback(
    (formData: BulkUpdateElementMasterParams) => {
      const { standardId, ...other } = formData;
      dispatch(
        updateElementMasterActions.request({
          id: standardId,
          data: other,
          isCreate: true,
        }),
      );
    },
    [dispatch],
  );

  useEffect(() => {
    dispatch(clearElementMasterErrorsReducer());
    dispatch(
      getListTemplateActions.request({
        content: MODULE_TEMPLATE.selfAssessmentElementMaster,
      }),
    );
    dispatch(
      getListStandardMasterNoElementActions.request({
        pageSize: -1,
        hasElement: StandardType.noElement,
        status: Status.active,
      }),
    );
    return () => {
      dispatch(
        getListStandardMasterNoElementActions.success({
          data: [],
          page: 0,
          pageSize: 0,
          totalPage: 0,
          totalItem: 0,
        }),
      );
    };
  }, [dispatch]);

  return (
    <div className={styles.ElementMaster}>
      <Container>
        <ElementMaster
          isEdit={!loading}
          data={null}
          onSubmit={handleSubmit}
          isCreate={!loading}
        />
      </Container>
    </div>
  );
}
