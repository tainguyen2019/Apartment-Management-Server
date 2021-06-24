-- Căn hộ A101: 32b5fe6e-cbf3-41f5-a334-fc3e0a1badde
-- Phí quản lý
select fee.name as fee_name, floor_area as factor,amount as price
from apartment,fee
where fee.name='Phí quản lý' and apartment.id='32b5fe6e-cbf3-41f5-a334-fc3e0a1badde'
union
select fee.name as fee_name, count(*) as factor,amount as price
from vehicle_parking_registration,fee
where type='Xe máy' and fee.name='Phí gửi xe máy theo tháng'
and apartment_id='32b5fe6e-cbf3-41f5-a334-fc3e0a1badde'
and (status='Đang gửi'
and extract(year from start_date) = 2021 and extract(month from start_date) <= 6)
or (status='Đã hủy'
and extract(year from cancellation_date) = 2021 and extract(month from cancellation_date) >= 6)
group by name,amount
union
select fee.name as fee_name, count(*) as factor,amount as price
from vehicle_parking_registration,fee
where type='Ô tô' and fee.name='Phí gửi ô tô theo tháng'
and apartment_id='32b5fe6e-cbf3-41f5-a334-fc3e0a1badde'
and (status='Đang gửi'
and extract(year from start_date) = 2021 and extract(month from start_date) <= 6)
or (status='Đã hủy'
and extract(year from cancellation_date) = 2021 and extract(month from cancellation_date) >= 6)
group by name,amount
union
select fee.name as fee_name, count(*) as factor,amount as price
from event,fee
where fee.name='Phí tổ chức sự kiện'
and status='Đã phê duyệt' and apartment_id = '32b5fe6e-cbf3-41f5-a334-fc3e0a1badde'
and extract(year from date) = 2021 and extract(month from date) = 6
group by fee.name,amount
union
select fee.name as fee_name, usage_amount as factor,amount as price
from water_index,fee
where fee.name='Tiền nước'
and status='Đã chốt' and apartment_id = '32b5fe6e-cbf3-41f5-a334-fc3e0a1badde'
and extract(year from date) = 2021 and extract(month from date) = 6
