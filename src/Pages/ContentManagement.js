import React from "react";
import "../App.css";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SyncIcon from "@mui/icons-material/Sync";

function ContentManagement() {
  return (
    <div className="page">

      {/* HEADER */}
      <div className="contentHeader">
         <div className="titleWithSync">
        <h1>Content Management</h1>

        <div className="syncNow">
          <InfoOutlinedIcon className="syncInfoIcon" />
          <span>SYNC NOW</span>
          <SyncIcon className="syncIcon" />
        </div>
        </div>
      </div>

      <div className="logsHeaderInfo">
        <p className="logsDescription">
          Files, documents, and resources
        </p>
        <div className="logsDivider"></div>
      </div>

      {/* UPLOAD FORM SECTION */}
      <div className="contentUploadWrapper">
        {/* LEFT */}
        <div className="uploadBox">
          <h2>Upload Form</h2>

          <div className="uploadDropzone">
            <CloudUploadIcon className="uploadIcon" />
            <button className="uploadBtn">UPLOAD FILE</button>
            <p className="uploadNote">
              Only PDF, DOCX files are supported
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="uploadForm">
          <div className="formGroup">
            <label>File Title (Automatic)</label>
            <input disabled placeholder="Automatically taken from the file name" />
          </div>

          <div className="formGroup">
            <label>File Category*</label>
            <input placeholder="Enter the type of file (e.g. Handbook, History, Course)" />
          </div>

          <div className="formGroup">
            <label>File Description*</label>
            <input placeholder="Enter a short summary of the file contents" />
          </div>

          <div className="formGroup">
            <label>Effective Date / Validity*</label>
            <input placeholder="Enter the period when the document is valid (e.g. AY 2025–2026)" />
          </div>

          <div className="formGroup">
            <label>Uploaded By*</label>
            <input placeholder="Enter the name of the uploader (e.g. Registrar’s Office)" />
          </div>

          <div className="formGroup">
            <label>Version / Revision Number*</label>
            <input placeholder="Enter version details (e.g. v1.0, Revised March 2025)" />
          </div>

          <div className="formGroup">
            <label>Upload Date (Automatic)</label>
            <input disabled placeholder="The system records the date and time of upload" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContentManagement;
