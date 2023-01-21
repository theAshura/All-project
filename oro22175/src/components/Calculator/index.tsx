import { Button, Col, Form, Row } from "antd";
import Search from "antd/es/input/Search";
import { CalculatorDetail } from "api/calculator/calculator.interface";
import TableCommon from "components/table/Table";
import { formatDateLocalNoTime } from "helpers/date.helper";
import { FC, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { TStore } from "store";
import { CalculatorActions } from "store/calculator.slice";
import styled from "styled-components";
import classes from "./calculator.module.scss";

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
const CalculatorShareEmail: FC = () => {
  const { data, isLoading } = useSelector((state: TStore) => state?.calculator);

  const [params, setParams] = useState({
    content: "",
    limit: "",
  });
  const [pageSize, setPageSize] = useState<number>(10);

  const dispatch = useDispatch();
  const getDefault = useCallback(() => {
    return dispatch(
      CalculatorActions.fetchCalculatorEmail({
        content: params.content,
        limit: pageSize.toString(),
      })
    );
  }, [dispatch, pageSize, params.content]);

  useEffect(() => {
    getDefault();
  }, [getDefault]);
  const columns = [
    {
      title: "No",
      dataIndex: "key",
      key: "key",
      width: "2%",

      render: (field: string, item: CalculatorDetail, index: number) => {
        return (
          data && ((data?.data?.currentPage || 1) - 1) * pageSize + index + 1
        );
      },
    },
    {
      title: "Email Subject",
      dataIndex: "subject",
      key: "subject",
      width: "30%",
      render: (field: string, item: CalculatorDetail) => {
        return (
          <Link className={classes.columnName} to={`${item._id}`}>
            {field}
          </Link>
        );
      },
    },
    {
      title: "Date Created",
      dataIndex: "createdAt",
      key: "createdAt",
      width: "5%",
      render: (a: Date) => {
        return formatDateLocalNoTime(a);
      },
    },
    {
      title: "To Email Address",
      dataIndex: "to",
      key: "to",
      width: "8%",
    },
  ];
  const onChangePage = useCallback(
    (page: number, pageSize: number) => {
      dispatch(
        CalculatorActions.fetchCalculatorEmail({
          page: page.toString(),
          limit: pageSize.toString(),
          content: params.content,
        })
      );
      setPageSize(pageSize);
    },
    [dispatch, params.content]
  );
  const onSearch = useCallback(
    (content: string) => {
      setParams({ ...params, content });
    },
    [params]
  );
  return (
    <>
      <RightComponent>
        <SearchComponent>
          <Search
            allowClear
            placeholder="Search by Email Subject"
            onSearch={onSearch}
            enterButton
            maxLength={200}
          />
        </SearchComponent>
      </RightComponent>

      <TableCommon
        columns={columns}
        dataSource={data?.data?.data}
        page={data?.data?.currentPage}
        pageSize={data?.data?.data.length}
        total={data?.data?.count}
        onChange={onChangePage}
        loading={isLoading}
      />
    </>
  );
};

export default CalculatorShareEmail;

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
