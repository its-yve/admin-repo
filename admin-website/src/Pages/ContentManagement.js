import React, { useState, useEffect } from "react";
import "../App.css";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import SyncIcon from "@mui/icons-material/Sync";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorIcon from "@mui/icons-material/Error";

const API_BASE = 'http://localhost:8000/api';

function ContentManagement() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [files, setFiles] = useState([]);
  const [syncing, setSyncing] = useState(false);

  // Form fields
  const [fileTitle, setFileTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [uploadedBy, setUploadedBy] = useState('');
  const [version, setVersion] = useState('');

  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const response = await fetch(`${API_BASE}/files`);
      const data = await response.json();
      setFiles(data.files || []);
    } catch (error) {
      console.error('Error loading files:', error);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileTitle(file.name);
      setMessage({ text: `Selected: ${file.name}`, type: 'info' });
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage({ text: 'Please select a file first', type: 'error' });
      return;
    }

    if (!category || !description || !effectiveDate || !uploadedBy || !version) {
      setMessage({ text: 'Please fill in all required fields', type: 'error' });
      return;
    }

    setUploading(true);
    setMessage({ text: 'Uploading...', type: 'info' });

    try {
      const formData = new FormData();
      formData.append('files', selectedFile);

      const response = await fetch(`${API_BASE}/upload`, {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ text: `✅ Successfully uploaded ${selectedFile.name}`, type: 'success' });
        
        // Reset form
        setSelectedFile(null);
        setFileTitle('');
        setCategory('');
        setDescription('');
        setEffectiveDate('');
        setUploadedBy('');
        setVersion('');
        
        // Reload files
        loadFiles();
      } else {
        setMessage({ text: `❌ Upload failed: ${data.errors.join(', ')}`, type: 'error' });
      }
    } catch (error) {
      setMessage({ text: `❌ Error: ${error.message}`, type: 'error' });
    } finally {
      setUploading(false);
    }
  };

  const handleSyncNow = async () => {
    setSyncing(true);
    setMessage({ text: 'Syncing with robot...', type: 'info' });

    try {
      const response = await fetch(`${API_BASE}/rebuild-kb`, {
        method: 'POST'
      });

      const data = await response.json();

      if (data.success) {
        setMessage({ text: '✅ Knowledge base rebuilt successfully!', type: 'success' });
      } else {
        setMessage({ text: `⚠️ Rebuild completed with warnings`, type: 'warning' });
      }
    } catch (error) {
      setMessage({ text: `❌ Sync error: ${error.message}`, type: 'error' });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="page">

      {/* HEADER */}
      <div className="contentHeader">
         <div className="titleWithSync">
        <h1>Content Management</h1>

        <div className="syncNow" onClick={handleSyncNow} style={{ cursor: syncing ? 'wait' : 'pointer' }}>
          <InfoOutlinedIcon className="syncInfoIcon" />
          <span>{syncing ? 'SYNCING...' : 'SYNC NOW'}</span>
          <SyncIcon className={`syncIcon ${syncing ? 'spinning' : ''}`} />
        </div>
        </div>
      </div>

      <div className="logsHeaderInfo">
        <p className="logsDescription">
          Files, documents, and resources ({files.length} files)
        </p>
        <div className="logsDivider"></div>
      </div>

      {/* MESSAGE */}
      {message.text && (
        <div className={`uploadMessage ${message.type}`} style={{
          padding: '15px',
          marginBottom: '20px',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          backgroundColor: message.type === 'success' ? '#d4edda' : message.type === 'error' ? '#f8d7da' : '#d1ecf1',
          color: message.type === 'success' ? '#155724' : message.type === 'error' ? '#721c24' : '#0c5460',
          border: `1px solid ${message.type === 'success' ? '#c3e6cb' : message.type === 'error' ? '#f5c6cb' : '#bee5eb'}`
        }}>
          {message.type === 'success' && <CheckCircleIcon />}
          {message.type === 'error' && <ErrorIcon />}
          <span>{message.text}</span>
        </div>
      )}

      {/* UPLOAD FORM SECTION */}
      <div className="contentUploadWrapper">
        {/* LEFT */}
        <div className="uploadBox">
          <h2>Upload Form</h2>

          <div className="uploadDropzone">
            <CloudUploadIcon className="uploadIcon" />
            <input 
              type="file" 
              id="fileInput" 
              accept=".pdf,.csv,.txt,.docx"
              onChange={handleFileSelect}
              style={{ display: 'none' }}
            />
            <button 
              className="uploadBtn" 
              onClick={() => document.getElementById('fileInput').click()}
              disabled={uploading}
            >
              {uploading ? 'UPLOADING...' : 'SELECT FILE'}
            </button>
            <p className="uploadNote">
              {selectedFile ? `Selected: ${selectedFile.name}` : 'Only PDF, CSV, TXT, DOCX files are supported'}
            </p>
          </div>

          <button 
            className="submitUploadBtn"
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            style={{ 
              marginTop: '20px', 
              width: '100%',
              padding: '12px',
              backgroundColor: selectedFile && !uploading ? '#4CAF50' : '#ccc',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: selectedFile && !uploading ? 'pointer' : 'not-allowed',
              fontSize: '16px',
              fontWeight: 'bold'
            }}
          >
            {uploading ? 'UPLOADING...' : 'SUBMIT UPLOAD'}
          </button>
        </div>

        {/* RIGHT */}
        <div className="uploadForm">
          <div className="formGroup">
            <label>File Title (Automatic)</label>
            <input 
              disabled 
              value={fileTitle}
              placeholder="Automatically taken from the file name" 
            />
          </div>

          <div className="formGroup">
            <label>File Category*</label>
            <input 
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Enter the type of file (e.g. Handbook, History, Course)" 
            />
          </div>

          <div className="formGroup">
            <label>File Description*</label>
            <input 
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter a short summary of the file contents" 
            />
          </div>

          <div className="formGroup">
            <label>Effective Date / Validity*</label>
            <input 
              value={effectiveDate}
              onChange={(e) => setEffectiveDate(e.target.value)}
              placeholder="Enter the period when the document is valid (e.g. AY 2025–2026)" 
            />
          </div>

          <div className="formGroup">
            <label>Uploaded By*</label>
            <input 
              value={uploadedBy}
              onChange={(e) => setUploadedBy(e.target.value)}
              placeholder="Enter the name of the uploader (e.g. Registrar's Office)" 
            />
          </div>

          <div className="formGroup">
            <label>Version / Revision Number*</label>
            <input 
              value={version}
              onChange={(e) => setVersion(e.target.value)}
              placeholder="Enter version details (e.g. v1.0, Revised March 2025)" 
            />
          </div>

          <div className="formGroup">
            <label>Upload Date (Automatic)</label>
            <input 
              disabled 
              value={new Date().toLocaleString()}
              placeholder="The system records the date and time of upload" 
            />
          </div>
        </div>
      </div>

      {/* FILES LIST */}
      <div className="filesListSection" style={{ marginTop: '40px' }}>
        <h2>Uploaded Files</h2>
        <div className="filesGrid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '20px',
          marginTop: '20px'
        }}>
          {files.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666', padding: '20px', gridColumn: '1 / -1' }}>
              No files uploaded yet
            </p>
          ) : (
            files.map((file, index) => (
              <div key={index} className="fileCard" style={{
                padding: '20px',
                border: '1px solid #ddd',
                borderRadius: '8px',
                textAlign: 'center',
                backgroundColor: '#f9f9f9'
              }}>
                <div className="fileIcon" style={{ fontSize: '48px', marginBottom: '10px' }}>📄</div>
                <div className="fileName" style={{ fontWeight: 'bold', marginBottom: '5px', wordBreak: 'break-word' }}>{file.name}</div>
                <div className="fileSize" style={{ fontSize: '14px', color: '#666' }}>{(file.size / 1024).toFixed(2)} KB</div>
                <div className="fileStorage" style={{ fontSize: '12px', color: '#999', marginTop: '5px' }}>{file.storage_type}</div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ContentManagement;
