import React, { FC, Suspense, useCallback, useState } from "react";
import TableCommon from "components/table/Table";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Col, Form, message, Row, Select, Switch } from "antd";
import Search from "antd/es/input/Search";
import classes from "./user-management.module.scss";
import { OPTION_ROLE, OPTION_STATUS, TYPE_ACTION } from "utils/constants";
import cx from "classnames";
import UserManagementForm from "./UserManagementForm";
const ModalContainer = React.lazy(
  () => import("components/modal/ModalContainer")
);

const dataSource = [
  {
    key: "1",
    name: "thangdt",
    employeeName: "Thang Dau",
    dateCreated: "30/12/2022",
    role: "ADMIN",
    status: "Active",
  },
  {
    key: "2",
    name: "thangdt1",
    employeeName: "Thang Dau",
    dateCreated: "30/12/2022",
    role: "ADMIN",
    status: "Active",
  },
];

export interface ValueFormUserManagment {
  name: string;
  employeeName: string;
  role: number;
  email?: string;
  status: string;
}

export interface ParamsFilterSearch {
  status: string;
  search: string;
  role: string;
}
const UserManagement: FC = () => {
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [params, setParams] = useState<ParamsFilterSearch>({
    status: "Active",
    search: "",
    role: OPTION_ROLE[0].value,
  });
  const [page, setPage] = useState<number>();
  const [pageSize, setPageSize] = useState<number>();
  const [type, setType] = useState<string>(TYPE_ACTION.ADD);
  const columns = [
    {
      title: "No",
      dataIndex: "key",
      key: "key",
      width: 80,
    },
    {
      title: "Username",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Employee Name",
      dataIndex: "employeeName",
      key: "employeeName",
    },
    {
      title: "Date Created",
      dataIndex: "dateCreated",
      key: "dateCreated",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
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
            onClick={() => openModal(TYPE_ACTION.EDIT)}
          />
          <DeleteOutlined className="deleteAction" />
          <Switch defaultChecked />
        </div>
      ),
    },
  ];

  const openModal = useCallback((type: string) => {
    setType(type);
    setVisibleModal(true);
  }, []);

  const onSearch = useCallback(
    (search: string) => {
      setParams({ ...params, search });
    },
    [params]
  );

  const handleChangeStatus = useCallback(
    (status: string) => {
      setParams({ ...params, status });
    },
    [params]
  );

  const handleChangeRole = useCallback(
    (value: string) => {
      setParams({ ...params, status: value ? "Active" : "Inactive" });
    },
    [params]
  );

  const onDelete = useCallback((e: React.MouseEvent<HTMLElement>) => {
    message.success("Delete Success");
  }, []);

  const onChangePage = useCallback((page: number, pageSize: number) => {
    setPage(page);
    setPageSize(pageSize);
  }, []);

  const onSubmit = useCallback((value: ValueFormUserManagment) => {
    message.success("Update Successfully!");
    setVisibleModal(false);
  }, []);

  return (
    <>
      <Row gutter={16} className={classes.mb10}>
        <Col>
          <Button onClick={() => openModal(TYPE_ACTION.ADD)}>Create</Button>
        </Col>
      </Row>
      <Row justify="space-between" className={classes.mb10}>
        <Col span={8}>
          <Search
            placeholder="Search by Username, Employee Name"
            onSearch={onSearch}
            enterButton
          />
        </Col>
        <Col span={8}>
          <div className={classes.floatR}>
            <Select
              className={cx(classes.selectW10, classes.mr10)}
              defaultValue={OPTION_STATUS[0].value}
              onChange={handleChangeStatus}
              options={OPTION_STATUS}
            />
            <Select
              className={classes.selectW10}
              defaultValue={OPTION_ROLE[0].value}
              onChange={handleChangeRole}
              options={OPTION_STATUS}
            />
          </div>
        </Col>
      </Row>

      <TableCommon
        columns={columns}
        dataSource={dataSource}
        page={page}
        pageSize={pageSize}
        onChange={onChangePage}
      />

      {visibleModal && (
        <Suspense fallback={null}>
          <ModalContainer
            isModalOpen={visibleModal}
            title={
              type === TYPE_ACTION.ADD
                ? "Create User Management"
                : "Edit User Password"
            }
            onSubmit={form.submit}
            onClose={() => setVisibleModal(false)}
            okText={"Save"}
          >
            <UserManagementForm form={form} onFinish={onSubmit} type={type} />
          </ModalContainer>
        </Suspense>
      )}
    </>
  );
};

export default UserManagement;
