import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { AuthProvider } from "@/context/AuthContext";
import { SocketProvider } from "@/context/SocketContext";
import { ThemeProvider } from "@/context/ThemeContext";
import "./index.css";
import App from "./App.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 30,
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <AuthProvider>
              <SocketProvider>
                <App />
                <SpeedInsights />
              </SocketProvider>
            </AuthProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </GoogleOAuthProvider>
    </BrowserRouter>
  </StrictMode>,
);
