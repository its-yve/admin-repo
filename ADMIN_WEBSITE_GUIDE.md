# Admin Website Setup Guide

Complete guide to run the React admin website with Supabase integration.

## Overview

The admin website is a React app that connects to the Supabase backend for file uploads and management.

**Architecture:**
```
React App (port 3000) → Backend API (port 8000) → Supabase Storage
```

## Prerequisites

1. **Node.js** installed (v14 or higher)
2. **Python** installed (3.8 or higher)
3. **Supabase** bucket created: `robot-knowledge-base`

## Quick Start

### Option 1: One-Click Start (Recommended)

```bash
START_ADMIN_WEBSITE.bat
```

This will:
1. Start backend API on port 8000
2. Start React app on port 3000
3. Open browser automatically

### Option 2: Manual Start

**Terminal 1 - Backend:**
```bash
cd admin-panel
python admin_panel_backend_supabase.py
```

**Terminal 2 - React App:**
```bash
cd admin-website
npm start
```

## First Time Setup

### 1. Install Node Dependencies

```bash
cd admin-website
npm install
```

This installs:
- React
- Material-UI
- React Router
- Other dependencies

### 2. Install Python Dependencies

```bash
cd admin-panel
pip install -r requirements.txt
```

This installs:
- FastAPI
- Supabase client
- Other backend dependencies

### 3. Configure Environment

Make sure `.env` file in root has:
```env
SUPABASE_URL=https://ulezxxghvnvypgiebbnp.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Create Supabase Bucket

1. Go to: https://supabase.com/dashboard
2. Select project: "Lily - Campus Robot"
3. Storage → New Bucket
4. Name: `robot-knowledge-base`
5. Public: YES
6. Add policies (see SUPABASE_STORAGE_SETUP.md)

## Using the Admin Website

### 1. Access the Website

Open browser to: **http://localhost:3000**

### 2. Navigate to Content Management

Click "Content Management" in the sidebar

### 3. Upload Files

1. Click "SELECT FILE" button
2. Choose a PDF, CSV, TXT, or DOCX file
3. Fill in required fields:
   - File Category
   - File Description
   - Effective Date
   - Uploaded By
   - Version Number
4. Click "SUBMIT UPLOAD"
5. Wait for success message

### 4. Sync with Robot

Click "SYNC NOW" button to rebuild knowledge base

### 5. View Uploaded Files

Scroll down to see all uploaded files in grid view

## Features

### Content Management Page

- ✅ File upload with drag & drop
- ✅ Form validation
- ✅ Real-time upload progress
- ✅ Success/error messages
- ✅ File listing with details
- ✅ Sync with robot button
- ✅ Automatic file count

### Backend API

- ✅ Supabase Storage integration
- ✅ File upload endpoint
- ✅ File listing endpoint
- ✅ Knowledge base rebuild
- ✅ CORS enabled for React app

## Troubleshooting

### "Failed to fetch" Error

**Cause:** Backend not running

**Fix:**
1. Check backend terminal for errors
2. Make sure it shows: "Uvicorn running on http://0.0.0.0:8000"
3. Test: http://localhost:8000/api/health
4. Restart backend if needed

### React App Won't Start

**Cause:** Dependencies not installed or port in use

**Fix:**
```bash
cd admin-website
npm install
npm start
```

If port 3000 is in use:
```bash
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

### Upload Fails

**Cause:** Supabase bucket not configured

**Fix:**
1. Check Supabase dashboard
2. Verify bucket exists: `robot-knowledge-base`
3. Check bucket is public
4. Verify policies are set

### Files Don't Appear

**Cause:** Backend can't connect to Supabase

**Fix:**
1. Check `.env` file has correct credentials
2. Check backend logs for errors
3. Test Supabase connection:
   ```bash
   curl http://localhost:8000/api/sync-status
   ```

## Development

### File Structure

```
admin-website/
├── public/
│   └── index.html
├── src/
│   ├── App.js                    # Main app
│   ├── Components/
│   │   ├── Sidebar.js           # Navigation
│   │   └── SidebarData.js       # Menu items
│   └── Pages/
│       ├── ContentManagement.js  # File upload page ✨
│       ├── RobotStatus.js
│       ├── StudentLogs.js
│       ├── Reports.js
│       └── Settings.js
├── package.json
└── README.md
```

### API Endpoints Used

```javascript
const API_BASE = 'http://localhost:8000/api';

// Upload files
POST /api/upload
Body: FormData with 'files' field

// List files
GET /api/files
Response: { files: [...], total_files: N }

// Rebuild knowledge base
POST /api/rebuild-kb
Response: { success: true, message: "..." }

// Sync status
GET /api/sync-status
Response: { storage_enabled: true, ... }
```

### Adding New Features

To add new API calls:

1. Add function in ContentManagement.js:
```javascript
const myNewFunction = async () => {
  const response = await fetch(`${API_BASE}/my-endpoint`);
  const data = await response.json();
  // Handle data
};
```

2. Add button/trigger:
```javascript
<button onClick={myNewFunction}>My Action</button>
```

## Testing

### Test Backend Connection

```bash
curl http://localhost:8000/api/health
curl http://localhost:8000/api/files
```

### Test File Upload

```bash
curl -X POST "http://localhost:8000/api/upload" -F "files=@test.pdf"
```

### Test React App

1. Open: http://localhost:3000
2. Navigate to Content Management
3. Try uploading a file
4. Check browser console (F12) for errors

## Production Deployment

### Build React App

```bash
cd admin-website
npm run build
```

This creates optimized production build in `build/` folder.

### Deploy Backend

1. Update API_BASE in ContentManagement.js to production URL
2. Deploy backend to cloud (Heroku, Railway, etc.)
3. Update CORS settings for production domain

### Deploy React App

1. Upload `build/` folder to web host
2. Configure web server to serve React app
3. Update environment variables

## Success Checklist

- [ ] Node.js installed
- [ ] Dependencies installed (npm install)
- [ ] Backend running on port 8000
- [ ] React app running on port 3000
- [ ] Supabase bucket created
- [ ] Can access http://localhost:3000
- [ ] Content Management page loads
- [ ] Can select files
- [ ] Can upload files
- [ ] Success message appears
- [ ] Files appear in list
- [ ] Sync button works

## Quick Commands

```bash
# Install dependencies
cd admin-website && npm install
cd admin-panel && pip install -r requirements.txt

# Start everything
START_ADMIN_WEBSITE.bat

# Start backend only
cd admin-panel
python admin_panel_backend_supabase.py

# Start React only
cd admin-website
npm start

# Build for production
cd admin-website
npm run build

# Test backend
curl http://localhost:8000/api/health
```

## Support

If you encounter issues:

1. Check both terminal windows for errors
2. Check browser console (F12) for JavaScript errors
3. Verify Supabase credentials in `.env`
4. Test backend endpoints with curl
5. Check Supabase dashboard for uploaded files

## Next Steps

After successful setup:

1. Upload student handbook PDF
2. Upload CSV data files
3. Test sync with RPI5
4. Customize UI as needed
5. Add more features to admin panel

---

**Ready to start? Run `START_ADMIN_WEBSITE.bat` and open http://localhost:3000!** 🚀
