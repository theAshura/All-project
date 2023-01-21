import React, { FC, Suspense, useCallback, useState } from "react";
import TableCommon from "components/table/Table";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Form, message } from "antd";

import { TYPE_ACTION } from "utils/constants";
import AreaManagesModificationForm from "./ContactUsForm";
const ModalContainer = React.lazy(
  () => import("components/modal/ModalContainer")
);

const dataSource = [
  {
    key: "1",
    contact: "Test 1",
    shortDescription: "Test 1",
  },
];

export interface ValueFormContactUs {
  title: string;
  shortDescription: string;
  hyperLink: [];
}

export interface ParamsFilterSearch {
  status: "Active" | "Inactive";
  managersName: string;
}
const ContactUs: FC = () => {
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [params, setParams] = useState<ParamsFilterSearch>({
    status: "Active",
    managersName: "",
  });
  const [type, setType] = useState<string>(TYPE_ACTION.ADD);
  const columns = [
    {
      title: "No",
      dataIndex: "key",
      key: "key",
      width: 80,
    },
    {
      title: "Contact Us Title",
      dataIndex: "contact",
      key: "contact",
    },
    {
      title: "Contact Us Short Description",
      dataIndex: "shortDescription",
      key: "shortDescription",
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
            onClick={() => openModal(TYPE_ACTION.EDIT)}
          />
          <DeleteOutlined className="deleteAction" />
        </div>
      ),
    },
  ];

  const openModal = useCallback((type: string) => {
    setType(type);
    setVisibleModal(true);
  }, []);

  const onDelete = useCallback((e: React.MouseEvent<HTMLElement>) => {
    message.success("!Delete Successfully");
  }, []);

  const onSubmit = useCallback((value: ValueFormContactUs) => {
    message.success("Update Successfully!");
    setVisibleModal(false);
  }, []);

  return (
    <>
      <TableCommon
        columns={columns}
        dataSource={dataSource}
        page={1}
        pageSize={1}
      />

      {visibleModal && (
        <Suspense fallback={null}>
          <ModalContainer
            isModalOpen={visibleModal}
            title={"Edit Contact Us"}
            onSubmit={form.submit}
            onClose={() => setVisibleModal(false)}
            okText={"Save"}
          >
            <AreaManagesModificationForm
              form={form}
              onFinish={onSubmit}
              type={type}
            />
          </ModalContainer>
        </Suspense>
      )}
    </>
  );
};

export default ContactUs;
