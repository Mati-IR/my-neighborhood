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
    salary_currency: str


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


class RemoveOwnerFromSpaceModel(BaseModel):
    space_id: int
    owner_id: int


#CREATE TABLE `news`
#(
# `id`            int NOT NULL AUTO_INCREMENT ,
# `title`         varchar(45) NOT NULL ,
# `description`   varchar(3000) NOT NULL ,
# `creation_date` datetime NOT NULL ,
# `creator_id`    int NOT NULL ,
#
#PRIMARY KEY (`id`),
#KEY `FK_1` (`creator_id`),
#CONSTRAINT `FK_18` FOREIGN KEY `FK_1` (`creator_id`) REFERENCES `admin` (`id`)
#);
class NewNewsModel(BaseModel):
    title: str
    description: str
    creation_date: datetime
    creator_id: int

class NewsModel(BaseModel):
    id: int
    title: str
    description: str
    creation_date: datetime
    creator_id: int
