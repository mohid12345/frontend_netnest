import "./index.css";
import React from "react";
import App from "./App";
import ReactDOM from "react-dom/client";
import { store, persistor } from "./utils/context/store";
import appRouter from "./routes/UserRoutes";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { Toaster } from "sonner";
import { RouterProvider } from "react-router-dom";
import { SocketProvider } from "./utils/context/SocketContext/SocketContext";
import { NotificationSocketProvider } from "./utils/context/SocketContext/nofi_Socket";

ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <Toaster richColors position="top-right" />
    <PersistGate loading={null} persistor={persistor}>
      <RouterProvider router={appRouter}>
        <SocketProvider>
          <NotificationSocketProvider>
            <App />
          </NotificationSocketProvider>
        </SocketProvider>
      </RouterProvider>
    </PersistGate>
  </Provider>
);
