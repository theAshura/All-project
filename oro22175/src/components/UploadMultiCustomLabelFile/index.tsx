/* eslint-disable indent */
import { CloseCircleOutlined, UploadOutlined } from "@ant-design/icons";
import { Button, message, Select, Spin } from "antd";
import React, { FC, useCallback, useMemo, useRef } from "react";
import classes from "./upload-multi-cusom-label-file.module.scss";
import cloneDeep from "lodash/cloneDeep";
import { FileUploads } from "api/upload-file/upload-file.interface";

interface Props {
  fileLists: FileUploads[];
  onChange: (fileLists: FileUploads[]) => void;
  type?: string;
  accept?: string;
  maxCount?: number;
  maxSize?: number;
  buttonUploadText?: string;
  disabled?: boolean;
  loading?: boolean;
}

const UploadMultiCustomLabelFile: FC<Props> = ({
  fileLists,
  onChange,
  type,
  accept,
  maxCount,
  maxSize,
  buttonUploadText,
  disabled,
  loading,
}) => {
  const inputPhotoRef = useRef<HTMLInputElement>(null);
  //filter list isDeleted = true
  const fileListHasIndex = useMemo(() => {
    return fileLists?.map((it, index) => {
      return {
        ...it,
        index,
      };
    });
  }, [fileLists]);
  const fileListActives = useMemo(() => {
    return fileListHasIndex?.filter((it) => !it.isDeleted);
  }, [fileListHasIndex]);

  const handleSelectImage = (e: any) => {
    const files: File[] = e.dataTransfer
      ? e.dataTransfer.files
      : e.target.files;
    let fileResults: FileUploads[] = [];
    let fileErrors: string[] = [];

    for (const file of files) {
      if (
        accept &&
        accept
          ?.split(",")
          .map((item) => item?.trim())
          .indexOf(file.type) === -1
      ) {
        return message.error("Wrong file format");
      }
    }
    if (maxCount && fileListActives?.length + files?.length > maxCount) {
      return message.error(`You can only upload ${maxCount} files`);
    }

    for (const item of files) {
      if (maxSize && item.size > maxSize) {
        fileErrors = [...fileErrors, ...[item.name]];
      } else {
        fileResults = [
          ...fileResults,
          ...[
            {
              title: "Adjuvant Technology",
              name: item.name,
              originalFile: item,
            },
          ],
        ];
      }
    }
    if (fileErrors.length) {
      return message.error(`${fileErrors.join(", ")} size too large`);
    }

    if (fileResults.length) {
      onChange([...fileLists, ...fileResults]);
    }
  };

  const handleDeleteItem = useCallback(
    (index: number) => {
      if (typeof index === "number") {
        const findIndexDeleted = fileListHasIndex.findIndex(
          (it) => it.index === index
        );
        const cloneFileListActives = cloneDeep(fileLists);
        cloneFileListActives[findIndexDeleted].isDeleted = true;
        onChange(cloneFileListActives);
      }
    },
    [fileListHasIndex, fileLists, onChange]
  );

  const onChangeSelectLabelFile = useCallback(
    (index: number, title: string) => {
      const cloneFileListActives = cloneDeep(fileLists);
      cloneFileListActives[index].title = title;
      onChange(cloneFileListActives);
    },
    [fileLists, onChange]
  );

  const renderListFiles = useMemo(() => {
    return fileListActives?.length
      ? fileListActives
          ?.filter((it) => !it.isDeleted)
          ?.map((it) => {
            return (
              <div key={it.index} className={classes.item}>
                <div className={classes.itemFile}>
                  <CloseCircleOutlined
                    className={`${classes.itemIcon} ${
                      disabled ? classes.disabled : ""
                    }`}
                    disabled={disabled}
                    onClick={() => !disabled && handleDeleteItem(it?.index)}
                  />
                  <a
                    className={classes.text}
                    onDoubleClick={() => onPreview(it)}
                  >
                    {it.name || it.fileName}
                  </a>
                </div>

                <div>
                  <h4 className={classes.titleFileUpload}>
                    Technology Literature Title
                  </h4>
                  <Select
                    className={classes.customSelect}
                    disabled={disabled}
                    value={it?.title || "Adjuvant Technology"}
                    onChange={(value) =>
                      onChangeSelectLabelFile(it.index, value)
                    }
                    options={[
                      {
                        value: "Adjuvant Technology",
                        label: "Adjuvant Technology",
                      },
                      {
                        value: "Bio-Control Technology",
                        label: "Bio-Control Technology",
                      },
                    ]}
                  />
                </div>
              </div>
            );
          })
      : null;
  }, [disabled, fileListActives, handleDeleteItem, onChangeSelectLabelFile]);

  const onPreview = (file: FileUploads) => {
    if (file.originalFile) {
      file?.originalFile?.arrayBuffer().then((arrayBuffer) => {
        const blob = new Blob([new Uint8Array(arrayBuffer)], {
          type: file?.originalFile?.type,
        });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        document.body.appendChild(a);
        a.href = url;
        a.target = "_blank";
        a.click();
      });
    } else {
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.href = `${process.env.REACT_APP_API}/uploads/${file?._id}`;
      a.target = "_blank";
      a.click();
    }
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
        multiple
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
        disabled={maxCount === fileListActives?.length || disabled}
      >
        {buttonUploadText || "Upload Files"}
      </Button>
      <div className={classes.listUploads}>
        {loading ? (
          <Spin />
        ) : (
          fileListActives && fileListActives.length > 0 && renderListFiles
        )}
      </div>
    </>
  );
};

export default UploadMultiCustomLabelFile;
