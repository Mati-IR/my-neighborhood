from datetime import datetime, date

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


# CREATE TABLE `lease_agreement`
# (
#  `id`                int NOT NULL AUTO_INCREMENT ,
#  `rent`              decimal NULL ,
#  `rentier_full_name` varchar(100) NOT NULL ,
#  `phone_number`      varchar(20) NOT NULL ,
#  `email`             varchar(100) NOT NULL ,
#  `space_id`          int NOT NULL ,
#
# PRIMARY KEY (`id`),
# KEY `FK_1` (`space_id`),
# CONSTRAINT `FK_24` FOREIGN KEY `FK_1` (`space_id`) REFERENCES `space` (`id`) ON DELETE CASCADE
# );
class NewLeaseAgreementModel(BaseModel):
    rent: float
    renter_full_name: str
    phone_number: str
    email: EmailStr
    space_id: int
    start_date: date
    end_date: date

class LeaseAgreementModel(BaseModel):
    id: int
    rent: float
    renter_full_name: str
    phone_number: str
    email: EmailStr
    space_id: int
    start_date: date
    end_date: date

