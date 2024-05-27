import React from "react";
import colors from "./minecraft-format.json";
import { Column, Row } from "../Elements";

let read_as_data_url = async (file: File): Promise<string> => {
  /// Without FileReader or createObjectURL
  let buffer = await file.arrayBuffer();
  let bytes = new Uint8Array(buffer);
  let binary = bytes.reduce((acc, byte) => acc + String.fromCharCode(byte), "");
  let base64 = btoa(binary);
  return `data:${file.type};base64,${base64}`;
};

export type TextComponent =
  | string
  | {
      extra: Array<TextComponent>;
      color?: string;
      bold?: boolean;
      italic?: boolean;
      underlined?: boolean;
      strikethrough?: boolean;
      obfuscated?: boolean;
      text: string;
    };

let motd_to_jsx = (motd: TextComponent): React.ReactNode => {
  if (typeof motd === "string") {
    return motd.split("\n").map((line, i) => (
      <div key={i} style={{ display: "flex" }}>
        {line.split(/§/).map((part, i) => {
          let color = colors[`§${part[0]}`];
          if (
            part[0] === "k" ||
            part[0] === "l" ||
            part[0] === "m" ||
            part[0] === "n" ||
            part[0] === "o" ||
            part[0] === "r"
          ) {
            return <span key={i}>{part.slice(1)}</span>;
          } else if (color) {
            return (
              <span key={i} style={{ color: color.hex }}>
                {part.slice(1)}
              </span>
            );
          } else {
            return <span key={i}>{part}</span>;
          }
        })}
      </div>
    ));
  } else {
    return (
      <span style={{ color: motd.color }}>
        {motd_to_jsx(motd.text)}
        {motd.extra?.map((part, i) => (
          <span key={i}>{motd_to_jsx(part)}</span>
        ))}
      </span>
    );
  }
};

export let ServerBanner = ({
  motd,
  max,
  online,
  title,
  host,
  favicon,
  players,
}: {
  motd: TextComponent;
  max: number;
  online: number;
  title: string;
  host: string;
  favicon?: string;
  players?: { name: string }[];
}) => {
  // let f = new File([font], "font.ttf", { type: "font/ttf" });
  // let url = await read_as_data_url(f);
  let url =
    "https://static.wikia.nocookie.net/minecraft_gamepedia/images/3/3d/Dirt_%28texture%29_JE2_BE2.png";

  let motd_with_colors = motd_to_jsx(motd);

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

      {/* {favicon && (
        <img
          src={favicon}
          style={{
            height: 64,
            width: 64,
            marginRight: 16,
          }}
        />
      )} */}

      <Column style={{ flex: 1 }}>
        <div style={{ fontSize: 48 }}>{title}</div>
        <Column style={{ fontSize: 20, color: "#eee" }}>
          {motd_with_colors}
        </Column>
        <div
          style={{
            fontSize: 18,
            backgroundColor: "black",
            border: "solid 2px white",
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
          <span>{online}</span>
          <span>{"/"}</span>
          <span>{max}</span>
        </Row>

        <Column
          style={{
            fontSize: 12,
            alignItems: "center",
            position: "absolute",
            top: "100%",
            width: "100%",
          }}
        >
          {players?.map((player, i) => (
            <span>{motd_to_jsx(player.name)}</span>
          ))}
        </Column>
      </Column>
    </Row>
  );
};
