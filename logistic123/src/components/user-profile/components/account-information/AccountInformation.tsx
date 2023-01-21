import {
  useState,
  useContext,
  useMemo,
  useRef,
  useEffect,
  useCallback,
  FC,
} from 'react';
import images from 'assets/images/images';
import cx from 'classnames';
import { AppRouteConst } from 'constants/route.const';
import { getListChildCompanyApi } from 'api/company.api';
import jwt_decode from 'jwt-decode';
import {
  StatusPage,
  TabName,
  UserContext,
} from 'contexts/user-profile/UserContext';
import Button, { ButtonSize, ButtonType } from 'components/ui/button/Button';
import useEffectOnce from 'hoc/useEffectOnce';
import { DateTimePicker } from 'components/ui/datepicker/Datepicker';
import Input from 'components/ui/input/Input';
import SelectUI from 'components/ui/select/Select';
import moment from 'moment';
import { toastError } from 'helpers/notification.helper';
import { Col, Row } from 'reactstrap';
import { useDispatch, useSelector } from 'react-redux';
import { RoleScope } from 'constants/roleAndPermission.const';
import { useFormContext } from 'react-hook-form';
import Container from 'components/common/container/Container';
import history from 'helpers/history.helper';

import {
  getCountryActions,
  getProvinceActions,
  uploadFileActions,
  getListUserActions,
  getChildrenCompanyActions,
} from 'store/user/user.action';
import AsyncSelectForm from 'components/react-hook-form/async-select/AsyncSelectForm';
import { USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS } from 'constants/dynamic/userManagement.const';
import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { IDynamicLabel } from 'models/api/dynamic/dynamic.model';
import InputForm from 'components/react-hook-form/input-form/InputForm';
import ModalConfirm from 'components/role/modal/ModalConfirm';
import { REGEXP_INPUT_PHONE_NUMBER } from 'constants/regExpValidate.const';
import isEmpty from 'lodash/isEmpty';
import { validateUserManagementDetailApi } from 'api/user.api';
// import { getListCompanyActions } from 'store/fleet/fleet.action';
import styles from './account-information.module.scss';
// import SwitchView from '../../../user/components/switch-view/SwitchView';
import {
  NewAsyncOptions,
  OptionProps,
} from '../../../ui/async-select/NewAsyncSelect';

// interface OptionSelect {
//   value: string;
//   label: string;
// }

interface AccountInformationProps {
  onSubmit?: (data) => void;
  dynamicLabels?: IDynamicLabel;
}

const AccountInformation: FC<AccountInformationProps> = ({
  onSubmit,
  dynamicLabels,
}) => {
  const { statusPage, activeTabs } = useContext(UserContext);

  const {
    disable,
    listCountry,
    listProvince,
    userDetailResponse,
    listUser,
    avatar,
  } = useSelector((state) => state.user);

  const dispatch = useDispatch();
  // const { listCompany } = useSelector((state) => state.fleet);
  const { userInfo } = useSelector((state) => state.authenticate);
  const { listChildrenCompany, disable: disableUserState } = useSelector(
    (state) => state.user,
  );

  const [modal, setModal] = useState(false);
  const [touchedFields, setTouchedFields] = useState<any>({});
  const uploadFile = useRef(null);

  const {
    register,
    control,
    watch,
    handleSubmit,
    setError,
    clearErrors,
    setValue,
    formState: { errors },
  } = useFormContext();

  const watchCountry = watch('accountInformation.country');
  const watchCompany = watch('accountInformation.companyId');
  const watchPhoneNumber = watch('accountInformation.phoneNumber');

  const nationalityOptionProps: OptionProps[] = useMemo(
    () =>
      listCountry.map((item) => ({
        value: item?.nationality || '',
        label: item?.nationality || '',
        selected: false,
      })),
    [listCountry],
  );
  const countryOptionProps: NewAsyncOptions[] = useMemo(
    () =>
      listCountry.map((item) => ({
        value: item?.name || '',
        label: item?.name || '',
        image: item?.flagImg || '',
      })),
    [listCountry],
  );

  const provinceOptionProps: NewAsyncOptions[] = useMemo(
    () =>
      listProvince.map((item) => ({
        value: item?.name || '',
        label: item?.name || '',
      })),
    [listProvince],
  );

  useEffect(() => {
    if (watchPhoneNumber?.length >= 1 && watchPhoneNumber?.length < 5) {
      setError('phone', {
        message: renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS[
            'Minimum length is 5 characters'
          ],
        ),
      });
    } else if (watchPhoneNumber?.length > 15) {
      setError('phone', {
        message: renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS[
            'Maximum length is 15 characters'
          ],
        ),
      });
    } else {
      clearErrors('phone');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchPhoneNumber]);

  // Function

  const onChangeFile = useCallback(
    (event) => {
      const { files } = event.target;
      const typeFile: string[] = (files && files[0]?.type?.split('/')) || [];
      const formDataImages = new FormData();
      formDataImages.append('files', files[0]);
      formDataImages.append('fileType', 'image');
      formDataImages.append('prefix', 'avatars');
      if (
        typeFile[0] === 'image' &&
        files[0]?.size < 5242881 &&
        (typeFile[1] === 'jpg' ||
          typeFile[1] === 'png' ||
          typeFile[1] === 'jpeg')
      ) {
        dispatch(uploadFileActions.request(formDataImages));
        return null;
      }

      if (
        typeFile[0] === 'image' &&
        files[0]?.size > 5242880 &&
        (typeFile[1] === 'jpg' ||
          typeFile[1] === 'png' ||
          typeFile[1] === 'jpeg')
      ) {
        // toastError('Please choose your avatar image that size is up to 3MB');
        toastError(
          `This specified file ${
            files[0]?.name
          } could not be uploaded. The file is ${
            // eslint-disable-next-line no-restricted-properties
            files[0]?.size / Math.pow(2, 20)
          } exceeding the maximum file size of 5 MB`,
        );
        return null;
      }
      if (files[0]?.size > 1) {
        toastError('This type is not supported');
      }
      return null;
    },
    [dispatch],
  );

  const handleSubmitFn = useCallback(
    (dataForm) => {
      onSubmit({
        ...dataForm,
      });
    },
    [onSubmit],
  );

  const onBlurEmail = useCallback(
    (event) => {
      if (event.target.value) {
        const params = userDetailResponse?.id
          ? {
              id: userDetailResponse?.id,
              email: event.target.value,
            }
          : { email: event.target.value };

        validateUserManagementDetailApi({ data: params })
          .then((res) => {
            clearErrors('accountInformation.email');
          })
          .catch((e) => {
            setError('accountInformation.email', {
              message: renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Email is existed'],
              ),
            });
          });
      }
    },
    [clearErrors, dynamicLabels, setError, userDetailResponse?.id],
  );

  const onChangeSearchStateOrProvince = useCallback(
    (value: string) =>
      dispatch(
        getProvinceActions.request({
          countryId: watch('accountInformation.country')?.[0]?.value || '',
          data: { content: value },
        }),
      ),
    [dispatch, watch],
  );

  // EFFECT

  useEffect(() => {
    if (!listUser) {
      dispatch(getListUserActions.request({}));
    }
  }, [dispatch, listUser]);

  useEffectOnce(() => {
    if (RoleScope.User === userInfo.roleScope) {
      const userInfoToken: any = jwt_decode(userInfo?.token);
      setValue(
        'accountInformation.parentCompanyId',
        userInfo?.mainCompanyId || null,
      );
      setValue(
        'accountInformation.companyId',
        userInfoToken?.explicitCompanyId || null,
      );
    }
    if (RoleScope.Admin === userInfo.roleScope) {
      setValue('accountInformation.parentCompanyId', userInfo?.mainCompanyId);
    }
  });

  const handleGetChildrenCompany = useCallback(async () => {
    setValue('switchableCompanies', null);
    try {
      const listChildrenCompany: any = await getListChildCompanyApi({
        companyId: watchCompany,
        status: 'active',
      });

      dispatch(
        getChildrenCompanyActions.success(listChildrenCompany?.data || []),
      );
    } catch (error) {
      toastError(error);
    }
  }, [dispatch, setValue, watchCompany]);

  useEffect(() => {
    if (watchCompany && touchedFields.company) {
      clearErrors('roles');
      handleGetChildrenCompany();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchCompany]);

  useEffect(() => {
    if (watchCountry && touchedFields.country) {
      setValue('accountInformation.stateOrProvince', '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watchCountry]);

  // const companyOptionProps: OptionSelect[] = useMemo(() => {
  //   if (RoleScope.SuperAdmin === userInfo?.roleScope) {
  //     return listCompany?.data.map((item) => ({
  //       value: item.id,
  //       label: item.name,
  //     }));
  //   }
  //   return [{ value: userInfo?.company?.id, label: userInfo?.company?.name }];
  // }, [
  //   listCompany?.data,
  //   userInfo?.company?.id,
  //   userInfo?.company?.name,
  //   userInfo?.roleScope,
  // ]);

  const renderCompanyForm = useMemo(
    () => (
      <Input
        label={renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Subscription company'],
        )}
        className={cx({ [styles.disabledInput]: true })}
        disabled
        placeholder=""
        value={userInfo?.mainCompany?.name}
        maxLength={128}
      />
    ),
    [dynamicLabels, userInfo?.mainCompany?.name],
  );

  const childCompanyOptions = useMemo(() => {
    if (userInfo.roleScope === RoleScope.SuperAdmin) {
      return [];
    }
    if (userInfo.roleScope === RoleScope.Admin) {
      return listChildrenCompany
        ?.map((i) => ({
          label: i?.name,
          value: i?.id,
        }))
        ?.concat([
          {
            label: userInfo?.mainCompany?.name,
            value: userInfo?.mainCompany?.id,
          },
        ]);
    }

    return [
      {
        label: userInfo?.company?.name,
        value: userInfo?.company?.id,
      },
    ];
  }, [
    listChildrenCompany,
    userInfo?.company?.id,
    userInfo?.company?.name,
    userInfo?.mainCompany?.id,
    userInfo?.mainCompany?.name,
    userInfo.roleScope,
  ]);

  const renderChildCompany = useMemo(() => {
    if (userInfo.roleScope === RoleScope.SuperAdmin) {
      return null;
    }
    return (
      <SelectUI
        disabled
        control={control}
        name="accountInformation.companyId"
        messageRequired={errors?.accountInformation?.companyId?.message}
        labelSelect={renderDynamicLabel(
          dynamicLabels,
          USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['User company'],
        )}
        placeholder={
          statusPage === StatusPage.VIEW
            ? ' '
            : renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['Please select'],
              )
        }
        onChange={(e) => {
          setValue('accountInformation.companyId', e);
          setTouchedFields((prev) => ({
            ...setTouchedFields,
            company: true,
          }));
        }}
        isRequired
        className="w-100"
        data={childCompanyOptions || []}
        dynamicLabels={dynamicLabels}
      />
    );
  }, [
    childCompanyOptions,
    control,
    dynamicLabels,
    errors?.accountInformation?.companyId?.message,
    setValue,
    statusPage,
    userInfo.roleScope,
  ]);

  return (
    <div className={styles.accountInformation}>
      <Container>
        <div className={cx('d-flex align-items-center', styles.card)}>
          <img
            src={avatar?.url || images.common.avatarDefault}
            alt="avatar"
            className={styles.avatar}
          />
          {statusPage !== StatusPage.VIEW && (
            <div className="ps-3">
              <p className={styles.titleUploadFile}>
                {renderDynamicLabel(
                  dynamicLabels,
                  USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Select your avatar'],
                )}
              </p>
              <label htmlFor="file-input">
                <input
                  type="file"
                  ref={uploadFile}
                  accept=".png, .jpg"
                  className={styles.inputFile}
                  onChange={onChangeFile}
                />
                <Button
                  buttonSize={ButtonSize.Small}
                  onClick={() => uploadFile.current.click()}
                >
                  {renderDynamicLabel(
                    dynamicLabels,
                    USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.Browse,
                  )}
                </Button>
              </label>
            </div>
          )}
        </div>
        <Row className="mx-0 pt-2">
          <Col className={cx('p-0 pe-3')} xs={4} md={4}>
            <Input
              maxLength={128}
              label={renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['First name'],
              )}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Enter first name'],
              )}
              isRequired
              {...register('accountInformation.firstName')}
              messageRequired={
                errors?.accountInformation?.firstName?.message || ''
              }
              className="cssDisabled"
              readOnly
            />
          </Col>
          <Col className={cx('p-0 px-3')} xs={4} md={4}>
            <Input
              maxLength={128}
              label={renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Last name'],
              )}
              {...register('accountInformation.lastName')}
              isRequired
              messageRequired={
                errors?.accountInformation?.lastName?.message || ''
              }
              className="cssDisabled"
              placeholder={renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Enter last name'],
              )}
              readOnly
            />
          </Col>
          <Col className={cx('p-0 ps-3')} xs={4} md={4}>
            <Input
              maxLength={128}
              label={renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Job title'],
              )}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Enter job title'],
              )}
              {...register('accountInformation.jobTitle')}
              messageRequired={
                errors?.accountInformation?.jobTitle?.message || ''
              }
              className="cssDisabled"
              isRequired
              readOnly
            />
          </Col>
        </Row>

        <Row className="py-2 mx-0">
          {/* user infor have select when role super Admin */}
          <Col className={cx('p-0 pe-3')} xs={4} md={4}>
            <AsyncSelectForm
              disabled
              labelSelect={renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.Nationality,
              )}
              control={control}
              name="accountInformation.nationality"
              messageRequired={errors?.accountInformation?.nationality?.message}
              titleResults={renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Selected cities'],
              )}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['Please select'],
              )}
              searchContent="Nationality"
              textSelectAll={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['Select all'],
              )}
              textBtnConfirm={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS.Confirm,
              )}
              onChangeSearch={(value: string) =>
                dispatch(getCountryActions.request({ content: value }))
              }
              options={[...nationalityOptionProps]}
              dynamicLabels={dynamicLabels}
            />
          </Col>
          <Col className={cx('p-0 px-3 modal__list-form')} xs={4} md={4}>
            {renderCompanyForm}
          </Col>

          <Col className={cx('p-0 ps-3')} xs={4} md={4}>
            {renderChildCompany}
          </Col>
        </Row>

        <Row className="py-2 mx-0">
          <Col className={cx('p-0 pe-3')} xs={4} md={4}>
            <SelectUI
              disabled
              name="accountInformation.status"
              control={control}
              messageRequired={errors?.accountInformation?.status?.message}
              labelSelect={renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.Status,
              )}
              data={[
                { value: 'active', label: 'Active' },
                { value: 'inactive', label: 'Inactive' },
              ]}
              className="w-100"
            />
          </Col>
          <Col className={cx('p-0 px-3')} xs={4} md={4}>
            <Input
              {...register('accountInformation.email')}
              maxLength={128}
              messageRequired={errors?.accountInformation?.email?.message}
              type="email"
              label={renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.Email,
              )}
              onBlur={onBlurEmail}
              className="cssDisabled"
              placeholder={renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Enter email'],
              )}
              isRequired
              readOnly
            />
          </Col>
          <Col className={cx('p-0 ps-3')} xs={4} md={4}>
            <InputForm
              control={control}
              patternValidate={REGEXP_INPUT_PHONE_NUMBER}
              name="accountInformation.phoneNumber"
              maxLength={15}
              messageRequired={errors?.accountInformation?.phoneNumber?.message}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Enter phone number'],
              )}
              label={renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Phone number'],
              )}
              disabled={statusPage === StatusPage.VIEW}
            />
          </Col>
        </Row>

        <Row className="py-2 mx-0">
          <Col className={cx('p-0 pe-3')} xs={4} md={4}>
            <InputForm
              control={control}
              patternValidate={REGEXP_INPUT_PHONE_NUMBER}
              name="accountInformation.secondaryPhoneNumber"
              maxLength={15}
              messageRequired={
                errors?.accountInformation?.secondaryPhoneNumber?.message
              }
              placeholder={renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS[
                  'Enter secondary phone number'
                ],
              )}
              label={renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Secondary phone number'],
              )}
              disabled={statusPage === StatusPage.VIEW}
            />
          </Col>
          <Col className={cx('p-0 px-3')} xs={4} md={4}>
            <SelectUI
              disabled
              labelSelect={renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.Gender,
              )}
              data={[
                {
                  value: 'male',
                  label: renderDynamicLabel(
                    dynamicLabels,
                    USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.Male,
                  ),
                },
                {
                  value: 'female',
                  label: renderDynamicLabel(
                    dynamicLabels,
                    USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.Female,
                  ),
                },
              ]}
              name="accountInformation.gender"
              control={control}
              className="w-100"
              notAllowSortData
              dynamicLabels={dynamicLabels}
            />
          </Col>
          <Col className={cx('p-0 ps-3')} xs={4} md={4}>
            <DateTimePicker
              disabled
              label={renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Date of birth'],
              )}
              messageRequired={errors?.accountInformation?.dob?.message}
              control={control}
              name="accountInformation.dob"
              className="w-100"
              maxDate={moment().startOf('day')}
              inputReadOnly
            />
          </Col>
        </Row>

        <Row className="py-2 mx-0">
          <Col className={cx('p-0 pe-3')} xs={4} md={4}>
            <AsyncSelectForm
              messageRequired={errors?.accountInformation?.country?.message}
              control={control}
              name="accountInformation.country"
              disabled={disable || statusPage === StatusPage.VIEW}
              labelSelect={renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.Country,
              )}
              isRequired
              titleResults={renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Selected cities'],
              )}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['Please select'],
              )}
              searchContent={renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.Country,
              )}
              textSelectAll={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['Select all'],
              )}
              textBtnConfirm={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS.Confirm,
              )}
              hasImage
              onChangeSearch={(value: string) => {
                setTouchedFields((prev) => ({
                  ...setTouchedFields,
                  country: true,
                }));
                dispatch(getCountryActions.request({ content: value }));
              }}
              options={countryOptionProps}
              dynamicLabels={dynamicLabels}
              flagImage
            />
          </Col>
          <Col className={cx('p-0 px-3')} xs={4} md={4}>
            <AsyncSelectForm
              disabled={
                disable ||
                watch('accountInformation.country')?.[0] === undefined ||
                statusPage === StatusPage.VIEW
              }
              messageRequired={
                errors?.accountInformation?.stateOrProvince?.message
              }
              control={control}
              name="accountInformation.stateOrProvince"
              labelSelect={renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['State/ Province'],
              )}
              isRequired
              titleResults={renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Selected cities'],
              )}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['Please select'],
              )}
              searchContent={renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['State/ Province'],
              )}
              textSelectAll={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS['Select all'],
              )}
              textBtnConfirm={renderDynamicLabel(
                dynamicLabels,
                COMMON_DYNAMIC_FIELDS.Confirm,
              )}
              onChangeSearch={onChangeSearchStateOrProvince}
              options={provinceOptionProps}
              dynamicLabels={dynamicLabels}
            />
          </Col>
          <Col className={cx('p-0 ps-3')} xs={4} md={4}>
            <Input
              messageRequired={errors?.accountInformation?.townOrCity?.message}
              {...register('accountInformation.townOrCity')}
              maxLength={128}
              label={renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Town/ City'],
              )}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Enter town/city'],
              )}
              isRequired
              disabled={statusPage === StatusPage.VIEW}
            />
          </Col>
        </Row>
        <Row className="py-2 mx-0">
          <Col className={cx('p-0 pe-3')} xs={4} md={4}>
            <Input
              maxLength={128}
              messageRequired={errors?.accountInformation?.address?.message}
              {...register('accountInformation.address')}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Enter address'],
              )}
              label={renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS.Address,
              )}
              isRequired
              disabled={statusPage === StatusPage.VIEW}
            />
          </Col>
          <Col className={cx('p-0 px-3')} xs={4} md={4}>
            <Input
              maxLength={128}
              messageRequired={
                errors?.accountInformation?.addressLine2?.message
              }
              {...register('accountInformation.addressLine2')}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Enter address line 2'],
              )}
              label={renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Address line 2'],
              )}
              disabled={statusPage === StatusPage.VIEW}
            />
          </Col>
          <Col className={cx('p-0 ps-3')} xs={4} md={4}>
            <Input
              maxLength={20}
              label={renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Post code'],
              )}
              messageRequired={errors?.accountInformation?.postCode?.message}
              {...register('accountInformation.postCode')}
              placeholder={renderDynamicLabel(
                dynamicLabels,
                USER_MANAGEMENT_DYNAMIC_DETAIL_FIELDS['Enter post code'],
              )}
              disabled={statusPage === StatusPage.VIEW}
            />
          </Col>
        </Row>
      </Container>
      {/* {!isChildCompany && (
        <Container>
          <SwitchView control={control} errors={errors} />
        </Container>
      )} */}

      <ModalConfirm
        toggle={() => setModal(!modal)}
        modal={modal}
        handleSubmit={() => history.push(AppRouteConst.USER)}
        title={renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['Cancel?'],
        )}
        content={renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS[
            'Are you sure you want to proceed with this action?'
          ],
        )}
        dynamicLabels={dynamicLabels}
      />
      {statusPage !== StatusPage.VIEW && (
        <div className={cx('d-flex justify-content-end pt-3', styles.wrapBtn)}>
          <Button
            className="me-3"
            buttonType={ButtonType.Select}
            buttonSize={ButtonSize.Small}
            onClick={() => setModal(true)}
          >
            {renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Cancel)}
          </Button>
          <Button
            buttonSize={ButtonSize.Small}
            loading={disableUserState}
            onClick={
              isEmpty(errors?.accountInformation)
                ? handleSubmit(handleSubmitFn, (err) => {
                    const watchAccountInformation = watch('accountInformation');

                    const watchForm = watch();
                    if (isEmpty(err?.accountInformation)) {
                      handleSubmitFn({
                        ...watchForm,
                        accountInformation: watchAccountInformation,
                      });
                    }
                    // TODO: submit just validate tab Password, so tab role has errors because have no value when create
                    if (!activeTabs?.includes(TabName.PASSWORD))
                      clearErrors('password');

                    if (!activeTabs?.includes(TabName.ROLE_AND_PERMISSION)) {
                      clearErrors('roles');
                    }
                  })
                : null
            }
          >
            {statusPage === StatusPage.EDIT
              ? renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Save)
              : renderDynamicLabel(dynamicLabels, COMMON_DYNAMIC_FIELDS.Next)}
          </Button>
        </div>
      )}
    </div>
  );
};

export default AccountInformation;
