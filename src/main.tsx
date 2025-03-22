import { createRoot } from "react-dom/client";
import * as React from "react";
import "./style.css";
import gapiInit from "./lib/gapiInit";
import App from "./components/app";

document.addEventListener("DOMContentLoaded", async (event) => {
  // 外部script読み込み待機
  await gapiInit();
  // コンポーネント描画
  const domNode = document.getElementById("app");
  const root = createRoot(domNode);
  root.render(<App />)
});

