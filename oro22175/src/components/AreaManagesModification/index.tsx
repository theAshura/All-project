import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Form, Modal, ModalFuncProps, Select } from "antd";
import Search from "antd/es/input/Search";
import { STATUS_COMMON } from "api/product/product.interface";
import { DataSaler, PostSalerParams } from "api/saler/saler.interface";
import cx from "classnames";
import ModalDelete from "components/modal/ModalDelete";
import TableCommon from "components/table/Table";
import { formatDateLocalNoTime } from "helpers/date.helper";
import { useCallbackPrompt } from "hooks/useCallbackPrompt";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actions, TStore } from "store";
import styled from "styled-components";
import { OPTION_STATUS, TYPE_ACTION } from "utils/constants";
import classes from "./area-manages-modification.module.scss";
import AreaManagerForm from "./AreaManagerForm";
const ModalContainer = React.lazy(
  () => import("components/modal/ModalContainer")
);
export interface ParamsFilterSearch {
  status: "Active" | "Inactive";
  salerName: string;
}

const Products = () => {
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [visibleModalDelete, setVisibleModalDelete] = useState<boolean>(false);
  const [visibleModalConfirm, setVisibleModalConfirm] =
    useState<boolean>(false);
  const [visibleModalConfirmStatus, setVisibleModalConfirmStatus] =
    useState<boolean>(false);
  const [isLoadingButtonFooter, setIsLoadingButtonFooter] =
    useState<boolean>(false);
  useState<{ value: string; label: string }[]>();
  const [dataSource, setDataSource] = useState<DataSaler[]>([]);
  const [type, setType] = useState(TYPE_ACTION.ADD);
  const dispatch = useDispatch();
  const { isLoading, data, isReload } = useSelector(
    (state: TStore) => state.saler
  );
  const state = useSelector((state: TStore) => state?.saler.state.data);

  const [config, setConfig] = useState<ModalFuncProps>();
  const [id, setId] = useState<string | null>("");
  const [isChangeValues, setIsChangeValues] = useState<boolean>(false);
  const [showPrompt, confirmNavigation, cancelNavigation] =
    useCallbackPrompt(isChangeValues);
  const [optionState, setOptionState] =
    useState<{ value: string; label: string }[]>();
  const [params, setParams] = useState<any>({
    status: undefined,
    page: "1",
    limit: "10",
    content: "",
    stateId: "",
  });
  const getDefaultData = useCallback(
    (newParams?: object) => {
      dispatch(
        actions.saler.fetchSaler({
          ...params,
          ...newParams,
        })
      );
    },
    [dispatch, params]
  );
  useEffect(() => {
    if (state) {
      const option = state?.data.map((item: { _id: string; name: string }) => {
        return { value: item._id, label: item.name };
      });

      setOptionState(option);
    }
  }, [state]);
  useEffect(() => {
    if (showPrompt && isChangeValues) {
      config && Modal.confirm(config);
      setVisibleModalConfirm(true);
    } else {
      Modal.destroyAll();
    }
  }, [config, isChangeValues, showPrompt]);
  // useEffect(() => {
  //   dispatch(actions.saler.fetchSaler(params));
  // }, [dispatch, params, isReload]);

  useEffect(() => {
    getDefaultData();
  }, [getDefaultData, params]);
  useEffect(() => {
    return setDataSource(data?.data?.data || []);
  }, [data?.data]);
  const [form] = Form.useForm();

  const columns = [
    {
      title: "No",
      dataIndex: "_id",
      key: "_id",
      width: "5%",
      render: (value: number, saler: DataSaler, index: number) => {
        return (
          data?.data &&
          ((data?.data?.currentPage || 1) - 1) * Number(params.limit) +
            index +
            1
        );
      },
    },
    {
      title: "Manager Name",
      dataIndex: "name",
      key: "name",

      render: (value: Date) => {
        return <div className={classes.columnName}>{value}</div>;
      },
    },
    {
      title: "Date Created",
      key: "createdAt",
      dataIndex: "createdAt",
      render: (value: Date) => {
        return formatDateLocalNoTime(value);
      },
    },
    {
      title: "Location",
      key: "states",
      dataIndex: "states",
      render: (app: DataSaler[]) => {
        return <div>{app?.map((item) => item?.name).join(", ")}</div>;
      },
    },
    {
      title: "Email",
      key: "email",
      dataIndex: "email",
    },
    {
      title: "Phone Number",
      key: "phoneNumber",
      dataIndex: "phoneNumber",
      render: (phone: string) => {
        return <div>{phone?.replaceAll("-", "") || ""}</div>;
      },
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",

      render: (status: STATUS_COMMON, item: DataSaler) => {
        return (
          <div
            className={cx(
              classes.columnStatus,
              item.status === STATUS_COMMON.ACTIVE
                ? classes.active
                : classes.inactive
            )}
          >
            {status}
          </div>
        );
      },
    },
    {
      title: "Action",
      dataIndex: "Action",
      align: "center",
      key: "Action",
      width: "10%",
      render: (text: string, item: DataSaler) => (
        <div className="customAction">
          <EditOutlined
            className="editAction"
            onClick={() => openModal(item._id, TYPE_ACTION.EDIT)}
          />
          <DeleteOutlined
            className="deleteAction"
            onClick={() => openModalDelete(item._id)}
          />
          <div
            className={cx(
              classes.actionStatus,
              item.status === STATUS_COMMON.ACTIVE
                ? classes.inactive
                : classes.active
            )}
            onClick={() =>
              openModalConfirmStatus(item.status as STATUS_COMMON, item)
            }
          >
            {StatusButton(item.status)}
          </div>
        </div>
      ),
    },
  ];

  const onSearch = useCallback(
    (content: string) => {
      setParams({ ...params, content, page: "1" });
    },
    [params]
  );

  const handleChangeStatusCoulumn = useCallback(
    (status: STATUS_COMMON, dataSaler: DataSaler) => {
      const body: PostSalerParams = {
        name: dataSaler.name,
        avatar: dataSaler?.avatar?._id || "",
        states: dataSaler?.states.map((item) => item._id),
        phoneNumber: dataSaler.phoneNumber,
        email: dataSaler.email,
        status:
          status === STATUS_COMMON.ACTIVE
            ? STATUS_COMMON.IN_ACTIVE
            : STATUS_COMMON.ACTIVE,
      };
      const paramsConvert = {
        id: dataSaler._id,
        body,
        getData: () => getDefaultData(),
      };
      dispatch(actions.saler.putSaler(paramsConvert));
    },
    [dispatch, getDefaultData]
  );

  const openModal = useCallback(
    (id: string | null, type: string) => {
      setType(type);
      setId(id || null);
      form.resetFields();
      setVisibleModal(true);
    },
    [form]
  );

  const openModalDelete = useCallback((id: string) => {
    setId(id);
    setVisibleModalDelete(true);
  }, []);

  const handleChangeStatus = useCallback(
    (status: STATUS_COMMON) => {
      if (status === STATUS_COMMON.ALL) {
        setParams({ ...params, status: undefined, page: "1" });
      } else {
        setParams({ ...params, status, page: "1" });
      }
    },
    [params]
  );

  const getDefaultState = useCallback(() => {
    return dispatch(actions.saler.GetListStatesAction({ limit: "100" }));
  }, [dispatch]);
  useEffect(() => {
    getDefaultState();
  }, [getDefaultState]);

  const onChangePage = useCallback(
    (page: number, pageSize: number) => {
      setParams({ ...params, page: `${page}`, limit: `${pageSize}` });
    },
    [params]
  );
  const handleChangeState = useCallback(
    (status: string) => {
      setParams({ ...params, stateId: status, page: "1" });
    },
    [params]
  );
  const StatusButton = (status: string) => {
    if (status === STATUS_COMMON.ACTIVE) {
      return <div>Deactive</div>;
    }
    return <div>Reactive</div>;
  };

  const onHandleOkPopupConfirm = useCallback(() => {
    showPrompt && confirmNavigation();
    setVisibleModalConfirm(false);
    setVisibleModal(false);
    Modal.destroyAll();
    setIsChangeValues(false);
  }, [confirmNavigation, showPrompt]);

  useEffect(() => {
    setConfig({
      open: visibleModalConfirm,
      title: "Infomation will not be saved",
      content: "Are you sure? Information entered will not be saved",
      centered: true,
      onOk: () => onHandleOkPopupConfirm(),
      onCancel: () => {
        showPrompt && cancelNavigation();
        Modal.destroyAll();
        setVisibleModalConfirm(false);
      },
    });
  }, [
    cancelNavigation,
    onHandleOkPopupConfirm,
    showPrompt,
    visibleModalConfirm,
  ]);

  const openModalConfirmStatus = useCallback(
    (status: STATUS_COMMON, item: DataSaler) => {
      config &&
        Modal.confirm({
          open: visibleModalConfirmStatus,
          title: "Infomation will save status",
          content: "Do you want to change the status?",
          centered: true,
          onOk: () => {
            handleChangeStatusCoulumn(status, item),
              setVisibleModalConfirmStatus(false);
          },
          onCancel: () => {
            setVisibleModalConfirmStatus(false);
          },
        });
    },
    [config, handleChangeStatusCoulumn, visibleModalConfirmStatus]
  );
  const onChangeForm = useCallback((checkChangeForm: boolean) => {
    setIsChangeValues(checkChangeForm);
  }, []);
  return (
    <>
      <Button type="primary" onClick={() => openModal(null, TYPE_ACTION.ADD)}>
        Create
      </Button>
      <RightComponent>
        <SearchComponent>
          <Search
            className={classes.mb10}
            allowClear
            placeholder="Search by Manager Name"
            onSearch={onSearch}
            enterButton
            maxLength={200}
          />
        </SearchComponent>
        <SelectComponent>
          <SelectStatusComponent>
            <Select
              defaultValue={STATUS_COMMON.ALL}
              onChange={handleChangeStatus}
              options={OPTION_STATUS}
            />
          </SelectStatusComponent>
          <SelectStateComponent>
            <Select
              showSearch
              allowClear
              placeholder="Select State"
              optionFilterProp="label"
              filterOption={true}
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              className={cx(classes.selectW10, classes.mb10)}
              onChange={handleChangeState}
              options={optionState}
            />
          </SelectStateComponent>
        </SelectComponent>
      </RightComponent>

      <TableCommon
        columns={columns}
        loading={isLoading}
        dataSource={dataSource}
        page={data?.data?.currentPage}
        pageSize={dataSource.length}
        onChange={onChangePage}
        total={data?.data?.count}
      />

      {visibleModal && (
        <Suspense fallback={null}>
          <ModalContainer
            isModalOpen={visibleModal}
            title={
              type === TYPE_ACTION.ADD
                ? "Create New Area Manager"
                : "Edit Area Manager"
            }
            onSubmit={form.submit}
            onClose={() =>
              (isChangeValues && config && Modal.confirm(config)) ||
              (form.resetFields(), Modal.destroyAll(), setVisibleModal(false))
            }
            okText={"Save"}
            isLoadingButton={isLoadingButtonFooter}
          >
            <AreaManagerForm
              setIsLoadingButtonFooter={setIsLoadingButtonFooter}
              setVisibleModal={setVisibleModal}
              onChangeForm={onChangeForm}
              form={form}
              id={id}
              getDefaultData={getDefaultData}
            />
          </ModalContainer>
        </Suspense>
      )}

      {visibleModalDelete && (
        <Suspense fallback={null}>
          <ModalDelete
            isModalOpen={visibleModalDelete}
            centered
            onSubmit={() => {
              id &&
                dispatch(
                  actions.saler.deleteSaler({
                    id,
                    getData: () =>
                      getDefaultData({
                        page:
                          data?.data?.data?.length === 1 &&
                          data?.data?.currentPage > 1
                            ? data?.data?.currentPage - 1
                            : data?.data?.currentPage,
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
    </>
  );
};
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
export default Products;
