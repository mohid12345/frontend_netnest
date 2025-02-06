// main.jsx
import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { RouterProvider } from "react-router-dom";
import { Toaster } from "sonner";
import { store, persistor } from "./utils/context/store";
import appRouter from "./routes/UserRoutes";
import { NotificationSocketProvider } from "./utils/context/SocketContext/nofi_Socket";

// Create a wrapper component to handle providers
const AppWrapper = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
          <NotificationSocketProvider>
            <RouterProvider router={appRouter} />
            <Toaster richColors position="top-right" />
          </NotificationSocketProvider>
      </PersistGate>
    </Provider>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AppWrapper />
  </React.StrictMode>
);