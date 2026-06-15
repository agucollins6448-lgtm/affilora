import { useEffect, useState } from "react";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tasks from "./pages/Tasks";
import Referrals from "./pages/Referrals";
import Wallet from "./pages/Wallet";
import Support from "./pages/Support";
import Membership from "./pages/Membership";
import LandingPage from "./pages/Landingpage";
import Settings from "./pages/Settings";


import AdminLogin from "./admin/AdminLogin";
import AdminDashboard from "./admin/AdminDashboard";

function App() {

  const getInitialView = () => {
  const hash = window.location.hash;
  return hash === "#admin"
    ? "adminLogin"
    : "landingpage";
};

const [view, setView] =
  useState(getInitialView());

  useEffect(() => {

  const token =
    localStorage.getItem("token");

  const adminToken =
    localStorage.getItem("adminToken");

  if (adminToken) {

    setView(
      "adminDashboard"
    );

  } else if (token) {

    setView(
      "dashboard"
    );

  }

}, []);

useEffect(() => {

  const onHashChange = () => {
    if (window.location.hash === "#admin") {
      setView("adminLogin");
    }
  };

  window.addEventListener(
    "hashchange",
    onHashChange
  );

  return () =>
    window.removeEventListener(
      "hashchange",
      onHashChange
    );

}, []);

  // Logout
  const handleLogout = () => {

  localStorage.removeItem("token");

  localStorage.removeItem("currentUser");

  localStorage.removeItem("adminToken");

  setView("landingpage");

};

  return (

    //User
    <>
      {view === "register" && <Register setView={setView} />}
      {view === "login" && <Login setView={setView} />}
      {view === "dashboard" && <Dashboard setView={setView} onLogout={handleLogout} />}
      {view === "tasks" && <Tasks setView={setView} onLogout={handleLogout}  />}
      {view === "referrals" && <Referrals setView={setView} onLogout={handleLogout}  />}
      {view === "wallet" && <Wallet setView={setView} onLogout={handleLogout}  />}
      {view === "support" && <Support setView={setView} onLogout={handleLogout}  />}
      {view === "membership" && <Membership setView={setView} onLogout={handleLogout}  />}
      {view === "landingpage" && <LandingPage setView={setView} />}
      {view === "settings" && <Settings setView={setView} onLogout={handleLogout}  />}


      {view === "adminLogin" && <AdminLogin setView={setView} />}
      {view === "adminDashboard" && (<AdminDashboard setView={setView} onLogout={handleLogout} />)}
    </>
  );
}

export default App;
