import React from "react";
import { Outlet } from "react-router-dom";
import Topbar from "./Topbar";
import Navbar from "./Navbar";


const Layout = () => {
    return (
        <>
            <div className="main-window">
                <Topbar />
                <Navbar />
                <div className="main-container">
                    <Outlet />
                </div>
            </div>
        </>
    );
}

export default Layout;