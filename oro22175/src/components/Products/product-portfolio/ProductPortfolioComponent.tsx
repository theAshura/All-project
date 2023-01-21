/* eslint-disable no-debugger */
import React, { FC, useCallback, useEffect, useState } from "react";
import { Button, Form, Row } from "antd";
import UploadMulti from "components/UploadMulti";
import { useSelector } from "react-redux";
import { actions, TStore, useAppDispatch } from "store";
import { FileUploads } from "api/upload-file/upload-file.interface";
import classes from "../product.module.scss";
import { MODULE_FILE_UPLOAD } from "utils/constants";
import { uploadFilesModule } from "helpers/upload-file.helper";
import { ProductPortfolioRequest } from "api/product-portfolio/product-portfolio.interface";
import { useForm } from "antd/lib/form/Form";
export interface ValueFormProducts {
  literature: { file: FileUploads; fileList: FileUploads[] };
  videos: { file: FileUploads; fileList: FileUploads[] };
}
const ProductTechnoComponent: FC = () => {
  const dispatch = useAppDispatch();
  const { data, isLoading, isReload } = useSelector(
    (state: TStore) => state.productPortfolio
  );

  const [form] = useForm();

  const [isEdit, setIsEdit] = useState(false);
  const [fileListeratures, setFileListeratures] = useState<FileUploads[]>([]);
  const [loadingButton, setLoadingButton] = useState(false);
  useEffect(() => {
    form.setFieldValue(
      "productPortfolioLiterature",
      data?.literature?.fileName
    );
    setFileListeratures([data?.literature] || []);
  }, [data, form, isReload]);

  useEffect(() => {
    dispatch(actions.productPortfolio.fetchDetailProductFolio());
  }, [dispatch, isReload]);

  const onSubmit = useCallback(async () => {
    try {
      setLoadingButton(true);
      const literature = await uploadFilesModule(
        MODULE_FILE_UPLOAD.PRODUCT_PORTFOLIO,
        fileListeratures
      );

      if (!literature) return setLoadingButton(false);
      const body: ProductPortfolioRequest = {
        literature: literature[0],
      };
      await dispatch(actions.productPortfolio.postProductFolio(body)).unwrap();
      setLoadingButton(false);
      setIsEdit(false);
    } catch (error) {
      setLoadingButton(false);
      setIsEdit(true);
    }
  }, [dispatch, fileListeratures]);

  const onChangeFileLiteratures = useCallback(
    (files: FileUploads[]) => {
      const file = files.find((item) => !item.isDeleted);
      if (file) {
        form.setFieldValue("productPortfolioLiterature", file.name);
      } else {
        form.resetFields();
      }

      setFileListeratures(files);
    },
    [form]
  );

  const onCancel = useCallback(() => {
    setIsEdit(false);
    form.resetFields();
    dispatch(actions.productPortfolio.fetchDetailProductFolio());
  }, [dispatch, form]);

  return (
    <>
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Form.Item
          label="Product Portfolio Literature"
          name="productPortfolioLiterature"
          rules={[
            {
              required: true,
              message: "Product Portfolio Literature is required",
            },
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
            disabled={!isEdit || loadingButton}
            loading={isLoading || loadingButton}
          />
        </Form.Item>

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

export default ProductTechnoComponent;
