import React, { FC, Suspense, useCallback, useState } from "react";
import TableCommon from "components/table/Table";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Form, Input, message, UploadFile } from "antd";
import ImageCropped from "components/ImageCropped";
import { UploadChangeParam } from "antd/es/upload";
import { UploadFileStatus } from "antd/es/upload/interface";
const ModalContainer = React.lazy(
  () => import("components/modal/ModalContainer")
);

const dataSource = [
  {
    key: "1",
    title: "Banner demo 1",
    status: "active",
    address: "10 Downing Street",
  },
];

export interface ValueFormBanner {
  title: string;
  fileList: UploadFile[];
}
const Banner: FC = () => {
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
      title: "Title Banner",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
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
      fileList: [],
    };
  }, []);

  const onChangeFile = useCallback((info: UploadChangeParam<UploadFile>) => {
    // call api
    if (info.file.status === "done") {
      setFileList(info.fileList);
    }
  }, []);

  const onSubmit = useCallback((value: ValueFormBanner) => {
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
            title={"Edit banner"}
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
                label="Title Banner"
                name="title"
                rules={[
                  {
                    required: true,
                    message: "Title Banner is required",
                  },
                ]}
              >
                <Input maxLength={60} placeholder="Input Title Banner" />
              </Form.Item>

              <Form.Item
                label="Browse Picture"
                name="fileList"
                rules={[
                  { required: true, message: "Browse Picture is required" },
                ]}
              >
                <ImageCropped
                  fileList={fileList}
                  onChange={onChangeFile}
                  maxLength={1}
                />
              </Form.Item>
            </Form>
          </ModalContainer>
        </Suspense>
      )}
    </>
  );
};

export default Banner;
