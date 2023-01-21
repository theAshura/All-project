import {
  FC,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';

import { useLocation } from 'react-router';
import { useSelector } from 'react-redux';
import { AppRouteConst } from 'constants/route.const';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import { InternalAuditReportFormContext } from 'contexts/internal-audit-report/IARFormContext';
import { ActivePermission, CommonQuery } from 'constants/common.const';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { ButtonSize, ButtonType } from 'components/ui/button/Button';
import { InternalAuditReportStatus } from 'components/internal-audit-report/details';
import history from 'helpers/history.helper';
import images from 'assets/images/images';
import { useDraftOrReassigned } from './helpers/helpers';
import Form from './InternalAuditReportForm';
import styles from './form.module.scss';

interface Props {
  id: string;
  loading?: boolean;
  handleSetInitialData: () => void;
}
export interface IARActionBtns {
  text: string | ReactNode;
  buttonType?: typeof ButtonType[keyof typeof ButtonType];
  buttonSize?: typeof ButtonSize[keyof typeof ButtonSize];
  className?: string;
  onClick: () => any;
  name: string;
  visible: boolean;
}

const InternalAuditReportFormContainer: FC<Props> = (props) => {
  const { loading, handleSetInitialData } = props;
  const { search } = useLocation();
  const isDraftOrReassigned = useDraftOrReassigned();

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.AuditInspectionInspectionReport,
    modulePage: search === CommonQuery.EDIT ? ModulePage.Edit : ModulePage.View,
  });
  const { internalAuditReportDetail } = useSelector(
    (store) => store.internalAuditReport,
  );
  const { workFlowActiveUserPermission } = useSelector(
    (store) => store.workFlow,
  );
  const { userInfo } = useSelector((state) => state.authenticate);
  const { isTouched, setTouched, handleSubmit, openModalRemark } = useContext(
    InternalAuditReportFormContext,
  );

  const [hasEditRest, setHasEditRest] = useState<boolean>(false);

  const handleCancel = () => {
    if (search !== CommonQuery.EDIT) {
      history.push(AppRouteConst.INTERNAL_AUDIT_REPORT);
    } else if (search === CommonQuery.EDIT && !isTouched) {
      history.goBack();
    } else if (search === CommonQuery.EDIT && isTouched) {
      showConfirmBase({
        isDelete: false,
        txTitle: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Cancel?'],
        ),
        txMsg: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS[
            'Are you sure you want to proceed with this action?'
          ],
        ),
        txButtonLeft: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS.Cancel,
        ),
        txButtonRight: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS.Confirm,
        ),
        onPressButtonRight: () => {
          handleSetInitialData();
          setTouched(false);
          history.goBack();
        },
      });
    }
  };

  /* --- useEffect --- */

  useEffect(() => {
    if (
      search === CommonQuery.EDIT &&
      isDraftOrReassigned() &&
      workFlowActiveUserPermission?.includes(ActivePermission.CREATOR)
    ) {
      setHasEditRest(true);
    } else {
      setHasEditRest(false);
    }
  }, [search, isDraftOrReassigned, workFlowActiveUserPermission]);

  const isVisibleSubmitBtn = useCallback(() => {
    if (
      isDraftOrReassigned() &&
      workFlowActiveUserPermission?.includes(ActivePermission.CREATOR) &&
      internalAuditReportDetail?.leadAuditorId === userInfo?.id
    ) {
      return true;
    }
    return false;
  }, [
    internalAuditReportDetail?.leadAuditorId,
    isDraftOrReassigned,
    userInfo?.id,
    workFlowActiveUserPermission,
  ]);

  const IARActionBtns: IARActionBtns[] = useMemo(() => {
    const isPIC =
      internalAuditReportDetail?.nonConformities?.data?.some(
        (i) => i.picId === userInfo?.id,
      ) ||
      internalAuditReportDetail?.observations?.data?.some(
        (i) => i.picId === userInfo?.id,
      );
    const submittedCase =
      internalAuditReportDetail?.status ===
        InternalAuditReportStatus.SUBMITTED && isPIC;
    const btnSubmitVisible =
      search === CommonQuery.EDIT && isVisibleSubmitBtn();

    const btnSaveVisible = search === CommonQuery.EDIT && !submittedCase;

    const saveBtnName =
      btnSaveVisible && btnSubmitVisible
        ? renderDynamicLabel(
            dynamicLabels,
            COMMON_DYNAMIC_FIELDS['Save as draft'],
          )
        : renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Save);

    return [
      {
        text: saveBtnName,
        onClick: () => handleSubmit(false),
        name: 'save',
        visible: btnSaveVisible,
      },
      {
        text: (
          <>
            <span>
              {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Submit)}
            </span>
            <img src={images.icons.icRightArrow} alt="right-arrow" />
          </>
        ),
        className: styles.submitBtn,
        onClick: () => openModalRemark(true),
        name: 'submit',
        visible: btnSubmitVisible,
      },
    ];
  }, [
    internalAuditReportDetail?.nonConformities?.data,
    internalAuditReportDetail?.observations?.data,
    internalAuditReportDetail?.status,
    dynamicLabels,
    search,
    isVisibleSubmitBtn,
    userInfo?.id,
    handleSubmit,
    openModalRemark,
  ]);

  return (
    <>
      {loading ? (
        <div className="d-flex justify-content-center">
          <img
            src={images.common.loading}
            className={styles.loading}
            alt="loading"
          />
        </div>
      ) : (
        <Form
          hasEditRest={hasEditRest}
          handleCancel={handleCancel}
          IARActionBtns={IARActionBtns}
        />
      )}
    </>
  );
};

export default InternalAuditReportFormContainer;
