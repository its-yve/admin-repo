# admin_panel_backend_supabase.py - Admin Panel with Supabase Storage

from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import os
import shutil
from pathlib import Path
from typing import List, Optional
import subprocess
from datetime import datetime
from dotenv import load_dotenv
import logging

# Load environment variables
load_dotenv(Path(__file__).parent.parent / ".env")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI
app = FastAPI(
    title="JRU Robot Admin Panel API (Supabase)",
    description="Backend API with Supabase Storage integration",
    version="2.0.0"
)

# CORS - Allow all origins for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow file:// and localhost
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Supabase configuration
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
BUCKET_NAME = "robot-knowledge-base"

# Initialize Supabase client
supabase_client = None
STORAGE_ENABLED = False

try:
    from supabase import create_client
    if SUPABASE_URL and SUPABASE_KEY:
        supabase_client = create_client(SUPABASE_URL, SUPABASE_KEY)
        STORAGE_ENABLED = True
        logger.info("✅ Supabase Storage enabled")
        logger.info(f"   Bucket: {BUCKET_NAME}")
    else:
        logger.warning("⚠️ Supabase credentials not found")
except ImportError as e:
    logger.warning(f"⚠️ Supabase library error: {e}")
except Exception as e:
    logger.error(f"❌ Supabase initialization error: {e}")

# Local fallback directory
LOCAL_UPLOAD_DIR = Path("../jru-chatbot-robot/backend/data/uploads")
LOCAL_UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Configuration
ALLOWED_EXTENSIONS = {".pdf", ".csv", ".txt"}
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB


class FileInfo(BaseModel):
    name: str
    size: int
    uploaded_at: str
    storage_type: str  # "supabase" or "local"


class SyncStatus(BaseModel):
    last_sync: Optional[str]
    files_synced: int
    storage_enabled: bool
    bucket_name: str


@app.get("/")
async def root():
    """Serve the admin panel HTML"""
    html_file = Path(__file__).parent / "admin-panel.html"
    if html_file.exists():
        return FileResponse(html_file)
    return {
        "message": "JRU Robot Admin Panel API",
        "version": "2.0.0",
        "storage": "Supabase" if STORAGE_ENABLED else "Local",
        "endpoints": {
            "upload": "/api/upload",
            "files": "/api/files",
            "rebuild": "/api/rebuild-kb",
            "sync": "/api/sync-status"
        }
    }


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "storage_enabled": STORAGE_ENABLED,
        "supabase_url": SUPABASE_URL if SUPABASE_URL else "Not configured"
    }


@app.post("/api/upload")
async def upload_files(files: List[UploadFile] = File(...)):
    """
    Upload files to Supabase Storage (or local fallback)
    """
    uploaded_files = []
    errors = []
    
    for file in files:
        try:
            # Validate file extension
            file_ext = Path(file.filename).suffix.lower()
            if file_ext not in ALLOWED_EXTENSIONS:
                errors.append(f"{file.filename}: Invalid file type")
                continue
            
            # Read file content
            content = await file.read()
            file_size = len(content)
            
            # Validate file size
            if file_size > MAX_FILE_SIZE:
                errors.append(f"{file.filename}: File too large (max 50MB)")
                continue
            
            # Upload to Supabase Storage
            if STORAGE_ENABLED and supabase_client:
                try:
                    # Upload to Supabase Storage
                    file_path = f"knowledge-base/{file.filename}"
                    
                    result = supabase_client.storage.from_(BUCKET_NAME).upload(
                        path=file_path,
                        file=content,
                        file_options={"content-type": file.content_type}
                    )
                    
                    logger.info(f"✅ Uploaded to Supabase: {file.filename}")
                    
                    uploaded_files.append({
                        "filename": file.filename,
                        "size": file_size,
                        "storage": "supabase",
                        "path": file_path
                    })
                    
                except Exception as e:
                    logger.error(f"❌ Supabase upload failed for {file.filename}: {e}")
                    # Fallback to local storage
                    local_path = LOCAL_UPLOAD_DIR / file.filename
                    with open(local_path, "wb") as f:
                        f.write(content)
                    
                    uploaded_files.append({
                        "filename": file.filename,
                        "size": file_size,
                        "storage": "local (fallback)",
                        "path": str(local_path)
                    })
            else:
                # Local storage only
                local_path = LOCAL_UPLOAD_DIR / file.filename
                with open(local_path, "wb") as f:
                    f.write(content)
                
                logger.info(f"✅ Saved locally: {file.filename}")
                
                uploaded_files.append({
                    "filename": file.filename,
                    "size": file_size,
                    "storage": "local",
                    "path": str(local_path)
                })
            
        except Exception as e:
            errors.append(f"{file.filename}: {str(e)}")
            logger.error(f"❌ Error uploading {file.filename}: {e}")
    
    return {
        "success": len(uploaded_files) > 0,
        "uploaded": uploaded_files,
        "errors": errors,
        "storage_type": "supabase" if STORAGE_ENABLED else "local"
    }


@app.get("/api/files")
async def list_files():
    """
    List all files in knowledge base (from Supabase or local)
    """
    files = []
    
    try:
        if STORAGE_ENABLED and supabase_client:
            # List files from Supabase Storage
            try:
                result = supabase_client.storage.from_(BUCKET_NAME).list("knowledge-base")
                
                for item in result:
                    files.append({
                        "name": item["name"],
                        "size": item.get("metadata", {}).get("size", 0),
                        "uploaded_at": item.get("created_at", "Unknown"),
                        "storage_type": "supabase"
                    })
                
                logger.info(f"📁 Found {len(files)} files in Supabase")
                
            except Exception as e:
                logger.error(f"❌ Error listing Supabase files: {e}")
        
        # Also check local files
        if LOCAL_UPLOAD_DIR.exists():
            for file_path in LOCAL_UPLOAD_DIR.glob("*"):
                if file_path.is_file():
                    stat = file_path.stat()
                    files.append({
                        "name": file_path.name,
                        "size": stat.st_size,
                        "uploaded_at": datetime.fromtimestamp(stat.st_mtime).isoformat(),
                        "storage_type": "local"
                    })
        
        return {
            "success": True,
            "files": files,
            "total_files": len(files),
            "storage_type": "supabase" if STORAGE_ENABLED else "local"
        }
        
    except Exception as e:
        logger.error(f"❌ Error listing files: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/rebuild-kb")
async def rebuild_knowledge_base():
    """
    Trigger knowledge base rebuild
    """
    try:
        backend_dir = Path("../jru-chatbot-robot/backend")
        
        if not backend_dir.exists():
            raise HTTPException(status_code=404, detail="Backend directory not found")
        
        # Run build_database.py
        logger.info("🔨 Rebuilding knowledge base...")
        
        result = subprocess.run(
            ["python", "build_database.py"],
            cwd=backend_dir,
            capture_output=True,
            text=True,
            timeout=300  # 5 minute timeout
        )
        
        if result.returncode == 0:
            logger.info("✅ Knowledge base rebuilt successfully")
            return {
                "success": True,
                "message": "Knowledge base rebuilt successfully",
                "output": result.stdout
            }
        else:
            logger.error(f"❌ Knowledge base rebuild failed: {result.stderr}")
            return {
                "success": False,
                "message": "Knowledge base rebuild failed",
                "error": result.stderr
            }
            
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=408, detail="Rebuild timeout (>5 minutes)")
    except Exception as e:
        logger.error(f"❌ Error rebuilding KB: {e}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/sync-status")
async def get_sync_status():
    """
    Get sync status and storage info
    """
    return {
        "storage_enabled": STORAGE_ENABLED,
        "storage_type": "supabase" if STORAGE_ENABLED else "local",
        "bucket_name": BUCKET_NAME if STORAGE_ENABLED else None,
        "supabase_url": SUPABASE_URL if SUPABASE_URL else None,
        "local_dir": str(LOCAL_UPLOAD_DIR),
        "timestamp": datetime.now().isoformat()
    }


@app.post("/api/sync-to-robot")
async def sync_to_robot():
    """
    Trigger sync from Supabase to robot (for RPI5 to call)
    """
    if not STORAGE_ENABLED:
        raise HTTPException(status_code=503, detail="Supabase storage not enabled")
    
    try:
        # This endpoint would be called by RPI5 to download files
        files = []
        result = supabase_client.storage.from_(BUCKET_NAME).list("knowledge-base")
        
        for item in result:
            file_path = f"knowledge-base/{item['name']}"
            # Get download URL
            url = supabase_client.storage.from_(BUCKET_NAME).get_public_url(file_path)
            
            files.append({
                "name": item["name"],
                "url": url,
                "size": item.get("metadata", {}).get("size", 0)
            })
        
        return {
            "success": True,
            "files": files,
            "message": f"Found {len(files)} files to sync"
        }
        
    except Exception as e:
        logger.error(f"❌ Error syncing to robot: {e}")
        raise HTTPException(status_code=500, detail=str(e))


if __name__ == "__main__":
    import uvicorn
    
    print("=" * 50)
    print("🚀 JRU Robot Admin Panel API (Supabase)")
    print("=" * 50)
    print(f"📁 Local upload directory: {LOCAL_UPLOAD_DIR.absolute()}")
    print(f"🌐 Storage: {'Supabase' if STORAGE_ENABLED else 'Local only'}")
    if STORAGE_ENABLED:
        print(f"📦 Bucket: {BUCKET_NAME}")
    print(f"🌐 API running on: http://localhost:8000")
    print(f"📖 Docs available at: http://localhost:8000/docs")
    print("=" * 50)
    
    uvicorn.run(app, host="0.0.0.0", port=8000)
