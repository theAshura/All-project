import { message, Upload } from "antd";
import ImgCrop from "antd-img-crop";
import type {
  RcFile,
  UploadChangeParam,
  UploadFile,
} from "antd/es/upload/interface";

export interface Props {
  modalTitle?: string;
  aspect?: number;
  fileList?: UploadFile[];
  maxLength?: number;
  onChange?: (info: UploadChangeParam<UploadFile>) => void;
  onRemove?: (file: UploadFile) => void;
  onUploadFail?: () => void;
  modalClassName?: string;
  fileSizeMb?: number;
}

const ImageCropped = ({
  modalTitle,
  aspect = 2 / 1,
  fileList = [],
  maxLength,
  onChange,
  onRemove,
  onUploadFail,
  modalClassName,
  fileSizeMb = 1,
}: Props) => {
  const onPreview = async (file: UploadFile) => {
    let src = file.url as string;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj as RcFile);
        reader.onload = () => resolve(reader.result as string);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow?.document.write(image.outerHTML);
  };

  const beforeUpload = (file: RcFile) => {
    const isLt2M = file.size / 1024 / 1024 < fileSizeMb;
    if (!isLt2M) {
      message.error(`Image must smaller than ${fileSizeMb}MB!`);
    }
    return isLt2M;
  };

  return (
    <ImgCrop
      rotate
      aspect={aspect}
      modalTitle={modalTitle || "Edit image"}
      onUploadFail={onUploadFail}
      modalClassName={modalClassName}
    >
      <Upload
        action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
        listType="picture-card"
        fileList={fileList}
        onPreview={onPreview}
        onChange={onChange}
        onRemove={onRemove}
        beforeUpload={beforeUpload}
      >
        {fileList.length < (maxLength || 8) && "+ Upload"}
      </Upload>
    </ImgCrop>
  );
};

export default ImageCropped;
