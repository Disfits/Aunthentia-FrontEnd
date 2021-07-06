import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

// components

import AdminNavbar from "components/Navbars/AdminNavbar.js";
import Sidebar from "components/Sidebar/Sidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";

// views

import Dashboard from "views/Dashboard.js";
import Maps from "views/Maps.js";
import Settings from "views/Settings.js";
import Tables from "views/Tables.js";

export default function Admin() {
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100 h-screen">
        <AdminNavbar />
        {/* Header */}
        <HeaderStats />
        <div className="px-4 md:px-10 mx-auto w-full -m-24">
          <Switch>
            <Route path="/dashboard" exact component={Dashboard} />
            <Route path="/maps" exact component={Maps} />
            <Route path="/settings" exact component={Settings} />
            <Route path="/tables" exact component={Tables} />
            <Redirect from="/" to="/dashboard" />
          </Switch>
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}
