import React, { FC, useCallback, useEffect, useState } from "react";
import { Button, Form, message, Row } from "antd";
import { ProductTectnologiesRequest } from "api/product-technologies/product-technologies.interface";
import UploadMulti from "components/UploadMulti";
import { useSelector } from "react-redux";
import { actions, TStore, useAppDispatch } from "store";
import { FileUploads } from "api/upload-file/upload-file.interface";
import classes from "../product.module.scss";
import { MODULE_FILE_UPLOAD } from "utils/constants";
import {
  uploadFilesModule,
  uploadFilesModuleHaveTitle,
} from "helpers/upload-file.helper";
import UploadMultiCustomLabelFile from "components/UploadMultiCustomLabelFile";
import { useForm } from "antd/lib/form/Form";
import styled from "styled-components";

export interface ValueFormProducts {
  literature: { file: FileUploads; fileList: FileUploads[] };
  videos: { file: FileUploads; fileList: FileUploads[] };
}
const ProductTechnoComponent: FC = () => {
  const [form] = useForm();
  const dispatch = useAppDispatch();
  const { data, isLoading } = useSelector(
    (state: TStore) => state.productTechnologies
  );
  const [isEdit, setIsEdit] = useState(false);
  const [fileListeratures, setFileListeratures] = useState<FileUploads[]>([]);
  const [fileListVideos, setfileListVideos] = useState<FileUploads[]>([]);
  const [loadingButton, setLoadingButton] = useState(false);
  useEffect(() => {
    dispatch(actions.productTechnologies.fetchDetailProductTechnologies());
  }, [dispatch]);

  useEffect(() => {
    setFileListeratures(
      data?.literature?.map((item) => {
        return {
          ...item?.file,
          title: item?.title,
        };
      })
    );
    setfileListVideos(data.videos);
  }, [data]);

  const onSubmit = useCallback(async () => {
    try {
      if (
        !fileListeratures ||
        (fileListeratures &&
          fileListeratures.filter((it) => !it.isDeleted).length === 0)
      ) {
        return message.error("literature must contain at least 1 elements");
      }
      setLoadingButton(true);
      const literature = await uploadFilesModuleHaveTitle(
        MODULE_FILE_UPLOAD.PRODUCT_TECHNOLOGY,
        fileListeratures
      );

      const videos = await uploadFilesModule(
        MODULE_FILE_UPLOAD.PRODUCT_TECHNOLOGY,
        fileListVideos
      );
      if (!literature || !videos) return;
      const body: ProductTectnologiesRequest = {
        literature: literature,
        videos: videos,
      };
      await dispatch(
        actions.productTechnologies.postProductTechnologies(body)
      ).unwrap();
      await dispatch(
        actions.productTechnologies.fetchDetailProductTechnologies()
      );
      setLoadingButton(false);
      setIsEdit(false);
    } catch (error) {
      setLoadingButton(false);
      setIsEdit(true);
    }
  }, [dispatch, fileListVideos, fileListeratures]);

  const onChangeFileLiteratures = useCallback((file: FileUploads[]) => {
    setFileListeratures(file);
  }, []);
  const onChangeFileListVideos = useCallback((file: FileUploads[]) => {
    setfileListVideos(file);
  }, []);

  const onCancel = useCallback(() => {
    setIsEdit(false);
    dispatch(actions.productTechnologies.fetchDetailProductTechnologies());
  }, [dispatch]);

  return (
    <>
      <Form layout="vertical" onFinish={onSubmit} form={form}>
        <TitleText>
          Product Technology Literature <span style={{ color: "red" }}>*</span>
        </TitleText>
        <UploadMultiCustomLabelFile
          fileLists={fileListeratures}
          onChange={onChangeFileLiteratures}
          accept="application/pdf"
          maxCount={4}
          maxSize={5 * 1024 * 1024}
          type="pdf"
          buttonUploadText="Upload PDF Files"
          disabled={!isEdit || loadingButton}
          loading={loadingButton || isLoading}
        />
        <TitleText>Product Technology Video</TitleText>
        <UploadMulti
          fileLists={fileListVideos}
          onChange={onChangeFileListVideos}
          accept="video/mp4, video/mov"
          maxCount={4}
          maxSize={400 * 1024 * 1024}
          type="video"
          buttonUploadText="Upload Video Files"
          disabled={!isEdit || loadingButton}
          loading={loadingButton || isLoading}
        />
        <Row className={classes.mt10}>
          {!isEdit ? (
            <Button
              className="button"
              type="primary"
              onClick={() => setIsEdit(true)}
              disabled={loadingButton}
            >
              Edit
            </Button>
          ) : (
            <>
              <Button
                className="button"
                onClick={onCancel}
                style={{ marginRight: 20 }}
                disabled={!isEdit || loadingButton}
              >
                Cancel
              </Button>
              <Button
                className="button"
                type="primary"
                htmlType="submit"
                disabled={!isEdit}
                loading={loadingButton}
              >
                Save
              </Button>
            </>
          )}
        </Row>
      </Form>
    </>
  );
};
export const TitleText = styled.div`
  padding-bottom: 6px;
`;

export default ProductTechnoComponent;
