import { Form, FormInstance, Input, Select } from "antd";
import { ProductRequest, STATUS_COMMON } from "api/product/product.interface";
import { FileUploads } from "api/upload-file/upload-file.interface";
import UploadImageSingle from "components/UploadImageSingle";
import UploadMulti from "components/UploadMulti";
import { useCallback, useEffect, useState } from "react";
import { actions, TStore, useDispatch, useSelector } from "store";
import { MODULE_FILE_UPLOAD, regexLink } from "utils/constants";
import omit from "lodash/omit";
import { uploadFilesModule } from "helpers/upload-file.helper";
export interface Props {
  setVisibleModal: (data: boolean) => void;
  form: FormInstance<any>;
  id: string | null;
  setIsLoadingButtonFooter: (check: boolean) => void;
  onChangeForm: (check: boolean) => void;
  getDefaultData: () => void;
}

const ProductForm = ({
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
  const [fileListVideos, setfileListVideos] = useState<FileUploads[]>([]);
  const [fileListLabel, setFileListLabel] = useState<FileUploads[]>([]);
  const [fileListeratures, setFileListeratures] = useState<FileUploads[]>([]);
  const [loadingButton, setLoadingButton] = useState<boolean>(false);
  const applicationData = useSelector(
    (state: TStore) => state?.application?.application
  );
  const details = useSelector(
    (state: TStore) => state?.products?.dataDetail?.data
  );
  useEffect(() => {
    if (id) {
      dispatch(actions.products.detailProduct({ id }));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id && details) {
      setFileListeratures([details?.literature]);
      setfileListVideos(details?.video ? [details?.video] : []);
      setFileListLabel([details?.label]);
      setFileUploadFileImage(details?.image);
    } else {
      setFileListeratures([]);
      setfileListVideos([]);
      setFileListLabel([]);
      setFileUploadFileImage({});
    }
  }, [details, id]);

  useEffect(() => {
    form.resetFields();
    if (id && details) {
      form.setFieldsValue({
        name: details?.name || "",
        shortDescription: details?.shortDescription || "",
        detailDescription: details?.detailDescription || "",
        webLink1: details?.website1?.link || "",
        webLinkName1: details?.website1?.name || "",
        webLink2: details?.website2?.link || "",
        webLinkName2: details?.website2?.name || "",
        applications:
          details?.applications.map((item) => {
            return {
              ...item,
              label: item.name,
              value: item._id,
            };
          }) || [],
        productLiterature: details?.literature?.fileName || "",
        productPicture: details?.image?.fileName || "",
        productVideo: details?.video?.fileName || "",
        productLabel: details?.label?.fileName || "",
        status: details?.status || STATUS_COMMON.ACTIVE,
      });
    }
  }, [details, form, id]);

  useEffect(() => {
    if (applicationData) {
      const option = applicationData?.data.map((item) => {
        return { value: item._id, label: item.name };
      });

      setOptionApplication(option);
    }
  }, [applicationData]);

  const onChangeFileLiteratures = useCallback(
    (files: FileUploads[]) => {
      const filesFilter = files.find((item) => item.originalFile);
      if (files.length > 0 && filesFilter) {
        form.setFieldValue("productLiterature", filesFilter.name);
      } else {
        form.resetFields(["productLiterature"]);
      }
      onChangeForm(true);
      setFileListeratures(files);
    },
    [form, onChangeForm]
  );

  const onChangeFileImage = useCallback(
    (file: FileUploads) => {
      if (file && !file.isDeleted) {
        form.setFieldValue("productPicture", file.name);
      } else {
        form.resetFields(["productPicture"]);
      }
      onChangeForm(true);
      setFileUploadFileImage(file);
    },
    [form, onChangeForm]
  );

  const onChangeFileListVideos = useCallback(
    (files: FileUploads[]) => {
      if (files.length > 0 && !files[0].isDeleted) {
        form.setFieldValue("productVideo", files[0].name);
      } else {
        form.resetFields(["productVideo"]);
      }
      onChangeForm(true);
      setfileListVideos(files);
    },
    [form, onChangeForm]
  );

  const onChangeFileListLabel = useCallback(
    (files: FileUploads[]) => {
      const filesFilter = files.find((item) => item.originalFile);
      if (files.length > 0 && filesFilter) {
        form.setFieldValue("productLabel", filesFilter.name);
      } else {
        form.resetFields(["productLabel"]);
      }
      onChangeForm(true);
      setFileListLabel(files);
    },
    [form, onChangeForm]
  );

  const onFinish = async (values: ProductRequest) => {
    setLoading(true);
    // file upload picture
    let image = "";
    const fileUploadImg: FileUploads[] = [];
    fileUploadImg.push(fileUploadImage);
    const images = await uploadFilesModule(
      MODULE_FILE_UPLOAD.PRODUCT,
      fileUploadImg
    );
    if (!images) return setLoading(false);
    if (images && images.length > 0) {
      image = images[0];
    }

    // file upload label
    let label = "";
    const labels = await uploadFilesModule(
      MODULE_FILE_UPLOAD.PRODUCT,
      fileListLabel
    );
    if (!labels) return setLoading(false);
    if (labels.length > 0) {
      label = labels[0];
    }

    //  product Literature
    let literature = "";
    const literatures = await uploadFilesModule(
      MODULE_FILE_UPLOAD.PRODUCT,
      fileListeratures
    );
    if (!literatures) return setLoading(false);
    if (literatures.length > 0) {
      literature = literatures[0];
    }

    // product video
    let video = "";
    const videos = await uploadFilesModule(
      MODULE_FILE_UPLOAD.PRODUCT,
      fileListVideos
    );
    if (!videos) return setLoading(false);
    if (videos.length > 0) {
      video = videos[0];
    }

    const bodyForm: ProductRequest = {
      ...values,
      image,
      label,
      literature,
      video,
      status: details?.status || STATUS_COMMON.ACTIVE,
      website1: {
        name: values?.webLinkName1 || "",
        link: values?.webLink1 || "",
      },
      website2: {
        name: values?.webLinkName2 || "",
        link: values?.webLink2 || "",
      },
    };

    const body = omit(bodyForm, [
      "productLabel",
      "productLiterature",
      "productPicture",
      "productVideo",
    ]) as ProductRequest;

    if (id) {
      dispatch(
        actions.products.putProduct({ id, body, getData: getDefaultData })
      );
    } else {
      dispatch(actions.products.postProduct({ body, getData: getDefaultData }));
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
          id="nameOfProduct"
          label="Name of product"
          name="name"
          rules={[{ required: true, message: "Product Name is required" }]}
        >
          <Input
            maxLength={200}
            placeholder="Input Product Name"
            disabled={loadingButton}
          />
        </Form.Item>

        <Form.Item
          label="Product Picture"
          name="productPicture"
          rules={[{ required: true, message: "Product Picture is required" }]}
        >
          <UploadImageSingle
            fileName={fileUploadImage}
            onChange={onChangeFileImage}
            accept="image/png, image/jpeg, image/jpg"
            maxSize={1 * 1024 * 1024}
            type="pdf"
            buttonUploadText="Upload Image"
            disabled={loadingButton}
          />
        </Form.Item>
        <Form.Item
          label="Product Application"
          name="applications"
          rules={[
            { required: true, message: "Product Application is required" },
          ]}
        >
          <Select
            mode="multiple"
            options={optionApplication}
            disabled={loadingButton}
            showSearch
            optionFilterProp="label"
            filterOption={true}
          />
        </Form.Item>
        <Form.Item
          label="Product Label"
          name="productLabel"
          rules={[{ required: true, message: "Product Label is required" }]}
        >
          <UploadMulti
            fileLists={fileListLabel}
            onChange={onChangeFileListLabel}
            accept="application/pdf"
            maxCount={1}
            maxSize={5 * 1024 * 1024}
            type="pdf"
            buttonUploadText="Upload PDF Files"
            disabled={loadingButton}
          />
        </Form.Item>
        <Form.Item
          label="Product Literature"
          name="productLiterature"
          rules={[
            { required: true, message: "Product Literature is required" },
          ]}
        >
          <UploadMulti
            fileLists={fileListeratures}
            onChange={onChangeFileLiteratures}
            accept="application/pdf"
            maxCount={1}
            maxSize={5 * 1024 * 1024}
            type="pdf"
            buttonUploadText="Upload PDF Files"
            disabled={loadingButton}
          />
        </Form.Item>
        <Form.Item
          name="webLink1"
          label="Inset Web Link 1"
          rules={[
            { required: true, message: "Web link 1 is required" },
            {
              pattern: regexLink,
              message: "The link format is wrong",
            },
          ]}
        >
          <Input placeholder="Input Web Link" disabled={loadingButton} />
        </Form.Item>
        <Form.Item
          name="webLinkName1"
          label="Web Link Name 1"
          rules={[{ required: true, message: "Web link name 1 is required" }]}
        >
          <Input
            placeholder="Input Web Link"
            maxLength={20}
            disabled={loadingButton}
          />
        </Form.Item>
        <Form.Item
          name="webLink2"
          label="Inset Web Link 2"
          rules={[
            { required: true, message: "Web link 2 is required" },
            {
              pattern: regexLink,
              message: "The link format is wrong",
            },
          ]}
        >
          <Input placeholder="Input Web Link" disabled={loadingButton} />
        </Form.Item>
        <Form.Item
          name="webLinkName2"
          label="Web Link Name 2"
          rules={[{ required: true, message: "Web link name 2 is required" }]}
        >
          <Input
            placeholder="Input Web Link 2"
            maxLength={20}
            disabled={loadingButton}
          />
        </Form.Item>
        <Form.Item
          label="Product Video"
          name="productVideo"
          // rules={[{ required: true, message: "Upload Video" }]}
        >
          <UploadMulti
            fileLists={fileListVideos}
            onChange={onChangeFileListVideos}
            accept="video/mp4, video/mov"
            maxCount={1}
            maxSize={400 * 1024 * 1024}
            type="video"
            buttonUploadText="Upload Video Files"
            disabled={loadingButton}
          />
        </Form.Item>
        <Form.Item label="Product Short Description" name="shortDescription">
          <Input
            placeholder="Type in Product Short Description"
            disabled={loadingButton}
            maxLength={60}
          />
        </Form.Item>
        <Form.Item
          label="Product Detailed Description"
          name="detailDescription"
        >
          <Input.TextArea
            placeholder="Type in Product Detailed Description"
            allowClear
            showCount
            maxLength={500}
            disabled={loadingButton}
          />
        </Form.Item>
      </Form>
    </div>
  );
};

export default ProductForm;
