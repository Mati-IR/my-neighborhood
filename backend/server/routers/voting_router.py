from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from .models import NewVotingModel
from .logic import new_voting
import logging
import json

router = APIRouter()


@router.post("/voting")
def post_voting(voting: NewVotingModel):
    code, message = new_voting(voting)
    return JSONResponse(status_code=code, content={"message": message})
