--View thông tin gửi xe
create or replace view view_vehicle as
select vehicle_parking_registration.id, plate_number, apartment_number, block_number,
identity_card_number,vehicle_parking_registration.type,status,parking_no,apartment_id,
start_date, cancellation_date
from vehicle_parking_registration,apartment
where apartment_id = apartment.id
order by apartment_number;

--View thông tin nhân viên
create or replace view view_staff as
select result.id,name,phone,email,position_name,
position_id,salary,status,department_name,department_id,
account.id as account_id, account.username as account_name
from(
select staff.id as id,staff.name as name,phone,email,job_position.name as position_name,
position_id,salary,status,department.name as department_name,department_id,account_id
from staff,department,job_position
where department_id=department.id and job_position.id = position_id 
order by department.name
) as result left join account
on account.id =account_id;

--View thông tin bố trí thiết bị kỹ thuật
create or replace view view_device_arrange as
select device_arrange.id ,device.id as device_id, name as device_name,
area_id,building,location,quantity
from device, device_arrange,area
where area_id=area.id and device_id=device.id
order by name;

--View đơn nghỉ phép
create or replace view view_absence as 
select 
  result.id as id, 
  staff_name, 
  date, 
  reason, 
  staff.name as approver_name, 
  result.status, 
  department_name, 
  result.department_id 
from 
  staff 
  right join(
    select 
      absence.id as id, 
      staff.name as staff_name, 
      date, 
      reason, 
      absence.status, 
      approver_id, 
      department.name as department_name, 
      department_id 
    from 
      staff, 
      absence, 
      department, 
      job_position 
    where 
      staff.id = staff_id 
      and department.id = department_id 
      and position_id = job_position.id 
    order by 
      date desc
  ) as result on result.approver_id = staff.id
  order by date desc, staff_name, department_name, status;

--View thông tin sự kiện
create or replace view view_event as
select result.id,apartment_number,block_number,result.name as name,
date, start_time,end_time,result.status,staff.name as staff_name,apartment_id,note
from staff right join
(select event.id as id,apartment_number,block_number,name,apartment_id,
 date, start_time,end_time,status,approver_id,event.note
from apartment, event
where apartment_id = apartment.id
) as result
on result.approver_id = staff.id
order by date desc;

--View thông tin ca trực
create or replace view view_shift as
select shift.id,staff.name as staff_name,staff_id,department.name as department_name,
building,location,date,description, shift,area_id
from shift, area, staff, department,job_position
where staff_id=staff.id and area_id = area.id and department_id=department.id
and job_position.id = position_id
order by date desc;

--View thông tin sửa chữa
create or replace view view_repair as
select result.id,apartment_number,block_number,name as staff_name,staff_id,
date, content, rate, result.status,apartment_id
from staff right join
(select repair_info.id,apartment_number, block_number, staff_id,
date, content, rate, repair_info.status,apartment_id
from  repair_info, apartment
where apartment_id=apartment.id) as result 
on staff_id=staff.id
order by date desc;

--View thông tin phản ánh
create or replace view view_reflect as
select reflect_info.id,department.id as department_id ,department.name as department_name, 
apartment_number,block_number,date, title, content, answer, reflect_info.status,apartment_id
from reflect_info, apartment, department
where apartment_id=apartment.id and department_id = department.id
order by date desc;

--View phân quyền
create or replace view view_role_privilege
as
select role_id,privilege_id,code as privilege_code, action, table_name
from role_privilege, privilege
where role_privilege.privilege_id = privilege.id;

--View phiếu chi
create or replace view view_payslip as
select payslip.id,staff_id, date, content,
total,payslip.status,name as staff_name
from payslip, staff
where staff_id = staff.id
order by payslip.date desc;

--View thông báo
create or replace view view_notification as
select notification.id,staff_id, date,
title,content,attachment,notification.status,staff.name as staff_name
from notification,staff
where staff.id = staff_id
order by notification.date desc;


-- View chỉ số nước
create or replace view view_water_index as
select 
	wi.id,
	wi.date, 
	wi.apartment_id, 
	wi.start_index, 
	wi.end_index, 
	wi.usage_amount, 
	a.block_number,
	a.apartment_number,
	wi.status
from 
	water_index wi, 
	apartment a
where wi.apartment_id = a.id
order by wi.date desc, a.block_number, a.apartment_number;

-- View phiếu thu
create or replace view view_receipt as
select receipt.id,apartment_number, block_number,apartment_id,
date,content,total,receipt.status,staff.name as staff_name
from receipt,apartment,staff
where apartment_id = apartment.id and staff_id=staff.id
order by date desc;

-- View chi tiết phiếu thu
create or replace view view_receipt_detail as
select receipt_id,fee_name, price,factor
from receipt_detail,receipt
where receipt.id = receipt_id 
order by receipt_id desc;

-- view nhân viên ca trực
create or replace view view_shift_staff as
select id, name
from staff
where position_id in (
select id
from job_position
where department_id in(
select id
from department 
where name in ('Bộ phận vệ sinh','Bộ phận an ninh')));

-- view nhân viên kỹ thuật
create or replace view view_technique_staff as
select id, name
from staff
where position_id in (
select id
from job_position
where department_id in(
select id
from department 
where name = 'Phòng kỹ thuật'));

-- view account
create or replace view view_account as
select 
  account.id, 
  account.username, 
  account.password, 
  account.role_id, 
  role.name as role_name, 
  account.type,
  created_at,
  updated_at
from account, role
where account.role_id = role.id
order by updated_at, username;

-- view bảo trì thiết bị
create or replace view view_maintenance as
select maintenance.id, staff_id,staff.name as staff_name,device_id,device.name as device_name,
area_id, building,location,date
from staff,device,area,maintenance
where staff_id = staff.id and device.id = device_id 
and area_id =area.id
order by date desc;

-- view available_account
create or replace view view_available_account as
select 
  account.id, 
  account.username, 
  account.password, 
  account.role_id, 
  role.name as role_name, 
  account.type,
  created_at,
  updated_at
from account, role
where account.role_id = role.id and account.id not in (
	select account_id
	from staff
	where account_id is not null
	union
	select account_id
	from apartment
	where account_id is not null
)
order by updated_at, username;


-- view apartment
create or replace view view_apartment as
select 
	apartment.id,
	apartment_number,
	block_number,
	account_id,
	host,
	phone,
	email,
	floor_area,
	apartment.type,
	note,
	account.username as account_name
from apartment
left join account on account.id = apartment.account_id;
