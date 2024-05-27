import React from "react";

export let Row = ({
  style,
  children,
}: {
  style?: React.CSSProperties;
  children: React.ReactNode;
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "row", ...style }}>
      {children}
    </div>
  );
};

export let Column = ({
  style,
  children,
}: {
  style?: React.CSSProperties;
  children: React.ReactNode;
}) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", ...style }}>
      {children}
    </div>
  );
};
