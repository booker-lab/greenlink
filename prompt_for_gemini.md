**[Agent-to-Agent Protocol]**
> Role: Senior Architect & Code Reviewer
> 모든 기술적 해결책은 아래 [Antigravity Task] 블록 형식을 반드시 준수한다.
>
> **[Antigravity Task]**
> - **근본 원인**: 문제의 핵심 원인 한 줄 요약
> - **파일 경로**: 수정이 필요한 파일 상대 경로
> - **직접 명령**: Antigravity Agent 에게 내릴 구체적 Instruction
> - **수정 코드**: `diff` 또는 최소한의 교체 로직만 제공 (전체 코드 재출력 금지)


---

# [Session Report] — eco_pediatrics Error Tracker
> Session Started: 2026-02-20 09:45:46
> Total Errors in Session: 0

## 1. Session Error History

_에러 감지 전 (대기 중)_

## 2. Source Code Context

#### `backend\main.py`
```python
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException as StarletteHTTPException
import os
from contextlib import asynccontextmanager

from database import init_supabase
from websocket_manager import manager
from logger import logger
from utils import execute_with_retry_async

# Import routers
from routers import admissions, station, iv_records, vitals, exams, dev, meals

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize Supabase and store in app.state
    if not hasattr(app.state, "supabase") or not app.state.supabase:
        app.state.supabase = await init_supabase()
        logger.info("Supabase AsyncClient initialized and stored in app.state")
    yield
    # Cleanup: Close connections to prevent resource leaks
    if app.state.supabase:
        try:
            # Supabase-py uses internal httpx clients. Closing them explicitly if possible.
            if hasattr(app.state.supabase.auth, "aclose"): # Some versions
                await app.state.supabase.auth.aclose()
            elif hasattr(app.state.supabase.auth, "_client") and hasattr(app.state.supabase.auth._client, "aclose"):
                await app.state.supabase.auth._client.aclose()
            
            if hasattr(app.state.supabase.postgrest, "aclose"):
                await app.state.supabase.postgrest.aclose()
                
            logger.info("Supabase AsyncClient connections closed.")
        except Exception as e:
            logger.warning(f"Error during client cleanup: {e}")

app = FastAPI(lifespan=lifespan)

# --- Global Exception Handlers ---

@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    logger.error(f"HTTP error {exc.status_code}: {exc.detail}")
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.error(f"Validation error: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={"detail": exc.errors()},
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    # Allow individual route HTTPExceptions to pass through to their own handler
    if isinstance(exc, StarletteHTTPException):
        return await http_exception_handler(request, exc)
    
    logger.critical(f"Unhandled exception: {exc}")
    # In development/local, we want more transparency
    detail = "Internal Server Error"
    if os.getenv("ENV") in ["local", "development"]:
        detail = f"Unhandled Exception: {str(exc)}"

    return JSONResponse(
        status_code=500,
        content={"detail": detail},
    )

# Mount Static Files
os.makedirs("uploads", exist_ok=True)
app.mount("/static", StaticFiles(directory="uploads"), name="static")

# CORS Configuration
ALLOWED_ORIGINS = os.environ.get(
    "ALLOWED_ORIGINS", 
    "http://localhost:3000,http://127.0.0.1:3000,http://localhost:3001,http://127.0.0.1:3001,tauri://localhost,http://tauri.localhost,https://tauri.localhost"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

from fastapi import WebSocket, WebSocketDisconnect




# --- Include Routers ---
app.include_router(admissions.router, prefix="/api/v1/admissions", tags=["Admissions"])
app.include_router(station.router, prefix="/api/v1", tags=["Station"]) 
app.include_router(iv_records.router, prefix="/api/v1", tags=["IV Records"])
app.include_router(vitals.router, prefix="/api/v1/vitals", tags=["Vitals"])
app.include_router(exams.router, prefix="/api/v1", tags=["Exams"]) 
app.include_router(meals.router, prefix="/api/v1/meals", tags=["Meals"])


# Conditionally include dev router (Operation Safety)
ENABLE_DEV = os.getenv("ENABLE_DEV_ROUTES", "false").lower() == "true"
ENV = os.getenv("ENV", "development").lower() # Default to development

if ENABLE_DEV and ENV in ["local", "staging", "development"]:
    app.include_router(dev.router, prefix="/api/v1/dev", tags=["Dev"])
    logger.info(f"Dev router mounted (ENABLE_DEV_ROUTES=true, ENV={ENV})")
else:
    logger.info(f"Dev router disabled (ENABLE_DEV_ROUTES={ENABLE_DEV}, ENV={ENV})")

# WS Token Validation
async def verify_ws_token(token: str):
    # 1. Check for Station Auth via Env Variable
    # Default to 'STATION' if not set, following the .env.example guidance
    station_token = os.getenv("STATION_WS_TOKEN", "STATION")
    if token == station_token:
        return True
        
    # 2. Check for Patient Auth (Admission Token) - Must be a valid UUID string
    import uuid
    try:
        uuid.UUID(token)
    except ValueError:
        # Not a UUID, and didn't match station_token, so reject early to avoid DB error 22P02
        return False

    if not hasattr(app.state, "supabase") or not app.state.supabase:
        return False # DB not ready
        
    try:
        # Enforce status == 'IN_PROGRESS' or 'OBSERVATION'
        res = await app.state.supabase.table("admissions") \
            .select("id") \
            .eq("access_token", token) \
            .in_("status", ["IN_PROGRESS", "OBSERVATION"]) \
            .execute()
            
        if res.data:
            return True
    except Exception as e:
        logger.error(f"WS Token Validation Error: {e}")
    
    return False

@app.websocket("/ws/{token}")
async def websocket_endpoint(websocket: WebSocket, token: str):
    # Validate Token
    is_valid = await verify_ws_token(token)
    if not is_valid:
        logger.warning(f"Connection rejected for invalid or inactive token: {token}")
        await websocket.close(code=4003) # Forbidden
        return

    logger.info(f"WebSocket connected for token: {token}")
    await manager.connect(websocket, token)
    try:
        while True:
            await websocket.receive_text() # Keep connection alive
    except WebSocketDisconnect:
        logger.info(f"WebSocket disconnected for token: {token}")
        manager.disconnect(websocket, token)


@app.get("/health")
async def health_check():
    """Health check endpoint to verify DB connection"""
    if not hasattr(app.state, "supabase") or not app.state.supabase:
        return JSONResponse(status_code=503, content={"status": "unavailable", "detail": "Database not initialized"})
    
    try:
        # Lightweight query to verify connection
        await execute_with_retry_async(app.state.supabase.table("admissions").select("id", count="exact").limit(1))
        return {"status": "ok"}
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return JSONResponse(status_code=503, content={"status": "unhealthy", "detail": str(e)})

@app.get("/")
def read_root():
    return {"message": "PID Backend is running"}

```

#### `backend\routers\station.py`
```python
from fastapi import APIRouter, Depends, HTTPException, WebSocket, WebSocketDisconnect
from typing import Optional, List
from supabase._async.client import AsyncClient
from datetime import datetime
import json

from dependencies import get_supabase, get_admission_token_optional, verify_admission_token
from utils import execute_with_retry_async
from services.dashboard import fetch_dashboard_data
from services.station_service import fetch_pending_requests
from websocket_manager import manager
from models import MealRequest, MealRequestCreate, DocumentRequest, DocumentRequestCreate
from schemas import DashboardResponse

router = APIRouter()

@router.get("/dashboard/{token}", response_model=DashboardResponse)
async def get_dashboard_data_by_token(
    token: str, 
    db: AsyncClient = Depends(get_supabase),
    header_token: Optional[str] = Depends(get_admission_token_optional)
):
    """
    Fetch dashboard data using an access_token (Guardian view)
    Supports both path parameter (token) and X-Admission-Token header.
    """
    # Use header token if provided and valid, otherwise fallback to path token
    effective_token = header_token if header_token else token

    res = await execute_with_retry_async(
        db.table("admissions")
        .select("id")
        .eq("access_token", effective_token)
        .in_("status", ["IN_PROGRESS", "OBSERVATION"]) # Enforce active status
        .limit(1)
    )
    
    if not res.data:
        raise HTTPException(status_code=404, detail="Invalid or inactive admission token")

    admission_id = res.data[0]['id']
    return await fetch_dashboard_data(db, admission_id)
    
@router.get("/station/pending-requests")
async def get_pending_requests(db: AsyncClient = Depends(get_supabase)):
    """Fetch all pending notifications for the station sidebar"""
    return await fetch_pending_requests(db)



@router.post("/documents/requests", response_model=DocumentRequest)
async def request_document(
    request: DocumentRequestCreate, 
    db: AsyncClient = Depends(get_supabase),
    token: str = Depends(verify_admission_token)
):
    # Verify admission is active AND token matches (Security Boundary)
    adm_res = await execute_with_retry_async(
        db.table("admissions")
        .select("room_number, access_token")
        .eq("id", request.admission_id)
        .in_("status", ["IN_PROGRESS", "OBSERVATION"])
        .single()
    )
    if not adm_res.data:
        raise HTTPException(status_code=403, detail="Invalid admission ID or patient already discharged")
        
    if adm_res.data["access_token"] != token:
        raise HTTPException(status_code=403, detail="Admission token mismatch")

    # Deduplication Check: Check for existing PENDING requests with same items
    # Sort request items to ensure consistent comparison
    request_items_sorted = sorted(request.request_items)
    
    existing_requests = await execute_with_retry_async(
        db.table("document_requests")
        .select("*")
        .eq("admission_id", request.admission_id)
        .eq("status", "PENDING")
    )
    
    if existing_requests.data:
        for existing in existing_requests.data:
            if sorted(existing.get("request_items", [])) == request_items_sorted:
                logger.info(f"Duplicate document request detected for admission {request.admission_id}. Skipping insertion.")
                return existing # Return existing one instead of creating duplicate

    data = request.dict()
    response = await execute_with_retry_async(db.table("document_requests").insert(data))
    new_request = response.data[0]
    
    # Broadcast to station and the specific admission (for real-time update in sub-modal/guardian)
    room = adm_res.data['room_number']
    message = {
        "type": "NEW_DOC_REQUEST",
        "data": {
            "id": new_request['id'],
            "room": room,
            "admission_id": request.admission_id, # Added for context
            "request_items": request.request_items,
            "created_at": datetime.now().isoformat(),
            "content": f"서류 신청 ({', '.join(request.request_items)})"
        }
    }
    await manager.broadcast(json.dumps(message), "STATION")
    await manager.broadcast(json.dumps(message), token)
    return new_request

@router.patch("/documents/requests/{request_id}", response_model=DocumentRequest)
async def update_document_request_status(
    request_id: int,
    status: str,
    db: AsyncClient = Depends(get_supabase)
):
    """Update document request status (e.g., PENDING -> COMPLETED)"""
    # 1. 상태 업데이트 수행
    await execute_with_retry_async(
        db.table("document_requests")
        .update({"status": status})
        .eq("id", request_id)
    )
    
    # 2. 브로드캐스트 데이터 조회 (join 포함)
    response = await execute_with_retry_async(
        db.table("document_requests")
        .select("*, admissions(room_number, access_token)")
        .eq("id", request_id)
    )
    
    if not response.data:
        raise HTTPException(status_code=404, detail="Request not found")
    
    updated_request = response.data[0]
    
    # 3. STATION 및 해당 환자 채널 브로드캐스트
    admission_data = updated_request.get('admissions') or {}
    room_number = admission_data.get('room_number')
    admission_token = admission_data.get('access_token')

    message = {
        "type": "DOC_REQUEST_UPDATED",
        "data": {
            "id": updated_request['id'],
            "status": status,
            "room": room_number
        }
    }
    await manager.broadcast(json.dumps(message), "STATION")
    if admission_token:
        await manager.broadcast(json.dumps(message), admission_token)
    
    return updated_request

@router.patch("/meals/requests/{request_id}", response_model=MealRequest)
async def update_meal_request_status(
    request_id: int,
    status: str,
    db: AsyncClient = Depends(get_supabase)
):
    """Update meal request status and finalize types if COMPLETED"""
    # 1. 기존 요청 데이터 가져오기 (이후 가공 필요)
    req_res = await execute_with_retry_async(
        db.table("meal_requests").select("*").eq("id", request_id).single()
    )
    if not req_res.data:
        raise HTTPException(status_code=404, detail="Request not found")
    
    req_data = req_res.data
    update_payload = {"status": status}

    # 2. 상태가 COMPLETED라면 요청된 값을 실제 식단으로 확정
    if status == 'COMPLETED':
        if req_data.get('requested_pediatric_meal_type'):
            update_payload['pediatric_meal_type'] = req_data['requested_pediatric_meal_type']
            update_payload['requested_pediatric_meal_type'] = None
        
        if req_data.get('requested_guardian_meal_type'):
            update_payload['guardian_meal_type'] = req_data['requested_guardian_meal_type']
            update_payload['requested_guardian_meal_type'] = None

    # 3. DB 업데이트 수행
    response = await execute_with_retry_async(
        db.table("meal_requests")
        .update(update_payload)
        .eq("id", request_id)
    )
    
    if not response.data:
         raise HTTPException(status_code=404, detail="Update failed")

    # 브로드캐스트를 위해 전체 데이터 패치 (admissions 정보 포함)
    full_resp = await execute_with_retry_async(
        db.table("meal_requests")
        .select("*, admissions(room_number, access_token)")
        .eq("id", request_id)
        .single()
    )
    
    if full_resp.data:
        updated_data = full_resp.data
        admission_data = updated_data.get('admissions') or {}
        
        msg = {
            "type": "MEAL_UPDATED",
            "data": {
                "id": updated_data['id'],
                "admission_id": updated_data['admission_id'],
                "status": status,
                "room": admission_data.get('room_number'),
                "pediatric_meal_type": updated_data.get('pediatric_meal_type'),
                "guardian_meal_type": updated_data.get('guardian_meal_type'),
                "requested_pediatric_meal_type": updated_data.get('requested_pediatric_meal_type'),
                "requested_guardian_meal_type": updated_data.get('requested_guardian_meal_type'),
                "meal_date": updated_data.get('meal_date'),
                "meal_time": updated_data.get('meal_time')
            }
        }
        await manager.broadcast(json.dumps(msg), "STATION")
        if admission_data.get('access_token'):
            await manager.broadcast(json.dumps(msg), admission_data['access_token'])

    return response.data[0]

```

#### `backend\routers\admissions.py`
```python
from fastapi import APIRouter, Depends, HTTPException, Request
from supabase._async.client import AsyncClient
from typing import List

from dependencies import get_supabase
from services import admission_service
from services.dashboard import fetch_dashboard_data
from models import Admission, AdmissionCreate, TransferRequest
from schemas import DashboardResponse

router = APIRouter()

@router.post("/{admission_id}/transfer")
async def transfer_patient(admission_id: str, req: TransferRequest, request: Request, db: AsyncClient = Depends(get_supabase)):
    ip_address = request.client.host if request.client else "127.0.0.1"
    return await admission_service.transfer_patient(db, admission_id, req, ip_address)

@router.post("/{admission_id}/discharge")
async def discharge_patient(admission_id: str, request: Request, db: AsyncClient = Depends(get_supabase)):
    ip_address = request.client.host if request.client else "127.0.0.1"
    return await admission_service.discharge_patient(db, admission_id, ip_address)

@router.post("", response_model=Admission)
async def create_admission(admission: AdmissionCreate, request: Request, db: AsyncClient = Depends(get_supabase)):
    ip_address = request.client.host if request.client else "127.0.0.1"
    return await admission_service.create_admission(db, admission, ip_address)

@router.get("", response_model=List[dict])
async def list_admissions(db: AsyncClient = Depends(get_supabase)):
    return await admission_service.list_active_admissions_enriched(db)

@router.get("/{admission_id}/dashboard", response_model=DashboardResponse)
async def get_dashboard_data_by_id(admission_id: str, db: AsyncClient = Depends(get_supabase)):
    return await fetch_dashboard_data(db, admission_id)

```

#### `backend\routers\exams.py`
```python
from fastapi import APIRouter, Depends, HTTPException
from fastapi.encoders import jsonable_encoder
from supabase._async.client import AsyncClient
from typing import List
import json

from dependencies import get_supabase
from utils import execute_with_retry_async, create_audit_log, broadcast_to_station_and_patient
from models import ExamSchedule, ExamScheduleCreate
from websocket_manager import manager

router = APIRouter()

@router.get("/admissions/{admission_id}/exam-schedules", response_model=List[ExamSchedule])
async def list_exam_schedules(admission_id: str, db: AsyncClient = Depends(get_supabase)):
    response = await execute_with_retry_async(db.table("exam_schedules").select("*").eq("admission_id", admission_id).order("scheduled_at"))
    return response.data or []

@router.post("/exam-schedules", response_model=ExamSchedule)
async def create_exam_schedule(schedule: ExamScheduleCreate, db: AsyncClient = Depends(get_supabase)):
    data = jsonable_encoder(schedule)
    response = await execute_with_retry_async(db.table("exam_schedules").insert(data))
    new_schedule = response.data[0]

    # Broadcast to guardian dashboard & station
    # 100% Real-time sync: Broadcast to token (guardian) and STATION (nurse)
    adm_response = await execute_with_retry_async(
        db.table("admissions")
        .select("access_token, room_number")
        .eq("id", schedule.admission_id)
        .single()
    )
    if adm_response.data:
        token = adm_response.data['access_token']
        room = adm_response.data['room_number']
        
        message = {
            "type": "NEW_EXAM_SCHEDULE",
            "data": {
                **new_schedule,
                "room": room
            }
        }
        await broadcast_to_station_and_patient(manager, message, token)

    return new_schedule

@router.delete("/exam-schedules/{schedule_id}")
async def delete_exam_schedule(schedule_id: int, db: AsyncClient = Depends(get_supabase)):
    # 1. Get schedule info before deleting (to find admission_id for broadcast)
    res = await execute_with_retry_async(db.table("exam_schedules").select("*").eq("id", schedule_id))
    
    if not res.data:
        raise HTTPException(status_code=404, detail="Schedule not found")
    
    target = res.data[0]
    admission_id = target['admission_id']
    
    # 2. Delete
    await execute_with_retry_async(db.table("exam_schedules").delete().eq("id", schedule_id))
    
    # 3. Log
    await create_audit_log(db, "NURSE", "DELETE_EXAM", str(schedule_id))

    # 4. Broadcast removal to guardian dashboard & station
    adm_res = await execute_with_retry_async(
        db.table("admissions")
        .select("access_token, room_number")
        .eq("id", admission_id)
        .single()
    )
    if adm_res.data:
        token = adm_res.data['access_token']
        room = adm_res.data['room_number']
        message = {
            "type": "DELETE_EXAM_SCHEDULE",
            "data": {
                "id": schedule_id,
                "admission_id": admission_id,
                "room": room
            }
        }
        await broadcast_to_station_and_patient(manager, message, token)
    
    return {"message": "Deleted successfully"}

```

#### `backend\websocket_manager.py`
```python
from fastapi import WebSocket
from typing import Set, Dict
import asyncio
from loguru import logger

class ConnectionManager:
    def __init__(self):
        # Maps token -> Set of WebSockets for faster lookup/discard
        self.active_connections: Dict[str, Set[WebSocket]] = {}

    async def connect(self, websocket: WebSocket, token: str):
        await websocket.accept()
        if token not in self.active_connections:
            self.active_connections[token] = set()
        self.active_connections[token].add(websocket)
        logger.info(f"Connected: {token} (Total: {len(self.active_connections[token])})")

    def disconnect(self, websocket: WebSocket, token: str):
        if token in self.active_connections:
            self.active_connections[token].discard(websocket)
            if not self.active_connections[token]:
                del self.active_connections[token]
        logger.info(f"Disconnected: {token}")

    async def broadcast(self, message: str, token: str):
        if token not in self.active_connections:
            return

        # Snapshot to avoid "Set changed size during iteration"
        live_sockets = list(self.active_connections[token])
        dead_sockets = []

        async def send_safe(ws: WebSocket):
            try:
                await asyncio.wait_for(ws.send_text(message), timeout=1.5)
            except Exception:
                dead_sockets.append(ws)

        if live_sockets:
            await asyncio.gather(*(send_safe(ws) for ws in live_sockets))

        # Atomic cleanup after gather
        if dead_sockets and token in self.active_connections:
            for ws in dead_sockets:
                self.active_connections[token].discard(ws)
            if not self.active_connections[token]:
                del self.active_connections[token]

    async def broadcast_all(self, message: str):
        # Snapshot tokens to avoid mutation issues
        tokens = list(self.active_connections.keys())
        await asyncio.gather(*(self.broadcast(message, t) for t in tokens))

manager = ConnectionManager()

```

#### `backend\utils.py`
```python
from supabase._async.client import AsyncClient
import asyncio
import json
import random
from postgrest.exceptions import APIError
from httpx import HTTPStatusError
from logger import logger

def mask_name(name: str) -> str:
    if len(name) <= 1:
        return name
    return name[0] + "*" + name[2:] if len(name) > 2 else name[0] + "*"

def normalize_rpc_result(res):
    """
    Standardizes Supabase RPC results.
    Returns the first item if the result is a non-empty list,
    returns the data as is if it's already a dict or None.
    Useful for ensuring SSOT consistency across different Supabase environments.
    """
    if not res or not res.data:
        return None
    data = res.data
    return data[0] if isinstance(data, list) and len(data) > 0 else data

async def create_audit_log(db: AsyncClient, actor_type: str, action: str, target_id: str, ip_address: str = "0.0.0.0"):
    if db:
        try:
            await db.rpc("log_audit_activity", {
                "p_actor_type": actor_type,
                "p_action": action,
                "p_target_id": target_id,
                "p_ip_address": ip_address
            }).execute()
        except Exception as e:
            logger.warning(f"Audit log failed: {str(e)}")
            pass # Audit logs should not crash the main flow

async def execute_with_retry_async(query_builder):
    """
    Executes a Supabase (Postgrest) async query with a standardized retry policy.

    Retry Policy:
    - Max Retries: 3
    - Retryable Errors:
        - 5xx Server Errors (HTTP and APIError codes)
        - 429 Too Many Requests
    - Fail-fast Errors:
        - 4xx Client Errors (except 429)
    - Backoff: Exponential with jitter (base 0.5s, cap 3s)
    """
    max_retries = 3
    
    for attempt in range(max_retries):
        try:
            res = await query_builder.execute()
            # method 속성 참조 시 AttributeError 발생 가능하므로 안전하게 제거하거나 getattr 사용
            return res
        except Exception as e:
            # Categorize the error
            is_retryable = False
            error_status = None

            if isinstance(e, APIError):
                try:
                    error_status = int(e.code)
                except (ValueError, TypeError):
                    # For non-numeric codes, only retry if it looks like a server/network error
                    if any(term in str(e).lower() for term in ["network", "timeout", "connection"]):
                        is_retryable = True
            
            elif isinstance(e, HTTPStatusError):
                error_status = e.response.status_code

            # Apply Policy: 429 and 5xx are retryable
            if error_status:
                if (500 <= error_status < 600) or (error_status == 429):
                    is_retryable = True
                elif 400 <= error_status < 500:
                    # Fail-fast on 4xx (Auth, Not Found, etc.)
                    logger.error(f"DB Client Error (Non-retryable {error_status}): {str(e)}")
                    raise e

            # Final check and backoff
            if attempt == max_retries - 1 or not is_retryable:
                if not is_retryable:
                    logger.error(f"DB Error (Fail-fast): {str(e)}")
                else:
                    logger.critical(f"DB failed after {max_retries} attempts: {str(e)}")
                raise e

            # Exponential backoff with small jitter
            wait_time = min(3.0, (0.5 * (2 ** attempt)) + (random.uniform(0, 0.1)))
            logger.warning(f"DB retryable error ({error_status if error_status else 'Network'}). Attempt {attempt+1} failed. Retrying in {wait_time:.1f}s...")
            await asyncio.sleep(wait_time)

async def broadcast_to_station_and_patient(manager, message_dict: dict, token: str = None):
    """
    Helper to broadcast a message to both the STATION and a specific patient token.
    Ensures consistent string casting for tokens and JSON serialization.
    """
    try:
        msg_str = json.dumps(message_dict)
        # Parallel: Broadcast to STATION and Patient
        tasks = [manager.broadcast(msg_str, "STATION")]
        if token:
            tasks.append(manager.broadcast(msg_str, str(token)))
        
        await asyncio.gather(*tasks)
    except Exception as e:
        logger.error(f"Broadcast helper failed: {e}")

def is_pgrst204_error(e: Exception) -> bool:
    """
    Checks if the exception is a Postgrest PGRST204 error (missing column or schema cache issue).
    Useful for handling environments with stale schema caches.
    """
    if isinstance(e, APIError):
        # Check both the code and the message for robustness
        if (hasattr(e, 'code') and e.code == 'PGRST204') or "schema cache" in str(e).lower():
            return True
    return False

```

#### `backend\models.py`
```python
from pydantic import BaseModel, field_validator
from typing import Optional
from datetime import datetime, date, timedelta

from enum import Enum

class Status(str, Enum):
    IN_PROGRESS = "IN_PROGRESS"
    OBSERVATION = "OBSERVATION"
    DISCHARGED = "DISCHARGED"

class GenderEnum(str, Enum):
    M = "M"
    F = "F"

class MealTime(str, Enum):
    BREAKFAST = 'BREAKFAST'
    LUNCH = 'LUNCH'
    DINNER = 'DINNER'

# DB Models
class Admission(BaseModel):

    id: Optional[str] = None
    patient_name_masked: str
    room_number: str
    status: Status = Status.IN_PROGRESS
    discharged_at: Optional[datetime] = None
    access_token: Optional[str] = None # Added for QR generation
    dob: Optional[date] = None
    gender: Optional[GenderEnum] = None
    check_in_at: Optional[datetime] = None

class VitalSign(BaseModel):
    id: Optional[int] = None
    admission_id: str
    temperature: float
    has_medication: bool = False
    medication_type: Optional[str] = None # 'A' or 'I'
    recorded_at: Optional[datetime] = None

class IVRecord(BaseModel):
    id: Optional[int] = None
    admission_id: str
    photo_url: Optional[str] = None
    infusion_rate: Optional[int] = None
    created_at: Optional[datetime] = None

class MealRequest(BaseModel):
    id: Optional[int] = None
    admission_id: str
    request_type: str
    pediatric_meal_type: Optional[str] = None
    guardian_meal_type: Optional[str] = None
    requested_pediatric_meal_type: Optional[str] = None
    requested_guardian_meal_type: Optional[str] = None
    room_note: Optional[str] = None
    meal_date: Optional[date] = None
    meal_time: Optional[str] = None
    status: str = "PENDING"
    created_at: Optional[datetime] = None

# DTOs
class AdmissionCreate(BaseModel):
    patient_name: str  # Raw name, will be masked in logic
    room_number: str
    dob: Optional[date] = None
    gender: Optional[GenderEnum] = None
    check_in_at: Optional[datetime] = None

    @field_validator('dob')
    @classmethod
    def validate_dob(cls, v: Optional[date]) -> Optional[date]:
        if v and v > date.today():
             raise ValueError('생년월일은 미래 날짜일 수 없습니다.')
        return v

    @field_validator('check_in_at')
    @classmethod
    def validate_check_in(cls, v: Optional[datetime]) -> Optional[datetime]:
        if v:
            # Allow up to 1 hour in the future to account for clock skew
            now = datetime.now(v.tzinfo) if v.tzinfo else datetime.now()
            if v > now + timedelta(hours=1):
                 raise ValueError('입원 일시는 미래 시점일 수 없습니다.')
        return v

class VitalSignCreate(BaseModel):
    admission_id: str
    temperature: float
    has_medication: bool = False
    medication_type: Optional[str] = None

class IVRecordCreate(BaseModel):
    admission_id: str
    photo_url: Optional[str] = None
    infusion_rate: int  # cc/hr

class MealRequestCreate(BaseModel):
    admission_id: str
    request_type: str = "STATION_UPDATE"
    pediatric_meal_type: Optional[str] = None
    guardian_meal_type: Optional[str] = None
    room_note: Optional[str] = None
    meal_date: date
    meal_time: MealTime

class DocumentRequest(BaseModel):
    id: Optional[int] = None
    admission_id: str
    request_items: list[str] # RECEIPT, DETAIL, CERT, DIAGNOSIS
    status: str = "PENDING"
    created_at: Optional[datetime] = None

class DocumentRequestCreate(BaseModel):
    admission_id: str
    request_items: list[str]

class ExamSchedule(BaseModel):
    id: Optional[int] = None
    admission_id: str
    scheduled_at: datetime
    name: str
    note: Optional[str] = ""

class ExamScheduleCreate(BaseModel):
    admission_id: str
    scheduled_at: datetime
    name: str
    note: Optional[str] = ""

class TransferRequest(BaseModel):
    target_room: str

```

#### `backend\schemas.py`
```python
from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime, date
from uuid import UUID
from enum import Enum
from models import VitalSign, IVRecord, MealRequest, ExamSchedule, DocumentRequest, GenderEnum

class MealTime(str, Enum):
    BREAKFAST = "BREAKFAST"
    LUNCH = "LUNCH"
    DINNER = "DINNER"
    SNACK = "SNACK"

class MealStatus(str, Enum):
    NORMAL = "NORMAL"
    SOFT = "SOFT"
    FASTING = "FASTING"
    ALLERGY = "ALLERGY"

class CommonMealPlan(BaseModel):
    date: date
    breakfast: Optional[str] = None
    lunch: Optional[str] = None
    dinner: Optional[str] = None
    snack: Optional[str] = None

class PatientMealOverride(BaseModel):
    id: UUID
    admission_id: UUID
    date: date
    meal_time: MealTime
    status: MealStatus
    memo: Optional[str] = None

class PatientMealOverrideCreate(BaseModel):
    admission_id: str
    date: date
    meal_time: MealTime
    status: MealStatus
    memo: Optional[str] = None

class AdmissionResponse(BaseModel):
    id: str
    patient_name_masked: str
    room_number: str
    discharged_at: Optional[datetime] = None
    access_token: Optional[str] = None
    check_in_at: Optional[datetime] = None
    dob: Optional[date] = None
    gender: Optional[GenderEnum] = None

class DashboardResponse(BaseModel):
    admission: AdmissionResponse
    vitals: List[VitalSign]
    iv_records: List[IVRecord]
    meals: List[MealRequest]
    exam_schedules: List[ExamSchedule]
    document_requests: List[DocumentRequest]

```

#### `backend\constants\mappings.py`
```python
# Global Mappings for eco_pediatrics

# 식사 신청 타입 매핑
MEAL_MAP = {
    'GENERAL': '일반식',
    'SOFT': '죽',
    'NPO': '금식'
}

# 서류 신청 아이템 매핑
DOC_MAP = {
    'RECEIPT': '영수증',
    'DETAIL': '세부내역서',
    'CERT': '진단서',
    'DIAGNOSIS': '소견서',
    'INITIAL': '기록지'
}

```

#### `frontend\src\lib\api.ts`
```typescript
/// <reference path="../types/tauri-plugins.d.ts" />
// Export constant for use elsewhere if needed, but prefer using api instance
export const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

// Detect Tauri environment (Tauri v2 compatible)
const isTauri = typeof window !== 'undefined' &&
    ((window as any).__TAURI_INTERNALS__ || (window as any).__TAURI__);

// Caching Tauri functions to avoid redundant dynamic imports
let cachedTauriFetch: any = null;
let cachedTauriLog: any = null;

// 중복 요청 방지를 위한 단순 캐시 (100ms 내 동일 URL 무시)
const pendingRequests = new Map<string, number>();

const getTauriFetch = async () => {
    if (!isTauri) return window.fetch;
    if (cachedTauriFetch) return cachedTauriFetch;

    try {
        const { fetch } = await import('@tauri-apps/plugin-http');
        cachedTauriFetch = fetch;
        return fetch;
    } catch (e) {
        console.error('Failed to load Tauri fetch:', e);
        return window.fetch;
    }
};

const tauriLog = async (level: 'info' | 'warn' | 'error' | 'debug', message: string) => {
    if (!isTauri) return;

    try {
        if (!cachedTauriLog) {
            const { info, warn, error, debug } = await import('@tauri-apps/plugin-log');
            cachedTauriLog = { info, warn, error, debug };
        }
        // WebView2 상태 확인 및 가드: 윈도우가 닫히는 중이면 실행 중단
        if (typeof window === 'undefined' || !(window as any).__TAURI_INTERNALS__) return;
        cachedTauriLog[level](`[Frontend] ${message}`);
    } catch (e) {
        /* 0x8007139F 방지를 위해 에러 캡슐화 */
    }
};

class ApiClient {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async request<T>(endpoint: string, options?: RequestInit, retryCount = 0): Promise<T> {
        const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

        // 중복 요청 디바운싱 (특히 GET 요청에 대해)
        const requestKey = `${options?.method || 'GET'}:${url}`;
        const now = Date.now();
        if ((options?.method || 'GET') === 'GET' && pendingRequests.has(requestKey)) {
            if (now - (pendingRequests.get(requestKey) || 0) < 100) {
                // 100ms 이내 중복 요청은 무시하고 이전 성공 데이터가 있다면 좋겠지만, 
                // 없으면 빈 객체 반환 (에러 유발 방지)
                return {} as T;
            }
        }
        pendingRequests.set(requestKey, now);

        // Use Tauri Native Fetch if available (Bypasses CORS/CSP)
        const fetchFn = await getTauriFetch();
        const fetchType = fetchFn === window.fetch ? 'Browser Fetch' : 'Tauri Native Fetch';

        if (retryCount === 0) {
            await tauriLog('info', `Requesting [${fetchType}]: ${options?.method || 'GET'} ${url}`);
        }

        try {
            const res = await fetchFn(url, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    ...options?.headers,
                },
            });

            if (!res.ok) {
                const errorText = await res.text().catch(() => 'Unknown error');
                const errorMsg = `API Error ${res.status}: ${errorText}`;

                // 404, 403 등 명확한 에러는 재시도하지 않음
                console.error(errorMsg);
                await tauriLog('error', `API Failure: ${options?.method || 'GET'} ${url} -> ${errorMsg}`);
                throw new Error(errorMsg);
            }

            // Return empty object for 204 No Content, otherwise JSON
            if (res.status === 204) return {} as T;

            const text = await res.text();
            return text ? JSON.parse(text) : ({} as T);
        } catch (err: any) {
            const detail = err instanceof Error ? err.message : JSON.stringify(err);
            const isConnectionError = /sending request|ECONNREFUSED|Failed to fetch|NetworkError|fetch/i.test(detail);

            // 연결 에러이고 재시도 횟수가 남았다면 (최대 2회)
            if (isConnectionError && retryCount < 2) {
                const delay = (retryCount + 1) * 300; // 300ms, 600ms
                await tauriLog('warn', `Fetch Retrying (${retryCount + 1}/2) in ${delay}ms: ${url}`);
                await new Promise(resolve => setTimeout(resolve, delay));
                return this.request<T>(endpoint, options, retryCount + 1);
            }

            await tauriLog('error', `Fetch Fatal: ${options?.method || 'GET'} ${url} -> ${detail}`);

            if (isConnectionError) {
                const guides = [
                    '1. 백엔드 서버(uvicorn)가 실행 중인지 확인하세요.',
                    `2. URL 접근성 확인: ${url}`,
                    '3. 네트워크 연결 및 방화벽 설정을 확인하세요.',
                    '4. Windows Terminal에서 BE 패널의 로그에 에러가 없는지 확인하세요.'
                ].join('\n');

                console.error(
                    `[연결 실패] 백엔드에 접속할 수 없습니다. (시도: ${retryCount + 1}회)\n${guides}`,
                    err
                );
            } else {
                console.error('Fetch Fatal Detail:', err);
            }
            throw err;
        }
    }

    get<T>(endpoint: string, options?: RequestInit): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'GET' });
    }

    post<T>(endpoint: string, body: any, options?: RequestInit): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    put<T>(endpoint: string, body: any, options?: RequestInit): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }

    patch<T>(endpoint: string, body: any, options?: RequestInit): Promise<T> {
        return this.request<T>(endpoint, {
            ...options,
            method: 'PATCH',
            body: JSON.stringify(body),
        });
    }

    delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
        return this.request<T>(endpoint, { ...options, method: 'DELETE' });
    }

    getBaseUrl(): string {
        return this.baseUrl;
    }
}

export const api = new ApiClient(API_BASE);

```

#### `frontend\src\hooks\useStation.ts`
```typescript
import { useState, useEffect, useCallback, useRef } from 'react';
import { useWebSocket } from './useWebSocket';
import { api } from '@/lib/api';
import { Bed, Notification, LastUploadedIv, AdmissionSummary, WsMessage, MealRequest } from '@/types/domain';
import { ROOM_NUMBERS, MEAL_MAP, DOC_MAP } from '@/constants/mappings';

interface UseStationReturn {
    beds: Bed[];
    setBeds: React.Dispatch<React.SetStateAction<Bed[]>>;
    notifications: Notification[];
    setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
    lastUploadedIv: LastUploadedIv | null;
    lastUpdated: number;
    isConnected: boolean;
    removeNotification: (id: string, type?: string, admissionId?: string) => void;
    fetchAdmissions: () => void;
}

export function useStation(): UseStationReturn {
    const [beds, setBeds] = useState<Bed[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [lastUploadedIv, setLastUploadedIv] = useState<LastUploadedIv | null>(null);
    const [lastUpdated, setLastUpdated] = useState<number>(Date.now());

    // [Optimization] Prevent double-fetch on mount (useEffect + WS onOpen)
    const lastFetchRef = useRef<number>(0);

    const fetchPendingRequests = useCallback(async () => {
        try {
            const pending = await api.get<Notification[]>('/api/v1/station/pending-requests');
            if (Array.isArray(pending)) {
                setNotifications(pending.map(n => ({
                    ...n,
                    time: new Date(n.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                })));
            }
        } catch (e) {
            console.error('Failed to fetch pending requests', e);
        }
    }, []);

    const fetchAdmissions = useCallback(() => {
        const now = Date.now();
        // Throttle: If fetched less than 500ms ago, skip. 
        // This handles the race between useEffect and WS onOpen.
        if (now - lastFetchRef.current < 500) return;
        lastFetchRef.current = now;

        api.get<AdmissionSummary[]>('/api/v1/admissions')
            .then(admissions => {
                if (!Array.isArray(admissions)) return;

                // Reconstruct state from scratch to prevent ghost data
                const newBeds = ROOM_NUMBERS.map((room, i) => {
                    const adm = admissions.find((a) => String(a.room_number).trim() === String(room).trim());
                    if (adm) {
                        return {
                            id: adm.id,
                            room: room,
                            name: adm.display_name,
                            token: adm.access_token,
                            drops: adm.latest_iv ? adm.latest_iv.infusion_rate : null,
                            temp: adm.latest_temp ?? null,
                            had_fever_in_6h: adm.had_fever_in_6h,
                            status: ((adm.latest_temp != null && adm.latest_temp >= 38.0) || adm.had_fever_in_6h) ? 'fever' : 'normal',
                            latest_meal: adm.latest_meal ?? undefined,
                            last_vital_at: adm.last_vital_at ?? undefined,
                            dob: adm.dob,
                            gender: adm.gender
                        } as Bed;
                    }
                    // Empty Slot
                    return {
                        id: '',
                        room: room,
                        name: `환자${i + 1}`,
                        temp: null,
                        drops: null,
                        status: 'normal' as const,
                        token: ''
                    } as Bed;
                });

                setBeds(newBeds);
            })
            .catch(console.error);
    }, []);

    // Initial Load
    useEffect(() => {
        // 1. Initialize empty beds
        setBeds(ROOM_NUMBERS.map((room, i) => ({
            id: '',
            room: room,
            name: `환자${i + 1}`,
            temp: null,
            drops: null,
            status: 'normal' as const,
            token: ''
        })));

        fetchAdmissions();
        fetchPendingRequests();
    }, [fetchAdmissions, fetchPendingRequests]);

    // WebSocket Implementation using shared hook
    const handleMessage = useCallback((event: MessageEvent) => {
        try {
            const message = JSON.parse(event.data) as WsMessage;
            const id = Math.random().toString(36).substr(2, 9);

            switch (message.type) {
                case 'NEW_MEAL_REQUEST':
                    if (message.data.request_type === 'STATION_UPDATE') break;

                    // 1. Update Notification
                    const requestedPediatric = message.data.pediatric_meal_type;
                    const requestedGuardian = message.data.guardian_meal_type;

                    let mealTypeDesc = "";
                    if (requestedPediatric) {
                        mealTypeDesc = requestedPediatric;
                    }
                    if (requestedGuardian && requestedGuardian !== '선택 안함') {
                        mealTypeDesc += (mealTypeDesc ? " / " : "") + requestedGuardian;
                    }
                    if (!mealTypeDesc) {
                        mealTypeDesc = (MEAL_MAP[message.data.request_type] || message.data.request_type);
                    }

                    const mealDateRaw = message.data.meal_date; // '2026-02-19'
                    const mealTimeRaw = message.data.meal_time; // 'BREAKFAST'
                    const mealTimeMap: Record<string, string> = { BREAKFAST: '아침', LUNCH: '점심', DINNER: '저녁' };
                    const timeLabel = mealTimeMap[mealTimeRaw] || mealTimeRaw;

                    let dateLabel = '';
                    if (mealDateRaw) {
                        // [SSOT Fix] Parse string directly to avoid timezone shifts (e.g. 2026-02-20 -> 02/20)
                        const parts = mealDateRaw.split('-');
                        if (parts.length === 3) {
                            dateLabel = `${parts[1]}/${parts[2]}`;
                        } else {
                            dateLabel = mealDateRaw;
                        }
                    }

                    const newMealId = `meal_${message.data.id}`;
                    const newMealNotification = {
                        id: newMealId,
                        room: message.data.room,
                        time: '방금',
                        content: message.data.content || `[${dateLabel} ${timeLabel}] 식단 신청 (${mealTypeDesc})`,
                        type: 'meal',
                        admissionId: message.data.admission_id
                    };

                    setNotifications(prev => {
                        const exists = prev.some(n => n.id === newMealId);
                        if (exists) {
                            return prev.map(n => n.id === newMealId ? newMealNotification : n);
                        }
                        return [newMealNotification as any, ...prev];
                    });

                    // 2. Patch Bed State (Immediate UI Update)
                    setBeds(prev => prev.map(bed => {
                        if (String(bed.room) === String(message.data.room)) {
                            return {
                                ...bed,
                                latest_meal: {
                                    id: message.data.id,
                                    admission_id: message.data.admission_id,
                                    request_type: message.data.request_type,
                                    // Preserve current values to avoid premature UI change
                                    pediatric_meal_type: bed.latest_meal?.pediatric_meal_type,
                                    guardian_meal_type: bed.latest_meal?.guardian_meal_type,
                                    // Store requested values
                                    requested_pediatric_meal_type: message.data.requested_pediatric_meal_type || message.data.pediatric_meal_type,
                                    requested_guardian_meal_type: message.data.requested_guardian_meal_type || message.data.guardian_meal_type,
                                    status: 'PENDING',
                                    created_at: new Date().toISOString(),
                                    meal_date: message.data.meal_date,
                                    meal_time: message.data.meal_time
                                } as MealRequest
                            };
                        }
                        return bed;
                    }));
                    break;

                case 'NEW_DOC_REQUEST':
                    const items = message.data.request_items.map(it => DOC_MAP[it] || it);
                    const newDocId = `doc_${message.data.id}`;
                    const newDocNotification = {
                        id: newDocId,
                        room: message.data.room,
                        time: '방금',
                        content: message.data.content || `서류 신청 (${items.join(', ')})`,
                        type: 'doc',
                        admissionId: message.data.admission_id
                    };

                    setNotifications(prev => {
                        const exists = prev.some(n => n.id === newDocId);
                        if (exists) {
                            return prev.map(n => n.id === newDocId ? newDocNotification : n);
                        }
                        return [newDocNotification as any, ...prev];
                    });
                    break;
                case 'DOC_REQUEST_UPDATED':
                    // Remove notification when a document request is updated (e.g., to COMPLETED) by any station
                    setNotifications(prev => prev.filter(n => n.id !== `doc_${message.data.id}`));
                    break;

                case 'IV_PHOTO_UPLOADED':
                    setLastUploadedIv({
                        admissionId: message.data.admission_id,
                        url: message.data.photo_url
                    });
                    break;

                case 'NEW_IV':
                    const newDrops = message.data.infusion_rate;
                    const room = message.data.room;
                    setBeds(prev => prev.map(bed => {
                        if (String(bed.room) === String(room)) {
                            return { ...bed, drops: newDrops };
                        }
                        return bed;
                    }));
                    break;

                case 'NEW_VITAL':
                    const v = message.data;
                    setBeds(prev => prev.map(bed => {
                        // Match by admission_id if available, otherwise fallback to room if provided (though NEW_VITAL might not always have room)
                        // Ideally match by admission_id.
                        // However, beds state has admission_id as 'id'.
                        if (bed.id === v.admission_id) {
                            const isFever = v.temperature >= 38.0;
                            return {
                                ...bed,
                                temp: v.temperature,
                                last_vital_at: v.recorded_at,
                                had_fever_in_6h: bed.had_fever_in_6h || isFever, // Keep true if already true, or set true if new fever
                                status: (isFever || bed.had_fever_in_6h) ? 'fever' : 'normal'
                            };
                        }
                        return bed;
                    }));
                    break;

                case 'NEW_EXAM_SCHEDULE':
                case 'DELETE_EXAM_SCHEDULE':
                    // Handled by setLastUpdated -> Modal refresh
                    break;
                case 'ADMISSION_TRANSFERRED':
                case 'ADMISSION_DISCHARGED':
                    // Re-fetch entire bed list to reflect room changes or discharge
                    fetchAdmissions();
                    break;
                case 'REFRESH_DASHBOARD':
                    fetchAdmissions();
                    break;
            }
        } catch (e) {
            console.error('WS Parse Error', e);
        }
    }, [setBeds, setNotifications, setLastUpdated, setLastUploadedIv, fetchAdmissions]);

    const wsToken = process.env.NEXT_PUBLIC_STATION_WS_TOKEN || 'STATION';

    const { isConnected } = useWebSocket({
        url: `${api.getBaseUrl().replace(/^http/, 'ws')}/ws/${wsToken}`,
        enabled: true,
        onOpen: () => {
            fetchAdmissions();
            fetchPendingRequests();
        }, // Resync on connect/reconnect
        onMessage: handleMessage
    });

    const removeNotification = useCallback(async (id: string, type?: string, admissionId?: string) => {
        setNotifications(prev => prev.filter(n => n.id !== id));

        // id 접두사에서 type과 rawId 추출 (예: 'meal_34' → type='meal', rawId='34')
        const match = id.match(/^(meal|doc)_(\d+)$/);
        if (admissionId && match) {
            try {
                const [, parsedType, rawId] = match;
                const endpoint = (type || parsedType) === 'doc' ? 'documents' : 'meals';
                await api.patch(`/api/v1/${endpoint}/requests/${rawId}?status=COMPLETED`, {});
            } catch (e) {
                console.error('Status Update Failed', e);
            }
        }
    }, []);

    return {
        beds,
        setBeds,
        notifications,
        setNotifications,
        lastUploadedIv,
        lastUpdated,
        isConnected,
        removeNotification,
        fetchAdmissions
    };
}

```

#### `frontend\src\hooks\useWebSocket.ts`
```typescript
import { useRef, useEffect, useCallback, useState } from 'react';

interface UseWebSocketOptions {
    url: string;
    enabled?: boolean;
    onMessage: (event: MessageEvent) => void;
    onOpen?: () => void;
    onClose?: () => void;
}

export function useWebSocket({ url, enabled = true, onMessage, onOpen, onClose }: UseWebSocketOptions) {
    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimeoutRef = useRef<NodeJS.Timeout>();
    const retryDelay = useRef(1000);
    const [isConnected, setIsConnected] = useState(false);

    // Stable refs: 콜백 참조가 변경되어도 WS 재연결이 발생하지 않도록 ref로 감쌈
    const onMessageRef = useRef(onMessage);
    const onOpenRef = useRef(onOpen);
    const onCloseRef = useRef(onClose);

    // 매 렌더마다 최신 콜백으로 ref 업데이트 (WS 재연결 없이)
    useEffect(() => { onMessageRef.current = onMessage; }, [onMessage]);
    useEffect(() => { onOpenRef.current = onOpen; }, [onOpen]);
    useEffect(() => { onCloseRef.current = onClose; }, [onClose]);

    const connect = useCallback(() => {
        if (!enabled || !url) return;

        if (wsRef.current) {
            wsRef.current.close();
        }

        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => {
            console.log(`Connected to WS: ${url}`);
            setIsConnected(true);
            retryDelay.current = 1000;
            onOpenRef.current?.();
        };

        ws.onclose = () => {
            console.log(`Disconnected from WS: ${url}`);
            setIsConnected(false);
            onCloseRef.current?.();

            const delay = retryDelay.current;
            reconnectTimeoutRef.current = setTimeout(() => {
                connect();
            }, delay);
            retryDelay.current = Math.min(delay * 1.5, 30000);
        };

        ws.onmessage = (event) => onMessageRef.current(event);

        // url과 enabled만 의존성으로 설정 → 콜백 변경 시 WS 재연결 방지
    }, [url, enabled]);

    useEffect(() => {
        connect();

        return () => {
            if (wsRef.current) {
                wsRef.current.onclose = null;
                wsRef.current.close();
            }
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
        };
    }, [connect]);

    return { isConnected };
}

```

#### `frontend\src\hooks\useDashboardStats.ts`
```typescript
import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useVitals } from './useVitals';

const STORAGE_KEY = 'dashboardViewMode';
type ViewMode = 'mobile' | 'desktop';

const MEAL_LABEL_MAP: Record<string, string> = { GENERAL: '일반식', SOFT: '죽', NPO: '금식' };
const DOC_LABEL_MAP: Record<string, string> = {
    RECEIPT: '진료비 계산서(영수증)',
    DETAIL: '진료비 세부내역서',
    CERT: '입퇴원확인서',
    DIAGNOSIS: '진단서',
    INITIAL: '초진기록지'
};

export function useDashboardStats() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const vitalsData = useVitals(token, true, () => {
        alert("퇴원 처리되었거나 유효하지 않은 접근입니다.");
        if (typeof window !== 'undefined') {
            window.close();
            // Fallback for browsers that block window.close()
            setTimeout(() => {
                router.push('/403');
            }, 500);
        }
    });

    const [isMealModalOpen, setIsMealModalOpen] = useState(false);
    const [isDocModalOpen, setIsDocModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState<ViewMode>('mobile');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const v = localStorage.getItem(STORAGE_KEY);
            setViewMode(v === 'desktop' ? 'desktop' : 'mobile');
        }
    }, []);

    const setViewModeAndStore = (mode: ViewMode) => {
        setViewMode(mode);
        try { localStorage.setItem(STORAGE_KEY, mode); } catch (_) { }
    };

    const latestIv = vitalsData.ivRecords.length > 0 ? vitalsData.ivRecords[0] : null;

    const currentMeal = vitalsData.meals.length > 0 ? vitalsData.meals[0] : null;
    const currentMealLabel = currentMeal
        ? (currentMeal.request_type === 'STATION_UPDATE'
            ? (currentMeal.pediatric_meal_type || '일반식')
            : (MEAL_LABEL_MAP[currentMeal.request_type] ?? currentMeal.request_type))
        : null;

    // Aggregated list of all doc items currently in system
    const allDocItems = vitalsData.documentRequests
        .filter(req => req.status !== 'CANCELED')
        .flatMap(req => req.request_items);

    // List of ALL non-canceled requested items to disable them in the modal
    const requestedDocItems = vitalsData.documentRequests
        .filter(req => req.status !== 'CANCELED')
        .flatMap(req => req.request_items);

    // Remove duplicates and map to labels
    const currentDocLabels = Array.from(new Set(allDocItems))
        .map((id: string) => DOC_LABEL_MAP[id] || id);

    return {
        token,
        vitalsData,
        latestIv,
        currentMealLabel,
        currentDocLabels,
        requestedDocItems,
        viewMode,
        modalState: {
            isMealModalOpen,
            isDocModalOpen
        },
        actions: {
            setIsMealModalOpen,
            setIsDocModalOpen,
            setViewModeAndStore,
            refetch: vitalsData.refetchDashboard
        }
    };
}

```

#### `frontend\src\types\domain.ts`
```typescript
export interface OptimisticStatus {
    id?: string | number; // Optional as it might be a temp string or server number
    tempId?: string;
    isOptimistic?: boolean;
    isDeleting?: boolean;
}

export interface Bed {
    id: string;
    room: string;
    name: string;
    temp: number | null;
    drops: number | null;
    status: 'normal' | 'fever';
    token: string;
    latest_temp?: number;
    had_fever_in_6h?: boolean;
    latest_meal?: MealRequest;
    last_vital_at?: string;
    dob?: string;
    gender?: string;
}

export interface Notification {
    id: string;
    room: string;
    time: string;
    content: string;
    type: 'meal' | 'doc' | 'call' | 'emergency';
    admissionId?: string;
}

export interface VitalData extends OptimisticStatus {
    time: string;
    temperature: number;
    has_medication: boolean;
    medication_type?: string;
    recorded_at: string;
}

export interface VitalDataResponse {
    recorded_at: string;
    temperature: number;
    has_medication: boolean;
    medication_type?: string;
}

export interface ExamScheduleItem extends OptimisticStatus {
    id: number;
    admission_id: string;
    scheduled_at: string;
    name: string;
    note?: string;
}

export interface LastUploadedIv {
    admissionId: string;
    url: string;
}

export interface AdmissionSummary {
    id: string;
    display_name: string;
    room_number: string;
    access_token: string;
    latest_iv?: {
        infusion_rate: number;
    };
    latest_temp?: number;
    had_fever_in_6h?: boolean;
    latest_meal?: MealRequest;
    last_vital_at?: string;
    dob?: string;
    gender?: string;
}

export type WsMessageType = 'NEW_MEAL_REQUEST' | 'NEW_DOC_REQUEST' | 'DOC_REQUEST_UPDATED' | 'IV_PHOTO_UPLOADED' | 'NEW_IV' | 'NEW_VITAL' | 'NEW_EXAM_SCHEDULE' | 'DELETE_EXAM_SCHEDULE' | 'ADMISSION_TRANSFERRED' | 'ADMISSION_DISCHARGED' | 'MEAL_UPDATED' | 'REFRESH_DASHBOARD';

export type WsMessage =
    | { type: 'NEW_MEAL_REQUEST'; data: { id: number; room: string; request_type: string; admission_id: string; meal_date: string; meal_time: string; pediatric_meal_type?: string; guardian_meal_type?: string; requested_pediatric_meal_type?: string; requested_guardian_meal_type?: string; content?: string } }
    | { type: 'NEW_DOC_REQUEST'; data: { id: number; admission_id: string; room: string; request_items: string[]; created_at?: string; content?: string } }
    | { type: 'DOC_REQUEST_UPDATED'; data: { id: number; status: string; room?: string } }
    | { type: 'IV_PHOTO_UPLOADED'; data: { admission_id: string; room_number: string; photo_url: string } }
    | { type: 'NEW_IV'; data: { id: number; infusion_rate: number; room: string | null; admission_id: string; photo_url?: string; created_at?: string } }
    | { type: 'NEW_VITAL'; data: { id: number; admission_id: string; temperature: number; has_medication: boolean; medication_type?: string; recorded_at: string; room?: string } }
    | { type: 'NEW_EXAM_SCHEDULE'; data: ExamScheduleItem & { room: string } }
    | { type: 'DELETE_EXAM_SCHEDULE'; data: { id: number; admission_id: string; room: string } }
    | { type: 'ADMISSION_TRANSFERRED'; data: { admission_id: string; old_room: string; new_room: string } }
    | { type: 'ADMISSION_DISCHARGED'; data: { admission_id: string; room: string } }
    | { type: 'MEAL_UPDATED'; data: MealRequest }
    | { type: 'REFRESH_DASHBOARD'; data: { admission_id: string } };

export interface IVRecord {
    id: number;
    admission_id: string;
    photo_url: string;
    infusion_rate: number;
    created_at: string;
}

export interface MealRequest extends OptimisticStatus {
    id?: number;
    admission_id: string;
    request_type: string;
    pediatric_meal_type?: string;
    guardian_meal_type?: string;
    requested_pediatric_meal_type?: string;
    requested_guardian_meal_type?: string;
    room_note?: string;
    meal_date: string;
    meal_time: string;
    status: string;
    created_at?: string;
}

export interface DocumentRequest {
    id: number;
    admission_id: string;
    request_items: string[];
    status: string;
    created_at: string;
}

```

---

## 3. Instruction

위 에러 내역(특히 가장 최근 항목)을 분석하고 **[Antigravity Task]** 프로토콜에 맞춰 수정 계획을 제시해 주세요.
