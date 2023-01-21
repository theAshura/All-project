import {
  useMemo,
  memo,
  FC,
  useEffect,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react';
import { v4 } from 'uuid';
import { FieldValues, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import cx from 'classnames';
import Row from 'antd/lib/row';
import Col from 'antd/lib/col';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation, useParams } from 'react-router';

import Input from 'components/ui/input/Input';
import SelectUI from 'components/ui/select/Select';
import LabelUI from 'components/ui/label/LabelUI';
import {
  LanguageEnum,
  ModuleInfoDefaultValue,
  ModuleInfoDefaultSchema,
} from 'constants/module-configuration.cons';
import TextAreaForm from 'components/react-hook-form/text-area/TextAreaForm';
import {
  getDetailModuleConfigurationActions,
  updateDetailModuleConfigurationActions,
} from 'store/module-configuration/module-configuration.action';
import { ModuleInfoValue } from 'models/store/module-configuration/module-configuration.model';
import { AppRouteConst } from 'constants/route.const';

import Button, { ButtonType } from 'components/ui/button/Button';
import history from 'helpers/history.helper';
import styles from './styles/module-form.module.scss';
import listStyle from '../../../../components/list-common.module.scss';

interface ModuleFormProps {
  isModeEdit: boolean;
  setLanguage: Dispatch<SetStateAction<LanguageEnum>>;
  language: LanguageEnum;
}

interface ParamsType {
  id: string;
  companyId: string;
}

const ModuleForm: FC<ModuleFormProps> = ({
  isModeEdit,
  setLanguage,
  language,
}) => {
  const uniqueId = useMemo(() => v4(), []);
  const dispatch = useDispatch();
  const { search } = useLocation();
  const { companyId, id } = useParams<ParamsType>();

  const { selectedModule, moduleDetail, loading } = useSelector(
    (store) => store.moduleConfiguration,
  );
  const {
    register,
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'onChange',
    defaultValues: ModuleInfoDefaultValue,
    resolver: yupResolver(ModuleInfoDefaultSchema),
  });

  const languageWatch = watch('language');

  const onSubmitUpdate = useCallback(
    (value: ModuleInfoValue) => {
      if (moduleDetail) {
        dispatch(
          updateDetailModuleConfigurationActions.request({
            id: moduleDetail.id,
            userDefinedLabel: value.definedLabel,
            language: value.language,
            description: value.description,
            companyId,
            onSuccess: (id: string) => {
              if (id) {
                history.push(
                  `${AppRouteConst.getModuleConfigurationDetailById(
                    id,
                    companyId,
                  )}${search}`,
                );
              }
            },
          }),
        );
      }
    },
    [companyId, dispatch, moduleDetail, search],
  );

  useEffect(() => {
    if (selectedModule && language && companyId && id) {
      dispatch(
        getDetailModuleConfigurationActions.request({
          key: selectedModule.key,
          lang: language,
          companyId,
        }),
      );
    }
  }, [companyId, dispatch, id, language, selectedModule]);

  useEffect(() => {
    if (moduleDetail) {
      setValue('language', moduleDetail.language as LanguageEnum);
      setValue('defaultLabel', moduleDetail.defaultLabel);
      setValue('definedLabel', moduleDetail.userDefinedLabel);
      setValue('description', moduleDetail.description);
      setLanguage(moduleDetail.language as LanguageEnum);
    }
  }, [moduleDetail, setLanguage, setValue]);

  useEffect(() => {
    setLanguage(languageWatch);
  }, [languageWatch, setLanguage]);

  return (
    <div key={uniqueId}>
      <div className={styles.basicContainer}>
        <p className={cx(styles.labelStyle)}>Chosen language</p>
        <SelectUI
          labelSelect="Chosen language"
          isRequired
          data={[
            {
              label: 'English',
              value: LanguageEnum.ENGLISH,
            },
          ]}
          control={control}
          name="language"
          disabled
          className={cx(styles.inputSelect)}
          styleLabel={cx(styles.labelSelectStyle)}
        />
      </div>

      <div className={cx(styles.basicContainer, 'mt-3')}>
        <p className={cx(styles.labelStyle)}>Module Information</p>
        <Row gutter={[16, 0]}>
          <Col span={12}>
            <Input
              readOnly
              {...register('defaultLabel')}
              label="Module default label"
              isRequired
              className={cx('cssDisabled', styles.disableInput)}
              styleLabel={cx(styles.labelSelectStyle)}
            />
          </Col>
          <Col span={12}>
            <Input
              {...register('definedLabel')}
              label="User defined label for module"
              isRequired
              disabled={!isModeEdit}
              styleLabel={cx(styles.labelSelectStyle)}
              messageRequired={errors?.definedLabel?.message}
            />
          </Col>
          <Col span={24} className="mt-3">
            <LabelUI label="Description" className="mb-2" />
            <TextAreaForm
              control={control}
              name="description"
              disabled={!isModeEdit}
            />
          </Col>
          {isModeEdit && (
            <>
              <Col span={24} className={cx(styles.btnGroupContainer, 'mt-5')}>
                <Button
                  className={cx(
                    'me-3',
                    listStyle.buttonFilter,
                    styles.PaddingBlock15,
                  )}
                  buttonType={ButtonType.CancelOutline}
                  onClick={() =>
                    history.push(
                      `${AppRouteConst.getModuleConfigurationDetailById(
                        id,
                        companyId,
                      )}?view`,
                    )
                  }
                >
                  <span>Cancel</span>
                </Button>
                <Button
                  className={cx(listStyle.buttonFilter, styles.PaddingBlock15)}
                  buttonType={ButtonType.Primary}
                  onClick={handleSubmit(onSubmitUpdate)}
                  loading={loading}
                >
                  <span>Save</span>
                </Button>
              </Col>
            </>
          )}
        </Row>
      </div>
    </div>
  );
};

export default memo(ModuleForm);
