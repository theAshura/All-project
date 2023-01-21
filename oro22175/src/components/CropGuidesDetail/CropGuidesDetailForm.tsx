import { Form, FormInstance, Input, Select } from "antd";
import { STATUS_COMMON } from "api/product/product.interface";
import { FileUploads } from "api/upload-file/upload-file.interface";
import UploadImageSingle from "components/UploadImageSingle";
import UploadMulti from "components/UploadMulti";
import { useCallback, useEffect, useState } from "react";
import { actions, TStore, useDispatch, useSelector } from "store";
import { MODULE_FILE_UPLOAD, regexLink } from "utils/constants";
import omit from "lodash/omit";
import { CropGuidePostParams } from "api/crop-guide/crop-guide.interface";
import { uploadFilesModule } from "helpers/upload-file.helper";
export interface Props {
  setVisibleModal: (data: boolean) => void;
  form: FormInstance<any>;
  id: string | null;
  setIsLoadingButtonFooter: (check: boolean) => void;
  onChangeForm: (check: boolean) => void;
  getDefaultData: () => void;
}

const CropGuidesDetailForm = ({
  setVisibleModal,
  form,
  id,
  setIsLoadingButtonFooter,
  onChangeForm,
  getDefaultData,
}: Props) => {
  const dispatch = useDispatch();
  const [fileUploadImage, setFileUploadFileImage] = useState<FileUploads>({});
  const [fileListVideos, setfileListVideos] = useState<FileUploads[]>([]);
  const [fileListeratures, setFileListeratures] = useState<FileUploads[]>([]);
  const [loadingButton, setLoadingButton] = useState<boolean>(false);

  const details = useSelector((state: TStore) => state?.cropGuide?.dataDetail);

  useEffect(() => {
    if (id) {
      dispatch(actions.cropGuide.detailCropGuide({ id }));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id && details) {
      setFileListeratures([details?.literature]);
      setfileListVideos(details?.video ? [details?.video] : []);
      setFileUploadFileImage(details?.image);
    } else {
      setFileListeratures([]);
      setfileListVideos([]);
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
        webLink: details?.website?.link || "",
        webLinkName: details?.website?.name || "",
        cropGuideLiterature: details?.literature?.fileName || "",
        cropGuidePicture: details?.image?.fileName || "",
        cropGuideVideo: details?.video?.fileName || "",
        status: details?.status || STATUS_COMMON.ACTIVE,
      });
    }
  }, [details, form, id]);

  const onChangeFileLiteratures = useCallback(
    (files: FileUploads[]) => {
      const filesFilter = files.find((item) => item.originalFile);
      if (files.length > 0 && filesFilter) {
        form.setFieldValue("cropGuideLiterature", filesFilter.name);
      } else {
        form.resetFields(["cropGuideLiterature"]);
      }
      onChangeForm(true);
      setFileListeratures(files);
    },
    [form, onChangeForm]
  );

  const onChangeFileImage = useCallback(
    (file: FileUploads) => {
      if (file && !file.isDeleted) {
        form.setFieldValue("cropGuidePicture", file.name);
      } else {
        form.resetFields(["cropGuidePicture"]);
      }
      onChangeForm(true);
      setFileUploadFileImage(file);
    },
    [form, onChangeForm]
  );

  const onChangeFileListVideos = useCallback(
    (files: FileUploads[]) => {
      if (files.length > 0 && !files[0].isDeleted) {
        form.setFieldValue("cropGuideVideo", files[0].name);
      } else {
        form.resetFields(["cropGuideVideo"]);
      }
      onChangeForm(true);
      setfileListVideos(files);
    },
    [form, onChangeForm]
  );

  const onFinish = async (values: CropGuidePostParams) => {
    setLoading(true);
    // file upload picture
    let image = "";
    const fileUploadImg: FileUploads[] = [];
    fileUploadImg.push(fileUploadImage);
    const images = await uploadFilesModule(
      MODULE_FILE_UPLOAD.CROP_GUIDES,
      fileUploadImg
    );
    if (!images) return setLoading(false);
    if (images && images.length > 0) {
      image = images[0];
    }

    //  product Literature
    let literature = "";
    const literatures = await uploadFilesModule(
      MODULE_FILE_UPLOAD.CROP_GUIDES,
      fileListeratures
    );
    if (!literatures) return setLoading(false);
    if (literatures.length > 0) {
      literature = literatures[0];
    }

    // product video
    let video = "";
    const videos = await uploadFilesModule(
      MODULE_FILE_UPLOAD.CROP_GUIDES,
      fileListVideos
    );
    if (!videos) return setLoading(false);
    if (videos.length > 0) {
      video = videos[0];
    }

    const bodyForm: CropGuidePostParams = {
      ...values,
      image,
      literature,
      video,
      status: STATUS_COMMON.ACTIVE,
    };

    const body = omit(bodyForm, [
      "cropGuideLiterature",
      "cropGuidePicture",
      "cropGuideVideo",
    ]) as CropGuidePostParams;

    if (id) {
      dispatch(
        actions.cropGuide.putCropGuide({ id, body, getData: getDefaultData })
      );
    } else {
      dispatch(
        actions.cropGuide.postCropGuide({ body, getData: getDefaultData })
      );
    }
    form.resetFields();
    setLoading(false);
    onChangeForm(false);
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
          label="Name of Crop Guide"
          name="name"
          rules={[
            { required: true, message: "Name of Crop Guide is required" },
          ]}
        >
          <Input
            maxLength={200}
            placeholder="Input Name of Crop Guide"
            disabled={loadingButton}
          />
        </Form.Item>

        <Form.Item
          label="Crop Guide Picture"
          name="cropGuidePicture"
          rules={[
            { required: true, message: "Crop Guide Picture is required" },
          ]}
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
          label="Crop Guide Literature"
          name="cropGuideLiterature"
          rules={[
            { required: true, message: "Crop Guide Literature is required" },
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
        <Form.Item label="Crop Guide Video" name="cropGuideVideo">
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
        <Form.Item label="Crop Guide Short Description" name="shortDescription">
          <Input
            placeholder="Type in Crop Guide Short Description"
            disabled={loadingButton}
            maxLength={60}
          />
        </Form.Item>
        <Form.Item
          label="Crop Guide Detailed Description"
          name="detailDescription"
        >
          <Input.TextArea
            placeholder="Type in Crop Guide Detailed Description"
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

export default CropGuidesDetailForm;
