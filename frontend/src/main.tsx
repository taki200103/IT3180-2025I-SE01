
  import { createRoot } from "react-dom/client";
  import App from "./App.tsx";
  import "./index.css";
  import { OpenAPI } from "./api/core/OpenAPI";

  // Cấu hình API base URL ngay từ đầu (ưu tiên lấy từ biến môi trường Vite)
  // Lưu ý: KHÔNG để dấu "/" ở cuối để tránh bị "//auth/login"
  // @ts-ignore - Vite env variable
  const apiBaseUrl =
    import.meta.env?.VITE_API_BASE_URL || 'https://backendhost-production-91ab.up.railway.app';
  OpenAPI.BASE = apiBaseUrl;
  console.log('Main: API Base URL được set thành:', OpenAPI.BASE);

  createRoot(document.getElementById("root")!).render(<App />);
  