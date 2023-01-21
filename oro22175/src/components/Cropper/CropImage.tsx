import { Button, message } from "antd";
import React, { FC, useCallback, useRef } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import classes from "./crop-image.module.scss";
import { FileUploads } from "api/upload-file/upload-file.interface";

interface Props {
  img: string;
  cropFunction: (res: FileUploads) => void;
  nameFile: string;
  onClose: () => void;
}

function dataToBlob(dataURI: string, dataTYPE = "image/jpeg") {
  const binary = atob(dataURI.split(",")[1]);
  const array = [];
  for (let i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], { type: dataTYPE });
}

const CropImage: FC<Props> = (props) => {
  const cropper = useRef(null);

  const blobToFile = useCallback((theBlob: any, fileName: string) => {
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
  }, []);

  const saveBlob = async () => {
    if (typeof cropper !== "undefined") {
      try {
        const canvas = (cropper as any)?.current?.cropper?.getCroppedCanvas();
        const context = canvas.getContext("2d");
        context.globalCompositeOperation = "destination-over";
        context.fillStyle = "#fff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        const url = canvas.toDataURL("image/jpeg");
        const _dataToBlob = blobToFile(dataToBlob(url), "test.png");
        const file = new File([_dataToBlob], props.nameFile, {
          type: _dataToBlob.type,
        });
        const obj = {
          name: props.nameFile,
          originalFile: file,
          url,
        };
        props.cropFunction(obj);
        props.onClose();
      } catch (error) {
        message.error("Error when crop image");
      }
    }
  };
  const { img } = props;
  const src = img;

  const handleRotate = useCallback(() => {
    if (typeof cropper !== "undefined") {
      (cropper as any)?.current?.cropper?.rotate(90);
    }
  }, []);

  return (
    <div>
      {img && (
        <Cropper
          autoCropArea={1}
          crossOrigin={"anonymous"}
          checkCrossOrigin={false}
          ref={cropper}
          src={src}
          // aspectRatio={1 / 1}
          guides={false}
          background={false}
          zoomable={false}
          scalable={true}
          movable={false}
          className={classes.cropImage}
        />
      )}
      <div className={classes.footerModelCropImage}>
        <Button className="button" onClick={handleRotate}>
          Rotate
        </Button>
        <div>
          <Button
            className="button"
            type="primary"
            onClick={saveBlob}
            style={{ marginRight: 20 }}
          >
            Save
          </Button>
          <Button
            className="button"
            onClick={() => {
              props.onClose();
            }}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CropImage;
