import { Button, Row } from "antd";
import TableCommon from "components/table/Table";
import { FC, useCallback, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { TStore } from "store";
import { CalculatorActions } from "store/calculator.slice";
import styled from "styled-components";

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
const CalculatorDetailComponent: FC = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const calculationDataDetail = useSelector((state: TStore) => {
    return state?.calculator?.dataDetailCalculator;
  });
  const getDefaultCalculatorEmailDetail = useCallback(() => {
    return id && dispatch(CalculatorActions.fetchCalculatorEmailDetail(id));
  }, [dispatch, id]);
  useEffect(() => {
    getDefaultCalculatorEmailDetail();
  }, [getDefaultCalculatorEmailDetail]);

  const columns = [
    {
      title: "Product Name",
      dataIndex: "productName",
      key: "productName",
      width: "17%",
      render: (value: string) => {
        return <ColumnSubject>{value}</ColumnSubject>;
      },
    },
    {
      title: "Rate",
      dataIndex: "rate",
      key: "rate",
      width: "17%",
    },
    {
      title: "Quantitave",
      dataIndex: "quantitative",
      key: "quantitative",
      width: "17%",
    },
    {
      title: "SPRAY VOLUME(gal/ac)",
      dataIndex: "sprayVolume",
      key: "sprayVolume",
      width: "17%",
    },
    {
      title: "PRODUCT COST($/gal)",
      dataIndex: "productCostGal",
      key: "productCostGal",
      width: "17%",
    },
    {
      title: "PRODUCT COST($/ac)",
      dataIndex: "productCostAc",
      key: "productCostAc",
      width: "17%",
    },
  ];

  return (
    <>
      <Row>
        <LabelContainer>
          <Label>From Email Address :</Label>{" "}
          <Text>{calculationDataDetail?.[0]?.from}</Text>
        </LabelContainer>
      </Row>
      <Row>
        <LabelContainer>
          <Label>To Email Address :</Label>
          <Text>{calculationDataDetail?.[0]?.to}</Text>
        </LabelContainer>
      </Row>
      <Row>
        <LabelContainer>
          <Label>Subject :</Label>
          <Text>{calculationDataDetail?.[0]?.subject}</Text>
        </LabelContainer>
      </Row>
      <Row>
        <Content>Email Content</Content>
      </Row>
      <TableCommon
        isHide={true}
        columns={columns}
        dataSource={calculationDataDetail?.[0]?.productCalculations || []}
      />
    </>
  );
};

const ButtonS = styled(Button)`
  margin-bottom: 0.8rem;
  margin-right: 0.8rem;
`;
const Label = styled.div`
  margin-bottom: 1rem;
  margin-right: 1rem;
  width: 10rem;
  font-size: 1rem;
  font-weight: 600;
`;
const Text = styled.div`
  vertical-align: middle;
  padding-top: 2px;
`;
const Content = styled.div`
  margin-bottom: 1rem;
  margin-right: 1rem;
  width: 10rem;
  font-size: 1.3rem;
  font-weight: 600;
`;
const LabelContainer = styled.div`
  display: flex;
  width: 100%;
`;

const ColumnSubject = styled.div`
  max-width: 500px;
  width: 100%;
`;
export default CalculatorDetailComponent;
