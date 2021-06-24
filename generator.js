/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
const uuid = require('uuid');

const generatePrivilegeValues = () => {
  const ACTIONS = ['READ', 'CREATE', 'WRITE', 'DELETE', 'APPROVE'];
  const TABLES = [
    'apartment',
    'staff',
    'department',
    'fee',
    'area',
    'role',
    'account',
    'event',
    'repair_info',
    'reflect_info',
    'vehicle',
    'receipt',
    'receipt_detail',
    'payslip',
    'notification',
    'absence',
    'shift',
    'device',
    'device_arrange',
    'maintenance',
    'water_index',
  ];

  const values = TABLES.map((table) => {
    return ACTIONS.map((action) => {
      const id = uuid.v4();
      const description = `${action} ${table}`.toLowerCase();
      const code = `${action}_${table}`.toUpperCase();
      return `('${id}', '${table}', '${action}', '${description}', '${code}')`;
    });
  });

  console.log(`
insert into privilege(id, table_name, action, description, code)
values
${values.flat().join(',\n')};
`);
};

const generateRoleValues = () => {
  const ROLES = [
    'Điều hành BQL',
    'Tổ trưởng kỹ thuật',
    'Nhân viên kỹ thuật',
    'Tổ trưởng vệ sinh',
    'Nhân viên vệ sinh',
    'Tổ trưởng an ninh',
    'Nhân viên an ninh',
    'Lễ tân',
    'Kế toán',
    'Nhân viên cảnh quan',
    'Trưởng BQT',
    'Phó BQT',
    'Thành viên BQT',
    'Căn hộ',
  ];
  const values = ROLES.map((role) => {
    const id = uuid.v4();
    return `('${id}', '${role}')`;
  });
  console.log(`
insert into role(id, name)
values
${values.flat().join(',\n')};
  `);
};

const generateUUIDs = (total) => {
  const ids = new Array(total).fill('').map(() => `'${uuid.v4()}'`);
  console.log(ids.join(',\n'));
};

// 137 users
// generateUUIDs(137);

// 108 apartments
// generateUUIDs(108);

// 29 staffs
// generateUUIDs(29);

// 8 departments
// generateUUIDs(8);

// 6 events
// generateUUIDs(6);

// 108 receipts
// generateUUIDs(108);

// 5 fees
// generateUUIDs(5);

// 5 payslip
// generateUUIDs(5);

// 8 areas
// generateUUIDs(8);

// 8 devices
// generateUUIDs(8);

// generateRoleValues();
// generatePrivilegeValues();
