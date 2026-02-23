import React from "react";
import "../App.css";

function Settings() {
  // DUMMY ADMIN DATA
  const adminData = [
    {
      firstName: "Su",
      lastName: "Yen",
      email: "suyen@gmail.com",
      access: ["Admin", "Data Export", "Data Import"],
      status: "active",
      lastActive: "5 minutes ago",
    },
    {
      firstName: "Doja",
      lastName: "Cat",
      email: "dojacat@gmail.com",
      access: ["Admin", "Data Export", "Data Import"],
      status: "muted",
      lastActive: "Muted for 24 hours",
    },
    {
      firstName: "Kali",
      lastName: "Uchis",
      email: "kaliuchis@gmail.com",
      access: ["Admin", "Data Export", "Data Import"],
      status: "active",
      lastActive: "1 day ago",
    },
    {
      firstName: "Melanie",
      lastName: "Martinez",
      email: "melanie@gmail.com",
      access: ["Admin", "Data Export", "Data Import"],
      status: "active",
      lastActive: "2 days ago",
    },
    {
      firstName: "Ravyn",
      lastName: "Lenae",
      email: "ravynlenae@gmail.com",
      access: ["Admin", "Data Export", "Data Import"],
      status: "active",
      lastActive: "11 minutes ago",
    },
    {
      firstName: "Lana",
      lastName: "Del Rey",
      email: "lana@gmail.com",
      access: ["Admin", "Data Export", "Data Import"],
      status: "active",
      lastActive: "3 days ago",
    },
    {
      firstName: "Daniel",
      lastName: "Caesar",
      email: "daniel@gmail.com",
      access: ["Admin", "Data Export", "Data Import"],
      status: "active",
      lastActive: "30 minutes ago",
    },
  ];

    return (
    <div className="page">
      {/* NEW SECTION: Access Management */}
      <h1>Access Management</h1>
      <div className="logsHeaderInfo">
        <p className="logsDescription">
          Generate, view, and download records
        </p>
        <div className="logsDivider"></div>
      </div>

      {/* PAGE TITLE */}
      <div className="pageHeader">
        <div className="pageTitleWrapper">
          <h1 className="pageTitle active">Admin</h1>
          <span className="activeIndicator"></span>
        </div>
      </div>

      {/* DIVIDER */}
      <div className="logsDivider"></div>

      {/* ACTION BAR */}
      <div className="adminActions">
        <div className="leftActions">
          <label className="selectAll">
            <input type="checkbox" />
            <span>Select All</span>
          </label>
          <button className="deleteBtn">DELETE</button>
        </div>

        <div className="rightActions">
          <div className="searchBox">
            <input placeholder="Search Here" />
          </div>
          <button className="addNewBtn">＋ ADD NEW</button>
        </div>
      </div>

      {/* TABLE */}
      <div className="adminTable">
        {/* TABLE HEADER */}
        <div className="tableHeader">
          <span></span>
          <span>Firstname</span>
          <span>Lastname</span>
          <span>Email</span>
          <span>Access</span>
          <span>Status</span>
          <span>Last Active</span>
          <span>Action</span>
        </div>

        {/* TABLE ROWS DYNAMICALLY */}
        {adminData.map((admin, idx) => (
          <div className="tableRow" key={idx}>
            <input type="checkbox" />
            <span>{admin.firstName}</span>
            <span>{admin.lastName}</span>
            <span>{admin.email}</span>

            <div className="accessPills">
              {admin.access.map((item, i) => (
                <span
                  key={i}
                  className={`pill ${
                    item.toLowerCase().includes("admin")
                      ? "admin"
                      : item.toLowerCase().includes("export")
                      ? "export"
                      : "import"
                  }`}
                >
                  {item}
                </span>
              ))}
            </div>

            <span className={`status ${admin.status}`}>
              {admin.status === "active" ? "Activated" : "Muted"}
            </span>
            <span>{admin.lastActive}</span>
            <span className="more">•••</span>
          </div>
        ))}
      </div>
    </div>
  );

}

export default Settings;
