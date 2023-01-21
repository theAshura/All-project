import { Form, FormInstance, Input, Select } from "antd";
import { MaskedInput } from "antd-mask-input";
import { STATUS_COMMON } from "api/product/product.interface";
import { FileUploads } from "api/upload-file/upload-file.interface";
import UploadImageSingle from "components/UploadImageSingle";
import { useCallback, useEffect, useState } from "react";
import { actions, TStore, useDispatch, useSelector } from "store";

import { PostSalerParams } from "api/saler/saler.interface";
import omit from "lodash/omit";
import isEmpty from "lodash/isEmpty";
import { MODULE_FILE_UPLOAD } from "utils/constants";
import { uploadFilesModule } from "helpers/upload-file.helper";
import { emailRegex } from "helpers/utilities.helper";
export interface Props {
  setVisibleModal: (data: boolean) => void;
  form: FormInstance<any>;
  id: string | null;
  setIsLoadingButtonFooter: (check: boolean) => void;
  onChangeForm: (check: boolean) => void;
  getDefaultData: () => void;
}

const AreaManagerForm = ({
  setVisibleModal,
  form,
  id,
  setIsLoadingButtonFooter,
  onChangeForm,
  getDefaultData,
}: Props) => {
  const dispatch = useDispatch();
  const [optionApplication, setOptionApplication] =
    useState<{ value: string; label: string }[]>();
  const [fileUploadImage, setFileUploadFileImage] = useState<FileUploads>({});
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const stateData = useSelector((state: TStore) => state?.saler?.state.data);
  const details = useSelector(
    (state: TStore) => state?.saler?.dataDetail?.data
  );
  useEffect(() => {
    if (id && details) {
      setFileUploadFileImage(details?.avatar);
    } else {
      setFileUploadFileImage({});
    }
  }, [details, id]);
  const getDefault = useCallback(() => {
    return dispatch(actions.saler.GetListStatesAction({ limit: "100" }));
  }, [dispatch]);

  useEffect(() => {
    getDefault();
  }, [getDefault]);

  useEffect(() => {
    if (id) {
      dispatch(actions.saler.detailSaler({ id }));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id && details) {
      setFileUploadFileImage(details?.avatar || {});
    } else {
      setFileUploadFileImage({});
    }
  }, [details, id]);

  useEffect(() => {
    form.resetFields();
    if (id && details) {
      form.setFieldsValue({
        name: details?.name || "",
        phoneNumber: details?.phoneNumber || null,
        email: details?.email || "",
        states:
          details?.states?.map((item) => {
            return {
              ...item,
              label: item.name,
              value: item._id,
            };
          }) || [],
        avatar: details?.avatar?.fileName || "",
        status: details?.status || STATUS_COMMON.ACTIVE,
      });
    }
  }, [details, form, id]);
  useEffect(() => {
    if (stateData) {
      const option = stateData?.data.map(
        (item: { _id: string; name: string }) => {
          return { value: item._id, label: item.name };
        }
      );

      setOptionApplication(option);
    }
  }, [stateData]);

  const onChangeFileImage = useCallback(
    (file: FileUploads) => {
      onChangeForm(true);
      setFileUploadFileImage(file);
    },
    [onChangeForm]
  );

  const onFinish = async (values: PostSalerParams) => {
    setLoading(true);
    // file upload picture
    let avatar = "";

    if (!isEmpty(fileUploadImage)) {
      const fileUploadImg: FileUploads[] = [];
      fileUploadImg.push(fileUploadImage);

      const images = await uploadFilesModule(
        MODULE_FILE_UPLOAD.AREA_MANAGES_MODIFICATION,
        fileUploadImg
      );
      if (!images) return setLoading(false);
      if (images && images.length > 0) {
        avatar = images[0];
      }
    }

    const bodyForm: PostSalerParams = {
      ...values,
      avatar,
      status: details?.status || STATUS_COMMON.ACTIVE,
      phoneNumber: values.phoneNumber,
      email: values.email,
    };

    const body = omit(bodyForm, []);

    if (id) {
      dispatch(actions.saler.putSaler({ id, body, getData: getDefaultData }));
    } else {
      dispatch(actions.saler.postSaler({ body, getData: getDefaultData }));
    }
    form.resetFields();
    onChangeForm(false);
    setLoading(false);
    setVisibleModal(false);
  };

  const setLoading = useCallback(
    (check: boolean) => {
      setLoadingButton(check);
      setIsLoadingButtonFooter(check);
    },
    [setIsLoadingButtonFooter]
  );

  return (
    <div>
      <Form
        form={form}
        onChange={() => onChangeForm(true)}
        onFinish={onFinish}
        layout="vertical"
      >
        <Form.Item
          id="nameOfManager"
          label="Name of Manager"
          name="name"
          rules={[{ required: true, message: "Name of Manager is required" }]}
        >
          <Input
            maxLength={200}
            placeholder="Input Manager Name"
            disabled={loadingButton}
          />
        </Form.Item>

        <Form.Item label="Picture Profile" name="avatar">
          <UploadImageSingle
            fileName={fileUploadImage}
            onChange={onChangeFileImage}
            accept="image/png, image/jpeg, image/jpg"
            maxSize={1 * 1024 * 1024}
            type="pdf"
            buttonUploadText="Upload Image"
          />
        </Form.Item>
        <Form.Item
          label="Phone Number"
          name="phoneNumber"
          rules={[
            { required: true, message: "Phone Number is required" },
            {
              pattern: /^\d{3}-\d{3}-\d{4}$/,
              message: "Phone Number is invalid",
            },
          ]}
        >
          <MaskedInput placeholder="Input Phone Number" mask="000-000-0000" />
        </Form.Item>

        <Form.Item
          id="email"
          label="Email Address"
          name="email"
          rules={[
            {
              pattern: emailRegex,
              message: "Email Address is invalid",
            },
            {
              required: true,
              message: "Email Address is required",
            },
          ]}
        >
          <Input
            maxLength={320}
            placeholder="Input Email Address"
            disabled={loadingButton}
          />
        </Form.Item>
        <Form.Item
          label="Location (Can choose multiple)"
          name="states"
          rules={[{ required: true, message: "Location is required" }]}
        >
          <Select
            mode="multiple"
            options={optionApplication}
            disabled={loadingButton}
            placeholder="Dropdown List of State Name"
            showSearch
            optionFilterProp="label"
            filterOption={true}
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default AreaManagerForm;
