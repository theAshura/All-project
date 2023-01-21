import React, { FC, Suspense, useCallback, useState } from "react";
import TableCommon from "components/table/Table";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Form, Input, message, UploadFile } from "antd";
import ImageCropped from "components/ImageCropped";
import { UploadChangeParam } from "antd/es/upload";
const ModalContainer = React.lazy(
  () => import("components/modal/ModalContainer")
);

const dataSource = [
  {
    key: "1",
    shortDescription: "Short Description demo 1",
    title: "title",
    detailedDescription: "detailedDescription",
    address: "10 Downing Street",
  },
];

export interface ValueFormProducts {
  title: string;
  detailedDescription: string;
  shortDescription: string;
  fileList: UploadFile[];
}
const ProductsSection: FC = () => {
  const [visibleModalEdit, setVisibleModalEdit] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>();

  const columns = [
    {
      title: "No",
      dataIndex: "key",
      key: "key",
      width: 80,
    },
    {
      title: "Products Sections Short Description",
      dataIndex: "shortDescription",
      key: "shortDescription",
    },
    {
      title: "Products Page Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Products Page Detailed Description",
      dataIndex: "detailedDescription",
      key: "detailedDescription",
    },
    {
      title: "Action",
      key: "action",
      name: "action",
      width: 100,
      render: () => (
        <div className="customAction">
          <EditOutlined
            className="editAction"
            onClick={() => setVisibleModalEdit(true)}
          />
          <DeleteOutlined className="deleteAction" />
        </div>
      ),
    },
  ];
  const initialValues = useCallback(() => {
    return {
      title: "",
      shortDescription: "",
      detailedDescription: "",
      fileList: [],
    };
  }, []);

  const onChangeFile = useCallback((info: UploadChangeParam<UploadFile>) => {
    // call api
    if (info.file.status === "done") {
      setFileList(info.fileList);
    }
  }, []);

  const onSubmit = useCallback((value: ValueFormProducts) => {
    message.success("Update Successfully!");
    setVisibleModalEdit(false);
  }, []);

  return (
    <>
      <TableCommon
        columns={columns}
        dataSource={dataSource}
        page={1}
        pageSize={1}
      />

      {visibleModalEdit && (
        <Suspense fallback={null}>
          <ModalContainer
            isModalOpen={visibleModalEdit}
            title={"Edit Product Section"}
            onSubmit={form.submit}
            onClose={() => setVisibleModalEdit(false)}
            okText={"Save"}
          >
            <Form
              form={form}
              initialValues={initialValues}
              labelAlign={"left"}
              layout="vertical"
              onFinish={onSubmit}
            >
              <Form.Item
                label="Browse Picture"
                name="fileList"
                rules={[
                  {
                    required: true,
                    message: "Browse Picture is required",
                  },
                ]}
              >
                <ImageCropped
                  fileList={fileList}
                  onChange={onChangeFile}
                  maxLength={1}
                />
              </Form.Item>
              <Form.Item
                label="Products Sections Short Description"
                name="shortDescription"
                rules={[
                  {
                    required: true,
                    message: "Products Sections Short Description is required",
                  },
                ]}
              >
                <Input
                  maxLength={60}
                  placeholder="Products Sections Short Description"
                />
              </Form.Item>

              <Form.Item
                label="Products Page Title"
                name="title"
                rules={[
                  {
                    required: true,
                    message: "Products Page Title is required",
                  },
                ]}
              >
                <Input maxLength={60} placeholder="Input Products Page Title" />
              </Form.Item>
              <Form.Item
                label="Products Page Detailed Description"
                name="detailedDescription"
                rules={[
                  {
                    required: true,
                    message: "Products Page Detailed Description is required",
                  },
                ]}
              >
                <Input.TextArea
                  allowClear
                  showCount
                  maxLength={500}
                  placeholder="Products Page Detailed Description"
                />
              </Form.Item>
            </Form>
          </ModalContainer>
        </Suspense>
      )}
    </>
  );
};

export default ProductsSection;
