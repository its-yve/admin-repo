# admin_panel_backend.py - FastAPI backend for admin panel
"""
Admin Panel Backend for JRU Campus Robot
Features:
- File upload (PDF, CSV)
- Knowledge base management
- Robot status monitoring
- Sync control
"""

from fastapi import FastAPI, UploadFile, File, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import os
import shutil
from pathlib import Path
from typing import List, Optional
import subprocess
from datetime import datetime
import hashlib

# Configuration
UPLOAD_DIR = Path("data/uploads")
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_EXTENSIONS = {".pdf", ".csv", ".txt"}
MAX_FILE_SIZE = 50 * 1024 * 1024  # 50MB

# Initialize FastAPI
app = FastAPI(
    title="JRU Robot Admin Panel API",
    description="Backend API for managing JRU Campus Robot",
    version="1.0.0"
)

# CORS - Allow frontend to access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

# ==================== MODELS ====================

class FileInfo(BaseModel):
    filename: str
    size: int
    uploaded_at: str
    checksum: str

class KnowledgeBaseStatus(BaseModel):
    file_count: int
    total_size: int
    last_rebuild: Optional[str]
    files: List[FileInfo]

class SyncResponse(BaseModel):
    success: bool
    message: str
    files_synced: int

# ==================== HELPER FUNCTIONS ====================

def calculate_checksum(file_path: Path) -> str:
    """Calculate MD5 checksum of file"""
    md5 = hashlib.md5()
    with open(file_path, 'rb') as f:
        for chunk in iter(lambda: f.read(4096), b''):
            md5.update(chunk)
    return md5.hexdigest()

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)) -> bool:
    """Verify JWT token (simplified - in production use proper JWT)"""
    # For now, accept any token
    # In production: verify JWT signature and expiration
    return True

# ==================== ENDPOINTS ====================

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "JRU Robot Admin Panel API",
        "version": "1.0.0"
    }

@app.post("/api/upload")
async def upload_file(
    file: UploadFile = File(...),
    authorized: bool = Depends(verify_token)
):
    """
    Upload a file to the knowledge base.
    Accepts: PDF, CSV, TXT files
    """
    # Validate file extension
    file_ext = Path(file.filename).suffix.lower()
    if file_ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"File type {file_ext} not allowed. Allowed: {ALLOWED_EXTENSIONS}"
        )
    
    # Save file
    file_path = UPLOAD_DIR / file.filename
    
    try:
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Calculate checksum
        checksum = calculate_checksum(file_path)
        file_size = file_path.stat().st_size
        
        return {
            "success": True,
            "message": f"File '{file.filename}' uploaded successfully",
            "filename": file.filename,
            "size": file_size,
            "checksum": checksum,
            "uploaded_at": datetime.now().isoformat()
        }
    
    except Exception as e:
        # Clean up on error
        if file_path.exists():
            file_path.unlink()
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@app.get("/api/files", response_model=KnowledgeBaseStatus)
async def list_files(authorized: bool = Depends(verify_token)):
    """Get list of all uploaded files"""
    files = []
    total_size = 0
    
    for file_path in UPLOAD_DIR.glob("*"):
        if file_path.is_file() and file_path.suffix.lower() in ALLOWED_EXTENSIONS:
            stat = file_path.stat()
            files.append(FileInfo(
                filename=file_path.name,
                size=stat.st_size,
                uploaded_at=datetime.fromtimestamp(stat.st_mtime).isoformat(),
                checksum=calculate_checksum(file_path)
            ))
            total_size += stat.st_size
    
    # Get last rebuild time
    index_path = Path("local_db.index")
    last_rebuild = None
    if index_path.exists():
        last_rebuild = datetime.fromtimestamp(
            index_path.stat().st_mtime
        ).isoformat()
    
    return KnowledgeBaseStatus(
        file_count=len(files),
        total_size=total_size,
        last_rebuild=last_rebuild,
        files=files
    )

@app.delete("/api/files/{filename}")
async def delete_file(filename: str, authorized: bool = Depends(verify_token)):
    """Delete a file from the knowledge base"""
    file_path = UPLOAD_DIR / filename
    
    if not file_path.exists():
        raise HTTPException(status_code=404, detail="File not found")
    
    try:
        file_path.unlink()
        return {
            "success": True,
            "message": f"File '{filename}' deleted successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Delete failed: {str(e)}")

@app.post("/api/rebuild-kb", response_model=SyncResponse)
async def rebuild_knowledge_base(authorized: bool = Depends(verify_token)):
    """Rebuild the knowledge base from all uploaded files"""
    try:
        # Run build_database.py
        result = subprocess.run(
            ["python", "build_database.py"],
            capture_output=True,
            text=True,
            timeout=300  # 5 minute timeout
        )
        
        if result.returncode == 0:
            # Count files
            file_count = len(list(UPLOAD_DIR.glob("*.*")))
            
            return SyncResponse(
                success=True,
                message="Knowledge base rebuilt successfully",
                files_synced=file_count
            )
        else:
            raise HTTPException(
                status_code=500,
                detail=f"Rebuild failed: {result.stderr}"
            )
    
    except subprocess.TimeoutExpired:
        raise HTTPException(status_code=500, detail="Rebuild timed out")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Rebuild error: {str(e)}")

@app.get("/api/robot/status")
async def get_robot_status():
    """Get current robot status (if connected to Supabase)"""
    # This would query Supabase for robot status
    # For now, return mock data
    return {
        "robot_id": "lily-001",
        "status": "online",
        "last_seen": datetime.now().isoformat(),
        "battery": {
            "percentage": 85,
            "charging": False,
            "voltage": 12.6
        },
        "mode": "cloud",
        "llm_service": "groq"
    }

@app.post("/api/robot/sync")
async def trigger_robot_sync(authorized: bool = Depends(verify_token)):
    """Trigger robot to sync knowledge base from Supabase"""
    # This would send a signal to the robot via Supabase
    # For now, just rebuild locally
    return await rebuild_knowledge_base(authorized)

# ==================== STARTUP ====================

@app.on_event("startup")
async def startup_event():
    """Initialize on startup"""
    print("=" * 50)
    print("🚀 JRU Robot Admin Panel API")
    print("=" * 50)
    print(f"📁 Upload directory: {UPLOAD_DIR.absolute()}")
    print(f"📊 Files in KB: {len(list(UPLOAD_DIR.glob('*.*')))}")
    print(f"🌐 API running on: http://localhost:8000")
    print(f"📖 Docs available at: http://localhost:8000/docs")
    print("=" * 50)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)