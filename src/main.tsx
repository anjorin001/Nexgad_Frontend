import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.tsx";
import NetworkErrorBoundary from "./components/NetworkBoundary.tsx";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <NetworkErrorBoundary>
      <App />
    </NetworkErrorBoundary>
  </BrowserRouter>
);
