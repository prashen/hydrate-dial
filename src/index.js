import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import registerSW from "./registerServiceWorker";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
registerSW();