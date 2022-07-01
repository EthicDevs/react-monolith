import React, { FC } from "react";

import DefaultErrorsBoundary from "./DefaultErrorsBoundary";

const DefaultAppComponent: FC = ({ children }) => {
  return <DefaultErrorsBoundary>{children}</DefaultErrorsBoundary>;
};

export default DefaultAppComponent;
