import { getDetailCarApiRequest } from 'api/car.api';
import { getListFileApi } from 'api/dms.api';
import { CAR_STATUS, CarVerificationStatusEnum } from 'constants/car.const';
import { WorkFlowType, ActivePermission } from 'constants/common.const';
import { toastError } from 'helpers/notification.helper';
import cloneDeep from 'lodash/cloneDeep';
import { CreateCapParams, ICapDetailRes } from 'models/api/car/car.model';
import {
  createContext,
  useCallback,
  useMemo,
  SetStateAction,
  Dispatch,
  useState,
} from 'react';
import useWorkflowPermission from '../../hoc/useWorkflowPermission';

export interface Attachment {
  id?: string;
  name?: string;
  size?: number | string;
  mimetype?: string;
  key?: string;
  link?: string;
  lastModifiedDate?: Date;
  uploadByUser?: string;
}

export interface Step1Form {
  actionRequest: string;
  capTargetPeriod: number;
  periodType: string;
  capTargetEndDate: string;
}

export interface Step3Form {
  comment?: string;
}

export interface Step4Form {
  isNeeded: boolean;
  types: string[];
  status: string;
  verifiedDate: string;
  verifiedById: string;
  reason: string;
}

type Step1Values = Step1Form & {
  attachments?: Attachment[];
  attachmentsFromFinding?: any;
  findingSelected: any;
  idCar?: string;
  idCap?: string;
};

type Step2Values = CreateCapParams & {};

type Step3Values = Step3Form & {};

type Step4Values = Step4Form & {
  attachments?: Attachment[];
};

interface Props {
  detailCar: ICapDetailRes;
  activeStep: number;
  setActiveStep: Dispatch<SetStateAction<number>>;
  planningAndRequestId: string;
  rofId?: string;
  isEdit: boolean;
  setPlanningAndRequestId: Dispatch<SetStateAction<string>>;
  handleChangeActiveStep: (step: number) => void;
  handleGetCarDetail: (carId?: string, isFirstTime?: boolean) => void;
  stepComplete: number;
  setStepComplete: Dispatch<SetStateAction<number>>;
  carStatus: string;
  setCarStatus: Dispatch<SetStateAction<string>>;
  capStatus: string;
  setCapStatus: Dispatch<SetStateAction<string>>;
  isDisableStep1: boolean;
  step1Values: Step1Values;
  setStep1Values: Dispatch<SetStateAction<Step1Values>>;
  step1ValuesDraft: Step1Values;
  setStep1ValuesDraft: Dispatch<SetStateAction<Step1Values>>;
  step2Values: Step2Values;
  setStep2Values: Dispatch<SetStateAction<Step2Values>>;
  step3Values: Step3Values;
  setStep3Values: Dispatch<SetStateAction<Step3Values>>;
  isDisableStep2: boolean;
  isDisableStep3: boolean;
  step4Values: Step4Values;
  setStep4Values: Dispatch<SetStateAction<Step4Values>>;
  isDisableStep4: boolean;
  closeAndResetData: (getList?: any) => void;
  workflow?: any;
}

const step1InitialValue = {
  attachments: [],
  attachmentsFromFinding: [],
  actionRequest: '',
  capTargetPeriod: null,
  periodType: 'Day',
  capTargetEndDate: '',
  findingSelected: [],
};
const step2InitialValue = {
  planAction: '',
  rootCause: '',
  ecdCap: '',
  acdCap: '',
  picCap: '',
  preventiveAction: '',
  ecdPrevent: '',
  acdPrevent: '',
  picPrevent: '',
  comments: [],
};
const step3InitialValue = {};
const step4InitialValue = {
  isNeeded: true,
  types: [],
  status: '',
  verifiedDate: '',
  verifiedById: '',
  reason: '',
  attachments: [],
};

export const CarFormContext = createContext<Props | undefined>(undefined);

const CarFormProvider = ({ children, onClose, rofId, isEdit, capOnly }) => {
  const workflow = useWorkflowPermission(WorkFlowType.CAR_CAP);
  const workflowRof = useWorkflowPermission(WorkFlowType.REPORT_FINDING);

  const [activeStep, setActiveStep] = useState<number>(1);
  const [planningAndRequestId, setPlanningAndRequestId] =
    useState<string>(null);

  const [stepComplete, setStepComplete] = useState<number>(0);
  const [carStatus, setCarStatus] = useState<string>('');
  const [capStatus, setCapStatus] = useState<string>('');
  const [detailCar, setDetailCar] = useState<ICapDetailRes>(null);

  const [step1Values, setStep1Values] = useState<Step1Values>(
    cloneDeep(step1InitialValue),
  );
  const [step1ValuesDraft, setStep1ValuesDraft] = useState<Step1Values>(null);

  const [step2Values, setStep2Values] = useState<CreateCapParams>(
    cloneDeep(step2InitialValue),
  );

  const [step3Values, setStep3Values] = useState(cloneDeep(step3InitialValue));
  const [step4Values, setStep4Values] = useState<Step4Values>(
    cloneDeep(step4InitialValue),
  );

  const handleChangeActiveStep = useCallback((step: number) => {
    setActiveStep((prev) => prev + step);
  }, []);

  const existRofPermission = useMemo(
    () =>
      workflowRof?.some(
        (item) =>
          item === ActivePermission.CREATOR ||
          item === ActivePermission.REVIEWER,
      ),
    [workflowRof],
  );

  const isDisableStep1 = useMemo(() => {
    if (!isEdit) {
      return true;
    }
    if (!existRofPermission) {
      return true;
    }
    if (capOnly) {
      return true;
    }
    if (capStatus === CAR_STATUS.Draft) {
      return true;
    }
    if (detailCar?.cap?.id) {
      return true;
    }
    return false;
  }, [capOnly, capStatus, detailCar?.cap?.id, existRofPermission, isEdit]);

  const isDisableStep2 = useMemo(() => {
    if (!isEdit) {
      return true;
    }
    if (!workflow?.find((i) => i === ActivePermission.CREATOR)) {
      return true;
    }
    if (detailCar?.cap?.status === CAR_STATUS.Draft) {
      return false;
    }
    if (detailCar?.status === CAR_STATUS.Open && !detailCar?.cap) {
      return false;
    }
    if (detailCar?.cap?.status === CAR_STATUS.Denied) {
      return false;
    }
    return true;
  }, [detailCar?.cap, detailCar?.status, isEdit, workflow]);

  const isDisableStep3 = useMemo(() => {
    if (!isEdit) {
      return true;
    }
    if (!workflow?.find((i) => i === ActivePermission.REVIEWER)) {
      return true;
    }
    if (stepComplete < 2) {
      return true;
    }
    if (detailCar?.cap?.status === CAR_STATUS.Accepted) {
      return true;
    }
    if (detailCar?.cap?.status === CAR_STATUS.Denied) {
      return true;
    }
    if (capStatus === CAR_STATUS.Draft) {
      return true;
    }
    return false;
  }, [capStatus, detailCar?.cap?.status, isEdit, stepComplete, workflow]);

  const isDisableStep4 = useMemo(() => {
    if (!isEdit) {
      return true;
    }
    if (!workflow?.find((i) => i === ActivePermission.VERIFICATION)) {
      return true;
    }
    if (stepComplete < 3) {
      return true;
    }
    if (detailCar?.cARVerification?.id) {
      return true;
    }
    if (capStatus === CAR_STATUS.Draft) {
      return true;
    }
    if (detailCar?.cap?.status === CAR_STATUS.Denied) {
      return false;
    }
    return false;
  }, [
    capStatus,
    detailCar?.cARVerification?.id,
    detailCar?.cap?.status,
    isEdit,
    stepComplete,
    workflow,
  ]);

  const getListFileAttach = useCallback(async (ids: string[]) => {
    if (!ids || ids?.length <= 0) {
      return [];
    }
    try {
      const listFileAttach = await getListFileApi({ ids });
      return (
        listFileAttach?.data?.map((i) => ({
          id: i.id,
          name: i.originName,
          size: i.size,
          mimetype: i.mimetype,
          key: i.key,
          link: i.link,
          lastModifiedDate: i.createdAt,
          uploadByUser: i?.uploadByUser?.username || '',
        })) || []
      );
    } catch (error) {
      return toastError(error);
    }
  }, []);

  const checkStepCompleted = useCallback((data: ICapDetailRes) => {
    if (data?.cARVerification?.id) {
      setStepComplete(4);
      setActiveStep(4);
      return;
    }
    if (data?.cARVerification) {
      setStepComplete(3);
      setActiveStep(4);
      return;
    }
    if (data?.cap?.status === CAR_STATUS.Denied) {
      setStepComplete(2);
      setActiveStep(2);
      return;
    }
    if (data?.cap?.status === CAR_STATUS.Accepted) {
      setStepComplete(3);
      setActiveStep(4);
      return;
    }
    if (data?.cap?.status === CAR_STATUS.Draft) {
      setStepComplete(1);
      setActiveStep(2);
      return;
    }
    if (data?.cap?.id) {
      setStepComplete(2);
      setActiveStep(3);
      return;
    }
    setStepComplete(1);
    setActiveStep(2);
  }, []);

  const setStepActiveEditCase = useCallback((data: ICapDetailRes) => {
    if (data?.cARVerification?.id) {
      setStepComplete(4);
      return;
    }
    if (data?.cARVerification) {
      setStepComplete(3);
      return;
    }
    if (data?.cap?.status === CAR_STATUS.Denied) {
      setStepComplete(2);
      return;
    }
    if (data?.cap?.status === CAR_STATUS.Accepted) {
      setStepComplete(3);
      return;
    }
    if (data?.cap?.status === CAR_STATUS.Draft) {
      setStepComplete(1);
      return;
    }
    if (data?.cap?.id) {
      setStepComplete(2);
      return;
    }

    setStepComplete(1);
  }, []);

  const handleGetCarDetail = useCallback(
    async (carId?: string, isFirstTime?: boolean) => {
      if (carId || detailCar?.id) {
        getDetailCarApiRequest(carId || detailCar?.id)
          .then(async (res) => {
            const { data } = res;
            const listFileAttach = await getListFileAttach(data?.attachments);
            const listFileAttachStep4 =
              data?.cARVerification?.attachments?.length > 0
                ? await getListFileAttach(data?.cARVerification?.attachments)
                : [];

            setCarStatus(data.status);
            setCapStatus(data?.cap?.status);
            await setDetailCar(data);
            if (isFirstTime) {
              setStepActiveEditCase(data);
            } else {
              checkStepCompleted(data);
            }

            setStep1Values((prev) => ({
              ...prev,
              attachments: listFileAttach || [],
              actionRequest:
                data?.actionRequest || Number(data?.actionRequest) === 0
                  ? data?.actionRequest
                  : '',
              capTargetPeriod: data?.capTargetPeriod || null,
              periodType: data?.periodType || '',
              capTargetEndDate: data?.capTargetEndDate || '',
              findingSelected: data?.reportFindingItems || [],
              idCar: carId || detailCar?.id,
              idCap: data?.cap?.id || null,
            }));
            setStep2Values((prev) => ({
              ...prev,
              planAction: data?.cap?.planAction || '',
              rootCause: data?.cap?.rootCause || '',
              ecdCap: data?.cap?.ecdCap || '',
              acdCap: data?.cap?.acdCap || '',
              picCap: data?.cap?.picCap || '',
              preventiveAction: data?.cap?.preventiveAction || '',
              ecdPrevent: data?.cap?.ecdPrevent || '',
              acdPrevent: data?.cap?.acdPrevent || '',
              picPrevent: data?.cap?.picPrevent || '',
              comments: data?.cap?.capComments?.length
                ? data?.cap?.capComments
                : [],
            }));
            setStep4Values((prev) => ({
              ...prev,
              isNeeded: data?.cARVerification?.isNeeded !== false,
              types: data?.cARVerification?.type || [],
              status:
                data?.cARVerification?.status ||
                CarVerificationStatusEnum.PENDING,
              verifiedDate: data?.cARVerification?.verifiedDate || '',
              verifiedById: data?.cARVerification?.verifiedById || '',
              reason: data?.cARVerification?.reason || '',
              attachments: listFileAttachStep4 || [],
            }));
          })
          .catch((err) => toastError(err));
      }
    },
    [
      checkStepCompleted,
      detailCar?.id,
      getListFileAttach,
      setStepActiveEditCase,
    ],
  );

  const closeAndResetData = useCallback(
    (getList?: boolean) => {
      setStep1Values((pre) => cloneDeep(step1InitialValue));
      setStep2Values((pre) => cloneDeep(step2InitialValue));
      setStep3Values((pre) => cloneDeep(step3InitialValue));
      setStep4Values((pre) => cloneDeep(step4InitialValue));
      setActiveStep(1);
      setStepComplete(1);
      if (stepComplete >= 1) {
        // with case update finding item
        onClose(true);
      } else {
        onClose(getList || false);
      }
    },
    [onClose, stepComplete],
  );

  const themeContextData = {
    detailCar,
    activeStep,
    setActiveStep,
    planningAndRequestId,
    rofId,
    setPlanningAndRequestId,
    isEdit,
    handleChangeActiveStep,
    handleGetCarDetail,
    stepComplete,
    setStepComplete,
    carStatus,
    setCarStatus,
    capStatus,
    setCapStatus,
    step1Values,
    setStep1Values,
    step1ValuesDraft,
    setStep1ValuesDraft,
    isDisableStep1,
    step2Values,
    setStep2Values,
    step3Values,
    setStep3Values,
    isDisableStep2,
    isDisableStep3,
    step4Values,
    setStep4Values,
    isDisableStep4,
    closeAndResetData,
    workflow,
  };
  return (
    <CarFormContext.Provider value={themeContextData}>
      {children}
    </CarFormContext.Provider>
  );
};

export default CarFormProvider;
