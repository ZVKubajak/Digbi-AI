import { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import MobileHeader from "./components/MobileHeader";
import auth from "./utils/auth";

const App = () => {
  const isLoggedIn = auth.loggedIn();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 769);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 769);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div>
      {isLoggedIn && (isMobile ? <MobileHeader /> : <Sidebar />)}
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default App;
