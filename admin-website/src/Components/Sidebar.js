import React from "react";
import "../App.css";
import { SidebarData } from "./SidebarData";
import logo from "../assets/jru-logo.png";
import { useNavigate, useLocation } from "react-router-dom";

function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="Sidebar">

      {/* HEADER */}
      <div className="sidebarHeader">
        <img src={logo} alt="JRU Logo" className="sidebarLogo" />

        <div className="sidebarTitle">
          <h1 className="lilyTitle">LILY</h1>
          <p className="schoolName">José Rizal University</p>
        </div>
      </div>

      {/* MENU LIST */}
      <ul className="SidebarList">
        {SidebarData.map((val, key) => {

          if (val.type === "divider") {
            return <div key={key} className="sidebarDivider"></div>;
          }

          const isLogout = val.title === "Log Out";
          const isActive = location.pathname === val.link;

          return (
            <li
              key={key}
              className={`row ${isActive ? "active" : ""}`}
              onClick={() => {
                if (isLogout) {
                  alert("Logging out...");
                } else {
                  navigate(val.link);
                }
              }}
            >
              <div id="icon">{val.icon}</div>
              <div id="title">{val.title}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default Sidebar;
