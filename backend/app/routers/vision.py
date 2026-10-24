from fastapi import APIRouter, UploadFile, File, HTTPException
from backend.app.models.vision import VisionAnalysisResult
from backend.app.vision_service import vision_service

router = APIRouter(prefix="/vision", tags=["AI Vision Analysis"])

@router.get("/status")
def get_vision_status():
    """Return whether Gemini AI multimodal service is configured or operating in heuristic fallback mode."""
    is_configured = vision_service.is_api_configured()
    return {
        "gemini_configured": is_configured,
        "mode": "gemini_multimodal" if is_configured else "heuristic_fallback",
        "description": "Multimodal Gemini 2.5 Flash active" if is_configured else "Operating in offline heuristic inspection mode (no Gemini key required for demo)",
        "human_verification_required": True
    }

@router.post("/analyze", response_model=VisionAnalysisResult)
async def analyze_image(file: UploadFile = File(...)):
    """
    Analyze sidewalk / pathway photo for physical accessibility obstacles.
    Returns structured barrier classification, impact assessment, and verification requirement.
    """
    try:
        content = await file.read()
        content_type = file.content_type or "image/jpeg"
        filename = file.filename or "uploaded_image.jpg"

        result = await vision_service.analyze_barrier_image(
            image_bytes=content,
            filename=filename,
            content_type=content_type
        )
        return result
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image inspection failed: {str(e)}")
