import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Form, UploadFile } from "antd";
import TableCommon from "components/table/Table";
import React, { FC, Suspense, useCallback, useEffect, useState } from "react";
import styled from "styled-components";
import ProductSelectorForm from "./ProductSelectorForm";
const ModalContainer = React.lazy(
  () => import("components/modal/ModalContainer")
);

export interface ValueFormProducts {
  title: string;
  detailedDescription: string;
  shortDescription: string;
  fileList: UploadFile[];
}
const ProductSelectorComponent: FC = () => {
  const [form] = Form.useForm();
  const [visibleModalEdit, setVisibleModalEdit] = useState<boolean>(false);
  const [visibleModalCreate, setVisibleModalCreate] = useState<boolean>(false);
  const [dataSource, setDataSource] = useState([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetch("https://jsonplaceholder.typicode.com/todos")
      .then((res) => res.json())
      .then((data) => setDataSource(data))
      .catch((err) => console.log(err));
  }, []);
  const columns = [
    {
      title: "No",
      dataIndex: "userId",
      key: "key",
      width: 80,
    },
    {
      title: "Products Selector Title",
      dataIndex: "title",
      key: "productPortfolioLiterature",
    },
    {
      title: "Products Selector Short Description",
      dataIndex: "title",
      key: "productPortfolioVideo",
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
  const onChangePage = useCallback((page: number, pageSize: number) => {
    setPage(page);
    setPageSize(pageSize);
  }, []);

  return (
    <>
      <ButtonS onClick={() => setVisibleModalCreate(true)}>Create</ButtonS>
      <TableCommon
        columns={columns}
        dataSource={dataSource}
        page={page}
        pageSize={pageSize}
        onChange={onChangePage}
      />

      {visibleModalEdit && (
        <Suspense fallback={null}>
          <ModalContainer
            isModalOpen={visibleModalEdit}
            onClose={() => setVisibleModalEdit(false)}
            title="Edit Product Selector"
            onSubmit={form.submit}
          >
            <ProductSelectorForm
              form={form}
              setVisibleModal={setVisibleModalEdit}
            />
          </ModalContainer>
        </Suspense>
      )}
      {visibleModalCreate && (
        <Suspense fallback={null}>
          <ModalContainer
            title="Create Product Selector"
            isModalOpen={visibleModalCreate}
            onClose={() => setVisibleModalCreate(false)}
            onSubmit={form.submit}
          >
            <ProductSelectorForm
              form={form}
              setVisibleModal={setVisibleModalCreate}
            />
          </ModalContainer>
        </Suspense>
      )}
    </>
  );
};
const ButtonS = styled(Button)`
  margin-bottom: 2rem;
`;
export default ProductSelectorComponent;
