import React, { Suspense, useCallback, useEffect, useState } from "react";
import TableCommon from "components/table/Table";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Col, Form, Modal, ModalFuncProps, Row, Select } from "antd";
import Search from "antd/es/input/Search";
import cx from "classnames";
import classes from "../../components/Products/product.module.scss";
import ProductForm from "./ProductForm";
import { OPTION_STATUS, TYPE_ACTION } from "utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { actions, TStore } from "store";
import {
  Application,
  ParamSearchProducts,
  Product,
  ProductRequest,
  STATUS_COMMON,
} from "api/product/product.interface";

import { formatDateLocalNoTime } from "helpers/date.helper";
import ModalDelete from "components/modal/ModalDelete";
import { useCallbackPrompt } from "hooks/useCallbackPrompt";
import styled from "styled-components";
import { useLocation, useNavigate, useParams } from "react-router-dom";
const ModalContainer = React.lazy(
  () => import("components/modal/ModalContainer")
);
export interface ParamsFilterSearch {
  status: "Active" | "Inactive";
  applicationName: string;
}

const Products = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [visibleModalDelete, setVisibleModalDelete] = useState<boolean>(false);
  const [visibleModalConfirm, setVisibleModalConfirm] =
    useState<boolean>(false);
  const [visibleModalConfirmStatus, setVisibleModalConfirmStatus] =
    useState<boolean>(false);
  const [isLoadingButtonFooter, setIsLoadingButtonFooter] =
    useState<boolean>(false);
  const [optionApplication, setOptionApplication] =
    useState<{ value: string; label: string }[]>();
  const [dataSource, setDataSource] = useState<Product[]>([]);
  const [type, setType] = useState(TYPE_ACTION.ADD);
  const dispatch = useDispatch();
  const { isLoading, data, isReload } = useSelector(
    (state: TStore) => state.products
  );

  const [config, setConfig] = useState<ModalFuncProps>();
  const [id, setId] = useState<string | null>("");
  const [isChangeValues, setIsChangeValues] = useState<boolean>(false);
  const [showPrompt, confirmNavigation, cancelNavigation] =
    useCallbackPrompt(isChangeValues);

  const applicationData = useSelector(
    (state: TStore) => state?.application?.application
  );
  const [params, setParams] = useState<ParamSearchProducts>({
    status: undefined,
    page: "1",
    limit: "10",
    applicationId: "",
    content: "",
  });

  const getDefaultData = useCallback(
    (newParams?: object) => {
      dispatch(
        actions.products.fetchProducts({
          ...params,
          ...newParams,
        })
      );
    },
    [dispatch, params]
  );

  useEffect(() => {
    getDefaultData();
  }, [getDefaultData, params]);

  useEffect(() => {
    getDefaultData();
    if (location?.search?.includes("refesher=true")) {
      navigate("/", { replace: true });
    }
  }, [getDefaultData, location?.search, navigate]);

  useEffect(() => {
    if (showPrompt && isChangeValues) {
      config && Modal.confirm(config);
      setVisibleModalConfirm(true);
    } else {
      Modal.destroyAll();
    }
  }, [config, isChangeValues, showPrompt]);
  useEffect(() => {
    if (!isReload) {
      getDefaultData();
    }
  }, [getDefaultData, isReload]);

  useEffect(() => {
    dispatch(
      actions.application.getListApplicationAction({
        status: STATUS_COMMON.ACTIVE,
        limit: "100",
      })
    );
  }, [dispatch]);

  useEffect(() => {
    if (applicationData) {
      const option = applicationData?.data.map((item) => {
        return { value: item._id, label: item.name };
      });

      setOptionApplication(option);
    }
  }, [applicationData]);

  const [form] = Form.useForm();

  const columns = [
    {
      title: "No",
      dataIndex: "_id",
      key: "_id",
      width: 80,

      render: (value: number, product: Product, index: number) => {
        return (
          data?.data &&
          ((data?.data?.currentPage || 1) - 1) * Number(params.limit) +
            index +
            1
        );
      },
    },
    {
      title: "Product Name",
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
      width: "10%",
      render: (value: Date) => {
        return formatDateLocalNoTime(value);
      },
    },
    {
      title: "Application",
      key: "applications",
      dataIndex: "applications",
      width: "25%",
      render: (app: Application[]) => {
        return <div>{app?.map((item) => item?.name).join(", ")}</div>;
      },
    },
    {
      title: "Status",
      key: "status",
      dataIndex: "status",
      width: "10%",
      render: (status: STATUS_COMMON, item: Product) => {
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
      render: (text: string, item: Product) => (
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
    (status: STATUS_COMMON, product: Product) => {
      const body: ProductRequest = {
        name: product.name,
        shortDescription: product?.shortDescription,
        detailDescription: product?.detailDescription,
        image: product?.image?._id || "",
        label: product?.label?._id || "",
        video: product?.video?._id || "",
        literature: product?.literature?._id || "",
        website1: product?.website1,
        website2: product?.website2,
        applications: product.applications.map((item) => item._id),
        status:
          status === STATUS_COMMON.ACTIVE
            ? STATUS_COMMON.IN_ACTIVE
            : STATUS_COMMON.ACTIVE,
      };
      const paramsConvert = { id: product._id, body };
      dispatch(actions.products.putProduct(paramsConvert));
    },
    [dispatch]
  );
  useEffect(() => {
    return setDataSource(data?.data?.data || []);
  }, [data?.data]);
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

  const handleChangeApplication = useCallback(
    (applicationId: string) => {
      setParams({ ...params, applicationId, page: "1" });
    },
    [params]
  );

  const onChangePage = useCallback(
    (page: number, pageSize: number) => {
      setParams({ ...params, page: `${page}`, limit: `${pageSize}` });
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
    (status: STATUS_COMMON, item: Product) => {
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
            allowClear
            placeholder="Search by Product Name"
            onSearch={onSearch}
            enterButton
            maxLength={50}
          />
        </SearchComponent>
        <SelectComponent>
          <SelectStatusComponent>
            <Select
              showSearch
              style={{ width: 150 }}
              allowClear
              placeholder="Select Application"
              filterOption={(input, option) =>
                (option?.label ?? "").includes(input)
              }
              filterSort={(optionA, optionB) =>
                (optionA?.label ?? "")
                  .toLowerCase()
                  .localeCompare((optionB?.label ?? "").toLowerCase())
              }
              onChange={handleChangeApplication}
              options={optionApplication}
            />
          </SelectStatusComponent>
          <SelectStateComponent>
            <Select
              defaultValue={STATUS_COMMON.ALL}
              onChange={handleChangeStatus}
              options={OPTION_STATUS}
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
                ? "Create New Product"
                : "Edit Product Section"
            }
            onSubmit={form.submit}
            onClose={() =>
              (isChangeValues && config && Modal.confirm(config)) ||
              (Modal.destroyAll(), setVisibleModal(false))
            }
            okText={"Save"}
            isLoadingButton={isLoadingButtonFooter}
          >
            <ProductForm
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
                  actions.products.deleteProduct({
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
  justify-content: space-between;
`;
export const SearchComponent = styled.div`
  width: 32%;
  margin-bottom: 16px;
  margin-right: 16px;
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
  max-width: 12rem;
  margin-right: 1rem;

  .ant-select {
    min-width: 200px;
  }

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
