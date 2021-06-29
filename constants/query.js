const generateDetailReceiptQuery = `select fee.name as fee_name, floor_area as factor,amount as price
from apartment,fee
where code='MANAGE_FEE' and apartment.id=$1
union
select fee.name as fee_name, count(*) as factor,amount as price
from vehicle_parking_registration,fee
where type='Xe máy' and code='MOTO_PARKING_FEE'
and apartment_id=$2
and ((status='Đang gửi'
and extract(year from start_date) = $3 and extract(month from start_date) < $4)
or (status='Đã hủy'
and extract(year from cancellation_date) = $5 and extract(month from cancellation_date) > $6))
group by name,amount
union
select fee.name as fee_name, count(*) as factor,amount as price
from vehicle_parking_registration,fee
where type='Ô tô' and code='CAR_PARKING_FEE'
and apartment_id=$7
and ((status='Đang gửi'
and extract(year from start_date) = $8 and extract(month from start_date) < $9)
or (status='Đã hủy'
and extract(year from cancellation_date) = $10 and extract(month from cancellation_date) > $11))
group by name,amount
union
select fee.name as fee_name, count(*) as factor,amount as price
from event,fee
where code='EVENT_FEE'
and status='Đã phê duyệt' and apartment_id = $12
and extract(year from date) = $13 and extract(month from date) = $14
group by fee.name,amount
union
select fee.name as fee_name, usage_amount as factor,amount as price
from water_index,fee
where fee.code='WATER_FEE'
and status='Đã chốt' and apartment_id = $15
and extract(year from date) = $16 and extract(month from date) = $17
`;

module.exports = {
  generateDetailReceiptQuery,
};
