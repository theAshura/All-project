import cx from 'classnames';
import { useState, useEffect, FC, useMemo, useRef } from 'react';
import Button, { ButtonSize } from 'components/ui/button/Button';
import { Col, Row } from 'reactstrap';
import { v4 } from 'uuid';

import {
  optionTypes,
  optionVIQVesselTypes,
  statusOptions,
} from 'constants/filter.const';
import { useForm, FieldValues } from 'react-hook-form';
import history from 'helpers/history.helper';
import Container from 'components/common/container/Container';
import { AppRouteConst } from 'constants/route.const';
import { useDispatch, useSelector } from 'react-redux';
import SelectUI from 'components/ui/select/Select';
import images from 'assets/images/images';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

import {
  clearVIQErrorsReducer,
  getListPotentialRiskActions,
} from 'store/viq/viq.action';
import { ViqResponse, ViqMainCategory } from 'models/api/viq/viq.model';
import InputForm from 'components/react-hook-form/input-form/InputForm';
import { REGEXP_INPUT_NUMBER } from 'constants/regExpValidate.const';
import { GroupButton } from 'components/ui/button/GroupButton';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import isEqual from 'lodash/isEqual';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import {
  VIQ_FIELDS_DETAILS,
  VIQ_FIELDS_LIST,
} from 'constants/dynamic/vessel-inspection-questionnaires.const';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import ModalSubCateGory from '../components/modal/ModalSubCateGory';
import ModalMainCateGory from '../components/modal/ModalMainCateGory';

import ModalSecondSubCateGory from '../components/modal/ModalSecondSubCateGory';
import TableMain from '../components/table/TableMain';
import TableSub, { VIQSubExtend } from '../components/table/TableSub';
import TableSecondSub from '../components/table/TableSecondSub';

import styles from './form.module.scss';

interface VIQFormProps {
  isEdit: boolean;
  isCreate?: boolean;
  data: ViqResponse;
  onSubmit: (CreateViqParams) => void;
}

export enum ModalType {
  HIDDEN = 'HIDDEN',
  VIQ = 'VIQ',
  MAIN = 'MAIN',
  SUB = 'SUB',
  SECOND_SUB = 'SECOND_SUB',
  ERROR = 'ERROR',
}

const defaultValues = {
  type: null,
  udfVersionNo: '',
  viqVesselType: null,
  status: 'active',
};

const VIQForm: FC<VIQFormProps> = ({ isEdit, data, onSubmit, isCreate }) => {
  const dispatch = useDispatch();
  const [modal, setModal] = useState<ModalType>(ModalType.HIDDEN);
  const [messageError, setMessageError] = useState<string>('');
  const [mainCategories, setMainCategories] = useState<ViqMainCategory[]>([]);

  const [itemSelectedSub, setItemSelectedSub] =
    useState<VIQSubExtend>(undefined);
  const [itemSelectedMain, setItemSelectedMain] =
    useState<ViqMainCategory>(undefined);

  const [itemIndexMain, setItemIndexMain] = useState<number>(undefined);

  const [isAdd, setIsAdd] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const dynamicLabels = useDynamicLabels({
    moduleKey:
      DynamicLabelModuleName.ConfigurationCommonVesselinspectionQuestionnaire,
    modulePage: ModulePage.Create,
  });

  const schema = yup.object().shape({
    type: yup
      .string()
      .nullable()
      .trim()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    viqVesselType: yup
      .string()
      .nullable()
      .trim()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
    udfVersionNo: yup
      .string()
      .nullable()
      .trim()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      ),
  });

  const { errorList, loading } = useSelector((state) => state.viq);

  const subCategoryList = useMemo(() => {
    const dataResult = [];
    mainCategories?.forEach((mainItem) => {
      mainItem?.viqSubCategories?.forEach((subItem) => {
        if (!subItem?.parentId) {
          dataResult.push(subItem);
        }
      });
    });

    return dataResult;
  }, [mainCategories]);

  const isNeedAtLeast = useMemo(() => {
    if (mainCategories && mainCategories.length) {
      // eslint-disable-next-line no-restricted-syntax
      for (const element of mainCategories) {
        if (!element?.viqSubCategories?.length) {
          return true;
        }
      }
    }
    setMessageError('');
    return false;
  }, [mainCategories]);

  const {
    control,
    handleSubmit,
    setError,
    reset,
    getValues,
    setValue,
    formState: { errors, isSubmitted },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues,
    resolver: yupResolver(schema),
  });

  // Reset form

  const resetForm = () => {
    setValue('type', null);
    setValue('status', 'active');
    setValue('viqVesselType', null);
    setValue('udfVersionNo', '');
    setError('type', { message: '' });
    setError('viqVesselType', { message: '' });
    setError('udfVersionNo', { message: '' });
    setMainCategories([]);
  };

  const handleEdit = (dataValue, index, type: ModalType) => {
    switch (type) {
      case ModalType.MAIN:
        setItemSelectedMain(dataValue);
        setItemIndexMain(index);
        break;
      default:
        setItemSelectedSub(dataValue);
        break;
    }
    setIsAdd(false);
    setModal(type);
  };

  const handleHiddenModal = () => {
    setModal(ModalType.HIDDEN);
    setIsAdd(true);
    setItemSelectedMain(undefined);
    setItemSelectedSub(undefined);
  };

  // DELETE

  const handleDeleteMainCategory = (mainIndex: number) => {
    showConfirmBase({
      isDelete: true,
      txTitle: renderDynamicLabel(dynamicLabels, VIQ_FIELDS_LIST['Delete?']),
      txMsg: renderDynamicLabel(
        dynamicLabels,
        VIQ_FIELDS_LIST[
          'Are you sure you want to delete this record? This action cannot be undone and you will not be able to recover any data.'
        ],
      ),
      txButtonLeft: renderDynamicLabel(
        dynamicLabels,
        COMMON_DYNAMIC_FIELDS.Cancel,
      ),
      txButtonRight: renderDynamicLabel(
        dynamicLabels,
        COMMON_DYNAMIC_FIELDS.Delete,
      ),
      onPressButtonRight: () => {
        setMainCategories((prevState) =>
          prevState.filter((item, index) => index !== mainIndex),
        );
      },
    });
  };

  const handleDeleteSubCategory = (indexMain: number, indexOfSub: number) => {
    showConfirmBase({
      isDelete: true,
      txTitle: renderDynamicLabel(dynamicLabels, VIQ_FIELDS_LIST['Delete?']),
      txMsg: renderDynamicLabel(
        dynamicLabels,
        VIQ_FIELDS_LIST[
          'Are you sure you want to delete this record? This action cannot be undone and you will not be able to recover any data.'
        ],
      ),
      onPressButtonRight: () => {
        const newState = [...mainCategories].map((mainItem, index) => {
          if (index === indexMain) {
            const newSubList = mainItem.viqSubCategories.filter(
              (subItem, subIndex) => indexOfSub !== subIndex,
            );
            return { ...mainItem, viqSubCategories: newSubList };
          }
          return mainItem;
        });

        setMainCategories(newState);
      },
      txButtonLeft: renderDynamicLabel(
        dynamicLabels,
        COMMON_DYNAMIC_FIELDS.Cancel,
      ),
      txButtonRight: renderDynamicLabel(
        dynamicLabels,
        COMMON_DYNAMIC_FIELDS.Delete,
      ),
    });
  };

  const handleDeleteSecondSubCategory = (
    indexMain: number,
    indexOfSub: number,
    indexOfSecond: number,
  ) => {
    showConfirmBase({
      isDelete: true,
      txTitle: renderDynamicLabel(dynamicLabels, VIQ_FIELDS_LIST['Delete?']),
      txMsg: renderDynamicLabel(
        dynamicLabels,
        VIQ_FIELDS_LIST[
          'Are you sure you want to delete this record? This action cannot be undone and you will not be able to recover any data.'
        ],
      ),
      onPressButtonRight: () => {
        const newState = [...mainCategories];
        const newSecondList = newState[indexMain]?.viqSubCategories[
          indexOfSub
        ]?.children?.filter((item, index) => index !== indexOfSecond);
        if (newState[indexMain]?.viqSubCategories[indexOfSub]) {
          newState[indexMain].viqSubCategories[indexOfSub].children =
            newSecondList;
        }
        setMainCategories(newState);
      },
      txButtonLeft: renderDynamicLabel(
        dynamicLabels,
        COMMON_DYNAMIC_FIELDS.Cancel,
      ),
      txButtonRight: renderDynamicLabel(
        dynamicLabels,
        COMMON_DYNAMIC_FIELDS.Delete,
      ),
    });
  };

  // SUBMIT

  const handleSubmitMainModal = (data, indexMain, isAdd) => {
    const dateTime = new Date();
    if (isAdd) {
      const newState = [{ ...data, dateTime }];
      [...mainCategories].forEach((item) => {
        newState.push(item);
      });

      setMainCategories(newState);
    } else {
      const newState = [...mainCategories].map((mainItem, index) => {
        const newData =
          index === indexMain
            ? {
                ...mainItem,
                mainCategoryNo: data.mainCategoryNo,
                mainCategoryName: data.mainCategoryName,
                dateTime,
              }
            : mainItem;
        return newData;
      });
      setMainCategories(newState);
    }
  };

  const handleSubmitSubModal = (
    dataForm,
    isAdd: boolean,
    indexOfMain: string,
    indexOfSub?: number,
  ) => {
    const { mainCategoryName, ...params } = dataForm;
    const dateTime = new Date();
    if (isAdd) {
      // create
      const newState = [...mainCategories].map((mainItem, mainIndex) => {
        const viqSubList = mainItem?.viqSubCategories?.length
          ? [...mainItem?.viqSubCategories]
          : [];
        const newArraySub =
          Number(indexOfMain) === mainIndex
            ? [...viqSubList, { ...params, id: v4(), isNew: true, dateTime }]
            : [...viqSubList];

        return {
          ...mainItem,
          viqSubCategories: newArraySub,
        };
      });
      setMainCategories([...newState]);
    } else {
      // edit
      const newState = [...mainCategories].map((mainItem, mainIndex) => {
        const viqSubList = mainItem?.viqSubCategories?.length
          ? [...mainItem?.viqSubCategories]
          : [];
        const newSubList = viqSubList.map((subItem, subIndex) => {
          if (subItem.id === itemSelectedSub.id) {
            return {
              ...subItem,
              subCategoryName: params.subCategoryName,
              subRefNo: params.subRefNo,
              potentialRiskId: params.potentialRiskId,
              question: params.question,
              guidance: params.guidance,
            };
          }
          return subItem;
        });

        return {
          ...mainItem,
          viqSubCategories: newSubList,
        };
      });

      setMainCategories([...newState]);
    }
  };

  const handleSubmitSecondSubModal = (
    dataForm,
    isAdd: boolean,
    selectedData?: VIQSubExtend,
  ) => {
    const { mainCategoryName, subCategoryName, ...other } = dataForm;
    const dateTime = new Date();

    const params = {
      ...other,
      subCategoryName: other.secondSubCategoryName,
      subRefNo: other.secondSubRefNo,
      dateTime,
    };
    if (isAdd) {
      const newState = [...mainCategories].map((mainItem, mainIndex) => {
        const viqSub = mainItem?.viqSubCategories?.map((subItem) => {
          if (
            subItem.id === subCategoryName &&
            mainCategoryName === mainItem.mainCategoryName
          ) {
            const viqSecondSubList = subItem?.children?.length
              ? [...subItem?.children]
              : [];
            const newArraySecondSub =
              subCategoryName === subItem.id
                ? [...viqSecondSubList, params]
                : [...viqSecondSubList];
            return { ...subItem, children: newArraySecondSub };
          }
          return subItem;
        });

        return {
          ...mainItem,
          viqSubCategories: viqSub,
        };
      });

      setMainCategories([...newState]);
    } else {
      const newState = [...mainCategories];
      const { mainIndex, subIndex, secondSubIndex } = selectedData;
      let dataEdit =
        newState[mainIndex]?.viqSubCategories[subIndex]?.children[
          secondSubIndex
        ];
      dataEdit = {
        ...dataEdit,
        subCategoryName: dataForm.secondSubCategoryName,
        subRefNo: dataForm.secondSubRefNo,
        potentialRiskId: dataForm.potentialRiskId,
        question: dataForm.question,
        guidance: dataForm.guidance,
      };

      if (
        newState[mainIndex]?.viqSubCategories[subIndex]?.children[
          secondSubIndex
        ]
      ) {
        newState[mainIndex].viqSubCategories[subIndex].children[
          secondSubIndex
        ] = dataEdit;
      }

      setMainCategories(newState);
    }
  };

  const formatViq = (mainCategories: ViqMainCategory[]) => {
    const result = mainCategories?.map((mainItem) => {
      let mainCategory = {};
      const { mainCategoryName, mainCategoryNo, id, viqSubCategories } =
        mainItem;
      const listSub = [];
      if (viqSubCategories?.length) {
        viqSubCategories?.forEach((subItem) => {
          const {
            subCategoryName,
            subRefNo,
            id,
            children,
            potentialRiskId,
            question,
            guidance,
            isNew,
          } = subItem;
          let subCategory = {};
          const listSecond = [];
          if (children?.length) {
            children?.forEach((item) => {
              const {
                id,
                subCategoryName,
                subRefNo,
                children,
                potentialRiskId,
                question,
                guidance,
              } = item;
              let secondData = {};
              secondData = {
                ...secondData,
                subCategoryName,
                subRefNo,
                children,
                potentialRiskId,
                question,
              };
              if (guidance) {
                secondData = {
                  ...secondData,
                  guidance,
                };
              }
              if (id) {
                secondData = { ...secondData, id };
              }
              listSecond.push(secondData);
            });
          }
          subCategory = {
            ...subCategory,
            children: listSecond,
            subCategoryName,
            subRefNo,
            potentialRiskId,
            question,
          };
          if (guidance) {
            subCategory = {
              ...subCategory,
              guidance,
            };
          }
          if (id && !isNew) {
            subCategory = { ...subCategory, id };
          }
          listSub.push(subCategory);
        });
      }
      mainCategory = {
        ...mainCategory,
        viqSubCategories: listSub,
        mainCategoryName,
        mainCategoryNo,
      };
      if (id) {
        mainCategory = { ...mainCategory, id };
      }
      return mainCategory;
    });

    return result;
  };

  const onSubmitForm = (dataForm) => {
    if (!mainCategories?.length) {
      return setModal(ModalType.ERROR);
    }
    // WITH INTENTION: for readability
    // eslint-disable-next-line no-restricted-syntax
    for (const element of mainCategories) {
      if (!element?.viqSubCategories?.length) {
        return setMessageError(
          renderDynamicLabel(
            dynamicLabels,
            VIQ_FIELDS_DETAILS[
              'You need at least one subcategory and question in main category'
            ],
          ),
        );
      }
    }

    if (!subCategoryList.length) {
      return setModal(ModalType.ERROR);
    }
    const mainCategoriesData = formatViq(mainCategories);
    onSubmit({
      ...dataForm,
      viqMainCategories: mainCategoriesData,
    });
    return null;
  };

  const onSubmitFormNew = (dataForm) => {
    if (!mainCategories?.length) {
      return setModal(ModalType.ERROR);
    }
    // WITH INTENTION: for readability
    // eslint-disable-next-line no-restricted-syntax
    for (const element of mainCategories) {
      if (!element?.viqSubCategories?.length) {
        return setMessageError(
          renderDynamicLabel(
            dynamicLabels,
            VIQ_FIELDS_DETAILS[
              'You need at least one subcategory and question in main category'
            ],
          ),
        );
      }
    }

    if (!subCategoryList.length) {
      return setModal(ModalType.ERROR);
    }
    const mainCategoriesData = formatViq(mainCategories);
    onSubmit({
      ...dataForm,
      viqMainCategories: mainCategoriesData,
      isNew: true,
      resetForm,
    });
    return null;
  };

  // EXIT CANCEL

  const resetDefault = (defaultParams) => {
    const { udfVersionNo, viqVesselType, type, status, viqMainCategories } =
      defaultParams;
    reset({ udfVersionNo, viqVesselType, type, status });
    setMainCategories(viqMainCategories);
    history.goBack();
  };

  const handleCancel = () => {
    let defaultParams = {};
    const params = {
      ...getValues(),
      viqMainCategories: formatViq(mainCategories) || [],
    };
    const viqMain = formatViq(data?.viqMainCategories) || [];
    if (isCreate) {
      defaultParams = { ...defaultValues, viqMainCategories: [] };
    } else {
      defaultParams = {
        udfVersionNo: data.udfVersionNo,
        viqVesselType: data.viqVesselType,
        type: data.type,
        status: data.status,
        viqMainCategories: viqMain,
      };
    }

    if (isEqual(defaultParams, params)) {
      if (isCreate) {
        history.push(AppRouteConst.VIQ);
      } else {
        history.goBack();
      }
    } else {
      showConfirmBase({
        isDelete: false,
        txTitle: renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Confirmation?'],
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
          if (isCreate) {
            history.push(AppRouteConst.VIQ);
          } else {
            resetDefault(defaultParams);
          }
        },
      });
    }
  };

  useEffect(() => {
    if (data) {
      setValue('type', data.type);
      setValue('udfVersionNo', data.udfVersionNo);
      setValue('viqVesselType', data.viqVesselType);
      setValue('status', data.status);
      setMainCategories(data.viqMainCategories);
    }
    dispatch(getListPotentialRiskActions.request());
    return () => {
      dispatch(clearVIQErrorsReducer());
    };
  }, [data, dispatch, setValue]);

  useEffect(() => {
    if (errorList?.length) {
      errorList.forEach((item) => {
        switch (item.fieldName) {
          case 'type':
            setError('type', { message: item.message });
            break;
          case 'viqVesselType':
            setError('viqVesselType', { message: item.message });
            break;
          case 'udfVersionNo':
            setError('udfVersionNo', { message: item.message });
            break;
          default:
            break;
        }
      });
    } else {
      setError('type', { message: '' });
      setError('viqVesselType', { message: '' });
      setError('udfVersionNo', { message: '' });
    }
  }, [errorList, setError]);

  useEffect(() => {
    const doesErrorOccur =
      Object.entries(errors)?.some((error) => error[1]?.message !== '') ||
      false;

    if (doesErrorOccur) {
      containerRef.current.scrollIntoView({
        behavior: 'smooth',
      });
      return;
    }

    if (errorList?.length !== 0) {
      containerRef.current.scrollIntoView({
        behavior: 'smooth',
      });
    }
  }, [errorList, errors]);

  return loading && !isCreate ? (
    <div className="d-flex justify-content-center">
      <img
        src={images.common.loading}
        className={styles.loading}
        alt="loading"
      />
    </div>
  ) : (
    <Container>
      <div className="pb-4" ref={containerRef}>
        <div className={cx('container__subtitle', 'mb-2')}>
          {renderDynamicLabel(
            dynamicLabels,
            VIQ_FIELDS_DETAILS['VIQ information'],
          )}
        </div>
        <Row className="mx-0">
          <Col className={cx('p-0 me-3')}>
            <SelectUI
              labelSelect={renderDynamicLabel(
                dynamicLabels,
                VIQ_FIELDS_DETAILS.Type,
              )}
              isRequired
              data={optionTypes}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['Please select'],
              )}
              disabled={!isEdit}
              name="type"
              className={cx(styles.inputSelect, 'w-100')}
              control={control}
              messageRequired={errors?.type?.message || ''}
            />
          </Col>
          <Col className={cx('p-0 mx-3')}>
            <SelectUI
              isRequired
              labelSelect={renderDynamicLabel(
                dynamicLabels,
                VIQ_FIELDS_DETAILS['VIQ vessel type'],
              )}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['Please select'],
              )}
              data={optionVIQVesselTypes}
              disabled={!isEdit}
              name="viqVesselType"
              className={cx(styles.inputSelect, 'w-100')}
              control={control}
              messageRequired={errors?.viqVesselType?.message || ''}
            />
          </Col>
          <Col className={cx('p-0 mx-3')}>
            <InputForm
              label={renderDynamicLabel(
                dynamicLabels,
                VIQ_FIELDS_DETAILS['User defined version no.'],
              )}
              disabled={!isEdit}
              isRequired
              messageRequired={errors?.udfVersionNo?.message || ''}
              maxLength={20}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                VIQ_FIELDS_DETAILS['Enter user defined version no.'],
              )}
              patternValidate={REGEXP_INPUT_NUMBER}
              control={control}
              name="udfVersionNo"
            />
          </Col>
          <Col className={cx('p-0 ms-3')}>
            <SelectUI
              labelSelect={renderDynamicLabel(
                dynamicLabels,
                VIQ_FIELDS_DETAILS.Status,
              )}
              data={statusOptions}
              disabled={!isEdit}
              name="status"
              className={cx(styles.inputSelect, 'w-100')}
              control={control}
              messageRequired={errors?.status?.message || ''}
            />
          </Col>
        </Row>

        <div className="d-flex justify-content-between align-items-center py-2">
          <div className={cx(styles.headerText)}>
            {renderDynamicLabel(
              dynamicLabels,
              VIQ_FIELDS_DETAILS['VIQ main category'],
            )}
            <img
              src={images.icons.icRequiredAsterisk}
              alt="required"
              className={cx(styles.requiredImg)}
            />
          </div>

          {isEdit && (
            <Button
              buttonSize={ButtonSize.Medium}
              renderSuffix={
                <img
                  src={images.icons.icAddCircle}
                  className="ps-1"
                  alt="plus"
                />
              }
              disabled={!isEdit}
              disabledCss={!isEdit}
              className={cx(styles.buttonAdd)}
              onClick={() => {
                setModal(ModalType.MAIN);
                setItemSelectedMain(undefined);
                setItemSelectedSub(undefined);
                setIsAdd(true);
              }}
            >
              {renderDynamicLabel(
                dynamicLabels,
                VIQ_FIELDS_DETAILS['Add More'],
              )}
            </Button>
          )}
        </div>
        {!mainCategories.length && isSubmitted && (
          <div className="message-required mb-2">
            {renderDynamicLabel(
              dynamicLabels,
              VIQ_FIELDS_DETAILS['This field is required'],
            )}
          </div>
        )}
        <TableMain
          data={mainCategories}
          onDelete={handleDeleteMainCategory}
          loading={
            // eslint-disable-next-line valid-typeof
            typeof mainCategories === undefined ? undefined : !mainCategories
          }
          isEdit={isEdit}
          onEdit={(mainCategories, indexMain) =>
            handleEdit(mainCategories, indexMain, ModalType.MAIN)
          }
          dynamicLabels={dynamicLabels}
        />
        {isSubmitted && isNeedAtLeast && messageError && (
          <div className={cx(styles.messageError)}>{messageError}</div>
        )}

        <div className="d-flex justify-content-between align-items-center py-2">
          <div className={cx(styles.headerText)}>
            {renderDynamicLabel(
              dynamicLabels,
              VIQ_FIELDS_DETAILS['VIQ sub category'],
            )}
            <img
              src={images.icons.icRequiredAsterisk}
              alt="required"
              className={cx(styles.requiredImg)}
            />
          </div>
          <div className="">
            {isEdit && (
              <Button
                buttonSize={ButtonSize.Medium}
                renderSuffix={
                  <img
                    src={images.icons.icAddCircle}
                    className="ps-1"
                    alt="plus"
                  />
                }
                className={cx(styles.buttonAdd, {
                  [styles.disableBtn]: !mainCategories?.length,
                })}
                disabled={!mainCategories?.length}
                disabledCss={!mainCategories?.length}
                onClick={() => {
                  setModal(ModalType.SUB);
                  setIsAdd(true);
                  setItemSelectedMain(undefined);
                  setItemSelectedSub(undefined);
                }}
              >
                {renderDynamicLabel(
                  dynamicLabels,
                  VIQ_FIELDS_DETAILS['Add More'],
                )}
              </Button>
            )}
          </div>
        </div>
        {!mainCategories.length && isSubmitted && (
          <div className="message-required mb-2">
            {renderDynamicLabel(
              dynamicLabels,
              VIQ_FIELDS_DETAILS['This field is required'],
            )}
          </div>
        )}
        <TableSub
          dataDetail={mainCategories}
          onDelete={handleDeleteSubCategory}
          isEdit={isEdit}
          loading={
            // eslint-disable-next-line valid-typeof
            typeof mainCategories === undefined ? undefined : !mainCategories
          }
          onEdit={(data: VIQSubExtend) =>
            handleEdit(data, data.subIndex, ModalType.SUB)
          }
        />

        <div className="d-flex justify-content-between align-items-center py-2">
          <div className={cx(styles.headerText)}>
            {renderDynamicLabel(
              dynamicLabels,
              VIQ_FIELDS_DETAILS['VIQ second sub category'],
            )}
          </div>
          {isEdit && (
            <Button
              buttonSize={ButtonSize.Medium}
              renderSuffix={
                <img
                  src={images.icons.icAddCircle}
                  className="ps-1"
                  alt="plus"
                />
              }
              className={cx(styles.buttonAdd, {
                [styles.disableBtn]:
                  !mainCategories?.length || !subCategoryList?.length,
              })}
              disabled={!mainCategories?.length || !subCategoryList?.length}
              disabledCss={!mainCategories?.length || !subCategoryList?.length}
              onClick={() => {
                setModal(ModalType.SECOND_SUB);
                setIsAdd(true);
                setItemSelectedMain(undefined);
                setItemSelectedSub(undefined);
              }}
            >
              {renderDynamicLabel(
                dynamicLabels,
                VIQ_FIELDS_DETAILS['Add More'],
              )}
            </Button>
          )}
        </div>
        <TableSecondSub
          dataDetail={mainCategories}
          isEdit={isEdit}
          onDelete={handleDeleteSecondSubCategory}
          loading={
            // eslint-disable-next-line valid-typeof
            typeof mainCategories === undefined ? undefined : !mainCategories
          }
          onEdit={(data: VIQSubExtend) =>
            handleEdit(data, data.subIndex, ModalType.SECOND_SUB)
          }
        />

        <ModalMainCateGory
          isOpen={modal === ModalType.MAIN}
          isAdd={isAdd}
          mainIndex={itemIndexMain}
          data={mainCategories}
          selectedData={itemSelectedMain}
          title={
            isAdd
              ? renderDynamicLabel(
                  dynamicLabels,
                  VIQ_FIELDS_DETAILS['Add main category'],
                )
              : renderDynamicLabel(
                  dynamicLabels,
                  VIQ_FIELDS_DETAILS['Edit main category'],
                )
          }
          onSubmit={handleSubmitMainModal}
          toggle={handleHiddenModal}
          dynamicLabels={dynamicLabels}
        />
        <ModalSubCateGory
          isOpen={modal === ModalType.SUB}
          data={mainCategories}
          selectedData={itemSelectedSub}
          isAdd={isAdd}
          title={
            isAdd
              ? renderDynamicLabel(
                  dynamicLabels,
                  VIQ_FIELDS_DETAILS['Add sub category'],
                )
              : renderDynamicLabel(
                  dynamicLabels,
                  VIQ_FIELDS_DETAILS['Edit sub category'],
                )
          }
          onSubmit={handleSubmitSubModal}
          toggle={handleHiddenModal}
          dynamicLabels={dynamicLabels}
        />
        <ModalSecondSubCateGory
          isOpen={modal === ModalType.SECOND_SUB}
          isEdit
          data={mainCategories}
          selectedData={itemSelectedSub}
          isAdd={isAdd}
          onSubmit={handleSubmitSecondSubModal}
          title={
            isAdd
              ? renderDynamicLabel(
                  dynamicLabels,
                  VIQ_FIELDS_DETAILS['Add second sub category'],
                )
              : renderDynamicLabel(
                  dynamicLabels,
                  VIQ_FIELDS_DETAILS['Edit second sub category'],
                )
          }
          toggle={handleHiddenModal}
          dynamicLabels={dynamicLabels}
        />
      </div>
      {isEdit && (
        <GroupButton
          className={cx(styles.GroupButton, 'px-4')}
          handleCancel={handleCancel}
          handleSubmit={handleSubmit(onSubmitForm)}
          handleSubmitAndNew={
            isCreate ? handleSubmit(onSubmitFormNew) : undefined
          }
          disable={!isEdit}
          dynamicLabels={dynamicLabels}
        />
      )}
    </Container>
  );
};

export default VIQForm;
