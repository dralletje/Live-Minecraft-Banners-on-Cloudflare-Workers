import React from "react";
import { Column, Row } from "./Elements";

export let ErrorBanner = ({
  message,
  host,
  title,
}: {
  message: string;
  host: string;
  title: string;
}) => {
  // let f = new File([font], "font.ttf", { type: "font/ttf" });
  // let url = await read_as_data_url(f);
  let url =
    "https://static.wikia.nocookie.net/minecraft_gamepedia/images/3/3d/Dirt_%28texture%29_JE2_BE2.png";

  return (
    <Row
      style={{
        height: "100%",
        width: "100%",
        alignItems: "center",
        backgroundColor: "#fff",

        paddingLeft: 32,
        paddingRight: 32,

        backgroundImage: `url("${url}")`,
        backgroundSize: "80px 80px",
        boxShadow: "inset 0 0 60px black",
        textShadow: "0px 2px 4px rgba(0,0,0,0.5)",

        color: "white",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      />

      <Column style={{ flex: 1 }}>
        <div style={{ fontSize: 48 }}>{title}</div>
        <Column style={{ fontSize: 20, color: "red" }}>{message}</Column>
        <div
          style={{
            fontSize: 18,
            backgroundColor: "black",
            border: "solid 1px white",
            padding: 4,
            marginTop: 4,
          }}
        >
          {host}
        </div>
      </Column>

      <div style={{ minWidth: 64 }} />

      <Column
        style={{
          fontSize: 60,
          transform: "rotate(9deg)",
          position: "relative",
        }}
      >
        <Row>
          <span>Oh no!</span>
        </Row>
      </Column>
    </Row>
  );
};
