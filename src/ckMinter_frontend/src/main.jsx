import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.scss";
import { MetaMaskProvider } from "./components/Web3Context";
import { AuthProvider } from "./components/ICAuth";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
    <MetaMaskProvider>
      <App />
    </MetaMaskProvider>
    </AuthProvider>
  </React.StrictMode>
);
