import { yupResolver } from '@hookform/resolvers/yup';
import cx from 'classnames';
import Container from 'components/common/container/Container';
import { GroupButton } from 'components/ui/button/GroupButton';
import Input from 'components/ui/input/Input';
import { showConfirmBase } from 'components/ui/modal/confirmBase';
import SelectUI from 'components/ui/select/Select';
import { MaxLength } from 'constants/common.const';
import { statusOptions } from 'constants/filter.const';
import { toastError } from 'helpers/notification.helper';
import useEffectOnce from 'hoc/useEffectOnce';
import { AppRouteConst } from 'constants/route.const';
import history from 'helpers/history.helper';
import isEqual from 'lodash/isEqual';
import { FC, useEffect, useCallback, useState } from 'react';
import { FieldValues, useForm, Controller } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { getListFileActions, clearDMSReducer } from 'store/dms/dms.action';
import { getListFileApi } from 'api/dms.api';
import { Col, Row } from 'reactstrap';
import { Features, SubFeatures } from 'constants/roleAndPermission.const';
import * as yup from 'yup';
import {
  AttachmentKitData,
  AttachmentKitDetail,
} from 'models/api/attachment-kit/attachment-kit.model';
import {
  TableAttachment,
  // Attachment,
} from 'components/common/table-attachment/TableAttachment';

import { renderDynamicLabel } from 'helpers/dynamic.helper';
import { COMMON_DYNAMIC_FIELDS } from 'constants/dynamic/common.const';
import { ATTACHMENT_KIT_DETAIL_DYNAMIC_FIELDS } from 'constants/dynamic/attachmentKit.const';
import useDynamicLabels from 'hoc/useDynamicLabels';
import {
  DynamicLabelModuleName,
  ModulePage,
} from 'constants/dynamic/dynamic.const';
import { updateAttachmentKitActions } from '../../../store/attachment-kit/attachment-kit.action';
import styles from './form.module.scss';

interface AttachmentKitFormProps {
  isEdit: boolean;
  isCreate?: boolean;
  data: AttachmentKitDetail;
  onSubmit: (CreatePortParams: AttachmentKitData) => void;
}
interface Sizes {
  totalSize: number;
  fileZipSize: number;
}

const AttachmentKitForm: FC<AttachmentKitFormProps> = ({
  isEdit,
  isCreate,
  data,
  onSubmit,
}) => {
  // state
  const { loading, errorList } = useSelector((state) => state.attachmentKit);
  const [fileZipId, setFileZipId] = useState<string>('');
  const [sizeFiles, setSizeFiles] = useState<Sizes>({
    totalSize: 0,
    fileZipSize: 0,
  });
  const [dataFileZipDetail, setDataFileZipDetail] = useState<any>();

  const moduleType = () => {
    if (isCreate) {
      return ModulePage.Create;
    }

    if (isEdit) {
      return ModulePage.Edit;
    }

    return ModulePage.View;
  };

  const dynamicLabels = useDynamicLabels({
    moduleKey: DynamicLabelModuleName.ConfigurationInspectionAttachmentKit,
    modulePage: moduleType(),
  });

  const dispatch = useDispatch();
  const schema = yup.object().shape({
    code: yup
      .string()
      .trim()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      )
      .min(
        1,
        renderDynamicLabel(
          dynamicLabels,
          ATTACHMENT_KIT_DETAIL_DYNAMIC_FIELDS[
            'Port code must be between 2 and 20 characters.'
          ],
        ),
      ),
    name: yup
      .string()
      .trim()
      .required(
        renderDynamicLabel(
          dynamicLabels,
          COMMON_DYNAMIC_FIELDS['This field is required'],
        ),
      )
      .min(
        1,
        renderDynamicLabel(
          dynamicLabels,
          ATTACHMENT_KIT_DETAIL_DYNAMIC_FIELDS[
            'Port name must be between 2 and 250 characters.'
          ],
        ),
      ),
  });

  const defaultValues = {
    code: '',
    description: '',
    name: '',
    status: 'active',
    attachments: [],
  };

  const {
    register,
    control,
    handleSubmit,
    setError,
    setValue,
    getValues,
    reset,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    mode: 'all',
    defaultValues,
    resolver: yupResolver(schema),
  });
  const dataName = watch('name');

  useEffect(() => {
    if (errorList?.length) {
      errorList.forEach((item) => {
        switch (item.fieldName) {
          case 'code':
            setError('code', { message: item.message });
            break;
          case 'name':
            setError('name', { message: item.message });
            break;
          default:
            break;
        }
      });
    } else {
      setError('code', { message: '' });
      setError('name', { message: '' });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorList]);

  // function
  const onSubmitForm = useCallback(
    (data: AttachmentKitData) => {
      if (
        (fileZipId && sizeFiles?.fileZipSize > 8.5) ||
        (fileZipId && sizeFiles?.totalSize > 8.5)
      ) {
        toastError(
          renderDynamicLabel(
            dynamicLabels,
            ATTACHMENT_KIT_DETAIL_DYNAMIC_FIELDS[
              'The files are exceeding the maximum attachment kit size of 8.5 MB, please reduce the files'
            ],
          ),
        );
      } else {
        onSubmit({ ...data, fileZip: fileZipId || null });
      }
    },
    [
      fileZipId,
      sizeFiles?.fileZipSize,
      sizeFiles?.totalSize,
      dynamicLabels,
      onSubmit,
    ],
  );

  const resetDefault = (defaultParams) => {
    reset(defaultParams);
    history.goBack();
  };

  const handleCancel = () => {
    let defaultParams = {};
    const params = getValues();
    if (isCreate) {
      defaultParams = defaultValues;
    } else {
      defaultParams = {
        code: data?.code,
        description: data?.description,
        name: data?.name,
        status: data?.status || 'active',
        attachments: data?.attachments || [],
      };
    }
    if (isEqual(defaultParams, params)) {
      if (isCreate) {
        history.push(AppRouteConst.ATTACHMENT_KIT);
      } else {
        history.goBack();
      }
    } else {
      showConfirmBase({
        isDelete: false,
        txTitle: renderDynamicLabel(
          dynamicLabels,
          ATTACHMENT_KIT_DETAIL_DYNAMIC_FIELDS['Cancel?'],
        ),
        txMsg: renderDynamicLabel(
          dynamicLabels,
          ATTACHMENT_KIT_DETAIL_DYNAMIC_FIELDS[
            'Are you sure you want to proceed with this action?'
          ],
        ),
        txButtonLeft: renderDynamicLabel(
          dynamicLabels,
          ATTACHMENT_KIT_DETAIL_DYNAMIC_FIELDS.Cancel,
        ),
        txButtonRight: renderDynamicLabel(
          dynamicLabels,
          ATTACHMENT_KIT_DETAIL_DYNAMIC_FIELDS.Confirm,
        ),
        onPressButtonRight: () =>
          isCreate
            ? history.push(AppRouteConst.ATTACHMENT_KIT)
            : resetDefault(defaultParams),
      });
    }
  };

  // effect
  useEffect(() => {
    if (data) {
      setValue('code', data.code);
      setValue('status', data.status || 'active');
      setValue('name', data.name);
      setValue('description', data?.description);
      setValue(
        'attachments',
        data?.attachments?.length ? [...data?.attachments] : [],
      );
      if (data?.attachments?.length > 0) {
        dispatch(getListFileActions.request({ ids: data?.attachments || [] }));
      } else {
        dispatch(getListFileActions.success([]));
      }
      if (data?.fileZip) {
        getListFileApi({
          ids: [data?.fileZip],
          isAttachment: true,
        })
          .then((res) => {
            setDataFileZipDetail({
              ...res.data[0],
              name: res.data[0]?.originName,
              sizeNumber: res.data[0]?.size,
            });
          })
          .catch((e) => {
            // setLoading(false);
          });
      }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  useEffectOnce(() => () => {
    dispatch(clearDMSReducer());
    dispatch(updateAttachmentKitActions.failure(null));
  });

  // render
  return (
    <div>
      <Container>
        <div className="pb-4">
          <div className="container__subtitle">
            {renderDynamicLabel(
              dynamicLabels,
              ATTACHMENT_KIT_DETAIL_DYNAMIC_FIELDS['General information'],
            )}
          </div>
          <Row className="mx-0 mt-3">
            <Col className="p-0 me-3">
              <Input
                label={renderDynamicLabel(
                  dynamicLabels,
                  ATTACHMENT_KIT_DETAIL_DYNAMIC_FIELDS['Kit code'],
                )}
                readOnly={!isEdit || loading}
                disabledCss={!isEdit || loading}
                isRequired
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  ATTACHMENT_KIT_DETAIL_DYNAMIC_FIELDS['Enter kit code'],
                )}
                messageRequired={errors?.code?.message || ''}
                {...register('code')}
                maxLength={MaxLength.MAX_LENGTH_CODE}
              />
            </Col>
            <Col className="p-0 mx-3">
              <Input
                label={renderDynamicLabel(
                  dynamicLabels,
                  ATTACHMENT_KIT_DETAIL_DYNAMIC_FIELDS['Kit name'],
                )}
                {...register('name')}
                isRequired
                disabled={!isEdit || loading}
                messageRequired={errors?.name?.message || ''}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  ATTACHMENT_KIT_DETAIL_DYNAMIC_FIELDS['Enter kit name'],
                )}
                maxLength={MaxLength.MAX_LENGTH_TEXT}
              />
            </Col>
            <Col className="p-0 ms-3">
              <Input
                label={renderDynamicLabel(
                  dynamicLabels,
                  ATTACHMENT_KIT_DETAIL_DYNAMIC_FIELDS.Description,
                )}
                {...register('description')}
                disabled={!isEdit || loading}
                placeholder={
                  !isEdit
                    ? ''
                    : renderDynamicLabel(
                        dynamicLabels,
                        ATTACHMENT_KIT_DETAIL_DYNAMIC_FIELDS[
                          'Enter description'
                        ],
                      )
                }
                maxLength={MaxLength.MAX_LENGTH_OPTIONAL}
              />
            </Col>
          </Row>
          <Row className="pt-2 mx-0">
            <Col className="p-0 me-3 modal__list-form">
              <SelectUI
                data={statusOptions}
                disabled={!isEdit || loading}
                name={renderDynamicLabel(
                  dynamicLabels,
                  ATTACHMENT_KIT_DETAIL_DYNAMIC_FIELDS.Status,
                )}
                className={cx(
                  styles.inputSelect,
                  { [styles.disabledSelect]: !isEdit },
                  'w-100',
                )}
                placeholder={renderDynamicLabel(
                  dynamicLabels,
                  COMMON_DYNAMIC_FIELDS['Please select'],
                )}
                control={control}
                labelSelect={renderDynamicLabel(
                  dynamicLabels,
                  ATTACHMENT_KIT_DETAIL_DYNAMIC_FIELDS.Status,
                )}
              />
            </Col>
            <Col className="p-0 mx-3" />
            <Col className="p-0 ms-3" />
          </Row>
        </div>
      </Container>
      <Container>
        <Controller
          control={control}
          name={renderDynamicLabel(
            dynamicLabels,
            ATTACHMENT_KIT_DETAIL_DYNAMIC_FIELDS.Attachments,
          )}
          render={({ field }) => (
            <TableAttachment
              featurePage={Features.CONFIGURATION}
              subFeaturePage={SubFeatures.ATTACHMENT_KIT}
              loading={false}
              isEdit={isEdit && !loading}
              value={field.value}
              buttonName={renderDynamicLabel(
                dynamicLabels,
                ATTACHMENT_KIT_DETAIL_DYNAMIC_FIELDS.Attach,
              )}
              hasFileZip
              disable={!isEdit}
              onchange={field.onChange}
              nameFileZip={dataName}
              getFileZipId={(zipId: string) => setFileZipId(zipId)}
              dataFileZipDetail={dataFileZipDetail}
              getSizes={(totalSize: number, fileZipSize: number) =>
                setSizeFiles({
                  totalSize,
                  fileZipSize: fileZipSize || 0,
                })
              }
              dynamicLabels={dynamicLabels}
            />
          )}
        />
        {isEdit && (
          <GroupButton
            className={styles.GroupButton}
            handleCancel={handleCancel}
            handleSubmit={handleSubmit(onSubmitForm)}
            disable={!isEdit || loading}
            txButtonLeft={renderDynamicLabel(
              dynamicLabels,
              ATTACHMENT_KIT_DETAIL_DYNAMIC_FIELDS.Cancel,
            )}
            txButtonBetween={renderDynamicLabel(
              dynamicLabels,
              ATTACHMENT_KIT_DETAIL_DYNAMIC_FIELDS.Save,
            )}
          />
        )}
      </Container>
    </div>
  );
};

export default AttachmentKitForm;
