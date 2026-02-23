import React, { useState } from "react";
import "../App.css";
import ShareIcon from "@mui/icons-material/Share";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import AddIcon from "@mui/icons-material/Add";

function Reports() {
  const [scheduledReports] = useState([
  {
    time: "09:05 AM",
    location: "Library Entrance",
    query: "Where is the library?",
    response: "Library is on the 2nd floor",
  },
  {
    time: "09:20 AM",
    location: "Library Entrance",
    query: "How to submit enrollment forms?",
    response: "Forms submitted at front desk",
  },
  {
    time: "10:10 AM",
    location: "Library Entrance",
    query: "What time does the cafeteria open?",
    response: "Opens at 8:00 AM",
  },
  {
    time: "11:45 AM",
    location: "Library Entrance",
    query: "Can I borrow two books at once?",
    response: "Yes, up to 3 books allowed",
  },
  {
    time: "01:30 PM",
    location: "Library Entrance",
    query: "Where can I find quiet study areas?",
    response: "Study rooms are available in library",
  },
  {
    time: "02:15 PM",
    location: "Library Entrance",
    query: "When is the last day for adding subjects?",
    response: "August 15, 2025",
  },
]);

  return (
    <div className="page">
      <h1>Reports</h1>

      <div className="logsHeaderInfo">
        <p className="logsDescription">
          Generate, view, and download records
        </p>
        <div className="logsDivider"></div>
      </div>

      {/* CREATE REPORT */}
      <div className="reportCard">
        <h2>Create Report</h2>

      <div className="reportForm">

        <div className="formGroup">
          <label>Report Title</label>
          <input type="text" />
        </div>

        <div className="formGroup">
          <label>From</label>
          <input type="date" />
        </div>

        <div className="formGroup">
          <label>To</label>
          <input type="date" />
        </div>

        <div className="formGroup">
          <label>Report Type</label>
          <select>
            <option>Select type</option>
          </select>
        </div>

        <div className="formGroup">
          <label>Prepared By</label>
          <input type="text" />
        </div>

        <div className="formGroup">
          <label>Recipients (Email)</label>
          <input type="email" />
        </div>

        <div className="formGroup">
          <label>Report Format</label>
          <input type="text" />
        </div>

        <div className="formGroup">
          <label>Notes</label>
          <input type="text" />
        </div>

      </div>

        <button className="sendReportBtn"> <AddIcon className="sendIcon" /> Send report</button>
      </div>

      {/* SCHEDULED REPORT */}
      <div className="scheduledHeader">
        <h2>Scheduled Report</h2>

        <button className="shareBtn">
          <ShareIcon />
          Share
          <ArrowDropDownIcon />
        </button>
      </div>

        <div className="scheduledTable">
        <div className="scheduledHeaderRow">
          <span>Time</span>
          <span>Location</span>
          <span>Query</span>
          <span>Response Given</span>
        </div>

        {scheduledReports.map((item, index) => (
          <div className="scheduledRow" key={index}>
            <span>{item.time}</span>
            <span>{item.location}</span>
            <span>{item.query}</span>
            <span>{item.response}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Reports;
