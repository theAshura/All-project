/* eslint-disable indent */
import { CloseCircleOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, message } from "antd";
import React, {
  FC,
  Suspense,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import classes from "./upload-multi.module.scss";
import { FileUploads } from "api/upload-file/upload-file.interface";
import CropImage from "components/Cropper/CropImage";
import ModalContainer from "components/modal/ModalContainer";

interface Props {
  fileName: FileUploads;
  onChange: (fileName: FileUploads) => void;
  type?: string;
  accept?: string;
  maxSize?: number;
  buttonUploadText?: string;
  disabled?: boolean;
}

const UploadImageSingle: FC<Props> = ({
  fileName,
  onChange,
  type,
  accept,
  maxSize,
  buttonUploadText,
  disabled,
}) => {
  const inputPhotoRef = useRef<HTMLInputElement>(null);
  const [visibleCropModal, setVisibleCropModal] = useState(false);

  const handleSelectImage = (e: any) => {
    const files: File & { url: string } = e.dataTransfer
      ? e.dataTransfer.files[0]
      : e.target.files[0];
    let fileResults: FileUploads = {};
    if (files.name && accept) {
      const splitName = files?.name.split(".");
      if (
        splitName.length &&
        !accept.includes(splitName[splitName.length - 1])
      ) {
        return message.error("Wrong file format");
      }
    }

    if (maxSize && files.size > maxSize) {
      return message.error("Files size too large");
    }
    const url = URL.createObjectURL(files);
    fileResults = {
      name: files?.name,
      url,
      originalFile: files,
    };
    onChange(fileResults);
    setVisibleCropModal(true);
  };

  const handleDeleteItem = useCallback(() => {
    onChange({});
  }, [onChange]);

  const renderImage = useMemo(() => {
    return (
      <div className={classes.item}>
        <CloseCircleOutlined
          className={`${classes.itemIcon} ${disabled ? classes.disabled : ""}`}
          disabled={disabled}
          onClick={!disabled ? handleDeleteItem : () => null}
        />
        <img
          src={
            fileName?.url ||
            `${process.env.REACT_APP_API}/uploads/${fileName?._id}`
          }
          alt=""
          width={300}
          height={300}
          crossOrigin="anonymous"
        />
      </div>
    );
  }, [disabled, fileName?._id, fileName?.url, handleDeleteItem]);

  const cropImage = (filess: FileUploads) => {
    onChange(filess);
  };

  return (
    <>
      <input
        type="file"
        id="avatar"
        name="avatar"
        accept={accept}
        hidden
        ref={inputPhotoRef}
        onChange={(event) => {
          handleSelectImage(event);
          event.currentTarget.value = "";
        }}
      />
      <Button
        className="button"
        type="primary"
        onClick={() => inputPhotoRef.current?.click()}
        icon={<UploadOutlined />}
        disabled={disabled}
      >
        {buttonUploadText || "Upload Files"}
      </Button>
      {Object.keys(fileName).length ? (
        <div className={classes.listUploads}>{renderImage}</div>
      ) : null}

      {visibleCropModal && (
        <Suspense fallback={null}>
          <ModalContainer
            isModalOpen={visibleCropModal}
            onClose={() => setVisibleCropModal(false)}
            hideFooter={true}
          >
            <CropImage
              img={fileName.url || ""}
              cropFunction={cropImage}
              nameFile={fileName.name || "-"}
              onClose={() => setVisibleCropModal(false)}
            />
          </ModalContainer>
        </Suspense>
      )}
    </>
  );
};

export default UploadImageSingle;
