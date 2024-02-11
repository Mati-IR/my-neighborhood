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


#CREATE TABLE `space`
#(
# `id`           int NOT NULL AUTO_INCREMENT ,
# `space_number` varchar(10) NULL ,
# `area`         decimal NULL ,
# `space_type`   int NOT NULL ,
#
#PRIMARY KEY (`id`),
#KEY `FK_1` (`space_type`),
#CONSTRAINT `FK_9` FOREIGN KEY `FK_1` (`space_type`) REFERENCES `space_type` (`id`)
#);

class SpaceModel(BaseModel):
    space_number: str
    area: float
    space_type: int
    floor: int
    building_id: int
