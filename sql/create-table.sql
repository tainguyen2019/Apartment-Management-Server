-- set datestyle
set datestyle to dmy;

-- create extension uuid-ossp
create extension if not exists "uuid-ossp";

create table if not exists apartment(
	id uuid default uuid_generate_v4(),
	apartment_number varchar(12),
	block_number varchar(12),
	account_id uuid,
	host varchar(50),
	phone varchar(10),
	email varchar(50),
	floor_area numeric(5, 2), -- total precision is 5 and scale is 2. Ex: 100.99
	type varchar(20),
	note text,
	constraint pk_apartment_id primary key (id)
);

create table if not exists staff(
	id uuid default uuid_generate_v4(),
	account_id uuid,
	position_id uuid,
	name varchar(50),
	phone varchar(10),
	email varchar(50),
	salary int,
	status varchar(20),
	constraint pk_staff_id primary key (id)
);

create table if not exists job_position(
	id uuid default uuid_generate_v4(),
	name varchar(50),
	department_id uuid,
	constraint pk_job_title_id primary key (id)
);

create table if not exists department(
	id uuid default uuid_generate_v4(),
	name varchar(50),
	constraint pk_department_id primary key (id)
);

create table if not exists fee(
	id uuid default uuid_generate_v4(),
	name varchar(50),
	amount int,
	unit varchar(20),
	code varchar(50),
	constraint pk_fee_id primary key (id)
);

create table if not exists area(
	id uuid default uuid_generate_v4(),
	building varchar(5),
	location varchar(20),
	constraint pk_area_id primary key (id)
);

-- privilege table
-- action 
-- 	'READ', 
-- 	'CREATE', 
-- 	'WRITE', 
-- 	'DELETE',
-- 	'APPROVE'
create table if not exists privilege(
	id uuid default uuid_generate_v4(),
	code varchar,
	description text,
	table_name varchar,
	action varchar(32),
	constraint pk_privilege_id primary key (id)
);

create table if not exists role(
	id uuid default uuid_generate_v4(),
	name varchar,
	code varchar,
	constraint pk_role_id primary key (id)
);

create table if not exists role_privilege(
	role_id uuid,
	privilege_id uuid,
	constraint pk_role_privilege primary key (role_id, privilege_id)
);

create table if not exists account(
	id uuid default uuid_generate_v4(),
	username varchar(30),
	password varchar(256),
	role_id uuid,
	type varchar(10),
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now(),
	constraint pk_account_id primary key (id)
);

create table if not exists event(
	id uuid default uuid_generate_v4(),
	apartment_id uuid,
	name varchar(50),
	date date,
	start_time time,
	end_time time,
	status varchar(20),
	approver_id uuid,
	note text,
	constraint pk_event_id primary key (id)
);

create table if not exists repair_info(
	id uuid default uuid_generate_v4(),
	apartment_id uuid,
	staff_id uuid,
	date date,
	content text,
	rate varchar(20),
	status varchar(20),
	constraint pk_repair_info_id primary key (id)
);

create table if not exists reflect_info(
	id uuid default uuid_generate_v4(),
	department_id uuid,
	apartment_id uuid,
	date date not null default CURRENT_DATE,
	title text,
	content text,
	answer text,
	status varchar(20),
	constraint pk_reflect_info_id primary key (id)
);

create table if not exists vehicle_parking_registration(
	id uuid default uuid_generate_v4(),
	plate_number varchar(11),
	apartment_id uuid,
	identity_card_number varchar(12),
	parking_no varchar(6),
	type varchar(20),
	status varchar(20),
	approver_id uuid,
	start_date date,
	cancellation_date date,
	constraint pk_vehicle_parking_registration_id primary key (id)
);

create table if not exists receipt(
	id uuid default uuid_generate_v4(),
	apartment_id uuid,
	staff_id uuid,
	date date not null default CURRENT_DATE ,
	content text,
	total int,
	status varchar(20),
	type varchar(20),
	month smallint,
	year smallint,
	constraint pk_receipt_id primary key (id)
);

create table if not exists receipt_detail(
	id uuid default uuid_generate_v4(),
	receipt_id uuid not null,
	fee_name varchar(100),
	price int,
	factor numeric(5, 2),
	constraint pk_receipt_detail primary key (id)
);


create table if not exists payslip(
	id uuid default uuid_generate_v4(),
	staff_id uuid,
	date date not null default CURRENT_DATE,
	content text,
	total int,
	status varchar(20),
	constraint pk_payslip_id primary key (id)
);

create table if not exists notification(
	id uuid default uuid_generate_v4(),
	staff_id uuid,
	date date default current_date,
	title text,
	content text,
	attachment varchar(256),
	status varchar(20),
	constraint pk_notification_id primary key (id)
);

create table if not exists absence(
	id uuid default uuid_generate_v4(),
	staff_id uuid,
	approver_id uuid default null,
	date date,
	reason text,
	status varchar(20),
	note text,
	constraint pk_absence_id primary key (id)
);

create table if not exists shift(
	id uuid default uuid_generate_v4(),
	staff_id uuid not null,
	area_id uuid not null,
	date date,
	description text,
	shift smallint,
	constraint pk_shift primary key (id)
);

create table if not exists device(
	id uuid default uuid_generate_v4(),
	name varchar(100),
	description text,
	constraint pk_device_id primary key (id)
);

create table if not exists device_arrange(
	id uuid default uuid_generate_v4(),
	device_id uuid not null,
	area_id uuid not null,
	quantity smallint,
	constraint pk_device_arrange primary key (id)
);

create table if not exists maintenance(
	id uuid default uuid_generate_v4(),
	staff_id uuid not null,
	device_id uuid not null,
	area_id uuid not null,
	date date,
	constraint pk_maintenance primary key (id)
);

create table if not exists water_index(
	id uuid default uuid_generate_v4(),
	apartment_id uuid not null,
	date date not null,
	start_index numeric(5), -- just 5 numbers
	end_index numeric(5),
	usage_amount numeric(5) generated always as (end_index - start_index) stored,
	status varchar(20),
	constraint pk_water_index primary key (id)
);
