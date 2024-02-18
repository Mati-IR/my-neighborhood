from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from .models import NewVotingModel, VoteModel
from .logic import new_voting, get_all_votings, cast_vote, get_voting_statistics
import logging
import json

router = APIRouter()


@router.post("/voting")
def post_voting(voting: NewVotingModel):
    code, message = new_voting(voting)
    return JSONResponse(status_code=code, content={"message": message})


@router.post("/vote")
def vote(new_vote: VoteModel):
    code, message = cast_vote(new_vote)
    return JSONResponse(status_code=code, content={"message": message})


@router.get("/all_votings/{requester_id}")
def get_votings(requester_id: int):
    code, message, votings = get_all_votings(requester_id)
    return JSONResponse(status_code=code, content={"message": message, "votings": votings})


@router.get('/voting_stats/{voting_id}')
def get_voting_stats(voting_id: int):
    code, message = get_voting_statistics(voting_id)
    return JSONResponse(status_code=code, content={"message": message})