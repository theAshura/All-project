import React, { FC, Suspense, useCallback, useEffect, useState } from "react";
import { CloseOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Form, message, Modal, ModalFuncProps, Select } from "antd";
import Search from "antd/es/input/Search";
import {
  ApplicationParams,
  DataApllication,
  Status,
} from "api/product-selector/application-selector.interface";
import { Product, STATUS_COMMON } from "api/product/product.interface";
import ModalDelete from "components/modal/ModalDelete";
import TableCommon from "components/table/Table";
import { formatDateLocalNoTime } from "helpers/date.helper";

import { useDispatch, useSelector } from "react-redux";
import { actions, TStore } from "store";
import styled from "styled-components";
import { OPTION_STATUS } from "utils/constants";
import classes from "./application-modification.module.scss";
import ApplicationForm from "./ApplicationForm";
import {
  createApplicationRequest,
  editApplicationRequest,
} from "api/product-selector/application-selector.api";
import { mapErrorMessage } from "helpers/utilities.helper";
const ModalContainer = React.lazy(
  () => import("components/modal/ModalContainer")
);

export interface ValueFormApplicationModification {
  applicationName: string;
}

export interface ParamsFilterSearch {
  status?: "Active" | "Inactive";
  applicationName?: string;
  page?: number | undefined;
  pageSize?: number | undefined;
  search?: string | undefined;
}
const ApplicationModification: FC = () => {
  const { application, loading } = useSelector(
    (state: TStore) => state?.application
  );
  const [searchValue, setSearchValue] = useState({ search: "" });
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState<string>("1");

  const [visibleModalDelete, setVisibleModalDelete] = useState<boolean>(false);
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [visibleModalEdit, setVisibleModalEdit] = useState<boolean>(false);
  const [visibleModalCancel, setVisibleModalCancel] = useState<boolean>(false);
  const [isChangeValues, setIsChangeValues] = useState<boolean>(false);

  const [visibleModalChangeStatus, setVisibleModalChangeStatus] =
    useState<boolean>(false);

  const [form] = Form.useForm();
  const dispatch = useDispatch();
  const [applicationDetail, setApplicationDetail] = useState<any>();
  const [params, setParams] = useState<any>({
    status: undefined,
    content: undefined,
    page: "1",
  });
  // useBackBrowser({ event: () => back() });
  const [config, setConfig] = useState<ModalFuncProps>();
  const back = useCallback(() => {
    if (visibleModal || visibleModalEdit) {
      config && Modal.confirm(config);
    } else {
      history.back();
    }
  }, [config, visibleModal, visibleModalEdit]);
  // const getDefault = useCallback(() => {
  //   return dispatch(
  //     actions.application.getListApplicationAction({
  //       status: params.status === "all" ? undefined : params.status,
  //       content: params.content,
  //       page: page,
  //       limit: pageSize.toString(),
  //     })
  //   );
  // }, [dispatch, page, pageSize, params.content, params.status]);
  const getDefaultData = useCallback(
    (newParams?: object) => {
      dispatch(
        actions.application.getListApplicationAction({
          status: params.status === "all" ? undefined : params.status,
          content: params.content,
          page: page,
          limit: pageSize.toString(),
          ...newParams,
        })
      );
    },
    [dispatch, params, page, pageSize]
  );
  const openModalConfirmStatus = useCallback(
    (status: STATUS_COMMON, item: Product) => {
      const handleChangeActive = (field: string, item: Product) => {
        dispatch(
          actions.application.editApplicationAction({
            dataForm: {
              name: item.name,
              status: field === "active" ? Status.INACTIVE : Status.ACTIVE,
            },
            id: item?._id,
            getData: getDefaultData,
          })
        );
      };
      config &&
        Modal.confirm({
          open: visibleModalChangeStatus,
          title: "Infomation will save status",
          content: "Do you want to change the status?",
          centered: true,
          onOk: () => {
            handleChangeActive(status, item),
              setVisibleModalChangeStatus(false);
          },
          onCancel: () => {
            setVisibleModalChangeStatus(false);
          },
        });
    },
    [config, dispatch, getDefaultData, visibleModalChangeStatus]
  );
  useEffect(() => {
    setConfig({
      title: "Infomation will not be saved",
      content: "Are you sure? Information entered will not be saved",
      onOk: () => {
        setVisibleModalCancel(false),
          setVisibleModal(false),
          setVisibleModalEdit(false),
          history.back();
      },
      onCancel: () => {
        setVisibleModalCancel(false);
      },
    });
  }, []);
  const handleChangeStatus = useCallback(
    (status) => {
      if (status === "all") {
        dispatch(
          actions.application.getListApplicationAction({
            status: undefined,
          })
        );
        setParams({
          ...params,
          status: undefined,
          content: params.content,
        });
        setPage("1");
      }
      if (status === "active") {
        setParams({ ...params, status: "active", content: params.content });
        setPage("1");
      }
      if (status === "inactive") {
        setParams({
          ...params,
          status: "inactive",
          content: params.content,
        });
        setPage("1");
      }
    },
    [dispatch, params]
  );
  const StatusButton = (data: string) => {
    if (data === "active") {
      return <div>Deactive</div>;
    }
    return <div>Reactive</div>;
  };
  useEffect(() => {
    getDefaultData();
  }, [getDefaultData]);
  const columns = [
    {
      title: "No",
      dataIndex: "key",
      key: "key",
      width: 80,

      render: (field: string, item: DataApllication, index: number) => {
        return (
          application &&
          ((application?.currentPage || 1) - 1) * pageSize + index + 1
        );
      },
    },
    {
      title: "Application Name",
      dataIndex: "name",
      key: "name",
      render: (value: string) => {
        return <div className={classes.columnName}>{value}</div>;
      },
    },
    {
      title: "Date Created",
      width: "10%",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (field: Date) => {
        return formatDateLocalNoTime(field);
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      width: "10%",
      key: "status",
      render: (field: string, item: DataApllication) => {
        return (
          <StatusWrap
            style={
              item.status === "active"
                ? { color: "#4cb3e4" }
                : { color: "#ee5c5e" }
            }
          >
            {item.status}
          </StatusWrap>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "Action",
      align: "center",
      key: "Action",
      width: "10%",
      render: (field: STATUS_COMMON, item: Product) => (
        <div className="customAction">
          <EditOutlined
            className="editAction"
            onClick={() => openModalEdit(item._id)}
          />
          <DeleteOutlined
            onClick={() => handleDelete(item._id)}
            className="deleteAction"
          />
          <StatusAction
            onClick={() => openModalConfirmStatus(field, item)}
            style={
              item.status === "active"
                ? { color: "#ee5c5e" }
                : { color: "#4cb3e4" }
            }
            className={classes.activeSelected}
          >
            {StatusButton(item.status)}
          </StatusAction>
        </div>
      ),
    },
  ];
  const onChangeForm = useCallback(() => {
    setIsChangeValues(true);
  }, []);
  const handleDelete = useCallback(
    (id: string) => {
      const userFrom = application?.data?.find(
        (data: { _id: string }) => data._id === id
      );
      if (userFrom) {
        userFrom && setApplicationDetail(userFrom);
      }
      setVisibleModalDelete(true);
    },
    [application?.data]
  );
  const initialValues = useCallback(() => {
    return {
      applicationName: "",
      content: "",
    };
  }, []);
  const openModal = useCallback(() => {
    setVisibleModal(true);
    form.resetFields();
  }, [form]);
  const openModalEdit = useCallback(
    (id: string) => {
      setVisibleModalEdit(true);

      const userFrom = application?.data?.find((data) => data._id === id);

      if (userFrom) {
        userFrom && setApplicationDetail(userFrom);
      }
      form.resetFields();
    },

    [application?.data, form]
  );

  const onChangePage = useCallback(
    (page: number, pageSize: number) => {
      dispatch(
        actions.application.getListApplicationAction({
          page: page.toString(),
          limit: pageSize.toString(),
          status: params.status,
          content: params.content,
        })
      );
      setPageSize(pageSize);
      setPage(page.toString());
    },
    [dispatch, params.content, params.status]
  );
  const onSubmit = useCallback(
    async (value: ApplicationParams) => {
      try {
        await createApplicationRequest({
          ...value,
          status: Status.ACTIVE,
        });
        message.success("Created Successfully");
        getDefaultData();
        setVisibleModal(false);
      } catch (error) {
        mapErrorMessage(error);
      }
    },
    [getDefaultData]
  );

  const onSeach = useCallback(() => {
    dispatch(
      actions.application.getListApplicationAction({
        content: searchValue.search,
        status: params?.status === "all" ? undefined : params?.status,
      })
    );
  }, [dispatch, params?.status, searchValue.search]);
  const onSubmitEdit = useCallback(
    async (value) => {
      // dispatch(
      //   actions.application.editApplicationAction({
      //     dataForm: { ...value, status: applicationDetail?.status },
      //     id: applicationDetail?._id,
      //     getData: getDefault,
      //   })
      // );

      try {
        await editApplicationRequest({
          dataForm: { ...value, status: applicationDetail?.status },
          id: applicationDetail?._id,
          getData: getDefaultData,
        });
        message.success("Update Successfully!");
        getDefaultData();
        setVisibleModalEdit(false);
        setVisibleModal(false);
        setVisibleModalEdit(false);
        setIsChangeValues(false);
      } catch (error) {
        mapErrorMessage(error);
      }
    },
    [applicationDetail?._id, applicationDetail?.status, getDefaultData]
  );

  const onSearch = useCallback(
    (content: string) => {
      setParams({ ...params, content, status: params.status });
      setPage("1");
    },
    [params]
  );
  return (
    <>
      <Button type="primary" onClick={openModal}>
        Create
      </Button>
      <RightComponent>
        <SearchComponent>
          <Search
            className={classes.customSelectSearch}
            allowClear
            placeholder="Search by Application Name"
            onSearch={onSearch}
            enterButton
            maxLength={200}
          />
        </SearchComponent>
        <SelectComponent>
          <Select
            defaultValue={OPTION_STATUS[0].label}
            onChange={handleChangeStatus}
            options={OPTION_STATUS}
          />
        </SelectComponent>
      </RightComponent>

      <TableCommon
        columns={columns}
        dataSource={application?.data}
        page={application?.currentPage}
        pageSize={application?.data.length}
        onChange={onChangePage}
        total={application?.count}
        loading={loading}
      />
      {visibleModal && (
        <Suspense fallback={null}>
          <ModalContainer
            closable={false}
            isModalOpen={visibleModal}
            title={"Create Product Section"}
            onSubmit={form.submit}
            centered
            onClose={() => {
              setVisibleModal(false);
              isChangeValues && setVisibleModalCancel(true);
              setIsChangeValues(false);
            }}
            okText={"Save"}
          >
            <IconClosed
              onClick={() => {
                setVisibleModal(false);
                isChangeValues && setVisibleModalCancel(true);
                setIsChangeValues(false);
              }}
            >
              <CloseOutlined />
            </IconClosed>

            <Form
              form={form}
              initialValues={initialValues}
              labelAlign={"left"}
              layout="vertical"
              onFinish={onSubmit}
              onChange={onChangeForm}
            >
              <ApplicationForm form={form} onFinish={onSubmit} />
            </Form>
          </ModalContainer>
        </Suspense>
      )}
      {visibleModalEdit && (
        <Suspense fallback={null}>
          <ModalContainer
            closable={false}
            isModalOpen={visibleModalEdit}
            title={"Edit Product Section"}
            onSubmit={form.submit}
            centered
            onClose={() => {
              isChangeValues && setVisibleModalCancel(true);
              setVisibleModalEdit(false);
              setIsChangeValues(false);
            }}
            okText={"Save"}
          >
            <IconClosed
              onClick={() => {
                isChangeValues && setVisibleModalCancel(true);
                setVisibleModalEdit(false);
                setIsChangeValues(false);
              }}
            >
              <CloseOutlined />
            </IconClosed>
            <Form
              onChange={onChangeForm}
              form={form}
              initialValues={initialValues}
              labelAlign={"left"}
              layout="vertical"
              onFinish={onSubmitEdit}
            >
              <ApplicationForm
                form={form}
                user={applicationDetail}
                onFinish={onSubmitEdit}
              />
            </Form>
          </ModalContainer>
        </Suspense>
      )}
      {visibleModalDelete && (
        <Suspense fallback={null}>
          <ModalDelete
            isModalOpen={visibleModalDelete}
            centered
            onSubmit={() => {
              dispatch(
                actions.application.deleteApplicationAction({
                  id: applicationDetail._id,
                  getData: () =>
                    getDefaultData({
                      page:
                        application?.data?.length === 1 &&
                        application?.currentPage &&
                        application?.currentPage > 1
                          ? application?.currentPage - 1
                          : application?.currentPage,
                    }),
                })
              );
              setVisibleModalDelete(false);
            }}
            onClose={() => setVisibleModalDelete(false)}
            okText={"Save"}
          ></ModalDelete>
        </Suspense>
      )}
      {visibleModalCancel && (
        <Suspense fallback={null}>
          <ModalContainer
            title="Infomation will not be saved"
            isModalOpen={visibleModalCancel}
            centered
            onSubmit={() => {
              setVisibleModalCancel(false);
            }}
            onClose={() => {
              setVisibleModal(true);
              setVisibleModalCancel(false);
            }}
            okText={"Leave"}
          >
            Are you sure? Information entered will not be saved.
          </ModalContainer>
        </Suspense>
      )}
      {visibleModalChangeStatus && (
        <Suspense fallback={null}>
          <ModalContainer
            title="Infomation will not be saved"
            isModalOpen={visibleModalChangeStatus}
            centered
            onSubmit={() => {
              setVisibleModalChangeStatus(false);
            }}
            onClose={() => {
              setVisibleModalChangeStatus(false);
            }}
            okText={"Leave"}
          >
            Are you sure? Information entered will not be saved.
          </ModalContainer>
        </Suspense>
      )}
    </>
  );
};

const IconClosed = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  cursor: pointer;
`;
const StatusWrap = styled.div`
  width: 5rem;
  height: 2.5rem;
  border-radius: 5px;
  display: table-cell;
  vertical-align: middle;

  font-size: 14px;
  font-weight: 600;
  &::first-letter {
    text-transform: capitalize;
  }
`;
const StatusAction = styled.div`
  padding-left: 1rem;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
`;
export const SelectComponent = styled.div`
  display: flex;
  margin-bottom: 16px;

  .ant-select {
    min-width: 102px;
  }
`;
export const SearchComponent = styled.div`
  width: 32%;
  margin-bottom: 16px;
  margin-right: 16px;

  .ant-select {
    min-width: 200px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    width: 100%;
  }
`;
export const RightComponent = styled.div`
  padding-top: 1rem;
  display: flex;
  justify-content: space-between;
  @media (max-width: 500px) {
    flex-direction: column;
    width: 100%;
    justify-content: space-between;
  }
`;

export const SelectStatusComponent = styled.div`
  margin-right: 1rem;
  @media (max-width: 500px) {
    flex-direction: column;
    width: 100%;
  }
`;
export const SelectStateComponent = styled.div`
  @media (max-width: 500px) {
    flex-direction: column;
  }
`;
export default ApplicationModification;
