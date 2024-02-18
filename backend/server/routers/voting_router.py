from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from .models import NewVotingModel, VoteModel
from .logic import new_voting, get_all_votings, cast_vote
import logging
import json

router = APIRouter()


@router.post("/voting")
def post_voting(voting: NewVotingModel):
    code, message = new_voting(voting)
    return JSONResponse(status_code=code, content={"message": message})


@router.post("/vote")
def vote(vote: VoteModel):
    code, message = cast_vote(vote)
    return JSONResponse(status_code=code, content={"message": message})


@router.get("/all_votings")
def get_votings():
    code, message, votings = get_all_votings()
    return JSONResponse(status_code=code, content={"message": message, "votings": votings})


