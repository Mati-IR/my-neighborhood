from fastapi import APIRouter, HTTPException
from fastapi.responses import JSONResponse
from .models import OccupantModel, SpaceModel, SpaceToOwnerModel, RemoveOwnerFromSpaceModel, NewLeaseAgreementModel, LeaseAgreementModel
from .logic import (create_space as new_space, get_space_by_id, assign_space_to_owner as assign_space,
                    get_space_categories as get_all_space_categories, remove_space, remove_owner_from_space,
                    get_owners_of_space, get_all_spaces_ids, get_spaces_of_owner, get_occupants_for_space, create_lease_agreement, remove_lease_agreement,assign_occupant_to_space, get_lease_agreement, update_lease_agreement)
import logging
import json

router = APIRouter()

# setup logger
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@router.get("/get_space_by_id/{space_id}")
def get_space(space_id: int):
    code, message = get_space_by_id(space_id)
    return JSONResponse(status_code=code, content={"message": message})


@router.get("/get_space_categories")
def get_space_categories():
    code, message = get_all_space_categories()
    return JSONResponse(status_code=code, content={"message": message})


@router.get("/get_owners_of_space/{space_id}")
def owners_of_space(space_id: int):
    code, message = get_owners_of_space(space_id)
    return JSONResponse(status_code=code, content={"message": message})


@router.post("/create_space")
def create_space(floor: SpaceModel):
    code, message = new_space(floor)
    return JSONResponse(status_code=code, content={"message": message})


@router.post("/assign_space_to_owner")
def assign_space_to_owner(space_to_owner: SpaceToOwnerModel):
    code, message = assign_space(space_to_owner)
    return JSONResponse(status_code=code, content={"message": message})


@router.delete("/delete_space/{space_id}")
def delete_space(space_id: int):
    code, message = remove_space(space_id)
    return JSONResponse(status_code=code, content={"message": message})


@router.delete("/remove_owner_from_space")
def remove_owner_from_space_api(space_to_owner: RemoveOwnerFromSpaceModel):
    code, message = remove_owner_from_space(space_to_owner.owner_id, space_to_owner.space_id)
    return JSONResponse(status_code=code, content={"message": message})


# Lease agreement
# CRUD for lease agreement
@router.post("/lease_agreement")
def post_lease_agreement(lease_agreement: NewLeaseAgreementModel):
    code, message = create_lease_agreement(lease_agreement)
    return JSONResponse(status_code=code, content={"message": message})

@router.delete("/lease_agreement/{space_id}")
def delete_lease_agreement(space_id: int):
    code, message = remove_lease_agreement(space_id)
    return JSONResponse(status_code=code, content={"message": message})

@router.get("/lease_agreement/{space_id}")
def get_lease_agreement_by_id(space_id: int):
    code, message = get_lease_agreement(space_id)
    return JSONResponse(status_code=code, content={"message": message})

@router.put("/lease_agreement")
def put_lease_agreement(lease_agreement: LeaseAgreementModel):
    code, message = update_lease_agreement(lease_agreement)
    return JSONResponse(status_code=code, content={"message": message})

@router.post('/assign_occupant_to_space')
def assign_occupant(occupant: OccupantModel):
    code, message = assign_occupant_to_space(occupant)
    return JSONResponse(status_code=code, content={"message": message})

@router.get('/occupant_for_space/{space_id}')
def occupants_for_space(space_id: int):
    code, message = get_occupants_for_space(space_id)
    return JSONResponse(status_code=code, content={"message": message})

@router.get('/spaces_of_owner/{owner_id}')
def spaces_of_owner(owner_id: int):
    code, message = get_spaces_of_owner(owner_id)
    return JSONResponse(status_code=code, content={"message": message})

@router.get('/all_spaces_ids')
def get_spaces_ids():
    pass
    code, message = get_all_spaces_ids()
    return JSONResponse(status_code=code, content={"message": message})