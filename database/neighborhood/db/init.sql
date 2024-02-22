-- init.sql

CREATE TABLE `owner_credentials`
(
 `id`            int NOT NULL AUTO_INCREMENT ,
 `email`         varchar(320) NOT NULL ,
 `password_hash` varchar(64) NOT NULL ,

PRIMARY KEY (`id`)
);


CREATE TABLE `admin_credentials`
(
 `id`            int NOT NULL AUTO_INCREMENT ,
 `password_hash` varchar(64) NOT NULL ,
 `email`         varchar(320) NOT NULL ,

PRIMARY KEY (`id`)
);


CREATE TABLE `admin`
(
 `id`           int NOT NULL AUTO_INCREMENT ,
 `full_name`    varchar(100) NOT NULL ,
 `phone_number` varchar(220) NULL ,
 `salary`       decimal NULL ,
 `salary_currency` varchar(3) NULL ,
 `credentials_id`  int NOT NULL ,

PRIMARY KEY (`id`),
KEY `FK_2` (`credentials_id`),
CONSTRAINT `FK_15` FOREIGN KEY `FK_2` (`credentials_id`) REFERENCES `admin_credentials` (`id`)
);

INSERT INTO `admin_credentials` (`email`, `password_hash`) VALUES ('admin@gmail.com', '8c6976e5b5410415bde908bd4dee15dfb167a9c873fc4bb8a81f6f2ab448a918');
INSERT INTO `admin` (`full_name`, `phone_number`, `salary`, `salary_currency`, `credentials_id`) VALUES ('Admin', '123456789', 1000, 'USD', 1);

CREATE TABLE `building`
(
 `id`              int NOT NULL AUTO_INCREMENT ,
 `building_name`   varchar(50) NOT NULL ,
 `city`            varchar(40) NOT NULL ,
 `street`          varchar(50) NULL ,
 `building_number` varchar(10) NOT NULL ,
 `postal_code`     varchar(10) NOT NULL ,
 `floors_amount`   int NOT NULL ,

PRIMARY KEY (`id`)
);


CREATE TABLE `floor_for_building`
(
 `floor_id`     int NOT NULL AUTO_INCREMENT ,
 `floor_number` int NOT NULL ,
 `building_id`  int NOT NULL ,

PRIMARY KEY (`floor_id`),
KEY `FK_1` (`building_id`),
CONSTRAINT `FK_5` FOREIGN KEY `FK_1` (`building_id`) REFERENCES `building` (`id`) ON DELETE CASCADE
);

CREATE TABLE `billing_basis`
(
 `id`    int NOT NULL ,
 `basis` varchar(20) NOT NULL ,

PRIMARY KEY (`id`)
);
INSERT INTO `billing_basis` (`id`, `basis`) VALUES (1, 'Per square meter'), (2, 'Per opccupant');

CREATE TABLE `utilities`
(
 `id`             int NOT NULL AUTO_INCREMENT ,
 `name`           varchar(40) NOT NULL ,
 `price_per_unit` decimal(6,2) NOT NULL ,
 `unit`           varchar(15) NOT NULL ,
 `billing_basis`  int NOT NULL ,

PRIMARY KEY (`id`),
KEY `FK_1` (`billing_basis`),
CONSTRAINT `FK_27` FOREIGN KEY `FK_1` (`billing_basis`) REFERENCES `billing_basis` (`id`)
);

INSERT INTO `utilities` (`name`, `price_per_unit`, `billing_basis`, `unit`) VALUES ('Rent', 10, 1, 'm2'), ('Garbage', 5, 2, 'person'), ('Renovation', 10, 1, 'm2'), ('Management', 10, 1, 'm2');



CREATE TABLE `space_type`
(
 `id`        int NOT NULL AUTO_INCREMENT ,
 `type_name` varchar(50) NOT NULL ,

PRIMARY KEY (`id`)
);


CREATE TABLE `space`
(
 `id`           int NOT NULL AUTO_INCREMENT ,
 `space_number` varchar(10) NULL ,
 `area`         decimal NULL ,
 `space_type`   int NOT NULL ,

PRIMARY KEY (`id`),
KEY `FK_1` (`space_type`),
CONSTRAINT `FK_9` FOREIGN KEY `FK_1` (`space_type`) REFERENCES `space_type` (`id`)
);




CREATE TABLE `invoice`
(
 `id`    int NOT NULL AUTO_INCREMENT ,
 `space_id` int NOT NULL ,
 `year`  int NOT NULL ,
 `month` int NOT NULL ,

PRIMARY KEY (`id`),
KEY `FK_1` (`space_id`),
CONSTRAINT `FK_21` FOREIGN KEY `FK_1` (`space_id`) REFERENCES `space` (`id`) ON DELETE CASCADE
);

CREATE TABLE `invoice_position`
(
 `id`         int NOT NULL AUTO_INCREMENT ,
 `utility_id`    int NOT NULL ,
 `price`      decimal NOT NULL ,
 `invoice_id` int NOT NULL ,

PRIMARY KEY (`id`),
KEY `FK_1` (`utility_id`),
CONSTRAINT `FK_20` FOREIGN KEY `FK_1` (`utility_id`) REFERENCES `utilities` (`id`),
KEY `FK_2` (`invoice_id`),
CONSTRAINT `FK_27_1` FOREIGN KEY `FK_2` (`invoice_id`) REFERENCES `invoice` (`id`)
);

CREATE TABLE `invoices_for_space`
(
 `id`         int NOT NULL AUTO_INCREMENT ,
 `space_id`   int NOT NULL ,
 `invoice_id` int NOT NULL ,

PRIMARY KEY (`id`),
KEY `FK_1` (`space_id`),
CONSTRAINT `FK_22` FOREIGN KEY `FK_1` (`space_id`) REFERENCES `space` (`id`) ON DELETE CASCADE,
KEY `FK_2` (`invoice_id`),
CONSTRAINT `FK_23` FOREIGN KEY `FK_2` (`invoice_id`) REFERENCES `invoice` (`id`) ON DELETE CASCADE
);


CREATE TABLE `lease_agreement`
(
 `id`                int NOT NULL AUTO_INCREMENT ,
 `rent`              decimal NULL ,
 `renter_full_name` varchar(100) NOT NULL ,
 `phone_number`      varchar(20) NOT NULL ,
 `email`             varchar(100) NOT NULL ,
 `space_id`          int NOT NULL ,
 `start_date`        date NOT NULL ,
 `end_date`          date NOT NULL ,

PRIMARY KEY (`id`),
KEY `FK_1` (`space_id`),
CONSTRAINT `FK_24` FOREIGN KEY `FK_1` (`space_id`) REFERENCES `space` (`id`) ON DELETE CASCADE
);


CREATE TABLE `news`
(
 `id`            int NOT NULL AUTO_INCREMENT ,
 `title`         varchar(45) NOT NULL ,
 `description`   varchar(3000) NOT NULL ,
 `creation_date` datetime NOT NULL ,
 `creator_id`    int NOT NULL ,

PRIMARY KEY (`id`),
KEY `FK_1` (`creator_id`),
CONSTRAINT `FK_18` FOREIGN KEY `FK_1` (`creator_id`) REFERENCES `admin` (`id`)
);


CREATE TABLE `occupant`
(
 `id`      int NOT NULL AUTO_INCREMENT ,
 `name`    varchar(45) NOT NULL ,
 `surname` varchar(45) NOT NULL ,

PRIMARY KEY (`id`)
);


CREATE TABLE `occupants_of_space`
(
 `id`          int NOT NULL AUTO_INCREMENT ,
 `space_id`    int NOT NULL ,
 `occupant_id` int NOT NULL ,

PRIMARY KEY (`id`),
KEY `FK_1` (`space_id`),
CONSTRAINT `FK_10` FOREIGN KEY `FK_1` (`space_id`) REFERENCES `space` (`id`) ON DELETE CASCADE,
KEY `FK_2` (`occupant_id`),
CONSTRAINT `FK_11` FOREIGN KEY `FK_2` (`occupant_id`) REFERENCES `occupant` (`id`) ON DELETE CASCADE
);


CREATE TABLE `owner`
(
 `id`           int NOT NULL AUTO_INCREMENT ,
 `full_name`    varchar(100) NOT NULL COMMENT 'Person or a company' ,
 `phone_number` varchar(20) NOT NULL ,
 `full_address` varchar(100) NOT NULL ,
 `credentials_id`  int NOT NULL ,

PRIMARY KEY (`id`),
KEY `FK_1` (`credentials_id`),
CONSTRAINT `FK_25_1` FOREIGN KEY `FK_1` (`credentials_id`) REFERENCES `owner_credentials` (`id`)
);

INSERT INTO `owner_credentials` (`email`, `password_hash`) VALUES ('owner@gmail.com', '4c1029697ee358715d3a14a2add817c4b01651440de808371f78165ac90dc581');
INSERT INTO `owner` (`full_name`, `phone_number`, `full_address`, `credentials_id`) VALUES ('Test owner', '123456789', 'test street 1', 1);

CREATE TABLE `owner_of_space`
(
 `id`            int NOT NULL AUTO_INCREMENT ,
 `space_id`      int NOT NULL ,
 `share`         decimal(5, 2) NOT NULL ,
 `purchase_date` datetime NOT NULL ,
 `owner_id`      int NOT NULL ,

PRIMARY KEY (`id`),
KEY `FK_1` (`owner_id`),
CONSTRAINT `FK_12` FOREIGN KEY `FK_1` (`owner_id`) REFERENCES `owner` (`id`) ON DELETE CASCADE,
KEY `FK_2` (`space_id`),
CONSTRAINT `FK_13` FOREIGN KEY `FK_2` (`space_id`) REFERENCES `space` (`id`) ON DELETE CASCADE
);


CREATE TABLE `serviceman`
(
 `id`          int NOT NULL AUTO_INCREMENT ,
 `full_name`   varchar(100) NOT NULL ,
 `specialties` varchar(100) NOT NULL ,
 `company_id`  varchar(45) NOT NULL ,

PRIMARY KEY (`id`)
);


CREATE TABLE `spaces_for_floor`
(
 `id`       int NOT NULL AUTO_INCREMENT ,
 `floor_id` int NOT NULL ,
 `space`    int NOT NULL ,

PRIMARY KEY (`id`),
KEY `FK_1` (`floor_id`),
CONSTRAINT `FK_6` FOREIGN KEY `FK_1` (`floor_id`) REFERENCES `floor_for_building` (`floor_id`) ON DELETE CASCADE,
KEY `FK_2` (`space`),
CONSTRAINT `FK_7` FOREIGN KEY `FK_2` (`space`) REFERENCES `space` (`id`) ON DELETE CASCADE
);


CREATE TABLE `voting`
(
 `id`          int NOT NULL AUTO_INCREMENT ,
 `start_date`  datetime NOT NULL ,
 `end_date`    datetime NOT NULL ,
 `title`       varchar(100) NOT NULL ,
 `description` varchar(4000) NOT NULL ,

PRIMARY KEY (`id`)
);


CREATE TABLE `vote`
(
 `id`           int NOT NULL AUTO_INCREMENT ,
 `timestamp`    datetime NOT NULL ,
 `owned_spaces` decimal(5, 2) NOT NULL COMMENT 'Weight of the vote will be proportional to the amount of owned spaces' ,
 `choice`       tinyint NOT NULL ,
 `voter_id`     int NOT NULL ,
 `voting_id`    int NOT NULL ,

PRIMARY KEY (`id`),
KEY `FK_1` (`voter_id`),
CONSTRAINT `FK_16` FOREIGN KEY `FK_1` (`voter_id`) REFERENCES `owner` (`id`),
KEY `FK_2` (`voting_id`),
CONSTRAINT `FK_26` FOREIGN KEY `FK_2` (`voting_id`) REFERENCES `voting` (`id`)
);


CREATE TABLE `incident_category`
(
 `id`   int NOT NULL AUTO_INCREMENT ,
 `name` varchar(50) NOT NULL ,

PRIMARY KEY (`id`)
);

INSERT INTO `incident_category` (`name`) VALUES ('Hydraulic'), ('Electric'), ('Heating'), ('Maintanance'), ('Elevator'), ('Vandalism'), ('Lost and Found'), ('Pest infestation'), ('Parking violation'), ('Other');


CREATE TABLE `incident_state`
(
 `id`   int NOT NULL AUTO_INCREMENT ,
 `name` varchar(15) NOT NULL ,

PRIMARY KEY (`id`)
);

INSERT INTO `incident_state` (`name`) VALUES ('Created'), ('Investigation'),  ('Tech on site'), 
                                            ('Awaiting parts'), ('Awaiting vendor'), ('Resolved');


CREATE TABLE `incident`
(
 `id`            int NOT NULL AUTO_INCREMENT ,
 `category_id`   int NOT NULL ,
 `title`   varchar(100) NOT NULL ,
 `description`   varchar(3000) NOT NULL ,
 `admin_id`      int,
 `location`      varchar(100) NOT NULL ,
 `creation_date` datetime NOT NULL ,
 `closure_date`  datetime,
 `state`         int NOT NULL ,
 `owner_id`      int NOT NULL ,

PRIMARY KEY (`id`),
KEY `FK_1` (`category_id`),
CONSTRAINT `FK_1` FOREIGN KEY `FK_1` (`category_id`) REFERENCES `incident_category` (`id`),
KEY `FK_2` (`state`),
CONSTRAINT `FK_2` FOREIGN KEY `FK_2` (`state`) REFERENCES `incident_state` (`id`),
KEY `FK_4` (`admin_id`),
CONSTRAINT `FK_19` FOREIGN KEY `FK_4` (`admin_id`) REFERENCES `admin` (`id`),
KEY `FK_5` (`owner_id`),
CONSTRAINT `FK_24_1` FOREIGN KEY `FK_5` (`owner_id`) REFERENCES `owner` (`id`)
);


CREATE TABLE `incident_staff`
(
 `id`            int NOT NULL AUTO_INCREMENT ,
 `incident_id`   int NOT NULL ,
 `serviceman_id` int NOT NULL ,

PRIMARY KEY (`id`),
KEY `FK_2` (`incident_id`),
CONSTRAINT `FK_4` FOREIGN KEY `FK_2` (`incident_id`) REFERENCES `incident` (`id`) ON DELETE CASCADE,
KEY `FK_2_1` (`serviceman_id`),
CONSTRAINT `FK_25` FOREIGN KEY `FK_2_1` (`serviceman_id`) REFERENCES `serviceman` (`id`) ON DELETE CASCADE
);


INSERT INTO `space_type` (`type_name`) VALUES ('Apartment'), ('Office'), ('Storage'), ('Garage'),
                                              ('Gym'), ('Commercial'), ('Other');
