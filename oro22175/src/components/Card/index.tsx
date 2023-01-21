import React, { FC } from "react";
import { Button, Card } from "antd";
import classes from "./card.module.scss";

interface Props {
  title?: string;
  extra?: React.ReactElement;
  onClickCreateNew?: () => void;
}

const Home: FC<Props> = ({ title, children, extra, onClickCreateNew }) => {
  return (
    <Card className={classes.customCard} title={title}>
      {children}
    </Card>
  );
};

export default Home;
