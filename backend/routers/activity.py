import asyncio
from fastapi import APIRouter, Request
from database import db
from dependencies import get_current_user

router = APIRouter(prefix="/api")


@router.get("/activity")
async def get_activity(request: Request, limit: int = 30):
    await get_current_user(request)
    docs = await db.activity.find({}, {"_id": 0}).sort("timestamp", -1).to_list(limit)
    return docs


@router.get("/tags")
async def list_tags(request: Request):
    await get_current_user(request)
    tags = await db.features.distinct("tags", {"is_deleted": {"$ne": True}})
    return sorted([t for t in tags if t and t.strip()])


@router.get("/stats")
async def get_stats(request: Request):
    await get_current_user(request)
    _live = {"is_deleted": {"$ne": True}}
    total_features, total_contributors, all_tags, recent = await asyncio.gather(
        db.features.count_documents(_live),
        db.users.count_documents({}),
        db.features.distinct("tags", _live),
        db.activity.find({}, {"_id": 0}).sort("timestamp", -1).to_list(5),
    )
    total_tags = len([t for t in all_tags if t and t.strip()])
    return {
        "total_features": total_features,
        "total_contributors": total_contributors,
        "total_tags": total_tags,
        "recent_activity": recent,
    }
