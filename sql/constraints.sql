-- apartment
alter table apartment
add constraint fk_apartment_account_account_id foreign key (account_id) references account(id) on delete restrict, 
add constraint unique_block_number_apartment_number unique(block_number, apartment_number);

-- staff
alter table staff 
add constraint fk_staff_account_account_id foreign key (account_id) references account(id) on delete restrict,
add constraint fk_staff_position_position_id foreign key (position_id) references job_position(id) on delete restrict;

-- job_position
alter table job_position 
add constraint fk_job_position_department_id foreign key (department_id) references department(id) on delete restrict;

-- role_privilege
alter table role_privilege
add constraint fk_role_privilege_role_role_id foreign key (role_id) references role(id) on delete restrict,
add constraint fk_role_privilege_privilege_privilege_id foreign key (privilege_id) references privilege(id) on delete restrict;

-- account
alter table account
add constraint unique_username unique(username),
add constraint fk_account_role_role_id foreign key (role_id) references role(id) on delete restrict;

-- event
alter table event 
add constraint fk_event_apartment_apartment_id foreign key (apartment_id) references apartment(id),
add constraint fk_event_staff_staff_id foreign key (approver_id) references staff(id);

-- repair info
alter table repair_info 
add constraint fk_repair_info_staff_staff_id foreign key (staff_id) references staff(id),
add constraint fk_repair_info_apartment_apartment_id foreign key (apartment_id) references apartment(id),
add constraint unique_apartment_id_date unique(apartment_id,date);

-- reflect_info
alter table reflect_info 
add constraint fk_reflect_info_department_department_id foreign key (department_id) references department(id),
add constraint fk_reflect_info_apartment_apartment_id foreign key (apartment_id) references apartment(id);

-- vehicle_parking_registration
alter table vehicle_parking_registration 
add constraint fk_vehicle_parking_registration_apartment_apartment_id foreign key (apartment_id) references apartment(id),
add constraint fk_vehicle_parking_registration_staff_approver_id foreign key (approver_id) references staff(id) on delete restrict,
add constraint unique_vehicle_parking_no unique(parking_no);

-- receipt
alter table receipt 
add constraint fk_receipt_staff_apartment_id foreign key (apartment_id) references apartment(id),
add constraint fk_receipt_staff_staff_id foreign key (staff_id) references staff(id);

-- receipt_detail
alter table receipt_detail 
add constraint fk_receipt_detail_receipt_receipt_id foreign key (receipt_id) references receipt(id);

-- payslip
alter table payslip add constraint fk_payment_staff_staff_id foreign key (staff_id) references staff(id);

-- notification
alter table notification 
add constraint fk_notification_staff_staff_id foreign key (staff_id) references staff(id);

-- absence
alter table absence 
add constraint fk_absence_staff_staff_id foreign key (staff_id) references staff(id),
add constraint fk_absence_staff_approver_id foreign key (approver_id) references staff(id),
add constraint unique_staff_id_date unique(staff_id,date);

-- shift
alter table shift 
add constraint fk_shift_staff_staff_id foreign key (staff_id) references staff(id),
add constraint fk_shift_area_area_id foreign key (area_id) references area(id);

-- device_arrange
alter table device_arrange 
add constraint fk_device_arrange_device_device_id foreign key (device_id) references device(id),
add constraint fk_device_arrange_area_area_id foreign key (area_id) references area(id);

-- maintenance
alter table maintenance 
add constraint fk_maintenance_staff_staff_id foreign key (staff_id) references staff(id),
add constraint fk_maintenance_device_device_id foreign key (device_id) references device(id),
add constraint fk_maintenance_area_area_id foreign key (area_id) references area(id);

-- water_index
alter table water_index 
add constraint fk_water_index_apartment_apartment_id foreign key (apartment_id) references apartment(id),
add constraint unique_water_index_apartment_id_date unique(apartment_id, date);
