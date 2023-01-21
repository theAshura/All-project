import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Button, Form, Modal, ModalFuncProps, Select } from "antd";
import Search from "antd/es/input/Search";
import { STATUS_COMMON } from "api/product/product.interface";
import cx from "classnames";
import TableCommon from "components/table/Table";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actions, TStore } from "store";
import { OPTION_STATUS, TYPE_ACTION } from "utils/constants";
import classes from "./crop-guides-detail.module.scss";
import CropGuidesDetailForm from "./CropGuidesDetailForm";

import {
  CropGuide,
  CropGuidePostParams,
  ParamSearchCropGuide,
} from "api/crop-guide/crop-guide.interface";
import ModalDelete from "components/modal/ModalDelete";
import { formatDateLocalNoTime } from "helpers/date.helper";
import { useCallbackPrompt } from "hooks/useCallbackPrompt";
import styled from "styled-components";
const ModalContainer = React.lazy(
  () => import("components/modal/ModalContainer")
);
export interface ParamsFilterSearch {
  status: "Active" | "Inactive";
  applicationName: string;
}

const CropGuidesDetail = () => {
  const [visibleModal, setVisibleModal] = useState<boolean>(false);
  const [visibleModalDelete, setVisibleModalDelete] = useState<boolean>(false);
  const [visibleModalConfirm, setVisibleModalConfirm] =
    useState<boolean>(false);
  const [visibleModalConfirmStatus, setVisibleModalConfirmStatus] =
    useState<boolean>(false);
  const [isLoadingButtonFooter, setIsLoadingButtonFooter] =
    useState<boolean>(false);
  const [dataSource, setDataSource] = useState<CropGuide[]>([]);
  const [type, setType] = useState(TYPE_ACTION.ADD);
  const dispatch = useDispatch();
  const { isLoading, data, isReload } = useSelector(
    (state: TStore) => state.cropGuide
  );
  const [config, setConfig] = useState<ModalFuncProps>();
  const [id, setId] = useState<string | null>("");
  const [isChangeValues, setIsChangeValues] = useState<boolean>(false);
  const [showPrompt, confirmNavigation, cancelNavigation] =
    useCallbackPrompt(isChangeValues);

  const [params, setParams] = useState<ParamSearchCropGuide>({
    status: undefined,
    page: "1",
    limit: "20",
    content: "",
  });

  useEffect(() => {
    if (showPrompt && isChangeValues) {
      config && Modal.confirm(config);
      setVisibleModalConfirm(true);
    } else {
      Modal.destroyAll();
    }
  }, [config, isChangeValues, showPrompt]);

  const getDefaultData = useCallback(
    (newParams?: object) => {
      dispatch(
        actions.cropGuide.fetchCropGuide({
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
  // useEffect(() => {
  //   visibleModalDelete && setParams({ ...params, page: "1" });
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [params]);
  useEffect(() => {
    return setDataSource(data?.data?.data || []);
  }, [data, data?.data?.data]);

  const [form] = Form.useForm();

  const columns = [
    {
      title: "No",
      dataIndex: "_id",
      key: "_id",
      width: 80,
      render: (value: number, cropguide: CropGuide, index: number) => {
        return (
          data?.data &&
          ((data?.data?.currentPage || 1) - 1) * Number(params.limit) +
            index +
            1
        );
      },
    },
    {
      title: "Crop Guide Name",
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
      title: "Status",
      key: "status",
      dataIndex: "status",
      width: "10%",
      render: (status: STATUS_COMMON, item: CropGuide) => {
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
      key: "Action",
      align: "center",
      width: "10%",
      render: (text: string, item: CropGuide) => (
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
      setParams({ ...params, content });
    },
    [params]
  );

  const handleChangeStatusCoulumn = useCallback(
    (status: STATUS_COMMON, cropGuide: CropGuide) => {
      const body: CropGuidePostParams = {
        name: cropGuide.name,
        title: cropGuide.title,
        shortDescription: cropGuide?.shortDescription,
        detailDescription: cropGuide?.detailDescription,
        image: cropGuide?.image?._id || "",
        video: cropGuide?.video?._id || "",
        literature: cropGuide?.literature?._id || "",
        website: cropGuide?.website,
        status:
          status === STATUS_COMMON.ACTIVE
            ? STATUS_COMMON.IN_ACTIVE
            : STATUS_COMMON.ACTIVE,
      };
      const paramsConvert = {
        id: cropGuide._id,
        body,
        getData: () => getDefaultData(),
      };
      dispatch(actions.cropGuide.putCropGuide(paramsConvert));
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
    (status: STATUS_COMMON, item: CropGuide) => {
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
            placeholder="Search by Name"
            onSearch={onSearch}
            enterButton
            maxLength={200}
          />
        </SearchComponent>
        <SelectComponent>
          <Select
            defaultValue={STATUS_COMMON.ALL}
            onChange={handleChangeStatus}
            options={OPTION_STATUS}
          />
        </SelectComponent>
      </RightComponent>

      <TableCommon
        columns={columns}
        loading={isLoading}
        dataSource={dataSource}
        page={data?.data?.currentPage}
        pageSize={dataSource?.length || 0}
        onChange={onChangePage}
        total={data?.data?.count}
      />

      {visibleModal && (
        <Suspense fallback={null}>
          <ModalContainer
            isModalOpen={visibleModal}
            title={
              type === TYPE_ACTION.ADD
                ? "Create New Crop Guide"
                : "Edit Crop Guide"
            }
            onSubmit={form.submit}
            onClose={() =>
              (isChangeValues && config && Modal.confirm(config)) ||
              (Modal.destroyAll(), setVisibleModal(false))
            }
            okText={"Save"}
            isLoadingButton={isLoadingButtonFooter}
          >
            <CropGuidesDetailForm
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
                  actions.cropGuide.deleteCropGuide({
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

export default CropGuidesDetail;

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
export const SelectComponent = styled.div`
  display: flex;
  margin-bottom: 16px;
`;
