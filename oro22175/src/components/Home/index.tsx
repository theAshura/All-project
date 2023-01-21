import React, { FC, Suspense, useCallback, useEffect, useState } from "react";
import TableCommon from "components/table/Table";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import ImageCropped from "components/ImageCropped";

const ModalContainer = React.lazy(
  () => import("components/modal/ModalContainer")
);

const Home: FC = () => {
  const [visibleModalEdit, setVisibleModalEdit] = useState<boolean>(false);
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
      title: "id",
      dataIndex: "id",
      key: "id",
      width: "10%",
    },
    {
      title: "userId",
      dataIndex: "userId",
      key: "userId",
      width: "10%",
    },
    {
      title: "title",
      key: "title",
      dataIndex: "title",
      width: "60%",
    },
    {
      title: "Action",
      dataIndex: "Action",
      key: "Action",
      width: "10%",

      render: () => (
        <div style={{ width: "4rem" }} className="customAction">
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
          >
            <ImageCropped aspect={1} />
          </ModalContainer>
        </Suspense>
      )}
    </>
  );
};

export default Home;
