from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base
from .database_handler.tables_models import Voting, Admin, Vote
from .spaces import get_all_spaces_of_owner
from ..models import NewVotingModel, VoteModel
from .database_handler.util import get_database_session
from .spaces import get_space_by_id, remove_space
import os
import logging

RETURN_SUCCESS = 200
RETURN_FAILURE = 400
RETURN_BUILDING_ALREADY_EXISTS = 409
RETURN_INCORRECT_LENGTH = 411

# setup logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def new_voting(new_voting: NewVotingModel):
    with get_database_session() as session:
        code = RETURN_SUCCESS
        message = "Voting created"

        if None in new_voting.__dict__.values() or "" in new_voting.__dict__.values():
            code = RETURN_FAILURE
            message = "Please fill all the fields"
            return code, message

        if len(new_voting.title) > 100 or len(new_voting.description) > 4000:
            code = RETURN_FAILURE
            message = "Data lengths incorrect"
            return code, message

        if new_voting.start_date > new_voting.end_date:
            code = RETURN_FAILURE
            message = "Start date is greater than end date"
            return code, message

        admin = session.query(Admin).filter(Admin.id == new_voting.creator_id).first()
        if admin is None:
            code = RETURN_FAILURE
            message = "Admin not found"
            return code, message


        voting = Voting(title=new_voting.title, description=new_voting.description,
                        start_date=new_voting.start_date, end_date=new_voting.end_date)
        session.add(voting)
        session.commit()
        return code, message


def get_all_votings(requester_id: int):
    with get_database_session() as session:
        code = RETURN_SUCCESS
        message = "Votings found"
        votings = session.query(Voting).all()
        return_votings = []
        if not votings:
            code = RETURN_FAILURE
            message = "Votings not found"
        else:
            for voting in votings:
                # did the requester already vote?
                vote = session.query(Vote).filter(Vote.voter_id == requester_id, Vote.voting_id == voting.id).first()
                voted = False
                if vote is not None:
                    voted = True
                return_votings.append({
                    'id': voting.id,
                    'title': voting.title,
                    'description': voting.description,
                    'start_date': voting.start_date.isoformat(),
                    'end_date': voting.end_date.isoformat(),
                    'voted': voted
                })
        return code, message, return_votings


def cast_vote(vote: VoteModel):
    with get_database_session() as session:
        code = RETURN_SUCCESS
        message = "Vote casted"

        if None in vote.__dict__.values() or "" in vote.__dict__.values():
            code = RETURN_FAILURE
            message = "Please fill all the fields"
            return code, message

        if vote.is_admin:
            code = RETURN_FAILURE
            message = "Admin cannot vote"
            return code, message

        owner = session.query(Admin).filter(Admin.id == vote.owner_id).all()
        if not owner:
            code = RETURN_FAILURE
            message = "Owner not found"
            return code, message

        voting = session.query(Voting).filter(Voting.id == vote.voting_id).first()
        if voting is None:
            code = RETURN_FAILURE
            message = "Voting not found"
            return code, message

        prev_vote = session.query(Vote).filter(Vote.voter_id == vote.owner_id, Vote.voting_id == vote.voting_id).first()
        if prev_vote is not None:
            code = RETURN_FAILURE
            message = "Vote already casted"
            return code, message


        code, spaces_of_owner = get_all_spaces_of_owner(vote.owner_id)
        if code != RETURN_SUCCESS:
            return code, spaces_of_owner
        vote_strength = 0
        logger.info(spaces_of_owner)
        for space in spaces_of_owner:
            vote_strength += space["share"]

        # if owner has no spaces
        if vote_strength < 0.0001: # direct comparison with 0 is not safe
            code = RETURN_FAILURE
            message = "Owner has no spaces"
            return code, message

        # import datetime
        from datetime import datetime
        new_vote = Vote(timestamp=datetime.now(), owned_spaces=vote_strength, voting_id=vote.voting_id, choice=vote.vote, voter_id=vote.owner_id)
        session.add(new_vote)
        session.commit()
        return code, message