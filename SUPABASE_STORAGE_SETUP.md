# 🚀 Supabase Storage Setup Guide

Complete guide to set up cloud storage for robot knowledge base files.

---

## 📋 What This Does

- ✅ Upload files to Supabase Storage (cloud)
- ✅ RPI5 auto-syncs files every 5 minutes
- ✅ Knowledge base rebuilds automatically
- ✅ Multiple robots can sync from same source
- ✅ No manual file transfer needed

---

## Step 1: Create Supabase Storage Bucket (5 minutes)

### 1.1 Go to Supabase Dashboard
https://supabase.com/dashboard

### 1.2 Select Your Project
Click on your project: `HelloWorld`

### 1.3 Create Storage Bucket
1. Click **Storage** in left sidebar
2. Click **New Bucket**
3. Settings:
   - **Name**: `robot-knowledge-base`
   - **Public bucket**: ✅ YES (so RPI5 can download)
   - **File size limit**: 50 MB
   - **Allowed MIME types**: Leave empty (allow all)
4. Click **Create Bucket**

### 1.4 Set Bucket Policies
1. Click on the `robot-knowledge-base` bucket
2. Go to **Policies** tab
3. Click **New Policy**
4. Select **For full customization**
5. Add this policy:

```sql
-- Allow public read access
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'robot-knowledge-base' );

-- Allow authenticated uploads
CREATE POLICY "Authenticated Upload"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'robot-knowledge-base' 
  AND auth.role() = 'authenticated'
);
```

6. Click **Review** then **Save Policy**

---

## Step 2: Install Dependencies

```bash
cd admin-panel
pip install -r requirements.txt
```

This installs:
- `fastapi` - Web framework
- `uvicorn` - ASGI server
- `supabase` - Supabase client
- `storage3` - Storage API
- `python-dotenv` - Environment variables

---

## Step 3: Verify Environment Variables

Check your `.env` file has:

```env
SUPABASE_URL=https://ulezxxghvnvypgiebbnp.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

✅ Already configured in your `.env` file!

---

## Step 4: Start Admin Panel with Supabase

```bash
cd admin-panel
python admin_panel_backend_supabase.py
```

Expected output:
```
==================================================
🚀 JRU Robot Admin Panel API (Supabase)
==================================================
📁 Local upload directory: D:\campus-robot\jru-chatbot-robot\backend\data\uploads
🌐 Storage: Supabase
📦 Bucket: robot-knowledge-base
🌐 API running on: http://localhost:8000
📖 Docs available at: http://localhost:8000/docs
==================================================
✅ Supabase Storage enabled
   Bucket: robot-knowledge-base
```

---

## Step 5: Test Upload

### Option A: Use Web Interface

1. Open `admin-panel/admin-panel.html` in browser
2. Drag & drop a PDF file
3. Click "Upload Selected Files"
4. Should see: "✅ Uploaded to Supabase"

### Option B: Use API Docs

1. Go to http://localhost:8000/docs
2. Click on `POST /api/upload`
3. Click "Try it out"
4. Upload a file
5. Click "Execute"

### Option C: Use curl

```bash
curl -X POST "http://localhost:8000/api/upload" \
  -F "files=@student_handbook.pdf"
```

---

## Step 6: Verify Upload in Supabase

1. Go to Supabase Dashboard → Storage
2. Click on `robot-knowledge-base` bucket
3. Open `knowledge-base/` folder
4. You should see your uploaded file!

---

## Step 7: Set Up RPI5 Auto-Sync

### 7.1 Update RPI5 .env

SSH to RPI5 and edit `.env`:

```bash
ssh pi@YOUR_PI_IP
cd ~/jru-chatbot-robot/backend
nano .env
```

Add/verify:
```env
SUPABASE_URL=https://ulezxxghvnvypgiebbnp.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
ENABLE_AUTO_SYNC=True
SYNC_INTERVAL=300
```

### 7.2 Install Supabase on RPI5

```bash
pip install supabase storage3
```

### 7.3 Test Sync

```bash
python admin_sync.py
```

Expected output:
```
📥 Checking for updates from admin panel...
📦 Found 3 files in Supabase storage
📥 Downloading: student_handbook.pdf
✅ Downloaded: student_handbook.pdf (2.5 MB)
✅ Knowledge base is up to date
```

---

## Step 8: Enable Auto-Sync in Robot

The robot will now automatically:
1. Check Supabase every 5 minutes
2. Download new files
3. Rebuild knowledge base
4. Start using new information

No manual intervention needed!

---

## 🎯 Complete Workflow

### Admin Side (Your PC):
```
1. Open admin panel
2. Upload new PDF
3. File goes to Supabase Storage
4. Done! ✅
```

### Robot Side (RPI5):
```
1. Checks Supabase every 5 minutes
2. Finds new file
3. Downloads automatically
4. Rebuilds knowledge base
5. Starts using new info
6. All automatic! ✅
```

---

## 📊 API Endpoints

### Upload Files
```bash
POST /api/upload
```

### List Files
```bash
GET /api/files
```

### Rebuild Knowledge Base
```bash
POST /api/rebuild-kb
```

### Sync Status
```bash
GET /api/sync-status
```

### Sync to Robot
```bash
POST /api/sync-to-robot
```

---

## 🔍 Troubleshooting

### "Supabase credentials not found"
- Check `.env` file exists
- Verify `SUPABASE_URL` and `SUPABASE_KEY` are set
- Restart backend after updating `.env`

### "Bucket not found"
- Create bucket in Supabase Dashboard
- Name must be exactly: `robot-knowledge-base`
- Make sure it's public

### "Permission denied"
- Check bucket policies
- Make sure public read is enabled
- Verify authenticated upload policy

### "Upload failed"
- Check file size (<50MB)
- Check file type (PDF, CSV, TXT)
- Check internet connection

### RPI5 not syncing
- Check `.env` on RPI5
- Verify `ENABLE_AUTO_SYNC=True`
- Check internet connection on RPI5
- Run `python admin_sync.py` manually to test

---

## 🎉 Success Checklist

- [ ] Supabase bucket created
- [ ] Bucket policies set
- [ ] Dependencies installed
- [ ] Backend running
- [ ] Test upload successful
- [ ] File visible in Supabase
- [ ] RPI5 .env updated
- [ ] RPI5 sync tested
- [ ] Auto-sync working

---

## 📝 Quick Commands

```bash
# Start admin panel
cd admin-panel
python admin_panel_backend_supabase.py

# Test upload
curl -X POST "http://localhost:8000/api/upload" \
  -F "files=@test.pdf"

# List files
curl http://localhost:8000/api/files

# Check sync status
curl http://localhost:8000/api/sync-status

# On RPI5: Test sync
ssh pi@YOUR_PI_IP
cd ~/jru-chatbot-robot/backend
python admin_sync.py
```

---

## 🔐 Security Notes

- ✅ Bucket is public for read (RPI5 can download)
- ✅ Upload requires authentication
- ✅ Files are in cloud (accessible anywhere)
- ⚠️ Don't commit `.env` to Git
- ⚠️ Use HTTPS in production

---

## 💰 Cost

**Supabase Free Tier:**
- Storage: 1 GB
- Bandwidth: 2 GB/month
- **Cost: FREE**

Your usage:
- ~10-20 PDF files
- ~50-100 MB total
- Well within free tier!

---

## 🚀 Next Steps

1. ✅ Set up Supabase bucket
2. ✅ Start admin panel
3. ✅ Upload test file
4. ✅ Configure RPI5
5. ✅ Test auto-sync
6. 🎉 Deploy to production!

---

**Ready? Start with Step 1: Create the Supabase bucket!** 🚀
