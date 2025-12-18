import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Set Uploadcare public key from environment variable if available
if (import.meta.env.VITE_UPLOADCARE_PUBLIC_KEY && typeof window !== "undefined") {
  (window as any).UPLOADCARE_PUBLIC_KEY = import.meta.env.VITE_UPLOADCARE_PUBLIC_KEY;
}

createRoot(document.getElementById("root")!).render(<App />);
