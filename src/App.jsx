// App.jsx
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { Outlet, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useNotificationSocket } from "./utils/context/SocketContext/nofi_Socket";
import Protect from "./routes/protect";
import SideNavBar from "./components/sidebar/SideNavBar";

function App() {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const { isConnected, notifications } = useNotificationSocket();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // Handle notifications
  useEffect(() => {
    if (isConnected && notifications.length > 0) {
      // Get the latest notification
      const lastNotification = notifications[notifications.length - 1];
      toast(
        <div className="flex gap-2">
          <p className="text-sm">
            {lastNotification.content}
          </p>
        </div>
      );
    }
  }, [notifications, isConnected]);

  return (
    <Protect>
      <div className="flex dark:bg-black">
        <SideNavBar />
        <Outlet />
      </div>
    </Protect>
  );
}

export default App;