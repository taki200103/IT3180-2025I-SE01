
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";
  import { OpenAPI } from "./api/core/OpenAPI";

  // Cấu hình API base URL ngay từ đầu
  // @ts-ignore - Vite env variable
  const apiBaseUrl = import.meta.env?.VITE_API_BASE_URL || 'https://trustworthy-solace-production-cc18.up.railway.app';
  OpenAPI.BASE = apiBaseUrl;
  console.log('Main: API Base URL được set thành:', OpenAPI.BASE);

  createRoot(document.getElementById("root")!).render(<App />);
  