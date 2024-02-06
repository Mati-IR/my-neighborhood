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
