from datetime import datetime

from pydantic import BaseModel, EmailStr


class SignInRequestModel(BaseModel):
    email: str
    password_hash: str


class AdminRegistrationModel(BaseModel):
    email: str
    password_hash: str
    full_name: str
    phone_number: str
    salary: float


class OwnerRegistrationModel(BaseModel):
    email: str
    password_hash: str
    full_name: str
    phone_number: str
    full_address: str


class BuildingModel(BaseModel):
    building_name: str
    city: str
    street: str
    building_number: str
    postal_code: str
    floors_amount: int


class SpaceModel(BaseModel):
    space_number: str
    area: float
    space_type: int
    floor: int
    building_id: int


class SpaceToOwnerModel(BaseModel):
    space_id: int
    share: float
    purchase_date: datetime
    owner_id: int