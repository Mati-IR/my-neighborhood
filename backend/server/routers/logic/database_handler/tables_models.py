from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, DECIMAL, DateTime, Date, Text, SmallInteger, \
    Numeric
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, backref

Base = declarative_base()


class OwnerCredential(Base):
    __tablename__ = 'owner_credentials'
    id = Column(Integer, primary_key=True)
    email = Column(String(320), nullable=False, unique=True)
    password_hash = Column(String(64), nullable=False)

class AdminCredential(Base):
    __tablename__ = 'admin_credentials'
    id = Column(Integer, primary_key=True)
    password_hash = Column(String(64), nullable=False)
    email = Column(String(320), nullable=False, unique=True)

class Admin(Base):
    __tablename__ = 'admin'
    id = Column(Integer, primary_key=True)
    full_name = Column(String(100), nullable=False)
    phone_number = Column(String(220))
    salary = Column(DECIMAL)
    salary_currency = Column(String(3))
    credentials_id = Column(Integer, ForeignKey('admin_credentials.id'), unique=True)



class Building(Base):
    __tablename__ = 'building'
    id = Column(Integer, primary_key=True, autoincrement=True)
    building_name = Column(String(50), nullable=False)
    city = Column(String(40), nullable=False)
    street = Column(String(50))
    building_number = Column(String(10), nullable=False)
    postal_code = Column(String(10), nullable=False)
    floors_amount = Column(Integer, nullable=False)


class FloorForBuilding(Base):
    __tablename__ = 'floor_for_building'
    floor_id = Column(Integer, primary_key=True, autoincrement=True)
    floor_number = Column(Integer, nullable=False)
    building_id = Column(Integer, ForeignKey('building.id', ondelete='CASCADE'))


class Utility(Base):
    __tablename__ = 'utilities'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(40), nullable=False)
    price_per_unit = Column(Numeric(precision=6, scale=2), nullable=False)
    unit = Column(String(15), nullable=False)
    billing_basis = Column(Integer, ForeignKey('billing_basis.id'))
    billing_basis_relation = relationship("BillingBasis", backref="utilities")


class BillingBasis(Base):
    __tablename__ = 'billing_basis'
    id = Column(Integer, primary_key=True, autoincrement=True)
    basis = Column(String(20), nullable=False)


class InvoicePosition(Base):
    __tablename__ = 'invoice_position'
    id = Column(Integer, primary_key=True, autoincrement=True)
    utility_id = Column(Integer, ForeignKey('utilities.id'), nullable=False)
    price = Column(DECIMAL, nullable=False)
    invoice_id = Column(Integer, ForeignKey('invoice.id', ondelete='CASCADE'), nullable=False)
    
    # Relationship to Utility
    utility = relationship("Utility", backref="invoice_positions")
    

class Invoice(Base):
    __tablename__ = 'invoice'
    id = Column(Integer, primary_key=True, autoincrement=True)
    space_id = Column(Integer, ForeignKey('space.id', ondelete='CASCADE'), nullable=False)
    year = Column(Integer, nullable=False)
    month = Column(Integer, nullable=False)
    
    # Define a one-to-many relationship with InvoicePosition
    positions = relationship("InvoicePosition", backref="invoice")
    

class SpaceType(Base):
    __tablename__ = 'space_type'
    id = Column(Integer, primary_key=True, autoincrement=True)
    type_name = Column(String(50), nullable=False)


class Space(Base):
    __tablename__ = 'space'
    id = Column(Integer, primary_key=True, autoincrement=True)
    space_number = Column(String(10))
    area = Column(DECIMAL)
    space_type = Column(Integer, ForeignKey('space_type.id'))
    space_type_relation = relationship("SpaceType", backref="spaces")


class InvoicesForSpace(Base):
    __tablename__ = 'invoices_for_space'
    id = Column(Integer, primary_key=True, autoincrement=True)
    space_id = Column(Integer, ForeignKey('space.id', ondelete='CASCADE'))
    invoice_id = Column(Integer, ForeignKey('invoice.id', ondelete='CASCADE'))
    space = relationship("Space", backref="invoices_for_spaces")
    invoice = relationship("Invoice", backref="invoices_for_spaces")


class LeaseAgreement(Base):
    __tablename__ = 'lease_agreement'
    id = Column(Integer, primary_key=True, autoincrement=True)
    rent = Column(DECIMAL)
    renter_full_name = Column(String(100), nullable=False)
    phone_number = Column(String(20), nullable=False)
    email = Column(String(100), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    space_id = Column(Integer, ForeignKey('space.id', ondelete='CASCADE'))
    space = relationship("Space", backref="lease_agreements")


class News(Base):
    __tablename__ = 'news'
    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String(45), nullable=False)
    description = Column(String(3000), nullable=False)
    creation_date = Column(DateTime, nullable=False)
    creator_id = Column(Integer, ForeignKey('admin.id'))
    creator = relationship("Admin", backref="news")


class Occupant(Base):
    __tablename__ = 'occupant'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(45), nullable=False)
    surname = Column(String(45), nullable=False)


class OccupantsOfSpace(Base):
    __tablename__ = 'occupants_of_space'
    id = Column(Integer, primary_key=True, autoincrement=True)
    space_id = Column(Integer, ForeignKey('space.id', ondelete='CASCADE'))
    occupant_id = Column(Integer, ForeignKey('occupant.id', ondelete='CASCADE'))
    space = relationship("Space", backref="occupants_of_spaces")
    occupant = relationship("Occupant", backref="occupants_of_spaces")


class Owner(Base):
    __tablename__ = 'owner'
    id = Column(Integer, primary_key=True)
    full_name = Column(String(100), nullable=False)  # Person or a company
    phone_number = Column(String(20), nullable=False)
    full_address = Column(String(100), nullable=False)
    credentials_id = Column(Integer, ForeignKey('owner_credentials.id'), unique=True)


class OwnerOfSpace(Base):
    __tablename__ = 'owner_of_space'
    id = Column(Integer, primary_key=True, autoincrement=True)
    space_id = Column(Integer, ForeignKey('space.id', ondelete='CASCADE'))
    share = Column(DECIMAL(precision=5, scale=2), nullable=False)
    purchase_date = Column(DateTime, nullable=False)
    owner_id = Column(Integer, ForeignKey('owner.id', ondelete='CASCADE'))
    owner = relationship("Owner", backref="owner_of_spaces")
    space = relationship("Space", backref="owner_of_spaces")


class Serviceman(Base):
    __tablename__ = 'serviceman'
    id = Column(Integer, primary_key=True, autoincrement=True)
    full_name = Column(String(100), nullable=False)
    specialties = Column(String(100), nullable=False)
    company_id = Column(String(45), nullable=False)


class SpacesForFloor(Base):
    __tablename__ = 'spaces_for_floor'
    id = Column(Integer, primary_key=True, autoincrement=True)
    floor_id = Column(Integer, ForeignKey('floor_for_building.floor_id', ondelete='CASCADE'))
    space = Column(Integer, ForeignKey('space.id', ondelete='CASCADE'))
    floor = relationship("FloorForBuilding", backref="spaces_for_floor")
    space_relation = relationship("Space", backref="spaces_for_floor")


class Vote(Base):
    __tablename__ = 'vote'
    id = Column(Integer, primary_key=True, autoincrement=True)
    timestamp = Column(DateTime, nullable=False)
    owned_spaces = Column(DECIMAL, nullable=False,
                          comment='Weight of the vote will be proportional to the amount of owned spaces')
    choice = Column(SmallInteger, nullable=False)
    voter_id = Column(Integer, ForeignKey('owner.id'))
    voting_id = Column(Integer, ForeignKey('voting.id'))
    voter = relationship("Owner", backref="votes")

class Voting(Base):
    __tablename__ = 'voting'
    id = Column(Integer, primary_key=True, autoincrement=True)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    title = Column(String(100), nullable=False)
    description = Column(String(4000), nullable=False)



class IncidentCategory(Base):
    __tablename__ = 'incident_category'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(50), nullable=False)


class IncidentState(Base):
    __tablename__ = 'incident_state'
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(15), nullable=False)


class Incident(Base):
    __tablename__ = 'incident'
    id = Column(Integer, primary_key=True, autoincrement=True)
    category_id = Column(Integer, ForeignKey('incident_category.id'))
    title = Column(String(100), nullable=False)
    description = Column(String(3000), nullable=False)
    admin_id = Column(Integer, ForeignKey('admin.id'))
    location = Column(String(100), nullable=False)
    creation_date = Column(DateTime, nullable=False)
    closure_date = Column(DateTime, nullable=False)
    state = Column(Integer, ForeignKey('incident_state.id'))
    owner_id = Column(Integer, ForeignKey('owner.id'))
    category = relationship("IncidentCategory", backref="incidents")
    state_relation = relationship("IncidentState", backref="incidents")
    admin = relationship("Admin", backref="incidents")
    owner = relationship("Owner", backref="incidents")


class IncidentStaff(Base):
    __tablename__ = 'incident_staff'
    id = Column(Integer, primary_key=True, autoincrement=True)
    incident_id = Column(Integer, ForeignKey('incident.id'))
    serviceman_id = Column(Integer, ForeignKey('serviceman.id'))
    incident = relationship("Incident", backref="incident_staffs")
    serviceman = relationship("Serviceman", backref="incident_staffs")

##CREATE TABLE `water_meter_reading`
#(
# `id`                int NOT NULL ,
# `space_id`          int NOT NULL ,
# `date`              date NOT NULL ,
# `warm_water_liters` decimal NOT NULL ,
# `cold_water_liters` decimal NOT NULL ,
# `is_in_bill`        tinyint NOT NULL ,
#
#PRIMARY KEY (`id`),
#KEY `FK_1` (`space_id`),
#CONSTRAINT `FK_27_2` FOREIGN KEY `FK_1` (`space_id`) REFERENCES `space` (`id`)
#);

class WaterMeterReading(Base):
    __tablename__ = 'water_meter_reading'
    id = Column(Integer, primary_key=True, autoincrement=True)
    space_id = Column(Integer, ForeignKey('space.id'))
    date = Column(Date, nullable=False)
    warm_water_liters = Column(DECIMAL, nullable=False)
    cold_water_liters = Column(DECIMAL, nullable=False)
    is_in_bill = Column(SmallInteger, nullable=False)
    space = relationship("Space", backref="water_meter_readings")
